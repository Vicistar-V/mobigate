import { Heart, MessageCircle, Share2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EngagementBarProps {
  itemId: string;
  itemType: 'post' | 'ad';
  initialLikes?: string | number;
  initialComments?: string | number;
  initialShares?: string | number;
  initialFollowers?: string | number;
  isLiked?: boolean;
  isFollowing?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onFollow?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  authorName?: string;
}

export const EngagementBar = ({
  itemId,
  itemType,
  initialLikes = 0,
  initialComments = 0,
  initialShares = 0,
  initialFollowers = 0,
  isLiked: initialIsLiked = false,
  isFollowing: initialIsFollowing = false,
  onLike,
  onComment,
  onShare,
  onFollow,
  className,
  variant = 'default',
  authorName,
}: EngagementBarProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(
    typeof initialLikes === 'string' ? parseInt(initialLikes) || 0 : initialLikes
  );
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerCount, setFollowerCount] = useState(
    typeof initialFollowers === 'string' ? parseInt(initialFollowers.replace(/[^0-9]/g, '')) || 0 : initialFollowers
  );

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
    onLike?.();
  };

  const handleFollow = () => {
    if (isFollowing) {
      setFollowerCount(followerCount - 1);
    } else {
      setFollowerCount(followerCount + 1);
    }
    setIsFollowing(!isFollowing);
    onFollow?.();
  };

  const formatCount = (count: string | number): string => {
    const num = typeof count === 'string' ? parseInt(count) || 0 : count;
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const isCompact = variant === 'compact' || variant === 'minimal';
  const isMinimal = variant === 'minimal';

  return (
    <div
      className={cn(
        "flex items-center gap-1 sm:gap-2",
        isMinimal && "gap-3 sm:gap-4",
        className
      )}
    >
      {/* Like Button */}
      <Button
        variant="ghost"
        size={isCompact ? "sm" : "default"}
        onClick={handleLike}
        className={cn(
          "gap-1.5",
          isLiked && "text-red-600 hover:text-red-600",
          isMinimal && "text-white hover:bg-white/10"
        )}
        aria-label={isLiked ? "Unlike" : "Like"}
      >
        <Heart
          className={cn(
            "h-4 w-4 sm:h-5 sm:w-5",
            isLiked && "fill-current"
          )}
        />
        <span className="text-xs sm:text-sm font-medium">
          {formatCount(likeCount)}
        </span>
      </Button>

      {/* Follow Button */}
      {initialFollowers !== 0 && (
        <Button
          variant="ghost"
          size={isCompact ? "sm" : "default"}
          onClick={handleFollow}
          className={cn(
            "gap-1.5",
            isFollowing && "text-primary hover:text-primary",
            isMinimal && "text-white hover:bg-white/10"
          )}
          aria-label={isFollowing ? `Unfollow ${authorName || 'author'}` : `Follow ${authorName || 'author'}`}
        >
          <UserPlus
            className={cn(
              "h-4 w-4 sm:h-5 sm:w-5",
              isFollowing && "fill-current"
            )}
          />
          <span className="text-xs sm:text-sm font-medium">
            {formatCount(followerCount)}
          </span>
        </Button>
      )}

      {/* Comment Button */}
      <Button
        variant="ghost"
        size={isCompact ? "sm" : "default"}
        onClick={onComment}
        className={cn(
          "gap-1.5",
          isMinimal && "text-white hover:bg-white/10"
        )}
        aria-label="Comment"
      >
        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-xs sm:text-sm font-medium">
          {formatCount(initialComments)}
        </span>
      </Button>

      {/* Share Button */}
      <Button
        variant="ghost"
        size={isCompact ? "sm" : "default"}
        onClick={onShare}
        className={cn(
          "gap-1.5",
          isMinimal && "text-white hover:bg-white/10"
        )}
        aria-label="Share"
      >
        <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-xs sm:text-sm font-medium">
          {formatCount(initialShares)}
        </span>
      </Button>
    </div>
  );
};
