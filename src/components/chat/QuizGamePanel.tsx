import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/types/chat";
import { Trophy, X } from "lucide-react";

interface QuizGamePanelProps {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  onAnswer: (answerIndex: number) => void;
  onExit: () => void;
  timeRemaining: number;
}

export const QuizGamePanel = ({
  questions,
  currentQuestionIndex,
  score,
  onAnswer,
  onExit,
  timeRemaining
}: QuizGamePanelProps) => {
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-card rounded-lg px-2.5 sm:px-3 py-1.5 shadow-sm border">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm sm:text-base">{score}</span>
          </div>
          <div className="text-sm sm:text-base text-muted-foreground">
            {currentQuestionIndex + 1}/{questions.length}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onExit}
          className="h-8 w-8 sm:h-9 sm:w-9"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-secondary/30 rounded-full h-1.5 sm:h-2 mb-3 sm:mb-4 overflow-hidden">
        <div 
          className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Placeholder Content */}
      <Card className="flex-1 flex items-center justify-center border-2 border-dashed border-muted-foreground/20 bg-card/50">
        <div className="text-center p-4 sm:p-6">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎮</div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Quiz Game</h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Quiz interface will be here
          </p>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Category: {currentQuestion?.category || 'General'}
          </p>
          <p className="text-sm sm:text-base text-muted-foreground">
            Time: {timeRemaining}s
          </p>
        </div>
      </Card>
    </div>
  );
};
