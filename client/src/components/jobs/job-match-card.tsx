import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Bookmark, Heart } from "lucide-react";

interface JobMatchCardProps {
  match: {
    matchId: string;
    matchScore: number;
    matchReasoning: string;
    job: {
      jobId: string;
      jobTitle: string;
      employmentType: string;
      location: string;
      jobDescription: string;
      requiredSkills?: string;
    };
    employer: {
      companyName: string;
    };
  };
}

export default function JobMatchCard({ match }: JobMatchCardProps) {
  const { toast } = useToast();

  const applyJobMutation = useMutation({
    mutationFn: async () => {
      // This would integrate with an application system
      return await apiRequest("POST", `/api/jobs/${match.job?.jobId}/apply`, {});
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveJobMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/jobs/${match.job?.jobId}/save`, {});
    },
    onSuccess: () => {
      toast({
        title: "Job Saved",
        description: "Job has been saved to your favorites.",
      });
    },
  });

  if (!match.job) {
    return null;
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-success text-success-foreground";
    if (score >= 70) return "bg-warning text-warning-foreground";
    return "bg-secondary text-secondary-foreground";
  };

  const skills = match.job.requiredSkills?.split(",").map(skill => skill.trim()) || [];

  return (
    <Card className="card-hover" data-testid={`job-match-${match.matchId}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground" data-testid="job-title">
              {match.job.jobTitle}
            </h3>
            <p className="text-muted-foreground" data-testid="company-name">
              {match.employer?.companyName || "Company Name"}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <span data-testid="job-location">
                <MapPin className="w-4 h-4 mr-1 inline" />
                {match.job.location}
              </span>
              <span data-testid="job-type">
                <Clock className="w-4 h-4 mr-1 inline" />
                {match.job.employmentType}
              </span>
              <span data-testid="job-salary">
                <DollarSign className="w-4 h-4 mr-1 inline" />
                Competitive
              </span>
            </div>
          </div>
          <div className="text-right">
            <Badge className={getMatchScoreColor(match.matchScore)} data-testid="match-score">
              {Math.round(match.matchScore)}% Match
            </Badge>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4" data-testid="match-reasoning">
          {match.matchReasoning}
        </p>
        
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4" data-testid="job-skills">
            {skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{skills.length - 4} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex space-x-3">
          <Button 
            className="flex-1"
            onClick={() => applyJobMutation.mutate()}
            disabled={applyJobMutation.isPending}
            data-testid="button-apply"
          >
            {applyJobMutation.isPending ? "Applying..." : "Apply Now"}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => saveJobMutation.mutate()}
            disabled={saveJobMutation.isPending}
            data-testid="button-save"
          >
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
