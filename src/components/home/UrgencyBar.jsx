import { useMemo } from "react";
import { C, dm } from "../../tokens";
import { useSchedule } from "../../context/MatchScheduleContext";
import { useUrgency } from "../../hooks/useUrgency";
import { labelTeam } from "../../data";
import { useI18n } from "../../context/I18nContext";

function hourlyViewers() {
  const h = new Date().getHours();
  const base = [22,18,15,13,11,12,16,24,34,42,48,51,53,54,52,55,57,58,56,53,49,44,38,30][h];
  return base + ((h * 7 + 3) % 9);
}

export default function UrgencyBar() {
  const { liveMatches } = useSchedule();
  const urgencies       = useUrgency(liveMatches);
  const { t } = useI18n();

  const scarce = useMemo(() =>
    liveMatches
      .map((m, i) => ({ match: m, urgency: urgencies[i] }))
      .filter(({ urgency }) => urgency && urgency.tickets <= 3)
      .slice(0, 2),
    [liveMatches, urgencies]
  );

  const viewers = hourlyViewers();
  if (liveMatches.length === 0) return null;

  const alerts = scarce.map(({ match, urgency }) => {
    const key = urgency.tickets === 1 ? "urgency.left" : "urgency.left_plural";
    return `${labelTeam(match.home)} vs ${labelTeam(match.away)} (${match.date}) — ${t(key, { n: urgency.tickets })}`;
  });

  const alertText = alerts.length > 0
    ? alerts.join(". ") + "."
    : t("urgency.available", { n: liveMatches.length });

  return (
    <div style={{ background: C.warnBg, borderBottom: `1px solid ${C.warnBorder}`, padding: "11px 20px" }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 10, fontSize: 13, fontWeight: 600, color: C.warnText,
        flexWrap: "wrap", textAlign: "center", ...dm,
      }}>
        <span style={{ fontSize: 16 }}>🔥</span>
        <strong>{t("urgency.high")}</strong> <span style={{ wordBreak: "break-word" }}>{alertText}</span>
        <span>·</span>
        <strong>{t("urgency.browsing", { n: viewers })}</strong>
      </div>
    </div>
  );
}
