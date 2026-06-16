// src/data/adminContentData.ts
// Mock data for community content moderation

export type ContentType = "news" | "event" | "article" | "vibe";

export interface AdminContentItem {
  id:           string;
  type:         ContentType;
  title:        string;
  description?: string;
  content?:     string;
  thumbnail?:   string;
  category?:    string;
  tags?:        string[];
  status:       "published" | "pending" | "draft" | "rejected";
  featured?:    boolean;
  spotlight?:   boolean;
  authorName:   string;
  authorAvatar?: string;
  authorId?:    string;
  submittedAt?: Date;
  publishedAt?: Date;
  rejectionReason?: string;
  views:        number;
  likes:        number;
  comments:     number;
  // Events
  eventDate?:    Date;
  eventEndDate?: Date;
  venue?:        string;
  venueType?:    "physical" | "online" | "hybrid";
  capacity?:     number;
  rsvpCount?:    number;
  // Articles
  readTime?:     string;
  // Vibes
  mediaType?:    "video" | "photo" | "audio" | "gallery";
  duration?:     string;
  mediaUrl?:     string;
}

const makeId = () => Math.random().toString(36).slice(2, 10);

export const mockAdminNews: AdminContentItem[] = [
  {
    id: makeId(), type: "news", title: "Community Development Fund Reaches ₦5M Milestone",
    description: "The community development fund has successfully reached the 5 million naira milestone, thanks to generous contributions from members across all regions.",
    category: "community news", featured: true, status: "published",
    authorName: "Chukwudi Okafor", authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=CO",
    submittedAt: new Date(Date.now() - 3 * 86400000), publishedAt: new Date(Date.now() - 2 * 86400000),
    views: 1240, likes: 89, comments: 23,
    thumbnail: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&h=250&fit=crop",
  },
  {
    id: makeId(), type: "news", title: "Annual General Meeting Date Announced",
    description: "The date for this year's Annual General Meeting has been officially announced. All members are required to attend.",
    category: "announcement", status: "pending",
    authorName: "Ngozi Eze", authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=NE",
    submittedAt: new Date(Date.now() - 86400000),
    views: 0, likes: 0, comments: 0,
  },
  {
    id: makeId(), type: "news", title: "New Youth Empowerment Programme Launched",
    description: "A new skills acquisition and empowerment programme for community youth has been launched.",
    category: "development", featured: false, status: "draft",
    authorName: "Emeka Nwosu", authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=EN",
    submittedAt: new Date(Date.now() - 2 * 86400000),
    views: 0, likes: 0, comments: 0,
  },
];

export const mockAdminEvents: AdminContentItem[] = [
  {
    id: makeId(), type: "event", title: "Annual General Meeting 2025",
    description: "The most important gathering of the year. All members must attend. Minutes of last meeting will be adopted.",
    status: "published", venue: "Community Hall, Lagos", venueType: "physical",
    eventDate: new Date(Date.now() + 7 * 86400000),
    eventEndDate: new Date(Date.now() + 7 * 86400000 + 4 * 3600000),
    capacity: 500, rsvpCount: 342,
    authorName: "President-General", authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=PG",
    submittedAt: new Date(Date.now() - 5 * 86400000), publishedAt: new Date(Date.now() - 4 * 86400000),
    views: 890, likes: 120, comments: 45,
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
  },
  {
    id: makeId(), type: "event", title: "Community Health Walk & Fair",
    description: "Join us for a 5km health walk followed by a health fair with free medical check-ups.",
    status: "pending", venue: "City Park", venueType: "physical",
    eventDate: new Date(Date.now() + 14 * 86400000), capacity: 200, rsvpCount: 0,
    authorName: "Health Committee", authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=HC",
    submittedAt: new Date(Date.now() - 86400000),
    views: 0, likes: 0, comments: 0,
  },
  {
    id: makeId(), type: "event", title: "Christmas Celebration Dinner",
    description: "End-of-year gala dinner and awards night. Dress code: formal/traditional attire.",
    status: "past" as any, venue: "Grand Hotel Ballroom", venueType: "physical",
    eventDate: new Date(Date.now() - 30 * 86400000), capacity: 300, rsvpCount: 285,
    authorName: "Social Committee", authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=SC",
    submittedAt: new Date(Date.now() - 45 * 86400000), publishedAt: new Date(Date.now() - 44 * 86400000),
    views: 420, likes: 78, comments: 34,
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=250&fit=crop",
  },
];

export const mockAdminArticles: AdminContentItem[] = [
  {
    id: makeId(), type: "article", title: "The Importance of Community Savings Schemes",
    description: "An in-depth look at how community savings schemes have transformed lives in our community.",
    content: "Community savings schemes, commonly known as 'esusu' or 'ajo' in many Nigerian cultures, have been a cornerstone of financial empowerment for generations...",
    category: "education", featured: true, status: "published",
    authorName: "Dr. Obiora Mensah", authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=OM",
    submittedAt: new Date(Date.now() - 10 * 86400000), publishedAt: new Date(Date.now() - 9 * 86400000),
    readTime: "5 min", tags: ["finance", "community", "savings"],
    views: 2340, likes: 187, comments: 52,
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
  },
  {
    id: makeId(), type: "article", title: "Preserving Our Cultural Heritage in the Digital Age",
    description: "How our community is using technology to preserve and share cultural traditions.",
    category: "culture", status: "pending",
    authorName: "Adaeze Williams", authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=AW",
    submittedAt: new Date(Date.now() - 2 * 86400000),
    readTime: "7 min", tags: ["culture", "tradition", "digital"],
    views: 0, likes: 0, comments: 0,
  },
];

export const mockAdminVibes: AdminContentItem[] = [
  {
    id: makeId(), type: "vibe", title: "Community Day Highlights 🎉",
    description: "Amazing moments from our Community Day celebration. The energy was incredible!",
    mediaType: "video", duration: "3:45", spotlight: true, status: "published",
    authorName: "Media Team", authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=MT",
    submittedAt: new Date(Date.now() - 5 * 86400000), publishedAt: new Date(Date.now() - 4 * 86400000),
    views: 3200, likes: 241, comments: 67,
    thumbnail: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop",
  },
  {
    id: makeId(), type: "vibe", title: "New Member Welcome Gallery",
    description: "Welcome photos of our newest community members!",
    mediaType: "gallery", spotlight: false, status: "pending",
    authorName: "Membership Coordinator", authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=MC",
    submittedAt: new Date(Date.now() - 86400000),
    views: 0, likes: 0, comments: 0,
  },
  {
    id: makeId(), type: "vibe", title: "Morning Motivation Audio",
    description: "Start your day with wisdom from our elders.",
    mediaType: "audio", duration: "2:15", status: "published",
    authorName: "Wisdom Council", authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=WC",
    submittedAt: new Date(Date.now() - 3 * 86400000), publishedAt: new Date(Date.now() - 3 * 86400000),
    views: 890, likes: 78, comments: 12,
  },
];

export function getPendingApprovals(): AdminContentItem[] {
  return [
    ...mockAdminNews.filter(n => n.status === "pending"),
    ...mockAdminEvents.filter(e => e.status === "pending"),
    ...mockAdminArticles.filter(a => a.status === "pending"),
    ...mockAdminVibes.filter(v => v.status === "pending"),
  ].sort((a, b) => (b.submittedAt?.getTime() ?? 0) - (a.submittedAt?.getTime() ?? 0));
}

export function getContentAdminStats() {
  const all = [...mockAdminNews, ...mockAdminEvents, ...mockAdminArticles, ...mockAdminVibes];
  return {
    totalPending:   all.filter(i => i.status === "pending").length,
    totalPublished: all.filter(i => i.status === "published").length,
    totalDraft:     all.filter(i => i.status === "draft").length,
    totalRejected:  all.filter(i => i.status === "rejected").length,
    totalContent:   all.length,
  };
}
