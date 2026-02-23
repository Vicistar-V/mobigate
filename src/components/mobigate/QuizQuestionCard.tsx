import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Edit2, Trash2, Ban, RotateCcw, Snowflake, Clock } from "lucide-react";
import { ANSWER_LABELS, type AdminQuizQuestion } from "@/data/mobigateQuizQuestionsData";
import { cn } from "@/lib/utils";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription,
} from "@/components/ui/drawer";

interface Props {
  question: AdminQuizQuestion;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSuspend?: (id: string, days: number | null) => void;
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

const SUSPENSION_TIMEFRAMES = [
  { label: "7 Days", days: 7 },
  { label: "14 Days", days: 14 },
  { label: "21 Days", days: 21 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
  { label: "180 Days", days: 180 },
  { label: "360 Days", days: 360 },
  { label: "Indefinitely", days: null as number | null },
];

export function QuizQuestionCard({ question, onEdit, onDelete, onSuspend, onReactivate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showSuspendDrawer, setShowSuspendDrawer] = useState(false);
  const status = statusConfig[question.status];
  const StatusIcon = status.icon;

  const handleSuspendSelect = (days: number | null) => {
    onSuspend?.(question.id, days);
    setShowSuspendDrawer(false);
  };

  // Calculate remaining suspension days
  const getSuspensionLabel = () => {
    if (!question.suspendedUntil) return "Indefinitely";
    const until = new Date(question.suspendedUntil);
    const now = new Date();
    const diffDays = Math.ceil((until.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Expired";
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} remaining`;
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-3 space-y-2">
          {/* Header: question text + expand */}
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
            <span className="text-xs text-muted-foreground ml-auto">
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
              <div className="flex-1">
                <p className="text-xs text-red-700 dark:text-red-300">
                  Suspended by Admin
                </p>
                <p className="text-xs text-red-600/70 dark:text-red-400/70 flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" />
                  {getSuspensionLabel()}
                  {question.suspendedUntil && (
                    <span>· Until {new Date(question.suspendedUntil).toLocaleDateString()}</span>
                  )}
                </p>
              </div>
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
                <Button variant="outline" size="sm" className="h-8 text-xs flex-1 touch-manipulation active:scale-[0.97]" onClick={() => onEdit(question.id)}>
                  <Edit2 className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs flex-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 touch-manipulation active:scale-[0.97]"
                  onClick={() => setShowSuspendDrawer(true)}
                >
                  <Ban className="h-3 w-3 mr-1" /> Suspend
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs flex-1 text-destructive hover:bg-destructive/10 touch-manipulation active:scale-[0.97]" onClick={() => onDelete(question.id)}>
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </>
            )}
            {question.status === "frozen" && (
              <>
                <Button variant="outline" size="sm" className="h-8 text-xs flex-1 touch-manipulation active:scale-[0.97]" onClick={() => onEdit(question.id)}>
                  <Edit2 className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs flex-1 text-destructive hover:bg-destructive/10 touch-manipulation active:scale-[0.97]" onClick={() => onDelete(question.id)}>
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </>
            )}
            {question.status === "suspended" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs flex-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 touch-manipulation active:scale-[0.97]"
                  onClick={() => onReactivate?.(question.id)}
                >
                  <RotateCcw className="h-3 w-3 mr-1" /> Reactivate
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs flex-1 text-destructive hover:bg-destructive/10 touch-manipulation active:scale-[0.97]" onClick={() => onDelete(question.id)}>
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suspension Timeframe Drawer */}
      <Drawer open={showSuspendDrawer} onOpenChange={setShowSuspendDrawer}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-base flex items-center gap-2">
              <Ban className="h-4 w-4 text-amber-600" />
              Suspend Question
            </DrawerTitle>
            <DrawerDescription className="text-xs">
              Choose how long to suspend this question
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6 space-y-2">
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 p-2 bg-muted/50 rounded-lg">
              "{question.question}"
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SUSPENSION_TIMEFRAMES.map((tf) => (
                <Button
                  key={tf.label}
                  variant="outline"
                  className={cn(
                    "h-12 text-sm font-medium touch-manipulation active:scale-[0.97]",
                    tf.days === null
                      ? "col-span-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      : "hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-300"
                  )}
                  onClick={() => handleSuspendSelect(tf.days)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {tf.label}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full h-10 text-sm text-muted-foreground mt-2 touch-manipulation"
              onClick={() => setShowSuspendDrawer(false)}
            >
              Cancel
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
