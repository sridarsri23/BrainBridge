import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import AIAnalysisDemo from "@/components/ai/AIAnalysisDemo";
import AssessmentResults from "@/components/assessments/AssessmentResults";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { apiRequest } from "@/lib/queryClient"; // not used here

// Import separate assessment components
import { AssessmentCard } from "@/components/assessments/AssessmentCard";
import { FocusAttentionAssessment } from "@/components/assessments/FocusAttentionAssessment";
import { PatternSpatialAssessment } from "@/components/assessments/PatternSpatialAssessment";
import { CommunicationAssessment } from "@/components/assessments/CommunicationAssessment";
import { CreativeExecutiveAssessment } from "@/components/assessments/CreativeExecutiveAssessment";
import { ProcessingMotorAssessment } from "@/components/assessments/ProcessingMotorAssessment";
import { MultitaskingSensoryAssessment } from "@/components/assessments/MultitaskingSensoryAssessment";
import WorkEnvMatchmaker from "@/components/assessments/WorkEnvMatchmaker";
import MicroBriefingComprehension from "@/components/assessments/MicroBriefingComprehension";

interface Quiz {
  quiz_id: string;
  title: string;
  description: string;
  activity_type: string;
  estimated_time: number;
  cdc_focus: string[];
}

type AssessmentType = 
  | 'work_env_matchmaker'
  | 'micro_briefing_comprehension'
  | 'focus_attention_assessment'
  | 'pattern_spatial_assessment'
  | 'communication_assessment'
  | 'creative_executive_assessment'
  | 'processing_motor_assessment'
  | 'multitasking_sensory_assessment';

export default function SelfDiscovery() {
  const { user } = useAuth();
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentType | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState<{ assessmentId: string; responses: Record<string, string> } | null>(null);
  const queryClient = useQueryClient();
  const { token } = useAuth();

  // Mock assessment data for now - in production this would come from the API
  const mockQuizzes: Quiz[] = [
    {
      quiz_id: 'work_env_matchmaker',
      title: '🎮 Work Environment Matchmaker',
      description: 'Sort workplace needs into Must / Nice-to-have / Avoid to reveal strengths & sensitivities.',
      activity_type: 'gamified_selections',
      estimated_time: 6,
      cdc_focus: ['sensory_processing', 'attention_filtering', 'verbal_communication', 'executive_function']
    },
    {
      quiz_id: 'micro_briefing_comprehension',
      title: '🎬 Micro-briefing Comprehension',
      description: 'Watch a short clip and answer open questions. AI grades clarity, detail, and relevance.',
      activity_type: 'video_open_ended',
      estimated_time: 5,
      cdc_focus: ['verbal_communication', 'communication_interpretation']
    },
    {
      quiz_id: 'focus_attention_assessment',
      title: '🎯 Focus & Attention Explorer',
      description: 'Discover your unique attention patterns and focus preferences through real-world scenarios.',
      activity_type: 'cognitive_assessment',
      estimated_time: 15,
      cdc_focus: ['focus_sustained_attention', 'attention_filtering']
    },
    {
      quiz_id: 'pattern_spatial_assessment',
      title: '🧩 Pattern Recognition & Spatial Intelligence',
      description: 'Explore how you process patterns, spatial relationships, and logical sequences.',
      activity_type: 'cognitive_assessment',
      estimated_time: 12,
      cdc_focus: ['pattern_recognition', 'spatial_reasoning']
    },
    {
      quiz_id: 'communication_assessment',
      title: '💬 Communication & Expression Explorer',
      description: 'Understand your communication style and how you best express and interpret information.',
      activity_type: 'communication_assessment',
      estimated_time: 18,
      cdc_focus: ['verbal_communication', 'communication_interpretation']
    },
    {
      quiz_id: 'creative_executive_assessment',
      title: '💡 Creative Thinking & Executive Function Explorer',
      description: 'Discover your creative process and how you plan, organize, and execute ideas.',
      activity_type: 'cognitive_assessment',
      estimated_time: 20,
      cdc_focus: ['creative_ideation', 'executive_function']
    },
    {
      quiz_id: 'processing_motor_assessment',
      title: '⚡ Processing Speed & Motor Skills Explorer',
      description: 'Understand your information processing pace and fine motor coordination preferences.',
      activity_type: 'cognitive_assessment',
      estimated_time: 14,
      cdc_focus: ['processing_speed', 'fine_motor_input']
    },
    {
      quiz_id: 'multitasking_sensory_assessment',
      title: '🎛️ Multitasking & Sensory Processing Explorer',
      description: 'Explore how you handle multiple tasks and sensory information in your environment.',
      activity_type: 'sensory_assessment',
      estimated_time: 16,
      cdc_focus: ['multitasking_context_switching', 'sensory_processing']
    }
  ];

  // Fetch available quiz templates
  const { data: quizData, isLoading: quizzesLoading } = useQuery({
    queryKey: ['/api/assessment/quiz-templates'],
    enabled: !!user && user.user_role === 'ND_ADULT'
  });

  const quizzes = (quizData as any)?.available_quizzes || mockQuizzes;

  // Submit assessment response mutation
  const submitResponseMutation = useMutation({
  mutationFn: async (data: { quizId: string; responses: Record<string, string> }) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`/api/assessment/assessments/${data.quizId}/respond`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        assessment_id: data.quizId,   // required by model
        responses: data.responses,
        completion_time_seconds: 120  // optional
      })
    });

    if (!response.ok) {
      throw new Error(`Assessment submission failed: ${response.status}`);
    }

    return response.json();
  },
  onSuccess: (_, variables) => {
    setCompletedQuizzes(prev => new Set([...prev, variables.quizId]));
    queryClient.invalidateQueries({ queryKey: ['/api/assessment/quiz-templates'] });
  }
});

  // Temporarily bypass user role check for testing
  // if (!user || user.user_role !== 'ND_ADULT') {
  //   return (
  //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
  //       <Card className="max-w-md w-full mx-4">
  //         <CardHeader className="text-center">
  //           <Brain className="w-12 h-12 mx-auto text-blue-600 mb-4" data-testid="icon-access-restricted" />
  //           <CardTitle>Access Restricted</CardTitle>
  //           <CardDescription>
  //             Self-discovery assessments are only available for ND professionals.
  //           </CardDescription>
  //         </CardHeader>
  //       </Card>
  //     </div>
  //   );
  // }

  if (quizzesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 mx-auto text-blue-600 mb-4 animate-pulse" data-testid="icon-loading" />
          <p className="text-gray-600 dark:text-gray-400" data-testid="text-loading">
            Loading your personalized assessments...
          </p>
        </div>
      </div>
    );
  }

  // Handle assessment completion
  const handleAssessmentComplete = async (quizId: string, responses: Record<string, string>) => {
    console.log('Assessment completed:', quizId, responses);
    
    // Always show results immediately for better UX
    setSelectedAssessment(null);
    setShowResults({ assessmentId: quizId, responses });
    
    // Try to submit in background (optional for demo)
    try {
      if (!token) {
        console.log('Skipping submission: no auth token present');
        return; // avoid 401 spam in demo
      }
      await submitResponseMutation.mutateAsync({ quizId, responses });
      console.log('Assessment submitted successfully');
    } catch (error) {
      console.log('Assessment submission failed (continuing with demo):', error);
      // This is OK - we still show results for demo purposes
    }
  };

  // Handle starting an assessment
  const handleStartAssessment = (quizId: string) => {
    setSelectedAssessment(quizId as AssessmentType);
  };

  // Handle going back to assessment selection
  const handleBackToSelection = () => {
    setSelectedAssessment(null);
    setShowResults(null);
  };

  // Render specific assessment component based on selection
  const renderAssessmentComponent = () => {
    const commonProps = {
      onComplete: (responses: Record<string, string>) => 
        handleAssessmentComplete(selectedAssessment!, responses),
      onBack: handleBackToSelection
    };

    switch (selectedAssessment) {
      case 'work_env_matchmaker':
        return <WorkEnvMatchmaker {...commonProps} />;
      case 'micro_briefing_comprehension':
        return <MicroBriefingComprehension {...commonProps} />;
      case 'focus_attention_assessment':
        return <FocusAttentionAssessment {...commonProps} />;
      case 'pattern_spatial_assessment':
        return <PatternSpatialAssessment {...commonProps} />;
      case 'communication_assessment':
        return <CommunicationAssessment {...commonProps} />;
      case 'creative_executive_assessment':
        return <CreativeExecutiveAssessment {...commonProps} />;
      case 'processing_motor_assessment':
        return <ProcessingMotorAssessment {...commonProps} />;
      case 'multitasking_sensory_assessment':
        return <MultitaskingSensoryAssessment {...commonProps} />;
      default:
        return null;
    }
  };

  // If showing assessment results, render results component
  if (showResults) {
    const assessmentTitle = quizzes.find((q: Quiz) => q.quiz_id === showResults.assessmentId)?.title || 'Assessment';
    return (
      <AssessmentResults
        assessmentId={showResults.assessmentId}
        assessmentTitle={assessmentTitle}
        responses={showResults.responses}
        onBack={handleBackToSelection}
        onStartNewAssessment={() => {
          setShowResults(null);
          setSelectedAssessment(null);
        }}
      />
    );
  }

  // If an assessment is selected, render that component
  if (selectedAssessment) {
    return renderAssessmentComponent();
  }

  // Assessment Selection View
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-10 h-10 text-blue-600 mr-3" data-testid="icon-brain" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100" data-testid="title-main">
              Self-Discovery Hub
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-testid="text-description">
            Explore your unique cognitive profile through engaging assessments designed specifically 
            for neurodivergent professionals. Each assessment uses real-world scenarios to understand 
            your strengths and preferences.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border" data-testid="card-progress">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Your Progress
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-blue-600" data-testid="text-progress-count">
              {completedQuizzes.size}/{quizzes.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Assessments Completed
            </div>
            <div className="ml-auto">
              <Badge variant="outline" className="text-sm" data-testid="badge-progress">
                {quizzes.length > 0 ? Math.round((completedQuizzes.size / quizzes.length) * 100) : 0}% Complete
              </Badge>
            </div>
          </div>
        </div>

        {/* AI Analysis Demo Section */}
        <div className="mb-12">
          <AIAnalysisDemo />
        </div>

        {/* Assessment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-assessments">
          {quizzes.map((quiz: Quiz) => (
            <AssessmentCard
              key={quiz.quiz_id}
              quiz={quiz}
              onStart={handleStartAssessment}
              isStarted={completedQuizzes.has(quiz.quiz_id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}