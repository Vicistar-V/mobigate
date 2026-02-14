import { Trophy, Gamepad2, TrendingUp, XCircle, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const mockHistory = [
  { id: 1, mode: "Standard Solo", date: "2026-02-13", score: "10/10", stake: 5000, prize: 10000, won: true },
  { id: 2, mode: "Group Quiz", date: "2026-02-12", score: "8/10", stake: 10000, prize: 0, won: false },
  { id: 3, mode: "Interactive", date: "2026-02-11", score: "13/15", stake: 7500, prize: 15000, won: true },
  { id: 4, mode: "Food for Home", date: "2026-02-10", score: "12/15", stake: 3000, prize: 0, won: false },
  { id: 5, mode: "Standard Solo", date: "2026-02-09", score: "9/10", stake: 5000, prize: 8000, won: true },
  { id: 6, mode: "Group Quiz", date: "2026-02-08", score: "7/10", stake: 8000, prize: 16000, won: true },
  { id: 7, mode: "Scholarship", date: "2026-02-07", score: "18/20", stake: 20000, prize: 0, won: false },
  { id: 8, mode: "Standard Solo", date: "2026-02-06", score: "10/10", stake: 5000, prize: 10000, won: true },
];

const totalGames = mockHistory.length;
const wins = mockHistory.filter(g => g.won).length;
const losses = totalGames - wins;
const winRate = Math.round((wins / totalGames) * 100);

export default function MyQuizHistory() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold">My Quiz History</h1>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 px-4 py-4">
        {[
          { label: "Games", value: totalGames, icon: Gamepad2, color: "text-primary" },
          { label: "Wins", value: wins, icon: Trophy, color: "text-green-600 dark:text-green-400" },
          { label: "Losses", value: losses, icon: XCircle, color: "text-red-500" },
          { label: "Win %", value: `${winRate}%`, icon: TrendingUp, color: "text-amber-600 dark:text-amber-400" },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-xl border border-border/50 p-3 text-center">
            <stat.icon className={`h-4 w-4 mx-auto mb-1 ${stat.color}`} />
            <p className="text-lg font-bold">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Game List */}
      <div className="px-4 space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2">Recent Games</h2>
        {mockHistory.map(game => (
          <div
            key={game.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50"
          >
            <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
              game.won ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
            }`}>
              {game.won ? (
                <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{game.mode}</p>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{game.date}</span>
                <span className="mx-1">•</span>
                <span>Score: {game.score}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-sm font-bold ${game.won ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                {game.won ? `+M${game.prize.toLocaleString()}` : `-M${game.stake.toLocaleString()}`}
              </p>
              <p className={`text-[10px] font-medium ${game.won ? "text-green-600/70" : "text-red-500/70"}`}>
                {game.won ? "Won" : "Lost"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
