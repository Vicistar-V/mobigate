import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Percent,
  Wallet,
  Building2,
  ArrowRight,
  Save,
  AlertCircle,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { formatMobi, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { MobiExplainerTooltip } from "@/components/common/MobiExplainerTooltip";

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
  const hasChanges = rate !== currentRate;

  const serviceCharge = exampleFee * (rate / 100);
  const totalDebited = exampleFee + serviceCharge;

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave?.(rate);
    toast({
      title: "Service Charge Updated",
      description: `New rate: ${rate}%. Changes will apply to new declarations.`,
    });
    setIsSaving(false);
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
              <CardTitle className="text-base">Service Charge Rate</CardTitle>
              <CardDescription className="text-xs">
                Applied to all nomination fees
              </CardDescription>
            </div>
          </div>
          <Badge variant={hasChanges ? "default" : "secondary"} className="text-lg font-bold px-3 py-1">
            {rate}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Slider */}
        <div className="space-y-3">
          <Slider
            value={[rate]}
            onValueChange={(values) => setRate(values[0])}
            min={minRate}
            max={maxRate}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{minRate}%</span>
            <span className="font-medium text-foreground">{rate}%</span>
            <span>{maxRate}%</span>
          </div>
        </div>

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
              <span className="text-muted-foreground">Service Charge ({rate}%):</span>
              <div className="text-right">
                <span className="font-medium text-amber-600">{formatMobi(serviceCharge)}</span>
                <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(serviceCharge, "NGN")}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-base font-bold">
              <span>Total Debited:</span>
              <div className="text-right">
                <span className="text-primary">{formatMobi(totalDebited)}</span>
                <p className="text-xs font-normal text-muted-foreground">≈ {formatLocalAmount(totalDebited, "NGN")}</p>
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
              {formatMobi(exampleFee)}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">≈ {formatLocalAmount(exampleFee, "NGN")}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">Nomination Fee</p>
          </div>
          
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Mobigate Receives</span>
            </div>
            <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
              {formatMobi(serviceCharge)}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500">≈ {formatLocalAmount(serviceCharge, "NGN")}</p>
            <p className="text-xs text-amber-600 dark:text-amber-500">Service Charge</p>
          </div>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Service charge is automatically debited from candidate's wallet in addition to 
            the nomination fee when they declare interest in any elective position.
          </p>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>Saving Changes...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Service Charge Rate
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
