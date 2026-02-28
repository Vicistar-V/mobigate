import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Store, CheckCircle, Star, MapPin, Search, Globe, Building2, Map, Home,
  Ticket, Gamepad2, Eye, TrendingUp, BarChart3, Package, CreditCard, Users, Trophy,
  ShieldCheck, ShieldBan, ShieldAlert, AlertTriangle,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MerchantApplicationsAdmin } from "@/components/mobigate/MerchantApplicationsAdmin";
import { VoucherDiscountSettingsCard } from "@/components/mobigate/VoucherDiscountSettingsCard";
import {
  allLocationMerchants,
  getUniqueCountries,
  getNigerianStatesForFilter,
  getLGAsForState,
  getCitiesForLGA,
  type LocationMerchant,
} from "@/data/nigerianLocationsData";

// Mock voucher stats per merchant
function getMerchantVoucherStats(merchantId: string) {
  const hash = merchantId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    totalBatches: 3 + (hash % 8),
    totalCardsGenerated: 500 + (hash % 2000),
    cardsSold: 200 + (hash % 800),
    cardsUsed: 100 + (hash % 400),
    cardsAvailable: 150 + (hash % 600),
    totalRevenue: 250000 + (hash % 1500000),
  };
}

// Mock quiz stats per merchant
function getMerchantQuizStats(merchantId: string) {
  const hash = merchantId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    totalSeasons: 1 + (hash % 5),
    totalGamesPlayed: 50 + (hash % 500),
    totalPrizePool: 100000 + (hash % 2000000),
    activeSeasons: hash % 3,
  };
}

function getMerchantOfferings(merchantId: string) {
  const hash = merchantId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const mod = hash % 3;
  if (mod === 0) return { hasQuiz: true, hasVoucher: true };
  if (mod === 1) return { hasQuiz: true, hasVoucher: false };
  return { hasQuiz: false, hasVoucher: true };
}

function getMerchantStatus(merchantId: string): "active" | "suspended" | "banned" {
  const hash = merchantId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const mod = hash % 10;
  if (mod < 8) return "active";
  if (mod < 9) return "suspended";
  return "banned";
}

export default function ManageMerchantsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "banned">("all");

  // Detail drawer
  const [selectedMerchant, setSelectedMerchant] = useState<LocationMerchant | null>(null);

  const countries = useMemo(() => getUniqueCountries(), []);
  const isNigeria = selectedCountry === "ng" || !selectedCountry;
  const states = useMemo(() => (isNigeria ? getNigerianStatesForFilter() : []), [isNigeria]);
  const lgas = useMemo(() => getLGAsForState(selectedState || undefined), [selectedState]);
  const cities = useMemo(() => getCitiesForLGA(selectedLGA || undefined, selectedState || undefined), [selectedLGA, selectedState]);

  const handleCountryChange = (v: string) => { setSelectedCountry(v === "all" ? "" : v); setSelectedState(""); setSelectedLGA(""); setSelectedCity(""); };
  const handleStateChange = (v: string) => { setSelectedState(v === "all" ? "" : v); setSelectedLGA(""); setSelectedCity(""); };
  const handleLGAChange = (v: string) => { setSelectedLGA(v === "all" ? "" : v); setSelectedCity(""); };
  const handleCityChange = (v: string) => { setSelectedCity(v === "all" ? "" : v); };

  const filteredMerchants = useMemo(() => {
    let list = allLocationMerchants.filter((m) => m.isActive);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
    }
    if (selectedCity) list = list.filter((m) => m.cityId === selectedCity);
    else if (selectedLGA) list = list.filter((m) => m.lgaId === selectedLGA);
    else if (selectedState) list = list.filter((m) => m.stateId === selectedState);
    else if (selectedCountry) list = list.filter((m) => m.countryId === selectedCountry);
    if (statusFilter !== "all") list = list.filter((m) => getMerchantStatus(m.id) === statusFilter);
    return list;
  }, [selectedCountry, selectedState, selectedLGA, selectedCity, searchQuery, statusFilter]);

  const formatCurrency = (n: number) => "₦" + n.toLocaleString();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Store className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold">Manage Merchants</h1>
        </div>
        <p className="text-sm text-muted-foreground">Admin merchant management</p>
      </div>

      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 mb-3">
            <TabsList className="inline-flex w-auto min-w-full h-11 whitespace-nowrap touch-pan-x">
              <TabsTrigger value="all" className="text-xs py-2.5 px-3">
                <Store className="h-4 w-4 mr-1" />
                All Merchants
              </TabsTrigger>
              <TabsTrigger value="applications" className="text-xs py-2.5 px-3 relative">
                <Users className="h-4 w-4 mr-1" />
                Applications
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 min-w-4 text-xs px-1">4</Badge>
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs py-2.5 px-3">
                <CreditCard className="h-4 w-4 mr-1" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* All Merchants Tab */}
          <TabsContent value="all" className="mt-0">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search merchants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
              />
            </div>

            {/* Compact Chip Filters — horizontal scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
              {/* Status chip */}
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className={`h-9 w-auto min-w-[90px] max-w-[130px] rounded-full text-xs shrink-0 touch-manipulation ${
                  statusFilter === "all" ? "border-primary/30 bg-primary/5" :
                  statusFilter === "active" ? "border-emerald-400 bg-emerald-500/10 text-emerald-700" :
                  statusFilter === "suspended" ? "border-amber-400 bg-amber-500/10 text-amber-700" :
                  "border-red-400 bg-red-500/10 text-red-700"
                }`}>
                  <ShieldCheck className="h-3.5 w-3.5 mr-1 shrink-0" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">✅ Active</SelectItem>
                  <SelectItem value="suspended">⚠️ Suspended</SelectItem>
                  <SelectItem value="banned">🚫 Banned</SelectItem>
                </SelectContent>
              </Select>

              {/* Country chip */}
              <Select value={selectedCountry || "all"} onValueChange={handleCountryChange}>
                <SelectTrigger className="h-9 w-auto min-w-[100px] max-w-[140px] rounded-full text-xs border-primary/30 bg-primary/5 shrink-0 touch-manipulation">
                  <Globe className="h-3.5 w-3.5 mr-1 shrink-0" />
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.flag} {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* State chip */}
              {isNigeria && states.length > 0 && (
                <Select value={selectedState || "all"} onValueChange={handleStateChange}>
                  <SelectTrigger className="h-9 w-auto min-w-[90px] max-w-[130px] rounded-full text-xs border-primary/30 bg-primary/5 shrink-0 touch-manipulation">
                    <Building2 className="h-3.5 w-3.5 mr-1 shrink-0" />
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* LGA chip */}
              {isNigeria && lgas.length > 0 && (
                <Select value={selectedLGA || "all"} onValueChange={handleLGAChange}>
                  <SelectTrigger className="h-9 w-auto min-w-[80px] max-w-[130px] rounded-full text-xs border-primary/30 bg-primary/5 shrink-0 touch-manipulation">
                    <Map className="h-3.5 w-3.5 mr-1 shrink-0" />
                    <SelectValue placeholder="LGA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All LGAs</SelectItem>
                    {lgas.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* City chip */}
              {isNigeria && cities.length > 0 && (
                <Select value={selectedCity || "all"} onValueChange={handleCityChange}>
                  <SelectTrigger className="h-9 w-auto min-w-[80px] max-w-[120px] rounded-full text-xs border-primary/30 bg-primary/5 shrink-0 touch-manipulation">
                    <Home className="h-3.5 w-3.5 mr-1 shrink-0" />
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Results */}
            <p className="text-xs text-muted-foreground mb-2">
              {filteredMerchants.length} merchant{filteredMerchants.length !== 1 ? "s" : ""} found
            </p>

            <div className="space-y-2 pb-6">
              {filteredMerchants.length === 0 ? (
                <div className="py-12 text-center">
                  <Store className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No merchants found</p>
                  <p className="text-xs text-muted-foreground mt-1">Try changing your filters</p>
                </div>
              ) : (
                filteredMerchants.map((merchant) => (
                  <AdminMerchantCard
                    key={merchant.id}
                    merchant={merchant}
                    onClick={() => setSelectedMerchant(merchant)}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="mt-0">
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="pb-6">
                <MerchantApplicationsAdmin />
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-0">
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="pb-6 space-y-4">
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <CreditCard className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Voucher Settings</p>
                    <p className="text-xs text-muted-foreground">Configure voucher discount rates</p>
                  </div>
                </div>
                <VoucherDiscountSettingsCard />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Merchant Detail Drawer */}
      <MerchantDetailDrawer
        merchant={selectedMerchant}
        onClose={() => setSelectedMerchant(null)}
      />
    </div>
  );
}

function AdminMerchantCard({ merchant, onClick }: { merchant: LocationMerchant; onClick: () => void }) {
  const { hasQuiz, hasVoucher } = getMerchantOfferings(merchant.id);
  const vStats = getMerchantVoucherStats(merchant.id);
  const status = getMerchantStatus(merchant.id);

  const statusBadge = status === "active" ? null : (
    <Badge variant="outline" className={`text-xs h-5 px-1.5 ${
      status === "suspended" ? "text-amber-600 border-amber-300 bg-amber-500/10" : "text-red-600 border-red-300 bg-red-500/10"
    }`}>
      {status === "suspended" ? "⚠️ Suspended" : "🚫 Banned"}
    </Badge>
  );

  return (
    <Card
      className={`p-3 cursor-pointer active:scale-[0.98] transition-transform touch-manipulation border-l-4 ${
        status === "banned" ? "border-l-red-500/60 opacity-75" :
        status === "suspended" ? "border-l-amber-500/60" :
        "border-l-primary/60"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 shrink-0 border-2 border-primary/20">
          <AvatarImage src={merchant.logo} alt={merchant.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
            {merchant.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold truncate">{merchant.name}</p>
            {merchant.isVerified && <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />}
            {statusBadge}
          </div>
          <p className="text-xs text-muted-foreground">{merchant.category}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span className="text-xs font-medium">{merchant.rating}</span>
            </div>
            {merchant.discountPercent > 0 && (
              <Badge variant="secondary" className="text-xs h-5 px-1.5">{merchant.discountPercent}% off</Badge>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />
              {merchant.countryFlag} {merchant.stateName || merchant.countryName}
            </span>
          </div>
          {/* Admin stats row */}
          <div className="flex items-center gap-3 mt-1.5">
            {hasVoucher && (
              <span className="text-xs text-emerald-600 flex items-center gap-0.5">
                <Ticket className="h-3 w-3" />
                {vStats.cardsSold} Sold
              </span>
            )}
            {hasQuiz && (
              <span className="text-xs text-amber-600 flex items-center gap-0.5">
                <Gamepad2 className="h-3 w-3" />
                Quiz active
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function MerchantDetailDrawer({ merchant, onClose }: { merchant: LocationMerchant | null; onClose: () => void }) {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Derive initial status from merchant id hash
  const initialStatus = merchant
    ? (["active", "suspended", "banned"] as const)[(merchant.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 10 < 8 ? 0 : (merchant.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 10 < 9 ? 1 : 2]
    : "active";
  const [merchantStatus, setMerchantStatus] = useState<"active" | "suspended" | "banned">(initialStatus);
  const [confirmAction, setConfirmAction] = useState<"suspend" | "ban" | "activate" | null>(null);

  if (!merchant) return null;

  const { hasQuiz, hasVoucher } = getMerchantOfferings(merchant.id);
  const vStats = getMerchantVoucherStats(merchant.id);
  const qStats = getMerchantQuizStats(merchant.id);
  const formatCurrency = (n: number) => "₦" + n.toLocaleString();

  const statusConfig = {
    active: { label: "Active", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-500/10 border-emerald-500/20" },
    suspended: { label: "Suspended", icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-500/10 border-amber-500/20" },
    banned: { label: "Banned", icon: ShieldBan, color: "text-red-600", bg: "bg-red-500/10 border-red-500/20" },
  };

  const currentStatus = statusConfig[merchantStatus];
  const StatusIcon = currentStatus.icon;

  const handleStatusChange = (action: "suspend" | "ban" | "activate") => {
    const newStatus = action === "activate" ? "active" : action === "suspend" ? "suspended" : "banned";
    setMerchantStatus(newStatus);
    setConfirmAction(null);
    toast({
      title: `Merchant ${action === "activate" ? "Activated" : action === "suspend" ? "Suspended" : "Banned"}`,
      description: `${merchant.name} has been ${newStatus}.`,
    });
  };

  return (
    <Drawer open={!!merchant} onOpenChange={(open) => { if (!open) { onClose(); setConfirmAction(null); } }}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-base">Merchant Details</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="overflow-y-auto touch-auto px-4 pb-8">
          {/* Profile Header */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={merchant.logo} alt={merchant.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {merchant.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-base font-bold truncate">{merchant.name}</p>
                {merchant.isVerified && <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground">{merchant.category}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span className="text-sm font-medium">{merchant.rating}</span>
                <span className="text-xs text-muted-foreground ml-2 flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  {merchant.cityName && `${merchant.cityName}, `}
                  {merchant.stateName && `${merchant.stateName}, `}
                  {merchant.countryFlag} {merchant.countryName}
                </span>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className={`rounded-xl border p-3 mb-5 ${currentStatus.bg}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-5 w-5 ${currentStatus.color}`} />
                <div>
                  <p className="text-sm font-bold">Account Status</p>
                  <p className={`text-xs font-semibold ${currentStatus.color}`}>{currentStatus.label}</p>
                </div>
              </div>
              <Badge variant="outline" className={`text-xs ${currentStatus.color} border-current`}>
                {currentStatus.label}
              </Badge>
            </div>

            {/* Confirm action UI */}
            {confirmAction && (
              <div className="rounded-lg bg-background border border-border p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <p className="text-sm font-semibold">
                    {confirmAction === "activate" ? "Reactivate" : confirmAction === "suspend" ? "Suspend" : "Ban"} {merchant.name}?
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {confirmAction === "ban"
                    ? "This will permanently restrict the merchant from all platform activities."
                    : confirmAction === "suspend"
                    ? "The merchant will be temporarily restricted from operations."
                    : "The merchant will regain full access to all platform features."}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-10 text-xs touch-manipulation"
                    onClick={() => setConfirmAction(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className={`flex-1 h-10 text-xs touch-manipulation ${
                      confirmAction === "ban" ? "bg-red-600 hover:bg-red-700 text-white" :
                      confirmAction === "suspend" ? "bg-amber-600 hover:bg-amber-700 text-white" :
                      "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                    onClick={() => handleStatusChange(confirmAction)}
                  >
                    Confirm {confirmAction === "activate" ? "Activate" : confirmAction === "suspend" ? "Suspend" : "Ban"}
                  </Button>
                </div>
              </div>
            )}

            {/* Status action buttons */}
            {!confirmAction && (
              <div className="flex gap-2">
                {merchantStatus !== "active" && (
                  <Button
                    size="sm"
                    className="flex-1 h-10 text-xs bg-emerald-600 hover:bg-emerald-700 text-white touch-manipulation active:scale-[0.97]"
                    onClick={() => setConfirmAction("activate")}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                    Activate
                  </Button>
                )}
                {merchantStatus !== "suspended" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-10 text-xs text-amber-600 border-amber-300 hover:bg-amber-50 touch-manipulation active:scale-[0.97]"
                    onClick={() => setConfirmAction("suspend")}
                  >
                    <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                    Suspend
                  </Button>
                )}
                {merchantStatus !== "banned" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-10 text-xs text-red-600 border-red-300 hover:bg-red-50 touch-manipulation active:scale-[0.97]"
                    onClick={() => setConfirmAction("ban")}
                  >
                    <ShieldBan className="h-3.5 w-3.5 mr-1" />
                    Ban
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Voucher Statistics */}
          {hasVoucher && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Ticket className="h-5 w-5 text-emerald-600" />
                <p className="text-sm font-bold">Voucher Statistics</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StatCard label="Total Batches" value={vStats.totalBatches.toString()} icon={<Package className="h-4 w-4 text-primary" />} />
                <StatCard label="Cards Generated" value={vStats.totalCardsGenerated.toLocaleString()} icon={<CreditCard className="h-4 w-4 text-blue-500" />} />
                <StatCard label="Cards Sold" value={vStats.cardsSold.toLocaleString()} icon={<TrendingUp className="h-4 w-4 text-emerald-500" />} />
                <StatCard label="Cards Used" value={vStats.cardsUsed.toLocaleString()} icon={<BarChart3 className="h-4 w-4 text-amber-500" />} />
                <StatCard label="Cards Available" value={vStats.cardsAvailable.toLocaleString()} icon={<Ticket className="h-4 w-4 text-purple-500" />} />
                <StatCard label="Total Revenue" value={formatCurrency(vStats.totalRevenue)} icon={<TrendingUp className="h-4 w-4 text-emerald-600" />} highlight />
              </div>
            </div>
          )}

          {/* Quiz Statistics */}
          {hasQuiz && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Gamepad2 className="h-5 w-5 text-amber-600" />
                <p className="text-sm font-bold">Quiz Statistics</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StatCard label="Total Seasons" value={qStats.totalSeasons.toString()} icon={<Trophy className="h-4 w-4 text-amber-500" />} />
                <StatCard label="Games Played" value={qStats.totalGamesPlayed.toLocaleString()} icon={<Gamepad2 className="h-4 w-4 text-blue-500" />} />
                <StatCard label="Prize Pool" value={formatCurrency(qStats.totalPrizePool)} icon={<TrendingUp className="h-4 w-4 text-emerald-500" />} highlight />
                <StatCard label="Active Seasons" value={qStats.activeSeasons.toString()} icon={<BarChart3 className="h-4 w-4 text-purple-500" />} />
              </div>
            </div>
          )}

          {/* No offerings */}
          {!hasVoucher && !hasQuiz && (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground">No voucher or quiz activity for this merchant</p>
            </div>
          )}

          {/* Actions */}
          <Button
            className="w-full h-12 mt-2 touch-manipulation active:scale-[0.97]"
            onClick={() => { onClose(); navigate("/merchant-home/m1"); }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Public Page
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

function StatCard({ label, value, icon, highlight }: { label: string; value: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`p-3 rounded-xl border ${highlight ? "bg-emerald-500/10 border-emerald-500/20" : "bg-muted/30 border-border"}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`text-sm font-bold ${highlight ? "text-emerald-600" : ""}`}>{value}</p>
    </div>
  );
}
