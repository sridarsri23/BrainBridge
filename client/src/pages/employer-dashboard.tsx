import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Briefcase, Users, Send, TrendingUp, MapPin, Clock, Calendar, Eye, NotebookPen, Zap } from "lucide-react";
import { Link } from "wouter";

export default function EmployerDashboard() {
  const { isAuthenticated, isLoading, token } = useAuth();
  const { showError } = useToast();
  const [selectedNdId, setSelectedNdId] = useState<string | null>(null);
  const [jobModal, setJobModal] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const qc = useQueryClient();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      showError("Unauthorized", "You are logged out. Logging in again...");
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, showError]);

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<any[]>({
    queryKey: ["/api/jobs/employer"],
    enabled: isAuthenticated,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Tie top-matches to the current number of jobs to avoid stale cache after posting a job
  const jobsCount = Array.isArray(jobs) ? jobs.length : 0;
  const { data: topMatchesData = { matches: [], jobs: [] } as unknown as { matches: any[]; jobs: any[] }, isLoading: matchesLoading } = useQuery<{ matches: any[]; jobs: any[] }>({
    queryKey: ["/api/jobs/employer/top-matches", jobsCount],
    queryFn: async () => {
      const response = await fetch("/api/jobs/employer/top-matches", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch top matches');
      }
      return response.json();
    },
    enabled: isAuthenticated,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });


  const { data: candidateDetails = null as any, isLoading: detailsLoading } = useQuery({
    queryKey: ["/api/jobs/employer/nd", selectedNdId, "details"],
    enabled: isAuthenticated && !!selectedNdId,
  });

  // Normalize API results for safe access
  const matchesArr: any[] = Array.isArray((topMatchesData as any)?.matches)
    ? (topMatchesData as any).matches
    : [];
  const cd: any = candidateDetails || null;
  const assessmentsArr: any[] = Array.isArray(cd?.assessments) ? cd.assessments : [];

  // Derived counts
  const activeJobs = useMemo(() => (Array.isArray(jobs) ? jobs.filter((j: any) => j.is_active).length : 0), [jobs]);
  const matchedCandidates = useMemo(() => (Array.isArray((topMatchesData as any)?.matches) ? (topMatchesData as any).matches.length : 0), [topMatchesData]);

  // Update mutation
  const updateJobMutation = useMutation({
    mutationFn: async ({ jobId, payload }: { jobId: string; payload: any }) => {
      // Map camelCase to snake_case expected by backend JobPostingUpdate
      const mapped: any = {
        ...(payload.jobTitle !== undefined ? { job_title: payload.jobTitle } : {}),
        ...(payload.location !== undefined ? { location: payload.location } : {}),
        ...(payload.employmentType !== undefined ? { employment_type: payload.employmentType } : {}),
        ...(payload.isActive !== undefined ? { is_active: payload.isActive } : {}),
        ...(payload.jobDescription !== undefined ? { job_description: payload.jobDescription } : {}),
        ...(payload.requirements !== undefined ? { requirements: payload.requirements } : {}),
        ...(payload.workSetup !== undefined ? { work_setup: payload.workSetup } : {}),
        ...(payload.salaryRangeMin !== undefined ? { salary_range_min: parseInt(payload.salaryRangeMin) || null } : {}),
        ...(payload.salaryRangeMax !== undefined ? { salary_range_max: parseInt(payload.salaryRangeMax) || null } : {}),
        ...(payload.benefits !== undefined ? { benefits: payload.benefits } : {}),
        ...(payload.applicationDeadline !== undefined ? { application_deadline: payload.applicationDeadline } : {}),
      };
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(mapped),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Failed to update job');
      }
      return res.json();
    },
    onSuccess: async (updatedJob) => {
      // Update the jobModal with fresh data from the response
      if (updatedJob) {
        setJobModal(updatedJob);
        setEditForm({
          jobTitle: updatedJob.job_title || "",
          location: updatedJob.location || "",
          employmentType: updatedJob.employment_type || "FULL_TIME",
          isActive: !!updatedJob.is_active,
          jobDescription: updatedJob.job_description || "",
          requirements: updatedJob.requirements || "",
          workSetup: updatedJob.work_setup || "",
          salaryRangeMin: updatedJob.salary_range_min || "",
          salaryRangeMax: updatedJob.salary_range_max || "",
          benefits: updatedJob.benefits || "",
          applicationDeadline: updatedJob.application_deadline || "",
        });
      }
      setIsEditMode(false);
      setShowConfirmDialog(false);
      // Refetch jobs and matches to refresh counts and UI
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["/api/jobs/employer"] }),
        qc.invalidateQueries({ queryKey: ["/api/jobs/employer/top-matches"] }),
      ]);
    }
  });

  if (!isAuthenticated || isLoading) {
    return null;
  }

  return (
    <DashboardLayout 
      title="Employer Dashboard"
      subtitle="Manage your neuro-inclusive hiring process"
      actions={
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
      }
    >

      {/* Stats Cards */}
      <div className="grid-responsive-4 mb-8">
            <StatsCard 
              title="Active Jobs" 
              value={String(activeJobs)} 
              icon={Briefcase}
              color="primary"
              data-testid="stats-card-active-jobs"
            />
            <StatsCard 
              title="Matched Candidates" 
              value={String(matchedCandidates)} 
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
                    <Card key={job.job_id} className="card-hover" data-testid={`job-card-${job.job_id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">{job.job_title}</h3>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <span><MapPin className="w-4 h-4 mr-1 inline" />{job.location}</span>
                              <span><Clock className="w-4 h-4 mr-1 inline" />{job.employment_type}</span>
                              <span><Calendar className="w-4 h-4 mr-1 inline" />Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={job.is_active ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>
                              {job.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-4 text-sm text-muted-foreground">
                            <span>
                              <Eye className="w-4 h-4 mr-1 inline" />
                              {Array.isArray(matchesArr) ? matchesArr.filter((m: any) => m.job_id === job.job_id).length : 0} Matches
                            </span>
                            <span><NotebookPen className="w-4 h-4 mr-1 inline" />5 Applications</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setJobModal(job);
                                setIsEditMode(false);
                                setEditForm({
                                  jobTitle: job.job_title || "",
                                  location: job.location || "",
                                  employmentType: job.employment_type || "FULL_TIME",
                                  isActive: !!job.is_active,
                                  jobDescription: job.job_description || "",
                                  requirements: job.requirements || "",
                                  workSetup: job.work_setup || "",
                                  salaryRangeMin: job.salary_range_min || "",
                                  salaryRangeMax: job.salary_range_max || "",
                                  benefits: job.benefits || "",
                                  applicationDeadline: job.application_deadline || "",
                                });
                              }}
                              data-testid={`button-view-job-${job.job_id}`}
                            >
                              View/Edit
                            </Button>
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
                  {matchesLoading ? (
                    <div className="space-y-4">
                      {[1,2].map(i => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg animate-pulse">
                          <div className="w-10 h-10 bg-muted rounded-full" />
                          <div className="flex-1">
                            <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                            <div className="h-3 bg-muted rounded w-1/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : matchesArr.length > 0 ? (
                    <div className="space-y-3">
                      {matchesArr.slice(0, 5).map((m: any) => (
                        <button
                          key={m.nd_id}
                          onClick={() => setSelectedNdId(m.nd_id)}
                          className="w-full text-left"
                          data-testid={`match-${m.nd_id}`}
                        >
                          <div className="flex items-center space-x-3 p-3 bg-accent rounded-lg hover:bg-accent/80">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary font-medium text-sm">{m.initials}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{m.display_name}</p>
                              <p className="text-xs text-muted-foreground">{m.match_score}% Match • {m.suggested_role}</p>
                            </div>
                            <Badge className="bg-success/10 text-success">View</Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No matches yet.</p>
                  )}
                </CardContent>
              </Card>

              {/* Certification Progress */}
              <Card data-testid="card-certification-progress">
                <CardHeader>
                  <CardTitle>DEI + Certification Progress</CardTitle>
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
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Audit Status</span>
                        <span className="text-muted-foreground">100%</span>
                      </div>
                      <Progress value={100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Documentation Status</span>
                        <span className="text-muted-foreground">100%</span>
                      </div>
                      <Progress value={100} />
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

      {/* Candidate Details Modal */}
      <Dialog open={!!selectedNdId} onOpenChange={(o) => !o && setSelectedNdId(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Candidate Details</DialogTitle>
          </DialogHeader>
          {detailsLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          ) : cd ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-medium">
                    {cd?.candidate?.initials || "NN"}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-medium">
                    {cd?.candidate?.first_name && cd?.candidate?.last_name 
                      ? `${cd.candidate.first_name} ${cd.candidate.last_name}`
                      : `Anonymous Candidate`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Profile Confidence: {((cd?.profile?.confidence_score ?? 0) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Cognitive Strengths</h4>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(cd?.profile?.strengths || {}).map(([key, value]) => {
                    const displayName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const score = value === null || value === undefined ? 0 : Number(value);
                    const percentage = Math.round(score * 100);
                    return (
                      <div key={key} className="flex items-center justify-between p-2 bg-accent/30 rounded">
                        <span className="text-sm font-medium">{displayName}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-10 text-right">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Work Environment Preferences</h4>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-accent/30 rounded">
                    <div className="text-xs font-medium text-muted-foreground">Work Style</div>
                    <div className="text-sm">Remote Preferred</div>
                  </div>
                  <div className="p-3 bg-accent/30 rounded">
                    <div className="text-xs font-medium text-muted-foreground">Communication</div>
                    <div className="text-sm">Written &gt; Verbal</div>
                  </div>
                  <div className="p-3 bg-accent/30 rounded">
                    <div className="text-xs font-medium text-muted-foreground">Schedule</div>
                    <div className="text-sm">Flexible Hours</div>
                  </div>
                  <div className="p-3 bg-accent/30 rounded">
                    <div className="text-xs font-medium text-muted-foreground">Environment</div>
                    <div className="text-sm">Quiet Space</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Assessment History</h4>
                <div className="space-y-3">
                  {assessmentsArr.length > 0 ? assessmentsArr.map((a: any) => (
                    <Card key={a.assessment_id} className="border-l-4 border-l-primary/20">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-medium">{a.title || 'Assessment'}</div>
                          <Badge variant="outline" className="text-xs">{a.type || 'General'}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          Completed: {a.completed_at ? new Date(a.completed_at).toLocaleDateString() : 'Recently'}
                        </div>
                        {a.responses && typeof a.responses === 'object' && (
                          <div className="space-y-1">
                            {Object.entries(a.responses).slice(0, 3).map(([qKey, answer]: [string, any]) => (
                              <div key={qKey} className="text-xs">
                                <span className="font-medium text-muted-foreground">{qKey}:</span>
                                <span className="ml-2">{typeof answer === 'string' ? answer.slice(0, 50) + (answer.length > 50 ? '...' : '') : String(answer)}</span>
                              </div>
                            ))}
                            {Object.keys(a.responses).length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{Object.keys(a.responses).length - 3} more responses
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )) : (
                    <p className="text-sm text-muted-foreground">No assessments completed yet.</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Get Free Trial for Interact
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Unified Job Modal */}
      <Dialog open={!!jobModal} onOpenChange={(o) => { if (!o) { setJobModal(null); setIsEditMode(false); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
          </DialogHeader>
          {jobModal && (
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md bg-background mt-1"
                    value={editForm.jobTitle || ''}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, jobTitle: e.target.value }))}
                    disabled={!isEditMode}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md bg-background mt-1"
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, location: e.target.value }))}
                    disabled={!isEditMode}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Employment Type</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md bg-background mt-1"
                    value={editForm.employmentType || 'FULL_TIME'}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, employmentType: e.target.value }))}
                    disabled={!isEditMode}
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Work Setup</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md bg-background mt-1"
                    value={editForm.workSetup || ''}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, workSetup: e.target.value }))}
                    disabled={!isEditMode}
                  >
                    <option value="">Select work setup</option>
                    <option value="REMOTE">Remote</option>
                    <option value="ONSITE">On-site</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <input
                    id="isActive"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={!!editForm.isActive}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, isActive: e.target.checked }))}
                    disabled={!isEditMode}
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">Active Job Posting</label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Salary Range Min</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md bg-background mt-1"
                    value={editForm.salaryRangeMin || ''}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, salaryRangeMin: e.target.value }))}
                    disabled={!isEditMode}
                    placeholder="e.g. 50000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Salary Range Max</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md bg-background mt-1"
                    value={editForm.salaryRangeMax || ''}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, salaryRangeMax: e.target.value }))}
                    disabled={!isEditMode}
                    placeholder="e.g. 80000"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Application Deadline</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md bg-background mt-1"
                  value={editForm.applicationDeadline || ''}
                  onChange={(e) => setEditForm((f: any) => ({ ...f, applicationDeadline: e.target.value }))}
                  disabled={!isEditMode}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Job Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md bg-background mt-1 min-h-[120px]"
                  value={editForm.jobDescription || ''}
                  onChange={(e) => setEditForm((f: any) => ({ ...f, jobDescription: e.target.value }))}
                  disabled={!isEditMode}
                  placeholder="Describe the role, responsibilities, and what makes this position unique..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Requirements & Qualifications</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md bg-background mt-1 min-h-[100px]"
                  value={editForm.requirements || ''}
                  onChange={(e) => setEditForm((f: any) => ({ ...f, requirements: e.target.value }))}
                  disabled={!isEditMode}
                  placeholder="List required skills, experience, education, certifications..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Benefits & Perks</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md bg-background mt-1 min-h-[80px]"
                  value={editForm.benefits || ''}
                  onChange={(e) => setEditForm((f: any) => ({ ...f, benefits: e.target.value }))}
                  disabled={!isEditMode}
                  placeholder="Health insurance, flexible hours, remote work options, professional development..."
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => { setJobModal(null); setIsEditMode(false); }}>
              Close
            </Button>
            <div className="flex space-x-2">
              {!isEditMode ? (
                <Button onClick={() => setIsEditMode(true)}>
                  Edit Job
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => setIsEditMode(false)}>
                    Cancel Edit
                  </Button>
                  <Button onClick={() => setShowConfirmDialog(true)}>
                    Update Job
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Update</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to update this job posting? This will save all changes and may affect current matches and applications.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => updateJobMutation.mutate({ jobId: jobModal!.job_id, payload: editForm })}
              disabled={updateJobMutation.isPending}
            >
              {updateJobMutation.isPending ? 'Updating...' : 'Confirm Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
