# Changelog

All notable changes to this project will be documented in this file.

## [2025-08-24] (Fix: Job data flow + Assessment video + Docs)
- Employer Dashboard
  - Fixed field mapping between API (snake_case) and frontend form (camelCase) in `client/src/pages/employer-dashboard.tsx`.
  - Standardized `job_id` usage across frontend and backend; removed `jobId` references.
  - Active jobs count now reads `is_active` (was `isActive`).
- Backend
  - Updated jobs router to accept `job_id: str` for `GET /api/jobs/{job_id}` and `PUT /api/jobs/{job_id}` (SQLite stores IDs as strings).
  - Made all fields optional in `JobPostingUpdate` schema to allow partial updates.
- Assessments
  - Updated Micro-briefing Comprehension default video URL to `https://youtu.be/wENihRw0-DE`.
- Docs
  - Refreshed `API_ROUTES.md` to clarify `job_id` type and snake_case response fields.
  - Updated `FRONTEND.md` Employer Dashboard notes (field mapping + active jobs count).
  - Added naming convention note in `DATA_MODEL.md`.

## [2025-08-24] (ND Dashboard + Matching)
- ND Dashboard now fetches matches from `GET /api/jobs/matches/my` with auth header.
- When `JM_THRESHOLD=0`, backend returns preview matches for ALL active jobs to ND users (no DB `JobMatch` rows required). Response shape matches `JobMatchCard`.
- Profile fetch corrected to `GET /api/profile/` with auth.
- Matches are now gated: ND users must have at least one completed assessment response before any matches are returned or shown.
- Stats panel updates: "Skills Completed" renamed to "Assessments Completed"; "New Matches" count reflects fetched matches length.
- Implemented realistic match scoring in `server/matching.py` combining CDC strengths, preferences, sensitivities, and job requirements with optional AIMLAPI assist. Integrated into `/api/jobs/matches/my`.

## [2025-08-24] (UI + Docs)
- Employer Dashboard dialog updates
  - Ensured modal uses explicit white background and correct overlay z-index.
  - Added Work Environment Preferences section in Candidate Details dialog.
  - Added CTA button: “Get Free Trial for Interact”.
- Dashboard right sidebar: renamed "Certification Progress" to "DEI + Certification Progress" and added "Audit Status" and "Documentation Status" progress items.
- Documentation refresh (no README changes):
  - Updated `docs/ARCHITECTURE.md` to clarify Node bridge, static serving from `dist/public`, and run flows.
  - Updated `docs/FRONTEND.md` with Employer Dashboard dialog notes and build output path.
  - Updated `docs/RUNBOOK.md` with dev/prod commands aligned to `package.json` and Node bridge.
  - Updated `docs/API_ROUTES.md` examples for employer details route; removed duplicate entries; noted `JM_THRESHOLD` behavior.

## [2025-08-24] (Employer Dashboard - Jobs management)
- Dynamic stats
  - "Active Jobs" now reflects count of `isActive` jobs from `GET /api/jobs/employer`.
  - "Matched Candidates" reflects length of `matches` from `GET /api/jobs/employer/top-matches`.
- Job cards
  - Per-job matches count computed by correlating `matches[].job_id` with `job.jobId`.
  - Added View modal showing title, location, employment type, status, description, and requirements.
  - Added Edit modal bound to `PUT /api/jobs/{job_id}`; fields: `jobTitle`, `location`, `employmentType`, `isActive`, `jobDescription`, `requirements`.
- React Query
  - Invalidate `/api/jobs/employer` and `/api/jobs/employer/top-matches` after successful updates to keep panels in sync.

## [2025-08-24]
- Employer Top Candidate Matches
  - Wired employer dashboard `Top Candidate Matches` to backend: `GET /api/jobs/employer/top-matches`.
  - Added Candidate Details modal fetching `GET /api/jobs/employer/nd/{nd_id}/details` with cognitive profile and latest assessments.
  - Honors `JM_THRESHOLD` (set to 0 to preview all ND profiles as matches).
- Docs: Updated `docs/API_ROUTES.md` with new endpoints and behavior.

## [2025-08-22]
- Employer profile UI adjustments
  - Hide ND-only fields for Employers: Date of Birth, Work Preferences (Location, Preferred Work Environment, Preferred Work Setup, Availability Status).
  - Prevent ND-only fields from being sent on Employer saves in `client/src/pages/profile-management.tsx`.
  - Verified employer fields save via `/api/user/profile`: `companyWebsite`, `contactPerson`, `contactPersonDesignation`, `companyEmail`, `companyVerificationDocs`, `isDeiCompliant`, `deiComplianceType`.

- Guardian profile enhancements
  - Added Guardian-specific section `client/src/components/forms/guardian-details-section.tsx` with:
    - ND Mind Email input (`ndMindEmail`).
    - Single Verification Document upload (`guardianVerificationDoc`).
  - Wired into form schema and defaults in `client/src/components/forms/profile-form.tsx`.
  - Initial data mapping updated in `client/src/pages/profile-management.tsx` to read `nd_adult_email` and map to `ndMindEmail`; reuse `identity_verification_doc` for `guardianVerificationDoc`.
  - Backend `server/main.py`:
    - GET `/api/user/profile`: expose `nd_adult_email` under `profile.nd_adult_email`.
    - PUT `/api/user/profile`: map `ndMindEmail -> nd_adult_email`, `guardianVerificationDoc -> identity_verification_doc`.

- Work Environment Matchmaker assessment
  - Backend template added in `server/assessment_templates.py` as `work_env_matchmaker` (gamified selections).
  - Frontend component `client/src/components/assessments/WorkEnvMatchmaker.tsx` created with bucket selection UI.
  - Integrated into `client/src/pages/self-discovery.tsx` with new assessment type and rendering case.
  - Submissions send `responses` as `{ "wem_needs": "<JSON string mapping item->bucket>" }`.
  - Auto-create on first response if assessment instance missing (router handles via templates).
  - AI analysis sanitization in `server/openai_integration.py` ensures non-empty summary and ≥3 items for accommodations/careers.

- Micro-briefing Comprehension assessment (video + open-ended grading)
  - Backend: Added `grade_open_ended()` in `server/openai_integration.py` to score clarity/detail/relevance with concise rationale; includes heuristic fallback.
  - API: New endpoint `POST /api/ai/grade-open-ended` in `server/routers/ai_analysis.py`.
  - Templates: Added `micro_briefing_comprehension` in `server/assessment_templates.py`.
  - Frontend: New component `client/src/components/assessments/MicroBriefingComprehension.tsx` using `react-player`; wired into `self-discovery.tsx`.
  - Docs: Updated `docs/API_ROUTES.md` to document the endpoint and template.

- Sensory Profile & Tolerance assessment:
  - Frontend component: `client/src/components/assessments/SensoryProfileTolerance.tsx`
  - Integrated in `client/src/pages/self-discovery.tsx`
  - Backend template registered in `server/assessment_templates.py`
  - Deterministic local scoring; optional AI summary via `/api/ai/demo-analyze/sensory_profile_tolerance`
- Dependency: `@radix-ui/react-slider`
- Docs: Updated `API_ROUTES.md`, `FRONTEND.md`, `SETUP.md`.

## [2025-08-22]
- Initial documentation suite created under `docs/`:
  - ARCHITECTURE.md, SETUP.md, RUNBOOK.md, API_ROUTES.md, DATA_MODEL.md, FRONTEND.md, CHANGELOG.md
- Added API docs generator: `tools/gen_api_docs.py`.
- Linked docs from README.
