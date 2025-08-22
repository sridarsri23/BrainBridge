# Setup

- __Requirements__
  - Python 3.10+
  - Node 18+
  - PostgreSQL (or a DATABASE_URL compatible with SQLAlchemy)

- __Environment__
  - Copy `.env.example` to `.env` (if present). Ensure `DATABASE_URL` is set.
  - `DATABASE_URL` example: `postgresql+psycopg2://user:pass@localhost:5432/brainbridge`
  - AI key: set `AIML_API_KEY` to enable AI analysis and open-ended grading.

- __Install__
  - Python: `python3 -m pip install -e .`
  - Node: `npm install`

- __Run (dev)__
  - `python3 run.py`
  - Backend: http://localhost:8001
  - Frontend: http://localhost:3000
  - Ensure `.env` contains `AIML_API_KEY` for endpoints like `POST /api/ai/grade-open-ended`.

- __Build Frontend (prod)__
  - `npm run build`
  - Serve backend via `python3 run_fastapi.py` (serves SPA from `client/dist` if present)
