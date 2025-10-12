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

// Special Digital Gifts (Occasion-based)
export interface SpecialDigitalGift {
  id: string;
  name: string;
  icon: string;
  mobiValue: number;
}

export const specialDigitalGifts: SpecialDigitalGift[] = [
  { id: "sdg1", name: "Appreciation Gift", icon: "🙏", mobiValue: 200 },
  { id: "sdg2", name: "Anniversary Gift", icon: "💑", mobiValue: 500 },
  { id: "sdg3", name: "Apology Gift", icon: "😔", mobiValue: 150 },
  { id: "sdg4", name: "Birthday Gift", icon: "🎂", mobiValue: 300 },
  { id: "sdg5", name: "Celebration Gift", icon: "🎉", mobiValue: 250 },
  { id: "sdg6", name: "Christmas Gift", icon: "🎄", mobiValue: 400 },
  { id: "sdg7", name: "Compassion Gift", icon: "❤️", mobiValue: 180 },
  { id: "sdg8", name: "Congratulation Gift", icon: "🎊", mobiValue: 220 },
  { id: "sdg9", name: "Crushing Gift", icon: "💘", mobiValue: 350 },
  { id: "sdg10", name: "Easter Gift", icon: "🐰", mobiValue: 200 },
  { id: "sdg11", name: "Eid Gift", icon: "🌙", mobiValue: 300 },
  { id: "sdg12", name: "Encouragement Gift", icon: "💪", mobiValue: 150 },
  { id: "sdg13", name: "Friendship Gift", icon: "🤝", mobiValue: 180 },
  { id: "sdg14", name: "Get Well Soon Gift", icon: "🏥", mobiValue: 200 },
  { id: "sdg15", name: "Good Luck Gift", icon: "🍀", mobiValue: 170 },
  { id: "sdg16", name: "Graduation Gift", icon: "🎓", mobiValue: 400 },
  { id: "sdg17", name: "New Year Gift", icon: "🎆", mobiValue: 350 },
  { id: "sdg18", name: "Thank You Gift", icon: "🙌", mobiValue: 180 },
  { id: "sdg19", name: "Valentine Gift", icon: "💖", mobiValue: 500 },
  { id: "sdg20", name: "Wedding Gift", icon: "💒", mobiValue: 1000 },
];

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
  { id: "cdg1", name: "Red Rose", icon: "🌹", category: "Sweet", mobiValue: 50, description: "A symbol of love" },
  { id: "cdg2", name: "Chocolate Bar", icon: "🍫", category: "Sweet", mobiValue: 100, description: "Sweet treat" },
  { id: "cdg3", name: "Teddy Bear", icon: "🧸", category: "Sweet", mobiValue: 150, description: "Cuddly companion" },
  { id: "cdg4", name: "Cupcake", icon: "🧁", category: "Sweet", mobiValue: 75, description: "Delicious dessert" },
  { id: "cdg5", name: "Ice Cream", icon: "🍦", category: "Sweet", mobiValue: 80, description: "Cool treat" },
  
  { id: "cdg6", name: "Breakfast Pack", icon: "🍳", category: "Meal-Ticket", mobiValue: 1500, description: "Start the day right" },
  { id: "cdg7", name: "Lunch Pack", icon: "🍱", category: "Meal-Ticket", mobiValue: 3500, description: "Midday feast" },
  { id: "cdg8", name: "Dinner Pack", icon: "🍽️", category: "Meal-Ticket", mobiValue: 2500, description: "Evening delight" },
  { id: "cdg9", name: "Snack Pack", icon: "🍿", category: "Meal-Ticket", mobiValue: 1000, description: "Quick bite" },
  
  { id: "cdg10", name: "Champagne", icon: "🍾", category: "Special", mobiValue: 15000, description: "Celebrate in style" },
  { id: "cdg11", name: "Wine Bottle", icon: "🍷", category: "Special", mobiValue: 8000, description: "Fine wine" },
  { id: "cdg12", name: "Cocktail", icon: "🍸", category: "Special", mobiValue: 5000, description: "Premium drink" },
  
  { id: "cdg13", name: "Perfume", icon: "💐", category: "Emotion", mobiValue: 5000, description: "Signature scent" },
  { id: "cdg14", name: "Love Letter", icon: "💌", category: "Emotion", mobiValue: 3000, description: "Words from heart" },
  { id: "cdg15", name: "Bouquet", icon: "💐", category: "Emotion", mobiValue: 4000, description: "Beautiful flowers" },
  
  { id: "cdg16", name: "Wrist Watch", icon: "⌚", category: "Premium", mobiValue: 10000, description: "Luxury timepiece" },
  { id: "cdg17", name: "Diamond Ring", icon: "💍", category: "Premium", mobiValue: 50000, description: "Forever symbol" },
  { id: "cdg18", name: "Gold Necklace", icon: "📿", category: "Premium", mobiValue: 35000, description: "Elegant jewelry" },
  { id: "cdg19", name: "Designer Bag", icon: "👜", category: "Premium", mobiValue: 45000, description: "Fashion statement" },
  
  { id: "cdg20", name: "Mansion", icon: "🏰", category: "House", mobiValue: 500000, description: "Dream home" },
  { id: "cdg21", name: "Villa", icon: "🏡", category: "House", mobiValue: 350000, description: "Luxury villa" },
  { id: "cdg22", name: "Penthouse", icon: "🏢", category: "House", mobiValue: 450000, description: "Sky high living" },
  
  { id: "cdg23", name: "Sole Trip", icon: "✈️", category: "T-Fare", mobiValue: 10000, description: "Solo adventure" },
  { id: "cdg24", name: "Couple Trip", icon: "🛫", category: "T-Fare", mobiValue: 20000, description: "Romantic getaway" },
  { id: "cdg25", name: "Family Trip", icon: "🌍", category: "T-Fare", mobiValue: 35000, description: "Family vacation" },
  
  { id: "cdg26", name: "Sports Car", icon: "🏎️", category: "Luxury", mobiValue: 100000, description: "Speed demon" },
  { id: "cdg27", name: "Yacht", icon: "🛥️", category: "Luxury", mobiValue: 250000, description: "Ocean luxury" },
  { id: "cdg28", name: "Private Jet", icon: "🛩️", category: "Luxury", mobiValue: 500000, description: "Sky luxury" },
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
