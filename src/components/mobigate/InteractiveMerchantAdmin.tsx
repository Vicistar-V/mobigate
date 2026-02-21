import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose, DrawerBody,
} from "@/components/ui/drawer";
import {
  Building2, ChevronRight, Users, Trophy, Wallet,
  CheckCircle, Edit2, Radio, Calendar as CalendarIcon, Settings2,
  BookOpen, Filter, PlusCircle, ShieldCheck, ShieldOff, Clock,
  CalendarDays, CalendarPlus, AlertTriangle,
} from "lucide-react";
import {
  mockMerchants, mockSeasons, mockQuestions,
  type QuizMerchant, type QuizSeason, type MerchantQuestion,
  SEASON_TYPE_CONFIG, DEFAULT_MERCHANT_CONFIG,
} from "@/data/mobigateInteractiveQuizData";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";
import { format, addMonths, differenceInDays, addWeeks, parseISO } from "date-fns";
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
  const [seasonStartDate, setSeasonStartDate] = useState<Date | undefined>(undefined);
  const [seasonMinTarget, setSeasonMinTarget] = useState(10000);
  const [startDateOpen, setStartDateOpen] = useState(false);

  // Extension drawer state
  const [showExtendSeason, setShowExtendSeason] = useState<QuizSeason | null>(null);
  const [extensionWeeks, setExtensionWeeks] = useState(2);
  const [extensionReason, setExtensionReason] = useState("");

  const computedEndDate = useMemo(() => {
    if (!seasonStartDate) return null;
    return addMonths(seasonStartDate, SEASON_TYPE_CONFIG[seasonType].duration);
  }, [seasonStartDate, seasonType]);

  const handleToggleStatus = (merchantId: string, newStatus: "approved" | "suspended") => {
    setMerchants(prev => prev.map(m => m.id === merchantId ? { ...m, applicationStatus: newStatus } : m));
    toast({ title: `Merchant ${newStatus === "approved" ? "Approved" : "Suspended"}` });
  };

  const handleAddSeason = () => {
    if (!selectedMerchant || !seasonName.trim() || !seasonStartDate || !computedEndDate) return;
    const cfg = SEASON_TYPE_CONFIG[seasonType];
    const startStr = format(seasonStartDate, "yyyy-MM-dd");
    const endStr = format(computedEndDate, "yyyy-MM-dd");
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
      startDate: startStr,
      endDate: endStr,
      originalEndDate: endStr,
      isExtended: false,
      extensionWeeks: 0,
      extensionReason: "",
      minimumTargetParticipants: seasonMinTarget,
      selectionProcesses: [{ round: 1, entriesSelected: 10000, entryFee: seasonEntryFee }],
      tvShowRounds: [
        { round: 1, entriesSelected: 50, entryFee: 2000, label: "1st TV Show" },
        { round: 2, entriesSelected: 15, entryFee: 5000, label: "Semi-Final" },
        { round: 3, entriesSelected: 3, entryFee: 0, label: "Grand Finale" },
      ],
    };
    setSeasons(prev => [season, ...prev]);
    setSeasonName("");
    setSeasonStartDate(undefined);
    setSeasonMinTarget(10000);
    setShowAddSeason(false);
    toast({ title: "Season Created", description: `${season.name} — ${format(seasonStartDate, "MMM d")} to ${format(computedEndDate, "MMM d, yyyy")}` });
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

  const handleExtendSeason = () => {
    if (!showExtendSeason || extensionWeeks < 1) return;
    const newEndDate = addWeeks(parseISO(showExtendSeason.endDate), extensionWeeks);
    setSeasons(prev => prev.map(s => s.id === showExtendSeason.id ? {
      ...s,
      isExtended: true,
      extensionWeeks: (s.extensionWeeks || 0) + extensionWeeks,
      extensionReason: extensionReason || "Low subscription turnout",
      endDate: format(newEndDate, "yyyy-MM-dd"),
    } : s));
    toast({ title: "Season Extended", description: `+${extensionWeeks} weeks added` });
    setShowExtendSeason(null);
    setExtensionWeeks(2);
    setExtensionReason("");
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
            merchantSeasons.map(s => {
              const daysLeft = differenceInDays(parseISO(s.endDate), new Date());
              const belowTarget = s.totalParticipants < s.minimumTargetParticipants;
              return (
              <Card key={s.id} className="border border-border/40 active:scale-[0.98] transition-transform">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{s.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">{s.type}</Badge>
                        <Badge variant={s.status === "open" ? "default" : s.status === "in_progress" ? "secondary" : "outline"} className="text-[10px]">
                          {s.status.replace("_", " ")}
                        </Badge>
                        {s.isExtended && (
                          <Badge className="text-[9px] bg-amber-500/10 text-amber-600 border-amber-500/20">
                            +{s.extensionWeeks}w extended
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-muted-foreground">Live</span>
                      <Switch checked={s.isLive} onCheckedChange={() => handleToggleSeasonLive(s.id)} />
                    </div>
                  </div>

                  {/* Calendar dates */}
                  <div className="flex items-center gap-2 px-2 py-1.5 bg-primary/5 rounded-lg">
                    <CalendarDays className="h-3.5 w-3.5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium">
                        {format(parseISO(s.startDate), "MMM d, yyyy")} — {format(parseISO(s.endDate), "MMM d, yyyy")}
                      </p>
                      <p className="text-[9px] text-muted-foreground">
                        {s.duration}mo season • {daysLeft > 0 ? `${daysLeft} days remaining` : "Ended"}
                        {s.isExtended && ` • Originally: ${format(parseISO(s.originalEndDate), "MMM d")}`}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted/30 rounded p-1.5">
                      <p className="text-xs font-bold">{s.selectionProcesses.length}</p>
                      <p className="text-[9px] text-muted-foreground">Selections</p>
                    </div>
                    <div className="bg-muted/30 rounded p-1.5">
                      <p className="text-xs font-bold">{formatMobi(s.entryFee)}</p>
                      <p className="text-[9px] text-muted-foreground">Entry Fee</p>
                    </div>
                    <div className="bg-muted/30 rounded p-1.5">
                      <p className="text-xs font-bold">{formatMobi(s.prizePerLevel)}</p>
                      <p className="text-[9px] text-muted-foreground">Prize/Level</p>
                    </div>
                  </div>

                  {/* Participants & target */}
                  {belowTarget && s.status !== "completed" && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded text-[10px] text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      <span>Below target: {s.totalParticipants.toLocaleString()}/{s.minimumTargetParticipants.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">{s.totalParticipants.toLocaleString()} participants</span>
                    <div className="flex items-center gap-1.5">
                      {s.status !== "completed" && (
                        <Button
                          variant="outline" size="sm"
                          className="h-7 text-[10px] gap-1"
                          onClick={() => { setShowExtendSeason(s); setExtensionWeeks(2); setExtensionReason(""); }}
                        >
                          <CalendarPlus className="h-3 w-3" /> Extend
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => setSelectedSeason(s)}>
                        <Filter className="h-3 w-3" /> Process
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              );
            })
          )}
        </div>

        {/* Add Season Drawer */}
        <Drawer open={showAddSeason} onOpenChange={setShowAddSeason}>
          <DrawerContent className="max-h-[92vh]">
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

              {/* Start Date Picker */}
              <div className="space-y-1.5">
                <Label className="text-xs">Start Date</Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full h-11 justify-start text-left font-normal touch-manipulation">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      {seasonStartDate ? format(seasonStartDate, "MMM d, yyyy") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={seasonStartDate}
                      onSelect={(d) => { setSeasonStartDate(d); setStartDateOpen(false); }}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Auto-computed end date */}
              {seasonStartDate && computedEndDate && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold">Season Calendar</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Starts</p>
                        <p className="font-medium">{format(seasonStartDate, "MMM d, yyyy")}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Ends</p>
                        <p className="font-medium">{format(computedEndDate, "MMM d, yyyy")}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {SEASON_TYPE_CONFIG[seasonType].duration} months • {SEASON_TYPE_CONFIG[seasonType].processes} selection processes
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Entry Fee (₦)</Label>
                  <input type="text" inputMode="numeric" value={seasonEntryFee} onChange={e => { const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); setSeasonEntryFee(isNaN(n) ? 0 : n); }} onPointerDown={e => e.stopPropagation()} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm touch-manipulation" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Prize/Level (₦)</Label>
                  <input type="text" inputMode="numeric" value={seasonPrize} onChange={e => { const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); setSeasonPrize(isNaN(n) ? 0 : n); }} onPointerDown={e => e.stopPropagation()} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm touch-manipulation" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Min. Target Participants</Label>
                <input type="text" inputMode="numeric" value={seasonMinTarget} onChange={e => { const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); setSeasonMinTarget(isNaN(n) ? 0 : n); }} onPointerDown={e => e.stopPropagation()} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm touch-manipulation" />
                <p className="text-[10px] text-muted-foreground">Season can be extended if turnout is below this target.</p>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <Button onClick={handleAddSeason} disabled={!seasonName.trim() || !seasonStartDate} className="h-12">Create Season</Button>
              <DrawerClose asChild><Button variant="outline" className="h-12">Cancel</Button></DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Extend Season Drawer */}
        <Drawer open={!!showExtendSeason} onOpenChange={open => !open && setShowExtendSeason(null)}>
          <DrawerContent>
            <DrawerHeader className="px-4">
              <DrawerTitle className="text-base">Extend Season</DrawerTitle>
              {showExtendSeason && (
                <p className="text-xs text-muted-foreground mt-1">{showExtendSeason.name}</p>
              )}
            </DrawerHeader>
            <DrawerBody className="space-y-4">
              {showExtendSeason && (
                <>
                  <Card className="bg-muted/30">
                    <CardContent className="p-3 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current End Date</span>
                        <span className="font-medium">{format(parseISO(showExtendSeason.endDate), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Original End Date</span>
                        <span className="font-medium">{format(parseISO(showExtendSeason.originalEndDate), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Participants</span>
                        <span className="font-medium">{showExtendSeason.totalParticipants.toLocaleString()} / {showExtendSeason.minimumTargetParticipants.toLocaleString()}</span>
                      </div>
                      {showExtendSeason.isExtended && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Already Extended</span>
                          <span className="font-medium text-amber-600">+{showExtendSeason.extensionWeeks}w</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Extension Duration (weeks)</Label>
                    <Select value={String(extensionWeeks)} onValueChange={v => setExtensionWeeks(Number(v))}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 6, 8].map(w => (
                          <SelectItem key={w} value={String(w)}>{w} week{w > 1 ? "s" : ""}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Reason for Extension</Label>
                    <Select value={extensionReason} onValueChange={setExtensionReason}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Select reason" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low subscription turnout">Low subscription turnout</SelectItem>
                        <SelectItem value="Below minimum target">Below minimum target</SelectItem>
                        <SelectItem value="Merchant request">Merchant request</SelectItem>
                        <SelectItem value="Technical delay">Technical delay</SelectItem>
                        <SelectItem value="Seasonal adjustment">Seasonal adjustment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CalendarPlus className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold">New End Date</span>
                      </div>
                      <p className="text-sm font-bold">
                        {format(addWeeks(parseISO(showExtendSeason.endDate), extensionWeeks), "MMM d, yyyy")}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        +{extensionWeeks} week{extensionWeeks > 1 ? "s" : ""} from current end date
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </DrawerBody>
            <DrawerFooter>
              <Button onClick={handleExtendSeason} disabled={!extensionReason} className="h-12 bg-amber-500 hover:bg-amber-600">
                <CalendarPlus className="h-4 w-4 mr-2" /> Extend Season
              </Button>
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
