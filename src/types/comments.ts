export interface Comment {
  id: string;
  postId: string;
  userId: string;
  author: string;
  authorProfileImage: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  shares: number;
  isShared: boolean;
  replyCount: number;
  replies?: Comment[];
  isOwner?: boolean;
  isHidden?: boolean;
  isEditing?: boolean;
}

export interface CommentFormData {
  content: string;
}

export type CommentSortOption = "newest" | "oldest" | "popular";
