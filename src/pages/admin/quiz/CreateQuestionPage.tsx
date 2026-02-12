import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MobigateAdminHeader } from "@/components/mobigate/MobigateAdminHeader";
import { CreateQuizQuestionForm } from "@/components/mobigate/CreateQuizQuestionForm";
import { type AdminQuizQuestion } from "@/data/mobigateQuizQuestionsData";
import { PlusCircle, ListChecks } from "lucide-react";

export default function CreateQuestionPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [justCreated, setJustCreated] = useState(false);

  const handleCreate = (data: Omit<AdminQuizQuestion, "id" | "createdAt">) => {
    // In a real app this would save to DB
    toast({ title: "Question Created!", description: `Added to ${data.category}` });
    setJustCreated(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobigateAdminHeader title="Create Question" subtitle="Add New Quiz Question" />
      <div className="p-4 space-y-4">
        <CreateQuizQuestionForm onCreateQuestion={handleCreate} />

        {justCreated && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-12"
              onClick={() => setJustCreated(false)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Another
            </Button>
            <Button
              className="flex-1 h-12"
              onClick={() => navigate("/mobigate-admin/quiz/questions")}
            >
              <ListChecks className="h-4 w-4 mr-2" />
              View All Questions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
