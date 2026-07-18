/**
 * NextMatchBanner
 *
 * Shown at the top of the Marketplace listing area when there are upcoming
 * matches. Displays the date of the next group with a live countdown
 * (updates every second for "today/tomorrow", otherwise shows the date).
 * Scrolls smoothly away once the matches in the group expire.
 */
import { useState, useEffect } from "react";
import { Clock, ChevronRight } from "lucide-react";
import { C, sora, dm } from "../../tokens";
import { matchDayUTC } from "../../hooks/useMatchSchedule";
import { teamName, teamFlag, teamFlagImg, labelTeam } from "../../data";


// FlagImg — real flag image via flagcdn.com, styled TBD box for placeholders
function FlagImg({ raw, size = 36 }) {
  const code = teamFlagImg(raw);
  if (!code) return (
    <div style={{
      width: size, height: Math.round(size * 0.67),
      borderRadius: 3,
      background: "#E2E8F0",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{
        fontSize: Math.max(6, Math.round(size * 0.22)),
        fontWeight: 700, color: "#94A3B8",
        letterSpacing: "0.04em",
        fontFamily: "'DM Sans',sans-serif",
        userSelect: "none",
      }}>TBD</span>
    </div>
  );
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${code}.svg`}
      srcSet={`https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${code}.svg 2x`}
      alt={labelTeam(raw)}
      width={size}
      height={Math.round(size * 0.67)}
      style={{ objectFit: "contain", borderRadius: 3, display: "block" }}
      onError={e => { e.currentTarget.style.display = "none"; }}
    />
  );
}

function formatNextDate(isoDate, nowMs) {
  // Compare UTC calendar dates (midnight-to-midnight) to avoid "Tomorrow"
  // displaying as "Today" when the user's clock is late evening and the
  // match day starts just after UTC midnight (< 24 h away but next day).
  const todayIso = new Date(nowMs).toISOString().slice(0, 10);
  const todayMs  = matchDayUTC(todayIso);
  const matchMs  = matchDayUTC(isoDate);
  const diffDays = Math.round((matchMs - todayMs) / 86_400_000);

  if (diffDays <= 0)  return "Today";
  if (diffDays === 1) return "Tomorrow";
  const d = new Date(isoDate + "T12:00:00Z");
  return d.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", timeZone: "UTC",
  });
}

function Countdown({ isoDate }) {
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    let id;
    const start = () => { id = setInterval(() => setNowMs(Date.now()), 1000); };
    const stop  = () => clearInterval(id);
    const onVisibility = () => document.hidden ? stop() : start();

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => { stop(); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  const label    = formatNextDate(isoDate, nowMs);
  const matchMs  = matchDayUTC(isoDate);                  // UTC midnight of match day
  const endOfDay = matchMs + 86_400_000;                  // UTC midnight next day
  const msTillEnd = endOfDay - nowMs;                     // time left in match day

  // We're currently in the match day window (after UTC midnight, before next UTC midnight)
  if (nowMs >= matchMs && nowMs < endOfDay && msTillEnd > 0) {
    const h = String(Math.floor(msTillEnd / 3_600_000)).padStart(2, "0");
    const m = String(Math.floor((msTillEnd % 3_600_000) / 60_000)).padStart(2, "0");
    const s = String(Math.floor((msTillEnd % 60_000) / 1_000)).padStart(2, "0");
    return <span style={{ fontVariantNumeric: "tabular-nums" }}>{label} · ends in {h}:{m}:{s}</span>;
  }

  // Future date — show time until UTC midnight of match day
  const diffMs = matchMs - nowMs;
  if (diffMs > 0 && diffMs < 86_400_000) {
    // Less than 24 h away — show countdown to match day start
    const h = String(Math.floor(diffMs / 3_600_000)).padStart(2, "0");
    const m = String(Math.floor((diffMs % 3_600_000) / 60_000)).padStart(2, "0");
    const s = String(Math.floor((diffMs % 60_000) / 1_000)).padStart(2, "0");
    return <span style={{ fontVariantNumeric: "tabular-nums" }}>{label} · in {h}:{m}:{s}</span>;
  }

  return <span>{label}</span>;
}

export default function NextMatchBanner({ nextIsoDate, nextMatches }) {
  if (!nextIsoDate || nextMatches.length === 0) return null;

  // If one of today's matches is live, this is a "Today's Matches" overview
  // rather than a "Next Matches" preview — avoids saying "next" about a
  // match that's already underway.
  const hasLive = nextMatches.some(m => m.isLive || m._likelyLive);
  const heading = hasLive ? "Today's Matches" : "Next Matches";

  // Preview: show up to 3 team pairs
  const preview = nextMatches.slice(0, 3);
  const extra   = nextMatches.length - preview.length;

  return (
    <div
      role="region"
      aria-label="Next upcoming matches"
      style={{
        marginBottom: 24,
        borderRadius: 16,
        overflow: "hidden",
        border: `1.5px solid ${C.blue}33`,
        background: `${C.blue}0D`,
        animation: "wc26-fadein 0.4s ease",
      }}
    >
      {/* Header bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 18px",
        background: C.blue,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#4ADE80",
            boxShadow: "0 0 0 3px rgba(74,222,128,0.3)",
            animation: "wc26-pulse 1.8s ease-in-out infinite",
          }} />
          <span style={{ ...sora, fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {heading}
          </span>
        </div>
        <span style={{ ...dm, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
          <Clock size={12} style={{ marginRight: 5, verticalAlign: "middle" }} />
          <Countdown isoDate={nextIsoDate} />
        </span>
      </div>

      {/* Match previews */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 0,
        padding: "4px 0",
      }}>
        {preview.map((m, i) => (
          <div key={m.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 18px",
            borderBottom: i < preview.length - 1 ? `1px solid ${C.border}` : "none",
            flex: "1 1 260px",
            minWidth: 0,
          }}>
            <FlagImg raw={m.home} size={22} />
            <span style={{ ...dm, fontSize: 12, fontWeight: 700, color: C.text, whiteSpace: "nowrap" }}>
              {labelTeam(m.home)}
            </span>
            <span style={{ ...dm, fontSize: 10, fontWeight: 700, color: C.textSoft, padding: "2px 6px", background: C.bgSubtle, borderRadius: 6 }}>
              VS
            </span>
            <span style={{ ...dm, fontSize: 12, fontWeight: 700, color: C.text, whiteSpace: "nowrap" }}>
              {labelTeam(m.away)}
            </span>
            <FlagImg raw={m.away} size={22} />
            {(m.isLive || m._likelyLive) ? (
              <span style={{
                ...dm, fontSize: 10, fontWeight: 800, color: "#fff",
                background: C.liveRed, padding: "2px 8px", borderRadius: 999,
                marginLeft: "auto", whiteSpace: "nowrap", letterSpacing: "0.04em",
              }}>
                ● {m.isLive
                  ? `LIVE${m.liveScore && m.liveScore.home != null ? ` ${m.liveScore.home}–${m.liveScore.away}` : ""}`
                  : "IN PROGRESS"}
              </span>
            ) : (
              <span style={{ ...dm, fontSize: 11, color: C.textSoft, marginLeft: "auto", whiteSpace: "nowrap" }}>
                {m.time} · {m.city.split("/")[0].trim()}
              </span>
            )}
          </div>
        ))}
        {extra > 0 && (
          <div style={{
            padding: "10px 18px",
            display: "flex", alignItems: "center", gap: 4,
            ...dm, fontSize: 12, fontWeight: 600, color: C.blue,
            flex: "1 1 260px",
          }}>
            +{extra} more match{extra > 1 ? "es" : ""} on this date
            <ChevronRight size={14} />
          </div>
        )}
      </div>
    </div>
  );
}
