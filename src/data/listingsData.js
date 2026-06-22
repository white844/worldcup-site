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
// Power sellers (s01–s05): repeat frequently — ~30% of listings
// Regular sellers (s06–s11): appear 2–3 times each
// One-time / occasional sellers (s13–s31): appear once or twice
// Removed: s08 Connor Bradshaw, s10 Luca Ferretti, s12 Elena Vasquez,
//          s14 Antoine Dubois, s16 Ingrid Holmberg, s19 Reuben Abramowitz,
//          s23 Dmitri Volkov, s26 Mei-Ling Chen (1-ticket sellers, redistributed)
//          s20 Valentina Cruz (tickets transferred to Yuna Park s09)
//          s30 Lieselotte van den Berg, s31 Tariq Benali (tickets redistributed to Group B)
// Excluded from pool: s17 Darius Okonkwo, s25 Olusegun Adeyemi
export const SELLERS = [

  // ── Power sellers — show up repeatedly, high sales, slightly imperfect ──────
  {
    sellerId:"s01", seller:"Marco Delgado",
    rating:4.7, response:6, sales:389, since:"Oct 2022",
    avatar:"MD", avatarBg:"linear-gradient(135deg,#1B3C88,#4A62BC)",
    location:"Polanco, Mexico City",
    bio:"Been doing this since Russia 2018. Got allocation contacts for most group stage fixtures. Usually respond same day, sometimes takes till evening if I'm at work.",
  ,
    contactUrl:"https://t.me/Marcodelgadoo",
  },
  {
    sellerId:"s02", seller:"Sophie Whitfield",
    rating:4.9, response:4, sales:521, since:"Aug 2022",
    avatar:"SW", avatarBg:"linear-gradient(135deg,#7C3AED,#A78BFA)",
    location:"Islington, London",
    bio:"Full-time reseller, this is literally my job. 500+ sales, zero chargebacks. I over-communicate — you'll know exactly where your tickets are at every stage.",
  ,
    contactUrl:"https://t.me/SophieWhitefield",
  },
  {
    sellerId:"s03", seller:"Rafael Souza", contactUrl:"https://t.me/Rafelsouza",
    rating:4.8, response:5, sales:447, since:"Dec 2022",
    avatar:"RS", avatarBg:"linear-gradient(135deg,#059669,#10B981)",
    location:"Pinheiros, São Paulo",
    bio:"Brazilian football obsessive. I buy in bulk from official allocations and sell what I can't use. Mostly Brazil and South American fixtures but I have tickets across the board.",
  },
  {
    sellerId:"s04", seller:"Nadia Fontaine",
    rating:4.6, response:9, sales:274, since:"Feb 2023",
    avatar:"NF", avatarBg:"linear-gradient(135deg,#BE185D,#F472B6)",
    location:"Lyon, France",
    bio:"Football fan first, seller second. Got into reselling after Qatar when I ended up with more tickets than I could use. Prices are fair — I'm not here to rip anyone off.",
  ,
    contactUrl:"https://t.me/NadiaFontaine",
  },
  {
    sellerId:"s05", seller:"James Okafor",
    rating:4.9, response:3, sales:612, since:"Jul 2022",
    avatar:"JO", avatarBg:"linear-gradient(135deg,#D97706,#F59E0B)",
    location:"Hackney, London",
    bio:"Top seller on here. 600+ completed sales across 3 World Cups and 2 Euros. I know this process inside out — fast, clean, no drama. Check my reviews.",
  },

  // ── Regular sellers — appear 2–3 times each ──────────────────────────────
  {
    sellerId:"s06", seller:"Tomás Herrera",
    rating:4.7, response:7, sales:134, since:"Mar 2023",
    avatar:"TH", avatarBg:"linear-gradient(135deg,#DC2626,#F87171)",
    location:"Providencia, Santiago",
    bio:"Chilean fan who travels to every major tournament. Selling surplus from my group allocation — all tickets are genuine, purchased through official Chilean FA channels.",
  },
  {
    sellerId:"s07", seller:"Aisha Mensah",
    rating:4.8, response:6, sales:98, since:"May 2023",
    avatar:"AM", avatarBg:"linear-gradient(135deg,#0EA5E9,#38BDF8)",
    location:"Accra, Ghana",
    bio:"Selling a pair of tickets my brother can't use anymore. First time listing on here but I've bought on similar platforms before — know how it works. Happy to video call.",
  ,
    contactUrl:"https://t.me/AishaMensa",
  },

  {
    sellerId:"s09", seller:"Yuna Park",
    rating:4.9, response:4, sales:203, since:"Jan 2023",
    avatar:"YP", avatarBg:"linear-gradient(135deg,#0F766E,#14B8A6)",
    location:"Gangnam, Seoul",
    bio:"Verified Korean seller. I handle mostly Asian fixtures but have tickets across multiple venues. All sourced through official Korean FA allocation. Fast transfer on payment.",
  ,
    contactUrl:"https://t.me/yunaaparkk",
  },

  {
    sellerId:"s11", seller:"Khalid Al-Rashidi",
    rating:4.7, response:8, sales:156, since:"Apr 2023",
    avatar:"KA", avatarBg:"linear-gradient(135deg,#92400E,#D97706)",
    location:"Al Olaya, Riyadh",
    bio:"Saudi fan with tickets for the Saudi Arabia group matches plus a few others I picked up. All official. I know the transfer process well — smooth and straightforward.",
  },


  // ── One-time / occasional sellers ───────────────────────────────────────
  {
    sellerId:"s13", seller:"Priya Nair",
    rating:4.8, response:7, sales:12, since:"Jan 2026",
    avatar:"PN", avatarBg:"linear-gradient(135deg,#BE185D,#EC4899)",
    location:"Bandra, Mumbai",
    bio:"First time selling tickets. Got 2 for the India watch party fixture but can no longer travel. Tickets are genuine, bought through official channels. Happy to provide proof.",
  },

  {
    sellerId:"s15", seller:"Mateus Costa",
    rating:4.3, response:18, sales:8, since:"Mar 2026",
    avatar:"MC", avatarBg:"linear-gradient(135deg,#1B3C88,#3B82F6)",
    location:"Copacabana, Rio de Janeiro",
    bio:"Selling my Brazil vs Colombia pair. Got a family thing that weekend now, gutted about it. New to this platform but been selling on other sites. Take a look at what I've got.",
  },

  {
    sellerId:"s18", seller:"Hannah Bergström",
    rating:5.0, response:2, sales:6, since:"Apr 2026",
    avatar:"HB", avatarBg:"linear-gradient(135deg,#DC2626,#EF4444)",
    location:"Gothenburg, Sweden",
    bio:"Only listing I have — selling 2 Category 3 seats I can't use. Bought through official Sweden allocation. Perfect reviews so far, I respond immediately.",
  ,
    contactUrl:"https://t.me/HannahBergstrom0",
  },


  {
    sellerId:"s21", seller:"Takeshi Mori",
    rating:4.7, response:8, sales:29, since:"Jan 2026",
    avatar:"TM", avatarBg:"linear-gradient(135deg,#BE185D,#F472B6)",
    location:"Shibuya, Tokyo",
    bio:"Japanese fan selling my spare Japan vs Germany ticket. My wife can't join me now so I'm going alone and selling her seat. Genuine ticket, ready to transfer.",
  },
  {
    sellerId:"s22", seller:"Fatou Diallo",
    rating:4.9, response:5, sales:17, since:"Feb 2026",
    avatar:"FD", avatarBg:"linear-gradient(135deg,#1B3C88,#818CF8)",
    location:"Dakar, Senegal",
    bio:"Selling tickets for France vs Senegal — the dream fixture for us. Got 4, only need 2. All official. This is a once in a lifetime match and I want someone genuine to have them.",
  ,
    contactUrl:"https://t.me/FatouDiallo0",
  },

  {
    sellerId:"s24", seller:"Camila Reyes",
    rating:4.8, response:7, sales:14, since:"Feb 2026",
    avatar:"CR", avatarBg:"linear-gradient(135deg,#DC2626,#F87171)",
    location:"Miraflores, Lima",
    bio:"Peruvian fan selling 2 tickets for the Peru fixture. Bought them when I thought I could go, work got in the way. Genuine tickets, can provide photos of confirmation email.",
  ,
    contactUrl:"https://t.me/Camilareyes00",
  },

  {
    sellerId:"s27", seller:"Finn Gallagher",
    rating:4.4, response:19, sales:9, since:"Mar 2026",
    avatar:"FG", avatarBg:"linear-gradient(135deg,#1B3C88,#3B82F6)",
    location:"Rathmines, Dublin",
    bio:"Irish lad selling tickets for a couple of matches. Got more than I needed when I was going with a bigger group. Bit slow to reply sometimes, sorry in advance — I'll get back to you.",
  ,
    contactUrl:"https://t.me/finngallagher",
  },
  {
    sellerId:"s28", seller:"Amara Traoré",
    rating:4.7, response:8, sales:33, since:"Dec 2025",
    avatar:"AT", avatarBg:"linear-gradient(135deg,#B45309,#F59E0B)",
    location:"Plateau, Abidjan",
    bio:"Ivorian fan selling my Senegal and Morocco tickets — I follow African football more broadly, not just my own team. Both tickets are genuine, bought through the CAF allocation process.",
  ,
    contactUrl:"https://wa.me/13272158404",
  },
  {
    sellerId:"s29", seller:"Sebastián Mora",
    rating:4.8, response:6, sales:71, since:"Jul 2025",
    avatar:"SM", avatarBg:"linear-gradient(135deg,#059669,#34D399)",
    location:"Laureles, Medellín",
    bio:"Colombian fan and occasional reseller. Have tickets for a few fixtures including the Colombia group games. I know the process well and always make it easy for the buyer.",
  },


  {
    sellerId:"s32", seller:"Hana Kovářová",
    rating:4.7, response:9, sales:16, since:"Feb 2026",
    avatar:"HK", avatarBg:"linear-gradient(135deg,#BE185D,#F472B6)",
    location:"Vinohrady, Prague",
    bio:"Czech football fan. Selling 2 tickets for a group stage match — my travel group fell apart when prices went up. New to this platform but I'm straightforward to deal with.",
  },
  {
    sellerId:"s33", seller:"Marcus Osei",
    rating:4.6, response:10, sales:44, since:"Sep 2025",
    avatar:"MO", avatarBg:"linear-gradient(135deg,#DC2626,#EF4444)",
    location:"East Legon, Accra",
    bio:"Ghanaian reseller with a few tickets across different fixtures. Been doing this informally for years, first time on a proper platform. Fair prices, no nonsense.",
  },
  {
    sellerId:"s34", seller:"Yasmin Öztürk",
    rating:4.8, response:6, sales:29, since:"Nov 2025",
    avatar:"YO", avatarBg:"linear-gradient(135deg,#0F766E,#14B8A6)",
    location:"Beşiktaş, Istanbul",
    bio:"Turkish football fan with tickets bought for the tournament. Selling 2 as our group is down to 4 from 6. Tickets are all official. I speak English, Turkish and German if that helps.",
  },
  {
    sellerId:"s35", seller:"Brandon Thibodeau",
    rating:4.3, response:21, sales:7, since:"Apr 2026",
    avatar:"BT", avatarBg:"linear-gradient(135deg,#475569,#64748B)",
    location:"Plateau-Mont-Royal, Montreal",
    bio:"Canadian selling tickets for a couple of matches near home. Bought 4 for the Canada games, only need 2 now. Not a professional seller — just a fan trying to get face value back.",
  },
];

// ─── Seat pool ─────────────────────────────────────
// ── Seat pool — 48 entries, mapped to FIFA WC2026 official categories ─────────
// Categories match FIFA ticketing: Category 1 (best), 2, 3, 4 (standard),
// plus Front Category (pitch-side), Easy Access, Wheelchair, Alcohol-Free.
// Sections are realistic stadium block numbers; rows and seats are specific.
// Prices controlled by getPrice() below — seat pool is geometry only.
export const SEAT_POOL = [
  // Category 1 — premium lower bowl, closest to pitch
  { section:"104", row:"8",  seats:"22-23", category:"Category 1" },
  { section:"106", row:"6",  seats:"11-12", category:"Category 1" },
  { section:"112", row:"4",  seats:"7-8",   category:"Category 1" },
  { section:"118", row:"9",  seats:"14-15", category:"Category 1" },
  { section:"122", row:"5",  seats:"31-32", category:"Category 1" },
  { section:"127", row:"7",  seats:"3-4",   category:"Category 1" },
  { section:"133", row:"11", seats:"18-19", category:"Category 1" },
  { section:"108", row:"3",  seats:"9-10",  category:"Category 1" },

  // Category 2 — mid-lower bowl
  { section:"204", row:"12", seats:"16-17", category:"Category 2" },
  { section:"209", row:"14", seats:"22-23", category:"Category 2" },
  { section:"215", row:"11", seats:"8-9",   category:"Category 2" },
  { section:"221", row:"16", seats:"33-34", category:"Category 2" },
  { section:"228", row:"9",  seats:"5-6",   category:"Category 2" },
  { section:"233", row:"13", seats:"27-28", category:"Category 2" },
  { section:"238", row:"15", seats:"11-12", category:"Category 2" },
  { section:"212", row:"10", seats:"19-20", category:"Category 2" },

  // Category 3 — upper bowl, mid-tier
  { section:"314", row:"18", seats:"24-25", category:"Category 3" },
  { section:"319", row:"22", seats:"6-7",   category:"Category 3" },
  { section:"325", row:"17", seats:"14-15", category:"Category 3" },
  { section:"331", row:"20", seats:"31-32", category:"Category 3" },
  { section:"337", row:"24", seats:"9-10",  category:"Category 3" },
  { section:"342", row:"19", seats:"17-18", category:"Category 3" },
  { section:"348", row:"21", seats:"2-3",   category:"Category 3" },
  { section:"308", row:"16", seats:"22-23", category:"Category 3" },

  // Category 4 — upper tier, furthest from pitch
  { section:"410", row:"28", seats:"14-15", category:"Category 4" },
  { section:"416", row:"31", seats:"8-9",   category:"Category 4" },
  { section:"422", row:"26", seats:"21-22", category:"Category 4" },
  { section:"429", row:"33", seats:"3-4",   category:"Category 4" },
  { section:"435", row:"29", seats:"17-18", category:"Category 4" },
  { section:"441", row:"27", seats:"11-12", category:"Category 4" },
  { section:"448", row:"32", seats:"25-26", category:"Category 4" },
  { section:"404", row:"30", seats:"6-7",   category:"Category 4" },

  // Front Category — pitch-side premium
  { section:"FC-A", row:"2",  seats:"14-15", category:"Front Category 1" },
  { section:"FC-B", row:"3",  seats:"8-9",   category:"Front Category 1" },
  { section:"FC-C", row:"1",  seats:"22-23", category:"Front Category 2" },
  { section:"FC-D", row:"2",  seats:"5-6",   category:"Front Category 2" },

  // Alcohol-Free Areas
  { section:"AF-211", row:"14", seats:"16-17", category:"Alcohol-Free Area 1" },
  { section:"AF-217", row:"11", seats:"7-8",   category:"Alcohol-Free Area 2" },
  { section:"AF-322", row:"19", seats:"12-13", category:"Alcohol-Free Area 3" },
  { section:"AF-329", row:"22", seats:"24-25", category:"Alcohol-Free Area 3" },

  // Easy Access Standard
  { section:"EA-101", row:"1",  seats:"4-5",   category:"Easy Access Standard 1" },
  { section:"EA-115", row:"1",  seats:"11-12", category:"Easy Access Standard 2" },
  { section:"EA-213", row:"1",  seats:"8-9",   category:"Easy Access Standard 3" },

  // Wheelchair & Easy Access Amenity
  { section:"WA-102", row:"1",  seats:"1-2",   category:"Wheelchair & Easy Access 1" },
  { section:"WA-219", row:"1",  seats:"3-4",   category:"Wheelchair & Easy Access 2" },

  // Obstructed View
  { section:"OV-316", row:"17", seats:"19-20", category:"Obstructed View 1" },
  { section:"OV-344", row:"21", seats:"7-8",   category:"Obstructed View 4" },
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
// ── Price table — keyed by FIFA category, per round ─────────────────────────
// Caps: VIP/Front/Premium max $1,500 · Standard (Cat 3/4) ~$300
// Each array gives variation across listings; idx cycles through values.
const CATEGORY_PRICES = {
  // Cat 1 — lower bowl premium
  "Category 1": {
    "Final":         [1100,1200,1300,1400,1500],
    "Semi-Final":    [720, 780, 840, 920, 980],
    "Quarter-Final": [480, 530, 580, 640],
    "3rd Place":     [360, 390, 420],
    "Round of 16":   [310, 340, 370, 400],
    "Round of 32":   [260, 285, 310],
    "group_hd":      [390, 420, 460, 490, 520, 550],
    "group":         [230, 290, 270, 310, 350],
  },
  // Cat 2 — mid-lower
  "Category 2": {
    "Final":         [780, 840, 900, 980, 1050],
    "Semi-Final":    [520, 560, 610, 660],
    "Quarter-Final": [360, 390, 420, 460],
    "3rd Place":     [270, 295, 320],
    "Round of 16":   [230, 255, 280, 305],
    "Round of 32":   [200, 205, 225],
    "group_hd":      [280, 305, 330, 355, 380],
    "group":         [205, 215, 225, 240, 210],
  },
  // Cat 3 — upper bowl mid
  "Category 3": {
    "Final":         [460, 490, 520, 550, 580],
    "Semi-Final":    [320, 345, 370, 395],
    "Quarter-Final": [240, 260, 280, 300],
    "3rd Place":     [210, 218, 228],
    "Round of 16":   [208, 215, 222, 230],
    "Round of 32":   [205, 210, 218],
    "group_hd":      [215, 228, 242, 255, 268],
    "group":         [205, 212, 220, 215, 210],
  },
  // Cat 4 — upper tier
  "Category 4": {
    "Final":         [310, 330, 350, 370, 390],
    "Semi-Final":    [215, 235, 255, 275],
    "Quarter-Final": [208, 215, 224, 235],
    "3rd Place":     [204, 210, 216],
    "Round of 16":   [202, 208, 214, 220],
    "Round of 32":   [200, 205, 212],
    "group_hd":      [210, 218, 228, 238, 248],
    "group":         [204, 210, 218, 208, 215],
  },
  // Front Category (pitch-side) — premium
  "Front Category 1": {
    "Final":         [1350,1400,1450,1500],
    "Semi-Final":    [900, 960, 1020, 1080],
    "Quarter-Final": [620, 680, 740],
    "3rd Place":     [460, 500, 540],
    "Round of 16":   [390, 430, 470],
    "Round of 32":   [320, 360, 400],
    "group_hd":      [480, 520, 560, 600, 640],
    "group":         [290, 315, 340, 365],
  },
  "Front Category 2": {
    "Final":         [1050,1100,1150,1200],
    "Semi-Final":    [700, 750, 800, 850],
    "Quarter-Final": [480, 520, 560],
    "3rd Place":     [360, 390, 420],
    "Round of 16":   [305, 335, 365],
    "Round of 32":   [250, 275, 300],
    "group_hd":      [370, 400, 430, 460],
    "group":         [220, 240, 260, 280],
  },
  // Alcohol-Free Areas — similar to Cat 2/3 range
  "Alcohol-Free Area 1": {
    "Final":         [820, 880, 940],
    "Semi-Final":    [560, 600, 640],
    "Quarter-Final": [390, 420, 450],
    "3rd Place":     [295, 320, 345],
    "Round of 16":   [250, 270, 290],
    "Round of 32":   [210, 225, 240],
    "group_hd":      [300, 320, 340, 360],
    "group":         [210, 220, 230, 215],
  },
  "Alcohol-Free Area 2": {
    "Final":         [720, 770, 820],
    "Semi-Final":    [490, 525, 560],
    "Quarter-Final": [345, 370, 395],
    "3rd Place":     [260, 280, 300],
    "Round of 16":   [225, 242, 260],
    "Round of 32":   [210, 218, 228],
    "group_hd":      [265, 285, 305, 325],
    "group":         [208, 216, 224, 215],
  },
  "Alcohol-Free Area 3": {
    "Final":         [600, 640, 680],
    "Semi-Final":    [410, 440, 470],
    "Quarter-Final": [290, 315, 340],
    "3rd Place":     [225, 242, 260],
    "Round of 16":   [210, 218, 228],
    "Round of 32":   [204, 210, 218],
    "group_hd":      [220, 238, 256, 274],
    "group":         [206, 213, 222, 210],
  },
  // Easy Access Standard
  "Easy Access Standard 1": {
    "Final":         [920, 980, 1040],
    "Semi-Final":    [620, 665, 710],
    "Quarter-Final": [430, 465, 500],
    "3rd Place":     [325, 350, 375],
    "Round of 16":   [275, 300, 325],
    "Round of 32":   [225, 248, 272],
    "group_hd":      [330, 355, 380, 405],
    "group":         [212, 222, 234, 245],
  },
  "Easy Access Standard 2": {
    "Final":         [780, 830, 880],
    "Semi-Final":    [525, 565, 605],
    "Quarter-Final": [370, 400, 430],
    "3rd Place":     [280, 305, 330],
    "Round of 16":   [237, 258, 279],
    "Round of 32":   [210, 220, 235],
    "group_hd":      [285, 308, 331, 354],
    "group":         [208, 216, 226, 218],
  },
  "Easy Access Standard 3": {
    "Final":         [640, 680, 720],
    "Semi-Final":    [435, 468, 501],
    "Quarter-Final": [308, 333, 358],
    "3rd Place":     [234, 254, 274],
    "Round of 16":   [210, 220, 235],
    "Round of 32":   [204, 210, 218],
    "group_hd":      [238, 257, 276, 295],
    "group":         [205, 212, 222, 215],
  },
  // Wheelchair & Easy Access Amenity
  "Wheelchair & Easy Access 1": {
    "Final":         [990, 1050, 1110],
    "Semi-Final":    [665, 715, 765],
    "Quarter-Final": [463, 500, 537],
    "3rd Place":     [350, 378, 406],
    "Round of 16":   [296, 320, 344],
    "Round of 32":   [240, 262, 285],
    "group_hd":      [356, 383, 410, 437],
    "group":         [212, 228, 244, 260],
  },
  "Wheelchair & Easy Access 2": {
    "Final":         [820, 870, 920],
    "Semi-Final":    [553, 595, 637],
    "Quarter-Final": [388, 419, 450],
    "3rd Place":     [294, 318, 342],
    "Round of 16":   [249, 270, 291],
    "Round of 32":   [208, 222, 242],
    "group_hd":      [298, 321, 344, 367],
    "group":         [206, 215, 224, 235],
  },
  // Obstructed View — discounted vs equivalent non-obstructed
  "Obstructed View 1": {
    "Final":         [560, 595, 630],
    "Semi-Final":    [378, 407, 436],
    "Quarter-Final": [265, 286, 307],
    "3rd Place":     [210, 222, 234],
    "Round of 16":   [205, 212, 220],
    "Round of 32":   [203, 208, 215],
    "group_hd":      [202, 218, 234, 250],
    "group":         [204, 210, 217, 208],
  },
  "Obstructed View 4": {
    "Final":         [390, 415, 440],
    "Semi-Final":    [264, 284, 304],
    "Quarter-Final": [210, 215, 225],
    "3rd Place":     [204, 210, 216],
    "Round of 16":   [202, 207, 214],
    "Round of 32":   [200, 205, 212],
    "group_hd":      [206, 214, 222, 232],
    "group":         [203, 209, 216, 210],
  },
};

// ─── Market price overrides (sourced from SeatGeek, Jun 12 2026) ─────────────
// Maps fixture ID → market "from" price in USD.
// getPrice() returns this directly when a match has an override, bypassing
// the category-based formula so listings reflect real market benchmarks.
// Includes ALL fixtures (both active and commented-out) so prices are ready
// the moment any match is uncommented in wc26Schedule.js.
const PRICE_OVERRIDES = {
  // ── GROUP A ──────────────────────────────────────────────────────────────
  "gs01": 500, // Mexico vs South Africa       — Jun 11, Estadio Azteca (opening match; SeatGeek premium)
  "gs02":  500, // South Korea vs Czech Republic — Jun 11, Estadio Akron   [commented out]
  "gs03":  500, // Czech Republic vs South Africa— Jun 18, Mercedes-Benz   [commented out]
  "gs04": 3615, // Mexico vs South Korea         — Jun 18, Estadio Akron
  "gs05": 2159, // Czech Republic vs Mexico      — Jun 24, Estadio Azteca  [commented out — SeatGeek "Mexico vs Czechia" $2,159]
  "gs06":  500, // South Africa vs South Korea   — Jun 24, Estadio BBVA    [commented out — peer to gs02]

  // ── GROUP B ──────────────────────────────────────────────────────────────
  "gs07": 500, // Canada vs Bosnia & Herzegovina— Jun 12, BMO Field
  "gs08":  500, // Qatar vs Switzerland          — Jun 13, Levi's Stadium   [commented out — SeatGeek $393]
  "gs09":  500, // Switzerland vs Bosnia & Herz  — Jun 18, SoFi Stadium    [commented out — SeatGeek "Switzerland vs Bosnia" $434]
  "gs10": 500, // Canada vs Qatar               — Jun 18, BC Place
  "gs11":  588, // Switzerland vs Canada         — Jun 24, BC Place         [SeatGeek "Canada vs Switzerland" $588]
  "gs11b": 647, // Switzerland vs Canada (Sophie Whitfield duplicate, +10%)
  "gs12":  500, // Bosnia & Herz vs Qatar        — Jun 24, Lumen Field      [commented out — SeatGeek "Qatar vs Bosnia" $253]
  "gs12b": 550, // Bosnia & Herz vs Qatar (Amara Traoré duplicate, +10%)

  // ── GROUP C ──────────────────────────────────────────────────────────────
  "gs13": 1569, // Brazil vs Morocco             — Jun 13, MetLife Stadium
  "gs14":  929, // Haiti vs Scotland             — Jun 13, Gillette Stadium  [commented out — SeatGeek "Haiti vs Scotland" $929]
  "gs15":  757, // Scotland vs Morocco           — Jun 19, Gillette Stadium  [commented out — SeatGeek $757]
  "gs16": 1100, // Brazil vs Haiti               — Jun 19, Lincoln Financial Field
  "gs17": 1869, // Scotland vs Brazil            — Jun 24, Hard Rock Stadium [SeatGeek "Brazil vs Scotland" $1,869]
  "gs18": 500, // Morocco vs Haiti              — Jun 24, Mercedes-Benz     [SeatGeek "Morocco vs Haiti" $442]

  // ── GROUP D ──────────────────────────────────────────────────────────────
  "gs19": 1665, // USA vs Paraguay               — Jun 12, SoFi Stadium
  "gs20":  500, // Australia vs Turkey           — Jun 13, BC Place          [commented out — SeatGeek $275]
  "gs21": 1185, // USA vs Australia              — Jun 19, Lumen Field       [SeatGeek $1,185]
  "gs22":  500, // Turkey vs Paraguay            — Jun 19, Levi's Stadium    [commented out — SeatGeek "Paraguay vs Turkey" $469]
  "gs23": 500, // Turkey vs USA                 — Jun 25, SoFi Stadium      [peer to gs22]
  "gs24":  500, // Paraguay vs Australia         — Jun 25, Levi's Stadium    [commented out — peer to gs20]

  // ── GROUP E ──────────────────────────────────────────────────────────────
  "gs25":  566, // Germany vs Curaçao            — Jun 14, NRG Stadium       [commented out — SeatGeek "Germany vs Curacao" $566]
  "gs26":  933, // Ivory Coast vs Ecuador        — Jun 14, Lincoln Financial Field
  "gs27":  985, // Germany vs Ivory Coast        — Jun 20, BMO Field         [SeatGeek $985]
  "gs28":  500, // Ecuador vs Curaçao            — Jun 20, Arrowhead Stadium [commented out — SeatGeek $419]
  "gs29":  500, // Curaçao vs Ivory Coast        — Jun 25, Lincoln Financial Field [commented out — peer to gs28]
  "gs30":  933, // Ecuador vs Germany            — Jun 25, MetLife Stadium   [peer to gs26]

  // ── GROUP F ──────────────────────────────────────────────────────────────
  "gs31":  987, // Netherlands vs Japan          — Jun 14, AT&T Stadium
  "gs32":  750, // Sweden vs Tunisia             — Jun 14, Estadio BBVA
  "gs33":  708, // Netherlands vs Sweden         — Jun 20, NRG Stadium       [SeatGeek $708]
  "gs34":  704, // Tunisia vs Japan              — Jun 20, Estadio BBVA      [SeatGeek "Japan vs Tunisia" $704]
  "gs35":  987, // Japan vs Sweden               — Jun 25, AT&T Stadium      [peer to gs31]
  "gs36":  750, // Tunisia vs Netherlands        — Jun 25, Arrowhead Stadium [peer to gs32]

  // ── GROUP G ──────────────────────────────────────────────────────────────
  "gs37": 500, // Belgium vs Egypt              — Jun 15, Lumen Field
  "gs38":  500, // Iran vs New Zealand           — Jun 15, SoFi Stadium      [commented out — SeatGeek "New Zealand vs Iran" $308]
  "gs39": 500, // Belgium vs Iran               — Jun 21, SoFi Stadium      [SeatGeek $386]
  "gs40":  500, // New Zealand vs Egypt          — Jun 21, BC Place          [commented out — SeatGeek $273]
  "gs41":  500, // Egypt vs Iran                 — Jun 26, Lumen Field       [commented out — peer to gs38]
  "gs42":  500, // New Zealand vs Belgium        — Jun 26, BC Place          [commented out — peer to gs39]

  // ── GROUP H ──────────────────────────────────────────────────────────────
  "gs43":  618, // Spain vs Cape Verde           — Jun 15, Mercedes-Benz Stadium
  "gs44": 500, // Saudi Arabia vs Uruguay       — Jun 15, Hard Rock Stadium
  "gs45":  833, // Spain vs Saudi Arabia         — Jun 21, Mercedes-Benz     [SeatGeek $833]
  "gs46": 500, // Uruguay vs Cape Verde         — Jun 21, Hard Rock Stadium [SeatGeek $413]
  "gs47": 500, // Cape Verde vs Saudi Arabia    — Jun 26, NRG Stadium       [peer to gs46]
  "gs48":  618, // Uruguay vs Spain              — Jun 26, Estadio Akron     [peer to gs43]

  // ── GROUP I ──────────────────────────────────────────────────────────────
  "gs49":  864, // France vs Senegal             — Jun 16, MetLife Stadium
  "gs50": 500, // Iraq vs Norway                — Jun 16, Gillette Stadium
  "gs51":  704, // France vs Iraq                — Jun 22, Lincoln Financial Field [SeatGeek $704]
  "gs52":  565, // Norway vs Senegal             — Jun 22, MetLife Stadium   [SeatGeek $565]
  "gs53":  864, // Norway vs France              — Jun 26, Gillette Stadium  [peer to gs49]
  "gs54": 500, // Senegal vs Iraq               — Jun 26, BMO Field         [peer to gs50]

  // ── GROUP J ──────────────────────────────────────────────────────────────
  "gs55":  831, // Argentina vs Algeria          — Jun 16, Arrowhead Stadium
  "gs56":  500, // Austria vs Jordan             — Jun 16, Levi's Stadium    [commented out — SeatGeek $244]
  "gs57": 1451, // Argentina vs Austria          — Jun 22, AT&T Stadium      [SeatGeek $1,451]
  "gs58": 500, // Jordan vs Algeria             — Jun 22, Levi's Stadium    [SeatGeek $263]
  "gs58b": 550, // Jordan vs Algeria (Sophie Whitfield duplicate, +10%)
  "gs59": 500, // Algeria vs Austria            — Jun 27, Arrowhead Stadium [peer to gs56]
  "gs60":  831, // Jordan vs Argentina           — Jun 27, AT&T Stadium      [peer to gs55]
  "gs60b": 914, // Jordan vs Argentina (Amara Traoré duplicate, +10%)

  // ── GROUP K ──────────────────────────────────────────────────────────────
  "gs61": 1044, // Portugal vs DR Congo          — Jun 17, NRG Stadium
  "gs62":  821, // Uzbekistan vs Colombia        — Jun 17, Estadio Azteca
  "gs63": 1328, // Portugal vs Uzbekistan        — Jun 23, NRG Stadium       [SeatGeek $1,328]
  "gs64":  704, // Colombia vs DR Congo          — Jun 23, Estadio Akron     [SeatGeek $704]
  "gs65": 1044, // Colombia vs Portugal          — Jun 27, Hard Rock Stadium [peer to gs61]
  "gs66":  821, // DR Congo vs Uzbekistan        — Jun 27, Mercedes-Benz     [peer to gs62]

  // ── GROUP L ──────────────────────────────────────────────────────────────
  "gs67":  969, // England vs Croatia            — Jun 17, AT&T Stadium
  "gs68": 500, // Ghana vs Panama               — Jun 17, BMO Field
  "gs69":  763, // England vs Ghana              — Jun 23, Gillette Stadium  [SeatGeek $763]
  "gs70":  698, // Panama vs Croatia             — Jun 23, BMO Field         [SeatGeek "Croatia vs Panama" $698]
  "gs71":  969, // Panama vs England             — Jun 27, MetLife Stadium   [peer to gs67]
  "gs72": 500, // Croatia vs Ghana              — Jun 27, Lincoln Financial Field [peer to gs68]
};

function getPrice(fixture, idx, category) {
  // If we have a real market price for this fixture, use it directly.
  // Vary slightly by idx so multiple listings of the same match aren't identical.
  if (PRICE_OVERRIDES[fixture.id] !== undefined) {
    const base    = PRICE_OVERRIDES[fixture.id];
    const offsets = [-30, -20, -10, 0, 10, 20, 40, 60, 80];
    return Math.max(200, base + offsets[idx % offsets.length]);
  }

  const isHD  = WC26_HIGH_DEMAND.has(fixture.id);
  const round = fixture.round ?? `Group ${fixture.group}`;
  const cat   = category ?? "Category 3"; // fallback

  const catPrices = CATEGORY_PRICES[cat] ?? CATEGORY_PRICES["Category 3"];

  // Map round to price table key
  let key;
  if (round === "Final")         key = "Final";
  else if (round === "Semi-Final")    key = "Semi-Final";
  else if (round === "Quarter-Final") key = "Quarter-Final";
  else if (round === "3rd Place")     key = "3rd Place";
  else if (round === "Round of 16")   key = "Round of 16";
  else if (round === "Round of 32")   key = "Round of 32";
  else key = isHD ? "group_hd" : "group";

  const prices = catPrices[key] ?? catPrices["group"];
  return Math.max(200, prices[idx % prices.length]);
}

export const ALL_MATCHES = WC26_ALL_FIXTURES.map((m, i) => {
  const venueInfo = WC26_VENUES[m.venue] ?? { city: m.venue, country: "Unknown" };
  const isHD      = WC26_HIGH_DEMAND.has(m.id);
  const seat      = SEAT_POOL[i % SEAT_POOL.length];
  const price     = getPrice(m, i, seat.category);
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
    isOpeningMatch: m.id === "gs01",
    // isLive / liveScore are false/null by default — overridden by useLiveMatches API
    isLive: false,
    liveScore: null,
    listedAt: makeListedAt(i),
    // Weighted seller assignment: power sellers (s01–s05) appear ~30% of listings
    // Remaining 70% spread across regular + one-time sellers
    // Explicit overrides applied for specific fixtures
    ...(() => {
      const SELLER_OVERRIDES = {
        // ── Specific seller assignments ──
         8: SELLERS.find(s => s.sellerId === "s07"), // Aisha Mensah      — gs09
        11: SELLERS.find(s => s.sellerId === "s02"), // Sophie Whitfield  — gs11b (Priya dup 1, +10%)
        13: SELLERS.find(s => s.sellerId === "s28"), // Amara Traoré      — gs12b (Priya dup 2, +10%)
        16: SELLERS.find(s => s.sellerId === "s09"), // Yuna Park         — gs15
        22: SELLERS.find(s => s.sellerId === "s11"), // Khalid Al-Rashidi — gs21
        28: SELLERS.find(s => s.sellerId === "s13"), // Priya Nair        — gs27
        34: SELLERS.find(s => s.sellerId === "s15"), // Mateus Costa      — gs33
        36: SELLERS.find(s => s.sellerId === "s18"), // Hannah Bergström  — gs35
        37: SELLERS.find(s => s.sellerId === "s18"), // Hannah Bergström  — gs36
        39: SELLERS.find(s => s.sellerId === "s09"), // Yuna Park         — gs38
        41: SELLERS.find(s => s.sellerId === "s09"), // Yuna Park         — gs40
        42: SELLERS.find(s => s.sellerId === "s09"), // Yuna Park         — gs41
        45: SELLERS.find(s => s.sellerId === "s18"), // Hannah Bergström  — gs44
        46: SELLERS.find(s => s.sellerId === "s01"), // Marco Delgado     — gs45
        52: SELLERS.find(s => s.sellerId === "s03"), // Rafael Souza      — gs51
        58: SELLERS.find(s => s.sellerId === "s04"), // Nadia Fontaine    — gs57
        60: SELLERS.find(s => s.sellerId === "s02"), // Sophie Whitfield  — gs58b (Priya dup 3, +10%)
        63: SELLERS.find(s => s.sellerId === "s28"), // Amara Traoré      — gs60b (Mateus dup, +10%)
        71: SELLERS.find(s => s.sellerId === "s18"), // Hannah Bergström  — gs68
        72: SELLERS.find(s => s.sellerId === "s22"), // Fatou Diallo      — gs69
        74: SELLERS.find(s => s.sellerId === "s24"), // Camila Reyes      — gs71
        75: SELLERS.find(s => s.sellerId === "s27"), // Finn Gallagher    — gs72
        // ── Knockout round overrides (hidden until bracket resolves) ──
        88: SELLERS.find(s => s.sellerId === "s04"), // Nadia Fontaine    — r16_01
        89: SELLERS.find(s => s.sellerId === "s03"), // Rafael Souza      — r16_02
        97: SELLERS.find(s => s.sellerId === "s05"), // James Okafor      — qf_02
        98: SELLERS.find(s => s.sellerId === "s02"), // Sophie Whitfield  — qf_03
      };
      if (SELLER_OVERRIDES[i]) return SELLER_OVERRIDES[i];
      const POWER   = SELLERS.filter(s => ["s01","s02","s03","s04","s05"].includes(s.sellerId));
      const OTHERS  = SELLERS.filter(s => !["s01","s02","s03","s04","s05","s17","s25"].includes(s.sellerId));
      if (i % 3 === 0) return POWER[i % POWER.length];
      return OTHERS[Math.floor(i / 3) % OTHERS.length];
    })(),
    ...seat,
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
  { icon:"🛒", cls:"sale",    match:"Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 vs Brazil 🇧🇷",           action:"Someone just grabbed the last 2 in Sec 104 Row 8 · $1869 each",                 offsetMins:3   },
  { icon:"🛒", cls:"sale",    match:"Czech Republic 🇨🇿 vs Mexico 🇲🇽",       action:"5 gone in under 3 mins · Category 2 Sec 209 · $2159/ea",                          offsetMins:7   },
  { icon:"🛒", cls:"sale",    match:"France 🇫🇷 vs Iraq 🇮🇶",                  action:"7 sold · Sec 319 Row 22 · $704 each",                                             offsetMins:6   },
  { icon:"🛒", cls:"sale",    match:"England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Ghana 🇬🇭",             action:"Pair of Category 3 seats snagged · Sec 429 Row 33 · $763 each",                 offsetMins:19  },
  { icon:"🛒", cls:"sale",    match:"Portugal 🇵🇹 vs Uzbekistan 🇺🇿",          action:"3 tickets moved fast · Category 1 Sec 127 · $1328 each",                         offsetMins:12  },
  { icon:"🛒", cls:"sale",    match:"Argentina 🇦🇷 vs Austria 🇦🇹",            action:"Block buy — 4 seats · Sec 221 Row 12 · $1451 each",                               offsetMins:31  },
  { icon:"🛒", cls:"sale",    match:"Norway 🇳🇴 vs France 🇫🇷",               action:"2 seats gone · Category 3 Sec 325 Row 14 · $864 each",                            offsetMins:58  },
  { icon:"🛒", cls:"sale",    match:"Ecuador 🇪🇨 vs Germany 🇩🇪",              action:"1 ticket sold · Sec 204 Row 12 · $933",                                           offsetMins:43  },
  { icon:"🛒", cls:"sale",    match:"Colombia 🇨🇴 vs Portugal 🇵🇹",            action:"Snagged — 2x Sec 112 Row 4 · $1044 each, gone in 8 mins",                        offsetMins:17  },
  { icon:"🛒", cls:"sale",    match:"Japan 🇯🇵 vs Sweden 🇸🇪",                action:"6 tickets sold this hour · Category 4 Sec 448 · $987 avg",                       offsetMins:83  },
  { icon:"🛒", cls:"sale",    match:"Switzerland 🇨🇭 vs Canada 🇨🇦",           action:"2 seats moved · Sec 416 Row 31 · $588 each",                                      offsetMins:55  },
  { icon:"🛒", cls:"sale",    match:"Tunisia 🇹🇳 vs Netherlands 🇳🇱",          action:"4 sold · Category 2 Sec 209 · $750 each",                                         offsetMins:22  },
  { icon:"🛒", cls:"sale",    match:"Uruguay 🇺🇾 vs Spain 🇪🇸",               action:"1 Front Category 1 sold · Sec FC-A Row 2 · $618",                                 offsetMins:47  },
  { icon:"🛒", cls:"sale",    match:"Panama 🇵🇦 vs Croatia 🇭🇷",              action:"2x Sec 104 Row 8 snagged · $698 each",                                            offsetMins:36  },
  { icon:"🛒", cls:"sale",    match:"Colombia 🇨🇴 vs DR Congo 🇨🇩",            action:"3 tickets sold · Category 4 Sec 429 · $704 each",                                 offsetMins:14  },
  { icon:"🛒", cls:"sale",    match:"Norway 🇳🇴 vs Senegal 🇸🇳",              action:"5 seats bought in 2 transactions · Sec 231 · $565 each",                          offsetMins:67  },
  { icon:"🛒", cls:"sale",    match:"Panama 🇵🇦 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿",             action:"2 Category 1 seats gone · Sec 144 Row 9 · $969 each",                            offsetMins:29  },
  { icon:"🛒", cls:"sale",    match:"Jordan 🇯🇴 vs Argentina 🇦🇷",             action:"1 ticket · Sec 205 Row 3 · $831 — sold 4 mins after listing",                    offsetMins:11  },
  { icon:"🛒", cls:"sale",    match:"Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 vs Brazil 🇧🇷",           action:"4 Category 1 seats snagged · Sec 104 · $1869 each",                              offsetMins:88  },
  { icon:"🛒", cls:"sale",    match:"Czech Republic 🇨🇿 vs Mexico 🇲🇽",       action:"2x Sec 112 Row 6 · $2159 each · both gone",                                       offsetMins:23  },
  { icon:"🛒", cls:"sale",    match:"Morocco 🇲🇦 vs Haiti 🇭🇹",               action:"3 sold · Category 4 Sec 448 · $500 each",                                         offsetMins:141 },
  { icon:"🛒", cls:"sale",    match:"DR Congo 🇨🇩 vs Uzbekistan 🇺🇿",         action:"1x Front Category 1 Sec FC-B Row 3 · $821 — reserved",                           offsetMins:52  },
  { icon:"🛒", cls:"sale",    match:"Algeria 🇩🇿 vs Austria 🇦🇹",             action:"6 tickets sold this session · Sec 117 · avg $500",                               offsetMins:37  },
  { icon:"🛒", cls:"sale",    match:"Croatia 🇭🇷 vs Ghana 🇬🇭",               action:"2 Category 3 snagged · Sec 215 Row 14 · $500 each",                              offsetMins:16  },
  { icon:"🛒", cls:"sale",    match:"New Zealand 🇳🇿 vs Belgium 🇧🇪",          action:"2x Sec 416 Row 31 · $500 each",                                                   offsetMins:74  },
  { icon:"🛒", cls:"sale",    match:"Argentina 🇦🇷 vs Austria 🇦🇹",            action:"Buyer from Buenos Aires grabbed 4 · Sec 221 · $1451 each",                        offsetMins:53  },
  { icon:"🛒", cls:"sale",    match:"Norway 🇳🇴 vs Senegal 🇸🇳",              action:"3 Category 1 gone · Sec 144 Row 9 · $565 each",                                  offsetMins:27  },
  { icon:"🛒", cls:"sale",    match:"Uruguay 🇺🇾 vs Spain 🇪🇸",               action:"2 sold · Sec 117 Row 12 · $618 each · both to same buyer",                        offsetMins:41  },
  { icon:"🛒", cls:"sale",    match:"Norway 🇳🇴 vs France 🇫🇷",               action:"Another pair gone · Sec 319 Row 22 · $864 each",                                  offsetMins:118 },
  { icon:"🛒", cls:"sale",    match:"Jordan 🇯🇴 vs Argentina 🇦🇷",             action:"1 ticket · Category 3 Sec 221 Row 12 · $831 — last one",                         offsetMins:9   },
  { icon:"🛒", cls:"sale",    match:"Senegal 🇸🇳 vs Iraq 🇮🇶",                action:"Front Category 1 sold · Sec FC-A Row 2 · $500 · reserved by buyer",              offsetMins:66  },
  { icon:"🛒", cls:"sale",    match:"Portugal 🇵🇹 vs Uzbekistan 🇺🇿",          action:"5 seats gone this session · Sec 112 Row 6 · $1328/ea",                           offsetMins:38  },
  { icon:"🛒", cls:"sale",    match:"Panama 🇵🇦 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿",             action:"2 Category 1 moved · Sec 144 · $969 each",                                       offsetMins:72  },
  { icon:"🛒", cls:"sale",    match:"Colombia 🇨🇴 vs Portugal 🇵🇹",            action:"4 sold in 1 transaction · Sec 112 Row 4 · $1044 each",                           offsetMins:19  },
  { icon:"🛒", cls:"sale",    match:"France 🇫🇷 vs Iraq 🇮🇶",                  action:"3 Category 2 gone · Sec 117 · $704 each · fast sale",                             offsetMins:55  },
  { icon:"🛒", cls:"sale",    match:"Ecuador 🇪🇨 vs Germany 🇩🇪",              action:"2x Sec 204 Row 12 · $933 each · buyer confirmed",                                  offsetMins:84  },
  { icon:"🛒", cls:"sale",    match:"Japan 🇯🇵 vs Sweden 🇸🇪",                action:"4 Category 2 snagged · Sec 117 · $987 each",                                      offsetMins:29  },
  { icon:"🛒", cls:"sale",    match:"Colombia 🇨🇴 vs DR Congo 🇨🇩",            action:"3 Category 3 sold · Sec 429 Row 33 · $704 each",                                  offsetMins:47  },
  { icon:"🛒", cls:"sale",    match:"Cape Verde 🇨🇻 vs Saudi Arabia 🇸🇦",      action:"2x Sec 416 Row 31 · $500 each · both sold",                                       offsetMins:93  },

  // ── Price drops ────────────────────────────────────────────────────────────
  { icon:"💸", cls:"price",   match:"Croatia 🇭🇷 vs Ghana 🇬🇭",               action:"Price dropped 8% · Category 3 Sec 325 now from $500",                            offsetMins:9   },
  { icon:"💸", cls:"price",   match:"Egypt 🇪🇬 vs Iran 🇮🇷",                  action:"Just dropped 6% · Sec 104 Row 8 now from $500",                                  offsetMins:38  },
  { icon:"💸", cls:"price",   match:"Cape Verde 🇨🇻 vs Saudi Arabia 🇸🇦",      action:"Seller lowered by 11% · Category 4 Sec 429 now from $500",                       offsetMins:71  },
  { icon:"💸", cls:"price",   match:"New Zealand 🇳🇿 vs Belgium 🇧🇪",          action:"Price cut 9% · Sec 220 now from $500",                                            offsetMins:44  },
  { icon:"💸", cls:"price",   match:"Curaçao 🇨🇼 vs Ivory Coast 🇨🇮",         action:"Dropped 7% — Sec 318 now from $500",                                              offsetMins:18  },
  { icon:"💸", cls:"price",   match:"Japan 🇯🇵 vs Sweden 🇸🇪",                action:"Seller reduced 5% · Category 2 Sec 209 now from $938",                           offsetMins:92  },
  { icon:"💸", cls:"price",   match:"Jordan 🇯🇴 vs Argentina 🇦🇷",             action:"13% off · Sec 205 Row 3 now from $723",                                           offsetMins:61  },
  { icon:"💸", cls:"price",   match:"Uruguay 🇺🇾 vs Spain 🇪🇸",               action:"Dropped 4% · Category 1 Sec 127 now from $593",                                  offsetMins:26  },
  { icon:"💸", cls:"price",   match:"Bosnia & Herzegovina 🇧🇦 vs Qatar 🇶🇦",   action:"Price just fell 10% · Sec 231 now from $500",                                    offsetMins:53  },
  { icon:"💸", cls:"price",   match:"Ecuador 🇪🇨 vs Germany 🇩🇪",              action:"Modest dip, 3% · Sec 204 Row 12 now from $905",                                  offsetMins:34  },
  { icon:"💸", cls:"price",   match:"Colombia 🇨🇴 vs Portugal 🇵🇹",            action:"Down 6% · Category 1 Sec 127 now from $980",                                     offsetMins:79  },
  { icon:"💸", cls:"price",   match:"England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Ghana 🇬🇭",             action:"Seller dropped price 8% · Category 3 now from $702",                            offsetMins:15  },

  // ── Price rises ─────────────────────────────────────────────────────────────
  { icon:"📈", cls:"price",   match:"Norway 🇳🇴 vs France 🇫🇷",               action:"Price rose 5% · Category 3 Sec 319 now from $907",                               offsetMins:7   },
  { icon:"📈", cls:"price",   match:"Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 vs Brazil 🇧🇷",           action:"Up 12% since yesterday · Category 1 now from $2094",                           offsetMins:167 },
  { icon:"📈", cls:"price",   match:"Argentina 🇦🇷 vs Austria 🇦🇹",            action:"Demand spike — up 9% · Sec 117 now from $1582",                                  offsetMins:48  },
  { icon:"📈", cls:"price",   match:"Portugal 🇵🇹 vs Uzbekistan 🇺🇿",          action:"Prices climbing · Category 1 now from $1447 (+8%)",                              offsetMins:21  },
  { icon:"📈", cls:"price",   match:"Colombia 🇨🇴 vs Portugal 🇵🇹",            action:"Up 15% in 2h · Category 1 now from $1201",                                       offsetMins:103 },
  { icon:"📈", cls:"price",   match:"Czech Republic 🇨🇿 vs Mexico 🇲🇽",       action:"Rose 7% · Sec 117 now from $2310",                                               offsetMins:33  },
  { icon:"📈", cls:"price",   match:"Panama 🇵🇦 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿",             action:"Steady rise — up 6% since morning · now from $1027",                          offsetMins:145 },
  { icon:"📈", cls:"price",   match:"DR Congo 🇨🇩 vs Uzbekistan 🇺🇿",         action:"Went up 11% · Sec 112 now from $911",                                            offsetMins:57  },
  { icon:"📈", cls:"price",   match:"Norway 🇳🇴 vs France 🇫🇷",               action:"Up 4% · Category 3 Sec 325 now from $899",                                       offsetMins:82  },
  { icon:"📈", cls:"price",   match:"Japan 🇯🇵 vs Sweden 🇸🇪",                action:"Rose 8% since last check · Category 3 now from $1066",                           offsetMins:41  },

  // ── Viewers ──────────────────────────────────────────────────────────────────
  { icon:"👁",  cls:"viewers", match:"Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 vs Brazil 🇧🇷",           action:"56 people viewing · Only 2 tickets left",                                       offsetMins:4   },
  { icon:"👁",  cls:"viewers", match:"England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Ghana 🇬🇭",             action:"34 viewing right now · prices rising fast",                                    offsetMins:3   },
  { icon:"👁",  cls:"viewers", match:"Argentina 🇦🇷 vs Austria 🇦🇹",            action:"91 people on this listing · 4 left",                                             offsetMins:1   },
  { icon:"👁",  cls:"viewers", match:"DR Congo 🇨🇩 vs Uzbekistan 🇺🇿",            action:"47 watching · Last few in Sec 104",                                              offsetMins:11  },
  { icon:"👁",  cls:"viewers", match:"New Zealand 🇳🇿 vs Belgium 🇧🇪",           action:"78 viewing — 3 tickets left, moving fast",                                       offsetMins:5   },
  { icon:"👁",  cls:"viewers", match:"Czech Republic 🇨🇿 vs Mexico 🇲🇽",       action:"62 people on this right now · 1 Front Category seat left",                       offsetMins:2   },
  { icon:"👁",  cls:"viewers", match:"Colombia 🇨🇴 vs DR Congo 🇨🇩",            action:"29 watching · Sec 112 Row 6 · stock low",                                        offsetMins:13  },
  { icon:"👁",  cls:"viewers", match:"Portugal 🇵🇹 vs Uzbekistan 🇺🇿",          action:"41 viewing · Category 2 almost gone",                                            offsetMins:8   },
  { icon:"👁",  cls:"viewers", match:"Ecuador 🇪🇨 vs Germany 🇩🇪",              action:"18 people browsing this match right now",                                        offsetMins:25  },
  { icon:"👁",  cls:"viewers", match:"Cape Verde 🇨🇻 vs Saudi Arabia 🇸🇦",               action:"53 viewers · Sec 318 Row 22 · 5 left",                                           offsetMins:17  },
  { icon:"👁",  cls:"viewers", match:"Uruguay 🇺🇾 vs Spain 🇪🇸",               action:"22 watching · Front Category almost gone",                                       offsetMins:39  },
  { icon:"👁",  cls:"viewers", match:"Tunisia 🇹🇳 vs Netherlands 🇳🇱",                action:"35 people on this listing · 2 pairs left",                                       offsetMins:28  },
  { icon:"👁",  cls:"viewers", match:"Jordan 🇯🇴 vs Argentina 🇦🇷",             action:"16 viewing · only 1 seat remaining",                                             offsetMins:64  },
  { icon:"👁",  cls:"viewers", match:"Tunisia 🇹🇳 vs Netherlands 🇳🇱",          action:"44 people checking this out rn",                                                 offsetMins:9   },
  { icon:"👁",  cls:"viewers", match:"France 🇫🇷 vs Iraq 🇮🇶",                  action:"27 watching · Sec 340 · 3 tickets left",                                         offsetMins:46  },

  // ── New listings ─────────────────────────────────────────────────────────────
  { icon:"➕", cls:"listing",  match:"Bosnia & Herzegovina 🇧🇦 vs Qatar 🇶🇦",   action:"New VIP Box listing · Sec VIP Row 1 · $520",                                     offsetMins:1   },
  { icon:"➕", cls:"listing",  match:"Panama 🇵🇦 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿",             action:"New pair listed · Category 1 Sec 127 Row 9 · $969 each",                       offsetMins:6   },
  { icon:"➕", cls:"listing",  match:"Paraguay 🇵🇾 vs Australia 🇦🇺",              action:"Fresh listing · Sec 204 Row 12 · $933 · 2 available",                            offsetMins:14  },
  { icon:"➕", cls:"listing",  match:"Bosnia & Herzegovina 🇧🇦 vs Qatar 🇶🇦",               action:"New Category 1 listing · Sec 144 · $618 · 1 ticket",                             offsetMins:22  },
  { icon:"➕", cls:"listing",  match:"Egypt 🇪🇬 vs Iran 🇮🇷",             action:"3 new Category 3 seats added · Sec 221 Row 12 · $831 each",                      offsetMins:35  },
  { icon:"➕", cls:"listing",  match:"South Africa 🇿🇦 vs South Korea 🇰🇷",     action:"2x Category 2 just listed · Sec 104 · $500 each",                                offsetMins:51  },
  { icon:"➕", cls:"listing",  match:"Egypt 🇪🇬 vs Iran 🇮🇷",                  action:"New listing · Sec 416 Row 31 · 2 seats · $500 each",                             offsetMins:27  },
  { icon:"➕", cls:"listing",  match:"Algeria 🇩🇿 vs Austria 🇦🇹",                action:"4 Category 2 added · Sec 117 · $987 each · just posted",                         offsetMins:18  },
  { icon:"➕", cls:"listing",  match:"Curaçao 🇨🇼 vs Ivory Coast 🇨🇮",            action:"New pair listed in Sec 112 Row 4 · $1044 each",                                  offsetMins:42  },
  { icon:"➕", cls:"listing",  match:"South Africa 🇿🇦 vs South Korea 🇰🇷",       action:"Category 2 listing added · Sec 117 · $2159/ea · 3 available",                    offsetMins:63  },
  { icon:"➕", cls:"listing",  match:"Curaçao 🇨🇼 vs Ivory Coast 🇨🇮",         action:"6 General seats listed · Sec 448 Row 32 · $500 each",                            offsetMins:108 },
  { icon:"➕", cls:"listing",  match:"Algeria 🇩🇿 vs Austria 🇦🇹",             action:"Fresh Category 3 listing · Sec 340 Row 25 · $500 · 3 tix",                      offsetMins:31  },

  // ── Updates ───────────────────────────────────────────────────────────────
  { icon:"🔔", cls:"listing",  match:"Croatia 🇭🇷 vs Ghana 🇬🇭",               action:"Price updated — no change in stock · Sec 215 · $500",                            offsetMins:77  },
  { icon:"🔔", cls:"listing",  match:"Cape Verde 🇨🇻 vs Saudi Arabia 🇸🇦",      action:"Listing refreshed · no new activity",                                            offsetMins:122 },
  { icon:"🔔", cls:"listing",  match:"South Africa 🇿🇦 vs South Korea 🇰🇷",     action:"No activity in last 15 minutes on this listing",                                 offsetMins:156 },
  { icon:"🔔", cls:"listing",  match:"Curaçao 🇨🇼 vs Ivory Coast 🇨🇮",         action:"Seller updated availability note · Sec 318 still listed",                        offsetMins:88  },
  { icon:"🔔", cls:"listing",  match:"Senegal 🇸🇳 vs Iraq 🇮🇶",                action:"Listing info corrected — Sec 117, was Row 6 now Row 15",                         offsetMins:44  },
  { icon:"🔔", cls:"listing",  match:"Morocco 🇲🇦 vs Haiti 🇭🇹",              action:"Seller updated notes · tickets still available",                                  offsetMins:33  },
  { icon:"🔔", cls:"listing",  match:"Paraguay 🇵🇾 vs Australia 🇦🇺",           action:"Match details verified · listing unchanged",                                     offsetMins:101 },
  { icon:"🔔", cls:"listing",  match:"Morocco 🇲🇦 vs Haiti 🇭🇹",               action:"No bids in the past hour · listing active",                                      offsetMins:69  },
];

export const RECENT_PURCHASES = [
  // USA / North America
  { initials:"JW", bg:"linear-gradient(135deg,#1B3C88,#4A62BC)", name:"Jake Williams",       city:"Houston, TX",        match:"England vs Ghana",             cat:"Category 3 · Sec 231",    offsetMins:3   },
  { initials:"AT", bg:"linear-gradient(135deg,#7C3AED,#A78BFA)", name:"Ashley Torres",       city:"Miami, FL",          match:"2x Scotland vs Brazil",        cat:"Category 1 · Sec 104",    offsetMins:7   },
  { initials:"DM", bg:"linear-gradient(135deg,#059669,#10B981)", name:"Devon Mitchell",      city:"Los Angeles, CA",    match:"Norway vs Senegal",            cat:"Category 1 · Sec 144",    offsetMins:11  },
  { initials:"SS", bg:"linear-gradient(135deg,#DC2626,#F87171)", name:"Stephanie Sanchez",   city:"Dallas, TX",         match:"3x Argentina vs Austria",      cat:"Category 2 · Sec 117",    offsetMins:19  },
  { initials:"RJ", bg:"linear-gradient(135deg,#D97706,#FCD34D)", name:"Ryan Johnson",        city:"Chicago, IL",        match:"Jordan vs Argentina",          cat:"Category 3 · Sec 205",    offsetMins:23  },
  { initials:"LG", bg:"linear-gradient(135deg,#0EA5E9,#7DD3FC)", name:"Lauren Garcia",       city:"New York, NY",       match:"Colombia vs Portugal",         cat:"VIP Box · Sec VIP",       offsetMins:31  },
  { initials:"MH", bg:"linear-gradient(135deg,#BE185D,#F472B6)", name:"Marcus Harris",       city:"Atlanta, GA",        match:"2x Czech Republic vs Mexico",  cat:"Category 2 · Sec 117",    offsetMins:38  },
  { initials:"CN", bg:"linear-gradient(135deg,#475569,#94A3B8)", name:"Chloe Nguyen",        city:"Seattle, WA",        match:"Colombia vs Portugal",         cat:"Sec 112 Row 6",           offsetMins:47  },
  { initials:"BL", bg:"linear-gradient(135deg,#1B3C88,#818CF8)", name:"Brandon Lee",         city:"Phoenix, AZ",        match:"4x Ecuador vs Germany",        cat:"General · Sec 318",       offsetMins:52  },
  { initials:"AM", bg:"linear-gradient(135deg,#059669,#34D399)", name:"Amanda Martinez",     city:"San Antonio, TX",    match:"Norway vs France",             cat:"Sec 204 Row 12",          offsetMins:60  },
  // Mexico
  { initials:"JH", bg:"linear-gradient(135deg,#DC2626,#FCA5A5)", name:"Jorge Hernández",     city:"Mexico City",        match:"2x Czech Republic vs Mexico",  cat:"Category 2 · Sec 117",    offsetMins:58  },
  { initials:"LR", bg:"linear-gradient(135deg,#7C3AED,#C4B5FD)", name:"Lucía Ramírez",       city:"Guadalajara",        match:"Portugal vs Uzbekistan",       cat:"Sec 117 Row 12",          offsetMins:64  },
  { initials:"CM", bg:"linear-gradient(135deg,#1B3C88,#4A62BC)", name:"Carlos Mendoza",      city:"Monterrey",          match:"3x Czech Republic vs Mexico",  cat:"Category 1 · Sec 144",    offsetMins:72  },
  { initials:"VG", bg:"linear-gradient(135deg,#059669,#6EE7B7)", name:"Valentina González",  city:"Puebla",             match:"Morocco vs Haiti",             cat:"General · Sec 318",       offsetMins:83  },
  { initials:"AG", bg:"linear-gradient(135deg,#D97706,#FCD34D)", name:"Alejandro García",    city:"Tijuana",            match:"2x Uruguay vs Spain",          cat:"Category 3 · Sec 215",    offsetMins:91  },
  // Spain
  { initials:"PM", bg:"linear-gradient(135deg,#BE123C,#FDA4AF)", name:"Pablo Martínez",      city:"Madrid",             match:"Uruguay vs Spain",             cat:"Category 2 · Sec 117",    offsetMins:43  },
  { initials:"IS", bg:"linear-gradient(135deg,#0F766E,#2DD4BF)", name:"Isabel Sánchez",      city:"Barcelona",          match:"2x Norway vs France",          cat:"Sec 319 Row 22",          offsetMins:77  },
  { initials:"JL", bg:"linear-gradient(135deg,#7C3AED,#A78BFA)", name:"Javier López",        city:"Valencia",           match:"Colombia vs Portugal",         cat:"Sec 112 Row 6",           offsetMins:99  },
  { initials:"AP", bg:"linear-gradient(135deg,#1D4ED8,#60A5FA)", name:"Ana Pérez",           city:"Seville",            match:"3x Czech Republic vs Mexico",  cat:"Category 2 · Sec 117",    offsetMins:123 },
  { initials:"DR", bg:"linear-gradient(135deg,#DC2626,#F87171)", name:"Diego Ruiz",          city:"Bilbao",             match:"Uruguay vs Spain",             cat:"Sec 117 · 2 tickets",     offsetMins:139 },
  // France
  { initials:"TM", bg:"linear-gradient(135deg,#059669,#10B981)", name:"Thomas Martin",       city:"Paris",              match:"4x Norway vs France",          cat:"Category 1 · Sec 104",    offsetMins:29  },
  { initials:"CB", bg:"linear-gradient(135deg,#0EA5E9,#7DD3FC)", name:"Camille Bernard",     city:"Lyon",               match:"2x Norway vs Senegal",         cat:"Category 3 · Sec 231",    offsetMins:68  },
  { initials:"JD", bg:"linear-gradient(135deg,#BE185D,#F472B6)", name:"Jean-Pierre Dubois",  city:"Marseille",          match:"France vs Iraq",               cat:"VIP Box · Sec VIP",       offsetMins:104 },
  { initials:"LS", bg:"linear-gradient(135deg,#475569,#94A3B8)", name:"Louise Simon",        city:"Toulouse",           match:"2x Norway vs France",          cat:"Sec 104 Row 8",           offsetMins:131 },
  { initials:"PR", bg:"linear-gradient(135deg,#1B3C88,#818CF8)", name:"Pierre Rousseau",     city:"Nice",               match:"France vs Iraq",               cat:"Category 2 · Sec 117",    offsetMins:167 },
  // Canada
  { initials:"ET", bg:"linear-gradient(135deg,#D97706,#FCD34D)", name:"Emma Thompson",       city:"Toronto",            match:"2x Switzerland vs Canada",     cat:"Sec 416 Row 31",          offsetMins:16  },
  { initials:"NP", bg:"linear-gradient(135deg,#059669,#6EE7B7)", name:"Noah Patel",          city:"Vancouver",          match:"Switzerland vs Canada",        cat:"Category 2 · Sec 117",    offsetMins:62  },
  { initials:"OL", bg:"linear-gradient(135deg,#DC2626,#FCA5A5)", name:"Olivia Leblanc",      city:"Montreal",           match:"Norway vs Senegal",            cat:"Sec 144 Row 9",           offsetMins:89  },
  { initials:"LC", bg:"linear-gradient(135deg,#7C3AED,#C4B5FD)", name:"Liam Chen",           city:"Calgary",            match:"2x Switzerland vs Canada",     cat:"Sec 220 · 2 tickets",     offsetMins:117 },
  { initials:"AF", bg:"linear-gradient(135deg,#1B3C88,#4A62BC)", name:"Ava Fournier",        city:"Ottawa",             match:"Norway vs France",             cat:"Category 3 · Sec 231",    offsetMins:153 },
  // Brazil
  { initials:"MF", bg:"linear-gradient(135deg,#059669,#34D399)", name:"Maria Fernanda",      city:"São Paulo",          match:"4x Scotland vs Brazil",        cat:"Premium · Sec 104",       offsetMins:14  },
  { initials:"GS", bg:"linear-gradient(135deg,#1D4ED8,#60A5FA)", name:"Gabriel Santos",      city:"Rio de Janeiro",     match:"2x Jordan vs Argentina",       cat:"Category 1 · Sec 144",    offsetMins:66  },
  { initials:"BS", bg:"linear-gradient(135deg,#BE123C,#FDA4AF)", name:"Beatriz Souza",       city:"Belo Horizonte",     match:"Scotland vs Brazil",           cat:"Category 1 · Sec 104",    offsetMins:95  },
  { initials:"PO", bg:"linear-gradient(135deg,#D97706,#FCD34D)", name:"Pedro Oliveira",      city:"Brasília",           match:"3x Scotland vs Brazil",        cat:"Sec 104 Row 8",           offsetMins:128 },
  { initials:"AL", bg:"linear-gradient(135deg,#0EA5E9,#7DD3FC)", name:"Ana Lima",            city:"Salvador",           match:"Scotland vs Brazil",           cat:"Category 2 · Sec 117",    offsetMins:171 },
  // UK
  { initials:"OH", bg:"linear-gradient(135deg,#7C3AED,#A78BFA)", name:"Oliver Hughes",       city:"London",             match:"England vs Ghana",             cat:"Category 2 · Sec 319",    offsetMins:21  },
  { initials:"ES", bg:"linear-gradient(135deg,#059669,#10B981)", name:"Emma Sutton",         city:"Manchester",         match:"2x Panama vs England",         cat:"Category 3 · Sec 231",    offsetMins:54  },
  { initials:"JB", bg:"linear-gradient(135deg,#DC2626,#F87171)", name:"James Blackwell",     city:"Birmingham",         match:"Panama vs England",            cat:"VIP Box · Sec VIP",       offsetMins:78  },
  { initials:"SH", bg:"linear-gradient(135deg,#D97706,#FCD34D)", name:"Sophie Harrison",     city:"Leeds",              match:"2x England vs Ghana",          cat:"Sec 112 Row 4",           offsetMins:112 },
  { initials:"WT", bg:"linear-gradient(135deg,#1B3C88,#4A62BC)", name:"William Taylor",      city:"Liverpool",          match:"Panama vs England",            cat:"Category 1 · Sec 144",    offsetMins:148 },
];

// ─── Testimonials ──────────────────────────────────
export const TESTIMONIALS = [
  {
    stars: 5,
    quote: "Bought two lower bowl seats for Brazil vs Morocco two weeks before the match. The whole process — finding the listing, contacting the seller, receiving the tickets — took less than an hour. Tickets scanned perfectly on matchday.",
    initials: "JM", bg: "linear-gradient(135deg,#1B3C88,#4A62BC)",
    name: "James Mackenzie", location: "Edinburgh, UK",
    match: "Brazil vs Morocco", seat: "Category 2 · Sec 117",
    date: "Verified purchase · Jun 2026",
    verifiedPurchase: true,
    purchasedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
  {
    stars: 5,
    quote: "I was sceptical about buying resale tickets — had a bad experience elsewhere. But the manual verification here is a game changer. The team checked every detail and I had confirmed valid tickets in hand. Will use for every tournament going forward.",
    initials: "SR", bg: "linear-gradient(135deg,#059669,#34D399)",
    name: "Sofia Rodriguez", location: "Buenos Aires, Argentina",
    match: "Argentina vs Algeria", seat: "Category 1 · Sec 144",
    date: "Verified purchase · Jun 2026",
    verifiedPurchase: true,
    purchasedAt: new Date(Date.now() - 1000 * 60 * 60 * 31).toISOString(),
  },
  {
    stars: 5,
    quote: "The seller responded within minutes and guided me through the transfer process step by step. Seats were exactly as described. If you're nervous about buying tickets online, this platform removes every reason to worry.",
    initials: "TC", bg: "linear-gradient(135deg,#DC2626,#F87171)",
    name: "Thomas Chen", location: "Vancouver, Canada",
    match: "England vs Croatia", seat: "Category 3 · Sec 231",
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
