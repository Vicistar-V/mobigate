import { Users, Clock, Vote, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminStats } from "@/data/adminDashboardData";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
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
    className={`${urgent ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20' : ''} ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} overflow-hidden`}
    onClick={onClick}
  >
    <CardContent className="p-2.5">
      <div className="flex items-start justify-between gap-1">
        <div className={`p-1.5 rounded-lg ${urgent ? 'bg-amber-500/20' : 'bg-primary/10'} shrink-0`}>
          <Icon className={`h-4 w-4 ${urgent ? 'text-amber-600' : 'text-primary'}`} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-[10px] font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
            <span>{trend >= 0 ? '+' : ''}{trend}</span>
          </div>
        )}
        {urgent && !trend && (
          <Badge variant="destructive" className="text-[9px] px-1 py-0 shrink-0">
            !
          </Badge>
        )}
      </div>
      <div className="mt-1">
        <p className="text-base font-bold leading-tight truncate">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-[10px] text-muted-foreground truncate">{label}</p>
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
    <div className="space-y-2">
      {/* Stats Grid - 2x2 on mobile */}
      <div className="grid grid-cols-2 gap-1.5">
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
          value={formatLocalAmount(stats.walletBalance, "NGN")}
          label="Balance"
          onClick={onBalanceClick}
        />
      </div>
    </div>
  );
}
