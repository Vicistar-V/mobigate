import { useState } from "react";
import { Crown, Users, History, Trophy, ChevronRight, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ModuleAuthorizationDrawer } from "./authorization/ModuleAuthorizationDrawer";
import { getActionConfig, renderActionDetails } from "./authorization/authorizationActionConfigs";
import { useToast } from "@/hooks/use-toast";

interface ExecutiveMember {
  id: string;
  name: string;
  position: string;
  avatar: string;
}

interface ExecutiveCardProps {
  member: ExecutiveMember;
  onClick: (id: string) => void;
}

const ExecutiveCard = ({ member, onClick }: ExecutiveCardProps) => (
  <button
    onClick={() => onClick(member.id)}
    className="flex flex-col items-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors w-20 shrink-0"
  >
    <Avatar className="h-11 w-11 mb-2">
      <AvatarImage src={member.avatar} alt={member.name} />
      <AvatarFallback className="text-xs">
        {member.name.split(' ').map(n => n[0]).join('')}
      </AvatarFallback>
    </Avatar>
    <p className="font-medium text-xs text-center truncate w-full">{member.name.split(' ')[0]}</p>
    <p className="text-xs text-muted-foreground text-center truncate w-full">{member.position.split(' ')[0]}</p>
  </button>
);

// Action types for leadership module
type LeadershipActionType = "apply_results" | "add_executive" | "remove_executive" | "assign_adhoc";

interface AdminLeadershipSectionProps {
  executives: ExecutiveMember[];
  onManageLeadership: () => void;
  onApplyElectionResults: () => void;
  onViewChangeHistory: () => void;
  onManageAdhoc: () => void;
  onViewExecutive: (id: string) => void;
}

export function AdminLeadershipSection({
  executives,
  onManageLeadership,
  onApplyElectionResults,
  onViewChangeHistory,
  onManageAdhoc,
  onViewExecutive,
}: AdminLeadershipSectionProps) {
  const { toast } = useToast();

  // Authorization state
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [authAction, setAuthAction] = useState<{
    type: LeadershipActionType;
    details: string;
  } | null>(null);

  const handleApplyResultsWithAuth = () => {
    setAuthAction({
      type: "apply_results",
      details: "2025 Election Results",
    });
    setAuthDrawerOpen(true);
  };

  const handleAddExecutiveWithAuth = () => {
    setAuthAction({
      type: "add_executive",
      details: "New Executive Member",
    });
    setAuthDrawerOpen(true);
  };

  const handleAssignAdhocWithAuth = () => {
    setAuthAction({
      type: "assign_adhoc",
      details: "Ad-hoc Committee Assignment",
    });
    setAuthDrawerOpen(true);
  };

  const handleAuthorizationComplete = () => {
    if (authAction) {
      const config = getActionConfig("leadership", authAction.type);
      toast({
        title: config?.title || "Leadership Action Authorized",
        description: `${authAction.details} has been authorized successfully.`,
      });
      if (authAction.type === "apply_results") {
        onApplyElectionResults();
      }
    }
    setAuthAction(null);
  };

  // Get action config using centralized templates
  const actionConfig = authAction ? getActionConfig("leadership", authAction.type) : null;

  const getAuthActionDetails = () => {
    if (!authAction || !actionConfig) return null;
    
    return renderActionDetails({
      config: actionConfig,
      primaryText: authAction.details,
      secondaryText: "Leadership Action",
      module: "leadership",
    });
  };

  return (
    <>
      {/* Authorization Drawer - Now using centralized config */}
      <ModuleAuthorizationDrawer
        open={authDrawerOpen}
        onOpenChange={setAuthDrawerOpen}
        module="leadership"
        actionTitle={actionConfig?.title || "Leadership Action"}
        actionDescription={actionConfig?.description || "Multi-signature authorization required for leadership changes"}
        actionDetails={getAuthActionDetails()}
        initiatorRole="secretary"
        onAuthorized={handleAuthorizationComplete}
      />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="leadership" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-3 hover:no-underline">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 shrink-0">
                <Crown className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <h3 className="font-semibold text-sm">Leadership</h3>
                <p className="text-xs text-muted-foreground">
                  {executives.length} executives • 3 ad-hoc
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <div className="space-y-3">
              {/* Stats - inline row */}
              <div className="flex items-center justify-start gap-6 py-1">
                <div className="flex flex-col items-center justify-center py-2">
                  <span className="text-base font-bold leading-none">{executives.length}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">Executives</span>
                </div>
                <div className="flex flex-col items-center justify-center py-2">
                  <span className="text-base font-bold leading-none">3</span>
                  <span className="text-xs text-muted-foreground mt-0.5">Committees</span>
                </div>
              </div>

              {/* Current Executive Carousel */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Current Executive</p>
                <div className="overflow-x-auto touch-pan-x -mx-3 px-3">
                  <div className="flex gap-2.5 pb-2">
                    {executives.slice(0, 6).map((member) => (
                      <ExecutiveCard
                        key={member.id}
                        member={member}
                        onClick={onViewExecutive}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons - list style with dividers */}
              <div className="flex flex-col gap-0 divide-y divide-border">
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onManageLeadership}>
                  <Crown className="h-4 w-4 text-muted-foreground" />
                  Manage Leadership
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm font-medium text-primary hover:bg-muted/50 -mx-1 px-1 rounded" onClick={handleApplyResultsWithAuth}>
                  <Trophy className="h-4 w-4 text-primary" />
                  Apply Election Results
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onViewChangeHistory}>
                  <History className="h-4 w-4 text-muted-foreground" />
                  View Change History
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={handleAssignAdhocWithAuth}>
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Manage Ad-hoc Committees
                </button>
              </div>

              {/* Authorization Info */}
              <div className="flex items-start gap-2 pt-2 border-t border-border/50">
                <Shield className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground leading-snug">
                  Leadership changes require President + Secretary + (PRO or Dir. Socials)
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}