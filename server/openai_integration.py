#!/usr/bin/env python3
"""
OpenAI Integration for BrainBridge Assessment Analysis
Enhanced AI-powered assessment analysis and personalized recommendations
"""

from openai import OpenAI
import os
import json
from typing import Dict, Any, Optional
from datetime import datetime

# Initialize AIML client
client = OpenAI(
    base_url="https://api.aimlapi.com/v1",
    api_key=os.getenv("AIML_API_KEY"),   # ✅ just the key
)

class AssessmentAnalyzer:
    """AI-powered assessment analyzer using AIML GPT models for cognitive profile analysis"""
    
    def __init__(self):
        self.model = "openai/gpt-5-chat-latest"  # ✅ AIML’s latest GPT model
        
    def analyze_assessment_responses(
        self, 
        responses: Dict[str, str], 
        assessment_type: str,
        user_context: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Analyze assessment responses and generate insights
        """
        
        analysis_prompt = self._create_analysis_prompt(responses, assessment_type, user_context)
        
        try:
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": """You are an expert neurodiversity consultant and cognitive assessment specialist. 
                        Your role is to analyze assessment responses from neurodivergent professionals and provide 
                        insightful, respectful, and actionable cognitive profile analysis. Focus on strengths, 
                        preferences, and workplace accommodations rather than deficits. Respond in JSON format."""
                    },
                    {
                        "role": "user", 
                        "content": analysis_prompt
                    }
                ],
                temperature=0.7,
                top_p=0.7,
                frequency_penalty=1,
                max_tokens=2000,
                response_format={"type": "json_object"},
            )
            
            print("RAW MODEL OUTPUT:", response.choices[0].message)

            analysis_result = response.choices[0].message.content  # ✅ use .content
            analysis_result = json.loads(analysis_result)
            
            # Add metadata
            analysis_result["analysis_timestamp"] = datetime.utcnow().isoformat()
            analysis_result["model_used"] = self.model
            analysis_result["assessment_type"] = assessment_type
            
            return analysis_result
            
        except Exception as e:
            print(f"AIML analysis error: {str(e)}")
            return self._fallback_analysis(responses, assessment_type)
    
    def _create_analysis_prompt(
        self, 
        responses: Dict[str, str], 
        assessment_type: str,
        user_context: Optional[Dict] = None
    ) -> str:
        """Create a detailed prompt for GPT analysis"""
        
        prompt = f"""
        Please analyze the following {assessment_type.replace('_', ' ')} assessment responses for a neurodivergent professional.
        
        Assessment Responses:
        {json.dumps(responses, indent=2)}
        
        User Context:
        {json.dumps(user_context or {}, indent=2)}
        
        Provide a comprehensive analysis in JSON format with the following structure:
        {{
            "cognitive_profile": {{
                "primary_strengths": ["strength1", "strength2", "strength3"],
                "processing_preferences": ["preference1", "preference2"],
                "optimal_work_conditions": ["condition1", "condition2"]
            }},
            "insights": {{
                "pattern_analysis": "Key patterns identified in responses",
                "unique_qualities": "What makes this individual's cognitive style unique",
                "potential_challenges": "Areas that might need support (framed positively)"
            }},
            "recommendations": {{
                "workplace_accommodations": ["accommodation1", "accommodation2"],
                "career_suggestions": ["suggestion1", "suggestion2"],
                "development_opportunities": ["opportunity1", "opportunity2"]
            }},
            "confidence_score": 0.85,
            "summary": "A personalized 2-3 sentence summary of their cognitive profile"
        }}
        """
        
        return prompt
    
    def _fallback_analysis(self, responses: Dict[str, str], assessment_type: str) -> Dict[str, Any]:
        """Fallback analysis if AIML API is unavailable"""
        return {
            "cognitive_profile": {
                "primary_strengths": ["Detailed analysis pending", "System processing responses"],
                "processing_preferences": ["Analysis in progress"],
                "optimal_work_conditions": ["Comprehensive report generating"]
            },
            "insights": {
                "pattern_analysis": "Assessment responses recorded successfully. Detailed analysis will be available shortly.",
                "unique_qualities": "Individual cognitive profile being processed",
                "potential_challenges": "Supportive recommendations being generated"
            },
            "recommendations": {
                "workplace_accommodations": ["Custom recommendations pending"],
                "career_suggestions": ["Personalized suggestions being prepared"],
                "development_opportunities": ["Tailored opportunities being identified"]
            },
            "confidence_score": 0.0,
            "summary": "Assessment completed successfully. Detailed AI analysis will be available shortly.",
            "status": "fallback_mode",
            "assessment_type": assessment_type
        }

    async def generate_job_matching_insights(
        self, 
        assessment_results: Dict[str, Any], 
        job_description: str
    ) -> Dict[str, Any]:
        """
        Generate job matching insights based on assessment results and job description
        
        Args:
            assessment_results: Results from cognitive assessment analysis
            job_description: Job posting description to match against
            
        Returns:
            Matching insights and recommendations
        """
        
        matching_prompt = f"""
        Based on the following cognitive assessment results, analyze how well this individual 
        would fit the given job description and provide matching insights.
        
        Assessment Results:
        {json.dumps(assessment_results, indent=2)}
        
        Job Description:
        {job_description}
        
        Provide analysis in JSON format:
        {{
            "match_score": 0.85,
            "alignment_strengths": ["strength1", "strength2"],
            "potential_challenges": ["challenge1", "challenge2"],
            "recommended_accommodations": ["accommodation1", "accommodation2"],
            "interview_talking_points": ["point1", "point2"],
            "questions_to_ask_employer": ["question1", "question2"],
            "overall_recommendation": "detailed recommendation"
        }}
        """
        
        try:
            response = await client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert job matching consultant specializing in neurodivergent professionals. Provide insightful job fit analysis."
                    },
                    {
                        "role": "user",
                        "content": matching_prompt
                    }
                ],
                response_format={"type": "json_object"},
                temperature=0.6
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            print(f"Job matching analysis error: {str(e)}")
            return {
                "match_score": 0.5,
                "alignment_strengths": ["Analysis pending"],
                "potential_challenges": ["Assessment in progress"],
                "recommended_accommodations": ["Custom recommendations being generated"],
                "interview_talking_points": ["Personalized talking points being prepared"],
                "questions_to_ask_employer": ["Relevant questions being curated"],
                "overall_recommendation": "Detailed job matching analysis will be available shortly."
            }

# Global analyzer instance
assessment_analyzer = AssessmentAnalyzer()