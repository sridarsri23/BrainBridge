import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";

interface WorkPreferencesSectionProps {
  control: any;
  isNDAdult: boolean;
}

const workSetupOptions = [
  { value: "On-Site", label: "On-Site" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Remote", label: "Remote" }
];

const availabilityOptions = [
  { value: "Actively Looking", label: "Actively Looking" },
  { value: "Passively Looking", label: "Passively Looking" },
  { value: "Not Looking", label: "Not Looking" }
];

export function WorkPreferencesSection({ control, isNDAdult }: WorkPreferencesSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Work Preferences</h3>
      
      <FormInput
        control={control}
        name="location"
        label="Location"
        placeholder="e.g., San Francisco, CA"
        testId="input-location"
      />

      <FormTextarea
        control={control}
        name="preferredWorkEnvironment"
        label="Preferred Work Environment"
        placeholder="Describe your ideal work environment..."
        testId="textarea-preferred-work-environment"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <FormSelect
          control={control}
          name="preferredWorkSetup"
          label="Preferred Work Setup"
          placeholder="Select work setup"
          options={workSetupOptions}
          testId="select-work-setup"
        />

        <FormSelect
          control={control}
          name="availabilityStatus"
          label="Availability Status"
          placeholder="Select your availability"
          options={availabilityOptions}
          testId="select-availability-status"
        />
      </div>

      {isNDAdult && (
        <FormTextarea
          control={control}
          name="notes"
          label="Notes"
          placeholder="Any additional notes or comments..."
          testId="textarea-notes"
        />
      )}
    </div>
  );
}