/**
 * LangSwitcher — 🌐 dropdown in the Navbar
 * Shows current flag, opens a dropdown of all 6 languages.
 * Closes on outside click or Escape.
 */
import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";
import { useI18n, LANGUAGES } from "../context/I18nContext";
import { C, dm } from "../tokens";

export default function LangSwitcher() {
  const { lang, setLang } = useI18n();
  const [open, setOpen]   = useState(false);
  const ref               = useRef(null);

  const current = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    const onKey  = (e) => e.key === "Escape" && setOpen(false);
    const onClickOutside = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClickOutside); };
  }, []);

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Select language"
        style={{
          display:"flex", alignItems:"center", gap:5,
          padding:"6px 10px", borderRadius:8,
          border:`1px solid ${C.border}`, background: open ? C.infoBg : "none",
          fontSize:13, cursor:"pointer", color:C.textMid,
          transition:"all 0.15s", fontFamily:"'DM Sans', sans-serif",
        }}
      >
        <span style={{ fontSize:15 }}>{current.flag}</span>
        <span style={{ fontSize:11, fontWeight:600 }}>{current.code.toUpperCase()}</span>
        <span style={{ fontSize:9, opacity:0.6 }}>▾</span>
      </button>

      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)",
          right:0, zIndex:300,
          background:C.bgCard, border:`1px solid ${C.border}`,
          borderRadius:12, boxShadow:"0 8px 32px rgba(15,23,42,.14)",
          overflow:"hidden", minWidth:160,
          animation:"wc26-slide 0.15s ease",
        }}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={l.code === lang ? "" : "wc26-lang-row"}
              style={{
                width:"100%", padding:"10px 16px",
                display:"flex", alignItems:"center", gap:10,
                background: l.code === lang ? C.infoBg : "none",
                border:"none", cursor:"pointer", textAlign:"left",
                borderBottom:`1px solid ${C.border}`,
                fontFamily:"'DM Sans', sans-serif",
              }}
            >
              <span style={{ fontSize:16 }}>{l.flag}</span>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color: l.code === lang ? C.blue : C.text }}>{l.label}</div>
                <div style={{ fontSize:10, color:C.textSoft }}>{l.code.toUpperCase()}{l.code === "ar" ? " · RTL" : ""}</div>
              </div>
              {l.code === lang && <Check size={14} color={C.blue} style={{ marginLeft:"auto" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
