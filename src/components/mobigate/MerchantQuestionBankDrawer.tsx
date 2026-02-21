import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose, DrawerBody } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  objective: "Main Objective",
  non_objective: "Main Non-Objective",
  bonus_objective: "Bonus Objective",
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

  const filtered = questions.filter(q => q.merchantId === merchant.id && q.type === tab);
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

  // Add question form drawer
  const addForm = (
    <Drawer open={showAdd} onOpenChange={setShowAdd}>
      <DrawerContent>
        <DrawerHeader className="px-4">
          <DrawerTitle className="text-base">Add {typeLabels[tab]} Question</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="space-y-4 pb-6">
          <div className="space-y-1.5">
            <Label className="text-xs">Question</Label>
            <textarea
              value={newQuestion}
              onChange={e => setNewQuestion(e.target.value)}
              onPointerDown={e => e.stopPropagation()}
              placeholder="Enter your question..."
              className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm touch-manipulation resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Difficulty</Label>
              <Select value={newDifficulty} onValueChange={v => setNewDifficulty(v as any)}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Time Limit (seconds)</Label>
            <input
              type="text"
              inputMode="numeric"
              value={newTimeLimit}
              onChange={e => { const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); setNewTimeLimit(isNaN(n) ? 15 : n); }}
              onPointerDown={e => e.stopPropagation()}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm touch-manipulation"
            />
          </div>

          {/* Objective options */}
          {tab !== "non_objective" && (
            <div className="space-y-2">
              <Label className="text-xs">Answer Options ({merchant.objectiveOptions} required, tap to mark correct)</Label>
              {newOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCorrectIdx(idx)}
                    className={`h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 touch-manipulation text-xs font-bold ${idx === newCorrectIdx ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 text-muted-foreground"}`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </button>
                  <Input
                    value={opt}
                    onChange={e => { const copy = [...newOptions]; copy[idx] = e.target.value; setNewOptions(copy); }}
                    onPointerDown={e => e.stopPropagation()}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    className="h-10 text-sm touch-manipulation"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Non-objective alternative answers */}
          {tab === "non_objective" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Alternative Answers ({merchant.alternativeAnswersMin}-{merchant.alternativeAnswersMax})</Label>
                {newAltAnswers.length < merchant.alternativeAnswersMax && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setNewAltAnswers(prev => [...prev, ""])}>
                    <PlusCircle className="h-3 w-3" /> Add
                  </Button>
                )}
              </div>
              {newAltAnswers.map((aa, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={aa}
                    onChange={e => { const copy = [...newAltAnswers]; copy[idx] = e.target.value; setNewAltAnswers(copy); }}
                    onPointerDown={e => e.stopPropagation()}
                    placeholder={`Alternative answer ${idx + 1}`}
                    className="h-10 text-sm touch-manipulation"
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
        <DrawerFooter>
          <Button className="h-12" onClick={handleAddQuestion} disabled={!newQuestion.trim()}>Add Question</Button>
          <DrawerClose asChild><Button variant="outline" className="h-12">Cancel</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="px-4">
          <DrawerTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Question Banks</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="space-y-4 pb-6">
          <Tabs value={tab} onValueChange={v => setTab(v as QType)}>
            <TabsList className="w-full">
              {(Object.entries(typeLabels) as [QType, string][]).map(([k, label]) => {
                const count = questions.filter(q => q.merchantId === merchant.id && q.type === k).length;
                return (
                  <TabsTrigger key={k} value={k} className="text-[11px] gap-1 flex-1">
                    {label.split(" ").pop()}
                    <Badge variant="secondary" className="text-[9px] h-4 px-1">{count}</Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {(Object.keys(typeLabels) as QType[]).map(qType => (
              <TabsContent key={qType} value={qType} className="space-y-3 mt-3">
                <Button variant="outline" className="w-full h-10 text-sm gap-1" onClick={() => { setTab(qType); resetForm(); setShowAdd(true); }}>
                  <PlusCircle className="h-4 w-4" /> Add {typeLabels[qType]} Question
                </Button>
                {questions.filter(q => q.merchantId === merchant.id && q.type === qType).length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">No questions yet.</div>
                )}
                {questions.filter(q => q.merchantId === merchant.id && q.type === qType).map(q => (
                  <Card key={q.id} className="active:scale-[0.98] transition-transform">
                    <CardContent className="p-3 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-tight flex-1">{q.question}</p>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive shrink-0" onClick={() => handleDeleteQuestion(q.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="outline" className="text-[9px]">{q.category}</Badge>
                        <Badge variant="outline" className="text-[9px]">{q.difficulty}</Badge>
                        <Badge variant="outline" className="text-[9px]">{q.timeLimit}s</Badge>
                        {qType === "non_objective" && q.alternativeAnswers.length > 0 && (
                          <Badge className={`text-[9px] ${typeColors.non_objective}`}>{q.alternativeAnswers.length} AAs</Badge>
                        )}
                        {qType !== "non_objective" && (
                          <Badge className={`text-[9px] ${typeColors[qType]}`}>{q.options.length} options</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild><Button variant="outline" className="h-12">Close</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
      {addForm}
    </Drawer>
  );
}
