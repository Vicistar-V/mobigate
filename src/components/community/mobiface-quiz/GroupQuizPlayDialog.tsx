import { useState, useEffect, useCallback, useRef } from "react";
import { X, Clock, Trophy, CheckCircle, XCircle, Users, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOBIFACE_ANSWER_LABELS } from "@/data/mobifaceQuizData";
import { getObjectiveTimePerQuestion, getNonObjectiveTimePerQuestion } from "@/data/platformSettingsData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { NonObjectiveQuestionCard } from "./NonObjectiveQuestionCard";

const API = "/api/quiz/group.php";

interface ObjQ { id: string; question: string; options: string[]; correctAnswer: number; type: "objective" }
interface NonObjQ { id: string; question: string; acceptedAnswers: string[]; type: "non_objective" }

interface GroupQuizPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lobbyId: string;
}

type Phase = "loading" | "objective" | "non_objective" | "submitting" | "waiting" | "game_over";

const MIN_WIN_PERCENTAGE = 40;

export function GroupQuizPlayDialog({ open, onOpenChange, lobbyId }: GroupQuizPlayDialogProps) {
  const { toast } = useToast();
  const [phase, setPhase] = useState<Phase>("loading");
  const [objectiveQuestions, setObjectiveQuestions] = useState<ObjQ[]>([]);
  const [nonObjectiveQuestions, setNonObjectiveQuestions] = useState<NonObjQ[]>([]);
  const [stake, setStake] = useState(0);
  const [multiplier, setMultiplier] = useState(2);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [currentQ, setCurrentQ] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(getObjectiveTimePerQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [objectiveAnswers, setObjectiveAnswers] = useState<{ question_id: string; selected_answer: number | null }[]>([]);

  const [currentNonObjQ, setCurrentNonObjQ] = useState(0);
  const [nonObjTimeRemaining, setNonObjTimeRemaining] = useState(getNonObjectiveTimePerQuestion());
  const [nonObjShowResult, setNonObjShowResult] = useState(false);
  const [nonObjLocked, setNonObjLocked] = useState(false);
  const [nonObjectiveAnswers, setNonObjectiveAnswers] = useState<string[]>(Array(5).fill(""));

  const [finalMembers, setFinalMembers] = useState<any[]>([]);

  const totalQuestions = objectiveQuestions.length + nonObjectiveQuestions.length;
  const question = objectiveQuestions[currentQ];
  const currentNonObjQuestion = nonObjectiveQuestions[currentNonObjQ];

  const loadInitial = useCallback(() => {
    fetch(`${API}?action=lobby&lobby_id=${lobbyId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        setStake(parseFloat(d.lobby.stake));
        setMultiplier(d.lobby.multiplier);
        if (d.lobby.status === "settled") {
          setFinalMembers(d.members ?? []);
          setPhase("game_over");
          return;
        }
        if (!d.questions) {
          // Already submitted, waiting for others
          setFinalMembers(d.members ?? []);
          setPhase("waiting");
          startPolling();
          return;
        }
        const objs = d.questions.filter((q: any) => q.type === "objective");
        const nonObjs = d.questions.filter((q: any) => q.type === "non_objective");
        setObjectiveQuestions(objs);
        setNonObjectiveQuestions(nonObjs);
        setCurrentQ(0);
        setTimeRemaining(getObjectiveTimePerQuestion());
        setSelectedAnswer(null);
        setShowResult(false);
        setObjectiveAnswers([]);
        setCurrentNonObjQ(0);
        setNonObjTimeRemaining(getNonObjectiveTimePerQuestion());
        setNonObjShowResult(false);
        setNonObjLocked(false);
        setNonObjectiveAnswers(Array(5).fill(""));
        setPhase("objective");
      })
      .catch(() => {
        toast({ title: "Couldn't load game", variant: "destructive" });
        onOpenChange(false);
      });
  }, [lobbyId]);

  const startPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      fetch(`${API}?action=lobby&lobby_id=${lobbyId}`, { credentials: "include" })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((d) => {
          if (d.lobby.status === "settled") {
            setFinalMembers(d.members ?? []);
            setPhase("game_over");
            if (pollRef.current) clearInterval(pollRef.current);
          }
        })
        .catch(() => {});
    }, 3000);
  }, [lobbyId]);

  useEffect(() => {
    if (open) { setPhase("loading"); loadInitial(); }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [open, loadInitial]);

  useEffect(() => {
    if (phase !== "objective" || showResult || !open) return;
    if (timeRemaining <= 0) { setShowResult(true); setTimeout(() => nextObjective(), 1500); return; }
    const timer = setInterval(() => setTimeRemaining(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, phase, showResult, open]);

  useEffect(() => {
    if (phase !== "non_objective" || nonObjShowResult || nonObjLocked || !open) return;
    if (nonObjTimeRemaining <= 0) { lockNonObjAnswer(nonObjectiveAnswers[currentNonObjQ] || ""); return; }
    const timer = setInterval(() => setNonObjTimeRemaining(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [nonObjTimeRemaining, phase, nonObjShowResult, nonObjLocked, open, currentNonObjQ]);

  const handleConfirm = () => {
    if (selectedAnswer === null || !question) return;
    setObjectiveAnswers(prev => [...prev, { question_id: question.id, selected_answer: selectedAnswer }]);
    setShowResult(true);
    setTimeout(() => nextObjective(), 1500);
  };

  const nextObjective = () => {
    if (currentQ >= objectiveQuestions.length - 1) {
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
    setTimeout(() => {
      if (currentNonObjQ >= nonObjectiveQuestions.length - 1) {
        submitPlay(answer);
      } else {
        setCurrentNonObjQ(p => p + 1);
        setNonObjTimeRemaining(getNonObjectiveTimePerQuestion());
        setNonObjShowResult(false);
        setNonObjLocked(false);
      }
    }, 1500);
  }, [currentNonObjQ, nonObjectiveQuestions.length]);

  const submitPlay = async (finalAnswer: string) => {
    setPhase("submitting");
    const finalAnswers = [...nonObjectiveAnswers];
    finalAnswers[currentNonObjQ] = finalAnswer;
    const nonObjPayload = nonObjectiveQuestions.map((q, i) => ({ question_id: q.id, text: finalAnswers[i] || "" }));

    try {
      const res = await fetch(API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit_play", lobby_id: lobbyId, objective_answers: objectiveAnswers, non_objective_answers: nonObjPayload }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Couldn't submit your answers");

      if (d.settled) {
        loadInitial();
      } else {
        setPhase("waiting");
        startPolling();
      }
    } catch (e: any) {
      toast({ title: "Couldn't Submit", description: e.message, variant: "destructive" });
      setPhase("waiting");
      startPolling();
    }
  };

  const currentNonObjIsCorrect = currentNonObjQuestion?.acceptedAnswers?.some(
    a => (nonObjectiveAnswers[currentNonObjQ] || "").toLowerCase().includes(a.toLowerCase())
  );

  const sortedFinal = [...finalMembers].filter(m => m.status === "accepted" || m.has_submitted).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const totalPrize = stake * multiplier;

  const progressValue = phase === "objective"
    ? totalQuestions > 0 ? ((currentQ + (showResult ? 1 : 0)) / totalQuestions) * 100 : 0
    : phase === "non_objective"
      ? totalQuestions > 0 ? ((objectiveQuestions.length + currentNonObjQ + (nonObjShowResult ? 1 : 0)) / totalQuestions) * 100 : 0
      : 100;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && (phase === "objective" || phase === "non_objective")) { if (!confirm("Exit now? Your stake has already been deducted and answers won't be submitted.")) return; } onOpenChange(v); }}>
      <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-500 to-violet-600 border-b p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              <div>
                <h2 className="font-semibold text-sm">Group Quiz</h2>
                <p className="text-xs text-purple-200">
                  {phase === "loading" && "Loading..."}
                  {phase === "objective" && `Q${currentQ + 1}/${objectiveQuestions.length} (Objective)`}
                  {phase === "non_objective" && `Q${objectiveQuestions.length + 1 + currentNonObjQ}/${totalQuestions} (Written)`}
                  {phase === "submitting" && "Submitting..."}
                  {phase === "waiting" && "Waiting for other players..."}
                  {phase === "game_over" && "Results"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {(phase === "objective" || phase === "non_objective") && (
            <div className="mt-2"><Progress value={progressValue} className="h-1.5 bg-purple-400 [&>div]:bg-white" /></div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {(phase === "loading" || phase === "submitting") && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">{phase === "loading" ? "Setting up your quiz..." : "Submitting your answers..."}</p>
            </div>
          )}

          {phase === "waiting" && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              <p className="text-sm font-medium">Waiting for other players to finish...</p>
              <p className="text-xs text-muted-foreground">The game settles automatically once everyone submits.</p>
            </div>
          )}

          {phase === "objective" && question && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Clock className={cn("h-5 w-5", timeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-purple-600")} />
                <span className={cn("text-2xl font-bold tabular-nums", timeRemaining <= 5 && "text-red-500")}>{timeRemaining}s</span>
              </div>
              <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200">
                <CardContent className="p-4"><p className="text-base font-medium">{question.question}</p></CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-2">
                {question.options.map((opt, idx) => (
                  <button key={idx} onClick={() => !showResult && setSelectedAnswer(idx)} disabled={showResult}
                    className={cn("p-3 rounded-lg border-2 text-left transition-all touch-manipulation",
                      selectedAnswer === idx && !showResult && "border-purple-500 bg-purple-50",
                      showResult && idx === question.correctAnswer && "border-green-500 bg-green-50",
                      showResult && selectedAnswer === idx && idx !== question.correctAnswer && "border-red-500 bg-red-50",
                      !showResult && selectedAnswer !== idx && "border-border"
                    )}>
                    <div className="flex items-start gap-2">
                      <span className={cn("flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                        selectedAnswer === idx && !showResult && "bg-purple-500 text-white",
                        showResult && idx === question.correctAnswer && "bg-green-500 text-white",
                        showResult && selectedAnswer === idx && idx !== question.correctAnswer && "bg-red-500 text-white",
                        !showResult && selectedAnswer !== idx && "bg-muted"
                      )}>{MOBIFACE_ANSWER_LABELS[idx]}</span>
                      <span className="text-sm">{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === "non_objective" && currentNonObjQuestion && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Clock className={cn("h-5 w-5", nonObjTimeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-purple-600")} />
                <span className={cn("text-2xl font-bold tabular-nums", nonObjTimeRemaining <= 5 && "text-red-500")}>{nonObjTimeRemaining}s</span>
              </div>
              <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground mt-1">Written question {currentNonObjQ + 1} of {nonObjectiveQuestions.length}</p>
                </CardContent>
              </Card>
              <NonObjectiveQuestionCard
                key={currentNonObjQ}
                questionNumber={objectiveQuestions.length + 1 + currentNonObjQ}
                question={currentNonObjQuestion.question}
                onAnswer={(ans) => { const a = [...nonObjectiveAnswers]; a[currentNonObjQ] = ans; setNonObjectiveAnswers(a); }}
                disabled={nonObjLocked}
                showResult={nonObjShowResult}
                isCorrect={nonObjShowResult && !!currentNonObjIsCorrect}
              />
            </div>
          )}

          {phase === "game_over" && (
            <div className="space-y-4">
              {(() => {
                const winner = sortedFinal.find((m) => m.result === "won");
                const hasWinner = !!winner;
                return (
                  <Card className={cn("border-2", hasWinner ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-red-300 bg-red-50 dark:bg-red-950/30")}>
                    <CardContent className="p-6 text-center space-y-3">
                      <p className="text-4xl">{hasWinner ? "🏆" : "🚫"}</p>
                      <h2 className="text-xl font-bold">{hasWinner ? `${winner.name} Won!` : "No Winner!"}</h2>
                      {!hasWinner && (
                        <p className="text-xs text-red-600 font-medium">No player scored ≥{MIN_WIN_PERCENTAGE}%, or there was a tie at the top. Everyone's stake is forfeited.</p>
                      )}
                      {hasWinner && (
                        <div className="pt-2">
                          <p className="text-sm text-muted-foreground">Prize</p>
                          <p className="text-2xl font-bold text-green-600">{formatLocalAmount(totalPrize, "NGN")}</p>
                          <p className="text-xs text-muted-foreground">({formatMobiAmount(totalPrize)}) — {multiplier * 100}% multiplier</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })()}

              <Card>
                <CardContent className="p-3 space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase">Final Standings</h3>
                  {sortedFinal.map((m, i) => (
                    <div key={m.user_id} className={cn("flex items-center gap-3 p-2 rounded-lg", m.result === "won" && "bg-amber-50 dark:bg-amber-950/30 border border-amber-200")}>
                      <span className={cn("text-sm font-bold w-6", m.result === "won" && "text-amber-600")}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.total_questions ? Math.round(((m.score ?? 0) / m.total_questions) * 100) : 0}%</p>
                      </div>
                      <span className="text-sm font-bold">{m.score ?? 0}/{m.total_questions ?? "-"}</span>
                    </div>
                  ))}
                  <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                    Winner must be highest scorer with ≥{MIN_WIN_PERCENTAGE}% (no ties) to win
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-10 bg-background border-t p-4">
          {phase === "objective" && (
            <Button className="w-full h-12 bg-purple-500 hover:bg-purple-600" onClick={handleConfirm} disabled={selectedAnswer === null || showResult}>
              {selectedAnswer === null ? "Select Answer" : showResult ? "Loading..." : `Confirm ${MOBIFACE_ANSWER_LABELS[selectedAnswer]}`}
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
