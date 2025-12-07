import { useState, useEffect, useCallback } from "react";
import { X, Clock, Trophy, AlertTriangle, CheckCircle, XCircle, Wallet } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Quiz, QuizQuestion, ANSWER_LABELS, calculateWinnings, calculateStakeDistribution } from "@/data/quizGameData";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface QuizGamePlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: Quiz | null;
  playerWalletBalance: number;
  onGameComplete: (result: {
    questionsCorrect: number;
    winningPercentage: number;
    amountWon: number;
    stakePaid: number;
  }) => void;
}

type GameState = "pre_game" | "playing" | "question_result" | "game_over";

interface AnswerResult {
  questionIndex: number;
  selectedAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
  timeExpired: boolean;
}

export function QuizGamePlayDialog({ 
  open, 
  onOpenChange, 
  quiz, 
  playerWalletBalance,
  onGameComplete 
}: QuizGamePlayDialogProps) {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>("pre_game");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [stakeDeducted, setStakeDeducted] = useState(false);

  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const questionsCorrect = answers.filter(a => a.isCorrect).length;
  const totalAnswered = answers.length;

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open && quiz) {
      setGameState("pre_game");
      setCurrentQuestionIndex(0);
      setTimeRemaining(quiz.timeLimitPerQuestion);
      setAnswers([]);
      setSelectedAnswer(null);
      setShowResult(false);
      setStakeDeducted(false);
    }
  }, [open, quiz]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== "playing" || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time expired - auto submit as wrong
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeRemaining, currentQuestionIndex]);

  const handleTimeExpired = useCallback(() => {
    if (!currentQuestion) return;

    const result: AnswerResult = {
      questionIndex: currentQuestionIndex,
      selectedAnswer: null,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: false,
      timeExpired: true
    };

    setAnswers(prev => [...prev, result]);
    setShowResult(true);
    setGameState("question_result");

    // Auto advance after showing result
    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  }, [currentQuestionIndex, currentQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (gameState !== "playing" || showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    const result: AnswerResult = {
      questionIndex: currentQuestionIndex,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeExpired: false
    };

    setAnswers(prev => [...prev, result]);
    setShowResult(true);
    setGameState("question_result");

    // Auto advance after showing result
    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      // Game over
      setGameState("game_over");
    } else {
      // Next question
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeRemaining(quiz?.timeLimitPerQuestion || 30);
      setGameState("playing");
    }
  };

  const startGame = () => {
    if (!quiz) return;

    // Check wallet balance
    if (playerWalletBalance < quiz.stakeAmount) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${quiz.currency} ${quiz.stakeAmount.toLocaleString()} to play this quiz.`,
        variant: "destructive"
      });
      return;
    }

    // Deduct stake (mock)
    setStakeDeducted(true);
    const { communityShare, mobigateShare } = calculateStakeDistribution(quiz.stakeAmount);
    
    toast({
      title: "Stake Deducted",
      description: `${quiz.currency} ${quiz.stakeAmount.toLocaleString()} has been deducted. Good luck!`,
    });

    // Start game
    setGameState("playing");
    setTimeRemaining(quiz.timeLimitPerQuestion);
  };

  const handleGameComplete = () => {
    if (!quiz) return;

    const finalCorrect = answers.filter(a => a.isCorrect).length;
    const { percentage, amount, status } = calculateWinnings(finalCorrect, quiz.winningAmount);

    onGameComplete({
      questionsCorrect: finalCorrect,
      winningPercentage: percentage,
      amountWon: amount,
      stakePaid: quiz.stakeAmount
    });

    onOpenChange(false);
  };

  const handleExitGame = () => {
    if (gameState === "playing" || gameState === "question_result") {
      // Warn user they will lose their stake
      if (confirm("Are you sure you want to exit? Your stake will be forfeited.")) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  if (!quiz) return null;

  const finalResult = gameState === "game_over" 
    ? calculateWinnings(answers.filter(a => a.isCorrect).length, quiz.winningAmount)
    : null;

  return (
    <Dialog open={open} onOpenChange={handleExitGame}>
      <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold text-sm line-clamp-1">{quiz.title}</h2>
                <p className="text-xs text-muted-foreground">
                  {gameState === "pre_game" ? "Ready to play" : 
                   gameState === "game_over" ? "Game Complete" :
                   `Question ${currentQuestionIndex + 1} of ${questions.length}`}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleExitGame} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress bar */}
          {gameState !== "pre_game" && (
            <div className="mt-3">
              <Progress 
                value={(totalAnswered / questions.length) * 100} 
                className="h-2"
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{questionsCorrect} correct</span>
                <span>{totalAnswered}/{questions.length} answered</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Pre-game state */}
          {gameState === "pre_game" && (
            <div className="space-y-4">
              {/* Quiz Info Card */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-xs text-muted-foreground">Stake Amount</p>
                      <p className="font-bold text-lg text-destructive">
                        {quiz.currency} {quiz.stakeAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-xs text-muted-foreground">Winning Amount</p>
                      <p className="font-bold text-lg text-primary">
                        {quiz.currency} {quiz.winningAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="p-2 bg-background rounded-lg">
                      <p className="text-xs text-muted-foreground">Questions</p>
                      <p className="font-semibold">10</p>
                    </div>
                    <div className="p-2 bg-background rounded-lg">
                      <p className="text-xs text-muted-foreground">Time/Q</p>
                      <p className="font-semibold">{quiz.timeLimitPerQuestion}s</p>
                    </div>
                    <div className="p-2 bg-background rounded-lg">
                      <p className="text-xs text-muted-foreground">Options</p>
                      <p className="font-semibold">A-H</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Winning Structure */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Winning Structure</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        10/10 correct
                      </span>
                      <span className="font-semibold text-green-600">100% Win</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-500/10 rounded-lg">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-yellow-500" />
                        8-9/10 correct
                      </span>
                      <span className="font-semibold text-yellow-600">50% Win</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-destructive/10 rounded-lg">
                      <span className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-destructive" />
                        &lt;8/10 correct
                      </span>
                      <span className="font-semibold text-destructive">No Prize</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Wallet Balance Check */}
              <Card className={cn(
                "border-2",
                playerWalletBalance >= quiz.stakeAmount 
                  ? "border-green-500/30 bg-green-500/5" 
                  : "border-destructive/30 bg-destructive/5"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Wallet className={cn(
                      "h-5 w-5",
                      playerWalletBalance >= quiz.stakeAmount ? "text-green-500" : "text-destructive"
                    )} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Your Wallet Balance</p>
                      <p className="text-lg font-bold">
                        {quiz.currency} {playerWalletBalance.toLocaleString()}
                      </p>
                    </div>
                    {playerWalletBalance >= quiz.stakeAmount ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                        Sufficient
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Insufficient</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Warning */}
              <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                <p className="text-muted-foreground">
                  Once you start, your stake will be deducted immediately. Unanswered questions 
                  when time expires cannot be repeated. Play carefully!
                </p>
              </div>
            </div>
          )}

          {/* Playing state */}
          {(gameState === "playing" || gameState === "question_result") && currentQuestion && (
            <div className="space-y-4">
              {/* Timer */}
              <div className="flex items-center justify-center gap-2">
                <Clock className={cn(
                  "h-5 w-5",
                  timeRemaining <= 10 ? "text-destructive animate-pulse" : "text-primary"
                )} />
                <span className={cn(
                  "text-2xl font-bold tabular-nums",
                  timeRemaining <= 10 ? "text-destructive" : "text-foreground"
                )}>
                  {timeRemaining}s
                </span>
              </div>

              {/* Timer Progress */}
              <Progress 
                value={(timeRemaining / (quiz.timeLimitPerQuestion)) * 100} 
                className={cn(
                  "h-2",
                  timeRemaining <= 10 && "[&>div]:bg-destructive"
                )}
              />

              {/* Question */}
              <Card className="bg-card">
                <CardContent className="p-4">
                  <p className="text-base font-medium leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </CardContent>
              </Card>

              {/* Answer Options - 8 options in 2 columns */}
              <div className="grid grid-cols-2 gap-2">
                {currentQuestion.options.map((option, index) => {
                  const label = ANSWER_LABELS[index];
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const showCorrect = showResult && isCorrect;
                  const showWrong = showResult && isSelected && !isCorrect;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={cn(
                        "relative p-3 rounded-lg border-2 text-left transition-all",
                        "hover:border-primary/50 hover:bg-primary/5",
                        "disabled:cursor-not-allowed",
                        isSelected && !showResult && "border-primary bg-primary/10",
                        showCorrect && "border-green-500 bg-green-500/10",
                        showWrong && "border-destructive bg-destructive/10",
                        !isSelected && !showCorrect && !showWrong && "border-border"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <span className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                          isSelected && !showResult && "bg-primary text-primary-foreground",
                          showCorrect && "bg-green-500 text-white",
                          showWrong && "bg-destructive text-white",
                          !isSelected && !showCorrect && !showWrong && "bg-muted"
                        )}>
                          {label}
                        </span>
                        <span className="text-sm leading-tight">{option}</span>
                      </div>
                      {showCorrect && (
                        <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-green-500" />
                      )}
                      {showWrong && (
                        <XCircle className="absolute top-2 right-2 h-4 w-4 text-destructive" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Result Message */}
              {showResult && (
                <div className={cn(
                  "p-3 rounded-lg text-center font-medium",
                  answers[answers.length - 1]?.isCorrect 
                    ? "bg-green-500/10 text-green-600"
                    : "bg-destructive/10 text-destructive"
                )}>
                  {answers[answers.length - 1]?.timeExpired 
                    ? "Time expired! Moving to next question..."
                    : answers[answers.length - 1]?.isCorrect 
                      ? "Correct! Well done!"
                      : `Wrong! The correct answer was ${ANSWER_LABELS[currentQuestion.correctAnswer]}`}
                </div>
              )}
            </div>
          )}

          {/* Game Over state */}
          {gameState === "game_over" && finalResult && (
            <div className="space-y-4">
              {/* Result Banner */}
              <Card className={cn(
                "border-2",
                finalResult.status === "won" && "border-green-500 bg-green-500/10",
                finalResult.status === "partial_win" && "border-yellow-500 bg-yellow-500/10",
                finalResult.status === "lost" && "border-destructive bg-destructive/10"
              )}>
                <CardContent className="p-6 text-center space-y-4">
                  <div className={cn(
                    "inline-flex items-center justify-center w-16 h-16 rounded-full",
                    finalResult.status === "won" && "bg-green-500/20",
                    finalResult.status === "partial_win" && "bg-yellow-500/20",
                    finalResult.status === "lost" && "bg-destructive/20"
                  )}>
                    {finalResult.status === "won" && <Trophy className="h-8 w-8 text-green-500" />}
                    {finalResult.status === "partial_win" && <Trophy className="h-8 w-8 text-yellow-500" />}
                    {finalResult.status === "lost" && <XCircle className="h-8 w-8 text-destructive" />}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      {finalResult.status === "won" && "Congratulations! You Won!"}
                      {finalResult.status === "partial_win" && "Good Job! Partial Win!"}
                      {finalResult.status === "lost" && "Better Luck Next Time!"}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      You answered {answers.filter(a => a.isCorrect).length}/10 questions correctly
                    </p>
                  </div>

                  {finalResult.amount > 0 && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">You won</p>
                      <p className="text-3xl font-bold text-primary">
                        {quiz.currency} {finalResult.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ({finalResult.percentage}% of {quiz.currency} {quiz.winningAmount.toLocaleString()})
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold">Score Breakdown</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground">Stake Paid</p>
                      <p className="font-semibold text-destructive">
                        -{quiz.currency} {quiz.stakeAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground">Amount Won</p>
                      <p className={cn(
                        "font-semibold",
                        finalResult.amount > 0 ? "text-green-600" : "text-muted-foreground"
                      )}>
                        {finalResult.amount > 0 ? "+" : ""}{quiz.currency} {finalResult.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Net Result</span>
                      <span className={cn(
                        "font-bold text-lg",
                        (finalResult.amount - quiz.stakeAmount) >= 0 ? "text-green-600" : "text-destructive"
                      )}>
                        {(finalResult.amount - quiz.stakeAmount) >= 0 ? "+" : ""}
                        {quiz.currency} {(finalResult.amount - quiz.stakeAmount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Answer Summary */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold">Answer Summary</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {answers.map((answer, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-lg font-semibold text-sm",
                          answer.isCorrect 
                            ? "bg-green-500/20 text-green-600" 
                            : "bg-destructive/20 text-destructive"
                        )}
                      >
                        Q{idx + 1}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 bg-background border-t p-4">
          {gameState === "pre_game" && (
            <Button 
              className="w-full" 
              size="lg"
              onClick={startGame}
              disabled={playerWalletBalance < quiz.stakeAmount}
            >
              {playerWalletBalance >= quiz.stakeAmount 
                ? `Start Game - Pay ${quiz.currency} ${quiz.stakeAmount.toLocaleString()}`
                : "Insufficient Wallet Balance"}
            </Button>
          )}

          {gameState === "playing" && (
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleConfirmAnswer}
              disabled={selectedAnswer === null}
            >
              {selectedAnswer === null ? "Select an Answer" : `Confirm Answer ${ANSWER_LABELS[selectedAnswer]}`}
            </Button>
          )}

          {gameState === "question_result" && (
            <Button className="w-full" size="lg" disabled>
              Loading next question...
            </Button>
          )}

          {gameState === "game_over" && (
            <Button className="w-full" size="lg" onClick={handleGameComplete}>
              Complete & Exit
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
