import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  MessageSquare, 
  Heart, 
  Share2, 
  Bookmark,
  MoreHorizontal,
  Calendar,
  ImageIcon
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CommentSectionDialog } from "@/components/community/CommentSectionDialog";

interface PostData {
  id: string;
  type: string;
  content: string;
  date: Date;
  likes: number;
  comments: number;
  shares: number;
  imageCount?: number;
  author?: {
    name: string;
    avatar: string;
    role?: string;
  };
}

interface PostDetailDialogProps {
  post: PostData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PostDetailDialog = ({
  post,
  open,
  onOpenChange,
}: PostDetailDialogProps) => {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes || 0);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);

  if (!post) return null;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    toast({ title: isLiked ? "Like removed" : "Post liked!" });
  };

  const handleComment = () => {
    setCommentDialogOpen(true);
  };

  const handleShare = () => {
    toast({ title: "Share options", description: "Post ready to share" });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({ title: isSaved ? "Removed from saved" : "Post saved!" });
  };

  const defaultAuthor = {
    name: "Community Member",
    avatar: "",
    role: "Member"
  };

  const author = post.author || defaultAuthor;

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[95vh] h-[95vh] flex flex-col overflow-hidden touch-auto">
          {/* Header */}
          <DrawerHeader className="flex-shrink-0 border-b pb-3">
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
            <DrawerTitle className="text-center text-base">
              Post Details
            </DrawerTitle>
          </DrawerHeader>

          <ScrollArea className="flex-1 overflow-y-auto min-h-0 touch-auto">
            <div className="p-4 space-y-4">
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{author.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {author.role && <span>{author.role}</span>}
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(post.date, "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Post Content */}
              <div className="space-y-3">
                <p className="text-sm leading-relaxed">{post.content}</p>
                
                {/* Image placeholder if post has images */}
                {post.type === "photo" && post.imageCount && (
                  <div className="bg-muted/50 rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {post.imageCount} photos attached
                    </span>
                  </div>
                )}
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center justify-between text-xs text-muted-foreground py-2">
                <span>{likesCount} likes</span>
                <div className="flex items-center gap-3">
                  <span>{post.comments} comments</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex items-center justify-between py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-10 gap-2 transition-all duration-200"
                  onClick={handleLike}
                >
                  <Heart 
                    className={`h-5 w-5 transition-all duration-200 ${
                      isLiked 
                        ? "fill-red-500 text-red-500 scale-110" 
                        : "hover:scale-110"
                    }`} 
                  />
                  <span className={isLiked ? "text-red-500" : ""}>Like</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-10 gap-2"
                  onClick={handleComment}
                >
                  <MessageSquare className="h-5 w-5" />
                  Comment
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-10 gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                  Share
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={handleSave}
                >
                  <Bookmark 
                    className={`h-5 w-5 transition-all duration-200 ${
                      isSaved 
                        ? "fill-primary text-primary" 
                        : ""
                    }`} 
                  />
                </Button>
              </div>

              <Separator />

              {/* Quick Comment Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Comments</h4>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 text-xs"
                    onClick={handleComment}
                  >
                    View all {post.comments} comments
                  </Button>
                </div>
                
                {/* Sample comments preview */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs bg-muted">J</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-muted/50 rounded-lg p-2">
                      <p className="text-xs font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground">
                        Great initiative! Looking forward to this.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs bg-muted">S</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-muted/50 rounded-lg p-2">
                      <p className="text-xs font-medium">Sarah Wilson</p>
                      <p className="text-xs text-muted-foreground">
                        Thank you for sharing this update!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add comment input */}
                <div 
                  className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={handleComment}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">Y</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">Write a comment...</span>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Comment Dialog */}
      <CommentSectionDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        title={post.content.substring(0, 40) + "..."}
        contextId={post.id}
      />
    </>
  );
};
