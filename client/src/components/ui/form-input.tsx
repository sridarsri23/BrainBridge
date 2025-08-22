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
            {type === 'file' ? (
              <Input
                type="file"
                placeholder={placeholder}
                name={field.name}
                ref={field.ref}
                // Do not bind value for file inputs; update form with file name/path or File object as needed
                onChange={(e) => {
                  const files = (e.target as HTMLInputElement).files;
                  // Store file name (string) to align with current backend expectation
                  const value = files && files.length > 0 ? files[0].name : "";
                  field.onChange(value);
                }}
                data-testid={testId}
                readOnly={readonly}
              />
            ) : (
              <Input 
                type={type}
                placeholder={placeholder}
                {...field}
                data-testid={testId}
                readOnly={readonly}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}