import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, Heart, Share2, UserPlus, Pencil } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PostOptionsMenu } from "@/components/PostOptionsMenu";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";
import { CommentDialog } from "@/components/CommentDialog";
import { ShareDialog } from "@/components/ShareDialog";
import { generateShareUrl } from "@/lib/shareUtils";
import { toast } from "sonner";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

interface FeedPostProps {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  author: string;
  authorProfileImage?: string;
  userId?: string;
  status: "Online" | "Offline";
  views: string;
  comments: string;
  likes: string;
  followers?: string;
  type: "Video" | "Article" | "Photo" | "Audio" | "PDF" | "URL";
  imageUrl?: string;
  mediaUrl?: string;
  fee?: string;
  isOwner?: boolean;
  isLiked?: boolean;
  isMonetized?: boolean;
  hasPaid?: boolean;       // true if current user already paid
  onEdit?: () => void;
  onDelete?: () => void;
}

// Icon overlay for non-photo types
const TypeOverlay = ({ type }: { type: string }) => {
  const map: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    Video:   { icon: <Play      className="h-8 w-8" />, label: "Video",   color: "bg-black/60" },
    Audio:   { icon: <Music     className="h-8 w-8" />, label: "Audio",   color: "bg-purple-900/70" },
    PDF:     { icon: <FileText  className="h-8 w-8" />, label: "PDF",     color: "bg-red-900/70" },
    Article: { icon: <FileText  className="h-8 w-8" />, label: "Article", color: "bg-blue-900/70" },
  };
  const cfg = map[type];
  if (!cfg) return null;
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${cfg.color} text-white`}>
      {cfg.icon}
      <span className="text-sm font-semibold">{cfg.label}</span>
    </div>
  );
};

// ── Paywall Gate Component ────────────────────────────────────────────────────
const PaywallGate = ({
  fee, title, onPay, paying,
}: { fee: number; title: string; onPay: () => void; paying: boolean }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-t-lg gap-3 px-4">
    <div className="w-14 h-14 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center">
      <Lock className="h-6 w-6 text-amber-400" />
    </div>
    <div className="text-center">
      <p className="text-white font-bold text-base">Premium Content</p>
      <p className="text-white/70 text-xs mt-0.5">Unlock to view "{title}"</p>
    </div>
    <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-2 text-center">
      <p className="text-amber-400 font-black text-2xl">{fee.toLocaleString()} Mobi</p>
      <p className="text-amber-300/70 text-xs">one-time access fee</p>
    </div>
    <Button
      size="sm"
      onClick={onPay}
      disabled={paying}
      className="bg-amber-500 hover:bg-amber-400 text-white font-bold gap-2 px-6"
    >
      {paying
        ? <><Loader2 className="h-4 w-4 animate-spin" />Processing...</>
        : <><Wallet className="h-4 w-4" />Pay {fee.toLocaleString()} Mobi to Unlock</>
      }
    </Button>
    <p className="text-white/40 text-xs">Fee deducted from your Mobi wallet</p>
  </div>
);

export const FeedPost = ({
  id, title, subtitle, description, author, authorProfileImage,
  userId = "1", status, views, comments, likes, followers,
  type, imageUrl, mediaUrl, fee = "0",
  isOwner = false, isLiked: initialIsLiked = false,
  isMonetized = false, hasPaid: initialHasPaid = false,
  onEdit, onDelete,
}: FeedPostProps) => {
  const feeNum = parseFloat(fee) || 0;
  const isPaid  = isMonetized && feeNum > 0;

  const [isLiked,       setIsLiked]       = useState(initialIsLiked);
  const [likeCount,     setLikeCount]     = useState(parseInt(likes) || 0);
  const [commentCount,  setCommentCount]  = useState(parseInt(comments) || 0);
  const [viewCount,     setViewCount]     = useState(parseInt(views) || 0);
  const [isFollowing,   setIsFollowing]   = useState(false);
  const [followerCount, setFollowerCount] = useState(
    followers ? parseInt(followers.replace(/[^0-9]/g, "")) || 0 : 0
  );
  const [mediaGalleryOpen,  setMediaGalleryOpen]  = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [shareDialogOpen,   setShareDialogOpen]   = useState(false);

  // Paywall:
  // - Free posts → always open (no API check needed)
  // - Owner → always open
  // - Paid + already unlocked (from feed) → open via API verify
  // - Paid + not unlocked → show paywall, charge on click
  const [hasAccess,  setHasAccess]  = useState(!isPaid || isOwner);
  const [paying,     setPaying]     = useState(false);
  const [showPaywall,setShowPaywall]= useState(false);
  const [verified,   setVerified]   = useState(!isPaid || isOwner); // API-verified access

  useEffect(() => { setIsLiked(initialIsLiked); },               [initialIsLiked]);
  useEffect(() => { setLikeCount(parseInt(likes) || 0); },       [likes]);
  useEffect(() => { setCommentCount(parseInt(comments) || 0); }, [comments]);
  useEffect(() => { setViewCount(parseInt(views) || 0); },       [views]);
  // Update access when props change
  useEffect(() => {
    const free = !isPaid || isOwner;
    setHasAccess(free);
    setVerified(free);
  }, [isPaid, isOwner]);

  const shareUrl = generateShareUrl("post", id || "unknown");
  const playbackUrl = (type === "Video" || type === "Audio") ? (mediaUrl || imageUrl || "") : (imageUrl || "");

  // ── Access check + payment ────────────────────────────────────────────────
  // Called for ALL paid posts — whether first time (charges) or already paid (just verifies)
  const handleAccessAndOpen = async () => {
    if (!id) return;
    if (verified && hasAccess) {
      // Already API-verified, just open
      setMediaGalleryOpen(true);
      recordView();
      return;
    }
    setPaying(true);
    try {
      const res  = await fetch(`${API_BASE}/posts/access.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: id }),
      });
      const data = await res.json();
      if (data.success && data.access) {
        setHasAccess(true);
        setVerified(true);
        setShowPaywall(false);
        if (!data.already_paid) {
          // New payment — show success
          toast.success(`🔓 Unlocked! ${feeNum.toLocaleString()} Mobi deducted. New balance: ${data.new_balance?.toLocaleString()} Mobi`);
        }
        setMediaGalleryOpen(true);
        recordView();
      } else {
        if (data.code === "INSUFFICIENT_BALANCE") {
          toast.error(`❌ Insufficient balance. You need ${feeNum.toLocaleString()} Mobi but have ${data.balance?.toLocaleString()} Mobi.`);
        } else {
          toast.error(data.error || "Access denied. Please try again.");
        }
        // Keep paywall shown
      }
    } catch {
      toast.error("Cannot reach server. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  // Alias for the paywall gate component
  const handlePay = handleAccessAndOpen;

  // ── Record view ─────────────────────────────────────────────────────────────
  const recordView = async () => {
    if (!id) return;
    try {
      const res  = await fetch(`${API_BASE}/posts/view.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: id }),
      });
      const data = await res.json();
      if (data.success && data.counted) setViewCount(data.view_count);
    } catch {}
  };

  // ── Handle click on post ─────────────────────────────────────────────────
  const handlePostClick = () => {
    if (!isPaid) {
      // Free post — open directly
      if (playbackUrl || imageUrl) {
        setMediaGalleryOpen(true);
        recordView();
      }
      return;
    }
    // Paid post — ALWAYS go through API access check (even if hasPaid=true from feed)
    // This prevents client-side bypass
    if (!hasAccess || !verified) {
      setShowPaywall(true);
      return;
    }
    // Already API-verified — open directly
    if (playbackUrl || imageUrl) {
      setMediaGalleryOpen(true);
      recordView();
    }
  };

  // ── Like ──────────────────────────────────────────────────────────────────
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount(c => wasLiked ? c - 1 : c + 1);
    try {
      const res  = await fetch(`${API_BASE}/posts/like.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: id }),
      });
      const data = await res.json();
      if (data.success) { setIsLiked(data.liked); setLikeCount(data.like_count); }
      else { setIsLiked(wasLiked); setLikeCount(c => wasLiked ? c + 1 : c - 1); toast.error(data.error || "Could not like"); }
    } catch {
      setIsLiked(wasLiked);
      setLikeCount(c => wasLiked ? c + 1 : c - 1);
      toast.error("Cannot reach server");
    }
  };

  // ── Follow ────────────────────────────────────────────────────────────────
  const handleFollow = async () => {
    if (!userId) return;
    const was = isFollowing;
    setIsFollowing(!was);
    setFollowerCount(c => was ? c - 1 : c + 1);
    try {
      await fetch(`${API_BASE}/friends/follow.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ following_id: userId }),
      });
      toast.success(was ? `Unfollowed ${author}` : `Now following ${author}`);
    } catch {
      setIsFollowing(was);
      setFollowerCount(c => was ? c + 1 : c - 1);
    }
  };

  const formatCount = (n: number) =>
    n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n/1_000).toFixed(1)}K` : String(n);

  const hasMedia = !!(playbackUrl || imageUrl);

  const mediaItem: MediaItem = {
    id, url: playbackUrl,
    thumbnailUrl: imageUrl,
    type: type.toLowerCase() === "video" ? "video" : type.toLowerCase() === "audio" ? "audio" : "photo",
    title, description: subtitle || description,
    author, authorImage: authorProfileImage, authorUserId: userId,
    likes: likeCount, comments: commentCount,
    followers, isLiked, isOwner,
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={handlePostClick}>

        {/* Media area */}
        {hasMedia && (
          <div className="relative h-48 bg-muted">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            <Badge className="absolute top-2 left-2" variant="destructive">
              {type}
            </Badge>
            {isOwner && onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 shadow-md"
                aria-label="Edit this post"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
            )}
          </div>
        )}
      
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-xl leading-tight line-clamp-2">{title}</h3>
            {subtitle && (
              <p className="text-lg text-muted-foreground mt-1 line-clamp-2">{subtitle}</p>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{description}</p>
            )}
          </div>
          {isOwner && onEdit && onDelete && (
            <div className="flex-shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              {!imageUrl && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold px-2.5 py-1"
                  aria-label="Edit this post"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
              )}
              <PostOptionsMenu onEdit={onEdit} onDelete={onDelete} />
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-xl leading-tight line-clamp-2">{title}</h3>
                {isPaid && !hasAccess && (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold shrink-0">
                    <Lock className="h-3 w-3" />{feeNum.toLocaleString()} Mobi
                  </span>
                )}
                {isPaid && hasAccess && !isOwner && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold shrink-0">
                    ✓ Unlocked
                  </span>
                )}
                {isOwner && isPaid && (
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-bold shrink-0">
                    🔒 Your paid post
                  </span>
                )}
              </div>
              {subtitle    && <p className="text-lg text-muted-foreground mt-0.5 line-clamp-2">{subtitle}</p>}
              {/* Only show description if has access or it's free */}
              {description && hasAccess && <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{description}</p>}
              {description && !hasAccess && <p className="text-sm text-muted-foreground/50 mt-1 italic">🔒 Description hidden — unlock to read</p>}
            </div>
            {isOwner && onEdit && onDelete && (
              <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
                <PostOptionsMenu onEdit={onEdit} onDelete={onDelete} />
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 text-base flex-wrap">
            <span className={`font-medium whitespace-nowrap ${isPaid ? "text-amber-600 font-bold" : "text-emerald-600"}`}>
              {isPaid ? `🔒 ${feeNum.toLocaleString()} Mobi` : "🆓 Free"}
            </span>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-1 text-red-600 whitespace-nowrap">
              <Eye className="h-4 w-4" /><span>{formatCount(viewCount)} Views</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <button
              className="flex items-center gap-1 text-red-600 whitespace-nowrap hover:underline"
              onClick={e => { e.stopPropagation(); setCommentDialogOpen(true); }}
            >
              <MessageSquare className="h-4 w-4" /><span>{formatCount(commentCount)} Comments</span>
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              className={`flex items-center gap-1 whitespace-nowrap hover:underline ${isLiked ? "text-red-600 font-semibold" : "text-red-600"}`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span>{formatCount(likeCount)} Likes</span>
            </button>
          </div>

          {/* Paywall CTA inside card — shown when locked and not showing overlay */}
          {!hasAccess && !showPaywall && (
            <div
              className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-800">
                  Pay {feeNum.toLocaleString()} Mobi to unlock
                </span>
              </div>
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold gap-1.5 shrink-0"
                disabled={paying}
                onClick={e => { e.stopPropagation(); handleAccessAndOpen(); }}
              >
                {paying ? <><span className="h-3.5 w-3.5 animate-spin inline-block border-2 border-white border-t-transparent rounded-full" />Processing...</> : <><Lock className="h-3.5 w-3.5" />Unlock</>}
              </Button>
            </div>
          )}

          {/* Author row */}
          <div className="flex items-center justify-between pt-2 border-t">
            <Link
              to={`/profile/${userId}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-1"
              onClick={e => e.stopPropagation()}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={authorProfileImage} alt={author} />
                <AvatarFallback>{author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-lg font-medium">By {author}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full ${status === "Online" ? "bg-emerald-500" : "bg-red-500"}`} />
                    <p className={`text-base font-medium ${status === "Online" ? "text-emerald-600" : "text-red-600"}`}>{status}</p>
                  </div>
                  {!isOwner && followers && (
                    <Button variant={isFollowing ? "secondary" : "default"} size="sm"
                      onClick={e => { e.preventDefault(); e.stopPropagation(); handleFollow(); }}
                      className="gap-1.5 h-6 px-2 text-sm">
                      <UserPlus className="h-3 w-3" />
                      <span className="hidden sm:inline">{isFollowing ? "Following" : "Follow"}</span>
                      <span className="text-base opacity-80">({formatCount(followerCount)})</span>
                    </Button>
                  )}
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-1">
              <button onClick={handleLike}
                className={`p-2 rounded-full transition-colors ${isLiked ? "bg-red-100 text-red-600" : "bg-muted hover:bg-muted/80"}`}>
                <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button onClick={e => { e.stopPropagation(); setShareDialogOpen(true); }}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              {!hasMedia && <Badge variant={type === "Video" ? "destructive" : "secondary"}>{type}</Badge>}
            </div>
          </div>
        </div>
      </Card>

      {hasMedia && verified && hasAccess && (
        <MediaGalleryViewer
          open={mediaGalleryOpen}
          onOpenChange={setMediaGalleryOpen}
          items={[mediaItem]}
          initialIndex={0}
          showActions={true}
          galleryType="post"
        />
      )}

      <CommentDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        postId={id}
        postTitle={title}
        onCommentAdded={() => setCommentCount(c => c + 1)}
        onCommentDeleted={() => setCommentCount(c => Math.max(c - 1, 0))}
        post={{ id, title, subtitle, author, authorProfileImage, type, imageUrl, views, likes: likeCount.toString() }}
      />

      <ShareDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}
        shareUrl={shareUrl} title={title} description={subtitle || description} />
    </>
  );
};
