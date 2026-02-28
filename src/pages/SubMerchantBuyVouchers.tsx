import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Check, Store, ChevronRight, CreditCard, CheckCircle2, Package, Printer, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockParentMerchants, ParentMerchant, MerchantStock, initialSubMerchantWalletBalance } from "@/data/subMerchantVoucherData";
import { formatNum, generateBatchNumber } from "@/data/merchantVoucherData";

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
  const [receiptData] = useState(() => ({
    transactionRef: `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    batchNumber: generateBatchNumber(new Date(), "SM01"),
    dateTime: new Date(),
  }));

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

  const handlePrintReceipt = useCallback(() => {
    const printDiv = document.createElement("div");
    printDiv.id = "receipt-print-area";
    printDiv.innerHTML = `
      <style>
        @media print {
          body > *:not(#receipt-print-area) { display: none !important; }
          #receipt-print-area { display: block !important; }
        }
        #receipt-print-area {
          font-family: 'Courier New', monospace;
          max-width: 80mm;
          margin: 0 auto;
          padding: 8mm;
        }
        .receipt-title { text-align: center; font-size: 14pt; font-weight: 900; margin-bottom: 4mm; border-bottom: 2px dashed #000; padding-bottom: 4mm; }
        .receipt-row { display: flex; justify-content: space-between; font-size: 9pt; margin-bottom: 2mm; }
        .receipt-row .label { color: #555; }
        .receipt-row .val { font-weight: bold; text-align: right; }
        .receipt-divider { border-top: 1px dashed #999; margin: 3mm 0; }
        .receipt-total { font-size: 12pt; font-weight: 900; text-align: center; margin: 4mm 0; }
        .receipt-footer { text-align: center; font-size: 7pt; color: #888; margin-top: 6mm; }
        @page { size: auto; margin: 10mm; }
      </style>
      <div class="receipt-title">VOUCHER PURCHASE<br/>RECEIPT</div>
      <div class="receipt-row"><span class="label">Receipt No</span><span class="val">${receiptData.transactionRef}</span></div>
      <div class="receipt-row"><span class="label">Date</span><span class="val">${receiptData.dateTime.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })}</span></div>
      <div class="receipt-row"><span class="label">Time</span><span class="val">${receiptData.dateTime.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}</span></div>
      <div class="receipt-divider"></div>
      <div class="receipt-row"><span class="label">Purchased From</span><span class="val">${selectedMerchant?.name || ""}</span></div>
      <div class="receipt-row"><span class="label">Denomination</span><span class="val">M${formatNum(selectedDenom || 0)}</span></div>
      <div class="receipt-row"><span class="label">Bundles</span><span class="val">${bundleCount}</span></div>
      <div class="receipt-row"><span class="label">Total Cards</span><span class="val">${formatNum(totalCards)}</span></div>
      <div class="receipt-row"><span class="label">Batch Number</span><span class="val">${receiptData.batchNumber}</span></div>
      <div class="receipt-divider"></div>
      <div class="receipt-row"><span class="label">Price/Bundle</span><span class="val">₦${formatNum(selectedStock?.pricePerBundle || 0)}</span></div>
      <div class="receipt-total">TOTAL: ₦${formatNum(totalCost)}</div>
      <div class="receipt-row"><span class="label">Balance After</span><span class="val">₦${formatNum(initialSubMerchantWalletBalance - totalCost)}</span></div>
      <div class="receipt-footer">Thank you for your business<br/>Mobi Voucher System</div>
    `;
    printDiv.style.display = "none";
    document.body.appendChild(printDiv);
    const cleanup = () => { document.body.removeChild(printDiv); window.removeEventListener("afterprint", cleanup); };
    window.addEventListener("afterprint", cleanup);
    printDiv.style.display = "block";
    setTimeout(() => window.print(), 100);
  }, [selectedDenom, selectedMerchant, bundleCount, totalCards, totalCost, selectedStock, receiptData]);

  // Step 1: Select denomination
  if (step === "denomination") {
    return (
      <div className="bg-background min-h-screen pb-6">
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
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
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
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
              <input
                type="number"
                inputMode="numeric"
                min={1}
                value={bundleCount === 0 ? '' : bundleCount}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === '') { setBundleCount(0); return; }
                  const val = parseInt(raw);
                  if (!isNaN(val) && val >= 0) setBundleCount(val);
                }}
                onBlur={() => { if (bundleCount < 1) setBundleCount(1); }}
                className="w-20 text-4xl font-black text-foreground text-center bg-transparent border-b-2 border-primary/40 focus:border-primary outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                style={{ MozAppearance: 'textfield' }}
              />
              <p className="text-xs text-muted-foreground mt-1">bundle{bundleCount !== 1 ? "s" : ""}</p>
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
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
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
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
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
              <p className="text-xs text-muted-foreground">{selectedMerchant?.discountRate}% Discount Rate</p>
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

  // Step 6: Success with Receipt
  return (
    <div className="bg-background min-h-screen pb-6">
      {/* Success Header */}
      <div className="flex flex-col items-center pt-8 pb-4 px-6">
        <div className="relative w-20 h-20 mb-4">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute inset-0 rounded-full bg-emerald-500/10" />
          <div className="absolute inset-2 rounded-full bg-emerald-500 flex items-center justify-center animate-scale-in">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-lg font-black text-foreground mb-0.5">Purchase Complete!</h2>
        <p className="text-sm text-muted-foreground">From {selectedMerchant?.name}</p>
      </div>

      {/* Receipt Card */}
      <div className="mx-4">
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="bg-muted/40 px-4 py-3 border-b border-border/30 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Voucher Purchase Receipt</p>
            </div>
            <p className="text-xs text-muted-foreground font-mono">{receiptData.transactionRef}</p>
          </div>

          <div className="p-4 space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date & Time</span>
              <span className="font-semibold text-foreground text-right">
                {receiptData.dateTime.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })}{" "}
                {receiptData.dateTime.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Purchased From</span>
              <span className="font-bold text-foreground">{selectedMerchant?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Batch Number</span>
              <span className="font-bold text-foreground text-right text-xs font-mono">{receiptData.batchNumber}</span>
            </div>

            <div className="border-t border-dashed border-border/50 my-1" />

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

            <div className="border-t border-dashed border-border/50 my-1" />

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price per Bundle</span>
              <span className="font-semibold text-foreground">₦{formatNum(selectedStock?.pricePerBundle || 0)}</span>
            </div>
            <div className="border-t border-border/50 pt-2 flex justify-between">
              <span className="font-bold text-foreground">Total Paid</span>
              <span className="font-black text-lg text-foreground">₦{formatNum(totalCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Wallet Balance</span>
              <span className="font-semibold text-emerald-600">₦{formatNum(initialSubMerchantWalletBalance - totalCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mx-4 mt-4 space-y-3">
        <Button
          onClick={handlePrintReceipt}
          variant="outline"
          className="w-full h-12 rounded-xl text-sm font-semibold touch-manipulation active:scale-[0.97]"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Receipt
        </Button>
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
