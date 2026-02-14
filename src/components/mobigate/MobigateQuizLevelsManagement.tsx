import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trophy, CheckCircle, XCircle, Layers } from "lucide-react";
import { DEFAULT_QUIZ_LEVELS, type QuizLevelEntry } from "@/data/mobigateQuizLevelsData";
import { type QuizType, QUIZ_TYPE_LABELS } from "@/data/quizTypeQuestionsData";
import { CreateQuizLevelForm } from "./CreateQuizLevelForm";
import { QuizLevelCard } from "./QuizLevelCard";
import { QuizLevelFilters } from "./QuizLevelFilters";
import { EditQuizLevelDrawer } from "./EditQuizLevelDrawer";

interface Props {
  quizType?: QuizType;
}

export function MobigateQuizLevelsManagement({ quizType }: Props) {
  const { toast } = useToast();
  const [levels, setLevels] = useState<QuizLevelEntry[]>(DEFAULT_QUIZ_LEVELS);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<string | null>(null);

  const allCategories = useMemo(() => [...new Set(levels.map(l => l.category))].sort(), [levels]);

  const totalLevels = levels.length;
  const activeLevels = levels.filter(l => l.isActive).length;
  const inactiveLevels = totalLevels - activeLevels;

  const filteredLevels = useMemo(() => {
    return levels.filter(l => {
      const matchCategory = filterCategory === "all" || l.category === filterCategory;
      const matchSearch = !searchQuery || l.levelName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [levels, filterCategory, searchQuery]);

  const handleCreate = (data: { category: string; levelName: string; stakeAmount: number; winningAmount: number; isActive: boolean }) => {
    const newEntry: QuizLevelEntry = { id: `custom-${Date.now()}`, ...data, isPreset: false, createdAt: new Date().toISOString() };
    setLevels(prev => [newEntry, ...prev]);
    toast({ title: "Quiz Level Created", description: `${data.levelName} in ${data.category}` });
  };

  const handleToggleStatus = (id: string) => {
    setLevels(prev => prev.map(l => (l.id === id ? { ...l, isActive: !l.isActive } : l)));
    const entry = levels.find(l => l.id === id);
    toast({ title: entry?.isActive ? "Level Deactivated" : "Level Activated", description: entry?.levelName });
  };

  const handleEdit = (id: string, data: { category: string; stakeAmount: number; winningAmount: number; isActive: boolean }) => {
    setLevels(prev => prev.map(l => (l.id === id ? { ...l, ...data } : l)));
    const entry = levels.find(l => l.id === id);
    toast({ title: "Quiz Level Updated", description: entry?.levelName });
  };

  const handleDeleteFromDrawer = (id: string) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const entry = levels.find(l => l.id === deleteTarget);
    setLevels(prev => prev.filter(l => l.id !== deleteTarget));
    setDeleteTarget(null);
    toast({ title: "Quiz Level Deleted", description: entry?.levelName, variant: "destructive" });
  };

  const editEntry = levels.find(l => l.id === editTarget) || null;

  return (
    <ScrollArea className="h-[calc(100vh-260px)]">
      <div className="space-y-4 pb-6">
        <CreateQuizLevelForm onCreateLevel={handleCreate} />

        <Card>
          <CardContent className="p-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-muted/30">
                <Layers className="h-4 w-4 mx-auto mb-1 text-primary" />
                <p className="text-lg font-bold">{totalLevels}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Total</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                <CheckCircle className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
                <p className="text-lg font-bold text-emerald-600">{activeLevels}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Active</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <XCircle className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-lg font-bold">{inactiveLevels}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <QuizLevelFilters
          categories={allCategories}
          selectedCategory={filterCategory}
          onCategoryChange={setFilterCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="space-y-2">
          {filteredLevels.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground text-sm">
                <Trophy className="h-8 w-8 mx-auto mb-2 opacity-40" />
                No quiz levels match your filters
              </CardContent>
            </Card>
          ) : (
            filteredLevels.map(entry => (
              <QuizLevelCard key={entry.id} entry={entry} onToggleStatus={handleToggleStatus} onEdit={id => setEditTarget(id)} />
            ))
          )}
        </div>

        <EditQuizLevelDrawer
          open={!!editTarget}
          onOpenChange={(open) => !open && setEditTarget(null)}
          entry={editEntry}
          onSave={handleEdit}
          onDelete={handleDeleteFromDrawer}
        />

        <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Quiz Level?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently remove this quiz level. This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ScrollArea>
  );
}
