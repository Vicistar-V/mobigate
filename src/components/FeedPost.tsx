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
  fee?: string;
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
  fee = "6",
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

        <div className="flex items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-1 text-emerald-600 font-medium">
            <span>Fee: {fee} Mobi</span>
          </div>
          <div className="flex items-center gap-1 text-red-600">
            <Eye className="h-4 w-4" />
            <span>{views} Views</span>
          </div>
          <div className="flex items-center gap-1 text-red-600">
            <MessageSquare className="h-4 w-4" />
            <span>{comments} Comments</span>
          </div>
          <div className="flex items-center gap-1 text-red-600">
            <Heart className="h-4 w-4" />
            <span>{likes} Likes</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-sm font-medium">By {author}</p>
            <div className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${status === "Online" ? "bg-emerald-500" : "bg-red-500"}`} />
              <p className={`text-xs font-medium ${status === "Online" ? "text-emerald-600" : "text-red-600"}`}>
                {status}
              </p>
            </div>
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
