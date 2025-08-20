"""
SQLAlchemy models for BrainBridge platform
"""

from sqlalchemy import Column, String, Text, Boolean, DateTime, Date, Integer, ForeignKey, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from server.database import Base

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

# Users table
class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    profile_image_url = Column(String)
    password = Column(Text)
    user_role = Column(String(50), nullable=False)
    company_name = Column(String)
    job_title = Column(String)
    phone = Column(String)
    company_size = Column(String)
    industry = Column(String)
    date_of_birth = Column(Date)
    guardian_email = Column(String)
    accommodation_needs = Column(Text)
    relationship = Column(String)
    nd_adult_email = Column(String)
    
    # ND Professional fields
    identity_verification_doc = Column(String)
    has_neuro_condition_recognized = Column(Boolean)
    recognized_neuro_condition = Column(Enum(NeuroCondition))
    nd_condition_proof_docs = Column(JSON)
    medical_conditions = Column(Text)
    public_profile_consent = Column(Boolean)
    preferred_work_environment = Column(Text)
    preferred_work_setup = Column(Enum(WorkSetup))
    notes = Column(Text)
    
    # Employer fields
    company_website = Column(String)
    contact_person = Column(String)
    contact_person_designation = Column(String)
    company_email = Column(String)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)

# ND Adult Profiles
class ProfileNDAdult(Base):
    __tablename__ = "profiles_nd_adults"
    
    nd_adult_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    date_of_birth = Column(Date)
    location = Column(String)
    availability_status = Column(Enum(AvailabilityStatus))
    public_profile_consent = Column(Boolean, default=False)
    match_consent = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", backref="nd_adult_profile")

# Job Postings
class JobPosting(Base):
    __tablename__ = "job_postings"
    
    job_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
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

# Traits
class Trait(Base):
    __tablename__ = "traits"
    
    trait_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trait_name = Column(String, nullable=False, unique=True)
    trait_description = Column(Text)

# Strengths
class Strength(Base):
    __tablename__ = "strengths"
    
    strength_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    strength_name = Column(String, nullable=False, unique=True)
    strength_description = Column(Text)

# Individual Traits
class IndividualTrait(Base):
    __tablename__ = "individual_traits"
    
    individual_trait_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nd_adult_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    trait_id = Column(UUID(as_uuid=True), ForeignKey("traits.trait_id"), nullable=False)
    notes = Column(Text)
    
    # Relationships
    user = relationship("User")
    trait = relationship("Trait")

# Individual Strengths
class IndividualStrength(Base):
    __tablename__ = "individual_strengths"
    
    individual_strength_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nd_adult_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    strength_id = Column(UUID(as_uuid=True), ForeignKey("strengths.strength_id"), nullable=False)
    notes = Column(Text)
    
    # Relationships
    user = relationship("User")
    strength = relationship("Strength")

# Job Matches
class JobMatch(Base):
    __tablename__ = "job_matches"
    
    match_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nd_adult_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("job_postings.job_id"), nullable=False)
    match_score = Column(Integer)
    ai_reasoning = Column(Text)
    match_date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")
    job = relationship("JobPosting")