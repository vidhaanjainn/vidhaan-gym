import { useMemo } from "react";
import { WORKOUT_PLAN } from "../data/workouts";

export default function HistoryView({ completedDays, completedSports, history }) {
  // Build last 365 days
  const days = useMemo(() => {
    const result = [];
    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      const hasWorkout = Object.keys(completedDays).some(k => k.startsWith(str));
      const hasSport = Object.keys(completedSports).some(k => k.startsWith(str));
      result.push({ str, hasWorkout, hasSport, month: d.getMonth(), dayOfWeek: d.getDay() });
    }
    return result;
  }, [completedDays, completedSports]);

  // Count stats
  const totalWorkouts = useMemo(() => {
    const dates = new Set();
    Object.keys(completedDays).forEach(k => {
      const parts = k.split("-");
      if (parts.length >= 3) dates.add(parts.slice(0, 3).join("-"));
    });
    return dates.size;
  }, [completedDays]);

  const totalSports = useMemo(() => {
    const dates = new Set();
    Object.keys(completedSports).filter(k => completedSports[k]).forEach(k => dates.add(k));
    return dates.size;
  }, [completedSports]);

  const thisMonthWorkouts = useMemo(() => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
    const dates = new Set();
    Object.keys(completedDays).forEach(k => {
      if (k.startsWith(prefix)) dates.add(k.slice(0, 10));
    });
    return dates.size;
  }, [completedDays]);

  // Group into weeks for the heatmap
  const weeks = useMemo(() => {
    const result = [];
    let week = [];
    // Pad start
    const firstDay = days[0].dayOfWeek === 0 ? 6 : days[0].dayOfWeek - 1;
    for (let i = 0; i < firstDay; i++) week.push(null);
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

  return (
    <div style={{ animation: "slideUp 0.3s ease" }}>
      {/* Stats row */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Total Gym Days", value: totalWorkouts, color: "#FF6B35" },
          { label: "This Month",     value: thisMonthWorkouts, color: "#A78BFA" },
          { label: "Sports / Swim",  value: totalSports,   color: "#10B981" },
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
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: "#FF6B35" }} />
            <span style={{ fontSize: 10, color: "#6B7280" }}>Gym</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: "#10B981" }} />
            <span style={{ fontSize: 10, color: "#6B7280" }}>Sport</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: "#1e1e2e" }} />
            <span style={{ fontSize: 10, color: "#6B7280" }}>Rest</span>
          </div>
        </div>
      </div>

      {/* Heatmap grid */}
      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        <div style={{ display: "flex", gap: 3, minWidth: "max-content" }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {week.map((day, di) => {
                if (!day) return <div key={di} style={{ width: 10, height: 10 }} />;
                const bg = day.hasWorkout ? "#FF6B35" : day.hasSport ? "#10B981" : "#161622";
                const opacity = day.hasWorkout || day.hasSport ? 1 : 0.6;
                return (
                  <div key={di} style={{
                    width: 10, height: 10, borderRadius: 2,
                    background: bg, opacity,
                    transition: "opacity 0.2s",
                  }} title={day.str} />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Month labels below */}
      <div style={{ display: "flex", gap: 3, marginTop: 6, overflowX: "auto" }}>
        {weeks.map((week, wi) => {
          const firstDay = week.find(d => d !== null);
          const showMonth = firstDay && firstDay.dayOfWeek === (new Date(firstDay.str + "T00:00:00").getDay() === 0 ? 0 : 1) && wi % 4 === 0;
          return (
            <div key={wi} style={{ width: 10, fontSize: 8, color: "#374151", whiteSpace: "nowrap", overflow: "visible" }}>
              {firstDay && wi % 5 === 0 ? MONTH_NAMES[firstDay.month] : ""}
            </div>
          );
        })}
      </div>

      {/* Recent workouts list */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 11, color: "#4B5563", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
          Recent Sessions
        </div>
        {Object.entries(history)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .slice(0, 14)
          .map(([dateStr, dayMap]) => (
            <div key={dateStr} style={{
              background: "#111118", border: "1px solid #1e1e2e",
              borderRadius: 12, padding: "12px 14px", marginBottom: 8,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8f0" }}>
                  {new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 3 }}>
                  {Object.keys(dayMap).map(dayId => {
                    const d = WORKOUT_PLAN.find(p => p.id === dayId);
                    return d ? d.name : dayId;
                  }).join(", ")}
                </div>
              </div>
              <div style={{ fontSize: 20 }}>✅</div>
            </div>
          ))}
        {Object.keys(history).length === 0 && (
          <div style={{ textAlign: "center", color: "#374151", fontSize: 14, padding: "30px 0" }}>
            No sessions yet. Start today 💪
          </div>
        )}
      </div>
    </div>
  );
}
