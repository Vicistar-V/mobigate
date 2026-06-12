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
  /** Number of gifts received on the post. */
  gifts?: number;
  /** Backend user id of the author — needed to send gifts. */
  authorId?: string;
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
    views: 1820,
    comments: 54,
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
    views: 1133,
    comments: 31,
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
    views: 894,
    comments: 22,
  },
  {
    id: "mh_4",
    title: "Coastal Cities Unveil Bold Plan to Tame Rising Seas",
    category: "WORLD",
    excerpt:
      "A coalition of coastal megacities announces a sweeping engineering programme to protect millions from flooding in the decades ahead.",
    content: [
      "A coalition of coastal megacities has announced a sweeping engineering programme to protect millions of residents from flooding in the decades ahead.",
      "The plan combines floating neighbourhoods, restored wetlands, and next-generation sea walls designed to adapt as waters continue to rise.",
      "Officials say the initiative will be funded through a mix of public investment and private partnerships, with the first projects breaking ground next year.",
      "Climate experts welcomed the move but warned that adaptation alone cannot replace urgent cuts to global emissions.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1496450681664-3df85efbd29f?w=800&q=80",
    author: "Tunde Adeyemi",
    authorAvatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Tunde%20Adeyemi&backgroundColor=16a085",
    timeAgo: "10 Hours ago",
    privacy: "Public",
    likes: 372,
    views: 765,
    comments: 18,
  },
  {
    id: "mh_5",
    title: "Underdog Squad Stuns Champions in Final-Second Thriller",
    category: "SPORTS",
    excerpt:
      "A last-gasp goal sends shockwaves through the league as the season's biggest favourites crash out in dramatic fashion.",
    content: [
      "A last-gasp goal sent shockwaves through the league as the season's biggest favourites crashed out in dramatic fashion.",
      "The underdog squad, written off by pundits weeks ago, produced a performance of grit and flair that few will forget.",
      "Fans flooded the streets in celebration, while the defeated champions were left to reflect on a campaign that promised so much.",
      "The result reshapes the title race and sets up a tantalising run-in to the season's climax.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
    author: "Ngozi Eze",
    authorAvatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Ngozi%20Eze&backgroundColor=c0392b",
    timeAgo: "12 Hours ago",
    privacy: "Public",
    likes: 528,
    views: 1042,
    comments: 47,
  },
  {
    id: "mh_6",
    title: "New Health Study Rewrites the Rules on Daily Habits",
    category: "HEALTH",
    excerpt:
      "A landmark study upends long-held assumptions about exercise, sleep, and nutrition, offering surprising guidance for everyday life.",
    content: [
      "A landmark study has upended long-held assumptions about exercise, sleep, and nutrition, offering surprising guidance for everyday life.",
      "Researchers followed tens of thousands of participants over a decade, uncovering patterns that challenge popular wellness advice.",
      "Among the findings: consistency matters far more than intensity, and small daily choices compound into outsized long-term benefits.",
      "Doctors say the results could reshape public health messaging and empower people to make smarter, simpler decisions.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80",
    author: "Ifeoma Nwosu",
    authorAvatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Ifeoma%20Nwosu&backgroundColor=2c3e50",
    timeAgo: "14 Hours ago",
    privacy: "Public",
    likes: 689,
    views: 1310,
    comments: 63,
  },
  {
    id: "mh_7",
    title: "Streaming Wars Heat Up as New Platform Lands Blockbuster Deal",
    category: "ENTERTAINMENT",
    excerpt:
      "A bold newcomer secures exclusive rights to a slate of major releases, shaking up an industry already fighting for attention.",
    content: [
      "A bold newcomer has secured exclusive rights to a slate of major releases, shaking up an industry already fighting for attention.",
      "The deal signals an aggressive push into original content, with billions earmarked for production over the next three years.",
      "Rivals are scrambling to respond, sparking fresh speculation about consolidation across the entertainment landscape.",
      "For viewers, the competition could mean more choice — and more difficult decisions about where to spend their subscription dollars.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80",
    author: "Kelechi Obi",
    authorAvatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Kelechi%20Obi&backgroundColor=d35400",
    timeAgo: "16 Hours ago",
    privacy: "Public",
    likes: 451,
    views: 980,
    comments: 29,
  },
  {
    id: "mh_8",
    title: "Startups Race to Build the Next Generation of AI Assistants",
    category: "TECH",
    excerpt:
      "A new wave of startups is betting that smarter, more personal AI assistants will transform how we work and live.",
    content: [
      "A new wave of startups is betting that smarter, more personal AI assistants will transform how we work and live.",
      "These tools promise to anticipate needs, automate routine tasks, and adapt to each user's unique style and preferences.",
      "Investors are pouring capital into the space, even as questions about privacy, accuracy, and trust remain unresolved.",
      "Whether any of them can dethrone today's tech giants is the question keeping the industry on edge.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80",
    author: "Zainab Yusuf",
    authorAvatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Zainab%20Yusuf&backgroundColor=2980b9",
    timeAgo: "18 Hours ago",
    privacy: "Public",
    likes: 736,
    views: 1502,
    comments: 58,
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
  images: h.images && h.images.length ? h.images.slice(0, 3) : [h.imageUrl],
  author: h.author,
  authorAvatar: h.authorAvatar,
  timeAgo: h.timeAgo,
  privacy: h.privacy,
  likes: h.likes,
  views: h.views,
  comments: h.comments,
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
  images: h.images && h.images.length ? h.images.slice(0, 3) : [h.imageUrl],
  author: h.author,
  authorAvatar: h.authorAvatar,
  timeAgo: h.timeAgo,
  privacy: h.privacy,
  likes: h.likes,
  views: h.views,
  comments: h.comments,
});
