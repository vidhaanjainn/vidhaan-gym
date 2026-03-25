import { useState } from "react";

export default function DayView({ day, completedExercises, onToggle, onBack }) {
  const allIds = day.sections.flatMap(s => s.exercises.map(e => e.id));
  const doneCount = allIds.filter(id => completedExercises[`${day.id}-${id}`]).length;
  const pct = allIds.length > 0 ? Math.round((doneCount / allIds.length) * 100) : 0;

  const [expanded, setExpanded] = useState(() => {
    const init = {};
    day.sections.forEach((_, i) => { init[i] = true; });
    return init;
  });

  const toggle = (i) => setExpanded(p => ({ ...p, [i]: !p[i] }));

  return (
    <div style={{ animation: "slideUp 0.3s ease" }}>
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

      {/* Day header card */}
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
            </div>
            <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 3 }}>{day.focus}</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>⏱ {day.duration}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: day.color, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
              {pct}%
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{doneCount}/{allIds.length}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 16, height: 6, background: "#1e1e2e", borderRadius: 3 }}>
          <div style={{
            width: `${pct}%`, height: "100%",
            background: `linear-gradient(90deg, ${day.color}, ${day.color}cc)`,
            borderRadius: 3, transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
          }} />
        </div>

        {pct === 100 && (
          <div style={{
            marginTop: 12, textAlign: "center", fontSize: 14,
            color: day.color, fontWeight: 700,
            animation: "pulse 1.5s infinite",
          }}>
            🔥 Day Complete — Beast Mode!
          </div>
        )}
      </div>

      {/* Sections */}
      {day.sections.map((section, si) => {
        const isOpen = expanded[si] !== false;
        const isRehab = section.exercises.some(e => e.isRehab);
        const secDone = section.exercises.filter(e => completedExercises[`${day.id}-${e.id}`]).length;

        return (
          <div key={si} style={{ marginBottom: 10 }}>
            {/* Section header */}
            <div
              onClick={() => toggle(si)}
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
                <span style={{ fontSize: 12, color: "#4B5563" }}>
                  {secDone}/{section.exercises.length}
                </span>
                <span style={{
                  color: "#4B5563", fontSize: 14, fontWeight: 700,
                  transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s", display: "inline-block",
                }}>›</span>
              </div>
            </div>

            {/* Exercises */}
            {isOpen && (
              <div style={{
                background: "#0c0c14",
                borderRadius: "0 0 14px 14px",
                border: `1px solid ${isRehab ? "#16a34a35" : "#1e1e2e"}`,
                borderTop: "none", overflow: "hidden",
              }}>
                {section.exercises.map((ex, ei) => {
                  const isDone = !!completedExercises[`${day.id}-${ex.id}`];
                  return (
                    <ExerciseRow
                      key={ex.id}
                      ex={ex}
                      isDone={isDone}
                      dayColor={day.color}
                      isLast={ei === section.exercises.length - 1}
                      onToggle={() => onToggle(day.id, ex.id, allIds)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ExerciseRow({ ex, isDone, dayColor, isLast, onToggle }) {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      onClick={onToggle}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        display: "flex", alignItems: "flex-start",
        padding: "13px 14px",
        borderBottom: isLast ? "none" : "1px solid #161622",
        cursor: "pointer",
        background: isDone
          ? (ex.isRehab ? "#0c2010" : "#0d1520")
          : pressed ? "#16161e" : "transparent",
        transform: pressed ? "scale(0.99)" : "scale(1)",
        transition: "background 0.15s, transform 0.1s",
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

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{
            fontSize: 14, fontWeight: 600, lineHeight: 1.3,
            color: isDone ? "#4B5563" : "#e8e8f0",
            textDecoration: isDone ? "line-through" : "none",
            flex: 1, marginRight: 10,
            transition: "color 0.2s",
          }}>
            {ex.name}
          </div>
          <div style={{
            fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
            color: isDone ? "#374151" : dayColor,
            background: `${dayColor}18`,
            padding: "3px 9px", borderRadius: 8,
            flexShrink: 0,
          }}>
            {ex.sets}×{ex.reps}
          </div>
        </div>
        {ex.note && (
          <div style={{
            fontSize: 11, marginTop: 5, lineHeight: 1.5,
            color: ex.isRehab ? "#4ade8066" : "#4B5563",
          }}>
            {ex.note}
          </div>
        )}
      </div>
    </div>
  );
}
