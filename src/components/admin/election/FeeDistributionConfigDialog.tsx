import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Settings,
  PieChart,
  Building,
  Wallet,
  History,
  AlertCircle,
  Shield,
  Clock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { mockFeeDistributionHistory, defaultFeeDistributionConfig } from "@/data/campaignSystemData";
import { format } from "date-fns";

interface FeeDistributionConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeeDistributionConfigDialog({
  open,
  onOpenChange
}: FeeDistributionConfigDialogProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [communityPercentage, setCommunityPercentage] = useState(
    defaultFeeDistributionConfig.communityPercentage
  );
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mobigatePercentage = 100 - communityPercentage;

  const handleSaveConfig = async () => {
    if (!reason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for this configuration change.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Configuration Submitted",
      description: "Multi-signature authorization required to apply this change."
    });
    
    setIsSubmitting(false);
    setReason("");
    onOpenChange(false);
  };

  const Content = () => (
    <div className="space-y-4">
      {/* Current Config */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-sm">Current Distribution</h4>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 text-center p-3 bg-background rounded-lg">
              <Building className="h-5 w-5 mx-auto text-green-600 mb-1" />
              <p className="text-2xl font-bold text-green-600">
                {defaultFeeDistributionConfig.communityPercentage}%
              </p>
              <p className="text-xs text-muted-foreground">Community</p>
            </div>
            <div className="flex-1 text-center p-3 bg-background rounded-lg">
              <Wallet className="h-5 w-5 mx-auto text-blue-600 mb-1" />
              <p className="text-2xl font-bold text-blue-600">
                {defaultFeeDistributionConfig.mobigatePercentage}%
              </p>
              <p className="text-xs text-muted-foreground">Mobigate</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Last updated by {defaultFeeDistributionConfig.lastUpdatedBy} on{" "}
            {format(defaultFeeDistributionConfig.lastUpdatedAt, "MMM d, yyyy")}
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* New Config Slider */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Adjust Distribution
        </h4>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{communityPercentage}%</p>
                <p className="text-xs text-muted-foreground">Community</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{mobigatePercentage}%</p>
                <p className="text-xs text-muted-foreground">Mobigate</p>
              </div>
            </div>

            <Slider
              value={[communityPercentage]}
              onValueChange={(value) => setCommunityPercentage(value[0])}
              min={30}
              max={80}
              step={5}
              className="w-full"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Min: 30%</span>
              <span>Max: 80%</span>
            </div>
          </CardContent>
        </Card>

        {/* Reason Field */}
        <div className="space-y-2">
          <Label className="text-sm">Reason for Change *</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this distribution ratio is being changed..."
            rows={3}
          />
        </div>

        {/* Authorization Notice */}
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-700">
                  Multi-Signature Required
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Changes to fee distribution require authorization from 
                  President + Secretary + Legal Adviser.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          className="w-full h-11"
          onClick={handleSaveConfig}
          disabled={isSubmitting || communityPercentage === defaultFeeDistributionConfig.communityPercentage}
        >
          {isSubmitting ? "Submitting..." : "Submit for Authorization"}
        </Button>
      </div>

      <Separator />

      {/* Change History */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <History className="h-4 w-4" />
          Change History
        </h4>

        {mockFeeDistributionHistory.map((history) => (
          <Card key={history.id} className="bg-muted/30">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {format(history.changedAt, "MMM d, yyyy")}
                  </span>
                </div>
                <span className="text-xs font-medium">{history.changedBy}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="text-muted-foreground">
                  {history.previousCommunityPercentage}:{history.previousMobigatePercentage}
                </span>
                <span>→</span>
                <span className="font-medium">
                  {history.newCommunityPercentage}:{history.newMobigatePercentage}
                </span>
              </div>

              <p className="text-xs text-muted-foreground italic">
                "{history.reason}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="border-b pb-3">
            <DrawerTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Fee Distribution Config
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
            {Content()}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Fee Distribution Config
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          {Content()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
