import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { RecentTransactionsDialog } from "./RecentTransactionsDialog";

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
  const [showTransactions, setShowTransactions] = useState(false);
  
  // Mock data - in production, this would come from backend
  const mobiBalance = 100000;
  const creditBalance = 100000;
  const mobiReceived = 150000;
  const creditReceived = 150000;
  const mobiSpent = 50000;
  const creditSpent = 50000;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] p-4 sm:p-6">
        <DialogHeader className="pr-10 sm:pr-12">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg min-w-0">
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            <span className="truncate min-w-0">Account Summary</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Balance Card */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800">
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-bold mb-2 text-emerald-600 dark:text-emerald-400">Current Balance</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-base sm:text-lg">Mobi Wallet:</span>
                <span className="text-lg sm:text-xl font-bold">
                  {mobiBalance.toLocaleString()} Mobi
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-base sm:text-lg">Credit Wallet:</span>
                <span className="text-lg sm:text-xl font-bold">
                  ₦{creditBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Card className="p-3 sm:p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400">Total Received</p>
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base">
                      Mobi Wallet: <span className="font-bold">{mobiReceived.toLocaleString()} Mobi</span>
                    </p>
                    <p className="text-sm sm:text-base">
                      Credit Wallet: <span className="font-bold">₦{creditReceived.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 shrink-0" />
              </div>
            </Card>

            <Card className="p-3 sm:p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-base sm:text-lg font-semibold text-red-600">Total Spent</p>
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base">
                      Mobi Wallet: <span className="font-bold">{mobiSpent.toLocaleString()} Mobi</span>
                    </p>
                    <p className="text-sm sm:text-base">
                      Credit Wallet: <span className="font-bold">₦{creditSpent.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
                <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 shrink-0" />
              </div>
            </Card>
          </div>

          {/* Recent Transactions Card Button */}
          <Card 
            className="p-4 hover:bg-accent/50 cursor-pointer transition-colors border-blue-200 dark:border-blue-800/50"
            onClick={() => setShowTransactions(true)}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-base font-medium text-blue-600 dark:text-blue-400">
                  View Recent Transactions
                </span>
              </div>
              <svg 
                className="h-5 w-5 text-blue-600 dark:text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Card>
        </div>
      </DialogContent>

      <RecentTransactionsDialog 
        open={showTransactions}
        onOpenChange={setShowTransactions}
        currencySymbol={currencySymbol}
      />
    </Dialog>
  );
};
