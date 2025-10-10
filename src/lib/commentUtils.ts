import { Comment, CommentSortOption } from "@/types/comments";

export const sortComments = (
  comments: Comment[],
  sortBy: CommentSortOption
): Comment[] => {
  const sorted = [...comments];

  switch (sortBy) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    case "popular":
      return sorted.sort((a, b) => b.likes - a.likes);
    default:
      return sorted;
  }
};

export const formatCommentTime = (timestamp: string): string => {
  const now = new Date();
  const commentDate = new Date(timestamp);
  const diffInSeconds = Math.floor(
    (now.getTime() - commentDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
};

export const validateCommentContent = (content: string): {
  isValid: boolean;
  error?: string;
} => {
  const trimmed = content.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: "Comment cannot be empty" };
  }

  if (trimmed.length > 500) {
    return {
      isValid: false,
      error: "Comment must be 500 characters or less",
    };
  }

  return { isValid: true };
};
