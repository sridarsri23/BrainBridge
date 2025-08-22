import { useState, useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, CheckCircle, ArrowLeft } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import ProfileForm from "@/components/forms/profile-form";

function mapProfileResponseToForm(data: any) {
  if (!data) return {};
  const p = data.profile || {};
  return {
    // Personal
    dateOfBirth: p.date_of_birth ?? "",
    guardianEmail: p.guardian_email ?? "",
    ndMindEmail: p.nd_adult_email ?? "",
    location: p.location ?? "",
    
    // ND fields
    identityVerificationDoc: p.identity_verification_doc ?? "",
    guardianVerificationDoc: p.identity_verification_doc ?? "",
    hasNeuroConditionRecognized: p.has_neuro_condition_recognized ?? false,
    recognizedNeuroCondition: p.recognized_neuro_condition ?? undefined,
    ndConditionProofDocs: p.nd_condition_proof_docs ?? [],
    medicalConditions: p.medical_conditions ?? "",

    // Work Preferences
    preferredWorkEnvironment: p.preferred_work_environment ?? "",
    preferredWorkSetup: p.preferred_work_setup ?? undefined,
    availabilityStatus: p.availability_status ?? undefined,
    notes: p.notes ?? "",

    // Consents
    publicProfileConsent: p.public_profile_consent ?? false,
    privacyAgreed: p.privacy_agreed ?? false,

    // Employer fields
    companyWebsite: p.company_website ?? "",
    contactPerson: p.contact_person ?? "",
    contactPersonDesignation: p.contact_person_designation ?? "",
    companyEmail: p.company_email ?? "",
    companyVerificationDocs: p.company_verification_docs ?? [],
    isDeiCompliant: p.is_dei_compliant ?? false,
    deiComplianceType: p.dei_compliance_provider ?? undefined,
  };
}

export default function ProfileManagement() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({});
  const [updateStatus, setUpdateStatus] = useState<"idle" | "success" | "error">("idle");

  // Fetch user profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/user/profile"],
    enabled: !!user,
  });

  const initialFormData = useMemo(() => mapProfileResponseToForm(profile), [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Updating profile with data:', data);
      const response = await apiRequest("PUT", "/api/user/profile", data);
      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      setUpdateStatus("success");
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setTimeout(() => setUpdateStatus("idle"), 3000);
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      setUpdateStatus("error");
      setTimeout(() => setUpdateStatus("idle"), 5000);
    },
  });

  const handleSaveProfile = useCallback(() => {
    if (Object.keys(formData).length > 0) {
      let payload: any = { ...formData };
      // For employer role, strip ND-only fields per requirements
      if (user?.user_role === "EMPLOYER") {
        const removeKeys = [
          "dateOfBirth",
          "location",
          "preferredWorkEnvironment",
          "preferredWorkSetup",
          "availabilityStatus",
        ];
        for (const k of removeKeys) delete payload[k];
      }
      // For guardian role, avoid clobbering identity doc: only send guardianVerificationDoc
      if (user?.user_role === "GUARDIAN") {
        // Remove the ND adult identity field to prevent overwriting with ""
        delete payload.identityVerificationDoc;
        // Keep guardianVerificationDoc which maps to the same backend column
      }
      updateProfileMutation.mutate(payload);
    }
  }, [formData, updateProfileMutation, user]);

  const handleFormDataChange = useCallback((data: any) => {
    setFormData(data);
  }, []);

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Alert>
            <AlertDescription>
              Please log in to access your profile.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="page-title">
              Profile Management
            </h1>
            <p className="text-gray-600 mt-2" data-testid="page-description">
              {user.user_role === "ND_ADULT" 
                ? "Complete your ND professional profile to connect with inclusive employers"
                : user.user_role === "EMPLOYER"
                ? "Manage your company profile and diversity & inclusion information"
                : "Manage your profile information"
              }
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            className="flex items-center gap-2"
            data-testid="button-back-to-dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Status Messages */}
        {updateStatus === "success" && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Profile updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {updateStatus === "error" && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              Failed to update profile. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Profile Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Profile Information
            </CardTitle>
            <CardDescription>
              {user.user_role === "ND_ADULT" 
                ? "Fill out your comprehensive ND professional profile with verification, conditions, work preferences, and consents."
                : "Update Your Business Details"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* New Comprehensive Profile Form */}
            <ProfileForm 
              initialData={initialFormData}
              user={user}
              onDataChange={handleFormDataChange}
            />

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t">
              <Button
                onClick={handleSaveProfile}
                disabled={updateProfileMutation.isPending || Object.keys(formData).length === 0}
                className="flex items-center gap-2 min-w-[120px]"
                data-testid="button-save-profile"
              >
                {updateProfileMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ND Adult Specific Information */}
        {user.user_role === "ND_ADULT" && (
          <Card className="shadow-lg mt-6">
            <CardHeader>
              <CardTitle>Your ND Professional Profile</CardTitle>
              <CardDescription>
                Your profile includes comprehensive information about your neurodiversity, 
                work preferences, and verification documents to help employers understand 
                your unique strengths and accommodation needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">Profile Sections:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Personal Details & Guardian Info</li>
                    <li>• Identity & Medical Verification</li>
                    <li>• Neuro Condition Recognition</li>
                    <li>• Work Environment Preferences</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Privacy & Consents:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Public Profile Visibility</li>
                    <li>• Privacy Policy Agreement</li>
                    <li>• Document Upload Security</li>
                    <li>• Employer Matching Preferences</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}