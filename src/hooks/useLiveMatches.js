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
 *
 * Returns the same shape as ALL_MATCHES so callers need zero changes.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { WC26_ALL_FIXTURES, WC26_FLAGS, WC26_VENUES } from "../data/wc26Schedule.js";
import { ALL_MATCHES } from "../data/listingsData.js";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// API key must be set in .env as VITE_FOOTBALL_API_KEY (see .env.example)
const API_KEY        = import.meta.env.VITE_FOOTBALL_API_KEY ?? "";
const API_BASE       = "https://api.football-data.org/v4";
const WC2026_ID      = 2000; // football-data.org competition ID for WC 2026
const REFRESH_MS     = 60_000;
const HAS_KEY        = typeof API_KEY === "string" && API_KEY.length > 8 && API_KEY !== "YOUR_API_KEY_HERE";

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

// ─── Transform API response → our internal match shape ───────────────────────
function transformApiMatch(apiMatch, staticMatch) {
  const isLive  = [
    MATCH_STATUS.IN_PLAY,
    MATCH_STATUS.PAUSED,
    MATCH_STATUS.EXTRA_TIME,
    MATCH_STATUS.PENALTY,
  ].includes(apiMatch.status);

  const isFinished = apiMatch.status === MATCH_STATUS.FINISHED;

  // Use regularTime/currentPeriod for live scores, fullTime for finished
  const score = apiMatch.score ?? {};
  const homeScore = score.fullTime?.home ?? null;
  const awayScore = score.fullTime?.away ?? null;
  const liveHome  = isLive
    ? (score.regularTime?.home ?? score.halfTime?.home ?? score.fullTime?.home ?? null)
    : homeScore;
  const liveAway  = isLive
    ? (score.regularTime?.away ?? score.halfTime?.away ?? score.fullTime?.away ?? null)
    : awayScore;
  const minute    = apiMatch.minute ?? null;

  // Parse UTC date from API
  const apiDate = apiMatch.utcDate ? new Date(apiMatch.utcDate) : null;
  const isoDate = apiDate ? apiDate.toISOString().slice(0, 10) : staticMatch?.isoDate;
  const time    = apiDate
    ? `${String(apiDate.getUTCHours()).padStart(2,"0")}:${String(apiDate.getUTCMinutes()).padStart(2,"0")}`
    : staticMatch?.time;

  return {
    // Spread the static match data as base (prices, sellers, seats, etc.)
    ...(staticMatch ?? {}),
    // Override schedule fields with live API data
    isoDate,
    time,
    isLive,
    isFinished,
    liveScore: isLive || isFinished
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

function teamNamesMatch(apiName, staticName) {
  const a = normalise(apiName);
  const s = normalise(staticName);
  if (!a || !s) return false;
  // Exact match first
  if (a === s) return true;
  // One contains the other (handles "United States" vs "USA" — covered by schedule but safe)
  if (a.length >= 4 && s.includes(a)) return true;
  if (s.length >= 4 && a.includes(s)) return true;
  // Prefix match with at least 5 chars (avoids "Oman"→"Romania" false positives)
  const minLen = Math.min(a.length, s.length);
  if (minLen >= 5 && a.slice(0, minLen) === s.slice(0, minLen)) return true;
  return false;
}

function findStaticMatch(apiMatch) {
  const apiHome = apiMatch.homeTeam?.name ?? "";
  const apiAway = apiMatch.awayTeam?.name ?? "";

  return ALL_MATCHES.find(m => {
    return teamNamesMatch(apiHome, m.homeRaw ?? "") &&
           teamNamesMatch(apiAway, m.awayRaw ?? "");
  }) ?? null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useLiveMatches() {
  const [matches, setMatches]     = useState(ALL_MATCHES);
  const [loading, setLoading]     = useState(HAS_KEY);
  const [error, setError]         = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [usingLive, setUsingLive] = useState(false);
  const timerRef                  = useRef(null);

  const fetchMatches = useCallback(async () => {
    if (!HAS_KEY) return; // silently use static data

    try {
      const res = await fetch(
        `${API_BASE}/competitions/${WC2026_ID}/matches`,
        { headers: { "X-Auth-Token": API_KEY } }
      );

      if (!res.ok) {
        throw new Error(`API error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
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
      const apiIds = new Set(merged.map(m => m.id));
      const staticOnly = ALL_MATCHES.filter(m => !apiIds.has(m.id));

      setMatches([...merged, ...staticOnly]);
      setUsingLive(true);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.warn("[useLiveMatches] Falling back to static data:", err.message);
      setError(err.message);
      setUsingLive(false);
      setMatches(ALL_MATCHES); // graceful fallback
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
