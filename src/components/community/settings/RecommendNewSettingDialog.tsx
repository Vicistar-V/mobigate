import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, ArrowRight, Info, Send, Settings, Check } from "lucide-react";
import { ActiveCommunitySetting, DEMOCRATIC_SETTINGS_CONFIG } from "@/types/communityDemocraticSettings";

interface RecommendNewSettingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setting: ActiveCommunitySetting | null;
}

export function RecommendNewSettingDialog({
  open,
  onOpenChange,
  setting,
}: RecommendNewSettingDialogProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [recommendedValue, setRecommendedValue] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      description: `Your recommendation for "${setting?.settingName}" has been submitted. Members can now support it.`,
    });

    setRecommendedValue("");
    setReason("");
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleClose = (openState: boolean) => {
    if (!openState) {
      setRecommendedValue("");
      setReason("");
    }
    onOpenChange(openState);
  };

  const Content = () => (
    <ScrollArea className="max-h-[70vh] overflow-y-auto touch-auto">
      <div className="space-y-4 p-4">
        {/* Current Setting Context */}
        {setting && (
          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-4">
              {/* Setting Name & Source Badge - Stacked */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <Settings className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <h4 className="font-semibold text-base break-words leading-tight">{setting.settingName}</h4>
                  </div>
                  {setting.source === "admin" && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 shrink-0">Admin Set</Badge>
                  )}
                  {setting.source === "member_override" && (
                    <Badge className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-600 shrink-0">Member Override</Badge>
                  )}
                  {setting.source === "default" && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5 shrink-0">Default</Badge>
                  )}
                </div>
              </div>

              {/* Current Value Display - Stacked for clarity */}
              <div className="p-3 rounded-lg bg-background border space-y-2">
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground uppercase font-medium">Current Value</p>
                  <p className="text-lg font-bold break-words">{setting.currentValue}</p>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-semibold">{setting.approvalPercentage}% Approved</span>
                </div>
              </div>

              {/* Arrow indicating change */}
              <div className="flex items-center justify-center py-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ArrowRight className="h-4 w-4" />
                  <span className="text-sm font-medium">Your Recommendation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendation Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-recommended-value" className="text-sm font-semibold">
              Your Recommended Value *
            </Label>
            {setting?.valueOptions && setting.valueOptions.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {setting.valueOptions.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={recommendedValue === option ? "default" : "outline"}
                      className="h-auto py-2.5 px-3 text-sm justify-start"
                      onClick={() => setRecommendedValue(option)}
                    >
                      {recommendedValue === option && (
                        <Check className="h-4 w-4 mr-2 shrink-0" />
                      )}
                      <span className="break-words text-left">{option}</span>
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Or enter a custom value:
                </p>
                <Input
                  id="new-recommended-value"
                  placeholder="Enter custom value"
                  value={recommendedValue}
                  onChange={(e) => setRecommendedValue(e.target.value)}
                  className="h-11 text-base"
                />
              </div>
            ) : (
              <Input
                id="new-recommended-value"
                placeholder="Enter your recommended setting value"
                value={recommendedValue}
                onChange={(e) => setRecommendedValue(e.target.value)}
                className="h-11 text-base"
              />
            )}
            <p className="text-sm text-muted-foreground">
              Suggest a different value that you believe would be better for the community
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-reason" className="text-sm font-semibold">
              Reason (Optional)
            </Label>
            <Textarea
              id="new-reason"
              placeholder="Explain why you recommend this change..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px] resize-none text-base"
            />
          </div>
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  How Recommendations Work
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Your recommendation will be visible to all members. If it receives{" "}
                  <strong>{DEMOCRATIC_SETTINGS_CONFIG.RECOMMENDATION_THRESHOLD}%</strong> support from valid members,
                  it will automatically become the new active setting, overriding the current value.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          className="w-full h-11 text-base"
          onClick={handleSubmit}
          disabled={isSubmitting || !recommendedValue.trim()}
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? "Submitting..." : "Submit Recommendation"}
        </Button>
      </div>
    </ScrollArea>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[92vh] overflow-hidden">
          <DrawerHeader className="pb-2 border-b">
            <DrawerTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              Recommend New Setting
            </DrawerTitle>
            <DrawerDescription className="text-sm">
              Suggest a different value for this setting
            </DrawerDescription>
          </DrawerHeader>
          <Content />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            Recommend New Setting
          </DialogTitle>
          <DialogDescription className="text-sm">
            Suggest a different value for this setting
          </DialogDescription>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}
