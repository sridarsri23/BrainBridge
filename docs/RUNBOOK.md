# Runbook

- __Dev start__
  - Option A (Python orchestrator): `python3 run.py`
    - Stops: Ctrl+C (script cleans up both servers)
  - Option B (Node bridge): `npm run dev` (run from repo root)

- __Backend only__
  - `python3 run_fastapi.py`
  - Env: `PORT=8001` (default). Requires `.env` with `DATABASE_URL`.
  - AI: set `AIML_API_KEY` to enable full AI features. Without it, server runs in limited/demo mode and skips persistent LLM chains.

- __Frontend only__
  - Vite served via orchestrators above. If needed, run `vite` dev from `client/` manually.

- __Logs & Debug__
  - FastAPI: console logs. Validation handled in `server/main.py` with a custom handler.
  - Auth failures: `server/routers/auth.py` raises HTTP errors with user-friendly messages.
  - AI demo: POST `/api/ai/demo-analyze/{assessment_id}` returns sanitized fields even if model output is malformed.

- __Health Check__
  - GET `http://localhost:8001/api/health`

- __DB Init__
  - Tables auto-created on backend startup via `init_db()` in `server/database.py`.
  - Assessments: If POSTing to `/api/assessment/assessments/{assessment_id}/respond` for a known template (e.g., `work_env_matchmaker`) and no instance exists, backend auto-creates from templates.

- __Production__
  - Build frontend: `npm run build` (root) -> outputs to `dist/public`
  - Start server: `npm start` (Node bridge serves `dist/public` and runs FastAPI)
