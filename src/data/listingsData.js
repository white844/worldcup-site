/**
 * listingsData.js — Marketplace data layer
 *
 * Match schedule: sourced from wc26Schedule.js (real FIFA 2026 fixtures)
 * Seller listings: overlaid on top of the schedule (admin-controlled)
 * To add/remove matches: edit wc26Schedule.js
 * To add/remove sellers: edit SELLERS below
 */
import {
  WC26_ALL_FIXTURES,
  WC26_FLAGS,
  WC26_VENUES,
  WC26_HIGH_DEMAND,
  WC26_ISO2,
} from "./wc26Schedule.js";

// ─── Sellers ──────────────────────────────────────
export const SELLERS = [
  { sellerId:"s01", seller:"Carlos M.",  rating:4.8, response:5,  sales:312, since:"Jan 2023", avatar:"C", avatarBg:"linear-gradient(135deg,#1B3C88,#4A62BC)", location:"Madrid, Spain",           bio:"Experienced reseller. All tickets sourced directly from official allocations. Fast delivery guaranteed." },
  { sellerId:"s02", seller:"Emma V.",    rating:4.7, response:8,  sales:187, since:"Mar 2023", avatar:"E", avatarBg:"linear-gradient(135deg,#7C3AED,#A78BFA)", location:"London, UK",              bio:"Football fan and part-time ticket reseller. Specialise in European fixtures. Always happy to answer questions." },
  { sellerId:"s03", seller:"John D.",    rating:4.9, response:3,  sales:521, since:"Nov 2022", avatar:"J", avatarBg:"linear-gradient(135deg,#059669,#10B981)", location:"São Paulo, Brazil",        bio:"Top-rated seller with 500+ completed sales. Quick to respond and always delivers on time." },
  { sellerId:"s04", seller:"Sarah K.",   rating:4.6, response:7,  sales:98,  since:"Jun 2023", avatar:"S", avatarBg:"linear-gradient(135deg,#DC2626,#F87171)", location:"New York, USA",            bio:"Casual seller — offloading tickets I can no longer use. Honest descriptions, great prices." },
  { sellerId:"s05", seller:"Pedro A.",   rating:5.0, response:2,  sales:744, since:"Sep 2022", avatar:"P", avatarBg:"linear-gradient(135deg,#D97706,#FCD34D)", avatarColor:"#92400E", location:"Buenos Aires, Argentina", bio:"Professional reseller with perfect rating. 700+ sales, zero disputes. Fastest response time on the platform." },
  { sellerId:"s06", seller:"Marie L.",   rating:4.9, response:4,  sales:263, since:"Feb 2023", avatar:"M", avatarBg:"linear-gradient(135deg,#0EA5E9,#7DD3FC)", location:"Paris, France",            bio:"French football fan selling surplus tickets. All listings are genuine — no surprises." },
  { sellerId:"s07", seller:"Hans B.",    rating:4.7, response:6,  sales:155, since:"Apr 2023", avatar:"H", avatarBg:"linear-gradient(135deg,#475569,#94A3B8)", location:"Munich, Germany",          bio:"Regular reseller based in Germany. Quick turnaround and always communicates proactively." },
  { sellerId:"s08", seller:"Yuki T.",    rating:4.8, response:5,  sales:201, since:"Jan 2023", avatar:"Y", avatarBg:"linear-gradient(135deg,#BE185D,#F472B6)", location:"Tokyo, Japan",             bio:"Long-time football supporter selling genuine tickets. Prompt delivery, always as described." },
  { sellerId:"s09", seller:"Omar S.",    rating:4.6, response:10, sales:77,  since:"Jul 2023", avatar:"O", avatarBg:"linear-gradient(135deg,#B45309,#FCD34D)", location:"Cairo, Egypt",             bio:"First-time seller with verified ID. Tickets genuine and ready to transfer on payment." },
  { sellerId:"s10", seller:"Mike T.",    rating:4.8, response:4,  sales:334, since:"Oct 2022", avatar:"M", avatarBg:"linear-gradient(135deg,#0F766E,#2DD4BF)", location:"Toronto, Canada",          bio:"Season ticket holder and reseller. Know what fans need — great seats, honest pricing." },
  { sellerId:"s11", seller:"Juan R.",    rating:4.5, response:12, sales:64,  since:"Aug 2023", avatar:"J", avatarBg:"linear-gradient(135deg,#1D4ED8,#60A5FA)", location:"Mexico City, Mexico",      bio:"Local seller with genuine tickets for Mexico fixtures. Contact me with any questions." },
  { sellerId:"s12", seller:"Ali K.",     rating:4.7, response:7,  sales:143, since:"Mar 2023", avatar:"A", avatarBg:"linear-gradient(135deg,#7C3AED,#C4B5FD)", location:"Riyadh, Saudi Arabia",     bio:"Verified seller — all tickets bought through official channels. Safe and fast." },
  { sellerId:"s13", seller:"Lena B.",    rating:4.9, response:3,  sales:408, since:"Dec 2022", avatar:"L", avatarBg:"linear-gradient(135deg,#059669,#6EE7B7)", location:"Amsterdam, Netherlands",   bio:"One of the platform's most active sellers. Impeccable track record, fast responses." },
  { sellerId:"s14", seller:"Ryo N.",     rating:4.6, response:9,  sales:88,  since:"May 2023", avatar:"R", avatarBg:"linear-gradient(135deg,#BE123C,#FDA4AF)", location:"Osaka, Japan",             bio:"Genuine fan selling spares. All tickets come with full transfer support." },
  { sellerId:"s15", seller:"Fatima A.",  rating:4.8, response:6,  sales:192, since:"Feb 2023", avatar:"F", avatarBg:"linear-gradient(135deg,#1B3C88,#818CF8)", location:"Casablanca, Morocco",      bio:"Verified Moroccan seller — especially strong for Atlas Lions fixtures. Always reliable." },
];

// ─── Seat pool ─────────────────────────────────────
export const SEAT_POOL = [
  { section:"104", row:"8",  seats:"22-23", category:"Premium Lower" },
  { section:"231", row:"15", seats:"10-11", category:"Upper Tier"    },
  { section:"117", row:"12", seats:"15-16", category:"Lower Bowl"    },
  { section:"205", row:"3",  seats:"18-19", category:"Mid-Tier"      },
  { section:"VIP", row:"1",  seats:"5-6",   category:"VIP Box"       },
  { section:"144", row:"9",  seats:"7-8",   category:"Club Level"    },
  { section:"318", row:"22", seats:"14-15", category:"General"       },
  { section:"162", row:"7",  seats:"33-34", category:"Lower Bowl"    },
  { section:"220", row:"18", seats:"6-7",   category:"General"       },
  { section:"112", row:"6",  seats:"11-12", category:"Lower Bowl"    },
  { section:"340", row:"25", seats:"8-9",   category:"Upper Tier"    },
  { section:"215", row:"14", seats:"21-22", category:"Mid-Tier"      },
];

// ─── Utilities ─────────────────────────────────────
export function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins   = Math.floor(diffMs / 60000);
  const hours  = Math.floor(mins  / 60);
  const days   = Math.floor(hours / 24);
  if (mins  < 2)  return "just now";
  if (mins  < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days  < 7)  return `${days} day${days > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
}

function fmtDate(iso) {
  const d = new Date(iso + "T12:00:00Z");
  return d.toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
  });
}

function makeListedAt(index) {
  const seed = (index * 7 + 13) % 72;
  return new Date(Date.now() - (seed + 1) * 3_600_000).toISOString();
}

// ─── Team name / flag helpers ──────────────────────────────────────────────
//
// DESIGN PRINCIPLES
//  1. stripFlagEmoji uses safe code-point iteration — NO \p{} or /u regex.
//     Works in every modern JS engine without the /u or /v flag.
//  2. normalizeTeamName gives a canonical key for all map lookups.
//     It strips emojis and collapses whitespace but preserves original casing
//     because WC26_FLAGS / WC26_ISO2 use Title Case keys.
//  3. isPlaceholderTeam identifies slots not yet resolved (W74, L101, R12,
//     1A, 3A/B/C/D/F, TBD) — callers can hide or label them appropriately.
//  4. teamFlag / splitTeam never return the 🏳️ white-flag emoji;
//     callers receive null and must render their own TBD UI.
//  5. All functions are null/undefined-safe.

/**
 * stripFlagEmoji — removes every flag-related Unicode character from a string.
 *
 * Safe code-point iteration — works in every modern JS engine without
 * the /u or /v flag and without \p{} property escapes.
 *
 * Removed code-point ranges:
 *   U+1F1E0–U+1F1FF  Regional Indicator Symbols A–Z  (pair → emoji flag 🇧🇷)
 *   U+E0000–U+E007F  Tag characters                  (subdivision flags 🏴󠁧󠁢󠁥󠁮󠁧󠁿)
 *   U+FE0F           Variation Selector-16            (emoji presentation)
 *   U+200D           Zero Width Joiner                (ZWJ sequences)
 *   U+1F3F3          🏳 White Flag
 *   U+1F3F4          🏴 Black Flag
 */
function stripFlagEmoji(str) {
  if (!str) return "";
  const out = [];
  for (const ch of str) {                    // for-of iterates full Unicode scalar values
    const cp = ch.codePointAt(0);
    if (cp >= 0x1F1E0 && cp <= 0x1F1FF) continue; // regional indicator pair (🇦–🇿)
    if (cp >= 0xE0000 && cp <= 0xE007F) continue;  // subdivision tag chars (🏴󠁧󠁢󠁥󠁮󠁧󠁿)
    if (cp === 0xFE0F)                   continue;  // VS-16 (variation selector)
    if (cp === 0x200D)                   continue;  // ZWJ
    if (cp === 0x1F3F3 || cp === 0x1F3F4) continue; // 🏳 white / 🏴 black flag glyphs
    out.push(ch);
  }
  return out.join("").trim();
}

/**
 * normalizeTeamName — canonical lookup key.
 *
 *  1. Strip all flag emojis (safe code-point iteration — no \p{} regex)
 *  2. Collapse multiple whitespace characters into one space
 *  3. Trim leading/trailing whitespace
 *
 * Casing is preserved — WC26_FLAGS / WC26_ISO2 use Title Case keys.
 * "Brazil 🇧🇷" → "Brazil"
 * "  morocco  " → "morocco"   (won't hit flags map, returns null from teamFlagImg)
 * "BRAZIL"      → "BRAZIL"    (same — use exact fixture strings, not user input)
 */
function normalizeTeamName(raw) {
  if (!raw) return "";
  return stripFlagEmoji(raw).replace(/\s{2,}/g, " ").trim();
}

/**
 * isPlaceholderTeam — true for any slot not yet resolved to a real nation.
 *
 * Returns false for real teams found in WC26_FLAGS (fast-path).
 * Returns true for:
 *   "W74"           KO match winner reference
 *   "L101"          KO match loser reference
 *   "R12"           Runner-up reference (alternate notation)
 *   "1A" / "2B"     Group position slots
 *   "3A/B/C/D/F"    Best third-place slot
 *   "" / "TBD"      Explicit unknowns
 *   null / undefined
 */
export function isPlaceholderTeam(raw) {
  if (!raw) return true;
  const name = normalizeTeamName(raw);
  if (!name || name === "TBD") return true;
  // Fast-path: known real team
  if (name in WC26_FLAGS) return false;
  // KO winner/loser/runner-up references
  if (/^[WLR]\d+$/.test(name)) return true;
  // Group position slots: "1A", "2B", "3C"
  if (/^[123][A-L]$/.test(name)) return true;
  // Best third-place combined slots: "3A/B/C/D/F"
  if (/^3[A-L](\/[A-L])+$/.test(name)) return true;
  // Any other unrecognised string is a placeholder
  return true;
}

// ─── Public helpers ────────────────────────────────────────────────────────

/** teamName — cleaned, human-readable name. "Brazil 🇧🇷" → "Brazil" */
export function teamName(raw) {
  if (!raw) return "TBD";
  const cleaned = normalizeTeamName(raw);
  return cleaned || "TBD";
}

/**
 * teamFlag — emoji flag for a real team, null for placeholders.
 * NEVER returns 🏳️ — callers render their own TBD UI on null.
 */
export function teamFlag(raw) {
  if (!raw) return null;
  const name = normalizeTeamName(raw);
  if (!name) return null;
  return WC26_FLAGS[name] ?? null;
}

/**
 * teamFlagImg — ISO 3166-1 alpha-2 code for flag image CDN.
 *
 * Returns null for placeholders/unknown teams — callers render a TBD box.
 * Returns null (not a broken code) so there is never a failed image load.
 *
 * Lookup order:
 *  1. WC26_ISO2 map (exact normalised name — Title Case required)
 *  2. null — unknown or placeholder
 *
 * "Brazil 🇧🇷" → normalise → "Brazil" → "br"
 * "W74"         → normalise → "W74"   → null  (placeholder)
 * null           → null
 */
export function teamFlagImg(raw) {
  if (!raw) return null;
  const name = normalizeTeamName(raw);
  if (!name || name === "TBD") return null;
  // WC26_ISO2 has an explicit null entry for "TBD" — handle that gracefully
  if (name in WC26_ISO2) return WC26_ISO2[name] ?? null;
  return null;
}

/**
 * labelTeam — best human-readable label for any team slot.
 *
 *   Real team:        "Brazil"        → "Brazil"
 *   Group winner:     "1A"            → "Group A Winner"
 *   Group runner-up:  "2B"            → "Group B Runner-up"
 *   Group 3rd:        "3C"            → "Group C 3rd Place"
 *   Best 3rd slot:    "3A/B/C/D/F"   → "Best 3rd Place"
 *   KO winner:        "W74"           → "Match 74 Winner"
 *   KO loser:         "L101"          → "Match 101 Loser"
 *   Runner-up ref:    "R12"           → "Match 12 Runner-up"
 *   null / ""         → "TBD"
 */
export function labelTeam(raw) {
  if (!raw) return "TBD";
  const name = normalizeTeamName(raw);
  if (!name) return "TBD";

  // Known real team — return clean name (no trailing emoji/whitespace)
  if (name in WC26_FLAGS) return name;

  // Group position: "1A" / "2B" / "3C"
  const gpMatch = name.match(/^([123])([A-L])$/);
  if (gpMatch) {
    const posLabel = gpMatch[1] === "1" ? "Winner" : gpMatch[1] === "2" ? "Runner-up" : "3rd Place";
    return `Group ${gpMatch[2]} ${posLabel}`;
  }

  // Best 3rd place combined slot: "3A/B/C/D/F"
  if (/^3[A-L](\/[A-L])+$/.test(name)) return "Best 3rd Place";

  // KO winner reference: "W74", "W97"
  const wMatch = name.match(/^W(\d+)$/);
  if (wMatch) return `Match ${wMatch[1]} Winner`;

  // KO loser reference: "L101", "L102"
  const lMatch = name.match(/^L(\d+)$/);
  if (lMatch) return `Match ${lMatch[1]} Loser`;

  // Runner-up reference: "R12" (alternate notation)
  const rMatch = name.match(/^R(\d+)$/);
  if (rMatch) return `Match ${rMatch[1]} Runner-up`;

  // Fallback: return cleaned string
  return name;
}

/** splitTeam — {name, flag|null} pair. flag is null for placeholders. */
export function splitTeam(raw) {
  const name = teamName(raw);
  return { name, flag: teamFlag(raw) };
}

// ─── Build ALL_MATCHES from real schedule ──────────
export const FLAG = WC26_FLAGS;

export const STADIUM_CITY = Object.fromEntries(
  Object.entries(WC26_VENUES).map(([venue, { city }]) => [venue, city])
);

// Price bands based on round + high-demand
function getPrice(fixture, idx) {
  const isHD    = WC26_HIGH_DEMAND.has(fixture.id);
  const round   = fixture.round ?? `Group ${fixture.group}`;

  if (round === "Final")         return [380,420,480,520,600,650][idx % 6];
  if (round === "Semi-Final")    return [280,320,360,400,440][idx % 5];
  if (round === "Quarter-Final") return [200,240,270,300][idx % 4];
  if (round === "3rd Place")     return [150,180,200][idx % 3];
  if (round === "Round of 16")   return [130,160,180,200][idx % 4];
  if (round === "Round of 32")   return [90,110,130][idx % 3];
  // Group stage
  if (isHD)  return [180,210,250,280,320,350,400,420][idx % 8];
  return [55,60,65,70,75,80,85,90,95,100,110,120,130][idx % 13];
}

export const ALL_MATCHES = WC26_ALL_FIXTURES.map((m, i) => {
  const venueInfo = WC26_VENUES[m.venue] ?? { city: m.venue, country: "Unknown" };
  const isHD      = WC26_HIGH_DEMAND.has(m.id);
  const price     = getPrice(m, i);
  const counts    = [1, 2, 2, 3, 3, 4, 5, 6, 8];
  const tickets   = counts[i % counts.length];
  const d         = new Date(m.date + "T12:00:00Z");
  const dow       = d.getUTCDay();
  const round     = m.round ?? `Group ${m.group}`;
  const group     = m.group ? `Group ${m.group}` : m.round;

  // For knockout TBD slots, home/away are labels like "1A", "W74"
  // Store the raw fixture value directly — teamName/labelTeam handle display.
  const homeRaw = m.home;
  const awayRaw = m.away;

  return {
    id:       m.id,
    // home/away are always the clean fixture value (no appended emoji).
    // All rendering goes through teamName() / labelTeam() / teamFlagImg().
    home:     homeRaw,
    away:     awayRaw,
    homeRaw,
    awayRaw,
    date:     fmtDate(m.date),
    isoDate:  m.date,
    time:     m.time,
    venue:    m.venue,
    city:     venueInfo.city,
    country:  venueInfo.country,
    group,
    round,
    price,
    tickets,
    status:   tickets <= 2 ? "limited" : "available",
    weekend:  dow === 0 || dow === 6,
    highDemand: isHD,
    listedAt: makeListedAt(i),
    ...SELLERS[i % SELLERS.length],
    ...SEAT_POOL[i % SEAT_POOL.length],
  };
});

// ─── Filter options ────────────────────────────────
export const ALL_DATES = [...new Set(ALL_MATCHES.map(m => m.date))];

export const CITY_GROUPS = [
  { group: "🇺🇸 United States", cities: [
    "Atlanta", "Boston / Foxborough", "Dallas / Arlington", "Houston",
    "Kansas City", "Los Angeles / Inglewood", "Miami / Miami Gardens",
    "New York / New Jersey", "Philadelphia",
    "San Francisco Bay Area / Santa Clara", "Seattle",
  ]},
  { group: "🇲🇽 Mexico",  cities: ["Guadalajara / Zapopan", "Mexico City", "Monterrey / Guadalupe"] },
  { group: "🇨🇦 Canada",  cities: ["Toronto", "Vancouver"] },
];

export const TEAM_OPTIONS = [...new Set(
  WC26_ALL_FIXTURES.flatMap(m => [m.home, m.away])
    .filter(t => WC26_FLAGS[t])   // only real teams, skip "1A", "W R32-01" etc
)].sort().map(name => `${name} ${WC26_FLAGS[name] ?? ""}`);

export const SORT_OPTIONS = [
  "Soonest Date",
  "Price: Low to High",
  "Price: High to Low",
  "Best Rating",
];

// ─── Trending cities ───────────────────────────────
export const TRENDING_CITIES = [
  { flag:"🇺🇸", city:"New York / New Jersey",         stadium:"MetLife Stadium",           tag:"🔥 Most popular · Final venue"  },
  { flag:"🇺🇸", city:"Dallas / Arlington",            stadium:"AT&T Stadium",              tag:"⚡ 9 matches · QF host"          },
  { flag:"🇺🇸", city:"Los Angeles / Inglewood",       stadium:"SoFi Stadium",              tag:"🎯 8 matches · SF host"          },
  { flag:"🇲🇽", city:"Mexico City",                   stadium:"Estadio Azteca",            tag:"📈 5 matches · Iconic venue"     },
  { flag:"🇺🇸", city:"Miami / Miami Gardens",         stadium:"Hard Rock Stadium",          tag:"⭐ 7 matches · QF host"         },
  { flag:"🇺🇸", city:"Atlanta",                       stadium:"Mercedes-Benz Stadium",      tag:"🎪 8 matches"                   },
  { flag:"🇨🇦", city:"Toronto",                       stadium:"BMO Field",                 tag:"🍁 6 matches"                   },
  { flag:"🇨🇦", city:"Vancouver",                     stadium:"BC Place",                  tag:"🏔️ 7 matches"                  },
];

// ─── Live activity feed ────────────────────────────
export const ACTIVITIES = [
  // ── Sales ──────────────────────────────────────────────────────────────────
  { icon:"🛒", cls:"sale",    match:"Brazil 🇧🇷 vs Morocco 🇲🇦",        action:"Someone just grabbed the last 2 in Sec 104 · $318 each",                    offsetMins:3   },
  { icon:"🛒", cls:"sale",    match:"Spain 🇪🇸 vs Saudi Arabia 🇸🇦",    action:"5 gone in under 3 mins · Lower Bowl Sec 117 · $241/ea",                     offsetMins:7   },
  { icon:"🛒", cls:"sale",    match:"Netherlands 🇳🇱 vs Japan 🇯🇵",     action:"7 sold · Sec 231 Row 15 · $265 each",                                       offsetMins:6   },
  { icon:"🛒", cls:"sale",    match:"England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Croatia 🇭🇷",   action:"Pair of Upper Tier seats snagged · Sec 340 Row 22 · $190 each",           offsetMins:19  },
  { icon:"🛒", cls:"sale",    match:"USA 🇺🇸 vs Mexico 🇲🇽",             action:"3 tickets moved fast · Club Level Sec 144 · $380 each",                    offsetMins:12  },
  { icon:"🛒", cls:"sale",    match:"Argentina 🇦🇷 vs Chile 🇨🇱",       action:"Block buy — 4 seats · Sec 205 Row 3 · $295 each",                          offsetMins:31  },
  { icon:"🛒", cls:"sale",    match:"France 🇫🇷 vs Senegal 🇸🇳",        action:"2 seats gone · Mid-Tier Sec 215 Row 14 · $278 each",                       offsetMins:58  },
  { icon:"🛒", cls:"sale",    match:"Germany 🇩🇪 vs Colombia 🇨🇴",       action:"1 ticket sold · Sec 162 Row 7 · $204",                                     offsetMins:43  },
  { icon:"🛒", cls:"sale",    match:"Portugal 🇵🇹 vs Poland 🇵🇱",        action:"Snagged — 2x Sec 112 Row 6 · $311 each, gone in 8 mins",                   offsetMins:17  },
  { icon:"🛒", cls:"sale",    match:"Mexico 🇲🇽 vs Ecuador 🇪🇨",         action:"6 tickets sold this hour · General Sec 318 · $139 avg",                   offsetMins:83  },
  { icon:"🛒", cls:"sale",    match:"Canada 🇨🇦 vs Uruguay 🇺🇾",         action:"2 seats moved · Sec 220 Row 18 · $158 each",                               offsetMins:55  },
  { icon:"🛒", cls:"sale",    match:"Japan 🇯🇵 vs Germany 🇩🇪",           action:"4 sold · Lower Bowl Sec 117 · $226 each",                                 offsetMins:22  },
  { icon:"🛒", cls:"sale",    match:"Italy 🇮🇹 vs Cameroon 🇨🇲",         action:"1 VIP Box sold · Sec VIP Row 1 · $512",                                   offsetMins:47  },
  { icon:"🛒", cls:"sale",    match:"Australia 🇦🇺 vs Peru 🇵🇪",         action:"2x Sec 104 Row 8 snagged · $289 each",                                    offsetMins:36  },
  { icon:"🛒", cls:"sale",    match:"South Korea 🇰🇷 vs Iran 🇮🇷",       action:"3 tickets sold · Upper Tier Sec 340 · $172 each",                         offsetMins:14  },
  { icon:"🛒", cls:"sale",    match:"USA 🇺🇸 vs Panama 🇵🇦",             action:"5 seats bought in 2 transactions · Sec 231 · $198 each",                  offsetMins:67  },
  { icon:"🛒", cls:"sale",    match:"Brazil 🇧🇷 vs Colombia 🇨🇴",        action:"2 Club Level seats gone · Sec 144 Row 9 · $341 each",                     offsetMins:29  },
  { icon:"🛒", cls:"sale",    match:"Morocco 🇲🇦 vs Belgium 🇧🇪",        action:"1 ticket · Sec 205 Row 3 · $263 — sold 4 mins after listing",              offsetMins:11  },
  { icon:"🛒", cls:"sale",    match:"France 🇫🇷 vs Argentina 🇦🇷",       action:"4 Premium Lower seats snagged · Sec 104 · $392 each",                     offsetMins:88  },
  { icon:"🛒", cls:"sale",    match:"England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs USA 🇺🇸",         action:"2x Sec 112 Row 6 · $274 each · both gone",                              offsetMins:23  },
  { icon:"🛒", cls:"sale",    match:"Mexico 🇲🇽 vs Jamaica 🇯🇲",         action:"3 sold · General Sec 318 · $124 each",                                    offsetMins:141 },
  { icon:"🛒", cls:"sale",    match:"Spain 🇪🇸 vs Germany 🇩🇪",          action:"1x VIP Box Sec VIP Row 1 · $618 — reserved",                              offsetMins:52  },
  { icon:"🛒", cls:"sale",    match:"Netherlands 🇳🇱 vs Belgium 🇧🇪",    action:"6 tickets sold this session · Sec 117 · avg $258",                        offsetMins:37  },
  { icon:"🛒", cls:"sale",    match:"Portugal 🇵🇹 vs Uzbekistan 🇺🇿",    action:"2 Mid-Tier snagged · Sec 215 Row 14 · $188 each",                         offsetMins:16  },
  { icon:"🛒", cls:"sale",    match:"Canada 🇨🇦 vs Chile 🇨🇱",            action:"2x Sec 220 Row 18 · $163 each",                                          offsetMins:74  },
  { icon:"🛒", cls:"sale",    match:"Argentina 🇦🇷 vs Chile 🇨🇱",         action:"Buyer from Buenos Aires grabbed 4 · Sec 205 · $295 each",                offsetMins:53  },
  { icon:"🛒", cls:"sale",    match:"USA 🇺🇸 vs Mexico 🇲🇽",              action:"3 Club Level gone · Sec 144 Row 9 · $380 each — quick one",               offsetMins:27  },
  { icon:"🛒", cls:"sale",    match:"Spain 🇪🇸 vs Germany 🇩🇪",           action:"2 sold · Sec 117 Row 12 · $295 each · both to same buyer",                offsetMins:41  },
  { icon:"🛒", cls:"sale",    match:"France 🇫🇷 vs Senegal 🇸🇳",          action:"Another pair gone · Sec 231 Row 15 · $267 each",                         offsetMins:118 },
  { icon:"🛒", cls:"sale",    match:"Morocco 🇲🇦 vs Belgium 🇧🇪",         action:"1 ticket · Mid-Tier Sec 205 · $263 — last one",                          offsetMins:9   },
  { icon:"🛒", cls:"sale",    match:"Italy 🇮🇹 vs Cameroon 🇨🇲",          action:"VIP Box sold · Sec VIP Row 1 · $512 · reserved by buyer",                offsetMins:66  },
  { icon:"🛒", cls:"sale",    match:"England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs USA 🇺🇸",         action:"5 seats gone this session · Sec 112 Row 6 · $274/ea",                   offsetMins:38  },
  { icon:"🛒", cls:"sale",    match:"Brazil 🇧🇷 vs Colombia 🇨🇴",          action:"2 Club Level moved · Sec 144 · $341 each",                               offsetMins:72  },
  { icon:"🛒", cls:"sale",    match:"Portugal 🇵🇹 vs Poland 🇵🇱",          action:"4 sold in 1 transaction · Sec 112 · $311 each",                         offsetMins:19  },
  { icon:"🛒", cls:"sale",    match:"Netherlands 🇳🇱 vs Japan 🇯🇵",        action:"3 Lower Bowl gone · Sec 117 · $265 each · fast sale",                   offsetMins:55  },
  { icon:"🛒", cls:"sale",    match:"Germany 🇩🇪 vs Colombia 🇨🇴",         action:"2x Sec 162 Row 7 · $204 each · buyer confirmed",                        offsetMins:84  },
  { icon:"🛒", cls:"sale",    match:"Japan 🇯🇵 vs Germany 🇩🇪",            action:"4 Lower Bowl snagged · Sec 117 · $226 each",                             offsetMins:29  },
  { icon:"🛒", cls:"sale",    match:"South Korea 🇰🇷 vs Iran 🇮🇷",         action:"3 Upper Tier sold · Sec 340 · $172 each",                               offsetMins:47  },
  { icon:"🛒", cls:"sale",    match:"Canada 🇨🇦 vs Chile 🇨🇱",             action:"2x Sec 220 Row 18 · $163 each · both sold",                             offsetMins:93  },

  // ── Price drops (new price reflects stated % reduction) ────────────────────
  // Original → drop % → new price embedded in action string
  { icon:"💸", cls:"price",   match:"Portugal 🇵🇹 vs Uzbekistan 🇺🇿",   action:"Price dropped 8% · Mid-Tier Sec 215 now from $195",                       offsetMins:9   },
  // $195 = original ~$212 × 0.92
  { icon:"💸", cls:"price",   match:"Australia 🇦🇺 vs Peru 🇵🇪",         action:"Just dropped 6% · Sec 104 Row 8 now from $272",                          offsetMins:38  },
  // $272 = original ~$289 × 0.94
  { icon:"💸", cls:"price",   match:"South Korea 🇰🇷 vs Iran 🇮🇷",       action:"Seller lowered by 11% · Upper Tier Sec 340 now from $153",               offsetMins:71  },
  // $153 = original ~$172 × 0.89
  { icon:"💸", cls:"price",   match:"Canada 🇨🇦 vs Uruguay 🇺🇾",          action:"Price cut 9% · Sec 220 now from $144",                                   offsetMins:44  },
  // $144 = original ~$158 × 0.91
  { icon:"💸", cls:"price",   match:"Mexico 🇲🇽 vs Ecuador 🇪🇨",          action:"Dropped 7% — Sec 318 now from $129",                                     offsetMins:18  },
  // $129 = original ~$139 × 0.93
  { icon:"💸", cls:"price",   match:"Japan 🇯🇵 vs Germany 🇩🇪",            action:"Seller reduced 5% · Lower Bowl Sec 117 now from $215",                  offsetMins:92  },
  // $215 = original ~$226 × 0.95
  { icon:"💸", cls:"price",   match:"Morocco 🇲🇦 vs Belgium 🇧🇪",         action:"13% off · Sec 205 Row 3 now from $229",                                  offsetMins:61  },
  // $229 = original ~$263 × 0.87
  { icon:"💸", cls:"price",   match:"Italy 🇮🇹 vs Cameroon 🇨🇲",          action:"Dropped 4% · Club Level Sec 144 now from $492",                         offsetMins:26  },
  // $492 = original ~$512 × 0.96
  { icon:"💸", cls:"price",   match:"USA 🇺🇸 vs Panama 🇵🇦",              action:"Price just fell 10% · Sec 231 now from $179",                            offsetMins:53  },
  // $179 = original ~$198 × 0.90
  { icon:"💸", cls:"price",   match:"Germany 🇩🇪 vs Colombia 🇨🇴",        action:"Modest dip, 3% · Sec 162 Row 7 now from $198",                          offsetMins:34  },
  // $198 = original ~$204 × 0.97
  { icon:"💸", cls:"price",   match:"Brazil 🇧🇷 vs Colombia 🇨🇴",         action:"Down 6% · Club Level Sec 144 now from $321",                            offsetMins:79  },
  // $321 = original ~$341 × 0.94
  { icon:"💸", cls:"price",   match:"England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Croatia 🇭🇷",    action:"Seller dropped price 8% · Upper Tier now from $175",                    offsetMins:15  },
  // $175 = original ~$190 × 0.92

  // ── Price rises ─────────────────────────────────────────────────────────────
  { icon:"📈", cls:"price",   match:"France 🇫🇷 vs Senegal 🇸🇳",         action:"Price rose 5% · Upper Tier Sec 231 now from $280",                       offsetMins:7   },
  { icon:"📈", cls:"price",   match:"Brazil 🇧🇷 vs Morocco 🇲🇦",          action:"Up 12% since yesterday · Premium Lower now from $357",                  offsetMins:167 },
  { icon:"📈", cls:"price",   match:"Spain 🇪🇸 vs Germany 🇩🇪",           action:"Demand spike — up 9% · Sec 117 now from $304",                          offsetMins:48  },
  { icon:"📈", cls:"price",   match:"USA 🇺🇸 vs Mexico 🇲🇽",               action:"Prices climbing · Club Level now from $412 (+8%)",                      offsetMins:21  },
  { icon:"📈", cls:"price",   match:"France 🇫🇷 vs Argentina 🇦🇷",         action:"Up 15% in 2h · Premium Lower now from $451",                           offsetMins:103 },
  { icon:"📈", cls:"price",   match:"Netherlands 🇳🇱 vs Belgium 🇧🇪",      action:"Rose 7% · Sec 117 now from $276",                                       offsetMins:33  },
  { icon:"📈", cls:"price",   match:"England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs USA 🇺🇸",          action:"Steady rise — up 6% since morning · now from $291",                   offsetMins:145 },
  { icon:"📈", cls:"price",   match:"Portugal 🇵🇹 vs Poland 🇵🇱",           action:"Went up 11% · Sec 112 now from $345",                                  offsetMins:57  },
  { icon:"📈", cls:"price",   match:"Argentina 🇦🇷 vs Chile 🇨🇱",            action:"Up 4% · Mid-Tier Sec 215 now from $307",                               offsetMins:82  },
  { icon:"📈", cls:"price",   match:"South Korea 🇰🇷 vs Iran 🇮🇷",           action:"Rose 8% since last check · Upper Tier now from $186",                  offsetMins:41  },

  // ── Viewers ──────────────────────────────────────────────────────────────────
  { icon:"👁",  cls:"viewers", match:"Argentina 🇦🇷 vs Algeria 🇩🇿",       action:"56 people viewing · Only 2 tickets left",                               offsetMins:4   },
  { icon:"👁",  cls:"viewers", match:"England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Croatia 🇭🇷",     action:"34 viewing right now · prices rising fast",                            offsetMins:3   },
  { icon:"👁",  cls:"viewers", match:"USA 🇺🇸 vs Mexico 🇲🇽",               action:"91 people on this listing · 4 left",                                   offsetMins:1   },
  { icon:"👁",  cls:"viewers", match:"Brazil 🇧🇷 vs Morocco 🇲🇦",            action:"47 watching · Last few in Sec 104",                                   offsetMins:11  },
  { icon:"👁",  cls:"viewers", match:"France 🇫🇷 vs Argentina 🇦🇷",          action:"78 viewing — 3 tickets left, moving fast",                             offsetMins:5   },
  { icon:"👁",  cls:"viewers", match:"Spain 🇪🇸 vs Germany 🇩🇪",             action:"62 people on this right now · 1 VIP left",                             offsetMins:2   },
  { icon:"👁",  cls:"viewers", match:"Portugal 🇵🇹 vs Poland 🇵🇱",            action:"29 watching · Sec 112 Row 6 · stock low",                             offsetMins:13  },
  { icon:"👁",  cls:"viewers", match:"Netherlands 🇳🇱 vs Belgium 🇧🇪",       action:"41 viewing · Lower Bowl almost gone",                                  offsetMins:8   },
  { icon:"👁",  cls:"viewers", match:"Germany 🇩🇪 vs Colombia 🇨🇴",           action:"18 people browsing this match right now",                             offsetMins:25  },
  { icon:"👁",  cls:"viewers", match:"Mexico 🇲🇽 vs Ecuador 🇪🇨",             action:"53 viewers · Sec 318 Row 22 · 5 left",                                offsetMins:17  },
  { icon:"👁",  cls:"viewers", match:"Italy 🇮🇹 vs Cameroon 🇨🇲",             action:"22 watching · VIP almost gone",                                       offsetMins:39  },
  { icon:"👁",  cls:"viewers", match:"Japan 🇯🇵 vs Germany 🇩🇪",              action:"35 people on this listing · 2 pairs left",                            offsetMins:28  },
  { icon:"👁",  cls:"viewers", match:"Morocco 🇲🇦 vs Belgium 🇧🇪",            action:"16 viewing · only 1 seat remaining",                                  offsetMins:64  },
  { icon:"👁",  cls:"viewers", match:"Canada 🇨🇦 vs Chile 🇨🇱",               action:"44 people checking this out rn",                                      offsetMins:9   },
  { icon:"👁",  cls:"viewers", match:"South Korea 🇰🇷 vs Iran 🇮🇷",           action:"27 watching · Sec 340 · 3 tickets left",                              offsetMins:46  },

  // ── New listings ─────────────────────────────────────────────────────────────
  { icon:"➕", cls:"listing",  match:"USA 🇺🇸 vs Paraguay 🇵🇾",            action:"New VIP Box listing · Sec VIP Row 1 · $520",                            offsetMins:1   },
  { icon:"➕", cls:"listing",  match:"Brazil 🇧🇷 vs Colombia 🇨🇴",          action:"New pair listed · Club Level Sec 144 Row 9 · $341 each",               offsetMins:6   },
  { icon:"➕", cls:"listing",  match:"Germany 🇩🇪 vs Colombia 🇨🇴",          action:"Fresh listing · Sec 162 Row 7 · $204 · 2 available",                  offsetMins:14  },
  { icon:"➕", cls:"listing",  match:"Italy 🇮🇹 vs Cameroon 🇨🇲",            action:"New Club Level listing · Sec 144 · $497 · 1 ticket",                  offsetMins:22  },
  { icon:"➕", cls:"listing",  match:"Morocco 🇲🇦 vs Belgium 🇧🇪",           action:"3 new Mid-Tier seats added · Sec 205 · $263 each",                    offsetMins:35  },
  { icon:"➕", cls:"listing",  match:"Australia 🇦🇺 vs Peru 🇵🇪",            action:"2x Lower Bowl just listed · Sec 104 · $289 each",                     offsetMins:51  },
  { icon:"➕", cls:"listing",  match:"Canada 🇨🇦 vs Uruguay 🇺🇾",             action:"New listing · Sec 220 Row 18 · 2 seats · $158 each",                  offsetMins:27  },
  { icon:"➕", cls:"listing",  match:"Japan 🇯🇵 vs Germany 🇩🇪",              action:"4 Lower Bowl added · Sec 117 · $226 each · just posted",              offsetMins:18  },
  { icon:"➕", cls:"listing",  match:"Portugal 🇵🇹 vs Poland 🇵🇱",            action:"New pair listed in Sec 112 Row 6 · $311 each",                        offsetMins:42  },
  { icon:"➕", cls:"listing",  match:"Spain 🇪🇸 vs Saudi Arabia 🇸🇦",        action:"Lower Bowl listing added · Sec 117 · $241/ea · 5 available",          offsetMins:63  },
  { icon:"➕", cls:"listing",  match:"Mexico 🇲🇽 vs Jamaica 🇯🇲",            action:"6 General seats listed · Sec 318 · $124 each",                        offsetMins:108 },
  { icon:"➕", cls:"listing",  match:"South Korea 🇰🇷 vs Iran 🇮🇷",           action:"Fresh Upper Tier listing · Sec 340 Row 25 · $172 · 3 tix",           offsetMins:31  },

  // ── Quiet / no-activity entries ───────────────────────────────────────────
  { icon:"🔔", cls:"listing",  match:"Portugal 🇵🇹 vs Uzbekistan 🇺🇿",    action:"Price updated — no change in stock · Sec 215 · $195",                  offsetMins:77  },
  { icon:"🔔", cls:"listing",  match:"Canada 🇨🇦 vs Chile 🇨🇱",             action:"Listing refreshed · no new activity",                                 offsetMins:122 },
  { icon:"🔔", cls:"listing",  match:"Australia 🇦🇺 vs Peru 🇵🇪",           action:"No activity in last 15 minutes on this listing",                      offsetMins:156 },
  { icon:"🔔", cls:"listing",  match:"Mexico 🇲🇽 vs Ecuador 🇪🇨",            action:"Seller updated availability note · Sec 318 still listed",             offsetMins:88  },
  { icon:"🔔", cls:"listing",  match:"Japan 🇯🇵 vs Germany 🇩🇪",              action:"Listing info corrected — Sec 117, was Row 6 now Row 15",             offsetMins:44  },
  { icon:"🔔", cls:"listing",  match:"Germany 🇩🇪 vs Colombia 🇨🇴",           action:"Seller updated notes · tickets still available",                     offsetMins:33  },
  { icon:"🔔", cls:"listing",  match:"South Korea 🇰🇷 vs Iran 🇮🇷",           action:"Match details verified · listing unchanged",                         offsetMins:101 },
  { icon:"🔔", cls:"listing",  match:"Morocco 🇲🇦 vs Belgium 🇧🇪",            action:"No bids in the past hour · listing active",                          offsetMins:69  },
];

export const RECENT_PURCHASES = [
  // USA
  { initials:"JW", bg:"linear-gradient(135deg,#1B3C88,#4A62BC)", name:"Jake Williams",       city:"Houston, TX",       match:"England vs Croatia",           cat:"Upper Tier · Sec 231",    offsetMins:3   },
  { initials:"AT", bg:"linear-gradient(135deg,#7C3AED,#A78BFA)", name:"Ashley Torres",       city:"Miami, FL",         match:"2x Brazil vs Morocco",         cat:"Premium Lower · Sec 104", offsetMins:7   },
  { initials:"DM", bg:"linear-gradient(135deg,#059669,#10B981)", name:"Devon Mitchell",      city:"Los Angeles, CA",   match:"USA vs Mexico",                cat:"Club Level · Sec 144",    offsetMins:11  },
  { initials:"SS", bg:"linear-gradient(135deg,#DC2626,#F87171)", name:"Stephanie Sanchez",   city:"Dallas, TX",        match:"3x Spain vs Germany",          cat:"Lower Bowl · Sec 117",    offsetMins:19  },
  { initials:"RJ", bg:"linear-gradient(135deg,#D97706,#FCD34D)", name:"Ryan Johnson",        city:"Chicago, IL",       match:"Argentina vs Chile",           cat:"Mid-Tier · Sec 205",      offsetMins:23  },
  { initials:"LG", bg:"linear-gradient(135deg,#0EA5E9,#7DD3FC)", name:"Lauren Garcia",       city:"New York, NY",      match:"France vs Argentina",          cat:"VIP Box · Sec VIP",       offsetMins:31  },
  { initials:"MH", bg:"linear-gradient(135deg,#BE185D,#F472B6)", name:"Marcus Harris",       city:"Atlanta, GA",       match:"2x Netherlands vs Japan",      cat:"Lower Bowl · Sec 117",    offsetMins:38  },
  { initials:"CN", bg:"linear-gradient(135deg,#475569,#94A3B8)", name:"Chloe Nguyen",        city:"Seattle, WA",       match:"Portugal vs Poland",           cat:"Sec 112 Row 6",           offsetMins:47  },
  { initials:"BL", bg:"linear-gradient(135deg,#1B3C88,#818CF8)", name:"Brandon Lee",         city:"Phoenix, AZ",       match:"4x Mexico vs Ecuador",         cat:"General · Sec 318",       offsetMins:52  },
  { initials:"AM", bg:"linear-gradient(135deg,#059669,#34D399)", name:"Amanda Martinez",     city:"San Antonio, TX",   match:"Germany vs Colombia",          cat:"Sec 162 Row 7",           offsetMins:60  },
  // Mexico
  { initials:"JH", bg:"linear-gradient(135deg,#DC2626,#FCA5A5)", name:"Jorge Hernández",     city:"Mexico City",       match:"2x Mexico vs Ecuador",         cat:"Lower Bowl · Sec 117",    offsetMins:58  },
  { initials:"LR", bg:"linear-gradient(135deg,#7C3AED,#C4B5FD)", name:"Lucía Ramírez",       city:"Guadalajara",       match:"Spain vs Saudi Arabia",        cat:"Sec 117 Row 12",          offsetMins:64  },
  { initials:"CM", bg:"linear-gradient(135deg,#1B3C88,#4A62BC)", name:"Carlos Mendoza",      city:"Monterrey",         match:"3x USA vs Mexico",             cat:"Club Level · Sec 144",    offsetMins:72  },
  { initials:"VG", bg:"linear-gradient(135deg,#059669,#6EE7B7)", name:"Valentina González",  city:"Puebla",            match:"Mexico vs Jamaica",            cat:"General · Sec 318",       offsetMins:83  },
  { initials:"AG", bg:"linear-gradient(135deg,#D97706,#FCD34D)", name:"Alejandro García",    city:"Tijuana",           match:"2x Argentina vs Chile",        cat:"Mid-Tier · Sec 215",      offsetMins:91  },
  // Spain
  { initials:"PM", bg:"linear-gradient(135deg,#BE123C,#FDA4AF)", name:"Pablo Martínez",      city:"Madrid",            match:"Spain vs Germany",             cat:"Lower Bowl · Sec 117",    offsetMins:43  },
  { initials:"IS", bg:"linear-gradient(135deg,#0F766E,#2DD4BF)", name:"Isabel Sánchez",      city:"Barcelona",         match:"2x France vs Senegal",         cat:"Sec 231 Row 15",          offsetMins:77  },
  { initials:"JL", bg:"linear-gradient(135deg,#7C3AED,#A78BFA)", name:"Javier López",        city:"Valencia",          match:"Portugal vs Poland",           cat:"Sec 112 Row 6",           offsetMins:99  },
  { initials:"AP", bg:"linear-gradient(135deg,#1D4ED8,#60A5FA)", name:"Ana Pérez",           city:"Seville",           match:"3x Netherlands vs Belgium",    cat:"Lower Bowl · Sec 117",    offsetMins:123 },
  { initials:"DR", bg:"linear-gradient(135deg,#DC2626,#F87171)", name:"Diego Ruiz",          city:"Bilbao",            match:"Spain vs Saudi Arabia",        cat:"Sec 117 · 2 tickets",     offsetMins:139 },
  // France
  { initials:"TM", bg:"linear-gradient(135deg,#059669,#10B981)", name:"Thomas Martin",       city:"Paris",             match:"4x France vs Argentina",       cat:"Premium Lower · Sec 104", offsetMins:29  },
  { initials:"CB", bg:"linear-gradient(135deg,#0EA5E9,#7DD3FC)", name:"Camille Bernard",     city:"Lyon",              match:"2x France vs Senegal",         cat:"Upper Tier · Sec 231",    offsetMins:68  },
  { initials:"JD", bg:"linear-gradient(135deg,#BE185D,#F472B6)", name:"Jean-Pierre Dubois",  city:"Marseille",         match:"France vs Argentina",          cat:"VIP Box · Sec VIP",       offsetMins:104 },
  { initials:"LS", bg:"linear-gradient(135deg,#475569,#94A3B8)", name:"Louise Simon",        city:"Toulouse",          match:"2x Brazil vs Morocco",         cat:"Sec 104 Row 8",           offsetMins:131 },
  { initials:"PR", bg:"linear-gradient(135deg,#1B3C88,#818CF8)", name:"Pierre Rousseau",     city:"Nice",              match:"Netherlands vs Japan",         cat:"Lower Bowl · Sec 117",    offsetMins:167 },
  // Canada
  { initials:"ET", bg:"linear-gradient(135deg,#D97706,#FCD34D)", name:"Emma Thompson",       city:"Toronto",           match:"2x Canada vs Uruguay",         cat:"Sec 220 Row 18",          offsetMins:16  },
  { initials:"NP", bg:"linear-gradient(135deg,#059669,#6EE7B7)", name:"Noah Patel",          city:"Vancouver",         match:"3x Canada vs Chile",           cat:"Lower Bowl · Sec 117",    offsetMins:62  },
  { initials:"OL", bg:"linear-gradient(135deg,#DC2626,#FCA5A5)", name:"Olivia Leblanc",      city:"Montreal",          match:"USA vs Mexico",                cat:"Sec 144 Row 9",           offsetMins:89  },
  { initials:"LC", bg:"linear-gradient(135deg,#7C3AED,#C4B5FD)", name:"Liam Chen",           city:"Calgary",           match:"2x Canada vs Uruguay",         cat:"Sec 220 · 2 tickets",     offsetMins:117 },
  { initials:"AF", bg:"linear-gradient(135deg,#1B3C88,#4A62BC)", name:"Ava Fournier",        city:"Ottawa",            match:"France vs Argentina",          cat:"Upper Tier · Sec 231",    offsetMins:153 },
  // Brazil
  { initials:"MF", bg:"linear-gradient(135deg,#059669,#34D399)", name:"Maria Fernanda",      city:"São Paulo",         match:"4x Brazil vs Morocco",         cat:"Premium · Sec 104",       offsetMins:14  },
  { initials:"GS", bg:"linear-gradient(135deg,#1D4ED8,#60A5FA)", name:"Gabriel Santos",      city:"Rio de Janeiro",    match:"2x Brazil vs Colombia",        cat:"Club Level · Sec 144",    offsetMins:66  },
  { initials:"BS", bg:"linear-gradient(135deg,#BE123C,#FDA4AF)", name:"Beatriz Souza",       city:"Belo Horizonte",    match:"Brazil vs Morocco",            cat:"Premium Lower · Sec 104", offsetMins:95  },
  { initials:"PO", bg:"linear-gradient(135deg,#D97706,#FCD34D)", name:"Pedro Oliveira",      city:"Brasília",          match:"3x Brazil vs Colombia",        cat:"Sec 104 Row 8",           offsetMins:128 },
  { initials:"AL", bg:"linear-gradient(135deg,#0EA5E9,#7DD3FC)", name:"Ana Lima",            city:"Salvador",          match:"2x Brazil vs Morocco",         cat:"Lower Bowl · Sec 117",    offsetMins:171 },
  // UK
  { initials:"JR", bg:"linear-gradient(135deg,#7C3AED,#A78BFA)", name:"James Robertson",     city:"London",            match:"2x England vs Croatia",        cat:"Upper Tier · Sec 231",    offsetMins:7   },
  { initials:"SE", bg:"linear-gradient(135deg,#DC2626,#F87171)", name:"Sophie Evans",        city:"Manchester",        match:"England vs USA",               cat:"Sec 112 Row 6",           offsetMins:44  },
  { initials:"OB", bg:"linear-gradient(135deg,#059669,#10B981)", name:"Oliver Brown",        city:"Birmingham",        match:"3x England vs Croatia",        cat:"Lower Bowl · Sec 117",    offsetMins:78  },
  { initials:"EW", bg:"linear-gradient(135deg,#475569,#94A3B8)", name:"Emily Wilson",        city:"Leeds",             match:"2x England vs USA",            cat:"Sec 231 Row 15",          offsetMins:109 },
  { initials:"HT", bg:"linear-gradient(135deg,#1B3C88,#818CF8)", name:"Harry Taylor",        city:"Liverpool",         match:"England vs Croatia",           cat:"Club Level · Sec 144",    offsetMins:142 },
  // Argentina
  { initials:"LM", bg:"linear-gradient(135deg,#0F766E,#2DD4BF)", name:"Luciano Morales",     city:"Buenos Aires",      match:"4x Argentina vs Chile",        cat:"Mid-Tier · Sec 205",      offsetMins:36  },
  { initials:"VP", bg:"linear-gradient(135deg,#BE185D,#F472B6)", name:"Valentina Pérez",     city:"Córdoba",           match:"2x Argentina vs Algeria",      cat:"Sec 104 Row 8",           offsetMins:73  },
  { initials:"MA", bg:"linear-gradient(135deg,#7C3AED,#A78BFA)", name:"Matías Acosta",       city:"Rosario",           match:"Argentina vs Chile",           cat:"Lower Bowl · Sec 117",    offsetMins:101 },
  { initials:"FR", bg:"linear-gradient(135deg,#D97706,#FCD34D)", name:"Florencia Romero",    city:"Mendoza",           match:"3x France vs Argentina",       cat:"Premium Lower · Sec 104", offsetMins:125 },
  { initials:"JM", bg:"linear-gradient(135deg,#1B3C88,#4A62BC)", name:"Joaquín Medina",      city:"Tucumán",           match:"2x Argentina vs Algeria",      cat:"Sec 205 Row 3",           offsetMins:158 },
  // Germany
  { initials:"MK", bg:"linear-gradient(135deg,#1D4ED8,#60A5FA)", name:"Maximilian Koch",     city:"Berlin",            match:"2x Germany vs Colombia",       cat:"Sec 162 Row 7",           offsetMins:21  },
  { initials:"LW", bg:"linear-gradient(135deg,#059669,#6EE7B7)", name:"Laura Weiß",          city:"Munich",            match:"Spain vs Germany",             cat:"Lower Bowl · Sec 117",    offsetMins:86  },
  { initials:"FK", bg:"linear-gradient(135deg,#DC2626,#FCA5A5)", name:"Felix Krause",        city:"Hamburg",           match:"3x Germany vs Colombia",       cat:"Club Level · Sec 144",    offsetMins:113 },
  { initials:"HB", bg:"linear-gradient(135deg,#BE123C,#FDA4AF)", name:"Hannah Bauer",        city:"Frankfurt",         match:"2x Japan vs Germany",          cat:"Sec 117 Row 12",          offsetMins:137 },
  { initials:"JS", bg:"linear-gradient(135deg,#0EA5E9,#7DD3FC)", name:"Jonas Schäfer",       city:"Cologne",           match:"Germany vs Colombia",          cat:"Sec 162 · 2 seats",       offsetMins:164 },
  // Global
  { initials:"AK", bg:"linear-gradient(135deg,#DC2626,#FCA5A5)", name:"Ahmed Khalil",        city:"Cairo",             match:"1x Spain vs Saudi Arabia",     cat:"Lower Bowl · Sec 117",    offsetMins:3   },
  { initials:"YT", bg:"linear-gradient(135deg,#7C3AED,#C4B5FD)", name:"Yuki Tanaka",         city:"Tokyo",             match:"2x Japan vs Germany",          cat:"Lower Bowl · Sec 117",    offsetMins:56  },
  { initials:"KA", bg:"linear-gradient(135deg,#059669,#34D399)", name:"Kwame Asante",        city:"Accra",             match:"Morocco vs Belgium",           cat:"Sec 205 Row 3",           offsetMins:81  },
  { initials:"RS", bg:"linear-gradient(135deg,#1B3C88,#4A62BC)", name:"Ravi Sharma", city:"Mumbai", match:"2x South Korea vs Iran", cat:"Upper Tier · Sec 340", offsetMins:107 },
  { initials:"FO", bg:"linear-gradient(135deg,#D97706,#FCD34D)", name:"Fatima Ouali",        city:"Casablanca",        match:"3x Morocco vs Belgium",        cat:"Mid-Tier · Sec 205",      offsetMins:134 },
  { initials:"PJ", bg:"linear-gradient(135deg,#BE185D,#F472B6)", name:"Park Jinho",          city:"Seoul",             match:"4x South Korea vs Iran",       cat:"Upper Tier · Sec 340",    offsetMins:159 },
  { initials:"SK", bg:"linear-gradient(135deg,#0F766E,#2DD4BF)", name:"Sara Kowalski",       city:"Warsaw",            match:"2x Portugal vs Poland",        cat:"Sec 112 Row 6",           offsetMins:184 },
  { initials:"OR", bg:"linear-gradient(135deg,#475569,#94A3B8)", name:"Omar Al-Rashid",      city:"Dubai",             match:"Spain vs Saudi Arabia",        cat:"Lower Bowl · Sec 117",    offsetMins:208 },
  { initials:"IF", bg:"linear-gradient(135deg,#1D4ED8,#60A5FA)", name:"Ivan Fedorov",        city:"Moscow",            match:"2x Netherlands vs Belgium",    cat:"Lower Bowl · Sec 117",    offsetMins:231 },
  { initials:"NG", bg:"linear-gradient(135deg,#DC2626,#F87171)", name:"Nina Grabowski",      city:"Vienna",            match:"Germany vs Colombia",          cat:"Sec 162 · 1 seat",        offsetMins:257 },
];

// ─── Testimonials ──────────────────────────────────
export const TESTIMONIALS = [
  {
    stars: 5,
    quote: "Bought two lower bowl seats for Brazil vs Morocco two weeks before the match. The whole process — finding the listing, contacting the seller, receiving the tickets — took less than an hour. Tickets scanned perfectly on matchday.",
    initials: "JM", bg: "linear-gradient(135deg,#1B3C88,#4A62BC)",
    name: "James Mackenzie", location: "Edinburgh, UK",
    match: "Brazil vs Morocco", seat: "Lower Bowl · Sec 117",
    date: "Verified purchase · Jun 2026",
    verifiedPurchase: true,
    purchasedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
  {
    stars: 5,
    quote: "I was sceptical about buying resale tickets — had a bad experience elsewhere. But the manual verification here is a game changer. The team checked every detail and I had confirmed valid tickets in hand. Will use for every tournament going forward.",
    initials: "SR", bg: "linear-gradient(135deg,#059669,#34D399)",
    name: "Sofia Rodriguez", location: "Buenos Aires, Argentina",
    match: "Argentina vs Algeria", seat: "Club Level · Sec 144",
    date: "Verified purchase · Jun 2026",
    verifiedPurchase: true,
    purchasedAt: new Date(Date.now() - 1000 * 60 * 60 * 31).toISOString(),
  },
  {
    stars: 5,
    quote: "The seller responded within minutes and guided me through the transfer process step by step. Seats were exactly as described. If you're nervous about buying tickets online, this platform removes every reason to worry.",
    initials: "TC", bg: "linear-gradient(135deg,#DC2626,#F87171)",
    name: "Thomas Chen", location: "Vancouver, Canada",
    match: "England vs Croatia", seat: "Upper Tier · Sec 231",
    date: "Verified purchase · Jun 2026",
    verifiedPurchase: true,
    purchasedAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
  },
];

export const PAYMENT_METHODS = ["💳 Card", "📱 Bank Transfer", "💰 Crypto"];

/**
 * getMarketBenchmark — returns price range for a given fixture ID
 * Used in the SellerForm to show competitive pricing guidance
 */
export function getMarketBenchmark(fixtureId) {
  if (!fixtureId) return null;
  const match = ALL_MATCHES.find(m => m.id === fixtureId);
  if (!match) return null;

  const base = match.price;
  const low  = Math.max(30, Math.round(base * 0.80 / 5) * 5);
  const high = Math.round(base * 1.25 / 5) * 5;
  const avg  = Math.round((low + high) / 2 / 5) * 5;

  return { low, high, avg, round: match.round ?? `Group ${match.group}` };
}
