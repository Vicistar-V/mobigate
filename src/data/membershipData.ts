export interface Member {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  role?: string;
  joinDate?: Date;
  lastSeen?: string;
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: "virtual" | "voucher" | "donation";
  icon: string;
  image: string;
}

export interface BlockedMember extends Member {
  blockedDate: Date;
  reason: string;
}

export interface FriendRequest {
  id: string;
  from: Member;
  to: Member;
  status: "pending" | "accepted" | "rejected";
  date: Date;
}

export const mockOnlineMembers: Member[] = [
  {
    id: "mem-1",
    name: "Chukwudi Okafor",
    avatar: "/placeholder.svg",
    isOnline: true,
    role: "Member",
    lastSeen: "Just now"
  },
  {
    id: "mem-2",
    name: "Amina Hassan",
    avatar: "/placeholder.svg",
    isOnline: true,
    role: "Executive",
    lastSeen: "2 minutes ago"
  },
  {
    id: "mem-3",
    name: "Emeka Nwosu",
    avatar: "/placeholder.svg",
    isOnline: true,
    role: "Member",
    lastSeen: "5 minutes ago"
  },
  {
    id: "mem-4",
    name: "Fatima Bello",
    avatar: "/placeholder.svg",
    isOnline: true,
    role: "Admin",
    lastSeen: "1 minute ago"
  },
  {
    id: "mem-5",
    name: "Tunde Adeyemi",
    avatar: "/placeholder.svg",
    isOnline: false,
    role: "Member",
    lastSeen: "1 hour ago"
  },
  {
    id: "mem-6",
    name: "Ngozi Okeke",
    avatar: "/placeholder.svg",
    isOnline: true,
    role: "Member",
    lastSeen: "Just now"
  },
  {
    id: "mem-7",
    name: "Ibrahim Musa",
    avatar: "/placeholder.svg",
    isOnline: false,
    role: "Member",
    lastSeen: "3 hours ago"
  },
  {
    id: "mem-8",
    name: "Chioma Eze",
    avatar: "/placeholder.svg",
    isOnline: true,
    role: "Executive",
    lastSeen: "10 minutes ago"
  }
];

export const giftCatalog: Gift[] = [
  {
    id: "gift-1",
    name: "Virtual Rose",
    description: "A beautiful virtual rose to show appreciation",
    price: 500,
    currency: "NGN",
    category: "virtual",
    icon: "🌹",
    image: "/placeholder.svg"
  },
  {
    id: "gift-2",
    name: "Trophy",
    description: "Award someone for their excellence",
    price: 1000,
    currency: "NGN",
    category: "virtual",
    icon: "🏆",
    image: "/placeholder.svg"
  },
  {
    id: "gift-3",
    name: "Gift Box",
    description: "A mystery gift package",
    price: 2000,
    currency: "NGN",
    category: "virtual",
    icon: "🎁",
    image: "/placeholder.svg"
  },
  {
    id: "gift-4",
    name: "Restaurant Voucher",
    description: "NGN 5,000 voucher for partner restaurants",
    price: 4500,
    currency: "NGN",
    category: "voucher",
    icon: "🍽️",
    image: "/placeholder.svg"
  },
  {
    id: "gift-5",
    name: "Shopping Voucher",
    description: "NGN 10,000 shopping voucher",
    price: 9000,
    currency: "NGN",
    category: "voucher",
    icon: "🛍️",
    image: "/placeholder.svg"
  },
  {
    id: "gift-6",
    name: "Donation Badge",
    description: "Make a donation in someone's name",
    price: 5000,
    currency: "NGN",
    category: "donation",
    icon: "❤️",
    image: "/placeholder.svg"
  }
];

export const mockBlockedMembers: BlockedMember[] = [
  {
    id: "blocked-1",
    name: "John Doe",
    avatar: "/placeholder.svg",
    isOnline: false,
    blockedDate: new Date("2024-10-15"),
    reason: "Spam messages"
  },
  {
    id: "blocked-2",
    name: "Jane Smith",
    avatar: "/placeholder.svg",
    isOnline: false,
    blockedDate: new Date("2024-11-01"),
    reason: "Inappropriate behavior"
  }
];

export const suggestedFriends: Member[] = [
  {
    id: "sug-1",
    name: "Ada Okonkwo",
    avatar: "/placeholder.svg",
    isOnline: true,
    role: "Member",
    joinDate: new Date("2024-01-15")
  },
  {
    id: "sug-2",
    name: "Yusuf Abdullahi",
    avatar: "/placeholder.svg",
    isOnline: false,
    role: "Member",
    joinDate: new Date("2024-02-20")
  },
  {
    id: "sug-3",
    name: "Blessing Chukwu",
    avatar: "/placeholder.svg",
    isOnline: true,
    role: "Executive",
    joinDate: new Date("2024-03-10")
  },
  {
    id: "sug-4",
    name: "Mohammed Ali",
    avatar: "/placeholder.svg",
    isOnline: false,
    role: "Member",
    joinDate: new Date("2024-04-05")
  }
];

export const exitReasons = [
  "Relocating to another location",
  "Time constraints",
  "Personal reasons",
  "Joining another community",
  "Dissatisfied with services",
  "Financial constraints",
  "Other"
];
