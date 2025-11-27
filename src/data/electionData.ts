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

// Mock Election Office
export const mockElectionOffice: ElectionOffice = {
  id: "office-1",
  name: "President General",
  shortCode: "PG",
  totalAccreditedVoters: 1200,
  candidates: mockCandidates
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
  offices: [mockElectionOffice],
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
