import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/navigation/header";
import StatsCard from "@/components/dashboard/stats-card";
import JobMatchCard from "@/components/jobs/job-match-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Send, GraduationCap, Users, MessageSquare } from "lucide-react";

export default function NDAdultDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: jobMatches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ["/api/jobs/matches/my"],
    enabled: isAuthenticated,
  });

  const { data: profile } = useQuery({
    queryKey: ["/api/profiles/"],
    enabled: isAuthenticated,
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

  return (
    <div className="dashboard-container">
      <Header />
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-8">
            <div>
              <h1 className="dashboard-greeting" data-testid="text-greeting">
                {greeting()}, {user?.firstName || 'there'}!
              </h1>
              <p className="dashboard-subtitle">Here's your personalized job matching dashboard</p>
            </div>
            <div className="bg-card px-4 py-2 rounded-lg border">
              <div className="flex items-center space-x-3">
                <span className="profile-completion-text">Profile Strength</span>
                <span className="profile-completion-percentage">{calculateProfileCompletion(profile)}%</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="dashboard-stats-grid">
            <StatsCard 
              title="New Matches" 
              value="12" 
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
              title="Skills Completed" 
              value="15" 
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
                {matchesLoading ? (
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
                        <p className="text-muted-foreground mb-4">Complete your profile to start receiving personalized job matches.</p>
                        <Button data-testid="button-complete-profile-empty">Complete Profile</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
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
        </div>
      </main>
    </div>
  );
}
