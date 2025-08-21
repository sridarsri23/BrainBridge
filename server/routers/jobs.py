"""
Job posting and matching routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from server.database import get_db
from server.models import User, JobPosting, JobMatch
from server.schemas import (
    JobPostingResponse, 
    JobPostingCreate, 
    JobPostingUpdate,
    JobMatchResponse,
    JobMatchCreate
)
from server.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[JobPostingResponse])
async def get_active_jobs(db: Session = Depends(get_db)):
    """Get all active job postings"""
    jobs = db.query(JobPosting).filter(JobPosting.is_active == True).all()
    return [JobPostingResponse.model_validate(job) for job in jobs]

@router.post("/", response_model=JobPostingResponse)
async def create_job_posting(
    job_data: JobPostingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new job posting (employer only)"""
    if current_user.user_role.value not in ["Employer", "Admin", "Manager"]:
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
    if current_user.user_role.value not in ["Employer", "Admin", "Manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can view their job postings"
        )
    
    jobs = db.query(JobPosting).filter(JobPosting.employer_id == current_user.id).all()
    return [JobPostingResponse.model_validate(job) for job in jobs]

@router.get("/{job_id}", response_model=JobPostingResponse)
async def get_job_by_id(job_id: UUID, db: Session = Depends(get_db)):
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
    job_id: UUID,
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
        current_user.user_role.value not in ["Admin", "Manager"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this job posting"
        )
    
    for field, value in job_update.model_dump(exclude_unset=True).items():
        setattr(job, field, value)
    
    db.commit()
    db.refresh(job)
    
    return JobPostingResponse.model_validate(job)

@router.get("/matches/my", response_model=List[JobMatchResponse])
async def get_my_job_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get job matches for current ND Adult"""
    if current_user.user_role != "ND_ADULT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only ND Adults can view job matches"
        )
    
    matches = db.query(JobMatch).filter(JobMatch.nd_adult_id == current_user.id).all()
    return [JobMatchResponse.model_validate(match) for match in matches]