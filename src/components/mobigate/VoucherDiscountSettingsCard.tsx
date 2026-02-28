import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Percent, Calculator, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  platformVoucherDiscountSettings,
  setDiscountPercentPerBundle,
  setMaxDiscountPercent,
} from "@/data/platformSettingsData";

export function VoucherDiscountSettingsCard() {
  const [ratePerBundle, setRatePerBundle] = useState(platformVoucherDiscountSettings.discountPercentPerBundle);
  const [maxCap, setMaxCap] = useState(platformVoucherDiscountSettings.maxDiscountPercent);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const hasChanges =
    ratePerBundle !== platformVoucherDiscountSettings.discountPercentPerBundle ||
    maxCap !== platformVoucherDiscountSettings.maxDiscountPercent;

  const previewDiscount = (bundles: number) => Math.min(bundles * ratePerBundle, maxCap);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setDiscountPercentPerBundle(ratePerBundle);
    setMaxDiscountPercent(maxCap);
    setIsSaving(false);
    toast({
      title: "Discount Settings Updated",
      description: `${ratePerBundle}% per bundle, capped at ${maxCap}%`,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Percent className="h-4 w-4 text-primary" />
            Voucher Bulk Discounts
          </CardTitle>
          {hasChanges && (
            <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              Modified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Rate per bundle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Discount Per Bundle</p>
            <Badge variant="outline" className="font-mono text-xs">{ratePerBundle}%</Badge>
          </div>
          <Slider
            value={[ratePerBundle * 100]}
            onValueChange={([v]) => setRatePerBundle(Math.round(v) / 100)}
            min={platformVoucherDiscountSettings.discountPercentMin * 100}
            max={platformVoucherDiscountSettings.discountPercentMax * 100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{platformVoucherDiscountSettings.discountPercentMin}%</span>
            <span>{platformVoucherDiscountSettings.discountPercentMax}%</span>
          </div>
        </div>

        {/* Max cap */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Maximum Discount Cap</p>
            <Badge variant="outline" className="font-mono text-xs">{maxCap}%</Badge>
          </div>
          <Slider
            value={[maxCap]}
            onValueChange={([v]) => setMaxCap(v)}
            min={platformVoucherDiscountSettings.maxDiscountPercentMin}
            max={platformVoucherDiscountSettings.maxDiscountPercentMax}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{platformVoucherDiscountSettings.maxDiscountPercentMin}%</span>
            <span>{platformVoucherDiscountSettings.maxDiscountPercentMax}%</span>
          </div>
        </div>

        <Separator />

        {/* Preview */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Calculator className="h-3 w-3" /> Discount Preview
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[5, 10, 20, 50].map(n => (
              <div key={n} className="p-2 rounded-lg bg-muted/40 text-center">
                <p className="text-[10px] text-muted-foreground">{n} bundles</p>
                <p className="text-sm font-bold text-primary">{previewDiscount(n).toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info note */}
        <div className="flex gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
          <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Each bundle purchased adds <strong>{ratePerBundle}%</strong> discount, up to a maximum of <strong>{maxCap}%</strong>. Applies to all merchant voucher generations.
          </p>
        </div>

        {/* Save button */}
        {hasChanges ? (
          <Button onClick={handleSave} disabled={isSaving} className="w-full h-11 rounded-xl text-sm font-semibold touch-manipulation active:scale-[0.97]">
            {isSaving ? "Updating..." : "Update Discount Settings"}
          </Button>
        ) : (
          <div className="text-center py-2">
            <p className="text-xs text-muted-foreground">Settings are up to date</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
