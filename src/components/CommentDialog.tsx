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
      <DialogContent className="max-w-3xl sm:max-w-3xl w-[calc(100vw-2rem)] sm:w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col p-0 gap-0 mx-auto">
        {/* Fixed Header with Post Summary */}
        <DialogHeader className="flex-shrink-0 px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b space-y-4">
          <DialogTitle className="text-lg sm:text-xl pr-8">Comments</DialogTitle>

          {/* Post Summary */}
          <div className="flex gap-2 sm:gap-4">
            {post.imageUrl && (
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className="absolute top-1 left-1 text-sm sm:text-base px-1.5 py-0.5"
                  variant="destructive"
                >
                  {post.type}
                </Badge>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg line-clamp-2 mb-2">
                {post.title}
              </h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                  <AvatarImage
                    src={post.authorProfileImage}
                    alt={post.author}
                  />
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm sm:text-base text-muted-foreground truncate">
                  {post.author}
                </span>
              </div>
              {(post.views || post.likes) && (
                <div className="flex items-center gap-3 mt-2 text-sm sm:text-base text-muted-foreground">
                  {post.views && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>{post.views}</span>
                    </div>
                  )}
                  {post.likes && (
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>{post.likes}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Comment Section */}
        <ScrollArea className="flex-1 px-3 sm:px-6 py-4 sm:py-6">
          <CommentSection postId={post.id || "unknown"} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
