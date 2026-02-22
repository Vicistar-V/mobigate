import { useState, useRef, useEffect, useCallback } from "react";
import { Crown, Medal, Trophy, Star, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockSeasonWinners, mockSeasons, mockMerchants, type SeasonWinner } from "@/data/mobigateInteractiveQuizData";
import { QuizWinnerProfileDrawer } from "./QuizWinnerProfileDrawer";

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

  const handleFan = useCallback((e: React.MouseEvent, winner: SeasonWinner) => {
    e.stopPropagation();
    if (fannedWinners.has(winner.id)) return;
    setFannedWinners(prev => new Set(prev).add(winner.id));
    toast({
      title: "⭐ You're now a fan!",
      description: `M200 debited. Following ${winner.playerName}!`,
    });
  }, [fannedWinners, toast]);

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
                className="snap-center shrink-0 w-[130px] rounded-2xl border bg-gradient-to-b from-amber-50/80 to-background dark:from-amber-950/20 dark:to-background border-amber-200/50 dark:border-amber-800/30 p-3 flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform touch-manipulation"
                onClick={() => handleCardClick(winner)}
              >
                {/* Position icon */}
                {getPositionIcon(winner.position)}

                {/* Photo - rounded square */}
                <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-amber-300/40 shadow-sm">
                  <img
                    src={winner.playerAvatar}
                    alt={winner.playerName}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Name */}
                <p className="text-sm font-bold text-center leading-tight truncate w-full">{winner.playerName.split(" ")[0]}</p>

                {/* Tier + Fans */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3 text-blue-500" />
                  <span className="font-bold">T{winner.tier}</span>
                  <span>·</span>
                  <span>{formatCompact(winner.fans)} fans</span>
                </div>

                {/* Fan button */}
                <button
                  className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors touch-manipulation ${
                    isFanned
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 text-white active:from-amber-600 active:to-orange-600"
                  }`}
                  disabled={isFanned}
                  onClick={(e) => handleFan(e, winner)}
                >
                  <Star className="h-3.5 w-3.5" fill={isFanned ? "currentColor" : "none"} />
                  {isFanned ? "Fanned" : "Fan M200"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

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
