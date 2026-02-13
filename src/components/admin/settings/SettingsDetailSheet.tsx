import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  const [customValue, setCustomValue] = useState("");
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

  const isOtherSelected = selectedValue === "__other__";
  const effectiveValue = isOtherSelected ? customValue : selectedValue;
  const hasChanged = selectedValue && selectedValue !== setting.currentValue && (!isOtherSelected || customValue.trim().length > 0);
  const isApproved = setting.approvalPercentage >= DEMOCRATIC_SETTINGS_CONFIG.APPROVAL_THRESHOLD;
  const currentOption = setting.options.find(o => o.value === setting.currentValue);

  const handleSubmitProposal = async () => {
    if (!hasChanged) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onProposalSubmit?.(setting.id, effectiveValue, reason);
    
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

  const content = (
    <div className="space-y-4 w-full box-border">
      {/* Current Status Card */}
      <Card className={`w-full box-border overflow-hidden ${isApproved ? 'border-green-500/30 bg-green-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {isApproved ? (
                <Check className="h-4 w-4 text-green-600 shrink-0" />
              ) : (
                <Clock className="h-4 w-4 text-amber-600 shrink-0" />
              )}
              <span className="text-sm font-medium">Current Value</span>
            </div>
            <Badge variant={isApproved ? "default" : "secondary"} className={`text-xs shrink-0 ${isApproved ? 'bg-green-600' : ''}`}>
              {setting.approvalPercentage}% Approved
            </Badge>
          </div>
          
          <div className="p-2 rounded-lg bg-background">
            <p className="font-medium text-sm break-words">{currentOption?.label || setting.currentValue}</p>
            {currentOption?.description && (
              <p className="text-sm text-muted-foreground mt-0.5 break-words">{currentOption.description}</p>
            )}
          </div>

          <Progress value={setting.approvalPercentage} className="h-1.5" />
          
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground flex-wrap">
            <span>Last updated: {format(setting.lastUpdated, "MMM d, yyyy")}</span>
            {setting.updatedBy && <span>by {setting.updatedBy}</span>}
          </div>
        </CardContent>
      </Card>

      {/* Pending Change Warning */}
      {setting.hasPendingChange && (
        <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/30 w-full box-border overflow-hidden">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300 break-words">
                  Pending Change Awaiting Approval
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 break-words">
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
        <p className="text-sm font-medium break-words">{setting.name}</p>
        <p className="text-sm text-muted-foreground break-words">{setting.description}</p>
      </div>

      {/* Options Selection */}
      <div className="space-y-2 w-full box-border">
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
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors w-full box-border ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value={option.value} id={option.value} className="mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Label htmlFor={option.value} className="text-sm font-medium cursor-pointer break-words">
                      {option.label}
                    </Label>
                    {isCurrent && (
                      <Badge variant="outline" className="text-xs px-1.5 shrink-0">Current</Badge>
                    )}
                  </div>
                  {option.description && (
                    <p className="text-sm text-muted-foreground mt-0.5 break-words">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          {/* Other (Specify) Option */}
          <div
            className={`flex flex-col gap-2 p-3 rounded-lg border transition-colors w-full box-border ${
              isOtherSelected
                ? 'border-primary bg-primary/5'
                : 'border-border hover:bg-muted/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <RadioGroupItem value="__other__" id="__other__" className="mt-0.5 shrink-0" />
              <Label htmlFor="__other__" className="text-sm font-medium cursor-pointer break-words">
                Other (Specify)
              </Label>
            </div>
            {isOtherSelected && (
              <Input
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Enter custom value..."
                className="text-sm touch-manipulation ml-7"
                autoComplete="off"
                spellCheck={false}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            )}
          </div>
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
            className="text-sm touch-manipulation"
            autoComplete="off"
            spellCheck={false}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Authorization Notice */}
      {setting.requiresMultiSig && (
        <Card className="bg-muted/50 w-full box-border overflow-hidden">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium break-words">Multi-Signature Required</p>
                <p className="text-xs text-muted-foreground mt-0.5 break-words">
                  This setting requires President + Secretary + Legal Adviser authorization.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Democratic Governance Notice */}
      <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 w-full box-border overflow-hidden">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 break-words">
                Democratic Approval Required
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 break-words">
                Changes require 60% member approval. Members can also submit alternative recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        className="w-full h-11 text-sm touch-manipulation active:scale-[0.97]"
        disabled={!hasChanged || isSubmitting}
        onClick={handleSubmitProposal}
      >
        {isSubmitting ? (
          "Submitting Proposal..."
        ) : hasChanged ? (
          <>
            <Send className="h-4 w-4 mr-2 shrink-0" />
            Submit for Members' Approval
          </>
        ) : (
          "Select a different value to propose"
        )}
      </Button>

      {/* Recommend Alternative Section */}
      {!showRecommendation ? (
        <Button
          variant="ghost"
          className="w-full h-10 text-sm gap-2 touch-manipulation active:scale-[0.97]"
          onClick={() => setShowRecommendation(true)}
        >
          <Lightbulb className="h-4 w-4 shrink-0" />
          Recommend New Setting Value
          <ChevronRight className="h-4 w-4 ml-auto shrink-0" />
        </Button>
      ) : (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 w-full box-border overflow-hidden">
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-600 shrink-0" />
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 break-words">
                Member Recommendation
              </p>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 break-words">
              Recommend an alternative value that other members can support. 
              If it reaches 60% support, it will override admin settings.
            </p>
            <Textarea
              placeholder="Describe your recommended value and why it's better..."
              rows={3}
              className="text-sm touch-manipulation"
              autoComplete="off"
              spellCheck={false}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 touch-manipulation active:scale-[0.97]"
                onClick={handleRecommendSubmit}
                disabled={isSubmitting}
              >
                <Lightbulb className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                Submit Recommendation
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full touch-manipulation active:scale-[0.97]"
                onClick={() => setShowRecommendation(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Footer */}
      <div className="flex items-start gap-2 p-2.5 bg-muted/30 rounded-lg w-full box-border">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground break-words">
          Your proposal will be sent to all community members for voting. 
          The change will only take effect if at least 60% approve it within 14 days.
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] p-0">
          <DrawerHeader className="border-b pb-3 shrink-0 px-3 pt-4">
            <DrawerTitle className="text-left break-words pr-6 leading-snug">{setting.name}</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-3 py-4 pb-8">
            {content}
          </div>
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
        <div className="flex-1 overflow-y-auto pr-4">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
