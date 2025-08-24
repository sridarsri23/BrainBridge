# BrainBridge Architecture

- __Backend__: FastAPI (`server/main.py`) with routers in `server/routers/`, SQLAlchemy models in `server/models.py`, DB session in `server/database.py`.
- __Frontend__: Vite + React + TypeScript in `client/` with routes in `client/src/App.tsx` and pages under `client/src/pages/`.
- __Runner__: Two options
  - Python orchestrator: `run.py` starts backend (port 8001) and Vite dev (port 3000) for local DX.
  - Node bridge: `server/index.ts` (used by npm scripts) boots FastAPI and manages serving static assets in production via `dist/public`.
- __Auth__: JWT-based in `server/auth.py`. Dependencies: `get_current_user()` guards protected routes.
- __AI/Assessment__: Cognitive profile and assessments via `server/ai_agent.py`, `server/openai_integration.py`, and routes in `server/routers/assessment.py`.
  - New micro-briefing video assessment with open-ended grading: endpoint `POST /api/ai/grade-open-ended` in `server/routers/ai_analysis.py`.
  - Analyzer sanitizes/normalizes outputs and guarantees at least 3 `workplace_accommodations` and 3 `career_suggestions` across assessment types.
- __Matching__: `server/matching.py` computes job match scores (0–100) used by `server/routers/jobs.py`.
  - With `CognitiveProfile`: uses CDC strengths, preferences, sensitivities + optional AI assist.
  - Without `CognitiveProfile`: uses assessment progress baseline, job keyword→CDC variety, and `User.preferred_work_setup` so preview matches still vary across jobs. AI assist is optional.
- __Static Serving__: In production, the Node bridge serves the built SPA from `dist/public` and proxies/hosts `/api/*` via FastAPI.

## Key Entry Points
- __API app__: `server/main.py` defines `app`, includes routers, CORS, and SPA serving.
- __DB__: `server/database.py` provides `init_db()` and `get_db()`.
- __Models__: `server/models.py` defines `User`, `JobPosting`, `JobMatch`, `Assessment`, `AssessmentResponse`, `CognitiveProfile`, etc.

## Data Flow (Auth + API)
1. Client authenticates via `POST /api/auth/login` (JWT issued).
2. Client stores token, sends `Authorization: Bearer <token>`.
3. Backend routes depend on `get_current_user()` to authorize.
4. DB access via `Session` from `get_db()`.

## Build/Run
- Dev (DX): `python3 run.py` — Backend: http://localhost:8001, Frontend: http://localhost:3000
- Dev (npm): `npm run dev` — starts Node bridge which boots FastAPI
- Prod: `npm run build` then `npm start` — serves SPA from `dist/public` and runs FastAPI
