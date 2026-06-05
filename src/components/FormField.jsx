/**
 * Shared form field component.
 * Used by Login, Signup and any future auth forms.
 */
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { C, dm, FOCUS_SHADOWS } from "../tokens";

export default function FormField({
  label, type, name, value,
  onChange, onBlur, error, placeholder,
  icon: Icon, rightEl,
}) {
  const [focused, setFocused] = useState(false);

  const borderColor = error ? C.accent : focused ? C.blue : C.border;
  const boxShadow   = error
    ? FOCUS_SHADOWS.error
    : focused
    ? FOCUS_SHADOWS.active
    : "none";

  const paddingLeft  = Icon    ? "38px" : "14px";
  const paddingRight = rightEl ? "44px" : "14px";

  return (
    <div>
      <label style={{ display:"block", fontSize:13, fontWeight:600, color:C.text, marginBottom:6, ...dm }}>
        {label}
      </label>

      <div style={{ position:"relative" }}>
        {Icon && (
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.textSoft, display:"flex", pointerEvents:"none" }}>
            <Icon size={15} />
          </div>
        )}

        <input
          type={type} name={name} value={value}
          onChange={onChange} placeholder={placeholder}
          autoComplete={name}
          onFocus={() => setFocused(true)}
          onBlur={e => { setFocused(false); onBlur?.(e); }}
          style={{
            width:"100%", outline:"none",
            fontSize:14, fontWeight:500,
            color:C.text, background:C.bgCard,
            border:`1.5px solid ${borderColor}`,
            borderRadius:10,
            padding:`11px ${paddingRight} 11px ${paddingLeft}`,
            boxShadow, transition:"border 0.15s, box-shadow 0.15s",
            ...dm,
          }}
        />

        {rightEl && (
          <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)" }}>
            {rightEl}
          </div>
        )}
      </div>

      {error && (
        <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:5 }}>
          <AlertCircle size={12} style={{ color:C.accent, flexShrink:0 }} />
          <span style={{ fontSize:12, fontWeight:500, color:C.accent, ...dm }}>{error}</span>
        </div>
      )}
    </div>
  );
}
