import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Store, CheckCircle, Star, MapPin, Search, ChevronDown, Globe, Building2, Map, Home } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
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
  const states = useMemo(() => getNigerianStatesForFilter(), []);
  const lgas = useMemo(() => (selectedState ? getLGAsForState(selectedState) : []), [selectedState]);
  const cities = useMemo(() => (selectedLGA ? getCitiesForLGA(selectedLGA) : []), [selectedLGA]);

  const setView = (mode: ViewMode) => {
    setSearchParams({ view: mode });
    setSelectedCountry("");
    setSelectedState("");
    setSelectedLGA("");
    setSelectedCity("");
    setSearchQuery("");
  };

  const filteredMerchants = useMemo(() => {
    let list = allLocationMerchants.filter(m => m.isActive);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
    }

    switch (viewMode) {
      case "country":
        if (selectedCountry) list = list.filter(m => m.countryId === selectedCountry);
        break;
      case "state":
        if (selectedState) list = list.filter(m => m.stateId === selectedState);
        else list = list.filter(m => m.countryId === "ng");
        break;
      case "lga":
        if (selectedLGA) list = list.filter(m => m.lgaId === selectedLGA);
        else if (selectedState) list = list.filter(m => m.stateId === selectedState);
        else list = list.filter(m => m.countryId === "ng");
        break;
      case "city":
        if (selectedCity) list = list.filter(m => m.cityId === selectedCity);
        else if (selectedLGA) list = list.filter(m => m.lgaId === selectedLGA);
        else if (selectedState) list = list.filter(m => m.stateId === selectedState);
        else list = list.filter(m => m.countryId === "ng");
        break;
    }

    return list;
  }, [viewMode, selectedCountry, selectedState, selectedLGA, selectedCity, searchQuery]);

  const ViewIcon = viewModeConfig[viewMode].icon;

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

          {/* Dropdown filters */}
          <div className="flex gap-2 flex-wrap">
            {viewMode === "country" && (
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="h-10 flex-1 min-w-[140px] text-sm">
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

            {(viewMode === "state" || viewMode === "lga" || viewMode === "city") && (
              <Select value={selectedState} onValueChange={v => { setSelectedState(v === "all" ? "" : v); setSelectedLGA(""); setSelectedCity(""); }}>
                <SelectTrigger className="h-10 flex-1 min-w-[130px] text-sm">
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

            {(viewMode === "lga" || viewMode === "city") && selectedState && (
              <Select value={selectedLGA} onValueChange={v => { setSelectedLGA(v === "all" ? "" : v); setSelectedCity(""); }}>
                <SelectTrigger className="h-10 flex-1 min-w-[130px] text-sm">
                  <SelectValue placeholder="All LGAs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All LGAs</SelectItem>
                  {lgas.map(l => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {viewMode === "city" && selectedLGA && (
              <Select value={selectedCity} onValueChange={v => setSelectedCity(v === "all" ? "" : v)}>
                <SelectTrigger className="h-10 flex-1 min-w-[130px] text-sm">
                  <SelectValue placeholder="All Cities" />
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
              <MerchantCard key={merchant.id} merchant={merchant} viewMode={viewMode} onClick={() => navigate(`/merchant-home/${merchant.id}`)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function MerchantCard({ merchant, viewMode, onClick }: { merchant: LocationMerchant; viewMode: ViewMode; onClick: () => void }) {
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
              {viewMode === "country" && <>{merchant.countryFlag} {merchant.countryName}</>}
              {viewMode === "state" && <>{merchant.stateName || merchant.countryName}</>}
              {viewMode === "lga" && <>{merchant.lgaName || merchant.stateName || merchant.countryName}</>}
              {viewMode === "city" && <>{merchant.cityName || merchant.lgaName || merchant.countryName}</>}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
