"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime
from uuid import UUID
from server.models import EmploymentType, AvailabilityStatus, WorkSetup, NeuroCondition
from typing import Literal

# Base schemas
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    user_role: Literal['ND_ADULT', 'EMPLOYER', 'MENTOR', 'GUARDIAN', 'ADMIN', 'MANAGER']
    phone: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    user_role: Literal['ND_ADULT', 'EMPLOYER', 'MENTOR', 'GUARDIAN', 'ADMIN', 'MANAGER']
    phone: Optional[str] = Field(None, min_length=10, max_length=20)
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long")

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    company_name: Optional[str] = None
    job_title: Optional[str] = None

class UserResponse(UserBase):
    id: UUID
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Profile schemas
class ProfileNDAdultBase(BaseModel):
    date_of_birth: Optional[date] = None
    location: Optional[str] = None
    availability_status: Optional[AvailabilityStatus] = None
    public_profile_consent: bool = False
    match_consent: bool = False

class ProfileNDAdultCreate(ProfileNDAdultBase):
    nd_adult_id: UUID

class ProfileNDAdultUpdate(ProfileNDAdultBase):
    pass

class ProfileNDAdultResponse(ProfileNDAdultBase):
    nd_adult_id: UUID
    
    class Config:
        from_attributes = True

# Job posting schemas
class JobPostingBase(BaseModel):
    job_title: str
    job_description: Optional[str] = None
    employment_type: Optional[EmploymentType] = None
    location: Optional[str] = None
    work_setup: Optional[WorkSetup] = None
    salary_range_min: Optional[int] = None
    salary_range_max: Optional[int] = None
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    application_deadline: Optional[date] = None

class JobPostingCreate(JobPostingBase):
    pass

class JobPostingUpdate(JobPostingBase):
    is_active: Optional[bool] = None

class JobPostingResponse(JobPostingBase):
    job_id: UUID
    employer_id: UUID
    posted_date: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

# Trait schemas
class TraitBase(BaseModel):
    trait_name: str
    trait_description: Optional[str] = None

class TraitCreate(TraitBase):
    pass

class TraitResponse(TraitBase):
    trait_id: UUID
    
    class Config:
        from_attributes = True

# Strength schemas
class StrengthBase(BaseModel):
    strength_name: str
    strength_description: Optional[str] = None

class StrengthCreate(StrengthBase):
    pass

class StrengthResponse(StrengthBase):
    strength_id: UUID
    
    class Config:
        from_attributes = True

# Job match schemas
class JobMatchBase(BaseModel):
    match_score: Optional[int] = None
    ai_reasoning: Optional[str] = None

class JobMatchCreate(JobMatchBase):
    nd_adult_id: UUID
    job_id: UUID

class JobMatchResponse(JobMatchBase):
    match_id: UUID
    nd_adult_id: UUID
    job_id: UUID
    match_date: datetime
    
    class Config:
        from_attributes = True