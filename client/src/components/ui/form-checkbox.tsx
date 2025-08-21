import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface FormCheckboxProps {
  control: any;
  name: string;
  label: string;
  description?: string;
  testId?: string;
  required?: boolean;
}

export function FormCheckbox({ control, name, label, description, testId, required }: FormCheckboxProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              data-testid={testId}
              required={required}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label} {required && '*'}</FormLabel>
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
        </FormItem>
      )}
    />
  );
}