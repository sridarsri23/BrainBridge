import { FormInput } from "@/components/ui/form-input";

interface PersonalDetailsSectionProps {
  control: any;
  isNDAdult: boolean;
}

export function PersonalDetailsSection({ control, isNDAdult }: PersonalDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Personal Details</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <FormInput
          control={control}
          name="firstName"
          label="First Name"
          placeholder="Enter your first name"
          testId="input-first-name"
        />
        
        <FormInput
          control={control}
          name="lastName"
          label="Last Name"
          placeholder="Enter your last name"
          testId="input-last-name"
        />
        
        <FormInput
          control={control}
          name="email"
          label="Email Address (Read-only)"
          type="email"
          placeholder="your@email.com"
          readonly={true}
          testId="input-email"
        />
        
        <FormInput
          control={control}
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="(555) 123-4567"
          testId="input-phone"
        />
        <FormInput
          control={control}
          name="dateOfBirth"
          label="Date of Birth"
          type="date"
          testId="input-date-of-birth"
        />
        
        {isNDAdult && (
          <FormInput
            control={control}
            name="guardianEmail"
            label="Guardian Email (Optional)"
            type="email"
            placeholder="guardian@email.com"
            testId="input-guardian-email"
          />
        )}
      </div>
    </div>
  );
}