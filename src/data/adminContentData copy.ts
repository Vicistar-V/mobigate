// Admin Content Moderation Data Types and Mock Data

export type ContentType = 'news' | 'event' | 'article' | 'vibe';
export type ContentStatus = 'draft' | 'pending' | 'approved' | 'published' | 'rejected';

export interface AdminContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  content?: string;
  thumbnail?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  status: ContentStatus;
  category?: string;
  submittedAt?: Date;
  publishedAt?: Date;
  rejectionReason?: string;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  // Event specific fields
  eventDate?: Date;
  eventEndDate?: Date;
  venue?: string;
  venueType?: 'indoor' | 'outdoor' | 'virtual' | 'hybrid';
  rsvpCount?: number;
  capacity?: number;
  // Vibe specific fields
  mediaType?: 'video' | 'photo' | 'audio' | 'gallery';
  duration?: string;
  spotlight?: boolean;
  // Article specific fields
  readTime?: string;
  tags?: string[];
}

export interface ContentApprovalAction {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: ContentType;
  action: 'approve' | 'reject' | 'request_changes';
  performedBy: string;
  performedByAvatar: string;
  reason?: string;
  timestamp: Date;
}

// Mock News Data for Admin
export const mockAdminNews: AdminContentItem[] = [
  {
    id: "news-1",
    type: "news",
    title: "Community Annual General Meeting 2025",
    description: "Join us for our annual general meeting where we'll discuss achievements, plans, and community development initiatives.",
    thumbnail: "/placeholder.svg",
    authorId: "user-1",
    authorName: "Sarah Johnson",
    authorAvatar: "/placeholder.svg",
    status: "published",
    category: "announcements",
    publishedAt: new Date("2025-01-15"),
    views: 1250,
    likes: 234,
    comments: 45,
    featured: true
  },
  {
    id: "news-2",
    type: "news",
    title: "New Community Center Opening Ceremony",
    description: "Celebrate with us as we officially open our new state-of-the-art community center.",
    thumbnail: "/placeholder.svg",
    authorId: "user-2",
    authorName: "Michael Chen",
    authorAvatar: "/placeholder.svg",
    status: "published",
    category: "events",
    publishedAt: new Date("2025-01-20"),
    views: 2100,
    likes: 456,
    comments: 89,
    featured: true
  },
  {
    id: "news-3",
    type: "news",
    title: "Updated Community Guidelines and Policies",
    description: "Please review our updated community guidelines that ensure a safe, respectful environment.",
    thumbnail: "/placeholder.svg",
    authorId: "user-3",
    authorName: "Jennifer Taylor",
    authorAvatar: "/placeholder.svg",
    status: "pending",
    category: "updates",
    submittedAt: new Date("2025-01-18"),
    views: 0,
    likes: 0,
    comments: 0,
    featured: false
  },
  {
    id: "news-4",
    type: "news",
    title: "Youth Sports Tournament Highlights",
    description: "Watch the exciting highlights from last weekend's youth sports tournament.",
    thumbnail: "/placeholder.svg",
    authorId: "user-4",
    authorName: "David Martinez",
    authorAvatar: "/placeholder.svg",
    status: "draft",
    category: "events",
    views: 0,
    likes: 0,
    comments: 0,
    featured: false
  },
  {
    id: "news-5",
    type: "news",
    title: "Emergency Infrastructure Update",
    description: "Important update regarding road repairs and temporary traffic changes in our community.",
    thumbnail: "/placeholder.svg",
    authorId: "user-1",
    authorName: "Sarah Johnson",
    authorAvatar: "/placeholder.svg",
    status: "pending",
    category: "affairs",
    submittedAt: new Date("2025-01-19"),
    views: 0,
    likes: 0,
    comments: 0,
    featured: false
  }
];

// Mock Events Data for Admin
export const mockAdminEvents: AdminContentItem[] = [
  {
    id: "event-1",
    type: "event",
    title: "Annual Community Gala Dinner",
    description: "Join us for an elegant evening of celebration, networking, and community building.",
    thumbnail: "/placeholder.svg",
    authorId: "user-1",
    authorName: "Sarah Johnson",
    authorAvatar: "/placeholder.svg",
    status: "published",
    category: "celebration",
    publishedAt: new Date("2025-01-10"),
    eventDate: new Date("2025-02-15T18:00:00"),
    eventEndDate: new Date("2025-02-15T23:00:00"),
    venue: "Grand Ballroom, Community Center",
    venueType: "indoor",
    rsvpCount: 234,
    capacity: 300,
    views: 3456,
    likes: 678,
    comments: 145,
    featured: true
  },
  {
    id: "event-2",
    type: "event",
    title: "Youth Leadership Workshop Series",
    description: "Empowering the next generation of leaders through interactive workshops.",
    thumbnail: "/placeholder.svg",
    authorId: "user-2",
    authorName: "Michael Chen",
    authorAvatar: "/placeholder.svg",
    status: "published",
    category: "workshop",
    publishedAt: new Date("2025-01-05"),
    eventDate: new Date("2025-02-10T10:00:00"),
    eventEndDate: new Date("2025-02-10T16:00:00"),
    venue: "Training Room B, Community Hub",
    venueType: "indoor",
    rsvpCount: 78,
    capacity: 100,
    views: 2890,
    likes: 456,
    comments: 98,
    featured: true
  },
  {
    id: "event-3",
    type: "event",
    title: "Virtual Town Hall Meeting",
    description: "Monthly community discussion addressing local issues and development projects.",
    thumbnail: "/placeholder.svg",
    authorId: "user-4",
    authorName: "David Martinez",
    authorAvatar: "/placeholder.svg",
    status: "pending",
    category: "meetup",
    submittedAt: new Date("2025-01-17"),
    eventDate: new Date("2025-02-08T19:00:00"),
    eventEndDate: new Date("2025-02-08T21:00:00"),
    venue: "Mobi Meeting",
    venueType: "virtual",
    rsvpCount: 0,
    capacity: 500,
    views: 0,
    likes: 0,
    comments: 0,
    featured: false
  },
  {
    id: "event-4",
    type: "event",
    title: "Family Fun Day at the Park",
    description: "A day of family-friendly activities including games, face painting, and live music.",
    thumbnail: "/placeholder.svg",
    authorId: "user-8",
    authorName: "James Wilson",
    authorAvatar: "/placeholder.svg",
    status: "draft",
    category: "celebration",
    eventDate: new Date("2025-03-10T11:00:00"),
    eventEndDate: new Date("2025-03-10T17:00:00"),
    venue: "Memorial Park",
    venueType: "outdoor",
    rsvpCount: 0,
    capacity: 2000,
    views: 0,
    likes: 0,
    comments: 0,
    featured: false
  }
];

// Mock Articles Data for Admin
export const mockAdminArticles: AdminContentItem[] = [
  {
    id: "article-1",
    type: "article",
    title: "The Future of Community Development in the Digital Age",
    description: "Exploring how technology is reshaping community engagement and governance.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    thumbnail: "/placeholder.svg",
    authorId: "user-1",
    authorName: "Sarah Johnson",
    authorAvatar: "/placeholder.svg",
    status: "published",
    category: "development",
    publishedAt: new Date("2025-01-12"),
    views: 4567,
    likes: 892,
    comments: 134,
    featured: true,
    readTime: "8 min",
    tags: ["technology", "community", "development"]
  },
  {
    id: "article-2",
    type: "article",
    title: "Preserving Our Cultural Heritage: Stories from Elders",
    description: "A collection of oral histories and traditions passed down through generations.",
    content: "Our community's rich cultural heritage...",
    thumbnail: "/placeholder.svg",
    authorId: "user-5",
    authorName: "Lisa Anderson",
    authorAvatar: "/placeholder.svg",
    status: "published",
    category: "culture",
    publishedAt: new Date("2025-01-08"),
    views: 3234,
    likes: 678,
    comments: 89,
    featured: true,
    readTime: "12 min",
    tags: ["culture", "heritage", "history"]
  },
  {
    id: "article-3",
    type: "article",
    title: "Financial Literacy: Building Wealth for Future Generations",
    description: "Expert advice on managing finances and creating generational wealth.",
    content: "Financial literacy is the foundation...",
    thumbnail: "/placeholder.svg",
    authorId: "user-6",
    authorName: "Robert Brown",
    authorAvatar: "/placeholder.svg",
    status: "pending",
    category: "education",
    submittedAt: new Date("2025-01-16"),
    views: 0,
    likes: 0,
    comments: 0,
    featured: false,
    readTime: "10 min",
    tags: ["finance", "education", "wealth"]
  },
  {
    id: "article-4",
    type: "article",
    title: "Opinion: Why Community Unity Matters Now More Than Ever",
    description: "A personal reflection on the importance of togetherness in challenging times.",
    content: "In these unprecedented times...",
    thumbnail: "/placeholder.svg",
    authorId: "user-7",
    authorName: "Emily Davis",
    authorAvatar: "/placeholder.svg",
    status: "pending",
    category: "opinion",
    submittedAt: new Date("2025-01-18"),
    views: 0,
    likes: 0,
    comments: 0,
    featured: false,
    readTime: "5 min",
    tags: ["opinion", "unity", "community"]
  }
];

// Mock Vibes Data for Admin
export const mockAdminVibes: AdminContentItem[] = [
  {
    id: "vibe-1",
    type: "vibe",
    title: "Community Celebration Highlights",
    description: "Capturing the joy and spirit of our annual celebration event.",
    thumbnail: "/placeholder.svg",
    authorId: "user-3",
    authorName: "Jennifer Taylor",
    authorAvatar: "/placeholder.svg",
    status: "published",
    publishedAt: new Date("2025-01-14"),
    views: 5678,
    likes: 1234,
    comments: 256,
    featured: false,
    mediaType: "video",
    duration: "3:45",
    spotlight: true
  },
  {
    id: "vibe-2",
    type: "vibe",
    title: "Behind the Scenes: Community Center Construction",
    description: "A photo gallery documenting the journey of building our new community center.",
    thumbnail: "/placeholder.svg",
    authorId: "user-2",
    authorName: "Michael Chen",
    authorAvatar: "/placeholder.svg",
    status: "published",
    publishedAt: new Date("2025-01-10"),
    views: 3456,
    likes: 789,
    comments: 123,
    featured: false,
    mediaType: "gallery",
    spotlight: false
  },
  {
    id: "vibe-3",
    type: "vibe",
    title: "Elder's Stories: Oral History Recording",
    description: "Audio recordings of community elders sharing their life experiences.",
    thumbnail: "/placeholder.svg",
    authorId: "user-5",
    authorName: "Lisa Anderson",
    authorAvatar: "/placeholder.svg",
    status: "pending",
    submittedAt: new Date("2025-01-17"),
    views: 0,
    likes: 0,
    comments: 0,
    featured: false,
    mediaType: "audio",
    duration: "15:30"
  },
  {
    id: "vibe-4",
    type: "vibe",
    title: "Youth Dance Performance",
    description: "Our talented youth group performing traditional and modern fusion dance.",
    thumbnail: "/placeholder.svg",
    authorId: "user-4",
    authorName: "David Martinez",
    authorAvatar: "/placeholder.svg",
    status: "pending",
    submittedAt: new Date("2025-01-19"),
    views: 0,
    likes: 0,
    comments: 0,
    featured: false,
    mediaType: "video",
    duration: "5:20"
  },
  {
    id: "vibe-5",
    type: "vibe",
    title: "Community Garden Photo Series",
    description: "Beautiful photographs from our community garden project.",
    thumbnail: "/placeholder.svg",
    authorId: "user-7",
    authorName: "Emily Davis",
    authorAvatar: "/placeholder.svg",
    status: "draft",
    views: 0,
    likes: 0,
    comments: 0,
    featured: false,
    mediaType: "photo",
    spotlight: false
  }
];

// Mock Approval History
export const mockApprovalHistory: ContentApprovalAction[] = [
  {
    id: "action-1",
    contentId: "news-1",
    contentTitle: "Community Annual General Meeting 2025",
    contentType: "news",
    action: "approve",
    performedBy: "Admin Smith",
    performedByAvatar: "/placeholder.svg",
    timestamp: new Date("2025-01-14T10:30:00")
  },
  {
    id: "action-2",
    contentId: "event-1",
    contentTitle: "Annual Community Gala Dinner",
    contentType: "event",
    action: "approve",
    performedBy: "Admin Smith",
    performedByAvatar: "/placeholder.svg",
    timestamp: new Date("2025-01-09T14:45:00")
  },
  {
    id: "action-3",
    contentId: "article-rejected-1",
    contentTitle: "Controversial Opinion Piece",
    contentType: "article",
    action: "reject",
    performedBy: "Admin Johnson",
    performedByAvatar: "/placeholder.svg",
    reason: "Content violates community guidelines regarding respectful discourse.",
    timestamp: new Date("2025-01-13T09:15:00")
  },
  {
    id: "action-4",
    contentId: "vibe-1",
    contentTitle: "Community Celebration Highlights",
    contentType: "vibe",
    action: "approve",
    performedBy: "Admin Smith",
    performedByAvatar: "/placeholder.svg",
    timestamp: new Date("2025-01-13T16:20:00")
  },
  {
    id: "action-5",
    contentId: "news-edited-1",
    contentTitle: "Infrastructure Update Draft",
    contentType: "news",
    action: "request_changes",
    performedBy: "Admin Johnson",
    performedByAvatar: "/placeholder.svg",
    reason: "Please add more specific dates and affected areas.",
    timestamp: new Date("2025-01-17T11:00:00")
  }
];

// Get all content combined
export const getAllAdminContent = (): AdminContentItem[] => {
  return [
    ...mockAdminNews,
    ...mockAdminEvents,
    ...mockAdminArticles,
    ...mockAdminVibes
  ];
};

// Get pending approvals
export const getPendingApprovals = (): AdminContentItem[] => {
  return getAllAdminContent().filter(item => item.status === 'pending');
};

// Stats summary for admin dashboard
export const getContentAdminStats = () => {
  const allContent = getAllAdminContent();
  
  return {
    totalNews: mockAdminNews.length,
    publishedNews: mockAdminNews.filter(n => n.status === 'published').length,
    pendingNews: mockAdminNews.filter(n => n.status === 'pending').length,
    draftNews: mockAdminNews.filter(n => n.status === 'draft').length,
    
    totalEvents: mockAdminEvents.length,
    publishedEvents: mockAdminEvents.filter(e => e.status === 'published').length,
    pendingEvents: mockAdminEvents.filter(e => e.status === 'pending').length,
    draftEvents: mockAdminEvents.filter(e => e.status === 'draft').length,
    
    totalArticles: mockAdminArticles.length,
    publishedArticles: mockAdminArticles.filter(a => a.status === 'published').length,
    pendingArticles: mockAdminArticles.filter(a => a.status === 'pending').length,
    featuredArticles: mockAdminArticles.filter(a => a.featured).length,
    
    totalVibes: mockAdminVibes.length,
    publishedVibes: mockAdminVibes.filter(v => v.status === 'published').length,
    spotlightVibes: mockAdminVibes.filter(v => v.spotlight).length,
    
    totalPending: allContent.filter(c => c.status === 'pending').length,
    totalDraft: allContent.filter(c => c.status === 'draft').length,
    totalPublished: allContent.filter(c => c.status === 'published').length
  };
};
