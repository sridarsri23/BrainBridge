# API Routes

Base URL: `/api`

- __Api__ (`/api`)

  - GET `/`

  - GET `/admin/jobs`

  - GET `/admin/matches`

  - GET `/admin/stats`

  - GET `/admin/users`

  - POST `/ai/analyze-assessment/{assessment_id}`
    - Runs full AI analysis for a saved assessment. Requires valid AI key.
  - POST `/ai/grade-open-ended`
    - Grades open-ended answers (optionally tied to a video) and returns rubric-based scores.
    - Request body:
      ```json
      {
        "video_url": "https://...", // optional
        "answers": { "q1": "...", "q2": "...", "q3": "..." },
        "user_context": { "demo_mode": true }
      }
      ```
    - Response body (example):
      ```json
      {
        "success": true,
        "grading": {
          "per_question": {
            "q1": { "clarity": 82, "detail": 78, "relevance": 88, "rationale": "..." }
          },
          "overall": { "clarity": 80, "detail": 79, "relevance": 86, "rationale": "..." },
          "model_used": "gpt-5"
        }
      }
      ```

  - GET `/ai/cognitive-profile/{user_id}`

  - POST `/ai/demo-analyze/{assessment_id}`
    - Demo analysis without persisting a profile. If AI key is missing, returns a safe sample payload. Response includes where possible:
      - `personal_summary` (non-empty)
      - `workplace_accommodations` (>=3 items when possible)
      - `career_suggestions` (>=3 items when possible)

  - POST `/ai/job-match-analysis`

  - POST `/assessment/analyze-profile`

  - POST `/assessment/assessments`

  - GET `/assessment/assessments`

  - POST `/assessment/assessments/{assessment_id}/respond`
    - Submits responses for an assessment. If `assessment_id` matches a known template (e.g., `work_env_matchmaker`) and no instance exists, the server auto-creates an assessment from templates.
    - Work Environment Matchmaker payload example:
      ```json
      {
        "responses": {
          "wem_needs": "{\"Quiet space\":\"Must\",\"Open office chatter\":\"Avoid\"}"
        }
      }
      ```

  - GET `/assessment/profile/{user_id}`

  - GET `/assessment/quiz-templates`
    - Returns available templates including `work_env_matchmaker`, `micro_briefing_comprehension`, and `sensory_profile_tolerance`.

  - GET `/assessment/assessments/my-responses`
    - Returns latest saved responses per assessment for the current user.
    - Response example:
      ```json
      [
        {
          "assessment_id": "sensory_profile_tolerance",
          "responses": { "noise": 6, "light": 3 },
          "completion_time_seconds": 120,
          "completed_at": "2025-08-22T12:34:56Z"
        }
      ]
      ```

  - POST `/auth/login`

  - POST `/auth/logout`

  - POST `/auth/register`

  - GET `/auth/user`
    - Returns the authenticated user and role.
    - Note: Authentication is required for most routes.

  - GET `/health`

  - GET `/jobs/`

  - POST `/jobs/`

  - GET `/jobs/employer`
    - Returns the authenticated employer's job postings.
    - Response fields use snake_case, e.g.: `job_id`, `job_title`, `employment_type`, `location`, `work_setup`, `salary_range_min`, `salary_range_max`, `application_deadline`, `is_active`.

  - GET `/jobs/matches/my`
    - Returns job matches for the authenticated ND user.
    - Scoring is computed on-demand by `server/matching.py`:
      - Uses Cognitive Profile strengths, preferences, sensitivities when available.
      - If profile is missing, uses assessment progress + job keyword variety + user's `preferred_work_setup` to produce varied scores per job.
      - Optional AI assist refines score when AI is configured; otherwise purely heuristic.
    - Behavior controlled by `JM_THRESHOLD`:
      - When `JM_THRESHOLD=0`, returns preview matches for all active jobs with real scores.
      - Otherwise, returns only persisted matches once full matching is enabled.
    - Requires at least one completed assessment to return any matches.
  - GET `/jobs/employer/top-matches`
    - Returns `{ matches: [...], jobs: [...] }` for the authenticated employer.
    - If the employer has no active job postings, returns `{ matches: [], jobs: [] }`.
    - Behavior controlled by `JM_THRESHOLD` env var. When `JM_THRESHOLD=0`, returns preview matches; otherwise returns an empty list until full matching is enabled.
  - GET `/jobs/employer/nd/{nd_id}/details`
    - Returns ND candidate details for employer view: cognitive profile strengths, sensitivities/preferences, and latest assessment responses per assessment.
    - Example:
      ```json
      {
        "candidate": { "first_name": "A.", "last_name": "C.", "initials": "AC" },
        "profile": {
          "strengths": { "pattern_recognition": 0.9, "verbal_communication": 0.7 },
          "preferences": { "work_style": "remote_preferred", "environment": "quiet_space" },
          "confidence_score": 0.85
        },
        "assessments": [
          {
            "assessment_id": "work_env_matchmaker",
            "title": "Work Environment Matchmaker",
            "responses": { "wem_needs": "{...}" },
            "completed_at": "2025-08-24T07:00:00Z"
          }
        ]
      }
      ```

  - GET `/jobs/{job_id}`
    - Path param type: `job_id` is a string.
    - Response fields are snake_case per DB model (see above).

  - PUT `/jobs/{job_id}`
    - Path param type: `job_id` is a string.
    - Request body accepts a partial payload (all fields optional) using snake_case keys per `JobPostingUpdate`:
      - `job_title`, `job_description`, `employment_type`, `location`, `work_setup`, `salary_range_min`, `salary_range_max`, `requirements`, `benefits`, `application_deadline`, `is_active`.
    - On success, returns the updated job in snake_case.

  - GET `/matches`

  - GET `/profile`

  - GET `/user/profile`

  - PUT `/user/profile`
    - Request body (selected fields supported; camelCase mapped to DB snake_case):
      - Personal: `firstName`, `lastName`, `phone`, `dateOfBirth`, `guardianEmail`, `location`, `companyName`
      - ND: `identityVerificationDoc`, `hasNeuroConditionRecognized`, `recognizedNeuroCondition`, `ndConditionProofDocs`, `medicalConditions`
      - Work Prefs: `preferredWorkEnvironment`, `preferredWorkSetup`, `availabilityStatus`, `notes`
      - Consents: `publicProfileConsent`, `privacyAgreed`
      - Employer: `companyWebsite`, `contactPerson`, `contactPersonDesignation`, `companyEmail`, `companyVerificationDocs`, `isDeiCompliant`, `deiComplianceType`
      - Guardian-specific:
        - `ndMindEmail` → maps to `nd_adult_email` (links Guardian to ND adult)
        - `guardianVerificationDoc` → maps to `identity_verification_doc` (single file name)
    - Notes:
      - Frontend prevents Guardians from sending `identityVerificationDoc` to avoid clobbering the saved doc; Guardians use `guardianVerificationDoc` instead.
      - Arrays like `ndConditionProofDocs` and `companyVerificationDocs` can be sent as arrays or JSON strings; backend normalizes them.

  - GET `/users/me`

  - PUT `/users/me`

  - GET `/users/{user_id}`


- __{full_path:path}__ (`/{full_path:path}`)

  - GET `/`
