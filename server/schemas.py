"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime
from uuid import UUID
from typing import Union
from server.models import EmploymentType, AvailabilityStatus, WorkSetup, NeuroCondition, DEICompliance
from typing import Literal
from enum import Enum

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
    id: str  # Changed from UUID to str
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

# Profile schemas - Extended with all requested fields
class ProfileNDAdultBase(BaseModel):
    # Personal Details
    date_of_birth: Optional[date] = None
    location: Optional[str] = None
    availability_status: Optional[AvailabilityStatus] = None
    guardian_email: Optional[str] = None
    
    # Identity & Medical Information
    identity_verification_doc: Optional[str] = None
    has_neuro_condition_recognized: Optional[bool] = None
    recognized_neuro_condition: Optional[NeuroCondition] = None
    nd_condition_proof_docs: Optional[List[str]] = None  # Up to 5 documents
    medical_conditions: Optional[str] = None
    
    # Preferences & Consents
    public_profile_consent: bool = False
    match_consent: bool = False
    preferred_work_environment: Optional[str] = None
    preferred_work_setup: Optional[WorkSetup] = None
    notes: Optional[str] = None
    privacy_agreed: Optional[bool] = None

class ProfileNDAdultCreate(ProfileNDAdultBase):
    nd_adult_id: str  # Changed from UUID to str

class ProfileNDAdultUpdate(ProfileNDAdultBase):
    pass

class ProfileNDAdultResponse(ProfileNDAdultBase):
    nd_adult_id: str  # Changed from UUID to str
    
    class Config:
        from_attributes = True

# Employer Profile schemas - New
class ProfileEmployerBase(BaseModel):
    # Company Details
    company_website: Optional[str] = None
    contact_person: Optional[str] = None
    contact_person_designation: Optional[str] = None
    company_email: Optional[str] = None
    
    # Verification & Compliance
    company_verification_docs: Optional[List[str]] = None  # Up to 5 documents
    is_dei_compliant: Optional[bool] = None
    dei_compliance_type: Optional[DEICompliance] = None
    
    # Consent
    privacy_agreed: Optional[bool] = None

class ProfileEmployerCreate(ProfileEmployerBase):
    employer_id: str

class ProfileEmployerUpdate(ProfileEmployerBase):
    pass

class ProfileEmployerResponse(ProfileEmployerBase):
    employer_id: str
    
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
    job_id: str  # Changed from UUID to str
    employer_id: str  # Changed from UUID to str
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
    trait_id: str  # Changed from UUID to str
    
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

# Assessment and Self-Discovery Schemas
class AssessmentType(str, Enum):
    QUIZ = "quiz"
    BEHAVIORAL = "behavioral" 
    WORK_HISTORY = "work_history"

class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    SCALE = "scale"
    TEXT = "text"
    BOOLEAN = "boolean"

class AssessmentQuestion(BaseModel):
    question_id: str
    question_text: str
    question_type: QuestionType
    options: Optional[List[str]] = None  # For multiple choice
    scale_min: Optional[int] = None      # For scale questions
    scale_max: Optional[int] = None
    scale_labels: Optional[dict] = None  # e.g., {1: "Never", 5: "Always"}
    cdc_targets: List[str] = []          # Which CDCs this question measures

class AssessmentCreate(BaseModel):
    assessment_type: AssessmentType
    title: str
    description: Optional[str] = None
    questions: List[AssessmentQuestion]
    scoring_config: dict
    cdc_mapping: dict  # CDC -> weight mapping

class AssessmentResponseCreate(BaseModel):
    assessment_id: str
    responses: dict  # question_id -> answer
    completion_time_seconds: Optional[int] = None

class CDCStrengths(BaseModel):
    # Core CDCs
    focus_sustained_attention: Optional[float] = Field(None, ge=0.0, le=1.0)
    pattern_recognition: Optional[float] = Field(None, ge=0.0, le=1.0)
    verbal_communication: Optional[float] = Field(None, ge=0.0, le=1.0)
    spatial_reasoning: Optional[float] = Field(None, ge=0.0, le=1.0)
    creative_ideation: Optional[float] = Field(None, ge=0.0, le=1.0)
    multitasking_context_switching: Optional[float] = Field(None, ge=0.0, le=1.0)
    
    # Additional CDCs
    processing_speed: Optional[float] = Field(None, ge=0.0, le=1.0)
    executive_function: Optional[float] = Field(None, ge=0.0, le=1.0)
    fine_motor_input: Optional[float] = Field(None, ge=0.0, le=1.0)
    sensory_processing: Optional[float] = Field(None, ge=0.0, le=1.0)
    communication_interpretation: Optional[float] = Field(None, ge=0.0, le=1.0)
    attention_filtering: Optional[float] = Field(None, ge=0.0, le=1.0)

class CognitiveProfileResponse(BaseModel):
    user_id: str
    strengths: CDCStrengths
    sensitivities: dict  # e.g., {"noise": "high", "lighting": "medium"}
    preferences: dict    # e.g., {"routine": "high", "remote": "preferred"}
    embedding: Optional[str] = None
    evidence: dict  # {"quiz_ids": [...], "work_history": [...]}
    confidence_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    last_updated: datetime

class SelfDiscoveryAgentRequest(BaseModel):
    user_id: str
    quiz_results: dict
    behavior_data: Optional[dict] = None
    past_data: Optional[dict] = None
    include_analysis: bool = True

class SelfDiscoveryAgentResponse(BaseModel):
    user_id: str
    strengths: dict
    sensitivities: dict
    preferences: dict
    embedding: str
    evidence: dict
    analysis: Optional[str] = None
    recommendations: Optional[List[str]] = None