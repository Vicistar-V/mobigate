// Data shapes + mock fallbacks for the Breaking News "Top Trending Headlines"
// feature card and the "Headlines you don't wanna miss" list.
// These mirror what the PHP backend injects on window.* (see useWindowData).

export interface TrendingHeadline {
  id: string;
  /** Short red-box label, e.g. "DYNAMICS OF LEADERSHIP" */
  category: string;
  /** Body snippet (justified serif paragraph) shown in the card */
  excerpt: string;
  /** Full article body — array of paragraphs shown in the reader drawer */
  content: string[];
  /** Large feature portrait / cover image (hero in the drawer) */
  imageUrl: string;
  /** Up to 3 media images (0–3). When present, drives the swipeable gallery. */
  images?: string[];
  /** Small inline thumbnail shown beside the excerpt in the card */
  thumbnail: string;
  author: string;
  authorAvatar: string;
  /** e.g. "2 Hours ago" */
  timeAgo: string;
  privacy: "Public" | "Friends" | "Private";
  likes?: number;
  views?: number;
  comments?: number;
  isFollowing?: boolean;
  isLiked?: boolean;
}

export interface MissedHeadline {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  imageUrl: string;
  images?: string[];
  category: string;
  author: string;
  authorAvatar: string;
  timeAgo: string;
  privacy: "Public" | "Friends" | "Private";
  likes?: number;
  views?: number;
  comments?: number;
}

/** Normalized shape the reader drawer consumes from any source. */
export interface NewsArticle {
  id: string;
  category: string;
  title: string;
  content: string[];
  imageUrl: string;
  /** Up to 3 media images (photos/videos). Falls back to [imageUrl] when absent. */
  images?: string[];
  author: string;
  authorAvatar: string;
  timeAgo: string;
  privacy: "Public" | "Friends" | "Private";
  likes?: number;
  /** Auto-incremented view counter shown as "⏺ 2,604". */
  views?: number;
  /** Number of comments on the post. */
  comments?: number;
  isFollowing?: boolean;
  isLiked?: boolean;
}

export const fallbackTrendingHeadline: TrendingHeadline = {
  id: "th_1",
  category: "DYNAMICS OF LEADERSHIP",
  excerpt:
    "True leadership is not about authority, but about responsibility and vision. The most effective leaders inspire trust, empower their people, and stay accountable through every challenge, turning pressure into progress and doubt into direction for everyone who follows them.",
  content: [
    "True leadership is not about authority, but about responsibility and vision. The most effective leaders inspire trust, empower their people, and stay accountable through every challenge they face along the way.",
    "Across boardrooms and communities alike, a new generation of leaders is rewriting the rules of influence. They lead not by command, but by example — listening more than they speak, and serving more than they are served.",
    "Experts argue that the dynamics of leadership have shifted permanently. Emotional intelligence, transparency, and adaptability now outweigh raw ambition. The leaders who thrive are those who can unite people around a shared purpose.",
    "As the world grows more complex, the demand for principled leadership has never been higher. The question is no longer who holds power, but how that power is used to lift others and build something that lasts.",
  ],
  imageUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
  images: [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  ],
  thumbnail:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80",
  author: "Anthony Samuel Odiba",
  authorAvatar:
    "https://api.dicebear.com/7.x/initials/svg?seed=Anthony%20Samuel%20Odiba&backgroundColor=c0392b",
  timeAgo: "2 Hours ago",
  privacy: "Public",
  likes: 1240,
  views: 2604,
  comments: 87,
  isFollowing: false,
  isLiked: false,
};

export const fallbackMissedHeadlines: MissedHeadline[] = [
  {
    id: "mh_1",
    title: "The First Black Pope in 1000 Years Emerges!",
    category: "WORLD",
    excerpt:
      "A historic moment unfolds at the Vatican as cardinals elect a new leader, marking a turning point for millions of believers worldwide.",
    content: [
      "A historic moment unfolds at the Vatican as cardinals elect a new leader, marking a turning point for millions of believers worldwide.",
      "Crowds gathered in St. Peter's Square erupted in celebration as white smoke rose into the evening sky, signalling the end of one era and the dawn of another.",
      "Observers describe the election as one of the most consequential in modern history, reflecting a church that is increasingly global, diverse, and attuned to the voices of the faithful far beyond Europe.",
      "In his first address, the new pontiff called for unity, humility, and compassion — themes that are expected to define a papacy many believe will reshape the institution for generations.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
    author: "Grace Okonkwo",
    authorAvatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Grace%20Okonkwo&backgroundColor=2980b9",
    timeAgo: "3 Hours ago",
    privacy: "Public",
    likes: 980,
  },
  {
    id: "mh_2",
    title: "Markets Surge as Tech Giants Report Record Earnings",
    category: "BUSINESS",
    excerpt:
      "Global indices climb to new highs after a wave of stronger-than-expected results from the world's largest technology companies.",
    content: [
      "Global indices climbed to new highs after a wave of stronger-than-expected results from the world's largest technology companies.",
      "Investors cheered robust revenue growth driven by artificial intelligence, cloud computing, and resilient consumer demand, sending shares sharply higher in early trading.",
      "Analysts caution, however, that valuations remain stretched and that markets could prove volatile if growth slows in the coming quarters.",
      "For now, optimism reigns. The rally underscores the enduring influence of the technology sector on the broader economy and the portfolios of everyday investors.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    author: "Daniel Mensah",
    authorAvatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Daniel%20Mensah&backgroundColor=27ae60",
    timeAgo: "5 Hours ago",
    privacy: "Public",
    likes: 642,
  },
  {
    id: "mh_3",
    title: "Breakthrough Solar Tech Promises Cheaper Clean Energy",
    category: "SCIENCE",
    excerpt:
      "Researchers unveil a new generation of solar cells that could dramatically lower the cost of renewable power across the globe.",
    content: [
      "Researchers have unveiled a new generation of solar cells that could dramatically lower the cost of renewable power across the globe.",
      "The breakthrough, years in the making, doubles efficiency while using cheaper, more abundant materials — a combination scientists once thought impossible.",
      "If scaled successfully, the technology could accelerate the transition away from fossil fuels and bring affordable electricity to regions that have long lived without it.",
      "Industry leaders are already racing to commercialise the discovery, calling it one of the most promising advances in clean energy in a decade.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    author: "Amara Bello",
    authorAvatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Amara%20Bello&backgroundColor=8e44ad",
    timeAgo: "8 Hours ago",
    privacy: "Public",
    likes: 415,
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

/** Map a trending headline into the normalized reader-drawer article shape. */
export const trendingToArticle = (h: TrendingHeadline): NewsArticle => ({
  id: h.id,
  category: h.category,
  title: h.category,
  content: h.content,
  imageUrl: h.imageUrl,
  author: h.author,
  authorAvatar: h.authorAvatar,
  timeAgo: h.timeAgo,
  privacy: h.privacy,
  likes: h.likes,
  isFollowing: h.isFollowing,
  isLiked: h.isLiked,
});

/** Map a "missed" headline into the normalized reader-drawer article shape. */
export const missedToArticle = (h: MissedHeadline): NewsArticle => ({
  id: h.id,
  category: h.category,
  title: h.title,
  content: h.content,
  imageUrl: h.imageUrl,
  author: h.author,
  authorAvatar: h.authorAvatar,
  timeAgo: h.timeAgo,
  privacy: h.privacy,
  likes: h.likes,
});
