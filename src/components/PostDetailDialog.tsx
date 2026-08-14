import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart, MessageCircle, Share2, UserPlus, Eye, Coins, X, Gift, ChevronLeft, ChevronRight, Play, ChevronUp } from "lucide-react";
import { MediaViewer } from "./MediaViewer";
import { CommentSection } from "./CommentSection";
import { SendGiftDialog } from "@/components/chat/SendGiftDialog";
import { PostViewerOptionsMenu } from "@/components/PostViewerOptionsMenu";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface PostDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
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
    fee?: string;
  };
  /** Navigate to the previous post in the list (multiple-user feed). */
  onPrev?: () => void;
  /** Navigate to the next post in the list (multiple-user feed). */
  onNext?: () => void;
  /** Whether there is a previous post available. */
  hasPrev?: boolean;
  /** Whether there is a next post available. */
  hasNext?: boolean;
  /** 1-based position indicator e.g. "3 / 12". */
  positionLabel?: string;
}

export const PostDetailDialog = ({
  open,
  onOpenChange,
  post,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  positionLabel,
}: PostDetailDialogProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(post.likes) || 0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(
    post.followers ? parseInt(post.followers.replace(/[^0-9]/g, '')) || 0 : 0
  );
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [isImageMinimized, setIsImageMinimized] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const focusCommentInput = () => {
    const commentInput = document.querySelector(
      'textarea[placeholder*="comment"]'
    ) as HTMLTextAreaElement | null;
    if (commentInput) {
      commentInput.scrollIntoView({ behavior: "smooth", block: "center" });
      commentInput.focus();
    }
  };

  const handleFollow = () => {
    if (isFollowing) {
      setFollowerCount(followerCount - 1);
    } else {
      setFollowerCount(followerCount + 1);
    }
    setIsFollowing(!isFollowing);
  };

  const handleShare = async () => {
    // Build a deep-link to this specific post when we have an id.
    const shareUrl = post.id
      ? `${window.location.origin}/post/${post.id}`
      : window.location.href;

    const authorName = post.author || "Someone";
    const profileUrl = post.userId
      ? `http://www.mobigate-app.mobi/profile/${post.userId}`
      : `http://www.mobigate-app.mobi/profile/${post.id || ""}`;

    const shareText = `Hi! ${authorName} invites you to join Mobiface community. Please click on the link below to Sign-Up Now.\n\n👉 http://www.mobigate-app.mobi/register\n\n— ${authorName} (${profileUrl})`;

    const shareData = {
      title: `Join me on Mobiface — ${authorName}`,
      text: shareText,
      url: shareUrl,
    };

    // 1) Try native mobile share sheet first.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled the share sheet — do nothing further.
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Otherwise fall through to clipboard fallback.
      }
    }

    // 2) Fallback: copy the link to the clipboard.
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        // Legacy fallback for older mobile browsers.
        const ta = document.createElement("textarea");
        ta.value = shareText;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't share or copy the link");
    }
  };

  const formatFollowerCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleAuthorClick = () => {
    onOpenChange(false);
    if (post.userId) {
      navigate(`/profile/${post.userId}`);
    }
  };

  const navEnabled = Boolean(onPrev || onNext);

  // Shared content component for both mobile and desktop
  const PostContent = () => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      if (!isMobile) return;
      const target = e.currentTarget;
      const scrollY = target.scrollTop;
      // Auto-minimize image after scrolling 100px
      if (scrollY > 100 && !isImageMinimized) {
        setIsImageMinimized(true);
      }
      setScrollProgress(Math.min(scrollY / 150, 1));
    };

    const toggleImageMinimized = () => {
      setIsImageMinimized(!isImageMinimized);
    };

    const imageOpacity = 1 - scrollProgress;

    return (
      <div className="flex flex-col h-full">
        {/* Close button - top right */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors md:hidden"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Prev / Next post navigation (multiple-user feed) */}
        {navEnabled && (
          <>
            <button
              onClick={() => hasPrev && onPrev?.()}
              disabled={!hasPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-background/85 backdrop-blur-sm shadow-md border border-border transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-background"
              aria-label="Previous post"
            >
              <ChevronLeft className="h-6 w-6 text-destructive" />
            </button>
            <button
              onClick={() => hasNext && onNext?.()}
              disabled={!hasNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-background/85 backdrop-blur-sm shadow-md border border-border transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-background"
              aria-label="Next post"
            >
              <ChevronRight className="h-6 w-6 text-destructive" />
            </button>
            {positionLabel && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 rounded-full bg-background/85 backdrop-blur-sm border border-border px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                {positionLabel}
              </div>
            )}
          </>
        )}

        {/* ===== MOBILE: COLLAPSIBLE HEADER ===== */}
        {isMobile && (
          <>
            {/* Full-size image (visible when not minimized) */}
            {!isImageMinimized && post.imageUrl && (
              <div className="shrink-0 relative">
                <div
                  className="relative w-full cursor-pointer group transition-opacity"
                  style={{ opacity: imageOpacity }}
                  onClick={() => setMediaViewerOpen(true)}
                >
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                    />
                  </AspectRatio>
                  {(post.type === "Video" || post.type === "Audio") && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm transition-transform group-hover:scale-110 group-active:scale-95">
                        <Play className="h-8 w-8 text-white fill-white translate-x-0.5" />
                      </div>
                    </div>
                  )}
                  <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-foreground border-border hover:bg-background/95" variant="outline">
                    {post.type}
                  </Badge>
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/55 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white pointer-events-none">
                    Tap to {post.type === "Video" || post.type === "Audio" ? "play" : "view"}
                  </span>
                </div>

                {/* Minimize button */}
                <button
                  onClick={toggleImageMinimized}
                  className="absolute bottom-3 left-3 z-10 flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-semibold hover:bg-black/85 active:scale-95 transition touch-manipulation"
                  aria-label="Minimize image"
                >
                  <ChevronUp className="h-3.5 w-3.5" /> Minimize
                </button>
              </div>
            )}

            {/* Minimized header with small image + title (sticky) */}
            {isImageMinimized && (
              <div className="shrink-0 sticky top-0 z-40 bg-background border-b border-border">
                <div className="px-3 py-2 flex items-center gap-2">
                  {post.imageUrl && (
                    <button
                      onClick={toggleImageMinimized}
                      className="shrink-0 relative w-14 h-14 rounded-lg border border-border overflow-hidden hover:opacity-80 active:scale-95 transition touch-manipulation"
                    >
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-foreground line-clamp-2 leading-tight">
                      {post.title}
                    </h2>
                  </div>
                  <button
                    onClick={toggleImageMinimized}
                    className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted active:scale-95 transition touch-manipulation"
                    aria-label="Expand image"
                  >
                    <ChevronUp className="h-4 w-4 rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {/* Author section (scrolls away) */}
            {!isImageMinimized && (
              <div className="shrink-0 px-5 pt-3 pb-3 border-b border-border">
                <button
                  onClick={handleAuthorClick}
                  className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity"
                >
                  <Avatar className="h-12 w-12 border-2 border-border">
                    <AvatarImage src={post.authorProfileImage} alt={post.author} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {post.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-foreground">{post.author}</p>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          post.status === "Online" ? "bg-emerald-500" : "bg-muted-foreground"
                        }`}
                      />
                      <p className="text-sm text-muted-foreground">{post.status}</p>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </>
        )}

        {/* ===== DESKTOP: FULL HEADER (always visible) ===== */}
        {!isMobile && (
          <div className="shrink-0">
            {post.imageUrl && (
              <div
                className="relative w-full cursor-pointer group"
                onClick={() => setMediaViewerOpen(true)}
              >
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                  />
                </AspectRatio>
                {(post.type === "Video" || post.type === "Audio") && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm transition-transform group-hover:scale-110 group-active:scale-95">
                      <Play className="h-8 w-8 text-white fill-white translate-x-0.5" />
                    </div>
                  </div>
                )}
                <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-foreground border-border hover:bg-background/95" variant="outline">
                  {post.type}
                </Badge>
                <span className="absolute bottom-3 right-3 rounded-full bg-black/55 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white pointer-events-none">
                  Tap to {post.type === "Video" || post.type === "Audio" ? "play" : "view"}
                </span>
              </div>
            )}

            <div className="px-6 pt-3 pb-3 border-b border-border">
              <button
                onClick={handleAuthorClick}
                className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-12 w-12 border-2 border-border">
                  <AvatarImage src={post.authorProfileImage} alt={post.author} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {post.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground">{post.author}</p>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        post.status === "Online" ? "bg-emerald-500" : "bg-muted-foreground"
                      }`}
                    />
                    <p className="text-sm text-muted-foreground">{post.status}</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ===== SCROLLABLE BODY (with sticky title) ===== */}
        <ScrollArea ref={scrollAreaRef} onScroll={handleScroll} className="flex-1 min-h-0">
          <div className="px-5 sm:px-6 py-4 space-y-4 pb-24 md:pb-6">
            {/* Sticky Title (for mobile when minimized) */}
            {isMobile && isImageMinimized && (
              <h2 className="text-lg font-bold text-foreground leading-snug sticky top-0 z-30 -mx-5 sm:-mx-6 px-5 sm:px-6 py-2 bg-background/95 backdrop-blur-sm border-b border-border/50">
                {post.title}
              </h2>
            )}

            {/* Title (full for desktop, hidden for mobile when minimized) */}
            {!isMobile && (
              <h2 className="text-lg font-semibold text-foreground leading-snug">
                {post.title}
              </h2>
            )}

            {/* Description */}
            {post.description && (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {post.description}
              </p>
            )}

            {/* Stats Row - Compact (interactive) */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              {post.fee && (
                <div className="flex items-center gap-1 px-1.5 py-1">
                  <Coins className="h-3.5 w-3.5" />
                  <span>{post.fee} Mobi</span>
                </div>
              )}
              <div className="flex items-center gap-1 px-1.5 py-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{post.views}</span>
              </div>
              <button
                type="button"
                onClick={focusCommentInput}
                className="flex items-center gap-1 rounded-full px-2 py-1 hover:bg-muted active:scale-95 transition touch-manipulation"
                aria-label="Jump to comments"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{post.comments}</span>
              </button>
              <button
                type="button"
                onClick={handleLike}
                className="flex items-center gap-1 rounded-full px-2 py-1 hover:bg-muted active:scale-95 transition touch-manipulation"
                aria-label={isLiked ? "Unlike post" : "Like post"}
                aria-pressed={isLiked}
              >
                <Heart className={`h-3.5 w-3.5 transition-colors ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                <span className={isLiked ? "text-red-500 font-medium" : ""}>{likeCount}</span>
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Comments Section - Always visible */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm sm:text-base">
                <MessageCircle className="h-4 w-4" />
                Comments ({post.comments})
              </h3>
              <CommentSection postId={post.id || "unknown"} className="border-none p-0" showHeader={false} />
            </div>
          </div>
        </ScrollArea>

        {/* Floating viewer options "..." — Rate / Hide / Report / Block */}
        <div className="absolute right-3 bottom-[calc(env(safe-area-inset-bottom)+4.5rem)] md:bottom-20 z-50">
          <PostViewerOptionsMenu
            authorName={post.author}
            onHide={() => onOpenChange(false)}
          />
        </div>


      {/* Bottom Action Bar - Mobile (in-flow so taps always register inside the Drawer) */}
      <div className="md:hidden shrink-0 bg-card border-t border-border px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] z-50">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          <button
            onClick={handleLike}
            className="flex flex-col items-center justify-center gap-0.5 py-1 touch-manipulation active:scale-95 transition-transform"
          >
            <Heart 
              className={`h-5 w-5 transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`} 
            />
            <span className="text-[10px] text-muted-foreground font-medium truncate">{likeCount}</span>
          </button>
          
          <button
            onClick={() => {
              const commentInput = document.querySelector('textarea[placeholder*="comment"]') as HTMLTextAreaElement;
              if (commentInput) {
                commentInput.focus();
                commentInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="flex flex-col items-center justify-center gap-0.5 py-1 touch-manipulation active:scale-95 transition-transform"
          >
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-medium truncate">{post.comments}</span>
          </button>
          
          <button
            onClick={() => setShowGiftDialog(true)}
            className="flex flex-col items-center justify-center gap-0.5 py-1 touch-manipulation active:scale-95 transition-transform"
          >
            <Gift className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-medium truncate">Gift</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center gap-0.5 py-1 touch-manipulation active:scale-95 transition-transform"
          >
            <Share2 className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-medium truncate">Share</span>
          </button>
          
          <button
            onClick={handleFollow}
            className="flex flex-col items-center justify-center gap-0.5 py-1 touch-manipulation active:scale-95 transition-transform"
          >
            <UserPlus 
              className={`h-5 w-5 transition-colors ${
                isFollowing ? "text-primary" : "text-muted-foreground"
              }`} 
            />
            <span className="text-[10px] text-muted-foreground font-medium truncate">
              {isFollowing ? formatFollowerCount(followerCount) : "Follow"}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Action Bar */}
      <div className="hidden md:flex items-center gap-2 px-6 py-4 border-t border-border bg-card">
        <Button
          variant={isLiked ? "default" : "outline"}
          size="sm"
          onClick={handleLike}
          className="gap-2"
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          Like ({likeCount})
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const commentInput = document.querySelector('textarea[placeholder*="comment"]') as HTMLTextAreaElement;
            if (commentInput) {
              commentInput.focus();
            }
          }}
          className="gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Comment
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowGiftDialog(true)}
          className="gap-2"
        >
          <Gift className="h-4 w-4" />
          Gift
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        
        {post.followers && (
          <Button
            variant={isFollowing ? "secondary" : "default"}
            size="sm"
            onClick={handleFollow}
            className="gap-2 ml-auto"
          >
            <UserPlus className="h-4 w-4" />
            {isFollowing ? "Following" : "Follow"}
            <Badge variant="outline" className="ml-1">
              {formatFollowerCount(followerCount)}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <MediaViewer
        open={mediaViewerOpen}
        onOpenChange={setMediaViewerOpen}
        mediaUrl={post.imageUrl}
        mediaType={post.type}
        title={post.title}
        author={post.author}
        authorUserId={post.userId}
        likes={likeCount}
        comments={parseInt(post.comments)}
        followers={post.followers}
        isLiked={isLiked}
        isOwner={false}
      />

      <SendGiftDialog
        isOpen={showGiftDialog}
        onClose={() => setShowGiftDialog(false)}
        recipientName={post.author}
        recipientId={post.userId}
        onSendGift={() => {
          // The dialog already confirms + deducts on success; nothing else needed here.
        }}
      />


      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[95vh] h-[95vh] flex flex-col overflow-hidden p-0 touch-auto">
            {PostContent()}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden rounded-xl">
            {PostContent()}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
