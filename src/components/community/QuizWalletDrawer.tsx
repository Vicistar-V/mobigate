import { useState } from "react";
import { 
  Wallet, ArrowDownLeft, ArrowUpRight, ArrowDown, ArrowUp, 
  Shield, AlertTriangle, CheckCircle, Send, X, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { 
  communityQuizWalletData, 
  getQuizWalletAvailability,
  QuizWalletTransaction 
} from "@/data/communityQuizData";
import { formatLocalAmount, formatMobiAmount, formatLocalFirst } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface QuizWalletDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TransferMode = null | "fund" | "withdraw";

const txTypeConfig: Record<QuizWalletTransaction["type"], { icon: typeof ArrowDown; color: string; bg: string; label: string }> = {
  stake_income:   { icon: ArrowDownLeft,  color: "text-green-600",  bg: "bg-green-100 dark:bg-green-900/40",  label: "Stake In" },
  winning_payout: { icon: ArrowUpRight,   color: "text-red-600",    bg: "bg-red-100 dark:bg-red-900/40",      label: "Payout" },
  transfer_in:    { icon: ArrowDown,      color: "text-blue-600",   bg: "bg-blue-100 dark:bg-blue-900/40",    label: "Transfer In" },
  transfer_out:   { icon: ArrowUp,        color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/40", label: "Transfer Out" },
};

export function QuizWalletDrawer({ open, onOpenChange }: QuizWalletDrawerProps) {
  const { toast } = useToast();
  const [transferMode, setTransferMode] = useState<TransferMode>(null);
  const [transferAmount, setTransferAmount] = useState("");
  const wallet = communityQuizWalletData;
  const availability = getQuizWalletAvailability();

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Enter a valid amount.", variant: "destructive" });
      return;
    }
    if (transferMode === "withdraw" && amount > wallet.availableBalance) {
      toast({ title: "Insufficient Available Balance", description: "You can only transfer the available balance (excluding reserved funds).", variant: "destructive" });
      return;
    }
    toast({
      title: transferMode === "fund" ? "Funds Received" : "Transfer Sent",
      description: `${formatLocalFirst(amount, "NGN")} ${transferMode === "fund" ? "funded from" : "transferred to"} Main Community Wallet.`,
    });
    setTransferMode(null);
    setTransferAmount("");
  };

  const sortedTxns = [...wallet.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const netPosition = wallet.totalStakeIncome - wallet.totalWinningPayouts;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[92vh] overflow-hidden touch-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Quiz Wallet</h2>
                  <p className="text-xs text-blue-100">Dedicated funds for Quiz Games</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Scrollable Body */}
          <ScrollArea className="flex-1 overflow-y-auto touch-auto">
            <div className="p-4 space-y-4 pb-8">
              {/* Balance Card */}
              <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-background">
                <CardContent className="p-4 space-y-3">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Total Balance</p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                      {formatLocalAmount(wallet.balance, "NGN")}
                    </p>
                    <p className="text-sm text-muted-foreground">({formatMobiAmount(wallet.balance)})</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-green-50 dark:bg-green-950/30 rounded-lg text-center border border-green-200">
                      <p className="text-[10px] text-muted-foreground">Available</p>
                      <p className="font-bold text-sm text-green-600">{formatLocalAmount(wallet.availableBalance, "NGN")}</p>
                      <p className="text-[9px] text-muted-foreground">({formatMobiAmount(wallet.availableBalance)})</p>
                    </div>
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-center border border-amber-200">
                      <p className="text-[10px] text-muted-foreground">Reserved for Payouts</p>
                      <p className="font-bold text-sm text-amber-600">{formatLocalAmount(wallet.reservedForPayouts, "NGN")}</p>
                      <p className="text-[9px] text-muted-foreground">({formatMobiAmount(wallet.reservedForPayouts)})</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Availability Banner */}
              {!availability.available ? (
                <div className="flex items-start gap-2.5 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Insufficient Funds</p>
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                      Quiz Game Unavailable Right Now! Please fund the Quiz Wallet from the Main Community Wallet.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Required reserve: {formatLocalFirst(availability.totalRequired, "NGN")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                  <p className="text-xs text-green-700 dark:text-green-400 font-medium">Quiz Wallet has sufficient funds. All games are active.</p>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center border border-blue-200">
                  <p className="text-[10px] text-muted-foreground">Stakes In</p>
                  <p className="font-bold text-sm text-blue-600">{formatLocalAmount(wallet.totalStakeIncome, "NGN")}</p>
                </div>
                <div className="p-2.5 bg-red-50 dark:bg-red-950/30 rounded-lg text-center border border-red-200">
                  <p className="text-[10px] text-muted-foreground">Payouts</p>
                  <p className="font-bold text-sm text-red-600">{formatLocalAmount(wallet.totalWinningPayouts, "NGN")}</p>
                </div>
                <div className={cn("p-2.5 rounded-lg text-center border", netPosition >= 0 ? "bg-green-50 dark:bg-green-950/30 border-green-200" : "bg-red-50 dark:bg-red-950/30 border-red-200")}>
                  <p className="text-[10px] text-muted-foreground">Net Position</p>
                  <p className={cn("font-bold text-sm", netPosition >= 0 ? "text-green-600" : "text-red-600")}>
                    {netPosition >= 0 ? "+" : ""}{formatLocalAmount(netPosition, "NGN")}
                  </p>
                </div>
              </div>

              {/* Transfer Actions */}
              {transferMode === null ? (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="h-12 border-blue-300 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-medium text-sm"
                    onClick={() => setTransferMode("fund")}
                  >
                    <ArrowDown className="h-4 w-4 mr-2" />
                    Fund from Main
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-orange-300 text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/30 font-medium text-sm"
                    onClick={() => setTransferMode("withdraw")}
                  >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Transfer to Main
                  </Button>
                </div>
              ) : (
                <Card className={cn("border-2", transferMode === "fund" ? "border-blue-300" : "border-orange-300")}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">
                        {transferMode === "fund" ? "Fund from Main Wallet" : "Transfer to Main Wallet"}
                      </h4>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setTransferMode(null); setTransferAmount(""); }}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₦</span>
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="pl-8 h-12 text-lg font-semibold touch-manipulation"
                        autoComplete="off"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {transferAmount && parseFloat(transferAmount) > 0 && (
                      <p className="text-xs text-muted-foreground text-center">
                        ≈ {formatMobiAmount(parseFloat(transferAmount))}
                      </p>
                    )}
                    {transferMode === "withdraw" && (
                      <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <Info className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-700">Max transferable: {formatLocalFirst(wallet.availableBalance, "NGN")} (reserved funds excluded)</p>
                      </div>
                    )}
                    <Button
                      className={cn("w-full h-11 font-semibold", transferMode === "fund" ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-600 hover:bg-orange-700")}
                      onClick={handleTransfer}
                      disabled={!transferAmount || parseFloat(transferAmount) <= 0}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Confirm {transferMode === "fund" ? "Funding" : "Transfer"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Wallet Funding Summary */}
              <Card className="border-blue-100 dark:border-blue-900">
                <CardContent className="p-3 space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Funding Summary</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <ArrowDown className="h-3 w-3 text-blue-500" /> Income from Main Wallet
                      </span>
                      <span className="font-medium text-blue-600">{formatLocalAmount(wallet.incomeFromMainWallet, "NGN")}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <ArrowUp className="h-3 w-3 text-orange-500" /> Transfers to Main Wallet
                      </span>
                      <span className="font-medium text-orange-600">{formatLocalAmount(wallet.transfersToMainWallet, "NGN")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction History */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">Transaction History</h4>
                {sortedTxns.map((tx) => {
                  const config = txTypeConfig[tx.type];
                  const Icon = config.icon;
                  const isDebit = tx.type === "winning_payout" || tx.type === "transfer_out";
                  return (
                    <div key={tx.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                      <div className={cn("p-2 rounded-full shrink-0", config.bg)}>
                        <Icon className={cn("h-4 w-4", config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{tx.description}</p>
                        <div className="flex items-center gap-2 flex-wrap mt-0.5">
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0">{config.label}</Badge>
                          {tx.playerName && (
                            <span className="text-[10px] text-muted-foreground">{tx.playerName}</span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(tx.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })} • {tx.reference}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={cn("font-bold text-sm", isDebit ? "text-red-600" : "text-green-600")}>
                          {isDebit ? "-" : "+"}{formatLocalAmount(tx.amount, "NGN")}
                        </p>
                        <p className="text-[9px] text-muted-foreground">
                          ({isDebit ? "-" : "+"}{formatMobiAmount(tx.amount)})
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
