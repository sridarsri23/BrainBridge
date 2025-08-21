#!/usr/bin/env python3
"""
FastAPI backend for BrainBridge - Job matching platform for neurodivergent professionals
"""

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import uvicorn
import os
from typing import Dict, Any, Optional

from server.database import init_db, get_db
from server.models import UserRole, User
from server.auth import verify_token, get_current_user
from server.routers import auth, users, jobs, admin
from sqlalchemy.orm import Session

# Initialize database on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    yield
    # Shutdown
    pass

app = FastAPI(
    title="BrainBridge API", 
    version="1.0.0",
    description="A comprehensive job matching platform for neurodivergent professionals",
    lifespan=lifespan
)

# Custom exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Custom handler for validation errors to provide user-friendly messages"""
    errors = []
    for error in exc.errors():
        field = error.get("loc", [])[-1] if error.get("loc") else "field"
        msg = error.get("msg", "Invalid value")
        errors.append(f"{field}: {msg}")
    
    return JSONResponse(
        status_code=422,
        content={"detail": f"Validation error: {', '.join(errors)}"}
    )

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
# Removed old profiles router - using direct /api/profile endpoint instead
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
# Assessment and Self-Discovery routes
from server.routers import assessment, ai_analysis
app.include_router(assessment.router, prefix="/api/assessment", tags=["assessment"])
app.include_router(ai_analysis.router, prefix="/api/ai", tags=["ai-analysis"])
# Removed employer_profiles router - all data now in users table

# Additional route aliases for frontend compatibility
@app.get("/api/matches")
async def get_job_matches_alias(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get job matches for current user - alias for /api/jobs/matches/my"""
    from server.routers.jobs import get_my_job_matches
    return await get_my_job_matches(current_user, db)

@app.get("/api/profile")
async def get_user_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user profile with all requested fields"""
    
    return {
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "phone": current_user.phone,
            "user_role": current_user.user_role,
            "company_name": current_user.company_name,
            "job_title": current_user.job_title,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at
        },
        "profile": {
            # Personal Details - all fields from users table
            "date_of_birth": str(current_user.date_of_birth) if current_user.date_of_birth is not None else None,
            "guardian_email": getattr(current_user, 'guardian_email', None),
            
            # Identity & Medical (ND Professional fields) - safely handle missing fields
            "identity_verification_doc": getattr(current_user, 'identity_verification_doc', None),
            "has_neuro_condition_recognized": getattr(current_user, 'has_neuro_condition_recognized', None),
            "recognized_neuro_condition": getattr(current_user, 'recognized_neuro_condition', None),
            "nd_condition_proof_docs": getattr(current_user, 'nd_condition_proof_docs', None),
            "medical_conditions": getattr(current_user, 'medical_conditions', None),
            
            # Work Preferences - safely handle missing fields
            "preferred_work_environment": getattr(current_user, 'preferred_work_environment', None),
            "preferred_work_setup": getattr(current_user, 'preferred_work_setup', None),
            "notes": getattr(current_user, 'notes', None),
            
            # Consents - safely handle missing fields
            "public_profile_consent": getattr(current_user, 'public_profile_consent', None),
            "privacy_agreed": getattr(current_user, 'privacy_agreed', None),
            
            # Employer fields - safely handle missing fields
            "company_website": getattr(current_user, 'company_website', None),
            "contact_person": getattr(current_user, 'contact_person', None),
            "contact_person_designation": getattr(current_user, 'contact_person_designation', None),
            "company_email": getattr(current_user, 'company_email', None),
            "company_verification_docs": getattr(current_user, 'company_verification_docs', None),
            "is_dei_compliant": getattr(current_user, 'is_dei_compliant', None),
            "dei_compliance_provider": getattr(current_user, 'dei_compliance_provider', None),
        }
    }

@app.get("/api/user/profile")  
async def get_user_profile_alt(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user profile - alternative route using users table directly"""
    return await get_user_profile(current_user, db)

@app.put("/api/user/profile")
async def update_user_profile(profile_data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update current user profile with all requested fields"""
    try:
        print(f"Updating profile for user {current_user.id} with data: {profile_data}")
        
        # Update basic user fields that definitely exist
        if "firstName" in profile_data and profile_data["firstName"]:
            current_user.first_name = profile_data["firstName"]
            print(f"Updated first_name to: {profile_data['firstName']}")
            
        if "lastName" in profile_data and profile_data["lastName"]:
            current_user.last_name = profile_data["lastName"]
            print(f"Updated last_name to: {profile_data['lastName']}")
            
        if "phone" in profile_data:
            current_user.phone = profile_data["phone"]
            print(f"Updated phone to: {profile_data['phone']}")
        
        # Handle optional fields safely with setattr
        optional_fields = {
            "dateOfBirth": "date_of_birth",
            "guardianEmail": "guardian_email", 
            "location": "location",
            "preferredWorkEnvironment": "preferred_work_environment",
            "availabilityStatus": "availability_status",
            "hasNeuroConditionRecognized": "has_neuro_condition_recognized",
            "medicalConditions": "medical_conditions",
            "publicProfileConsent": "public_profile_consent",
            "privacyAgreed": "privacy_agreed",
            "isDeiCompliant": "is_dei_compliant"
        }
        
        for frontend_field, db_field in optional_fields.items():
            if frontend_field in profile_data:
                try:
                    setattr(current_user, db_field, profile_data[frontend_field])
                    print(f"Updated {db_field} to: {profile_data[frontend_field]}")
                except Exception as field_error:
                    print(f"Warning: Could not update {db_field}: {str(field_error)}")
                    # Continue with other fields instead of failing completely
            
        db.commit()
        db.refresh(current_user)
        print("Profile update successful")
        
        return {"message": "Profile updated successfully", "success": True}
        
    except Exception as e:
        db.rollback()
        error_msg = f"Failed to update profile: {str(e)}"
        print(f"Profile update error: {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/api/matches")
async def get_job_matches(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get job matches for current user"""
    # Create some sample matches for now since we don't have the full matching algorithm
    matches = [
        {
            "matchId": "1",
            "jobTitle": "Frontend Developer", 
            "companyName": "TechCorp Inc",
            "location": "Remote",
            "employmentType": "Full-time",
            "matchScore": 95,
            "matchReasons": ["React expertise", "Accessibility focus", "Remote-friendly"],
            "salary": "$75,000 - $90,000",
            "description": "Join our inclusive tech team building accessible web applications.",
            "tags": ["React", "TypeScript", "Accessibility", "Remote"]
        },
        {
            "matchId": "2", 
            "jobTitle": "Data Analyst",
            "companyName": "DataFlow Solutions",
            "location": "New York, NY",
            "employmentType": "Full-time", 
            "matchScore": 88,
            "matchReasons": ["Detail-oriented", "Pattern recognition", "Structured work"],
            "salary": "$65,000 - $80,000",
            "description": "Analyze data patterns and create insights for business decisions.",
            "tags": ["Python", "SQL", "Analytics", "Flexible Schedule"]
        },
        {
            "matchId": "3",
            "jobTitle": "UX Designer",
            "companyName": "Design Forward",
            "location": "San Francisco, CA", 
            "employmentType": "Contract",
            "matchScore": 82,
            "matchReasons": ["User empathy", "Systematic thinking", "Creative problem-solving"],
            "salary": "$60 - $80/hour",
            "description": "Design inclusive user experiences for diverse audiences.",
            "tags": ["Figma", "User Research", "Accessibility", "Inclusive Design"]
        }
    ]
    return matches

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "BrainBridge API"}

# Root API endpoint (only for direct API access)
@app.get("/api/")
async def root():
    """Root API endpoint"""
    return {
        "message": "Welcome to BrainBridge API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Serve static files (both development and production)
static_files_dir = "dist/public" if os.path.exists("dist/public") else "client/dist"
assets_dir = f"{static_files_dir}/assets" if os.path.exists(f"{static_files_dir}/assets") else f"{static_files_dir}/assets"

if os.path.exists(static_files_dir):
    # Mount static assets
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    
    # Serve the React SPA for all non-API routes
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve the React SPA for all non-API routes"""
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        
        index_file = f"{static_files_dir}/index.html"
        if os.path.exists(index_file):
            return FileResponse(index_file)
        else:
            raise HTTPException(status_code=404, detail="Frontend not built")
else:
    print("Warning: Frontend static files not found. Please run 'npm run build' first.")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.getenv("NODE_ENV") == "development" else False,
        log_level="info"
    )