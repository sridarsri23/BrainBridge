import { useState } from "react";
import { QuestionForm } from "./QuestionForm";

const FOCUS_ATTENTION_QUESTIONS = [
  {
    question_id: "focus_env_1",
    question_text: "You're working on an important project. Which environment helps you focus best?",
    question_type: "multiple_choice",
    options: [
      "Quiet library with minimal distractions",
      "Coffee shop with background chatter",
      "Home office with familiar surroundings",
      "Flexible space where I can move around"
    ],
    cdc_targets: ["focus_sustained_attention", "sensory_processing"]
  },
  {
    question_id: "attention_task_1",
    question_text: "During a 2-hour deep work session, you typically...",
    question_type: "multiple_choice",
    options: [
      "Work straight through without breaks",
      "Take short 5-minute breaks every 30 minutes",
      "Switch between 2-3 related tasks",
      "Need longer breaks to recharge"
    ],
    cdc_targets: ["focus_sustained_attention", "executive_function"]
  },
  {
    question_id: "distraction_mgmt_1",
    question_text: "When notifications pop up while you're concentrating, you...",
    question_type: "multiple_choice",
    options: [
      "Immediately check and respond",
      "Note them but finish current task first",
      "Turn off all notifications during focus time",
      "Get distracted and struggle to refocus"
    ],
    cdc_targets: ["attention_filtering", "executive_function"]
  },
  {
    question_id: "focus_duration_1",
    question_text: "What's your ideal focus session length for challenging work?",
    question_type: "multiple_choice",
    options: [
      "25-30 minutes (Pomodoro style)",
      "45-60 minutes with short breaks",
      "1.5-2 hours deep focus blocks",
      "It varies depending on my energy"
    ],
    cdc_targets: ["focus_sustained_attention"]
  },
  {
    question_id: "attention_switch_1",
    question_text: "How do you handle switching between different types of tasks?",
    question_type: "multiple_choice",
    options: [
      "I transition smoothly between tasks",
      "I need a few minutes to adjust my mindset",
      "I prefer to batch similar tasks together",
      "I find task switching quite challenging"
    ],
    cdc_targets: ["attention_filtering", "executive_function"]
  },
  {
    question_id: "focus_time_1",
    question_text: "When working on complex tasks, what time of day works best for your focus?",
    question_type: "multiple_choice",
    options: [
      "Early morning (6-9 AM)",
      "Mid-morning (9-12 PM)",
      "Afternoon (1-5 PM)",
      "Evening (6-10 PM)"
    ],
    cdc_targets: ["focus_sustained_attention"]
  },
  {
    question_id: "attention_filter_1",
    question_text: "In a busy, noisy environment, you can best focus by:",
    question_type: "multiple_choice",
    options: [
      "Using noise-canceling headphones",
      "Finding a quiet corner or private space",
      "Focusing intensely and tuning out the noise",
      "Taking frequent breaks to reset my attention"
    ],
    cdc_targets: ["attention_filtering", "sensory_processing"]
  },
  {
    question_id: "focus_interruption_1",
    question_text: "When you're interrupted during focused work, what happens next?",
    question_type: "multiple_choice",
    options: [
      "I can quickly return to where I left off",
      "I need a moment to remember what I was doing",
      "I often lose my train of thought completely",
      "I use the break to reassess my approach"
    ],
    cdc_targets: ["focus_sustained_attention", "attention_filtering"]
  },
  {
    question_id: "attention_energy_1",
    question_text: "Your attention and focus feel strongest when you:",
    question_type: "multiple_choice",
    options: [
      "Have a clear plan and structured approach",
      "Feel energized and well-rested",
      "Are working on something personally interesting",
      "Have minimal external pressures or deadlines"
    ],
    cdc_targets: ["focus_sustained_attention", "executive_function"]
  },
  {
    question_id: "multi_attention_1",
    question_text: "When monitoring multiple information streams (emails, chats, documents):",
    question_type: "multiple_choice",
    options: [
      "I can effectively track multiple streams",
      "I prefer to check them at scheduled intervals",
      "I find it overwhelming and limit notifications",
      "I use tools to organize and prioritize information"
    ],
    cdc_targets: ["attention_filtering", "multitasking_context_switching"]
  }
];

interface FocusAttentionAssessmentProps {
  onComplete: (responses: Record<string, string>) => void;
  onBack: () => void;
}

export function FocusAttentionAssessment({ onComplete, onBack }: FocusAttentionAssessmentProps) {
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
    if (currentQuestion < FOCUS_ATTENTION_QUESTIONS.length - 1) {
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
          questions={FOCUS_ATTENTION_QUESTIONS}
          title="🎯 Focus & Attention Explorer"
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