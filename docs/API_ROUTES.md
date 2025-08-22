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

  - GET `/ai/cognitive-profile/{user_id}`

  - POST `/ai/demo-analyze/{assessment_id}`
    - Demo analysis without persisting a profile. Response is sanitized to always include:
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
    - Returns available templates including `work_env_matchmaker`.

  - POST `/auth/login`

  - POST `/auth/logout`

  - POST `/auth/register`

  - GET `/auth/user`

  - GET `/health`

  - GET `/jobs/`

  - POST `/jobs/`

  - GET `/jobs/employer`

  - GET `/jobs/matches/my`

  - GET `/jobs/{job_id}`

  - PUT `/jobs/{job_id}`

  - GET `/matches`

  - GET `/matches`

  - GET `/profile`

  - GET `/user/profile`

  - PUT `/user/profile`

  - GET `/users/me`

  - PUT `/users/me`

  - GET `/users/{user_id}`


- __{full_path:path}__ (`/{full_path:path}`)

  - GET `/`

