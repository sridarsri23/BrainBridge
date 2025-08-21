import { useState } from "react";
import { QuestionForm } from "./QuestionForm";

const PATTERN_SPATIAL_QUESTIONS = [
  {
    question_id: "pattern_seq_1",
    question_text: "When learning a new skill or system, you prefer to:",
    question_type: "multiple_choice",
    options: [
      "Study the underlying patterns and rules first",
      "Practice with examples and learn by doing",
      "Break it down into smaller, manageable steps",
      "Connect it to things I already know"
    ],
    cdc_targets: ["pattern_recognition", "executive_function"]
  },
  {
    question_id: "spatial_nav_1",
    question_text: "You're giving directions to a friend. Your preferred method is:",
    question_type: "multiple_choice",
    options: [
      "Draw a detailed map with landmarks",
      "Provide step-by-step written directions",
      "Use GPS coordinates and street names",
      "Describe visual cues and references"
    ],
    cdc_targets: ["spatial_reasoning", "verbal_communication"]
  },
  {
    question_id: "data_pattern_1",
    question_text: "When reviewing data or information, you're typically good at:",
    question_type: "multiple_choice",
    options: [
      "Spotting inconsistencies and errors",
      "Seeing trends and patterns over time",
      "Organizing information logically",
      "Finding connections between different pieces"
    ],
    cdc_targets: ["pattern_recognition"]
  },
  {
    question_id: "spatial_memory_1",
    question_text: "When remembering where you placed something, you typically:",
    question_type: "multiple_choice",
    options: [
      "Visualize the exact location in my mind",
      "Remember the context of when I put it there",
      "Retrace my steps systematically",
      "Create mental maps of important item locations"
    ],
    cdc_targets: ["spatial_reasoning"]
  },
  {
    question_id: "pattern_complex_1",
    question_text: "Which type of complex pattern do you find easiest to work with?",
    question_type: "multiple_choice",
    options: [
      "Mathematical sequences and formulas",
      "Visual designs and layouts",
      "Code structures and logic flows",
      "Musical rhythms and compositions"
    ],
    cdc_targets: ["pattern_recognition", "spatial_reasoning"]
  },
  {
    question_id: "spatial_org_1",
    question_text: "How do you prefer to organize your physical workspace?",
    question_type: "multiple_choice",
    options: [
      "Everything has a specific place and position",
      "Organized chaos that makes sense to me",
      "Clean and minimal with essential items only",
      "Flexible setup that I can rearrange as needed"
    ],
    cdc_targets: ["spatial_reasoning", "executive_function"]
  },
  {
    question_id: "pattern_learning_1",
    question_text: "You learn new patterns best when:",
    question_type: "multiple_choice",
    options: [
      "Given clear examples and practice opportunities",
      "Understanding the underlying logic first",
      "Comparing similarities to familiar patterns",
      "Experimenting and discovering patterns yourself"
    ],
    cdc_targets: ["pattern_recognition"]
  },
  {
    question_id: "spatial_visualization_1",
    question_text: "When working with 3D objects or spaces in your mind:",
    question_type: "multiple_choice",
    options: [
      "I can easily rotate and manipulate objects mentally",
      "I prefer to use physical models or drawings",
      "I need multiple views or angles to understand",
      "I work better with 2D representations"
    ],
    cdc_targets: ["spatial_reasoning"]
  },
  {
    question_id: "pattern_problem_1",
    question_text: "When solving puzzles or problems, you typically:",
    question_type: "multiple_choice",
    options: [
      "Look for repeating patterns or sequences",
      "Test different approaches systematically",
      "Trust your intuition about what feels right",
      "Break the problem into smaller pattern pieces"
    ],
    cdc_targets: ["pattern_recognition", "executive_function"]
  },
  {
    question_id: "spatial_navigation_1",
    question_text: "Your approach to navigating new places is to:",
    question_type: "multiple_choice",
    options: [
      "Study maps beforehand and plan routes",
      "Use GPS but pay attention to landmarks",
      "Rely on your sense of direction and exploration",
      "Ask for directions and follow step-by-step"
    ],
    cdc_targets: ["spatial_reasoning", "executive_function"]
  }
];

interface PatternSpatialAssessmentProps {
  onComplete: (responses: Record<string, string>) => void;
  onBack: () => void;
}

export function PatternSpatialAssessment({ onComplete, onBack }: PatternSpatialAssessmentProps) {
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
    if (currentQuestion < PATTERN_SPATIAL_QUESTIONS.length - 1) {
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
          questions={PATTERN_SPATIAL_QUESTIONS}
          title="🧩 Pattern Recognition & Spatial Intelligence"
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