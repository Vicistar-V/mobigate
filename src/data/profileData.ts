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
    id: "appreciation", 
    name: "Appreciation Gifts", 
    icon: "🙏", 
    gifts: [
      { id: "app-500", mobiValue: 500 },
      { id: "app-1000", mobiValue: 1000 },
      { id: "app-2000", mobiValue: 2000 },
      { id: "app-5000", mobiValue: 5000 },
    ]
  },
  { 
    id: "anniversary", 
    name: "Anniversary Gifts", 
    icon: "💑", 
    gifts: [
      { id: "ann-1000", mobiValue: 1000 },
      { id: "ann-2500", mobiValue: 2500 },
      { id: "ann-5000", mobiValue: 5000 },
      { id: "ann-10000", mobiValue: 10000 },
    ]
  },
  { 
    id: "apology", 
    name: "Apology Gifts", 
    icon: "😔", 
    gifts: [
      { id: "apo-300", mobiValue: 300 },
      { id: "apo-500", mobiValue: 500 },
      { id: "apo-1000", mobiValue: 1000 },
      { id: "apo-2000", mobiValue: 2000 },
    ]
  },
  { 
    id: "birthday", 
    name: "Birthday Gifts", 
    icon: "🎂", 
    gifts: [
      { id: "bir-500", mobiValue: 500 },
      { id: "bir-1000", mobiValue: 1000 },
      { id: "bir-3000", mobiValue: 3000 },
      { id: "bir-5000", mobiValue: 5000 },
      { id: "bir-10000", mobiValue: 10000 },
    ]
  },
  { 
    id: "celebration", 
    name: "Celebration Gifts", 
    icon: "🎉", 
    gifts: [
      { id: "cel-500", mobiValue: 500 },
      { id: "cel-1000", mobiValue: 1000 },
      { id: "cel-2500", mobiValue: 2500 },
      { id: "cel-5000", mobiValue: 5000 },
    ]
  },
  { 
    id: "christmas", 
    name: "Christmas Gifts", 
    icon: "🎄", 
    gifts: [
      { id: "chr-1000", mobiValue: 1000 },
      { id: "chr-2000", mobiValue: 2000 },
      { id: "chr-5000", mobiValue: 5000 },
      { id: "chr-10000", mobiValue: 10000 },
    ]
  },
  { 
    id: "compassion", 
    name: "Compassion Gifts", 
    icon: "❤️", 
    gifts: [
      { id: "com-300", mobiValue: 300 },
      { id: "com-500", mobiValue: 500 },
      { id: "com-1000", mobiValue: 1000 },
      { id: "com-2000", mobiValue: 2000 },
    ]
  },
  { 
    id: "congratulation", 
    name: "Congratulation Gifts", 
    icon: "🎊", 
    gifts: [
      { id: "con-500", mobiValue: 500 },
      { id: "con-1000", mobiValue: 1000 },
      { id: "con-2000", mobiValue: 2000 },
      { id: "con-5000", mobiValue: 5000 },
    ]
  },
  { 
    id: "crushing", 
    name: "Crushing Gifts", 
    icon: "💘", 
    gifts: [
      { id: "cru-700", mobiValue: 700 },
      { id: "cru-1500", mobiValue: 1500 },
      { id: "cru-3000", mobiValue: 3000 },
      { id: "cru-5000", mobiValue: 5000 },
    ]
  },
  { 
    id: "easter", 
    name: "Easter Gifts", 
    icon: "🐰", 
    gifts: [
      { id: "eas-400", mobiValue: 400 },
      { id: "eas-800", mobiValue: 800 },
      { id: "eas-1500", mobiValue: 1500 },
      { id: "eas-3000", mobiValue: 3000 },
    ]
  },
  { 
    id: "eid", 
    name: "Eid Gifts", 
    icon: "🌙", 
    gifts: [
      { id: "eid-600", mobiValue: 600 },
      { id: "eid-1000", mobiValue: 1000 },
      { id: "eid-2000", mobiValue: 2000 },
      { id: "eid-5000", mobiValue: 5000 },
    ]
  },
  { 
    id: "encouragement", 
    name: "Encouragement Gifts", 
    icon: "💪", 
    gifts: [
      { id: "enc-300", mobiValue: 300 },
      { id: "enc-600", mobiValue: 600 },
      { id: "enc-1000", mobiValue: 1000 },
      { id: "enc-2000", mobiValue: 2000 },
    ]
  },
  { 
    id: "friendship", 
    name: "Friendship Gifts", 
    icon: "🤝", 
    gifts: [
      { id: "fri-400", mobiValue: 400 },
      { id: "fri-800", mobiValue: 800 },
      { id: "fri-1500", mobiValue: 1500 },
      { id: "fri-3000", mobiValue: 3000 },
    ]
  },
  { 
    id: "getwell", 
    name: "Get Well Soon Gifts", 
    icon: "🏥", 
    gifts: [
      { id: "gws-400", mobiValue: 400 },
      { id: "gws-800", mobiValue: 800 },
      { id: "gws-1500", mobiValue: 1500 },
      { id: "gws-3000", mobiValue: 3000 },
    ]
  },
  { 
    id: "goodluck", 
    name: "Good Luck Gifts", 
    icon: "🍀", 
    gifts: [
      { id: "gl-300", mobiValue: 300 },
      { id: "gl-700", mobiValue: 700 },
      { id: "gl-1200", mobiValue: 1200 },
      { id: "gl-2500", mobiValue: 2500 },
    ]
  },
  { 
    id: "graduation", 
    name: "Graduation Gifts", 
    icon: "🎓", 
    gifts: [
      { id: "gra-1000", mobiValue: 1000 },
      { id: "gra-2000", mobiValue: 2000 },
      { id: "gra-5000", mobiValue: 5000 },
      { id: "gra-10000", mobiValue: 10000 },
    ]
  },
  { 
    id: "newyear", 
    name: "New Year Gifts", 
    icon: "🎆", 
    gifts: [
      { id: "ny-700", mobiValue: 700 },
      { id: "ny-1500", mobiValue: 1500 },
      { id: "ny-3000", mobiValue: 3000 },
      { id: "ny-7000", mobiValue: 7000 },
    ]
  },
  { 
    id: "thankyou", 
    name: "Thank You Gifts", 
    icon: "🙌", 
    gifts: [
      { id: "ty-400", mobiValue: 400 },
      { id: "ty-800", mobiValue: 800 },
      { id: "ty-1500", mobiValue: 1500 },
      { id: "ty-3000", mobiValue: 3000 },
    ]
  },
  { 
    id: "valentine", 
    name: "Valentine Gifts", 
    icon: "💖", 
    gifts: [
      { id: "val-1000", mobiValue: 1000 },
      { id: "val-2500", mobiValue: 2500 },
      { id: "val-5000", mobiValue: 5000 },
      { id: "val-10000", mobiValue: 10000 },
      { id: "val-20000", mobiValue: 20000 },
    ]
  },
  { 
    id: "wedding", 
    name: "Wedding Gifts", 
    icon: "💒", 
    gifts: [
      { id: "wed-2000", mobiValue: 2000 },
      { id: "wed-5000", mobiValue: 5000 },
      { id: "wed-10000", mobiValue: 10000 },
      { id: "wed-20000", mobiValue: 20000 },
      { id: "wed-50000", mobiValue: 50000 },
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
