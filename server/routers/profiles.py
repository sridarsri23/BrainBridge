"""
Profile management routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from server.database import get_db
from server.models import User
# Removed old profile schemas - using User model directly
from server.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=ProfileNDAdultResponse)
async def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user's ND Adult profile"""
    profile = db.query(ProfileNDAdult).filter(ProfileNDAdult.nd_adult_id == str(current_user.id)).first()
    
    if not profile:
        # Create default profile if none exists
        profile = ProfileNDAdult(
            nd_adult_id=str(current_user.id),
            public_profile_consent=False,
            match_consent=False
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    return ProfileNDAdultResponse.model_validate(profile)

@router.post("/", response_model=ProfileNDAdultResponse)
async def create_or_update_profile(
    profile_data: ProfileNDAdultUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update ND Adult profile"""
    existing_profile = db.query(ProfileNDAdult).filter(ProfileNDAdult.nd_adult_id == str(current_user.id)).first()
    
    if existing_profile:
        # Update existing profile
        for field, value in profile_data.model_dump(exclude_unset=True).items():
            setattr(existing_profile, field, value)
        db.commit()
        db.refresh(existing_profile)
        return ProfileNDAdultResponse.model_validate(existing_profile)
    else:
        # Create new profile
        new_profile = ProfileNDAdult(
            nd_adult_id=str(current_user.id),
            **profile_data.model_dump(exclude_unset=True)
        )
        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)
        return ProfileNDAdultResponse.model_validate(new_profile)