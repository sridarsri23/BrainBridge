"""
Employer profile management routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User, ProfileEmployer
from server.schemas import ProfileEmployerResponse, ProfileEmployerCreate, ProfileEmployerUpdate
from server.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=ProfileEmployerResponse)
async def get_employer_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user's employer profile"""
    profile = db.query(ProfileEmployer).filter(ProfileEmployer.employer_id == str(current_user.id)).first()
    
    if not profile:
        # Create default profile if none exists
        profile = ProfileEmployer(
            employer_id=str(current_user.id),
            privacy_agreed=False
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    return ProfileEmployerResponse.model_validate(profile)

@router.post("/", response_model=ProfileEmployerResponse)
async def create_or_update_employer_profile(
    profile_data: ProfileEmployerUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update employer profile"""
    existing_profile = db.query(ProfileEmployer).filter(ProfileEmployer.employer_id == str(current_user.id)).first()
    
    if existing_profile:
        # Update existing profile
        for field, value in profile_data.model_dump(exclude_unset=True).items():
            setattr(existing_profile, field, value)
        db.commit()
        db.refresh(existing_profile)
        return ProfileEmployerResponse.model_validate(existing_profile)
    else:
        # Create new profile
        new_profile = ProfileEmployer(
            employer_id=str(current_user.id),
            **profile_data.model_dump(exclude_unset=True)
        )
        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)
        return ProfileEmployerResponse.model_validate(new_profile)