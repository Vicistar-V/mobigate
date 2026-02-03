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
    className="flex flex-col items-center p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors w-[72px] shrink-0"
  >
    <Avatar className="h-10 w-10 mb-1.5">
      <AvatarImage src={member.avatar} alt={member.name} />
      <AvatarFallback className="text-xs">
        {member.name.split(' ').map(n => n[0]).join('')}
      </AvatarFallback>
    </Avatar>
    <p className="font-medium text-xs text-center truncate w-full leading-tight">{member.name.split(' ')[0]}</p>
    <p className="text-[11px] text-muted-foreground text-center truncate w-full leading-tight">{member.position.split(' ')[0]}...</p>
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

      <Accordion type="single" collapsible className="w-full max-w-full">
        <AccordionItem value="leadership" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 hover:no-underline max-w-full">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-indigo-500/10 shrink-0">
                <Crown className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="text-left min-w-0">
                <h3 className="font-semibold text-base truncate">Leadership</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {executives.length} executives • 3 ad-hoc
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4 w-full max-w-full overflow-hidden">
              {/* Current Executive Carousel */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-sm flex items-center justify-between">
                    Current Executive
                    <Button variant="ghost" size="sm" className="h-8 text-sm px-2" onClick={onManageLeadership}>
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <ScrollArea className="w-full touch-auto">
                    <div className="flex gap-3 pb-2">
                      {executives.slice(0, 6).map((member) => (
                        <ExecutiveCard
                          key={member.id}
                          member={member}
                          onClick={onViewExecutive}
                        />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Action Buttons - Full width stacked */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-9 text-xs px-2" onClick={onManageLeadership}>
                  <Crown className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                  Manage
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="h-9 text-xs px-2" 
                  onClick={handleApplyResultsWithAuth}
                >
                  <Trophy className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                  Apply
                </Button>
                <Button variant="outline" size="sm" className="h-9 text-xs px-2" onClick={onViewChangeHistory}>
                  <History className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                  History
                </Button>
                <Button variant="outline" size="sm" className="h-9 text-xs px-2" onClick={handleAssignAdhocWithAuth}>
                  <Users className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                  Ad-hoc
                </Button>
              </div>

              {/* Quick Stats - 2 columns for mobile */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                  <span className="text-xs text-muted-foreground">Executives</span>
                  <span className="text-sm font-bold">{executives.length}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                  <span className="text-xs text-muted-foreground">Committees</span>
                  <span className="text-sm font-bold">3</span>
                </div>
              </div>

              {/* Authorization Info */}
              <div className="flex items-start gap-2 p-2.5 bg-muted/50 rounded-lg">
                <Shield className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground leading-relaxed">
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