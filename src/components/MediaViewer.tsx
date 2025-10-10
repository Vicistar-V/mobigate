import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface MediaViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaUrl?: string;
  mediaType: "Video" | "Article" | "Photo" | "Audio" | "PDF" | "URL";
  title: string;
  likes?: number;
  comments?: number;
  isLiked?: boolean;
  showActions?: boolean;
}

export const MediaViewer = ({
  open,
  onOpenChange,
  mediaUrl,
  mediaType,
  title,
  likes = 0,
  comments = 0,
  isLiked: initialIsLiked = false,
  showActions = true,
}: MediaViewerProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const { toast } = useToast();

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
      setIsLiked(false);
      toast({ description: "You Unliked this" });
    } else {
      setLikeCount(likeCount + 1);
      setIsLiked(true);
      toast({ description: "You Liked this" });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title || "Check this out!",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ description: "Link copied to clipboard" });
    }
  };

  const handleComment = () => {
    toast({ description: "Comment feature coming soon!" });
  };

  const renderMedia = () => {
    if (!mediaUrl) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No media available
        </div>
      );
    }

    switch (mediaType) {
      case "Video":
        return (
          <video
            src={mediaUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        );

      case "Audio":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">Playing audio</p>
            </div>
            <audio
              src={mediaUrl}
              controls
              autoPlay
              className="w-full max-w-2xl"
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        );

      case "Photo":
        return (
          <img
            src={mediaUrl}
            alt={title}
            className="w-full h-full object-contain"
          />
        );

      case "PDF":
        return (
          <iframe
            src={mediaUrl}
            title={title}
            className="w-full h-full"
          />
        );

      case "URL":
      case "Article":
        return (
          <iframe
            src={mediaUrl}
            title={title}
            className="w-full h-full"
          />
        );

      default:
        return (
          <img
            src={mediaUrl}
            alt={title}
            className="w-full h-full object-contain"
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 gap-0 bg-black border-none">
        {/* Header with close button */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="font-semibold text-lg">{title}</p>
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
        <div className="relative w-full h-full flex items-center justify-center">
          {renderMedia()}
        </div>

        {/* Bottom Actions */}
        {showActions && (
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/90 to-transparent p-6 pb-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={handleLike}
                  className={`gap-2.5 px-4 py-3 h-auto ${
                    isLiked
                      ? "text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      : "text-white hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Heart className={`h-7 w-7 ${isLiked ? "fill-current" : ""}`} />
                  <span className="text-xl font-bold">{likeCount}</span>
                </Button>
                {isLiked && (
                  <span className="text-lg font-medium text-red-500">
                    You Liked this
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="default"
                onClick={handleComment}
                className="gap-2.5 px-4 py-3 h-auto text-white hover:text-white hover:bg-white/10"
              >
                <MessageCircle className="h-7 w-7" />
                <span className="text-xl font-bold">{comments}</span>
              </Button>
              <Button
                variant="ghost"
                size="default"
                onClick={handleShare}
                className="gap-2.5 px-4 py-3 h-auto text-white hover:text-white hover:bg-white/10"
              >
                <Share2 className="h-7 w-7" />
                <span className="text-xl font-bold">Share</span>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
