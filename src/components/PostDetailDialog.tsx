import { useState } from "react";
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
import { Heart, MessageCircle, Share2, UserPlus, Eye, Coins, X } from "lucide-react";
import { MediaViewer } from "./MediaViewer";
import { CommentSection } from "./CommentSection";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

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
}

export const PostDetailDialog = ({
  open,
  onOpenChange,
  post,
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

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleFollow = () => {
    if (isFollowing) {
      setFollowerCount(followerCount - 1);
    } else {
      setFollowerCount(followerCount + 1);
    }
    setIsFollowing(!isFollowing);
  };

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      });
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

  // Shared content component for both mobile and desktop
  const PostContent = () => (
    <div className="flex flex-col h-full">
      {/* Close button - top right */}
      <button
        onClick={() => onOpenChange(false)}
        className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors md:hidden"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <ScrollArea className="flex-1">
        <div className="pb-24 md:pb-6">
          {/* Hero Image */}
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
              <Badge 
                className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-foreground border-border hover:bg-background/95"
                variant="outline"
              >
                {post.type}
              </Badge>
            </div>
          )}

          {/* Content Container */}
          <div className="p-4 space-y-4">
            {/* Author Section */}
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
                  <p className="text-sm text-muted-foreground">
                    {post.status}
                  </p>
                </div>
              </div>
            </button>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Title */}
            <h2 className="text-lg font-semibold text-foreground leading-snug">
              {post.title}
            </h2>

            {/* Description */}
            {post.description && (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {post.description}
              </p>
            )}

            {/* Stats Row - Compact */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              {post.fee && (
                <div className="flex items-center gap-1">
                  <Coins className="h-3.5 w-3.5" />
                  <span>{post.fee} Mobi</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{post.comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                <span>{likeCount}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Comments Section - Always visible */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Comments ({post.comments})
              </h3>
              <CommentSection postId={post.id || "unknown"} className="border-none p-0" />
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Fixed Bottom Action Bar - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border px-4 py-3 safe-area-pb z-50">
        <div className="flex items-center justify-around max-w-md mx-auto gap-2">
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1 min-w-[60px] touch-manipulation active:scale-95 transition-transform"
          >
            <Heart 
              className={`h-6 w-6 transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`} 
            />
            <span className="text-xs text-muted-foreground font-medium">{likeCount}</span>
          </button>
          
          <button
            onClick={() => {
              const commentInput = document.querySelector('textarea[placeholder*="comment"]') as HTMLTextAreaElement;
              if (commentInput) {
                commentInput.focus();
                commentInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="flex flex-col items-center gap-1 min-w-[60px] touch-manipulation active:scale-95 transition-transform"
          >
            <MessageCircle className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">{post.comments}</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 min-w-[60px] touch-manipulation active:scale-95 transition-transform"
          >
            <Share2 className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Share</span>
          </button>
          
          {post.followers && (
            <button
              onClick={handleFollow}
              className="flex flex-col items-center gap-1 min-w-[60px] touch-manipulation active:scale-95 transition-transform"
            >
              <UserPlus 
                className={`h-6 w-6 transition-colors ${
                  isFollowing ? "text-primary" : "text-muted-foreground"
                }`} 
              />
              <span className="text-xs text-muted-foreground font-medium">
                {isFollowing ? formatFollowerCount(followerCount) : "Follow"}
              </span>
            </button>
          )}
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

      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="h-[95vh] p-0">
            <PostContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden">
            <PostContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
