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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  X, 
  MessageSquare, 
  Heart, 
  Share2, 
  ImageIcon,
  FileText,
  Calendar
} from "lucide-react";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CommentSectionDialog } from "@/components/community/CommentSectionDialog";
import { PostDetailDialog } from "@/components/community/PostDetailDialog";

interface ContributionsDialogProps {
  member: ExecutiveMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock contributions data
const mockContributions = {
  posts: [
    {
      id: "1",
      type: "post",
      content: "Congratulations to all our members who participated in the community development drive last weekend. Your efforts made a tremendous impact!",
      date: new Date(2024, 10, 28),
      likes: 45,
      comments: 12,
      shares: 5,
    },
    {
      id: "2",
      type: "post",
      content: "Reminder: Our quarterly general meeting is scheduled for next Saturday at 10am. Please ensure your attendance.",
      date: new Date(2024, 10, 25),
      likes: 32,
      comments: 8,
      shares: 15,
    },
    {
      id: "3",
      type: "photo",
      content: "Photos from the community town hall meeting.",
      date: new Date(2024, 10, 20),
      likes: 78,
      comments: 23,
      shares: 10,
      imageCount: 12,
    },
  ],
  comments: [
    {
      id: "1",
      content: "This is a wonderful initiative. Count me in for the next phase!",
      date: new Date(2024, 10, 27),
      postTitle: "Community Development Project Phase 2",
    },
    {
      id: "2",
      content: "Thank you for the clarification. This helps a lot.",
      date: new Date(2024, 10, 24),
      postTitle: "Financial Report Q3 2024",
    },
  ],
  reactions: [
    {
      id: "1",
      type: "like",
      date: new Date(2024, 10, 28),
      postTitle: "New Community Center Opening",
    },
    {
      id: "2",
      type: "love",
      date: new Date(2024, 10, 26),
      postTitle: "Youth Empowerment Program Success",
    },
  ],
};

export const ContributionsDialog = ({
  member,
  open,
  onOpenChange,
}: ContributionsDialogProps) => {
  const { toast } = useToast();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<{id: string, title: string} | null>(null);
  const [postDetailOpen, setPostDetailOpen] = useState(false);
  const [selectedPostDetail, setSelectedPostDetail] = useState<typeof mockContributions.posts[0] | null>(null);

  if (!member) return null;

  const handleLikePost = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        toast({ title: "Like removed" });
      } else {
        newSet.add(postId);
        toast({ title: "Post liked!" });
      }
      return newSet;
    });
  };

  const handleCommentPost = (postId: string, postTitle: string) => {
    setSelectedPost({ id: postId, title: postTitle });
    setCommentDialogOpen(true);
  };

  const handleSharePost = (postId: string) => {
    toast({ title: "Share options", description: "Post ready to share" });
  };

  const handleLikeComment = (commentId: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
        toast({ title: "Like removed" });
      } else {
        newSet.add(commentId);
        toast({ title: "Comment liked!" });
      }
      return newSet;
    });
  };

  const handleOpenPost = (postTitle: string, postData?: typeof mockContributions.posts[0]) => {
    if (postData) {
      setSelectedPostDetail(postData);
      setPostDetailOpen(true);
    } else {
      // For reactions/comments tab where we don't have full post data
      toast({ title: "Opening post", description: postTitle });
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] h-[90vh] flex flex-col overflow-hidden">
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
            Community Contributions
          </DrawerTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={member.imageUrl} alt={member.name} />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{member.name}</span>
          </div>
        </DrawerHeader>

        {/* Content */}
        <Tabs defaultValue="posts" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 mx-5 mt-3 max-w-[calc(100%-2.5rem)]">
            <TabsTrigger value="posts" className="text-xs">
              <FileText className="h-3.5 w-3.5 mr-1" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="comments" className="text-xs">
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              Comments
            </TabsTrigger>
            <TabsTrigger value="reactions" className="text-xs">
              <Heart className="h-3.5 w-3.5 mr-1" />
              Reactions
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 overflow-y-auto">
            {/* Posts Tab */}
            <TabsContent value="posts" className="px-5 py-4 space-y-3 m-0">
              {mockContributions.posts.map((post) => (
                <div key={post.id} className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(post.date, "MMM d, yyyy")}
                    {post.type === "photo" && (
                      <span className="flex items-center gap-1 ml-auto bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        <ImageIcon className="h-3 w-3" />
                        {post.imageCount} photos
                      </span>
                    )}
                  </div>
                  <p 
                    className="text-sm cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleOpenPost(post.content.substring(0, 50) + "...", post)}
                  >
                    {post.content}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs gap-1"
                      onClick={() => handleLikePost(post.id)}
                    >
                      <Heart className={`h-3.5 w-3.5 ${likedPosts.has(post.id) ? "fill-red-500 text-red-500" : ""}`} />
                      {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs gap-1"
                      onClick={() => handleCommentPost(post.id, post.content.substring(0, 40) + "...")}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      {post.comments}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs gap-1"
                      onClick={() => handleSharePost(post.id)}
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      {post.shares}
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments" className="px-5 py-4 space-y-3 m-0">
              {mockContributions.comments.map((comment) => (
                <div key={comment.id} className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(comment.date, "MMM d, yyyy")}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs gap-1"
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <Heart className={`h-3 w-3 ${likedComments.has(comment.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-muted-foreground">
                    On: <span 
                      className="text-primary cursor-pointer hover:underline"
                      onClick={() => handleOpenPost(comment.postTitle)}
                    >
                      {comment.postTitle}
                    </span>
                  </p>
                </div>
              ))}
            </TabsContent>

            {/* Reactions Tab */}
            <TabsContent value="reactions" className="px-5 py-4 space-y-3 m-0">
              {mockContributions.reactions.map((reaction) => (
                <div key={reaction.id} className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {reaction.type === "like" ? (
                        <Heart className="h-3 w-3" />
                      ) : (
                        <Heart className="h-3 w-3 fill-current" />
                      )}
                      {reaction.type}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                      <Calendar className="h-3 w-3" />
                      {format(reaction.date, "MMM d, yyyy")}
                    </span>
                  </div>
                  <p 
                    className="text-sm text-primary cursor-pointer hover:underline"
                    onClick={() => handleOpenPost(reaction.postTitle)}
                  >
                    {reaction.postTitle}
                  </p>
                </div>
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Comment Section Dialog */}
        <CommentSectionDialog
          open={commentDialogOpen}
          onOpenChange={setCommentDialogOpen}
          title={selectedPost?.title || "Comments"}
          contextId={selectedPost?.id || ""}
        />

        {/* Post Detail Dialog */}
        <PostDetailDialog
          post={selectedPostDetail}
          open={postDetailOpen}
          onOpenChange={setPostDetailOpen}
        />
      </DrawerContent>
    </Drawer>
  );
};
