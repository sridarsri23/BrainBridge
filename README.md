# 🧠 BrainBridge

**BrainBridge** is a production-grade platform designed to bridge neurodiverse talent with organizations seeking specialized skills.  
It provides AI-driven task matching, and inclusion-focused analytics to empower companies and individuals alike.

---

## 🚀 Features

- **AI-Powered Task Matching** – Matches neurodiverse professionals with suitable tasks/projects.
- **Inclusive Workforce Analytics** – Visualize inclusion metrics and progress over time.
- **Secure Role-Based Access Control** – Fine-grained permissions for admins, recruiters, and candidates.
- **Responsive UI** – Accessible, mobile-friendly design built with Tailwind CSS.
- **Scalable Backend** – Modular and API-first architecture.

# BrainBridge – ND Adult Job Matching Platform

A full-stack monorepo that pairs a React + Vite frontend with a FastAPI backend and PostgreSQL. The backend serves both the REST API (under `/api/*`) and, after building, the frontend SPA from `dist/public`.

## Table of contents
- Overview
- Tech stack
- Architecture and interaction
- Repository layout
- Local setup (Windows/macOS/Linux)
  - Prerequisites
  - Environment variables (.env)
  - PostgreSQL setup (Docker or native)
  - Install dependencies
  - Build frontend
  - Initialize database tables
  - Run the backend (serves API + SPA)
- Development workflow tips
- API surface (high level)
- Troubleshooting common issues
- Project scripts

## Overview
BrainBridge connects neurodivergent job seekers and employers. It includes authentication, user and profile management, job postings, and job match endpoints. The frontend talks to the backend using a JWT Bearer token.

## Tech stack
- Frontend
  - React 18, TypeScript, Vite
  - TanStack Query, Wouter (routing)
  - TailwindCSS + Radix UI primitives (shadcn/ui components under `client/src/components/ui`)
- Backend
  - FastAPI, Uvicorn
  - SQLAlchemy 2.0 (PostgreSQL), Pydantic v2
  - JWT via python-jose, password hashing via passlib[bcrypt]
  - CORS via Starlette middleware
- Database
  - PostgreSQL (psycopg2 driver)

## Architecture and interaction
- Monorepo: single workspace contains frontend and backend.
- Build → Serve: Vite builds the frontend into `dist/public`. FastAPI serves these static assets and the `index.html`, so both API and UI run on the same origin (default port 5000).
- API namespace: All backend endpoints live under `/api/*`.
- Auth: Client calls `/api/auth/login`, receives `access_token` (JWT). The token is stored client-side and sent as `Authorization: Bearer <token>` on protected requests. The backend validates the JWT via `server/auth.py` dependencies.

### Request flow (high level)
1. User registers/logs in via `/api/auth/register` or `/api/auth/login`.
2. Backend stores users in PostgreSQL, returns a JWT on login.
3. Frontend persists the JWT and includes it in `Authorization` headers.
4. Protected routes (e.g., `/api/users`, `/api/profiles`, `/api/jobs`) use `get_current_user` to authorize requests.
5. Frontend uses TanStack Query to fetch and cache data.

## Repository layout
```
BrainBridge/
  client/                 # React app (Vite root)
    index.html
    src/
      App.tsx            # Router/providers
      hooks/             # Auth, toast hooks
      lib/               # Fetch/query helpers
      pages/             # Landing, dashboards, auth, profiles, jobs
      components/        # Feature and UI components
  server/
    main.py              # FastAPI app: routers, CORS, static serving
    database.py          # SQLAlchemy engine/session, Base (shared)
    models.py            # SQLAlchemy models/enums (PostgreSQL UUID)
    schemas.py           # Pydantic request/response models
    routers/             # auth, users, profiles, jobs, admin
  init_db.py             # Creates all tables (metadata.create_all)
  run_fastapi.py         # Uvicorn runner in dev
  vite.config.ts         # Vite root at ./client, build to ./dist/public
  tailwind.config.ts     # Tailwind config
  pyproject.toml         # Python dependencies
  package.json           # Node dependencies & scripts
```

## Local setup

### Run via a script

```bash
npm run setup
```

Note: For this to work you need to have docker desktop installed and up and running in the background.

### OR

### 1) Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL 14+ (or Docker Desktop)

### 2) Environment variables (.env)
Create a `.env` file in the project root:
```dotenv
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/brainbridge
SECRET_KEY=change_me_in_prod
PORT=5000
```
Notes:
- Use the `postgresql+psycopg2://` scheme (matches installed driver).
- URL-encode special characters in the password if needed.

### 3) PostgreSQL setup

Option A — Docker (fastest):
```bash
docker run --name brainbridge-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=brainbridge \
  -p 5432:5432 -d postgres:16
```
`.env` example for Docker:
```dotenv
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/brainbridge
```

Option B — Native install (Windows/macOS/Linux):
1. Install PostgreSQL from the official installer.
2. Ensure `psql` is on PATH or use full path to `psql`.
3. Create database and user (adjust values as desired):
```bash
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE brainbridge;"
psql -U postgres -h localhost -p 5432 -c "CREATE USER brainbridge_user WITH PASSWORD 'strongpassword';"
psql -U postgres -h localhost -p 5432 -c "GRANT ALL PRIVILEGES ON DATABASE brainbridge TO brainbridge_user;"
```
`.env` example for native user:
```dotenv
DATABASE_URL=postgresql+psycopg2://brainbridge_user:strongpassword@localhost:5432/brainbridge
```

### 4) Install dependencies
Node:
```bash
npm ci
```
Python (choose one):
- Using uv (recommended):
```bash
pip install -U pip
pip install uv
uv sync
# activate the created venv if uv configured one
```
- Using venv + pip:
```bash
python -m venv .venv
# Windows: .\\.venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -U -r requirements.txt  # if you create one
# or install from pyproject:
pip install -U alembic "bcrypt==4.0.1" email-validator fastapi \
  psycopg2-binary pydantic pydantic-settings python-dotenv \
  python-jose python-multipart sqlalchemy uvicorn passlib[bcrypt]
```

### 5) Build the frontend
```bash
npm run build
```
This outputs static assets to `dist/public`, which the backend will serve.

### 6) Initialize database tables
```bash
python init_db.py
```
Expected output includes: `✓ Database tables created successfully`.

### 7) Run the backend (serves API + SPA)
```bash
python run_fastapi.py
```
Visit `http://localhost:5000` (API docs at `/docs`).

Optional: start via Node helper (also initializes DB):
```bash
npm run dev
```
Note: This starts the FastAPI backend via a Node wrapper. It does not run the Vite dev server; build once with `npm run build` to serve the UI.

## Development workflow tips
- Current flow is “build then serve”: rebuild the frontend with `npm run build` when you change UI.
- If you want HMR via Vite dev server, you’ll need an API proxy (e.g., proxy `/api` to `http://localhost:5000`). The repo is currently optimized for serving the built SPA from FastAPI.
- JWT is saved client-side after login and sent automatically in `Authorization` headers for protected requests.

## API surface (high level)
- Auth: `/api/auth/login`, `/api/auth/register`, `/api/auth/user`, `/api/auth/logout`
- Users: `/api/users/me` (GET/PUT), `/api/users/{user_id}` (admin/self)
- Profiles (ND Adult): `/api/profiles/` (GET current, POST create/update)
- Jobs: `/api/jobs/` (list/create), `/api/jobs/{job_id}` (get/update), `/api/jobs/employer` (my jobs), `/api/jobs/matches/my` (my matches)
- Admin: `/api/admin/users`, `/api/admin/jobs`, `/api/admin/matches`, `/api/admin/stats`

## Troubleshooting common issues
- “relation \"users\" does not exist”
  - Ensure models import the shared Base from `server.database` (done in this repo).
  - Re-run `python init_db.py` against the correct database in `.env`.
- 404 on endpoints such as `/api/matches`, `/api/profile`, `/api/user/profile`
  - Use existing routes: `/api/jobs/matches/my` and `/api/profiles/`.
- 403 Forbidden on `/api/auth/user`
  - Ensure requests include `Authorization: Bearer <token>`; the frontend handles this after login.
- Bcrypt warning: “error reading bcrypt version”
  - Pinned to `bcrypt==4.0.1` in `pyproject.toml`. Re-install Python deps if needed.

## Project scripts
`package.json` scripts:
- `npm run build`: Builds the frontend and bundles the Node helper (not required for dev backend).
- `npm run dev`: Starts the FastAPI backend through a Node wrapper (does DB init, then runs `run_fastapi.py`).
- `npm start`: Runs the production bundle (if you build the Node helper). For local dev, prefer `python run_fastapi.py`.

Python entrypoints:
- `init_db.py`: Creates all tables in the database pointed to by `.env`.
- `run_fastapi.py`: Starts the FastAPI app with Uvicorn (reload on changes in `server/`).

Happy hacking! If you want HMR for the frontend or to add missing trait/strength endpoints, open an issue or extend the routers under `server/routers/`.
