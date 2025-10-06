import { Header } from "@/components/Header";
import { FeedPost } from "@/components/FeedPost";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Heart, Gift, MessageCircle, MoreVertical, CheckCircle } from "lucide-react";
import { AdCard } from "@/components/AdCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ELibrarySection } from "@/components/ELibrarySection";
import { useState } from "react";
import { getPostsByUserId } from "@/data/posts";
import profileBanner from "@/assets/profile-banner.jpg";
import { WallStatusCarousel } from "@/components/WallStatusCarousel";
import { ProfileAboutTab } from "@/components/ProfileAboutTab";

const Profile = () => {
  const [contentFilter, setContentFilter] = useState<string>("all");
  const [wallStatusFilter, setWallStatusFilter] = useState<string>("all");
  const [wallStatusView, setWallStatusView] = useState<"normal" | "large">("normal");
  
  const userProfile = {
    name: "Amaka Jane Johnson",
    location: "Lagos, Nigeria",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    verified: true,
    status: "Online" as const,
    isFriend: true,
    stats: {
      friends: "4.6k",
      followers: "586",
      following: "421",
      likes: "8.5k",
      gifts: "142",
      contents: "318"
    }
  };

  // Ad data for rotation
  const adSlots = [
    {
      slotId: "profile-slot-1",
      ads: [
        {
          id: "ad-p1-1",
          content: "Premium Content Upgrade - 50% Off!",
          image: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-p1-2",
          content: "New Features Available Now",
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
          duration: 10
        },
      ]
    },
    {
      slotId: "profile-slot-2",
      ads: [
        {
          id: "ad-p2-1",
          content: "Limited Time Offer - Join Premium",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-p2-2",
          content: "Exclusive Member Benefits",
          image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
          duration: 10
        },
      ]
    },
    {
      slotId: "profile-slot-3",
      ads: [
        {
          id: "ad-p3-1",
          content: "Boost Your Reach - Advertise Here",
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-p3-2",
          content: "Connect With More Friends",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
          duration: 10
        },
      ]
    },
  ];

  // Get posts for this specific user (userId from route params would go here)
  const userPosts = getPostsByUserId("1");

  // Filter wall status posts based on media type
  const filteredWallPosts = wallStatusFilter === "all"
    ? userPosts
    : userPosts.filter(post => post.type.toLowerCase() === wallStatusFilter);

  // Filter e-library content posts
  const filteredPosts = contentFilter === "all" 
    ? userPosts 
    : userPosts.filter(post => post.type.toLowerCase() === contentFilter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header Card */}
        <Card className="mb-6 overflow-hidden">
          {/* Profile Banner */}
          <div className="relative h-48 bg-muted">
            <img 
              src={profileBanner} 
              alt="Profile Banner"
              className="w-full h-full object-cover"
            />
            <Button 
              size="sm" 
              className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
            >
              Change Banner
            </Button>
          </div>
          
          <div className="px-6 pb-6">
            {/* Profile Image and Name Row */}
            <div className="flex items-start gap-4 -mt-16 relative mb-6">
              {/* Profile Image */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <img 
                  src={userProfile.profileImage} 
                  alt={userProfile.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-card"
                />
                {userProfile.status === "Online" && (
                  <div className="mt-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Online
                  </div>
                )}
              </div>

              {/* Name and Verified Badge */}
              <div className="flex-1 mt-16">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                  {userProfile.verified && (
                    <CheckCircle className="h-6 w-6 text-emerald-500 fill-emerald-500" />
                  )}
                </div>
                {userProfile.verified && (
                  <p className="text-emerald-600 font-bold italic text-sm">Verified Content Creator</p>
                )}
              </div>
            </div>

            {/* Stats and Other Content */}
            <div className="space-y-3">

              {/* Stats */}
              <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span>
                  <span className="font-bold text-foreground">{userProfile.stats.friends}</span> Friends
                </span>
                <span>|</span>
                <span>
                  <span className="font-bold text-foreground">{userProfile.stats.followers}</span> Followers
                </span>
                <span>|</span>
                <span>
                  <span className="font-bold text-foreground">{userProfile.stats.following}</span> Following
                </span>
                <span>|</span>
                <span>
                  <span className="font-bold text-foreground">{userProfile.stats.likes}</span> Likes
                </span>
                <span>|</span>
                <span>
                  <span className="font-bold text-foreground">{userProfile.stats.gifts}</span> Gifts
                </span>
                <span>|</span>
                <span>
                  <span className="font-bold text-foreground">{userProfile.stats.contents}</span> Contents
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="default" size="sm" className="gap-2 bg-black hover:bg-black/80">
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button size="sm" className="gap-2 bg-yellow-400 hover:bg-yellow-500 text-black">
                  <Heart className="h-4 w-4" />
                  Like
                </Button>
                <Button size="sm" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </Button>
                <Button size="sm" className="gap-2 bg-purple-500 hover:bg-purple-600 text-white">
                  <Gift className="h-4 w-4" />
                  Gift
                </Button>
                <Button size="icon" variant="destructive" className="rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Friend Status */}
              {userProfile.isFriend && (
                <p className="text-emerald-600 font-medium">
                  You are Friends with {userProfile.name}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="status" className="w-full">
          <ScrollArea className="w-full whitespace-nowrap mb-6">
            <TabsList className="inline-flex w-auto">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="contents">Contents</TabsTrigger>
              <TabsTrigger value="gifts">Gifts</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
              <TabsTrigger value="followers">Followers</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="status" className="space-y-6">
            {/* Create Monetized Post */}
            <Card className="p-4 bg-muted/50">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-primary underline">
                  Create a Monetized Post on {userProfile.name.split(' ')[0]}'s Status
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  [{userProfile.name.split(' ')[0]} could turn off this in Privacy Setting]
                </p>
              </div>
            </Card>

            {/* Wall Status */}
            <WallStatusCarousel 
              items={userPosts}
              adSlots={adSlots}
              view={wallStatusView}
              onViewChange={setWallStatusView}
              filter={wallStatusFilter}
              onFilterChange={setWallStatusFilter}
            />

            {/* Feed Posts with Filter */}
            <div className="space-y-0">
              <ELibrarySection activeFilter={contentFilter} onFilterChange={setContentFilter} />
              <div className="space-y-6 mt-6">
                {filteredPosts.map((post, index) => (
                <div key={index}>
                  <FeedPost {...post} />
                  {/* Insert ad after every 5 posts */}
                  {(index + 1) % 5 === 0 && index < filteredPosts.length - 1 && (
                    <div className="my-6">
                      <AdCard />
                    </div>
                  )}
                </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <ProfileAboutTab userName={userProfile.name} />
          </TabsContent>

          <TabsContent value="friends">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Friends</h2>
              <p className="text-muted-foreground">Friends list will be displayed here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="contents">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contents</h2>
              <p className="text-muted-foreground">User contents will be displayed here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="gifts">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Gifts</h2>
              <p className="text-muted-foreground">Gifts received will be displayed here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="likes">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Likes</h2>
              <p className="text-muted-foreground">Liked posts will be displayed here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="followers">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Followers</h2>
              <p className="text-muted-foreground">Followers list will be displayed here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="following">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Following</h2>
              <p className="text-muted-foreground">Following list will be displayed here.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
