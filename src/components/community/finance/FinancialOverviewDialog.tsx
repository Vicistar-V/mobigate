import { useState } from "react";
import { X, Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { mockWalletData, mockTransactions } from "@/data/financeData";
import { WalletTopUpDialog } from "./WalletTopUpDialog";
import { WalletTransferDialog } from "./WalletTransferDialog";
import { WalletWithdrawDialog } from "./WalletWithdrawDialog";
import { DualCurrencyDisplay, formatDualCurrency } from "@/components/common/DualCurrencyDisplay";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";

interface FinancialOverviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinancialOverviewDialog({ open, onOpenChange }: FinancialOverviewDialogProps) {
  const [walletData] = useState(mockWalletData);
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  const handleTopUp = () => {
    setShowTopUpDialog(true);
  };

  const handleTransfer = () => {
    setShowTransferDialog(true);
  };

  const handleWithdraw = () => {
    setShowWithdrawDialog(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0 sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Financial Overview</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-80px)]">
          <div className="p-4 sm:p-6 space-y-4">
            {/* Wallet Balance Card */}
            <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
                    <h2 className="text-3xl font-bold">
                      M{walletData.balance.toLocaleString()}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      ≈ ₦{walletData.balance.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Last updated: {walletData.lastUpdated.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={handleTopUp} className="flex-col h-auto py-4 gap-2">
                <ArrowDownRight className="h-5 w-5" />
                <span className="text-xs">Top Up</span>
              </Button>
              <Button onClick={handleTransfer} variant="outline" className="flex-col h-auto py-4 gap-2">
                <RefreshCw className="h-5 w-5" />
                <span className="text-xs">Transfer</span>
              </Button>
              <Button onClick={handleWithdraw} variant="outline" className="flex-col h-auto py-4 gap-2">
                <ArrowUpRight className="h-5 w-5" />
                <span className="text-xs">Withdraw</span>
              </Button>
            </div>

            {/* Monthly Summary */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-green-500/10 p-2 rounded-full">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-xs text-muted-foreground">Income</p>
                  </div>
                  <p className="text-xl font-bold text-green-600">
                    +M{walletData.monthlyIncome.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    (₦{walletData.monthlyIncome.toLocaleString()})
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-red-500/10 p-2 rounded-full">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    </div>
                    <p className="text-xs text-muted-foreground">Expenses</p>
                  </div>
                  <p className="text-xl font-bold text-red-600">
                    -M{walletData.monthlyExpenditure.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    (₦{walletData.monthlyExpenditure.toLocaleString()})
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === "credit" 
                          ? "bg-green-500/10" 
                          : "bg-red-500/10"
                      }`}>
                        {transaction.type === "credit" ? (
                          <ArrowDownRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <DualCurrencyDisplay
                        mobiAmount={transaction.amount}
                        transactionType={transaction.type}
                        showSign="auto"
                        size="sm"
                      />
                      <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="text-xs mt-1">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>

    {/* Wallet Action Dialogs */}
    <WalletTopUpDialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog} />
    <WalletTransferDialog open={showTransferDialog} onOpenChange={setShowTransferDialog} />
    <WalletWithdrawDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog} />
    </>
  );
}
