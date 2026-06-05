/**
 * SellModal — Directs sellers to the registration page.
 */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { C, sora, dm } from "../tokens";
import { TicketeerIcon } from "./TicketeerLogo";

/** Selector for all naturally focusable elements */
const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function SellModal({ onClose }) {
  const navigate   = useNavigate();
  const modalRef   = useRef(null);

  // Escape to close
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Focus trap — keep Tab / Shift+Tab cycling inside the modal
  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;

    // Move focus into modal on open
    const firstFocusable = el.querySelectorAll(FOCUSABLE)[0];
    firstFocusable?.focus();

    const trap = (e) => {
      if (e.key !== "Tab") return;
      const focusable = [...el.querySelectorAll(FOCUSABLE)];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };

    el.addEventListener("keydown", trap);
    return () => el.removeEventListener("keydown", trap);
  }, []);

  const handleProceed = () => {
    onClose();
    navigate("/register?role=seller");
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(14,27,61,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: "0",
      }}
      className="wc26-modal-overlay"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="List your ticket on Ticketeer"
        onClick={e => e.stopPropagation()}
        className="wc26-sell-modal-inner"
        style={{
          background: C.bgCard,
          borderRadius: "20px 20px 0 0",
          padding: "clamp(24px,5vw,36px) clamp(16px,5vw,32px)",
          maxWidth: 520,
          width: "100%",
          boxShadow: C.shadowLg,
          border: `1px solid ${C.border}`,
          animation: "wc26-modal-in 0.25s ease",
          maxHeight: "92dvh",
          overflowY: "auto",
        }}
      >
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: `linear-gradient(135deg,${C.blue},${C.blueDark})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
          boxShadow: C.shadowBlue,
        }}>
          <TicketeerIcon size={40} />
        </div>

        <h2 style={{ ...sora, fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 10, letterSpacing: "-0.02em" }}>
          List Your Ticket on Ticketeer
        </h2>

        <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.65, marginBottom: 20, ...dm }}>
          Register as a seller to submit your ticket. Our team manually reviews every listing before it goes live — keeping the marketplace 100% trustworthy.
        </p>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {[
            ["1️⃣", "Create your seller account"],
            ["2️⃣", "Submit your ticket details & proof"],
            ["3️⃣", "We review and publish within 24h"],
          ].map(([num, text]) => (
            <div key={num} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "10px 14px",
              background: C.bg,
              borderRadius: 10,
              border: `1px solid ${C.border}`,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{num}</span>
              <span style={{ fontSize: 13, color: C.textMid, lineHeight: 1.5, ...dm }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 14px",
          background: "#F0FDF4", borderRadius: 10,
          border: "1px solid #86EFAC",
          marginBottom: 24,
        }}>
          <span style={{ color: C.green, fontSize: 14 }}>✔</span>
          <span style={{ fontSize: 12, color: C.greenText, fontWeight: 600, ...dm }}>
            All listings are manually verified before going live.
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "12px", borderRadius: 12,
              background: C.bg, border: `1px solid ${C.border}`,
              fontSize: 14, fontWeight: 600, color: C.textMid,
              cursor: "pointer", ...dm,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            style={{
              flex: 2, padding: "12px", borderRadius: 12,
              background: `linear-gradient(135deg,${C.blue},${C.blueDark})`,
              border: "none", color: "#fff",
              fontSize: 14, fontWeight: 700,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: C.shadowBlue,
              transition: "opacity 0.15s",
              ...dm,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.92"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Register as Seller →
          </button>
        </div>

        <style>{`
          @media(min-width:541px) {
            .wc26-modal-overlay { align-items: center !important; padding: 20px !important; }
            .wc26-sell-modal-inner { border-radius: 20px !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
