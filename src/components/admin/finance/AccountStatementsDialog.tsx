import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Search,
  Calendar,
  Filter,
  ChevronRight,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import {
  mockAccountTransactions,
  AccountTransaction,
} from "@/data/financialManagementData";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { DualCurrencyDisplay } from "@/components/common/DualCurrencyDisplay";

interface AccountStatementsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccountStatementsDialog = ({
  open,
  onOpenChange,
}: AccountStatementsDialogProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Calculate totals
  const totals = mockAccountTransactions.reduce(
    (acc, txn) => {
      if (txn.status === "completed") {
        if (txn.type === "credit") {
          acc.totalCredits += txn.amount;
        } else {
          acc.totalDebits += txn.amount;
        }
      }
      return acc;
    },
    { totalCredits: 0, totalDebits: 0 }
  );

  // Filter transactions
  const filteredTransactions = mockAccountTransactions.filter((txn) => {
    const matchesType = typeFilter === "all" || txn.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || txn.category === categoryFilter;
    const matchesSearch =
      searchQuery === "" ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const handleExport = () => {
    const csvContent = [
      "Date,Type,Category,Description,Reference,Amount,Balance,Status",
      ...filteredTransactions.map(
        (txn) =>
          `${format(txn.date, "yyyy-MM-dd")},${txn.type},${txn.category},${txn.description},${txn.reference},${txn.amount},${txn.balance},${txn.status}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `account-statement-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Statement Exported",
      description: "Account statement has been downloaded as CSV.",
    });
  };

  const getStatusBadge = (status: AccountTransaction["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-600 text-xs">Completed</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-600 text-xs">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500/10 text-red-600 text-xs">Failed</Badge>;
      case "reversed":
        return <Badge className="bg-gray-500/10 text-gray-600 text-xs">Reversed</Badge>;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: AccountTransaction["category"]) => {
    const labels: Record<AccountTransaction["category"], string> = {
      dues_payment: "Dues Payment",
      levy_payment: "Levy Payment",
      donation: "Donation",
      fundraiser: "Fundraiser",
      event_revenue: "Event Revenue",
      operational_expense: "Operations",
      project_expense: "Project",
      welfare_disbursement: "Welfare",
      administrative_expense: "Admin",
      minutes_download: "Minutes Fee",
      transfer_in: "Transfer In",
      transfer_out: "Transfer Out",
    };
    return labels[category];
  };

  const Content = () => (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 bg-green-50 border-green-200">
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Total Credits</p>
              <p className="text-lg font-bold text-green-600">
                {formatLocalAmount(totals.totalCredits, "NGN")}
              </p>
              <p className="text-xs text-muted-foreground">
                ({formatMobiAmount(totals.totalCredits)})
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-3 bg-red-50 border-red-200">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-xs text-muted-foreground">Total Debits</p>
              <p className="text-lg font-bold text-red-600">
                {formatLocalAmount(totals.totalDebits, "NGN")}
              </p>
              <p className="text-xs text-muted-foreground">
                ({formatMobiAmount(totals.totalDebits)})
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Filters</span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by description or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credit">Credits Only</SelectItem>
                <SelectItem value="debit">Debits Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="dues_payment">Dues Payment</SelectItem>
                <SelectItem value="levy_payment">Levy Payment</SelectItem>
                <SelectItem value="donation">Donation</SelectItem>
                <SelectItem value="fundraiser">Fundraiser</SelectItem>
                <SelectItem value="event_revenue">Event Revenue</SelectItem>
                <SelectItem value="operational_expense">Operations</SelectItem>
                <SelectItem value="project_expense">Project</SelectItem>
                <SelectItem value="welfare_disbursement">Welfare</SelectItem>
                <SelectItem value="administrative_expense">Admin</SelectItem>
                <SelectItem value="minutes_download">Minutes Fees</SelectItem>
                <SelectItem value="transfer_in">Transfer In</SelectItem>
                <SelectItem value="transfer_out">Transfer Out</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                From Date
              </Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                To Date
              </Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Export Button */}
      <Button variant="outline" className="w-full gap-2" onClick={handleExport}>
        <Download className="h-4 w-4" />
        Export Statement (CSV)
      </Button>

      {/* Transactions List */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Transactions ({filteredTransactions.length})
        </h3>

        <div className="space-y-2">
          {filteredTransactions.map((txn) => (
            <Card key={txn.id} className="p-3 overflow-hidden">
              <div className="flex items-start gap-2">
                {/* Icon */}
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    txn.type === "credit"
                      ? "bg-green-500/10"
                      : "bg-red-500/10"
                  }`}
                >
                  {txn.type === "credit" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>

                {/* Content - Fully stacked on mobile */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Row 1: Title + Amount */}
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm leading-tight line-clamp-2 flex-1 min-w-0">
                      {txn.description}
                    </p>
                    <div className="flex-shrink-0 text-right">
                      <DualCurrencyDisplay
                        mobiAmount={txn.amount}
                        transactionType={txn.type === "credit" ? "income" : "expense"}
                        showSign="auto"
                        size="sm"
                      />
                    </div>
                  </div>
                  
                  {/* Row 2: Category + Reference + Balance */}
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="truncate flex-1 min-w-0">
                      {getCategoryLabel(txn.category)} • {txn.reference}
                    </span>
                    <span className="flex-shrink-0">
                      Bal: ₦{txn.balance.toLocaleString()} (M{txn.balance.toLocaleString()})
                    </span>
                  </div>

                  {/* Row 3: Member/Auth + Date + Status - Stacked for mobile */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 border-t border-border/50">
                    {txn.memberName && txn.memberAvatar && (
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={txn.memberAvatar} />
                          <AvatarFallback className="text-[10px]">
                            {txn.memberName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                          {txn.memberName.split(' ')[0]}...
                        </span>
                      </div>
                    )}
                    {txn.authorizedBy && (
                      <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                        Auth: {txn.authorizedBy}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {format(txn.date, "MMM d, HH:mm")}
                    </span>
                    {getStatusBadge(txn.status)}
                  </div>

                  {/* Row 4: Notes */}
                  {txn.notes && (
                    <p className="text-xs text-muted-foreground italic pt-1">
                      Note: {txn.notes}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {filteredTransactions.length === 0 && (
        <Card className="p-8 text-center">
          <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">No Transactions Found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search query.
          </p>
        </Card>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>Account Statements</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
            <Content />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Account Statements</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <Content />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
