import { useState, useEffect } from "react";
import { ChevronRight, Star, Radio, Loader2 } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockSeasonWinners } from "@/data/mobifaceInteractiveQuizData";
import { InteractiveQuizSeasonSheet } from "./InteractiveQuizSeasonSheet";
import { LiveScoreboardDrawer } from "./LiveScoreboardDrawer";
import { HighlightedWinnersCarousel } from "./HighlightedWinnersCarousel";

const API = "/api/quiz/interactive.php";

interface Merchant {
  id: string; name: string; category: string; is_verified: number; active_seasons: number;
}

interface InteractiveQuizMerchantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMerchantId?: string;
}

export function InteractiveQuizMerchantSheet({ open, onOpenChange, initialMerchantId }: InteractiveQuizMerchantSheetProps) {
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`${API}?action=merchants`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        const list: Merchant[] = d.merchants ?? [];
        setMerchants(list);
        if (initialMerchantId) {
          const found = list.find((m) => m.id === initialMerchantId);
          if (found) setSelectedMerchant(found);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, initialMerchantId]);

  return (
    <>
      <Drawer open={open && !selectedMerchant} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="text-left pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" /> Interactive Quiz - Merchants
            </DrawerTitle>
            <p className="text-sm text-muted-foreground">Choose a merchant to explore quiz seasons</p>
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
              <Radio className="h-4 w-4 text-red-500" />
              <span className="text-sm font-bold text-red-600 dark:text-red-400">Live Scoreboard</span>
              <Badge className="bg-red-500 text-white border-0 text-xs px-2 py-0.5 animate-pulse">LIVE</Badge>
            </button>
          </div>

          {/* Highlighted Winners Carousel */}
          {mockSeasonWinners.some(w => w.isHighlighted) && (
            <HighlightedWinnersCarousel />
          )}

          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4 pb-4">
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-7 w-7 animate-spin text-blue-500" /></div>
              ) : merchants.map((merchant) => (
                <Card
                  key={merchant.id}
                  className="cursor-pointer hover:border-blue-300 transition-all touch-manipulation"
                  onClick={() => setSelectedMerchant(merchant)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14 rounded-lg">
                        <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700 text-sm font-bold">
                          {merchant.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <h4 className="text-base font-bold break-words">{merchant.name}</h4>
                          {!!merchant.is_verified && <span className="text-blue-500 text-sm">✓</span>}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">{merchant.category}</Badge>
                          <span className="text-xs text-muted-foreground">{merchant.active_seasons} season{merchant.active_seasons !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {!loading && merchants.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground text-sm">
                    No active quiz merchants available right now.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {selectedMerchant && (
        <InteractiveQuizSeasonSheet
          open={!!selectedMerchant}
          onOpenChange={(v) => { if (!v) { setSelectedMerchant(null); onOpenChange(false); } }}
          merchantId={selectedMerchant.id}
          merchantName={selectedMerchant.name}
        />
      )}
      <LiveScoreboardDrawer open={showScoreboard} onOpenChange={setShowScoreboard} />
    </>
  );
}
