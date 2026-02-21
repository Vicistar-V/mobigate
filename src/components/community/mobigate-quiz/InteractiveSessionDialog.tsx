import { useState, useCallback } from "react";
import { X, Zap, Trophy, AlertTriangle, Shield, Star, TrendingUp } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  QuizSeason,
  INTERACTIVE_MAX_LOSSES_BEFORE_EVICTION,
  INTERACTIVE_QUALIFYING_TOP_PERCENT,
} from "@/data/mobigateInteractiveQuizData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { QuizPlayEngine, QuizPlayResult } from "./QuizPlayEngine";
import { QuizPrizeRedemptionSheet } from "./QuizPrizeRedemptionSheet";

// Same questions used in the initial quiz — in production these would come from merchant's bank
const sessionObjectiveQuestions = [
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

type SessionPhase = "lobby" | "playing" | "session_result";

export function InteractiveSessionDialog({ open, onOpenChange, season }: InteractiveSessionDialogProps) {
  const { toast } = useToast();

  const [sessionPhase, setSessionPhase] = useState<SessionPhase>("lobby");
  const [sessionPoints, setSessionPoints] = useState(0);
  const [sessionsPlayed, setSessionsPlayed] = useState(0);
  const [sessionsWon, setSessionsWon] = useState(0);
  const [sessionsLost, setSessionsLost] = useState(0);
  const [currentWinnings, setCurrentWinnings] = useState(0);
  const [isEvicted, setIsEvicted] = useState(false);
  const [lastResult, setLastResult] = useState<QuizPlayResult | null>(null);
  const [showRedemption, setShowRedemption] = useState(false);
  const [playKey, setPlayKey] = useState(0); // force re-mount of engine

  const qualifyingPoints = season.selectionProcesses?.[0]?.entriesSelected
    ? Math.ceil(season.selectionProcesses[0].entriesSelected * (INTERACTIVE_QUALIFYING_TOP_PERCENT / 100))
    : 15;
  const sessionFee = season.selectionProcesses?.[1]?.entryFee || season.entryFee * 2;
  const sessionWinAmount = sessionFee * 3;

  const handleSessionComplete = useCallback((result: QuizPlayResult) => {
    setSessionsPlayed((p) => p + 1);
    setLastResult(result);

    if (result.percentage === 100) {
      setSessionPoints((p) => p + 1);
      setSessionsWon((p) => p + 1);
      setCurrentWinnings(sessionWinAmount);
      toast({ title: "🌟 Perfect Session!", description: "+1 Point earned!" });
    } else {
      const newLosses = sessionsLost + 1;
      setSessionsLost(newLosses + 1);
      if (newLosses + 1 >= INTERACTIVE_MAX_LOSSES_BEFORE_EVICTION) {
        setIsEvicted(true);
        toast({ title: "⚠️ Evicted", description: `You've reached ${INTERACTIVE_MAX_LOSSES_BEFORE_EVICTION} losses.`, variant: "destructive" });
      }
    }
    setSessionPhase("session_result");
  }, [sessionsLost, sessionWinAmount, toast]);

  const handleContinueToNext = () => {
    // Dissolve current winnings
    setCurrentWinnings(0);
    setPlayKey((p) => p + 1);
    setLastResult(null);
    setSessionPhase("playing");
    toast({ title: "💨 Winnings Dissolved", description: "Previous winnings absorbed. New session started." });
  };

  const handleQuitWithWinnings = () => {
    if (currentWinnings > 0) {
      setShowRedemption(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleStartSession = () => {
    setPlayKey((p) => p + 1);
    setLastResult(null);
    setSessionPhase("playing");
  };

  const pointsProgress = Math.min((sessionPoints / 15) * 100, 100);

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
                        You accumulated {INTERACTIVE_MAX_LOSSES_BEFORE_EVICTION}+ losses and have been removed from this Interactive Session.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Points progress */}
                    <Card className="border-amber-200">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-amber-500" /> Session Points
                          </span>
                          <span className="font-bold text-amber-600">{sessionPoints}/15</span>
                        </div>
                        <Progress value={pointsProgress} className="h-2 bg-amber-100 [&>div]:bg-amber-500" />
                        <p className="text-[10px] text-muted-foreground">
                          Score 100% in each session to earn 1 point. Top {INTERACTIVE_QUALIFYING_TOP_PERCENT}% qualify for the Show!
                        </p>
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
                    {currentWinnings > 0 && (
                      <Card className="border-green-300 bg-green-50 dark:bg-green-950/30">
                        <CardContent className="p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-700">Current Winnings</span>
                            <span className="font-bold text-green-600">{formatMobiAmount(currentWinnings)}</span>
                          </div>
                          <div className="flex items-start gap-1.5 p-2 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-200">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-amber-700">
                              Continuing to next session will <strong>dissolve</strong> these winnings!
                            </p>
                          </div>
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

                    {/* Eviction rules */}
                    <Card className="border-border bg-muted/30">
                      <CardContent className="p-3 space-y-2">
                        <p className="text-xs font-semibold flex items-center gap-1">
                          <Shield className="h-3.5 w-3.5" /> Session Rules
                        </p>
                        <div className="space-y-1.5 text-[10px] text-muted-foreground">
                          <p className="flex items-start gap-1.5">
                            <span className="shrink-0">•</span>
                            Score 100% = +1 Point. No 100% = No point, but you can continue.
                          </p>
                          <p className="flex items-start gap-1.5">
                            <span className="shrink-0">•</span>
                            Continuing dissolves all current winnings.
                          </p>
                          <p className="flex items-start gap-1.5">
                            <span className="shrink-0 text-red-500">⚠</span>
                            {INTERACTIVE_MAX_LOSSES_BEFORE_EVICTION}+ losses = automatic eviction.
                          </p>
                          <p className="flex items-start gap-1.5">
                            <span className="shrink-0 text-amber-500">🏆</span>
                            Top {INTERACTIVE_QUALIFYING_TOP_PERCENT}% by points qualify for the Show proper.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}

            {sessionPhase === "playing" && (
              <QuizPlayEngine
                key={playKey}
                objectiveQuestions={sessionObjectiveQuestions}
                nonObjectiveQuestions={sessionNonObjectiveQuestions}
                onComplete={handleSessionComplete}
                seasonName={season.name}
                headerGradient="from-amber-500 to-orange-600"
              />
            )}

            {sessionPhase === "session_result" && lastResult && (
              <div className="px-3 py-3 space-y-3">
                <Card className={cn(
                  "border-2",
                  lastResult.percentage === 100
                    ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                    : "border-orange-300 bg-orange-50 dark:bg-orange-950/30"
                )}>
                  <CardContent className="p-5 text-center space-y-3">
                    <p className="text-4xl">{lastResult.percentage === 100 ? "🌟" : "😐"}</p>
                    <h3 className="font-bold text-lg">
                      {lastResult.percentage === 100 ? "+1 Point Earned!" : "No Point Earned"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {lastResult.totalCorrect}/15 correct ({lastResult.percentage}%)
                    </p>
                    {lastResult.percentage === 100 && (
                      <div className="pt-2">
                        <Badge className="bg-green-500 text-white border-0">
                          <TrendingUp className="h-3 w-3 mr-1" /> Total: {sessionPoints} Points
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

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
                {currentWinnings > 0 && (
                  <Button
                    className="w-full min-h-[40px] py-2 px-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs leading-tight touch-manipulation whitespace-normal"
                    onClick={handleQuitWithWinnings}
                  >
                    <span>Quit & Take Winnings ({formatMobiAmount(currentWinnings)})</span>
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

            {sessionPhase === "session_result" && !isEvicted && (
              <>
                <Button
                  className="w-full min-h-[44px] py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs leading-tight touch-manipulation whitespace-normal"
                  onClick={handleContinueToNext}
                >
                  <Zap className="h-4 w-4 mr-1.5 shrink-0" />
                  <span>Continue to Next Session</span>
                </Button>
                {currentWinnings > 0 && (
                  <Button
                    className="w-full min-h-[40px] py-2 px-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs leading-tight touch-manipulation whitespace-normal"
                    onClick={handleQuitWithWinnings}
                  >
                    <span>Quit & Take Winnings ({formatMobiAmount(currentWinnings)})</span>
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

            {sessionPhase === "session_result" && isEvicted && (
              <>
                {currentWinnings > 0 && (
                  <Button
                    className="w-full min-h-[40px] py-2 px-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs leading-tight touch-manipulation whitespace-normal"
                    onClick={handleQuitWithWinnings}
                  >
                    <span>Take Winnings & Exit ({formatMobiAmount(currentWinnings)})</span>
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
        prizeAmount={currentWinnings}
        prizeType="cash"
      />
    </>
  );
}
