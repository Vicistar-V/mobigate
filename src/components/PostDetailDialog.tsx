import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PostDetailDialogProps {
  children: ReactNode;
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

export const PostDetailDialog = ({
  children,
  title,
  subtitle,
  author,
  status,
  views,
  comments,
  likes,
  type,
  imageUrl,
}: PostDetailDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4">
            {imageUrl && (
              <div className="relative rounded-lg overflow-hidden">
                <img src={imageUrl} alt={title} className="w-full h-auto" />
                <Badge className="absolute top-2 right-2" variant="destructive">
                  {type}
                </Badge>
              </div>
            )}
            
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
            
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <p className="font-medium">By {author}</p>
              <p className="text-sm text-muted-foreground">Status: {status}</p>
              
              <div className="flex items-center gap-4 text-sm">
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
            </div>
            
            <div className="prose prose-sm max-w-none">
              <p>
                This is where the full content of the post would appear. In a real application,
                this would contain the complete article, video player, or photo gallery with
                detailed information about the content.
              </p>
              <p>
                Users can engage with this content, leave comments, and interact with the
                creator directly from this view.
              </p>
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button className="flex-1" variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button className="flex-1" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comment
              </Button>
              <Button className="flex-1" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
