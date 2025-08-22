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
    api_key=os.getenv("AIML_API_KEY"),   # just the key
)

class AssessmentAnalyzer:
    """AI-powered assessment analyzer using AIML GPT models for cognitive profile analysis"""
    
    def __init__(self):
        self.model = "openai/gpt-5-chat-latest"  # AIML’s latest GPT model
        
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

            analysis_result = response.choices[0].message.content  # use .content
            analysis_result = json.loads(analysis_result)
            
            # Recursive sanitizer to drop empty-string keys produced by LLMs
            def _clean_empty_keys(obj):
                if isinstance(obj, dict):
                    return {k: _clean_empty_keys(v) for k, v in obj.items() if k != ""}
                if isinstance(obj, list):
                    return [_clean_empty_keys(x) for x in obj]
                return obj
            analysis_result = _clean_empty_keys(analysis_result)
            
            # Sanitize unexpected empty keys from model output
            if isinstance(analysis_result, dict) and "" in analysis_result:
                analysis_result.pop("", None)
            
            # Ensure required sections exist
            analysis_result.setdefault("cognitive_profile", {})
            analysis_result.setdefault("insights", {})
            analysis_result.setdefault("recommendations", {})
            recs = analysis_result["recommendations"]
            recs.setdefault("workplace_accommodations", [])
            recs.setdefault("career_suggestions", [])
            recs.setdefault("development_opportunities", [])
            
            # Map common aliases
            if "summary" not in analysis_result and "_summary" in analysis_result:
                analysis_result["summary"] = analysis_result.pop("_summary")
            if "confidence_score" not in analysis_result and "_score" in analysis_result:
                analysis_result["confidence_score"] = analysis_result.pop("_score")
            
            # Normalize confidence_score
            try:
                cs = float(analysis_result.get("confidence_score", 0.85))
                # clamp to [0,1] if it's a percentage or out of bounds
                if cs > 1.0:
                    cs = cs / 100.0 if cs <= 100 else 1.0
                if cs < 0:
                    cs = 0.0
                analysis_result["confidence_score"] = round(cs, 4)
            except Exception:
                analysis_result["confidence_score"] = 0.85
            
            # Ensure non-empty summary
            if not analysis_result.get("summary") or not str(analysis_result.get("summary")).strip():
                cp = analysis_result.get("cognitive_profile", {})
                strengths = ", ".join((cp.get("primary_strengths") or [])[:2]) or "clear strengths"
                prefs = ", ".join((cp.get("processing_preferences") or [])[:2]) or "supportive routines"
                wc = ", ".join((cp.get("optimal_work_conditions") or [])[:1]) or "well-structured, low-distraction settings"
                analysis_result["summary"] = (
                    f"This professional shows {strengths} and benefits from {prefs}. "
                    f"They thrive in {wc} and perform best with practical accommodations that reduce interruptions."
                )
            
            # If work_env_matchmaker, derive from parsed buckets when missing/too sparse
            if assessment_type == "work_env_matchmaker":
                wem = {}
                try:
                    raw = responses.get("wem_needs") if isinstance(responses, dict) else None
                    parsed = json.loads(raw) if isinstance(raw, str) else (raw or {})
                    wem = {
                        "must": [k for k, v in parsed.items() if v == "Must"],
                        "nice": [k for k, v in parsed.items() if v == "Nice-to-have"],
                        "avoid": [k for k, v in parsed.items() if v == "Avoid"],
                    }
                except Exception:
                    wem = {}
                # Backfill accommodations (ensure >=3)
                if len(recs["workplace_accommodations"]) < 3 and wem:
                    adds = []
                    all_items = (wem.get("must", []) or []) + (wem.get("nice", []) or [])
                    lowered = " ".join(all_items).lower()
                    if "noise" in lowered or "quiet" in lowered:
                        adds.append("Provide noise-cancelling headphones and quiet zones")
                    if "async" in lowered or "written" in lowered:
                        adds.append("Prefer async communication with written updates")
                    if any("flexible hours" in s.lower() or "flexible" in s.lower() for s in all_items):
                        adds.append("Offer flexible scheduling aligned with energy peaks")
                    if wem.get("avoid"):
                        adds.append("Minimize mandatory pair programming; offer solo focus blocks")
                    for a in adds:
                        if a not in recs["workplace_accommodations"]:
                            recs["workplace_accommodations"].append(a)
                    # Pad generically if still short
                    while len(recs["workplace_accommodations"]) < 3:
                        for cand in [
                            "Provide clear written agendas and task breakdowns",
                            "Offer predictable routines with protected focus time",
                            "Reduce frequent context switching via batch planning",
                        ]:
                            if cand not in recs["workplace_accommodations"]:
                                recs["workplace_accommodations"].append(cand)
                                break
                    recs["workplace_accommodations"] = recs["workplace_accommodations"][:5]
                # Backfill career suggestions
                if len(recs["career_suggestions"]) < 3 and wem:
                    suggestions = []
                    all_items = (wem.get("must", []) or []) + (wem.get("nice", []) or [])
                    avoid_items = (wem.get("avoid", []) or [])
                    if any("context switching" in s.lower() for s in avoid_items):
                        suggestions.append("Data analyst — deep focus, low context switching")
                        suggestions.append("Technical writer — favors structured, async communication")
                    if any("pair programming" in s.lower() for s in avoid_items):
                        suggestions.append("Individual-contributor software engineer — supports autonomy and focus")
                    if any("flexible" in s.lower() for s in all_items):
                        suggestions.append("Research engineer — flexible hours for deep work")
                    # add rationales inline if missing
                    cleaned = []
                    for s in suggestions:
                        if "—" not in s:
                            cleaned.append(f"{s} — aligns with stated work preferences")
                        else:
                            cleaned.append(s)
                    for s in cleaned:
                        if s not in recs["career_suggestions"]:
                            recs["career_suggestions"].append(s)
                    # Pad generically if still short
                    while len(recs["career_suggestions"]) < 3:
                        for cand in [
                            "QA engineer — structured scenarios and repeatable processes",
                            "Information architect — clarity, organization, and documentation",
                            "Business intelligence analyst — pattern recognition with low interruptions",
                        ]:
                            if cand not in recs["career_suggestions"]:
                                recs["career_suggestions"].append(cand)
                                break
                    recs["career_suggestions"] = recs["career_suggestions"][:6]
            
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
        
        # Work Environment Matchmaker special handling: parse bucketed needs
        wem_context = {}
        if assessment_type == "work_env_matchmaker":
            try:
                raw = responses.get("wem_needs") if isinstance(responses, dict) else None
                parsed = json.loads(raw) if isinstance(raw, str) else (raw or {})
                must = [k for k, v in parsed.items() if v == "Must"]
                nice = [k for k, v in parsed.items() if v == "Nice-to-have"]
                avoid = [k for k, v in parsed.items() if v == "Avoid"]
                wem_context = {
                    "work_env_matchmaker": {
                        "must": must,
                        "nice_to_have": nice,
                        "avoid": avoid,
                        "item_to_bucket": parsed,
                    }
                }
            except Exception:
                # If parsing fails, continue with raw responses
                wem_context = {"work_env_matchmaker": {"parse_status": "failed", "raw": responses.get("wem_needs")}}

        prompt = f"""
        Please analyze the following {assessment_type.replace('_', ' ')} assessment responses for a neurodivergent professional.
        
        Assessment Responses:
        {json.dumps(responses, indent=2)}
        
        Derived Context (if available):
        {json.dumps(wem_context, indent=2)}
        
        User Context:
        {json.dumps(user_context or {}, indent=2)}
        
        Provide a comprehensive analysis in JSON format with the following structure.
        IMPORTANT REQUIREMENTS:
        - Always include a non-empty 2-3 sentence "summary".
        - Always include at least 3 "workplace_accommodations" tailored to the inputs.
        - Always include at least 3 "career_suggestions" with short rationales.
        - Do not output placeholders like "No suggestions available".
        - Be strengths-based and practical.
        
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
                "workplace_accommodations": ["accommodation1", "accommodation2", "accommodation3"],
                "career_suggestions": [
                  "Role A — rationale",
                  "Role B — rationale",
                  "Role C — rationale"
                ],
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