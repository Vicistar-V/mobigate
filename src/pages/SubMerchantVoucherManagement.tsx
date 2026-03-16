import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Package, History, Wallet, ChevronRight, TrendingUp, Store, FileText, ShoppingBag, Eye, ArrowDownRight, Settings, Wifi, WifiOff, X, UserCheck, Bell, RotateCcw, CheckCircle2, Clock, XCircle, MapPin, CalendarDays, Receipt, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  initialSubMerchantBatches, initialSubMerchantWalletBalance,
  mockParentMerchants, mockMerchantApplications,
  initialOfflineWalletBalance, initialOfflineWalletTransactions,
  initialOfflineTotalCardsSold, initialOfflineTotalTransactions,
  type OfflineWalletTransaction,
  type MerchantApplicationRequest,
} from "@/data/subMerchantVoucherData";
import { getBatchStatusCounts, formatNum, type VoucherBatch } from "@/data/merchantVoucherData";
import { SubMerchantDiscountSettings } from "@/components/merchant/SubMerchantDiscountSettings";
import { CreditUsersManuallyDrawer } from "@/components/merchant/CreditUsersManuallyDrawer";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

/** Get sold breakdown: online vs offline for a batch */
function getSoldBreakdown(batch: VoucherBatch) {
  const allCards = batch.bundles.flatMap(b => b.cards);
  const soldCards = allCards.filter(c => c.status === "sold_unused");
  const soldOffline = soldCards.filter(c => c.soldVia === "physical" || c.soldVia === "offline").length;
  const soldOnline = soldCards.filter(c => c.soldVia === "mobigate_digital").length;
  return { total: soldCards.length, soldOnline, soldOffline };
}

export default function SubMerchantVoucherManagement() {
  const navigate = useNavigate();
  const [walletBalance] = useState(initialSubMerchantWalletBalance);
  const [offlineBalance] = useState(initialOfflineWalletBalance);
  const [offlineTransactions] = useState(initialOfflineWalletTransactions);
  const [showOfflineDrawer, setShowOfflineDrawer] = useState(false);
  const [showCreditDrawer, setShowCreditDrawer] = useState(false);
  const [selectedApp, setSelectedApp] = useState<MerchantApplicationRequest | null>(null);
  // Settings state
  const [autoTagOffline, setAutoTagOffline] = useState(true);
  const [offlineNotifications, setOfflineNotifications] = useState(true);
  const [showOfflineInInventory, setShowOfflineInInventory] = useState(true);
  const batches = initialSubMerchantBatches;

  const stats = useMemo(() => {
    let totalBatches = batches.length;
    let totalBundles = batches.reduce((s, b) => s + b.bundleCount, 0);
    let totalCards = batches.reduce((s, b) => s + b.totalCards, 0);
    let available = 0, soldUnused = 0, used = 0, invalidated = 0;
    let soldOffline = 0;
    batches.forEach(b => {
      const c = getBatchStatusCounts(b);
      available += c.available;
      soldUnused += c.sold_unused;
      used += c.used;
      invalidated += c.invalidated;
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
      <div className="sticky top-[var(--header-height)] z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-foreground">Retail Merchant Vouchers</h1>
          <p className="text-xs text-muted-foreground">Buy & manage your voucher inventory</p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <Tabs defaultValue="dashboard">
          <div className="overflow-x-auto touch-pan-x -mx-4 px-4 mb-4">
            <TabsList className="w-max min-w-full h-11 whitespace-nowrap">
              <TabsTrigger value="dashboard" className="flex-1 text-xs h-9">Dashboard</TabsTrigger>
              <TabsTrigger value="merchants" className="flex-1 text-xs h-9">
                <Store className="h-3.5 w-3.5 mr-1" /> My Merchants
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex-1 text-xs h-9">
                <FileText className="h-3.5 w-3.5 mr-1" /> Applications
                {pendingApps.length > 0 && (
                  <Badge className="ml-1 bg-amber-500 text-white text-xs h-5 w-5 p-0 flex items-center justify-center">{pendingApps.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 text-xs h-9">
                <Settings className="h-3.5 w-3.5 mr-1" /> Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            {/* Main Wallet Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[hsl(217,91%,32%)] to-[hsl(217,91%,22%)] p-4 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="h-4 w-4 text-white/70" />
                  <p className="text-xs text-white/70 font-medium">Retail Merchant Wallet (₦)</p>
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
                      <div key={txn.id} className="rounded-xl border border-border/50 bg-card p-3.5">
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

            {/* Credit Users Manually CTA */}
            <Button
              onClick={() => setShowCreditDrawer(true)}
              variant="outline"
              className="w-full h-12 rounded-2xl text-sm font-bold border-2 border-primary/30 text-primary hover:bg-primary/5 touch-manipulation active:scale-[0.97] gap-2"
            >
              <UserCheck className="h-5 w-5" />
              Credit Users Manually
            </Button>
            <CreditUsersManuallyDrawer open={showCreditDrawer} onOpenChange={setShowCreditDrawer} />

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
                  const soldBreakdown = getSoldBreakdown(batch);
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
                          {counts.sold_unused > 0 && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Badge
                                  className="bg-amber-500/15 text-amber-600 text-xs px-2 h-5 cursor-pointer active:scale-95 transition-transform touch-manipulation"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {counts.sold_unused} Sold
                                </Badge>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-52 p-0 rounded-xl overflow-hidden"
                                side="top"
                                align="start"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="px-3 py-2.5 border-b border-border/30 bg-muted/30">
                                  <p className="text-xs font-bold text-foreground">Sold Breakdown</p>
                                  <p className="text-[10px] text-muted-foreground">{counts.sold_unused} total sold cards</p>
                                </div>
                                <div className="p-2.5 space-y-2">
                                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-primary/5">
                                    <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                                      <Wifi className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-xs font-semibold text-foreground">{soldBreakdown.soldOnline} Sold Online</p>
                                      <p className="text-[10px] text-muted-foreground">Via Mobigate Digital</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-amber-500/5">
                                    <div className="h-7 w-7 rounded-md bg-amber-500/10 flex items-center justify-center">
                                      <WifiOff className="h-3.5 w-3.5 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-xs font-semibold text-foreground">{soldBreakdown.soldOffline} Sold Offline</p>
                                      <p className="text-[10px] text-muted-foreground">Physical / In-shop</p>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
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
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="rounded-xl border border-border/50 bg-card p-4 cursor-pointer active:scale-[0.97] transition-transform touch-manipulation"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">{app.merchantName}</p>
                      <p className="text-xs text-muted-foreground">{app.merchantCity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs h-5 px-2 ${
                        app.status === "accepted" ? "bg-emerald-500/15 text-emerald-600" :
                        app.status === "pending" ? "bg-amber-500/15 text-amber-600" :
                        "bg-destructive/15 text-destructive"
                      } capitalize`}>
                        {app.status === "accepted" ? "Accepted" : app.status === "pending" ? "Pending" : "Rejected"}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
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

            {/* Application Detail Drawer */}
            <Drawer open={!!selectedApp} onOpenChange={(v) => { if (!v) setSelectedApp(null); }}>
              <DrawerContent className="max-h-[92vh]">
                {selectedApp && (() => {
                  const statusIcon = selectedApp.status === "accepted" ? CheckCircle2 : selectedApp.status === "pending" ? Clock : XCircle;
                  const StatusIcon = statusIcon;
                  const statusColor = selectedApp.status === "accepted" ? "text-emerald-600" : selectedApp.status === "pending" ? "text-amber-600" : "text-destructive";
                  const statusBg = selectedApp.status === "accepted" ? "bg-emerald-500/15" : selectedApp.status === "pending" ? "bg-amber-500/15" : "bg-destructive/15";

                  return (
                    <>
                      <DrawerHeader className="text-left pb-2">
                        <DrawerTitle className="text-base">{selectedApp.merchantName}</DrawerTitle>
                        <p className="text-xs text-muted-foreground">{selectedApp.merchantCity}</p>
                      </DrawerHeader>

                      <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4 pb-6 space-y-4">
                        {/* Status Badge */}
                        <div className="flex flex-col items-center text-center py-4">
                          <div className={`h-16 w-16 rounded-full ${statusBg} flex items-center justify-center mb-3`}>
                            <StatusIcon className={`h-8 w-8 ${statusColor}`} />
                          </div>
                          <Badge variant="outline" className={`${statusBg} ${statusColor} border-0 text-sm px-4 py-1 capitalize`}>
                            {selectedApp.status === "accepted" ? "Accepted" : selectedApp.status === "pending" ? "Pending Review" : "Rejected"}
                          </Badge>
                        </div>

                        {/* Details Card */}
                        <Card className="rounded-xl">
                          <CardContent className="p-4 space-y-2.5">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Submitted</span>
                              <span className="font-medium">{selectedApp.dateSubmitted.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Location</span>
                              <span className="font-medium">{selectedApp.merchantCity}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground flex items-center gap-1.5"><Receipt className="h-3.5 w-3.5" /> Application Fee</span>
                              <span className="font-medium">₦{formatNum(selectedApp.applicationFee)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Reference</span>
                              <span className="font-medium font-mono text-xs">SM-{selectedApp.id.toUpperCase()}</span>
                            </div>

                            {/* Status-specific details */}
                            {selectedApp.status === "pending" && (
                              <div className="pt-2 border-t">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Est. Review Time</span>
                                  <span className="font-medium text-amber-600">7-14 business days</span>
                                </div>
                              </div>
                            )}

                            {selectedApp.status === "accepted" && selectedApp.approvedDate && (
                              <div className="pt-2 border-t space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Approved Date</span>
                                  <span className="font-medium text-emerald-600">{selectedApp.approvedDate.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                                </div>
                                {selectedApp.discountRate && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Discount Rate</span>
                                    <span className="font-bold text-emerald-600">{selectedApp.discountRate}%</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {selectedApp.status === "rejected" && selectedApp.rejectionReason && (
                              <div className="pt-2 border-t">
                                <p className="text-xs text-muted-foreground mb-1 font-semibold">Rejection Reason</p>
                                <p className="text-sm text-foreground leading-relaxed">{selectedApp.rejectionReason}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="space-y-2.5 pt-1">
                          {selectedApp.status === "pending" && (
                            <>
                              <Button
                                className="w-full h-12 rounded-xl text-sm font-semibold gap-2 touch-manipulation active:scale-[0.97]"
                                variant="outline"
                                onClick={() => {
                                  toast({ title: "📨 Reminder Sent", description: `A reminder has been sent to ${selectedApp.merchantName} to review your application.` });
                                }}
                              >
                                <Bell className="h-4 w-4" />
                                Send Reminder to {selectedApp.merchantName}
                              </Button>
                              <div className="rounded-xl bg-muted/50 border border-border/30 p-3">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  <span className="font-semibold text-foreground">ℹ️ Note:</span> Your application is being reviewed by <span className="font-semibold">{selectedApp.merchantName}</span>. You'll be notified once they take action. You can send a reminder if it's been more than 7 days.
                                </p>
                              </div>
                            </>
                          )}

                          {selectedApp.status === "accepted" && (
                            <>
                              <Button
                                className="w-full h-12 rounded-xl text-sm font-semibold gap-2 touch-manipulation active:scale-[0.97]"
                                onClick={() => {
                                  setSelectedApp(null);
                                  navigate(`/merchant-home/${selectedApp.merchantId || "pm-001"}`);
                                }}
                              >
                                <ExternalLink className="h-4 w-4" />
                                Visit Merchant Store
                              </Button>
                              <Button
                                className="w-full h-12 rounded-xl text-sm font-semibold gap-2 touch-manipulation active:scale-[0.97]"
                                variant="outline"
                                onClick={() => {
                                  setSelectedApp(null);
                                  navigate("/sub-merchant-buy-vouchers");
                                }}
                              >
                                <Store className="h-4 w-4" />
                                Buy Vouchers from this Merchant
                              </Button>
                              <div className="rounded-xl bg-emerald-500/5 border border-emerald-200/30 p-3">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  <span className="font-semibold text-emerald-700">✅ Active Partnership:</span> You're approved as a retail merchant under <span className="font-semibold">{selectedApp.merchantName}</span>. You can purchase vouchers at a discounted rate{selectedApp.discountRate ? ` of ${selectedApp.discountRate}%` : ""}.
                                </p>
                              </div>
                            </>
                          )}

                          {selectedApp.status === "rejected" && (
                            <>
                              <Button
                                className="w-full h-12 rounded-xl text-sm font-semibold gap-2 touch-manipulation active:scale-[0.97]"
                                onClick={() => {
                                  setSelectedApp(null);
                                  navigate(`/apply-sub-merchant/${selectedApp.merchantId || "pm-004"}?name=${encodeURIComponent(selectedApp.merchantName)}&category=Retail`, {
                                    state: {
                                      previousData: {
                                        merchantName: selectedApp.merchantName,
                                        merchantCity: selectedApp.merchantCity,
                                      },
                                    },
                                  });
                                }}
                              >
                                <RotateCcw className="h-4 w-4" />
                                Re-apply to {selectedApp.merchantName}
                              </Button>
                              <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-3">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  <span className="font-semibold text-destructive">❌ Application Declined:</span> Review the rejection reason above and address the issues before re-applying. Your previous application fee is non-refundable.
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </DrawerContent>
            </Drawer>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            {/* Discount Settings */}
            <SubMerchantDiscountSettings />

            {/* Offline Sales Settings */}
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-amber-600" />
                <p className="text-sm font-bold text-foreground">Offline Sales Settings</p>
              </div>
              <div className="divide-y divide-border/30">
                <div className="px-4 py-3.5 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Auto-tag Offline Sales</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Automatically tag physical sales as "Sold Offline"</p>
                  </div>
                  <Switch
                    checked={autoTagOffline}
                    onCheckedChange={(v) => {
                      setAutoTagOffline(v);
                      toast({ title: v ? "Auto-tagging enabled" : "Auto-tagging disabled", description: "Offline sales will " + (v ? "be" : "not be") + " auto-tagged" });
                    }}
                  />
                </div>
                <div className="px-4 py-3.5 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Offline Sale Notifications</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Get notified when offline sales are recorded</p>
                  </div>
                  <Switch
                    checked={offlineNotifications}
                    onCheckedChange={(v) => {
                      setOfflineNotifications(v);
                      toast({ title: v ? "Notifications enabled" : "Notifications disabled" });
                    }}
                  />
                </div>
                <div className="px-4 py-3.5 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Show Offline in Inventory</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Display "Sold Offline" count in inventory overview</p>
                  </div>
                  <Switch
                    checked={showOfflineInInventory}
                    onCheckedChange={(v) => {
                      setShowOfflineInInventory(v);
                      toast({ title: v ? "Visible in inventory" : "Hidden from inventory" });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Wallet Preferences */}
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <p className="text-sm font-bold text-foreground">Wallet Preferences</p>
              </div>
              <div className="divide-y divide-border/30">
                <div className="px-4 py-3.5">
                  <p className="text-sm font-medium text-foreground">Default Currency Display</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Nigerian Naira (₦) with Mobi (M) equivalent</p>
                  <Badge variant="outline" className="mt-2 text-xs">₦ NGN / M Mobi</Badge>
                </div>
                <div className="px-4 py-3.5">
                  <p className="text-sm font-medium text-foreground">Settlement Wallet</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Main wallet for reconciliation & settlements</p>
                  <p className="text-sm font-bold text-foreground mt-1">₦{formatNum(walletBalance)}</p>
                </div>
                <div className="px-4 py-3.5">
                  <p className="text-sm font-medium text-foreground">Offline Wallet</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Physical sales — excluded from settlements</p>
                  <p className="text-sm font-bold text-amber-600 mt-1">₦{formatNum(offlineBalance)}</p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="rounded-xl bg-muted/50 border border-border/30 p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">ℹ️ Settings Info:</span> Changes to offline sales settings take effect immediately. Discount rate settings are managed separately and may require merchant approval.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
