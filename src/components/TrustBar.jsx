import { ShieldCheck, Lock, BadgeCheck, Zap } from "lucide-react";
import { C, dm } from "../tokens";
import { useI18n } from "../context/I18nContext";

export default function TrustBar() {
  const { t } = useI18n();

  const BADGES = [
    { Icon: ShieldCheck, key: "trustbar.protection" },
    { Icon: Lock,        key: "trustbar.payments"   },
    { Icon: BadgeCheck,  key: "trustbar.sellers"    },
    { Icon: Zap,         key: "trustbar.delivery"   },
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
          {BADGES.map(({ Icon, key }) => (
            <span key={key} style={{
              display: "flex", alignItems: "center", gap: 5,
              opacity: 0.9, whiteSpace: "nowrap", flexShrink: 0,
            }}>
              <Icon size={13} style={{ color: C.live }} />
              {t(key)}
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
