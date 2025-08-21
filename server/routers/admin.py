"""
Admin routes for system management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from server.database import get_db
from server.models import User, JobPosting, JobMatch
from server.schemas import UserResponse, JobPostingResponse, JobMatchResponse
from server.auth import get_current_user

router = APIRouter()

def require_admin(current_user: User = Depends(get_current_user)):
    """Require admin or manager role"""
    if current_user.user_role.value not in ["Admin", "Manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)"""
    users = db.query(User).all()
    return [UserResponse.model_validate(user) for user in users]

@router.get("/jobs", response_model=List[JobPostingResponse])
async def get_all_jobs(
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all job postings (admin only)"""
    jobs = db.query(JobPosting).all()
    return [JobPostingResponse.model_validate(job) for job in jobs]

@router.get("/matches", response_model=List[JobMatchResponse])
async def get_all_matches(
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all job matches (admin only)"""
    matches = db.query(JobMatch).all()
    return [JobMatchResponse.model_validate(match) for match in matches]

@router.get("/stats")
async def get_system_stats(
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get system statistics"""
    total_users = db.query(User).count()
    total_nd_adults = db.query(User).filter(User.user_role == "ND_Adult").count()
    total_employers = db.query(User).filter(User.user_role == "Employer").count()
    total_jobs = db.query(JobPosting).count()
    active_jobs = db.query(JobPosting).filter(JobPosting.is_active == True).count()
    total_matches = db.query(JobMatch).count()
    
    return {
        "total_users": total_users,
        "total_nd_adults": total_nd_adults,
        "total_employers": total_employers,
        "total_jobs": total_jobs,
        "active_jobs": active_jobs,
        "total_matches": total_matches
    }