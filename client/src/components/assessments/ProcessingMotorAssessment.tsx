import { useState } from "react";
import { QuestionForm } from "./QuestionForm";

const PROCESSING_MOTOR_QUESTIONS = [
  {
    question_id: "processing_pace_1",
    question_text: "When learning new information, you prefer a pace that is:",
    question_type: "multiple_choice",
    options: [
      "Fast-paced with lots of information quickly",
      "Moderate pace with time to ask questions",
      "Slower pace with time to fully process each concept",
      "Variable pace depending on the complexity"
    ],
    cdc_targets: ["processing_speed"]
  },
  {
    question_id: "typing_preference_1",
    question_text: "Your typing and writing preference is:",
    question_type: "multiple_choice",
    options: [
      "Fast typing with occasional corrections",
      "Steady, accurate typing without rushing",
      "Alternating between typing and voice input",
      "Handwriting when possible for better thinking"
    ],
    cdc_targets: ["fine_motor_input", "processing_speed"]
  },
  {
    question_id: "response_time_1",
    question_text: "In meetings or discussions, your response style is typically:",
    question_type: "multiple_choice",
    options: [
      "Quick responses with immediate thoughts",
      "Taking a moment to formulate thoughtful responses",
      "Asking clarifying questions before responding",
      "Preferring to respond after the meeting via email"
    ],
    cdc_targets: ["processing_speed", "verbal_communication"]
  },
  {
    question_id: "fine_motor_tasks_1",
    question_text: "For detailed, precise work (drawing, crafts, detailed input), you:",
    question_type: "multiple_choice",
    options: [
      "Enjoy the precision and find it relaxing",
      "Can do it well but need breaks to avoid fatigue",
      "Prefer tools or technology to assist with precision",
      "Find it challenging and prefer alternative approaches"
    ],
    cdc_targets: ["fine_motor_input"]
  },
  {
    question_id: "information_intake_1",
    question_text: "When processing large amounts of information, you work best by:",
    question_type: "multiple_choice",
    options: [
      "Reviewing everything quickly first, then diving deep",
      "Processing information systematically piece by piece",
      "Focusing on key highlights and main points",
      "Taking breaks to let information settle before continuing"
    ],
    cdc_targets: ["processing_speed", "executive_function"]
  },
  {
    question_id: "input_method_1",
    question_text: "Your preferred method for inputting ideas or notes is:",
    question_type: "multiple_choice",
    options: [
      "Typing on keyboard - fast and efficient",
      "Handwriting - helps me think and remember",
      "Voice recording - speaking feels more natural",
      "Visual tools - diagrams, mind maps, sketches"
    ],
    cdc_targets: ["fine_motor_input", "creative_ideation"]
  },
  {
    question_id: "pressure_performance_1",
    question_text: "Under time pressure, your performance typically:",
    question_type: "multiple_choice",
    options: [
      "Improves - I work better with urgency",
      "Stays consistent - pressure doesn't affect me much",
      "Decreases - I need time to do my best work",
      "Varies - depends on the type of task"
    ],
    cdc_targets: ["processing_speed", "executive_function"]
  },
  {
    question_id: "coordination_comfort_1",
    question_text: "When using tools or technology that require precise coordination:",
    question_type: "multiple_choice",
    options: [
      "I adapt quickly and use them confidently",
      "I can use them effectively with some practice",
      "I prefer simpler tools when possible",
      "I often find alternative approaches"
    ],
    cdc_targets: ["fine_motor_input", "spatial_reasoning"]
  },
  {
    question_id: "speed_accuracy_1",
    question_text: "When balancing speed and accuracy in your work, you typically:",
    question_type: "multiple_choice",
    options: [
      "Prioritize speed and fix errors later",
      "Aim for accuracy even if it takes longer",
      "Find a balance that works for each specific task",
      "Do multiple passes - fast first draft, careful revision"
    ],
    cdc_targets: ["processing_speed", "executive_function"]
  },
  {
    question_id: "cognitive_load_1",
    question_text: "When your cognitive load is high (lots to think about), you:",
    question_type: "multiple_choice",
    options: [
      "Power through and maintain your usual pace",
      "Slow down to maintain quality and accuracy",
      "Take strategic breaks to reset your mental energy",
      "Simplify or reorganize tasks to reduce complexity"
    ],
    cdc_targets: ["processing_speed", "executive_function"]
  }
];

interface ProcessingMotorAssessmentProps {
  onComplete: (responses: Record<string, string>) => void;
  onBack: () => void;
}

export function ProcessingMotorAssessment({ onComplete, onBack }: ProcessingMotorAssessmentProps) {
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
    if (currentQuestion < PROCESSING_MOTOR_QUESTIONS.length - 1) {
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
          questions={PROCESSING_MOTOR_QUESTIONS}
          title="⚡ Processing Speed & Motor Skills Explorer"
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