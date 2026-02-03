import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  Check, 
  Clock, 
  Lock, 
  AlertTriangle, 
  Users, 
  Lightbulb,
  Send,
  ThumbsUp,
  ThumbsDown,
  Info,
  ChevronRight
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { AdminSetting } from "@/data/adminSettingsData";
import { format } from "date-fns";
import { DEMOCRATIC_SETTINGS_CONFIG } from "@/types/communityDemocraticSettings";

interface SettingsDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setting: AdminSetting | null;
  onProposalSubmit?: (settingId: string, newValue: string, reason?: string) => void;
}

export function SettingsDetailSheet({
  open,
  onOpenChange,
  setting,
  onProposalSubmit,
}: SettingsDetailSheetProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [reason, setReason] = useState("");
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when setting changes
  useState(() => {
    if (setting) {
      setSelectedValue(setting.currentValue);
      setReason("");
      setShowRecommendation(false);
    }
  });

  if (!setting) return null;

  const hasChanged = selectedValue && selectedValue !== setting.currentValue;
  const isApproved = setting.approvalPercentage >= DEMOCRATIC_SETTINGS_CONFIG.APPROVAL_THRESHOLD;
  const currentOption = setting.options.find(o => o.value === setting.currentValue);

  const handleSubmitProposal = async () => {
    if (!hasChanged) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onProposalSubmit?.(setting.id, selectedValue, reason);
    
    toast({
      title: "Proposal Submitted",
      description: `Your proposed change to "${setting.name}" will be sent to members for approval.`
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleRecommendSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Recommendation Submitted",
      description: "Your alternative setting recommendation has been submitted for member support."
    });
    
    setIsSubmitting(false);
    setShowRecommendation(false);
    onOpenChange(false);
  };

  const Content = () => (
    <div className="space-y-4">
      {/* Current Status Card */}
      <Card className={`${isApproved ? 'border-green-500/30 bg-green-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isApproved ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-amber-600" />
              )}
              <span className="text-sm font-medium">Current Value</span>
            </div>
            <Badge variant={isApproved ? "default" : "secondary"} className={`text-xs ${isApproved ? 'bg-green-600' : ''}`}>
              {setting.approvalPercentage}% Approved
            </Badge>
          </div>
          
          <div className="p-2 rounded-lg bg-background">
            <p className="font-medium text-sm">{currentOption?.label || setting.currentValue}</p>
            {currentOption?.description && (
              <p className="text-sm text-muted-foreground mt-0.5">{currentOption.description}</p>
            )}
          </div>

          <Progress value={setting.approvalPercentage} className="h-1.5" />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last updated: {format(setting.lastUpdated, "MMM d, yyyy")}</span>
            {setting.updatedBy && <span>by {setting.updatedBy}</span>}
          </div>
        </CardContent>
      </Card>

      {/* Pending Change Warning */}
      {setting.hasPendingChange && (
        <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/30">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Pending Change Awaiting Approval
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                  A proposed change to this setting is currently awaiting 60% member approval.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Setting Description */}
      <div className="space-y-1">
        <p className="text-sm font-medium">{setting.name}</p>
        <p className="text-sm text-muted-foreground">{setting.description}</p>
      </div>

      {/* Options Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Select New Value</Label>
        <RadioGroup
          value={selectedValue || setting.currentValue}
          onValueChange={setSelectedValue}
          className="space-y-2"
        >
          {setting.options.map((option) => {
            const isSelected = (selectedValue || setting.currentValue) === option.value;
            const isCurrent = setting.currentValue === option.value;
            
            return (
              <div
                key={option.value}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={option.value} className="text-sm font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    {isCurrent && (
                      <Badge variant="outline" className="text-xs px-1.5">Current</Badge>
                    )}
                  </div>
                  {option.description && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      {/* Reason Input (when value changed) */}
      {hasChanged && (
        <div className="space-y-2">
          <Label className="text-sm">Reason for Change (Optional)</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why you're proposing this change..."
            rows={3}
            className="text-sm"
          />
        </div>
      )}

      {/* Authorization Notice */}
      {setting.requiresMultiSig && (
        <Card className="bg-muted/50">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Multi-Signature Required</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This setting requires President + Secretary + Legal Adviser authorization.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Democratic Governance Notice */}
      <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Democratic Approval Required
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                Changes require 60% member approval. Members can also submit alternative recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        className="w-full h-11"
        disabled={!hasChanged || isSubmitting}
        onClick={handleSubmitProposal}
      >
        {isSubmitting ? (
          "Submitting Proposal..."
        ) : hasChanged ? (
          <>
            <Send className="h-4 w-4 mr-2" />
            Submit for Member Approval
          </>
        ) : (
          "Select a different value to propose"
        )}
      </Button>

      {/* Recommend Alternative Section */}
      {!showRecommendation ? (
        <Button
          variant="ghost"
          className="w-full h-10 text-sm gap-2"
          onClick={() => setShowRecommendation(true)}
        >
          <Lightbulb className="h-4 w-4" />
          Recommend New Setting Value
          <ChevronRight className="h-4 w-4 ml-auto" />
        </Button>
      ) : (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Member Recommendation
              </p>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Recommend an alternative value that other members can support. 
              If it reaches 60% support, it will override admin settings.
            </p>
            <Textarea
              placeholder="Describe your recommended value and why it's better..."
              rows={3}
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowRecommendation(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleRecommendSubmit}
                disabled={isSubmitting}
              >
                <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Footer */}
      <div className="flex items-start gap-2 p-2.5 bg-muted/30 rounded-lg">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Your proposal will be sent to all community members for voting. 
          The change will only take effect if at least 60% approve it within 14 days.
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="border-b pb-3">
            <DrawerTitle className="text-left truncate pr-4">{setting.name}</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
            <Content />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="truncate pr-4">{setting.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <Content />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
