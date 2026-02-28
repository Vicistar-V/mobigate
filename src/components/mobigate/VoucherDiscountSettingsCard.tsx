import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Percent, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  platformVoucherDiscountSettings,
  setDiscountPercentPerBundle,
} from "@/data/platformSettingsData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function VoucherDiscountSettingsCard() {
  const [ratePerBundle, setRatePerBundle] = useState(platformVoucherDiscountSettings.discountPercentPerBundle);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const hasChanges = ratePerBundle !== platformVoucherDiscountSettings.discountPercentPerBundle;

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setDiscountPercentPerBundle(ratePerBundle);
    setIsSaving(false);
    toast({
      title: "Discount Updated",
      description: `Bulk discount set to ${ratePerBundle}% per bundle`,
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
              Currently {platformVoucherDiscountSettings.discountPercentPerBundle}% per bundle
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
        <div className="mt-2 rounded-xl border border-border/50 bg-card p-4 space-y-4">
          {/* Rate slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Discount Per Bundle</p>
              <Badge variant="outline" className="font-mono text-xs">{ratePerBundle}%</Badge>
            </div>
            <Slider
              value={[ratePerBundle * 100]}
              onValueChange={([v]) => setRatePerBundle(Math.round(v) / 100)}
              min={0}
              max={200}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>2%</span>
            </div>
          </div>

          {/* Info note */}
          <div className="flex gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Each bundle a merchant purchases adds <strong>{ratePerBundle}%</strong> discount to their order. For example, 10 bundles = <strong>{(10 * ratePerBundle).toFixed(1)}%</strong> off, 50 bundles = <strong>{(50 * ratePerBundle).toFixed(1)}%</strong> off.
            </p>
          </div>

          {/* Save button */}
          {hasChanges ? (
            <Button onClick={handleSave} disabled={isSaving} className="w-full h-11 rounded-xl text-sm font-semibold touch-manipulation active:scale-[0.97]">
              {isSaving ? "Updating..." : "Update Discount"}
            </Button>
          ) : (
            <div className="text-center py-1">
              <p className="text-xs text-muted-foreground">Discount is up to date</p>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
