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
  showHeader?: boolean;
}

export const CommentSection = ({ 
  postId, 
  className = "",
  showHeader = true 
}: CommentSectionProps) => {
  const { 
    comments, 
    loading, 
    addComment, 
    deleteComment, 
    likeComment,
    shareComment,
    replyToComment 
  } = useComments(postId);
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
    <div 
      className={`space-y-3 sm:space-y-4 overscroll-contain ${className}`}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Header - Only show if showHeader is true */}
      {showHeader && (
        <>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-semibold flex items-center gap-1.5 sm:gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments ({comments.length})
            </h3>
            {comments.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 sm:h-8 gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                    <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
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
        </>
      )}

      {/* Sort dropdown when header is hidden but comments exist */}
      {!showHeader && comments.length > 0 && (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs px-2">
                <ArrowUpDown className="h-3 w-3" />
                <span>{getSortLabel(sortBy)}</span>
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
        </div>
      )}

      {/* Comment Input */}
      <CommentInput onSubmit={addComment} loading={loading} />

      {/* Comments List */}
      <div className="space-y-3 sm:space-y-4">
        {sortedComments.length === 0 ? (
          <div className="text-center py-6 sm:py-10 px-4">
            <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-muted-foreground/50 mb-2 sm:mb-3" />
            <h4 className="text-sm sm:text-base font-medium mb-1">No comments yet</h4>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-[180px] sm:max-w-[220px] mx-auto leading-relaxed">
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
              onShare={shareComment}
              onReply={replyToComment}
            />
          ))
        )}
      </div>
    </div>
  );
};
