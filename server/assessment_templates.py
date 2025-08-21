"""
Comprehensive Assessment Templates for Cognitive Demand Categories (CDC)
Each assessment section contains 10+ questions for proper profiling
"""

def get_comprehensive_assessments():
    return [
        {
            "quiz_id": "focus_attention_assessment",
            "title": "🎯 Focus & Attention Explorer",
            "description": "Discover your natural focus patterns and attention preferences through engaging scenarios",
            "activity_type": "interactive_scenarios",
            "estimated_time": 12,
            "cdc_focus": ["focus_sustained_attention", "attention_filtering"],
            "questions": [
                {
                    "question_id": "focus_env_1",
                    "question_text": "You're working on an important project. Which environment helps you focus best?",
                    "question_type": "multiple_choice",
                    "options": [
                        "Quiet library with minimal distractions",
                        "Coffee shop with background chatter",
                        "Home office with familiar surroundings",
                        "Flexible space where I can move around"
                    ],
                    "cdc_targets": ["focus_sustained_attention", "sensory_processing"]
                },
                {
                    "question_id": "attention_task_1",
                    "question_text": "During a 2-hour deep work session, you typically...",
                    "question_type": "multiple_choice",
                    "options": [
                        "Work straight through without breaks",
                        "Take short 5-minute breaks every 30 minutes",
                        "Switch between 2-3 related tasks",
                        "Need longer breaks to recharge"
                    ],
                    "cdc_targets": ["focus_sustained_attention", "executive_function"]
                },
                {
                    "question_id": "distraction_mgmt_1",
                    "question_text": "When notifications pop up while you're concentrating, you...",
                    "question_type": "multiple_choice",
                    "options": [
                        "Immediately check and respond",
                        "Note them but finish current task first",
                        "Turn off all notifications during focus time",
                        "Get distracted and struggle to refocus"
                    ],
                    "cdc_targets": ["attention_filtering", "executive_function"]
                },
                {
                    "question_id": "focus_duration_1",
                    "question_text": "What's your ideal focus session length for challenging work?",
                    "question_type": "multiple_choice",
                    "options": [
                        "25-30 minutes (Pomodoro style)",
                        "45-60 minutes with short breaks",
                        "1.5-2 hours deep focus blocks",
                        "It varies depending on my energy"
                    ],
                    "cdc_targets": ["focus_sustained_attention"]
                },
                {
                    "question_id": "attention_switch_1",
                    "question_text": "How do you handle switching between different types of tasks?",
                    "question_type": "multiple_choice",
                    "options": [
                        "I transition smoothly between tasks",
                        "I need a few minutes to adjust my mindset",
                        "I prefer to batch similar tasks together",
                        "I find task switching quite challenging"
                    ],
                    "cdc_targets": ["attention_filtering", "executive_function"]
                },
                {
                    "question_id": "focus_time_1",
                    "question_text": "When working on complex tasks, what time of day works best for your focus?",
                    "question_type": "multiple_choice",
                    "options": [
                        "Early morning (6-9 AM)",
                        "Mid-morning (9-12 PM)",
                        "Afternoon (1-5 PM)",
                        "Evening (6-10 PM)"
                    ],
                    "cdc_targets": ["focus_sustained_attention"]
                },
                {
                    "question_id": "attention_filter_1",
                    "question_text": "In a busy, noisy environment, you can best focus by:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Using noise-canceling headphones",
                        "Finding a quiet corner or private space",
                        "Focusing intensely and tuning out the noise",
                        "Taking frequent breaks to reset my attention"
                    ],
                    "cdc_targets": ["attention_filtering", "sensory_processing"]
                },
                {
                    "question_id": "focus_interruption_1",
                    "question_text": "When you're interrupted during focused work, what happens next?",
                    "question_type": "multiple_choice",
                    "options": [
                        "I can quickly return to where I left off",
                        "I need a moment to remember what I was doing",
                        "I often lose my train of thought completely",
                        "I use the break to reassess my approach"
                    ],
                    "cdc_targets": ["focus_sustained_attention", "attention_filtering"]
                },
                {
                    "question_id": "attention_energy_1",
                    "question_text": "Your attention and focus feel strongest when you:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Have a clear plan and structured approach",
                        "Feel energized and well-rested",
                        "Are working on something personally interesting",
                        "Have minimal external pressures or deadlines"
                    ],
                    "cdc_targets": ["focus_sustained_attention", "executive_function"]
                },
                {
                    "question_id": "multi_attention_1",
                    "question_text": "When monitoring multiple information streams (emails, chats, documents):",
                    "question_type": "multiple_choice",
                    "options": [
                        "I can effectively track multiple streams",
                        "I prefer to check them at scheduled intervals",
                        "I find it overwhelming and limit notifications",
                        "I use tools to organize and prioritize information"
                    ],
                    "cdc_targets": ["attention_filtering", "multitasking_context_switching"]
                }
            ]
        },
        {
            "quiz_id": "pattern_spatial_assessment",
            "title": "🧩 Pattern Recognition & Spatial Intelligence",
            "description": "Explore your pattern recognition and spatial reasoning abilities through puzzles and scenarios",
            "activity_type": "visual_puzzles",
            "estimated_time": 15,
            "cdc_focus": ["pattern_recognition", "spatial_reasoning"],
            "questions": [
                {
                    "question_id": "pattern_seq_1",
                    "question_text": "When learning a new skill or system, you prefer to:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Study the underlying patterns and rules first",
                        "Practice with examples and learn by doing",
                        "Break it down into smaller, manageable steps",
                        "Connect it to things I already know"
                    ],
                    "cdc_targets": ["pattern_recognition", "executive_function"]
                },
                {
                    "question_id": "spatial_nav_1",
                    "question_text": "You're giving directions to a friend. Your preferred method is:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Draw a detailed map with landmarks",
                        "Provide step-by-step written directions",
                        "Use GPS coordinates and street names",
                        "Describe visual cues and references"
                    ],
                    "cdc_targets": ["spatial_reasoning", "verbal_communication"]
                },
                {
                    "question_id": "data_pattern_1",
                    "question_text": "When reviewing data or information, you're typically good at:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Spotting inconsistencies and errors",
                        "Seeing trends and patterns over time",
                        "Organizing information logically",
                        "Finding connections between different pieces"
                    ],
                    "cdc_targets": ["pattern_recognition"]
                },
                {
                    "question_id": "spatial_memory_1",
                    "question_text": "When remembering where you placed something, you typically:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Visualize the exact location in my mind",
                        "Remember the context of when I put it there",
                        "Retrace my steps systematically",
                        "Create mental maps of important item locations"
                    ],
                    "cdc_targets": ["spatial_reasoning"]
                },
                {
                    "question_id": "pattern_complex_1",
                    "question_text": "Which type of complex pattern do you find easiest to work with?",
                    "question_type": "multiple_choice",
                    "options": [
                        "Mathematical sequences and formulas",
                        "Visual designs and layouts",
                        "Code structures and logic flows",
                        "Musical rhythms and compositions"
                    ],
                    "cdc_targets": ["pattern_recognition", "spatial_reasoning"]
                },
                {
                    "question_id": "spatial_org_1",
                    "question_text": "How do you prefer to organize your physical workspace?",
                    "question_type": "multiple_choice",
                    "options": [
                        "Everything has a specific place and position",
                        "Organized chaos that makes sense to me",
                        "Clean and minimal with essential items only",
                        "Flexible setup that I can rearrange as needed"
                    ],
                    "cdc_targets": ["spatial_reasoning", "executive_function"]
                },
                {
                    "question_id": "pattern_learning_1",
                    "question_text": "You learn new patterns best when:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Given clear examples and practice opportunities",
                        "Understanding the underlying logic first",
                        "Comparing similarities to familiar patterns",
                        "Experimenting and discovering patterns yourself"
                    ],
                    "cdc_targets": ["pattern_recognition"]
                },
                {
                    "question_id": "spatial_visualization_1",
                    "question_text": "When working with 3D objects or spaces in your mind:",
                    "question_type": "multiple_choice",
                    "options": [
                        "I can easily rotate and manipulate objects mentally",
                        "I prefer to use physical models or drawings",
                        "I need multiple views or angles to understand",
                        "I work better with 2D representations"
                    ],
                    "cdc_targets": ["spatial_reasoning"]
                },
                {
                    "question_id": "pattern_problem_1",
                    "question_text": "When solving puzzles or problems, you typically:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Look for repeating patterns or sequences",
                        "Test different approaches systematically",
                        "Trust your intuition about what feels right",
                        "Break the problem into smaller pattern pieces"
                    ],
                    "cdc_targets": ["pattern_recognition", "executive_function"]
                },
                {
                    "question_id": "spatial_navigation_1",
                    "question_text": "Your approach to navigating new places is to:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Study maps beforehand and plan routes",
                        "Use GPS but pay attention to landmarks",
                        "Rely on your sense of direction and exploration",
                        "Ask for directions and follow step-by-step"
                    ],
                    "cdc_targets": ["spatial_reasoning", "executive_function"]
                }
            ]
        },
        {
            "quiz_id": "communication_assessment",
            "title": "💬 Communication & Expression Explorer",
            "description": "Understand your natural communication style and how you best express ideas",
            "activity_type": "scenario_based",
            "estimated_time": 18,
            "cdc_focus": ["verbal_communication", "communication_interpretation"],
            "questions": [
                {
                    "question_id": "comm_style_1",
                    "question_text": "In team meetings, you typically prefer to:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Share ideas immediately as they come to mind",
                        "Think through ideas before speaking",
                        "Build on others' ideas and collaborate",
                        "Listen first, then contribute when asked"
                    ],
                    "cdc_targets": ["verbal_communication", "communication_interpretation"]
                },
                {
                    "question_id": "explanation_style_1",
                    "question_text": "When explaining a complex concept, you prefer to:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Use visual aids, diagrams, or examples",
                        "Break it down into logical steps",
                        "Tell a story or use analogies",
                        "Provide detailed written documentation"
                    ],
                    "cdc_targets": ["verbal_communication", "spatial_reasoning"]
                },
                {
                    "question_id": "feedback_style_1",
                    "question_text": "How do you prefer to receive feedback or constructive criticism?",
                    "question_type": "multiple_choice",
                    "options": [
                        "Direct and specific with clear examples",
                        "In writing so I can process it thoroughly",
                        "In a supportive, collaborative conversation",
                        "With time to ask clarifying questions"
                    ],
                    "cdc_targets": ["communication_interpretation", "sensory_processing"]
                },
                {
                    "question_id": "presentation_style_1",
                    "question_text": "When giving presentations or sharing work, you feel most confident:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Speaking spontaneously with minimal notes",
                        "Having detailed talking points prepared",
                        "Using interactive demos or hands-on examples",
                        "Sharing screen and walking through materials"
                    ],
                    "cdc_targets": ["verbal_communication", "executive_function"]
                },
                {
                    "question_id": "nonverbal_reading_1",
                    "question_text": "In conversations, you find it easiest to understand:",
                    "question_type": "multiple_choice",
                    "options": [
                        "What people say directly and explicitly",
                        "Tone of voice and emotional undertones",
                        "Body language and facial expressions",
                        "The context and implied meanings"
                    ],
                    "cdc_targets": ["communication_interpretation"]
                },
                {
                    "question_id": "written_comm_1",
                    "question_text": "For important communications, you prefer:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Face-to-face or video conversations",
                        "Phone calls or audio messages",
                        "Email or written documentation",
                        "Chat or instant messaging"
                    ],
                    "cdc_targets": ["verbal_communication", "communication_interpretation"]
                },
                {
                    "question_id": "group_dynamics_1",
                    "question_text": "In group discussions, you tend to:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Take a leadership role and guide the conversation",
                        "Contribute ideas when you have something valuable to add",
                        "Ask questions to understand different perspectives",
                        "Prefer smaller breakout groups for deeper discussion"
                    ],
                    "cdc_targets": ["verbal_communication", "communication_interpretation"]
                },
                {
                    "question_id": "conflict_comm_1",
                    "question_text": "When there's disagreement or conflict, your communication approach is to:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Address it directly and work toward resolution",
                        "Take time to understand all perspectives first",
                        "Focus on finding common ground and compromise",
                        "Prefer to discuss it privately rather than in groups"
                    ],
                    "cdc_targets": ["communication_interpretation", "executive_function"]
                },
                {
                    "question_id": "idea_sharing_1",
                    "question_text": "When you have a creative idea, you prefer to:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Share it immediately while it's fresh",
                        "Develop it further before presenting",
                        "Bounce it off trusted colleagues first",
                        "Create a prototype or example to demonstrate"
                    ],
                    "cdc_targets": ["verbal_communication", "creative_ideation"]
                },
                {
                    "question_id": "listening_style_1",
                    "question_text": "Your listening style in conversations is typically:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Active listening with questions and clarifications",
                        "Focused attention without interrupting",
                        "Taking notes to remember important points",
                        "Relating new information to my own experiences"
                    ],
                    "cdc_targets": ["communication_interpretation", "attention_filtering"]
                },
                {
                    "question_id": "virtual_comm_1",
                    "question_text": "In virtual/remote communication, you find it easier to:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Express myself clearly without visual distractions",
                        "Use screen sharing to enhance explanations",
                        "Have more time to process and respond thoughtfully",
                        "Communicate through written channels when possible"
                    ],
                    "cdc_targets": ["verbal_communication", "sensory_processing"]
                }
            ]
        },
        {
            "quiz_id": "creative_executive_assessment",
            "title": "💡 Creative Thinking & Executive Function Explorer",
            "description": "Discover your creative problem-solving style and executive functioning preferences",
            "activity_type": "creative_scenarios",
            "estimated_time": 20,
            "cdc_focus": ["creative_ideation", "executive_function"],
            "questions": [
                {
                    "question_id": "creative_process_1",
                    "question_text": "When facing a creative challenge, your natural approach is to:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Brainstorm many ideas quickly, then refine the best ones",
                        "Research existing solutions and adapt them creatively",
                        "Take a walk or break to let ideas develop naturally",
                        "Collaborate with others to build on different perspectives"
                    ],
                    "cdc_targets": ["creative_ideation", "executive_function"]
                },
                {
                    "question_id": "problem_solving_1",
                    "question_text": "Your preferred problem-solving approach is:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Break the problem into smaller, manageable pieces",
                        "Look for patterns from similar problems you've solved",
                        "Try different approaches until something works",
                        "Step back and consider the bigger picture first"
                    ],
                    "cdc_targets": ["executive_function", "pattern_recognition"]
                },
                {
                    "question_id": "planning_style_1",
                    "question_text": "When planning a complex project, you typically:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Create detailed schedules and timelines",
                        "Set key milestones and adapt as needed",
                        "Focus on the end goal and work backward",
                        "Start with what excites you most and build from there"
                    ],
                    "cdc_targets": ["executive_function"]
                },
                {
                    "question_id": "innovation_1",
                    "question_text": "Your most innovative ideas typically come from:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Combining existing concepts in new ways",
                        "Observing patterns in nature or everyday life",
                        "Challenging assumptions about how things work",
                        "Imagining ideal solutions without current constraints"
                    ],
                    "cdc_targets": ["creative_ideation", "pattern_recognition"]
                },
                {
                    "question_id": "decision_making_1",
                    "question_text": "When making important decisions, you prefer to:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Gather comprehensive information before deciding",
                        "Trust your intuition and make quick decisions",
                        "Consult with trusted advisors or mentors",
                        "Create pros and cons lists to analyze options"
                    ],
                    "cdc_targets": ["executive_function", "communication_interpretation"]
                },
                {
                    "question_id": "creative_environment_1",
                    "question_text": "You're most creative in environments that are:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Quiet and minimally distracting",
                        "Stimulating with interesting visuals or sounds",
                        "Flexible where I can move around freely",
                        "Collaborative with access to other creative people"
                    ],
                    "cdc_targets": ["creative_ideation", "sensory_processing"]
                },
                {
                    "question_id": "task_management_1",
                    "question_text": "Your approach to managing multiple tasks is to:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Prioritize based on deadlines and importance",
                        "Work on whatever feels most engaging at the moment",
                        "Complete easier tasks first to build momentum",
                        "Group similar tasks together for efficiency"
                    ],
                    "cdc_targets": ["executive_function", "multitasking_context_switching"]
                },
                {
                    "question_id": "iteration_style_1",
                    "question_text": "When refining ideas or solutions, you prefer to:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Make incremental improvements over time",
                        "Test radical alternatives to find breakthroughs",
                        "Get feedback early and often from others",
                        "Perfect one aspect at a time systematically"
                    ],
                    "cdc_targets": ["creative_ideation", "executive_function"]
                },
                {
                    "question_id": "motivation_style_1",
                    "question_text": "You maintain motivation best when:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Working toward clear, achievable goals",
                        "Tackling interesting and challenging problems",
                        "Seeing the positive impact of your work",
                        "Having variety and avoiding repetitive tasks"
                    ],
                    "cdc_targets": ["executive_function", "creative_ideation"]
                },
                {
                    "question_id": "failure_learning_1",
                    "question_text": "When something doesn't work as planned, your approach is to:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Analyze what went wrong and adjust the approach",
                        "Try a completely different strategy",
                        "Seek input from others who've faced similar challenges",
                        "Take a break and return with fresh perspective"
                    ],
                    "cdc_targets": ["executive_function", "creative_ideation"]
                },
                {
                    "question_id": "inspiration_source_1",
                    "question_text": "You find creative inspiration most often from:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Reading, research, and learning new things",
                        "Conversations and interactions with diverse people",
                        "Nature, art, music, or other sensory experiences",
                        "Reflecting on personal experiences and emotions"
                    ],
                    "cdc_targets": ["creative_ideation", "sensory_processing"]
                }
            ]
        },
        {
            "quiz_id": "processing_motor_assessment",
            "title": "⚡ Processing Speed & Motor Skills Explorer",
            "description": "Understand your processing speed preferences and fine motor coordination strengths",
            "activity_type": "speed_coordination",
            "estimated_time": 15,
            "cdc_focus": ["processing_speed", "fine_motor_input"],
            "questions": [
                {
                    "question_id": "processing_pace_1",
                    "question_text": "When learning new information, you prefer a pace that is:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Fast-paced with lots of information quickly",
                        "Moderate pace with time to ask questions",
                        "Slower pace with time to fully process each concept",
                        "Variable pace depending on the complexity"
                    ],
                    "cdc_targets": ["processing_speed"]
                },
                {
                    "question_id": "typing_preference_1",
                    "question_text": "Your typing and writing preference is:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Fast typing with occasional corrections",
                        "Steady, accurate typing without rushing",
                        "Alternating between typing and voice input",
                        "Handwriting when possible for better thinking"
                    ],
                    "cdc_targets": ["fine_motor_input", "processing_speed"]
                },
                {
                    "question_id": "response_time_1",
                    "question_text": "In meetings or discussions, your response style is typically:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Quick responses with immediate thoughts",
                        "Taking a moment to formulate thoughtful responses",
                        "Asking clarifying questions before responding",
                        "Preferring to respond after the meeting via email"
                    ],
                    "cdc_targets": ["processing_speed", "verbal_communication"]
                },
                {
                    "question_id": "fine_motor_tasks_1",
                    "question_text": "For detailed, precise work (drawing, crafts, detailed input), you:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Enjoy the precision and find it relaxing",
                        "Can do it well but need breaks to avoid fatigue",
                        "Prefer tools or technology to assist with precision",
                        "Find it challenging and prefer alternative approaches"
                    ],
                    "cdc_targets": ["fine_motor_input"]
                },
                {
                    "question_id": "information_intake_1",
                    "question_text": "When processing large amounts of information, you work best by:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Reviewing everything quickly first, then diving deep",
                        "Processing information systematically piece by piece",
                        "Focusing on key highlights and main points",
                        "Taking breaks to let information settle before continuing"
                    ],
                    "cdc_targets": ["processing_speed", "executive_function"]
                },
                {
                    "question_id": "input_method_1",
                    "question_text": "Your preferred method for inputting ideas or notes is:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Typing on keyboard - fast and efficient",
                        "Handwriting - helps me think and remember",
                        "Voice recording - speaking feels more natural",
                        "Visual tools - diagrams, mind maps, sketches"
                    ],
                    "cdc_targets": ["fine_motor_input", "creative_ideation"]
                },
                {
                    "question_id": "pressure_performance_1",
                    "question_text": "Under time pressure, your performance typically:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Improves - I work better with urgency",
                        "Stays consistent - pressure doesn't affect me much",
                        "Decreases - I need time to do my best work",
                        "Varies - depends on the type of task"
                    ],
                    "cdc_targets": ["processing_speed", "executive_function"]
                },
                {
                    "question_id": "coordination_comfort_1",
                    "question_text": "When using tools or technology that require precise coordination:",
                    "question_type": "multiple_choice",
                    "options": [
                        "I adapt quickly and use them confidently",
                        "I can use them effectively with some practice",
                        "I prefer simpler tools when possible",
                        "I often find alternative approaches"
                    ],
                    "cdc_targets": ["fine_motor_input", "spatial_reasoning"]
                },
                {
                    "question_id": "speed_accuracy_1",
                    "question_text": "When balancing speed and accuracy in your work, you typically:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Prioritize speed and fix errors later",
                        "Aim for accuracy even if it takes longer",
                        "Find a balance that works for each specific task",
                        "Do multiple passes - fast first draft, careful revision"
                    ],
                    "cdc_targets": ["processing_speed", "executive_function"]
                },
                {
                    "question_id": "cognitive_load_1",
                    "question_text": "When your cognitive load is high (lots to think about), you:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Power through and maintain your usual pace",
                        "Slow down to maintain quality and accuracy",
                        "Take strategic breaks to reset your mental energy",
                        "Simplify or reorganize tasks to reduce complexity"
                    ],
                    "cdc_targets": ["processing_speed", "executive_function"]
                }
            ]
        },
        {
            "quiz_id": "multitasking_sensory_assessment",
            "title": "🎛️ Multitasking & Sensory Processing Explorer",
            "description": "Explore your multitasking abilities and sensory processing preferences",
            "activity_type": "multisensory_scenarios",
            "estimated_time": 17,
            "cdc_focus": ["multitasking_context_switching", "sensory_processing"],
            "questions": [
                {
                    "question_id": "multitask_approach_1",
                    "question_text": "Your approach to handling multiple responsibilities is to:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Switch between tasks throughout the day as needed",
                        "Batch similar tasks together for efficiency",
                        "Focus on one task completely before starting another",
                        "Work on multiple related tasks simultaneously"
                    ],
                    "cdc_targets": ["multitasking_context_switching"]
                },
                {
                    "question_id": "context_switching_1",
                    "question_text": "When you need to switch between very different types of work:",
                    "question_type": "multiple_choice",
                    "options": [
                        "I transition smoothly without losing momentum",
                        "I need a few minutes to adjust my mindset",
                        "I prefer scheduled transition time between tasks",
                        "I find frequent switching mentally exhausting"
                    ],
                    "cdc_targets": ["multitasking_context_switching", "executive_function"]
                },
                {
                    "question_id": "sensory_environment_1",
                    "question_text": "In your ideal work environment, the lighting is:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Bright, energizing natural or artificial light",
                        "Soft, warm lighting that's easy on the eyes",
                        "Adjustable lighting I can control throughout the day",
                        "Minimal lighting - I prefer dimmer environments"
                    ],
                    "cdc_targets": ["sensory_processing"]
                },
                {
                    "question_id": "auditory_processing_1",
                    "question_text": "Your relationship with background noise while working is:",
                    "question_type": "multiple_choice",
                    "options": [
                        "I work better with complete silence",
                        "Gentle background music or white noise helps me focus",
                        "I can work with moderate ambient noise around me",
                        "I prefer varied soundscapes depending on the task"
                    ],
                    "cdc_targets": ["sensory_processing", "attention_filtering"]
                },
                {
                    "question_id": "interruption_management_1",
                    "question_text": "When interrupted while juggling multiple tasks, you:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Handle the interruption and easily return to what you were doing",
                        "Need to write down where you left off before switching",
                        "Feel frustrated and need time to regain your focus",
                        "Use interruptions as natural break points between tasks"
                    ],
                    "cdc_targets": ["multitasking_context_switching", "attention_filtering"]
                },
                {
                    "question_id": "tactile_preference_1",
                    "question_text": "Regarding physical comfort and tactile preferences:",
                    "question_type": "multiple_choice",
                    "options": [
                        "I'm comfortable with various textures and physical inputs",
                        "I have specific preferences for comfortable clothing/materials",
                        "I'm sensitive to certain textures or physical sensations",
                        "I use tactile tools (fidgets, textures) to help me focus"
                    ],
                    "cdc_targets": ["sensory_processing"]
                },
                {
                    "question_id": "parallel_processing_1",
                    "question_text": "When monitoring multiple streams of information (emails, chats, alerts):",
                    "question_type": "multiple_choice",
                    "options": [
                        "I can track multiple streams effectively",
                        "I prefer to check them at scheduled intervals",
                        "I find it overwhelming and limit notifications",
                        "I use tools to organize and prioritize information"
                    ],
                    "cdc_targets": ["multitasking_context_switching", "attention_filtering"]
                },
                {
                    "question_id": "sensory_overload_1",
                    "question_text": "When sensory input becomes overwhelming, you typically:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Take a break in a quiet, calm space",
                        "Use tools (headphones, sunglasses) to reduce input",
                        "Push through and adapt to the environment",
                        "Remove myself from the overstimulating situation"
                    ],
                    "cdc_targets": ["sensory_processing", "executive_function"]
                },
                {
                    "question_id": "task_prioritization_1",
                    "question_text": "When multiple urgent tasks compete for attention, you:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Quickly assess and tackle the most critical first",
                        "Work on multiple tasks in parallel when possible",
                        "Seek clarification on priorities before starting",
                        "Complete shorter tasks first to clear mental space"
                    ],
                    "cdc_targets": ["multitasking_context_switching", "executive_function"]
                },
                {
                    "question_id": "sensory_focus_1",
                    "question_text": "Your sensory preferences for maintaining focus include:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Consistent, predictable sensory environment",
                        "Some variety in sensory input to stay engaged",
                        "Minimal sensory input to avoid distractions",
                        "Control over sensory environment (lighting, sound, etc.)"
                    ],
                    "cdc_targets": ["sensory_processing", "focus_sustained_attention"]
                },
                {
                    "question_id": "mental_energy_1",
                    "question_text": "After periods of intense multitasking or sensory input, you restore energy by:",
                    "question_type": "multiple_choice",
                    "options": [
                        "Taking a quiet break alone",
                        "Doing a single-focus, engaging activity",
                        "Physical movement or exercise",
                        "Social interaction and conversation"
                    ],
                    "cdc_targets": ["multitasking_context_switching", "sensory_processing"]
                }
            ]
        }
    ]