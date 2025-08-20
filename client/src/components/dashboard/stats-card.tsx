import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: "primary" | "secondary" | "success" | "warning" | "error";
  trend?: string;
  className?: string;
  "data-testid"?: string;
}

const colorClasses = {
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
};

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  className,
  "data-testid": testId
}: StatsCardProps) {
  return (
    <Card className={cn("card-hover", className)} data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground" data-testid={`${testId}-title`}>
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground" data-testid={`${testId}-value`}>
              {value}
            </p>
            {trend && (
              <p className="text-xs text-success mt-1" data-testid={`${testId}-trend`}>
                {trend}
              </p>
            )}
          </div>
          <Icon className={cn("w-5 h-5", colorClasses[color])} />
        </div>
      </CardContent>
    </Card>
  );
}
