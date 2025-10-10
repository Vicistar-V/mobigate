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
  replies?: Comment[];
  isOwner?: boolean;
}

export interface CommentFormData {
  content: string;
}

export type CommentSortOption = "newest" | "oldest" | "popular";
