import { Link } from "react-router-dom";
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
    <div className="flex gap-2 sm:gap-3 group animate-fade-in">
      <Link 
        to={`/profile/${comment.userId || '1'}`}
        className="shrink-0"
      >
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src={comment.authorProfileImage} alt={comment.author} />
          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 space-y-0.5 sm:space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <Link 
                to={`/profile/${comment.userId || '1'}`}
                className="font-semibold text-base sm:text-lg hover:text-primary transition-colors"
              >
                {comment.author}
              </Link>
              <span className="text-sm sm:text-base text-muted-foreground">
                {formatCommentTime(comment.timestamp)}
              </span>
            </div>
            <p className="text-base sm:text-lg mt-1 whitespace-pre-wrap break-words hyphens-auto">
              {comment.content}
            </p>
          </div>

          {comment.isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
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

        <div className="flex items-center gap-2 sm:gap-4 pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(comment.id)}
            className={`h-auto p-0 hover:bg-transparent gap-1.5 ${
              comment.isLiked ? "text-red-600" : "text-muted-foreground"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${comment.isLiked ? "fill-current" : ""}`}
            />
            <span className="text-sm sm:text-base font-medium">{comment.likes}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
