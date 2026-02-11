import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NonObjectiveQuestionCardProps {
  questionNumber: number;
  question: string;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  showResult?: boolean;
  isCorrect?: boolean;
}

export function NonObjectiveQuestionCard({
  questionNumber,
  question,
  onAnswer,
  disabled = false,
  showResult = false,
  isCorrect = false,
}: NonObjectiveQuestionCardProps) {
  const [value, setValue] = useState("");

  return (
    <div className={cn(
      "p-4 rounded-lg border-2 space-y-3",
      showResult && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/30",
      showResult && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/30",
      !showResult && "border-border"
    )}>
      <Label className="text-sm font-medium leading-relaxed">
        <span className="text-muted-foreground mr-1">Q{questionNumber}.</span>
        {question}
      </Label>
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onAnswer(e.target.value);
        }}
        placeholder="Type your answer..."
        disabled={disabled}
        className="h-12 text-base touch-manipulation"
        style={{ touchAction: "manipulation" }}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        onPointerDown={(e) => e.stopPropagation()}
      />
      {showResult && (
        <p className={cn("text-xs font-medium", isCorrect ? "text-green-600" : "text-red-600")}>
          {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
        </p>
      )}
    </div>
  );
}
