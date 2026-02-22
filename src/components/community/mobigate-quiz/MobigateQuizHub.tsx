import { useState } from "react";
import { X, Users, Trophy, Gamepad2, ShoppingCart, GraduationCap, Zap, Wallet, Globe, Flame, ChevronRight, Star, Repeat } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { mobigateWalletData, mobigatePlayerStats } from "@/data/mobigateQuizData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { GroupQuizInviteSheet } from "./GroupQuizInviteSheet";
import { StandardQuizCategorySelect } from "./StandardQuizCategorySelect";
import { InteractiveQuizMerchantSheet } from "./InteractiveQuizMerchantSheet";
import { FoodQuizItemSelectSheet } from "./FoodQuizItemSelectSheet";
import { ScholarshipQuizSetupSheet } from "./ScholarshipQuizSetupSheet";
import { ToggleQuizPlayDialog } from "./ToggleQuizPlayDialog";

interface MobigateQuizHubProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GAME_MODES = [
  {
    id: "group",
    title: "Group Quiz",
    description: "Invite 3-10 friends, set a consensus stake, winner takes multiplied prizes!",
    icon: Users,
    gradient: "from-purple-500 to-violet-600",
    bgLight: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-300 dark:border-purple-700",
    minStake: 5000,
    badge: "👥 Multiplayer",
  },
  {
    id: "standard",
    title: "Standard Quiz",
    description: "Select category and level, play 10 questions. Continue for up to 10x multiplied prizes!",
    icon: Gamepad2,
    gradient: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-300 dark:border-amber-700",
    minStake: 200,
    badge: "🎯 Solo Play",
  },
  {
    id: "interactive",
    title: "Interactive Quiz",
    description: "Merchant-sponsored seasons with selection levels and live shows. Become a Mobi-Celebrity!",
    icon: Star,
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-300 dark:border-blue-700",
    minStake: 2000,
    badge: "📺 Live Shows",
  },
  {
    id: "food",
    title: "Food for Home",
    description: "Select grocery items, play to win them! Stake just 20% of item value.",
    icon: ShoppingCart,
    gradient: "from-green-500 to-emerald-500",
    bgLight: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-300 dark:border-green-700",
    minStake: 1000,
    badge: "🛒 Win Groceries",
  },
  {
    id: "scholarship",
    title: "Scholarship Quiz",
    description: "Play to win annual scholarship funding! One game covers one year of education.",
    icon: GraduationCap,
    gradient: "from-indigo-500 to-purple-500",
    bgLight: "bg-indigo-50 dark:bg-indigo-950/30",
    borderColor: "border-indigo-300 dark:border-indigo-700",
    minStake: 30000,
    badge: "🎓 Education",
  },
  {
    id: "toggle",
    title: "Toggle Quiz",
    description: "Win 500% or risk it all for up to 1500%! Toggle through 7 sessions — each one higher stakes. Complete all to earn Mobi Celebrity!",
    icon: Repeat,
    gradient: "from-teal-500 to-cyan-600",
    bgLight: "bg-teal-50 dark:bg-teal-950/30",
    borderColor: "border-teal-300 dark:border-teal-700",
    minStake: 500,
    badge: "🔄 Toggle Risk",
  },
];

export function MobigateQuizHub({ open, onOpenChange }: MobigateQuizHubProps) {
  const [activeFlow, setActiveFlow] = useState<string | null>(null);

  const handleClose = () => {
    setActiveFlow(null);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open && !activeFlow} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[95vh] p-0 gap-0">
          {/* Header */}
          <div className="p-4 pb-3 sticky top-0 bg-gradient-to-r from-amber-500 to-orange-500 z-10 border-b text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Mobigate Quiz <Flame className="h-4 w-4" />
                  </h2>
              <p className="text-xs text-amber-100">Choose your game mode</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain">
            <div className="p-4 space-y-4">
              {/* Wallet Bar */}
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-amber-700 dark:text-amber-300">Your Wallet</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-amber-700 dark:text-amber-300">{formatLocalAmount(mobigateWalletData.balance, "NGN")}</span>
                      <p className="text-xs text-amber-500">({formatMobiAmount(mobigateWalletData.balance)})</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-amber-200 dark:border-amber-700">
                    <div className="text-center">
                      <p className="text-xs text-amber-600">Rank</p>
                      <p className="font-bold text-sm text-amber-700">#{mobigatePlayerStats.globalRank}</p>
                    </div>
                    <div className="text-center border-x border-amber-200 dark:border-amber-700">
                      <p className="text-xs text-amber-600">Streak</p>
                      <p className="font-bold text-sm text-amber-700 flex items-center justify-center gap-1">
                        {mobigatePlayerStats.currentStreak} <Flame className="h-3 w-3 text-orange-500" />
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-amber-600">Won</p>
                      <p className="font-bold text-sm text-green-600">+{formatLocalAmount(mobigatePlayerStats.netProfit, "NGN")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Game Mode Cards */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Select Game Mode</h3>
                {GAME_MODES.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <Card
                      key={mode.id}
                      className={`overflow-hidden border ${mode.borderColor} cursor-pointer active:scale-[0.98] transition-all touch-manipulation`}
                      onClick={() => setActiveFlow(mode.id)}
                    >
                      <CardContent className="p-0">
                        <div className={`bg-gradient-to-r ${mode.gradient} p-3 flex items-center gap-3`}>
                          <div className="p-2 bg-white/20 rounded-lg shrink-0">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="font-bold text-white text-base">{mode.title}</h3>
                            </div>
                            <Badge className="text-xs bg-white/20 border-0 text-white px-2 py-0.5">{mode.badge}</Badge>
                          </div>
                          <ChevronRight className="h-5 w-5 text-white/70 shrink-0" />
                        </div>
                        <div className={`px-3 py-2.5 ${mode.bgLight}`}>
                          <p className="text-sm text-muted-foreground leading-relaxed">{mode.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">Min Stake: <span className="font-semibold">{formatMobiAmount(mode.minStake)}</span></span>
                            <Button size="sm" className={`h-7 text-xs bg-gradient-to-r ${mode.gradient} text-white border-0`}>
                              <Zap className="h-3 w-3 mr-1" /> Play
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Global Stats */}
              <Card className="border-muted">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase">Your Stats</h4>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="font-bold text-base">{mobigatePlayerStats.gamesPlayed}</p>
                      <p className="text-xs text-muted-foreground">Played</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="font-bold text-base text-green-600">{mobigatePlayerStats.gamesWon}</p>
                      <p className="text-xs text-muted-foreground">Won</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="font-bold text-base text-amber-600">{mobigatePlayerStats.partialWins}</p>
                      <p className="text-xs text-muted-foreground">Partial</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="font-bold text-base text-red-500">{mobigatePlayerStats.gamesLost}</p>
                      <p className="text-xs text-muted-foreground">Lost</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Game Flow Sheets */}
      <GroupQuizInviteSheet open={activeFlow === "group"} onOpenChange={(v) => !v && setActiveFlow(null)} />
      <StandardQuizCategorySelect open={activeFlow === "standard"} onOpenChange={(v) => !v && setActiveFlow(null)} />
      <InteractiveQuizMerchantSheet open={activeFlow === "interactive"} onOpenChange={(v) => !v && setActiveFlow(null)} />
      <FoodQuizItemSelectSheet open={activeFlow === "food"} onOpenChange={(v) => !v && setActiveFlow(null)} />
      <ScholarshipQuizSetupSheet open={activeFlow === "scholarship"} onOpenChange={(v) => !v && setActiveFlow(null)} />
      <ToggleQuizPlayDialog open={activeFlow === "toggle"} onOpenChange={(v) => !v && setActiveFlow(null)} />
    </>
  );
}
