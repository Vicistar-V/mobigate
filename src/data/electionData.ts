// Election Office (position being voted for)
export interface ElectionOffice {
  id: string;
  name: string;
  shortCode: string; // e.g., "PG" for President General
  totalAccreditedVoters: number;
  candidates: ElectionCandidate[];
}

// Candidate running for an office
export interface ElectionCandidate {
  id: string;
  name: string;
  officeId: string;
  votes: number;
  losses: number;
  vct: number; // Vote Count Total
  color: 'green' | 'purple' | 'magenta' | 'orange' | 'blue';
}

// Individual vote record
export interface VoteRecord {
  id: string;
  voterId: string;
  voterName: string;
  voterRegistration: string; // e.g., "VR-2025/2865219"
  isAnonymous: boolean;
  gender: 'male' | 'female';
  officeId: string;
  votes: CandidateVote[]; // Votes distributed across candidates
}

export interface CandidateVote {
  candidateId: string;
  vote: number;
  loss: number;
  vct: number;
}

// Election event
export interface Election {
  id: string;
  name: string;
  type: 'general' | 'emergency' | 'by-election';
  date: Date;
  status: 'upcoming' | 'active' | 'completed';
  offices: ElectionOffice[];
  totalVoters: number;
  votesCast: number;
}

// Election chat message
export interface ElectionChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  avatar: string;
  content: string;
  timestamp: Date;
}

// Previous election result summary
export interface PreviousElection {
  id: string;
  name: string;
  date: Date;
  type: string;
  winner?: string;
  totalVotes?: number;
}

// Campaign
export interface Campaign {
  id: string;
  candidateId: string;
  candidateName: string;
  office: string;
  description: string;
  manifesto: string;
  image?: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed';
}

// Winner
export interface ElectionWinner {
  id: string;
  candidateName: string;
  office: string;
  votes: number;
  percentage: number;
  image?: string;
  announcedAt: Date;
}

// Accredited Voter
export interface AccreditedVoter {
  id: string;
  name: string;
  avatar: string;
  dateAccredited: string;
  status: 'valid' | 'invalid';
  membershipId: string;
}

// Mock Candidates
export const mockCandidates: ElectionCandidate[] = [
  {
    id: "cand-1",
    name: "Paulson",
    officeId: "office-1",
    votes: 527,
    losses: 473,
    vct: 145,
    color: "green"
  },
  {
    id: "cand-2",
    name: "Jerome",
    officeId: "office-1",
    votes: 316,
    losses: 684,
    vct: 114,
    color: "purple"
  },
  {
    id: "cand-3",
    name: "Jude",
    officeId: "office-1",
    votes: 209,
    losses: 791,
    vct: 62,
    color: "magenta"
  }
];

// Mock Election Office - President General
export const mockElectionOffice: ElectionOffice = {
  id: "office-1",
  name: "President General",
  shortCode: "PG",
  totalAccreditedVoters: 1200,
  candidates: mockCandidates
};

// Vice President Office
export const mockVicePresidentOffice: ElectionOffice = {
  id: "office-2",
  name: "Vice President",
  shortCode: "VP",
  totalAccreditedVoters: 1200,
  candidates: [
    { id: "vp-cand-1", name: "Grace", officeId: "office-2", votes: 412, losses: 588, vct: 98, color: "blue" },
    { id: "vp-cand-2", name: "Emmanuel", officeId: "office-2", votes: 389, losses: 611, vct: 87, color: "orange" },
    { id: "vp-cand-3", name: "Patricia", officeId: "office-2", votes: 287, losses: 713, vct: 65, color: "green" }
  ]
};

// Secretary Office
export const mockSecretaryOffice: ElectionOffice = {
  id: "office-3",
  name: "Secretary",
  shortCode: "SEC",
  totalAccreditedVoters: 1200,
  candidates: [
    { id: "sec-cand-1", name: "Daniel", officeId: "office-3", votes: 523, losses: 477, vct: 132, color: "purple" },
    { id: "sec-cand-2", name: "Monica", officeId: "office-3", votes: 478, losses: 522, vct: 118, color: "magenta" }
  ]
};

// Treasurer Office
export const mockTreasurerOffice: ElectionOffice = {
  id: "office-4",
  name: "Treasurer",
  shortCode: "TRS",
  totalAccreditedVoters: 1200,
  candidates: [
    { id: "trs-cand-1", name: "Benjamin", officeId: "office-4", votes: 567, losses: 433, vct: 145, color: "green" },
    { id: "trs-cand-2", name: "Victoria", officeId: "office-4", votes: 401, losses: 599, vct: 95, color: "blue" },
    { id: "trs-cand-3", name: "Kenneth", officeId: "office-4", votes: 298, losses: 702, vct: 72, color: "orange" }
  ]
};

// Financial Secretary Office
export const mockFinSecOffice: ElectionOffice = {
  id: "office-5",
  name: "Financial Secretary",
  shortCode: "FS",
  totalAccreditedVoters: 1200,
  candidates: [
    { id: "fs-cand-1", name: "Anthony", officeId: "office-5", votes: 489, losses: 511, vct: 112, color: "purple" },
    { id: "fs-cand-2", name: "Rebecca", officeId: "office-5", votes: 445, losses: 555, vct: 98, color: "magenta" }
  ]
};

// Mock Vote Records
export const mockVoteRecords: VoteRecord[] = [
  {
    id: "vote-1",
    voterId: "voter-1",
    voterName: "Mark Anthony Orji",
    voterRegistration: "VR-2025/2865219",
    isAnonymous: false,
    gender: "male",
    officeId: "office-1",
    votes: [
      { candidateId: "cand-1", vote: 1, loss: 0, vct: 4 },
      { candidateId: "cand-2", vote: 0, loss: 0, vct: 1 },
      { candidateId: "cand-3", vote: 0, loss: 0, vct: 2 }
    ]
  },
  {
    id: "vote-2",
    voterId: "voter-2",
    voterName: "Theodore Ike Nwannunu",
    voterRegistration: "VR-2025/2865220",
    isAnonymous: false,
    gender: "male",
    officeId: "office-1",
    votes: [
      { candidateId: "cand-1", vote: 0, loss: 0, vct: 1 },
      { candidateId: "cand-2", vote: 1, loss: 0, vct: 1 },
      { candidateId: "cand-3", vote: 0, loss: 0, vct: 2 }
    ]
  },
  {
    id: "vote-3",
    voterId: "anonymous",
    voterName: "Anonymous Voter",
    voterRegistration: "VR-2025/ANON",
    isAnonymous: true,
    gender: "female",
    officeId: "office-1",
    votes: [
      { candidateId: "cand-1", vote: 1, loss: 0, vct: 0 },
      { candidateId: "cand-2", vote: 0, loss: 0, vct: 1 },
      { candidateId: "cand-3", vote: 0, loss: 0, vct: 2 }
    ]
  },
  {
    id: "vote-4",
    voterId: "voter-4",
    voterName: "Sarah Johnson",
    voterRegistration: "VR-2025/2865221",
    isAnonymous: false,
    gender: "female",
    officeId: "office-1",
    votes: [
      { candidateId: "cand-1", vote: 0, loss: 1, vct: 3 },
      { candidateId: "cand-2", vote: 1, loss: 0, vct: 2 },
      { candidateId: "cand-3", vote: 0, loss: 0, vct: 1 }
    ]
  },
  {
    id: "vote-5",
    voterId: "voter-5",
    voterName: "Michael Chen",
    voterRegistration: "VR-2025/2865222",
    isAnonymous: false,
    gender: "male",
    officeId: "office-1",
    votes: [
      { candidateId: "cand-1", vote: 1, loss: 0, vct: 5 },
      { candidateId: "cand-2", vote: 0, loss: 1, vct: 0 },
      { candidateId: "cand-3", vote: 0, loss: 0, vct: 3 }
    ]
  }
];

// Mock Election
export const mockElection: Election = {
  id: "election-1",
  name: "2025 General Election",
  type: "general",
  date: new Date("2025-03-15"),
  status: "active",
  offices: [
    mockElectionOffice,
    mockVicePresidentOffice,
    mockSecretaryOffice,
    mockTreasurerOffice,
    mockFinSecOffice
  ],
  totalVoters: 1200,
  votesCast: 847
};

// Mock Election Chat Messages
export const mockElectionChatMessages: ElectionChatMessage[] = [
  {
    id: "chat-1",
    senderId: "user-1",
    senderName: "James Wilson",
    avatar: "/src/assets/profile-james-wilson.jpg",
    content: "I believe we should vote based on merit and experience. Let's make informed decisions!",
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: "chat-2",
    senderId: "user-2",
    senderName: "Sarah Johnson",
    avatar: "/src/assets/profile-sarah-johnson.jpg",
    content: "Excited to participate in this democratic process. Every vote counts!",
    timestamp: new Date(Date.now() - 3000000)
  },
  {
    id: "chat-3",
    senderId: "user-3",
    senderName: "Michael Chen",
    avatar: "/src/assets/profile-michael-chen.jpg",
    content: "Remember to review each candidate's manifesto before voting.",
    timestamp: new Date(Date.now() - 1800000)
  },
  {
    id: "chat-4",
    senderId: "user-4",
    senderName: "Emily Davis",
    avatar: "/src/assets/profile-emily-davis.jpg",
    content: "The anonymous voting option is a great feature for privacy!",
    timestamp: new Date(Date.now() - 900000)
  }
];

// Mock Previous Elections
export const mockPreviousElections: PreviousElection[] = [
  {
    id: "prev-1",
    name: "General Election 2024",
    date: new Date("2024-03-15"),
    type: "General Election",
    winner: "John Doe",
    totalVotes: 1156
  },
  {
    id: "prev-2",
    name: "Emergency Secretary Election",
    date: new Date("2024-09-22"),
    type: "Emergency Election",
    winner: "Jane Smith",
    totalVotes: 892
  },
  {
    id: "prev-3",
    name: "By-Election Treasurer",
    date: new Date("2024-06-10"),
    type: "By-Election",
    winner: "Robert Brown",
    totalVotes: 745
  },
  {
    id: "prev-4",
    name: "General Election 2023",
    date: new Date("2023-03-15"),
    type: "General Election",
    winner: "David Martinez",
    totalVotes: 1034
  },
  {
    id: "prev-5",
    name: "Vice President Election 2023",
    date: new Date("2023-08-18"),
    type: "Special Election",
    winner: "Lisa Anderson",
    totalVotes: 678
  },
  {
    id: "prev-6",
    name: "General Election 2022",
    date: new Date("2022-03-15"),
    type: "General Election",
    winner: "Jennifer Taylor",
    totalVotes: 923
  },
  {
    id: "prev-7",
    name: "Secretary By-Election 2022",
    date: new Date("2022-11-05"),
    type: "By-Election",
    winner: "Theodore Nwannunu",
    totalVotes: 567
  }
];

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: "camp-1",
    candidateId: "cand-1",
    candidateName: "Paulson",
    office: "President General",
    description: "Building a stronger, more united community together",
    manifesto: "Focus on transparency, accountability, and community development. Will implement monthly town halls and improve communication channels.",
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-03-14"),
    status: "active"
  },
  {
    id: "camp-2",
    candidateId: "cand-2",
    candidateName: "Jerome",
    office: "President General",
    description: "Innovation and progress for all members",
    manifesto: "Modernize our processes, embrace technology, and create more opportunities for member engagement and growth.",
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-03-14"),
    status: "active"
  },
  {
    id: "camp-3",
    candidateId: "cand-3",
    candidateName: "Jude",
    office: "President General",
    description: "Tradition meets tomorrow - preserving our values while moving forward",
    manifesto: "Balance our rich heritage with modern needs. Strengthen community bonds while expanding our reach and impact.",
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-03-14"),
    status: "active"
  }
];

// Mock Winners
export const mockWinners: ElectionWinner[] = [
  {
    id: "winner-1",
    candidateName: "Paulson",
    office: "President General",
    votes: 527,
    percentage: 43.9,
    announcedAt: new Date("2025-03-15T18:00:00")
  }
];

// Mock Accredited Voters
export const mockAccreditedVoters: AccreditedVoter[] = [
  {
    id: "av-1",
    name: "Mark Anthony Orji",
    avatar: "/src/assets/profile-james-wilson.jpg",
    dateAccredited: "2025-02-15",
    status: "valid",
    membershipId: "MEM-2024/001234"
  },
  {
    id: "av-2",
    name: "Theodore Ike Nwannunu",
    avatar: "/src/assets/profile-michael-chen.jpg",
    dateAccredited: "2025-02-14",
    status: "valid",
    membershipId: "MEM-2024/001235"
  },
  {
    id: "av-3",
    name: "Sarah Johnson",
    avatar: "/src/assets/profile-sarah-johnson.jpg",
    dateAccredited: "2025-02-13",
    status: "valid",
    membershipId: "MEM-2024/001236"
  },
  {
    id: "av-4",
    name: "Michael Chen",
    avatar: "/src/assets/profile-michael-chen.jpg",
    dateAccredited: "2025-02-12",
    status: "valid",
    membershipId: "MEM-2024/001237"
  },
  {
    id: "av-5",
    name: "Emily Davis",
    avatar: "/src/assets/profile-emily-davis.jpg",
    dateAccredited: "2025-02-11",
    status: "valid",
    membershipId: "MEM-2024/001238"
  },
  {
    id: "av-6",
    name: "James Wilson",
    avatar: "/src/assets/profile-james-wilson.jpg",
    dateAccredited: "2025-02-10",
    status: "valid",
    membershipId: "MEM-2024/001239"
  },
  {
    id: "av-7",
    name: "Lisa Anderson",
    avatar: "/src/assets/profile-lisa-anderson.jpg",
    dateAccredited: "2024-03-15",
    status: "invalid",
    membershipId: "MEM-2023/000891"
  },
  {
    id: "av-8",
    name: "Robert Brown",
    avatar: "/src/assets/profile-robert-brown.jpg",
    dateAccredited: "2024-03-14",
    status: "invalid",
    membershipId: "MEM-2023/000892"
  },
  {
    id: "av-9",
    name: "Jennifer Taylor",
    avatar: "/src/assets/profile-jennifer-taylor.jpg",
    dateAccredited: "2024-03-13",
    status: "invalid",
    membershipId: "MEM-2023/000893"
  },
  {
    id: "av-10",
    name: "David Martinez",
    avatar: "/src/assets/profile-david-martinez.jpg",
    dateAccredited: "2024-03-12",
    status: "invalid",
    membershipId: "MEM-2023/000894"
  }
];
