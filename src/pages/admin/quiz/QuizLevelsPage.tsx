import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { MobigateQuizLevelsManagement } from "@/components/mobigate/MobigateQuizLevelsManagement";
import { QUIZ_TYPE_LABELS, type QuizType } from "@/data/quizTypeQuestionsData";

export default function QuizLevelsPage() {
  const { quizType } = useParams<{ quizType: string }>();
  const typeLabel = QUIZ_TYPE_LABELS[(quizType as QuizType) || "group"] || "Quiz";

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="p-4">
        <h1 className="text-lg font-bold mb-1">{typeLabel} — Levels</h1>
        <p className="text-xs text-muted-foreground mb-3">Configure stakes & tiers for {typeLabel}</p>
        <MobigateQuizLevelsManagement />
      </div>
    </div>
  );
}
