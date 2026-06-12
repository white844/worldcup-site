// ─────────────────────────────────────────────────
// tokens.js  —  SINGLE SOURCE OF TRUTH
//
// RULES (enforced by convention):
//  1. Every color in the UI comes from C.*
//  2. "#fff" and "#000" are the ONLY allowed raw color literals
//     (they are universally understood and never change)
//  3. All font usage via ...sora or ...dm spreads
//  4. All shadows via C.shadow*
//  5. All interactive states via GLOBAL_CSS classes
//  6. Never add a new color here without a semantic name
// ─────────────────────────────────────────────────

export const C = {
  // ─── Brand / Core palette ─────────────────────
  navy:         "#0E1B3D",
  navyMid:      "#162650",
  navyLight:    "#1a2d5f",
  navyAlt:      "#22356E",
  blue:         "#1B3C88",
  blueDark:     "#2E4EAC",
  blueLight:    "#2554B8",
  accent:       "#E8302A",
  accentDark:   "#c0201b",
  gold:         "#F59E0B",
  goldBg:       "#FFFBEB",
  goldDark:     "#D97706",
  green:        "#16A34A",
  greenBg:      "#DCFCE7",
  greenText:    "#15803D",
  greenBorder:  "#86EFAC",
  purple:       "#8B5CF6",
  purpleLight:  "#A78BFA",
  whatsapp:     "#25D366",
  whatsappDark: "#128C7E",
  liveRed:      "#EF4444",
  liveRedDark:  "#B91C1C",

  // ─── Semantic surface colours ─────────────────
  infoBg:       "#EEF3FF",
  infoBorder:   "#C7D2FE",
  infoText:     "#1B3C88",

  dangerBg:     "#FEF2F2",
  dangerBorder: "#FECACA",
  dangerText:   "#B91C1C",
  dangerLight:  "#FCA5A5",   // light red for dark-bg badges

  warnBg:       "#FFF7ED",
  warnBorder:   "#FED7AA",
  warnText:     "#92400E",

  // ─── Accent tints (dark-background use only) ──
  live:         "#4ADE80",
  liveGlow:     "rgba(74,222,128,0.35)",
  highlight:    "#FCD34D",
  bluePale:     "#93C5FD",

  // ─── Neutral surfaces ─────────────────────────
  bg:           "#F4F6FB",
  bgSubtle:     "#F8FAFC",
  bgCard:       "#FFFFFF",
  text:         "#0F172A",
  textMid:      "#334155",
  textSoft:     "#64748B",
  border:       "#E2E8F0",
  borderMid:    "#CBD5E1",

  // ─── Elevation ────────────────────────────────
  shadowSm:         "0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.06)",
  shadowMd:         "0 4px 16px rgba(15,23,42,0.10), 0 2px 6px rgba(15,23,42,0.06)",
  shadowLg:         "0 12px 40px rgba(15,23,42,0.14), 0 4px 12px rgba(15,23,42,0.08)",
  shadowHero:       "0 16px 48px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15)",
  shadowBlue:       "0 4px 16px rgba(27,60,136,0.30)",
  shadowBlueHover:  "0 8px 28px rgba(27,60,136,0.40)",
  shadowRed:        "0 4px 16px rgba(232,48,42,0.40)",
};

// ─── Typography spreads ────────────────────────────
// Always use ...sora or ...dm in style objects. Never write fontFamily inline.
export const sora = { fontFamily: "'Sora', sans-serif" };
export const dm   = { fontFamily: "'DM Sans', sans-serif" };

// ─── Focus ring shadows (FormField) ───────────────
export const FOCUS_SHADOWS = {
  error:  "0 0 0 3px rgba(232,48,42,0.10)",
  active: "0 0 0 3px rgba(27,60,136,0.12)",
};

// ─── Spacing scale ─────────────────────────────────
// Use SP.* instead of raw numbers for padding/margin/gap.
// This keeps the spatial rhythm consistent.
export const SP = {
  0:  0,
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  7:  28,
  8:  32,
  10: 40,
  12: 48,
  14: 56,
  18: 72,
  20: 80,
};

// ─── Border radius scale ───────────────────────────
export const R = {
  sm:   8,
  md:   10,
  lg:   14,
  xl:   16,
  full: 999,
};

// ─── Font URL ──────────────────────────────────────
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap";

// ─── Global CSS ────────────────────────────────────
// All interactive states live here. Never use onMouseEnter/onMouseLeave.
// All colors come from C.*. Never hardcode hex in this string.
export const GLOBAL_CSS = `
  @import url('${FONTS_URL}');

  /* ═══════════════════════════════════════════════
     EASING TOKENS
     Use these instead of default CSS easings — the
     built-in curves are too weak to feel intentional.
  ════════════════════════════════════════════════ */
  :root {
    --ease-out:    cubic-bezier(0.23, 1, 0.32, 1);
    --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
    --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
  }

  /* ═══════════════════════════════════════════════
     GLOBAL RESET & BASE
  ════════════════════════════════════════════════ */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    overflow-x: hidden;
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }
  body {
    font-family: 'DM Sans', sans-serif;
    background: ${C.bg};
    color: ${C.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-width: 320px;
  }
  a { text-decoration: none; color: inherit; }
  button { font-family: inherit; }
  img { max-width: 100%; height: auto; display: block; }
  input, button, select, textarea {
    max-width: 100%;
    font-family: inherit;
  }
  .wc26-page-root { overflow-x: hidden; }

  /* ═══════════════════════════════════════════════
     ANIMATIONS
  ════════════════════════════════════════════════ */
  @keyframes wc26-pulse       { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:0} }
  @keyframes wc26-slide       { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes wc26-spin        { to{transform:rotate(360deg)} }
  @keyframes wc26-fadein      { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes wc26-card-in     { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes wc26-fadeout     { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(0.97)} }
  @keyframes wc26-pulse-live  { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes wc26-modal-in    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes wc26-modal-out   { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(16px)} }

  /* Respect reduced-motion preference: keep opacity/color transitions
     for comprehension, drop continuous pulsing and position movement. */
  @media (prefers-reduced-motion: reduce) {
    .wc26-live-pulse, .wc26-status-pulse, .wc26-pulse-dot-glow, .wc26-soon-dot, .wc26-next-dot {
      animation: none !important;
      opacity: 1 !important;
    }
    .wc26-card-hover:hover {
      transform: none !important;
    }
  }

  /* ═══════════════════════════════════════════════
     TYPOGRAPHY
  ════════════════════════════════════════════════ */
  .wc26-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${C.textSoft};
    font-family: 'DM Sans', sans-serif;
  }

  /* ═══════════════════════════════════════════════
     BUTTONS
  ════════════════════════════════════════════════ */
  .wc26-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    transition: transform 0.15s var(--ease-out), box-shadow 0.15s var(--ease-out),
                background 0.15s var(--ease-out), border-color 0.15s var(--ease-out),
                opacity 0.15s var(--ease-out);
    white-space: nowrap;
    line-height: 1;
  }
  .wc26-btn-primary   { background: linear-gradient(135deg,${C.blue},${C.blueDark}); color: #fff; box-shadow: ${C.shadowBlue}; }
  .wc26-btn-primary:hover   { opacity: 0.92; transform: translateY(-1px); box-shadow: ${C.shadowBlueHover}; }
  .wc26-btn-secondary { background: ${C.bgCard}; color: ${C.textMid}; border: 1px solid ${C.borderMid}; }
  .wc26-btn-secondary:hover { background: ${C.bg}; color: ${C.text}; border-color: ${C.border}; }
  .wc26-btn-ghost     { background: transparent; color: ${C.textMid}; border: 1px solid ${C.borderMid}; }
  .wc26-btn-ghost:hover { background: ${C.bg}; color: ${C.text}; }
  .wc26-btn-danger    { background: ${C.dangerBg}; color: ${C.accent}; border: 1px solid ${C.dangerBorder}; }
  .wc26-btn-danger:hover { background: #FEE2E2; }
  .wc26-btn-signout   { background: transparent; color: ${C.textMid}; border: 1px solid ${C.borderMid}; }
  .wc26-btn-signout:hover { background: ${C.dangerBg}; color: ${C.accent}; border-color: ${C.dangerBorder}; }
  .wc26-btn-white     { background: #fff; color: ${C.blue}; border: none; box-shadow: 0 4px 20px rgba(0,0,0,0.20); }
  .wc26-btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.25); }

  /* Press feedback: every button variant compresses slightly on press,
     and responds faster than it expands (80ms vs 150ms). */
  .wc26-btn:active {
    transform: scale(0.98);
    transition-duration: 80ms;
  }
  .wc26-btn-white:active { transform: scale(0.98); }

  /* Button sizes */
  .wc26-btn-sm  { font-size: 12px; padding: 6px 12px; border-radius: 8px; min-height: 32px; }
  .wc26-btn-md  { font-size: 13px; padding: 9px 18px; border-radius: 10px; min-height: 38px; }
  .wc26-btn-lg  { font-size: 15px; padding: 13px 26px; border-radius: 10px; min-height: 46px; }
  .wc26-btn-xl  { font-size: 15px; padding: 14px 32px; border-radius: 999px; min-height: 50px; }
  .wc26-btn-full { width: 100%; }

  /* Mobile: thumb-friendly tap targets */
  @media (max-width: 640px) {
    .wc26-btn-sm { min-height: 36px; }
    .wc26-btn-md { min-height: 40px; }
    .wc26-btn-lg { min-height: 44px; }
    .wc26-btn-xl { min-height: 48px; }
    button { min-height: 36px; }
  }

  /* ═══════════════════════════════════════════════
     CARDS
  ════════════════════════════════════════════════ */
  .wc26-card { background: ${C.bgCard}; border: 1px solid ${C.border}; border-radius: 14px; }
  .wc26-card-hover { transition: box-shadow 0.2s var(--ease-out), transform 0.2s var(--ease-out); cursor: pointer; }
  @media (hover: hover) and (pointer: fine) {
    .wc26-card-hover:hover { box-shadow: ${C.shadowLg}; transform: translateY(-3px); }
  }

  /* ═══════════════════════════════════════════════
     STATUS PILLS
  ════════════════════════════════════════════════ */
  .wc26-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
  }
  .wc26-pill-sm  { padding: 2px 8px; font-size: 10px; }
  .wc26-pill-md  { padding: 4px 10px; font-size: 11px; }
  .wc26-pill-info    { background: ${C.infoBg};   color: ${C.blue};      border: 1px solid ${C.infoBorder};   }
  .wc26-pill-success { background: ${C.greenBg};  color: ${C.greenText}; border: 1px solid ${C.greenBorder};  }
  .wc26-pill-danger  { background: ${C.dangerBg}; color: ${C.dangerText};border: 1px solid ${C.dangerBorder}; }
  .wc26-pill-warn    { background: ${C.warnBg};   color: ${C.warnText};  border: 1px solid ${C.warnBorder};   }

  /* ═══════════════════════════════════════════════
     NAVIGATION
  ════════════════════════════════════════════════ */
  .wc26-nav-link { color: ${C.textMid}; transition: color 0.15s; background: none; border: none; cursor: pointer; }
  .wc26-nav-link:hover { color: ${C.blue}; }
  .wc26-link-blue { color: ${C.blue}; transition: color 0.15s; }
  .wc26-link-blue:hover { color: ${C.blueLight}; }

  /* Desktop nav / mobile hamburger visibility */
  .wc26-nav-desktop { display: flex; }
  .wc26-hide-mobile { display: flex; }
  .wc26-show-mobile { display: none; }
  @media (max-width: 760px) {
    .wc26-nav-desktop { display: none !important; }
    .wc26-hide-mobile { display: none !important; }
    .wc26-show-mobile { display: flex !important; }
  }

  /* ═══════════════════════════════════════════════
     FOOTER
  ════════════════════════════════════════════════ */
  .wc26-footer-link {
    color: rgba(255,255,255,0.5);
    font-size: 13px;
    transition: color 0.15s;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    min-height: 32px;
    display: inline-flex;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    text-align: left;
  }
  .wc26-footer-link:hover { color: #fff; }

  .wc26-footer-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 36px;
  }
  @media (max-width: 900px) {
    .wc26-footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
  }
  @media (max-width: 540px) {
    .wc26-footer-grid { grid-template-columns: 1fr; gap: 24px; }
  }

  /* ═══════════════════════════════════════════════
     INTERACTIVE STATES
  ════════════════════════════════════════════════ */
  .wc26-search-field:hover { background: ${C.bg}; }
  .wc26-filter-row { transition: background 0.15s; }
  .wc26-filter-row:hover { background: ${C.bgSubtle} !important; }
  .wc26-activity-item { transition: background 0.2s; }
  .wc26-activity-item:hover { background: rgba(255,255,255,0.1) !important; }

  /* ═══════════════════════════════════════════════
     LAYOUT CONTAINERS
  ════════════════════════════════════════════════ */
  /* Standard max-width wrapper */
  .wc26-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
    width: 100%;
  }
  @media (max-width: 480px) {
    .wc26-container { padding: 0 16px; }
  }

  /* ═══════════════════════════════════════════════
     HERO SECTION
  ════════════════════════════════════════════════ */
  .wc26-hero-search {
    background: rgba(255,255,255,0.10);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 16px;
    padding: 8px 8px 8px 20px;
    max-width: 680px;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  @media (max-width: 600px) {
    .wc26-hero-search {
      flex-direction: column;
      padding: 12px;
      gap: 10px;
    }
    .wc26-hero-search input {
      width: 100%;
      text-align: center;
    }
    .wc26-hero-search button {
      width: 100%;
      justify-content: center;
    }
  }

  .wc26-hero-ctas {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  @media (max-width: 480px) {
    .wc26-hero-ctas {
      flex-direction: column;
      align-items: stretch;
      padding: 0 20px;
    }
    .wc26-hero-ctas button,
    .wc26-hero-ctas a {
      width: 100%;
      justify-content: center;
      text-align: center;
    }
  }

  .wc26-hero-stats {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0;
    margin-top: 56px;
  }
  @media (max-width: 480px) {
    .wc26-hero-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding: 0 16px;
    }
    .wc26-hero-stats > div {
      border-left: none !important;
      padding: 12px !important;
      background: rgba(255,255,255,0.06);
      border-radius: 12px;
    }
  }

  /* ═══════════════════════════════════════════════
     STAGGER ANIMATION UTILITY
     Apply with style={{ '--i': index }} on each item
     (capped at index 5 to keep stagger snappy).
  ════════════════════════════════════════════════ */
  .wc26-stagger-item {
    opacity: 0;
    animation: wc26-fadein 0.3s var(--ease-out) forwards;
    animation-delay: calc(min(var(--i, 0), 5) * 50ms);
  }
  @media (prefers-reduced-motion: reduce) {
    .wc26-stagger-item { animation: none; opacity: 1; }
  }

  /* ═══════════════════════════════════════════════
     MATCH CARD — hover lift (CSS-driven, no JS state)
  ════════════════════════════════════════════════ */
  .wc26-match-card {
    transition: box-shadow 0.2s var(--ease-out), border-color 0.2s var(--ease-out), transform 0.2s var(--ease-out);
  }
  @media (hover: hover) and (pointer: fine) {
    .wc26-match-card:not(.wc26-match-card-static):hover {
      transform: translateY(-3px);
      box-shadow: ${C.shadowLg};
    }
  }

  /* ═══════════════════════════════════════════════
     WHATSAPP CONTACT BUTTON
  ════════════════════════════════════════════════ */
  .wc26-whatsapp-btn {
    transition: transform 0.15s var(--ease-out), box-shadow 0.15s var(--ease-out);
    box-shadow: 0 3px 12px rgba(37,211,102,0.30);
  }
  @media (hover: hover) and (pointer: fine) {
    .wc26-whatsapp-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(37,211,102,0.45);
    }
  }
  .wc26-whatsapp-btn:active {
    transform: scale(0.98);
    transition-duration: 80ms;
  }

  /* ═══════════════════════════════════════════════
     FEATURED MATCHES (homepage)
  ════════════════════════════════════════════════ */
  .wc26-featured-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 1100px) {
    .wc26-featured-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 900px) {
    .wc26-featured-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 600px) {
    .wc26-featured-grid {
      display: flex;
      overflow-x: auto;
      gap: 12px;
      padding-bottom: 12px;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
    }
    .wc26-featured-grid > * {
      min-width: 280px;
      max-width: 300px;
      scroll-snap-align: start;
      flex-shrink: 0;
    }
  }

  /* ═══════════════════════════════════════════════
     LIVE ACTIVITY SECTION
  ════════════════════════════════════════════════ */
  .wc26-activity-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  @media (max-width: 540px) {
    .wc26-activity-grid { grid-template-columns: 1fr; gap: 8px; }
  }

  /* ═══════════════════════════════════════════════
     TRUST SECTION
  ════════════════════════════════════════════════ */
  .wc26-trust-desktop { display: block; }
  .wc26-trust-mobile  { display: none; }
  @media (max-width: 760px) {
    .wc26-trust-desktop { display: none; }
    .wc26-trust-mobile  { display: block; }
  }

  .wc26-trust-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 900px) {
    .wc26-trust-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  }
  @media (max-width: 580px) {
    .wc26-trust-grid { grid-template-columns: 1fr; gap: 10px; }
  }

  /* ═══════════════════════════════════════════════
     TRENDING CITIES
  ════════════════════════════════════════════════ */
  .wc26-cities-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  @media (max-width: 900px) {
    .wc26-cities-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    .wc26-cities-grid { grid-template-columns: 1fr; }
  }

  /* ═══════════════════════════════════════════════
     URGENCY BAR
  ════════════════════════════════════════════════ */
  .wc26-urgency-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 10px 20px;
    flex-wrap: wrap;
  }
  @media (max-width: 480px) {
    .wc26-urgency-bar { gap: 8px; padding: 8px 16px; font-size: 12px !important; }
  }

  /* ═══════════════════════════════════════════════
     NEXT MATCH BANNER
  ════════════════════════════════════════════════ */
  .wc26-next-banner-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  @media (max-width: 600px) {
    .wc26-next-banner-inner { flex-direction: column; align-items: flex-start; gap: 10px; }
  }

  /* ═══════════════════════════════════════════════
     MARKETPLACE PAGE
  ════════════════════════════════════════════════ */
  /* Hero search row (within marketplace hero) */
  .wc26-hero-search-row {
    max-width: 620px;
    display: flex;
    gap: 8px;
  }
  @media (max-width: 760px) {
    .wc26-hero-search-row { display: none !important; }
  }

  /* Filter bar — show toggle on mobile, full bar on desktop */
  .wc26-filters-toggle-row {
    display: none;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    gap: 12px;
  }
  .wc26-filters-body { display: block; }
  @media (max-width: 640px) {
    .wc26-filters-toggle-row { display: flex !important; }
    .wc26-filters-body { display: none; padding: 12px 16px !important; }
    .wc26-filters-body.wc26-filters-open { display: block; }
  }

  /* FilterBar scroll on small screens */
  .wc26-filterbar-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  @media (max-width: 640px) {
    .wc26-filterbar-row {
      flex-wrap: nowrap;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 4px;
      gap: 6px;
    }
    .wc26-filterbar-row > * { flex-shrink: 0; }
    .wc26-filterbar-row::-webkit-scrollbar { display: none; }
  }

  /* Results header row */
  .wc26-results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 24px;
  }
  @media (max-width: 480px) {
    .wc26-results-header { flex-direction: column; align-items: flex-start; }
    .wc26-results-header > div { width: 100%; justify-content: space-between; }
  }

  /* Match cards grid */
  .wc26-cards-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  @media (max-width: 400px) {
    .wc26-cards-grid { grid-template-columns: 1fr; gap: 12px; }
  }

  /* List view override */
  .wc26-cards-list {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
  }

  /* Sell CTA banner */
  .wc26-sell-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
  }
  @media (max-width: 600px) {
    .wc26-sell-banner { flex-direction: column; align-items: stretch; text-align: center; }
    .wc26-sell-banner button { width: 100%; justify-content: center; }
  }

  /* Pagination */
  .wc26-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 48px;
    flex-wrap: wrap;
  }

  /* ═══════════════════════════════════════════════
     TICKET DETAIL PAGE
  ════════════════════════════════════════════════ */
  .wc26-detail-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 32px;
    align-items: start;
  }
  @media (max-width: 960px) {
    .wc26-detail-grid { grid-template-columns: 1fr; gap: 24px; }
  }

  .wc26-sticky-panel {
    position: sticky;
    top: calc(64px + 12px);
  }
  @media (max-width: 960px) {
    .wc26-sticky-panel { position: static; }
  }

  .wc26-match-info-strip {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 480px) {
    .wc26-match-info-strip { grid-template-columns: 1fr; }
    .wc26-match-info-strip > div:first-child {
      border-right: none !important;
      border-bottom: 1px solid ${C.border};
    }
  }

  .wc26-matchup-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  @media (max-width: 420px) {
    .wc26-matchup-row { gap: 8px; }
  }

  /* Team name on detail hero — truncate gracefully */
  .wc26-team-name-hero {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: clamp(14px, 3vw, 20px) !important;
  }

  .wc26-team-flag-hero {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
  }

  /* ═══════════════════════════════════════════════
     SELLER STATS
  ════════════════════════════════════════════════ */
  .wc26-seller-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  @media (max-width: 420px) {
    .wc26-seller-stats { grid-template-columns: 1fr 1fr; }
  }

  /* ═══════════════════════════════════════════════
     REGISTER / FORM PAGES
  ════════════════════════════════════════════════ */
  .wc26-register-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 540px) {
    .wc26-register-grid { grid-template-columns: 1fr; }
  }

  /* ═══════════════════════════════════════════════
     GUARANTEE PAGE
  ════════════════════════════════════════════════ */
  .wc26-guarantee-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  @media (max-width: 760px) {
    .wc26-guarantee-steps { grid-template-columns: 1fr; gap: 16px; }
  }

  /* ═══════════════════════════════════════════════
     MODALS & OVERLAYS
  ════════════════════════════════════════════════ */
  .wc26-modal-inner {
    background: #fff;
    border-radius: 20px;
    width: 100%;
    max-width: 480px;
    max-height: 92vh;
    overflow-y: auto;
  }
  @media (max-width: 540px) {
    .wc26-modal-inner {
      border-radius: 16px 16px 0 0;
      max-height: 92dvh;
      margin-top: auto;
    }
  }

  /* Asymmetric modal timing: enter slower with the drawer curve,
     exit faster and snappier (system responding to dismissal). */
  .wc26-modal-entering {
    animation: wc26-modal-in 0.25s var(--ease-drawer);
  }
  .wc26-modal-exiting {
    animation: wc26-modal-out 0.15s ease-out forwards;
  }

  /* ═══════════════════════════════════════════════
     TOAST
  ════════════════════════════════════════════════ */
  .wc26-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    max-width: calc(100vw - 48px);
  }
  @media (max-width: 480px) {
    .wc26-toast {
      bottom: 16px;
      right: 16px;
      left: 16px;
      max-width: none;
    }
  }

  /* ═══════════════════════════════════════════════
     INFO BANNER
  ════════════════════════════════════════════════ */
  .wc26-info-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    padding: 12px 20px;
  }
  @media (max-width: 540px) {
    .wc26-info-banner { flex-direction: column; align-items: flex-start; gap: 8px; }
  }

  /* ═══════════════════════════════════════════════
     UTILITY: HIDE/SHOW
  ════════════════════════════════════════════════ */
  @media (max-width: 640px) {
    .wc26-page-container { padding-left: 16px !important; padding-right: 16px !important; }
    .wc26-hide-sm { display: none !important; }
  }
  @media (max-width: 480px) {
    .wc26-hide-xs { display: none !important; }
  }
  @media (min-width: 641px) {
    .wc26-show-sm-only { display: none !important; }
  }

  /* ═══════════════════════════════════════════════
     NAVBAR SELL BUTTON
  ════════════════════════════════════════════════ */
  .wc26-sell-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border-radius: 10px;
    background: linear-gradient(135deg, ${C.blue}, ${C.blueDark});
    border: none;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s var(--ease-out), box-shadow 0.15s var(--ease-out), opacity 0.15s var(--ease-out);
    box-shadow: ${C.shadowBlue};
    font-family: 'DM Sans', sans-serif;
  }
  @media (hover: hover) and (pointer: fine) {
    .wc26-sell-btn:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }
  }
  .wc26-sell-btn:active {
    transform: scale(0.98);
    transition-duration: 80ms;
  }

  /* ═══════════════════════════════════════════════
     TICKET DETAIL — SECTION PADDING HELPERS
  ════════════════════════════════════════════════ */
  /* Responsive padding handled inline via clamp(); class allows mobile override */
  .wc26-detail-hero-section { /* padding set inline */ }
  .wc26-detail-body-section { /* padding set inline */ }
  .wc26-detail-panel { /* padding set inline via component */ }
  @media (max-width: 640px) {
    .wc26-detail-hero-section { padding: 20px 16px !important; }
    .wc26-detail-body-section { padding: 16px !important; }
    .wc26-detail-panel { padding: 16px !important; }
  }

  /* ═══════════════════════════════════════════════
     REGISTER / FORM GRIDS
  ════════════════════════════════════════════════ */
  .wc26-reg-tabs {
    display: flex;
    gap: 12px;
    margin-bottom: 28px;
  }
  .wc26-reg-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  @media (max-width: 520px) {
    .wc26-reg-tabs { flex-direction: column; }
    .wc26-reg-grid { grid-template-columns: 1fr; }
  }
`;

// ─── Site metadata ─────────────────────────────────────────────────────────
export const SITE_TITLE = "Ticketeer | World Cup 2026 Tickets";

/**
 * setPageMeta — sets <title> and <meta name="description"> in one call.
 * Call inside useEffect per page. Returns a cleanup fn to restore defaults.
 */
const DEFAULT_DESC = "Buy and sell World Cup 2026 tickets safely. Every listing manually verified by our admin team. 100% buyer protection guaranteed.";
export function setPageMeta(title, description = DEFAULT_DESC) {
  document.title = title;
  let tag = document.querySelector("meta[name='description']");
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = "description";
    document.head.appendChild(tag);
  }
  tag.content = description;
  return () => { document.title = SITE_TITLE; tag.content = DEFAULT_DESC; };
}

