import { Users, Clock, Vote, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminStats } from "@/data/adminDashboardData";
import { AdminRoleBadge } from "@/components/community/AdminRoleBadge";

interface StatCardProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  trend?: number;
  urgent?: boolean;
  prefix?: string;
  onClick?: () => void;
}

const StatCard = ({ icon: Icon, value, label, trend, urgent, prefix, onClick }: StatCardProps) => (
  <Card 
    className={`${urgent ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20' : ''} ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
    onClick={onClick}
  >
    <CardContent className="p-3">
      <div className="flex items-start justify-between gap-1">
        <div className={`p-1.5 rounded-lg ${urgent ? 'bg-amber-500/20' : 'bg-primary/10'} shrink-0`}>
          <Icon className={`h-4 w-4 ${urgent ? 'text-amber-600' : 'text-primary'}`} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{trend >= 0 ? '+' : ''}{trend}</span>
          </div>
        )}
        {urgent && !trend && (
          <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 shrink-0">
            Urgent
          </Badge>
        )}
      </div>
      <div className="mt-1.5">
        <p className="text-lg font-bold leading-tight truncate">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-xs text-muted-foreground truncate">{label}</p>
      </div>
    </CardContent>
  </Card>
);

interface AdminDashboardHeaderProps {
  communityName: string;
  communityLogo?: string;
  stats: AdminStats;
  onMembersClick?: () => void;
  onPendingClick?: () => void;
  onElectionsClick?: () => void;
  onBalanceClick?: () => void;
}

export function AdminDashboardHeader({ 
  communityName, 
  communityLogo, 
  stats,
  onMembersClick,
  onPendingClick,
  onElectionsClick,
  onBalanceClick,
}: AdminDashboardHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Community Info - Compact header row */}
      <div className="flex items-start gap-3">
        {communityLogo && (
          <img
            src={communityLogo}
            alt={communityName}
            className="h-11 w-11 rounded-full object-cover shrink-0 border-2 border-primary/20"
          />
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold leading-tight line-clamp-2">{communityName}</h1>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <AdminRoleBadge adminRole="Community Admin" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Dashboard</p>
        </div>
      </div>

      {/* Stats Grid - 2x2 on mobile, 4-col on tablet+ */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          icon={Users}
          value={stats.totalMembers}
          label="Members"
          trend={stats.memberTrend}
          onClick={onMembersClick}
        />
        <StatCard
          icon={Clock}
          value={stats.pendingRequests}
          label="Pending"
          urgent={stats.pendingRequests > 0}
          onClick={onPendingClick}
        />
        <StatCard
          icon={Vote}
          value={stats.activeElections}
          label="Elections"
          onClick={onElectionsClick}
        />
        <StatCard
          icon={Wallet}
          value={stats.walletBalance}
          label="Balance"
          prefix="M"
          onClick={onBalanceClick}
        />
      </div>
    </div>
  );
}
