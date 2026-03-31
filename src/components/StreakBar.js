import { getWeekDates, getTodayStr } from "../hooks/useStorage";
import { WORKOUT_PLAN } from "../data/workouts";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function WeekBar({ weekKey, allSessions, allExercises }) {
  const weekDates  = getWeekDates(weekKey);
  const todayStr   = getTodayStr();
  const todayIndex = weekDates.indexOf(todayStr);
  const sessions   = allSessions[weekKey] || {};

  return (
    <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
      {weekDates.map((dateStr, i) => {
        const day         = WORKOUT_PLAN[i];
        const isToday     = i === todayIndex;
        const isFuture    = i > todayIndex && todayIndex !== -1;
        const session     = sessions[`day${i + 1}`] || {};
        const isDone      = session.state === "finished";
        // Partial: any exercise checked
        const dayExercises = ((allExercises[weekKey] || {})[`day${i + 1}`]) || {};
        const hasAny      = Object.values(dayExercises).some(Boolean);

        return (
          <div key={dateStr} style={{ flex: 1, textAlign: "center" }}>
            <div style={{
              height: 5, borderRadius: 3,
              background: isDone
                ? (day?.color || "#4ECDC4")
                : hasAny ? `${day?.color || "#4ECDC4"}60`
                : isToday ? "#2a2a3a"
                : "#161622",
              border: isToday && !isDone ? `1px solid ${day?.color || "#4ECDC4"}60` : "none",
              transition: "background 0.4s",
              boxShadow: isDone ? `0 0 8px ${day?.color || "#4ECDC4"}55` : "none",
            }} />
            <div style={{
              fontSize: 10, marginTop: 5, fontWeight: isToday ? 700 : 400,
              color: isToday ? (day?.color || "#4ECDC4") : isFuture ? "#1e1e2e" : "#374151",
            }}>
              {DAY_LABELS[i]}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function StreakBadge({ streakData }) {
  const { current, longest } = streakData;
  const isOnFire = current > 0;

  return (
    <div style={{ textAlign: "right" }}>
      <div style={{
        fontSize: 30, fontWeight: 900,
        color: isOnFire ? "#FF6B35" : "#2d2d40",
        fontFamily: "'Syne', sans-serif",
        lineHeight: 1,
        animation: isOnFire ? "pulse 2s infinite" : "none",
        display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end",
      }}>
        <span>🔥</span>
        <span>{current}</span>
      </div>
      <div style={{ fontSize: 10, color: "#4B5563", marginTop: 4 }}>
        Best {longest} · streak
      </div>
    </div>
  );
}
