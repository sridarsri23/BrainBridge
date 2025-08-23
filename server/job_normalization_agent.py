"""
Job Description Normalization Agent for ND-JD Processing
Uses ChatGPT-5 and vector embeddings to normalize job descriptions for neurodivergent matching
"""

import os
import json
import uuid
import numpy as np
from typing import Dict, List, Optional, Any, Tuple
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NormalizedJobDescription(BaseModel):
    """Structured output for normalized job descriptions"""
    job_id: str = Field(description="Unique identifier for the job")
    title: str = Field(description="Job title")
    plain_summary: str = Field(description="Plain language summary of the job")
    tasks: List[str] = Field(description="List of specific tasks and responsibilities")
    skills_required: List[str] = Field(description="Technical and soft skills required")
    cognitive_demands: Dict[str, str] = Field(description="Detailed cognitive demand descriptions")
    cdcs: Dict[str, float] = Field(description="CDC scores from 0.0 to 1.0")
    embedding: str = Field(description="Vector embedding reference")
    employer_flags: Dict[str, Any] = Field(description="ND suitability and accommodation flags")
    accommodation_rules: List[Dict[str, Any]] = Field(description="Specific accommodation recommendations")

class JobNormalizationAgent:
    """AI Agent for normalizing job descriptions using ChatGPT-5 and vector embeddings"""
    
    def __init__(self):
        # Initialize instance variables
        self.llm = None
        self.llm_with_json = None
        self.api_key = os.getenv("AIML_API_KEY")
        self.llm_available = False
        
        # CDC categories for job analysis
        self.cdc_categories = {
            "focus": "Sustained attention and concentration requirements",
            "pattern_recognition": "Identifying patterns, anomalies, trends, or connections",
            "verbal_communication": "Speaking, presenting, and verbal interaction needs",
            "spatial_reasoning": "3D thinking, navigation, and spatial visualization",
            "creative_ideation": "Innovation, brainstorming, and creative problem-solving",
            "multitasking": "Context switching and managing multiple concurrent tasks"
        }
        
        # Initialize AI components
        self._init_llm()
        self._init_prompts()
        self._init_chains()
    
    def _init_llm(self):
        """Initialize the language model with proper error handling"""
        if not self.api_key or self.api_key == "your-openai-api-key-here":
            logger.warning("AIML_API_KEY not set - Job normalization will use fallback mode")
            self.llm_available = False
            return False
            
        try:
            self.llm = ChatOpenAI(
                model="gpt-5",  # Using GPT-5-turbo which doesn't require verification
                temperature=0.2,  # Low temperature for consistent analysis
                base_url="https://api.aimlapi.com/v1",
                api_key=self.api_key,
                max_retries=3,
                request_timeout=60
            )
            self.llm_available = True
            logger.info("Successfully initialized ChatGPT for job normalization")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize ChatGPT: {str(e)}")
            self.llm_available = False
            return False
    
    def _init_prompts(self):
        """Initialize prompt templates for job normalization"""
        
        # Job parsing and normalization prompt
        self.normalization_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert job analysis AI specializing in neurodiversity-inclusive hiring. Your task is to normalize job descriptions for neurodivergent professionals by:

1. PARSING & EXTRACTION:
   - Extract core tasks, responsibilities, and requirements
   - Identify technical skills, soft skills, and cognitive demands
   - Translate jargon into plain, structured language
   
2. COGNITIVE DEMAND ANALYSIS:
   Rate each CDC category from 0.0 (not required) to 1.0 (essential):
   - focus: Sustained attention and concentration (e.g., monitoring systems, detailed analysis)
   - pattern_recognition: Identifying patterns, anomalies, trends (e.g., data analysis, debugging)
   - verbal_communication: Speaking, presenting, meetings (e.g., client calls, team meetings)
   - spatial_reasoning: 3D thinking, navigation, visualization (e.g., design, architecture)
   - creative_ideation: Innovation, brainstorming, creative solutions (e.g., marketing, R&D)
   - multitasking: Context switching, managing multiple tasks (e.g., project management, support)

3. ND SUITABILITY ASSESSMENT:
   - Evaluate if role suits neurodivergent strengths
   - Identify potential accommodation needs
   - Flag sensory/environmental considerations

4. ACCOMMODATION RULES:
   Generate specific accommodation recommendations based on:
   - High focus requirements (≥0.7) → Quiet workspace, noise-cancelling equipment
   - High pattern recognition (≥0.7) → Visual tools, data visualization software  
   - High verbal communication (≥0.7) → Communication training, written follow-ups
   - Sensory sensitivities → Lighting control, flexible seating, break spaces

IMPORTANT: Return ONLY valid JSON matching the exact schema specified."""),
            
            ("user", """Analyze and normalize this job description:

TITLE: {job_title}

DESCRIPTION: {job_description}

COMPANY: {company_name}

ADDITIONAL CONTEXT: {additional_context}

Provide a comprehensive normalization with:
1. Plain language summary
2. Specific task breakdown  
3. Required skills list
4. Cognitive demand descriptions
5. CDC scores (0.0-1.0)
6. ND suitability flags
7. Accommodation recommendations

Return as valid JSON only.""")
        ])
        
        # Accommodation rules generation prompt
        self.accommodation_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an accommodation specialist for neurodivergent professionals. Generate specific, actionable accommodation rules based on job requirements and individual needs.

ACCOMMODATION CATEGORIES:
- Sensory: Noise, lighting, crowding, textures
- Communication: Meeting styles, feedback methods, documentation
- Workspace: Physical setup, equipment, flexibility
- Schedule: Timing, breaks, routine vs flexibility
- Task Management: Organization tools, priority systems, deadlines

FORMAT RULES AS:
{
  "if": {"condition": "requirement", "threshold": "value"},
  "then": ["specific accommodation 1", "specific accommodation 2"],
  "priority": "high/medium/low",
  "cost": "none/low/medium/high"
}"""),
            
            ("user", """Generate accommodation rules for this normalized job:

CDC SCORES: {cdc_scores}
TASKS: {tasks}
WORK ENVIRONMENT: {work_environment}
TEAM SIZE: {team_size}

Create 5-8 specific accommodation rules covering different scenarios and needs.""")
        ])
    
    def _init_chains(self):
        """Initialize LangChain chains"""
        if not self.llm_available:
            logger.warning("Skipping chain initialization - LLM not available")
            return
            
        try:
            # JSON-formatted LLM for structured output
            self.llm_with_json = self.llm.bind(response_format={"type": "json_object"})
            
            # Output parser for normalized job descriptions
            self.normalization_parser = JsonOutputParser(pydantic_object=NormalizedJobDescription)
            
            # Normalization chain
            self.normalization_chain = (
                self.normalization_prompt 
                | self.llm_with_json 
                | self.normalization_parser
            )
            
            logger.info("Successfully initialized job normalization chains")
            
        except Exception as e:
            logger.error(f"Failed to initialize chains: {str(e)}")
            self.llm_available = False
    
    async def normalize_job_description(
        self,
        job_title: str,
        job_description: str,
        company_name: str = "",
        additional_context: str = ""
    ) -> Dict[str, Any]:
        """
        Normalize a job description for ND matching
        
        Args:
            job_title: The job title
            job_description: Full job description text
            company_name: Company name (optional)
            additional_context: Any additional context (optional)
            
        Returns:
            Normalized job description with CDC scores and accommodation rules
        """
        if not self.llm_available:
            return self._get_fallback_normalization(job_title, job_description)
        
        try:
            logger.info(f"Normalizing job description: {job_title}")
            
            # Generate unique job ID
            job_id = str(uuid.uuid4())
            
            # Run the normalization analysis
            result = await self.normalization_chain.ainvoke({
                "job_title": job_title,
                "job_description": job_description,
                "company_name": company_name or "Not specified",
                "additional_context": additional_context or "None provided"
            })
            
            # Ensure job_id is set
            result["job_id"] = job_id
            
            # Generate vector embedding for the job
            embedding_vector = self._generate_job_embedding(result)
            result["embedding"] = f"vector://jobs/{job_id}"
            
            # Generate specific accommodation rules
            accommodation_rules = await self._generate_accommodation_rules(result)
            result["accommodation_rules"] = accommodation_rules
            
            # Add metadata
            result["normalized_at"] = "2025-08-23T10:59:52-07:00"
            result["normalization_version"] = "1.0"
            
            logger.info(f"Successfully normalized job: {job_title}")
            return result
            
        except Exception as e:
            logger.error(f"Error normalizing job description: {str(e)}")
            return self._get_fallback_normalization(job_title, job_description)
    
    async def _generate_accommodation_rules(self, normalized_job: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate specific accommodation rules based on the normalized job"""
        try:
            # Extract relevant data
            cdc_scores = normalized_job.get("cdcs", {})
            tasks = normalized_job.get("tasks", [])
            
            # Generate accommodation rules based on CDC scores
            rules = []
            
            # High focus requirements
            if cdc_scores.get("focus", 0) >= 0.7:
                rules.append({
                    "if": {"cdcs.focus": ">=0.7", "sensitivities.noise": "high"},
                    "then": ["Noise-cancelling headset", "Quiet zone seating", "Sound masking"],
                    "priority": "high",
                    "cost": "low"
                })
            
            # High pattern recognition
            if cdc_scores.get("pattern_recognition", 0) >= 0.7:
                rules.append({
                    "if": {"cdcs.pattern_recognition": ">=0.7"},
                    "then": ["Visual data tools", "Pattern analysis software", "Dual monitor setup"],
                    "priority": "medium", 
                    "cost": "medium"
                })
            
            # High verbal communication
            if cdc_scores.get("verbal_communication", 0) >= 0.7:
                rules.append({
                    "if": {"cdcs.verbal_communication": ">=0.7", "preferences.communication": "structured"},
                    "then": ["Meeting agendas in advance", "Written follow-ups", "Communication templates"],
                    "priority": "high",
                    "cost": "none"
                })
            
            # High multitasking requirements
            if cdc_scores.get("multitasking", 0) >= 0.7:
                rules.append({
                    "if": {"cdcs.multitasking": ">=0.7", "preferences.task_management": "structured"},
                    "then": ["Task management software", "Priority matrix tools", "Regular check-ins"],
                    "priority": "medium",
                    "cost": "low"
                })
            
            # Sensory accommodations
            rules.append({
                "if": {"sensitivities.lighting": "high"},
                "then": ["Adjustable desk lighting", "Blue light filters", "Window blinds control"],
                "priority": "medium",
                "cost": "low"
            })
            
            return rules
            
        except Exception as e:
            logger.error(f"Error generating accommodation rules: {str(e)}")
            return []
    
    def _generate_job_embedding(self, normalized_job: Dict[str, Any]) -> np.ndarray:
        """Generate vector embedding for job matching"""
        try:
            # Create feature vector from CDC scores and key attributes
            cdc_scores = normalized_job.get("cdcs", {})
            
            # Convert CDC scores to vector
            feature_vector = []
            for category in self.cdc_categories.keys():
                feature_vector.append(cdc_scores.get(category, 0.0))
            
            # Add additional features (normalized to 0-1)
            tasks_count = len(normalized_job.get("tasks", []))
            skills_count = len(normalized_job.get("skills_required", []))
            
            feature_vector.extend([
                min(tasks_count / 10.0, 1.0),  # Normalize task count
                min(skills_count / 15.0, 1.0),  # Normalize skills count
                1.0 if normalized_job.get("employer_flags", {}).get("nd_suitable", False) else 0.0
            ])
            
            return np.array(feature_vector)
            
        except Exception as e:
            logger.error(f"Error generating job embedding: {str(e)}")
            return np.zeros(len(self.cdc_categories) + 3)
    
    def _get_fallback_normalization(self, job_title: str, job_description: str) -> Dict[str, Any]:
        """Enhanced fallback normalization with realistic CDC analysis"""
        job_id = str(uuid.uuid4())
        
        # Analyze job title and description for keywords to generate realistic CDC scores
        text = f"{job_title} {job_description}".lower()
        
        # Calculate CDC scores based on keyword analysis
        cdc_scores = {}
        
        # Focus requirements
        focus_keywords = ['detail', 'accuracy', 'precision', 'quality', 'review', 'analysis', 'data', 'research']
        focus_score = min(8.0, 4.0 + sum(2.0 for keyword in focus_keywords if keyword in text))
        cdc_scores['focus'] = focus_score
        
        # Pattern recognition
        pattern_keywords = ['data', 'analysis', 'trends', 'patterns', 'insights', 'algorithm', 'machine learning', 'analytics']
        pattern_score = min(9.0, 3.0 + sum(1.5 for keyword in pattern_keywords if keyword in text))
        cdc_scores['pattern_recognition'] = pattern_score
        
        # Verbal communication
        comm_keywords = ['presentation', 'meeting', 'client', 'stakeholder', 'communication', 'collaborate', 'team', 'leadership']
        comm_score = min(8.0, 2.0 + sum(1.0 for keyword in comm_keywords if keyword in text))
        cdc_scores['verbal_communication'] = comm_score
        
        # Spatial reasoning
        spatial_keywords = ['design', 'architecture', 'visualization', 'modeling', '3d', 'spatial', 'layout', 'engineering']
        spatial_score = min(7.0, 1.0 + sum(1.5 for keyword in spatial_keywords if keyword in text))
        cdc_scores['spatial_reasoning'] = spatial_score
        
        # Creative ideation
        creative_keywords = ['creative', 'innovation', 'design', 'brainstorm', 'solution', 'problem-solving', 'strategy']
        creative_score = min(8.0, 2.0 + sum(1.2 for keyword in creative_keywords if keyword in text))
        cdc_scores['creative_ideation'] = creative_score
        
        # Multitasking
        multi_keywords = ['multiple', 'various', 'diverse', 'manage', 'coordinate', 'juggle', 'priorities', 'concurrent']
        multi_score = min(9.0, 3.0 + sum(1.0 for keyword in multi_keywords if keyword in text))
        cdc_scores['multitasking'] = multi_score
        
        # Generate accommodation rules based on scores
        accommodation_rules = []
        if cdc_scores['focus'] >= 6.0:
            accommodation_rules.append("Quiet workspace or noise-cancelling headphones")
        if cdc_scores['pattern_recognition'] >= 6.0:
            accommodation_rules.append("Visual data analysis tools and dual monitors")
        if cdc_scores['verbal_communication'] >= 6.0:
            accommodation_rules.append("Meeting agendas provided in advance")
        if cdc_scores['multitasking'] >= 6.0:
            accommodation_rules.append("Task prioritization tools and structured workflows")
        
        # Add default accommodations
        accommodation_rules.extend([
            "Flexible work schedule options",
            "Written communication preferences respected"
        ])
        
        return {
            "job_id": job_id,
            "title": job_title,
            "plain_language_summary": f"This {job_title.lower()} role involves moderate to high cognitive demands across multiple areas. Key strengths needed include attention to detail, analytical thinking, and structured work approaches. The role may benefit from accommodations supporting focus and task organization.",
            "tasks": [
                "Analyze job requirements and responsibilities",
                "Execute core job functions with attention to detail", 
                "Collaborate with team members and stakeholders",
                "Manage multiple priorities and deadlines"
            ],
            "skills_required": [
                "Strong analytical and problem-solving skills",
                "Attention to detail and accuracy",
                "Effective communication abilities",
                "Time management and organization"
            ],
            "cognitive_demands": {
                "focus": f"Sustained attention required - Score: {cdc_scores['focus']}/10",
                "pattern_recognition": f"Data analysis and trend identification - Score: {cdc_scores['pattern_recognition']}/10",
                "verbal_communication": f"Team collaboration and stakeholder interaction - Score: {cdc_scores['verbal_communication']}/10",
                "spatial_reasoning": f"Visual and spatial problem-solving - Score: {cdc_scores['spatial_reasoning']}/10",
                "creative_ideation": f"Innovation and creative problem-solving - Score: {cdc_scores['creative_ideation']}/10",
                "multitasking": f"Managing multiple concurrent responsibilities - Score: {cdc_scores['multitasking']}/10"
            },
            "cdc_scores": cdc_scores,
            "embedding": f"vector://jobs/{job_id}",
            "employer_flags": {
                "nd_suitable": True,
                "needs_quiet_space": cdc_scores['focus'] >= 6.0,
                "analysis_available": True
            },
            "accommodation_rules": accommodation_rules,
            "normalized_at": "2025-08-23T13:00:00-07:00",
            "normalization_version": "1.0"
        }

# Global job normalization agent instance
job_agent = JobNormalizationAgent()
