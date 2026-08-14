import { useState, useEffect, useCallback } from "react";
import { X, Clock, Trophy, Zap, Loader2, Star, Wallet, BookOpen, Pencil } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOBIFACE_ANSWER_LABELS } from "@/data/mobifaceQuizData";
import { TIER_LABELS, PlayMode } from "@/data/mobifaceInteractiveQuizData";
import { getObjectiveTimePerQuestion, getNonObjectiveTimePerQuestion } from "@/data/platformSettingsData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { NonObjectiveQuestionCard } from "./NonObjectiveQuestionCard";

const API = "/api/quiz/interactive.php";

interface ObjQ { id: string; question: string; options: string[]; correctAnswer: number }
interface NonObjQ { id: string; question: string; acceptedAnswers: string[] }
interface Result { tier: string; points: number; prize: number; correct: number; total: number; percentage: number; reset: boolean }

interface InteractiveQuizPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seasonId: string;
  entryFee: number;
}

type Phase = "mode_select" | "loading" | "objective" | "non_objective" | "submitting" | "result";

export function InteractiveQuizPlayDialog({ open, onOpenChange, seasonId, entryFee }: InteractiveQuizPlayDialogProps) {
  const { toast } = useToast();
  const [phase, setPhase] = useState<Phase>("mode_select");
  const [playMode, setPlayMode] = useState<PlayMode>("mixed");
  const [playId, setPlayId] = useState<string | null>(null);
  const [feeCharged, setFeeCharged] = useState(0);
  const [objectiveQuestions, setObjectiveQuestions] = useState<ObjQ[]>([]);
  const [nonObjectiveQuestions, setNonObjectiveQuestions] = useState<NonObjQ[]>([]);
  const [result, setResult] = useState<Result | null>(null);

  const [currentQ, setCurrentQ] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(getObjectiveTimePerQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [objectiveAnswers, setObjectiveAnswers] = useState<{ question_id: string; selected_answer: number | null }[]>([]);

  const [currentNonObjQ, setCurrentNonObjQ] = useState(0);
  const [nonObjTimeRemaining, setNonObjTimeRemaining] = useState(getNonObjectiveTimePerQuestion());
  const [nonObjShowResult, setNonObjShowResult] = useState(false);
  const [nonObjLocked, setNonObjLocked] = useState(false);
  const [nonObjectiveAnswers, setNonObjectiveAnswers] = useState<string[]>(Array(5).fill(""));

  const totalQuestions = objectiveQuestions.length + nonObjectiveQuestions.length;
  const question = objectiveQuestions[currentQ];
  const currentNonObjQuestion = nonObjectiveQuestions[currentNonObjQ];

  useEffect(() => {
    if (open) { setPhase("mode_select"); setResult(null); }
  }, [open]);

  const startPlay = async (mode: PlayMode) => {
    setPlayMode(mode);
    setPhase("loading");
    try {
      const res = await fetch(API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start_play", season_id: seasonId, play_mode: mode }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Couldn't start the quiz");

      setPlayId(d.play_id);
      setFeeCharged(d.fee_charged);
      setObjectiveQuestions(d.objective ?? []);
      setNonObjectiveQuestions(d.nonObjective ?? []);
      setCurrentQ(0); setTimeRemaining(getObjectiveTimePerQuestion()); setSelectedAnswer(null); setShowResult(false); setObjectiveAnswers([]);
      setCurrentNonObjQ(0); setNonObjTimeRemaining(getNonObjectiveTimePerQuestion()); setNonObjShowResult(false); setNonObjLocked(false);
      setNonObjectiveAnswers(Array((d.nonObjective ?? []).length).fill(""));
      setPhase("objective");
    } catch (e: any) {
      toast({ title: "Couldn't Start", description: e.message, variant: "destructive" });
      onOpenChange(false);
    }
  };

  useEffect(() => {
    if (phase !== "objective" || showResult || !open) return;
    if (timeRemaining <= 0) { setShowResult(true); setTimeout(() => nextObjective(), 1500); return; }
    const timer = setInterval(() => setTimeRemaining(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, phase, showResult, open]);

  useEffect(() => {
    if (phase !== "non_objective" || nonObjShowResult || nonObjLocked || !open) return;
    if (nonObjTimeRemaining <= 0) { lockNonObjAnswer(nonObjectiveAnswers[currentNonObjQ] || ""); return; }
    const timer = setInterval(() => setNonObjTimeRemaining(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [nonObjTimeRemaining, phase, nonObjShowResult, nonObjLocked, open, currentNonObjQ]);

  const handleConfirm = () => {
    if (selectedAnswer === null || !question) return;
    setObjectiveAnswers(prev => [...prev, { question_id: question.id, selected_answer: selectedAnswer }]);
    setShowResult(true);
    setTimeout(() => nextObjective(), 1500);
  };

  const nextObjective = () => {
    if (currentQ >= objectiveQuestions.length - 1) {
      if (nonObjectiveQuestions.length > 0) setPhase("non_objective");
      else submitPlay(objectiveAnswers, []);
    } else {
      setCurrentQ(p => p + 1); setSelectedAnswer(null); setShowResult(false); setTimeRemaining(getObjectiveTimePerQuestion());
    }
  };

  const lockNonObjAnswer = useCallback((answer: string) => {
    setNonObjLocked(true);
    setNonObjectiveAnswers(prev => { const u = [...prev]; u[currentNonObjQ] = answer; return u; });
    setNonObjShowResult(true);
    setTimeout(() => {
      if (currentNonObjQ >= nonObjectiveQuestions.length - 1) {
        const finalAnswers = [...nonObjectiveAnswers]; finalAnswers[currentNonObjQ] = answer;
        submitPlay(objectiveAnswers, nonObjectiveQuestions.map((q, i) => ({ question_id: q.id, text: finalAnswers[i] || "" })));
      } else {
        setCurrentNonObjQ(p => p + 1); setNonObjTimeRemaining(getNonObjectiveTimePerQuestion()); setNonObjShowResult(false); setNonObjLocked(false);
      }
    }, 1500);
  }, [currentNonObjQ, nonObjectiveQuestions, nonObjectiveAnswers, objectiveAnswers]);

  const submitPlay = async (objAnswers: typeof objectiveAnswers, nonObjAnswers: { question_id: string; text: string }[]) => {
    setPhase("submitting");
    try {
      const res = await fetch(API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit_play", play_id: playId, objective_answers: objAnswers, non_objective_answers: nonObjAnswers }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Couldn't submit your result");
      setResult(d);
      setPhase("result");
    } catch (e: any) {
      toast({ title: "Couldn't Submit", description: e.message, variant: "destructive" });
      onOpenChange(false);
    }
  };

  const currentNonObjIsCorrect = currentNonObjQuestion?.acceptedAnswers?.some(
    a => (nonObjectiveAnswers[currentNonObjQ] || "").toLowerCase().includes(a.toLowerCase())
  );
  const progressValue = phase === "objective"
    ? totalQuestions > 0 ? ((currentQ + (showResult ? 1 : 0)) / totalQuestions) * 100 : 0
    : phase === "non_objective"
      ? totalQuestions > 0 ? ((objectiveQuestions.length + currentNonObjQ + (nonObjShowResult ? 1 : 0)) / totalQuestions) * 100 : 0
      : 100;

  const tierInfo = result ? TIER_LABELS[result.tier] : null;

  return (
    <Dialog open={open} onOpenChange={(v) => {
      if (!v && (phase === "objective" || phase === "non_objective")) {
        if (!confirm("Exit now? Your stake has already been deducted and this attempt will be forfeited.")) return;
      }
      onOpenChange(v);
    }}>
      <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-500 to-cyan-500 border-b p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5" />
              <div>
                <h2 className="font-semibold text-sm">Interactive Quiz</h2>
                <p className="text-xs text-indigo-100">
                  {phase === "mode_select" && "Choose your mode"}
                  {phase === "loading" && "Loading..."}
                  {phase === "objective" && `Q${currentQ + 1}/${objectiveQuestions.length} (Objective)`}
                  {phase === "non_objective" && `Q${objectiveQuestions.length + 1 + currentNonObjQ}/${totalQuestions} (Written)`}
                  {phase === "submitting" && "Submitting..."}
                  {phase === "result" && "Result"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-white hover:bg-white/20"><X className="h-4 w-4" /></Button>
          </div>
          {(phase === "objective" || phase === "non_objective") && (
            <div className="mt-2"><Progress value={progressValue} className="h-1.5 bg-indigo-400 [&>div]:bg-white" /></div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {phase === "mode_select" && (
            <div className="space-y-4">
              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="p-3 flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-red-600" />
                  <p className="text-sm">Entry fee: <span className="font-bold text-red-600">{formatMobiAmount(entryFee)}</span></p>
                </CardContent>
              </Card>
              <button onClick={() => startPlay("mixed")} className="w-full text-left">
                <Card className="hover:border-indigo-400 transition-all touch-manipulation">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg"><BookOpen className="h-5 w-5 text-indigo-600" /></div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">Mixed Mode</h4>
                      <p className="text-xs text-muted-foreground">10 objective + 5 written questions. 100% = 500% prize.</p>
                    </div>
                  </CardContent>
                </Card>
              </button>
              <button onClick={() => startPlay("objectives_only")} className="w-full text-left">
                <Card className="hover:border-indigo-400 transition-all touch-manipulation">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg"><Pencil className="h-5 w-5 text-cyan-600" /></div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">Objectives Only</h4>
                      <p className="text-xs text-muted-foreground">15 objective questions. 100% = 350% prize, 12-14 correct = 20% consolation.</p>
                    </div>
                  </CardContent>
                </Card>
              </button>
              <div className="text-xs text-muted-foreground text-center">
                Score below 60% resets your accumulated season points to zero.
              </div>
            </div>
          )}

          {(phase === "loading" || phase === "submitting") && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">{phase === "loading" ? "Setting up your quiz..." : "Submitting your result..."}</p>
            </div>
          )}

          {phase === "objective" && question && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Clock className={cn("h-5 w-5", timeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-indigo-600")} />
                <span className={cn("text-2xl font-bold tabular-nums", timeRemaining <= 5 && "text-red-500")}>{timeRemaining}s</span>
              </div>
              <Card className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200"><CardContent className="p-4"><p className="text-base font-medium">{question.question}</p></CardContent></Card>
              <div className="grid grid-cols-2 gap-2">
                {question.options.map((opt, idx) => (
                  <button key={idx} onClick={() => !showResult && setSelectedAnswer(idx)} disabled={showResult}
                    className={cn("p-3 rounded-lg border-2 text-left transition-all touch-manipulation",
                      selectedAnswer === idx && !showResult && "border-indigo-500 bg-indigo-50",
                      showResult && idx === question.correctAnswer && "border-green-500 bg-green-50",
                      showResult && selectedAnswer === idx && idx !== question.correctAnswer && "border-red-500 bg-red-50",
                      !showResult && selectedAnswer !== idx && "border-border"
                    )}>
                    <div className="flex items-start gap-2">
                      <span className={cn("flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                        selectedAnswer === idx && !showResult && "bg-indigo-500 text-white",
                        showResult && idx === question.correctAnswer && "bg-green-500 text-white",
                        showResult && selectedAnswer === idx && idx !== question.correctAnswer && "bg-red-500 text-white",
                        !showResult && selectedAnswer !== idx && "bg-muted"
                      )}>{MOBIFACE_ANSWER_LABELS[idx]}</span>
                      <span className="text-sm">{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === "non_objective" && currentNonObjQuestion && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Clock className={cn("h-5 w-5", nonObjTimeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-indigo-600")} />
                <span className={cn("text-2xl font-bold tabular-nums", nonObjTimeRemaining <= 5 && "text-red-500")}>{nonObjTimeRemaining}s</span>
              </div>
              <Card className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200"><CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground">Written question {currentNonObjQ + 1} of {nonObjectiveQuestions.length}</p>
              </CardContent></Card>
              <NonObjectiveQuestionCard
                key={currentNonObjQ}
                questionNumber={objectiveQuestions.length + 1 + currentNonObjQ}
                question={currentNonObjQuestion.question}
                onAnswer={(ans) => { const a = [...nonObjectiveAnswers]; a[currentNonObjQ] = ans; setNonObjectiveAnswers(a); }}
                disabled={nonObjLocked}
                showResult={nonObjShowResult}
                isCorrect={nonObjShowResult && !!currentNonObjIsCorrect}
              />
            </div>
          )}

          {phase === "result" && result && tierInfo && (
            <div className="space-y-4">
              <Card className={cn("border-2", result.reset ? "border-red-400 bg-red-50" : result.prize > 0 ? "border-green-500 bg-green-50" : "border-muted")}>
                <CardContent className="p-6 text-center space-y-3">
                  <p className="text-4xl">{tierInfo.emoji}</p>
                  <h2 className={cn("text-xl font-bold", tierInfo.color)}>{tierInfo.label}</h2>
                  <p className="text-sm text-muted-foreground">{result.correct}/{result.total} correct ({result.percentage}%)</p>
                  {result.prize > 0 && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">Instant Prize</p>
                      <p className="text-2xl font-bold text-green-600">{formatLocalAmount(result.prize, "NGN")}</p>
                      <p className="text-xs text-muted-foreground">({formatMobiAmount(result.prize)})</p>
                    </div>
                  )}
                  {result.reset && (
                    <p className="text-xs text-red-600 font-medium">Your accumulated season points have been reset to zero.</p>
                  )}
                </CardContent>
              </Card>
              <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg text-xs text-muted-foreground">
                <Trophy className="h-4 w-4 text-indigo-500 shrink-0" />
                <p>Points earned this round: <span className="font-semibold text-indigo-600">+{result.points}</span> — check your season progress for qualification status.</p>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-10 bg-background border-t p-4">
          {phase === "objective" && (
            <Button className="w-full h-12 bg-indigo-500 hover:bg-indigo-600" onClick={handleConfirm} disabled={selectedAnswer === null || showResult}>
              {selectedAnswer === null ? "Select Answer" : showResult ? "Loading..." : `Confirm ${MOBIFACE_ANSWER_LABELS[selectedAnswer]}`}
            </Button>
          )}
          {phase === "non_objective" && (
            <Button className="w-full h-12 bg-indigo-500 hover:bg-indigo-600" onClick={() => lockNonObjAnswer(nonObjectiveAnswers[currentNonObjQ] || "")} disabled={nonObjLocked || !nonObjectiveAnswers[currentNonObjQ]?.trim()}>
              {nonObjShowResult ? "Next question..." : "Confirm Answer"}
            </Button>
          )}
          {phase === "result" && (
            <Button className="w-full h-12 bg-gradient-to-r from-indigo-500 to-cyan-500" onClick={() => onOpenChange(false)}>
              <Zap className="h-4 w-4 mr-2" /> Done
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
