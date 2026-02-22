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
} from "lucide-react";
import {
  mockMerchants,
  mockSeasons,
  mockQuestions,
  MERCHANT_MIN_WALLET_PERCENT,
  WAIVER_REQUEST_FEE,
  SEASON_TYPE_CONFIG,
  type QuizMerchant,
  type QuizSeason,
  type MerchantQuestion,
  type SelectionProcess,
  type TVShowRound,
} from "@/data/mobigateInteractiveQuizData";
import {
  INITIAL_ADMIN_QUESTIONS,
  ANSWER_LABELS,
  type AdminQuizQuestion,
} from "@/data/mobigateQuizQuestionsData";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { format, addMonths, addWeeks, addDays, addHours } from "date-fns";

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
    default: return "bg-muted text-muted-foreground";
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
function SeasonsTab({ merchantId }: { merchantId: string }) {
  const { toast } = useToast();
  const [seasons, setSeasons] = useState<QuizSeason[]>(
    mockSeasons.filter((s) => s.merchantId === merchantId)
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedSeason, setExpandedSeason] = useState<string | null>(null);
  const [extendingSeason, setExtendingSeason] = useState<string | null>(null);
  const [extensionWeeks, setExtensionWeeks] = useState(2);
  const [extensionReason, setExtensionReason] = useState("");

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
      quizStatus: "draft",
      selectionProcesses: newSelectionRounds,
      tvShowRounds: newTvRounds,
    };
    setSeasons((p) => [newSeason, ...p]);
    setShowCreateForm(false);
    setNewName("");
    toast({ title: "✅ Season Created", description: `"${newName}" has been created as a draft.` });
  };

  const toggleStatus = (seasonId: string, newStatus: "active" | "suspended" | "draft") => {
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
                  <div className="flex-1 overflow-x-auto min-w-0">
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
                  <div className="flex-1 overflow-x-auto min-w-0">
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

            <Button className="w-full h-12 text-sm font-bold gap-2" onClick={handleCreate}>
              <Save className="h-4 w-4" />
              Create Season
            </Button>
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
                      {season.quizStatus}
                    </Badge>
                    {season.isLive && (
                      <Badge className="bg-red-500 text-white text-xs animate-pulse shrink-0">🔴 LIVE</Badge>
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
                    {!isExtending && (
                      <Button size="sm" variant="outline" className="h-9 text-xs gap-1 flex-1" onClick={() => setExtendingSeason(season.id)}>
                        <CalendarPlus className="h-3 w-3" /> Extend
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" className="h-9 text-xs gap-1" onClick={() => deleteSeason(season.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
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
          <TabsList className="w-full grid grid-cols-4 h-11">
            <TabsTrigger value="settings" className="text-xs px-1">
              <Settings className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="seasons" className="text-xs px-1">
              <Gamepad2 className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
              Seasons
            </TabsTrigger>
            <TabsTrigger value="questions" className="text-xs px-1">
              <HelpCircle className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
              Questions
            </TabsTrigger>
            <TabsTrigger value="wallet" className="text-xs px-1">
              <Wallet className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
              Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-4">
            <PlatformSettingsTab merchant={myMerchant} />
          </TabsContent>

          <TabsContent value="seasons" className="mt-4">
            <SeasonsTab merchantId={myMerchant.id} />
          </TabsContent>

          <TabsContent value="questions" className="mt-4">
            <QuestionIntegrationTab merchantId={myMerchant.id} />
          </TabsContent>

          <TabsContent value="wallet" className="mt-4">
            <WalletTab merchant={myMerchant} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
