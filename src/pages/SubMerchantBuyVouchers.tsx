import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Check, Store, ChevronRight, CreditCard, CheckCircle2, Package, Printer, Receipt, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockParentMerchants, ParentMerchant, MerchantStock, initialSubMerchantWalletBalance } from "@/data/subMerchantVoucherData";
import { formatNum, generateBatchNumber } from "@/data/merchantVoucherData";
import { MIN_DISCOUNT_ORDER_VALUE } from "@/data/platformSettingsData";

type Step = "select" | "merchant" | "summary" | "processing" | "success";

interface SelectedDenom {
  denomination: number;
  bundleCount: number;
}

const PROCESSING_MESSAGES = ["Connecting to merchant...", "Processing order...", "Verifying stock...", "Completing purchase..."];

export default function SubMerchantBuyVouchers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("select");
  const [selections, setSelections] = useState<SelectedDenom[]>([]);
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

  const isSelected = (d: number) => selections.some(s => s.denomination === d);
  const getSelection = (d: number) => selections.find(s => s.denomination === d);

  const toggleDenom = (d: number) => {
    if (isSelected(d)) {
      setSelections(prev => prev.filter(s => s.denomination !== d));
    } else {
      setSelections(prev => [...prev, { denomination: d, bundleCount: 1 }]);
    }
  };

  const updateBundleCount = (d: number, delta: number) => {
    setSelections(prev => prev.map(s =>
      s.denomination === d ? { ...s, bundleCount: Math.max(1, s.bundleCount + delta) } : s
    ));
  };

  const setBundleCountDirect = (d: number, val: number) => {
    setSelections(prev => prev.map(s =>
      s.denomination === d ? { ...s, bundleCount: val } : s
    ));
  };

  const totalBundles = selections.reduce((sum, s) => sum + s.bundleCount, 0);
  const totalCards = totalBundles * 100;
  const totalRetailValue = selections.reduce((sum, sel) => sum + sel.denomination * sel.bundleCount * 100, 0);
  const meetsMinOrderValue = totalRetailValue >= MIN_DISCOUNT_ORDER_VALUE;

  // Merchants that have ALL selected denominations in stock with enough bundles
  const merchantsWithStock = useMemo(() => {
    if (selections.length === 0) return [];
    return mockParentMerchants.filter(pm => {
      if (pm.status !== "active") return false;
      return selections.every(sel => {
        const stock = pm.availableStock.find(s => s.denomination === sel.denomination);
        return stock && stock.availableBundles >= sel.bundleCount;
      });
    });
  }, [selections]);

  // Calculate total cost for a given merchant (applies discount only if meetsMinOrderValue)
  const calcTotalForMerchant = useCallback((merchant: ParentMerchant) => {
    if (!meetsMinOrderValue) return totalRetailValue;
    return selections.reduce((sum, sel) => {
      const stock = merchant.availableStock.find(s => s.denomination === sel.denomination);
      return sum + (stock ? stock.pricePerBundle * sel.bundleCount : 0);
    }, 0);
  }, [selections, meetsMinOrderValue, totalRetailValue]);

  const totalCost = selectedMerchant ? calcTotalForMerchant(selectedMerchant) : 0;
  const totalDiscount = totalRetailValue - totalCost;
  const discountRate = meetsMinOrderValue ? (selectedMerchant?.discountRate || 0) : 0;

  const handleBack = () => {
    if (step === "merchant") setStep("select");
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
    const denomRows = selections.map(sel => {
      const stock = selectedMerchant?.availableStock.find(s => s.denomination === sel.denomination);
      return `
        <div class="receipt-row"><span class="label">M${formatNum(sel.denomination)} × ${sel.bundleCount} bundle${sel.bundleCount !== 1 ? "s" : ""}</span><span class="val">₦${formatNum((stock?.pricePerBundle || 0) * sel.bundleCount)}</span></div>
      `;
    }).join("");

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
      <div class="receipt-divider"></div>
      ${denomRows}
      <div class="receipt-divider"></div>
      <div class="receipt-row"><span class="label">Total Bundles</span><span class="val">${totalBundles}</span></div>
      <div class="receipt-row"><span class="label">Total Cards</span><span class="val">${formatNum(totalCards)}</span></div>
      <div class="receipt-row"><span class="label">Batch Number</span><span class="val">${receiptData.batchNumber}</span></div>
      <div class="receipt-divider"></div>
      <div class="receipt-row"><span class="label">Total Voucher Retail Value</span><span class="val">₦${formatNum(totalRetailValue)}</span></div>
      ${meetsMinOrderValue && discountRate > 0 ? `<div class="receipt-row"><span class="label">Merchant's Discount (${discountRate.toFixed(1)}%)</span><span class="val" style="color:green">-₦${formatNum(totalDiscount)}</span></div>` : ''}
      <div class="receipt-total">AMOUNT PAID: ₦${formatNum(totalCost)}</div>
      <div class="receipt-row"><span class="label">Balance After</span><span class="val">₦${formatNum(initialSubMerchantWalletBalance - totalCost)}</span></div>
      <div class="receipt-footer">Thank you for your business<br/>Mobi Voucher System</div>
    `;
    printDiv.style.display = "none";
    document.body.appendChild(printDiv);
    const cleanup = () => { document.body.removeChild(printDiv); window.removeEventListener("afterprint", cleanup); };
    window.addEventListener("afterprint", cleanup);
    printDiv.style.display = "block";
    setTimeout(() => window.print(), 100);
  }, [selections, selectedMerchant, totalBundles, totalCards, totalCost, receiptData]);

  // Step 1: Select denominations + bundle counts
  if (step === "select") {
    return (
      <div className="bg-background min-h-screen pb-44">
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground">Buy from Merchant</h1>
            <p className="text-xs text-muted-foreground">Select denominations & quantities</p>
          </div>
          {selections.length > 0 && (
            <Badge className="bg-primary/15 text-primary text-xs font-bold">
              {selections.length} selected
            </Badge>
          )}
        </div>

        <div className="px-4 pt-4">
          <p className="text-sm text-foreground mb-3">
            Tap to select denominations, then set bundle count for each:
          </p>

          <div className="space-y-2.5">
            {availableDenoms.map(d => {
              const selected = isSelected(d);
              const sel = getSelection(d);
              return (
                <div
                  key={d}
                  className={`rounded-xl border-2 transition-all touch-manipulation ${
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-border/50 bg-card"
                  }`}
                >
                  {/* Denomination row - tappable */}
                  <div
                    onClick={() => toggleDenom(d)}
                    className="flex items-center justify-between p-3.5 cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selected ? "bg-primary border-primary" : "border-muted-foreground/30"
                      }`}>
                        {selected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                      </div>
                      <div>
                        <p className="text-base font-black text-foreground">M{formatNum(d)}</p>
                        <p className="text-xs text-muted-foreground">≈ ₦{formatNum(d)}</p>
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
                          onClick={(e) => { e.stopPropagation(); updateBundleCount(d, -1); }}
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
                            if (raw === '') { setBundleCountDirect(d, 0); return; }
                            const val = parseInt(raw);
                            if (!isNaN(val) && val >= 0) setBundleCountDirect(d, val);
                          }}
                          onBlur={() => { if ((sel.bundleCount || 0) < 1) setBundleCountDirect(d, 1); }}
                          className="w-14 text-xl font-black text-foreground text-center bg-transparent border-b-2 border-primary/40 focus:border-primary outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          style={{ MozAppearance: 'textfield' } as React.CSSProperties}
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); updateBundleCount(d, 1); }}
                          className="h-9 w-9 rounded-full bg-primary flex items-center justify-center active:scale-90 touch-manipulation"
                        >
                          <Plus className="h-4 w-4 text-primary-foreground" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{formatNum(sel.bundleCount * 100)} cards</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleDenom(d); }}
                        className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center active:scale-90 touch-manipulation ml-2"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary footer with live running total */}
        {selections.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 pt-3 pb-4 safe-area-bottom">
            {/* Running total - prominent */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-foreground">Total Voucher Value</p>
              <p className="text-lg font-black text-primary">M{formatNum(totalRetailValue)}</p>
            </div>
            {/* Breakdown stats */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">{selections.length}</span> denom{selections.length !== 1 ? "s" : ""} · <span className="font-bold text-foreground">{totalBundles}</span> bundle{totalBundles !== 1 ? "s" : ""} · <span className="font-bold text-foreground">{formatNum(totalCards)}</span> cards
              </div>
              <p className="text-xs text-muted-foreground">≈ ₦{formatNum(totalRetailValue)}</p>
            </div>
            {!meetsMinOrderValue && (
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 mb-2.5">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  Min M{formatNum(MIN_DISCOUNT_ORDER_VALUE)} for discount eligibility
                </p>
              </div>
            )}
            <Button
              onClick={() => { setStep("merchant"); window.scrollTo(0, 0); }}
              className="w-full h-12 text-sm font-semibold rounded-xl touch-manipulation active:scale-[0.97]"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Choose Merchant <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Step 2: Select merchant
  if (step === "merchant") {
    return (
      <div className="bg-background min-h-screen pb-6">
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={handleBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground">Select Merchant</h1>
            <p className="text-xs text-muted-foreground">
              {selections.length} denomination{selections.length !== 1 ? "s" : ""} · {totalBundles} bundle{totalBundles !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Order summary badges */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex flex-wrap gap-1.5">
            {selections.map(sel => (
              <Badge key={sel.denomination} variant="secondary" className="text-xs font-bold">
                M{formatNum(sel.denomination)} × {sel.bundleCount}
              </Badge>
            ))}
          </div>
        </div>

        <div className="px-4 space-y-2.5">
          {merchantsWithStock.length === 0 && (
            <div className="text-center py-12">
              <Store className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No merchants can fulfill this entire order</p>
              <p className="text-xs text-muted-foreground mt-1">Try reducing bundle counts or removing a denomination</p>
            </div>
          )}
          {merchantsWithStock.length > 0 && !meetsMinOrderValue && (
            <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 dark:bg-amber-950/20 p-3 mb-2">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                No bulk discount yet: total order must be ≥ M{formatNum(MIN_DISCOUNT_ORDER_VALUE)} (current M{formatNum(totalRetailValue)}).
              </p>
            </div>
          )}
          {merchantsWithStock.map(pm => {
            const merchantTotal = calcTotalForMerchant(pm);
            return (
              <div
                key={pm.id}
                onClick={() => { setSelectedMerchant(pm); setStep("summary"); window.scrollTo(0, 0); }}
                className="rounded-xl border border-border/50 bg-card p-4 transition-transform touch-manipulation cursor-pointer active:scale-[0.97]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-foreground">{pm.name}</p>
                    <p className="text-xs text-muted-foreground">{pm.city}, {pm.state}</p>
                  </div>
                  {meetsMinOrderValue ? (
                    <Badge className="bg-emerald-500/15 text-emerald-600 text-xs font-bold">{pm.discountRate}% OFF</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs font-medium">No Discount</Badge>
                  )}
                </div>
                {/* Per-denom stock info */}
                <div className="space-y-1 mb-2">
                  {selections.map(sel => {
                    const stock = pm.availableStock.find(s => s.denomination === sel.denomination);
                    const linePrice = meetsMinOrderValue
                      ? (stock?.pricePerBundle || 0) * sel.bundleCount
                      : sel.denomination * sel.bundleCount * 100;
                    return (
                      <div key={sel.denomination} className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>M{formatNum(sel.denomination)}: {stock?.availableBundles || 0} avail</span>
                        <span>₦{formatNum(linePrice)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-border/30 pt-2 flex justify-between">
                  <span className="text-xs font-bold text-foreground">Total</span>
                  <span className="text-sm font-black text-foreground">₦{formatNum(merchantTotal)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Step 3: Order summary
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
          {/* Merchant info */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{selectedMerchant?.name}</p>
              <p className="text-xs text-muted-foreground">
                {meetsMinOrderValue ? `${selectedMerchant?.discountRate}% Discount Rate` : "No Discount (below M50,000 minimum)"}
              </p>
            </div>
          </div>

          {/* Line items */}
          <div className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Order Items</p>
            {selections.map(sel => {
              const stock = selectedMerchant?.availableStock.find(s => s.denomination === sel.denomination);
              const lineRetail = sel.denomination * sel.bundleCount * 100;
              const lineDiscounted = (stock?.pricePerBundle || 0) * sel.bundleCount;
              const lineTotal = meetsMinOrderValue ? lineDiscounted : lineRetail;
              return (
                <div key={sel.denomination} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-foreground">M{formatNum(sel.denomination)}</p>
                    <p className="text-xs text-muted-foreground">
                      {sel.bundleCount} bundle{sel.bundleCount !== 1 ? "s" : ""} · {formatNum(sel.bundleCount * 100)} cards
                    </p>
                  </div>
                  <p className="text-sm font-bold text-foreground">₦{formatNum(lineTotal)}</p>
                </div>
              );
            })}

            <div className="border-t border-border/50 pt-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Bundles</span>
                <span className="font-bold text-foreground">{totalBundles}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Cards</span>
                <span className="font-bold text-foreground">{formatNum(totalCards)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Voucher Retail Value</span>
                <span className="font-bold text-foreground">₦{formatNum(totalRetailValue)}</span>
              </div>
              {meetsMinOrderValue && discountRate > 0 ? (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Merchant's Discount ({discountRate.toFixed(1)}%)</span>
                  <span className="font-bold text-emerald-600">-₦{formatNum(totalDiscount)}</span>
                </div>
              ) : (
                <div className="rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/40 p-2">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    No discount — minimum order value of M{formatNum(MIN_DISCOUNT_ORDER_VALUE)} not met.
                  </p>
                </div>
              )}
              <div className="border-t border-border/50 pt-2 flex justify-between">
                <span className="font-bold text-foreground">Amount to Pay</span>
                <span className="font-bold text-lg text-foreground">₦{formatNum(totalCost)}</span>
              </div>
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

  // Step 4: Processing
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

  // Step 5: Success with Receipt
  return (
    <div className="bg-background min-h-screen pb-6">
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

            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Items</p>
            {selections.map(sel => {
              const stock = selectedMerchant?.availableStock.find(s => s.denomination === sel.denomination);
              const lineTotal = (stock?.pricePerBundle || 0) * sel.bundleCount;
              return (
                <div key={sel.denomination} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    M{formatNum(sel.denomination)} × {sel.bundleCount} bundle{sel.bundleCount !== 1 ? "s" : ""}
                  </span>
                  <span className="font-bold text-foreground">₦{formatNum(lineTotal)}</span>
                </div>
              );
            })}

            <div className="border-t border-dashed border-border/50 my-1" />

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Bundles</span>
              <span className="font-bold text-foreground">{totalBundles}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Cards</span>
              <span className="font-bold text-foreground">{formatNum(totalCards)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Voucher Retail Value</span>
              <span className="font-bold text-foreground">₦{formatNum(totalRetailValue)}</span>
            </div>
            {meetsMinOrderValue && discountRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Merchant's Discount ({discountRate.toFixed(1)}%)</span>
                <span className="font-bold text-emerald-600">-₦{formatNum(totalDiscount)}</span>
              </div>
            )}

            <div className="border-t border-border/50 pt-2 flex justify-between">
              <span className="font-bold text-foreground">Amount Paid</span>
              <span className="font-black text-lg text-foreground">₦{formatNum(totalCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Wallet Balance</span>
              <span className="font-semibold text-emerald-600">₦{formatNum(initialSubMerchantWalletBalance - totalCost)}</span>
            </div>
          </div>
        </div>
      </div>

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
