import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Settings, History, Save, Percent, Building2, Globe } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FeeDistributionConfig, FeeDistributionHistory } from "@/types/campaignSystem";
import { defaultFeeDistributionConfig, mockFeeDistributionHistory } from "@/data/campaignSystemData";
import { format } from "date-fns";

export function CampaignFeeDistributionSettings() {
  const [config, setConfig] = useState<FeeDistributionConfig>(defaultFeeDistributionConfig);
  const [communityPercent, setCommunityPercent] = useState(config.communityPercentage);
  const [showConfirm, setShowConfirm] = useState(false);
  const [history] = useState<FeeDistributionHistory[]>(mockFeeDistributionHistory);

  const mobigatePercent = 100 - communityPercent;
  const hasChanges = communityPercent !== config.communityPercentage;

  const handleSave = () => {
    setConfig(prev => ({
      ...prev,
      communityPercentage: communityPercent,
      mobigatePercentage: mobigatePercent,
      lastUpdatedAt: new Date(),
      lastUpdatedBy: "Mobigate Admin"
    }));
    
    toast({
      title: "Distribution Updated ✓",
      description: `New ratio: Community ${communityPercent}% : Mobigate ${mobigatePercent}%`,
    });
    
    setShowConfirm(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Campaign Fee Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Ratio Display */}
          <div className="flex items-center justify-center gap-3 py-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <Building2 className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-2xl font-bold text-primary">{communityPercent}%</p>
              <p className="text-xs text-muted-foreground">Community</p>
            </div>
            <div className="text-xl text-muted-foreground">:</div>
            <div className="text-center">
              <Globe className="h-5 w-5 mx-auto text-orange-500 mb-1" />
              <p className="text-2xl font-bold text-orange-500">{mobigatePercent}%</p>
              <p className="text-xs text-muted-foreground">Mobigate</p>
            </div>
          </div>

          {/* Slider Control */}
          <div className="space-y-3">
            <Label className="text-sm">Adjust Distribution</Label>
            <Slider
              value={[communityPercent]}
              onValueChange={([val]) => setCommunityPercent(val)}
              min={10}
              max={90}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Community: {communityPercent}%</span>
              <span>Mobigate: {mobigatePercent}%</span>
            </div>
          </div>

          {/* Manual Input */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Community %</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={communityPercent}
                  onChange={(e) => {
                    const val = Math.min(90, Math.max(10, Number(e.target.value)));
                    setCommunityPercent(val);
                  }}
                  min={10}
                  max={90}
                  className="pr-8"
                />
                <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Mobigate %</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={mobigatePercent}
                  disabled
                  className="pr-8 bg-muted"
                />
                <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-muted-foreground">
            Last updated: {format(new Date(config.lastUpdatedAt), "MMM d, yyyy 'at' h:mm a")} by {config.lastUpdatedBy}
          </div>

          {/* Save Button */}
          <Button 
            className="w-full" 
            disabled={!hasChanges}
            onClick={() => setShowConfirm(true)}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            Change History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[150px]">
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="border-l-2 border-muted pl-3 py-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {item.previousCommunityPercentage}:{item.previousMobigatePercentage} → {item.newCommunityPercentage}:{item.newMobigatePercentage}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(item.changedAt), "MMM d, yyyy")} • {item.changedBy}
                  </p>
                  {item.reason && (
                    <p className="text-xs mt-1">{item.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Distribution Change</AlertDialogTitle>
            <AlertDialogDescription>
              Change fee distribution to Community {communityPercent}% : Mobigate {mobigatePercent}%? This will apply to all new campaign payments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
