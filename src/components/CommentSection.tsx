import { useState } from "react";
import { CommentInput } from "@/components/CommentInput";
import { CommentItem } from "@/components/CommentItem";
import { Button } from "@/components/ui/button";
import { useComments } from "@/hooks/useComments";
import { sortComments } from "@/lib/commentUtils";
import { CommentSortOption } from "@/types/comments";
import { MessageSquare, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface CommentSectionProps {
  postId: string;
  className?: string;
}

export const CommentSection = ({ postId, className = "" }: CommentSectionProps) => {
  const { comments, loading, addComment, deleteComment, likeComment } =
    useComments(postId);
  const [sortBy, setSortBy] = useState<CommentSortOption>("newest");

  const sortedComments = sortComments(comments, sortBy);

  const getSortLabel = (option: CommentSortOption): string => {
    switch (option) {
      case "newest":
        return "Newest First";
      case "oldest":
        return "Oldest First";
      case "popular":
        return "Most Popular";
      default:
        return "Sort";
    }
  };

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
          Comments ({comments.length})
        </h3>
        {comments.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 sm:gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline">{getSortLabel(sortBy)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("newest")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("popular")}>
                Most Popular
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Separator />

      {/* Comment Input */}
      <CommentInput onSubmit={addComment} loading={loading} />

      <Separator />

      {/* Comments List */}
      <div className="space-y-4 sm:space-y-6">
        {sortedComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h4 className="text-base sm:text-lg font-medium mb-2">No comments yet</h4>
            <p className="text-base text-muted-foreground">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={likeComment}
              onDelete={deleteComment}
            />
          ))
        )}
      </div>
    </div>
  );
};
