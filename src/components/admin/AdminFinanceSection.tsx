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
      return <Badge className="bg-green-500/10 text-green-600 text-[10px] px-1.5">Completed</Badge>;
    case 'pending':
      return <Badge className="bg-amber-500/10 text-amber-600 text-[10px] px-1.5">Pending</Badge>;
    case 'failed':
      return <Badge variant="destructive" className="text-[10px] px-1.5">Failed</Badge>;
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
    <div className="flex items-center gap-3 py-2.5">
      <div className={`p-2 rounded-lg bg-muted shrink-0`}>
        <Icon className={`h-4 w-4 ${colorClass}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">
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
  <div className="flex items-center gap-3 py-2.5">
    <Avatar className="h-8 w-8 shrink-0">
      <AvatarImage src={member.avatar} alt={member.name} />
      <AvatarFallback className="text-xs">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm truncate">{member.name}</p>
      <p className="text-xs text-muted-foreground">{member.obligation}</p>
    </div>
    <div className="flex flex-col items-end shrink-0">
      <span className="font-semibold text-sm text-destructive">
        M{member.amountOwed.toLocaleString()}
      </span>
      <span className="text-[10px] text-muted-foreground">
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
  <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
    <div className="flex items-center gap-1 mb-1">
      <Icon className={`h-4 w-4 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}`} />
    </div>
    <span className="text-lg font-bold">{value}</span>
    <span className="text-[10px] text-muted-foreground">{label}</span>
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
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="finance" className="border rounded-lg">
        <AccordionTrigger className="px-4 hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Wallet className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Financial Management</h3>
              <p className="text-xs text-muted-foreground">
                Balance: M{stats.walletBalance.toLocaleString()}
                {stats.pendingPayments > 0 && ` • ${stats.pendingPayments} pending`}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-2">
              <StatCard label="Balance" value={`M${(stats.walletBalance / 1000).toFixed(0)}k`} icon={Wallet} />
              <StatCard label="Income" value={`M${(stats.monthlyIncome / 1000).toFixed(0)}k`} icon={TrendingUp} trend="up" />
              <StatCard label="Expenses" value={`M${(stats.monthlyExpenses / 1000).toFixed(0)}k`} icon={TrendingDown} trend="down" />
              <StatCard label="Pending" value={String(stats.pendingPayments)} icon={Clock} />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={onViewOverview}>
                <Wallet className="h-4 w-4 mr-2" />
                Overview
              </Button>
              <Button variant="outline" size="sm" onClick={onViewAudit}>
                <FileText className="h-4 w-4 mr-2" />
                Audit Reports
              </Button>
            </div>

            <Button variant="outline" size="sm" className="w-full" onClick={onViewObligations}>
              <Users className="h-4 w-4 mr-2" />
              Member Obligations
              {stats.pendingPayments > 0 && (
                <Badge variant="destructive" className="ml-2 text-[10px] px-1.5">
                  {stats.pendingPayments}
                </Badge>
              )}
            </Button>

            {/* Recent Transactions */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  Recent Transactions
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onViewOverview}>
                    View All
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0">
                <div className="divide-y divide-border">
                  {recentTransactions.slice(0, 5).map((transaction) => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Defaulting Members */}
            {defaultingMembers.length > 0 && (
              <Card className="border-red-200 bg-red-50/30 dark:bg-red-950/10">
                <CardHeader className="pb-2 pt-3 px-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    Defaulting Members
                    <Badge variant="destructive" className="ml-auto text-[10px]">
                      {defaultingMembers.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3 pt-0">
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
