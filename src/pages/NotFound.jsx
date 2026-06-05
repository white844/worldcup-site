/**
 * NotFound.jsx — 404 page
 * Shown for any unmatched route via App.jsx catch-all.
 * Sets document.title (#7).
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import { C, sora, dm, SITE_TITLE, setPageMeta } from "../tokens";
import { TicketeerIcon } from "../components/TicketeerLogo";


export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    return setPageMeta("Page Not Found | " + SITE_TITLE);
  }, []);

  return (
    <PageShell>
      <div style={{
        background: C.bg, minHeight: "calc(100vh - 64px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 20px",
      }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>

          {/* Large 404 */}
          <div style={{
            ...sora, fontSize: "clamp(80px,15vw,120px)", fontWeight: 800,
            letterSpacing: "-0.06em", lineHeight: 1,
            background: `linear-gradient(135deg,${C.blue},${C.blueDark})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}>
            404
          </div>

          <div style={{ marginBottom: 16, display:"flex", justifyContent:"center" }}><TicketeerIcon size={52} /></div>

          <h1 style={{ ...sora, fontSize: "clamp(22px,3vw,28px)", fontWeight: 800, color: C.text, letterSpacing: "-0.03em", marginBottom: 12 }}>
            Ticket not found
          </h1>

          <p style={{ fontSize: 15, color: C.textSoft, ...dm, lineHeight: 1.65, marginBottom: 32 }}>
            This page doesn't exist or the listing may have already sold. Head back to the marketplace to find verified tickets.
          </p>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/marketplace")}
              style={{
                padding: "13px 28px", borderRadius: 12,
                background: `linear-gradient(135deg,${C.blue},${C.blueDark})`,
                border: "none", color: "#fff",
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                boxShadow: C.shadowBlue, transition: "opacity 0.15s",
                display: "flex", alignItems: "center", gap: 8,
                ...dm,
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Browse All Tickets →
            </button>

            <button
              onClick={() => navigate("/")}
              style={{
                padding: "13px 28px", borderRadius: 12,
                background: C.bgCard, border: `1px solid ${C.border}`,
                fontSize: 15, fontWeight: 600, color: C.textMid,
                cursor: "pointer", transition: "all 0.15s",
                ...dm,
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              Go Home
            </button>
          </div>

          {/* Trust note */}
          <div style={{
            marginTop: 40, padding: "12px 20px",
            background: C.infoBg, border: `1px solid ${C.infoBorder}`,
            borderRadius: 12, fontSize: 13, color: C.blue, fontWeight: 500, ...dm,
          }}>
            🔒 All live listings are admin-verified — browse safely.
          </div>
        </div>
      </div>
    </PageShell>
  );
}
