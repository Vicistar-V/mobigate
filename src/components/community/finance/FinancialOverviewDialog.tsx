import { useState } from "react";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockWalletData, mockTransactions } from "@/data/financeData";
import { WalletTopUpDialog } from "./WalletTopUpDialog";
import { WalletTransferDialog } from "./WalletTransferDialog";
import { WalletWithdrawDialog } from "./WalletWithdrawDialog";
import { DualCurrencyDisplay } from "@/components/common/DualCurrencyDisplay";
import { useIsMobile } from "@/hooks/use-mobile";

interface FinancialOverviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinancialOverviewDialog({ open, onOpenChange }: FinancialOverviewDialogProps) {
  const isMobile = useIsMobile();
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

  // Shared content component for mobile and desktop
  const Content = () => (
    <div className="flex-1 min-h-0 overflow-y-auto touch-auto overscroll-contain">
      <div className="px-4 pb-6 space-y-4">
        {/* Wallet Balance Card - LOCAL CURRENCY PRIMARY */}
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
                <h2 className="text-2xl font-bold">
                  ₦{walletData.balance.toLocaleString()}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  (M{walletData.balance.toLocaleString()})
                </p>
              </div>
              <div className="bg-primary/10 p-2.5 rounded-full">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Last updated: {walletData.lastUpdated.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions - increased gap for proper spacing */}
        <div className="grid grid-cols-3 gap-3">
          <Button onClick={handleTopUp} className="flex-col h-auto py-3 gap-1.5">
            <ArrowDownRight className="h-4 w-4" />
            <span className="text-xs">Top Up</span>
          </Button>
          <Button onClick={handleTransfer} variant="outline" className="flex-col h-auto py-3 gap-1.5">
            <RefreshCw className="h-4 w-4" />
            <span className="text-xs">Transfer</span>
          </Button>
          <Button onClick={handleWithdraw} variant="outline" className="flex-col h-auto py-3 gap-1.5">
            <ArrowUpRight className="h-4 w-4" />
            <span className="text-xs">Withdraw</span>
          </Button>
        </div>

        {/* Monthly Summary - LOCAL CURRENCY PRIMARY */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-green-500/10 p-1.5 rounded-full">
                  <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                </div>
                <p className="text-xs text-muted-foreground">Income</p>
              </div>
              <p className="text-lg font-bold text-green-600">
                +₦{walletData.monthlyIncome.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                (M{walletData.monthlyIncome.toLocaleString()})
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-red-500/10 p-1.5 rounded-full">
                  <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                </div>
                <p className="text-xs text-muted-foreground">Expenses</p>
              </div>
              <p className="text-lg font-bold text-red-600">
                -₦{walletData.monthlyExpenditure.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                (M{walletData.monthlyExpenditure.toLocaleString()})
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2">
            {mockTransactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-2.5 rounded-lg border">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className={`p-1.5 rounded-full shrink-0 ${
                    transaction.type === "credit" 
                      ? "bg-green-500/10" 
                      : "bg-red-500/10"
                  }`}>
                    {transaction.type === "credit" ? (
                      <ArrowDownRight className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5 text-red-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs truncate">{transaction.description}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {transaction.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <DualCurrencyDisplay
                    mobiAmount={transaction.amount}
                    transactionType={transaction.type}
                    showSign="auto"
                    size="sm"
                  />
                  <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="text-[10px] mt-0.5">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Mobile: Bottom drawer pattern
  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[92vh] flex flex-col overflow-hidden">
            <DrawerHeader className="pb-2 border-b shrink-0">
              <DrawerTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Financial Overview
              </DrawerTitle>
            </DrawerHeader>
            <Content />
          </DrawerContent>
        </Drawer>

        {/* Wallet Action Dialogs */}
        <WalletTopUpDialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog} />
        <WalletTransferDialog open={showTransferDialog} onOpenChange={setShowTransferDialog} />
        <WalletWithdrawDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog} />
      </>
    );
  }

  // Desktop: Standard dialog
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-4 pt-4 pb-2 shrink-0 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Financial Overview
            </DialogTitle>
          </DialogHeader>
          <Content />
        </DialogContent>
      </Dialog>

      {/* Wallet Action Dialogs */}
      <WalletTopUpDialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog} />
      <WalletTransferDialog open={showTransferDialog} onOpenChange={setShowTransferDialog} />
      <WalletWithdrawDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog} />
    </>
  );
}
