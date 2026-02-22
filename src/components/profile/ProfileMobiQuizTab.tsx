import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import {
  Trophy, Star, TrendingUp, Gamepad2, Crown, ChevronRight,
  Users, Zap, GraduationCap, UtensilsCrossed, ToggleLeft, Award, History, Play, BarChart3, Store
} from "lucide-react";
import { mobigatePlayerStats, mobigateWalletData } from "@/data/mobigateQuizData";
import { quizGamesPlayedData, type QuizGameRecord } from "@/data/quizGamesPlayedData";
import { mockMerchants } from "@/data/mobigateInteractiveQuizData";
import { QuizGameDetailDrawer } from "@/components/mobigate/QuizGameDetailDrawer";
import { HighlightedWinnersCarousel } from "@/components/community/mobigate-quiz/HighlightedWinnersCarousel";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";

const IS_CELEBRITY = true; // mock flag for demo

const MODE_CONFIG: Record<string, { icon: React.ReactNode; gradient: string; label: string }> = {
  "Group Quiz": { icon: <Users className="h-4 w-4" />, gradient: "from-blue-500 to-blue-600", label: "Group" },
  "Standard Solo": { icon: <Gamepad2 className="h-4 w-4" />, gradient: "from-purple-500 to-purple-600", label: "Solo" },
  "Interactive": { icon: <Zap className="h-4 w-4" />, gradient: "from-amber-500 to-orange-500", label: "Interactive" },
  "Food for Home": { icon: <UtensilsCrossed className="h-4 w-4" />, gradient: "from-green-500 to-emerald-500", label: "Food" },
  "Scholarship": { icon: <GraduationCap className="h-4 w-4" />, gradient: "from-red-500 to-rose-500", label: "Scholarship" },
  "Toggle": { icon: <ToggleLeft className="h-4 w-4" />, gradient: "from-cyan-500 to-teal-500", label: "Toggle" },
};

function groupByMode(games: QuizGameRecord[]) {
  const grouped: Record<string, { wins: number; losses: number; earnings: number; count: number }> = {};
  games.forEach((g) => {
    if (!grouped[g.gameMode]) grouped[g.gameMode] = { wins: 0, losses: 0, earnings: 0, count: 0 };
    grouped[g.gameMode].count++;
    if (g.result === "Won") {
      grouped[g.gameMode].wins++;
      grouped[g.gameMode].earnings += g.prizeWon - g.stakePaid;
    } else {
      grouped[g.gameMode].losses++;
      grouped[g.gameMode].earnings -= g.stakePaid;
    }
  });
  return grouped;
}

export function ProfileMobiQuizTab() {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<QuizGameRecord | null>(null);
  const [showCelebrityPicker, setShowCelebrityPicker] = useState(false);
  const [selectedCelebrityMerchant, setSelectedCelebrityMerchant] = useState<typeof mockMerchants[0] | null>(null);

  const stats = mobigatePlayerStats;
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const modeBreakdown = groupByMode(quizGamesPlayedData);
  const recentGames = [...quizGamesPlayedData].sort((a, b) => new Date(b.datePlayed).getTime() - new Date(a.datePlayed).getTime()).slice(0, 5);
  const approvedMerchants = mockMerchants.filter((m) => m.applicationStatus === "approved").slice(0, 3);
  // Mock: merchants where this user is a celebrity winner
  const celebrityMerchants = mockMerchants.filter((m) => m.applicationStatus === "approved").slice(0, 2);

  return (
    <div className="space-y-4 pb-6">
      {/* Celebrity Badge */}
      {IS_CELEBRITY && (
        <div className="flex items-center justify-center">
          <button onClick={() => setShowCelebrityPicker(true)} className="active:scale-[0.96] transition-transform touch-manipulation">
            <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold px-4 py-1.5 rounded-full text-sm shadow-lg gap-1.5 cursor-pointer">
              <Crown className="h-4 w-4" /> Mobi Celebrity
            </Badge>
          </button>
        </div>
      )}

      {/* Hero Stats */}
      <Card className="rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" /> Quiz Stats Overview
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Games Played", value: stats.gamesPlayed, icon: <Gamepad2 className="h-3.5 w-3.5 text-muted-foreground" /> },
            { label: "Win Rate", value: `${winRate}%`, icon: <TrendingUp className="h-3.5 w-3.5 text-green-500" /> },
            { label: "Net Profit", value: formatLocalAmount(stats.netProfit, "NGN"), icon: <Star className="h-3.5 w-3.5 text-amber-500" /> },
            { label: "Streak", value: `${stats.currentStreak} 🔥`, icon: <Zap className="h-3.5 w-3.5 text-orange-500" /> },
            { label: "Global Rank", value: `#${stats.globalRank}`, icon: <Award className="h-3.5 w-3.5 text-blue-500" /> },
            { label: "Best Score", value: stats.bestScore, icon: <BarChart3 className="h-3.5 w-3.5 text-purple-500" /> },
          ].map((s) => (
            <div key={s.label} className="bg-muted/50 rounded-lg p-3 flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">{s.icon} {s.label}</span>
              <span className="text-sm font-bold">{s.value}</span>
            </div>
          ))}
        </div>
      </Card>


      {/* Recent Games */}
      <Card className="rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" /> Recent Games
        </h3>
        <div className="space-y-2">
          {recentGames.map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className="w-full flex items-center justify-between bg-muted/40 rounded-xl px-3 py-2.5 active:scale-[0.98] transition-transform touch-manipulation"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Badge variant={game.result === "Won" ? "default" : "destructive"} className="text-[10px] px-1.5 py-0.5 shrink-0">
                  {game.result}
                </Badge>
                <div className="text-left min-w-0">
                  <p className="text-xs font-medium truncate">{game.gameMode}</p>
                  <p className="text-[10px] text-muted-foreground">{game.score} · {game.difficulty}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-xs font-bold ${game.result === "Won" ? "text-green-600" : "text-red-500"}`}>
                  {game.result === "Won" ? `+${formatLocalAmount(game.prizeWon - game.stakePaid, "NGN")}` : `-${formatLocalAmount(game.stakePaid, "NGN")}`}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Favorite Merchants */}
      {approvedMerchants.length > 0 && (
        <Card className="rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" /> Favorite Merchants
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {approvedMerchants.map((merchant) => (
              <button
                key={merchant.id}
                onClick={() => navigate(`/mobi-quiz-games/merchant/${merchant.id}`)}
                className="flex flex-col items-center gap-1.5 min-w-[72px] active:scale-95 transition-transform touch-manipulation"
              >
                <Avatar className="h-12 w-12 border-2 border-amber-400/30">
                  <AvatarFallback className="bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 text-xs font-bold">
                    {merchant.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[10px] font-medium text-center leading-tight line-clamp-2 w-16">{merchant.name}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl h-11 text-xs font-medium flex-col gap-0.5"
          onClick={() => navigate("/my-quiz-history")}
        >
          <History className="h-4 w-4" />
          History
        </Button>
        <Button
          size="sm"
          className="rounded-xl h-11 text-xs font-medium flex-col gap-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"
          onClick={() => navigate("/mobi-quiz-games")}
        >
          <Play className="h-4 w-4" />
          Play Now
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl h-11 text-xs font-medium flex-col gap-0.5"
          onClick={() => navigate("/mobi-quiz-games")}
        >
          <BarChart3 className="h-4 w-4" />
          Leaderboard
        </Button>
      </div>

      {/* Game Detail Drawer */}
      <QuizGameDetailDrawer game={selectedGame} onClose={() => setSelectedGame(null)} />

      {/* Celebrity Merchant Picker Drawer */}
      <Drawer open={showCelebrityPicker} onOpenChange={setShowCelebrityPicker}>
        <DrawerContent className="pb-6">
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle className="flex items-center justify-center gap-2 text-base">
              <Crown className="h-5 w-5 text-amber-500" /> Celebrity Quizzes
            </DrawerTitle>
            <p className="text-xs text-muted-foreground mt-1">Select a merchant quiz to view celebrity highlights</p>
          </DrawerHeader>
          <div className="px-4 space-y-2">
            {celebrityMerchants.map((merchant) => (
              <button
                key={merchant.id}
                onClick={() => {
                  setSelectedCelebrityMerchant(merchant);
                  setShowCelebrityPicker(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50 active:scale-[0.97] transition-all touch-manipulation"
              >
                <Avatar className="h-10 w-10 border-2 border-amber-400/30 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 text-xs font-bold">
                    {merchant.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{merchant.name}</p>
                  <p className="text-[11px] text-muted-foreground">{merchant.category}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Celebrity Winners Carousel Drawer */}
      <Drawer open={!!selectedCelebrityMerchant} onOpenChange={(open) => { if (!open) setSelectedCelebrityMerchant(null); }}>
        <DrawerContent className="max-h-[85vh] pb-6">
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle className="flex items-center justify-center gap-2 text-base">
              <Trophy className="h-5 w-5 text-amber-500" /> {selectedCelebrityMerchant?.name}
            </DrawerTitle>
            <p className="text-xs text-muted-foreground mt-1">Highlighted celebrity winners</p>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto">
            <HighlightedWinnersCarousel />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
