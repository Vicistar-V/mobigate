import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose, DrawerBody } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Settings2, DollarSign, Target, Gift, HelpCircle } from "lucide-react";
import type { QuizMerchant } from "@/data/mobigateInteractiveQuizData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchant: QuizMerchant;
  onSave: (updated: QuizMerchant) => void;
}

function NumInput({ label, value, onChange, min, max, suffix }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; suffix?: string }) {
  const handleChange = (val: string) => {
    const n = parseInt(val.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(n) && n >= min && n <= max) onChange(n);
    else if (val === "") onChange(min);
  };
  return (
    <div className="space-y-1">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={e => handleChange(e.target.value)}
          onPointerDown={e => e.stopPropagation()}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm touch-manipulation"
        />
        {suffix && <span className="text-xs text-muted-foreground shrink-0">{suffix}</span>}
      </div>
    </div>
  );
}

export function MerchantPlatformSettingsDrawer({ open, onOpenChange, merchant, onSave }: Props) {
  const [config, setConfig] = useState<QuizMerchant>(merchant);

  useEffect(() => { setConfig(merchant); }, [merchant]);

  const update = (patch: Partial<QuizMerchant>) => setConfig(prev => ({ ...prev, ...patch }));

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="px-4 shrink-0">
          <DrawerTitle className="flex items-center gap-2 text-base"><Settings2 className="h-5 w-5 text-primary" /> Platform Settings</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="space-y-5 pb-8">
          {/* Quiz Pack Config */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-500 shrink-0" />
              <h3 className="text-sm font-bold">Quiz Pack Configuration</h3>
            </div>
            {/* Stack vertically on mobile instead of cramped 3-col */}
            <NumInput label="Total Questions per Pack" value={config.questionsPerPack} onChange={v => update({ questionsPerPack: v })} min={5} max={50} />
            <div className="grid grid-cols-2 gap-3">
              <NumInput label="Objective Qs" value={config.objectivePerPack} onChange={v => update({ objectivePerPack: v })} min={1} max={config.questionsPerPack - 1} />
              <NumInput label="Non-Objective Qs" value={config.nonObjectivePerPack} onChange={v => update({ nonObjectivePerPack: v })} min={1} max={config.questionsPerPack - 1} />
            </div>
            <NumInput label="Objective Answer Options (8–10)" value={config.objectiveOptions} onChange={v => update({ objectiveOptions: v })} min={8} max={10} />
          </section>

          {/* Billing */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500 shrink-0" />
              <h3 className="text-sm font-bold">Billing</h3>
            </div>
            <NumInput label="Cost per Question (₦)" value={config.costPerQuestion} onChange={v => update({ costPerQuestion: v })} min={10} max={10000} suffix="₦" />
          </section>

          {/* Win Thresholds */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-500 shrink-0" />
              <h3 className="text-sm font-bold">Win Thresholds</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Win Percentage</Label>
                <Badge variant="secondary" className="text-xs">{config.winPercentageThreshold}%</Badge>
              </div>
              <div onPointerDown={e => e.stopPropagation()}>
                <Slider
                  value={[config.winPercentageThreshold]}
                  onValueChange={([v]) => update({ winPercentageThreshold: v })}
                  min={25} max={50} step={5}
                  className="touch-manipulation"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">Players earn this % of cost on correct answers (25-50%)</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="min-w-0 flex-1">
                <Label className="text-xs">Fair Answer Credit</Label>
                <p className="text-[10px] text-muted-foreground">Fixed at 20% for AA matches</p>
              </div>
              <Badge variant="outline" className="shrink-0">{config.fairAnswerPercentage}%</Badge>
            </div>
          </section>

          {/* Alternative Answers */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold">Alternative Answers (Non-Objective)</h3>
            <div className="grid grid-cols-2 gap-3">
              <NumInput label="Min AA Count" value={config.alternativeAnswersMin} onChange={v => update({ alternativeAnswersMin: v })} min={2} max={config.alternativeAnswersMax} />
              <NumInput label="Max AA Count" value={config.alternativeAnswersMax} onChange={v => update({ alternativeAnswersMax: v })} min={config.alternativeAnswersMin} max={5} />
            </div>
            <p className="text-[10px] text-muted-foreground">Words/phrases closest to the Actual True Answer. 5 Fair Answers = 1 Actual True Answer.</p>
          </section>

          {/* Qualifying Points */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold">Game Show Entry</h3>
            <NumInput label="Qualifying Points to Enter Game Show" value={config.qualifyingPoints} onChange={v => update({ qualifyingPoints: v })} min={5} max={100} />
            <p className="text-[10px] text-muted-foreground">Players must earn this many points before entering the Game Show. Previous earnings are absorbed upon entry.</p>
          </section>

          {/* Bonus Config */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-pink-500 shrink-0" />
              <h3 className="text-sm font-bold">Bonus Games</h3>
            </div>
            <NumInput label="Games Before Bonus Trigger" value={config.bonusGamesAfter} onChange={v => update({ bonusGamesAfter: v })} min={10} max={200} />
            <div className="grid grid-cols-2 gap-3">
              <NumInput label="Min Bonus Games" value={config.bonusGamesCountMin} onChange={v => update({ bonusGamesCountMin: v })} min={1} max={config.bonusGamesCountMax} />
              <NumInput label="Max Bonus Games" value={config.bonusGamesCountMax} onChange={v => update({ bonusGamesCountMax: v })} min={config.bonusGamesCountMin} max={20} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumInput label="Min Discount %" value={config.bonusDiscountMin} onChange={v => update({ bonusDiscountMin: v })} min={10} max={config.bonusDiscountMax} />
              <NumInput label="Max Discount %" value={config.bonusDiscountMax} onChange={v => update({ bonusDiscountMax: v })} min={config.bonusDiscountMin} max={75} />
            </div>
            <p className="text-[10px] text-muted-foreground">After {config.bonusGamesAfter} games, player gets {config.bonusGamesCountMin}-{config.bonusGamesCountMax} bonus games at {config.bonusDiscountMin}-{config.bonusDiscountMax}% discount.</p>
          </section>
        </DrawerBody>
        <DrawerFooter className="shrink-0">
          <Button className="h-12 w-full" onClick={() => { onSave(config); onOpenChange(false); }}>Save Settings</Button>
          <DrawerClose asChild><Button variant="outline" className="h-12 w-full">Cancel</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
