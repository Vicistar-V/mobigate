import { useState, useEffect, useCallback } from "react";
import { X, Clock, Trophy, CheckCircle, XCircle, Zap, ArrowRight, LogOut, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MOBIFACE_ANSWER_LABELS } from "@/data/mobifaceQuizData";
import { getObjectiveTimePerQuestion, getNonObjectiveTimePerQuestion } from "@/data/platformSettingsData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { NonObjectiveQuestionCard } from "./NonObjectiveQuestionCard";
import { QuizPrizeRedemptionSheet } from "./QuizPrizeRedemptionSheet";

const API = "/api/quiz/standard.php";

interface ObjectiveQuestion { id: string; question: string; options: string[]; correctAnswer: number; timeLimit: number }
interface NonObjectiveQuestion { id: string; question: string; acceptedAnswers: string[] }

interface StandardQuizContinueSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
  levelName: string;
  stake: number;
  baseWinning: number;
  communityId?: string;
}

type GamePhase = "loading" | "playing" | "non_objective" | "evaluating" | "session_result" | "continue_choice" | "game_over" | "error";

export function StandardQuizContinueSheet({ open, onOpenChange, category, levelName, stake, baseWinning, communityId }: StandardQuizContinueSheetProps) {
  const { toast } = useToast();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [objectiveQuestions, setObjectiveQuestions] = useState<ObjectiveQuestion[]>([]);
  const [nonObjectiveQuestions, setNonObjectiveQuestions] = useState<NonObjectiveQuestion[]>([]);
  const [currentWinning, setCurrentWinning] = useState(baseWinning);
  const totalQuestions = objectiveQuestions.length + nonObjectiveQuestions.length;

  // Objective state
  const [currentQ, setCurrentQ] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(getObjectiveTimePerQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [objectiveAnswers, setObjectiveAnswers] = useState<{ question_id: string; selected_answer: number | null }[]>([]);

  // Non-objective state
  const [currentNonObjQ, setCurrentNonObjQ] = useState(0);
  const [nonObjTimeRemaining, setNonObjTimeRemaining] = useState(getNonObjectiveTimePerQuestion());
  const [nonObjShowResult, setNonObjShowResult] = useState(false);
  const [nonObjLocked, setNonObjLocked] = useState(false);
  const [nonObjectiveAnswers, setNonObjectiveAnswers] = useState<string[]>(Array(5).fill(""));

  const [phase, setPhase] = useState<GamePhase>("loading");
  const [session, setSession] = useState(1);
  const [totalPrize, setTotalPrize] = useState(0);
  const [showRedemption, setShowRedemption] = useState(false);
  const [lastResult, setLastResult] = useState<{ objectiveCorrect: number; nonObjectiveCorrect: number; totalCorrect: number; amountWon: number } | null>(null);

  const question = objectiveQuestions[currentQ];
  const currentNonObjQuestion = nonObjectiveQuestions[currentNonObjQ];

  const startSession = useCallback(async (sessionNum: number) => {
    setPhase("loading");
    try {
      const res = await fetch(API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start_session", category, level_name: levelName, stake, base_winning: baseWinning, session_number: sessionNum, community_id: communityId }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Couldn't start the session");

      setSessionId(d.session_id);
      setObjectiveQuestions(d.objective);
      setNonObjectiveQuestions(d.nonObjective);
      setCurrentWinning(d.current_winning);
      setCurrentQ(0);
      setTimeRemaining(getObjectiveTimePerQuestion());
      setSelectedAnswer(null);
      setShowResult(false);
      setObjectiveAnswers([]);
      setCurrentNonObjQ(0);
      setNonObjTimeRemaining(getNonObjectiveTimePerQuestion());
      setNonObjShowResult(false);
      setNonObjLocked(false);
      setNonObjectiveAnswers(Array(5).fill(""));
      setPhase("playing");
    } catch (e: any) {
      toast({ title: "Couldn't Start Quiz", description: e.message, variant: "destructive" });
      setPhase("error");
    }
  }, [category, levelName, stake, baseWinning, toast]);

  useEffect(() => {
    if (open) {
      setSession(1);
      setTotalPrize(0);
      setLastResult(null);
      startSession(1);
    }
  }, [open]);

  // Objective timer
  useEffect(() => {
    if (phase !== "playing" || showResult || !open) return;
    if (timeRemaining <= 0) {
      setShowResult(true);
      setTimeout(() => nextObjective(), 1500);
      return;
    }
    const timer = setInterval(() => setTimeRemaining(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, phase, showResult, open]);

  // Non-objective timer
  useEffect(() => {
    if (phase !== "non_objective" || nonObjShowResult || nonObjLocked || !open) return;
    if (nonObjTimeRemaining <= 0) {
      lockNonObjAnswer(nonObjectiveAnswers[currentNonObjQ] || "");
      return;
    }
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
      setPhase("non_objective");
    } else {
      setCurrentQ(p => p + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeRemaining(getObjectiveTimePerQuestion());
    }
  };

  const lockNonObjAnswer = useCallback((answer: string) => {
    setNonObjLocked(true);
    setNonObjectiveAnswers(prev => { const updated = [...prev]; updated[currentNonObjQ] = answer; return updated; });
    setNonObjShowResult(true);
    setTimeout(() => {
      if (currentNonObjQ >= nonObjectiveQuestions.length - 1) {
        evaluateSession(answer);
      } else {
        setCurrentNonObjQ(p => p + 1);
        setNonObjTimeRemaining(getNonObjectiveTimePerQuestion());
        setNonObjShowResult(false);
        setNonObjLocked(false);
      }
    }, 1500);
  }, [currentNonObjQ, nonObjectiveQuestions.length]);

  const evaluateSession = async (finalNonObjAnswer: string) => {
    if (!sessionId) return;
    setPhase("evaluating");

    const finalNonObjAnswers = [...nonObjectiveAnswers];
    finalNonObjAnswers[currentNonObjQ] = finalNonObjAnswer;
    const nonObjPayload = nonObjectiveQuestions.map((q, i) => ({ question_id: q.id, text: finalNonObjAnswers[i] || "" }));

    try {
      const res = await fetch(API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit_session", session_id: sessionId, objective_answers: objectiveAnswers, non_objective_answers: nonObjPayload }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Couldn't submit your result");
      if (!d.status) throw new Error("Server didn't confirm the result — please check your wallet and try again.");

      setLastResult({ objectiveCorrect: d.objectiveCorrect, nonObjectiveCorrect: d.nonObjectiveCorrect, totalCorrect: d.totalCorrect, amountWon: d.amountWon });

      if (d.status === "won_full") {
        setTotalPrize(p => p + d.amountWon);
        setPhase(session >= 10 ? "game_over" : "continue_choice");
      } else if (d.status === "won_partial") {
        setTotalPrize(p => p + d.amountWon);
        setPhase("session_result");
      } else {
        setTotalPrize(0);
        setPhase("game_over");
      }
    } catch (e: any) {
      toast({ title: "Couldn't Submit Result", description: e.message, variant: "destructive" });
      setPhase("error");
    }
  };

  const handleContinue = () => {
    toast({ title: "Next Session!", description: `${formatMobiAmount(stake)} deducted for session ${session + 1}` });
    setSession(p => p + 1);
    startSession(session + 1);
  };

  const handleExit = () => {
    if (totalPrize > 0) {
      setShowRedemption(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleCloseAttempt = () => {
    if (phase === "playing" || phase === "non_objective" || phase === "evaluating") {
      if (!confirm("Exit now? Your stake for this session has already been deducted and will be forfeited.")) return;
    }
    onOpenChange(false);
  };

  const currentNonObjIsCorrect = currentNonObjQuestion?.acceptedAnswers?.some(
    a => (nonObjectiveAnswers[currentNonObjQ] || "").toLowerCase().includes(a.toLowerCase())
  );

  const progressValue = phase === "playing"
    ? totalQuestions > 0 ? ((currentQ + (showResult ? 1 : 0)) / totalQuestions) * 100 : 0
    : phase === "non_objective"
      ? totalQuestions > 0 ? ((objectiveQuestions.length + currentNonObjQ + (nonObjShowResult ? 1 : 0)) / totalQuestions) * 100 : 0
      : 100;

  return (
    <>
      <Dialog open={open && !showRedemption} onOpenChange={(v) => { if (!v) handleCloseAttempt(); }}>
        <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-amber-500 to-orange-500 border-b p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-sm">{category}</h2>
                <p className="text-xs text-amber-200">
                  {levelName} • Session {session}/10 •{" "}
                  {phase === "playing" && `Q${currentQ + 1}/${objectiveQuestions.length || 10} (Objective)`}
                  {phase === "non_objective" && `Q${objectiveQuestions.length + currentNonObjQ + 1}/${totalQuestions || 15} (Written)`}
                  {phase === "loading" && "Loading..."}
                  {phase === "evaluating" && "Scoring..."}
                  {(phase === "session_result" || phase === "continue_choice" || phase === "game_over") && "Results"}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseAttempt} className="h-8 w-8 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
            {(phase === "playing" || phase === "non_objective") && (
              <Progress value={progressValue} className="h-1.5 mt-2 bg-amber-400 [&>div]:bg-white" />
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {(phase === "loading" || phase === "evaluating") && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm">{phase === "loading" ? "Setting up your quiz..." : "Submitting your result..."}</p>
              </div>
            )}

            {phase === "error" && (
              <Card className="border-red-300 bg-red-50"><CardContent className="p-6 text-center text-sm text-muted-foreground">
                Something went wrong. Please close and try again.
              </CardContent></Card>
            )}

            {/* Objective Phase */}
            {phase === "playing" && question && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Clock className={cn("h-5 w-5", timeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-amber-600")} />
                  <span className={cn("text-2xl font-bold tabular-nums", timeRemaining <= 5 && "text-red-500")}>{timeRemaining}s</span>
                </div>
                <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200">
                  <CardContent className="p-4"><p className="text-base font-medium">{question.question}</p></CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((opt, idx) => (
                    <button key={idx} onClick={() => !showResult && setSelectedAnswer(idx)} disabled={showResult}
                      className={cn("p-3 rounded-lg border-2 text-left transition-all touch-manipulation",
                        selectedAnswer === idx && !showResult && "border-amber-500 bg-amber-50",
                        showResult && idx === question.correctAnswer && "border-green-500 bg-green-50",
                        showResult && selectedAnswer === idx && idx !== question.correctAnswer && "border-red-500 bg-red-50",
                        !showResult && selectedAnswer !== idx && "border-border"
                      )}>
                      <div className="flex items-start gap-2">
                        <span className={cn("flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                          selectedAnswer === idx && !showResult && "bg-amber-500 text-white",
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

            {/* Non-Objective Phase */}
            {phase === "non_objective" && currentNonObjQuestion && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Clock className={cn("h-5 w-5", nonObjTimeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-amber-600")} />
                  <span className={cn("text-2xl font-bold tabular-nums", nonObjTimeRemaining <= 5 && "text-red-500")}>{nonObjTimeRemaining}s</span>
                </div>
                <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">Objective Score: {objectiveAnswers.filter((a, i) => a.selected_answer === objectiveQuestions[i]?.correctAnswer).length}/{objectiveQuestions.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Written question {currentNonObjQ + 1} of {nonObjectiveQuestions.length}</p>
                  </CardContent>
                </Card>
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

            {phase === "session_result" && lastResult && (
              <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30">
                <CardContent className="p-6 text-center space-y-3">
                  <p className="text-4xl">⭐</p>
                  <h3 className="font-bold text-lg">Partial Win!</h3>
                  <p className="text-sm text-muted-foreground">{lastResult.totalCorrect}/{totalQuestions} correct (80%+)</p>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                      <p className="text-[10px] text-muted-foreground">Objective</p>
                      <p className="font-bold text-sm">{lastResult.objectiveCorrect}/{objectiveQuestions.length}</p>
                    </div>
                    <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-center">
                      <p className="text-[10px] text-muted-foreground">Written</p>
                      <p className="font-bold text-sm">{lastResult.nonObjectiveCorrect}/{nonObjectiveQuestions.length}</p>
                    </div>
                  </div>
                  <p className="text-sm">Won: <span className="font-bold text-green-600">{formatMobiAmount(lastResult.amountWon)}</span></p>
                  <p className="text-sm font-medium">Total Prize: <span className="text-green-600">{formatMobiAmount(totalPrize)}</span></p>
                </CardContent>
              </Card>
            )}

            {phase === "continue_choice" && lastResult && (
              <div className="space-y-4">
                <Card className="border-green-300 bg-green-50 dark:bg-green-950/30">
                  <CardContent className="p-6 text-center space-y-3">
                    <p className="text-4xl">🔥</p>
                    <h3 className="font-bold text-lg">Perfect Score!</h3>
                    <p className="text-sm text-muted-foreground">{totalQuestions}/{totalQuestions} correct - Session {session} complete!</p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                        <p className="text-[10px] text-muted-foreground">Objective</p>
                        <p className="font-bold text-sm">{lastResult.objectiveCorrect}/{objectiveQuestions.length}</p>
                      </div>
                      <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-center">
                        <p className="text-[10px] text-muted-foreground">Written</p>
                        <p className="font-bold text-sm">{lastResult.nonObjectiveCorrect}/{nonObjectiveQuestions.length}</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">Current Prize</p>
                      <p className="text-2xl font-bold text-green-600">{formatLocalAmount(totalPrize, "NGN")}</p>
                      <p className="text-xs text-muted-foreground">({formatMobiAmount(totalPrize)})</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-200">
                  <CardContent className="p-4 space-y-3">
                    <h4 className="text-sm font-bold text-center">Continue to Session {session + 1}?</h4>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg">
                        <p className="text-[10px] text-muted-foreground">Extra Stake</p>
                        <p className="font-bold text-xs text-red-600">{formatMobiAmount(stake)}</p>
                      </div>
                      <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <p className="text-[10px] text-muted-foreground">Next Prize</p>
                        <p className="font-bold text-xs text-green-600">{formatMobiAmount(baseWinning * Math.pow(2, session))}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-destructive text-center">⚠️ If you fail, you lose ALL unredeemed prizes!</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {phase === "game_over" && (
              <Card className={cn("border-2", totalPrize > 0 ? "border-green-500 bg-green-50" : "border-red-300 bg-red-50")}>
                <CardContent className="p-6 text-center space-y-3">
                  <p className="text-4xl">{totalPrize > 0 ? "🏆" : "😞"}</p>
                  <h3 className="font-bold text-lg">{totalPrize > 0 ? "Congratulations!" : "Game Over"}</h3>
                  {totalPrize > 0 ? (
                    <div>
                      <p className="text-sm text-muted-foreground">Total Won</p>
                      <p className="text-2xl font-bold text-green-600">{formatLocalAmount(totalPrize, "NGN")}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Better luck next time!</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="sticky bottom-0 z-10 bg-background border-t p-4">
            {phase === "playing" && (
              <Button className="w-full h-12 bg-amber-500 hover:bg-amber-600" onClick={handleConfirm} disabled={selectedAnswer === null || showResult}>
                {selectedAnswer === null ? "Select Answer" : showResult ? "Loading..." : `Confirm ${MOBIFACE_ANSWER_LABELS[selectedAnswer]}`}
              </Button>
            )}
            {phase === "non_objective" && (
              <Button
                className="w-full h-12 bg-amber-500 hover:bg-amber-600"
                onClick={() => lockNonObjAnswer(nonObjectiveAnswers[currentNonObjQ] || "")}
                disabled={nonObjLocked || !nonObjectiveAnswers[currentNonObjQ]?.trim()}
              >
                {nonObjShowResult ? "Next question..." : "Confirm Answer"}
              </Button>
            )}
            {phase === "session_result" && (
              <Button className="w-full h-12" onClick={handleExit}>
                <LogOut className="h-4 w-4 mr-2" /> Exit with Prize
              </Button>
            )}
            {phase === "continue_choice" && (
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12" onClick={handleExit}>
                  <LogOut className="h-4 w-4 mr-2" /> Exit
                </Button>
                <Button className="h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white" onClick={handleContinue}>
                  <ArrowRight className="h-4 w-4 mr-2" /> Continue
                </Button>
              </div>
            )}
            {phase === "game_over" && (
              <Button className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500" onClick={handleExit}>
                {totalPrize > 0 ? "Claim Prize" : "Exit"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <QuizPrizeRedemptionSheet
        open={showRedemption}
        onOpenChange={(v) => { if (!v) { setShowRedemption(false); onOpenChange(false); } }}
        prizeAmount={totalPrize}
        prizeType="cash"
      />
    </>
  );
}
