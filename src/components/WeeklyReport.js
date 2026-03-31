import { useState, useEffect } from "react";
import { getWeeklyReport } from "../services/gemini";
import { getWeekDates, getPrevWeekKey } from "../hooks/useStorage";
import { WORKOUT_PLAN } from "../data/workouts";

export default function WeeklyReport({ weekKey, allSessions, allSports, history, streakData, allLoads, onDismiss }) {
  const [report,  setReport]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateReport();
    // eslint-disable-next-line
  }, [weekKey]);

  const generateReport = async () => {
    setLoading(true);
    const weekDates  = getWeekDates(weekKey);
    const sessions   = allSessions[weekKey] || {};
    const prevWeek   = getPrevWeekKey(weekKey);
    const prevLoads  = allLoads[prevWeek] || {};
    const currLoads  = allLoads[weekKey]  || {};

    let sessionsCompleted = 0;
    let totalRehabPct = 0;
    let rehabCount = 0;
    let rehabMissedDays = 0;
    let bestSession = null;

    WORKOUT_PLAN.forEach((day, i) => {
      const session = sessions[day.id];
      if (session?.state === "finished") {
        sessionsCompleted++;
        if (session.rehabPct !== undefined) {
          totalRehabPct += session.rehabPct;
          rehabCount++;
          if (session.rehabPct < 80) rehabMissedDays++;
        }
        if (!bestSession || session.pct > bestSession.pct) {
          bestSession = { dayName: day.name, pct: session.pct };
        }
      }
    });

    const avgRehabPct = rehabCount > 0 ? Math.round(totalRehabPct / rehabCount) : 0;

    // Load PRs
    const loadPRs = [];
    Object.entries(currLoads).forEach(([dayId, dayLoads]) => {
      Object.entries(dayLoads).forEach(([exId, load]) => {
        const prev = (prevLoads[dayId] || {})[exId];
        if (load && prev && load.weight > prev.weight) {
          const day  = WORKOUT_PLAN.find(d => d.id === dayId);
          const ex   = day?.sections.flatMap(s => s.exercises).find(e => e.id === exId);
          const changePct = Math.round(((load.weight - prev.weight) / prev.weight) * 100);
          if (ex) loadPRs.push({ name: ex.name, weight: load.weight, reps: load.reps, prevWeight: prev.weight, changePct });
        }
      });
    });

    // Sports
    const sportsSummary = {};
    weekDates.forEach(dateStr => {
      const sports = allSports[dateStr] || {};
      Object.entries(sports).forEach(([id, done]) => {
        if (done) sportsSummary[id] = (sportsSummary[id] || 0) + 1;
      });
    });

    try {
      const text = await getWeeklyReport({
        weekKey,
        sessionsCompleted,
        totalSessions: 6,
        streakCurrent: streakData.current,
        streakLongest: streakData.longest,
        loadPRs,
        avgRehabPct,
        rehabMissedDays,
        sportsSummary,
        bestSession,
      });
      setReport(text);
    } catch (e) {
      setReport(`Week wrapped. ${sessionsCompleted}/6 sessions completed. ${avgRehabPct}% avg rehab compliance.`);
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9998,
      background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "flex-end",
      animation: "slideUp 0.3s ease",
    }}>
      <div style={{
        width: "100%", maxWidth: 480, margin: "0 auto",
        background: "#0f0f18",
        border: "1px solid #FF6B3540",
        borderRadius: "24px 24px 0 0",
        padding: "24px 20px",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              📊 Weekly Report
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "#f0f0f5", marginTop: 4 }}>
              {weekKey}
            </div>
          </div>
          <button
            onClick={onDismiss}
            style={{
              background: "#1e1e2e", border: "none", borderRadius: "50%",
              width: 32, height: 32, cursor: "pointer",
              color: "#6B7280", fontSize: 16, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>×</button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🧠</div>
            <div style={{ fontSize: 13, color: "#4B5563", fontStyle: "italic" }}>Generating your weekly report...</div>
          </div>
        ) : (
          <div style={{
            fontSize: 14, lineHeight: 1.8, color: "#c8c8d8",
            whiteSpace: "pre-wrap",
            background: "#111118", borderRadius: 14,
            padding: "16px", border: "1px solid #1e1e2e",
          }}>
            {report}
          </div>
        )}

        <button
          onClick={onDismiss}
          style={{
            width: "100%", marginTop: 16,
            background: "#FF6B35", border: "none", borderRadius: 14,
            padding: "14px", color: "#000",
            fontSize: 14, fontWeight: 800,
            cursor: "pointer", fontFamily: "'Syne', sans-serif",
          }}>
          Let's go next week →
        </button>
      </div>
    </div>
  );
}
