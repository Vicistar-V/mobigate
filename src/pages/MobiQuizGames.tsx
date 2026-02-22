import { useState } from "react";
import { ArrowLeft, Trophy, Users, Zap, Play, TrendingUp, History, ChevronRight, Wallet, BadgeCheck, Gamepad2, Target } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MobigateQuizHub } from "@/components/community/mobigate-quiz/MobigateQuizHub";
import { mockMerchants, mockSeasons } from "@/data/mobigateInteractiveQuizData";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";

const approvedMerchants = mockMerchants.filter((m) => m.applicationStatus === "approved");

// Mock stats
const quizStats = {
  gamesPlayed: 47,
  gamesWon: 28,
  winRate: 59.6,
  totalEarnings: 182500,
  streak: 3,
};

export default function MobiQuizGames() {
  const [showQuizHub, setShowQuizHub] = useState(false);
  const navigate = useNavigate();

  const getMerchantActiveSeasons = (merchantId: string) =>
    mockSeasons.filter((s) => s.merchantId === merchantId && s.quizStatus === "active");

  const getBestSeason = (merchantId: string) => {
    const seasons = getMerchantActiveSeasons(merchantId);
    if (!seasons.length) return null;
    return seasons.reduce((best, s) => (s.totalWinningPrizes > best.totalWinningPrizes ? s : best), seasons[0]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <div className="sticky top-16 z-40 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="container px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate(-1)} className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Mobi Quiz Games
              </h1>
              <p className="text-xs text-white/80 mt-0.5">Pick a merchant and start winning!</p>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{quizStats.gamesPlayed}</p>
              <p className="text-xs text-white/70">Played</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{quizStats.gamesWon}</p>
              <p className="text-xs text-white/70">Won</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{quizStats.winRate}%</p>
              <p className="text-xs text-white/70">Win Rate</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-lg font-bold">🔥{quizStats.streak}</p>
              <p className="text-xs text-white/70">Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container px-4 py-4 space-y-4 pb-24">
        {/* Start Playing CTA */}
        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 overflow-hidden">
          <CardContent className="p-4 space-y-3">
            <div>
              <h2 className="font-bold text-base">Ready to Play?</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Browse all quiz modes in one place!</p>
            </div>
            <Button
              onClick={() => setShowQuizHub(true)}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg active:scale-[0.97] touch-manipulation"
              size="lg"
            >
              <Gamepad2 className="h-5 w-5 mr-2" />
              Regular Games
            </Button>
          </CardContent>
        </Card>

        {/* Wallet & Earnings Summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-green-500/20">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
                <p className="font-bold text-sm">₦{quizStats.totalEarnings.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Wallet Balance</p>
                <p className="font-bold text-sm">₦15,000</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz History Link */}
        <Link to="/my-quiz-history">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <History className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">My Quiz History</p>
                  <p className="text-xs text-muted-foreground">{quizStats.gamesPlayed} games played</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        {/* Quiz Merchants Section */}
        <div>
          <h2 className="font-bold text-base mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-600" />
            Quiz Merchants
          </h2>
          <p className="text-xs text-muted-foreground mb-3">
            Select a merchant to view their quiz seasons and start playing
          </p>
          <div className="space-y-3">
            {approvedMerchants.map((merchant) => {
              const seasons = getMerchantActiveSeasons(merchant.id);
              const bestSeason = getBestSeason(merchant.id);
              const totalParticipants = seasons.reduce((sum, s) => sum + s.totalParticipants, 0);

              return (
                <Card
                  key={merchant.id}
                  className="overflow-hidden cursor-pointer active:scale-[0.98] transition-all touch-manipulation border-border/60 hover:shadow-md"
                  onClick={() => navigate(`/mobi-quiz-games/merchant/${merchant.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 shrink-0 border-2 border-primary/20">
                        <AvatarImage src={merchant.logo} alt={merchant.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                          {merchant.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h3 className="font-bold text-sm truncate">{merchant.name}</h3>
                          {merchant.isVerified && (
                            <BadgeCheck className="h-4 w-4 text-blue-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{merchant.category}</p>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Gamepad2 className="h-3.5 w-3.5" />
                            {seasons.length} season{seasons.length !== 1 ? "s" : ""}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            {totalParticipants.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {bestSeason && (
                          <div className="bg-gradient-to-br from-amber-500/15 to-amber-600/5 rounded-lg px-2.5 py-1.5 border border-amber-500/20">
                            <div className="flex items-center gap-1 mb-0.5">
                              <Trophy className="h-3 w-3 text-amber-600" />
                              <span className="text-xs text-amber-700 font-medium">Top Prize</span>
                            </div>
                            <p className="text-xs font-bold text-amber-700">
                              {formatLocalAmount(bestSeason.totalWinningPrizes, "NGN")}
                            </p>
                          </div>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground mt-2 ml-auto" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobi Quiz Game Hub Dialog */}
      <MobigateQuizHub open={showQuizHub} onOpenChange={setShowQuizHub} hideInteractive />
    </div>
  );
}
