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

export interface WindowBridge {
  __USER_PROFILE__?: UserProfile;
  __FRIENDS_LIST__?: Array<{
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
  }>;
  __LIKES_LIST__?: Array<{
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
  }>;
}

declare global {
  interface Window extends WindowBridge {}
}

export {};
