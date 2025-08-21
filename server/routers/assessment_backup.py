"""
Assessment and Self-Discovery API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import logging

from server.database import get_db
from server.models import User, Assessment, AssessmentResponse, CognitiveProfile
from server.schemas import (
    AssessmentCreate, 
    AssessmentResponseCreate,
    SelfDiscoveryAgentRequest,
    SelfDiscoveryAgentResponse,
    CognitiveProfileResponse
)
from server.auth import get_current_user
from server.ai_agent import agent

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/assessments", response_model=dict)
async def create_assessment(
    assessment_data: AssessmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new assessment (admin only)"""
    if current_user.user_role not in ["ADMIN", "MANAGER"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create assessments"
        )
    
    new_assessment = Assessment(
        user_id=current_user.id,
        **assessment_data.model_dump()
    )
    
    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)
    
    return {"assessment_id": new_assessment.assessment_id, "message": "Assessment created successfully"}

@router.get("/assessments", response_model=List[dict])
async def get_available_assessments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all available assessments (ND Adults only)"""
    if current_user.user_role != "ND_ADULT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Self-discovery assessments are only available for ND professionals"
        )
    
    assessments = db.query(Assessment).filter(Assessment.is_active.is_(True)).all()
    
    return [
        {
            "assessment_id": a.assessment_id,
            "title": a.title,
            "description": a.description,
            "assessment_type": a.assessment_type,
            "questions": a.questions,
            "estimated_time": len(a.questions) * 2 if a.questions else 10  # 2 minutes per question estimate
        }
        for a in assessments
    ]

@router.post("/assessments/{assessment_id}/respond")
async def submit_assessment_response(
    assessment_id: str,
    response_data: AssessmentResponseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit responses to an assessment (ND Adults only)"""
    print(f"Submitting assessment response for user {current_user.user_role} to assessment {assessment_id}")
    if current_user.user_role != "ND_ADULT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Self-discovery assessments are only available for ND professionals"
        )
    
    # Verify assessment exists
    assessment = db.query(Assessment).filter(Assessment.assessment_id == assessment_id).first()
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    # Create response record
    new_response = AssessmentResponse(
        assessment_id=assessment_id,
        user_id=current_user.id,
        **response_data.model_dump()
    )
    
    db.add(new_response)
    db.commit()
    db.refresh(new_response)
    
    return {"message": "Assessment response submitted successfully", "response_id": new_response.response_id}

@router.post("/analyze-profile", response_model=SelfDiscoveryAgentResponse)
async def analyze_cognitive_profile(
    request: SelfDiscoveryAgentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Run AI analysis to generate cognitive profile (ND Adults only)"""
    
    # Verify user is ND Adult or admin
    if current_user.user_role not in ["ND_ADULT", "ADMIN", "MANAGER"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Self-discovery analysis is only available for ND professionals"
        )
    
    # Verify user can access this profile
    if request.user_id != current_user.id and current_user.user_role not in ["ADMIN", "MANAGER"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only analyze your own profile"
        )
    
    try:
        # Run the AI agent analysis
        profile_result = await agent.analyze_cognitive_profile(
            user_id=request.user_id,
            quiz_results=request.quiz_results,
            behavior_data=request.behavior_data,
            past_data=request.past_data
        )
        
        # Save or update cognitive profile in database
        existing_profile = db.query(CognitiveProfile).filter(
            CognitiveProfile.user_id == request.user_id
        ).first()
        
        if existing_profile:
            # Update existing profile
            for key, value in profile_result["strengths"].items():
                if hasattr(existing_profile, key):
                    setattr(existing_profile, key, value)
            
            existing_profile.sensitivities = profile_result["sensitivities"]
            existing_profile.preferences = profile_result["preferences"]
            existing_profile.embedding_vector = profile_result["embedding"]
            existing_profile.evidence_sources = profile_result["evidence"]
            existing_profile.confidence_score = profile_result["confidence_score"]
        else:
            # Create new profile
            new_profile = CognitiveProfile(
                user_id=request.user_id,
                sensitivities=profile_result["sensitivities"],
                preferences=profile_result["preferences"],
                embedding_vector=profile_result["embedding"],
                evidence_sources=profile_result["evidence"],
                confidence_score=profile_result["confidence_score"],
                **profile_result["strengths"]
            )
            db.add(new_profile)
        
        db.commit()
        
        return SelfDiscoveryAgentResponse(**profile_result)
        
    except Exception as e:
        logger.error(f"Error analyzing profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze cognitive profile: {str(e)}"
        )

@router.get("/profile/{user_id}", response_model=CognitiveProfileResponse)
async def get_cognitive_profile(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get cognitive profile for a user (ND Adults only)"""
    
    # Verify user is ND Adult or admin
    if current_user.user_role not in ["ND_ADULT", "ADMIN", "MANAGER"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cognitive profiles are only available for ND professionals"
        )
    
    # Verify access permissions
    if user_id != current_user.id and current_user.user_role not in ["ADMIN", "MANAGER"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only view your own profile"
        )
    
    profile = db.query(CognitiveProfile).filter(CognitiveProfile.user_id == user_id).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cognitive profile not found. Please complete an assessment first."
        )
    
    # Convert to response format
    strengths = {}
    for cdc in ["focus_sustained_attention", "pattern_recognition", "verbal_communication",
                "spatial_reasoning", "creative_ideation", "multitasking_context_switching",
                "processing_speed", "executive_function", "fine_motor_input",
                "sensory_processing", "communication_interpretation", "attention_filtering"]:
        strengths[cdc] = getattr(profile, cdc, None)
    
    return CognitiveProfileResponse(
        user_id=str(profile.user_id),
        strengths=strengths,
        sensitivities=profile.sensitivities or {},
        preferences=profile.preferences or {},
        embedding=str(profile.embedding_vector) if profile.embedding_vector else None,
        evidence=profile.evidence_sources or {},
        confidence_score=float(profile.confidence_score) if profile.confidence_score else 0.0,
        last_updated=profile.last_updated
    )

@router.get("/quiz-templates")
async def get_quiz_templates(
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive CDC assessment templates (ND Adults only)"""
    if current_user.user_role != "ND_ADULT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Self-discovery assessments are only available for ND professionals"
        )
    
    # Import comprehensive assessment templates
    from server.assessment_templates import get_comprehensive_assessments
    comprehensive_assessments = get_comprehensive_assessments()
    
    return {"available_quizzes": comprehensive_assessments}
                        "Collaborative planning with team input"
                    ],
                    "cdc_targets": ["executive_function", "verbal_communication"]
                },
                {
                    "question_id": "interruption_1",
                    "question_text": "When interrupted during focused work, you:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Address the interruption immediately",
                        "Note it and return after completing current task",
                        "Feel frustrated and struggle to refocus",
                        "Use interruptions as natural break points"
                    ],
                    "cdc_targets": ["multitasking_context_switching", "attention_filtering"]
                }
            ]
        },
        {
            "quiz_id": "sensory_processing_assessment",
            "title": "🌈 Sensory Processing & Environment Preferences",
            "description": "Understand your sensory needs and environmental preferences",
            "activity_type": "environment_preferences",
            "estimated_time": 10,
            "cdc_focus": ["sensory_processing", "fine_motor_input"],
            "questions": [
                {
                    "question_id": "sensory_env_1",
                    "question_text": "Your ideal work environment has:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Bright, natural lighting",
                        "Soft, adjustable lighting",
                        "Consistent artificial lighting",
                        "Varied lighting options"
                    ],
                    "cdc_targets": ["sensory_processing"]
                },
                {
                    "question_id": "input_pref_1",
                    "question_text": "For inputting text, you prefer:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Mechanical keyboard with tactile feedback",
                        "Voice-to-text when possible",
                        "Touchscreen with haptic feedback",
                        "Standard keyboard is fine"
                    ],
                    "cdc_targets": ["fine_motor_input", "sensory_processing"]
                },
                {
                    "question_id": "sound_pref_1",
                    "question_text": "Background noise while working:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Complete silence works best",
                        "White noise or instrumental music",
                        "Natural sounds (rain, waves)",
                        "Can adapt to various sound levels"
                    ],
                    "cdc_targets": ["sensory_processing", "attention_filtering"]
                }
            ]
        }
    ]
    
    return {"available_quizzes": comprehensive_assessments}