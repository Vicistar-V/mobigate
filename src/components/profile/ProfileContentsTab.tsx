import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Eye, Heart, MessageCircle, Video, FileText, Image,
  Music, Link, ChevronDown, ChevronUp, FileIcon,
  MoreHorizontal, UserPlus, Share2, MoveHorizontal, MoveVertical, Loader2,
} from "lucide-react";
import { Post } from "@/data/posts";
import { useToast } from "@/hooks/use-toast";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";
import { CommentDialog } from "@/components/CommentDialog";
import { ShareDialog } from "@/components/ShareDialog";
import { generateShareUrl } from "@/lib/shareUtils";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";


const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

// Safe fallback ad slots — never undefined
const CONTENT_AD_SLOTS = [
  {
    slotId: "profile-content-ad-1",
    ads: [{
      id: "pca-1",
      advertiser: { name: "Mobigate Premium", verified: true },
      content: { headline: "Upgrade to Premium", description: "Get more visibility for your content.", ctaText: "Learn More", ctaUrl: "#" },
      media: { type: "image" as const, items: [{ url: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=80" }] },
      layout: "standard" as const,
      duration: 10,
    }],
  },
];

const getIcon = (type: string) => {
  const map: Record<string, React.ReactNode> = {
    Video: <Video className="h-8 w-8 text-muted-foreground" />,
    Article: <FileText className="h-8 w-8 text-muted-foreground" />,
    Photo: <Image className="h-8 w-8 text-muted-foreground" />,
    Audio: <Music className="h-8 w-8 text-muted-foreground" />,
    PDF: <FileText className="h-8 w-8 text-muted-foreground" />,
    URL: <Link className="h-8 w-8 text-muted-foreground" />,
  };
  return map[type] || <FileText className="h-8 w-8 text-muted-foreground" />;
};

interface ProfileContentsTabProps {
  userName: string;
  userId: string;
}

export const ProfileContentsTab = ({ userName, userId }: ProfileContentsTabProps) => {
  const { toast } = useToast();
  const [posts,         setPosts]         = useState<Post[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [sortBy,        setSortBy]        = useState("recent");
  const [visibleCount,  setVisibleCount]  = useState(15);
  const [filter,        setFilter]        = useState("all");
  const [likedPosts,    setLikedPosts]    = useState<Set<string>>(new Set());
  const [viewMode,      setViewMode]      = useState<"horizontal"|"vertical">("vertical");
  const [galleryOpen,   setGalleryOpen]   = useState(false);
  const [galleryItems,  setGalleryItems]  = useState<MediaItem[]>([]);
  const [galleryIdx,    setGalleryIdx]    = useState(0);
  const [commentOpen,   setCommentOpen]   = useState(false);
  const [commentPost,   setCommentPost]   = useState<Post | null>(null);
  const [shareOpen,     setShareOpen]     = useState(false);
  const [shareData,     setShareData]     = useState({ url: "", title: "", description: "" });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/posts/feed.php?user_id=${userId}&limit=100`, { credentials: "include" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPosts(data.map((p: any) => ({
        id:           p.id,
        title:        p.title,
        subtitle:     p.subtitle || undefined,
        description:  p.content || undefined,
        author:       p.author_name,
        authorProfileImage: p.author_profile_photo || undefined,
        userId:       p.user_id,
        type:         (p.post_type.charAt(0).toUpperCase() + p.post_type.slice(1)) as Post["type"],
        imageUrl:     p.thumbnail_url || p.media_url || undefined,
        views:        String(p.view_count || 0),
        likes:        String(p.like_count || 0),
        comments:     String(p.comment_count || 0),
        followers:    String(p.author_follower_count || 0),
        fee:          p.access_fee || "0",
        status:       "Online" as const,
        isOwner:      p.is_owner,
        isLiked:      p.is_liked,
      })));
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = likedPosts.has(postId);
    setLikedPosts(prev => { const s = new Set(prev); isLiked ? s.delete(postId) : s.add(postId); return s; });
    try {
      await fetch(`${API_BASE}/posts/like.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId }),
      });
    } catch {}
    toast({ title: isLiked ? "Removed like" : "Liked!" });
  };

  const filtered = useMemo(() => {
    let p = filter === "all" ? posts : posts.filter(p => p.type === filter);
    if (sortBy === "recent")  p = [...p].reverse();
    if (sortBy === "popular") p = [...p].sort((a, b) => parseInt(b.likes) - parseInt(a.likes));
    return p;
  }, [posts, filter, sortBy]);

  const visible   = filtered.slice(0, visibleCount);
  const hasMore   = visibleCount < filtered.length;
  const canLess   = visibleCount > 15;



  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4 pb-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["all","Video","Photo","Article","Audio","PDF","URL"].map(f => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="h-8">
              {f === "all" ? "All" : f}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8" onClick={() => setViewMode(v => v === "horizontal" ? "vertical" : "horizontal")}>
            {viewMode === "horizontal" ? <MoveVertical className="h-4 w-4" /> : <MoveHorizontal className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No content yet</p>
        </div>
      ) : (
        <div className={`grid gap-4 ${viewMode === "vertical" ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"}`}>
          {visible.map((post, index) => {
            const shouldShowAd = (index + 1) % 6 === 0;
            const shouldShowPeople = (index + 1) % 12 === 0;
            return (
              <React.Fragment key={post.id}>
                <Card className="overflow-hidden hover:shadow-md cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => {
                    const items: MediaItem[] = visible.map(p => ({
                      id: p.id, url: p.imageUrl || "",
                      type: p.type.toLowerCase() === "video" ? "video" : p.type.toLowerCase() === "audio" ? "audio" : "photo",
                      title: p.title, description: p.subtitle, author: p.author,
                      authorImage: p.authorProfileImage, likes: parseInt(p.likes) || 0,
                      comments: parseInt(p.comments) || 0, isLiked: likedPosts.has(p.id), isOwner: p.isOwner,
                    }));
                    setGalleryItems(items); setGalleryIdx(index); setGalleryOpen(true);
                  }}>
                  <div className="w-full aspect-video bg-muted flex items-center justify-center">
                    {post.imageUrl
                      ? <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                      : getIcon(post.type)
                    }
                  </div>
                  <div className="p-3 space-y-2">
                    <h3 className="font-semibold text-base line-clamp-2">{post.title}</h3>
                    <Badge variant="secondary" className="text-xs">{post.type}</Badge>
                    {post.subtitle && <p className="text-sm text-muted-foreground line-clamp-2">{post.subtitle}</p>}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap pt-1">
                      <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{post.views}</span>
                      <button onClick={e => handleLike(post.id, e)} className={`flex items-center gap-1 ${likedPosts.has(post.id) ? "text-red-500" : ""}`}>
                        <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />{post.likes}
                      </button>
                      <button onClick={e => { e.stopPropagation(); setCommentPost(post); setCommentOpen(true); }} className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />{post.comments}
                      </button>
                      <button onClick={e => { e.stopPropagation(); setShareData({ url: generateShareUrl("post", post.id), title: post.title, description: post.subtitle || "" }); setShareOpen(true); }} className="flex items-center gap-1 ml-auto">
                        <Share2 className="h-4 w-4" />
                      </button>
                      {post.fee && post.fee !== "0" && <span className="font-semibold text-emerald-600">{post.fee} Mobi</span>}
                    </div>
                  </div>
                </Card>
                {shouldShowAd && (
                  <div className="w-full my-2">
                    <PremiumAdRotation slotId={CONTENT_AD_SLOTS[0].slotId} ads={CONTENT_AD_SLOTS[0].ads} context="profile" />
                  </div>
                )}
                {shouldShowPeople && <div className="w-full my-2"><PeopleYouMayKnow /></div>}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {(hasMore || canLess) && (
        <div className="flex gap-3 justify-center pt-4">
          {hasMore && <Button onClick={() => setVisibleCount(v => Math.min(v + 15, filtered.length))} variant="outline"><ChevronDown className="h-4 w-4 mr-1" />Load More</Button>}
          {canLess  && <Button onClick={() => setVisibleCount(15)} variant="ghost"><ChevronUp className="h-4 w-4 mr-1" />Show Less</Button>}
        </div>
      )}

      <MediaGalleryViewer open={galleryOpen} onOpenChange={setGalleryOpen} items={galleryItems} initialIndex={galleryIdx} showActions galleryType="post" />
      {commentPost && <CommentDialog open={commentOpen} onOpenChange={setCommentOpen} post={{ id: commentPost.id, title: commentPost.title, subtitle: commentPost.subtitle, author: commentPost.author, authorProfileImage: commentPost.authorProfileImage, type: commentPost.type, imageUrl: commentPost.imageUrl, views: commentPost.views, likes: commentPost.likes }} />}
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} shareUrl={shareData.url} title={shareData.title} description={shareData.description} />
    </div>
  );
};
