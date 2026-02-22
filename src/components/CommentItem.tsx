import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MoreVertical, Trash2, MessageCircle, Share2, Pencil, EyeOff, Eye, Send } from "lucide-react";
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
  onReply?: (parentCommentId: string, content: string) => void;
  onEdit?: (commentId: string, newContent: string) => void;
  onHide?: (commentId: string) => void;
  isReply?: boolean;
}

export const CommentItem = ({ 
  comment, 
  onLike, 
  onDelete,
  onShare,
  onReply,
  onEdit,
  onHide,
  isReply = false,
}: CommentItemProps) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleReplySubmit = () => {
    if (replyContent.trim() && onReply) {
      onReply(comment.id, replyContent.trim());
      setReplyContent("");
      setShowReplyInput(false);
    }
  };

  const handleEditSubmit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(comment.id, editContent.trim());
      setIsEditing(false);
    }
  };

  // If hidden and not the owner, don't render
  if (comment.isHidden && !comment.isOwner) return null;

  return (
    <div className={`space-y-2 ${isReply ? "ml-8 sm:ml-10" : ""}`}>
      <div className={`flex gap-2 group animate-fade-in ${comment.isHidden ? "opacity-50" : ""}`}>
        <Link 
          to={`/profile/${comment.userId || '1'}`}
          className="shrink-0"
        >
          <Avatar className={`${isReply ? "h-6 w-6" : "h-7 w-7 sm:h-8 sm:w-8"} cursor-pointer hover:opacity-80 transition-opacity`}>
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
                {comment.isHidden && (
                  <span className="text-xs text-muted-foreground italic">(Hidden)</span>
                )}
              </div>

              {isEditing ? (
                <div className="mt-1 space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[40px] text-sm resize-none"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 text-xs" onClick={handleEditSubmit}>Save</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setIsEditing(false); setEditContent(comment.content); }}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm mt-0.5 whitespace-pre-wrap break-words hyphens-auto leading-relaxed">
                  {comment.content}
                </p>
              )}
            </div>

            {comment.isOwner && !isEditing && (
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
                    onClick={() => { setIsEditing(true); setEditContent(comment.content); }}
                    className="text-sm"
                  >
                    <Pencil className="h-3.5 w-3.5 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onHide?.(comment.id)}
                    className="text-sm"
                  >
                    {comment.isHidden ? (
                      <><Eye className="h-3.5 w-3.5 mr-2" />Unhide</>
                    ) : (
                      <><EyeOff className="h-3.5 w-3.5 mr-2" />Hide</>
                    )}
                  </DropdownMenuItem>
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
          {!isEditing && (
            <div className="flex items-center gap-4 pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(comment.id)}
                className={`h-auto p-0 hover:bg-transparent gap-1.5 text-xs ${
                  comment.isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${comment.isLiked ? "fill-current" : ""}`} />
                <span className="font-medium">{comment.likes}</span>
              </Button>

              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className={`h-auto p-0 hover:bg-transparent gap-1.5 text-xs ${
                    showReplyInput ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span className="font-medium">{comment.replyCount}</span>
                </Button>
              )}

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
          )}
        </div>
      </div>

      {/* Reply Input */}
      {showReplyInput && (
        <div className="ml-8 sm:ml-10 flex gap-2 items-start">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={`Reply to ${comment.author}...`}
            className="min-h-[36px] text-sm resize-none flex-1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleReplySubmit();
              }
            }}
          />
          <Button
            size="sm"
            className="h-8 w-8 p-0 shrink-0"
            onClick={handleReplySubmit}
            disabled={!replyContent.trim()}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Nested Replies - only 1 level deep */}
      {!isReply && comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onDelete={onDelete}
              onShare={onShare}
              onEdit={onEdit}
              onHide={onHide}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
};
