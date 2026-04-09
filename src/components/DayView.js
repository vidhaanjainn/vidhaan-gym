import { useState, useCallback } from "react";
import { SPORTS_ACTIVITIES } from "../data/workouts";
import { getTodayStr } from "../hooks/useStorage";
import { getSessionInsight } from "../services/gemini";

// ── Load Tracker inline component ────────────────────────────
function LoadRow({ ex, dayColor, weekKey, dayId, currentLoad, previousLoad, onSave, open, onToggle }) {
  const [weight, setWeight] = useState(currentLoad?.weight || "");
  const [reps,   setReps]   = useState(currentLoad?.reps   || "");
  const [sets,   setSets]   = useState(currentLoad?.sets   || ex.sets);

  const hasChange = currentLoad && previousLoad
    ? Math.round(((currentLoad.weight - previousLoad.weight) / previousLoad.weight) * 100)
    : null;

  const handleSave = () => {
    if (!weight) { onToggle(); return; }
    onSave(weekKey, dayId, ex.id, { weight: parseFloat(weight), reps: parseInt(reps) || ex.reps, sets: parseInt(sets) || ex.sets });
    onToggle();
  };

  if (!open) return null;

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        margin: "6px 14px 10px 53px", background: "#111118",
        border: "1px solid #2d2d40", borderRadius: 10,
        padding: "10px 12px", display: "flex", gap: 8, alignItems: "flex-end",
      }}>
      {[
        { label: "kg", val: weight, set: setWeight, placeholder: previousLoad?.weight || "0" },
        { label: "reps", val: reps, set: setReps, placeholder: previousLoad?.reps || ex.reps },
        { label: "sets", val: sets, set: setSets, placeholder: ex.sets },
      ].map(f => (
        <div key={f.label} style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: "#4B5563", marginBottom: 3, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{f.label}</div>
          <input
            type="number"
            value={f.val}
            placeholder={String(f.placeholder)}
            onChange={e => f.set(e.target.value)}
            style={{
              width: "100%", background: "#0a0a0f",
              border: "1px solid #2d2d40", borderRadius: 6,
              padding: "5px 7px", color: "#f0f0f5",
              fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
      ))}
      {hasChange !== null && (
        <div style={{ fontSize: 10, fontWeight: 700, color: hasChange > 0 ? "#4ade80" : hasChange < 0 ? "#f87171" : "#6B7280", alignSelf: "center", whiteSpace: "nowrap" }}>
          {hasChange > 0 ? "↑" : hasChange < 0 ? "↓" : "→"}{Math.abs(hasChange)}%
        </div>
      )}
      <button
        onClick={handleSave}
        style={{
          background: dayColor, border: "none", borderRadius: 8,
          padding: "6px 12px", color: "#000",
          fontSize: 12, fontWeight: 800, cursor: "pointer",
          fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0,
        }}>
        Save
      </button>
    </div>
  );
}

// ── Exercise Row ──────────────────────────────────────────────
function ExerciseRow({ ex, isDone, dayColor, isLast, onToggle, weekKey, dayId, currentLoad, previousLoad, onSaveLoad, isFinished }) {
  const [pressed, setPressed] = useState(false);
  const [loadOpen, setLoadOpen] = useState(false);

  return (
    <div style={{
      borderBottom: isLast ? "none" : "1px solid #161622",
      background: isDone ? (ex.isRehab ? "#0c2010" : "#0d1520") : pressed ? "#16161e" : "transparent",
      transform: pressed ? "scale(0.99)" : "scale(1)",
      transition: "background 0.15s, transform 0.1s",
    }}>
      <div
        onClick={isFinished ? undefined : onToggle}
        onTouchStart={() => !isFinished && setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        style={{
          display: "flex", alignItems: "flex-start",
          padding: "13px 14px",
          cursor: isFinished ? "default" : "pointer",
        }}>
        {/* Checkbox */}
        <div style={{
          width: 26, height: 26, borderRadius: "50%",
          border: `2px solid ${isDone ? (ex.isRehab ? "#4ade80" : dayColor) : "#2d2d40"}`,
          background: isDone ? (ex.isRehab ? "#4ade80" : dayColor) : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, marginRight: 13, marginTop: 1,
          fontSize: 13, fontWeight: 700,
          color: isDone ? "#000" : "transparent",
          transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
          boxShadow: isDone ? `0 0 12px ${ex.isRehab ? "#4ade8066" : dayColor + "66"}` : "none",
        }}>✓</div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{
              fontSize: 14, fontWeight: 600, lineHeight: 1.3,
              color: isDone ? "#4B5563" : "#e8e8f0",
              textDecoration: isDone ? "line-through" : "none",
              flex: 1, marginRight: 10, transition: "color 0.2s",
            }}>
              {ex.name}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                color: isDone ? "#374151" : dayColor,
                background: `${dayColor}18`,
                padding: "3px 9px", borderRadius: 8,
              }}>
                {currentLoad ? `${currentLoad.weight}kg` : `${ex.sets}×${ex.reps}`}
              </div>
              {!ex.isRehab && (
                <div
                  onClick={e => { e.stopPropagation(); setLoadOpen(o => !o); }}
                  style={{
                    width: 20, height: 20, borderRadius: "50%",
                    border: `1.5px solid ${loadOpen ? dayColor : "#2d2d40"}`,
                    background: loadOpen ? `${dayColor}22` : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700,
                    color: loadOpen ? dayColor : "#374151",
                    cursor: "pointer", flexShrink: 0, lineHeight: 1,
                    transition: "all 0.15s",
                  }}>
                  {loadOpen ? "×" : "+"}
                </div>
              )}
            </div>
          </div>
          {ex.note && (
            <div style={{ fontSize: 11, marginTop: 5, lineHeight: 1.5, color: ex.isRehab ? "#4ade8066" : "#4B5563" }}>
              {ex.note}
            </div>
          )}
        </div>
      </div>

      {/* Load tracker — expands inline, zero height when closed */}
      {!ex.isRehab && (
        <LoadRow
          ex={ex}
          dayColor={dayColor}
          weekKey={weekKey}
          dayId={dayId}
          currentLoad={currentLoad}
          previousLoad={previousLoad}
          onSave={onSaveLoad}
          open={loadOpen}
          onToggle={() => setLoadOpen(o => !o)}
        />
      )}
    </div>
  );
}

// ── Gemini Insight Card ───────────────────────────────────────
function InsightCard({ insight, loading, dayColor, onReopen, canReopen }) {
  if (loading) {
    return (
      <div style={{
        marginTop: 20, padding: "20px", background: "#0d1520",
        border: `1px solid ${dayColor}40`, borderRadius: 16,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>🧠</div>
        <div style={{ fontSize: 13, color: "#4B5563", fontStyle: "italic" }}>Analysing your session...</div>
        <div style={{ marginTop: 12, height: 3, background: "#1a1a26", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", background: dayColor,
            width: "40%", borderRadius: 2,
            animation: "shimmer 1.5s infinite",
          }} />
        </div>
      </div>
    );
  }

  if (!insight) return null;

  return (
    <div style={{
      marginTop: 20,
      background: `linear-gradient(135deg, ${dayColor}12, #0a0a0f)`,
      border: `1px solid ${dayColor}50`,
      borderRadius: 16, padding: "18px",
      animation: "slideUp 0.4s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>⚡</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: dayColor, letterSpacing: 1, textTransform: "uppercase" }}>
          Coach Insight
        </span>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: "#c8c8d8", whiteSpace: "pre-wrap" }}>
        {insight}
      </div>
      {canReopen && (
        <button
          onClick={onReopen}
          style={{
            marginTop: 14, background: "none",
            border: "1px solid #2d2d40", borderRadius: 8,
            padding: "6px 14px", fontSize: 11,
            color: "#4B5563", cursor: "pointer",
            fontFamily: "inherit",
          }}>
          Reopen session (add more)
        </button>
      )}
    </div>
  );
}

// ── Sports Add-on Bar ────────────────────────────────────────
function SportsBar({ dateStr, sportsForDate, onToggleSport, dayColor }) {
  const [open, setOpen] = useState(false);

  const loggedCount = SPORTS_ACTIVITIES.filter(s => sportsForDate[s.id]).length;

  return (
    <div style={{ marginTop: 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", background: "#111118",
          border: `1px solid ${loggedCount > 0 ? "#10B98160" : "#1e1e2e"}`,
          borderRadius: 12, padding: "11px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", fontFamily: "inherit",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>🏅</span>
          <span style={{ fontSize: 12, color: loggedCount > 0 ? "#10B981" : "#4B5563", fontWeight: 600 }}>
            {loggedCount > 0 ? `${loggedCount} sport${loggedCount > 1 ? "s" : ""} logged today` : "Log a sport today"}
          </span>
        </div>
        <span style={{ color: "#2d2d40", fontSize: 14, transform: open ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s" }}>›</span>
      </button>

      {open && (
        <div style={{
          background: "#0c0c14", border: "1px solid #1e1e2e",
          borderTop: "none", borderRadius: "0 0 12px 12px",
          padding: "12px",
          display: "flex", flexWrap: "wrap", gap: 8,
        }}>
          {SPORTS_ACTIVITIES.map(sport => {
            const done = !!sportsForDate[sport.id];
            return (
              <button
                key={sport.id}
                onClick={() => onToggleSport(sport.id, dateStr)}
                style={{
                  background: done ? `${sport.color}22` : "#1a1a26",
                  border: `1px solid ${done ? sport.color + "60" : "#2d2d40"}`,
                  borderRadius: 20, padding: "6px 14px",
                  display: "flex", alignItems: "center", gap: 6,
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.2s",
                }}>
                <span style={{ fontSize: 16 }}>{sport.icon}</span>
                <span style={{ fontSize: 12, color: done ? sport.color : "#6B7280", fontWeight: 600 }}>
                  {sport.name.split(" ")[0]}
                </span>
                {done && <span style={{ fontSize: 10, color: sport.color }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Comment Box ──────────────────────────────────────────────
function CommentBox({ dateStr, comment, onSave, dayColor }) {
  const [text, setText] = useState(comment || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(dateStr, text);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 11, color: "#4B5563", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>
        📝 Session Note
      </div>
      <textarea
        value={text}
        onChange={e => { setText(e.target.value); setSaved(false); }}
        placeholder="How did it feel? Energy, pain, wins, anything..."
        rows={3}
        style={{
          width: "100%", background: "#0c0c14",
          border: `1px solid ${text ? dayColor + "40" : "#1e1e2e"}`,
          borderRadius: 10, padding: "10px 12px",
          color: "#e8e8f0", fontSize: 13,
          lineHeight: 1.6, fontFamily: "inherit",
          resize: "none", outline: "none",
          transition: "border-color 0.2s",
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
        <button
          onClick={handleSave}
          style={{
            background: saved ? "#4ade8022" : `${dayColor}22`,
            border: `1px solid ${saved ? "#4ade8060" : dayColor + "60"}`,
            borderRadius: 8, padding: "6px 16px",
            fontSize: 11, color: saved ? "#4ade80" : dayColor,
            cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
            transition: "all 0.2s",
          }}>
          {saved ? "✓ Saved" : "Save note"}
        </button>
      </div>
    </div>
  );
}

// ── Main DayView ──────────────────────────────────────────────
export default function DayView({
  day,
  weekKey,
  completedExercises,
  session,
  onToggle,
  onFinishSession,
  onReopenSession,
  onBack,
  getLoad,
  saveLoad,
  comment,
  onSaveComment,
  sportsForDate,
  onToggleSport,
  dateStr,
  isHome,
  onToggleHome,
}) {
  // If home mode, use homeAlternatives if available; else fall back to gym sections
  const activeSections = isHome && day.homeAlternatives
    ? [{ title: "🏠 Home Workout", exercises: day.homeAlternatives }]
    : day.sections;

  const allIds   = activeSections.flatMap(s => s.exercises.map(e => e.id));
  const rehabIds = activeSections.flatMap(s => s.exercises.filter(e => e.isRehab).map(e => e.id));
  const doneCount = allIds.filter(id => completedExercises[id]).length;
  const pct = allIds.length > 0 ? Math.round((doneCount / allIds.length) * 100) : 0;
  const rehabDone = rehabIds.filter(id => completedExercises[id]).length;
  const rehabPct  = rehabIds.length > 0 ? Math.round((rehabDone / rehabIds.length) * 100) : 100;

  const isFinished = session?.state === "finished";
  const showFinishBtn = pct >= 60 && !isFinished;

  const [insightLoading, setInsightLoading] = useState(false);
  const [insight, setInsight]               = useState(session?.insight || null);
  const [expanded, setExpanded]             = useState(() => {
    const init = {};
    activeSections.forEach((_, i) => { init[i] = true; });
    return init;
  });

  const targetDate = dateStr || getTodayStr();
  const isToday    = targetDate === getTodayStr();

  const handleFinish = useCallback(async () => {
    const sessionData = onFinishSession(weekKey, day.id, allIds, rehabIds, targetDate);

    setInsightLoading(true);

    // Build load highlights
    const loadHighlights = [];
    day.sections.flatMap(s => s.exercises.filter(e => !e.isRehab)).forEach(ex => {
      const { current, previous } = getLoad(weekKey, day.id, ex.id);
      if (current) {
        const change = previous
          ? Math.round(((current.weight - previous.weight) / previous.weight) * 100)
          : null;
        loadHighlights.push({ name: ex.name, weight: current.weight, reps: current.reps, prevWeight: previous?.weight, change });
      }
    });

    // Missed exercises
    const missedExercises = allIds
      .filter(id => !completedExercises[id])
      .map(id => {
        const ex = day.sections.flatMap(s => s.exercises).find(e => e.id === id);
        return ex ? { name: ex.name, importance: ex.importance || "" } : null;
      })
      .filter(Boolean);

    try {
      const text = await getSessionInsight({
        dayName: day.name,
        dayFocus: day.focus,
        dayType: day.type,
        pct,
        done: doneCount,
        total: allIds.length,
        rehabPct,
        rehabDone,
        rehabTotal: rehabIds.length,
        missedExercises,
        loadHighlights,
        streakCurrent: sessionData?.current || 1,
        comment: comment || "",
      });
      setInsight(text);
    } catch (e) {
      setInsight("Session locked. Great work getting through it — the data is saved.");
    }
    setInsightLoading(false);
  }, [weekKey, day, allIds, rehabIds, targetDate, completedExercises, pct, doneCount, rehabPct, rehabDone, getLoad, comment, onFinishSession]);

  return (
    <div style={{ animation: "slideUp 0.3s ease" }}>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>

      {onBack && (
        <button onClick={onBack} style={{
          background: "none", border: "none", color: "#6B7280",
          fontSize: 14, cursor: "pointer", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 6, padding: 0,
          fontFamily: "inherit",
        }}>
          ← Back to Week
        </button>
      )}

      {/* Day header */}
      <div style={{
        background: `linear-gradient(135deg, ${day.color}22 0%, ${day.color}08 100%)`,
        border: `1px solid ${day.color}50`,
        borderRadius: 20, padding: "20px", marginBottom: 16,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 36 }}>{day.icon}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, marginTop: 8, color: "#f0f0f5" }}>
              {day.name}
              {isFinished && <span style={{ fontSize: 13, background: "#4ade8022", color: "#4ade80", padding: "2px 8px", borderRadius: 20, marginLeft: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Done ✓</span>}
            </div>
            <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 3 }}>{day.focus}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 12, color: "#6B7280" }}>⏱ {day.duration}</span>
              {day.homeAlternatives && day.type !== "rest" && day.type !== "recovery" && !isFinished && (
                <div
                  onClick={(e) => { e.stopPropagation(); onToggleHome && onToggleHome(!isHome); }}
                  onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); onToggleHome && onToggleHome(!isHome); }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 0,
                    background: "#1a1a26", border: "1px solid #2d2d40",
                    borderRadius: 20, padding: "1px", cursor: "pointer",
                    userSelect: "none",
                  }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 16,
                    background: !isHome ? day.color : "transparent",
                    color: !isHome ? "#000" : "#4B5563",
                    transition: "all 0.15s",
                  }}>Gym</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 16,
                    background: isHome ? "#3B82F6" : "transparent",
                    color: isHome ? "#fff" : "#4B5563",
                    transition: "all 0.15s",
                  }}>Home</span>
                </div>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: day.color, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
              {pct}%
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{doneCount}/{allIds.length}</div>
            {rehabIds.length > 0 && (
              <div style={{ fontSize: 11, color: rehabPct >= 80 ? "#4ade80" : rehabPct >= 50 ? "#F59E0B" : "#f87171", marginTop: 4, fontWeight: 600 }}>
                🩺 {rehabPct}%
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 16, height: 6, background: "#1e1e2e", borderRadius: 3 }}>
          <div style={{
            width: `${pct}%`, height: "100%",
            background: `linear-gradient(90deg, ${day.color}, ${day.color}cc)`,
            borderRadius: 3, transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
          }} />
        </div>

        {/* Rehab warning */}
        {rehabIds.length > 0 && !isFinished && rehabPct < 80 && pct > 0 && (
          <div style={{ marginTop: 10, fontSize: 12, color: rehabPct === 0 ? "#f87171" : "#F59E0B", fontWeight: 600 }}>
            ⚠️ {rehabPct === 0 ? "Knee rehab not started. Do not skip this." : `Knee rehab ${rehabPct}% — finish it before you close.`}
          </div>
        )}
      </div>



      {/* Sections */}
      {activeSections.map((section, si) => {
        const isOpen  = expanded[si] !== false;
        const isRehab = section.exercises.some(e => e.isRehab);
        const secDone = section.exercises.filter(e => completedExercises[e.id]).length;

        return (
          <div key={si} style={{ marginBottom: 10 }}>
            <div
              onClick={() => setExpanded(p => ({ ...p, [si]: !p[si] }))}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "11px 14px",
                background: isRehab ? "#0b1f0b" : "#111118",
                borderRadius: isOpen ? "14px 14px 0 0" : "14px",
                border: `1px solid ${isRehab ? "#16a34a35" : "#1e1e2e"}`,
                cursor: "pointer", userSelect: "none",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {isRehab && <span style={{ fontSize: 13 }}>🩺</span>}
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: 1,
                  textTransform: "uppercase",
                  color: isRehab ? "#4ade80" : "#6B7280",
                }}>
                  {section.title}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#4B5563" }}>{secDone}/{section.exercises.length}</span>
                <span style={{
                  color: "#4B5563", fontSize: 14, fontWeight: 700,
                  transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s", display: "inline-block",
                }}>›</span>
              </div>
            </div>

            {isOpen && (
              <div style={{
                background: "#0c0c14",
                borderRadius: "0 0 14px 14px",
                border: `1px solid ${isRehab ? "#16a34a35" : "#1e1e2e"}`,
                borderTop: "none", overflow: "hidden",
              }}>
                {section.exercises.map((ex, ei) => {
                  const isDone = !!completedExercises[ex.id];
                  const { current: currentLoad, previous: previousLoad } = getLoad(weekKey, day.id, ex.id);
                  return (
                    <ExerciseRow
                      key={ex.id}
                      ex={ex}
                      isDone={isDone}
                      dayColor={day.color}
                      isLast={ei === section.exercises.length - 1}
                      onToggle={() => onToggle(weekKey, day.id, ex.id)}
                      weekKey={weekKey}
                      dayId={day.id}
                      currentLoad={currentLoad}
                      previousLoad={previousLoad}
                      onSaveLoad={saveLoad}
                      isFinished={isFinished}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Finish Session button */}
      {showFinishBtn && (
        <button
          onClick={handleFinish}
          style={{
            width: "100%", marginTop: 16,
            background: `linear-gradient(135deg, ${day.color}, ${day.color}cc)`,
            border: "none", borderRadius: 16,
            padding: "16px", color: "#000",
            fontSize: 15, fontWeight: 800,
            cursor: "pointer", fontFamily: "'Syne', sans-serif",
            letterSpacing: 0.5, animation: "slideUp 0.4s ease",
            boxShadow: `0 0 30px ${day.color}44`,
          }}>
          ✓ Finish Session
        </button>
      )}

      {/* Gemini insight */}
      <InsightCard
        insight={insight}
        loading={insightLoading}
        dayColor={day.color}
        canReopen={isFinished && isToday}
        onReopen={() => { onReopenSession(weekKey, day.id); setInsight(null); }}
      />

      {/* Sports add-on */}
      <SportsBar
        dateStr={targetDate}
        sportsForDate={sportsForDate}
        onToggleSport={onToggleSport}
        dayColor={day.color}
      />

      {/* Comment box */}
      <CommentBox
        dateStr={targetDate}
        comment={comment}
        onSave={onSaveComment}
        dayColor={day.color}
      />

      <div style={{ height: 20 }} />
    </div>
  );
}
