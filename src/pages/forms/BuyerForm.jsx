/**
 * BuyerForm — email capture for buyers who want listing alerts.
 * Extracted from Register.jsx for maintainability.
 *
 * Fix: removed duplicate unreachable JSX block that was outside the
 * function body, causing a syntax error that crashed buyer registration.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { C, sora, dm } from "../../tokens";
import { Field, inputBase, sanitise, SESSION_KEY } from "./registerHelpers";
import { useUser } from "../../context/UserContext";

export const REGISTERED_KEY = "ticketeer_user"; // kept for Navbar backwards compat

export default function BuyerForm() {
  const [form, setForm]           = useState({ name: "", email: "" });
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate                  = useNavigate();
  const { register }              = useUser();
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (!Object.keys(e).length) {
      try { sessionStorage.removeItem(SESSION_KEY); } catch {}
      register("buyer", sanitise(form.name));
      setSubmitted(true);
    }
  };

  // Redirect to homepage after showing success for 2 seconds
  useEffect(() => {
    if (!submitted) return;
    const id = setTimeout(() => navigate("/"), 2000);
    return () => clearTimeout(id);
  }, [submitted, navigate]);

  if (submitted) return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: "2px solid " + C.greenBorder }}>
        <CheckCircle size={32} color={C.green} />
      </div>
      <h3 style={{ ...sora, fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 10 }}>You're on the list!</h3>
      <p style={{ color: C.textSoft, fontSize: 15, ...dm, lineHeight: 1.6, maxWidth: 320, margin: "0 auto 16px" }}>
        Thanks, <strong style={{ color: C.text }}>{sanitise(form.name)}</strong>! We'll notify <strong style={{ color: C.text }}>{sanitise(form.email)}</strong> whenever new verified listings go live.
      </p>
      <p style={{ color: C.textSoft, fontSize: 13, ...dm }}>Taking you home…</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", borderRadius: 10, background: C.infoBg, border: "1px solid " + C.infoBorder }}>
        <AlertCircle size={16} style={{ color: C.blue, flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 13, color: C.blue, fontWeight: 500, lineHeight: 1.5, ...dm }}>
          Sign up to get notified when new verified listings go live — before they sell out.
        </span>
      </div>

      <Field label="Full Name" required error={errors.name}>
        <input value={form.name} onChange={set("name")} placeholder="e.g. John Doe"
          style={inputBase(errors.name)}
          onFocus={e => e.target.style.borderColor = C.blue}
          onBlur={e => e.target.style.borderColor = errors.name ? C.dangerBorder : C.border}
        />
      </Field>

      <Field label="Email Address" required error={errors.email} hint="We'll send you alerts when new listings go live.">
        <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com"
          style={inputBase(errors.email)}
          onFocus={e => e.target.style.borderColor = C.blue}
          onBlur={e => e.target.style.borderColor = errors.email ? C.dangerBorder : C.border}
        />
      </Field>

      <button onClick={handleSubmit} style={{
        marginTop: 8, padding: "14px", borderRadius: 12,
        background: "linear-gradient(135deg," + C.blue + "," + C.blueDark + ")",
        border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        boxShadow: C.shadowBlue, transition: "opacity 0.15s", ...dm,
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        Notify Me of New Listings <ArrowRight size={16} />
      </button>
      <p style={{ fontSize: 12, color: C.textSoft, textAlign: "center", ...dm }}>No spam. Unsubscribe any time.</p>
    </div>
  );
}
