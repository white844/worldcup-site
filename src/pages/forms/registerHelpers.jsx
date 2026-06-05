/**
 * registerHelpers.js — Shared primitives for BuyerForm and SellerForm.
 */
import { AlertCircle } from "lucide-react";
import { C, dm } from "../../tokens";

export const SESSION_KEY = "ticketeer_seller_draft";

export function sanitise(str) {
  return String(str ?? "")
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function Field({ label, required, error, children, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: C.text, ...dm }}>
        {label}{required && <span style={{ color: C.accent }}> *</span>}
      </label>
      {children}
      {hint && !error && <span style={{ fontSize: 11, color: C.textSoft, ...dm }}>{hint}</span>}
      {error && (
        <span style={{ fontSize: 11, color: C.dangerText, fontWeight: 600, ...dm, display: "flex", alignItems: "center", gap: 4 }}>
          <AlertCircle size={11} /> {error}
        </span>
      )}
    </div>
  );
}

export const inputBase = (err) => ({
  padding: "11px 14px", borderRadius: 10,
  border: "1.5px solid " + (err ? C.dangerBorder : C.border),
  fontSize: 14, color: C.text, background: C.bgCard,
  outline: "none", width: "100%", minWidth: 0,
  boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.15s",
  ...dm,
});
