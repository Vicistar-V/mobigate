import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, MessageSquare, Heart } from "lucide-react";
import { Link } from "react-router-dom";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{post.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {post.imageUrl && (
            <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
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

          {post.subtitle && (
            <p className="text-xl text-muted-foreground">{post.subtitle}</p>
          )}

          {post.description && (
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Description</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {post.description}
              </p>
            </div>
          )}

          <div className="flex items-center gap-4 text-base flex-wrap pt-4 border-t">
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

          <div className="flex items-center gap-3 pt-4 border-t">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
