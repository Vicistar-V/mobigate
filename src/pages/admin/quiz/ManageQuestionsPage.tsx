import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HelpCircle, PlusCircle, Snowflake, Ban, Zap } from "lucide-react";
import { INITIAL_ADMIN_QUESTIONS, type AdminQuizQuestion, type QuizQuestionStatus } from "@/data/mobigateQuizQuestionsData";
import { QuizQuestionCard } from "@/components/mobigate/QuizQuestionCard";
import { QuizQuestionFilters } from "@/components/mobigate/QuizQuestionFilters";
import { EditQuizQuestionForm } from "@/components/mobigate/EditQuizQuestionForm";
import { Header } from "@/components/Header";

export default function ManageQuestionsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<AdminQuizQuestion[]>(INITIAL_ADMIN_QUESTIONS);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState<QuizQuestionStatus>("active");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const allCategories = useMemo(() => [...new Set(questions.map(q => q.category))].sort(), [questions]);

  const counts = useMemo(() => ({
    active: questions.filter(q => q.status === "active").length,
    frozen: questions.filter(q => q.status === "frozen").length,
    suspended: questions.filter(q => q.status === "suspended").length,
  }), [questions]);

  const filtered = useMemo(() => {
    return questions.filter(q => {
      const matchStatus = q.status === statusTab;
      const matchCat = filterCategory === "all" || q.category === filterCategory;
      const matchSearch = !searchQuery || q.question.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchCat && matchSearch;
    });
  }, [questions, statusTab, filterCategory, searchQuery]);

  const handleEdit = (id: string) => setEditingId(id);

  const handleSaveEdit = (updated: AdminQuizQuestion) => {
    setQuestions(prev => prev.map(q => q.id === updated.id ? updated : q));
    setEditingId(null);
    toast({ title: "Question Updated", description: "Changes saved successfully." });
  };

  const handleSuspend = (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: "suspended" as const } : q));
    toast({ title: "Question Suspended", description: "The question has been suspended and removed from active quiz rotation." });
  };

  const handleReactivate = (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: "active" as const, timesAsked: 0 } : q));
    toast({ title: "Question Reactivated", description: "The question is now active and back in quiz rotation." });
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
      <Header />
      <div className="p-4">
        <h1 className="text-lg font-bold mb-3">Manage Questions</h1>
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
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                    <Zap className="h-4 w-4 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-lg font-bold">{counts.active}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Active</p>
                  </div>
                  <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/20">
                    <Snowflake className="h-4 w-4 mx-auto mb-1 text-sky-600 dark:text-sky-400" />
                    <p className="text-lg font-bold">{counts.frozen}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Frozen</p>
                  </div>
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
                    <Ban className="h-4 w-4 mx-auto mb-1 text-red-600 dark:text-red-400" />
                    <p className="text-lg font-bold">{counts.suspended}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Suspended</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Tabs */}
            <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as QuizQuestionStatus)}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="active" className="text-xs gap-1">
                  Active <span className="text-[10px] opacity-70">({counts.active})</span>
                </TabsTrigger>
                <TabsTrigger value="frozen" className="text-xs gap-1">
                  Frozen <span className="text-[10px] opacity-70">({counts.frozen})</span>
                </TabsTrigger>
                <TabsTrigger value="suspended" className="text-xs gap-1">
                  Suspended <span className="text-[10px] opacity-70">({counts.suspended})</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

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
                    No {statusTab} questions match your filters
                  </CardContent>
                </Card>
              ) : (
                filtered.map(q => (
                  editingId === q.id ? (
                    <EditQuizQuestionForm
                      key={q.id}
                      question={q}
                      onSave={handleSaveEdit}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <QuizQuestionCard
                      key={q.id}
                      question={q}
                      onEdit={handleEdit}
                      onDelete={id => setDeleteTarget(id)}
                      onSuspend={handleSuspend}
                      onReactivate={handleReactivate}
                    />
                  )
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
