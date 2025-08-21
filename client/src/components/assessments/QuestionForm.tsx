import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle } from "lucide-react";

interface Question {
  question_id: string;
  question_text: string;
  question_type: string;
  options: string[];
  cdc_targets: string[];
}

interface QuestionFormProps {
  questions: Question[];
  title: string;
  currentQuestion: number;
  responses: Record<string, string>;
  onResponseChange: (questionId: string, response: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  isComplete: boolean;
}

export function QuestionForm({
  questions,
  title,
  currentQuestion,
  responses,
  onResponseChange,
  onNext,
  onPrevious,
  onComplete
}: QuestionFormProps) {
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const hasResponse = responses[question?.question_id];

  const handleBackToSelection = () => {
    window.history.back();
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={handleBackToSelection}
        className="mb-6"
        data-testid="button-back"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Assessments
      </Button>

      {/* Progress Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100" data-testid="title-assessment">
            {title}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400" data-testid="text-question-counter">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <Progress value={progress} className="w-full" data-testid="progress-bar" />
      </div>

      {/* Question Card */}
      <Card className="mb-8 border-2" data-testid="card-question">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed" data-testid="text-question">
            {question?.question_text}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Answer Options */}
          <RadioGroup
            value={responses[question?.question_id] || ""}
            onValueChange={(value) => onResponseChange(question.question_id, value)}
            className="space-y-3"
            data-testid="radio-group-options"
          >
            {question?.options.map((option, index) => (
              <div 
                key={index}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  responses[question.question_id] === option
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                data-testid={`option-${index}`}
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Cognitive Areas */}
          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Cognitive Areas Being Assessed:
            </p>
            <div className="flex flex-wrap gap-2">
              {question?.cdc_targets.map((target, index) => (
                <Badge key={index} variant="outline" className="text-xs" data-testid={`badge-cdc-${index}`}>
                  {target.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between" data-testid="navigation-buttons">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={isFirstQuestion}
          data-testid="button-previous"
        >
          Previous
        </Button>

        {isLastQuestion ? (
          <Button 
            onClick={onComplete}
            disabled={!hasResponse}
            className="bg-green-600 hover:bg-green-700 text-white"
            data-testid="button-complete"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Assessment
          </Button>
        ) : (
          <Button 
            onClick={onNext}
            disabled={!hasResponse}
            data-testid="button-next"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}