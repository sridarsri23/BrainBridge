import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Brain, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { Link } from "wouter";

export default function Header() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50" data-testid="header-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3" data-testid="link-logo">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">BrainBridge</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" data-testid="nav-dashboard">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                  Dashboard
                </Button>
              </Link>
              {user?.userRole === "ND_Adult" && (
                <Button variant="ghost" className="text-muted-foreground hover:text-primary" data-testid="nav-jobs">
                  Jobs
                </Button>
              )}
              {user?.userRole === "Employer" && (
                <>
                  <Link href="/job-posting" data-testid="nav-post-job">
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                      Post Job
                    </Button>
                  </Link>
                  <Button variant="ghost" className="text-muted-foreground hover:text-primary" data-testid="nav-candidates">
                    Candidates
                  </Button>
                </>
              )}
              {(user?.userRole === "Admin" || user?.userRole === "Manager") && (
                <Link href="/admin" data-testid="nav-admin">
                  <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                    Admin
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3" data-testid="dropdown-user-menu">
                  <span className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-900 shadow-lg border border-border z-50">
                <DropdownMenuItem asChild data-testid="menu-profile">
                  <Link href="/profile" className="flex items-center cursor-pointer text-foreground hover:text-accent-foreground hover:bg-accent">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-settings" className="cursor-pointer text-foreground hover:text-accent-foreground hover:bg-accent">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => logoutMutation.mutate()}
                  data-testid="menu-logout"
                  className="cursor-pointer text-foreground hover:text-accent-foreground hover:bg-accent"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
