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
          <Badge variant="outline" className="text-xs px-2 py-0.5 shrink-0">
            Admin
          </Badge>
        );
      case "member_override":
        return (
          <Badge className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-600 border-blue-200 shrink-0">
            <Users className="h-3 w-3 mr-1" />
            Override
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs px-2 py-0.5 shrink-0">
            Default
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-3">
      {settings.map((setting) => (
        <Card key={setting.settingKey} className="overflow-hidden">
          <CardContent className="p-3 space-y-3">
            {/* Header - Stacked for mobile */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold break-words leading-tight flex-1 min-w-0">
                  {setting.settingName}
                </h4>
                {getSourceBadge(setting.source)}
              </div>
              {setting.hasPendingChange && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              )}
            </div>

            {/* Current Value - Full width stacked */}
            <div className="space-y-2">
              <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-muted/50">
                <span className="text-xs text-muted-foreground font-medium">Current Value:</span>
                <span className="text-base font-semibold break-words">{setting.currentValue}</span>
              </div>
              
              {/* Recommend New Setting Button */}
              {onRecommendSetting && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-9 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50"
                  onClick={() => onRecommendSetting(setting)}
                >
                  <Lightbulb className="h-3.5 w-3.5 mr-2" />
                  Recommend New Setting
                </Button>
              )}
            </div>

            {/* Approval Status - Stacked layout */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  Member Approval
                </span>
                <span className="text-sm font-semibold flex items-center gap-1">
                  {setting.approvalPercentage}%
                  {setting.approvalPercentage >= threshold && (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  )}
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={setting.approvalPercentage}
                  className="h-2"
                />
                {/* 60% threshold marker */}
                <div
                  className="absolute top-0 h-2 w-0.5 bg-primary opacity-50"
                  style={{ left: `${threshold}%` }}
                />
              </div>
            </div>

            {/* Last Updated - Clear readable text */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground pt-1 border-t">
              <span>Last updated</span>
              <span className="font-medium">{format(setting.lastUpdatedAt, "MMM d, yyyy")}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
