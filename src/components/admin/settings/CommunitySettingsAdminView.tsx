import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Settings, AlertTriangle, Users, Check, Clock, Info, Vote } from "lucide-react";
import {
  mockAdminProposals,
  mockMemberRecommendations,
  mockActiveSettings,
  getSettingsByCategory,
} from "@/data/communityDemocraticSettingsData";
import {
  SETTING_CATEGORY_LABELS,
  DEMOCRATIC_SETTINGS_CONFIG,
} from "@/types/communityDemocraticSettings";

interface CommunitySettingsAdminViewProps {
  onViewMemberVotes?: () => void;
}

export function CommunitySettingsAdminView({ onViewMemberVotes }: CommunitySettingsAdminViewProps) {
  const pendingProposals = mockAdminProposals.filter((p) => p.status === "pending_approval");
  const activeOverrides = mockMemberRecommendations.filter(
    (r) => r.supportPercentage >= DEMOCRATIC_SETTINGS_CONFIG.RECOMMENDATION_THRESHOLD
  );
  const settingsByCategory = getSettingsByCategory();

  return (
    <div className="space-y-4">
      {/* Warning Card */}
      <Card className="border-amber-300 bg-amber-50/50 dark:bg-amber-950/30 dark:border-amber-800">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Democratic Governance Active
              </p>
              <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-0.5">
                <li>
                  • Setting changes require <strong>{DEMOCRATIC_SETTINGS_CONFIG.APPROVAL_THRESHOLD}%</strong> member approval
                </li>
                <li>
                  • Member recommendations with <strong>{DEMOCRATIC_SETTINGS_CONFIG.RECOMMENDATION_THRESHOLD}%</strong> support override admin settings
                </li>
                <li>• You cannot change settings without member consent</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      {pendingProposals.length > 0 && (
        <Card>
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Pending Approvals
              <Badge variant="secondary" className="ml-auto text-xs">
                {pendingProposals.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 space-y-2">
            {pendingProposals.map((proposal) => (
              <div
                key={proposal.proposalId}
                className="p-2 rounded-lg bg-muted/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{proposal.settingName}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {proposal.approvalPercentage}% approved
                  </Badge>
                </div>
                <div className="relative">
                  <Progress value={proposal.approvalPercentage} className="h-1.5" />
                  <div
                    className="absolute top-0 h-1.5 w-0.5 bg-primary"
                    style={{ left: `${DEMOCRATIC_SETTINGS_CONFIG.APPROVAL_THRESHOLD}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {proposal.currentValue} → {proposal.proposedValue}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Active Member Overrides */}
      {activeOverrides.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Member Overrides Active
              <Badge className="ml-auto text-xs bg-blue-500 text-white">
                {activeOverrides.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 space-y-2">
            {activeOverrides.map((override) => (
              <div
                key={override.recommendationId}
                className="p-2 rounded-lg bg-blue-100/50 dark:bg-blue-900/30 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{override.settingName}</span>
                  <Badge className="text-[10px] bg-blue-500 text-white">
                    {override.supportPercentage}% support
                  </Badge>
                </div>
                <p className="text-[10px] text-blue-700 dark:text-blue-300">
                  Member-set value: <strong>{override.recommendedValue}</strong>
                </p>
                <p className="text-[10px] text-muted-foreground">
                  This value overrides admin settings until changed by member vote
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Settings Overview by Category */}
      <Card>
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
            All Community Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <Accordion type="single" collapsible className="w-full space-y-1">
            {Object.entries(settingsByCategory).map(([category, settings]) => (
              <AccordionItem key={category} value={category} className="border rounded-md px-2">
                <AccordionTrigger className="text-xs py-2">
                  <div className="flex items-center gap-2">
                    <span>
                      {SETTING_CATEGORY_LABELS[category as keyof typeof SETTING_CATEGORY_LABELS]}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1.5">
                      {settings.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-1.5">
                  {settings.map((setting) => (
                    <div
                      key={setting.settingKey}
                      className="flex items-center justify-between p-1.5 rounded bg-muted/30"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium truncate">{setting.settingName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {setting.currentValue}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {setting.hasPendingChange && (
                          <Badge variant="secondary" className="text-[9px] px-1 bg-amber-100 text-amber-700">
                            <Clock className="h-2 w-2 mr-0.5" />
                            Pending
                          </Badge>
                        )}
                        {setting.approvalPercentage >= DEMOCRATIC_SETTINGS_CONFIG.APPROVAL_THRESHOLD ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <span className="text-[9px] text-muted-foreground">
                            {setting.approvalPercentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* View Member Votes Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full h-10 text-sm"
        onClick={onViewMemberVotes}
      >
        <Vote className="h-4 w-4 mr-2" />
        View Member Voting Activity
      </Button>

      {/* Info Card */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground">
              Any setting changes you make will be submitted for member approval. The change will
              only take effect once {DEMOCRATIC_SETTINGS_CONFIG.APPROVAL_THRESHOLD}% of valid
              members approve it. Members can also recommend alternative values.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
