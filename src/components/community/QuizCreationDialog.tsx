import { useState } from "react";
import { X, Plus, Trash2, Award } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { quizCategories } from "@/data/quizGameData";
import { useToast } from "@/hooks/use-toast";

interface QuizCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export function QuizCreationDialog({ open, onOpenChange }: QuizCreationDialogProps) {
  const { toast } = useToast();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [timeLimit, setTimeLimit] = useState("15");
  const [prizePool, setPrizePool] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    { id: "q1", question: "", options: ["", "", "", ""], correctAnswer: 0, points: 10 }
  ]);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q${questions.length + 1}`,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 10
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof QuizQuestion, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handlePublish = () => {
    if (!quizTitle || !category || questions.some(q => !q.question || q.options.some(o => !o))) {
      toast({
        title: "Incomplete Quiz",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Quiz Published!",
      description: `${quizTitle} is now live for members to play`,
    });
    onOpenChange(false);
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your quiz has been saved as a draft",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[95vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0 sticky top-0 bg-background z-10 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle className="text-xl font-bold">Create Mobi Quiz Game</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(95vh-140px)]">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Quiz Details */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">Quiz Details</h3>
                
                <div>
                  <Label>Quiz Title *</Label>
                  <Input
                    placeholder="e.g., Community Heritage Quiz"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Description *</Label>
                  <Textarea
                    placeholder="Describe what this quiz is about..."
                    value={quizDescription}
                    onChange={(e) => setQuizDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {quizCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Difficulty</Label>
                    <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Time Limit (minutes)</Label>
                    <Input
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
                      min="5"
                      max="60"
                    />
                  </div>

                  <div>
                    <Label>Prize Pool (NGN)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 50000"
                      value={prizePool}
                      onChange={(e) => setPrizePool(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Questions ({questions.length})</h3>
                <Button onClick={addQuestion} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-4">
                {questions.map((question, qIndex) => (
                  <Card key={question.id}>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm">Question {qIndex + 1}</h4>
                        {questions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuestion(question.id)}
                            className="h-8 w-8 shrink-0"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>

                      <div>
                        <Label>Question Text *</Label>
                        <Textarea
                          placeholder="Enter your question..."
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label className="mb-2 block">Answer Options *</Label>
                        <RadioGroup
                          value={question.correctAnswer.toString()}
                          onValueChange={(v) => updateQuestion(question.id, "correctAnswer", parseInt(v))}
                        >
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2">
                                <RadioGroupItem value={oIndex.toString()} id={`${question.id}-${oIndex}`} />
                                <Input
                                  placeholder={`Option ${oIndex + 1}`}
                                  value={option}
                                  onChange={(e) => updateOption(question.id, oIndex, e.target.value)}
                                  className="flex-1"
                                />
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                        <p className="text-xs text-muted-foreground mt-2">
                          Select the radio button next to the correct answer
                        </p>
                      </div>

                      <div>
                        <Label>Points</Label>
                        <Input
                          type="number"
                          value={question.points}
                          onChange={(e) => updateQuestion(question.id, "points", parseInt(e.target.value))}
                          min="1"
                          className="w-24"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-background sticky bottom-0">
          <div className="flex gap-2">
            <Button onClick={handleSaveDraft} variant="outline" className="flex-1">
              Save Draft
            </Button>
            <Button onClick={handlePublish} className="flex-1">
              <Award className="h-4 w-4 mr-2" />
              Publish Quiz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
