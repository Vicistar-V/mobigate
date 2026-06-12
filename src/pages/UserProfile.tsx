/**
 * UserProfile.tsx
 * Route: /profile/:id
 * Shows another user's profile. All data from API.
 */

import { Header }              from "@/components/Header";
import { Footer }              from "@/components/Footer";
import { Card }                from "@/components/ui/card";
import { Button }              from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Phone, Heart, Gift, MessageCircle, MoreVertical,
  Share2, UserX, AlertCircle, Users, UserPlus, UserMinus,
  UserCheck, Loader2, MapPin, Globe, CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MetaTags } from "@/components/MetaTags";
import { useState, useEffect, useCallback } from "react";
import { useParams }           from "react-router-dom";
import { Post, wallStatusPosts, feedPosts } from "@/data/posts";
import { PremiumAdRotation }   from "@/components/PremiumAdRotation";
import { PremiumAdCardProps }  from "@/components/PremiumAdCard";
import profileBanner           from "@/assets/profile-banner.jpg";
import { WallStatusCarousel }  from "@/components/WallStatusCarousel";
import { ProfileAboutTab }     from "@/components/ProfileAboutTab";
import { ELibrarySection }     from "@/components/ELibrarySection";
import { FeedPost }            from "@/components/FeedPost";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";
import { useToast }            from "@/hooks/use-toast";
import { ShareProfileDialog }   from "@/components/ShareProfileDialog";
import { PeopleYouMayKnow }   from "@/components/PeopleYouMayKnow";
import { GreetingSection }     from "@/components/GreetingCard";
import { ProfileAlbumsTab }   from "@/components/profile/ProfileAlbumsTab";
import { ProfileFriendsTab }  from "@/components/profile/ProfileFriendsTab";
import { ProfileLikesTab }    from "@/components/profile/ProfileLikesTab";
import { ProfileGiftsTab }    from "@/components/profile/ProfileGiftsTab";
import { ProfileFollowersTab } from "@/components/profile/ProfileFollowersTab";
import { ProfileFollowingTab } from "@/components/profile/ProfileFollowingTab";
import { ProfileCommunityTab } from "@/components/profile/ProfileCommunityTab";
import { ProfileMobiQuizTab }  from "@/components/profile/ProfileMobiQuizTab";
import { ProfileContentsTab }  from "@/components/profile/ProfileContentsTab";
import { SendGiftDialog, GiftSelection } from "@/components/chat/SendGiftDialog";
import { WallBannerSlideshow } from "@/components/wall-banner/WallBannerSlideshow";
import type { WallBannerSlide } from "@/types/wallBanner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

interface ProfileData {
  id: string; username: string; name: string;
  bio: string | null; website: string | null; location: string | null;
  profile_photo: string | null; banner_image: string | null;
  is_verified: boolean; is_online: boolean;
  friendship_status: string; is_following: boolean;
  stats: { friends: number; followers: number; following: number; likes: number; gifts: number; contents: number; active_contents?: number; monetized_contents?: number };
}

// Verified Content Creator qualification thresholds.
// The designation is reserved for verified users who maintain a qualifying
// number of ACTIVE (published/live) and MONETIZED contents/posts.
const CREATOR_MIN_ACTIVE_CONTENTS    = 5;
const CREATOR_MIN_MONETIZED_CONTENTS = 1;

const fmt = (n: number) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(n);

const UserProfile = () => {
  const { id: userId } = useParams<{ id: string }>();
  const { toast }      = useToast();

  const [profile,        setProfile]        = useState<ProfileData | null>(null);
  const [loading,        setLoading]        = useState(true);
  const [friendStatus,   setFriendStatus]   = useState("none");
  const [isFollowing,    setIsFollowing]    = useState(false);
  const [isLiked,        setIsLiked]        = useState(false);
  const [userPosts,      setUserPosts]      = useState<Post[]>([]);
  const [activeTab,      setActiveTab]      = useState("status");
  const [contentFilter,  setContentFilter]  = useState("all");
  const [wallFilter,     setWallFilter]     = useState("all");
  const [wallView,       setWallView]       = useState<"normal"|"large">("normal");
  const [visibleCount,   setVisibleCount]   = useState(20);
  const [giftOpen,       setGiftOpen]       = useState(false);
  const [galleryOpen,    setGalleryOpen]    = useState(false);
  const [galleryItems,   setGalleryItems]   = useState<MediaItem[]>([]);
  const [galleryIdx,     setGalleryIdx]     = useState(0);
  // Unfriend confirmation state
  const [unfriendConfirm,  setUnfriendConfirm]  = useState(false);
  const [shareDialogOpen,  setShareDialogOpen]  = useState(false);
  const [unfriendLoading, setUnfriendLoading] = useState(false);

  // ── Fetch profile ──────────────────────────────────────────────────────────
  const loadProfile = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    setProfile(null);
    try {
      const res = await fetch(`${API_BASE}/profile/info.php?user_id=${userId}`, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ProfileData = await res.json();
      setProfile(data);
      setFriendStatus(data.friendship_status || "none");
      setIsFollowing(data.is_following || false);
    } catch (e) {
      console.error("[UserProfile] fetch error:", e);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  // ── Fetch posts ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    fetch(`${API_BASE}/posts/feed.php?user_id=${userId}&limit=50`, { credentials: "include" })
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => setUserPosts(data.map((p: any) => ({
        id: p.id, title: p.title, subtitle: p.subtitle,
        description: p.content, author: p.author_name,
        authorProfileImage: p.author_profile_photo, userId: p.user_id,
        type: (p.post_type.charAt(0).toUpperCase() + p.post_type.slice(1)) as Post["type"],
        imageUrl: p.thumbnail_url || p.media_url,
        views: String(p.view_count||0), likes: String(p.like_count||0),
        comments: String(p.comment_count||0), followers: String(p.author_follower_count||0),
        fee: p.access_fee||"0", status: "Online" as const,
        copyrightMarked: p.copyright_marked ?? p.copyrightMarked,
        isOwner: false, isLiked: p.is_liked,
      }))))
      .catch(() => setUserPosts([]));
  }, [userId]);

  // Hash tab navigation
  useEffect(() => {
    const h = () => { const hash = window.location.hash.replace("#",""); if (hash) setActiveTab(hash); };
    h(); window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleAddFriend = async () => {
    if (!profile) return;
    try {
      const res  = await fetch(`${API_BASE}/friends/add.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_id: profile.id }),
      });
      const data = await res.json();
      if (data.success) { setFriendStatus("pending"); toast({ title: "Friend request sent!" }); }
      else toast({ title: "Error", description: data.error || "Could not send request", variant: "destructive" });
    } catch { toast({ title: "Error", description: "Cannot reach server", variant: "destructive" }); }
  };

  const handleUnfriend = async () => {
    if (!profile) return;
    // First click: show confirmation
    if (!unfriendConfirm) {
      setUnfriendConfirm(true);
      return;
    }
    // Second click: execute
    setUnfriendLoading(true);
    setUnfriendConfirm(false);
    try {
      const res  = await fetch(`${API_BASE}/friends/remove.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friend_id: profile.id }),
      });
      const data = await res.json();
      if (data.success) {
        setFriendStatus("none");
        toast({ title: "Unfriended", description: `You are no longer friends with ${profile.name}`, variant: "destructive" });
      } else {
        toast({ title: "Error", description: data.error || "Could not unfriend", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Cannot reach server", variant: "destructive" });
    } finally {
      setUnfriendLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!profile) return;
    const was = isFollowing;
    setIsFollowing(!was);
    try {
      await fetch(`${API_BASE}/friends/follow.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ following_id: profile.id }),
      });
      toast({ title: was ? "Unfollowed" : `Now following ${profile.name}` });
    } catch { setIsFollowing(was); }
  };

  const handleLike = async () => {
    if (!profile) return;
    const was = isLiked;
    setIsLiked(!was);
    try {
      await fetch(`${API_BASE}/profile/like_profile.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: profile.id }),
      });
      toast({ title: was ? "Unliked" : "Liked" });
    } catch { setIsLiked(was); }
  };

  const handleBlock = async () => {
    if (!profile) return;
    try {
      await fetch(`${API_BASE}/friends/block.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked_id: profile.id }),
      });
      toast({ title: "User blocked", variant: "destructive" });
    } catch {}
  };

  const handleChat = () => {
    if (!profile) return;
    window.dispatchEvent(new CustomEvent("openChatWithUser", {
      detail: { userId: profile.id, userName: profile.name },
    }));
  };

  const wallPosts = userPosts.filter(p => ["Photo","Video"].includes(p.type)).map(p => ({
    ...p, url: p.imageUrl || "", isOwner: false,
  }));

  const filteredFeed  = contentFilter === "all" ? feedPosts : feedPosts.filter(p => p.type.toLowerCase() === contentFilter);
  const displayedFeed = filteredFeed.slice(0, visibleCount);

  const premiumAds: PremiumAdCardProps[] = [
    { id: "p1", advertiser: { name: "Professional Training Academy", verified: true }, content: { headline: "Advance Your Career", description: "Industry-recognized certifications", ctaText: "Browse Courses", ctaUrl: "https://example.com/training" }, media: { type: "image", items: [{ url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80" }] }, layout: "standard", duration: 15 },
    { id: "p2", advertiser: { name: "Global Marketplace", verified: true }, content: { headline: "Buy and Sell with Confidence", description: "Connect with millions worldwide. Secure payments.", ctaText: "Start Selling", ctaUrl: "https://example.com" }, media: { type: "carousel", items: [{ url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80", caption: "Electronics" }, { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80", caption: "Fashion" }] }, layout: "standard", duration: 15 },
  ];
  const adSlots = [
    { slotId: "up-slot-1", ads: [{ id: "a1", content: "Premium Content Upgrade!", image: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=80", duration: 10 }] },
    { slotId: "up-slot-2", ads: [{ id: "a3", content: "Join Premium Now", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80", duration: 10 }] },
  ];
  const wallPremiumSlots = [
    { slotId: "up-wall-1", ads: [premiumAds[0]] },
    { slotId: "up-wall-2", ads: [premiumAds[1]] },
  ];

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </main>
      <Footer />
    </div>
  );

  if (!profile) return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <Card className="p-8 text-center max-w-sm">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h2 className="text-xl font-bold mb-2">Profile not found</h2>
          <p className="text-muted-foreground text-sm">This user may not exist or their profile is private.</p>
        </Card>
      </main>
      <Footer />
    </div>
  );

  const displayPhoto  = profile.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name||"U")}&size=200&background=7c3aed&color=fff`;
  const displayBanner = profile.banner_image  || profileBanner;

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <MetaTags
        title={profile ? `${profile.name} — Mobiface` : "Profile — Mobiface"}
        description={profile ? `View ${profile.name}'s profile on Mobiface` : "View user profile on Mobiface"}
        ogType="profile"
      />
      <Header />

      <main className="container max-w-4xl mx-auto px-4 py-6 flex-1">

        {/* ── Profile Header Card ── */}
        <Card className="mb-6 overflow-hidden">

          {/* Banner — rotating wall banner slideshow (public/read-only) */}
          <WallBannerSlideshow
            ownerId={profile.id}
            scope="profile"
            fallbackImage={displayBanner as string}
            fallbackAlt="Profile Banner"
            authorName={profile.name}
            authorImage={displayPhoto}
            onOpenViewer={(slide: WallBannerSlide) => {
              setGalleryItems([
                {
                  id: slide.id,
                  url: slide.mediaUrl,
                  type: slide.mediaType,
                  author: profile.name,
                  title: slide.caption,
                } as MediaItem,
              ]);
              setGalleryIdx(0);
              setGalleryOpen(true);
            }}
          />

          <div className="px-6 pb-6">
            {/* Avatar row */}
            <div className="relative">
              <div className="relative z-10 flex w-fit items-end gap-3 -mt-20">
                <div className="relative">
                  <img
                    src={displayPhoto}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-card cursor-pointer"
                    onClick={() => {
                      setGalleryItems([{ id: "photo", url: displayPhoto, type: "photo", author: profile.name }]);
                      setGalleryIdx(0); setGalleryOpen(true);
                    }}
                  />
                </div>
                {profile.is_online && (
                  <div className="mb-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">Online</div>
                )}
              </div>

              <div className="mt-3 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-4xl font-extrabold">{profile.name}</h1>
                  {profile.is_verified && <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
                {profile.is_verified
                  && (profile.stats.active_contents ?? profile.stats.contents ?? 0) >= CREATOR_MIN_ACTIVE_CONTENTS
                  && (profile.stats.monetized_contents ?? 0) >= CREATOR_MIN_MONETIZED_CONTENTS && (
                  <p className="text-emerald-600 font-semibold italic text-xs mt-0.5">Verified Content Creator</p>
                )}
                {profile.bio && <p className="text-muted-foreground text-sm mt-1 max-w-md">{profile.bio}</p>}
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  {profile.location && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />{profile.location}
                    </span>
                  )}
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline">
                      <Globe className="h-3.5 w-3.5" />{profile.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Stats + Actions */}
            <div className="mt-6 space-y-3">
              {/* Stats */}
              <div className="text-base text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span><span className="font-bold text-foreground">{fmt(profile.stats.friends)}</span> Friends</span>
                <span>|</span>
                <span><span className="font-bold text-foreground">{fmt(profile.stats.followers)}</span> Followers</span>
                <span>|</span>
                <span><span className="font-bold text-foreground">{fmt(profile.stats.following)}</span> Following</span>
                <span>|</span>
                <span><span className="font-bold text-foreground">{fmt(profile.stats.likes)}</span> Likes</span>
                <span>|</span>
                <span><span className="font-bold text-foreground">{fmt(profile.stats.gifts)}</span> Gifts</span>
                <span>|</span>
                <span><span className="font-bold text-foreground">{fmt(profile.stats.contents)}</span> Contents</span>
              </div>

              {/* Birthday line — bold "Birthday" + light textured date */}
              <p className="text-base flex flex-wrap items-baseline gap-1.5 -mt-1">
                <span className="font-extrabold text-foreground">Birthday</span>
                <span className="font-light italic text-muted-foreground/80 tracking-wide">
                  {(profile as { birthday?: string }).birthday || "August 25"}
                </span>
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="default" size="sm" className="gap-2 bg-black hover:bg-black/80"
                  onClick={() => toast({ title: "Voice Call", description: "Coming soon!" })}>
                  <Phone className="h-4 w-4" />Call
                </Button>
                <Button size="sm"
                  className={isLiked ? "gap-2 bg-red-500 hover:bg-red-600 text-white" : "gap-2 bg-yellow-400 hover:bg-yellow-500 text-black"}
                  onClick={handleLike}>
                  <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />Like
                </Button>
                <Button size="sm" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleChat}>
                  <MessageCircle className="h-4 w-4" />Chat
                </Button>
                <Button size="sm" className="gap-2 bg-purple-500 hover:bg-purple-600 text-white" onClick={() => setGiftOpen(true)}>
                  <Gift className="h-4 w-4" />Gift
                </Button>

                {/* ── Friend status button — dynamic based on relationship ── */}
                {friendStatus === "none" && (
                  <Button size="sm" variant="default" onClick={handleAddFriend}>
                    <UserPlus className="h-4 w-4 mr-1" />Add Friend
                  </Button>
                )}
                {friendStatus === "pending" && (
                  <Button size="sm" variant="secondary" disabled>
                    <Users className="h-4 w-4 mr-1" />Request Sent
                  </Button>
                )}
                {friendStatus === "accepted" && (
                  unfriendConfirm ? (
                    /* Confirmation state */
                    <div className="flex gap-1 items-center">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1 animate-pulse"
                        onClick={handleUnfriend}
                        disabled={unfriendLoading}
                      >
                        {unfriendLoading
                          ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                          : <UserX className="h-4 w-4" />}
                        Confirm Unfriend
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setUnfriendConfirm(false)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    /* Normal state — active clickable Unfriend button */
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                      onClick={handleUnfriend}
                    >
                      <UserX className="h-4 w-4" />Unfriend
                    </Button>
                  )
                )}

                {/* Follow / Unfollow */}
                <Button size="sm" variant={isFollowing ? "secondary" : "outline"} onClick={handleToggleFollow}>
                  {isFollowing
                    ? <><UserMinus className="h-4 w-4 mr-1" />Unfollow</>
                    : <><UserPlus  className="h-4 w-4 mr-1" />Follow</>
                  }
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="destructive" className="rounded-full h-9 w-9 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>
                      <Share2 className="h-4 w-4 mr-2" />Share Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setActiveTab("friends"); window.location.hash = "friends"; }}>
                      <Users className="h-4 w-4 mr-2" />View Friends
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleBlock} className="text-destructive focus:text-destructive">
                      <UserX className="h-4 w-4 mr-2" />Block User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast({ title: "Report submitted" })} className="text-destructive focus:text-destructive">
                      <AlertCircle className="h-4 w-4 mr-2" />Report User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Friendship status message */}
              {friendStatus === "accepted" && !unfriendConfirm && (
                <p className="text-emerald-600 font-medium text-base">You are Friends with {profile.name}</p>
              )}
              {unfriendConfirm && (
                <p className="text-red-500 text-sm font-medium">Click "Confirm Unfriend" to remove {profile.name} as a friend.</p>
              )}
            </div>
          </div>
        </Card>

        {/* ── Tabs ── */}
        <Tabs
          value={activeTab}
          onValueChange={tab => { setActiveTab(tab); window.location.hash = tab; }}
          className="w-full"
        >
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
              <TabsTrigger value="mobi-quiz">Mobi-Quiz</TabsTrigger>
              <TabsTrigger value="mobi-circle">Mobi-Circle</TabsTrigger>
              <TabsTrigger value="mobi-shop">Mobi-Shop</TabsTrigger>
              <TabsTrigger value="biz-catalogue">Biz-Catalogue</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Status tab */}
          <TabsContent value="status" className="space-y-6">
            <PeopleYouMayKnow />

            <WallStatusCarousel
              items={wallPosts as any}
              adSlots={adSlots}
              premiumAdSlots={wallPremiumSlots}
              view={wallView}
              onViewChange={setWallView}
              filter={wallFilter}
              onFilterChange={setWallFilter}
              onEdit={() => {}}
              onDelete={() => {}}
              onItemClick={() => {}}
              showFriendsSuggestions={true}
            />

            <div className="space-y-0">
              <ELibrarySection activeFilter={contentFilter} onFilterChange={setContentFilter} />
              <div className="space-y-6 mt-6">
                {displayedFeed.map((post, index) => (
                  <div key={post.id || index}>
                    <FeedPost {...post as any} />
                    {(index + 1) % 4 === 0 && index < displayedFeed.length - 1 && (
                      <div className="my-8">
                        <PremiumAdRotation
                          slotId={`up-premium-${Math.floor((index+1)/4)}`}
                          ads={[premiumAds[Math.floor((index+1)/4) % premiumAds.length]]}
                          context="profile"
                        />
                      </div>
                    )}
                    {(index + 1) % 10 === 0 && index < displayedFeed.length - 1 && (
                      <div className="my-6"><PeopleYouMayKnow /></div>
                    )}
                  </div>
                ))}
              </div>
              {(visibleCount < filteredFeed.length || visibleCount > 20) && (
                <div className="flex justify-center items-center gap-6 mt-8 mb-4">
                  {visibleCount < filteredFeed.length && (
                    <Button onClick={() => setVisibleCount(v => Math.min(v+20, filteredFeed.length))} variant="outline" size="lg"
                      className="text-3xl font-bold text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-destructive/20 px-8 py-6 rounded-xl">
                      ...more
                    </Button>
                  )}
                  {visibleCount > 20 && (
                    <Button onClick={() => { setVisibleCount(20); window.scrollTo({ top: 0, behavior: "smooth" }); }} variant="outline" size="lg"
                      className="text-3xl font-bold text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-destructive/20 px-8 py-6 rounded-xl">
                      Less...
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="about"><ProfileAboutTab userName={profile.name} /></TabsContent>
          <TabsContent value="friends"><ProfileFriendsTab userName={profile.name} userId={userId} /></TabsContent>
          <TabsContent value="albums" className="space-y-6">
            <ProfileAlbumsTab userId={userId || ""} profileImageHistory={[]} bannerImageHistory={[]} userPosts={userPosts} />
          </TabsContent>
          <TabsContent value="contents"><ProfileContentsTab userName={profile.name} userId={userId || ""} /></TabsContent>
          <TabsContent value="gifts"><ProfileGiftsTab userName={profile.name} userId={userId} /></TabsContent>
          <TabsContent value="likes"><ProfileLikesTab userName={profile.name} userId={userId} /></TabsContent>
          <TabsContent value="followers"><ProfileFollowersTab userName={profile.name} userId={userId} /></TabsContent>
          <TabsContent value="following"><ProfileFollowingTab userName={profile.name} userId={userId} /></TabsContent>
          <TabsContent value="community"><ProfileCommunityTab userName={profile.name} /></TabsContent>
          <TabsContent value="mobi-quiz"><ProfileMobiQuizTab /></TabsContent>

          {["mobi-circle","mobi-shop","biz-catalogue"].map(tab => (
            <TabsContent key={tab} value={tab}>
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
          ))}
        </Tabs>
      </main>

      <Footer />

      <MediaGalleryViewer
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        items={galleryItems}
        initialIndex={galleryIdx}
        showActions={false}
        galleryType="post"
      />

      <SendGiftDialog
        isOpen={giftOpen}
        onClose={() => setGiftOpen(false)}
        recipientName={profile.name}
        onSendGift={(g: GiftSelection) => {
          if (!g) return;
          toast({ title: "Gift Sent! 🎁", description: `You sent ${g.giftData.name} to ${profile.name}` });
          setGiftOpen(false);
        }}
      />

      {/* Share Profile Dialog */}
      <ShareProfileDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        profileName={profile?.name || ""}
      />
    </div>
  );
};

export default UserProfile;
