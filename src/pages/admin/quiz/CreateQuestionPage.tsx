import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { CreateQuizQuestionForm } from "@/components/mobigate/CreateQuizQuestionForm";
import { type AdminQuizQuestion } from "@/data/mobigateQuizQuestionsData";
import { QUIZ_TYPE_LABELS, type QuizType } from "@/data/quizTypeQuestionsData";
import { PlusCircle, ListChecks } from "lucide-react";

export default function CreateQuestionPage() {
  const { quizType } = useParams<{ quizType: string }>();
  const qt = (quizType as QuizType) || "group";
  const typeLabel = QUIZ_TYPE_LABELS[qt] || "Quiz";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [justCreated, setJustCreated] = useState(false);

  const handleCreate = (data: Omit<AdminQuizQuestion, "id" | "createdAt">) => {
    toast({ title: "Question Created!", description: `Added to ${data.category} (${typeLabel})` });
    setJustCreated(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <h1 className="text-lg font-bold px-4 pt-4">{typeLabel} — Create Question</h1>
      <p className="text-xs text-muted-foreground px-4 mb-2">Creating question for {typeLabel} database</p>
      <div className="p-4 space-y-4">
        <CreateQuizQuestionForm onCreateQuestion={handleCreate} quizType={qt} />

        {justCreated && (
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 h-12" onClick={() => setJustCreated(false)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Another
            </Button>
            <Button className="flex-1 h-12" onClick={() => navigate(`/mobigate-admin/quiz/${qt}/questions`)}>
              <ListChecks className="h-4 w-4 mr-2" />
              View All Questions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
