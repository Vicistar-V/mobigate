import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Percent,
  Wallet,
  Building2,
  Save,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { formatMobi, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { MobiExplainerTooltip } from "@/components/common/MobiExplainerTooltip";
import { LockableSetting } from "@/components/common/LockableSetting";

interface ServiceChargeConfigCardProps {
  currentRate: number;
  minRate?: number;
  maxRate?: number;
  exampleFee?: number;
  onSave?: (newRate: number) => void;
}

export function ServiceChargeConfigCard({
  currentRate,
  minRate = 15,
  maxRate = 30,
  exampleFee = 50000,
  onSave,
}: ServiceChargeConfigCardProps) {
  const { toast } = useToast();
  const [rate, setRate] = useState(currentRate);
  const [isSaving, setIsSaving] = useState(false);
  const [locked, setLocked] = useState(true);
  const hasChanges = rate !== currentRate;

  // Unified Service Charge / Processing Fee — debited from BOTH wallets.
  const serviceCharge = exampleFee * (rate / 100);
  const candidateDebit = exampleFee + serviceCharge;
  const communityDebit = serviceCharge;

  const clamp = (n: number) => Math.min(maxRate, Math.max(minRate, n));

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave?.(rate);
    toast({
      title: "Service Charge / Processing Fee Updated",
      description: `New rate: ${rate}%. Debited from both the Candidate's and Community Wallets.`,
    });
    setIsSaving(false);
    setLocked(true); // re-lock after save
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Percent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Service Charge / Processing Fee</CardTitle>
              <CardDescription className="text-xs">
                Single unified rate · debited from both wallets
              </CardDescription>
            </div>
          </div>
          <Badge variant={hasChanges ? "default" : "secondary"} className="text-lg font-bold px-3 py-1">
            {rate}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <LockableSetting
          label="Charge Rate"
          description={`Range: ${minRate}% – ${maxRate}% · slider or manual input`}
          locked={locked}
          onLockedChange={setLocked}
          displayValue={`${rate}%`}
        >
          {(unlocked) => (
            <div className="space-y-3">
              <Slider
                value={[rate]}
                onValueChange={(values) => setRate(values[0])}
                min={minRate}
                max={maxRate}
                step={1}
                disabled={!unlocked}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{minRate}%</span>
                <span className="font-medium text-foreground">{rate}%</span>
                <span>{maxRate}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Manual Input:</span>
                <div className="relative flex-1 max-w-[140px]">
                  <Input
                    type="number"
                    value={rate}
                    disabled={!unlocked}
                    min={minRate}
                    max={maxRate}
                    step={1}
                    onChange={(e) => setRate(Number(e.target.value) || rate)}
                    onBlur={(e) => setRate(clamp(Number(e.target.value) || currentRate))}
                    className="h-9 text-sm pr-7"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
            </div>
          )}
        </LockableSetting>

        <Separator />

        {/* Preview Calculation */}
        <div className="space-y-3">
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium text-muted-foreground">Preview Calculation</p>
            <MobiExplainerTooltip size="sm" />
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Nomination Fee:</span>
              <div className="text-right">
                <span className="font-medium">{formatMobi(exampleFee)}</span>
                <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(exampleFee, "NGN")}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground leading-tight">
                Service Charge / Processing Fee ({rate}%):
              </span>
              <div className="text-right">
                <span className="font-medium text-amber-600">{formatMobi(serviceCharge)}</span>
                <p className="text-[10px] text-amber-600/70">≈ {formatLocalAmount(serviceCharge, "NGN")} × 2 wallets</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm font-bold">
              <span>Candidate Wallet Debited:</span>
              <div className="text-right">
                <span className="text-primary">{formatMobi(candidateDebit)}</span>
                <p className="text-xs font-normal text-muted-foreground">≈ {formatLocalAmount(candidateDebit, "NGN")}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm font-bold">
              <span>Community Wallet Debited:</span>
              <div className="text-right">
                <span className="text-primary">{formatMobi(communityDebit)}</span>
                <p className="text-xs font-normal text-muted-foreground">≈ {formatLocalAmount(communityDebit, "NGN")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Community Receives</span>
            </div>
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
              {formatMobi(exampleFee - communityDebit)}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">≈ {formatLocalAmount(exampleFee - communityDebit, "NGN")}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-500">Nomination Fee − Charge</p>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Mobiface Receives</span>
            </div>
            <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
              {formatMobi(serviceCharge * 2)}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500">≈ {formatLocalAmount(serviceCharge * 2, "NGN")}</p>
            <p className="text-[10px] text-amber-600 dark:text-amber-500">From both wallets</p>
          </div>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Service Charge and Processing Fee are the same unified charge. It is
            debited from <strong>both the Community Wallet and the Candidate's Wallet</strong> when
            a candidate declares interest in any elective position.
          </p>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={isSaving || locked}
          >
            {isSaving ? (
              <>Saving Changes...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {locked ? "Unlock to Save" : "Save Charge Rate"}
              </>
            )}
          </Button>
        )}

        {!hasChanges && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Current rate is {currentRate}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
