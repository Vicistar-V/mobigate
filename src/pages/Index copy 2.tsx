/**
 * Index.tsx — Mobigate Home Feed  v4.0
 *
 * React app:  http://localhost:8080/
 * API:        https://angola-press.com/en/api
 *
 * API URL is read from VITE_API_URL in .env files.
 * Both .env.development and .env.production point to the live API.
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GreetingSection } from "@/components/GreetingCard";
import { WallStatusCarousel } from "@/components/WallStatusCarousel";
import { ELibrarySection } from "@/components/ELibrarySection";
import { FeedPost } from "@/components/FeedPost";
import { EditPostDialog } from "@/components/EditPostDialog";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PremiumAdCardProps } from "@/components/PremiumAdCard";
import { ChatWithFriendsDialog } from "@/components/chat/ChatWithFriendsDialog";
import { CampaignBannerRotation } from "@/components/community/elections/CampaignBannerRotation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Loader2, WifiOff, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { feedPosts, Post, wallStatusPosts } from "@/data/posts";
import { useToast } from "@/hooks/use-toast";

// ─── API base URL from Vite env ───────────────────────────────────────────────
// Set in .env.development and .env.production:
//   VITE_API_URL=https://angola-press.com/en/api
const API_BASE = import.meta.env.VITE_API_URL as string
  || 'https://angola-press.com/en/api';  // hard fallback

const API_TIMEOUT = 12000; // 12 seconds

// ─── fetch with timeout ───────────────────────────────────────────────────────
async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), API_TIMEOUT);
  try {
    return await fetch(url, { ...options, credentials: 'include', signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ─── API Types ────────────────────────────────────────────────────────────────
interface ApiPost {
  id: string; title: string; subtitle: string | null; content: string | null;
  post_type: string; thumbnail_url: string | null; media_url: string | null;
  external_url: string | null; access_fee: string;
  view_count: number; like_count: number; comment_count: number;
  is_monetized: number; created_at: string; user_id: string;
  author_name: string; author_profile_photo: string | null;
  author_last_active: string | null; author_follower_count: number;
  album_id: string | null; album_name: string | null;
  is_owner: boolean; is_liked: boolean;
}

interface ApiWallPost {
  id: string; media_url: string; media_type: 'photo' | 'video';
  title: string | null; description: string | null; access_fee: string;
  like_count: number; comment_count: number; view_count: number;
  created_at: string; user_id: string; author_name: string;
  author_image: string | null; author_last_active: string | null;
  is_liked: boolean; is_owner: boolean;
}

interface ApiAdvert {
  id: string; title: string; body: string | null; media_url: string | null;
  advertiser_name: string; advertiser_verified: boolean;
  cta_text: string; cta_url: string | null;
  layout: 'standard' | 'fullscreen' | 'compact'; duration: number;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────
const isOnline = (t: string | null) =>
  !!t && Date.now() - new Date(t).getTime() < 300_000;

const fmt = (n: number) =>
  n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(1)}k` : String(n);

const mapPost = (p: ApiPost) => ({
  id: p.id, title: p.title,
  subtitle: p.subtitle ?? undefined,
  description: p.content ?? undefined,
  author: p.author_name,
  authorProfileImage: p.author_profile_photo ?? undefined,
  userId: p.user_id,
  status: (isOnline(p.author_last_active) ? 'Online' : 'Offline') as 'Online' | 'Offline',
  views: fmt(p.view_count), comments: String(p.comment_count), likes: String(p.like_count),
  followers: String(p.author_follower_count),
  type: (p.post_type.charAt(0).toUpperCase() + p.post_type.slice(1)) as Post['type'],
  imageUrl: p.thumbnail_url ?? p.media_url ?? undefined,
  fee: p.access_fee,
  albumId: p.album_id ?? undefined, albumName: p.album_name ?? undefined,
  isOwner: p.is_owner, isLiked: p.is_liked,
});

const mapWall = (p: ApiWallPost) => ({
  id: p.id, title: p.title ?? 'Wall Status',
  subtitle: p.description ?? undefined, description: p.description ?? undefined,
  author: p.author_name,
  authorProfileImage: p.author_image ?? undefined, authorImage: p.author_image ?? undefined,
  userId: p.user_id,
  status: (isOnline(p.author_last_active) ? 'Online' : 'Offline') as 'Online' | 'Offline',
  views: String(p.view_count), comments: String(p.comment_count), likes: String(p.like_count),
  type: (p.media_type === 'video' ? 'Video' : 'Photo') as 'Video' | 'Photo',
  imageUrl: p.media_url, url: p.media_url, timestamp: p.created_at,
  isOwner: p.is_owner, isLiked: p.is_liked,
});

const mapAdvert = (a: ApiAdvert): PremiumAdCardProps => ({
  id: a.id,
  advertiser: { name: a.advertiser_name, verified: a.advertiser_verified },
  content: { headline: a.title, description: a.body ?? '', ctaText: a.cta_text, ctaUrl: a.cta_url ?? undefined },
  media: { type: 'image', items: [{ url: a.media_url ?? 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=80' }] },
  layout: a.layout, duration: a.duration,
});

// ─── Component ────────────────────────────────────────────────────────────────
const Index = () => {
  const { toast } = useToast();

  const [currentUserId, setCurrentUserId] = useState('1');
  const [feedData,  setFeedData]  = useState<ReturnType<typeof mapPost>[]>([]);
  const [wallData,  setWallData]  = useState<ReturnType<typeof mapWall>[]>([]);
  const [adverts,   setAdverts]   = useState<PremiumAdCardProps[]>([]);

  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingWall, setLoadingWall] = useState(true);
  const [apiReachable, setApiReachable] = useState<boolean | null>(null);
  const [apiError,   setApiError]   = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState('');

  const [contentFilter, setContentFilter] = useState('all');
  const [wallFilter,  setWallFilter]  = useState('all');
  const [wallView,    setWallView]    = useState<'normal' | 'large'>('normal');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editOpen,    setEditOpen]    = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [galleryIdx,  setGalleryIdx]  = useState(0);
  const [visibleCount, setVisibleCount] = useState(20);
  const [chatOpen,    setChatOpen]    = useState(false);

  // ── Ping API ────────────────────────────────────────────────────────────────
  useEffect(() => {
    apiFetch(`${API_BASE}/test.php`)
      .then(r => {
        setApiReachable(r.ok);
        if (!r.ok) { setApiError(true); setApiErrorMsg(`Server returned HTTP ${r.status}`); }
      })
      .catch(err => {
        setApiReachable(false);
        setApiError(true);
        setApiErrorMsg(
          err.name === 'AbortError'
            ? 'Request timed out — check your internet connection or server status'
            : `Cannot reach ${API_BASE} — check server is running`
        );
      });
  }, []);

  // ── Auth session ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!apiReachable) return;
    apiFetch(`${API_BASE}/auth/session.php`)
      .then(r => r.json())
      .then(d => { if (d?.user_id) setCurrentUserId(d.user_id); })
      .catch(() => {});
  }, [apiReachable]);

  // ── Fetchers ────────────────────────────────────────────────────────────────
  const fetchFeed = useCallback(async (filter: string) => {
    setLoadingFeed(true);
    if (apiReachable === false) {
      setFeedData(feedPosts.map(p => ({ ...p, isOwner: false, isLiked: false })) as any);
      setLoadingFeed(false);
      return;
    }
    try {
      const url = filter === 'all'
        ? `${API_BASE}/posts/feed.php`
        : `${API_BASE}/posts/feed.php?type=${encodeURIComponent(filter)}`;
      const r = await apiFetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data: ApiPost[] = await r.json();
      setFeedData(data.map(mapPost));
      setApiError(false);
    } catch (e: any) {
      setFeedData(feedPosts.map(p => ({ ...p, isOwner: false, isLiked: false })) as any);
      setApiError(true);
      setApiErrorMsg(e.message ?? 'Unknown error');
    } finally {
      setLoadingFeed(false);
    }
  }, [apiReachable]);

  const fetchWall = useCallback(async () => {
    setLoadingWall(true);
    if (apiReachable === false) {
      setWallData(wallStatusPosts.map(mapWall) as any);
      setLoadingWall(false);
      return;
    }
    try {
      const r = await apiFetch(`${API_BASE}/posts/wall.php`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data: ApiWallPost[] = await r.json();
      setWallData(data.map(mapWall));
    } catch {
      setWallData(wallStatusPosts.map(mapWall) as any);
    } finally {
      setLoadingWall(false);
    }
  }, [apiReachable]);

  useEffect(() => {
  // CreatePostDialog fires this event after a successful post
  const handlePostCreated = () => {
    fetchFeed(contentFilter);  // refresh the feed
    fetchWall();               // refresh wall too
  };

  window.addEventListener("postCreated", handlePostCreated);
  return () => window.removeEventListener("postCreated", handlePostCreated);
}, [fetchFeed, fetchWall, contentFilter]);

  const fetchAdverts = useCallback(async () => {
    if (!apiReachable) return;
    try {
      const r = await apiFetch(`${API_BASE}/adverts/active.php`);
      if (!r.ok) return;
      const data: ApiAdvert[] = await r.json();
      if (data.length > 0) setAdverts(data.map(mapAdvert));
    } catch {}
  }, [apiReachable]);

  useEffect(() => {
    if (apiReachable === null) return;
    fetchFeed(contentFilter); fetchWall(); fetchAdverts();
  }, [apiReachable]); // eslint-disable-line

  useEffect(() => {
    if (apiReachable === null) return;
    fetchFeed(contentFilter);
    setVisibleCount(20);
  }, [contentFilter]); // eslint-disable-line

  // ── Post actions ─────────────────────────────────────────────────────────────
 const handleSavePost = async (updatedPost: Post) => {
  if (!apiReachable) {
    toast({ title: "Offline", description: "Cannot save — API is unreachable.", variant: "destructive" });
    return;
  }
  try {
    const form = new FormData();
    form.append("post_id",   updatedPost.id ?? "");
    form.append("title",     updatedPost.title);
    form.append("subtitle",  updatedPost.subtitle   ?? "");
    form.append("content",   updatedPost.description ?? "");
    form.append("post_type", updatedPost.type.toLowerCase());
    form.append("access_fee", String(updatedPost.fee ?? 0));

    const res = await apiFetch(`${API_BASE}/posts/update.php`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Update failed");

    // Optimistic update in the feed list
    setFeedData(prev =>
      prev.map(p => p.id === updatedPost.id
        ? {
            ...p,
            title:       updatedPost.title,
            subtitle:    updatedPost.subtitle,
            description: updatedPost.description,
            type:        updatedPost.type,
            fee:         updatedPost.fee,
            // Use new media URL from server if returned
            imageUrl:    data.thumbnail_url || data.media_url || p.imageUrl,
          }
        : p
      )
    );

    toast({ title: "Post updated ✓" });
  } catch (e: any) {
    toast({ title: "Error", description: e.message || "Could not save post.", variant: "destructive" });
  }
};

 const handleDeletePost = async (postId: string) => {
  // Optimistic UI update first
  setFeedData(prev => prev.filter(p => p.id !== postId));
  setWallData(prev => prev.filter(p => p.id !== postId));

  if (!apiReachable) return;  // API is down — local update only

  try {
    const res = await apiFetch(`${API_BASE}/posts/delete.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    toast({ title: "Post deleted", variant: "destructive" });
  } catch {
    toast({ title: "Error", description: "Could not delete post.", variant: "destructive" });
    // Re-fetch to restore the post if delete failed
    fetchFeed(contentFilter);
  }
};
  const openWallGallery = (initial: Post) => {
    const items: MediaItem[] = wallData.map(p => ({
      id: p.id, url: p.imageUrl ?? (p as any).url ?? '',
      type: p.type === 'Video' ? 'video' : 'photo',
      author: p.author, authorImage: p.authorProfileImage ?? (p as any).authorImage,
      title: p.title, description: p.description, timestamp: (p as any).timestamp,
      likes: typeof p.likes === 'string' ? parseInt(p.likes) : (p.likes ?? 0),
      comments: typeof p.comments === 'string' ? parseInt(p.comments) : (p.comments ?? 0),
      isLiked: (p as any).isLiked ?? false,
    }));
    const idx = wallData.findIndex(p => p.id === initial.id);
    setGalleryItems(items);
    setGalleryIdx(idx >= 0 ? idx : 0);
    setGalleryOpen(true);
  };

  // ── Pagination ────────────────────────────────────────────────────────────
  const filtered  = contentFilter === 'all' ? feedData : feedData.filter(p => p.type.toLowerCase() === contentFilter);
  const displayed = filtered.slice(0, visibleCount);
  const hasMore   = visibleCount < filtered.length;
  const canLess   = visibleCount > 20;

  // ── Static ad fallbacks ───────────────────────────────────────────────────
  const adSlots = [
    { slotId: 'hs1', ads: [{ id: 'a1', content: 'Premium Upgrade!', image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=80', duration: 10 }] },
    { slotId: 'hs2', ads: [{ id: 'a2', content: 'Join Premium', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', duration: 10 }] },
    { slotId: 'hs3', ads: [{ id: 'a3', content: 'Advertise Here', image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80', duration: 10 }] },
  ];

  const staticPremium: PremiumAdCardProps[] = [
    { id: 'p1', advertiser: { name: 'Kerex Group', verified: true }, content: { headline: 'Heavy Equipment Manufacturer', description: 'Drilling Rig | Air Compressor | Generator', ctaText: 'Contact Us' }, media: { type: 'image', items: [{ url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80' }] }, layout: 'standard', duration: 15 },
    { id: 'p2', advertiser: { name: 'TechStart', verified: true }, content: { headline: 'Scale Your Business', description: 'Enterprise tools at startup prices.', ctaText: 'Free Trial' }, media: { type: 'image', items: [{ url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80' }] }, layout: 'fullscreen', duration: 15 },
  ];

  const premiumAds   = adverts.length > 0 ? adverts : staticPremium;
  const wallPremAds  = [{ slotId: 'wp1', ads: [{ id: 'pw1', advertiser: { name: 'SmartTech', verified: true }, content: { headline: 'AI for Business', description: 'Transform with AI.', ctaText: 'Learn More' }, media: { type: 'image' as const, items: [{ url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80' }] }, layout: 'standard' as const, duration: 15 }] }];

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <Header />

      <main className="container max-w-7xl mx-auto px-4 py-6 flex-1">

        {/* API error banner */}
        {apiError && (
          <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3">
            <div className="flex items-start gap-2">
              <WifiOff className="h-4 w-4 mt-0.5 shrink-0 text-yellow-700" />
              <div className="flex-1 text-sm text-yellow-800">
                <p className="font-semibold">Demo mode — showing sample data</p>
                <p className="mt-0.5 text-yellow-700">
                  {apiErrorMsg}.{' '}
                  <a href={`${API_BASE}/test.php`} target="_blank" rel="noreferrer" className="underline font-medium">
                    Run diagnostics →
                  </a>
                </p>
              </div>
              <button onClick={() => window.location.reload()} className="text-yellow-700 hover:text-yellow-900" title="Retry">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {apiReachable === null && (
          <div className="mb-4 flex items-center gap-2 rounded-md border bg-muted/30 px-4 py-2 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Connecting to API…
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">

          <aside className="lg:col-span-1 space-y-6 min-w-0">
            <GreetingSection />
            <Card className="p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-primary/5 to-primary/10">
              <Button onClick={() => setChatOpen(true)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 sm:py-6 text-base sm:text-lg shadow-md hover:shadow-lg transition-all group" size="lg">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" />
                Chat with Friends
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-2">Start a conversation with your friends</p>
            </Card>
          </aside>

          <div className="lg:col-span-2 space-y-6 min-w-0">
            <CampaignBannerRotation audienceType="mobigate_interface" compact={false} maxBanners={3} />
            <CreatePostDialog />

            {loadingWall ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <WallStatusCarousel items={wallData} adSlots={adSlots} premiumAdSlots={wallPremAds} view={wallView} onViewChange={setWallView} filter={wallFilter} onFilterChange={setWallFilter} onEdit={p => { setEditingPost(p as any); setEditOpen(true); }} onDelete={handleDeletePost} onItemClick={openWallGallery} showFriendsSuggestions={true} />
            )}

            {editingPost && <EditPostDialog post={editingPost} open={editOpen} onOpenChange={setEditOpen} onSave={handleSavePost} />}

            <div className="space-y-0">
              <ELibrarySection activeFilter={contentFilter} onFilterChange={setContentFilter} />

              {loadingFeed ? (
                <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="text-sm">Loading posts…</span>
                </div>
              ) : displayed.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">No posts found.</div>
              ) : (
                <div className="space-y-6 mt-6">
                  {displayed.map((post, i) => (
                    <div key={post.id ?? i}>
                      <FeedPost {...(post as any)} onEdit={() => { setEditingPost(post as any); setEditOpen(true); }} onDelete={() => handleDeletePost(post.id ?? '')} />
                      {(i + 1) % 4 === 0 && i < displayed.length - 1 && (
                        <div className="my-8">
                          <PremiumAdRotation slotId={`fp-${Math.floor((i+1)/4)}`} ads={[premiumAds[Math.floor((i+1)/4) % premiumAds.length]]} context="feed" />
                        </div>
                      )}
                      {(i + 1) % 10 === 0 && i < displayed.length - 1 && (
                        <div className="my-6"><PeopleYouMayKnow /></div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {(hasMore || canLess) && (
                <div className="flex justify-center items-center gap-6 mt-8 mb-4">
                  {hasMore && <Button onClick={() => setVisibleCount(v => Math.min(v + 20, filtered.length))} variant="outline" size="lg" className="text-3xl font-bold text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-destructive/20 px-8 py-6 rounded-xl">...more</Button>}
                  {canLess  && <Button onClick={() => { setVisibleCount(20); window.scrollTo({ top: 0, behavior: 'smooth' }); }} variant="outline" size="lg" className="text-3xl font-bold text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-destructive/20 px-8 py-6 rounded-xl">Less...</Button>}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ChatWithFriendsDialog open={chatOpen} onOpenChange={setChatOpen} />
      <MediaGalleryViewer open={galleryOpen} onOpenChange={setGalleryOpen} items={galleryItems} initialIndex={galleryIdx} showActions={true} galleryType="wall-status" />
    </div>
  );
};

export default Index;
