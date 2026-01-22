import { useState } from "react";
import { Users, UserPlus, UserX, Search, Check, X, ChevronRight, Eye } from "lucide-react";
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

interface MemberRequestItemProps {
  request: RecentMemberRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (id: string) => void;
}

const MemberRequestItem = ({ request, onApprove, onReject, onView }: MemberRequestItemProps) => (
  <div className="flex items-center gap-2 py-2.5">
    <Avatar className="h-8 w-8 shrink-0">
      <AvatarImage src={request.avatar} alt={request.name} />
      <AvatarFallback className="text-xs">{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm truncate">{request.name}</p>
      <p className="text-[10px] text-muted-foreground">
        {formatRelativeTime(request.requestDate)}
      </p>
    </div>
    <div className="flex items-center gap-0.5 shrink-0">
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7"
        onClick={() => onView(request.id)}
      >
        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={() => onApprove(request.id)}
      >
        <Check className="h-3.5 w-3.5" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => onReject(request.id)}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  </div>
);

interface StatBadgeProps {
  value: number;
  label: string;
}

const StatBadge = ({ value, label }: StatBadgeProps) => (
  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 min-w-0">
    <span className="text-base sm:text-lg font-bold">{value.toLocaleString()}</span>
    <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate">{label}</span>
  </div>
);

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

  const handleApprove = (id: string) => {
    toast({
      title: "Member Approved",
      description: "The membership request has been approved.",
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: "Request Rejected",
      description: "The membership request has been rejected.",
    });
  };

  const handleView = (id: string) => {
    toast({
      title: "View Application",
      description: "Opening application details...",
    });
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="membership" className="border rounded-lg overflow-hidden">
        <AccordionTrigger className="px-3 hover:no-underline">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10 shrink-0">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-left min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">Membership</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {stats.totalMembers.toLocaleString()} members • {stats.pendingRequests} pending
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <div className="space-y-3 w-full overflow-hidden">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-1.5 w-full">
              <StatBadge value={stats.totalMembers} label="Total" />
              <StatBadge value={stats.activeMembers} label="Active" />
              <StatBadge value={stats.pendingRequests} label="Pending" />
              <StatBadge value={stats.blockedUsers} label="Blocked" />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="h-9 text-xs" onClick={onViewAllMembers}>
                <Users className="h-3.5 w-3.5 mr-1.5" />
                View All
              </Button>
              <Button variant="outline" size="sm" className="h-9 text-xs" onClick={onManageRequests}>
                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                Requests
                {stats.pendingRequests > 0 && (
                  <Badge variant="destructive" className="ml-1.5 text-[9px] px-1">
                    {stats.pendingRequests}
                  </Badge>
                )}
              </Button>
            </div>

            <Button variant="outline" size="sm" className="w-full h-9 text-xs" onClick={onViewBlocked}>
              <UserX className="h-3.5 w-3.5 mr-1.5" />
              Blocked Users
              {stats.blockedUsers > 0 && (
                <Badge variant="secondary" className="ml-1.5 text-[9px] px-1">
                  {stats.blockedUsers}
                </Badge>
              )}
            </Button>

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
              <Card className="overflow-hidden">
                <CardHeader className="pb-1.5 pt-2.5 px-2.5">
                  <CardTitle className="text-xs flex items-center justify-between">
                    Recent Requests
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={onManageRequests}>
                      View All
                      <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2.5 pb-2.5 pt-0">
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
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
