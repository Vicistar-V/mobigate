import { useState, useCallback } from "react";
import { Comment } from "@/types/comments";
import { mockComments, getCommentsByPostId } from "@/data/comments";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUserId, useUserProfile } from "@/hooks/useWindowData";

export const useComments = (postId: string) => {
  const currentUserId = useCurrentUserId();
  const userProfile = useUserProfile();
  const [comments, setComments] = useState<Comment[]>(
    getCommentsByPostId(postId)
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addComment = useCallback(
    (content: string, author?: string, authorImage?: string) => {
      setLoading(true);
      setTimeout(() => {
        const newComment: Comment = {
          id: `comm_${Date.now()}`,
          postId,
          userId: currentUserId,
          author: author || userProfile.fullName,
          authorProfileImage: authorImage || userProfile.avatar,
          content,
          timestamp: new Date().toISOString(),
          likes: 0,
          isLiked: false,
          shares: 0,
          isShared: false,
          replyCount: 0,
          isOwner: true,
        };
        setComments((prev) => [newComment, ...prev]);
        setLoading(false);
        toast({ description: "Comment added successfully" });
      }, 500);
    },
    [postId, currentUserId, userProfile, toast]
  );

  const deleteComment = useCallback(
    (commentId: string) => {
      setComments((prev) => {
        // Check top-level
        const filtered = prev.filter((c) => c.id !== commentId);
        // Also remove from replies
        return filtered.map((c) => ({
          ...c,
          replies: c.replies?.filter((r) => r.id !== commentId),
          replyCount: c.replies?.filter((r) => r.id !== commentId).length || 0,
        }));
      });
      toast({ description: "Comment deleted" });
    },
    [toast]
  );

  const likeComment = useCallback(
    (commentId: string) => {
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            const newIsLiked = !comment.isLiked;
            return { ...comment, isLiked: newIsLiked, likes: newIsLiked ? comment.likes + 1 : comment.likes - 1 };
          }
          // Check replies
          if (comment.replies?.some((r) => r.id === commentId)) {
            return {
              ...comment,
              replies: comment.replies.map((r) => {
                if (r.id === commentId) {
                  const newIsLiked = !r.isLiked;
                  return { ...r, isLiked: newIsLiked, likes: newIsLiked ? r.likes + 1 : r.likes - 1 };
                }
                return r;
              }),
            };
          }
          return comment;
        })
      );
    },
    []
  );

  const shareComment = useCallback(
    async (commentId: string) => {
      const comment = comments.find((c) => c.id === commentId) || 
        comments.flatMap((c) => c.replies || []).find((r) => r.id === commentId);
      
      if (comment) {
        const shareData = {
          title: `Comment by ${comment.author}`,
          text: comment.content,
          url: window.location.href,
        };
        try {
          if (navigator.share) {
            await navigator.share(shareData);
          } else {
            await navigator.clipboard.writeText(`${comment.content}\n\n${window.location.href}`);
            toast({ description: "Comment copied to clipboard" });
          }
        } catch {
          await navigator.clipboard.writeText(`${comment.content}\n\n${window.location.href}`);
          toast({ description: "Comment copied to clipboard" });
        }
      }

      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            return { ...c, isShared: true, shares: c.shares + 1 };
          }
          if (c.replies?.some((r) => r.id === commentId)) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r.id === commentId ? { ...r, isShared: true, shares: r.shares + 1 } : r
              ),
            };
          }
          return c;
        })
      );
    },
    [comments, toast]
  );

  const replyToComment = useCallback(
    (parentCommentId: string, content: string) => {
      const reply: Comment = {
        id: `reply_${Date.now()}`,
        postId,
        userId: currentUserId,
        author: userProfile.fullName,
        authorProfileImage: userProfile.avatar,
        content,
        timestamp: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        shares: 0,
        isShared: false,
        replyCount: 0,
        isOwner: true,
      };

      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), reply],
              replyCount: (comment.replyCount || 0) + 1,
            };
          }
          return comment;
        })
      );
      toast({ description: "Reply added" });
    },
    [postId, currentUserId, userProfile, toast]
  );

  const editComment = useCallback(
    (commentId: string, newContent: string) => {
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) return { ...c, content: newContent };
          if (c.replies?.some((r) => r.id === commentId)) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r.id === commentId ? { ...r, content: newContent } : r
              ),
            };
          }
          return c;
        })
      );
      toast({ description: "Comment updated" });
    },
    [toast]
  );

  const hideComment = useCallback(
    (commentId: string) => {
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) return { ...c, isHidden: !c.isHidden };
          if (c.replies?.some((r) => r.id === commentId)) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r.id === commentId ? { ...r, isHidden: !r.isHidden } : r
              ),
            };
          }
          return c;
        })
      );
      toast({ description: "Comment visibility updated" });
    },
    [toast]
  );

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    likeComment,
    shareComment,
    replyToComment,
    editComment,
    hideComment,
  };
};
