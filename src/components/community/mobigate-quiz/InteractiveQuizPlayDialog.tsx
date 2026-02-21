import { useState, useEffect, useCallback } from "react";
import { X, Clock, Star, Radio, Trophy, Zap, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MOBIGATE_ANSWER_LABELS } from "@/data/mobigateQuizData";
import { QuizSeason, INTERACTIVE_QUESTIONS_PER_SESSION } from "@/data/mobigateInteractiveQuizData";
import { getObjectiveTimePerQuestion, getNonObjectiveTimePerQuestion } from "@/data/platformSettingsData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { NonObjectiveQuestionCard } from "./NonObjectiveQuestionCard";
import { QuizPrizeRedemptionSheet } from "./QuizPrizeRedemptionSheet";
import { InteractiveSessionDialog } from "./InteractiveSessionDialog";

const interactiveObjectiveQuestions = [
  { question: "What is the most spoken language in the world?", options: ["Spanish", "Hindi", "English", "Arabic", "French", "Portuguese", "Bengali", "Russian"], correctAnswer: 2 },
  { question: "Which company created the iPhone?", options: ["Samsung", "Microsoft", "Apple", "Google", "Nokia", "Sony", "LG", "Huawei"], correctAnswer: 2 },
  { question: "What is the largest continent by area?", options: ["Africa", "North America", "Asia", "Europe", "South America", "Antarctica", "Australia", "Oceania"], correctAnswer: 2 },
  { question: "In which year was Facebook founded?", options: ["2002", "2003", "2004", "2005", "2006", "2001", "2007", "2008"], correctAnswer: 2 },
  { question: "What gas makes up most of Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen", "Argon", "Helium", "Methane", "Ozone"], correctAnswer: 2 },
  { question: "Which African country was never colonized?", options: ["Ghana", "Nigeria", "Ethiopia", "Kenya", "Egypt", "South Africa", "Morocco", "Tanzania"], correctAnswer: 2 },
  { question: "How many bones does an adult human have?", options: ["195", "200", "206", "210", "215", "220", "196", "250"], correctAnswer: 2 },
  { question: "What is the currency of the United Kingdom?", options: ["Euro", "Dollar", "Pound Sterling", "Franc", "Mark", "Shilling", "Crown", "Guilder"], correctAnswer: 2 },
  { question: "Who painted the Mona Lisa?", options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello", "Picasso", "Van Gogh", "Rembrandt", "Monet"], correctAnswer: 2 },
  { question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Platinum", "Titanium", "Quartz", "Ruby", "Sapphire"], correctAnswer: 2 },
];

const interactiveNonObjectiveQuestions = [
  { question: "Name the process by which plants make food using sunlight", acceptedAnswers: ["photosynthesis"] },
  { question: "What is the capital city of Australia?", acceptedAnswers: ["canberra"] },
  { question: "Name a programming language created by Google", acceptedAnswers: ["go", "golang", "dart", "kotlin"] },
  { question: "What element has the atomic number 1?", acceptedAnswers: ["hydrogen"] },
  { question: "Name the author of 'Half of a Yellow Sun'", acceptedAnswers: ["chimamanda", "adichie", "chimamanda adichie", "chimamanda ngozi adichie"] },
];

interface InteractiveQuizPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season: QuizSeason;
}

type Phase = "objective" | "non_objective" | "result";

export function InteractiveQuizPlayDialog({ open, onOpenChange, season }: InteractiveQuizPlayDialogProps) {
  const { toast } = useToast();
  const [currentQ, setCurrentQ] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(getObjectiveTimePerQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [objectiveCorrect, setObjectiveCorrect] = useState(0);
  const [phase, setPhase] = useState<Phase>("objective");
  const [nonObjectiveAnswers, setNonObjectiveAnswers] = useState<string[]>(Array(5).fill(""));
  const [nonObjectiveCorrect, setNonObjectiveCorrect] = useState(0);
  const [showRedemption, setShowRedemption] = useState(false);
  const [showInteractiveSession, setShowInteractiveSession] = useState(false);
  const [redemptionAction, setRedemptionAction] = useState<"exit" | "play_again">("exit");

  const [currentNonObjQ, setCurrentNonObjQ] = useState(0);
  const [nonObjTimeRemaining, setNonObjTimeRemaining] = useState(getNonObjectiveTimePerQuestion());
  const [nonObjShowResult, setNonObjShowResult] = useState(false);
  const [nonObjLocked, setNonObjLocked] = useState(false);

  const totalQuestions = INTERACTIVE_QUESTIONS_PER_SESSION;
  const question = interactiveObjectiveQuestions[currentQ];
  const totalCorrect = objectiveCorrect + nonObjectiveCorrect;
  const percentage = Math.round((totalCorrect / totalQuestions) * 100);
  const passed = percentage === 100;
  const cashAlternative = season.entryFee * 5;

  const resetAllState = useCallback(() => {
    setCurrentQ(0); setTimeRemaining(getObjectiveTimePerQuestion()); setSelectedAnswer(null); setShowResult(false);
    setObjectiveCorrect(0); setPhase("objective"); setNonObjectiveAnswers(Array(5).fill(""));
    setNonObjectiveCorrect(0); setShowRedemption(false);
    setCurrentNonObjQ(0); setNonObjTimeRemaining(getNonObjectiveTimePerQuestion());
    setNonObjShowResult(false); setNonObjLocked(false);
    setRedemptionAction("exit");
  }, []);

  useEffect(() => {
    if (!open) resetAllState();
  }, [open, resetAllState]);

  // Objective timer
  useEffect(() => {
    if (phase !== "objective" || showResult || !open) return;
    if (timeRemaining <= 0) { setShowResult(true); setTimeout(() => nextObjective(), 1500); return; }
    const timer = setInterval(() => setTimeRemaining(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, phase, showResult, open]);

  // Non-objective per-question timer
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
    if (selectedAnswer === null) return;
    if (selectedAnswer === question.correctAnswer) setObjectiveCorrect(p => p + 1);
    setShowResult(true);
    setTimeout(() => nextObjective(), 1500);
  };

  const hasNonObjective = interactiveNonObjectiveQuestions.length > 0;

  const nextObjective = () => {
    if (currentQ >= interactiveObjectiveQuestions.length - 1) {
      if (hasNonObjective) {
        setPhase("non_objective");
      } else {
        setPhase("result");
      }
    } else {
      setCurrentQ(p => p + 1); setSelectedAnswer(null); setShowResult(false); setTimeRemaining(getObjectiveTimePerQuestion());
    }
  };

  const lockNonObjAnswer = useCallback((answer: string) => {
    setNonObjLocked(true);
    setNonObjectiveAnswers(prev => { const updated = [...prev]; updated[currentNonObjQ] = answer; return updated; });
    setNonObjShowResult(true);
    const q = interactiveNonObjectiveQuestions[currentNonObjQ];
    const isCorrect = q.acceptedAnswers.some(a => answer.toLowerCase().includes(a.toLowerCase()));
    if (isCorrect) setNonObjectiveCorrect(p => p + 1);
    setTimeout(() => {
      if (currentNonObjQ >= 4) setPhase("result");
      else {
        setCurrentNonObjQ(p => p + 1);
        setNonObjTimeRemaining(getNonObjectiveTimePerQuestion());
        setNonObjShowResult(false); setNonObjLocked(false);
      }
    }, 1500);
  }, [currentNonObjQ]);

  const handleRollover = () => {
    onOpenChange(false);
    setTimeout(() => setShowInteractiveSession(true), 300);
    toast({ title: "⚡ Entering Interactive Session", description: "Previous winnings forfeited. Earn points now!" });
  };

  const handleRedeemAndExit = () => { setRedemptionAction("exit"); setShowRedemption(true); };
  const handleRedeemAndPlayAgain = () => { setRedemptionAction("play_again"); setShowRedemption(true); };
  const handlePlayAgain = () => { resetAllState(); };

  const handleRedemptionClose = (v: boolean) => {
    if (!v) {
      setShowRedemption(false);
      if (redemptionAction === "exit") onOpenChange(false);
      else resetAllState();
    }
  };

  const progressValue = phase === "objective"
    ? ((currentQ + (showResult ? 1 : 0)) / totalQuestions) * 100
    : phase === "non_objective"
      ? ((10 + currentNonObjQ + (nonObjShowResult ? 1 : 0)) / totalQuestions) * 100
      : 100;

  const currentNonObjQuestion = interactiveNonObjectiveQuestions[currentNonObjQ];
  const currentNonObjIsCorrect = currentNonObjQuestion?.acceptedAnswers.some(
    a => (nonObjectiveAnswers[currentNonObjQ] || "").toLowerCase().includes(a.toLowerCase())
  );

  const mainDialogOpen = open && !showRedemption && !showInteractiveSession;

  return (
    <>
      <Dialog open={mainDialogOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0 flex flex-col rounded-none sm:rounded-lg">
          {/* Header */}
          <div className="shrink-0 bg-gradient-to-r from-blue-500 to-cyan-500 border-b p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5" />
                <div>
                  <h2 className="font-semibold text-sm">{season.name}</h2>
                  <p className="text-xs text-blue-200">
                    {phase === "objective" && `Q${currentQ + 1}/${interactiveObjectiveQuestions.length} (Objective)`}
                    {phase === "non_objective" && `Q${interactiveObjectiveQuestions.length + 1 + currentNonObjQ}/${totalQuestions} (Type Your Answer)`}
                    {phase === "result" && "Results"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={progressValue} className="h-1.5 mt-2 bg-blue-400 [&>div]:bg-white" />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-3 py-3 touch-auto overscroll-contain">
            {phase === "objective" && question && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Clock className={cn("h-5 w-5", timeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-blue-600")} />
                  <span className={cn("text-2xl font-bold tabular-nums", timeRemaining <= 5 && "text-red-500")}>{timeRemaining}s</span>
                </div>
                <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
                  <CardContent className="p-4"><p className="text-base font-medium">{question.question}</p></CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((opt, idx) => (
                    <button key={idx} onClick={() => !showResult && setSelectedAnswer(idx)} disabled={showResult}
                      className={cn("p-3 rounded-lg border-2 text-left transition-all touch-manipulation",
                        selectedAnswer === idx && !showResult && "border-blue-500 bg-blue-50",
                        showResult && idx === question.correctAnswer && "border-green-500 bg-green-50",
                        showResult && selectedAnswer === idx && idx !== question.correctAnswer && "border-red-500 bg-red-50",
                        !showResult && selectedAnswer !== idx && "border-border"
                      )}>
                      <div className="flex items-start gap-2">
                        <span className={cn("flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                          selectedAnswer === idx && !showResult && "bg-blue-500 text-white",
                          showResult && idx === question.correctAnswer && "bg-green-500 text-white",
                          showResult && selectedAnswer === idx && idx !== question.correctAnswer && "bg-red-500 text-white",
                          !showResult && selectedAnswer !== idx && "bg-muted"
                        )}>{MOBIGATE_ANSWER_LABELS[idx]}</span>
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
                  <Clock className={cn("h-5 w-5", nonObjTimeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-blue-600")} />
                  <span className={cn("text-2xl font-bold tabular-nums", nonObjTimeRemaining <= 5 && "text-red-500")}>{nonObjTimeRemaining}s</span>
                </div>
                <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">Objective Score: {objectiveCorrect}/10</p>
                    <p className="text-xs text-muted-foreground mt-1">Written question {currentNonObjQ + 1} of 5</p>
                  </CardContent>
                </Card>
                <NonObjectiveQuestionCard
                  key={currentNonObjQ}
                  questionNumber={11 + currentNonObjQ}
                  question={currentNonObjQuestion.question}
                  onAnswer={(ans) => { const a = [...nonObjectiveAnswers]; a[currentNonObjQ] = ans; setNonObjectiveAnswers(a); }}
                  disabled={nonObjLocked}
                  showResult={nonObjShowResult}
                  isCorrect={nonObjShowResult && currentNonObjIsCorrect}
                />
              </div>
            )}

            {phase === "result" && (
              <div className="space-y-3">
                {passed ? (
                  <>
                    <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/30">
                      <CardContent className="p-5 text-center space-y-3">
                        <p className="text-4xl">🌟</p>
                        <h3 className="font-bold text-lg">Perfect Score!</h3>
                        <p className="text-sm text-muted-foreground">{totalCorrect}/{totalQuestions} correct ({percentage}%)</p>
                        <div className="pt-2">
                          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <p className="text-xs text-muted-foreground">Cash Prize Available</p>
                            <p className="font-bold text-lg text-green-600">{formatMobiAmount(cashAlternative)}</p>
                            <p className="text-[10px] text-muted-foreground">({formatLocalAmount(cashAlternative, "NGN")})</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span className="text-xs font-semibold text-amber-700">What is "Rollover"?</span>
                        </div>
                        <div className="space-y-1.5 text-[10px] text-muted-foreground">
                          <p className="flex items-start gap-1.5">
                            <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                            You forfeit your current cash prize.
                          </p>
                          <p className="flex items-start gap-1.5">
                            <Star className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                            Enter the Interactive Session to earn Points.
                          </p>
                          <p className="flex items-start gap-1.5">
                            <Trophy className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                            Top players qualify for the Game Show & win BIG!
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="border-2 border-red-300 bg-red-50 dark:bg-red-950/30">
                    <CardContent className="p-5 text-center space-y-3">
                      <p className="text-4xl">😞</p>
                      <h3 className="font-bold text-lg">Better Luck Next Time</h3>
                      <p className="text-sm text-muted-foreground">{totalCorrect}/{totalQuestions} correct ({percentage}%)</p>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                          <p className="text-[10px] text-muted-foreground">Objective</p>
                          <p className="font-bold text-sm">{objectiveCorrect}/10</p>
                        </div>
                        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-center">
                          <p className="text-[10px] text-muted-foreground">Written</p>
                          <p className="font-bold text-sm">{nonObjectiveCorrect}/5</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t px-3 py-3 bg-background">
            {phase === "objective" && (
              <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-sm touch-manipulation" onClick={handleConfirm} disabled={selectedAnswer === null || showResult}>
                {selectedAnswer === null ? "Select Answer" : showResult ? "Loading..." : `Confirm ${MOBIGATE_ANSWER_LABELS[selectedAnswer]}`}
              </Button>
            )}
            {phase === "non_objective" && (
              <Button
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-sm touch-manipulation"
                onClick={() => lockNonObjAnswer(nonObjectiveAnswers[currentNonObjQ] || "")}
                disabled={nonObjLocked || !nonObjectiveAnswers[currentNonObjQ]?.trim()}
              >
                {nonObjShowResult ? "Next question..." : "Confirm Answer"}
              </Button>
            )}
            {phase === "result" && passed && (
              <div className="space-y-2">
                <Button
                  className="w-full min-h-[44px] py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs leading-tight touch-manipulation whitespace-normal"
                  onClick={handleRollover}
                >
                  <Zap className="h-4 w-4 mr-1.5 shrink-0" />
                  <span>Rollover Winning to Interactive Session</span>
                </Button>
                <Button
                  className="w-full min-h-[40px] py-2 px-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs leading-tight touch-manipulation whitespace-normal"
                  onClick={handleRedeemAndExit}
                >
                  <Trophy className="h-4 w-4 mr-1.5 shrink-0" />
                  <span>Redeem Prize & Exit</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full min-h-[40px] py-2 px-3 text-blue-600 border-blue-300 text-xs leading-tight touch-manipulation whitespace-normal"
                  onClick={handleRedeemAndPlayAgain}
                >
                  Redeem Prize & Play Again
                </Button>
              </div>
            )}
            {phase === "result" && !passed && (
              <div className="flex gap-2.5">
                <Button className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-sm touch-manipulation" onClick={handlePlayAgain}>
                  Play Again
                </Button>
                <Button variant="outline" className="flex-1 h-12 text-sm touch-manipulation" onClick={() => onOpenChange(false)}>
                  Exit Now
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <QuizPrizeRedemptionSheet open={showRedemption} onOpenChange={handleRedemptionClose} prizeAmount={cashAlternative} prizeType="cash" />
      <InteractiveSessionDialog open={showInteractiveSession} onOpenChange={(v) => setShowInteractiveSession(v)} season={season} />
    </>
  );
}
