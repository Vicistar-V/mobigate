import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose, DrawerBody } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, BookOpen, Trash2, X } from "lucide-react";
import type { MerchantQuestion, QuizMerchant } from "@/data/mobigateInteractiveQuizData";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchant: QuizMerchant;
  questions: MerchantQuestion[];
  onQuestionsChange: (questions: MerchantQuestion[]) => void;
}

type QType = "objective" | "non_objective" | "bonus_objective";

const typeLabels: Record<QType, string> = {
  objective: "Objective",
  non_objective: "Non-Objective",
  bonus_objective: "Bonus",
};

const typeColors: Record<QType, string> = {
  objective: "text-blue-600 bg-blue-500/10",
  non_objective: "text-emerald-600 bg-emerald-500/10",
  bonus_objective: "text-amber-600 bg-amber-500/10",
};

export function MerchantQuestionBankDrawer({ open, onOpenChange, merchant, questions, onQuestionsChange }: Props) {
  const { toast } = useToast();
  const [tab, setTab] = useState<QType>("objective");
  const [showAdd, setShowAdd] = useState(false);

  // Add form state
  const [newQuestion, setNewQuestion] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [newDifficulty, setNewDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [newOptions, setNewOptions] = useState<string[]>(Array(merchant.objectiveOptions).fill(""));
  const [newCorrectIdx, setNewCorrectIdx] = useState(0);
  const [newAltAnswers, setNewAltAnswers] = useState<string[]>([""]);
  const [newTimeLimit, setNewTimeLimit] = useState(30);

  const categories = ["General", "Technology", "Science", "Food", "History", "Entertainment", "Sports", "Geography"];

  const resetForm = () => {
    setNewQuestion("");
    setNewCategory("General");
    setNewDifficulty("medium");
    setNewOptions(Array(merchant.objectiveOptions).fill(""));
    setNewCorrectIdx(0);
    setNewAltAnswers([""]);
    setNewTimeLimit(30);
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    const q: MerchantQuestion = {
      id: `q-${Date.now()}`,
      merchantId: merchant.id,
      question: newQuestion.trim(),
      type: tab,
      options: tab !== "non_objective" ? newOptions.filter(o => o.trim()) : [],
      correctAnswerIndex: tab !== "non_objective" ? newCorrectIdx : -1,
      alternativeAnswers: tab === "non_objective" ? newAltAnswers.filter(a => a.trim()) : [],
      category: newCategory,
      difficulty: newDifficulty,
      timeLimit: newTimeLimit,
      costPerQuestion: merchant.costPerQuestion,
    };
    onQuestionsChange([...questions, q]);
    resetForm();
    setShowAdd(false);
    toast({ title: "Question Added" });
  };

  const handleDeleteQuestion = (id: string) => {
    onQuestionsChange(questions.filter(q => q.id !== id));
    toast({ title: "Question Removed", variant: "destructive" });
  };

  const getCount = (type: QType) => questions.filter(q => q.merchantId === merchant.id && q.type === type).length;

  // ─── ADD QUESTION DRAWER (nested) ─────────────────────────────────────
  const addFormDrawer = (
    <Drawer open={showAdd} onOpenChange={setShowAdd}>
      <DrawerContent className="max-h-[92vh] z-[80]">
        <DrawerHeader className="px-4 shrink-0">
          <DrawerTitle className="text-base">Add {typeLabels[tab]} Question</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="space-y-4 pb-8">
          <div className="space-y-1.5">
            <Label className="text-xs">Question</Label>
            <textarea
              value={newQuestion}
              onChange={e => setNewQuestion(e.target.value)}
              onPointerDown={e => e.stopPropagation()}
              placeholder="Enter your question..."
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm touch-manipulation resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Category</Label>
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="h-11 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Difficulty</Label>
            <Select value={newDifficulty} onValueChange={v => setNewDifficulty(v as any)}>
              <SelectTrigger className="h-11 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Time Limit (seconds)</Label>
            <input
              type="text"
              inputMode="numeric"
              value={newTimeLimit}
              onChange={e => { const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); setNewTimeLimit(isNaN(n) ? 15 : n); }}
              onPointerDown={e => e.stopPropagation()}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm touch-manipulation"
            />
          </div>

          {/* Objective options */}
          {tab !== "non_objective" && (
            <div className="space-y-2">
              <Label className="text-xs">Answer Options — tap letter to mark correct</Label>
              {newOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setNewCorrectIdx(idx)}
                    className={`h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 touch-manipulation text-xs font-bold ${idx === newCorrectIdx ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 text-muted-foreground"}`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </button>
                  <input
                    type="text"
                    value={opt}
                    onChange={e => { const copy = [...newOptions]; copy[idx] = e.target.value; setNewOptions(copy); }}
                    onPointerDown={e => e.stopPropagation()}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    className="h-10 flex-1 min-w-0 rounded-md border border-input bg-background px-3 text-sm touch-manipulation"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Non-objective alternative answers */}
          {tab === "non_objective" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Alternative Answers ({merchant.alternativeAnswersMin}–{merchant.alternativeAnswersMax})</Label>
                {newAltAnswers.length < merchant.alternativeAnswersMax && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 shrink-0" onClick={() => setNewAltAnswers(prev => [...prev, ""])}>
                    <PlusCircle className="h-3 w-3" /> Add
                  </Button>
                )}
              </div>
              {newAltAnswers.map((aa, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={aa}
                    onChange={e => { const copy = [...newAltAnswers]; copy[idx] = e.target.value; setNewAltAnswers(copy); }}
                    onPointerDown={e => e.stopPropagation()}
                    placeholder={`Alternative answer ${idx + 1}`}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    className="h-10 flex-1 min-w-0 rounded-md border border-input bg-background px-3 text-sm touch-manipulation"
                  />
                  {newAltAnswers.length > merchant.alternativeAnswersMin && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0" onClick={() => setNewAltAnswers(prev => prev.filter((_, i) => i !== idx))}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground">Words/phrases closest to the Actual True Answer. A 'Fair Answer' match earns {merchant.fairAnswerPercentage}%.</p>
            </div>
          )}
        </DrawerBody>
        <DrawerFooter className="shrink-0">
          <Button className="h-12 w-full" onClick={handleAddQuestion} disabled={!newQuestion.trim()}>Add Question</Button>
          <DrawerClose asChild><Button variant="outline" className="h-12 w-full">Cancel</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  // ─── MAIN DRAWER ──────────────────────────────────────────────────────
  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="px-4 shrink-0">
            <DrawerTitle className="flex items-center gap-2 text-base"><BookOpen className="h-5 w-5 text-primary" /> Question Banks</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="space-y-4 pb-8">
            {/* Tab buttons — horizontal scroll safe */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
              {(Object.entries(typeLabels) as [QType, string][]).map(([k, label]) => (
                <Button
                  key={k}
                  variant={tab === k ? "default" : "outline"}
                  size="sm"
                  className="h-9 text-xs gap-1 shrink-0 whitespace-nowrap"
                  onClick={() => setTab(k)}
                >
                  {label}
                  <Badge variant={tab === k ? "outline" : "secondary"} className="text-[9px] h-4 px-1 ml-0.5">{getCount(k)}</Badge>
                </Button>
              ))}
            </div>

            {/* Add button */}
            <Button variant="outline" className="w-full h-10 text-sm gap-1" onClick={() => { resetForm(); setShowAdd(true); }}>
              <PlusCircle className="h-4 w-4" /> Add {typeLabels[tab]} Question
            </Button>

            {/* Question list */}
            {getCount(tab) === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">No {typeLabels[tab].toLowerCase()} questions yet.</div>
            )}
            {questions.filter(q => q.merchantId === merchant.id && q.type === tab).map(q => (
              <Card key={q.id} className="active:scale-[0.98] transition-transform">
                <CardContent className="p-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-tight flex-1 min-w-0">{q.question}</p>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive shrink-0" onClick={() => handleDeleteQuestion(q.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className="text-[9px]">{q.category}</Badge>
                    <Badge variant="outline" className="text-[9px]">{q.difficulty}</Badge>
                    <Badge variant="outline" className="text-[9px]">{q.timeLimit}s</Badge>
                    {tab === "non_objective" && q.alternativeAnswers.length > 0 && (
                      <Badge className={`text-[9px] ${typeColors.non_objective}`}>{q.alternativeAnswers.length} AAs</Badge>
                    )}
                    {tab !== "non_objective" && (
                      <Badge className={`text-[9px] ${typeColors[tab]}`}>{q.options.length} opts</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </DrawerBody>
          <DrawerFooter className="shrink-0">
            <DrawerClose asChild><Button variant="outline" className="h-12 w-full">Close</Button></DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {addFormDrawer}
    </>
  );
}
