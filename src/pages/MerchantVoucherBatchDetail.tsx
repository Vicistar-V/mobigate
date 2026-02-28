import { useState, useMemo } from "react";
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
  type SoldVia,
  getBundleStatusCounts,
  getInvalidatableCards,
  hashPin,
  formatNum,
  generateBatchNumber,
  generateBundlePrefix,
  generateCardSerial,
  generatePin,
  getBatchBundleCounts,
  classifyBundle,
} from "@/data/merchantVoucherData";
import { useToast } from "@/hooks/use-toast";
import { VoucherPrintDrawer } from "@/components/merchant/VoucherExportDrawer";

type InvalidateTarget = { type: "batch" } | { type: "bundle"; bundleId: string };
type BatchFilter = "available" | "sold" | "invalidated" | null;
type CardFilter = "used" | "unused" | null;

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
  const [batchStatusFilter, setBatchStatusFilter] = useState<BatchFilter>(null);
  const [bundleCardFilter, setBundleCardFilter] = useState<Record<string, CardFilter>>({});

  const batch = batches.find(b => b.id === batchId);
  const bundleCounts = batch ? getBatchBundleCounts(batch) : { available: 0, sold: 0, invalidated: 0, total: 0 };
  const batchInvalidatable = batch ? getInvalidatableCards(batch.bundles.flatMap(b => b.cards)) : [];
  const regenCount = batch ? batch.bundles.flatMap(b => b.cards).filter(c => c.status === "invalidated" && !c.regenerated).length : 0;
  const availableCardCount = batch ? batch.bundles.flatMap(b => b.cards).filter(c => c.status === "available").length : 0;

  const toggleBundle = (id: string) => {
    setExpandedBundles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filteredBundles = useMemo(() => {
    if (!batch) return [];
    let result = batch.bundles;
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(bundle =>
        bundle.serialPrefix.toLowerCase().includes(q) ||
        bundle.cards.some(c => c.serialNumber.toLowerCase().includes(q) || c.pin.slice(-4).includes(q))
      );
    }
    // Batch-level status filter (by bundle classification)
    if (batchStatusFilter) {
      result = result.filter(bundle => classifyBundle(bundle) === batchStatusFilter);
    }
    return result;
  }, [batch?.bundles, searchQuery, batchStatusFilter]);

  const handleInvalidate = () => {
    if (!invalidateTarget) return;
    setBatches(prev => prev.map(b => {
      if (b.id !== batchId) return b;
      const updated = { ...b, bundles: b.bundles.map(bundle => ({
        ...bundle,
        cards: bundle.cards.map(card => {
          const canInvalidate = (card.status === "available") || (card.status === "sold_unused" && card.soldVia === "physical");
          if (invalidateTarget.type === "batch" && canInvalidate) return { ...card, status: "invalidated" as const, invalidatedAt: new Date() };
          if (invalidateTarget.type === "bundle" && bundle.id === invalidateTarget.bundleId && canInvalidate) return { ...card, status: "invalidated" as const, invalidatedAt: new Date() };
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
    setBatches(prev => prev.map(b => {
      if (b.id !== batch.id) return b;

      // Collect all invalidated (unregenerated) cards across all bundles
      const invalidatedCards = b.bundles.flatMap(bundle =>
        bundle.cards.filter(c => c.status === "invalidated" && !c.regenerated)
      );

      // Mark those cards as regenerated (so they stay visible but won't be regenerated again)
      const updatedBundles = b.bundles.map(bundle => ({
        ...bundle,
        cards: bundle.cards.map(card =>
          card.status === "invalidated" && !card.regenerated ? { ...card, regenerated: true } : card
        ),
      }));

      // Create new replacement bundles, max 100 cards per bundle (waterfall)
      const CARDS_PER_BUNDLE = 100;
      const newBundles: typeof b.bundles = [];
      for (let i = 0; i < invalidatedCards.length; i += CARDS_PER_BUNDLE) {
        const chunk = invalidatedCards.slice(i, i + CARDS_PER_BUNDLE);
        const bundlePrefix = generateBundlePrefix(b.denomination, now) + `-R${newBundles.length + 1}`;
        const newBundle = {
          id: `bundle-regen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${newBundles.length}`,
          serialPrefix: bundlePrefix,
          denomination: b.denomination,
          batchId: b.id,
          cardCount: chunk.length,
          cards: chunk.map((card, idx) => ({
            id: `card-regen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${idx}`,
            serialNumber: generateCardSerial(bundlePrefix, idx + 1),
            pin: generatePin(),
            denomination: b.denomination,
            status: "available" as const,
            batchId: b.id,
            bundleSerialPrefix: bundlePrefix,
            soldVia: null as SoldVia,
            createdAt: now,
            invalidatedAt: null,
            soldAt: null,
            usedAt: null,
            regenerated: false,
          })),
        };
        newBundles.push(newBundle);
      }

      return {
        ...b,
        bundles: [...updatedBundles, ...newBundles],
        bundleCount: updatedBundles.length + newBundles.length,
        totalCards: updatedBundles.reduce((sum, bn) => sum + bn.cards.length, 0) + newBundles.reduce((sum, bn) => sum + bn.cards.length, 0),
        status: "active" as const,
      };
    }));
    setShowRegenConfirm(false);
    toast({ title: "Cards Regenerated", description: `${regenCount} replacement cards created in new bundles` });
  };

  const handlePrintComplete = (cardIds: string[]) => {
    setBatches(prev => prev.map(b => {
      if (b.id !== batchId) return b;
      return { ...b, bundles: b.bundles.map(bundle => ({ ...bundle, cards: bundle.cards.map(card =>
        cardIds.includes(card.id) ? { ...card, status: "sold_unused" as const, soldVia: "physical" as const, soldAt: new Date() } : card
      )}))};
    }));
    toast({ title: "Print Complete", description: `${cardIds.length} cards printed and marked as sold` });
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

  const toggleBundleCardFilter = (bundleId: string, filter: CardFilter) => {
    setBundleCardFilter(prev => ({
      ...prev,
      [bundleId]: prev[bundleId] === filter ? null : filter,
    }));
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
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
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
        {/* Status Cards — 3 cols, bundle-level, clickable filters */}
        <div className="grid grid-cols-3 gap-2">
          {([
            { label: "Available", key: "available" as const, count: bundleCounts.available, color: "text-emerald-600", ring: "ring-emerald-500" },
            { label: "Sold", key: "sold" as const, count: bundleCounts.sold, color: "text-amber-600", ring: "ring-amber-500" },
            { label: "Invalid", key: "invalidated" as const, count: bundleCounts.invalidated, color: "text-destructive", ring: "ring-destructive" },
          ]).map(s => (
            <button
              key={s.label}
              onClick={() => setBatchStatusFilter(prev => prev === s.key ? null : s.key)}
              className={`rounded-xl border bg-card p-2.5 text-center touch-manipulation active:scale-[0.96] transition-all ${
                batchStatusFilter === s.key ? `ring-2 ${s.ring} border-transparent` : "border-border/50"
              }`}
            >
              <p className={`text-xl font-black ${s.color}`}>{s.count}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-[10px] text-muted-foreground/70">bundles</p>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {availableCardCount > 0 && (
            <Button onClick={() => setPrintDrawerOpen(true)} variant="outline"
              className="flex-1 h-11 rounded-xl text-xs font-semibold border-primary/30 text-primary hover:bg-primary/5 touch-manipulation active:scale-[0.97]">
              <Printer className="h-4 w-4 mr-2" /> Print Cards ({availableCardCount})
            </Button>
          )}
          {batchInvalidatable.length > 0 && (
            <Button onClick={() => setInvalidateTarget({ type: "batch" })} variant="outline"
              className="flex-1 h-11 rounded-xl text-xs font-semibold border-destructive/30 text-destructive hover:bg-destructive/5 touch-manipulation active:scale-[0.97]">
              <ShieldAlert className="h-4 w-4 mr-2" /> Invalidate ({batchInvalidatable.length})
            </Button>
          )}
        </div>

        {regenCount > 0 && (
          <Button onClick={() => setShowRegenConfirm(true)} variant="outline"
            className="w-full h-11 rounded-xl text-xs font-semibold border-amber-500/30 text-amber-600 hover:bg-amber-500/5 touch-manipulation active:scale-[0.97]">
            <RefreshCw className="h-4 w-4 mr-2" /> Regenerate Invalidated Cards ({regenCount})
          </Button>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search serial or last 4 of PIN..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-9 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
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
            const currentCardFilter = bundleCardFilter[bundle.id] || null;

            // Card counts for expanded filter pills
            const unusedCount = bundle.cards.filter(c => c.status === "available" || c.status === "sold_unused").length;
            const usedCount = bundle.cards.filter(c => c.status === "used").length;

            // Filter cards based on current card filter
            const displayedCards = currentCardFilter === "unused"
              ? bundle.cards.filter(c => c.status === "available" || c.status === "sold_unused")
              : currentCardFilter === "used"
                ? bundle.cards.filter(c => c.status === "used")
                : bundle.cards;

            return (
              <div key={bundle.id} className="rounded-xl border border-border/50 bg-card overflow-hidden">
                {/* Bundle header — simple Available / Sold Out badge */}
                <div onClick={() => toggleBundle(bundle.id)} className="p-3.5 flex items-center gap-3 touch-manipulation cursor-pointer active:bg-muted/30">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{bundle.serialPrefix}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{bundle.cardCount} cards</p>
                  </div>
                  {(() => {
                    const allInvalidated = bundle.cards.every(c => c.status === "invalidated");
                    const hasAvailable = bundle.cards.some(c => c.status === "available");
                    if (allInvalidated) return <Badge className="bg-destructive/15 text-destructive text-xs h-5 px-2 shrink-0">Invalidated</Badge>;
                    if (hasAvailable) return <Badge className="bg-emerald-500/15 text-emerald-600 text-xs h-5 px-2 shrink-0">Available</Badge>;
                    return <Badge className="bg-amber-500/15 text-amber-600 text-xs h-5 px-2 shrink-0">Sold Out</Badge>;
                  })()}
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />}
                </div>

                {/* Expanded cards */}
                {isExpanded && (
                  <div className="border-t border-border/30">
                    {/* Bundle actions */}
                    <div className="px-3 py-2.5 border-b border-border/30 flex items-center gap-3">
                      {bundleAvailable > 0 && (
                        <button onClick={(e) => { e.stopPropagation(); setPrintDrawerOpen(true); }}
                          className="text-xs text-primary font-semibold touch-manipulation flex items-center gap-1.5 h-8">
                          <Printer className="h-3.5 w-3.5" /> Print Bundle ({bundleAvailable})
                        </button>
                      )}
                      {bundleInvalidatable.length > 0 && (
                        <button onClick={(e) => { e.stopPropagation(); setInvalidateTarget({ type: "bundle", bundleId: bundle.id }); }}
                          className="text-xs text-destructive font-semibold touch-manipulation flex items-center gap-1.5 h-8">
                          <ShieldAlert className="h-3.5 w-3.5" /> Invalidate ({bundleInvalidatable.length})
                        </button>
                      )}
                    </div>

                    {/* Used / Unused pill filter toggles */}
                    <div className="px-3 py-2 border-b border-border/30 flex gap-2">
                      <button
                        onClick={() => toggleBundleCardFilter(bundle.id, "unused")}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all touch-manipulation active:scale-95 ${
                          currentCardFilter === "unused"
                            ? "bg-emerald-500 text-white"
                            : "bg-emerald-500/10 text-emerald-600"
                        }`}
                      >
                        Unused {unusedCount}
                      </button>
                      <button
                        onClick={() => toggleBundleCardFilter(bundle.id, "used")}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all touch-manipulation active:scale-95 ${
                          currentCardFilter === "used"
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        Used {usedCount}
                      </button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto touch-auto">
                      {displayedCards.map(card => (
                        <div key={card.id} className="px-3.5 py-3 border-b border-border/20 last:border-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-mono font-semibold text-foreground truncate flex-1 mr-2">{card.serialNumber}</p>
                            <Badge className={`${statusColor(card.status)} text-xs h-5 px-2`}>{statusLabel(card.status)}</Badge>
                          </div>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-muted-foreground font-mono">PIN: {hashPin(card.pin)}</p>
                            <span className="text-xs font-bold text-foreground">M{formatNum(card.denomination)}</span>
                          </div>
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
                      {displayedCards.length === 0 && (
                        <div className="px-3.5 py-6 text-center text-xs text-muted-foreground">No cards match this filter</div>
                      )}
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
              <AlertTriangle className="h-5 w-5 text-destructive" /> Confirm Invalidation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This will invalidate <strong>{getInvalidateCount()}</strong> voucher card{getInvalidateCount() !== 1 ? "s" : ""}.
              Only "Available" and "Sold (Physical)" cards will be affected.
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
              <RefreshCw className="h-5 w-5 text-amber-600" /> Regenerate Cards
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This will regenerate <strong>{regenCount}</strong> invalidated card{regenCount !== 1 ? "s" : ""} in this batch with new serial numbers and PINs. Non-invalidated cards will remain unchanged.
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

      <VoucherPrintDrawer open={printDrawerOpen} onOpenChange={setPrintDrawerOpen} batch={batch} onPrintComplete={handlePrintComplete} />
    </div>
  );
}
