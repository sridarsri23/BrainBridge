import { useState } from "react";
import { QuestionForm } from "./QuestionForm";

const COMMUNICATION_QUESTIONS = [
  {
    question_id: "comm_style_1",
    question_text: "In team meetings, you typically prefer to:",
    question_type: "multiple_choice",
    options: [
      "Share ideas immediately as they come to mind",
      "Think through ideas before speaking",
      "Build on others' ideas and collaborate",
      "Listen first, then contribute when asked"
    ],
    cdc_targets: ["verbal_communication", "communication_interpretation"]
  },
  {
    question_id: "explanation_style_1",
    question_text: "When explaining a complex concept, you prefer to:",
    question_type: "multiple_choice",
    options: [
      "Use visual aids, diagrams, or examples",
      "Break it down into logical steps",
      "Tell a story or use analogies",
      "Provide detailed written documentation"
    ],
    cdc_targets: ["verbal_communication", "spatial_reasoning"]
  },
  {
    question_id: "feedback_style_1",
    question_text: "How do you prefer to receive feedback or constructive criticism?",
    question_type: "multiple_choice",
    options: [
      "Direct and specific with clear examples",
      "In writing so I can process it thoroughly",
      "In a supportive, collaborative conversation",
      "With time to ask clarifying questions"
    ],
    cdc_targets: ["communication_interpretation", "sensory_processing"]
  },
  {
    question_id: "presentation_style_1",
    question_text: "When giving presentations or sharing work, you feel most confident:",
    question_type: "multiple_choice",
    options: [
      "Speaking spontaneously with minimal notes",
      "Having detailed talking points prepared",
      "Using interactive demos or hands-on examples",
      "Sharing screen and walking through materials"
    ],
    cdc_targets: ["verbal_communication", "executive_function"]
  },
  {
    question_id: "nonverbal_reading_1",
    question_text: "In conversations, you find it easiest to understand:",
    question_type: "multiple_choice",
    options: [
      "What people say directly and explicitly",
      "Tone of voice and emotional undertones",
      "Body language and facial expressions",
      "The context and implied meanings"
    ],
    cdc_targets: ["communication_interpretation"]
  },
  {
    question_id: "written_comm_1",
    question_text: "For important communications, you prefer:",
    question_type: "multiple_choice",
    options: [
      "Face-to-face or video conversations",
      "Phone calls or audio messages",
      "Email or written documentation",
      "Chat or instant messaging"
    ],
    cdc_targets: ["verbal_communication", "communication_interpretation"]
  },
  {
    question_id: "group_dynamics_1",
    question_text: "In group discussions, you tend to:",
    question_type: "multiple_choice",
    options: [
      "Take a leadership role and guide the conversation",
      "Contribute ideas when you have something valuable to add",
      "Ask questions to understand different perspectives",
      "Prefer smaller breakout groups for deeper discussion"
    ],
    cdc_targets: ["verbal_communication", "communication_interpretation"]
  },
  {
    question_id: "conflict_comm_1",
    question_text: "When there's disagreement or conflict, your communication approach is to:",
    question_type: "multiple_choice",
    options: [
      "Address it directly and work toward resolution",
      "Take time to understand all perspectives first",
      "Focus on finding common ground and compromise",
      "Prefer to discuss it privately rather than in groups"
    ],
    cdc_targets: ["communication_interpretation", "executive_function"]
  },
  {
    question_id: "idea_sharing_1",
    question_text: "When you have a creative idea, you prefer to:",
    question_type: "multiple_choice",
    options: [
      "Share it immediately while it's fresh",
      "Develop it further before presenting",
      "Bounce it off trusted colleagues first",
      "Create a prototype or example to demonstrate"
    ],
    cdc_targets: ["verbal_communication", "creative_ideation"]
  },
  {
    question_id: "listening_style_1",
    question_text: "Your listening style in conversations is typically:",
    question_type: "multiple_choice",
    options: [
      "Active listening with questions and clarifications",
      "Focused attention without interrupting",
      "Taking notes to remember important points",
      "Relating new information to my own experiences"
    ],
    cdc_targets: ["communication_interpretation", "attention_filtering"]
  },
  {
    question_id: "virtual_comm_1",
    question_text: "In virtual/remote communication, you find it easier to:",
    question_type: "multiple_choice",
    options: [
      "Express myself clearly without visual distractions",
      "Use screen sharing to enhance explanations",
      "Have more time to process and respond thoughtfully",
      "Communicate through written channels when possible"
    ],
    cdc_targets: ["verbal_communication", "sensory_processing"]
  }
];

interface CommunicationAssessmentProps {
  onComplete: (responses: Record<string, string>) => void;
  onBack: () => void;
}

export function CommunicationAssessment({ onComplete, onBack }: CommunicationAssessmentProps) {
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
    if (currentQuestion < COMMUNICATION_QUESTIONS.length - 1) {
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
          questions={COMMUNICATION_QUESTIONS}
          title="💬 Communication & Expression Explorer"
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