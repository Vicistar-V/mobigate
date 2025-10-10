import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CommentSection } from "@/components/CommentSection";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Heart } from "lucide-react";

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
    id?: string;
    title: string;
    subtitle?: string;
    author: string;
    authorProfileImage?: string;
    type: "Video" | "Article" | "Photo" | "Audio" | "PDF" | "URL";
    imageUrl?: string;
    views?: string;
    likes?: string;
  };
}

export const CommentDialog = ({
  open,
  onOpenChange,
  post,
}: CommentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
        {/* Fixed Header with Post Summary */}
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b space-y-4">
          <DialogTitle className="text-xl pr-8">Comments</DialogTitle>

          {/* Post Summary */}
          <div className="flex gap-4">
            {post.imageUrl && (
              <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className="absolute top-1 left-1 text-xs px-1.5 py-0.5"
                  variant="destructive"
                >
                  {post.type}
                </Badge>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base line-clamp-2 mb-2">
                {post.title}
              </h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={post.authorProfileImage}
                    alt={post.author}
                  />
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground truncate">
                  {post.author}
                </span>
              </div>
              {(post.views || post.likes) && (
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  {post.views && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{post.views}</span>
                    </div>
                  )}
                  {post.likes && (
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{post.likes}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Comment Section */}
        <ScrollArea className="flex-1 px-6 py-6">
          <CommentSection postId={post.id || "unknown"} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
