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
