/**
 * FeaturedMatches — High-demand listings on the homepage.
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "../ui";
import { C, sora, dm } from "../../tokens";
import { teamName, teamFlagImg, labelTeam, timeAgo } from "../../data";
import { useUrgency } from "../../hooks/useUrgency";
import { openContactWhatsApp } from "../../utils/whatsapp";
import { useSchedule } from "../../context/MatchScheduleContext";
import { shouldShowMatch } from "../../utils/knockoutVisibility";
import { useI18n } from "../../context/I18nContext";

function FlagImg({ raw, size = 44 }) {
  const code = teamFlagImg(raw);
  if (!code) {
    return (
      <div style={{
        width: size, height: Math.round(size * 0.67), borderRadius: 3,
        background: "linear-gradient(135deg,#E2E8F0,#CBD5E1)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span style={{ fontSize: Math.max(8, Math.round(size * 0.22)), fontWeight: 700, color: "#94A3B8", letterSpacing: "0.04em", fontFamily: "'DM Sans',sans-serif", userSelect: "none" }}>TBD</span>
      </div>
    );
  }
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${code}.svg`}
      alt={teamName(raw)}
      width={size} height={Math.round(size * 0.67)}
      style={{ objectFit: "contain", borderRadius: 3, display: "block", flexShrink: 0 }}
      onError={e => { e.currentTarget.style.display = "none"; }}
    />
  );
}

function FeaturedCard({ match, urgency }) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { tickets = 3, viewers = 20 } = urgency ?? {};
  const isLimited = tickets <= 2;

  const pill = isLimited
    ? { bg: C.dangerBg, color: C.dangerText, border: C.dangerBorder, label: t("featured.pill.limited") }
    : match.highDemand
      ? { bg: C.infoBg,   color: C.blue,       border: C.infoBorder,   label: t("featured.pill.demand") }
      : { bg: C.greenBg,  color: C.greenText,   border: C.greenBorder,  label: t("featured.pill.available") };

  const handleContact = (e) => { e.stopPropagation(); setConfirmOpen(true); };
  const handleConfirmContact = (e) => {
    e.stopPropagation();
    setConfirmOpen(false);
    openContactWhatsApp(
      `${labelTeam(match.home)} vs ${labelTeam(match.away)}`,
      `${match.date} · ${match.venue}`
    );
  };

  const urgencyText = isLimited
    ? t(tickets === 1 ? "featured.limited" : "featured.limited_p", { n: tickets, v: viewers })
    : t("featured.viewing", { v: viewers, t: timeAgo(match.listedAt) });

  return (
    <>
      <div
        onClick={() => navigate(`/marketplace/${match.id}`)}
        className="wc26-card wc26-card-hover"
        style={{ overflow: "hidden", position: "relative", cursor: "pointer", border: `1px solid ${isLimited ? C.dangerBorder : C.border}` }}
      >
        {/* Verified badge */}
        <div style={{
          position: "absolute", top: 44, right: 12,
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "3px 9px", borderRadius: 999,
          background: "#EFF6FF", border: "1px solid #BFDBFE",
          fontSize: 10, fontWeight: 700, color: C.blue, ...dm,
        }}>
          <ShieldCheck size={10} color={C.blue} /> {t("featured.verified")}
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px",
          background: isLimited ? C.dangerBg : C.bgSubtle,
          borderBottom: `1px solid ${C.border}`,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.textSoft, letterSpacing: "0.07em", textTransform: "uppercase", ...dm }}>{match.group}</span>
          <span className="wc26-pill wc26-pill-sm" style={{ background: pill.bg, color: pill.color, border: `1px solid ${pill.border}` }}>
            {pill.label}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "18px 16px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            <div style={{ flexShrink: 0, display: "flex" }}><FlagImg raw={match.home} size={32} /></div>
            <span style={{ ...sora, fontWeight: 700, fontSize: 14, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{labelTeam(match.home)}</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.textSoft, flexShrink: 0, ...dm }}>vs</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0, flexDirection: "row-reverse" }}>
            <div style={{ flexShrink: 0, display: "flex" }}><FlagImg raw={match.away} size={32} /></div>
            <span style={{ ...sora, fontWeight: 700, fontSize: 14, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{labelTeam(match.away)}</span>
          </div>
        </div>

        <div style={{ padding: "0 16px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
          {[["📅", `${match.date} · ${match.time}`], ["📍", match.venue]].map(([ic, val]) => (
            <div key={val} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.textMid, ...dm }}>
              <span style={{ color: C.blue }}>{ic}</span>{val}
            </div>
          ))}
        </div>

        <div style={{ margin: "0 14px 14px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div className="wc26-label" style={{ marginBottom: 2 }}>{t("featured.seat")}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, ...dm }}>{match.category}</div>
          </div>
          <div style={{ fontSize: 11, color: C.textSoft, textAlign: "right", ...dm }}>
            {t("featured.sec")} <strong>{match.section}</strong> · {t("featured.row")} <strong>{match.row}</strong>
          </div>
        </div>

        <div style={{
          padding: "6px 16px", fontSize: 11, fontWeight: 600, ...dm,
          background: isLimited ? C.dangerBg : "rgba(22,163,74,0.06)",
          borderTop: `1px solid ${isLimited ? C.dangerBorder : "rgba(22,163,74,0.15)"}`,
          color: isLimited ? C.dangerText : C.green,
        }}>
          {urgencyText}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: `1px solid ${C.border}`, background: "rgba(248,250,252,0.6)" }}>
          <div>
            <div className="wc26-label" style={{ marginBottom: 0 }}>{t("featured.from")}</div>
            <div style={{ ...sora, fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: "-0.03em" }}>${match.price}</div>
          </div>
          <button
            onClick={handleContact}
            style={{
              padding: "9px 16px", borderRadius: 10,
              background: "linear-gradient(135deg,#25D366,#128C7E)",
              border: "none", color: "#fff", fontSize: 12, fontWeight: 700,
              cursor: "pointer", transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 3px 10px rgba(37,211,102,0.30)", ...dm,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <span>💬</span> {t("featured.contact")}
          </button>
        </div>
      </div>

      {/* WhatsApp confirmation modal */}
      {confirmOpen && (
        <div
          onClick={e => { e.stopPropagation(); setConfirmOpen(false); }}
          style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 360, width: "100%", boxShadow: "0 24px 60px rgba(15,23,42,0.25)" }}>
            <div style={{ fontSize: 32, marginBottom: 12, textAlign: "center" }}>💬</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginBottom: 8, textAlign: "center", fontFamily: "Sora,sans-serif" }}>{t("wa.title")}</div>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 6, textAlign: "center", lineHeight: 1.5, fontFamily: "DM Sans,sans-serif" }}>{t("wa.about")}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", textAlign: "center", marginBottom: 4, fontFamily: "DM Sans,sans-serif" }}>{labelTeam(match.home)} vs {labelTeam(match.away)}</div>
            <div style={{ fontSize: 12, color: "#64748B", textAlign: "center", marginBottom: 20, fontFamily: "DM Sans,sans-serif" }}>{match.date} · {match.venue}</div>
            <div style={{ fontSize: 12, color: "#92400E", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 8, padding: "10px 12px", marginBottom: 20, lineHeight: 1.5, fontFamily: "DM Sans,sans-serif" }}>
              {t("wa.warning")}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={e => { e.stopPropagation(); setConfirmOpen(false); }} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid #E2E8F0", background: "#F8FAFC", fontSize: 13, fontWeight: 600, color: "#64748B", cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>{t("wa.cancel")}</button>
              <button onClick={handleConfirmContact} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#25D366,#128C7E)", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "DM Sans,sans-serif" }}>
                <span>💬</span> {t("wa.open")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function FeaturedMatches() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { liveMatches } = useSchedule();

  const featured = useMemo(() =>
    liveMatches.filter(m => m.highDemand && shouldShowMatch(m)).slice(0, 7),
    [liveMatches]
  );
  const urgencies = useUrgency(featured);

  return (
    <section style={{ padding: "60px 0", background: C.bgSubtle }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.accent, marginBottom: 8, ...dm }}>
              {t("featured.label")}
            </div>
            <h2 style={{ ...sora, fontWeight: 800, fontSize: "clamp(22px,3vw,32px)", color: C.text, letterSpacing: "-0.02em", marginBottom: 6 }}>
              {t("featured.title")}
            </h2>
            <p style={{ fontSize: 14, color: C.textSoft, ...dm }}>
              {t("featured.body")}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate("/marketplace")}>
            {t("featured.viewall", { n: liveMatches.length })}
          </Button>
        </div>

        <div className="wc26-featured-grid">
          {featured.map((m, i) => (
            <FeaturedCard key={m.id} match={m} urgency={urgencies[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}
