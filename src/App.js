import { useState, useEffect } from "react";
import { WORKOUT_PLAN, MOTIVATIONAL_MESSAGES } from "./data/workouts";
import {
  useStorage,
  getTodayGymDayIndex,
  getWeekDates,
  getTodayStr,
  isSunday,
  getWeekKey,
} from "./hooks/useStorage";
import DayView from "./components/DayView";
import { WeekBar, StreakBadge } from "./components/StreakBar";
import SportsView from "./components/SportsView";
import HistoryView from "./components/HistoryView";
import WeeklyReport from "./components/WeeklyReport";

const TABS = [
  { id: "today",   label: "Today",   icon: "⚡" },
  { id: "week",    label: "Week",    icon: "📅" },
  { id: "sports",  label: "Sports",  icon: "🏅" },
  { id: "history", label: "Log",     icon: "📊" },
];

export default function App() {
  const {
    loaded,
    currentWeekKey,
    getCompletedExercises,
    toggleExercise,
    getDayProgress,
    saveLoad,
    getLoad,
    getWeekLoads,
    getSession,
    finishSession,
    reopenSession,
    saveComment,
    getComment,
    toggleSport,
    getSportsForDate,
    getWeeklySportCounts,
    history,
    streakData,
    getHistoryForRange,
    allSessions,
    allExercises,
    allSports,
  } = useStorage();

  const [activeTab,    setActiveTab]    = useState("today");
  const [selectedDay,  setSelectedDay]  = useState(null);
  const [celebrate,    setCelebrate]    = useState(false);
  const [showReport,   setShowReport]   = useState(false);
  const [motivationIdx] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length));

  const todayGymIndex = getTodayGymDayIndex();
  const todayWorkout  = WORKOUT_PLAN[todayGymIndex];
  const todayStr      = getTodayStr();
  const weekDates     = getWeekDates(currentWeekKey);

  // Celebrate on 100% completion of today
  useEffect(() => {
    if (!loaded) return;
    const allIds = todayWorkout.sections.flatMap(s => s.exercises.map(e => e.id));
    const completedEx = getCompletedExercises(currentWeekKey, todayWorkout.id);
    const allDone = allIds.length > 0 && allIds.every(id => completedEx[id]);
    if (allDone) {
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 2800);
      return () => clearTimeout(t);
    }
  }, [allExercises, todayWorkout, loaded, currentWeekKey, getCompletedExercises]);

  // Show weekly report on Sundays if sessions this week > 0
  useEffect(() => {
    if (!loaded) return;
    if (!isSunday()) return;
    const sessions = allSessions[currentWeekKey] || {};
    const hasAny = Object.values(sessions).some(s => s.state === "finished");
    const dismissed = localStorage.getItem(`gym:report-dismissed-${currentWeekKey}`);
    if (hasAny && !dismissed) setShowReport(true);
  }, [loaded, allSessions, currentWeekKey]);

  const dismissReport = () => {
    localStorage.setItem(`gym:report-dismissed-${currentWeekKey}`, "1");
    setShowReport(false);
  };

  // Sessions this week
  const sessionsThisWeek = Object.values(allSessions[currentWeekKey] || {})
    .filter(s => s.state === "finished").length;

  if (!loaded) {
    return (
      <div style={{ background: "#0a0a0f", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 40 }}>💪</div>
        <div style={{ color: "#4B5563", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Loading your plan...</div>
      </div>
    );
  }

  // Helper: render DayView for a given workout day + date
  const renderDayView = (day, onBack = null, dateStr = null) => {
    const targetDate  = dateStr || todayStr;
    const targetWeek  = getWeekKey(new Date(targetDate + "T00:00:00"));
    const completedEx = getCompletedExercises(targetWeek, day.id);
    const session     = getSession(targetWeek, day.id);
    const comment     = getComment(targetDate);
    const sportsForDate = getSportsForDate(targetDate);

    return (
      <DayView
        day={day}
        weekKey={targetWeek}
        completedExercises={completedEx}
        session={session}
        onToggle={toggleExercise}
        onFinishSession={finishSession}
        onReopenSession={reopenSession}
        onBack={onBack}
        getLoad={getLoad}
        saveLoad={saveLoad}
        comment={comment}
        onSaveComment={saveComment}
        sportsForDate={sportsForDate}
        onToggleSport={toggleSport}
        dateStr={targetDate}
      />
    );
  };

  return (
    <div style={{
      background: "#0a0a0f",
      height: "100vh",
      fontFamily: "'DM Sans', sans-serif",
      color: "#f0f0f5",
      maxWidth: 480,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
    }}>
      <style>{`
        @keyframes slideUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse     { 0%,100% { transform:scale(1); } 50% { transform:scale(1.12); } }
        @keyframes celebrate { 0% { opacity:0; transform:scale(0.4) translateY(0); } 50% { opacity:1; transform:scale(1.2) translateY(-10px); } 100% { opacity:0; transform:scale(1.5) translateY(-40px); } }
        * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        ::-webkit-scrollbar { display:none; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      {/* Celebrate overlay */}
      {celebrate && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          pointerEvents: "none", background: "rgba(0,0,0,0.3)",
        }}>
          <div style={{ fontSize: 80, animation: "celebrate 2.5s ease forwards" }}>🔥</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#FF6B35", fontFamily: "'Syne', sans-serif", animation: "celebrate 2.5s ease 0.1s forwards", opacity: 0 }}>
            Day Complete!
          </div>
        </div>
      )}

      {/* Weekly Report */}
      {showReport && (
        <WeeklyReport
          weekKey={currentWeekKey}
          allSessions={allSessions}
          allSports={allSports}
          history={history}
          streakData={streakData}
          allLoads={{}}
          onDismiss={dismissReport}
        />
      )}

      {/* ── HEADER ── */}
      <div style={{ padding: "env(safe-area-inset-top, 16px) 20px 0", paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)", background: "linear-gradient(180deg,#0f0f18 0%,transparent 100%)", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, color: "#4B5563", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, fontFamily: "'Syne', sans-serif", letterSpacing: -0.5, color: "#f0f0f5" }}>
              Vidhaan's Gym 💪
            </div>
            <div style={{ fontSize: 11, color: "#374151", marginTop: 3 }}>
              {sessionsThisWeek}/6 sessions this week
              {isSunday() && sessionsThisWeek > 0 && (
                <span
                  onClick={() => setShowReport(true)}
                  style={{ marginLeft: 8, color: "#FF6B35", fontWeight: 700, cursor: "pointer" }}>
                  View report →
                </span>
              )}
            </div>
          </div>
          <StreakBadge streakData={streakData} />
        </div>

        {/* Quote */}
        <div style={{
          marginTop: 14, padding: "9px 13px",
          background: `linear-gradient(135deg, ${todayWorkout.color}12, ${todayWorkout.color}05)`,
          borderRadius: 10, borderLeft: `3px solid ${todayWorkout.color}80`,
          fontSize: 12, color: "#6B7280", fontStyle: "italic",
        }}>
          "{MOTIVATIONAL_MESSAGES[motivationIdx]}"
        </div>

        {/* Week bar */}
        <WeekBar
          weekKey={currentWeekKey}
          allSessions={allSessions}
          allExercises={allExercises}
        />

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginTop: 14, paddingBottom: 2 }}>
          {TABS.map(tab => (
            <button key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedDay(null); }}
              style={{
                flex: 1, padding: "9px 0", borderRadius: 10, border: "none",
                cursor: "pointer", fontSize: 12, fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                background: activeTab === tab.id ? todayWorkout.color : "#111118",
                color: activeTab === tab.id ? "#000" : "#4B5563",
                transition: "all 0.2s",
                letterSpacing: 0.3,
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}>

        {/* TODAY */}
        {activeTab === "today" && renderDayView(todayWorkout, null, todayStr)}

        {/* WEEK */}
        {activeTab === "week" && !selectedDay && (
          <div style={{ animation: "slideUp 0.3s ease" }}>
            <div style={{ fontSize: 12, color: "#4B5563", marginBottom: 14, fontWeight: 500 }}>
              Tap any day to view and log exercises
            </div>
            {WORKOUT_PLAN.map((day, i) => {
              const dateStr     = weekDates[i];
              const allIds      = day.sections.flatMap(s => s.exercises.map(e => e.id));
              const { done, total, pct } = getDayProgress(currentWeekKey, day.id, allIds);
              const isToday     = i === todayGymIndex;
              const session     = getSession(currentWeekKey, day.id);
              const isFinished  = session.state === "finished";

              return (
                <div key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  style={{
                    background: isToday ? `linear-gradient(135deg, ${day.color}18, ${day.color}06)` : "#111118",
                    border: `1px solid ${isToday ? day.color + "55" : "#1e1e2e"}`,
                    borderRadius: 16, padding: "15px 16px", marginBottom: 8,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
                    boxShadow: isToday ? `0 0 20px ${day.color}18` : "none",
                  }}>
                  <div style={{ fontSize: 26 }}>{day.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#e8e8f0" }}>
                          {dateStr} · {day.name}
                        </span>
                        {isToday && (
                          <span style={{ fontSize: 9, background: day.color, color: "#000", padding: "2px 6px", borderRadius: 20, fontWeight: 800, letterSpacing: 0.5 }}>
                            TODAY
                          </span>
                        )}
                        {isFinished && (
                          <span style={{ fontSize: 9, background: "#4ade8022", color: "#4ade80", padding: "2px 6px", borderRadius: 20, fontWeight: 800 }}>
                            DONE ✓
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 11, color: "#4B5563" }}>{done}/{total}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#4B5563", marginTop: 2 }}>{day.focus}</div>
                    <div style={{ marginTop: 8, height: 3, background: "#1a1a26", borderRadius: 2 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: day.color, borderRadius: 2, transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                  <div style={{ color: "#2d2d40", fontSize: 18, fontWeight: 700 }}>›</div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "week" && selectedDay && (() => {
          const dayIndex = WORKOUT_PLAN.findIndex(d => d.id === selectedDay);
          const dateStr  = weekDates[dayIndex] || todayStr;
          return renderDayView(
            WORKOUT_PLAN.find(d => d.id === selectedDay),
            () => setSelectedDay(null),
            dateStr,
          );
        })()}

        {/* SPORTS */}
        {activeTab === "sports" && (
          <SportsView
            allSports={allSports}
            onToggle={toggleSport}
            weekKey={currentWeekKey}
          />
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <HistoryView
            history={history}
            allSports={allSports}
            getHistoryForRange={getHistoryForRange}
          />
        )}
      </div>
    </div>
  );
}
