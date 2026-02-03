import { useState } from "react";
import { Users, UserPlus, UserX, Search, Check, X, ChevronRight, Eye, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdminStats, RecentMemberRequest, formatRelativeTime } from "@/data/adminDashboardData";
import { useToast } from "@/hooks/use-toast";
import { ModuleAuthorizationDrawer } from "./authorization/ModuleAuthorizationDrawer";
import { getActionConfig, renderActionDetails } from "./authorization/authorizationActionConfigs";

interface MemberRequestItemProps {
  request: RecentMemberRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (id: string) => void;
}

const MemberRequestItem = ({ request, onApprove, onReject, onView }: MemberRequestItemProps) => (
  <div className="py-2.5 space-y-2">
    {/* Top row: Avatar + Name + Time */}
    <div className="flex items-center gap-2.5">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={request.avatar} alt={request.name} />
        <AvatarFallback className="text-xs">{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{request.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatRelativeTime(request.requestDate)}
        </p>
      </div>
    </div>
    {/* Bottom row: Action buttons full width */}
    <div className="flex items-center gap-1.5 pl-12">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 flex-1 text-xs"
        onClick={() => onView(request.id)}
      >
        <Eye className="h-3.5 w-3.5 mr-1.5" />
        View
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 flex-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={() => onApprove(request.id)}
      >
        <Check className="h-3.5 w-3.5 mr-1.5" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 flex-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => onReject(request.id)}
      >
        <X className="h-3.5 w-3.5 mr-1.5" />
        Reject
      </Button>
    </div>
  </div>
);

interface StatBadgeProps {
  value: number;
  label: string;
}

const StatBadge = ({ value, label }: StatBadgeProps) => (
  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-bold">{value.toLocaleString()}</span>
  </div>
);

// Action types for membership module
type MemberActionType = "approve_member" | "reject_member" | "block_member" | "unblock_member" | "remove_member";

interface AdminMembershipSectionProps {
  stats: AdminStats;
  recentRequests: RecentMemberRequest[];
  onViewAllMembers: () => void;
  onManageRequests: () => void;
  onViewBlocked: () => void;
}

export function AdminMembershipSection({
  stats,
  recentRequests,
  onViewAllMembers,
  onManageRequests,
  onViewBlocked,
}: AdminMembershipSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Authorization state
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [authAction, setAuthAction] = useState<{
    type: MemberActionType;
    memberId: string;
    memberName: string;
    memberAvatar?: string;
  } | null>(null);

  const handleApprove = (id: string) => {
    const member = recentRequests.find(r => r.id === id);
    setAuthAction({
      type: "approve_member",
      memberId: id,
      memberName: member?.name || "Member",
      memberAvatar: member?.avatar,
    });
    setAuthDrawerOpen(true);
  };

  const handleReject = (id: string) => {
    const member = recentRequests.find(r => r.id === id);
    setAuthAction({
      type: "reject_member",
      memberId: id,
      memberName: member?.name || "Member",
      memberAvatar: member?.avatar,
    });
    setAuthDrawerOpen(true);
  };

  const handleView = (id: string) => {
    toast({
      title: "View Application",
      description: "Opening application details...",
    });
  };

  const handleAuthorizationComplete = () => {
    if (authAction) {
      const config = getActionConfig("members", authAction.type);
      toast({
        title: config?.title || "Action Complete",
        description: `${authAction.memberName}'s request has been processed successfully.`,
      });
    }
    setAuthAction(null);
  };

  // Get action config and render details using centralized templates
  const actionConfig = authAction ? getActionConfig("members", authAction.type) : null;
  
  const getAuthActionDetails = () => {
    if (!authAction || !actionConfig) return null;
    
    return renderActionDetails({
      config: actionConfig,
      primaryText: authAction.memberName,
      secondaryText: "Membership Request",
      module: "members",
      avatar: {
        src: authAction.memberAvatar,
        fallback: authAction.memberName.charAt(0),
      },
    });
  };

  return (
    <>
      {/* Authorization Drawer - Now using centralized config */}
      <ModuleAuthorizationDrawer
        open={authDrawerOpen}
        onOpenChange={setAuthDrawerOpen}
        module="members"
        actionTitle={actionConfig?.title || "Member Action"}
        actionDescription={actionConfig?.description || "Multi-signature authorization required for membership actions"}
        actionDetails={getAuthActionDetails()}
        initiatorRole="secretary"
        onAuthorized={handleAuthorizationComplete}
      />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="membership" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-3 hover:no-underline">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="p-1.5 rounded-lg bg-blue-500/10 shrink-0">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <h3 className="font-semibold text-sm">Membership</h3>
                <p className="text-xs text-muted-foreground">
                  {stats.totalMembers.toLocaleString()} members • {stats.pendingRequests} pending
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-2.5 pb-2.5">
            <div className="space-y-2.5">
              {/* Stats Row - 2x2 grid */}
              <div className="grid grid-cols-2 gap-1.5">
                <StatBadge value={stats.totalMembers} label="Total" />
                <StatBadge value={stats.activeMembers} label="Active" />
                <StatBadge value={stats.pendingRequests} label="Pending" />
                <StatBadge value={stats.blockedUsers} label="Blocked" />
              </div>

              {/* Action Buttons - Stacked full width */}
              <div className="flex flex-col gap-1.5">
                <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-start" onClick={onViewAllMembers}>
                  <Users className="h-3.5 w-3.5 mr-2 shrink-0" />
                  View All Members
                </Button>
                <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-between" onClick={onManageRequests}>
                  <span className="flex items-center">
                    <UserPlus className="h-3.5 w-3.5 mr-2 shrink-0" />
                    Membership Requests
                  </span>
                  {stats.pendingRequests > 0 && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 h-4 ml-2">
                      {stats.pendingRequests}
                    </Badge>
                  )}
                </Button>
                <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-between" onClick={onViewBlocked}>
                  <span className="flex items-center">
                    <UserX className="h-3.5 w-3.5 mr-2 shrink-0" />
                    Blocked Users
                  </span>
                  {stats.blockedUsers > 0 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 h-4 ml-2">
                      {stats.blockedUsers}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 text-sm"
                />
              </div>

              {/* Recent Requests */}
              {recentRequests.length > 0 && (
                <Card className="border-0 shadow-none bg-muted/30">
                  <CardHeader className="p-2.5 pb-1">
                    <CardTitle className="text-xs flex items-center justify-between">
                      <span>Recent Requests</span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs px-1.5 -mr-1" onClick={onManageRequests}>
                        View All
                        <ChevronRight className="h-3 w-3 ml-0.5" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2.5 pt-0">
                    <div className="divide-y divide-border/50">
                      {recentRequests.slice(0, 3).map((request) => (
                        <MemberRequestItem
                          key={request.id}
                          request={request}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          onView={handleView}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Authorization Info */}
              <div className="flex items-start gap-2 p-2 bg-muted/30 rounded-md">
                <Shield className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground leading-snug">
                  Member actions require President + (Secretary or PRO) authorization
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}