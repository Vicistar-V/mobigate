import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  EyeOff, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Vote,
} from "lucide-react";
import {
  DemocraticPrivacySetting,
  PRIVACY_OPTION_LABELS,
  calculateMajoritySetting,
} from "@/types/communityPrivacyVoting";
import { mockDemocraticSettings } from "@/data/communityPrivacyVotingData";

interface VotersListPrivacySettingsProps {
  onViewDetails?: (setting: DemocraticPrivacySetting) => void;
}

const getOptionIcon = (option: string) => {
  switch (option) {
    case 'nobody':
      return <EyeOff className="h-4 w-4" />;
    case 'only_admins':
      return <ShieldCheck className="h-4 w-4" />;
    case 'valid_members':
      return <Users className="h-4 w-4" />;
    case 'all_members':
      return <Eye className="h-4 w-4" />;
    default:
      return <Eye className="h-4 w-4" />;
  }
};

const getOptionColor = (option: string, isWinner: boolean): string => {
  if (!isWinner) return 'bg-muted';
  
  switch (option) {
    case 'nobody':
      return 'bg-red-500';
    case 'only_admins':
      return 'bg-amber-500';
    case 'valid_members':
      return 'bg-emerald-500';
    case 'all_members':
      return 'bg-blue-500';
    default:
      return 'bg-primary';
  }
};

export function VotersListPrivacySettings({ onViewDetails }: VotersListPrivacySettingsProps) {
  const [settings] = useState<DemocraticPrivacySetting[]>(mockDemocraticSettings);
  const totalMembers = 85; // Mock total members

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Vote className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-base">Democratic Privacy Settings</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          {totalMembers} Members
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        Settings are determined by member voting. The option with majority (&gt;50%) becomes permanent.
      </p>

      <div className="space-y-3">
        {settings.map((setting) => {
          const result = calculateMajoritySetting(setting);
          const participationRate = (setting.totalVotes / totalMembers) * 100;

          return (
            <Card key={setting.settingId} className="overflow-hidden">
              <CardHeader className="py-3 px-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm font-medium">
                      {setting.settingName}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {setting.settingDescription}
                    </p>
                  </div>
                  {result.isMajority ? (
                    <Badge className="bg-emerald-100 text-emerald-700 shrink-0">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Majority
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="shrink-0">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Plurality
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-3 pt-0">
                {/* Current Value Display */}
                <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-primary/5">
                  {getOptionIcon(setting.currentValue)}
                  <span className="text-sm font-medium">
                    Current: {PRIVACY_OPTION_LABELS[setting.currentValue]}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {result.percentage.toFixed(1)}% of votes
                  </span>
                </div>

                {/* Vote Distribution */}
                <div className="space-y-2">
                  {(Object.entries(setting.voteCounts) as [keyof typeof setting.voteCounts, number][]).map(
                    ([option, votes]) => {
                      const percentage = setting.totalVotes > 0 
                        ? (votes / setting.totalVotes) * 100 
                        : 0;
                      const isWinner = option === result.winner;

                      return (
                        <div key={option} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              {getOptionIcon(option)}
                              <span className={isWinner ? 'font-medium' : ''}>
                                {PRIVACY_OPTION_LABELS[option]}
                              </span>
                            </div>
                            <span className="text-muted-foreground">
                              {votes} votes ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <Progress 
                            value={percentage} 
                            className={`h-1.5 ${isWinner ? '' : 'opacity-60'}`}
                          />
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Participation & Details */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">{setting.totalVotes}</span> of{' '}
                    <span className="font-medium">{totalMembers}</span> voted ({participationRate.toFixed(0)}%)
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => onViewDetails?.(setting)}
                  >
                    View Details
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">How Democratic Settings Work:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Each member can vote on privacy settings</li>
              <li>The option with &gt;50% becomes permanent</li>
              <li>Members can change their vote anytime</li>
              <li>Majority rule determines all community settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
