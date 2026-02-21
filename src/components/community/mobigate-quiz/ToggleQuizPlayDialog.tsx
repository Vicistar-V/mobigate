import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Repeat, Trophy, AlertTriangle, Star, Timer, ArrowRight, ChevronRight, Award, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { NonObjectiveQuestionCard } from "./NonObjectiveQuestionCard";
import {
  TOGGLE_SESSIONS,
  TOGGLE_ANSWER_LABELS,
  pickToggleQuestions,
  type ToggleObjectiveQuestion,
  type ToggleNonObjectiveQuestion,
} from "@/data/toggleQuizData";

interface ToggleQuizPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Phase = "setup" | "playing_obj" | "playing_nonobj" | "session_win" | "session_fail" | "celebrity";

const STAKE_AMOUNT = 500;

export function ToggleQuizPlayDialog({ open, onOpenChange }: ToggleQuizPlayDialogProps) {
  const { toast } = useToast();

  // Session state
  const [sessionIndex, setSessionIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("setup");
  const [totalStakeCharged, setTotalStakeCharged] = useState(0);

  // Question state
  const [objectives, setObjectives] = useState<ToggleObjectiveQuestion[]>([]);
  const [nonObjectives, setNonObjectives] = useState<ToggleNonObjectiveQuestion[]>([]);
  const [objIndex, setObjIndex] = useState(0);
  const [nonObjIndex, setNonObjIndex] = useState(0);
  const [objCorrect, setObjCorrect] = useState(0);
  const [nonObjCorrect, setNonObjCorrect] = useState(0);

  // Timer
  const [timeLeft, setTimeLeft] = useState(10);

  // Answer state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showObjResult, setShowObjResult] = useState(false);
  const [nonObjAnswer, setNonObjAnswer] = useState("");
  const [nonObjShowResult, setNonObjShowResult] = useState(false);

  const session = TOGGLE_SESSIONS[sessionIndex];
  const currentPrize = STAKE_AMOUNT * session.multiplier;

  // Reset on open
  useEffect(() => {
    if (open) {
      setSessionIndex(0);
      setPhase("setup");
      setTotalStakeCharged(0);
    }
  }, [open]);

  // Timer for objective questions
  useEffect(() => {
    if (phase !== "playing_obj" || showObjResult) return;
    if (timeLeft <= 0) {
      handleObjTimeUp();
      return;
    }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, showObjResult]);

  // Timer for non-objective questions
  useEffect(() => {
    if (phase !== "playing_nonobj" || nonObjShowResult) return;
    if (timeLeft <= 0) {
      lockNonObjAnswer("");
      return;
    }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, nonObjShowResult]);

  const startSession = useCallback((idx: number) => {
    const picked = pickToggleQuestions(idx);
    setObjectives(picked.objectives);
    setNonObjectives(picked.nonObjectives);
    setObjIndex(0);
    setNonObjIndex(0);
    setObjCorrect(0);
    setNonObjCorrect(0);
    setSelectedAnswer(null);
    setShowObjResult(false);
    setNonObjAnswer("");
    setNonObjShowResult(false);
    setTimeLeft(10);
    setTotalStakeCharged(prev => prev + STAKE_AMOUNT);
    setPhase("playing_obj");
    toast({ title: `🎯 Session ${idx + 1} Started!`, description: `${TOGGLE_SESSIONS[idx].label} multiplier — ${TOGGLE_SESSIONS[idx].total} questions` });
  }, [toast]);

  const handleObjTimeUp = () => {
    // Time expired = wrong answer
    setShowObjResult(true);
    setTimeout(() => failSession(), 1500);
  };

  const handleObjSelect = (answerIdx: number) => {
    if (showObjResult || selectedAnswer !== null) return;
    setSelectedAnswer(answerIdx);
  };

  const handleObjConfirm = () => {
    if (selectedAnswer === null) return;
    const q = objectives[objIndex];
    const correct = selectedAnswer === q.correctAnswer;
    setShowObjResult(true);

    if (!correct) {
      setTimeout(() => failSession(), 1500);
      return;
    }

    setObjCorrect(p => p + 1);
    setTimeout(() => {
      if (objIndex + 1 < objectives.length) {
        setObjIndex(p => p + 1);
        setSelectedAnswer(null);
        setShowObjResult(false);
        setTimeLeft(10);
      } else {
        // Move to non-objective phase
        if (nonObjectives.length > 0) {
          setPhase("playing_nonobj");
          setTimeLeft(15);
          setNonObjAnswer("");
          setNonObjShowResult(false);
        } else {
          sessionWon();
        }
      }
    }, 1000);
  };

  const lockNonObjAnswer = useCallback((answer: string) => {
    if (nonObjShowResult) return;
    setNonObjShowResult(true);
    const q = nonObjectives[nonObjIndex];
    const isCorrect = q.acceptedAnswers.some(a => answer.toLowerCase().includes(a.toLowerCase())) && answer.trim().length > 0;

    if (!isCorrect) {
      setTimeout(() => failSession(), 1500);
      return;
    }

    setNonObjCorrect(p => p + 1);
    setTimeout(() => {
      if (nonObjIndex + 1 < nonObjectives.length) {
        setNonObjIndex(p => p + 1);
        setNonObjAnswer("");
        setNonObjShowResult(false);
        setTimeLeft(15);
      } else {
        sessionWon();
      }
    }, 1500);
  }, [nonObjShowResult, nonObjectives, nonObjIndex]);

  const sessionWon = () => {
    if (sessionIndex === 6) {
      setPhase("celebrity");
      toast({ title: "🏆 MOBI CELEBRITY!", description: "You completed all 7 Toggle Sessions!" });
    } else {
      setPhase("session_win");
    }
  };

  const failSession = () => {
    setPhase("session_fail");
    toast({ title: "❌ Session Failed", description: "You lost everything. Better luck next time!", variant: "destructive" });
  };

  const handleToggle = () => {
    const nextIdx = sessionIndex + 1;
    setSessionIndex(nextIdx);
    startSession(nextIdx);
  };

  const handleTakePrize = () => {
    toast({ title: "💰 Prize Claimed!", description: `You won ${formatMobiAmount(currentPrize)}!` });
    onOpenChange(false);
  };

  const handleExit = () => {
    onOpenChange(false);
  };

  const currentObjQuestion = objectives[objIndex];
  const currentNonObjQuestion = nonObjectives[nonObjIndex];
  const totalAnswered = phase === "playing_obj" ? objIndex : objectives.length + nonObjIndex;
  const totalQs = session.total;
  const progress = (totalAnswered / totalQs) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="p-3 pb-2 sticky top-0 bg-gradient-to-r from-teal-500 to-cyan-600 z-10 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-full">
                <Repeat className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold flex items-center gap-1.5">
                  Toggle Quiz <Zap className="h-3 w-3" />
                </h2>
                <p className="text-[10px] text-teal-100">
                  {phase === "setup" ? "High-Stakes Escalating Sessions" :
                    `Session ${sessionIndex + 1}/7 — ${session.label} Prize`}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleExit} className="h-7 w-7 text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {phase !== "setup" && phase !== "session_win" && phase !== "session_fail" && phase !== "celebrity" && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span>Q{totalAnswered + 1} of {totalQs}</span>
                <span className="flex items-center gap-1"><Timer className="h-3 w-3" /> {timeLeft}s</span>
              </div>
              <Progress value={progress} className="h-1.5 bg-white/20" />
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 max-h-[calc(95vh-80px)]">
          <div className="p-4 space-y-4">
            {/* SETUP PHASE */}
            {phase === "setup" && (
              <div className="space-y-4">
                <Card className="border-teal-200 dark:border-teal-800 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-teal-600" />
                      <h3 className="font-bold text-sm">How Toggle Quiz Works</h3>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                      <li className="flex gap-2"><span className="text-teal-500 font-bold">1.</span> Answer ALL questions correctly (100%) to win a session</li>
                      <li className="flex gap-2"><span className="text-teal-500 font-bold">2.</span> After winning, choose: <strong>Take Prize</strong> or <strong>Toggle</strong> to next session</li>
                      <li className="flex gap-2"><span className="text-teal-500 font-bold">3.</span> Toggling <strong>cancels previous winnings</strong> — only the new prize matters</li>
                      <li className="flex gap-2"><span className="text-teal-500 font-bold">4.</span> Stake of <strong>{formatMobiAmount(STAKE_AMOUNT)}</strong> is charged each session</li>
                      <li className="flex gap-2"><span className="text-teal-500 font-bold">5.</span> Fail any session = <strong>lose everything</strong></li>
                      <li className="flex gap-2"><span className="text-amber-500 font-bold">★</span> Complete all 7 sessions = <strong>Mobi Celebrity Badge!</strong></li>
                    </ul>
                  </CardContent>
                </Card>

                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Session Prizes</h4>
                <div className="space-y-2">
                  {TOGGLE_SESSIONS.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-teal-300 text-teal-700 dark:text-teal-300">S{s.session}</Badge>
                        <span className="text-xs">{s.objectives} Obj + {s.nonObjectives} Written</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-xs text-teal-700 dark:text-teal-300">{s.label}</span>
                        <p className="text-[10px] text-muted-foreground">{formatMobiAmount(STAKE_AMOUNT * s.multiplier)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold text-sm touch-manipulation"
                  onClick={() => startSession(0)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Start Session 1 — Stake {formatMobiAmount(STAKE_AMOUNT)}
                </Button>
              </div>
            )}

            {/* OBJECTIVE PLAYING PHASE */}
            {phase === "playing_obj" && currentObjQuestion && (
              <div className="space-y-3">
                <Card className="border-teal-200 dark:border-teal-800">
                  <CardContent className="p-3">
                    <Badge className="mb-2 bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 text-[10px]">Objective</Badge>
                    <p className="text-sm font-medium leading-relaxed">{currentObjQuestion.question}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-2">
                  {currentObjQuestion.options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === currentObjQuestion.correctAnswer;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleObjSelect(idx)}
                        disabled={showObjResult}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg border-2 text-left text-sm transition-all touch-manipulation",
                          !showObjResult && isSelected && "border-teal-500 bg-teal-50 dark:bg-teal-950/30",
                          !showObjResult && !isSelected && "border-border hover:border-teal-300",
                          showObjResult && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/30",
                          showObjResult && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/30",
                        )}
                      >
                        <span className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                          isSelected ? "bg-teal-500 text-white" : "bg-muted text-muted-foreground"
                        )}>
                          {TOGGLE_ANSWER_LABELS[idx]}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                <Button
                  className="w-full h-11 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold touch-manipulation"
                  disabled={selectedAnswer === null || showObjResult}
                  onClick={handleObjConfirm}
                >
                  Confirm Answer
                </Button>
              </div>
            )}

            {/* NON-OBJECTIVE PLAYING PHASE */}
            {phase === "playing_nonobj" && currentNonObjQuestion && (
              <div className="space-y-3">
                <Card className="border-teal-200 dark:border-teal-800">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300 text-[10px]">Written</Badge>
                      <span className="text-xs text-muted-foreground">Q{objectives.length + nonObjIndex + 1} of {totalQs}</span>
                    </div>
                  </CardContent>
                </Card>

                <NonObjectiveQuestionCard
                  key={nonObjIndex}
                  questionNumber={objectives.length + nonObjIndex + 1}
                  question={currentNonObjQuestion.question}
                  onAnswer={(val) => setNonObjAnswer(val)}
                  disabled={nonObjShowResult}
                  showResult={nonObjShowResult}
                  isCorrect={currentNonObjQuestion.acceptedAnswers.some(a => nonObjAnswer.toLowerCase().includes(a.toLowerCase()))}
                />

                <Button
                  className="w-full h-11 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold touch-manipulation"
                  disabled={nonObjShowResult || nonObjAnswer.trim().length === 0}
                  onClick={() => lockNonObjAnswer(nonObjAnswer)}
                >
                  Submit Answer
                </Button>
              </div>
            )}

            {/* SESSION WIN PHASE */}
            {phase === "session_win" && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center mb-3">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">Session {sessionIndex + 1} Won! 🎉</h3>
                  <p className="text-muted-foreground text-sm mt-1">You answered all {session.total} questions correctly!</p>
                </div>

                <Card className="border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-green-600 font-medium mb-1">Your Current Prize</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{formatLocalAmount(currentPrize, "NGN")}</p>
                    <p className="text-xs text-green-500">({formatMobiAmount(currentPrize)})</p>
                    <p className="text-[10px] text-muted-foreground mt-2">Multiplier: {session.label} of {formatMobiAmount(STAKE_AMOUNT)} stake</p>
                  </CardContent>
                </Card>

                <Button
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold touch-manipulation"
                  onClick={handleTakePrize}
                >
                  <Trophy className="h-4 w-4 mr-2" /> Take Prize & Exit
                </Button>

                {sessionIndex < 6 && (
                  <>
                    <div className="relative flex items-center justify-center">
                      <div className="border-t border-muted w-full" />
                      <span className="absolute bg-background px-3 text-xs text-muted-foreground">OR</span>
                    </div>

                    <Card className="border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <p className="text-xs font-bold text-amber-700 dark:text-amber-300">Toggle Warning</p>
                        </div>
                        <ul className="text-[11px] text-amber-600 dark:text-amber-400 space-y-1">
                          <li>• Your current <strong>{formatMobiAmount(currentPrize)}</strong> prize will be <strong>cancelled</strong></li>
                          <li>• Stake of <strong>{formatMobiAmount(STAKE_AMOUNT)}</strong> will be re-charged</li>
                          <li>• New prize if you win: <strong>{formatMobiAmount(STAKE_AMOUNT * TOGGLE_SESSIONS[sessionIndex + 1].multiplier)}</strong> ({TOGGLE_SESSIONS[sessionIndex + 1].label})</li>
                          <li>• {TOGGLE_SESSIONS[sessionIndex + 1].objectives} Objectives + {TOGGLE_SESSIONS[sessionIndex + 1].nonObjectives} Written questions</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Button
                      variant="outline"
                      className="w-full h-12 border-2 border-teal-500 text-teal-700 dark:text-teal-300 font-bold touch-manipulation hover:bg-teal-50 dark:hover:bg-teal-950/30"
                      onClick={handleToggle}
                    >
                      <Repeat className="h-4 w-4 mr-2" /> Toggle to Session {sessionIndex + 2} — {TOGGLE_SESSIONS[sessionIndex + 1].label}
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* SESSION FAIL PHASE */}
            {phase === "session_fail" && (
              <div className="space-y-4">
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center mb-3">
                    <X className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-red-600">Session Failed</h3>
                  <p className="text-muted-foreground text-sm mt-1">You needed 100% correct answers to win.</p>
                </div>

                <Card className="border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30">
                  <CardContent className="p-4 text-center space-y-2">
                    <p className="text-sm font-bold text-red-600">You Lost Everything</p>
                    <p className="text-xs text-muted-foreground">
                      Total stake charged: {formatMobiAmount(totalStakeCharged)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Session {sessionIndex + 1} of 7 — {session.label} was the target
                    </p>
                  </CardContent>
                </Card>

                <Button
                  className="w-full h-12 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold touch-manipulation"
                  onClick={handleExit}
                >
                  Exit Game
                </Button>
              </div>
            )}

            {/* CELEBRITY PHASE — All 7 completed */}
            {phase === "celebrity" && (
              <div className="space-y-4">
                <div className="text-center py-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 flex items-center justify-center mb-3 animate-pulse shadow-lg shadow-amber-300/50">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    🌟 MOBI CELEBRITY 🌟
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">You completed ALL 7 Toggle Sessions!</p>
                  <p className="text-xs text-muted-foreground mt-0.5">This is an extraordinary achievement.</p>
                </div>

                <Card className="border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-amber-600 font-medium mb-1">Final Prize — {TOGGLE_SESSIONS[6].label}</p>
                    <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{formatLocalAmount(STAKE_AMOUNT * 15, "NGN")}</p>
                    <p className="text-xs text-amber-500">({formatMobiAmount(STAKE_AMOUNT * 15)})</p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <Badge className="bg-amber-500 text-white text-xs">🏆 Mobi Celebrity</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold touch-manipulation"
                  onClick={handleTakePrize}
                >
                  <Star className="h-4 w-4 mr-2" /> Claim Celebrity Prize & Badge
                </Button>
              </div>
            )}

            {/* Session Progress Bar (bottom) */}
            {phase !== "setup" && (
              <div className="pt-2 border-t">
                <p className="text-[10px] text-muted-foreground mb-1.5">Session Progress</p>
                <div className="flex gap-1">
                  {TOGGLE_SESSIONS.map((s, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex-1 h-2 rounded-full",
                        i < sessionIndex ? "bg-green-500" :
                        i === sessionIndex && (phase === "session_win" || phase === "celebrity") ? "bg-green-500" :
                        i === sessionIndex && phase === "session_fail" ? "bg-red-500" :
                        i === sessionIndex ? "bg-teal-500" :
                        "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-muted-foreground">S1 (5x)</span>
                  <span className="text-[9px] text-muted-foreground">S7 (15x)</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
