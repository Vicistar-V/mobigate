import { useState } from "react";
import { X, Trophy, Clock, Users, Play, Book, Inbox, Wallet, Globe, BarChart3, Flame, Zap, Target, TrendingUp, Star, Medal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  activeMobigateQuizzes, 
  mobigateLeaderboard, 
  mobigatePlayerStats, 
  mobigateWalletData,
  mobigateQuizRules,
  isMobigateQuizAvailable,
  getDifficultyColor,
  MobigateQuiz
} from "@/data/mobigateQuizData";
import { MobigateQuizPlayDialog } from "./MobigateQuizPlayDialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface MobigateQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobigateQuizDialog({ open, onOpenChange }: MobigateQuizDialogProps) {
  const [activeTab, setActiveTab] = useState("quizzes");
  const [selectedQuiz, setSelectedQuiz] = useState<MobigateQuiz | null>(null);
  const [showGamePlay, setShowGamePlay] = useState(false);
  const { toast } = useToast();

  const playerWalletBalance = mobigateWalletData.balance;

  const handleStartQuiz = (quiz: MobigateQuiz) => {
    const availability = isMobigateQuizAvailable(quiz);
    
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
      title: result.amountWon > 0 ? "🔥 Amazing Win!" : "Game Over",
      description: result.amountWon > 0 
        ? `You won NGN ${result.amountWon.toLocaleString()} on Mobigate!` 
        : "Better luck next time!",
    });
    setShowGamePlay(false);
    setSelectedQuiz(null);
  };

  const trendingQuizzes = activeMobigateQuizzes.filter(q => q.status === "trending");
  const availableQuizzes = activeMobigateQuizzes.filter(q => q.status === "active");
  const upcomingQuizzes = activeMobigateQuizzes.filter(q => q.status === "upcoming");

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
          {/* Amber-themed Header */}
          <DialogHeader className="p-4 pb-3 sticky top-0 bg-gradient-to-r from-amber-500 to-orange-500 z-10 border-b text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                    Mobigate Quiz <Flame className="h-4 w-4" />
                  </DialogTitle>
                  <p className="text-xs text-amber-100">Global competition, massive prizes!</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-4 pt-3 bg-amber-50 dark:bg-amber-950/20">
              <TabsList className="w-full grid grid-cols-4 h-auto bg-amber-100 dark:bg-amber-900/30">
                <TabsTrigger value="quizzes" className="text-xs py-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">Quizzes</TabsTrigger>
                <TabsTrigger value="leaderboard" className="text-xs py-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">Global</TabsTrigger>
                <TabsTrigger value="stats" className="text-xs py-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">My Stats</TabsTrigger>
                <TabsTrigger value="rules" className="text-xs py-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">Rules</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 max-h-[calc(95vh-160px)]">
              <div className="p-4">
                {/* Quizzes Tab */}
                <TabsContent value="quizzes" className="mt-0 space-y-4">
                  {/* Wallet & Stats Card */}
                  <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-amber-600" />
                          <span className="text-sm text-amber-700 dark:text-amber-300">Your Wallet</span>
                        </div>
                        <span className="font-bold text-amber-700 dark:text-amber-300">NGN {playerWalletBalance.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-amber-200 dark:border-amber-700">
                        <div className="text-center">
                          <p className="text-[10px] text-amber-600">Global Rank</p>
                          <p className="font-bold text-sm text-amber-700">#{mobigatePlayerStats.globalRank}</p>
                        </div>
                        <div className="text-center border-x border-amber-200 dark:border-amber-700">
                          <p className="text-[10px] text-amber-600">Win Streak</p>
                          <p className="font-bold text-sm text-amber-700 flex items-center justify-center gap-1">
                            {mobigatePlayerStats.currentStreak} <Flame className="h-3 w-3 text-orange-500" />
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-amber-600">Net Profit</p>
                          <p className="font-bold text-sm text-green-600">+₦{mobigatePlayerStats.netProfit.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trending Quizzes */}
                  {trendingQuizzes.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-amber-600 uppercase flex items-center gap-2">
                        <Flame className="h-3 w-3" /> Trending Now
                      </h3>
                      {trendingQuizzes.map((quiz) => {
                        const availability = isMobigateQuizAvailable(quiz);
                        return (
                          <Card key={quiz.id} className="overflow-hidden border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h3 className="font-bold text-sm">{quiz.title}</h3>
                                    <Badge className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 border-0">
                                      <Flame className="h-2.5 w-2.5 mr-1" /> TRENDING
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{quiz.description}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className={cn("text-[10px]", getDifficultyColor(quiz.difficulty))}>
                                  {quiz.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-600 border-amber-300">
                                  {quiz.category}
                                </Badge>
                                <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-600 border-purple-300">
                                  <Users className="h-2.5 w-2.5 mr-1" />{quiz.participants.toLocaleString()} playing
                                </Badge>
                              </div>

                              {quiz.prizePool && (
                                <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg text-center border border-amber-200">
                                  <p className="text-[10px] text-amber-600">🏆 Prize Pool</p>
                                  <p className="font-bold text-lg text-amber-700">{quiz.currency} {quiz.prizePool.toLocaleString()}</p>
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-white dark:bg-background rounded-lg text-center border border-red-200 dark:border-red-800">
                                  <p className="text-[10px] text-muted-foreground">Stake</p>
                                  <p className="font-bold text-sm text-red-600">{quiz.currency} {quiz.stakeAmount.toLocaleString()}</p>
                                </div>
                                <div className="p-2 bg-white dark:bg-background rounded-lg text-center border border-green-200 dark:border-green-800">
                                  <p className="text-[10px] text-muted-foreground">Win Up To</p>
                                  <p className="font-bold text-sm text-green-600">{quiz.currency} {quiz.winningAmount.toLocaleString()}</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />{quiz.timeLimitPerQuestion}s/question
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />{quiz.gamesPlayed.toLocaleString()} games played
                                </span>
                              </div>

                              <Button 
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white" 
                                size="sm"
                                onClick={() => handleStartQuiz(quiz)}
                                disabled={!availability.available || playerWalletBalance < quiz.stakeAmount}
                              >
                                <Zap className="h-4 w-4 mr-2" />
                                {playerWalletBalance < quiz.stakeAmount ? "Insufficient Balance" : "Play Now"}
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  {/* Active Quizzes */}
                  {availableQuizzes.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-amber-600 uppercase flex items-center gap-2">
                        <Play className="h-3 w-3" /> Available Now
                      </h3>
                      {availableQuizzes.map((quiz) => {
                        const availability = isMobigateQuizAvailable(quiz);
                        return (
                          <Card key={quiz.id} className="overflow-hidden border-amber-200 dark:border-amber-800 hover:border-amber-400 transition-colors">
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-lg">{quiz.badge}</span>
                                    <h3 className="font-semibold text-sm">{quiz.title}</h3>
                                    {quiz.isSponsored && (
                                      <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-600 border-purple-300">
                                        Sponsored
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{quiz.description}</p>
                                </div>
                                <Globe className="h-4 w-4 text-amber-500 shrink-0" />
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className={cn("text-[10px]", getDifficultyColor(quiz.difficulty))}>
                                  {quiz.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-600 border-amber-300">
                                  {quiz.category}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg text-center border border-red-200 dark:border-red-800">
                                  <p className="text-[10px] text-muted-foreground">Stake</p>
                                  <p className="font-bold text-sm text-red-600">{quiz.currency} {quiz.stakeAmount.toLocaleString()}</p>
                                </div>
                                <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg text-center border border-green-200 dark:border-green-800">
                                  <p className="text-[10px] text-muted-foreground">Win Up To</p>
                                  <p className="font-bold text-sm text-green-600">{quiz.currency} {quiz.winningAmount.toLocaleString()}</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />{quiz.timeLimitPerQuestion}s/question
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />{quiz.participants.toLocaleString()} players
                                </span>
                              </div>

                              <Button 
                                className="w-full bg-amber-500 hover:bg-amber-600" 
                                size="sm"
                                onClick={() => handleStartQuiz(quiz)}
                                disabled={!availability.available || playerWalletBalance < quiz.stakeAmount}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                {playerWalletBalance < quiz.stakeAmount ? "Insufficient Balance" : "Play Now"}
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  {/* Upcoming Quizzes */}
                  {upcomingQuizzes.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-semibold text-amber-600 uppercase flex items-center gap-2">
                        <Clock className="h-3 w-3" /> Coming Soon
                      </h3>
                      {upcomingQuizzes.map((quiz) => (
                        <Card key={quiz.id} className="opacity-80 border-dashed border-amber-300">
                          <CardContent className="p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{quiz.badge}</span>
                              <h3 className="font-semibold text-sm">{quiz.title}</h3>
                              <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700">Upcoming</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{quiz.description}</p>
                            {quiz.prizePool && (
                              <p className="text-xs text-amber-600 font-semibold">🏆 Prize Pool: {quiz.currency} {quiz.prizePool.toLocaleString()}</p>
                            )}
                            <Button variant="outline" size="sm" className="w-full border-amber-300 text-amber-600" disabled>
                              <Clock className="h-4 w-4 mr-2" />
                              Starts {quiz.startDate ? new Date(quiz.startDate).toLocaleDateString() : "Soon"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Global Leaderboard Tab */}
                <TabsContent value="leaderboard" className="mt-0 space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="h-5 w-5 text-amber-600" />
                    <h3 className="font-semibold text-amber-700 dark:text-amber-300">Global Champions</h3>
                  </div>
                  {mobigateLeaderboard.map((entry) => (
                    <div key={entry.id} className={cn(
                      "flex items-center gap-3 p-3 rounded-lg",
                      entry.rank === 1 && "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-2 border-yellow-300",
                      entry.rank === 2 && "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30 border border-gray-200",
                      entry.rank === 3 && "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200",
                      entry.rank > 3 && "bg-amber-50/50 dark:bg-amber-950/20"
                    )}>
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                        entry.rank === 1 && "bg-gradient-to-br from-yellow-400 to-amber-500 text-yellow-950",
                        entry.rank === 2 && "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700",
                        entry.rank === 3 && "bg-gradient-to-br from-amber-500 to-orange-600 text-amber-950",
                        entry.rank > 3 && "bg-amber-200 text-amber-700"
                      )}>
                        {entry.rank}
                      </div>
                      <Avatar className="h-10 w-10 border-2 border-amber-200">
                        <AvatarImage src={entry.playerAvatar} />
                        <AvatarFallback className="bg-amber-100 text-amber-700">{entry.playerName.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{entry.playerName}</p>
                          <span className="text-sm">{entry.countryFlag}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{entry.questionsCorrect}/10 • {entry.completionTime}</p>
                        {entry.streak && entry.streak > 0 && (
                          <p className="text-[10px] text-amber-600 flex items-center gap-1">
                            <Flame className="h-2.5 w-2.5" /> {entry.streak} win streak
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-600 text-sm">₦{entry.amountWon.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">{entry.winningPercentage}% win</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* Statistics Tab */}
                <TabsContent value="stats" className="mt-0 space-y-4">
                  {/* Your Stats */}
                  <Card className="border-amber-200 dark:border-amber-800">
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2 text-amber-700 dark:text-amber-300">
                        <BarChart3 className="h-4 w-4" />Your Mobigate Quiz Stats
                      </h3>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
                          <p className="font-bold text-lg text-amber-700">{mobigatePlayerStats.gamesPlayed}</p>
                          <p className="text-[10px] text-muted-foreground">Played</p>
                        </div>
                        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
                          <p className="font-bold text-lg text-green-600">{mobigatePlayerStats.gamesWon}</p>
                          <p className="text-[10px] text-muted-foreground">Won</p>
                        </div>
                        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
                          <p className="font-bold text-lg text-orange-600">{mobigatePlayerStats.partialWins}</p>
                          <p className="text-[10px] text-muted-foreground">Partial</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Globe className="h-4 w-4 text-amber-600" />
                            <span className="text-xs text-muted-foreground">Global Rank</span>
                          </div>
                          <p className="font-bold text-lg text-amber-700">#{mobigatePlayerStats.globalRank}</p>
                        </div>
                        <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Flame className="h-4 w-4 text-orange-600" />
                            <span className="text-xs text-muted-foreground">Best Streak</span>
                          </div>
                          <p className="font-bold text-lg text-orange-700">{mobigatePlayerStats.longestStreak} wins</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="h-4 w-4 text-purple-600" />
                            <span className="text-xs text-muted-foreground">Favorite</span>
                          </div>
                          <p className="font-bold text-sm text-purple-700">{mobigatePlayerStats.favoriteCategory}</p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Medal className="h-4 w-4 text-blue-600" />
                            <span className="text-xs text-muted-foreground">Best Score</span>
                          </div>
                          <p className="font-bold text-lg text-blue-700">{mobigatePlayerStats.bestScore}/10</p>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm p-3 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/50 dark:to-orange-900/30 rounded-lg border border-amber-200">
                        <span className="text-amber-700">Net Profit</span>
                        <span className={cn("font-bold", mobigatePlayerStats.netProfit >= 0 ? "text-green-600" : "text-destructive")}>
                          {mobigatePlayerStats.netProfit >= 0 ? "+" : ""}₦{mobigatePlayerStats.netProfit.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Earnings Summary */}
                  <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2 text-amber-700">
                        <TrendingUp className="h-4 w-4" />Earnings Summary
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-white dark:bg-background rounded-lg border border-green-200">
                          <p className="text-xs text-muted-foreground">Total Won</p>
                          <p className="font-bold text-lg text-green-600">₦{mobigatePlayerStats.totalAmountWon.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-background rounded-lg border border-red-200">
                          <p className="text-xs text-muted-foreground">Total Staked</p>
                          <p className="font-bold text-lg text-red-600">₦{mobigatePlayerStats.totalStakePaid.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Rules Tab */}
                <TabsContent value="rules" className="mt-0">
                  <Card className="border-amber-200 dark:border-amber-800">
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2 text-amber-700">
                        <Book className="h-4 w-4" />Mobigate Quiz Rules
                      </h3>
                      <ul className="space-y-2">
                        {mobigateQuizRules.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[10px] shrink-0">
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
      <MobigateQuizPlayDialog
        open={showGamePlay}
        onOpenChange={setShowGamePlay}
        quiz={selectedQuiz}
        playerWalletBalance={playerWalletBalance}
        onGameComplete={handleGameComplete}
      />
    </>
  );
}
