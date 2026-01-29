// Admin Election Management Data Types and Mock Data

export interface AdminCampaign {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  office: string;
  status: 'draft' | 'active' | 'paused' | 'ended';
  manifesto: string;
  slogan: string;
  priorities: string[];
  startDate: Date;
  endDate: Date;
  views: number;
  endorsements: number;
  createdAt: Date;
}

export interface ClearanceDocument {
  name: string;
  status: 'submitted' | 'verified' | 'rejected' | 'missing';
  url?: string;
  submittedAt?: Date;
}

export interface AdminClearanceRequest {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  office: string;
  status: 'pending' | 'approved' | 'rejected' | 'more_info_needed';
  documents: ClearanceDocument[];
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface AdminAccreditationVoter {
  id: string;
  name: string;
  avatar: string;
  membershipId: string;
  email: string;
  financialStatus: 'clear' | 'owing' | 'pending';
  accreditationStatus: 'valid' | 'invalid' | 'pending' | 'revoked';
  dateAccredited?: Date;
  lastPaymentDate?: Date;
  amountOwing?: number;
}

export interface AdminAccreditationSettings {
  autoAccredit: boolean;
  requireFinancialClearance: boolean;
  eligibilityPeriodDays: number;
  accreditationStartDate: Date;
  accreditationEndDate: Date;
  minimumMembershipDays: number;
}

export interface ElectionWinnerResult {
  id: string;
  officeId: string;
  officeName: string;
  candidates: WinnerCandidate[];
  announced: boolean;
  announcedAt?: Date;
  announcedBy?: string;
}

export interface WinnerCandidate {
  id: string;
  name: string;
  avatar: string;
  votes: number;
  percentage: number;
  isWinner: boolean;
  isRunnerUp?: boolean; // Second place becomes Deputy/Vice automatically
}

export interface ElectionInfo {
  id: string;
  name: string;
  type: 'general' | 'emergency' | 'by-election';
  date: Date;
  status: 'upcoming' | 'active' | 'voting_completed' | 'completed';
  totalVotesCast: number;
  totalAccredited: number;
}

// Mock Data

export const mockAdminCampaigns: AdminCampaign[] = [
  {
    id: "camp-1",
    candidateId: "cand-1",
    candidateName: "Paulson Chinedu Okonkwo",
    candidateAvatar: "/placeholder.svg",
    office: "President General",
    status: "active",
    manifesto: "As your President General, I am committed to leading with transparency, accountability, and a deep respect for our community values. My vision is to create a more inclusive and prosperous community.",
    slogan: "Building a stronger, more united community together",
    priorities: [
      "Transparent governance and financial accountability",
      "Monthly town hall meetings for community engagement",
      "Improved communication channels and member outreach",
      "Development of community infrastructure projects",
      "Youth empowerment and mentorship programs"
    ],
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-03-15"),
    views: 1250,
    endorsements: 89,
    createdAt: new Date("2024-12-15")
  },
  {
    id: "camp-2",
    candidateId: "cand-2",
    candidateName: "Jerome Ifeanyi Adebayo",
    candidateAvatar: "/placeholder.svg",
    office: "President General",
    status: "active",
    manifesto: "The future of our community depends on our ability to adapt and innovate. As President General, I will bring fresh ideas and modern approaches to our governance.",
    slogan: "Innovation and progress for all members",
    priorities: [
      "Digital transformation of community processes",
      "Technology-enabled member services",
      "Online voting and participation platforms",
      "Modern financial management systems"
    ],
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-03-15"),
    views: 980,
    endorsements: 67,
    createdAt: new Date("2024-12-18")
  },
  {
    id: "camp-3",
    candidateId: "vp-cand-1",
    candidateName: "Grace Adaeze Okafor",
    candidateAvatar: "/placeholder.svg",
    office: "Vice President",
    status: "active",
    manifesto: "As Vice President, I will support the President General in executing our community vision while ensuring that every member's voice is heard.",
    slogan: "Service with compassion and dedication",
    priorities: [
      "Member welfare programs",
      "Community event coordination",
      "Conflict resolution",
      "Women empowerment initiatives"
    ],
    startDate: new Date("2025-01-05"),
    endDate: new Date("2025-03-15"),
    views: 756,
    endorsements: 45,
    createdAt: new Date("2024-12-20")
  },
  {
    id: "camp-4",
    candidateId: "sec-cand-1",
    candidateName: "Daniel Obiora Chibueze",
    candidateAvatar: "/placeholder.svg",
    office: "Secretary",
    status: "draft",
    manifesto: "As Secretary, I will maintain impeccable records, ensure timely communication, and keep our community informed of all activities and decisions.",
    slogan: "Accuracy, efficiency, and dedication to duty",
    priorities: [
      "Accurate record keeping",
      "Timely meeting minutes",
      "Efficient communication systems"
    ],
    startDate: new Date("2025-01-10"),
    endDate: new Date("2025-03-15"),
    views: 0,
    endorsements: 0,
    createdAt: new Date("2025-01-08")
  },
  {
    id: "camp-5",
    candidateId: "trs-cand-1",
    candidateName: "Benjamin Uchenna Okoro",
    candidateAvatar: "/placeholder.svg",
    office: "Treasurer",
    status: "paused",
    manifesto: "As Treasurer, I will manage our community's finances with the highest level of integrity and transparency.",
    slogan: "Financial integrity you can trust",
    priorities: [
      "Transparent financial reporting",
      "Budget optimization",
      "Investment growth"
    ],
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-03-15"),
    views: 234,
    endorsements: 12,
    createdAt: new Date("2024-12-22")
  }
];

export const mockClearanceRequests: AdminClearanceRequest[] = [
  {
    id: "clear-1",
    candidateId: "cand-1",
    candidateName: "Paulson Chinedu Okonkwo",
    candidateAvatar: "/placeholder.svg",
    office: "President General",
    status: "approved",
    documents: [
      { name: "Application Form", status: "verified", submittedAt: new Date("2024-12-10") },
      { name: "ID Verification", status: "verified", submittedAt: new Date("2024-12-10") },
      { name: "Financial Clearance", status: "verified", submittedAt: new Date("2024-12-11") },
      { name: "Conduct Certificate", status: "verified", submittedAt: new Date("2024-12-12") }
    ],
    submittedAt: new Date("2024-12-10"),
    reviewedAt: new Date("2024-12-15"),
    reviewedBy: "Admin Smith"
  },
  {
    id: "clear-2",
    candidateId: "cand-2",
    candidateName: "Jerome Ifeanyi Adebayo",
    candidateAvatar: "/placeholder.svg",
    office: "President General",
    status: "approved",
    documents: [
      { name: "Application Form", status: "verified", submittedAt: new Date("2024-12-12") },
      { name: "ID Verification", status: "verified", submittedAt: new Date("2024-12-12") },
      { name: "Financial Clearance", status: "verified", submittedAt: new Date("2024-12-13") },
      { name: "Conduct Certificate", status: "verified", submittedAt: new Date("2024-12-14") }
    ],
    submittedAt: new Date("2024-12-12"),
    reviewedAt: new Date("2024-12-16"),
    reviewedBy: "Admin Smith"
  },
  {
    id: "clear-3",
    candidateId: "new-cand-1",
    candidateName: "Emmanuel Kalu Nnamdi",
    candidateAvatar: "/placeholder.svg",
    office: "Financial Secretary",
    status: "pending",
    documents: [
      { name: "Application Form", status: "submitted", submittedAt: new Date("2025-01-10") },
      { name: "ID Verification", status: "submitted", submittedAt: new Date("2025-01-10") },
      { name: "Financial Clearance", status: "missing" },
      { name: "Conduct Certificate", status: "submitted", submittedAt: new Date("2025-01-11") }
    ],
    submittedAt: new Date("2025-01-10")
  },
  {
    id: "clear-4",
    candidateId: "new-cand-2",
    candidateName: "Victoria Amaka Eze",
    candidateAvatar: "/placeholder.svg",
    office: "Vice President",
    status: "pending",
    documents: [
      { name: "Application Form", status: "verified", submittedAt: new Date("2025-01-08") },
      { name: "ID Verification", status: "submitted", submittedAt: new Date("2025-01-08") },
      { name: "Financial Clearance", status: "submitted", submittedAt: new Date("2025-01-09") },
      { name: "Conduct Certificate", status: "missing" }
    ],
    submittedAt: new Date("2025-01-08")
  },
  {
    id: "clear-5",
    candidateId: "new-cand-3",
    candidateName: "Chukwuemeka Obi",
    candidateAvatar: "/placeholder.svg",
    office: "Treasurer",
    status: "more_info_needed",
    documents: [
      { name: "Application Form", status: "verified", submittedAt: new Date("2025-01-05") },
      { name: "ID Verification", status: "rejected", submittedAt: new Date("2025-01-05") },
      { name: "Financial Clearance", status: "submitted", submittedAt: new Date("2025-01-06") },
      { name: "Conduct Certificate", status: "verified", submittedAt: new Date("2025-01-06") }
    ],
    submittedAt: new Date("2025-01-05"),
    notes: "ID verification document is unclear. Please resubmit with a clearer image."
  },
  {
    id: "clear-6",
    candidateId: "new-cand-4",
    candidateName: "Ngozi Patricia Udoh",
    candidateAvatar: "/placeholder.svg",
    office: "Secretary",
    status: "rejected",
    documents: [
      { name: "Application Form", status: "verified", submittedAt: new Date("2024-12-20") },
      { name: "ID Verification", status: "verified", submittedAt: new Date("2024-12-20") },
      { name: "Financial Clearance", status: "rejected", submittedAt: new Date("2024-12-21") },
      { name: "Conduct Certificate", status: "verified", submittedAt: new Date("2024-12-22") }
    ],
    submittedAt: new Date("2024-12-20"),
    reviewedAt: new Date("2024-12-28"),
    reviewedBy: "Admin Johnson",
    rejectionReason: "Outstanding financial obligations to the community have not been cleared. Amount owing: M45,000"
  }
];

export const mockAccreditationVoters: AdminAccreditationVoter[] = [
  {
    id: "voter-1",
    name: "Mark Anthony Orji",
    avatar: "/placeholder.svg",
    membershipId: "MEM-2020-0001",
    email: "mark.orji@email.com",
    financialStatus: "clear",
    accreditationStatus: "valid",
    dateAccredited: new Date("2025-01-05")
  },
  {
    id: "voter-2",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    membershipId: "MEM-2019-0045",
    email: "sarah.j@email.com",
    financialStatus: "clear",
    accreditationStatus: "valid",
    dateAccredited: new Date("2025-01-05")
  },
  {
    id: "voter-3",
    name: "Michael Chen",
    avatar: "/placeholder.svg",
    membershipId: "MEM-2021-0123",
    email: "m.chen@email.com",
    financialStatus: "owing",
    accreditationStatus: "invalid",
    amountOwing: 25000,
    lastPaymentDate: new Date("2024-10-15")
  },
  {
    id: "voter-4",
    name: "Jennifer Taylor",
    avatar: "/placeholder.svg",
    membershipId: "MEM-2018-0089",
    email: "j.taylor@email.com",
    financialStatus: "clear",
    accreditationStatus: "valid",
    dateAccredited: new Date("2025-01-06")
  },
  {
    id: "voter-5",
    name: "David Martinez",
    avatar: "/placeholder.svg",
    membershipId: "MEM-2022-0201",
    email: "d.martinez@email.com",
    financialStatus: "pending",
    accreditationStatus: "pending"
  },
  {
    id: "voter-6",
    name: "Lisa Anderson",
    avatar: "/placeholder.svg",
    membershipId: "MEM-2017-0034",
    email: "l.anderson@email.com",
    financialStatus: "clear",
    accreditationStatus: "valid",
    dateAccredited: new Date("2025-01-04")
  },
  {
    id: "voter-7",
    name: "Robert Brown",
    avatar: "/placeholder.svg",
    membershipId: "MEM-2020-0156",
    email: "r.brown@email.com",
    financialStatus: "owing",
    accreditationStatus: "revoked",
    amountOwing: 15000,
    dateAccredited: new Date("2025-01-05")
  },
  {
    id: "voter-8",
    name: "Emily Davis",
    avatar: "/placeholder.svg",
    membershipId: "MEM-2023-0089",
    email: "e.davis@email.com",
    financialStatus: "pending",
    accreditationStatus: "pending"
  },
  {
    id: "voter-9",
    name: "James Wilson",
    avatar: "/placeholder.svg",
    membershipId: "MEM-2019-0178",
    email: "j.wilson@email.com",
    financialStatus: "clear",
    accreditationStatus: "valid",
    dateAccredited: new Date("2025-01-07")
  },
  {
    id: "voter-10",
    name: "Amanda Thompson",
    avatar: "/placeholder.svg",
    membershipId: "MEM-2021-0234",
    email: "a.thompson@email.com",
    financialStatus: "clear",
    accreditationStatus: "valid",
    dateAccredited: new Date("2025-01-06")
  }
];

export const mockAccreditationSettings: AdminAccreditationSettings = {
  autoAccredit: true,
  requireFinancialClearance: true,
  eligibilityPeriodDays: 90,
  accreditationStartDate: new Date("2025-01-01"),
  accreditationEndDate: new Date("2025-03-10"),
  minimumMembershipDays: 180
};

export const mockCurrentElection: ElectionInfo = {
  id: "election-2025",
  name: "2025 General Election",
  type: "general",
  date: new Date("2025-03-15"),
  status: "active",
  totalVotesCast: 856,
  totalAccredited: 1200
};

export const mockWinnerResults: ElectionWinnerResult[] = [
  {
    id: "result-1",
    officeId: "office-1",
    officeName: "President General",
    candidates: [
      { id: "cand-1", name: "Paulson Chinedu Okonkwo", avatar: "/placeholder.svg", votes: 527, percentage: 61.5, isWinner: true },
      { id: "cand-2", name: "Jerome Ifeanyi Adebayo", avatar: "/placeholder.svg", votes: 316, percentage: 36.9, isWinner: false, isRunnerUp: true },
      { id: "cand-3", name: "Jude Emeka Nwosu", avatar: "/placeholder.svg", votes: 13, percentage: 1.6, isWinner: false }
    ],
    announced: false
  },
  {
    id: "result-2",
    officeId: "office-2",
    officeName: "Vice President",
    candidates: [
      { id: "vp-cand-1", name: "Grace Adaeze Okafor", avatar: "/placeholder.svg", votes: 412, percentage: 48.2, isWinner: true },
      { id: "vp-cand-2", name: "Emmanuel Chukwuemeka Ibe", avatar: "/placeholder.svg", votes: 389, percentage: 45.5, isWinner: false },
      { id: "vp-cand-3", name: "Patricia Ngozi Udeh", avatar: "/placeholder.svg", votes: 54, percentage: 6.3, isWinner: false }
    ],
    announced: false
  },
  {
    id: "result-3",
    officeId: "office-3",
    officeName: "Secretary",
    candidates: [
      { id: "sec-cand-1", name: "Daniel Obiora Chibueze", avatar: "/placeholder.svg", votes: 523, percentage: 52.3, isWinner: true },
      { id: "sec-cand-2", name: "Monica Nneka Obi", avatar: "/placeholder.svg", votes: 478, percentage: 47.7, isWinner: false }
    ],
    announced: true,
    announcedAt: new Date("2025-01-15T10:30:00"),
    announcedBy: "Community Admin"
  },
  {
    id: "result-4",
    officeId: "office-4",
    officeName: "Treasurer",
    candidates: [
      { id: "trs-cand-1", name: "Benjamin Uchenna Okoro", avatar: "/placeholder.svg", votes: 567, percentage: 44.7, isWinner: true },
      { id: "trs-cand-2", name: "Victoria Chiamaka Eze", avatar: "/placeholder.svg", votes: 401, percentage: 31.6, isWinner: false },
      { id: "trs-cand-3", name: "Kenneth Obinna Nwachukwu", avatar: "/placeholder.svg", votes: 298, percentage: 23.7, isWinner: false }
    ],
    announced: true,
    announcedAt: new Date("2025-01-15T10:35:00"),
    announcedBy: "Community Admin"
  }
];

// Stats summary for admin dashboard
export const getElectionAdminStats = () => {
  const campaigns = mockAdminCampaigns;
  const clearances = mockClearanceRequests;
  const voters = mockAccreditationVoters;

  return {
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    draftCampaigns: campaigns.filter(c => c.status === 'draft').length,
    endedCampaigns: campaigns.filter(c => c.status === 'ended').length,
    pendingClearances: clearances.filter(c => c.status === 'pending').length,
    approvedClearances: clearances.filter(c => c.status === 'approved').length,
    rejectedClearances: clearances.filter(c => c.status === 'rejected').length,
    totalAccredited: voters.filter(v => v.accreditationStatus === 'valid').length,
    pendingAccreditation: voters.filter(v => v.accreditationStatus === 'pending').length,
    invalidAccreditation: voters.filter(v => v.accreditationStatus === 'invalid').length
  };
};
