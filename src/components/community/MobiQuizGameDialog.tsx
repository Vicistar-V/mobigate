import { useState } from "react";
import { X, Trophy, Clock, Users, Play, Book, Award, Inbox, Wallet, Lock, Globe, BarChart3, History } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { activeQuizzes, leaderboard, quizRules, gameHistory, quizStatistics, playerQuizStats, communityQuizWallet, isQuizAvailable, Quiz } from "@/data/quizGameData";
import { QuizGamePlayDialog } from "./QuizGamePlayDialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface MobiQuizGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobiQuizGameDialog({ open, onOpenChange }: MobiQuizGameDialogProps) {
  const [activeTab, setActiveTab] = useState("quizzes");
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showGamePlay, setShowGamePlay] = useState(false);
  const { toast } = useToast();

  // Mock wallet balance
  const playerWalletBalance = 15000;

  const handleStartQuiz = (quiz: Quiz) => {
    const availability = isQuizAvailable(quiz, communityQuizWallet.balance);
    
    if (!availability.available) {
      toast({
        title: "Quiz Unavailable",
        description: availability.reason,
        variant: "destructive"
      });
      return;
    }

    if (playerWalletBalance < quiz.stakeAmount) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${quiz.currency} ${quiz.stakeAmount.toLocaleString()} to play.`,
        variant: "destructive"
      });
      return;
    }

    setSelectedQuiz(quiz);
    setShowGamePlay(true);
  };

  const handleGameComplete = (result: { questionsCorrect: number; winningPercentage: number; amountWon: number; stakePaid: number }) => {
    toast({
      title: result.amountWon > 0 ? "Congratulations!" : "Game Over",
      description: result.amountWon > 0 
        ? `You won NGN ${result.amountWon.toLocaleString()}!` 
        : "Better luck next time!",
    });
    setShowGamePlay(false);
    setSelectedQuiz(null);
  };

  const availableQuizzes = activeQuizzes.filter(q => q.status === "active");
  const upcomingQuizzes = activeQuizzes.filter(q => q.status === "upcoming");

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
          <DialogHeader className="p-4 pb-3 sticky top-0 bg-background z-10 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-primary" />
                <div>
                  <DialogTitle className="text-lg font-bold">Mobi-Quiz Game</DialogTitle>
                  <p className="text-xs text-muted-foreground">Win prizes by answering questions!</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-4 pt-2">
              <TabsList className="w-full grid grid-cols-4 h-auto">
                <TabsTrigger value="quizzes" className="text-xs py-2">Quizzes</TabsTrigger>
                <TabsTrigger value="leaderboard" className="text-xs py-2">Leaders</TabsTrigger>
                <TabsTrigger value="stats" className="text-xs py-2">Stats</TabsTrigger>
                <TabsTrigger value="rules" className="text-xs py-2">Rules</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 max-h-[calc(95vh-140px)]">
              <div className="p-4">
                {/* Quizzes Tab */}
                <TabsContent value="quizzes" className="mt-0 space-y-4">
                  {/* Wallet Balance Card */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-primary" />
                        <span className="text-sm">Your Wallet</span>
                      </div>
                      <span className="font-bold">NGN {playerWalletBalance.toLocaleString()}</span>
                    </CardContent>
                  </Card>

                  {availableQuizzes.length === 0 && upcomingQuizzes.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="font-semibold">No Quizzes Available</h3>
                        <p className="text-sm text-muted-foreground">Check back soon!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {availableQuizzes.map((quiz) => {
                        const availability = isQuizAvailable(quiz, communityQuizWallet.balance);
                        return (
                          <Card key={quiz.id} className="overflow-hidden">
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h3 className="font-semibold text-sm">{quiz.title}</h3>
                                    <Badge variant="default" className="text-[10px]">Active</Badge>
                                    <Badge variant="outline" className="text-[10px]">{quiz.difficulty}</Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{quiz.description}</p>
                                </div>
                                {quiz.privacySetting === "members_only" ? (
                                  <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                                ) : (
                                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-destructive/10 rounded-lg text-center">
                                  <p className="text-[10px] text-muted-foreground">Stake</p>
                                  <p className="font-bold text-sm text-destructive">{quiz.currency} {quiz.stakeAmount.toLocaleString()}</p>
                                </div>
                                <div className="p-2 bg-green-500/10 rounded-lg text-center">
                                  <p className="text-[10px] text-muted-foreground">Win Up To</p>
                                  <p className="font-bold text-sm text-green-600">{quiz.currency} {quiz.winningAmount.toLocaleString()}</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />{quiz.timeLimitPerQuestion}s/question
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />{quiz.participants} players
                                </span>
                              </div>

                              <Button 
                                className="w-full" 
                                size="sm"
                                onClick={() => handleStartQuiz(quiz)}
                                disabled={!availability.available || playerWalletBalance < quiz.stakeAmount}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                {playerWalletBalance < quiz.stakeAmount ? "Insufficient Balance" : "Start Playing"}
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}

                      {upcomingQuizzes.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <h3 className="text-xs font-semibold text-muted-foreground uppercase">Coming Soon</h3>
                          {upcomingQuizzes.map((quiz) => (
                            <Card key={quiz.id} className="opacity-75">
                              <CardContent className="p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-sm">{quiz.title}</h3>
                                  <Badge variant="secondary" className="text-[10px]">Upcoming</Badge>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Stake: {quiz.currency} {quiz.stakeAmount.toLocaleString()}</span>
                                  <span>Win: {quiz.currency} {quiz.winningAmount.toLocaleString()}</span>
                                </div>
                                <Button variant="outline" size="sm" className="w-full" disabled>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Starts {quiz.startDate ? new Date(quiz.startDate).toLocaleDateString() : "Soon"}
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                {/* Leaderboard Tab */}
                <TabsContent value="leaderboard" className="mt-0 space-y-3">
                  {leaderboard.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                        entry.rank === 1 && "bg-yellow-500 text-yellow-950",
                        entry.rank === 2 && "bg-gray-300 text-gray-700",
                        entry.rank === 3 && "bg-amber-600 text-amber-950",
                        entry.rank > 3 && "bg-muted text-muted-foreground"
                      )}>
                        {entry.rank}
                      </div>
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={entry.playerAvatar} />
                        <AvatarFallback>{entry.playerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{entry.playerName}</p>
                        <p className="text-xs text-muted-foreground">{entry.questionsCorrect}/10 • {entry.completionTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-sm">₦{entry.amountWon.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">{entry.winningPercentage}% win</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* Statistics Tab */}
                <TabsContent value="stats" className="mt-0 space-y-4">
                  {/* Your Stats */}
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />Your Stats
                      </h3>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-muted/50 rounded-lg">
                          <p className="font-bold text-lg">{playerQuizStats.gamesPlayed}</p>
                          <p className="text-[10px] text-muted-foreground">Played</p>
                        </div>
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <p className="font-bold text-lg text-green-600">{playerQuizStats.gamesWon}</p>
                          <p className="text-[10px] text-muted-foreground">Won</p>
                        </div>
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                          <p className="font-bold text-lg text-yellow-600">{playerQuizStats.partialWins}</p>
                          <p className="text-[10px] text-muted-foreground">Partial</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm p-2 bg-primary/5 rounded-lg">
                        <span>Net Profit</span>
                        <span className={cn("font-bold", playerQuizStats.netProfit >= 0 ? "text-green-600" : "text-destructive")}>
                          {playerQuizStats.netProfit >= 0 ? "+" : ""}₦{playerQuizStats.netProfit.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Games */}
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <History className="h-4 w-4" />Recent Games
                      </h3>
                      {gameHistory.map((game) => (
                        <div key={game.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">{game.quizTitle}</p>
                            <p className="text-xs text-muted-foreground">
                              {game.questionsCorrect}/10 • {new Date(game.playedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={game.status === "won" ? "default" : game.status === "partial_win" ? "secondary" : "destructive"}>
                            {game.status === "won" ? `+₦${game.amountWon.toLocaleString()}` : 
                             game.status === "partial_win" ? `+₦${game.amountWon.toLocaleString()}` : "Lost"}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Rules Tab */}
                <TabsContent value="rules" className="mt-0">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Book className="h-4 w-4" />Quiz Rules
                      </h3>
                      <ul className="space-y-2">
                        {quizRules.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary font-semibold text-[10px] shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-muted-foreground pt-0.5">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Quiz Gameplay Dialog */}
      <QuizGamePlayDialog
        open={showGamePlay}
        onOpenChange={setShowGamePlay}
        quiz={selectedQuiz}
        playerWalletBalance={playerWalletBalance}
        onGameComplete={handleGameComplete}
      />
    </>
  );
}
