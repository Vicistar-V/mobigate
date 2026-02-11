import { useState, useEffect } from "react";
import { X, Clock, Trophy, CheckCircle, XCircle, Zap, ArrowRight, LogOut } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MOBIGATE_ANSWER_LABELS } from "@/data/mobigateQuizData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { QuizPrizeRedemptionSheet } from "./QuizPrizeRedemptionSheet";

// Mock questions
const standardQuestions = [
  { question: "What is the capital of Nigeria?", options: ["Lagos", "Kano", "Abuja", "Port Harcourt", "Ibadan", "Benin City", "Kaduna", "Jos"], correctAnswer: 2 },
  { question: "Which river is the longest in Africa?", options: ["Congo", "Niger", "Nile", "Zambezi", "Orange", "Limpopo", "Volta", "Senegal"], correctAnswer: 2 },
  { question: "What is the chemical formula of water?", options: ["CO2", "NaCl", "H2O", "O2", "H2SO4", "CH4", "NH3", "HCl"], correctAnswer: 2 },
  { question: "Who is the founder of Microsoft?", options: ["Steve Jobs", "Mark Zuckerberg", "Bill Gates", "Larry Page", "Jeff Bezos", "Elon Musk", "Tim Cook", "Jack Ma"], correctAnswer: 2 },
  { question: "How many continents are there?", options: ["5", "6", "7", "8", "4", "9", "10", "3"], correctAnswer: 2 },
  { question: "What is the largest organ in the human body?", options: ["Heart", "Liver", "Skin", "Brain", "Lungs", "Kidneys", "Stomach", "Intestine"], correctAnswer: 2 },
  { question: "Which gas do plants absorb?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen", "Helium", "Argon", "Methane", "Neon"], correctAnswer: 2 },
  { question: "What is the boiling point of water in Celsius?", options: ["90°C", "95°C", "100°C", "105°C", "110°C", "80°C", "120°C", "85°C"], correctAnswer: 2 },
  { question: "Which planet is closest to the Sun?", options: ["Venus", "Earth", "Mercury", "Mars", "Jupiter", "Saturn", "Neptune", "Uranus"], correctAnswer: 2 },
  { question: "What year did Nigeria become a republic?", options: ["1960", "1962", "1963", "1966", "1970", "1975", "1979", "1999"], correctAnswer: 2 },
];

interface StandardQuizContinueSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
  levelName: string;
  stake: number;
  baseWinning: number;
}

type GamePhase = "playing" | "session_result" | "continue_choice" | "game_over";

export function StandardQuizContinueSheet({ open, onOpenChange, category, levelName, stake, baseWinning }: StandardQuizContinueSheetProps) {
  const { toast } = useToast();
  const [currentQ, setCurrentQ] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [session, setSession] = useState(1);
  const [totalPrize, setTotalPrize] = useState(0);
  const [showRedemption, setShowRedemption] = useState(false);

  const currentWinning = session === 1 ? baseWinning : baseWinning * Math.pow(2, session - 1);
  const question = standardQuestions[currentQ];

  useEffect(() => {
    if (!open) {
      setCurrentQ(0);
      setTimeRemaining(15);
      setSelectedAnswer(null);
      setShowResult(false);
      setCorrectCount(0);
      setPhase("playing");
      setSession(1);
      setTotalPrize(0);
    }
  }, [open]);

  useEffect(() => {
    if (phase !== "playing" || showResult || !open) return;
    if (timeRemaining <= 0) {
      setShowResult(true);
      setTimeout(() => nextQuestion(false), 1500);
      return;
    }
    const timer = setInterval(() => setTimeRemaining(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, phase, showResult, open]);

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === question.correctAnswer;
    if (isCorrect) setCorrectCount(p => p + 1);
    setShowResult(true);
    setTimeout(() => nextQuestion(isCorrect), 1500);
  };

  const nextQuestion = (lastCorrect: boolean) => {
    if (currentQ >= 9) {
      // Session complete
      const finalCorrect = correctCount + (lastCorrect ? 1 : 0);
      if (finalCorrect === 10) {
        setTotalPrize(p => p + currentWinning);
        if (session >= 10) {
          setPhase("game_over");
        } else {
          setPhase("continue_choice");
        }
      } else if (finalCorrect >= 8) {
        // Partial - 20% win
        setTotalPrize(p => p + Math.round(currentWinning * 0.2));
        setPhase("session_result");
      } else {
        // Lost everything
        setTotalPrize(0);
        setPhase("game_over");
      }
    } else {
      setCurrentQ(p => p + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeRemaining(15);
    }
  };

  const handleContinue = () => {
    toast({ title: "Next Session!", description: `${formatMobiAmount(stake)} deducted for session ${session + 1}` });
    setSession(p => p + 1);
    setCurrentQ(0);
    setCorrectCount(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeRemaining(15);
    setPhase("playing");
  };

  const handleExit = () => {
    if (totalPrize > 0) {
      setShowRedemption(true);
    } else {
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open && !showRedemption} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-amber-500 to-orange-500 border-b p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-sm">{category}</h2>
                <p className="text-xs text-amber-200">{levelName} • Session {session}/10 • Q{currentQ + 1}/10</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
            {phase === "playing" && <Progress value={((currentQ + (showResult ? 1 : 0)) / 10) * 100} className="h-1.5 mt-2 bg-amber-400 [&>div]:bg-white" />}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
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
                        )}>{MOBIGATE_ANSWER_LABELS[idx]}</span>
                        <span className="text-sm">{opt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {phase === "session_result" && (
              <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30">
                <CardContent className="p-6 text-center space-y-3">
                  <p className="text-4xl">⭐</p>
                  <h3 className="font-bold text-lg">Partial Win!</h3>
                  <p className="text-sm text-muted-foreground">{correctCount}/10 correct (80%+)</p>
                  <p className="text-sm">Won 20%: <span className="font-bold text-green-600">{formatMobiAmount(Math.round(currentWinning * 0.2))}</span></p>
                  <p className="text-sm font-medium">Total Prize: <span className="text-green-600">{formatMobiAmount(totalPrize)}</span></p>
                </CardContent>
              </Card>
            )}

            {phase === "continue_choice" && (
              <div className="space-y-4">
                <Card className="border-green-300 bg-green-50 dark:bg-green-950/30">
                  <CardContent className="p-6 text-center space-y-3">
                    <p className="text-4xl">🔥</p>
                    <h3 className="font-bold text-lg">Perfect Score!</h3>
                    <p className="text-sm text-muted-foreground">10/10 correct - Session {session} complete!</p>
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
                {selectedAnswer === null ? "Select Answer" : showResult ? "Loading..." : `Confirm ${MOBIGATE_ANSWER_LABELS[selectedAnswer]}`}
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
