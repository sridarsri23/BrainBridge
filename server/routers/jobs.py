"""
Job posting and matching routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from uuid import UUID

from server.database import get_db
from server.models import User, JobPosting, JobMatch, AssessmentResponse, Assessment, CognitiveProfile
from server.schemas import (
    JobPostingResponse, 
    JobPostingCreate, 
    JobPostingUpdate,
    JobMatchResponse,
    JobMatchCreate
)
from server.auth import get_current_user
from server.config import JM_THRESHOLD
from server.matching import compute_match_score

router = APIRouter()

@router.post("", response_model=JobPostingResponse)  # Changed from "/" to ""
async def create_job_posting(
    job_data: JobPostingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new job posting (employer only)"""
    if current_user.user_role not in ["EMPLOYER", "ADMIN", "MANAGER"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can create job postings"
        )
    
    new_job = JobPosting(
        employer_id=current_user.id,
        **job_data.model_dump()
    )
    
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    
    return JobPostingResponse.model_validate(new_job)

@router.get("/employer", response_model=List[JobPostingResponse])
async def get_employer_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get job postings for current employer"""
    if current_user.user_role not in ["EMPLOYER", "ADMIN", "MANAGER"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can view their job postings"
        )
    
    jobs = db.query(JobPosting).filter(JobPosting.employer_id == current_user.id).all()
    return [JobPostingResponse.model_validate(job) for job in jobs]

@router.get("/{job_id}", response_model=JobPostingResponse)
async def get_job_by_id(job_id: str, db: Session = Depends(get_db)):
    """Get job posting by ID"""
    job = db.query(JobPosting).filter(JobPosting.job_id == job_id).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job posting not found"
        )
    
    return JobPostingResponse.model_validate(job)

@router.put("/{job_id}", response_model=JobPostingResponse)
async def update_job_posting(
    job_id: str,
    job_update: JobPostingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update job posting (employer only)"""
    job = db.query(JobPosting).filter(JobPosting.job_id == job_id).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job posting not found"
        )
    
    # Check if user is the employer who created this job or admin
    if (str(job.employer_id) != str(current_user.id) and 
        current_user.user_role not in ["ADMIN", "MANAGER"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this job posting"
        )
    
    for field, value in job_update.model_dump(exclude_unset=True).items():
        setattr(job, field, value)
    
    db.commit()
    db.refresh(job)
    
    return JobPostingResponse.model_validate(job)

@router.get("/matches/my")
async def get_my_job_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
)-> List[dict]:
    """Get job matches for current ND Adult"""
    if current_user.user_role != "ND_ADULT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only ND Adults can view job matches"
        )
    
    # Helper to convert DB objects into the frontend card shape
    def to_card_shape_from_db_match(m: JobMatch) -> Dict[str, Any]:
        job = m.job_posting
        employer = job.employer if job else None
        # Recompute score using latest profile+job
        score = compute_match_score(db, str(current_user.id), job) if job else int(m.match_score or 70)
        return {
            "matchId": str(m.match_id),
            "matchScore": int(score),
            "matchReasoning": m.match_reasoning or "Recommended based on your profile",
            "job": {
                "jobId": str(job.job_id) if job else None,
                "jobTitle": job.job_title if job else "",
                "employmentType": getattr(job.employment_type, "value", str(job.employment_type)) if job else "",
                "location": job.location if job else "",
                "jobDescription": job.job_description or "",
                "requiredSkills": job.requirements or "",
            },
            "employer": {
                "companyName": employer.company_name if employer else "",
            },
        }

    def to_card_shape_preview(job: JobPosting) -> Dict[str, Any]:
        employer = job.employer
        # Compute realistic score for preview mode
        score = compute_match_score(db, str(current_user.id), job)
        return {
            "matchId": f"preview-{job.job_id}",
            "matchScore": score,
            "matchReasoning": "Shown in preview mode (JM_THRESHOLD=0)",
            "job": {
                "jobId": str(job.job_id),
                "jobTitle": job.job_title,
                "employmentType": getattr(job.employment_type, "value", str(job.employment_type)),
                "location": job.location or "Remote",
                "jobDescription": job.job_description or "",
                "requiredSkills": job.requirements or "",
            },
            "employer": {
                "companyName": employer.company_name if employer else "",
            },
        }

    # Require at least one completed assessment/skills before showing matches
    has_any_assessment = (
        db.query(AssessmentResponse)
        .filter(
            AssessmentResponse.user_id == current_user.id,
            # consider either explicitly completed or has any responses
            (AssessmentResponse.completed_at.isnot(None)) | (AssessmentResponse.responses.isnot(None))
        )
        .first()
        is not None
    )

    if not has_any_assessment:
        return []

    # Preview mode: show all active jobs to ND adults as matches
    if JM_THRESHOLD == 0:
        jobs = (
            db.query(JobPosting)
            .filter(JobPosting.is_active.is_(True))
            .order_by(JobPosting.posted_date.desc())
            .all()
        )
        return [to_card_shape_preview(j) for j in jobs]

    # Normal mode: return saved/generated matches for this ND user
    matches = db.query(JobMatch).filter(JobMatch.nd_adult_id == current_user.id).all()
    return [to_card_shape_from_db_match(m) for m in matches]

@router.get("/employer/top-matches")
async def get_employer_top_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Return candidate matches for this employer's jobs.

    Behavior:
    - If JM_THRESHOLD == 0: treat every ND profile as a match against each active job.
    - Else: placeholder empty list until full matching is implemented.
    """
    if current_user.user_role not in ["EMPLOYER", "ADMIN", "MANAGER"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employers can view matches")

    # Employer's active jobs
    jobs = (
        db.query(JobPosting)
        .filter(JobPosting.employer_id == current_user.id, JobPosting.is_active.is_(True))
        .order_by(JobPosting.posted_date.desc())
        .all()
    )

    # If the employer has no active job postings, do not return any matches
    if not jobs:
        return {"matches": [], "jobs": []}

    if JM_THRESHOLD != 0:
        return {"matches": [], "jobs": [JobPostingResponse.model_validate(j).model_dump() for j in jobs]}

    # Fetch ND users with cognitive profiles
    nd_users = (
        db.query(User)
        .join(CognitiveProfile, CognitiveProfile.user_id == User.id)
        .filter(User.user_role == "ND_ADULT")
        .all()
    )

    def initials(u: User) -> str:
        f = (u.first_name or "").strip()[:1].upper()
        l = (u.last_name or "").strip()[:1].upper()
        return (f + l) or "NN"

    # Build matches: assign each ND to the most recent job for preview
    matches: List[Dict[str, Any]] = []
    preview_job = jobs[0] if jobs else None
    for idx, u in enumerate(nd_users, start=1):
        cp: CognitiveProfile = db.query(CognitiveProfile).filter(CognitiveProfile.user_id == u.id).first()
        score = int(round((cp.confidence_score or 0.8) * 100))
        score = max(50, min(99, score))
        matches.append({
            "nd_id": str(u.id),
            "display_name": f"Anonymous Candidate #{idx}",
            "initials": initials(u),
            "match_score": score,
            "suggested_role": preview_job.job_title if preview_job else "Candidate",
            "job_id": str(preview_job.job_id) if preview_job else None,
        })

    return {
        "matches": matches[:20],  # limit for dashboard
        "jobs": [JobPostingResponse.model_validate(j).model_dump() for j in jobs]
    }

@router.get("/employer/nd/{nd_id}/details")
async def get_nd_candidate_details(
    nd_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Return ND candidate profile details for employer view.

    Includes: cognitive profile, latest assessment responses with assessment metadata.
    """
    if current_user.user_role not in ["EMPLOYER", "ADMIN", "MANAGER"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employers can view candidate details")

    user = db.query(User).filter(User.id == nd_id, User.user_role == "ND_ADULT").first()
    if not user:
        raise HTTPException(status_code=404, detail="ND candidate not found")

    profile = db.query(CognitiveProfile).filter(CognitiveProfile.user_id == nd_id).first()
    strengths = {}
    if profile:
        for cdc in [
            "focus_sustained_attention","pattern_recognition","verbal_communication",
            "spatial_reasoning","creative_ideation","multitasking_context_switching",
            "processing_speed","executive_function","fine_motor_input",
            "sensory_processing","communication_interpretation","attention_filtering"
        ]:
            strengths[cdc] = getattr(profile, cdc, None)

    # Latest responses per assessment for this user
    responses = (
        db.query(AssessmentResponse)
        .join(Assessment, Assessment.assessment_id == AssessmentResponse.assessment_id)
        .filter(AssessmentResponse.user_id == nd_id)
        .order_by(AssessmentResponse.completed_at.desc().nullslast(), AssessmentResponse.response_id.desc())
        .all()
    )
    latest_map: Dict[str, Any] = {}
    for r in responses:
        aid = str(r.assessment_id)
        if aid not in latest_map:
            latest_map[aid] = {
                "assessment_id": aid,
                "title": r.assessment.title if r.assessment else aid,
                "type": r.assessment.assessment_type if r.assessment else None,
                "questions": r.assessment.questions if r.assessment else [],
                "responses": r.responses or {},
                "completed_at": r.completed_at,
            }

    return {
        "candidate": {
            "id": str(user.id),
            "initials": f"{(user.first_name or '')[:1]}{(user.last_name or '')[:1]}",
        },
        "profile": {
            "strengths": strengths,
            "sensitivities": getattr(profile, "sensitivities", {}) if profile else {},
            "preferences": getattr(profile, "preferences", {}) if profile else {},
            "confidence_score": float(getattr(profile, "confidence_score", 0.0) or 0.0)
        },
        "assessments": list(latest_map.values())
    }