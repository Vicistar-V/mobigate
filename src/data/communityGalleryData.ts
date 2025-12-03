export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  description: string;
  mediaType: "photo" | "video";
  mediaUrl: string;
  thumbnailUrl?: string;
  albumId: string;
  
  // Engagement
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isLiked?: boolean;
  isFollowed?: boolean;
  
  // Metadata
  uploadedBy: string;
  uploadedByPhoto: string;
  uploadedAt: Date;
  
  // Admin controls
  isHidden: boolean;
  privacy: "public" | "members-only" | "executives-only";
}

export interface GalleryAlbum {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  itemCount: number;
  privacy: "public" | "members-only" | "executives-only";
  isHidden: boolean;
  createdAt: Date;
  createdBy: string;
}

export interface GalleryManager {
  id: string;
  name: string;
  photo: string;
  role: string;
  assignedDate: Date;
  assignedBy: string;
}

export interface GalleryComment {
  id: string;
  itemId: string;
  authorName: string;
  authorPhoto: string;
  content: string;
  createdAt: Date;
  likes: number;
}

export const privacyOptions = [
  { value: "public", label: "Public", description: "Anyone can view" },
  { value: "members-only", label: "Members Only", description: "Only community members" },
  { value: "executives-only", label: "Executives Only", description: "Only executives can view" }
];

export const mockGalleryAlbums: GalleryAlbum[] = [
  {
    id: "album-1",
    name: "Annual General Meeting 2024",
    description: "Photos and videos from our 2024 Annual General Meeting held at the Community Center",
    coverImage: "/placeholder.svg",
    itemCount: 24,
    privacy: "public",
    isHidden: false,
    createdAt: new Date("2024-11-15"),
    createdBy: "Secretary"
  },
  {
    id: "album-2",
    name: "Cultural Day Celebration",
    description: "Highlights from our vibrant cultural day celebration featuring traditional attires, dances, and cuisine",
    coverImage: "/placeholder.svg",
    itemCount: 45,
    privacy: "public",
    isHidden: false,
    createdAt: new Date("2024-10-20"),
    createdBy: "Secretary"
  },
  {
    id: "album-3",
    name: "Community Outreach Program",
    description: "Our community outreach to local schools and orphanages",
    coverImage: "/placeholder.svg",
    itemCount: 18,
    privacy: "members-only",
    isHidden: false,
    createdAt: new Date("2024-09-10"),
    createdBy: "Secretary"
  },
  {
    id: "album-4",
    name: "Executive Meetings",
    description: "Private documentation of executive committee meetings",
    coverImage: "/placeholder.svg",
    itemCount: 12,
    privacy: "executives-only",
    isHidden: false,
    createdAt: new Date("2024-08-25"),
    createdBy: "Secretary"
  },
  {
    id: "album-5",
    name: "Foundation Day 2024",
    description: "Celebrating our community foundation anniversary",
    coverImage: "/placeholder.svg",
    itemCount: 36,
    privacy: "public",
    isHidden: false,
    createdAt: new Date("2024-07-01"),
    createdBy: "Secretary"
  },
  {
    id: "album-6",
    name: "Sports Day Event",
    description: "Annual sports competition between community zones",
    coverImage: "/placeholder.svg",
    itemCount: 28,
    privacy: "public",
    isHidden: true,
    createdAt: new Date("2024-06-15"),
    createdBy: "Secretary"
  }
];

export const mockGalleryItems: GalleryItem[] = [
  // AGM 2024 Photos
  {
    id: "item-1",
    title: "Opening Ceremony",
    caption: "The President delivering the opening address",
    description: "Our esteemed President, Chief Emeka Okafor, delivering his keynote address at the opening ceremony of the 2024 Annual General Meeting. The event was attended by over 500 members from across the country.",
    mediaType: "photo",
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    albumId: "album-1",
    likes: 234,
    comments: 45,
    shares: 28,
    views: 1250,
    isLiked: false,
    isFollowed: false,
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedByPhoto: "/placeholder.svg",
    uploadedAt: new Date("2024-11-15T10:30:00"),
    isHidden: false,
    privacy: "public"
  },
  {
    id: "item-2",
    title: "Group Photo - Executives",
    caption: "All executive members gathered for official photograph",
    description: "The complete executive committee of the community posing for the official 2024 photograph after the successful conclusion of the AGM.",
    mediaType: "photo",
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    albumId: "album-1",
    likes: 456,
    comments: 67,
    shares: 89,
    views: 2340,
    isLiked: true,
    isFollowed: false,
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedByPhoto: "/placeholder.svg",
    uploadedAt: new Date("2024-11-15T14:20:00"),
    isHidden: false,
    privacy: "public"
  },
  {
    id: "item-3",
    title: "Award Ceremony Highlights",
    caption: "Recognizing outstanding community members",
    description: "Members receiving awards for their exceptional contributions to community development throughout the year.",
    mediaType: "video",
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    albumId: "album-1",
    likes: 189,
    comments: 34,
    shares: 56,
    views: 890,
    isLiked: false,
    isFollowed: true,
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedByPhoto: "/placeholder.svg",
    uploadedAt: new Date("2024-11-15T16:45:00"),
    isHidden: false,
    privacy: "public"
  },
  // Cultural Day Photos
  {
    id: "item-4",
    title: "Traditional Dance Performance",
    caption: "The cultural troupe entertaining guests",
    description: "Our talented cultural troupe performing the traditional Igbo dance, showcasing our rich cultural heritage to the delight of all attendees.",
    mediaType: "video",
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    albumId: "album-2",
    likes: 567,
    comments: 89,
    shares: 123,
    views: 3456,
    isLiked: true,
    isFollowed: false,
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedByPhoto: "/placeholder.svg",
    uploadedAt: new Date("2024-10-20T11:00:00"),
    isHidden: false,
    privacy: "public"
  },
  {
    id: "item-5",
    title: "Traditional Attire Showcase",
    caption: "Members in beautiful traditional outfits",
    description: "A stunning display of traditional attires from different regions, celebrating the diversity within our community.",
    mediaType: "photo",
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    albumId: "album-2",
    likes: 345,
    comments: 56,
    shares: 78,
    views: 1890,
    isLiked: false,
    isFollowed: false,
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedByPhoto: "/placeholder.svg",
    uploadedAt: new Date("2024-10-20T13:30:00"),
    isHidden: false,
    privacy: "public"
  },
  {
    id: "item-6",
    title: "Cultural Cuisine Display",
    caption: "Traditional delicacies from our homeland",
    description: "An array of traditional dishes prepared by community members, featuring local delicacies that brought back memories of home.",
    mediaType: "photo",
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    albumId: "album-2",
    likes: 289,
    comments: 45,
    shares: 34,
    views: 1234,
    isLiked: true,
    isFollowed: true,
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedByPhoto: "/placeholder.svg",
    uploadedAt: new Date("2024-10-20T15:00:00"),
    isHidden: false,
    privacy: "public"
  },
  // Outreach Program
  {
    id: "item-7",
    title: "School Donation Ceremony",
    caption: "Handing over educational materials",
    description: "The community donating books, school supplies, and educational equipment to students at Government Primary School.",
    mediaType: "photo",
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    albumId: "album-3",
    likes: 178,
    comments: 23,
    shares: 45,
    views: 678,
    isLiked: false,
    isFollowed: false,
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedByPhoto: "/placeholder.svg",
    uploadedAt: new Date("2024-09-10T09:00:00"),
    isHidden: false,
    privacy: "members-only"
  },
  {
    id: "item-8",
    title: "Orphanage Visit",
    caption: "Spending time with the children",
    description: "Community members spending quality time with children at Hope Orphanage, bringing gifts, food, and most importantly, love and care.",
    mediaType: "photo",
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    albumId: "album-3",
    likes: 234,
    comments: 56,
    shares: 67,
    views: 890,
    isLiked: true,
    isFollowed: false,
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedByPhoto: "/placeholder.svg",
    uploadedAt: new Date("2024-09-10T14:30:00"),
    isHidden: false,
    privacy: "members-only"
  },
  // Foundation Day
  {
    id: "item-9",
    title: "Anniversary Cake Cutting",
    caption: "Celebrating another milestone",
    description: "The President and founding members cutting the anniversary cake, marking another successful year of our community.",
    mediaType: "photo",
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    albumId: "album-5",
    likes: 456,
    comments: 78,
    shares: 90,
    views: 2345,
    isLiked: false,
    isFollowed: true,
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedByPhoto: "/placeholder.svg",
    uploadedAt: new Date("2024-07-01T12:00:00"),
    isHidden: false,
    privacy: "public"
  },
  {
    id: "item-10",
    title: "Founding Members Recognition",
    caption: "Honoring those who started it all",
    description: "Special recognition ceremony for the founding members of our great community, acknowledging their vision and sacrifice.",
    mediaType: "video",
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    albumId: "album-5",
    likes: 567,
    comments: 123,
    shares: 156,
    views: 4567,
    isLiked: true,
    isFollowed: false,
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedByPhoto: "/placeholder.svg",
    uploadedAt: new Date("2024-07-01T15:30:00"),
    isHidden: false,
    privacy: "public"
  },
  // More items for variety
  {
    id: "item-11",
    title: "Community Prayer Session",
    caption: "Starting the day with prayers",
    description: "The community chaplain leading the opening prayer session at the Foundation Day celebration.",
    mediaType: "photo",
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    albumId: "album-5",
    likes: 198,
    comments: 34,
    shares: 45,
    views: 789,
    isLiked: false,
    isFollowed: false,
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedByPhoto: "/placeholder.svg",
    uploadedAt: new Date("2024-07-01T08:00:00"),
    isHidden: false,
    privacy: "public"
  },
  {
    id: "item-12",
    title: "Children's Corner Fun",
    caption: "The little ones having a great time",
    description: "Children of community members enjoying games and activities at the kids' corner during Foundation Day.",
    mediaType: "photo",
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    albumId: "album-5",
    likes: 345,
    comments: 67,
    shares: 89,
    views: 1567,
    isLiked: true,
    isFollowed: true,
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedByPhoto: "/placeholder.svg",
    uploadedAt: new Date("2024-07-01T10:30:00"),
    isHidden: false,
    privacy: "public"
  },
  {
    id: "item-13",
    title: "Women's Wing Performance",
    caption: "Our women showcasing their talent",
    description: "The Women's Wing presenting a special musical performance at the Cultural Day celebration.",
    mediaType: "video",
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    albumId: "album-2",
    likes: 423,
    comments: 78,
    shares: 56,
    views: 2134,
    isLiked: false,
    isFollowed: false,
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedByPhoto: "/placeholder.svg",
    uploadedAt: new Date("2024-10-20T16:00:00"),
    isHidden: false,
    privacy: "public"
  },
  {
    id: "item-14",
    title: "Youth Forum Discussion",
    caption: "Engaging the next generation",
    description: "Youth members participating in an interactive forum discussing community development and their role in shaping the future.",
    mediaType: "photo",
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    albumId: "album-1",
    likes: 156,
    comments: 34,
    shares: 23,
    views: 567,
    isLiked: true,
    isFollowed: false,
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedByPhoto: "/placeholder.svg",
    uploadedAt: new Date("2024-11-15T11:45:00"),
    isHidden: false,
    privacy: "public"
  },
  {
    id: "item-15",
    title: "Executive Meeting Recording",
    caption: "Strategic planning session",
    description: "Recording of the quarterly executive meeting discussing community projects and financial planning.",
    mediaType: "video",
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    albumId: "album-4",
    likes: 45,
    comments: 12,
    shares: 5,
    views: 234,
    isLiked: false,
    isFollowed: false,
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedByPhoto: "/placeholder.svg",
    uploadedAt: new Date("2024-08-25T14:00:00"),
    isHidden: false,
    privacy: "executives-only"
  }
];

export const mockGalleryManagers: GalleryManager[] = [
  {
    id: "gm-1",
    name: "Barr. Ngozi Okonkwo",
    photo: "/placeholder.svg",
    role: "Secretary-General",
    assignedDate: new Date("2024-01-15"),
    assignedBy: "Community Owner"
  }
];

export const mockGalleryComments: GalleryComment[] = [
  {
    id: "comment-1",
    itemId: "item-1",
    authorName: "Chukwudi Okafor",
    authorPhoto: "/placeholder.svg",
    content: "Such an inspiring moment! Our President always delivers powerful speeches.",
    createdAt: new Date("2024-11-15T12:00:00"),
    likes: 12
  },
  {
    id: "comment-2",
    itemId: "item-1",
    authorName: "Amina Hassan",
    authorPhoto: "/placeholder.svg",
    content: "Proud to be part of this community. Looking forward to more events!",
    createdAt: new Date("2024-11-15T13:30:00"),
    likes: 8
  },
  {
    id: "comment-3",
    itemId: "item-2",
    authorName: "Emeka Nwosu",
    authorPhoto: "/placeholder.svg",
    content: "Great executive team! May God continue to bless our leadership.",
    createdAt: new Date("2024-11-15T15:00:00"),
    likes: 15
  },
  {
    id: "comment-4",
    itemId: "item-4",
    authorName: "Fatima Bello",
    authorPhoto: "/placeholder.svg",
    content: "The dancers were absolutely amazing! Our culture is so rich.",
    createdAt: new Date("2024-10-20T12:30:00"),
    likes: 23
  },
  {
    id: "comment-5",
    itemId: "item-9",
    authorName: "Tunde Adeyemi",
    authorPhoto: "/placeholder.svg",
    content: "Happy anniversary to our beloved community! Many more years of progress.",
    createdAt: new Date("2024-07-01T13:00:00"),
    likes: 34
  }
];
