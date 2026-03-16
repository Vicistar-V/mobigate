import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Check, Sparkles, CreditCard, ChevronRight, Wallet, AlertTriangle, Printer, Receipt, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { rechargeVouchers, RechargeVoucher } from "@/data/rechargeVouchersData";
import {
  calculateBulkDiscount,
  initialMerchantWalletBalance,
  formatNum,
  generateBatchNumber,
} from "@/data/merchantVoucherData";
import { getTieredDiscount, MIN_DISCOUNT_ORDER_VALUE, platformVoucherDiscountSettings } from "@/data/platformSettingsData";

type Step = "select" | "summary" | "processing" | "complete";

interface VoucherSelection {
  denomination: RechargeVoucher;
  bundleCount: number;
}

interface LineItemCalc {
  denomination: RechargeVoucher;
  bundleCount: number;
  totalCards: number;
  subtotal: number;
  meetsMinOrder: boolean;
  discountPercent: number;
  discountAmount: number;
  total: number;
  tier: number;
  tierLabel: string;
}

const PROCESSING_MESSAGES = [
  "Initializing generation...",
  "Creating voucher cards...",
  "Generating serial numbers...",
  "Assigning PINs...",
  "Finalizing batch...",
];

export default function MerchantVoucherGenerate() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("select");
  const [selections, setSelections] = useState<VoucherSelection[]>([]);
  const [processingMsg, setProcessingMsg] = useState(0);
  const [walletBalance] = useState(initialMerchantWalletBalance);
  const [receiptData] = useState(() => ({
    transactionRef: `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    batchNumber: generateBatchNumber(new Date()),
    dateTime: new Date(),
  }));

  const lowTier = rechargeVouchers.filter(v => v.tier === "low" && v.isActive);
  const midTier = rechargeVouchers.filter(v => v.tier === "mid" && v.isActive);
  const highTier = rechargeVouchers.filter(v => v.tier === "high" && v.isActive);

  // Selection helpers
  const isSelected = (id: string) => selections.some(s => s.denomination.id === id);
  const getSelection = (id: string) => selections.find(s => s.denomination.id === id);

  const toggleDenom = (v: RechargeVoucher) => {
    if (isSelected(v.id)) {
      setSelections(prev => prev.filter(s => s.denomination.id !== v.id));
    } else {
      setSelections(prev => [...prev, { denomination: v, bundleCount: 1 }]);
    }
  };

  const updateBundleCount = (id: string, delta: number) => {
    setSelections(prev => prev.map(s =>
      s.denomination.id === id ? { ...s, bundleCount: Math.max(1, s.bundleCount + delta) } : s
    ));
  };

  const setBundleCountDirect = (id: string, val: number) => {
    setSelections(prev => prev.map(s =>
      s.denomination.id === id ? { ...s, bundleCount: val } : s
    ));
  };

  // Per-denomination discount calculation
  const lineItems: LineItemCalc[] = useMemo(() => {
    return selections.map(sel => {
      const disc = calculateBulkDiscount(sel.denomination.mobiValue, sel.bundleCount);
      const subtotal = disc.subtotal;
      const meetsMinOrder = subtotal >= MIN_DISCOUNT_ORDER_VALUE;
      const tiered = getTieredDiscount(sel.bundleCount);
      const discountPercent = meetsMinOrder ? disc.discountPercent : 0;
      const discountAmount = meetsMinOrder ? disc.discountAmount : 0;
      const total = meetsMinOrder ? disc.total : subtotal;
      return {
        denomination: sel.denomination,
        bundleCount: sel.bundleCount,
        totalCards: disc.totalCards,
        subtotal,
        meetsMinOrder,
        discountPercent,
        discountAmount,
        total,
        tier: tiered.tier,
        tierLabel: tiered.tierLabel,
      };
    });
  }, [selections]);

  const totalBundles = selections.reduce((sum, s) => sum + s.bundleCount, 0);
  const totalCards = totalBundles * 100;
  const grandSubtotal = lineItems.reduce((sum, li) => sum + li.subtotal, 0);
  const grandDiscount = lineItems.reduce((sum, li) => sum + li.discountAmount, 0);
  const grandTotal = lineItems.reduce((sum, li) => sum + li.total, 0);
  const insufficientBalance = grandTotal > walletBalance;

  const handleBack = () => {
    if (step === "summary") setStep("select");
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

  const handlePrintReceipt = useCallback(() => {
    const denomRows = lineItems.map(li => `
      <div class="receipt-row"><span class="label">M${formatNum(li.denomination.mobiValue)} × ${li.bundleCount} bundle${li.bundleCount !== 1 ? "s" : ""}</span><span class="val">₦${formatNum(li.subtotal)}</span></div>
      ${li.discountPercent > 0 ? `<div class="receipt-row"><span class="label" style="color:green">  Discount (${li.discountPercent}%)</span><span class="val" style="color:green">-₦${formatNum(li.discountAmount)}</span></div>` : ""}
    `).join("");

    const printDiv = document.createElement("div");
    printDiv.id = "receipt-print-area";
    printDiv.innerHTML = `
      <style>
        @media print {
          body > *:not(#receipt-print-area) { display: none !important; }
          #receipt-print-area { display: block !important; }
        }
        #receipt-print-area { font-family: 'Courier New', monospace; max-width: 80mm; margin: 0 auto; padding: 8mm; }
        .receipt-title { text-align: center; font-size: 14pt; font-weight: 900; margin-bottom: 4mm; border-bottom: 2px dashed #000; padding-bottom: 4mm; }
        .receipt-row { display: flex; justify-content: space-between; font-size: 9pt; margin-bottom: 2mm; }
        .receipt-row .label { color: #555; }
        .receipt-row .val { font-weight: bold; text-align: right; }
        .receipt-divider { border-top: 1px dashed #999; margin: 3mm 0; }
        .receipt-total { font-size: 12pt; font-weight: 900; text-align: center; margin: 4mm 0; }
        .receipt-footer { text-align: center; font-size: 7pt; color: #888; margin-top: 6mm; }
        @page { size: auto; margin: 10mm; }
      </style>
      <div class="receipt-title">VOUCHER GENERATION<br/>RECEIPT</div>
      <div class="receipt-row"><span class="label">Receipt No</span><span class="val">${receiptData.transactionRef}</span></div>
      <div class="receipt-row"><span class="label">Date</span><span class="val">${receiptData.dateTime.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })}</span></div>
      <div class="receipt-row"><span class="label">Time</span><span class="val">${receiptData.dateTime.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}</span></div>
      <div class="receipt-row"><span class="label">Merchant ID</span><span class="val">0001</span></div>
      <div class="receipt-divider"></div>
      ${denomRows}
      <div class="receipt-divider"></div>
      <div class="receipt-row"><span class="label">Total Bundles</span><span class="val">${totalBundles}</span></div>
      <div class="receipt-row"><span class="label">Total Cards</span><span class="val">${formatNum(totalCards)}</span></div>
      <div class="receipt-row"><span class="label">Batch Number</span><span class="val">${receiptData.batchNumber}</span></div>
      <div class="receipt-divider"></div>
      <div class="receipt-row"><span class="label">Subtotal</span><span class="val">₦${formatNum(grandSubtotal)}</span></div>
      ${grandDiscount > 0 ? `<div class="receipt-row"><span class="label">Total Discount</span><span class="val" style="color:green">-₦${formatNum(grandDiscount)}</span></div>` : ""}
      <div class="receipt-total">TOTAL: ₦${formatNum(grandTotal)}</div>
      <div class="receipt-row"><span class="label">Balance After</span><span class="val">₦${formatNum(walletBalance - grandTotal)}</span></div>
      <div class="receipt-footer">Thank you for your business<br/>Mobi Voucher System</div>
    `;
    printDiv.style.display = "none";
    document.body.appendChild(printDiv);
    const cleanup = () => { document.body.removeChild(printDiv); window.removeEventListener("afterprint", cleanup); };
    window.addEventListener("afterprint", cleanup);
    printDiv.style.display = "block";
    setTimeout(() => window.print(), 100);
  }, [lineItems, totalBundles, totalCards, grandSubtotal, grandDiscount, grandTotal, receiptData, walletBalance]);

  // ─── Step 1: Select Denominations & Bundle Counts ───
  if (step === "select") {
    const renderDenomCard = (v: RechargeVoucher) => {
      const selected = isSelected(v.id);
      const sel = getSelection(v.id);
      const li = selected ? lineItems.find(l => l.denomination.id === v.id) : null;

      return (
        <div
          key={v.id}
          className={`rounded-xl border-2 transition-all touch-manipulation ${
            selected ? "border-primary bg-primary/5" : "border-border/50 bg-card"
          }`}
        >
          {/* Denomination row - tappable */}
          <div
            onClick={() => toggleDenom(v)}
            className="flex items-center justify-between p-3.5 cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                selected ? "bg-primary border-primary" : "border-muted-foreground/30"
              }`}>
                {selected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-black text-foreground">M{formatNum(v.mobiValue)}</p>
                  {v.isPopular && (
                    <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0 h-4 gap-0.5">
                      <Sparkles className="h-2.5 w-2.5" /> Hot
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">≈ ₦{formatNum(v.ngnPrice)}/card</p>
              </div>
            </div>
            {selected && sel && (
              <Badge variant="secondary" className="text-xs font-bold">
                {sel.bundleCount} bundle{sel.bundleCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {/* Bundle count controls - only when selected */}
          {selected && sel && (
            <div className="border-t border-border/30 px-3.5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); updateBundleCount(v.id, -1); }}
                  className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation"
                >
                  <Minus className="h-4 w-4 text-foreground" />
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={sel.bundleCount === 0 ? '' : sel.bundleCount}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    const raw = e.target.value;
                    if (raw === '') { setBundleCountDirect(v.id, 0); return; }
                    const val = parseInt(raw);
                    if (!isNaN(val) && val >= 0) setBundleCountDirect(v.id, val);
                  }}
                  onBlur={() => { if ((sel.bundleCount || 0) < 1) setBundleCountDirect(v.id, 1); }}
                  className="w-14 text-xl font-black text-foreground text-center bg-transparent border-b-2 border-primary/40 focus:border-primary outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  style={{ MozAppearance: 'textfield' } as React.CSSProperties}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); updateBundleCount(v.id, 1); }}
                  className="h-9 w-9 rounded-full bg-primary flex items-center justify-center active:scale-90 touch-manipulation"
                >
                  <Plus className="h-4 w-4 text-primary-foreground" />
                </button>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{formatNum(sel.bundleCount * 100)} cards</p>
                {li && li.discountPercent > 0 && (
                  <p className="text-[10px] text-emerald-600 font-semibold">{li.discountPercent}% off</p>
                )}
                {li && !li.meetsMinOrder && sel.bundleCount >= 5 && (
                  <p className="text-[10px] text-amber-600">Below min order</p>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleDenom(v); }}
                className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center active:scale-90 touch-manipulation ml-2"
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </button>
            </div>
          )}
        </div>
      );
    };

    const renderTier = (label: string, vouchers: RechargeVoucher[], desc: string) => (
      <div className="mb-5" key={label}>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</h3>
          <span className="text-xs text-muted-foreground">{desc}</span>
        </div>
        <div className="space-y-2.5">
          {vouchers.map(renderDenomCard)}
        </div>
      </div>
    );

    return (
      <div className="bg-background min-h-screen pb-44">
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground">Generate Vouchers</h1>
            <p className="text-xs text-muted-foreground">Select denominations & quantities</p>
          </div>
          {selections.length > 0 && (
            <Badge className="bg-primary/15 text-primary text-xs font-bold">
              {selections.length} selected
            </Badge>
          )}
        </div>

        <div className="px-4 pt-4">
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 mb-4">
            <p className="text-xs text-foreground leading-relaxed">
              Tap to select <strong>multiple denominations</strong>, then set bundle count for each. Each bundle contains <strong>100 voucher cards</strong>. Discounts apply per denomination when order value meets threshold.
            </p>
          </div>

          {renderTier("Standard", lowTier, "M100 – M10,000")}
          {renderTier("Premium", midTier, "M15,000 – M100,000")}
          {renderTier("Elite", highTier, "M125,000 – M1,000,000")}
        </div>

        {/* Sticky footer with live running total */}
        {selections.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 pt-3 pb-4 safe-area-bottom">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-foreground">Total Voucher Value</p>
              <p className="text-lg font-black text-primary">M{formatNum(grandSubtotal)}</p>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">{selections.length}</span> denom{selections.length !== 1 ? "s" : ""} · <span className="font-bold text-foreground">{totalBundles}</span> bundle{totalBundles !== 1 ? "s" : ""} · <span className="font-bold text-foreground">{formatNum(totalCards)}</span> cards
              </div>
              {grandDiscount > 0 && (
                <p className="text-xs text-emerald-600 font-semibold">-₦{formatNum(grandDiscount)} saved</p>
              )}
            </div>
            <Button
              onClick={() => { setStep("summary"); window.scrollTo(0, 0); }}
              className="w-full h-12 text-sm font-semibold rounded-xl touch-manipulation active:scale-[0.97]"
            >
              Review Order <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // ─── Step 2: Order Summary ───
  if (step === "summary") {
    return (
      <div className="bg-background min-h-screen pb-28">
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground">Order Summary</h1>
            <p className="text-xs text-muted-foreground">Review & generate</p>
          </div>
        </div>
        <div className="px-4 pt-4 space-y-4">
          {/* Per-denomination line items */}
          <div className="space-y-2.5">
            {lineItems.map(li => (
              <div key={li.denomination.id} className="rounded-xl border border-border/50 bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-black text-primary">M</span>
                    </div>
                    <div>
                      <p className="text-base font-black text-foreground">M{formatNum(li.denomination.mobiValue)}</p>
                      <p className="text-xs text-muted-foreground">{li.bundleCount} bundle{li.bundleCount !== 1 ? "s" : ""} · {formatNum(li.totalCards)} cards</p>
                    </div>
                  </div>
                  {li.discountPercent > 0 ? (
                    <Badge className="bg-emerald-500/15 text-emerald-600 text-xs">{li.discountPercent}% off</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">No discount</Badge>
                  )}
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">₦{formatNum(li.subtotal)}</span>
                  </div>
                  {li.discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({li.discountPercent}%)</span>
                      <span className="font-bold">-₦{formatNum(li.discountAmount)}</span>
                    </div>
                  )}
                  {!li.meetsMinOrder && li.bundleCount >= 5 && (
                    <p className="text-xs text-amber-600">
                      Value M{formatNum(li.subtotal)} — needs ≥ M{formatNum(MIN_DISCOUNT_ORDER_VALUE)} for discount
                    </p>
                  )}
                  <div className="flex justify-between font-bold">
                    <span className="text-foreground">Line Total</span>
                    <span className="text-foreground">₦{formatNum(li.total)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grand Totals */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2.5">
            <div className="grid grid-cols-3 gap-3 text-center mb-2">
              <div className="rounded-lg bg-background/80 p-2.5">
                <p className="text-lg font-bold text-foreground">{totalBundles}</p>
                <p className="text-xs text-muted-foreground">Bundles</p>
              </div>
              <div className="rounded-lg bg-background/80 p-2.5">
                <p className="text-lg font-bold text-foreground">{formatNum(totalCards)}</p>
                <p className="text-xs text-muted-foreground">Cards</p>
              </div>
              <div className="rounded-lg bg-background/80 p-2.5">
                <p className="text-lg font-bold text-foreground">{selections.length}</p>
                <p className="text-xs text-muted-foreground">Denoms</p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">₦{formatNum(grandSubtotal)}</span>
            </div>
            {grandDiscount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Total Discount</span>
                <span className="font-bold">-₦{formatNum(grandDiscount)}</span>
              </div>
            )}
            <div className="border-t border-border/50 pt-2 flex justify-between">
              <span className="font-bold text-foreground">Total to Pay</span>
              <span className="font-black text-xl text-foreground">₦{formatNum(grandTotal)}</span>
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
                  <p className="text-xs text-muted-foreground">You need ₦{formatNum(grandTotal - walletBalance)} more</p>
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
            Generate & Pay ₦{formatNum(grandTotal)}
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
        <p className="text-xs text-muted-foreground">Generating {formatNum(totalCards)} voucher cards across {selections.length} denomination{selections.length !== 1 ? "s" : ""}</p>
        <div className="flex gap-2 mt-6">
          {PROCESSING_MESSAGES.map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full transition-all duration-300 ${i <= processingMsg ? "bg-primary scale-110" : "bg-muted"}`} />
          ))}
        </div>
      </div>
    );
  }

  // ─── Complete with Receipt ───
  if (step === "complete") {
    return (
      <div className="bg-background min-h-screen pb-6">
        {/* Success Header */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div className="relative w-20 h-20 mb-4">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-0 rounded-full bg-emerald-500/5" />
            <div className="absolute inset-2 rounded-full bg-emerald-500 flex items-center justify-center animate-scale-in">
              <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: "draw 0.6s ease-out 0.3s forwards" }} />
              </svg>
            </div>
          </div>
          <h2 className="text-lg font-black text-foreground mb-0.5">Generation Complete!</h2>
          <p className="text-sm text-muted-foreground">{formatNum(totalCards)} voucher cards ready across {selections.length} denomination{selections.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Receipt Card */}
        <div className="mx-4">
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="bg-muted/40 px-4 py-3 border-b border-border/30 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Receipt className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Voucher Generation Receipt</p>
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
                <span className="text-muted-foreground">Merchant ID</span>
                <span className="font-semibold text-foreground">0001</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Batch Number</span>
                <span className="font-bold text-foreground text-right text-xs font-mono break-all">{receiptData.batchNumber}</span>
              </div>

              <div className="border-t border-dashed border-border/50 my-1" />

              {/* Per-denomination rows */}
              {lineItems.map(li => (
                <div key={li.denomination.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-semibold">M{formatNum(li.denomination.mobiValue)} × {li.bundleCount}</span>
                    <span className="font-semibold text-foreground">₦{formatNum(li.subtotal)}</span>
                  </div>
                  {li.discountPercent > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600 pl-2">
                      <span>Discount ({li.discountPercent}%)</span>
                      <span className="font-bold">-₦{formatNum(li.discountAmount)}</span>
                    </div>
                  )}
                </div>
              ))}

              <div className="border-t border-dashed border-border/50 my-1" />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Bundles</span>
                <span className="font-bold text-foreground">{totalBundles}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Cards</span>
                <span className="font-bold text-foreground">{formatNum(totalCards)}</span>
              </div>

              <div className="border-t border-dashed border-border/50 my-1" />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">₦{formatNum(grandSubtotal)}</span>
              </div>
              {grandDiscount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Total Discount</span>
                  <span className="font-bold">-₦{formatNum(grandDiscount)}</span>
                </div>
              )}
              <div className="border-t border-border/50 pt-2 flex justify-between">
                <span className="font-bold text-foreground">Total Paid</span>
                <span className="font-black text-lg text-foreground">₦{formatNum(grandTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Wallet Balance</span>
                <span className="font-semibold text-emerald-600">₦{formatNum(walletBalance - grandTotal)}</span>
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
