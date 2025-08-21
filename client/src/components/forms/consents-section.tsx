import { FormCheckbox } from "@/components/ui/form-checkbox";

interface ConsentsSectionProps {
  control: any;
  isNDAdult: boolean;
}

export function ConsentsSection({ control, isNDAdult }: ConsentsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Consents & Privacy</h3>
      
      {isNDAdult && (
        <FormCheckbox
          control={control}
          name="publicProfileConsent"
          label="Public Profile Consent"
          description="Allow your profile to be visible to employers (Yes/No)"
          testId="checkbox-public-profile"
        />
      )}

      <FormCheckbox
        control={control}
        name="privacyAgreed"
        label="Privacy Agreement"
        description="I agree to the privacy policy and terms of service (Yes/No)"
        testId="checkbox-privacy-agreed"
        required={true}
      />
    </div>
  );
}