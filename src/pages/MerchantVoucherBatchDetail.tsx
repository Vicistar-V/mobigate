import { useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, X, ChevronDown, ChevronUp, ShieldAlert, AlertTriangle, Package, Printer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  initialMockBatches,
  VoucherBatch,
  getBatchStatusCounts,
  getBundleStatusCounts,
  getInvalidatableCards,
  hashPin,
  formatNum,
  generateBatchNumber,
  generateBundlePrefix,
  generateCardSerial,
  generatePin,
} from "@/data/merchantVoucherData";
import { useToast } from "@/hooks/use-toast";
import { VoucherPrintDrawer } from "@/components/merchant/VoucherExportDrawer";

type InvalidateTarget = { type: "batch" } | { type: "bundle"; bundleId: string };

export default function MerchantVoucherBatchDetail() {
  const navigate = useNavigate();
  const { batchId } = useParams();
  const { toast } = useToast();
  const [batches, setBatches] = useState(initialMockBatches);
  const [expandedBundles, setExpandedBundles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [invalidateTarget, setInvalidateTarget] = useState<InvalidateTarget | null>(null);
  const [printDrawerOpen, setPrintDrawerOpen] = useState(false);
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);

  const batch = batches.find(b => b.id === batchId);

  const counts = batch ? getBatchStatusCounts(batch) : { available: 0, sold_unused: 0, used: 0, invalidated: 0, total: 0 };
  const batchInvalidatable = batch ? getInvalidatableCards(batch.bundles.flatMap(b => b.cards)) : [];

  // Count invalidated cards that are NOT used (for regeneration)
  const regenCount = batch ? batch.bundles.flatMap(b => b.cards).filter(c => c.status === "invalidated").length : 0;

  const toggleBundle = (id: string) => {
    setExpandedBundles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filteredBundles = useMemo(() => {
    if (!batch) return [];
    if (!searchQuery) return batch.bundles;
    const q = searchQuery.toLowerCase();
    return batch.bundles.filter(bundle =>
      bundle.serialPrefix.toLowerCase().includes(q) ||
      bundle.cards.some(c =>
        c.serialNumber.toLowerCase().includes(q) ||
        c.pin.slice(-4).includes(q)
      )
    );
  }, [batch?.bundles, searchQuery]);

  const handleInvalidate = () => {
    if (!invalidateTarget) return;
    setBatches(prev => prev.map(b => {
      if (b.id !== batchId) return b;
      const updated = { ...b, bundles: b.bundles.map(bundle => ({
        ...bundle,
        cards: bundle.cards.map(card => {
          const canInvalidate =
            (card.status === "available") ||
            (card.status === "sold_unused" && card.soldVia === "physical");

          if (invalidateTarget.type === "batch" && canInvalidate) {
            return { ...card, status: "invalidated" as const, invalidatedAt: new Date() };
          }
          if (invalidateTarget.type === "bundle" && bundle.id === invalidateTarget.bundleId && canInvalidate) {
            return { ...card, status: "invalidated" as const, invalidatedAt: new Date() };
          }
          return card;
        }),
      }))};
      return updated;
    }));
    setInvalidateTarget(null);
  };

  const handleRegenerate = () => {
    if (!batch || regenCount === 0) return;
    const now = new Date();
    const newBatchId = `batch-regen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newBatchNumber = generateBatchNumber(now);
    const bundleSize = 100;
    const numBundles = Math.ceil(regenCount / bundleSize);
    const bundles: VoucherBatch["bundles"] = [];
    let remaining = regenCount;

    for (let b = 0; b < numBundles; b++) {
      const cardsInBundle = Math.min(bundleSize, remaining);
      remaining -= cardsInBundle;
      const prefix = generateBundlePrefix(batch.denomination, now);
      const cards: VoucherBatch["bundles"][0]["cards"] = [];
      for (let c = 0; c < cardsInBundle; c++) {
        cards.push({
          id: `card-${newBatchId}-${b}-${c}`,
          serialNumber: generateCardSerial(prefix, c),
          pin: generatePin(),
          denomination: batch.denomination,
          status: "available" as const,
          batchId: newBatchId,
          bundleSerialPrefix: prefix,
          soldVia: null,
          createdAt: now,
          invalidatedAt: null,
          soldAt: null,
          usedAt: null,
        });
      }
      bundles.push({
        id: `bundle-${newBatchId}-${b}`,
        serialPrefix: prefix,
        denomination: batch.denomination,
        batchId: newBatchId,
        cardCount: cardsInBundle,
        cards,
      });
    }

    const newBatch: VoucherBatch = {
      id: newBatchId,
      batchNumber: newBatchNumber,
      denomination: batch.denomination,
      bundleCount: numBundles,
      totalCards: regenCount,
      status: "active",
      createdAt: now,
      totalCost: 0,
      discountApplied: false,
      discountPercent: 0,
      generationType: "replacement",
      replacedBatchId: batch.id,
      bundles,
    };

    setBatches(prev => [...prev, newBatch]);
    setShowRegenConfirm(false);
    toast({
      title: "Replacement Batch Created",
      description: `${newBatchNumber} — ${regenCount} cards regenerated`,
    });
  };

  const handlePrintComplete = (cardIds: string[]) => {
    setBatches(prev => prev.map(b => {
      if (b.id !== batchId) return b;
      return {
        ...b,
        bundles: b.bundles.map(bundle => ({
          ...bundle,
          cards: bundle.cards.map(card =>
            cardIds.includes(card.id)
              ? { ...card, status: "sold_unused" as const, soldVia: "physical" as const, soldAt: new Date() }
              : card
          ),
        })),
      };
    }));
    toast({
      title: "Print Complete",
      description: `${cardIds.length} cards printed and marked as sold`,
    });
  };

  const getInvalidateCount = (): number => {
    if (!invalidateTarget) return 0;
    if (invalidateTarget.type === "batch") return batchInvalidatable.length;
    if (invalidateTarget.type === "bundle") {
      const bundle = batch!.bundles.find(b => b.id === invalidateTarget.bundleId);
      return bundle ? getInvalidatableCards(bundle.cards).length : 0;
    }
    return 0;
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-emerald-500/15 text-emerald-600";
      case "sold_unused": return "bg-amber-500/15 text-amber-600";
      case "used": return "bg-primary/15 text-primary";
      case "invalidated": return "bg-destructive/15 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "available": return "Available";
      case "sold_unused": return "Sold";
      case "used": return "Used";
      case "invalidated": return "Invalid";
      default: return status;
    }
  };

  if (!batch) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Batch not found</p>
          <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-6">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">{batch.batchNumber}</h1>
              {batch.generationType === "replacement" && (
                <Badge variant="outline" className="text-xs px-2 h-5 border-amber-500 text-amber-600">Replacement</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              M{formatNum(batch.denomination)} • {batch.createdAt.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Status Cards */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Available", count: counts.available, color: "text-emerald-600" },
            { label: "Sold", count: counts.sold_unused, color: "text-amber-600" },
            { label: "Used", count: counts.used, color: "text-primary" },
            { label: "Invalid", count: counts.invalidated, color: "text-destructive" },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border/50 bg-card p-2.5 text-center">
              <p className={`text-xl font-black ${s.color}`}>{s.count}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {counts.available > 0 && (
            <Button
              onClick={() => setPrintDrawerOpen(true)}
              variant="outline"
              className="flex-1 h-11 rounded-xl text-xs font-semibold border-primary/30 text-primary hover:bg-primary/5 touch-manipulation active:scale-[0.97]"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Cards ({counts.available})
            </Button>
          )}
          {batchInvalidatable.length > 0 && (
            <Button
              onClick={() => setInvalidateTarget({ type: "batch" })}
              variant="outline"
              className="flex-1 h-11 rounded-xl text-xs font-semibold border-destructive/30 text-destructive hover:bg-destructive/5 touch-manipulation active:scale-[0.97]"
            >
              <ShieldAlert className="h-4 w-4 mr-2" />
              Invalidate ({batchInvalidatable.length})
            </Button>
          )}
        </div>

        {/* Regeneration Button */}
        {regenCount > 0 && (
          <Button
            onClick={() => setShowRegenConfirm(true)}
            variant="outline"
            className="w-full h-11 rounded-xl text-xs font-semibold border-amber-500/30 text-amber-600 hover:bg-amber-500/5 touch-manipulation active:scale-[0.97]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate Invalidated Cards ({regenCount})
          </Button>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search serial or last 4 of PIN..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-9 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Bundle List */}
        <div className="space-y-2.5">
          {filteredBundles.map(bundle => {
            const bCounts = getBundleStatusCounts(bundle);
            const isExpanded = expandedBundles.has(bundle.id);
            const bundleInvalidatable = getInvalidatableCards(bundle.cards);
            const bundleAvailable = bundle.cards.filter(c => c.status === "available").length;

            return (
              <div key={bundle.id} className="rounded-xl border border-border/50 bg-card overflow-hidden">
                {/* Bundle header */}
                <div
                  onClick={() => toggleBundle(bundle.id)}
                  className="p-3.5 flex items-center gap-3 touch-manipulation cursor-pointer active:bg-muted/30"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{bundle.serialPrefix}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {bCounts.available > 0 && <span className="text-xs text-emerald-600 font-semibold">{bCounts.available} avail</span>}
                      {bCounts.sold_unused > 0 && <span className="text-xs text-amber-600 font-semibold">{bCounts.sold_unused} sold</span>}
                      {bCounts.used > 0 && <span className="text-xs text-primary font-semibold">{bCounts.used} used</span>}
                      {bCounts.invalidated > 0 && <span className="text-xs text-destructive font-semibold">{bCounts.invalidated} inv</span>}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />}
                </div>

                {/* Expanded cards */}
                {isExpanded && (
                  <div className="border-t border-border/30">
                    {/* Bundle actions */}
                    <div className="px-3 py-2.5 border-b border-border/30 flex items-center gap-3">
                      {bundleAvailable > 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setPrintDrawerOpen(true); }}
                          className="text-xs text-primary font-semibold touch-manipulation flex items-center gap-1.5 h-8"
                        >
                          <Printer className="h-3.5 w-3.5" /> Print Bundle ({bundleAvailable})
                        </button>
                      )}
                      {bundleInvalidatable.length > 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setInvalidateTarget({ type: "bundle", bundleId: bundle.id }); }}
                          className="text-xs text-destructive font-semibold touch-manipulation flex items-center gap-1.5 h-8"
                        >
                          <ShieldAlert className="h-3.5 w-3.5" /> Invalidate ({bundleInvalidatable.length})
                        </button>
                      )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto touch-auto">
                      {bundle.cards.map(card => (
                        <div key={card.id} className="px-3.5 py-3 border-b border-border/20 last:border-0">
                          {/* Row 1: Serial + Status */}
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-mono font-semibold text-foreground truncate flex-1 mr-2">{card.serialNumber}</p>
                            <Badge className={`${statusColor(card.status)} text-xs h-5 px-2`}>{statusLabel(card.status)}</Badge>
                          </div>
                          {/* Row 2: PIN + Denomination */}
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-muted-foreground font-mono">PIN: {hashPin(card.pin)}</p>
                            <span className="text-xs font-bold text-foreground">M{formatNum(card.denomination)}</span>
                          </div>
                          {/* Row 3: Metadata */}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{card.createdAt.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "2-digit" })}</span>
                            <span className="font-mono">{card.bundleSerialPrefix}</span>
                            {card.soldVia && (
                              <span className={card.soldVia === "physical" ? "text-amber-600" : "text-primary"}>
                                {card.soldVia === "physical" ? "Physical" : "Digital"}
                              </span>
                            )}
                            {card.soldAt && <span>Sold {card.soldAt.toLocaleDateString("en-NG", { day: "2-digit", month: "short" })}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Invalidation Confirmation Dialog */}
      <AlertDialog open={!!invalidateTarget} onOpenChange={(open) => !open && setInvalidateTarget(null)}>
        <AlertDialogContent className="max-w-[340px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Invalidation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This will invalidate <strong>{getInvalidateCount()}</strong> voucher card{getInvalidateCount() !== 1 ? "s" : ""}.
              Only "Available" and "Sold (Physical)" cards will be affected. Used cards and Mobigate digital purchases are protected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10 rounded-xl text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleInvalidate} className="h-10 rounded-xl text-sm bg-destructive hover:bg-destructive/90">
              Invalidate {getInvalidateCount()} Cards
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Regeneration Confirmation Dialog */}
      <AlertDialog open={showRegenConfirm} onOpenChange={setShowRegenConfirm}>
        <AlertDialogContent className="max-w-[340px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-base">
              <RefreshCw className="h-5 w-5 text-amber-600" />
              Regenerate Cards
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This will create a new replacement batch with <strong>{regenCount}</strong> card{regenCount !== 1 ? "s" : ""} to replace the invalidated ones.
              Cards will be grouped into bundles of 100.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10 rounded-xl text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRegenerate} className="h-10 rounded-xl text-sm bg-amber-600 hover:bg-amber-700 text-white">
              Regenerate {regenCount} Cards
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Print Drawer */}
      <VoucherPrintDrawer
        open={printDrawerOpen}
        onOpenChange={setPrintDrawerOpen}
        batch={batch}
        onPrintComplete={handlePrintComplete}
      />
    </div>
  );
}
