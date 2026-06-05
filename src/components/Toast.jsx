import { useState, useEffect, useCallback } from "react";
import { CheckCircle, MessageCircle, Heart, Info, X } from "lucide-react";
import { C, dm } from "../tokens";

// Bug fixes:
// 1. Added missing `const ICONS = {` declaration (file was unparseable — crashed app on load)
// 2. Added missing "info" type entry (info toasts silently fell back to success style)
// 3. Removed unused `useRef` import

const ICONS = {
  saved:    { icon: Heart,          color: C.accent,    bg: C.dangerBg,  border: C.dangerBorder },
  unsaved:  { icon: X,              color: C.textSoft,  bg: C.bgSubtle,  border: C.border       },
  contact:  { icon: MessageCircle,  color: C.blue,      bg: C.infoBg,    border: C.infoBorder   },
  success:  { icon: CheckCircle,    color: C.green,     bg: C.greenBg,   border: C.greenBorder  },
  info:     { icon: Info,           color: C.blue,      bg: C.infoBg,    border: C.infoBorder   },
};

// ─── Single toast ──────────────────────────────────
function Toast({ id, type = "success", message, onDismiss }) {
  const cfg     = ICONS[type] || ICONS.success;
  const Icon    = cfg.icon;
  const [vis, setVis] = useState(false);

  useEffect(() => {
    // Trigger enter animation on next frame
    const t1 = setTimeout(() => setVis(true), 10);
    // Auto-dismiss after 3 s
    const t2 = setTimeout(() => { setVis(false); setTimeout(() => onDismiss(id), 300); }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [id, onDismiss]);

  return (
    <div
      style={{
        display:        "flex",
        alignItems:     "center",
        gap:            10,
        padding:        "11px 14px 11px 12px",
        borderRadius:   12,
        background:     cfg.bg,
        border:         `1px solid ${cfg.border}`,
        boxShadow:      "0 8px 24px rgba(15,23,42,0.12)",
        minWidth:       220,
        maxWidth:       "min(320px, 100%)",
        width:          "100%",
        pointerEvents:  "all",
        opacity:        vis ? 1 : 0,
        transform:      vis ? "translateY(0) scale(1)" : "translateY(8px) scale(0.97)",
        transition:     "opacity 0.25s ease, transform 0.25s ease",
        cursor:         "default",
      }}
    >
      <div style={{ flexShrink: 0, display: "flex" }}>
        <Icon size={15} color={cfg.color} fill={type === "saved" ? cfg.color : "none"} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.text, flex: 1, ...dm }}>
        {message}
      </span>
      <button
        onClick={() => { setVis(false); setTimeout(() => onDismiss(id), 300); }}
        style={{ background: "none", border: "none", cursor: "pointer", color: C.textSoft, display: "flex", flexShrink: 0, padding: 0 }}
      >
        <X size={12} />
      </button>
    </div>
  );
}

// ─── Container rendered at root ───────────────────
export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div style={{
      position:      "fixed",
      bottom:        24,
      right:         20,
      left:          20,
      zIndex:        9999,
      display:       "flex",
      flexDirection: "column",
      gap:           10,
      pointerEvents: "none",
      alignItems:    "flex-end",
    }}>
      {toasts.map(t => (
        <Toast key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// ─── Hook ──────────────────────────────────────────
let _push = null; // global singleton so any component can call toast()

export function useToastSetup() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Register global push fn
  _push = useCallback((type, message) => {
    const id = `t_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev.slice(-4), { id, type, message }]); // max 5 at once
  }, []);

  return { toasts, dismiss };
}

// Bug fix: callers pass an object { type, message } but the original signature was
// toast(type, message). Unified to accept both forms.
export function toast(typeOrObj, message) {
  if (!_push) return;
  if (typeOrObj && typeof typeOrObj === "object") {
    _push(typeOrObj.type ?? "success", typeOrObj.message ?? "");
  } else {
    _push(typeOrObj, message);
  }
}
