import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Settings,
  Gamepad2,
  HelpCircle,
  Wallet,
  Plus,
  Save,
  Trash2,
  Edit,
  Pause,
  Play,
  CalendarPlus,
  Trophy,
  Crown,
  Medal,
  Gift,
  Tv,
  Ticket,
  Users,
  ChevronDown,
  ChevronUp,
  X,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Link,
  Unlink,
  Eye,
  Megaphone,
  Share2,
  MessageCircle,
  Mail,
  Smartphone,
  Facebook,
  Store,
} from "lucide-react";
import {
  mockMerchants,
  mockSeasons,
  mockQuestions,
  mockSeasonWinners,
  MERCHANT_MIN_WALLET_PERCENT,
  WAIVER_REQUEST_FEE,
  SEASON_TYPE_CONFIG,
  type QuizMerchant,
  type QuizSeason,
  type MerchantQuestion,
  type SelectionProcess,
  type TVShowRound,
  type SeasonWinner,
} from "@/data/mobigateInteractiveQuizData";
import {
  INITIAL_ADMIN_QUESTIONS,
  ANSWER_LABELS,
  type AdminQuizQuestion,
} from "@/data/mobigateQuizQuestionsData";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { format, addMonths, addWeeks, addDays, addHours } from "date-fns";
import { shareToFacebook, shareToTwitter, shareToWhatsApp, shareViaEmail, shareViaSMS, shareViaNative, shareToInstagram, copyToClipboard } from "@/lib/shareUtils";
import { useFriendsList } from "@/hooks/useWindowData";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// Simulate "my merchant" = first approved merchant
const myMerchant = mockMerchants.find((m) => m.applicationStatus === "approved")!;

function getSeasonTypeColor(type: string) {
  switch (type) {
    case "Short": return "bg-blue-500/15 text-blue-700 border-blue-500/30";
    case "Medium": return "bg-amber-500/15 text-amber-700 border-amber-500/30";
    case "Complete": return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30";
    default: return "bg-muted text-muted-foreground";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "active": return "bg-emerald-500/15 text-emerald-700";
    case "draft": return "bg-amber-500/15 text-amber-700";
    case "suspended": return "bg-red-500/15 text-red-700";
    case "awaiting_approval": return "bg-orange-500/15 text-orange-700";
    default: return "bg-muted text-muted-foreground";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "awaiting_approval": return "Awaiting Approval";
    default: return status;
  }
}

// ─── Platform Settings Tab ───────────────────────────────────────────
function PlatformSettingsTab({ merchant }: { merchant: QuizMerchant }) {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    questionsPerPack: merchant.questionsPerPack,
    objectivePerPack: merchant.objectivePerPack,
    nonObjectivePerPack: merchant.nonObjectivePerPack,
    objectiveOptions: merchant.objectiveOptions,
    costPerQuestion: merchant.costPerQuestion,
    winPercentageThreshold: merchant.winPercentageThreshold,
    fairAnswerPercentage: merchant.fairAnswerPercentage,
    alternativeAnswersMin: merchant.alternativeAnswersMin,
    alternativeAnswersMax: merchant.alternativeAnswersMax,
    qualifyingPoints: merchant.qualifyingPoints,
    bonusGamesAfter: merchant.bonusGamesAfter,
    bonusGamesCountMin: merchant.bonusGamesCountMin,
    bonusGamesCountMax: merchant.bonusGamesCountMax,
    bonusDiscountMin: merchant.bonusDiscountMin,
    bonusDiscountMax: merchant.bonusDiscountMax,
  });

  const update = (key: string, val: number) =>
    setSettings((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    toast({ title: "✅ Settings Saved", description: "Platform settings updated successfully." });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            Question Pack Configuration
          </h3>

          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Questions Per Session</Label>
              <Input type="number" value={settings.questionsPerPack} onChange={(e) => update("questionsPerPack", +e.target.value)} className="h-11 mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Objective Questions</Label>
                <Input type="number" value={settings.objectivePerPack} onChange={(e) => update("objectivePerPack", +e.target.value)} className="h-11 mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Non-Objective Questions</Label>
                <Input type="number" value={settings.nonObjectivePerPack} onChange={(e) => update("nonObjectivePerPack", +e.target.value)} className="h-11 mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Number of Objective Options (8-10)</Label>
              <Input type="number" min={8} max={10} value={settings.objectiveOptions} onChange={(e) => update("objectiveOptions", +e.target.value)} className="h-11 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            Billing & Thresholds
          </h3>

          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Cost Per Session (₦)</Label>
              <Input type="number" value={settings.costPerQuestion} onChange={(e) => update("costPerQuestion", +e.target.value)} className="h-11 mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Win Threshold (%)</Label>
                <Input type="number" min={25} max={50} value={settings.winPercentageThreshold} onChange={(e) => update("winPercentageThreshold", +e.target.value)} className="h-11 mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Fair Answer (%)</Label>
                <Input type="number" value={settings.fairAnswerPercentage} onChange={(e) => update("fairAnswerPercentage", +e.target.value)} className="h-11 mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Alt. Answers Min</Label>
                <Input type="number" min={2} max={5} value={settings.alternativeAnswersMin} onChange={(e) => update("alternativeAnswersMin", +e.target.value)} className="h-11 mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Alt. Answers Max</Label>
                <Input type="number" min={2} max={5} value={settings.alternativeAnswersMax} onChange={(e) => update("alternativeAnswersMax", +e.target.value)} className="h-11 mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Qualifying Points for Game Show</Label>
              <Input type="number" value={settings.qualifyingPoints} onChange={(e) => update("qualifyingPoints", +e.target.value)} className="h-11 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Gift className="h-4 w-4 text-primary" />
            Bonus Games Configuration
          </h3>

          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Bonus Games After X Packs</Label>
              <Input type="number" value={settings.bonusGamesAfter} onChange={(e) => update("bonusGamesAfter", +e.target.value)} className="h-11 mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Min Bonus Games</Label>
                <Input type="number" value={settings.bonusGamesCountMin} onChange={(e) => update("bonusGamesCountMin", +e.target.value)} className="h-11 mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Max Bonus Games</Label>
                <Input type="number" value={settings.bonusGamesCountMax} onChange={(e) => update("bonusGamesCountMax", +e.target.value)} className="h-11 mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Min Discount (%)</Label>
                <Input type="number" value={settings.bonusDiscountMin} onChange={(e) => update("bonusDiscountMin", +e.target.value)} className="h-11 mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Max Discount (%)</Label>
                <Input type="number" value={settings.bonusDiscountMax} onChange={(e) => update("bonusDiscountMax", +e.target.value)} className="h-11 mt-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full h-12 text-sm font-bold gap-2" onClick={handleSave}>
        <Save className="h-4 w-4" />
        Save Platform Settings
      </Button>
    </div>
  );
}

// ─── Seasons Tab ─────────────────────────────────────────────────────
function SeasonsTab({ merchantId, merchant }: { merchantId: string; merchant: QuizMerchant }) {
  const { toast } = useToast();
  const [seasons, setSeasons] = useState<QuizSeason[]>(
    mockSeasons.filter((s) => s.merchantId === merchantId)
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedSeason, setExpandedSeason] = useState<string | null>(null);
  const [extendingSeason, setExtendingSeason] = useState<string | null>(null);
  const [extensionWeeks, setExtensionWeeks] = useState(2);
  const [extensionReason, setExtensionReason] = useState("");
  const [boostSeasonId, setBoostSeasonId] = useState<string | null>(null);
  const [boostStep, setBoostStep] = useState<'menu' | 'boost-confirm' | 'friends-picker' | 'store-form' | 'social-picker' | null>('menu');
  const [boostedSeasons, setBoostedSeasons] = useState<string[]>([]);
  const [storeListedSeasons, setStoreListedSeasons] = useState<string[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [boostDuration, setBoostDuration] = useState(7);
  const [storePromoMessage, setStorePromoMessage] = useState("");
  const friendsData = useFriendsList();
  const mockFriends = friendsData?.length ? friendsData : [
    { id: "f1", name: "Adebayo Johnson", avatar: "/placeholder.svg" },
    { id: "f2", name: "Chioma Okwu", avatar: "/placeholder.svg" },
    { id: "f3", name: "Emeka Obi", avatar: "/placeholder.svg" },
    { id: "f4", name: "Fatima Bello", avatar: "/placeholder.svg" },
    { id: "f5", name: "Grace Adekunle", avatar: "/placeholder.svg" },
    { id: "f6", name: "Hassan Musa", avatar: "/placeholder.svg" },
    { id: "f7", name: "Ifeoma Nwosu", avatar: "/placeholder.svg" },
    { id: "f8", name: "James Okoro", avatar: "/placeholder.svg" },
  ];
  // Waiver state
  const [waiverRequested, setWaiverRequested] = useState(false);
  const [waiverContext, setWaiverContext] = useState("");
  // Create form state
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"Short" | "Medium" | "Complete">("Short");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEntryFee, setNewEntryFee] = useState(200);
  const [newFirstPrize, setNewFirstPrize] = useState(5000000);
  const [newSecondPrize, setNewSecondPrize] = useState(2500000);
  const [newThirdPrize, setNewThirdPrize] = useState(1000000);
  const [newConsolationPerPlayer, setNewConsolationPerPlayer] = useState(300000);
  const [newConsolationCount, setNewConsolationCount] = useState(10);
  const [newMinParticipants, setNewMinParticipants] = useState(10000);
  const [newSelectionRounds, setNewSelectionRounds] = useState<SelectionProcess[]>([
    { round: 1, entriesSelected: 10000, entryFee: 200 },
  ]);
  const [newTvRounds, setNewTvRounds] = useState<TVShowRound[]>([
    { round: 1, entriesSelected: 50, entryFee: 2000, label: "1st TV Show" },
  ]);

  const computedEndDate = newStartDate
    ? format(addMonths(new Date(newStartDate), SEASON_TYPE_CONFIG[newType].duration), "yyyy-MM-dd")
    : "";

  const totalPrizes = newFirstPrize + newSecondPrize + newThirdPrize + newConsolationPerPlayer * newConsolationCount;

  const addSelectionRound = () => {
    setNewSelectionRounds((p) => [
      ...p,
      { round: p.length + 1, entriesSelected: 1000, entryFee: 500 },
    ]);
  };

  const removeSelectionRound = (idx: number) => {
    setNewSelectionRounds((p) => p.filter((_, i) => i !== idx).map((r, i) => ({ ...r, round: i + 1 })));
  };

  const addTvRound = () => {
    setNewTvRounds((p) => [
      ...p,
      { round: p.length + 1, entriesSelected: 20, entryFee: 3000, label: `Round ${p.length + 1}` },
    ]);
  };

  const removeTvRound = (idx: number) => {
    setNewTvRounds((p) => p.filter((_, i) => i !== idx).map((r, i) => ({ ...r, round: i + 1 })));
  };

  const handleCreate = () => {
    if (!newName || !newStartDate) {
      toast({ title: "⚠️ Missing Fields", description: "Please fill in season name and start date.", variant: "destructive" });
      return;
    }
    const newSeason: QuizSeason = {
      id: `s-new-${Date.now()}`,
      merchantId,
      name: newName,
      type: newType,
      duration: SEASON_TYPE_CONFIG[newType].duration,
      selectionLevels: SEASON_TYPE_CONFIG[newType].processes,
      entryFee: newEntryFee,
      currentLevel: 0,
      totalParticipants: 0,
      prizePerLevel: 0,
      isLive: false,
      status: "open",
      startDate: newStartDate,
      endDate: computedEndDate,
      originalEndDate: computedEndDate,
      isExtended: false,
      extensionWeeks: 0,
      extensionReason: "",
      minimumTargetParticipants: newMinParticipants,
      consolationPrizesEnabled: newConsolationCount > 0,
      consolationPrizePool: newConsolationPerPlayer * newConsolationCount,
      firstPrize: newFirstPrize,
      secondPrize: newSecondPrize,
      thirdPrize: newThirdPrize,
      consolationPrizePerPlayer: newConsolationPerPlayer,
      consolationPrizeCount: newConsolationCount,
      totalWinningPrizes: totalPrizes,
      quizStatus: waiverRequested ? "awaiting_approval" : "draft",
      selectionProcesses: newSelectionRounds,
      tvShowRounds: newTvRounds,
    };
    setSeasons((p) => [newSeason, ...p]);
    setShowCreateForm(false);
    setNewName("");
    const statusLabel = waiverRequested ? "awaiting approval" : "draft";
    toast({ title: "✅ Season Created", description: `"${newName}" has been created as ${statusLabel}.` });
    setWaiverRequested(false);
    setWaiverContext("");
  };

  const toggleStatus = (seasonId: string, newStatus: "active" | "suspended" | "draft" | "awaiting_approval") => {
    setSeasons((p) => p.map((s) => (s.id === seasonId ? { ...s, quizStatus: newStatus } : s)));
    toast({ title: "✅ Status Updated", description: `Season status changed to ${newStatus}.` });
  };

  const handleExtend = (seasonId: string) => {
    if (!extensionReason.trim()) {
      toast({ title: "⚠️ Reason Required", description: "Please provide a reason for extension.", variant: "destructive" });
      return;
    }
    setSeasons((p) =>
      p.map((s) => {
        if (s.id !== seasonId) return s;
        const newEnd = format(addWeeks(new Date(s.endDate), extensionWeeks), "yyyy-MM-dd");
        return { ...s, isExtended: true, extensionWeeks, extensionReason, endDate: newEnd };
      })
    );
    setExtendingSeason(null);
    setExtensionReason("");
    toast({ title: "✅ Season Extended", description: `Extended by ${extensionWeeks} weeks.` });
  };

  const deleteSeason = (seasonId: string) => {
    setSeasons((p) => p.filter((s) => s.id !== seasonId));
    toast({ title: "🗑️ Season Deleted", description: "Season has been removed." });
  };

  return (
    <div className="space-y-4">
      <Button
        className="w-full h-12 gap-2 text-sm font-bold"
        onClick={() => setShowCreateForm(!showCreateForm)}
        variant={showCreateForm ? "outline" : "default"}
      >
        {showCreateForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {showCreateForm ? "Cancel" : "Create New Season"}
      </Button>

      {/* Create Season Form */}
      {showCreateForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-4">
            <h3 className="text-sm font-bold text-primary">New Quiz Season</h3>

            <div>
              <Label className="text-xs text-muted-foreground">Season Name</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Tech Genius Season 2" className="h-11 mt-1" />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Season Type</Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as any)}>
                <SelectTrigger className="h-11 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Short">Short Season (4 months, 3 levels)</SelectItem>
                  <SelectItem value="Medium">Medium Season (6 months, 5 levels)</SelectItem>
                  <SelectItem value="Complete">Complete Season (12 months, 7 levels)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Start Date</Label>
                <Input type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} className="h-11 mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">End Date (auto)</Label>
                <Input value={computedEndDate ? format(new Date(computedEndDate), "MMM d, yyyy") : "—"} readOnly className="h-11 mt-1 bg-muted/30" />
              </div>
            </div>

            {/* Season Preview */}
            {newStartDate && computedEndDate && (
              <div className="p-3 bg-muted/20 rounded-lg space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={`text-xs ${getSeasonTypeColor(newType)}`}>
                    {newType} Season
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(newStartDate), "MMM d, yyyy")} — {format(new Date(computedEndDate), "MMM d, yyyy")}
                </p>
              </div>
            )}

            <div>
              <Label className="text-xs text-muted-foreground">Initialization Fee per Participant (₦)</Label>
              <Input type="number" value={newEntryFee} onChange={(e) => setNewEntryFee(+e.target.value)} className="h-11 mt-1" />
              <p className="text-xs text-muted-foreground mt-1">Default: ₦200.00 (M200)</p>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Maximum Initial Participants</Label>
              <Input type="number" value={newMinParticipants} onChange={(e) => setNewMinParticipants(+e.target.value)} className="h-11 mt-1" />
              <p className="text-xs text-muted-foreground mt-1">Capped at 10,000 participants per season</p>
            </div>

            <div className="p-3 bg-primary/5 rounded-lg space-y-1">
              <p className="text-xs text-muted-foreground">Total Initial Registration Revenue</p>
              <p className="text-base font-extrabold text-primary">
                {formatLocalAmount(newEntryFee * newMinParticipants, "NGN")} (M{(newEntryFee * newMinParticipants).toLocaleString()})
              </p>
              <p className="text-xs text-muted-foreground">
                {formatLocalAmount(newEntryFee, "NGN")} × {newMinParticipants.toLocaleString()} participants
              </p>
            </div>

            {/* Prize Breakdown */}
            <div className="space-y-2 pt-2 border-t">
              <h4 className="text-xs font-bold flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-600" />
                Prize Breakdown
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">1st Prize (₦)</Label>
                  <Input type="number" value={newFirstPrize} onChange={(e) => setNewFirstPrize(+e.target.value)} className="h-11 mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">2nd Prize (₦)</Label>
                  <Input type="number" value={newSecondPrize} onChange={(e) => setNewSecondPrize(+e.target.value)} className="h-11 mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">3rd Prize (₦)</Label>
                  <Input type="number" value={newThirdPrize} onChange={(e) => setNewThirdPrize(+e.target.value)} className="h-11 mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Consolation (₦ each)</Label>
                  <Input type="number" value={newConsolationPerPlayer} onChange={(e) => setNewConsolationPerPlayer(+e.target.value)} className="h-11 mt-1" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Number of Consolation Winners</Label>
                <Input type="number" value={newConsolationCount} onChange={(e) => setNewConsolationCount(+e.target.value)} className="h-11 mt-1" />
              </div>
              <div className="p-2 bg-amber-500/10 rounded-lg text-center">
                <span className="text-xs text-muted-foreground">Total Prize Pool: </span>
                <span className="text-sm font-bold text-amber-700">{formatLocalAmount(totalPrizes, "NGN")}</span>
              </div>
            </div>

            {/* Selection Rounds */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold flex items-center gap-1.5">
                  <Ticket className="h-3.5 w-3.5 text-primary" />
                  Selection Rounds
                </h4>
                <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={addSelectionRound}>
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </div>
              {newSelectionRounds.map((sr, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-1 overflow-x-auto min-w-0 touch-auto overscroll-x-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="flex items-center gap-2 min-w-max pb-1">
                      <span className="text-xs text-muted-foreground w-8 shrink-0 font-bold">R{sr.round}</span>
                      <div className="shrink-0 w-20">
                        <Label className="text-[10px] text-muted-foreground">Entries</Label>
                        <Input type="number" placeholder="Entries" value={sr.entriesSelected}
                          onChange={(e) => {
                            const copy = [...newSelectionRounds];
                            copy[idx] = { ...copy[idx], entriesSelected: +e.target.value };
                            setNewSelectionRounds(copy);
                          }} className="h-9 text-xs" />
                      </div>
                      <div className="shrink-0 w-20">
                        <Label className="text-[10px] text-muted-foreground">Fee (₦)</Label>
                        <Input type="number" placeholder="Fee" value={sr.entryFee}
                          onChange={(e) => {
                            const copy = [...newSelectionRounds];
                            copy[idx] = { ...copy[idx], entryFee: +e.target.value };
                            setNewSelectionRounds(copy);
                          }} className="h-9 text-xs" />
                      </div>
                      <div className="shrink-0 w-20">
                        <Label className="text-[10px] text-muted-foreground">Days</Label>
                        <Input type="number" placeholder="Days" min={1} value={sr.durationDays || ""}
                          onChange={(e) => {
                            const copy = [...newSelectionRounds];
                            const days = +e.target.value || undefined;
                            const endDate = days && copy[idx].startDate
                              ? format(addDays(new Date(copy[idx].startDate!), days), "yyyy-MM-dd")
                              : copy[idx].endDate;
                            copy[idx] = { ...copy[idx], durationDays: days, endDate };
                            setNewSelectionRounds(copy);
                          }} className="h-9 text-xs" />
                      </div>
                      <div className="shrink-0 w-32">
                        <Label className="text-[10px] text-muted-foreground">Start Date</Label>
                        <Input type="date" value={sr.startDate || ""}
                          onChange={(e) => {
                            const copy = [...newSelectionRounds];
                            const startDate = e.target.value || undefined;
                            const endDate = startDate && copy[idx].durationDays
                              ? format(addDays(new Date(startDate), copy[idx].durationDays!), "yyyy-MM-dd")
                              : undefined;
                            copy[idx] = { ...copy[idx], startDate, endDate };
                            setNewSelectionRounds(copy);
                          }} className="h-9 text-xs" />
                      </div>
                      <div className="shrink-0 w-32">
                        <Label className="text-[10px] text-muted-foreground">End Date</Label>
                        <Input
                          value={sr.endDate ? format(new Date(sr.endDate), "MMM d, yyyy") : "—"}
                          readOnly className="h-9 text-xs bg-muted/30" />
                      </div>
                    </div>
                  </div>
                  {newSelectionRounds.length > 1 && (
                    <button onClick={() => removeSelectionRound(idx)} className="text-red-500 shrink-0 ml-1">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* TV Show Rounds */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold flex items-center gap-1.5">
                  <Tv className="h-3.5 w-3.5 text-purple-500" />
                  TV Show Rounds
                </h4>
                <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={addTvRound}>
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </div>
              {newTvRounds.map((tv, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-1 overflow-x-auto min-w-0 touch-auto overscroll-x-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="flex items-center gap-2 min-w-max pb-1">
                      <div className="shrink-0 w-28">
                        <Label className="text-[10px] text-muted-foreground">Label</Label>
                        <Input value={tv.label}
                          onChange={(e) => {
                            const copy = [...newTvRounds];
                            copy[idx] = { ...copy[idx], label: e.target.value };
                            setNewTvRounds(copy);
                          }} placeholder="Label" className="h-9 text-xs" />
                      </div>
                      <div className="shrink-0 w-20">
                        <Label className="text-[10px] text-muted-foreground">Entries</Label>
                        <Input type="number" value={tv.entriesSelected}
                          onChange={(e) => {
                            const copy = [...newTvRounds];
                            copy[idx] = { ...copy[idx], entriesSelected: +e.target.value };
                            setNewTvRounds(copy);
                          }} placeholder="Entries" className="h-9 text-xs" />
                      </div>
                      <div className="shrink-0 w-20">
                        <Label className="text-[10px] text-muted-foreground">Fee (₦)</Label>
                        <Input type="number" value={tv.entryFee}
                          onChange={(e) => {
                            const copy = [...newTvRounds];
                            copy[idx] = { ...copy[idx], entryFee: +e.target.value };
                            setNewTvRounds(copy);
                          }} placeholder="Fee" className="h-9 text-xs" />
                      </div>
                      <div className="shrink-0 w-20">
                        <Label className="text-[10px] text-muted-foreground">Hours</Label>
                        <Input type="number" placeholder="Hrs" min={1} value={tv.durationHours || ""}
                          onChange={(e) => {
                            const copy = [...newTvRounds];
                            const hours = +e.target.value || undefined;
                            const endDateTime = hours && copy[idx].startDateTime
                              ? format(addHours(new Date(copy[idx].startDateTime!), hours), "yyyy-MM-dd'T'HH:mm")
                              : copy[idx].endDateTime;
                            copy[idx] = { ...copy[idx], durationHours: hours, endDateTime };
                            setNewTvRounds(copy);
                          }} className="h-9 text-xs" />
                      </div>
                      <div className="shrink-0 w-44">
                        <Label className="text-[10px] text-muted-foreground">Start Date & Time</Label>
                        <Input type="datetime-local" value={tv.startDateTime || ""}
                          onChange={(e) => {
                            const copy = [...newTvRounds];
                            const startDateTime = e.target.value || undefined;
                            const endDateTime = startDateTime && copy[idx].durationHours
                              ? format(addHours(new Date(startDateTime), copy[idx].durationHours!), "yyyy-MM-dd'T'HH:mm")
                              : undefined;
                            copy[idx] = { ...copy[idx], startDateTime, endDateTime };
                            setNewTvRounds(copy);
                          }} className="h-9 text-xs" />
                      </div>
                      <div className="shrink-0 w-36">
                        <Label className="text-[10px] text-muted-foreground">End Date & Time</Label>
                        <Input
                          value={tv.endDateTime ? format(new Date(tv.endDateTime), "MMM d, yyyy h:mm a") : "—"}
                          readOnly className="h-9 text-xs bg-muted/30" />
                      </div>
                    </div>
                  </div>
                  {newTvRounds.length > 1 && (
                    <button onClick={() => removeTvRound(idx)} className="text-red-500 shrink-0 ml-1">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Solvency Check & Waiver */}
            {(() => {
              const requiredBalance = totalPrizes * MERCHANT_MIN_WALLET_PERCENT;
              const isSolvent = merchant.walletBalance >= requiredBalance;
              const shortfall = requiredBalance - merchant.walletBalance;

              return (
                <>
                  {!isSolvent && !waiverRequested && (
                    <Card className="border-orange-500/40 bg-orange-500/5">
                      <CardContent className="p-3 space-y-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-orange-700">Insufficient Wallet Balance</p>
                            <p className="text-xs text-muted-foreground">
                              Your wallet must hold at least <span className="font-bold text-foreground">70%</span> of the total prize pool to create a season.
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Your Wallet</span>
                            <span className="font-bold">{formatLocalAmount(merchant.walletBalance, "NGN")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Required (70% of {formatLocalAmount(totalPrizes, "NGN")})</span>
                            <span className="font-bold text-orange-700">{formatLocalAmount(requiredBalance, "NGN")}</span>
                          </div>
                          <div className="flex justify-between border-t pt-1">
                            <span className="text-muted-foreground">Shortfall</span>
                            <span className="font-bold text-red-600">{formatLocalAmount(shortfall, "NGN")}</span>
                          </div>
                        </div>
                        <div className="border-t pt-3 space-y-2">
                          <p className="text-xs font-semibold">Request an Exclusive Waiver</p>
                          <p className="text-[11px] text-muted-foreground">
                            A non-refundable fee of <span className="font-bold">{formatLocalAmount(WAIVER_REQUEST_FEE, "NGN")}</span> applies. Your season will be created as "Awaiting Approval".
                          </p>
                          <Textarea
                            placeholder="Optional: explain your situation (e.g. 'Sponsorship funds arriving next week')"
                            value={waiverContext}
                            onChange={(e) => setWaiverContext(e.target.value)}
                            className="min-h-[60px] text-xs"
                          />
                          <Button
                            variant="outline"
                            className="w-full h-10 text-xs font-bold gap-2 border-orange-500/40 text-orange-700 hover:bg-orange-500/10"
                            onClick={() => {
                              setWaiverRequested(true);
                              toast({
                                title: "📋 Waiver Request Submitted",
                                description: `Fee of ${formatLocalAmount(WAIVER_REQUEST_FEE, "NGN")} deducted. You can now create the season.`,
                              });
                            }}
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Request Waiver ({formatLocalAmount(WAIVER_REQUEST_FEE, "NGN")})
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {waiverRequested && (
                    <Card className="border-emerald-500/40 bg-emerald-500/5">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-emerald-700">Waiver Submitted</p>
                            <p className="text-xs text-muted-foreground">
                              Season will be created as <span className="font-bold">"Awaiting Approval"</span>. An admin will review your request.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Button
                    className="w-full h-12 text-sm font-bold gap-2"
                    onClick={handleCreate}
                    disabled={!isSolvent && !waiverRequested}
                  >
                    <Save className="h-4 w-4" />
                    Create Season
                  </Button>
                </>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Season List */}
      {seasons.length === 0 && !showCreateForm && (
        <div className="text-center py-10 text-muted-foreground text-sm">
          No seasons yet. Create your first season above.
        </div>
      )}

      {seasons.map((season) => {
        const isExpanded = expandedSeason === season.id;
        const isExtending = extendingSeason === season.id;
        const daysRemaining = Math.max(0, Math.ceil((new Date(season.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
        const participantProgress = season.minimumTargetParticipants > 0
          ? Math.min(100, (season.totalParticipants / season.minimumTargetParticipants) * 100)
          : 0;

        return (
          <Card key={season.id} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Season Header */}
              <button
                className="w-full p-3 flex items-center justify-between text-left touch-manipulation"
                onClick={() => setExpandedSeason(isExpanded ? null : season.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm break-words">{season.name}</h4>
                    <Badge variant="outline" className={`text-xs shrink-0 ${getSeasonTypeColor(season.type)}`}>
                      {season.type} Season
                    </Badge>
                    <Badge className={`text-xs shrink-0 ${getStatusColor(season.quizStatus)}`}>
                      {getStatusLabel(season.quizStatus)}
                    </Badge>
                    {season.isLive && (
                      <Badge className="bg-red-500 text-white text-xs animate-pulse shrink-0">🔴 LIVE</Badge>
                    )}
                    {boostedSeasons.includes(season.id) && (
                      <Badge className="bg-primary/15 text-primary text-xs shrink-0">🚀 Boosted</Badge>
                    )}
                    {storeListedSeasons.includes(season.id) && (
                      <Badge className="bg-emerald-500/15 text-emerald-700 text-xs shrink-0">🏪 On Store</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(season.startDate), "MMM d, yyyy")} — {format(new Date(season.endDate), "MMM d, yyyy")}
                    <span className="ml-2 inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {daysRemaining} days left
                    </span>
                  </p>
                </div>
                {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
              </button>

              {isExpanded && (
                <div className="border-t">
                  {/* Initialization Fee & Registration Info */}
                  <div className="p-3 bg-primary/5 space-y-1.5 border-b">
                    <span className="text-xs font-bold flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-primary" /> Registration Info
                    </span>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Initialization Fee</span>
                        <span className="font-bold">{formatLocalAmount(season.entryFee, "NGN")} (M{season.entryFee.toLocaleString()})</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Max Participants</span>
                        <span className="font-bold">{season.minimumTargetParticipants.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs pt-1 border-t border-primary/10 font-bold text-primary">
                        <span>Registration Revenue</span>
                        <span>{formatLocalAmount(season.entryFee * season.minimumTargetParticipants, "NGN")}</span>
                      </div>
                      {(() => {
                        const selectionRevenue = season.selectionProcesses.reduce((sum, sp) => sum + sp.entryFee * sp.entriesSelected, 0);
                        const tvRevenue = season.tvShowRounds.reduce((sum, tv) => sum + tv.entryFee * tv.entriesSelected, 0);
                        const allRoundsRevenue = selectionRevenue + tvRevenue;
                        const registrationRevenue = season.entryFee * season.minimumTargetParticipants;
                        const totalRevenue = registrationRevenue + allRoundsRevenue;
                        return (
                          <>
                            <div className="flex justify-between text-xs font-bold text-primary">
                              <span>All Rounds Revenue</span>
                              <span>{formatLocalAmount(allRoundsRevenue, "NGN")}</span>
                            </div>
                            <div className="flex justify-between text-xs pt-1 border-t border-primary/20 font-extrabold text-primary">
                              <span>Total Revenue</span>
                              <span>{formatLocalAmount(totalRevenue, "NGN")}</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Participants Progress */}
                  <div className="p-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Current Participants</span>
                      <span className="font-semibold">{season.totalParticipants.toLocaleString()} / {season.minimumTargetParticipants.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${participantProgress}%` }}
                      />
                    </div>
                    {participantProgress < 100 && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Below maximum capacity
                      </p>
                    )}
                  </div>

                  {/* Prize Breakdown */}
                  <div className="p-3 bg-amber-500/5 space-y-1.5 border-t">
                    <span className="text-xs font-bold flex items-center gap-1">
                      <Trophy className="h-3.5 w-3.5 text-amber-600" /> Prizes
                    </span>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1"><Crown className="h-3 w-3 text-amber-500" /> 1st</span>
                        <span className="font-bold">{formatLocalAmount(season.firstPrize, "NGN")}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1"><Medal className="h-3 w-3 text-gray-400" /> 2nd</span>
                        <span className="font-bold">{formatLocalAmount(season.secondPrize, "NGN")}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1"><Medal className="h-3 w-3 text-amber-700" /> 3rd</span>
                        <span className="font-bold">{formatLocalAmount(season.thirdPrize, "NGN")}</span>
                      </div>
                      {season.consolationPrizesEnabled && (
                        <div className="flex justify-between text-xs">
                          <span className="flex items-center gap-1"><Gift className="h-3 w-3 text-purple-500" /> Consolation ×{season.consolationPrizeCount}</span>
                          <span className="font-bold">{formatLocalAmount(season.consolationPrizePerPlayer, "NGN")} each</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs pt-1.5 border-t border-amber-500/20 font-bold text-amber-700">
                        <span>Total Prize Pool</span>
                        <span>{formatLocalAmount(season.totalWinningPrizes, "NGN")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Selection Rounds */}
                  {season.selectionProcesses.length > 0 && (
                    <div className="p-3 space-y-1.5 border-t">
                      <span className="text-xs font-bold flex items-center gap-1">
                        <Ticket className="h-3.5 w-3.5 text-primary" /> Selection Rounds
                      </span>
                      {season.selectionProcesses.map((sp) => (
                        <div key={sp.round} className="flex justify-between text-xs bg-muted/10 rounded px-2 py-1.5">
                          <span className="text-muted-foreground">Round {sp.round}</span>
                          <span>{sp.entriesSelected.toLocaleString()} entries · {formatLocalAmount(sp.entryFee, "NGN")}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TV Show Rounds */}
                  {season.tvShowRounds.length > 0 && (
                    <div className="p-3 space-y-1.5 border-t">
                      <span className="text-xs font-bold flex items-center gap-1">
                        <Tv className="h-3.5 w-3.5 text-purple-500" /> TV Show Rounds
                      </span>
                      {season.tvShowRounds.map((tv) => (
                        <div key={tv.round} className="flex justify-between text-xs bg-purple-500/5 rounded px-2 py-1.5">
                          <span className="text-muted-foreground">{tv.label}</span>
                          <span>{tv.entriesSelected} entries · {formatLocalAmount(tv.entryFee, "NGN")}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Extension Info */}
                  {season.isExtended && (
                    <div className="p-3 bg-blue-500/5 border-t text-xs space-y-1">
                      <span className="font-bold text-blue-700">⏳ Extended by {season.extensionWeeks} weeks</span>
                      <p className="text-muted-foreground">Reason: {season.extensionReason}</p>
                    </div>
                  )}

                  {/* Extension Form */}
                  {isExtending && (
                    <div className="p-3 border-t space-y-3">
                      <h4 className="text-xs font-bold">Extend Season</h4>
                      <div>
                        <Label className="text-xs text-muted-foreground">Weeks (1-8)</Label>
                        <Input type="number" min={1} max={8} value={extensionWeeks} onChange={(e) => setExtensionWeeks(+e.target.value)} className="h-10 mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Reason</Label>
                        <Input value={extensionReason} onChange={(e) => setExtensionReason(e.target.value)} placeholder="e.g. Low participation" className="h-10 mt-1" />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 h-10" onClick={() => setExtendingSeason(null)}>Cancel</Button>
                        <Button size="sm" className="flex-1 h-10" onClick={() => handleExtend(season.id)}>Confirm</Button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="p-3 border-t flex flex-wrap gap-2">
                    {season.quizStatus === "draft" && (
                      <Button size="sm" variant="outline" className="h-9 text-xs gap-1 flex-1" onClick={() => toggleStatus(season.id, "active")}>
                        <Play className="h-3 w-3" /> Activate
                      </Button>
                    )}
                    {season.quizStatus === "active" && (
                      <Button size="sm" variant="outline" className="h-9 text-xs gap-1 flex-1" onClick={() => toggleStatus(season.id, "suspended")}>
                        <Pause className="h-3 w-3" /> Suspend
                      </Button>
                    )}
                    {season.quizStatus === "suspended" && (
                      <Button size="sm" variant="outline" className="h-9 text-xs gap-1 flex-1" onClick={() => toggleStatus(season.id, "active")}>
                        <Play className="h-3 w-3" /> Reactivate
                      </Button>
                    )}
                    {season.quizStatus === "awaiting_approval" && (
                      <Badge className="bg-orange-500/15 text-orange-700 text-xs px-3 py-1.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Pending Admin Approval
                      </Badge>
                    )}
                    {!isExtending && (
                      <Button size="sm" variant="outline" className="h-9 text-xs gap-1 flex-1" onClick={() => setExtendingSeason(season.id)}>
                        <CalendarPlus className="h-3 w-3" /> Extend
                      </Button>
                    )}
                    <Button size="sm" variant="default" className="h-9 text-xs gap-1 flex-1 bg-gradient-to-r from-primary to-primary/80 touch-manipulation active:scale-[0.97]" onClick={() => { setBoostSeasonId(season.id); setBoostStep('menu'); setSelectedFriends([]); setStorePromoMessage(""); }}>
                      <Megaphone className="h-3 w-3" /> Boost Show
                    </Button>
                    <Button size="sm" variant="destructive" className="h-9 text-xs gap-1 touch-manipulation active:scale-[0.97]" onClick={() => deleteSeason(season.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Boost Show Drawer */}
                  {boostSeasonId === season.id && (() => {
                    const shareUrl = `${window.location.origin}/quiz-season/${season.id}`;
                    const shareText = `Join "${season.name}" on Mobigate! Play quizzes and win up to ${formatLocalAmount(season.firstPrize, "NGN")} in prizes. 🏆`;
                    const emailSubject = `Join ${season.name} on Mobigate!`;
                    const emailBody = `Hey!\n\nI wanted to share this amazing quiz season with you:\n\n🎯 ${season.name}\n💰 Win up to ${formatLocalAmount(season.firstPrize, "NGN")}\n🏆 Total Prize Pool: ${formatLocalAmount(season.totalWinningPrizes, "NGN")}\n\nJoin now: ${shareUrl}\n\nSee you there!`;
                    const smsBody = `${shareText}\n\nJoin: ${shareUrl}`;

                    return (
                    <div className="border-t bg-muted/10">
                      <div className="p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold flex items-center gap-2">
                            <Megaphone className="h-4 w-4 text-primary" />
                            {boostStep === 'menu' && 'Boost Show'}
                            {boostStep === 'boost-confirm' && 'Boost on Mobigate'}
                            {boostStep === 'friends-picker' && 'Share with Friends'}
                            {boostStep === 'store-form' && 'List on Mobi-Store'}
                            {boostStep === 'social-picker' && 'Share on Social Media'}
                          </h4>
                          <button onClick={() => { if (boostStep !== 'menu') { setBoostStep('menu'); } else { setBoostSeasonId(null); } }} className="text-muted-foreground touch-manipulation active:scale-[0.95]">
                            {boostStep !== 'menu' ? <ArrowLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          </button>
                        </div>

                        {/* ── MENU ── */}
                        {boostStep === 'menu' && (
                          <>
                            <p className="text-xs text-muted-foreground">Promote "{season.name}" to reach more participants</p>
                            <div className="space-y-2">
                              <button className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors touch-manipulation active:scale-[0.97]" onClick={() => setBoostStep('boost-confirm')}>
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Megaphone className="h-5 w-5 text-primary" /></div>
                                <div className="text-left flex-1 min-w-0">
                                  <p className="text-sm font-semibold">Boost on Mobigate</p>
                                  <p className="text-xs text-muted-foreground">Promote to all Mobigate users</p>
                                </div>
                                {boostedSeasons.includes(season.id) && <Badge className="bg-primary/15 text-primary text-xs shrink-0">Active</Badge>}
                              </button>

                              <button className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors touch-manipulation active:scale-[0.97]" onClick={() => setBoostStep('friends-picker')}>
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0"><Users className="h-5 w-5 text-blue-600" /></div>
                                <div className="text-left flex-1 min-w-0">
                                  <p className="text-sm font-semibold">Share with Mobigate Users</p>
                                  <p className="text-xs text-muted-foreground">Especially friends & connections</p>
                                </div>
                              </button>

                              <button className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors touch-manipulation active:scale-[0.97]" onClick={() => setBoostStep('store-form')}>
                                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0"><Store className="h-5 w-5 text-emerald-600" /></div>
                                <div className="text-left flex-1 min-w-0">
                                  <p className="text-sm font-semibold">Share on Mobi-Store</p>
                                  <p className="text-xs text-muted-foreground">Feature in the Mobi-Store marketplace</p>
                                </div>
                                {storeListedSeasons.includes(season.id) && <Badge className="bg-emerald-500/15 text-emerald-700 text-xs shrink-0">Listed</Badge>}
                              </button>

                              <button className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors touch-manipulation active:scale-[0.97]" onClick={() => setBoostStep('social-picker')}>
                                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0"><Share2 className="h-5 w-5 text-purple-600" /></div>
                                <div className="text-left flex-1 min-w-0">
                                  <p className="text-sm font-semibold">Share on Social Media</p>
                                  <p className="text-xs text-muted-foreground">Facebook, WhatsApp, Instagram, Twitter</p>
                                </div>
                              </button>

                              <button className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors touch-manipulation active:scale-[0.97]" onClick={() => { shareViaEmail(emailSubject, emailBody); toast({ title: "✉️ Email App Opening", description: "Your email app should open with the invitation." }); }}>
                                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0"><Mail className="h-5 w-5 text-amber-600" /></div>
                                <div className="text-left flex-1 min-w-0">
                                  <p className="text-sm font-semibold">Share via Email</p>
                                  <p className="text-xs text-muted-foreground">Opens your email app with invitation</p>
                                </div>
                              </button>

                              <button className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors touch-manipulation active:scale-[0.97]" onClick={() => { shareViaSMS(smsBody); toast({ title: "💬 SMS App Opening", description: "Your messaging app should open with the invitation." }); }}>
                                <div className="h-10 w-10 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0"><Smartphone className="h-5 w-5 text-teal-600" /></div>
                                <div className="text-left flex-1 min-w-0">
                                  <p className="text-sm font-semibold">Share via SMS</p>
                                  <p className="text-xs text-muted-foreground">Opens messaging app with invitation</p>
                                </div>
                              </button>
                            </div>
                          </>
                        )}

                        {/* ── BOOST CONFIRM ── */}
                        {boostStep === 'boost-confirm' && (
                          <div className="space-y-3">
                            <p className="text-xs text-muted-foreground">Select how long to boost "{season.name}" on Mobigate's featured feed.</p>
                            <div className="space-y-2">
                              {[
                                { days: 7, price: 5000, label: "7 Days", desc: "Reach ~2,000 users" },
                                { days: 14, price: 8500, label: "14 Days", desc: "Reach ~5,000 users" },
                                { days: 30, price: 15000, label: "30 Days", desc: "Reach ~12,000 users" },
                              ].map((opt) => (
                                <button
                                  key={opt.days}
                                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors touch-manipulation active:scale-[0.97] ${boostDuration === opt.days ? 'border-primary bg-primary/5' : 'bg-card hover:bg-accent/50'}`}
                                  onClick={() => setBoostDuration(opt.days)}
                                >
                                  <div className="text-left">
                                    <p className="text-sm font-semibold">{opt.label}</p>
                                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-primary">{formatLocalAmount(opt.price, "NGN")}</p>
                                    <p className="text-xs text-muted-foreground">M{opt.price.toLocaleString()}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                            <Button
                              className="w-full h-12 text-sm font-bold gap-2 touch-manipulation active:scale-[0.97]"
                              onClick={() => {
                                setBoostedSeasons((p) => [...new Set([...p, season.id])]);
                                toast({ title: "🚀 Boost Activated!", description: `"${season.name}" is now boosted for ${boostDuration} days on Mobigate.` });
                                setBoostSeasonId(null);
                              }}
                            >
                              <Megaphone className="h-4 w-4" />
                              Confirm Boost — {boostDuration} Days
                            </Button>
                          </div>
                        )}

                        {/* ── FRIENDS PICKER ── */}
                        {boostStep === 'friends-picker' && (
                          <div className="space-y-3">
                            <p className="text-xs text-muted-foreground">Select friends to share "{season.name}" with.</p>
                            <div className="space-y-1 max-h-64 overflow-y-auto overscroll-y-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                              {mockFriends.map((friend: any) => (
                                <button
                                  key={friend.id}
                                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-colors touch-manipulation active:scale-[0.98] ${selectedFriends.includes(friend.id) ? 'border-primary bg-primary/5' : 'bg-card hover:bg-accent/50'}`}
                                  onClick={() => {
                                    setSelectedFriends((p) =>
                                      p.includes(friend.id) ? p.filter((id) => id !== friend.id) : [...p, friend.id]
                                    );
                                  }}
                                >
                                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${selectedFriends.includes(friend.id) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                    {friend.name.charAt(0)}
                                  </div>
                                  <span className="text-sm font-medium flex-1 text-left truncate">{friend.name}</span>
                                  <Checkbox checked={selectedFriends.includes(friend.id)} className="shrink-0 pointer-events-none" />
                                </button>
                              ))}
                            </div>
                            {selectedFriends.length > 0 && (
                              <Button
                                className="w-full h-12 text-sm font-bold gap-2 touch-manipulation active:scale-[0.97]"
                                onClick={() => {
                                  toast({ title: "👥 Shared!", description: `Season shared with ${selectedFriends.length} friend${selectedFriends.length > 1 ? 's' : ''}.` });
                                  setSelectedFriends([]);
                                  setBoostSeasonId(null);
                                }}
                              >
                                <Users className="h-4 w-4" />
                                Send to {selectedFriends.length} Friend{selectedFriends.length > 1 ? 's' : ''}
                              </Button>
                            )}
                          </div>
                        )}

                        {/* ── STORE FORM ── */}
                        {boostStep === 'store-form' && (
                          <div className="space-y-3">
                            <p className="text-xs text-muted-foreground">Add a promotional message for your Mobi-Store listing.</p>
                            <div>
                              <Label className="text-xs text-muted-foreground">Promotional Message</Label>
                              <Textarea
                                value={storePromoMessage}
                                onChange={(e) => setStorePromoMessage(e.target.value)}
                                placeholder={`e.g. "Don't miss ${season.name}! Win up to ${formatLocalAmount(season.firstPrize, "NGN")}!"`}
                                className="mt-1 min-h-[80px]"
                              />
                            </div>
                            <div className="p-3 bg-emerald-500/5 rounded-lg space-y-1">
                              <p className="text-xs font-semibold text-emerald-700">Listing Preview</p>
                              <p className="text-xs text-muted-foreground">{season.name} — {season.type} Season</p>
                              <p className="text-xs font-bold">Prize Pool: {formatLocalAmount(season.totalWinningPrizes, "NGN")}</p>
                              {storePromoMessage && <p className="text-xs italic">"{storePromoMessage}"</p>}
                            </div>
                            <Button
                              className="w-full h-12 text-sm font-bold gap-2 touch-manipulation active:scale-[0.97]"
                              onClick={() => {
                                setStoreListedSeasons((p) => [...new Set([...p, season.id])]);
                                toast({ title: "🏪 Listed on Mobi-Store!", description: `"${season.name}" is now featured on the Mobi-Store marketplace.` });
                                setStorePromoMessage("");
                                setBoostSeasonId(null);
                              }}
                            >
                              <Store className="h-4 w-4" />
                              List on Mobi-Store
                            </Button>
                          </div>
                        )}

                        {/* ── SOCIAL PICKER ── */}
                        {boostStep === 'social-picker' && (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Choose a platform to share "{season.name}"</p>

                            {typeof navigator.share === 'function' && (
                              <button className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors touch-manipulation active:scale-[0.97]" onClick={async () => {
                                const shared = await shareViaNative(season.name, shareText, shareUrl);
                                if (shared) { toast({ title: "✅ Shared!", description: "Shared via your device." }); setBoostSeasonId(null); }
                              }}>
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Share2 className="h-5 w-5 text-primary" /></div>
                                <div className="text-left flex-1 min-w-0">
                                  <p className="text-sm font-semibold">Share via Device</p>
                                  <p className="text-xs text-muted-foreground">Use your phone's native share</p>
                                </div>
                              </button>
                            )}

                            <button className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors touch-manipulation active:scale-[0.97]" onClick={() => { shareToWhatsApp(shareUrl, shareText); toast({ title: "✅ WhatsApp", description: "Opening WhatsApp..." }); }}>
                              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0"><MessageCircle className="h-5 w-5 text-emerald-600" /></div>
                              <div className="text-left flex-1 min-w-0">
                                <p className="text-sm font-semibold">WhatsApp</p>
                                <p className="text-xs text-muted-foreground">Share to WhatsApp contacts</p>
                              </div>
                            </button>

                            <button className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors touch-manipulation active:scale-[0.97]" onClick={() => { shareToFacebook(shareUrl, season.name); toast({ title: "✅ Facebook", description: "Opening Facebook..." }); }}>
                              <div className="h-10 w-10 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0"><Facebook className="h-5 w-5 text-blue-600" /></div>
                              <div className="text-left flex-1 min-w-0">
                                <p className="text-sm font-semibold">Facebook</p>
                                <p className="text-xs text-muted-foreground">Share on your Facebook feed</p>
                              </div>
                            </button>

                            <button className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors touch-manipulation active:scale-[0.97]" onClick={() => { shareToTwitter(shareUrl, shareText); toast({ title: "✅ Twitter / X", description: "Opening Twitter..." }); }}>
                              <div className="h-10 w-10 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0"><Share2 className="h-5 w-5 text-sky-500" /></div>
                              <div className="text-left flex-1 min-w-0">
                                <p className="text-sm font-semibold">Twitter / X</p>
                                <p className="text-xs text-muted-foreground">Tweet about this season</p>
                              </div>
                            </button>

                            <button className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors touch-manipulation active:scale-[0.97]" onClick={async () => {
                              const copied = await shareToInstagram(shareUrl);
                              toast({ title: copied ? "✅ Link Copied + Instagram Opening" : "📸 Instagram Opening", description: copied ? "Link copied! Paste it in your Instagram post or story." : "Opening Instagram..." });
                            }}>
                              <div className="h-10 w-10 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0"><Share2 className="h-5 w-5 text-pink-500" /></div>
                              <div className="text-left flex-1 min-w-0">
                                <p className="text-sm font-semibold">Instagram</p>
                                <p className="text-xs text-muted-foreground">Copy link & open Instagram</p>
                              </div>
                            </button>

                            <button className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors touch-manipulation active:scale-[0.97]" onClick={async () => {
                              const copied = await copyToClipboard(shareUrl);
                              if (copied) toast({ title: "📋 Link Copied!", description: "Share link copied to clipboard." });
                            }}>
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0"><Link className="h-5 w-5 text-muted-foreground" /></div>
                              <div className="text-left flex-1 min-w-0">
                                <p className="text-sm font-semibold">Copy Link</p>
                                <p className="text-xs text-muted-foreground">Copy share URL to clipboard</p>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    );
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Question Integration Tab ────────────────────────────────────────
interface IntegratedQuestion {
  sourceId: string;
  sourceType: "admin" | "merchant";
  type: "objective" | "non_objective" | "bonus_objective";
  alternativeAnswers?: string[];
}

function QuestionIntegrationTab({ merchantId }: { merchantId: string }) {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<"objective" | "non_objective" | "bonus_objective">("objective");
  const [integratedQuestions, setIntegratedQuestions] = useState<IntegratedQuestion[]>([]);
  const [altAnswersEdit, setAltAnswersEdit] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<"available" | "integrated">("available");

  // Available questions pools
  const availableObjective = useMemo(
    () => INITIAL_ADMIN_QUESTIONS.filter((q) => q.status === "active"),
    []
  );

  const availableNonObjective = useMemo(
    () => mockQuestions.filter((q) => q.type === "non_objective"),
    []
  );

  const availableBonus = useMemo(
    () => mockQuestions.filter((q) => q.type === "bonus_objective"),
    []
  );

  const getPool = () => {
    if (activeSubTab === "objective") return availableObjective;
    if (activeSubTab === "non_objective") return availableNonObjective;
    return availableBonus;
  };

  const integratedForTab = integratedQuestions.filter((iq) => iq.type === activeSubTab);
  const pool = getPool();
  const totalAvailable = pool.length;
  const totalIntegrated = integratedForTab.length;

  const isIntegrated = (id: string) => integratedQuestions.some((iq) => iq.sourceId === id);

  const handleIntegrate = (id: string) => {
    const altText = altAnswersEdit[id] || "";
    const altAnswers = activeSubTab === "non_objective"
      ? altText.split(",").map((a) => a.trim()).filter(Boolean)
      : undefined;

    setIntegratedQuestions((prev) => [
      ...prev,
      {
        sourceId: id,
        sourceType: activeSubTab === "objective" ? "admin" : "merchant",
        type: activeSubTab,
        alternativeAnswers: altAnswers,
      },
    ]);
    toast({ title: "✅ Question Integrated", description: "Added to your quiz bank." });
  };

  const handleRemove = (id: string) => {
    setIntegratedQuestions((prev) => prev.filter((iq) => iq.sourceId !== id));
    toast({ title: "🗑️ Question Removed", description: "Removed from your quiz bank." });
  };

  const handleUpdateAltAnswers = (id: string) => {
    const altText = altAnswersEdit[id] || "";
    const altAnswers = altText.split(",").map((a) => a.trim()).filter(Boolean);
    if (altAnswers.length < 2 || altAnswers.length > 5) {
      toast({ title: "⚠️ Invalid", description: "Provide 2-5 alternative answers.", variant: "destructive" });
      return;
    }
    setIntegratedQuestions((prev) =>
      prev.map((iq) => (iq.sourceId === id ? { ...iq, alternativeAnswers: altAnswers } : iq))
    );
    toast({ title: "✅ Answers Updated" });
  };

  const subTabLabels: Record<string, string> = {
    objective: "Main Objective",
    non_objective: "Non-Objective",
    bonus_objective: "Bonus Objective",
  };

  // Render an admin question card (objective)
  const renderAdminQuestionCard = (q: AdminQuizQuestion) => {
    const integrated = isIntegrated(q.id);
    return (
      <Card key={q.id} className={`overflow-hidden ${integrated ? "border-primary/40 bg-primary/5" : ""}`}>
        <CardContent className="p-3 space-y-2">
          <p className="text-sm font-medium leading-snug">{q.question}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">{q.category}</Badge>
            <Badge variant="outline" className="text-xs">{q.difficulty}</Badge>
            <span className="text-xs text-muted-foreground">{q.timeLimit}s · {q.points}pts</span>
          </div>

          {/* Show options read-only */}
          <div className="grid grid-cols-2 gap-1">
            {q.options.map((opt, idx) => (
              <div key={idx} className={`text-xs px-2 py-1.5 rounded ${idx === q.correctAnswerIndex ? "bg-emerald-500/15 text-emerald-700 font-bold" : "bg-muted/30 text-muted-foreground"}`}>
                {ANSWER_LABELS[idx]}: {opt}
              </div>
            ))}
          </div>

          {integrated ? (
            <Button size="sm" variant="outline" className="w-full h-10 text-xs gap-1.5 border-red-300 text-red-600" onClick={() => handleRemove(q.id)}>
              <Unlink className="h-3.5 w-3.5" /> Remove from Bank
            </Button>
          ) : (
            <Button size="sm" className="w-full h-10 text-xs gap-1.5" onClick={() => handleIntegrate(q.id)}>
              <Link className="h-3.5 w-3.5" /> Integrate Question
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  // Render a merchant question card (non-objective / bonus)
  const renderMerchantQuestionCard = (q: MerchantQuestion) => {
    const integrated = isIntegrated(q.id);
    const integratedData = integratedQuestions.find((iq) => iq.sourceId === q.id);
    return (
      <Card key={q.id} className={`overflow-hidden ${integrated ? "border-primary/40 bg-primary/5" : ""}`}>
        <CardContent className="p-3 space-y-2">
          <p className="text-sm font-medium leading-snug">{q.question}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">{q.category}</Badge>
            <Badge variant="outline" className="text-xs capitalize">{q.difficulty}</Badge>
            <span className="text-xs text-muted-foreground">{q.timeLimit}s</span>
          </div>

          {/* Show options for bonus objective */}
          {q.type === "bonus_objective" && q.options.length > 0 && (
            <div className="grid grid-cols-2 gap-1">
              {q.options.map((opt, idx) => (
                <div key={idx} className={`text-xs px-2 py-1.5 rounded ${idx === q.correctAnswerIndex ? "bg-emerald-500/15 text-emerald-700 font-bold" : "bg-muted/30 text-muted-foreground"}`}>
                  {ANSWER_LABELS[idx] || `${idx + 1}`}: {opt}
                </div>
              ))}
            </div>
          )}

          {/* Alt answers for non-objective */}
          {q.type === "non_objective" && (
            <div className="space-y-2">
              {integrated && integratedData?.alternativeAnswers && integratedData.alternativeAnswers.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-muted-foreground w-full">Your Alternative Answers:</span>
                  {integratedData.alternativeAnswers.map((alt, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{alt}</Badge>
                  ))}
                </div>
              )}
              {(integrated || !integrated) && q.type === "non_objective" && (
                <div>
                  <Label className="text-xs text-muted-foreground">Alternative Answers (2-5, comma-separated)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={altAnswersEdit[q.id] || q.alternativeAnswers.join(", ")}
                      onChange={(e) => setAltAnswersEdit((p) => ({ ...p, [q.id]: e.target.value }))}
                      placeholder="answer1, answer2, answer3"
                      className="h-10 text-xs flex-1"
                    />
                    {integrated && (
                      <Button size="sm" variant="outline" className="h-10 text-xs shrink-0" onClick={() => handleUpdateAltAnswers(q.id)}>
                        <Save className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {integrated ? (
            <Button size="sm" variant="outline" className="w-full h-10 text-xs gap-1.5 border-red-300 text-red-600" onClick={() => handleRemove(q.id)}>
              <Unlink className="h-3.5 w-3.5" /> Remove from Bank
            </Button>
          ) : (
            <Button size="sm" className="w-full h-10 text-xs gap-1.5" onClick={() => handleIntegrate(q.id)}>
              <Link className="h-3.5 w-3.5" /> Integrate Question
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["objective", "non_objective", "bonus_objective"] as const).map((t) => (
          <Button
            key={t}
            size="sm"
            variant={activeSubTab === t ? "default" : "outline"}
            className="h-9 text-xs shrink-0"
            onClick={() => setActiveSubTab(t)}
          >
            {subTabLabels[t]}
          </Button>
        ))}
      </div>

      {/* Integration Counter */}
      <Card className="border-primary/20">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold">{totalIntegrated} of {totalAvailable}</span>
              <span className="text-xs text-muted-foreground">questions integrated</span>
            </div>
            <Badge variant={totalIntegrated > 0 ? "default" : "outline"} className="text-xs">
              {activeSubTab === "objective" ? "Objective" : activeSubTab === "non_objective" ? "Writing" : "Bonus"}
            </Badge>
          </div>
          {totalAvailable > 0 && (
            <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(totalIntegrated / totalAvailable) * 100}%` }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Toggle: Available vs Integrated */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={viewMode === "available" ? "default" : "outline"}
          className="flex-1 h-10 text-xs gap-1.5"
          onClick={() => setViewMode("available")}
        >
          <Eye className="h-3.5 w-3.5" /> Available ({totalAvailable})
        </Button>
        <Button
          size="sm"
          variant={viewMode === "integrated" ? "default" : "outline"}
          className="flex-1 h-10 text-xs gap-1.5"
          onClick={() => setViewMode("integrated")}
        >
          <Link className="h-3.5 w-3.5" /> Integrated ({totalIntegrated})
        </Button>
      </div>

      {/* Question Cards */}
      {viewMode === "available" && (
        <>
          {activeSubTab === "objective" && availableObjective.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm">No active objective questions available.</div>
          )}
          {activeSubTab === "objective" && availableObjective.map((q) => renderAdminQuestionCard(q))}

          {activeSubTab === "non_objective" && availableNonObjective.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm">No non-objective questions available.</div>
          )}
          {activeSubTab === "non_objective" && availableNonObjective.map((q) => renderMerchantQuestionCard(q))}

          {activeSubTab === "bonus_objective" && availableBonus.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm">No bonus objective questions available.</div>
          )}
          {activeSubTab === "bonus_objective" && availableBonus.map((q) => renderMerchantQuestionCard(q))}
        </>
      )}

      {viewMode === "integrated" && (
        <>
          {totalIntegrated === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No questions integrated yet. Switch to "Available" to browse and integrate questions.
            </div>
          )}
          {activeSubTab === "objective" &&
            integratedForTab.map((iq) => {
              const q = availableObjective.find((aq) => aq.id === iq.sourceId);
              return q ? renderAdminQuestionCard(q) : null;
            })}
          {activeSubTab === "non_objective" &&
            integratedForTab.map((iq) => {
              const q = availableNonObjective.find((mq) => mq.id === iq.sourceId);
              return q ? renderMerchantQuestionCard(q) : null;
            })}
          {activeSubTab === "bonus_objective" &&
            integratedForTab.map((iq) => {
              const q = availableBonus.find((mq) => mq.id === iq.sourceId);
              return q ? renderMerchantQuestionCard(q) : null;
            })}
        </>
      )}
    </div>
  );
}

// ─── Wallet Tab ──────────────────────────────────────────────────────
function WalletTab({ merchant }: { merchant: QuizMerchant }) {
  const { toast } = useToast();
  const totalPrizePool = mockSeasons
    .filter((s) => s.merchantId === merchant.id)
    .reduce((sum, s) => sum + s.totalWinningPrizes, 0);
  const requiredBalance = totalPrizePool * MERCHANT_MIN_WALLET_PERCENT;
  const isFunded = merchant.walletBalance >= requiredBalance;
  const fundingPercentage = requiredBalance > 0 ? Math.min(100, (merchant.walletBalance / requiredBalance) * 100) : 100;

  return (
    <div className="space-y-4">
      {/* Balance Card */}
      <Card className="border-primary/30">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              Wallet Balance
            </h3>
            {isFunded ? (
              <Badge className="bg-emerald-500/15 text-emerald-700 text-xs gap-1">
                <CheckCircle className="h-3 w-3" /> Funded
              </Badge>
            ) : (
              <Badge className="bg-red-500/15 text-red-700 text-xs gap-1">
                <AlertTriangle className="h-3 w-3" /> Underfunded
              </Badge>
            )}
          </div>
          <p className="text-2xl font-extrabold">{formatLocalAmount(merchant.walletBalance, "NGN")}</p>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Required (70% of prizes)</span>
              <span className="font-semibold">{formatLocalAmount(requiredBalance, "NGN")}</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isFunded ? "bg-emerald-500" : "bg-amber-500"}`}
                style={{ width: `${fundingPercentage}%` }}
              />
            </div>
          </div>

          <Button className="w-full h-11 text-sm font-bold gap-2" onClick={() => toast({ title: "💰 Fund Wallet", description: "Wallet funding initiated. Processing..." })}>
            <DollarSign className="h-4 w-4" />
            Add Funds
          </Button>
        </CardContent>
      </Card>

      {/* Waiver Section */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-bold">Waiver Request</h3>
          <p className="text-xs text-muted-foreground">
            If you cannot meet the 70% funding requirement, you can request a waiver. A non-refundable fee of {formatLocalAmount(WAIVER_REQUEST_FEE, "NGN")} applies.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            {merchant.waiverApproved ? (
              <Badge className="bg-emerald-500/15 text-emerald-700 text-xs">Approved</Badge>
            ) : merchant.pendingWaiverRequest ? (
              <Badge className="bg-amber-500/15 text-amber-700 text-xs">Pending Review</Badge>
            ) : (
              <Badge className="bg-muted text-muted-foreground text-xs">Not Requested</Badge>
            )}
          </div>
          {!merchant.waiverApproved && !merchant.pendingWaiverRequest && (
            <Button
              variant="outline"
              className="w-full h-11 text-sm gap-2"
              onClick={() => toast({ title: "📝 Waiver Requested", description: `Fee of ${formatLocalAmount(WAIVER_REQUEST_FEE, "NGN")} has been debited on your Mobi Wallet.` })}
            >
              Request Waiver ({formatLocalAmount(WAIVER_REQUEST_FEE, "NGN")})
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Funding History */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-bold">Funding History</h3>
          {merchant.walletFundingHistory.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No funding history yet.</p>
          ) : (
            <div className="space-y-2">
              {merchant.walletFundingHistory.map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-muted/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-700">+{formatLocalAmount(tx.amount, "NGN")}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Winners Tab ─────────────────────────────────────────────────────
function WinnersTab({ merchantId }: { merchantId: string }) {
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [expandedConsolation, setExpandedConsolation] = useState<Record<string, boolean>>({});

  const merchantSeasons = mockSeasons.filter((s) => s.merchantId === merchantId);
  const merchantSeasonIds = merchantSeasons.map((s) => s.id);

  const allWinners = mockSeasonWinners.filter((w) => merchantSeasonIds.includes(w.seasonId));
  const filteredWinners = seasonFilter === "all" ? allWinners : allWinners.filter((w) => w.seasonId === seasonFilter);

  // Group by season
  const winnersByseason = filteredWinners.reduce<Record<string, SeasonWinner[]>>((acc, w) => {
    if (!acc[w.seasonId]) acc[w.seasonId] = [];
    acc[w.seasonId].push(w);
    return acc;
  }, {});

  // Stats
  const totalWinners = allWinners.length;
  const totalPaidOut = allWinners.filter((w) => w.payoutStatus === "paid").reduce((s, w) => s + w.prizeAmount, 0);
  const seasonsWithWinners = new Set(allWinners.map((w) => w.seasonId)).size;

  const getPositionIcon = (position: string) => {
    switch (position) {
      case "1st": return <Trophy className="h-5 w-5 text-yellow-500" />;
      case "2nd": return <Crown className="h-5 w-5 text-gray-400" />;
      case "3rd": return <Medal className="h-5 w-5 text-amber-700" />;
      default: return <Gift className="h-4 w-4 text-purple-500" />;
    }
  };

  const getPositionBg = (position: string) => {
    switch (position) {
      case "1st": return "bg-yellow-500/10 border-yellow-500/30";
      case "2nd": return "bg-gray-300/10 border-gray-400/30";
      case "3rd": return "bg-amber-700/10 border-amber-700/30";
      default: return "bg-muted/50 border-border";
    }
  };

  const getPayoutBadge = (status: string) => {
    switch (status) {
      case "paid": return <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px] px-1.5 py-0">Paid</Badge>;
      case "processing": return <Badge className="bg-blue-500/15 text-blue-700 border-blue-500/30 text-[10px] px-1.5 py-0">Processing</Badge>;
      default: return <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px] px-1.5 py-0">Pending</Badge>;
    }
  };

  if (allWinners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Trophy className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-bold text-base mb-1">No Winners Yet</h3>
        <p className="text-xs text-muted-foreground max-w-[260px]">
          Winners will appear here once your seasons have concluded and prizes have been awarded.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardContent className="p-3 text-center">
            <Users className="h-4 w-4 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">{totalWinners}</p>
            <p className="text-[10px] text-muted-foreground">Total Winners</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <DollarSign className="h-4 w-4 mx-auto text-emerald-600 mb-1" />
            <p className="text-sm font-bold">₦{(totalPaidOut / 1000000).toFixed(1)}M</p>
            <p className="text-[10px] text-muted-foreground">Prizes Paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Trophy className="h-4 w-4 mx-auto text-amber-500 mb-1" />
            <p className="text-lg font-bold">{seasonsWithWinners}</p>
            <p className="text-[10px] text-muted-foreground">Seasons</p>
          </CardContent>
        </Card>
      </div>

      {/* Season Filter */}
      <Select value={seasonFilter} onValueChange={setSeasonFilter}>
        <SelectTrigger className="h-11 text-sm">
          <SelectValue placeholder="Filter by season" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Seasons</SelectItem>
          {merchantSeasons.map((s) => (
            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Per-Season Winner Cards */}
      {Object.entries(winnersByseason).map(([seasonId, winners]) => {
        const season = merchantSeasons.find((s) => s.id === seasonId);
        if (!season) return null;

        const topWinners = winners.filter((w) => w.position !== "consolation").sort((a, b) => {
          const order = { "1st": 1, "2nd": 2, "3rd": 3 };
          return (order[a.position as keyof typeof order] || 4) - (order[b.position as keyof typeof order] || 4);
        });
        const consolationWinners = winners.filter((w) => w.position === "consolation");
        const totalPrizePool = season.totalWinningPrizes;
        const paidAmount = winners.filter((w) => w.payoutStatus === "paid").reduce((s, w) => s + w.prizeAmount, 0);
        const pendingAmount = winners.reduce((s, w) => s + w.prizeAmount, 0) - paidAmount;
        const payoutPercent = totalPrizePool > 0 ? Math.round((paidAmount / totalPrizePool) * 100) : 0;

        return (
          <Card key={seasonId} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Season Header */}
              <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold truncate">{season.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getSeasonTypeColor(season.type)}`}>
                      {season.type}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getStatusColor(season.quizStatus)}`}>
                      {getStatusLabel(season.quizStatus)}
                    </Badge>
                  </div>
                </div>
                <Trophy className="h-5 w-5 text-amber-500 shrink-0" />
              </div>

              {/* Top 3 Winners */}
              <div className="p-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Top Winners</p>
                {topWinners.map((winner) => (
                  <div key={winner.id} className={`rounded-xl border p-3 ${getPositionBg(winner.position)}`}>
                    <div className="flex items-start gap-3">
                      {/* Avatar + Position */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        {getPositionIcon(winner.position)}
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                          {winner.playerName.split(" ").map((n) => n[0]).join("")}
                        </div>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold truncate">{winner.playerName}</p>
                          {getPayoutBadge(winner.payoutStatus)}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{winner.state}, {winner.country}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <p className="text-sm font-bold text-primary">₦{formatLocalAmount(winner.prizeAmount, "NGN")}</p>
                          <p className="text-[10px] text-muted-foreground">Score: {winner.score}%</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {format(new Date(winner.completionDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Consolation Winners */}
              {consolationWinners.length > 0 && (
                <div className="px-3 pb-3">
                  <Collapsible
                    open={expandedConsolation[seasonId] || false}
                    onOpenChange={(open) => setExpandedConsolation((p) => ({ ...p, [seasonId]: open }))}
                  >
                    <CollapsibleTrigger className="w-full flex items-center justify-between h-11 px-3 rounded-lg bg-muted/50 text-sm font-medium active:scale-[0.98] transition-transform touch-manipulation">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-purple-500" />
                        <span>Consolation Winners ({consolationWinners.length})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">₦{(consolationWinners.reduce((s, w) => s + w.prizeAmount, 0) / 1000000).toFixed(1)}M</span>
                        {expandedConsolation[seasonId] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-2 space-y-1.5">
                        {consolationWinners.map((winner) => (
                          <div key={winner.id} className="flex items-center gap-3 p-2.5 rounded-lg border bg-muted/20">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold shrink-0">
                              {winner.playerName.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate">{winner.playerName}</p>
                              <p className="text-[10px] text-muted-foreground">{winner.state} · Score: {winner.score}%</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-bold">₦{formatLocalAmount(winner.prizeAmount, "NGN")}</p>
                              {getPayoutBadge(winner.payoutStatus)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}

              {/* Season Prize Summary */}
              <div className="p-3 border-t bg-muted/20 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prize Summary</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs font-bold">₦{(totalPrizePool / 1000000).toFixed(1)}M</p>
                    <p className="text-[9px] text-muted-foreground">Total Pool</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-600">₦{(paidAmount / 1000000).toFixed(1)}M</p>
                    <p className="text-[9px] text-muted-foreground">Paid</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-600">₦{(pendingAmount / 1000000).toFixed(1)}M</p>
                    <p className="text-[9px] text-muted-foreground">Pending</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground">Payout Progress</p>
                    <p className="text-[10px] font-semibold">{payoutPercent}%</p>
                  </div>
                  <Progress value={payoutPercent} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function MerchantPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      {/* Page Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 active:scale-95 transition-transform touch-manipulation"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Merchant Quizzes Management</h1>
            <p className="text-xs text-muted-foreground">{myMerchant.name} · {myMerchant.category}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3">
        <Tabs defaultValue="settings" className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 touch-pan-x scrollbar-none">
            <TabsList className="inline-flex gap-1 h-11 w-auto whitespace-nowrap">
              <TabsTrigger value="settings" className="text-xs px-3 gap-1.5">
                <Settings className="h-3.5 w-3.5" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="seasons" className="text-xs px-3 gap-1.5">
                <Gamepad2 className="h-3.5 w-3.5" />
                Seasons
              </TabsTrigger>
              <TabsTrigger value="questions" className="text-xs px-3 gap-1.5">
                <HelpCircle className="h-3.5 w-3.5" />
                Questions
              </TabsTrigger>
              <TabsTrigger value="wallet" className="text-xs px-3 gap-1.5">
                <Wallet className="h-3.5 w-3.5" />
                Wallet
              </TabsTrigger>
              <TabsTrigger value="winners" className="text-xs px-3 gap-1.5">
                <Trophy className="h-3.5 w-3.5" />
                Winners
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="settings" className="mt-4">
            <PlatformSettingsTab merchant={myMerchant} />
          </TabsContent>

          <TabsContent value="seasons" className="mt-4">
            <SeasonsTab merchantId={myMerchant.id} merchant={myMerchant} />
          </TabsContent>

          <TabsContent value="questions" className="mt-4">
            <QuestionIntegrationTab merchantId={myMerchant.id} />
          </TabsContent>

          <TabsContent value="wallet" className="mt-4">
            <WalletTab merchant={myMerchant} />
          </TabsContent>

          <TabsContent value="winners" className="mt-4">
            <WinnersTab merchantId={myMerchant.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
