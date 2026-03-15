import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Percent, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSubMerchantDiscountRate, setSubMerchantDiscountRate } from "@/data/subMerchantVoucherData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function SubMerchantDiscountSettings() {
  const [rate, setRate] = useState(getSubMerchantDiscountRate());
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const currentRate = getSubMerchantDiscountRate();
  const hasChanges = rate !== currentRate;

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubMerchantDiscountRate(rate);
    setIsSaving(false);
    toast({
      title: "Discount Updated",
      description: `Your end-user discount set to ${rate.toFixed(1)}%`,
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
            <p className="text-sm font-bold text-foreground">My Discount Rate</p>
            <p className="text-xs text-muted-foreground">Currently {currentRate.toFixed(1)}% for end-users</p>
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Discount Percentage</p>
              <Badge variant="outline" className="font-mono text-xs">{rate.toFixed(1)}%</Badge>
            </div>
            <Slider
              value={[rate * 10]}
              onValueChange={([v]) => setRate(v / 10)}
              min={0}
              max={50}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span className="font-semibold text-foreground">≤ 5.0% max</span>
            </div>

            {/* Manual Input */}
            <div className="flex items-center gap-2 pt-1">
              <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">Enter manually:</label>
              <div className="relative flex-1 max-w-[120px]">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={rate.toFixed(1)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, "");
                    const num = parseFloat(val);
                    if (!isNaN(num)) {
                      const clamped = Math.min(5.0, Math.max(0, Math.round(num * 10) / 10));
                      setRate(clamped);
                    } else if (val === "") {
                      setRate(0);
                    }
                  }}
                  className="h-9 text-sm font-mono font-semibold text-center rounded-lg pr-6"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">%</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              This is the discount you offer to end-users who purchase vouchers through you. Retail merchants can set discounts between <span className="font-semibold text-foreground">0%</span> and <span className="font-semibold text-foreground">5.0%</span> maximum. A higher discount attracts more customers.
            </p>
          </div>

          {hasChanges ? (
            <Button onClick={handleSave} disabled={isSaving} className="w-full h-11 rounded-xl text-sm font-semibold touch-manipulation active:scale-[0.97]">
              {isSaving ? "Updating..." : "Update Discount Rate"}
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
