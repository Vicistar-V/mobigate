import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MobigateAdminHeader } from "@/components/mobigate/MobigateAdminHeader";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";
import {
  Activity, Users, Wallet, Gamepad2, Trophy,
  Users2, Zap, UtensilsCrossed, GraduationCap, Radio,
} from "lucide-react";

const liveStats = {
  activeSessions: 127,
  totalPlayers: 489,
  totalStakesInPlay: 8750000,
};

const modeBreakdown = [
  { mode: "Group Quiz", icon: Users2, sessions: 34, players: 198, stakes: 3200000, color: "text-blue-500" },
  { mode: "Standard Solo", icon: Zap, sessions: 52, players: 52, stakes: 1850000, color: "text-amber-500" },
  { mode: "Interactive", icon: Radio, sessions: 8, players: 120, stakes: 1500000, color: "text-purple-500" },
  { mode: "Food for Home", icon: UtensilsCrossed, sessions: 21, players: 21, stakes: 950000, color: "text-emerald-500" },
  { mode: "Scholarship", icon: GraduationCap, sessions: 12, players: 98, stakes: 1250000, color: "text-rose-500" },
];

const recentResults = [
  { id: 1, player: "Chukwuma A.", mode: "Solo", score: "10/10", prize: 25000, time: "2 min ago", won: true },
  { id: 2, player: "Group: Lagos Stars", mode: "Group", score: "8/10", prize: 150000, time: "5 min ago", won: true },
  { id: 3, player: "Adaeze N.", mode: "Solo", score: "6/10", prize: 0, time: "8 min ago", won: false },
  { id: 4, player: "Emeka O.", mode: "Food", score: "15/15", prize: 0, time: "12 min ago", won: true },
  { id: 5, player: "Group: Abuja Pros", mode: "Group", score: "9/10", prize: 200000, time: "15 min ago", won: true },
  { id: 6, player: "Blessing U.", mode: "Scholarship", score: "12/15", prize: 500000, time: "18 min ago", won: true },
  { id: 7, player: "Tunde K.", mode: "Solo", score: "5/10", prize: 0, time: "22 min ago", won: false },
  { id: 8, player: "Ngozi E.", mode: "Interactive", score: "Season 3", prize: 0, time: "30 min ago", won: true },
  { id: 9, player: "Group: Delta United", mode: "Group", score: "7/10", prize: 75000, time: "35 min ago", won: true },
  { id: 10, player: "Amaka C.", mode: "Solo", score: "10/10", prize: 50000, time: "40 min ago", won: true },
];

export default function MonitorQuizPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <MobigateAdminHeader title="Monitor Quiz" subtitle="Live Quiz Activity" />
      <div className="p-4">
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="space-y-4 pb-6">
            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-3 text-center">
                  <Activity className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xl font-bold">{liveStats.activeSessions}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Active</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                <CardContent className="p-3 text-center">
                  <Users className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                  <p className="text-xl font-bold">{liveStats.totalPlayers}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Players</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
                <CardContent className="p-3 text-center">
                  <Wallet className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                  <p className="text-xl font-bold">{formatMobi(liveStats.totalStakesInPlay)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">In Play</p>
                </CardContent>
              </Card>
            </div>

            {/* Mode Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  By Game Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modeBreakdown.map(m => (
                  <div key={m.mode} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <m.icon className={`h-5 w-5 shrink-0 ${m.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{m.mode}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.sessions} sessions · {m.players} players
                      </p>
                    </div>
                    <p className="text-sm font-bold text-primary shrink-0">{formatMobi(m.stakes)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Results */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Recent Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentResults.map(r => (
                  <div key={r.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.player}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-[10px] h-4">{r.mode}</Badge>
                        <span className="text-xs text-muted-foreground">{r.score}</span>
                        <span className="text-[10px] text-muted-foreground">{r.time}</span>
                      </div>
                    </div>
                    {r.won ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                        {r.prize > 0 ? formatMobi(r.prize) : "Won"}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs text-muted-foreground">Lost</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
