import { useState } from "react";
import { Zap, Users, Trophy, Radio, Gift, ArrowRight } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { QuizMerchant, QuizSeason, GAME_SHOW_ENTRY_POINTS } from "@/data/mobigateInteractiveQuizData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { InteractiveQuizPlayDialog } from "./InteractiveQuizPlayDialog";
import { LiveScoreboardDrawer } from "./LiveScoreboardDrawer";

interface InteractiveQuizSeasonSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchant: QuizMerchant;
  seasons: QuizSeason[];
}

export function InteractiveQuizSeasonSheet({ open, onOpenChange, merchant, seasons }: InteractiveQuizSeasonSheetProps) {
  const { toast } = useToast();
  const [selectedSeason, setSelectedSeason] = useState<QuizSeason | null>(null);
  const [showPlay, setShowPlay] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);

  const handleJoin = () => {
    if (!selectedSeason) return;
    toast({
      title: "🎬 Joined Season!",
      description: `You've joined "${selectedSeason.name}". ${formatMobiAmount(selectedSeason.entryFee)} deducted. Good luck!`,
    });
    setShowPlay(true);
  };

  const getSeasonTypeColor = (type: string) => {
    switch (type) {
      case "Short": return "bg-green-100 text-green-700 border-green-300";
      case "Medium": return "bg-amber-100 text-amber-700 border-amber-300";
      case "Complete": return "bg-purple-100 text-purple-700 border-purple-300";
      default: return "";
    }
  };

  return (
    <>
      <Drawer open={open && !showPlay} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="text-left pb-2">
            <DrawerTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-5 w-5 text-blue-500" /> {merchant.name}
            </DrawerTitle>
            <p className="text-sm text-muted-foreground">Select a season to compete in</p>
            <button
              onClick={() => setShowScoreboard(true)}
              className="flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-200/30 active:scale-95 transition-all touch-manipulation"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <Radio className="h-4 w-4 text-red-500" />
              <span className="text-sm font-bold text-red-600 dark:text-red-400">View Live Scoreboard</span>
            </button>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4">
            <div className="space-y-3 pb-4">
              {seasons.map((season) => (
                <Card
                  key={season.id}
                  className={`cursor-pointer transition-all touch-manipulation ${
                    selectedSeason?.id === season.id ? "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedSeason(season)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-bold">{season.name}</h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className={`text-xs ${getSeasonTypeColor(season.type)}`}>{season.type}</Badge>
                          {season.isLive && (
                            <Badge className="text-xs bg-red-500 text-white border-0 animate-pulse">
                              <Radio className="h-3 w-3 mr-1" /> LIVE
                            </Badge>
                          )}
                          {season.consolationPrizesEnabled && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600 border-purple-200">
                              <Gift className="h-3 w-3 mr-0.5" /> Consolation
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">{season.status}</Badge>
                    </div>

                    {/* Winning Prizes Breakdown */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-lg p-3 border border-amber-200/50 dark:border-amber-800/30">
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-1.5 flex items-center gap-1">
                        <Trophy className="h-3.5 w-3.5" /> Game Show Prizes
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <span className="text-muted-foreground">🥇 1st:</span>
                        <span className="font-semibold">{formatLocalAmount(season.firstPrize, "NGN")}</span>
                        <span className="text-muted-foreground">🥈 2nd:</span>
                        <span className="font-semibold">{formatLocalAmount(season.secondPrize, "NGN")}</span>
                        <span className="text-muted-foreground">🥉 3rd:</span>
                        <span className="font-semibold">{formatLocalAmount(season.thirdPrize, "NGN")}</span>
                        {season.consolationPrizesEnabled && (
                          <>
                            <span className="text-muted-foreground">🎁 Consolation:</span>
                            <span className="font-semibold">{formatLocalAmount(season.consolationPrizePerPlayer, "NGN")} × {season.consolationPrizeCount}</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {season.consolationPrizesEnabled && `Consolation for ${season.consolationPrizeCount} Semi-Final contestants • `}
                        Total: <span className="font-bold text-green-600">{formatLocalAmount(season.totalWinningPrizes, "NGN")}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-muted/50 rounded text-center">
                        <p className="text-xs text-muted-foreground">Levels</p>
                        <p className="font-bold text-sm">{season.selectionLevels}</p>
                      </div>
                      <div className="p-2 bg-muted/50 rounded text-center">
                        <p className="text-xs text-muted-foreground">Prize/Lvl</p>
                        <p className="font-bold text-sm text-green-600">{formatMobiAmount(season.prizePerLevel)}</p>
                        <p className="text-xs text-muted-foreground">{formatLocalAmount(season.prizePerLevel, "NGN")}</p>
                      </div>
                    </div>

                    {/* TV Rounds summary */}
                    {season.tvShowRounds.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">TV Show Rounds</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {season.tvShowRounds.map((tv, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs py-0.5 px-2">
                              📺 {tv.label}: {tv.entriesSelected} {tv.entryFee > 0 ? `@ ${formatLocalAmount(tv.entryFee, "NGN")}` : "(FREE)"}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{GAME_SHOW_ENTRY_POINTS} pts to enter show</span>
                    </div>

                    {/* Level progression */}
                    <div className="flex gap-1">
                      {Array.from({ length: season.selectionLevels }).map((_, i) => {
                        const isLive = i >= season.selectionLevels - 3;
                        const isPast = i < season.currentLevel;
                        return (
                          <div key={i} className={`h-2 flex-1 rounded-full ${
                            isPast ? "bg-blue-500" : isLive ? "bg-red-300" : "bg-muted"
                          }`} />
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Last 3 levels are Live Shows 📺</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="px-4 pb-4 pt-2 border-t">
            <Button
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
              onClick={handleJoin}
              disabled={!selectedSeason}
            >
              <Zap className="h-4 w-4 mr-2" />
              {selectedSeason ? `Join - Pay ${formatMobiAmount(selectedSeason.entryFee)} (${formatLocalAmount(selectedSeason.entryFee, "NGN")})` : "Select a Season"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {selectedSeason && (
        <InteractiveQuizPlayDialog
          open={showPlay}
          onOpenChange={(v) => { if (!v) { setShowPlay(false); onOpenChange(false); } }}
          season={selectedSeason}
        />
      )}
      <LiveScoreboardDrawer open={showScoreboard} onOpenChange={setShowScoreboard} />
    </>
  );
}
