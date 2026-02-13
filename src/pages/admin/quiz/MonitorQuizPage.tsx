import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";
import {
  Activity, Users, Wallet, Gamepad2, Trophy,
  Users2, Zap, UtensilsCrossed, GraduationCap, Radio, ChevronRight,
  SlidersHorizontal, ArrowUpDown, X, Calendar,
} from "lucide-react";
import { MonitorDetailDrawer, type DrawerData } from "@/components/mobigate/MonitorDetailDrawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, subDays, subHours, subMinutes, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

const liveStats = {
  activeSessions: 127,
  totalPlayers: 489,
  totalStakesInPlay: 8750000,
};

export const modeBreakdown = [
  { mode: "Group Quiz", icon: Users2, sessions: 34, players: 198, stakes: 3200000, color: "text-blue-500", avgScore: "7.2/10", topPlayer: "Group: Lagos Stars", winRate: "68%" },
  { mode: "Standard Solo", icon: Zap, sessions: 52, players: 52, stakes: 1850000, color: "text-amber-500", avgScore: "6.8/10", topPlayer: "Chukwuma Adesanya", winRate: "42%" },
  { mode: "Interactive", icon: Radio, sessions: 8, players: 120, stakes: 1500000, color: "text-purple-500", avgScore: "Season 3", topPlayer: "Ngozi Emenike", winRate: "55%" },
  { mode: "Food for Home", icon: UtensilsCrossed, sessions: 21, players: 21, stakes: 950000, color: "text-emerald-500", avgScore: "12.4/15", topPlayer: "Emeka Okonkwo", winRate: "71%" },
  { mode: "Scholarship", icon: GraduationCap, sessions: 12, players: 98, stakes: 1250000, color: "text-rose-500", avgScore: "11.2/15", topPlayer: "Blessing Uzoma", winRate: "38%" },
];

// More realistic data with actual dates
const now = new Date();
export const recentResults = [
  { id: 1, player: "Chukwuma Adesanya", mode: "Solo", score: "10/10", prize: 25000, time: "2 minutes ago", date: subMinutes(now, 2), won: true, category: "Sports and Physical Fitness", difficulty: "Medium", questionsAnswered: 10 },
  { id: 2, player: "Group: Lagos Stars", mode: "Group", score: "8/10", prize: 150000, time: "5 minutes ago", date: subMinutes(now, 5), won: true, category: "General Knowledge", difficulty: "Hard", questionsAnswered: 10 },
  { id: 3, player: "Adaeze Nwosu", mode: "Solo", score: "6/10", prize: 0, time: "8 minutes ago", date: subMinutes(now, 8), won: false, category: "Science and Technology", difficulty: "Medium", questionsAnswered: 10 },
  { id: 4, player: "Emeka Okonkwo", mode: "Food for Home", score: "15/15", prize: 0, time: "12 minutes ago", date: subMinutes(now, 12), won: true, category: "General Knowledge", difficulty: "Easy", questionsAnswered: 15 },
  { id: 5, player: "Group: Abuja Professionals", mode: "Group", score: "9/10", prize: 200000, time: "15 minutes ago", date: subMinutes(now, 15), won: true, category: "Current Affairs", difficulty: "Hard", questionsAnswered: 10 },
  { id: 6, player: "Blessing Uzoma", mode: "Scholarship", score: "12/15", prize: 500000, time: "18 minutes ago", date: subMinutes(now, 18), won: true, category: "Science and Technology", difficulty: "Expert", questionsAnswered: 15 },
  { id: 7, player: "Tunde Kolawole", mode: "Solo", score: "5/10", prize: 0, time: "22 minutes ago", date: subMinutes(now, 22), won: false, category: "Entertainment", difficulty: "Medium", questionsAnswered: 10 },
  { id: 8, player: "Ngozi Emenike", mode: "Interactive", score: "Season 3", prize: 0, time: "30 minutes ago", date: subMinutes(now, 30), won: true, category: "General Knowledge", difficulty: "Medium", questionsAnswered: 15 },
  { id: 9, player: "Group: Delta United", mode: "Group", score: "7/10", prize: 75000, time: "35 minutes ago", date: subMinutes(now, 35), won: true, category: "Sports and Physical Fitness", difficulty: "Medium", questionsAnswered: 10 },
  { id: 10, player: "Amaka Chukwu", mode: "Solo", score: "10/10", prize: 50000, time: "40 minutes ago", date: subMinutes(now, 40), won: true, category: "Current Affairs", difficulty: "Easy", questionsAnswered: 10 },
  { id: 11, player: "Ifeanyi Okeke", mode: "Solo", score: "3/10", prize: 0, time: "1 hour ago", date: subHours(now, 1), won: false, category: "History", difficulty: "Hard", questionsAnswered: 10 },
  { id: 12, player: "Group: Port Harcourt Lions", mode: "Group", score: "10/10", prize: 300000, time: "1 hour ago", date: subHours(now, 1.2), won: true, category: "Entertainment", difficulty: "Easy", questionsAnswered: 10 },
  { id: 13, player: "Chidinma Obi", mode: "Food for Home", score: "14/15", prize: 0, time: "2 hours ago", date: subHours(now, 2), won: true, category: "Health", difficulty: "Medium", questionsAnswered: 15 },
  { id: 14, player: "Obinna Nwankwo", mode: "Scholarship", score: "8/15", prize: 0, time: "3 hours ago", date: subHours(now, 3), won: false, category: "Science and Technology", difficulty: "Expert", questionsAnswered: 15 },
  { id: 15, player: "Fatima Abdullahi", mode: "Solo", score: "9/10", prize: 15000, time: "5 hours ago", date: subHours(now, 5), won: true, category: "Geography", difficulty: "Medium", questionsAnswered: 10 },
  { id: 16, player: "Group: Enugu Warriors", mode: "Group", score: "6/10", prize: 0, time: "Yesterday", date: subDays(now, 1), won: false, category: "Sports and Physical Fitness", difficulty: "Hard", questionsAnswered: 10 },
  { id: 17, player: "Kelechi Iheanacho", mode: "Interactive", score: "Season 3", prize: 250000, time: "Yesterday", date: subDays(now, 1), won: true, category: "Current Affairs", difficulty: "Hard", questionsAnswered: 15 },
  { id: 18, player: "Aisha Mohammed", mode: "Solo", score: "7/10", prize: 0, time: "2 days ago", date: subDays(now, 2), won: false, category: "Entertainment", difficulty: "Medium", questionsAnswered: 10 },
  { id: 19, player: "Group: Calabar Kings", mode: "Group", score: "9/10", prize: 180000, time: "3 days ago", date: subDays(now, 3), won: true, category: "General Knowledge", difficulty: "Medium", questionsAnswered: 10 },
  { id: 20, player: "Yusuf Bello", mode: "Scholarship", score: "13/15", prize: 750000, time: "4 days ago", date: subDays(now, 4), won: true, category: "Science and Technology", difficulty: "Expert", questionsAnswered: 15 },
];

export type GameModeData = typeof modeBreakdown[number];
export type RecentResultData = typeof recentResults[number];

const allModes = ["Solo", "Group", "Food for Home", "Scholarship", "Interactive"];

export default function MonitorQuizPage() {
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);
  const navigate = useNavigate();

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [resultFilter, setResultFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [showFromCal, setShowFromCal] = useState(false);
  const [showToCal, setShowToCal] = useState(false);

  const hasActiveFilters = typeFilter !== "all" || resultFilter !== "all" || dateFrom || dateTo || sortBy !== "newest";

  const filteredResults = useMemo(() => {
    let results = [...recentResults];

    // Type filter
    if (typeFilter !== "all") {
      results = results.filter(r => r.mode === typeFilter);
    }

    // Win/Loss filter
    if (resultFilter === "wins") {
      results = results.filter(r => r.won);
    } else if (resultFilter === "losses") {
      results = results.filter(r => !r.won);
    }

    // Date range filter
    if (dateFrom) {
      results = results.filter(r => isAfter(r.date, startOfDay(dateFrom)));
    }
    if (dateTo) {
      results = results.filter(r => isBefore(r.date, endOfDay(dateTo)));
    }

    // Sort
    if (sortBy === "newest") {
      results.sort((a, b) => b.date.getTime() - a.date.getTime());
    } else if (sortBy === "oldest") {
      results.sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    return results;
  }, [typeFilter, resultFilter, dateFrom, dateTo, sortBy]);

  const clearFilters = () => {
    setSortBy("newest");
    setTypeFilter("all");
    setResultFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="p-4 space-y-4">
        <h1 className="text-lg font-bold">Monitor Quiz</h1>

        {/* Live Stats */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Card>
              <CardContent className="p-3 text-center">
                <Activity className="h-4 w-4 mx-auto mb-1 text-primary" />
                <p className="text-xl font-bold">{liveStats.activeSessions}</p>
                <p className="text-xs text-muted-foreground">Active Sessions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Users className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                <p className="text-xl font-bold">{liveStats.totalPlayers}</p>
                <p className="text-xs text-muted-foreground">Total Players</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-3 text-center">
              <Wallet className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
              <p className="text-xl font-bold">{formatMobi(liveStats.totalStakesInPlay)}</p>
              <p className="text-xs text-muted-foreground">Total Stakes In Play</p>
            </CardContent>
          </Card>
        </div>

        {/* Mode Breakdown */}
        <Card>
          <CardHeader className="pb-2 px-4 pt-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primary" />
              By Game Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {modeBreakdown.map(m => (
              <button
                key={m.mode}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg w-full text-left active:bg-muted/80 transition-colors border border-border/40"
                onClick={() => setDrawerData({ type: "mode", data: m })}
              >
                <m.icon className={`h-5 w-5 shrink-0 ${m.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium break-words">{m.mode}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.sessions} sessions · {m.players} players
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <p className="text-sm font-bold text-primary">{formatMobi(m.stakes)}</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card>
          <CardHeader className="pb-2 px-4 pt-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Recent Results
              </CardTitle>
              <div className="flex items-center gap-1.5">
                {hasActiveFilters && (
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearFilters}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  variant={showFilters ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs gap-1"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filter
                  {hasActiveFilters && (
                    <span className="bg-primary text-primary-foreground rounded-full h-4 w-4 text-[10px] flex items-center justify-center">
                      {[typeFilter !== "all", resultFilter !== "all", !!dateFrom || !!dateTo, sortBy !== "newest"].filter(Boolean).length}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="space-y-2.5 pt-2 pb-1">
                {/* Row 1: Sort + Type */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground mb-1 font-medium uppercase tracking-wide">Sort</p>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-8 text-xs">
                        <ArrowUpDown className="h-3 w-3 mr-1 shrink-0" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground mb-1 font-medium uppercase tracking-wide">Type</p>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="all">All Types</SelectItem>
                        {allModes.map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2: Result + Date Range */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground mb-1 font-medium uppercase tracking-wide">Result</p>
                    <Select value={resultFilter} onValueChange={setResultFilter}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="wins">Wins</SelectItem>
                        <SelectItem value="losses">Losses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground mb-1 font-medium uppercase tracking-wide">Date Range</p>
                    <div className="flex gap-1">
                      <Popover open={showFromCal} onOpenChange={setShowFromCal}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("h-8 text-xs flex-1 px-1.5 justify-start font-normal", !dateFrom && "text-muted-foreground")}>
                            <Calendar className="h-3 w-3 mr-0.5 shrink-0" />
                            {dateFrom ? format(dateFrom, "dd/MM") : "From"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-50" align="end">
                          <CalendarComponent
                            mode="single"
                            selected={dateFrom}
                            onSelect={(d) => { setDateFrom(d); setShowFromCal(false); }}
                            disabled={(d) => d > now}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover open={showToCal} onOpenChange={setShowToCal}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("h-8 text-xs flex-1 px-1.5 justify-start font-normal", !dateTo && "text-muted-foreground")}>
                            <Calendar className="h-3 w-3 mr-0.5 shrink-0" />
                            {dateTo ? format(dateTo, "dd/MM") : "To"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-50" align="end">
                          <CalendarComponent
                            mode="single"
                            selected={dateTo}
                            onSelect={(d) => { setDateTo(d); setShowToCal(false); }}
                            disabled={(d) => d > now}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="px-4 pb-4 space-y-2">
            {filteredResults.length === 0 ? (
              <div className="text-center py-6">
                <Trophy className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No results match your filters</p>
                <Button variant="link" size="sm" className="text-xs mt-1" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              filteredResults.map(r => (
                <button
                  key={r.id}
                  className="p-3 bg-muted/50 rounded-lg space-y-2 w-full text-left active:bg-muted/80 transition-colors border border-border/40"
                  onClick={() => setDrawerData({ type: "result", data: r })}
                >
                  {/* Row 1: Player name + Won/Lost badge */}
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold break-words flex-1 min-w-0">{r.player}</p>
                    {r.won ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs shrink-0">
                        {r.prize > 0 ? formatMobi(r.prize) : "Won"}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs shrink-0 text-red-500">Lost</Badge>
                    )}
                  </div>
                  {/* Row 2: Mode + Score + Time */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{r.mode}</Badge>
                    <span className="text-xs font-medium">{r.score}</span>
                    <span className="text-xs text-muted-foreground">{r.time}</span>
                  </div>
                </button>
              ))
            )}

            {filteredResults.length > 0 && (
              <p className="text-[10px] text-muted-foreground text-center pt-1">
                Showing {filteredResults.length} of {recentResults.length} results
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Unified Detail Drawer */}
      <MonitorDetailDrawer
        data={drawerData}
        onClose={() => setDrawerData(null)}
      />
    </div>
  );
}
