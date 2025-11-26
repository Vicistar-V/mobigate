import { CommunityProfile } from "@/types/community";
import { Post } from "@/data/posts";

// Mock community profile data
export const mockCommunityProfile: CommunityProfile = {
  id: "1",
  name: "Onitsha Town Union",
  description: "Progressive community organization bringing together indigenes and residents of Onitsha for development and cultural preservation.",
  motto: "Our people, our strength",
  coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
  logoImage: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80",
  type: "Town Union",
  memberCount: 2847,
  followers: 586,
  likes: 8500,
  createdAt: new Date("2015-03-10"),
  isOwner: false,
  isMember: true,
  role: "Member",
  status: "Active",
  location: "Onitsha, Anambra State, Nigeria",
  fundRaiserEnabled: true,
  mobiStoreEnabled: true,
  quizGameEnabled: true,
  donationEnabled: true,
  visionStatement: "To unite all sons and daughters of Onitsha in fostering development, preserving our rich cultural heritage, and ensuring the progress of our community for generations to come.",
  originCountry: "Nigeria",
  originState: "Anambra State",
  originCity: "Onitsha",
  officeAddress: "No. 45 New Market Road, Onitsha, Anambra State",
  telephone: "+234-806-123-4567",
  emailAddress: "info@onitshaunion.org",
  defaultCurrency: "NGN",
};

// Mock community posts
export const mockCommunityPosts: Post[] = [
  {
    id: "community-post-1",
    title: "Annual Cultural Festival Announcement",
    description: "Join us for our Annual Cultural Festival! Experience the rich heritage of Onitsha through music, dance, and traditional cuisine.",
    author: "Onitsha Town Union",
    authorProfileImage: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80",
    userId: "community-1",
    status: "Online",
    views: "1.2k",
    likes: "245",
    comments: "48",
    type: "Photo",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
  },
  {
    id: "community-post-2",
    title: "Community Health Center Completed",
    description: "We are proud to announce the completion of our Community Health Center! Thanks to all members who contributed to making this dream a reality.",
    author: "Onitsha Town Union",
    authorProfileImage: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80",
    userId: "community-1",
    status: "Online",
    views: "2.5k",
    likes: "412",
    comments: "87",
    type: "Photo",
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
  },
  {
    id: "community-post-3",
    title: "Monthly Meeting Reminder",
    description: "Monthly meeting reminder: This Saturday at 3 PM. Agenda includes discussion on upcoming projects and financial reports.",
    author: "Onitsha Town Union",
    authorProfileImage: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80",
    userId: "community-1",
    status: "Online",
    views: "856",
    likes: "134",
    comments: "21",
    type: "Article",
  },
];

// Get community by ID
export const getCommunityById = (id: string): CommunityProfile | undefined => {
  if (id === "1") return mockCommunityProfile;
  return undefined;
};

// Get posts for a specific community
export const getCommunityPosts = (communityId: string): Post[] => {
  if (communityId === "1") return mockCommunityPosts;
  return [];
};
