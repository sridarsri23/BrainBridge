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
          "model_used": "gpt-4o"
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
