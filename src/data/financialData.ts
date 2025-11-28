export interface FinancialItem {
  id: string;
  name: string;
  description?: string;
  category: 'dues' | 'fees' | 'donations' | 'supports' | 'fines';
}

export interface FinancialPeriod {
  year: number;
  amount: number | null;
  date: string | null;
  status?: 'paid' | 'pending' | 'overdue';
}

export interface MemberFinancialRecord {
  memberId: string;
  memberName: string;
  memberRegistration: string;
  avatar?: string;
  items: {
    itemId: string;
    periods: FinancialPeriod[];
  }[];
}

export interface FinancialClearanceStatus {
  itemId: string;
  status: 'cleared' | 'pending' | 'overdue';
  hasClearance: boolean;
}

export interface MemberWithClearance {
  id: string;
  name: string;
  avatar?: string;
  registration: string;
  clearances: FinancialClearanceStatus[];
}

export const financialItems: FinancialItem[] = [
  {
    id: 'item-1',
    name: 'Membership Registration Fees',
    category: 'fees'
  },
  {
    id: 'item-2',
    name: 'General Annual Dues & Levies',
    category: 'dues'
  },
  {
    id: 'item-3',
    name: 'Cultural Events Levies',
    category: 'dues'
  },
  {
    id: 'item-4',
    name: 'Annual Membership Fee',
    category: 'fees'
  },
  {
    id: 'item-5',
    name: 'Donation/Civic Centre Project',
    category: 'donations'
  },
  {
    id: 'item-6',
    name: 'Support Received/Details Here',
    category: 'supports'
  },
  {
    id: 'item-7',
    name: 'Fine Imposed/Details Here',
    category: 'fines'
  }
];

export const mockMemberFinancialRecord: MemberFinancialRecord = {
  memberId: 'member-1',
  memberName: 'Mark Anthony Orji',
  memberRegistration: 'VR-2025/2865219',
  items: [
    {
      itemId: 'item-1',
      periods: [
        { year: 2025, amount: 67000, date: 'Jan; 25', status: 'paid' },
        { year: 2024, amount: 65000, date: 'Feb; 15', status: 'paid' },
        { year: 2023, amount: 60000, date: 'Jan; 20', status: 'paid' },
        { year: 2022, amount: null, date: null },
      ]
    },
    {
      itemId: 'item-2',
      periods: [
        { year: 2025, amount: 185000, date: 'Mar; 08', status: 'paid' },
        { year: 2024, amount: 175000, date: 'Mar; 12', status: 'paid' },
        { year: 2023, amount: 165000, date: 'Apr; 05', status: 'paid' },
        { year: 2022, amount: 155000, date: 'Mar; 22', status: 'paid' },
      ]
    },
    {
      itemId: 'item-3',
      periods: [
        { year: 2025, amount: null, date: null },
        { year: 2024, amount: 50000, date: 'Dec; 10', status: 'paid' },
        { year: 2023, amount: 45000, date: 'Nov; 15', status: 'paid' },
        { year: 2022, amount: null, date: null },
      ]
    },
    {
      itemId: 'item-4',
      periods: [
        { year: 2025, amount: 200000, date: 'Jan; 05', status: 'paid' },
        { year: 2024, amount: 190000, date: 'Jan; 10', status: 'paid' },
        { year: 2023, amount: 180000, date: 'Jan; 08', status: 'paid' },
        { year: 2022, amount: 170000, date: 'Feb; 01', status: 'paid' },
      ]
    },
    {
      itemId: 'item-5',
      periods: [
        { year: 2025, amount: 150000, date: 'Feb; 20', status: 'paid' },
        { year: 2024, amount: null, date: null },
        { year: 2023, amount: 100000, date: 'Jun; 30', status: 'paid' },
        { year: 2022, amount: null, date: null },
      ]
    },
    {
      itemId: 'item-6',
      periods: [
        { year: 2025, amount: null, date: null },
        { year: 2024, amount: 25000, date: 'Aug; 15', status: 'paid' },
        { year: 2023, amount: null, date: null },
        { year: 2022, amount: 30000, date: 'Sep; 10', status: 'paid' },
      ]
    },
    {
      itemId: 'item-7',
      periods: [
        { year: 2025, amount: null, date: null },
        { year: 2024, amount: null, date: null },
        { year: 2023, amount: 15000, date: 'Oct; 05', status: 'paid' },
        { year: 2022, amount: null, date: null },
      ]
    }
  ]
};

export const otherMembersFinancialData = [
  {
    id: 'member-2',
    name: 'Sarah Johnson',
    avatar: '/src/assets/profile-sarah-johnson.jpg',
    registration: 'VR-2024/1234567'
  },
  {
    id: 'member-3',
    name: 'Michael Chen',
    avatar: '/src/assets/profile-michael-chen.jpg',
    registration: 'VR-2024/2345678'
  },
  {
    id: 'member-4',
    name: 'Emily Davis',
    avatar: '/src/assets/profile-emily-davis.jpg',
    registration: 'VR-2023/3456789'
  }
];

export const mockMembersWithClearance: MemberWithClearance[] = [
  {
    id: 'member-1',
    name: 'Mark Anthony Orji',
    registration: 'VR-2025/2865219',
    clearances: [
      { itemId: 'item-1', status: 'cleared', hasClearance: true },
      { itemId: 'item-2', status: 'cleared', hasClearance: true },
      { itemId: 'item-3', status: 'pending', hasClearance: false },
      { itemId: 'item-4', status: 'cleared', hasClearance: true },
      { itemId: 'item-5', status: 'cleared', hasClearance: true },
      { itemId: 'item-6', status: 'cleared', hasClearance: true },
      { itemId: 'item-7', status: 'cleared', hasClearance: true },
    ]
  },
  {
    id: 'member-2',
    name: 'Sarah Johnson',
    avatar: '/src/assets/profile-sarah-johnson.jpg',
    registration: 'VR-2024/1234567',
    clearances: [
      { itemId: 'item-1', status: 'cleared', hasClearance: true },
      { itemId: 'item-2', status: 'cleared', hasClearance: true },
      { itemId: 'item-3', status: 'cleared', hasClearance: true },
      { itemId: 'item-4', status: 'overdue', hasClearance: false },
      { itemId: 'item-5', status: 'cleared', hasClearance: true },
      { itemId: 'item-6', status: 'cleared', hasClearance: true },
      { itemId: 'item-7', status: 'cleared', hasClearance: true },
    ]
  },
  {
    id: 'member-3',
    name: 'Michael Chen',
    avatar: '/src/assets/profile-michael-chen.jpg',
    registration: 'VR-2024/2345678',
    clearances: [
      { itemId: 'item-1', status: 'cleared', hasClearance: true },
      { itemId: 'item-2', status: 'pending', hasClearance: false },
      { itemId: 'item-3', status: 'cleared', hasClearance: true },
      { itemId: 'item-4', status: 'cleared', hasClearance: true },
      { itemId: 'item-5', status: 'pending', hasClearance: false },
      { itemId: 'item-6', status: 'cleared', hasClearance: true },
      { itemId: 'item-7', status: 'cleared', hasClearance: true },
    ]
  }
];

// Community Accounts Data
export interface Transaction {
  id: string;
  serialNumber: number;
  description: string;
  creditAmount: number | null;
  debitAmount: number | null;
  approvalCode: string | null;
  date: string;
  type: 'credit' | 'debit';
  status: 'approved' | 'pending' | 'rejected';
}

export interface AccountBalance {
  totalCredit: number;
  totalDebit: number;
  availableBalance: number;
}

// Activity attendance data
export interface ActivityAttendance {
  category: 'meetings' | 'events' | 'invitations';
  title: string;
  period: string;
  attendancePercentage: number;
  penaltyAmount: number;
}

// Indebtedness item with penalty
export interface IndebtednessItem {
  id: string;
  name: string;
  amount: number;
  penaltyPercentage: number;
  totalWithPenalty: number;
}

// Penalty tier scale
export interface PenaltyTier {
  threshold: string;
  percentage: number;
  amount: number;
}

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    serialNumber: 1,
    description: 'Membership Registration',
    creditAmount: 100000,
    debitAmount: 120000,
    approvalCode: 'ADM-18#5 21-X07Y2 4M',
    date: 'Jan 15, 2025',
    type: 'credit',
    status: 'approved'
  },
  {
    id: 'txn-2',
    serialNumber: 2,
    description: 'General Annual Dues & Levies',
    creditAmount: 180000,
    debitAmount: 200000,
    approvalCode: 'ADM-22#3 18-K09Z5 2N',
    date: 'Feb 20, 2025',
    type: 'credit',
    status: 'approved'
  },
  {
    id: 'txn-3',
    serialNumber: 3,
    description: 'Cultural Events Levies payment',
    creditAmount: 210000,
    debitAmount: 230000,
    approvalCode: 'ADM-19#7 25-M11P8 6Q',
    date: 'Mar 10, 2025',
    type: 'debit',
    status: 'approved'
  },
  {
    id: 'txn-4',
    serialNumber: 4,
    description: 'Payment of Annual Membership Fee',
    creditAmount: 80000,
    debitAmount: 100000,
    approvalCode: 'ADM-16#2 30-R14S3 9T',
    date: 'Mar 25, 2025',
    type: 'credit',
    status: 'approved'
  },
  {
    id: 'txn-5',
    serialNumber: 5,
    description: 'Donation for Civic Centre Project',
    creditAmount: 250000,
    debitAmount: null,
    approvalCode: 'ADM-20#8 12-L06W4 1V',
    date: 'Apr 05, 2025',
    type: 'credit',
    status: 'approved'
  },
  {
    id: 'txn-6',
    serialNumber: 6,
    description: 'Support Received - Infrastructure',
    creditAmount: 150000,
    debitAmount: null,
    approvalCode: 'ADM-21#4 19-N08Y7 3X',
    date: 'Apr 18, 2025',
    type: 'credit',
    status: 'approved'
  }
];

export const mockAccountBalance: AccountBalance = {
  totalCredit: 970000,
  totalDebit: 450000,
  availableBalance: 520000
};

// Mock data for indebtedness items
export const mockIndebtednessItems: IndebtednessItem[] = [
  {
    id: '1',
    name: 'Membership Registration Fees',
    amount: 120000,
    penaltyPercentage: 20,
    totalWithPenalty: 144000,
  },
  {
    id: '2',
    name: 'General Annual Dues & Levies',
    amount: 360000,
    penaltyPercentage: 20,
    totalWithPenalty: 432000,
  },
  {
    id: '3',
    name: 'Cultural Events Levies',
    amount: 300000,
    penaltyPercentage: 20,
    totalWithPenalty: 360000,
  },
  {
    id: '4',
    name: 'Annual Membership Fee',
    amount: 150000,
    penaltyPercentage: 20,
    totalWithPenalty: 180000,
  },
  {
    id: '5',
    name: 'Donation/Civic Centre Project',
    amount: 300000,
    penaltyPercentage: 20,
    totalWithPenalty: 360000,
  },
  {
    id: '6',
    name: 'Fine Imposed/Details Here',
    amount: 350000,
    penaltyPercentage: 20,
    totalWithPenalty: 420000,
  },
  {
    id: '7',
    name: 'Other Unclassified Fees',
    amount: 400000,
    penaltyPercentage: 20,
    totalWithPenalty: 480000,
  },
  {
    id: '8',
    name: 'Special Contributions',
    amount: 250000,
    penaltyPercentage: 20,
    totalWithPenalty: 300000,
  },
];

// Penalty tiers for activities
export const penaltyTiers: PenaltyTier[] = [
  { threshold: '<60%', percentage: 60, amount: 100000 },
  { threshold: '<50%', percentage: 50, amount: 150000 },
  { threshold: '<40%', percentage: 40, amount: 200000 },
  { threshold: '<30%', percentage: 30, amount: 250000 },
  { threshold: '<20%', percentage: 20, amount: 300000 },
  { threshold: '<10%', percentage: 10, amount: 350000 },
  { threshold: '<5%', percentage: 5, amount: 400000 },
  { threshold: '<3%', percentage: 3, amount: 450000 },
  { threshold: '<0%', percentage: 0, amount: 500000 },
];

// Mock data for activity attendance
export const mockActivityAttendance: ActivityAttendance[] = [
  {
    category: 'meetings',
    title: 'General Meetings',
    period: '36 months',
    attendancePercentage: 75,
    penaltyAmount: 0,
  },
  {
    category: 'meetings',
    title: 'Executive Meetings',
    period: '36 months',
    attendancePercentage: 65,
    penaltyAmount: 0,
  },
  {
    category: 'events',
    title: 'Cultural Events',
    period: '36 months',
    attendancePercentage: 55,
    penaltyAmount: 150000,
  },
  {
    category: 'events',
    title: 'Public Functions',
    period: '36 months',
    attendancePercentage: 70,
    penaltyAmount: 0,
  },
  {
    category: 'invitations',
    title: 'Social Invitations',
    period: '36 months',
    attendancePercentage: 45,
    penaltyAmount: 200000,
  },
];
