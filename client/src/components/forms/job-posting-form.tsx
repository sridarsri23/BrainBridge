import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Update the schema to match backend with correct enum values
const jobPostingSchema = z.object({
  job_title: z.string().min(1, "Job title is required"),
  job_description: z.string().min(10, "Job description must be at least 10 characters"),
  requirements: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  employment_type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
  work_setup: z.enum(['On-Site', 'Hybrid', 'Remote']), // Updated enum values
  salary_range_min: z.number().min(0, "Minimum salary must be positive").optional(),
  salary_range_max: z.number().min(0, "Maximum salary must be positive").optional(),
  benefits: z.string().optional(),
  application_deadline: z.string().optional(),
});

type JobPostingData = z.infer<typeof jobPostingSchema>;

interface JobPostingFormProps {
  onDataChange: (data: any) => void;
}

const strengthOptions = [
  { id: "pattern-recognition", name: "Pattern Recognition" },
  { id: "attention-to-detail", name: "Attention to Detail" },
  { id: "hyperfocus", name: "Hyperfocus" },
  { id: "creative-thinking", name: "Creative Thinking" },
  { id: "analytical-skills", name: "Analytical Skills" },
  { id: "problem-solving", name: "Problem Solving" },
];

const accommodationOptions = [
  { id: "quiet-environment", name: "Quiet Environment Available" },
  { id: "flexible-schedule", name: "Flexible Schedule" },
  { id: "remote-work", name: "Remote Work Option" },
  { id: "clear-structure", name: "Clear Task Structure" },
  { id: "written-instructions", name: "Written Instructions Provided" },
  { id: "regular-feedback", name: "Regular Feedback Sessions" },
];

export default function JobPostingForm({ onDataChange }: JobPostingFormProps) {
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>([]);

  const form = useForm<JobPostingData>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      job_title: "",
      job_description: "",
      requirements: "",
      location: "",
      employment_type: "Full-time",
      work_setup: "On-Site", // Updated default value
      benefits: "",
      application_deadline: "",
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    onDataChange({
      ...watchedValues,
      desiredStrengths: selectedStrengths,
      accommodations: selectedAccommodations,
    });
  }, [watchedValues, selectedStrengths, selectedAccommodations, onDataChange]);

  const handleStrengthChange = (strengthId: string, checked: boolean) => {
    if (checked) {
      setSelectedStrengths([...selectedStrengths, strengthId]);
    } else {
      setSelectedStrengths(selectedStrengths.filter(id => id !== strengthId));
    }
  };

  const handleAccommodationChange = (accommodationId: string, checked: boolean) => {
    if (checked) {
      setSelectedAccommodations([...selectedAccommodations, accommodationId]);
    } else {
      setSelectedAccommodations(selectedAccommodations.filter(id => id !== accommodationId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Job Information */}
      <Card data-testid="card-job-details">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Senior Data Analyst" 
                        {...field} 
                        data-testid="input-job-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="employment_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-employment-type">
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="work_setup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Setup *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-work-setup">
                            <SelectValue placeholder="Select work setup" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="On-Site">On-Site</SelectItem> {/* Updated value */}
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Remote, San Francisco, CA" 
                          {...field} 
                          data-testid="input-location"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="application_deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Deadline</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field} 
                          data-testid="input-application-deadline"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="salary_range_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Salary ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          data-testid="input-salary-min"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary_range_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Salary ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          data-testid="input-salary-max"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="job_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={6}
                        placeholder="Describe the role, responsibilities, and what makes this position great for neurodivergent talent..."
                        {...field} 
                        data-testid="textarea-job-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List the required skills, qualifications, and experience..."
                        {...field} 
                        data-testid="textarea-requirements"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefits</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the benefits, perks, and compensation..."
                        {...field} 
                        data-testid="textarea-benefits"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Neuro-Inclusive Requirements - For UI purposes only */}
      <Card data-testid="card-cognitive-requirements">
        <CardHeader>
          <CardTitle>Cognitive Profile Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Desired Strengths</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {strengthOptions.map((strength) => (
                  <div 
                    key={strength.id} 
                    className="flex items-center justify-between p-4 bg-accent rounded-lg"
                    data-testid={`strength-option-${strength.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={strength.id}
                        checked={selectedStrengths.includes(strength.id)}
                        onCheckedChange={(checked) => handleStrengthChange(strength.id, !!checked)}
                      />
                      <label htmlFor={strength.id} className="text-sm font-medium cursor-pointer">
                        {strength.name}
                      </label>
                    </div>
                    <Select defaultValue="Desired">
                      <SelectTrigger className="w-24 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Required">Required</SelectItem>
                        <SelectItem value="Desired">Desired</SelectItem>
                        <SelectItem value="NiceToHave">Nice to Have</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Work Environment & Accommodations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {accommodationOptions.map((accommodation) => (
                  <div 
                    key={accommodation.id} 
                    className="p-4 bg-accent rounded-lg"
                    data-testid={`accommodation-option-${accommodation.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={accommodation.id}
                        checked={selectedAccommodations.includes(accommodation.id)}
                        onCheckedChange={(checked) => handleAccommodationChange(accommodation.id, !!checked)}
                      />
                      <label htmlFor={accommodation.id} className="text-sm cursor-pointer">
                        {accommodation.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}