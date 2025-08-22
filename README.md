# 🧠 BrainBridge

**BrainBridge** is a production-grade platform designed to bridge neurodiverse talent with organizations seeking specialized skills.  
It provides AI-driven task matching, and inclusion-focused analytics to empower companies and individuals alike.

---

## 🚀 Features

- **AI-Powered Task Matching** – Matches neurodiverse professionals with suitable tasks/projects.
- **Inclusive Workforce Analytics** – Visualize inclusion metrics and progress over time.
- **Secure Role-Based Access Control** – Fine-grained permissions for admins, recruiters, and candidates.
- **Responsive UI** – Accessible, mobile-friendly design built with Tailwind CSS.
- **Scalable Backend** – Modular and API-first architecture
- **Assessments** – Self-discovery suite including:
  - 🎬 Micro-briefing Comprehension (video + open-ended grading)
  - 🎚 Sensory Profile & Tolerance (Likert sliders + checkboxes; optional AI summary)

---

## 📚 Documentation

- Architecture: `docs/ARCHITECTURE.md`
- Setup: `docs/SETUP.md`
- Runbook: `docs/RUNBOOK.md`
- API Routes: `docs/API_ROUTES.md`
- Data Model: `docs/DATA_MODEL.md`
- Frontend: `docs/FRONTEND.md`
- Changelog: `docs/CHANGELOG.md`
 
Key endpoints for assessments:
- `POST /api/ai/grade-open-ended` – rubric-grade open responses
- `POST /api/ai/demo-analyze/{assessment_id}` – optional AI summary (demo-safe)

Regenerate API routes doc:

```bash
npm run docs:api
```

Update docs when you change code or fix bugs. Log notable changes in `docs/CHANGELOG.md`.
