/**
 * Footer — all links wired to real routes/hash sections
 */
import { useNavigate } from "react-router-dom";
import { C, dm } from "../tokens";
import Logo from "./Logo";
import { useI18n } from "../context/I18nContext";

function scrollTo(hash, navigate) {
  if (window.location.pathname !== "/") {
    navigate("/");
    setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 120);
  } else {
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
  }
}

export default function Footer() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const TRUST = [
    t("footer.trust1"),
    t("footer.trust2"),
    t("footer.trust3"),
  ];

  const COLS = [
    {
      titleKey: "footer.col1",
      links: [
        { labelKey: "footer.browse",    action: () => navigate("/marketplace") },
        { labelKey: "footer.bycity",    action: () => scrollTo("cities", navigate) },
        { labelKey: "footer.sellyours", action: () => navigate("/register?role=seller") },
        { labelKey: "footer.liveact",   action: () => scrollTo("activity", navigate) },
      ],
    },
    {
      titleKey: "footer.col2",
      links: [
        { labelKey: "footer.protection", action: () => scrollTo("trust", navigate) },
        { labelKey: "footer.howitworks", action: () => scrollTo("trust", navigate) },
        { labelKey: "footer.contact",    action: () => window.open("https://wa.me/15617108214", "_blank", "noopener,noreferrer") },
        { labelKey: "footer.report",     action: () => window.open("https://wa.me/15617108214?text=I%20want%20to%20report%20a%20problem%20with%20a%20listing%20on%20Ticketeer.", "_blank", "noopener,noreferrer") },
      ],
    },
    {
      titleKey: "footer.col3",
      links: [
        { labelKey: "footer.allverified", action: () => scrollTo("trust", navigate) },
        { labelKey: "footer.manualrev",   action: () => scrollTo("trust", navigate) },
        { labelKey: "footer.buyerguaran", action: () => scrollTo("trust", navigate) },
        { labelKey: "footer.sellerreg",   action: () => navigate("/register?role=seller") },
      ],
    },
  ];

  return (
    <footer style={{ background: C.navy, color: "rgba(255,255,255,0.65)", ...dm, fontSize: 14 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(36px,6vw,56px) 20px 0" }}>
        <div className="wc26-footer-grid">

          {/* Brand col */}
          <div>
            <Logo dark />
            <p style={{ fontSize: 13, lineHeight: 1.65, marginTop: 12, maxWidth: 220, color: "rgba(255,255,255,0.5)" }}>
              {t("footer.tagline")}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 16 }}>
              {TRUST.map(str => (
                <span key={str} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{str}</span>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {COLS.map(col => (
            <div key={col.titleKey}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: 14 }}>
                {t(col.titleKey)}
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {col.links.map(({ labelKey, action }) => (
                  <li key={labelKey}>
                    <button
                      onClick={action}
                      className="wc26-footer-link"
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", fontFamily: "inherit", fontSize: 14 }}
                    >
                      {t(labelKey)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "20px 0", marginTop: 48,
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: 12, fontSize: 12,
          color: "rgba(255,255,255,0.35)",
        }}>
          <span style={{ maxWidth: "100%" }}>© 2026 Ticketeer. Independent ticket marketplace. Not affiliated with FIFA or any official body.</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {["🔒 Secure", "✅ Verified", "🛡️ Protected"].map(b => (
              <div key={b} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 999, padding: "4px 10px", fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
