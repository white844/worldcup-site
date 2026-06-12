/**
 * NextMatchBanner
 *
 * - When matches are LIVE: shows a pulsing red "LIVE NOW" banner with scores
 * - When matches are upcoming: shows blue "NEXT MATCHES" banner with countdown
 * - Scrolls smoothly away once the matches in the group expire.
 */
import { useState, useEffect } from "react";
import { Clock, ChevronRight } from "lucide-react";
import { C, sora, dm } from "../../tokens";
import { matchDayUTC } from "../../hooks/useMatchSchedule";
import { teamFlagImg, labelTeam } from "../../data";

// FlagImg — real flag image via jsdelivr, styled TBD box for placeholders
function FlagImg({ raw, size = 36 }) {
  const code = teamFlagImg(raw);
  if (!code) return (
    <div style={{
      width: size, height: Math.round(size * 0.67),
      borderRadius: 3,
      background: "linear-gradient(135deg,#E2E8F0,#CBD5E1)",
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
  const matchMs  = matchDayUTC(isoDate);
  const endOfDay = matchMs + 86_400_000;
  const msTillEnd = endOfDay - nowMs;

  if (nowMs >= matchMs && nowMs < endOfDay && msTillEnd > 0) {
    const h = String(Math.floor(msTillEnd / 3_600_000)).padStart(2, "0");
    const m = String(Math.floor((msTillEnd % 3_600_000) / 60_000)).padStart(2, "0");
    const s = String(Math.floor((msTillEnd % 60_000) / 1_000)).padStart(2, "0");
    return <span style={{ fontVariantNumeric: "tabular-nums" }}>{label} · ends in {h}:{m}:{s}</span>;
  }

  const diffMs = matchMs - nowMs;
  if (diffMs > 0 && diffMs < 86_400_000) {
    const h = String(Math.floor(diffMs / 3_600_000)).padStart(2, "0");
    const m = String(Math.floor((diffMs % 3_600_000) / 60_000)).padStart(2, "0");
    const s = String(Math.floor((diffMs % 60_000) / 1_000)).padStart(2, "0");
    return <span style={{ fontVariantNumeric: "tabular-nums" }}>{label} · in {h}:{m}:{s}</span>;
  }

  return <span>{label}</span>;
}

// ── Live elapsed timer ─────────────────────────────────────────────────────────
function LiveElapsed({ isoDate, time }) {
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Compute kickoff UTC ms
  const [hh, mm] = time.split(":").map(Number);
  const [y, mo, d] = isoDate.split("-").map(Number);
  const kickoff = Date.UTC(y, mo - 1, d, hh, mm);
  const elapsedMs = nowMs - kickoff;

  if (elapsedMs < 0) return null;

  const totalMins = Math.floor(elapsedMs / 60_000);

  // Football: show halftime at exactly 45, extra time beyond 90 as 90+N
  if (totalMins <= 45) {
    return <span style={{ fontVariantNumeric: "tabular-nums", fontSize: 12, opacity: 0.9 }}>{totalMins}'</span>;
  }
  if (totalMins <= 60) {
    // Approx halftime window (45-60 min = half time break)
    return <span style={{ fontSize: 11, opacity: 0.85 }}>HT</span>;
  }
  if (totalMins <= 90) {
    return <span style={{ fontVariantNumeric: "tabular-nums", fontSize: 12, opacity: 0.9 }}>{totalMins}'</span>;
  }
  return <span style={{ fontVariantNumeric: "tabular-nums", fontSize: 12, opacity: 0.9 }}>90+{totalMins - 90}'</span>;
}

export default function NextMatchBanner({ nextIsoDate, nextMatches, liveIds = new Set() }) {
  if (!nextIsoDate || nextMatches.length === 0) return null;

  // Split matches into live vs upcoming
  const liveNow    = nextMatches.filter(m => liveIds.has(m.id) || m.isLive);
  const upcomingNow = nextMatches.filter(m => !liveIds.has(m.id) && !m.isLive);

  const hasLive = liveNow.length > 0;

  // Preview: show up to 3 team pairs
  const displayMatches = hasLive ? liveNow : nextMatches;
  const preview = displayMatches.slice(0, 3);
  const extra   = displayMatches.length - preview.length;

  return (
    <div
      role="region"
      aria-label={hasLive ? "Matches in progress" : "Next upcoming matches"}
      style={{
        marginBottom: 24,
        borderRadius: 16,
        overflow: "hidden",
        border: hasLive
          ? "1.5px solid rgba(239,68,68,0.4)"
          : `1.5px solid ${C.blue}33`,
        background: hasLive
          ? "linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(185,28,28,0.04) 100%)"
          : `linear-gradient(135deg, ${C.blue}0D 0%, ${C.blueDark}08 100%)`,
        animation: "wc26-fadein 0.4s ease",
      }}
    >
      {/* Header bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 18px",
        background: hasLive
          ? "linear-gradient(135deg, #B91C1C, #EF4444)"
          : `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#fff",
            boxShadow: hasLive
              ? "0 0 0 3px rgba(255,255,255,0.3)"
              : "0 0 0 3px rgba(74,222,128,0.3)",
            animation: "wc26-pulse-live 1.4s ease-in-out infinite",
          }} />
          <span style={{ ...sora, fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {hasLive ? "Live Now" : "Next Matches"}
          </span>
          {hasLive && (
            <span style={{
              ...dm, fontSize: 10, fontWeight: 700,
              background: "rgba(0,0,0,0.2)", color: "#fff",
              padding: "2px 8px", borderRadius: 999, letterSpacing: "0.04em",
            }}>
              {liveNow.length} match{liveNow.length !== 1 ? "es" : ""} in progress
            </span>
          )}
        </div>
        <span style={{ ...dm, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
          {!hasLive && (
            <>
              <Clock size={12} style={{ marginRight: 5, verticalAlign: "middle" }} />
              <Countdown isoDate={nextIsoDate} />
            </>
          )}
          {hasLive && upcomingNow.length > 0 && (
            <span style={{ fontSize: 11, opacity: 0.85 }}>
              +{upcomingNow.length} more today
            </span>
          )}
        </span>
      </div>

      {/* Match previews */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 0,
        padding: "4px 0",
      }}>
        {preview.map((m, i) => {
          const isMatchLive = liveIds.has(m.id) || m.isLive;
          return (
            <div key={m.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 18px",
              borderBottom: i < preview.length - 1 ? `1px solid ${C.border}` : "none",
              flex: "1 1 260px",
              minWidth: 0,
              background: isMatchLive ? "rgba(239,68,68,0.04)" : "transparent",
            }}>
              <FlagImg raw={m.home} size={22} />
              <span style={{ ...dm, fontSize: 12, fontWeight: 700, color: C.text, whiteSpace: "nowrap" }}>
                {labelTeam(m.home)}
              </span>

              {/* Score or VS */}
              {isMatchLive && m.liveScore ? (
                <span style={{
                  ...sora, fontSize: 13, fontWeight: 900, color: "#B91C1C",
                  padding: "2px 8px", background: "rgba(239,68,68,0.1)",
                  borderRadius: 6, whiteSpace: "nowrap", letterSpacing: "0.04em",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {m.liveScore.home} – {m.liveScore.away}
                </span>
              ) : (
                <span style={{ ...dm, fontSize: 10, fontWeight: 700, color: C.textSoft, padding: "2px 6px", background: C.bgSubtle, borderRadius: 6 }}>
                  VS
                </span>
              )}

              <span style={{ ...dm, fontSize: 12, fontWeight: 700, color: C.text, whiteSpace: "nowrap" }}>
                {labelTeam(m.away)}
              </span>
              <FlagImg raw={m.away} size={22} />

              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                {isMatchLive ? (
                  <span style={{
                    display: "flex", alignItems: "center", gap: 4,
                    ...dm, fontSize: 11, color: "#B91C1C", fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "#EF4444",
                      animation: "wc26-pulse-live 1.4s ease-in-out infinite",
                      flexShrink: 0,
                    }} />
                    <LiveElapsed isoDate={m.isoDate} time={m.time} />
                  </span>
                ) : (
                  <span style={{ ...dm, fontSize: 11, color: C.textSoft, whiteSpace: "nowrap" }}>
                    {m.time} · {m.city?.split("/")[0]?.trim() ?? ""}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {extra > 0 && (
          <div style={{
            padding: "10px 18px",
            display: "flex", alignItems: "center", gap: 4,
            ...dm, fontSize: 12, fontWeight: 600,
            color: hasLive ? "#B91C1C" : C.blue,
            flex: "1 1 260px",
          }}>
            +{extra} more match{extra > 1 ? "es" : ""}
            <ChevronRight size={14} />
          </div>
        )}
      </div>
    </div>
  );
}
