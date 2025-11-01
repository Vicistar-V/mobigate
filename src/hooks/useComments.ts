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

      // Simulate API call
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
          isOwner: true,
        };

        setComments((prev) => [newComment, ...prev]);
        setLoading(false);
        toast({
          description: "Comment added successfully",
        });
      }, 500);
    },
    [postId, currentUserId, userProfile, toast]
  );

  const deleteComment = useCallback(
    (commentId: string) => {
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      toast({
        description: "Comment deleted",
      });
    },
    [toast]
  );

  const likeComment = useCallback(
    (commentId: string) => {
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            const newIsLiked = !comment.isLiked;
            return {
              ...comment,
              isLiked: newIsLiked,
              likes: newIsLiked ? comment.likes + 1 : comment.likes - 1,
            };
          }
          return comment;
        })
      );
    },
    []
  );

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    likeComment,
  };
};
