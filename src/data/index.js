/**
 * data/index.js — Single import point for all listing data.
 *
 * ALL listings come from listingsData.js (admin-controlled).
 * No localStorage. No user-generated listings. No dynamic creation.
 *
 * To add/edit listings: edit listingsData.js directly.
 * To replace with an API later: swap this file only — UI stays unchanged.
 */
export {
  FLAG,
  STADIUM_CITY,
  SELLERS,
  SEAT_POOL,
  //HIGH_DEMAND,
  ALL_MATCHES,
  ALL_DATES,
  CITY_GROUPS,
  TEAM_OPTIONS,
  TRENDING_CITIES,
  ACTIVITIES,
  RECENT_PURCHASES,
  TESTIMONIALS,
  PAYMENT_METHODS,
  SORT_OPTIONS,
  timeAgo,
  teamName,
  teamFlag,
  teamFlagImg,
  labelTeam,
  splitTeam,
  isPlaceholderTeam,
} from "./listingsData.js";

export { WC26_ISO2 } from "./wc26Schedule.js";
export {WC26_HIGH_DEMAND as HIGH_DEMAND } from "./wc26Schedule.js"