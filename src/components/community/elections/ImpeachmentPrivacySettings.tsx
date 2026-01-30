import { useState } from "react";
import { 
  Eye, 
  EyeOff, 
  Shield, 
  UserCircle, 
  Users, 
  Calendar, 
  Activity,
  Vote,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  ImpeachmentPrivacySetting,
  ImpeachmentPrivacyOption,
  IMPEACHMENT_PRIVACY_THRESHOLD,
  mockImpeachmentPrivacySettings,
  getVotesNeededForThreshold,
} from "@/types/impeachmentPrivacySettings";

interface ImpeachmentPrivacySettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Icon mapping
const getSettingIcon = (key: string) => {
  switch (key) {
    case 'initiator_visibility':
      return UserCircle;
    case 'voters_visibility':
      return Users;
    case 'dates_visibility':
      return Calendar;
    case 'status_visibility':
      return Activity;
    default:
      return Shield;
  }
};

export function ImpeachmentPrivacySettings({
  open,
  onOpenChange,
}: ImpeachmentPrivacySettingsProps) {
  const [settings, setSettings] = useState<ImpeachmentPrivacySetting[]>(mockImpeachmentPrivacySettings);
  const [selectedSetting, setSelectedSetting] = useState<ImpeachmentPrivacySetting | null>(null);
  const [showVoteDrawer, setShowVoteDrawer] = useState(false);

  const handleVote = (settingId: string, vote: ImpeachmentPrivacyOption) => {
    setSettings(prev => prev.map(s => {
      if (s.settingId === settingId) {
        const wasVisible = s.memberVote === 'visible';
        const wasHidden = s.memberVote === 'hidden';
        const isNewVote = s.memberVote === null;
        
        let newVisibleVotes = s.votesForVisible;
        let newHiddenVotes = s.votesForHidden;
        
        // Remove old vote if changing
        if (wasVisible) newVisibleVotes--;
        if (wasHidden) newHiddenVotes--;
        
        // Add new vote
        if (vote === 'visible') newVisibleVotes++;
        if (vote === 'hidden') newHiddenVotes++;
        
        const visiblePercentage = Math.round((newVisibleVotes / s.totalValidMembers) * 100);
        const hiddenPercentage = Math.round((newHiddenVotes / s.totalValidMembers) * 100);
        
        let isThresholdMet = false;
        let winningOption: ImpeachmentPrivacyOption | undefined;
        
        if (visiblePercentage >= IMPEACHMENT_PRIVACY_THRESHOLD.REQUIRED_PERCENTAGE) {
          isThresholdMet = true;
          winningOption = 'visible';
        } else if (hiddenPercentage >= IMPEACHMENT_PRIVACY_THRESHOLD.REQUIRED_PERCENTAGE) {
          isThresholdMet = true;
          winningOption = 'hidden';
        }
        
        return {
          ...s,
          memberVote: vote,
          votesForVisible: newVisibleVotes,
          votesForHidden: newHiddenVotes,
          totalVotes: newVisibleVotes + newHiddenVotes,
          visiblePercentage,
          hiddenPercentage,
          isThresholdMet,
          winningOption,
          currentValue: winningOption || s.currentValue,
        };
      }
      return s;
    }));
    
    toast.success(`Vote recorded: ${vote === 'visible' ? 'Show' : 'Hide'} ${selectedSetting?.settingName}`);
    setShowVoteDrawer(false);
    setSelectedSetting(null);
  };

  const pendingVotes = settings.filter(s => s.memberVote === null).length;

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] flex flex-col">
          <DrawerHeader className="shrink-0 border-b px-4">
            <DrawerTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Impeachment Privacy Settings
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain p-4 min-h-0">
            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                    Democratic Privacy Voting
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-xs">
                    {IMPEACHMENT_PRIVACY_THRESHOLD.REQUIRED_PERCENTAGE}% of valid members must vote for an option to effect the privacy setting. Vote to show or hide impeachment information.
                  </p>
                </div>
              </div>
            </div>

            {/* Pending Votes Alert */}
            {pendingVotes > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Vote className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    {pendingVotes} setting{pendingVotes > 1 ? 's' : ''} awaiting your vote
                  </span>
                </div>
              </div>
            )}

            {/* Settings Summary */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <Eye className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-green-700 dark:text-green-400">
                  {settings.filter(s => s.currentValue === 'visible').length}
                </p>
                <p className="text-xs text-muted-foreground">Visible</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg border">
                <EyeOff className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-bold">
                  {settings.filter(s => s.currentValue === 'hidden').length}
                </p>
                <p className="text-xs text-muted-foreground">Hidden</p>
              </div>
            </div>

            {/* Settings List */}
            <div className="space-y-3">
              {settings.map((setting) => {
                const Icon = getSettingIcon(setting.settingKey);
                const visibleNeeded = getVotesNeededForThreshold(setting.votesForVisible, setting.totalValidMembers);
                const hiddenNeeded = getVotesNeededForThreshold(setting.votesForHidden, setting.totalValidMembers);
                
                return (
                  <Card 
                    key={setting.settingId}
                    className={cn(
                      "cursor-pointer hover:shadow-md active:scale-[0.99] transition-all",
                      setting.memberVote === null && "border-amber-300 dark:border-amber-700"
                    )}
                    onClick={() => {
                      setSelectedSetting(setting);
                      setShowVoteDrawer(true);
                    }}
                  >
                    <CardContent className="p-3">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                          setting.currentValue === 'visible' 
                            ? "bg-green-100 dark:bg-green-900/50" 
                            : "bg-muted"
                        )}>
                          <Icon className={cn(
                            "h-5 w-5",
                            setting.currentValue === 'visible' 
                              ? "text-green-600" 
                              : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{setting.settingName}</p>
                            {setting.memberVote === null && (
                              <Badge className="text-[10px] bg-amber-500 text-white shrink-0">
                                Vote
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {setting.settingDescription}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>

                      {/* Current Status */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Current:</span>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            setting.currentValue === 'visible'
                              ? "bg-green-50 text-green-600 border-green-200"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {setting.currentValue === 'visible' ? (
                            <><Eye className="h-3 w-3 mr-1" /> Visible</>
                          ) : (
                            <><EyeOff className="h-3 w-3 mr-1" /> Hidden</>
                          )}
                        </Badge>
                      </div>

                      {/* Vote Progress */}
                      <div className="space-y-2">
                        {/* Visible Progress */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-green-600 flex items-center gap-1">
                              <Eye className="h-3 w-3" /> Show
                            </span>
                            <span className={cn(
                              "font-medium",
                              setting.visiblePercentage >= 70 ? "text-green-600" : ""
                            )}>
                              {setting.visiblePercentage}%
                            </span>
                          </div>
                          <div className="relative">
                            <Progress 
                              value={setting.visiblePercentage} 
                              className="h-1.5 bg-muted"
                            />
                            {/* 70% threshold marker */}
                            <div 
                              className="absolute top-0 bottom-0 w-0.5 bg-primary/50"
                              style={{ left: '70%' }}
                            />
                          </div>
                        </div>

                        {/* Hidden Progress */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <EyeOff className="h-3 w-3" /> Hide
                            </span>
                            <span className={cn(
                              "font-medium",
                              setting.hiddenPercentage >= 70 ? "text-foreground" : ""
                            )}>
                              {setting.hiddenPercentage}%
                            </span>
                          </div>
                          <Progress 
                            value={setting.hiddenPercentage} 
                            className="h-1.5 bg-muted [&>div]:bg-muted-foreground"
                          />
                        </div>
                      </div>

                      {/* Threshold Status */}
                      <div className="mt-2 pt-2 border-t flex items-center justify-between">
                        {setting.isThresholdMet ? (
                          <Badge className="text-xs bg-green-600 text-white">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            70% Threshold Met
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {Math.min(visibleNeeded, hiddenNeeded)} more votes needed
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {setting.totalVotes}/{setting.totalValidMembers}
                        </span>
                      </div>

                      {/* Your Vote */}
                      {setting.memberVote && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Your vote:</span>
                          <Badge variant="outline" className="text-xs">
                            {setting.memberVote === 'visible' ? (
                              <><Eye className="h-3 w-3 mr-1" /> Show</>
                            ) : (
                              <><EyeOff className="h-3 w-3 mr-1" /> Hide</>
                            )}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="shrink-0 px-4 py-4 border-t bg-background">
            <Button 
              variant="outline" 
              className="w-full h-11" 
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Vote Drawer */}
      <Drawer open={showVoteDrawer} onOpenChange={setShowVoteDrawer}>
        <DrawerContent className="max-h-[85vh] flex flex-col">
          <DrawerHeader className="shrink-0 border-b px-4">
            <DrawerTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              Cast Your Vote
            </DrawerTitle>
          </DrawerHeader>

          {selectedSetting && (
            <div className="flex-1 overflow-y-auto touch-auto overscroll-contain p-4 min-h-0">
              {/* Setting Info */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {(() => {
                      const Icon = getSettingIcon(selectedSetting.settingKey);
                      return (
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      );
                    })()}
                    <div>
                      <h3 className="font-semibold">{selectedSetting.settingName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedSetting.settingDescription}
                      </p>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Current setting:</span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        selectedSetting.currentValue === 'visible'
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {selectedSetting.currentValue === 'visible' ? (
                        <><Eye className="h-3 w-3 mr-1" /> Visible</>
                      ) : (
                        <><EyeOff className="h-3 w-3 mr-1" /> Hidden</>
                      )}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Vote Progress */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-3">Current Votes</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <Eye className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <p className="text-xl font-bold text-green-700 dark:text-green-400">
                      {selectedSetting.visiblePercentage}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedSetting.votesForVisible} votes to Show
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg border">
                    <EyeOff className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xl font-bold">
                      {selectedSetting.hiddenPercentage}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedSetting.votesForHidden} votes to Hide
                    </p>
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  {IMPEACHMENT_PRIVACY_THRESHOLD.REQUIRED_PERCENTAGE}% required to effect change
                </p>
              </div>

              {/* Vote Options */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Select your vote:</h4>
                
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-auto py-4 justify-start",
                    selectedSetting.memberVote === 'visible' && "border-green-500 bg-green-50 dark:bg-green-950/30"
                  )}
                  onClick={() => handleVote(selectedSetting.settingId, 'visible')}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0">
                      <Eye className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">Show Information</p>
                      <p className="text-xs text-muted-foreground">
                        Make this data visible to all valid members
                      </p>
                    </div>
                    {selectedSetting.memberVote === 'visible' && (
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    )}
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-auto py-4 justify-start",
                    selectedSetting.memberVote === 'hidden' && "border-primary bg-primary/5"
                  )}
                  onClick={() => handleVote(selectedSetting.settingId, 'hidden')}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">Hide Information</p>
                      <p className="text-xs text-muted-foreground">
                        Protect member identity and privacy
                      </p>
                    </div>
                    {selectedSetting.memberVote === 'hidden' && (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    )}
                  </div>
                </Button>
              </div>

              {/* Info Note */}
              <div className="mt-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Your vote can be changed at any time. The setting will be applied once {IMPEACHMENT_PRIVACY_THRESHOLD.REQUIRED_PERCENTAGE}% of valid members vote for either option.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="shrink-0 px-4 py-4 border-t bg-background">
            <Button 
              variant="outline" 
              className="w-full h-11" 
              onClick={() => {
                setShowVoteDrawer(false);
                setSelectedSetting(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
