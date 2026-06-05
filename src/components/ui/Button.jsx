/**
 * Button — ENFORCED UI PRIMITIVE
 *
 * All interactive buttons in the app must use this component.
 * Never use a raw <button> or <a> styled as a button outside this file.
 *
 * Props:
 *   variant  — "primary" | "secondary" | "ghost" | "danger" | "signout" | "white"
 *   size     — "sm" | "md" | "lg" | "xl"
 *   full     — boolean, full-width
 *   as       — "button" | "a" (renders as anchor when href is needed)
 *   href     — string (used with as="a")
 *   target   — string (used with as="a")
 *   loading  — boolean, shows spinner
 *   disabled — boolean
 *   onClick  — handler
 *   className — additional classes
 */
import { dm } from "../../tokens";

const SPINNER = (
  <svg style={{ animation:"wc26-spin 0.8s linear infinite", flexShrink:0 }} width={15} height={15} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export default function Button({
  children,
  variant  = "secondary",
  size     = "md",
  full     = false,
  as       = "button",
  href,
  target,
  rel,
  loading  = false,
  disabled = false,
  onClick,
  className = "",
  type     = "button",
  style,   // escape hatch: use sparingly and only for layout (width, margin)
}) {
  const classes = [
    "wc26-btn",
    `wc26-btn-${variant}`,
    `wc26-btn-${size}`,
    full ? "wc26-btn-full" : "",
    className,
  ].filter(Boolean).join(" ");

  const props = {
    className: classes,
    onClick,
    style: { ...dm, ...style },
    "aria-disabled": disabled || loading,
  };

  if (disabled || loading) {
    props.style = { ...props.style, opacity: 0.6, cursor: "not-allowed", pointerEvents: "none" };
  }

  if (as === "a") {
    return (
      <a href={disabled || loading ? undefined : href} target={target} rel={rel} {...props}>
        {loading ? SPINNER : children}
      </a>
    );
  }

  return (
    <button type={type} {...props} disabled={disabled || loading}>
      {loading ? <>{SPINNER}{children}</> : children}
    </button>
  );
}
