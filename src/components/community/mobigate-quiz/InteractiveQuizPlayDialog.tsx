import { useState, useEffect, useCallback, useMemo } from "react";
import { X, Clock, Star, Radio, Trophy, Zap, AlertTriangle, Shield, RotateCcw, Gift, BookOpen, Pencil } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MOBIGATE_ANSWER_LABELS } from "@/data/mobigateQuizData";
import {
  QuizSeason,
  INTERACTIVE_QUESTIONS_PER_SESSION,
  GAME_SHOW_ENTRY_POINTS,
  calculateQuizTier,
  calculateObjectivesOnlyTier,
  pickRandomObjectives,
  TIER_LABELS,
  PlayMode,
  INTERACTIVE_DEFAULT_OBJECTIVE_PICK,
} from "@/data/mobigateInteractiveQuizData";
import { getObjectiveTimePerQuestion, getNonObjectiveTimePerQuestion } from "@/data/platformSettingsData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { NonObjectiveQuestionCard } from "./NonObjectiveQuestionCard";
import { QuizPrizeRedemptionSheet } from "./QuizPrizeRedemptionSheet";
import { InteractiveSessionDialog } from "./InteractiveSessionDialog";

// 15 objective questions in the bank
const allInteractiveObjectiveQuestions = [
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
  // 5 additional objectives (total = 15)
  { question: "What planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn", "Mercury", "Uranus", "Neptune", "Pluto"], correctAnswer: 2 },
  { question: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Pacific", "Arctic", "Southern", "Caribbean", "Mediterranean", "Baltic"], correctAnswer: 2 },
  { question: "What is the smallest country in the world?", options: ["Monaco", "Malta", "Vatican City", "San Marino", "Liechtenstein", "Nauru", "Tuvalu", "Andorra"], correctAnswer: 2 },
  { question: "Who wrote 'Romeo and Juliet'?", options: ["Dickens", "Austen", "Shakespeare", "Hemingway", "Twain", "Tolstoy", "Orwell", "Wilde"], correctAnswer: 2 },
  { question: "What is the chemical symbol for water?", options: ["HO", "O2", "H2O", "CO2", "NaCl", "H2", "OH", "H3O"], correctAnswer: 2 },
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

type Phase = "mode_select" | "objective" | "non_objective" | "result";

export function InteractiveQuizPlayDialog({ open, onOpenChange, season }: InteractiveQuizPlayDialogProps) {
  const { toast } = useToast();
  const [playMode, setPlayMode] = useState<PlayMode>("mixed");
  const [activeObjectives, setActiveObjectives] = useState(allInteractiveObjectiveQuestions.slice(0, INTERACTIVE_DEFAULT_OBJECTIVE_PICK));
  const [currentQ, setCurrentQ] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(getObjectiveTimePerQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [objectiveCorrect, setObjectiveCorrect] = useState(0);
  const [phase, setPhase] = useState<Phase>("mode_select");
  const [nonObjectiveAnswers, setNonObjectiveAnswers] = useState<string[]>(Array(5).fill(""));
  const [nonObjectiveCorrect, setNonObjectiveCorrect] = useState(0);
  const [showRedemption, setShowRedemption] = useState(false);
  const [showInteractiveSession, setShowInteractiveSession] = useState(false);
  const [redemptionAction, setRedemptionAction] = useState<"exit" | "play_again">("exit");

  const [currentNonObjQ, setCurrentNonObjQ] = useState(0);
  const [nonObjTimeRemaining, setNonObjTimeRemaining] = useState(getNonObjectiveTimePerQuestion());
  const [nonObjShowResult, setNonObjShowResult] = useState(false);
  const [nonObjLocked, setNonObjLocked] = useState(false);

  // Accumulated state across plays
  const [accumulatedPoints, setAccumulatedPoints] = useState(0);
  const [accumulatedWinnings, setAccumulatedWinnings] = useState(0);
  const [totalPlays, setTotalPlays] = useState(0);

  const activeNonObjectives = playMode === "objectives_only" ? [] : interactiveNonObjectiveQuestions;
  const totalQuestions = activeObjectives.length + activeNonObjectives.length;
  const question = activeObjectives[currentQ];
  const totalCorrect = objectiveCorrect + nonObjectiveCorrect;
  const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Tier calculation based on play mode
  const tierResult = playMode === "objectives_only"
    ? calculateObjectivesOnlyTier(percentage, totalCorrect)
    : calculateQuizTier(percentage);
  const tierInfo = TIER_LABELS[tierResult.tier];
  const instantPrize = Math.round(season.entryFee * tierResult.prizeMultiplier);
  const hasReachedGameShow = accumulatedPoints >= GAME_SHOW_ENTRY_POINTS;

  const resetAllState = useCallback(() => {
    setCurrentQ(0); setTimeRemaining(getObjectiveTimePerQuestion()); setSelectedAnswer(null); setShowResult(false);
    setObjectiveCorrect(0); setPhase("mode_select"); setNonObjectiveAnswers(Array(5).fill(""));
    setNonObjectiveCorrect(0); setShowRedemption(false);
    setCurrentNonObjQ(0); setNonObjTimeRemaining(getNonObjectiveTimePerQuestion());
    setNonObjShowResult(false); setNonObjLocked(false);
    setRedemptionAction("exit");
  }, []);

  useEffect(() => {
    if (!open) {
      resetAllState();
      setAccumulatedPoints(0);
      setAccumulatedWinnings(0);
      setTotalPlays(0);
      setPlayMode("mixed");
    }
  }, [open, resetAllState]);

  const handleSelectMode = (mode: PlayMode) => {
    setPlayMode(mode);
    if (mode === "objectives_only") {
      setActiveObjectives([...allInteractiveObjectiveQuestions]); // all 15
    } else {
      setActiveObjectives(pickRandomObjectives(allInteractiveObjectiveQuestions, INTERACTIVE_DEFAULT_OBJECTIVE_PICK)); // random 10
    }
    setPhase("objective");
  };

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

  const hasNonObjective = activeNonObjectives.length > 0;

  const nextObjective = () => {
    if (currentQ >= activeObjectives.length - 1) {
      if (hasNonObjective) {
        setPhase("non_objective");
      } else {
        finalizeResult();
      }
    } else {
      setCurrentQ(p => p + 1); setSelectedAnswer(null); setShowResult(false); setTimeRemaining(getObjectiveTimePerQuestion());
    }
  };

  const lockNonObjAnswer = useCallback((answer: string) => {
    setNonObjLocked(true);
    setNonObjectiveAnswers(prev => { const updated = [...prev]; updated[currentNonObjQ] = answer; return updated; });
    setNonObjShowResult(true);
    const q = activeNonObjectives[currentNonObjQ];
    const isCorrect = q.acceptedAnswers.some(a => answer.toLowerCase().includes(a.toLowerCase()));
    if (isCorrect) setNonObjectiveCorrect(p => p + 1);
    setTimeout(() => {
      if (currentNonObjQ >= activeNonObjectives.length - 1) {
        finalizeResult();
      } else {
        setCurrentNonObjQ(p => p + 1);
        setNonObjTimeRemaining(getNonObjectiveTimePerQuestion());
        setNonObjShowResult(false); setNonObjLocked(false);
      }
    }, 1500);
  }, [currentNonObjQ, activeNonObjectives]);

  const finalizeResult = () => {
    setTotalPlays(p => p + 1);
    setPhase("result");
  };

  // Apply tier points after result is shown
  useEffect(() => {
    if (phase !== "result") return;
    const tc = objectiveCorrect + nonObjectiveCorrect;
    const pct = totalQuestions > 0 ? Math.round((tc / totalQuestions) * 100) : 0;
    const tier = playMode === "objectives_only"
      ? calculateObjectivesOnlyTier(pct, tc)
      : calculateQuizTier(pct);

    if (tier.resetAll) {
      setAccumulatedPoints(0);
      setAccumulatedWinnings(0);
      toast({ title: "💀 DISQUALIFIED!", description: "All points and prizes reset to zero!", variant: "destructive" });
    } else if (tier.points > 0) {
      setAccumulatedPoints(p => p + tier.points);
      const prize = Math.round(season.entryFee * tier.prizeMultiplier);
      if (prize > 0) setAccumulatedWinnings(p => p + prize);
    }
  }, [phase]); // intentionally only trigger on phase change

  const handleRollover = () => {
    onOpenChange(false);
    setTimeout(() => setShowInteractiveSession(true), 300);
    toast({ title: "⚡ Entering Interactive Session", description: "Previous winnings forfeited. Earn points now!" });
  };

  const handleRedeemInstantPrize = (action: "exit" | "play_again") => {
    setAccumulatedPoints(0);
    setRedemptionAction(action);
    setShowRedemption(true);
    toast({ title: "⚠️ Points Dissolved", description: "Taking instant prize removes Game Show eligibility." });
  };

  const handleSkipPrizeContinuePlaying = () => {
    resetAllState();
  };

  const handlePlayAgainFresh = () => {
    setAccumulatedPoints(0);
    setAccumulatedWinnings(0);
    resetAllState();
  };

  const handleRedemptionClose = (v: boolean) => {
    if (!v) {
      setShowRedemption(false);
      if (redemptionAction === "exit") onOpenChange(false);
      else resetAllState();
    }
  };

  const progressValue = phase === "mode_select" ? 0
    : phase === "objective"
    ? ((currentQ + (showResult ? 1 : 0)) / totalQuestions) * 100
    : phase === "non_objective"
      ? ((activeObjectives.length + currentNonObjQ + (nonObjShowResult ? 1 : 0)) / totalQuestions) * 100
      : 100;

  const currentNonObjQuestion = activeNonObjectives[currentNonObjQ];
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
                    {phase === "mode_select" && "Choose Play Mode"}
                    {phase === "objective" && `Q${currentQ + 1}/${activeObjectives.length} (Objective)`}
                    {phase === "non_objective" && `Q${activeObjectives.length + 1 + currentNonObjQ}/${totalQuestions} (Written)`}
                    {phase === "result" && "Results"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-0 text-[10px]">
                  <Star className="h-3 w-3 mr-0.5" />{accumulatedPoints} pts
                </Badge>
                {phase !== "mode_select" && (
                  <Badge className="bg-white/10 text-white border-0 text-[9px]">
                    {playMode === "objectives_only" ? "Obj Only" : "Mixed"}
                  </Badge>
                )}
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-white hover:bg-white/20">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Progress value={progressValue} className="h-1.5 mt-2 bg-blue-400 [&>div]:bg-white" />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-3 py-3 touch-auto overscroll-contain">
            {/* Mode Selection */}
            {phase === "mode_select" && (
              <div className="space-y-4">
                <div className="text-center space-y-2 pt-2">
                  <p className="text-3xl">🎯</p>
                  <h3 className="font-bold text-base">Choose Your Play Mode</h3>
                  <p className="text-xs text-muted-foreground">Select how you want to play this quiz session</p>
                </div>

                {/* Mixed mode option */}
                <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all cursor-pointer active:scale-[0.98]" onClick={() => handleSelectMode("mixed")}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">Objectives + Written</h4>
                        <p className="text-xs text-muted-foreground">15 Questions (10 Objectives + 5 Written)</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-2.5 space-y-1">
                      <p className="text-[10px] font-medium text-blue-700">Full Prize Tiers:</p>
                      <p className="text-[10px] text-muted-foreground">🌟 100% = 500% • 🔥 90% = 50% • 👍 80% = 20%</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Objectives only option */}
                <Card className="border-2 border-amber-200 hover:border-amber-400 transition-all cursor-pointer active:scale-[0.98]" onClick={() => handleSelectMode("objectives_only")}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Pencil className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">Play Only Objectives</h4>
                        <p className="text-xs text-muted-foreground">15 Objective Questions Only</p>
                      </div>
                    </div>
                    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
                      <CardContent className="p-2.5 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <p className="text-[10px] font-medium text-amber-700">Reduced Winning Prize</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          This option reduces your Winning Prize from <strong>500% to 350%</strong> of Stake.
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Getting 12-14 correct earns <strong>20% consolation prize</strong>.
                        </p>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            )}

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
                    <p className="text-sm font-medium">Objective Score: {objectiveCorrect}/{activeObjectives.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Written question {currentNonObjQ + 1} of {activeNonObjectives.length}</p>
                  </CardContent>
                </Card>
                <NonObjectiveQuestionCard
                  key={currentNonObjQ}
                  questionNumber={activeObjectives.length + 1 + currentNonObjQ}
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
                {/* Tier Result Card */}
                <Card className={cn("border-2", {
                  "border-green-500 bg-green-50 dark:bg-green-950/30": tierResult.tier === "perfect",
                  "border-blue-400 bg-blue-50 dark:bg-blue-950/30": tierResult.tier === "excellent",
                  "border-amber-400 bg-amber-50 dark:bg-amber-950/30": tierResult.tier === "good",
                  "border-purple-400 bg-purple-50 dark:bg-purple-950/30": tierResult.tier === "consolation",
                  "border-border bg-muted/30": tierResult.tier === "pass",
                  "border-red-500 bg-red-50 dark:bg-red-950/30": tierResult.tier === "disqualified",
                })}>
                  <CardContent className="p-5 text-center space-y-3">
                    <p className="text-4xl">{tierInfo.emoji}</p>
                    <h3 className={cn("font-bold text-lg", tierInfo.color)}>{tierInfo.label}</h3>
                    <p className="text-sm text-muted-foreground">{totalCorrect}/{totalQuestions} correct ({percentage}%)</p>
                    <Badge className="bg-muted text-foreground border-0 text-[10px]">
                      {playMode === "objectives_only" ? "Objectives Only Mode" : "Mixed Mode"}
                    </Badge>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                        <p className="text-[10px] text-muted-foreground">Objective</p>
                        <p className="font-bold text-sm">{objectiveCorrect}/{activeObjectives.length}</p>
                      </div>
                      {playMode === "mixed" && (
                        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-center">
                          <p className="text-[10px] text-muted-foreground">Written</p>
                          <p className="font-bold text-sm">{nonObjectiveCorrect}/{activeNonObjectives.length}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Instant Prize (if earned) */}
                {instantPrize > 0 && !tierResult.resetAll && (
                  <Card className="border-green-300 bg-green-50/50 dark:bg-green-950/20">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">Instant Prize Available</span>
                      </div>
                      <div className="text-center py-2">
                        <p className="text-2xl font-bold text-green-600">{formatMobiAmount(instantPrize)}</p>
                        <p className="text-[10px] text-muted-foreground">({formatLocalAmount(instantPrize, "NGN")})</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{Math.round(tierResult.prizeMultiplier * 100)}% of stake</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Warning: taking instant prize dissolves points */}
                {instantPrize > 0 && !tierResult.resetAll && (
                  <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-xs font-semibold text-amber-700">Instant Prize Warning</span>
                      </div>
                      <div className="space-y-1.5 text-[10px] text-muted-foreground">
                        <p>• Taking the instant prize <strong>dissolves all accumulated points</strong></p>
                        <p>• You'll be <strong>disqualified from Game Show entry</strong></p>
                        <p>• You must restart fresh to re-enter the Game Show path</p>
                        <p>• Alternatively, <strong>skip the prize</strong> and keep accumulating points</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Disqualification warning */}
                {tierResult.resetAll && (
                  <Card className="border-red-300 bg-red-50 dark:bg-red-950/30">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-500" />
                        <span className="text-xs font-semibold text-red-700">Full Reset Applied</span>
                      </div>
                      <div className="space-y-1.5 text-[10px] text-muted-foreground">
                        <p>• Scoring below 60% triggers <strong>DISQUALIFICATION</strong></p>
                        <p>• All accumulated points reset to <strong>0</strong></p>
                        <p>• All accumulated prizes reset to <strong>0</strong></p>
                        <p>• You must start completely fresh</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Accumulated Stats */}
                <Card className="border-border">
                  <CardContent className="p-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-primary">{accumulatedPoints}</p>
                        <p className="text-[9px] text-muted-foreground">Total Points</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">{formatMobiAmount(accumulatedWinnings)}</p>
                        <p className="text-[9px] text-muted-foreground">Accrued Wins</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{totalPlays}</p>
                        <p className="text-[9px] text-muted-foreground">Sessions</p>
                      </div>
                    </div>
                    <Progress value={Math.min((accumulatedPoints / GAME_SHOW_ENTRY_POINTS) * 100, 100)} className="h-2 mt-2 bg-muted [&>div]:bg-primary" />
                    <p className="text-[9px] text-center text-muted-foreground mt-1">{accumulatedPoints}/{GAME_SHOW_ENTRY_POINTS} points to Game Show entry</p>
                  </CardContent>
                </Card>

                {/* 300-Point Game Show Milestone */}
                {hasReachedGameShow && !tierResult.resetAll && (
                  <Card className="border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                    <CardContent className="p-4 space-y-3 text-center">
                      <p className="text-3xl">🏆🎬</p>
                      <h3 className="font-bold text-base text-amber-700">Game Show Entry Unlocked!</h3>
                      <p className="text-xs text-muted-foreground">You've earned {accumulatedPoints} points — you qualify to enter the Game Show!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t px-3 py-3 bg-background space-y-2">
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

            {/* Result footer — Game Show milestone reached */}
            {phase === "result" && hasReachedGameShow && !tierResult.resetAll && (
              <>
                <Button
                  className="w-full min-h-[44px] py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs leading-tight touch-manipulation whitespace-normal"
                  onClick={handleRollover}
                >
                  <Zap className="h-4 w-4 mr-1.5 shrink-0" />
                  <span>Enter Show Now — Become a Mobi Celebrity!</span>
                </Button>
                {accumulatedWinnings > 0 && (
                  <Button
                    className="w-full min-h-[40px] py-2 px-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs leading-tight touch-manipulation whitespace-normal"
                    onClick={() => handleRedeemInstantPrize("exit")}
                  >
                    <Trophy className="h-4 w-4 mr-1.5 shrink-0" />
                    <span>Redeem Accrued Won Prize ({formatMobiAmount(accumulatedWinnings)})</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full min-h-[38px] py-2 px-3 text-xs touch-manipulation"
                  onClick={handleSkipPrizeContinuePlaying}
                >
                  Continue Playing More Quiz
                </Button>
              </>
            )}

            {/* Result footer — has instant prize but no Game Show yet */}
            {phase === "result" && !hasReachedGameShow && instantPrize > 0 && !tierResult.resetAll && (
              <>
                <Button
                  className="w-full min-h-[44px] py-2.5 px-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-xs leading-tight touch-manipulation whitespace-normal"
                  onClick={() => handleRedeemInstantPrize("exit")}
                >
                  <Gift className="h-4 w-4 mr-1.5 shrink-0" />
                  <span>Redeem Instant Prize & Exit ({formatMobiAmount(instantPrize)})</span>
                </Button>
                <Button
                  className="w-full min-h-[40px] py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs leading-tight touch-manipulation whitespace-normal"
                  onClick={() => handleRedeemInstantPrize("play_again")}
                >
                  Redeem Instant Prize & Play Again
                </Button>
                <Button
                  variant="outline"
                  className="w-full min-h-[38px] py-2 px-3 text-blue-600 border-blue-300 text-xs touch-manipulation"
                  onClick={handleSkipPrizeContinuePlaying}
                >
                  <Star className="h-3.5 w-3.5 mr-1.5" />
                  Skip Prize, Continue Playing (+{tierResult.points} pts kept)
                </Button>
              </>
            )}

            {/* Result footer — pass tier (60-79%), no prize */}
            {phase === "result" && tierResult.tier === "pass" && (
              <div className="flex gap-2.5">
                <Button className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-sm touch-manipulation" onClick={handleSkipPrizeContinuePlaying}>
                  Play Again
                </Button>
                <Button variant="outline" className="flex-1 h-12 text-sm touch-manipulation" onClick={() => onOpenChange(false)}>
                  Exit
                </Button>
              </div>
            )}

            {/* Result footer — disqualified (<60%) */}
            {phase === "result" && tierResult.resetAll && (
              <div className="space-y-2">
                <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-sm touch-manipulation" onClick={handlePlayAgainFresh}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Play Again (Fresh Start)
                </Button>
                <Button variant="outline" className="w-full h-12 text-sm touch-manipulation" onClick={() => onOpenChange(false)}>
                  Exit Now
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <QuizPrizeRedemptionSheet open={showRedemption} onOpenChange={handleRedemptionClose} prizeAmount={instantPrize > 0 ? instantPrize : accumulatedWinnings} prizeType="cash" />
      <InteractiveSessionDialog open={showInteractiveSession} onOpenChange={(v) => setShowInteractiveSession(v)} season={season} />
    </>
  );
}
