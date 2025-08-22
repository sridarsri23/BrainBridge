"""
SQLAlchemy models for BrainBridge platform
"""

from sqlalchemy import Column, String, Text, Boolean, DateTime, Date, Integer, Float, ForeignKey, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import uuid
import enum

# Enums
class UserRole(enum.Enum):
    ND_ADULT = "ND_ADULT"
    EMPLOYER = "EMPLOYER"
    MENTOR = "MENTOR"
    GUARDIAN = "GUARDIAN"
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"

class EmploymentType(enum.Enum):
    FULL_TIME = "Full-time"
    PART_TIME = "Part-time"
    CONTRACT = "Contract"
    INTERNSHIP = "Internship"

class AvailabilityStatus(enum.Enum):
    ACTIVELY_LOOKING = "Actively Looking"
    PASSIVELY_LOOKING = "Passively Looking"
    NOT_LOOKING = "Not Looking"

class WorkSetup(enum.Enum):
    ON_SITE = "On-Site"
    HYBRID = "Hybrid"
    REMOTE = "Remote"

class NeuroCondition(enum.Enum):
    ASD = "Autism Spectrum Disorder (ASD)"
    ADHD = "Attention-Deficit/Hyperactivity Disorder (ADHD)"
    DYSPRAXIA = "Dyspraxia"
    DYSCALCULIA = "Dyscalculia"
    TOURETTE = "Tourette Syndrome"
    OTHERS = "others"

class DEICompliance(enum.Enum):
    IBCCES = "IBCCES"
    NEUROINCLUSION_LAB = "Neuroinclusion Lab"
    NEUROINCLUSION_INNOVATORS = "NeuroInclusion Innovators"
    COGNASSIST = "Cognassist"
    NEURODIVERSITY_HUB = "Neurodiversity Hub"
    VT_HEC = "VT-HEC / La Verne Programs"

# Users table - contains ALL profile fields for both ND Adults and Employers
class User(Base):
    __tablename__ = "users"
    
    # Core user info
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    profile_image_url = Column(String)
    password = Column(Text)
    user_role = Column(String(50), nullable=False)
    phone = Column(String)
    
    # Company info (for employers)
    company_name = Column(String)
    job_title = Column(String)
    company_size = Column(String)
    industry = Column(String)
    
    # Personal details (for ND professionals)
    date_of_birth = Column(Date)
    guardian_email = Column(String)
    accommodation_needs = Column(Text)
    relationship = Column(String)
    nd_adult_email = Column(String)
    
    # Identity & Medical (ND professional fields as requested by user)
    identity_verification_doc = Column(String)
    has_neuro_condition_recognized = Column(Boolean)
    recognized_neuro_condition = Column(String)
    nd_condition_proof_docs = Column(JSON)  # Up to 5 documents
    medical_conditions = Column(Text)
    
    # Work preferences (ND professional fields as requested by user)
    location = Column(String)
    preferred_work_environment = Column(Text)
    preferred_work_setup = Column(String)
    availability_status = Column(String)
    notes = Column(Text)
    
    # Consents (as requested by user)
    public_profile_consent = Column(Boolean)
    privacy_agreed = Column(Boolean)
    
    # Employer fields (as requested by user)
    company_website = Column(String)
    contact_person = Column(String)
    contact_person_designation = Column(String)
    company_email = Column(String)
    company_verification_docs = Column(JSON)  # Up to 5 documents
    is_dei_compliant = Column(Boolean)
    dei_compliance_provider = Column(String)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)

# Job Postings
class JobPosting(Base):
    __tablename__ = "job_postings"
    
    job_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    employer_id = Column(String, ForeignKey("users.id"), nullable=False)
    job_title = Column(String, nullable=False)
    job_description = Column(Text)
    employment_type = Column(Enum(EmploymentType))
    location = Column(String)
    work_setup = Column(Enum(WorkSetup))
    salary_range_min = Column(Integer)
    salary_range_max = Column(Integer)
    requirements = Column(Text)
    benefits = Column(Text)
    posted_date = Column(DateTime(timezone=True), server_default=func.now())
    application_deadline = Column(Date)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    employer = relationship("User", backref="job_postings")
    
# Add cognitive_profile relationship to User
User.cognitive_profile = relationship("CognitiveProfile", back_populates="user", uselist=False)

# Traits
class Trait(Base):
    __tablename__ = "traits"
    
    trait_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    trait_name = Column(String, nullable=False, unique=True)
    trait_description = Column(Text)

# Strengths
class Strength(Base):
    __tablename__ = "strengths"
    
    strength_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    strength_name = Column(String, nullable=False, unique=True)
    strength_description = Column(Text)

# Individual Traits
class IndividualTrait(Base):
    __tablename__ = "individual_traits"
    
    individual_trait_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nd_adult_id = Column(String, ForeignKey("users.id"), nullable=False)
    trait_id = Column(String, ForeignKey("traits.trait_id"), nullable=False)
    notes = Column(Text)
    
    # Relationships
    user = relationship("User")
    trait = relationship("Trait")

# Individual Strengths
class IndividualStrength(Base):
    __tablename__ = "individual_strengths"
    
    individual_strength_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nd_adult_id = Column(String, ForeignKey("users.id"), nullable=False)
    strength_id = Column(String, ForeignKey("strengths.strength_id"), nullable=False)
    notes = Column(Text)
    
    # Relationships
    user = relationship("User")
    strength = relationship("Strength")

# Job Matches
class JobMatch(Base):
    __tablename__ = "job_matches"
    
    match_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nd_adult_id = Column(String, ForeignKey("users.id"), nullable=False)
    job_id = Column(String, ForeignKey("job_postings.job_id"), nullable=False)
    match_score = Column(Integer)
    match_reasoning = Column(Text)
    match_date = Column(DateTime(timezone=True), server_default=func.now())
    is_recommended_to_adult = Column(Boolean, default=True)
    is_viewed_by_adult = Column(Boolean, default=False)
    is_liked_by_adult = Column(Boolean, default=False)
    is_liked_by_employer = Column(Boolean, default=False)
    
    # Relationships
    nd_adult = relationship("User", foreign_keys=[nd_adult_id])
    job_posting = relationship("JobPosting")

# Support Relationships
class SupportRelationship(Base):
    __tablename__ = "support_relationships"
    
    relationship_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nd_adult_id = Column(String, ForeignKey("users.id"), nullable=False)
    mentor_id = Column(String, ForeignKey("users.id"))
    guardian_id = Column(String, ForeignKey("users.id"))
    relationship_type = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    nd_adult = relationship("User", foreign_keys=[nd_adult_id])
    mentor = relationship("User", foreign_keys=[mentor_id])
    guardian = relationship("User", foreign_keys=[guardian_id])

# Audit Trail
# Assessment and Self-Discovery Models
class Assessment(Base):
    __tablename__ = "assessments"
    
    assessment_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    assessment_type = Column(String, nullable=False)  # 'quiz', 'behavioral', 'work_history'
    title = Column(String, nullable=False)
    description = Column(Text)
    questions = Column(JSON)  # Quiz questions and options
    scoring_config = Column(JSON)  # How to score responses
    cdc_mapping = Column(JSON)  # Which CDCs this assessment measures
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    responses = relationship("AssessmentResponse", back_populates="assessment")

class AssessmentResponse(Base):
    __tablename__ = "assessment_responses"
    
    response_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    assessment_id = Column(String, ForeignKey("assessments.assessment_id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    responses = Column(JSON, nullable=False)  # User's answers
    completion_time_seconds = Column(Integer)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    assessment = relationship("Assessment", back_populates="responses")
    user = relationship("User")

class CognitiveProfile(Base):
    __tablename__ = "cognitive_profiles"
    
    profile_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, unique=True)
    
    # Core CDC Strengths (0.0 to 1.0 scale)
    focus_sustained_attention = Column(Float)
    pattern_recognition = Column(Float)
    verbal_communication = Column(Float)
    spatial_reasoning = Column(Float)
    creative_ideation = Column(Float)
    multitasking_context_switching = Column(Float)
    
    # Additional CDC Strengths
    processing_speed = Column(Float)
    executive_function = Column(Float)
    fine_motor_input = Column(Float)
    sensory_processing = Column(Float)
    communication_interpretation = Column(Float)
    attention_filtering = Column(Float)
    
    # Sensitivities (JSON format)
    sensitivities = Column(JSON)  # {"noise": "high", "lighting": "medium"}
    preferences = Column(JSON)    # {"routine": "high", "remote": "preferred"}
    
    # Vector embedding for similarity matching
    embedding_vector = Column(String)  # Serialized vector representation
    
    # Evidence and metadata
    evidence_sources = Column(JSON)  # {"quiz_ids": [...], "work_history": [...]}
    confidence_score = Column(Float)  # Overall confidence in the profile
    last_updated = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="cognitive_profile")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    audit_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    table_name = Column(String, nullable=False)
    operation = Column(String, nullable=False)  # INSERT, UPDATE, DELETE
    old_values = Column(JSON)
    new_values = Column(JSON)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")