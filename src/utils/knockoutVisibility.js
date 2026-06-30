/**
 * knockoutVisibility.js — Central knockout match filtering
 *
 * TOGGLE: Change SHOW_KNOCKOUTS to true to instantly reveal all knockout
 * matches across the entire app without any other edits.
 *
 * Background data (team resolution, match progression) always continues
 * to run regardless of this flag — only rendering is gated.
 */

// ── Global toggle ──────────────────────────────────────────────────────────
export const SHOW_KNOCKOUTS = true;

// All round labels that qualify as knockout stage
const KNOCKOUT_ROUNDS = new Set([
  "Round of 32",
  "Round of 16",
  "Quarter-Final",
  "Semi-Final",
  "3rd Place",
  "Final",
]);

// Regex that matches unresolved team slot identifiers (W74, L101, R12, 1A, 3A/B/C)
const PLACEHOLDER_RE = /^([WLR]\d+|[123][A-L](\/[A-L])*)$/;

/**
 * isKnockoutMatch — multi-layer detection so it catches everything even
 * when individual fields are missing or inconsistent.
 *
 * Layer 1: round field (fastest — most explicit)
 * Layer 2: match id prefix  (r32_, r16_, qf_, sf_, 3rd, final)
 * Layer 3: home/away are unresolved placeholder slots (W74, L101, 1A …)
 *           → match would show meaningless labels regardless of the toggle
 */
export function isKnockoutMatch(match) {
  if (!match) return false;

  // Layer 1: round field
  if (match.round && KNOCKOUT_ROUNDS.has(match.round)) return true;

  // Layer 2: id prefix
  if (/^(r32_|r16_|qf_|sf_|3rd|final)/i.test(match.id ?? "")) return true;

  // Layer 3: placeholder team slots
  const home = match.homeRaw ?? match.home ?? "";
  const away = match.awayRaw ?? match.away ?? "";
  if (PLACEHOLDER_RE.test(home) || PLACEHOLDER_RE.test(away)) return true;

  return false;
}

/**
 * shouldShowMatch — single call-site check used in all rendering contexts.
 * Returns false when SHOW_KNOCKOUTS is off and the match is a knockout.
 * Background logic (progression, resolution) is unaffected.
 */
export function shouldShowMatch(match) {
  if (SHOW_KNOCKOUTS) return true;
  return !isKnockoutMatch(match);
}
