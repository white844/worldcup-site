/**
 * useMatchSchedule — pure front-end schedule engine
 *
 * Responsibilities:
 *  - Track current time (updates every 60 s)
 *  - Filter out matches whose date has passed (end-of-day UTC)
 *  - Sort remaining matches: soonest-date group first, then by original order
 *  - Identify the "next" match date group (first upcoming date)
 *  - Track recently-expired IDs for smooth exit animation
 *  - Emit ARIA announcements when matches expire or the next group changes
 *
 * NEW (non-breaking additions):
 *  - isStartingSoon(match, nowMs)   — true when kickoff is within 24 h
 *  - startingSoonIds                — Set of IDs kicking off within 24 h
 *  - dateGroups                     — liveMatches grouped by isoDate with labels
 *  - kickoffCountdown(match, nowMs) — "Starts in 5h 20m" string
 *
 * All comparisons are UTC-midnight boundaries so every user worldwide
 * sees the same expiry cutoff for a given match date.
 */
import { useState, useEffect, useRef, useMemo } from "react";

// ─── Date helpers ─────────────────────────────────────────────────────────────

/** "2026-06-11" → UTC midnight timestamp */
export function matchDayUTC(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Match is past when next UTC day has started (visible all day on match day) */
export function isMatchPast(isoDate, nowMs) {
  return nowMs >= matchDayUTC(isoDate) + 86_400_000;
}

// ─── NEW: Starting-soon helpers ───────────────────────────────────────────────

/** "HH:MM" UTC → ms offset from midnight */
function parseKickoffMs(timeStr) {
  const [hh, mm] = timeStr.split(":").map(Number);
  return (hh * 60 + mm) * 60_000;
}

/** Exact UTC kickoff timestamp for a match object */
export function kickoffUTC(isoDate, time) {
  return matchDayUTC(isoDate) + parseKickoffMs(time);
}

/** True when kickoff is strictly in the future AND within 24 h */
export function isStartingSoon(match, nowMs) {
  const kickoff = kickoffUTC(match.isoDate, match.time);
  const diffMs  = kickoff - nowMs;
  return diffMs > 0 && diffMs <= 86_400_000;
}

// ─── NEW: Countdown formatter ─────────────────────────────────────────────────

/**
 * Human-readable countdown to kickoff.
 *
 * "Starts in 5h 20m"  — > 1 h away
 * "Starts in 45m"     — < 1 h away
 * "Starts in 30s"     — < 1 min away
 * "Starting now"      — within 30 s of kickoff
 * null                — match is finished, live, kickoff already passed
 *                        without status confirmation, or > 7 days away
 */
export function kickoffCountdown(match, nowMs) {
  // Trust real match status over the clock when we have it: a match
  // that the API confirms is FINISHED should never show "In progress",
  // and one that's still SCHEDULED shouldn't either, even if its listed
  // kickoff time has technically elapsed (stale/placeholder schedule data).
  if (match.isFinished)    return null;
  if (match.isLive)        return null;
  if (match._likelyLive)   return null;

  const kickoff = kickoffUTC(match.isoDate, match.time);
  const diffMs  = kickoff - nowMs;

  if (diffMs <= 0) {
    // Kickoff time has passed but we have no live/finished confirmation
    // (e.g. static fallback data with an imprecise time). Don't claim
    // the match is "in progress" — just stop showing a countdown.
    return null;
  }
  if (diffMs > 7 * 86_400_000)     return null;

  const totalSecs = Math.floor(diffMs / 1_000);
  const secs      = totalSecs % 60;
  const mins      = Math.floor(totalSecs / 60) % 60;
  const hours     = Math.floor(totalSecs / 3_600);

  if (totalSecs <= 30)  return "Starting now";
  if (totalSecs < 60)   return `Starts in ${secs}s`;
  if (hours === 0)      return `Starts in ${mins}m`;
  if (mins  === 0)      return `Starts in ${hours}h`;
  return `Starts in ${hours}h ${mins}m`;
}

// ─── NEW: Date-grouping helper ────────────────────────────────────────────────

/**
 * Groups a sorted match array by isoDate.
 * First group is always labelled "Next Matches".
 * Subsequent groups: "Today" | "Tomorrow" | "Wed, Jun 11".
 *
 * @param {object[]} sortedMatches — already sorted soonest-first
 * @param {number}   nowMs
 * @returns {{ isoDate, label, isFirst, matches }[]}
 */
export function groupMatchesByDate(sortedMatches, nowMs) {
  const map = new Map();
  for (const m of sortedMatches) {
    if (!map.has(m.isoDate)) map.set(m.isoDate, []);
    map.get(m.isoDate).push(m);
  }

  const todayIso = new Date(nowMs).toISOString().slice(0, 10);
  const todayMs  = matchDayUTC(todayIso);
  let isFirst    = true;
  const groups   = [];

  for (const [isoDate, matches] of map) {
    const dayMs    = matchDayUTC(isoDate);
    const diffDays = Math.round((dayMs - todayMs) / 86_400_000);

    let label;
    if (isFirst)              label = "Next Matches";
    else if (diffDays === 0)  label = "Today";
    else if (diffDays === 1)  label = "Tomorrow";
    else {
      const d = new Date(isoDate + "T12:00:00Z");
      label = d.toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric", timeZone: "UTC",
      });
    }

    groups.push({ isoDate, label, isFirst, matches });
    isFirst = false;
  }

  return groups;
}

// ─── Core hook ────────────────────────────────────────────────────────────────

export function useMatchSchedule(allMatches) {
  const [nowMs, setNowMs]           = useState(() => Date.now());
  const [expiredIds, setExpiredIds] = useState(new Set());
  const prevLiveRef  = useRef(null);
  const prevNextRef  = useRef(null);
  const prevSoonRef  = useRef(null);
  const ariaRef      = useRef(null);

  // ── Clock — tick every 60 s ────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  // ── Compute live / upcoming / starting-soon / groups ──────────────────────
  const { liveMatches, nextIsoDate, startingSoonIds, dateGroups } = useMemo(() => {
    const live = allMatches.filter(m => !m.isFinished && !isMatchPast(m.isoDate, nowMs));

    // A match is "likely live" when:
    //  - Its kickoff time has passed but the match day hasn't ended and
    //    it isn't confirmed finished — covers the static-fallback case
    //    where the API key is missing/wrong and isLive is always false.
    //  - We assume a match lasts at most 130 min (90 + ET + injury time).
    // Computed as a Set of IDs — never mutate the original match objects
    // since they're shared references from allMatches / ALL_MATCHES.
    const MATCH_DURATION_MS = 130 * 60_000;
    const likelyLiveIds = new Set(
      live
        .filter(m => !m.isLive && !m.isFinished && m.isoDate && m.time)
        .filter(m => {
          const elapsed = nowMs - kickoffUTC(m.isoDate, m.time);
          return elapsed >= 0 && elapsed < MATCH_DURATION_MS;
        })
        .map(m => m.id)
    );

    // Build a new array of plain objects with _likelyLive injected,
    // so downstream consumers (MatchCard, Marketplace) can read it
    // without us touching the original data.
    const liveWithFlags = live.map(m =>
      likelyLiveIds.has(m.id) ? { ...m, _likelyLive: true } : m
    );

    // Starting-soon set (kickoff strictly in the future, within 24 h)
    const soonIds = new Set(
      liveWithFlags.filter(m => isStartingSoon(m, nowMs)).map(m => m.id)
    );

    // Sort: confirmed-live first, then likely-live, then starting-soon, then soonest date
    liveWithFlags.sort((a, b) => {
      const aLive = a.isLive ? 0 : (a._likelyLive ? 1 : 2);
      const bLive = b.isLive ? 0 : (b._likelyLive ? 1 : 2);
      if (aLive !== bLive) return aLive - bLive;
      const aSoon = soonIds.has(a.id) ? 0 : 1;
      const bSoon = soonIds.has(b.id) ? 0 : 1;
      if (aSoon !== bSoon) return aSoon - bSoon;
      const diff = matchDayUTC(a.isoDate) - matchDayUTC(b.isoDate);
      return diff !== 0 ? diff : a.id.localeCompare(b.id);
    });

    const next   = liveWithFlags.length > 0 ? liveWithFlags[0].isoDate : null;
    const groups = groupMatchesByDate(liveWithFlags, nowMs);

    return {
      liveMatches:     liveWithFlags,
      nextIsoDate:     next,
      startingSoonIds: soonIds,
      dateGroups:      groups,
    };
  }, [allMatches, nowMs]);

  // ── Detect newly-expired matches & announce ────────────────────────────────
  useEffect(() => {
    const prevIds = prevLiveRef.current;
    if (prevIds === null) {
      prevLiveRef.current = new Set(liveMatches.map(m => m.id));
      return;
    }

    const currentIds   = new Set(liveMatches.map(m => m.id));
    const newlyExpired = [...prevIds].filter(id => !currentIds.has(id));

    if (newlyExpired.length > 0) {
      setExpiredIds(prev => {
        const next = new Set(prev);
        newlyExpired.forEach(id => next.add(id));
        return next;
      });

      announce(
        ariaRef,
        `${newlyExpired.length} match${newlyExpired.length > 1 ? "es have" : " has"} ended and been removed from the listings.`
      );

      setTimeout(() => {
        setExpiredIds(prev => {
          const next = new Set(prev);
          newlyExpired.forEach(id => next.delete(id));
          return next;
        });
      }, 700);
    }

    prevLiveRef.current = currentIds;
  }, [liveMatches]);

  // ── Announce next-match group changes ─────────────────────────────────────
  useEffect(() => {
    if (prevNextRef.current !== null && prevNextRef.current !== nextIsoDate && nextIsoDate) {
      announce(ariaRef, `The next upcoming matches are now on ${formatIso(nextIsoDate)}.`);
    }
    prevNextRef.current = nextIsoDate;
  }, [nextIsoDate]);

  // ── Announce starting-soon changes ────────────────────────────────────────
  useEffect(() => {
    if (prevSoonRef.current === null) {
      prevSoonRef.current = startingSoonIds;
      return;
    }
    const newSoon = [...startingSoonIds].filter(id => !prevSoonRef.current.has(id));
    if (newSoon.length > 0) {
      announce(
        ariaRef,
        `${newSoon.length} match${newSoon.length > 1 ? "es are" : " is"} starting within the next 24 hours.`
      );
    }
    prevSoonRef.current = startingSoonIds;
  }, [startingSoonIds]);

  return {
    // Existing — unchanged
    liveMatches,
    nextIsoDate,
    expiredIds,
    nowMs,
    ariaRef,
    // New
    startingSoonIds,
    dateGroups,
  };
}

// ─── Private helpers ──────────────────────────────────────────────────────────

function announce(ref, message) {
  if (!ref.current) return;
  ref.current.textContent = "";
  requestAnimationFrame(() => {
    if (ref.current) ref.current.textContent = message;
  });
}

function formatIso(iso) {
  const d = new Date(iso + "T12:00:00Z");
  return d.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", timeZone: "UTC",
  });
}
