// Data shapes + mock fallbacks for the Breaking News "Top Trending Headlines"
// feature card and the "Headlines you don't wanna miss" list.
// These mirror what the PHP backend injects on window.* (see useWindowData).

export interface TrendingHeadline {
  id: string;
  /** Short red-box label, e.g. "DYNAMICS OF LEADERSHIP" */
  category: string;
  /** Body snippet (justified serif paragraph) */
  excerpt: string;
  /** Large feature portrait / cover image */
  imageUrl: string;
  author: string;
  authorAvatar: string;
  /** e.g. "2 Hours ago" */
  timeAgo: string;
  privacy: "Public" | "Friends" | "Private";
  likes?: number;
  isFollowing?: boolean;
  isLiked?: boolean;
}

export interface MissedHeadline {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  timeAgo: string;
}

export const fallbackTrendingHeadline: TrendingHeadline = {
  id: "th_1",
  category: "DYNAMICS OF LEADERSHIP",
  excerpt:
    "True leadership is not about authority, but about responsibility and vision. The most effective leaders inspire trust, empower their people, and stay accountable through every challenge they face along the way.",
  imageUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
  author: "Anthony Samuel Odiba",
  authorAvatar:
    "https://api.dicebear.com/7.x/initials/svg?seed=Anthony%20Samuel%20Odiba&backgroundColor=c0392b",
  timeAgo: "2 Hours ago",
  privacy: "Public",
  likes: 1240,
  isFollowing: false,
  isLiked: false,
};

export const fallbackMissedHeadlines: MissedHeadline[] = [
  {
    id: "mh_1",
    title: "The First Black Pope in 1000 Years Emerges!",
    excerpt:
      "A historic moment unfolds at the Vatican as cardinals elect a new leader, marking a turning point for millions of believers worldwide.",
    imageUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80",
    timeAgo: "3 Hours ago",
  },
  {
    id: "mh_2",
    title: "The First Black Pope in 1000 Years Emerges!",
    excerpt:
      "Crowds gather across the globe to witness the announcement, sparking conversations about leadership, faith, and the future.",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    timeAgo: "5 Hours ago",
  },
  {
    id: "mh_3",
    title: "The First Black Pope in 1000 Years Emerges!",
    excerpt:
      "Analysts weigh in on what this means for global communities and the generations who have waited for this defining day.",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    timeAgo: "8 Hours ago",
  },
];

/** Side navigation links shown beside the feature card. */
export const trendingNavLinks: { label: string; href: string }[] = [
  { label: "Create New Story", href: "#create-story" },
  { label: "My Stories", href: "#my-stories" },
  { label: "Others' Stories", href: "#others-stories" },
  { label: "View Trending", href: "#view-trending" },
  { label: "New Subscribers", href: "#subscribers" },
  { label: "Privacy", href: "#privacy" },
];
