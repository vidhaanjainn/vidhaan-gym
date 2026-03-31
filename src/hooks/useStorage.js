// ============================================================
// useStorage.js — All data persistence lives here.
//
// WEEK-BASED STORAGE: Each calendar week gets fresh sessions.
// Old weeks are preserved in history. Keys:
//
//   gym:all-exercises  → { [weekKey]: { [dayId]: { [exId]: bool } } }
//   gym:all-loads      → { [weekKey]: { [dayId]: { [exId]: {weight,reps,sets} } } }
//   gym:all-sessions   → { [weekKey]: { [dayId]: { state, finishedAt, date, pct } } }
//   gym:all-comments   → { [dateStr]: "text" }
//   gym:all-sports     → { [dateStr]: { [sportId]: bool } }
//   gym:history        → { [dateStr]: { dayId, pct, done, total, rehabPct } }
//   gym:streak         → { current, longest, lastDate }
//
// Future: swap localStorage → Supabase in this one file only.
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

// ── Date helpers ──────────────────────────────────────────────
export function dateToStr(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getTodayStr() {
  return dateToStr(new Date());
}

export function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateToStr(d);
}

export function formatDisplayDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function getTodayGymDayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1; // Mon=0 … Sun=6
}

export function getDayIndexForDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay();
  return day === 0 ? 6 : day - 1;
}

export function isSunday() {
  return new Date().getDay() === 0;
}

// ── Week key: ISO-style "YYYY-Wxx" (Mon–Sun) ─────────────────
export function getWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay() === 0 ? 7 : d.getDay(); // Mon=1 … Sun=7
  const thursday = new Date(d);
  thursday.setDate(d.getDate() + 4 - dow);
  const yearStart = new Date(thursday.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((thursday - yearStart) / 86400000) + 1) / 7);
  return `${thursday.getFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function getPrevWeekKey(weekKey) {
  const dates = getWeekDates(weekKey);
  const monday = new Date(dates[0] + "T00:00:00");
  monday.setDate(monday.getDate() - 7);
  return getWeekKey(monday);
}

// Returns array of 7 date strings (Mon–Sun) for the given weekKey
export function getWeekDates(weekKey) {
  if (!weekKey) {
    // Current week
    const today = new Date();
    const dow = today.getDay();
    const diff = today.getDate() - dow + (dow === 0 ? -6 : 1);
    const monday = new Date(today);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return dateToStr(d);
    });
  }
  const [yearStr, wStr] = weekKey.split("-W");
  const year = parseInt(yearStr, 10);
  const weekNum = parseInt(wStr, 10);
  // Find Monday of ISO week 1: the Monday on or before Jan 4
  const jan4 = new Date(year, 0, 4);
  const jan4dow = jan4.getDay() === 0 ? 7 : jan4.getDay();
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - jan4dow + 1 + (weekNum - 1) * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return dateToStr(d);
  });
}

// ── Main hook ─────────────────────────────────────────────────
export function useStorage() {
  const currentWeekKey = getWeekKey();

  const [allExercises, setAllExercises] = useState({});
  const [allLoads,     setAllLoads]     = useState({});
  const [allSessions,  setAllSessions]  = useState({});
  const [allComments,  setAllComments]  = useState({});
  const [allSports,    setAllSports]    = useState({});
  const [history,      setHistory]      = useState({});
  const [streakData,   setStreakData]   = useState({ current: 0, longest: 0, lastDate: null });
  const [loaded,       setLoaded]       = useState(false);

  useEffect(() => {
    setAllExercises(loadKey("all-exercises") || {});
    setAllLoads(    loadKey("all-loads")     || {});
    setAllSessions( loadKey("all-sessions")  || {});
    setAllComments( loadKey("all-comments")  || {});
    setAllSports(   loadKey("all-sports")    || {});
    setHistory(     loadKey("history")       || {});
    setStreakData(  loadKey("streak")        || { current: 0, longest: 0, lastDate: null });
    setLoaded(true);
  }, []);

  // ── Exercises ─────────────────────────────────────────────
  const getCompletedExercises = useCallback((weekKey, dayId) => {
    return ((allExercises[weekKey] || {})[dayId]) || {};
  }, [allExercises]);

  const toggleExercise = useCallback((weekKey, dayId, exerciseId) => {
    setAllExercises(prev => {
      const next = {
        ...prev,
        [weekKey]: {
          ...(prev[weekKey] || {}),
          [dayId]: {
            ...((prev[weekKey] || {})[dayId] || {}),
            [exerciseId]: !((prev[weekKey] || {})[dayId] || {})[exerciseId],
          },
        },
      };
      saveKey("all-exercises", next);
      return next;
    });
  }, []);

  const getDayProgress = useCallback((weekKey, dayId, allExerciseIds) => {
    const completedEx = ((allExercises[weekKey] || {})[dayId]) || {};
    const done = allExerciseIds.filter(id => completedEx[id]).length;
    const pct  = allExerciseIds.length > 0 ? Math.round((done / allExerciseIds.length) * 100) : 0;
    return { done, total: allExerciseIds.length, pct };
  }, [allExercises]);

  // ── Load tracking ─────────────────────────────────────────
  const saveLoad = useCallback((weekKey, dayId, exerciseId, loadData) => {
    setAllLoads(prev => {
      const next = {
        ...prev,
        [weekKey]: {
          ...(prev[weekKey] || {}),
          [dayId]: {
            ...((prev[weekKey] || {})[dayId] || {}),
            [exerciseId]: { ...loadData, savedAt: new Date().toISOString() },
          },
        },
      };
      saveKey("all-loads", next);
      return next;
    });
  }, []);

  const getLoad = useCallback((weekKey, dayId, exerciseId) => {
    const current  = (((allLoads[weekKey] || {})[dayId]) || {})[exerciseId] || null;
    const prevWeek = getPrevWeekKey(weekKey);
    const previous = (((allLoads[prevWeek]  || {})[dayId]) || {})[exerciseId] || null;
    return { current, previous };
  }, [allLoads]);

  const getWeekLoads = useCallback((weekKey) => {
    return allLoads[weekKey] || {};
  }, [allLoads]);

  // ── Session management ────────────────────────────────────
  const getSession = useCallback((weekKey, dayId) => {
    return ((allSessions[weekKey] || {})[dayId]) || { state: "idle" };
  }, [allSessions]);

  const finishSession = useCallback((weekKey, dayId, allExerciseIds, rehabIds, logDate = null) => {
    const targetDate  = logDate || getTodayStr();
    const completedEx = ((allExercises[weekKey] || {})[dayId]) || {};
    const doneCount   = allExerciseIds.filter(id => completedEx[id]).length;
    const pct         = allExerciseIds.length > 0 ? Math.round((doneCount / allExerciseIds.length) * 100) : 0;
    const rehabDone   = rehabIds.filter(id => completedEx[id]).length;
    const rehabPct    = rehabIds.length > 0 ? Math.round((rehabDone / rehabIds.length) * 100) : 100;

    const sessionData = {
      state: "finished",
      finishedAt: new Date().toISOString(),
      date: targetDate,
      pct,
      done: doneCount,
      total: allExerciseIds.length,
      rehabPct,
      rehabDone,
      rehabTotal: rehabIds.length,
    };

    setAllSessions(prev => {
      const next = {
        ...prev,
        [weekKey]: { ...(prev[weekKey] || {}), [dayId]: sessionData },
      };
      saveKey("all-sessions", next);
      return next;
    });

    setHistory(prevH => {
      const nextH = {
        ...prevH,
        [targetDate]: {
          ...(prevH[targetDate] || {}),
          dayId, pct, done: doneCount,
          total: allExerciseIds.length,
          rehabPct,
          finishedAt: new Date().toISOString(),
        },
      };
      saveKey("history", nextH);
      return nextH;
    });

    // Update streak — counts calendar days with a finished session
    setStreakData(prev => {
      const today     = getTodayStr();
      const yesterday = getYesterdayStr();
      let newCurrent;
      if (prev.lastDate === today)     newCurrent = prev.current;
      else if (prev.lastDate === yesterday) newCurrent = prev.current + 1;
      else newCurrent = 1;
      const newLongest = Math.max(prev.longest, newCurrent);
      const next = { current: newCurrent, longest: newLongest, lastDate: today };
      saveKey("streak", next);
      return next;
    });

    return sessionData;
  }, [allExercises]);

  const reopenSession = useCallback((weekKey, dayId) => {
    setAllSessions(prev => {
      const session = ((prev[weekKey] || {})[dayId]) || {};
      if (session.date !== getTodayStr()) return prev; // only today
      const next = {
        ...prev,
        [weekKey]: {
          ...(prev[weekKey] || {}),
          [dayId]: { ...session, state: "active" },
        },
      };
      saveKey("all-sessions", next);
      return next;
    });
  }, []);

  // ── Comments ──────────────────────────────────────────────
  const saveComment = useCallback((dateStr, text) => {
    setAllComments(prev => {
      const next = { ...prev, [dateStr]: text };
      saveKey("all-comments", next);
      return next;
    });
  }, []);

  const getComment = useCallback((dateStr) => allComments[dateStr] || "", [allComments]);

  // ── Sports ────────────────────────────────────────────────
  const toggleSport = useCallback((sportId, dateStr = null) => {
    const target = dateStr || getTodayStr();
    setAllSports(prev => {
      const day = prev[target] || {};
      const next = { ...prev, [target]: { ...day, [sportId]: !day[sportId] } };
      saveKey("all-sports", next);
      return next;
    });
  }, []);

  const getSportsForDate = useCallback((dateStr) => allSports[dateStr] || {}, [allSports]);

  const getWeeklySportCounts = useCallback((weekKey) => {
    const dates = getWeekDates(weekKey);
    const counts = {};
    dates.forEach(dateStr => {
      const sports = allSports[dateStr] || {};
      Object.keys(sports).forEach(id => {
        if (sports[id]) counts[id] = (counts[id] || 0) + 1;
      });
    });
    return counts;
  }, [allSports]);

  // ── History / heatmap ─────────────────────────────────────
  const getHistoryForRange = useCallback((days = 365) => {
    const result = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str     = dateToStr(d);
      const hasGym  = !!history[str];
      const hasSport = Object.values(allSports[str] || {}).some(Boolean);
      result.push({ date: str, data: history[str] || null, hasGym, hasSport });
    }
    return result;
  }, [history, allSports]);

  return {
    loaded,
    currentWeekKey,
    // exercises
    getCompletedExercises,
    toggleExercise,
    getDayProgress,
    // loads
    saveLoad,
    getLoad,
    getWeekLoads,
    // sessions
    getSession,
    finishSession,
    reopenSession,
    // comments
    saveComment,
    getComment,
    // sports
    toggleSport,
    getSportsForDate,
    getWeeklySportCounts,
    // history & streak
    history,
    streakData,
    getHistoryForRange,
    // raw (for WeekBar / weekly report)
    allSessions,
    allExercises,
    allSports,
  };
}
