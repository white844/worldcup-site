import { useNavigate } from "react-router-dom";
import { C, sora, dm } from "../../tokens";
import { Button } from "../ui";
import { TRENDING_CITIES } from "../../data";
import { useI18n } from "../../context/I18nContext";

function CityCard({ c }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/marketplace?city=${encodeURIComponent(c.city)}`)}
      className="wc26-card wc26-card-hover"
      style={{ padding: "18px 16px", cursor: "pointer", position: "relative", overflow: "hidden" }}
    >
      <span style={{ fontSize: 32, marginBottom: 10, display: "block" }}>{c.flag}</span>
      <div style={{ ...sora, fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 3,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.city}</div>
      <div style={{ fontSize: 11, color: C.textSoft, display: "flex", alignItems: "center",
        gap: 4, marginBottom: 10, ...dm, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        📍 {c.stadium}
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: C.bg,
        borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: C.textMid,
        border: `1px solid ${C.border}`, ...dm, maxWidth: "100%",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.tag}</div>
    </div>
  );
}

export default function TrendingCities() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <section id="cities" style={{ background: C.bgCard, padding: "clamp(48px,8vw,72px) 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          gap: 20, marginBottom: 36, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: C.blue, marginBottom: 8, ...dm }}>
              {t("cities.label")}
            </div>
            <h2 style={{ ...sora, fontWeight: 800, fontSize: "clamp(22px,3vw,36px)",
              letterSpacing: "-0.03em", color: C.text, lineHeight: 1.1, marginBottom: 12 }}>
              {t("cities.title")}
            </h2>
            <p style={{ fontSize: "clamp(14px,2vw,16px)", color: C.textSoft,
              maxWidth: 520, lineHeight: 1.6, ...dm }}>
              {t("cities.body")}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/marketplace")}
            style={{ border: "none", background: "none", color: C.blue, fontWeight: 600, fontSize: 14, flexShrink: 0 }}>
            {t("cities.viewall")}
          </Button>
        </div>

        <div className="wc26-cities-grid">
          {TRENDING_CITIES.map(c => <CityCard key={c.city} c={c} />)}
        </div>
      </div>
    </section>
  );
}
