/**
 * App.jsx — Application root
 */
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer, useToastSetup } from "./components/Toast";
import { GLOBAL_CSS } from "./tokens";
import Homepage    from "./pages/Homepage";
import Marketplace from "./pages/Marketplace";
import TicketDetail from "./pages/TicketDetail";
import Register    from "./pages/Register";
import Guarantee   from "./pages/Guarantee";
import NotFound    from "./pages/NotFound";
import { MatchScheduleProvider } from "./context/MatchScheduleContext";
import { UserProvider } from "./context/UserContext";
import { I18nProvider } from "./context/I18nContext";

// Inject Ticketeer SVG favicon into <head>
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="9" fill="#1B3C88"/>
  <rect x="6" y="10" width="36" height="8" rx="2" fill="white"/>
  <polygon points="26,18 34,18 30,42 22,42" fill="white"/>
  <polygon points="14,28 48,12 48,20 14,36" fill="white" opacity="0.18"/>
  <circle cx="37" cy="36" r="10" fill="#16A34A"/>
  <polyline points="31,36 35,40 43,30" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

function injectFavicon() {
  const svgUrl = "data:image/svg+xml," + encodeURIComponent(FAVICON_SVG);

  // Primary: SVG favicon (all modern browsers)
  let svgLink = document.querySelector("link[rel~='icon'][type='image/svg+xml']");
  if (!svgLink) {
    svgLink = document.createElement("link");
    svgLink.rel = "icon";
    svgLink.type = "image/svg+xml";
    document.head.appendChild(svgLink);
  }
  svgLink.href = svgUrl;

  // Fallback: rasterise to 32×32 PNG for Safari < 15
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 32, 32);
      let pngLink = document.querySelector("link[rel~='icon'][type='image/png']");
      if (!pngLink) {
        pngLink = document.createElement("link");
        pngLink.rel = "icon";
        pngLink.type = "image/png";
        document.head.appendChild(pngLink);
      }
      pngLink.href = canvas.toDataURL("image/png");
    };
    img.src = svgUrl;
  } catch (_) { /* canvas blocked in some sandboxed envs — SVG fallback is fine */ }
}
injectFavicon();

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Save scroll position when leaving the marketplace
    return () => {
      if (pathname === "/marketplace") {
        try { sessionStorage.setItem("ticketeer_mkt_scroll", String(window.scrollY)); } catch {}
      }
    };
  }, [pathname]);

  useEffect(() => {
    // Restore scroll when returning to marketplace, reset everywhere else
    if (pathname === "/marketplace") {
      try {
        const saved = sessionStorage.getItem("ticketeer_mkt_scroll");
        if (saved) {
          requestAnimationFrame(() => window.scrollTo(0, parseInt(saved, 10)));
          return;
        }
      } catch {}
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppInner() {
  const { toasts, dismiss } = useToastSetup();
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <ScrollToTop />
      <Routes>
        <Route path="/"                     element={<Homepage />}    />
        <Route path="/marketplace"          element={<Marketplace />} />
        <Route path="/marketplace/:matchId" element={<TicketDetail />} />
        <Route path="/register"             element={<Register />}    />
        <Route path="/guarantee"            element={<Guarantee />}   />
        <Route path="*"                     element={<NotFound />}    />
      </Routes>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <UserProvider>
          <MatchScheduleProvider>
            <AppInner />
          </MatchScheduleProvider>
        </UserProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}

