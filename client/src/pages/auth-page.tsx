import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Briefcase, Heart, Building2, Users, FileText, Upload, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const employerRegisterSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  companyName: z.string().min(2, "Company name is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  companySize: z.string().min(1, "Company size is required"),
  industry: z.string().min(1, "Industry is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ndAdultRegisterSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phone: z.string().optional(),
  guardianEmail: z.string().email("Valid guardian email required").optional().or(z.literal("")),
  accommodationNeeds: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const guardianRegisterSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  phone: z.string().min(10, "Valid phone number is required"),
  relationship: z.string().min(1, "Relationship is required"),
  ndAdultEmail: z.string().email("ND Adult email is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type EmployerRegisterForm = z.infer<typeof employerRegisterSchema>;
type NDAdultRegisterForm = z.infer<typeof ndAdultRegisterSchema>;
type GuardianRegisterForm = z.infer<typeof guardianRegisterSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [verificationDocuments, setVerificationDocuments] = useState<File[]>([]);
  
  // Redirect if already authenticated
  if (user) {
    setLocation("/");
    return null;
  }

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const employerRegisterForm = useForm<EmployerRegisterForm>({
    resolver: zodResolver(employerRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      jobTitle: "",
      phone: "",
      companySize: "",
      industry: "",
    },
  });

  const ndAdultRegisterForm = useForm<NDAdultRegisterForm>({
    resolver: zodResolver(ndAdultRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
      phone: "",
      guardianEmail: "",
      accommodationNeeds: "",
    },
  });

  const guardianRegisterForm = useForm<GuardianRegisterForm>({
    resolver: zodResolver(guardianRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      relationship: "",
      ndAdultEmail: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/login", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Login successful",
        description: "Welcome back to BrainBridge!",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const employerRegisterMutation = useMutation({
    mutationFn: async (data: Omit<EmployerRegisterForm, "confirmPassword">) => {
      const registerData = {
        ...data,
        userRole: "Employer"
      };
      const response = await apiRequest("POST", "/api/register", registerData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Registration successful", 
        description: "Your employer account is pending verification. You'll receive an email once approved.",
      });
      setLocation("/verification-status");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const ndAdultRegisterMutation = useMutation({
    mutationFn: async (data: Omit<NDAdultRegisterForm, "confirmPassword">) => {
      const registerData = {
        ...data,
        userRole: "ND_Adult"
      };
      const response = await apiRequest("POST", "/api/register", registerData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Registration successful",
        description: "Your account is pending verification. Please upload your identity documents.",
      });
      setLocation("/verification-status");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const guardianRegisterMutation = useMutation({
    mutationFn: async (data: Omit<GuardianRegisterForm, "confirmPassword">) => {
      const registerData = {
        ...data,
        userRole: "Guardian"
      };
      const response = await apiRequest("POST", "/api/register", registerData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Registration successful",
        description: "Your guardian account is pending verification.",
      });
      setLocation("/verification-status");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onLogin = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const onEmployerRegister = (data: EmployerRegisterForm) => {
    const { confirmPassword, ...registerData } = data;
    employerRegisterMutation.mutate(registerData);
  };

  const onNDAdultRegister = (data: NDAdultRegisterForm) => {
    const { confirmPassword, ...registerData } = data;
    ndAdultRegisterMutation.mutate(registerData);
  };

  const onGuardianRegister = (data: GuardianRegisterForm) => {
    const { confirmPassword, ...registerData } = data;
    guardianRegisterMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Auth forms */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">BrainBridge</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to BrainBridge</h1>
            <p className="text-gray-600">Connect neurodivergent talent with inclusive employers</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="employer">Employer</TabsTrigger>
              <TabsTrigger value="ndadult">Professional</TabsTrigger>
              <TabsTrigger value="guardian">Guardian</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>Welcome back! Please sign in to your account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        {...loginForm.register("email")}
                        data-testid="input-login-email"
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Your password"
                        {...loginForm.register("password")}
                        data-testid="input-login-password"
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                        Forgot Password?
                      </a>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      disabled={loginMutation.isPending}
                      data-testid="button-login-submit"
                    >
                      {loginMutation.isPending ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employer">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Employer Registration
                  </CardTitle>
                  <CardDescription>Join as an inclusive employer and connect with exceptional neurodivergent talent.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={employerRegisterForm.handleSubmit(onEmployerRegister)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          {...employerRegisterForm.register("firstName")}
                          data-testid="input-employer-firstName"
                        />
                        {employerRegisterForm.formState.errors.firstName && (
                          <p className="text-sm text-red-600">{employerRegisterForm.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          {...employerRegisterForm.register("lastName")}
                          data-testid="input-employer-lastName"
                        />
                        {employerRegisterForm.formState.errors.lastName && (
                          <p className="text-sm text-red-600">{employerRegisterForm.formState.errors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        {...employerRegisterForm.register("email")}
                        data-testid="input-employer-email"
                      />
                      {employerRegisterForm.formState.errors.email && (
                        <p className="text-sm text-red-600">{employerRegisterForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          placeholder="Company Inc."
                          {...employerRegisterForm.register("companyName")}
                          data-testid="input-employer-companyName"
                        />
                        {employerRegisterForm.formState.errors.companyName && (
                          <p className="text-sm text-red-600">{employerRegisterForm.formState.errors.companyName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Your Job Title</Label>
                        <Input
                          id="jobTitle"
                          placeholder="HR Manager"
                          {...employerRegisterForm.register("jobTitle")}
                          data-testid="input-employer-jobTitle"
                        />
                        {employerRegisterForm.formState.errors.jobTitle && (
                          <p className="text-sm text-red-600">{employerRegisterForm.formState.errors.jobTitle.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...employerRegisterForm.register("phone")}
                        data-testid="input-employer-phone"
                      />
                      {employerRegisterForm.formState.errors.phone && (
                        <p className="text-sm text-red-600">{employerRegisterForm.formState.errors.phone.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companySize">Company Size</Label>
                        <Select onValueChange={(value) => employerRegisterForm.setValue("companySize", value)}>
                          <SelectTrigger data-testid="select-employer-companySize">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-1000">201-1000 employees</SelectItem>
                            <SelectItem value="1000+">1000+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                        {employerRegisterForm.formState.errors.companySize && (
                          <p className="text-sm text-red-600">{employerRegisterForm.formState.errors.companySize.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select onValueChange={(value) => employerRegisterForm.setValue("industry", value)}>
                          <SelectTrigger data-testid="select-employer-industry">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {employerRegisterForm.formState.errors.industry && (
                          <p className="text-sm text-red-600">{employerRegisterForm.formState.errors.industry.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a password"
                          {...employerRegisterForm.register("password")}
                          data-testid="input-employer-password"
                        />
                        {employerRegisterForm.formState.errors.password && (
                          <p className="text-sm text-red-600">{employerRegisterForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm password"
                          {...employerRegisterForm.register("confirmPassword")}
                          data-testid="input-employer-confirmPassword"
                        />
                        {employerRegisterForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-red-600">{employerRegisterForm.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-900 mb-1">Verification Required</p>
                          <p className="text-blue-700">Your company will be verified before you can post jobs. Please have your business registration or incorporation documents ready for upload after registration.</p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      disabled={employerRegisterMutation.isPending}
                      data-testid="button-employer-submit"
                    >
                      {employerRegisterMutation.isPending ? "Creating account..." : "Register Company"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ndadult">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Professional Registration
                  </CardTitle>
                  <CardDescription>Join as a neurodivergent professional and discover your ideal career opportunities.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={ndAdultRegisterForm.handleSubmit(onNDAdultRegister)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="Jane"
                          {...ndAdultRegisterForm.register("firstName")}
                          data-testid="input-ndadult-firstName"
                        />
                        {ndAdultRegisterForm.formState.errors.firstName && (
                          <p className="text-sm text-red-600">{ndAdultRegisterForm.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Smith"
                          {...ndAdultRegisterForm.register("lastName")}
                          data-testid="input-ndadult-lastName"
                        />
                        {ndAdultRegisterForm.formState.errors.lastName && (
                          <p className="text-sm text-red-600">{ndAdultRegisterForm.formState.errors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jane@email.com"
                        {...ndAdultRegisterForm.register("email")}
                        data-testid="input-ndadult-email"
                      />
                      {ndAdultRegisterForm.formState.errors.email && (
                        <p className="text-sm text-red-600">{ndAdultRegisterForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          {...ndAdultRegisterForm.register("dateOfBirth")}
                          data-testid="input-ndadult-dateOfBirth"
                        />
                        {ndAdultRegisterForm.formState.errors.dateOfBirth && (
                          <p className="text-sm text-red-600">{ndAdultRegisterForm.formState.errors.dateOfBirth.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          {...ndAdultRegisterForm.register("phone")}
                          data-testid="input-ndadult-phone"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guardianEmail">Guardian Email (Optional)</Label>
                      <Input
                        id="guardianEmail"
                        type="email"
                        placeholder="guardian@email.com"
                        {...ndAdultRegisterForm.register("guardianEmail")}
                        data-testid="input-ndadult-guardianEmail"
                      />
                      <p className="text-sm text-gray-500">If you have a guardian who should be involved in your career journey</p>
                      {ndAdultRegisterForm.formState.errors.guardianEmail && (
                        <p className="text-sm text-red-600">{ndAdultRegisterForm.formState.errors.guardianEmail.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accommodationNeeds">Accommodation Needs (Optional)</Label>
                      <Textarea
                        id="accommodationNeeds"
                        placeholder="Describe any workplace accommodations that help you perform at your best..."
                        {...ndAdultRegisterForm.register("accommodationNeeds")}
                        data-testid="textarea-ndadult-accommodationNeeds"
                      />
                      <p className="text-sm text-gray-500">This helps us match you with supportive employers</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a password"
                          {...ndAdultRegisterForm.register("password")}
                          data-testid="input-ndadult-password"
                        />
                        {ndAdultRegisterForm.formState.errors.password && (
                          <p className="text-sm text-red-600">{ndAdultRegisterForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm password"
                          {...ndAdultRegisterForm.register("confirmPassword")}
                          data-testid="input-ndadult-confirmPassword"
                        />
                        {ndAdultRegisterForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-red-600">{ndAdultRegisterForm.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-green-900 mb-1">Identity Verification</p>
                          <p className="text-green-700">You'll need to upload identity verification documents after registration to access all platform features.</p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      disabled={ndAdultRegisterMutation.isPending}
                      data-testid="button-ndadult-submit"
                    >
                      {ndAdultRegisterMutation.isPending ? "Creating account..." : "Join as Professional"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guardian">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Guardian Registration
                  </CardTitle>
                  <CardDescription>Join as a guardian to support a neurodivergent professional's career journey.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={guardianRegisterForm.handleSubmit(onGuardianRegister)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          {...guardianRegisterForm.register("firstName")}
                          data-testid="input-guardian-firstName"
                        />
                        {guardianRegisterForm.formState.errors.firstName && (
                          <p className="text-sm text-red-600">{guardianRegisterForm.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Smith"
                          {...guardianRegisterForm.register("lastName")}
                          data-testid="input-guardian-lastName"
                        />
                        {guardianRegisterForm.formState.errors.lastName && (
                          <p className="text-sm text-red-600">{guardianRegisterForm.formState.errors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@email.com"
                        {...guardianRegisterForm.register("email")}
                        data-testid="input-guardian-email"
                      />
                      {guardianRegisterForm.formState.errors.email && (
                        <p className="text-sm text-red-600">{guardianRegisterForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          {...guardianRegisterForm.register("phone")}
                          data-testid="input-guardian-phone"
                        />
                        {guardianRegisterForm.formState.errors.phone && (
                          <p className="text-sm text-red-600">{guardianRegisterForm.formState.errors.phone.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="relationship">Relationship</Label>
                        <Select onValueChange={(value) => guardianRegisterForm.setValue("relationship", value)}>
                          <SelectTrigger data-testid="select-guardian-relationship">
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="sibling">Sibling</SelectItem>
                            <SelectItem value="legal-guardian">Legal Guardian</SelectItem>
                            <SelectItem value="advocate">Advocate</SelectItem>
                            <SelectItem value="support-worker">Support Worker</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {guardianRegisterForm.formState.errors.relationship && (
                          <p className="text-sm text-red-600">{guardianRegisterForm.formState.errors.relationship.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ndAdultEmail">ND Adult's Email</Label>
                      <Input
                        id="ndAdultEmail"
                        type="email"
                        placeholder="professional@email.com"
                        {...guardianRegisterForm.register("ndAdultEmail")}
                        data-testid="input-guardian-ndAdultEmail"
                      />
                      <p className="text-sm text-gray-500">Email of the neurodivergent professional you're supporting</p>
                      {guardianRegisterForm.formState.errors.ndAdultEmail && (
                        <p className="text-sm text-red-600">{guardianRegisterForm.formState.errors.ndAdultEmail.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a password"
                          {...guardianRegisterForm.register("password")}
                          data-testid="input-guardian-password"
                        />
                        {guardianRegisterForm.formState.errors.password && (
                          <p className="text-sm text-red-600">{guardianRegisterForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm password"
                          {...guardianRegisterForm.register("confirmPassword")}
                          data-testid="input-guardian-confirmPassword"
                        />
                        {guardianRegisterForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-red-600">{guardianRegisterForm.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-purple-900 mb-1">Guardian Verification</p>
                          <p className="text-purple-700">You'll need to verify your relationship and identity. The professional you're supporting must approve your guardian status.</p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      disabled={guardianRegisterMutation.isPending}
                      data-testid="button-guardian-submit"
                    >
                      {guardianRegisterMutation.isPending ? "Creating account..." : "Register as Guardian"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right side - Hero content */}
        <div className="hidden lg:block">
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-gray-900">
              Unlock Your Potential,<br />
              <span className="text-blue-600">Transform Workplaces</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-lg mx-auto">
              BrainBridge connects neurodivergent professionals with inclusive employers through AI-powered matching and comprehensive support.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Matching</h3>
                <p className="text-sm text-gray-600">Smart algorithms connect skills with opportunities</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Career Growth</h3>
                <p className="text-sm text-gray-600">Continuous learning and development programs</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Support Network</h3>
                <p className="text-sm text-gray-600">Mentorship and community support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}