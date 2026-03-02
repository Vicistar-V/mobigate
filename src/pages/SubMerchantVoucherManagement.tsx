import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Package, History, Wallet, ChevronRight, TrendingUp, Store, FileText, ShoppingBag, Eye, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  initialSubMerchantBatches, initialSubMerchantWalletBalance,
  mockParentMerchants, mockMerchantApplications,
  initialOfflineWalletBalance, initialOfflineWalletTransactions,
  initialOfflineTotalCardsSold, initialOfflineTotalTransactions,
  type OfflineWalletTransaction,
} from "@/data/subMerchantVoucherData";
import { getBatchStatusCounts, formatNum } from "@/data/merchantVoucherData";
import { SubMerchantDiscountSettings } from "@/components/merchant/SubMerchantDiscountSettings";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SubMerchantVoucherManagement() {
  const navigate = useNavigate();
  const [walletBalance] = useState(initialSubMerchantWalletBalance);
  const [offlineBalance] = useState(initialOfflineWalletBalance);
  const [offlineTransactions] = useState(initialOfflineWalletTransactions);
  const [showOfflineDrawer, setShowOfflineDrawer] = useState(false);
  const batches = initialSubMerchantBatches;

  const stats = useMemo(() => {
    let totalBatches = batches.length;
    let totalBundles = batches.reduce((s, b) => s + b.bundleCount, 0);
    let totalCards = batches.reduce((s, b) => s + b.totalCards, 0);
    let available = 0, soldUnused = 0, used = 0, invalidated = 0;
    // Count offline-sold cards
    let soldOffline = 0;
    batches.forEach(b => {
      const c = getBatchStatusCounts(b);
      available += c.available;
      soldUnused += c.sold_unused;
      used += c.used;
      invalidated += c.invalidated;
      // Count cards sold via offline channel
      b.bundles.forEach(bundle => {
        bundle.cards.forEach(card => {
          if (card.soldVia === "offline" || (card.soldVia === "physical" && card.status === "sold_unused")) {
            // physical sold_unused in sub-merchant context are offline sales
          }
        });
      });
    });
    soldOffline = initialOfflineTotalCardsSold;
    return { totalBatches, totalBundles, totalCards, available, soldUnused, used, invalidated, soldOffline };
  }, [batches]);

  const pendingApps = mockMerchantApplications.filter(a => a.status === "pending");

  const sortedOfflineTxns = useMemo(() =>
    [...offlineTransactions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    [offlineTransactions]
  );

  return (
    <div className="bg-background min-h-screen pb-8">
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-foreground">Sub-Merchant Vouchers</h1>
          <p className="text-xs text-muted-foreground">Buy & manage your voucher inventory</p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <Tabs defaultValue="dashboard">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="dashboard" className="flex-1 text-xs">Dashboard</TabsTrigger>
            <TabsTrigger value="merchants" className="flex-1 text-xs">
              <Store className="h-3.5 w-3.5 mr-1" /> My Merchants
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex-1 text-xs">
              <FileText className="h-3.5 w-3.5 mr-1" /> Applications
              {pendingApps.length > 0 && (
                <Badge className="ml-1 bg-amber-500 text-white text-xs h-5 w-5 p-0 flex items-center justify-center">{pendingApps.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            {/* Main Wallet Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[hsl(217,91%,32%)] to-[hsl(217,91%,22%)] p-4 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="h-4 w-4 text-white/70" />
                  <p className="text-xs text-white/70 font-medium">Sub-Merchant Wallet (₦)</p>
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

            {/* Offline Wallet Card */}
            <Drawer open={showOfflineDrawer} onOpenChange={setShowOfflineDrawer}>
              <DrawerTrigger asChild>
                <div className="rounded-2xl bg-gradient-to-br from-[hsl(30,80%,35%)] to-[hsl(25,75%,25%)] p-4 text-white relative overflow-hidden cursor-pointer active:scale-[0.97] transition-transform touch-manipulation">
                  <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-white/70" />
                        <p className="text-xs text-white/70 font-medium">Offline Wallet</p>
                      </div>
                      <Badge className="bg-white/15 text-white/90 text-[10px] px-2 h-5 border-0">
                        Sold Offline
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-3 mb-0.5">
                      <p className="text-2xl font-black">₦{formatNum(offlineBalance)}</p>
                    </div>
                    <p className="text-xs text-white/60 mb-3">M{formatNum(offlineBalance)} Mobi equivalent</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm font-bold">{initialOfflineTotalCardsSold}</p>
                          <p className="text-[10px] text-white/60">Cards Sold</p>
                        </div>
                        <div className="w-px h-6 bg-white/20" />
                        <div className="text-center">
                          <p className="text-sm font-bold">{initialOfflineTotalTransactions}</p>
                          <p className="text-[10px] text-white/60">Transactions</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs font-semibold h-8 rounded-xl touch-manipulation active:scale-95"
                        onClick={(e) => { e.stopPropagation(); setShowOfflineDrawer(true); }}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </DrawerTrigger>

              <DrawerContent className="max-h-[85vh]">
                <DrawerHeader className="pb-2">
                  <DrawerTitle className="flex items-center gap-2 text-base">
                    <ShoppingBag className="h-5 w-5 text-amber-600" />
                    Offline Wallet
                  </DrawerTitle>
                  <p className="text-xs text-muted-foreground">
                    Sales collected physically — not subject to settlements & reconciliation
                  </p>
                </DrawerHeader>
                <ScrollArea className="px-4 pb-6" style={{ maxHeight: "65vh" }}>
                  {/* Balance Summary */}
                  <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-800/30 p-4 mb-4">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Total Offline Revenue</p>
                    <p className="text-2xl font-black text-foreground">₦{formatNum(offlineBalance)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">M{formatNum(offlineBalance)} Mobi equivalent</p>
                    <div className="flex gap-4 mt-3 pt-3 border-t border-amber-200/50 dark:border-amber-800/30">
                      <div>
                        <p className="text-sm font-bold text-foreground">{initialOfflineTotalCardsSold}</p>
                        <p className="text-[10px] text-muted-foreground">Total Cards Sold</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{initialOfflineTotalTransactions}</p>
                        <p className="text-[10px] text-muted-foreground">Transactions</p>
                      </div>
                    </div>
                  </div>

                  {/* Transaction History */}
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Offline Sales History
                  </p>
                  <div className="space-y-2">
                    {sortedOfflineTxns.map(txn => (
                      <div
                        key={txn.id}
                        className="rounded-xl border border-border/50 bg-card p-3.5"
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                              <ArrowDownRight className="h-4 w-4 text-amber-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-foreground truncate">{txn.description}</p>
                              <p className="text-[10px] text-muted-foreground">{txn.reference}</p>
                            </div>
                          </div>
                          <Badge className="bg-amber-500/15 text-amber-600 text-[10px] px-1.5 h-5 shrink-0 ml-2">
                            Sold Offline
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <p className="text-sm font-bold text-emerald-600">+₦{formatNum(txn.amount)}</p>
                            <p className="text-[10px] text-muted-foreground">M{formatNum(txn.mobiEquivalent)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-muted-foreground">
                              M{formatNum(txn.denomination)} × {txn.cardsSold} cards
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {txn.createdAt.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Info Note */}
                  <div className="rounded-xl bg-muted/50 border border-border/30 p-3 mt-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">ℹ️ About Offline Wallet:</span> This wallet tracks vouchers sold directly at physical shops where you collected payment in person. These transactions are <span className="font-semibold">not</span> subject to financial settlements or reconciliation with the main wallet.
                    </p>
                  </div>
                </ScrollArea>
              </DrawerContent>
            </Drawer>

            {/* Primary CTA */}
            <Button
              onClick={() => navigate("/sub-merchant-buy-vouchers")}
              className="w-full h-14 rounded-2xl text-sm font-bold bg-primary hover:bg-primary/90 touch-manipulation active:scale-[0.97] gap-2"
            >
              <Store className="h-5 w-5" />
              Buy Vouchers from Merchant
            </Button>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => navigate("/sub-merchant-voucher-batches")}
                className="rounded-xl border border-border/50 bg-card p-4 active:scale-[0.96] transition-transform touch-manipulation cursor-pointer"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-bold text-foreground">All Batches</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stats.totalBatches} batches</p>
              </div>
              <div
                onClick={() => navigate("/sub-merchant-voucher-transactions")}
                className="rounded-xl border border-border/50 bg-card p-4 active:scale-[0.96] transition-transform touch-manipulation cursor-pointer"
              >
                <div className="h-10 w-10 rounded-xl bg-accent/30 flex items-center justify-center mb-2">
                  <History className="h-5 w-5 text-foreground" />
                </div>
                <p className="text-sm font-bold text-foreground">Transactions</p>
                <p className="text-xs text-muted-foreground mt-0.5">View history</p>
              </div>
            </div>

            {/* Discount Settings */}
            <SubMerchantDiscountSettings />

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
                  { label: "Sold Offline", value: formatNum(stats.soldOffline), color: "text-amber-600" },
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
                <button onClick={() => navigate("/sub-merchant-voucher-batches")} className="text-xs font-semibold text-primary touch-manipulation">
                  View All
                </button>
              </div>
              <div className="space-y-2">
                {batches.slice(0, 3).map(batch => {
                  const counts = getBatchStatusCounts(batch);
                  return (
                    <div
                      key={batch.id}
                      onClick={() => navigate(`/sub-merchant-voucher-batch/${batch.id}`)}
                      className="rounded-xl border border-border/50 bg-card p-4 active:scale-[0.97] transition-transform touch-manipulation cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-bold text-foreground">{batch.batchNumber}</p>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        M{formatNum(batch.denomination)} • {batch.bundleCount} bundle{batch.bundleCount !== 1 ? "s" : ""} • {formatNum(batch.totalCards)} cards
                      </p>
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex gap-1.5 flex-wrap">
                          {counts.available > 0 && <Badge className="bg-emerald-500/15 text-emerald-600 text-xs px-2 h-5">{counts.available} Available</Badge>}
                          {counts.sold_unused > 0 && <Badge className="bg-amber-500/15 text-amber-600 text-xs px-2 h-5">{counts.sold_unused} Sold</Badge>}
                          {counts.used > 0 && <Badge className="bg-primary/15 text-primary text-xs px-2 h-5">{counts.used} Used</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground shrink-0 ml-2">{batch.createdAt.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* My Merchants Tab */}
          <TabsContent value="merchants">
            <div className="space-y-2.5">
              {mockParentMerchants.map(pm => (
                <div
                  key={pm.id}
                  onClick={() => navigate(`/merchant-home/${pm.id}`)}
                  className="rounded-xl border border-border/50 bg-card p-4 cursor-pointer active:scale-[0.97] transition-transform touch-manipulation"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">{pm.name}</p>
                      <p className="text-xs text-muted-foreground">{pm.city}, {pm.state}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs h-5 px-2 capitalize ${pm.status === "active" ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                        {pm.status}
                      </Badge>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="font-semibold text-emerald-600">{pm.discountRate}% Discount</span>
                    <span>Joined {pm.joinedDate.toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</span>
                  </div>
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    {pm.availableStock.map(s => (
                      <Badge key={s.denomination} variant="outline" className="text-xs">
                        M{formatNum(s.denomination)}: {s.availableBundles} bundles
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <div className="space-y-2.5">
              {mockMerchantApplications.map(app => (
                <div key={app.id} className="rounded-xl border border-border/50 bg-card p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-sm font-bold text-foreground">{app.merchantName}</p>
                      <p className="text-xs text-muted-foreground">{app.merchantCity}</p>
                    </div>
                    <Badge className={`text-xs h-5 px-2 ${
                      app.status === "accepted" ? "bg-emerald-500/15 text-emerald-600" :
                      app.status === "pending" ? "bg-amber-500/15 text-amber-600" :
                      "bg-destructive/15 text-destructive"
                    } capitalize`}>
                      {app.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>{app.dateSubmitted.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span>Fee: ₦{formatNum(app.applicationFee)}</span>
                  </div>
                </div>
              ))}
              {mockMerchantApplications.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">No applications yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
