import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpRight, ArrowDownLeft, X } from "lucide-react";
import { format } from "date-fns";
import { DualCurrencyDisplay } from "@/components/common/DualCurrencyDisplay";

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

interface RecentTransactionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currencySymbol: string;
}

export const RecentTransactionsDialog = ({ 
  open, 
  onOpenChange, 
  currencySymbol 
}: RecentTransactionsDialogProps) => {
  // Mock data - in production, this would come from backend
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
      <DialogContent className="w-[95vw] max-w-md h-[90vh] p-0 gap-0 flex flex-col">
        {/* Fixed Header */}
        <DialogHeader className="flex-shrink-0 border-b">
          {/* Close button row */}
          <div className="flex justify-end px-3 pt-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)} 
              className="h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Title row */}
          <div className="flex items-center justify-between gap-2 px-3 pb-3">
            <DialogTitle className="text-base font-semibold">Recent Transactions</DialogTitle>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 px-3">
          <div className="py-3 space-y-2.5 pb-3">
            {recentTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
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
                      <p className="text-base sm:text-lg font-medium truncate">
                        {transaction.type === "received" ? "From" : "To"}{" "}
                        {transaction.type === "received" ? transaction.from : transaction.to}
                      </p>
                      <p className="text-base sm:text-lg text-muted-foreground truncate">
                        {transaction.description}
                      </p>
                      <p className="text-sm sm:text-base text-muted-foreground mt-1">
                        {format(transaction.date, "MMM dd, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right shrink-0 mt-2 sm:mt-0 pl-9 sm:pl-0">
                    <DualCurrencyDisplay
                      mobiAmount={transaction.amount}
                      transactionType={transaction.type === "received" ? "credit" : "debit"}
                      showSign="auto"
                      size="md"
                    />
                    <Badge variant="outline" className="text-sm sm:text-base sm:mt-1">
                      Mobi
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
