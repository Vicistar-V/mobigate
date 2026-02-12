import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HelpCircle, Layers, FileQuestion, PlusCircle } from "lucide-react";
import { INITIAL_ADMIN_QUESTIONS, type AdminQuizQuestion } from "@/data/mobigateQuizQuestionsData";
import { QuizQuestionCard } from "@/components/mobigate/QuizQuestionCard";
import { QuizQuestionFilters } from "@/components/mobigate/QuizQuestionFilters";
import { MobigateAdminHeader } from "@/components/mobigate/MobigateAdminHeader";

export default function ManageQuestionsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<AdminQuizQuestion[]>(INITIAL_ADMIN_QUESTIONS);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const allCategories = useMemo(() => [...new Set(questions.map(q => q.category))].sort(), [questions]);
  const totalQuestions = questions.length;
  const categoryCount = allCategories.length;

  const filtered = useMemo(() => {
    return questions.filter(q => {
      const matchCat = filterCategory === "all" || q.category === filterCategory;
      const matchSearch = !searchQuery || q.question.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [questions, filterCategory, searchQuery]);

  const handleEdit = (id: string) => {
    toast({ title: "Edit Question", description: "Edit mode would open here (UI template)" });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const q = questions.find(q => q.id === deleteTarget);
    setQuestions(prev => prev.filter(q => q.id !== deleteTarget));
    setDeleteTarget(null);
    toast({ title: "Question Deleted", description: q?.question?.slice(0, 40) + "...", variant: "destructive" });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobigateAdminHeader title="Manage Questions" subtitle="Browse & Edit Quiz Questions" />
      <div className="p-4">
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="space-y-4 pb-6">
            {/* Create New Button */}
            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={() => navigate("/mobigate-admin/quiz/questions/create")}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create New Question
            </Button>

            {/* Stats */}
            <Card>
              <CardContent className="p-3">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-muted/30">
                    <FileQuestion className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{totalQuestions}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Total Questions</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/30">
                    <Layers className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{categoryCount}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Categories Used</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <QuizQuestionFilters
              categories={allCategories}
              selectedCategory={filterCategory}
              onCategoryChange={setFilterCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Question Cards */}
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground text-sm">
                    <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    No questions match your filters
                  </CardContent>
                </Card>
              ) : (
                filtered.map(q => (
                  <QuizQuestionCard
                    key={q.id}
                    question={q}
                    onEdit={handleEdit}
                    onDelete={id => setDeleteTarget(id)}
                  />
                ))
              )}
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Question?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove this quiz question. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
