/**
 * SellerForm — Full seller registration with WhatsApp submission.
 * Extracted from Register.jsx for maintainability.
 */
import { useState, useEffect, useRef } from "react";
import { AlertCircle, CheckCircle, ArrowRight, RefreshCw, Loader, MessageCircle, Clipboard, BarChart3, Info } from "lucide-react";
import { C, sora, dm } from "../../tokens";
import { Button } from "../../components/ui";
import { sendSellerRegistrationMessenger } from "../../utils/whatsapp";
import { Field, inputBase, sanitise, SESSION_KEY } from "./registerHelpers";
import { WC26_ALL_FIXTURES, WC26_FLAGS } from "../../data/wc26Schedule.js";
import { getMarketBenchmark } from "../../data/listingsData.js";
import { useUser } from "../../context/UserContext";

const SELLER_DEFAULTS = {
  fullName: "", email: "", phone: "", location: "",
  match: "", teams: "", matchDate: "", seat: "", price: "", notes: "",
};

function loadDraft() {
  try {
    const r = sessionStorage.getItem(SESSION_KEY);
    return r ? { ...SELLER_DEFAULTS, ...JSON.parse(r) } : SELLER_DEFAULTS;
  } catch { return SELLER_DEFAULTS; }
}

export default function SellerForm() {
  const [form, setForm]     = useState(loadDraft);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | "pending" | "done"
  const [reopening, setReopening] = useState(false);
  const [waBlocked, setWaBlocked] = useState(false);
  const reopenTimer = useRef(null);
  const { register } = useUser();

  useEffect(() => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(form)); } catch {}
  }, [form]);

  useEffect(() => () => clearTimeout(reopenTimer.current), []);

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(ev => ({ ...ev, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())  e.fullName  = "Full name is required";
    if (!form.email.trim())     e.email     = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim())     e.phone     = "Phone number is required";
    if (!form.location.trim())  e.location  = "Location is required";
    if (!form.match.trim())     e.match     = "Match name is required";
    if (!form.teams.trim())     e.teams     = "Teams are required";
    if (!form.matchDate)        e.matchDate = "Match date is required";
    if (!form.seat.trim())      e.seat      = "Seat/section is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = "Enter a valid price";
    return e;
  };

  const clean = () => ({
    fullName:  sanitise(form.fullName),  email:     sanitise(form.email),
    phone:     sanitise(form.phone),     location:  sanitise(form.location),
    match:     sanitise(form.match),     teams:     sanitise(form.teams),
    matchDate: sanitise(form.matchDate), seat:      sanitise(form.seat),
    price:     sanitise(form.price),     notes:     sanitise(form.notes),
  });

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const opened = sendSellerRegistrationMessenger(clean());
    setStatus("pending");
    setWaBlocked(!opened);
  };

  const handleConfirm = () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
    register("seller", sanitise(form.fullName));
    setStatus("done");
  };

  const handleResend = () => {
    if (reopening) return;
    const opened = sendSellerRegistrationMessenger(clean());
    setWaBlocked(!opened);
    setReopening(true);
    reopenTimer.current = setTimeout(() => setReopening(false), 5000);
  };

  /* ── Pending state ── */
  if (status === "pending") {
    const c = clean();
    const summary = `Full Name: ${c.fullName}\nEmail: ${c.email}\nPhone: ${c.phone}\nLocation: ${c.location}\n\nMatch: ${c.teams}\nDate: ${c.matchDate}\nSeat: ${c.seat}\nPrice: $${c.price}\nNotes: ${c.notes || "N/A"}`;
    return (
    <div style={{ textAlign: "center", padding: "32px 16px" }}>
      <div className="wc26-icon-tile wc26-icon-tile-blue" style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 16px" }}>
        <MessageCircle size={24} />
      </div>
      <h3 style={{ ...sora, fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 10 }}>Messenger is open</h3>

      {waBlocked && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", borderRadius: 10, background: C.warnBg, border: "1px solid " + C.warnBorder, marginBottom: 16, textAlign: "left", maxWidth: 340, margin: "0 auto 16px" }}>
          <AlertCircle size={16} style={{ color: C.warnText, flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 13, color: C.warnText, fontWeight: 600, ...dm }}>
            Popup was blocked. Tap "Reopen Messenger" below.
          </span>
        </div>
      )}

      <p style={{ color: C.textSoft, fontSize: 14, ...dm, lineHeight: 1.65, maxWidth: 340, margin: "0 auto 12px" }}>
        Copy your submission details below and paste them into Messenger, then tap <strong style={{ color: C.text }}>Done</strong>.
      </p>

      <div style={{ textAlign: "left", background: C.bgSubtle, border: "1px solid " + C.border, borderRadius: 10, padding: "12px 14px", maxWidth: 340, margin: "0 auto 16px", fontSize: 12, color: C.textMid, ...dm, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
        {summary}
      </div>

      <button
        onClick={() => { try { navigator.clipboard.writeText("New Seller Registration — Ticketeer\n\n" + summary + "\n\nAwaiting manual review."); } catch {} }}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, border: "1px solid " + C.border, background: C.bg, fontSize: 13, fontWeight: 600, color: C.textMid, cursor: "pointer", marginBottom: 20, ...dm }}
      >
        <Clipboard size={13} /> Copy Details
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320, margin: "0 auto" }}>
        <button onClick={handleConfirm} style={{
          padding: "14px", borderRadius: 12,
          background: C.green,
          border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: "0 4px 16px rgba(22,163,74,0.35)", ...dm,
        }}>
          <CheckCircle size={16} /> Done
        </button>
        <button onClick={handleResend} disabled={reopening} className="wc26-lift-btn" style={{
          padding: "12px", borderRadius: 12,
          background: reopening ? C.bgSubtle : C.bg,
          border: "1px solid " + C.border,
          fontSize: 14, fontWeight: 600,
          color: reopening ? C.textSoft : C.textMid,
          cursor: reopening ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          ...dm,
        }}>
          {reopening
            ? <><Loader size={14} style={{ animation: "wc26-spin 1s linear infinite" }} /> Opening…</>
            : <><RefreshCw size={14} /> Reopen Messenger</>
          }
        </button>
      </div>
    </div>
  );}

  /* ── Done state ── */
  if (status === "done") {
    const c = clean();
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: "2px solid " + C.greenBorder }}>
          <CheckCircle size={32} color={C.green} />
        </div>
        <h3 style={{ ...sora, fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 10 }}>Submission Received!</h3>
        <p style={{ color: C.textSoft, fontSize: 15, ...dm, lineHeight: 1.6, maxWidth: 360, margin: "0 auto 20px" }}>
          Our team will review your listing and contact you on <strong style={{ color: C.text }}>{c.phone}</strong> within 24 hours. Your ticket will only go live after manual approval.
        </p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.infoBg, border: "1px solid " + C.infoBorder, borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, color: C.blue, ...dm }}>
          <Info size={14} /> Keep an eye on <strong>{c.phone}</strong> — we'll reach out shortly.
        </div>
      </div>
    );
  }

  /* ── Form ── */
  const SH = ({ t }) => (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.blue, paddingBottom: 10, borderBottom: "1px solid " + C.border, marginTop: 8, ...dm }}>{t}</div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", borderRadius: 10, background: C.infoBg, border: "1px solid " + C.infoBorder }}>
        <AlertCircle size={16} style={{ color: C.blue, flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 13, color: C.blue, fontWeight: 500, lineHeight: 1.5, ...dm }}>
          Your listing will only appear after manual approval — usually within 24 hours.
        </span>
      </div>

      <SH t="Your Details" />

      <div className="wc26-reg-grid">
        <Field label="Full Name" required error={errors.fullName}>
          <input value={form.fullName} onChange={set("fullName")} placeholder="e.g. John Doe" style={inputBase(errors.fullName)}
            onFocus={e => e.target.style.borderColor = C.blue} onBlur={e => e.target.style.borderColor = errors.fullName ? C.dangerBorder : C.border} />
        </Field>
        <Field label="Phone Number" required error={errors.phone} hint="Include country code — we'll call this number">
          <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" style={inputBase(errors.phone)}
            onFocus={e => e.target.style.borderColor = C.blue} onBlur={e => e.target.style.borderColor = errors.phone ? C.dangerBorder : C.border} />
        </Field>
      </div>

      <Field label="Email Address" required error={errors.email}>
        <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" style={inputBase(errors.email)}
          onFocus={e => e.target.style.borderColor = C.blue} onBlur={e => e.target.style.borderColor = errors.email ? C.dangerBorder : C.border} />
      </Field>

      <Field label="Your Location / Country" required error={errors.location}>
        <input value={form.location} onChange={set("location")} placeholder="e.g. New York, USA" style={inputBase(errors.location)}
          onFocus={e => e.target.style.borderColor = C.blue} onBlur={e => e.target.style.borderColor = errors.location ? C.dangerBorder : C.border} />
      </Field>

      <SH t="Ticket Details" />

      <div className="wc26-reg-grid">
        <Field label="Match" required error={errors.match}>
          <select
            value={form.match}
            onChange={e => {
              const val = e.target.value;
              const fixture = WC26_ALL_FIXTURES.find(f => f.id === val);
              if (fixture) {
                const homeFlag = WC26_FLAGS[fixture.home] ?? "";
                const awayFlag = WC26_FLAGS[fixture.away] ?? "";
                setForm(f => ({
                  ...f,
                  match: val,
                  teams: `${fixture.home} ${homeFlag} vs ${fixture.away} ${awayFlag}`,
                  matchDate: fixture.date,
                }));
              } else {
                setForm(f => ({ ...f, match: val, teams: "", matchDate: "" }));
              }
              if (errors.match) setErrors(ev => ({ ...ev, match: undefined, teams: undefined, matchDate: undefined }));
            }}
            style={{ ...inputBase(errors.match), width:"100%", cursor:"pointer" }}
          >
            <option value="">Select a match…</option>
            {WC26_ALL_FIXTURES.filter(f => WC26_FLAGS[f.home]).map(f => {
              const hf = WC26_FLAGS[f.home] ?? "";
              const af = WC26_FLAGS[f.away] ?? "";
              const label = f.group
                ? `Group ${f.group}: ${f.home} ${hf} vs ${f.away} ${af} — ${f.date}`
                : `${f.round}: ${f.home} ${hf} vs ${f.away} ${af} — ${f.date}`;
              return <option key={f.id} value={f.id}>{label}</option>;
            })}
          </select>
        </Field>
        {form.teams && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize:12, color:C.textMid, padding:"8px 12px", background:C.bgSubtle, borderRadius:8, border:`1px solid ${C.border}`, ...dm }}>
            <CheckCircle size={13} color={C.green} /> {form.teams}
          </div>
        )}
      </div>

      <div className="wc26-reg-grid">
        <Field label="Match Date" required error={errors.matchDate}>
          <input type="date" value={form.matchDate} onChange={set("matchDate")}
            style={{ ...inputBase(errors.matchDate), width: "100%", minWidth: 0 }}
            onFocus={e => e.target.style.borderColor = C.blue} onBlur={e => e.target.style.borderColor = errors.matchDate ? C.dangerBorder : C.border} />
        </Field>
        <Field label="Seat / Section" required error={errors.seat}>
          <input value={form.seat} onChange={set("seat")} placeholder="e.g. Block A, Row 12, Seat 5" style={inputBase(errors.seat)}
            onFocus={e => e.target.style.borderColor = C.blue} onBlur={e => e.target.style.borderColor = errors.seat ? C.dangerBorder : C.border} />
        </Field>
      </div>

      <Field label="Asking Price (USD)" required error={errors.price}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.textSoft, fontWeight: 600, fontSize: 14, ...dm }}>$</span>
          <input type="number" min="1" value={form.price} onChange={set("price")} placeholder="e.g. 350"
            style={{ ...inputBase(errors.price), paddingLeft: 28 }}
            onFocus={e => e.target.style.borderColor = C.blue} onBlur={e => e.target.style.borderColor = errors.price ? C.dangerBorder : C.border} />
        </div>
        {/* Market benchmark */}
        {form.match && (() => {
          const bench = getMarketBenchmark(form.match);
          if (!bench) return null;
          return (
            <div style={{ marginTop:8, padding:"10px 12px", borderRadius:8, background:C.infoBg, border:`1px solid ${C.infoBorder}`, fontSize:12, color:C.blue, ...dm }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontWeight:700, marginBottom:3 }}><BarChart3 size={13} /> Market range for this match ({bench.round})</div>
              <div style={{ color:C.textMid }}>
                Typical listings: <strong style={{ color:C.text }}>${bench.low} – ${bench.high}</strong>
                &nbsp;· Avg: <strong style={{ color:C.text }}>${bench.avg}</strong>
              </div>
            </div>
          );
        })()}
      </Field>

      <Field label="Additional Notes" hint="Any extra info about the ticket (e.g. category, transfer method)">
        <textarea value={form.notes} onChange={set("notes")} placeholder="Optional — add any relevant details here…" rows={3}
          style={{ ...inputBase(false), resize: "vertical", lineHeight: 1.55 }}
          onFocus={e => e.target.style.borderColor = C.blue} onBlur={e => e.target.style.borderColor = C.border} />
      </Field>

      <Button variant="primary" size="lg" onClick={handleSubmit} style={{ marginTop: 8 }}>
        Submit for Review <ArrowRight size={16} />
      </Button>

      <p style={{ fontSize: 12, color: C.textSoft, textAlign: "center", ...dm, lineHeight: 1.5 }}>
        By submitting, your details will be sent to our team for manual review. You will not be listed until approved.
      </p>
    </div>
  );
}
