/**
 * InfoBanner — coloured status strip used for:
 *   variant="info"    → blue  (trust/security messages)
 *   variant="success" → green (confirmations)
 *   variant="danger"  → red   (errors)
 *   variant="warning" → amber (alerts)
 */
import { C, dm } from "../tokens";

const VARIANTS = {
  info:    { bg: C.infoBg,    border: C.infoBorder,    color: C.blue       },
  success: { bg: C.greenBg,   border: C.greenBorder,   color: C.greenText  },
  danger:  { bg: C.dangerBg,  border: C.dangerBorder,  color: C.dangerText },
  warning: { bg: C.warnBg,    border: C.warnBorder,    color: C.warnText   },
};

export default function InfoBanner({ variant = "info", icon: Icon, children, style }) {
  const v = VARIANTS[variant];
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:8,
      padding:"10px 14px", borderRadius:10,
      background:v.bg, border:`1px solid ${v.border}`,
      ...style,
    }}>
      {Icon && <Icon size={14} style={{ color:v.color, flexShrink:0 }} />}
      <span style={{ fontSize:13, fontWeight:600, color:v.color, ...dm }}>
        {children}
      </span>
    </div>
  );
}
