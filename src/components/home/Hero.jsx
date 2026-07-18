import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Search, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import PulseDot from "../PulseDot";
import { Button } from "../ui";
import { C, sora, dm } from "../../tokens";
import { useSchedule } from "../../context/MatchScheduleContext";
import { useI18n } from "../../context/I18nContext";

export default function Hero() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [search, setSearch] = useState({ match: "", city: "", date: "" });
  const { liveMatches } = useSchedule();

  const STATS = [
    [String(liveMatches.length), t("hero.stat.matches")],
    ["100%",  t("hero.stat.verified")],
    ["24h",   t("hero.stat.review")],
    ["$0",    t("hero.stat.fee")],
  ];

  const PILLS = [
    { Icon: Check,       key: "hero.pill.verified" },
    { Icon: Search,      key: "hero.pill.manual"   },
    { Icon: ShieldCheck, key: "hero.pill.buyer"    },
    { Icon: Zap,         key: "hero.pill.fast"     },
  ];

  const handleFind = () => {
    const params = new URLSearchParams();
    if (search.match) params.set("search", search.match);
    if (search.city)  params.set("city",   search.city);
    if (search.date)  params.set("date",   search.date);
    navigate(`/marketplace?${params.toString()}`);
  };

  return (
    <section style={{
      background: `linear-gradient(135deg,${C.navy} 0%,${C.navyLight} 50%,${C.navyAlt} 100%)`,
      position: "relative", overflow: "hidden", padding: "clamp(48px,8vw,80px) 0",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 15% 0%,rgba(232,48,42,0.15) 0%,transparent 55%),radial-gradient(ellipse at 85% 100%,rgba(37,84,184,0.3) 0%,transparent 55%)",
      }} />

      <div style={{ position: "relative", textAlign: "center", maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 999, padding: "6px 16px",
          fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)",
          letterSpacing: "0.04em", textTransform: "uppercase",
          backdropFilter: "blur(8px)", marginBottom: 24, ...dm,
        }}>
          <PulseDot />
          {t("hero.badge", { n: liveMatches.length })}
        </div>

        <h1 style={{
          ...sora, fontWeight: 800, fontSize: "clamp(32px,5vw,58px)",
          lineHeight: 1.05, letterSpacing: "-0.03em", color: "#fff", marginBottom: 18,
        }}>
          {(() => {
            const full = t("hero.title");
            const em   = t("hero.title.em");
            const idx  = full.lastIndexOf(em);
            if (idx === -1) return full;
            return (
              <>
                {full.slice(0, idx)}
                <em style={{ fontStyle: "normal", color: "#FCD34D" }}>{em}</em>
                {full.slice(idx + em.length)}
              </>
            );
          })()}
        </h1>

        <p style={{ fontSize: "clamp(14px,2vw,17px)", color: "rgba(255,255,255,0.72)", maxWidth: 540, margin: "0 auto 36px", lineHeight: 1.65, ...dm }}>
          {t("hero.body")}
        </p>

        <div style={{
          background: "rgba(255,255,255,0.10)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.18)", borderRadius: 16,
          padding: "8px 8px 8px 20px", maxWidth: 680, margin: "0 auto 20px",
          display: "flex", alignItems: "center", gap: 8,
        }} className="wc26-hero-search">
          <input
            value={search.match}
            onChange={e => setSearch(s => ({ ...s, match: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleFind()}
            placeholder={t("hero.search.placeholder")}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontSize: 15, color: "#fff", fontWeight: 500, ...dm,
            }}
          />
          <Button variant="accent" size="md" onClick={handleFind} style={{ boxShadow: "0 4px 16px rgba(232,48,42,0.45)" }}>
            {t("hero.search.btn")}
          </Button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 36 }}>
          {PILLS.map(({ Icon, key }) => (
            <div key={key} style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)",
              background: "rgba(255,255,255,0.10)", borderRadius: 999,
              padding: "6px 14px", ...dm,
            }}>
              <Icon size={13} />{t(key)}
            </div>
          ))}
        </div>

        <div className="wc26-hero-ctas" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <Button variant="white" size="lg" onClick={() => navigate("/marketplace")}>
            {t("hero.cta.browse")}
          </Button>
          <Button variant="primary" size="lg" onClick={() => navigate("/register?role=seller")}>
            {t("hero.cta.sell")} <ArrowRight size={16} />
          </Button>
        </div>

        <div className="wc26-hero-stats" style={{ display: "flex", justifyContent: "center", gap: 0, marginTop: 56, flexWrap: "wrap" }}>
          {STATS.map(([val, label], i) => (
            <div key={label} style={{
              textAlign: "center", padding: "0 28px", position: "relative",
              borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.15)" : "none",
            }}>
              <div style={{ ...sora, fontWeight: 800, fontSize: 28, color: "#fff", letterSpacing: "-0.03em" }}>{val}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 500, marginTop: 2, ...dm }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
