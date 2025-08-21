import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, CheckCircle } from "lucide-react";

interface Quiz {
  quiz_id: string;
  title: string;
  description: string;
  activity_type: string;
  estimated_time: number;
  cdc_focus: string[];
}

interface AssessmentCardProps {
  quiz: Quiz;
  onStart: (quizId: string) => void;
  isStarted: boolean;
}

export function AssessmentCard({ quiz, onStart, isStarted }: AssessmentCardProps) {
  return (
    <Card 
      className="h-full transition-all duration-200 hover:shadow-lg border-l-4 border-l-blue-500"
      data-testid={`card-assessment-${quiz.quiz_id}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {quiz.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {quiz.description}
            </CardDescription>
          </div>
          {isStarted && (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" data-testid="icon-completed" />
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className="text-xs" data-testid="badge-time">
            <Clock className="w-3 h-3 mr-1" />
            {quiz.estimated_time} min
          </Badge>
          <Badge variant="secondary" className="text-xs" data-testid="badge-type">
            {quiz.activity_type.replace(/_/g, ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Cognitive Areas:</p>
          <div className="flex flex-wrap gap-1">
            {quiz.cdc_focus.map((focus, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-1" data-testid={`badge-cdc-${index}`}>
                {focus.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={() => onStart(quiz.quiz_id)}
          className="w-full"
          disabled={isStarted}
          data-testid="button-start-assessment"
        >
          <Play className="w-4 h-4 mr-2" />
          {isStarted ? 'Completed' : 'Start Assessment'}
        </Button>
      </CardContent>
    </Card>
  );
}