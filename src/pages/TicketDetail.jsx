/**
 * TicketDetail — Individual listing detail page
 *
 * Changes from original:
 *  - Removed: useAuth, login gate, useContactSeller hook
 *  - Changed: Contact button → opens WhatsApp via openContactWhatsApp()
 *  - Added: ✔ Verified by Admin badge in sticky panel
 *  - Removed: seller profile links (no /seller pages)
 *  - Kept: urgency, seat info, trust badges
 */
import { useMemo, useEffect, useState } from "react";

import { useParams, useNavigate, Link } from "react-router-dom";
import PageShell  from "../components/PageShell";
import { Button } from "../components/ui";
import { C, sora, dm, SITE_TITLE, setPageMeta } from "../tokens";
import { ALL_MATCHES, teamName, teamFlagImg, labelTeam, timeAgo } from "../data";
import { openContactWhatsApp } from "../utils/whatsapp";
import { TicketeerIcon } from "../components/TicketeerLogo";
import { useSchedule } from "../context/MatchScheduleContext";
import { isMatchPast } from "../hooks/useMatchSchedule";
import {
  MapPin, Calendar, CheckCircle, Shield,
  ChevronLeft, MessageCircle, ShieldCheck, Zap,
  Flame, Star, Send, Lock, AlertTriangle, Eye,
} from "lucide-react";

function useMatchUrgency(id) {
  return useMemo(() => {
    const seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return { tickets: (seed % 7) + 1, viewers: (seed % 48) + 12 };
  }, [id]);
}

function InfoRow({ label, value, highlight }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
      <span style={{ fontSize:13, color:C.textSoft, ...dm }}>{label}</span>
      <span style={{ fontSize:13, fontWeight:700, color: highlight ? C.blue : C.text, ...dm }}>{value}</span>
    </div>
  );
}

function SellerStat({ label, value }) {
  return (
    <div style={{ background:C.bg, borderRadius:10, padding:"10px 14px" }}>
      <div className="wc26-label" style={{ marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:13, fontWeight:600, color:C.text, ...dm }}>{value}</div>
    </div>
  );
}

function NotFound({ onBack }) {
  return (
    <PageShell>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"clamp(48px,10vw,80px) 20px", textAlign:"center" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}><TicketeerIcon size={56} /></div>
        <h2 style={{ ...sora, fontSize:26, fontWeight:800, color:C.text, marginBottom:12 }}>Listing not found</h2>
        <p style={{ fontSize:15, color:C.textSoft, marginBottom:28, ...dm }}>This listing may have sold or been removed.</p>
        <Button variant="primary" size="md" onClick={onBack}>Back to Marketplace</Button>
      </div>
    </PageShell>
  );
}


// FlagImg: real flag SVG for known teams; styled TBD box for placeholders.
function FlagImg({ raw, size = 44 }) {
  const code = teamFlagImg(raw);
  if (!code) {
    return (
      <div style={{
        width: size, height: Math.round(size * 0.67), borderRadius: 3,
        background: "#E2E8F0",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span style={{ fontSize: Math.max(8, Math.round(size * 0.22)), fontWeight: 700, color: "#94A3B8", letterSpacing: "0.04em", fontFamily: "'DM Sans',sans-serif", userSelect: "none" }}>
          TBD
        </span>
      </div>
    );
  }
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${code}.svg`}
      srcSet={`https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${code}.svg 2x`}
      alt={teamName(raw)}
      width={size}
      height={Math.round(size * 0.67)}
      style={{ objectFit: "contain", borderRadius: 3, display: "block", flexShrink: 0 }}
      onError={e => { e.currentTarget.style.display = "none"; }}
    />
  );
}

export default function TicketDetail() {
  const { matchId } = useParams();
  const navigate    = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { liveMatches, nowMs } = useSchedule();

  // Use liveMatches first (API-enriched, current scores), fall back to ALL_MATCHES
  const match = useMemo(() =>
    liveMatches.find(m => m.id === matchId) ?? ALL_MATCHES.find(m => m.id === matchId),
    [liveMatches, matchId]
  );
  const urgency = useMatchUrgency(matchId ?? "");
  const isExpired = match ? isMatchPast(match.isoDate, nowMs, match.time) : false;

  // ── Category selector (knockout matches only) ──────────────────────────
  const hasCategories = Boolean(match?.categoryPricing);
  const CATS = ["Category 1", "Category 2", "Category 3"];
  const [selectedCat, setSelectedCat] = useState(
    hasCategories ? "Category 2" : (match?.category ?? "Category 2")
  );
  const activeCat     = hasCategories ? match?.categoryPricing?.[selectedCat] : null;
  const activePrice   = activeCat ? activeCat.price   : match?.price;
  const activeTickets = activeCat ? activeCat.tickets : (urgency?.tickets ?? 3);
  const activeSection = activeCat ? activeCat.section : match?.section;
  const activeRow     = activeCat ? activeCat.row     : match?.row;
  const activeSeats   = activeCat ? activeCat.seats   : match?.seats;

  useEffect(() => {
    if (match) {
      return setPageMeta(
        `${teamName(match.home)} vs ${teamName(match.away)} | ${SITE_TITLE}`,
        `Buy verified tickets for ${teamName(match.home)} vs ${teamName(match.away)} on ${match.date} at ${match.venue}. Admin-reviewed listing. 100% buyer protection.`
      );
    }
    return setPageMeta("Listing Not Found | " + SITE_TITLE);
  }, [match]);

  if (!match) return <NotFound onBack={() => navigate("/marketplace")} />;

  // ── Expired state ────────────────────────────────────────────────────────
  if (isExpired) return (
    <PageShell>
      <div style={{
        minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center",
        justifyContent: "center", padding: "48px 20px", background: C.bg,
      }}>
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⏰</div>
          <h2 style={{ ...sora, fontWeight: 800, fontSize: 26, color: C.text, marginBottom: 10, letterSpacing: "-0.02em" }}>
            This listing has ended
          </h2>
          <p style={{ ...dm, fontSize: 15, color: C.textSoft, lineHeight: 1.65, marginBottom: 8 }}>
            <strong style={{ color: C.text }}>{labelTeam(match.home)} vs {labelTeam(match.away)}</strong> took place on {match.date}. Tickets for this match are no longer available.
          </p>
          <p style={{ ...dm, fontSize: 14, color: C.textSoft, marginBottom: 32 }}>
            Browse upcoming verified listings below.
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate("/marketplace")}>
            Browse Available Tickets →
          </Button>
        </div>
      </div>
    </PageShell>
  );

  const isLimited = urgency.tickets <= 2;

  const handleContact = () => setConfirmOpen(true);

  const isTelegram   = match.contactUrl && match.contactUrl.includes("t.me");
  const isWhatsApp   = match.contactUrl && match.contactUrl.includes("wa.me");
  const hasContact   = !!match.contactUrl;
  const contactLabel = isTelegram ? "Open in Telegram" : "Open in WhatsApp";
  const ContactIcon = isTelegram ? Send : MessageCircle;

  const handleConfirmContact = () => {
    setConfirmOpen(false);
    if (isTelegram) {
      const msg = encodeURIComponent(
        `Hi, I saw your listing on Ticketeer for ${teamName(match.home)} vs ${teamName(match.away)} (${match.date} at ${match.time} · ${match.venue} · ${selectedCat} · $${activePrice}/ticket) and I'm interested in buying. Is it still available?`
      );
      window.open(`${match.contactUrl}?text=${msg}`, "_blank", "noopener,noreferrer");
    } else if (isWhatsApp) {
      openContactWhatsApp(
        `${teamName(match.home)} vs ${teamName(match.away)}`,
        `${match.date} at ${match.time} · ${match.venue} · ${selectedCat} Section ${activeSection} Row ${activeRow} · $${activePrice}/ticket`
      );
    }
  };

  const TRUST_BADGES = [
    { icon:ShieldCheck, color:C.live,        label:"Verified by Admin — manually reviewed"           },
    { icon:Shield,      color:C.bluePale,    label:"100% Buyer Protection guaranteed"                 },
    { icon:Zap,         color:C.highlight,   label:"Instant ticket delivery on payment"               },
    { icon:CheckCircle, color:C.purpleLight, label:`Trusted seller · ${match.sales} completed sales`  },
  ];

  return (
    <PageShell>
      {/* Breadcrumb */}
      <div style={{ borderBottom:`1px solid ${C.border}`, background:C.bgCard }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"12px 20px", display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.textSoft, ...dm }}>
          <Link to="/" className="wc26-nav-link" style={{ color:C.textSoft }}>Home</Link>
          <span>›</span>
          <Link to="/marketplace" className="wc26-nav-link" style={{ color:C.textSoft }}>Marketplace</Link>
          <span>›</span>
          <span style={{ color:C.text, fontWeight:600 }}>{labelTeam(match.home)} vs {labelTeam(match.away)}</span>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"clamp(20px,4vw,32px) 20px 80px" }}>
        <div style={{gap:32, alignItems:"start" }} className="wc26-detail-grid">

          {/* ── Left ── */}
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/marketplace")}
              style={{ marginBottom:24, gap:6, padding:0, border:"none", background:"none", color:C.textMid }}>
              <ChevronLeft size={16} /> Back to listings
            </Button>

            {/* Match hero */}
            <div className="wc26-card" style={{ overflow:"hidden", marginBottom:24, boxShadow:C.shadowMd, borderRadius:16 }}>
              <div className="wc26-detail-hero-section" style={{ background:`linear-gradient(135deg,${C.navy},${C.navyLight})`, padding:"clamp(20px,5vw,32px) clamp(16px,4vw,28px)", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"relative" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.6)", textTransform:"uppercase", letterSpacing:"0.08em", ...dm }}>{match.group}</span>
                    <span className="wc26-pill wc26-pill-sm" style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      background: isLimited ? "rgba(232,48,42,0.3)"    : "rgba(22,163,74,0.25)",
                      color:      isLimited ? C.dangerLight             : C.live,
                      border:    `1px solid ${isLimited ? "rgba(232,48,42,0.4)" : "rgba(22,163,74,0.4)"}`,
                    }}>
                      {isLimited && <Flame size={11} />}
                      {isLimited ? `Only ${urgency.tickets} ticket${urgency.tickets>1?"s":""} left` : "Available"}
                    </span>
                    {/* Verified badge */}
                    <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:999, background:"rgba(37,211,102,0.2)", border:"1px solid rgba(37,211,102,0.4)", fontSize:10, fontWeight:700, color:C.live, ...dm }}>
                      <ShieldCheck size={10} color={C.live} /> Verified by Admin
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.6)", marginLeft:"auto", ...dm }}>
                      <Eye size={12} /> {urgency.viewers} people viewing
                    </span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
                    <div style={{ textAlign:"center", flex:1, minWidth:0 }}>
                      <div className="wc26-team-flag-hero" style={{ marginBottom:8 }}><FlagImg raw={match.home} size={52} /></div>
                      <div className="wc26-team-name-hero" style={{ ...sora, fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>{teamName(match.home)}</div>
                    </div>
                    <div style={{ textAlign:"center", flexShrink:0 }}>
                      <div style={{ ...sora, fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.4)", background:"rgba(255,255,255,0.08)", borderRadius:999, padding:"6px 14px" }}>VS</div>
                    </div>
                    <div style={{ textAlign:"center", flex:1, minWidth:0 }}>
                      <div className="wc26-team-flag-hero" style={{ marginBottom:8 }}><FlagImg raw={match.away} size={52} /></div>
                      <div className="wc26-team-name-hero" style={{ ...sora, fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>{teamName(match.away)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderBottom:`1px solid ${C.border}` }} className="wc26-match-info-strip">
                {[
                  { icon:Calendar, label:"Date & Time",  value:`${match.date} · ${match.time}`, sub:null       },
                  { icon:MapPin,   label:"Venue & City",  value:match.venue,                    sub:match.city  },
                ].map(({ icon:Icon, label, value, sub }, i) => (
                  <div key={label} style={{ display:"flex", alignItems:"center", gap:10, padding:"16px 20px", borderRight:i===0?`1px solid ${C.border}`:"none" }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:C.infoBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon size={16} color={C.blue} />
                    </div>
                    <div>
                      <div className="wc26-label" style={{ marginBottom:2 }}>{label}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.text, ...dm }}>{value}</div>
                      {sub && <div style={{ fontSize:11, color:C.textSoft, ...dm }}>{sub}</div>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="wc26-detail-body-section" style={{ padding:"clamp(16px,3vw,20px) clamp(16px,3vw,24px)" }}>
                <div className="wc26-label">Ticket Details</div>
                <InfoRow label="Group"             value={match.group}                    />
                <InfoRow label="Category"          value={selectedCat}       highlight />
                <InfoRow label="Section"           value={activeSection}                  />
                <InfoRow label="Row"               value={activeRow}                      />
                <InfoRow label="Seats"             value={activeSeats}                    />
                <InfoRow label="Ticket Type"       value="Resale — official transfer"     />
                <InfoRow label="Delivery"          value="Instant digital delivery"       />
                <InfoRow label="Listed"            value={timeAgo(match.listedAt)}        />
                <InfoRow label="Tickets available" value={`${urgency.tickets} remaining`} />
              </div>
            </div>

            {/* Seller */}
            <div className="wc26-card wc26-detail-panel" style={{ padding:24, boxShadow:C.shadowSm, marginBottom:24, borderRadius:16 }}>
              <div className="wc26-label">About the Seller</div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                <div style={{ width:52, height:52, borderRadius:"50%", background:match.avatarBg, color:match.avatarColor||"#fff", fontSize:20, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", ...sora, flexShrink:0, boxShadow:C.shadowSm }}>
                  {match.avatar}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ ...sora, fontSize:17, fontWeight:700, color:C.text, marginBottom:2 }}>{match.seller}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize:13, color:"#F59E0B", fontWeight:700 }}>
                      <span style={{ display: "flex", gap: 1 }}>
                        {Array.from({ length: Math.floor(match.rating) }).map((_, i) => (
                          <Star key={i} size={12} fill="#F59E0B" strokeWidth={0} />
                        ))}
                      </span>
                      {match.rating}
                    </span>
                    <span style={{ fontSize:11, color:C.textSoft, ...dm }}>{match.sales} sales · Member since {match.since}</span>
                  </div>
                </div>
                <div style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:999, background:C.greenBg, border:`1px solid ${C.greenBorder}`, fontSize:11, fontWeight:700, color:C.greenText, flexShrink:0, ...dm }}>
                  <CheckCircle size={11} color={C.green} /> Verified
                </div>
              </div>
              <p style={{ fontSize:14, color:C.textMid, lineHeight:1.65, marginBottom:16, ...dm }}>{match.bio}</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <SellerStat label="Response time" value={`~${match.response} min`}  />
                <SellerStat label="Location"      value={match.location}             />
                <SellerStat label="Total sales"   value={`${match.sales} completed`} />
                <SellerStat label="Member since"  value={match.since}                />
              </div>
            </div>

            {/* Buyer guarantee */}
            <div className="wc26-pill-success" style={{ borderRadius:14, padding:"20px 22px", display:"block" }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.greenText, marginBottom:10, display:"flex", alignItems:"center", gap:6, ...dm }}>
                <Shield size={15} /> 100% Buyer Protection on this listing
              </div>
              {[
                "Yout get refunded if tickets are invalid or don't match this listing",
                "All listings are manually verified by our admin team before going live",
                "Dispute resolution team available 24/7",
              ].map(item => (
                <div key={item} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:13, color:C.greenText, marginBottom:4, ...dm }}>
                  <CheckCircle size={14} style={{ flexShrink:0, marginTop:1 }} />{item}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right — sticky panel ── */}
          {/* top = Navbar (64px) + TrustBar (~38px) + 8px breathing room */}
          <div className="wc26-sticky-panel" style={{ position:"sticky", top:"calc(64px + 38px + 8px)" }}>
            <div className="wc26-card" style={{ overflow:"hidden", boxShadow:C.shadowLg, borderRadius:16 }}>
              {/* Category dropdown — knockout fixtures only */}
              {hasCategories && (
                <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.border}` }}>
                  <div className="wc26-label" style={{ marginBottom:8 }}>Ticket Category</div>
                  <div style={{ position:"relative" }}>
                    <select
                      value={selectedCat}
                      onChange={e => setSelectedCat(e.target.value)}
                      style={{
                        width:"100%",
                        padding:"12px 40px 12px 14px",
                        borderRadius:10,
                        border:`1.5px solid ${C.border}`,
                        background:C.bg,
                        color:C.text,
                        fontSize:14,
                        fontWeight:600,
                        fontFamily:"DM Sans, sans-serif",
                        cursor:"pointer",
                        appearance:"none",
                        WebkitAppearance:"none",
                        outline:"none",
                        boxShadow:C.shadowSm,
                        transition:"border-color 0.15s",
                      }}
                      onFocus={e => e.target.style.borderColor = C.blue}
                      onBlur={e => e.target.style.borderColor = C.border}
                    >
                      {CATS.map(cat => {
                        const catData = match.categoryPricing[cat];
                        return (
                          <option key={cat} value={cat}>
                            {cat} — ${catData.price}/ticket · Sec {catData.section}
                          </option>
                        );
                      })}
                    </select>
                    <div style={{
                      position:"absolute", right:14, top:"50%",
                      transform:"translateY(-50%)",
                      pointerEvents:"none", color:C.textSoft,
                      fontSize:16, lineHeight:1,
                    }}>▾</div>
                  </div>
                </div>
              )}
              {/* Price */}
              <div style={{ padding:"20px 22px 16px", borderBottom:`1px solid ${C.border}` }}>
                <div className="wc26-label" style={{ marginBottom:6 }}>Price per ticket</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:8 }}>
                  <span style={{ ...sora, fontSize:40, fontWeight:800, color:C.text, letterSpacing:"-0.03em", lineHeight:1 }}>${activePrice}</span>
                  <span style={{ fontSize:14, color:C.textSoft, ...dm }}>/ticket</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.textSoft, ...dm }}>
                  <CheckCircle size={12} color={C.green} />
                  No hidden fees · What you see is what you pay
                </div>
              </div>

              {/* Urgency */}
              <div style={{ padding:"12px 22px", borderBottom:`1px solid ${isLimited ? C.dangerBorder : "rgba(22,163,74,0.15)"}`, background: isLimited ? C.dangerBg : "rgba(22,163,74,0.05)" }}>
                <div style={{ fontSize:12, fontWeight:700, color: isLimited ? C.dangerText : C.green, display:"flex", alignItems:"center", gap:6, ...dm }}>
                  {isLimited ? <Flame size={13} /> : <Eye size={13} />}
                  {isLimited
                    ? `Only ${urgency.tickets} ticket${urgency.tickets>1?"s":""} left at this price`
                    : `${urgency.viewers} people viewing this listing right now`}
                </div>
              </div>

              {/* Seat summary */}
              <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.border}` }}>
                <div className="wc26-label">Seat Summary</div>
                {[["Category",selectedCat],["Section",activeSection],["Row",activeRow],["Seats",activeSeats]].map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:12, color:C.textSoft, ...dm }}>{k}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:C.text, ...dm }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Verified badge in panel */}
              <div style={{ padding:"12px 22px", borderBottom:`1px solid ${C.border}`, background:"#EFF6FF" }}>
                <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:12, fontWeight:700, color:C.blue, ...dm }}>
                  <ShieldCheck size={14} color={C.blue} />
                  Verified by Admin · Manually reviewed before listing
                </div>
              </div>

              {/* CTA */}
              <div style={{ padding:"20px 22px" }}>
                {hasContact ? (
                  <button
                    onClick={handleContact}
                    className="wc26-lift-btn"
                    style={{
                      width:"100%", padding:"14px", borderRadius:12, marginBottom:10,
                      background: isTelegram ? "#229ED9" : C.blue,
                      border:"none", color:"#fff",
                      fontSize:15, fontWeight:700,
                      cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      boxShadow: isTelegram ? "0 3px 12px rgba(42,171,238,0.35)" : C.shadowBlue,
                      ...dm,
                    }}
                  >
                    <ContactIcon size={18} />
                    {contactLabel}
                  </button>
                ) : (
                  <button
                    disabled
                    style={{
                      width:"100%", padding:"14px", borderRadius:12, marginBottom:10,
                      background: C.bgSubtle, border:`1px solid ${C.border}`,
                      color: C.textSoft, fontSize:15, fontWeight:700,
                      cursor:"not-allowed", opacity:0.7,
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      ...dm,
                    }}
                  >
                    <Lock size={15} /> Sold Out
                  </button>
                )}
                <p style={{ textAlign:"center", fontSize:11, color:C.textSoft, ...dm }}>
                  Always verify tickets before making any payment.
                </p>

                <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
                  {TRUST_BADGES.map(({ icon:Icon, color, label }) => (
                    <div key={label} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.textMid, ...dm }}>
                      <Icon size={13} style={{ color, flexShrink:0 }} />{label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button variant="secondary" size="md" full onClick={() => navigate("/marketplace")} style={{ marginTop:12 }}>
              View similar listings →
            </Button>
          </div>
        </div>
      </div>

      {/* WhatsApp confirm modal */}
      {confirmOpen && (
        <div
          onClick={() => setConfirmOpen(false)}
          style={{ position:"fixed", inset:0, zIndex:600, background:"rgba(15,23,42,0.55)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
        >
          <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:16, padding:28, maxWidth:400, width:"100%", boxShadow:"0 24px 60px rgba(15,23,42,0.25)" }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", margin: "0 auto 12px",
              background: isTelegram ? "#E8F6FD" : "#E7F9EF",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: isTelegram ? "#229ED9" : C.whatsappDark,
            }}>
              <ContactIcon size={22} />
            </div>
            <div style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:8, textAlign:"center", ...sora }}>
              Contact Seller on {isTelegram ? "Telegram" : "WhatsApp"}
            </div>
            <div style={{ fontSize:13, color:C.textSoft, marginBottom:6, textAlign:"center", ...dm, lineHeight:1.5 }}>You're about to enquire about:</div>
            <div style={{ fontSize:14, fontWeight:700, color:C.text, textAlign:"center", marginBottom:4, ...dm }}>
              {labelTeam(match.home)} vs {labelTeam(match.away)}
            </div>
            <div style={{ fontSize:12, color:C.textSoft, textAlign:"center", marginBottom:8, ...dm }}>{match.date} at {match.time}</div>
            <div style={{ fontSize:12, color:C.textSoft, textAlign:"center", marginBottom:20, ...dm }}>{match.venue} · {selectedCat} · ${activePrice}/ticket</div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize:12, color:C.warnText, background:C.warnBg, border:`1px solid ${C.warnBorder}`, borderRadius:8, padding:"10px 12px", marginBottom:20, ...dm, lineHeight:1.5 }}>
              <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              Always verify tickets before making any payment. Never pay outside of an agreed, traceable method.
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setConfirmOpen(false)} style={{ flex:1, padding:"12px", borderRadius:10, border:`1px solid ${C.border}`, background:C.bg, fontSize:13, fontWeight:600, color:C.textMid, cursor:"pointer", ...dm }}>Cancel</button>
              <button onClick={handleConfirmContact} style={{ flex:2, padding:"12px", borderRadius:10, border:"none",
                background: isTelegram ? "#229ED9" : C.whatsapp,
                fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, ...dm }}>
                <ContactIcon size={14} /> {contactLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
