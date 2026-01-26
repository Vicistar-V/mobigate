import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, ArrowRight, Info, Send } from "lucide-react";
import { mockAdminProposals } from "@/data/communityDemocraticSettingsData";
import { DEMOCRATIC_SETTINGS_CONFIG } from "@/types/communityDemocraticSettings";

interface RecommendAlternativeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalId: string | null;
}

export function RecommendAlternativeDialog({
  open,
  onOpenChange,
  proposalId,
}: RecommendAlternativeDialogProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [recommendedValue, setRecommendedValue] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const proposal = proposalId
    ? mockAdminProposals.find((p) => p.proposalId === proposalId)
    : null;

  const handleSubmit = async () => {
    if (!recommendedValue.trim()) {
      toast({
        title: "Value Required",
        description: "Please enter your recommended setting value",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Recommendation Submitted",
      description: `Your recommendation for "${proposal?.settingName}" has been submitted. Members can now support it.`,
    });

    setRecommendedValue("");
    setReason("");
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const Content = () => (
    <div className="space-y-4 p-4">
      {/* Context Card */}
      {proposal && (
        <Card className="bg-muted/50">
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <h4 className="font-medium text-sm">{proposal.settingName}</h4>
            </div>

            {/* Current vs Proposed */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-background">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase">Current</p>
                <p className="text-xs font-medium truncate">{proposal.currentValue}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0 text-right">
                <p className="text-[10px] text-muted-foreground uppercase">Admin Proposed</p>
                <p className="text-xs font-medium text-primary truncate">
                  {proposal.proposedValue}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendation Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recommended-value" className="text-sm font-medium">
            Your Recommended Value *
          </Label>
          <Input
            id="recommended-value"
            placeholder="Enter your recommended setting value"
            value={recommendedValue}
            onChange={(e) => setRecommendedValue(e.target.value)}
            className="h-10"
          />
          <p className="text-xs text-muted-foreground">
            Suggest an alternative value that you believe would be better
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason" className="text-sm font-medium">
            Reason (Optional)
          </Label>
          <Textarea
            id="reason"
            placeholder="Explain why you recommend this alternative..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                How Recommendations Work
              </p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400">
                Your recommendation will be visible to all members. If it receives{" "}
                <strong>{DEMOCRATIC_SETTINGS_CONFIG.RECOMMENDATION_THRESHOLD}%</strong> support, it
                will automatically become the new setting, overriding both the current value and
                the admin's proposal.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        className="w-full h-10"
        onClick={handleSubmit}
        disabled={isSubmitting || !recommendedValue.trim()}
      >
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "Submitting..." : "Submit Recommendation"}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh] overflow-hidden">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              Recommend Alternative
            </DrawerTitle>
            <DrawerDescription className="text-xs">
              Suggest a different value for this setting
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto touch-auto">
            <Content />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            Recommend Alternative
          </DialogTitle>
          <DialogDescription className="text-xs">
            Suggest a different value for this setting
          </DialogDescription>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}
