import { useState, useEffect, useCallback, useRef } from "react";
import { X, Clock, Trophy, AlertTriangle, CheckCircle, XCircle, Wallet, Shield, Globe, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CommunityQuiz, COMMUNITY_ANSWER_LABELS, CommunityQuizQuestion } from "@/data/communityQuizData";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatMobiAmount, formatLocalAmount, formatLocalFirst } from "@/lib/mobiCurrencyTranslation";

const API = "/api/community";

interface PlayResult { questionsCorrect: number; winningPercentage: number; amountWon: number; stakePaid: number }

interface CommunityQuizPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: CommunityQuiz | null;
  communityId?: string;
  playerWalletBalance: number;
  onGameComplete: (result: PlayResult) => void;
}

type GameState = "pre_game" | "loading" | "playing" | "question_result" | "submitting" | "game_over";

interface AnswerResult {
  questionId: string;
  selectedAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
  timeExpired: boolean;
}

export function CommunityQuizPlayDialog({ open, onOpenChange, quiz, communityId, playerWalletBalance, onGameComplete }: CommunityQuizPlayDialogProps) {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>("pre_game");
  const [questions, setQuestions] = useState<CommunityQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [serverResult, setServerResult] = useState<PlayResult | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentQuestion = questions[currentQuestionIndex];
  const questionsCorrect = answers.filter(a => a.isCorrect).length;
  const totalAnswered = answers.length;

  // Reset + fetch full quiz (with questions) when dialog opens for a quiz
  useEffect(() => {
    if (!open || !quiz || !communityId) return;
    setGameState("loading");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setServerResult(null);
    setQuestions([]);

    fetch(`${API}/quiz.php?community_id=${communityId}&quiz_id=${quiz.id}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        setQuestions(d.quiz?.questions ?? []);
        setTimeRemaining(quiz.timeLimitPerQuestion);
        setGameState("pre_game");
      })
      .catch(() => {
        toast({ title: "Couldn't load quiz", variant: "destructive" });
        onOpenChange(false);
      });
  }, [open, quiz?.id, communityId]);

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
    const result: AnswerResult = { questionId: currentQuestion.id, selectedAnswer: null, correctAnswer: currentQuestion.correctAnswer, isCorrect: false, timeExpired: true };
    setAnswers(prev => [...prev, result]);
    setShowResult(true);
    setGameState("question_result");
    setTimeout(() => moveToNextQuestion(), 2000);
  }, [currentQuestionIndex, currentQuestion]);

  const handleAnswerSelect = (answerIndex: number) => { if (gameState !== "playing" || showResult) return; setSelectedAnswer(answerIndex); };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const result: AnswerResult = { questionId: currentQuestion.id, selectedAnswer, correctAnswer: currentQuestion.correctAnswer, isCorrect, timeExpired: false };
    setAnswers(prev => [...prev, result]);
    setShowResult(true);
    setGameState("question_result");
    setTimeout(() => moveToNextQuestion(), 2000);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      submitResult();
    } else {
      setCurrentQuestionIndex(prev => prev + 1); setSelectedAnswer(null); setShowResult(false);
      setTimeRemaining(quiz?.timeLimitPerQuestion || 30); setGameState("playing");
    }
  };

  const submitResult = async (finalAnswers?: AnswerResult[]) => {
    if (!quiz || !communityId) return;
    setGameState("submitting");
    const answerList = finalAnswers ?? answers;
    const elapsedSec = Math.max(0, Math.round((Date.now() - startTimeRef.current) / 1000));
    const completionTime = `${Math.floor(elapsedSec / 60)}:${String(elapsedSec % 60).padStart(2, "0")}`;

    try {
      const res = await fetch(`${API}/quiz.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "play_quiz", community_id: communityId, quiz_id: quiz.id,
          completion_time: completionTime,
          answers: answerList.map(a => ({ question_id: a.questionId, selected_answer: a.selectedAnswer })),
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Failed to submit quiz result");
      setServerResult({ questionsCorrect: d.questionsCorrect, winningPercentage: d.winningPercentage, amountWon: d.amountWon, stakePaid: d.stakePaid });
    } catch (e: any) {
      toast({ title: "Couldn't submit result", description: e.message, variant: "destructive" });
    } finally {
      setGameState("game_over");
    }
  };

  const startGame = () => {
    if (!quiz) return;
    if (playerWalletBalance < quiz.stakeAmount) { toast({ title: "Insufficient Balance", variant: "destructive" }); return; }
    startTimeRef.current = Date.now();
    setGameState("playing");
    setTimeRemaining(quiz.timeLimitPerQuestion);
  };

  const handleGameCompleteClick = () => {
    if (!serverResult) return;
    onGameComplete(serverResult);
    onOpenChange(false);
  };

  const handleExitGame = () => {
    if (gameState === "playing" || gameState === "question_result") { if (confirm("Exit? Your stake will be forfeited.")) onOpenChange(false); }
    else if (gameState !== "submitting") onOpenChange(false);
  };

  if (!quiz) return null;

  return (
    <Dialog open={open} onOpenChange={handleExitGame}>
      <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-500 border-b p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5" />
              <div>
                <h2 className="font-semibold text-sm line-clamp-1">{quiz.title}</h2>
                <p className="text-xs text-blue-100">
                  {gameState === "pre_game" ? "Ready to play" : gameState === "loading" ? "Loading..." : gameState === "submitting" ? "Submitting..." : gameState === "game_over" ? "Game Complete" : `Question ${currentQuestionIndex + 1} of ${questions.length}`}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleExitGame} className="h-8 w-8 text-white hover:bg-white/20"><X className="h-4 w-4" /></Button>
          </div>
          {(gameState === "playing" || gameState === "question_result") && (<div className="mt-3"><Progress value={(totalAnswered / questions.length) * 100} className="h-2 bg-blue-400 [&>div]:bg-white" /><div className="flex justify-between mt-1 text-xs text-blue-100"><span>{questionsCorrect} correct</span><span>{totalAnswered}/{questions.length}</span></div></div>)}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {gameState === "loading" && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" /><p className="text-sm">Loading quiz...</p>
            </div>
          )}

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
                <div className="grid grid-cols-3 gap-2 text-center text-sm"><div className="p-2 bg-white dark:bg-background rounded-lg"><p className="text-xs text-muted-foreground">Questions</p><p className="font-semibold">{questions.length || quiz.totalQuestions}</p></div><div className="p-2 bg-white dark:bg-background rounded-lg"><p className="text-xs text-muted-foreground">Time/Q</p><p className="font-semibold">{quiz.timeLimitPerQuestion}s</p></div><div className="p-2 bg-white dark:bg-background rounded-lg"><p className="text-xs text-muted-foreground">Options</p><p className="font-semibold">A-H</p></div></div>
              </CardContent></Card>
              <Card><CardContent className="p-4 space-y-3"><h3 className="font-semibold text-sm text-blue-700">Winning Structure</h3><div className="space-y-2 text-sm"><div className="flex items-center justify-between p-2 bg-green-50 rounded-lg"><span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />10/10</span><span className="font-semibold text-green-600">100% Win</span></div><div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg"><span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-yellow-500" />8-9/10</span><span className="font-semibold text-yellow-600">20% Win</span></div><div className="flex items-center justify-between p-2 bg-red-50 rounded-lg"><span className="flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500" />&lt;8/10</span><span className="font-semibold text-red-600">No Prize</span></div></div></CardContent></Card>
              <Card className={cn("border-2", playerWalletBalance >= quiz.stakeAmount ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50")}><CardContent className="p-4"><div className="flex items-center gap-3"><Wallet className={cn("h-5 w-5", playerWalletBalance >= quiz.stakeAmount ? "text-green-500" : "text-red-500")} /><div className="flex-1"><p className="text-sm font-medium">Your Wallet</p><p className="text-lg font-bold">{formatLocalAmount(playerWalletBalance, "NGN")}</p><p className="text-xs text-muted-foreground">({formatMobiAmount(playerWalletBalance)})</p></div><Badge variant={playerWalletBalance >= quiz.stakeAmount ? "outline" : "destructive"} className={playerWalletBalance >= quiz.stakeAmount ? "bg-green-100 text-green-600" : ""}>{playerWalletBalance >= quiz.stakeAmount ? "Sufficient" : "Insufficient"}</Badge></div></CardContent></Card>
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm"><AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" /><p className="text-muted-foreground">Once started, stake is deducted immediately. Answer carefully!</p></div>
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-muted-foreground"><Shield className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" /><p>Stakes go to Quiz Wallet. Winnings paid from Quiz Wallet.</p></div>
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

          {gameState === "submitting" && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" /><p className="text-sm">Submitting your result...</p>
            </div>
          )}

          {gameState === "game_over" && (
            <div className="space-y-4">
              {serverResult ? (
                <Card className={cn("border-2", serverResult.winningPercentage === 100 && "border-green-500 bg-green-50", serverResult.winningPercentage > 0 && serverResult.winningPercentage < 100 && "border-yellow-500 bg-yellow-50", serverResult.winningPercentage === 0 && "border-red-500 bg-red-50")}>
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={cn("inline-flex items-center justify-center w-16 h-16 rounded-full", serverResult.winningPercentage === 100 && "bg-green-100", serverResult.winningPercentage > 0 && serverResult.winningPercentage < 100 && "bg-yellow-100", serverResult.winningPercentage === 0 && "bg-red-100")}>
                      {serverResult.winningPercentage === 100 && <Trophy className="h-8 w-8 text-green-500" />}
                      {serverResult.winningPercentage > 0 && serverResult.winningPercentage < 100 && <Trophy className="h-8 w-8 text-yellow-500" />}
                      {serverResult.winningPercentage === 0 && <XCircle className="h-8 w-8 text-red-500" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{serverResult.winningPercentage === 100 ? "Congratulations!" : serverResult.winningPercentage > 0 ? "Good Job!" : "Better Luck Next Time!"}</h2>
                      <p className="text-muted-foreground mt-1">{serverResult.questionsCorrect}/{questions.length} correct</p>
                    </div>
                    {serverResult.amountWon > 0 && (
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground">You won</p>
                        <p className="text-3xl font-bold text-blue-600">{formatLocalAmount(serverResult.amountWon, "NGN")}</p>
                        <p className="text-sm text-muted-foreground">({formatMobiAmount(serverResult.amountWon)})</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-muted"><CardContent className="p-6 text-center text-sm text-muted-foreground">
                  Couldn't confirm your result with the server. Your stake and any winnings may not have been processed — please check your wallet and contact support if needed.
                </CardContent></Card>
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-10 bg-background border-t p-4">
          {gameState === "pre_game" && <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={startGame} disabled={playerWalletBalance < quiz.stakeAmount || questions.length === 0}>{playerWalletBalance >= quiz.stakeAmount ? `Start - Pay ${formatLocalFirst(quiz.stakeAmount, "NGN")}` : "Insufficient Balance"}</Button>}
          {gameState === "playing" && <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleConfirmAnswer} disabled={selectedAnswer === null}>{selectedAnswer === null ? "Select Answer" : `Confirm ${COMMUNITY_ANSWER_LABELS[selectedAnswer]}`}</Button>}
          {(gameState === "question_result" || gameState === "submitting") && <Button className="w-full" size="lg" disabled>Loading next...</Button>}
          {gameState === "game_over" && <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleGameCompleteClick}>Complete & Exit</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
