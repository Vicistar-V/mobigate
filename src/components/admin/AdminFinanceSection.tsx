import { useState } from "react";
import { Wallet, TrendingUp, TrendingDown, Clock, FileText, Users, AlertTriangle, ChevronRight, Settings, Receipt, BarChart3, Shield } from "lucide-react";
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
import { ManageDuesLeviesDialog } from "./finance/ManageDuesLeviesDialog";
import { AccountStatementsDialog } from "./finance/AccountStatementsDialog";
import { MembersFinancialReportsDialog } from "./finance/MembersFinancialReportsDialog";
import { AdminFinancialAuditDialog } from "./finance/AdminFinancialAuditDialog";
import { LevyProgressCard } from "./finance/LevyProgressCard";
import { ModuleAuthorizationDrawer } from "./authorization/ModuleAuthorizationDrawer";
import { getActionConfig, renderActionDetails } from "./authorization/authorizationActionConfigs";
import { useToast } from "@/hooks/use-toast";
import { DualCurrencyDisplay, formatDualCurrency } from "@/components/common/DualCurrencyDisplay";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";

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
  onAuthorize?: (transaction: RecentTransaction) => void;
}

const TransactionItem = ({ transaction, onAuthorize }: TransactionItemProps) => {
  const Icon = getTransactionIcon(transaction.type);
  const colorClass = getTransactionColor(transaction.type);
  
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="p-2 rounded-lg bg-muted shrink-0">
        <Icon className={`h-4 w-4 ${colorClass}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm line-clamp-1">{transaction.description}</p>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {transaction.memberName && `${transaction.memberName} • `}
          {formatRelativeTime(transaction.date)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <DualCurrencyDisplay
          mobiAmount={transaction.amount}
          transactionType={transaction.type}
          showSign="auto"
          size="sm"
        />
        {transaction.status === 'pending' && onAuthorize ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6 text-xs px-2"
            onClick={() => onAuthorize(transaction)}
          >
            <Shield className="h-3 w-3 mr-1" />
            Authorize
          </Button>
        ) : (
          getStatusBadge(transaction.status)
        )}
      </div>
    </div>
  );
};

interface DefaultingMemberItemProps {
  member: DefaultingMember;
}

const DefaultingMemberItem = ({ member }: DefaultingMemberItemProps) => (
  <div className="flex items-start gap-3 py-3">
    <Avatar className="h-9 w-9 shrink-0">
      <AvatarImage src={member.avatar} alt={member.name} />
      <AvatarFallback className="text-sm">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm line-clamp-1">{member.name}</p>
      <p className="text-sm text-muted-foreground line-clamp-1">{member.obligation}</p>
    </div>
    <div className="flex flex-col items-end shrink-0">
      <DualCurrencyDisplay
        mobiAmount={member.amountOwed}
        transactionType="expense"
        size="sm"
      />
      <span className="text-xs text-muted-foreground whitespace-nowrap">
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
  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
    <div className="flex items-center gap-1 mb-0.5">
      <Icon className={`h-3.5 w-3.5 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}`} />
    </div>
    <span className="text-sm font-bold text-center">{value}</span>
    <span className="text-xs text-muted-foreground text-center">{label}</span>
  </div>
);

// Action types for finances module - matches the config keys
type FinanceActionType = "transfer" | "withdrawal" | "disbursement" | "budget_approval" | "income" | "expense";

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
  const { toast } = useToast();
  const [showDuesLevies, setShowDuesLevies] = useState(false);
  const [showStatements, setShowStatements] = useState(false);
  const [showMemberReports, setShowMemberReports] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  // Authorization state
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [authTransaction, setAuthTransaction] = useState<{
    type: FinanceActionType;
    description: string;
    amount: number;
  } | null>(null);

  const handleAuthorizeTransaction = (transaction: RecentTransaction) => {
    // Map transaction type to action config key
    const actionType: FinanceActionType = transaction.type as FinanceActionType;
    setAuthTransaction({
      type: actionType,
      description: transaction.description,
      amount: transaction.amount,
    });
    setAuthDrawerOpen(true);
  };

  const handleAuthorizationComplete = () => {
    if (authTransaction) {
      const config = getActionConfig("finances", authTransaction.type);
      toast({
        title: config?.title || "Transaction Authorized",
        description: `${authTransaction.description} has been authorized successfully.`,
      });
    }
    setAuthTransaction(null);
  };

  // Get action config using centralized templates
  const actionConfig = authTransaction ? getActionConfig("finances", authTransaction.type) : null;

  const getAuthActionDetails = () => {
    if (!authTransaction || !actionConfig) return null;
    
    return renderActionDetails({
      config: actionConfig,
      primaryText: authTransaction.description,
      secondaryText: "Financial Transaction",
      module: "finances",
      additionalInfo: {
        label: "Amount",
        value: `₦${authTransaction.amount.toLocaleString()} (M${authTransaction.amount.toLocaleString()})`,
      },
    });
  };

  return (
    <>
      {/* Dialogs */}
      <ManageDuesLeviesDialog open={showDuesLevies} onOpenChange={setShowDuesLevies} />
      <AccountStatementsDialog open={showStatements} onOpenChange={setShowStatements} />
      <MembersFinancialReportsDialog open={showMemberReports} onOpenChange={setShowMemberReports} />
      <AdminFinancialAuditDialog open={showAudit} onOpenChange={setShowAudit} />

      {/* Authorization Drawer - Now using centralized config */}
      <ModuleAuthorizationDrawer
        open={authDrawerOpen}
        onOpenChange={setAuthDrawerOpen}
        module="finances"
        actionTitle={actionConfig?.title || "Transaction Authorization"}
        actionDescription={actionConfig?.description || "Multi-signature authorization required for financial transactions"}
        actionDetails={getAuthActionDetails()}
        initiatorRole="treasurer"
        onAuthorized={handleAuthorizationComplete}
      />
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="finance" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
                <Wallet className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-left min-w-0">
                <h3 className="font-semibold text-base">Finance</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDualCurrency(stats.walletBalance)}
                  {stats.pendingPayments > 0 && ` • ${stats.pendingPayments} pending`}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {/* Stats Row - 4 columns, compact */}
              <div className="grid grid-cols-4 gap-2">
                <StatCard label="Balance" value={`₦${(stats.walletBalance / 1000).toFixed(0)}k`} icon={Wallet} />
                <StatCard label="Income" value={`₦${(stats.monthlyIncome / 1000).toFixed(0)}k`} icon={TrendingUp} trend="up" />
                <StatCard label="Expense" value={`₦${(stats.monthlyExpenses / 1000).toFixed(0)}k`} icon={TrendingDown} trend="down" />
                <StatCard label="Pending" value={String(stats.pendingPayments)} icon={Clock} />
              </div>

              {/* Action Buttons - Stacked vertically for mobile safety */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-10 text-sm justify-start" onClick={() => setShowDuesLevies(true)}>
                    <Settings className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">Dues & Levies</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 text-sm justify-start" onClick={() => setShowStatements(true)}>
                    <Receipt className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">Statements</span>
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-10 text-sm justify-start" onClick={() => setShowMemberReports(true)}>
                    <Users className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">Member Reports</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 text-sm justify-start" onClick={() => setShowAudit(true)}>
                    <BarChart3 className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">Financial Audit</span>
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-10 text-sm justify-start" onClick={onViewOverview}>
                    <Wallet className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">Overview</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 text-sm justify-start" onClick={onViewObligations}>
                    <AlertTriangle className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">Obligations</span>
                    {stats.pendingPayments > 0 && (
                      <Badge variant="destructive" className="ml-1 text-xs px-1.5 shrink-0">
                        {stats.pendingPayments}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>
              {/* Active Levy Progress */}
              <LevyProgressCard
                id="levy-2025-001"
                name="Annual Dues 2025"
                year="Fiscal Year 2025"
                unitPrice={15000}
                deadline={new Date("2025-03-31")}
                paidCount={30}
                totalMembers={50}
                amountCollected={450000}
                targetAmount={750000}
                status="active"
                onViewDetails={() => setShowDuesLevies(true)}
              />

              {/* Recent Transactions */}
              <Card>
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>Recent Transactions</span>
                    <Button variant="ghost" size="sm" className="h-8 text-sm px-2" onClick={onViewOverview}>
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="divide-y divide-border">
                    {recentTransactions.slice(0, 4).map((transaction) => (
                      <TransactionItem 
                        key={transaction.id} 
                        transaction={transaction}
                        onAuthorize={handleAuthorizeTransaction}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Defaulting Members */}
              {defaultingMembers.length > 0 && (
                <Card className="border-red-200 bg-red-50/30 dark:bg-red-950/10">
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>Defaulting</span>
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

              {/* Authorization Info */}
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Finance: 3 signatories if President initiates, 4 otherwise
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}