import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Sparkles, Check, MapPin, Star, ShieldCheck, ChevronRight, Ticket, CreditCard, Users, UserPlus, Search, Send, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { rechargeVouchers, RechargeVoucher } from "@/data/rechargeVouchersData";
import {
  merchantCountries,
  MerchantCountry,
  MobiMerchant,
  getLocalCountry,
  getOtherCountries,
  calculateDiscountedAmount,
} from "@/data/mobiMerchantsData";
import { communityPeople } from "@/data/communityPeopleData";
import { mockFriends } from "@/data/profileData";

type Step = "vouchers" | "countries" | "merchants" | "payment" | "processing" | "success" | "distribute" | "sendToUsers" | "redeemPin" | "redeemProcessing" | "redeemSuccess";

// Cart: voucherId -> quantity
type Cart = Record<string, number>;

interface Transfer {
  id: string;
  recipientName: string;
  recipientAvatar: string;
  amount: number;
  timestamp: Date;
}

const formatNum = (n: number) => n.toLocaleString("en-NG");

const PROCESSING_MESSAGES = [
  "Connecting to merchant...",
  "Processing payment...",
  "Verifying transaction...",
  "Almost done..."
];

export default function BuyVouchersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFundWallet = searchParams.get("source") === "fund-wallet";
  const merchantParam = searchParams.get("merchant");
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("vouchers");
  const [cart, setCart] = useState<Cart>({});
  const [selectedCountry, setSelectedCountry] = useState<MerchantCountry | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<MobiMerchant | null>(null);
  const [preSelectedMerchant, setPreSelectedMerchant] = useState(false);
  const [merchantSort, setMerchantSort] = useState<"discount_high" | "discount_low" | "rating_high" | "rating_low">("discount_high");
  const [merchantStateFilter, setMerchantStateFilter] = useState("all");
  const [merchantLgaFilter, setMerchantLgaFilter] = useState("all");
  const [merchantCityFilter, setMerchantCityFilter] = useState("all");

  // Auto-select local merchant when coming from a merchant page
  useEffect(() => {
    if (merchantParam) {
      const local = getLocalCountry();
      if (local) {
        const firstActive = local.merchants.find(m => m.isActive);
        if (firstActive) {
          setSelectedCountry(local);
          setSelectedMerchant(firstActive);
          setPreSelectedMerchant(true);
        }
      }
    }
  }, [merchantParam]);

  // Post-payment state
  const [remainingMobi, setRemainingMobi] = useState(0);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [recipientType, setRecipientType] = useState<"community" | "friends" | null>(null);
  const [selectedRecipients, setSelectedRecipients] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [processingMsg, setProcessingMsg] = useState(0);
  const [showSuccessButtons, setShowSuccessButtons] = useState(false);
  const [selfLoading, setSelfLoading] = useState(false);
  const [selfSuccess, setSelfSuccess] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [redeemPin, setRedeemPin] = useState("");
  const [redeemError, setRedeemError] = useState("");
  const [editingQtyId, setEditingQtyId] = useState<string | null>(null);
  const [editingQtyValue, setEditingQtyValue] = useState("");

  // Derived
  const lowTier = rechargeVouchers.filter((v) => v.tier === "low");
  const midTier = rechargeVouchers.filter((v) => v.tier === "mid");
  const highTier = rechargeVouchers.filter((v) => v.tier === "high");

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => ({
        voucher: rechargeVouchers.find((v) => v.id === id)!,
        quantity: qty,
      }))
      .filter((item) => item.voucher);
  }, [cart]);

  const totalMobi = useMemo(
    () => cartItems.reduce((s, i) => s + i.voucher.mobiValue * i.quantity, 0),
    [cartItems]
  );
  const totalItems = useMemo(
    () => cartItems.reduce((s, i) => s + i.quantity, 0),
    [cartItems]
  );

  const totalAllocated = useMemo(
    () => Object.values(selectedRecipients).reduce((s, v) => s + v, 0),
    [selectedRecipients]
  );

  // Cart helpers
  const toggleVoucher = (v: RechargeVoucher) => {
    setCart((prev) => {
      if (prev[v.id]) {
        const next = { ...prev };
        delete next[v.id];
        return next;
      }
      return { ...prev, [v.id]: 1 };
    });
  };

  const changeQty = (id: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCart((prev) => {
      const current = prev[id] || 1;
      const next = current + delta;
      if (next < 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const clearCart = () => setCart({});

  // Navigation
  const goToCountries = () => {
    if (totalItems === 0) {
      toast({ title: "Select vouchers", description: "Pick at least one voucher denomination" });
      return;
    }
    if (preSelectedMerchant && selectedCountry && selectedMerchant) {
      setStep("payment");
    } else {
      setStep("countries");
    }
    window.scrollTo(0, 0);
  };

  const goToMerchants = (country: MerchantCountry) => {
    setSelectedCountry(country);
    setStep("merchants");
    window.scrollTo(0, 0);
  };

  const goToPayment = (merchant: MobiMerchant) => {
    setSelectedMerchant(merchant);
    setStep("payment");
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (step === "countries") setStep("vouchers");
    else if (step === "merchants") setStep("countries");
    else if (step === "payment") setStep(preSelectedMerchant ? "vouchers" : "merchants");
    else if (step === "redeemPin") { setStep("vouchers"); setRedeemPin(""); setRedeemError(""); }
    else if (step === "distribute") {
      setStep("success");
      setShowSuccessButtons(true);
    }
    else if (step === "sendToUsers") {
      setStep("distribute");
      setSelectedRecipients({});
      setSearchQuery("");
    }
    window.scrollTo(0, 0);
  };

  // ─── PAYMENT FLOW ───
  const handlePay = () => {
    setStep("processing");
    setProcessingMsg(0);
    window.scrollTo(0, 0);
  };

  // Processing auto-advance
  useEffect(() => {
    if (step !== "processing") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    PROCESSING_MESSAGES.forEach((_, i) => {
      if (i > 0) {
        timers.push(setTimeout(() => setProcessingMsg(i), i * 800));
      }
    });
    timers.push(setTimeout(() => {
      setRemainingMobi(totalMobi);
      setStep("success");
      setShowSuccessButtons(false);
      window.scrollTo(0, 0);
      setTimeout(() => setShowSuccessButtons(true), 1200);
    }, 3200));
    return () => timers.forEach(clearTimeout);
  }, [step, totalMobi]);

  const handleUseForSelf = () => {
    setStep("success");
    setSelfLoading(true);
    window.scrollTo(0, 0);
    setTimeout(() => {
      setSelfLoading(false);
      setSelfSuccess(true);
    }, 5000);
  };

  const handleSelfDone = () => {
    navigate("/");
  };

  const handleSendToSomeone = () => {
    setStep("distribute");
    window.scrollTo(0, 0);
  };

  const handleChooseRecipientType = (type: "community" | "friends") => {
    setRecipientType(type);
    setSelectedRecipients({});
    setSearchQuery("");
    setStep("sendToUsers");
    window.scrollTo(0, 0);
  };

  const toggleRecipient = (id: string) => {
    setSelectedRecipients(prev => {
      if (prev[id] !== undefined) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: 0 };
    });
  };

  const setRecipientAmount = (id: string, amount: number) => {
    const maxForThis = remainingMobi - totalAllocated + (selectedRecipients[id] || 0);
    const clamped = Math.max(0, Math.min(amount, maxForThis));
    setSelectedRecipients(prev => ({ ...prev, [id]: clamped }));
  };

  const handleSendToRecipients = () => {
    const entries = Object.entries(selectedRecipients).filter(([, amt]) => amt > 0);
    if (entries.length === 0) return;
    setSendLoading(true);

    setTimeout(() => {
      const userList = recipientType === "community"
        ? communityPeople.map(p => ({ id: p.id, name: p.name, avatar: p.imageUrl }))
        : mockFriends.map(f => ({ id: f.id, name: f.name, avatar: f.avatar }));

      const newTransfers: Transfer[] = entries.map(([userId, amount]) => {
        const user = userList.find(u => u.id === userId);
        return {
          id: `t-${Date.now()}-${userId}`,
          recipientName: user?.name || "Unknown",
          recipientAvatar: user?.avatar || "",
          amount,
          timestamp: new Date(),
        };
      });

      const totalSent = entries.reduce((s, [, amt]) => s + amt, 0);
      setRemainingMobi(prev => prev - totalSent);
      setTransfers(prev => [...prev, ...newTransfers]);
      setSendLoading(false);
      setSendSuccess(true);
    }, 5000);
  };

  const handleSendDone = () => {
    setSendSuccess(false);
    setSelectedRecipients({});
    setSearchQuery("");
    setStep("distribute");
    window.scrollTo(0, 0);
  };

  // ─── RENDER: Voucher Card ───
  const renderVoucherCard = (v: RechargeVoucher) => {
    const selected = !!cart[v.id];
    const qty = cart[v.id] || 0;
    const isEditing = editingQtyId === v.id;

    return (
      <div
        key={v.id}
        onClick={() => toggleVoucher(v)}
        className={`relative rounded-xl border-2 p-3 transition-all duration-150 touch-manipulation active:scale-[0.96] cursor-pointer ${
          selected
            ? "border-primary bg-primary/5 shadow-md"
            : "border-border/50 bg-card hover:border-border"
        }`}
      >
        {v.isPopular && (
          <div className="absolute -top-2 -right-2">
            <Badge className="bg-amber-500 text-white text-xs px-1.5 py-0 h-5 gap-0.5">
              <Sparkles className="h-3 w-3" /> Hot
            </Badge>
          </div>
        )}
        {selected && (
          <div className="absolute top-1.5 left-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
        <div className="text-center pt-1">
          <p className="text-xs text-muted-foreground mb-0.5">Mobi</p>
          <p className={`font-bold ${v.mobiValue >= 100000 ? "text-sm" : "text-base"} text-foreground`}>
            M{formatNum(v.mobiValue)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">≈ ₦{formatNum(v.ngnPrice)}</p>
        </div>
        {selected && (
          <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-border/50">
            <button onClick={(e) => changeQty(v.id, -1, e)} className="h-7 w-7 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
              <Minus className="h-3.5 w-3.5 text-foreground" />
            </button>
            {isEditing ? (
              <input
                type="number"
                autoFocus
                value={editingQtyValue}
                onChange={e => setEditingQtyValue(e.target.value)}
                onBlur={() => {
                  const val = parseInt(editingQtyValue);
                  if (val && val >= 1) {
                    setCart(prev => ({ ...prev, [v.id]: val }));
                  }
                  setEditingQtyId(null);
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                }}
                onClick={e => e.stopPropagation()}
                className="w-12 text-center text-sm font-bold bg-muted/50 rounded-lg h-7 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingQtyId(v.id);
                  setEditingQtyValue(String(qty));
                }}
                className="text-sm font-bold text-foreground w-8 text-center h-7 rounded-lg hover:bg-muted/50 touch-manipulation"
              >
                {qty}
              </button>
            )}
            <button onClick={(e) => changeQty(v.id, 1, e)} className="h-7 w-7 rounded-full bg-primary flex items-center justify-center active:scale-90 touch-manipulation">
              <Plus className="h-3.5 w-3.5 text-primary-foreground" />
            </button>
          </div>
        )}
        {selected && qty >= 10 && (
          <div className="flex items-center justify-center gap-1 mt-1.5">
            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] px-2 py-0.5 h-auto gap-1 font-semibold animate-in fade-in-0 zoom-in-95 duration-200">
              <Sparkles className="h-3 w-3" />
              Discount Unlocked!
            </Badge>
          </div>
        )}
        {selected && qty < 10 && (
          <p className="text-[10px] text-amber-600 text-center mt-1">
            {qty > 0 ? `Add ${10 - qty} more for discount` : "Min 10 for discount"}
          </p>
        )}
      </div>
    );
  };

  // ─── RENDER: Tier Section ───
  const renderTier = (label: string, vouchers: RechargeVoucher[], desc: string) => (
    <div className="mb-6" key={label}>
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</h3>
        <span className="text-[10px] text-muted-foreground">{desc}</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {vouchers.map(renderVoucherCard)}
      </div>
    </div>
  );

  // ─── STEP 1: VOUCHER SELECTION ───
  const renderVoucherStep = () => (
    <div className="bg-background pb-32">
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-foreground">{isFundWallet ? "Fund Mobi Wallet" : "Buy Mobi Vouchers"}</h1>
          <p className="text-xs text-muted-foreground">{isFundWallet ? "Select amount to fund your wallet" : "Select denominations & quantities"}</p>
        </div>
        {totalItems > 0 && (
          <button onClick={clearCart} className="text-xs text-destructive font-medium active:opacity-70 touch-manipulation">
            Clear
          </button>
        )}
      </div>
      <div className="px-4 pt-4">
        {/* Pre-selected merchant banner */}
        {preSelectedMerchant && merchantParam && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 mb-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Ticket className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Buying from {decodeURIComponent(merchantParam)}</p>
              <p className="text-xs text-muted-foreground">Select vouchers, then proceed to payment</p>
            </div>
          </div>
        )}
        {/* Redeem Voucher Code Section */}
        <div
          onClick={() => { setStep("redeemPin"); setRedeemPin(""); setRedeemError(""); window.scrollTo(0, 0); }}
          className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 mb-6 flex items-center gap-3 active:scale-[0.97] transition-transform touch-manipulation cursor-pointer"
        >
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Ticket className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Have a Voucher Code?</p>
            <p className="text-xs text-muted-foreground">Redeem a physical voucher PIN to fund your wallet</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>

        {renderTier("Standard", lowTier, "M100 – M10,000")}
        {renderTier("Premium", midTier, "M15,000 – M100,000")}
        {renderTier("Elite", highTier, "M125,000 – M1,000,000")}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 safe-area-bottom">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground">{totalItems} voucher{totalItems !== 1 ? "s" : ""} selected</p>
            <p className="text-lg font-bold text-foreground">M{formatNum(totalMobi)}</p>
          </div>
          <p className="text-sm text-muted-foreground">≈ ₦{formatNum(totalMobi)}</p>
        </div>
        <Button onClick={goToCountries} disabled={totalItems === 0} className="w-full h-12 text-sm font-semibold rounded-xl touch-manipulation active:scale-[0.97]">
          Continue to Merchant <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  // ─── STEP 2: COUNTRY SELECTION ───
  const renderCountriesStep = () => {
    const local = getLocalCountry();
    const others = getOtherCountries();
    return (
      <div className="bg-background pb-6">
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground">Select Country</h1>
            <p className="text-xs text-muted-foreground">Cart: M{formatNum(totalMobi)} ({totalItems} items)</p>
          </div>
        </div>
        <div className="px-4 pt-4">
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 mb-4">
            <p className="text-sm text-foreground leading-relaxed">
              Choose your country to see accredited merchants and their rates in your local currency.
            </p>
          </div>
          {local && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Your Country</p>
              <div onClick={() => goToMerchants(local)} className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 flex items-center gap-3 active:scale-[0.97] transition-transform touch-manipulation cursor-pointer">
                <span className="text-3xl">{local.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground">{local.name}</p>
                  <p className="text-xs text-muted-foreground">{local.currencySymbol} {local.currencyCode} • {local.merchants.length} sub-merchants</p>
                </div>
                <Badge className="bg-primary/10 text-primary text-xs">Local</Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">International</p>
          <div className="space-y-2">
            {others.map((country) => (
              <div key={country.id} onClick={() => goToMerchants(country)} className="rounded-xl border border-border/50 bg-card p-3.5 flex items-center gap-3 active:scale-[0.97] transition-transform touch-manipulation cursor-pointer">
                <span className="text-2xl">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">{country.name}</p>
                  <p className="text-xs text-muted-foreground">{country.currencySymbol} {country.currencyCode} • {country.merchants.length} sub-merchants</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ─── STEP 3: MERCHANT SELECTION ───
  const renderMerchantsStep = () => {
    if (!selectedCountry) return null;
    const activeMerchants = selectedCountry.merchants.filter((m) => m.isActive);

    // Sort merchants
    const sortedMerchants = [...activeMerchants].sort((a, b) => {
      switch (merchantSort) {
        case "discount_high": return b.discountPercent - a.discountPercent;
        case "discount_low": return a.discountPercent - b.discountPercent;
        case "rating_high": return b.rating - a.rating;
        case "rating_low": return a.rating - b.rating;
        default: return b.discountPercent - a.discountPercent;
      }
    });

    // Filter by location
    const filteredMerchants = sortedMerchants.filter((m) => {
      if (merchantStateFilter !== "all" && m.stateId !== merchantStateFilter) return false;
      if (merchantLgaFilter !== "all" && m.lgaId !== merchantLgaFilter) return false;
      if (merchantCityFilter !== "all" && m.city !== merchantCityFilter) return false;
      return true;
    });

    // Derive unique filter options from active merchants
    const hasLocationData = activeMerchants.some(m => m.stateId);
    const uniqueStates = [...new Map(activeMerchants.filter(m => m.stateId).map(m => [m.stateId!, { id: m.stateId!, name: m.stateName! }])).values()];
    const uniqueLgas = [...new Map(activeMerchants.filter(m => m.lgaId && (merchantStateFilter === "all" || m.stateId === merchantStateFilter)).map(m => [m.lgaId!, { id: m.lgaId!, name: m.lgaName! }])).values()];
    const uniqueCities = [...new Set(activeMerchants.filter(m => (merchantStateFilter === "all" || m.stateId === merchantStateFilter) && (merchantLgaFilter === "all" || m.lgaId === merchantLgaFilter)).map(m => m.city))];

    return (
      <div className="bg-background pb-6">
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-base font-bold text-foreground">{selectedCountry.flag} {selectedCountry.name}</h1>
              <p className="text-xs text-muted-foreground">Select a sub-merchant</p>
            </div>
          </div>
          <div className="px-4 pb-3">
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Your Mobi Order</p>
                  <p className="text-xl font-bold text-foreground">M{formatNum(totalMobi)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{totalItems} voucher{totalItems !== 1 ? "s" : ""}</p>
                  <p className="text-sm font-semibold text-muted-foreground">≈ ₦{formatNum(totalMobi)}</p>
                </div>
              </div>
              {/* Discount eligibility breakdown */}
              {(() => {
                const eligibleItems = cartItems.filter(i => i.quantity >= 10);
                const totalCartItems = cartItems.length;
                if (eligibleItems.length === 0) {
                  return (
                    <p className="text-xs text-amber-600 mt-1.5 pt-1.5 border-t border-primary/10">
                      No items qualify for Bulk Discount yet (min 10 per denomination)
                    </p>
                  );
                }
                return (
                  <p className="text-xs text-emerald-600 font-medium mt-1.5 pt-1.5 border-t border-primary/10">
                    ✓ {eligibleItems.length} of {totalCartItems} item{totalCartItems !== 1 ? "s" : ""} qualify for discount
                  </p>
                );
              })()}
            </div>
          </div>
          {/* Filter row */}
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>
            <Select value={merchantSort} onValueChange={(v: typeof merchantSort) => setMerchantSort(v)}>
              <SelectTrigger className="h-8 rounded-full text-xs font-medium min-w-[120px] shrink-0 px-3">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discount_high" className="text-xs">Highest Discount</SelectItem>
                <SelectItem value="discount_low" className="text-xs">Lowest Discount</SelectItem>
                <SelectItem value="rating_high" className="text-xs">Highest Rating</SelectItem>
                <SelectItem value="rating_low" className="text-xs">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
            {hasLocationData && (
              <>
                <Select value={merchantStateFilter} onValueChange={(v) => { setMerchantStateFilter(v); setMerchantLgaFilter("all"); setMerchantCityFilter("all"); }}>
                  <SelectTrigger className="h-8 rounded-full text-xs font-medium min-w-[100px] shrink-0 px-3">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">All States</SelectItem>
                    {uniqueStates.map(s => <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {merchantStateFilter !== "all" && uniqueLgas.length > 0 && (
                  <Select value={merchantLgaFilter} onValueChange={(v) => { setMerchantLgaFilter(v); setMerchantCityFilter("all"); }}>
                    <SelectTrigger className="h-8 rounded-full text-xs font-medium min-w-[100px] shrink-0 px-3">
                      <SelectValue placeholder="LGA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs">All LGAs</SelectItem>
                      {uniqueLgas.map(l => <SelectItem key={l.id} value={l.id} className="text-xs">{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
                {merchantLgaFilter !== "all" && uniqueCities.length > 0 && (
                  <Select value={merchantCityFilter} onValueChange={setMerchantCityFilter}>
                    <SelectTrigger className="h-8 rounded-full text-xs font-medium min-w-[100px] shrink-0 px-3">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs">All Cities</SelectItem>
                      {uniqueCities.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              </>
            )}
          </div>
        </div>
        <div className="px-4 pt-3 space-y-2.5">
          {filteredMerchants.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No merchants found for this filter</p>
            </div>
          )}
          {filteredMerchants.map((merchant) => {
            // Conditional discount: only cart items with qty >= 10 get discount
            const eligibleItems = cartItems.filter(i => i.quantity >= 10);
            const eligibleTotal = eligibleItems.reduce((s, i) => s + i.voucher.mobiValue * i.quantity, 0);
            const nonEligibleTotal = totalMobi - eligibleTotal;
            const hasAnyDiscount = eligibleItems.length > 0;
            const eligibleSavings = hasAnyDiscount 
              ? calculateDiscountedAmount(eligibleTotal, merchant.discountPercent).savings
              : 0;
            const totalToPay = totalMobi - eligibleSavings;
            
            return (
              <div key={merchant.id} onClick={() => goToPayment(merchant)} className="rounded-xl border border-border/50 bg-card p-4 active:scale-[0.97] transition-transform touch-manipulation cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm text-foreground truncate">{merchant.name}</p>
                      {merchant.isVerified && <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />}
                      {merchant.isSubMerchant && (
                        <Badge variant="outline" className="text-[10px] px-1.5 h-4 border-primary/30 text-primary shrink-0">Sub-Merchant</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{merchant.city}</span>
                      <span className="text-muted-foreground mx-1">•</span>
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs text-muted-foreground">{merchant.rating}</span>
                    </div>
                  </div>
                  {hasAnyDiscount ? (
                    <div className="text-right shrink-0">
                      <Badge className="bg-emerald-500/15 text-emerald-600 text-xs font-bold">{merchant.discountPercent}% OFF</Badge>
                      {eligibleItems.length < cartItems.length && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">{eligibleItems.length} of {cartItems.length} items</p>
                      )}
                    </div>
                  ) : (
                    <Badge className="bg-muted text-muted-foreground text-xs shrink-0">No Discount</Badge>
                  )}
                </div>
                <div className="flex items-end justify-between pt-2 border-t border-border/30">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">You pay</p>
                    <p className="text-lg font-bold text-foreground">{selectedCountry.currencySymbol}{formatNum(totalToPay)}</p>
                  </div>
                  {hasAnyDiscount ? (
                    <div className="text-right">
                      <p className="text-xs font-medium text-muted-foreground">You save</p>
                      <p className="text-sm font-bold text-emerald-600">{selectedCountry.currencySymbol}{formatNum(eligibleSavings)}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Full price • No Bulk Discount</p>
                  )}
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── STEP 4: PAYMENT ───
  const renderPaymentStep = () => {
    if (!selectedMerchant || !selectedCountry) return null;

    // Conditional discount: only items with qty >= 10 get discount
    const itemBreakdown = cartItems.map(({ voucher, quantity }) => {
      const lineTotal = voucher.mobiValue * quantity;
      const isDiscountEligible = quantity >= 10;
      const { discounted, savings } = isDiscountEligible
        ? calculateDiscountedAmount(lineTotal, selectedMerchant.discountPercent)
        : { discounted: lineTotal, savings: 0 };
      return { voucher, quantity, lineTotal, isDiscountEligible, discounted, savings };
    });

    const totalRegular = itemBreakdown.reduce((s, i) => s + i.lineTotal, 0);
    const totalSavings = itemBreakdown.reduce((s, i) => s + i.savings, 0);
    const totalToPay = totalRegular - totalSavings;

    return (
      <div className="bg-background pb-32">
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground">Order Summary</h1>
            <p className="text-xs text-muted-foreground">Review & pay</p>
          </div>
        </div>
        <div className="px-4 pt-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 mb-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Ticket className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm text-foreground">{selectedMerchant.name}</p>
                {selectedMerchant.isSubMerchant && (
                  <Badge variant="outline" className="text-[10px] px-1.5 h-4 border-primary/30 text-primary">Sub-Merchant</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{selectedCountry.flag} {selectedCountry.name} • {selectedMerchant.discountPercent}% Discount</p>
            </div>
          </div>
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden mb-4">
            <div className="px-3 py-2 bg-muted/50 border-b border-border/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Vouchers ({totalItems})</p>
            </div>
            <div className="divide-y divide-border/30">
              {itemBreakdown.map(({ voucher, quantity, lineTotal, isDiscountEligible, discounted, savings }) => (
                <div key={voucher.id} className="px-3 py-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-sm font-semibold text-foreground">M{formatNum(voucher.mobiValue)}</p>
                      <p className="text-xs text-muted-foreground">× {quantity} piece{quantity > 1 ? "s" : ""}</p>
                    </div>
                    <div className="text-right">
                      {isDiscountEligible ? (
                        <>
                          <p className="text-sm font-bold text-foreground">{selectedCountry.currencySymbol}{formatNum(discounted)}</p>
                          <p className="text-xs text-emerald-600 font-semibold">-{selectedCountry.currencySymbol}{formatNum(savings)} ({selectedMerchant.discountPercent}%)</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-bold text-foreground">{selectedCountry.currencySymbol}{formatNum(lineTotal)}</p>
                          <p className="text-xs text-amber-600">No Discount</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border/50 bg-card p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Voucher Value</span>
              <span className="font-semibold text-primary">M{formatNum(totalMobi)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Regular Price Value</span>
              <span className="font-semibold text-foreground">{selectedCountry.currencySymbol}{formatNum(totalRegular)}</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Merchant's Discount</span>
                <span className="font-semibold">-{selectedCountry.currencySymbol}{formatNum(totalSavings)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Merchants' Price</span>
              <span className="font-semibold text-foreground">{selectedCountry.currencySymbol}{formatNum(totalToPay)}</span>
            </div>
            <div className="border-t border-border/50 pt-2 flex justify-between">
              <span className="font-bold text-foreground">Amount to Pay</span>
              <span className="font-bold text-lg text-foreground">{selectedCountry.currencySymbol}{formatNum(totalToPay)}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">You receive M{formatNum(totalMobi)} in Mobi vouchers</p>
            {totalSavings === 0 && (
              <p className="text-xs text-amber-600 text-center">Tip: Order 10+ of any denomination to unlock discounts</p>
            )}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 safe-area-bottom">
          <Button onClick={handlePay} className="w-full h-12 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.97]">
            <CreditCard className="h-4 w-4 mr-2" />
            Pay {selectedCountry.currencySymbol}{formatNum(totalToPay)}
          </Button>
        </div>
      </div>
    );
  };

  // ─── STEP 5: PROCESSING ───
  const renderProcessingStep = () => (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
      {/* Spinning gradient ring */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-muted/30" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/50 animate-spin" />
        <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-2xl font-black text-primary">M</span>
        </div>
      </div>
      <p className="text-base font-semibold text-foreground mb-2 animate-fade-in">
        {PROCESSING_MESSAGES[processingMsg]}
      </p>
      <p className="text-xs text-muted-foreground animate-fade-in">Please wait, do not close this page</p>
      {/* Progress dots */}
      <div className="flex gap-2 mt-6">
        {PROCESSING_MESSAGES.map((_, i) => (
          <div key={i} className={`h-2 w-2 rounded-full transition-all duration-300 ${i <= processingMsg ? "bg-primary scale-110" : "bg-muted"}`} />
        ))}
      </div>
    </div>
  );

  // ─── STEP 6: SUCCESS ───
  const renderSuccessStep = () => {
    if (selfLoading) {
      return (
        <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-300 animate-spin" />
            <div className="absolute inset-3 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <span className="text-xl font-black text-emerald-600">M</span>
            </div>
          </div>
          <p className="text-base font-semibold text-foreground mb-1">Crediting your wallet...</p>
          <p className="text-xs text-muted-foreground">M{formatNum(remainingMobi)} incoming</p>
          <div className="flex gap-1.5 mt-6">
            {[0,1,2].map(i => (
              <div key={i} className="h-2 w-8 rounded-full bg-emerald-500/30 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.3}s` }} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (selfSuccess) {
      return (
        <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
          <div className="relative w-28 h-28 mb-6 animate-scale-in">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-0 rounded-full bg-emerald-500/10" />
            <div className="absolute inset-2 rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-14 w-14 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1 animate-fade-in">Wallet Credited!</h2>
          <p className="text-3xl font-black text-emerald-600 mb-2 animate-fade-in">M{formatNum(remainingMobi)}</p>
          <p className="text-sm text-muted-foreground mb-8 animate-fade-in">Successfully added to your Mobi Wallet</p>
          <Button onClick={handleSelfDone} className="w-full h-12 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.97] animate-fade-in">
            Done
          </Button>
        </div>
      );
    }

    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
        {/* Animated checkmark */}
        <div className="relative w-32 h-32 mb-6">
          {/* Expanding ring */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute inset-0 rounded-full bg-emerald-500/5" />
          {/* Green circle with check */}
          <div className="absolute inset-3 rounded-full bg-emerald-500 flex items-center justify-center animate-scale-in">
            <svg className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" className="animate-[draw_0.6s_ease-out_0.3s_both]" style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: "draw 0.6s ease-out 0.3s forwards" }} />
            </svg>
          </div>
          {/* Sparkles */}
          {[0,1,2,3,4,5].map(i => (
            <div key={i} className="absolute w-2 h-2 rounded-full bg-amber-400" style={{
              top: `${15 + 35 * Math.sin(i * Math.PI / 3)}%`,
              left: `${15 + 35 * Math.cos(i * Math.PI / 3)}%`,
              animation: `sparkle 1.5s ease-out ${0.5 + i * 0.1}s both`
            }} />
          ))}
        </div>

        <h2 className="text-2xl font-black text-foreground mb-1 animate-fade-in" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
          Payment Successful!
        </h2>
        <p className="text-sm text-muted-foreground mb-2 animate-fade-in" style={{ animationDelay: "0.7s", animationFillMode: "both" }}>
          You've received
        </p>
        <p className="text-4xl font-black text-primary mb-8 animate-fade-in" style={{ animationDelay: "0.9s", animationFillMode: "both" }}>
          M{formatNum(totalMobi)}
        </p>

        {showSuccessButtons && (
          <div className="w-full space-y-3 animate-fade-in">
            <Button onClick={handleUseForSelf} className="w-full h-14 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.97]">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Use for Myself
            </Button>
            <Button onClick={handleSendToSomeone} variant="outline" className="w-full h-14 rounded-xl text-sm font-bold border-2 touch-manipulation active:scale-[0.97]">
              <Send className="h-5 w-5 mr-2" />
              Send to Someone
            </Button>
          </div>
        )}
      </div>
    );
  };

  // ─── STEP 7: DISTRIBUTE ───
  const renderDistributeStep = () => {
    const allDistributed = remainingMobi <= 0;

    if (allDistributed) {
      return (
        <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
          <div className="relative w-28 h-28 mb-6 animate-scale-in">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-2 rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-14 w-14 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">All Vouchers Distributed!</h2>
          <p className="text-sm text-muted-foreground mb-3">M{formatNum(totalMobi)} shared across {transfers.length} transfer{transfers.length !== 1 ? "s" : ""}</p>
          {/* Transfer history */}
          <div className="w-full rounded-xl border border-border/50 bg-card overflow-hidden mb-6 max-h-48 overflow-y-auto">
            {transfers.map(t => (
              <div key={t.id} className="px-3 py-2.5 flex items-center gap-3 border-b border-border/20 last:border-0">
                <img src={t.recipientAvatar} alt="" className="h-8 w-8 rounded-full object-cover bg-muted" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{t.recipientName}</p>
                  <p className="text-[10px] text-muted-foreground">{t.timestamp.toLocaleTimeString()}</p>
                </div>
                <p className="text-sm font-bold text-foreground">M{formatNum(t.amount)}</p>
              </div>
            ))}
          </div>
          <Button onClick={() => navigate("/")} className="w-full h-12 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.97]">
            Done
          </Button>
        </div>
      );
    }

    return (
      <div className="bg-background min-h-screen pb-6">
        {/* Sticky header with balance */}
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-base font-bold text-foreground">Distribute Vouchers</h1>
              <p className="text-xs text-muted-foreground">Send or use your Mobi</p>
            </div>
          </div>
          <div className="px-4 pb-3">
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Available to Share</p>
                <p className="text-xl font-bold text-foreground">M{formatNum(remainingMobi)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">of M{formatNum(totalMobi)}</p>
                <p className="text-sm font-semibold text-muted-foreground">≈ ₦{formatNum(remainingMobi)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pt-4 space-y-3">
          {/* Send options */}
          <div onClick={() => handleChooseRecipientType("community")} className="rounded-xl border-2 border-border/50 bg-card p-4 flex items-center gap-4 active:scale-[0.97] transition-transform touch-manipulation cursor-pointer">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-foreground">Community Members</p>
              <p className="text-xs text-muted-foreground mt-0.5">Send to community elders & members</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <div onClick={() => handleChooseRecipientType("friends")} className="rounded-xl border-2 border-border/50 bg-card p-4 flex items-center gap-4 active:scale-[0.97] transition-transform touch-manipulation cursor-pointer">
            <div className="h-14 w-14 rounded-2xl bg-accent/50 flex items-center justify-center">
              <UserPlus className="h-7 w-7 text-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-foreground">Mobigate Friends</p>
              <p className="text-xs text-muted-foreground mt-0.5">Send to your friends on Mobigate</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Use for self option */}
          <div onClick={handleUseForSelf} className="rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center gap-4 active:scale-[0.97] transition-transform touch-manipulation cursor-pointer">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-foreground">Use Remaining for Myself</p>
              <p className="text-xs text-muted-foreground mt-0.5">Credit M{formatNum(remainingMobi)} to your wallet</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Transfer history */}
          {transfers.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Recent Transfers</p>
              <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                {transfers.map(t => (
                  <div key={t.id} className="px-3 py-2.5 flex items-center gap-3 border-b border-border/20 last:border-0">
                    <img src={t.recipientAvatar} alt="" className="h-8 w-8 rounded-full object-cover bg-muted" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{t.recipientName}</p>
                      <p className="text-[10px] text-muted-foreground">{t.timestamp.toLocaleTimeString()}</p>
                    </div>
                    <p className="text-sm font-bold text-emerald-600">-M{formatNum(t.amount)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── STEP 8: SEND TO USERS ───
  const renderSendToUsersStep = () => {
    if (sendLoading) {
      return (
        <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/50 animate-spin" />
            <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
              <Send className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-base font-semibold text-foreground mb-1">Sending Mobi...</p>
          <p className="text-xs text-muted-foreground">Transferring to {Object.keys(selectedRecipients).filter(k => selectedRecipients[k] > 0).length} recipient(s)</p>
          <div className="flex gap-1.5 mt-6">
            {[0,1,2].map(i => (
              <div key={i} className="h-2 w-8 rounded-full bg-primary/30 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ animation: `shimmer 1.5s ease-in-out infinite ${i * 0.3}s` }} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sendSuccess) {
      const sentEntries = Object.entries(selectedRecipients).filter(([, amt]) => amt > 0);
      const totalSent = sentEntries.reduce((s, [, amt]) => s + amt, 0);
      const userList = recipientType === "community"
        ? communityPeople.map(p => ({ id: p.id, name: p.name, avatar: p.imageUrl }))
        : mockFriends.map(f => ({ id: f.id, name: f.name, avatar: f.avatar }));

      return (
        <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
          <div className="relative w-24 h-24 mb-6 animate-scale-in">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-2 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1 animate-fade-in">Transfer Complete!</h2>
          <p className="text-2xl font-black text-emerald-600 mb-4 animate-fade-in">M{formatNum(totalSent)}</p>
          <div className="w-full rounded-xl border border-border/50 bg-card overflow-hidden mb-6 max-h-40 overflow-y-auto touch-auto">
            {sentEntries.map(([userId, amount]) => {
              const user = userList.find(u => u.id === userId);
              return (
                <div key={userId} className="px-3 py-2.5 flex items-center gap-3 border-b border-border/20 last:border-0">
                  <img src={user?.avatar || ""} alt="" className="h-8 w-8 rounded-full object-cover bg-muted" />
                  <p className="text-xs font-semibold text-foreground flex-1 truncate">{user?.name}</p>
                  <p className="text-sm font-bold text-foreground">M{formatNum(amount)}</p>
                </div>
              );
            })}
          </div>
          <Button onClick={handleSendDone} className="w-full h-12 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.97]">
            Continue
          </Button>
        </div>
      );
    }

    // Normal user selection view
    const userList = recipientType === "community"
      ? communityPeople.map(p => ({ id: p.id, name: p.name, avatar: p.imageUrl, isOnline: Math.random() > 0.5 }))
      : mockFriends.map(f => ({ id: f.id, name: f.name, avatar: f.avatar, isOnline: f.isOnline }));

    const filtered = searchQuery
      ? userList.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : userList;

    const quickAmounts = [100, 500, 1000, 5000];
    const canSend = Object.values(selectedRecipients).some(v => v > 0);

    return (
      <div className="bg-background min-h-screen pb-28">
        {/* Sticky header */}
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-base font-bold text-foreground">Select Recipients</h1>
              <p className="text-xs text-muted-foreground">{recipientType === "community" ? "Community Members" : "Mobigate Friends"}</p>
            </div>
          </div>
          {/* Balance banner */}
          <div className="px-4 pb-3">
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Available</p>
                <p className="text-lg font-bold text-foreground">M{formatNum(remainingMobi - totalAllocated)}</p>
              </div>
              <div className="text-right">
                {totalAllocated > 0 && (
                  <>
                    <p className="text-xs text-muted-foreground">Allocating</p>
                    <p className="text-sm font-bold text-primary">M{formatNum(totalAllocated)}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Search */}
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-9 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 touch-manipulation">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User list */}
        <div className="px-4 pt-3 space-y-2 overflow-y-auto touch-auto">
          {filtered.map(user => {
            const isSelected = selectedRecipients[user.id] !== undefined;
            const allocatedAmount = selectedRecipients[user.id] || 0;
            const maxForThisUser = remainingMobi - totalAllocated + allocatedAmount;

            return (
              <div key={user.id} className={`rounded-xl border-2 transition-all duration-150 overflow-hidden ${isSelected ? "border-primary bg-primary/5" : "border-border/50 bg-card"}`}>
                {/* User row */}
                <div onClick={() => toggleRecipient(user.id)} className="p-3 flex items-center gap-3 touch-manipulation cursor-pointer active:bg-muted/30">
                  <div className="relative">
                    <img src={user.avatar} alt="" className="h-10 w-10 rounded-full object-cover bg-muted" />
                    {user.isOnline && <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground">{user.isOnline ? "Online" : "Offline"}</p>
                  </div>
                  {isSelected ? (
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>

                {/* Amount allocator */}
                {isSelected && (
                  <div className="px-3 pb-3 pt-1 border-t border-border/30 animate-fade-in">
                    <p className="text-[10px] text-muted-foreground mb-2">Set amount (max M{formatNum(maxForThisUser)})</p>
                    {/* Quick picks */}
                    <div className="flex gap-1.5 mb-2 flex-wrap">
                      {quickAmounts.filter(a => a <= maxForThisUser).map(amt => (
                        <button key={amt} onClick={() => setRecipientAmount(user.id, amt)} className={`h-7 px-3 rounded-lg text-xs font-semibold touch-manipulation active:scale-90 transition-all ${allocatedAmount === amt ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                          M{formatNum(amt)}
                        </button>
                      ))}
                      {maxForThisUser >= 10000 && (
                        <button onClick={() => setRecipientAmount(user.id, 10000)} className={`h-7 px-3 rounded-lg text-xs font-semibold touch-manipulation active:scale-90 transition-all ${allocatedAmount === 10000 ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                          M10,000
                        </button>
                      )}
                    </div>
                    {/* Manual stepper */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => setRecipientAmount(user.id, Math.max(0, allocatedAmount - 100))} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
                        <Minus className="h-3.5 w-3.5 text-foreground" />
                      </button>
                      <div className="flex-1 text-center">
                        <input
                          type="number"
                          value={allocatedAmount || ""}
                          onChange={e => setRecipientAmount(user.id, parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full text-center text-lg font-bold bg-transparent text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <p className="text-[10px] text-muted-foreground">Mobi</p>
                      </div>
                      <button onClick={() => setRecipientAmount(user.id, allocatedAmount + 100)} className="h-8 w-8 rounded-full bg-primary flex items-center justify-center active:scale-90 touch-manipulation">
                        <Plus className="h-3.5 w-3.5 text-primary-foreground" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No users found</p>
            </div>
          )}
        </div>

        {/* Sticky send button */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 safe-area-bottom">
          <Button onClick={handleSendToRecipients} disabled={!canSend} className="w-full h-12 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 touch-manipulation active:scale-[0.97]">
            <Send className="h-4 w-4 mr-2" />
            Send M{formatNum(totalAllocated)} to {Object.keys(selectedRecipients).filter(k => selectedRecipients[k] > 0).length} recipient(s)
          </Button>
        </div>
      </div>
    );
  };

  // ─── REDEEM PIN STEP ───
  const renderRedeemPinStep = () => (
    <div className="bg-background min-h-screen pb-28">
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-base font-bold text-foreground">Redeem Voucher</h1>
          <p className="text-xs text-muted-foreground">Enter your voucher PIN code</p>
        </div>
      </div>
      <div className="px-4 pt-6 flex flex-col items-center">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Ticket className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm text-foreground font-semibold mb-1 text-center">Enter Your PIN Code</p>
        <p className="text-xs text-muted-foreground mb-6 text-center">Find the 16-digit PIN on your physical voucher card</p>
        <input
          type="text"
          inputMode="numeric"
          maxLength={16}
          value={redeemPin}
          onChange={e => { setRedeemPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 16)); setRedeemError(""); }}
          placeholder="Enter 16-digit PIN"
          className="w-full h-14 text-center text-xl font-mono font-bold tracking-[0.3em] rounded-xl border-2 border-primary/30 bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
        />
        {redeemError && (
          <p className="text-xs text-destructive mt-2 text-center">{redeemError}</p>
        )}
        <div className="flex gap-2 mt-3 text-center">
          <div className={`h-1.5 flex-1 rounded-full ${redeemPin.length >= 4 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-1.5 flex-1 rounded-full ${redeemPin.length >= 8 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-1.5 flex-1 rounded-full ${redeemPin.length >= 12 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-1.5 flex-1 rounded-full ${redeemPin.length >= 16 ? "bg-emerald-500" : "bg-muted"}`} />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">{redeemPin.length}/16 digits</p>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 safe-area-bottom">
        <Button
          onClick={() => {
            if (redeemPin.length !== 16) { setRedeemError("Please enter a valid 16-digit PIN"); return; }
            setStep("redeemProcessing");
            window.scrollTo(0, 0);
            setTimeout(() => { setStep("redeemSuccess"); window.scrollTo(0, 0); }, 3000);
          }}
          disabled={redeemPin.length < 16}
          className="w-full h-12 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.97]"
        >
          Redeem Voucher
        </Button>
      </div>
    </div>
  );

  // ─── REDEEM PROCESSING ───
  const renderRedeemProcessingStep = () => (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-muted/30" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-300 animate-spin" />
        <div className="absolute inset-3 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Ticket className="h-6 w-6 text-emerald-600" />
        </div>
      </div>
      <p className="text-base font-semibold text-foreground mb-2">Verifying PIN...</p>
      <p className="text-xs text-muted-foreground">Checking voucher validity</p>
      <div className="flex gap-1.5 mt-6">
        {[0,1,2].map(i => (
          <div key={i} className="h-2 w-8 rounded-full bg-emerald-500/30 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ animation: `shimmer 1.5s ease-in-out infinite ${i * 0.3}s` }} />
          </div>
        ))}
      </div>
    </div>
  );

  // ─── REDEEM SUCCESS ───
  const renderRedeemSuccessStep = () => {
    const mockDenom = 5000; // simulated denomination
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
        <div className="relative w-28 h-28 mb-6">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute inset-0 rounded-full bg-emerald-500/10" />
          <div className="absolute inset-2 rounded-full bg-emerald-500 flex items-center justify-center animate-scale-in">
            <CheckCircle2 className="h-14 w-14 text-white" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-1">Voucher Redeemed!</h2>
        <p className="text-3xl font-black text-emerald-600 mb-2">M{formatNum(mockDenom)}</p>
        <p className="text-sm text-muted-foreground mb-6">Successfully credited to your Mobi Wallet</p>
        <div className="w-full rounded-xl border border-border/50 bg-card p-4 space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">PIN Used</span>
            <span className="font-mono text-xs text-foreground">****{redeemPin.slice(-4)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount Credited</span>
            <span className="font-bold text-emerald-600">M{formatNum(mockDenom)}</span>
          </div>
        </div>
        <Button
          onClick={() => navigate("/wallet")}
          variant="outline"
          className="w-full h-12 rounded-xl text-sm font-semibold border-emerald-600 text-emerald-600 hover:bg-emerald-50 touch-manipulation active:scale-[0.97] mb-3"
        >
          View Wallet Balance Now
        </Button>
        <Button
          onClick={() => { setStep("vouchers"); setRedeemPin(""); window.scrollTo(0, 0); }}
          className="w-full h-12 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.97]"
        >
          Done
        </Button>
      </div>
    );
  };

  // ─── MAIN RENDER ───
  if (step === "vouchers") return renderVoucherStep();
  if (step === "redeemPin") return renderRedeemPinStep();
  if (step === "redeemProcessing") return renderRedeemProcessingStep();
  if (step === "redeemSuccess") return renderRedeemSuccessStep();
  if (step === "countries") return renderCountriesStep();
  if (step === "merchants") return renderMerchantsStep();
  if (step === "payment") return renderPaymentStep();
  if (step === "processing") return renderProcessingStep();
  if (step === "success") return renderSuccessStep();
  if (step === "distribute") return renderDistributeStep();
  if (step === "sendToUsers") return renderSendToUsersStep();
  return null;
}
