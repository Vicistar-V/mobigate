import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PostOptionsMenu } from "@/components/PostOptionsMenu";

interface FeedPostProps {
  id?: string;
  title: string;
  subtitle?: string;
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

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {imageUrl && (
        <div className="relative h-48 bg-muted">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          <Badge className="absolute top-2 right-2" variant="destructive">
            {type}
          </Badge>
        </div>
      )}
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">{title}</h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{subtitle}</p>
            )}
          </div>
          {isOwner && onEdit && onDelete && (
            <PostOptionsMenu onEdit={onEdit} onDelete={onDelete} />
          )}
        </div>

        <div className="flex items-center gap-2 text-xs flex-nowrap overflow-x-auto">
          <span className="text-emerald-600 font-medium whitespace-nowrap">Fee: {fee} Mobi</span>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1 text-red-600 whitespace-nowrap">
            <Eye className="h-3.5 w-3.5" />
            <span>{views} Views</span>
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1 text-red-600 whitespace-nowrap">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{comments} Comments</span>
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1 text-red-600 whitespace-nowrap">
            <Heart className="h-3.5 w-3.5" />
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
              <p className="text-sm font-medium">By {author}</p>
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${status === "Online" ? "bg-emerald-500" : "bg-red-500"}`} />
                <p className={`text-xs font-medium ${status === "Online" ? "text-emerald-600" : "text-red-600"}`}>
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
  );
};
