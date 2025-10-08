import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, Heart, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { MediaViewer } from "@/components/MediaViewer";

interface PostDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
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
  };
}

export const PostDetailDialog = ({
  open,
  onOpenChange,
  post,
}: PostDetailDialogProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(post.likes) || 0);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <>
      <MediaViewer
        open={mediaViewerOpen}
        onOpenChange={setMediaViewerOpen}
        mediaUrl={post.imageUrl}
        mediaType={post.type}
        title={post.title}
      />
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
        {/* Fixed Header */}
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl pr-8">{post.title}</DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {post.imageUrl && (
              <div 
                className="relative w-full h-96 bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setMediaViewerOpen(true)}
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4" variant="destructive">
                  {post.type}
                </Badge>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={isLiked ? "text-red-600 border-red-600" : ""}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                Like ({likeCount})
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                Comment
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>

            {/* Description */}
            {post.description && (
              <p className="text-muted-foreground whitespace-pre-wrap pt-2">
                {post.description}
              </p>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t bg-card space-y-4">
          {/* Stats Section */}
          <div className="flex items-center gap-4 text-base flex-wrap">
            <span className="text-emerald-600 font-medium">Fee: {post.fee} Mobi</span>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-1 text-red-600">
              <Eye className="h-4 w-4" />
              <span>{post.views} Views</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-1 text-red-600">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments} Comments</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-1 text-red-600">
              <Heart className="h-4 w-4" />
              <span>{post.likes} Likes</span>
            </div>
          </div>

          {/* Author Section */}
          <Link
            to={`/profile/${post.userId}`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            onClick={() => onOpenChange(false)}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.authorProfileImage} alt={post.author} />
              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium">By {post.author}</p>
              <div className="flex items-center gap-1.5">
                <div
                  className={`h-2 w-2 rounded-full ${
                    post.status === "Online" ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                <p
                  className={`text-base font-medium ${
                    post.status === "Online"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {post.status}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};
