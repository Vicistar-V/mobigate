import { useState, useEffect } from "react";
import { X, Clock, Star, Radio, Trophy } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MOBIGATE_ANSWER_LABELS } from "@/data/mobigateQuizData";
import { QuizSeason, INTERACTIVE_QUESTIONS_PER_SESSION } from "@/data/mobigateInteractiveQuizData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { NonObjectiveQuestionCard } from "./NonObjectiveQuestionCard";
import { QuizPrizeRedemptionSheet } from "./QuizPrizeRedemptionSheet";

const interactiveObjectiveQuestions = [
  { question: "What is the most spoken language in the world?", options: ["Spanish", "Hindi", "English", "Arabic", "French", "Portuguese", "Bengali", "Russian"], correctAnswer: 2 },
  { question: "Which company created the iPhone?", options: ["Samsung", "Microsoft", "Apple", "Google", "Nokia", "Sony", "LG", "Huawei"], correctAnswer: 2 },
  { question: "What is the largest continent by area?", options: ["Africa", "North America", "Asia", "Europe", "South America", "Antarctica", "Australia", "Oceania"], correctAnswer: 2 },
  { question: "In which year was Facebook founded?", options: ["2002", "2003", "2004", "2005", "2006", "2001", "2007", "2008"], correctAnswer: 2 },
  { question: "What gas makes up most of Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen", "Argon", "Helium", "Methane", "Ozone"], correctAnswer: 2 },
  { question: "Which African country was never colonized?", options: ["Ghana", "Nigeria", "Ethiopia", "Kenya", "Egypt", "South Africa", "Morocco", "Tanzania"], correctAnswer: 2 },
  { question: "How many bones does an adult human have?", options: ["195", "200", "206", "210", "215", "220", "196", "250"], correctAnswer: 2 },
  { question: "What is the currency of the United Kingdom?", options: ["Euro", "Dollar", "Pound Sterling", "Franc", "Mark", "Shilling", "Crown", "Guilder"], correctAnswer: 2 },
  { question: "Who painted the Mona Lisa?", options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello", "Picasso", "Van Gogh", "Rembrandt", "Monet"], correctAnswer: 2 },
  { question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Platinum", "Titanium", "Quartz", "Ruby", "Sapphire"], correctAnswer: 2 },
];

const interactiveNonObjectiveQuestions = [
  { question: "Name the process by which plants make food using sunlight", acceptedAnswers: ["photosynthesis"] },
  { question: "What is the capital city of Australia?", acceptedAnswers: ["canberra"] },
  { question: "Name a programming language created by Google", acceptedAnswers: ["go", "golang", "dart", "kotlin"] },
  { question: "What element has the atomic number 1?", acceptedAnswers: ["hydrogen"] },
  { question: "Name the author of 'Half of a Yellow Sun'", acceptedAnswers: ["chimamanda", "adichie", "chimamanda adichie", "chimamanda ngozi adichie"] },
];

interface InteractiveQuizPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season: QuizSeason;
}

type Phase = "objective" | "non_objective" | "result";

export function InteractiveQuizPlayDialog({ open, onOpenChange, season }: InteractiveQuizPlayDialogProps) {
  const { toast } = useToast();
  const [currentQ, setCurrentQ] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [objectiveCorrect, setObjectiveCorrect] = useState(0);
  const [phase, setPhase] = useState<Phase>("objective");
  const [nonObjectiveAnswers, setNonObjectiveAnswers] = useState<string[]>(Array(5).fill(""));
  const [nonObjectiveSubmitted, setNonObjectiveSubmitted] = useState(false);
  const [nonObjectiveCorrect, setNonObjectiveCorrect] = useState(0);
  const [showRedemption, setShowRedemption] = useState(false);

  const totalQuestions = INTERACTIVE_QUESTIONS_PER_SESSION;
  const question = interactiveObjectiveQuestions[currentQ];
  const totalCorrect = objectiveCorrect + nonObjectiveCorrect;
  const percentage = Math.round((totalCorrect / totalQuestions) * 100);
  const passed = percentage === 100;
  const prizeAmount = season.prizePerLevel;
  const cashAlternative = season.entryFee * 5;

  useEffect(() => {
    if (!open) {
      setCurrentQ(0); setTimeRemaining(15); setSelectedAnswer(null); setShowResult(false);
      setObjectiveCorrect(0); setPhase("objective"); setNonObjectiveAnswers(Array(5).fill(""));
      setNonObjectiveSubmitted(false); setNonObjectiveCorrect(0); setShowRedemption(false);
    }
  }, [open]);

  useEffect(() => {
    if (phase !== "objective" || showResult || !open) return;
    if (timeRemaining <= 0) { setShowResult(true); setTimeout(() => nextObjective(), 1500); return; }
    const timer = setInterval(() => setTimeRemaining(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, phase, showResult, open]);

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    if (selectedAnswer === question.correctAnswer) setObjectiveCorrect(p => p + 1);
    setShowResult(true);
    setTimeout(() => nextObjective(), 1500);
  };

  const nextObjective = () => {
    if (currentQ >= 9) setPhase("non_objective");
    else { setCurrentQ(p => p + 1); setSelectedAnswer(null); setShowResult(false); setTimeRemaining(15); }
  };

  const handleSubmitNonObjective = () => {
    let correct = 0;
    nonObjectiveAnswers.forEach((ans, i) => {
      if (interactiveNonObjectiveQuestions[i].acceptedAnswers.some(a => ans.toLowerCase().includes(a.toLowerCase()))) correct++;
    });
    setNonObjectiveCorrect(correct);
    setNonObjectiveSubmitted(true);
    setTimeout(() => setPhase("result"), 2000);
  };

  const handleClaim = () => {
    if (passed) setShowRedemption(true);
    else onOpenChange(false);
  };

  const progressValue = phase === "objective" ? ((currentQ + (showResult ? 1 : 0)) / totalQuestions) * 100
    : phase === "non_objective" ? ((10 + (nonObjectiveSubmitted ? 5 : 0)) / totalQuestions) * 100 : 100;

  return (
    <>
      <Dialog open={open && !showRedemption} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-cyan-500 border-b p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5" />
                <div>
                  <h2 className="font-semibold text-sm">{season.name}</h2>
                  <p className="text-xs text-blue-200">
                    {phase === "objective" && `Q${currentQ + 1}/10 (Objective)`}
                    {phase === "non_objective" && "Q11-15 (Type Your Answer)"}
                    {phase === "result" && "Results"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={progressValue} className="h-1.5 mt-2 bg-blue-400 [&>div]:bg-white" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 touch-auto">
            {phase === "objective" && question && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Clock className={cn("h-5 w-5", timeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-blue-600")} />
                  <span className={cn("text-2xl font-bold tabular-nums", timeRemaining <= 5 && "text-red-500")}>{timeRemaining}s</span>
                </div>
                <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
                  <CardContent className="p-4"><p className="text-base font-medium">{question.question}</p></CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((opt, idx) => (
                    <button key={idx} onClick={() => !showResult && setSelectedAnswer(idx)} disabled={showResult}
                      className={cn("p-3 rounded-lg border-2 text-left transition-all touch-manipulation",
                        selectedAnswer === idx && !showResult && "border-blue-500 bg-blue-50",
                        showResult && idx === question.correctAnswer && "border-green-500 bg-green-50",
                        showResult && selectedAnswer === idx && idx !== question.correctAnswer && "border-red-500 bg-red-50",
                        !showResult && selectedAnswer !== idx && "border-border"
                      )}>
                      <div className="flex items-start gap-2">
                        <span className={cn("flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                          selectedAnswer === idx && !showResult && "bg-blue-500 text-white",
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

            {phase === "non_objective" && (
              <div className="space-y-4">
                <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">Objective Score: {objectiveCorrect}/10</p>
                    <p className="text-xs text-muted-foreground mt-1">Now answer 5 typed questions</p>
                  </CardContent>
                </Card>
                {interactiveNonObjectiveQuestions.map((q, i) => (
                  <NonObjectiveQuestionCard key={i} questionNumber={11 + i} question={q.question}
                    onAnswer={(ans) => { const a = [...nonObjectiveAnswers]; a[i] = ans; setNonObjectiveAnswers(a); }}
                    disabled={nonObjectiveSubmitted} showResult={nonObjectiveSubmitted}
                    isCorrect={nonObjectiveSubmitted && q.acceptedAnswers.some(a => nonObjectiveAnswers[i].toLowerCase().includes(a.toLowerCase()))}
                  />
                ))}
              </div>
            )}

            {phase === "result" && (
              <div className="space-y-4">
                <Card className={cn("border-2", passed ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-red-300 bg-red-50 dark:bg-red-950/30")}>
                  <CardContent className="p-6 text-center space-y-3">
                    <p className="text-4xl">{passed ? "🌟" : "😞"}</p>
                    <h3 className="font-bold text-lg">{passed ? "Perfect Score!" : "Not Quite"}</h3>
                    <p className="text-sm text-muted-foreground">{totalCorrect}/{totalQuestions} correct ({percentage}%)</p>
                    {passed && (
                      <div className="pt-2 space-y-2">
                        <p className="text-sm font-medium">You qualified for the Interactive Session!</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                            <p className="text-[10px] text-muted-foreground">Advance to Next Level</p>
                            <p className="font-bold text-xs text-blue-600">Level {season.currentLevel + 1}</p>
                          </div>
                          <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
                            <p className="text-[10px] text-muted-foreground">Or Take Cash</p>
                            <p className="font-bold text-xs text-green-600">{formatMobiAmount(cashAlternative)}</p>
                          </div>
                        </div>
                        {season.currentLevel >= season.selectionLevels - 3 && (
                          <Badge className="bg-red-500 text-white border-0 animate-pulse">
                            <Radio className="h-3 w-3 mr-1" /> Next level is a LIVE SHOW!
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {passed && (
                  <Card className="border-amber-200">
                    <CardContent className="p-3 text-center">
                      <p className="text-xs text-muted-foreground">🏆 Winners of the final Live Show are crowned</p>
                      <p className="font-bold text-amber-600">Mobi-Celebrity!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 z-10 bg-background border-t p-4">
            {phase === "objective" && (
              <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600" onClick={handleConfirm} disabled={selectedAnswer === null || showResult}>
                {selectedAnswer === null ? "Select Answer" : showResult ? "Loading..." : `Confirm ${MOBIGATE_ANSWER_LABELS[selectedAnswer]}`}
              </Button>
            )}
            {phase === "non_objective" && !nonObjectiveSubmitted && (
              <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600" onClick={handleSubmitNonObjective}>Submit All Answers</Button>
            )}
            {phase === "result" && (
              <Button className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 text-white" onClick={handleClaim}>
                {passed ? "Take Cash Prize (500%)" : "Exit"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <QuizPrizeRedemptionSheet open={showRedemption}
        onOpenChange={(v) => { if (!v) { setShowRedemption(false); onOpenChange(false); } }}
        prizeAmount={cashAlternative} prizeType="cash" />
    </>
  );
}
