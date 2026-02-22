import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import {
  Trophy, Star, TrendingUp, Gamepad2, Crown, ChevronRight, ChevronDown,
  Users, Zap, GraduationCap, UtensilsCrossed, ToggleLeft, Award, History, BarChart3,
  Target, Flame, Hash, ArrowUpRight, ArrowDownRight, Coins
} from "lucide-react";
import { mobigatePlayerStats } from "@/data/mobigateQuizData";
import { quizGamesPlayedData, type QuizGameRecord } from "@/data/quizGamesPlayedData";
import { mockMerchants, mockSeasonWinners } from "@/data/mobigateInteractiveQuizData";
import { QuizGameDetailDrawer } from "@/components/mobigate/QuizGameDetailDrawer";
import { QuizWinnerProfileDrawer } from "@/components/community/mobigate-quiz/QuizWinnerProfileDrawer";
import { formatLocalAmount, formatMobiAmount } from "@/lib/mobiCurrencyTranslation";

const IS_CELEBRITY = true;

const MODE_CONFIG: Record<string, { icon: React.ReactNode; gradient: string; label: string }> = {
  "Group Quiz": { icon: <Users className="h-4 w-4" />, gradient: "from-blue-500 to-blue-600", label: "Group" },
  "Standard Solo": { icon: <Gamepad2 className="h-4 w-4" />, gradient: "from-purple-500 to-purple-600", label: "Solo" },
  "Interactive": { icon: <Zap className="h-4 w-4" />, gradient: "from-amber-500 to-orange-500", label: "Interactive" },
  "Food for Home": { icon: <UtensilsCrossed className="h-4 w-4" />, gradient: "from-green-500 to-emerald-500", label: "Food" },
  "Scholarship": { icon: <GraduationCap className="h-4 w-4" />, gradient: "from-red-500 to-rose-500", label: "Scholarship" },
  "Toggle": { icon: <ToggleLeft className="h-4 w-4" />, gradient: "from-cyan-500 to-teal-500", label: "Toggle" },
};

// Extended mock games for progressive loading
const EXTENDED_GAMES: QuizGameRecord[] = [
  ...quizGamesPlayedData,
  { id: "24", gameId: "QG-2024-00100", playerName: "You", state: "Lagos", country: "Nigeria", gameMode: "Group Quiz", result: "Won", stakePaid: 8000, prizeWon: 20000, category: "Entertainment", difficulty: "Easy", datePlayed: "2024-08-10T14:00:00", score: "9/10" },
  { id: "25", gameId: "SS-2024-00152", playerName: "You", state: "Lagos", country: "Nigeria", gameMode: "Standard Solo", result: "Lost", stakePaid: 5000, prizeWon: 0, category: "History", difficulty: "Hard", datePlayed: "2024-07-28T11:30:00", score: "4/10" },
  { id: "26", gameId: "IQ-2024-00042", playerName: "You", state: "Lagos", country: "Nigeria", gameMode: "Interactive", result: "Won", stakePaid: 10000, prizeWon: 25000, category: "Sports", difficulty: "Medium", datePlayed: "2024-07-15T19:00:00", score: "12/15" },
  { id: "27", gameId: "FH-2024-00062", playerName: "You", state: "Lagos", country: "Nigeria", gameMode: "Food for Home", result: "Won", stakePaid: 4000, prizeWon: 20000, category: "General Knowledge", difficulty: "Easy", datePlayed: "2024-06-20T10:00:00", score: "14/15" },
  { id: "28", gameId: "SC-2024-00028", playerName: "You", state: "Lagos", country: "Nigeria", gameMode: "Scholarship", result: "Lost", stakePaid: 45000, prizeWon: 0, category: "Science", difficulty: "Expert", datePlayed: "2024-06-05T08:00:00", score: "6/15" },
  { id: "29", gameId: "QG-2024-00101", playerName: "You", state: "Lagos", country: "Nigeria", gameMode: "Group Quiz", result: "Won", stakePaid: 12000, prizeWon: 28000, category: "Science", difficulty: "Hard", datePlayed: "2024-05-18T16:30:00", score: "8/10" },
  { id: "30", gameId: "SS-2024-00153", playerName: "You", state: "Lagos", country: "Nigeria", gameMode: "Standard Solo", result: "Won", stakePaid: 6000, prizeWon: 12000, category: "Current Affairs", difficulty: "Medium", datePlayed: "2024-05-02T09:15:00", score: "9/10" },
  { id: "31", gameId: "IQ-2024-00043", playerName: "You", state: "Lagos", country: "Nigeria", gameMode: "Interactive", result: "Lost", stakePaid: 15000, prizeWon: 0, category: "Entertainment", difficulty: "Expert", datePlayed: "2024-04-20T21:00:00", score: "5/15" },
  { id: "32", gameId: "FH-2024-00063", playerName: "You", state: "Lagos", country: "Nigeria", gameMode: "Food for Home", result: "Won", stakePaid: 5000, prizeWon: 25000, category: "Sports", difficulty: "Medium", datePlayed: "2024-04-08T12:00:00", score: "13/15" },
  { id: "33", gameId: "QG-2024-00102", playerName: "You", state: "Lagos", country: "Nigeria", gameMode: "Group Quiz", result: "Lost", stakePaid: 7000, prizeWon: 0, category: "History", difficulty: "Medium", datePlayed: "2024-03-15T14:45:00", score: "3/10" },
];

const GAMES_PER_PAGE = 5;

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

type StatKey = "gamesPlayed" | "winRate" | "netProfit" | "streak" | "globalRank" | "bestScore";

export function ProfileMobiQuizTab() {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<QuizGameRecord | null>(null);
  const [showCelebrityPicker, setShowCelebrityPicker] = useState(false);
  const [selectedCelebrityMerchant, setSelectedCelebrityMerchant] = useState<typeof mockMerchants[0] | null>(null);
  const [visibleCount, setVisibleCount] = useState(GAMES_PER_PAGE);
  const [selectedStat, setSelectedStat] = useState<StatKey | null>(null);

  const stats = mobigatePlayerStats;
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const modeBreakdown = groupByMode(EXTENDED_GAMES);

  const allGames = useMemo(
    () => [...EXTENDED_GAMES].sort((a, b) => new Date(b.datePlayed).getTime() - new Date(a.datePlayed).getTime()),
    []
  );
  const visibleGames = allGames.slice(0, visibleCount);
  const hasMore = visibleCount < allGames.length;

  const approvedMerchants = mockMerchants.filter((m) => m.applicationStatus === "approved").slice(0, 3);
  const celebrityMerchants = mockMerchants.filter((m) => m.applicationStatus === "approved").slice(0, 2);

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + GAMES_PER_PAGE, allGames.length));
  };

  const statItems: { key: StatKey; label: string; value: string | number; icon: React.ReactNode }[] = [
    { key: "gamesPlayed", label: "Games Played", value: stats.gamesPlayed, icon: <Gamepad2 className="h-3.5 w-3.5 text-muted-foreground" /> },
    { key: "winRate", label: "Win Rate", value: `${winRate}%`, icon: <TrendingUp className="h-3.5 w-3.5 text-green-600" /> },
    { key: "netProfit", label: "Net Profit", value: formatLocalAmount(stats.netProfit, "NGN"), icon: <Star className="h-3.5 w-3.5 text-amber-500" /> },
    { key: "streak", label: "Streak", value: `${stats.currentStreak} 🔥`, icon: <Zap className="h-3.5 w-3.5 text-orange-500" /> },
    { key: "globalRank", label: "Global Rank", value: `#${stats.globalRank}`, icon: <Award className="h-3.5 w-3.5 text-blue-500" /> },
    { key: "bestScore", label: "Best Score", value: stats.bestScore, icon: <BarChart3 className="h-3.5 w-3.5 text-purple-500" /> },
  ];

  const getStatDrawerContent = (key: StatKey) => {
    switch (key) {
      case "gamesPlayed":
        return {
          title: "Games Played",
          icon: <Gamepad2 className="h-5 w-5 text-primary" />,
          rows: [
            { label: "Total Games", value: String(stats.gamesPlayed), highlight: true },
            { label: "Games Won", value: String(stats.gamesWon) },
            { label: "Partial Wins", value: String(stats.partialWins) },
            { label: "Games Lost", value: String(stats.gamesLost) },
          ],
          breakdown: Object.entries(modeBreakdown).map(([mode, data]) => ({
            mode,
            config: MODE_CONFIG[mode],
            count: data.count,
            wins: data.wins,
            losses: data.losses,
          })),
          cta: { label: "View Full History", route: "/my-quiz-history" },
        };
      case "winRate":
        return {
          title: "Win Rate",
          icon: <TrendingUp className="h-5 w-5 text-green-600" />,
          rows: [
            { label: "Overall Win Rate", value: `${winRate}%`, highlight: true },
            { label: "Won", value: String(stats.gamesWon) },
            { label: "Lost", value: String(stats.gamesLost) },
            { label: "Partial Wins", value: String(stats.partialWins) },
          ],
          breakdown: Object.entries(modeBreakdown).map(([mode, data]) => ({
            mode,
            config: MODE_CONFIG[mode],
            count: data.count,
            wins: data.wins,
            losses: data.losses,
            winRate: data.count > 0 ? Math.round((data.wins / data.count) * 100) : 0,
          })),
          cta: { label: "View Game History", route: "/my-quiz-history" },
        };
      case "netProfit":
        return {
          title: "Net Profit",
          icon: <Coins className="h-5 w-5 text-amber-500" />,
          rows: [
            { label: "Net Profit", value: formatLocalAmount(stats.netProfit, "NGN"), highlight: true },
            { label: "Total Won", value: formatLocalAmount(stats.totalAmountWon, "NGN") },
            { label: "Total Staked", value: formatLocalAmount(stats.totalStakePaid, "NGN") },
          ],
          breakdown: Object.entries(modeBreakdown).map(([mode, data]) => ({
            mode,
            config: MODE_CONFIG[mode],
            count: data.count,
            wins: data.wins,
            losses: data.losses,
            earnings: data.earnings,
          })),
          cta: { label: "View Transaction History", route: "/my-quiz-history" },
        };
      case "streak":
        return {
          title: "Win Streak",
          icon: <Flame className="h-5 w-5 text-orange-500" />,
          rows: [
            { label: "Current Streak", value: `${stats.currentStreak} 🔥`, highlight: true },
            { label: "Longest Streak", value: `${stats.longestStreak} games` },
            { label: "Favorite Category", value: stats.favoriteCategory },
          ],
          breakdown: [],
          cta: { label: "Play Now to Extend Streak", route: "/mobi-quiz-games" },
        };
      case "globalRank":
        return {
          title: "Global Rank",
          icon: <Award className="h-5 w-5 text-blue-500" />,
          rows: [
            { label: "Current Rank", value: `#${stats.globalRank}`, highlight: true },
            { label: "Average Score", value: `${stats.averageScore}%` },
            { label: "Total Games", value: String(stats.gamesPlayed) },
          ],
          breakdown: [],
          cta: { label: "View Global Leaderboard", route: "/mobi-quiz-games" },
        };
      case "bestScore":
        return {
          title: "Best Score",
          icon: <Target className="h-5 w-5 text-purple-500" />,
          rows: [
            { label: "Best Score", value: `${stats.bestScore}%`, highlight: true },
            { label: "Average Score", value: `${stats.averageScore}%` },
            { label: "Games Played", value: String(stats.gamesPlayed) },
          ],
          breakdown: [],
          cta: { label: "Play & Beat Your Record", route: "/mobi-quiz-games" },
        };
    }
  };

  const activeStatContent = selectedStat ? getStatDrawerContent(selectedStat) : null;

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

      {/* Hero Stats - Clickable */}
      <Card className="rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" /> Quiz Stats Overview
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {statItems.map((s) => (
            <button
              key={s.key}
              onClick={() => setSelectedStat(s.key)}
              className="bg-muted/50 rounded-lg p-3 flex flex-col gap-1 text-left active:scale-[0.97] transition-transform touch-manipulation"
            >
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">{s.icon} {s.label}</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{s.value}</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Recent Games with View More */}
      <Card className="rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" /> Recent Games
          </h3>
          <span className="text-[11px] text-muted-foreground">{allGames.length} total</span>
        </div>
        <div className="space-y-2">
          {visibleGames.map((game) => {
            const modeConf = MODE_CONFIG[game.gameMode];
            return (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className="w-full flex items-center justify-between bg-muted/40 rounded-xl px-3 py-2.5 active:scale-[0.98] transition-transform touch-manipulation"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {modeConf && (
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${modeConf.gradient} flex items-center justify-center text-white shrink-0`}>
                      {modeConf.icon}
                    </div>
                  )}
                  <div className="text-left min-w-0">
                    <p className="text-xs font-medium truncate">{game.gameMode}</p>
                    <p className="text-[11px] text-muted-foreground">{game.score} · {game.difficulty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {game.result === "Won" ? (
                        <ArrowUpRight className="h-3 w-3 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-destructive" />
                      )}
                      <span className={`text-xs font-bold ${game.result === "Won" ? "text-green-600" : "text-destructive"}`}>
                        {game.result === "Won" ? `+${formatLocalAmount(game.prizeWon - game.stakePaid, "NGN")}` : `-${formatLocalAmount(game.stakePaid, "NGN")}`}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(game.datePlayed).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}
                    </p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>

        {/* View More Button */}
        {hasMore && (
          <Button
            variant="ghost"
            className="w-full text-xs text-primary font-medium h-10 active:scale-[0.98] touch-manipulation"
            onClick={handleViewMore}
          >
            <ChevronDown className="h-4 w-4 mr-1" />
            View More ({allGames.length - visibleCount} remaining)
          </Button>
        )}

        {!hasMore && allGames.length > GAMES_PER_PAGE && (
          <p className="text-center text-[11px] text-muted-foreground py-1">All games loaded</p>
        )}
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
                <span className="text-[11px] font-medium text-center leading-tight line-clamp-2 w-16">{merchant.name}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Game Detail Drawer */}
      <QuizGameDetailDrawer game={selectedGame} onClose={() => setSelectedGame(null)} />

      {/* Stat Detail Drawer */}
      <Drawer open={!!selectedStat} onOpenChange={(open) => { if (!open) setSelectedStat(null); }}>
        <DrawerContent className="max-h-[92vh] pb-6">
          {activeStatContent && (
            <div className="flex flex-col">
              <DrawerHeader className="text-center pb-2">
                <DrawerTitle className="flex items-center justify-center gap-2 text-base">
                  {activeStatContent.icon} {activeStatContent.title}
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-4 space-y-4 overflow-y-auto touch-auto">
                {/* Main Stats */}
                <div className="space-y-2">
                  {activeStatContent.rows.map((row, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        row.highlight ? "bg-primary/5 border border-primary/20" : "bg-muted/50"
                      }`}
                    >
                      <span className="text-xs text-muted-foreground">{row.label}</span>
                      <span className={`text-sm font-bold ${row.highlight ? "text-primary" : ""}`}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Mode Breakdown */}
                {activeStatContent.breakdown.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">By Mode</h4>
                      {activeStatContent.breakdown.map((item: any) => {
                        const conf = item.config || { icon: <Gamepad2 className="h-4 w-4" />, gradient: "from-gray-500 to-gray-600", label: item.mode };
                        return (
                          <div key={item.mode} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${conf.gradient} flex items-center justify-center text-white shrink-0`}>
                              {conf.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold">{conf.label}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {item.wins}W · {item.losses}L · {item.count} games
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              {item.winRate !== undefined && (
                                <span className="text-xs font-bold text-primary">{item.winRate}%</span>
                              )}
                              {item.earnings !== undefined && (
                                <span className={`text-xs font-bold ${item.earnings >= 0 ? "text-green-600" : "text-destructive"}`}>
                                  {item.earnings >= 0 ? "+" : ""}{formatLocalAmount(item.earnings, "NGN")}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* CTA */}
                {activeStatContent.cta && (
                  <Button
                    className="w-full h-12 text-sm font-semibold active:scale-[0.97] touch-manipulation"
                    onClick={() => {
                      setSelectedStat(null);
                      setTimeout(() => navigate(activeStatContent.cta!.route), 200);
                    }}
                  >
                    {activeStatContent.cta.label}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>

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

      {/* Celebrity Winner Profile Drawer */}
      <QuizWinnerProfileDrawer
        winner={selectedCelebrityMerchant ? mockSeasonWinners[0] : null}
        open={!!selectedCelebrityMerchant}
        onOpenChange={(open) => { if (!open) setSelectedCelebrityMerchant(null); }}
        merchantName={selectedCelebrityMerchant?.name}
        seasonName="Season 1"
      />
    </div>
  );
}
