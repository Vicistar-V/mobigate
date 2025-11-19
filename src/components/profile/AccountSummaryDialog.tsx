import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { RecentTransactionsDialog } from "./RecentTransactionsDialog";
import { useWalletBalance, useWalletStats } from "@/hooks/useWindowData";

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
  const walletData = useWalletBalance();
  const walletStats = useWalletStats();
  
  const mobiBalance = walletData.mobi;
  const creditBalance = walletData.credit;
  const mobiReceived = walletStats.mobiReceived;
  const creditReceived = walletStats.creditReceived;
  const mobiSpent = walletStats.mobiSpent;
  const creditSpent = walletStats.creditSpent;

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
            <Card className="p-3 sm:p-4 border-blue-200 dark:border-blue-800/30 bg-blue-50/60 dark:bg-blue-950/20">
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

            <Card className="p-3 sm:p-4 border-red-200 dark:border-red-800/30 bg-red-50/60 dark:bg-red-950/20">
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
            className="p-3 hover:bg-accent/80 cursor-pointer transition-all duration-200 bg-accent border-accent"
            onClick={() => setShowTransactions(true)}
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                Recent Transactions
              </span>
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
