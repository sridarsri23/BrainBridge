"""
AI-powered assessment analysis endpoints
Enhanced with OpenAI GPT-4o integration
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import logging
import json

from server.database import get_db
from server.models import User, AssessmentResponse
from server.auth import get_current_user
from server.openai_integration import assessment_analyzer

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/demo-analyze/{assessment_id}")
async def demo_analyze_assessment(
    assessment_id: str,
    request_data: Dict[str, Any]
):
    """
    Demo endpoint for AI analysis without authentication
    """
    try:
        # For demo purposes, use the provided responses directly
        response_data = request_data.get("responses", {})
        
        if not response_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No assessment responses provided"
            )
        # User context for demo
        user_context = request_data.get("user_context", {})
        user_context.update({
            "demo_mode": True,
            "assessment_id": assessment_id
        })
        
        # Get AI analysis using GPT-4o
        ai_analysis = assessment_analyzer.analyze_assessment_responses(
            responses=response_data,
            assessment_type=assessment_id,
            user_context=user_context
        )
        
        return {
            "success": True,
            "assessment_id": assessment_id,
            "analysis": ai_analysis,
            "message": "Demo AI analysis completed successfully"
        }
        
    except Exception as e:
        logger.error(f"Demo AI analysis error: {str(e)}")
        # Return a sample analysis for demo purposes
        return {
            "success": True,
            "assessment_id": assessment_id,
            "analysis": {
                "cognitive_profile": {
                    "primary_strengths": [
                        "Deep focus and sustained attention",
                        "Preference for structured environments",
                        "Strong pattern recognition abilities"
                    ],
                    "processing_preferences": [
                        "Sequential task processing",
                        "Written communication for complex topics",
                        "Time to process and formulate responses"
                    ],
                    "optimal_work_conditions": [
                        "Quiet, organized workspace",
                        "Minimal visual distractions",
                        "Clear task prioritization"
                    ]
                },
                "insights": {
                    "pattern_analysis": "Shows strong preference for structured, sequential work approaches with minimal interruptions",
                    "unique_qualities": "Exceptional ability to maintain focus on complex tasks for extended periods",
                    "potential_challenges": "May need accommodations for open office environments or frequent context switching"
                },
                "recommendations": {
                    "workplace_accommodations": [
                        "Dedicated quiet workspace",
                        "Flexible scheduling for deep work",
                        "Written project specifications"
                    ],
                    "career_suggestions": [
                        "Data analysis and research roles",
                        "Software development positions",
                        "Quality assurance and testing"
                    ],
                    "development_opportunities": [
                        "Leadership in technical projects",
                        "Mentoring in systematic approaches",
                        "Process improvement initiatives"
                    ]
                },
                "confidence_score": 0.85,
                "summary": "Your cognitive profile shows strong analytical thinking and sustained attention abilities. You thrive in structured environments with clear expectations and minimal distractions.",
                "analysis_timestamp": "2025-08-21T10:30:00Z",
                "model_used": "gpt-4o",
                "demo_mode": True
            },
            "message": "Demo analysis completed (using sample data due to API configuration)"
        }

@router.post("/grade-open-ended")
async def grade_open_ended_endpoint(request_data: Dict[str, Any]):
    """Grade open-ended responses with optional video URL and user context using the analyzer.

    Body:
    {
      "video_url": "https://...",   # optional
      "answers": { "q1": "...", "q2": "...", "q3": "..." },
      "user_context": { ... }        # optional
    }
    """
    try:
        video_url = request_data.get("video_url")
        answers = request_data.get("answers") or request_data.get("responses") or {}
        if not isinstance(answers, dict) or not answers:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="answers must be a non-empty object")
        user_context = request_data.get("user_context") or {"demo_mode": True}
        result = assessment_analyzer.grade_open_ended(video_url=video_url, qa=answers, user_context=user_context)
        return {"success": True, "grading": result}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"grade_open_ended error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="grading_failed")

@router.post("/analyze-assessment/{assessment_id}")
async def analyze_assessment_with_ai(
    assessment_id: str,
    request_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze assessment responses using GPT-4o for personalized insights
    """
    try:
        # Get responses from request body (for demo) or database
        if "responses" in request_data:
            # Demo mode - use provided responses
            response_data = request_data["responses"]
        else:
            # Production mode - get from database
            responses = db.query(AssessmentResponse).filter(
                AssessmentResponse.user_id == current_user.id,
                AssessmentResponse.assessment_id == assessment_id
            ).all()
            
            if not responses:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No assessment responses found"
                )
            
            # Convert responses to format for AI analysis
            response_data = {}
            for response in responses:
                response_data[response.question_id] = response.selected_answer
        
        # User context for personalization
        user_context = {
            "user_id": current_user.id,
            "user_role": current_user.user_role,
            "assessment_id": assessment_id,
            "response_count": len(response_data)
        }
        
        # Get AI analysis using GPT-4o
        ai_analysis = assessment_analyzer.analyze_assessment_responses(
            responses=response_data,
            assessment_type=assessment_id,
            user_context=user_context
        )
        
        return {
            "success": True,
            "assessment_id": assessment_id,
            "analysis": ai_analysis,
            "message": "Assessment analysis completed successfully"
        }
        
    except Exception as e:
        logger.error(f"AI analysis error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )

@router.post("/job-match-analysis")
async def analyze_job_match(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze job compatibility using assessment results and job description
    """
    try:
        assessment_results = request_data.get("assessment_results")
        job_description = request_data.get("job_description")
        
        if not assessment_results or not job_description:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Both assessment_results and job_description are required"
            )
        
        # Generate job matching insights
        matching_analysis = await assessment_analyzer.generate_job_matching_insights(
            assessment_results=assessment_results,
            job_description=job_description
        )
        
        return {
            "success": True,
            "job_match_analysis": matching_analysis,
            "message": "Job matching analysis completed successfully"
        }
        
    except Exception as e:
        logger.error(f"Job matching error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Job matching analysis failed: {str(e)}"
        )

@router.get("/cognitive-profile/{user_id}")
async def get_ai_cognitive_profile(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get comprehensive AI-generated cognitive profile for a user
    """
    try:
        # Security check - users can only access their own profile, admins can access any
        if current_user.id != user_id and current_user.user_role not in ["ADMIN", "MANAGER"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Get all assessment responses for the user
        all_responses = db.query(AssessmentResponse).filter(
            AssessmentResponse.user_id == user_id
        ).all()
        
        if not all_responses:
            return {
                "success": False,
                "message": "No assessment data available for cognitive profile generation",
                "profile": None
            }
        
        # Group responses by assessment type
        responses_by_assessment = {}
        for response in all_responses:
            assessment_id = response.assessment_id
            if assessment_id not in responses_by_assessment:
                responses_by_assessment[assessment_id] = {}
            responses_by_assessment[assessment_id][response.question_id] = response.selected_answer
        
        # Generate comprehensive cognitive profile
        comprehensive_analysis = {}
        for assessment_id, responses in responses_by_assessment.items():
            analysis = assessment_analyzer.analyze_assessment_responses(
                responses=responses,
                assessment_type=assessment_id,
                user_context={"user_id": user_id}
            )
            comprehensive_analysis[assessment_id] = analysis
        
        return {
            "success": True,
            "user_id": user_id,
            "comprehensive_profile": comprehensive_analysis,
            "message": "Comprehensive cognitive profile generated successfully"
        }
        
    except Exception as e:
        logger.error(f"Cognitive profile generation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cognitive profile generation failed: {str(e)}"
        )