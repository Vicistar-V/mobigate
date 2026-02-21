import { useState, useEffect, useCallback } from "react";
import { X, Clock, GraduationCap } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOBIGATE_ANSWER_LABELS } from "@/data/mobigateQuizData";
import { SCHOLARSHIP_PRIZE_DELAY_DAYS } from "@/data/mobigateScholarshipQuizData";
import { getObjectiveTimePerQuestion, getNonObjectiveTimePerQuestion } from "@/data/platformSettingsData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { NonObjectiveQuestionCard } from "./NonObjectiveQuestionCard";
import { QuizBonusQuestionsDialog } from "./QuizBonusQuestionsDialog";
import { QuizPrizeRedemptionSheet } from "./QuizPrizeRedemptionSheet";

const scholarshipObjectiveQuestions = [
  { question: "What does UNESCO stand for?", options: ["United Nations Education...", "United Nations Economic...", "United Nations Educational, Scientific and Cultural Organization", "United Nations Environmental...", "Universal Network...", "United National...", "Universal Nations...", "Unified Nations..."], correctAnswer: 2 },
  { question: "Which country has the largest university in the world?", options: ["USA", "UK", "India", "China", "Nigeria", "Germany", "Japan", "Brazil"], correctAnswer: 2 },
  { question: "What is the highest academic degree?", options: ["Master's", "Bachelor's", "Doctorate/PhD", "Diploma", "Certificate", "Associate", "Professorship", "Fellowship"], correctAnswer: 2 },
  { question: "Who is considered the father of modern education?", options: ["Aristotle", "Plato", "John Amos Comenius", "John Dewey", "Socrates", "Confucius", "Maria Montessori", "Paulo Freire"], correctAnswer: 2 },
  { question: "What does GPA stand for?", options: ["General Point Assessment", "Grading Point Analysis", "Grade Point Average", "General Performance Average", "Graded Performance Assessment", "Grade Performance Analysis", "General Point Average", "Grading Performance Assessment"], correctAnswer: 2 },
  { question: "Which exam is commonly used for university admission in Nigeria?", options: ["SAT", "GRE", "JAMB/UTME", "IELTS", "TOEFL", "WAEC", "NECO", "ACT"], correctAnswer: 2 },
  { question: "What is the minimum age for primary school in Nigeria?", options: ["4 years", "5 years", "6 years", "7 years", "3 years", "8 years", "9 years", "10 years"], correctAnswer: 2 },
  { question: "How many years is a typical Bachelor's degree in Nigeria?", options: ["3 years", "2 years", "4 years", "5 years", "6 years", "1 year", "7 years", "8 years"], correctAnswer: 2 },
  { question: "What does STEM stand for?", options: ["Standard Technical Engineering...", "Scientific Technical...", "Science, Technology, Engineering, Mathematics", "Systematic Teaching...", "Standard Teaching...", "Scientific Training...", "Systematic Training...", "Standard Technology..."], correctAnswer: 2 },
  { question: "Which Nigerian university was established first?", options: ["Ahmadu Bello University", "University of Lagos", "University of Ibadan", "University of Nigeria", "Obafemi Awolowo University", "University of Benin", "University of Ilorin", "University of Jos"], correctAnswer: 2 },
];

const scholarshipNonObjectiveQuestions = [
  { question: "Name one benefit of higher education for society", acceptedAnswers: ["economy", "development", "innovation", "literacy", "employment", "income", "growth", "skilled"] },
  { question: "What does the acronym WAEC stand for?", acceptedAnswers: ["west african examinations council", "west african examination"] },
  { question: "Name the largest university in Nigeria by student enrollment", acceptedAnswers: ["noun", "national open university", "open university"] },
  { question: "What is a scholarship typically based on?", acceptedAnswers: ["merit", "academic", "grades", "financial", "need", "performance", "excellence"] },
  { question: "Name one challenge facing education in developing countries", acceptedAnswers: ["funding", "infrastructure", "poverty", "access", "teacher", "quality", "resources", "corruption"] },
];

interface ScholarshipQuizPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: number;
  stakeAmount: number;
}

type Phase = "objective" | "non_objective" | "result" | "bonus_offer" | "final";

export function ScholarshipQuizPlayDialog({ open, onOpenChange, budget, stakeAmount }: ScholarshipQuizPlayDialogProps) {
  const { toast } = useToast();
  const hasNonObjective = scholarshipNonObjectiveQuestions.length > 0;
  const totalQuestions = scholarshipObjectiveQuestions.length + scholarshipNonObjectiveQuestions.length;

  // Objective state
  const [currentQ, setCurrentQ] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(getObjectiveTimePerQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [objectiveCorrect, setObjectiveCorrect] = useState(0);
  const [phase, setPhase] = useState<Phase>("objective");

  // Non-objective sequential state
  const [currentNonObjQ, setCurrentNonObjQ] = useState(0);
  const [nonObjTimeRemaining, setNonObjTimeRemaining] = useState(getNonObjectiveTimePerQuestion());
  const [nonObjShowResult, setNonObjShowResult] = useState(false);
  const [nonObjLocked, setNonObjLocked] = useState(false);
  const [nonObjectiveAnswers, setNonObjectiveAnswers] = useState<string[]>(Array(5).fill(""));
  const [nonObjectiveCorrect, setNonObjectiveCorrect] = useState(0);

  const [showBonus, setShowBonus] = useState(false);
  const [showRedemption, setShowRedemption] = useState(false);
  const [finalWon, setFinalWon] = useState(false);

  const question = scholarshipObjectiveQuestions[currentQ];
  const totalCorrect = objectiveCorrect + nonObjectiveCorrect;
  const percentage = Math.round((totalCorrect / totalQuestions) * 100);

  useEffect(() => {
    if (!open) {
      setCurrentQ(0); setTimeRemaining(getObjectiveTimePerQuestion()); setSelectedAnswer(null); setShowResult(false);
      setObjectiveCorrect(0); setPhase("objective"); setNonObjectiveAnswers(Array(5).fill(""));
      setCurrentNonObjQ(0); setNonObjTimeRemaining(getNonObjectiveTimePerQuestion());
      setNonObjShowResult(false); setNonObjLocked(false);
      setNonObjectiveCorrect(0); setShowBonus(false);
      setShowRedemption(false); setFinalWon(false);
    }
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
    if (currentQ >= scholarshipObjectiveQuestions.length - 1) {
      if (hasNonObjective) {
        setPhase("non_objective");
      } else {
        const pct = Math.round((objectiveCorrect / totalQuestions) * 100);
        if (pct === 100) { setFinalWon(true); setPhase("final"); }
        else if (pct >= 70) { setPhase("bonus_offer"); }
        else { setFinalWon(false); setPhase("final"); }
      }
    } else {
      setCurrentQ(p => p + 1); setSelectedAnswer(null); setShowResult(false); setTimeRemaining(getObjectiveTimePerQuestion());
    }
  };

  const lockNonObjAnswer = useCallback((answer: string) => {
    setNonObjLocked(true);
    setNonObjectiveAnswers(prev => { const updated = [...prev]; updated[currentNonObjQ] = answer; return updated; });
    setNonObjShowResult(true);
    const q = scholarshipNonObjectiveQuestions[currentNonObjQ];
    const isCorrect = q.acceptedAnswers.some(a => answer.toLowerCase().includes(a.toLowerCase()));
    if (isCorrect) setNonObjectiveCorrect(p => p + 1);
    setTimeout(() => {
      if (currentNonObjQ >= scholarshipNonObjectiveQuestions.length - 1) {
        // Evaluate results
        setObjectiveCorrect(objC => {
          setNonObjectiveCorrect(nonObjC => {
            const total = objC + nonObjC;
            const pct = Math.round((total / totalQuestions) * 100);
            if (pct === 100) { setFinalWon(true); setPhase("final"); }
            else if (pct >= 70) { setPhase("bonus_offer"); }
            else { setFinalWon(false); setPhase("final"); }
            return nonObjC;
          });
          return objC;
        });
      } else {
        setCurrentNonObjQ(p => p + 1);
        setNonObjTimeRemaining(getNonObjectiveTimePerQuestion());
        setNonObjShowResult(false);
        setNonObjLocked(false);
      }
    }, 1500);
  }, [currentNonObjQ]);

  const handleBonusComplete = (allCorrect: boolean) => {
    setShowBonus(false);
    setFinalWon(allCorrect);
    setPhase("final");
  };

  const handleClaim = () => {
    if (finalWon) setShowRedemption(true);
    else onOpenChange(false);
  };

  const currentNonObjQuestion = scholarshipNonObjectiveQuestions[currentNonObjQ];
  const currentNonObjIsCorrect = currentNonObjQuestion?.acceptedAnswers.some(
    a => (nonObjectiveAnswers[currentNonObjQ] || "").toLowerCase().includes(a.toLowerCase())
  );

  const progressValue = phase === "objective"
    ? ((currentQ + (showResult ? 1 : 0)) / totalQuestions) * 100
    : phase === "non_objective"
      ? ((10 + currentNonObjQ + (nonObjShowResult ? 1 : 0)) / totalQuestions) * 100
      : 100;

  return (
    <>
      <Dialog open={open && !showBonus && !showRedemption} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-500 to-purple-500 border-b p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5" />
                <div>
                  <h2 className="font-semibold text-sm">Scholarship Quiz</h2>
                  <p className="text-xs text-indigo-200">
                    {phase === "objective" && `Q${currentQ + 1}/${scholarshipObjectiveQuestions.length} (Objective)`}
                    {phase === "non_objective" && `Q${scholarshipObjectiveQuestions.length + 1 + currentNonObjQ}/${totalQuestions} (Written)`}
                    {phase === "bonus_offer" && "Bonus Available"}
                    {phase === "final" && "Results"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={progressValue} className="h-1.5 mt-2 bg-indigo-400 [&>div]:bg-white" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 touch-auto">
            {/* Objective */}
            {phase === "objective" && question && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Clock className={cn("h-5 w-5", timeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-indigo-600")} />
                  <span className={cn("text-2xl font-bold tabular-nums", timeRemaining <= 5 && "text-red-500")}>{timeRemaining}s</span>
                </div>
                <Card className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200">
                  <CardContent className="p-4"><p className="text-base font-medium">{question.question}</p></CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((opt, idx) => (
                    <button key={idx} onClick={() => !showResult && setSelectedAnswer(idx)} disabled={showResult}
                      className={cn("p-3 rounded-lg border-2 text-left transition-all touch-manipulation",
                        selectedAnswer === idx && !showResult && "border-indigo-500 bg-indigo-50",
                        showResult && idx === question.correctAnswer && "border-green-500 bg-green-50",
                        showResult && selectedAnswer === idx && idx !== question.correctAnswer && "border-red-500 bg-red-50",
                        !showResult && selectedAnswer !== idx && "border-border"
                      )}>
                      <div className="flex items-start gap-2">
                        <span className={cn("flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                          selectedAnswer === idx && !showResult && "bg-indigo-500 text-white",
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

            {/* Non-Objective (sequential timed) */}
            {phase === "non_objective" && currentNonObjQuestion && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Clock className={cn("h-5 w-5", nonObjTimeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-indigo-600")} />
                  <span className={cn("text-2xl font-bold tabular-nums", nonObjTimeRemaining <= 5 && "text-red-500")}>{nonObjTimeRemaining}s</span>
                </div>
                <Card className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200">
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

            {phase === "bonus_offer" && (
              <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/30">
                <CardContent className="p-6 text-center space-y-3">
                  <p className="text-4xl">⭐</p>
                  <h3 className="font-bold text-lg">Almost There!</h3>
                  <p className="text-sm text-muted-foreground">{totalCorrect}/{totalQuestions} correct ({percentage}%)</p>
                  <p className="text-sm">Attempt bonus questions at 50% extra stake to win your scholarship!</p>
                  <div className="p-3 bg-white dark:bg-background rounded-lg border">
                    <p className="text-xs text-muted-foreground">Extra Stake</p>
                    <p className="font-bold text-lg text-red-600">{formatMobiAmount(Math.round(stakeAmount * 0.5))}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {phase === "final" && (
              <Card className={cn("border-2", finalWon ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-red-300 bg-red-50 dark:bg-red-950/30")}>
                <CardContent className="p-6 text-center space-y-3">
                  <p className="text-4xl">{finalWon ? "🎓🎉" : "😞"}</p>
                  <h3 className="font-bold text-lg">{finalWon ? "Scholarship Won!" : "Better Luck Next Time"}</h3>
                  <p className="text-sm text-muted-foreground">{totalCorrect}/{totalQuestions} correct</p>
                  {finalWon && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">Scholarship Amount</p>
                      <p className="text-2xl font-bold text-green-600">{formatLocalAmount(budget, "NGN")}</p>
                      <p className="text-xs text-muted-foreground">({formatMobiAmount(budget)})</p>
                      <p className="text-xs text-indigo-600 mt-2">🎁 Free Mobi-School access included!</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Prize credited within {SCHOLARSHIP_PRIZE_DELAY_DAYS} days</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="sticky bottom-0 z-10 bg-background border-t p-4">
            {phase === "objective" && (
              <Button className="w-full h-12 bg-indigo-500 hover:bg-indigo-600" onClick={handleConfirm} disabled={selectedAnswer === null || showResult}>
                {selectedAnswer === null ? "Select Answer" : showResult ? "Loading..." : `Confirm ${MOBIGATE_ANSWER_LABELS[selectedAnswer]}`}
              </Button>
            )}
            {phase === "non_objective" && (
              <Button
                className="w-full h-12 bg-indigo-500 hover:bg-indigo-600"
                onClick={() => lockNonObjAnswer(nonObjectiveAnswers[currentNonObjQ] || "")}
                disabled={nonObjLocked || !nonObjectiveAnswers[currentNonObjQ]?.trim()}
              >
                {nonObjShowResult ? "Next question..." : "Confirm Answer"}
              </Button>
            )}
            {phase === "bonus_offer" && (
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12" onClick={() => { setFinalWon(false); setPhase("final"); }}>Decline</Button>
                <Button className="h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white" onClick={() => setShowBonus(true)}>Accept Bonus</Button>
              </div>
            )}
            {phase === "final" && (
              <Button className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white" onClick={handleClaim}>
                {finalWon ? "Claim Scholarship" : "Exit"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <QuizBonusQuestionsDialog open={showBonus} onOpenChange={(v) => { if (!v) handleBonusComplete(false); }}
        originalStake={stakeAmount} onComplete={handleBonusComplete} />

      <QuizPrizeRedemptionSheet open={showRedemption}
        onOpenChange={(v) => { if (!v) { setShowRedemption(false); onOpenChange(false); } }}
        prizeAmount={budget} prizeType="scholarship" />
    </>
  );
}
