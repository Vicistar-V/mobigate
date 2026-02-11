import { useState, useEffect, useCallback } from "react";
import { X, Clock, Trophy, CheckCircle, XCircle, Globe, Flame, Users } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MOBIGATE_ANSWER_LABELS } from "@/data/mobigateQuizData";
import { getGroupPrizeMultiplier } from "@/data/mobigateGroupQuizData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock group quiz questions
const groupQuestions = [
  { id: "gq1", question: "Which country has the largest population in Africa?", options: ["South Africa", "Egypt", "Nigeria", "Ethiopia", "Kenya", "Ghana", "Tanzania", "Algeria"], correctAnswer: 2 },
  { id: "gq2", question: "What is the tallest building in the world?", options: ["Shanghai Tower", "Makkah Clock Tower", "Burj Khalifa", "One World Trade", "Taipei 101", "Lotte World Tower", "CN Tower", "Empire State"], correctAnswer: 2 },
  { id: "gq3", question: "Which element has the chemical symbol 'O'?", options: ["Osmium", "Gold", "Oxygen", "Oganesson", "Iron", "Zinc", "Lead", "Silver"], correctAnswer: 2 },
  { id: "gq4", question: "Who wrote 'Things Fall Apart'?", options: ["Wole Soyinka", "Chimamanda Adichie", "Chinua Achebe", "Ben Okri", "Flora Nwapa", "Buchi Emecheta", "Ngugi wa Thiong'o", "Ama Ata Aidoo"], correctAnswer: 2 },
  { id: "gq5", question: "What is the currency of Japan?", options: ["Yuan", "Won", "Yen", "Ringgit", "Baht", "Rupee", "Dollar", "Peso"], correctAnswer: 2 },
  { id: "gq6", question: "Which planet has the most moons?", options: ["Jupiter", "Uranus", "Saturn", "Neptune", "Mars", "Earth", "Venus", "Mercury"], correctAnswer: 2 },
  { id: "gq7", question: "In what year did World War II end?", options: ["1943", "1944", "1945", "1946", "1947", "1942", "1948", "1941"], correctAnswer: 2 },
  { id: "gq8", question: "What is the largest desert in the world?", options: ["Gobi", "Kalahari", "Sahara", "Arabian", "Patagonian", "Great Victoria", "Syrian", "Great Basin"], correctAnswer: 2 },
  { id: "gq9", question: "Which blood type is the universal donor?", options: ["A+", "B+", "O-", "AB+", "A-", "B-", "O+", "AB-"], correctAnswer: 2 },
  { id: "gq10", question: "What is the speed of light approximately?", options: ["200,000 km/s", "250,000 km/s", "300,000 km/s", "350,000 km/s", "150,000 km/s", "400,000 km/s", "500,000 km/s", "100,000 km/s"], correctAnswer: 2 },
];

interface GroupQuizPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stake: number;
  playerCount: number;
  players: Array<{ id: string; name: string; avatar: string; isHost: boolean }>;
}

export function GroupQuizPlayDialog({ open, onOpenChange, stake, playerCount, players }: GroupQuizPlayDialogProps) {
  const { toast } = useToast();
  const [currentQ, setCurrentQ] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [opponentScores, setOpponentScores] = useState<Record<string, number>>({});

  const question = groupQuestions[currentQ];
  const multiplier = getGroupPrizeMultiplier(playerCount);
  const totalPrize = stake * multiplier;

  useEffect(() => {
    if (!open) {
      setCurrentQ(0);
      setTimeRemaining(15);
      setSelectedAnswer(null);
      setShowResult(false);
      setCorrectCount(0);
      setGameOver(false);
      setOpponentScores({});
      return;
    }
    // Simulate opponent scores
    const scores: Record<string, number> = {};
    players.filter(p => !p.isHost).forEach(p => {
      scores[p.id] = Math.floor(Math.random() * 8) + 2;
    });
    setOpponentScores(scores);
  }, [open]);

  useEffect(() => {
    if (gameOver || showResult || !open) return;
    if (timeRemaining <= 0) {
      handleTimeout();
      return;
    }
    const timer = setInterval(() => setTimeRemaining(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, gameOver, showResult, open]);

  const handleTimeout = () => {
    setShowResult(true);
    setTimeout(() => nextQuestion(), 1500);
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === question.correctAnswer;
    if (isCorrect) setCorrectCount(p => p + 1);
    setShowResult(true);
    setTimeout(() => nextQuestion(), 1500);
  };

  const nextQuestion = () => {
    if (currentQ >= groupQuestions.length - 1) {
      setGameOver(true);
    } else {
      setCurrentQ(p => p + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeRemaining(15);
    }
  };

  const allScores = [
    { name: "You", score: correctCount, isYou: true },
    ...players.filter(p => !p.isHost).map(p => ({ name: p.name, score: opponentScores[p.id] || 0, isYou: false }))
  ].sort((a, b) => b.score - a.score);

  const youWon = allScores[0]?.isYou;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-500 to-violet-600 border-b p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              <div>
                <h2 className="font-semibold text-sm">Group Quiz</h2>
                <p className="text-xs text-purple-200">{gameOver ? "Results" : `Question ${currentQ + 1}/10`} • {playerCount} players</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {!gameOver && (
            <div className="mt-2">
              <Progress value={((currentQ + (showResult ? 1 : 0)) / 10) * 100} className="h-1.5 bg-purple-400 [&>div]:bg-white" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!gameOver && question && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Clock className={cn("h-5 w-5", timeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-purple-600")} />
                <span className={cn("text-2xl font-bold tabular-nums", timeRemaining <= 5 && "text-red-500")}>{timeRemaining}s</span>
              </div>

              <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200">
                <CardContent className="p-4">
                  <p className="text-base font-medium">{question.question}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-2">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => !showResult && setSelectedAnswer(idx)}
                    disabled={showResult}
                    className={cn(
                      "p-3 rounded-lg border-2 text-left transition-all touch-manipulation",
                      selectedAnswer === idx && !showResult && "border-purple-500 bg-purple-50",
                      showResult && idx === question.correctAnswer && "border-green-500 bg-green-50",
                      showResult && selectedAnswer === idx && idx !== question.correctAnswer && "border-red-500 bg-red-50",
                      !showResult && selectedAnswer !== idx && "border-border"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                        selectedAnswer === idx && !showResult && "bg-purple-500 text-white",
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

          {gameOver && (
            <div className="space-y-4">
              <Card className={cn("border-2", youWon ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-red-300 bg-red-50 dark:bg-red-950/30")}>
                <CardContent className="p-6 text-center space-y-3">
                  <p className="text-4xl">{youWon ? "🏆" : "😞"}</p>
                  <h2 className="text-xl font-bold">{youWon ? "You Won!" : "Better Luck!"}</h2>
                  <p className="text-sm text-muted-foreground">{correctCount}/10 correct</p>
                  {youWon && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">Prize Won</p>
                      <p className="text-2xl font-bold text-green-600">{formatLocalAmount(totalPrize, "NGN")}</p>
                      <p className="text-xs text-muted-foreground">({formatMobiAmount(totalPrize)}) — {multiplier * 100}% multiplier</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Leaderboard */}
              <Card>
                <CardContent className="p-3 space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase">Final Standings</h3>
                  {allScores.map((p, i) => (
                    <div key={i} className={cn("flex items-center gap-3 p-2 rounded-lg", i === 0 && "bg-amber-50 dark:bg-amber-950/30 border border-amber-200")}>
                      <span className={cn("text-sm font-bold w-6", i === 0 && "text-amber-600")}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                      <div className="flex-1">
                        <p className={cn("text-sm font-medium", p.isYou && "text-purple-600")}>{p.name}{p.isYou ? " (You)" : ""}</p>
                      </div>
                      <span className="text-sm font-bold">{p.score}/10</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-10 bg-background border-t p-4">
          {!gameOver ? (
            <Button className="w-full h-12 bg-purple-500 hover:bg-purple-600" onClick={handleConfirm} disabled={selectedAnswer === null || showResult}>
              {selectedAnswer === null ? "Select Answer" : showResult ? "Loading..." : `Confirm ${MOBIGATE_ANSWER_LABELS[selectedAnswer]}`}
            </Button>
          ) : (
            <Button className="w-full h-12 bg-gradient-to-r from-purple-500 to-violet-600" onClick={() => onOpenChange(false)}>
              Exit
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
