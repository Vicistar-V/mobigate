import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, Heart, Share2, UserPlus, Play, Music, FileText } from "lucide-react";
import { useState, useEffect } from "react";
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
  imageUrl?: string;   // thumbnail — shown on the card
  mediaUrl?: string;   // actual media file — used for playback
  fee?: string;
  isOwner?: boolean;
  isLiked?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

// Icon overlay for non-photo types
const TypeOverlay = ({ type }: { type: string }) => {
  const map: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    Video:   { icon: <Play   className="h-8 w-8" />, label: "Video",   color: "bg-black/60" },
    Audio:   { icon: <Music  className="h-8 w-8" />, label: "Audio",   color: "bg-purple-900/70" },
    PDF:     { icon: <FileText className="h-8 w-8" />, label: "PDF",   color: "bg-red-900/70" },
    Article: { icon: <FileText className="h-8 w-8" />, label: "Article", color: "bg-blue-900/70" },
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

export const FeedPost = ({
  id,
  title,
  subtitle,
  description,
  author,
  authorProfileImage,
  userId = "1",
  status,
  views,
  comments,
  likes,
  followers,
  type,
  imageUrl,    // thumbnail
  mediaUrl,    // actual video/audio/pdf url
  fee = "0",
  isOwner = false,
  isLiked: initialIsLiked = false,
  onEdit,
  onDelete,
}: FeedPostProps) => {
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

  // Sync from props when feed reloads
  useEffect(() => { setIsLiked(initialIsLiked); },          [initialIsLiked]);
  useEffect(() => { setLikeCount(parseInt(likes) || 0); },  [likes]);
  useEffect(() => { setCommentCount(parseInt(comments) || 0); }, [comments]);
  useEffect(() => { setViewCount(parseInt(views) || 0); },  [views]);

  const shareUrl = generateShareUrl("post", id || "unknown");

  // The URL to actually play — for video/audio use mediaUrl, for photo use imageUrl
  const playbackUrl = (type === "Video" || type === "Audio") ? (mediaUrl || imageUrl || "") : (imageUrl || "");

  // Record view
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

  // Like
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

  // Follow
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

  const formatCount = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(n);

  const openMedia = () => {
    if (playbackUrl || imageUrl) {
      setMediaGalleryOpen(true);
      recordView();
    }
  };

  // Pass the playback URL (not thumbnail) to the gallery
  const mediaItem: MediaItem = {
    id,
    url:         playbackUrl,     // actual video/audio/image for playback
    thumbnailUrl: imageUrl,        // thumbnail shown while loading
    type:        type.toLowerCase() === "video" ? "video"
               : type.toLowerCase() === "audio" ? "audio"
               : "photo",
    title, description: subtitle || description,
    author, authorImage: authorProfileImage, authorUserId: userId,
    likes: likeCount, comments: commentCount,
    followers, isLiked, isOwner,
  };

  const hasThumbnail = !!imageUrl;
  const hasMedia     = !!(playbackUrl || imageUrl);

  return (
    <>
      <Card
        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={openMedia}
      >
        {/* Media area */}
        {hasMedia && (
          <div className="relative h-48 bg-muted">
            {/* Always show thumbnail/image as the card preview */}
            {imageUrl ? (
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <TypeOverlay type={type} />
              </div>
            )}
            {/* Overlay play icon for video/audio even when thumbnail exists */}
            {(type === "Video" || type === "Audio") && imageUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                <div className="bg-black/60 rounded-full p-3">
                  {type === "Video"
                    ? <Play  className="h-8 w-8 text-white fill-white" />
                    : <Music className="h-8 w-8 text-white" />
                  }
                </div>
              </div>
            )}
            {/* No thumbnail — show type overlay */}
            {!imageUrl && <TypeOverlay type={type} />}
            <Badge className="absolute top-2 left-2" variant="destructive">{type}</Badge>
          </div>
        )}

        <div className="p-4 space-y-3">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-xl leading-tight line-clamp-2">{title}</h3>
              {subtitle    && <p className="text-lg text-muted-foreground mt-1 line-clamp-2">{subtitle}</p>}
              {description && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{description}</p>}
            </div>
            {isOwner && onEdit && onDelete && (
              <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
                <PostOptionsMenu onEdit={onEdit} onDelete={onDelete} />
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 text-base flex-wrap">
            <span className="text-emerald-600 font-medium whitespace-nowrap">Fee: {fee} Mobi</span>
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

          {/* Author */}
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

      {hasMedia && (
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
