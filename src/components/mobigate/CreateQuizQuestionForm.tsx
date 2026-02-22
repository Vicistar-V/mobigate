import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { PRESET_QUIZ_CATEGORIES, PRESET_LEVEL_TIERS } from "@/data/mobigateQuizLevelsData";
import { ANSWER_LABELS, type QuizDifficulty, type AdminQuizQuestion } from "@/data/mobigateQuizQuestionsData";
import { QUIZ_TYPE_LABELS, type QuizType } from "@/data/quizTypeQuestionsData";
import { mockMerchants } from "@/data/mobigateInteractiveQuizData";

interface Props {
  onCreateQuestion: (q: Omit<AdminQuizQuestion, "id" | "createdAt">) => void;
  quizType?: QuizType;
}

const DIFFICULTIES: QuizDifficulty[] = ["Easy", "Medium", "Hard", "Expert"];

export function CreateQuizQuestionForm({ onCreateQuestion, quizType }: Props) {
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("Medium");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(Array(8).fill(""));
  const [correctIndex, setCorrectIndex] = useState<number>(0);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [timeLimit, setTimeLimit] = useState(10);
  const [points, setPoints] = useState(10);

  const updateOption = (idx: number, val: string) => {
    setOptions(prev => prev.map((o, i) => (i === idx ? val : o)));
  };

  const handleSubmit = () => {
    if (!category || !questionText.trim() || options.some(o => !o.trim())) return;
    onCreateQuestion({
      question: questionText.trim(),
      options: options.map(o => o.trim()) as AdminQuizQuestion["options"],
      correctAnswerIndex: correctIndex,
      category,
      difficulty,
      timeLimit,
      points,
      status: "active",
      timesAsked: 0,
      freezeCount: 0,
    });
    // Reset
    setQuestionText("");
    setOptions(Array(8).fill(""));
    setCorrectIndex(0);
    setTimeLimit(10);
    setPoints(10);
  };

  const isValid = category && questionText.trim() && options.every(o => o.trim());

  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-primary" />
          {quizType ? `New ${QUIZ_TYPE_LABELS[quizType]} Question` : "Create New Question"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0 px-4 pb-4">
        {/* Category - full width */}
        <div className="space-y-1.5">
          <Label className="text-xs">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent>
              {PRESET_QUIZ_CATEGORIES.map(c => (
                <SelectItem key={c} value={c} className="text-sm">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty - full width */}
        <div className="space-y-1.5">
          <Label className="text-xs">Difficulty</Label>
          <Select value={difficulty} onValueChange={v => setDifficulty(v as QuizDifficulty)}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Interactive Quiz: Merchant selector */}
        {quizType === "interactive" && (
          <div className="space-y-1.5">
            <Label className="text-xs">Merchant (Optional)</Label>
            <Select defaultValue="">
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Global Pool (no merchant)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Global Pool</SelectItem>
                {mockMerchants.map(m => (
                  <SelectItem key={m.id} value={m.id} className="text-sm">{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground">Leave empty for Global Pool questions</p>
          </div>
        )}

        {/* Apply to Level - multi-select checkboxes */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Apply to Level</Label>
            {selectedLevels.length > 0 && (
              <button
                type="button"
                className="text-[11px] text-destructive font-medium touch-manipulation active:scale-[0.97] px-2 py-0.5 rounded"
                onClick={() => setSelectedLevels([])}
              >
                Deselect All
              </button>
            )}
          </div>
          <div className="border border-border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto touch-auto">
            {/* All Levels option */}
            <label className="flex items-center gap-2.5 py-1 cursor-pointer touch-manipulation">
              <Checkbox
                checked={selectedLevels.includes("All Levels")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedLevels(["All Levels", ...PRESET_LEVEL_TIERS.map(t => t.name)]);
                  } else {
                    setSelectedLevels([]);
                  }
                }}
              />
              <span className="text-sm font-medium">All Levels</span>
            </label>
            <div className="border-t border-border/40" />
            {PRESET_LEVEL_TIERS.map((tier) => (
              <label key={tier.name} className="flex items-center gap-2.5 py-1 cursor-pointer touch-manipulation">
                <Checkbox
                  checked={selectedLevels.includes(tier.name)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      const next = [...selectedLevels.filter(l => l !== "All Levels"), tier.name];
                      if (next.length === PRESET_LEVEL_TIERS.length) {
                        setSelectedLevels(["All Levels", ...PRESET_LEVEL_TIERS.map(t => t.name)]);
                      } else {
                        setSelectedLevels(next);
                      }
                    } else {
                      setSelectedLevels(prev => prev.filter(l => l !== tier.name && l !== "All Levels"));
                    }
                  }}
                />
                <span className="text-sm">{tier.name}</span>
              </label>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {selectedLevels.includes("All Levels")
              ? "Universal — this question will feature in all Quiz Levels."
              : selectedLevels.length > 0
                ? `Applies to ${selectedLevels.length} level${selectedLevels.length > 1 ? "s" : ""} only.`
                : "Select at least one level."}
          </p>
        </div>

        {/* Question */}
        <div className="space-y-1.5">
          <Label className="text-xs">Question Text</Label>
          <Textarea
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            placeholder="Enter the quiz question..."
            className="min-h-[80px] text-base"
          />
        </div>

        {/* 8 Options in 2-col grid */}
        <div className="space-y-1.5">
          <Label className="text-xs">Answer Options (A–H)</Label>
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{ANSWER_LABELS[idx]}</span>
                <Input
                  value={opt}
                  onChange={e => updateOption(idx, e.target.value)}
                  placeholder={`Option ${ANSWER_LABELS[idx]}`}
                  className="h-12 text-base"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Correct Answer - full width, centered */}
        <div className="space-y-1.5 text-center">
          <Label className="text-xs">Correct Answer</Label>
          <Select value={String(correctIndex)} onValueChange={v => setCorrectIndex(Number(v))}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ANSWER_LABELS.map((label, idx) => (
                <SelectItem key={idx} value={String(idx)}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time & Points - 2 col */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Time (sec)</Label>
            <Input type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} className="h-12 text-base" min={5} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Points</Label>
            <Input type="number" value={points} onChange={e => setPoints(Number(e.target.value))} className="h-12 text-base" min={1} />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={!isValid} className="w-full h-12 text-base font-semibold">
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Question
        </Button>
      </CardContent>
    </Card>
  );
}
