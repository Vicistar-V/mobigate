import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Coins, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  platformMediaAccessFeeSettings,
  setMediaAccessFeeDefault,
  setMediaAccessFeeMax,
} from "@/data/platformSettingsData";

export function MediaAccessFeeSettingsCard() {
  const { toast } = useToast();
  const [defaultFee, setDefaultFee] = useState(
    platformMediaAccessFeeSettings.defaultFee
  );
  const [maxFee, setMaxFee] = useState(platformMediaAccessFeeSettings.maxFee);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges =
    defaultFee !== platformMediaAccessFeeSettings.defaultFee ||
    maxFee !== platformMediaAccessFeeSettings.maxFee;

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setMediaAccessFeeMax(maxFee);
    setMediaAccessFeeDefault(Math.min(defaultFee, maxFee));
    toast({
      title: "Media Access Fee Updated",
      description: `Default M${defaultFee} • Max M${maxFee}. Applies to all monetised uploads.`,
    });
    setIsSaving(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Coins className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-base">Media Access Fee</CardTitle>
              <CardDescription className="text-xs">
                Default & maximum fee creators may set per content
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={hasChanges ? "default" : "secondary"}
            className="text-sm font-bold px-3 py-1"
          >
            M{defaultFee} / M{maxFee}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Default Fee */}
        <div className="space-y-3 px-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Default Fee</span>
            <span className="text-lg font-bold text-amber-600">
              M{defaultFee}
            </span>
          </div>
          <Slider
            value={[defaultFee]}
            onValueChange={(v) => setDefaultFee(v[0])}
            min={0}
            max={maxFee}
            step={1}
            className="w-full touch-manipulation"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Free (M0)</span>
            <span>M{maxFee}</span>
          </div>
        </div>

        <Separator />

        {/* Maximum Fee */}
        <div className="space-y-3 px-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Maximum Allowed Fee</span>
            <span className="text-lg font-bold text-primary">M{maxFee}</span>
          </div>
          <Slider
            value={[maxFee]}
            onValueChange={(v) => setMaxFee(v[0])}
            min={1}
            max={platformMediaAccessFeeSettings.hardMaxFee}
            step={1}
            className="w-full touch-manipulation"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>M1</span>
            <span>M{platformMediaAccessFeeSettings.hardMaxFee}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-0.5">Applies Platform-Wide</p>
            <p>
              Used on Status Wall posts, E-Library, Gallery and every
              monetised media upload. Creators cannot exceed the maximum.
            </p>
          </div>
        </div>

        {hasChanges ? (
          <Button className="w-full" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>Saving Changes...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Media Access Fee
              </>
            )}
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>
              Default M{platformMediaAccessFeeSettings.defaultFee} • Max M
              {platformMediaAccessFeeSettings.maxFee}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
