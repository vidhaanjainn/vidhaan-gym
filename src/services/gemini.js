// ============================================================
// gemini.js — All Gemini API calls live here
// Model: gemini-2.0-flash (free tier, 1500 req/day)
// ============================================================

const GEMINI_API_KEY = "AIzaSyCNKObMtue7rmk7-njdzJV1Xo8OCg03a1E";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt) {
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 600,
      },
    }),
  });
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ── Post-session insight ──────────────────────────────────────
export async function getSessionInsight({
  dayName,
  dayFocus,
  dayType,
  pct,
  done,
  total,
  rehabPct,
  rehabDone,
  rehabTotal,
  missedExercises,   // [{ name, importance }]
  loadHighlights,    // [{ name, weight, reps, prevWeight, change }]
  streakCurrent,
  comment,
}) {
  const missedList = missedExercises.length > 0
    ? missedExercises.map(e => `- ${e.name}: ${e.importance}`).join("\n")
    : null;

  const loadList = loadHighlights.length > 0
    ? loadHighlights.map(l =>
        `- ${l.name}: ${l.weight}kg × ${l.reps} reps` +
        (l.prevWeight ? ` (was ${l.prevWeight}kg last week, ${l.change > 0 ? "+" : ""}${l.change}%)` : " (first time logged)")
      ).join("\n")
    : null;

  const prompt = `You are Vidhaan's personal gym coach. He has a knee rehab program embedded in his workouts — this is critical context. Always reference it when relevant. Be direct, specific, and motivating but never generic or preachy. No bullet points — write in flowing sentences. Max 4 sentences total.

SESSION DATA:
- Day: ${dayName} (${dayFocus})
- Completion: ${pct}% (${done}/${total} exercises)
- Knee rehab completion: ${rehabPct}% (${rehabDone}/${rehabTotal} exercises)
- Current streak: ${streakCurrent} days
${comment ? `- His note: "${comment}"` : ""}

${loadList ? `LOAD LOGGED TODAY:\n${loadList}\n` : ""}

${missedList ? `MISSED EXERCISES (explain why each matters for HIS program specifically):\n${missedList}` : "All exercises completed."}

Write a post-session message with:
1. A sharp, earned celebration line based on what he actually did (not generic "great job")
2. If rehab completion < 80%, be FIRM about the specific rehab exercises missed and exactly why they matter for his knee — do not soften this
3. If load data exists, comment on progression or give a specific next-session load target
4. One forward nudge — what to focus on next session

Tone: direct training partner, not a cheerleader. He responds to honesty. Never say "great job" or "well done".`;

  return await callGemini(prompt);
}

// ── Weekly report ─────────────────────────────────────────────
export async function getWeeklyReport({
  weekKey,
  sessionsCompleted,
  totalSessions,
  streakCurrent,
  streakLongest,
  loadPRs,           // [{ name, weight, reps, prevWeight, changePct }]
  avgRehabPct,
  rehabMissedDays,   // number
  sportsSummary,     // { pickleball: 1, cricket: 0, swimming: 2 }
  bestSession,       // { dayName, pct }
  comment,           // any notable comment from the week
}) {
  const prList = loadPRs.length > 0
    ? loadPRs.map(p => `- ${p.name}: ${p.weight}kg (+${p.changePct}% vs last week)`).join("\n")
    : "No load data logged this week.";

  const sportsLine = Object.entries(sportsSummary)
    .map(([k, v]) => `${k}: ${v}x`)
    .join(", ");

  const prompt = `You are Vidhaan's personal gym coach writing his Sunday weekly report. He has a knee rehab program — this is critical. Be honest, sharp, and specific. Write in 3 short paragraphs (not bullet points). Max 120 words total.

WEEK ${weekKey} DATA:
- Sessions: ${sessionsCompleted}/${totalSessions} planned
- Streak: ${streakCurrent} days (best ever: ${streakLongest})
- Avg knee rehab completion: ${avgRehabPct}%
- Rehab sessions missed or incomplete: ${rehabMissedDays} days
- Best session: ${bestSession?.dayName} at ${bestSession?.pct}% completion
- Sports this week: ${sportsLine || "none"}
${comment ? `- Notable note from week: "${comment}"` : ""}

LOAD PRs THIS WEEK:
${prList}

Write:
Para 1: Honest week summary — what landed, what didn't. Name specific wins.
Para 2: Knee rehab assessment. If avgRehabPct < 75%, be FIRM. This is not negotiable for his recovery. Call out the pattern.
Para 3: One sharp priority for next week. Not a list. One thing.`;

  return await callGemini(prompt);
}
