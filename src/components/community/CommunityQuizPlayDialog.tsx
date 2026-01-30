import { useState, useEffect, useCallback } from "react";
import { X, Clock, Trophy, AlertTriangle, CheckCircle, XCircle, Wallet, Shield, Globe } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CommunityQuiz, COMMUNITY_ANSWER_LABELS, calculateCommunityWinnings } from "@/data/communityQuizData";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatMobiAmount, formatLocalAmount, formatLocalFirst } from "@/lib/mobiCurrencyTranslation";

interface CommunityQuizPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: CommunityQuiz | null;
  playerWalletBalance: number;
  onGameComplete: (result: { questionsCorrect: number; winningPercentage: number; amountWon: number; stakePaid: number }) => void;
}

type GameState = "pre_game" | "playing" | "question_result" | "game_over";

interface AnswerResult {
  questionIndex: number;
  selectedAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
  timeExpired: boolean;
}

export function CommunityQuizPlayDialog({ open, onOpenChange, quiz, playerWalletBalance, onGameComplete }: CommunityQuizPlayDialogProps) {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>("pre_game");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const questionsCorrect = answers.filter(a => a.isCorrect).length;
  const totalAnswered = answers.length;

  useEffect(() => {
    if (open && quiz) {
      setGameState("pre_game");
      setCurrentQuestionIndex(0);
      setTimeRemaining(quiz.timeLimitPerQuestion);
      setAnswers([]);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [open, quiz]);

  useEffect(() => {
    if (gameState !== "playing" || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) { handleTimeExpired(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeRemaining]);

  const handleTimeExpired = useCallback(() => {
    if (!currentQuestion) return;
    const result: AnswerResult = { questionIndex: currentQuestionIndex, selectedAnswer: null, correctAnswer: currentQuestion.correctAnswer, isCorrect: false, timeExpired: true };
    setAnswers(prev => [...prev, result]);
    setShowResult(true);
    setGameState("question_result");
    setTimeout(() => moveToNextQuestion(), 2000);
  }, [currentQuestionIndex, currentQuestion]);

  const handleAnswerSelect = (answerIndex: number) => { if (gameState !== "playing" || showResult) return; setSelectedAnswer(answerIndex); };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const result: AnswerResult = { questionIndex: currentQuestionIndex, selectedAnswer, correctAnswer: currentQuestion.correctAnswer, isCorrect, timeExpired: false };
    setAnswers(prev => [...prev, result]);
    setShowResult(true);
    setGameState("question_result");
    setTimeout(() => moveToNextQuestion(), 2000);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex >= questions.length - 1) { setGameState("game_over"); } 
    else { setCurrentQuestionIndex(prev => prev + 1); setSelectedAnswer(null); setShowResult(false); setTimeRemaining(quiz?.timeLimitPerQuestion || 30); setGameState("playing"); }
  };

  const startGame = () => {
    if (!quiz) return;
    if (playerWalletBalance < quiz.stakeAmount) { toast({ title: "Insufficient Balance", variant: "destructive" }); return; }
    toast({ title: "Stake Deducted", description: `${formatLocalFirst(quiz.stakeAmount, "NGN")} deducted. Good luck!` });
    setGameState("playing");
    setTimeRemaining(quiz.timeLimitPerQuestion);
  };

  const handleGameCompleteClick = () => {
    if (!quiz) return;
    const finalCorrect = answers.filter(a => a.isCorrect).length;
    const { percentage, amount } = calculateCommunityWinnings(finalCorrect, quiz.winningAmount);
    onGameComplete({ questionsCorrect: finalCorrect, winningPercentage: percentage, amountWon: amount, stakePaid: quiz.stakeAmount });
    onOpenChange(false);
  };

  const handleExitGame = () => {
    if (gameState === "playing" || gameState === "question_result") { if (confirm("Exit? Your stake will be forfeited.")) onOpenChange(false); } 
    else onOpenChange(false);
  };

  if (!quiz) return null;
  const finalResult = gameState === "game_over" ? calculateCommunityWinnings(answers.filter(a => a.isCorrect).length, quiz.winningAmount) : null;

  return (
    <Dialog open={open} onOpenChange={handleExitGame}>
      <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-500 border-b p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5" />
              <div>
                <h2 className="font-semibold text-sm line-clamp-1">{quiz.title}</h2>
                <p className="text-xs text-blue-100">{gameState === "pre_game" ? "Ready to play" : gameState === "game_over" ? "Game Complete" : `Question ${currentQuestionIndex + 1} of ${questions.length}`}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleExitGame} className="h-8 w-8 text-white hover:bg-white/20"><X className="h-4 w-4" /></Button>
          </div>
          {gameState !== "pre_game" && (<div className="mt-3"><Progress value={(totalAnswered / questions.length) * 100} className="h-2 bg-blue-400 [&>div]:bg-white" /><div className="flex justify-between mt-1 text-xs text-blue-100"><span>{questionsCorrect} correct</span><span>{totalAnswered}/{questions.length}</span></div></div>)}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {gameState === "pre_game" && (
            <div className="space-y-4">
              <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200"><CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-white dark:bg-background rounded-lg border border-red-200">
                    <p className="text-xs text-muted-foreground">Stake</p>
                    <p className="font-bold text-lg text-red-600">{formatLocalAmount(quiz.stakeAmount, "NGN")}</p>
                    <p className="text-xs text-muted-foreground">({formatMobiAmount(quiz.stakeAmount)})</p>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-background rounded-lg border border-blue-200">
                    <p className="text-xs text-muted-foreground">Win Amount</p>
                    <p className="font-bold text-lg text-blue-600">{formatLocalAmount(quiz.winningAmount, "NGN")}</p>
                    <p className="text-xs text-muted-foreground">({formatMobiAmount(quiz.winningAmount)})</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm"><div className="p-2 bg-white dark:bg-background rounded-lg"><p className="text-xs text-muted-foreground">Questions</p><p className="font-semibold">10</p></div><div className="p-2 bg-white dark:bg-background rounded-lg"><p className="text-xs text-muted-foreground">Time/Q</p><p className="font-semibold">{quiz.timeLimitPerQuestion}s</p></div><div className="p-2 bg-white dark:bg-background rounded-lg"><p className="text-xs text-muted-foreground">Options</p><p className="font-semibold">A-H</p></div></div>
              </CardContent></Card>
              <Card><CardContent className="p-4 space-y-3"><h3 className="font-semibold text-sm text-blue-700">Winning Structure</h3><div className="space-y-2 text-sm"><div className="flex items-center justify-between p-2 bg-green-50 rounded-lg"><span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />10/10</span><span className="font-semibold text-green-600">100% Win</span></div><div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg"><span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-yellow-500" />8-9/10</span><span className="font-semibold text-yellow-600">50% Win</span></div><div className="flex items-center justify-between p-2 bg-red-50 rounded-lg"><span className="flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500" />&lt;8/10</span><span className="font-semibold text-red-600">No Prize</span></div></div></CardContent></Card>
              <Card className={cn("border-2", playerWalletBalance >= quiz.stakeAmount ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50")}><CardContent className="p-4"><div className="flex items-center gap-3"><Wallet className={cn("h-5 w-5", playerWalletBalance >= quiz.stakeAmount ? "text-green-500" : "text-red-500")} /><div className="flex-1"><p className="text-sm font-medium">Your Wallet</p><p className="text-lg font-bold">{formatLocalAmount(playerWalletBalance, "NGN")}</p><p className="text-xs text-muted-foreground">({formatMobiAmount(playerWalletBalance)})</p></div><Badge variant={playerWalletBalance >= quiz.stakeAmount ? "outline" : "destructive"} className={playerWalletBalance >= quiz.stakeAmount ? "bg-green-100 text-green-600" : ""}>{playerWalletBalance >= quiz.stakeAmount ? "Sufficient" : "Insufficient"}</Badge></div></CardContent></Card>
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm"><AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" /><p className="text-muted-foreground">Once started, stake is deducted immediately. Answer carefully!</p></div>
              <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg text-xs text-muted-foreground"><Globe className="h-4 w-4 text-primary mt-0.5 shrink-0" /><p>All amounts displayed in local currency (₦) with Mobi (M) equivalent.</p></div>
            </div>
          )}

          {(gameState === "playing" || gameState === "question_result") && currentQuestion && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2"><Clock className={cn("h-5 w-5", timeRemaining <= 10 ? "text-red-500 animate-pulse" : "text-blue-600")} /><span className={cn("text-2xl font-bold tabular-nums", timeRemaining <= 10 ? "text-red-500" : "")}>{timeRemaining}s</span></div>
              <Progress value={(timeRemaining / quiz.timeLimitPerQuestion) * 100} className={cn("h-2", timeRemaining <= 10 && "[&>div]:bg-red-500")} />
              <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200"><CardContent className="p-4"><p className="text-base font-medium leading-relaxed">{currentQuestion.question}</p></CardContent></Card>
              <div className="grid grid-cols-2 gap-2">
                {currentQuestion.options.map((option, index) => {
                  const label = COMMUNITY_ANSWER_LABELS[index];
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const showCorrect = showResult && isCorrect;
                  const showWrong = showResult && isSelected && !isCorrect;
                  return (<button key={index} onClick={() => handleAnswerSelect(index)} disabled={showResult} className={cn("relative p-3 rounded-lg border-2 text-left transition-all hover:border-blue-400", isSelected && !showResult && "border-blue-500 bg-blue-50", showCorrect && "border-green-500 bg-green-50", showWrong && "border-red-500 bg-red-50", !isSelected && !showCorrect && !showWrong && "border-gray-200")}><div className="flex items-start gap-2"><span className={cn("flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0", isSelected && !showResult && "bg-blue-500 text-white", showCorrect && "bg-green-500 text-white", showWrong && "bg-red-500 text-white", !isSelected && !showCorrect && !showWrong && "bg-gray-100")}>{label}</span><span className="text-sm leading-tight">{option}</span></div>{showCorrect && <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-green-500" />}{showWrong && <XCircle className="absolute top-2 right-2 h-4 w-4 text-red-500" />}</button>);
                })}
              </div>
              {showResult && (<div className={cn("p-3 rounded-lg text-center font-medium", answers[answers.length - 1]?.isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>{answers[answers.length - 1]?.timeExpired ? "Time expired!" : answers[answers.length - 1]?.isCorrect ? "Correct!" : `Wrong! Answer: ${COMMUNITY_ANSWER_LABELS[currentQuestion.correctAnswer]}`}</div>)}
            </div>
          )}

          {gameState === "game_over" && finalResult && (
            <div className="space-y-4">
              <Card className={cn("border-2", finalResult.status === "won" && "border-green-500 bg-green-50", finalResult.status === "partial_win" && "border-yellow-500 bg-yellow-50", finalResult.status === "lost" && "border-red-500 bg-red-50")}><CardContent className="p-6 text-center space-y-4"><div className={cn("inline-flex items-center justify-center w-16 h-16 rounded-full", finalResult.status === "won" && "bg-green-100", finalResult.status === "partial_win" && "bg-yellow-100", finalResult.status === "lost" && "bg-red-100")}>{finalResult.status === "won" && <Trophy className="h-8 w-8 text-green-500" />}{finalResult.status === "partial_win" && <Trophy className="h-8 w-8 text-yellow-500" />}{finalResult.status === "lost" && <XCircle className="h-8 w-8 text-red-500" />}</div><div><h2 className="text-xl font-bold">{finalResult.status === "won" ? "Congratulations!" : finalResult.status === "partial_win" ? "Good Job!" : "Better Luck Next Time!"}</h2><p className="text-muted-foreground mt-1">{answers.filter(a => a.isCorrect).length}/10 correct</p></div>{finalResult.amount > 0 && (<div className="pt-2"><p className="text-sm text-muted-foreground">You won</p><p className="text-3xl font-bold text-blue-600">{formatLocalAmount(finalResult.amount, "NGN")}</p><p className="text-sm text-muted-foreground">({formatMobiAmount(finalResult.amount)})</p></div>)}</CardContent></Card>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-10 bg-background border-t p-4">
          {gameState === "pre_game" && <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={startGame} disabled={playerWalletBalance < quiz.stakeAmount}>{playerWalletBalance >= quiz.stakeAmount ? `Start - Pay ${formatLocalFirst(quiz.stakeAmount, "NGN")}` : "Insufficient Balance"}</Button>}
          {gameState === "playing" && <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleConfirmAnswer} disabled={selectedAnswer === null}>{selectedAnswer === null ? "Select Answer" : `Confirm ${COMMUNITY_ANSWER_LABELS[selectedAnswer]}`}</Button>}
          {gameState === "question_result" && <Button className="w-full" size="lg" disabled>Loading next...</Button>}
          {gameState === "game_over" && <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleGameCompleteClick}>Complete & Exit</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
