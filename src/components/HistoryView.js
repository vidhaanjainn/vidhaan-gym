import { useMemo } from "react";
import { WORKOUT_PLAN } from "../data/workouts";

export default function HistoryView({ history, allSports, getHistoryForRange }) {
  const days = useMemo(() => getHistoryForRange(365).reverse(), [getHistoryForRange]);

  const totalWorkouts = Object.keys(history).length;

  const thisMonthWorkouts = useMemo(() => {
    const now    = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return Object.keys(history).filter(k => k.startsWith(prefix)).length;
  }, [history]);

  const totalSportDays = useMemo(() => {
    const dates = new Set();
    Object.entries(allSports).forEach(([dateStr, sports]) => {
      if (Object.values(sports).some(Boolean)) dates.add(dateStr);
    });
    return dates.size;
  }, [allSports]);

  // Build weeks for heatmap (Mon–Sun)
  const weeks = useMemo(() => {
    const result = [];
    let week = [];
    const firstDow = days[0]
      ? new Date(days[0].date + "T00:00:00").getDay()
      : 1;
    const padStart = firstDow === 0 ? 6 : firstDow - 1;
    for (let i = 0; i < padStart; i++) week.push(null);
    days.forEach(d => {
      week.push(d);
      if (week.length === 7) { result.push(week); week = []; }
    });
    if (week.length) {
      while (week.length < 7) week.push(null);
      result.push(week);
    }
    return result;
  }, [days]);

  const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const recentSessions = Object.entries(history)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 14);

  return (
    <div style={{ animation: "slideUp 0.3s ease" }}>
      {/* Stats */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Total Gym Days",  value: totalWorkouts,     color: "#FF6B35" },
          { label: "This Month",      value: thisMonthWorkouts, color: "#A78BFA" },
          { label: "Sports / Swim",   value: totalSportDays,    color: "#10B981" },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: "#111118",
            border: "1px solid #1e1e2e", borderRadius: 14,
            padding: "14px 10px", textAlign: "center",
          }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "'Syne', sans-serif" }}>
              {s.value}
            </div>
            <div style={{ fontSize: 10, color: "#4B5563", marginTop: 4, lineHeight: 1.3 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 12, alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "#4B5563", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
          365-Day Log
        </div>
        <div style={{ display: "flex", gap: 8, marginLeft: "auto", alignItems: "center" }}>
          {[
            { color: "#FF6B35", label: "Gym" },
            { color: "#10B981", label: "Sport" },
            { color: "#FF6B3555", label: "Partial" },
            { color: "#1e1e2e", label: "Rest" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
              <span style={{ fontSize: 10, color: "#6B7280" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        <div style={{ display: "flex", gap: 3, minWidth: "max-content" }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {week.map((day, di) => {
                if (!day) return <div key={di} style={{ width: 10, height: 10 }} />;
                const bg = day.hasGym
                  ? "#FF6B35"
                  : day.hasSport
                  ? "#10B981"
                  : "#161622";
                return (
                  <div
                    key={di}
                    style={{
                      width: 10, height: 10, borderRadius: 2,
                      background: bg,
                      opacity: day.hasGym || day.hasSport ? 1 : 0.5,
                      transition: "opacity 0.2s",
                    }}
                    title={day.date}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Month labels */}
      <div style={{ display: "flex", gap: 3, marginTop: 6, overflowX: "auto" }}>
        {weeks.map((week, wi) => {
          const firstDay = week.find(d => d !== null);
          return (
            <div key={wi} style={{ width: 10, fontSize: 8, color: "#374151", whiteSpace: "nowrap", overflow: "visible" }}>
              {firstDay && wi % 5 === 0 ? MONTH_NAMES[new Date(firstDay.date + "T00:00:00").getMonth()] : ""}
            </div>
          );
        })}
      </div>

      {/* Recent sessions */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 11, color: "#4B5563", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
          Recent Sessions
        </div>
        {recentSessions.map(([dateStr, sessionData]) => {
          const day  = WORKOUT_PLAN.find(p => p.id === sessionData.dayId);
          const pct  = sessionData.pct || 0;
          const rehabPct = sessionData.rehabPct;

          return (
            <div key={dateStr} style={{
              background: "#111118", border: "1px solid #1e1e2e",
              borderRadius: 12, padding: "12px 14px", marginBottom: 8,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8f0" }}>
                    {new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 3 }}>
                    {day?.name || sessionData.dayId}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: day?.color || "#FF6B35" }}>
                    {pct}%
                  </div>
                  {rehabPct !== undefined && (
                    <div style={{ fontSize: 10, color: rehabPct >= 80 ? "#4ade80" : "#f87171", marginTop: 2 }}>
                      🩺 {rehabPct}%
                    </div>
                  )}
                </div>
              </div>

              {/* Mini progress bar */}
              <div style={{ marginTop: 8, height: 3, background: "#1a1a26", borderRadius: 2 }}>
                <div style={{
                  width: `${pct}%`, height: "100%",
                  background: day?.color || "#FF6B35",
                  borderRadius: 2,
                }} />
              </div>
            </div>
          );
        })}

        {Object.keys(history).length === 0 && (
          <div style={{ textAlign: "center", color: "#374151", fontSize: 14, padding: "30px 0" }}>
            No sessions yet. Finish your first session to log it. 💪
          </div>
        )}
      </div>
    </div>
  );
}
