import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  ThumbsUp, 
  Reply, 
  Trash2,
  MoreVertical 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
  isOwn?: boolean;
}

interface CommentSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  contextId: string; // ID of article, opinion, etc.
  initialComments?: Comment[];
}

// Mock current user
const currentUser = {
  name: "Current User",
  avatar: "/placeholder.svg",
};

export function CommentSectionDialog({
  open,
  onOpenChange,
  title,
  contextId,
  initialComments = [],
}: CommentSectionDialogProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();

  const handlePostComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please write something before posting",
        variant: "destructive",
      });
      return;
    }

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: currentUser,
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      replies: [],
      isOwn: true,
    };

    setComments([comment, ...comments]);
    setNewComment("");
    toast({
      title: "Comment Posted",
      description: "Your comment has been added",
    });
  };

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) {
      toast({
        title: "Empty Reply",
        description: "Please write something before replying",
        variant: "destructive",
      });
      return;
    }

    const reply: Comment = {
      id: `reply-${Date.now()}`,
      author: currentUser,
      content: replyContent,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      isOwn: true,
    };

    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          };
        }
        return comment;
      })
    );

    setReplyContent("");
    setReplyingTo(null);
    toast({
      title: "Reply Posted",
      description: "Your reply has been added",
    });
  };

  const handleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(
        comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies?.map((reply) => {
                if (reply.id === commentId) {
                  return {
                    ...reply,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                    isLiked: !reply.isLiked,
                  };
                }
                return reply;
              }),
            };
          }
          return comment;
        })
      );
    } else {
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked,
            };
          }
          return comment;
        })
      );
    }
  };

  const handleDelete = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(
        comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies?.filter((reply) => reply.id !== commentId),
            };
          }
          return comment;
        })
      );
    } else {
      setComments(comments.filter((comment) => comment.id !== commentId));
    }

    toast({
      title: "Comment Deleted",
      description: "The comment has been removed",
    });
  };

  const renderComment = (comment: Comment, isReply: boolean = false, parentId?: string) => (
    <Card key={comment.id} className={`p-4 ${isReply ? "ml-8 mt-2" : ""}`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm">{comment.author.name}</p>
                {comment.isOwn && (
                  <Badge variant="secondary" className="text-xs">
                    You
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          </div>

          {comment.isOwn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleDelete(comment.id, isReply, parentId)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <Separator />

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLike(comment.id, isReply, parentId)}
            className={comment.isLiked ? "text-primary" : ""}
          >
            <ThumbsUp className={`h-4 w-4 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
            {comment.likes > 0 && <span className="ml-1">{comment.likes}</span>}
          </Button>

          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            >
              <Reply className="h-4 w-4 mr-1" />
              Reply
            </Button>
          )}
        </div>

        {/* Reply Input */}
        {replyingTo === comment.id && (
          <div className="space-y-2 pt-2 border-t">
            <Textarea
              placeholder={`Reply to ${comment.author.name}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={2}
              className="text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent("");
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleReply(comment.id)}>
                <Send className="h-3 w-3 mr-1" />
                Reply
              </Button>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2">
            {comment.replies.map((reply) => renderComment(reply, true, comment.id))}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </p>
        </DialogHeader>

        {/* New Comment Input */}
        <div className="p-4 sm:px-6 space-y-3 border-b">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={handlePostComment} size="sm">
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div 
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:px-6 touch-auto"
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => renderComment(comment))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium">No comments yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Be the first to share your thoughts
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
