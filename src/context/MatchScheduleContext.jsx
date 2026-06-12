/**
 * MatchScheduleContext
 *
 * Wraps the whole app (or just Marketplace) so any component can read the
 * live schedule without prop-drilling. The hook runs once here; all
 * consumers share the same interval.
 *
 * FIX: Now pulls live match data from useLiveMatches (football-data.org API)
 * and feeds it into useMatchSchedule so the schedule context reflects real
 * fixture data instead of being locked to the static fallback.
 */
import { createContext, useContext } from "react";
import { useMatchSchedule } from "../hooks/useMatchSchedule";
import { useLiveMatches } from "../hooks/useLiveMatches";

const MatchScheduleContext = createContext(null);

export function MatchScheduleProvider({ children }) {
  // Pull live data (falls back to static ALL_MATCHES on API error/missing key)
  const { matches: liveApiMatches, usingLive, lastUpdated, loading } = useLiveMatches();

  // Feed live (or fallback) matches into the schedule engine
  const schedule = useMatchSchedule(liveApiMatches);
  return (
    <MatchScheduleContext.Provider value={{ ...schedule, usingLive, lastUpdated, loading }}>
      {/* ARIA live region — visually hidden, read by screen readers */}
      <div
        ref={schedule.ariaRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: 1, height: 1,
          padding: 0, margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      />
      {children}
    </MatchScheduleContext.Provider>
  );
}

export function useSchedule() {
  const ctx = useContext(MatchScheduleContext);
  if (!ctx) throw new Error("useSchedule must be used inside MatchScheduleProvider");
  // ctx now includes: liveMatches, nextIsoDate, expiredIds, nowMs, ariaRef,
  //                   startingSoonIds, liveIds, dateGroups
  return ctx;
}
