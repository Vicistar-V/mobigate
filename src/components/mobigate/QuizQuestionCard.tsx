import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Edit2, Trash2, Ban, RotateCcw, Snowflake } from "lucide-react";
import { ANSWER_LABELS, type AdminQuizQuestion } from "@/data/mobigateQuizQuestionsData";
import { cn } from "@/lib/utils";

interface Props {
  question: AdminQuizQuestion;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSuspend?: (id: string) => void;
  onReactivate?: (id: string) => void;
}

const difficultyColors: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Hard: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Expert: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    icon: null,
  },
  frozen: {
    label: "Frozen",
    className: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-800",
    icon: Snowflake,
  },
  suspended: {
    label: "Suspended",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    icon: Ban,
  },
};

export function QuizQuestionCard({ question, onEdit, onDelete, onSuspend, onReactivate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[question.status];
  const StatusIcon = status.icon;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 space-y-2">
        {/* Header: question text + status + expand */}
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-medium flex-1", !expanded && "line-clamp-2")}>
            {question.question}
          </p>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setExpanded(!expanded)}>
            <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
          </Button>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <Badge variant="outline" className="text-xs px-2 py-0.5">{question.category}</Badge>
          <Badge className={cn("text-xs px-2 py-0.5 border-0", difficultyColors[question.difficulty])}>
            {question.difficulty}
          </Badge>
          <Badge variant="outline" className={cn("text-xs px-2 py-0.5 gap-1", status.className)}>
            {StatusIcon && <StatusIcon className="h-3 w-3" />}
            {status.label}
          </Badge>
          <span className="text-[10px] text-muted-foreground ml-auto">
            Asked: {question.timesAsked}/3
          </span>
        </div>

        {/* Frozen info banner */}
        {question.status === "frozen" && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800">
            <Snowflake className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
            <p className="text-xs text-sky-700 dark:text-sky-300">
              Asked 3 times — Frozen until freeze period ends
              {question.freezeCount > 0 && <span className="ml-1 opacity-70">(frozen {question.freezeCount}x)</span>}
            </p>
          </div>
        )}

        {/* Suspended info banner */}
        {question.status === "suspended" && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <Ban className="h-3.5 w-3.5 text-red-600 dark:text-red-400 shrink-0" />
            <p className="text-xs text-red-700 dark:text-red-300">
              Suspended by Admin
              {question.suspendedUntil && (
                <span className="ml-1 opacity-70">
                  · Until {new Date(question.suspendedUntil).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
        )}

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
          {question.status === "active" && (
            <>
              <Button variant="outline" size="sm" className="h-8 text-xs flex-1" onClick={() => onEdit(question.id)}>
                <Edit2 className="h-3 w-3 mr-1" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs flex-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                onClick={() => onSuspend?.(question.id)}
              >
                <Ban className="h-3 w-3 mr-1" /> Suspend
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs flex-1 text-destructive hover:bg-destructive/10" onClick={() => onDelete(question.id)}>
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            </>
          )}
          {question.status === "frozen" && (
            <>
              <Button variant="outline" size="sm" className="h-8 text-xs flex-1" onClick={() => onEdit(question.id)}>
                <Edit2 className="h-3 w-3 mr-1" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs flex-1 text-destructive hover:bg-destructive/10" onClick={() => onDelete(question.id)}>
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            </>
          )}
          {question.status === "suspended" && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs flex-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700"
                onClick={() => onReactivate?.(question.id)}
              >
                <RotateCcw className="h-3 w-3 mr-1" /> Reactivate
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs flex-1 text-destructive hover:bg-destructive/10" onClick={() => onDelete(question.id)}>
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
