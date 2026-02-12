import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { PRESET_QUIZ_CATEGORIES } from "@/data/mobigateQuizLevelsData";
import { ANSWER_LABELS, type QuizDifficulty, type AdminQuizQuestion } from "@/data/mobigateQuizQuestionsData";

interface Props {
  onCreateQuestion: (q: Omit<AdminQuizQuestion, "id" | "createdAt">) => void;
}

const DIFFICULTIES: QuizDifficulty[] = ["Easy", "Medium", "Hard", "Expert"];

export function CreateQuizQuestionForm({ onCreateQuestion }: Props) {
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("Medium");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(Array(8).fill(""));
  const [correctIndex, setCorrectIndex] = useState<number>(0);
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
          Create New Question
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

        {/* Correct Answer - full width */}
        <div className="space-y-1.5">
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
