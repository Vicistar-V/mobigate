import { useState, useMemo } from "react";
import {
  Search, SlidersHorizontal, X, Calendar, ChevronRight,
  Gift, RotateCcw, ArrowDownUp, User, Gamepad2, TrendingUp,
  CheckCircle, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { quizPlayers, QuizPlayer } from "@/data/quizPlayersData";
import { formatLocalAmount, formatMobiAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ActionMode = "bonus" | "refund";

type SortOption =
  | "most_recent"
  | "oldest"
  | "lowest_stake"
  | "highest_stake"
  | "highest_frequency";

const sortLabels: Record<SortOption, string> = {
  most_recent: "Most Recent",
  oldest: "Oldest",
  lowest_stake: "Lowest Stake",
  highest_stake: "Highest Stake",
  highest_frequency: "Highest Frequency",
};

interface QuizPlayerSelectDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ActionMode;
}

export function QuizPlayerSelectDrawer({ open, onOpenChange, mode }: QuizPlayerSelectDrawerProps) {
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<SortOption>("most_recent");
  const [showFilters, setShowFilters] = useState(false);
  const [nameSearch, setNameSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [stakeMin, setStakeMin] = useState("");
  const [stakeMax, setStakeMax] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<QuizPlayer | null>(null);
  const [actionAmount, setActionAmount] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const isBonus = mode === "bonus";
  const themeColor = isBonus ? "emerald" : "blue";

  const resetFilters = () => {
    setNameSearch("");
    setDateFrom("");
    setDateTo("");
    setStakeMin("");
    setStakeMax("");
    setSortBy("most_recent");
  };

  const resetAll = () => {
    resetFilters();
    setSelectedPlayer(null);
    setActionAmount("");
    setActionReason("");
    setShowFilters(false);
    setShowSortMenu(false);
  };

  const filteredPlayers = useMemo(() => {
    let result = [...quizPlayers];

    // Name filter
    if (nameSearch.trim()) {
      const q = nameSearch.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.registrationNumber.toLowerCase().includes(q)
      );
    }

    // Date range filter
    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((p) => p.lastPlayedDate >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((p) => p.lastPlayedDate <= to);
    }

    // Stake range filter
    if (stakeMin) {
      const min = parseFloat(stakeMin);
      if (!isNaN(min)) result = result.filter((p) => p.totalStakePaid >= min);
    }
    if (stakeMax) {
      const max = parseFloat(stakeMax);
      if (!isNaN(max)) result = result.filter((p) => p.totalStakePaid <= max);
    }

    // Sort
    switch (sortBy) {
      case "most_recent":
        result.sort((a, b) => b.lastPlayedDate.getTime() - a.lastPlayedDate.getTime());
        break;
      case "oldest":
        result.sort((a, b) => a.firstPlayedDate.getTime() - b.firstPlayedDate.getTime());
        break;
      case "lowest_stake":
        result.sort((a, b) => a.totalStakePaid - b.totalStakePaid);
        break;
      case "highest_stake":
        result.sort((a, b) => b.totalStakePaid - a.totalStakePaid);
        break;
      case "highest_frequency":
        result.sort((a, b) => b.totalGamesPlayed - a.totalGamesPlayed);
        break;
    }

    return result;
  }, [nameSearch, dateFrom, dateTo, stakeMin, stakeMax, sortBy]);

  const activeFilterCount = [nameSearch, dateFrom, dateTo, stakeMin, stakeMax].filter(Boolean).length;

  const handleConfirmAction = () => {
    const amount = parseFloat(actionAmount);
    if (!selectedPlayer || !amount || amount <= 0) {
      toast({ title: "Invalid", description: "Select a player and enter a valid amount.", variant: "destructive" });
      return;
    }
    toast({
      title: isBonus ? "Bonus Awarded" : "Refund Processed",
      description: `${formatLocalAmount(amount, "NGN")} (${formatMobiAmount(amount)}) ${isBonus ? "awarded to" : "refunded to"} ${selectedPlayer.name}.`,
    });
    resetAll();
    onOpenChange(false);
  };

  const handleClose = () => {
    resetAll();
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DrawerContent className="h-[92vh] overflow-hidden touch-auto p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn(
            "flex-shrink-0 p-4 text-white",
            isBonus
              ? "bg-gradient-to-r from-emerald-600 to-emerald-500"
              : "bg-gradient-to-r from-blue-600 to-blue-500"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  {isBonus ? <Gift className="h-5 w-5" /> : <RotateCcw className="h-5 w-5" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{isBonus ? "Award Bonus" : "Refund to Player"}</h2>
                  <p className="text-xs opacity-80">Select a player from the list below</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* If player is selected, show action form */}
          {selectedPlayer ? (
            <div className="flex-1 overflow-y-auto touch-auto">
              <div className="px-4 py-4 space-y-4 pb-8">
                {/* Selected Player Summary */}
                <div className={cn(
                  "p-3 rounded-xl border-2 space-y-2",
                  isBonus ? "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20"
                )}>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
                      <AvatarImage src={selectedPlayer.avatar} />
                      <AvatarFallback className="text-sm font-bold">
                        {selectedPlayer.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{selectedPlayer.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedPlayer.registrationNumber}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setSelectedPlayer(null)}
                    >
                      Change
                    </Button>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Games</p>
                      <p className="text-sm font-bold">{selectedPlayer.totalGamesPlayed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Stake</p>
                      <p className="text-sm font-bold">{formatLocalAmount(selectedPlayer.totalStakePaid, "NGN")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Won</p>
                      <p className="text-sm font-bold text-green-600">{formatLocalAmount(selectedPlayer.totalAmountWon, "NGN")}</p>
                    </div>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{isBonus ? "Bonus" : "Refund"} Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₦</span>
                    <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={actionAmount}
                      onChange={(e) => setActionAmount(e.target.value)}
                      className="pl-8 h-12 text-lg font-semibold touch-manipulation"
                      autoComplete="off"
                      spellCheck={false}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  {actionAmount && parseFloat(actionAmount) > 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                      ≈ {formatMobiAmount(parseFloat(actionAmount))}
                    </p>
                  )}
                </div>

                {/* Reason */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason (optional)</label>
                  <Input
                    placeholder={isBonus ? "e.g. Top performer bonus" : "e.g. Game error compensation"}
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="h-11 text-sm touch-manipulation"
                    autoComplete="off"
                    spellCheck={false}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Confirm Button */}
                <Button
                  className={cn(
                    "w-full h-12 font-semibold text-white",
                    isBonus ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
                  )}
                  onClick={handleConfirmAction}
                  disabled={!actionAmount || parseFloat(actionAmount) <= 0}
                >
                  {isBonus ? <Gift className="h-4 w-4 mr-2" /> : <RotateCcw className="h-4 w-4 mr-2" />}
                  Confirm {isBonus ? "Bonus" : "Refund"} — {actionAmount && parseFloat(actionAmount) > 0 ? formatLocalAmount(parseFloat(actionAmount), "NGN") : "₦0"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Search + Filter Bar */}
              <div className="flex-shrink-0 px-3 pt-3 pb-2 space-y-2 border-b">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or reg number..."
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    className="pl-9 h-10 text-sm touch-manipulation"
                    autoComplete="off"
                    spellCheck={false}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Sort + Filter row */}
                <div className="flex items-center gap-2">
                  {/* Sort Dropdown */}
                  <div className="relative flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-9 justify-between text-xs font-medium"
                      onClick={() => setShowSortMenu(!showSortMenu)}
                    >
                      <span className="flex items-center gap-1.5">
                        <ArrowDownUp className="h-3.5 w-3.5" />
                        {sortLabels[sortBy]}
                      </span>
                      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showSortMenu && "rotate-180")} />
                    </Button>

                    {showSortMenu && (
                      <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                        {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                          <button
                            key={option}
                            className={cn(
                              "w-full px-3 py-2.5 text-left text-xs font-medium touch-manipulation active:bg-muted/60 flex items-center justify-between",
                              sortBy === option ? "bg-muted" : ""
                            )}
                            onClick={() => {
                              setSortBy(option);
                              setShowSortMenu(false);
                            }}
                          >
                            {sortLabels[option]}
                            {sortBy === option && <CheckCircle className="h-3.5 w-3.5 text-green-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Filters Toggle */}
                  <Button
                    variant={showFilters ? "default" : "outline"}
                    size="sm"
                    className="h-9 text-xs font-medium gap-1.5 shrink-0"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* Expandable Filters Panel */}
                {showFilters && (
                  <div className="space-y-3 pt-1 pb-1 animate-in slide-in-from-top-2 duration-200">
                    {/* Date Range */}
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Date Range (Last Played)
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">From Date</label>
                          <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="h-9 text-xs touch-manipulation"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">To Date</label>
                          <Input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="h-9 text-xs touch-manipulation"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stake Range */}
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Stake Range (Total Paid)
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">Min (₦)</label>
                          <Input
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            value={stakeMin}
                            onChange={(e) => setStakeMin(e.target.value)}
                            className="h-9 text-xs touch-manipulation"
                            autoComplete="off"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Max (₦)</label>
                          <Input
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            value={stakeMax}
                            onChange={(e) => setStakeMax(e.target.value)}
                            className="h-9 text-xs touch-manipulation"
                            autoComplete="off"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reset Filters */}
                    {activeFilterCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-8 text-xs text-muted-foreground"
                        onClick={resetFilters}
                      >
                        <X className="h-3 w-3 mr-1" /> Clear All Filters
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Player List */}
              <ScrollArea className="flex-1 overflow-y-auto touch-auto">
                <div className="px-3 py-2 space-y-1.5 pb-8">
                  {/* Results count */}
                  <p className="text-xs text-muted-foreground px-1 py-1">
                    {filteredPlayers.length} player{filteredPlayers.length !== 1 ? "s" : ""} found
                  </p>

                  {filteredPlayers.length === 0 ? (
                    <div className="text-center py-10">
                      <User className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No players match your filters</p>
                      <Button variant="link" size="sm" className="text-xs mt-1" onClick={resetFilters}>
                        Clear filters
                      </Button>
                    </div>
                  ) : (
                    filteredPlayers.map((player) => (
                      <button
                        key={player.id}
                        className="w-full text-left p-3 rounded-lg border bg-card hover:bg-muted/40 touch-manipulation active:scale-[0.98] active:bg-muted/60 transition-all"
                        onClick={() => setSelectedPlayer(player)}
                      >
                        {/* Row 1: Avatar + Name + Chevron */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarImage src={player.avatar} />
                            <AvatarFallback className="text-xs font-bold bg-muted">
                              {player.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{player.name}</p>
                            <p className="text-xs text-muted-foreground">{player.registrationNumber}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                        </div>

                        {/* Row 2: Stats badges */}
                        <div className="flex items-center gap-2 flex-wrap mt-2 pl-12">
                          <Badge variant="outline" className="text-xs px-1.5 py-0 gap-1">
                            <Gamepad2 className="h-3 w-3" />
                            {player.totalGamesPlayed} games
                          </Badge>
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            Stake: {formatLocalAmount(player.totalStakePaid, "NGN")}
                          </Badge>
                        </div>

                        {/* Row 3: Last played + Won */}
                        <div className="flex items-center justify-between mt-1.5 pl-12">
                          <p className="text-xs text-muted-foreground">
                            Last played: {player.lastPlayedDate.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                          <p className="text-xs font-semibold text-green-600">
                            Won: {formatLocalAmount(player.totalAmountWon, "NGN")}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
