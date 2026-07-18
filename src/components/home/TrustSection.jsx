import { CheckCircle, Lock, ShieldCheck, BadgeCheck, Star, Shield } from "lucide-react";
import { C, sora, dm } from "../../tokens";
import { TESTIMONIALS, PAYMENT_METHODS, timeAgo } from "../../data";
import { useI18n } from "../../context/I18nContext";

export default function TrustSection() {
  const { t } = useI18n();

  const TRUST_CARDS = [
    { Icon: Lock,        tile: "wc26-icon-tile-blue",  titleKey: "trust.card1.title", bodyKey: "trust.card1.body", statKey: "trust.card1.stat", lblKey: "trust.card1.lbl" },
    { Icon: ShieldCheck, tile: "wc26-icon-tile-blue",  titleKey: "trust.card2.title", bodyKey: "trust.card2.body", statKey: "trust.card2.stat", lblKey: "trust.card2.lbl" },
    { Icon: BadgeCheck,  tile: "wc26-icon-tile-green", titleKey: "trust.card3.title", bodyKey: "trust.card3.body", statKey: "trust.card3.stat", lblKey: "trust.card3.lbl" },
  ];

  return (
    <section id="trust" style={{ background: C.bg, padding: "clamp(40px,8vw,72px) 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px,5vw,20px)" }}>

        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.blue, marginBottom: 8, ...dm }}>
            <Shield size={12} /> {t("trust.label")}
          </div>
          <h2 style={{ ...sora, fontWeight: 800, fontSize: "clamp(22px,4vw,36px)", letterSpacing: "-0.03em", color: C.text, lineHeight: 1.1, marginBottom: 10 }}>{t("trust.title")}</h2>
          <p style={{ fontSize: "clamp(13px,3vw,16px)", color: C.textSoft, lineHeight: 1.6, ...dm }}>{t("trust.body")}</p>
        </div>

        <div style={{ marginBottom: 32 }} className="wc26-trust-grid">
          {TRUST_CARDS.map(card => (
            <div key={card.titleKey} className="wc26-card" style={{ padding: "clamp(16px,4vw,28px) clamp(14px,3vw,24px)", boxShadow: C.shadowSm }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <div className={`wc26-icon-tile ${card.tile}`} style={{ width: 46, height: 46 }}>
                  <card.Icon size={22} strokeWidth={2.2} />
                </div>
                <h3 style={{ ...sora, fontSize: "clamp(14px,2.5vw,18px)", fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{t(card.titleKey)}</h3>
              </div>
              <p style={{ fontSize: "clamp(12px,2vw,14px)", color: C.textSoft, lineHeight: 1.65, marginBottom: 16, ...dm }}>{t(card.bodyKey)}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                <div style={{ ...sora, fontSize: "clamp(22px,4vw,28px)", fontWeight: 800, color: C.text, letterSpacing: "-0.03em", lineHeight: 1, flexShrink: 0 }}>{t(card.statKey)}</div>
                <div style={{ fontSize: "clamp(11px,1.8vw,13px)", color: C.textSoft, lineHeight: 1.3, ...dm }}>{t(card.lblKey)}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 32 }} className="wc26-trust-grid">
          {TESTIMONIALS.map(t2 => (
            <div key={t2.name} className="wc26-card" style={{ padding: "clamp(14px,3vw,22px)", boxShadow: C.shadowSm }}>
              <div style={{ display: "flex", gap: 2, color: C.gold, marginBottom: 8 }}>
                {Array.from({ length: t2.stars }).map((_, i) => (
                  <Star key={i} size={13} fill={C.gold} strokeWidth={0} />
                ))}
              </div>
              <p style={{ fontSize: "clamp(12px,2vw,14px)", color: C.textMid, lineHeight: 1.7, marginBottom: 14, fontStyle: "italic", ...dm }}>"{t2.quote}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: t2.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0, ...sora }}>{t2.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, ...dm }}>{t2.name}</div>
                  <div style={{ fontSize: 11, color: C.textSoft, ...dm }}>{t2.location} · {timeAgo(t2.purchasedAt)}</div>
                </div>
                {t2.verifiedPurchase && (
                  <div className="wc26-pill-success"
                    style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "3px 8px", flexShrink: 0, ...dm }}>
                    <CheckCircle size={10} /> {t("trust.verified")}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textSoft, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 14, ...dm }}>{t("trust.payment")}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            {PAYMENT_METHODS.map(p => (
              <div key={p} style={{ padding: "7px 14px", fontSize: 12, fontWeight: 700, color: C.textMid, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, ...dm }}>{p}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
