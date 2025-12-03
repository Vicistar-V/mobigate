import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CreateCommunityCard } from "@/components/community/CreateCommunityCard";
import { CommunityOwnerCard } from "@/components/community/CommunityOwnerCard";
import { JoinedCommunityRow } from "@/components/community/JoinedCommunityRow";
import { getOwnedCommunities, getJoinedCommunities } from "@/data/communityData";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Users, Sparkles } from "lucide-react";
import { ViewToggleButton, ViewMode } from "@/components/ui/ViewToggleButton";

export default function Community() {
  const ownedCommunities = getOwnedCommunities();
  const joinedCommunities = getJoinedCommunities();
  const [communitiesViewMode, setCommunitiesViewMode] = useState<ViewMode>("carousel");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 space-y-8">
        {/* Section 1: My Communities (Owned) - Carousel/Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                My Communities
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Communities you own and manage
              </p>
            </div>
            {ownedCommunities.length > 0 && (
              <ViewToggleButton view={communitiesViewMode} onViewChange={setCommunitiesViewMode} />
            )}
          </div>

          {ownedCommunities.length > 0 ? (
            communitiesViewMode === "carousel" ? (
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {/* Create New Card - Always First */}
                  <CarouselItem className="pl-2 md:pl-4 basis-[75%] sm:basis-[60%] md:basis-[45%] lg:basis-[30%]">
                    <CreateCommunityCard />
                  </CarouselItem>

                  {/* Owned Communities */}
                  {ownedCommunities.map((community) => (
                    <CarouselItem 
                      key={community.id}
                      className="pl-2 md:pl-4 basis-[75%] sm:basis-[60%] md:basis-[45%] lg:basis-[30%]"
                    >
                      <CommunityOwnerCard community={community} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-4" />
                <CarouselNext className="hidden md:flex -right-4" />
              </Carousel>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <CreateCommunityCard />
                {ownedCommunities.map((community) => (
                  <CommunityOwnerCard key={community.id} community={community} />
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-accent/5 rounded-lg border border-dashed border-border">
              <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                You don't own any communities yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your first community to get started
              </p>
              <div className="mt-6">
                <CreateCommunityCard />
              </div>
            </div>
          )}
        </section>

        {/* Section 2: Communities I Joined - Vertical List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Communities I Joined
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {joinedCommunities.length} communit{joinedCommunities.length !== 1 ? 'ies' : 'y'}
              </p>
            </div>
          </div>

          {joinedCommunities.length > 0 ? (
            <div className="space-y-3">
              {joinedCommunities.map((community) => (
                <JoinedCommunityRow key={community.id} community={community} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-accent/5 rounded-lg border border-dashed border-border">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                You haven't joined any communities yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Explore and join communities to connect with others
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
