import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MoreVertical, Trash2 } from "lucide-react";
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
}

export const CommentItem = ({ comment, onLike, onDelete }: CommentItemProps) => {
  return (
    <div className="flex gap-3 group animate-fade-in">
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage src={comment.authorProfileImage} alt={comment.author} />
        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-semibold text-sm">{comment.author}</span>
              <span className="text-xs text-muted-foreground">
                {formatCommentTime(comment.timestamp)}
              </span>
            </div>
            <p className="text-sm mt-1 whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>

          {comment.isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onDelete(comment.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Comment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-4 pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(comment.id)}
            className={`h-auto p-0 hover:bg-transparent gap-1.5 ${
              comment.isLiked ? "text-red-600" : "text-muted-foreground"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${comment.isLiked ? "fill-current" : ""}`}
            />
            <span className="text-xs font-medium">{comment.likes}</span>
          </Button>

          {comment.isLiked && (
            <span className="text-xs font-medium text-red-600">
              You Liked this
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
