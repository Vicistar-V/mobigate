import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet,
  Save,
  AlertCircle,
  CheckCircle2,
  ArrowDownToLine,
} from "lucide-react";
import { formatMobi, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { MobiExplainerTooltip } from "@/components/common/MobiExplainerTooltip";
import { 
  platformWithdrawalSettings, 
  setMinimumWithdrawal 
} from "@/data/platformSettingsData";

interface WithdrawalSettingsCardProps {
  onSave?: (newMinimum: number) => void;
}

export function WithdrawalSettingsCard({ onSave }: WithdrawalSettingsCardProps) {
  const { toast } = useToast();
  const [minimum, setMinimum] = useState(platformWithdrawalSettings.minimumWithdrawal);
  const [isSaving, setIsSaving] = useState(false);
  
  const hasChanges = minimum !== platformWithdrawalSettings.minimumWithdrawal;
  const { minimumWithdrawalMin, minimumWithdrawalMax } = platformWithdrawalSettings;

  // Format the slider value for display
  const formatSliderValue = (value: number): string => {
    if (value >= 1000) {
      return `M${(value / 1000).toFixed(0)}K`;
    }
    return `M${value.toLocaleString()}`;
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the global settings
    setMinimumWithdrawal(minimum);
    
    onSave?.(minimum);
    toast({
      title: "Minimum Withdrawal Updated",
      description: `New minimum: ${formatMobi(minimum)} (≈ ${formatLocalAmount(minimum, "NGN")}). Changes apply immediately.`,
    });
    setIsSaving(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <ArrowDownToLine className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Minimum Withdrawal</CardTitle>
              <CardDescription className="text-xs">
                Platform-wide withdrawal limit
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant={hasChanges ? "default" : "secondary"} 
            className="text-sm font-bold px-3 py-1"
          >
            {formatSliderValue(minimum)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {/* Current Value Display */}
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <p className="text-sm text-muted-foreground">Current Minimum</p>
            <MobiExplainerTooltip size="sm" />
          </div>
          <p className="text-3xl font-bold text-primary">{formatMobi(minimum)}</p>
          <p className="text-sm text-muted-foreground">
            ≈ {formatLocalAmount(minimum, "NGN")}
          </p>
        </div>

        {/* Slider */}
        <div className="space-y-3 px-1">
          <Slider
            value={[minimum]}
            onValueChange={(values) => setMinimum(values[0])}
            min={minimumWithdrawalMin}
            max={minimumWithdrawalMax}
            step={1000}
            className="w-full touch-manipulation"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatSliderValue(minimumWithdrawalMin)}</span>
            <span className="font-medium text-foreground">{formatSliderValue(minimum)}</span>
            <span>{formatSliderValue(minimumWithdrawalMax)}</span>
          </div>
        </div>

        <Separator />

        {/* Dual Currency Preview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Mobi Value</span>
            </div>
            <p className="text-lg font-bold text-primary">{formatMobi(minimum)}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-muted border text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-xs font-medium">Local Currency</span>
            </div>
            <p className="text-lg font-bold">{formatLocalAmount(minimum, "NGN")}</p>
          </div>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-0.5">Platform-Wide Setting</p>
            <p>
              This is the minimum amount users can withdraw from their Mobi Wallet. 
              Changes apply immediately to all communities.
            </p>
          </div>
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
                Save Minimum Withdrawal
              </>
            )}
          </Button>
        )}

        {!hasChanges && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Current minimum is {formatMobi(platformWithdrawalSettings.minimumWithdrawal)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
