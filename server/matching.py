"""
Rule-based job matching scorer with optional AI-assisted extraction.

Computes a 0-100 score combining:
- CDC strengths vs job skill signals
- Preference alignment (remote/location, employment type)
- Sensitivity risks from job description keywords

Falls back to heuristic scoring if AI is unavailable.
"""
from __future__ import annotations

from typing import Dict, Any, List, Optional
import re
import os

from sqlalchemy.orm import Session

from server.models import CognitiveProfile, JobPosting, AssessmentResponse, User
from server.ai_agent import agent

# Map common skills/requirements keywords to CDCs
SKILL_TO_CDC = {
    # analytical
    "analysis": "pattern_recognition",
    "data": "pattern_recognition",
    "excel": "pattern_recognition",
    "python": "pattern_recognition",
    "sql": "pattern_recognition",
    # communication
    "communication": "verbal_communication",
    "presentation": "verbal_communication",
    "stakeholder": "verbal_communication",
    # spatial/engineering
    "cad": "spatial_reasoning",
    "3d": "spatial_reasoning",
    # creativity
    "design": "creative_ideation",
    "brainstorm": "creative_ideation",
    "ux": "creative_ideation",
    # multitasking/executive
    "project": "executive_function",
    "planning": "executive_function",
    "organize": "executive_function",
    "deadlines": "multitasking_context_switching",
    # speed
    "fast-paced": "processing_speed",
}

SENSORY_RISK_WORDS = {
    "noise": "sensory_processing",
    "loud": "sensory_processing",
    "bright": "sensory_processing",
    "crowd": "sensory_processing",
    "open office": "attention_filtering",
    "interruptions": "attention_filtering",
}

REMOTE_WORDS = ["remote", "work from home", "wfh", "hybrid"]
ONSITE_WORDS = ["on-site", "onsite", "office", "factory", "warehouse"]


def _extract_job_skills(job: JobPosting) -> List[str]:
    src = " ".join(filter(None, [job.requirements or "", job.job_description or ""]))
    tokens = re.findall(r"[a-zA-Z][a-zA-Z+.#-]{1,}", src.lower())
    unique = list(dict.fromkeys(tokens))  # preserve order
    return unique[:200]


def _cdc_strength(profile: CognitiveProfile, cdc: str) -> float:
    val = getattr(profile, cdc, None)
    try:
        return float(val) if val is not None else 0.0
    except Exception:
        return 0.0


def _preference_flags(profile: CognitiveProfile) -> Dict[str, Any]:
    prefs = (getattr(profile, "preferences", {}) or {})
    return {
        "prefers_remote": str(prefs).lower().find("remote") != -1,
        "prefers_quiet": str(prefs).lower().find("quiet") != -1,
    }


def _sensitivity_level(profile: CognitiveProfile, key: str) -> str:
    sens = (getattr(profile, "sensitivities", {}) or {})
    return str(sens.get(key, "")).lower()


def _ai_assist_score(job: JobPosting, profile: Optional[CognitiveProfile], user_prefs: Optional[dict] = None) -> Optional[float]:
    """Optional lightweight AI assist to refine a score. Returns None if AI disabled."""
    if not getattr(agent, "llm_available", False):
        return None
    # Compact prompt to keep latency low; ask for a number 0-100
    strengths_map = {k: getattr(profile, k, None) for k in dir(profile) if profile and k in SKILL_TO_CDC.values()}
    prompt = (
        "Given this ND profile strengths (0-1), preferences and sensitivities, and this job text, "
        "return a single JSON object with key 'score' (0-100) reflecting suitability.\n\n"
        f"STRENGTHS: {strengths_map}\n"
        f"PREFERENCES: { (getattr(profile, 'preferences', {}) if profile else (user_prefs or {})) }\n"
        f"SENSITIVITIES: { (getattr(profile, 'sensitivities', {}) if profile else {}) }\n"
        f"JOB: title={job.job_title}, type={job.employment_type}, location={job.location}, "
        f"requirements={job.requirements}, description={job.job_description}\n"
        "Respond strictly as JSON like {\"score\": 78}."
    )
    try:
        resp = agent.llm.invoke(prompt)  # sync small call
        import json
        data = json.loads(resp.content.strip()) if hasattr(resp, "content") else json.loads(str(resp))
        sc = float(data.get("score", 0))
        if 0 <= sc <= 100:
            return sc
        return None
    except Exception:
        return None


def compute_match_score(db: Session, user_id: str, job: JobPosting) -> int:
    """Compute a 0-100 match score for a user and a job."""
    profile: Optional[CognitiveProfile] = (
        db.query(CognitiveProfile).filter(CognitiveProfile.user_id == user_id).first()
    )
    if not profile:
        # No profile yet; vary score using job tokens and user's preferred setup
        # 1) Assessment progress baseline
        q = (
            db.query(AssessmentResponse.assessment_id)
            .filter(AssessmentResponse.user_id == user_id)
            .distinct()
        )
        assess_count = len(q.all())
        baseline = 50 if assess_count == 0 else min(60 + assess_count * 5, 80)

        # 2) Token-derived skill variety: more mapped CDC types -> higher score
        tokens = _extract_job_skills(job)
        types = set()
        for t in tokens:
            if t in SKILL_TO_CDC:
                types.add(SKILL_TO_CDC[t])
        variety_boost = min(len(types) * 3, 12)  # 0..12

        # 3) Preference alignment from User.preferred_work_setup
        user = db.query(User).filter(User.id == user_id).first()
        preferred = (user.preferred_work_setup or "").lower() if user else ""
        jt = (" ".join(filter(None, [job.location or "", job.job_description or "", job.requirements or ""]))).lower()
        is_remote = any(w in jt for w in REMOTE_WORDS) or (str(job.location or "").lower() in ["remote", "hybrid"])
        is_onsite = any(w in jt for w in ONSITE_WORDS)
        pref_boost = 0
        if preferred.find("remote") != -1 and is_remote:
            pref_boost = 6
        elif preferred.find("on") != -1 and is_onsite:
            pref_boost = 4

        # 4) Optional AI assist without profile using user prefs
        ai_score = _ai_assist_score(job, None, user_prefs={"preferred_work_setup": preferred})
        ai_component = ai_score if ai_score is not None else baseline + variety_boost + pref_boost

        score = 0.5 * (baseline + variety_boost + pref_boost) + 0.5 * ai_component
        return int(max(50, min(90, round(score))))

    # 1) Skills vs strengths
    tokens = _extract_job_skills(job)
    cdc_hits: Dict[str, int] = {}
    for t in tokens:
        if t in SKILL_TO_CDC:
            c = SKILL_TO_CDC[t]
            cdc_hits[c] = cdc_hits.get(c, 0) + 1
    if not cdc_hits:
        skills_score = 60  # unknown requirements; neutral baseline
    else:
        weighted = 0.0
        total = 0.0
        for c, n in cdc_hits.items():
            s = _cdc_strength(profile, c)  # 0-1
            weighted += s * n
            total += n
        skills_score = 100.0 * (weighted / max(total, 1.0))  # 0-100

    # 2) Preferences alignment
    prefs = _preference_flags(profile)
    job_text = " ".join(filter(None, [job.location or "", job.job_description or "", job.requirements or ""]))
    jt = job_text.lower()
    prefers_remote = prefs["prefers_remote"]
    is_remote = any(w in jt for w in REMOTE_WORDS) or (str(job.location or "").lower() in ["remote", "hybrid"])
    is_onsite = any(w in jt for w in ONSITE_WORDS)
    pref_score = 75
    if prefers_remote and is_remote:
        pref_score = 95
    elif prefers_remote and is_onsite:
        pref_score = 55

    # 3) Sensitivity penalty
    penalty = 0
    for w, sens_key in SENSORY_RISK_WORDS.items():
        if w in jt:
            level = _sensitivity_level(profile, sens_key)
            if level == "high":
                penalty += 12
            elif level == "medium":
                penalty += 6

    # 4) Optional AI adjustment
    ai_score = _ai_assist_score(job, profile)

    # Combine
    base = 0.55 * skills_score + 0.25 * pref_score + 0.20 * (ai_score if ai_score is not None else skills_score)
    base = max(0, min(100, base - penalty))

    # Keep scores in a practical band
    if base < 50:
        base = 50
    return int(round(base))
