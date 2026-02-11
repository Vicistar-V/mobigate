import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Edit2, Trash2 } from "lucide-react";
import { ANSWER_LABELS, type AdminQuizQuestion } from "@/data/mobigateQuizQuestionsData";
import { cn } from "@/lib/utils";

interface Props {
  question: AdminQuizQuestion;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const difficultyColors: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Hard: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Expert: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function QuizQuestionCard({ question, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 space-y-2">
        {/* Header: question text + badges */}
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-medium flex-1", !expanded && "line-clamp-2")}>
            {question.question}
          </p>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setExpanded(!expanded)}>
            <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
          </Button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{question.category}</Badge>
          <Badge className={cn("text-[10px] px-1.5 py-0 border-0", difficultyColors[question.difficulty])}>
            {question.difficulty}
          </Badge>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            ✓ {ANSWER_LABELS[question.correctAnswerIndex]}
          </Badge>
        </div>

        {/* Expanded: show all options */}
        {expanded && (
          <div className="grid grid-cols-2 gap-1 mt-2">
            {question.options.map((opt, idx) => (
              <div
                key={idx}
                className={cn(
                  "text-xs px-2 py-1.5 rounded border",
                  idx === question.correctAnswerIndex
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-700 dark:text-emerald-300 font-semibold"
                    : "bg-muted/30 border-border"
                )}
              >
                <span className="font-bold mr-1">{ANSWER_LABELS[idx]}.</span>{opt}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button variant="outline" size="sm" className="h-8 text-xs flex-1" onClick={() => onEdit(question.id)}>
            <Edit2 className="h-3 w-3 mr-1" /> Edit
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs flex-1 text-destructive hover:bg-destructive/10" onClick={() => onDelete(question.id)}>
            <Trash2 className="h-3 w-3 mr-1" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
