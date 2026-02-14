import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Header } from "@/components/Header";
import { PRESET_QUIZ_CATEGORIES } from "@/data/mobigateQuizLevelsData";
import { Layers, PlusCircle, Trash2, CheckCircle, XCircle, FolderOpen } from "lucide-react";
import { QUIZ_TYPE_LABELS, type QuizType } from "@/data/quizTypeQuestionsData";

interface Category {
  id: string;
  name: string;
  isActive: boolean;
  isPreset: boolean;
  questionCount: number;
}

const MOCK_QUESTION_COUNTS: Record<string, number> = {
  "Current Affairs": 45, "Politics and Leadership": 32, "Science and Technology": 58,
  "Morals and Religion": 21, "Literature and Reading": 27, "Agriculture and Farming": 14,
  "Healthcare and Medicare": 36, "Transportation and Vacation": 11, "Basic and General Education": 42,
  "Sports and Physical Fitness": 53, "Skills and Crafts": 18, "Business and Entrepreneurship": 39,
  "Entertainment and Leisure": 47, "Environment and Society": 22, "Basic Law": 16,
  "Family and Home": 19, "Civic Education and Responsibilities": 25,
  "Mentorship and Individual Development": 13, "Discoveries and Inventions": 31,
  "Culture and Tradition": 28, "Real Estate and Physical Development": 9,
  "Information Technology": 44, "General and Basic Knowledge": 61,
};

const initialCategories: Category[] = PRESET_QUIZ_CATEGORIES.map((name, i) => ({
  id: `preset-${i}`, name, isActive: true, isPreset: true,
  questionCount: MOCK_QUESTION_COUNTS[name] || 0,
}));

export default function QuizCategoriesPage() {
  const { quizType } = useParams<{ quizType: string }>();
  const typeLabel = QUIZ_TYPE_LABELS[(quizType as QuizType) || "group"] || "Quiz";
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const activeCount = categories.filter(c => c.isActive).length;
  const totalQuestions = categories.reduce((sum, c) => sum + c.questionCount, 0);

  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      toast({ title: "Duplicate", description: "Category already exists", variant: "destructive" });
      return;
    }
    setCategories(prev => [{ id: `custom-${Date.now()}`, name, isActive: true, isPreset: false, questionCount: 0 }, ...prev]);
    setNewCategoryName("");
    toast({ title: "Category Added", description: name });
  };

  const handleToggle = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const cat = categories.find(c => c.id === deleteTarget);
    setCategories(prev => prev.filter(c => c.id !== deleteTarget));
    setDeleteTarget(null);
    toast({ title: "Category Deleted", description: cat?.name, variant: "destructive" });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="px-3">
        <h1 className="text-lg font-bold mb-1">{typeLabel} — Categories</h1>
        <p className="text-xs text-muted-foreground mb-3">Manage categories for {typeLabel}</p>
        <ScrollArea className="h-[calc(100vh-150px)]">
          <div className="space-y-3 pb-6">
            {/* Add Custom Category */}
            <Card>
              <CardContent className="p-3">
                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <PlusCircle className="h-4 w-4 text-primary shrink-0" />
                  Add Custom Category
                </p>
                <div className="flex flex-col gap-2">
                  <Input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name..." className="h-11 text-sm w-full"
                    onKeyDown={e => e.key === "Enter" && handleAddCategory()} />
                  <Button onClick={handleAddCategory} className="h-11 w-full text-sm" disabled={!newCategoryName.trim()}>
                    Add Category
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <Card><CardContent className="p-2 text-center">
                <Layers className="h-4 w-4 mx-auto mb-1 text-primary" />
                <p className="text-base font-bold">{categories.length}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Total</p>
              </CardContent></Card>
              <Card><CardContent className="p-2 text-center">
                <CheckCircle className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
                <p className="text-base font-bold text-emerald-600">{activeCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Active</p>
              </CardContent></Card>
              <Card><CardContent className="p-2 text-center">
                <FolderOpen className="h-4 w-4 mx-auto mb-1 text-primary" />
                <p className="text-base font-bold">{totalQuestions}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Questions</p>
              </CardContent></Card>
            </div>

            {/* Category List */}
            <div className="space-y-2">
              {categories.map(cat => (
                <Card key={cat.id} className={!cat.isActive ? "opacity-60" : ""}>
                  <CardContent className="p-2.5">
                    <div className="flex items-center gap-2">
                      <Switch checked={cat.isActive} onCheckedChange={() => handleToggle(cat.id)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium break-words">{cat.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{cat.questionCount} questions</span>
                          {cat.isPreset ? (
                            <Badge variant="secondary" className="text-[10px] h-4">Preset</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] h-4 text-primary border-primary/30">Custom</Badge>
                          )}
                        </div>
                      </div>
                      {!cat.isPreset && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(cat.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove this custom category.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
