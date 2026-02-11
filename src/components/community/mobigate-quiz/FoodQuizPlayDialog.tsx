import { useState, useEffect } from "react";
import { X, Clock, ShoppingCart, Zap, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOBIGATE_ANSWER_LABELS } from "@/data/mobigateQuizData";
import { FOOD_QUIZ_BONUS_STAKE_MULTIPLIER, FOOD_QUIZ_BONUS_TIMEOUT_SECONDS, GroceryItem } from "@/data/mobigateFoodQuizData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { NonObjectiveQuestionCard } from "./NonObjectiveQuestionCard";
import { QuizBonusQuestionsDialog } from "./QuizBonusQuestionsDialog";
import { QuizPrizeRedemptionSheet } from "./QuizPrizeRedemptionSheet";

// 10 objective questions
const foodObjectiveQuestions = [
  { question: "Which vitamin is abundant in citrus fruits?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D", "Vitamin E", "Vitamin K", "Iron", "Calcium"], correctAnswer: 2 },
  { question: "What is the main ingredient in bread?", options: ["Rice", "Sugar", "Flour", "Corn", "Milk", "Butter", "Yeast", "Salt"], correctAnswer: 2 },
  { question: "Which of these is a root vegetable?", options: ["Lettuce", "Tomato", "Carrot", "Cabbage", "Pepper", "Onion", "Spinach", "Peas"], correctAnswer: 2 },
  { question: "What grain is used to make semolina?", options: ["Rice", "Maize", "Wheat", "Barley", "Millet", "Sorghum", "Oats", "Rye"], correctAnswer: 2 },
  { question: "Which oil is commonly used in Nigerian cooking?", options: ["Olive Oil", "Coconut Oil", "Palm Oil", "Sesame Oil", "Canola Oil", "Sunflower Oil", "Peanut Oil", "Corn Oil"], correctAnswer: 2 },
  { question: "What is garri made from?", options: ["Yam", "Rice", "Cassava", "Corn", "Wheat", "Millet", "Plantain", "Cocoyam"], correctAnswer: 2 },
  { question: "Which food group do beans belong to?", options: ["Cereals", "Fruits", "Legumes", "Vegetables", "Tubers", "Oils", "Dairy", "Meat"], correctAnswer: 2 },
  { question: "What is the main nutrient in eggs?", options: ["Carbohydrates", "Fiber", "Protein", "Fat", "Vitamin C", "Iron", "Calcium", "Sugar"], correctAnswer: 2 },
  { question: "Which fruit is known as the 'king of fruits'?", options: ["Apple", "Banana", "Mango", "Orange", "Grape", "Pineapple", "Watermelon", "Pawpaw"], correctAnswer: 2 },
  { question: "What mineral does milk primarily provide?", options: ["Iron", "Zinc", "Calcium", "Potassium", "Sodium", "Magnesium", "Phosphorus", "Iodine"], correctAnswer: 2 },
];

// 5 non-objective questions
const foodNonObjectiveQuestions = [
  { question: "Name a Nigerian soup made with palm oil and vegetables", acceptedAnswers: ["egusi", "efo riro", "edikaikong", "ogbono", "bitterleaf"] },
  { question: "What cereal crop is the staple food in most Asian countries?", acceptedAnswers: ["rice"] },
  { question: "Name the process of converting milk into cheese", acceptedAnswers: ["curdling", "coagulation", "fermentation"] },
  { question: "What is the Yoruba name for beans?", acceptedAnswers: ["ewa", "ere"] },
  { question: "Name one health benefit of eating fish regularly", acceptedAnswers: ["omega", "protein", "brain", "heart", "healthy"] },
];

interface FoodQuizPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItems: GroceryItem[];
  stakeAmount: number;
  totalValue: number;
}

type Phase = "objective" | "non_objective" | "result" | "bonus_offer" | "bonus_playing" | "final";

export function FoodQuizPlayDialog({ open, onOpenChange, selectedItems, stakeAmount, totalValue }: FoodQuizPlayDialogProps) {
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
  const [showBonus, setShowBonus] = useState(false);
  const [showRedemption, setShowRedemption] = useState(false);
  const [finalWon, setFinalWon] = useState(false);

  const totalQuestions = 15;
  const question = foodObjectiveQuestions[currentQ];
  const totalCorrect = objectiveCorrect + nonObjectiveCorrect;
  const percentage = Math.round((totalCorrect / totalQuestions) * 100);

  useEffect(() => {
    if (!open) {
      setCurrentQ(0);
      setTimeRemaining(15);
      setSelectedAnswer(null);
      setShowResult(false);
      setObjectiveCorrect(0);
      setPhase("objective");
      setNonObjectiveAnswers(Array(5).fill(""));
      setNonObjectiveSubmitted(false);
      setNonObjectiveCorrect(0);
      setShowBonus(false);
      setShowRedemption(false);
      setFinalWon(false);
    }
  }, [open]);

  // Timer for objective questions
  useEffect(() => {
    if (phase !== "objective" || showResult || !open) return;
    if (timeRemaining <= 0) {
      setShowResult(true);
      setTimeout(() => nextObjective(false), 1500);
      return;
    }
    const timer = setInterval(() => setTimeRemaining(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, phase, showResult, open]);

  const handleConfirmObjective = () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === question.correctAnswer;
    if (isCorrect) setObjectiveCorrect(p => p + 1);
    setShowResult(true);
    setTimeout(() => nextObjective(isCorrect), 1500);
  };

  const nextObjective = (_correct: boolean) => {
    if (currentQ >= 9) {
      setPhase("non_objective");
    } else {
      setCurrentQ(p => p + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeRemaining(15);
    }
  };

  const handleSubmitNonObjective = () => {
    let correct = 0;
    nonObjectiveAnswers.forEach((ans, i) => {
      const q = foodNonObjectiveQuestions[i];
      if (q.acceptedAnswers.some(a => ans.toLowerCase().includes(a.toLowerCase()))) {
        correct++;
      }
    });
    setNonObjectiveCorrect(correct);
    setNonObjectiveSubmitted(true);

    const total = objectiveCorrect + correct;
    const pct = Math.round((total / totalQuestions) * 100);

    setTimeout(() => {
      if (pct === 100) {
        setFinalWon(true);
        setPhase("final");
      } else if (pct >= 70 && pct < 100) {
        setPhase("bonus_offer");
      } else {
        setFinalWon(false);
        setPhase("final");
      }
    }, 2000);
  };

  const handleBonusAccept = () => {
    setShowBonus(true);
  };

  const handleBonusDecline = () => {
    setFinalWon(false);
    setPhase("final");
  };

  const handleBonusComplete = (allCorrect: boolean) => {
    setShowBonus(false);
    setFinalWon(allCorrect);
    setPhase("final");
  };

  const handleClaim = () => {
    if (finalWon) {
      setShowRedemption(true);
    } else {
      onOpenChange(false);
    }
  };

  const progressValue = phase === "objective"
    ? ((currentQ + (showResult ? 1 : 0)) / totalQuestions) * 100
    : phase === "non_objective"
      ? ((10 + (nonObjectiveSubmitted ? 5 : 0)) / totalQuestions) * 100
      : 100;

  return (
    <>
      <Dialog open={open && !showBonus && !showRedemption} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-green-500 to-emerald-500 border-b p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5" />
                <div>
                  <h2 className="font-semibold text-sm">Food for Home Quiz</h2>
                  <p className="text-xs text-green-200">
                    {phase === "objective" && `Question ${currentQ + 1}/10 (Objective)`}
                    {phase === "non_objective" && "Questions 11-15 (Type Your Answer)"}
                    {phase === "bonus_offer" && "Bonus Questions Available"}
                    {phase === "final" && "Results"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={progressValue} className="h-1.5 mt-2 bg-green-400 [&>div]:bg-white" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 touch-auto">
            {/* Objective Phase */}
            {phase === "objective" && question && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Clock className={cn("h-5 w-5", timeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-green-600")} />
                  <span className={cn("text-2xl font-bold tabular-nums", timeRemaining <= 5 && "text-red-500")}>{timeRemaining}s</span>
                </div>
                <Card className="bg-green-50 dark:bg-green-950/30 border-green-200">
                  <CardContent className="p-4"><p className="text-base font-medium">{question.question}</p></CardContent>
                </Card>
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
                        )}>{MOBIGATE_ANSWER_LABELS[idx]}</span>
                        <span className="text-sm">{opt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Non-Objective Phase */}
            {phase === "non_objective" && (
              <div className="space-y-4">
                <Card className="bg-green-50 dark:bg-green-950/30 border-green-200">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">Objective Score: {objectiveCorrect}/10</p>
                    <p className="text-xs text-muted-foreground mt-1">Now answer 5 typed questions</p>
                  </CardContent>
                </Card>

                {foodNonObjectiveQuestions.map((q, i) => (
                  <NonObjectiveQuestionCard
                    key={i}
                    questionNumber={11 + i}
                    question={q.question}
                    onAnswer={(ans) => {
                      const newAnswers = [...nonObjectiveAnswers];
                      newAnswers[i] = ans;
                      setNonObjectiveAnswers(newAnswers);
                    }}
                    disabled={nonObjectiveSubmitted}
                    showResult={nonObjectiveSubmitted}
                    isCorrect={nonObjectiveSubmitted && q.acceptedAnswers.some(a => nonObjectiveAnswers[i].toLowerCase().includes(a.toLowerCase()))}
                  />
                ))}
              </div>
            )}

            {/* Bonus Offer */}
            {phase === "bonus_offer" && (
              <div className="space-y-4">
                <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/30">
                  <CardContent className="p-6 text-center space-y-3">
                    <p className="text-4xl">⭐</p>
                    <h3 className="font-bold text-lg">Almost There!</h3>
                    <p className="text-sm text-muted-foreground">{totalCorrect}/{totalQuestions} correct ({percentage}%)</p>
                    <p className="text-sm">You scored between 70-99%. You can attempt <span className="font-bold">bonus questions</span> to win your items!</p>
                    <div className="p-3 bg-white dark:bg-background rounded-lg border">
                      <p className="text-xs text-muted-foreground">Extra Stake Required</p>
                      <p className="font-bold text-lg text-red-600">{formatMobiAmount(Math.round(stakeAmount * FOOD_QUIZ_BONUS_STAKE_MULTIPLIER))}</p>
                      <p className="text-[10px] text-muted-foreground">(50% of original stake)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Final Results */}
            {phase === "final" && (
              <Card className={cn("border-2", finalWon ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-red-300 bg-red-50 dark:bg-red-950/30")}>
                <CardContent className="p-6 text-center space-y-3">
                  <p className="text-4xl">{finalWon ? "🎉🛒" : "😞"}</p>
                  <h3 className="font-bold text-lg">{finalWon ? "You Won Your Groceries!" : "Better Luck Next Time"}</h3>
                  <p className="text-sm text-muted-foreground">{totalCorrect}/{totalQuestions} correct</p>
                  {finalWon && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">Items Won</p>
                      <p className="text-xl font-bold text-green-600">{formatLocalAmount(totalValue, "NGN")}</p>
                      <p className="text-xs text-muted-foreground">({formatMobiAmount(totalValue)})</p>
                      <div className="flex flex-wrap gap-1 justify-center mt-2">
                        {selectedItems.map(item => (
                          <span key={item.id} className="text-[10px] bg-green-100 px-2 py-0.5 rounded-full">{item.image} {item.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 bg-background border-t p-4">
            {phase === "objective" && (
              <Button className="w-full h-12 bg-green-500 hover:bg-green-600" onClick={handleConfirmObjective} disabled={selectedAnswer === null || showResult}>
                {selectedAnswer === null ? "Select Answer" : showResult ? "Loading..." : `Confirm ${MOBIGATE_ANSWER_LABELS[selectedAnswer]}`}
              </Button>
            )}
            {phase === "non_objective" && !nonObjectiveSubmitted && (
              <Button className="w-full h-12 bg-green-500 hover:bg-green-600" onClick={handleSubmitNonObjective}>
                Submit All Answers
              </Button>
            )}
            {phase === "bonus_offer" && (
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12" onClick={handleBonusDecline}>Decline</Button>
                <Button className="h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white" onClick={handleBonusAccept}>
                  Accept Bonus
                </Button>
              </div>
            )}
            {phase === "final" && (
              <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white" onClick={handleClaim}>
                {finalWon ? "Claim Your Items" : "Exit"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <QuizBonusQuestionsDialog
        open={showBonus}
        onOpenChange={(v) => { if (!v) handleBonusComplete(false); }}
        originalStake={stakeAmount}
        onComplete={handleBonusComplete}
      />

      <QuizPrizeRedemptionSheet
        open={showRedemption}
        onOpenChange={(v) => { if (!v) { setShowRedemption(false); onOpenChange(false); } }}
        prizeAmount={totalValue}
        prizeType="items"
        itemNames={selectedItems.map(i => i.name)}
      />
    </>
  );
}
