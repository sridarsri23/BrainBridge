import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Upload, 
  FileText, 
  Building2, 
  Brain, 
  Heart,
  ArrowLeft,
  Mail,
  Phone
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function VerificationStatus() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to view your verification status.</p>
            <Button asChild>
              <Link href="/auth">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getVerificationSteps = () => {
    switch (user.userRole) {
      case "Employer":
        return [
          { id: 1, title: "Account Created", description: "Your employer account has been created", status: "completed" },
          { id: 2, title: "Document Upload", description: "Upload business registration documents", status: "pending" },
          { id: 3, title: "Company Verification", description: "Our team will verify your company details", status: "pending" },
          { id: 4, title: "Profile Setup", description: "Complete your company profile", status: "pending" },
          { id: 5, title: "Ready to Post Jobs", description: "Start posting job opportunities", status: "pending" }
        ];
      case "ND_Adult":
        return [
          { id: 1, title: "Account Created", description: "Your professional account has been created", status: "completed" },
          { id: 2, title: "Identity Verification", description: "Upload identity verification documents", status: "pending" },
          { id: 3, title: "Profile Assessment", description: "Complete your cognitive and skills profile", status: "pending" },
          { id: 4, title: "Skills Certification", description: "Take optional skill assessments", status: "pending" },
          { id: 5, title: "Ready for Matching", description: "Start receiving job matches", status: "pending" }
        ];
      case "Guardian":
        return [
          { id: 1, title: "Account Created", description: "Your guardian account has been created", status: "completed" },
          { id: 2, title: "Relationship Verification", description: "Verify your relationship with the ND adult", status: "pending" },
          { id: 3, title: "ND Adult Approval", description: "The professional must approve your guardian status", status: "pending" },
          { id: 4, title: "Background Check", description: "Complete background verification process", status: "pending" },
          { id: 5, title: "Guardian Access", description: "Access support and monitoring features", status: "pending" }
        ];
      default:
        return [];
    }
  };

  const steps = getVerificationSteps();
  const completedSteps = steps.filter(step => step.status === "completed").length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const getRoleIcon = () => {
    switch (user.userRole) {
      case "Employer":
        return <Building2 className="w-8 h-8 text-blue-600" />;
      case "ND_Adult":
        return <Brain className="w-8 h-8 text-purple-600" />;
      case "Guardian":
        return <Heart className="w-8 h-8 text-green-600" />;
      default:
        return <CheckCircle className="w-8 h-8 text-gray-600" />;
    }
  };

  const getRoleColor = () => {
    switch (user.userRole) {
      case "Employer":
        return "blue";
      case "ND_Adult":
        return "purple";
      case "Guardian":
        return "green";
      default:
        return "gray";
    }
  };

  const roleColor = getRoleColor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                {getRoleIcon()}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Verification Status</h1>
                  <p className="text-gray-600">
                    Welcome, {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
            </div>
            <Badge className={`bg-${roleColor}-100 text-${roleColor}-700`}>
              {user.userRole === "ND_Adult" ? "Professional" : user.userRole}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Verification Progress
            </CardTitle>
            <CardDescription>
              Complete the steps below to fully activate your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {completedSteps} of {steps.length} steps completed
                </span>
                <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Verification Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <Card key={step.id} className={`transition-all duration-200 ${
              step.status === "completed" 
                ? "border-green-200 bg-green-50" 
                : step.status === "pending" && index === completedSteps
                ? `border-${roleColor}-200 bg-${roleColor}-50`
                : "border-gray-200"
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    step.status === "completed"
                      ? "bg-green-500 text-white"
                      : step.status === "pending" && index === completedSteps
                      ? `bg-${roleColor}-500 text-white`
                      : "bg-gray-200 text-gray-500"
                  }`}>
                    {step.status === "completed" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      step.status === "completed" 
                        ? "text-green-900" 
                        : step.status === "pending" && index === completedSteps
                        ? `text-${roleColor}-900`
                        : "text-gray-900"
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${
                      step.status === "completed" 
                        ? "text-green-700" 
                        : step.status === "pending" && index === completedSteps
                        ? `text-${roleColor}-700`
                        : "text-gray-600"
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  {step.status === "pending" && index === completedSteps && (
                    <Button size="sm" className={`bg-${roleColor}-600 hover:bg-${roleColor}-700`}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Documents
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Document Review</h4>
                <p className="text-sm text-gray-600">
                  Our verification team will review your documents within 1-2 business days.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Email Updates</h4>
                <p className="text-sm text-gray-600">
                  You'll receive email notifications about your verification status updates.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Support Available</h4>
                <p className="text-sm text-gray-600">
                  Need help? Contact our support team at support@brainbridge.com or call (555) 123-4567.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status Alert */}
        <Card className="mt-8 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-900 mb-1">Account Pending Verification</h4>
                <p className="text-sm text-orange-700">
                  Your account has limited access until verification is complete. Once verified, you'll have full access to all platform features including 
                  {user.userRole === "Employer" ? " job posting, candidate browsing, and premium analytics." : 
                   user.userRole === "ND_Adult" ? " job matching, certification programs, and career support resources." :
                   " guardian dashboard, progress monitoring, and support coordination tools."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}