/**
 * Register.jsx — Sign-Up / Registration page
 *
 * Roles:
 *   Buyer  — email capture (BuyerForm)
 *   Seller — full listing submission via WhatsApp (SellerForm)
 *
 * BuyerForm and SellerForm are extracted into src/pages/forms/
 * for independent maintainability.
 * URL ?role=seller pre-selects the Seller tab.
 */
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, User, Store } from "lucide-react";
import PageShell from "../components/PageShell";
import { C, sora, dm, SITE_TITLE, setPageMeta } from "../tokens";
import { TicketeerIcon } from "../components/TicketeerLogo";
import BuyerForm  from "./forms/BuyerForm";
import SellerForm from "./forms/SellerForm";
import { useUser } from "../context/UserContext";

/* ── RoleTab — defined OUTSIDE Register to keep a stable component identity.
   Defining it inside the parent would create a new component type on every
   render, causing React to fully unmount/remount it and lose input focus. ── */
function RoleTab({ value, activeRole, onSelect, label, icon: Icon, description }) {
  const active = activeRole === value;
  return (
    <button onClick={() => onSelect(value)} style={{
      flex: 1, padding: "18px 16px", borderRadius: 14,
      border: "2px solid " + (active ? C.blue : C.border),
      background: active ? C.infoBg : C.bgCard,
      cursor: "pointer", textAlign: "left", transition: "all 0.15s",
      display: "flex", flexDirection: "column", gap: 8,
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = C.bluePale; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = C.border; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: active
            ? "linear-gradient(135deg," + C.blue + "," + C.blueDark + ")"
            : C.bg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={18} color={active ? "#fff" : C.textSoft} />
        </div>
        <div>
          <div style={{ ...sora, fontSize: 15, fontWeight: 800, color: active ? C.blue : C.text }}>{label}</div>
          <div style={{ fontSize: 12, color: C.textSoft, ...dm }}>{description}</div>
        </div>
        {active && <CheckCircle size={18} color={C.blue} style={{ marginLeft: "auto" }} />}
      </div>
    </button>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const defaultRole    = searchParams.get("role") === "seller" ? "seller" : "buyer";
  const [role, setRole] = useState(defaultRole);

  useEffect(() => {
    return setPageMeta(
      "Sign Up | " + SITE_TITLE,
      "Create your Ticketeer account. Buy verified World Cup 2026 tickets or list yours for sale."
    );
  }, []);

  useEffect(() => {
    const r = searchParams.get("role");
    if (r === "seller" || r === "buyer") setRole(r);
  }, [searchParams]);

  return (
    <PageShell>
      <div style={{
        background: C.bg,
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
      }}>
        <div style={{ maxWidth: 560, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <TicketeerIcon size={32} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.blue, marginBottom: 8, ...dm }}>
              Join Ticketeer
            </div>
            <h1 style={{ ...sora, fontWeight: 800, fontSize: "clamp(26px,4vw,34px)", letterSpacing: "-0.03em", color: C.text, marginBottom: 10 }}>
              Create Your Account
            </h1>
            <p style={{ fontSize: 15, color: C.textSoft, ...dm, lineHeight: 1.6 }}>
              Choose your role to get started.
            </p>
          </div>

          <div style={{ background: C.bgCard, borderRadius: 20, boxShadow: C.shadowMd, border: "1px solid " + C.border, padding: "clamp(20px,5vw,32px) clamp(16px,5vw,28px)" }}>
            <div className="wc26-reg-tabs">
              <RoleTab value="buyer"  activeRole={role} onSelect={setRole} label="Buyer"  icon={User}  description="Get listing alerts" />
              <RoleTab value="seller" activeRole={role} onSelect={setRole} label="Seller" icon={Store} description="List your tickets" />
            </div>
            {role === "buyer" ? <BuyerForm /> : <SellerForm />}
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: C.textSoft, ...dm }}>
            Just browsing?{" "}
            <a href="#" style={{ color: C.blue, fontWeight: 600, textDecoration: "none" }}
              onClick={e => { e.preventDefault(); navigate("/marketplace"); }}>
              Browse tickets →
            </a>
          </p>
        </div>
      </div>
    </PageShell>
  );
}

/* ── Sign-Up nudge banner (Homepage + Marketplace) ────────────────────── */
export function SignUpNudgeBanner() {
  const navigate      = useNavigate();
  const { user }      = useUser();

  // Registered buyers don't need to sign up — hide entirely
  if (user.registered && user.role === "buyer") return null;

  // Registered sellers: show a "list another ticket" prompt instead
  if (user.registered && user.role === "seller") return (
    <section style={{ background: C.bgCard, borderTop: "1px solid " + C.border, borderBottom: "1px solid " + C.border, padding: "40px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.blue, marginBottom: 8, ...dm }}>
            🎫 Got More Tickets?
          </div>
          <h3 style={{ ...sora, fontWeight: 800, fontSize: "clamp(20px,2.5vw,26px)", color: C.text, letterSpacing: "-0.02em", marginBottom: 8 }}>
            List another ticket for sale
          </h3>
          <p style={{ fontSize: 14, color: C.textSoft, ...dm, maxWidth: 440, lineHeight: 1.6 }}>
            Submit a new listing — our team will review and approve it within 24 hours.
          </p>
        </div>
        <button onClick={() => navigate("/register?role=seller")} style={{
          padding: "12px 24px", borderRadius: 12,
          background: "linear-gradient(135deg," + C.blue + "," + C.blueDark + ")",
          border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
          boxShadow: C.shadowBlue, transition: "all 0.15s", ...dm,
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          Submit a New Listing →
        </button>
      </div>
    </section>
  );

  // Guest: original sign-up nudge
  return (
    <section style={{ background: C.bgCard, borderTop: "1px solid " + C.border, borderBottom: "1px solid " + C.border, padding: "40px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.blue, marginBottom: 8, ...dm }}>
            🔔 Never Miss a Listing
          </div>
          <h3 style={{ ...sora, fontWeight: 800, fontSize: "clamp(20px,2.5vw,26px)", color: C.text, letterSpacing: "-0.02em", marginBottom: 8 }}>
            Get notified when new verified tickets go live
          </h3>
          <p style={{ fontSize: 14, color: C.textSoft, ...dm, maxWidth: 440, lineHeight: 1.6 }}>
            Create a free buyer account and be the first to know when tickets for your match become available.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => navigate("/register?role=buyer")} style={{
            padding: "12px 24px", borderRadius: 12,
            background: "linear-gradient(135deg," + C.blue + "," + C.blueDark + ")",
            border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            boxShadow: C.shadowBlue, transition: "all 0.15s",
            display: "flex", alignItems: "center", gap: 8, ...dm,
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Create Free Account →
          </button>
          <button onClick={() => navigate("/register?role=seller")} style={{
            padding: "12px 24px", borderRadius: 12,
            background: C.bg, border: "1px solid " + C.border,
            fontSize: 14, fontWeight: 600, color: C.textMid,
            cursor: "pointer", transition: "all 0.15s", ...dm,
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            Sell a Ticket
          </button>
        </div>
      </div>
    </section>
  );
}
