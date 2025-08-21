import React from "react";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormCheckbox } from "@/components/ui/form-checkbox";
import { FileUpload } from "@/components/ui/file-upload";

interface EmployerDetailsSectionProps {
  control: any;
  form: any;
  user: any;
}

const deiComplianceOptions = [
  { value: "IBCCES", label: "IBCCES" },
  { value: "Neuroinclusion Lab", label: "Neuroinclusion Lab" },
  { value: "NeuroInclusion Innovators", label: "NeuroInclusion Innovators" },
  { value: "Cognassist", label: "Cognassist" },
  { value: "Neurodiversity Hub", label: "Neurodiversity Hub" },
  { value: "VT-HEC / La Verne Programs", label: "VT-HEC / La Verne Programs" }
];

export function EmployerDetailsSection({ control, form, user }: EmployerDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Company Details</h3>
      <div className="text-sm text-gray-600 space-y-1 p-4 bg-gray-50 rounded-md">
        <p><strong>Company Name:</strong> {user.company_name}</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <FormInput
          control={control}
          name="companyWebsite"
          label="Company Website"
          type="url"
          placeholder="https://company.com"
          testId="input-company-website"
        />
        
        <FormInput
          control={control}
          name="contactPerson"
          label="Contact Person"
          placeholder="e.g., John Smith"
          testId="input-contact-person"
        />
        
        <FormInput
          control={control}
          name="contactPersonDesignation"
          label="Contact Person Designation"
          placeholder="e.g., HR Manager"
          testId="input-contact-designation"
        />

        <FormInput
          control={control}
          name="companyEmail"
          label="Company Email"
          type="email"
          placeholder="hr@company.com"
          testId="input-company-email"
        />
      </div>

      <FileUpload
        label="Company Verification Documents (Up to 5)"
        testId="input-company-verification"
        multiple={true}
        description="Upload up to 5 documents for company verification"
      />

      <FormCheckbox
        control={control}
        name="isDeiCompliant"
        label="Already DEI Compliant?"
        testId="checkbox-dei-compliant"
      />

      {form.watch("isDeiCompliant") && (
        <FormSelect
          control={control}
          name="deiComplianceType"
          label="Select DEI Compliance Type"
          placeholder="Select compliance type"
          options={deiComplianceOptions}
          testId="select-dei-compliance"
        />
      )}
    </div>
  );
}