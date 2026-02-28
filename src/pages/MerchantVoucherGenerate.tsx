import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Check, Sparkles, CreditCard, ChevronRight, Wallet, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { rechargeVouchers, RechargeVoucher } from "@/data/rechargeVouchersData";
import {
  calculateBulkDiscount,
  getDiscountForBundles,
  initialMerchantWalletBalance,
  formatNum,
} from "@/data/merchantVoucherData";
import { platformVoucherDiscountSettings } from "@/data/platformSettingsData";

type Step = "denomination" | "bundles" | "summary" | "processing" | "complete";

const PROCESSING_MESSAGES = [
  "Initializing generation...",
  "Creating voucher cards...",
  "Generating serial numbers...",
  "Assigning PINs...",
  "Finalizing batch...",
];

export default function MerchantVoucherGenerate() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("denomination");
  const [selectedDenom, setSelectedDenom] = useState<RechargeVoucher | null>(null);
  const [bundleCount, setBundleCount] = useState(1);
  const [processingMsg, setProcessingMsg] = useState(0);
  const [walletBalance] = useState(initialMerchantWalletBalance);

  const lowTier = rechargeVouchers.filter(v => v.tier === "low");
  const midTier = rechargeVouchers.filter(v => v.tier === "mid");
  const highTier = rechargeVouchers.filter(v => v.tier === "high");

  const discount = selectedDenom ? calculateBulkDiscount(selectedDenom.mobiValue, bundleCount) : null;
  const currentTier = getDiscountForBundles(bundleCount);
  const insufficientBalance = discount ? walletBalance < discount.total : false;

  const handleBack = () => {
    if (step === "bundles") setStep("denomination");
    else if (step === "summary") setStep("bundles");
    else navigate(-1);
    window.scrollTo(0, 0);
  };

  const handleGenerate = () => {
    setStep("processing");
    setProcessingMsg(0);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (step !== "processing") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    PROCESSING_MESSAGES.forEach((_, i) => {
      if (i > 0) timers.push(setTimeout(() => setProcessingMsg(i), i * 700));
    });
    timers.push(setTimeout(() => {
      setStep("complete");
      window.scrollTo(0, 0);
    }, 3500));
    return () => timers.forEach(clearTimeout);
  }, [step]);

  // ─── Denomination Selection ───
  const renderDenomCard = (v: RechargeVoucher) => {
    const isSelected = selectedDenom?.id === v.id;
    return (
      <div
        key={v.id}
        onClick={() => setSelectedDenom(v)}
        className={`relative rounded-xl border-2 p-3 transition-all duration-150 touch-manipulation active:scale-[0.96] cursor-pointer ${
          isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border/50 bg-card hover:border-border"
        }`}
      >
        {v.isPopular && (
          <div className="absolute -top-2 -right-2">
            <Badge className="bg-amber-500 text-white text-xs px-1.5 py-0 h-5 gap-0.5">
              <Sparkles className="h-3 w-3" /> Hot
            </Badge>
          </div>
        )}
        {isSelected && (
          <div className="absolute top-1.5 left-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
        <div className="text-center pt-1">
          <p className="text-xs text-muted-foreground mb-0.5">Mobi</p>
          <p className={`font-bold ${v.mobiValue >= 100000 ? "text-sm" : "text-base"} text-foreground`}>
            M{formatNum(v.mobiValue)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">≈ ₦{formatNum(v.ngnPrice)}/card</p>
        </div>
      </div>
    );
  };

  const renderTier = (label: string, vouchers: RechargeVoucher[], desc: string) => (
    <div className="mb-5" key={label}>
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</h3>
        <span className="text-xs text-muted-foreground">{desc}</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {vouchers.map(renderDenomCard)}
      </div>
    </div>
  );

  if (step === "denomination") {
    return (
      <div className="bg-background min-h-screen pb-28">
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground">Generate Vouchers</h1>
            <p className="text-xs text-muted-foreground">Step 1: Select denomination</p>
          </div>
        </div>
        <div className="px-4 pt-4">
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 mb-4">
            <p className="text-xs text-foreground leading-relaxed">
              Select <strong>one denomination</strong> per generation. Each bundle contains <strong>100 voucher cards</strong>.
            </p>
          </div>
          {renderTier("Standard", lowTier, "M100 – M10,000")}
          {renderTier("Premium", midTier, "M15,000 – M100,000")}
          {renderTier("Elite", highTier, "M125,000 – M1,000,000")}
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 safe-area-bottom">
          <Button
            onClick={() => { setStep("bundles"); setBundleCount(1); window.scrollTo(0, 0); }}
            disabled={!selectedDenom}
            className="w-full h-12 text-sm font-semibold rounded-xl touch-manipulation active:scale-[0.97]"
          >
            {selectedDenom ? `Continue with M${formatNum(selectedDenom.mobiValue)}` : "Select a denomination"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  // ─── Bundle Count ───
  if (step === "bundles" && selectedDenom && discount) {
    return (
      <div className="bg-background min-h-screen pb-28">
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground">Bundle Count</h1>
            <p className="text-xs text-muted-foreground">Step 2: M{formatNum(selectedDenom.mobiValue)} per card</p>
          </div>
        </div>
        <div className="px-4 pt-4 space-y-4">
          {/* Stepper */}
          <div className="rounded-2xl border-2 border-primary/20 bg-card p-6 text-center">
            <p className="text-xs text-muted-foreground mb-3">Number of Bundles (100 cards each)</p>
            <div className="flex items-center justify-center gap-6 mb-4">
              <button
                onClick={() => setBundleCount(Math.max(1, bundleCount - 1))}
                className="h-12 w-12 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation"
              >
                <Minus className="h-5 w-5 text-foreground" />
              </button>
              <div>
                <p className="text-4xl font-black text-foreground">{bundleCount}</p>
                <p className="text-xs text-muted-foreground">bundle{bundleCount !== 1 ? "s" : ""}</p>
              </div>
              <button
                onClick={() => setBundleCount(bundleCount + 1)}
                className="h-12 w-12 rounded-full bg-primary flex items-center justify-center active:scale-90 touch-manipulation"
              >
                <Plus className="h-5 w-5 text-primary-foreground" />
              </button>
            </div>
            {/* Quick picks */}
            <div className="flex gap-2 justify-center flex-wrap">
              {[1, 5, 10, 25, 50, 100].map(n => (
                <button
                  key={n}
                  onClick={() => setBundleCount(n)}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold touch-manipulation active:scale-90 transition-all ${
                    bundleCount === n ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Summary */}
          <div className="rounded-xl border border-border/50 bg-card p-4 space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cards per bundle</span>
              <span className="font-semibold text-foreground">100</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total cards</span>
              <span className="font-bold text-foreground">{formatNum(discount.totalCards)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">₦{formatNum(discount.subtotal)}</span>
            </div>
            {discount.discountPercent > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Discount ({discount.discountPercent}%)</span>
                <span className="font-bold">-₦{formatNum(discount.discountAmount)}</span>
              </div>
            )}
            <div className="border-t border-border/50 pt-2 flex justify-between">
              <span className="font-bold text-foreground">Total</span>
              <span className="font-black text-lg text-foreground">₦{formatNum(discount.total)}</span>
            </div>
          </div>

          {/* Discount info */}
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border/30 bg-muted/30">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Bulk Discount Rate</p>
            </div>
            <div className="px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">Rate per bundle</span>
                <Badge className="text-xs h-5 bg-emerald-500/15 text-emerald-600">{platformVoucherDiscountSettings.discountPercentPerBundle}% / bundle</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">Your discount ({bundleCount} bundles)</span>
                <Badge className={`text-xs h-5 ${discount.discountPercent > 0 ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                  {discount.discountPercent > 0 ? `${discount.discountPercent}% off` : "No discount"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 safe-area-bottom">
          <Button
            onClick={() => { setStep("summary"); window.scrollTo(0, 0); }}
            className="w-full h-12 text-sm font-semibold rounded-xl touch-manipulation active:scale-[0.97]"
          >
            Review Order <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  // ─── Payment Summary ───
  if (step === "summary" && selectedDenom && discount) {
    return (
      <div className="bg-background min-h-screen pb-28">
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground">Order Summary</h1>
            <p className="text-xs text-muted-foreground">Step 3: Review & generate</p>
          </div>
        </div>
        <div className="px-4 pt-4 space-y-4">
          {/* Order Details */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-black text-primary">M</span>
              </div>
              <div>
                <p className="text-lg font-black text-foreground">M{formatNum(selectedDenom.mobiValue)}</p>
                <p className="text-xs text-muted-foreground">Voucher denomination</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-background/80 p-2.5">
                <p className="text-lg font-bold text-foreground">{bundleCount}</p>
                <p className="text-xs text-muted-foreground">Bundles</p>
              </div>
              <div className="rounded-lg bg-background/80 p-2.5">
                <p className="text-lg font-bold text-foreground">{formatNum(discount.totalCards)}</p>
                <p className="text-xs text-muted-foreground">Cards</p>
              </div>
              <div className="rounded-lg bg-background/80 p-2.5">
                <p className="text-lg font-bold text-emerald-600">{discount.discountPercent}%</p>
                <p className="text-xs text-muted-foreground">Discount</p>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="rounded-xl border border-border/50 bg-card p-4 space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Unit cost per card</span>
              <span className="font-semibold text-foreground">₦{formatNum(selectedDenom.mobiValue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal ({formatNum(discount.totalCards)} cards)</span>
              <span className="font-semibold text-foreground">₦{formatNum(discount.subtotal)}</span>
            </div>
            {discount.discountPercent > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Bulk discount ({discount.discountPercent}%)</span>
                <span className="font-bold">-₦{formatNum(discount.discountAmount)}</span>
              </div>
            )}
            <div className="border-t border-border/50 pt-2 flex justify-between">
              <span className="font-bold text-foreground">Total to Pay</span>
              <span className="font-black text-xl text-foreground">₦{formatNum(discount.total)}</span>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className={`rounded-xl border p-4 ${
            insufficientBalance ? "border-destructive/30 bg-destructive/5" : "border-emerald-500/30 bg-emerald-500/5"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground font-medium">Wallet Balance</span>
              </div>
              <span className={`text-sm font-bold ${insufficientBalance ? "text-destructive" : "text-emerald-600"}`}>
                ₦{formatNum(walletBalance)}
              </span>
            </div>
            {insufficientBalance && (
              <div className="mt-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-destructive font-semibold">Insufficient balance</p>
                  <p className="text-xs text-muted-foreground">You need ₦{formatNum(discount.total - walletBalance)} more</p>
                  <Button
                    onClick={() => navigate("/merchant-wallet-fund")}
                    size="sm"
                    variant="outline"
                    className="mt-2 h-8 text-xs border-destructive/30 text-destructive"
                  >
                    Fund Wallet
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 safe-area-bottom">
          <Button
            onClick={handleGenerate}
            disabled={insufficientBalance}
            className="w-full h-12 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.97]"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Generate & Pay ₦{formatNum(discount.total)}
          </Button>
        </div>
      </div>
    );
  }

  // ─── Processing ───
  if (step === "processing") {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-muted/30" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/50 animate-spin" />
          <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-black text-primary">M</span>
          </div>
        </div>
        <p className="text-base font-semibold text-foreground mb-2">{PROCESSING_MESSAGES[processingMsg]}</p>
        <p className="text-xs text-muted-foreground">Generating {formatNum(discount?.totalCards || 0)} voucher cards</p>
        <div className="flex gap-2 mt-6">
          {PROCESSING_MESSAGES.map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full transition-all duration-300 ${i <= processingMsg ? "bg-primary scale-110" : "bg-muted"}`} />
          ))}
        </div>
      </div>
    );
  }

  // ─── Complete ───
  if (step === "complete" && selectedDenom && discount) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
        <div className="relative w-28 h-28 mb-6">
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute inset-0 rounded-full bg-emerald-500/5" />
          <div className="absolute inset-2 rounded-full bg-emerald-500 flex items-center justify-center animate-scale-in">
            <svg className="h-14 w-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: "draw 0.6s ease-out 0.3s forwards" }} />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-black text-foreground mb-1">Generation Complete!</h2>
        <p className="text-sm text-muted-foreground mb-6">Your vouchers are ready</p>
        <div className="w-full rounded-xl border border-border/50 bg-card p-4 space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Denomination</span>
            <span className="font-bold text-foreground">M{formatNum(selectedDenom.mobiValue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Bundles</span>
            <span className="font-bold text-foreground">{bundleCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Cards</span>
            <span className="font-bold text-foreground">{formatNum(discount.totalCards)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="font-bold text-foreground">₦{formatNum(discount.total)}</span>
          </div>
        </div>
        <div className="w-full space-y-3">
          <Button
            onClick={() => navigate("/merchant-voucher-batches")}
            className="w-full h-12 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90 touch-manipulation active:scale-[0.97]"
          >
            View Batches
          </Button>
          <Button
            onClick={() => navigate("/merchant-voucher-management")}
            variant="outline"
            className="w-full h-12 rounded-xl text-sm font-semibold touch-manipulation active:scale-[0.97]"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
