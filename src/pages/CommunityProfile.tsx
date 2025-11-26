import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeedPost } from "@/components/FeedPost";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  MessageCircle,
  Share2,
  Camera,
  UserPlus,
  UserMinus,
  DollarSign,
} from "lucide-react";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { WallStatusCarousel } from "@/components/WallStatusCarousel";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { ELibrarySection } from "@/components/ELibrarySection";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { useToast } from "@/hooks/use-toast";
import { Post, wallStatusPosts, feedPosts } from "@/data/posts";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PremiumAdCardProps } from "@/components/PremiumAdCard";
import { getCommunityById, getCommunityPosts } from "@/data/communityProfileData";
import { CommunityAboutTab } from "@/components/community/CommunityAboutTab";
import { CommunityMembershipTab } from "@/components/community/CommunityMembershipTab";
import { CommunityQuickLinks } from "@/components/community/CommunityQuickLinks";
import { CommunityMainMenu } from "@/components/community/CommunityMainMenu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect } from "react";

const CommunityProfile = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const [activeTab, setActiveTab] = useState<string>("status");
  const [contentFilter, setContentFilter] = useState<string>("all");
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [visiblePostCount, setVisiblePostCount] = useState(20);
  const [wallStatusFilter, setWallStatusFilter] = useState<string>("all");
  const [wallStatusView, setWallStatusView] = useState<"normal" | "large">("normal");
  const { toast } = useToast();
  const tabsSectionRef = useRef<HTMLDivElement>(null);

  // Get community data
  const community = getCommunityById(communityId || "1");
  const communityPosts = getCommunityPosts(communityId || "1");

  // Convert wall status posts to Post format for WallStatusCarousel (same as Index.tsx)
  const wallStatusPostsForCarousel = wallStatusPosts.map(post => ({
    id: post.id,
    title: post.title || "Wall Status",
    subtitle: post.description,
    description: post.description,
    author: post.author,
    authorProfileImage: post.authorImage,
    userId: "community",
    status: "Online" as const,
    views: "0",
    comments: String(post.comments),
    likes: String(post.likes),
    type: post.type === "video" ? "Video" as const : "Photo" as const,
    imageUrl: post.url,
    isOwner: false
  }));

  // Ad slot data (same as Index.tsx)
  const adSlots = [
    {
      slotId: "community-slot-1",
      ads: [
        {
          id: "ad-c1-1",
          content: "Premium Content Upgrade - 50% Off!",
          image: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-c1-2",
          content: "New Features Available Now",
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
          duration: 10
        },
      ]
    },
    {
      slotId: "community-slot-2",
      ads: [
        {
          id: "ad-c2-1",
          content: "Limited Time Offer - Join Premium",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-c2-2",
          content: "Exclusive Member Benefits",
          image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
          duration: 10
        },
      ]
    },
    {
      slotId: "community-slot-3",
      ads: [
        {
          id: "ad-c3-1",
          content: "Boost Your Reach - Advertise Here",
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-c3-2",
          content: "Connect With More Friends",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
          duration: 10
        },
      ]
    },
  ];

  // Premium ad data for large, dynamic ads
  const premiumAdSlots: PremiumAdCardProps[] = [
    {
      id: "premium-community-feed-1",
      advertiser: {
        name: "Kerex Group Co.,Ltd",
        verified: true,
      },
      content: {
        headline: "Professional Leading Manufacturer of Heavy Equipment",
        description: "Drilling Rig | Air Compressor | Generator - Quality You Can Trust. Drilling Made Easy with Kerex.",
        ctaText: "Get in touch",
        ctaUrl: "https://example.com/kerex",
      },
      media: {
        type: "image" as const,
        items: [
          {
            url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80",
          },
        ],
      },
      layout: "standard" as const,
      duration: 15,
    },
    {
      id: "premium-community-feed-2",
      advertiser: {
        name: "China Used Machinery For Sale",
        verified: false,
      },
      content: {
        headline: "Small-scale contractors, grow your business",
        description: "Quality used construction equipment at unbeatable prices. Financing available.",
        ctaText: "Get quote",
        ctaUrl: "https://example.com/machinery",
      },
      media: {
        type: "carousel" as const,
        items: [
          {
            url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
            caption: "Second-hand skid steer loader",
            price: "$15,000",
          },
          {
            url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
            caption: "Caterpillar Second-hand excavator",
            price: "$28,000",
          },
          {
            url: "https://images.unsplash.com/photo-1625321423565-fdc88f6e1c55?w=800&q=80",
            caption: "Used bulldozer - excellent condition",
            price: "$35,000",
          },
        ],
      },
      layout: "standard" as const,
      duration: 15,
    },
    {
      id: "premium-community-feed-3",
      advertiser: {
        name: "TechStart Business Solutions",
        verified: true,
      },
      content: {
        headline: "Scale Your Business with Cloud Solutions",
        description: "Enterprise-grade tools at startup prices. Get 50% off your first 3 months.",
        ctaText: "Start Free Trial",
        ctaUrl: "https://example.com/techstart",
      },
      media: {
        type: "image" as const,
        items: [
          {
            url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
          },
        ],
      },
      layout: "fullscreen" as const,
      duration: 15,
    },
  ];

  // Premium ad slots for Wall Status section
  const wallStatusPremiumAdSlots = [
    {
      slotId: "community-wall-status-premium-1",
      ads: [
        {
          id: "premium-community-wall-1",
          advertiser: {
            name: "SmartTech Solutions",
            verified: true,
          },
          content: {
            headline: "Transform Your Business with AI",
            description: "Cutting-edge AI solutions for modern businesses. Get started with a free consultation.",
            ctaText: "Learn More",
            ctaUrl: "https://example.com/smarttech",
          },
          media: {
            type: "image" as const,
            items: [
              {
                url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
              },
            ],
          },
          layout: "standard" as const,
          duration: 15,
        },
      ],
    },
    {
      slotId: "community-wall-status-premium-2",
      ads: [
        {
          id: "premium-community-wall-2",
          advertiser: {
            name: "Elite Fitness Center",
            verified: true,
          },
          content: {
            headline: "Get Fit, Stay Healthy",
            description: "Join Nigeria's premier fitness destination. First month 50% off for new members!",
            ctaText: "Join Now",
            ctaUrl: "https://example.com/fitness",
          },
          media: {
            type: "carousel" as const,
            items: [
              {
                url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
                caption: "State-of-the-art gym equipment",
              },
              {
                url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
                caption: "Personal training sessions",
              },
            ],
          },
          layout: "standard" as const,
          duration: 15,
        },
      ],
    },
  ];

  // Filter feed posts by content type (use feedPosts for rich content like Home page)
  const filteredPosts = contentFilter === "all" 
    ? feedPosts 
    : feedPosts.filter(post => post.type.toLowerCase() === contentFilter);
  const displayedPosts = filteredPosts.slice(0, visiblePostCount);

  // Reset visible post count when content filter changes
  useEffect(() => {
    setVisiblePostCount(20);
  }, [contentFilter]);

  if (!community) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Community not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Unliked" : "Liked",
      description: isLiked
        ? "You unliked this community"
        : "You liked this community",
    });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing
        ? `You unfollowed ${community.name}`
        : `You are now following ${community.name}`,
    });
  };

  const handleJoinLeave = () => {
    setIsMember(!isMember);
    toast({
      title: isMember ? "Left Community" : "Joined Community",
      description: isMember
        ? `You left ${community.name}`
        : `You joined ${community.name}`,
    });
  };

  const handleShare = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link Copied",
      description: "Community link has been copied to clipboard",
    });
  };

  const handleDonate = () => {
    toast({
      title: "Donate",
      description: "Donation feature coming soon!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-5xl">
        {/* Banner and Logo Section */}
        <Card className="overflow-hidden mb-4">
          {/* Banner */}
          <div className="relative h-48 sm:h-64 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
            {community.bannerImage ? (
              <img
                src={community.bannerImage}
                alt="Community Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="h-16 w-16 text-primary/40" />
              </div>
            )}
          </div>

          {/* Logo and Info */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
              {/* Logo */}
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background">
                <AvatarImage src={community.logoImage || community.coverImage} alt={community.name} />
                <AvatarFallback className="text-2xl sm:text-3xl">
                  {community.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Name and Stats */}
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {community.name}
                </h1>
                <p className="text-sm text-muted-foreground mb-3">
                  {community.followers.toLocaleString()} Followers | {community.likes.toLocaleString()} Likes
                </p>
              </div>

              {/* Donate Button */}
              {community.donationEnabled && (
                <Button
                  onClick={handleDonate}
                  className="bg-green-600 hover:bg-green-700 self-start sm:self-end"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Donate To Community
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={isMember ? "secondary" : "default"}
                size="sm"
                onClick={handleJoinLeave}
              >
                {isMember ? (
                  <>
                    <UserMinus className="h-4 w-4 mr-2" />
                    Leave
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleFollow}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>

              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>

              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>

              <CommunityMainMenu
                isOwner={community.isOwner}
                isAdmin={community.role === "Admin"}
                isMember={community.isMember || isMember}
              />
            </div>
          </div>
        </Card>

        {/* Tabs Section */}
        <div ref={tabsSectionRef}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="w-full grid grid-cols-3 h-auto">
              <TabsTrigger value="status" className="text-xs sm:text-sm">
                Status
              </TabsTrigger>
              <TabsTrigger value="about" className="text-xs sm:text-sm">
                About
              </TabsTrigger>
              <TabsTrigger value="membership" className="text-xs sm:text-sm">
                Membership
              </TabsTrigger>
            </TabsList>

            {/* Status Tab */}
            <TabsContent value="status" className="space-y-6 mt-6">
              {/* Motto */}
              {community.motto && (
                <div className="text-center py-4">
                  <p className="text-lg italic text-muted-foreground">"{community.motto}"</p>
                </div>
              )}

              {/* MobiFundRaiser Badge */}
              {community.fundRaiserEnabled && (
                <div className="flex justify-center mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-primary/10 border-primary text-primary hover:bg-primary/20"
                    onClick={() => toast({
                      title: "MobiFundRaiser",
                      description: "Community fundraiser feature coming soon!",
                    })}
                  >
                    MobiFundRaiser
                  </Button>
                </div>
              )}

              {/* Wall Status */}
              <WallStatusCarousel
                items={wallStatusPostsForCarousel}
                adSlots={adSlots}
                premiumAdSlots={wallStatusPremiumAdSlots}
                view={wallStatusView}
                filter={wallStatusFilter}
                onViewChange={setWallStatusView}
                onFilterChange={setWallStatusFilter}
                showFriendsSuggestions={true}
              />

              {/* Create Post Button */}
              <div className="space-y-2">
                <Button
                  onClick={() => toast({
                    title: "Create Post",
                    description: "Post creation feature coming soon!",
                  })}
                  className="w-full"
                  variant="outline"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Create Post on Community's Status
                </Button>
                <p className="text-xs text-center text-muted-foreground italic">
                  [Admin could turn off this in Privacy Setting]
                </p>
              </div>

              {/* E-Library Section */}
              <ELibrarySection
                activeFilter={contentFilter}
                onFilterChange={setContentFilter}
                title="Recommended Community Gallery"
              />

              {/* Community Posts */}
              <div className="space-y-6">
                {displayedPosts.map((post, index) => (
                  <div key={index}>
                    <FeedPost
                      id={post.id}
                      title={post.title}
                      subtitle={post.subtitle}
                      description={post.description}
                      author={post.author}
                      authorProfileImage={post.authorProfileImage}
                      userId={post.userId}
                      status={post.status}
                      views={post.views}
                      comments={post.comments}
                      likes={post.likes}
                      type={post.type}
                      imageUrl={post.imageUrl}
                    />
                    {/* Insert premium ad after every 4 posts */}
                    {(index + 1) % 4 === 0 && index < displayedPosts.length - 1 && (
                      <div className="my-8">
                        <PremiumAdRotation
                          slotId={`community-feed-premium-${Math.floor((index + 1) / 4)}`}
                          ads={[premiumAdSlots[Math.floor((index + 1) / 4) % premiumAdSlots.length]]}
                          context="feed"
                        />
                      </div>
                    )}
                    {/* Insert People You May Know after every 10 posts */}
                    {(index + 1) % 10 === 0 && index < displayedPosts.length - 1 && (
                      <div className="my-6">
                        <PeopleYouMayKnow />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {filteredPosts.length > visiblePostCount && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="link"
                    onClick={() => setVisiblePostCount(prev => prev + 20)}
                    className="text-primary"
                  >
                    ...more
                  </Button>
                </div>
              )}
              {visiblePostCount > 20 && filteredPosts.length > 20 && (
                <div className="flex justify-center mt-2">
                  <Button variant="link" onClick={() => setVisiblePostCount(20)}>
                    Less...
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="mt-6">
              <CommunityAboutTab community={community} />
            </TabsContent>

            {/* Membership Tab */}
            <TabsContent value="membership" className="mt-6">
              <CommunityMembershipTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Create Post Dialog */}
      <CreatePostDialog />
    </div>
  );
};

export default CommunityProfile;
