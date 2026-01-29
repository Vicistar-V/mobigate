import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Settings, AlertCircle, Info, ChevronRight, Lightbulb } from "lucide-react";
import { AdminSettingProposalCard } from "./AdminSettingProposalCard";
import { ActiveSettingsList } from "./ActiveSettingsList";
import { MemberRecommendationsList } from "./MemberRecommendationsList";
import { RecommendAlternativeDialog } from "./RecommendAlternativeDialog";
import { RecommendNewSettingDialog } from "./RecommendNewSettingDialog";
import {
  mockAdminProposals,
  mockMemberRecommendations,
  mockSettingsStats,
  getSettingsByCategory,
} from "@/data/communityDemocraticSettingsData";
import { SETTING_CATEGORY_LABELS, DEMOCRATIC_SETTINGS_CONFIG, ActiveCommunitySetting } from "@/types/communityDemocraticSettings";

interface CommunitySettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommunitySettingsSheet({ open, onOpenChange }: CommunitySettingsSheetProps) {
  const isMobile = useIsMobile();
  const [recommendDialogOpen, setRecommendDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [recommendNewDialogOpen, setRecommendNewDialogOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<ActiveCommunitySetting | null>(null);

  const pendingProposals = mockAdminProposals.filter(
    (p) => p.status === "pending_approval" && p.memberVote === null
  );
  const settingsByCategory = getSettingsByCategory();
  const activeRecommendations = mockMemberRecommendations.filter((r) => r.isActive);

  const handleRecommendAlternative = (proposalId: string) => {
    setSelectedProposal(proposalId);
    setRecommendDialogOpen(true);
  };

  const handleRecommendNewSetting = (setting: ActiveCommunitySetting) => {
    setSelectedSetting(setting);
    setRecommendNewDialogOpen(true);
  };

  const handleVote = (proposalId: string, vote: "approve" | "disapprove") => {
    console.log(`Voted ${vote} on proposal ${proposalId}`);
  };

  const handleSupportRecommendation = (recommendationId: string) => {
    console.log(`Toggled support for recommendation ${recommendationId}`);
  };

  const SheetContentComponent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header - Stacked for mobile clarity */}
      <div className="px-4 py-4 border-b flex-shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold break-words">Community Settings</h2>
              <p className="text-sm text-muted-foreground">
                Vote on all community settings
              </p>
            </div>
          </div>
          {pendingProposals.length > 0 && (
            <Badge variant="destructive" className="px-2.5 py-1 text-sm shrink-0">
              {pendingProposals.length} Pending
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 touch-auto">
        <div className="p-4 space-y-4">
          {/* Pending Admin Changes Section */}
          {pendingProposals.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <h3 className="font-semibold text-sm">
                  Pending Admin Changes ({pendingProposals.length})
                </h3>
              </div>
              <div className="space-y-3">
                {pendingProposals.map((proposal) => (
                  <AdminSettingProposalCard
                    key={proposal.proposalId}
                    proposal={proposal}
                    onVote={handleVote}
                    onRecommend={handleRecommendAlternative}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active Settings by Category */}
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem
              value="active-settings"
              className="border rounded-lg px-3 data-[state=open]:bg-muted/30"
            >
              <AccordionTrigger className="text-sm font-semibold py-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Active Settings
                  <Badge variant="secondary" className="ml-auto mr-2 text-xs">
                    {mockSettingsStats.totalSettings}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <Accordion type="single" collapsible className="w-full space-y-1">
                  {Object.entries(settingsByCategory).map(([category, settings]) => (
                    <AccordionItem
                      key={category}
                      value={category}
                      className="border rounded-md px-2"
                    >
                      <AccordionTrigger className="text-xs py-2">
                        <div className="flex items-center gap-2">
                          <span>
                            {SETTING_CATEGORY_LABELS[category as keyof typeof SETTING_CATEGORY_LABELS] ||
                              category}
                          </span>
                          <Badge variant="outline" className="text-[10px] px-1.5">
                            {settings.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-2">
                        <ActiveSettingsList 
                          settings={settings} 
                          onRecommendSetting={handleRecommendNewSetting}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>

            {/* Member Recommendations Section */}
            {activeRecommendations.length > 0 && (
              <AccordionItem
                value="recommendations"
                className="border rounded-lg px-3 data-[state=open]:bg-muted/30 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800"
              >
                <AccordionTrigger className="text-sm font-semibold py-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                    <span>Member Recommendations</span>
                    <Badge
                      variant="secondary"
                      className="ml-auto mr-2 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    >
                      {activeRecommendations.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <MemberRecommendationsList
                    recommendations={activeRecommendations}
                    onSupport={handleSupportRecommendation}
                  />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          {/* How Settings Work Info Card */}
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-1.5">
                  <p className="text-xs font-medium">How Democratic Settings Work</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-1">
                      <ChevronRight className="h-3 w-3" />
                      <span>
                        <strong>{DEMOCRATIC_SETTINGS_CONFIG.APPROVAL_THRESHOLD}%</strong> member
                        approval required for changes
                      </span>
                    </li>
                    <li className="flex items-center gap-1">
                      <ChevronRight className="h-3 w-3" />
                      <span>Members can disapprove & recommend alternatives</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <ChevronRight className="h-3 w-3" />
                      <span>
                        Recommendations with{" "}
                        <strong>{DEMOCRATIC_SETTINGS_CONFIG.RECOMMENDATION_THRESHOLD}%</strong>{" "}
                        support override admin settings
                      </span>
                    </li>
                    <li className="flex items-center gap-1">
                      <ChevronRight className="h-3 w-3" />
                      <span>Admins cannot change settings without member approval</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xl font-bold">{mockSettingsStats.totalSettings}</p>
              <p className="text-xs text-muted-foreground">Total Settings</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30">
              <p className="text-xl font-bold text-amber-600">{mockSettingsStats.pendingApprovals}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <p className="text-xl font-bold text-blue-600">
                {mockSettingsStats.memberRecommendations}
              </p>
              <p className="text-xs text-muted-foreground whitespace-nowrap">Recommend</p>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Recommend Alternative Dialog (for pending proposals) */}
      <RecommendAlternativeDialog
        open={recommendDialogOpen}
        onOpenChange={setRecommendDialogOpen}
        proposalId={selectedProposal}
      />

      {/* Recommend New Setting Dialog (for active settings) */}
      <RecommendNewSettingDialog
        open={recommendNewDialogOpen}
        onOpenChange={setRecommendNewDialogOpen}
        setting={selectedSetting}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[92vh] overflow-hidden touch-auto">
          <SheetContentComponent />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 overflow-hidden">
        <SheetContentComponent />
      </SheetContent>
    </Sheet>
  );
}
