// Election Settings - Configurable by Community Admin
export interface ElectionSettings {
  voteChangeTimeframeMinutes: number; // Default: 5 minutes
  allowVoteChange: boolean;
  showVoteChangeCountdown: boolean;
}

export const defaultElectionSettings: ElectionSettings = {
  voteChangeTimeframeMinutes: 30,
  allowVoteChange: true,
  showVoteChangeCountdown: true
};

// Election Office (position being voted for)
export interface ElectionOffice {
  id: string;
  name: string;
  shortCode: string; // e.g., "PG" for President General
  totalAccreditedVoters: number;
  votedCount?: number; // Number of people who have voted for this office
  candidates: ElectionCandidate[];
  adminRemark?: string; // Admin message/insight about this election position
}

// Candidate running for an office
export interface ElectionCandidate {
  id: string;
  name: string;
  avatar?: string;
  officeId: string;
  votes: number;
  losses: number;
  vct: number; // Vote Count Total
  color: 'green' | 'purple' | 'magenta' | 'orange' | 'blue';
  // Campaign manifesto fields
  manifesto?: string;
  campaignSlogan?: string;
  campaignImage?: string;
  keyPriorities?: string[];
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
  memberId: string;
  candidateName: string;
  office: string;
  votes: number;
  percentage: number;
  image: string;
  announcedAt: Date;
  electionName: string;
  electionType: 'general' | 'emergency' | 'by-election';
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

// Mock Candidates - President General with FULL NAMES
export const mockCandidates: ElectionCandidate[] = [
  {
    id: "cand-1",
    name: "Paulson Chinedu Okonkwo",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    officeId: "office-1",
    votes: 527,
    losses: 473,
    vct: 145,
    color: "green",
    campaignSlogan: "Building a stronger, more united community together",
    manifesto: "As your President General, I am committed to leading with transparency, accountability, and a deep respect for our community values.\n\nMy vision is to create a more inclusive and prosperous community where every member has a voice and an opportunity to contribute. I will work tirelessly to improve communication channels, ensuring that every member is informed and engaged in our collective decisions.\n\nI pledge to implement monthly town hall meetings, establish clear financial reporting systems, and create new initiatives that will strengthen our bonds as a community.",
    keyPriorities: [
      "Transparent governance and financial accountability",
      "Monthly town hall meetings for community engagement",
      "Improved communication channels and member outreach",
      "Development of community infrastructure projects",
      "Youth empowerment and mentorship programs"
    ]
  },
  {
    id: "cand-2",
    name: "Jerome Ifeanyi Adebayo",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    officeId: "office-1",
    votes: 316,
    losses: 684,
    vct: 114,
    color: "purple",
    campaignSlogan: "Innovation and progress for all members",
    manifesto: "The future of our community depends on our ability to adapt and innovate. As President General, I will bring fresh ideas and modern approaches to our governance.\n\nI believe in leveraging technology to improve our operations, from digital payment systems to online voting platforms. My goal is to make our community more efficient, accessible, and forward-thinking.\n\nTogether, we can embrace change while honoring our traditions, creating a community that is both rooted in our heritage and ready for the future.",
    keyPriorities: [
      "Digital transformation of community processes",
      "Technology-enabled member services",
      "Online voting and participation platforms",
      "Modern financial management systems",
      "Innovation hubs for community entrepreneurs"
    ]
  },
  {
    id: "cand-3",
    name: "Jude Emeka Nwosu",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    officeId: "office-1",
    votes: 209,
    losses: 791,
    vct: 62,
    color: "magenta",
    campaignSlogan: "Tradition meets tomorrow - preserving our values while moving forward",
    manifesto: "Our community's strength lies in our rich heritage and the values that have guided us for generations. As President General, I will ensure that we preserve these traditions while preparing for the challenges of tomorrow.\n\nI am committed to strengthening the bonds between our elders and youth, creating mentorship programs that pass on our cultural knowledge while embracing new opportunities.\n\nMy administration will focus on cultural preservation, community welfare, and sustainable development that respects our past while building our future.",
    keyPriorities: [
      "Cultural preservation and heritage programs",
      "Intergenerational mentorship initiatives",
      "Community welfare and support systems",
      "Sustainable development projects",
      "Strong elder-youth collaboration programs"
    ]
  }
];

// Mock Election Office - President General
export const mockElectionOffice: ElectionOffice = {
  id: "office-1",
  name: "President General",
  shortCode: "PG",
  totalAccreditedVoters: 1200,
  votedCount: 320,
  candidates: mockCandidates,
  adminRemark: "Dear Members,\n\nThis is a crucial election for our community. The President General is the highest office and requires your careful consideration.\n\nPlease take time to review each candidate's manifesto before casting your vote. Your vote is your voice - exercise it wisely.\n\nRemember, if you don't vote, you forfeit your right to criticize any decisions made by the elected leadership. Let's all participate actively in shaping our community's future.\n\n— Community Administration"
};

// Vice President Office with FULL NAMES
export const mockVicePresidentOffice: ElectionOffice = {
  id: "office-2",
  name: "Vice President",
  shortCode: "VP",
  totalAccreditedVoters: 1200,
  votedCount: 285,
  candidates: [
    { 
      id: "vp-cand-1", 
      name: "Grace Adaeze Okafor", 
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
      officeId: "office-2",
      votes: 412, 
      losses: 588, 
      vct: 98, 
      color: "blue",
      campaignSlogan: "Service with compassion and dedication",
      manifesto: "As Vice President, I will support the President General in executing our community vision while ensuring that every member's voice is heard. I bring experience in community organization and a deep commitment to our collective wellbeing.",
      keyPriorities: ["Member welfare programs", "Community event coordination", "Conflict resolution", "Women empowerment initiatives"]
    },
    { 
      id: "vp-cand-2", 
      name: "Emmanuel Chukwuemeka Ibe", 
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      officeId: "office-2",
      votes: 389, 
      losses: 611, 
      vct: 87, 
      color: "orange",
      campaignSlogan: "Together we achieve more",
      manifesto: "My approach to leadership is collaborative and inclusive. As Vice President, I will bridge the gap between leadership and members, ensuring smooth communication and effective implementation of community projects.",
      keyPriorities: ["Collaborative governance", "Project implementation", "Member engagement", "Strategic planning"]
    },
    { 
      id: "vp-cand-3", 
      name: "Patricia Ngozi Udeh", 
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      officeId: "office-2",
      votes: 287, 
      losses: 713, 
      vct: 65, 
      color: "green",
      campaignSlogan: "Leading with integrity and purpose",
      manifesto: "I believe in servant leadership. As your Vice President, I will work diligently to support our community goals, foster unity, and ensure that our administration remains accountable to every member.",
      keyPriorities: ["Transparency in governance", "Community unity initiatives", "Leadership development", "Accountability measures"]
    }
  ],
  adminRemark: "The Vice President works closely with the President General and represents the community in their absence.\n\nThis role requires someone with excellent interpersonal skills and a collaborative spirit. Consider which candidate best demonstrates these qualities.\n\n— Community Administration"
};

// Secretary Office with FULL NAMES
export const mockSecretaryOffice: ElectionOffice = {
  id: "office-3",
  name: "Secretary",
  shortCode: "SEC",
  totalAccreditedVoters: 1200,
  votedCount: 312,
  candidates: [
    { 
      id: "sec-cand-1", 
      name: "Daniel Obiora Chibueze", 
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      officeId: "office-3",
      votes: 523, 
      losses: 477, 
      vct: 132, 
      color: "purple",
      campaignSlogan: "Accuracy, efficiency, and dedication to duty",
      manifesto: "As Secretary, I will maintain impeccable records, ensure timely communication, and keep our community informed of all activities and decisions. My organizational skills and attention to detail will serve our community well.",
      keyPriorities: ["Accurate record keeping", "Timely meeting minutes", "Efficient communication systems", "Digital documentation"]
    },
    { 
      id: "sec-cand-2", 
      name: "Monica Nneka Obi", 
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      officeId: "office-3",
      votes: 478, 
      losses: 522, 
      vct: 118, 
      color: "magenta",
      campaignSlogan: "Your voice, documented and heard",
      manifesto: "I am passionate about documentation and communication. As Secretary, I will ensure that every meeting is well-documented, every decision is properly recorded, and every member has access to important community information.",
      keyPriorities: ["Comprehensive documentation", "Member communication", "Archive digitization", "Transparent reporting"]
    }
  ],
  adminRemark: "The Secretary is responsible for all community records, meeting minutes, and official correspondence.\n\nThis position requires someone with excellent organizational skills and attention to detail. Vote for the candidate you trust to keep our records accurate and up-to-date.\n\n— Community Administration"
};

// Treasurer Office with FULL NAMES
export const mockTreasurerOffice: ElectionOffice = {
  id: "office-4",
  name: "Treasurer",
  shortCode: "TRS",
  totalAccreditedVoters: 1200,
  votedCount: 298,
  candidates: [
    { 
      id: "trs-cand-1", 
      name: "Benjamin Uchenna Okoro", 
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
      officeId: "office-4",
      votes: 567, 
      losses: 433, 
      vct: 145, 
      color: "green",
      campaignSlogan: "Financial integrity you can trust",
      manifesto: "As Treasurer, I will manage our community's finances with the highest level of integrity and transparency. I bring years of financial management experience and a commitment to accountability that will ensure every naira is well spent.",
      keyPriorities: ["Transparent financial reporting", "Budget optimization", "Investment growth", "Member contribution tracking"]
    },
    { 
      id: "trs-cand-2", 
      name: "Victoria Chiamaka Eze", 
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      officeId: "office-4",
      votes: 401, 
      losses: 599, 
      vct: 95, 
      color: "blue",
      campaignSlogan: "Smart money management for our future",
      manifesto: "I believe in strategic financial planning. As Treasurer, I will implement modern accounting practices, create investment opportunities, and ensure our community's financial security for generations to come.",
      keyPriorities: ["Strategic financial planning", "Modern accounting systems", "Investment diversification", "Financial education"]
    },
    { 
      id: "trs-cand-3", 
      name: "Kenneth Obinna Nwachukwu", 
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      officeId: "office-4",
      votes: 298, 
      losses: 702, 
      vct: 72, 
      color: "orange",
      campaignSlogan: "Every kobo accounted for",
      manifesto: "Fiscal responsibility is my watchword. As Treasurer, I will ensure meticulous record-keeping, regular financial audits, and complete transparency in all financial matters. Our community deserves nothing less.",
      keyPriorities: ["Meticulous record keeping", "Regular financial audits", "Cost efficiency", "Quarterly financial reports"]
    }
  ],
  adminRemark: "The Treasurer manages all community funds and financial transactions.\n\nThis is a position of great trust and responsibility. Choose wisely - the person you elect will be responsible for managing our collective resources and ensuring financial accountability.\n\n— Community Administration"
};

// Financial Secretary Office with FULL NAMES
export const mockFinSecOffice: ElectionOffice = {
  id: "office-5",
  name: "Financial Secretary",
  shortCode: "FS",
  totalAccreditedVoters: 1200,
  votedCount: 275,
  candidates: [
    { 
      id: "fs-cand-1", 
      name: "Anthony Chijioke Oguike", 
      avatar: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=150&h=150&fit=crop&crop=face",
      officeId: "office-5", 
      votes: 489, 
      losses: 511, 
      vct: 112, 
      color: "purple",
      campaignSlogan: "Precision in every transaction",
      manifesto: "As Financial Secretary, I will maintain accurate financial records, track all contributions, and provide timely financial statements. My attention to detail and commitment to accuracy will ensure our finances are always in order.",
      keyPriorities: ["Accurate contribution records", "Timely financial statements", "Member account management", "Payment processing efficiency"]
    },
    { 
      id: "fs-cand-2", 
      name: "Rebecca Chidinma Anyanwu", 
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      officeId: "office-5", 
      votes: 445, 
      losses: 555, 
      vct: 98, 
      color: "magenta",
      campaignSlogan: "Organized finances, stronger community",
      manifesto: "I am passionate about financial organization and member service. As Financial Secretary, I will implement efficient systems for tracking contributions, issuing receipts, and maintaining financial records that serve our community's needs.",
      keyPriorities: ["Efficient record systems", "Digital payment solutions", "Receipt management", "Member financial support"]
    }
  ],
  adminRemark: "The Financial Secretary works alongside the Treasurer to maintain financial records and track member contributions.\n\nThis role requires meticulous attention to detail and excellent organizational skills. Your vote will determine who handles the day-to-day financial documentation of our community.\n\n— Community Administration"
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
    name: "Emergency VP Election",
    date: new Date("2023-07-20"),
    type: "Emergency Election",
    winner: "Lisa Anderson",
    totalVotes: 921
  }
];

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: "campaign-1",
    candidateId: "cand-1",
    candidateName: "Paulson Chinedu Okonkwo",
    office: "President General",
    description: "A campaign focused on transparency and community development.",
    manifesto: "As your President General, I am committed to leading with transparency, accountability, and a deep respect for our community values. My vision is to create a more inclusive and prosperous community where every member has a voice.",
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-03-14"),
    status: "active"
  },
  {
    id: "campaign-2",
    candidateId: "cand-2",
    candidateName: "Jerome Ifeanyi Adebayo",
    office: "President General",
    description: "Innovation and digital transformation for our community's future.",
    manifesto: "The future of our community depends on our ability to adapt and innovate. I believe in leveraging technology to improve our operations and make our community more efficient and accessible.",
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-03-14"),
    status: "active"
  },
  {
    id: "campaign-3",
    candidateId: "vp-cand-1",
    candidateName: "Grace Adaeze Okafor",
    office: "Vice President",
    description: "Dedicated to member welfare and community service.",
    manifesto: "As Vice President, I will support the President General while ensuring every member's voice is heard. My focus will be on welfare programs and conflict resolution.",
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-03-14"),
    status: "active"
  }
];

// Mock Election Winners - Comprehensive list with photos
export const mockElectionWinners: ElectionWinner[] = [
  // 2025 General Election Winners
  {
    id: "winner-1",
    memberId: "member-1",
    candidateName: "Paulson Chinedu Okonkwo",
    office: "President General",
    votes: 527,
    percentage: 50.1,
    image: "/src/assets/profile-james-wilson.jpg",
    announcedAt: new Date("2025-03-15T18:00:00"),
    electionName: "2025 General Election",
    electionType: "general"
  },
  {
    id: "winner-2",
    memberId: "member-2",
    candidateName: "Grace Adaeze Okafor",
    office: "Vice President",
    votes: 412,
    percentage: 37.8,
    image: "/src/assets/profile-sarah-johnson.jpg",
    announcedAt: new Date("2025-03-15T18:15:00"),
    electionName: "2025 General Election",
    electionType: "general"
  },
  {
    id: "winner-3",
    memberId: "member-3",
    candidateName: "Daniel Obiora Chibueze",
    office: "Secretary",
    votes: 523,
    percentage: 52.2,
    image: "/src/assets/profile-michael-chen.jpg",
    announcedAt: new Date("2025-03-15T18:30:00"),
    electionName: "2025 General Election",
    electionType: "general"
  },
  {
    id: "winner-4",
    memberId: "member-4",
    candidateName: "Benjamin Uchenna Okoro",
    office: "Treasurer",
    votes: 567,
    percentage: 44.8,
    image: "/src/assets/profile-robert-brown.jpg",
    announcedAt: new Date("2025-03-15T18:45:00"),
    electionName: "2025 General Election",
    electionType: "general"
  },
  {
    id: "winner-5",
    memberId: "member-5",
    candidateName: "Anthony Chijioke Oguike",
    office: "Financial Secretary",
    votes: 489,
    percentage: 52.4,
    image: "/src/assets/profile-david-martinez.jpg",
    announcedAt: new Date("2025-03-15T19:00:00"),
    electionName: "2025 General Election",
    electionType: "general"
  },
  // 2024 General Election Winners
  {
    id: "winner-6",
    memberId: "member-6",
    candidateName: "John Doe",
    office: "President General",
    votes: 612,
    percentage: 52.9,
    image: "/src/assets/profile-photo.jpg",
    announcedAt: new Date("2024-03-15T18:00:00"),
    electionName: "2024 General Election",
    electionType: "general"
  },
  {
    id: "winner-7",
    memberId: "member-7",
    candidateName: "Jennifer Taylor",
    office: "Vice President",
    votes: 478,
    percentage: 41.3,
    image: "/src/assets/profile-jennifer-taylor.jpg",
    announcedAt: new Date("2024-03-15T18:15:00"),
    electionName: "2024 General Election",
    electionType: "general"
  },
  {
    id: "winner-8",
    memberId: "member-8",
    candidateName: "Emily Davis",
    office: "Secretary",
    votes: 534,
    percentage: 46.2,
    image: "/src/assets/profile-emily-davis.jpg",
    announcedAt: new Date("2024-03-15T18:30:00"),
    electionName: "2024 General Election",
    electionType: "general"
  },
  // 2024 Emergency Election Winner
  {
    id: "winner-9",
    memberId: "member-9",
    candidateName: "Jane Smith",
    office: "Secretary",
    votes: 445,
    percentage: 49.9,
    image: "/src/assets/profile-lisa-anderson.jpg",
    announcedAt: new Date("2024-09-22T17:00:00"),
    electionName: "2024 Emergency Secretary Election",
    electionType: "emergency"
  },
  // 2024 By-Election Winner
  {
    id: "winner-10",
    memberId: "member-10",
    candidateName: "Robert Brown",
    office: "Treasurer",
    votes: 372,
    percentage: 49.9,
    image: "/src/assets/profile-robert-brown.jpg",
    announcedAt: new Date("2024-06-10T16:30:00"),
    electionName: "2024 By-Election Treasurer",
    electionType: "by-election"
  },
  // 2023 General Election Winners
  {
    id: "winner-11",
    memberId: "member-11",
    candidateName: "David Martinez",
    office: "President General",
    votes: 589,
    percentage: 57.0,
    image: "/src/assets/profile-david-martinez.jpg",
    announcedAt: new Date("2023-03-15T18:00:00"),
    electionName: "2023 General Election",
    electionType: "general"
  },
  {
    id: "winner-12",
    memberId: "member-12",
    candidateName: "Lisa Anderson",
    office: "Vice President",
    votes: 461,
    percentage: 50.1,
    image: "/src/assets/profile-lisa-anderson.jpg",
    announcedAt: new Date("2023-07-20T17:30:00"),
    electionName: "2023 Emergency VP Election",
    electionType: "emergency"
  }
];

// Mock Accredited Voters
export const mockAccreditedVoters: AccreditedVoter[] = [
  {
    id: "av-1",
    name: "Mark Anthony Orji",
    avatar: "/src/assets/profile-photo.jpg",
    dateAccredited: "2025-03-10",
    status: "valid",
    membershipId: "MEM-2024/001"
  },
  {
    id: "av-2",
    name: "Theodore Ike Nwannunu",
    avatar: "/src/assets/profile-james-wilson.jpg",
    dateAccredited: "2025-03-10",
    status: "valid",
    membershipId: "MEM-2024/002"
  },
  {
    id: "av-3",
    name: "Sarah Johnson",
    avatar: "/src/assets/profile-sarah-johnson.jpg",
    dateAccredited: "2025-03-11",
    status: "valid",
    membershipId: "MEM-2024/003"
  },
  {
    id: "av-4",
    name: "Michael Chen",
    avatar: "/src/assets/profile-michael-chen.jpg",
    dateAccredited: "2025-03-11",
    status: "valid",
    membershipId: "MEM-2024/004"
  },
  {
    id: "av-5",
    name: "Emily Davis",
    avatar: "/src/assets/profile-emily-davis.jpg",
    dateAccredited: "2025-03-12",
    status: "valid",
    membershipId: "MEM-2024/005"
  },
  {
    id: "av-6",
    name: "Robert Brown",
    avatar: "/src/assets/profile-robert-brown.jpg",
    dateAccredited: "2025-03-12",
    status: "invalid",
    membershipId: "MEM-2024/006"
  },
  {
    id: "av-7",
    name: "Jennifer Taylor",
    avatar: "/src/assets/profile-jennifer-taylor.jpg",
    dateAccredited: "2025-03-12",
    status: "valid",
    membershipId: "MEM-2024/007"
  },
  {
    id: "av-8",
    name: "David Martinez",
    avatar: "/src/assets/profile-david-martinez.jpg",
    dateAccredited: "2025-03-13",
    status: "valid",
    membershipId: "MEM-2024/008"
  }
];

// Alias for backward compatibility
export const mockWinners = mockElectionWinners;
