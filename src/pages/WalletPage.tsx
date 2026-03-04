import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Wallet, ArrowUpRight, ArrowDownLeft, Plus, ChevronRight, ChevronLeft,
  Search, Filter, ArrowUpDown, Clock, CheckCircle2,
  XCircle, AlertCircle, Coins, Banknote, Loader2, Sparkles, ShieldCheck,
  CreditCard, Building2, Ticket, MoreHorizontal, ArrowLeft, Copy, Eye, EyeOff, Hash
} from "lucide-react";
import { formatNumberFull } from "@/lib/financialDisplay";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import useEmblaCarousel from "embla-carousel-react";

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
type FundStep = "input" | "gateway" | "gateway-form" | "processing" | "success";
type PaymentGateway = "card" | "bank" | "voucher" | "other";

interface GatewayInfo {
  id: PaymentGateway;
  label: string;
  subtitle: string;
  icon: any;
  accentBg: string;
  accentText: string;
}

const PAYMENT_GATEWAYS: GatewayInfo[] = [
  { id: "card", label: "Credit / Debit Card", subtitle: "Visa, Mastercard, Verve", icon: CreditCard, accentBg: "bg-blue-500/10", accentText: "text-blue-600" },
  { id: "bank", label: "Online Banking Transfer", subtitle: "Direct bank transfer", icon: Building2, accentBg: "bg-indigo-500/10", accentText: "text-indigo-600" },
  { id: "voucher", label: "Mobi Voucher PIN", subtitle: "Local currency equivalence credited", icon: Ticket, accentBg: "bg-emerald-500/10", accentText: "text-emerald-600" },
  { id: "other", label: "Other Methods", subtitle: "USSD, QR Code, Mobile Money", icon: MoreHorizontal, accentBg: "bg-amber-500/10", accentText: "text-amber-600" },
];

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

  // Embla carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "center", containScroll: false });
  const [activeWallet, setActiveWallet] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveWallet(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  // Fund local wallet drawer
  const [fundDrawerOpen, setFundDrawerOpen] = useState(false);
  const [fundStep, setFundStep] = useState<FundStep>("input");
  const [fundAmount, setFundAmount] = useState(0);
  const [fundCustom, setFundCustom] = useState("");
  const [processingMsg, setProcessingMsg] = useState("");
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);

  // Fund Mobi wallet drawer
  const [fundMobiDrawerOpen, setFundMobiDrawerOpen] = useState(false);
  type MobiFundStep = "options" | "voucher" | "processing" | "success";
  const [mobiFundStep, setMobiFundStep] = useState<MobiFundStep>("options");
  const [mobiVoucherPin, setMobiVoucherPin] = useState("");
  const [mobiVoucherValidating, setMobiVoucherValidating] = useState(false);
  const [mobiVoucherValid, setMobiVoucherValid] = useState(false);
  const [mobiVoucherDenomination, setMobiVoucherDenomination] = useState(0);
  const [mobiProcessingMsg, setMobiProcessingMsg] = useState("");

  // Gateway form fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [showCvv, setShowCvv] = useState(false);
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankVerified, setBankVerified] = useState(false);
  const [bankVerifying, setBankVerifying] = useState(false);
  const [voucherPin, setVoucherPin] = useState("");
  const [voucherValidating, setVoucherValidating] = useState(false);
  const [voucherValid, setVoucherValid] = useState(false);
  const [voucherDenomination, setVoucherDenomination] = useState(0);
  const [otherMethod, setOtherMethod] = useState<"ussd" | "qr" | "mobile-money" | null>(null);
  const [ussdCode, setUssdCode] = useState("");

  // Transaction state
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [search, setSearch] = useState("");
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  // Select gateway and go to form
  const handleSelectGateway = (gw: PaymentGateway) => {
    setSelectedGateway(gw);
    setFundStep("gateway-form");
  };

  // Bank verification simulation
  const handleVerifyBank = useCallback(() => {
    if (!bankAccountNumber || bankAccountNumber.length < 10) return;
    setBankVerifying(true);
    setBankAccountName("");
    const msgs = ["Connecting to bank...", "Verifying account number...", "Retrieving account details..."];
    let i = 0;
    setProcessingMsg(msgs[0]);
    const interval = setInterval(() => {
      i++;
      if (i < msgs.length) setProcessingMsg(msgs[i]);
      else {
        clearInterval(interval);
        setBankVerifying(false);
        setBankVerified(true);
        setBankAccountName("ADEWALE OLUMIDE JOHNSON");
        setProcessingMsg("");
      }
    }, 800);
  }, [bankAccountNumber]);

  // Voucher PIN validation simulation
  const handleValidateVoucher = useCallback(() => {
    if (voucherPin.length < 12) return;
    setVoucherValidating(true);
    setVoucherValid(false);
    const msgs = ["Validating voucher PIN...", "Checking denomination...", "Confirming availability..."];
    let i = 0;
    setProcessingMsg(msgs[0]);
    const interval = setInterval(() => {
      i++;
      if (i < msgs.length) setProcessingMsg(msgs[i]);
      else {
        clearInterval(interval);
        setVoucherValidating(false);
        setVoucherValid(true);
        const denom = [1000, 2000, 5000, 10000, 20000][Math.floor(Math.random() * 5)];
        setVoucherDenomination(denom);
        setFundAmount(denom);
        setProcessingMsg("");
      }
    }, 700);
    }, [voucherPin]);

  // Mobi Voucher PIN validation simulation
  const handleValidateMobiVoucher = useCallback(() => {
    if (mobiVoucherPin.length < 12) return;
    setMobiVoucherValidating(true);
    setMobiVoucherValid(false);
    const msgs = ["Validating voucher PIN...", "Checking Mobi denomination...", "Confirming availability..."];
    let i = 0;
    setMobiProcessingMsg(msgs[0]);
    const interval = setInterval(() => {
      i++;
      if (i < msgs.length) setMobiProcessingMsg(msgs[i]);
      else {
        clearInterval(interval);
        setMobiVoucherValidating(false);
        setMobiVoucherValid(true);
        const denom = [1000, 2000, 5000, 10000, 20000][Math.floor(Math.random() * 5)];
        setMobiVoucherDenomination(denom);
        setMobiProcessingMsg("");
      }
    }, 700);
  }, [mobiVoucherPin]);

  // Process Mobi voucher redemption
  const handleProcessMobiVoucher = useCallback(() => {
    setMobiFundStep("processing");
    const msgs = [
      "Connecting to Mobi Network...",
      "Authenticating voucher...",
      "Crediting your Mobi Wallet...",
    ];
    let i = 0;
    setMobiProcessingMsg(msgs[0]);
    const interval = setInterval(() => {
      i++;
      if (i < msgs.length) setMobiProcessingMsg(msgs[i]);
      else {
        clearInterval(interval);
        setMobiFundStep("success");
      }
    }, 900);
  }, []);

  const resetMobiFundDrawer = () => {
    setMobiFundStep("options");
    setMobiVoucherPin("");
    setMobiVoucherValidating(false);
    setMobiVoucherValid(false);
    setMobiVoucherDenomination(0);
    setMobiProcessingMsg("");
    setFundMobiDrawerOpen(false);
  };

  // Process payment
  const handleProcessPayment = useCallback(() => {
    setFundStep("processing");
    const gatewayLabel = PAYMENT_GATEWAYS.find(g => g.id === selectedGateway)?.label || "Payment";
    const msgs = [
      `Connecting to ${gatewayLabel}...`,
      "Authenticating transaction...",
      "Processing your deposit...",
      "Crediting your Local Wallet...",
    ];
    let i = 0;
    setProcessingMsg(msgs[0]);
    const interval = setInterval(() => {
      i++;
      if (i < msgs.length) setProcessingMsg(msgs[i]);
      else {
        clearInterval(interval);
        setFundStep("success");
      }
    }, 900);
  }, [selectedGateway]);

  // Check if gateway form is valid
  const isGatewayFormValid = useCallback(() => {
    if (!selectedGateway) return false;
    switch (selectedGateway) {
      case "card": return cardNumber.replace(/\s/g, "").length >= 16 && cardExpiry.length >= 5 && cardCvv.length >= 3 && cardName.length >= 3;
      case "bank": return bankVerified && bankAccountNumber.length >= 10;
      case "voucher": return voucherValid && voucherDenomination > 0;
      case "other": return otherMethod !== null;
      default: return false;
    }
  }, [selectedGateway, cardNumber, cardExpiry, cardCvv, cardName, bankVerified, bankAccountNumber, voucherValid, voucherDenomination, otherMethod]);

  const resetFundDrawer = () => {
    setFundStep("input");
    setFundAmount(0);
    setFundCustom("");
    setProcessingMsg("");
    setSelectedGateway(null);
    setCardNumber(""); setCardExpiry(""); setCardCvv(""); setCardName(""); setShowCvv(false);
    setBankName(""); setBankAccountNumber(""); setBankAccountName(""); setBankVerified(false); setBankVerifying(false);
    setVoucherPin(""); setVoucherValidating(false); setVoucherValid(false); setVoucherDenomination(0);
    setOtherMethod(null); setUssdCode("");
    setFundDrawerOpen(false);
  };

  const handleFundBack = () => {
    if (fundStep === "gateway-form") { setFundStep("gateway"); setSelectedGateway(null); }
    else if (fundStep === "gateway") setFundStep("input");
    else resetFundDrawer();
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
    { ...MOBI_WALLET, label: "Mobi Wallet", icon: Coins, gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460] dark:from-[#1a1a2e] dark:via-[#16213e] dark:to-[#0f3460]", accentBorder: "border-indigo-500/20", fundAction: () => setFundMobiDrawerOpen(true), fundLabel: "Fund Mobi Wallet" },
    { ...LOCAL_WALLET, label: "Local Currency Wallet", icon: Banknote, gradient: "from-[#1a2e1a] via-[#1e3a1e] to-[#2d4a2d] dark:from-[#1a2e1a] dark:via-[#1e3a1e] dark:to-[#2d4a2d]", accentBorder: "border-emerald-500/20", fundAction: () => setFundDrawerOpen(true), fundLabel: "Fund Local Wallet" },
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
      <div className="pt-4 overflow-hidden">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-3 px-4">
          {wallets.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 touch-manipulation",
                i === activeWallet ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex" style={{ gap: "12px", paddingLeft: "16px", paddingRight: "16px" }}>
            {wallets.map((w, i) => (
              <div
                key={i}
                className={cn(
                  "shrink-0 grow-0 transition-opacity duration-300",
                  i !== activeWallet && "opacity-40"
                )}
                style={{ flexBasis: "85%" }}
              >
                <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br p-5", w.gradient, w.accentBorder, "border")}>
                  {/* Subtle geometric accent */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.04] rounded-bl-[80px]" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="h-9 w-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                        <w.icon className="h-4.5 w-4.5 text-white/80" />
                      </div>
                      <span className="text-white/70 text-sm font-medium tracking-wide">{w.label}</span>
                    </div>

                    <p className="text-white/50 text-xs font-medium mb-1 uppercase tracking-widest">Available Balance</p>
                    <p className="text-white text-[28px] font-bold tracking-tight mb-5 font-mono">
                      {w.symbol}{formatNumberFull(w.balance)}
                    </p>


                    {/* Fund button */}
                    <Button
                      className="w-full h-11 bg-white/10 hover:bg-white/15 text-white/90 font-semibold text-sm rounded-xl border border-white/15 touch-manipulation active:scale-[0.97] transition-all"
                      onClick={w.fundAction}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {w.fundLabel}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Swipe hint */}
        <p className="text-center text-xs text-muted-foreground/50 mt-3 flex items-center justify-center gap-1">
          <ChevronLeft className="h-3 w-3" /> Swipe to switch <ChevronRight className="h-3 w-3" />
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

        {/* Filter & Sort */}
        <div className="flex gap-2 mb-3">
          <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
            <SelectTrigger className="h-9 text-xs font-medium rounded-lg flex-1">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="credit">Income Only</SelectItem>
              <SelectItem value="debit">Expenses Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => setSort(v as SortType)}>
            <SelectTrigger className="h-9 text-xs font-medium rounded-lg flex-1">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Amount</SelectItem>
              <SelectItem value="lowest">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
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
        <DrawerContent className="max-h-[92vh] flex flex-col overflow-hidden">
          <div className="shrink-0 px-4 pt-3 pb-2 border-b border-border/30">
            <div className="flex items-center gap-3">
              {fundStep !== "input" && fundStep !== "processing" && fundStep !== "success" && (
                <button onClick={handleFundBack} className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center touch-manipulation active:scale-95">
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <div className="flex-1">
                <p className="text-base font-bold text-foreground">Fund Local Wallet</p>
                <p className="text-xs text-muted-foreground">
                  {fundStep === "input" && "Enter amount to fund"}
                  {fundStep === "gateway" && "Choose payment method"}
                  {fundStep === "gateway-form" && PAYMENT_GATEWAYS.find(g => g.id === selectedGateway)?.label}
                  {fundStep === "processing" && "Processing payment..."}
                  {fundStep === "success" && "Payment complete"}
                </p>
              </div>
              {fundAmount > 0 && fundStep !== "success" && (
                <Badge variant="secondary" className="text-xs font-bold shrink-0">₦{formatNumberFull(fundAmount, 0)}</Badge>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain">
            <div className="px-4 py-4">
              {/* ── STEP 1: Amount Input ── */}
              {fundStep === "input" && (
                <div className="space-y-5">
                  <div className="bg-emerald-500/10 rounded-2xl p-4 text-center">
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium uppercase tracking-wide">Current Balance</p>
                    <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">₦{formatNumberFull(LOCAL_WALLET.balance)}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground mb-2 block">Enter Amount (₦)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">₦</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={fundCustom}
                        onChange={e => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setFundCustom(val);
                          setFundAmount(Number(val) || 0);
                        }}
                        className="w-full pl-9 h-14 text-2xl font-black rounded-xl text-center bg-card border-2 border-border/60 focus:border-primary transition-all focus:outline-none"
                      />
                    </div>
                    {fundAmount > 0 && (
                      <p className="text-xs text-muted-foreground text-center mt-1">≈ M{formatNumberFull(fundAmount)}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Quick Select</p>
                    <div className="grid grid-cols-3 gap-2">
                      {QUICK_FUND_AMOUNTS.map(amt => (
                        <button
                          key={amt}
                          onClick={() => { setFundAmount(amt); setFundCustom(amt.toString()); }}
                          className={cn(
                            "py-2.5 rounded-xl text-sm font-bold transition-all touch-manipulation active:scale-[0.97]",
                            fundAmount === amt ? "bg-primary text-primary-foreground ring-2 ring-primary/30" : "bg-muted/40 text-foreground"
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
                    onClick={() => setFundStep("gateway")}
                  >
                    Choose Payment Method
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* ── STEP 2: Payment Gateway Selection ── */}
              {fundStep === "gateway" && (
                <div className="space-y-3">
                  <div className="bg-muted/30 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Funding Amount</span>
                    <span className="text-sm font-black text-foreground">₦{formatNumberFull(fundAmount)}</span>
                  </div>

                  <p className="text-xs font-semibold text-foreground">Select Payment Gateway</p>

                  <div className="space-y-2">
                    {PAYMENT_GATEWAYS.map(gw => {
                      const Icon = gw.icon;
                      return (
                        <button
                          key={gw.id}
                          onClick={() => handleSelectGateway(gw.id)}
                          className="w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 border-border/50 bg-card hover:border-primary/40 transition-all touch-manipulation active:scale-[0.98]"
                        >
                          <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", gw.accentBg)}>
                            <Icon className={cn("h-5 w-5", gw.accentText)} />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-semibold text-foreground">{gw.label}</p>
                            <p className="text-xs text-muted-foreground">{gw.subtitle}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── STEP 3: Gateway-Specific Forms ── */}
              {fundStep === "gateway-form" && selectedGateway === "card" && (
                <div className="space-y-4">
                  <div className="bg-blue-500/10 rounded-xl p-3 flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-foreground">Card Payment</p>
                      <p className="text-xs text-muted-foreground">Enter your card details securely</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1.5 block">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="Full name on card"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        className="w-full h-12 px-3 rounded-xl bg-card border-2 border-border/60 text-sm focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1.5 block">Card Number</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        maxLength={19}
                        onChange={e => {
                          const raw = e.target.value.replace(/\D/g, "");
                          const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
                          setCardNumber(formatted);
                        }}
                        className="w-full h-12 px-3 rounded-xl bg-card border-2 border-border/60 text-sm font-mono focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-1.5 block">Expiry</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          maxLength={5}
                          onChange={e => {
                            let raw = e.target.value.replace(/\D/g, "");
                            if (raw.length > 2) raw = raw.slice(0, 2) + "/" + raw.slice(2);
                            setCardExpiry(raw);
                          }}
                          className="w-full h-12 px-3 rounded-xl bg-card border-2 border-border/60 text-sm font-mono text-center focus:border-primary focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-1.5 block">CVV</label>
                        <div className="relative">
                          <input
                            type={showCvv ? "text" : "password"}
                            inputMode="numeric"
                            placeholder="•••"
                            value={cardCvv}
                            maxLength={4}
                            onChange={e => setCardCvv(e.target.value.replace(/\D/g, ""))}
                            className="w-full h-12 px-3 pr-10 rounded-xl bg-card border-2 border-border/60 text-sm font-mono text-center focus:border-primary focus:outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCvv(!showCvv)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 touch-manipulation"
                          >
                            {showCvv ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 rounded-xl font-bold text-sm touch-manipulation active:scale-[0.97]"
                    disabled={!isGatewayFormValid()}
                    onClick={handleProcessPayment}
                  >
                    Pay ₦{formatNumberFull(fundAmount)}
                  </Button>
                </div>
              )}

              {fundStep === "gateway-form" && selectedGateway === "bank" && (
                <div className="space-y-4">
                  <div className="bg-indigo-500/10 rounded-xl p-3 flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-foreground">Online Banking Transfer</p>
                      <p className="text-xs text-muted-foreground">Transfer from your bank account</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1.5 block">Select Bank</label>
                      <Select value={bankName} onValueChange={v => { setBankName(v); setBankVerified(false); setBankAccountName(""); }}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Access Bank", "First Bank", "GTBank", "UBA", "Zenith Bank", "Stanbic IBTC", "Fidelity Bank", "Union Bank", "Wema Bank", "Sterling Bank"].map(b => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1.5 block">Bank Account Number</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0123456789"
                        maxLength={10}
                        value={bankAccountNumber}
                        onChange={e => { setBankAccountNumber(e.target.value.replace(/\D/g, "")); setBankVerified(false); setBankAccountName(""); }}
                        className="w-full h-12 px-3 rounded-xl bg-card border-2 border-border/60 text-sm font-mono focus:border-primary focus:outline-none transition-all"
                      />
                    </div>

                    {bankAccountNumber.length >= 10 && bankName && !bankVerified && !bankVerifying && (
                      <Button variant="outline" className="w-full h-10 rounded-xl text-sm touch-manipulation" onClick={handleVerifyBank}>
                        Verify Bank Account
                      </Button>
                    )}

                    {bankVerifying && (
                      <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-xl">
                        <Loader2 className="h-4 w-4 animate-spin text-amber-600 shrink-0" />
                        <p className="text-xs text-amber-700 animate-pulse">{processingMsg}</p>
                      </div>
                    )}

                    {bankVerified && bankAccountName && (
                      <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-xl">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Bank Account Name</p>
                          <p className="text-sm font-bold text-foreground">{bankAccountName}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full h-12 rounded-xl font-bold text-sm touch-manipulation active:scale-[0.97]"
                    disabled={!isGatewayFormValid()}
                    onClick={handleProcessPayment}
                  >
                    Transfer ₦{formatNumberFull(fundAmount)}
                  </Button>
                </div>
              )}

              {fundStep === "gateway-form" && selectedGateway === "voucher" && (
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 rounded-xl p-3 flex items-center gap-3">
                    <Ticket className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-foreground">Mobi Voucher PIN</p>
                      <p className="text-xs text-muted-foreground">Enter your voucher PIN to credit local currency equivalence</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1.5 block">Voucher PIN (12-16 digits)</label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter voucher PIN"
                          maxLength={16}
                          value={voucherPin}
                          onChange={e => { setVoucherPin(e.target.value.replace(/\D/g, "")); setVoucherValid(false); setVoucherDenomination(0); }}
                          className="w-full h-12 pl-10 pr-3 rounded-xl bg-card border-2 border-border/60 text-sm font-mono tracking-widest focus:border-primary focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {voucherPin.length >= 12 && !voucherValid && !voucherValidating && (
                      <Button variant="outline" className="w-full h-10 rounded-xl text-sm touch-manipulation" onClick={handleValidateVoucher}>
                        Validate Voucher
                      </Button>
                    )}

                    {voucherValidating && (
                      <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-xl">
                        <Loader2 className="h-4 w-4 animate-spin text-amber-600 shrink-0" />
                        <p className="text-xs text-amber-700 animate-pulse">{processingMsg}</p>
                      </div>
                    )}

                    {voucherValid && (
                      <div className="bg-emerald-500/10 rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                          <p className="text-sm font-bold text-emerald-700">Voucher Valid!</p>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Denomination</span>
                          <span className="text-sm font-bold text-foreground">M{formatNumberFull(voucherDenomination)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Local Currency Equivalence</span>
                          <span className="text-sm font-bold text-emerald-700">₦{formatNumberFull(voucherDenomination)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full h-12 rounded-xl font-bold text-sm touch-manipulation active:scale-[0.97]"
                    disabled={!isGatewayFormValid()}
                    onClick={handleProcessPayment}
                  >
                    Redeem Voucher
                  </Button>
                </div>
              )}

              {fundStep === "gateway-form" && selectedGateway === "other" && (
                <div className="space-y-4">
                  <div className="bg-amber-500/10 rounded-xl p-3 flex items-center gap-3">
                    <MoreHorizontal className="h-5 w-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-foreground">Other Payment Methods</p>
                      <p className="text-xs text-muted-foreground">Choose an alternative payment method</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {([
                      { id: "ussd" as const, label: "USSD Transfer", desc: "Dial USSD code from your phone", icon: "📱" },
                      { id: "qr" as const, label: "QR Code Payment", desc: "Scan with your banking app", icon: "📷" },
                      { id: "mobile-money" as const, label: "Mobile Money", desc: "Pay via mobile money wallet", icon: "💳" },
                    ]).map(method => (
                      <button
                        key={method.id}
                        onClick={() => {
                          setOtherMethod(method.id);
                          if (method.id === "ussd") setUssdCode("*737*2*" + fundAmount + "#");
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all touch-manipulation active:scale-[0.98]",
                          otherMethod === method.id ? "border-primary bg-primary/5" : "border-border/50 bg-card"
                        )}
                      >
                        <span className="text-xl">{method.icon}</span>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold text-foreground">{method.label}</p>
                          <p className="text-xs text-muted-foreground">{method.desc}</p>
                        </div>
                        {otherMethod === method.id && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
                      </button>
                    ))}
                  </div>

                  {otherMethod === "ussd" && (
                    <div className="bg-muted/30 rounded-xl p-4 text-center space-y-2">
                      <p className="text-xs text-muted-foreground">Dial this code on your phone</p>
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-lg font-mono font-black text-foreground">{ussdCode}</p>
                        <button
                          onClick={() => { navigator.clipboard?.writeText(ussdCode); toast({ title: "Copied!", description: "USSD code copied to clipboard" }); }}
                          className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center touch-manipulation"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">Complete the transfer, then tap confirm below</p>
                    </div>
                  )}

                  {otherMethod === "qr" && (
                    <div className="bg-muted/30 rounded-xl p-6 text-center space-y-3">
                      <div className="h-40 w-40 mx-auto bg-white rounded-xl border-2 border-border flex items-center justify-center">
                        <div className="grid grid-cols-5 gap-1">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} className={cn("h-5 w-5 rounded-sm", Math.random() > 0.4 ? "bg-foreground" : "bg-transparent")} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Scan with your banking app to pay ₦{formatNumberFull(fundAmount)}</p>
                    </div>
                  )}

                  {otherMethod === "mobile-money" && (
                    <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                      <p className="text-xs text-muted-foreground">A payment prompt has been sent to your registered mobile money number.</p>
                      <p className="text-sm font-bold text-foreground text-center">+234 ••• ••• 4521</p>
                      <p className="text-xs text-muted-foreground text-center">Approve the ₦{formatNumberFull(fundAmount)} payment on your device</p>
                    </div>
                  )}

                  <Button
                    className="w-full h-12 rounded-xl font-bold text-sm touch-manipulation active:scale-[0.97]"
                    disabled={!isGatewayFormValid()}
                    onClick={handleProcessPayment}
                  >
                    {otherMethod === "ussd" ? "I've Completed the Transfer" :
                     otherMethod === "qr" ? "I've Scanned & Paid" :
                     otherMethod === "mobile-money" ? "Confirm Payment" :
                     "Continue"}
                  </Button>
                </div>
              )}

              {/* ── STEP 4: Processing ── */}
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
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 5: Success ── */}
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
                      <span className="text-xs text-muted-foreground">Payment Method</span>
                      <span className="text-xs font-semibold text-foreground">{PAYMENT_GATEWAYS.find(g => g.id === selectedGateway)?.label}</span>
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

      {/* ── Fund Mobi Wallet Drawer ── */}
      <Drawer open={fundMobiDrawerOpen} onOpenChange={open => { if (!open) resetMobiFundDrawer(); }}>
        <DrawerContent className="max-h-[92vh] flex flex-col overflow-hidden">
          <div className="shrink-0 px-5 pt-3 pb-2 border-b border-border/30">
            <div className="flex items-center gap-3">
              {mobiFundStep === "voucher" && (
                <button onClick={() => { setMobiFundStep("options"); setMobiVoucherPin(""); setMobiVoucherValid(false); setMobiVoucherDenomination(0); }} className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center touch-manipulation active:scale-95 shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <div className="flex-1">
                <p className="text-base font-bold text-foreground">Fund Mobi Wallet</p>
                <p className="text-xs text-muted-foreground">
                  {mobiFundStep === "options" && "Choose how to fund your Mobi Wallet"}
                  {mobiFundStep === "voucher" && "Enter Voucher PIN to credit Mobi units"}
                  {mobiFundStep === "processing" && "Processing redemption..."}
                  {mobiFundStep === "success" && "Mobi Wallet credited!"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain">
            <div className="px-5 py-5">

              {/* ── OPTIONS ── */}
              {mobiFundStep === "options" && (
                <div className="space-y-5">
                  <div className="bg-indigo-500/10 rounded-2xl p-4 text-center">
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-wide">Current Mobi Balance</p>
                    <p className="text-2xl font-black text-indigo-700 dark:text-indigo-300 mt-1 font-mono">M{formatNumberFull(MOBI_WALLET.balance)}</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Funding Options</p>

                    {/* Buy Vouchers */}
                    <button
                      onClick={() => { resetMobiFundDrawer(); navigate("/buy-vouchers?source=fund-wallet"); }}
                      className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-border/50 bg-card hover:border-primary/40 transition-all touch-manipulation active:scale-[0.98]"
                    >
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Coins className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-bold text-foreground">Buy Mobi Vouchers</p>
                        <p className="text-xs text-muted-foreground">Purchase from accredited merchants</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </button>

                    {/* Redeem Voucher PIN */}
                    <button
                      onClick={() => setMobiFundStep("voucher")}
                      className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-border/50 bg-card hover:border-primary/40 transition-all touch-manipulation active:scale-[0.98]"
                    >
                      <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                        <Ticket className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-bold text-foreground">Redeem Voucher PIN</p>
                        <p className="text-xs text-muted-foreground">Enter a 16-digit PIN to credit Mobi units</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </button>

                    {/* Retailer Services */}
                    <button
                      onClick={() => {
                        toast({ title: "Retailer Services", description: "Visit a nearby Mobigate Retail Merchant to fund your wallet in-person." });
                      }}
                      className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-border/50 bg-card hover:border-primary/40 transition-all touch-manipulation active:scale-[0.98]"
                    >
                      <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-bold text-foreground">Retailer Services</p>
                        <p className="text-xs text-muted-foreground">Fund via a Retail Merchant near you</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </button>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Voucher PINs redeemed here credit the <span className="font-semibold text-foreground">Mobi value (in Mobi units)</span> directly to your Mobi Wallet.
                    </p>
                  </div>
                </div>
              )}

              {/* ── VOUCHER PIN ENTRY ── */}
              {mobiFundStep === "voucher" && (
                <div className="space-y-5">
                  <div className="bg-amber-500/10 rounded-xl p-3.5 flex items-center gap-3">
                    <Ticket className="h-5 w-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-foreground">Redeem Voucher PIN</p>
                      <p className="text-xs text-muted-foreground">Credit Mobi value directly to your wallet</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground mb-2 block">Voucher PIN (12-16 digits)</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter 16-digit voucher PIN"
                        maxLength={16}
                        value={mobiVoucherPin}
                        onChange={e => { setMobiVoucherPin(e.target.value.replace(/\D/g, "")); setMobiVoucherValid(false); setMobiVoucherDenomination(0); }}
                        onPointerDown={e => e.stopPropagation()}
                        className="w-full h-14 pl-10 pr-3 rounded-xl bg-card border-2 border-border/60 text-base font-mono tracking-[0.2em] text-center focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 text-center">
                      {mobiVoucherPin.length}/16 digits entered
                    </p>
                  </div>

                  {mobiVoucherPin.length >= 12 && !mobiVoucherValid && !mobiVoucherValidating && (
                    <Button variant="outline" className="w-full h-11 rounded-xl text-sm font-semibold touch-manipulation active:scale-[0.97]" onClick={handleValidateMobiVoucher}>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Validate Voucher
                    </Button>
                  )}

                  {mobiVoucherValidating && (
                    <div className="flex items-center gap-3 p-3.5 bg-amber-500/10 rounded-xl">
                      <Loader2 className="h-4 w-4 animate-spin text-amber-600 shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-400 animate-pulse font-medium">{mobiProcessingMsg}</p>
                    </div>
                  )}

                  {mobiVoucherValid && (
                    <div className="space-y-3">
                      <div className="bg-emerald-500/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Voucher Valid!</p>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-emerald-500/20">
                          <span className="text-xs text-muted-foreground">Mobi Value</span>
                          <span className="text-lg font-black text-foreground">M{formatNumberFull(mobiVoucherDenomination)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Local Equivalence</span>
                          <span className="text-sm font-semibold text-muted-foreground">≈ ₦{formatNumberFull(mobiVoucherDenomination)}</span>
                        </div>
                      </div>

                      <Button
                        className="w-full h-12 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-blue-600 text-white touch-manipulation active:scale-[0.97]"
                        onClick={handleProcessMobiVoucher}
                      >
                        <Coins className="h-4 w-4 mr-2" />
                        Credit M{formatNumberFull(mobiVoucherDenomination)} to Mobi Wallet
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* ── PROCESSING ── */}
              {mobiFundStep === "processing" && (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center animate-pulse">
                      <Coins className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm font-bold text-foreground">Crediting Mobi Wallet</p>
                    <p className="text-xs text-muted-foreground animate-pulse">{mobiProcessingMsg}</p>
                    <p className="text-lg font-black text-primary mt-3">M{formatNumberFull(mobiVoucherDenomination)}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── SUCCESS ── */}
              {mobiFundStep === "success" && (
                <div className="flex flex-col items-center justify-center py-8 space-y-5">
                  <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <ShieldCheck className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-lg font-black text-foreground">Mobi Wallet Credited!</p>
                    <p className="text-xs text-muted-foreground">Your voucher has been redeemed successfully</p>
                  </div>

                  <div className="w-full bg-emerald-500/10 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Mobi Credited</span>
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">+M{formatNumberFull(mobiVoucherDenomination)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Method</span>
                      <span className="text-xs font-semibold text-foreground">Voucher PIN Redemption</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">New Balance</span>
                      <span className="text-sm font-bold text-foreground">M{formatNumberFull(MOBI_WALLET.balance + mobiVoucherDenomination)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Reference</span>
                      <span className="text-xs font-mono font-semibold text-foreground">TXN-{Date.now().toString().slice(-8)}</span>
                    </div>
                  </div>

                  <Button className="w-full h-11 rounded-xl font-bold touch-manipulation active:scale-[0.97]" onClick={resetMobiFundDrawer}>
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
