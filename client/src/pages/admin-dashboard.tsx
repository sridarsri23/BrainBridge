import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/navigation/header";
import StatsCard from "@/components/dashboard/stats-card";
import VerificationQueue from "@/components/admin/verification-queue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Briefcase, 
  Handshake, 
  Tag, 
  AlertTriangle,
  UserPlus,
  Download,
  Settings,
  Activity,
  Database,
  Zap,
  Mail,
  TrendingUp,
  Archive
} from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
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

  const { data: auditLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["/api/admin/audit-logs"],
    enabled: isAuthenticated && (user?.userRole === "Admin" || user?.userRole === "Manager"),
  });

  const { data: pendingVerifications = [] } = useQuery({
    queryKey: ["/api/admin/pending-verifications"],
    enabled: isAuthenticated && (user?.userRole === "Admin" || user?.userRole === "Manager"),
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      return await apiRequest("PUT", `/api/admin/users/${userId}/status`, { isActive });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User status updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-verifications"] });
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
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated || isLoading) {
    return null;
  }

  if (user?.userRole !== "Admin" && user?.userRole !== "Manager") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
              <h1 className="text-xl font-bold text-foreground mb-2">Access Denied</h1>
              <p className="text-muted-foreground mb-4">
                You don't have permission to access the admin dashboard.
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground" data-testid="text-admin-title">
              Admin Dashboard
            </h1>
            <div className="flex space-x-3">
              <Button variant="outline" data-testid="button-export-data">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button data-testid="button-system-settings">
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Users" 
              value="2,847" 
              icon={Users}
              color="primary"
              trend="+12% this month"
              data-testid="stats-card-users"
            />
            <StatsCard 
              title="Active Jobs" 
              value="156" 
              icon={Briefcase}
              color="secondary"
              trend="+8% this week"
              data-testid="stats-card-jobs"
            />
            <StatsCard 
              title="Successful Matches" 
              value="493" 
              icon={Handshake}
              color="success"
              trend="+15% this month"
              data-testid="stats-card-matches"
            />
            <StatsCard 
              title="Certified Companies" 
              value="89" 
              icon={Tag}
              color="warning"
              trend="+22% this quarter"
              data-testid="stats-card-certified"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Recent System Activity</h2>
                <Button variant="ghost" data-testid="button-view-all-logs">View All Logs</Button>
              </div>

              <Card data-testid="card-activity-log">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Activity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {logsLoading ? (
                          Array.from({ length: 3 }).map((_, i) => (
                            <tr key={i}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-muted rounded animate-pulse" />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-muted rounded animate-pulse" />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-muted rounded animate-pulse" />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-muted rounded animate-pulse" />
                              </td>
                            </tr>
                          ))
                        ) : Array.isArray(auditLogs) && auditLogs.length > 0 ? (
                          auditLogs.slice(0, 5).map((log: any) => (
                            <tr key={log.logId} className="hover:bg-muted/50" data-testid={`log-row-${log.logId}`}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {log.actionType === 'USER_REGISTRATION' && <UserPlus className="w-4 h-4 text-primary mr-3" />}
                                  {log.actionType === 'JOB_POST_CREATE' && <Briefcase className="w-4 h-4 text-secondary mr-3" />}
                                  {log.actionType === 'USER_APPROVED' && <Tag className="w-4 h-4 text-success mr-3" />}
                                  {log.actionType === 'SYSTEM_ALERT' && <AlertTriangle className="w-4 h-4 text-warning mr-3" />}
                                  <span className="text-sm text-foreground">{log.actionType}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {log.userId || 'system'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {new Date(log.timestamp).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className="bg-success/10 text-success">
                                  Completed
                                </Badge>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                              No audit logs available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Verifications */}
              <VerificationQueue 
                verifications={Array.isArray(pendingVerifications) ? pendingVerifications : []}
                onApprove={(userId) => updateUserStatusMutation.mutate({ userId, isActive: true })}
                onReject={(userId) => updateUserStatusMutation.mutate({ userId, isActive: false })}
                isLoading={updateUserStatusMutation.isPending}
              />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* System Health */}
              <Card data-testid="card-system-health">
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-success rounded-full" />
                        <span className="text-sm">API Status</span>
                      </div>
                      <span className="text-sm text-success">Operational</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-success rounded-full" />
                        <span className="text-sm">Database</span>
                      </div>
                      <span className="text-sm text-success">Healthy</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-warning rounded-full" />
                        <span className="text-sm">AI Matching</span>
                      </div>
                      <span className="text-sm text-warning">Degraded</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-success rounded-full" />
                        <span className="text-sm">Email Service</span>
                      </div>
                      <span className="text-sm text-success">Operational</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card data-testid="card-quick-actions">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <button 
                      className="w-full text-left p-3 hover:bg-accent rounded-lg transition-colors"
                      data-testid="button-send-update"
                    >
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm font-medium">Send Platform Update</span>
                      </div>
                    </button>
                    <button 
                      className="w-full text-left p-3 hover:bg-accent rounded-lg transition-colors"
                      data-testid="button-generate-reports"
                    >
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">Generate Reports</span>
                      </div>
                    </button>
                    <button 
                      className="w-full text-left p-3 hover:bg-accent rounded-lg transition-colors"
                      data-testid="button-manage-traits"
                    >
                      <div className="flex items-center space-x-3">
                        <Database className="w-4 h-4" />
                        <span className="text-sm font-medium">Manage Traits/Strengths</span>
                      </div>
                    </button>
                    <button 
                      className="w-full text-left p-3 hover:bg-accent rounded-lg transition-colors"
                      data-testid="button-system-backup"
                    >
                      <div className="flex items-center space-x-3">
                        <Archive className="w-4 h-4" />
                        <span className="text-sm font-medium">System Backup</span>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Stats */}
              <Card className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white" data-testid="card-platform-stats">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Platform Growth</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monthly Growth</span>
                      <span>+18%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Retention Rate</span>
                      <span>92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Match Success</span>
                      <span>87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
    </div>
  );
}
