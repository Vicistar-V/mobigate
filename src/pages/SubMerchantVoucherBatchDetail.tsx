import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, X, ChevronDown, ChevronUp, ShieldAlert, AlertTriangle, Package, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { initialSubMerchantBatches } from "@/data/subMerchantVoucherData";
import { getBatchStatusCounts, getBundleStatusCounts, getInvalidatableCards, hashPin, formatNum } from "@/data/merchantVoucherData";
import { useToast } from "@/hooks/use-toast";

type InvalidateTarget = { type: "batch" } | { type: "bundle"; bundleId: string } | { type: "card"; cardId: string; bundleId: string };

export default function SubMerchantVoucherBatchDetail() {
  const navigate = useNavigate();
  const { batchId } = useParams();
  const { toast } = useToast();
  const [batches, setBatches] = useState(initialSubMerchantBatches);
  const [expandedBundles, setExpandedBundles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [invalidateTarget, setInvalidateTarget] = useState<InvalidateTarget | null>(null);

  const batch = batches.find(b => b.id === batchId);
  const counts = batch ? getBatchStatusCounts(batch) : { available: 0, sold_unused: 0, used: 0, invalidated: 0, total: 0 };
  const batchInvalidatable = batch ? getInvalidatableCards(batch.bundles.flatMap(b => b.cards)) : [];

  const toggleBundle = (id: string) => {
    setExpandedBundles(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const filteredBundles = useMemo(() => {
    if (!batch) return [];
    if (!searchQuery) return batch.bundles;
    const q = searchQuery.toLowerCase();
    return batch.bundles.filter(b => b.serialPrefix.toLowerCase().includes(q) || b.cards.some(c => c.serialNumber.toLowerCase().includes(q)));
  }, [batch?.bundles, searchQuery]);

  const handleInvalidate = () => {
    if (!invalidateTarget) return;
    setBatches(prev => prev.map(b => {
      if (b.id !== batchId) return b;
      return { ...b, bundles: b.bundles.map(bundle => ({
        ...bundle,
        cards: bundle.cards.map(card => {
          const can = card.status === "available" || (card.status === "sold_unused" && card.soldVia === "physical");
          if (invalidateTarget.type === "batch" && can) return { ...card, status: "invalidated" as const, invalidatedAt: new Date() };
          if (invalidateTarget.type === "bundle" && bundle.id === invalidateTarget.bundleId && can) return { ...card, status: "invalidated" as const, invalidatedAt: new Date() };
          if (invalidateTarget.type === "card" && card.id === invalidateTarget.cardId && can) return { ...card, status: "invalidated" as const, invalidatedAt: new Date() };
          return card;
        }),
      }))};
    }));
    setInvalidateTarget(null);
  };

  const getInvalidateCount = (): number => {
    if (!invalidateTarget) return 0;
    if (invalidateTarget.type === "batch") return batchInvalidatable.length;
    if (invalidateTarget.type === "bundle") {
      const bundle = batch!.bundles.find(b => b.id === invalidateTarget.bundleId);
      return bundle ? getInvalidatableCards(bundle.cards).length : 0;
    }
    return 1;
  };

  const statusColor = (s: string) => {
    switch (s) { case "available": return "bg-emerald-500/15 text-emerald-600"; case "sold_unused": return "bg-amber-500/15 text-amber-600"; case "used": return "bg-primary/15 text-primary"; case "invalidated": return "bg-destructive/15 text-destructive"; default: return "bg-muted text-muted-foreground"; }
  };
  const statusLabel = (s: string) => {
    switch (s) { case "available": return "Available"; case "sold_unused": return "Sold"; case "used": return "Used"; case "invalidated": return "Invalid"; default: return s; }
  };

  if (!batch) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-6">
        <div className="text-center"><p className="text-sm text-muted-foreground mb-4">Batch not found</p><Button onClick={() => navigate(-1)} variant="outline">Go Back</Button></div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-6">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">{batch.batchNumber}</h1>
              <Badge variant="outline" className="text-xs px-2 h-5 border-primary/30 text-primary">Sub-Merchant</Badge>
            </div>
            <p className="text-xs text-muted-foreground">M{formatNum(batch.denomination)} • {batch.createdAt.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
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

        {batchInvalidatable.length > 0 && (
          <Button onClick={() => setInvalidateTarget({ type: "batch" })} variant="outline" className="w-full h-11 rounded-xl text-xs font-semibold border-destructive/30 text-destructive hover:bg-destructive/5 touch-manipulation active:scale-[0.97]">
            <ShieldAlert className="h-4 w-4 mr-2" /> Invalidate ({batchInvalidatable.length})
          </Button>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search serial..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-9 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-muted-foreground" /></button>}
        </div>

        <div className="space-y-2.5">
          {filteredBundles.map(bundle => {
            const bCounts = getBundleStatusCounts(bundle);
            const isExpanded = expandedBundles.has(bundle.id);
            return (
              <div key={bundle.id} className="rounded-xl border border-border/50 bg-card overflow-hidden">
                <div onClick={() => toggleBundle(bundle.id)} className="p-3.5 flex items-center gap-3 touch-manipulation cursor-pointer active:bg-muted/30">
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
                {isExpanded && (
                  <div className="border-t border-border/30 max-h-[400px] overflow-y-auto touch-auto">
                    {bundle.cards.map(card => (
                      <div key={card.id} className="px-3.5 py-3 border-b border-border/20 last:border-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-mono font-semibold text-foreground truncate flex-1 mr-2">{card.serialNumber}</p>
                          <Badge className={`${statusColor(card.status)} text-xs h-5 px-2`}>{statusLabel(card.status)}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground font-mono">PIN: {hashPin(card.pin)}</p>
                          {(card.status === "available" || (card.status === "sold_unused" && card.soldVia === "physical")) && (
                            <button onClick={() => setInvalidateTarget({ type: "card", cardId: card.id, bundleId: bundle.id })} className="text-xs text-destructive font-semibold touch-manipulation h-7 px-1">Invalidate</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AlertDialog open={!!invalidateTarget} onOpenChange={(open) => !open && setInvalidateTarget(null)}>
        <AlertDialogContent className="max-w-[340px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-5 w-5 text-destructive" /> Confirm Invalidation</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This will invalidate <strong>{getInvalidateCount()}</strong> card{getInvalidateCount() !== 1 ? "s" : ""}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10 rounded-xl text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleInvalidate} className="h-10 rounded-xl text-sm bg-destructive hover:bg-destructive/90">Invalidate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
