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

// New interfaces for Membership Application System
export interface MembershipApplication {
  id: string;
  referenceNumber: string;
  communityId: string;
  
  // Applicant Info
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender: string;
  photo?: string;
  
  // Location
  stateOfOrigin?: string;
  cityOfResidence?: string;
  
  // Additional Info
  occupation?: string;
  howHeard: string;
  sponsorName?: string;
  motivation: string;
  
  // Status
  status: "pending" | "approved" | "rejected" | "under-review";
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  
  // Invitation Tracking
  invitedBy?: string;
  invitationCode?: string;
}

export interface MembershipManager {
  id: string;
  name: string;
  photo: string;
  assignedDate: Date;
  assignedBy: string;
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

export const howHeardOptions = [
  { value: "social-media", label: "Social Media" },
  { value: "friend-family", label: "Friend/Family Member" },
  { value: "website", label: "Community Website" },
  { value: "event", label: "Community Event" },
  { value: "search", label: "Internet Search" },
  { value: "invitation", label: "Received an Invitation" },
  { value: "other", label: "Other" }
];

export const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" }
];

export const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

// Mock Membership Applications
export const mockMembershipApplications: MembershipApplication[] = [
  {
    id: "app-1",
    referenceNumber: "APP-2024-45678",
    communityId: "1",
    fullName: "Adaora Nneka Obi",
    email: "adaora.obi@email.com",
    phone: "+2348012345678",
    dateOfBirth: "1990-05-15",
    gender: "female",
    photo: "/placeholder.svg",
    stateOfOrigin: "Anambra",
    cityOfResidence: "Lagos",
    occupation: "Software Engineer",
    howHeard: "friend-family",
    sponsorName: "Chief Emeka Okafor",
    motivation: "I am passionate about community development and would love to contribute my skills to help the community grow. I have been following the community's activities for over a year and believe I can add value to the organization.",
    status: "pending",
    submittedAt: new Date("2024-12-01T10:30:00"),
    invitedBy: undefined,
    invitationCode: undefined
  },
  {
    id: "app-2",
    referenceNumber: "APP-2024-45679",
    communityId: "1",
    fullName: "Oluwaseun Adetayo",
    email: "oluwaseun.a@email.com",
    phone: "+2348023456789",
    dateOfBirth: "1988-08-20",
    gender: "male",
    photo: "/placeholder.svg",
    stateOfOrigin: "Oyo",
    cityOfResidence: "Ibadan",
    occupation: "Medical Doctor",
    howHeard: "invitation",
    sponsorName: "Dr. Funke Adeleke",
    motivation: "I was invited by a colleague and I'm excited about the opportunity to network with like-minded professionals. The community's health outreach programs particularly interest me.",
    status: "pending",
    submittedAt: new Date("2024-12-02T14:45:00"),
    invitedBy: "Dr. Funke Adeleke",
    invitationCode: "INV-2024-ABC123"
  },
  {
    id: "app-3",
    referenceNumber: "APP-2024-45680",
    communityId: "1",
    fullName: "Halima Usman Yusuf",
    email: "halima.yusuf@email.com",
    phone: "+2348034567890",
    dateOfBirth: "1995-03-10",
    gender: "female",
    photo: "/placeholder.svg",
    stateOfOrigin: "Kano",
    cityOfResidence: "Abuja",
    occupation: "Entrepreneur",
    howHeard: "social-media",
    sponsorName: "",
    motivation: "I discovered this community through Instagram and was impressed by the initiatives. I run a small business and believe the community can help me grow while I contribute to community projects.",
    status: "under-review",
    submittedAt: new Date("2024-11-28T09:15:00"),
    invitedBy: undefined,
    invitationCode: undefined
  },
  {
    id: "app-4",
    referenceNumber: "APP-2024-45681",
    communityId: "1",
    fullName: "Chinedu Michael Eze",
    email: "chinedu.eze@email.com",
    phone: "+2348045678901",
    dateOfBirth: "1992-11-25",
    gender: "male",
    photo: "/placeholder.svg",
    stateOfOrigin: "Enugu",
    cityOfResidence: "Lagos",
    occupation: "Accountant",
    howHeard: "event",
    sponsorName: "Barr. Ngozi Okonkwo",
    motivation: "I attended the community's annual conference last year and was moved by the unity and vision. I want to be part of this family and contribute my financial expertise.",
    status: "approved",
    submittedAt: new Date("2024-11-20T16:30:00"),
    reviewedAt: new Date("2024-11-22T11:00:00"),
    reviewedBy: "Membership Manager",
    invitedBy: undefined,
    invitationCode: undefined
  },
  {
    id: "app-5",
    referenceNumber: "APP-2024-45682",
    communityId: "1",
    fullName: "Blessing Okonkwo",
    email: "blessing.ok@email.com",
    phone: "+2348056789012",
    dateOfBirth: "1997-07-08",
    gender: "female",
    photo: "/placeholder.svg",
    stateOfOrigin: "Imo",
    cityOfResidence: "Port Harcourt",
    occupation: "Teacher",
    howHeard: "website",
    sponsorName: "",
    motivation: "Found the community website while researching professional associations. I'm a teacher passionate about education and community service.",
    status: "approved",
    submittedAt: new Date("2024-11-15T08:00:00"),
    reviewedAt: new Date("2024-11-17T14:30:00"),
    reviewedBy: "Membership Manager",
    invitedBy: undefined,
    invitationCode: undefined
  },
  {
    id: "app-6",
    referenceNumber: "APP-2024-45683",
    communityId: "1",
    fullName: "Ahmed Bello Ibrahim",
    email: "ahmed.ibrahim@email.com",
    phone: "+2348067890123",
    dateOfBirth: "1985-01-30",
    gender: "male",
    photo: "/placeholder.svg",
    stateOfOrigin: "Kaduna",
    cityOfResidence: "Kaduna",
    occupation: "Civil Servant",
    howHeard: "friend-family",
    sponsorName: "Hon. Mohammed Aliyu",
    motivation: "My brother recommended this community. I am interested in contributing to policy discussions and community welfare programs.",
    status: "rejected",
    submittedAt: new Date("2024-11-10T12:00:00"),
    reviewedAt: new Date("2024-11-12T10:00:00"),
    reviewedBy: "Membership Manager",
    rejectionReason: "Incomplete documentation - Please provide valid ID and re-apply.",
    invitedBy: undefined,
    invitationCode: undefined
  },
  {
    id: "app-7",
    referenceNumber: "APP-2024-45684",
    communityId: "1",
    fullName: "Victoria Chidinma Nwachukwu",
    email: "victoria.nwachukwu@email.com",
    phone: "+2348078901234",
    dateOfBirth: "1993-09-12",
    gender: "female",
    photo: "/placeholder.svg",
    stateOfOrigin: "Abia",
    cityOfResidence: "Aba",
    occupation: "Fashion Designer",
    howHeard: "social-media",
    sponsorName: "",
    motivation: "I saw the community's cultural events on Facebook and I'm eager to participate. I can contribute to fashion shows and cultural exhibitions.",
    status: "pending",
    submittedAt: new Date("2024-12-03T11:20:00"),
    invitedBy: undefined,
    invitationCode: undefined
  },
  {
    id: "app-8",
    referenceNumber: "APP-2024-45685",
    communityId: "1",
    fullName: "Uche Nnamdi Okoli",
    email: "uche.okoli@email.com",
    phone: "+2348089012345",
    dateOfBirth: "1991-04-18",
    gender: "male",
    photo: "/placeholder.svg",
    stateOfOrigin: "Delta",
    cityOfResidence: "Warri",
    occupation: "Engineer",
    howHeard: "invitation",
    sponsorName: "Engr. Peter Obi",
    motivation: "Received an invitation from a colleague. I'm an engineer with experience in infrastructure projects and would love to contribute to community development initiatives.",
    status: "pending",
    submittedAt: new Date("2024-12-03T15:45:00"),
    invitedBy: "Engr. Peter Obi",
    invitationCode: "INV-2024-DEF456"
  }
];

// Mock Membership Managers
export const mockMembershipManagers: MembershipManager[] = [
  {
    id: "mm-1",
    name: "Barr. Ngozi Okonkwo",
    photo: "/placeholder.svg",
    assignedDate: new Date("2024-01-15"),
    assignedBy: "Community Owner"
  },
  {
    id: "mm-2",
    name: "Dr. Funke Adeleke",
    photo: "/placeholder.svg",
    assignedDate: new Date("2024-06-01"),
    assignedBy: "Community Owner"
  }
];