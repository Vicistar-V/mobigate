import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose,
} from "@/components/ui/drawer";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Building2, PlusCircle, ChevronRight, Users, Trophy, Wallet,
  CheckCircle, XCircle, Edit2, Trash2, Radio, Calendar,
} from "lucide-react";
import { mockMerchants, mockSeasons, type QuizMerchant, type QuizSeason } from "@/data/mobigateInteractiveQuizData";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";

export function InteractiveMerchantAdmin() {
  const { toast } = useToast();
  const [merchants, setMerchants] = useState<QuizMerchant[]>(mockMerchants);
  const [seasons, setSeasons] = useState<QuizSeason[]>(mockSeasons);
  const [selectedMerchant, setSelectedMerchant] = useState<QuizMerchant | null>(null);
  const [showAddMerchant, setShowAddMerchant] = useState(false);
  const [showAddSeason, setShowAddSeason] = useState(false);
  const [editMerchant, setEditMerchant] = useState<QuizMerchant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Add merchant form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newVerified, setNewVerified] = useState(false);

  // Add season form state
  const [seasonName, setSeasonName] = useState("");
  const [seasonType, setSeasonType] = useState<"Short" | "Medium" | "Complete">("Short");
  const [seasonLevels, setSeasonLevels] = useState(5);
  const [seasonEntryFee, setSeasonEntryFee] = useState(2000);
  const [seasonPrize, setSeasonPrize] = useState(50000);

  const merchantCategories = ["Technology", "Retail", "Education", "Healthcare", "Automotive", "Finance", "Entertainment"];

  const handleAddMerchant = () => {
    if (!newName.trim() || !newCategory) return;
    const merchant: QuizMerchant = {
      id: `m-${Date.now()}`,
      name: newName.trim(),
      logo: "/placeholder.svg",
      category: newCategory,
      seasonsAvailable: 0,
      totalPrizePool: 0,
      isVerified: newVerified,
    };
    setMerchants(prev => [merchant, ...prev]);
    setNewName("");
    setNewCategory("");
    setNewVerified(false);
    setShowAddMerchant(false);
    toast({ title: "Merchant Added", description: merchant.name });
  };

  const handleEditMerchant = () => {
    if (!editMerchant) return;
    setMerchants(prev => prev.map(m => m.id === editMerchant.id ? editMerchant : m));
    setEditMerchant(null);
    toast({ title: "Merchant Updated" });
  };

  const handleAddSeason = () => {
    if (!selectedMerchant || !seasonName.trim()) return;
    const season: QuizSeason = {
      id: `s-${Date.now()}`,
      merchantId: selectedMerchant.id,
      name: seasonName.trim(),
      type: seasonType,
      selectionLevels: seasonLevels,
      entryFee: seasonEntryFee,
      currentLevel: 1,
      totalParticipants: 0,
      prizePerLevel: seasonPrize,
      isLive: false,
      status: "open",
    };
    setSeasons(prev => [season, ...prev]);
    setSeasonName("");
    setShowAddSeason(false);
    toast({ title: "Season Created", description: season.name });
  };

  const handleToggleSeasonLive = (seasonId: string) => {
    setSeasons(prev => prev.map(s => s.id === seasonId ? { ...s, isLive: !s.isLive } : s));
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setMerchants(prev => prev.filter(m => m.id !== deleteTarget));
    setSeasons(prev => prev.filter(s => s.merchantId !== deleteTarget));
    setDeleteTarget(null);
    if (selectedMerchant?.id === deleteTarget) setSelectedMerchant(null);
    toast({ title: "Merchant Deleted", variant: "destructive" });
  };

  const merchantSeasons = selectedMerchant
    ? seasons.filter(s => s.merchantId === selectedMerchant.id)
    : [];

  // Merchant detail view
  if (selectedMerchant) {
    return (
      <div className="h-[calc(100vh-140px)] overflow-y-auto touch-auto overscroll-contain">
        <div className="space-y-4 pb-6">
          {/* Back button */}
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelectedMerchant(null)}>
            ← All Merchants
          </Button>

          {/* Merchant header */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold truncate">{selectedMerchant.name}</h2>
                    {selectedMerchant.isVerified && (
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs mt-1">{selectedMerchant.category}</Badge>
                </div>
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setEditMerchant({ ...selectedMerchant })}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <Card>
              <CardContent className="p-2 text-center">
                <Calendar className="h-4 w-4 mx-auto mb-1 text-primary" />
                <p className="text-lg font-bold">{merchantSeasons.length}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Seasons</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2 text-center">
                <Users className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                <p className="text-lg font-bold">{merchantSeasons.reduce((a, s) => a + s.totalParticipants, 0)}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Players</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2 text-center">
                <Wallet className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
                <p className="text-lg font-bold">{formatMobi(selectedMerchant.totalPrizePool)}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Prize Pool</p>
              </CardContent>
            </Card>
          </div>

          {/* Seasons */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Seasons</h3>
            <Button size="sm" className="h-8 text-xs gap-1" onClick={() => setShowAddSeason(true)}>
              <PlusCircle className="h-3.5 w-3.5" />
              Add Season
            </Button>
          </div>

          {merchantSeasons.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground text-sm">
                No seasons yet. Create one to get started.
              </CardContent>
            </Card>
          ) : (
            merchantSeasons.map(s => (
              <Card key={s.id} className="border border-border/40">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{s.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">{s.type}</Badge>
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
                      <p className="text-xs font-bold">{s.selectionLevels}</p>
                      <p className="text-[9px] text-muted-foreground">Levels</p>
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
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{s.totalParticipants} participants</span>
                    <span>Level {s.currentLevel}/{s.selectionLevels}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add Season Drawer */}
        <Drawer open={showAddSeason} onOpenChange={setShowAddSeason}>
          <DrawerContent className="max-h-[92vh] p-0 flex flex-col">
            <DrawerHeader className="shrink-0 px-4">
              <DrawerTitle>Add Season for {selectedMerchant.name}</DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Season Name</Label>
                <Input value={seasonName} onChange={e => setSeasonName(e.target.value)} placeholder="e.g. Tech Genius Season 2" className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Season Type</Label>
                <Select value={seasonType} onValueChange={v => setSeasonType(v as any)}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Short">Short (3-5 levels)</SelectItem>
                    <SelectItem value="Medium">Medium (5-6 levels)</SelectItem>
                    <SelectItem value="Complete">Complete (7+ levels)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Levels</Label>
                  <Input type="number" value={seasonLevels} onChange={e => setSeasonLevels(Number(e.target.value))} className="h-11" min={3} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Entry Fee</Label>
                  <Input type="number" value={seasonEntryFee} onChange={e => setSeasonEntryFee(Number(e.target.value))} className="h-11" min={0} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Prize/Level</Label>
                  <Input type="number" value={seasonPrize} onChange={e => setSeasonPrize(Number(e.target.value))} className="h-11" min={0} />
                </div>
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={handleAddSeason} disabled={!seasonName.trim()} className="h-12">Create Season</Button>
              <DrawerClose asChild><Button variant="outline" className="h-12">Cancel</Button></DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Edit Merchant Drawer */}
        <Drawer open={!!editMerchant} onOpenChange={open => !open && setEditMerchant(null)}>
          <DrawerContent className="max-h-[92vh] p-0 flex flex-col">
            <DrawerHeader className="shrink-0 px-4">
              <DrawerTitle>Edit Merchant</DrawerTitle>
            </DrawerHeader>
            {editMerchant && (
              <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Name</Label>
                  <Input value={editMerchant.name} onChange={e => setEditMerchant({ ...editMerchant, name: e.target.value })} className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Category</Label>
                  <Select value={editMerchant.category} onValueChange={v => setEditMerchant({ ...editMerchant, category: v })}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {merchantCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <Label className="text-sm">Verified</Label>
                  <Switch checked={editMerchant.isVerified} onCheckedChange={v => setEditMerchant({ ...editMerchant, isVerified: v })} />
                </div>
              </div>
            )}
            <DrawerFooter>
              <Button onClick={handleEditMerchant} className="h-12">Save Changes</Button>
              <DrawerClose asChild><Button variant="outline" className="h-12">Cancel</Button></DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        </div>
    );
  }

  // Merchant list view
  return (
    <div className="h-[calc(100vh-140px)] overflow-y-auto touch-auto overscroll-contain">
      <div className="space-y-4 pb-6">
        <Button className="w-full h-12 text-base font-semibold" onClick={() => setShowAddMerchant(true)}>
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Merchant
        </Button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Card>
            <CardContent className="p-2 text-center">
              <Building2 className="h-4 w-4 mx-auto mb-1 text-purple-500" />
              <p className="text-lg font-bold">{merchants.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Merchants</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2 text-center">
              <CheckCircle className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
              <p className="text-lg font-bold">{merchants.filter(m => m.isVerified).length}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Verified</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2 text-center">
              <Trophy className="h-4 w-4 mx-auto mb-1 text-amber-500" />
              <p className="text-lg font-bold">{seasons.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Seasons</p>
            </CardContent>
          </Card>
        </div>

        {/* Merchant List */}
        {merchants.map(m => {
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
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold truncate">{m.name}</p>
                      {m.isVerified && <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">{m.category}</Badge>
                      <span className="text-[10px] text-muted-foreground">{mSeasons.length} seasons</span>
                      {liveSeasons > 0 && (
                        <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          <Radio className="h-2.5 w-2.5 mr-0.5" />
                          {liveSeasons} live
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                      onClick={e => { e.stopPropagation(); setDeleteTarget(m.id); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Merchant Drawer */}
      <Drawer open={showAddMerchant} onOpenChange={setShowAddMerchant}>
        <DrawerContent className="max-h-[92vh] p-0 flex flex-col">
          <DrawerHeader className="shrink-0 px-4">
            <DrawerTitle>Add New Merchant</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Merchant Name</Label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. TechVentures Nigeria" className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Select category..." /></SelectTrigger>
                <SelectContent>
                  {merchantCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <Label className="text-sm">Verified Merchant</Label>
              <Switch checked={newVerified} onCheckedChange={setNewVerified} />
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleAddMerchant} disabled={!newName.trim() || !newCategory} className="h-12">Add Merchant</Button>
            <DrawerClose asChild><Button variant="outline" className="h-12">Cancel</Button></DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Merchant?</AlertDialogTitle>
            <AlertDialogDescription>This will remove this merchant and all their seasons permanently.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
