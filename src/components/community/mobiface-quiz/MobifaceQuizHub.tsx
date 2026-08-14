import { useState, useEffect, useCallback } from "react";
import { X, Users, Trophy, Gamepad2, ShoppingCart, GraduationCap, Zap, Wallet, Globe, Flame, ChevronRight, Star, Repeat, Loader2, CheckCircle, XCircle, ArrowDown, ArrowUp, Send } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { GroupQuizInviteSheet } from "./GroupQuizInviteSheet";
import { GroupQuizLobbySheet } from "./GroupQuizLobbySheet";
import { StandardQuizCategorySelect } from "./StandardQuizCategorySelect";
import { InteractiveQuizMerchantSheet } from "./InteractiveQuizMerchantSheet";
import { FoodQuizItemSelectSheet } from "./FoodQuizItemSelectSheet";
import { ScholarshipQuizSetupSheet } from "./ScholarshipQuizSetupSheet";
import { ToggleQuizPlayDialog } from "./ToggleQuizPlayDialog";

const WALLET_API = "/api/quiz/wallet.php";
const API = "/api/quiz/standard.php";
const GROUP_API = "/api/quiz/group.php";
const FOOD_API = "/api/quiz/food.php";
const SCHOLARSHIP_API = "/api/quiz/scholarship.php";
const TOGGLE_API = "/api/quiz/toggle.php";

interface MobifaceQuizHubProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId?: string;
  hideInteractive?: boolean;
}

const GAME_MODES = [
  {
    id: "group",
    title: "Group Quiz",
    description: "Invite 3-10 friends, set a consensus stake, winner takes multiplied prizes!",
    icon: Users,
    gradient: "from-purple-500 to-violet-600",
    bgLight: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-300 dark:border-purple-700",
    minStake: 5000,
    badge: "👥 Multiplayer",
  },
  {
    id: "standard",
    title: "Standard Quiz",
    description: "Select category and level, play 10 questions. Continue for up to 10x multiplied prizes!",
    icon: Gamepad2,
    gradient: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-300 dark:border-amber-700",
    minStake: 200,
    badge: "🎯 Solo Play",
  },
  {
    id: "interactive",
    title: "Interactive Quiz",
    description: "Merchant-sponsored seasons with selection levels and live shows. Become a Mobi-Celebrity!",
    icon: Star,
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-300 dark:border-blue-700",
    minStake: 2000,
    badge: "📺 Live Shows",
  },
  {
    id: "food",
    title: "Food for Home",
    description: "Select grocery items, play to win them! Stake just 20% of item value.",
    icon: ShoppingCart,
    gradient: "from-green-500 to-emerald-500",
    bgLight: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-300 dark:border-green-700",
    minStake: 1000,
    badge: "🛒 Win Groceries",
  },
  {
    id: "scholarship",
    title: "Scholarship Quiz",
    description: "Play to win annual scholarship funding! One game covers one year of education.",
    icon: GraduationCap,
    gradient: "from-indigo-500 to-purple-500",
    bgLight: "bg-indigo-50 dark:bg-indigo-950/30",
    borderColor: "border-indigo-300 dark:border-indigo-700",
    minStake: 30000,
    badge: "🎓 Education",
  },
  {
    id: "toggle",
    title: "Toggle Quiz",
    description: "Win 500% or risk it all for up to 1500%! Toggle through 7 sessions — each one higher stakes. Complete all to earn Mobi Celebrity!",
    icon: Repeat,
    gradient: "from-teal-500 to-cyan-600",
    bgLight: "bg-teal-50 dark:bg-teal-950/30",
    borderColor: "border-teal-300 dark:border-teal-700",
    minStake: 500,
    badge: "🔄 Toggle Risk",
  },
];

export function MobifaceQuizHub({ open, onOpenChange, communityId, hideInteractive = false }: MobifaceQuizHubProps) {
  const { toast } = useToast();
  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  const filteredModes = hideInteractive ? GAME_MODES.filter(m => m.id !== "interactive") : GAME_MODES;

  const [wallet, setWallet] = useState({ balance: 0, main_balance: 0 });
  const [stats, setStats] = useState({
    games_played: 0, games_won: 0, partial_wins: 0, games_lost: 0, total_amount_won: 0, global_rank: null as number | null,
  });
  const [loading, setLoading] = useState(false);
  const [invites, setInvites] = useState<any[]>([]);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [openLobbyId, setOpenLobbyId] = useState<string | null>(null);

  const [transferMode, setTransferMode] = useState<null | "fund" | "withdraw">(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [submittingTransfer, setSubmittingTransfer] = useState(false);

  const num = (v: unknown) => {
    const n = typeof v === "string" ? parseFloat(v) : (v as number);
    return Number.isFinite(n) ? n : 0;
  };

  const loadData = useCallback(() => {
    if (!communityId) return;
    setLoading(true);
    const cq = `community_id=${communityId}`;
    Promise.all([
      fetch(`${WALLET_API}?${cq}`, { credentials: "include" }).then((r) => (r.ok ? r.json() : { balance: 0, main_balance: 0 })),
      fetch(`${API}?${cq}`, { credentials: "include" }).then((r) => (r.ok ? r.json() : { stats: {} })),
      fetch(`${GROUP_API}?${cq}`, { credentials: "include" }).then((r) => (r.ok ? r.json() : { stats: {} })),
      fetch(`${GROUP_API}?action=my_invites`, { credentials: "include" }).then((r) => (r.ok ? r.json() : { invites: [] })),
      fetch(`${FOOD_API}?action=overview&${cq}`, { credentials: "include" }).then((r) => (r.ok ? r.json() : { stats: {} })),
      fetch(`${SCHOLARSHIP_API}?action=overview&${cq}`, { credentials: "include" }).then((r) => (r.ok ? r.json() : { stats: {} })),
      fetch(`${TOGGLE_API}?action=overview&${cq}`, { credentials: "include" }).then((r) => (r.ok ? r.json() : { stats: {} })),
    ])
      .then(([walletRes, standard, group, myInvites, food, scholarship, toggle]) => {
        setWallet({ balance: num(walletRes.balance), main_balance: num(walletRes.main_balance) });
        const s = standard.stats ?? {};
        const g = group.stats ?? {};
        const f = food.stats ?? {};
        const sch = scholarship.stats ?? {};
        const t = toggle.stats ?? {};
        setStats({
          games_played: num(s.games_played) + num(g.games_played) + num(f.games_played) + num(sch.games_played) + num(t.games_played),
          games_won: num(s.games_won) + num(g.games_won) + num(f.games_won) + num(sch.games_won) + num(t.games_won),
          partial_wins: num(s.partial_wins),
          games_lost: num(s.games_lost) + num(g.games_lost) + num(f.games_lost) + num(sch.games_lost) + num(t.games_lost),
          total_amount_won: num(s.total_amount_won) + num(g.total_amount_won) + num(f.total_amount_won) + num(sch.total_amount_won) + num(t.total_amount_won),
          global_rank: s.global_rank ?? null,
        });
        setInvites(myInvites.invites ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [communityId]);

  useEffect(() => { if (open) loadData(); }, [open, loadData]);

  const respondToInvite = async (lobbyId: string, response: "accepted" | "declined") => {
    setRespondingId(lobbyId);
    try {
      const res = await fetch(GROUP_API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "respond_invite", lobby_id: lobbyId, response }),
      });
      if (!res.ok) throw new Error("Failed to respond");
      setInvites((prev) => prev.filter((i) => i.lobby_id !== lobbyId));
      if (response === "accepted") setOpenLobbyId(lobbyId);
    } catch {
      // silent — invite list will refresh next time the Hub opens
    } finally {
      setRespondingId(null);
    }
  };

  const handleTransfer = async () => {
    if (!communityId) return;
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) {
      toast({ title: "Invalid Amount", variant: "destructive" });
      return;
    }
    setSubmittingTransfer(true);
    try {
      const res = await fetch(WALLET_API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: transferMode, community_id: communityId, amount }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Transfer failed");
      toast({ title: transferMode === "fund" ? "Wallet Funded" : "Withdrawn", description: formatMobiAmount(amount) });
      setTransferMode(null);
      setTransferAmount("");
      loadData();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSubmittingTransfer(false);
    }
  };

  const handleClose = () => {
    setActiveFlow(null);
    setTransferMode(null);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open && !activeFlow} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[92vh] p-0 gap-0 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 pb-3 sticky top-0 bg-gradient-to-r from-amber-500 to-orange-500 z-10 border-b text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Mobiface Quiz <Flame className="h-4 w-4" />
                  </h2>
              <p className="text-xs text-amber-100">Choose your game mode</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain">
            <div className="p-4 space-y-4">
              {!communityId ? (
                <Card className="p-6 text-center text-sm text-muted-foreground">No community selected.</Card>
              ) : (
              <>
              {/* Wallet Bar — this community's separate Mobiface Quiz balance */}
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-amber-700 dark:text-amber-300">This Community's Quiz Wallet</span>
                    </div>
                    <div className="text-right">
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-amber-600 inline-block" />
                      ) : (
                        <>
                          <span className="font-bold text-amber-700 dark:text-amber-300">{formatLocalAmount(wallet.balance, "NGN")}</span>
                          <p className="text-xs text-amber-500">({formatMobiAmount(wallet.balance)})</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amber-200 dark:border-amber-700">
                    <div className="text-center">
                      <p className="text-xs text-amber-600">Rank</p>
                      <p className="font-bold text-sm text-amber-700">{stats.global_rank ? `#${stats.global_rank}` : "—"}</p>
                    </div>
                    <div className="text-center border-x border-amber-200 dark:border-amber-700">
                      <p className="text-xs text-amber-600">Played</p>
                      <p className="font-bold text-sm text-amber-700">{stats.games_played}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-amber-600">Won</p>
                      <p className="font-bold text-sm text-green-600">
                        +{formatLocalAmount(stats.total_amount_won, "NGN")}
                      </p>
                    </div>
                  </div>

                  {transferMode === null ? (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button size="sm" variant="outline" className="h-8 text-xs border-amber-300 text-amber-700" onClick={() => setTransferMode("fund")}>
                        <ArrowDown className="h-3.5 w-3.5 mr-1" /> Fund from Main
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs border-amber-300 text-amber-700" onClick={() => setTransferMode("withdraw")}>
                        <ArrowUp className="h-3.5 w-3.5 mr-1" /> Withdraw to Main
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{transferMode === "fund" ? "Fund from your main wallet" : "Withdraw to your main wallet"}</span>
                        <button onClick={() => { setTransferMode(null); setTransferAmount(""); }} className="text-amber-600">Cancel</button>
                      </div>
                      {transferMode === "fund" && (
                        <p className="text-xs text-muted-foreground">Main wallet available: {formatMobiAmount(wallet.main_balance)}</p>
                      )}
                      <Input
                        type="number" inputMode="decimal" placeholder="0.00"
                        value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)}
                        className="h-10 touch-manipulation" onClick={(e) => e.stopPropagation()}
                      />
                      <Button size="sm" className="w-full h-9 bg-amber-500 hover:bg-amber-600 text-white" onClick={handleTransfer} disabled={submittingTransfer || !transferAmount}>
                        {submittingTransfer ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
                        Confirm
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pending Group Quiz Invites */}
              {invites.length > 0 && (
                <Card className="border-purple-300 bg-purple-50 dark:bg-purple-950/20">
                  <CardContent className="p-3 space-y-2">
                    <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" /> Group Quiz Invites
                    </h4>
                    {invites.map((inv) => (
                      <div key={inv.lobby_id} className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-background rounded-lg border border-purple-200">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{inv.host_name} invited you</p>
                          <p className="text-xs text-muted-foreground">Stake: {formatMobiAmount(parseFloat(inv.stake))} • {inv.multiplier * 100}% prize</p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <Button size="icon" variant="outline" className="h-8 w-8 border-green-300 text-green-600"
                            onClick={() => respondToInvite(inv.lobby_id, "accepted")} disabled={respondingId === inv.lobby_id}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 border-red-300 text-red-500"
                            onClick={() => respondToInvite(inv.lobby_id, "declined")} disabled={respondingId === inv.lobby_id}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Game Mode Cards */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Select Game Mode</h3>
                {filteredModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <Card
                      key={mode.id}
                      className={`overflow-hidden border ${mode.borderColor} cursor-pointer active:scale-[0.98] transition-all touch-manipulation`}
                      onClick={() => setActiveFlow(mode.id)}
                    >
                      <CardContent className="p-0">
                        <div className={`bg-gradient-to-r ${mode.gradient} p-3 flex items-center gap-3`}>
                          <div className="p-2 bg-white/20 rounded-lg shrink-0">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="font-bold text-white text-base">{mode.title}</h3>
                            </div>
                            <Badge className="text-xs bg-white/20 border-0 text-white px-2 py-0.5">{mode.badge}</Badge>
                          </div>
                          <ChevronRight className="h-5 w-5 text-white/70 shrink-0" />
                        </div>
                        <div className={`px-3 py-2.5 ${mode.bgLight}`}>
                          <p className="text-sm text-muted-foreground leading-relaxed">{mode.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">Min Stake: <span className="font-semibold">{formatMobiAmount(mode.minStake)}</span></span>
                            <Button size="sm" className={`h-7 text-xs bg-gradient-to-r ${mode.gradient} text-white border-0`}>
                              <Zap className="h-3 w-3 mr-1" /> Play
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Global Stats */}
              <Card className="border-muted">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase">Your Stats — This Community</h4>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="font-bold text-base">{stats.games_played}</p>
                      <p className="text-xs text-muted-foreground">Played</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="font-bold text-base text-green-600">{stats.games_won}</p>
                      <p className="text-xs text-muted-foreground">Won</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="font-bold text-base text-amber-600">{stats.partial_wins}</p>
                      <p className="text-xs text-muted-foreground">Partial</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="font-bold text-base text-red-500">{stats.games_lost}</p>
                      <p className="text-xs text-muted-foreground">Lost</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Game Flow Sheets */}
      <GroupQuizInviteSheet open={activeFlow === "group"} onOpenChange={(v) => { if (!v) { setActiveFlow(null); loadData(); } }} communityId={communityId} />
      <StandardQuizCategorySelect open={activeFlow === "standard"} onOpenChange={(v) => { if (!v) { setActiveFlow(null); loadData(); } }} communityId={communityId} />
      <InteractiveQuizMerchantSheet open={activeFlow === "interactive"} onOpenChange={(v) => { if (!v) { setActiveFlow(null); loadData(); } }} />
      <FoodQuizItemSelectSheet open={activeFlow === "food"} onOpenChange={(v) => { if (!v) { setActiveFlow(null); loadData(); } }} communityId={communityId} />
      <ScholarshipQuizSetupSheet open={activeFlow === "scholarship"} onOpenChange={(v) => { if (!v) { setActiveFlow(null); loadData(); } }} communityId={communityId} />
      <ToggleQuizPlayDialog open={activeFlow === "toggle"} onOpenChange={(v) => { if (!v) { setActiveFlow(null); loadData(); } }} communityId={communityId} />

      {/* Lobby for an accepted invite */}
      {openLobbyId && (
        <GroupQuizLobbySheet
          open={!!openLobbyId}
          onOpenChange={(v) => { if (!v) { setOpenLobbyId(null); loadData(); } }}
          lobbyId={openLobbyId}
        />
      )}
    </>
  );
}
