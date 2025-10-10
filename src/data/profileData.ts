import profilePhoto from "@/assets/profile-photo.jpg";
import profileSarah from "@/assets/profile-sarah-johnson.jpg";
import profileMichael from "@/assets/profile-michael-chen.jpg";
import profileEmily from "@/assets/profile-emily-davis.jpg";
import profileJames from "@/assets/profile-james-wilson.jpg";
import profileLisa from "@/assets/profile-lisa-anderson.jpg";
import profileDavid from "@/assets/profile-david-martinez.jpg";
import profileJennifer from "@/assets/profile-jennifer-taylor.jpg";
import profileRobert from "@/assets/profile-robert-brown.jpg";

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
}

export interface Gift {
  id: string;
  name: string;
  mobiValue: number;
  icon: string;
}

export interface Follower {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isContentCreator: boolean;
  hasInsufficientFunds?: boolean;
}

export interface Following {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isContentCreator: boolean;
  isFollowing: boolean;
}

// Mock Friends Data
export const mockFriends: Friend[] = [
  {
    id: "1",
    name: "SARAH JOHNSON",
    avatar: profileSarah,
    isOnline: false,
    stats: { friends: 14, likes: 24, followers: 9, following: 8 }
  },
  {
    id: "2",
    name: "MICHAEL CHEN",
    avatar: profileMichael,
    isOnline: true,
    stats: { friends: 32, likes: 45, followers: 28, following: 15 }
  },
  {
    id: "3",
    name: "EMILY DAVIS",
    avatar: profileEmily,
    isOnline: false,
    stats: { friends: 18, likes: 31, followers: 12, following: 20 }
  },
  {
    id: "4",
    name: "JAMES WILSON",
    avatar: profileJames,
    isOnline: true,
    stats: { friends: 25, likes: 40, followers: 22, following: 18 }
  },
  {
    id: "5",
    name: "LISA ANDERSON",
    avatar: profileLisa,
    isOnline: false,
    stats: { friends: 11, likes: 19, followers: 7, following: 13 }
  },
  {
    id: "6",
    name: "DAVID MARTINEZ",
    avatar: profileDavid,
    isOnline: true,
    stats: { friends: 29, likes: 52, followers: 35, following: 24 }
  },
  {
    id: "7",
    name: "JENNIFER TAYLOR",
    avatar: profileJennifer,
    isOnline: false,
    stats: { friends: 16, likes: 28, followers: 14, following: 11 }
  },
  {
    id: "8",
    name: "ROBERT BROWN",
    avatar: profileRobert,
    isOnline: true,
    stats: { friends: 21, likes: 36, followers: 19, following: 16 }
  },
  {
    id: "9",
    name: "AMANDA WHITE",
    avatar: profilePhoto,
    isOnline: false,
    stats: { friends: 13, likes: 22, followers: 10, following: 9 }
  },
  {
    id: "10",
    name: "CHRISTOPHER LEE",
    avatar: profileSarah,
    isOnline: true,
    stats: { friends: 27, likes: 48, followers: 31, following: 21 }
  },
  {
    id: "11",
    name: "PATRICIA GARCIA",
    avatar: profileEmily,
    isOnline: false,
    stats: { friends: 19, likes: 33, followers: 15, following: 17 }
  },
  {
    id: "12",
    name: "MATTHEW RODRIGUEZ",
    avatar: profileMichael,
    isOnline: true,
    stats: { friends: 24, likes: 41, followers: 26, following: 19 }
  },
  {
    id: "13",
    name: "KAREN MARTINEZ",
    avatar: profileLisa,
    isOnline: false,
    stats: { friends: 15, likes: 26, followers: 11, following: 14 }
  },
  {
    id: "14",
    name: "DANIEL HERNANDEZ",
    avatar: profileJames,
    isOnline: true,
    stats: { friends: 30, likes: 55, followers: 38, following: 27 }
  },
  {
    id: "15",
    name: "NANCY LOPEZ",
    avatar: profileJennifer,
    isOnline: false,
    stats: { friends: 17, likes: 30, followers: 13, following: 12 }
  },
  {
    id: "16",
    name: "PAUL GONZALEZ",
    avatar: profileDavid,
    isOnline: true,
    stats: { friends: 22, likes: 39, followers: 20, following: 16 }
  },
  {
    id: "17",
    name: "SANDRA WILSON",
    avatar: profileRobert,
    isOnline: false,
    stats: { friends: 14, likes: 25, followers: 9, following: 10 }
  }
];

// Mock Likes Data
export const mockLikes: LikeEntry[] = [
  {
    id: "1",
    name: "SARAH JOHNSON",
    avatar: profileSarah,
    isOnline: false,
    likeCount: 7,
    isContentCreator: true
  },
  {
    id: "2",
    name: "MICHAEL CHEN",
    avatar: profileMichael,
    isOnline: true,
    likeCount: 1,
    isContentCreator: false
  },
  {
    id: "3",
    name: "EMILY DAVIS",
    avatar: profileEmily,
    isOnline: false,
    likeCount: 3,
    isContentCreator: true
  },
  {
    id: "4",
    name: "JAMES WILSON",
    avatar: profileJames,
    isOnline: true,
    likeCount: 5,
    isContentCreator: false
  },
  {
    id: "5",
    name: "LISA ANDERSON",
    avatar: profileLisa,
    isOnline: false,
    likeCount: 2,
    isContentCreator: true
  },
  {
    id: "6",
    name: "DAVID MARTINEZ",
    avatar: profileDavid,
    isOnline: true,
    likeCount: 9,
    isContentCreator: true
  },
  {
    id: "7",
    name: "JENNIFER TAYLOR",
    avatar: profileJennifer,
    isOnline: false,
    likeCount: 4,
    isContentCreator: false
  },
  {
    id: "8",
    name: "ROBERT BROWN",
    avatar: profileRobert,
    isOnline: true,
    likeCount: 6,
    isContentCreator: true
  },
  {
    id: "9",
    name: "AMANDA WHITE",
    avatar: profilePhoto,
    isOnline: false,
    likeCount: 1,
    isContentCreator: false
  },
  {
    id: "10",
    name: "CHRISTOPHER LEE",
    avatar: profileSarah,
    isOnline: true,
    likeCount: 8,
    isContentCreator: true
  }
];

// Mock Gifts Data
export const mockGifts: Gift[] = [
  { id: "1", name: "Red Rose", mobiValue: 50, icon: "🌹" },
  { id: "2", name: "Diamond Ring", mobiValue: 5000, icon: "💍" },
  { id: "3", name: "Teddy Bear", mobiValue: 100, icon: "🧸" },
  { id: "4", name: "Champagne", mobiValue: 500, icon: "🍾" },
  { id: "5", name: "Golden Crown", mobiValue: 10000, icon: "👑" },
  { id: "6", name: "Chocolate Box", mobiValue: 75, icon: "🍫" },
  { id: "7", name: "Luxury Car", mobiValue: 50000, icon: "🚗" },
  { id: "8", name: "Perfume", mobiValue: 200, icon: "💐" },
  { id: "9", name: "Watch", mobiValue: 2000, icon: "⌚" },
  { id: "10", name: "Heart Balloon", mobiValue: 25, icon: "💝" }
];

export interface ReceivedGift {
  giftId: string;
  giftName: string;
  icon: string;
  mobiValue: number;
  fromUserId: string;
  fromUserName: string;
  date: string;
}

export const mockReceivedGifts: ReceivedGift[] = [
  {
    giftId: "1",
    giftName: "Red Rose",
    icon: "🌹",
    mobiValue: 50,
    fromUserId: "1",
    fromUserName: "SARAH JOHNSON",
    date: "2025-10-08"
  },
  {
    giftId: "2",
    giftName: "Diamond Ring",
    icon: "💍",
    mobiValue: 5000,
    fromUserId: "2",
    fromUserName: "MICHAEL CHEN",
    date: "2025-10-07"
  },
  {
    giftId: "4",
    giftName: "Champagne",
    icon: "🍾",
    mobiValue: 500,
    fromUserId: "3",
    fromUserName: "EMILY DAVIS",
    date: "2025-10-06"
  },
  {
    giftId: "10",
    giftName: "Heart Balloon",
    icon: "💝",
    mobiValue: 25,
    fromUserId: "4",
    fromUserName: "JAMES WILSON",
    date: "2025-10-05"
  }
];

// Mock Followers Data
export const mockFollowers: Follower[] = [
  {
    id: "1",
    name: "SARAH JOHNSON",
    avatar: profileSarah,
    isOnline: false,
    isContentCreator: true,
    hasInsufficientFunds: false
  },
  {
    id: "2",
    name: "MICHAEL CHEN",
    avatar: profileMichael,
    isOnline: true,
    isContentCreator: false,
    hasInsufficientFunds: true
  },
  {
    id: "3",
    name: "EMILY DAVIS",
    avatar: profileEmily,
    isOnline: false,
    isContentCreator: true,
    hasInsufficientFunds: false
  },
  {
    id: "4",
    name: "JAMES WILSON",
    avatar: profileJames,
    isOnline: true,
    isContentCreator: false,
    hasInsufficientFunds: false
  },
  {
    id: "5",
    name: "LISA ANDERSON",
    avatar: profileLisa,
    isOnline: false,
    isContentCreator: true,
    hasInsufficientFunds: true
  },
  {
    id: "6",
    name: "DAVID MARTINEZ",
    avatar: profileDavid,
    isOnline: true,
    isContentCreator: true,
    hasInsufficientFunds: false
  },
  {
    id: "7",
    name: "JENNIFER TAYLOR",
    avatar: profileJennifer,
    isOnline: false,
    isContentCreator: false,
    hasInsufficientFunds: false
  }
];

// Mock Following Data
export const mockFollowing: Following[] = [
  {
    id: "1",
    name: "SARAH JOHNSON",
    avatar: profileSarah,
    isOnline: false,
    isContentCreator: true,
    isFollowing: true
  },
  {
    id: "2",
    name: "MICHAEL CHEN",
    avatar: profileMichael,
    isOnline: true,
    isContentCreator: false,
    isFollowing: true
  },
  {
    id: "3",
    name: "EMILY DAVIS",
    avatar: profileEmily,
    isOnline: false,
    isContentCreator: true,
    isFollowing: true
  },
  {
    id: "4",
    name: "JAMES WILSON",
    avatar: profileJames,
    isOnline: true,
    isContentCreator: false,
    isFollowing: true
  },
  {
    id: "5",
    name: "LISA ANDERSON",
    avatar: profileLisa,
    isOnline: false,
    isContentCreator: true,
    isFollowing: true
  },
  {
    id: "6",
    name: "DAVID MARTINEZ",
    avatar: profileDavid,
    isOnline: true,
    isContentCreator: true,
    isFollowing: true
  },
  {
    id: "7",
    name: "JENNIFER TAYLOR",
    avatar: profileJennifer,
    isOnline: false,
    isContentCreator: false,
    isFollowing: true
  },
  {
    id: "8",
    name: "ROBERT BROWN",
    avatar: profileRobert,
    isOnline: true,
    isContentCreator: true,
    isFollowing: true
  },
  {
    id: "9",
    name: "AMANDA WHITE",
    avatar: profilePhoto,
    isOnline: false,
    isContentCreator: false,
    isFollowing: true
  },
  {
    id: "10",
    name: "CHRISTOPHER LEE",
    avatar: profileSarah,
    isOnline: true,
    isContentCreator: true,
    isFollowing: true
  },
  {
    id: "11",
    name: "PATRICIA GARCIA",
    avatar: profileEmily,
    isOnline: false,
    isContentCreator: false,
    isFollowing: true
  },
  {
    id: "12",
    name: "MATTHEW RODRIGUEZ",
    avatar: profileMichael,
    isOnline: true,
    isContentCreator: true,
    isFollowing: true
  },
  {
    id: "13",
    name: "KAREN MARTINEZ",
    avatar: profileLisa,
    isOnline: false,
    isContentCreator: false,
    isFollowing: true
  },
  {
    id: "14",
    name: "DANIEL HERNANDEZ",
    avatar: profileJames,
    isOnline: true,
    isContentCreator: true,
    isFollowing: true
  },
  {
    id: "15",
    name: "NANCY LOPEZ",
    avatar: profileJennifer,
    isOnline: false,
    isContentCreator: true,
    isFollowing: true
  },
  {
    id: "16",
    name: "PAUL GONZALEZ",
    avatar: profileDavid,
    isOnline: true,
    isContentCreator: false,
    isFollowing: true
  },
  {
    id: "17",
    name: "SANDRA WILSON",
    avatar: profileRobert,
    isOnline: false,
    isContentCreator: true,
    isFollowing: true
  },
  {
    id: "18",
    name: "KENNETH MOORE",
    avatar: profileMichael,
    isOnline: true,
    isContentCreator: false,
    isFollowing: true
  }
];
