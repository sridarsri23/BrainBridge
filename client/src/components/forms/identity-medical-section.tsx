import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormCheckbox } from "@/components/ui/form-checkbox";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FileUpload } from "@/components/ui/file-upload";

interface IdentityMedicalSectionProps {
  control: any;
  form: any;
}

const neuroConditionOptions = [
  { value: "Autism Spectrum Disorder (ASD)", label: "Autism Spectrum Disorder (ASD)" },
  { value: "Attention-Deficit/Hyperactivity Disorder (ADHD)", label: "Attention-Deficit/Hyperactivity Disorder (ADHD)" },
  { value: "Dyspraxia", label: "Dyspraxia" },
  { value: "Dyscalculia", label: "Dyscalculia" },
  { value: "Tourette Syndrome", label: "Tourette Syndrome" },
  { value: "others", label: "Others" }
];

export function IdentityMedicalSection({ control, form }: IdentityMedicalSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Identity & Medical Information</h3>
      
      <FormInput
        control={control}
        name="identityVerificationDoc"
        label="Identity Verification Upload"
        type="file"
        testId="input-identity-verification"
      />
      {form.watch("identityVerificationDoc") && (
        <div className="text-xs text-gray-600">
          Current: {form.watch("identityVerificationDoc")}
        </div>
      )}

      <FormCheckbox
        control={control}
        name="hasNeuroConditionRecognized"
        label="Already Neuro Condition Recognized?"
        testId="checkbox-neuro-condition"
      />

      {form.watch("hasNeuroConditionRecognized") && (
        <FormSelect
          control={control}
          name="recognizedNeuroCondition"
          label="Select Neuro Condition"
          placeholder="Select condition"
          options={neuroConditionOptions}
          testId="select-neuro-condition"
        />
      )}

      <FileUpload
        label="ND Condition Proof Documents (Up to 5)"
        testId="input-nd-proof-docs"
        multiple={true}
        description="Upload up to 5 documents as proof of your neuro condition"
        name="ndConditionProofDocs"
        onChange={(e) => {
          const files = (e.target as HTMLInputElement).files;
          const names = files ? Array.from(files).map(f => f.name) : [];
          form.setValue("ndConditionProofDocs", names, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
        }}
      />
      {Array.isArray(form.watch("ndConditionProofDocs")) && form.watch("ndConditionProofDocs").length > 0 && (
        <div className="text-xs text-gray-600 space-y-1">
          <div>Saved documents:</div>
          <ul className="list-disc pl-5">
            {form.watch("ndConditionProofDocs").map((doc: string, idx: number) => (
              <li key={idx}>{doc}</li>
            ))}
          </ul>
        </div>
      )}

      <FormTextarea
        control={control}
        name="medicalConditions"
        label="Any Medical Conditions?"
        placeholder="Please describe any medical conditions..."
        testId="textarea-medical-conditions"
      />
    </div>
  );
}