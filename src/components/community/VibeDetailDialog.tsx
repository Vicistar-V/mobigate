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
import { Heart, MessageCircle, Share2, Eye, X, TrendingUp, ChevronLeft, ChevronRight, Gift } from "lucide-react";
import { SendGiftDialog } from "@/components/chat/SendGiftDialog";
import { CommentSection } from "@/components/CommentSection";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { VibeItem } from "@/data/communityVibesData";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VibeDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vibe: VibeItem;
  onLike: (vibeId: string) => void;
  isLiked: boolean;
  likeCount: number;
}

export const VibeDetailDialog = ({
  open,
  onOpenChange,
  vibe,
  onLike,
  isLiked,
  likeCount,
}: VibeDetailDialogProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [showGiftDialog, setShowGiftDialog] = useState(false);

  const handleLike = () => {
    onLike(vibe.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: vibe.title,
          text: vibe.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const handleAuthorClick = () => {
    onOpenChange(false);
    if (vibe.authorId) {
      navigate(`/profile/${vibe.authorId}`);
    }
  };

  const getMediaTypeColor = (type: VibeItem["mediaType"]) => {
    switch (type) {
      case "video":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "photo":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "audio":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "gallery":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const nextGalleryImage = () => {
    if (vibe.galleryImages && currentGalleryIndex < vibe.galleryImages.length - 1) {
      setCurrentGalleryIndex(prev => prev + 1);
    }
  };

  const prevGalleryImage = () => {
    if (currentGalleryIndex > 0) {
      setCurrentGalleryIndex(prev => prev - 1);
    }
  };

  // Shared content component for both mobile and desktop
  const VibeContent = () => (
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
          {/* Media Content */}
          {vibe.mediaType === "video" && vibe.mediaUrl && (
            <div className="relative w-full">
              <AspectRatio ratio={16 / 9}>
                <video
                  src={vibe.mediaUrl}
                  controls
                  className="w-full h-full object-cover"
                  poster={vibe.thumbnail}
                />
                {vibe.spotlight && (
                  <div className="absolute top-4 left-4">
                    <Badge className="gap-1 bg-primary text-primary-foreground">
                      <TrendingUp className="h-3 w-3" />
                      SPOTLIGHT
                    </Badge>
                  </div>
                )}
              </AspectRatio>
            </div>
          )}

          {vibe.mediaType === "audio" && vibe.audioUrl && (
            <div className="relative w-full bg-muted p-8">
              <div className="max-w-md mx-auto">
                <audio controls className="w-full">
                  <source src={vibe.audioUrl} />
                </audio>
              </div>
              {vibe.spotlight && (
                <div className="absolute top-4 left-4">
                  <Badge className="gap-1 bg-primary text-primary-foreground">
                    <TrendingUp className="h-3 w-3" />
                    SPOTLIGHT
                  </Badge>
                </div>
              )}
            </div>
          )}

          {vibe.mediaType === "photo" && vibe.mediaUrl && (
            <div className="relative w-full">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={vibe.mediaUrl}
                  alt={vibe.title}
                  className="w-full h-full object-cover"
                />
                {vibe.spotlight && (
                  <div className="absolute top-4 left-4">
                    <Badge className="gap-1 bg-primary text-primary-foreground">
                      <TrendingUp className="h-3 w-3" />
                      SPOTLIGHT
                    </Badge>
                  </div>
                )}
              </AspectRatio>
            </div>
          )}

          {vibe.mediaType === "gallery" && vibe.galleryImages && (
            <div className="relative w-full">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={vibe.galleryImages[currentGalleryIndex]}
                  alt={`${vibe.title} - ${currentGalleryIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {vibe.spotlight && (
                  <div className="absolute top-4 left-4">
                    <Badge className="gap-1 bg-primary text-primary-foreground">
                      <TrendingUp className="h-3 w-3" />
                      SPOTLIGHT
                    </Badge>
                  </div>
                )}
                
                {/* Gallery Navigation */}
                {vibe.galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={prevGalleryImage}
                      disabled={currentGalleryIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center disabled:opacity-50 hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextGalleryImage}
                      disabled={currentGalleryIndex === vibe.galleryImages.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center disabled:opacity-50 hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
                      {currentGalleryIndex + 1} / {vibe.galleryImages.length}
                    </div>
                  </>
                )}
              </AspectRatio>
            </div>
          )}

          {/* Content Container */}
          <div className="px-5 sm:px-6 py-4 space-y-4">
            {/* Media Type Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={getMediaTypeColor(vibe.mediaType)}>
                {vibe.mediaType.charAt(0).toUpperCase() + vibe.mediaType.slice(1)}
              </Badge>
              {vibe.duration && (
                <Badge variant="outline">
                  {vibe.duration}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {vibe.title}
            </h2>

            {/* Author Section */}
            <button
              onClick={handleAuthorClick}
              className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarImage src={vibe.authorProfileImage} alt={vibe.author} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {vibe.author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground text-sm">{vibe.author}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(vibe.date), { addSuffix: true })}
                </p>
              </div>
            </button>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">About this vibe</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {vibe.description}
              </p>
            </div>

            {/* Stats Row - Compact */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{vibe.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                <span>{likeCount.toLocaleString()} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{vibe.comments.toLocaleString()} comments</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-3.5 w-3.5" />
                <span>{vibe.shares.toLocaleString()} shares</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Comments Section */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm sm:text-base">
                <MessageCircle className="h-4 w-4" />
                Comments ({vibe.comments})
              </h3>
              <CommentSection postId={vibe.id} className="border-none p-0" showHeader={false} />
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Fixed Bottom Action Bar - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border px-5 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] z-50">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1 min-w-[60px] touch-manipulation active:scale-95 transition-transform"
          >
            <Heart 
              className={cn(
                "h-6 w-6 transition-colors",
                isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )} 
            />
            <span className="text-xs text-muted-foreground font-medium">{likeCount.toLocaleString()}</span>
          </button>
          
          <button
            onClick={() => {
              const commentInput = document.querySelector('textarea[placeholder*="comment"]') as HTMLTextAreaElement;
              if (commentInput) {
                commentInput.focus();
              }
            }}
            className="flex flex-col items-center gap-1 min-w-[60px] touch-manipulation active:scale-95 transition-transform"
          >
            <MessageCircle className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Comment</span>
          </button>
          
          <button
            onClick={() => {
              onOpenChange(false);
              setTimeout(() => setShowGiftDialog(true), 150);
            }}
            className="flex flex-col items-center gap-1 min-w-[60px] touch-manipulation active:scale-95 transition-transform"
          >
            <Gift className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Gift</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 min-w-[60px] touch-manipulation active:scale-95 transition-transform"
          >
            <Share2 className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Share</span>
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
          Comment ({vibe.comments.toLocaleString()})
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onOpenChange(false);
            setTimeout(() => setShowGiftDialog(true), 150);
          }}
          className="gap-2"
        >
          <Gift className="h-4 w-4" />
          Send Gift
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share ({vibe.shares.toLocaleString()})
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[95vh] h-[95vh] flex flex-col overflow-hidden p-0 touch-auto">
            <VibeContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden rounded-xl">
            <VibeContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Send Gift Dialog */}
      <SendGiftDialog
        isOpen={showGiftDialog}
        onClose={() => setShowGiftDialog(false)}
        recipientName={vibe.author}
        onSendGift={(giftData) => {
          if (giftData) {
            toast.success(`Gift "${giftData.giftData.name}" sent to ${vibe.author}!`);
          }
          setShowGiftDialog(false);
        }}
      />
    </>
  );
};