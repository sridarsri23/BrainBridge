import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Target, Lightbulb, ArrowLeft, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

interface AssessmentResultsProps {
  assessmentId: string;
  assessmentTitle: string;
  responses: Record<string, string>;
  onBack: () => void;
  onStartNewAssessment: () => void;
}

interface AIAnalysisResult {
  cognitive_profile: {
    primary_strengths: string[];
    processing_preferences: string[];
    optimal_work_conditions: string[];
  };
  insights: {
    pattern_analysis: string;
    unique_qualities: string;
    potential_challenges: string;
  };
  recommendations: {
    workplace_accommodations: string[];
    career_suggestions: string[];
    development_opportunities: string[];
  };
  confidence_score: number;
  summary: string;
}

export default function AssessmentResults({ 
  assessmentId, 
  assessmentTitle, 
  responses, 
  onBack, 
  onStartNewAssessment 
}: AssessmentResultsProps) {
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const analyzeResultsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/ai/demo-analyze/${assessmentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: responses,
          user_context: {
            assessment_type: assessmentId,
            completed: true
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data.analysis);
      setShowAnalysis(true);
    }
  });

  const responseCount = Object.keys(responses).length;

    return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Assessment Completion Header */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-green-900">
                Assessment Completed!
              </CardTitle>
              <CardDescription className="text-green-700">
                {assessmentTitle} - {responseCount} responses recorded
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white/80 p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-800 mb-2">Your Responses Summary:</h3>
              <div className="grid gap-2 text-sm text-gray-600">
                {Object.entries(responses).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="font-medium">{key}:</span>
                    <span className="truncate">{value}</span>
                  </div>
                ))}
                {responseCount > 3 && (
                  <p className="text-gray-500 italic">... and {responseCount - 3} more responses</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => analyzeResultsMutation.mutate()}
                disabled={analyzeResultsMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {analyzeResultsMutation.isPending ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Get AI Analysis
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={onStartNewAssessment}
              >
                Take Another Assessment
              </Button>
              
              <Button 
                variant="ghost"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {showAnalysis && analysisResult && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Your Cognitive Profile Analysis
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Confidence: {(analysisResult?.confidence_score ? (analysisResult.confidence_score * 100).toFixed(0) : "N/A")}%
                </Badge>
                <Badge variant="outline">GPT-5 Analysis</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Personal Summary</h3>
                <p className="text-green-700">{analysisResult?.summary || "No summary available."}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Your Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysisResult?.cognitive_profile?.primary_strengths?.map((strength, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <span className="text-sm">{strength}</span>
                        </li>
                      )) || <p className="text-sm text-gray-500">No strengths found.</p>}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                      Work Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysisResult?.cognitive_profile?.processing_preferences?.map((preference, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                          <span className="text-sm">{preference}</span>
                        </li>
                      )) || <p className="text-sm text-gray-500">No preferences found.</p>}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personalized Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Workplace Accommodations:</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult?.recommendations?.workplace_accommodations?.map((accommodation, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {accommodation}
                        </Badge>
                      )) || <p className="text-sm text-gray-500">No accommodations available.</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Career Suggestions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult?.recommendations?.career_suggestions?.map((suggestion, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {suggestion}
                        </Badge>
                      )) || <p className="text-sm text-gray-500">No suggestions available.</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-800">AI Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-purple-800">Pattern Analysis:</h4>
                    <p className="text-sm text-purple-700">{analysisResult?.insights?.pattern_analysis || "No analysis available."}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800">Unique Qualities:</h4>
                    <p className="text-sm text-purple-700">{analysisResult?.insights?.unique_qualities || "No unique qualities found."}</p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )}

      {analyzeResultsMutation.isError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">
              Analysis Error: {analyzeResultsMutation.error?.message || 'AI analysis failed'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}