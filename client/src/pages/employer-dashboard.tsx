import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/navigation/header";
import StatsCard from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Send, TrendingUp, MapPin, Clock, Calendar, Eye, NotebookPen, Zap } from "lucide-react";
import { Link } from "wouter";

export default function EmployerDashboard() {
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
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs/employer"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-6 lg:p-8">
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground" data-testid="text-employer-title">
                Employer Dashboard
              </h1>
              <p className="text-muted-foreground">Manage your neuro-inclusive hiring process</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-card px-4 py-2 rounded-lg border">
                <span className="text-sm text-muted-foreground">Certification Status</span>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-success text-success-foreground" data-testid="badge-certification">
                    Gold Certified
                  </Badge>
                </div>
              </div>
              <Button asChild data-testid="button-post-job">
                <Link href="/job-posting">Post New Job</Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Active Jobs" 
              value="8" 
              icon={Briefcase}
              color="primary"
              data-testid="stats-card-active-jobs"
            />
            <StatsCard 
              title="Matched Candidates" 
              value="47" 
              icon={Users}
              color="secondary"
              data-testid="stats-card-candidates"
            />
            <StatsCard 
              title="Applications" 
              value="23" 
              icon={Send}
              color="success"
              data-testid="stats-card-applications"
            />
            <StatsCard 
              title="Hires This Month" 
              value="5" 
              icon={TrendingUp}
              color="warning"
              data-testid="stats-card-hires"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Job Postings */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Recent Job Postings</h2>
                <Button variant="ghost" data-testid="button-manage-all-jobs">Manage All</Button>
              </div>

              <div className="space-y-4">
                {jobsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-card p-6 rounded-xl border animate-pulse">
                        <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                        <div className="h-3 bg-muted rounded w-1/4 mb-4" />
                        <div className="h-8 bg-muted rounded w-full" />
                      </div>
                    ))}
                  </div>
                ) : jobs && jobs.length > 0 ? (
                  jobs.slice(0, 3).map((job: any) => (
                    <Card key={job.jobId} className="card-hover" data-testid={`job-card-${job.jobId}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">{job.jobTitle}</h3>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <span><MapPin className="w-4 h-4 mr-1 inline" />{job.location}</span>
                              <span><Clock className="w-4 h-4 mr-1 inline" />{job.employmentType}</span>
                              <span><Calendar className="w-4 h-4 mr-1 inline" />Posted {new Date(job.publishedDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={job.isActive ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>
                              {job.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-4 text-sm text-muted-foreground">
                            <span><Eye className="w-4 h-4 mr-1 inline" />12 Matches</span>
                            <span><NotebookPen className="w-4 h-4 mr-1 inline" />5 Applications</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" data-testid={`button-view-job-${job.jobId}`}>View</Button>
                            <Button variant="ghost" size="sm" data-testid={`button-edit-job-${job.jobId}`}>Edit</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No job postings yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first job posting to start finding neurodivergent talent.</p>
                        <Button asChild data-testid="button-create-first-job">
                          <Link href="/job-posting">Create Job Posting</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Candidate Matches */}
              <Card data-testid="card-candidate-matches">
                <CardHeader>
                  <CardTitle>Top Candidate Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-accent rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">AJ</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Anonymous Candidate #1</p>
                        <p className="text-xs text-muted-foreground">95% Match • Data Analyst</p>
                      </div>
                      <Badge className="bg-success/10 text-success">New</Badge>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-accent rounded-lg">
                      <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                        <span className="text-secondary font-medium text-sm">MK</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Anonymous Candidate #2</p>
                        <p className="text-xs text-muted-foreground">88% Match • Software Developer</p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" data-testid="button-view-all-matches">
                    View All Matches
                  </Button>
                </CardContent>
              </Card>

              {/* Certification Progress */}
              <Card data-testid="card-certification-progress">
                <CardHeader>
                  <CardTitle>Certification Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Inclusive Hiring</span>
                        <span className="text-muted-foreground">100%</span>
                      </div>
                      <Progress value={100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Workplace Accommodations</span>
                        <span className="text-muted-foreground">75%</span>
                      </div>
                      <Progress value={75} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Team Management</span>
                        <span className="text-muted-foreground">50%</span>
                      </div>
                      <Progress value={50} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Task Matcher */}
              <Card className="bg-gradient-to-br from-blue-500 to-teal-500 text-white" data-testid="card-ai-matcher">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">AI Task Matcher</h3>
                  <p className="text-sm text-blue-100 mb-4">Optimize your job descriptions for better matches</p>
                  <Button className="bg-white text-blue-600 hover:bg-blue-50" data-testid="button-analyze-jobs">
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze Jobs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
    </div>
  );
}
