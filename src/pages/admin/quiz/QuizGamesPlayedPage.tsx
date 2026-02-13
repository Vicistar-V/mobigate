import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";
import { quizGamesPlayedData, type QuizGameRecord } from "@/data/quizGamesPlayedData";
import { QuizGameDetailDrawer } from "@/components/mobigate/QuizGameDetailDrawer";
import { MemberPreviewDialog } from "@/components/community/MemberPreviewDialog";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import { ArrowLeft, Search, Gamepad2, Users, Wallet, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function QuizGamesPlayedPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get("mode") || "Standard Solo";

  const [sortOrder, setSortOrder] = useState("newest");
  const [yearFilter, setYearFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [dayFilter, setDayFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedGame, setSelectedGame] = useState<QuizGameRecord | null>(null);
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);
  const [showMemberPreview, setShowMemberPreview] = useState(false);

  const openPlayerProfile = (game: QuizGameRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMember({
      id: game.id.toString(),
      name: game.playerName,
      position: `${game.state}, ${game.country}`,
      imageUrl: "",
      tenure: "Player",
      level: "staff" as const,
      committee: "staff" as const,
    });
    setShowMemberPreview(true);
  };

  const modeGames = useMemo(() => quizGamesPlayedData.filter(g => g.gameMode === mode), [mode]);

  const years = useMemo(() => [...new Set(modeGames.map(g => new Date(g.datePlayed).getFullYear().toString()))].sort().reverse(), [modeGames]);
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const filtered = useMemo(() => {
    let list = [...modeGames];

    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      list = list.filter(g => g.playerName.toLowerCase().includes(q));
    }
    if (yearFilter !== "all") {
      list = list.filter(g => new Date(g.datePlayed).getFullYear().toString() === yearFilter);
    }
    if (monthFilter !== "all") {
      list = list.filter(g => String(new Date(g.datePlayed).getMonth() + 1).padStart(2, "0") === monthFilter);
    }
    if (dayFilter) {
      const d = parseInt(dayFilter);
      if (d >= 1 && d <= 31) list = list.filter(g => new Date(g.datePlayed).getDate() === d);
    }

    switch (sortOrder) {
      case "oldest": list.sort((a, b) => new Date(a.datePlayed).getTime() - new Date(b.datePlayed).getTime()); break;
      case "wins-first": list.sort((a, b) => (a.result === "Won" ? -1 : 1) - (b.result === "Won" ? -1 : 1)); break;
      case "losses-first": list.sort((a, b) => (a.result === "Lost" ? -1 : 1) - (b.result === "Lost" ? -1 : 1)); break;
      default: list.sort((a, b) => new Date(b.datePlayed).getTime() - new Date(a.datePlayed).getTime());
    }

    return list;
  }, [modeGames, searchText, yearFilter, monthFilter, dayFilter, sortOrder]);

  const totalStakes = modeGames.reduce((s, g) => s + g.stakePaid, 0);
  const wins = modeGames.filter(g => g.result === "Won").length;
  const winRate = modeGames.length > 0 ? Math.round((wins / modeGames.length) * 100) : 0;
  const uniquePlayers = new Set(modeGames.map(g => g.playerName)).size;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg bg-muted active:bg-muted/80">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold break-words flex-1 min-w-0">{mode} — Games Played</h1>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-2">
          <Card><CardContent className="p-3 text-center">
            <Gamepad2 className="h-4 w-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{modeGames.length}</p>
            <p className="text-xs text-muted-foreground">Total Games</p>
          </CardContent></Card>
          <Card><CardContent className="p-3 text-center">
            <Users className="h-4 w-4 mx-auto mb-1 text-blue-500" />
            <p className="text-lg font-bold">{uniquePlayers}</p>
            <p className="text-xs text-muted-foreground">Total Players</p>
          </CardContent></Card>
          <Card><CardContent className="p-3 text-center">
            <Wallet className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
            <p className="text-lg font-bold">{formatMobi(totalStakes)}</p>
            <p className="text-xs text-muted-foreground">Total Stakes</p>
          </CardContent></Card>
          <Card><CardContent className="p-3 text-center">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-amber-500" />
            <p className="text-lg font-bold">{winRate}%</p>
            <p className="text-xs text-muted-foreground">Win Rate</p>
          </CardContent></Card>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search player name..." value={searchText} onChange={e => setSearchText(e.target.value)} className="pl-9 w-full" />
          </div>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest Play</SelectItem>
              <SelectItem value="oldest">Oldest Play</SelectItem>
              <SelectItem value="wins-first">Wins First</SelectItem>
              <SelectItem value="losses-first">Losses First</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid grid-cols-3 gap-2">
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {months.map((m, i) => <SelectItem key={m} value={m}>{monthNames[i]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Day" min={1} max={31} value={dayFilter} onChange={e => setDayFilter(e.target.value)} />
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground">{filtered.length} game{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Games List */}
        <div className="space-y-2">
          {filtered.map(game => (
            <button
              key={game.id}
              className="w-full text-left p-3 bg-muted/50 rounded-lg border border-border/40 space-y-2 active:bg-muted/80 transition-colors"
              onClick={() => setSelectedGame(game)}
            >
              {/* Row 1: Player + Result */}
              <div className="flex items-start justify-between gap-2">
                <button
                  onClick={(e) => openPlayerProfile(game, e)}
                  className="text-sm font-semibold break-words flex-1 min-w-0 text-left text-primary underline underline-offset-2"
                >
                  {game.playerName}
                </button>
                {game.result === "Won"
                  ? <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs shrink-0">Won</Badge>
                  : <Badge variant="secondary" className="text-xs shrink-0 text-red-500">Lost</Badge>
                }
              </div>
              {/* Row 2: Game ID + Location */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-primary font-medium">{game.gameId}</span>
                <span className="text-xs text-muted-foreground">{game.state}, {game.country}</span>
              </div>
              {/* Row 3: Stake + Prize */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs">Stake: <span className="font-medium">{formatMobi(game.stakePaid)}</span></span>
                <span className="text-xs">Prize: <span className="font-medium text-emerald-600">{formatMobi(game.prizeWon)}</span></span>
              </div>
              {/* Row 4: Category + Difficulty + Date */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">{game.category}</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{game.difficulty}</Badge>
                <span className="text-xs text-muted-foreground ml-auto">{format(new Date(game.datePlayed), "MMM dd, yyyy")}</span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">No games found for the selected filters.</p>
          )}
        </div>
      </div>

      <QuizGameDetailDrawer game={selectedGame} onClose={() => setSelectedGame(null)} />
      <MemberPreviewDialog member={selectedMember} open={showMemberPreview} onOpenChange={setShowMemberPreview} />
    </div>
  );
}
