# Changelog

All notable changes to this project will be documented in this file.

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
