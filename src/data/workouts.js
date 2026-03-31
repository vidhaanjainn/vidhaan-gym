// ============================================================
// WORKOUT_PLAN — EDIT YOUR EXERCISES HERE
//
// Each exercise can have:
//   importance: string  — why this exercise matters (shown in missed breakdown)
//   isRehab: true       — shows green 🩺 badge
//   canSwap: ["id1","id2"] — allowed swap alternatives (future)
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
          { id: "d1s1", name: "Flat Machine Chest Press",        sets: 4, reps: "8–10",  note: "", importance: "Primary chest builder. Machine path keeps shoulders safe while loading the pec fully." },
          { id: "d1s2", name: "Cable Incline Flys",              sets: 3, reps: "12–15", note: "", importance: "Upper chest isolation. Cable keeps constant tension through the full range — dumbbells can't do this." },
          { id: "d1s3", name: "Overhead Machine Shoulder Press", sets: 3, reps: "8–10",  note: "", importance: "Overhead pressing builds the anterior and medial delt. Skipping this kills shoulder width over time." },
          { id: "d1s4", name: "Dumbbell Lateral Raises",         sets: 3, reps: "12–15", note: "", importance: "Lateral delts are what create the wide shoulder look. Nothing else trains this angle." },
          { id: "d1s5", name: "Tricep Rope Pushdowns",           sets: 3, reps: "12–15", note: "", importance: "Triceps are 2/3 of arm size. Rope hits the long head through full extension." },
        ],
      },
      {
        title: "Knee Rehab",
        exercises: [
          { id: "d1r1", name: "Clamshells (Glute Med Activation)", sets: 3, reps: "15/side", note: "Resistance band. Slow & controlled.", isRehab: true, importance: "Glute med is the primary stabiliser of your knee under load. Weak glute med = valgus collapse on every squat and lunge." },
          { id: "d1r2", name: "Standing Hip Abduction (Band)",     sets: 3, reps: "15/side", note: "Activate before any lower work.",   isRehab: true, importance: "Reinforces hip abduction in the standing position — exactly how your hip should function during single-leg loading." },
          { id: "d1r3", name: "Hip Flexor Stretch (90/90 or Couch)", sets: 3, reps: "45s/side", note: "Hold, breathe, release tension.", isRehab: true, importance: "Tight hip flexors tilt your pelvis forward and load your lower back on every heavy compound. Non-negotiable." },
        ],
      },
      {
        title: "Core",
        exercises: [
          { id: "d1c1", name: "Hanging Leg Raises", sets: 3, reps: "15", note: "", importance: "Hip flexor strength through full range plus anti-extension core — direct carry-over to deadlifts and rows." },
        ],
      },
      {
        title: "Cardio",
        exercises: [
          { id: "d1cd1", name: "Treadmill Brisk Walk / Cycling", sets: 1, reps: "30 min", note: "HR 110–130 bpm. Avoid incline >3% if knee flares.", importance: "Zone 2 cardio improves mitochondrial density and recovery capacity. You recover faster between sets and between sessions." },
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
          { id: "d2s1", name: "Lat Pulldowns",         sets: 4, reps: "8–10",  note: "", importance: "Primary lat builder. Width comes from here. Skipping this is the single biggest reason people have flat backs." },
          { id: "d2s2", name: "Seated Cable Rows",     sets: 4, reps: "10–12", note: "", importance: "Mid-back thickness. Rhomboids and mid traps — the muscles that stop you looking hunched." },
          { id: "d2s3", name: "Face Pulls",            sets: 3, reps: "12–15", note: "", importance: "Rear delt and external rotator health. Your shoulder joint longevity depends on this. Non-negotiable for anyone pressing heavy." },
          { id: "d2s4", name: "Dumbbell Hammer Curls", sets: 3, reps: "12–15", note: "", importance: "Brachialis and brachioradialis — these give arms that thick, full look from all angles, not just the classic bicep peak." },
          { id: "d2s5", name: "Cable Rear Delt Flys",  sets: 3, reps: "12–15", note: "", importance: "Rear delts balance the front delt dominant push work. Neglect this and your posture and shoulder health both suffer." },
        ],
      },
      {
        title: "Knee Rehab",
        exercises: [
          { id: "d2r1", name: "IT Band Foam Roll",        sets: 1, reps: "60s/side", note: "Slow roll, pause on tight spots.",     isRehab: true, importance: "IT band tightness directly alters patella tracking. Rolling releases the TFL and reduces lateral knee pull." },
          { id: "d2r2", name: "TFL & Glute Med Stretch",  sets: 3, reps: "40s/side", note: "Figure-4 or pigeon pose variant.",     isRehab: true, importance: "TFL tightness creates IT band tension and pulls the patella laterally. This stretch is specifically addressing your knee pain source." },
          { id: "d2r3", name: "Side-Lying Hip Abduction", sets: 3, reps: "15/side",  note: "No band needed. Feel glute med fire.", isRehab: true, importance: "Isolated glute med work in a position where it can't cheat. Builds the base strength for all standing rehab exercises." },
        ],
      },
      {
        title: "Core",
        exercises: [
          { id: "d2c1", name: "Bird Dogs", sets: 3, reps: "10/side", note: "", importance: "Anti-rotation and contralateral stability. Trains the pattern your spine uses during every compound movement." },
        ],
      },
      {
        title: "Cardio",
        exercises: [
          { id: "d2cd1", name: "Incline Treadmill Walk / Rowing", sets: 1, reps: "30 min", note: "HR 110–130 bpm.", importance: "Rowing is zero knee impact with full body aerobic stimulus. Incline walk builds posterior chain endurance." },
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
          { id: "d3r1", name: "Glute Bridge (Double Leg)",            sets: 3, reps: "15",      note: "Activate glutes before loading knees.", isRehab: true, importance: "Pre-activates glutes so they fire first under load — not your quads compensating. Directly reduces knee stress on every subsequent exercise." },
          { id: "d3r2", name: "Clamshells with Band",                 sets: 3, reps: "15/side", note: "Glute med prep.",                      isRehab: true, importance: "On leg day specifically, skipping this means your glute med is cold during leg press and lunges. That's how valgus collapse happens." },
          { id: "d3r3", name: "Wall Sit (Partial, 60° max)",          sets: 2, reps: "30 sec",  note: "Only if pain-free. Stop at 60° bend.", isRehab: true, importance: "Isometric quad loading in the exact range you'll use in leg press. Prepares the VMO specifically." },
          { id: "d3r4", name: "Terminal Knee Extensions (TKE, Band)", sets: 3, reps: "15/side", note: "VMO strengthening — key for patella.", isRehab: true, importance: "VMO is the quad muscle that controls the last 15° of knee extension and tracks the patella medially. This is the single most important exercise for your knee diagnosis." },
        ],
      },
      {
        title: "Strength",
        exercises: [
          { id: "d3s1", name: "Leg Press",                                  sets: 4, reps: "10–12", note: "Feet shoulder-width, mid-platform. Stop at 90°.", importance: "Primary quad and glute builder with controllable knee angle. Your safest heavy lower body compound right now." },
          { id: "d3s2", name: "Reverse Lunges (knee-safe swap)",            sets: 3, reps: "10/leg", note: "⚠️ Step BACK not forward. Controlled descent.", importance: "Single-leg strength without the forward knee shear of regular lunges. Critical for real-world leg strength and glute development." },
          { id: "d3s3", name: "Seated Leg Curls",                           sets: 4, reps: "12–15",  note: "", importance: "Hamstring isolation. Weak hamstrings are a primary contributor to knee instability. Most people's hamstrings are undertrained relative to quads." },
          { id: "d3s4", name: "Step-Ups (Low Box 6–8\", bodyweight only)",  sets: 3, reps: "12/leg", note: "⚠️ No added weight until knee stable.", importance: "Functional single-leg strength that directly transfers to stairs, sport, and daily movement. Builds VMO eccentrically." },
          { id: "d3s5", name: "Standing Calf Raises",                       sets: 3, reps: "15–20",  note: "", importance: "Calves control ankle dorsiflexion. Tight calves force compensatory knee valgus on squat patterns." },
        ],
      },
      {
        title: "Core",
        exercises: [
          { id: "d3c1", name: "Front Plank", sets: 3, reps: "45–60s",  note: "", importance: "Anti-extension core stability — what keeps your spine safe under leg press and squat loads." },
          { id: "d3c2", name: "Side Plank",  sets: 3, reps: "45s/side", note: "", importance: "Lateral core and glute med endurance. Directly supports hip stability during single-leg exercises." },
        ],
      },
      {
        title: "Cardio",
        exercises: [
          { id: "d3cd1", name: "Cycling / Rowing", sets: 1, reps: "30 min", note: "HR 110–130 bpm. Cycling preferred.", importance: "Cycling keeps the knee joint moving through low-load range — actually therapeutic post-leg day rather than stressful." },
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
          { id: "d4r1", name: "IT Band Foam Roll",        sets: 1, reps: "90s/side", note: "Full outer leg, very slow.",  isRehab: true, importance: "Recovery day is your best window for tissue work — no acute muscle damage competing for blood flow. Missing this today means tighter IT band tomorrow." },
          { id: "d4r2", name: "Hip Flexor Couch Stretch", sets: 3, reps: "60s/side", note: "Breathe into the stretch.",   isRehab: true, importance: "The couch stretch is one of the most effective hip flexor lengtheners available. 3 days of skipping this and your anterior pelvic tilt comes back." },
          { id: "d4r3", name: "90/90 Hip Stretch",        sets: 3, reps: "60s/side", note: "Glute med + TFL release.",    isRehab: true, importance: "Addresses both internal and external hip rotation restriction. Your knee tracks based on hip rotation — this is foundational." },
          { id: "d4r4", name: "Pigeon Pose",              sets: 2, reps: "60s/side", note: "Deep glute release.",          isRehab: true, importance: "Deep glute and piriformis release. Sciatic nerve tension often originates here and refers pain to the knee." },
          { id: "d4r5", name: "VMO Squeezes (Seated)",    sets: 3, reps: "15",       note: "Towel under knee. Low-load.", isRehab: true, importance: "Low-load VMO activation on a recovery day keeps the neural pattern fresh without stressing the joint. Consistency here beats intensity." },
        ],
      },
      {
        title: "Core",
        exercises: [
          { id: "d4c1", name: "Dead Bug",       sets: 3, reps: "12",      note: "Slow. Back flat to floor.", importance: "Anti-extension with contralateral limb movement — exactly what your spine does during walking and running. Zero joint stress." },
          { id: "d4c2", name: "Russian Twists", sets: 3, reps: "15/side", note: "Light weight or bodyweight.", importance: "Rotational core work. Most gym programs miss rotation entirely — this fills that gap." },
        ],
      },
      {
        title: "Mobility",
        exercises: [
          { id: "d4m1", name: "Light Stretching / Yoga Flow", sets: 1, reps: "20–30 min", note: "Focus on hips, quads, hamstrings.", importance: "Systemic mobility work improves tissue quality and joint range. Even 20 minutes consistently compounds significantly over months." },
        ],
      },
      {
        title: "Optional Cardio",
        exercises: [
          { id: "d4cd1", name: "Light Walk", sets: 1, reps: "20 min", note: "Easy pace. Just move.", importance: "Blood flow without loading. Accelerates muscle repair through increased circulation. The Japanese call this 'active recovery' for a reason." },
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
          { id: "d5s1", name: "Flat Dumbbell Bench Press",          sets: 4, reps: "8–10",  note: "", importance: "Dumbbell variation hits each side independently — no dominant side compensating. Greater range of motion than barbell or machine." },
          { id: "d5s2", name: "Landmine Press",                     sets: 4, reps: "10",    note: "", importance: "Shoulder-friendly pressing angle that trains the upper chest and anterior delt simultaneously. Hard to replicate with other movements." },
          { id: "d5s3", name: "Front Plate Raises",                 sets: 3, reps: "12–15", note: "", importance: "Anterior delt isolation in the scapular plane. Balances the lateral and rear delt work done elsewhere." },
          { id: "d5s4", name: "Arnold Press",                       sets: 3, reps: "10–12", note: "", importance: "Full shoulder rotation through the press — hits all three delt heads in one movement. The rotation component is unique." },
          { id: "d5s5", name: "Overhead Tricep Dumbbell Extension", sets: 3, reps: "12–15", note: "", importance: "Long head of tricep is only fully stretched overhead. This is the head that gives arms that full horseshoe shape." },
        ],
      },
      {
        title: "Knee Rehab",
        exercises: [
          { id: "d5r1", name: "Single-Leg Glute Bridge",       sets: 3, reps: "12/side", note: "Progress from double-leg.", isRehab: true, importance: "The single-leg variation loads glute med and max through full range. This is a direct progression from the double-leg version and the gap between them matters." },
          { id: "d5r2", name: "Band Hip Abduction (Standing)", sets: 3, reps: "15/side", note: "Slow, controlled.",         isRehab: true, importance: "Standing abduction trains the glute med in the position it needs to work — weight-bearing. Seated work doesn't transfer the same way." },
          { id: "d5r3", name: "Hip Flexor Dynamic Stretch",    sets: 2, reps: "10/side", note: "Lunge walk with reach.",    isRehab: true, importance: "Dynamic version prepares the hip for movement patterns. More effective pre-session than static holds for neural readiness." },
        ],
      },
      {
        title: "Core",
        exercises: [
          { id: "d5c1", name: "Hanging Knee Tucks", sets: 3, reps: "15", note: "", importance: "Hip flexor strength through full range plus grip endurance. Harder than hanging leg raises but more accessible." },
        ],
      },
      {
        title: "Cardio",
        exercises: [
          { id: "d5cd1", name: "Stair Climber / Treadmill Walk", sets: 1, reps: "30 min", note: "Skip stair climber if knee flares.", importance: "Stair climber is posterior chain dominant cardio — glutes work significantly. Good metabolic stimulus without high knee impact if done correctly." },
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
          { id: "d6s1", name: "Pull-Ups (Assisted Optional)",  sets: 4, reps: "8–10",      note: "", importance: "Compound vertical pull with bodyweight. Builds the lat-to-waist taper that no machine fully replicates. Assisted is still highly effective." },
          { id: "d6s2", name: "Single-Arm Dumbbell Rows",     sets: 4, reps: "10–12/side", note: "", importance: "Heaviest load you can put on the mid-back. Unilateral means no side can hide. Direct rhomboid and lower trap stimulus." },
          { id: "d6s3", name: "Cable Rear Delt Flys",         sets: 3, reps: "12–15",      note: "", importance: "Rear delts are chronically undertrained. This is your second hit this week — necessary for the muscle group to actually grow." },
          { id: "d6s4", name: "Incline Dumbbell Curls",       sets: 3, reps: "12–15",      note: "", importance: "Incline position stretches the long head of bicep at the bottom. The stretch position is where most growth stimulus comes from." },
          { id: "d6s5", name: "Spider Curls / Cable Curls",   sets: 3, reps: "12–15",      note: "", importance: "Peak contraction focus. Cable keeps tension at the top — the position where dumbbells go slack. Alternating these maximises both ends of the range." },
        ],
      },
      {
        title: "Knee Rehab",
        exercises: [
          { id: "d6r1", name: "IT Band Stretch (Standing)",    sets: 3, reps: "45s/side",     note: "Cross leg behind, lean away.",   isRehab: true, importance: "By day 6 the IT band has accumulated training load all week. This stretch is clearing the tension before rest day — skip it and you start next week already restricted." },
          { id: "d6r2", name: "Lateral Band Walks",           sets: 3, reps: "15 steps/side", note: "Mini band above knees. Low squat.", isRehab: true, importance: "Glute med endurance training. The last rehab session of the week — finish it. These directly prevent the lateral knee pull that's been causing your issues." },
          { id: "d6r3", name: "Terminal Knee Extension (TKE)", sets: 3, reps: "15/side",      note: "VMO & patella stability work.",  isRehab: true, importance: "Second TKE session this week. VMO needs frequency to respond — two sessions per week is the minimum effective dose for your diagnosis." },
        ],
      },
      {
        title: "Core",
        exercises: [
          { id: "d6c1", name: "Ab Wheel Rollouts", sets: 3, reps: "10–12", note: "", importance: "The hardest anti-extension core exercise in your program. Builds the deep abdominal wall strength that protects the spine under heavy loads." },
        ],
      },
      {
        title: "Cardio",
        exercises: [
          { id: "d6cd1", name: "Incline Treadmill / Elliptical", sets: 1, reps: "30 min", note: "HR 110–130 bpm.", importance: "Elliptical is zero-impact — your best cardio option when legs are accumulated fatigue after a full week. Smart choice for session 6." },
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
          { id: "d7r1", name: "Light Walking",               sets: 1, reps: "20–30 min", note: "Easy pace. No gym.", importance: "Walking on rest day maintains blood flow and nervous system activity without adding stress. Sedentary rest is actually worse than light movement." },
          { id: "d7r2", name: "Full Body Stretch",           sets: 1, reps: "15 min",    note: "Hip flexors, hamstrings, chest, shoulders.", importance: "Weekly reset of tissue length. Skipping this means each Monday you start the week slightly less mobile than the last." },
          { id: "d7r3", name: "Hip Flexor & IT Band Release", sets: 1, reps: "10 min",   note: "Foam roll + hold stretches.", isRehab: true, importance: "End-of-week tissue maintenance. Your IT band and hip flexors have taken load all week. This is the maintenance session that keeps next week clean." },
        ],
      },
    ],
  },
];

export const SPORTS_ACTIVITIES = [
  { id: "pickleball", name: "Pickleball", icon: "🏓", color: "#10B981", freq: "1x/week", category: "sport" },
  { id: "cricket",    name: "Cricket",    icon: "🏏", color: "#F97316", freq: "1x/week", category: "sport" },
  { id: "swim1",      name: "Swimming",   icon: "🏊", color: "#3B82F6", freq: "Session 1 of 2", category: "sport" },
  { id: "swim2",      name: "Swimming",   icon: "🏊", color: "#60A5FA", freq: "Session 2 of 2", category: "sport" },
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
