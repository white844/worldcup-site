/**
 * Guarantee.jsx — Buyer Protection Policy page
 * Linked from GuaranteeBanner and Navbar "Guarantee" link.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, RefreshCw, Clock, UserCheck, AlertCircle, CheckCircle } from "lucide-react";
import PageShell from "../components/PageShell";
import { Button } from "../components/ui";
import { C, sora, dm, SITE_TITLE, setPageMeta } from "../tokens";

const PROTECTIONS = [
  {
    icon: ShieldCheck, color: C.blue,
    title: "Invalid or Fake Tickets",
    body: "If a ticket fails venue verification, you get your full money back immediately — no questions asked. We cross-check every listing against known stadium entry systems before approving.",
  },
  {
    icon: Clock, color: "#F59E0B",
    title: "Late or Non-Delivery",
    body: "Tickets must be delivered at least 48 hours before kick-off. If your seller misses this window, your payment is returned in full and we attempt to source a replacement.",
  },
  {
    icon: AlertCircle, color: C.green,
    title: "Listing Mismatch",
    body: "Your seat, row, section, and category must match the listing exactly. If anything differs from what was advertised, you are entitled to your full money back without needing to contact the seller.",
  },
  {
    icon: UserCheck, color: "#8B5CF6",
    title: "Unresponsive Seller",
    body: "If a verified seller stops responding after payment, our team steps in within 4 hours. If the issue cannot be resolved, you will receive a partial payment back based on how much time remains before the match.",
  },
  {
    icon: RefreshCw, color: "#EC4899",
    title: "Event Cancellation",
    body: "If a match is cancelled or postponed by FIFA and cannot be rescheduled, all outstanding ticket purchases are returned in full automatically within 72 hours.",
  },
];

const STEPS = [
  { n: "1", title: "Contact the seller",      body: "Use the Contact button to message the seller directly. Most issues are resolved here within minutes." },
  { n: "2", title: "Open a dispute",          body: "If the seller doesn't respond or can't resolve the issue within 24 hours, tap 'Open Dispute' in your account." },
  { n: "3", title: "Our team reviews",        body: "We review the evidence — chat logs, listing details, entry records — and make a decision within 4 hours." },
  { n: "4", title: "Payment returned",           body: "If your claim is upheld, the amount you're owed is returned to your original payment method within 1–3 business days." },
];

export default function Guarantee() {
  const navigate = useNavigate();

  useEffect(() => setPageMeta(
    "Buyer Guarantee | " + SITE_TITLE,
    "Ticketeer's 100% buyer protection policy. Invalid tickets, late delivery, listing mismatches — your money back, guaranteed."
  ), []);

  return (
    <PageShell>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${C.blue} 0%, ${C.navyMid} 100%)`,
        padding: "clamp(48px,8vw,72px) 20px clamp(48px,8vw,80px)",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <ShieldCheck size={36} color="#fff" />
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 12, ...dm }}>
            🛡️ Our Promise
          </div>
          <h1 style={{ ...sora, fontWeight: 800, fontSize: "clamp(28px,5vw,48px)", color: "#fff", letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.1 }}>
            100% Buyer Protection
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", maxWidth: 520, margin: "0 auto 32px", ...dm, lineHeight: 1.65 }}>
            Every ticket purchase on Ticketeer is backed by our full buyer protection promise. If anything goes wrong, we make it right — and get your money back to you.
          </p>
          <Button variant="white" size="lg" onClick={() => navigate("/marketplace")}>
            Browse Protected Listings →
          </Button>
        </div>
      </div>

      {/* What's covered */}
      <div style={{ background: C.bg, padding: "clamp(48px,8vw,72px) 20px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.blue, marginBottom: 10, ...dm }}>
              What's Covered
            </div>
            <h2 style={{ ...sora, fontWeight: 800, fontSize: "clamp(22px,3vw,34px)", color: C.text, letterSpacing: "-0.02em" }}>
              Five scenarios, one guarantee
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {PROTECTIONS.map(({ icon: Icon, color, title, body }) => (
              <div key={title} style={{
                background: C.bgCard, borderRadius: 16, padding: "24px",
                border: `1px solid ${C.border}`, boxShadow: C.shadowSm,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: color + "18",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16,
                }}>
                  <Icon size={22} color={color} />
                </div>
                <div style={{ ...sora, fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.65, ...dm }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to claim */}
      <div style={{ background: C.bgSubtle, padding: "clamp(48px,8vw,72px) 20px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.blue, marginBottom: 10, ...dm }}>
              How To Claim
            </div>
            <h2 style={{ ...sora, fontWeight: 800, fontSize: "clamp(22px,3vw,32px)", color: C.text, letterSpacing: "-0.02em" }}>
              Simple four-step process
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {STEPS.map(({ n, title, body }) => (
              <div key={n} style={{
                display: "flex", gap: 16, alignItems: "flex-start",
                background: C.bgCard, borderRadius: 14, padding: "clamp(14px,3vw,20px) clamp(14px,3vw,22px)",
                border: `1px solid ${C.border}`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  ...sora, fontWeight: 800, fontSize: 15, color: "#fff",
                }}>
                  {n}
                </div>
                <div>
                  <div style={{ ...sora, fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.6, ...dm }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom reassurance strip */}
      <div style={{ background: C.bgCard, borderTop: `1px solid ${C.border}`, padding: "32px 20px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
          {[
            "Every listing manually reviewed before going live",
            "Sellers verified by identity before approval",
            "100% money back on all covered disputes",
            "Resolution within 4 hours of dispute opening",
          ].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: C.textMid, ...dm }}>
              <CheckCircle size={14} color={C.green} />{t}
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
