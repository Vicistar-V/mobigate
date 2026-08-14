import { useState, useEffect, useCallback } from "react";
import { X, Clock, ShoppingCart, Loader2 } from "lucide-react";
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
import { QuizPrizeRedemptionSheet } from "./QuizPrizeRedemptionSheet";

const API = "/api/quiz/food.php";
const BONUS_TIME_PER_QUESTION = 30;

interface ObjQ { id: string; question: string; options: string[]; correctAnswer: number }
interface NonObjQ { id: string; question: string; acceptedAnswers: string[] }

interface FoodQuizPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItemIds: string[];
  communityId?: string;
}

type Phase = "loading" | "objective" | "non_objective" | "submitting" | "bonus_offer" | "bonus_playing" | "final";

export function FoodQuizPlayDialog({ open, onOpenChange, selectedItemIds, communityId }: FoodQuizPlayDialogProps) {
  const { toast } = useToast();
  const [phase, setPhase] = useState<Phase>("loading");
  const [playId, setPlayId] = useState<string | null>(null);
  const [stake, setStake] = useState(0);

  const [objectiveQuestions, setObjectiveQuestions] = useState<ObjQ[]>([]);
  const [nonObjectiveQuestions, setNonObjectiveQuestions] = useState<NonObjQ[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(getObjectiveTimePerQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [objectiveAnswers, setObjectiveAnswers] = useState<{ question_id: string; selected_answer: number | null }[]>([]);

  const [currentNonObjQ, setCurrentNonObjQ] = useState(0);
  const [nonObjTimeRemaining, setNonObjTimeRemaining] = useState(getNonObjectiveTimePerQuestion());
  const [nonObjShowResult, setNonObjShowResult] = useState(false);
  const [nonObjLocked, setNonObjLocked] = useState(false);
  const [nonObjectiveAnswers, setNonObjectiveAnswers] = useState<string[]>([]);

  const [percentageResult, setPercentageResult] = useState({ correct: 0, total: 15, percentage: 0 });
  const [finalWon, setFinalWon] = useState(false);
  const [prizeWon, setPrizeWon] = useState(0);
  const [showRedemption, setShowRedemption] = useState(false);

  // Bonus round state
  const [bonusStakeAmount, setBonusStakeAmount] = useState(0);
  const [bonusQuestions, setBonusQuestions] = useState<ObjQ[]>([]);
  const [bonusQ, setBonusQ] = useState(0);
  const [bonusTime, setBonusTime] = useState(BONUS_TIME_PER_QUESTION);
  const [bonusSelected, setBonusSelected] = useState<number | null>(null);
  const [bonusShowResult, setBonusShowResult] = useState(false);
  const [bonusAnswers, setBonusAnswers] = useState<{ question_id: string; selected_answer: number | null }[]>([]);

  const question = objectiveQuestions[currentQ];
  const currentNonObjQuestion = nonObjectiveQuestions[currentNonObjQ];
  const totalQuestions = objectiveQuestions.length + nonObjectiveQuestions.length;
  const currentBonusQ = bonusQuestions[bonusQ];

  useEffect(() => {
    if (!open) return;
    setPhase("loading");
    (async () => {
      try {
        const res = await fetch(API, {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "start_play", item_ids: selectedItemIds, community_id: communityId }),
        });
        const d = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(d.error || "Couldn't start the quiz");
        setPlayId(d.play_id);
        setStake(d.stake);
        setObjectiveQuestions(d.objective ?? []);
        setNonObjectiveQuestions(d.nonObjective ?? []);
        setNonObjectiveAnswers(Array((d.nonObjective ?? []).length).fill(""));
        setCurrentQ(0); setTimeRemaining(getObjectiveTimePerQuestion()); setSelectedAnswer(null); setShowResult(false); setObjectiveAnswers([]);
        setCurrentNonObjQ(0); setNonObjTimeRemaining(getNonObjectiveTimePerQuestion()); setNonObjShowResult(false); setNonObjLocked(false);
        setPhase("objective");
      } catch (e: any) {
        toast({ title: "Couldn't Start", description: e.message, variant: "destructive" });
        onOpenChange(false);
      }
    })();
  }, [open]);

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

  useEffect(() => {
    if (phase !== "bonus_playing" || bonusShowResult || !open) return;
    if (bonusTime <= 0) { handleBonusConfirm(); return; }
    const timer = setInterval(() => setBonusTime(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [bonusTime, phase, bonusShowResult, open]);

  const handleConfirmObjective = () => {
    if (selectedAnswer === null || !question) return;
    setObjectiveAnswers(prev => [...prev, { question_id: question.id, selected_answer: selectedAnswer }]);
    setShowResult(true);
    setTimeout(() => nextObjective(), 1500);
  };

  const nextObjective = () => {
    if (currentQ >= objectiveQuestions.length - 1) {
      if (nonObjectiveQuestions.length > 0) setPhase("non_objective");
      else submitPlay(objectiveAnswers, []);
    } else {
      setCurrentQ(p => p + 1); setSelectedAnswer(null); setShowResult(false); setTimeRemaining(getObjectiveTimePerQuestion());
    }
  };

  const lockNonObjAnswer = useCallback((answer: string) => {
    setNonObjLocked(true);
    setNonObjectiveAnswers(prev => { const u = [...prev]; u[currentNonObjQ] = answer; return u; });
    setNonObjShowResult(true);
    setTimeout(() => {
      if (currentNonObjQ >= nonObjectiveQuestions.length - 1) {
        const finalAnswers = [...nonObjectiveAnswers]; finalAnswers[currentNonObjQ] = answer;
        submitPlay(objectiveAnswers, nonObjectiveQuestions.map((q, i) => ({ question_id: q.id, text: finalAnswers[i] || "" })));
      } else {
        setCurrentNonObjQ(p => p + 1); setNonObjTimeRemaining(getNonObjectiveTimePerQuestion()); setNonObjShowResult(false); setNonObjLocked(false);
      }
    }, 1500);
  }, [currentNonObjQ, nonObjectiveQuestions, nonObjectiveAnswers, objectiveAnswers]);

  const submitPlay = async (objAnswers: typeof objectiveAnswers, nonObjAnswers: { question_id: string; text: string }[]) => {
    setPhase("submitting");
    try {
      const res = await fetch(API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit_play", play_id: playId, objective_answers: objAnswers, non_objective_answers: nonObjAnswers }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Couldn't submit your result");
      setPercentageResult({ correct: d.correct, total: d.total, percentage: d.percentage });
      if (d.status === "won") { setFinalWon(true); setPrizeWon(d.prize); setPhase("final"); }
      else if (d.status === "bonus_pending") { setPhase("bonus_offer"); }
      else { setFinalWon(false); setPrizeWon(0); setPhase("final"); }
    } catch (e: any) {
      toast({ title: "Couldn't Submit", description: e.message, variant: "destructive" });
      onOpenChange(false);
    }
  };

  const handleBonusDecline = async () => {
    setPhase("submitting");
    try {
      await fetch(API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "decline_bonus", play_id: playId }),
      });
    } catch { /* fall through to final regardless */ }
    setFinalWon(false); setPrizeWon(0); setPhase("final");
  };

  const handleBonusAccept = async () => {
    setPhase("submitting");
    try {
      const res = await fetch(API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start_bonus", play_id: playId }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Couldn't start bonus round");
      setBonusStakeAmount(d.bonus_stake);
      setBonusQuestions(d.questions ?? []);
      setBonusQ(0); setBonusTime(BONUS_TIME_PER_QUESTION); setBonusSelected(null); setBonusShowResult(false); setBonusAnswers([]);
      setPhase("bonus_playing");
    } catch (e: any) {
      toast({ title: "Couldn't Start Bonus", description: e.message, variant: "destructive" });
      setPhase("bonus_offer");
    }
  };

  const handleBonusConfirm = () => {
    const answers = [...bonusAnswers, { question_id: currentBonusQ?.id, selected_answer: bonusSelected }];
    setBonusAnswers(answers);
    setBonusShowResult(true);
    setTimeout(async () => {
      if (bonusQ >= bonusQuestions.length - 1) {
        setPhase("submitting");
        try {
          const res = await fetch(API, {
            method: "POST", credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "submit_bonus", play_id: playId, answers }),
          });
          const d = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(d.error || "Couldn't submit bonus answers");
          setFinalWon(d.status === "won"); setPrizeWon(d.prize);
          setPhase("final");
        } catch (e: any) {
          toast({ title: "Couldn't Submit", description: e.message, variant: "destructive" });
          onOpenChange(false);
        }
      } else {
        setBonusQ(p => p + 1); setBonusTime(BONUS_TIME_PER_QUESTION); setBonusSelected(null); setBonusShowResult(false);
      }
    }, 1500);
  };

  const handleClaim = () => {
    if (finalWon) setShowRedemption(true);
    else onOpenChange(false);
  };

  const currentNonObjIsCorrect = currentNonObjQuestion?.acceptedAnswers?.some(
    a => (nonObjectiveAnswers[currentNonObjQ] || "").toLowerCase().includes(a.toLowerCase())
  );

  const progressValue = phase === "objective"
    ? totalQuestions > 0 ? ((currentQ + (showResult ? 1 : 0)) / totalQuestions) * 100 : 0
    : phase === "non_objective"
      ? totalQuestions > 0 ? ((objectiveQuestions.length + currentNonObjQ + (nonObjShowResult ? 1 : 0)) / totalQuestions) * 100 : 0
      : 100;

  return (
    <>
      <Dialog open={open && !showRedemption} onOpenChange={(v) => {
        if (!v && (phase === "objective" || phase === "non_objective" || phase === "bonus_playing")) {
          if (!confirm("Exit now? Your stake has already been deducted and this attempt will be forfeited.")) return;
        }
        onOpenChange(v);
      }}>
        <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-green-500 to-emerald-500 border-b p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5" />
                <div>
                  <h2 className="font-semibold text-sm">Food for Home Quiz</h2>
                  <p className="text-xs text-green-200">
                    {phase === "loading" && "Loading..."}
                    {phase === "objective" && `Q${currentQ + 1}/${objectiveQuestions.length} (Objective)`}
                    {phase === "non_objective" && `Q${objectiveQuestions.length + 1 + currentNonObjQ}/${totalQuestions} (Written)`}
                    {phase === "submitting" && "Submitting..."}
                    {phase === "bonus_offer" && "Bonus Questions Available"}
                    {phase === "bonus_playing" && `Bonus Q${bonusQ + 1}/${bonusQuestions.length}`}
                    {phase === "final" && "Results"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-white hover:bg-white/20"><X className="h-4 w-4" /></Button>
            </div>
            {(phase === "objective" || phase === "non_objective" || phase === "bonus_playing") && (
              <Progress value={phase === "bonus_playing" ? ((bonusQ + (bonusShowResult ? 1 : 0)) / bonusQuestions.length) * 100 : progressValue} className="h-1.5 mt-2 bg-green-400 [&>div]:bg-white" />
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 touch-auto">
            {(phase === "loading" || phase === "submitting") && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm">{phase === "loading" ? "Setting up your quiz..." : "Submitting..."}</p>
              </div>
            )}

            {phase === "objective" && question && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Clock className={cn("h-5 w-5", timeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-green-600")} />
                  <span className={cn("text-2xl font-bold tabular-nums", timeRemaining <= 5 && "text-red-500")}>{timeRemaining}s</span>
                </div>
                <Card className="bg-green-50 dark:bg-green-950/30 border-green-200"><CardContent className="p-4"><p className="text-base font-medium">{question.question}</p></CardContent></Card>
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((opt, idx) => (
                    <button key={idx} onClick={() => !showResult && setSelectedAnswer(idx)} disabled={showResult}
                      className={cn("p-3 rounded-lg border-2 text-left transition-all touch-manipulation",
                        selectedAnswer === idx && !showResult && "border-green-500 bg-green-50",
                        showResult && idx === question.correctAnswer && "border-green-500 bg-green-50",
                        showResult && selectedAnswer === idx && idx !== question.correctAnswer && "border-red-500 bg-red-50",
                        !showResult && selectedAnswer !== idx && "border-border"
                      )}>
                      <div className="flex items-start gap-2">
                        <span className={cn("flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                          selectedAnswer === idx && !showResult && "bg-green-500 text-white",
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
                  <Clock className={cn("h-5 w-5", nonObjTimeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-green-600")} />
                  <span className={cn("text-2xl font-bold tabular-nums", nonObjTimeRemaining <= 5 && "text-red-500")}>{nonObjTimeRemaining}s</span>
                </div>
                <Card className="bg-green-50 dark:bg-green-950/30 border-green-200"><CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground mt-1">Written question {currentNonObjQ + 1} of {nonObjectiveQuestions.length}</p>
                </CardContent></Card>
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

            {phase === "bonus_offer" && (
              <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/30">
                <CardContent className="p-6 text-center space-y-3">
                  <p className="text-4xl">⭐</p>
                  <h3 className="font-bold text-lg">Almost There!</h3>
                  <p className="text-sm text-muted-foreground">{percentageResult.correct}/{percentageResult.total} correct ({percentageResult.percentage}%)</p>
                  <p className="text-sm">You scored between 70-99%. You can attempt <span className="font-bold">bonus questions</span> to win your items!</p>
                  <div className="p-3 bg-white dark:bg-background rounded-lg border">
                    <p className="text-xs text-muted-foreground">Extra Stake Required</p>
                    <p className="font-bold text-lg text-red-600">{formatMobiAmount(Math.round(stake * 0.5))}</p>
                    <p className="text-[10px] text-muted-foreground">(50% of original stake) — all 4 must be correct to win</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {phase === "bonus_playing" && currentBonusQ && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Clock className={cn("h-5 w-5", bonusTime <= 10 ? "text-red-500 animate-pulse" : "text-amber-600")} />
                  <span className={cn("text-2xl font-bold tabular-nums", bonusTime <= 10 && "text-red-500")}>{bonusTime}s</span>
                </div>
                <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200"><CardContent className="p-4"><p className="text-base font-medium">{currentBonusQ.question}</p></CardContent></Card>
                <div className="grid grid-cols-2 gap-2">
                  {currentBonusQ.options.map((opt, idx) => (
                    <button key={idx} onClick={() => !bonusShowResult && setBonusSelected(idx)} disabled={bonusShowResult}
                      className={cn("p-3 rounded-lg border-2 text-left transition-all touch-manipulation",
                        bonusSelected === idx && !bonusShowResult && "border-amber-500 bg-amber-50",
                        bonusShowResult && idx === currentBonusQ.correctAnswer && "border-green-500 bg-green-50",
                        bonusShowResult && bonusSelected === idx && idx !== currentBonusQ.correctAnswer && "border-red-500 bg-red-50",
                        !bonusShowResult && bonusSelected !== idx && "border-border"
                      )}>
                      <div className="flex items-start gap-2">
                        <span className="text-sm">{MOBIFACE_ANSWER_LABELS[idx]}. {opt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {phase === "final" && (
              <Card className={cn("border-2", finalWon ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-red-300 bg-red-50 dark:bg-red-950/30")}>
                <CardContent className="p-6 text-center space-y-3">
                  <p className="text-4xl">{finalWon ? "🎉🛒" : "😞"}</p>
                  <h3 className="font-bold text-lg">{finalWon ? "You Won Your Groceries!" : "Better Luck Next Time"}</h3>
                  {finalWon && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">Items Won</p>
                      <p className="text-xl font-bold text-green-600">{formatLocalAmount(prizeWon, "NGN")}</p>
                      <p className="text-xs text-muted-foreground">({formatMobiAmount(prizeWon)})</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="sticky bottom-0 z-10 bg-background border-t p-4">
            {phase === "objective" && (
              <Button className="w-full h-12 bg-green-500 hover:bg-green-600" onClick={handleConfirmObjective} disabled={selectedAnswer === null || showResult}>
                {selectedAnswer === null ? "Select Answer" : showResult ? "Loading..." : `Confirm ${MOBIFACE_ANSWER_LABELS[selectedAnswer]}`}
              </Button>
            )}
            {phase === "non_objective" && (
              <Button className="w-full h-12 bg-green-500 hover:bg-green-600" onClick={() => lockNonObjAnswer(nonObjectiveAnswers[currentNonObjQ] || "")} disabled={nonObjLocked || !nonObjectiveAnswers[currentNonObjQ]?.trim()}>
                {nonObjShowResult ? "Next question..." : "Confirm Answer"}
              </Button>
            )}
            {phase === "bonus_offer" && (
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12" onClick={handleBonusDecline}>Decline</Button>
                <Button className="h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white" onClick={handleBonusAccept}>Accept Bonus</Button>
              </div>
            )}
            {phase === "bonus_playing" && (
              <Button className="w-full h-12 bg-amber-500 hover:bg-amber-600" onClick={handleBonusConfirm} disabled={bonusSelected === null || bonusShowResult}>
                {bonusSelected === null ? "Select Answer" : bonusShowResult ? "Loading..." : "Confirm"}
              </Button>
            )}
            {phase === "final" && (
              <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white" onClick={handleClaim}>
                {finalWon ? "Claim Your Items" : "Exit"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <QuizPrizeRedemptionSheet
        open={showRedemption}
        onOpenChange={(v) => { if (!v) { setShowRedemption(false); onOpenChange(false); } }}
        prizeAmount={prizeWon}
        prizeType="items"
      />
    </>
  );
}
