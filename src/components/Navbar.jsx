/**
 * Navbar — Navigation with Sign Up CTA.
 * - Cities link removed (no destination page)
 * - Sign Up hidden once user has registered
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, dm } from "../tokens";
import { Button } from "./ui";
import Logo from "./Logo";
import SellModal from "./SellModal";
import { Menu, X } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useI18n } from "../context/I18nContext";
import LangSwitcher from "./LangSwitcher";

function scrollTo(hash, navigate) {
  if (window.location.pathname !== "/") {
    navigate("/");
    setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 100);
  } else {
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
  }
}

export default function Navbar() {
  const [open, setOpen]         = useState(false);
  const [showSell, setShowSell] = useState(false);
  const navigate                = useNavigate();

  const { user } = useUser();
  const { t } = useI18n();
  const isRegistered = user.registered;
  const isBuyer      = user.role === "buyer";

  const NAV_LINKS = [
    { labelKey: "nav.browse", to: "/marketplace", hash: null },
    { labelKey: "nav.guarantee", to: "/guarantee", hash: null },
  ];

  const handleNav = (e, to, hash) => {
    e.preventDefault();
    setOpen(false);
    hash ? scrollTo(hash, navigate) : navigate(to);
  };

  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
        boxShadow: C.shadowSm,
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "0 20px",
          height: 64, display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 16,
        }}>
          <Logo />

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 28 }} className="wc26-nav-desktop">
            {NAV_LINKS.map(({ labelKey, to, hash }) => (
              <a key={labelKey} href="#"
                className="wc26-nav-link"
                onClick={e => handleNav(e, to, hash)}
                style={{ ...dm, fontSize: 14, fontWeight: 500 }}
              >{t(labelKey)}</a>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LangSwitcher />

            {isRegistered && isBuyer && user.name && (
              <span style={{ ...dm, fontSize: 13, fontWeight: 600, color: C.textMid }} className="wc26-hide-mobile">
                👋 {user.name.split(" ")[0]}
              </span>
            )}

            {!isRegistered && (
              <Button variant="ghost" size="sm" onClick={() => navigate("/register")} className="wc26-hide-mobile">
                {t("nav.signup")}
              </Button>
            )}

            {!isBuyer && (
              <button
                onClick={() => setShowSell(true)}
                className="wc26-hide-mobile wc26-sell-btn"
                style={{ ...dm }}
              >
                {t("nav.sell")}
              </button>
            )}

            <button
              className="wc26-show-mobile"
              onClick={() => setOpen(o => !o)}
              style={{ background: "none", border: "none", cursor: "pointer", color: C.textMid, padding: 4 }}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div style={{
            borderTop: `1px solid ${C.border}`, background: C.bgCard,
            padding: "12px 20px 20px", display: "flex", flexDirection: "column", gap: 4,
          }}>
            {!isBuyer && (
              <Button
                variant="primary" size="lg" full
                onClick={() => { setOpen(false); setShowSell(true); }}
                style={{ marginBottom: 8 }}
              >
                {t("nav.sell")}
              </Button>
            )}

            {NAV_LINKS.map(({ labelKey, to, hash }) => (
              <a key={labelKey} href="#" className="wc26-nav-link"
                onClick={e => handleNav(e, to, hash)}
                style={{ fontSize: 15, fontWeight: 500, padding: "10px 0", borderBottom: `1px solid ${C.border}`, display: "block" }}>
                {t(labelKey)}
              </a>
            ))}

            {!isRegistered && (
              <Button
                variant="secondary" size="lg" full
                onClick={() => { setOpen(false); navigate("/register"); }}
                style={{ marginTop: 12 }}
              >
                {t("nav.signup")}
              </Button>
            )}
          </div>
        )}
      </header>

      {showSell && <SellModal onClose={() => setShowSell(false)} />}
    </>
  );
}
