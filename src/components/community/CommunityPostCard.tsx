import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ThumbsUp, MessageCircle, Share2, Gift,
  Flag, UserPlus, UserCheck, MoreHorizontal,
  Eye, Heart, Trash2,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import type { CommunityPost } from "@/hooks/useCommunityPosts";

interface CommunityPostCardProps {
  post: CommunityPost;
  onLike:        (postId: string, isLiked: boolean) => void;
  onDelete:      (postId: string) => void;
  onComment:     (postId: string, content: string) => Promise<boolean>;
  onView:        (postId: string) => void;
  onOpenDetail?: (post: CommunityPost) => void;
}

// Colour for each post type badge
const TYPE_BADGE: Record<string, string> = {
  vibe:          "bg-red-500",
  event:         "bg-orange-500",
  announcement:  "bg-yellow-500",
  content:       "bg-purple-500",
  "special-event":"bg-green-500",
  photo:         "bg-red-500",
  video:         "bg-indigo-500",
  article:       "bg-blue-500",
  status:        "bg-gray-600",
};

export function CommunityPostCard({
  post, onLike, onDelete, onComment, onView, onOpenDetail,
}: CommunityPostCardProps) {
  const navigate  = useNavigate();
  const [followed, setFollowed] = useState(false);

  const timeAgo = post.timestamp
    ? formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })
    : "";

  const badgeClass = TYPE_BADGE[post.type] || "bg-gray-600";

  const openComments = () => {
    if (onOpenDetail) onOpenDetail(post);
  };

  const handleFollow = () => {
    setFollowed(f => !f);
    toast.success(followed ? `Unfollowed ${post.author}` : `Following ${post.author}`);
  };

  const handleGift = () => toast("Gift feature coming soon!");
  const handleReport = () => toast("Report submitted");
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  return (
    <Card className="overflow-hidden rounded-xl border border-border shadow-sm">

      {/* ── Media (image / video) ─────────────────────────────────────── */}
      {(post.imageUrl || post.videoUrl) && (
        <div className="relative">
          {/* Type badge — top-left */}
          {post.type && post.type !== "status" && (
            <span className={cn(
              "absolute top-2 left-2 z-10 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md",
              badgeClass
            )}>
              {post.type}
            </span>
          )}

          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title || "Post"}
              className="w-full object-cover max-h-64 cursor-pointer"
              onClick={openComments}
            />
          ) : post.videoUrl ? (
            <video src={post.videoUrl} controls className="w-full max-h-64 object-cover" />
          ) : null}
        </div>
      )}

      {/* ── Text content ──────────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-2 space-y-1">
        {/* Type badge when no media */}
        {!post.imageUrl && !post.videoUrl && post.type && post.type !== "status" && (
          <span className={cn(
            "inline-block text-white text-[11px] font-semibold px-2 py-0.5 rounded-md mb-1",
            badgeClass
          )}>
            {post.type}
          </span>
        )}

        {/* Title */}
        {post.title && (
          <h3 className="font-semibold text-sm text-foreground leading-snug">{post.title}</h3>
        )}

        {/* Description */}
        {post.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {post.description}
          </p>
        )}

        {/* Fee / stats line */}
        <p className="text-xs text-muted-foreground pt-1">
          Fee: 0 Mobi &nbsp;|&nbsp;
          <Eye className="inline h-3 w-3 mb-0.5" /> {(post.views || 0).toLocaleString()} Views &nbsp;|&nbsp;
          <MessageCircle className="inline h-3 w-3 mb-0.5" /> {post.comments.toLocaleString()} Comments &nbsp;|&nbsp;
          <Heart className="inline h-3 w-3 mb-0.5" /> {post.likes.toLocaleString()} Likes
        </p>
      </div>

      <Separator />

      {/* ── Author row ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => post.authorId && navigate(`/profile/${post.authorId}`)}
        >
          <div className="relative">
            <Avatar className="h-7 w-7">
              <AvatarImage src={post.authorImage} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                {(post.author || "U")[0]}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-background" />
          </div>
          <span className="text-xs text-muted-foreground">
            By <span className="font-semibold text-foreground hover:text-primary">{post.author}</span>
          </span>
        </div>

        {/* Owner delete option */}
        {post.isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(post.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Separator />

      {/* ── Action bar ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5 px-3 py-1.5 flex-wrap">
        {/* Like */}
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 px-2 gap-1 text-xs",
            post.isLiked ? "text-primary font-semibold" : "text-muted-foreground"
          )}
          onClick={() => onLike(post.id, post.isLiked)}
        >
          <ThumbsUp className={cn("h-3.5 w-3.5", post.isLiked && "fill-primary")} />
          {post.likes}
        </Button>

        {/* Comment — opens modal */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 gap-1 text-xs text-muted-foreground"
          onClick={openComments}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {post.comments}
        </Button>

        {/* Share */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 gap-1 text-xs text-muted-foreground"
          onClick={handleShare}
        >
          <Share2 className="h-3.5 w-3.5" />
          0
        </Button>

        <div className="flex-1" />

        {/* Follow */}
        <Button
          variant="outline"
          size="sm"
          className={cn("h-7 text-xs px-2.5",
            followed && "bg-primary text-primary-foreground border-primary"
          )}
          onClick={handleFollow}
        >
          {followed
            ? <><UserCheck className="h-3 w-3 mr-1" />Following</>
            : <><UserPlus className="h-3 w-3 mr-1" />Follow</>}
        </Button>

        {/* Gift */}
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs px-2.5"
          onClick={handleGift}
        >
          <Gift className="h-3 w-3 mr-1" />Gift
        </Button>

        {/* Report */}
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs px-2.5 text-muted-foreground"
          onClick={handleReport}
        >
          <Flag className="h-3 w-3 mr-1" />Report
        </Button>
      </div>
    </Card>
  );
}
