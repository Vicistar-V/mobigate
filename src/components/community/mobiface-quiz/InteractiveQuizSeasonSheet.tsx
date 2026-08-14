import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Zap, Trophy, Radio, Gift, Loader2, Star } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { InteractiveQuizPlayDialog } from "./InteractiveQuizPlayDialog";
import { LiveScoreboardDrawer } from "./LiveScoreboardDrawer";

const API = "/api/quiz/interactive.php";
const CONTINUE_STAKE_PERCENT = 50;

interface Season {
  id: string; name: string; type: string; entry_fee: string;
  first_prize: string; second_prize: string; third_prize: string;
  consolation_prizes_enabled: number; consolation_prize_per_player: string; consolation_prize_count: number;
  quiz_status: string; start_date: string; end_date: string;
}
interface Entry { total_points: number; total_winnings: string; total_plays: number; qualified: number; final_rank?: string; final_prize?: string }

interface InteractiveQuizSeasonSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchantId: string;
  merchantName: string;
}

export function InteractiveQuizSeasonSheet({ open, onOpenChange, merchantId, merchantName }: InteractiveQuizSeasonSheetProps) {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [qualifyingPoints, setQualifyingPoints] = useState(300);
  const [showPlay, setShowPlay] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingEntry, setLoadingEntry] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`${API}?action=seasons&merchant_id=${merchantId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setSeasons(d.seasons ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, merchantId]);

  const loadEntry = useCallback((seasonId: string) => {
    setLoadingEntry(true);
    fetch(`${API}?action=my_entry&season_id=${seasonId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => { setEntry(d.entry); setQualifyingPoints(d.qualifying_points ?? 300); })
      .catch(() => {})
      .finally(() => setLoadingEntry(false));
  }, []);

  const handleSelectSeason = (season: Season) => {
    setSelectedSeason(season);
    loadEntry(season.id);
  };

  const getSeasonTypeColor = (type: string) => {
    switch (type) {
      case "Short": return "bg-green-100 text-green-700 border-green-300";
      case "Medium": return "bg-amber-100 text-amber-700 border-amber-300";
      case "Complete": return "bg-purple-100 text-purple-700 border-purple-300";
      default: return "";
    }
  };

  const entryFee = selectedSeason ? parseFloat(selectedSeason.entry_fee) : 0;
  const nextFee = entry && entry.total_plays > 0 ? Math.round(entryFee * CONTINUE_STAKE_PERCENT / 100) : entryFee;
  const totalPrizePool = selectedSeason
    ? parseFloat(selectedSeason.first_prize) + parseFloat(selectedSeason.second_prize) + parseFloat(selectedSeason.third_prize) +
      (selectedSeason.consolation_prizes_enabled ? parseFloat(selectedSeason.consolation_prize_per_player) * selectedSeason.consolation_prize_count : 0)
    : 0;

  return (
    <>
      <Drawer open={open && !showPlay} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="text-left pb-2">
            <DrawerTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-5 w-5 text-blue-500" /> {merchantName}
            </DrawerTitle>
            <p className="text-sm text-muted-foreground">Select a season to compete in</p>
            <button
              onClick={() => setShowScoreboard(true)}
              className="flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-200/30 active:scale-95 transition-all touch-manipulation w-fit"
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
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-7 w-7 animate-spin text-blue-500" /></div>
              ) : seasons.map((season) => {
                const seasonTotal = parseFloat(season.first_prize) + parseFloat(season.second_prize) + parseFloat(season.third_prize) +
                  (season.consolation_prizes_enabled ? parseFloat(season.consolation_prize_per_player) * season.consolation_prize_count : 0);
                return (
                  <Card
                    key={season.id}
                    className={`cursor-pointer transition-all touch-manipulation ${
                      selectedSeason?.id === season.id ? "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "hover:border-blue-300"
                    }`}
                    onClick={() => handleSelectSeason(season)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="text-base font-bold break-words">{season.name}</h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={`text-xs ${getSeasonTypeColor(season.type)}`}>{season.type} Season</Badge>
                            {season.quiz_status === "active" && (
                              <Badge className="text-xs bg-red-500 text-white border-0 animate-pulse">
                                <Radio className="h-3 w-3 mr-1" /> LIVE
                              </Badge>
                            )}
                            {!!season.consolation_prizes_enabled && (
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600 border-purple-200">
                                <Gift className="h-3 w-3 mr-0.5" /> Consolation
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {season.start_date && format(new Date(season.start_date), "MMM d, yyyy")} — {season.end_date && format(new Date(season.end_date), "MMM d, yyyy")}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">{season.quiz_status}</Badge>
                      </div>

                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-lg p-3 border border-amber-200/50 dark:border-amber-800/30">
                        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-1.5 flex items-center gap-1">
                          <Trophy className="h-3.5 w-3.5" /> Game Show Prizes
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <span className="text-muted-foreground">🥇 1st:</span>
                          <span className="font-semibold">{formatLocalAmount(parseFloat(season.first_prize), "NGN")}</span>
                          <span className="text-muted-foreground">🥈 2nd:</span>
                          <span className="font-semibold">{formatLocalAmount(parseFloat(season.second_prize), "NGN")}</span>
                          <span className="text-muted-foreground">🥉 3rd:</span>
                          <span className="font-semibold">{formatLocalAmount(parseFloat(season.third_prize), "NGN")}</span>
                          {!!season.consolation_prizes_enabled && (
                            <>
                              <span className="text-muted-foreground">🎁 Consolation:</span>
                              <span className="font-semibold">{formatLocalAmount(parseFloat(season.consolation_prize_per_player), "NGN")} × {season.consolation_prize_count}</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          Total: <span className="font-bold text-green-600">{formatLocalAmount(seasonTotal, "NGN")}</span>
                        </p>
                      </div>

                      <div className="p-2 bg-muted/50 rounded text-center">
                        <p className="text-xs text-muted-foreground">Entry Fee</p>
                        <p className="font-bold text-sm text-red-600">{formatMobiAmount(parseFloat(season.entry_fee))}</p>
                      </div>

                      {/* My progress in this season */}
                      {selectedSeason?.id === season.id && (
                        loadingEntry ? (
                          <div className="flex justify-center py-2"><Loader2 className="h-5 w-5 animate-spin text-blue-500" /></div>
                        ) : entry && (
                          <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 space-y-2">
                            {entry.final_rank ? (
                              <div className="text-center">
                                <p className="text-sm font-bold text-amber-600">Season Complete — You placed {entry.final_rank}!</p>
                                {parseFloat(entry.final_prize ?? "0") > 0 && (
                                  <p className="text-xs text-green-600 font-medium">Won {formatLocalAmount(parseFloat(entry.final_prize ?? "0"), "NGN")}</p>
                                )}
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3" /> Qualifying Points</span>
                                  <span className="font-semibold">{entry.total_points}/{qualifyingPoints}</span>
                                </div>
                                <Progress value={Math.min(100, (entry.total_points / qualifyingPoints) * 100)} className="h-1.5" />
                                {!!entry.qualified && (
                                  <Badge className="bg-green-500 text-white border-0 text-xs">✓ Qualified for Season Finals</Badge>
                                )}
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>{entry.total_plays} plays</span>
                                  <span>Won so far: {formatLocalAmount(parseFloat(entry.total_winnings), "NGN")}</span>
                                </div>
                              </>
                            )}
                          </div>
                        )
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {!loading && seasons.length === 0 && (
                <Card><CardContent className="p-6 text-center text-muted-foreground text-sm">No seasons available.</CardContent></Card>
              )}
            </div>
          </div>

          <div className="px-4 pb-4 pt-2 border-t">
            <Button
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
              onClick={() => setShowPlay(true)}
              disabled={!selectedSeason || selectedSeason.quiz_status !== "active" || !!entry?.final_rank}
            >
              <Zap className="h-4 w-4 mr-2" />
              {!selectedSeason ? "Select a Season" :
                entry?.final_rank ? "Season Completed" :
                `${entry && entry.total_plays > 0 ? "Continue" : "Join"} - Pay ${formatMobiAmount(nextFee)} (${formatLocalAmount(nextFee, "NGN")})`}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {selectedSeason && (
        <InteractiveQuizPlayDialog
          open={showPlay}
          onOpenChange={(v) => { if (!v) { setShowPlay(false); loadEntry(selectedSeason.id); } }}
          seasonId={selectedSeason.id}
          entryFee={entryFee}
        />
      )}
      <LiveScoreboardDrawer open={showScoreboard} onOpenChange={setShowScoreboard} />
    </>
  );
}
