import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, User, Calendar } from "lucide-react";

interface VerificationItem {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  userRole: string;
  createdAt: string;
  isActive: boolean;
}

interface VerificationQueueProps {
  verifications: VerificationItem[];
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  isLoading?: boolean;
}

export default function VerificationQueue({ 
  verifications, 
  onApprove, 
  onReject, 
  isLoading = false 
}: VerificationQueueProps) {
  if (verifications.length === 0) {
    return (
      <Card data-testid="card-no-verifications">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No pending verifications</h3>
            <p className="text-muted-foreground">All verification requests have been processed.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-verification-queue">
      <CardHeader>
        <CardTitle>Pending Verifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {verifications.map((verification) => (
            <div 
              key={verification.id} 
              className="flex items-center justify-between p-4 bg-accent rounded-lg"
              data-testid={`verification-item-${verification.id}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                  {verification.userRole === "Employer" ? (
                    <Building className="w-5 h-5 text-warning" />
                  ) : (
                    <User className="w-5 h-5 text-warning" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium" data-testid={`verification-name-${verification.id}`}>
                    {verification.firstName && verification.lastName 
                      ? `${verification.firstName} ${verification.lastName}`
                      : verification.email
                    }
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {verification.userRole}
                    </Badge>
                    <span>•</span>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(verification.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => onApprove(verification.id)}
                  disabled={isLoading}
                  className="bg-success hover:bg-success/90"
                  data-testid={`button-approve-${verification.id}`}
                >
                  {isLoading ? "..." : "Approve"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onReject(verification.id)}
                  disabled={isLoading}
                  data-testid={`button-reject-${verification.id}`}
                >
                  {isLoading ? "..." : "Reject"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
