import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Percent, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  platformVoucherDiscountSettings,
  setTierSize,
  setBaseRate,
  setIncrementRate,
  setMaxDiscount,
} from "@/data/platformSettingsData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

function computePreview(tierSize: number, baseRate: number, incrementRate: number, maxDisc: number) {
  const tiers: Array<{ tier: number; rangeStart: number; rangeEnd: number; discountPercent: number }> = [];
  let t = 1;
  while (true) {
    const raw = baseRate + (t - 1) * incrementRate;
    const disc = Math.min(Math.round(raw * 100) / 100, maxDisc);
    tiers.push({ tier: t, rangeStart: (t - 1) * tierSize + 1, rangeEnd: t * tierSize, discountPercent: disc });
    if (disc >= maxDisc) break;
    t++;
    if (t > 100) break;
  }
  return tiers;
}

export function VoucherDiscountSettingsCard() {
  const s = platformVoucherDiscountSettings;
  const [tierSize, setTierSizeLocal] = useState(s.tierSize);
  const [baseRate, setBaseRateLocal] = useState(s.baseRate);
  const [incrementRate, setIncrementRateLocal] = useState(s.incrementRate);
  const [maxDiscountVal, setMaxDiscountLocal] = useState(s.maxDiscount);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const hasChanges =
    tierSize !== s.tierSize ||
    baseRate !== s.baseRate ||
    incrementRate !== s.incrementRate ||
    maxDiscountVal !== s.maxDiscount;

  const preview = computePreview(tierSize, baseRate, incrementRate, maxDiscountVal);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setTierSize(tierSize);
    setBaseRate(baseRate);
    setIncrementRate(incrementRate);
    setMaxDiscount(maxDiscountVal);
    setIsSaving(false);
    toast({
      title: "Discount Tiers Updated",
      description: `${preview.length} tiers configured, max ${maxDiscountVal.toFixed(1)}%`,
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card touch-manipulation active:scale-[0.98]">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Percent className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-foreground">Voucher Bulk Discount</p>
            <p className="text-xs text-muted-foreground">
              {s.baseRate.toFixed(1)}% base, +{s.incrementRate.toFixed(1)}%/tier, max {s.maxDiscount.toFixed(1)}%
            </p>
          </div>
          {hasChanges && (
            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 mr-1">
              Modified
            </Badge>
          )}
          {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 rounded-xl border border-border/50 bg-card p-4 space-y-5">
          {/* Tier Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-foreground">Bundles Per Tier</p>
              <Badge variant="outline" className="font-mono text-xs">{tierSize}</Badge>
            </div>
            <Slider
              value={[tierSize]}
              onValueChange={([v]) => setTierSizeLocal(v)}
              min={s.tierSizeMin}
              max={s.tierSizeMax}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{s.tierSizeMin}</span>
              <span>{s.tierSizeMax}</span>
            </div>
          </div>

          {/* Base Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-foreground">Base Rate (1st Tier)</p>
              <Badge variant="outline" className="font-mono text-xs">{baseRate.toFixed(1)}%</Badge>
            </div>
            <Slider
              value={[baseRate * 10]}
              onValueChange={([v]) => setBaseRateLocal(Math.round(v) / 10)}
              min={s.baseRateMin * 10}
              max={s.baseRateMax * 10}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{s.baseRateMin.toFixed(1)}%</span>
              <span>{s.baseRateMax.toFixed(1)}%</span>
            </div>
          </div>

          {/* Increment Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-foreground">Increment Per Tier</p>
              <Badge variant="outline" className="font-mono text-xs">+{incrementRate.toFixed(1)}%</Badge>
            </div>
            <Slider
              value={[incrementRate * 100]}
              onValueChange={([v]) => setIncrementRateLocal(Math.round(v) / 100)}
              min={s.incrementRateMin * 100}
              max={s.incrementRateMax * 100}
              step={25}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{s.incrementRateMin.toFixed(1)}%</span>
              <span>{s.incrementRateMax.toFixed(1)}%</span>
            </div>
          </div>

          {/* Max Discount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-foreground">Max Discount Cap</p>
              <Badge variant="outline" className="font-mono text-xs">{maxDiscountVal.toFixed(1)}%</Badge>
            </div>
            <Slider
              value={[maxDiscountVal]}
              onValueChange={([v]) => setMaxDiscountLocal(v)}
              min={s.maxDiscountMin}
              max={s.maxDiscountMax}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{s.maxDiscountMin.toFixed(1)}%</span>
              <span>{s.maxDiscountMax.toFixed(1)}%</span>
            </div>
          </div>

          {/* Tier Preview Table */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tier Preview</p>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <div className="grid grid-cols-3 gap-0 bg-muted/50 px-3 py-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Tier</span>
                <span className="text-xs font-semibold text-muted-foreground">Bundles</span>
                <span className="text-xs font-semibold text-muted-foreground text-right">Discount</span>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {preview.map((t) => (
                  <div key={t.tier} className="grid grid-cols-3 gap-0 px-3 py-1.5 border-t border-border/30">
                    <span className="text-xs text-foreground font-medium">Tier {t.tier}</span>
                    <span className="text-xs text-muted-foreground">{t.rangeStart}–{t.rangeEnd}</span>
                    <span className="text-xs text-emerald-600 font-bold text-right">{t.discountPercent.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info note */}
          <div className="flex gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every <strong>{tierSize}</strong> bundles form a tier. Tier 1 gets <strong>{baseRate.toFixed(1)}%</strong>, each subsequent tier adds <strong>{incrementRate.toFixed(1)}%</strong>, capped at <strong>{maxDiscountVal.toFixed(1)}%</strong>.
            </p>
          </div>

          {/* Save button */}
          {hasChanges ? (
            <Button onClick={handleSave} disabled={isSaving} className="w-full h-11 rounded-xl text-sm font-semibold touch-manipulation active:scale-[0.97]">
              {isSaving ? "Updating..." : "Update Discount Tiers"}
            </Button>
          ) : (
            <div className="text-center py-1">
              <p className="text-xs text-muted-foreground">Discount tiers are up to date</p>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
