import { Wallet, TrendingUp, TrendingDown, Clock, FileText, Users, AlertTriangle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdminStats, RecentTransaction, DefaultingMember, formatRelativeTime } from "@/data/adminDashboardData";

const getTransactionIcon = (type: RecentTransaction['type']) => {
  switch (type) {
    case 'income':
      return TrendingUp;
    case 'expense':
      return TrendingDown;
    case 'transfer':
      return Wallet;
    default:
      return Wallet;
  }
};

const getTransactionColor = (type: RecentTransaction['type']) => {
  switch (type) {
    case 'income':
      return 'text-green-600';
    case 'expense':
      return 'text-red-600';
    case 'transfer':
      return 'text-blue-600';
    default:
      return 'text-muted-foreground';
  }
};

const getStatusBadge = (status: RecentTransaction['status']) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-500/10 text-green-600 text-xs px-1.5">Done</Badge>;
    case 'pending':
      return <Badge className="bg-amber-500/10 text-amber-600 text-xs px-1.5">Pending</Badge>;
    case 'failed':
      return <Badge variant="destructive" className="text-xs px-1.5">Failed</Badge>;
    default:
      return null;
  }
};

interface TransactionItemProps {
  transaction: RecentTransaction;
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const Icon = getTransactionIcon(transaction.type);
  const colorClass = getTransactionColor(transaction.type);
  
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="p-2 rounded-lg bg-muted shrink-0">
        <Icon className={`h-4 w-4 ${colorClass}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{transaction.description}</p>
        <p className="text-sm text-muted-foreground truncate">
          {transaction.memberName && `${transaction.memberName} • `}
          {formatRelativeTime(transaction.date)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className={`font-semibold text-sm ${colorClass}`}>
          {transaction.type === 'expense' ? '-' : '+'}M{transaction.amount.toLocaleString()}
        </span>
        {getStatusBadge(transaction.status)}
      </div>
    </div>
  );
};

interface DefaultingMemberItemProps {
  member: DefaultingMember;
}

const DefaultingMemberItem = ({ member }: DefaultingMemberItemProps) => (
  <div className="flex items-center gap-3 py-3">
    <Avatar className="h-9 w-9 shrink-0">
      <AvatarImage src={member.avatar} alt={member.name} />
      <AvatarFallback className="text-sm">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm truncate">{member.name}</p>
      <p className="text-sm text-muted-foreground truncate">{member.obligation}</p>
    </div>
    <div className="flex flex-col items-end shrink-0">
      <span className="font-semibold text-sm text-destructive">
        M{member.amountOwed.toLocaleString()}
      </span>
      <span className="text-sm text-muted-foreground">
        Due {formatRelativeTime(member.dueDate)}
      </span>
    </div>
  </div>
);

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
}

const StatCard = ({ label, value, icon: Icon, trend }: StatCardProps) => (
  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 min-w-0 overflow-hidden">
    <div className="flex items-center gap-1 mb-0.5">
      <Icon className={`h-3.5 w-3.5 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}`} />
    </div>
    <span className="text-sm font-bold truncate w-full text-center">{value}</span>
    <span className="text-xs text-muted-foreground truncate w-full text-center">{label}</span>
  </div>
);

interface AdminFinanceSectionProps {
  stats: AdminStats;
  recentTransactions: RecentTransaction[];
  defaultingMembers: DefaultingMember[];
  onViewOverview: () => void;
  onViewAudit: () => void;
  onViewObligations: () => void;
}

export function AdminFinanceSection({
  stats,
  recentTransactions,
  defaultingMembers,
  onViewOverview,
  onViewAudit,
  onViewObligations,
}: AdminFinanceSectionProps) {
  return (
    <Accordion type="single" collapsible className="w-full max-w-full">
      <AccordionItem value="finance" className="border rounded-lg overflow-hidden">
        <AccordionTrigger className="px-4 hover:no-underline max-w-full">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
              <Wallet className="h-5 w-5 text-amber-600" />
            </div>
            <div className="text-left min-w-0">
              <h3 className="font-semibold text-base truncate">Finance</h3>
              <p className="text-sm text-muted-foreground truncate">
                M{stats.walletBalance.toLocaleString()}
                {stats.pendingPayments > 0 && ` • ${stats.pendingPayments} pending`}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4 w-full max-w-full overflow-hidden">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-1.5 w-full">
              <StatCard label="Balance" value={`M${(stats.walletBalance / 1000).toFixed(0)}k`} icon={Wallet} />
              <StatCard label="Income" value={`M${(stats.monthlyIncome / 1000).toFixed(0)}k`} icon={TrendingUp} trend="up" />
              <StatCard label="Expense" value={`M${(stats.monthlyExpenses / 1000).toFixed(0)}k`} icon={TrendingDown} trend="down" />
              <StatCard label="Pending" value={String(stats.pendingPayments)} icon={Clock} />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onViewOverview}>
                <Wallet className="h-4 w-4 mr-2" />
                Overview
              </Button>
              <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onViewAudit}>
                <FileText className="h-4 w-4 mr-2" />
                Audit
              </Button>
            </div>

            <Button variant="outline" size="sm" className="w-full h-10 text-sm" onClick={onViewObligations}>
              <Users className="h-4 w-4 mr-2" />
              Member Obligations
              {stats.pendingPayments > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs px-1.5">
                  {stats.pendingPayments}
                </Badge>
              )}
            </Button>

            {/* Recent Transactions */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm flex items-center justify-between">
                  Recent Transactions
                  <Button variant="ghost" size="sm" className="h-8 text-sm px-2" onClick={onViewOverview}>
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="divide-y divide-border">
                  {recentTransactions.slice(0, 4).map((transaction) => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Defaulting Members */}
            {defaultingMembers.length > 0 && (
              <Card className="border-red-200 bg-red-50/30 dark:bg-red-950/10 overflow-hidden">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    Defaulting
                    <Badge variant="destructive" className="ml-auto text-xs px-1.5">
                      {defaultingMembers.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="divide-y divide-border">
                    {defaultingMembers.slice(0, 3).map((member) => (
                      <DefaultingMemberItem key={member.id} member={member} />
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