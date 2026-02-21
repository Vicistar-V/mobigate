import { useState, useCallback } from "react";
import { X, Zap, Trophy, AlertTriangle, Shield, Star, TrendingUp, RotateCcw, Gift, BookOpen, Pencil } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  QuizSeason,
  INTERACTIVE_MAX_LOSSES_BEFORE_EVICTION,
  GAME_SHOW_ENTRY_POINTS,
  calculateQuizTier,
  calculateObjectivesOnlyTier,
  pickRandomObjectives,
  TIER_LABELS,
  PlayMode,
  INTERACTIVE_DEFAULT_OBJECTIVE_PICK,
} from "@/data/mobigateInteractiveQuizData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { QuizPlayEngine, QuizPlayResult } from "./QuizPlayEngine";
import { QuizPrizeRedemptionSheet } from "./QuizPrizeRedemptionSheet";

// 15 objective questions in the bank for sessions
const allSessionObjectiveQuestions = [
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

const sessionNonObjectiveQuestions = [
  { question: "Name the process by which plants make food using sunlight", acceptedAnswers: ["photosynthesis"] },
  { question: "What is the capital city of Australia?", acceptedAnswers: ["canberra"] },
  { question: "Name a programming language created by Google", acceptedAnswers: ["go", "golang", "dart", "kotlin"] },
  { question: "What element has the atomic number 1?", acceptedAnswers: ["hydrogen"] },
  { question: "Name the author of 'Half of a Yellow Sun'", acceptedAnswers: ["chimamanda", "adichie", "chimamanda adichie", "chimamanda ngozi adichie"] },
];

interface InteractiveSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season: QuizSeason;
}

type SessionPhase = "lobby" | "mode_select" | "playing" | "session_result";

export function InteractiveSessionDialog({ open, onOpenChange, season }: InteractiveSessionDialogProps) {
  const { toast } = useToast();

  const [sessionPhase, setSessionPhase] = useState<SessionPhase>("lobby");
  const [playMode, setPlayMode] = useState<PlayMode>("mixed");
  const [sessionPoints, setSessionPoints] = useState(0);
  const [sessionsPlayed, setSessionsPlayed] = useState(0);
  const [sessionsWon, setSessionsWon] = useState(0);
  const [sessionsLost, setSessionsLost] = useState(0);
  const [currentWinnings, setCurrentWinnings] = useState(0);
  const [accumulatedWinnings, setAccumulatedWinnings] = useState(0);
  const [isEvicted, setIsEvicted] = useState(false);
  const [lastResult, setLastResult] = useState<QuizPlayResult | null>(null);
  const [lastTier, setLastTier] = useState<ReturnType<typeof calculateQuizTier> | null>(null);
  const [showRedemption, setShowRedemption] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [activeObjectives, setActiveObjectives] = useState(allSessionObjectiveQuestions.slice(0, INTERACTIVE_DEFAULT_OBJECTIVE_PICK));

  const sessionFee = season.selectionProcesses?.[1]?.entryFee || season.entryFee * 2;
  const hasReachedGameShow = sessionPoints >= GAME_SHOW_ENTRY_POINTS;
  const pointsProgress = Math.min((sessionPoints / GAME_SHOW_ENTRY_POINTS) * 100, 100);

  const activeNonObjectives = playMode === "objectives_only" ? [] : sessionNonObjectiveQuestions;

  const handleSelectMode = (mode: PlayMode) => {
    setPlayMode(mode);
    if (mode === "objectives_only") {
      setActiveObjectives([...allSessionObjectiveQuestions]); // all 15
    } else {
      setActiveObjectives(pickRandomObjectives(allSessionObjectiveQuestions, INTERACTIVE_DEFAULT_OBJECTIVE_PICK)); // random 10
    }
    setPlayKey(p => p + 1);
    setLastResult(null);
    setLastTier(null);
    setSessionPhase("playing");
  };

  const handleSessionComplete = useCallback((result: QuizPlayResult) => {
    setSessionsPlayed(p => p + 1);
    setLastResult(result);

    const tier = playMode === "objectives_only"
      ? calculateObjectivesOnlyTier(result.percentage, result.totalCorrect)
      : calculateQuizTier(result.percentage);
    setLastTier(tier);

    if (tier.resetAll) {
      setSessionPoints(0);
      setCurrentWinnings(0);
      setAccumulatedWinnings(0);
      toast({ title: "💀 DISQUALIFIED!", description: "Below 60% — all points and winnings reset!", variant: "destructive" });
    } else {
      if (tier.points > 0) {
        setSessionPoints(p => p + tier.points);
        setSessionsWon(p => p + 1);
      }
      const instantPrize = Math.round(sessionFee * tier.prizeMultiplier);
      if (instantPrize > 0) {
        setCurrentWinnings(instantPrize);
        setAccumulatedWinnings(p => p + instantPrize);
      } else {
        setCurrentWinnings(0);
      }

      if (tier.points === 0 && !tier.resetAll) {
        const newLosses = sessionsLost + 1;
        setSessionsLost(newLosses);
        if (newLosses >= INTERACTIVE_MAX_LOSSES_BEFORE_EVICTION) {
          setIsEvicted(true);
          toast({ title: "⚠️ Evicted", description: `${INTERACTIVE_MAX_LOSSES_BEFORE_EVICTION}+ losses reached.`, variant: "destructive" });
        }
      }
    }
    setSessionPhase("session_result");
  }, [sessionsLost, sessionFee, toast, playMode]);

  const handleContinueToNext = () => {
    setCurrentWinnings(0);
    setSessionPhase("mode_select");
    toast({ title: "💨 Instant Prize Dissolved", description: "Points kept. Choose mode for next session." });
  };

  const handleTakeInstantPrize = () => {
    setSessionPoints(0);
    setShowRedemption(true);
    toast({ title: "⚠️ Points Dissolved", description: "Taking prize removes Game Show eligibility." });
  };

  const handleQuitWithWinnings = () => {
    if (accumulatedWinnings > 0) {
      setShowRedemption(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleStartSession = () => {
    setSessionPhase("mode_select");
  };

  const handlePlayAgainFresh = () => {
    setSessionPoints(0);
    setCurrentWinnings(0);
    setAccumulatedWinnings(0);
    setSessionsPlayed(0);
    setSessionsWon(0);
    setSessionsLost(0);
    setIsEvicted(false);
    setSessionPhase("mode_select");
  };

  return (
    <>
      <Dialog open={open && !showRedemption} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0 flex flex-col rounded-none sm:rounded-lg">
          {/* Header */}
          <div className="shrink-0 bg-gradient-to-r from-amber-500 to-orange-600 border-b p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5" />
                <div>
                  <h2 className="font-semibold text-sm">{season.name}</h2>
                  <p className="text-xs text-amber-200">
                    {sessionPhase === "lobby" && "Interactive Session"}
                    {sessionPhase === "mode_select" && "Choose Play Mode"}
                    {sessionPhase === "playing" && "Session In Progress"}
                    {sessionPhase === "session_result" && "Session Complete"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-0 text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  {sessionPoints} pts
                </Badge>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-white hover:bg-white/20">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain">
            {sessionPhase === "lobby" && (
              <div className="px-3 py-3 space-y-3">
                {isEvicted ? (
                  <Card className="border-red-300 bg-red-50 dark:bg-red-950/30">
                    <CardContent className="p-4 text-center space-y-2">
                      <p className="text-3xl">🚫</p>
                      <h3 className="font-bold text-red-700">You've Been Evicted</h3>
                      <p className="text-sm text-muted-foreground">
                        You accumulated {INTERACTIVE_MAX_LOSSES_BEFORE_EVICTION}+ losses and have been removed.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Points progress — target 300 */}
                    <Card className="border-amber-200">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-amber-500" /> Session Points
                          </span>
                          <span className="font-bold text-amber-600">{sessionPoints}/{GAME_SHOW_ENTRY_POINTS}</span>
                        </div>
                        <Progress value={pointsProgress} className="h-2 bg-amber-100 [&>div]:bg-amber-500" />
                        {hasReachedGameShow && (
                          <Badge className="bg-amber-500 text-white border-0 text-[10px]">🏆 Game Show Entry Unlocked!</Badge>
                        )}
                      </CardContent>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                        <p className="text-lg font-bold text-blue-600">{sessionsPlayed}</p>
                        <p className="text-[10px] text-muted-foreground">Played</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
                        <p className="text-lg font-bold text-green-600">{sessionsWon}</p>
                        <p className="text-[10px] text-muted-foreground">Won</p>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg text-center">
                        <p className="text-lg font-bold text-red-600">{sessionsLost}</p>
                        <p className="text-[10px] text-muted-foreground">Lost</p>
                      </div>
                    </div>

                    {/* Current winnings */}
                    {accumulatedWinnings > 0 && (
                      <Card className="border-green-300 bg-green-50 dark:bg-green-950/30">
                        <CardContent className="p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-700">Accrued Winnings</span>
                            <span className="font-bold text-green-600">{formatMobiAmount(accumulatedWinnings)}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">({formatLocalAmount(accumulatedWinnings, "NGN")})</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Session fee */}
                    <Card className="border-border">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Session Fee</span>
                          <span className="font-bold">{formatMobiAmount(sessionFee)}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          ({formatLocalAmount(sessionFee, "NGN")}) per session
                        </p>
                      </CardContent>
                    </Card>

                    {/* Scoring rules */}
                    <Card className="border-border bg-muted/30">
                      <CardContent className="p-3 space-y-2">
                        <p className="text-xs font-semibold flex items-center gap-1">
                          <Shield className="h-3.5 w-3.5" /> Scoring & Rules
                        </p>
                        <div className="space-y-1.5 text-[10px] text-muted-foreground">
                          <p className="font-medium text-foreground text-[11px]">Mixed Mode (10 Obj + 5 Written):</p>
                          <p className="flex items-start gap-1.5">
                            <span className="shrink-0 text-green-500">🌟</span>
                            100% correct = +3 Points, 500% prize
                          </p>
                          <p className="flex items-start gap-1.5">
                            <span className="shrink-0 text-blue-500">🔥</span>
                            90%+ correct = +2 Points, 50% prize
                          </p>
                          <p className="flex items-start gap-1.5">
                            <span className="shrink-0 text-amber-500">👍</span>
                            80%+ correct = +1 Point, 20% prize
                          </p>
                          <hr className="my-1.5 border-border" />
                          <p className="font-medium text-foreground text-[11px]">Objectives Only (15 Obj):</p>
                          <p className="flex items-start gap-1.5">
                            <span className="shrink-0 text-green-500">🌟</span>
                            15/15 correct = +3 Points, 350% prize
                          </p>
                          <p className="flex items-start gap-1.5">
                            <span className="shrink-0 text-purple-500">🎁</span>
                            12-14 correct = +1 Point, 20% consolation
                          </p>
                          <hr className="my-1.5 border-border" />
                          <p className="flex items-start gap-1.5">
                            <span className="shrink-0">😐</span>
                            60-79% = No points, continue playing
                          </p>
                          <p className="flex items-start gap-1.5">
                            <span className="shrink-0 text-red-500">💀</span>
                            Below 60% = DISQUALIFIED! All points & prizes reset!
                          </p>
                          <hr className="my-1 border-border" />
                          <p className="flex items-start gap-1.5">
                            <span className="shrink-0 text-amber-500">⚠</span>
                            Taking instant prize dissolves all points (no Game Show)
                          </p>
                          <p className="flex items-start gap-1.5">
                            <span className="shrink-0 text-amber-500">🏆</span>
                            {GAME_SHOW_ENTRY_POINTS} points = Game Show entry!
                          </p>
                          <p className="flex items-start gap-1.5">
                            <span className="shrink-0 text-red-500">⚠</span>
                            {INTERACTIVE_MAX_LOSSES_BEFORE_EVICTION}+ losses = automatic eviction
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}

            {/* Mode Selection */}
            {sessionPhase === "mode_select" && (
              <div className="px-3 py-3 space-y-4">
                <div className="text-center space-y-2 pt-2">
                  <p className="text-3xl">🎯</p>
                  <h3 className="font-bold text-base">Choose Play Mode</h3>
                  <p className="text-xs text-muted-foreground">Select how you want to play this session</p>
                </div>

                <Card className="border-2 border-amber-200 hover:border-amber-400 transition-all cursor-pointer active:scale-[0.98]" onClick={() => handleSelectMode("mixed")}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">Objectives + Written</h4>
                        <p className="text-xs text-muted-foreground">15 Questions (10 Obj + 5 Written)</p>
                      </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-2.5">
                      <p className="text-[10px] text-muted-foreground">🌟 100% = 500% • 🔥 90% = 50% • 👍 80% = 20%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer active:scale-[0.98]" onClick={() => handleSelectMode("objectives_only")}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Pencil className="h-5 w-5 text-purple-600" />
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
                          <p className="text-[10px] font-medium text-amber-700">Reduced Prize: 500% → 350%</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground">12-14 correct = 20% consolation prize</p>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            )}

            {sessionPhase === "playing" && (
              <QuizPlayEngine
                key={playKey}
                objectiveQuestions={activeObjectives}
                nonObjectiveQuestions={activeNonObjectives}
                onComplete={handleSessionComplete}
                seasonName={season.name}
                headerGradient="from-amber-500 to-orange-600"
                playMode={playMode}
              />
            )}

            {sessionPhase === "session_result" && lastResult && lastTier && (
              <div className="px-3 py-3 space-y-3">
                {/* Tier result */}
                <Card className={cn("border-2", {
                  "border-green-500 bg-green-50 dark:bg-green-950/30": lastTier.tier === "perfect",
                  "border-blue-400 bg-blue-50 dark:bg-blue-950/30": lastTier.tier === "excellent",
                  "border-amber-400 bg-amber-50 dark:bg-amber-950/30": lastTier.tier === "good",
                  "border-purple-400 bg-purple-50 dark:bg-purple-950/30": lastTier.tier === "consolation",
                  "border-border bg-muted/30": lastTier.tier === "pass",
                  "border-red-500 bg-red-50 dark:bg-red-950/30": lastTier.tier === "disqualified",
                })}>
                  <CardContent className="p-5 text-center space-y-3">
                    <p className="text-4xl">{TIER_LABELS[lastTier.tier].emoji}</p>
                    <h3 className={cn("font-bold text-lg", TIER_LABELS[lastTier.tier].color)}>
                      {TIER_LABELS[lastTier.tier].label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {lastResult.totalCorrect}/{lastResult.objectiveCorrect + lastResult.nonObjectiveCorrect} correct ({lastResult.percentage}%)
                    </p>
                    <Badge className="bg-muted text-foreground border-0 text-[10px]">
                      {playMode === "objectives_only" ? "Objectives Only" : "Mixed Mode"}
                    </Badge>
                    {lastTier.points > 0 && (
                      <Badge className="bg-primary text-primary-foreground border-0">
                        <TrendingUp className="h-3 w-3 mr-1" /> Total: {sessionPoints} Points
                      </Badge>
                    )}
                  </CardContent>
                </Card>

                {/* Instant prize */}
                {currentWinnings > 0 && !lastTier.resetAll && (
                  <Card className="border-green-300 bg-green-50/50 dark:bg-green-950/20">
                    <CardContent className="p-3 text-center space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <Gift className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">Instant Prize</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{formatMobiAmount(currentWinnings)}</p>
                      <p className="text-[10px] text-muted-foreground">({formatLocalAmount(currentWinnings, "NGN")})</p>
                    </CardContent>
                  </Card>
                )}

                {/* Disqualification notice */}
                {lastTier.resetAll && (
                  <Card className="border-red-300 bg-red-50 dark:bg-red-950/30">
                    <CardContent className="p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-500" />
                        <span className="text-xs font-bold text-red-700">Full Reset Applied</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">All points and winnings have been reset to zero. You must start fresh.</p>
                    </CardContent>
                  </Card>
                )}

                {/* Stats summary */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                    <p className="font-bold text-blue-600">{sessionsPlayed}</p>
                    <p className="text-[10px] text-muted-foreground">Played</p>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
                    <p className="font-bold text-green-600">{sessionsWon}</p>
                    <p className="text-[10px] text-muted-foreground">Won</p>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-center">
                    <p className="font-bold text-amber-600">{sessionPoints}</p>
                    <p className="text-[10px] text-muted-foreground">Points</p>
                  </div>
                </div>

                {/* Points progress */}
                <Card className="border-border">
                  <CardContent className="p-3">
                    <Progress value={pointsProgress} className="h-2 bg-muted [&>div]:bg-amber-500" />
                    <p className="text-[9px] text-center text-muted-foreground mt-1">{sessionPoints}/{GAME_SHOW_ENTRY_POINTS} points to Game Show</p>
                  </CardContent>
                </Card>

                {/* Game Show milestone */}
                {hasReachedGameShow && !lastTier.resetAll && (
                  <Card className="border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                    <CardContent className="p-4 text-center space-y-2">
                      <p className="text-3xl">🏆🎬</p>
                      <h3 className="font-bold text-amber-700">Game Show Entry Unlocked!</h3>
                      <p className="text-xs text-muted-foreground">{sessionPoints} points earned — you qualify!</p>
                    </CardContent>
                  </Card>
                )}

                {isEvicted && (
                  <Card className="border-red-300 bg-red-50 dark:bg-red-950/30">
                    <CardContent className="p-3 text-center">
                      <p className="text-sm font-bold text-red-700">🚫 You have been evicted</p>
                      <p className="text-xs text-muted-foreground mt-1">Too many losses. Session ended.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t px-3 py-3 bg-background space-y-2">
            {sessionPhase === "lobby" && !isEvicted && (
              <>
                <Button
                  className="w-full min-h-[44px] py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs leading-tight touch-manipulation whitespace-normal"
                  onClick={handleStartSession}
                >
                  <Zap className="h-4 w-4 mr-1.5 shrink-0" />
                  <span>Play Next Session ({formatMobiAmount(sessionFee)})</span>
                </Button>
                {accumulatedWinnings > 0 && (
                  <Button
                    className="w-full min-h-[40px] py-2 px-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs leading-tight touch-manipulation whitespace-normal"
                    onClick={handleQuitWithWinnings}
                  >
                    <span>Quit & Take Winnings ({formatMobiAmount(accumulatedWinnings)})</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full min-h-[38px] py-2 px-3 text-xs touch-manipulation"
                  onClick={() => onOpenChange(false)}
                >
                  Quit Without Winnings
                </Button>
              </>
            )}

            {sessionPhase === "lobby" && isEvicted && (
              <Button className="w-full h-12 text-sm touch-manipulation" onClick={() => onOpenChange(false)}>
                Exit Session
              </Button>
            )}

            {sessionPhase === "session_result" && !isEvicted && !lastTier?.resetAll && (
              <>
                {/* Game Show milestone actions */}
                {hasReachedGameShow && (
                  <Button
                    className="w-full min-h-[44px] py-2.5 px-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold text-xs leading-tight touch-manipulation whitespace-normal"
                    onClick={() => { toast({ title: "🎬 Entering Game Show!", description: "A journey to becoming a Mobi Celebrity!" }); onOpenChange(false); }}
                  >
                    <Trophy className="h-4 w-4 mr-1.5 shrink-0" />
                    <span>Enter Show Now — Mobi Celebrity!</span>
                  </Button>
                )}

                <Button
                  className="w-full min-h-[44px] py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs leading-tight touch-manipulation whitespace-normal"
                  onClick={handleContinueToNext}
                >
                  <Zap className="h-4 w-4 mr-1.5 shrink-0" />
                  <span>Continue to Next Session (prize dissolved)</span>
                </Button>
                {currentWinnings > 0 && (
                  <Button
                    className="w-full min-h-[40px] py-2 px-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs leading-tight touch-manipulation whitespace-normal"
                    onClick={handleTakeInstantPrize}
                  >
                    <Gift className="h-4 w-4 mr-1.5 shrink-0" />
                    <span>Take Instant Prize ({formatMobiAmount(currentWinnings)})</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full min-h-[38px] py-2 px-3 text-xs touch-manipulation"
                  onClick={() => setSessionPhase("lobby")}
                >
                  Back to Lobby
                </Button>
              </>
            )}

            {/* Disqualified result */}
            {sessionPhase === "session_result" && !isEvicted && lastTier?.resetAll && (
              <div className="space-y-2">
                <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-sm touch-manipulation" onClick={handlePlayAgainFresh}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Play Again (Fresh Start)
                </Button>
                <Button variant="outline" className="w-full h-12 text-sm touch-manipulation" onClick={() => onOpenChange(false)}>
                  Exit Session
                </Button>
              </div>
            )}

            {sessionPhase === "session_result" && isEvicted && (
              <>
                {accumulatedWinnings > 0 && (
                  <Button
                    className="w-full min-h-[40px] py-2 px-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs leading-tight touch-manipulation whitespace-normal"
                    onClick={handleQuitWithWinnings}
                  >
                    <span>Take Winnings & Exit ({formatMobiAmount(accumulatedWinnings)})</span>
                  </Button>
                )}
                <Button className="w-full h-12 text-sm touch-manipulation" onClick={() => onOpenChange(false)}>
                  Exit Session
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <QuizPrizeRedemptionSheet
        open={showRedemption}
        onOpenChange={(v) => {
          if (!v) {
            setShowRedemption(false);
            onOpenChange(false);
          }
        }}
        prizeAmount={accumulatedWinnings > 0 ? accumulatedWinnings : currentWinnings}
        prizeType="cash"
      />
    </>
  );
}
