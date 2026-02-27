import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Store, CheckCircle, Star, MapPin, Search, Globe, Building2, Map, Home } from "lucide-react";
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

const viewModeConfig: Record<ViewMode, { label: string; icon: any; description: string }> = {
  country: { label: "By Country", icon: Globe, description: "Browse merchants grouped by country" },
  state: { label: "By State / Province", icon: Building2, description: "Browse merchants in Nigerian states" },
  lga: { label: "By LGA / County", icon: Map, description: "Browse merchants by local government area" },
  city: { label: "By City / Town", icon: Home, description: "Browse merchants by city or town" },
};

export default function MerchantListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const viewMode = (searchParams.get("view") as ViewMode) || "country";
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

  // Switching tabs just changes filter depth — selections are preserved
  const setView = (mode: ViewMode) => {
    setSearchParams({ view: mode });
    // Only clear filters BELOW the new view level
    if (mode === "country") { setSelectedState(""); setSelectedLGA(""); setSelectedCity(""); }
    else if (mode === "state") { setSelectedLGA(""); setSelectedCity(""); }
    else if (mode === "lga") { setSelectedCity(""); }
  };

  const handleCountryChange = (v: string) => {
    setSelectedCountry(v === "all" ? "" : v);
    setSelectedState("");
    setSelectedLGA("");
    setSelectedCity("");
  };

  const handleStateChange = (v: string) => {
    setSelectedState(v === "all" ? "" : v);
    setSelectedLGA("");
    setSelectedCity("");
  };

  const handleLGAChange = (v: string) => {
    setSelectedLGA(v === "all" ? "" : v);
    setSelectedCity("");
  };

  const handleCityChange = (v: string) => {
    setSelectedCity(v === "all" ? "" : v);
  };

  const filteredMerchants = useMemo(() => {
    let list = allLocationMerchants.filter(m => m.isActive);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
    }

    // Apply cascading filters — most specific filter wins
    if (selectedCity) {
      list = list.filter(m => m.cityId === selectedCity);
    } else if (selectedLGA) {
      list = list.filter(m => m.lgaId === selectedLGA);
    } else if (selectedState) {
      list = list.filter(m => m.stateId === selectedState);
    } else if (selectedCountry) {
      list = list.filter(m => m.countryId === selectedCountry);
    }

    return list;
  }, [selectedCountry, selectedState, selectedLGA, selectedCity, searchQuery]);

  // Determine which dropdowns to show based on view mode
  const showCountry = true; // Always show country
  const showState = viewMode === "state" || viewMode === "lga" || viewMode === "city";
  const showLGA = viewMode === "lga" || viewMode === "city";
  const showCity = viewMode === "city";

  // Check if Nigeria is selected (states/LGA/city only available for Nigeria)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <div className="flex-1 overflow-y-auto">
        {/* Page Title */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <Store className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold">View Merchants</h1>
          </div>
          <p className="text-sm text-muted-foreground">{viewModeConfig[viewMode].description}</p>
        </div>

        {/* View Mode Tabs — horizontal scroll */}
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
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search merchants..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
            />
          </div>

          {/* Cascading Dropdown filters — stacked vertically for mobile */}
          <div className="space-y-2">
            {/* Country — always visible */}
            {showCountry && (
              <Select value={selectedCountry || "all"} onValueChange={handleCountryChange}>
                <SelectTrigger className="h-11 w-full text-sm touch-manipulation">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.flag} {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* State — show when tab is state/lga/city AND Nigeria is selected or no country selected */}
            {showState && isNigeria && states.length > 0 && (
              <Select value={selectedState || "all"} onValueChange={handleStateChange}>
                <SelectTrigger className="h-11 w-full text-sm touch-manipulation">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* State hint for non-Nigeria */}
            {showState && !isNigeria && selectedCountry && (
              <p className="text-xs text-muted-foreground italic px-1">
                State/Province data is currently available for Nigeria only. Select 🇳🇬 Nigeria to browse by state.
              </p>
            )}

            {/* LGA — show when tab is lga/city, always available (shows all if no state selected) */}
            {showLGA && isNigeria && lgas.length > 0 && (
              <Select value={selectedLGA || "all"} onValueChange={handleLGAChange}>
                <SelectTrigger className="h-11 w-full text-sm touch-manipulation">
                  <SelectValue placeholder="All LGAs / Counties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All LGAs / Counties</SelectItem>
                  {lgas.map(l => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* City — show when tab is city, always available (shows all if no LGA selected) */}
            {showCity && isNigeria && cities.length > 0 && (
              <Select value={selectedCity || "all"} onValueChange={handleCityChange}>
                <SelectTrigger className="h-11 w-full text-sm touch-manipulation">
                  <SelectValue placeholder="All Cities / Towns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities / Towns</SelectItem>
                  {cities.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="px-4 py-1">
          <p className="text-xs text-muted-foreground">{filteredMerchants.length} merchant{filteredMerchants.length !== 1 ? "s" : ""} found</p>
        </div>

        {/* Merchant List */}
        <div className="px-4 pb-6 space-y-2">
          {filteredMerchants.length === 0 ? (
            <div className="py-12 text-center">
              <Store className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No merchants found</p>
              <p className="text-xs text-muted-foreground mt-1">Try changing your filters</p>
            </div>
          ) : (
            filteredMerchants.map(merchant => (
              <MerchantCard key={merchant.id} merchant={merchant} onClick={() => navigate(`/merchant-home/m1`)} />
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

function MerchantCard({ merchant, onClick }: { merchant: LocationMerchant; onClick: () => void }) {
  const { hasQuiz, hasVoucher } = getMerchantOfferings(merchant.id);

  return (
    <Card
      className="p-3 cursor-pointer active:scale-[0.98] transition-transform touch-manipulation border-l-4 border-l-primary/60"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 shrink-0 border-2 border-primary/20">
          <AvatarImage src={merchant.logo} alt={merchant.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">{merchant.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold truncate">{merchant.name}</p>
            {merchant.isVerified && <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />}
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
              {merchant.cityName && <>{merchant.cityName}, </>}
              {merchant.stateName && <>{merchant.stateName}, </>}
              {merchant.countryFlag} {merchant.countryName}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            {hasQuiz && (
              <Badge className="text-[10px] h-[18px] px-1.5 bg-amber-500/15 text-amber-700 border-amber-300 hover:bg-amber-500/20" variant="outline">
                🎮 Quiz Game
              </Badge>
            )}
            {hasVoucher && (
              <Badge className="text-[10px] h-[18px] px-1.5 bg-emerald-500/15 text-emerald-700 border-emerald-300 hover:bg-emerald-500/20" variant="outline">
                🎟️ Voucher
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
