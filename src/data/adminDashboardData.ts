import communityPerson1 from "@/assets/community-person-1.jpg";
import communityPerson2 from "@/assets/community-person-2.jpg";
import communityPerson3 from "@/assets/community-person-3.jpg";
import communityPerson4 from "@/assets/community-person-4.jpg";
import communityPerson5 from "@/assets/community-person-5.jpg";
import communityPerson6 from "@/assets/community-person-6.jpg";

export interface AdminStats {
  totalMembers: number;
  activeMembers: number;
  pendingRequests: number;
  blockedUsers: number;
  activeElections: number;
  upcomingMeetings: number;
  walletBalance: number;
  pendingContent: number;
  totalNews: number;
  totalEvents: number;
  totalArticles: number;
  totalVibes: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  pendingPayments: number;
  accreditedVoters: number;
  clearedCandidates: number;
  scheduledMeetings: number;
  completedMeetings: number;
  avgAttendanceRate: number;
  memberTrend: number;
}

export interface AdminActivity {
  id: string;
  adminName: string;
  adminAvatar: string;
  action: string;
  target: string;
  timestamp: Date;
  type: 'membership' | 'content' | 'election' | 'finance' | 'settings' | 'leadership' | 'meeting';
}

export interface PendingAction {
  id: string;
  type: 'membership' | 'content' | 'clearance' | 'finance' | 'conflict';
  title: string;
  description: string;
  count: number;
  urgent: boolean;
}

export interface RecentMemberRequest {
  id: string;
  name: string;
  avatar: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface RecentContent {
  id: string;
  title: string;
  type: 'news' | 'event' | 'article' | 'vibe';
  author: string;
  authorAvatar: string;
  createdAt: Date;
  status: 'published' | 'pending' | 'draft';
}

export interface RecentTransaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  description: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  memberName?: string;
}

export interface DefaultingMember {
  id: string;
  name: string;
  avatar: string;
  amountOwed: number;
  dueDate: Date;
  obligation: string;
}

export interface ElectionActivity {
  id: string;
  action: string;
  candidate?: string;
  position?: string;
  timestamp: Date;
}

export interface UpcomingMeeting {
  id: string;
  title: string;
  date: Date;
  attendees: number;
  status: 'scheduled' | 'in-progress' | 'completed';
}

// Mock Data
export const mockAdminStats: AdminStats = {
  totalMembers: 1234,
  activeMembers: 1089,
  pendingRequests: 8,
  blockedUsers: 23,
  activeElections: 2,
  upcomingMeetings: 3,
  walletBalance: 125000,
  pendingContent: 5,
  totalNews: 47,
  totalEvents: 28,
  totalArticles: 156,
  totalVibes: 892,
  monthlyIncome: 45000,
  monthlyExpenses: 32000,
  pendingPayments: 12,
  accreditedVoters: 876,
  clearedCandidates: 14,
  scheduledMeetings: 3,
  completedMeetings: 24,
  avgAttendanceRate: 78,
  memberTrend: 12,
};

export const mockPendingActions: PendingAction[] = [
  {
    id: "pa-1",
    type: "membership",
    title: "Membership Requests",
    description: "New applications awaiting review",
    count: 8,
    urgent: true,
  },
  {
    id: "pa-2",
    type: "content",
    title: "Content Approvals",
    description: "Posts pending moderation",
    count: 5,
    urgent: false,
  },
  {
    id: "pa-3",
    type: "clearance",
    title: "Election Clearances",
    description: "Candidates awaiting clearance",
    count: 3,
    urgent: true,
  },
  {
    id: "pa-4",
    type: "finance",
    title: "Overdue Payments",
    description: "Members with outstanding balances",
    count: 12,
    urgent: true,
  },
  {
    id: "pa-5",
    type: "conflict",
    title: "Conflicts of Interest",
    description: "Unresolved declarations",
    count: 2,
    urgent: false,
  },
];

export const mockAdminActivities: AdminActivity[] = [
  {
    id: "act-1",
    adminName: "Barr. Ngozi Okonkwo",
    adminAvatar: communityPerson1,
    action: "approved membership for",
    target: "Jane Smith",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    type: "membership",
  },
  {
    id: "act-2",
    adminName: "Chief Emeka Obi",
    adminAvatar: communityPerson2,
    action: "updated election settings for",
    target: "2025 General Elections",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: "election",
  },
  {
    id: "act-3",
    adminName: "Dr. Amaka Eze",
    adminAvatar: communityPerson3,
    action: "blocked user",
    target: "suspicious_account_42",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    type: "membership",
  },
  {
    id: "act-4",
    adminName: "Barr. Ngozi Okonkwo",
    adminAvatar: communityPerson1,
    action: "published news article",
    target: "Community Development Update",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: "content",
  },
  {
    id: "act-5",
    adminName: "Chief Emeka Obi",
    adminAvatar: communityPerson2,
    action: "processed payment for",
    target: "Annual Dues Collection",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    type: "finance",
  },
  {
    id: "act-6",
    adminName: "Dr. Amaka Eze",
    adminAvatar: communityPerson3,
    action: "scheduled meeting",
    target: "Q1 General Assembly",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    type: "meeting",
  },
  {
    id: "act-7",
    adminName: "Barr. Ngozi Okonkwo",
    adminAvatar: communityPerson1,
    action: "updated leadership for",
    target: "Executive Committee",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    type: "leadership",
  },
];

export const mockRecentMemberRequests: RecentMemberRequest[] = [
  {
    id: "req-1",
    name: "Chukwuemeka Okonkwo",
    avatar: communityPerson4,
    requestDate: new Date(Date.now() - 30 * 60 * 1000),
    status: "pending",
  },
  {
    id: "req-2",
    name: "Adaeze Nnamdi",
    avatar: communityPerson5,
    requestDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "pending",
  },
  {
    id: "req-3",
    name: "Ifeanyi Ezekwesili",
    avatar: communityPerson6,
    requestDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: "pending",
  },
];

export const mockRecentContent: RecentContent[] = [
  {
    id: "cnt-1",
    title: "Community Cultural Festival Announcement",
    type: "news",
    author: "Chief Emeka Obi",
    authorAvatar: communityPerson2,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: "pending",
  },
  {
    id: "cnt-2",
    title: "Annual General Meeting 2025",
    type: "event",
    author: "Barr. Ngozi Okonkwo",
    authorAvatar: communityPerson1,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: "published",
  },
  {
    id: "cnt-3",
    title: "The History of Our Great Community",
    type: "article",
    author: "Dr. Amaka Eze",
    authorAvatar: communityPerson3,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: "draft",
  },
];

export const mockRecentTransactions: RecentTransaction[] = [
  {
    id: "txn-1",
    type: "income",
    description: "Annual Dues Payment",
    amount: 15000,
    date: new Date(Date.now() - 30 * 60 * 1000),
    status: "completed",
    memberName: "Chukwuemeka Okonkwo",
  },
  {
    id: "txn-2",
    type: "expense",
    description: "Event Hall Booking",
    amount: 50000,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "txn-3",
    type: "income",
    description: "Development Levy",
    amount: 25000,
    date: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: "pending",
    memberName: "Adaeze Nnamdi",
  },
  {
    id: "txn-4",
    type: "transfer",
    description: "Welfare Fund Transfer",
    amount: 100000,
    date: new Date(Date.now() - 8 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "txn-5",
    type: "income",
    description: "Registration Fee",
    amount: 5000,
    date: new Date(Date.now() - 12 * 60 * 60 * 1000),
    status: "completed",
    memberName: "Ifeanyi Ezekwesili",
  },
];

export const mockDefaultingMembers: DefaultingMember[] = [
  {
    id: "def-1",
    name: "Obiora Chukwuma",
    avatar: communityPerson4,
    amountOwed: 35000,
    dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    obligation: "Annual Dues 2024",
  },
  {
    id: "def-2",
    name: "Chiamaka Eze",
    avatar: communityPerson5,
    amountOwed: 15000,
    dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    obligation: "Development Levy",
  },
  {
    id: "def-3",
    name: "Nnamdi Okafor",
    avatar: communityPerson6,
    amountOwed: 8000,
    dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    obligation: "Special Assessment",
  },
];

export const mockElectionActivities: ElectionActivity[] = [
  {
    id: "elc-1",
    action: "Candidate registered",
    candidate: "Chief Emeka Obi",
    position: "President",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "elc-2",
    action: "Voter accredited",
    candidate: "Chukwuemeka Okonkwo",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "elc-3",
    action: "Clearance approved",
    candidate: "Dr. Amaka Eze",
    position: "Vice President",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

export const mockUpcomingMeetings: UpcomingMeeting[] = [
  {
    id: "mtg-1",
    title: "Q1 General Assembly",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    attendees: 0,
    status: "scheduled",
  },
  {
    id: "mtg-2",
    title: "Executive Committee Meeting",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    attendees: 0,
    status: "scheduled",
  },
  {
    id: "mtg-3",
    title: "Finance Committee Review",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    attendees: 0,
    status: "scheduled",
  },
];

// Helper function to format relative time
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

// Helper function to format future time
export const formatFutureTime = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `In ${diffDays} days`;
  return date.toLocaleDateString();
};
