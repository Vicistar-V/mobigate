import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/ui/drawer";
import {
  Gift, Search, Calendar, TrendingUp, Wallet, ChevronRight,
  Ticket, ArrowUpRight, ArrowDownRight, Filter, Clock, User, ShieldCheck, Globe, MapPin,
} from "lucide-react";
import { getUniqueCountries, getNigerianStatesForFilter, getCitiesForLGA } from "@/data/nigerianLocationsData";

// ─── Types ───
interface BonusAwardRecord {
  id: string;
  merchantId: string;
  merchantName: string;
  packUnits: number;
  denomination: number;
  totalValue: number;
  awardedAt: string;
  awardedBy: string;
  authorizedBy: string[];
  reason?: string;
  countryName?: string;
  stateName?: string;
  cityName?: string;
}

// ─── Mock Data ───
const mockBonusAwards: BonusAwardRecord[] = [
  {
    id: "ba-001", merchantId: "m1", merchantName: "QuickBuy Electronics",
    packUnits: 50, denomination: 5000, totalValue: 250000,
    awardedAt: "2026-03-15T10:30:00", awardedBy: "Admin-1 (Super Admin)",
    authorizedBy: ["Admin-1"], reason: "Top seller Q1 2026",
    countryName: "Nigeria", stateName: "Lagos", cityName: "Ikeja",
  },
  {
    id: "ba-002", merchantId: "m3", merchantName: "TechZone Repairs",
    packUnits: 25, denomination: 500, totalValue: 12500,
    awardedAt: "2026-03-12T14:15:00", awardedBy: "Admin-2 (Finance Admin)",
    authorizedBy: ["Admin-2", "Admin-3", "Admin-4"], reason: "Customer satisfaction award",
    countryName: "Nigeria", stateName: "Abuja FCT", cityName: "Garki",
  },
  {
    id: "ba-003", merchantId: "m2", merchantName: "FreshMart Foods",
    packUnits: 100, denomination: 5000, totalValue: 500000,
    awardedAt: "2026-03-08T09:00:00", awardedBy: "Admin-1 (Super Admin)",
    authorizedBy: ["Admin-1"], reason: "New market expansion bonus",
    countryName: "Nigeria", stateName: "Rivers", cityName: "Port Harcourt",
  },
  {
    id: "ba-004", merchantId: "m5", merchantName: "DataPlug Hub",
    packUnits: 75, denomination: 500, totalValue: 37500,
    awardedAt: "2026-03-01T16:45:00", awardedBy: "Admin-3 (Operations Admin)",
    authorizedBy: ["Admin-2", "Admin-3", "Admin-4"],
    countryName: "Nigeria", stateName: "Lagos", cityName: "Lekki",
  },
  {
    id: "ba-005", merchantId: "m1", merchantName: "QuickBuy Electronics",
    packUnits: 25, denomination: 5000, totalValue: 125000,
    awardedAt: "2026-02-20T11:30:00", awardedBy: "Admin-1 (Super Admin)",
    authorizedBy: ["Admin-1"], reason: "Platform loyalty bonus",
    countryName: "Nigeria", stateName: "Lagos", cityName: "Ikeja",
  },
  {
    id: "ba-006", merchantId: "m4", merchantName: "GlamStyle Beauty",
    packUnits: 50, denomination: 500, totalValue: 25000,
    awardedAt: "2026-02-14T08:00:00", awardedBy: "Admin-2 (Finance Admin)",
    authorizedBy: ["Admin-2", "Admin-3", "Admin-4"], reason: "Valentine's promo winner",
    countryName: "Nigeria", stateName: "Kano", cityName: "Kano City",
  },
  {
    id: "ba-007", merchantId: "m8", merchantName: "NaijaDeals Hub",
    packUnits: 100, denomination: 500, totalValue: 50000,
    awardedAt: "2026-02-01T13:20:00", awardedBy: "Admin-1 (Super Admin)",
    authorizedBy: ["Admin-1"], reason: "High volume retailer bonus",
    countryName: "Nigeria", stateName: "Oyo", cityName: "Ibadan",
  },
  {
    id: "ba-008", merchantId: "m3", merchantName: "TechZone Repairs",
    packUnits: 75, denomination: 5000, totalValue: 375000,
    awardedAt: "2026-01-15T10:00:00", awardedBy: "Admin-1 (Super Admin)",
    authorizedBy: ["Admin-1"], reason: "Annual excellence award",
    countryName: "Nigeria", stateName: "Abuja FCT", cityName: "Wuse",
  },
  {
    id: "ba-009", merchantId: "m2", merchantName: "FreshMart Foods",
    packUnits: 50, denomination: 500, totalValue: 25000,
    awardedAt: "2025-12-20T15:30:00", awardedBy: "Admin-4 (Compliance Admin)",
    authorizedBy: ["Admin-2", "Admin-3", "Admin-4"], reason: "Christmas season top merchant",
    countryName: "Nigeria", stateName: "Enugu", cityName: "Enugu City",
  },
  {
    id: "ba-010", merchantId: "m5", merchantName: "DataPlug Hub",
    packUnits: 25, denomination: 5000, totalValue: 125000,
    awardedAt: "2025-12-01T09:45:00", awardedBy: "Admin-1 (Super Admin)",
    authorizedBy: ["Admin-1"],
    countryName: "Nigeria", stateName: "Lagos", cityName: "Victoria Island",
  },
];

const formatMobi = (n: number) => `M${n.toLocaleString()}`;
const formatNaira = (n: number) => `₦${n.toLocaleString()}`;

type TimeFilter = "all" | "today" | "7days" | "30days" | "90days" | "6months" | "1year" | "over1year";
type DenomFilter = "all" | "100" | "200" | "500" | "1000" | "5000";

const timeFilterLabels: Record<TimeFilter, string> = {
  all: "All Time",
  today: "Today",
  "7days": "Last 7 Days",
  "30days": "Last 30 Days",
  "90days": "Last 90 Days",
  "6months": "Last 6 Months",
  "1year": "Last Year",
  over1year: "Over a Year",
};

function getTimeFilterDate(filter: TimeFilter): { cutoff: Date; mode: "after" | "before" } | null {
  if (filter === "all") return null;
  const now = new Date();
  switch (filter) {
    case "today": return { cutoff: new Date(now.getFullYear(), now.getMonth(), now.getDate()), mode: "after" };
    case "7days": return { cutoff: new Date(now.getTime() - 7 * 86400000), mode: "after" };
    case "30days": return { cutoff: new Date(now.getTime() - 30 * 86400000), mode: "after" };
    case "90days": return { cutoff: new Date(now.getTime() - 90 * 86400000), mode: "after" };
    case "6months": return { cutoff: new Date(now.getTime() - 180 * 86400000), mode: "after" };
    case "1year": return { cutoff: new Date(now.getTime() - 365 * 86400000), mode: "after" };
    case "over1year": return { cutoff: new Date(now.getTime() - 365 * 86400000), mode: "before" };
    default: return null;
  }
}

export function AdminBonusAwardsTab() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [denomFilter, setDenomFilter] = useState<DenomFilter>("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAward, setSelectedAward] = useState<BonusAwardRecord | null>(null);

  const countries = useMemo(() => getUniqueCountries(), []);
  const states = useMemo(() => getNigerianStatesForFilter(), []);
  const cities = useMemo(() => {
    if (stateFilter === "all") return [];
    const stateObj = states.find(s => s.name === stateFilter);
    return stateObj ? getCitiesForLGA(undefined, stateObj.id) : [];
  }, [stateFilter, states]);

  const filteredAwards = useMemo(() => {
    let list = [...mockBonusAwards];

    // Time filter
    const timeResult = getTimeFilterDate(timeFilter);
    if (timeResult) {
      if (timeResult.mode === "after") {
        list = list.filter((a) => new Date(a.awardedAt) >= timeResult.cutoff);
      } else {
        list = list.filter((a) => new Date(a.awardedAt) < timeResult.cutoff);
      }
    }

    // Denomination filter
    if (denomFilter !== "all") list = list.filter((a) => a.denomination === Number(denomFilter));

    // Location filters
    if (countryFilter !== "all") list = list.filter((a) => a.countryName === countryFilter);
    if (stateFilter !== "all") list = list.filter((a) => a.stateName === stateFilter);
    if (cityFilter !== "all") list = list.filter((a) => a.cityName === cityFilter);

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.merchantName.toLowerCase().includes(q) ||
          a.awardedBy.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => new Date(b.awardedAt).getTime() - new Date(a.awardedAt).getTime());
  }, [timeFilter, denomFilter, countryFilter, stateFilter, cityFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const totalValue = filteredAwards.reduce((s, a) => s + a.totalValue, 0);
    const totalUnits = filteredAwards.reduce((s, a) => s + a.packUnits, 0);
    const uniqueMerchants = new Set(filteredAwards.map((a) => a.merchantId)).size;
    const superAdminCount = filteredAwards.filter((a) => a.authorizedBy.includes("Admin-1")).length;
    return { totalValue, totalUnits, count: filteredAwards.length, uniqueMerchants, superAdminCount };
  }, [filteredAwards]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  // Compare with previous period
  const prevPeriodValue = useMemo(() => {
    const timeResult = getTimeFilterDate(timeFilter);
    if (!timeResult || timeFilter === "all" || timeFilter === "over1year") return null;
    const duration = Date.now() - timeResult.cutoff.getTime();
    const prevCutoff = new Date(timeResult.cutoff.getTime() - duration);
    const prevAwards = mockBonusAwards.filter((a) => {
      const d = new Date(a.awardedAt);
      return d >= prevCutoff && d < timeResult.cutoff;
    });
    return prevAwards.reduce((s, a) => s + a.totalValue, 0);
  }, [timeFilter]);

  const valueChange = prevPeriodValue !== null && prevPeriodValue > 0
    ? ((stats.totalValue - prevPeriodValue) / prevPeriodValue) * 100
    : null;

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="border-primary/20">
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Wallet className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs text-muted-foreground font-medium">Total Value</p>
            </div>
            <p className="text-base font-black text-primary">{formatMobi(stats.totalValue)}</p>
            <p className="text-xs text-muted-foreground">{formatNaira(stats.totalValue)}</p>
            {valueChange !== null && (
              <div className={`flex items-center justify-center gap-0.5 mt-1 text-xs font-semibold ${valueChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {valueChange >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(valueChange).toFixed(0)}% vs prev period
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Gift className="h-3.5 w-3.5 text-amber-500" />
              <p className="text-xs text-muted-foreground font-medium">Awards Made</p>
            </div>
            <p className="text-base font-black text-foreground">{stats.count}</p>
            <p className="text-xs text-muted-foreground">{stats.totalUnits} total units</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <User className="h-3.5 w-3.5 text-emerald-500" />
              <p className="text-xs text-muted-foreground font-medium">Merchants</p>
            </div>
            <p className="text-base font-black text-foreground">{stats.uniqueMerchants}</p>
            <p className="text-xs text-muted-foreground">unique recipients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              <p className="text-xs text-muted-foreground font-medium">Super Admin</p>
            </div>
            <p className="text-base font-black text-foreground">{stats.superAdminCount}</p>
            <p className="text-xs text-muted-foreground">solo approvals</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by merchant, admin, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Time + Denomination filters */}
        <div className="flex gap-2">
          <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
            <SelectTrigger className="h-9 text-xs flex-1">
              <Calendar className="h-3.5 w-3.5 mr-1 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(timeFilterLabels).map(([k, v]) => (
                <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={denomFilter} onValueChange={(v) => setDenomFilter(v as DenomFilter)}>
            <SelectTrigger className="h-9 text-xs w-[130px]">
              <Ticket className="h-3.5 w-3.5 mr-1 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Packs</SelectItem>
              <SelectItem value="100" className="text-xs">M100 Packs</SelectItem>
              <SelectItem value="200" className="text-xs">M200 Packs</SelectItem>
              <SelectItem value="500" className="text-xs">M500 Packs</SelectItem>
              <SelectItem value="1000" className="text-xs">M1,000 Packs</SelectItem>
              <SelectItem value="5000" className="text-xs">M5,000 Packs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Award List */}
      <div className="space-y-2">
        {filteredAwards.length === 0 ? (
          <Card className="py-10">
            <div className="text-center">
              <Gift className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No bonus awards found</p>
              <p className="text-xs text-muted-foreground mt-1">Adjust your filters to see results</p>
            </div>
          </Card>
        ) : (
          filteredAwards.map((award) => (
            <button
              key={award.id}
              onClick={() => setSelectedAward(award)}
              className="w-full text-left touch-manipulation active:scale-[0.98] transition-transform"
            >
              <Card className="overflow-hidden hover:border-primary/30 transition-colors">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                      award.denomination === 5000 ? "bg-amber-500/10" : "bg-emerald-500/10"
                    }`}>
                      <Gift className={`h-5 w-5 ${
                        award.denomination === 5000 ? "text-amber-600" : "text-emerald-600"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold truncate">{award.merchantName}</p>
                        <p className={`text-sm font-black shrink-0 ${
                          award.denomination === 5000 ? "text-amber-600" : "text-emerald-600"
                        }`}>
                          {formatMobi(award.totalValue)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                          {award.packUnits} × {formatMobi(award.denomination)}
                        </Badge>
                        {award.authorizedBy.includes("Admin-1") && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 border-amber-400 text-amber-700 bg-amber-50">
                            Super Admin
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                      <p className="text-xs text-muted-foreground truncate mr-2">{award.awardedBy}</p>
                        <p className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(award.awardedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))
        )}
      </div>

      {/* Award Detail Drawer */}
      <Drawer open={!!selectedAward} onOpenChange={(open) => { if (!open) setSelectedAward(null); }}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-base font-bold flex items-center gap-2">
              <Gift className="h-4 w-4 text-amber-500" />
              Award Details
            </DrawerTitle>
          </DrawerHeader>
          {selectedAward && (
            <DrawerBody className="pb-6">
              <div className="space-y-4">
                {/* Value Card */}
                <Card className={`border-2 ${
                  selectedAward.denomination === 5000
                    ? "border-amber-300 bg-amber-50"
                    : "border-emerald-300 bg-emerald-50"
                }`}>
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Bonus Value</p>
                    <p className={`text-2xl font-black ${
                      selectedAward.denomination === 5000 ? "text-amber-600" : "text-emerald-600"
                    }`}>
                      {formatMobi(selectedAward.totalValue)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatNaira(selectedAward.totalValue)}</p>
                  </CardContent>
                </Card>

                {/* Details */}
                <Card>
                  <CardContent className="p-0 divide-y divide-border/50">
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Reference</span>
                      <span className="text-sm font-mono font-semibold">{selectedAward.id.toUpperCase()}</span>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Merchant</span>
                      <button
                        onClick={() => window.open(`/merchant/${selectedAward.merchantId}`, '_blank')}
                        className="text-sm font-semibold text-primary underline underline-offset-2 touch-manipulation"
                      >
                        {selectedAward.merchantName}
                      </button>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Pack</span>
                      <span className="text-sm font-semibold">
                        {selectedAward.packUnits} × {formatMobi(selectedAward.denomination)}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Units</span>
                      <span className="text-sm font-semibold">{selectedAward.packUnits} voucher cards</span>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Denomination</span>
                      <Badge variant="outline" className={`text-xs ${
                        selectedAward.denomination === 5000
                          ? "border-amber-400 text-amber-700 bg-amber-50"
                          : "border-emerald-400 text-emerald-700 bg-emerald-50"
                      }`}>
                        {formatMobi(selectedAward.denomination)}
                      </Badge>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Date & Time</span>
                      <span className="text-sm font-semibold">
                        {formatDate(selectedAward.awardedAt)} · {formatTime(selectedAward.awardedAt)}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Credited to</span>
                      <span className="text-sm font-semibold">main‑Wallet</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Authorization Info */}
                <Card>
                  <CardContent className="p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold">Authorization</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Initiated by</span>
                        <span className="text-sm font-medium">{selectedAward.awardedBy}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-muted-foreground">Authorized by</span>
                        <div className="text-right">
                          {selectedAward.authorizedBy.map((admin) => (
                            <Badge key={admin} variant="outline" className="text-xs ml-1 mb-1">
                              {admin}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Method</span>
                        <Badge variant="outline" className={`text-xs ${
                          selectedAward.authorizedBy.includes("Admin-1")
                            ? "border-amber-400 text-amber-700 bg-amber-50"
                            : "border-blue-400 text-blue-700 bg-blue-50"
                        }`}>
                          {selectedAward.authorizedBy.includes("Admin-1") ? "Super Admin Solo" : "Multi-Admin (2+3+4)"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reason */}
                {selectedAward.reason && (
                  <Card>
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground mb-1">Award Reason</p>
                      <p className="text-sm leading-relaxed">{selectedAward.reason}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Non-tradable notice */}
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-3 flex items-start gap-2">
                    <Wallet className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700/80 leading-relaxed">
                      This bonus was credited to <strong>{selectedAward.merchantName}'s main‑Wallet</strong> and is <strong>tradable only as vouchers</strong>.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </DrawerBody>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
