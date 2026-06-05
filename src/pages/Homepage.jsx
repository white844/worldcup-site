import { useEffect } from "react";
import PageShell       from "../components/PageShell";
import Hero            from "../components/home/Hero";
import UrgencyBar      from "../components/home/UrgencyBar";
import FeaturedMatches from "../components/home/FeaturedMatches";
import LiveActivity    from "../components/home/LiveActivity";
import TrendingCities  from "../components/home/TrendingCities";
import TrustSection    from "../components/home/TrustSection";
import GuaranteeBanner from "../components/home/GuaranteeBanner";
import { SignUpNudgeBanner } from "./Register";
import { setPageMeta, SITE_TITLE } from "../tokens";


export default function Homepage() {
  useEffect(() => setPageMeta(SITE_TITLE, "Buy verified World Cup 2026 tickets. Every listing manually reviewed. 100% buyer protection on every order."), []);
  return (
    <PageShell>
      <Hero />
      <UrgencyBar />
      {/* Trust section: bottom on mobile (compact badges in TrustSection handle this), full cards on desktop */}
      <div className="wc26-trust-desktop"><TrustSection /></div>
      <FeaturedMatches />
      <LiveActivity />
      <TrendingCities />
      <div className="wc26-trust-mobile"><TrustSection /></div>
      <SignUpNudgeBanner />
      <GuaranteeBanner />
    </PageShell>
  );
}
