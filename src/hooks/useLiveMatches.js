/**
 * useLiveMatches — Real fixture data via football-data.org
 *
 * Setup:
 *  1. Register free at https://www.football-data.org/client/register
 *  2. Replace YOUR_API_KEY_HERE below with your key
 *  3. The free tier gives fixtures, results, and live scores
 *
 * Behaviour:
 *  - With a valid key: fetches real WC2026 fixtures, refreshes every 60 s,
 *    shows LIVE badges with real scores
 *  - Without a key (or on error): falls back to static wc26Schedule.js silently
 *  - The ticket inventory (listings) stays separate — only the schedule feeds from the API
 *  - Last successful API response is cached in localStorage so real data survives
 *    a hard reload without burning an extra request
 *
 * Returns the same shape as ALL_MATCHES so callers need zero changes.
 *
 * NOTE on free-tier score data:
 *  football-data.org v4 free tier does NOT stream running minute-by-minute scores.
 *  During a live match, the API only provides the half-time snapshot in score.halfTime.
 *  score.regularTime does not exist in v4. The running total only appears in
 *  score.fullTime once the match is FINISHED. So during live play we show the
 *  last known score (half-time) with an "HT" label rather than showing nothing.
 *  To get true running scores, upgrade to a paid tier or use API-Football.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { ALL_MATCHES } from "../data/listingsData.js";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_KEY    = import.meta.env.VITE_FOOTBALL_API_KEY ?? "";
const API_BASE   = "https://api.football-data.org/v4";
// Use the competition CODE "WC" — more stable than a numeric ID which can
// differ between WC editions and may not be assigned yet on the free tier.
const WC_CODE    = "WC";
const REFRESH_MS = 60_000;
const CACHE_KEY  = "wc26_live_cache";
const HAS_KEY    = typeof API_KEY === "string" && API_KEY.length > 8 && API_KEY !== "YOUR_API_KEY_HERE";

// ─── Status constants ─────────────────────────────────────────────────────────
export const MATCH_STATUS = {
  SCHEDULED:   "SCHEDULED",
  TIMED:       "TIMED",
  IN_PLAY:     "IN_PLAY",
  PAUSED:      "PAUSED",
  EXTRA_TIME:  "EXTRA_TIME",
  PENALTY:     "PENALTY_SHOOTOUT",
  FINISHED:    "FINISHED",
  POSTPONED:   "POSTPONED",
  SUSPENDED:   "SUSPENDED",
  CANCELLED:   "CANCELLED",
};

const LIVE_STATUSES = new Set([
  MATCH_STATUS.IN_PLAY,
  MATCH_STATUS.PAUSED,
  MATCH_STATUS.EXTRA_TIME,
  MATCH_STATUS.PENALTY,
]);

// ─── localStorage cache helpers ───────────────────────────────────────────────
const CACHE_MAX_AGE_MS = 90_000; // 90 seconds — survives a reload, won't serve yesterday's data

function readCache() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw); // { matches: [...], fetchedAt: ISO string }
    const age = Date.now() - new Date(parsed.fetchedAt).getTime();
    if (age > CACHE_MAX_AGE_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(matches) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ matches, fetchedAt: new Date().toISOString() }));
  } catch {
    // Storage quota exceeded or unavailable — not critical
  }
}

// ─── Transform API response → our internal match shape ───────────────────────
function transformApiMatch(apiMatch, staticMatch) {
  const isLive     = LIVE_STATUSES.has(apiMatch.status);
  const isFinished = apiMatch.status === MATCH_STATUS.FINISHED;

  const score = apiMatch.score ?? {};

  // v4 free tier score fields:
  //   score.halfTime   — score at half-time (available during 2nd half and after FT)
  //   score.fullTime   — final score (null during the match, populated on FINISHED)
  //   score.regularTime — does NOT exist in v4; was a v2/v3 field
  //
  // During live play the best we can show is the half-time snapshot.
  // We tag it as isHalfTimeScore so the UI can show "HT" instead of a minute.
  const htHome = score.halfTime?.home ?? null;
  const htAway = score.halfTime?.away ?? null;
  const ftHome = score.fullTime?.home ?? null;
  const ftAway = score.fullTime?.away ?? null;

  let liveHome = null;
  let liveAway = null;
  let isHalfTimeScore = false;

  if (isLive) {
    // Best available on free tier during play is the HT score.
    // If somehow fullTime is already populated (extra time etc.) prefer it.
    if (ftHome != null) {
      liveHome = ftHome;
      liveAway = ftAway;
    } else if (htHome != null) {
      liveHome = htHome;
      liveAway = htAway;
      isHalfTimeScore = true;
    }
  } else if (isFinished) {
    liveHome = ftHome;
    liveAway = ftAway;
  }

  const minute = apiMatch.minute ?? null;

  // Parse UTC date from API — guard against bad/missing utcDate strings
  let isoDate = staticMatch?.isoDate ?? null;
  let time     = staticMatch?.time ?? null;
  if (apiMatch.utcDate) {
    const apiDate = new Date(apiMatch.utcDate);
    if (!isNaN(apiDate.getTime())) {
      isoDate = apiDate.toISOString().slice(0, 10);
      time    = `${String(apiDate.getUTCHours()).padStart(2, "0")}:${String(apiDate.getUTCMinutes()).padStart(2, "0")}`;
    }
  }

  return {
    // Spread the static match data as base (prices, sellers, seats, etc.)
    ...(staticMatch ?? {}),
    // Override schedule fields with live API data
    isoDate,
    time,
    isLive,
    isFinished,
    isHalfTimeScore,
    liveScore: (isLive || isFinished) && liveHome != null
      ? { home: liveHome, away: liveAway, minute }
      : null,
    apiStatus: apiMatch.status,
    // Keep static id if we matched it
    id: staticMatch?.id ?? `api_${apiMatch.id}`,
  };
}

// ─── Match static listing to API match by home/away team name ─────────────────
function normalise(str) {
  return (str ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

// Explicit alias map handles the most common API↔static name mismatches.
// Add entries here rather than widening the fuzzy logic (which risks false positives).
const TEAM_ALIASES = {
  "united states":    ["usa", "united states of america"],
  "south korea":      ["korea republic", "korea rep."],
  "ivory coast":      ["côte d'ivoire", "cote d'ivoire"],
  "iran":             ["ir iran"],
  "czechia":          ["czech republic"],
  "north macedonia":  ["macedonia"],
  "trinidad & tobago":["trinidad and tobago"],
};

function teamNamesMatch(apiName, staticName) {
  const a = normalise(apiName);
  const s = normalise(staticName);
  if (!a || !s) return false;
  if (a === s) return true;

  // Check alias map (both directions)
  const aAliases = TEAM_ALIASES[a] ?? [];
  if (aAliases.includes(s)) return true;
  const sAliases = TEAM_ALIASES[s] ?? [];
  if (sAliases.includes(a)) return true;

  // One contains the other (e.g. "United States" vs "USA" not in alias yet)
  if (a.length >= 4 && s.includes(a)) return true;
  if (s.length >= 4 && a.includes(s)) return true;

  return false;
}

function findStaticMatch(apiMatch) {
  const apiHome = apiMatch.homeTeam?.name ?? "";
  const apiAway = apiMatch.awayTeam?.name ?? "";

  return ALL_MATCHES.find(m =>
    teamNamesMatch(apiHome, m.homeRaw ?? "") &&
    teamNamesMatch(apiAway, m.awayRaw ?? "")
  ) ?? null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useLiveMatches() {
  // Initialise from localStorage cache so real data shows immediately on reload
  const cached = readCache();
  const [matches, setMatches]         = useState(cached?.matches ?? ALL_MATCHES);
  const [loading, setLoading]         = useState(HAS_KEY);
  const [error, setError]             = useState(null);
  const [lastUpdated, setLastUpdated] = useState(cached ? new Date(cached.fetchedAt) : null);
  const [usingLive, setUsingLive]     = useState(false); // only true after a fresh successful fetch
  const timerRef                      = useRef(null);

  const fetchMatches = useCallback(async () => {
    if (!HAS_KEY) return;

    try {
      const res = await fetch(
        `${API_BASE}/competitions/${WC_CODE}/matches`,
        { headers: { "X-Auth-Token": API_KEY } }
      );

      if (!res.ok) {
        throw new Error(`API error ${res.status}: ${res.statusText}`);
      }

      const data       = await res.json();
      const apiMatches = data.matches ?? [];

      if (apiMatches.length === 0) {
        throw new Error("API returned no matches — falling back to static data");
      }

      // Merge API matches with our static listings (prices, sellers, seats)
      const merged = apiMatches.map(apiMatch => {
        const staticMatch = findStaticMatch(apiMatch);
        return transformApiMatch(apiMatch, staticMatch);
      });

      // Include any static matches not returned by the API yet (TBD knockout rounds)
      const apiIds     = new Set(merged.map(m => m.id));
      const staticOnly = ALL_MATCHES.filter(m => !apiIds.has(m.id));
      const combined   = [...merged, ...staticOnly];

      setMatches(combined);
      setUsingLive(true);
      setLastUpdated(new Date());
      setError(null);
      writeCache(combined);
    } catch (err) {
      console.warn("[useLiveMatches] Falling back to static data:", err.message);
      setError(err.message);
      setUsingLive(false);
      // Only reset to static if we have no cached data to show
      if (!readCache()) {
        setMatches(ALL_MATCHES);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    if (HAS_KEY) {
      timerRef.current = setInterval(fetchMatches, REFRESH_MS);
    }
    return () => clearInterval(timerRef.current);
  }, [fetchMatches]);

  return {
    matches,      // same shape as ALL_MATCHES
    loading,      // true only on first load when API key is present
    error,        // null when OK or using fallback
    usingLive,    // true when live API data is active
    lastUpdated,  // Date object of last successful API fetch
    refetch: fetchMatches,
  };
}
