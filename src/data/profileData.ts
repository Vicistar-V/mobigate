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
  stats: {
    friends: number;
    likes: number;
    followers: number;
    following: number;
  };
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
    isContentCreator: true,
    stats: { friends: 14, likes: 24, followers: 9, following: 8 }
  },
  {
    id: "2",
    name: "MICHAEL CHEN",
    avatar: profileMichael,
    isOnline: true,
    likeCount: 1,
    isContentCreator: false,
    stats: { friends: 32, likes: 45, followers: 28, following: 15 }
  },
  {
    id: "3",
    name: "EMILY DAVIS",
    avatar: profileEmily,
    isOnline: false,
    likeCount: 3,
    isContentCreator: true,
    stats: { friends: 18, likes: 31, followers: 12, following: 20 }
  },
  {
    id: "4",
    name: "JAMES WILSON",
    avatar: profileJames,
    isOnline: true,
    likeCount: 5,
    isContentCreator: false,
    stats: { friends: 25, likes: 40, followers: 22, following: 18 }
  },
  {
    id: "5",
    name: "LISA ANDERSON",
    avatar: profileLisa,
    isOnline: false,
    likeCount: 2,
    isContentCreator: true,
    stats: { friends: 11, likes: 19, followers: 7, following: 13 }
  },
  {
    id: "6",
    name: "DAVID MARTINEZ",
    avatar: profileDavid,
    isOnline: true,
    likeCount: 9,
    isContentCreator: true,
    stats: { friends: 29, likes: 52, followers: 35, following: 24 }
  },
  {
    id: "7",
    name: "JENNIFER TAYLOR",
    avatar: profileJennifer,
    isOnline: false,
    likeCount: 4,
    isContentCreator: false,
    stats: { friends: 16, likes: 28, followers: 14, following: 11 }
  },
  {
    id: "8",
    name: "ROBERT BROWN",
    avatar: profileRobert,
    isOnline: true,
    likeCount: 6,
    isContentCreator: true,
    stats: { friends: 21, likes: 36, followers: 19, following: 16 }
  },
  {
    id: "9",
    name: "AMANDA WHITE",
    avatar: profilePhoto,
    isOnline: false,
    likeCount: 1,
    isContentCreator: false,
    stats: { friends: 13, likes: 22, followers: 10, following: 9 }
  },
  {
    id: "10",
    name: "CHRISTOPHER LEE",
    avatar: profileSarah,
    isOnline: true,
    likeCount: 8,
    isContentCreator: true,
    stats: { friends: 27, likes: 48, followers: 31, following: 21 }
  }
];

// Special Digital Gifts (Occasion-based with folder structure)
export interface SpecialDigitalGiftValue {
  id: string;
  mobiValue: number;
}

export interface SpecialDigitalGiftFolder {
  id: string;
  name: string;
  icon: string;
  gifts: SpecialDigitalGiftValue[];
}

export const specialDigitalGiftFolders: SpecialDigitalGiftFolder[] = [
  {
    id: "sympathy",
    name: "Sympathy Gifts",
    icon: "🌷",
    gifts: [
      { id: "sympathy-1000", mobiValue: 1000 },
      { id: "sympathy-2000", mobiValue: 2000 },
      { id: "sympathy-3000", mobiValue: 3000 },
      { id: "sympathy-4000", mobiValue: 4000 },
      { id: "sympathy-5000", mobiValue: 5000 },
      { id: "sympathy-10000", mobiValue: 10000 },
      { id: "sympathy-15000", mobiValue: 15000 },
      { id: "sympathy-20000", mobiValue: 20000 },
      { id: "sympathy-25000", mobiValue: 25000 },
      { id: "sympathy-30000", mobiValue: 30000 },
      { id: "sympathy-35000", mobiValue: 35000 },
      { id: "sympathy-40000", mobiValue: 40000 },
      { id: "sympathy-45000", mobiValue: 45000 },
      { id: "sympathy-50000", mobiValue: 50000 },
      { id: "sympathy-55000", mobiValue: 55000 },
      { id: "sympathy-60000", mobiValue: 60000 },
      { id: "sympathy-70000", mobiValue: 70000 },
      { id: "sympathy-75000", mobiValue: 75000 },
      { id: "sympathy-80000", mobiValue: 80000 },
      { id: "sympathy-85000", mobiValue: 85000 },
      { id: "sympathy-90000", mobiValue: 90000 },
      { id: "sympathy-95000", mobiValue: 95000 },
      { id: "sympathy-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "i-like-you",
    name: "I Like You Gifts",
    icon: "😊",
    gifts: [
      { id: "i-like-you-1000", mobiValue: 1000 },
    ]
  },
  {
    id: "i-support-you",
    name: "I Support You Gifts",
    icon: "🤝",
    gifts: [
      { id: "i-support-you-6000", mobiValue: 6000 },
    ]
  },
  {
    id: "greetings",
    name: "Greetings Gifts",
    icon: "👋",
    gifts: [
      { id: "greetings-50", mobiValue: 50 },
    ]
  },
  {
    id: "appreciation",
    name: "Appreciation Gifts",
    icon: "🙏",
    gifts: [
      { id: "appreciation-1000", mobiValue: 1000 },
      { id: "appreciation-2000", mobiValue: 2000 },
      { id: "appreciation-3000", mobiValue: 3000 },
      { id: "appreciation-4000", mobiValue: 4000 },
      { id: "appreciation-5000", mobiValue: 5000 },
      { id: "appreciation-10000", mobiValue: 10000 },
      { id: "appreciation-20000", mobiValue: 20000 },
      { id: "appreciation-30000", mobiValue: 30000 },
      { id: "appreciation-40000", mobiValue: 40000 },
      { id: "appreciation-50000", mobiValue: 50000 },
      { id: "appreciation-75000", mobiValue: 75000 },
      { id: "appreciation-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "admiration",
    name: "Admiration Gifts",
    icon: "😍",
    gifts: [
      { id: "admiration-1000", mobiValue: 1000 },
      { id: "admiration-2000", mobiValue: 2000 },
      { id: "admiration-3000", mobiValue: 3000 },
      { id: "admiration-4000", mobiValue: 4000 },
      { id: "admiration-5000", mobiValue: 5000 },
      { id: "admiration-7500", mobiValue: 7500 },
      { id: "admiration-10000", mobiValue: 10000 },
      { id: "admiration-20000", mobiValue: 20000 },
      { id: "admiration-30000", mobiValue: 30000 },
      { id: "admiration-40000", mobiValue: 40000 },
      { id: "admiration-50000", mobiValue: 50000 },
      { id: "admiration-75000", mobiValue: 75000 },
      { id: "admiration-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "achievements",
    name: "Achievements Gifts",
    icon: "🏆",
    gifts: [
      { id: "achievements-1000", mobiValue: 1000 },
      { id: "achievements-2000", mobiValue: 2000 },
      { id: "achievements-3000", mobiValue: 3000 },
      { id: "achievements-4000", mobiValue: 4000 },
      { id: "achievements-5000", mobiValue: 5000 },
      { id: "achievements-7500", mobiValue: 7500 },
      { id: "achievements-10000", mobiValue: 10000 },
      { id: "achievements-20000", mobiValue: 20000 },
      { id: "achievements-30000", mobiValue: 30000 },
      { id: "achievements-40000", mobiValue: 40000 },
      { id: "achievements-50000", mobiValue: 50000 },
      { id: "achievements-75000", mobiValue: 75000 },
      { id: "achievements-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "anniversary",
    name: "Anniversary Gifts",
    icon: "💑",
    gifts: [
      { id: "anniversary-1000", mobiValue: 1000 },
      { id: "anniversary-2000", mobiValue: 2000 },
      { id: "anniversary-3000", mobiValue: 3000 },
      { id: "anniversary-4000", mobiValue: 4000 },
      { id: "anniversary-5000", mobiValue: 5000 },
      { id: "anniversary-7500", mobiValue: 7500 },
      { id: "anniversary-10000", mobiValue: 10000 },
      { id: "anniversary-20000", mobiValue: 20000 },
      { id: "anniversary-30000", mobiValue: 30000 },
      { id: "anniversary-40000", mobiValue: 40000 },
      { id: "anniversary-50000", mobiValue: 50000 },
      { id: "anniversary-75000", mobiValue: 75000 },
      { id: "anniversary-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "apology",
    name: "Apology Gifts",
    icon: "😔",
    gifts: [
      { id: "apology-500", mobiValue: 500 },
      { id: "apology-1000", mobiValue: 1000 },
      { id: "apology-2000", mobiValue: 2000 },
      { id: "apology-3000", mobiValue: 3000 },
      { id: "apology-4000", mobiValue: 4000 },
      { id: "apology-5000", mobiValue: 5000 },
      { id: "apology-7500", mobiValue: 7500 },
      { id: "apology-10000", mobiValue: 10000 },
      { id: "apology-20000", mobiValue: 20000 },
      { id: "apology-30000", mobiValue: 30000 },
      { id: "apology-40000", mobiValue: 40000 },
      { id: "apology-50000", mobiValue: 50000 },
      { id: "apology-75000", mobiValue: 75000 },
      { id: "apology-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "birthday",
    name: "Birthday Gifts",
    icon: "🎂",
    gifts: [
      { id: "birthday-500", mobiValue: 500 },
      { id: "birthday-1000", mobiValue: 1000 },
      { id: "birthday-2000", mobiValue: 2000 },
      { id: "birthday-3000", mobiValue: 3000 },
      { id: "birthday-4000", mobiValue: 4000 },
      { id: "birthday-5000", mobiValue: 5000 },
      { id: "birthday-7500", mobiValue: 7500 },
      { id: "birthday-10000", mobiValue: 10000 },
      { id: "birthday-20000", mobiValue: 20000 },
      { id: "birthday-30000", mobiValue: 30000 },
      { id: "birthday-40000", mobiValue: 40000 },
      { id: "birthday-50000", mobiValue: 50000 },
      { id: "birthday-75000", mobiValue: 75000 },
      { id: "birthday-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "child-dedication",
    name: "Child Dedication Gifts",
    icon: "👶",
    gifts: [
      { id: "child-dedication-500", mobiValue: 500 },
      { id: "child-dedication-1000", mobiValue: 1000 },
      { id: "child-dedication-2000", mobiValue: 2000 },
      { id: "child-dedication-3000", mobiValue: 3000 },
      { id: "child-dedication-4000", mobiValue: 4000 },
      { id: "child-dedication-5000", mobiValue: 5000 },
      { id: "child-dedication-7500", mobiValue: 7500 },
      { id: "child-dedication-10000", mobiValue: 10000 },
      { id: "child-dedication-20000", mobiValue: 20000 },
      { id: "child-dedication-30000", mobiValue: 30000 },
      { id: "child-dedication-40000", mobiValue: 40000 },
      { id: "child-dedication-50000", mobiValue: 50000 },
      { id: "child-dedication-75000", mobiValue: 75000 },
      { id: "child-dedication-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "christmas",
    name: "Christmas Gifts",
    icon: "🎄",
    gifts: [
      { id: "christmas-500", mobiValue: 500 },
      { id: "christmas-1000", mobiValue: 1000 },
      { id: "christmas-2000", mobiValue: 2000 },
      { id: "christmas-3000", mobiValue: 3000 },
      { id: "christmas-4000", mobiValue: 4000 },
      { id: "christmas-5000", mobiValue: 5000 },
      { id: "christmas-7500", mobiValue: 7500 },
      { id: "christmas-10000", mobiValue: 10000 },
      { id: "christmas-20000", mobiValue: 20000 },
      { id: "christmas-30000", mobiValue: 30000 },
      { id: "christmas-40000", mobiValue: 40000 },
      { id: "christmas-50000", mobiValue: 50000 },
      { id: "christmas-75000", mobiValue: 75000 },
      { id: "christmas-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "compensation",
    name: "Compensation Gifts",
    icon: "💵",
    gifts: [
      { id: "compensation-500", mobiValue: 500 },
      { id: "compensation-1000", mobiValue: 1000 },
      { id: "compensation-2000", mobiValue: 2000 },
      { id: "compensation-3000", mobiValue: 3000 },
      { id: "compensation-4000", mobiValue: 4000 },
      { id: "compensation-5000", mobiValue: 5000 },
      { id: "compensation-7500", mobiValue: 7500 },
      { id: "compensation-10000", mobiValue: 10000 },
      { id: "compensation-20000", mobiValue: 20000 },
      { id: "compensation-30000", mobiValue: 30000 },
      { id: "compensation-40000", mobiValue: 40000 },
      { id: "compensation-50000", mobiValue: 50000 },
      { id: "compensation-75000", mobiValue: 75000 },
      { id: "compensation-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "condolence",
    name: "Condolence Gifts",
    icon: "🕊️",
    gifts: [
      { id: "condolence-500", mobiValue: 500 },
      { id: "condolence-1000", mobiValue: 1000 },
      { id: "condolence-2000", mobiValue: 2000 },
      { id: "condolence-3000", mobiValue: 3000 },
      { id: "condolence-4000", mobiValue: 4000 },
      { id: "condolence-5000", mobiValue: 5000 },
      { id: "condolence-7500", mobiValue: 7500 },
      { id: "condolence-10000", mobiValue: 10000 },
      { id: "condolence-20000", mobiValue: 20000 },
      { id: "condolence-30000", mobiValue: 30000 },
      { id: "condolence-40000", mobiValue: 40000 },
      { id: "condolence-50000", mobiValue: 50000 },
      { id: "condolence-75000", mobiValue: 75000 },
      { id: "condolence-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "crushing",
    name: "Crushing Gifts",
    icon: "💘",
    gifts: [
      { id: "crushing-500", mobiValue: 500 },
      { id: "crushing-1000", mobiValue: 1000 },
      { id: "crushing-2000", mobiValue: 2000 },
      { id: "crushing-3000", mobiValue: 3000 },
      { id: "crushing-4000", mobiValue: 4000 },
      { id: "crushing-5000", mobiValue: 5000 },
      { id: "crushing-7500", mobiValue: 7500 },
      { id: "crushing-10000", mobiValue: 10000 },
      { id: "crushing-20000", mobiValue: 20000 },
      { id: "crushing-30000", mobiValue: 30000 },
      { id: "crushing-40000", mobiValue: 40000 },
      { id: "crushing-50000", mobiValue: 50000 },
      { id: "crushing-75000", mobiValue: 75000 },
      { id: "crushing-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "easter",
    name: "Easter Gifts",
    icon: "🐰",
    gifts: [
      { id: "easter-500", mobiValue: 500 },
      { id: "easter-1000", mobiValue: 1000 },
      { id: "easter-2000", mobiValue: 2000 },
      { id: "easter-3000", mobiValue: 3000 },
      { id: "easter-4000", mobiValue: 4000 },
      { id: "easter-5000", mobiValue: 5000 },
      { id: "easter-7500", mobiValue: 7500 },
      { id: "easter-10000", mobiValue: 10000 },
      { id: "easter-20000", mobiValue: 20000 },
      { id: "easter-30000", mobiValue: 30000 },
      { id: "easter-40000", mobiValue: 40000 },
      { id: "easter-50000", mobiValue: 50000 },
      { id: "easter-75000", mobiValue: 75000 },
      { id: "easter-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "encouragement",
    name: "Encouragement Gifts",
    icon: "💪",
    gifts: [
      { id: "encouragement-500", mobiValue: 500 },
      { id: "encouragement-1000", mobiValue: 1000 },
      { id: "encouragement-2000", mobiValue: 2000 },
      { id: "encouragement-3000", mobiValue: 3000 },
      { id: "encouragement-4000", mobiValue: 4000 },
      { id: "encouragement-5000", mobiValue: 5000 },
      { id: "encouragement-7500", mobiValue: 7500 },
      { id: "encouragement-10000", mobiValue: 10000 },
      { id: "encouragement-20000", mobiValue: 20000 },
      { id: "encouragement-30000", mobiValue: 30000 },
      { id: "encouragement-40000", mobiValue: 40000 },
      { id: "encouragement-50000", mobiValue: 50000 },
      { id: "encouragement-75000", mobiValue: 75000 },
      { id: "encouragement-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "farewell",
    name: "Farewell Gifts",
    icon: "👋",
    gifts: [
      { id: "farewell-500", mobiValue: 500 },
      { id: "farewell-1000", mobiValue: 1000 },
      { id: "farewell-2000", mobiValue: 2000 },
      { id: "farewell-3000", mobiValue: 3000 },
      { id: "farewell-4000", mobiValue: 4000 },
      { id: "farewell-5000", mobiValue: 5000 },
      { id: "farewell-7500", mobiValue: 7500 },
      { id: "farewell-10000", mobiValue: 10000 },
      { id: "farewell-20000", mobiValue: 20000 },
      { id: "farewell-30000", mobiValue: 30000 },
      { id: "farewell-40000", mobiValue: 40000 },
      { id: "farewell-50000", mobiValue: 50000 },
      { id: "farewell-75000", mobiValue: 75000 },
      { id: "farewell-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "graduation",
    name: "Graduation Gifts",
    icon: "🎓",
    gifts: [
      { id: "graduation-500", mobiValue: 500 },
      { id: "graduation-1000", mobiValue: 1000 },
      { id: "graduation-2000", mobiValue: 2000 },
      { id: "graduation-3000", mobiValue: 3000 },
      { id: "graduation-4000", mobiValue: 4000 },
      { id: "graduation-5000", mobiValue: 5000 },
      { id: "graduation-7500", mobiValue: 7500 },
      { id: "graduation-10000", mobiValue: 10000 },
      { id: "graduation-20000", mobiValue: 20000 },
      { id: "graduation-30000", mobiValue: 30000 },
      { id: "graduation-40000", mobiValue: 40000 },
      { id: "graduation-50000", mobiValue: 50000 },
      { id: "graduation-75000", mobiValue: 75000 },
      { id: "graduation-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "gratitude",
    name: "Gratitude Gifts",
    icon: "🙌",
    gifts: [
      { id: "gratitude-500", mobiValue: 500 },
      { id: "gratitude-1000", mobiValue: 1000 },
      { id: "gratitude-2000", mobiValue: 2000 },
      { id: "gratitude-3000", mobiValue: 3000 },
      { id: "gratitude-4000", mobiValue: 4000 },
      { id: "gratitude-5000", mobiValue: 5000 },
      { id: "gratitude-7500", mobiValue: 7500 },
      { id: "gratitude-10000", mobiValue: 10000 },
      { id: "gratitude-20000", mobiValue: 20000 },
      { id: "gratitude-30000", mobiValue: 30000 },
      { id: "gratitude-40000", mobiValue: 40000 },
      { id: "gratitude-50000", mobiValue: 50000 },
      { id: "gratitude-75000", mobiValue: 75000 },
      { id: "gratitude-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "goodwill",
    name: "Goodwill Gifts",
    icon: "🤲",
    gifts: [
      { id: "goodwill-500", mobiValue: 500 },
      { id: "goodwill-1000", mobiValue: 1000 },
      { id: "goodwill-2000", mobiValue: 2000 },
      { id: "goodwill-3000", mobiValue: 3000 },
      { id: "goodwill-4000", mobiValue: 4000 },
      { id: "goodwill-5000", mobiValue: 5000 },
      { id: "goodwill-7500", mobiValue: 7500 },
      { id: "goodwill-10000", mobiValue: 10000 },
      { id: "goodwill-20000", mobiValue: 20000 },
      { id: "goodwill-30000", mobiValue: 30000 },
      { id: "goodwill-40000", mobiValue: 40000 },
      { id: "goodwill-50000", mobiValue: 50000 },
      { id: "goodwill-75000", mobiValue: 75000 },
      { id: "goodwill-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "likeness",
    name: "Likeness Gifts",
    icon: "👍",
    gifts: [
      { id: "likeness-500", mobiValue: 500 },
      { id: "likeness-1000", mobiValue: 1000 },
      { id: "likeness-2000", mobiValue: 2000 },
      { id: "likeness-3000", mobiValue: 3000 },
      { id: "likeness-4000", mobiValue: 4000 },
      { id: "likeness-5000", mobiValue: 5000 },
      { id: "likeness-7500", mobiValue: 7500 },
      { id: "likeness-10000", mobiValue: 10000 },
      { id: "likeness-20000", mobiValue: 20000 },
      { id: "likeness-30000", mobiValue: 30000 },
      { id: "likeness-40000", mobiValue: 40000 },
      { id: "likeness-50000", mobiValue: 50000 },
      { id: "likeness-75000", mobiValue: 75000 },
      { id: "likeness-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "love",
    name: "Love Gifts",
    icon: "❤️",
    gifts: [
      { id: "love-500", mobiValue: 500 },
      { id: "love-1000", mobiValue: 1000 },
      { id: "love-2000", mobiValue: 2000 },
      { id: "love-3000", mobiValue: 3000 },
      { id: "love-4000", mobiValue: 4000 },
      { id: "love-5000", mobiValue: 5000 },
      { id: "love-7500", mobiValue: 7500 },
      { id: "love-10000", mobiValue: 10000 },
      { id: "love-20000", mobiValue: 20000 },
      { id: "love-30000", mobiValue: 30000 },
      { id: "love-40000", mobiValue: 40000 },
      { id: "love-50000", mobiValue: 50000 },
      { id: "love-75000", mobiValue: 75000 },
      { id: "love-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "motivation",
    name: "Motivation Gifts",
    icon: "🔥",
    gifts: [
      { id: "motivation-500", mobiValue: 500 },
      { id: "motivation-1000", mobiValue: 1000 },
      { id: "motivation-2000", mobiValue: 2000 },
      { id: "motivation-3000", mobiValue: 3000 },
      { id: "motivation-4000", mobiValue: 4000 },
      { id: "motivation-5000", mobiValue: 5000 },
      { id: "motivation-7500", mobiValue: 7500 },
      { id: "motivation-10000", mobiValue: 10000 },
      { id: "motivation-20000", mobiValue: 20000 },
      { id: "motivation-30000", mobiValue: 30000 },
      { id: "motivation-40000", mobiValue: 40000 },
      { id: "motivation-50000", mobiValue: 50000 },
      { id: "motivation-75000", mobiValue: 75000 },
      { id: "motivation-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "milestone",
    name: "Milestone Gifts",
    icon: "🎯",
    gifts: [
      { id: "milestone-500", mobiValue: 500 },
      { id: "milestone-1000", mobiValue: 1000 },
      { id: "milestone-2000", mobiValue: 2000 },
      { id: "milestone-3000", mobiValue: 3000 },
      { id: "milestone-4000", mobiValue: 4000 },
      { id: "milestone-5000", mobiValue: 5000 },
      { id: "milestone-7500", mobiValue: 7500 },
      { id: "milestone-10000", mobiValue: 10000 },
      { id: "milestone-20000", mobiValue: 20000 },
      { id: "milestone-30000", mobiValue: 30000 },
      { id: "milestone-40000", mobiValue: 40000 },
      { id: "milestone-50000", mobiValue: 50000 },
      { id: "milestone-75000", mobiValue: 75000 },
      { id: "milestone-100000", mobiValue: 100000 },
    ]
  },
  {
    id: "new-year",
    name: "New Year Gifts",
    icon: "🎆",
    gifts: [
      { id: "new-year-500", mobiValue: 500 },
      { id: "new-year-1000", mobiValue: 1000 },
      { id: "new-year-2000", mobiValue: 2000 },
      { id: "new-year-3000", mobiValue: 3000 },
      { id: "new-year-4000", mobiValue: 4000 },
      { id: "new-year-5000", mobiValue: 5000 },
      { id: "new-year-7500", mobiValue: 7500 },
      { id: "new-year-10000", mobiValue: 10000 },
      { id: "new-year-20000", mobiValue: 20000 },
      { id: "new-year-30000", mobiValue: 30000 },
      { id: "new-year-40000", mobiValue: 40000 },
      { id: "new-year-50000", mobiValue: 50000 },
      { id: "new-year-75000", mobiValue: 75000 },
      { id: "new-year-100000", mobiValue: 100000 },
    ]
  },
];

// Legacy export for backwards compatibility
export interface SpecialDigitalGift {
  id: string;
  name: string;
  icon: string;
  mobiValue: number;
}

export const specialDigitalGifts: SpecialDigitalGift[] = specialDigitalGiftFolders.flatMap(folder => 
  folder.gifts.map(gift => ({
    id: gift.id,
    name: folder.name.replace(" Gifts", ""),
    icon: folder.icon,
    mobiValue: gift.mobiValue
  }))
);

// Classic Digital Gifts (Categorized)
export interface ClassicDigitalGift {
  id: string;
  name: string;
  icon: string;
  category: string;
  mobiValue: number;
  description?: string;
}

export const classicDigitalGifts: ClassicDigitalGift[] = [
  { id: "cdg1", name: "Red Rose", icon: "🌹", category: "Sweet", mobiValue: 1000, description: "A symbol of love" },
  { id: "cdg2", name: "Chocolate Bar", icon: "🍫", category: "Sweet", mobiValue: 2000, description: "Sweet treat" },
  { id: "cdg3", name: "Teddy Bear", icon: "🧸", category: "Sweet", mobiValue: 5000, description: "Cuddly companion" },
  { id: "cdg4", name: "Cupcake", icon: "🧁", category: "Sweet", mobiValue: 1500, description: "Delicious dessert" },
  { id: "cdg5", name: "Ice Cream", icon: "🍦", category: "Sweet", mobiValue: 1000, description: "Cool treat" },

  { id: "cdg6", name: "Breakfast Pack", icon: "🥞", category: "Meal-Ticket", mobiValue: 3500, description: "Start the day right" },
  { id: "cdg7", name: "Lunch Pack", icon: "🥝", category: "Meal-Ticket", mobiValue: 5000, description: "Midday feast" },
  { id: "cdg8", name: "Dinner Pack", icon: "🍽️", category: "Meal-Ticket", mobiValue: 4000, description: "Evening delight" },
  { id: "cdg9", name: "Snack Pack", icon: "🥨", category: "Meal-Ticket", mobiValue: 2500, description: "Quick bite" },

  { id: "cdg10", name: "Champagne", icon: "🍾", category: "Special", mobiValue: 30000, description: "Celebrate in style" },
  { id: "cdg11", name: "Wine Bottle", icon: "🍷", category: "Special", mobiValue: 8000, description: "Fine wine" },
  { id: "cdg12", name: "Cocktail", icon: "🍸", category: "Special", mobiValue: 20000, description: "Premium drink" },

  { id: "cdg13", name: "Perfume", icon: "🧴", category: "Emotion", mobiValue: 10000, description: "Signature scent" },
  { id: "cdg14", name: "Love Letter", icon: "💌", category: "Emotion", mobiValue: 5000, description: "Words from heart" },
  { id: "cdg15", name: "Bouquet", icon: "💐", category: "Emotion", mobiValue: 15000, description: "Beautiful flowers" },

  { id: "cdg16", name: "Wrist Watch", icon: "⌚", category: "Premium", mobiValue: 25000, description: "Luxury timepiece" },
  { id: "cdg17", name: "Diamond Ring", icon: "💍", category: "Premium", mobiValue: 200000, description: "Forever symbol" },
  { id: "cdg18", name: "Gold Necklace", icon: "📿", category: "Premium", mobiValue: 50000, description: "Elegant jewelry" },
  { id: "cdg19", name: "Designer Handbag", icon: "👜", category: "Premium", mobiValue: 60000, description: "Fashion statement" },

  { id: "cdg20", name: "Mansion Rent", icon: "🏠", category: "House", mobiValue: 5000000, description: "Mansion accommodation" },
  { id: "cdg21", name: "Flat Rent (Premium)", icon: "🏠", category: "House", mobiValue: 2000000, description: "Premium flat accommodation" },
  { id: "cdg22", name: "Flat Rent (Standard)", icon: "🏠", category: "House", mobiValue: 1500000, description: "Standard flat accommodation" },
  { id: "cdg23", name: "Self-Con Rent (Premium)", icon: "🏠", category: "House", mobiValue: 1000000, description: "Premium self-contained" },
  { id: "cdg24", name: "Self-Con Rent (Standard)", icon: "🏠", category: "House", mobiValue: 500000, description: "Standard self-contained" },

  { id: "cdg25", name: "Sole Flight Ticket (Local)", icon: "✈️", category: "T-Fare", mobiValue: 250000, description: "Local single flight" },
  { id: "cdg26", name: "Double Flight Ticket (Local)", icon: "✈️", category: "T-Fare", mobiValue: 450000, description: "Local double flight" },
  { id: "cdg27", name: "Sole Flight Ticket (International)", icon: "🛫", category: "T-Fare", mobiValue: 3250000, description: "International single flight" },
  { id: "cdg28", name: "Double Flight Ticket (International)", icon: "🛫", category: "T-Fare", mobiValue: 5450000, description: "International double flight" },
  { id: "cdg29", name: "Cab Trip", icon: "🚕", category: "T-Fare", mobiValue: 30000, description: "Cab ride" },
  { id: "cdg30", name: "Taxi Trip", icon: "🚖", category: "T-Fare", mobiValue: 20000, description: "Taxi ride" },

  { id: "cdg31", name: "Yacht Cruise", icon: "⛵", category: "Luxury", mobiValue: 10000000, description: "Ocean luxury cruise" },
  { id: "cdg32", name: "Private Jet Cruise", icon: "✈️", category: "Luxury", mobiValue: 25000000, description: "Sky luxury cruise" },

  { id: "cdg33", name: "School Fees (Tier 1)", icon: "💰", category: "Education", mobiValue: 50000, description: "School fees support" },
  { id: "cdg34", name: "School Fees (Tier 2)", icon: "💰", category: "Education", mobiValue: 150000, description: "School fees support" },
  { id: "cdg35", name: "School Fees (Tier 3)", icon: "💰", category: "Education", mobiValue: 300000, description: "School fees support" },
  { id: "cdg36", name: "School Fees (Tier 4)", icon: "💰", category: "Education", mobiValue: 500000, description: "School fees support" },

  { id: "cdg37", name: "Medical Health Emergency (Tier 1)", icon: "💊", category: "Health", mobiValue: 50000, description: "Medical emergency support" },
  { id: "cdg38", name: "Medical Health Emergency (Tier 2)", icon: "💊", category: "Health", mobiValue: 100000, description: "Medical emergency support" },
  { id: "cdg39", name: "Medical Health Emergency (Tier 3)", icon: "💉", category: "Health", mobiValue: 200000, description: "Medical emergency support" },
  { id: "cdg40", name: "Medical Health Emergency (Tier 4)", icon: "💉", category: "Health", mobiValue: 500000, description: "Medical emergency support" },
  { id: "cdg41", name: "Medical Health Emergency (Tier 5)", icon: "💉", category: "Health", mobiValue: 1000000, description: "Medical emergency support" },

  { id: "cdg42", name: "Personal Needs", icon: "🎁", category: "Personal", mobiValue: 100000, description: "Flexible personal support" },
];


// Tangible Mobi-store Gifts
export interface TangibleGift {
  id: string;
  name: string;
  image: string;
  mobiValue: number;
  description: string;
  category?: string;
}

export const tangibleGifts: TangibleGift[] = [
  { 
    id: "tg1", 
    name: "Premium Watch", 
    image: "/placeholder.svg", 
    mobiValue: 25000,
    description: "Luxury timepiece with premium materials",
    category: "Accessories"
  },
  { 
    id: "tg2", 
    name: "Designer Handbag", 
    image: "/placeholder.svg", 
    mobiValue: 45000,
    description: "Authentic designer bag in premium leather",
    category: "Fashion"
  },
  { 
    id: "tg3", 
    name: "Wireless Earbuds", 
    image: "/placeholder.svg", 
    mobiValue: 8000,
    description: "High-quality audio experience",
    category: "Electronics"
  },
  { 
    id: "tg4", 
    name: "Perfume Set", 
    image: "/placeholder.svg", 
    mobiValue: 12000,
    description: "Luxury fragrance collection",
    category: "Beauty"
  },
  { 
    id: "tg5", 
    name: "Smart Watch", 
    image: "/placeholder.svg", 
    mobiValue: 35000,
    description: "Latest technology on your wrist",
    category: "Electronics"
  },
  { 
    id: "tg6", 
    name: "Leather Wallet", 
    image: "/placeholder.svg", 
    mobiValue: 6000,
    description: "Genuine leather craftsmanship",
    category: "Accessories"
  },
];

// Gifts Vault (Saved items for quick gifting)
export const giftsVault: TangibleGift[] = [];

// Legacy mock gifts for backward compatibility
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

export interface SentGift {
  giftId: string;
  giftName: string;
  icon: string;
  mobiValue: number;
  toUserId: string;
  toUserName: string;
  date: string;
}

export const mockSentGifts: SentGift[] = [
  {
    giftId: "1",
    giftName: "Red Rose",
    icon: "🌹",
    mobiValue: 50,
    toUserId: "6",
    toUserName: "DAVID MARTINEZ",
    date: "2025-10-10"
  },
  {
    giftId: "3",
    giftName: "Birthday Cake",
    icon: "🎂",
    mobiValue: 100,
    toUserId: "7",
    toUserName: "JENNIFER TAYLOR",
    date: "2025-10-09"
  },
  {
    giftId: "9",
    giftName: "Watch",
    icon: "⌚",
    mobiValue: 2000,
    toUserId: "8",
    toUserName: "ROBERT BROWN",
    date: "2025-10-08"
  },
  {
    giftId: "4",
    giftName: "Champagne",
    icon: "🍾",
    mobiValue: 500,
    toUserId: "5",
    toUserName: "LISA ANDERSON",
    date: "2025-10-07"
  },
  {
    giftId: "2",
    giftName: "Diamond Ring",
    icon: "💍",
    mobiValue: 5000,
    toUserId: "6",
    toUserName: "DAVID MARTINEZ",
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
    hasInsufficientFunds: false,
    isFollowingBack: false,
    stats: { friends: 14, likes: 24, followers: 9, following: 8 }
  },
  {
    id: "2",
    name: "MICHAEL CHEN",
    avatar: profileMichael,
    isOnline: true,
    isContentCreator: false,
    hasInsufficientFunds: true,
    isFollowingBack: false,
    stats: { friends: 32, likes: 45, followers: 28, following: 15 }
  },
  {
    id: "3",
    name: "EMILY DAVIS",
    avatar: profileEmily,
    isOnline: false,
    isContentCreator: true,
    hasInsufficientFunds: false,
    isFollowingBack: true,
    stats: { friends: 18, likes: 31, followers: 12, following: 20 }
  },
  {
    id: "4",
    name: "JAMES WILSON",
    avatar: profileJames,
    isOnline: true,
    isContentCreator: false,
    hasInsufficientFunds: false,
    isFollowingBack: false,
    stats: { friends: 25, likes: 40, followers: 22, following: 18 }
  },
  {
    id: "5",
    name: "LISA ANDERSON",
    avatar: profileLisa,
    isOnline: false,
    isContentCreator: true,
    hasInsufficientFunds: true,
    isFollowingBack: false,
    stats: { friends: 11, likes: 19, followers: 7, following: 13 }
  },
  {
    id: "6",
    name: "DAVID MARTINEZ",
    avatar: profileDavid,
    isOnline: true,
    isContentCreator: true,
    hasInsufficientFunds: false,
    isFollowingBack: true,
    stats: { friends: 29, likes: 52, followers: 35, following: 24 }
  },
  {
    id: "7",
    name: "JENNIFER TAYLOR",
    avatar: profileJennifer,
    isOnline: false,
    isContentCreator: false,
    hasInsufficientFunds: false,
    isFollowingBack: false,
    stats: { friends: 16, likes: 28, followers: 14, following: 11 }
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
    isFollowing: true,
    stats: { friends: 14, likes: 24, followers: 9, following: 8 }
  },
  {
    id: "2",
    name: "MICHAEL CHEN",
    avatar: profileMichael,
    isOnline: true,
    isContentCreator: false,
    isFollowing: true,
    stats: { friends: 32, likes: 45, followers: 28, following: 15 }
  },
  {
    id: "3",
    name: "EMILY DAVIS",
    avatar: profileEmily,
    isOnline: false,
    isContentCreator: true,
    isFollowing: true,
    stats: { friends: 18, likes: 31, followers: 12, following: 20 }
  },
  {
    id: "4",
    name: "JAMES WILSON",
    avatar: profileJames,
    isOnline: true,
    isContentCreator: false,
    isFollowing: true,
    stats: { friends: 25, likes: 40, followers: 22, following: 18 }
  },
  {
    id: "5",
    name: "LISA ANDERSON",
    avatar: profileLisa,
    isOnline: false,
    isContentCreator: true,
    isFollowing: true,
    stats: { friends: 11, likes: 19, followers: 7, following: 13 }
  },
  {
    id: "6",
    name: "DAVID MARTINEZ",
    avatar: profileDavid,
    isOnline: true,
    isContentCreator: true,
    isFollowing: true,
    stats: { friends: 29, likes: 52, followers: 35, following: 24 }
  },
  {
    id: "7",
    name: "JENNIFER TAYLOR",
    avatar: profileJennifer,
    isOnline: false,
    isContentCreator: false,
    isFollowing: true,
    stats: { friends: 16, likes: 28, followers: 14, following: 11 }
  },
  {
    id: "8",
    name: "ROBERT BROWN",
    avatar: profileRobert,
    isOnline: true,
    isContentCreator: true,
    isFollowing: true,
    stats: { friends: 21, likes: 36, followers: 19, following: 16 }
  },
  {
    id: "9",
    name: "AMANDA WHITE",
    avatar: profilePhoto,
    isOnline: false,
    isContentCreator: false,
    isFollowing: true,
    stats: { friends: 13, likes: 22, followers: 10, following: 9 }
  },
  {
    id: "10",
    name: "CHRISTOPHER LEE",
    avatar: profileSarah,
    isOnline: true,
    isContentCreator: true,
    isFollowing: true,
    stats: { friends: 27, likes: 48, followers: 31, following: 21 }
  },
  {
    id: "11",
    name: "PATRICIA GARCIA",
    avatar: profileEmily,
    isOnline: false,
    isContentCreator: false,
    isFollowing: true,
    stats: { friends: 19, likes: 33, followers: 15, following: 17 }
  },
  {
    id: "12",
    name: "MATTHEW RODRIGUEZ",
    avatar: profileMichael,
    isOnline: true,
    isContentCreator: true,
    isFollowing: true,
    stats: { friends: 24, likes: 41, followers: 26, following: 19 }
  },
  {
    id: "13",
    name: "KAREN MARTINEZ",
    avatar: profileLisa,
    isOnline: false,
    isContentCreator: false,
    isFollowing: true,
    stats: { friends: 15, likes: 26, followers: 11, following: 14 }
  },
  {
    id: "14",
    name: "DANIEL HERNANDEZ",
    avatar: profileJames,
    isOnline: true,
    isContentCreator: true,
    isFollowing: true,
    stats: { friends: 30, likes: 55, followers: 38, following: 27 }
  },
  {
    id: "15",
    name: "NANCY LOPEZ",
    avatar: profileJennifer,
    isOnline: false,
    isContentCreator: false,
    isFollowing: true,
    stats: { friends: 17, likes: 30, followers: 13, following: 12 }
  },
  {
    id: "16",
    name: "PAUL GONZALEZ",
    avatar: profileDavid,
    isOnline: true,
    isContentCreator: true,
    isFollowing: true,
    stats: { friends: 22, likes: 39, followers: 20, following: 16 }
  },
  {
    id: "17",
    name: "SANDRA WILSON",
    avatar: profileRobert,
    isOnline: false,
    isContentCreator: false,
    isFollowing: true,
    stats: { friends: 14, likes: 25, followers: 9, following: 10 }
  }
];
