import { useState } from "react";
import { X, Award, AlertCircle, Lock, Globe, Upload, Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { quizCategories, ANSWER_LABELS } from "@/data/quizGameData";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface QuizCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[]; // 8 options (A-H)
  correctAnswer: number; // 0-7
  correctAnswerLabel: string; // A-H
  timeLimit: number; // seconds per question
  points: number;
  questionImage?: string; // Optional image for the question
}

const createEmptyQuestion = (index: number): QuizQuestion => ({
  id: `q${index}`,
  question: "",
  options: ["", "", "", "", "", "", "", ""], // 8 empty options
  correctAnswer: 0,
  correctAnswerLabel: "A",
  timeLimit: 30,
  points: 10,
  questionImage: undefined
});

// Initialize with exactly 10 questions
const initialQuestions: QuizQuestion[] = Array.from({ length: 10 }, (_, i) => createEmptyQuestion(i + 1));

export function QuizCreationDialog({ open, onOpenChange }: QuizCreationDialogProps) {
  const { toast } = useToast();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [timeLimitPerQuestion, setTimeLimitPerQuestion] = useState("30");
  const [stakeAmount, setStakeAmount] = useState("");
  const [winningAmount, setWinningAmount] = useState("");
  const [privacySetting, setPrivacySetting] = useState<"members_only" | "public">("members_only");
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Quiz cover image state
  const [coverImage, setCoverImage] = useState<string>("");

  const currentQuestion = questions[currentQuestionIndex];

  const updateQuestion = (field: keyof QuizQuestion, value: any) => {
    setQuestions(questions.map((q, idx) => 
      idx === currentQuestionIndex ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (optionIndex: number, value: string) => {
    setQuestions(questions.map((q, idx) => {
      if (idx === currentQuestionIndex) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const setCorrectAnswer = (answerIndex: number) => {
    setQuestions(questions.map((q, idx) => 
      idx === currentQuestionIndex 
        ? { ...q, correctAnswer: answerIndex, correctAnswerLabel: ANSWER_LABELS[answerIndex] }
        : q
    ));
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid file", description: "Please upload an image file", variant: "destructive" });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: "Image must be under 10MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuestionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid file", description: "Please upload an image file", variant: "destructive" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Image must be under 5MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateQuestion("questionImage", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeQuestionImage = () => {
    updateQuestion("questionImage", undefined);
  };

  const isQuestionComplete = (q: QuizQuestion): boolean => {
    return q.question.trim() !== "" && 
           q.options.every(opt => opt.trim() !== "");
  };

  const completedQuestionsCount = questions.filter(isQuestionComplete).length;
  const allQuestionsComplete = completedQuestionsCount === 10;

  const validateQuiz = (): boolean => {
    if (!quizTitle.trim()) {
      toast({ title: "Missing Title", description: "Please enter a quiz title", variant: "destructive" });
      return false;
    }
    if (!category) {
      toast({ title: "Missing Category", description: "Please select a category", variant: "destructive" });
      return false;
    }
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({ title: "Invalid Stake", description: "Please enter a valid stake amount", variant: "destructive" });
      return false;
    }
    if (!winningAmount || parseFloat(winningAmount) <= 0) {
      toast({ title: "Invalid Winning Amount", description: "Please enter a valid winning amount", variant: "destructive" });
      return false;
    }
    if (!allQuestionsComplete) {
      toast({ 
        title: "Incomplete Questions", 
        description: `Only ${completedQuestionsCount}/10 questions are complete. All 10 questions with 8 options are required.`, 
        variant: "destructive" 
      });
      return false;
    }
    return true;
  };

  const handlePublish = () => {
    if (!validateQuiz()) return;

    toast({
      title: "Quiz Published!",
      description: `"${quizTitle}" is now live for ${privacySetting === "public" ? "everyone" : "members only"} to play`,
    });
    onOpenChange(false);
    resetForm();
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your quiz has been saved as a draft",
    });
  };

  const resetForm = () => {
    setQuizTitle("");
    setQuizDescription("");
    setCategory("");
    setDifficulty("Medium");
    setTimeLimitPerQuestion("30");
    setStakeAmount("");
    setWinningAmount("");
    setPrivacySetting("members_only");
    setQuestions(initialQuestions);
    setCurrentQuestionIndex(0);
    setCoverImage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
        <DialogHeader className="p-4 pb-3 sticky top-0 bg-background z-10 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">Create Quiz Game</DialogTitle>
                <p className="text-xs text-muted-foreground">10 Questions • 8 Options (A-H)</p>
              </div>
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

        <ScrollArea className="flex-1 max-h-[calc(95vh-180px)]">
          <div className="p-4 space-y-5">
            {/* Quiz Details Section */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-sm">Quiz Details</h3>
                
                <div>
                  <Label className="text-xs">Quiz Title *</Label>
                  <Input
                    placeholder="e.g., Community Heritage Quiz"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    placeholder="Describe what this quiz is about..."
                    value={quizDescription}
                    onChange={(e) => setQuizDescription(e.target.value)}
                    rows={2}
                    className="mt-1"
                  />
                </div>

                {/* Quiz Cover Image */}
                <div>
                  <Label className="text-xs">Quiz Cover Image (Optional)</Label>
                  {coverImage ? (
                    <div className="relative mt-1 aspect-video rounded-lg overflow-hidden bg-muted">
                      <img src={coverImage} alt="Quiz cover" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setCoverImage("")}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-24 mt-1 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/30">
                      <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Upload cover image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {quizCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Difficulty</Label>
                    <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
                      <SelectTrigger className="mt-1">
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
              </CardContent>
            </Card>

            {/* Stake & Winning Section */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-sm">Stake & Winning Amounts</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Stake Amount (NGN) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 500"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      min="0"
                      className="mt-1"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Amount charged to play</p>
                  </div>

                  <div>
                    <Label className="text-xs">Winning Amount (NGN) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 5000"
                      value={winningAmount}
                      onChange={(e) => setWinningAmount(e.target.value)}
                      min="0"
                      className="mt-1"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Amount for 10/10 correct</p>
                  </div>
                </div>

                <div className="p-3 bg-background rounded-lg text-xs space-y-1">
                  <p className="font-medium">Stake Distribution:</p>
                  <p className="text-muted-foreground">• 70% to Community Wallet</p>
                  <p className="text-muted-foreground">• 30% to Mobigate</p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Time Settings */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-sm">Settings</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Time per Question (seconds)</Label>
                    <Input
                      type="number"
                      value={timeLimitPerQuestion}
                      onChange={(e) => setTimeLimitPerQuestion(e.target.value)}
                      min="10"
                      max="120"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Privacy Setting *</Label>
                    <Select value={privacySetting} onValueChange={(v: any) => setPrivacySetting(v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="members_only">
                          <span className="flex items-center gap-2">
                            <Lock className="h-3 w-3" />
                            Members Only
                          </span>
                        </SelectItem>
                        <SelectItem value="public">
                          <span className="flex items-center gap-2">
                            <Globe className="h-3 w-3" />
                            Public
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions Section */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Questions</h3>
                  <Badge variant={allQuestionsComplete ? "default" : "secondary"}>
                    {completedQuestionsCount}/10 Complete
                  </Badge>
                </div>

                {/* Question Navigation */}
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={cn(
                        "h-10 rounded-lg text-xs font-medium transition-all",
                        "border-2",
                        idx === currentQuestionIndex && "border-primary bg-primary/10",
                        idx !== currentQuestionIndex && isQuestionComplete(q) && "border-green-500 bg-green-500/10 text-green-600",
                        idx !== currentQuestionIndex && !isQuestionComplete(q) && "border-border bg-muted/50"
                      )}
                    >
                      Q{idx + 1}
                    </button>
                  ))}
                </div>

                {/* Current Question Editor */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Question {currentQuestionIndex + 1}</Label>
                    {!isQuestionComplete(currentQuestion) && (
                      <span className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        Incomplete
                      </span>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs">Question Text *</Label>
                    <Textarea
                      placeholder="Enter your question..."
                      value={currentQuestion.question}
                      onChange={(e) => updateQuestion("question", e.target.value)}
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  {/* Question Image (Optional) */}
                  <div>
                    <Label className="text-xs">Question Image (Optional)</Label>
                    {currentQuestion.questionImage ? (
                      <div className="relative mt-1 aspect-video rounded-lg overflow-hidden bg-muted">
                        <img src={currentQuestion.questionImage} alt="Question" className="w-full h-full object-cover" />
                        <button
                          onClick={removeQuestionImage}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 h-16 mt-1 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/30">
                        <Image className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Add image for this question</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleQuestionImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* 8 Answer Options */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs">Answer Options (A-H) *</Label>
                      <span className="text-xs text-muted-foreground">
                        Correct: <span className="font-bold text-primary">{currentQuestion.correctAnswerLabel}</span>
                      </span>
                    </div>
                    
                    <RadioGroup
                      value={currentQuestion.correctAnswer.toString()}
                      onValueChange={(v) => setCorrectAnswer(parseInt(v))}
                      className="space-y-2"
                    >
                      {currentQuestion.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <RadioGroupItem 
                            value={oIndex.toString()} 
                            id={`${currentQuestion.id}-opt-${oIndex}`}
                            className="shrink-0"
                          />
                          <span className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                            currentQuestion.correctAnswer === oIndex 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          )}>
                            {ANSWER_LABELS[oIndex]}
                          </span>
                          <Input
                            placeholder={`Option ${ANSWER_LABELS[oIndex]}`}
                            value={option}
                            onChange={(e) => updateOption(oIndex, e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </RadioGroup>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Select the radio button next to the correct answer
                    </p>
                  </div>

                  {/* Question Navigation Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                      disabled={currentQuestionIndex === 0}
                      className="flex-1"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentQuestionIndex(Math.min(9, currentQuestionIndex + 1))}
                      disabled={currentQuestionIndex === 9}
                      className="flex-1"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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