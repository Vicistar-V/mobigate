import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Store, CheckCircle, Star, MapPin, Search, Globe, Building2, Map, Home, Package, ShoppingBag, Warehouse, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  allLocationMerchants,
  getUniqueCountries,
  getNigerianStatesForFilter,
  getLGAsForState,
  getCitiesForLGA,
  type LocationMerchant,
} from "@/data/nigerianLocationsData";

type ViewMode = "country" | "state" | "lga" | "city";
type MerchantType = "retail" | "bulk";

const viewModeConfig: Record<ViewMode, { label: string; icon: any; description: string }> = {
  country: { label: "By Country", icon: Globe, description: "Browse merchants grouped by country" },
  state: { label: "By State", icon: Building2, description: "Browse merchants in Nigerian states" },
  lga: { label: "By LGA", icon: Map, description: "Browse merchants by local government area" },
  city: { label: "By City", icon: Home, description: "Browse merchants by city or town" },
};

const typeConfig: Record<MerchantType, {
  title: string;
  subtitle: string;
  icon: any;
  accentClass: string;
  borderClass: string;
  badgeLabel: string;
  emptyTitle: string;
  emptySubtitle: string;
  discountLabel: string;
}> = {
  retail: {
    title: "Retail Merchants",
    subtitle: "Individual & small-scale voucher resellers near you",
    icon: ShoppingBag,
    accentClass: "text-emerald-600",
    borderClass: "border-l-emerald-500/70",
    badgeLabel: "Retail",
    emptyTitle: "No retail merchants found",
    emptySubtitle: "Try broadening your location filters",
    discountLabel: "Retail Discount",
  },
  bulk: {
    title: "Bulk Merchants",
    subtitle: "Major distributors & wholesale voucher suppliers",
    icon: Warehouse,
    accentClass: "text-primary",
    borderClass: "border-l-primary/70",
    badgeLabel: "Bulk",
    emptyTitle: "No bulk merchants found",
    emptySubtitle: "Try broadening your location filters",
    discountLabel: "Bulk Discount",
  },
};

export default function MerchantListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const applyMode = searchParams.get("mode") === "apply";
  const merchantType: MerchantType = (searchParams.get("type") as MerchantType) || "bulk";
  const viewMode = (searchParams.get("view") as ViewMode) || "country";
  const config = typeConfig[merchantType];
  const TypeIcon = config.icon;

  const [selectedCountry, setSelectedCountry] = useState(searchParams.get("country") || "");
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "");
  const [selectedLGA, setSelectedLGA] = useState(searchParams.get("lga") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
  const [searchQuery, setSearchQuery] = useState("");

  const countries = useMemo(() => getUniqueCountries(), []);
  const isNigeria = selectedCountry === "ng" || !selectedCountry;
  const states = useMemo(() => isNigeria ? getNigerianStatesForFilter() : [], [isNigeria]);
  const lgas = useMemo(() => getLGAsForState(selectedState || undefined), [selectedState]);
  const cities = useMemo(() => getCitiesForLGA(selectedLGA || undefined, selectedState || undefined), [selectedLGA, selectedState]);

  const setView = (mode: ViewMode) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", mode);
    setSearchParams(params);
    if (mode === "country") { setSelectedState(""); setSelectedLGA(""); setSelectedCity(""); }
    else if (mode === "state") { setSelectedLGA(""); setSelectedCity(""); }
    else if (mode === "lga") { setSelectedCity(""); }
  };

  const handleCountryChange = (v: string) => {
    setSelectedCountry(v === "all" ? "" : v);
    setSelectedState(""); setSelectedLGA(""); setSelectedCity("");
  };
  const handleStateChange = (v: string) => {
    setSelectedState(v === "all" ? "" : v);
    setSelectedLGA(""); setSelectedCity("");
  };
  const handleLGAChange = (v: string) => {
    setSelectedLGA(v === "all" ? "" : v);
    setSelectedCity("");
  };
  const handleCityChange = (v: string) => {
    setSelectedCity(v === "all" ? "" : v);
  };

  const filteredMerchants = useMemo(() => {
    let list = allLocationMerchants.filter(m => m.isActive && m.merchantType === merchantType);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
    }
    if (selectedCity) list = list.filter(m => m.cityId === selectedCity);
    else if (selectedLGA) list = list.filter(m => m.lgaId === selectedLGA);
    else if (selectedState) list = list.filter(m => m.stateId === selectedState);
    else if (selectedCountry) list = list.filter(m => m.countryId === selectedCountry);

    return list;
  }, [selectedCountry, selectedState, selectedLGA, selectedCity, searchQuery, merchantType]);

  const showState = viewMode === "state" || viewMode === "lga" || viewMode === "city";
  const showLGA = viewMode === "lga" || viewMode === "city";
  const showCity = viewMode === "city";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex-1 overflow-y-auto">
        {/* Context-aware header */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2.5 mb-1">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${merchantType === "retail" ? "bg-emerald-500/10" : "bg-primary/10"}`}>
              <TypeIcon className={`h-5 w-5 ${config.accentClass}`} />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight">
                {applyMode ? "Apply as Sub-Merchant" : config.title}
              </h1>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                {applyMode ? "Select a merchant to apply" : config.subtitle}
              </p>
            </div>
          </div>

          {/* Type indicator pill */}
          {!applyMode && (
            <div className="flex items-center gap-2 mt-2.5">
              <Badge
                variant="outline"
                className={`text-xs px-2.5 py-1 ${merchantType === "retail"
                  ? "bg-emerald-500/10 text-emerald-700 border-emerald-300"
                  : "bg-primary/10 text-primary border-primary/30"
                }`}
              >
                {merchantType === "retail" ? <ShoppingBag className="h-3 w-3 mr-1" /> : <Warehouse className="h-3 w-3 mr-1" />}
                {config.badgeLabel}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {filteredMerchants.length} {merchantType === "retail" ? "retail" : "bulk"} merchant{filteredMerchants.length !== 1 ? "s" : ""} found
              </span>
            </div>
          )}
        </div>

        {/* View Mode Tabs */}
        <div className="px-4 py-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
            {(Object.keys(viewModeConfig) as ViewMode[]).map(mode => {
              const conf = viewModeConfig[mode];
              const Icon = conf.icon;
              const active = viewMode === mode;
              return (
                <button
                  key={mode}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap shrink-0 touch-manipulation active:scale-95 transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => setView(mode)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {conf.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-2 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${merchantType} merchants...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
            <Select value={selectedCountry || "all"} onValueChange={handleCountryChange}>
              <SelectTrigger className="h-9 w-auto min-w-[100px] max-w-[140px] rounded-full text-xs border-primary/30 bg-primary/5 shrink-0 touch-manipulation">
                <Globe className="h-3.5 w-3.5 mr-1 shrink-0" />
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.flag} {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {showState && isNigeria && states.length > 0 && (
              <Select value={selectedState || "all"} onValueChange={handleStateChange}>
                <SelectTrigger className="h-9 w-auto min-w-[90px] max-w-[130px] rounded-full text-xs border-primary/30 bg-primary/5 shrink-0 touch-manipulation">
                  <Building2 className="h-3.5 w-3.5 mr-1 shrink-0" />
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {showState && !isNigeria && selectedCountry && (
              <div className="flex items-center shrink-0">
                <p className="text-xs text-muted-foreground italic whitespace-nowrap">States: Nigeria only</p>
              </div>
            )}

            {showLGA && isNigeria && lgas.length > 0 && (
              <Select value={selectedLGA || "all"} onValueChange={handleLGAChange}>
                <SelectTrigger className="h-9 w-auto min-w-[80px] max-w-[130px] rounded-full text-xs border-primary/30 bg-primary/5 shrink-0 touch-manipulation">
                  <Map className="h-3.5 w-3.5 mr-1 shrink-0" />
                  <SelectValue placeholder="LGA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All LGAs</SelectItem>
                  {lgas.map(l => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {showCity && isNigeria && cities.length > 0 && (
              <Select value={selectedCity || "all"} onValueChange={handleCityChange}>
                <SelectTrigger className="h-9 w-auto min-w-[80px] max-w-[120px] rounded-full text-xs border-primary/30 bg-primary/5 shrink-0 touch-manipulation">
                  <Home className="h-3.5 w-3.5 mr-1 shrink-0" />
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Merchant List */}
        <div className="px-4 pb-6 space-y-2">
          {filteredMerchants.length === 0 ? (
            <div className="py-12 text-center">
              <TypeIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">{config.emptyTitle}</p>
              <p className="text-xs text-muted-foreground mt-1">{config.emptySubtitle}</p>
            </div>
          ) : (
            filteredMerchants.map(merchant => (
              <MerchantCard
                key={merchant.id}
                merchant={merchant}
                merchantType={merchantType}
                borderClass={config.borderClass}
                discountLabel={config.discountLabel}
                onClick={() => navigate(applyMode ? `/apply-sub-merchant/${merchant.id}` : `/merchant-home/${merchant.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function getMerchantOfferings(merchantId: string): { hasQuiz: boolean; hasVoucher: boolean } {
  const hash = merchantId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const mod = hash % 3;
  if (mod === 0) return { hasQuiz: true, hasVoucher: true };
  if (mod === 1) return { hasQuiz: true, hasVoucher: false };
  return { hasQuiz: false, hasVoucher: true };
}

function MerchantCard({
  merchant,
  merchantType,
  borderClass,
  discountLabel,
  onClick,
}: {
  merchant: LocationMerchant;
  merchantType: MerchantType;
  borderClass: string;
  discountLabel: string;
  onClick: () => void;
}) {
  const { hasQuiz, hasVoucher } = getMerchantOfferings(merchant.id);

  return (
    <Card
      className={`p-3 cursor-pointer active:scale-[0.98] transition-transform touch-manipulation border-l-4 ${borderClass}`}
      onClick={onClick}
    >
      {/* Row 1: Avatar + Name + Verified */}
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11 shrink-0 border-2 border-primary/20">
          <AvatarImage src={merchant.logo} alt={merchant.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">{merchant.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-1.5">
            <p className="text-sm font-semibold leading-snug break-words">{merchant.name}</p>
            {merchant.isVerified && <CheckCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{merchant.category}</p>
        </div>
      </div>

      {/* Row 2: Location — full width below avatar row */}
      <div className="flex items-center gap-1 mt-2 pl-0.5">
        <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground leading-snug">
          {[merchant.cityName, merchant.stateName, `${merchant.countryFlag} ${merchant.countryName}`].filter(Boolean).join(", ")}
        </span>
      </div>

      {/* Row 3: Badges — wrapped */}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        {/* Type badge */}
        <Badge
          variant="outline"
          className={`text-xs h-5 px-1.5 ${
            merchantType === "retail"
              ? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
              : "bg-blue-500/10 text-blue-700 border-blue-200"
          }`}
        >
          {merchantType === "retail" ? "🏪 Retail" : "🏢 Bulk"}
        </Badge>

        {/* Rating */}
        <Badge variant="secondary" className="text-xs h-5 px-1.5 gap-0.5">
          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
          {merchant.rating}
        </Badge>

        {/* Discount */}
        {merchant.discountPercent > 0 && (
          <Badge variant="secondary" className="text-xs h-5 px-1.5">
            {merchant.discountPercent}% {merchantType === "retail" ? "off" : "discount"}
          </Badge>
        )}

        {hasQuiz && (
          <Badge className="text-xs h-5 px-1.5 bg-amber-500/15 text-amber-700 border-amber-300" variant="outline">
            🎮 Quiz
          </Badge>
        )}
        {hasVoucher && (
          <Badge className="text-xs h-5 px-1.5 bg-emerald-500/15 text-emerald-700 border-emerald-300" variant="outline">
            🎟️ Voucher
          </Badge>
        )}
      </div>
    </Card>
  );
}
