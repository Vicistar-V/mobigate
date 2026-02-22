import { useState } from "react";
import { ChevronDown, Trophy, Crown, Medal, Gift, Ticket, Tv } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import type { QuizSeason } from "@/data/mobigateInteractiveQuizData";

interface SeasonDetailsRevealProps {
  season: QuizSeason;
}

export function SeasonDetailsReveal({ season }: SeasonDetailsRevealProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Content - clipped when collapsed, showing a teaser */}
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          expanded ? "max-h-[600px]" : "max-h-[100px]"
        }`}
      >
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
          <div className="px-3 py-2 space-y-1.5">
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
          <div className="px-3 py-2 space-y-1.5">
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
        <div className="px-3 py-2 pb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">Level {season.currentLevel}/{season.selectionLevels}</span>
          </div>
          <Progress value={(season.currentLevel / season.selectionLevels) * 100} className="h-2" />
        </div>
      </div>

      {/* Gradient fade overlay when collapsed */}
      {!expanded && (
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card via-card/90 to-transparent pointer-events-none" />
      )}

      {/* View More / View Less button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="relative z-10 w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-primary hover:bg-muted/30 transition-colors touch-manipulation active:bg-muted/50 border-t"
      >
        <span>{expanded ? "Show Less" : "View More"}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}
