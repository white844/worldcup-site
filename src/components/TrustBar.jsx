import { C, dm } from "../tokens";
import { useI18n } from "../context/I18nContext";

export default function TrustBar() {
  const { t } = useI18n();

  const BADGES = [
    { icon: "🛡", key: "trustbar.protection" },
    { icon: "🔒", key: "trustbar.payments"   },
    { icon: "✓",  key: "trustbar.sellers"    },
    { icon: "⚡", key: "trustbar.delivery"   },
  ];

  return (
    <div style={{ background: C.navy, color: "#fff", ...dm, fontSize: 12, fontWeight: 500 }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto", padding: "9px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 8,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          overflowX: "auto", WebkitOverflowScrolling: "touch",
        }}>
          {BADGES.map(b => (
            <span key={b.key} style={{
              display: "flex", alignItems: "center", gap: 5,
              opacity: 0.9, whiteSpace: "nowrap", flexShrink: 0,
            }}>
              <span style={{ color: C.live, fontSize: 13 }}>{b.icon}</span>
              {t(b.key)}
            </span>
          ))}
        </div>
        <span style={{ opacity: 0.5, fontSize: 11, whiteSpace: "nowrap", flexShrink: 0 }}
          className="wc26-hide-xs">
          {t("trustbar.countries")}
        </span>
      </div>
    </div>
  );
}
