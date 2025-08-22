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

## Build
- Dev: `npm run dev`
- Prod: `npm run build` outputs to `client/dist`
