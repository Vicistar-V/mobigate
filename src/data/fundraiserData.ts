// FundRaiser Campaign Data

export interface CampaignMediaItem {
  id: string;
  url: string;
  type: 'photo' | 'video';
  selected?: boolean;
}

export interface DonorRecord {
  id: string;
  name: string;
  avatar?: string;
  amount: number;
  currency: 'USD' | 'NGN' | 'MOBI';
  date: string;
  isCelebrity?: boolean;
  message?: string;
}

export interface FundRaiserCampaign {
  id: string;
  idCode: string;
  convenerName: string;
  convenerAvatar?: string;
  convenerUserId: string;
  theme: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  currency: 'USD' | 'NGN' | 'MOBI';
  minimumDonation: number;
  urgencyLevel: string;
  timeFrame?: string;
  mediaItems: CampaignMediaItem[];
  audience: string[];
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  donors: DonorRecord[];
}

export interface PersonalBankDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  telephone: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  swiftCode?: string;
}

// Urgency levels from wireframe
export const urgencyLevels = [
  'Extremely Urgent',
  'Very Urgent',
  'Urgent',
  'Not Urgent But Very Important',
  'Really Important',
  'Just a Necessity',
  'Basic Need',
  'Emergency Need',
  'Other'
];

// Audience options from wireframe
export const audienceOptions = [
  { id: 'friends', label: 'FRIENDS' },
  { id: 'friends-of-friends', label: 'FRIENDS & FRIENDS OF FRIENDS' },
  { id: 'communities', label: 'MY COMMUNITIES' },
  { id: 'circles', label: 'MY CIRCLES' },
  { id: 'life-mates', label: 'MY LIFE MATES' },
  { id: 'public', label: 'PUBLIC' }
];

// Mock campaigns data
export const mockCampaigns: FundRaiserCampaign[] = [
  {
    id: '1',
    idCode: 'FR02753912549C',
    convenerName: 'Sarah Johnson',
    convenerAvatar: '/profile-sarah-johnson.jpg',
    convenerUserId: 'user-sarah',
    theme: 'Medical Emergency - Cancer Treatment',
    description: 'My mother has been diagnosed with stage 3 cancer and needs immediate treatment. The medical bills are overwhelming and we need urgent financial support for chemotherapy and medications.',
    targetAmount: 25000,
    raisedAmount: 18750,
    currency: 'USD',
    minimumDonation: 10,
    urgencyLevel: 'Extremely Urgent',
    timeFrame: '60 days',
    mediaItems: [
      { id: 'm1', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80', type: 'photo' },
      { id: 'm2', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80', type: 'photo' }
    ],
    audience: ['friends', 'public'],
    status: 'active',
    createdAt: '2025-01-15',
    donors: [
      { id: 'd1', name: 'Michael Chen', amount: 500, currency: 'USD', date: '2025-01-20', message: 'Praying for recovery' },
      { id: 'd2', name: 'Emily Davis', amount: 250, currency: 'USD', date: '2025-01-19' }
    ]
  },
  {
    id: '2',
    idCode: 'FR02753912550C',
    convenerName: 'David Martinez',
    convenerAvatar: '/profile-david-martinez.jpg',
    convenerUserId: 'user-david',
    theme: 'Business Startup Capital',
    description: 'Starting a community-based agriculture project that will create jobs for 20 young people in our town. Need funding for equipment and initial operating costs.',
    targetAmount: 15000,
    raisedAmount: 8500,
    currency: 'USD',
    minimumDonation: 50,
    urgencyLevel: 'Really Important',
    timeFrame: '90 days',
    mediaItems: [
      { id: 'm3', url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80', type: 'photo' },
      { id: 'm4', url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80', type: 'photo' }
    ],
    audience: ['communities', 'public'],
    status: 'active',
    createdAt: '2025-01-10',
    donors: [
      { id: 'd3', name: 'Robert Brown', amount: 1000, currency: 'USD', date: '2025-01-18', isCelebrity: true }
    ]
  },
  {
    id: '3',
    idCode: 'FR02753912551C',
    convenerName: 'Jennifer Taylor',
    convenerAvatar: '/profile-jennifer-taylor.jpg',
    convenerUserId: 'user-jennifer',
    theme: 'Education - University Tuition',
    description: 'Brilliant student from underprivileged background needs support to complete final year of Computer Science degree. Has maintained 3.8 GPA.',
    targetAmount: 8000,
    raisedAmount: 5200,
    currency: 'USD',
    minimumDonation: 20,
    urgencyLevel: 'Very Urgent',
    timeFrame: '45 days',
    mediaItems: [
      { id: 'm5', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', type: 'photo' }
    ],
    audience: ['friends-of-friends', 'communities', 'public'],
    status: 'active',
    createdAt: '2025-01-12',
    donors: [
      { id: 'd4', name: 'Lisa Anderson', amount: 300, currency: 'USD', date: '2025-01-17' }
    ]
  },
  {
    id: '4',
    idCode: 'FR02753912552C',
    convenerName: 'James Wilson',
    convenerAvatar: '/profile-james-wilson.jpg',
    convenerUserId: 'user-james',
    theme: 'Community Water Project',
    description: 'Our village of 500 families needs a clean water source. Raising funds to drill a borehole and install water distribution system.',
    targetAmount: 30000,
    raisedAmount: 12000,
    currency: 'USD',
    minimumDonation: 25,
    urgencyLevel: 'Basic Need',
    timeFrame: '120 days',
    mediaItems: [
      { id: 'm6', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80', type: 'photo' },
      { id: 'm7', url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80', type: 'photo' }
    ],
    audience: ['communities', 'public'],
    status: 'active',
    createdAt: '2025-01-08',
    donors: [
      { id: 'd5', name: 'Dr. Ada Okafor', amount: 2000, currency: 'USD', date: '2025-01-15', isCelebrity: true }
    ]
  },
  {
    id: '5',
    idCode: 'FR02753912553C',
    convenerName: 'Emily Davis',
    convenerAvatar: '/profile-emily-davis.jpg',
    convenerUserId: 'user-emily',
    theme: 'Emergency Home Repair',
    description: 'Elderly widow needs urgent roof repair after storm damage. Living in dangerous conditions with leaks threatening to collapse ceiling.',
    targetAmount: 5000,
    raisedAmount: 3800,
    currency: 'USD',
    minimumDonation: 15,
    urgencyLevel: 'Emergency Need',
    timeFrame: '30 days',
    mediaItems: [
      { id: 'm8', url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80', type: 'photo' }
    ],
    audience: ['friends', 'communities'],
    status: 'active',
    createdAt: '2025-01-18',
    donors: []
  }
];

// Mock celebrity donors
export const mockCelebrityDonors: DonorRecord[] = [
  {
    id: 'cd1',
    name: 'Dr. Ada Okafor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    amount: 5000,
    currency: 'USD',
    date: '2025-01-20',
    isCelebrity: true,
    message: 'Supporting communities in need is our duty'
  },
  {
    id: 'cd2',
    name: 'Chief Emeka Obi',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    amount: 10000,
    currency: 'USD',
    date: '2025-01-18',
    isCelebrity: true,
    message: 'Together we can make a difference'
  },
  {
    id: 'cd3',
    name: 'Pastor Grace Adeyemi',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    amount: 3500,
    currency: 'USD',
    date: '2025-01-15',
    isCelebrity: true,
    message: 'Blessed to be a blessing'
  },
  {
    id: 'cd4',
    name: 'Hon. Chukwuma Nwosu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    amount: 7500,
    currency: 'USD',
    date: '2025-01-12',
    isCelebrity: true
  }
];

// Currency conversion rates
// Base: Nigerian Naira (NGN) is the community currency, ₦1 = M1
export const currencyRates = {
  // Base rate: NGN to Mobi (1:1)
  NGN_TO_MOBI: 1,
  MOBI_TO_NGN: 1,
  
  // International rates (1 unit = X Mobi)
  USD_TO_MOBI: 500,      // US$1 = M500
  GBP_TO_MOBI: 550,      // £1 = M550
  CAD_TO_MOBI: 350,      // CAD$1 = M350
  EUR_TO_MOBI: 450,      // €1 = M450
  XOF_TO_MOBI: 0.9,      // CFA1 = M0.9 (CFA1000 = M900)
  
  // Reverse rates (for display)
  MOBI_TO_USD: 0.002,    // M1 = $0.002
  MOBI_TO_GBP: 0.00182,  // M1 = £0.00182
  MOBI_TO_CAD: 0.00286,  // M1 = CAD$0.00286
  MOBI_TO_EUR: 0.00222,  // M1 = €0.00222
};
