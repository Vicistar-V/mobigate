import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose, DrawerBody,
} from "@/components/ui/drawer";
import {
  Building2, ChevronRight, Users, Trophy, Wallet,
  CheckCircle, Edit2, Radio, Calendar, Settings2,
  BookOpen, Filter, PlusCircle, ShieldCheck, ShieldOff, Clock,
} from "lucide-react";
import {
  mockMerchants, mockSeasons, mockQuestions,
  type QuizMerchant, type QuizSeason, type MerchantQuestion,
  SEASON_TYPE_CONFIG, DEFAULT_MERCHANT_CONFIG,
} from "@/data/mobigateInteractiveQuizData";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";
import { MerchantPlatformSettingsDrawer } from "./MerchantPlatformSettingsDrawer";
import { MerchantSelectionProcessDrawer } from "./MerchantSelectionProcessDrawer";
import { MerchantQuestionBankDrawer } from "./MerchantQuestionBankDrawer";

const statusColors: Record<string, string> = {
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  suspended: "bg-destructive/10 text-destructive border-destructive/20",
};

export function InteractiveMerchantAdmin() {
  const { toast } = useToast();
  const [merchants, setMerchants] = useState<QuizMerchant[]>(mockMerchants);
  const [seasons, setSeasons] = useState<QuizSeason[]>(mockSeasons);
  const [questions, setQuestions] = useState<MerchantQuestion[]>(mockQuestions);
  const [selectedMerchant, setSelectedMerchant] = useState<QuizMerchant | null>(null);
  const [showAddSeason, setShowAddSeason] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<QuizSeason | null>(null);
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "suspended">("all");

  // Add season form state
  const [seasonName, setSeasonName] = useState("");
  const [seasonType, setSeasonType] = useState<"Short" | "Medium" | "Complete">("Short");
  const [seasonEntryFee, setSeasonEntryFee] = useState(200);
  const [seasonPrize, setSeasonPrize] = useState(50000);

  const handleToggleStatus = (merchantId: string, newStatus: "approved" | "suspended") => {
    setMerchants(prev => prev.map(m => m.id === merchantId ? { ...m, applicationStatus: newStatus } : m));
    toast({ title: `Merchant ${newStatus === "approved" ? "Approved" : "Suspended"}` });
  };

  const handleAddSeason = () => {
    if (!selectedMerchant || !seasonName.trim()) return;
    const cfg = SEASON_TYPE_CONFIG[seasonType];
    const season: QuizSeason = {
      id: `s-${Date.now()}`,
      merchantId: selectedMerchant.id,
      name: seasonName.trim(),
      type: seasonType,
      duration: cfg.duration,
      selectionLevels: cfg.processes,
      entryFee: seasonEntryFee,
      currentLevel: 1,
      totalParticipants: 0,
      prizePerLevel: seasonPrize,
      isLive: false,
      status: "open",
      selectionProcesses: [{ round: 1, entriesSelected: 10000, entryFee: seasonEntryFee }],
      tvShowRounds: [
        { round: 1, entriesSelected: 50, entryFee: 2000, label: "1st TV Show" },
        { round: 2, entriesSelected: 15, entryFee: 5000, label: "Semi-Final" },
        { round: 3, entriesSelected: 3, entryFee: 0, label: "Grand Finale" },
      ],
    };
    setSeasons(prev => [season, ...prev]);
    setSeasonName("");
    setShowAddSeason(false);
    toast({ title: "Season Created", description: season.name });
  };

  const handleToggleSeasonLive = (seasonId: string) => {
    setSeasons(prev => prev.map(s => s.id === seasonId ? { ...s, isLive: !s.isLive } : s));
  };

  const handleSaveSettings = (updated: QuizMerchant) => {
    setMerchants(prev => prev.map(m => m.id === updated.id ? updated : m));
    if (selectedMerchant?.id === updated.id) setSelectedMerchant(updated);
    toast({ title: "Platform Settings Saved" });
  };

  const handleSaveSeason = (updated: QuizSeason) => {
    setSeasons(prev => prev.map(s => s.id === updated.id ? updated : s));
    toast({ title: "Selection Process Saved" });
  };

  const filteredMerchants = filter === "all" ? merchants : merchants.filter(m => m.applicationStatus === filter);

  const merchantSeasons = selectedMerchant ? seasons.filter(s => s.merchantId === selectedMerchant.id) : [];

  // ─── MERCHANT DETAIL VIEW ─────────────────────────────────────────────
  if (selectedMerchant) {
    const objQs = questions.filter(q => q.merchantId === selectedMerchant.id && q.type === "objective").length;
    const nonObjQs = questions.filter(q => q.merchantId === selectedMerchant.id && q.type === "non_objective").length;
    const bonusQs = questions.filter(q => q.merchantId === selectedMerchant.id && q.type === "bonus_objective").length;

    return (
      <div className="h-[calc(100vh-140px)] overflow-y-auto touch-auto overscroll-contain">
        <div className="space-y-4 pb-6">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelectedMerchant(null)}>
            ← All Merchants
          </Button>

          {/* Merchant Header */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold truncate">{selectedMerchant.name}</h2>
                    {selectedMerchant.isVerified && <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{selectedMerchant.category}</Badge>
                    <Badge className={`text-[10px] ${statusColors[selectedMerchant.applicationStatus]}`}>
                      {selectedMerchant.applicationStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-14 flex-col gap-1 text-xs" onClick={() => setShowSettings(true)}>
              <Settings2 className="h-5 w-5 text-primary" />
              Platform Settings
            </Button>
            <Button variant="outline" className="h-14 flex-col gap-1 text-xs" onClick={() => setShowQuestions(true)}>
              <BookOpen className="h-5 w-5 text-primary" />
              Question Banks
              <Badge variant="secondary" className="text-[9px]">{objQs + nonObjQs + bonusQs}</Badge>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <Card><CardContent className="p-2 text-center">
              <Calendar className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold">{merchantSeasons.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Seasons</p>
            </CardContent></Card>
            <Card><CardContent className="p-2 text-center">
              <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold">{merchantSeasons.reduce((a, s) => a + s.totalParticipants, 0).toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Players</p>
            </CardContent></Card>
            <Card><CardContent className="p-2 text-center">
              <Wallet className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
              <p className="text-lg font-bold">{formatMobi(selectedMerchant.totalPrizePool)}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Prize Pool</p>
            </CardContent></Card>
          </div>

          {/* Config Summary */}
          <Card className="bg-muted/30">
            <CardContent className="p-3 space-y-1.5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase">Current Configuration</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <span className="text-muted-foreground">Pack Size</span>
                <span className="font-medium">{selectedMerchant.questionsPerPack} ({selectedMerchant.objectivePerPack}O + {selectedMerchant.nonObjectivePerPack}NO)</span>
                <span className="text-muted-foreground">Options</span>
                <span className="font-medium">{selectedMerchant.objectiveOptions} per question</span>
                <span className="text-muted-foreground">Cost/Question</span>
                <span className="font-medium">₦{selectedMerchant.costPerQuestion.toLocaleString()}</span>
                <span className="text-muted-foreground">Win Threshold</span>
                <span className="font-medium">{selectedMerchant.winPercentageThreshold}%</span>
                <span className="text-muted-foreground">Qualifying Points</span>
                <span className="font-medium">{selectedMerchant.qualifyingPoints} pts</span>
                <span className="text-muted-foreground">Bonus After</span>
                <span className="font-medium">{selectedMerchant.bonusGamesAfter} games</span>
              </div>
            </CardContent>
          </Card>

          {/* Seasons */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Seasons</h3>
            <Button size="sm" className="h-8 text-xs gap-1" onClick={() => setShowAddSeason(true)}>
              <PlusCircle className="h-3.5 w-3.5" /> Add Season
            </Button>
          </div>

          {merchantSeasons.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground text-sm">No seasons yet.</CardContent></Card>
          ) : (
            merchantSeasons.map(s => (
              <Card key={s.id} className="border border-border/40 active:scale-[0.98] transition-transform">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{s.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">{s.type} ({s.duration}mo)</Badge>
                        <Badge variant={s.status === "open" ? "default" : s.status === "in_progress" ? "secondary" : "outline"} className="text-[10px]">
                          {s.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-muted-foreground">Live</span>
                      <Switch checked={s.isLive} onCheckedChange={() => handleToggleSeasonLive(s.id)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted/30 rounded p-1.5">
                      <p className="text-xs font-bold">{s.selectionProcesses.length}</p>
                      <p className="text-[9px] text-muted-foreground">Selections</p>
                    </div>
                    <div className="bg-muted/30 rounded p-1.5">
                      <p className="text-xs font-bold">{s.tvShowRounds.length}</p>
                      <p className="text-[9px] text-muted-foreground">TV Rounds</p>
                    </div>
                    <div className="bg-muted/30 rounded p-1.5">
                      <p className="text-xs font-bold">{formatMobi(s.entryFee)}</p>
                      <p className="text-[9px] text-muted-foreground">Entry Fee</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">{s.totalParticipants.toLocaleString()} participants</span>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => setSelectedSeason(s)}>
                      <Filter className="h-3 w-3" /> Selection Process
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add Season Drawer */}
        <Drawer open={showAddSeason} onOpenChange={setShowAddSeason}>
          <DrawerContent>
            <DrawerHeader className="px-4"><DrawerTitle>Add Season</DrawerTitle></DrawerHeader>
            <DrawerBody className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Season Name</Label>
                <Input value={seasonName} onChange={e => setSeasonName(e.target.value)} onPointerDown={e => e.stopPropagation()} placeholder="e.g. Tech Genius Season 2" className="h-11 touch-manipulation" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Season Type</Label>
                <Select value={seasonType} onValueChange={v => setSeasonType(v as any)}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Short">Short — 4 months, 3 processes</SelectItem>
                    <SelectItem value="Medium">Medium — 6 months, 5 processes</SelectItem>
                    <SelectItem value="Complete">Complete — 12 months, 7 processes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Initial Entry Fee (₦)</Label>
                  <input type="text" inputMode="numeric" value={seasonEntryFee} onChange={e => { const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); setSeasonEntryFee(isNaN(n) ? 0 : n); }} onPointerDown={e => e.stopPropagation()} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm touch-manipulation" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Prize/Level (₦)</Label>
                  <input type="text" inputMode="numeric" value={seasonPrize} onChange={e => { const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); setSeasonPrize(isNaN(n) ? 0 : n); }} onPointerDown={e => e.stopPropagation()} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm touch-manipulation" />
                </div>
              </div>
              <Card className="bg-muted/30">
                <CardContent className="p-3 text-xs text-muted-foreground space-y-1">
                  <p><strong>Duration:</strong> {SEASON_TYPE_CONFIG[seasonType].duration} months</p>
                  <p><strong>Selection Processes:</strong> {SEASON_TYPE_CONFIG[seasonType].processes}</p>
                  <p className="text-[10px]">You can configure the Selection Process details after creating the season.</p>
                </CardContent>
              </Card>
            </DrawerBody>
            <DrawerFooter>
              <Button onClick={handleAddSeason} disabled={!seasonName.trim()} className="h-12">Create Season</Button>
              <DrawerClose asChild><Button variant="outline" className="h-12">Cancel</Button></DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Platform Settings Drawer */}
        <MerchantPlatformSettingsDrawer
          open={showSettings}
          onOpenChange={setShowSettings}
          merchant={selectedMerchant}
          onSave={handleSaveSettings}
        />

        {/* Question Bank Drawer */}
        <MerchantQuestionBankDrawer
          open={showQuestions}
          onOpenChange={setShowQuestions}
          merchant={selectedMerchant}
          questions={questions}
          onQuestionsChange={setQuestions}
        />

        {/* Selection Process Drawer */}
        {selectedSeason && (
          <MerchantSelectionProcessDrawer
            open={!!selectedSeason}
            onOpenChange={open => !open && setSelectedSeason(null)}
            season={selectedSeason}
            onSave={handleSaveSeason}
          />
        )}
      </div>
    );
  }

  // ─── MERCHANT LIST VIEW ────────────────────────────────────────────────
  return (
    <div className="h-[calc(100vh-140px)] overflow-y-auto touch-auto overscroll-contain">
      <div className="space-y-4 pb-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Card><CardContent className="p-2 text-center">
            <Building2 className="h-4 w-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{merchants.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Total</p>
          </CardContent></Card>
          <Card><CardContent className="p-2 text-center">
            <ShieldCheck className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
            <p className="text-lg font-bold">{merchants.filter(m => m.applicationStatus === "approved").length}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Approved</p>
          </CardContent></Card>
          <Card><CardContent className="p-2 text-center">
            <Trophy className="h-4 w-4 mx-auto mb-1 text-amber-500" />
            <p className="text-lg font-bold">{seasons.filter(s => s.isLive).length}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Live Seasons</p>
          </CardContent></Card>
        </div>

        {/* Filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {(["all", "approved", "pending", "suspended"] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs shrink-0 capitalize"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f}
              <Badge variant="secondary" className="ml-1 text-[9px] h-4 px-1">
                {f === "all" ? merchants.length : merchants.filter(m => m.applicationStatus === f).length}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Merchant List */}
        {filteredMerchants.map(m => {
          const mSeasons = seasons.filter(s => s.merchantId === m.id);
          const liveSeasons = mSeasons.filter(s => s.isLive).length;
          return (
            <Card
              key={m.id}
              className="cursor-pointer hover:bg-accent/30 transition-colors active:scale-[0.98]"
              onClick={() => setSelectedMerchant(m)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold truncate">{m.name}</p>
                      {m.isVerified && <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">{m.category}</Badge>
                      <Badge className={`text-[10px] ${statusColors[m.applicationStatus]}`}>
                        {m.applicationStatus === "approved" && <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />}
                        {m.applicationStatus === "pending" && <Clock className="h-2.5 w-2.5 mr-0.5" />}
                        {m.applicationStatus === "suspended" && <ShieldOff className="h-2.5 w-2.5 mr-0.5" />}
                        {m.applicationStatus}
                      </Badge>
                      {liveSeasons > 0 && (
                        <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          <Radio className="h-2.5 w-2.5 mr-0.5" />
                          {liveSeasons} live
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {m.applicationStatus !== "pending" && (
                      <Button
                        variant="ghost" size="icon" className="h-8 w-8"
                        onClick={e => { e.stopPropagation(); handleToggleStatus(m.id, m.applicationStatus === "approved" ? "suspended" : "approved"); }}
                      >
                        {m.applicationStatus === "approved" ? <ShieldOff className="h-4 w-4 text-destructive" /> : <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                      </Button>
                    )}
                    {m.applicationStatus === "pending" && (
                      <Button
                        variant="ghost" size="icon" className="h-8 w-8"
                        onClick={e => { e.stopPropagation(); handleToggleStatus(m.id, "approved"); }}
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      </Button>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredMerchants.length === 0 && (
          <Card><CardContent className="p-6 text-center text-muted-foreground text-sm">No merchants match this filter.</CardContent></Card>
        )}
      </div>
    </div>
  );
}
