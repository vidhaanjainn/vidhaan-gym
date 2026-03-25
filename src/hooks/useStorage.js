// ============================================================
// useStorage.js — All data persistence lives here.
//
// Uses localStorage — data survives app restarts on iPhone
// as long as you don't clear Safari data.
//
// Keys stored:
//   gym:completed-exercises  → { "day1-d1s1": true, ... }
//   gym:completed-days       → { "2025-06-01-day1": true, ... }
//   gym:completed-sports     → { "2025-06-01-pickleball": true, ... }
//   gym:streak               → { current: 5, longest: 12, lastDate: "2025-06-01" }
//   gym:history              → { "2025-06-01": { dayId, exercisesDone, total }, ... }
//
// History is date-keyed so you get 365+ days of records.
// Future: swap localStorage.setItem → supabase.from('workouts').upsert()
//         for multi-device sync when going commercial.
// ============================================================

import { useState, useEffect, useCallback } from "react";

const PREFIX = "gym:";

function loadKey(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveKey(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn("Storage write failed:", e);
  }
}

export function useStorage() {
  const [completedExercises, setCompletedExercises] = useState({});
  const [completedDays,      setCompletedDays]      = useState({});
  const [completedSports,    setCompletedSports]    = useState({});
  const [streakData,         setStreakData]          = useState({ current: 0, longest: 0, lastDate: null });
  const [history,            setHistory]             = useState({});
  const [loaded,             setLoaded]              = useState(false);

  // Load all on mount
  useEffect(() => {
    setCompletedExercises(loadKey("completed-exercises") || {});
    setCompletedDays(     loadKey("completed-days")      || {});
    setCompletedSports(   loadKey("completed-sports")    || {});
    setStreakData(        loadKey("streak")               || { current: 0, longest: 0, lastDate: null });
    setHistory(           loadKey("history")              || {});
    setLoaded(true);
  }, []);

  const toggleExercise = useCallback((dayId, exerciseId, allExerciseIds) => {
    const key = `${dayId}-${exerciseId}`;
    setCompletedExercises(prev => {
      const next = { ...prev, [key]: !prev[key] };
      saveKey("completed-exercises", next);

      // Check if entire day is done
      const allDone = allExerciseIds.every(id => next[`${dayId}-${id}`]);
      if (allDone) {
        const todayStr = getTodayStr();
        const dayDateKey = `${todayStr}-${dayId}`;

        setCompletedDays(prevDays => {
          if (prevDays[dayDateKey]) return prevDays; // already counted
          const nextDays = { ...prevDays, [dayDateKey]: true };
          saveKey("completed-days", nextDays);

          // Update streak
          setStreakData(prevStreak => {
            const yesterday = getYesterdayStr();
            let newCurrent = prevStreak.lastDate === yesterday || prevStreak.lastDate === todayStr
              ? prevStreak.current + (prevStreak.lastDate === todayStr ? 0 : 1)
              : 1;
            const newLongest = Math.max(prevStreak.longest, newCurrent);
            const next = { current: newCurrent, longest: newLongest, lastDate: todayStr };
            saveKey("streak", next);
            return next;
          });

          // Log to history
          setHistory(prevH => {
            const nextH = {
              ...prevH,
              [todayStr]: {
                ...(prevH[todayStr] || {}),
                [dayId]: {
                  completedAt: new Date().toISOString(),
                  exercisesDone: allExerciseIds.length,
                  total: allExerciseIds.length,
                },
              },
            };
            saveKey("history", nextH);
            return nextH;
          });

          return nextDays;
        });
      }
      return next;
    });
  }, []);

  const toggleSport = useCallback((sportId) => {
    const key = `${getTodayStr()}-${sportId}`;
    setCompletedSports(prev => {
      const next = { ...prev, [key]: !prev[key] };
      saveKey("completed-sports", next);
      return next;
    });
  }, []);

  // Returns array of completed day-strings for the past N days (for history view)
  const getHistoryForRange = useCallback((days = 365) => {
    const result = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = dateToStr(d);
      result.push({ date: str, data: history[str] || null });
    }
    return result;
  }, [history]);

  return {
    loaded,
    completedExercises,
    completedDays,
    completedSports,
    streakData,
    history,
    toggleExercise,
    toggleSport,
    getHistoryForRange,
  };
}

// ── Date helpers ──────────────────────────────────────────
export function getTodayStr() {
  return dateToStr(new Date());
}

export function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateToStr(d);
}

export function dateToStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return dateToStr(d);
  });
}

export function formatDisplayDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function getTodayGymDayIndex() {
  const day = new Date().getDay(); // 0=Sun
  return day === 0 ? 6 : day - 1; // Mon=0, Sun=6
}
