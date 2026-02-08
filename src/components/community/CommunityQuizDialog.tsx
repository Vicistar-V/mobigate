import { useState } from "react";
import { X, Trophy, Clock, Users, Play, Book, Award, Inbox, Wallet, Lock, BarChart3, History, Star, Crown, Shield, AlertTriangle, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  activeCommunityQuizzes, 
  communityQuizLeaderboard, 
  communityQuizPlayerStats, 
  communityQuizWalletData,
  communityQuizRules,
  isCommunityQuizAvailable,
  getQuizWalletAvailability,
  CommunityQuiz
} from "@/data/communityQuizData";
import { CommunityQuizPlayDialog } from "./CommunityQuizPlayDialog";
import { QuizWalletDrawer } from "./QuizWalletDrawer";
import { MemberPreviewDialog } from "@/components/community/MemberPreviewDialog";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatMobiAmount, formatLocalAmount, formatLocalFirst } from "@/lib/mobiCurrencyTranslation";

interface CommunityQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
  isOwner?: boolean;
}

export function CommunityQuizDialog({ open, onOpenChange, isAdmin = false, isOwner = false }: CommunityQuizDialogProps) {
  const [activeTab, setActiveTab] = useState("quizzes");
  const [selectedQuiz, setSelectedQuiz] = useState<CommunityQuiz | null>(null);
  const [showGamePlay, setShowGamePlay] = useState(false);
  const [showQuizWallet, setShowQuizWallet] = useState(false);
  const [showMemberPreview, setShowMemberPreview] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);
  const { toast } = useToast();

  const playerWalletBalance = 15000;
  const quizWalletAvailability = getQuizWalletAvailability();
  const quizWalletUnavailable = !quizWalletAvailability.available;

  const handleStartQuiz = (quiz: CommunityQuiz) => {
    const availability = isCommunityQuizAvailable(quiz);
    
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
        description: `You need at least ${formatLocalFirst(quiz.stakeAmount, "NGN")} to play.`,
        variant: "destructive"
      });
      return;
    }

    setSelectedQuiz(quiz);
    setShowGamePlay(true);
  };

  const handleGameComplete = (result: { questionsCorrect: number; winningPercentage: number; amountWon: number; stakePaid: number }) => {
    toast({
      title: result.amountWon > 0 ? "🎉 Congratulations!" : "Game Over",
      description: result.amountWon > 0 
        ? `You won ${formatLocalFirst(result.amountWon, "NGN")}! Paid from the Quiz Wallet.` 
        : "Better luck next time!",
    });
    setShowGamePlay(false);
    setSelectedQuiz(null);
  };

  const availableQuizzes = activeCommunityQuizzes.filter(q => q.status === "active");
  const upcomingQuizzes = activeCommunityQuizzes.filter(q => q.status === "upcoming");

  const handleOpenProfile = (name: string, avatar?: string) => {
    const member: ExecutiveMember = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      position: "Community Member",
      tenure: "Active",
      imageUrl: avatar || "/placeholder.svg",
      level: "officer",
      committee: "executive",
    };
    setSelectedMember(member);
    setShowMemberPreview(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[96vw] max-w-lg max-h-[92vh] p-0 gap-0 overflow-hidden">
          {/* Blue-themed Header */}
          <DialogHeader className="p-4 pb-3 sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 z-10 border-b text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-white">Community Quiz</DialogTitle>
                  <p className="text-xs text-blue-100">Win prizes & support your community!</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-4 pt-3 bg-blue-50 dark:bg-blue-950/20">
              <TabsList className="w-full grid grid-cols-4 h-auto bg-blue-100 dark:bg-blue-900/30">
                <TabsTrigger value="quizzes" className="text-xs py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Quizzes</TabsTrigger>
                <TabsTrigger value="leaderboard" className="text-xs py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Leaders</TabsTrigger>
                <TabsTrigger value="stats" className="text-xs py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">My Stats</TabsTrigger>
                <TabsTrigger value="rules" className="text-xs py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Rules</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 max-h-[calc(95vh-160px)]">
              <div className="px-3 py-4">
                {/* Quizzes Tab */}
                <TabsContent value="quizzes" className="mt-0 space-y-4">
                  {/* Unavailability Banner */}
                  {quizWalletUnavailable && (
                    <div className="flex items-start gap-2.5 p-3 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400 rounded-xl">
                      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                          Quiz Game Unavailable Right Now!
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                          Please try again later.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Player Wallet Card */}
                  <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-700 dark:text-blue-300">Your Player Wallet</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-blue-700 dark:text-blue-300">{formatLocalAmount(playerWalletBalance, "NGN")}</span>
                          <p className="text-xs text-blue-500">({formatMobiAmount(playerWalletBalance)})</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-500" />
                          <span className="text-xs text-blue-600 dark:text-blue-400">Community Rank</span>
                        </div>
                        <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300">
                          #{communityQuizPlayerStats.communityRank}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quiz Wallet Status Card */}
                  <Card className={cn(
                    "border-2",
                    quizWalletUnavailable
                      ? "border-amber-300 bg-amber-50/50 dark:bg-amber-950/20"
                      : "border-green-200 bg-green-50/50 dark:bg-green-950/20"
                  )}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wallet className={cn("h-4 w-4", quizWalletUnavailable ? "text-amber-600" : "text-green-600")} />
                          <span className={cn("text-sm font-medium", quizWalletUnavailable ? "text-amber-700 dark:text-amber-300" : "text-green-700 dark:text-green-300")}>
                            Quiz Wallet
                          </span>
                        </div>
                        <Badge variant={quizWalletUnavailable ? "destructive" : "outline"} className={cn(
                          "text-xs",
                          !quizWalletUnavailable && "bg-green-100 text-green-600 border-green-300"
                        )}>
                          {quizWalletUnavailable ? "Insufficient" : "Active"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Available Balance</p>
                          <p className={cn("font-bold text-sm", quizWalletUnavailable ? "text-amber-700" : "text-green-700")}>
                            {formatLocalAmount(communityQuizWalletData.availableBalance, "NGN")}
                          </p>
                          <p className="text-xs text-muted-foreground">({formatMobiAmount(communityQuizWalletData.availableBalance)})</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Reserved</p>
                          <p className="font-semibold text-sm text-amber-600">{formatLocalAmount(communityQuizWalletData.reservedForPayouts, "NGN")}</p>
                          <p className="text-xs text-muted-foreground">({formatMobiAmount(communityQuizWalletData.reservedForPayouts)})</p>
                        </div>
                      </div>
                      {(isAdmin || isOwner) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 text-xs h-8 border-blue-300 text-blue-700"
                          onClick={() => {
                            onOpenChange(false);
                            setTimeout(() => setShowQuizWallet(true), 150);
                          }}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Manage Quiz Wallet
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {availableQuizzes.length === 0 && upcomingQuizzes.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Inbox className="h-12 w-12 mx-auto text-blue-300 mb-3" />
                        <h3 className="font-semibold text-blue-700">No Community Quizzes Available</h3>
                        <p className="text-sm text-muted-foreground">Check back soon!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {availableQuizzes.map((quiz) => {
                        const availability = isCommunityQuizAvailable(quiz);
                        const isDisabledByWallet = quizWalletUnavailable;
                        const isDisabledByBalance = playerWalletBalance < quiz.stakeAmount;
                        const isDisabled = !availability.available || isDisabledByBalance || isDisabledByWallet;
                        return (
                          <Card key={quiz.id} className={cn(
                            "overflow-hidden border-blue-200 dark:border-blue-800 transition-colors",
                            isDisabledByWallet ? "opacity-70" : "hover:border-blue-400"
                          )}>
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-lg">{quiz.badge}</span>
                                    <h3 className="font-semibold text-sm">{quiz.title}</h3>
                                    <Badge className="text-xs bg-blue-600">Members Only</Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{quiz.description}</p>
                                </div>
                                <Lock className="h-4 w-4 text-blue-500 shrink-0" />
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className={cn(
                                  "text-xs",
                                  quiz.difficulty === "Easy" && "bg-green-50 text-green-600 border-green-300",
                                  quiz.difficulty === "Medium" && "bg-blue-50 text-blue-600 border-blue-300",
                                  quiz.difficulty === "Hard" && "bg-orange-50 text-orange-600 border-orange-300"
                                )}>
                                  {quiz.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-300">
                                  {quiz.category}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg text-center border border-red-200 dark:border-red-800">
                                  <p className="text-xs text-muted-foreground">Stake</p>
                                  <p className="font-bold text-sm text-red-600">{formatLocalAmount(quiz.stakeAmount, "NGN")}</p>
                                  <p className="text-xs text-muted-foreground">({formatMobiAmount(quiz.stakeAmount)})</p>
                                </div>
                                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center border border-blue-200 dark:border-blue-800">
                                  <p className="text-xs text-muted-foreground">Win Up To</p>
                                  <p className="font-bold text-sm text-blue-600">{formatLocalAmount(quiz.winningAmount, "NGN")}</p>
                                  <p className="text-xs text-muted-foreground">({formatMobiAmount(quiz.winningAmount)})</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />{quiz.timeLimitPerQuestion}s/question
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />{quiz.participants} members
                                </span>
                              </div>

                              <Button 
                                className={cn(
                                  "w-full",
                                  isDisabledByWallet ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"
                                )}
                                size="sm"
                                onClick={() => handleStartQuiz(quiz)}
                                disabled={isDisabled}
                              >
                                {isDisabledByWallet ? (
                                  <>
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Currently Unavailable
                                  </>
                                ) : isDisabledByBalance ? (
                                  "Insufficient Balance"
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" />
                                    Play Now
                                  </>
                                )}
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}

                      {upcomingQuizzes.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <h3 className="text-xs font-semibold text-blue-600 uppercase flex items-center gap-2">
                            <Clock className="h-3 w-3" /> Coming Soon
                          </h3>
                          {upcomingQuizzes.map((quiz) => (
                            <Card key={quiz.id} className="opacity-80 border-dashed border-blue-300">
                              <CardContent className="p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{quiz.badge}</span>
                                  <h3 className="font-semibold text-sm">{quiz.title}</h3>
                                  <Badge variant="secondary" className="text-xs">Upcoming</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{quiz.description}</p>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Stake: {formatLocalFirst(quiz.stakeAmount, "NGN")}</span>
                                  <span className="text-blue-600 font-semibold">Win: {formatLocalFirst(quiz.winningAmount, "NGN")}</span>
                                </div>
                                <Button variant="outline" size="sm" className="w-full border-blue-300 text-blue-600" disabled>
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
                <TabsContent value="leaderboard" className="mt-0 space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-700 dark:text-blue-300">Community Champions</h3>
                  </div>
                  {communityQuizLeaderboard.map((entry) => (
                    <div key={entry.id} className={cn(
                      "p-3 rounded-lg",
                      entry.rank === 1 && "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border border-yellow-200",
                      entry.rank === 2 && "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30 border border-gray-200",
                      entry.rank === 3 && "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200",
                      entry.rank > 3 && "bg-blue-50/50 dark:bg-blue-950/20 border border-transparent"
                    )}>
                      {/* Row 1: Rank + Avatar + Name */}
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                          entry.rank === 1 && "bg-yellow-500 text-yellow-950",
                          entry.rank === 2 && "bg-gray-300 text-gray-700",
                          entry.rank === 3 && "bg-amber-600 text-amber-950",
                          entry.rank > 3 && "bg-blue-200 text-blue-700"
                        )}>
                          {entry.rank}
                        </div>
                        <button
                          className="shrink-0 touch-manipulation active:scale-[0.95]"
                          onClick={() => handleOpenProfile(entry.playerName, entry.playerAvatar)}
                        >
                          <Avatar className="h-10 w-10 border-2 border-blue-200">
                            <AvatarImage src={entry.playerAvatar} />
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">{entry.playerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        </button>
                        <div className="flex-1 min-w-0">
                          <button
                            className="font-semibold text-sm truncate block w-full text-left touch-manipulation active:text-primary transition-colors"
                            onClick={() => handleOpenProfile(entry.playerName, entry.playerAvatar)}
                          >
                            {entry.playerName}
                          </button>
                        </div>
                      </div>

                      {/* Row 2: Metadata + Prize — restacked below */}
                      <div className="flex items-end justify-between mt-1.5 ml-[calc(1.75rem+0.625rem+2.5rem+0.625rem)]">
                        <div>
                          <p className="text-sm text-muted-foreground">{entry.questionsCorrect}/10 • {entry.completionTime}</p>
                          {entry.memberSince && (
                            <p className="text-sm text-blue-600 font-medium">Member since {entry.memberSince}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-bold text-blue-600 text-base">{formatLocalAmount(entry.amountWon, "NGN")}</p>
                          <p className="text-sm text-muted-foreground">({formatMobiAmount(entry.amountWon)})</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* Statistics Tab */}
                <TabsContent value="stats" className="mt-0 space-y-4">
                  <Card className="border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <BarChart3 className="h-4 w-4" />Your Community Quiz Stats
                      </h3>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
                          <p className="font-bold text-xl text-blue-700">{communityQuizPlayerStats.gamesPlayed}</p>
                          <p className="text-xs font-medium text-muted-foreground mt-0.5">Played</p>
                        </div>
                        <div className="p-2.5 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
                          <p className="font-bold text-xl text-green-600">{communityQuizPlayerStats.gamesWon}</p>
                          <p className="text-xs font-medium text-muted-foreground mt-0.5">Won</p>
                        </div>
                        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
                          <p className="font-bold text-xl text-amber-600">{communityQuizPlayerStats.partialWins}</p>
                          <p className="text-xs font-medium text-muted-foreground mt-0.5">Partial</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="h-4 w-4 text-blue-600" />
                            <span className="text-xs text-muted-foreground">Best Score</span>
                          </div>
                          <p className="font-bold text-lg text-blue-700">{communityQuizPlayerStats.bestScore}/10</p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span className="text-xs text-muted-foreground">Community Rank</span>
                          </div>
                          <p className="font-bold text-lg text-blue-700">#{communityQuizPlayerStats.communityRank}</p>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm p-3 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-950/50 dark:to-blue-900/30 rounded-lg border border-blue-200">
                        <span className="text-blue-700">Net Profit</span>
                        <span className={cn("font-bold", communityQuizPlayerStats.netProfit >= 0 ? "text-green-600" : "text-destructive")}>
                          {communityQuizPlayerStats.netProfit >= 0 ? "+" : ""}{formatLocalAmount(communityQuizPlayerStats.netProfit, "NGN")}
                          <span className="text-xs font-normal text-muted-foreground ml-1">({formatMobiAmount(communityQuizPlayerStats.netProfit)})</span>
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Community Contribution */}
                  <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2 text-blue-700">
                        <Award className="h-4 w-4" />Your Community Contribution
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Every quiz you play supports community development through stake contributions.
                      </p>
                      <div className="p-3 bg-white dark:bg-background rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Contributed</span>
                          <span className="font-bold text-blue-600">{formatLocalFirst(communityQuizPlayerStats.totalStakePaid * 0.7, "NGN")}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Rules Tab */}
                <TabsContent value="rules" className="mt-0">
                  <Card className="border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2 text-blue-700">
                        <Book className="h-4 w-4" />Community Quiz Rules
                      </h3>
                      <ul className="space-y-2">
                        {communityQuizRules.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs shrink-0">
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
      <CommunityQuizPlayDialog
        open={showGamePlay}
        onOpenChange={setShowGamePlay}
        quiz={selectedQuiz}
        playerWalletBalance={playerWalletBalance}
        onGameComplete={handleGameComplete}
      />

      {/* Quiz Wallet Management Drawer (Admin) */}
      <QuizWalletDrawer
        open={showQuizWallet}
        onOpenChange={setShowQuizWallet}
      />

      {/* Member Profile Preview */}
      <MemberPreviewDialog
        member={selectedMember}
        open={showMemberPreview}
        onOpenChange={setShowMemberPreview}
      />
    </>
  );
}
