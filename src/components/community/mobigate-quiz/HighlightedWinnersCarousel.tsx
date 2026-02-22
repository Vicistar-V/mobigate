import { useState, useRef, useEffect, useCallback } from "react";
import { Crown, Medal, Trophy, Star, Shield, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockSeasonWinners, mockSeasons, mockMerchants, type SeasonWinner } from "@/data/mobigateInteractiveQuizData";
import { QuizWinnerProfileDrawer } from "./QuizWinnerProfileDrawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function HighlightedWinnersCarousel() {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fannedWinners, setFannedWinners] = useState<Set<string>>(new Set());
  const [selectedWinner, setSelectedWinner] = useState<SeasonWinner | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [fanConfirmWinner, setFanConfirmWinner] = useState<SeasonWinner | null>(null);

  const highlightedWinners = mockSeasonWinners.filter(w => w.isHighlighted);

  // Auto-scroll
  useEffect(() => {
    if (highlightedWinners.length <= 2 || isTouching) return;
    const el = scrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 140, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [highlightedWinners.length, isTouching]);

  const handleFanClick = useCallback((e: React.MouseEvent, winner: SeasonWinner) => {
    e.stopPropagation();
    if (fannedWinners.has(winner.id)) return;
    setFanConfirmWinner(winner);
  }, [fannedWinners]);

  const confirmFan = useCallback(() => {
    if (!fanConfirmWinner) return;
    setFannedWinners(prev => new Set(prev).add(fanConfirmWinner.id));
    toast({
      title: "⭐ You're now a fan!",
      description: `M200 debited. Following ${fanConfirmWinner.playerName}!`,
    });
    setFanConfirmWinner(null);
  }, [fanConfirmWinner, toast]);

  const handleCardClick = useCallback((winner: SeasonWinner) => {
    setSelectedWinner(winner);
    setDrawerOpen(true);
  }, []);

  const getPositionIcon = (position: string) => {
    switch (position) {
      case "1st": return <Crown className="h-4 w-4 text-amber-500" />;
      case "2nd": return <Medal className="h-4 w-4 text-slate-400" />;
      case "3rd": return <Medal className="h-4 w-4 text-amber-700" />;
      default: return <Trophy className="h-4 w-4 text-purple-500" />;
    }
  };

  const getMerchantName = (winner: SeasonWinner) => {
    const season = mockSeasons.find(s => s.id === winner.seasonId);
    if (!season) return "";
    const merchant = mockMerchants.find(m => m.id === season.merchantId);
    return merchant?.name || "";
  };

  const getSeasonName = (winner: SeasonWinner) => {
    return mockSeasons.find(s => s.id === winner.seasonId)?.name || "";
  };

  if (highlightedWinners.length === 0) return null;

  return (
    <>
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <Star className="h-4 w-4 text-amber-500" fill="currentColor" />
          <span className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Highlighted Winners</span>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory touch-pan-x pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
          onTouchStart={() => setIsTouching(true)}
          onTouchEnd={() => setTimeout(() => setIsTouching(false), 5000)}
        >
          {highlightedWinners.map((winner) => {
            const isFanned = fannedWinners.has(winner.id);

            return (
              <div
                key={winner.id}
                className="snap-center shrink-0 w-[140px] rounded-2xl border bg-gradient-to-b from-amber-50/80 to-background dark:from-amber-950/20 dark:to-background border-amber-200/50 dark:border-amber-800/30 p-3 flex flex-col items-center cursor-pointer active:scale-[0.97] transition-transform touch-manipulation"
                onClick={() => handleCardClick(winner)}
              >
                {/* Row 1: Position icon */}
                <div className="mb-1.5">
                  {getPositionIcon(winner.position)}
                </div>

                {/* Row 2: Photo - rounded square */}
                <div className="h-[84px] w-[84px] rounded-xl overflow-hidden border-2 border-amber-300/40 shadow-md mb-2">
                  <img
                    src={winner.playerAvatar}
                    alt={winner.playerName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Row 3: Name */}
                <p className="text-[15px] font-bold text-center leading-snug truncate w-full mb-1">
                  {winner.playerName.split(" ")[0]}
                </p>

                {/* Row 4: Tier + Fans stacked for clarity */}
                <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground mb-1.5">
                  <span className="font-bold">{winner.tier}</span>
                  <Star className="h-3.5 w-3.5 text-amber-500 shrink-0" fill="currentColor" />
                  <span className="text-muted-foreground/50">·</span>
                  <span>{formatCompact(winner.fans)} fans</span>
                </div>

                {/* Row 5: Fan button - full width */}
                <button
                  className={`w-full py-1.5 rounded-lg text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors touch-manipulation active:scale-[0.97] ${
                    isFanned
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 text-white active:from-amber-600 active:to-orange-600 shadow-sm"
                  }`}
                  disabled={isFanned}
                  onClick={(e) => handleFanClick(e, winner)}
                >
                  {isFanned ? "Joined" : "Join Fans"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fan Confirmation Dialog */}
      <AlertDialog open={!!fanConfirmWinner} onOpenChange={(open) => !open && setFanConfirmWinner(null)}>
        <AlertDialogContent className="max-w-[340px] rounded-2xl">
          <AlertDialogHeader className="text-center">
            <div className="flex justify-center mb-2">
              {fanConfirmWinner && (
                <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-amber-300/40 shadow-md">
                  <img
                    src={fanConfirmWinner.playerAvatar}
                    alt={fanConfirmWinner.playerName}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
            <AlertDialogTitle className="text-base">
              Become a fan of {fanConfirmWinner?.playerName}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This will debit <span className="font-bold text-foreground">M200</span> from your wallet. You'll follow their quiz journey and get updates.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel className="flex-1 h-12 touch-manipulation active:scale-[0.97]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 touch-manipulation active:scale-[0.97]"
              onClick={confirmFan}
            >
              Join Fans
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <QuizWinnerProfileDrawer
        winner={selectedWinner}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        merchantName={selectedWinner ? getMerchantName(selectedWinner) : undefined}
        seasonName={selectedWinner ? getSeasonName(selectedWinner) : undefined}
      />
    </>
  );
}
