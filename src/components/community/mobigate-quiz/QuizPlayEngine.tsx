import { useState, useEffect, useCallback } from "react";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOBIGATE_ANSWER_LABELS } from "@/data/mobigateQuizData";
import { getObjectiveTimePerQuestion, getNonObjectiveTimePerQuestion } from "@/data/platformSettingsData";
import { cn } from "@/lib/utils";
import { NonObjectiveQuestionCard } from "./NonObjectiveQuestionCard";

export interface QuizPlayResult {
  totalCorrect: number;
  percentage: number;
  objectiveCorrect: number;
  nonObjectiveCorrect: number;
}

interface ObjectiveQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface NonObjectiveQuestion {
  question: string;
  acceptedAnswers: string[];
}

interface QuizPlayEngineProps {
  objectiveQuestions: ObjectiveQuestion[];
  nonObjectiveQuestions: NonObjectiveQuestion[];
  onComplete: (result: QuizPlayResult) => void;
  seasonName: string;
  headerGradient?: string;
}

type Phase = "objective" | "non_objective";

export function QuizPlayEngine({
  objectiveQuestions,
  nonObjectiveQuestions,
  onComplete,
  seasonName,
  headerGradient = "from-blue-500 to-cyan-500",
}: QuizPlayEngineProps) {
  const totalQuestions = objectiveQuestions.length + nonObjectiveQuestions.length;

  const [phase, setPhase] = useState<Phase>("objective");
  const [currentQ, setCurrentQ] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(getObjectiveTimePerQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [objectiveCorrect, setObjectiveCorrect] = useState(0);

  const [currentNonObjQ, setCurrentNonObjQ] = useState(0);
  const [nonObjTimeRemaining, setNonObjTimeRemaining] = useState(getNonObjectiveTimePerQuestion());
  const [nonObjShowResult, setNonObjShowResult] = useState(false);
  const [nonObjLocked, setNonObjLocked] = useState(false);
  const [nonObjectiveAnswers, setNonObjectiveAnswers] = useState<string[]>(
    Array(nonObjectiveQuestions.length).fill("")
  );
  const [nonObjectiveCorrect, setNonObjectiveCorrect] = useState(0);

  const question = objectiveQuestions[currentQ];
  const currentNonObjQuestion = nonObjectiveQuestions[currentNonObjQ];

  // Objective timer
  useEffect(() => {
    if (phase !== "objective" || showResult) return;
    if (timeRemaining <= 0) {
      setShowResult(true);
      setTimeout(() => nextObjective(), 1500);
      return;
    }
    const timer = setInterval(() => setTimeRemaining((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, phase, showResult]);

  // Non-objective timer
  useEffect(() => {
    if (phase !== "non_objective" || nonObjShowResult || nonObjLocked) return;
    if (nonObjTimeRemaining <= 0) {
      lockNonObjAnswer(nonObjectiveAnswers[currentNonObjQ] || "");
      return;
    }
    const timer = setInterval(() => setNonObjTimeRemaining((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [nonObjTimeRemaining, phase, nonObjShowResult, nonObjLocked, currentNonObjQ]);

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    if (selectedAnswer === question.correctAnswer) setObjectiveCorrect((p) => p + 1);
    setShowResult(true);
    setTimeout(() => nextObjective(), 1500);
  };

  const nextObjective = () => {
    if (currentQ >= objectiveQuestions.length - 1) {
      setPhase("non_objective");
    } else {
      setCurrentQ((p) => p + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeRemaining(getObjectiveTimePerQuestion());
    }
  };

  const lockNonObjAnswer = useCallback(
    (answer: string) => {
      setNonObjLocked(true);
      setNonObjectiveAnswers((prev) => {
        const updated = [...prev];
        updated[currentNonObjQ] = answer;
        return updated;
      });
      setNonObjShowResult(true);

      const q = nonObjectiveQuestions[currentNonObjQ];
      const isCorrect = q.acceptedAnswers.some((a) =>
        answer.toLowerCase().includes(a.toLowerCase())
      );
      if (isCorrect) setNonObjectiveCorrect((p) => p + 1);

      setTimeout(() => {
        if (currentNonObjQ >= nonObjectiveQuestions.length - 1) {
          setObjectiveCorrect((objC) => {
            setNonObjectiveCorrect((nonObjC) => {
              const finalNonObj = nonObjC;
              const total = objC + finalNonObj;
              const pct = Math.round((total / totalQuestions) * 100);
              onComplete({
                totalCorrect: total,
                percentage: pct,
                objectiveCorrect: objC,
                nonObjectiveCorrect: finalNonObj,
              });
              return finalNonObj;
            });
            return objC;
          });
        } else {
          setCurrentNonObjQ((p) => p + 1);
          setNonObjTimeRemaining(getNonObjectiveTimePerQuestion());
          setNonObjShowResult(false);
          setNonObjLocked(false);
        }
      }, 1500);
    },
    [currentNonObjQ, nonObjectiveQuestions, totalQuestions, onComplete]
  );

  const currentNonObjIsCorrect = currentNonObjQuestion?.acceptedAnswers.some(
    (a) => (nonObjectiveAnswers[currentNonObjQ] || "").toLowerCase().includes(a.toLowerCase())
  );

  const progressValue =
    phase === "objective"
      ? ((currentQ + (showResult ? 1 : 0)) / totalQuestions) * 100
      : ((objectiveQuestions.length + currentNonObjQ + (nonObjShowResult ? 1 : 0)) / totalQuestions) * 100;

  return (
    <div className="flex flex-col h-full">
      {/* Progress */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>
            {phase === "objective"
              ? `Q${currentQ + 1}/${objectiveQuestions.length} (Objective)`
              : `Q${objectiveQuestions.length + currentNonObjQ + 1}/${totalQuestions} (Written)`}
          </span>
          <span>{Math.round(progressValue)}%</span>
        </div>
        <Progress value={progressValue} className="h-1.5 bg-blue-100 [&>div]:bg-blue-500" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 touch-auto space-y-3">
        {phase === "objective" && question && (
          <>
            <div className="flex items-center justify-center gap-2">
              <Clock className={cn("h-5 w-5", timeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-blue-600")} />
              <span className={cn("text-2xl font-bold tabular-nums", timeRemaining <= 5 && "text-red-500")}>
                {timeRemaining}s
              </span>
            </div>
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
              <CardContent className="p-4">
                <p className="text-base font-medium">{question.question}</p>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-1.5">
              {question.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => !showResult && setSelectedAnswer(idx)}
                  disabled={showResult}
                  className={cn(
                    "p-2.5 rounded-lg border-2 text-left transition-all touch-manipulation",
                    selectedAnswer === idx && !showResult && "border-blue-500 bg-blue-50",
                    showResult && idx === question.correctAnswer && "border-green-500 bg-green-50",
                    showResult && selectedAnswer === idx && idx !== question.correctAnswer && "border-red-500 bg-red-50",
                    !showResult && selectedAnswer !== idx && "border-border"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                        selectedAnswer === idx && !showResult && "bg-blue-500 text-white",
                        showResult && idx === question.correctAnswer && "bg-green-500 text-white",
                        showResult && selectedAnswer === idx && idx !== question.correctAnswer && "bg-red-500 text-white",
                        !showResult && selectedAnswer !== idx && "bg-muted"
                      )}
                    >
                      {MOBIGATE_ANSWER_LABELS[idx]}
                    </span>
                    <span className="text-sm">{opt}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {phase === "non_objective" && currentNonObjQuestion && (
          <>
            <div className="flex items-center justify-center gap-2">
              <Clock className={cn("h-5 w-5", nonObjTimeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-blue-600")} />
              <span className={cn("text-2xl font-bold tabular-nums", nonObjTimeRemaining <= 5 && "text-red-500")}>
                {nonObjTimeRemaining}s
              </span>
            </div>
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
              <CardContent className="p-3 text-center">
                <p className="text-sm font-medium">Objective Score: {objectiveCorrect}/{objectiveQuestions.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Written question {currentNonObjQ + 1} of {nonObjectiveQuestions.length}
                </p>
              </CardContent>
            </Card>
            <NonObjectiveQuestionCard
              key={currentNonObjQ}
              questionNumber={objectiveQuestions.length + currentNonObjQ + 1}
              question={currentNonObjQuestion.question}
              onAnswer={(ans) => {
                const a = [...nonObjectiveAnswers];
                a[currentNonObjQ] = ans;
                setNonObjectiveAnswers(a);
              }}
              disabled={nonObjLocked}
              showResult={nonObjShowResult}
              isCorrect={nonObjShowResult && currentNonObjIsCorrect}
            />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t px-3 py-3 bg-background">
        {phase === "objective" && (
          <Button
            className="w-full h-12 bg-blue-500 hover:bg-blue-600"
            onClick={handleConfirm}
            disabled={selectedAnswer === null || showResult}
          >
            {selectedAnswer === null
              ? "Select Answer"
              : showResult
              ? "Loading..."
              : `Confirm ${MOBIGATE_ANSWER_LABELS[selectedAnswer]}`}
          </Button>
        )}
        {phase === "non_objective" && (
          <Button
            className="w-full h-12 bg-blue-500 hover:bg-blue-600"
            onClick={() => lockNonObjAnswer(nonObjectiveAnswers[currentNonObjQ] || "")}
            disabled={nonObjLocked || !nonObjectiveAnswers[currentNonObjQ]?.trim()}
          >
            {nonObjShowResult ? "Next question..." : "Confirm Answer"}
          </Button>
        )}
      </div>
    </div>
  );
}
