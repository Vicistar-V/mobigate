import { useState } from "react";
import { X, Trophy, Clock, Users, Play, Book, Award, Inbox } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { activeQuizzes, leaderboard, quizRules } from "@/data/quizGameData";
import { useToast } from "@/hooks/use-toast";

interface MobiQuizGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobiQuizGameDialog({ open, onOpenChange }: MobiQuizGameDialogProps) {
  const [activeTab, setActiveTab] = useState("quizzes");
  const { toast } = useToast();

  const handleStartQuiz = (quizId: string) => {
    toast({
      title: "Starting Quiz",
      description: "Quiz game feature will be fully functional soon!",
    });
  };

  const availableQuizzes = activeQuizzes.filter(q => q.status === "active");
  const upcomingQuizzes = activeQuizzes.filter(q => q.status === "upcoming");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Mobi-Quiz Game
            </DialogTitle>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-4 sm:px-6">
            <TabsList className="w-full grid grid-cols-3 h-auto">
              <TabsTrigger value="quizzes" className="text-xs sm:text-sm py-2">
                Active Quizzes
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="text-xs sm:text-sm py-2">
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="rules" className="text-xs sm:text-sm py-2">
                Rules
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-full max-h-[calc(90vh-12rem)]">
            <div className="p-4 sm:p-6">
              <TabsContent value="quizzes" className="mt-0 space-y-4">
                {activeQuizzes.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 sm:p-12">
                      <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-muted flex items-center justify-center">
                          <Inbox className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg sm:text-xl">No Quizzes Available</h3>
                          <p className="text-sm text-muted-foreground max-w-sm">
                            There are currently no quiz games available. Check back soon for exciting new challenges!
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {availableQuizzes.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Active Now
                        </h3>
                        {availableQuizzes.map((quiz) => (
                          <Card key={quiz.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-4 sm:p-6">
                              <div className="space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h3 className="font-semibold text-base sm:text-lg">{quiz.title}</h3>
                                      <Badge variant="default">Active</Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {quiz.difficulty}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{quiz.description}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Trophy className="h-4 w-4 text-primary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Prize Pool</p>
                                      <p className="font-semibold">{quiz.currency} {quiz.prizePool.toLocaleString()}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 text-sm">
                                    <Book className="h-4 w-4 text-primary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Questions</p>
                                      <p className="font-semibold">{quiz.totalQuestions}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Time Limit</p>
                                      <p className="font-semibold">{quiz.timeLimit} mins</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-primary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Participants</p>
                                      <p className="font-semibold">{quiz.participants}</p>
                                    </div>
                                  </div>
                                </div>

                                <Button 
                                  className="w-full sm:w-auto"
                                  onClick={() => handleStartQuiz(quiz.id)}
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Playing
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {upcomingQuizzes.length > 0 && (
                      <div className="space-y-4 mt-6">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Coming Soon
                        </h3>
                        {upcomingQuizzes.map((quiz) => (
                          <Card key={quiz.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-4 sm:p-6">
                              <div className="space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h3 className="font-semibold text-base sm:text-lg">{quiz.title}</h3>
                                      <Badge variant="secondary">Upcoming</Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {quiz.difficulty}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{quiz.description}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Trophy className="h-4 w-4 text-primary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Prize Pool</p>
                                      <p className="font-semibold">{quiz.currency} {quiz.prizePool.toLocaleString()}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 text-sm">
                                    <Book className="h-4 w-4 text-primary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Questions</p>
                                      <p className="font-semibold">{quiz.totalQuestions}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Time Limit</p>
                                      <p className="font-semibold">{quiz.timeLimit} mins</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-primary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Participants</p>
                                      <p className="font-semibold">{quiz.participants}</p>
                                    </div>
                                  </div>
                                </div>

                                <Button 
                                  className="w-full sm:w-auto"
                                  variant="outline"
                                  disabled
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  Starts {quiz.startDate ? new Date(quiz.startDate).toLocaleDateString() : "Soon"}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {availableQuizzes.length === 0 && upcomingQuizzes.length > 0 && (
                      <Card className="border-dashed">
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center justify-center text-center space-y-3">
                            <Clock className="h-8 w-8 text-muted-foreground" />
                            <div className="space-y-1">
                              <p className="font-medium">No Active Quizzes Right Now</p>
                              <p className="text-sm text-muted-foreground">
                                Check the upcoming quizzes below!
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="leaderboard" className="mt-0 space-y-4">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    {leaderboard.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-muted flex items-center justify-center">
                          <Award className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg sm:text-xl">No Scores Yet</h3>
                          <p className="text-sm text-muted-foreground max-w-sm">
                            The leaderboard is empty. Be the first to play and top the charts!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Award className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">Top Players</h3>
                        </div>

                        <div className="space-y-3">
                          {leaderboard.map((entry) => (
                            <div 
                              key={entry.id}
                              className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 font-bold text-primary text-sm">
                                {entry.rank}
                              </div>

                              <Avatar className="h-10 w-10">
                                <AvatarImage src={entry.playerAvatar} alt={entry.playerName} />
                                <AvatarFallback>{entry.playerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{entry.playerName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Time: {entry.completionTime}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="font-bold text-primary">{entry.score}</p>
                                <p className="text-xs text-muted-foreground">points</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rules" className="mt-0">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Book className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">Quiz Rules & Guidelines</h3>
                      </div>

                      <ul className="space-y-3">
                        {quizRules.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-xs flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-muted-foreground pt-0.5">{rule}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Note:</strong> All quiz results are final and 
                          disputes must be raised within 48 hours of result publication. 
                          Fair play is expected from all participants.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
