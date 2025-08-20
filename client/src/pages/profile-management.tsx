import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";
import { User, Building2, Heart, Save, CheckCircle, Upload, ArrowLeft } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ObjectUploader } from "@/components/ObjectUploader";

// Basic information schema
const basicInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
});

// ND Adult profile schema
const ndAdultProfileSchema = z.object({
  dateOfBirth: z.string().optional(),
  guardianEmail: z.string().email().optional().or(z.literal("")),
  accommodationNeeds: z.string().optional(),
  // New ND Professional fields
  identityVerificationDoc: z.string().optional(),
  hasNeuroConditionRecognized: z.boolean().optional(),
  recognizedNeuroCondition: z.string().optional(),
  ndConditionProofDocs: z.array(z.string()).optional(),
  medicalConditions: z.string().optional(),
  publicProfileConsent: z.boolean().optional(),
  preferredWorkEnvironment: z.string().optional(),
  preferredWorkSetup: z.string().optional(),
  notes: z.string().optional(),
});

// Employer profile schema
const employerProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  companySize: z.string().optional(),
  industry: z.string().optional(),
  companyWebsite: z.string().optional(),

  companyEmail: z.string().email().optional().or(z.literal("")),
  companyPhone: z.string().optional(),
  isDeiCompliant: z.string().optional(),
  deiComplianceProvider: z.string().optional(),
  privacyAgreed: z.boolean().refine(val => val === true, {
    message: "You must agree to the privacy policy",
  }),
});

// Guardian profile schema
const guardianProfileSchema = z.object({
  relationship: z.string().min(1, "Relationship is required"),
  ndAdultEmail: z.string().email("Please enter a valid email"),
});

type BasicInfo = z.infer<typeof basicInfoSchema>;
type NDAdultProfile = z.infer<typeof ndAdultProfileSchema>;
type EmployerProfile = z.infer<typeof employerProfileSchema>;
type GuardianProfile = z.infer<typeof guardianProfileSchema>;

export default function ProfileManagement() {
  const { user, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState("basic");
  const [, setLocation] = useLocation();

  // Fetch user profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/profiles/"],
    enabled: !!user,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/profiles/", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles/"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  // ND Adult form
  const ndAdultForm = useForm<NDAdultProfile>({
    resolver: zodResolver(ndAdultProfileSchema),
    defaultValues: {
      dateOfBirth: "",
      guardianEmail: "",
      accommodationNeeds: "",
      // New ND Professional fields
      identityVerificationDoc: "",
      hasNeuroConditionRecognized: false,
      recognizedNeuroCondition: "",
      ndConditionProofDocs: [],
      medicalConditions: "",
      publicProfileConsent: false,
      preferredWorkEnvironment: "",
      preferredWorkSetup: "",
      notes: "",
    },
  });

  // Employer form
  const employerForm = useForm<EmployerProfile>({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      companySize: "",
      industry: "",
    },
  });

  // Guardian form
  const guardianForm = useForm<GuardianProfile>({
    resolver: zodResolver(guardianProfileSchema),
    defaultValues: {
      relationship: "",
      ndAdultEmail: "",
    },
  });

  // Basic info form
  const basicInfoForm = useForm<BasicInfo>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  // Update form defaults when profile data loads
  useEffect(() => {
    if (profile && user) {
      // Update basic info form with user data
      basicInfoForm.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: (profile as any).phone || "",
      });

      if (user.userRole === "ND_Adult") {
        ndAdultForm.reset({
          dateOfBirth: (profile as any).dateOfBirth || "",
          guardianEmail: (profile as any).guardianEmail || "",
          accommodationNeeds: (profile as any).accommodationNeeds || "",
          // New ND Professional fields
          identityVerificationDoc: (profile as any).identityVerificationDoc || "",
          hasNeuroConditionRecognized: (profile as any).hasNeuroConditionRecognized || false,
          recognizedNeuroCondition: (profile as any).recognizedNeuroCondition || "",
          ndConditionProofDocs: (profile as any).ndConditionProofDocs || [],
          medicalConditions: (profile as any).medicalConditions || "",
          publicProfileConsent: (profile as any).publicProfileConsent || false,
          preferredWorkEnvironment: (profile as any).preferredWorkEnvironment || "",
          preferredWorkSetup: (profile as any).preferredWorkSetup || "",
          notes: (profile as any).notes || "",
        });
      } else if (user.userRole === "Employer") {
        employerForm.reset({
          companyName: (profile as any).companyName || "",
          jobTitle: (profile as any).jobTitle || "",
          companySize: (profile as any).companySize || "",
          industry: (profile as any).industry || "",
        });
      } else if (user.userRole === "Guardian") {
        guardianForm.reset({
          relationship: (profile as any).relationship || "",
          ndAdultEmail: (profile as any).ndAdultEmail || "",
        });
      }
    }
  }, [profile, user, basicInfoForm, ndAdultForm, employerForm, guardianForm]);

  const onSubmitProfile = async (data: any) => {
    try {
      await updateProfileMutation.mutateAsync(data);
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Please log in to access your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <div className="profile-page-content">
        <div className="profile-page-header">
          <div className="profile-back-button-container">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation("/")}
              className="profile-back-button"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="profile-page-title" data-testid="text-page-title">
            Profile Management
          </h1>
          <p className="profile-page-description" data-testid="text-page-description">
            Complete your profile to get the most out of BrainBridge
          </p>
        </div>

        <Card className="profile-main-card">
          <CardHeader className="profile-card-header">
            <CardTitle className="profile-card-title">Complete Profile</CardTitle>
            <CardDescription className="profile-card-description">
              Update all your information in one place
            </CardDescription>
          </CardHeader>
          <CardContent className="profile-card-content">
            {/* Basic Information Section - Editable */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Basic Information</h3>
              <form onSubmit={basicInfoForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      {...basicInfoForm.register("firstName")}
                      data-testid="input-firstName"
                    />
                    {basicInfoForm.formState.errors.firstName && (
                      <p className="text-sm text-red-600">
                        {basicInfoForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      {...basicInfoForm.register("lastName")}
                      data-testid="input-lastName"
                    />
                    {basicInfoForm.formState.errors.lastName && (
                      <p className="text-sm text-red-600">
                        {basicInfoForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...basicInfoForm.register("email")}
                      data-testid="input-email"
                    />
                    {basicInfoForm.formState.errors.email && (
                      <p className="text-sm text-red-600">
                        {basicInfoForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      {...basicInfoForm.register("phone")}
                      data-testid="input-phone"
                    />
                  </div>
                </div>

                {updateProfileMutation.error && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {updateProfileMutation.error?.message || "Profile update failed. Please try again."}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-save-basic"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Basic Info"}
                </Button>
              </form>
            </div>

            {/* Role-Specific Information */}
            {user.userRole === "ND_Adult" && (
              <Card>
                <CardHeader>
                  <CardTitle>Professional Profile</CardTitle>
                  <CardDescription>
                    Tell us about your background and accommodation needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={ndAdultForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        {...ndAdultForm.register("dateOfBirth")}
                        data-testid="input-dateOfBirth"
                      />
                    </div>

                    <div>
                      <Label htmlFor="guardianEmail">Guardian Email (Optional)</Label>
                      <Input
                        id="guardianEmail"
                        type="email"
                        placeholder="Guardian's email address"
                        {...ndAdultForm.register("guardianEmail")}
                        data-testid="input-guardianEmail"
                      />
                    </div>

                    <div>
                      <Label htmlFor="accommodationNeeds">Accommodation Needs</Label>
                      <Textarea
                        id="accommodationNeeds"
                        placeholder="Describe any workplace accommodations that would help you succeed..."
                        {...ndAdultForm.register("accommodationNeeds")}
                        data-testid="textarea-accommodationNeeds"
                      />
                    </div>

                    {/* Identity Verification */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Identity & Documentation</h3>
                      
                      <div>
                        <Label>Identity Verification Document</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload a government-issued ID or official document for identity verification
                        </p>
                        <ObjectUploader
                          maxNumberOfFiles={1}
                          maxFileSize={10485760}
                          onGetUploadParameters={async () => {
                            const response = await apiRequest("POST", "/api/objects/upload");
                            const data = await response.json();
                            return { method: "PUT" as const, url: data.uploadURL };
                          }}
                          onComplete={(result) => {
                            if (result.successful && result.successful.length > 0) {
                              const uploadedFile = result.successful[0];
                              // Use the upload URL directly for now - the backend will handle normalization
                              ndAdultForm.setValue("identityVerificationDoc", (uploadedFile as any).uploadURL || "");
                            }
                          }}
                          buttonClassName="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Identity Document
                        </ObjectUploader>
                        {ndAdultForm.watch("identityVerificationDoc") && (
                          <p className="text-sm text-green-600 mt-2">✓ Document uploaded successfully</p>
                        )}
                      </div>
                    </div>

                    {/* Neuro Condition Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Neurodivergent Condition Information</h3>
                      
                      <div>
                        <Label>Already have a recognized neuro condition?</Label>
                        <div className="flex items-center space-x-6 mt-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value="true"
                              {...ndAdultForm.register("hasNeuroConditionRecognized")}
                              className="mr-2"
                              data-testid="radio-hasNeuroCondition-yes"
                            />
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value="false"
                              {...ndAdultForm.register("hasNeuroConditionRecognized")}
                              className="mr-2"
                              data-testid="radio-hasNeuroCondition-no"
                            />
                            No
                          </label>
                        </div>
                      </div>

                      {ndAdultForm.watch("hasNeuroConditionRecognized") && (
                        <div>
                          <Label htmlFor="recognizedNeuroCondition">Select your recognized condition</Label>
                          <Select
                            onValueChange={(value) => ndAdultForm.setValue("recognizedNeuroCondition", value)}
                            value={ndAdultForm.watch("recognizedNeuroCondition")}
                            data-testid="select-recognizedNeuroCondition"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Autism Spectrum Disorder (ASD)">Autism Spectrum Disorder (ASD)</SelectItem>
                              <SelectItem value="Attention-Deficit/Hyperactivity Disorder (ADHD)">Attention-Deficit/Hyperactivity Disorder (ADHD)</SelectItem>
                              <SelectItem value="Dyspraxia">Dyspraxia</SelectItem>
                              <SelectItem value="Dyscalculia">Dyscalculia</SelectItem>
                              <SelectItem value="Tourette Syndrome">Tourette Syndrome</SelectItem>
                              <SelectItem value="others">Others</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label>ND Condition Proof Documents (Up to 5)</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload official documentation supporting your neurodivergent condition
                        </p>
                        <ObjectUploader
                          maxNumberOfFiles={5}
                          maxFileSize={10485760}
                          onGetUploadParameters={async () => {
                            const response = await apiRequest("POST", "/api/objects/upload");
                            const data = await response.json();
                            return { method: "PUT" as const, url: data.uploadURL };
                          }}
                          onComplete={(result) => {
                            if (result.successful && result.successful.length > 0) {
                              const uploadedFiles = result.successful.map((file: any) => file.uploadURL || "");
                              const currentDocs = ndAdultForm.watch("ndConditionProofDocs") || [];
                              ndAdultForm.setValue("ndConditionProofDocs", [...currentDocs, ...uploadedFiles]);
                            }
                          }}
                          buttonClassName="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Proof Documents
                        </ObjectUploader>
                        {ndAdultForm.watch("ndConditionProofDocs") && ndAdultForm.watch("ndConditionProofDocs")!.length > 0 && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {ndAdultForm.watch("ndConditionProofDocs")!.length} document(s) uploaded
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Medical Conditions */}
                    <div>
                      <Label htmlFor="medicalConditions">Any Medical Conditions?</Label>
                      <Textarea
                        id="medicalConditions"
                        placeholder="Describe any relevant medical conditions or health considerations..."
                        {...ndAdultForm.register("medicalConditions")}
                        data-testid="textarea-medicalConditions"
                      />
                    </div>

                    {/* Work Preferences */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Work Preferences</h3>
                      
                      <div>
                        <Label htmlFor="preferredWorkEnvironment">Preferred Work Environment</Label>
                        <Textarea
                          id="preferredWorkEnvironment"
                          placeholder="Describe your ideal work environment (e.g., quiet space, flexible hours, specific lighting...)..."
                          {...ndAdultForm.register("preferredWorkEnvironment")}
                          data-testid="textarea-preferredWorkEnvironment"
                        />
                      </div>

                      <div>
                        <Label htmlFor="preferredWorkSetup">Preferred Work Setup</Label>
                        <Select
                          onValueChange={(value) => ndAdultForm.setValue("preferredWorkSetup", value)}
                          value={ndAdultForm.watch("preferredWorkSetup")}
                          data-testid="select-preferredWorkSetup"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your preferred work setup" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="On-Site">On-Site</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                            <SelectItem value="Remote">Remote</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Privacy and Additional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Privacy & Additional Information</h3>
                      
                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id="publicProfileConsent"
                          {...ndAdultForm.register("publicProfileConsent")}
                          className="mt-1"
                          data-testid="checkbox-publicProfileConsent"
                        />
                        <Label htmlFor="publicProfileConsent" className="text-sm leading-relaxed">
                          I consent to making my profile publicly visible to potential employers (your personal information will remain private)
                        </Label>
                      </div>

                      <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Any additional information you'd like to share with potential employers..."
                          {...ndAdultForm.register("notes")}
                          data-testid="textarea-notes"
                        />
                      </div>
                    </div>

                    {updateProfileMutation.error && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {updateProfileMutation.error?.message || "Profile update failed. Please try again."}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      data-testid="button-save-profile"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {user.userRole === "Employer" && (
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>
                    Tell us about your company and role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={employerForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                    {/* Company Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Basic Company Details</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companyName">Company Name*</Label>
                          <Input
                            id="companyName"
                            placeholder="Enter your company name"
                            {...employerForm.register("companyName")}
                            data-testid="input-companyName"
                          />
                          {employerForm.formState.errors.companyName && (
                            <p className="text-sm text-red-600">
                              {employerForm.formState.errors.companyName.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="companyWebsite">Company Website</Label>
                          <Input
                            id="companyWebsite"
                            type="url"
                            placeholder="https://www.company.com"
                            {...employerForm.register("companyWebsite")}
                            data-testid="input-companyWebsite"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companySize">Company Size</Label>
                          <Select
                            onValueChange={(value) => employerForm.setValue("companySize", value)}
                            value={employerForm.watch("companySize")}
                            data-testid="select-companySize"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-1000">201-1000 employees</SelectItem>
                              <SelectItem value="1000+">1000+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <Select
                            onValueChange={(value) => employerForm.setValue("industry", value)}
                            value={employerForm.watch("industry")}
                            data-testid="select-industry"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Technology">Technology</SelectItem>
                              <SelectItem value="Healthcare">Healthcare</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="Education">Education</SelectItem>
                              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="Retail">Retail</SelectItem>
                              <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Contact Information</h3>
                      
                      <div>
                        <Label htmlFor="jobTitle">Your Job Title</Label>
                        <Input
                          id="jobTitle"
                          placeholder="Enter your job title"
                          {...employerForm.register("jobTitle")}
                          data-testid="input-jobTitle"
                        />
                        {employerForm.formState.errors.jobTitle && (
                          <p className="text-sm text-red-600">
                            {employerForm.formState.errors.jobTitle.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companyEmail">Company Email</Label>
                          <Input
                            id="companyEmail"
                            type="email"
                            placeholder="contact@company.com"
                            {...employerForm.register("companyEmail")}
                            data-testid="input-companyEmail"
                          />
                        </div>

                        <div>
                          <Label htmlFor="companyPhone">Company Phone</Label>
                          <Input
                            id="companyPhone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            {...employerForm.register("companyPhone")}
                            data-testid="input-companyPhone"
                          />
                        </div>
                      </div>
                    </div>

                    {/* DEI Compliance */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Diversity, Equity & Inclusion</h3>
                      
                      <div>
                        <Label>Are you already DEI Compliant?</Label>
                        <div className="flex items-center space-x-6 mt-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value="true"
                              {...employerForm.register("isDeiCompliant")}
                              className="mr-2"
                              data-testid="radio-deiCompliant-yes"
                            />
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value="false"
                              {...employerForm.register("isDeiCompliant")}
                              className="mr-2"
                              data-testid="radio-deiCompliant-no"
                            />
                            No
                          </label>
                        </div>
                      </div>

                      {employerForm.watch("isDeiCompliant") === "true" && (
                        <div>
                          <Label htmlFor="deiComplianceProvider">DEI Compliance Provider</Label>
                          <Select
                            onValueChange={(value) => employerForm.setValue("deiComplianceProvider", value)}
                            value={employerForm.watch("deiComplianceProvider")}
                            data-testid="select-deiComplianceProvider"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your DEI provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IBCCES">IBCCES</SelectItem>
                              <SelectItem value="Neuroinclusion Lab">Neuroinclusion Lab</SelectItem>
                              <SelectItem value="NeuroInclusion Innovators">NeuroInclusion Innovators</SelectItem>
                              <SelectItem value="Cognassist">Cognassist</SelectItem>
                              <SelectItem value="Neurodiversity Hub">Neurodiversity Hub</SelectItem>
                              <SelectItem value="VT-HEC / La Verne Programs">VT-HEC / La Verne Programs</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* Company Verification */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Company Verification</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload up to 5 company verification documents (business registration, certificates, etc.)
                      </p>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          className="hidden"
                          id="companyDocs"
                          data-testid="input-companyDocs"
                        />
                        <label htmlFor="companyDocs" className="cursor-pointer">
                          <div className="text-gray-500">
                            <Upload className="h-8 w-8 mx-auto mb-2" />
                            <p>Click to upload documents or drag and drop</p>
                            <p className="text-xs">PDF, DOC, DOCX, JPG, PNG up to 10MB each</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Privacy Agreement */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id="privacyAgreed"
                          {...employerForm.register("privacyAgreed")}
                          className="mt-1"
                          data-testid="checkbox-privacyAgreed"
                        />
                        <Label htmlFor="privacyAgreed" className="text-sm leading-relaxed">
                          I agree to the privacy policy and terms of service, and consent to the processing of my company's information for job matching purposes.
                        </Label>
                      </div>
                      {employerForm.formState.errors.privacyAgreed && (
                        <p className="text-sm text-red-600">
                          {employerForm.formState.errors.privacyAgreed.message}
                        </p>
                      )}
                    </div>

                    {updateProfileMutation.error && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {updateProfileMutation.error?.message || "Profile update failed. Please try again."}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      data-testid="button-save-profile"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {user.userRole === "Guardian" && (
              <Card>
                <CardHeader>
                  <CardTitle>Guardian Information</CardTitle>
                  <CardDescription>
                    Provide details about your guardianship and the person you support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={guardianForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                    <div>
                      <Label htmlFor="relationship">Relationship</Label>
                      <Input
                        id="relationship"
                        placeholder="e.g., Parent, Legal Guardian, etc."
                        {...guardianForm.register("relationship")}
                        data-testid="input-relationship"
                      />
                      {guardianForm.formState.errors.relationship && (
                        <p className="text-sm text-red-600">
                          {guardianForm.formState.errors.relationship.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="ndAdultEmail">ND Adult Email</Label>
                      <Input
                        id="ndAdultEmail"
                        type="email"
                        placeholder="Email of the person you support"
                        {...guardianForm.register("ndAdultEmail")}
                        data-testid="input-ndAdultEmail"
                      />
                      {guardianForm.formState.errors.ndAdultEmail && (
                        <p className="text-sm text-red-600">
                          {guardianForm.formState.errors.ndAdultEmail.message}
                        </p>
                      )}
                    </div>

                    {updateProfileMutation.error && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {updateProfileMutation.error?.message || "Profile update failed. Please try again."}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      data-testid="button-save-profile"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}