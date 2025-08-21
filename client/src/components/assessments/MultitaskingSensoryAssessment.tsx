import { useState } from "react";
import { QuestionForm } from "./QuestionForm";

const MULTITASKING_SENSORY_QUESTIONS = [
  {
    question_id: "multitask_approach_1",
    question_text: "Your approach to handling multiple responsibilities is to:",
    question_type: "multiple_choice",
    options: [
      "Switch between tasks throughout the day as needed",
      "Batch similar tasks together for efficiency",
      "Focus on one task completely before starting another",
      "Work on multiple related tasks simultaneously"
    ],
    cdc_targets: ["multitasking_context_switching"]
  },
  {
    question_id: "context_switching_1",
    question_text: "When you need to switch between very different types of work:",
    question_type: "multiple_choice",
    options: [
      "I transition smoothly without losing momentum",
      "I need a few minutes to adjust my mindset",
      "I prefer scheduled transition time between tasks",
      "I find frequent switching mentally exhausting"
    ],
    cdc_targets: ["multitasking_context_switching", "executive_function"]
  },
  {
    question_id: "sensory_environment_1",
    question_text: "In your ideal work environment, the lighting is:",
    question_type: "multiple_choice",
    options: [
      "Bright, energizing natural or artificial light",
      "Soft, warm lighting that's easy on the eyes",
      "Adjustable lighting I can control throughout the day",
      "Minimal lighting - I prefer dimmer environments"
    ],
    cdc_targets: ["sensory_processing"]
  },
  {
    question_id: "auditory_processing_1",
    question_text: "Your relationship with background noise while working is:",
    question_type: "multiple_choice",
    options: [
      "I work better with complete silence",
      "Gentle background music or white noise helps me focus",
      "I can work with moderate ambient noise around me",
      "I prefer varied soundscapes depending on the task"
    ],
    cdc_targets: ["sensory_processing", "attention_filtering"]
  },
  {
    question_id: "interruption_management_1",
    question_text: "When interrupted while juggling multiple tasks, you:",
    question_type: "multiple_choice",
    options: [
      "Handle the interruption and easily return to what you were doing",
      "Need to write down where you left off before switching",
      "Feel frustrated and need time to regain your focus",
      "Use interruptions as natural break points between tasks"
    ],
    cdc_targets: ["multitasking_context_switching", "attention_filtering"]
  },
  {
    question_id: "tactile_preference_1",
    question_text: "Regarding physical comfort and tactile preferences:",
    question_type: "multiple_choice",
    options: [
      "I'm comfortable with various textures and physical inputs",
      "I have specific preferences for comfortable clothing/materials",
      "I'm sensitive to certain textures or physical sensations",
      "I use tactile tools (fidgets, textures) to help me focus"
    ],
    cdc_targets: ["sensory_processing"]
  },
  {
    question_id: "parallel_processing_1",
    question_text: "When monitoring multiple streams of information (emails, chats, alerts):",
    question_type: "multiple_choice",
    options: [
      "I can track multiple streams effectively",
      "I prefer to check them at scheduled intervals",
      "I find it overwhelming and limit notifications",
      "I use tools to organize and prioritize information"
    ],
    cdc_targets: ["multitasking_context_switching", "attention_filtering"]
  },
  {
    question_id: "sensory_overload_1",
    question_text: "When sensory input becomes overwhelming, you typically:",
    question_type: "multiple_choice",
    options: [
      "Take a break in a quiet, calm space",
      "Use tools (headphones, sunglasses) to reduce input",
      "Push through and adapt to the environment",
      "Remove myself from the overstimulating situation"
    ],
    cdc_targets: ["sensory_processing", "executive_function"]
  },
  {
    question_id: "task_prioritization_1",
    question_text: "When multiple urgent tasks compete for attention, you:",
    question_type: "multiple_choice",
    options: [
      "Quickly assess and tackle the most critical first",
      "Work on multiple tasks in parallel when possible",
      "Seek clarification on priorities before starting",
      "Complete shorter tasks first to clear mental space"
    ],
    cdc_targets: ["multitasking_context_switching", "executive_function"]
  },
  {
    question_id: "sensory_focus_1",
    question_text: "Your sensory preferences for maintaining focus include:",
    question_type: "multiple_choice",
    options: [
      "Consistent, predictable sensory environment",
      "Some variety in sensory input to stay engaged",
      "Minimal sensory input to avoid distractions",
      "Control over sensory environment (lighting, sound, etc.)"
    ],
    cdc_targets: ["sensory_processing", "focus_sustained_attention"]
  },
  {
    question_id: "mental_energy_1",
    question_text: "After periods of intense multitasking or sensory input, you restore energy by:",
    question_type: "multiple_choice",
    options: [
      "Taking a quiet break alone",
      "Doing a single-focus, engaging activity",
      "Physical movement or exercise",
      "Social interaction and conversation"
    ],
    cdc_targets: ["multitasking_context_switching", "sensory_processing"]
  }
];

interface MultitaskingSensoryAssessmentProps {
  onComplete: (responses: Record<string, string>) => void;
  onBack: () => void;
}

export function MultitaskingSensoryAssessment({ onComplete, onBack }: MultitaskingSensoryAssessmentProps) {
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
    if (currentQuestion < MULTITASKING_SENSORY_QUESTIONS.length - 1) {
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
          questions={MULTITASKING_SENSORY_QUESTIONS}
          title="🎛️ Multitasking & Sensory Processing Explorer"
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