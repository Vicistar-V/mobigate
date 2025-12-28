import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MoreVertical, Trash2, MessageCircle, Share2 } from "lucide-react";
import { formatCommentTime } from "@/lib/commentUtils";
import { Comment } from "@/types/comments";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onShare?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
}

export const CommentItem = ({ 
  comment, 
  onLike, 
  onDelete,
  onShare,
  onReply 
}: CommentItemProps) => {
  return (
    <div className="flex gap-2 group animate-fade-in">
      <Link 
        to={`/profile/${comment.userId || '1'}`}
        className="shrink-0"
      >
        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src={comment.authorProfileImage} alt={comment.author} />
          <AvatarFallback className="text-xs">{comment.author.charAt(0)}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <Link 
                to={`/profile/${comment.userId || '1'}`}
                className="font-medium text-sm hover:text-primary transition-colors truncate"
              >
                {comment.author}
              </Link>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {formatCommentTime(comment.timestamp)}
              </span>
            </div>
            <p className="text-sm mt-0.5 whitespace-pre-wrap break-words hyphens-auto leading-relaxed">
              {comment.content}
            </p>
          </div>

          {comment.isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onDelete(comment.id)}
                  className="text-destructive focus:text-destructive text-sm"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Engagement Buttons */}
        <div className="flex items-center gap-4 pt-1">
          {/* Like Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(comment.id)}
            className={`h-auto p-0 hover:bg-transparent gap-1.5 text-xs ${
              comment.isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${comment.isLiked ? "fill-current" : ""}`}
            />
            <span className="font-medium">{comment.likes}</span>
          </Button>

          {/* Reply Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply?.(comment.id)}
            className="h-auto p-0 hover:bg-transparent gap-1.5 text-xs text-muted-foreground hover:text-primary"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="font-medium">{comment.replyCount}</span>
          </Button>

          {/* Share Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare?.(comment.id)}
            className={`h-auto p-0 hover:bg-transparent gap-1.5 text-xs ${
              comment.isShared ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="font-medium">{comment.shares}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
