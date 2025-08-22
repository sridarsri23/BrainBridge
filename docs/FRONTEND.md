# Frontend

- **Stack**: React + TypeScript, Vite, TailwindCSS
- **Entry**: `client/src/main.tsx`, root `<App />` in `client/src/App.tsx`
- **Routing**: `wouter` in `App.tsx`. Auth-aware routes via `useAuth()`.

## Routes (App)
- Public: `/`, `/login`, `/register`, `/verification-status`, `/self-discovery`, `/test`
- Authenticated: `/` (role-based dashboard), `/profile`, `/self-discovery`, `/job-posting`, `/admin`

## API Access
- Base URL: `/api`
- JWT from auth stored by `useAuth()` and attached to requests.

## Assessments
- Components live under `client/src/components/assessments/`
  - `MicroBriefingComprehension.tsx` — video playback (react-player) + open-ended inputs; calls `POST /api/ai/grade-open-ended` for rubric grading.
  - Integrated in `client/src/pages/self-discovery.tsx` via assessment type `micro_briefing_comprehension`.
  - `SensoryProfileTolerance.tsx` — Likert sliders (Radix Slider) + checkboxes, deterministic local scoring. Optional AI summary via `POST /api/ai/demo-analyze/sensory_profile_tolerance` (works in demo without AI key; real analysis uses `/ai/analyze-assessment/{id}` when configured).
  - Integrated in `client/src/pages/self-discovery.tsx` via assessment type `sensory_profile_tolerance`.

## Dependencies
- `react-player` is used for embedded video playback.
- `@radix-ui/react-slider` is used for Likert sliders.

## Build
- Dev: `npm run dev`
- Prod: `npm run build` outputs to `client/dist`
