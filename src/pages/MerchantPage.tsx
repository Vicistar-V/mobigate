import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  ArrowLeft,
  BadgeCheck,
  Trophy,
  Users,
  Zap,
  Star,
  Crown,
  Medal,
  Gift,
  Tv,
  Ticket,
  Target,
  Gamepad2,
  ChevronRight,
} from "lucide-react";
import { mockMerchants, mockSeasons, type QuizMerchant, type QuizSeason } from "@/data/mobigateInteractiveQuizData";
import { formatLocalAmount, formatMobi } from "@/lib/mobiCurrencyTranslation";
import { LiveScoreboardDrawer } from "@/components/community/mobigate-quiz/LiveScoreboardDrawer";
import { InteractiveQuizPlayDialog } from "@/components/community/mobigate-quiz/InteractiveQuizPlayDialog";
import { useToast } from "@/hooks/use-toast";

// Only show approved merchants
const approvedMerchants = mockMerchants.filter((m) => m.applicationStatus === "approved");

function getSeasonTypeColor(type: string) {
  switch (type) {
    case "Short": return "bg-blue-500/15 text-blue-700 border-blue-500/30";
    case "Medium": return "bg-amber-500/15 text-amber-700 border-amber-500/30";
    case "Complete": return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30";
    default: return "bg-muted text-muted-foreground";
  }
}

export default function MerchantPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMerchant, setSelectedMerchant] = useState<QuizMerchant | null>(null);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<QuizSeason | null>(null);
  const [showPlay, setShowPlay] = useState(false);

  const getMerchantSeasons = (merchantId: string) =>
    mockSeasons.filter((s) => s.merchantId === merchantId && s.quizStatus === "active");

  const getBestSeason = (merchantId: string) => {
    const seasons = getMerchantSeasons(merchantId);
    if (!seasons.length) return null;
    return seasons.reduce((best, s) => (s.totalWinningPrizes > best.totalWinningPrizes ? s : best), seasons[0]);
  };

  const handleJoinSeason = (season: QuizSeason) => {
    setSelectedSeason(season);
    toast({
      title: "🎮 Joining Season",
      description: `Entering ${season.name}...`,
    });
    setShowPlay(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      {/* Page Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 active:scale-95 transition-transform touch-manipulation"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Merchant Quiz Management</h1>
            <p className="text-xs text-muted-foreground">{approvedMerchants.length} verified merchants</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-10 touch-manipulation"
            onClick={() => setShowScoreboard(true)}
          >
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold">Live Scores</span>
          </Button>
        </div>
      </div>

      {/* Merchant List */}
      <div className="p-4 space-y-3">
        {approvedMerchants.map((merchant) => {
          const seasons = getMerchantSeasons(merchant.id);
          const bestSeason = getBestSeason(merchant.id);
          const totalParticipants = seasons.reduce((sum, s) => sum + s.totalParticipants, 0);

          return (
            <Card
              key={merchant.id}
              className="overflow-hidden cursor-pointer active:scale-[0.98] transition-all touch-manipulation border-border/60"
              onClick={() => setSelectedMerchant(merchant)}
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
                          <span className="text-[10px] text-amber-700 font-medium">Top Prize</span>
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

      {/* Merchant Detail Drawer */}
      <Drawer open={!!selectedMerchant} onOpenChange={(o) => !o && setSelectedMerchant(null)}>
        <DrawerContent className="max-h-[92vh] flex flex-col">
          <DrawerHeader className="shrink-0 px-4 pt-2 pb-3 border-b">
            <DrawerTitle className="text-base font-bold">
              {selectedMerchant?.name || "Merchant Details"}
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4 py-4 space-y-4">
            {selectedMerchant && (
              <>
                {/* Merchant Info Card */}
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                  <Avatar className="h-14 w-14 border-2 border-primary/20">
                    <AvatarImage src={selectedMerchant.logo} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {selectedMerchant.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-bold text-base">{selectedMerchant.name}</h2>
                      {selectedMerchant.isVerified && (
                        <BadgeCheck className="h-4.5 w-4.5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedMerchant.category}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Verified Merchant
                    </Badge>
                  </div>
                </div>

                {/* Platform Settings Summary */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold flex items-center gap-1.5">
                    <Target className="h-4 w-4 text-primary" />
                    Quiz Platform Settings
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <p className="text-xs text-muted-foreground">Questions/Pack</p>
                      <p className="text-sm font-bold">{selectedMerchant.questionsPerPack}</p>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <p className="text-xs text-muted-foreground">Cost/Question</p>
                      <p className="text-sm font-bold">{formatLocalAmount(selectedMerchant.costPerQuestion, "NGN")}</p>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <p className="text-xs text-muted-foreground">Win Threshold</p>
                      <p className="text-sm font-bold">{selectedMerchant.winPercentageThreshold}%</p>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <p className="text-xs text-muted-foreground">Qualifying Pts</p>
                      <p className="text-sm font-bold">{selectedMerchant.qualifyingPoints}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Bonus Games</p>
                    <p className="text-sm">
                      After every <span className="font-bold">{selectedMerchant.bonusGamesAfter}</span> packs,
                      get <span className="font-bold">{selectedMerchant.bonusGamesCountMin}–{selectedMerchant.bonusGamesCountMax}</span> free games
                      at <span className="font-bold">{selectedMerchant.bonusDiscountMin}–{selectedMerchant.bonusDiscountMax}%</span> discount
                    </p>
                  </div>
                </div>

                {/* Seasons */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-1.5">
                    <Gamepad2 className="h-4 w-4 text-primary" />
                    Quiz Seasons
                  </h3>

                  {getMerchantSeasons(selectedMerchant.id).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">No active seasons</p>
                  )}

                  {getMerchantSeasons(selectedMerchant.id).map((season) => (
                    <Card
                      key={season.id}
                      className={`overflow-hidden border ${
                        selectedSeason?.id === season.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedSeason(season)}
                    >
                      <CardContent className="p-0">
                        {/* Season Header */}
                        <div className="p-3 flex items-center justify-between border-b bg-muted/10">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate">{season.name}</h4>
                            <Badge variant="outline" className={`text-[10px] shrink-0 ${getSeasonTypeColor(season.type)}`}>
                              {season.type}
                            </Badge>
                          </div>
                          {season.isLive && (
                            <Badge className="bg-red-500 text-white text-[10px] animate-pulse shrink-0 ml-2">
                              🔴 LIVE
                            </Badge>
                          )}
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

                        {/* Entry Fee & Participants */}
                        <div className="p-3 grid grid-cols-2 gap-2">
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <p className="text-[10px] text-muted-foreground">Entry Fee</p>
                            <p className="text-sm font-bold">{formatLocalAmount(season.entryFee, "NGN")}</p>
                          </div>
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <p className="text-[10px] text-muted-foreground">Participants</p>
                            <p className="text-sm font-bold">{season.totalParticipants.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Selection Process */}
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
                                  <span>{sp.entriesSelected.toLocaleString()} entries • {formatLocalAmount(sp.entryFee, "NGN")}</span>
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
                        <div className="px-3 pb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">Level {season.currentLevel}/{season.selectionLevels}</span>
                          </div>
                          <Progress value={(season.currentLevel / season.selectionLevels) * 100} className="h-2" />
                        </div>

                        {/* Join Button */}
                        <div className="px-3 pb-3">
                          <Button
                            className="w-full h-11 text-sm font-bold gap-2 touch-manipulation"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoinSeason(season);
                            }}
                          >
                            <Star className="h-4 w-4" />
                            Join Season — {formatLocalAmount(season.entryFee, "NGN")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>

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
