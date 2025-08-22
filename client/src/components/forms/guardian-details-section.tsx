import { FormInput } from "@/components/ui/form-input";
import { useWatch } from "react-hook-form";

interface GuardianDetailsSectionProps {
  control: any;
}

export function GuardianDetailsSection({ control }: GuardianDetailsSectionProps) {
  const currentDoc: string = useWatch({ control, name: "guardianVerificationDoc" }) || "";
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Guardian Verification</h3>

      <FormInput
        control={control}
        name="ndMindEmail"
        label="ND Mind Email"
        type="email"
        placeholder="ndprofessional@example.com"
        testId="input-nd-mind-email"
      />

      <FormInput
        control={control}
        name="guardianVerificationDoc"
        label="Verification Document"
        type="file"
        testId="input-guardian-verification"
      />

      {currentDoc && (
        <div className="text-sm text-gray-600" data-testid="guardian-doc-saved">
          <span className="font-medium">Saved document:</span> {currentDoc}
        </div>
      )}
    </div>
  );
}
