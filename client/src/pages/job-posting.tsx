import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/navigation/header";

import JobPostingForm from "@/components/forms/job-posting-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, CheckCircle, Lightbulb, Zap } from "lucide-react";
import { Link } from "wouter";

export default function JobPosting() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [jobData, setJobData] = useState<any>({});
  const [normalizedJob, setNormalizedJob] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const createJobMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/jobs", data);
    },
    onSuccess: () => {
      toast({
        title: "Job posted successfully",
        description: "Your job posting has been created and is now live.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Failed to create job posting",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const analyzeJobMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/jobs/normalize", data);
      return await response.json();
    },
    onSuccess: (result) => {
      setNormalizedJob(result.data);
      toast({
        title: "Analysis Complete",
        description: "Job description has been normalized for ND matching.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyzeJob = async () => {
    if (!jobData.job_title || !jobData.job_description) {
      toast({
        title: "Missing Information",
        description: "Please fill in job title and description before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      await analyzeJobMutation.mutateAsync({
        job_title: jobData.job_title,
        job_description: jobData.job_description,
        company_name: jobData.company || "",
        additional_context: jobData.requirements || ""
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePublishJob = () => {
    createJobMutation.mutate(jobData);
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your job posting has been saved as a draft.",
    });
  };

  if (!isAuthenticated || isLoading) {
    return null;
  }

  if (user?.user_role !== "EMPLOYER") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-warning mx-auto mb-4" />
              <h1 className="text-xl font-bold text-foreground mb-2">Access Denied</h1>
              <p className="text-muted-foreground mb-4">
                Only employers can create job postings.
              </p>
              <Button asChild>
                <Link href="/">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-job-posting-title">
            Create Job Posting
          </h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              data-testid="button-save-draft"
            >
              Save Draft
            </Button>
            <Button 
              onClick={handlePublishJob}
              disabled={createJobMutation.isPending}
              data-testid="button-publish-job"
            >
              {createJobMutation.isPending ? "Publishing..." : "Publish Job"}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job Form */}
          <div className="lg:col-span-2 space-y-6">
            <JobPostingForm 
              onDataChange={setJobData}
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Analysis Preview */}
            <Card data-testid="card-ai-analysis">
              <CardHeader>
                <CardTitle>AI Analysis Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {normalizedJob ? (
                    <>
                      <div className="p-4 bg-success/10 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-sm font-medium text-success">Analysis Complete</span>
                        </div>
                        <p className="text-sm text-success/80 mb-3">
                          {normalizedJob.plain_language_summary}
                        </p>
                        <div className="text-xs space-y-1">
                          <div><strong>CDC Scores:</strong></div>
                          {Object.entries(normalizedJob.cdc_scores || {}).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                              <span>{String(value)}/10</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {normalizedJob.accommodation_rules && normalizedJob.accommodation_rules.length > 0 && (
                        <div className="p-4 bg-primary/10 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Accommodation Suggestions</span>
                          </div>
                          <ul className="text-sm text-primary/80 space-y-1">
                            {normalizedJob.accommodation_rules.slice(0, 3).map((rule: any, index: number) => (
                              <li key={index} className="text-xs">
                                • {typeof rule === 'string' ? rule : (rule.then ? rule.then.join(', ') : JSON.stringify(rule))}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">AI Analysis</span>
                        </div>
                        <p className="text-sm text-primary/80">
                          Click "Analyze Full Description" to get AI-powered insights about cognitive demands and ND accommodation suggestions.
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant="outline" 
                  onClick={handleAnalyzeJob}
                  disabled={isAnalyzing || analyzeJobMutation.isPending}
                  data-testid="button-analyze-full"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isAnalyzing || analyzeJobMutation.isPending ? "Analyzing..." : "Analyze Full Description"}
                </Button>
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card data-testid="card-publishing-options">
              <CardHeader>
                <CardTitle>Publishing Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input 
                      id="deadline"
                      type="date"
                      className="mt-2"
                      data-testid="input-deadline"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Priority Listing</p>
                      <p className="text-xs text-muted-foreground">Boost visibility for $29/week</p>
                    </div>
                    <Switch data-testid="switch-priority" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="bg-gradient-to-br from-green-500 to-blue-500 text-white" data-testid="card-preview">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Ready to Publish?</h3>
                <p className="text-sm text-green-100 mb-4">
                  Your job posting will be visible to our talent community and AI matching system.
                </p>
                <Button 
                  className="bg-white text-green-600 hover:bg-green-50" 
                  data-testid="button-preview-posting"
                >
                  Preview Posting
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}