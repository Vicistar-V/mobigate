import { useState } from "react";
import { ChevronRight, Star, Trophy, Users, Radio } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockMerchants, mockSeasons, QuizMerchant } from "@/data/mobigateInteractiveQuizData";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { InteractiveQuizSeasonSheet } from "./InteractiveQuizSeasonSheet";
import { LiveScoreboardDrawer } from "./LiveScoreboardDrawer";

interface InteractiveQuizMerchantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InteractiveQuizMerchantSheet({ open, onOpenChange }: InteractiveQuizMerchantSheetProps) {
  const [selectedMerchant, setSelectedMerchant] = useState<QuizMerchant | null>(null);
  const [showScoreboard, setShowScoreboard] = useState(false);

  // Only show approved merchants with at least one active season
  const visibleMerchants = mockMerchants.filter(m => {
    if (m.applicationStatus !== "approved") return false;
    const activeSeasons = mockSeasons.filter(s => s.merchantId === m.id && s.quizStatus === "active");
    return activeSeasons.length > 0;
  });

  return (
    <>
      <Drawer open={open && !selectedMerchant} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="text-left pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" /> Interactive Quiz - Merchants
            </DrawerTitle>
            <p className="text-xs text-muted-foreground">Choose a merchant to explore quiz seasons</p>
          </DrawerHeader>

          {/* Live Scoreboard Button */}
          <div className="px-4 pb-2">
            <button
              onClick={() => { setShowScoreboard(true); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200/50 dark:border-red-800/30 active:scale-[0.98] transition-all touch-manipulation"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <Radio className="h-3.5 w-3.5 text-red-500" />
              <span className="text-xs font-bold text-red-600 dark:text-red-400">Live Scoreboard</span>
              <Badge className="bg-red-500 text-white border-0 text-[8px] px-1.5 py-0 animate-pulse">LIVE</Badge>
            </button>
          </div>

          <ScrollArea className="flex-1 max-h-[65vh] px-4 pb-4">
            <div className="space-y-3">
              {visibleMerchants.map((merchant) => {
                const activeSeasons = mockSeasons.filter(s => s.merchantId === merchant.id && s.quizStatus === "active");
                // Get best season for prize display
                const bestSeason = activeSeasons.sort((a, b) => b.totalWinningPrizes - a.totalWinningPrizes)[0];
                const totalParticipants = activeSeasons.reduce((sum, s) => sum + s.totalParticipants, 0);

                return (
                  <Card
                    key={merchant.id}
                    className="cursor-pointer hover:border-blue-300 transition-all touch-manipulation"
                    onClick={() => setSelectedMerchant(merchant)}
                  >
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-lg">
                          <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">
                            {merchant.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className="text-sm font-bold truncate">{merchant.name}</h4>
                            {merchant.isVerified && <span className="text-blue-500 text-xs">✓</span>}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-[9px]">{merchant.category}</Badge>
                            <span className="text-[10px] text-muted-foreground">{activeSeasons.length} season{activeSeasons.length !== 1 ? "s" : ""}</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <Users className="h-2.5 w-2.5" />{totalParticipants.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                      </div>

                      {/* Winning Prizes Display */}
                      {bestSeason && (
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-lg p-2.5 border border-amber-200/50 dark:border-amber-800/30">
                          <div className="flex items-center gap-1 mb-1.5">
                            <Trophy className="h-3 w-3 text-amber-500" />
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">Winning Prizes</span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
                            <span className="text-muted-foreground">🥇 1st Prize:</span>
                            <span className="font-semibold">{formatLocalAmount(bestSeason.firstPrize, "NGN")}</span>
                            <span className="text-muted-foreground">🥈 2nd Prize:</span>
                            <span className="font-semibold">{formatLocalAmount(bestSeason.secondPrize, "NGN")}</span>
                            <span className="text-muted-foreground">🥉 3rd Prize:</span>
                            <span className="font-semibold">{formatLocalAmount(bestSeason.thirdPrize, "NGN")}</span>
                            {bestSeason.consolationPrizesEnabled && (
                              <>
                                <span className="text-muted-foreground">🎁 Consolation:</span>
                                <span className="font-semibold">{formatLocalAmount(bestSeason.consolationPrizePerPlayer, "NGN")} × {bestSeason.consolationPrizeCount}</span>
                              </>
                            )}
                          </div>
                          <div className="mt-1.5 pt-1.5 border-t border-amber-200/50 dark:border-amber-800/30">
                            <div className="flex justify-between text-[10px]">
                              <span className="font-bold text-amber-700 dark:text-amber-400">Total Prize Pool:</span>
                              <span className="font-bold text-green-600">{formatLocalAmount(bestSeason.totalWinningPrizes, "NGN")}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {visibleMerchants.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground text-sm">
                    No active quiz merchants available right now.
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {selectedMerchant && (
        <InteractiveQuizSeasonSheet
          open={!!selectedMerchant}
          onOpenChange={(v) => { if (!v) { setSelectedMerchant(null); onOpenChange(false); } }}
          merchant={selectedMerchant}
          seasons={mockSeasons.filter(s => s.merchantId === selectedMerchant.id && s.quizStatus === "active")}
        />
      )}
      <LiveScoreboardDrawer open={showScoreboard} onOpenChange={setShowScoreboard} />
    </>
  );
}
