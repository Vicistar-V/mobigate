import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GreetingSection } from "@/components/GreetingCard";
import { WallStatusCarousel } from "@/components/WallStatusCarousel";
import { ELibrarySection } from "@/components/ELibrarySection";
import { FeedPost } from "@/components/FeedPost";
import { AdCard } from "@/components/AdCard";
import { EditPostDialog } from "@/components/EditPostDialog";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PremiumAdCardProps } from "@/components/PremiumAdCard";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { feedPosts, Post, wallStatusPosts } from "@/data/posts";
import { useToast } from "@/hooks/use-toast";
import { useFeedPosts, useWallStatusPosts } from "@/hooks/useWindowData";

const Index = () => {
  const { toast } = useToast();
  const phpFeedPosts = useFeedPosts();
  const phpWallPosts = useWallStatusPosts();
  
  const activeFeedPosts = phpFeedPosts || feedPosts;
  const activeWallStatusPosts = phpWallPosts || wallStatusPosts;
  
  const [contentFilter, setContentFilter] = useState<string>("all");
  const [wallStatusFilter, setWallStatusFilter] = useState<string>("all");
  const [wallStatusView, setWallStatusView] = useState<"normal" | "large">("normal");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [mediaGalleryOpen, setMediaGalleryOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const [visiblePostCount, setVisiblePostCount] = useState(20);

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsEditDialogOpen(true);
  };

  const handleSavePost = (updatedPost: Post) => {
    // In a real app, this would update the post in the database
    console.log("Saving post:", updatedPost);
    toast({
      title: "Post updated",
      description: "Your Wall Status post has been updated successfully.",
    });
  };

  const handleDeletePost = (postId: string) => {
    // In a real app, this would delete the post from the database
    console.log("Deleting post:", postId);
    toast({
      title: "Post deleted",
      description: "Your Wall Status post has been deleted successfully.",
      variant: "destructive",
    });
  };

  // Open media gallery for wall status
  const openWallStatusGallery = (initialPost: Post) => {
    // Convert wall status posts to MediaItem format
    const items: MediaItem[] = activeWallStatusPosts.map((post) => ({
      id: post.id,
      url: post.url,
      type: post.type,
      author: post.author,
      authorImage: post.authorImage,
      title: post.title,
      description: post.description,
      timestamp: post.timestamp,
      likes: post.likes,
      comments: post.comments,
      isLiked: post.isLiked,
    }));
    const initialIndex = activeWallStatusPosts.findIndex(p => p.id === initialPost.id);
    setGalleryItems(items);
    setGalleryInitialIndex(initialIndex >= 0 ? initialIndex : 0);
    setMediaGalleryOpen(true);
  };

  const handleLoadMorePosts = () => {
    setVisiblePostCount(prev => Math.min(prev + 20, filteredPosts.length));
  };

  const handleShowLessPosts = () => {
    setVisiblePostCount(20);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset pagination when filter changes
  useEffect(() => {
    setVisiblePostCount(20);
  }, [contentFilter]);

  // Convert wall status posts to Post format for WallStatusCarousel
  const wallStatusPostsForCarousel = activeWallStatusPosts.map(post => ({
    id: post.id,
    title: post.title || "Wall Status",
    subtitle: post.description,
    description: post.description,
    author: post.author,
    authorProfileImage: post.authorImage,
    userId: "1",
    status: "Online" as const,
    views: "0",
    comments: String(post.comments),
    likes: String(post.likes),
    type: post.type === "video" ? "Video" as const : "Photo" as const,
    imageUrl: post.url,
    isOwner: false
  }));

  const adSlots = [
    {
      slotId: "home-slot-1",
      ads: [
        {
          id: "ad-h1-1",
          content: "Premium Content Upgrade - 50% Off!",
          image: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-h1-2",
          content: "New Features Available Now",
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
          duration: 10
        },
      ]
    },
    {
      slotId: "home-slot-2",
      ads: [
        {
          id: "ad-h2-1",
          content: "Limited Time Offer - Join Premium",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-h2-2",
          content: "Exclusive Member Benefits",
          image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
          duration: 10
        },
      ]
    },
    {
      slotId: "home-slot-3",
      ads: [
        {
          id: "ad-h3-1",
          content: "Boost Your Reach - Advertise Here",
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
          duration: 10
        },
        {
          id: "ad-h3-2",
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
      id: "premium-feed-1",
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
      id: "premium-feed-2",
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
      id: "premium-feed-3",
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
      slotId: "wall-status-premium-1",
      ads: [
        {
          id: "premium-wall-1",
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
      slotId: "wall-status-premium-2",
      ads: [
        {
          id: "premium-wall-2",
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

  const filteredPosts = contentFilter === "all"
    ? activeFeedPosts 
    : activeFeedPosts.filter(post => post.type.toLowerCase() === contentFilter);
  
  const displayedPosts = filteredPosts.slice(0, visiblePostCount);
  const hasMorePosts = visiblePostCount < filteredPosts.length;
  const canCollapsePosts = visiblePostCount > 20;

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 py-6 flex-1">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Greeting Section */}
          <aside className="lg:col-span-1 space-y-6 min-w-0">
            <GreetingSection />
          </aside>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {/* Create Monetized Post - Directly above Wall Status */}
            <CreatePostDialog />
            
            <WallStatusCarousel
              items={wallStatusPostsForCarousel}
              adSlots={adSlots}
              premiumAdSlots={wallStatusPremiumAdSlots}
              view={wallStatusView}
              onViewChange={setWallStatusView}
              filter={wallStatusFilter}
              onFilterChange={setWallStatusFilter}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onItemClick={openWallStatusGallery}
              showFriendsSuggestions={true}
            />
            
            {editingPost && (
              <EditPostDialog
                post={editingPost}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onSave={handleSavePost}
              />
            )}
            
            {/* Feed Posts with Filter */}
            <div className="space-y-0">
              <ELibrarySection activeFilter={contentFilter} onFilterChange={setContentFilter} />
              <div className="space-y-6 mt-6">
                {displayedPosts.map((post, index) => (
                <div key={index}>
                  <FeedPost {...post as any} />
                  {/* Insert premium ad after every 4 posts */}
                  {(index + 1) % 4 === 0 && index < displayedPosts.length - 1 && (
                    <div className="my-8">
                      <PremiumAdRotation
                        slotId={`feed-premium-${Math.floor((index + 1) / 4)}`}
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
              {(hasMorePosts || canCollapsePosts) && (
                <div className="flex justify-center items-center gap-6 mt-8 mb-4">
                  {hasMorePosts && (
                    <Button
                      onClick={handleLoadMorePosts}
                      variant="outline"
                      size="lg"
                      className="text-3xl font-bold text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-destructive/20 px-8 py-6 rounded-xl"
                    >
                      ...more
                    </Button>
                  )}
                  {canCollapsePosts && (
                    <Button
                      onClick={handleShowLessPosts}
                      variant="outline"
                      size="lg"
                      className="text-3xl font-bold text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-destructive/20 px-8 py-6 rounded-xl"
                    >
                      Less...
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <MediaGalleryViewer
        open={mediaGalleryOpen}
        onOpenChange={setMediaGalleryOpen}
        items={galleryItems}
        initialIndex={galleryInitialIndex}
        showActions={true}
        galleryType="wall-status"
      />
    </div>
  );
};

export default Index;
