import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BadgeCheck,
  Trophy,
  Zap,
  Star,
  Crown,
  Medal,
  Gift,
  Tv,
  Ticket,
  Target,
  Gamepad2,
  Play,
} from "lucide-react";
import { mockMerchants, mockSeasons, type QuizSeason } from "@/data/mobigateInteractiveQuizData";
import { format } from "date-fns";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { LiveScoreboardDrawer } from "@/components/community/mobigate-quiz/LiveScoreboardDrawer";
import { InteractiveQuizPlayDialog } from "@/components/community/mobigate-quiz/InteractiveQuizPlayDialog";
import { HighlightedWinnersCarousel } from "@/components/community/mobigate-quiz/HighlightedWinnersCarousel";

function getSeasonTypeColor(type: string) {
  switch (type) {
    case "Short": return "bg-blue-500/15 text-blue-700 border-blue-500/30";
    case "Medium": return "bg-amber-500/15 text-amber-700 border-amber-500/30";
    case "Complete": return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30";
    default: return "bg-muted text-muted-foreground";
  }
}

export default function MerchantDetailPage() {
  const { merchantId } = useParams<{ merchantId: string }>();
  const navigate = useNavigate();
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<QuizSeason | null>(null);
  const [showPlay, setShowPlay] = useState(false);

  const merchant = mockMerchants.find((m) => m.id === merchantId);
  const seasons = mockSeasons.filter(
    (s) => s.merchantId === merchantId && s.quizStatus === "active"
  );

  if (!merchant) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <p className="text-base font-semibold">Merchant not found</p>
            <Button variant="outline" onClick={() => navigate("/mobi-quiz-games")}>
              Back to Quiz Games
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaySeason = (season: QuizSeason) => {
    setSelectedSeason(season);
    setShowPlay(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/mobi-quiz-games")}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 active:scale-95 transition-transform touch-manipulation shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold truncate">{merchant.name}</h1>
              {merchant.isVerified && (
                <BadgeCheck className="h-4 w-4 text-blue-500 shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">{merchant.category}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-10 touch-manipulation shrink-0"
            onClick={() => setShowScoreboard(true)}
          >
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold">Live</span>
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-4 py-4 space-y-4 pb-24">
        {/* Merchant Info Card */}
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
          <Avatar className="h-14 w-14 border-2 border-primary/20 shrink-0">
            <AvatarImage src={merchant.logo} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {merchant.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-base">{merchant.name}</h2>
              {merchant.isVerified && (
                <BadgeCheck className="h-4.5 w-4.5 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{merchant.category}</p>
            <Badge variant="secondary" className="mt-1 text-xs">
              Verified Merchant
            </Badge>
          </div>
        </div>

        {/* Highlighted Winners Carousel */}
        <HighlightedWinnersCarousel />

        {/* Platform Settings */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-1.5">
            <Target className="h-4 w-4 text-primary" />
            Quiz Platform Settings
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-muted/20 rounded-lg">
              <p className="text-xs text-muted-foreground">Questions Per Session</p>
              <p className="text-sm font-bold">{merchant.questionsPerPack}</p>
            </div>
            <div className="p-3 bg-muted/20 rounded-lg">
              <p className="text-xs text-muted-foreground">Cost Per Session</p>
              <p className="text-sm font-bold">{formatLocalAmount(merchant.costPerQuestion, "NGN")}</p>
            </div>
            <div className="p-3 bg-muted/20 rounded-lg">
              <p className="text-xs text-muted-foreground">Win Threshold</p>
              <p className="text-sm font-bold">{merchant.winPercentageThreshold}%</p>
            </div>
            <div className="p-3 bg-muted/20 rounded-lg">
              <p className="text-xs text-muted-foreground">Qualifying Points</p>
              <p className="text-sm font-bold">{merchant.qualifyingPoints}</p>
            </div>
          </div>
          <div className="p-3 bg-muted/20 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Bonus Games</p>
            <p className="text-sm">
              After every <span className="font-bold">{merchant.bonusGamesAfter}</span> packs,
              get <span className="font-bold">{merchant.bonusGamesCountMin}–{merchant.bonusGamesCountMax}</span> free games
              at <span className="font-bold">{merchant.bonusDiscountMin}–{merchant.bonusDiscountMax}%</span> discount
            </p>
          </div>
        </div>

        {/* Seasons */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-1.5">
            <Gamepad2 className="h-4 w-4 text-primary" />
            Quiz Seasons ({seasons.length})
          </h3>

          {seasons.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No active seasons available</p>
          )}

          {seasons.map((season) => (
            <Card key={season.id} className="overflow-hidden border">
              <CardContent className="p-0">
                {/* Season Header */}
                <div className="p-3 border-b bg-muted/10 space-y-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
                    <h4 className="font-bold text-sm break-words">{season.name}</h4>
                    <Badge variant="outline" className={`text-xs shrink-0 ${getSeasonTypeColor(season.type)}`}>
                      {season.type} Season
                    </Badge>
                    {season.isLive && (
                      <Badge className="bg-red-500 text-white text-xs animate-pulse shrink-0">
                        🔴 LIVE
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(season.startDate), "MMM d, yyyy")} — {format(new Date(season.endDate), "MMM d, yyyy")}
                  </p>
                </div>

                {/* Prize Breakdown */}
                <div className="p-3 bg-gradient-to-br from-amber-500/10 to-amber-600/5 space-y-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Trophy className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-xs font-semibold text-amber-700">Prize Breakdown</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs flex items-center gap-1">
                        <Crown className="h-3 w-3 text-amber-500" /> 1st Prize
                      </span>
                      <span className="text-xs font-bold">{formatLocalAmount(season.firstPrize, "NGN")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs flex items-center gap-1">
                        <Medal className="h-3 w-3 text-gray-400" /> 2nd Prize
                      </span>
                      <span className="text-xs font-bold">{formatLocalAmount(season.secondPrize, "NGN")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs flex items-center gap-1">
                        <Medal className="h-3 w-3 text-amber-700" /> 3rd Prize
                      </span>
                      <span className="text-xs font-bold">{formatLocalAmount(season.thirdPrize, "NGN")}</span>
                    </div>
                    {season.consolationPrizesEnabled && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs flex items-center gap-1">
                          <Gift className="h-3 w-3 text-purple-500" /> Consolation ×{season.consolationPrizeCount}
                        </span>
                        <span className="text-xs font-bold">{formatLocalAmount(season.consolationPrizePerPlayer, "NGN")} each</span>
                      </div>
                    )}
                    <div className="pt-1.5 border-t border-amber-500/20 flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-700">Total Prize Pool</span>
                      <span className="text-sm font-extrabold text-amber-700">{formatLocalAmount(season.totalWinningPrizes, "NGN")}</span>
                    </div>
                  </div>
                </div>

                {/* Selection Rounds */}
                {season.selectionProcesses.length > 0 && (
                  <div className="px-3 pb-2 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Ticket className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-semibold">Selection Rounds</span>
                    </div>
                    <div className="space-y-1">
                      {season.selectionProcesses.map((sp) => (
                        <div key={sp.round} className="flex items-center justify-between text-xs bg-muted/10 rounded px-2 py-1.5">
                          <span className="text-muted-foreground">Round {sp.round}</span>
                          <span className="font-medium">{formatLocalAmount(sp.entryFee, "NGN")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TV Show Rounds */}
                {season.tvShowRounds.length > 0 && (
                  <div className="px-3 pb-2 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Tv className="h-3.5 w-3.5 text-purple-500" />
                      <span className="text-xs font-semibold">TV Show Rounds</span>
                    </div>
                    <div className="space-y-1">
                      {season.tvShowRounds.map((tv) => (
                        <div key={tv.round} className="flex items-center justify-between text-xs bg-purple-500/5 rounded px-2 py-1.5">
                          <span className="font-medium">{tv.label}</span>
                          <span className="text-muted-foreground">
                            {tv.entriesSelected} entries
                            {tv.entryFee > 0 ? ` • ${formatLocalAmount(tv.entryFee, "NGN")}` : " • Free"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Level Progress */}
                <div className="px-3 pb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">Level {season.currentLevel}/{season.selectionLevels}</span>
                  </div>
                  <Progress value={(season.currentLevel / season.selectionLevels) * 100} className="h-2" />
                </div>

                {/* Play Quiz Button */}
                <div className="px-3 pb-3">
                  <Button
                    className="w-full h-12 text-sm font-bold gap-2 touch-manipulation bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                    onClick={() => handlePlaySeason(season)}
                  >
                    <Play className="h-5 w-5" />
                    Play Quiz — {formatLocalAmount(season.entryFee, "NGN")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Live Scoreboard */}
      <LiveScoreboardDrawer open={showScoreboard} onOpenChange={setShowScoreboard} />

      {/* Play Dialog */}
      {selectedSeason && (
        <InteractiveQuizPlayDialog
          open={showPlay}
          onOpenChange={setShowPlay}
          season={selectedSeason}
        />
      )}
    </div>
  );
}
