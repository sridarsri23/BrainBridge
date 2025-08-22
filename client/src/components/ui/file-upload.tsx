import React from "react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FileUploadProps {
  label: string;
  testId?: string;
  multiple?: boolean;
  description?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUpload({ label, testId, multiple = false, description, name, onChange }: FileUploadProps) {
  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <Input 
        type="file"
        multiple={multiple}
        accept=".pdf,.jpg,.jpeg,.png"
        data-testid={testId}
        name={name}
        onChange={onChange}
      />
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  );
}