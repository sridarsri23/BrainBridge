import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";

// Common registration schema
const registrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  phone: z.string().min(1, "Phone number is required"),
  userRole: z.enum(["ND_ADULT", "EMPLOYER", "GUARDIAN"] as const, {
    required_error: "Please select a role",
  }),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { registerMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      userRole: undefined,
    },
  });

  const onSubmit = async (data: RegistrationForm) => {
    try {
      await registerMutation.mutateAsync(data);
      setLocation("/");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          </div>
          <CardDescription>
            Join BrainBridge and unlock your potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  {...form.register("firstName")}
                  data-testid="input-firstName"
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-600" data-testid="error-firstName">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  {...form.register("lastName")}
                  data-testid="input-lastName"
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-600" data-testid="error-lastName">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...form.register("email")}
                data-testid="input-email"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600" data-testid="error-email">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  {...form.register("password")}
                  data-testid="input-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-600" data-testid="error-password">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                {...form.register("phone")}
                data-testid="input-phone"
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-600" data-testid="error-phone">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userRole">I am a</Label>
              <Controller
                name="userRole"
                control={form.control}
                render={({ field }) => (
                  <Select 
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    data-testid="select-userRole"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999] bg-white shadow-lg border">
                      {/* Fixed values - cache busting v2 */}
                      <SelectItem value="ND_ADULT" data-testid="option-nd-adult">
                        Neurodivergent Professional
                      </SelectItem>
                      <SelectItem value="EMPLOYER" data-testid="option-employer">
                        Employer/Recruiter  
                      </SelectItem>
                      <SelectItem value="GUARDIAN" data-testid="option-guardian">
                        Parent/Guardian
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.userRole && (
                <p className="text-sm text-red-600" data-testid="error-userRole">
                  {form.formState.errors.userRole.message}
                </p>
              )}
            </div>

            {registerMutation.error && (
              <Alert variant="destructive" data-testid="alert-register-error">
                <AlertDescription>
                  {registerMutation.error?.message || "Registration failed. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
              data-testid="button-register"
            >
              {registerMutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
                data-testid="link-login"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}