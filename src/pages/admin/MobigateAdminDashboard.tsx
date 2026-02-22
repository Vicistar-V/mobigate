import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Vote,
  Building2,
  Users,
  Wallet,
  Settings,
  TrendingUp,
  Activity,
  Globe,
  AlertCircle,
  ChevronRight,
  Coins,
  Shield,
  Trophy,
  Megaphone,
  CheckCircle,
  XCircle,
  Clock,
  Store,
} from "lucide-react";
import { Header } from "@/components/Header";
import { NominationFeeSettingsSection } from "@/components/mobigate/NominationFeeSettingsSection";
import { CampaignFeeDistributionSettings } from "@/components/admin/settings/CampaignFeeDistributionSettings";
import { WithdrawalSettingsCard } from "@/components/mobigate/WithdrawalSettingsCard";
import { QuizSettingsCard } from "@/components/mobigate/QuizSettingsCard";
// MobigateQuizManagement moved to /mobigate-admin/quiz
import { formatMobi, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { MerchantApplicationsAdmin } from "@/components/mobigate/MerchantApplicationsAdmin";
import { MobiExplainerTooltip, MobiCurrencyInfoBanner } from "@/components/common/MobiExplainerTooltip";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

// Mock waiver requests from merchants
const mockWaiverRequests = [
  {
    id: "w1",
    merchantName: "Zenith Foods Nigeria",
    merchantLogo: "🍜",
    seasonName: "Season 3 - Grand Prize",
    totalPrizes: 5000000,
    walletBalance: 2800000,
    requiredBalance: 3500000,
    waiverContext: "Sponsorship funds from MTN arriving next week. Already signed MOU.",
    submittedDate: "2026-02-20",
    waiverFee: 50000,
  },
  {
    id: "w2",
    merchantName: "AutoParts Express",
    merchantLogo: "🔧",
    seasonName: "Season 1 - Launch",
    totalPrizes: 2000000,
    walletBalance: 900000,
    requiredBalance: 1400000,
    waiverContext: "",
    submittedDate: "2026-02-19",
    waiverFee: 50000,
  },
  {
    id: "w3",
    merchantName: "FashionHub Lagos",
    merchantLogo: "👗",
    seasonName: "Season 2 - Valentine Special",
    totalPrizes: 3500000,
    walletBalance: 2100000,
    requiredBalance: 2450000,
    waiverContext: "Running a special Valentine promo. Balance will be topped up by Feb 25th from sales revenue.",
    submittedDate: "2026-02-18",
    waiverFee: 50000,
  },
];

// Mock platform stats
const platformStats = {
  totalCommunities: 1247,
  activeCommunities: 892,
  totalUsers: 156789,
  activeUsers: 45231,
  totalTransactions: 89456,
  platformRevenue: 12500000,
  pendingApprovals: 23,
  activeElections: 45,
};

// Mock revenue data
const revenueBreakdown = [
  { source: "Nomination Fees (Service Charges)", amount: 4500000, percentage: 36 },
  { source: "Campaign Fees (Platform Share)", amount: 3200000, percentage: 25.6 },
  { source: "Advertisement Revenue", amount: 2800000, percentage: 22.4 },
  { source: "Premium Features", amount: 1500000, percentage: 12 },
  { source: "Other Services", amount: 500000, percentage: 4 },
];

// Mock communities
const topCommunities = [
  { id: "1", name: "Umuahia Progressive Union", members: 1245, elections: 3, revenue: 450000 },
  { id: "2", name: "Lagos Igbo Community", members: 2890, elections: 2, revenue: 380000 },
  { id: "3", name: "Abuja Professional Network", members: 567, elections: 1, revenue: 220000 },
  { id: "4", name: "Delta State Association", members: 1890, elections: 4, revenue: 510000 },
];

export default function MobigateAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [waiverStatuses, setWaiverStatuses] = useState<Record<string, "pending" | "approved" | "rejected">>(
    Object.fromEntries(mockWaiverRequests.map(w => [w.id, "pending"]))
  );
  const { toast } = useToast();
  const navigate = useNavigate();

  const pendingCount = Object.values(waiverStatuses).filter(s => s === "pending").length;

  const handleWaiverAction = (waiverId: string, action: "approved" | "rejected", merchantName: string) => {
    setWaiverStatuses(prev => ({ ...prev, [waiverId]: action }));
    toast({
      title: action === "approved" ? "Waiver Approved" : "Waiver Rejected",
      description: `${merchantName}'s waiver request has been ${action}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 mb-4">
            <TabsList className="inline-flex w-auto min-w-full h-auto whitespace-nowrap touch-pan-x">
              <TabsTrigger value="overview" className="text-xs py-2 px-3">
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="elections" className="text-xs py-2 px-3">
                <Vote className="h-4 w-4 mr-1" />
                Elections
              </TabsTrigger>
              <TabsTrigger value="revenue" className="text-xs py-2 px-3">
                <Wallet className="h-4 w-4 mr-1" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="quiz" className="text-xs py-2 px-3">
                <Trophy className="h-4 w-4 mr-1" />
                Quiz
              </TabsTrigger>
              <TabsTrigger value="adverts" className="text-xs py-2 px-3">
                <Megaphone className="h-4 w-4 mr-1" />
                Adverts
              </TabsTrigger>
              <TabsTrigger value="merchants" className="text-xs py-2 px-3 relative">
                <Store className="h-4 w-4 mr-1" />
                Merchants
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 min-w-4 text-[9px] px-1">4</Badge>
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs py-2 px-3">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4 pb-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Communities</span>
                      </div>
                      <p className="text-2xl font-bold">{platformStats.totalCommunities.toLocaleString()}</p>
                      <p className="text-xs text-emerald-600">
                        {platformStats.activeCommunities.toLocaleString()} active
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-xs text-muted-foreground">Users</span>
                      </div>
                      <p className="text-2xl font-bold">{(platformStats.totalUsers / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-emerald-600">
                        {(platformStats.activeUsers / 1000).toFixed(1)}K active
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-amber-500" />
                        <span className="text-xs text-muted-foreground">Transactions</span>
                      </div>
                      <p className="text-2xl font-bold">{(platformStats.totalTransactions / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet className="h-4 w-4 text-emerald-500" />
                        <span className="text-xs text-muted-foreground">Revenue</span>
                        <MobiExplainerTooltip size="sm" />
                      </div>
                      <p className="text-2xl font-bold">{formatMobi(platformStats.platformRevenue)}</p>
                      <p className="text-xs text-muted-foreground">
                        ≈ {formatLocalAmount(platformStats.platformRevenue, "NGN")}
                      </p>
                      <p className="text-xs text-emerald-600">+12.5% this month</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1">
                      <Vote className="h-5 w-5" />
                      <span className="text-xs">Elections</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1">
                      <Building2 className="h-5 w-5" />
                      <span className="text-xs">Communities</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1">
                      <Users className="h-5 w-5" />
                      <span className="text-xs">Users</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1">
                      <Settings className="h-5 w-5" />
                      <span className="text-xs">Settings</span>
                    </Button>
                  </CardContent>
                </Card>

                {/* Pending Actions */}
                {platformStats.pendingApprovals > 0 && (
                  <Card className="border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                          <div>
                            <p className="font-medium text-sm">Pending Approvals</p>
                            <p className="text-xs text-muted-foreground">
                              {platformStats.pendingApprovals} items need review
                            </p>
                          </div>
                        </div>
                        <Button size="sm">Review</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Top Communities */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Top Communities</CardTitle>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        View All
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {topCommunities.map((community, index) => (
                      <div
                        key={community.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{community.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {community.members.toLocaleString()} members
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-primary">
                            {formatMobi(community.revenue)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ≈ {formatLocalAmount(community.revenue, "NGN")}
                          </p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {community.elections} elections
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Elections Tab - Nomination Fee Settings */}
          <TabsContent value="elections" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4 pb-6">
                {/* Active Elections Stats */}
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Active Elections</p>
                        <p className="text-3xl font-bold">{platformStats.activeElections}</p>
                      </div>
                      <Vote className="h-10 w-10 text-primary/50" />
                    </div>
                    <div className="flex gap-4 mt-3 pt-3 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Nominations Open</p>
                        <p className="font-bold">12</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">In Voting</p>
                        <p className="font-bold">8</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Concluded</p>
                        <p className="font-bold">25</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mobigate-Only Notice */}
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <Shield className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Mobigate Admin Only</p>
                    <p className="text-xs text-muted-foreground">
                      These settings are only accessible to platform administrators
                    </p>
                  </div>
                </div>

                {/* Nomination Fee Settings */}
                <NominationFeeSettingsSection />

                {/* Campaign Fee Distribution Settings */}
                <CampaignFeeDistributionSettings />
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4 pb-6">
                {/* Revenue Overview */}
                <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="text-xs text-muted-foreground">Total Platform Revenue</p>
                          <MobiExplainerTooltip size="sm" />
                        </div>
                        <p className="text-3xl font-bold text-emerald-600">
                          {formatMobi(platformStats.platformRevenue)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ≈ {formatLocalAmount(platformStats.platformRevenue, "NGN")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600">
                        <TrendingUp className="h-5 w-5" />
                        <span className="font-bold">+12.5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue Breakdown */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {revenueBreakdown.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{item.source}</span>
                          <div className="text-right">
                            <span className="font-medium">{formatMobi(item.amount)}</span>
                            <p className="text-xs text-muted-foreground">
                              ≈ {formatLocalAmount(item.amount, "NGN")}
                            </p>
                          </div>
                        </div>
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="absolute left-0 top-0 h-full bg-primary rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-right text-muted-foreground">
                          {item.percentage}%
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Monthly Trend */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Monthly Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">This Month</p>
                        <p className="font-bold text-emerald-600">{formatMobi(2800000)}</p>
                        <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(2800000, "NGN")}</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">Last Month</p>
                        <p className="font-bold">{formatMobi(2490000)}</p>
                        <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(2490000, "NGN")}</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">Growth</p>
                        <p className="font-bold text-emerald-600">+12.5%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Fee Collections */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Coins className="h-5 w-5 text-amber-500" />
                      Fee Collections
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Service Charges</p>
                        <p className="text-xs text-muted-foreground">From nomination fees</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{formatMobi(4500000)}</p>
                        <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(4500000, "NGN")}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Campaign Royalties</p>
                        <p className="text-xs text-muted-foreground">40% platform share</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{formatMobi(3200000)}</p>
                        <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(3200000, "NGN")}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Ad Revenue</p>
                        <p className="text-xs text-muted-foreground">Banner & promoted content</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{formatMobi(2800000)}</p>
                        <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(2800000, "NGN")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Currency Info Banner */}
                <MobiCurrencyInfoBanner currencyCode="NGN" />
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4 pb-6">
                {/* Merchant Waiver Requests */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Store className="h-5 w-5 text-amber-500" />
                        Merchant Waivers
                      </CardTitle>
                      {pendingCount > 0 && (
                        <Badge className="bg-amber-500 text-white">
                          {pendingCount} pending
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockWaiverRequests.map(waiver => {
                      const status = waiverStatuses[waiver.id];
                      const shortfall = waiver.requiredBalance - waiver.walletBalance;

                      return (
                        <div
                          key={waiver.id}
                          className={`p-3 rounded-lg border space-y-2.5 ${
                            status === "approved"
                              ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                              : status === "rejected"
                              ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800 opacity-70"
                              : "bg-muted/30 border-border"
                          }`}
                        >
                          {/* Merchant + Status */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{waiver.merchantLogo}</span>
                              <div>
                                <p className={`font-semibold text-sm ${status === "rejected" ? "line-through text-muted-foreground" : ""}`}>
                                  {waiver.merchantName}
                                </p>
                                <p className="text-xs text-muted-foreground">{waiver.seasonName}</p>
                              </div>
                            </div>
                            {status !== "pending" && (
                              <Badge
                                variant={status === "approved" ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {status === "approved" ? (
                                  <><CheckCircle className="h-3 w-3 mr-1" />Approved</>
                                ) : (
                                  <><XCircle className="h-3 w-3 mr-1" />Rejected</>
                                )}
                              </Badge>
                            )}
                            {status === "pending" && (
                              <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                                <Clock className="h-3 w-3 mr-1" />Pending
                              </Badge>
                            )}
                          </div>

                          {/* Financial Details */}
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-1.5 rounded bg-background">
                              <p className="text-[10px] text-muted-foreground">Prize Pool</p>
                              <p className="text-xs font-bold">{formatMobi(waiver.totalPrizes)}</p>
                            </div>
                            <div className="p-1.5 rounded bg-background">
                              <p className="text-[10px] text-muted-foreground">Wallet</p>
                              <p className="text-xs font-bold text-amber-600">{formatMobi(waiver.walletBalance)}</p>
                            </div>
                            <div className="p-1.5 rounded bg-background">
                              <p className="text-[10px] text-muted-foreground">Shortfall</p>
                              <p className="text-xs font-bold text-red-500">{formatMobi(shortfall)}</p>
                            </div>
                          </div>

                          {/* Context message */}
                          {waiver.waiverContext && (
                            <div className="flex items-start gap-2 p-2 bg-background rounded text-xs">
                              <AlertCircle className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                              <p className="text-muted-foreground italic">"{waiver.waiverContext}"</p>
                            </div>
                          )}

                          {/* Date + Fee */}
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>Submitted: {waiver.submittedDate}</span>
                            <span>Fee paid: {formatMobi(waiver.waiverFee)}</span>
                          </div>

                          {/* Action Buttons */}
                          {status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => handleWaiverAction(waiver.id, "approved", waiver.merchantName)}
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="flex-1 h-8 text-xs"
                                onClick={() => handleWaiverAction(waiver.id, "rejected", waiver.merchantName)}
                              >
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Quiz type cards */}
                {[
                  { type: "group", label: "Group Quiz", icon: "👥", desc: "Team-based quiz competitions", color: "from-blue-500/10 to-blue-500/5" },
                  { type: "standard", label: "Standard Solo", icon: "⚡", desc: "Individual quiz challenges", color: "from-amber-500/10 to-amber-500/5" },
                  { type: "interactive", label: "Interactive Quiz", icon: "📡", desc: "Merchant-powered quiz platforms", color: "from-purple-500/10 to-purple-500/5" },
                  { type: "food", label: "Food for Home", icon: "🍽️", desc: "Win food prizes through quizzes", color: "from-emerald-500/10 to-emerald-500/5" },
                  { type: "scholarship", label: "Scholarship Quiz", icon: "🎓", desc: "Academic scholarship competitions", color: "from-rose-500/10 to-rose-500/5" },
                ].map(qt => (
                  <Card key={qt.type} className={`bg-gradient-to-br ${qt.color}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{qt.icon}</span>
                        <div>
                          <p className="font-bold text-sm">{qt.label}</p>
                          <p className="text-xs text-muted-foreground">{qt.desc}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {qt.type === "interactive" && (
                          <Card className="cursor-pointer hover:bg-accent/30 transition-colors active:scale-[0.98]"
                            onClick={() => navigate(`/merchant-page`)}>
                            <CardContent className="p-2.5 flex items-center gap-2">
                              <span className="text-base">🏪</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold">Merchants</p>
                              </div>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </CardContent>
                          </Card>
                        )}
                        {[
                          { label: "Categories", icon: "📂", route: `categories` },
                          { label: "Levels", icon: "🏆", route: `levels` },
                          { label: "Questions", icon: "✏️", route: `questions` },
                          { label: "Monitor", icon: "📡", route: `monitor` },
                        ].map(item => (
                          <Card key={item.route}
                            className="cursor-pointer hover:bg-accent/30 transition-colors active:scale-[0.98]"
                            onClick={() => navigate(`/mobigate-admin/quiz/${qt.type}/${item.route}`)}>
                            <CardContent className="p-2.5 flex items-center gap-2">
                              <span className="text-base">{item.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold">{item.label}</p>
                              </div>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Adverts Tab */}
          <TabsContent value="adverts" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3 pb-6">
                {[
                  { label: "Set Ad Slot Rate", desc: "Configure pricing & discounts", icon: "💰", route: "/mobigate-admin/adverts/slot-rates" },
                  { label: "Manage All Adverts", desc: "View & manage advertisements", icon: "📋", route: "/mobigate-admin/adverts/manage" },
                  { label: "Promotional Ads", desc: "Upload & manage banners", icon: "📣", route: "/mobigate-admin/adverts/promotional" },
                ].map(item => (
                  <Card
                    key={item.route}
                    className="cursor-pointer hover:bg-accent/30 transition-colors active:scale-[0.98]"
                    onClick={() => navigate(item.route)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4 pb-6">
                {/* Mobigate-Only Notice */}
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <Shield className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Platform Settings</p>
                    <p className="text-xs text-muted-foreground">
                      Configure platform-wide policies and limits
                    </p>
                  </div>
                </div>

                {/* Withdrawal Settings */}
                <WithdrawalSettingsCard />

                {/* Quiz Settings */}
                <QuizSettingsCard />
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Merchants Tab */}
          <TabsContent value="merchants" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="pb-6">
                <MerchantApplicationsAdmin />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
