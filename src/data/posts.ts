export interface Album {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  itemCount: number;
  privacy?: "Public" | "Friends" | "Private";
  createdAt: string;
}

export interface Post {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  author: string;
  authorProfileImage: string;
  userId: string;
  status: "Online" | "Offline";
  views: string;
  comments: string;
  likes: string;
  followers?: string;
  type: "Video" | "Article" | "Photo" | "Audio" | "PDF" | "URL";
  imageUrl?: string;
  fee?: string;
  isOwner?: boolean;
  albumId?: string;
  albumName?: string;
  /** Show the "✓Copyright" designation marker on this post's media (default true) */
  copyrightMarked?: boolean;
  /** Whether copyright documents were submitted to Mobigate for this post */
  hasCopyrightDocs?: boolean;
}

export const mockAlbums: Album[] = [
  {
    id: "alb_1",
    name: "Travel Adventures",
    description: "Photos and videos from my travels around the world",
    coverImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
    itemCount: 45,
    privacy: "Public",
    createdAt: "2024-01-15",
  },
  {
    id: "alb_2",
    name: "Family Moments",
    description: "Precious memories with loved ones",
    coverImage: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80",
    itemCount: 123,
    privacy: "Friends",
    createdAt: "2024-02-20",
  },

];

export const feedPosts: Post[] = [
  {
    id: "post_1",
    title: "SOME SECRET TRUTH ABOUT WOMEN",
    subtitle: "- How Much Do You Know About Your Woman?",
    author: "PETER NKEMJKA IPREC",
    authorProfileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    userId: "1",
    status: "Offline",
    views: "6.8k",
    comments: "255",
    likes: "584",
    followers: "5.2K",
    type: "Video",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
    isOwner: true,
    albumId: "alb_2",
    albumName: "Family Moments"
  },
  {
    id: "post_2",
    title: "BEAUTIFUL SUNSET PHOTOGRAPHY",
    subtitle: "- Captured at Lekki Beach, Lagos",
    author: "SARAH OKAFOR",
    authorProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    userId: "2",
    status: "Online",
    views: "5.2k",
    comments: "189",
    likes: "923",
    followers: "8.9K",
    type: "Photo",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    albumId: "alb_1",
    albumName: "Travel Adventures"
  },
  {
    id: "post_3",
    title: "MOTIVATIONAL PODCAST EPISODE 45",
    subtitle: "- Finding Your Purpose in Life",
    author: "JAMES ADEWALE",
    authorProfileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    userId: "3",
    status: "Online",
    views: "4.1k",
    comments: "67",
    likes: "512",
    followers: "12K",
    type: "Audio",
    imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80"
  },
  {
    id: "post_4",
    title: "I DON'T GET INVOLVED ROMANTICALLY WITH SMALL BOYS",
    subtitle: "- Last Time I Did, It Almost Got Me Washing Dishes For A Thousand Years In Abuja!",
    author: "PETER NKEMJKA IPREC",
    authorProfileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    userId: "1",
    status: "Offline",
    views: "8k",
    comments: "875",
    likes: "1.9k",
    followers: "5.2K",
    type: "Video",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
    isOwner: true,
    albumId: "alb_2",
    albumName: "Family Moments"
  },
  {
    id: "post_5",
    title: "DELICIOUS NIGERIAN JOLLOF RICE",
    subtitle: "- Step by Step Photo Guide",
    author: "CHEF NGOZI",
    authorProfileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    userId: "8",
    status: "Online",
    views: "11k",
    comments: "456",
    likes: "2.1k",
    followers: "3.4K",
    type: "Photo",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    albumId: "alb_4",
    albumName: "Food & Recipes"
  },
  {
    id: "post_6",
    title: "THE POWER OF CONSISTENCY IN LIFE",
    subtitle: "- Small Daily Actions Lead to Massive Results",
    author: "SARAH OKAFOR",
    authorProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    userId: "2",
    status: "Online",
    views: "12k",
    comments: "432",
    likes: "2.3k",
    followers: "8.9K",
    type: "Article",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80"
  },
  {
    id: "post_7",
    title: "RELAXING MEDITATION AUDIO",
    subtitle: "- 30 Minutes of Pure Calm",
    author: "DR. AMINA YUSUF",
    authorProfileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    userId: "6",
    status: "Online",
    views: "6.7k",
    comments: "123",
    likes: "845",
    followers: "2.7K",
    type: "Audio",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
  },
  {
    id: "post_8",
    title: "BUILDING YOUR PERSONAL BRAND IN 2025",
    subtitle: "- Digital Marketing Strategies That Actually Work",
    author: "JAMES ADEWALE",
    authorProfileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    userId: "3",
    status: "Online",
    views: "9.2k",
    comments: "567",
    likes: "1.8k",
    followers: "12K",
    type: "Video",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    albumId: "alb_3",
    albumName: "Work Projects"
  },
  {
    id: "post_9",
    title: "AFRICAN FASHION PHOTOGRAPHY",
    subtitle: "- Ankara Styles Collection 2025",
    author: "CHIOMA EZE",
    authorProfileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    userId: "4",
    status: "Offline",
    views: "8.5k",
    comments: "298",
    likes: "1.4k",
    followers: "4.6K",
    type: "Photo",
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
    albumId: "alb_8",
    albumName: "Art & Creativity"
  },
 
  {
    title: "BEST ONLINE RESOURCES FOR DESIGNERS",
    subtitle: "- Curated List of Design Tools and Websites",
    author: "SARAH OKAFOR",
    authorProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    userId: "2",
    status: "Online",
    views: "9.8k",
    comments: "456",
    likes: "2.3k",
    type: "URL",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"
  },
  {
    title: "TOP 10 PRODUCTIVITY APPS FOR 2025",
    subtitle: "- Links to Life-Changing Applications",
    author: "JAMES ADEWALE",
    authorProfileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    userId: "3",
    status: "Online",
    views: "14k",
    comments: "678",
    likes: "3.1k",
    type: "URL",
    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80"
  },
  {
    title: "NIGERIAN HISTORY DOCUMENTARY",
    subtitle: "- From Independence to Modern Day",
    author: "DR. AMINA YUSUF",
    authorProfileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    userId: "6",
    status: "Online",
    views: "16k",
    comments: "945",
    likes: "3.8k",
    type: "Video",
    imageUrl: "https://images.unsplash.com/photo-1551871812-10ecc21ffa2f?w=800&q=80"
  },
  {
    title: "AFROBEAT MUSIC PRODUCTION TUTORIAL",
    subtitle: "- Create Beats Like the Pros",
    author: "PETER NKEMJKA IPREC",
    authorProfileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    userId: "1",
    status: "Offline",
    views: "11k",
    comments: "534",
    likes: "2.7k",
    type: "Video",
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    isOwner: true
  },
  {
    title: "WILDLIFE PHOTOGRAPHY IN AFRICA",
    subtitle: "- Captured in Serengeti National Park",
    author: "CHIOMA EZE",
    authorProfileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    userId: "4",
    status: "Online",
    views: "13k",
    comments: "876",
    likes: "4.1k",
    type: "Photo",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    albumId: "alb_5",
    albumName: "Nature & Wildlife"
  },
  {
    title: "URBAN ARCHITECTURE PHOTOGRAPHY",
    subtitle: "- Modern Buildings in Lagos and Abuja",
    author: "SARAH OKAFOR",
    authorProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    userId: "2",
    status: "Online",
    views: "10k",
    comments: "423",
    likes: "2.5k",
    type: "Photo",
    imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80",
    albumId: "alb_3",
    albumName: "Work Projects"
  },
  
  {
    title: "FITNESS TRANSFORMATION JOURNEY",
    subtitle: "- 90 Day Challenge Video Series",
    author: "CHIOMA EZE",
    authorProfileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    userId: "4",
    status: "Online",
    views: "15k",
    comments: "1.2k",
    likes: "4.7k",
    type: "Video",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    albumId: "alb_7",
    albumName: "Fitness Journey"
  },
  
  {
    title: "ENTREPRENEURSHIP IN AFRICA",
    subtitle: "- Success Stories and Lessons Learned",
    author: "TUNDE BAKARE",
    authorProfileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    userId: "9",
    status: "Online",
    views: "16k",
    comments: "1.4k",
    likes: "5.3k",
    type: "Article",
    imageUrl: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&q=80"
  },
  {
    title: "CLIMATE CHANGE AND AFRICA",
    subtitle: "- Understanding the Impact and Solutions",
    author: "DR. AMINA YUSUF",
    authorProfileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    userId: "6",
    status: "Online",
    views: "10k",
    comments: "734",
    likes: "3.1k",
    type: "Article",
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de4798aa62b0?w=800&q=80"
  },
  {
    title: "SLEEP SOUNDS AND RELAXATION",
    subtitle: "- Natural Sounds for Better Sleep",
    author: "DR. AMINA YUSUF",
    authorProfileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    userId: "6",
    status: "Online",
    views: "8.7k",
    comments: "345",
    likes: "2.4k",
    type: "Audio",
    imageUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80"
  },
  
  {
    title: "GRAPHIC DESIGN FUNDAMENTALS",
    subtitle: "- Free PDF Course for Beginners",
    author: "CHIOMA EZE",
    authorProfileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    userId: "4",
    status: "Online",
    views: "18k",
    comments: "1.5k",
    likes: "5.9k",
    type: "PDF",
    imageUrl: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&q=80"
  },
 
  {
    title: "AFRICAN ART PHOTOGRAPHY",
    subtitle: "- Traditional Sculptures and Crafts",
    author: "AMAKA JANE JOHNSON",
    authorProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    userId: "1",
    status: "Online",
    views: "8.9k",
    comments: "432",
    likes: "1.9k",
    type: "Photo",
    imageUrl: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800&q=80",
    albumId: "alb_8",
    albumName: "Art & Creativity"
  },
 
  {
    title: "AFRICAN FASHION WEEK HIGHLIGHTS",
    subtitle: "- Best Runway Moments 2025",
    author: "CHIOMA EZE",
    authorProfileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    userId: "4",
    status: "Online",
    views: "22k",
    comments: "1.7k",
    likes: "7.8k",
    type: "Photo",
    imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea8f5025?w=800&q=80"
  },
 
];

// Mock wall status posts with more visual content
export interface WallStatusPost {
  id: string;
  url: string;
  type: "photo" | "video";
  title?: string;
  author: string;
  authorImage: string;
  timestamp: string;
  description?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  followers?: string;
  userId?: string;
  status?: "Online" | "Offline";
  views?: string;
  fee?: string;
}

export const wallStatusPosts: WallStatusPost[] = [
  {
    id: "wall_1",
    url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&q=80",
    type: "photo",
    title: "Golden Hour Serenity",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "2 hours ago",
    description: "Captured this beautiful moment during sunset. Nature never fails to amaze! 🌅",
    likes: 1248,
    comments: 89,
    isLiked: false,
    followers: "15.2K",
    userId: "1",
    status: "Online",
    views: "25.4K"
  },
  {
    id: "wall_2",
    url: "https://images.unsplash.com/photo-1682687221038-404cb8830901?w=1200&q=80",
    type: "photo",
    title: "Urban Exploration",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "5 hours ago",
    description: "Exploring the city's hidden gems. Every corner tells a story.",
    likes: 892,
    comments: 56,
    isLiked: true,
    followers: "15.2K",
    userId: "1",
    status: "Online",
    views: "18.9K"
  },
  {
    id: "wall_3",
    url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=1200&q=80",
    type: "photo",
    title: "Morning Coffee Vibes",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "1 day ago",
    description: "Starting the day right ☕️✨",
    likes: 2156,
    comments: 143,
    isLiked: true,
    followers: "15.2K",
    userId: "1",
    status: "Online",
    views: "42.1K"
  },
  {
    id: "wall_4",
    url: "https://images.unsplash.com/photo-1682687220499-d9c06b872eee?w=1200&q=80",
    type: "photo",
    title: "Nature's Canvas",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "2 days ago",
    description: "When nature paints the perfect picture 🎨🌿",
    likes: 1567,
    comments: 98,
    isLiked: false,
    followers: "15.2K",
    userId: "1",
    status: "Offline",
    views: "31.5K"
  },
  {
    id: "wall_5",
    url: "https://images.unsplash.com/photo-1682687220923-c58b9a4592ae?w=1200&q=80",
    type: "photo",
    title: "Weekend Adventures",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "3 days ago",
    description: "Making memories that last forever! 📸",
    likes: 3421,
    comments: 234,
    isLiked: true,
    followers: "15.2K",
    userId: "1",
    status: "Online",
    views: "67.8K"
  },
  {
    id: "wall_6",
    url: "https://images.unsplash.com/photo-1682687221080-5cb261c645cb?w=1200&q=80",
    type: "photo",
    title: "Reflections",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "4 days ago",
    description: "Sometimes you need to pause and reflect 💭",
    likes: 987,
    comments: 67,
    isLiked: false
  },
  
];

// Mock profile picture history
export const mockProfilePictures = [
  {
    id: "profile_1",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
    type: "photo" as const,
    title: "Current Profile Picture",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "Current",
    description: "My latest profile picture",
    likes: 2345,
    comments: 187,
    isLiked: true
  },
  {
    id: "profile_2",
    url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
    type: "photo" as const,
    title: "Previous Profile Picture",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "1 month ago",
    description: "Professional headshot",
    likes: 1876,
    comments: 143,
    isLiked: false
  },
  {
    id: "profile_3",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    type: "photo" as const,
    title: "Summer Vibes",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "2 months ago",
    description: "Summer memories",
    likes: 2987,
    comments: 234,
    isLiked: true
  },
  {
    id: "profile_4",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
    type: "photo" as const,
    title: "Casual Look",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "3 months ago",
    description: "Weekend vibes",
    likes: 2156,
    comments: 167,
    isLiked: false
  },
  {
    id: "profile_5",
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
    type: "photo" as const,
    title: "Elegant Style",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "4 months ago",
    description: "Dressed to impress",
    likes: 3421,
    comments: 298,
    isLiked: true
  },
  {
    id: "profile_6",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
    type: "photo" as const,
    title: "Natural Beauty",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "5 months ago",
    description: "Au naturel",
    likes: 2789,
    comments: 209,
    isLiked: false
  },
  {
    id: "profile_7",
    url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
    type: "photo" as const,
    title: "Outdoor Portrait",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "6 months ago",
    description: "Nature and me",
    likes: 3156,
    comments: 245,
    isLiked: true
  },
 
];

// Mock banner history
export const mockBannerImages = [
  {
    id: "banner_1",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
    type: "photo" as const,
    title: "Current Banner",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "Current",
    description: "Sunset over mountains - my current vibe",
    likes: 4567,
    comments: 312,
    isLiked: true
  },
  {
    id: "banner_2",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80",
    type: "photo" as const,
    title: "Nature Escape",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "1 month ago",
    description: "Forest retreat",
    likes: 3789,
    comments: 256,
    isLiked: false
  },
  {
    id: "banner_3",
    url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1600&q=80",
    type: "photo" as const,
    title: "Ocean Blues",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "2 months ago",
    description: "Peaceful ocean waves",
    likes: 5234,
    comments: 398,
    isLiked: true
  },
  {
    id: "banner_4",
    url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1600&q=80",
    type: "photo" as const,
    title: "Mountain Peaks",
    author: "AMAKA JANE JOHNSON",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    timestamp: "3 months ago",
    description: "Reaching new heights",
    likes: 4123,
    comments: 287,
    isLiked: false
  },
 
];

// Helper function to get posts by user ID
export const getPostsByUserId = (userId: string): Post[] => {
  return feedPosts.filter(post => post.userId === userId);
};

// Helper function to get posts by content type
export const getPostsByType = (type: Post["type"]): Post[] => {
  return feedPosts.filter(post => post.type === type);
};
