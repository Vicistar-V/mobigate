import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  ArrowLeft, Clock, Star, Radio, Trophy, Zap, AlertTriangle, Shield, 
  RotateCcw, Gift, BookOpen, Pencil, CheckCircle, Loader2, Wallet,
  Target, Flame, Skull, Award
} from "lucide-react";
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

type Phase = "loading" | "debit_confirm" | "mode_select" | "objective" | "non_objective" | "result";

export function InteractiveQuizPlayDialog({ open, onOpenChange, season }: InteractiveQuizPlayDialogProps) {
  const { toast } = useToast();
  const [playMode, setPlayMode] = useState<PlayMode>("mixed");
  const [activeObjectives, setActiveObjectives] = useState(allInteractiveObjectiveQuestions.slice(0, INTERACTIVE_DEFAULT_OBJECTIVE_PICK));
  const [currentQ, setCurrentQ] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(getObjectiveTimePerQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [objectiveCorrect, setObjectiveCorrect] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
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

  // Loading phase state
  const [loadingStep, setLoadingStep] = useState(0);

  const activeNonObjectives = playMode === "objectives_only" ? [] : interactiveNonObjectiveQuestions;
  const totalQuestions = activeObjectives.length + activeNonObjectives.length;
  const question = activeObjectives[currentQ];
  const totalCorrect = objectiveCorrect + nonObjectiveCorrect;
  const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

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

  // Loading → debit → mode_select flow
  useEffect(() => {
    if (!open) {
      setPhase("loading");
      setLoadingStep(0);
      setAccumulatedPoints(0);
      setAccumulatedWinnings(0);
      setTotalPlays(0);
      setPlayMode("mixed");
      setCurrentQ(0); setTimeRemaining(getObjectiveTimePerQuestion()); setSelectedAnswer(null); setShowResult(false);
      setObjectiveCorrect(0); setNonObjectiveAnswers(Array(5).fill(""));
      setNonObjectiveCorrect(0); setShowRedemption(false);
      setCurrentNonObjQ(0); setNonObjTimeRemaining(getNonObjectiveTimePerQuestion());
      setNonObjShowResult(false); setNonObjLocked(false);
      setRedemptionAction("exit");
      return;
    }

    // Start loading sequence
    if (phase === "loading") {
      const t1 = setTimeout(() => setLoadingStep(1), 600);
      const t2 = setTimeout(() => setLoadingStep(2), 1500);
      const t3 = setTimeout(() => setLoadingStep(3), 2400);
      const t4 = setTimeout(() => setPhase("debit_confirm"), 3200);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
  }, [open, phase]);

  // Auto-advance from debit_confirm to mode_select after user sees it
  const handleDebitContinue = () => {
    setPhase("mode_select");
  };

  const handleSelectMode = (mode: PlayMode) => {
    setPlayMode(mode);
    if (mode === "objectives_only") {
      setActiveObjectives([...allInteractiveObjectiveQuestions]);
    } else {
      setActiveObjectives(pickRandomObjectives(allInteractiveObjectiveQuestions, INTERACTIVE_DEFAULT_OBJECTIVE_PICK));
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

  // Apply tier points after result
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
  }, [phase]);

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

  const progressValue = phase === "mode_select" || phase === "loading" || phase === "debit_confirm" ? 0
    : phase === "objective"
    ? ((currentQ + (showResult ? 1 : 0)) / totalQuestions) * 100
    : phase === "non_objective"
      ? ((activeObjectives.length + currentNonObjQ + (nonObjShowResult ? 1 : 0)) / totalQuestions) * 100
      : 100;

  const currentNonObjQuestion = activeNonObjectives[currentNonObjQ];
  const currentNonObjIsCorrect = currentNonObjQuestion?.acceptedAnswers.some(
    a => (nonObjectiveAnswers[currentNonObjQ] || "").toLowerCase().includes(a.toLowerCase())
  );

  if (!open && !showRedemption && !showInteractiveSession) return null;

  if (showRedemption) {
    return <QuizPrizeRedemptionSheet open={showRedemption} onOpenChange={handleRedemptionClose} prizeAmount={instantPrize > 0 ? instantPrize : accumulatedWinnings} prizeType="cash" />;
  }

  if (showInteractiveSession) {
    return <InteractiveSessionDialog open={showInteractiveSession} onOpenChange={(v) => setShowInteractiveSession(v)} season={season} />;
  }

  const getTierIcon = () => {
    switch (tierResult.tier) {
      case "perfect": return <Trophy className="h-12 w-12 text-amber-500" />;
      case "excellent": return <Flame className="h-12 w-12 text-blue-500" />;
      case "good": return <Target className="h-12 w-12 text-amber-600" />;
      case "consolation": return <Gift className="h-12 w-12 text-purple-500" />;
      case "pass": return <Award className="h-12 w-12 text-muted-foreground" />;
      case "disqualified": return <Skull className="h-12 w-12 text-red-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* ── Top Bar ────────────────────────────────── */}
      <div className="shrink-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-4 py-3 safe-area-inset-top">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onOpenChange(false)}
            className="h-9 w-9 flex items-center justify-center rounded-full bg-white/15 active:scale-95 transition-transform touch-manipulation"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div className="text-center flex-1 mx-3">
            <h2 className="font-bold text-sm text-white truncate">{season.name}</h2>
            <p className="text-[10px] text-white/70">
              {phase === "loading" && "Preparing..."}
              {phase === "debit_confirm" && "Payment Confirmed"}
              {phase === "mode_select" && "Choose Play Mode"}
              {phase === "objective" && `Question ${currentQ + 1} of ${activeObjectives.length}`}
              {phase === "non_objective" && `Written ${currentNonObjQ + 1} of ${activeNonObjectives.length}`}
              {phase === "result" && "Quiz Complete"}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge className="bg-white/20 text-white border-0 text-[10px] gap-1">
              <Star className="h-3 w-3" />{accumulatedPoints}
            </Badge>
          </div>
        </div>
        {(phase !== "loading" && phase !== "debit_confirm") && (
          <Progress value={progressValue} className="h-1 mt-2.5 bg-white/20 [&>div]:bg-white" />
        )}
      </div>

      {/* ── Main Content ──────────────────────────── */}
      <div className="flex-1 overflow-y-auto touch-auto overscroll-contain">
        
        {/* LOADING PHASE */}
        {phase === "loading" && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 space-y-8">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center animate-pulse">
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-background">
                <Wallet className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-4 text-center w-full max-w-xs">
              <div className={cn("flex items-center gap-3 p-3 rounded-xl transition-all duration-500",
                loadingStep >= 0 ? "bg-muted/50" : "opacity-30"
              )}>
                {loadingStep >= 1 ? <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" /> : <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" />}
                <span className="text-sm">Verifying wallet balance...</span>
              </div>
              <div className={cn("flex items-center gap-3 p-3 rounded-xl transition-all duration-500",
                loadingStep >= 1 ? "bg-muted/50" : "opacity-30"
              )}>
                {loadingStep >= 2 ? <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" /> : loadingStep >= 1 ? <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" /> : <div className="h-5 w-5 rounded-full border-2 border-muted shrink-0" />}
                <span className="text-sm">Processing initialization fee...</span>
              </div>
              <div className={cn("flex items-center gap-3 p-3 rounded-xl transition-all duration-500",
                loadingStep >= 2 ? "bg-muted/50" : "opacity-30"
              )}>
                {loadingStep >= 3 ? <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" /> : loadingStep >= 2 ? <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" /> : <div className="h-5 w-5 rounded-full border-2 border-muted shrink-0" />}
                <span className="text-sm">Preparing quiz session...</span>
              </div>
            </div>
          </div>
        )}

        {/* DEBIT CONFIRMATION PHASE */}
        {phase === "debit_confirm" && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 space-y-6">
            <div className="h-20 w-20 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold">Payment Successful</h3>
              <p className="text-sm text-muted-foreground">Your Mobi Wallet has been debited</p>
            </div>

            <Card className="w-full max-w-xs border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Amount Debited</span>
                  <span className="font-bold text-base text-emerald-700">{formatLocalAmount(season.entryFee, "NGN")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Mobi Equivalent</span>
                  <span className="font-semibold text-sm">M{season.entryFee.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Season</span>
                  <span className="text-xs font-medium truncate ml-2">{season.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Type</span>
                  <span className="text-xs font-medium">Initialization Fee</span>
                </div>
              </CardContent>
            </Card>

            <Button 
              className="w-full max-w-xs h-12 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm gap-2 touch-manipulation"
              onClick={handleDebitContinue}
            >
              <Zap className="h-4 w-4" />
              Start Quiz Session
            </Button>
          </div>
        )}

        {/* MODE SELECT PHASE */}
        {phase === "mode_select" && (
          <div className="px-4 py-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">Choose Play Mode</h3>
              <p className="text-xs text-muted-foreground">Each mode has different question counts and prize tiers</p>
            </div>

            {/* Mixed Mode */}
            <button
              className="w-full text-left active:scale-[0.98] transition-transform touch-manipulation"
              onClick={() => handleSelectMode("mixed")}
            >
              <Card className="border-2 border-indigo-200 hover:border-indigo-400 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500" />
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
                      <BookOpen className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">Objectives + Written</h4>
                      <p className="text-xs text-muted-foreground">15 Questions (10 Obj + 5 Written)</p>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                      <p className="text-xs font-bold text-emerald-700">🌟 100%</p>
                      <p className="text-[10px] text-muted-foreground">500% Prize</p>
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <p className="text-xs font-bold text-blue-700">🔥 90%+</p>
                      <p className="text-[10px] text-muted-foreground">50% Prize</p>
                    </div>
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                      <p className="text-xs font-bold text-amber-700">👍 80%+</p>
                      <p className="text-[10px] text-muted-foreground">20% Prize</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>

            {/* Objectives Only */}
            <button
              className="w-full text-left active:scale-[0.98] transition-transform touch-manipulation"
              onClick={() => handleSelectMode("objectives_only")}
            >
              <Card className="border-2 border-amber-200 hover:border-amber-400 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center shrink-0">
                      <Pencil className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">Objectives Only</h4>
                      <p className="text-xs text-muted-foreground">15 Objective Questions Only</p>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                  </div>
                  <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                    <CardContent className="p-2.5 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <p className="text-[10px] font-semibold text-amber-700">Reduced Prize: 500% → 350%</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground">12-14 correct earns 20% consolation prize</p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </button>

            {/* Points Status */}
            {accumulatedPoints > 0 && (
              <Card className="border-primary/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Game Show Progress</span>
                    <span className="text-xs font-bold">{accumulatedPoints}/{GAME_SHOW_ENTRY_POINTS} pts</span>
                  </div>
                  <Progress value={(accumulatedPoints / GAME_SHOW_ENTRY_POINTS) * 100} className="h-2 bg-muted [&>div]:bg-primary" />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* OBJECTIVE PHASE */}
        {phase === "objective" && question && (
          <div className="px-4 py-4 space-y-4">
            {/* Timer */}
            <div className="flex items-center justify-center">
              <div className={cn(
                "h-16 w-16 rounded-full flex items-center justify-center border-4 transition-colors",
                timeRemaining <= 5 ? "border-red-500 bg-red-50 dark:bg-red-950/30" : "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
              )}>
                <span className={cn("text-xl font-black tabular-nums", timeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-indigo-600")}>{timeRemaining}</span>
              </div>
            </div>

            {/* Question */}
            <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20">
              <CardContent className="p-4">
                <p className="text-sm font-semibold leading-relaxed">{question.question}</p>
              </CardContent>
            </Card>

            {/* Options Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {question.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = showResult && idx === question.correctAnswer;
                const isWrong = showResult && isSelected && idx !== question.correctAnswer;
                
                return (
                  <button
                    key={idx}
                    onClick={() => !showResult && setSelectedAnswer(idx)}
                    disabled={showResult}
                    className={cn(
                      "relative p-3 rounded-xl border-2 text-left transition-all touch-manipulation min-h-[52px]",
                      isCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 scale-[1.02]",
                      isWrong && "border-red-500 bg-red-50 dark:bg-red-950/30",
                      isSelected && !showResult && "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30",
                      !isSelected && !showResult && !isCorrect && "border-border active:border-indigo-300 active:scale-[0.98]",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-bold shrink-0",
                        isCorrect && "bg-emerald-500 text-white",
                        isWrong && "bg-red-500 text-white",
                        isSelected && !showResult && "bg-indigo-500 text-white",
                        !isSelected && !showResult && !isCorrect && "bg-muted",
                      )}>
                        {MOBIGATE_ANSWER_LABELS[idx]}
                      </span>
                      <span className="text-xs leading-snug">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* NON-OBJECTIVE PHASE */}
        {phase === "non_objective" && currentNonObjQuestion && (
          <div className="px-4 py-4 space-y-4">
            {/* Timer */}
            <div className="flex items-center justify-center">
              <div className={cn(
                "h-16 w-16 rounded-full flex items-center justify-center border-4 transition-colors",
                nonObjTimeRemaining <= 5 ? "border-red-500 bg-red-50 dark:bg-red-950/30" : "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
              )}>
                <span className={cn("text-xl font-black tabular-nums", nonObjTimeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-purple-600")}>{nonObjTimeRemaining}</span>
              </div>
            </div>

            {/* Progress info */}
            <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground">Objective Score: <span className="font-bold text-foreground">{objectiveCorrect}/{activeObjectives.length}</span></p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Written question {currentNonObjQ + 1} of {activeNonObjectives.length}</p>
              </CardContent>
            </Card>

            {/* Question */}
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

        {/* RESULT PHASE */}
        {phase === "result" && (
          <div className="px-4 py-5 space-y-4">
            {/* Big Result Card */}
            <div className={cn("rounded-2xl p-6 text-center space-y-3", {
              "bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30": tierResult.tier === "perfect",
              "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30": tierResult.tier === "excellent",
              "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/30": tierResult.tier === "good",
              "bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30": tierResult.tier === "consolation",
              "bg-muted/30": tierResult.tier === "pass",
              "bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950/30 dark:to-rose-950/30": tierResult.tier === "disqualified",
            })}>
              {getTierIcon()}
              <p className="text-4xl mt-2">{tierInfo.emoji}</p>
              <h3 className={cn("font-black text-xl", tierInfo.color)}>{tierInfo.label}</h3>
              <p className="text-sm text-muted-foreground">{totalCorrect}/{totalQuestions} correct ({percentage}%)</p>
              <Badge className="bg-muted/50 text-foreground border-0 text-[10px]">
                {playMode === "objectives_only" ? "Objectives Only" : "Mixed Mode"}
              </Badge>

              {/* Score breakdown */}
              <div className="flex gap-3 justify-center pt-2">
                <div className="p-3 bg-background/60 rounded-xl text-center min-w-[80px]">
                  <p className="text-[10px] text-muted-foreground">Objective</p>
                  <p className="font-bold text-lg">{objectiveCorrect}/{activeObjectives.length}</p>
                </div>
                {playMode === "mixed" && (
                  <div className="p-3 bg-background/60 rounded-xl text-center min-w-[80px]">
                    <p className="text-[10px] text-muted-foreground">Written</p>
                    <p className="font-bold text-lg">{nonObjectiveCorrect}/{activeNonObjectives.length}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Instant Prize */}
            {instantPrize > 0 && !tierResult.resetAll && (
              <Card className="border-2 border-emerald-300 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-green-400" />
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">Instant Prize Won!</span>
                  </div>
                  <div className="text-center py-2">
                    <p className="text-3xl font-black text-emerald-600">{formatLocalAmount(instantPrize, "NGN")}</p>
                    <p className="text-xs text-muted-foreground mt-1">({formatMobiAmount(instantPrize)}) · {Math.round(tierResult.prizeMultiplier * 100)}% of stake</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Warning about instant prize */}
            {instantPrize > 0 && !tierResult.resetAll && (
              <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                <CardContent className="p-3 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="text-xs font-semibold text-amber-700">Redemption Warning</span>
                  </div>
                  <div className="space-y-1 text-[10px] text-muted-foreground">
                    <p>• Taking the prize <strong>dissolves all points</strong></p>
                    <p>• <strong>Disqualified from Game Show entry</strong></p>
                    <p>• Alternatively, <strong>skip prize</strong> and keep accumulating</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Disqualification */}
            {tierResult.resetAll && (
              <Card className="border-2 border-red-300 bg-red-50/50 dark:bg-red-950/20">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-bold text-red-700">Full Reset Applied</span>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• Below 60% triggers <strong>DISQUALIFICATION</strong></p>
                    <p>• All points and prizes reset to <strong>0</strong></p>
                    <p>• You must start completely fresh</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Accumulated Stats */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xl font-black text-primary">{accumulatedPoints}</p>
                    <p className="text-[9px] text-muted-foreground">Total Points</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-emerald-600">{formatMobiAmount(accumulatedWinnings)}</p>
                    <p className="text-[9px] text-muted-foreground">Accrued Wins</p>
                  </div>
                  <div>
                    <p className="text-xl font-black">{totalPlays}</p>
                    <p className="text-[9px] text-muted-foreground">Sessions</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={Math.min((accumulatedPoints / GAME_SHOW_ENTRY_POINTS) * 100, 100)} className="h-2.5 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-cyan-500" />
                  <p className="text-[9px] text-center text-muted-foreground mt-1.5">{accumulatedPoints}/{GAME_SHOW_ENTRY_POINTS} points to Game Show</p>
                </div>
              </CardContent>
            </Card>

            {/* Game Show Milestone */}
            {hasReachedGameShow && !tierResult.resetAll && (
              <Card className="border-2 border-amber-400 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
                <CardContent className="p-5 text-center space-y-3">
                  <p className="text-4xl">🏆🎬</p>
                  <h3 className="font-black text-lg text-amber-700">Game Show Unlocked!</h3>
                  <p className="text-xs text-muted-foreground">{accumulatedPoints} points earned — you qualify to enter!</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* ── Bottom Action Bar ─────────────────────── */}
      <div className="shrink-0 border-t bg-background px-4 py-3 space-y-2 safe-area-inset-bottom">
        {phase === "objective" && (
          <Button 
            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm touch-manipulation"
            onClick={handleConfirm} 
            disabled={selectedAnswer === null || showResult}
          >
            {selectedAnswer === null ? "Select an Answer" : showResult ? "Loading..." : `Confirm ${MOBIGATE_ANSWER_LABELS[selectedAnswer]}`}
          </Button>
        )}

        {phase === "non_objective" && (
          <Button
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm touch-manipulation"
            onClick={() => lockNonObjAnswer(nonObjectiveAnswers[currentNonObjQ] || "")}
            disabled={nonObjLocked || !nonObjectiveAnswers[currentNonObjQ]?.trim()}
          >
            {nonObjShowResult ? "Next question..." : "Submit Answer"}
          </Button>
        )}

        {/* Result: Game Show milestone */}
        {phase === "result" && hasReachedGameShow && !tierResult.resetAll && (
          <>
            <Button
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm gap-2 touch-manipulation"
              onClick={handleRollover}
            >
              <Zap className="h-4 w-4" />
              Enter Show — Become a Mobi Celebrity!
            </Button>
            {accumulatedWinnings > 0 && (
              <Button
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-semibold gap-2 touch-manipulation"
                onClick={() => handleRedeemInstantPrize("exit")}
              >
                <Trophy className="h-4 w-4" />
                Redeem Prize ({formatLocalAmount(accumulatedWinnings, "NGN")})
              </Button>
            )}
            <Button variant="outline" className="w-full h-10 text-xs touch-manipulation" onClick={handleSkipPrizeContinuePlaying}>
              Continue Playing
            </Button>
          </>
        )}

        {/* Result: has prize, no game show yet */}
        {phase === "result" && !hasReachedGameShow && instantPrize > 0 && !tierResult.resetAll && (
          <>
            <Button
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-sm gap-2 touch-manipulation"
              onClick={() => handleRedeemInstantPrize("exit")}
            >
              <Gift className="h-4 w-4" />
              Redeem Prize & Exit ({formatLocalAmount(instantPrize, "NGN")})
            </Button>
            <Button
              className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold gap-2 touch-manipulation"
              onClick={() => handleRedeemInstantPrize("play_again")}
            >
              Redeem & Play Again
            </Button>
            <Button variant="outline" className="w-full h-10 text-xs text-indigo-600 border-indigo-200 gap-1.5 touch-manipulation" onClick={handleSkipPrizeContinuePlaying}>
              <Star className="h-3.5 w-3.5" />
              Skip Prize, Keep Playing (+{tierResult.points} pts)
            </Button>
          </>
        )}

        {/* Result: pass (60-79%) */}
        {phase === "result" && tierResult.tier === "pass" && (
          <div className="flex gap-2.5">
            <Button className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm touch-manipulation" onClick={handleSkipPrizeContinuePlaying}>
              Play Again
            </Button>
            <Button variant="outline" className="flex-1 h-12 text-sm touch-manipulation" onClick={() => onOpenChange(false)}>
              Exit
            </Button>
          </div>
        )}

        {/* Result: disqualified */}
        {phase === "result" && tierResult.resetAll && (
          <div className="space-y-2">
            <Button className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm gap-2 touch-manipulation" onClick={handlePlayAgainFresh}>
              <RotateCcw className="h-4 w-4" />
              Fresh Start
            </Button>
            <Button variant="outline" className="w-full h-11 text-sm touch-manipulation" onClick={() => onOpenChange(false)}>
              Exit Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
