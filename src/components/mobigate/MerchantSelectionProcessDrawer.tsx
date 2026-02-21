import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose, DrawerBody } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2, Tv, Trophy, ArrowDown, Users } from "lucide-react";
import type { QuizSeason, SelectionProcess, TVShowRound } from "@/data/mobigateInteractiveQuizData";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season: QuizSeason;
  onSave: (updated: QuizSeason) => void;
}

function NumField({ value, onChange, placeholder }: { value: number; onChange: (v: number) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value || ""}
      onChange={e => { const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); onChange(isNaN(n) ? 0 : n); }}
      onPointerDown={e => e.stopPropagation()}
      placeholder={placeholder}
      className="h-10 w-full rounded-md border border-input bg-background px-2 text-sm touch-manipulation text-center"
    />
  );
}

export function MerchantSelectionProcessDrawer({ open, onOpenChange, season, onSave }: Props) {
  const [processes, setProcesses] = useState<SelectionProcess[]>(season.selectionProcesses);
  const [tvRounds, setTvRounds] = useState<TVShowRound[]>(season.tvShowRounds);

  useEffect(() => {
    setProcesses(season.selectionProcesses);
    setTvRounds(season.tvShowRounds);
  }, [season]);

  const addProcess = () => {
    const lastFee = processes.length > 0 ? processes[processes.length - 1].entryFee : season.entryFee;
    const lastEntries = processes.length > 0 ? Math.floor(processes[processes.length - 1].entriesSelected / 2) : 1000;
    setProcesses(prev => [...prev, { round: prev.length + 1, entriesSelected: lastEntries, entryFee: lastFee + 250 }]);
  };

  const removeProcess = (idx: number) => {
    setProcesses(prev => prev.filter((_, i) => i !== idx).map((p, i) => ({ ...p, round: i + 1 })));
  };

  const updateProcess = (idx: number, patch: Partial<SelectionProcess>) => {
    setProcesses(prev => prev.map((p, i) => i === idx ? { ...p, ...patch } : p));
  };

  const addTvRound = () => {
    const defaults: Record<number, string> = { 0: "1st TV Show", 1: "Semi-Final", 2: "Grand Finale" };
    setTvRounds(prev => [...prev, {
      round: prev.length + 1,
      entriesSelected: prev.length === 2 ? 3 : 15,
      entryFee: prev.length === 2 ? 0 : 5000,
      label: defaults[prev.length] || `TV Round ${prev.length + 1}`,
    }]);
  };

  const removeTvRound = (idx: number) => {
    setTvRounds(prev => prev.filter((_, i) => i !== idx).map((r, i) => ({ ...r, round: i + 1 })));
  };

  const updateTvRound = (idx: number, patch: Partial<TVShowRound>) => {
    setTvRounds(prev => prev.map((r, i) => i === idx ? { ...r, ...patch } : r));
  };

  const handleSave = () => {
    onSave({ ...season, selectionProcesses: processes, tvShowRounds: tvRounds });
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="px-4">
          <DrawerTitle className="text-base">Selection Process — {season.name}</DrawerTitle>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="text-[10px]">{season.type}</Badge>
            <Badge variant="secondary" className="text-[10px]">{season.duration} months</Badge>
          </div>
        </DrawerHeader>
        <DrawerBody className="space-y-4 pb-6">
          {/* Selection Processes */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold">Selection Rounds</h3>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={addProcess}>
              <PlusCircle className="h-3.5 w-3.5" /> Add
            </Button>
          </div>

          {processes.map((p, idx) => (
            <Card key={idx} className="border-l-4 border-l-blue-500/50">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="text-[10px]">Round {p.round}</Badge>
                  {processes.length > 1 && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeProcess(idx)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Entries Selected</Label>
                    <NumField value={p.entriesSelected} onChange={v => updateProcess(idx, { entriesSelected: v })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Entry Fee (₦)</Label>
                    <NumField value={p.entryFee} onChange={v => updateProcess(idx, { entryFee: v })} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {processes.length > 0 && (
            <div className="flex justify-center">
              <ArrowDown className="h-5 w-5 text-muted-foreground animate-bounce" />
            </div>
          )}

          {/* TV Show Rounds */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Tv className="h-4 w-4 text-purple-500" />
              <h3 className="text-sm font-bold">TV Show Rounds</h3>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={addTvRound}>
              <PlusCircle className="h-3.5 w-3.5" /> Add
            </Button>
          </div>

          {tvRounds.map((r, idx) => {
            const isFinale = idx === tvRounds.length - 1 && tvRounds.length >= 2;
            return (
              <Card key={idx} className={`border-l-4 ${isFinale ? "border-l-amber-500/60 bg-amber-500/5" : "border-l-purple-500/50"}`}>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isFinale ? <Trophy className="h-3.5 w-3.5 text-amber-500" /> : <Tv className="h-3.5 w-3.5 text-purple-500" />}
                      <input
                        type="text"
                        value={r.label}
                        onChange={e => updateTvRound(idx, { label: e.target.value })}
                        onPointerDown={e => e.stopPropagation()}
                        className="text-sm font-semibold bg-transparent border-none outline-none w-full touch-manipulation"
                      />
                    </div>
                    {tvRounds.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeTvRound(idx)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Entries Selected</Label>
                      <NumField value={r.entriesSelected} onChange={v => updateTvRound(idx, { entriesSelected: v })} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Entry Fee (₦)</Label>
                      <NumField value={r.entryFee} onChange={v => updateTvRound(idx, { entryFee: v })} />
                    </div>
                  </div>
                  {isFinale && r.entriesSelected <= 3 && (
                    <div className="flex gap-1 flex-wrap mt-1">
                      <Badge className="text-[9px] bg-amber-500/20 text-amber-600 border-amber-500/30">🥇 1st Prize</Badge>
                      <Badge className="text-[9px] bg-gray-400/20 text-gray-600 border-gray-400/30">🥈 2nd Prize</Badge>
                      <Badge className="text-[9px] bg-orange-500/20 text-orange-600 border-orange-500/30">🥉 3rd Prize</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </DrawerBody>
        <DrawerFooter>
          <Button className="h-12" onClick={handleSave}>Save Selection Process</Button>
          <DrawerClose asChild><Button variant="outline" className="h-12">Cancel</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
