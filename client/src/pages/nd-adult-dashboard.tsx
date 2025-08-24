import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/stats-card";
import JobMatchCard from "@/components/jobs/job-match-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { Briefcase, Send, GraduationCap, Users, MessageSquare, Brain, Target } from "lucide-react";
import { Link } from "wouter";

export default function NDAdultDashboard() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const { showError } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      showError("Unauthorized", "You are logged out. Logging in again...");
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, showError]);

  const queryClient = useQueryClient();

  // Completed assessments for the ND user
  const { data: myAssessments = [], isLoading: assessmentsLoading } = useQuery({
    queryKey: ["/api/assessment/assessments/my-responses"],
    enabled: isAuthenticated && !!token,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/assessment/assessments/my-responses", {
        headers,
      });
      if (!res.ok) throw new Error(`Failed to fetch assessments: ${res.status}`);
      return res.json();
    },
  });

  const assessmentsCompleted = Array.isArray(myAssessments) ? myAssessments.length : 0;
  const hasCompletedAssessment = assessmentsCompleted > 0;

  // When assessments count flips from 0 to >0, refresh matches immediately
  useEffect(() => {
    if (hasCompletedAssessment) {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs/matches/my"] });
    }
  }, [hasCompletedAssessment, queryClient]);

  // Also refresh matches whenever the exact count changes (e.g., from 1 -> 2)
  useEffect(() => {
    if (isAuthenticated && token) {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs/matches/my"] });
    }
  }, [assessmentsCompleted, isAuthenticated, token, queryClient]);

  const { data: jobMatches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ["/api/jobs/matches/my"],
    enabled: isAuthenticated && !!token && hasCompletedAssessment,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/jobs/matches/my", { headers });
      if (!res.ok) {
        throw new Error(`Failed to fetch matches: ${res.status}`);
      }
      return res.json();
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["/api/profile/"],
    enabled: isAuthenticated && !!token,
    queryFn: async () => {
      const res = await fetch("/api/profile/", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch profile: ${res.status}`);
      }
      return res.json();
    },
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const calculateProfileCompletion = (profile: any) => {
    if (!profile) return 0;
    
    const fields = [
      profile.firstName,
      profile.lastName,
      profile.email,
      profile.phoneNumber,
      profile.location,
      profile.bio,
      profile.experienceLevel,
      profile.availabilityStatus,
      profile.profileImageUrl,
      profile.neurodivergentTraits,
      profile.strengths,
      profile.accommodations,
      profile.workPreferences
    ];
    
    const completedFields = fields.filter(field => 
      field !== null && field !== undefined && 
      (typeof field === 'string' ? field.trim() !== '' : 
       Array.isArray(field) ? field.length > 0 : true)
    ).length;
    
    return Math.round((completedFields / fields.length) * 100);
  };

  if (!isAuthenticated || isLoading) {
    return null;
  }

  const displayName = (user as any)?.first_name ?? (user as any)?.firstName ?? 'there';

  return (
    <DashboardLayout 
      title={`${greeting()}, ${displayName}!`}
      subtitle="Here's your personalized job matching dashboard"
      actions={
        <div className="bg-card px-4 py-2 rounded-lg border">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">Profile Strength</span>
            <span className="font-semibold text-primary">{calculateProfileCompletion(profile)}%</span>
          </div>
        </div>
      }
    >

      {/* Stats Cards */}
      <div className="grid-responsive-4 mb-8">
            <StatsCard 
              title="New Matches" 
              value={`${Array.isArray(jobMatches) ? jobMatches.length : 0}`} 
              icon={Briefcase}
              color="primary"
              data-testid="stats-card-matches"
            />
            <StatsCard 
              title="Applications" 
              value="8" 
              icon={Send}
              color="secondary"
              data-testid="stats-card-applications"
            />
            <StatsCard 
              title="Assessments Completed" 
              value={`${assessmentsCompleted}`} 
              icon={GraduationCap}
              color="success"
              data-testid="stats-card-skills"
            />
            <StatsCard 
              title="Mentor Sessions" 
              value="3" 
              icon={Users}
              color="warning"
              data-testid="stats-card-sessions"
            />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
            {/* Job Matches */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Recommended Jobs</h2>
                <Button variant="ghost" data-testid="button-view-all-jobs">View All</Button>
              </div>

              <div className="space-y-4">
                {matchesLoading || assessmentsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-card p-6 rounded-xl border animate-pulse">
                        <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                        <div className="h-3 bg-muted rounded w-1/4 mb-4" />
                        <div className="h-12 bg-muted rounded mb-4" />
                        <div className="flex space-x-2">
                          <div className="h-8 bg-muted rounded w-20" />
                          <div className="h-8 bg-muted rounded w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !hasCompletedAssessment ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">Complete an assessment to see matches</h3>
                        <p className="text-muted-foreground mb-4">Take the self-discovery assessment to unlock personalized job matches.</p>
                        <Link href="/self-discovery">
                          <Button data-testid="button-start-assessment-empty">Start Assessment</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ) : Array.isArray(jobMatches) && jobMatches.length > 0 ? (
                  jobMatches.slice(0, 3).map((match: any) => (
                    <JobMatchCard key={match.matchId} match={match} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No job matches yet</h3>
                        <p className="text-muted-foreground mb-4">We couldn't find matches right now. Check back later or refine your preferences.</p>
                        <Link href="/self-discovery">
                          <Button data-testid="button-review-assessment-empty">Review Assessment</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Self-Discovery Assessment Card */}
              <Card data-testid="card-self-discovery">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Discover Your Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Take our AI-powered cognitive assessment to discover your unique strengths and work preferences.
                  </p>
                  <Link href="/self-discovery">
                    <Button className="w-full" data-testid="button-start-self-discovery">
                      <Target className="mr-2 h-4 w-4" />
                      Start Assessment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              {/* Learning Progress */}
              <Card data-testid="card-learning-progress">
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Interview Skills</span>
                        <span className="text-muted-foreground">80%</span>
                      </div>
                      <Progress value={80} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Communication</span>
                        <span className="text-muted-foreground">65%</span>
                      </div>
                      <Progress value={65} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Workplace Etiquette</span>
                        <span className="text-muted-foreground">45%</span>
                      </div>
                      <Progress value={45} />
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" data-testid="button-continue-learning">
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Sessions */}
              <Card data-testid="card-upcoming-sessions">
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-accent rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Mentor Session</p>
                        <p className="text-xs text-muted-foreground">Today, 2:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-accent rounded-lg">
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-success" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Workshop</p>
                        <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Task Coach */}
              <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white" data-testid="card-ai-coach">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">AI Task Coach</h3>
                  <p className="text-sm text-purple-100 mb-4">Get personalized guidance for your work tasks</p>
                  <Button className="bg-white text-purple-600 hover:bg-purple-50" data-testid="button-start-chat">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
      </div>
    </DashboardLayout>
  );
}
