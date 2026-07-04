/**
 * wc26Schedule.js — Complete FIFA World Cup 2026 fixture list
 *
 * Source: WorldCup.json dataset — all 104 matches
 * Coverage: 72 group stage + 16 Round of 32 + 8 R16
 *           + 4 QF + 2 SF + 2 (3rd place + Final)
 *
 * Knockout rounds list teams as placeholders until groups are decided.
 * All times are UTC (converted from local kick-off times for accurate countdowns).
 *
 * Host cities: 11 USA + 3 Mexico + 2 Canada = 16 total
 */

export const WC26_VENUES = {
  // ── USA ────────────────────────────────────────────────────────────────────
  "SoFi Stadium":           { city: "Los Angeles / Inglewood",          country: "USA", capacity: 70240 },
  "MetLife Stadium":        { city: "New York / New Jersey",            country: "USA", capacity: 82500 },
  "AT&T Stadium":           { city: "Dallas / Arlington",               country: "USA", capacity: 80000 },
  "Hard Rock Stadium":      { city: "Miami / Miami Gardens",            country: "USA", capacity: 65326 },
  "Mercedes-Benz Stadium":  { city: "Atlanta",                          country: "USA", capacity: 71000 },
  "Lumen Field":            { city: "Seattle",                          country: "USA", capacity: 68740 },
  "Arrowhead Stadium":      { city: "Kansas City",                      country: "USA", capacity: 76416 },
  "Lincoln Financial Field":{ city: "Philadelphia",                     country: "USA", capacity: 69176 },
  "NRG Stadium":            { city: "Houston",                          country: "USA", capacity: 72220 },
  "Gillette Stadium":       { city: "Boston / Foxborough",              country: "USA", capacity: 65878 },
  "Levi's Stadium":         { city: "San Francisco Bay Area / Santa Clara", country: "USA", capacity: 68500 },
  // ── Mexico ─────────────────────────────────────────────────────────────────
  "Estadio Azteca":         { city: "Mexico City",                      country: "Mexico", capacity: 87523 },
  "Estadio Akron":          { city: "Guadalajara / Zapopan",            country: "Mexico", capacity: 49850 },
  "Estadio BBVA":           { city: "Monterrey / Guadalupe",            country: "Mexico", capacity: 53500 },
  // ── Canada ─────────────────────────────────────────────────────────────────
  "BMO Field":              { city: "Toronto",                          country: "Canada", capacity: 30000 },
  "BC Place":               { city: "Vancouver",                        country: "Canada", capacity: 54500 },
};

// ── Team flags ────────────────────────────────────────────────────────────────
export const WC26_FLAGS = {
  "Algeria": "🇩🇿",
  "Argentina": "🇦🇷",
  "Australia": "🇦🇺",
  "Austria": "🇦🇹",
  "Belgium": "🇧🇪",
  "Bosnia & Herzegovina": "🇧🇦",
  "Brazil": "🇧🇷",
  "Canada": "🇨🇦",
  "Cape Verde": "🇨🇻",
  "Colombia": "🇨🇴",
  "Croatia": "🇭🇷",
  "Curaçao": "🇨🇼",
  "Czech Republic": "🇨🇿",
  "DR Congo": "🇨🇩",
  "Ecuador": "🇪🇨",
  "Egypt": "🇪🇬",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "France": "🇫🇷",
  "Germany": "🇩🇪",
  "Ghana": "🇬🇭",
  "Haiti": "🇭🇹",
  "Iran": "🇮🇷",
  "Iraq": "🇮🇶",
  "Ivory Coast": "🇨🇮",
  "Japan": "🇯🇵",
  "Jordan": "🇯🇴",
  "Mexico": "🇲🇽",
  "Morocco": "🇲🇦",
  "Netherlands": "🇳🇱",
  "New Zealand": "🇳🇿",
  "Norway": "🇳🇴",
  "Panama": "🇵🇦",
  "Paraguay": "🇵🇾",
  "Portugal": "🇵🇹",
  "Saudi Arabia": "🇸🇦",
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Senegal": "🇸🇳",
  "South Africa": "🇿🇦",
  "South Korea": "🇰🇷",
  "Spain": "🇪🇸",
  "Sweden": "🇸🇪",
  "Switzerland": "🇨🇭",
  "Qatar": "🇶🇦",
  "Tunisia": "🇹🇳",
  "Turkey": "🇹🇷",
  "USA": "🇺🇸",
  "Uruguay": "🇺🇾",
  "Uzbekistan": "🇺🇿",
};

// ── Complete Group Stage fixtures (72 matches) ─────────────────────────────
// Date format: YYYY-MM-DD | Times: local kick-off
export const WC26_GROUP_STAGE = [

  // ── GROUP A ────────────────────────────────────────────────────────────────
  { id:"gs01",  date:"2026-06-11", time:"19:00", home:"Mexico",      away:"South Africa",         venue:"Estadio Azteca",           group:"A" },
  // LOW VIEWERSHIP — uncomment to restore:
  { id:"gs02",  date:"2026-06-11", time:"02:00", home:"South Korea",      away:"Czech Republic",         venue:"Estadio Akron",           group:"A" },
  { id:"gs03",  date:"2026-06-18", time:"16:00", home:"Czech Republic",      away:"South Africa",         venue:"Mercedes-Benz Stadium",           group:"A" },
  { id:"gs04",  date:"2026-06-18", time:"01:00", home:"Mexico",      away:"South Korea",         venue:"Estadio Akron",           group:"A" },
  // LOW VIEWERSHIP — uncomment to restore:
  { id:"gs05",  date:"2026-06-24", time:"01:00", home:"Czech Republic",      away:"Mexico",         venue:"Estadio Azteca",           group:"A" },
  { id:"gs06",  date:"2026-06-24", time:"01:00", home:"South Africa",      away:"South Korea",         venue:"Estadio BBVA",           group:"A" },

  // ── GROUP B ────────────────────────────────────────────────────────────────
  { id:"gs07",  date:"2026-06-12", time:"19:00", home:"Canada",      away:"Bosnia & Herzegovina",         venue:"BMO Field",           group:"B" },
  // LOW VIEWERSHIP — uncomment to restore:
  { id:"gs08",  date:"2026-06-13", time:"19:00", home:"Qatar",      away:"Switzerland",         venue:"Levi's Stadium",           group:"B" },
  { id:"gs09",  date:"2026-06-18", time:"19:00", home:"Switzerland",      away:"Bosnia & Herzegovina",         venue:"SoFi Stadium",           group:"B" },
  { id:"gs10",  date:"2026-06-18", time:"22:00", home:"Canada",      away:"Qatar",         venue:"BC Place",           group:"B" },
  { id:"gs11",  date:"2026-06-24", time:"19:00", home:"Switzerland",      away:"Canada",         venue:"BC Place",           group:"B" },
  // LOW VIEWERSHIP — uncomment to restore:
  { id:"gs12",  date:"2026-06-24", time:"19:00", home:"Bosnia & Herzegovina",      away:"Qatar",         venue:"Lumen Field",           group:"B" },

  // ── GROUP C ────────────────────────────────────────────────────────────────
  { id:"gs13",  date:"2026-06-13", time:"22:00", home:"Brazil",      away:"Morocco",         venue:"MetLife Stadium",           group:"C" },
  // LOW VIEWERSHIP — uncomment to restore:
  { id:"gs14",  date:"2026-06-13", time:"01:00", home:"Haiti",      away:"Scotland",         venue:"Gillette Stadium",           group:"C" },
  { id:"gs15",  date:"2026-06-19", time:"22:00", home:"Scotland",      away:"Morocco",         venue:"Gillette Stadium",           group:"C" },
  { id:"gs16",  date:"2026-06-19", time:"00:30", home:"Brazil",      away:"Haiti",         venue:"Lincoln Financial Field",           group:"C" },
  { id:"gs17",  date:"2026-06-24", time:"22:00", home:"Scotland",      away:"Brazil",         venue:"Hard Rock Stadium",           group:"C" },
  { id:"gs18",  date:"2026-06-24", time:"22:00", home:"Morocco",      away:"Haiti",         venue:"Mercedes-Benz Stadium",           group:"C" },

  // ── GROUP D ────────────────────────────────────────────────────────────────
  { id:"gs19",  date:"2026-06-12", time:"01:00", home:"USA",      away:"Paraguay",         venue:"SoFi Stadium",           group:"D" },
  // LOW VIEWERSHIP — uncomment to restore:
  { id:"gs20",  date:"2026-06-13", time:"04:00", home:"Australia",      away:"Turkey",         venue:"BC Place",           group:"D" },
  { id:"gs21",  date:"2026-06-19", time:"19:00", home:"USA",      away:"Australia",         venue:"Lumen Field",           group:"D" },
  // LOW VIEWERSHIP — uncomment to restore:
  { id:"gs22",  date:"2026-06-19", time:"03:00", home:"Turkey",      away:"Paraguay",         venue:"Levi's Stadium",           group:"D" },
  { id:"gs23",  date:"2026-06-25", time:"02:00", home:"Turkey",      away:"USA",         venue:"SoFi Stadium",           group:"D" },
  // LOW VIEWERSHIP — uncomment to restore:
  { id:"gs24",  date:"2026-06-25", time:"02:00", home:"Paraguay",      away:"Australia",         venue:"Levi's Stadium",           group:"D" },

  // ── GROUP E ────────────────────────────────────────────────────────────────
  // LOW VIEWERSHIP — uncomment to restore:
  { id:"gs25",  date:"2026-06-14", time:"17:00", home:"Germany",      away:"Curaçao",         venue:"NRG Stadium",           group:"E" },
  { id:"gs26",  date:"2026-06-14", time:"23:00", home:"Ivory Coast",      away:"Ecuador",         venue:"Lincoln Financial Field",           group:"E" },
  { id:"gs27",  date:"2026-06-20", time:"20:00", home:"Germany",      away:"Ivory Coast",         venue:"BMO Field",           group:"E" },
  { id:"gs27b", date:"2026-06-20", time:"20:00", home:"Germany",      away:"Ivory Coast",         venue:"BMO Field",           group:"E" },
  // LOW VIEWERSHIP — uncomment to restore:
  { id:"gs28",  date:"2026-06-20", time:"00:00", home:"Ecuador",      away:"Curaçao",         venue:"Arrowhead Stadium",           group:"E" },
  { id:"gs29",  date:"2026-06-25", time:"20:00", home:"Curaçao",      away:"Ivory Coast",         venue:"Lincoln Financial Field",           group:"E" },
  { id:"gs30",  date:"2026-06-25", time:"20:00", home:"Ecuador",      away:"Germany",         venue:"MetLife Stadium",           group:"E" },

  // ── GROUP F ────────────────────────────────────────────────────────────────
  { id:"gs31",  date:"2026-06-14", time:"20:00", home:"Netherlands",      away:"Japan",         venue:"AT&T Stadium",           group:"F" },
  { id:"gs32",  date:"2026-06-14", time:"02:00", home:"Sweden",      away:"Tunisia",         venue:"Estadio BBVA",           group:"F" },
  { id:"gs33",  date:"2026-06-20", time:"17:00", home:"Netherlands",      away:"Sweden",         venue:"NRG Stadium",           group:"F" },
  { id:"gs33b", date:"2026-06-20", time:"17:00", home:"Netherlands",      away:"Sweden",         venue:"NRG Stadium",           group:"F" },
  { id:"gs34",  date:"2026-06-20", time:"04:00", home:"Tunisia",      away:"Japan",         venue:"Estadio BBVA",           group:"F" },
  { id:"gs35",  date:"2026-06-25", time:"23:00", home:"Japan",      away:"Sweden",         venue:"AT&T Stadium",           group:"F" },
  { id:"gs36",  date:"2026-06-25", time:"23:00", home:"Tunisia",      away:"Netherlands",         venue:"Arrowhead Stadium",           group:"F" },

  // ── GROUP G ────────────────────────────────────────────────────────────────
  { id:"gs37",  date:"2026-06-15", time:"19:00", home:"Belgium",      away:"Egypt",         venue:"Lumen Field",           group:"G" },
  // LOW VIEWERSHIP — uncomment to restore:
  { id:"gs38",  date:"2026-06-15", time:"01:00", home:"Iran",      away:"New Zealand",         venue:"SoFi Stadium",           group:"G" },
  { id:"gs39",  date:"2026-06-21", time:"19:00", home:"Belgium",      away:"Iran",         venue:"SoFi Stadium",           group:"G" },
  // LOW VIEWERSHIP — uncomment to restore:
  { id:"gs40",  date:"2026-06-21", time:"01:00", home:"New Zealand",      away:"Egypt",         venue:"BC Place",           group:"G" },
  // LOW VIEWERSHIP — uncomment to restore:
  { id:"gs41",  date:"2026-06-26", time:"03:00", home:"Egypt",      away:"Iran",         venue:"Lumen Field",           group:"G" },
  { id:"gs42",  date:"2026-06-26", time:"03:00", home:"New Zealand",      away:"Belgium",         venue:"BC Place",           group:"G" },

  // ── GROUP H ────────────────────────────────────────────────────────────────
  { id:"gs43",  date:"2026-06-15", time:"16:00", home:"Spain",      away:"Cape Verde",         venue:"Mercedes-Benz Stadium",           group:"H" },
  { id:"gs44",  date:"2026-06-15", time:"22:00", home:"Saudi Arabia",      away:"Uruguay",         venue:"Hard Rock Stadium",           group:"H" },
  { id:"gs45",  date:"2026-06-21", time:"16:00", home:"Spain",      away:"Saudi Arabia",         venue:"Mercedes-Benz Stadium",           group:"H" },
  { id:"gs46",  date:"2026-06-21", time:"22:00", home:"Uruguay",      away:"Cape Verde",         venue:"Hard Rock Stadium",           group:"H" },
  { id:"gs47",  date:"2026-06-26", time:"00:00", home:"Cape Verde",      away:"Saudi Arabia",         venue:"NRG Stadium",           group:"H" },
  { id:"gs48",  date:"2026-06-26", time:"00:00", home:"Uruguay",      away:"Spain",         venue:"Estadio Akron",           group:"H" },

  // ── GROUP I ────────────────────────────────────────────────────────────────
  { id:"gs49",  date:"2026-06-16", time:"19:00", home:"France",      away:"Senegal",         venue:"MetLife Stadium",           group:"I" },
  { id:"gs50",  date:"2026-06-16", time:"22:00", home:"Iraq",      away:"Norway",         venue:"Gillette Stadium",           group:"I" },
  { id:"gs51",  date:"2026-06-22", time:"21:00", home:"France",      away:"Iraq",         venue:"Lincoln Financial Field",           group:"I" },
  { id:"gs52",  date:"2026-06-22", time:"00:00", home:"Norway",      away:"Senegal",         venue:"MetLife Stadium",           group:"I" },
  { id:"gs53",  date:"2026-06-26", time:"19:00", home:"Norway",      away:"France",         venue:"Gillette Stadium",           group:"I" },
  { id:"gs54",  date:"2026-06-26", time:"19:00", home:"Senegal",      away:"Iraq",         venue:"BMO Field",           group:"I" },

  // ── GROUP J ────────────────────────────────────────────────────────────────
  { id:"gs55",  date:"2026-06-16", time:"01:00", home:"Argentina",      away:"Algeria",         venue:"Arrowhead Stadium",           group:"J" },
  // LOW VIEWERSHIP — uncomment to restore:
  { id:"gs56",  date:"2026-06-16", time:"04:00", home:"Austria",      away:"Jordan",         venue:"Levi's Stadium",           group:"J" },
  { id:"gs57",  date:"2026-06-22", time:"17:00", home:"Argentina",      away:"Austria",         venue:"AT&T Stadium",           group:"J" },
  { id:"gs58",  date:"2026-06-22", time:"03:00", home:"Jordan",      away:"Algeria",         venue:"Levi's Stadium",           group:"J" },
  { id:"gs59",  date:"2026-06-27", time:"02:00", home:"Algeria",      away:"Austria",         venue:"Arrowhead Stadium",           group:"J" },
  { id:"gs60",  date:"2026-06-27", time:"02:00", home:"Jordan",      away:"Argentina",         venue:"AT&T Stadium",           group:"J" },

  // ── GROUP K ────────────────────────────────────────────────────────────────
  { id:"gs61",  date:"2026-06-17", time:"17:00", home:"Portugal",      away:"DR Congo",         venue:"NRG Stadium",           group:"K" },
  { id:"gs62",  date:"2026-06-17", time:"02:00", home:"Uzbekistan",      away:"Colombia",         venue:"Estadio Azteca",           group:"K" },
  { id:"gs63",  date:"2026-06-23", time:"17:00", home:"Portugal",      away:"Uzbekistan",         venue:"NRG Stadium",           group:"K" },
  { id:"gs64",  date:"2026-06-23", time:"02:00", home:"Colombia",      away:"DR Congo",         venue:"Estadio Akron",           group:"K" },
  { id:"gs65",  date:"2026-06-27", time:"23:30", home:"Colombia",      away:"Portugal",         venue:"Hard Rock Stadium",           group:"K" },
  { id:"gs66",  date:"2026-06-27", time:"23:30", home:"DR Congo",      away:"Uzbekistan",         venue:"Mercedes-Benz Stadium",           group:"K" },

  // ── GROUP L ────────────────────────────────────────────────────────────────
  { id:"gs67",  date:"2026-06-17", time:"20:00", home:"England",      away:"Croatia",         venue:"AT&T Stadium",           group:"L" },
  { id:"gs68",  date:"2026-06-17", time:"23:00", home:"Ghana",      away:"Panama",         venue:"BMO Field",           group:"L" },
  { id:"gs69",  date:"2026-06-23", time:"20:00", home:"England",      away:"Ghana",         venue:"Gillette Stadium",           group:"L" },
  { id:"gs70",  date:"2026-06-23", time:"23:00", home:"Panama",      away:"Croatia",         venue:"BMO Field",           group:"L" },
  { id:"gs71",  date:"2026-06-27", time:"21:00", home:"Panama",      away:"England",         venue:"MetLife Stadium",           group:"L" },
  { id:"gs72",  date:"2026-06-27", time:"21:00", home:"Croatia",      away:"Ghana",         venue:"Lincoln Financial Field",           group:"L" },
];

// ── Round of 32 (16 matches) ──────────────────────────────────────────────
export const WC26_R32 = [
  { id:"r32_01", date:"2026-06-28", time:"19:00", home:"Germany", away:"Uruguay", venue:"SoFi Stadium", round:"Round of 32" },
  { id:"r32_02", date:"2026-06-29", time:"20:30", home:"France", away:"Sweden", venue:"Gillette Stadium", round:"Round of 32" },
  { id:"r32_03", date:"2026-06-29", time:"01:00", home:"South Africa", away:"Canada", venue:"Estadio BBVA", round:"Round of 32" },
  { id:"r32_04", date:"2026-06-29", time:"17:00", home:"Netherlands", away:"Morocco", venue:"NRG Stadium", round:"Round of 32" },
  { id:"r32_05", date:"2026-07-02", time:"23:00", home:"Portugal", away:"Croatia", venue:"MetLife Stadium", round:"Round of 32" },
  { id:"r32_06", date:"2026-07-02", time:"19:00", home:"Spain", away:"Austria", venue:"AT&T Stadium", round:"Round of 32" },
  { id:"r32_07", date:"2026-06-30", time:"01:00", home:"USA", away:"Bosnia & Herzegovina", venue:"Estadio Azteca", round:"Round of 32" },
  { id:"r32_08", date:"2026-07-01", time:"16:00", home:"Belgium", away:"Senegal", venue:"Mercedes-Benz Stadium", round:"Round of 32" },
  { id:"r32_09", date:"2026-07-01", time:"00:00", home:"Brazil", away:"Japan", venue:"Levi's Stadium", round:"Round of 32" },
  { id:"r32_10", date:"2026-07-01", time:"20:00", home:"Ivory Coast", away:"Norway", venue:"Lumen Field", round:"Round of 32" },
  { id:"r32_11", date:"2026-07-01", time:"23:00", home:"Mexico", away:"Ecuador", venue:"BMO Field", round:"Round of 32" },
  { id:"r32_12", date:"2026-07-01", time:"19:00", home:"England", away:"DR Congo", venue:"SoFi Stadium", round:"Round of 32" },
  { id:"r32_13", date:"2026-07-03", time:"22:00", home:"Argentina", away:"Cape Verde", venue:"BC Place", round:"Round of 32" },
  { id:"r32_14", date:"2026-07-03", time:"18:00", home:"Australia", away:"Egypt", venue:"Hard Rock Stadium", round:"Round of 32" },
  { id:"r32_15", date:"2026-07-03", time:"01:30", home:"Switzerland", away:"Algeria", venue:"Arrowhead Stadium", round:"Round of 32" },
  { id:"r32_16", date:"2026-07-04", time:"01:30", home:"Colombia", away:"Ghana", venue:"AT&T Stadium", round:"Round of 32" },
];

// ── Round of 16 ────────────────────────────────────────────────────────────
export const WC26_R16 = [
  { id:"r16_01", date:"2026-07-04", time:"21:00", home:"Paraguay", away:"France", venue:"Lincoln Financial Field", round:"Round of 16" },
  { id:"r16_02", date:"2026-07-04", time:"17:00", home:"Canada", away:"Morocco", venue:"NRG Stadium", round:"Round of 16" },
  { id:"r16_03", date:"2026-07-05", time:"20:00", home:"Brazil", away:"Norway", venue:"MetLife Stadium", round:"Round of 16" },
  { id:"r16_04", date:"2026-07-07", time:"00:00", home:"USA", away:"Belgium", venue:"Estadio Azteca", round:"Round of 16" },
  { id:"r16_05", date:"2026-07-06", time:"19:00", home:"Mexico", away:"England", venue:"AT&T Stadium", round:"Round of 16" },
  { id:"r16_06", date:"2026-07-06", time:"00:00", home:"Winner R32-M79", away:"Winner R32-M80", venue:"Lumen Field", round:"Round of 16" },
  { id:"r16_07", date:"2026-07-07", time:"16:00", home:"Winner R32-M86", away:"Winner R32-M88", venue:"Mercedes-Benz Stadium", round:"Round of 16" },
  { id:"r16_08", date:"2026-07-07", time:"20:00", home:"Winner R32-M85", away:"Winner R32-M87", venue:"BC Place", round:"Round of 16" },
];

// ── Quarter-Finals ─────────────────────────────────────────────────────────
export const WC26_QF = [
  { id:"qf_01", date:"2026-07-09", time:"20:00", home:"W89", away:"W90", venue:"Gillette Stadium", round:"Quarter-Final" },
  { id:"qf_02", date:"2026-07-10", time:"19:00", home:"W93", away:"W94", venue:"SoFi Stadium", round:"Quarter-Final" },
  { id:"qf_03", date:"2026-07-11", time:"21:00", home:"W91", away:"W92", venue:"Hard Rock Stadium", round:"Quarter-Final" },
  { id:"qf_04", date:"2026-07-11", time:"01:00", home:"W95", away:"W96", venue:"Arrowhead Stadium", round:"Quarter-Final" },
];

// ── Semi-Finals ────────────────────────────────────────────────────────────
export const WC26_SF = [
  { id:"sf_01", date:"2026-07-14", time:"19:00", home:"W97", away:"W98", venue:"AT&T Stadium", round:"Semi-Final" },
  { id:"sf_02", date:"2026-07-15", time:"19:00", home:"W99", away:"W100", venue:"Mercedes-Benz Stadium", round:"Semi-Final" },
];

// ── Third-place play-off + Final ───────────────────────────────────────────
export const WC26_FINAL = [
    { id:"3rd", date:"2026-07-18", time:"21:00", home:"L101", away:"L102", venue:"Hard Rock Stadium", round:"3rd Place" },
    { id:"final", date:"2026-07-19", time:"19:00", home:"W101", away:"W102", venue:"MetLife Stadium", round:"Final" },
];

// ── High-demand matches (used for featured section) ────────────────────────
export const WC26_HIGH_DEMAND = new Set([
  "3rd",
  "final",
  "gs01",
  "sf_01",
  "sf_02",
  // Featured matches — added per product request
  "gs67",  // England vs Croatia     — Jun 17 (Group L, AT&T Stadium)
  "gs49",  // France vs Senegal      — Jun 16 (Group I, MetLife Stadium)
  "gs21",  // USA vs Australia       — Jun 19 (Group D, Lumen Field)
  "gs33",  // Netherlands vs Sweden  — Jun 20 (Group F, NRG Stadium)
  "gs13",  // Brazil vs Morocco      — Jun 13 (Group C, MetLife Stadium)
  "gs55",  // Argentina vs Algeria   — Jun 16 (Group J, Arrowhead Stadium)
  "gs45",  // Spain vs Saudi Arabia  — Jun 21 (Group H, Mercedes-Benz Stadium)

  // ── R32 high-demand ──
  "r32_02",
  "r32_05",
  "r32_06",
  "r32_07",
  "r32_09",
  "r32_11",
  "r32_12",
  "r32_13",

  // ── R16 high-demand ──
  "r16_01",
  "r16_03",
  "r16_04",
  "r16_05",
]);

// ── All fixtures merged ────────────────────────────────────────────────────
export const WC26_ALL_FIXTURES = [
  ...WC26_GROUP_STAGE,
  // ── Knockout rounds — uncomment each stage as the bracket resolves ──
  ...WC26_R32,
  ...WC26_R16,
  // ...WC26_QF,
  // ...WC26_SF,
  // ...WC26_FINAL,
];

export const WC26_ISO2 = {
  "Algeria": "dz",
  "Argentina": "ar",
  "Australia": "au",
  "Austria": "at",
  "Belgium": "be",
  "Bosnia & Herzegovina": "ba",
  "Brazil": "br",
  "Canada": "ca",
  "Cape Verde": "cv",
  "Colombia": "co",
  "Croatia": "hr",
  "Curaçao": "cw",
  "Czech Republic": "cz",
  "DR Congo": "cd",
  "Ecuador": "ec",
  "Egypt": "eg",
  "England": "gb-eng",
  "France": "fr",
  "Germany": "de",
  "Ghana": "gh",
  "Haiti": "ht",
  "Iran": "ir",
  "Iraq": "iq",
  "Ivory Coast": "ci",
  "Japan": "jp",
  "Jordan": "jo",
  "Mexico": "mx",
  "Morocco": "ma",
  "Netherlands": "nl",
  "New Zealand": "nz",
  "Norway": "no",
  "Panama": "pa",
  "Paraguay": "py",
  "Portugal": "pt",
  "Qatar": "qa",
  "Saudi Arabia": "sa",
  "Scotland": "gb-sct",
  "Senegal": "sn",
  "South Africa": "za",
  "South Korea": "kr",
  "Spain": "es",
  "Sweden": "se",
  "Switzerland": "ch",
  "TBD": null,
  "Tunisia": "tn",
  "Turkey": "tr",
  "USA": "us",
  "Uruguay": "uy",
  "Uzbekistan": "uz",
};
