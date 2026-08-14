// src/pages/community/MyCommunities.tsx
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CreateCommunityCard } from "@/components/community/CreateCommunityCard";
import { CommunityOwnerCard } from "@/components/community/CommunityOwnerCard";
import { Loader2, Sparkles, ArrowLeft, Users, Settings2, Plus } from "lucide-react";
import { useCommunityList } from "@/hooks/useCommunity";

export default function MyCommunities() {
  const navigate = useNavigate();
  const { owned, loading } = useCommunityList();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        {/* Back */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate("/community")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> My Communities
            </h1>
            <p className="text-xs text-muted-foreground">Communities you created or own</p>
          </div>
          <Badge variant="secondary" className="ml-auto">{owned.length}</Badge>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3">
          <Button className="flex-1 gap-2" onClick={() => navigate("/create-community")}>
            <Plus className="h-4 w-4" /> Create Community
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => navigate("/community/manage")}>
            <Settings2 className="h-4 w-4" /> Manage
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : owned.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center bg-muted/20 rounded-xl border border-dashed">
            <Sparkles className="h-14 w-14 text-muted-foreground/30 mb-4" />
            <p className="font-semibold text-muted-foreground">No communities yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first community and start connecting</p>
            <Button className="mt-4 gap-2" onClick={() => navigate("/create-community")}>
              <Plus className="h-4 w-4" /> Create Community
            </Button>
          </div>
        ) : (
          <section className="space-y-4">
            {/* Carousel for mobile */}
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="-ml-2">
                <CarouselItem className="pl-2 basis-[80%] sm:basis-[48%] md:basis-[36%] lg:basis-[28%]">
                  <CreateCommunityCard />
                </CarouselItem>
                {owned.map(c => (
                  <CarouselItem key={c.id} className="pl-2 basis-[80%] sm:basis-[48%] md:basis-[36%] lg:basis-[28%]">
                    <CommunityOwnerCard community={c as any} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4" />
              <CarouselNext className="hidden md:flex -right-4" />
            </Carousel>

            {/* List view */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">All ({owned.length})</p>
              {owned.map(c => (
                <Card key={c.id} className="overflow-hidden hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/community/${c.id}`)}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl overflow-hidden bg-muted shrink-0">
                      {c.logo
                        ? <img src={c.logo} alt={c.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Users className="h-5 w-5 text-muted-foreground" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />{(c.memberCount||0).toLocaleString()} members
                        <Badge variant="secondary" className="text-[9px] h-4 ml-1">{c.type}</Badge>
                      </p>
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8 shrink-0"
                      onClick={e => { e.stopPropagation(); navigate(`/community/${c.id}`); }}>
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
