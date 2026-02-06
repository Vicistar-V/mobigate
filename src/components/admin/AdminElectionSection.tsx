import { useState } from "react";
import { Vote, Users, CheckCircle, Clock, Trophy, FileText, Settings, ChevronRight, Shield, UserCheck, Coins, Sliders } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminStats, ElectionActivity, formatRelativeTime } from "@/data/adminDashboardData";
import { ModuleAuthorizationDrawer } from "./authorization/ModuleAuthorizationDrawer";
import { getActionConfig, renderActionDetails } from "./authorization/authorizationActionConfigs";
import { AdminPrimaryManagementSheet } from "./election/AdminPrimaryManagementSheet";
import { CampaignRoyaltySection } from "./election/CampaignRoyaltySection";
import { CampaignGlobalSettingsDrawer } from "./election/CampaignGlobalSettingsDrawer";
import { useToast } from "@/hooks/use-toast";

interface ElectionActivityItemProps {
  activity: ElectionActivity;
}

const ElectionActivityItem = ({ activity }: ElectionActivityItemProps) => (
  <div className="flex items-start gap-2 py-2.5">
    <div className="p-1.5 rounded-lg bg-green-500/10 shrink-0">
      <Vote className="h-3.5 w-3.5 text-green-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-xs line-clamp-1">{activity.action}</p>
      {activity.candidate && (
        <p className="text-xs text-muted-foreground line-clamp-1">
          {activity.candidate}
          {activity.position && ` • ${activity.position}`}
        </p>
      )}
    </div>
    <span className="text-[10px] text-muted-foreground shrink-0">
      {formatRelativeTime(activity.timestamp)}
    </span>
  </div>
);

interface StatBadgeProps {
  value: number;
  label: string;
  icon: React.ElementType;
}

const StatBadge = ({ value, label, icon: Icon }: StatBadgeProps) => (
  <div className="flex flex-col items-center justify-center py-2">
    <span className="text-base font-bold leading-none">{value}</span>
    <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
  </div>
);

// Action types for elections module
type ElectionActionType = "announce_results" | "clear_candidate" | "disqualify_candidate" | "start_voting" | "end_voting";

interface AdminElectionSectionProps {
  stats: AdminStats;
  electionActivities: ElectionActivity[];
  onViewCampaigns: () => void;
  onViewResults: () => void;
  onManageAccreditation: () => void;
  onProcessClearances: () => void;
  onConfigureVoting: () => void;
  onAnnounceWinners: () => void;
}

export function AdminElectionSection({
  stats,
  electionActivities,
  onViewCampaigns,
  onViewResults,
  onManageAccreditation,
  onProcessClearances,
  onConfigureVoting,
  onAnnounceWinners,
}: AdminElectionSectionProps) {
  const { toast } = useToast();
  
  // Authorization state
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [authAction, setAuthAction] = useState<{
    type: ElectionActionType;
    details: string;
  } | null>(null);
  
  // Primary management state
  const [showPrimaryManagement, setShowPrimaryManagement] = useState(false);
  const [showRoyaltySection, setShowRoyaltySection] = useState(false);
  const [showCampaignSettings, setShowCampaignSettings] = useState(false);

  const handleAnnounceWithAuth = () => {
    setAuthAction({
      type: "announce_results",
      details: "2025 Community Elections",
    });
    setAuthDrawerOpen(true);
  };

  const handleStartVotingWithAuth = () => {
    setAuthAction({
      type: "start_voting",
      details: "Open Voting Session",
    });
    setAuthDrawerOpen(true);
  };

  const handleEndVotingWithAuth = () => {
    setAuthAction({
      type: "end_voting",
      details: "Close Voting Session",
    });
    setAuthDrawerOpen(true);
  };

  const handleAuthorizationComplete = () => {
    if (authAction) {
      const config = getActionConfig("elections", authAction.type);
      toast({
        title: config?.title || "Action Authorized",
        description: `${authAction.details} has been authorized successfully.`,
      });
      if (authAction.type === "announce_results") {
        onAnnounceWinners();
      }
    }
    setAuthAction(null);
  };

  // Get action config using centralized templates
  const actionConfig = authAction ? getActionConfig("elections", authAction.type) : null;

  const getAuthActionDetails = () => {
    if (!authAction || !actionConfig) return null;
    
    return renderActionDetails({
      config: actionConfig,
      primaryText: authAction.details,
      secondaryText: "Election Action",
      module: "elections",
    });
  };

  return (
    <>
      {/* Authorization Drawer - Now using centralized config */}
      <ModuleAuthorizationDrawer
        open={authDrawerOpen}
        onOpenChange={setAuthDrawerOpen}
        module="elections"
        actionTitle={actionConfig?.title || "Election Action"}
        actionDescription={actionConfig?.description || "Multi-signature authorization required for election management"}
        actionDetails={getAuthActionDetails()}
        initiatorRole="secretary"
        onAuthorized={handleAuthorizationComplete}
      />

      {/* Primary Election Management Sheet */}
      <AdminPrimaryManagementSheet
        open={showPrimaryManagement}
        onOpenChange={setShowPrimaryManagement}
      />

      {/* Campaign Royalties Sheet */}
      <Sheet open={showRoyaltySection} onOpenChange={setShowRoyaltySection}>
        <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl">
          <SheetHeader className="pb-2">
            <SheetTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              Campaign Royalties
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100%-60px)] mt-4">
            <div className="pr-2 pb-6">
              <CampaignRoyaltySection />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Campaign Settings Drawer */}
      <CampaignGlobalSettingsDrawer
        open={showCampaignSettings}
        onOpenChange={setShowCampaignSettings}
      />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="election" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-3 hover:no-underline">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="p-1.5 rounded-lg bg-green-500/10 shrink-0">
                <Vote className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <h3 className="font-semibold text-sm">Elections</h3>
                <p className="text-xs text-muted-foreground">
                  {stats.activeElections} active • {stats.accreditedVoters} accredited
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <div className="space-y-3">
              {/* Stats - inline row */}
              <div className="flex items-center justify-start gap-5 py-1">
                <StatBadge value={stats.activeElections} label="Active" icon={Vote} />
                <StatBadge value={stats.accreditedVoters} label="Accredited" icon={Users} />
                <StatBadge value={stats.clearedCandidates} label="Cleared" icon={CheckCircle} />
                <StatBadge value={3} label="Pending" icon={Clock} />
              </div>

              {/* Action Buttons - list style with dividers */}
              <div className="flex flex-col gap-0 divide-y divide-border">
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onViewCampaigns}>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  View Campaigns
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onViewResults}>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  View Results
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onManageAccreditation}>
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Manage Accreditation
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onProcessClearances}>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  Process Clearances
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={() => setShowPrimaryManagement(true)}>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  Manage Primaries
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={() => setShowRoyaltySection(true)}>
                  <Coins className="h-4 w-4 text-muted-foreground" />
                  Campaign Royalties
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onConfigureVoting}>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Voting Settings
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={() => setShowCampaignSettings(true)}>
                  <Sliders className="h-4 w-4 text-muted-foreground" />
                  Campaign Settings
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm font-medium text-primary hover:bg-muted/50 -mx-1 px-1 rounded" onClick={handleAnnounceWithAuth}>
                  <Trophy className="h-4 w-4 text-primary" />
                  Announce Winners
                </button>
              </div>

              {/* Recent Election Activity */}
              {electionActivities.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Recent Activity</p>
                  <div className="divide-y divide-border/50">
                    {electionActivities.slice(0, 3).map((activity) => (
                      <ElectionActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                </div>
              )}

              {/* Authorization Info */}
              <div className="flex items-start gap-2 pt-2 border-t border-border/50">
                <Shield className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground leading-snug">
                  Elections require President + Secretary + (PRO or Dir. Socials)
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
