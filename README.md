# Vidhaan Gym Tracker

Personal workout tracker — PWA, iPhone-optimized, localStorage persistence.

## To Edit Exercises
Open `src/data/workouts.js` — all exercises are at the top in `WORKOUT_PLAN`.
Find your day by `id` (day1–day7), edit the exercise name/sets/reps/note.

## To Add Running / Cycling Later
In `src/data/workouts.js`, scroll to the bottom.
Uncomment the running or cycling template in `SPORTS_ACTIVITIES`.
The app picks it up automatically.

## Local Development
```bash
npm install
npm start
```

## Deploy to Vercel
Just push to GitHub. Vercel auto-deploys on every commit.
Build command: `npm run build`
Output directory: `build`
