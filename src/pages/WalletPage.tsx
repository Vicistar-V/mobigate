import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import {
  Wallet, ArrowUpRight, ArrowDownLeft, Plus, ChevronRight, ChevronLeft,
  Search, Filter, TrendingUp, TrendingDown, Clock, CheckCircle2,
  XCircle, AlertCircle, Coins, Banknote, Loader2, Sparkles, ShieldCheck
} from "lucide-react";
import { formatNumberFull } from "@/lib/financialDisplay";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// ── Mock wallet data ──
const LOCAL_WALLET = {
  balance: 347250.00,
  currency: "NGN",
  symbol: "₦",
  monthlyIn: 125000,
  monthlyOut: 78400,
};

const MOBI_WALLET = {
  balance: 347250.00,
  currency: "Mobi",
  symbol: "M",
  monthlyIn: 125000,
  monthlyOut: 78400,
};

interface WalletTransaction {
  id: string;
  type: "credit" | "debit";
  description: string;
  amount: number;
  date: Date;
  status: "completed" | "pending" | "failed";
  category: string;
  reference: string;
  counterparty?: string;
}

const MOCK_TRANSACTIONS: WalletTransaction[] = [
  { id: "wt-1", type: "credit", description: "Voucher Purchase - Mobi Merchant", amount: 50000, date: new Date(Date.now() - 1 * 60 * 60 * 1000), status: "completed", category: "Top-Up", reference: "TXN-20260228-001", counterparty: "QuickMart NG" },
  { id: "wt-2", type: "debit", description: "Quiz Entry Stake — Champions League", amount: 5000, date: new Date(Date.now() - 3 * 60 * 60 * 1000), status: "completed", category: "Quiz", reference: "TXN-20260228-002", counterparty: "Mobigate Quiz" },
  { id: "wt-3", type: "credit", description: "Quiz Winnings — History Masters", amount: 25000, date: new Date(Date.now() - 8 * 60 * 60 * 1000), status: "completed", category: "Winnings", reference: "TXN-20260227-003", counterparty: "Mobigate Quiz" },
  { id: "wt-4", type: "debit", description: "Community Monthly Dues", amount: 5000, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: "completed", category: "Dues", reference: "TXN-20260227-004", counterparty: "Lagos Devs Community" },
  { id: "wt-5", type: "debit", description: "Transfer to @chioma_blessed", amount: 12000, date: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), status: "completed", category: "Transfer", reference: "TXN-20260226-005", counterparty: "chioma_blessed" },
  { id: "wt-6", type: "credit", description: "Wallet Top-Up via Voucher", amount: 100000, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: "completed", category: "Top-Up", reference: "TXN-20260226-006", counterparty: "Mobigate Merchant" },
  { id: "wt-7", type: "debit", description: "Advert Submission Fee", amount: 8500, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: "completed", category: "Platform Fee", reference: "TXN-20260225-007", counterparty: "Mobigate Platform" },
  { id: "wt-8", type: "credit", description: "Referral Bonus", amount: 2500, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), status: "completed", category: "Bonus", reference: "TXN-20260224-008", counterparty: "Mobigate Rewards" },
  { id: "wt-9", type: "debit", description: "Community Event Fee", amount: 15000, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: "pending", category: "Events", reference: "TXN-20260223-009", counterparty: "Lagos Devs Community" },
  { id: "wt-10", type: "debit", description: "Failed Transfer Attempt", amount: 3000, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), status: "failed", category: "Transfer", reference: "TXN-20260222-010", counterparty: "unknown_user" },
  { id: "wt-11", type: "credit", description: "Quiz Refund — Cancelled Game", amount: 5000, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), status: "completed", category: "Refund", reference: "TXN-20260221-011", counterparty: "Mobigate Quiz" },
  { id: "wt-12", type: "credit", description: "Gift from @tunde_official", amount: 10000, date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), status: "completed", category: "Gift", reference: "TXN-20260220-012", counterparty: "tunde_official" },
];

const QUICK_FUND_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

type FilterType = "all" | "credit" | "debit";
type SortType = "newest" | "oldest" | "highest" | "lowest";
type FundStep = "input" | "processing" | "success";

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10", label: "Completed" },
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-500/10", label: "Pending" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-500/10", label: "Failed" },
};

function formatRelativeDate(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export default function WalletPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Carousel state
  const [activeWallet, setActiveWallet] = useState(0); // 0 = local, 1 = mobi
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);

  // Fund local wallet drawer
  const [fundDrawerOpen, setFundDrawerOpen] = useState(false);
  const [fundStep, setFundStep] = useState<FundStep>("input");
  const [fundAmount, setFundAmount] = useState(0);
  const [fundCustom, setFundCustom] = useState("");
  const [processingMsg, setProcessingMsg] = useState("");

  // Transaction state
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [search, setSearch] = useState("");
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    setTouchDelta(e.touches[0].clientX - touchStart);
  };
  const handleTouchEnd = () => {
    if (Math.abs(touchDelta) > 60) {
      if (touchDelta < 0 && activeWallet === 0) setActiveWallet(1);
      if (touchDelta > 0 && activeWallet === 1) setActiveWallet(0);
    }
    setTouchStart(null);
    setTouchDelta(0);
  };

  // Fund local wallet processing
  const handleFundLocal = useCallback(() => {
    if (fundAmount <= 0) return;
    setFundStep("processing");
    const msgs = [
      "Initializing secure payment channel...",
      "Verifying funding source...",
      "Processing your deposit...",
      "Crediting your Local Wallet...",
    ];
    let i = 0;
    setProcessingMsg(msgs[0]);
    const interval = setInterval(() => {
      i++;
      if (i < msgs.length) {
        setProcessingMsg(msgs[i]);
      } else {
        clearInterval(interval);
        setFundStep("success");
      }
    }, 900);
  }, [fundAmount]);

  const resetFundDrawer = () => {
    setFundStep("input");
    setFundAmount(0);
    setFundCustom("");
    setProcessingMsg("");
    setFundDrawerOpen(false);
  };

  // Filtered & sorted transactions
  const filteredTxns = MOCK_TRANSACTIONS
    .filter(t => {
      if (filter === "credit" && t.type !== "credit") return false;
      if (filter === "debit" && t.type !== "debit") return false;
      if (search) {
        const q = search.toLowerCase();
        return t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || (t.counterparty?.toLowerCase().includes(q));
      }
      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case "newest": return b.date.getTime() - a.date.getTime();
        case "oldest": return a.date.getTime() - b.date.getTime();
        case "highest": return b.amount - a.amount;
        case "lowest": return a.amount - b.amount;
        default: return 0;
      }
    });

  const totalCredit = filteredTxns.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalDebit = filteredTxns.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  const wallets = [
    { ...LOCAL_WALLET, label: "Local Currency Wallet", icon: Banknote, gradient: "from-emerald-600 via-emerald-500 to-teal-500" },
    { ...MOBI_WALLET, label: "Mobi Wallet", icon: Coins, gradient: "from-violet-600 via-purple-500 to-indigo-500" },
  ];
  const currentWallet = wallets[activeWallet];

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">My Wallet</h1>
            <p className="text-xs text-muted-foreground">Manage your finances</p>
          </div>
        </div>
      </div>

      {/* ── Wallet Carousel ── */}
      <div className="px-4 pt-4">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {wallets.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveWallet(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 touch-manipulation",
                i === activeWallet ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        {/* Swipeable Card - shows peek of next card */}
        <div
          className="relative overflow-visible"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-300 ease-out gap-3"
            style={{
              transform: `translateX(calc(-${activeWallet * 85}% + ${touchStart !== null ? touchDelta : 0}px))`,
            }}
          >
            {wallets.map((w, i) => (
              <div key={i} className="shrink-0" style={{ width: "82%" }}>
                <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br p-5", w.gradient)}>
                  {/* Decorative circles */}
                  <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <w.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white/90 text-sm font-semibold">{w.label}</span>
                    </div>

                    <p className="text-white/70 text-xs font-medium mb-1 tracking-wide uppercase">Available Balance</p>
                    <p className="text-white text-3xl font-black tracking-tight mb-4">
                      {w.symbol}{formatNumberFull(w.balance)}
                    </p>

                    {/* Mini stats */}
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
                          <TrendingUp className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">Income</p>
                          <p className="text-white text-sm font-bold">{w.symbol}{formatNumberFull(w.monthlyIn, 0)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
                          <TrendingDown className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">Spent</p>
                          <p className="text-white text-sm font-bold">{w.symbol}{formatNumberFull(w.monthlyOut, 0)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Fund button */}
                    <Button
                      className="w-full mt-5 h-11 bg-white/20 hover:bg-white/30 text-white font-bold text-sm rounded-xl border border-white/20 backdrop-blur-sm touch-manipulation active:scale-[0.97]"
                      onClick={() => {
                        if (i === 0) {
                          setFundDrawerOpen(true);
                        } else {
                          navigate("/buy-vouchers?source=fund-wallet");
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {i === 0 ? "Fund Local Wallet" : "Fund Mobi Wallet"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Swipe hint */}
        <p className="text-center text-xs text-muted-foreground/60 mt-3 flex items-center justify-center gap-1">
          <ChevronLeft className="h-3 w-3" /> Swipe to switch wallets <ChevronRight className="h-3 w-3" />
        </p>
      </div>

      {/* ── Transaction Section ── */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Transactions</h2>
          <Badge variant="secondary" className="text-xs font-medium">
            {filteredTxns.length} records
          </Badge>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10 text-sm rounded-xl bg-muted/30 border-border/50"
          />
        </div>

        {/* Filter + Sort pills */}
        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar touch-pan-x">
          {(["all", "credit", "debit"] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all touch-manipulation active:scale-[0.97]",
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground"
              )}
            >
              {f === "all" ? "All" : f === "credit" ? "💰 Income" : "💸 Expenses"}
            </button>
          ))}
          <div className="border-l border-border/50 mx-1" />
          {(["newest", "oldest", "highest", "lowest"] as SortType[]).map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all touch-manipulation active:scale-[0.97]",
                sort === s
                  ? "bg-accent text-accent-foreground ring-1 ring-primary/30"
                  : "bg-muted/30 text-muted-foreground"
              )}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-emerald-500/10 rounded-xl p-2.5 text-center">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Total In</p>
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">₦{formatNumberFull(totalCredit, 0)}</p>
          </div>
          <div className="bg-red-500/10 rounded-xl p-2.5 text-center">
            <p className="text-xs text-red-700 dark:text-red-400 font-medium">Total Out</p>
            <p className="text-sm font-bold text-red-700 dark:text-red-400">₦{formatNumberFull(totalDebit, 0)}</p>
          </div>
          <div className="bg-primary/10 rounded-xl p-2.5 text-center">
            <p className="text-xs text-primary font-medium">Net</p>
            <p className={cn("text-sm font-bold", totalCredit - totalDebit >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400")}>
              {totalCredit - totalDebit >= 0 ? "+" : ""}₦{formatNumberFull(totalCredit - totalDebit, 0)}
            </p>
          </div>
        </div>

        {/* Transaction list */}
        <div className="space-y-2">
          {filteredTxns.length === 0 ? (
            <div className="text-center py-10">
              <AlertCircle className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            filteredTxns.map(tx => {
              const st = statusConfig[tx.status];
              return (
                <button
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="w-full text-left p-3 rounded-xl bg-card border border-border/40 hover:border-primary/30 transition-all touch-manipulation active:scale-[0.98]"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", tx.type === "credit" ? "bg-emerald-500/10" : "bg-red-500/10")}>
                      {tx.type === "credit"
                        ? <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                        : <ArrowUpRight className="h-4 w-4 text-red-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{tx.description}</p>
                        <p className={cn("text-sm font-bold shrink-0", tx.type === "credit" ? "text-emerald-600" : "text-red-600")}>
                          {tx.type === "credit" ? "+" : "-"}₦{formatNumberFull(tx.amount, 0)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{formatRelativeDate(tx.date)}</span>
                        <span className="text-xs text-muted-foreground/40">•</span>
                        <span className="text-xs text-muted-foreground">{tx.category}</span>
                        <div className="ml-auto flex items-center gap-1">
                          <st.icon className={cn("h-3 w-3", st.color)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Transaction Detail Drawer ── */}
      <Drawer open={!!selectedTx} onOpenChange={open => { if (!open) setSelectedTx(null); }}>
        <DrawerContent className="max-h-[92vh]">
          {selectedTx && (() => {
            const st = statusConfig[selectedTx.status];
            return (
              <div className="overflow-y-auto touch-auto overscroll-contain">
                <DrawerHeader className="pb-2">
                  <DrawerTitle className="text-base font-bold">Transaction Details</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-6 space-y-4">
                  {/* Amount hero */}
                  <div className={cn("rounded-2xl p-5 text-center", selectedTx.type === "credit" ? "bg-emerald-500/10" : "bg-red-500/10")}>
                    <div className={cn("h-12 w-12 rounded-2xl mx-auto mb-3 flex items-center justify-center", selectedTx.type === "credit" ? "bg-emerald-500/20" : "bg-red-500/20")}>
                      {selectedTx.type === "credit"
                        ? <ArrowDownLeft className="h-6 w-6 text-emerald-600" />
                        : <ArrowUpRight className="h-6 w-6 text-red-600" />
                      }
                    </div>
                    <p className={cn("text-3xl font-black", selectedTx.type === "credit" ? "text-emerald-600" : "text-red-600")}>
                      {selectedTx.type === "credit" ? "+" : "-"}₦{formatNumberFull(selectedTx.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ≈ M{formatNumberFull(selectedTx.amount)}
                    </p>
                  </div>

                  {/* Details grid */}
                  <div className="space-y-3">
                    {[
                      { label: "Description", value: selectedTx.description },
                      { label: "Category", value: selectedTx.category },
                      { label: "Counterparty", value: selectedTx.counterparty || "—" },
                      { label: "Date & Time", value: selectedTx.date.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) },
                      { label: "Reference", value: selectedTx.reference },
                      { label: "Transaction ID", value: selectedTx.id.toUpperCase() },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-3 py-2 border-b border-border/30 last:border-0">
                        <span className="text-xs text-muted-foreground shrink-0">{item.label}</span>
                        <span className="text-xs font-semibold text-foreground text-right break-all">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status */}
                  <div className={cn("flex items-center gap-2 p-3 rounded-xl", st.bg)}>
                    <st.icon className={cn("h-4 w-4", st.color)} />
                    <span className={cn("text-sm font-semibold", st.color)}>{st.label}</span>
                  </div>

                  <Button variant="outline" className="w-full h-11 rounded-xl" onClick={() => setSelectedTx(null)}>
                    Close
                  </Button>
                </div>
              </div>
            );
          })()}
        </DrawerContent>
      </Drawer>

      {/* ── Fund Local Wallet Drawer ── */}
      <Drawer open={fundDrawerOpen} onOpenChange={open => { if (!open) resetFundDrawer(); }}>
        <DrawerContent className="max-h-[92vh]">
          <div className="overflow-y-auto touch-auto overscroll-contain">
            <DrawerHeader className="pb-2">
              <DrawerTitle className="text-base font-bold">Fund Local Wallet</DrawerTitle>
            </DrawerHeader>

            <div className="px-4 pb-6">
              {fundStep === "input" && (
                <div className="space-y-5">
                  {/* Current balance */}
                  <div className="bg-emerald-500/10 rounded-2xl p-4 text-center">
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium uppercase tracking-wide">Current Balance</p>
                    <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                      ₦{formatNumberFull(LOCAL_WALLET.balance)}
                    </p>
                  </div>

                  {/* Amount input */}
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-2 block">Enter Amount (₦)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">₦</span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={fundCustom}
                        onChange={e => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setFundCustom(val);
                          setFundAmount(Number(val) || 0);
                        }}
                        className="pl-9 h-14 text-2xl font-black rounded-xl text-center"
                      />
                    </div>
                    {fundAmount > 0 && (
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        ≈ M{formatNumberFull(fundAmount)}
                      </p>
                    )}
                  </div>

                  {/* Quick picks */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Quick Select</p>
                    <div className="grid grid-cols-3 gap-2">
                      {QUICK_FUND_AMOUNTS.map(amt => (
                        <button
                          key={amt}
                          onClick={() => { setFundAmount(amt); setFundCustom(amt.toString()); }}
                          className={cn(
                            "py-2.5 rounded-xl text-sm font-bold transition-all touch-manipulation active:scale-[0.97]",
                            fundAmount === amt
                              ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                              : "bg-muted/40 text-foreground hover:bg-muted/60"
                          )}
                        >
                          ₦{formatNumberFull(amt, 0)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 rounded-xl font-bold text-sm touch-manipulation active:scale-[0.97]"
                    disabled={fundAmount <= 0}
                    onClick={handleFundLocal}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Fund ₦{formatNumberFull(fundAmount, 0)}
                  </Button>
                </div>
              )}

              {fundStep === "processing" && (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center animate-pulse">
                      <Banknote className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm font-bold text-foreground">Processing Your Deposit</p>
                    <p className="text-xs text-muted-foreground animate-pulse">{processingMsg}</p>
                    <p className="text-lg font-black text-primary mt-3">₦{formatNumberFull(fundAmount)}</p>
                  </div>
                  {/* Progress dots */}
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="h-2 w-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {fundStep === "success" && (
                <div className="flex flex-col items-center justify-center py-8 space-y-5">
                  <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <ShieldCheck className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-lg font-black text-foreground">Deposit Successful!</p>
                    <p className="text-xs text-muted-foreground">Your local wallet has been credited</p>
                  </div>

                  <div className="w-full bg-emerald-500/10 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Amount</span>
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">+₦{formatNumberFull(fundAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">New Balance</span>
                      <span className="text-sm font-bold text-foreground">₦{formatNumberFull(LOCAL_WALLET.balance + fundAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Reference</span>
                      <span className="text-xs font-mono font-semibold text-foreground">TXN-{Date.now().toString().slice(-8)}</span>
                    </div>
                  </div>

                  <Button className="w-full h-11 rounded-xl font-bold touch-manipulation active:scale-[0.97]" onClick={resetFundDrawer}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Done
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
