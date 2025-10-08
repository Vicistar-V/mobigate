import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PostOptionsMenu } from "@/components/PostOptionsMenu";
import { PostDetailDialog } from "@/components/PostDetailDialog";

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
  type,
  imageUrl,
  fee = "6",
  isOwner = false,
  onEdit,
  onDelete,
}: FeedPostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(likes));
  const [detailOpen, setDetailOpen] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        {imageUrl && (
          <div 
            className="relative h-48 bg-muted cursor-pointer" 
            onClick={() => setDetailOpen(true)}
          >
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            <Badge className="absolute top-2 right-2" variant="destructive">
              {type}
            </Badge>
          </div>
        )}
      
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <div 
            className="flex-1 cursor-pointer" 
            onClick={() => setDetailOpen(true)}
          >
            <h3 className="font-semibold text-2xl leading-tight line-clamp-2 hover:text-primary transition-colors">{title}</h3>
            {subtitle && (
              <p className="text-lg text-muted-foreground mt-1 line-clamp-2">{subtitle}</p>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{description}</p>
            )}
          </div>
          {isOwner && onEdit && onDelete && (
            <div className="flex-shrink-0">
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
          <div className="flex items-center gap-1 text-red-600 whitespace-nowrap">
            <MessageSquare className="h-4 w-4" />
            <span>{comments} Comments</span>
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1 text-red-600 whitespace-nowrap">
            <Heart className="h-4 w-4" />
            <span>{likeCount} Likes</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <Link to={`/profile/${userId}`} className="flex-1 flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Avatar className="h-10 w-10">
              <AvatarImage src={authorProfileImage} alt={author} />
              <AvatarFallback>{author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium">By {author}</p>
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${status === "Online" ? "bg-emerald-500" : "bg-red-500"}`} />
                <p className={`text-base font-medium ${status === "Online" ? "text-emerald-600" : "text-red-600"}`}>
                  {status}
                </p>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
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
            {!imageUrl && (
              <Badge variant={type === "Video" ? "destructive" : "secondary"}>
                {type}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>

    <PostDetailDialog
      open={detailOpen}
      onOpenChange={setDetailOpen}
      post={{
        id,
        title,
        subtitle,
        description,
        author,
        authorProfileImage,
        userId,
        status,
        views,
        comments,
        likes,
        type,
        imageUrl,
        fee,
      }}
    />
    </>
  );
};
