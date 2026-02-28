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
  <div className="py-3 space-y-1.5">
    {/* Row 1: Avatar + Name + Time */}
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9 shrink-0">
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
    {/* Row 2: Action buttons inline */}
    <div className="flex items-center gap-3 pl-12 text-xs">
      <button
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        onClick={() => onView(request.id)}
      >
        <Eye className="h-3.5 w-3.5" />
        View
      </button>
      <button
        className="flex items-center gap-1 text-green-600 hover:text-green-700"
        onClick={() => onApprove(request.id)}
      >
        <Check className="h-3.5 w-3.5" />
        Approve
      </button>
      <button
        className="flex items-center gap-1 text-red-500 hover:text-red-600"
        onClick={() => onReject(request.id)}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  </div>
);

interface StatBadgeProps {
  value: number;
  label: string;
}

const StatBadge = ({ value, label }: StatBadgeProps) => (
  <div className="flex flex-col items-center justify-center py-2">
    <span className="text-base font-bold leading-none">{value.toLocaleString()}</span>
    <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
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
                  {stats.totalMembers.toLocaleString()} members • {stats.pendingRequests} Pending
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <div className="space-y-3">
              {/* Stats - 3 column inline */}
              <div className="flex items-center justify-start gap-6 py-1">
                <StatBadge value={stats.totalMembers} label="Total" />
                <StatBadge value={stats.activeMembers} label="Active" />
                <StatBadge value={stats.pendingRequests} label="Pending" />
              </div>

              {/* Action Buttons - Stacked full width with icons */}
              <div className="flex flex-col gap-0 divide-y divide-border">
                <button 
                  className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded"
                  onClick={onViewAllMembers}
                >
                  <Users className="h-4 w-4 text-muted-foreground" />
                  View All Members
                </button>
                <button 
                  className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded"
                  onClick={onManageRequests}
                >
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                  Membership Requests
                </button>
                <button 
                  className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded"
                  onClick={onViewBlocked}
                >
                  <UserX className="h-4 w-4 text-muted-foreground" />
                  Blocked Users
                </button>
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
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Recent Requests</p>
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
                </div>
              )}

              {/* Authorization Info */}
              <div className="flex items-start gap-2 pt-2 border-t border-border/50">
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