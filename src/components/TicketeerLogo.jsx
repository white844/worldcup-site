/**
 * TicketeerLogo — Brand-accurate SVG logo component
 * Matches the Ticketeer brand identity: navy T-icon with green checkmark + wordmark
 */

// Full horizontal logo (icon + wordmark)
export function TicketeerWordmark({ height = 38, dark = false }) {
  const textColor = dark ? "#FFFFFF" : "#1B3C88";
  const subColor  = dark ? "#4ADE80" : "#16A34A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      viewBox="0 0 260 48"
      fill="none"
      aria-label="Ticketeer"
    >
      {/* ── T Icon ── */}
      {/* Navy rounded-rect background */}
      <rect x="0" y="0" width="48" height="48" rx="9" fill="#1B3C88" />

      {/* Bold italic T crossbar */}
      <rect x="6" y="10" width="36" height="8" rx="2" fill="white" />

      {/* T stem — right half, italic slant */}
      <polygon points="26,18 34,18 30,42 22,42" fill="white" />

      {/* White diagonal slash / ticket stub cut across the icon */}
      <polygon
        points="14,28 48,12 48,20 14,36"
        fill="white"
        opacity="0.18"
      />

      {/* Green checkmark badge (bottom-right of icon) */}
      <circle cx="37" cy="36" r="10" fill="#16A34A" />
      {/* Checkmark tick */}
      <polyline
        points="31,36 35,40 43,30"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Wordmark ── */}
      <text
        x="58"
        y="32"
        fontFamily="'Sora', 'Segoe UI', sans-serif"
        fontWeight="800"
        fontSize="26"
        letterSpacing="0.5"
        fill={textColor}
      >
        Ticketeer
      </text>

      {/* Tagline */}
      <text
        x="59"
        y="44"
        fontFamily="'DM Sans', sans-serif"
        fontWeight="700"
        fontSize="9"
        letterSpacing="1.2"
        fill={subColor}
      >
        ✓ VERIFIED MARKETPLACE
      </text>
    </svg>
  );
}

// Square favicon / icon-only version
export function TicketeerIcon({ size = 38 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-label="Ticketeer icon"
    >
      {/* Navy background */}
      <rect width="48" height="48" rx="9" fill="#1B3C88" />

      {/* Bold T crossbar */}
      <rect x="6" y="10" width="36" height="8" rx="2" fill="white" />

      {/* T stem */}
      <polygon points="26,18 34,18 30,42 22,42" fill="white" />

      {/* Subtle diagonal slash */}
      <polygon
        points="14,28 48,12 48,20 14,36"
        fill="white"
        opacity="0.18"
      />

      {/* Green checkmark badge */}
      <circle cx="37" cy="36" r="10" fill="#16A34A" />
      <polyline
        points="31,36 35,40 43,30"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
