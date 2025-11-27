import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, MessageCircle, Share2, Video, Image as ImageIcon, FileText } from "lucide-react";
import { NewsItem } from "@/data/newsData";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  news: NewsItem;
  onClick?: () => void;
}

const categoryColors = {
  announcements: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  events: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  updates: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  general: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  affairs: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

const categoryLabels = {
  announcements: "Announcement",
  events: "Event",
  updates: "Update",
  general: "General",
  affairs: "Affairs",
};

const mediaTypeIcons = {
  video: Video,
  photo: ImageIcon,
  article: FileText,
};

export function NewsCard({ news, onClick }: NewsCardProps) {
  const MediaTypeIcon = mediaTypeIcons[news.mediaType];

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
      onClick={onClick}
    >
      {/* Thumbnail */}
      {news.thumbnail && (
        <div className="relative h-40 sm:h-48 overflow-hidden bg-muted">
          <img
            src={news.thumbnail}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              <MediaTypeIcon className="h-3 w-3 mr-1" />
              {news.mediaType}
            </Badge>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category Badge */}
        <Badge 
          variant="outline" 
          className={categoryColors[news.category]}
        >
          {categoryLabels[news.category]}
        </Badge>

        {/* Title */}
        <h3 className="font-semibold text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {news.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {news.description}
        </p>

        {/* Author and Date */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Avatar className="h-6 w-6">
            <AvatarImage src={news.authorImage} alt={news.author} />
            <AvatarFallback className="text-xs">
              {news.author.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{news.author}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(news.date, { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {news.views.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {news.comments}
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="h-3 w-3" />
            {news.shares}
          </span>
        </div>
      </div>
    </Card>
  );
}
