// ============================================================
// WORKOUT_PLAN — EDIT YOUR EXERCISES HERE
//
// STRUCTURE:
//   Each day has an "id" (day1–day7), a name, and "sections".
//   Each section has a "title" and an "exercises" array.
//
// TO EDIT AN EXERCISE:
//   Find the day by its id (e.g. "day3" = Lower Body).
//   Inside that day's sections, find the exercise by name.
//   Change: name, sets, reps, note
//   isRehab: true  → shows green 🩺 badge (knee rehab exercises)
//
// TO ADD AN EXERCISE:
//   Copy an existing exercise object and paste it in the array.
//   Give it a unique id like "d1s6" (day1, strength, exercise 6).
//
// TO ADD A RUNNING / CYCLING WORKOUT (future):
//   See CARDIO_WORKOUTS at the bottom of this file.
//   Add a new entry there. The app will auto-show it in the Sports tab.
// ============================================================

export const WORKOUT_PLAN = [
  {
    id: "day1",
    label: "Day 1",
    name: "Push",
    focus: "Chest · Shoulders · Triceps",
    color: "#FF6B35",
    icon: "💪",
    type: "strength",
    duration: "60 min strength + 30 min cardio",
    sections: [
      {
        title: "Strength",
        exercises: [
          { id: "d1s1", name: "Flat Machine Chest Press",           sets: 4, reps: "8–10",  note: "" },
          { id: "d1s2", name: "Cable Incline Flys",                 sets: 3, reps: "12–15", note: "" },
          { id: "d1s3", name: "Overhead Machine Shoulder Press",    sets: 3, reps: "8–10",  note: "" },
          { id: "d1s4", name: "Dumbbell Lateral Raises",            sets: 3, reps: "12–15", note: "" },
          { id: "d1s5", name: "Tricep Rope Pushdowns",              sets: 3, reps: "12–15", note: "" },
        ],
      },
      {
        title: "Knee Rehab",
        exercises: [
          { id: "d1r1", name: "Clamshells (Glute Med Activation)",       sets: 3, reps: "15/side", note: "Resistance band. Slow & controlled.", isRehab: true },
          { id: "d1r2", name: "Standing Hip Abduction (Band)",           sets: 3, reps: "15/side", note: "Activate before any lower work.",     isRehab: true },
          { id: "d1r3", name: "Hip Flexor Stretch (90/90 or Couch)",     sets: 3, reps: "45s/side", note: "Hold, breathe, release tension.",   isRehab: true },
        ],
      },
      {
        title: "Core",
        exercises: [
          { id: "d1c1", name: "Hanging Leg Raises", sets: 3, reps: "15", note: "" },
        ],
      },
      {
        title: "Cardio",
        exercises: [
          { id: "d1cd1", name: "Treadmill Brisk Walk / Cycling", sets: 1, reps: "30 min", note: "HR 110–130 bpm. Avoid incline >3% if knee flares." },
        ],
      },
    ],
  },

  {
    id: "day2",
    label: "Day 2",
    name: "Pull",
    focus: "Back · Biceps",
    color: "#4ECDC4",
    icon: "🔙",
    type: "strength",
    duration: "60 min strength + 30 min cardio",
    sections: [
      {
        title: "Strength",
        exercises: [
          { id: "d2s1", name: "Lat Pulldowns",        sets: 4, reps: "8–10",  note: "" },
          { id: "d2s2", name: "Seated Cable Rows",    sets: 4, reps: "10–12", note: "" },
          { id: "d2s3", name: "Face Pulls",           sets: 3, reps: "12–15", note: "" },
          { id: "d2s4", name: "Dumbbell Hammer Curls",sets: 3, reps: "12–15", note: "" },
          { id: "d2s5", name: "Cable Rear Delt Flys", sets: 3, reps: "12–15", note: "" },
        ],
      },
      {
        title: "Knee Rehab",
        exercises: [
          { id: "d2r1", name: "IT Band Foam Roll",            sets: 1, reps: "60s/side",  note: "Slow roll, pause on tight spots.",      isRehab: true },
          { id: "d2r2", name: "TFL & Glute Med Stretch",      sets: 3, reps: "40s/side",  note: "Figure-4 or pigeon pose variant.",      isRehab: true },
          { id: "d2r3", name: "Side-Lying Hip Abduction",     sets: 3, reps: "15/side",   note: "No band needed. Feel glute med fire.",  isRehab: true },
        ],
      },
      {
        title: "Core",
        exercises: [
          { id: "d2c1", name: "Bird Dogs", sets: 3, reps: "10/side", note: "" },
        ],
      },
      {
        title: "Cardio",
        exercises: [
          { id: "d2cd1", name: "Incline Treadmill Walk / Rowing", sets: 1, reps: "30 min", note: "HR 110–130 bpm." },
        ],
      },
    ],
  },

  {
    id: "day3",
    label: "Day 3",
    name: "Lower Body",
    focus: "Quads · Hamstrings · Glutes",
    color: "#A78BFA",
    icon: "🦵",
    type: "strength",
    duration: "60 min strength + 30 min cardio",
    sections: [
      {
        title: "Knee Rehab — Do FIRST",
        exercises: [
          { id: "d3r1", name: "Glute Bridge (Double Leg)",            sets: 3, reps: "15",       note: "Activate glutes before loading knees.",              isRehab: true },
          { id: "d3r2", name: "Clamshells with Band",                 sets: 3, reps: "15/side",  note: "Glute med prep.",                                    isRehab: true },
          { id: "d3r3", name: "Wall Sit (Partial, 60° max)",          sets: 2, reps: "30 sec",   note: "Only if pain-free. Stop at 60° knee bend.",          isRehab: true },
          { id: "d3r4", name: "Terminal Knee Extensions (TKE, Band)", sets: 3, reps: "15/side",  note: "VMO strengthening — key for patella tracking.",      isRehab: true },
        ],
      },
      {
        title: "Strength",
        exercises: [
          { id: "d3s1", name: "Leg Press",                                   sets: 4, reps: "10–12", note: "Feet shoulder-width, mid-platform. Stop at 90° if pain." },
          { id: "d3s2", name: "Reverse Lunges (knee-safe swap)",             sets: 3, reps: "10/leg", note: "⚠️ Step BACK not forward. Controlled descent." },
          { id: "d3s3", name: "Seated Leg Curls",                            sets: 4, reps: "12–15",  note: "" },
          { id: "d3s4", name: "Step-Ups (Low Box 6–8\", bodyweight only)",   sets: 3, reps: "12/leg", note: "⚠️ No added weight until knee stable." },
          { id: "d3s5", name: "Standing Calf Raises",                        sets: 3, reps: "15–20",  note: "" },
        ],
      },
      {
        title: "Core",
        exercises: [
          { id: "d3c1", name: "Front Plank",  sets: 3, reps: "45–60s", note: "" },
          { id: "d3c2", name: "Side Plank",   sets: 3, reps: "45s/side", note: "" },
        ],
      },
      {
        title: "Cardio",
        exercises: [
          { id: "d3cd1", name: "Cycling / Rowing", sets: 1, reps: "30 min", note: "HR 110–130 bpm. Cycling preferred — low knee impact." },
        ],
      },
    ],
  },

  {
    id: "day4",
    label: "Day 4",
    name: "Recovery",
    focus: "Active Recovery · Mobility",
    color: "#34D399",
    icon: "🧘",
    type: "recovery",
    duration: "30–45 min total",
    sections: [
      {
        title: "Knee Rehab — Priority",
        exercises: [
          { id: "d4r1", name: "IT Band Foam Roll",          sets: 1, reps: "90s/side", note: "Full outer leg, very slow.",            isRehab: true },
          { id: "d4r2", name: "Hip Flexor Couch Stretch",   sets: 3, reps: "60s/side", note: "Breathe into the stretch.",             isRehab: true },
          { id: "d4r3", name: "90/90 Hip Stretch",          sets: 3, reps: "60s/side", note: "Glute med + TFL release.",              isRehab: true },
          { id: "d4r4", name: "Pigeon Pose",                sets: 2, reps: "60s/side", note: "Deep glute release.",                   isRehab: true },
          { id: "d4r5", name: "VMO Squeezes (Seated)",      sets: 3, reps: "15",       note: "Towel under knee. Low-load VMO fire.",  isRehab: true },
        ],
      },
      {
        title: "Core",
        exercises: [
          { id: "d4c1", name: "Dead Bug",         sets: 3, reps: "12",       note: "Slow. Back flat to floor. No lumbar arch." },
          { id: "d4c2", name: "Russian Twists",   sets: 3, reps: "15/side",  note: "Light weight or bodyweight." },
        ],
      },
      {
        title: "Mobility",
        exercises: [
          { id: "d4m1", name: "Light Stretching / Yoga Flow", sets: 1, reps: "20–30 min", note: "Focus on hips, quads, hamstrings." },
        ],
      },
      {
        title: "Optional Cardio",
        exercises: [
          { id: "d4cd1", name: "Light Walk", sets: 1, reps: "20 min", note: "Easy pace. Just move." },
        ],
      },
    ],
  },

  {
    id: "day5",
    label: "Day 5",
    name: "Push Vol.",
    focus: "Chest · Shoulders · Triceps",
    color: "#F59E0B",
    icon: "🔥",
    type: "strength",
    duration: "60 min strength + 30 min cardio",
    sections: [
      {
        title: "Strength",
        exercises: [
          { id: "d5s1", name: "Flat Dumbbell Bench Press",          sets: 4, reps: "8–10",  note: "" },
          { id: "d5s2", name: "Landmine Press",                     sets: 4, reps: "10",    note: "" },
          { id: "d5s3", name: "Front Plate Raises",                 sets: 3, reps: "12–15", note: "" },
          { id: "d5s4", name: "Arnold Press",                       sets: 3, reps: "10–12", note: "" },
          { id: "d5s5", name: "Overhead Tricep Dumbbell Extension", sets: 3, reps: "12–15", note: "" },
        ],
      },
      {
        title: "Knee Rehab",
        exercises: [
          { id: "d5r1", name: "Single-Leg Glute Bridge",        sets: 3, reps: "12/side", note: "Progress from double-leg. Great glute med loader.", isRehab: true },
          { id: "d5r2", name: "Band Hip Abduction (Standing)",  sets: 3, reps: "15/side", note: "Slow, controlled.",                                 isRehab: true },
          { id: "d5r3", name: "Hip Flexor Dynamic Stretch",     sets: 2, reps: "10/side", note: "Lunge walk with reach. Loosen TFL.",               isRehab: true },
        ],
      },
      {
        title: "Core",
        exercises: [
          { id: "d5c1", name: "Hanging Knee Tucks", sets: 3, reps: "15", note: "" },
        ],
      },
      {
        title: "Cardio",
        exercises: [
          { id: "d5cd1", name: "Stair Climber / Treadmill Walk", sets: 1, reps: "30 min", note: "HR 110–130 bpm. Skip stair climber if knee flares." },
        ],
      },
    ],
  },

  {
    id: "day6",
    label: "Day 6",
    name: "Pull Vol.",
    focus: "Back · Biceps",
    color: "#EC4899",
    icon: "💎",
    type: "strength",
    duration: "60 min strength + 30 min cardio",
    sections: [
      {
        title: "Strength",
        exercises: [
          { id: "d6s1", name: "Pull-Ups (Assisted Optional)",   sets: 4, reps: "8–10",     note: "" },
          { id: "d6s2", name: "Single-Arm Dumbbell Rows",       sets: 4, reps: "10–12/side",note: "" },
          { id: "d6s3", name: "Cable Rear Delt Flys",           sets: 3, reps: "12–15",    note: "" },
          { id: "d6s4", name: "Incline Dumbbell Curls",         sets: 3, reps: "12–15",    note: "" },
          { id: "d6s5", name: "Spider Curls / Cable Curls",     sets: 3, reps: "12–15",    note: "" },
        ],
      },
      {
        title: "Knee Rehab",
        exercises: [
          { id: "d6r1", name: "IT Band Stretch (Standing)",     sets: 3, reps: "45s/side", note: "Cross leg behind, lean away.",            isRehab: true },
          { id: "d6r2", name: "Lateral Band Walks",             sets: 3, reps: "15 steps/side", note: "Mini band above knees. Low squat.", isRehab: true },
          { id: "d6r3", name: "Terminal Knee Extension (TKE)",  sets: 3, reps: "15/side",  note: "VMO & patella stability work.",           isRehab: true },
        ],
      },
      {
        title: "Core",
        exercises: [
          { id: "d6c1", name: "Ab Wheel Rollouts", sets: 3, reps: "10–12", note: "" },
        ],
      },
      {
        title: "Cardio",
        exercises: [
          { id: "d6cd1", name: "Incline Treadmill / Elliptical", sets: 1, reps: "30 min", note: "HR 110–130 bpm." },
        ],
      },
    ],
  },

  {
    id: "day7",
    label: "Day 7",
    name: "Rest",
    focus: "Full Recovery",
    color: "#6B7280",
    icon: "😴",
    type: "rest",
    duration: "Light activity only",
    sections: [
      {
        title: "Recovery",
        exercises: [
          { id: "d7r1", name: "Light Walking",               sets: 1, reps: "20–30 min", note: "Easy pace. No gym." },
          { id: "d7r2", name: "Full Body Stretch",           sets: 1, reps: "15 min",    note: "Hip flexors, hamstrings, chest, shoulders." },
          { id: "d7r3", name: "Hip Flexor & IT Band Release",sets: 1, reps: "10 min",    note: "Foam roll + hold stretches.", isRehab: true },
        ],
      },
    ],
  },
];

// ============================================================
// SPORTS & CARDIO ACTIVITIES
//
// TO ADD RUNNING IN THE FUTURE:
//   Copy the template below and uncomment it.
//   The app will auto-show it in the Sports tab.
//
// TO ADD CYCLING:
//   Same — just change name, icon, freq, color.
//
// Template:
// {
//   id: "running",
//   name: "Running",
//   icon: "🏃",
//   color: "#EF4444",
//   freq: "3x/week",
//   category: "cardio",      ← add this for future cardio-specific tracking
//   targetMinutes: 30,       ← used for future duration logging
//   targetDistanceKm: 5,     ← used for future distance logging
// }
// ============================================================
export const SPORTS_ACTIVITIES = [
  { id: "pickleball", name: "Pickleball", icon: "🏓", color: "#10B981", freq: "1x/week", category: "sport" },
  { id: "cricket",    name: "Cricket",   icon: "🏏", color: "#F97316", freq: "1x/week", category: "sport" },
  { id: "swim1",      name: "Swimming",  icon: "🏊", color: "#3B82F6", freq: "Session 1 of 2", category: "sport" },
  { id: "swim2",      name: "Swimming",  icon: "🏊", color: "#60A5FA", freq: "Session 2 of 2", category: "sport" },
  // Future: uncomment to add running
  // { id: "running",  name: "Running",   icon: "🏃", color: "#EF4444", freq: "3x/week", category: "cardio", targetMinutes: 30, targetDistanceKm: 5 },
  // { id: "cycling",  name: "Cycling",   icon: "🚴", color: "#8B5CF6", freq: "2x/week", category: "cardio", targetMinutes: 45, targetDistanceKm: 20 },
];

export const MOTIVATIONAL_MESSAGES = [
  "Consistency > Intensity. Show up.",
  "Your future self is watching.",
  "Knee rehab is strength training too.",
  "Small wins compound. Keep going.",
  "You didn't come this far to stop.",
  "Body transforms in silence.",
  "Every rep is a vote for who you're becoming.",
  "Rest is part of the plan. So is showing up.",
  "You're building the version of yourself that people will notice.",
  "365 days of showing up — that's a different person.",
];
