/**
 * MatchCard — Marketplace listing card
 *
 * Props:
 *  match      — listing object from data/index.js
 *  urgency    — { tickets, viewers } from useUrgency
 *  isNext     — true when this match belongs to the next upcoming date group
 *  isExpiring — true when match just passed (triggers exit animation)
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, ShieldCheck, Star, Bell } from "lucide-react";
import { C, sora, dm } from "../../tokens";
import { kickoffCountdown } from "../../hooks/useMatchSchedule";
import { teamName, teamFlagImg, labelTeam, timeAgo } from "../../data";
import { openContactWhatsApp } from "../../utils/whatsapp";
import { useI18n } from "../../context/I18nContext";

// FlagImg: real flag SVG for known teams; styled TBD box for placeholders.
// No white-flag emoji anywhere. Dimensions always match to prevent layout shift.
function FlagImg({ raw, size = 44 }) {
  const code = teamFlagImg(raw);
  if (!code) {
    return (
      <div style={{
        width: size, height: Math.round(size * 0.67),
        borderRadius: 3,
        background: "linear-gradient(135deg,#E2E8F0,#CBD5E1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: Math.max(8, Math.round(size * 0.22)),
          fontWeight: 700, color: "#94A3B8",
          letterSpacing: "0.04em",
          fontFamily: "'DM Sans',sans-serif",
          userSelect: "none",
        }}>TBD</span>
      </div>
    );
  }
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${code}.svg`}
      srcSet={`https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${code}.svg 2x`}
      alt={teamName(raw)}
      width={size}
      height={Math.round(size * 0.67)}
      style={{ objectFit: "contain", borderRadius: 3, display: "block", flexShrink: 0 }}
      onError={e => { e.currentTarget.style.display = "none"; }}
    />
  );
}

export default function MatchCard({ match, urgency, isNext = false, isExpiring = false, isStartingSoon = false, isSaved = false, onToggleSave, alertPrice = null, onSetAlert }) {
  const { t } = useI18n();
  const navigate      = useNavigate();
  const [hov, setHov] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { tickets = 3, viewers = 20 } = urgency ?? {};
  const isLimited     = tickets <= 2;
  // Live countdown — recalculated on each render (nowMs ticks every 60 s from context)
  // We import nowMs via a lightweight re-export of Date.now since MatchCard
  // doesn't need to subscribe to the full context — the parent re-renders it.
  const countdown     = kickoffCountdown(match, Date.now());

  const statusPill = isLimited
    ? { bg: C.dangerBg,  color: C.dangerText, border: C.dangerBorder, label: `🔥 ${tickets} left` }
    : { bg: C.greenBg,   color: C.greenText,  border: C.greenBorder,  label: "● Available" };

  const handleContact = (e) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleConfirmContact = (e) => {
    e.stopPropagation();
    setConfirmOpen(false);
    openContactWhatsApp(
      `${labelTeam(match.home)} vs ${labelTeam(match.away)}`,
      `${match.date} · ${match.venue}`
    );
  };

  return (
    <div
      onClick={() => navigate(`/marketplace/${match.id}`)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={`${teamName(match.home)} vs ${teamName(match.away)}, ${match.date}, $${match.price} per ticket${isNext ? ", next upcoming match" : ""}${isStartingSoon ? ", starting within 24 hours" : ""}${countdown ? ", " + countdown : ""}`}
      style={{
        borderRadius: 14, overflow: "hidden", cursor: isExpiring ? "default" : "pointer",
        transition: "box-shadow 0.2s, border-color 0.2s, transform 0.2s",
        background: C.bgCard,
        border: match.isLive
          ? `2px solid #EF4444`
          : match.isOpeningMatch
          ? `2px solid #E8302A`
          : isStartingSoon
          ? `1.5px solid #F59E0B99`
          : isNext
          ? `1.5px solid ${C.blue}66`
          : `1px solid ${isLimited && hov ? C.dangerBorder : C.border}`,
        boxShadow: match.isLive
          ? `${C.shadowLg}, 0 0 0 4px rgba(239,68,68,0.15)`
          : match.isOpeningMatch
          ? `${C.shadowLg}, 0 0 0 4px rgba(232,48,42,0.12)`
          : isStartingSoon
          ? `${C.shadowLg}, 0 0 0 3px rgba(245,158,11,0.15)`
          : isNext
          ? `${C.shadowLg}, 0 0 0 3px ${C.blue}14`
          : hov ? C.shadowLg : C.shadowSm,
        transform: hov && !isExpiring ? "translateY(-3px)" : "translateY(0)",
        animation: isExpiring
          ? "wc26-fadeout 0.6s ease forwards"
          : "wc26-fadein 0.35s ease",
        pointerEvents: isExpiring ? "none" : "auto",
      }}
    >
      {/* Priority ribbon: Live > Opening Match > Starting Soon > Up Next > countdown */}
      {match.isLive ? (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "6px 14px",
          background: "linear-gradient(90deg, #B91C1C, #EF4444)",
          fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "#fff", ...dm,
          animation: "wc26-pulse-live 1s ease-in-out infinite",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: "#fff",
              boxShadow: "0 0 0 2px rgba(255,255,255,0.4)", flexShrink: 0,
            }} />
            Live Now
            {match.isOpeningMatch && (
              <span style={{ opacity: 0.85, fontWeight: 600, textTransform: "none", letterSpacing: 0, fontSize: 9 }}>
                · Opening Match
              </span>
            )}
          </div>
          {match.liveScore && match.liveScore.home != null && (
            <span style={{
              fontSize: 13, fontWeight: 900, background: "rgba(0,0,0,0.25)",
              padding: "2px 10px", borderRadius: 6,
              fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em",
            }}>
              {match.liveScore.home} – {match.liveScore.away}
              {match.liveScore.minute ? <span style={{ fontSize: 9, fontWeight: 600, opacity: 0.85, marginLeft: 5 }}>{match.liveScore.minute}'</span> : null}
            </span>
          )}
        </div>
      ) : match.isOpeningMatch ? (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "6px 14px",
          background: "linear-gradient(90deg, #1B3C88, #E8302A)",
          fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "#fff", ...dm,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14 }}>🏆</span>
            Opening Match · FIFA World Cup 2026
          </div>
        </div>
      ) : isStartingSoon ? (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "5px 14px",
          background: "linear-gradient(90deg, #D97706, #F59E0B)",
          fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "#fff", ...dm,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: "#fff",
              boxShadow: "0 0 0 2px rgba(255,255,255,0.4)",
              animation: "wc26-pulse 1.8s ease-in-out infinite", flexShrink: 0,
            }} />
            Starting Soon
          </div>
          {countdown && (
            <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.95, fontVariantNumeric: "tabular-nums" }}>
              {countdown}
            </span>
          )}
        </div>
      ) : isNext ? (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 14px",
          background: `linear-gradient(90deg, ${C.blue}, ${C.blueDark})`,
          fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "#fff", ...dm,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: "#4ADE80",
            boxShadow: "0 0 0 2px rgba(74,222,128,0.4)",
            animation: "wc26-pulse 1.8s ease-in-out infinite", flexShrink: 0,
          }} />
          Up Next
        </div>
      ) : countdown ? (
        <div style={{
          padding: "4px 14px",
          background: "rgba(245,158,11,0.08)",
          borderBottom: "1px solid rgba(245,158,11,0.15)",
          fontSize: 10, fontWeight: 700, color: "#92400E",
          fontVariantNumeric: "tabular-nums", ...dm,
        }}>
          ⏱ {countdown}
        </div>
      ) : null}

      {/* Header */}
      <div style={{ padding: "12px 14px", background: C.bgSubtle, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: C.textSoft, ...dm }}>
            {match.group}
          </span>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            {match.isLive && !match.isOpeningMatch && (
              <span style={{
                padding:"2px 7px", borderRadius:999, fontSize:9, fontWeight:800,
                background:"#EF4444", color:"#fff", letterSpacing:".06em",
              }}>● LIVE {match.liveScore ? `${match.liveScore.home}–${match.liveScore.away}${match.liveScore.minute ? ` ${match.liveScore.minute}'` : ""}` : ""}</span>
            )}
            <span className="wc26-pill wc26-pill-sm"
              style={{ background: statusPill.bg, color: statusPill.color, border: `1px solid ${statusPill.border}` }}>
              {statusPill.label}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ textAlign: "center", flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 4, display: "flex", justifyContent: "center" }}><FlagImg raw={match.home} size={38} /></div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", ...dm }}>{labelTeam(match.home)}</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textSoft, padding: "4px 8px", background: C.bgCard, borderRadius: 8, flexShrink: 0, ...dm }}>VS</div>
          <div style={{ textAlign: "center", flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 4, display: "flex", justifyContent: "center" }}><FlagImg raw={match.away} size={38} /></div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", ...dm }}>{labelTeam(match.away)}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.textMid, marginBottom: 6, ...dm }}>
          <Calendar size={11} color={C.blue} />{match.date} · {(() => {
            try {
              const [y, mo, d] = match.isoDate.split("-").map(Number);
              const [h, m] = match.time.split(":").map(Number);
              const utcDate = new Date(Date.UTC(y, mo - 1, d, h, m));
              return utcDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            } catch { return match.time; }
          })()}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.textMid, marginBottom: 14, ...dm }}>
          <MapPin size={11} color={C.blue} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{match.venue}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
          <span style={{ ...sora, fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: "-0.03em" }}>${match.price}</span>
          <span style={{ fontSize: 12, color: C.textSoft, ...dm }}>/ticket</span>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "4px 10px", borderRadius: 999,
          background: "#EFF6FF", border: "1px solid #BFDBFE",
          fontSize: 11, fontWeight: 700, color: C.blue, ...dm,
        }}>
          <ShieldCheck size={11} color={C.blue} /> Verified by Admin
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "10px 14px 14px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: match.avatarBg, color: match.avatarColor || "#fff",
              fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", ...sora,
            }}>
              {match.avatar}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.textMid, ...dm }}>{match.seller}</span>
            <span style={{ fontSize: 11, color: "#F59E0B", fontWeight: 700 }}>★ {match.rating}</span>
          </div>
          <span style={{ fontSize: 11, color: C.textSoft, ...dm }}>🕐 {timeAgo(match.listedAt)}</span>
        </div>
        {/* Buyer action row */}
        {(onToggleSave || onSetAlert) && (
          <div style={{ display:"flex", gap:8, marginBottom:8 }}>
            {onToggleSave && (
              <button
                onClick={e => { e.stopPropagation(); onToggleSave(match.id, `${match.homeRaw} vs ${match.awayRaw}`); }}
                style={{
                  flex:1, padding:"7px 8px", borderRadius:8,
                  border:`1.5px solid ${isSaved ? "#F59E0B" : C.border}`,
                  background: isSaved ? "#FFFBEB" : C.bg,
                  color: isSaved ? "#D97706" : C.textMid,
                  fontSize:11, fontWeight:700, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:4,
                  transition:"all 0.15s", ...dm,
                }}
              >
                <Star size={11} fill={isSaved ? "#F59E0B" : "none"} color={isSaved ? "#D97706" : C.textMid} />
                {isSaved ? t("card.saved") : t("card.save")}
              </button>
            )}
            {onSetAlert && (
              <button
                onClick={e => { e.stopPropagation(); onSetAlert(match); }}
                style={{
                  flex:1, padding:"7px 8px", borderRadius:8,
                  border:`1.5px solid ${alertPrice ? C.blue : C.border}`,
                  background: alertPrice ? C.infoBg : C.bg,
                  color: alertPrice ? C.blue : C.textMid,
                  fontSize:11, fontWeight:700, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:4,
                  transition:"all 0.15s", ...dm,
                }}
              >
                <Bell size={11} color={alertPrice ? C.blue : C.textMid} />
                {alertPrice ? `${t("card.alert")} $${alertPrice}` : t("card.alert")}
              </button>
            )}
          </div>
        )}

        <button
          onClick={handleContact}
          aria-label={`Contact seller for ${teamName(match.home)} vs ${teamName(match.away)}`}
          style={{
            width: "100%", padding: "10px", borderRadius: 10,
            background: "linear-gradient(135deg,#25D366,#128C7E)",
            border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
            cursor: "pointer", transition: "all 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            boxShadow: "0 3px 12px rgba(37,211,102,0.30)", ...dm,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,211,102,0.45)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 3px 12px rgba(37,211,102,0.30)"; }}
        >
          <span>💬</span> {t("card.contact")}
        </button>
      </div>

      {/* WhatsApp confirm modal */}
      {confirmOpen && (
        <div
          onClick={e => { e.stopPropagation(); setConfirmOpen(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 600,
            background: "rgba(15,23,42,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 16, padding: 28,
              maxWidth: 360, width: "100%",
              boxShadow: "0 24px 60px rgba(15,23,42,0.25)",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12, textAlign: "center" }}>💬</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginBottom: 8, textAlign: "center", fontFamily: "Sora,sans-serif" }}>
              {t("wa.title")}
            </div>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 6, textAlign: "center", fontFamily: "DM Sans,sans-serif", lineHeight: 1.5 }}>
              {t("wa.about")}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", textAlign: "center", marginBottom: 4, fontFamily: "DM Sans,sans-serif" }}>
              {labelTeam(match.home)} vs {labelTeam(match.away)}
            </div>
            <div style={{ fontSize: 12, color: "#64748B", textAlign: "center", marginBottom: 20, fontFamily: "DM Sans,sans-serif" }}>
              {match.date} · {match.venue}
            </div>
            <div style={{ fontSize: 12, color: "#92400E", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 8, padding: "10px 12px", marginBottom: 20, fontFamily: "DM Sans,sans-serif", lineHeight: 1.5 }}>
              {t("wa.warning")}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={e => { e.stopPropagation(); setConfirmOpen(false); }}
                style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid #E2E8F0", background: "#F8FAFC", fontSize: 13, fontWeight: 600, color: "#64748B", cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}
              >
                {t("wa.cancel")}
              </button>
              <button
                onClick={handleConfirmContact}
                style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#25D366,#128C7E)", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "DM Sans,sans-serif" }}
              >
                <span>💬</span> {t("wa.open")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
