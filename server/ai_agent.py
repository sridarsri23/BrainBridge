"""
LangChain-powered Self-Discovery Agent for ND Cognitive Assessment
"""

import os
import json
import numpy as np
from typing import Dict, List, Optional, Any
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CognitiveAssessmentResult(BaseModel):
    """Structured output for cognitive assessment analysis"""
    strengths: Dict[str, float] = Field(description="CDC strengths rated 0.0-1.0")
    sensitivities: Dict[str, str] = Field(description="Sensory sensitivities (low/medium/high)")
    preferences: Dict[str, str] = Field(description="Work and environment preferences")
    confidence_factors: Dict[str, float] = Field(description="Confidence in each assessment")
    analysis_summary: str = Field(description="Human-readable analysis of the profile")
    recommendations: List[str] = Field(description="Actionable recommendations for the individual")

class GeneratedQuiz(BaseModel):
    """Structured output for AI-generated quizzes and games"""
    quiz_id: str = Field(description="Unique identifier for the quiz")
    title: str = Field(description="Engaging title for the quiz/game")
    description: str = Field(description="Brief description of the activity")
    activity_type: str = Field(description="Type: quiz, game, scenario, puzzle, etc.")
    estimated_time: int = Field(description="Estimated completion time in minutes")
    questions: List[Dict[str, Any]] = Field(description="List of engaging questions/challenges")
    cdc_mapping: Dict[str, List[str]] = Field(description="Maps questions to CDC categories they assess")

class SelfDiscoveryAgent:
    """AI Agent for analyzing ND cognitive profiles using LangChain and GPT"""
    
    def _init_cdcs(self):
        """Initialize CDC categories and related configurations"""
        self.core_cdcs = [
            "focus_sustained_attention",
            "pattern_recognition", 
            "verbal_communication",
            "spatial_reasoning",
            "creative_ideation",
            "multitasking_context_switching"
        ]
        
        self.additional_cdcs = [
            "processing_speed",
            "executive_function", 
            "fine_motor_input",
            "sensory_processing",
            "communication_interpretation",
            "attention_filtering"
        ]
    
    def _init_prompts(self):
        """Initialize prompt templates and output parsers"""
        # Quiz generation prompt
        self.quiz_generation_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a creative assessment designer specializing in neurodiversity-friendly evaluations. Your task is to create engaging quizzes, games, scenarios, and interactive challenges that naturally assess Cognitive Demand Categories (CDCs) WITHOUT directly asking assessment questions.

CREATE ACTIVITIES THAT:
- Feel like fun quizzes, games, or interesting scenarios rather than clinical assessments
- Naturally reveal cognitive preferences through choices and responses
- Use creative scenarios, hypothetical situations, or preference-based questions
- Avoid obvious assessment language like "How well do you..." or "Rate your ability..."
- Include varied formats: scenarios, preferences, problem-solving, creative challenges"""),
            ("user", "Create an engaging {activity_type} that assesses cognitive strengths for neurodivergent professionals. Focus on {target_cdcs} categories. Make it feel like a fun, interesting activity rather than a clinical assessment. Title: {title_theme}\n\nIMPORTANT: Return ONLY valid JSON in the exact format specified, no markdown or extra text.")
        ])
        
        # Assessment prompt
        self.assessment_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert neurodiversity assessment specialist. Analyze the provided data to create a comprehensive cognitive profile for a neurodivergent professional.

Your task is to assess Cognitive Demand Categories (CDCs) based on:
1. Quiz responses and self-assessment data
2. Behavioral observations (if available) 
3. Past work/academic history (if available)

Rate each CDC strength from 0.0 (significant challenge) to 1.0 (exceptional strength):"""),
            ("user", """Please analyze this neurodivergent professional's data:

QUIZ RESULTS: {quiz_results}

BEHAVIORAL DATA: {behavior_data}

PAST WORK/ACADEMIC DATA: {past_data}

Create a comprehensive cognitive profile with:
1. Strength ratings for all CDCs (0.0-1.0)
2. Sensitivities (noise, lighting, crowding, etc.)
3. Work preferences (remote, routine, independence, etc.)
4. Confidence levels for each assessment
5. Summary analysis explaining the profile
6. Actionable recommendations for career development

Return as valid JSON only.""")
        ])
        
        # Initialize output parsers
        self.assessment_output_parser = JsonOutputParser(pydantic_object=CognitiveAssessmentResult)
        self.quiz_output_parser = JsonOutputParser(pydantic_object=GeneratedQuiz)
        
        # Initialize chains (will be set up in _init_chains if LLM is available)
        self.assessment_chain = None
        self.quiz_generation_chain = None
    
    def _init_chains(self):
        """Initialize LangChain chains only if LLM is available"""
        if not self.llm_available or not self.llm:
            logger.warning("Skipping chain initialization - LLM not available")
            self.assessment_chain = None
            self.quiz_generation_chain = None
            return
            
        try:
            # Initialize LLM with JSON response format
            self.llm_with_json = self.llm.bind(response_format={"type": "json_object"})
            
            # Initialize assessment chain
            if self.assessment_prompt and self.llm and self.assessment_output_parser:
                self.assessment_chain = (
                    self.assessment_prompt 
                    | self.llm 
                    | self.assessment_output_parser
                )
            
            # Initialize quiz generation chain
            if self.quiz_generation_prompt and self.llm_with_json and self.quiz_output_parser:
                self.quiz_generation_chain = (
                    self.quiz_generation_prompt 
                    | self.llm_with_json 
                    | self.quiz_output_parser
                )
            
            if self.assessment_chain or self.quiz_generation_chain:
                logger.info("Successfully initialized LangChain chains")
            else:
                logger.warning("Failed to initialize any chains - missing required components")
                self.llm_available = False
                
        except Exception as e:
            logger.error(f"Failed to initialize LangChain chains: {str(e)}", exc_info=True)
            self.llm_available = False
            self.assessment_chain = None
            self.quiz_generation_chain = None
    
    def __init__(self):
        # Initialize instance variables
        self.llm = None
        self.llm_with_json = None
        self.api_key = os.getenv("AIML_API_KEY")
        self.llm_available = False
        self.assessment_chain = None
        self.quiz_generation_chain = None
        
        # Initialize core components
        self._init_cdcs()
        self._init_prompts()
        
        # Try to initialize LLM if API key is available
        self._init_llm()
        
        # Initialize chains after LLM is set up
        if hasattr(self, '_init_chains'):
            self._init_chains()
        
    def _init_llm(self):
        """Initialize the language model with proper error handling"""
        if not self.api_key or self.api_key == "your-openai-api-key-here":
            logger.warning("AIML_API_KEY not set or using default value - AI features will be limited")
            self.llm_available = False
            return False
            
        try:
            self.llm = ChatOpenAI(
                model="gpt-5",
                temperature=0.3,
                base_url="https://api.aimlapi.com/v1",
                api_key=self.api_key,
                max_retries=3,
                request_timeout=30
            )
            self.llm_available = True
            logger.info("Successfully initialized OpenAI client")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI client: {str(e)}", exc_info=True)
            print("Error: Failed to initialize AI features. Falling back to limited functionality mode.")
            self.llm_available = False
            return False
        
        # Set up quiz generation prompt
        self.quiz_generation_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a creative assessment designer specializing in neurodiversity-friendly evaluations. Your task is to create engaging quizzes, games, scenarios, and interactive challenges that naturally assess Cognitive Demand Categories (CDCs) WITHOUT directly asking assessment questions.

CREATE ACTIVITIES THAT:
- Feel like fun quizzes, games, or interesting scenarios rather than clinical assessments
- Naturally reveal cognitive preferences through choices and responses
- Use creative scenarios, hypothetical situations, or preference-based questions
- Avoid obvious assessment language like "How well do you..." or "Rate your ability..."
- Include varied formats: scenarios, preferences, problem-solving, creative challenges

CDC CATEGORIES TO ASSESS INDIRECTLY:
- focus_sustained_attention: Through activities requiring sustained engagement
- pattern_recognition: Via puzzles, visual challenges, or trend identification
- verbal_communication: Through scenario responses and communication preferences
- spatial_reasoning: Via spatial puzzles, navigation, or visualization tasks
- creative_ideation: Through creative problem-solving and idea generation
- multitasking_context_switching: Via workflow preferences and scenario handling
- processing_speed: Through timed preferences and quick-thinking scenarios
- executive_function: Via planning scenarios and organizational preferences
- fine_motor_input: Through interface and tool preferences
- sensory_processing: Via environment and sensory preference questions
- communication_interpretation: Through interpretation and meaning scenarios
- attention_filtering: Via focus and distraction management scenarios

EXAMPLE APPROACHES:
- "Choose your ideal workspace setup" (assesses sensory_processing, attention_filtering)
- "Solve this visual puzzle" (assesses pattern_recognition, spatial_reasoning)
- "Plan a project scenario" (assesses executive_function, multitasking)
- "What would you do in this situation?" (various CDCs based on scenario)

Return a complete quiz with 8-12 engaging questions that feel natural and fun."""),
            ("user", "Create an engaging {activity_type} that assesses cognitive strengths for neurodivergent professionals. Focus on {target_cdcs} categories. Make it feel like a fun, interesting activity rather than a clinical assessment. Title: {title_theme}\n\nIMPORTANT: Return ONLY valid JSON in the exact format specified, no markdown or extra text.")
        ])
        
        # Set up the assessment prompt
        self.assessment_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert neurodiversity assessment specialist. Analyze the provided data to create a comprehensive cognitive profile for a neurodivergent professional.

Your task is to assess Cognitive Demand Categories (CDCs) based on:
1. Quiz responses and self-assessment data
2. Behavioral observations (if available) 
3. Past work/academic history (if available)

Rate each CDC strength from 0.0 (significant challenge) to 1.0 (exceptional strength):

CORE CDCs:
- focus_sustained_attention: Ability to maintain focus on tasks over time
- pattern_recognition: Identifying patterns, anomalies, or connections
- verbal_communication: Effectiveness in verbal interactions
- spatial_reasoning: Handling spatial tasks and visualization
- creative_ideation: Generating novel ideas and solutions
- multitasking_context_switching: Managing multiple tasks and transitions

ADDITIONAL CDCs:
- processing_speed: Speed of interpretation and decision-making
- executive_function: Planning, organizing, and adapting
- fine_motor_input: Physical input methods (typing, writing)
- sensory_processing: Managing visual, auditory, sensory elements
- communication_interpretation: Understanding literal vs nuanced language
- attention_filtering: Sustaining attention while filtering distractions

For sensitivities, rate as: "low", "medium", or "high"
For preferences, use descriptive terms like: "preferred", "avoided", "flexible"

Provide evidence-based analysis with confidence ratings."""),
            ("user", """Please analyze this neurodivergent professional's data:

QUIZ RESULTS: {quiz_results}

BEHAVIORAL DATA: {behavior_data}

PAST WORK/ACADEMIC DATA: {past_data}

Create a comprehensive cognitive profile with:
1. Strength ratings for all CDCs (0.0-1.0)
2. Sensitivities (noise, lighting, crowding, etc.)
3. Work preferences (remote, routine, independence, etc.)
4. Confidence levels for each assessment
5. Summary analysis explaining the profile
6. Actionable recommendations for career development

Return as valid JSON only.""")
        ])
        
        # Set up JSON output parsers
        self.assessment_output_parser = JsonOutputParser(pydantic_object=CognitiveAssessmentResult)
        self.quiz_output_parser = JsonOutputParser(pydantic_object=GeneratedQuiz)
        
        # Initialize LangChain chains only if LLM is available
        self._init_chains()
        
    async def analyze_cognitive_profile(
        self,
        user_id: str,
        quiz_results: Dict[str, Any],
        behavior_data: Optional[Dict[str, Any]] = None,
        past_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Analyze user data to generate cognitive profile
        
        Args:
            user_id: Unique identifier for the user
            quiz_results: Results from cognitive assessment quizzes
            behavior_data: Behavioral observations (reaction time, attention tracking, etc.)
            past_data: Work history, academic performance data
            
        Returns:
            Comprehensive cognitive profile with CDC ratings and recommendations
        """
        try:
            logger.info(f"Analyzing cognitive profile for user {user_id}")
            
            # Prepare data for analysis
            behavior_data = behavior_data or {}
            past_data = past_data or {}
            
            # Run the LangChain analysis
            result = await self.assessment_chain.ainvoke({
                "quiz_results": json.dumps(quiz_results, indent=2),
                "behavior_data": json.dumps(behavior_data, indent=2), 
                "past_data": json.dumps(past_data, indent=2)
            })
            
            # Generate vector embedding for similarity matching
            embedding_vector = self._generate_embedding(result["strengths"])
            
            # Format the final response
            profile = {
                "user_id": user_id,
                "strengths": result["strengths"],
                "sensitivities": result["sensitivities"],
                "preferences": result["preferences"],
                "embedding": f"vector://ndsp/{user_id}",
                "evidence": {
                    "quiz_ids": list(quiz_results.keys()) if isinstance(quiz_results, dict) else [],
                    "behavioral_metrics": list(behavior_data.keys()) if behavior_data else [],
                    "work_history": list(past_data.keys()) if past_data else []
                },
                "confidence_score": np.mean(list(result["confidence_factors"].values())),
                "analysis": result["analysis_summary"],
                "recommendations": result["recommendations"]
            }
            
            logger.info(f"Successfully analyzed profile for user {user_id}")
            return profile
            
        except Exception as e:
            logger.error(f"Error analyzing cognitive profile for user {user_id}: {str(e)}")
            raise Exception(f"Failed to analyze cognitive profile: {str(e)}")

    async def analyze_responses(self, responses: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze assessment responses using LangChain with fallback if LLM not available"""
        if not self.llm_available:
            return self._get_fallback_analysis(responses)
            
        try:
            # Create prompt from responses
            prompt = self._create_analysis_prompt(responses)
            
            # Get analysis from LLM
            analysis = await self.llm.ainvoke(prompt)
            
            # Parse and return results
            return self._parse_analysis(analysis.content)
            
        except Exception as e:
            logger.error(f"Error in analyze_responses: {str(e)}")
            logger.info("Falling back to limited analysis")
            return self._get_fallback_analysis(responses)
            
    def _get_fallback_analysis(self, responses: Dict[str, Any]) -> Dict[str, Any]:
        """Return basic analysis when LLM is not available"""
        return {
            "cognitive_profile": {
                "primary_strengths": ["Analysis requires valid API key"],
                "processing_preferences": "Analysis requires valid API key",
                "sensitivities": {
                    "sensory": "Not available",
                    "environmental": "Not available"
                },
                "recommendations": [
                    "Please set a valid AIML_API_KEY in your .env file",
                    "Using limited demo functionality"
                ]
            },
            "assessment_insights": {
                "key_observations": ["Full analysis requires API key"],
                "strength_areas": ["Not available without API key"],
                "potential_challenges": ["Not available without API key"],
                "recommendations": ["Set AIML_API_KEY in .env for full functionality"]
            }
        }

    async def generate_engaging_quiz(
        self,
        activity_type: str = "interactive_quiz",
        target_cdcs: Optional[List[str]] = None,
        title_theme: str = "Cognitive Strengths Discovery"
    ) -> Dict[str, Any]:
        """
        Generate an engaging, indirect assessment using ChatGPT
        
        Args:
            activity_type: Type of activity (quiz, game, scenario, puzzle)
            target_cdcs: Specific CDC categories to focus on
            title_theme: Theme or topic for the quiz
            
        Returns:
            Engaging quiz/game that indirectly assesses CDC categories
        """
        if not self.llm_available:
            return self._get_fallback_quiz()
            
        try:
            if target_cdcs is None:
                target_cdcs = self.core_cdcs + self.additional_cdcs
            
            logger.info(f"Generating {activity_type} with theme: {title_theme}")
            
            # Generate the quiz using ChatGPT with explicit JSON formatting
            result = await self.quiz_generation_chain.ainvoke({
                "activity_type": activity_type,
                "target_cdcs": ", ".join(target_cdcs),
                "title_theme": title_theme
            })
            
            # Ensure we have the required fields
            if not isinstance(result, dict):
                raise ValueError("AI generated non-dict result")
            
            # Validate required fields
            required_fields = ['quiz_id', 'title', 'description', 'activity_type', 'estimated_time', 'questions']
            for field in required_fields:
                if field not in result:
                    logger.warning(f"Missing field {field} in AI result, using fallback")
                    return self._get_fallback_quiz()
            
            logger.info(f"Successfully generated quiz: {result['title']}")
            return result
            
        except Exception as e:
            logger.error(f"Error generating quiz: {str(e)}")
            # Fallback to a simple default quiz
            return self._get_fallback_quiz()

    def _get_fallback_quiz(self) -> Dict[str, Any]:
        """Fallback quiz if AI generation fails"""
        return {
            "quiz_id": "fallback_preferences_v1",
            "title": "Work Style & Preferences Explorer",
            "description": "Discover your ideal work environment and preferences through scenario-based questions.",
            "activity_type": "preference_quiz",
            "estimated_time": 10,
            "questions": [
                {
                    "question_id": "workspace_pref",
                    "question_text": "You're designing your ideal workspace. Which setup appeals to you most?",
                    "question_type": "multiple_choice",
                    "options": [
                        "Quiet, minimal space with noise-canceling headphones",
                        "Open area with background music and colleague interaction",
                        "Private office with adjustable lighting and temperature",
                        "Flexible space where I can move between different zones"
                    ],
                    "cdc_targets": ["sensory_processing", "attention_filtering"]
                },
                {
                    "question_id": "project_approach",
                    "question_text": "You've been assigned a complex project. What's your preferred approach?",
                    "question_type": "multiple_choice",
                    "options": [
                        "Break it into detailed phases with clear deadlines",
                        "Dive in and adapt as I go",
                        "Research thoroughly before starting",
                        "Collaborate with others to brainstorm approaches"
                    ],
                    "cdc_targets": ["executive_function", "creative_ideation"]
                },
                {
                    "question_id": "communication_style",
                    "question_text": "In team meetings, you typically...",
                    "question_type": "multiple_choice",
                    "options": [
                        "Prefer written agendas and follow-up notes",
                        "Enjoy spontaneous discussion and brainstorming",
                        "Like structured time for questions and input",
                        "Prefer one-on-one conversations after the meeting"
                    ],
                    "cdc_targets": ["verbal_communication", "communication_interpretation"]
                },
                {
                    "question_id": "pattern_puzzle",
                    "question_text": "Which type of puzzle or challenge do you find most engaging?",
                    "question_type": "multiple_choice",
                    "options": [
                        "Logic puzzles and number sequences",
                        "Visual pattern recognition games",
                        "Word association and language puzzles",
                        "Spatial/3D puzzles and mazes"
                    ],
                    "cdc_targets": ["pattern_recognition", "spatial_reasoning"]
                }
            ],
            "cdc_mapping": {
                "workspace_pref": ["sensory_processing", "attention_filtering"],
                "project_approach": ["executive_function", "creative_ideation"],
                "communication_style": ["verbal_communication", "communication_interpretation"],
                "pattern_puzzle": ["pattern_recognition", "spatial_reasoning"]
            }
        }

# Global agent instance
agent = SelfDiscoveryAgent()