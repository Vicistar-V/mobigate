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
  <div className="flex items-center gap-3 py-3">
    <Avatar className="h-10 w-10 shrink-0">
      <AvatarImage src={request.avatar} alt={request.name} />
      <AvatarFallback className="text-sm">{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm truncate">{request.name}</p>
      <p className="text-sm text-muted-foreground">
        {formatRelativeTime(request.requestDate)}
      </p>
    </div>
    <div className="flex items-center gap-1 shrink-0">
      <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9"
        onClick={() => onView(request.id)}
      >
        <Eye className="h-4 w-4 text-muted-foreground" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={() => onApprove(request.id)}
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => onReject(request.id)}
      >
        <X className="h-4 w-4" />
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

      <Accordion type="single" collapsible className="w-full max-w-full">
        <AccordionItem value="membership" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 hover:no-underline max-w-full">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left min-w-0">
                <h3 className="font-semibold text-base truncate">Membership</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {stats.totalMembers.toLocaleString()} members • {stats.pendingRequests} pending
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4 w-full max-w-full overflow-hidden">
              {/* Stats Row - 2 columns for mobile */}
              <div className="grid grid-cols-2 gap-2 w-full">
                <StatBadge value={stats.totalMembers} label="Total" />
                <StatBadge value={stats.activeMembers} label="Active" />
                <StatBadge value={stats.pendingRequests} label="Pending" />
                <StatBadge value={stats.blockedUsers} label="Blocked" />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onViewAllMembers}>
                  <Users className="h-4 w-4 mr-2" />
                  View All
                </Button>
                <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onManageRequests}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Requests
                  {stats.pendingRequests > 0 && (
                    <Badge variant="destructive" className="ml-2 text-xs px-1.5">
                      {stats.pendingRequests}
                    </Badge>
                  )}
                </Button>
              </div>

              <Button variant="outline" size="sm" className="w-full h-10 text-sm" onClick={onViewBlocked}>
                <UserX className="h-4 w-4 mr-2" />
                Blocked Users
                {stats.blockedUsers > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs px-1.5">
                    {stats.blockedUsers}
                  </Badge>
                )}
              </Button>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>

              {/* Recent Requests */}
              {recentRequests.length > 0 && (
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-sm flex items-center justify-between">
                      Recent Requests
                      <Button variant="ghost" size="sm" className="h-8 text-sm px-2" onClick={onManageRequests}>
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="divide-y divide-border">
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
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Member actions require President + (Secretary OR PRO) authorization
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}