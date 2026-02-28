import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Package, History, Wallet, ChevronRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  initialMockBatches,
  initialMerchantWalletBalance,
  getBatchStatusCounts,
  formatNum,
} from "@/data/merchantVoucherData";

export default function MerchantVoucherManagement() {
  const navigate = useNavigate();
  const [walletBalance] = useState(initialMerchantWalletBalance);
  const batches = initialMockBatches;

  const stats = useMemo(() => {
    let totalBatches = batches.length;
    let totalBundles = batches.reduce((s, b) => s + b.bundleCount, 0);
    let totalCards = batches.reduce((s, b) => s + b.totalCards, 0);
    let available = 0, soldUnused = 0, used = 0, invalidated = 0;
    batches.forEach(b => {
      const c = getBatchStatusCounts(b);
      available += c.available;
      soldUnused += c.sold_unused;
      used += c.used;
      invalidated += c.invalidated;
    });
    return { totalBatches, totalBundles, totalCards, available, soldUnused, used, invalidated };
  }, [batches]);

  return (
    <div className="bg-background min-h-screen pb-8">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-foreground">Voucher Management</h1>
          <p className="text-xs text-muted-foreground">Generate & manage voucher inventory</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Wallet Card */}
        <div className="rounded-2xl bg-gradient-to-br from-[hsl(217,91%,32%)] to-[hsl(217,91%,22%)] p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-4 w-4 text-white/70" />
              <p className="text-xs text-white/70 font-medium">Merchant Wallet (₦)</p>
            </div>
            <p className="text-2xl font-black mb-3">₦{formatNum(walletBalance)}</p>
            <Button
              onClick={() => navigate("/merchant-wallet-fund")}
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs font-semibold h-9 rounded-xl touch-manipulation active:scale-95"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Fund Wallet
            </Button>
          </div>
        </div>

        {/* Primary CTA */}
        <Button
          onClick={() => navigate("/merchant-voucher-generate")}
          className="w-full h-14 rounded-2xl text-sm font-bold bg-primary hover:bg-primary/90 touch-manipulation active:scale-[0.97] gap-2"
        >
          <Plus className="h-5 w-5" />
          Generate New Vouchers
        </Button>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => navigate("/merchant-voucher-batches")}
            className="rounded-xl border border-border/50 bg-card p-4 active:scale-[0.96] transition-transform touch-manipulation cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm font-bold text-foreground">All Batches</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stats.totalBatches} batches</p>
          </div>
          <div
            onClick={() => navigate("/merchant-voucher-transactions")}
            className="rounded-xl border border-border/50 bg-card p-4 active:scale-[0.96] transition-transform touch-manipulation cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-accent/30 flex items-center justify-center mb-2">
              <History className="h-5 w-5 text-foreground" />
            </div>
            <p className="text-sm font-bold text-foreground">Transactions</p>
            <p className="text-xs text-muted-foreground mt-0.5">View history</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">Inventory Overview</p>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y divide-border/30">
            {[
              { label: "Total Cards", value: formatNum(stats.totalCards), color: "text-foreground" },
              { label: "Total Bundles", value: formatNum(stats.totalBundles), color: "text-foreground" },
              { label: "Available", value: formatNum(stats.available), color: "text-emerald-600" },
              { label: "Sold (Unused)", value: formatNum(stats.soldUnused), color: "text-amber-600" },
              { label: "Used", value: formatNum(stats.used), color: "text-primary" },
              { label: "Invalidated", value: formatNum(stats.invalidated), color: "text-destructive" },
            ].map(item => (
              <div key={item.label} className="p-3.5 text-center">
                <p className={`text-lg font-black ${item.color}`}>{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Batches */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recent Batches</p>
            <button onClick={() => navigate("/merchant-voucher-batches")} className="text-xs font-semibold text-primary touch-manipulation">
              View All
            </button>
          </div>
          <div className="space-y-2">
            {batches.slice(0, 3).map(batch => {
              const counts = getBatchStatusCounts(batch);
              return (
                <div
                  key={batch.id}
                  onClick={() => navigate(`/merchant-voucher-batch/${batch.id}`)}
                  className="rounded-xl border border-border/50 bg-card p-4 active:scale-[0.97] transition-transform touch-manipulation cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">{batch.batchNumber}</p>
                        {batch.generationType === "replacement" && (
                          <Badge variant="outline" className="text-xs px-2 h-5 border-amber-500 text-amber-600">Replacement</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        M{formatNum(batch.denomination)} • {batch.bundleCount} bundle{batch.bundleCount !== 1 ? "s" : ""} • {formatNum(batch.totalCards)} cards
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {counts.available > 0 && <Badge className="bg-emerald-500/15 text-emerald-600 text-xs px-2 h-5">{counts.available} avail</Badge>}
                    {counts.sold_unused > 0 && <Badge className="bg-amber-500/15 text-amber-600 text-xs px-2 h-5">{counts.sold_unused} sold</Badge>}
                    {counts.used > 0 && <Badge className="bg-primary/15 text-primary text-xs px-2 h-5">{counts.used} used</Badge>}
                    {counts.invalidated > 0 && <Badge className="bg-destructive/15 text-destructive text-xs px-2 h-5">{counts.invalidated} invalid</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{batch.createdAt.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
