import { useNavigate } from "react-router-dom";
import { Trophy, Users, Gamepad2, BadgeCheck, ChevronRight, Gift, Sparkles } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/ui/drawer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockMerchants, mockSeasons } from "@/data/mobigateInteractiveQuizData";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";

interface RetailMerchantQuizBrowseDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  retailMerchantId: string;
  retailMerchantName: string;
}

export function RetailMerchantQuizBrowseDrawer({
  open,
  onOpenChange,
  retailMerchantId,
  retailMerchantName,
}: RetailMerchantQuizBrowseDrawerProps) {
  const navigate = useNavigate();

  // Get bulk merchants with active quiz offerings
  const bulkMerchantsWithQuizzes = mockMerchants
    .filter((m) => m.applicationStatus === "approved")
    .map((m) => {
      const activeSeasons = mockSeasons.filter(
        (s) => s.merchantId === m.id && s.quizStatus === "active"
      );
      const totalPrize = activeSeasons.reduce((sum, s) => sum + s.totalWinningPrizes, 0);
      const totalParticipants = activeSeasons.reduce((sum, s) => sum + s.totalParticipants, 0);
      return { ...m, activeSeasons, totalPrize, totalParticipants };
    })
    .filter((m) => m.activeSeasons.length > 0);

  const handleSelectMerchant = (bulkMerchantId: string) => {
    onOpenChange(false);
    navigate(`/mobi-quiz-games/merchant/${bulkMerchantId}?ref=${retailMerchantId}`);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh] flex flex-col">
        <DrawerHeader className="shrink-0 pb-2">
          <DrawerTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Browse Quiz Merchants
          </DrawerTitle>
        </DrawerHeader>

        <DrawerBody className="flex-1 overflow-y-auto px-4 pb-6">
          {/* Referral reward banner */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Gift className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Earn rewards for {retailMerchantName}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Activities you start here earn 1% rewards for this retail merchant
              </p>
            </div>
          </div>

          {bulkMerchantsWithQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <Gamepad2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No merchants with active quizzes right now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bulkMerchantsWithQuizzes.map((merchant) => {
                const bestSeason = merchant.activeSeasons.reduce(
                  (best, s) => (s.totalWinningPrizes > best.totalWinningPrizes ? s : best),
                  merchant.activeSeasons[0]
                );

                return (
                  <Card
                    key={merchant.id}
                    className="overflow-hidden cursor-pointer active:scale-[0.98] transition-all touch-manipulation border-border/60 hover:shadow-md"
                    onClick={() => handleSelectMerchant(merchant.id)}
                  >
                    <div className="p-4">
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
                              {merchant.activeSeasons.length} season{merchant.activeSeasons.length !== 1 ? "s" : ""}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-3.5 w-3.5" />
                              {merchant.totalParticipants.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {bestSeason && (
                            <div className="bg-gradient-to-br from-amber-500/15 to-amber-600/5 rounded-lg px-2.5 py-1.5 border border-amber-500/20">
                              <div className="flex items-center gap-1 mb-0.5">
                                <Trophy className="h-3 w-3 text-amber-600" />
                                <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">Top Prize</span>
                              </div>
                              <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
                                {formatLocalAmount(bestSeason.totalWinningPrizes, "NGN")}
                              </p>
                            </div>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground mt-2 ml-auto" />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
