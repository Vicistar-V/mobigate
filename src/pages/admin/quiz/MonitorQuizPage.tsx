import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";
import {
  Activity, Users, Wallet, Gamepad2, Trophy,
  Users2, Zap, UtensilsCrossed, GraduationCap, Radio, ChevronRight,
} from "lucide-react";
import { MonitorDetailDrawer, type DrawerData } from "@/components/mobigate/MonitorDetailDrawer";

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

export const recentResults = [
  { id: 1, player: "Chukwuma Adesanya", mode: "Solo", score: "10/10", prize: 25000, time: "2 minutes ago", won: true, category: "Sports and Physical Fitness", difficulty: "Medium", questionsAnswered: 10 },
  { id: 2, player: "Group: Lagos Stars", mode: "Group", score: "8/10", prize: 150000, time: "5 minutes ago", won: true, category: "General Knowledge", difficulty: "Hard", questionsAnswered: 10 },
  { id: 3, player: "Adaeze Nwosu", mode: "Solo", score: "6/10", prize: 0, time: "8 minutes ago", won: false, category: "Science and Technology", difficulty: "Medium", questionsAnswered: 10 },
  { id: 4, player: "Emeka Okonkwo", mode: "Food for Home", score: "15/15", prize: 0, time: "12 minutes ago", won: true, category: "General Knowledge", difficulty: "Easy", questionsAnswered: 15 },
  { id: 5, player: "Group: Abuja Professionals", mode: "Group", score: "9/10", prize: 200000, time: "15 minutes ago", won: true, category: "Current Affairs", difficulty: "Hard", questionsAnswered: 10 },
  { id: 6, player: "Blessing Uzoma", mode: "Scholarship", score: "12/15", prize: 500000, time: "18 minutes ago", won: true, category: "Science and Technology", difficulty: "Expert", questionsAnswered: 15 },
  { id: 7, player: "Tunde Kolawole", mode: "Solo", score: "5/10", prize: 0, time: "22 minutes ago", won: false, category: "Entertainment", difficulty: "Medium", questionsAnswered: 10 },
  { id: 8, player: "Ngozi Emenike", mode: "Interactive", score: "Season 3", prize: 0, time: "30 minutes ago", won: true, category: "General Knowledge", difficulty: "Medium", questionsAnswered: 15 },
  { id: 9, player: "Group: Delta United", mode: "Group", score: "7/10", prize: 75000, time: "35 minutes ago", won: true, category: "Sports and Physical Fitness", difficulty: "Medium", questionsAnswered: 10 },
  { id: 10, player: "Amaka Chukwu", mode: "Solo", score: "10/10", prize: 50000, time: "40 minutes ago", won: true, category: "Current Affairs", difficulty: "Easy", questionsAnswered: 10 },
];

export type GameModeData = typeof modeBreakdown[number];
export type RecentResultData = typeof recentResults[number];

export default function MonitorQuizPage() {
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);
  const navigate = useNavigate();

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
                onClick={() => navigate(`/mobigate-admin/quiz/games-played?mode=${encodeURIComponent(m.mode)}`)}
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
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Recent Results
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {recentResults.map(r => (
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
            ))}
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
