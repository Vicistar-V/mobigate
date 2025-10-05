export interface Post {
  title: string;
  subtitle?: string;
  author: string;
  authorProfileImage: string;
  userId: string;
  status: "Online" | "Offline";
  views: string;
  comments: string;
  likes: string;
  type: "Video" | "Article" | "Photo" | "Audio";
  imageUrl?: string;
  fee?: string;
}

export const feedPosts: Post[] = [
  {
    title: "SOME SECRET TRUTH ABOUT WOMEN",
    subtitle: "- How Much Do You Know About Your Woman?",
    author: "PETER NKEMJKA (PPEC)",
    authorProfileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    userId: "1",
    status: "Offline",
    views: "6.8k",
    comments: "255",
    likes: "584",
    type: "Video",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80"
  },
  {
    title: "BEAUTIFUL SUNSET PHOTOGRAPHY",
    subtitle: "- Captured at Lekki Beach, Lagos",
    author: "SARAH OKAFOR",
    authorProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    userId: "2",
    status: "Online",
    views: "5.2k",
    comments: "189",
    likes: "923",
    type: "Photo",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
  },
  {
    title: "MOTIVATIONAL PODCAST EPISODE 45",
    subtitle: "- Finding Your Purpose in Life",
    author: "JAMES ADEWALE",
    authorProfileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    userId: "3",
    status: "Online",
    views: "4.1k",
    comments: "67",
    likes: "512",
    type: "Audio",
    imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80"
  },
  {
    title: "I DON'T GET INVOLVED ROMANTICALLY WITH SMALL BOYS",
    subtitle: "- Last Time I Did, It Almost Got Me Washing Dishes For A Thousand Years In Abuja!",
    author: "PETER NKEMJKA (PPEC)",
    authorProfileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    userId: "1",
    status: "Offline",
    views: "8k",
    comments: "875",
    likes: "1.9k",
    type: "Video",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80"
  },
  {
    title: "DELICIOUS NIGERIAN JOLLOF RICE",
    subtitle: "- Step by Step Photo Guide",
    author: "CHEF NGOZI",
    authorProfileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    userId: "8",
    status: "Online",
    views: "11k",
    comments: "456",
    likes: "2.1k",
    type: "Photo",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80"
  },
  {
    title: "THE POWER OF CONSISTENCY IN LIFE",
    subtitle: "- Small Daily Actions Lead to Massive Results",
    author: "SARAH OKAFOR",
    authorProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    userId: "2",
    status: "Online",
    views: "12k",
    comments: "432",
    likes: "2.3k",
    type: "Article",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80"
  },
  {
    title: "RELAXING MEDITATION AUDIO",
    subtitle: "- 30 Minutes of Pure Calm",
    author: "DR. AMINA YUSUF",
    authorProfileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    userId: "6",
    status: "Online",
    views: "6.7k",
    comments: "123",
    likes: "845",
    type: "Audio",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
  },
  {
    title: "BUILDING YOUR PERSONAL BRAND IN 2025",
    subtitle: "- Digital Marketing Strategies That Actually Work",
    author: "JAMES ADEWALE",
    authorProfileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    userId: "3",
    status: "Online",
    views: "9.2k",
    comments: "567",
    likes: "1.8k",
    type: "Video",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
  },
  {
    title: "AFRICAN FASHION PHOTOGRAPHY",
    subtitle: "- Ankara Styles Collection 2025",
    author: "CHIOMA EZE",
    authorProfileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    userId: "4",
    status: "Offline",
    views: "8.5k",
    comments: "298",
    likes: "1.4k",
    type: "Photo",
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80"
  },
  {
    title: "CRYPTOCURRENCY INVESTING FOR BEGINNERS",
    subtitle: "- What You Need to Know Before You Start",
    author: "CHIOMA EZE",
    authorProfileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    userId: "4",
    status: "Offline",
    views: "15k",
    comments: "1.2k",
    likes: "3.4k",
    type: "Article",
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80"
  },
  {
    title: "SUNSET VIEWS FROM MY BALCONY",
    subtitle: "- Nature's Beauty in Lagos",
    author: "AMAKA JANE JOHNSON",
    authorProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    userId: "1",
    status: "Online",
    views: "4.2k",
    comments: "128",
    likes: "892",
    type: "Photo",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
  },
  {
    title: "MY LATEST PODCAST EPISODE",
    subtitle: "- Discussing Women Empowerment in Africa",
    author: "AMAKA JANE JOHNSON",
    authorProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    userId: "1",
    status: "Online",
    views: "3.5k",
    comments: "89",
    likes: "456",
    type: "Audio",
    imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80"
  },
  {
    title: "BEAUTIFUL AFRICAN FASHION COLLECTION",
    subtitle: "- My New Ankara Designs",
    author: "AMAKA JANE JOHNSON",
    authorProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    userId: "1",
    status: "Online",
    views: "9.1k",
    comments: "342",
    likes: "1.5k",
    type: "Photo",
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80"
  },
  {
    title: "MOTIVATIONAL AUDIO MESSAGE",
    subtitle: "- Start Your Day Right with Positive Affirmations",
    author: "AMAKA JANE JOHNSON",
    authorProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    userId: "1",
    status: "Online",
    views: "5.8k",
    comments: "156",
    likes: "734",
    type: "Audio",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
  },
  {
    title: "FOOD PHOTOGRAPHY COLLECTION",
    subtitle: "- Nigerian Delicacies That Will Make You Hungry",
    author: "AMAKA JANE JOHNSON",
    authorProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    userId: "1",
    status: "Online",
    views: "7.3k",
    comments: "289",
    likes: "1.2k",
    type: "Photo",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80"
  },
  {
    title: "HOW TO OVERCOME SELF-DOUBT",
    subtitle: "- A Personal Journey to Self-Confidence",
    author: "AMAKA JANE JOHNSON",
    authorProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    userId: "1",
    status: "Online",
    views: "6.5k",
    comments: "234",
    likes: "987",
    type: "Article",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
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
