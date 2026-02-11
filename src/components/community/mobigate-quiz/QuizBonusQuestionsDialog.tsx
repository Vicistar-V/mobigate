import { useState, useEffect } from "react";
import { AlertTriangle, Clock, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { bonusQuestionsPool, BONUS_ACCEPT_TIMEOUT_SECONDS, BONUS_QUESTIONS_COUNT, BONUS_STAKE_MULTIPLIER } from "@/data/mobigateBonusQuestionsData";
import { MOBIGATE_ANSWER_LABELS } from "@/data/mobigateQuizData";
import { formatMobiAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface QuizBonusQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalStake: number;
  onComplete: (allCorrect: boolean) => void;
}

type BonusState = "offer" | "playing" | "result";

export function QuizBonusQuestionsDialog({ open, onOpenChange, originalStake, onComplete }: QuizBonusQuestionsDialogProps) {
  const { toast } = useToast();
  const [state, setState] = useState<BonusState>("offer");
  const [countdown, setCountdown] = useState(BONUS_ACCEPT_TIMEOUT_SECONDS);
  const [currentQ, setCurrentQ] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const bonusStake = Math.round(originalStake * BONUS_STAKE_MULTIPLIER);
  const questions = bonusQuestionsPool.slice(0, BONUS_QUESTIONS_COUNT);
  const currentQuestion = questions[currentQ];

  useEffect(() => {
    if (!open) {
      setState("offer");
      setCountdown(BONUS_ACCEPT_TIMEOUT_SECONDS);
      setCurrentQ(0);
      setCorrectCount(0);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [open]);

  // Countdown timer for bonus offer
  useEffect(() => {
    if (state !== "offer" || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onOpenChange(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [state, countdown]);

  const handleAccept = () => {
    toast({ title: "Bonus Accepted!", description: `${formatMobiAmount(bonusStake)} deducted for bonus questions.` });
    setState("playing");
  };

  const handleDecline = () => {
    onOpenChange(false);
  };

  const handleAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) setCorrectCount((p) => p + 1);
    setShowResult(true);

    setTimeout(() => {
      if (currentQ >= questions.length - 1) {
        const allCorrect = (isCorrect ? correctCount + 1 : correctCount) === questions.length;
        setState("result");
        setTimeout(() => onComplete(allCorrect), 1500);
      } else {
        setCurrentQ((p) => p + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
        <DialogHeader className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <DialogTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5" /> Bonus Questions
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {state === "offer" && (
            <>
              <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/30">
                <CardContent className="p-4 space-y-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-amber-600">
                    <Clock className="h-5 w-5" />
                    <span className="text-2xl font-bold tabular-nums">{countdown}s</span>
                  </div>
                  <Progress value={(countdown / BONUS_ACCEPT_TIMEOUT_SECONDS) * 100} className="h-2" />
                  <h3 className="font-bold text-lg">Bonus Questions Available!</h3>
                  <p className="text-sm text-muted-foreground">
                    Answer {BONUS_QUESTIONS_COUNT} extra questions correctly to win your prize!
                  </p>
                  <div className="p-3 bg-white dark:bg-background rounded-lg border">
                    <p className="text-xs text-muted-foreground">Additional Stake Required</p>
                    <p className="font-bold text-lg text-red-600">{formatMobiAmount(bonusStake)}</p>
                    <p className="text-[10px] text-muted-foreground">(50% of original stake)</p>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-xs text-left">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-muted-foreground">You must answer ALL {BONUS_QUESTIONS_COUNT} questions correctly to win. The offer expires in {countdown} seconds.</p>
                  </div>
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12" onClick={handleDecline}>Decline</Button>
                <Button className="h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white" onClick={handleAccept}>
                  Accept - Pay {formatMobiAmount(bonusStake)}
                </Button>
              </div>
            </>
          )}

          {state === "playing" && currentQuestion && (
            <>
              <div className="text-center text-sm text-muted-foreground">
                Question {currentQ + 1} of {BONUS_QUESTIONS_COUNT}
              </div>
              <Progress value={((currentQ + 1) / BONUS_QUESTIONS_COUNT) * 100} className="h-2" />
              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200">
                <CardContent className="p-4">
                  <p className="text-base font-medium">{currentQuestion.question}</p>
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-2">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => !showResult && setSelectedAnswer(idx)}
                    disabled={showResult}
                    className={cn(
                      "p-3 rounded-lg border-2 text-left transition-all",
                      selectedAnswer === idx && !showResult && "border-amber-500 bg-amber-50",
                      showResult && idx === currentQuestion.correctAnswer && "border-green-500 bg-green-50",
                      showResult && selectedAnswer === idx && idx !== currentQuestion.correctAnswer && "border-red-500 bg-red-50",
                      !showResult && selectedAnswer !== idx && "border-border"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                        selectedAnswer === idx && !showResult && "bg-amber-500 text-white",
                        showResult && idx === currentQuestion.correctAnswer && "bg-green-500 text-white",
                        showResult && selectedAnswer === idx && idx !== currentQuestion.correctAnswer && "bg-red-500 text-white",
                        !showResult && selectedAnswer !== idx && "bg-muted"
                      )}>
                        {MOBIGATE_ANSWER_LABELS[idx]}
                      </span>
                      <span className="text-sm">{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
              <Button className="w-full h-12 bg-amber-500 hover:bg-amber-600" onClick={handleAnswer} disabled={selectedAnswer === null || showResult}>
                {selectedAnswer === null ? "Select Answer" : "Confirm"}
              </Button>
            </>
          )}

          {state === "result" && (
            <Card className={cn("border-2", correctCount === questions.length ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50")}>
              <CardContent className="p-6 text-center space-y-3">
                <p className="text-4xl">{correctCount === questions.length ? "🎉" : "😞"}</p>
                <h3 className="font-bold text-lg">{correctCount === questions.length ? "All Correct!" : "Not Enough"}</h3>
                <p className="text-sm text-muted-foreground">{correctCount}/{questions.length} correct</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
