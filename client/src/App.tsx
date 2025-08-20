import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/enhanced-landing";
import NDAdultDashboard from "@/pages/nd-adult-dashboard";
import EmployerDashboard from "@/pages/employer-dashboard";
import ProfileManagement from "@/pages/profile-management";
import JobPosting from "@/pages/job-posting";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login-page";
import RegisterPage from "@/pages/register-page";
import VerificationStatus from "@/pages/verification-status";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading only for first 3 seconds to prevent infinite loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/verification-status" component={VerificationStatus} />
        </>
      ) : (
        <>
          <Route path="/" component={() => {
            // Route based on user role
            switch (user?.userRole) {
              case 'ND_Adult':
                return <NDAdultDashboard />;
              case 'Employer':
                return <EmployerDashboard />;
              case 'Admin':
              case 'Manager':
                return <AdminDashboard />;
              default:
                return <NDAdultDashboard />;
            }
          }} />
          <Route path="/profile" component={ProfileManagement} />
          <Route path="/job-posting" component={JobPosting} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/verification-status" component={VerificationStatus} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
