/**
 * Marketplace — Unified ticket listing page
 *
 * Schedule system:
 *  - Consumes MatchScheduleContext (runs in App root, ticks every 60 s)
 *  - Filters expired matches (past UTC midnight of their match day)
 *  - Prioritises next-date group: shown first + highlighted
 *  - NextMatchBanner: live countdown to soonest upcoming date
 *  - Cards fade out smoothly when their match expires
 * Buyer features:
 *  - Wishlist (★ save matches)
 *  - Price alerts (🔔 notify when price drops)
 *  - Wishlist filter tab
 * Live data:
 *  - useLiveMatches() pulls from football-data.org when API key present
 *  - Falls back to static schedule silently
 */
import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import FilterBar from "../components/marketplace/FilterBar";
import MatchCard  from "../components/marketplace/MatchCard";
import NextMatchBanner from "../components/marketplace/NextMatchBanner";
import SellModal  from "../components/SellModal";
import { SignUpNudgeBanner } from "./Register";
import { Button } from "../components/ui";
import { C, sora, dm, SITE_TITLE, setPageMeta } from "../tokens";
import { ALL_MATCHES, teamName } from "../data";
import { useUrgency } from "../hooks/useUrgency";
import { useSchedule } from "../context/MatchScheduleContext";
import { useWishlist, usePriceAlerts } from "../hooks/useBuyerFeatures";
import { useUser } from "../context/UserContext";
import { useI18n } from "../context/I18nContext";
import { ShieldCheck, Search, X, LayoutGrid, AlignJustify, ChevronLeft, ChevronRight, Bell, Star } from "lucide-react";
import { shouldShowMatch } from "../utils/knockoutVisibility";

const PAGE_SIZE = 12;


export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gridView,  setGridView]  = useState(true);
  const [showSell,  setShowSell]  = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [filtersOpen, setFiltersOpen]   = useState(false);
  const [alertModal, setAlertModal] = useState(null); // match object | null
  const [alertInput, setAlertInput] = useState("");
  const { user } = useUser();
  const { t } = useI18n();

  useEffect(() => setPageMeta("Browse Tickets | " + SITE_TITLE, "Browse verified World Cup 2026 tickets by team, city, date and price. All listings admin-reviewed."), []);

  // ── Live schedule from context (ticks every 60 s, already fed from live API) ─
  const { liveMatches, nextIsoDate, expiredIds, startingSoonIds, dateGroups, usingLive, lastUpdated, loading } = useSchedule();

  // Buyer features — wishlist operates on the live matches from context
  const { savedIds, toggle: toggleSave, isSaved, savedMatches } = useWishlist(liveMatches);
  const { setAlert, getAlert, checkAlerts } = usePriceAlerts();

  const search = searchParams.get("search") || "";
  const cities = searchParams.getAll("city");
  const teams  = searchParams.getAll("team");
  const dates  = searchParams.getAll("date");
  const minP   = searchParams.get("minP") || "";
  const maxP   = searchParams.get("maxP") || "";
  const quick  = searchParams.get("quick") || null;
  const sortBy = searchParams.get("sort")  || "Soonest Date";
  const page   = parseInt(searchParams.get("page") || "1", 10);

  const setParam = (updates) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => {
        next.delete(k);
        if (Array.isArray(v))                               { v.forEach(val => next.append(k, val)); }
        else if (v !== null && v !== "" && v !== undefined) { next.set(k, v); }
      });
      if (!("page" in updates)) next.set("page", "1");
      return next;
    });
  };

  const setSearch = v  => setParam({ search: v });
  const setCities = fn => setParam({ city: typeof fn === "function" ? fn(cities) : fn });
  const setTeams  = fn => setParam({ team: typeof fn === "function" ? fn(teams)  : fn });
  const setDates  = fn => setParam({ date: typeof fn === "function" ? fn(dates)  : fn });
  const setMinP   = v  => setParam({ minP: v });
  const setMaxP   = v  => setParam({ maxP: v });
  const setQuick  = v  => setParam({ quick: v });
  const setSortBy = v  => setParam({ sort: v });
  const setPage   = v  => setParam({ page: String(v) });
  const clearAll  = () => setSearchParams(new URLSearchParams());

  // ── Filter + sort (operates on liveMatches — already past-filtered) ────────
  const result = useMemo(() => {
    let r = liveMatches.filter(m => {
      // Hide knockout matches in UI when SHOW_KNOCKOUTS is false.
      // Data/progression continues in the background regardless.
      if (!shouldShowMatch(m)) return false;

      const q = search.toLowerCase();
      if (q && ![m.homeRaw, m.awayRaw, m.venue, m.city].some(s => s?.toLowerCase().includes(q))) return false;
      if (cities.length && !cities.includes(m.city))  return false;
      if (teams.length) {
        const matched = teams.some(t => { const tn = teamName(t); return tn === m.homeRaw || tn === m.awayRaw; });
        if (!matched) return false;
      }
      if (dates.length && !dates.includes(m.date))   return false;
      if (minP !== "" && m.price < +minP)             return false;
      if (maxP !== "" && m.price > +maxP)             return false;
      if (quick === "Under $100"   && m.price >= 100) return false;
      if (quick === "This Weekend" && !m.weekend)     return false;
      if (quick === "Top Matches"  && m.rating < 4.8) return false;
      return true;
    });
    // liveMatches is already sorted soonest-first by the schedule hook.
    // Only re-sort if user picked an explicit sort order.
    if (sortBy === "Price: Low to High") return [...r].sort((a, b) => a.price  - b.price);
    if (sortBy === "Price: High to Low") return [...r].sort((a, b) => b.price  - a.price);
    if (sortBy === "Best Rating")        return [...r].sort((a, b) => b.rating - a.rating);
    return r; // "Soonest Date" — keep schedule order
  }, [liveMatches, search, cities, teams, dates, minP, maxP, quick, sortBy]);

  // Dates available in the live (non-expired) schedule for the date filter
  const liveDates = useMemo(
    () => [...new Set(liveMatches.map(m => m.date))],
    [liveMatches]
  );

  // Next-date group for banner + card highlighting
  const nextMatches = useMemo(
    () => nextIsoDate ? result.filter(m => m.isoDate === nextIsoDate) : [],
    [result, nextIsoDate]
  );
  const nextIds = useMemo(() => new Set(nextMatches.map(m => m.id)), [nextMatches]);

  // Matches currently being played — pinned to the very top of the page,
  // pulled out of every date group below so they never appear twice and
  // so nobody mistakes a live match for an upcoming/buyable one.
  //
  // `m.price == null` guards against a live API fixture that has no
  // matching static listing (e.g. a knockout match not yet added to
  // ALL_MATCHES) — such a match would render as "$undefined" with a
  // blank seller, so it's excluded from the hero section rather than
  // shown broken. It still appears in `result` for search/filtering.
  const liveNowMatches = useMemo(
    () => result.filter(m => m.isLive && m.price != null),
    [result]
  );

  const urgencies  = useUrgency(result);
  const urgencyMap = useMemo(() => {
    const map = {};
    result.forEach((m, i) => { map[m.id] = urgencies[i]; });
    return map;
  }, [result, urgencies]);

  // Ghost matches: just-expired cards kept in view during their 600ms exit animation.
  // They're no longer in liveMatches so we pull them from ALL_MATCHES.
  const ghostMatches = useMemo(() => {
    if (expiredIds.size === 0) return [];
    return ALL_MATCHES.filter(m => expiredIds.has(m.id));
  }, [expiredIds]);

  // Check price alerts whenever live matches update
  useEffect(() => { checkAlerts(liveMatches); }, [liveMatches, checkAlerts]);

  // Wishlist filter overrides normal result when active
  const displayResult = showWishlist ? savedMatches : result;

  // When no filters are active (and not viewing the wishlist), live matches
  // (with usable static data) are pulled into a pinned "Live Now" section
  // shown above every page's results and shouldn't also count toward
  // per-page totals — otherwise the page containing the live match would
  // render fewer grouped cards than others, even though
  // `displayResult.length` is the same across pages. Paginate over the set
  // that excludes only the matches actually shown in that hero section —
  // a live match with no static data (m.price == null, filtered out of
  // liveNowMatches) stays in the normal grid rather than disappearing.
  const noFiltersActive = !search && !cities.length && !teams.length && !dates.length && !quick;
  const liveNowIdSet = useMemo(() => new Set(liveNowMatches.map(m => m.id)), [liveNowMatches]);
  const pullsOutLiveNow = !showWishlist && noFiltersActive && liveNowMatches.length > 0;
  const paginatedResult = pullsOutLiveNow
    ? displayResult.filter(m => !liveNowIdSet.has(m.id))
    : displayResult;

  const totalPages = Math.max(1, Math.ceil(paginatedResult.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = paginatedResult.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Whether the "Live Now" hero section is shown. Matches shown there are
  // excluded from `paginatedResult` above (on every page), so the section
  // must also render on every page — otherwise a live match would be
  // invisible to anyone past page 1.
  const showLiveNowSection = pullsOutLiveNow;
  const liveNowIds = showLiveNowSection ? liveNowIdSet : new Set();

  const chips = [
    ...cities.map(c => ({ label: c, rm: () => setCities(p => p.filter(x => x !== c)) })),
    ...teams .map(t => ({ label: t, rm: () => setTeams (p => p.filter(x => x !== t)) })),
    ...dates .map(d => ({ label: d, rm: () => setDates (p => p.filter(x => x !== d)) })),
    ...((minP || maxP) ? [{ label: `$${minP || "0"}–$${maxP || "∞"}`, rm: () => { setMinP(""); setMaxP(""); } }] : []),
    ...(quick ? [{ label: quick, rm: () => setQuick(null) }] : []),
  ];

  return (
    <>
      <PageShell background={C.bg}>
        {/* Hero */}
        <section style={{
          background: `linear-gradient(135deg,${C.navy} 0%,${C.navyMid} 50%,${C.blue} 100%)`,
          padding: "clamp(32px,6vw,48px) 0 clamp(36px,7vw,56px)", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 15% 0%,rgba(232,48,42,0.12) 0%,transparent 55%),radial-gradient(ellipse at 85% 100%,rgba(37,84,184,0.25) 0%,transparent 55%)" }} />

          <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "6px 16px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 20, ...dm }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.live, flexShrink: 0, boxShadow: `0 0 0 3px ${C.liveGlow}`, animation: "wc26-pulse 1.8s ease-in-out infinite" }} />
              {t("mkt.badge", { n: liveMatches.length })}
            </div>

            <h1 style={{ ...sora, fontWeight: 800, fontSize: "clamp(28px,4.5vw,48px)", letterSpacing: "-0.03em", color: "#fff", marginBottom: 10 }}>
              {(() => {
                const full = t("mkt.title");
                const em   = t("mkt.title.em");
                const idx  = full.lastIndexOf(em);
                if (idx === -1) return full;
                return <>{full.slice(0, idx)}<span style={{ color: "#FCD34D" }}>{em}</span>{full.slice(idx + em.length)}</>;
              })()}
            </h1>
            <p style={{ fontSize: "clamp(13px,2vw,15px)", color: "rgba(255,255,255,0.7)", maxWidth: 480, lineHeight: 1.6, marginBottom: 28, ...dm }}>
              {t("mkt.body")}
            </p>

            {/* Search row — hidden on mobile where FilterBar search takes over */}
            <div style={{ display: "flex", gap: 8, maxWidth: 620, marginBottom: 20 }} className="wc26-hero-search-row">
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "11px 16px" }}>
                <Search size={16} color="rgba(255,255,255,0.55)" style={{ flexShrink: 0 }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder={t("mkt.search")}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, fontWeight: 500, color: "#fff", ...dm }}
                />
                {search && (
                  <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.55)", display: "flex" }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Trust pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                { icon: <ShieldCheck size={12} color="#4ADE80" />, label: t("mkt.pill1") },
                { icon: "🔍", label: t("mkt.pill2") },
                { icon: "🛡️", label: t("mkt.pill3") },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.1)", borderRadius: 999, padding: "6px 12px", ...dm }}>
                  {icon}{label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sticky filter bar */}
        <div style={{ position: "sticky", top: 64, zIndex: 30, background: C.bgCard, borderBottom: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(15,23,42,0.06)" }}>
          {/* Mobile toggle row */}
          <div className="wc26-filters-toggle-row" style={{ display: "none", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: filtersOpen ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text, ...dm }}>
              {t("mkt.filters")} {chips.length > 0 && `(${chips.length})`}
            </span>
            <button onClick={() => setFiltersOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${chips.length > 0 ? C.blue : C.border}`, background: chips.length > 0 ? C.infoBg : C.bg, fontSize: 12, fontWeight: 600, color: chips.length > 0 ? C.blue : C.textMid, cursor: "pointer", ...dm }}>
              {filtersOpen ? t("mkt.hideFilters") : t("mkt.showFilters")}
              <span style={{ transform: filtersOpen ? "rotate(180deg)" : "none", display: "inline-block", transition: "transform 0.2s", fontSize: 10 }}>▼</span>
            </button>
          </div>
          <div className={`wc26-filters-body${filtersOpen ? " wc26-filters-open" : ""}`} style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 20px" }}>
            <FilterBar
              search={search}   setSearch={setSearch}
              cities={cities}   setCities={setCities}
              teams={teams}     setTeams={setTeams}
              dates={dates}     setDates={setDates}
              minP={minP}       setMinP={setMinP}
              maxP={maxP}       setMaxP={setMaxP}
              quick={quick}     setQuick={setQuick}
              sortBy={sortBy}   setSortBy={setSortBy}
              chips={chips}     clearAll={clearAll}
              resultCount={displayResult.length}
              liveDates={liveDates}
            />

            {/* Wishlist tab — registered buyers only */}
            {user.registered && user.role === "buyer" && (
              <div style={{ display:"flex", gap:8, padding:"10px 0 0", borderTop:`1px solid ${C.border}`, marginTop:4 }}>
                <button onClick={() => { setShowWishlist(false); setPage(1); }} style={{ padding:"6px 14px", borderRadius:999, fontSize:12, fontWeight:700, background:!showWishlist?C.blue:C.bg, color:!showWishlist?"#fff":C.textMid, border:`1px solid ${!showWishlist?C.blue:C.border}`, cursor:"pointer", ...dm, transition:"all 0.15s" }}>{t("filter.allMatches")}</button>
                <button onClick={() => { setShowWishlist(true); setPage(1); }} style={{ padding:"6px 14px", borderRadius:999, fontSize:12, fontWeight:700, background:showWishlist?"#FFFBEB":C.bg, color:showWishlist?"#D97706":C.textMid, border:`1px solid ${showWishlist?"#F59E0B":C.border}`, cursor:"pointer", display:"flex", alignItems:"center", gap:5, ...dm, transition:"all 0.15s" }}>
                  <Star size={12} fill={showWishlist?"#F59E0B":"none"} color={showWishlist?"#D97706":C.textMid} />
                  {t("filter.myWishlist")} {savedIds.size > 0 && `(${savedIds.size})`}
                </button>
              </div>
            )}
          </div>{/* /wc26-filters-body */}
        </div>

        {/* Price alert modal */}
        {alertModal && (
          <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,.5)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={() => setAlertModal(null)}>
            <div style={{ background:C.bgCard, borderRadius:16, padding:28, maxWidth:380, width:"100%", boxShadow:"0 24px 60px rgba(15,23,42,.25)" }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize:24, marginBottom:12 }}>🔔</div>
              <div style={{ ...sora, fontWeight:800, fontSize:18, color:C.text, marginBottom:6 }}>{t("mkt.alertTitle")}</div>
              <div style={{ fontSize:13, color:C.textSoft, marginBottom:16, ...dm }}>
                {t("mkt.alertNotify")} <strong style={{ color:C.text }}>{alertModal.homeRaw} vs {alertModal.awayRaw}</strong> {t("mkt.alertBelow")}:
              </div>
              <div style={{ position:"relative", marginBottom:16 }}>
                <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontWeight:700, color:C.textSoft }}>$</span>
                <input type="number" min="1" value={alertInput} onChange={e => setAlertInput(e.target.value)} placeholder={String(alertModal.price)} style={{ width:"100%", padding:"10px 12px 10px 26px", borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:15, fontFamily:"'DM Sans',sans-serif", outline:"none" }} onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border} />
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => { if (alertInput) { setAlert(alertModal.id, Number(alertInput)); setAlertModal(null); setAlertInput(""); } }} style={{ flex:1, padding:"11px", borderRadius:10, background:`linear-gradient(135deg,${C.blue},${C.blueDark})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>{t("mkt.alertSet")}</button>
                <button onClick={() => setAlertModal(null)} style={{ padding:"11px 16px", borderRadius:10, border:`1px solid ${C.border}`, background:C.bg, fontSize:13, fontWeight:600, color:C.textMid, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>{t("wa.cancel")}</button>
              </div>
              {getAlert(alertModal.id) && <div style={{ marginTop:12, fontSize:12, color:C.textSoft, textAlign:"center", ...dm }}>{t("filter.currentAlert")}: ${getAlert(alertModal.id)} — <button onClick={() => { setAlert(alertModal.id, null); setAlertModal(null); }} style={{ color:C.dangerText, border:"none", background:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:12 }}>{t("mkt.alertRemove")}</button></div>}
            </div>
          </div>
        )}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 20px 80px" }}>
          {/* Results header */}
          <div className="wc26-results-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 14, color: C.textSoft, ...dm }}>
              <strong style={{ color: C.text }}>{displayResult.length}</strong> {displayResult.length !== 1 ? t("mkt.matchesFound") : t("mkt.matchFound")}
              {loading && <span style={{ marginLeft:8, fontSize:10, fontWeight:700, color:C.blue, background:C.infoBg, padding:"2px 7px", borderRadius:999, border:`1px solid ${C.infoBorder}` }}>{t("filter.updating")}</span>}
              {!loading && usingLive && <span style={{ marginLeft:8, fontSize:10, fontWeight:700, color:C.green, background:C.greenBg, padding:"2px 7px", borderRadius:999, border:`1px solid ${C.greenBorder}` }}>{t("filter.liveData")}</span>}
              {chips.length > 0 && (
                <span> · <button onClick={clearAll} style={{ background: "none", border: "none", cursor: "pointer", color: C.blue, fontWeight: 600, fontSize: 14, ...dm }}>
                  {t("mkt.clearFilters")}
                </button></span>
              )}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Sell CTA in results bar */}
              <button
                onClick={() => setShowSell(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", borderRadius: 10,
                  background: `linear-gradient(135deg,${C.blue},${C.blueDark})`,
                  border: "none", color: "#fff",
                  fontSize: 12, fontWeight: 700,
                  cursor: "pointer", transition: "all 0.15s",
                  boxShadow: C.shadowBlue,
                  ...dm,
                }}
              >
                {t("nav.sell")}
              </button>

              {/* Grid toggle */}
              <div style={{ display: "flex", overflow: "hidden", border: `1px solid ${C.border}`, borderRadius: 10 }}>
                {[[LayoutGrid, true], [AlignJustify, false]].map(([Icon, grid]) => (
                  <button key={String(grid)} onClick={() => setGridView(grid)}
                    style={{ padding: "7px 9px", background: gridView === grid ? C.blue : C.bgCard, color: gridView === grid ? "#fff" : C.textSoft, border: "none", cursor: "pointer", display: "flex", alignItems: "center", transition: "all 0.15s" }}>
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Now — pinned above everything else. If a match is being
              played right now, it's the first thing anyone sees, shown as
              a single oversized card so it's unmissable even to someone
              with no prior context. Tickets here are for entry to a match
              already underway, not a future one — kept visually separate
              from "buyable" upcoming listings below. */}
          {showLiveNowSection && (
            <div className="wc26-live-now-section">
              <div className="wc26-live-now-label">
                <span className="wc26-live-pulse" style={{
                  width: 9, height: 9, borderRadius: "50%",
                  background: C.liveRed,
                  boxShadow: "0 0 0 3px rgba(239,68,68,0.25)",
                }} />
                {liveNowMatches.length > 1 ? `${liveNowMatches.length} Matches Live Now` : "Match Live Now"}
              </div>
              <div className="wc26-cards-grid" style={{ '--cols': Math.min(liveNowMatches.length, 2) }}>
                {liveNowMatches.map(m => (
                  <MatchCard
                    key={`live-${m.id}`}
                    match={m}
                    urgency={urgencyMap[m.id] ?? { tickets: 3, viewers: 20 }}
                    isNext={false}
                    isStartingSoon={false}
                    isExpiring={false}
                    isSaved={isSaved(m.id)}
                    onToggleSave={user.registered && user.role === "buyer" ? toggleSave : null}
                    alertPrice={getAlert(m.id)}
                    onSetAlert={user.registered && user.role === "buyer" ? (match) => { setAlertModal(match); setAlertInput(String(getAlert(match.id) ?? "")); } : null}
                    size="large"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Opening Match hero banner — pinned above everything on match day */}
          {safePage === 1 && !search && !cities.length && !teams.length && !dates.length && !quick && (() => {
            const opening = liveMatches.find(m => m.isOpeningMatch);
            if (!opening) return null;
            return (
              <div style={{
                marginBottom: 24,
                borderRadius: 16,
                overflow: "hidden",
                background: "linear-gradient(135deg, #0F1F5C 0%, #1B3C88 40%, #E8302A 100%)",
                boxShadow: "0 8px 32px rgba(232,48,42,0.25), 0 2px 8px rgba(15,23,42,0.2)",
                border: "1.5px solid rgba(232,48,42,0.4)",
              }}>
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 22 }}>🏆</span>
                    <span style={{ ...sora, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>
                      FIFA World Cup 2026 · Opening Match
                    </span>
                    {opening.isLive && opening.liveScore && (
                      <span style={{ ...dm, fontSize: 11, fontWeight: 800, background: "#E8302A", color: "#fff", padding: "3px 10px", borderRadius: 999, letterSpacing: "0.04em", animation: "wc26-pulse-live 1s ease-in-out infinite" }}>
                        ● LIVE {opening.liveScore.home}–{opening.liveScore.away}
                        {opening.liveScore.minute ? ` ${opening.liveScore.minute}'` : ""}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ ...sora, fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                      🇲🇽 Mexico vs South Africa 🇿🇦
                    </span>
                  </div>
                  <div style={{ ...dm, fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 8 }}>
                    Today · Estadio Azteca, Mexico City · Kickoff 19:00 UTC
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Next match banner — only on page 1, no active filters */}
          {safePage === 1 && !search && !cities.length && !teams.length && !dates.length && !quick && (
            <NextMatchBanner nextIsoDate={nextIsoDate} nextMatches={nextMatches} />
          )}

          {/* Empty state */}
          {liveMatches.length === 0 ? (
            /* All matches have passed */
            <div style={{ textAlign: "center", padding: "clamp(48px,10vw,80px) 20px" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🏆</div>
              <h3 style={{ ...sora, fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 10, letterSpacing: "-0.02em" }}>
                {t("mkt.allPassed")}
              </h3>
              <p style={{ fontSize: 15, color: C.textSoft, maxWidth: 420, margin: "0 auto 12px", lineHeight: 1.65, ...dm }}>
                {t("mkt.allPassedSub")}
              </p>
            </div>
          ) : displayResult.length === 0 ? (
            showWishlist ? (
              /* Wishlist is empty */
              <div style={{ textAlign:"center", padding:"clamp(48px,10vw,80px) 0" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>★</div>
                <h3 style={{ ...sora, fontSize:22, fontWeight:700, color:C.text, marginBottom:8 }}>{t("mkt.noWishlist")}</h3>
                <p style={{ fontSize:15, color:C.textSoft, marginBottom:24, ...dm }}>{t("mkt.noWishlistSub")}</p>
                <Button variant="primary" size="md" onClick={() => setShowWishlist(false)}>{t("mkt.browseAll")}</Button>
              </div>
            ) : (
              /* Filters returned nothing */
              <div style={{ textAlign: "center", padding: "clamp(48px,10vw,80px) 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3 style={{ ...sora, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>{t("mkt.noResults")}</h3>
                <p style={{ fontSize: 15, color: C.textSoft, marginBottom: 24, ...dm }}>{t("mkt.noResultsSub")}</p>
                <Button variant="primary" size="md" onClick={clearAll}>{t("mkt.clearFilters")}</Button>
              </div>
            )
          ) : (
            // ── Grouped by date ──────────────────────────────────────────
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {/* Compute which dateGroups are relevant for the current page */}
              {(() => {
                // Slice paged matches and map back to groups for this page.
                // Use result order (which may be price/rating sorted) — NOT dateGroups order.
                const pagedIds = new Set(paged.map(m => m.id));

                // Build a map from isoDate → matches, preserving result order.
                // Live matches are excluded here — they're pinned in the
                // dedicated "Live Now" section above and shouldn't be
                // duplicated (or appear available to buy) in date groups.
                const groupMap = new Map();
                paged.forEach(m => {
                  if (liveNowIds.has(m.id)) return;
                  if (!groupMap.has(m.isoDate)) groupMap.set(m.isoDate, []);
                  groupMap.get(m.isoDate).push(m);
                });

                // Merge with dateGroups metadata (label, isFirst), preserving date-group label order
                const visibleGroups = dateGroups
                  .filter(g => groupMap.has(g.isoDate))
                  .map(g => ({ ...g, matches: groupMap.get(g.isoDate) }));

                return visibleGroups.map(group => (
                  <div key={group.isoDate}>
                    {/* Date group header */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12,
                      marginBottom: 16,
                    }}>
                      <div style={{
                        ...sora, fontSize: 13, fontWeight: 800,
                        color: group.isFirst ? C.blue : C.textMid,
                        textTransform: "uppercase", letterSpacing: "0.06em",
                        whiteSpace: "nowrap",
                      }}>
                        {group.label}
                      </div>
                      <div style={{ flex: 1, height: 1, background: C.border }} />
                      <div style={{
                        ...dm, fontSize: 11, color: C.textSoft, whiteSpace: "nowrap",
                      }}>
                        {group.matches.length} match{group.matches.length !== 1 ? "es" : ""}
                      </div>
                    </div>

                    {/* Cards grid for this date */}
                    <div className={gridView ? "wc26-cards-grid" : "wc26-cards-list"} style={gridView ? { '--cols': Math.min(group.matches.length, 4) } : undefined}>
                      {group.matches.map((m) => (
                        <MatchCard
                          key={`card-${m.id}`}
                          match={m}
                          urgency={urgencyMap[m.id] ?? { tickets: 3, viewers: 20 }}
                          isNext={nextIds.has(m.id)}
                          isStartingSoon={startingSoonIds.has(m.id)}
                          isExpiring={false}
                          isSaved={isSaved(m.id)}
                          onToggleSave={user.registered && user.role === "buyer" ? toggleSave : null}
                          alertPrice={getAlert(m.id)}
                          onSetAlert={user.registered && user.role === "buyer" ? (match) => { setAlertModal(match); setAlertInput(String(getAlert(match.id) ?? "")); } : null}
                        />
                      ))}
                    </div>
                  </div>
                ));
              })()}

              {/* Ghost cards: just-expired, playing fade-out animation */}
              {safePage === 1 && ghostMatches.length > 0 && (
                <div className={gridView ? "wc26-cards-grid" : "wc26-cards-list"} style={gridView ? { '--cols': Math.min(ghostMatches.length, 4) } : undefined}>
                  {ghostMatches.map((m) => {
                    const s = m.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
                    return (
                      <MatchCard
                        key={`ghost-${m.id}`}
                        match={m}
                        urgency={{ tickets: (s % 7) + 1, viewers: (s % 48) + 12 }}
                        isNext={false}
                        isStartingSoon={false}
                        isExpiring={true}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 48 }}>
              <Button variant="secondary" size="sm" disabled={safePage === 1}
                onClick={() => setPage(Math.max(1, safePage - 1))}
                style={{ padding: "8px", borderRadius: 10 }}>
                <ChevronLeft size={16} color={C.textMid} />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{
                    width: 36, height: 36, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s", ...dm,
                    border: `1px solid ${p === safePage ? C.blue : C.border}`,
                    background: p === safePage ? C.blue : C.bgCard,
                    color:      p === safePage ? "#fff"  : C.textMid,
                  }}>
                  {p}
                </button>
              ))}
              <Button variant="secondary" size="sm" disabled={safePage === totalPages}
                onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                style={{ padding: "8px", borderRadius: 10 }}>
                <ChevronRight size={16} color={C.textMid} />
              </Button>
            </div>
          )}

          {/* Bottom Sell CTA banner */}
          <div className="wc26-sell-banner" style={{
            marginTop: 64, padding: "32px", borderRadius: 16,
            background: `linear-gradient(135deg,${C.navy},${C.navyMid})`,
            border: `1px solid rgba(255,255,255,0.1)`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 20,
          }}>
            <div style={{ flex: "1 1 240px", minWidth: 0}}>
              <h3 style={{ ...sora, fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>
                {t("mkt.sellBannerTitle")}
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", ...dm, maxWidth: 400 }}>
                {t("mkt.sellBannerBody")}
              </p>
            </div>
            <button
              onClick={() => setShowSell(true)}
              style={{
                padding: "14px 28px", borderRadius: 12,
                background: `linear-gradient(135deg,${C.blue},${C.blueDark})`,
                border: "none", color: "#fff",
                fontSize: 15, fontWeight: 700,
                cursor: "pointer", transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 8,
                boxShadow: C.shadowBlue,
                ...dm,
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              {t("nav.sell")}
            </button>
          </div>
        </div>

        {/* #4 — buyer sign-up nudge at bottom of listing page */}
        <SignUpNudgeBanner />

      </PageShell>

      {showSell && <SellModal onClose={() => setShowSell(false)} />}
    </>
  );
}
