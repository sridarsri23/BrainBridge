"""
Job Normalization API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any, Optional

from server.database import get_db
from server.models import User
from server.auth import get_current_user
from server.job_normalization_agent import job_agent

router = APIRouter()

class JobNormalizationRequest(BaseModel):
    job_title: str
    job_description: str
    company_name: Optional[str] = ""
    additional_context: Optional[str] = ""

class JobNormalizationResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

@router.post("/normalize", response_model=JobNormalizationResponse)
async def normalize_job_description(
    request: JobNormalizationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Normalize a job description using AI analysis
    
    This endpoint:
    1. Parses the job description using NLP
    2. Extracts skills, tasks, cognitive demands
    3. Translates to plain, structured language
    4. Classifies tasks into CDC categories
    5. Generates accommodation rules
    6. Creates vector embeddings for matching
    """
    try:
        # Validate user permissions (employers and admins can normalize jobs)
        if current_user.user_role not in ["EMPLOYER", "ADMIN", "MANAGER"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only employers and administrators can normalize job descriptions"
            )
        
        # Validate input
        if not request.job_title.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Job title is required"
            )
        
        if not request.job_description.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Job description is required"
            )
        
        # Normalize the job description using AI agent
        normalized_job = await job_agent.normalize_job_description(
            job_title=request.job_title,
            job_description=request.job_description,
            company_name=request.company_name,
            additional_context=request.additional_context
        )
        
        # Add user context
        normalized_job["normalized_by"] = current_user.email
        normalized_job["user_id"] = str(current_user.id)
        
        return JobNormalizationResponse(
            success=True,
            data=normalized_job
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to normalize job description: {str(e)}"
        )

@router.get("/cdc-categories")
async def get_cdc_categories(
    current_user: User = Depends(get_current_user)
):
    """Get available CDC (Cognitive Demand Categories) for reference"""
    return {
        "cdc_categories": job_agent.cdc_categories,
        "description": "Cognitive Demand Categories used for job analysis and ND matching"
    }

@router.post("/match-job")
async def match_job_to_profile(
    normalized_job: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Match a normalized job to ND professional profiles
    
    This would integrate with the existing matching system
    to find suitable ND candidates based on CDC compatibility
    """
    try:
        # This would integrate with existing job matching logic
        # For now, return a placeholder response
        
        return {
            "success": True,
            "message": "Job matching functionality would be implemented here",
            "job_id": normalized_job.get("job_id"),
            "potential_matches": [],
            "accommodation_recommendations": normalized_job.get("accommodation_rules", [])
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to match job: {str(e)}"
        )
