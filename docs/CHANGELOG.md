# Changelog

All notable changes to this project will be documented in this file.

## [2025-08-22]
- Work Environment Matchmaker assessment
  - Backend template added in `server/assessment_templates.py` as `work_env_matchmaker` (gamified selections).
  - Frontend component `client/src/components/assessments/WorkEnvMatchmaker.tsx` created with bucket selection UI.
  - Integrated into `client/src/pages/self-discovery.tsx` with new assessment type and rendering case.
  - Submissions send `responses` as `{ "wem_needs": "<JSON string mapping item->bucket>" }`.
  - Auto-create on first response if assessment instance missing (router handles via templates).
  - AI analysis sanitization in `server/openai_integration.py` ensures non-empty summary and ≥3 items for accommodations/careers.

## [2025-08-22]
- Initial documentation suite created under `docs/`:
  - ARCHITECTURE.md, SETUP.md, RUNBOOK.md, API_ROUTES.md, DATA_MODEL.md, FRONTEND.md, CHANGELOG.md
- Added API docs generator: `tools/gen_api_docs.py`.
- Linked docs from README.
