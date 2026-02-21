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
import { getObjectiveTimePerQuestion, getNonObjectiveTimePerQuestion } from "@/data/platformSettingsData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { NonObjectiveQuestionCard } from "./NonObjectiveQuestionCard";

// 10 objective questions
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

// 5 non-objective questions
const groupNonObjectiveQuestions = [
  { question: "Name the largest country in Africa by land area", acceptedAnswers: ["algeria"] },
  { question: "What does DNA stand for?", acceptedAnswers: ["deoxyribonucleic acid", "deoxyribonucleic"] },
  { question: "Name the longest river in the world", acceptedAnswers: ["nile", "amazon"] },
  { question: "What is the chemical symbol for gold?", acceptedAnswers: ["au"] },
  { question: "Name the first person to walk on the moon", acceptedAnswers: ["neil armstrong", "armstrong"] },
];

interface GroupQuizPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stake: number;
  playerCount: number;
  players: Array<{ id: string; name: string; avatar: string; isHost: boolean }>;
}

type Phase = "objective" | "non_objective" | "game_over";

const MIN_WIN_PERCENTAGE = 40;

export function GroupQuizPlayDialog({ open, onOpenChange, stake, playerCount, players }: GroupQuizPlayDialogProps) {
  const { toast } = useToast();
  const totalQuestions = groupQuestions.length + groupNonObjectiveQuestions.length; // 15

  // Objective state
  const [phase, setPhase] = useState<Phase>("objective");
  const [currentQ, setCurrentQ] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(getObjectiveTimePerQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [objectiveCorrect, setObjectiveCorrect] = useState(0);

  // Non-objective state
  const [currentNonObjQ, setCurrentNonObjQ] = useState(0);
  const [nonObjTimeRemaining, setNonObjTimeRemaining] = useState(getNonObjectiveTimePerQuestion());
  const [nonObjShowResult, setNonObjShowResult] = useState(false);
  const [nonObjLocked, setNonObjLocked] = useState(false);
  const [nonObjectiveAnswers, setNonObjectiveAnswers] = useState<string[]>(Array(5).fill(""));
  const [nonObjectiveCorrect, setNonObjectiveCorrect] = useState(0);

  const [opponentScores, setOpponentScores] = useState<Record<string, number>>({});

  const question = groupQuestions[currentQ];
  const multiplier = getGroupPrizeMultiplier(playerCount);
  const totalPrize = stake * multiplier;
  const totalCorrect = objectiveCorrect + nonObjectiveCorrect;
  const yourPercentage = Math.round((totalCorrect / totalQuestions) * 100);

  useEffect(() => {
    if (!open) {
      setPhase("objective");
      setCurrentQ(0);
      setTimeRemaining(getObjectiveTimePerQuestion());
      setSelectedAnswer(null);
      setShowResult(false);
      setObjectiveCorrect(0);
      setCurrentNonObjQ(0);
      setNonObjTimeRemaining(getNonObjectiveTimePerQuestion());
      setNonObjShowResult(false);
      setNonObjLocked(false);
      setNonObjectiveAnswers(Array(5).fill(""));
      setNonObjectiveCorrect(0);
      setOpponentScores({});
      return;
    }
    const scores: Record<string, number> = {};
    players.filter(p => !p.isHost).forEach(p => {
      scores[p.id] = Math.floor(Math.random() * 11) + 3; // 3-13 out of 15
    });
    setOpponentScores(scores);
  }, [open]);

  // Objective timer
  useEffect(() => {
    if (phase !== "objective" || showResult || !open) return;
    if (timeRemaining <= 0) { setShowResult(true); setTimeout(() => nextObjective(), 1500); return; }
    const timer = setInterval(() => setTimeRemaining(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, phase, showResult, open]);

  // Non-objective timer
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
    const isCorrect = selectedAnswer === question.correctAnswer;
    if (isCorrect) setObjectiveCorrect(p => p + 1);
    setShowResult(true);
    setTimeout(() => nextObjective(), 1500);
  };

  const nextObjective = () => {
    if (currentQ >= groupQuestions.length - 1) {
      setPhase("non_objective");
    } else {
      setCurrentQ(p => p + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeRemaining(getObjectiveTimePerQuestion());
    }
  };

  const lockNonObjAnswer = useCallback((answer: string) => {
    setNonObjLocked(true);
    setNonObjectiveAnswers(prev => { const updated = [...prev]; updated[currentNonObjQ] = answer; return updated; });
    setNonObjShowResult(true);
    const q = groupNonObjectiveQuestions[currentNonObjQ];
    const isCorrect = q.acceptedAnswers.some(a => answer.toLowerCase().includes(a.toLowerCase()));
    if (isCorrect) setNonObjectiveCorrect(p => p + 1);
    setTimeout(() => {
      if (currentNonObjQ >= groupNonObjectiveQuestions.length - 1) {
        setPhase("game_over");
      } else {
        setCurrentNonObjQ(p => p + 1);
        setNonObjTimeRemaining(getNonObjectiveTimePerQuestion());
        setNonObjShowResult(false);
        setNonObjLocked(false);
      }
    }, 1500);
  }, [currentNonObjQ]);

  const currentNonObjQuestion = groupNonObjectiveQuestions[currentNonObjQ];
  const currentNonObjIsCorrect = currentNonObjQuestion?.acceptedAnswers.some(
    a => (nonObjectiveAnswers[currentNonObjQ] || "").toLowerCase().includes(a.toLowerCase())
  );

  // Winner logic: highest scorer AND >= 40%
  const allScores = [
    { name: "You", score: totalCorrect, total: totalQuestions, isYou: true },
    ...players.filter(p => !p.isHost).map(p => ({ name: p.name, score: opponentScores[p.id] || 0, total: totalQuestions, isYou: false }))
  ].sort((a, b) => b.score - a.score);

  const highestScore = allScores[0]?.score || 0;
  const highestPct = Math.round((highestScore / totalQuestions) * 100);
  const hasValidWinner = highestPct >= MIN_WIN_PERCENTAGE;
  const youWon = hasValidWinner && allScores[0]?.isYou;

  const progressValue = phase === "objective"
    ? ((currentQ + (showResult ? 1 : 0)) / totalQuestions) * 100
    : phase === "non_objective"
      ? ((groupQuestions.length + currentNonObjQ + (nonObjShowResult ? 1 : 0)) / totalQuestions) * 100
      : 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-500 to-violet-600 border-b p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              <div>
                <h2 className="font-semibold text-sm">Group Quiz</h2>
                <p className="text-xs text-purple-200">
                  {phase === "objective" && `Q${currentQ + 1}/10 (Objective)`}
                  {phase === "non_objective" && `Q${11 + currentNonObjQ}/15 (Written)`}
                  {phase === "game_over" && "Results"}
                  {" • "}{playerCount} players
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {phase !== "game_over" && (
            <div className="mt-2">
              <Progress value={progressValue} className="h-1.5 bg-purple-400 [&>div]:bg-white" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Objective Phase */}
          {phase === "objective" && question && (
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

          {/* Non-Objective Phase */}
          {phase === "non_objective" && currentNonObjQuestion && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Clock className={cn("h-5 w-5", nonObjTimeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-purple-600")} />
                <span className={cn("text-2xl font-bold tabular-nums", nonObjTimeRemaining <= 5 && "text-red-500")}>{nonObjTimeRemaining}s</span>
              </div>
              <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200">
                <CardContent className="p-3 text-center">
                  <p className="text-sm font-medium">Objective Score: {objectiveCorrect}/10</p>
                  <p className="text-xs text-muted-foreground mt-1">Written question {currentNonObjQ + 1} of 5</p>
                </CardContent>
              </Card>
              <NonObjectiveQuestionCard
                key={currentNonObjQ}
                questionNumber={11 + currentNonObjQ}
                question={currentNonObjQuestion.question}
                onAnswer={(ans) => { const a = [...nonObjectiveAnswers]; a[currentNonObjQ] = ans; setNonObjectiveAnswers(a); }}
                disabled={nonObjLocked}
                showResult={nonObjShowResult}
                isCorrect={nonObjShowResult && currentNonObjIsCorrect}
              />
            </div>
          )}

          {/* Game Over / Results */}
          {phase === "game_over" && (
            <div className="space-y-4">
              <Card className={cn("border-2", youWon ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-red-300 bg-red-50 dark:bg-red-950/30")}>
                <CardContent className="p-6 text-center space-y-3">
                  <p className="text-4xl">{youWon ? "🏆" : hasValidWinner ? "😞" : "🚫"}</p>
                  <h2 className="text-xl font-bold">
                    {youWon ? "You Won!" : hasValidWinner ? "Better Luck!" : "No Winner!"}
                  </h2>
                  <p className="text-sm text-muted-foreground">{totalCorrect}/{totalQuestions} correct ({yourPercentage}%)</p>
                  {!hasValidWinner && (
                    <p className="text-xs text-red-600 font-medium">
                      No player scored ≥{MIN_WIN_PERCENTAGE}%. All players lose.
                    </p>
                  )}
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
                  {allScores.map((p, i) => {
                    const pPct = Math.round((p.score / totalQuestions) * 100);
                    const isWinner = hasValidWinner && i === 0;
                    return (
                      <div key={i} className={cn("flex items-center gap-3 p-2 rounded-lg", isWinner && "bg-amber-50 dark:bg-amber-950/30 border border-amber-200")}>
                        <span className={cn("text-sm font-bold w-6", isWinner && "text-amber-600")}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                        <div className="flex-1">
                          <p className={cn("text-sm font-medium", p.isYou && "text-purple-600")}>{p.name}{p.isYou ? " (You)" : ""}</p>
                          <p className="text-[10px] text-muted-foreground">{pPct}%</p>
                        </div>
                        <span className="text-sm font-bold">{p.score}/{totalQuestions}</span>
                      </div>
                    );
                  })}
                  <div className="text-[10px] text-muted-foreground text-center pt-1 border-t">
                    Winner must be highest scorer with ≥{MIN_WIN_PERCENTAGE}% to win
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-10 bg-background border-t p-4">
          {phase === "objective" && (
            <Button className="w-full h-12 bg-purple-500 hover:bg-purple-600" onClick={handleConfirm} disabled={selectedAnswer === null || showResult}>
              {selectedAnswer === null ? "Select Answer" : showResult ? "Loading..." : `Confirm ${MOBIGATE_ANSWER_LABELS[selectedAnswer]}`}
            </Button>
          )}
          {phase === "non_objective" && (
            <Button
              className="w-full h-12 bg-purple-500 hover:bg-purple-600"
              onClick={() => lockNonObjAnswer(nonObjectiveAnswers[currentNonObjQ] || "")}
              disabled={nonObjLocked || !nonObjectiveAnswers[currentNonObjQ]?.trim()}
            >
              {nonObjShowResult ? "Next question..." : "Confirm Answer"}
            </Button>
          )}
          {phase === "game_over" && (
            <Button className="w-full h-12 bg-gradient-to-r from-purple-500 to-violet-600" onClick={() => onOpenChange(false)}>
              Exit
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
