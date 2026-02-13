import { useState } from "react";
import {
  Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  RefreshCw, Shield, AlertTriangle, CheckCircle, ArrowDown, ArrowUp,
  ArrowDownLeft, Settings, ChevronRight
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockWalletData, mockTransactions } from "@/data/financeData";
import { WalletTopUpDialog } from "./WalletTopUpDialog";
import { WalletTransferDialog } from "./WalletTransferDialog";
import { WalletWithdrawDialog } from "./WalletWithdrawDialog";
import { DualCurrencyDisplay } from "@/components/common/DualCurrencyDisplay";
import { QuizWalletDrawer } from "@/components/community/QuizWalletDrawer";
import {
  communityQuizWalletData,
  getQuizWalletAvailability,
  QuizWalletTransaction,
} from "@/data/communityQuizData";
import { formatLocalAmount, formatLocalFirst } from "@/lib/mobiCurrencyTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "react-swipeable";
import { cn } from "@/lib/utils";
import { TransactionDetailDrawer, TransactionDetail } from "./TransactionDetailDrawer";

interface FinancialOverviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
  isOwner?: boolean;
}

// --- Transaction type config for quiz wallet ---
const txTypeConfig: Record<QuizWalletTransaction["type"], { icon: typeof ArrowDown; color: string; bg: string; label: string }> = {
  stake_income:   { icon: ArrowDownLeft,  color: "text-green-600",  bg: "bg-green-100 dark:bg-green-900/40",  label: "Stake In" },
  winning_payout: { icon: ArrowUpRight,   color: "text-red-600",    bg: "bg-red-100 dark:bg-red-900/40",      label: "Payout" },
  transfer_in:    { icon: ArrowDown,      color: "text-blue-600",   bg: "bg-blue-100 dark:bg-blue-900/40",    label: "Transfer In" },
  transfer_out:   { icon: ArrowUp,        color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/40", label: "Transfer Out" },
};

export function FinancialOverviewDialog({
  open,
  onOpenChange,
  isAdmin = false,
  isOwner = false,
}: FinancialOverviewDialogProps) {
  const isMobile = useIsMobile();
  const [walletData] = useState(mockWalletData);
  const [walletIndex, setWalletIndex] = useState(0);
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showQuizWalletDrawer, setShowQuizWalletDrawer] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);

  const quizWallet = communityQuizWalletData;
  const quizAvailability = getQuizWalletAvailability();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setWalletIndex(1),
    onSwipedRight: () => setWalletIndex(0),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 50,
  });

  const sortedQuizTxns = [...quizWallet.transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // ----- Wallet Carousel -----
  const WalletCarousel = () => (
    <div className="space-y-2">
      {/* Carousel Container */}
      <div
        {...swipeHandlers}
        className="overflow-hidden rounded-xl touch-pan-y"
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${walletIndex * 100}%)` }}
        >
          {/* Slide 1: Community Main Wallet */}
          <div className="min-w-full px-1">
            <Card className="bg-gradient-to-br from-red-500/15 via-red-400/8 to-background border-red-300/30 dark:border-red-700/30 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge variant="outline" className="text-xs px-1.5 py-0 border-red-300 text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-950/40">
                        Main Wallet
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
                    <h2 className="text-2xl font-bold">
                      ₦{walletData.balance.toLocaleString()}.00
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      (M{walletData.balance.toLocaleString()})
                    </p>
                  </div>
                  <div className="bg-red-500/15 p-2.5 rounded-full">
                    <Wallet className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                {/* Income / Expenses row */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="bg-green-500/10 p-1 rounded-full">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-xs text-green-600 font-medium">
                      +₦{walletData.monthlyIncome.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="bg-red-500/10 p-1 rounded-full">
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    </div>
                    <span className="text-xs text-red-600 font-medium">
                      -₦{walletData.monthlyExpenditure.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: {walletData.lastUpdated.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Slide 2: Quiz Wallet */}
          <div className="min-w-full px-1">
            <Card className="bg-gradient-to-br from-blue-500/15 via-blue-400/8 to-background border-blue-300/30 dark:border-blue-700/30 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge variant="outline" className="text-xs px-1.5 py-0 border-blue-300 text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/40">
                        Quiz Wallet
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
                    <h2 className="text-2xl font-bold">
                      ₦{quizWallet.balance.toLocaleString()}.00
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      (M{quizWallet.balance.toLocaleString()})
                    </p>
                  </div>
                  <div className="bg-blue-500/15 p-2.5 rounded-full">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                {/* Available / Reserved row */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-blue-50/60 dark:bg-blue-900/20 rounded-lg p-2">
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                      ₦{quizWallet.availableBalance.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-amber-50/60 dark:bg-amber-900/20 rounded-lg p-2">
                    <p className="text-xs text-muted-foreground">Reserved</p>
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                      ₦{quizWallet.reservedForPayouts.toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: {quizWallet.lastUpdated.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2">
        {[0, 1].map((idx) => (
          <button
            key={idx}
            onClick={() => setWalletIndex(idx)}
            className={cn(
              "rounded-full transition-all duration-300",
              walletIndex === idx
                ? cn(
                    "h-2 w-7",
                    idx === 0 ? "bg-red-500" : "bg-blue-500"
                  )
                : "h-2 w-2 bg-muted-foreground/30"
            )}
            aria-label={idx === 0 ? "Main Wallet" : "Quiz Wallet"}
          />
        ))}
      </div>
    </div>
  );

  // ----- Main Wallet Content -----
  const MainWalletContent = () => (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button onClick={() => setShowTopUpDialog(true)} className="flex-col h-auto py-3 gap-1.5 touch-manipulation active:scale-[0.98]">
          <ArrowDownRight className="h-4 w-4" />
          <span className="text-xs">Top Up</span>
        </Button>
        <Button onClick={() => setShowTransferDialog(true)} variant="outline" className="flex-col h-auto py-3 gap-1.5 touch-manipulation active:scale-[0.98]">
          <RefreshCw className="h-4 w-4" />
          <span className="text-xs">Transfer</span>
        </Button>
        <Button onClick={() => setShowWithdrawDialog(true)} variant="outline" className="flex-col h-auto py-3 gap-1.5 touch-manipulation active:scale-[0.98]">
          <ArrowUpRight className="h-4 w-4" />
          <span className="text-xs">Withdraw</span>
        </Button>
      </div>

      {/* Monthly Summary */}
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
            <p className="text-xs text-muted-foreground mt-0.5">
              (M{walletData.monthlyIncome.toLocaleString()})
            </p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
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
            <p className="text-xs text-muted-foreground mt-0.5">
              (M{walletData.monthlyExpenditure.toLocaleString()})
            </p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
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
            <button
              key={transaction.id}
              className="p-2.5 rounded-lg border space-y-1.5 w-full text-left touch-manipulation active:bg-muted/60 active:scale-[0.98] transition-all"
              onClick={() => setSelectedTransaction({
                id: transaction.id,
                description: transaction.description,
                amount: transaction.amount,
                date: transaction.date,
                type: transaction.type,
                status: transaction.status,
                category: transaction.category,
              })}
            >
              {/* Row 1: Icon + Description + Amount */}
              <div className="flex items-start gap-2">
                <div className={`p-1.5 rounded-full shrink-0 mt-0.5 ${
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
                </div>
                <div className="text-right shrink-0 flex flex-col items-end">
                  <DualCurrencyDisplay
                    mobiAmount={transaction.amount}
                    transactionType={transaction.type}
                    showSign="auto"
                    size="sm"
                    showMobiInline={false}
                  />
                  <p className="text-xs text-muted-foreground">
                    (M{Math.abs(transaction.amount).toLocaleString()})
                  </p>
                </div>
              </div>
              {/* Row 2: Date + Status + Chevron */}
              <div className="flex items-center justify-between pl-9">
                <p className="text-xs text-muted-foreground">
                  {transaction.date.toLocaleDateString()}
                </p>
                <div className="flex items-center gap-1.5">
                  <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="text-xs">
                    {transaction.status}
                  </Badge>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  // ----- Quiz Wallet Content -----
  const QuizWalletContent = () => (
    <div className="space-y-4">
      {/* Availability Banner */}
      {!quizAvailability.available ? (
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700">
          <CardContent className="p-3 flex items-start gap-2.5">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                {quizAvailability.reason}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                Required reserve: ₦{quizAvailability.totalRequired.toLocaleString()} — Fund from Main Wallet to resume games.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
          <CardContent className="p-3 flex items-center gap-2.5">
            <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
            <p className="text-xs text-green-700 dark:text-green-400 font-medium">
              Quiz Wallet has sufficient funds — All games active
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardContent className="p-2.5 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Stakes In</p>
            <p className="text-sm font-bold text-green-600">
              ₦{quizWallet.totalStakeIncome.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">(M{quizWallet.totalStakeIncome.toLocaleString()})</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2.5 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Payouts</p>
            <p className="text-sm font-bold text-red-600">
              ₦{quizWallet.totalWinningPayouts.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">(M{quizWallet.totalWinningPayouts.toLocaleString()})</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2.5 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Net</p>
            <p className={cn(
              "text-sm font-bold",
              (quizWallet.totalStakeIncome - quizWallet.totalWinningPayouts) >= 0
                ? "text-green-600"
                : "text-red-600"
            )}>
              ₦{Math.abs(quizWallet.totalStakeIncome - quizWallet.totalWinningPayouts).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              (M{Math.abs(quizWallet.totalStakeIncome - quizWallet.totalWinningPayouts).toLocaleString()})
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transfer Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="flex-col h-auto py-3 gap-1.5 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/40"
          onClick={() => setShowQuizWalletDrawer(true)}
        >
          <ArrowDown className="h-4 w-4 text-blue-600" />
          <span className="text-xs text-blue-700 dark:text-blue-400">Fund from Main</span>
        </Button>
        <Button
          variant="outline"
          className="flex-col h-auto py-3 gap-1.5 border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/40"
          onClick={() => setShowQuizWalletDrawer(true)}
        >
          <ArrowUp className="h-4 w-4 text-orange-600" />
          <span className="text-xs text-orange-700 dark:text-orange-400">Transfer to Main</span>
        </Button>
      </div>

      {/* Manage Quiz Wallet (Admin) */}
      {(isAdmin || isOwner) && (
        <Button
          variant="outline"
          className="w-full h-10 text-primary border-primary/20 hover:bg-primary/5"
          onClick={() => setShowQuizWalletDrawer(true)}
        >
          <Settings className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Manage Quiz Wallet</span>
        </Button>
      )}

      {/* Quiz Wallet Transactions */}
      <Card>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm">Quiz Wallet Transactions</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 space-y-2">
          {sortedQuizTxns.map((tx) => {
            const config = txTypeConfig[tx.type];
            const Icon = config.icon;
            const isPositive = tx.type === "stake_income" || tx.type === "transfer_in";
            return (
              <button
                key={tx.id}
                className="p-2.5 rounded-lg border space-y-1.5 w-full text-left touch-manipulation active:bg-muted/60 active:scale-[0.98] transition-all"
                onClick={() => setSelectedTransaction({
                  id: tx.id,
                  description: tx.description,
                  amount: tx.amount,
                  date: new Date(tx.date),
                  quizType: tx.type,
                  reference: tx.reference,
                  playerName: tx.playerName,
                  relatedQuizId: tx.relatedQuizId,
                  status: "completed",
                })}
              >
                {/* Row 1: Icon + Description + Amount */}
                <div className="flex items-start gap-2">
                  <div className={cn("p-1.5 rounded-full shrink-0 mt-0.5", config.bg)}>
                    <Icon className={cn("h-3.5 w-3.5", config.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs truncate">{tx.description}</p>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end">
                    <p className={cn(
                      "text-sm font-semibold",
                      isPositive ? "text-green-600" : "text-red-600"
                    )}>
                      {isPositive ? "+" : "-"}₦{tx.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      (M{tx.amount.toLocaleString()})
                    </p>
                  </div>
                </div>
                {/* Row 2: Date + Player Badge + Chevron */}
                <div className="flex items-center justify-between pl-9">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                    {tx.playerName && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        {tx.playerName}
                      </Badge>
                    )}
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );

  // Shared content component
  const content = (
    <div className="flex-1 min-h-0 overflow-y-auto touch-auto overscroll-contain">
      <div className="px-2 pb-6 space-y-4">
        {/* Swipeable Wallet Carousel */}
        <WalletCarousel />

        {/* Dynamic Content Based on Active Wallet */}
        {walletIndex === 0 ? <MainWalletContent /> : <QuizWalletContent />}
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
            {content}
          </DrawerContent>
        </Drawer>

        <WalletTopUpDialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog} />
        <WalletTransferDialog open={showTransferDialog} onOpenChange={setShowTransferDialog} />
        <WalletWithdrawDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog} />
        <QuizWalletDrawer open={showQuizWalletDrawer} onOpenChange={setShowQuizWalletDrawer} />
        <TransactionDetailDrawer open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)} transaction={selectedTransaction} />
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
          {content}
        </DialogContent>
      </Dialog>

      <WalletTopUpDialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog} />
      <WalletTransferDialog open={showTransferDialog} onOpenChange={setShowTransferDialog} />
      <WalletWithdrawDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog} />
      <QuizWalletDrawer open={showQuizWalletDrawer} onOpenChange={setShowQuizWalletDrawer} />
      <TransactionDetailDrawer open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)} transaction={selectedTransaction} />
    </>
  );
}
