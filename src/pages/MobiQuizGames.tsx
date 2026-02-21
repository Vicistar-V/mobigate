import { useState } from "react";
import { ArrowLeft, Trophy, Gamepad2, Users, Zap, Home, GraduationCap, Play, TrendingUp, Target, History, ChevronRight, Wallet, ToggleRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MobigateQuizHub } from "@/components/community/mobigate-quiz/MobigateQuizHub";
import { GroupQuizInviteSheet } from "@/components/community/mobigate-quiz/GroupQuizInviteSheet";
import { StandardQuizCategorySelect } from "@/components/community/mobigate-quiz/StandardQuizCategorySelect";
import { InteractiveQuizMerchantSheet } from "@/components/community/mobigate-quiz/InteractiveQuizMerchantSheet";
import { FoodQuizItemSelectSheet } from "@/components/community/mobigate-quiz/FoodQuizItemSelectSheet";
import { ScholarshipQuizSetupSheet } from "@/components/community/mobigate-quiz/ScholarshipQuizSetupSheet";
import { ToggleQuizPlayDialog } from "@/components/community/mobigate-quiz/ToggleQuizPlayDialog";

const gameModes = [
  {
    id: "group",
    title: "Group Quiz",
    description: "3–10 players compete. Host sets consensus stake (min 5,000 Mobi). Prize multipliers from 200% up to 500%.",
    icon: Users,
    color: "bg-blue-500/10 text-blue-600",
    borderColor: "border-blue-500/30",
    players: "3-10",
    tag: "Multiplayer",
  },
  {
    id: "standard",
    title: "Standard Solo",
    description: "10 objective questions. Score 100% to win the full prize. 80%+ unlocks a bonus game worth 50% extra.",
    icon: Gamepad2,
    color: "bg-amber-500/10 text-amber-600",
    borderColor: "border-amber-500/30",
    players: "Solo",
    tag: "Most Popular",
  },
  {
    id: "interactive",
    title: "Interactive Quiz",
    description: "Merchant-hosted seasons with 15 questions and Live Shows. Win exclusive prizes and vouchers.",
    icon: Zap,
    color: "bg-purple-500/10 text-purple-600",
    borderColor: "border-purple-500/30",
    players: "Varies",
    tag: "Live",
  },
  {
    id: "food",
    title: "Food for Home",
    description: "Stake 20% of an item's market value to win it via a 15-question quiz. Win groceries and household items!",
    icon: Home,
    color: "bg-green-500/10 text-green-600",
    borderColor: "border-green-500/30",
    players: "Solo",
    tag: "Win Items",
  },
  {
    id: "scholarship",
    title: "Scholarship Quiz",
    description: "Stake 20% of the annual budget to win full scholarship funding. 15 questions covering your chosen tier.",
    icon: GraduationCap,
    color: "bg-rose-500/10 text-rose-600",
    borderColor: "border-rose-500/30",
    players: "Solo",
    tag: "Education",
  },
  {
    id: "toggle",
    title: "Toggle Quiz",
    description: "7 escalating sessions. Score 100% each round or lose everything. Toggle up for multipliers up to 15x!",
    icon: ToggleRight,
    color: "bg-orange-500/10 text-orange-600",
    borderColor: "border-orange-500/30",
    players: "Solo",
    tag: "High Stakes",
  },
];

// Mock stats
const quizStats = {
  gamesPlayed: 47,
  gamesWon: 28,
  winRate: 59.6,
  totalEarnings: 182500,
  streak: 3,
};

export default function MobiQuizGames() {
  const [showQuizHub, setShowQuizHub] = useState(false);
  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <div className="sticky top-16 z-40 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="container px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate(-1)} className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Mobi Quiz Games
              </h1>
              <p className="text-xs text-white/80 mt-0.5">Win prizes by answering questions!</p>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{quizStats.gamesPlayed}</p>
              <p className="text-[10px] text-white/70">Played</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{quizStats.gamesWon}</p>
              <p className="text-[10px] text-white/70">Won</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{quizStats.winRate}%</p>
              <p className="text-[10px] text-white/70">Win Rate</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-lg font-bold">🔥{quizStats.streak}</p>
              <p className="text-[10px] text-white/70">Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container px-4 py-4 space-y-4 pb-24">
        {/* Start Playing CTA */}
        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <h2 className="font-bold text-base mb-1">Ready to Play?</h2>
                <p className="text-xs text-muted-foreground">Browse available quizzes and start winning prizes now!</p>
              </div>
              <Button
                onClick={() => setShowQuizHub(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shrink-0"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Playing
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wallet & Earnings Summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-green-500/20">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
                <p className="font-bold text-sm">₦{quizStats.totalEarnings.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Wallet Balance</p>
                <p className="font-bold text-sm">₦15,000</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz History Link */}
        <Link to="/my-quiz-history">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <History className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">My Quiz History</p>
                  <p className="text-xs text-muted-foreground">{quizStats.gamesPlayed} games played</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        {/* Game Modes Section */}
        <div>
          <h2 className="font-bold text-base mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-600" />
            Game Modes
          </h2>
          <div className="space-y-3">
            {gameModes.map((mode) => (
              <Card
                key={mode.id}
                className={`border ${mode.borderColor} hover:shadow-md transition-all cursor-pointer active:scale-[0.98]`}
                onClick={() => setActiveFlow(mode.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`h-12 w-12 rounded-xl ${mode.color} flex items-center justify-center shrink-0`}>
                      <mode.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm">{mode.title}</h3>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{mode.tag}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{mode.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {mode.players}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Mobi Quiz Game Dialog */}
      <MobigateQuizHub open={showQuizHub} onOpenChange={setShowQuizHub} />

      {/* Direct game mode flows */}
      <GroupQuizInviteSheet open={activeFlow === "group"} onOpenChange={(v) => !v && setActiveFlow(null)} />
      <StandardQuizCategorySelect open={activeFlow === "standard"} onOpenChange={(v) => !v && setActiveFlow(null)} />
      <InteractiveQuizMerchantSheet open={activeFlow === "interactive"} onOpenChange={(v) => !v && setActiveFlow(null)} />
      <FoodQuizItemSelectSheet open={activeFlow === "food"} onOpenChange={(v) => !v && setActiveFlow(null)} />
      <ScholarshipQuizSetupSheet open={activeFlow === "scholarship"} onOpenChange={(v) => !v && setActiveFlow(null)} />
      <ToggleQuizPlayDialog open={activeFlow === "toggle"} onOpenChange={(v) => !v && setActiveFlow(null)} />
    </div>
  );
}
