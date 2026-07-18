import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { C, sora, dm } from "../../tokens";
import { Button } from "../ui";
import { useI18n } from "../../context/I18nContext";

export default function GuaranteeBanner() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div style={{ background: `linear-gradient(135deg,${C.blue} 0%,${C.navyMid} 100%)`, padding: "clamp(36px,6vw,56px) 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.bluePale, marginBottom: 8, ...dm }}>
            <ShieldCheck size={12} /> {t("guarantee.label")}
          </div>
          <h3 style={{ ...sora, fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 10, lineHeight: 1.2 }}>{t("guarantee.title")}</h3>
          <p style={{ fontSize: "clamp(13px,2vw,16px)", color: "rgba(255,255,255,0.7)", maxWidth: 480, lineHeight: 1.6, ...dm }}>{t("guarantee.body")}</p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flexShrink: 0, width: "100%", maxWidth: 400 }} className="wc26-guarantee-btn-group">
          <Button variant="white" size="xl" onClick={() => navigate("/guarantee")} style={{ flex: "1 1 140px" }}>
            {t("guarantee.how")}
          </Button>
          <Button variant="ghost" size="xl" onClick={() => navigate("/marketplace")}
            style={{ color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.25)", flex: "1 1 140px" }}>
            {t("guarantee.browse")}
          </Button>
        </div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .wc26-guarantee-btn-group { max-width: 100% !important; }
          .wc26-guarantee-btn-group > button { flex: 1 1 100% !important; }
        }
      `}</style>
    </div>
  );
}
