import { useState, useEffect, useRef } from "react";
import {
  Search, ChevronDown, CheckCheck, X,
  MapPin, Users, Calendar, DollarSign, TrendingUp,
} from "lucide-react";
import { Button } from "../ui";
import { C, dm } from "../../tokens";
import { useI18n } from "../../context/I18nContext";
import { ALL_DATES, CITY_GROUPS, TEAM_OPTIONS, SORT_OPTIONS } from "../../data";

// ─── Outside-click hook ────────────────────────────
function useOutsideClick(ref, fn, active) {
  const fnRef = useRef(fn);
  useEffect(() => { fnRef.current = fn; });
  useEffect(() => {
    if (!active) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) fnRef.current(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [active, ref]);
}

// ─── Dropdown wrapper ──────────────────────────────
function Dropdown({ open, onClose, trigger, panel, alignRight = false }) {
  const ref    = useRef(null);
  const panRef = useRef(null);
  useOutsideClick(ref, onClose, open);

  useEffect(() => {
    if (!open || !panRef.current) return;
    const el = panRef.current;
    el.style.left = ""; el.style.right = "";
    if (alignRight) { el.style.right = "0"; return; }
    const rect     = el.getBoundingClientRect();
    const overflow = rect.right - (window.innerWidth - 8);
    if (overflow > 0) el.style.left = `-${overflow}px`;
  }, [open, alignRight]);

  return (
    <div ref={ref} style={{ position:"relative" }}>
      {trigger}
      {open && (
        <div ref={panRef} style={{
          position:"absolute", top:"calc(100% + 8px)", zIndex:50,
          background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:14,
          boxShadow:C.shadowLg, overflow:"hidden",
          width:"max-content", maxWidth:"calc(100vw - 16px)",
          left: alignRight ? "auto" : 0,
          right: alignRight ? 0 : "auto",
        }}>
          {panel}
        </div>
      )}
    </div>
  );
}

// ─── Panel header row (shared across all panels) ──
function PanelHeader({ label, onClear, showClear }) {
  return (
    <div style={{ padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${C.border}` }}>
      <span className="wc26-label" style={{ marginBottom:0 }}>{label}</span>
      {showClear && (
        <button onClick={onClear}
          style={{ fontSize:12, fontWeight:700, color:C.blue, background:"none", border:"none", cursor:"pointer", ...dm }}>
          Clear
        </button>
      )}
    </div>
  );
}

// ─── Checkbox row (shared by CheckPanel, CityPanel, TeamPanel) ──
function CheckRow({ label, checked, onToggle }) {
  return (
    <button onClick={onToggle}
      className="wc26-filter-row"
      style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"10px 16px", border:"none", cursor:"pointer", textAlign:"left",
        background: checked ? C.bgSubtle : C.bgCard }}>
      <div style={{ width:16, height:16, borderRadius:4, flexShrink:0, transition:"all 0.15s",
        border:`2px solid ${checked ? C.blue : C.borderMid}`,
        background: checked ? C.blue : "transparent",
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        {checked && <CheckCheck size={9} color="#fff" />}
      </div>
      <span style={{ fontSize:13, fontWeight:500, color:C.text, ...dm }}>{label}</span>
    </button>
  );
}

// ─── Checkbox panel (dates) ────────────────────────
function CheckPanel({ options, selected, onToggle, onClear, label }) {
  return (
    <div style={{ width:"min(260px,calc(100vw - 16px))" }}>
      <PanelHeader label={label} onClear={onClear} showClear={selected.length > 0} />
      <div style={{ maxHeight:"min(220px,40dvh)", overflowY:"auto" }}>
        {options.map(opt => (
          <CheckRow key={opt} label={opt} checked={selected.includes(opt)} onToggle={() => onToggle(opt)} />
        ))}
      </div>
    </div>
  );
}

// ─── City panel (grouped) ──────────────────────────
function CityPanel({ selected, onToggle, onClear }) {
  const { t } = useI18n();
  return (
    <div style={{ width:"min(280px,calc(100vw - 16px))" }}>
      <PanelHeader label={t("filter.city")} onClear={onClear} showClear={selected.length > 0} />
      <div style={{ maxHeight:"min(260px,45dvh)", overflowY:"auto" }}>
        {CITY_GROUPS.map(({ group, cities }) => (
          <div key={group}>
            <div style={{ padding:"8px 16px 4px", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:C.textSoft, background:C.bgSubtle, ...dm }}>
              {group}
            </div>
            {cities.map(city => (
              <CheckRow key={city} label={city} checked={selected.includes(city)} onToggle={() => onToggle(city)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Team panel (with search) ──────────────────────
function TeamPanel({ selected, onToggle, onClear }) {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const filtered  = TEAM_OPTIONS.filter(team => team.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ width:"min(260px,calc(100vw - 16px))" }}>
      <PanelHeader label={t("filter.team")} onClear={onClear} showClear={selected.length > 0} />
      <div style={{ padding:"8px 12px", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:C.bgSubtle, borderRadius:8, padding:"6px 10px" }}>
          <Search size={12} color={C.textSoft} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t("filter.searchTeams")}
            style={{ flex:1, border:"none", outline:"none", fontSize:13, background:"transparent", color:C.text, ...dm }} />
          {q && (
            <button onClick={() => setQ("")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex" }}>
              <X size={11} color={C.textSoft} />
            </button>
          )}
        </div>
      </div>
      <div style={{ maxHeight:"min(220px,40dvh)", overflowY:"auto" }}>
        {filtered.map(opt => (
          <CheckRow key={opt} label={opt} checked={selected.includes(opt)} onToggle={() => onToggle(opt)} />
        ))}
        {filtered.length === 0 && (
          <div style={{ padding:"12px 16px", fontSize:13, color:C.textSoft, ...dm }}>No teams found</div>
        )}
      </div>
    </div>
  );
}

// ─── Price panel ───────────────────────────────────
const PRICE_PRESETS = [
  ["Under $100", "0",   "99" ],
  ["$100–$200",  "100", "200"],
  ["$200–$400",  "200", "400"],
  ["$400+",      "400", ""   ],
];

function PricePanel({ minP, maxP, setMin, setMax, onClear, onClose }) {
  const { t } = useI18n();
  const hasValue = !!(minP || maxP);
  return (
    <div style={{ width:"min(260px,calc(100vw - 16px))", padding:"14px 16px" }}>
      <PanelHeader label={t("filter.priceRange")} onClear={onClear} showClear={hasValue} />
      <div style={{ display:"flex", gap:8, margin:"12px 0 14px" }}>
        {[[t("filter.minPrice"), minP, setMin, "0"], [t("filter.maxPrice"), maxP, setMax, t("filter.maxAny")]].map(([lbl, val, setter, ph]) => (
          <div key={lbl} style={{ flex:1 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.textSoft, display:"block", marginBottom:4, ...dm }}>{lbl}</label>
            <input type="number" min={0} placeholder={ph} value={val}
              onChange={e => setter(e.target.value)}
              style={{ width:"100%", borderRadius:8, padding:"8px 10px", fontSize:13, border:`1.5px solid ${C.border}`, outline:"none", background:C.bgSubtle, color:C.text, ...dm }} />
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, paddingTop:12, borderTop:`1px solid ${C.border}` }}>
        {PRICE_PRESETS.map(([lbl, mn, mx]) => {
          const active = minP === mn && maxP === mx;
          return (
            <button key={lbl} onClick={() => { setMin(mn); setMax(mx); onClose?.(); }}
              style={{ fontSize:12, padding:7, borderRadius:8, fontWeight:600, cursor:"pointer", transition:"all 0.15s", ...dm,
                border:`1.5px solid ${active ? C.blue : C.border}`,
                background: active ? C.infoBg : "transparent",
                color:      active ? C.blue   : C.textSoft }}>
              {lbl}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sort panel ────────────────────────────────────
function SortPanel({ sortBy, setSortBy, onClose }) {
  const { t } = useI18n();
  const SORT_LABELS = {
    "Soonest Date":       t("filter.sortSoonest"),
    "Price: Low to High": t("filter.sortLowHigh"),
    "Price: High to Low": t("filter.sortHighLow"),
    "Best Rating":        t("filter.sortRating"),
  };
  return (
    <div style={{ width:"min(200px,calc(100vw - 16px))" }}>
      {SORT_OPTIONS.map(opt => {
        const active = sortBy === opt;
        return (
          <button key={opt} onClick={() => { setSortBy(opt); onClose(); }}
            className="wc26-filter-row"
            style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px", border:"none", cursor:"pointer",
              background: active ? C.infoBg  : C.bgCard,
              fontSize:13, fontWeight: active ? 700 : 500,
              color:       active ? C.blue   : C.text, ...dm }}>
            {SORT_LABELS[opt] ?? opt}
            {active && <CheckCheck size={13} color={C.blue} />}
          </button>
        );
      })}
    </div>
  );
}

// ─── Filter trigger button ─────────────────────────
function FilterBtn({ label, active, open, onClick, icon: Icon }) {
  return (
    <button onClick={onClick}
      aria-expanded={open}
      aria-haspopup="listbox"
      style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 12px", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.15s", ...dm, whiteSpace:"nowrap",
        border:`1.5px solid ${active || open ? C.blue    : C.border  }`,
        background:          active || open ? C.infoBg   : C.bgCard,
        color:               active || open ? C.blue     : C.textMid }}>
      {Icon && <Icon size={13} />}
      {label}
      <ChevronDown size={11} style={{ transform:open ? "rotate(180deg)" : "none", transition:"transform 0.15s" }} />
    </button>
  );
}

// ─── Quick filter pill ─────────────────────────────
function QuickPill({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      style={{ padding:"7px 12px", borderRadius:10, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.15s", ...dm,
        border:`1.5px solid ${active ? C.blue   : C.border  }`,
        background:          active ? C.infoBg  : C.bgCard,
        color:               active ? C.blue    : C.textMid }}>
      {label}
    </button>
  );
}

// ─── Public FilterBar ──────────────────────────────
export default function FilterBar({
  search, setSearch,
  cities, setCities,
  teams,  setTeams,
  dates,  setDates,
  minP,   setMinP,
  maxP,   setMaxP,
  quick,  setQuick,
  sortBy, setSortBy,
  chips,  clearAll,
  resultCount,
  liveDates,       // ← upcoming dates only (past dates excluded)
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(null);
  const toggle    = p  => setOpen(o => o === p ? null : p);
  const toggleArr = (setter, list, val) =>
    setter(list.includes(val) ? list.filter(x => x !== val) : [...list, val]);

  const SORT_LABELS = {
    "Soonest Date":       t("filter.sortSoonest"),
    "Price: Low to High": t("filter.sortLowHigh"),
    "Price: High to Low": t("filter.sortHighLow"),
    "Best Rating":        t("filter.sortRating"),
  };

  const QUICK_LABELS = {
    "Under $100":   t("filter.quickU100"),
    "This Weekend": t("filter.quickWeekend"),
    "Top Matches":  t("filter.quickTop"),
  };

  return (
    <>
      {/* Search + filter row */}
      <div className="wc26-filterbar-row">

        {/* Search input */}
        <div style={{ display:"flex", alignItems:"center", gap:8, background:C.bgCard, borderRadius:10, padding:"7px 12px", flex:"1 1 200px", minWidth:180, maxWidth:320, transition:"border 0.15s",
          border:`1.5px solid ${search ? C.blue : C.border}` }}>
          <Search size={13} color={search ? C.blue : C.textSoft} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t("filter.searchAll")}
            style={{ flex:1, border:"none", outline:"none", fontSize:13, color:C.text, background:"transparent", ...dm }} />
          {search && (
            <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex" }}>
              <X size={12} color={C.textSoft} />
            </button>
          )}
        </div>

        <Dropdown open={open==="city"}  onClose={() => toggle("city")}
          trigger={<FilterBtn label={cities.length ? `${t("filter.city")} (${cities.length})` : t("filter.city")} active={cities.length>0} open={open==="city"}  onClick={() => toggle("city")}  icon={MapPin}     />}
          panel={<CityPanel  selected={cities} onToggle={c => toggleArr(setCities, cities, c)} onClear={() => setCities([])} />}
        />

        <Dropdown open={open==="team"}  onClose={() => toggle("team")}
          trigger={<FilterBtn label={teams.length  ? `${t("filter.team")} (${teams.length})`  : t("filter.team")}  active={teams.length>0}  open={open==="team"}  onClick={() => toggle("team")}  icon={Users}      />}
          panel={<TeamPanel  selected={teams}  onToggle={t => toggleArr(setTeams,  teams,  t)} onClear={() => setTeams([])}  />}
        />

        <Dropdown open={open==="date"}  onClose={() => toggle("date")}
          trigger={<FilterBtn label={dates.length  ? `Date (${dates.length})`   : "Date"}  active={dates.length>0}  open={open==="date"}  onClick={() => toggle("date")}  icon={Calendar}   />}
          panel={<CheckPanel options={liveDates ?? ALL_DATES} selected={dates} onToggle={d => toggleArr(setDates, dates, d)} onClear={() => setDates([])} label={t("filter.date")} />}
        />

        <Dropdown open={open==="price"} onClose={() => toggle("price")}
          trigger={<FilterBtn label={(minP||maxP) ? `$${minP||"0"}–$${maxP||"∞"}` : "Price"} active={!!(minP||maxP)} open={open==="price"} onClick={() => toggle("price")} icon={DollarSign} />}
          panel={<PricePanel minP={minP} maxP={maxP} setMin={setMinP} setMax={setMaxP} onClear={() => { setMinP(""); setMaxP(""); }} onClose={() => toggle("price")} />}
        />

        <Dropdown alignRight open={open==="sort"}  onClose={() => toggle("sort")}
          trigger={<FilterBtn label={SORT_LABELS[sortBy] ?? sortBy} active={sortBy !== "Soonest Date"} open={open==="sort"}  onClick={() => toggle("sort")}  icon={TrendingUp} />}
          panel={<SortPanel sortBy={sortBy} setSortBy={setSortBy} onClose={() => toggle("sort")} />}
        />

        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {["Under $100", "This Weekend", "Top Matches"].map(q => (
            <QuickPill key={q} label={QUICK_LABELS[q] ?? q} active={quick === q} onClick={() => setQuick(quick === q ? null : q)} />
          ))}
        </div>

        {chips.length > 0 && (
          <Button variant="danger" size="sm" onClick={clearAll}>
            Clear all ({chips.length})
          </Button>
        )}
      </div>

      {/* Active filter chips */}
      {chips.length > 0 && (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:12 }}>
          {chips.map(chip => (
            <div key={chip.label} className="wc26-pill-info"
              style={{ display:"flex", alignItems:"center", gap:6, borderRadius:999, padding:"4px 10px", fontSize:12, fontWeight:600, ...dm }}>
              {chip.label}
              <button onClick={chip.rm}
                style={{ background:"none", border:"none", cursor:"pointer", display:"flex", color:C.blue, padding:0 }}>
                <X size={11} />
              </button>
            </div>
          ))}
          <span style={{ fontSize:12, color:C.textSoft, alignSelf:"center", ...dm }}>
            {resultCount} result{resultCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Item hover CSS — can't be done without runtime state, kept minimal */}
      <style>{`
        .wc26-filter-row:hover { background: ${C.bgSubtle} !important; }
      `}</style>
    </>
  );
}
