import { useState, useEffect, useMemo } from "react";
import PulseDot from "../PulseDot";
import { C, sora, dm } from "../../tokens";
import { ACTIVITIES, RECENT_PURCHASES } from "../../data";
import { useI18n } from "../../context/I18nContext";

const ICON_BG = {
  sale:    "rgba(22,163,74,0.2)",
  price:   "rgba(245,158,11,0.2)",
  viewers: "rgba(99,102,241,0.2)",
  listing: "rgba(14,165,233,0.2)",
};

const BASE_TIME = Date.now();
const ACTIVITY_OFFSETS = ACTIVITIES.map((_, i) => ((i * 137 + 23) % 14) + 1);
const PURCHASE_OFFSETS = RECENT_PURCHASES.map((_, i) => ((i * 97 + 5) % 18) + 2);

function liveAgo(baseOffsetMins, nowMs, t) {
  const elapsedMins = Math.floor((nowMs - BASE_TIME) / 60_000);
  const total = baseOffsetMins + elapsedMins;
  if (total < 60) return t("live.ago.min", { n: total });
  return t("live.ago.hour", { n: Math.floor(total / 60) });
}

// Renders "Name from City bought Match (Cat)" with t() for the connective words
function PurchaseText({ p, t }) {
  // t("live.purchase.text") = "{name} from {city} bought {match}"
  // We split by the template tokens to render bold spans inline
  const tpl = t("live.purchase.text", { name: "§NAME§", city: "§CITY§", match: "§MATCH§" });
  const parts = tpl.split(/(§NAME§|§CITY§|§MATCH§)/);
  return (
    <span style={{ overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.4 }}>
      {parts.map((part, i) => {
        if (part === "§NAME§") return <strong key={i} style={{ color: "rgba(255,255,255,0.9)" }}>{p.name}</strong>;
        if (part === "§CITY§") return <span key={i}>{p.city}</span>;
        if (part === "§MATCH§") return (
          <span key={i}>
            <strong style={{ color: "rgba(255,255,255,0.9)" }}>{p.match}</strong>{" "}
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>({p.cat})</span>
          </span>
        );
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

export default function LiveActivity() {
  const [offset, setOffset] = useState(0);
  const [nowMs,  setNowMs]  = useState(() => Date.now());
  const { t } = useI18n();

  useEffect(() => {
    const id = setInterval(() => setOffset(o => (o + 1) % ACTIVITIES.length), 3800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const items = useMemo(
    () => Array.from({ length: 6 }, (_, i) => {
      const idx = (i + offset) % ACTIVITIES.length;
      return { ...ACTIVITIES[idx], liveTime: liveAgo(ACTIVITY_OFFSETS[idx], nowMs, t) };
    }),
    [offset, nowMs, t]
  );

  const purchases = useMemo(
    () => RECENT_PURCHASES.map((p, i) => ({ ...p, liveTime: liveAgo(PURCHASE_OFFSETS[i], nowMs, t) })),
    [nowMs, t]
  );

  return (
    <section id="live" style={{ background: C.navy, padding: "clamp(40px,8vw,72px) 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px,5vw,20px)" }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.live, marginBottom: 8, display: "flex", alignItems: "center", gap: 8, ...dm }}>
            <PulseDot /> {t("live.label")}
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ ...sora, fontWeight: 800, fontSize: "clamp(22px,4vw,36px)", letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.1, marginBottom: 8 }}>{t("live.title")}</h2>
              <p style={{ fontSize: "clamp(13px,3vw,16px)", color: "rgba(255,255,255,0.55)", maxWidth: 520, lineHeight: 1.6, ...dm }}>{t("live.body")}</p>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "5px 12px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", flexShrink: 0, ...dm }}>
              <PulseDot size={6} /> {t("live.updated")}
            </div>
          </div>
        </div>

        <div className="wc26-activity-grid">
          {items.map((a, i) => (
            <div key={i} className="wc26-activity-item"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 12, animation: "wc26-slide 0.4s ease-out" }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: ICON_BG[a.cls], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0, marginTop: 1 }}>{a.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6, marginBottom: 3 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0, ...dm }}>{a.match}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.live, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0, ...dm }}>{a.liveTime}</div>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.4, ...dm }}>{a.action}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 16px", marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8, ...dm }}>
            <PulseDot size={6} /> {t("live.purchases")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {purchases.map(p => (
              <div key={p.name} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.75)", ...dm }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{p.initials}</div>
                  <PurchaseText p={p} t={t} />
                </div>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap", flexShrink: 0, paddingTop: 2 }}>{p.liveTime}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
