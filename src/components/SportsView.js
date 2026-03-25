import { SPORTS_ACTIVITIES } from "../data/workouts";
import { getTodayStr, getWeekDates } from "../hooks/useStorage";

export default function SportsView({ completedSports, onToggle }) {
  const todayStr = getTodayStr();
  const weekDates = getWeekDates();

  // Count per sport this week
  const weekCounts = {};
  SPORTS_ACTIVITIES.forEach(s => {
    weekCounts[s.id] = weekDates.filter(d =>
      completedSports[`${d}-${s.id}`]
    ).length;
  });

  // Group for weekly summary (swimming needs 2 sessions)
  const summaryItems = [
    { label: "🏓 Pickleball", ids: ["pickleball"], target: 1 },
    { label: "🏏 Cricket",    ids: ["cricket"],    target: 1 },
    { label: "🏊 Swimming",   ids: ["swim1","swim2"], target: 2 },
  ];

  return (
    <div style={{ animation: "slideUp 0.3s ease" }}>
      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 16, fontWeight: 500 }}>
        Tap to mark today's session done
      </div>

      {SPORTS_ACTIVITIES.map(sport => {
        const key = `${todayStr}-${sport.id}`;
        const done = !!completedSports[key];
        return (
          <div key={sport.id} onClick={() => onToggle(sport.id)}
            style={{
              background: done ? `${sport.color}18` : "#111118",
              border: `1px solid ${done ? sport.color + "60" : "#1e1e2e"}`,
              borderRadius: 16, padding: "18px 20px", marginBottom: 10,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 16,
              transition: "all 0.2s",
              boxShadow: done ? `0 0 20px ${sport.color}22` : "none",
            }}>
            <div style={{ fontSize: 34 }}>{sport.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e8e8f0" }}>{sport.name}</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>Target: {sport.freq}</div>
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: done ? sport.color : "#1e1e2e",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 700, color: done ? "#000" : "#374151",
              transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
              boxShadow: done ? `0 0 12px ${sport.color}88` : "none",
            }}>
              {done ? "✓" : "○"}
            </div>
          </div>
        );
      })}

      {/* Weekly summary */}
      <div style={{ marginTop: 24, background: "#111118", borderRadius: 16, padding: 16, border: "1px solid #1e1e2e" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#4B5563", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
          This Week
        </div>
        {summaryItems.map(s => {
          const completed = s.ids.reduce((sum, id) => sum + (weekCounts[id] || 0), 0);
          const capped = Math.min(completed, s.target);
          return (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 14, color: "#9CA3AF" }}>{s.label}</span>
              <div style={{ display: "flex", gap: 6 }}>
                {Array.from({ length: s.target }).map((_, i) => (
                  <div key={i} style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: i < capped ? "#10B981" : "#1e1e2e",
                    fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
                    color: i < capped ? "#000" : "#374151",
                    fontWeight: 700,
                    transition: "background 0.3s",
                    boxShadow: i < capped ? "0 0 8px #10B98166" : "none",
                  }}>
                    {i < capped ? "✓" : ""}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Knee warning */}
      <div style={{ marginTop: 14, padding: "12px 16px", background: "#0f1923", borderRadius: 12, border: "1px solid #1e3a5f" }}>
        <div style={{ fontSize: 11, color: "#3B82F6", fontWeight: 700, marginBottom: 5 }}>⚠️ KNEE PROTOCOL</div>
        <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>
          Before cricket & pickleball: 5 min clamshells + lateral band walks.
          Avoid explosive lateral cuts when knee is flaring.
        </div>
      </div>
    </div>
  );
}
