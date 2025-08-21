import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Target, Lightbulb } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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

export default function AIAnalysisDemo() {
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  // Demo assessment responses for testing
  const demoResponses = {
    "focus_q1": "I prefer working on one task at a time without interruptions",
    "focus_q2": "A quiet, organized space with minimal visual distractions",
    "pattern_q1": "I naturally notice patterns and inconsistencies in data",
    "pattern_q2": "Visual diagrams and flowcharts help me understand complex information",
    "communication_q1": "I prefer written communication for complex topics",
    "communication_q2": "I like having time to process and formulate thoughtful responses"
  };

  const analyzeAssessmentMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/ai/demo-analyze/focus_attention_assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: demoResponses,
          user_context: {
            assessment_type: "focus_attention_assessment",
            demo: true
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data.analysis);
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-blue-900">
                🤖 AI-Powered Assessment Analysis
              </CardTitle>
              <CardDescription className="text-blue-700">
                Experience GPT-4o intelligent analysis of neurodivergent cognitive profiles
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white/80 p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-800 mb-2">Demo Assessment Responses:</h3>
              <div className="grid gap-2 text-sm text-gray-600">
                {Object.entries(demoResponses).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="font-medium">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => analyzeAssessmentMutation.mutate()}
              disabled={analyzeAssessmentMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {analyzeAssessmentMutation.isPending ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing with GPT-4o...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysisResult && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Analysis Results
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Confidence: {(analysisResult.confidence_score * 100).toFixed(0)}%</Badge>
                <Badge variant="outline">GPT-4o Analysis</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Summary</h3>
                <p className="text-green-700">{analysisResult.summary}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Primary Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysisResult.cognitive_profile.primary_strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
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
                      {analysisResult.cognitive_profile.processing_preferences.map((preference, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                          <span className="text-sm">{preference}</span>
                        </li>
                      ))}
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
                      {analysisResult.recommendations.workplace_accommodations.map((accommodation, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {accommodation}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Career Suggestions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.recommendations.career_suggestions.map((suggestion, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {suggestion}
                        </Badge>
                      ))}
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
                    <p className="text-sm text-purple-700">{analysisResult.insights.pattern_analysis}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800">Unique Qualities:</h4>
                    <p className="text-sm text-purple-700">{analysisResult.insights.unique_qualities}</p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )}

      {analyzeAssessmentMutation.isError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">
              Error: {analyzeAssessmentMutation.error?.message || 'AI analysis failed'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}