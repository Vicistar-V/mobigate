import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: string;
  type: "sent" | "received";
  amount: number;
  currency: string;
  to?: string;
  from?: string;
  date: Date;
  description: string;
}

interface AccountSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  currencySymbol: string;
}

export const AccountSummaryDialog = ({ 
  open, 
  onOpenChange, 
  userName,
  currencySymbol 
}: AccountSummaryDialogProps) => {
  // Mock data - in production, this would come from backend
  const balance = 15750.50;
  const totalSent = 8240.00;
  const totalReceived = 24000.50;
  
  const recentTransactions: Transaction[] = [
    {
      id: "1",
      type: "received",
      amount: 5000,
      currency: "Mobi",
      from: "Sarah Johnson",
      date: new Date(2025, 9, 14),
      description: "Gift payment"
    },
    {
      id: "2",
      type: "sent",
      amount: 2500,
      currency: "Mobi",
      to: "Michael Chen",
      date: new Date(2025, 9, 13),
      description: "Service payment"
    },
    {
      id: "3",
      type: "received",
      amount: 1200,
      currency: "Mobi",
      from: "Emily Davis",
      date: new Date(2025, 9, 12),
      description: "Refund"
    },
    {
      id: "4",
      type: "sent",
      amount: 3500,
      currency: "Mobi",
      to: "James Wilson",
      date: new Date(2025, 9, 11),
      description: "Purchase"
    },
    {
      id: "5",
      type: "received",
      amount: 7500,
      currency: "Mobi",
      from: "Lisa Anderson",
      date: new Date(2025, 9, 10),
      description: "Consulting fee"
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            <span className="truncate">Account Summary - {userName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Balance Card */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl sm:text-4xl font-bold">
                {currencySymbol}{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                ≈ ₦{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} Naira
              </p>
            </div>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Card className="p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Received</p>
                  <p className="text-lg sm:text-2xl font-bold text-emerald-600 truncate">
                    +{currencySymbol}{totalReceived.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 shrink-0" />
              </div>
            </Card>

            <Card className="p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Sent</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-600 truncate">
                    -{currencySymbol}{totalSent.toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 shrink-0" />
              </div>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 flex items-center gap-2">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              Recent Transactions
            </h4>
            <ScrollArea className="h-[250px] sm:h-[300px] pr-3 sm:pr-4">
              <div className="space-y-2 sm:space-y-3">
                {recentTransactions.map((transaction) => (
                  <Card key={transaction.id} className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className={`p-1.5 sm:p-2 rounded-full shrink-0 ${
                          transaction.type === "received" 
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" 
                            : "bg-red-100 text-red-600 dark:bg-red-900/30"
                        }`}>
                          {transaction.type === "received" ? (
                            <ArrowDownLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm sm:text-base font-medium truncate">
                            {transaction.type === "received" ? "From" : "To"}{" "}
                            {transaction.type === "received" ? transaction.from : transaction.to}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {transaction.description}
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                            {format(transaction.date, "MMM dd, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-base sm:text-lg font-semibold ${
                          transaction.type === "received" 
                            ? "text-emerald-600" 
                            : "text-red-600"
                        }`}>
                          {transaction.type === "received" ? "+" : "-"}
                          {currencySymbol}{transaction.amount.toLocaleString()}
                        </p>
                        <Badge variant="outline" className="text-[10px] sm:text-xs mt-1">
                          {transaction.currency}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
