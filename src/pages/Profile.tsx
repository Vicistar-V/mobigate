import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeedPost } from "@/components/FeedPost";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Heart, Gift, MessageCircle, MoreVertical, Camera, Share2, UserX, AlertCircle, Users, UserPlus, UserMinus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AdCard } from "@/components/AdCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ELibrarySection } from "@/components/ELibrarySection";
import { useState } from "react";
import { getPostsByUserId, Post, mockProfilePictures, mockBannerImages, wallStatusPosts } from "@/data/posts";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PremiumAdCardProps } from "@/components/PremiumAdCard";
import profileBanner from "@/assets/profile-banner.jpg";
import { WallStatusCarousel } from "@/components/WallStatusCarousel";
import { ProfileAboutTab } from "@/components/ProfileAboutTab";
import { EditPostDialog } from "@/components/EditPostDialog";
import { EditProfilePictureDialog } from "@/components/profile/EditProfilePictureDialog";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState as useReactState } from "react";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { ProfileAlbumsTab } from "@/components/profile/ProfileAlbumsTab";
import { ProfileFriendsTab } from "@/components/profile/ProfileFriendsTab";
import { ProfileLikesTab } from "@/components/profile/ProfileLikesTab";
import { ProfileGiftsTab } from "@/components/profile/ProfileGiftsTab";
import { ProfileFollowersTab } from "@/components/profile/ProfileFollowersTab";
import { ProfileFollowingTab } from "@/components/profile/ProfileFollowingTab";
import { ProfileContentsTab } from "@/components/profile/ProfileContentsTab";
import { SendGiftDialog, GiftSelection } from "@/components/chat/SendGiftDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<string>("status");
  const [contentFilter, setContentFilter] = useState<string>("all");
  const [wallStatusFilter, setWallStatusFilter] = useState<string>("all");
  const [wallStatusView, setWallStatusView] = useState<"normal" | "large">("normal");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingProfilePicture, setEditingProfilePicture] = useState(false);
  const [editingBanner, setEditingBanner] = useState(false);
  const [mediaGalleryOpen, setMediaGalleryOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const [galleryType, setGalleryType] = useState<"wall-status" | "profile-picture" | "banner" | "post">("wall-status");
  const [isProfileLiked, setIsProfileLiked] = useState(false);
  const [visiblePostCount, setVisiblePostCount] = useState(20);
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);
  const [messagesSheetOpen, setMessagesSheetOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();

  // Handle hash-based tab navigation
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveTab(hash);
    }
  }, []);
  
  // Load profile image and history from localStorage
  const [profileImage, setProfileImage] = useState<string>(() => {
    const saved = localStorage.getItem("profileImage");
    return saved || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80";
  });

  const [profileImageHistory, setProfileImageHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("profileImageHistory");
    if (saved) {
      const history = JSON.parse(saved);
      const currentImage = localStorage.getItem("profileImage") || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80";
      // Ensure current image is in history
      if (!history.includes(currentImage)) {
        return [currentImage, ...history];
      }
      return history;
    }
    // Initialize with mock data
    return mockProfilePictures.map(pic => pic.url);
  });

  // Load banner image and history from localStorage
  const [bannerImage, setBannerImage] = useState<string>(() => {
    const saved = localStorage.getItem("bannerImage");
    return saved || profileBanner;
  });

  const [bannerImageHistory, setBannerImageHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("bannerImageHistory");
    if (saved) {
      const history = JSON.parse(saved);
      const currentBanner = localStorage.getItem("bannerImage") || profileBanner;
      // Ensure current banner is in history
      if (!history.includes(currentBanner)) {
        return [currentBanner, ...history];
      }
      return history;
    }
    // Initialize with mock data
    return mockBannerImages.map(banner => banner.url);
  });

  // Save profile image and history to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("profileImage", profileImage);
    // Add to history if it's a new image
    if (!profileImageHistory.includes(profileImage)) {
      const newHistory = [profileImage, ...profileImageHistory];
      setProfileImageHistory(newHistory);
      localStorage.setItem("profileImageHistory", JSON.stringify(newHistory));
    }
  }, [profileImage]);

  // Save profile image history
  useEffect(() => {
    localStorage.setItem("profileImageHistory", JSON.stringify(profileImageHistory));
  }, [profileImageHistory]);

  // Save banner image and history to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bannerImage", bannerImage);
    // Add to history if it's a new banner
    if (!bannerImageHistory.includes(bannerImage)) {
      const newHistory = [bannerImage, ...bannerImageHistory];
      setBannerImageHistory(newHistory);
      localStorage.setItem("bannerImageHistory", JSON.stringify(newHistory));
    }
  }, [bannerImage]);

  // Save banner image history
  useEffect(() => {
    localStorage.setItem("bannerImageHistory", JSON.stringify(bannerImageHistory));
  }, [bannerImageHistory]);
  
  // Get posts for this specific user and manage as state
  const [userPosts, setUserPosts] = useState<Post[]>(() => getPostsByUserId("1"));
  
  const userProfile = {
    name: "Amaka Jane Johnson",
    location: "Lagos, Nigeria",
    profileImage: profileImage,
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

  // Premium ad data for large, dynamic ads
  const premiumAdSlots: PremiumAdCardProps[] = [
    {
      id: "premium-profile-1",
      advertiser: {
        name: "Professional Training Academy",
        verified: true,
      },
      content: {
        headline: "Advance Your Career with Certified Courses",
        description: "Industry-recognized certifications in tech, business, and creative fields. Join 50,000+ successful graduates.",
        ctaText: "Browse Courses",
        ctaUrl: "https://example.com/training",
      },
      media: {
        type: "image" as const,
        items: [
          {
            url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80",
          },
        ],
      },
      layout: "standard" as const,
      duration: 15,
    },
    {
      id: "premium-profile-2",
      advertiser: {
        name: "Global Marketplace",
        verified: true,
      },
      content: {
        headline: "Buy and Sell with Confidence",
        description: "Connect with millions of buyers and sellers worldwide. Secure payments, fast shipping.",
        ctaText: "Start Selling",
        ctaUrl: "https://example.com/marketplace",
      },
      media: {
        type: "carousel" as const,
        items: [
          {
            url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
            caption: "Electronics & Gadgets",
          },
          {
            url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
            caption: "Fashion & Accessories",
          },
          {
            url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
            caption: "Home & Living",
          },
        ],
      },
      layout: "standard" as const,
      duration: 15,
    },
  ];

  // Premium ad slots for Wall Status section in Profile
  const wallStatusPremiumAdSlots = [
    {
      slotId: "profile-wall-premium-1",
      ads: [premiumAdSlots[0]],
    },
    {
      slotId: "profile-wall-premium-2",
      ads: [premiumAdSlots[1]],
    },
  ];

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
  };

  const handleSavePost = (updatedPost: Post) => {
    setUserPosts(posts => 
      posts.map(p => p.id === updatedPost.id ? updatedPost : p)
    );
  };

  const handleDeletePost = (postId: string) => {
    setUserPosts(posts => posts.filter(p => p.id !== postId));
    toast({
      title: "Post deleted",
      description: "Your post has been deleted successfully",
    });
  };

  const handleProfileLike = () => {
    setIsProfileLiked(!isProfileLiked);
    toast({
      title: isProfileLiked ? "Unliked" : "Liked",
      description: isProfileLiked ? "You unliked this profile" : "You liked this profile",
    });
  };

  const handleCall = () => {
    toast({
      title: "Voice Call",
      description: "Voice calling feature is coming soon!",
    });
  };

  const handleChat = () => {
    // Dispatch custom event to open chat with this specific user
    const event = new CustomEvent('openChatWithUser', {
      detail: { 
        userId: 'user-5',
        userName: userProfile.name,
        conversationId: '5'
      }
    });
    window.dispatchEvent(event);
  };

  const handleSendGift = (giftData: GiftSelection) => {
    if (!giftData) return;
    
    toast({
      title: "Gift Sent! 🎁",
      description: `You sent ${giftData.giftData.name} to ${userProfile.name}`,
    });
  };

  const handleShareProfile = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Profile Link Copied",
      description: "Profile link has been copied to clipboard",
    });
  };

  const handleBlockUser = () => {
    toast({
      title: "User Blocked",
      description: `You have blocked ${userProfile.name}`,
      variant: "destructive",
    });
  };

  const handleReportUser = () => {
    toast({
      title: "Report Submitted",
      description: `Your report about ${userProfile.name} has been submitted`,
    });
  };

  const handleUnfriend = () => {
    toast({
      title: "Removed Friend",
      description: `You are no longer friends with ${userProfile.name}`,
      variant: "destructive",
    });
  };

  const handleToggleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing 
        ? `You unfollowed ${userProfile.name}` 
        : `You are now following ${userProfile.name}`,
    });
  };

  // Open media gallery for profile pictures
  const openProfilePictureGallery = () => {
    const items: MediaItem[] = profileImageHistory.map((url, index) => ({
      id: `profile-${index}`,
      url,
      type: "photo" as const,
      author: userProfile.name,
      authorImage: profileImage,
      timestamp: index === 0 ? "Current" : "Previous",
      title: index === 0 ? "Current Profile Picture" : `Profile Picture ${profileImageHistory.length - index}`,
    }));
    setGalleryItems(items);
    setGalleryInitialIndex(0);
    setGalleryType("profile-picture");
    setMediaGalleryOpen(true);
  };

  // Open media gallery for banners
  const openBannerGallery = () => {
    const items: MediaItem[] = bannerImageHistory.map((url, index) => ({
      id: `banner-${index}`,
      url,
      type: "photo" as const,
      author: userProfile.name,
      authorImage: profileImage,
      timestamp: index === 0 ? "Current" : "Previous",
      title: index === 0 ? "Current Banner" : `Banner ${bannerImageHistory.length - index}`,
    }));
    setGalleryItems(items);
    setGalleryInitialIndex(0);
    setGalleryType("banner");
    setMediaGalleryOpen(true);
  };

  // Open media gallery for wall status
  const openWallStatusGallery = (initialPost: Post) => {
    // Convert wall status posts to MediaItem format
    const items: MediaItem[] = wallStatusPosts.map((post) => ({
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
    const initialIndex = wallStatusPosts.findIndex(p => p.id === initialPost.id);
    setGalleryItems(items);
    setGalleryInitialIndex(initialIndex >= 0 ? initialIndex : 0);
    setGalleryType("wall-status");
    setMediaGalleryOpen(true);
  };

  // Convert wall status posts to Post format for WallStatusCarousel
  const wallStatusPostsForCarousel = wallStatusPosts.map(post => ({
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
    isOwner: true
  }));

  // Filter wall status posts based on media type
  const filteredWallPosts = wallStatusFilter === "all"
    ? wallStatusPostsForCarousel
    : wallStatusPostsForCarousel.filter(post => post.type.toLowerCase() === wallStatusFilter);

  // Filter e-library content posts
  const filteredPosts = contentFilter === "all" 
    ? userPosts 
    : userPosts.filter(post => post.type.toLowerCase() === contentFilter);
  
  const displayedPosts = filteredPosts.slice(0, visiblePostCount);
  const hasMorePosts = visiblePostCount < filteredPosts.length;
  const canCollapsePosts = visiblePostCount > 20;

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

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6 flex-1">
        {/* Profile Header Card */}
        <Card className="mb-6 overflow-hidden">
          {/* Profile Banner */}
          <div className="relative h-48 bg-muted group">
            <img 
              src={bannerImage} 
              alt="Profile Banner"
              className="w-full h-full object-cover cursor-pointer"
              onClick={openBannerGallery}
            />
            <Button 
              size="sm" 
              className="absolute bottom-4 right-4 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              onClick={() => setEditingBanner(true)}
            >
              <Camera className="h-4 w-4 mr-2" />
              Change Banner
            </Button>
          </div>
          
          <div className="px-6 pb-6">
            {/* Profile Image and Name Row */}
            <div className="relative flex items-start justify-between">
              {/* Profile Image and Name Column */}
              <div className="flex flex-col items-start -mt-20">
                <div className="relative group">
                  <img 
                    src={userProfile.profileImage} 
                    alt={userProfile.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-card cursor-pointer"
                    onClick={openProfilePictureGallery}
                  />
                  <button
                    onClick={() => setEditingProfilePicture(true)}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-base font-medium"
                  >
                    <Camera className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                </div>
                <div className="mt-3">
                  <h1 className="text-4xl font-extrabold">{userProfile.name}</h1>
                  {userProfile.verified && (
                    <p className="text-emerald-600 font-bold italic text-base">Verified Content Creator</p>
                  )}
                </div>
              </div>

              {/* Online Indicator - Under Banner, Far Right */}
              {userProfile.status === "Online" && (
                <div className="mt-4 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-base font-bold">
                  Online
                </div>
              )}
            </div>

            {/* Stats and Actions Container */}
            <div className="mt-6">

            <div className="space-y-3">

              {/* Stats */}
              <div className="text-base text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5">
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
                <Button 
                  variant="default" 
                  size="sm" 
                  className="gap-2 bg-black hover:bg-black/80"
                  onClick={handleCall}
                >
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button 
                  size="sm" 
                  className={`gap-2 ${
                    isProfileLiked 
                      ? "bg-red-500 hover:bg-red-600 text-white" 
                      : "bg-yellow-400 hover:bg-yellow-500 text-black"
                  }`}
                  onClick={handleProfileLike}
                >
                  <Heart className={`h-4 w-4 ${isProfileLiked ? "fill-current" : ""}`} />
                  Like
                </Button>
                <Button 
                  size="sm" 
                  className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={handleChat}
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </Button>
                <Button 
                  size="sm" 
                  className="gap-2 bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => setIsGiftDialogOpen(true)}
                >
                  <Gift className="h-4 w-4" />
                  Gift
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="destructive" className="rounded-full">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleShareProfile}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("friends")}>
                      <Users className="h-4 w-4 mr-2" />
                      View Friends
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleToggleFollow}>
                      {isFollowing ? (
                        <>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Follow
                        </>
                      )}
                    </DropdownMenuItem>
                    {userProfile.isFriend && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleUnfriend}>
                          <UserX className="h-4 w-4 mr-2" />
                          Unfriend
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={handleBlockUser}>
                      <UserX className="h-4 w-4 mr-2" />
                      Block User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleReportUser} className="text-destructive">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Report User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Friend Status */}
              {userProfile.isFriend && (
                <p className="text-emerald-600 font-medium text-base">
                  You are Friends with {userProfile.name}
                </p>
              )}
            </div>
            </div>
          </div>
        </Card>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ScrollArea className="w-full whitespace-nowrap mb-6">
            <TabsList className="inline-flex w-auto">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="albums">Albums</TabsTrigger>
              <TabsTrigger value="contents">Contents</TabsTrigger>
              <TabsTrigger value="gifts">Gifts</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
              <TabsTrigger value="followers">Followers</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="mobi-circle">Mobi-Circle</TabsTrigger>
              <TabsTrigger value="mobi-shop">Mobi-Shop</TabsTrigger>
              <TabsTrigger value="biz-catalogue">Biz-Catalogue</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="status" className="space-y-6">
            {/* People You May Know - First Slot */}
            <PeopleYouMayKnow />

            {/* Create Monetized Post - Directly above Wall Status */}
            <CreatePostDialog />

            {/* Wall Status */}
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

            {/* Feed Posts with Filter */}
            <div className="space-y-0">
              <ELibrarySection activeFilter={contentFilter} onFilterChange={setContentFilter} />
              
              <div className="space-y-6 mt-6">
                {displayedPosts.map((post, index) => (
                <div key={post.id || index}>
                  <FeedPost 
                    {...post}
                  />
                  {/* Insert premium ad after every 4 posts */}
                  {(index + 1) % 4 === 0 && index < displayedPosts.length - 1 && (
                    <div className="my-8">
                      <PremiumAdRotation
                        slotId={`profile-premium-${Math.floor((index + 1) / 4)}`}
                        ads={[premiumAdSlots[Math.floor((index + 1) / 4) % premiumAdSlots.length]]}
                        context="profile"
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
          </TabsContent>

          <TabsContent value="about">
            <ProfileAboutTab userName={userProfile.name} />
          </TabsContent>

          <TabsContent value="friends">
            <ProfileFriendsTab userName={userProfile.name} userId="1" />
          </TabsContent>

          <TabsContent value="albums" className="space-y-6">
            <ProfileAlbumsTab
              userId="1"
              profileImageHistory={profileImageHistory}
              bannerImageHistory={bannerImageHistory}
              userPosts={userPosts}
            />
          </TabsContent>

          <TabsContent value="contents">
            <ProfileContentsTab userName={userProfile.name} userId="1" />
          </TabsContent>

          <TabsContent value="gifts">
            <ProfileGiftsTab userName={userProfile.name} userId="1" />
          </TabsContent>

          <TabsContent value="likes">
            <ProfileLikesTab userName={userProfile.name} userId="1" />
          </TabsContent>

          <TabsContent value="followers">
            <ProfileFollowersTab userName={userProfile.name} userId="1" />
          </TabsContent>

          <TabsContent value="following">
            <ProfileFollowingTab userName={userProfile.name} userId="1" />
          </TabsContent>

          <TabsContent value="community">
            <Card className="p-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Service Unavailable</AlertTitle>
                <AlertDescription className="mt-2">
                  You cannot use this Service now: it's either you are not eligible to use 
                  the Service, or this Service is not yet available in your country. You can 
                  find out more by going through Mobigate 'ACCESSIBILITY & TERMS OF SERVICE' 
                  and 'COMMUNITY STANDARDS'.
                </AlertDescription>
              </Alert>
            </Card>
          </TabsContent>

          <TabsContent value="mobi-circle">
            <Card className="p-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Service Unavailable</AlertTitle>
                <AlertDescription className="mt-2">
                  You cannot use this Service now: it's either you are not eligible to use 
                  the Service, or this Service is not yet available in your country. You can 
                  find out more by going through Mobigate 'ACCESSIBILITY & TERMS OF SERVICE' 
                  and 'COMMUNITY STANDARDS'.
                </AlertDescription>
              </Alert>
            </Card>
          </TabsContent>

          <TabsContent value="mobi-shop">
            <Card className="p-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Service Unavailable</AlertTitle>
                <AlertDescription className="mt-2">
                  You cannot use this Service now: it's either you are not eligible to use 
                  the Service, or this Service is not yet available in your country. You can 
                  find out more by going through Mobigate 'ACCESSIBILITY & TERMS OF SERVICE' 
                  and 'COMMUNITY STANDARDS'.
                </AlertDescription>
              </Alert>
            </Card>
          </TabsContent>

          <TabsContent value="biz-catalogue">
            <Card className="p-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Service Unavailable</AlertTitle>
                <AlertDescription className="mt-2">
                  You cannot use this Service now: it's either you are not eligible to use 
                  the Service, or this Service is not yet available in your country. You can 
                  find out more by going through Mobigate 'ACCESSIBILITY & TERMS OF SERVICE' 
                  and 'COMMUNITY STANDARDS'.
                </AlertDescription>
              </Alert>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {editingPost && (
        <EditPostDialog
          post={editingPost}
          open={!!editingPost}
          onOpenChange={(open) => !open && setEditingPost(null)}
          onSave={handleSavePost}
        />
      )}

      <EditProfilePictureDialog
        open={editingProfilePicture}
        onOpenChange={setEditingProfilePicture}
        currentImage={profileImage}
        onSave={setProfileImage}
      />

      <EditProfilePictureDialog
        open={editingBanner}
        onOpenChange={setEditingBanner}
        currentImage={bannerImage}
        onSave={setBannerImage}
      />

      <MediaGalleryViewer
        open={mediaGalleryOpen}
        onOpenChange={setMediaGalleryOpen}
        items={galleryItems}
        initialIndex={galleryInitialIndex}
        showActions={galleryType === "wall-status"}
        galleryType={galleryType}
      />

      <SendGiftDialog
        isOpen={isGiftDialogOpen}
        onClose={() => setIsGiftDialogOpen(false)}
        recipientName={userProfile.name}
        onSendGift={handleSendGift}
      />
    </div>
  );
};

export default Profile;
