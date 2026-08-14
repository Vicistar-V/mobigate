import { useState, useEffect, useCallback } from "react";
import {
  Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  RefreshCw, Shield, AlertTriangle, CheckCircle, ArrowDown, ArrowUp,
  ArrowDownLeft, ChevronRight, Loader2, Building2, Send, Download,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { WalletTopUpDialog } from "./WalletTopUpDialog";
import { WalletTransferDialog } from "./WalletTransferDialog";
import { WalletWithdrawDialog } from "./WalletWithdrawDialog";
import { TransactionDetailDrawer, TransactionDetail } from "./TransactionDetailDrawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "react-swipeable";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const API = "/api/community";

function amtFmt(n: number) {
  return "₦" + Number(n).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function timeAgo(d: string) {
  try { return formatDistanceToNow(new Date(d), { addSuffix: true }); } catch { return ""; }
}
function txnColor(type: string) {
  return ["income","topup"].includes(type) ? "text-green-600" : "text-red-600";
}
function txnBg(type: string) {
  return ["income","topup"].includes(type) ? "bg-green-100" : "bg-red-100";
}
function txnIcon(type: string) {
  return ["income","topup"].includes(type) ? ArrowDownRight : ArrowUpRight;
}
function txnSign(type: string) {
  return ["income","topup"].includes(type) ? "+" : "-";
}

interface FinancialOverviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId?: string;
  isAdmin?: boolean;
  isOwner?: boolean;
}

export function FinancialOverviewDialog({
  open, onOpenChange, communityId, isAdmin = false, isOwner = false,
}: FinancialOverviewDialogProps) {
  const isMobile = useIsMobile();

  // ── Real finance data ────────────────────────────────────────────────────
  const [loading,       setLoading]       = useState(false);
  const [balance,       setBalance]       = useState(0);
  const [totalIncome,   setTotalIncome]   = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExp,    setMonthlyExp]    = useState(0);
  const [transactions,  setTransactions]  = useState<any[]>([]);
  const [bankAccounts,  setBankAccounts]  = useState<any[]>([]);
  const [members,       setMembers]       = useState<any[]>([]);
  const [pendingTxns,   setPendingTxns]   = useState<any[]>([]);
  const [dues,          setDues]          = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    if (!communityId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/finance.php?community_id=${communityId}`, { credentials: "include" });
      if (!res.ok) return;
      const d = await res.json();
      setBalance(parseFloat(d.account?.balance ?? 0));
      setTotalIncome(parseFloat(d.account?.total_income ?? 0));
      setTotalExpenses(parseFloat(d.account?.total_expenses ?? 0));
      setTransactions(d.transactions ?? []);
      setBankAccounts(d.bankAccounts ?? []);
      setMembers(d.members ?? []);
      setPendingTxns(d.pendingTxns ?? []);
      setDues(d.dues ?? []);

      // Compute monthly income / expenses from transactions this month
      const now = new Date();
      const thisMo = (d.transactions ?? []).filter((t: any) => {
        const td = new Date(t.created_at);
        return td.getMonth() === now.getMonth() && td.getFullYear() === now.getFullYear();
      });
      setMonthlyIncome(thisMo.filter((t: any) => ["income","topup"].includes(t.type)).reduce((s: number, t: any) => s + parseFloat(t.amount), 0));
      setMonthlyExp(thisMo.filter((t: any) => !["income","topup"].includes(t.type)).reduce((s: number, t: any) => s + parseFloat(t.amount), 0));
    } catch {}
    finally { setLoading(false); }
  }, [communityId]);

  useEffect(() => { if (open) fetchData(); }, [open, fetchData]);

  // ── UI states ────────────────────────────────────────────────────────────
  const [walletIndex,          setWalletIndex]          = useState(0);
  const [showTopUpDialog,      setShowTopUpDialog]      = useState(false);
  const [showTransferDialog,   setShowTransferDialog]   = useState(false);
  const [showWithdrawDialog,   setShowWithdrawDialog]   = useState(false);
  const [selectedTransaction,  setSelectedTransaction]  = useState<TransactionDetail | null>(null);

  const swipeHandlers = useSwipeable({
    onSwipedLeft:  () => setWalletIndex(1),
    onSwipedRight: () => setWalletIndex(0),
    trackMouse: false, preventScrollOnSwipe: true, delta: 50,
  });

  // ── Wallet balance carousel ───────────────────────────────────────────────
  const WalletCarousel = () => (
    <div className="space-y-2">
      <div {...swipeHandlers} className="overflow-hidden rounded-xl touch-pan-y">
        <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${walletIndex * 100}%)` }}>
          {/* Slide 1: Main wallet */}
          <div className="min-w-full px-1">
            <Card className="bg-gradient-to-br from-primary/15 via-primary/8 to-background border-primary/20 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge variant="outline" className="text-xs px-1.5 py-0 mb-1 font-semibold">Main Wallet</Badge>
                    <p className="text-xs text-muted-foreground">Total Balance</p>
                    {loading ? (
                      <div className="flex items-center gap-2 mt-1"><Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm text-muted-foreground">Loading…</span></div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold">{amtFmt(balance)}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Total in: {amtFmt(totalIncome)} | Out: {amtFmt(totalExpenses)}</p>
                      </>
                    )}
                  </div>
                  <div className="bg-primary/15 p-2.5 rounded-full"><Wallet className="h-5 w-5 text-primary" /></div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">+{amtFmt(monthlyIncome)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 text-red-600" />
                    <span className="text-xs text-red-600 font-medium">-{amtFmt(monthlyExp)}</span>
                  </div>
                  {loading && <Loader2 className="h-3 w-3 animate-spin ml-auto text-muted-foreground" />}
                  {!loading && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={fetchData}>
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Slide 2: Bank accounts summary */}
          <div className="min-w-full px-1">
            <Card className="bg-gradient-to-br from-blue-500/15 via-blue-400/8 to-background border-blue-300/30 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge variant="outline" className="text-xs px-1.5 py-0 mb-1 border-blue-300 text-blue-600 font-semibold bg-blue-50">Bank Accounts</Badge>
                    <p className="text-xs text-muted-foreground">{bankAccounts.length} registered account{bankAccounts.length !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="bg-blue-500/15 p-2.5 rounded-full"><Building2 className="h-5 w-5 text-blue-600" /></div>
                </div>
                {bankAccounts.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No bank accounts added yet. Add one to enable withdrawals.</p>
                ) : (
                  <div className="space-y-1.5">
                    {bankAccounts.slice(0, 3).map((acc: any) => (
                      <div key={acc.id} className="flex items-center justify-between p-2 rounded-lg bg-blue-50/50">
                        <div>
                          <p className="text-xs font-semibold">{acc.bank_name}</p>
                          <p className="text-xs text-muted-foreground">{acc.account_number} • {acc.account_name}</p>
                        </div>
                        {acc.is_primary && <Badge className="text-[10px] px-1.5 bg-primary/10 text-primary">Primary</Badge>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2">
        {[0, 1].map(idx => (
          <button key={idx} onClick={() => setWalletIndex(idx)}
            className={cn("rounded-full transition-all duration-300", walletIndex === idx ? "h-2 w-7 bg-primary" : "h-2 w-2 bg-muted-foreground/30")} />
        ))}
      </div>
    </div>
  );

  // ── Main wallet tab ───────────────────────────────────────────────────────
  const MainWalletContent = () => (
    <div className="space-y-4">
      {/* Pending authorizations alert */}
      {pendingTxns.length > 0 && (
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-700">{pendingTxns.length} transaction{pendingTxns.length > 1 ? "s" : ""} pending authorization</p>
              <p className="text-xs text-amber-600">Officers need to sign before they can execute.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      {(isAdmin || isOwner) && (
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={() => setShowTopUpDialog(true)} className="flex-col h-auto py-3 gap-1.5">
            <ArrowDownRight className="h-4 w-4" /><span className="text-xs">Top Up</span>
          </Button>
          <Button onClick={() => setShowTransferDialog(true)} variant="outline" className="flex-col h-auto py-3 gap-1.5">
            <Send className="h-4 w-4" /><span className="text-xs">Transfer</span>
          </Button>
          <Button onClick={() => setShowWithdrawDialog(true)} variant="outline" className="flex-col h-auto py-3 gap-1.5"
            disabled={bankAccounts.length === 0}>
            <Download className="h-4 w-4" /><span className="text-xs">Withdraw</span>
          </Button>
        </div>
      )}

      {/* Monthly summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-green-600" />
              <p className="text-xs text-muted-foreground">Income this month</p>
            </div>
            <p className="text-lg font-bold text-green-600">+{amtFmt(monthlyIncome)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-3.5 w-3.5 text-red-600" />
              <p className="text-xs text-muted-foreground">Expenses this month</p>
            </div>
            <p className="text-lg font-bold text-red-600">-{amtFmt(monthlyExp)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Active dues / levies */}
      {dues.filter((d: any) => d.is_active).length > 0 && (
        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm">Active Dues & Levies</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2">
            {dues.filter((d: any) => d.is_active).slice(0, 3).map((due: any) => {
              const total = due.total_members > 0 ? due.total_members : 1;
              const pct = Math.min(100, ((due.paid_count || 0) / total) * 100);
              return (
                <div key={due.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{due.name}</span>
                    <span className="text-muted-foreground">{due.paid_count}/{total} paid</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Target: {amtFmt(parseFloat(due.amount) * total)}</span>
                    <span>Collected: {amtFmt(parseFloat(due.amount_collected || 0))}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Recent transactions */}
      <Card>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 space-y-2">
          {loading && transactions.length === 0 ? (
            <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No transactions yet</p>
          ) : transactions.slice(0, 8).map((txn: any) => {
            const Icon = txnIcon(txn.type);
            return (
              <button key={txn.id}
                className="p-2.5 rounded-lg border space-y-1.5 w-full text-left hover:bg-muted/40 active:bg-muted/60 transition-all"
                onClick={() => setSelectedTransaction({
                  id: txn.id,
                  description: txn.description,
                  amount: parseFloat(txn.amount),
                  date: new Date(txn.created_at),
                  type: ["income","topup"].includes(txn.type) ? "credit" : "debit",
                  status: txn.status as any,
                  category: txn.category || txn.type,
                  reference: txn.reference_number,
                })}>
                <div className="flex items-start gap-2">
                  <div className={cn("p-1.5 rounded-full shrink-0 mt-0.5", txnBg(txn.type))}>
                    <Icon className={cn("h-3.5 w-3.5", txnColor(txn.type))} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs truncate">{txn.description}</p>
                    {txn.member_name && <p className="text-xs text-muted-foreground truncate">{txn.member_name}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("text-sm font-bold", txnColor(txn.type))}>{txnSign(txn.type)}{amtFmt(parseFloat(txn.amount))}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pl-9">
                  <p className="text-xs text-muted-foreground">{timeAgo(txn.created_at)}</p>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={txn.status === "completed" ? "secondary" : "outline"} className="text-[10px] px-1">{txn.status}</Badge>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                  </div>
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );

  // ── Shared content wrapper ────────────────────────────────────────────────
  const content = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Balance carousel */}
      <div className="shrink-0 px-4 pt-4 pb-2">
        <WalletCarousel />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="px-4 pb-8">
          <MainWalletContent />
        </div>
      </div>

      {/* Dialogs */}
      <WalletTopUpDialog
        open={showTopUpDialog}
        onOpenChange={setShowTopUpDialog}
        communityId={communityId}
      />
      <WalletTransferDialog
        open={showTransferDialog}
        onOpenChange={(v) => { setShowTransferDialog(v); if (!v) fetchData(); }}
        communityId={communityId}
        walletBalance={balance}
        communityMembers={members}
      />
      <WalletWithdrawDialog
        open={showWithdrawDialog}
        onOpenChange={(v) => { setShowWithdrawDialog(v); if (!v) fetchData(); }}
        communityId={communityId}
        walletBalance={balance}
      />
      <TransactionDetailDrawer
        open={!!selectedTransaction}
        onOpenChange={(v) => !v && setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] h-[92vh] flex flex-col overflow-hidden">
          <DrawerTitle className="sr-only">Financial Overview</DrawerTitle>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-0 flex flex-col" style={{ height: "88vh", maxHeight: "88vh" }}>
        <DialogTitle className="sr-only">Financial Overview</DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
}
