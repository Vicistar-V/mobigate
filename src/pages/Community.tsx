import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CreateCommunityCard } from "@/components/community/CreateCommunityCard";
import { CommunityOwnerCard } from "@/components/community/CommunityOwnerCard";
import { JoinedCommunityRow } from "@/components/community/JoinedCommunityRow";
import { CommunitySettingsSheet } from "@/components/community/settings/CommunitySettingsSheet";
import { CommunityManagePanel } from "@/components/community/CommunityManagePanel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users, Sparkles, Loader2, Search, MapPin,
  ChevronRight, Globe, Settings2, LogOut,
} from "lucide-react";
import { useCommunityList, useCommunityDiscover, joinCommunity, leaveCommunity } from "@/hooks/useCommunity";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Community() {
  const { owned, joined, loading, error, refresh } = useCommunityList();
  const [showSettings,    setShowSettings]    = useState(false);
  const [search,          setSearch]          = useState("");
  const [joiningId,       setJoiningId]       = useState<string | null>(null);
  const [leavingId,       setLeavingId]       = useState<string | null>(null);
  const [selectedOwnedId, setSelectedOwnedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const myIds  = [...owned.map(c => c.id), ...joined.map(c => c.id)];
  const selectedOwned = owned.find(c => c.id === selectedOwnedId) ?? owned[0];

  const { communities: discover, loading: discoverLoading, hasMore, loadMore } =
    useCommunityDiscover(search, myIds);

  const handleJoin = async (communityId: string, membershipChoice: string, name: string) => {
    if (myIds.includes(communityId)) { toast.error("You are already a member"); return; }
    const needsApp = !["voluntary","open","auto",""].includes((membershipChoice || "").toLowerCase());
    if (needsApp) { navigate(`/community/${communityId}/apply`); return; }
    setJoiningId(communityId);
    const res = await joinCommunity(communityId);
    setJoiningId(null);
    if (res.success) { toast.success(`Joined ${name}!`); refresh(); }
    else if (res.error?.includes("already")) toast.error("You are already a member");
    else toast.error(res.error || "Could not join");
  };

  const handleLeave = async (communityId: string, name: string) => {
    if (!confirm(`Leave "${name}"? You can rejoin later.`)) return;
    setLeavingId(communityId);
    const ok = await leaveCommunity(communityId);
    setLeavingId(null);
    if (ok) { toast.success(`Left ${name}`); refresh(); }
    else toast.error("Could not leave community");
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">

        {/* ── My Communities carousel ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">My Communities</h2>
            <Badge variant="secondary" className="ml-1">{owned.length}</Badge>
          </div>
          {owned.length > 0 ? (
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-3">
                <CarouselItem className="pl-2 md:pl-3 basis-[72%] sm:basis-[50%] md:basis-[36%] lg:basis-[25%]">
                  <CreateCommunityCard />
                </CarouselItem>
                {owned.map(c => (
                  <CarouselItem key={c.id} className="pl-2 md:pl-3 basis-[72%] sm:basis-[50%] md:basis-[36%] lg:basis-[25%]">
                    <CommunityOwnerCard community={c as any} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4" />
              <CarouselNext className="hidden md:flex -right-4" />
            </Carousel>
          ) : (
            <div className="flex flex-col items-center py-10 text-center bg-muted/30 rounded-xl border border-dashed">
              <Sparkles className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground mb-4">You don't own any communities yet</p>
              <CreateCommunityCard />
            </div>
          )}
        </section>

        {/* ── Main tabs: Joined | Discover | Manage ── */}
        <section>
          <Tabs defaultValue="discover" className="w-full">

            {/* ── Tab headers ── */}
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden mb-4">
              <TabsList className="w-full h-auto p-0 bg-transparent rounded-none grid grid-cols-3">
                <TabsTrigger
                  value="joined"
                  className={cn(
                    "relative flex flex-col items-center gap-1 py-4 px-2 rounded-none text-muted-foreground",
                    "border-b-2 border-transparent transition-all",
                    "data-[state=active]:text-primary data-[state=active]:border-primary",
                    "data-[state=active]:bg-primary/5 data-[state=active]:shadow-none"
                  )}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs font-semibold">Joined</span>
                  {joined.length > 0 && (
                    <Badge className="absolute top-2 right-2 h-4 px-1 text-[9px] min-w-[16px]">{joined.length}</Badge>
                  )}
                </TabsTrigger>

                <TabsTrigger
                  value="discover"
                  className={cn(
                    "relative flex flex-col items-center gap-1 py-4 px-2 rounded-none border-x border-border text-muted-foreground",
                    "border-b-2 border-b-transparent transition-all",
                    "data-[state=active]:text-primary data-[state=active]:border-b-primary",
                    "data-[state=active]:bg-primary/5 data-[state=active]:shadow-none"
                  )}
                >
                  <Globe className="h-5 w-5" />
                  <span className="text-xs font-semibold">Discover</span>
                </TabsTrigger>

                <TabsTrigger
                  value="manage"
                  disabled={owned.length === 0}
                  className={cn(
                    "relative flex flex-col items-center gap-1 py-4 px-2 rounded-none text-muted-foreground",
                    "border-b-2 border-transparent transition-all",
                    "data-[state=active]:text-primary data-[state=active]:border-primary",
                    "data-[state=active]:bg-primary/5 data-[state=active]:shadow-none",
                    owned.length === 0 && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <Settings2 className="h-5 w-5" />
                  <span className="text-xs font-semibold">Manage</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ── JOINED tab ── */}
            <TabsContent value="joined" className="mt-0 focus-visible:outline-none">
              {joined.length === 0 ? (
                <div className="flex flex-col items-center py-14 text-center bg-muted/20 rounded-xl border border-dashed">
                  <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="font-semibold text-muted-foreground">No communities joined yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Switch to <span className="text-primary font-medium">Discover</span> to explore
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {joined.map(c => (
                    <div key={c.id} className="group relative">
                      <div onClick={() => navigate(`/community/${c.id}`)} className="cursor-pointer">
                        <JoinedCommunityRow community={c as any} />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={leavingId === c.id}
                        onClick={e => { e.stopPropagation(); handleLeave(c.id, c.name); }}
                        className="absolute top-1/2 -translate-y-1/2 right-3 h-7 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        {leavingId === c.id
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : <><LogOut className="h-3 w-3 mr-1" />Leave</>}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ── DISCOVER tab ── */}
            <TabsContent value="discover" className="mt-0 focus-visible:outline-none space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, type, location..."
                  className="pl-9 h-10 bg-card border-muted"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {discoverLoading && !discover.length ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !discover.length ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <Globe className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="font-medium text-muted-foreground">
                    {search ? `No results for "${search}"` : "No communities available"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {discover.map(c => {
                      const isVoluntary = ["voluntary","open","auto",""].includes((c.membershipChoice||"").toLowerCase());
                      const isJoining   = joiningId === c.id;
                      return (
                        <Card key={c.id} className="overflow-hidden group hover:shadow-lg transition-all duration-200 border-border/60">
                          {/* Cover */}
                          <div
                            className="h-36 relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-muted cursor-pointer"
                            onClick={() => navigate(`/community/${c.id}`)}
                          >
                            {c.coverImage
                              ? <img src={c.coverImage} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              : <div className="w-full h-full flex items-center justify-center">
                                  <Users className="h-14 w-14 text-primary/20" />
                                </div>}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                              <h3 className="font-bold text-white text-sm leading-tight drop-shadow line-clamp-1">{c.name}</h3>
                              {c.designation && (
                                <Badge className="text-[9px] bg-white/20 backdrop-blur-sm text-white border-white/30 shrink-0 ml-1">
                                  {c.designation}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <CardContent className="p-4">
                            {c.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{c.description}</p>
                            )}
                            <div className="flex items-center gap-2 flex-wrap mb-4">
                              <Badge variant="secondary" className="text-[10px] h-5 font-normal">{c.type}</Badge>
                              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Users className="h-3 w-3" />{(c.memberCount||0).toLocaleString()} members
                              </span>
                              {c.location && (
                                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                  <MapPin className="h-3 w-3" />{c.location}
                                </span>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Button
                                className={cn("flex-1 h-9 text-sm font-medium", !isVoluntary && "bg-secondary text-secondary-foreground hover:bg-secondary/80")}
                                variant={isVoluntary ? "default" : "secondary"}
                                disabled={isJoining}
                                onClick={() => handleJoin(c.id, c.membershipChoice || "voluntary", c.name)}
                              >
                                {isJoining
                                  ? <Loader2 className="h-4 w-4 animate-spin" />
                                  : isVoluntary ? "Join Free" : "Apply to Join"}
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 shrink-0"
                                onClick={() => navigate(`/community/${c.id}`)}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {hasMore && (
                    <div className="flex justify-center pt-2">
                      <Button variant="outline" onClick={loadMore} disabled={discoverLoading} size="sm">
                        {discoverLoading && <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />}
                        Load more
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* ── MANAGE tab ── */}
            <TabsContent value="manage" className="mt-0 focus-visible:outline-none space-y-4">
              {owned.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {owned.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedOwnedId(c.id)}
                      className={cn(
                        "text-xs px-4 py-2 rounded-full border font-medium transition-all",
                        selectedOwned?.id === c.id
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background border-muted-foreground/20 text-muted-foreground hover:border-primary hover:text-foreground"
                      )}
                    >
                      {c.name.length > 22 ? c.name.slice(0, 22) + "…" : c.name}
                    </button>
                  ))}
                </div>
              )}
              {selectedOwned && (
                <CommunityManagePanel
                  communityId={selectedOwned.id}
                  communityName={selectedOwned.name}
                />
              )}
            </TabsContent>

          </Tabs>
        </section>
      </main>

      <Footer />
      <CommunitySettingsSheet open={showSettings} onOpenChange={setShowSettings} />
    </div>
  );
}
