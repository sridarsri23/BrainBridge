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

const profileFormSchema = z.object({
  dateOfBirth: z.string().optional(),
  contactPreference: z.string().optional(),
  location: z.string().optional(),
  preferredWorkEnvironment: z.string().optional(),
  availabilityStatus: z.enum(['Actively Looking', 'Passively Looking', 'Not Looking']).optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  initialData?: any;
  user?: any;
  onDataChange: (data: any) => void;
}

export default function ProfileForm({ initialData, user, onDataChange }: ProfileFormProps) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      dateOfBirth: initialData?.dateOfBirth || "",
      contactPreference: initialData?.contactPreference || "Email",
      location: initialData?.location || "",
      preferredWorkEnvironment: initialData?.preferredWorkEnvironment || "",
      availabilityStatus: initialData?.availabilityStatus || "Actively Looking",
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    onDataChange(watchedValues);
  }, [watchedValues, onDataChange]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    data-testid="input-date-of-birth"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contactPreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Preference</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-contact-preference">
                      <SelectValue placeholder="Select contact method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Platform Message">Platform Message</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., San Francisco, CA" 
                  {...field} 
                  data-testid="input-location"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {user?.userRole === "ND_Adult" && (
          <>
            <FormField
              control={form.control}
              name="preferredWorkEnvironment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Work Environment</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your ideal work environment (e.g., quiet, remote, collaborative, structured)"
                      {...field} 
                      data-testid="textarea-work-environment"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availabilityStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-availability-status">
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Actively Looking">Actively Looking</SelectItem>
                      <SelectItem value="Passively Looking">Passively Looking</SelectItem>
                      <SelectItem value="Not Looking">Not Looking</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </form>
    </Form>
  );
}
