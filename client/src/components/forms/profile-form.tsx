import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { PersonalDetailsSection } from "./personal-details-section";
import { IdentityMedicalSection } from "./identity-medical-section";
import { WorkPreferencesSection } from "./work-preferences-section";
import { EmployerDetailsSection } from "./employer-details-section";
import { ConsentsSection } from "./consents-section";
import { GuardianDetailsSection } from "./guardian-details-section";

const profileFormSchema = z.object({
  // Personal Details
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  guardianEmail: z.string().email().optional().or(z.literal("")),
  // Guardian specific
  ndMindEmail: z.string().email("Enter a valid ND Mind Email").optional().or(z.literal("")),
  guardianVerificationDoc: z.string().optional(),
  
  // Identity & Medical
  identityVerificationDoc: z.string().optional(),
  hasNeuroConditionRecognized: z.boolean().optional(),
  recognizedNeuroCondition: z.enum([
    "Autism Spectrum Disorder (ASD)",
    "Attention-Deficit/Hyperactivity Disorder (ADHD)", 
    "Dyspraxia",
    "Dyscalculia",
    "Tourette Syndrome",
    "others"
  ]).optional(),
  ndConditionProofDocs: z.array(z.string()).optional(),
  medicalConditions: z.string().optional(),
  
  // Work Preferences
  location: z.string().optional(),
  preferredWorkEnvironment: z.string().optional(),
  preferredWorkSetup: z.enum(["On-Site", "Hybrid", "Remote"]).optional(),
  availabilityStatus: z.enum(['Actively Looking', 'Passively Looking', 'Not Looking']).optional(),
  notes: z.string().optional(),
  
  // Consents
  publicProfileConsent: z.boolean().optional(),
  privacyAgreed: z.boolean(),
  
  // Employer fields
  companyWebsite: z.string().url().optional().or(z.literal("")),
  contactPerson: z.string().optional(),
  contactPersonDesignation: z.string().optional(),
  companyEmail: z.string().email().optional().or(z.literal("")),
  isDeiCompliant: z.boolean().optional(),
  deiComplianceType: z.enum([
    "IBCCES",
    "Neuroinclusion Lab",
    "NeuroInclusion Innovators", 
    "Cognassist",
    "Neurodiversity Hub",
    "VT-HEC / La Verne Programs"
  ]).optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  initialData?: any;
  user?: any;
  onDataChange: (data: any) => void;
}

export default function ProfileForm({ initialData, user, onDataChange }: ProfileFormProps) {
  const isNDAdult = user?.user_role === "ND_ADULT";
  const isEmployer = user?.user_role === "EMPLOYER";
  const isGuardian = user?.user_role === "GUARDIAN";
  
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      companyName: user?.company_name || "",
      dateOfBirth: initialData?.dateOfBirth || "",
      guardianEmail: initialData?.guardianEmail || "",
      ndMindEmail: initialData?.ndMindEmail || "",
      guardianVerificationDoc: initialData?.guardianVerificationDoc || "",
      location: initialData?.location || "",
      preferredWorkEnvironment: initialData?.preferredWorkEnvironment || "",
      availabilityStatus: initialData?.availabilityStatus || "Actively Looking",
      hasNeuroConditionRecognized: initialData?.hasNeuroConditionRecognized || false,
      ndConditionProofDocs: initialData?.ndConditionProofDocs || [],
      medicalConditions: initialData?.medicalConditions || "",
      publicProfileConsent: initialData?.publicProfileConsent || false,
      privacyAgreed: initialData?.privacyAgreed || false,
      isDeiCompliant: initialData?.isDeiCompliant || false,
      ...initialData,
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    onDataChange(watchedValues);
  }, [watchedValues, onDataChange]);

  // Ensure form reflects async-loaded initialData/user
  useEffect(() => {
    const values = {
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      companyName: user?.company_name || "",
      dateOfBirth: initialData?.dateOfBirth || "",
      guardianEmail: initialData?.guardianEmail || "",
      ndMindEmail: initialData?.ndMindEmail || "",
      guardianVerificationDoc: initialData?.guardianVerificationDoc || "",
      location: initialData?.location || "",
      preferredWorkEnvironment: initialData?.preferredWorkEnvironment || "",
      preferredWorkSetup: initialData?.preferredWorkSetup,
      availabilityStatus: initialData?.availabilityStatus ?? "Actively Looking",
      hasNeuroConditionRecognized: initialData?.hasNeuroConditionRecognized || false,
      recognizedNeuroCondition: initialData?.recognizedNeuroCondition,
      identityVerificationDoc: initialData?.identityVerificationDoc || "",
      ndConditionProofDocs: initialData?.ndConditionProofDocs || [],
      medicalConditions: initialData?.medicalConditions || "",
      publicProfileConsent: initialData?.publicProfileConsent || false,
      privacyAgreed: initialData?.privacyAgreed || false,
      // Employer
      companyWebsite: initialData?.companyWebsite || "",
      contactPerson: initialData?.contactPerson || "",
      contactPersonDesignation: initialData?.contactPersonDesignation || "",
      companyEmail: initialData?.companyEmail || "",
      companyVerificationDocs: initialData?.companyVerificationDocs || [],
      isDeiCompliant: initialData?.isDeiCompliant || false,
      deiComplianceType: initialData?.deiComplianceType,
    } as any;
    form.reset(values);
  }, [initialData, user, form]);

  if (!user) {
    return <div>Loading user information...</div>;
  }

  return (
    <Form {...form}>
      <form className="space-y-8">
        <PersonalDetailsSection 
          control={form.control} 
          isNDAdult={isNDAdult}
          isEmployer={isEmployer}
        />

        {/* ND Professional Fields */}
        {isNDAdult && (
          <IdentityMedicalSection 
            control={form.control} 
            form={form} 
          />
        )}

        {/* Guardian Fields */}
        {isGuardian && (
          <GuardianDetailsSection control={form.control} />
        )}

        {isNDAdult && (
          <WorkPreferencesSection 
            control={form.control} 
            isNDAdult={isNDAdult} 
          />
        )}

        {/* Employer Fields */}
        {isEmployer && (
          <EmployerDetailsSection 
            control={form.control} 
            form={form} 
          />
        )}

        <ConsentsSection 
          control={form.control} 
          isNDAdult={isNDAdult} 
        />
      </form>
    </Form>
  );
}