import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Users, Lightbulb } from "lucide-react";
import { ActiveCommunitySetting, DEMOCRATIC_SETTINGS_CONFIG } from "@/types/communityDemocraticSettings";
import { format } from "date-fns";

interface ActiveSettingsListProps {
  settings: ActiveCommunitySetting[];
  onRecommendSetting?: (setting: ActiveCommunitySetting) => void;
}

export function ActiveSettingsList({ settings, onRecommendSetting }: ActiveSettingsListProps) {
  const threshold = DEMOCRATIC_SETTINGS_CONFIG.APPROVAL_THRESHOLD;

  const getSourceBadge = (source: ActiveCommunitySetting["source"]) => {
    switch (source) {
      case "admin":
        return (
          <Badge variant="outline" className="text-[9px] px-1 py-0">
            Admin
          </Badge>
        );
      case "member_override":
        return (
          <Badge className="text-[9px] px-1 py-0 bg-blue-500/10 text-blue-600 border-blue-200">
            <Users className="h-2.5 w-2.5 mr-0.5" />
            Override
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[9px] px-1 py-0">
            Default
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-2">
      {settings.map((setting) => (
        <Card key={setting.settingKey} className="overflow-hidden">
          <CardContent className="p-2.5 space-y-2">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-medium truncate">{setting.settingName}</h4>
                  {setting.hasPendingChange && (
                    <Badge variant="secondary" className="text-[9px] px-1 py-0 bg-amber-100 text-amber-700">
                      <AlertCircle className="h-2.5 w-2.5 mr-0.5" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
              {getSourceBadge(setting.source)}
            </div>

            {/* Current Value with Recommend Button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-1.5 rounded bg-muted/50">
                <span className="text-[10px] text-muted-foreground">Current Value:</span>
                <span className="text-xs font-medium">{setting.currentValue}</span>
              </div>
              
              {/* Recommend New Setting Button */}
              {onRecommendSetting && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-7 text-[10px] border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50"
                  onClick={() => onRecommendSetting(setting)}
                >
                  <Lightbulb className="h-3 w-3 mr-1.5" />
                  Recommend New Setting
                </Button>
              )}
            </div>

            {/* Approval Status */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Check className="h-2.5 w-2.5 text-green-500" />
                  Member Approval
                </span>
                <span className="font-medium">
                  {setting.approvalPercentage}%
                  {setting.approvalPercentage >= threshold && (
                    <Check className="h-2.5 w-2.5 text-green-500 inline ml-0.5" />
                  )}
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={setting.approvalPercentage}
                  className="h-1.5"
                />
                {/* 60% threshold marker */}
                <div
                  className="absolute top-0 h-1.5 w-0.5 bg-primary opacity-50"
                  style={{ left: `${threshold}%` }}
                />
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Last updated</span>
              <span>{format(setting.lastUpdatedAt, "MMM d, yyyy")}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
