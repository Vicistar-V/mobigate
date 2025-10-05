import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, Heart } from "lucide-react";

interface FeedPostProps {
  title: string;
  subtitle?: string;
  author: string;
  status: "Online" | "Offline";
  views: string;
  comments: string;
  likes: string;
  type: "Video" | "Article" | "Photo";
  imageUrl?: string;
}

export const FeedPost = ({
  title,
  subtitle,
  author,
  status,
  views,
  comments,
  likes,
  type,
  imageUrl,
}: FeedPostProps) => {
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
        <div>
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{views} Views</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{comments} Comments</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{likes} Likes</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-sm font-medium">By {author}</p>
            <p className="text-xs text-muted-foreground">PPEC {status}</p>
          </div>
          {!imageUrl && (
            <Badge variant={type === "Video" ? "destructive" : "secondary"}>
              {type}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};
