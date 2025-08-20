import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Plus } from "lucide-react";

interface TraitsSelectionProps {
  individualTraits: any[];
  individualStrengths: any[];
}

const workPreferences = [
  { id: "quiet-environment", label: "Quiet Environment" },
  { id: "flexible-schedule", label: "Flexible Schedule" },
  { id: "remote-work", label: "Remote Work" },
  { id: "structured-tasks", label: "Structured Tasks" },
  { id: "written-communication", label: "Written Communication" },
  { id: "regular-breaks", label: "Regular Breaks" },
];

export default function TraitsSelection({ individualTraits, individualStrengths }: TraitsSelectionProps) {
  const { toast } = useToast();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const { data: allStrengths = [] } = useQuery({
    queryKey: ["/api/traits/strengths"],
  });

  const addStrengthMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/profiles/strengths", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Strength added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profiles/strengths"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add strength. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePreferenceChange = (preferenceId: string, checked: boolean) => {
    if (checked) {
      setSelectedPreferences([...selectedPreferences, preferenceId]);
    } else {
      setSelectedPreferences(selectedPreferences.filter(id => id !== preferenceId));
    }
  };

  const handleAddStrength = (strengthId: number) => {
    addStrengthMutation.mutate({
      strengthId,
      levelOfProficiency: "Proficient",
      isPublic: true,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">My Strengths</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {individualStrengths.map((strength: any) => (
            <div 
              key={strength.individualStrengthId} 
              className="flex items-center justify-between p-4 bg-accent rounded-lg"
              data-testid={`individual-strength-${strength.individualStrengthId}`}
            >
              <div className="flex items-center space-x-3">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {allStrengths.find((s: any) => s.strengthId === strength.strengthId)?.strengthName || "Unknown Strength"}
                </span>
              </div>
              <Select defaultValue={strength.levelOfProficiency}>
                <SelectTrigger className="w-24 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Developing">Developing</SelectItem>
                  <SelectItem value="Proficient">Proficient</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
          
          {allStrengths.length > individualStrengths.length && (
            <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <Select onValueChange={(value) => handleAddStrength(parseInt(value))}>
                <SelectTrigger data-testid="select-add-strength">
                  <SelectValue placeholder="Add strength..." />
                </SelectTrigger>
                <SelectContent>
                  {allStrengths
                    .filter((strength: any) => 
                      !individualStrengths.some((is: any) => is.strengthId === strength.strengthId)
                    )
                    .map((strength: any) => (
                      <SelectItem key={strength.strengthId} value={strength.strengthId.toString()}>
                        {strength.strengthName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          className="mt-4 text-primary hover:text-primary/80"
          data-testid="button-add-strength"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add More Strengths
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Work Preferences</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {workPreferences.map((preference) => (
            <div 
              key={preference.id} 
              className="p-4 bg-accent rounded-lg"
              data-testid={`preference-${preference.id}`}
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={preference.id}
                  checked={selectedPreferences.includes(preference.id)}
                  onCheckedChange={(checked) => handlePreferenceChange(preference.id, !!checked)}
                />
                <label htmlFor={preference.id} className="text-sm cursor-pointer">
                  {preference.label}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
