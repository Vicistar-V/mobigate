import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, ChevronLeft, ChevronRight, Heart, Share2, MessageCircle, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CommentDialog } from "@/components/CommentDialog";
import { useSwipeable } from "react-swipeable";

export interface MediaItem {
  id?: string;
  url: string;
  type: "photo" | "video" | "audio";
  title?: string;
  author?: string;
  authorImage?: string;
  authorUserId?: string;
  timestamp?: string;
  description?: string;
  likes?: number;
  comments?: number;
  followers?: string;
  isLiked?: boolean;
  isOwner?: boolean;
}

interface MediaGalleryViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: MediaItem[];
  initialIndex?: number;
  showActions?: boolean;
  galleryType?: "wall-status" | "profile-picture" | "banner" | "post" | "gallery" | "video-highlights";
}

export const MediaGalleryViewer = ({
  open,
  onOpenChange,
  items,
  initialIndex = 0,
  showActions = true,
  galleryType = "wall-status",
}: MediaGalleryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const { toast } = useToast();

  const currentItem = items[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (currentItem) {
      setIsLiked(currentItem.isLiked || false);
      setLikeCount(currentItem.likes || 0);
      setIsFollowing(false);
      setFollowerCount(
        currentItem.followers ? parseInt(currentItem.followers.replace(/[^0-9]/g, '')) || 0 : 0
      );
    }
  }, [currentItem]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
      setIsLiked(false);
      toast({ description: "You Unliked this" });
    } else {
      setLikeCount(likeCount + 1);
      setIsLiked(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentItem?.title || "Check this out!",
        text: currentItem?.description || "",
        url: window.location.href,
      }).catch(() => {
        // User cancelled or error occurred
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ description: "Link copied to clipboard" });
    }
  };

  const handleComment = () => {
    setCommentDialogOpen(true);
  };

  const handleFollow = () => {
    if (isFollowing) {
      setFollowerCount(followerCount - 1);
      setIsFollowing(false);
      toast({ description: `Unfollowed ${currentItem?.author || 'user'}` });
    } else {
      setFollowerCount(followerCount + 1);
      setIsFollowing(true);
      toast({ description: `Now following ${currentItem?.author || 'user'}` });
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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
    onSwipedDown: () => onOpenChange(false),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 50,
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") onOpenChange(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex]);

  const renderMedia = () => {
    if (!currentItem) return null;

    switch (currentItem.type) {
      case "video":
        return (
          <video
            src={currentItem.url}
            controls
            autoPlay
            className="w-full h-full object-contain"
            key={currentItem.url}
          >
            Your browser does not support the video tag.
          </video>
        );

      case "audio":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
            <div className="text-center text-white">
              <h3 className="text-3xl font-semibold mb-2">{currentItem.title || "Audio"}</h3>
              {currentItem.author && (
                <p className="text-lg text-white/80">by {currentItem.author}</p>
              )}
            </div>
            <audio
              src={currentItem.url}
              controls
              autoPlay
              className="w-full max-w-2xl"
              key={currentItem.url}
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        );

      case "photo":
      default:
        return (
          <img
            src={currentItem.url}
            alt={currentItem.title || "Media"}
            className="w-full h-full object-contain select-none"
            draggable={false}
          />
        );
    }
  };

  const getGalleryTitle = () => {
    switch (galleryType) {
      case "profile-picture":
        return "Profile Pictures";
      case "banner":
        return "Profile Banners";
      case "wall-status":
        return "Wall Status";
      case "post":
        return "Post Media";
      case "gallery":
        return "Gallery";
      case "video-highlights":
        return "Video Highlights";
      default:
        return "Media Gallery";
    }
  };

  if (!currentItem) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 gap-0 bg-black border-none !z-[200]" overlayClassName="!z-[200]">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-2 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              {currentItem.author && (
                <>
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-white/20">
                    <AvatarImage src={currentItem.authorImage} alt={currentItem.author} />
                    <AvatarFallback>{currentItem.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-white">
                    <p className="text-base sm:text-lg font-semibold">{currentItem.author}</p>
                    {currentItem.timestamp && (
                      <p className="text-xs sm:text-sm text-white/70">{currentItem.timestamp}</p>
                    )}
                  </div>
                </>
              )}
              {!currentItem.author && (
                <div className="text-white">
                  <p className="text-base sm:text-lg font-semibold">{getGalleryTitle()}</p>
                  <p className="text-xs sm:text-sm text-white/70">
                    {currentIndex + 1} of {items.length}
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div 
          {...swipeHandlers}
          className="relative w-full h-full flex items-center justify-center touch-pan-y"
        >
          {renderMedia()}

          {/* Navigation Buttons */}
          {items.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/50 hover:bg-black/70 text-white border-2 border-white/20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/50 hover:bg-black/70 text-white border-2 border-white/20"
                onClick={goToNext}
              >
                <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>
            </>
          )}
        </div>

        {/* Bottom Info & Actions */}
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/90 to-transparent p-3 sm:p-6 pb-4 sm:pb-8">
          {currentItem.title && (
            <div className="text-white mb-3 sm:mb-6">
              <h3 className="text-base sm:text-2xl font-bold mb-0.5 sm:mb-1">{currentItem.title}</h3>
              {currentItem.description && (
                <p className="text-sm sm:text-base text-white/80 line-clamp-2 sm:line-clamp-none">{currentItem.description}</p>
              )}
            </div>
          )}

          {showActions && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-6">
                {/* Like Button */}
                <div className="flex flex-col items-start gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLike}
                    className={`flex-col sm:flex-row gap-0.5 sm:gap-2 px-2 py-2 sm:px-4 sm:py-3 h-auto min-w-[60px] sm:min-w-0 ${
                      isLiked
                        ? "text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Heart className={`h-5 w-5 sm:h-7 sm:w-7 ${isLiked ? "fill-current" : ""}`} />
                    <span className="text-base sm:text-xl font-bold">{likeCount}</span>
                  </Button>
                </div>

                {/* Follow Button */}
                {currentItem.followers && !currentItem.isOwner && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFollow}
                    className={`flex-col sm:flex-row gap-0.5 sm:gap-2 px-2 py-2 sm:px-4 sm:py-3 h-auto min-w-[60px] sm:min-w-0 ${
                      isFollowing
                        ? "text-primary hover:text-primary hover:bg-primary/10"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <UserPlus className={`h-5 w-5 sm:h-7 sm:w-7 ${isFollowing ? "fill-current" : ""}`} />
                    <span className="text-base sm:text-xl font-bold">{formatFollowerCount(followerCount)}</span>
                  </Button>
                )}

                {/* Comment Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleComment}
                  className="flex-col sm:flex-row gap-0.5 sm:gap-2 px-2 py-2 sm:px-4 sm:py-3 h-auto min-w-[60px] sm:min-w-0 text-white hover:text-white hover:bg-white/10"
                >
                  <MessageCircle className="h-5 w-5 sm:h-7 sm:w-7" />
                  <span className="text-base sm:text-xl font-bold">{currentItem.comments || 0}</span>
                </Button>

                {/* Share Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="flex-col sm:flex-row gap-0.5 sm:gap-2 px-2 py-2 sm:px-4 sm:py-3 h-auto min-w-[60px] sm:min-w-0 text-white hover:text-white hover:bg-white/10"
                >
                  <Share2 className="h-5 w-5 sm:h-7 sm:w-7" />
                  <span className="text-base sm:text-xl font-bold">Share</span>
                </Button>
              </div>

              {/* Pagination - Moved to separate row on mobile */}
              <div className="flex justify-center sm:justify-end">
                {/* Pagination Dots */}
                {items.length > 1 && items.length <= 20 && (
                  <div className="flex gap-1 sm:gap-1.5">
                    {items.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-1.5 sm:h-2 rounded-full transition-all ${
                          index === currentIndex
                            ? "w-6 sm:w-8 bg-white"
                            : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to item ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Counter for large galleries */}
                {items.length > 20 && (
                  <div className="text-white/80 text-sm sm:text-base font-medium">
                    {currentIndex + 1} / {items.length}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
      </Dialog>

      <CommentDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        post={{
          id: currentItem?.id,
          title: currentItem?.title || "Media Item",
          author: currentItem?.author || "Unknown Author",
          authorProfileImage: currentItem?.authorImage,
          type: currentItem?.type === "video" ? "Video" : currentItem?.type === "audio" ? "Audio" : "Photo",
          imageUrl: currentItem?.url,
          likes: likeCount.toString(),
        }}
      />
    </>
  );
};
