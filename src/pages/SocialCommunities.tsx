// src/pages/SocialCommunities.tsx  — Main community discovery page (replaces "Discover" tab)
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Users, Sparkles, Loader2, Search, MapPin, Globe, ChevronRight,
  SlidersHorizontal, BookmarkCheck, Settings2, Plus, X, Filter,
} from "lucide-react";
import { useCommunityList, useCommunityDiscover, joinCommunity } from "@/hooks/useCommunity";
import { COUNTRIES, SORT_OPTIONS, getStatesByCountry, getLGAsByState } from "@/data/locationData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Navigation shortcut cards ──────────────────────────────────────────────────
const NAV_CARDS = [
  { icon: Sparkles,    label: "My Communities",     path: "/community/my",     color: "bg-primary/10 text-primary" },
  { icon: BookmarkCheck, label: "Joined Communities", path: "/community/joined", color: "bg-green-500/10 text-green-600" },
  { icon: Settings2,   label: "Manage Communities", path: "/community/manage",  color: "bg-amber-500/10 text-amber-600" },
  { icon: Plus,        label: "Create Community",   path: "/create-community", color: "bg-purple-500/10 text-purple-600" },
];

export default function SocialCommunities() {
  const navigate = useNavigate();
  const { owned, joined } = useCommunityList();
  const myIds = [...owned.map(c => c.id), ...joined.map(c => c.id)];

  const [search,    setSearch]    = useState("");
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter state
  const [sortBy,   setSortBy]   = useState("popular");
  const [country,  setCountry]  = useState("");
  const [state,    setState]    = useState("");
  const [lga,      setLga]      = useState("");

  const states = getStatesByCountry(country);
  const lgas   = getLGAsByState(country, state);

  const locationFilter = [country, state, lga].filter(Boolean).join(", ");
  const combinedSearch = [search, locationFilter].filter(Boolean).join(" ");

  const { communities: discover, loading, hasMore, loadMore } =
    useCommunityDiscover(combinedSearch, myIds);

  // Sort communities
  const sorted = [...discover].sort((a, b) => {
    if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
    if (sortBy === "members") return (b.memberCount || 0) - (a.memberCount || 0);
    if (sortBy === "newest") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    if (sortBy === "oldest") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    return 0; // popular = API default
  });

  const handleJoin = async (communityId: string, membershipChoice: string, name: string) => {
    if (myIds.includes(communityId)) { toast.error("Already a member"); return; }
    const needsApp = !["voluntary","open","auto",""].includes((membershipChoice||"").toLowerCase());
    if (needsApp) { navigate(`/community/${communityId}/apply`); return; }
    setJoiningId(communityId);
    const res = await joinCommunity(communityId);
    setJoiningId(null);
    if (res.success) toast.success(`Joined ${name}!`);
    else toast.error(res.error || "Could not join");
  };

  const clearFilters = () => { setCountry(""); setState(""); setLga(""); setSortBy("popular"); };
  const activeFilters = [country, state, lga, sortBy !== "popular" ? sortBy : ""].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6 max-w-4xl">

        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Social Communities
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Discover and join communities from around the world</p>
        </div>

        {/* Quick nav cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {NAV_CARDS.map(n => (
            <button key={n.path} onClick={() => navigate(n.path)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:shadow-md transition-all active:scale-95 touch-manipulation">
              <div className={`p-2.5 rounded-xl ${n.color}`}>
                <n.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-center leading-tight">{n.label}</span>
            </button>
          ))}
        </div>

        {/* Search + filter row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search communities by name, type..." className="pl-9 h-11 bg-card"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" className="h-11 px-3 shrink-0 relative" onClick={() => setFilterOpen(true)}>
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilters > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[9px] rounded-full flex items-center justify-center font-bold">
                {activeFilters}
              </span>
            )}
          </Button>
        </div>

        {/* Active filter chips */}
        {(country || state || lga || sortBy !== "popular") && (
          <div className="flex flex-wrap gap-2 items-center">
            {country && <Badge variant="secondary" className="gap-1 pr-1">{country}<button onClick={() => { setCountry(""); setState(""); setLga(""); }}><X className="h-3 w-3" /></button></Badge>}
            {state && <Badge variant="secondary" className="gap-1 pr-1">{state}<button onClick={() => { setState(""); setLga(""); }}><X className="h-3 w-3" /></button></Badge>}
            {lga && <Badge variant="secondary" className="gap-1 pr-1">{lga}<button onClick={() => setLga("")}><X className="h-3 w-3" /></button></Badge>}
            {sortBy !== "popular" && <Badge variant="secondary" className="gap-1 pr-1">{SORT_OPTIONS.find(s=>s.value===sortBy)?.label}<button onClick={() => setSortBy("popular")}><X className="h-3 w-3" /></button></Badge>}
            <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-destructive underline">Clear all</button>
          </div>
        )}

        {/* Results */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              {loading ? "Searching…" : `${sorted.length} communit${sorted.length === 1 ? "y" : "ies"} found`}
            </p>
          </div>

          {loading && !sorted.length ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : !sorted.length ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Globe className="h-14 w-14 text-muted-foreground/30 mb-3" />
              <p className="font-semibold text-muted-foreground">No communities found</p>
              <p className="text-sm text-muted-foreground mt-1">{search || country ? "Try adjusting your filters" : "Be the first to create one!"}</p>
              <Button className="mt-4" onClick={() => navigate("/create-community")}>
                <Plus className="h-4 w-4 mr-2" /> Create Community
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {sorted.map(c => {
                  const isVoluntary = ["voluntary","open","auto",""].includes((c.membershipChoice||"").toLowerCase());
                  const isJoining = joiningId === c.id;
                  const isMember = myIds.includes(c.id);
                  return (
                    <Card key={c.id} className="overflow-hidden hover:shadow-lg transition-all border-border/60">
                      <div className="h-36 relative overflow-hidden bg-gradient-to-br from-primary/20 to-muted cursor-pointer"
                        onClick={() => navigate(`/community/${c.id}`)}>
                        {c.coverImage
                          ? <img src={c.coverImage} alt={c.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                          : <div className="w-full h-full flex items-center justify-center"><Users className="h-14 w-14 text-primary/20" /></div>}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                          <h3 className="font-bold text-white text-sm line-clamp-1 drop-shadow">{c.name}</h3>
                          {c.designation && <Badge className="text-[9px] bg-white/20 backdrop-blur text-white border-white/30 ml-1 shrink-0">{c.designation}</Badge>}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        {c.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{c.description}</p>}
                        <div className="flex items-center gap-2 flex-wrap mb-4">
                          <Badge variant="secondary" className="text-[10px] h-5">{c.type}</Badge>
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Users className="h-3 w-3" />{(c.memberCount||0).toLocaleString()}
                          </span>
                          {c.location && <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3" />{c.location}</span>}
                        </div>
                        <div className="flex gap-2">
                          {isMember ? (
                            <Button variant="secondary" className="flex-1 h-9 text-sm" onClick={() => navigate(`/community/${c.id}`)}>
                              View Community
                            </Button>
                          ) : (
                            <Button
                              className={cn("flex-1 h-9 text-sm", !isVoluntary && "bg-secondary text-secondary-foreground hover:bg-secondary/80")}
                              variant={isVoluntary ? "default" : "secondary"}
                              disabled={isJoining}
                              onClick={() => handleJoin(c.id, c.membershipChoice || "voluntary", c.name)}
                            >
                              {isJoining ? <Loader2 className="h-4 w-4 animate-spin" /> : isVoluntary ? "Join Free" : "Apply to Join"}
                            </Button>
                          )}
                          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => navigate(`/community/${c.id}`)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={loadMore} disabled={loading} size="sm">
                    {loading && <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />}Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />

      {/* ── Advanced Filter Sheet ── */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl flex flex-col p-0">
          <SheetTitle className="sr-only">Advanced Filters</SheetTitle>
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-base">Advanced Filters</h2>
              {activeFilters > 0 && <Badge className="text-xs">{activeFilters} active</Badge>}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFilterOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Sort */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Sort By</Label>
              <div className="grid grid-cols-2 gap-2">
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setSortBy(opt.value)}
                    className={cn("py-2 px-3 rounded-lg border text-sm font-medium transition-all",
                      sortBy === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/50")}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Filter by Country</Label>
              <Select
                value={country || "all"}
                onValueChange={v => { setCountry(v === "all" ? "" : v); setState(""); setLga(""); }}
              >
                <SelectTrigger className="h-11"><SelectValue placeholder="Select country…" /></SelectTrigger>
                <SelectContent className="max-h-64">
                  <SelectItem value="all">All Countries</SelectItem>
                  {COUNTRIES.map(c => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* State */}
            {country && states.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Filter by State / Province</Label>
                <Select
                  value={state || "all"}
                  onValueChange={v => { setState(v === "all" ? "" : v); setLga(""); }}
                >
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select state…" /></SelectTrigger>
                  <SelectContent className="max-h-64">
                    <SelectItem value="all">All States</SelectItem>
                    {states.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* LGA — Nigeria only */}
            {country === "Nigeria" && state && lgas.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Filter by Local Government Area</Label>
                <Select
                  value={lga || "all"}
                  onValueChange={v => setLga(v === "all" ? "" : v)}
                >
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select LGA…" /></SelectTrigger>
                  <SelectContent className="max-h-64">
                    <SelectItem value="all">All LGAs</SelectItem>
                    {lgas.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="p-4 border-t space-y-2 shrink-0">
            <Button className="w-full h-11" onClick={() => setFilterOpen(false)}>
              Apply Filters {activeFilters > 0 && `(${activeFilters})`}
            </Button>
            {activeFilters > 0 && (
              <Button variant="outline" className="w-full h-10" onClick={clearFilters}>
                Clear All Filters
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}