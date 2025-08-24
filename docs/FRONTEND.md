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
    - Default video URL set to `https://youtu.be/wENihRw0-DE`.
  - Integrated in `client/src/pages/self-discovery.tsx` via assessment type `micro_briefing_comprehension`.
  - `SensoryProfileTolerance.tsx` — Likert sliders (Radix Slider) + checkboxes, deterministic local scoring. Optional AI summary via `POST /api/ai/demo-analyze/sensory_profile_tolerance` (works in demo without AI key; real analysis uses `/ai/analyze-assessment/{id}` when configured).
  - Integrated in `client/src/pages/self-discovery.tsx` via assessment type `sensory_profile_tolerance`.

## Employer Dashboard
- Page: `client/src/pages/employer-dashboard.tsx`
- Features:
  - Top Candidate Matches panel powered by `GET /api/jobs/employer/top-matches`
  - Candidate Details dialog with cognitive strengths and latest assessments via `GET /api/jobs/employer/nd/{nd_id}/details`
  - Work Environment Preferences section in dialog and a CTA “Get Free Trial for Interact” button at the bottom
  - Field mapping: API responses are snake_case (e.g., `job_id`, `job_title`, `is_active`); the page maps to camelCase internally where needed.
  - Stats: "Active Jobs" counts items where `is_active === true` from `GET /api/jobs/employer`.

## Dependencies
- `react-player` is used for embedded video playback.
- `@radix-ui/react-slider` is used for Likert sliders.

## Build
- Dev: `npm run dev`
- Prod: `npm run build` outputs static assets to `dist/public` (served by the Node bridge)

## Profile Form
- Component: `client/src/components/forms/profile-form.tsx`
- Guardian section UI: `client/src/components/forms/guardian-details-section.tsx`
  - Fields (Guardian-only):
    - `ndMindEmail` (maps to backend `nd_adult_email`)
    - `guardianVerificationDoc` (single filename; stored in backend `identity_verification_doc`)
  - File input behavior: cannot prefill; filename preview shown via `useWatch` next to the input.
- Payload handling (Guardian):
  - Frontend strips `identityVerificationDoc` from PUT `/api/user/profile` payload to avoid overwriting.
  - Sends `guardianVerificationDoc` instead; backend maps to `identity_verification_doc`.
