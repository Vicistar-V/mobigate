import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Wallet,
  AlertTriangle,
  RefreshCw,
  PieChart,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Minus,
  Clock,
  Info,
  ChevronRight,
} from "lucide-react";
import { mockYearlyAudits, YearlyFinancialAudit } from "@/data/financialManagementData";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { IncomeSourceDetailSheet } from "./IncomeSourceDetailSheet";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { ExpenseSourceDetailSheet } from "./ExpenseSourceDetailSheet";
import { DeficitsDetailSheet } from "./DeficitsDetailSheet";
import { FloatingFundsDetailSheet } from "./FloatingFundsDetailSheet";

interface AdminFinancialAuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminFinancialAuditDialog = ({
  open,
  onOpenChange,
}: AdminFinancialAuditDialogProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedIncomeSource, setSelectedIncomeSource] = useState<{
    key: string;
    amount: number;
  } | null>(null);
  const [selectedExpenseSource, setSelectedExpenseSource] = useState<{
    key: string;
    amount: number;
  } | null>(null);
  const [selectedDeficitSource, setSelectedDeficitSource] = useState<{
    key: string;
    amount: number;
  } | null>(null);
  const [selectedFloatingSource, setSelectedFloatingSource] = useState<{
    key: string;
    amount: number;
  } | null>(null);

  const currentAudit = mockYearlyAudits.find((a) => a.year === parseInt(selectedYear));

  const handleExport = () => {
    toast({
      title: "Audit Report Exported",
      description: `Financial audit report for ${selectedYear} has been downloaded.`,
    });
  };

  // Helper: Local Currency PRIMARY, Mobi SECONDARY
  const formatCurrency = (amount: number, showLocal: boolean = true) => {
    const local = amount >= 1000000
      ? `₦${(amount / 1000000).toFixed(2)}M`
      : amount >= 1000
        ? `₦${(amount / 1000).toFixed(0)}k`
        : `₦${amount.toLocaleString()}`;
    
    if (!showLocal) return local;
    
    // Show Mobi currency equivalent (secondary)
    const mobi = amount >= 1000000
      ? `M${(amount / 1000000).toFixed(2)}M`
      : amount >= 1000
        ? `M${(amount / 1000).toFixed(0)}k`
        : `M${amount.toLocaleString()}`;
    
    return `${local} (${mobi})`;
  };

  const Content = () => {
    if (!currentAudit) {
      return (
        <Card className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">No Audit Data Available</h3>
          <p className="text-sm text-muted-foreground">
            No financial audit data found for {selectedYear}.
          </p>
        </Card>
      );
    }

    const netFlow = currentAudit.totalFundsReceived - currentAudit.totalFundsSpent;
    const isPositive = netFlow >= 0;

    return (
      <div className="space-y-4">
        {/* Year Selector */}
        <div className="flex items-center justify-between gap-3">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {mockYearlyAudits.map((audit) => (
                <SelectItem key={audit.year} value={audit.year.toString()}>
                  {audit.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownLeft className="h-4 w-4 text-green-600" />
              <span className="text-xs text-muted-foreground">Funds Received</span>
            </div>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(currentAudit.totalFundsReceived)}
            </p>
          </Card>
          <Card className="p-3 bg-red-50 border-red-200">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpRight className="h-4 w-4 text-red-600" />
              <span className="text-xs text-muted-foreground">Funds Spent</span>
            </div>
            <p className="text-lg font-bold text-red-600">
              {formatCurrency(currentAudit.totalFundsSpent)}
            </p>
          </Card>
          <Card className="p-3 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">Closing Balance</span>
            </div>
            <p className="text-lg font-bold text-blue-600">
              {formatCurrency(currentAudit.closingBalance)}
            </p>
          </Card>
          <Card className={`p-3 ${isPositive ? "bg-emerald-50 border-emerald-200" : "bg-orange-50 border-orange-200"}`}>
            <div className="flex items-center gap-2 mb-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-orange-600" />
              )}
              <span className="text-xs text-muted-foreground">Net Flow</span>
            </div>
            <p className={`text-lg font-bold ${isPositive ? "text-emerald-600" : "text-orange-600"}`}>
              {isPositive ? "+" : ""}{formatCurrency(netFlow)}
            </p>
          </Card>
        </div>

        {/* Risk Indicators */}
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Risk Indicators
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <Minus className="h-4 w-4 text-amber-600" />
                <span className="text-xs text-muted-foreground">Total Deficits</span>
              </div>
              <p className="text-lg font-bold text-amber-600">
                {formatCurrency(currentAudit.totalDeficits)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Unpaid obligations from members
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-muted-foreground">Floating Funds</span>
              </div>
              <p className="text-lg font-bold text-purple-600">
                {formatCurrency(currentAudit.floatingFunds)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Recoverable/pending amounts
              </p>
            </div>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="income" className="text-xs">Income</TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs">Expenses</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-3 mt-0">
            {/* Balance Flow */}
            <Card className="p-4">
              <h4 className="font-medium text-sm mb-3">Balance Flow</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Opening Balance</span>
                  <span className="font-medium">{formatCurrency(currentAudit.openingBalance)}</span>
                </div>
                <div className="flex items-center justify-between text-green-600">
                  <span className="text-sm">+ Funds Received</span>
                  <span className="font-medium">+{formatCurrency(currentAudit.totalFundsReceived)}</span>
                </div>
                <div className="flex items-center justify-between text-red-600">
                  <span className="text-sm">- Funds Spent</span>
                  <span className="font-medium">-{formatCurrency(currentAudit.totalFundsSpent)}</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between font-semibold">
                  <span>Closing Balance</span>
                  <span className="text-blue-600">{formatCurrency(currentAudit.closingBalance)}</span>
                </div>
              </div>
            </Card>

            {/* Deficits Breakdown */}
            <Card className="p-4">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Deficits Breakdown
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Tap on any category to view member details
              </p>
              <div className="space-y-2">
                {[
                  { key: "unpaidDues", label: "Unpaid Dues", amount: currentAudit.breakdown.deficits.unpaidDues },
                  { key: "unpaidLevies", label: "Unpaid Levies", amount: currentAudit.breakdown.deficits.unpaidLevies },
                  { key: "pendingObligations", label: "Pending Obligations", amount: currentAudit.breakdown.deficits.pendingObligations },
                ].map((item) => (
                  <button
                    key={item.key}
                    className="w-full flex items-center justify-between text-sm p-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors active:scale-[0.99]"
                    onClick={() => setSelectedDeficitSource({ key: item.key, amount: item.amount })}
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-amber-600">
                        {formatCurrency(item.amount)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Floating Funds Breakdown */}
            <Card className="p-4">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-purple-600" />
                Floating Funds (Recoverable)
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Tap on any category to view recovery details
              </p>
              <div className="space-y-2">
                {[
                  { key: "pendingLoans", label: "Pending Loans", amount: currentAudit.breakdown.floating.pendingLoans },
                  { key: "advancesGiven", label: "Advances Given", amount: currentAudit.breakdown.floating.advancesGiven },
                  { key: "recoverableExpenses", label: "Recoverable Expenses", amount: currentAudit.breakdown.floating.recoverableExpenses },
                ].map((item) => (
                  <button
                    key={item.key}
                    className="w-full flex items-center justify-between text-sm p-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors active:scale-[0.99]"
                    onClick={() => setSelectedFloatingSource({ key: item.key, amount: item.amount })}
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-purple-600">
                        {formatCurrency(item.amount)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Income Tab */}
          <TabsContent value="income" className="space-y-3 mt-0">
            <Card className="p-4">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Income Sources
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Tap on any source to view payment details
              </p>
              <div className="space-y-3">
                {Object.entries(currentAudit.breakdown.income).map(([key, value]) => {
                  const percentage = Math.round((value / currentAudit.totalFundsReceived) * 100);
                  const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
                  
                  // Color mapping for income sources
                  const colorMap: Record<string, string> = {
                    duesCollected: "bg-blue-100",
                    leviesCollected: "bg-cyan-100",
                    donations: "bg-pink-100",
                    fundraisers: "bg-purple-100",
                    eventRevenue: "bg-yellow-100",
                    minutesDownloadRevenue: "bg-green-100",
                    otherIncome: "bg-gray-100",
                  };
                  const bgColor = colorMap[key] || "bg-gray-100";
                  
                  return (
                    <button
                      key={key}
                      className={`w-full text-left p-3 rounded-lg ${bgColor} hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer`}
                      onClick={() => setSelectedIncomeSource({ key, amount: value })}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{label}</span>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-sm">{formatCurrency(value)}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground w-8">{percentage}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-3 mt-0">
            <Card className="p-4">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                Expense Categories
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Tap on any category to view expense details
              </p>
              <div className="space-y-3">
                {Object.entries(currentAudit.breakdown.expenses).map(([key, value]) => {
                  const percentage = Math.round((value / currentAudit.totalFundsSpent) * 100);
                  const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
                  
                  // Color mapping for expense sources
                  const colorMap: Record<string, string> = {
                    operationalExpenses: "bg-blue-50",
                    projectExpenses: "bg-purple-50",
                    welfarePayouts: "bg-pink-50",
                    administrativeExpenses: "bg-amber-50",
                    otherExpenses: "bg-gray-50",
                  };
                  const bgColor = colorMap[key] || "bg-gray-50";
                  
                  return (
                    <button
                      key={key}
                      className={`w-full text-left p-3 rounded-lg ${bgColor} hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer`}
                      onClick={() => setSelectedExpenseSource({ key, amount: value })}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{label}</span>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-sm text-red-600">{formatCurrency(value)}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground w-8">{percentage}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Note */}
        <Card className="p-3 bg-muted/30">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              This audit report shows the financial summary for {selectedYear}. 
              Deficits represent unpaid member obligations, while floating funds 
              are amounts expected to be recovered.
            </p>
          </div>
        </Card>
      </div>
    );
  };

  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[92vh]">
            <DrawerHeader className="border-b">
              <DrawerTitle>Financial Audit</DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
              <Content />
            </ScrollArea>
          </DrawerContent>
        </Drawer>
        
        {selectedIncomeSource && (
          <IncomeSourceDetailSheet
            open={!!selectedIncomeSource}
            onOpenChange={(open) => !open && setSelectedIncomeSource(null)}
            sourceKey={selectedIncomeSource.key}
            totalAmount={selectedIncomeSource.amount}
          />
        )}
        
        {selectedExpenseSource && (
          <ExpenseSourceDetailSheet
            open={!!selectedExpenseSource}
            onOpenChange={(open) => !open && setSelectedExpenseSource(null)}
            sourceKey={selectedExpenseSource.key}
            totalAmount={selectedExpenseSource.amount}
          />
        )}
        
        {selectedDeficitSource && (
          <DeficitsDetailSheet
            open={!!selectedDeficitSource}
            onOpenChange={(open) => !open && setSelectedDeficitSource(null)}
            sourceKey={selectedDeficitSource.key}
            totalAmount={selectedDeficitSource.amount}
          />
        )}
        
        {selectedFloatingSource && (
          <FloatingFundsDetailSheet
            open={!!selectedFloatingSource}
            onOpenChange={(open) => !open && setSelectedFloatingSource(null)}
            sourceKey={selectedFloatingSource.key}
            totalAmount={selectedFloatingSource.amount}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Financial Audit</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <Content />
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {selectedIncomeSource && (
        <IncomeSourceDetailSheet
          open={!!selectedIncomeSource}
          onOpenChange={(open) => !open && setSelectedIncomeSource(null)}
          sourceKey={selectedIncomeSource.key}
          totalAmount={selectedIncomeSource.amount}
        />
      )}
      
      {selectedExpenseSource && (
        <ExpenseSourceDetailSheet
          open={!!selectedExpenseSource}
          onOpenChange={(open) => !open && setSelectedExpenseSource(null)}
          sourceKey={selectedExpenseSource.key}
          totalAmount={selectedExpenseSource.amount}
        />
      )}
      
      {selectedDeficitSource && (
        <DeficitsDetailSheet
          open={!!selectedDeficitSource}
          onOpenChange={(open) => !open && setSelectedDeficitSource(null)}
          sourceKey={selectedDeficitSource.key}
          totalAmount={selectedDeficitSource.amount}
        />
      )}
      
      {selectedFloatingSource && (
        <FloatingFundsDetailSheet
          open={!!selectedFloatingSource}
          onOpenChange={(open) => !open && setSelectedFloatingSource(null)}
          sourceKey={selectedFloatingSource.key}
          totalAmount={selectedFloatingSource.amount}
        />
      )}
    </>
  );
};
