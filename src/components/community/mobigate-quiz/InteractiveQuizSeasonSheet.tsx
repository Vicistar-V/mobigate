import { useState } from "react";
import { Zap, Users, Trophy, Radio, Gift, ArrowRight } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
            <DrawerTitle className="flex items-center gap-2 text-sm">
              <Trophy className="h-5 w-5 text-blue-500" /> {merchant.name}
            </DrawerTitle>
            <p className="text-xs text-muted-foreground">Select a season to compete in</p>
            <button
              onClick={() => setShowScoreboard(true)}
              className="flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-200/30 active:scale-95 transition-all touch-manipulation"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <Radio className="h-3 w-3 text-red-500" />
              <span className="text-[10px] font-bold text-red-600 dark:text-red-400">View Live Scoreboard</span>
            </button>
          </DrawerHeader>

          <ScrollArea className="flex-1 max-h-[60vh] px-4">
            <div className="space-y-3 pb-4">
              {seasons.map((season) => (
                <Card
                  key={season.id}
                  className={`cursor-pointer transition-all touch-manipulation ${
                    selectedSeason?.id === season.id ? "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedSeason(season)}
                >
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold">{season.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`text-[9px] ${getSeasonTypeColor(season.type)}`}>{season.type}</Badge>
                          {season.isLive && (
                            <Badge className="text-[9px] bg-red-500 text-white border-0 animate-pulse">
                              <Radio className="h-2.5 w-2.5 mr-1" /> LIVE
                            </Badge>
                          )}
                          {season.consolationPrizesEnabled && (
                            <Badge variant="outline" className="text-[9px] bg-purple-50 text-purple-600 border-purple-200">
                              <Gift className="h-2.5 w-2.5 mr-0.5" /> Consolation
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[9px]">{season.status}</Badge>
                    </div>

                    {/* Winning Prizes Breakdown */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-lg p-2 border border-amber-200/50 dark:border-amber-800/30">
                      <p className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase mb-1 flex items-center gap-1">
                        <Trophy className="h-2.5 w-2.5" /> Game Show Prizes
                      </p>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
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
                      <p className="text-[9px] text-muted-foreground mt-1">
                        {season.consolationPrizesEnabled && `Consolation for ${season.consolationPrizeCount} Semi-Final contestants • `}
                        Total: <span className="font-bold text-green-600">{formatLocalAmount(season.totalWinningPrizes, "NGN")}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-1.5 bg-muted/50 rounded text-center">
                        <p className="text-[9px] text-muted-foreground">Levels</p>
                        <p className="font-bold text-xs">{season.selectionLevels}</p>
                      </div>
                      <div className="p-1.5 bg-muted/50 rounded text-center">
                        <p className="text-[9px] text-muted-foreground">Entry</p>
                        <p className="font-bold text-xs text-red-600">{formatMobiAmount(season.entryFee)}</p>
                        <p className="text-[8px] text-muted-foreground">{formatLocalAmount(season.entryFee, "NGN")}</p>
                      </div>
                      <div className="p-1.5 bg-muted/50 rounded text-center">
                        <p className="text-[9px] text-muted-foreground">Prize/Lvl</p>
                        <p className="font-bold text-xs text-green-600">{formatMobiAmount(season.prizePerLevel)}</p>
                        <p className="text-[8px] text-muted-foreground">{formatLocalAmount(season.prizePerLevel, "NGN")}</p>
                      </div>
                    </div>

                    {/* Selection process stages */}
                    <div className="space-y-1">
                      <p className="text-[9px] font-semibold text-muted-foreground uppercase">Selection Stages</p>
                      <div className="flex gap-1 flex-wrap">
                        {season.selectionProcesses.slice(0, 4).map((sp, idx) => (
                          <Badge key={idx} variant="outline" className="text-[8px] py-0 px-1.5">
                            R{sp.round}: {sp.entriesSelected.toLocaleString()} @ {formatLocalAmount(sp.entryFee, "NGN")}
                          </Badge>
                        ))}
                        {season.selectionProcesses.length > 4 && (
                          <Badge variant="outline" className="text-[8px] py-0 px-1.5">+{season.selectionProcesses.length - 4} more</Badge>
                        )}
                      </div>
                      {/* TV Rounds summary */}
                      <div className="flex gap-1 flex-wrap mt-0.5">
                        {season.tvShowRounds.map((tv, idx) => (
                          <Badge key={idx} variant="secondary" className="text-[8px] py-0 px-1.5">
                            📺 {tv.label}: {tv.entriesSelected} {tv.entryFee > 0 ? `@ ${formatLocalAmount(tv.entryFee, "NGN")}` : "(FREE)"}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{season.totalParticipants.toLocaleString()} participants</span>
                      <span>{GAME_SHOW_ENTRY_POINTS} pts to enter show</span>
                    </div>

                    {/* Level progression */}
                    <div className="flex gap-1">
                      {Array.from({ length: season.selectionLevels }).map((_, i) => {
                        const isLive = i >= season.selectionLevels - 3;
                        const isPast = i < season.currentLevel;
                        return (
                          <div key={i} className={`h-1.5 flex-1 rounded-full ${
                            isPast ? "bg-blue-500" : isLive ? "bg-red-300" : "bg-muted"
                          }`} />
                        );
                      })}
                    </div>
                    <p className="text-[9px] text-muted-foreground text-center">Last 3 levels are Live Shows 📺</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

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
