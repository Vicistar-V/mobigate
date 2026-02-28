import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Check, Store, ChevronRight, CreditCard, CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockParentMerchants, ParentMerchant, MerchantStock, initialSubMerchantWalletBalance } from "@/data/subMerchantVoucherData";
import { formatNum } from "@/data/merchantVoucherData";

type Step = "denomination" | "bundles" | "merchant" | "summary" | "processing" | "success";

interface SelectedItem {
  denomination: number;
  bundleCount: number;
}

const PROCESSING_MESSAGES = ["Connecting to merchant...", "Processing order...", "Verifying stock...", "Completing purchase..."];

export default function SubMerchantBuyVouchers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("denomination");
  const [selectedDenom, setSelectedDenom] = useState<number | null>(null);
  const [bundleCount, setBundleCount] = useState(1);
  const [selectedMerchant, setSelectedMerchant] = useState<ParentMerchant | null>(null);
  const [processingMsg, setProcessingMsg] = useState(0);

  const availableDenoms = useMemo(() => {
    const denoms = new Set<number>();
    mockParentMerchants.forEach(pm => pm.availableStock.forEach(s => denoms.add(s.denomination)));
    return [...denoms].sort((a, b) => a - b);
  }, []);

  const merchantsWithStock = useMemo(() => {
    if (!selectedDenom) return [];
    return mockParentMerchants.filter(pm =>
      pm.status === "active" && pm.availableStock.some(s => s.denomination === selectedDenom && s.availableBundles > 0)
    );
  }, [selectedDenom]);

  const selectedStock = useMemo(() => {
    if (!selectedMerchant || !selectedDenom) return null;
    return selectedMerchant.availableStock.find(s => s.denomination === selectedDenom) || null;
  }, [selectedMerchant, selectedDenom]);

  const totalCost = selectedStock ? selectedStock.pricePerBundle * bundleCount : 0;
  const totalCards = bundleCount * 100;

  const handleBack = () => {
    if (step === "bundles") setStep("denomination");
    else if (step === "merchant") setStep("bundles");
    else if (step === "summary") setStep("merchant");
    else navigate(-1);
    window.scrollTo(0, 0);
  };

  const handlePay = () => {
    if (totalCost > initialSubMerchantWalletBalance) {
      toast({ title: "Insufficient Balance", description: "Please fund your wallet first" });
      return;
    }
    setStep("processing");
    setProcessingMsg(0);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (step !== "processing") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    PROCESSING_MESSAGES.forEach((_, i) => {
      if (i > 0) timers.push(setTimeout(() => setProcessingMsg(i), i * 800));
    });
    timers.push(setTimeout(() => { setStep("success"); window.scrollTo(0, 0); }, 3200));
    return () => timers.forEach(clearTimeout);
  }, [step]);

  // Step 1: Select denomination
  if (step === "denomination") {
    return (
      <div className="bg-background min-h-screen pb-6">
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground">Buy from Merchant</h1>
            <p className="text-xs text-muted-foreground">Step 1: Select denomination</p>
          </div>
        </div>
        <div className="px-4 pt-4">
          <p className="text-sm text-foreground mb-3">Choose the voucher denomination you want to purchase:</p>
          <div className="grid grid-cols-2 gap-2.5">
            {availableDenoms.map(d => (
              <div
                key={d}
                onClick={() => { setSelectedDenom(d); setStep("bundles"); setBundleCount(1); window.scrollTo(0, 0); }}
                className="rounded-xl border-2 border-border/50 bg-card p-4 text-center active:scale-[0.96] transition-transform touch-manipulation cursor-pointer hover:border-primary/30"
              >
                <p className="text-xs text-muted-foreground mb-0.5">Mobi</p>
                <p className="text-lg font-black text-foreground">M{formatNum(d)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">≈ ₦{formatNum(d)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Select bundle count
  if (step === "bundles") {
    return (
      <div className="bg-background min-h-screen pb-32">
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground">M{formatNum(selectedDenom!)} Vouchers</h1>
            <p className="text-xs text-muted-foreground">Step 2: How many bundles?</p>
          </div>
        </div>
        <div className="px-4 pt-6 flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-4">Each bundle contains 100 cards</p>
          <div className="flex items-center gap-6 mb-6">
            <button onClick={() => setBundleCount(Math.max(1, bundleCount - 1))} className="h-12 w-12 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
              <Minus className="h-5 w-5 text-foreground" />
            </button>
            <div className="text-center">
              <p className="text-4xl font-black text-foreground">{bundleCount}</p>
              <p className="text-xs text-muted-foreground">bundle{bundleCount !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => setBundleCount(bundleCount + 1)} className="h-12 w-12 rounded-full bg-primary flex items-center justify-center active:scale-90 touch-manipulation">
              <Plus className="h-5 w-5 text-primary-foreground" />
            </button>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 w-full space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cards</span>
              <span className="font-bold text-foreground">{formatNum(bundleCount * 100)}</span>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 safe-area-bottom">
          <Button onClick={() => { setStep("merchant"); window.scrollTo(0, 0); }} className="w-full h-12 text-sm font-semibold rounded-xl touch-manipulation active:scale-[0.97]">
            Select Merchant <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Select merchant
  if (step === "merchant") {
    return (
      <div className="bg-background min-h-screen pb-6">
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground">Select Merchant</h1>
            <p className="text-xs text-muted-foreground">M{formatNum(selectedDenom!)} × {bundleCount} bundle{bundleCount !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <div className="px-4 pt-3 space-y-2.5">
          {merchantsWithStock.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No merchants have M{formatNum(selectedDenom!)} in stock</p>
            </div>
          )}
          {merchantsWithStock.map(pm => {
            const stock = pm.availableStock.find(s => s.denomination === selectedDenom)!;
            const canFulfill = stock.availableBundles >= bundleCount;
            return (
              <div
                key={pm.id}
                onClick={() => { if (canFulfill) { setSelectedMerchant(pm); setStep("summary"); window.scrollTo(0, 0); } }}
                className={`rounded-xl border border-border/50 bg-card p-4 transition-transform touch-manipulation cursor-pointer ${canFulfill ? "active:scale-[0.97]" : "opacity-50"}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-foreground">{pm.name}</p>
                    <p className="text-xs text-muted-foreground">{pm.city}, {pm.state}</p>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-600 text-xs font-bold">{pm.discountRate}% OFF</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{stock.availableBundles} bundles available</span>
                  <span>₦{formatNum(stock.pricePerBundle)}/bundle</span>
                </div>
                {!canFulfill && <p className="text-xs text-destructive mt-1">Not enough stock for {bundleCount} bundles</p>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Step 4: Order summary
  if (step === "summary") {
    return (
      <div className="bg-background min-h-screen pb-32">
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground">Order Summary</h1>
            <p className="text-xs text-muted-foreground">Review & confirm</p>
          </div>
        </div>
        <div className="px-4 pt-4 space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{selectedMerchant?.name}</p>
              <p className="text-xs text-muted-foreground">{selectedMerchant?.discountRate}% discount rate</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-card p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Denomination</span>
              <span className="font-bold text-foreground">M{formatNum(selectedDenom!)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bundles</span>
              <span className="font-bold text-foreground">{bundleCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Cards</span>
              <span className="font-bold text-foreground">{formatNum(totalCards)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price per Bundle</span>
              <span className="font-bold text-foreground">₦{formatNum(selectedStock?.pricePerBundle || 0)}</span>
            </div>
            <div className="border-t border-border/50 pt-2 flex justify-between">
              <span className="font-bold text-foreground">Total Cost</span>
              <span className="font-bold text-lg text-foreground">₦{formatNum(totalCost)}</span>
            </div>
          </div>

          <div className="rounded-xl bg-muted/50 p-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Wallet Balance: ₦{formatNum(initialSubMerchantWalletBalance)}</p>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 safe-area-bottom">
          <Button onClick={handlePay} className="w-full h-12 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.97]">
            <CreditCard className="h-4 w-4 mr-2" /> Pay ₦{formatNum(totalCost)}
          </Button>
        </div>
      </div>
    );
  }

  // Step 5: Processing
  if (step === "processing") {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-muted/30" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/50 animate-spin" />
          <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
            <Store className="h-6 w-6 text-primary" />
          </div>
        </div>
        <p className="text-base font-semibold text-foreground mb-2">{PROCESSING_MESSAGES[processingMsg]}</p>
        <p className="text-xs text-muted-foreground">Please wait</p>
        <div className="flex gap-2 mt-6">
          {PROCESSING_MESSAGES.map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full transition-all duration-300 ${i <= processingMsg ? "bg-primary scale-110" : "bg-muted"}`} />
          ))}
        </div>
      </div>
    );
  }

  // Step 6: Success
  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
      <div className="relative w-28 h-28 mb-6">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: "2s" }} />
        <div className="absolute inset-0 rounded-full bg-emerald-500/10" />
        <div className="absolute inset-2 rounded-full bg-emerald-500 flex items-center justify-center animate-scale-in">
          <CheckCircle2 className="h-14 w-14 text-white" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-foreground mb-1">Purchase Complete!</h2>
      <p className="text-sm text-muted-foreground mb-2">From {selectedMerchant?.name}</p>
      <p className="text-3xl font-black text-emerald-600 mb-1">{formatNum(totalCards)} cards</p>
      <p className="text-sm text-muted-foreground mb-6">M{formatNum(selectedDenom!)} × {bundleCount} bundle{bundleCount !== 1 ? "s" : ""}</p>
      <div className="w-full space-y-3">
        <Button
          onClick={() => navigate("/sub-merchant-voucher-batches")}
          className="w-full h-12 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.97]"
        >
          View My Batches
        </Button>
        <Button
          onClick={() => navigate("/sub-merchant-voucher-management")}
          variant="outline"
          className="w-full h-12 rounded-xl text-sm font-semibold touch-manipulation active:scale-[0.97]"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
