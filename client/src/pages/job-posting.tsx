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
  const [jobData, setJobData] = useState({});

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
        title: "Success",
        description: "Job posting created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs/employer"] });
      // Redirect to employer dashboard
      window.location.href = "/";
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create job posting. Please try again.",
        variant: "destructive",
      });
    },
  });

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

  if (user?.userRole !== "Employer") {
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-6 lg:p-8">
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
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Optimization Tip</span>
                      </div>
                      <p className="text-sm text-primary/80">
                        Consider mentioning structured workflow processes to attract candidates who thrive with clear expectations.
                      </p>
                    </div>
                    <div className="p-4 bg-success/10 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium text-success">Good Match</span>
                      </div>
                      <p className="text-sm text-success/80">
                        Data analysis roles align well with pattern recognition strengths.
                      </p>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" data-testid="button-analyze-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze Full Description
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
        </main>
    </div>
  );
}
