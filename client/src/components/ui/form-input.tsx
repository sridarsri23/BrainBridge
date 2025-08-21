import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormInputProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  testId?: string;
  required?: boolean;
  readonly?: boolean;
}

export function FormInput({ control, name, label, placeholder, type = "text", testId, required, readonly }: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label} {required && '*'}</FormLabel>
          <FormControl>
            <Input 
              type={type}
              placeholder={placeholder}
              {...field} 
              data-testid={testId}
              readOnly={readonly}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}