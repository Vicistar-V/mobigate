import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  EyeOff,
  Users,
  ShieldCheck,
  CheckCircle2,
  Vote,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Gavel,
  ChevronRight,
} from "lucide-react";
import {
  DemocraticPrivacySetting,
  PrivacyVisibilityOption,
  PRIVACY_OPTION_LABELS,
  PRIVACY_OPTION_DESCRIPTIONS,
  calculateMajoritySetting,
} from "@/types/communityPrivacyVoting";
import { mockDemocraticSettings, castSettingVote } from "@/data/communityPrivacyVotingData";
import { ImpeachmentPrivacySettings } from "@/components/community/elections/ImpeachmentPrivacySettings";

interface MemberPrivacyVotingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getOptionIcon = (option: PrivacyVisibilityOption) => {
  switch (option) {
    case 'nobody':
      return <EyeOff className="h-5 w-5" />;
    case 'only_admins':
      return <ShieldCheck className="h-5 w-5" />;
    case 'valid_members':
      return <Users className="h-5 w-5" />;
    case 'all_members':
      return <Eye className="h-5 w-5" />;
  }
};

export function MemberPrivacyVotingSheet({ open, onOpenChange }: MemberPrivacyVotingSheetProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<DemocraticPrivacySetting[]>(mockDemocraticSettings);
  const [expandedSetting, setExpandedSetting] = useState<string | null>(null);
  const [pendingVotes, setPendingVotes] = useState<Record<string, PrivacyVisibilityOption>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImpeachmentPrivacy, setShowImpeachmentPrivacy] = useState(false);

  const handleVoteChange = (settingId: string, option: PrivacyVisibilityOption) => {
    setPendingVotes(prev => ({ ...prev, [settingId]: option }));
  };

  const handleSubmitVote = async (settingId: string) => {
    const newVote = pendingVotes[settingId];
    if (!newVote) return;

    const setting = settings.find(s => s.settingId === settingId);
    if (!setting) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const result = castSettingVote(settingId, setting.memberVote, newVote);
    
    if (result.success) {
      // Update local state
      setSettings(prev => prev.map(s => {
        if (s.settingId !== settingId) return s;
        
        const newCounts = { ...s.voteCounts };
        if (s.memberVote) {
          newCounts[s.memberVote] = Math.max(0, newCounts[s.memberVote] - 1);
        }
        newCounts[newVote] = newCounts[newVote] + 1;
        
        const newTotal = s.memberVote ? s.totalVotes : s.totalVotes + 1;
        
        return {
          ...s,
          voteCounts: newCounts,
          memberVote: newVote,
          totalVotes: newTotal,
        };
      }));

      toast({
        title: "Vote Recorded!",
        description: result.message,
      });

      // Clear pending vote
      setPendingVotes(prev => {
        const updated = { ...prev };
        delete updated[settingId];
        return updated;
      });
    }

    setIsSubmitting(false);
  };

  const toggleExpanded = (settingId: string) => {
    setExpandedSetting(prev => prev === settingId ? null : settingId);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[92vh] p-0">
          <SheetHeader className="px-4 py-3 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              <SheetTitle>Community Privacy Settings</SheetTitle>
            </div>
            <p className="text-sm text-muted-foreground text-left">
              Vote on how your community handles privacy. Majority rules!
            </p>
          </SheetHeader>

          <ScrollArea className="h-[calc(92vh-100px)] touch-auto">
            <div className="p-4 space-y-4 pb-8">
              {/* Info Banner */}
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Each setting is decided by member votes. The option with the most votes 
                    (&gt;50% for majority) becomes the community default.
                  </p>
                </div>
              </div>

              {/* Settings List */}
              <div className="space-y-3">
                {settings.map((setting) => {
                  const result = calculateMajoritySetting(setting);
                  const isExpanded = expandedSetting === setting.settingId;
                  const currentSelection = pendingVotes[setting.settingId] || setting.memberVote;
                  const hasChanges = pendingVotes[setting.settingId] && 
                    pendingVotes[setting.settingId] !== setting.memberVote;

                  return (
                    <Card key={setting.settingId} className="overflow-hidden">
                      {/* Header - Always Visible */}
                      <button
                        className="w-full p-4 text-left flex items-start justify-between gap-3"
                        onClick={() => toggleExpanded(setting.settingId)}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{setting.settingName}</h4>
                            {setting.memberVote && (
                              <Badge variant="outline" className="text-xs shrink-0">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Voted
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {setting.settingDescription}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">Current:</span>
                            <Badge variant="secondary" className="text-xs">
                              {getOptionIcon(setting.currentValue)}
                              <span className="ml-1">{PRIVACY_OPTION_LABELS[setting.currentValue]}</span>
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              ({result.percentage.toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                        )}
                      </button>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <CardContent className="px-4 pb-4 pt-0 border-t">
                          <div className="pt-4 space-y-4">
                            {/* Vote Distribution */}
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground">
                                Current Vote Distribution ({setting.totalVotes} votes)
                              </p>
                              {(Object.entries(setting.voteCounts) as [PrivacyVisibilityOption, number][]).map(
                                ([option, votes]) => {
                                  const percentage = setting.totalVotes > 0 
                                    ? (votes / setting.totalVotes) * 100 
                                    : 0;
                                  const isWinner = option === result.winner;

                                  return (
                                    <div key={option} className="space-y-1">
                                      <div className="flex items-center justify-between text-xs">
                                        <span className={isWinner ? 'font-medium' : 'text-muted-foreground'}>
                                          {PRIVACY_OPTION_LABELS[option]}
                                        </span>
                                        <span className="text-muted-foreground">
                                          {votes} ({percentage.toFixed(0)}%)
                                        </span>
                                      </div>
                                      <Progress 
                                        value={percentage} 
                                        className={`h-1.5 ${isWinner ? '' : 'opacity-50'}`}
                                      />
                                    </div>
                                  );
                                }
                              )}
                            </div>

                            {/* Voting Options */}
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground">
                                Cast Your Vote
                              </p>
                              <RadioGroup
                                value={currentSelection}
                                onValueChange={(value) => 
                                  handleVoteChange(setting.settingId, value as PrivacyVisibilityOption)
                                }
                                className="space-y-2"
                              >
                                {(['nobody', 'only_admins', 'valid_members', 'all_members'] as PrivacyVisibilityOption[]).map(
                                  (option) => (
                                    <Label
                                      key={option}
                                      htmlFor={`${setting.settingId}-${option}`}
                                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                        currentSelection === option
                                          ? 'border-primary bg-primary/5'
                                          : 'border-muted hover:border-muted-foreground/30'
                                      }`}
                                    >
                                      <RadioGroupItem
                                        value={option}
                                        id={`${setting.settingId}-${option}`}
                                        className="mt-0.5"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          {getOptionIcon(option)}
                                          <span className="font-medium text-sm">
                                            {PRIVACY_OPTION_LABELS[option]}
                                          </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                          {PRIVACY_OPTION_DESCRIPTIONS[option]}
                                        </p>
                                      </div>
                                    </Label>
                                  )
                                )}
                              </RadioGroup>
                            </div>

                            {/* Submit Button */}
                            {hasChanges && (
                              <Button
                                className="w-full"
                                onClick={() => handleSubmitVote(setting.settingId)}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  "Submitting..."
                                ) : setting.memberVote ? (
                                  "Change My Vote"
                                ) : (
                                  "Submit Vote"
                                )}
                              </Button>
                            )}

                            {setting.memberVote && !hasChanges && (
                              <p className="text-xs text-center text-muted-foreground">
                                You voted for "{PRIVACY_OPTION_LABELS[setting.memberVote]}"
                              </p>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}

                {/* Impeachment Privacy Settings Link */}
                <Card 
                  className="overflow-hidden cursor-pointer touch-manipulation border-red-200 bg-red-50/30 hover:bg-red-50/50 transition-colors"
                  onClick={() => setShowImpeachmentPrivacy(true)}
                >
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <Gavel className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-sm text-red-800">Impeachment Privacy Settings</h4>
                        <p className="text-xs text-red-600/80 line-clamp-1">
                          Vote on what impeachment data to show or hide (70% threshold)
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-red-400 shrink-0" />
                  </div>
                </Card>
              </div>

              {/* Majority Rule Explanation */}
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm mb-2">How Voting Works</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Each member gets one vote per setting</li>
                    <li>• You can change your vote at any time</li>
                    <li>• The option with &gt;50% votes becomes permanent</li>
                    <li>• Without majority, the plurality (highest) wins</li>
                    <li>• Your vote helps shape community policies</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Impeachment Privacy Settings Drawer */}
      <ImpeachmentPrivacySettings
        open={showImpeachmentPrivacy}
        onOpenChange={setShowImpeachmentPrivacy}
      />
    </>
  );
}
