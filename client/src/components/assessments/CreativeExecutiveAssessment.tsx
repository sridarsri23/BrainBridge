import { useState } from "react";
import { QuestionForm } from "./QuestionForm";

const CREATIVE_EXECUTIVE_QUESTIONS = [
  {
    question_id: "creative_process_1",
    question_text: "When facing a creative challenge, your natural approach is to:",
    question_type: "multiple_choice",
    options: [
      "Brainstorm many ideas quickly, then refine the best ones",
      "Research existing solutions and adapt them creatively",
      "Take a walk or break to let ideas develop naturally",
      "Collaborate with others to build on different perspectives"
    ],
    cdc_targets: ["creative_ideation", "executive_function"]
  },
  {
    question_id: "problem_solving_1",
    question_text: "Your preferred problem-solving approach is:",
    question_type: "multiple_choice",
    options: [
      "Break the problem into smaller, manageable pieces",
      "Look for patterns from similar problems you've solved",
      "Try different approaches until something works",
      "Step back and consider the bigger picture first"
    ],
    cdc_targets: ["executive_function", "pattern_recognition"]
  },
  {
    question_id: "planning_style_1",
    question_text: "When planning a complex project, you typically:",
    question_type: "multiple_choice",
    options: [
      "Create detailed schedules and timelines",
      "Set key milestones and adapt as needed",
      "Focus on the end goal and work backward",
      "Start with what excites you most and build from there"
    ],
    cdc_targets: ["executive_function"]
  },
  {
    question_id: "innovation_1",
    question_text: "Your most innovative ideas typically come from:",
    question_type: "multiple_choice",
    options: [
      "Combining existing concepts in new ways",
      "Observing patterns in nature or everyday life",
      "Challenging assumptions about how things work",
      "Imagining ideal solutions without current constraints"
    ],
    cdc_targets: ["creative_ideation", "pattern_recognition"]
  },
  {
    question_id: "decision_making_1",
    question_text: "When making important decisions, you prefer to:",
    question_type: "multiple_choice",
    options: [
      "Gather comprehensive information before deciding",
      "Trust your intuition and make quick decisions",
      "Consult with trusted advisors or mentors",
      "Create pros and cons lists to analyze options"
    ],
    cdc_targets: ["executive_function", "communication_interpretation"]
  },
  {
    question_id: "creative_environment_1",
    question_text: "You're most creative in environments that are:",
    question_type: "multiple_choice",
    options: [
      "Quiet and minimally distracting",
      "Stimulating with interesting visuals or sounds",
      "Flexible where I can move around freely",
      "Collaborative with access to other creative people"
    ],
    cdc_targets: ["creative_ideation", "sensory_processing"]
  },
  {
    question_id: "task_management_1",
    question_text: "Your approach to managing multiple tasks is to:",
    question_type: "multiple_choice",
    options: [
      "Prioritize based on deadlines and importance",
      "Work on whatever feels most engaging at the moment",
      "Complete easier tasks first to build momentum",
      "Group similar tasks together for efficiency"
    ],
    cdc_targets: ["executive_function", "multitasking_context_switching"]
  },
  {
    question_id: "iteration_style_1",
    question_text: "When refining ideas or solutions, you prefer to:",
    question_type: "multiple_choice",
    options: [
      "Make incremental improvements over time",
      "Test radical alternatives to find breakthroughs",
      "Get feedback early and often from others",
      "Perfect one aspect at a time systematically"
    ],
    cdc_targets: ["creative_ideation", "executive_function"]
  },
  {
    question_id: "motivation_style_1",
    question_text: "You maintain motivation best when:",
    question_type: "multiple_choice",
    options: [
      "Working toward clear, achievable goals",
      "Tackling interesting and challenging problems",
      "Seeing the positive impact of your work",
      "Having variety and avoiding repetitive tasks"
    ],
    cdc_targets: ["executive_function", "creative_ideation"]
  },
  {
    question_id: "failure_learning_1",
    question_text: "When something doesn't work as planned, your approach is to:",
    question_type: "multiple_choice",
    options: [
      "Analyze what went wrong and adjust the approach",
      "Try a completely different strategy",
      "Seek input from others who've faced similar challenges",
      "Take a break and return with fresh perspective"
    ],
    cdc_targets: ["executive_function", "creative_ideation"]
  },
  {
    question_id: "inspiration_source_1",
    question_text: "You find creative inspiration most often from:",
    question_type: "multiple_choice",
    options: [
      "Reading, research, and learning new things",
      "Conversations and interactions with diverse people",
      "Nature, art, music, or other sensory experiences",
      "Reflecting on personal experiences and emotions"
    ],
    cdc_targets: ["creative_ideation", "sensory_processing"]
  }
];

interface CreativeExecutiveAssessmentProps {
  onComplete: (responses: Record<string, string>) => void;
  onBack: () => void;
}

export function CreativeExecutiveAssessment({ onComplete, onBack }: CreativeExecutiveAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const handleResponseChange = (questionId: string, response: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const handleNext = () => {
    if (currentQuestion < CREATIVE_EXECUTIVE_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
    onComplete(responses);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <QuestionForm
          questions={CREATIVE_EXECUTIVE_QUESTIONS}
          title="💡 Creative Thinking & Executive Function Explorer"
          currentQuestion={currentQuestion}
          responses={responses}
          onResponseChange={handleResponseChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onComplete={handleComplete}
          isComplete={isComplete}
        />
      </div>
    </div>
  );
}