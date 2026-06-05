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
  { icon:"🛒", cls:"sale",    match:"Brazil 🇧🇷 vs Morocco 🇲🇦",       action:"3 tickets sold · Premium Lower · $320 each",    time:"2 min ago"  },
  { icon:"📈", cls:"price",   match:"France 🇫🇷 vs Senegal 🇸🇳",       action:"Price rose 5% · Upper Tier now from $280",       time:"4 min ago"  },
  { icon:"👁",  cls:"viewers", match:"Argentina 🇦🇷 vs Algeria 🇩🇿",    action:"56 people viewing · Only 2 tickets left",        time:"just now"   },
  { icon:"➕", cls:"listing", match:"USA 🇺🇸 vs Paraguay 🇵🇾",          action:"New VIP listing · Box seats added · $520",       time:"6 min ago"  },
  { icon:"🛒", cls:"sale",    match:"Spain 🇪🇸 vs Saudi Arabia 🇸🇦",   action:"5 tickets sold · Lower Bowl · last 10 min",      time:"8 min ago"  },
  { icon:"💸", cls:"price",   match:"Portugal 🇵🇹 vs Uzbekistan 🇺🇿",  action:"Price dropped 8% · Mid-Tier now from $195",      time:"11 min ago" },
  { icon:"🛒", cls:"sale",    match:"Netherlands 🇳🇱 vs Japan 🇯🇵",    action:"7 tickets sold · Lower Bowl · $265 each",        time:"1 min ago"  },
  { icon:"👁",  cls:"viewers", match:"England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Croatia 🇭🇷",   action:"34 people viewing · Prices rising fast",         time:"3 min ago"  },
];

export const RECENT_PURCHASES = [
  { initials:"JR", bg:"linear-gradient(135deg,#7C3AED,#A78BFA)", name:"James R.", city:"London",    match:"2x England vs Croatia",      cat:"Upper Tier", time:"3 min ago"  },
  { initials:"MF", bg:"linear-gradient(135deg,#059669,#34D399)",  name:"Maria F.", city:"São Paulo", match:"4x Brazil vs Morocco",        cat:"Premium",    time:"7 min ago"  },
  { initials:"AK", bg:"linear-gradient(135deg,#DC2626,#FCA5A5)",  name:"Ahmed K.", city:"Cairo",     match:"1x Spain vs Saudi Arabia",    cat:"Lower Bowl", time:"12 min ago" },
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
