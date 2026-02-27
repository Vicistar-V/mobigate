import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Sparkles, Check, MapPin, Star, ShieldCheck, ChevronRight, Ticket, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

type Step = "vouchers" | "countries" | "merchants" | "payment";

// Cart: voucherId -> quantity
type Cart = Record<string, number>;

const formatNum = (n: number) => n.toLocaleString("en-NG");

export default function BuyVouchersPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("vouchers");
  const [cart, setCart] = useState<Cart>({});
  const [selectedCountry, setSelectedCountry] = useState<MerchantCountry | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<MobiMerchant | null>(null);

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
    setStep("countries");
  };

  const goToMerchants = (country: MerchantCountry) => {
    setSelectedCountry(country);
    setStep("merchants");
  };

  const goToPayment = (merchant: MobiMerchant) => {
    setSelectedMerchant(merchant);
    setStep("payment");
  };

  const handleBack = () => {
    if (step === "countries") setStep("vouchers");
    else if (step === "merchants") setStep("countries");
    else if (step === "payment") setStep("merchants");
  };

  const handlePay = () => {
    toast({ title: "Payment initializing...", description: `Processing M${formatNum(totalMobi)} purchase via ${selectedMerchant?.name}` });
  };

  // ─── RENDER: Voucher Card ───
  const renderVoucherCard = (v: RechargeVoucher) => {
    const selected = !!cart[v.id];
    const qty = cart[v.id] || 0;

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
        {/* Popular badge */}
        {v.isPopular && (
          <div className="absolute -top-2 -right-2">
            <Badge className="bg-amber-500 text-white text-[9px] px-1.5 py-0 h-4 gap-0.5">
              <Sparkles className="h-2.5 w-2.5" /> Hot
            </Badge>
          </div>
        )}

        {/* Selection check */}
        {selected && (
          <div className="absolute top-1.5 left-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        )}

        {/* Value */}
        <div className="text-center pt-1">
          <p className="text-[10px] text-muted-foreground mb-0.5">Mobi</p>
          <p className={`font-bold ${v.mobiValue >= 100000 ? "text-sm" : "text-base"} text-foreground`}>
            M{formatNum(v.mobiValue)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            ≈ ₦{formatNum(v.ngnPrice)}
          </p>
        </div>

        {/* Quantity stepper */}
        {selected && (
          <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-border/50">
            <button
              onClick={(e) => changeQty(v.id, -1, e)}
              className="h-7 w-7 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation"
            >
              <Minus className="h-3.5 w-3.5 text-foreground" />
            </button>
            <span className="text-sm font-bold text-foreground w-6 text-center">{qty}</span>
            <button
              onClick={(e) => changeQty(v.id, 1, e)}
              className="h-7 w-7 rounded-full bg-primary flex items-center justify-center active:scale-90 touch-manipulation"
            >
              <Plus className="h-3.5 w-3.5 text-primary-foreground" />
            </button>
          </div>
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
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-foreground">Buy Mobi Vouchers</h1>
          <p className="text-[11px] text-muted-foreground">Select denominations & quantities</p>
        </div>
        {totalItems > 0 && (
          <button onClick={clearCart} className="text-xs text-destructive font-medium active:opacity-70 touch-manipulation">
            Clear
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {renderTier("Standard", lowTier, "M100 – M10,000")}
        {renderTier("Premium", midTier, "M15,000 – M100,000")}
        {renderTier("Elite", highTier, "M125,000 – M1,000,000")}
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 safe-area-bottom">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[11px] text-muted-foreground">{totalItems} voucher{totalItems !== 1 ? "s" : ""} selected</p>
            <p className="text-lg font-bold text-foreground">M{formatNum(totalMobi)}</p>
          </div>
          <p className="text-xs text-muted-foreground">≈ ₦{formatNum(totalMobi)}</p>
        </div>
        <Button
          onClick={goToCountries}
          disabled={totalItems === 0}
          className="w-full h-12 text-sm font-semibold rounded-xl touch-manipulation active:scale-[0.97]"
        >
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
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground">Select Country</h1>
            <p className="text-[11px] text-muted-foreground">Cart: M{formatNum(totalMobi)} ({totalItems} items)</p>
          </div>
        </div>

        <div className="px-4 pt-4">
          {/* Info */}
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 mb-4">
            <p className="text-xs text-foreground leading-relaxed">
              Choose your country to see accredited merchants and their rates in your local currency.
            </p>
          </div>

          {/* Local country */}
          {local && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Your Country</p>
              <div
                onClick={() => goToMerchants(local)}
                className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 flex items-center gap-3 active:scale-[0.97] transition-transform touch-manipulation cursor-pointer"
              >
                <span className="text-3xl">{local.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground">{local.name}</p>
                  <p className="text-xs text-muted-foreground">{local.currencySymbol} {local.currencyCode} • {local.merchants.length} merchants</p>
                </div>
                <Badge className="bg-primary/10 text-primary text-[10px]">Local</Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}

          {/* Other countries */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">International</p>
          <div className="space-y-2">
            {others.map((country) => (
              <div
                key={country.id}
                onClick={() => goToMerchants(country)}
                className="rounded-xl border border-border/50 bg-card p-3.5 flex items-center gap-3 active:scale-[0.97] transition-transform touch-manipulation cursor-pointer"
              >
                <span className="text-2xl">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">{country.name}</p>
                  <p className="text-[11px] text-muted-foreground">{country.currencySymbol} {country.currencyCode} • {country.merchants.length} merchants</p>
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
    const activeMerchants = selectedCountry.merchants
      .filter((m) => m.isActive)
      .sort((a, b) => b.discountPercent - a.discountPercent);

    return (
      <div className="bg-background pb-6">
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground">{selectedCountry.flag} {selectedCountry.name}</h1>
            <p className="text-[11px] text-muted-foreground">Select a merchant • M{formatNum(totalMobi)}</p>
          </div>
        </div>

        <div className="px-4 pt-4 space-y-2.5">
          {activeMerchants.map((merchant) => {
            const { discounted, savings } = calculateDiscountedAmount(totalMobi, merchant.discountPercent);
            return (
              <div
                key={merchant.id}
                onClick={() => goToPayment(merchant)}
                className="rounded-xl border border-border/50 bg-card p-4 active:scale-[0.97] transition-transform touch-manipulation cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm text-foreground truncate">{merchant.name}</p>
                      {merchant.isVerified && <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">{merchant.city}</span>
                      <span className="text-muted-foreground mx-1">•</span>
                      <Star className="h-3 w-3 text-amber-500" />
                      <span className="text-[11px] text-muted-foreground">{merchant.rating}</span>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-600 text-[11px] font-bold shrink-0">
                    {merchant.discountPercent}% OFF
                  </Badge>
                </div>

                <div className="flex items-end justify-between pt-2 border-t border-border/30">
                  <div>
                    <p className="text-[10px] text-muted-foreground">You pay</p>
                    <p className="text-base font-bold text-foreground">
                      {selectedCountry.currencySymbol}{formatNum(discounted)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">You save</p>
                    <p className="text-sm font-semibold text-emerald-600">
                      {selectedCountry.currencySymbol}{formatNum(savings)}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
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
    const { discounted, savings } = calculateDiscountedAmount(totalMobi, selectedMerchant.discountPercent);

    return (
      <div className="bg-background pb-32">
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground">Order Summary</h1>
            <p className="text-[11px] text-muted-foreground">Review & pay</p>
          </div>
        </div>

        <div className="px-4 pt-4">
          {/* Merchant info */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 mb-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Ticket className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-foreground">{selectedMerchant.name}</p>
              <p className="text-[11px] text-muted-foreground">{selectedCountry.flag} {selectedCountry.name} • {selectedMerchant.discountPercent}% discount</p>
            </div>
          </div>

          {/* Cart items */}
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden mb-4">
            <div className="px-3 py-2 bg-muted/50 border-b border-border/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Vouchers ({totalItems})</p>
            </div>
            <div className="divide-y divide-border/30">
              {cartItems.map(({ voucher, quantity }) => (
                <div key={voucher.id} className="px-3 py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">M{formatNum(voucher.mobiValue)}</p>
                    <p className="text-[10px] text-muted-foreground">× {quantity} piece{quantity > 1 ? "s" : ""}</p>
                  </div>
                  <p className="text-sm font-bold text-foreground">M{formatNum(voucher.mobiValue * quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="rounded-xl border border-border/50 bg-card p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal (Mobi)</span>
              <span className="font-semibold text-foreground">M{formatNum(totalMobi)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Merchant Rate</span>
              <span className="font-semibold text-foreground">{selectedCountry.currencySymbol}{formatNum(totalMobi)}</span>
            </div>
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Discount ({selectedMerchant.discountPercent}%)</span>
              <span className="font-semibold">-{selectedCountry.currencySymbol}{formatNum(savings)}</span>
            </div>
            <div className="border-t border-border/50 pt-2 flex justify-between">
              <span className="font-bold text-foreground">Total to Pay</span>
              <span className="font-bold text-lg text-foreground">{selectedCountry.currencySymbol}{formatNum(discounted)}</span>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              You receive M{formatNum(totalMobi)} in Mobi vouchers
            </p>
          </div>
        </div>

        {/* Pay button */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 safe-area-bottom">
          <Button
            onClick={handlePay}
            className="w-full h-12 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.97]"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Pay {selectedCountry.currencySymbol}{formatNum(discounted)}
          </Button>
        </div>
      </div>
    );
  };

  // ─── MAIN RENDER ───
  if (step === "vouchers") return renderVoucherStep();
  if (step === "countries") return renderCountriesStep();
  if (step === "merchants") return renderMerchantsStep();
  if (step === "payment") return renderPaymentStep();
  return null;
}
