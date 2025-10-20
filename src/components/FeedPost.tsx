import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, Heart, Share2, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PostOptionsMenu } from "@/components/PostOptionsMenu";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";
import { CommentDialog } from "@/components/CommentDialog";
import { ShareDialog } from "@/components/ShareDialog";
import { generateShareUrl } from "@/lib/shareUtils";

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
  fee?: string;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

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
  imageUrl,
  fee = "6",
  isOwner = false,
  onEdit,
  onDelete,
}: FeedPostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(likes));
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(
    followers ? parseInt(followers.replace(/[^0-9]/g, '')) || 0 : 0
  );
  const [mediaGalleryOpen, setMediaGalleryOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const shareUrl = generateShareUrl('post', id || 'unknown');

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
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

  const formatFollowerCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const openMediaGallery = () => {
    if (imageUrl) {
      setMediaGalleryOpen(true);
    }
  };

  const mediaItem: MediaItem = {
    id: id,
    url: imageUrl || "",
    type: type.toLowerCase() === "video" ? "video" : type.toLowerCase() === "audio" ? "audio" : "photo",
    title: title,
    description: subtitle || description,
    author: author,
    authorImage: authorProfileImage,
    authorUserId: userId,
    likes: likeCount,
    comments: parseInt(comments),
    followers: followers,
    isLiked: isLiked,
    isOwner: isOwner,
  };

  return (
    <>
      <Card 
        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" 
        onClick={openMediaGallery}
      >
        {imageUrl && (
          <div className="relative h-48 bg-muted">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            <Badge className="absolute top-2 left-2" variant="destructive">
              {type}
            </Badge>
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
            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <PostOptionsMenu onEdit={onEdit} onDelete={onDelete} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-base flex-wrap">
          <span className="text-emerald-600 font-medium whitespace-nowrap">Fee: {fee} Mobi</span>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1 text-red-600 whitespace-nowrap">
            <Eye className="h-4 w-4" />
            <span>{views} Views</span>
          </div>
          <span className="text-muted-foreground">|</span>
          <button 
            className="flex items-center gap-1 text-red-600 whitespace-nowrap hover:underline transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setCommentDialogOpen(true);
            }}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{comments} Comments</span>
          </button>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1 text-red-600 whitespace-nowrap">
            <Heart className="h-4 w-4" />
            <span>{likeCount} Likes</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <Link 
            to={`/profile/${userId}`} 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-1"
            onClick={(e) => e.stopPropagation()}
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
                  <p className={`text-base font-medium ${status === "Online" ? "text-emerald-600" : "text-red-600"}`}>
                    {status}
                  </p>
                </div>
                {/* Follow Button - now on same line as status */}
                {!isOwner && followers && (
                  <Button
                    variant={isFollowing ? "secondary" : "default"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollow();
                    }}
                    className="gap-1.5 h-6 px-2 text-sm"
                    aria-label={isFollowing ? "Unfollow" : "Follow"}
                  >
                    <UserPlus className="h-3 w-3" />
                    <span className="hidden sm:inline">{isFollowing ? "Following" : "Follow"}</span>
                    <span className="text-base opacity-80" onClick={(e) => e.stopPropagation()}>({formatFollowerCount(followerCount)})</span>
                  </Button>
                )}
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className={`p-2 rounded-full transition-colors ${
                  isLiked 
                    ? "bg-red-100 text-red-600" 
                    : "bg-muted hover:bg-muted/80"
                }`}
                aria-label={isLiked ? "Unlike post" : "Like post"}
              >
                <Heart 
                  className="h-5 w-5" 
                  fill={isLiked ? "currentColor" : "none"}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShareDialogOpen(true);
                }}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Share post"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            {!imageUrl && (
              <Badge variant={type === "Video" ? "destructive" : "secondary"}>
                {type}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>

    {imageUrl && (
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
      post={{
        id,
        title,
        subtitle,
        author,
        authorProfileImage,
        type,
        imageUrl,
        views,
        likes: likeCount.toString(),
      }}
    />

    <ShareDialog
      open={shareDialogOpen}
      onOpenChange={setShareDialogOpen}
      shareUrl={shareUrl}
      title={title}
      description={subtitle || description}
    />
    </>
  );
};
