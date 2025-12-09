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
import { Heart, MessageCircle, Share2, Eye, X, Video, Image as ImageIcon, FileText, TrendingUp } from "lucide-react";
import { CommentSection } from "@/components/CommentSection";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { NewsItem } from "@/data/newsData";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface NewsDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news: NewsItem;
  onLike: (newsId: string) => void;
  isLiked: boolean;
  likeCount: number;
}

export const NewsDetailDialog = ({
  open,
  onOpenChange,
  news,
  onLike,
  isLiked,
  likeCount,
}: NewsDetailDialogProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleLike = () => {
    onLike(news.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ description: "Link copied to clipboard" });
    }
  };

  const handleAuthorClick = () => {
    onOpenChange(false);
    if (news.authorId) {
      navigate(`/profile/${news.authorId}`);
    }
  };

  const getMediaIcon = (mediaType: NewsItem["mediaType"]) => {
    switch (mediaType) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "photo":
        return <ImageIcon className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: NewsItem["category"]) => {
    switch (category) {
      case "announcements":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "events":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "updates":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "general":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
      case "affairs":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Shared content component for both mobile and desktop
  const NewsContent = () => (
    <div className="flex flex-col h-full overflow-x-hidden w-full">
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
          {news.thumbnail && (news.mediaType === "video" || news.mediaType === "photo") && (
            <div className="relative w-full">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={news.thumbnail}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
                {news.mediaType === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                      <Video className="h-8 w-8 text-primary-foreground ml-1" />
                    </div>
                  </div>
                )}
              </AspectRatio>
            </div>
          )}

          {/* Content Container */}
          <div className="px-5 sm:px-6 py-4 space-y-4 overflow-x-hidden">
            {/* Category and Media Type Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={getCategoryColor(news.category)}>
                {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
              </Badge>
              <Badge variant="outline" className="gap-1">
                {getMediaIcon(news.mediaType)}
                <span className="capitalize">{news.mediaType}</span>
              </Badge>
              {news.trending && (
                <Badge variant="default" className="gap-1 bg-primary">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </Badge>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight break-words">
              {news.title}
            </h2>

            {/* Author Section */}
            <button
              onClick={handleAuthorClick}
              className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarImage src={news.authorProfileImage} alt={news.author} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {news.author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground text-sm">{news.author}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(news.date), { addSuffix: true })}
                </p>
              </div>
            </button>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {news.description}
            </p>

            {/* Stats Row - Compact */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{news.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                <span>{likeCount.toLocaleString()} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{news.comments.toLocaleString()} comments</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-3.5 w-3.5" />
                <span>{news.shares.toLocaleString()} shares</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Comments Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Comments ({news.comments})
              </h3>
              <CommentSection postId={news.id} className="border-none p-0" />
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Fixed Bottom Action Bar - Mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 max-w-full bg-card/95 backdrop-blur-sm border-t border-border px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] z-50">
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
          <button
            onClick={handleLike}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-muted/50 rounded-lg touch-manipulation active:scale-95 transition-transform"
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-colors",
                isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )} 
            />
            <span className="text-sm text-muted-foreground font-medium">{likeCount.toLocaleString()}</span>
          </button>
          
          <button
            onClick={() => {
              const commentInput = document.querySelector('textarea[placeholder*="comment"]') as HTMLTextAreaElement;
              if (commentInput) {
                commentInput.focus();
                commentInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-muted/50 rounded-lg touch-manipulation active:scale-95 transition-transform"
          >
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium">{news.comments.toLocaleString()}</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-muted/50 rounded-lg touch-manipulation active:scale-95 transition-transform"
          >
            <Share2 className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium">Share</span>
          </button>
          
          <div className="flex items-center justify-center gap-2 py-2.5 px-3 bg-muted/50 rounded-lg">
            <Eye className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium">{news.views.toLocaleString()}</span>
          </div>
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
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          Like ({likeCount.toLocaleString()})
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
          Comment ({news.comments.toLocaleString()})
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share ({news.shares.toLocaleString()})
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[95vh] h-[95vh] flex flex-col overflow-hidden p-0">
            <NewsContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden rounded-xl">
            <NewsContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
