/**
 * Card — ENFORCED UI PRIMITIVE
 *
 * All card-shaped containers in the app must use this component.
 * Never use a raw <div> with wc26-card class outside this file.
 *
 * Props:
 *   hover    — boolean, adds lift-on-hover animation
 *   onClick  — makes the card interactive (adds cursor:pointer)
 *   padding  — number (px) or string, default 0 (let children control)
 *   radius   — number (px), default 14
 *   shadow   — "sm" | "md" | "lg" | false
 *   border   — CSS border string or true (default border) or false (no border)
 *   style    — escape hatch for layout positioning only
 *   className — additional class names
 *   as       — default "div"
 */
import { C } from "../../tokens";

const SHADOWS = { sm: C.shadowSm, md: C.shadowMd, lg: C.shadowLg };

export default function Card({
  children,
  hover     = false,
  onClick,
  padding   = 0,
  radius    = 14,
  shadow    = false,
  border    = true,
  style,
  className = "",
  as: Tag   = "div",
}) {
  const borderValue = border === true
    ? `1px solid ${C.border}`
    : border === false
    ? "none"
    : border;  // custom border string

  const classes = [
    "wc26-card",
    hover ? "wc26-card-hover" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <Tag
      className={classes}
      onClick={onClick}
      style={{
        padding,
        borderRadius: radius,
        border: borderValue,
        boxShadow: shadow ? SHADOWS[shadow] : undefined,
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
