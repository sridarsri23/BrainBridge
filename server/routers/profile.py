"""
Profile management for BrainBridge
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from server.database import get_db
from server.models import User
from server.auth import get_current_user

router = APIRouter()

class ProfileResponse(BaseModel):
    user: dict
    profile: dict

@router.get("/", response_model=ProfileResponse)
async def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user's profile with all fields"""
    
    user_data = {
        "id": current_user.id,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "phone": current_user.phone,
        "user_role": current_user.user_role,
        "company_name": current_user.company_name,
        "job_title": current_user.job_title,
    }
    
    profile_data = {
        # Personal Details
        "date_of_birth": str(current_user.date_of_birth) if current_user.date_of_birth else None,
        "guardian_email": current_user.guardian_email,
        
        # Identity & Medical (ND Professional fields)
        "identity_verification_doc": current_user.identity_verification_doc,
        "has_neuro_condition_recognized": current_user.has_neuro_condition_recognized,
        "recognized_neuro_condition": current_user.recognized_neuro_condition,
        "nd_condition_proof_docs": current_user.nd_condition_proof_docs,
        "medical_conditions": current_user.medical_conditions,
        
        # Work Preferences
        "preferred_work_environment": current_user.preferred_work_environment,
        "preferred_work_setup": current_user.preferred_work_setup,
        "notes": current_user.notes,
        
        # Consents
        "public_profile_consent": current_user.public_profile_consent,
        "privacy_agreed": current_user.privacy_agreed,
        
        # Employer fields
        "company_website": current_user.company_website,
        "contact_person": current_user.contact_person,
        "contact_person_designation": current_user.contact_person_designation,
        "company_email": current_user.company_email,
        "company_verification_docs": current_user.company_verification_docs,
        "is_dei_compliant": current_user.is_dei_compliant,
        "dei_compliance_provider": current_user.dei_compliance_provider,
    }
    
    return ProfileResponse(user=user_data, profile=profile_data)

class ProfileUpdateRequest(BaseModel):
    # Personal Details
    date_of_birth: Optional[str] = None
    guardian_email: Optional[str] = None
    
    # Identity & Medical
    identity_verification_doc: Optional[str] = None
    has_neuro_condition_recognized: Optional[bool] = None
    recognized_neuro_condition: Optional[str] = None
    medical_conditions: Optional[str] = None
    
    # Work Preferences
    preferred_work_environment: Optional[str] = None
    preferred_work_setup: Optional[str] = None
    notes: Optional[str] = None
    
    # Consents
    public_profile_consent: Optional[bool] = None
    privacy_agreed: Optional[bool] = None
    
    # Employer fields
    company_website: Optional[str] = None
    contact_person: Optional[str] = None
    contact_person_designation: Optional[str] = None
    company_email: Optional[str] = None
    is_dei_compliant: Optional[bool] = None
    dei_compliance_provider: Optional[str] = None

@router.post("/update", response_model=ProfileResponse)
async def update_profile(
    profile_update: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    
    # Update user record with new profile data
    update_data = profile_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        if hasattr(current_user, field):
            setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    # Return updated profile
    return await get_profile(current_user, db)