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
}

const StatCard = ({ icon: Icon, value, label, trend, urgent, prefix }: StatCardProps) => (
  <Card className={`${urgent ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20' : ''} overflow-hidden`}>
    <CardContent className="p-3">
      <div className="flex items-start justify-between gap-1">
        <div className={`p-2 rounded-lg ${urgent ? 'bg-amber-500/20' : 'bg-primary/10'} shrink-0`}>
          <Icon className={`h-4 w-4 ${urgent ? 'text-amber-600' : 'text-primary'}`} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{trend >= 0 ? '+' : ''}{trend}</span>
          </div>
        )}
        {urgent && !trend && (
          <Badge variant="destructive" className="text-xs px-1.5 shrink-0">
            Urgent
          </Badge>
        )}
      </div>
      <div className="mt-2">
        <p className="text-xl font-bold truncate">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-sm text-muted-foreground truncate">{label}</p>
      </div>
    </CardContent>
  </Card>
);

interface AdminDashboardHeaderProps {
  communityName: string;
  communityLogo?: string;
  stats: AdminStats;
}

export function AdminDashboardHeader({ communityName, communityLogo, stats }: AdminDashboardHeaderProps) {
  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      {/* Community Info */}
      <div className="flex items-center gap-3 max-w-full">
        {communityLogo && (
          <img
            src={communityLogo}
            alt={communityName}
            className="h-12 w-12 rounded-lg object-cover shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold truncate">{communityName}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <AdminRoleBadge adminRole="Community Admin" />
            <span className="text-sm text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </div>

      {/* Stats Grid - 2x2 on mobile */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <StatCard
          icon={Users}
          value={stats.totalMembers}
          label="Members"
          trend={stats.memberTrend}
        />
        <StatCard
          icon={Clock}
          value={stats.pendingRequests}
          label="Pending"
          urgent={stats.pendingRequests > 0}
        />
        <StatCard
          icon={Vote}
          value={stats.activeElections}
          label="Elections"
        />
        <StatCard
          icon={Wallet}
          value={stats.walletBalance}
          label="Balance"
          prefix="M"
        />
      </div>
    </div>
  );
}