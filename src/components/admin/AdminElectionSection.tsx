import { useState } from "react";
import { Vote, Users, CheckCircle, Clock, Trophy, FileText, Settings, ChevronRight, Shield, UserCheck, Coins } from "lucide-react";
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
  <div className="flex flex-col items-center p-1.5 rounded-lg bg-muted/50 min-w-0">
    <Icon className="h-3 w-3 text-muted-foreground mb-0.5" />
    <span className="text-sm font-bold">{value}</span>
    <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
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

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="election" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-green-500/10 shrink-0">
                <Vote className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left min-w-0">
                <h3 className="font-semibold text-base truncate">Elections</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {stats.activeElections} active • {stats.accreditedVoters} accredited
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3">
              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-1">
                <StatBadge value={stats.activeElections} label="Active" icon={Vote} />
                <StatBadge value={stats.accreditedVoters} label="Accred." icon={Users} />
                <StatBadge value={stats.clearedCandidates} label="Cleared" icon={CheckCircle} />
                <StatBadge value={3} label="Pending" icon={Clock} />
              </div>

              {/* Current Election Management */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-1.5 pt-2 px-3">
                  <CardTitle className="text-xs">Manage Election</CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3 pt-0">
                  <div className="grid grid-cols-2 gap-1.5">
                    <Button variant="outline" size="sm" className="h-9 text-xs justify-start" onClick={onViewCampaigns}>
                      <FileText className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                      <span className="truncate">Campaigns</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 text-xs justify-start" onClick={onViewResults}>
                      <Trophy className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                      <span className="truncate">Results</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 text-xs justify-start" onClick={onManageAccreditation}>
                      <Users className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                      <span className="truncate">Accredit.</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 text-xs justify-start" onClick={onProcessClearances}>
                      <CheckCircle className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                      <span className="truncate">Clear.</span>
                      <Badge variant="destructive" className="ml-auto text-[10px] px-1 shrink-0">3</Badge>
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 text-xs justify-start" 
                      onClick={() => setShowPrimaryManagement(true)}
                    >
                      <UserCheck className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                      <span className="truncate">Primaries</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 text-xs justify-start" 
                      onClick={() => setShowRoyaltySection(true)}
                    >
                      <Coins className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                      <span className="truncate">Royalties</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Election Settings */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-1.5 pt-2 px-3">
                  <CardTitle className="text-xs">Settings</CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3 pt-0">
                  <div className="grid grid-cols-2 gap-1.5">
                    <Button variant="outline" size="sm" className="h-9 text-xs justify-start" onClick={onConfigureVoting}>
                      <Settings className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                      <span className="truncate">Voting</span>
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="h-9 text-xs justify-start" 
                      onClick={handleAnnounceWithAuth}
                    >
                      <Trophy className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                      <span className="truncate">Announce</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Election Activity */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-1.5 pt-2 px-3">
                  <CardTitle className="text-xs flex items-center justify-between">
                    <span>Recent Activity</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs px-1.5">
                      All
                      <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3 pt-0">
                  <div className="divide-y divide-border">
                    {electionActivities.slice(0, 3).map((activity) => (
                      <ElectionActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Authorization Info */}
              <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                <Shield className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-[10px] text-muted-foreground leading-tight">
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
