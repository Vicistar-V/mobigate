import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeedPost } from "@/components/FeedPost";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Heart, Gift, MessageCircle, MoreVertical, Camera, Share2, UserX, AlertCircle, Users, UserPlus, UserMinus, UserCheck, Image as ImageIcon, FileText, ThumbsUp, Gamepad2, BookOpen, Network, Store, Briefcase, Building2, GraduationCap, FilePlus2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AdCard } from "@/components/AdCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ELibrarySection } from "@/components/ELibrarySection";
import { MetaTags } from "@/components/MetaTags";
import { useState, useRef, useEffect, useCallback } from "react";
import { getPostsByUserId, Post, mockProfilePictures, mockBannerImages } from "@/data/posts";
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
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { GreetingSection } from "@/components/GreetingCard";
import { ProfileAlbumsTab } from "@/components/profile/ProfileAlbumsTab";
import { ProfileFriendsTab } from "@/components/profile/ProfileFriendsTab";
import { FriendRequestsTab }    from "@/components/profile/FriendRequestsTab";
import { ProfileLikesTab } from "@/components/profile/ProfileLikesTab";
import { ProfileGiftsTab } from "@/components/profile/ProfileGiftsTab";
import { ProfileFollowersTab } from "@/components/profile/ProfileFollowersTab";
import { ProfileFollowingTab } from "@/components/profile/ProfileFollowingTab";
import { ProfileCommunityTab } from "@/components/profile/ProfileCommunityTab";
import { ProfileMobiQuizTab } from "@/components/profile/ProfileMobiQuizTab";
import { ProfileContentsTab } from "@/components/profile/ProfileContentsTab";
import { SendGiftDialog, GiftSelection } from "@/components/chat/SendGiftDialog";
import { useCurrentUserId, useUserPosts } from "@/hooks/useWindowData";
import { WallBannerSlideshow } from "@/components/wall-banner/WallBannerSlideshow";
import { WallBannerManagerDialog } from "@/components/wall-banner/WallBannerManagerDialog";
import type { WallBannerSlide } from "@/types/wallBanner";
import { getActiveSlidesFor } from "@/lib/wallBannerStorage";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MyProfile = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("status");
  const autoOpenFriendAction = searchParams.get("action") as "find" | "invite" | null;
  const friendRequestsSubTab = searchParams.get("sub") === "sent" ? "sent" : "received";
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
  const [wallBannerManagerOpen, setWallBannerManagerOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";
  
  // Always use the logged-in user's ID for own profile
  const fallbackUserId = useCurrentUserId();
  const currentUserId = user?.id || fallbackUserId || "";

  const [wallStatusPosts, setWallStatusPosts] = useState<import("@/data/posts").WallStatusPost[]>([]);
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [libraryCounts, setLibraryCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    if (!currentUserId) return;
    fetch(`${API_BASE}/posts/feed.php?user_id=${currentUserId}&limit=100`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: any[]) => {
        // Wall status: photo/video only, for the carousel
        const wallMapped = data
          .filter((p) => p.post_type === "photo" || p.post_type === "video")
          .map((p) => ({
            id: p.id, url: p.thumbnail_url || p.media_url || "", type: p.post_type as "photo" | "video",
            title: p.title, author: p.author_name?.trim() || "Me", authorImage: p.author_profile_photo || "/placeholder.svg",
            timestamp: p.created_at, description: p.content,
            likes: p.like_count || 0, comments: p.comment_count || 0, isLiked: !!p.is_liked,
            followers: String(p.author_follower_count || 0), userId: p.user_id,
            status: "Online" as const, views: String(p.view_count || 0),
            fee: p.access_fee ? String(p.access_fee) : undefined,
            copyrightMarked: p.copyright_marked ?? p.copyrightMarked,
          }));
        setWallStatusPosts(wallMapped);

        // Full feed: every type, for the E-Library section below the fold
        const typeMap: Record<string, Post["type"]> = {
          photo: "Photo", video: "Video", audio: "Audio", article: "Article",
          blog: "Article", pdf: "PDF", url: "URL", status: "Article",
        };
        const feedMapped: Post[] = data.map((p) => ({
          id: p.id, title: p.title || "", subtitle: p.subtitle, description: p.content,
          author: p.author_name?.trim() || "Me", authorProfileImage: p.author_profile_photo || "/placeholder.svg",
          userId: p.user_id, status: "Online" as const,
          views: String(p.view_count || 0), comments: String(p.comment_count || 0), likes: String(p.like_count || 0),
          followers: String(p.author_follower_count || 0),
          type: typeMap[p.post_type] || "Article",
          imageUrl: p.thumbnail_url || p.media_url || undefined,
          fee: p.access_fee > 0 ? String(p.access_fee) : undefined,
          isOwner: true,
        }));
        setFeedPosts(feedMapped);

        // Real counts per content type for the E-Library filter buttons
        const counts: Record<string, number> = { all: data.length };
        for (const p of data) {
          counts[p.post_type] = (counts[p.post_type] || 0) + 1;
        }
        setLibraryCounts(counts);
      })
      .catch(() => { setWallStatusPosts([]); setFeedPosts([]); setLibraryCounts({}); });
  }, [currentUserId, API_BASE]);
  
  // Ref for tabs section to enable auto-scroll
  const tabsSectionRef = useRef<HTMLDivElement>(null);

  // Handle hash-based tab navigation with auto-scroll
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== activeTab) {
        // Only update if different to prevent circular updates
        // Change the active tab
        setActiveTab(hash);
        
        // Scroll to tabs section after a brief delay to ensure content is rendered
        setTimeout(() => {
          if (tabsSectionRef.current) {
            const headerHeight = 80; // Approximate header height
            const elementPosition = tabsSectionRef.current.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else if (!hash) {
        // If no hash, default to 'status' tab
        setActiveTab('status');
      }
    };

    // Custom event handler for forced scrolling (when hash doesn't change)
    const handleForceScroll = () => {
      setTimeout(() => {
        if (tabsSectionRef.current) {
          const headerHeight = 80;
          const elementPosition = tabsSectionRef.current.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 150); // Slightly longer delay to ensure sheet is closed
    };

    // Handle initial hash on mount
    handleHashChange();

    // Listen for hash changes (e.g., from navigation)
    window.addEventListener('hashchange', handleHashChange);
    
    // Listen for forced scroll events
    window.addEventListener('forceScrollToTabs', handleForceScroll as EventListener);
    
    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('forceScrollToTabs', handleForceScroll as EventListener);
    };
  }, []);
  
  // Load profile image and history from localStorage or PHP
  const [profileImage, setProfileImage] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.__PROFILE_IMAGE__) {
      return window.__PROFILE_IMAGE__;
    }
    const saved = localStorage.getItem("profileImage");
    return saved || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80";
  });

  const [profileImageHistory, setProfileImageHistory] = useState<string[]>(() => {
    if (typeof window !== 'undefined' && window.__PROFILE_IMAGE_HISTORY__) {
      return window.__PROFILE_IMAGE_HISTORY__;
    }
    const saved = localStorage.getItem("profileImageHistory");
    if (saved) {
      const history = JSON.parse(saved);
      const currentImage = localStorage.getItem("profileImage") || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80";
      if (!history.includes(currentImage)) {
        return [currentImage, ...history];
      }
      return history;
    }
    return mockProfilePictures.map(pic => pic.url);
  });

  // Load banner image and history from localStorage or PHP
  const [bannerImage, setBannerImage] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.__BANNER_IMAGE__) {
      return window.__BANNER_IMAGE__;
    }
    const saved = localStorage.getItem("bannerImage");
    return saved || profileBanner;
  });

  const [bannerImageHistory, setBannerImageHistory] = useState<string[]>(() => {
    if (typeof window !== 'undefined' && window.__BANNER_IMAGE_HISTORY__) {
      return window.__BANNER_IMAGE_HISTORY__;
    }
    const saved = localStorage.getItem("bannerImageHistory");
    if (saved) {
      const history = JSON.parse(saved);
      const currentBanner = localStorage.getItem("bannerImage") || profileBanner;
      if (!history.includes(currentBanner)) {
        return [currentBanner, ...history];
      }
      return history;
    }
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
  
  // Fetch own posts from API
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  useEffect(() => {
    if (!user?.id) return;
    fetch(`${API_BASE}/posts/feed.php?user_id=${user.id}&limit=50`, { credentials: "include" })
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => setUserPosts(data.map((p: any) => ({
        id: p.id, title: p.title, subtitle: p.subtitle, description: p.content,
        author: p.author_name, authorProfileImage: p.author_profile_photo, userId: p.user_id,
        type: (p.post_type.charAt(0).toUpperCase() + p.post_type.slice(1)) as Post["type"],
        imageUrl: p.thumbnail_url || p.media_url,
        views: String(p.view_count||0), likes: String(p.like_count||0),
        comments: String(p.comment_count||0), followers: String(p.author_follower_count||0),
        fee: p.access_fee||"0", status: "Online" as const, isOwner: true, isLiked: p.is_liked,
      }))))
      .catch(() => {});
  }, [user?.id, API_BASE]);
  
  // Fetch own profile from API
  const [apiData, setApiData] = useState<any>(null);

  const fetchMyProfile = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE}/profile/info.php?user_id=${user.id}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setApiData(data);
        if (data.profile_photo) { setProfileImage(data.profile_photo); localStorage.setItem("profileImage", data.profile_photo); }
        if (data.banner_image)  { setBannerImage(data.banner_image);   localStorage.setItem("bannerImage",  data.banner_image); }
      }
    } catch {}
  }, [user?.id, API_BASE]);

  useEffect(() => { fetchMyProfile(); }, [fetchMyProfile]);
  useEffect(() => {
    const h = () => fetchMyProfile();
    window.addEventListener("postCreated", h);
    return () => window.removeEventListener("postCreated", h);
  }, [fetchMyProfile]);

  const fmt = (n: number) => n >= 1000 ? (n/1000).toFixed(1)+"k" : String(n);
  const userProfile = {
    name:         apiData?.name         || user?.fullName || user?.username || "",
    location:     apiData?.location     || "",
    profileImage: apiData?.profile_photo || profileImage,
    verified:     apiData?.is_verified  || false,
    status:       "Online" as const,
    isFriend:     false,
    stats: {
      friends:   fmt(apiData?.stats?.friends   || 0),
      followers: fmt(apiData?.stats?.followers || 0),
      following: fmt(apiData?.stats?.following || 0),
      likes:     fmt(apiData?.stats?.likes     || 0),
      gifts:     fmt(apiData?.stats?.gifts     || 0),
      contents:  fmt(apiData?.stats?.contents  || 0),
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

  const handleSavePost = async (updatedPost: Post) => {
    setUserPosts(posts => posts.map(p => p.id === updatedPost.id ? updatedPost : p));
    try {
      const form = new FormData();
      form.append("post_id", updatedPost.id ?? ""); form.append("title", updatedPost.title);
      form.append("subtitle", updatedPost.subtitle ?? ""); form.append("content", updatedPost.description ?? "");
      form.append("post_type", updatedPost.type.toLowerCase());
      await fetch(`${API_BASE}/posts/update.php`, { method: "POST", credentials: "include", body: form });
    } catch {}
    toast({ title: "Post updated" });
  };

  const handleDeletePost = async (postId: string) => {
    setUserPosts(posts => posts.filter(p => p.id !== postId));
    try {
      await fetch(`${API_BASE}/posts/delete.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId }),
      });
    } catch {}
    toast({ title: "Post deleted", description: "Your post has been deleted successfully" });
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
        userId: currentUserId,
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
      authorUserId: post.userId,
      title: post.title,
      description: post.description,
      timestamp: post.timestamp,
      likes: post.likes,
      comments: post.comments,
      followers: post.followers,
      isLiked: post.isLiked,
      isOwner: true, // All wall status posts on this profile belong to the owner
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
    userId: currentUserId,
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

  // Filter e-library content posts (use feedPosts for rich content like Home page)
  const filteredPosts = contentFilter === "all" 
    ? feedPosts 
    : feedPosts.filter(post => post.type.toLowerCase() === contentFilter);
  
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
      <MetaTags title="My Profile — Mobiface" ogType="profile" />
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6 flex-1">
        {/* Profile Header Card */}
        <Card className="mb-6 overflow-hidden">
          {/* Profile Banner — rotating wall banner slideshow */}
          <WallBannerSlideshow
            ownerId={currentUserId}
            scope="profile"
            fallbackImage={bannerImage}
            fallbackAlt="Profile Banner"
            isOwner
            
            authorName={userProfile.name}
            onManage={() => setWallBannerManagerOpen(true)}
            onChangeFallback={() => setWallBannerManagerOpen(true)}
            onOpenViewer={(slide: WallBannerSlide) => {
              const active = getActiveSlidesFor(currentUserId, "profile");
              const list = active.length ? active : [slide];
              setGalleryItems(
                list.map((s) => ({
                  id: s.id,
                  url: s.mediaUrl,
                  type: s.mediaType,
                  author: userProfile.name,
                  title: s.caption,
                  durationMs: (s.displaySeconds || 5) * 1000,
                }) as MediaItem),
              );
              setGalleryInitialIndex(Math.max(0, list.findIndex((s) => s.id === slide.id)));
              setGalleryType("banner");
              setMediaGalleryOpen(true);
            }}
          />
          
          <div className="px-6 pb-6">
            {/* Profile Image and Name Row */}
            <div className="relative">
              {/* Profile Image and Online Indicator Row */}
              <div className="relative z-10 flex w-fit items-end gap-3 -mt-20">
                <div className="relative group pointer-events-auto">
                  <img 
                    src={userProfile.profileImage} 
                    alt={userProfile.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-card cursor-pointer"
                    onClick={openProfilePictureGallery}
                  />
                  <button
                    onClick={() => setEditingProfilePicture(true)}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/60 hover:bg-black/80 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
                  >
                    <Camera className="h-2.5 w-2.5 mr-0.5" />
                    Edit
                  </button>
                </div>
                
                {/* Online Indicator - Next to Profile Image */}
                {userProfile.status === "Online" && (
                  <div className="mb-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold select-none pointer-events-none">
                    Online
                  </div>
                )}
              </div>
              
              <div className="mt-3 w-full">
                <h1 className="text-4xl font-extrabold">{userProfile.name}</h1>
                {userProfile.verified && (
                  <p className="text-emerald-600 font-bold italic text-base">Verified Content Creator</p>
                )}
              </div>
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

              {/* Own Profile Action Buttons — no Call/Like/Chat/Gift/Add Friend/Follow */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setEditingProfilePicture(true)}
                >
                  <Camera className="h-4 w-4" />
                  Edit Profile Photo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={handleShareProfile}
                >
                  <Share2 className="h-4 w-4" />
                  Share Profile
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="rounded-full h-9 w-9 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-60 max-h-[70vh] overflow-y-auto"
                  >
                    {/* People */}
                    <DropdownMenuItem onClick={() => setActiveTab("friends")}>
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      My Friends
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("followers")}>
                      <UserPlus className="h-4 w-4 mr-2 text-primary" />
                      My Followers
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("following")}>
                      <UserCheck className="h-4 w-4 mr-2 text-primary" />
                      My Following
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Content */}
                    <DropdownMenuItem onClick={() => setActiveTab("contents")}>
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      My Contents
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("albums")}>
                      <ImageIcon className="h-4 w-4 mr-2 text-primary" />
                      My Albums
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Engagement */}
                    <DropdownMenuItem onClick={() => setActiveTab("gifts")}>
                      <Gift className="h-4 w-4 mr-2 text-rose-500" />
                      My Gifts <span className="ml-auto text-[10px] text-muted-foreground">Sent · Rec'd · Vault</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("likes")}>
                      <ThumbsUp className="h-4 w-4 mr-2 text-rose-500" />
                      My Likes <span className="ml-auto text-[10px] text-muted-foreground">Sent · Rec'd</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Games & Library */}
                    <DropdownMenuItem onClick={() => setActiveTab("mobi-quiz")}>
                      <Gamepad2 className="h-4 w-4 mr-2 text-amber-500" />
                      My Games <span className="ml-auto text-[10px] text-muted-foreground">Played · Liked</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setActiveTab("status");
                        setTimeout(() => {
                          document.getElementById("e-library-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 80);
                      }}
                    >
                      <BookOpen className="h-4 w-4 mr-2 text-amber-500" />
                      My E-Library
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Networks */}
                    <DropdownMenuItem onClick={() => setActiveTab("mobi-circle")}>
                      <Network className="h-4 w-4 mr-2 text-indigo-500" />
                      My Mobi-Circle
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("mobi-shop")}>
                      <Store className="h-4 w-4 mr-2 text-indigo-500" />
                      My Mobi-Shop
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("biz-catalogue")}>
                      <Briefcase className="h-4 w-4 mr-2 text-indigo-500" />
                      My Biz-Catalogue
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("community")}>
                      <Building2 className="h-4 w-4 mr-2 text-indigo-500" />
                      My Communities
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Life-Mates (not yet wired — placeholder) */}
                    <DropdownMenuItem
                      onClick={() =>
                        toast({
                          title: "My Life-Mates",
                          description: "Age-Mates, School-Mates, Class-Mates & Work Colleagues — coming soon.",
                        })
                      }
                    >
                      <GraduationCap className="h-4 w-4 mr-2 text-emerald-600" />
                      My Life-Mates
                      <span className="ml-auto text-[10px] text-muted-foreground">Soon</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>

                </DropdownMenu>
              </div>

              {/* No friend status on own profile */}
            </div>
            </div>
          </div>
        </Card>

        {/* Tabs Section */}
        <Tabs 
          ref={tabsSectionRef} 
          value={activeTab} 
          onValueChange={(newTab) => {
            setActiveTab(newTab);
            // Update URL hash when tab changes
            window.location.hash = newTab;
          }} 
          className="w-full"
        >
          <ScrollArea className="w-full whitespace-nowrap mb-6">
            <TabsList className="inline-flex w-auto">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="friend-requests">Friend Requests</TabsTrigger>
              <TabsTrigger value="albums">Albums</TabsTrigger>
              <TabsTrigger value="contents">Contents</TabsTrigger>
              <TabsTrigger value="gifts">Gifts</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
              <TabsTrigger value="followers">Followers</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="mobi-quiz">Mobi-Quiz</TabsTrigger>
              <TabsTrigger value="mobi-circle">Mobi-Circle</TabsTrigger>
              <TabsTrigger value="mobi-shop">Mobi-Shop</TabsTrigger>
              <TabsTrigger value="biz-catalogue">Biz-Catalogue</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="status" className="space-y-6">
            {/* Stories / Vibes & Flexing / Breaking News — editable on your own page */}
            <GreetingSection embed />

            {/* People You May Know - First Slot */}
            <PeopleYouMayKnow showNotableDates />

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
            <div id="e-library-section" className="space-y-0 scroll-mt-24">
              <ELibrarySection activeFilter={contentFilter} onFilterChange={setContentFilter} counts={libraryCounts} />
              
              <div className="space-y-6 mt-6">
                {displayedPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-14 px-4 rounded-xl border border-dashed border-border bg-muted/30">
                    <FilePlus2 className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="font-semibold text-base mb-1">No content yet</p>
                    <p className="text-sm text-muted-foreground max-w-xs mb-4">
                      You haven't posted any status or content{contentFilter !== "all" ? " of this type" : ""} yet. Share something to get started.
                    </p>
                    <CreatePostDialog />
                  </div>
                ) : (
                  displayedPosts.map((post, index) => (
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
                  ))
                )}
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
            <ProfileFriendsTab userName={userProfile.name} userId={user?.id || ""} autoOpen={autoOpenFriendAction ?? undefined} />
          </TabsContent>

          <TabsContent value="friend-requests">
            <FriendRequestsTab defaultSubTab={friendRequestsSubTab} />
          </TabsContent>

          <TabsContent value="albums" className="space-y-6">
            <ProfileAlbumsTab
              userId={user?.id || ""}
              profileImageHistory={profileImageHistory}
              bannerImageHistory={bannerImageHistory}
              userPosts={userPosts}
            />
          </TabsContent>

          <TabsContent value="contents">
            <ProfileContentsTab userName={userProfile.name} userId={user?.id || ""} />
          </TabsContent>

          <TabsContent value="gifts">
            <ProfileGiftsTab userName={userProfile.name} userId={user?.id || ""} />
          </TabsContent>

          <TabsContent value="likes">
            <ProfileLikesTab userName={userProfile.name} userId={user?.id || ""} />
          </TabsContent>

          <TabsContent value="followers">
            <ProfileFollowersTab userName={userProfile.name} userId={user?.id || ""} />
          </TabsContent>

          <TabsContent value="following">
            <ProfileFollowingTab userName={userProfile.name} userId={user?.id || ""} />
          </TabsContent>

          <TabsContent value="community">
            <ProfileCommunityTab userName={userProfile.name} />
          </TabsContent>

          <TabsContent value="mobi-quiz">
            <ProfileMobiQuizTab />
          </TabsContent>

          <TabsContent value="mobi-circle">
            <Card className="p-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Service Unavailable</AlertTitle>
                <AlertDescription className="mt-2">
                  You cannot use this Service now: it's either you are not eligible to use 
                  the Service, or this Service is not yet available in your country. You can 
                  find out more by going through Mobiface 'ACCESSIBILITY & TERMS OF SERVICE' 
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
                  find out more by going through Mobiface 'ACCESSIBILITY & TERMS OF SERVICE' 
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
                  find out more by going through Mobiface 'ACCESSIBILITY & TERMS OF SERVICE' 
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
        type="banner"
        title="Change Banner"
      />

      <MediaGalleryViewer
        open={mediaGalleryOpen}
        onOpenChange={setMediaGalleryOpen}
        items={galleryItems}
        initialIndex={galleryInitialIndex}
        showActions={true}
        galleryType={galleryType}
        autoAdvance={galleryType === "banner" || galleryType === "wall-status"}
      />

      <SendGiftDialog
        isOpen={isGiftDialogOpen}
        onClose={() => setIsGiftDialogOpen(false)}
        recipientName={userProfile.name}
        onSendGift={handleSendGift}
      />

      <WallBannerManagerDialog
        open={wallBannerManagerOpen}
        onOpenChange={setWallBannerManagerOpen}
        ownerId={currentUserId}
        scope="profile"
      />
    </div>
  );
};

export default MyProfile;
