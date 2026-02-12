import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";
import { PRESET_QUIZ_CATEGORIES } from "@/data/mobigateQuizLevelsData";
import { ANSWER_LABELS, type QuizDifficulty, type AdminQuizQuestion } from "@/data/mobigateQuizQuestionsData";

interface Props {
  question: AdminQuizQuestion;
  onSave: (updated: AdminQuizQuestion) => void;
  onCancel: () => void;
}

const DIFFICULTIES: QuizDifficulty[] = ["Easy", "Medium", "Hard", "Expert"];

export function EditQuizQuestionForm({ question, onSave, onCancel }: Props) {
  const [category, setCategory] = useState(question.category);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>(question.difficulty);
  const [questionText, setQuestionText] = useState(question.question);
  const [options, setOptions] = useState<string[]>([...question.options]);
  const [correctIndex, setCorrectIndex] = useState<number>(question.correctAnswerIndex);
  const [timeLimit, setTimeLimit] = useState(question.timeLimit);
  const [points, setPoints] = useState(question.points);

  const updateOption = (idx: number, val: string) => {
    setOptions(prev => prev.map((o, i) => (i === idx ? val : o)));
  };

  const handleSave = () => {
    if (!category || !questionText.trim() || options.some(o => !o.trim())) return;
    onSave({
      ...question,
      question: questionText.trim(),
      options: options.map(o => o.trim()) as AdminQuizQuestion["options"],
      correctAnswerIndex: correctIndex,
      category,
      difficulty,
      timeLimit,
      points,
    });
  };

  const isValid = category && questionText.trim() && options.every(o => o.trim());

  return (
    <Card className="border-primary/50">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>Edit Question</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
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

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onCancel} className="h-12 text-base">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid} className="h-12 text-base font-semibold">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
