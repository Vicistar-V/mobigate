export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  greeting: string;
  timestamp: string;
  email?: string;
  stats?: {
    friends: number;
    likes: number;
    followers: number;
    following: number;
  };
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  stats: { 
    friends: number; 
    likes: number; 
    followers: number; 
    following: number; 
  };
}

export interface LikeEntry {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  likeCount: number;
  isContentCreator: boolean;
  stats: { 
    friends: number; 
    likes: number; 
    followers: number; 
    following: number; 
  };
}

export interface Follower {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isContentCreator: boolean;
  hasInsufficientFunds?: boolean;
  isFollowingBack?: boolean;
  stats: {
    friends: number;
    likes: number;
    followers: number;
    following: number;
  };
}

export interface Following {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isContentCreator: boolean;
  isFollowing: boolean;
  stats: {
    friends: number;
    likes: number;
    followers: number;
    following: number;
  };
}

export interface ReceivedGift {
  id: string;
  fromUser: string;
  fromUserId: string;
  fromAvatar: string;
  giftType: string;
  giftName: string;
  mobiValue: number;
  message?: string;
  timestamp: string;
  icon?: string;
}

export interface SentGift {
  id: string;
  toUser: string;
  toUserId: string;
  toAvatar: string;
  giftType: string;
  giftName: string;
  mobiValue: number;
  message?: string;
  timestamp: string;
  icon?: string;
}

export interface ProfileData {
  name: string;
  location: string;
  profileImage?: string;
  verified: boolean;
  status: "Online" | "Offline";
  isFriend: boolean;
  stats: {
    friends: string;
    followers: string;
    following: string;
    likes: string;
    gifts: string;
    contents: string;
  };
}

export interface AboutData {
  basicInfo: {
    gender: string;
    birthday: string;
    languages: string;
    birthdayPrivacy: "full" | "partial" | "hidden";
  };
  relationship: {
    status: string;
  };
  about: {
    text: string;
  };
  contact: {
    phone1: string;
    phone2?: string;
    email: string;
  };
  locations: Array<{
    id: string;
    place: string;
    description: string;
    period?: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    faculty?: string;
    department?: string;
    period: string;
    extraSkills?: string;
  }>;
  work: Array<{
    id: string;
    workplaceName: string;
    position: string;
    period: string;
  }>;
  family: Array<{
    id: string;
    name: string;
    relation: string;
  }>;
  schoolMates: Array<any>;
  classmates: Array<any>;
  ageMates: Array<any>;
  workColleagues: Array<any>;
  loveFriendships: Array<any>;
  socialCommunities: Array<any>;
  designations: string;
  refererUrl: {
    url: string;
    refererName: string;
    refererId: string;
  };
  currency: {
    preferredCurrency: string;
    currencySymbol: string;
  };
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
  type: string;
  imageUrl?: string;
  albumId?: string;
  albumName?: string;
}

export interface WindowBridge {
  __USER_PROFILE__?: UserProfile;
  __FRIENDS_LIST__?: Friend[];
  __LIKES_LIST__?: LikeEntry[];
  __FOLLOWERS_LIST__?: Follower[];
  __FOLLOWING_LIST__?: Following[];
  __RECEIVED_GIFTS__?: ReceivedGift[];
  __SENT_GIFTS__?: SentGift[];
  __PROFILE_DATA__?: ProfileData;
  __ABOUT_DATA__?: AboutData;
  __USER_POSTS__?: Post[];
  __PROFILE_IMAGE__?: string;
  __PROFILE_IMAGE_HISTORY__?: string[];
  __BANNER_IMAGE__?: string;
  __BANNER_IMAGE_HISTORY__?: string[];
  __CURRENT_USER_ID__?: string;
}

declare global {
  interface Window extends WindowBridge {}
}

export {};
