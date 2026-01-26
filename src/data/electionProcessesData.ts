// Election Processes Mock Data

import {
  NominationPeriod,
  Nomination,
  PrimaryElection,
  MainElection,
  MainElectionOffice,
  ElectionProcessSettings,
} from "@/types/electionProcesses";

// Mock Nomination Periods
export const mockNominationPeriods: NominationPeriod[] = [
  {
    id: "nom-period-1",
    officeId: "office-1",
    officeName: "President General",
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-01-31"),
    status: "closed",
    nominationsCount: 5,
    maxNominations: 10,
  },
  {
    id: "nom-period-2",
    officeId: "office-2",
    officeName: "Vice President",
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-01-31"),
    status: "closed",
    nominationsCount: 4,
    maxNominations: 10,
  },
  {
    id: "nom-period-3",
    officeId: "office-3",
    officeName: "Secretary General",
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-01-31"),
    status: "closed",
    nominationsCount: 3,
  },
  {
    id: "nom-period-4",
    officeId: "office-4",
    officeName: "Treasurer",
    startDate: new Date("2025-01-15"),
    endDate: new Date("2025-02-15"),
    status: "open",
    nominationsCount: 2,
    maxNominations: 8,
  },
  {
    id: "nom-period-5",
    officeId: "office-5",
    officeName: "Financial Secretary",
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-02-28"),
    status: "upcoming",
    nominationsCount: 0,
  },
];

// Mock Nominations
export const mockNominations: Nomination[] = [
  {
    id: "nom-1",
    nomineeId: "member-1",
    nomineeName: "Paulson Chinedu Okonkwo",
    nomineeAvatar: "/placeholder.svg",
    officeId: "office-1",
    officeName: "President General",
    nominatedBy: "member-5",
    nominatedByName: "Chief Emmanuel Nwosu",
    nominatedAt: new Date("2025-01-05"),
    status: "approved",
    acceptedByNominee: true,
    acceptedAt: new Date("2025-01-06"),
    endorsementsCount: 45,
    qualificationStatus: "qualified",
  },
  {
    id: "nom-2",
    nomineeId: "member-2",
    nomineeName: "Jerome Ifeanyi Adebayo",
    nomineeAvatar: "/placeholder.svg",
    officeId: "office-1",
    officeName: "President General",
    nominatedBy: "member-8",
    nominatedByName: "Dr. Patricia Okafor",
    nominatedAt: new Date("2025-01-08"),
    status: "approved",
    acceptedByNominee: true,
    acceptedAt: new Date("2025-01-09"),
    endorsementsCount: 38,
    qualificationStatus: "qualified",
  },
  {
    id: "nom-3",
    nomineeId: "member-3",
    nomineeName: "Grace Adaeze Okafor",
    nomineeAvatar: "/placeholder.svg",
    officeId: "office-2",
    officeName: "Vice President",
    nominatedBy: "member-1",
    nominatedByName: "Paulson Chinedu Okonkwo",
    nominatedAt: new Date("2025-01-10"),
    status: "approved",
    acceptedByNominee: true,
    acceptedAt: new Date("2025-01-11"),
    endorsementsCount: 32,
    qualificationStatus: "qualified",
  },
  {
    id: "nom-4",
    nomineeId: "member-4",
    nomineeName: "Benjamin Uchenna Okoro",
    nomineeAvatar: "/placeholder.svg",
    officeId: "office-4",
    officeName: "Treasurer",
    nominatedBy: "member-12",
    nominatedByName: "Mrs. Ngozi Eze",
    nominatedAt: new Date("2025-01-20"),
    status: "pending_approval",
    acceptedByNominee: true,
    acceptedAt: new Date("2025-01-21"),
    endorsementsCount: 12,
    qualificationStatus: "pending",
  },
  {
    id: "nom-5",
    nomineeId: "member-5",
    nomineeName: "Victoria Chiamaka Eze",
    nomineeAvatar: "/placeholder.svg",
    officeId: "office-4",
    officeName: "Treasurer",
    nominatedBy: "member-3",
    nominatedByName: "Grace Adaeze Okafor",
    nominatedAt: new Date("2025-01-22"),
    status: "pending_approval",
    acceptedByNominee: false,
    endorsementsCount: 8,
    qualificationStatus: "pending",
  },
  {
    id: "nom-6",
    nomineeId: "member-6",
    nomineeName: "Chukwuemeka Obi",
    nomineeAvatar: "/placeholder.svg",
    officeId: "office-1",
    officeName: "President General",
    nominatedBy: "member-15",
    nominatedByName: "Elder James Nwachukwu",
    nominatedAt: new Date("2025-01-12"),
    status: "rejected",
    acceptedByNominee: true,
    acceptedAt: new Date("2025-01-13"),
    endorsementsCount: 5,
    qualificationStatus: "disqualified",
    disqualificationReason: "Outstanding financial obligations to the community",
  },
];

// Mock Primary Elections
export const mockPrimaryElections: PrimaryElection[] = [
  {
    id: "primary-1",
    officeId: "office-1",
    officeName: "President General",
    scheduledDate: new Date("2025-02-15"),
    startTime: "09:00",
    endTime: "17:00",
    status: "completed",
    candidates: [
      { id: "cand-1", name: "Paulson Chinedu Okonkwo", avatar: "/placeholder.svg", votes: 245, percentage: 42.3, advancedToMain: true },
      { id: "cand-2", name: "Jerome Ifeanyi Adebayo", avatar: "/placeholder.svg", votes: 198, percentage: 34.2, advancedToMain: true },
      { id: "cand-3", name: "Emmanuel Kalu Nnamdi", avatar: "/placeholder.svg", votes: 89, percentage: 15.4, advancedToMain: false },
      { id: "cand-4", name: "Daniel Obiora Chibueze", avatar: "/placeholder.svg", votes: 47, percentage: 8.1, advancedToMain: false },
    ],
    totalVotesCast: 579,
    totalEligibleVoters: 850,
    winnerThreshold: 50,
  },
  {
    id: "primary-2",
    officeId: "office-2",
    officeName: "Vice President",
    scheduledDate: new Date("2025-02-15"),
    startTime: "09:00",
    endTime: "17:00",
    status: "completed",
    candidates: [
      { id: "vp-cand-1", name: "Grace Adaeze Okafor", avatar: "/placeholder.svg", votes: 312, percentage: 56.8, advancedToMain: true },
      { id: "vp-cand-2", name: "Emmanuel Chukwuemeka Ibe", avatar: "/placeholder.svg", votes: 237, percentage: 43.2, advancedToMain: true },
    ],
    totalVotesCast: 549,
    totalEligibleVoters: 850,
    winnerThreshold: 50,
  },
  {
    id: "primary-3",
    officeId: "office-4",
    officeName: "Treasurer",
    scheduledDate: new Date("2025-02-22"),
    startTime: "09:00",
    endTime: "17:00",
    status: "scheduled",
    candidates: [],
    totalVotesCast: 0,
    totalEligibleVoters: 850,
    winnerThreshold: 50,
  },
];

// Mock Main Election
export const mockMainElection: MainElection = {
  id: "main-election-2025",
  name: "2025 General Election",
  scheduledDate: new Date("2025-03-15"),
  startTime: "08:00",
  endTime: "18:00",
  status: "ongoing",
  phases: [
    { id: "phase-1", name: "Accreditation", status: "completed", startTime: new Date("2025-03-15T08:00:00"), endTime: new Date("2025-03-15T10:00:00") },
    { id: "phase-2", name: "Voting", status: "active", startTime: new Date("2025-03-15T10:00:00") },
    { id: "phase-3", name: "Collation", status: "pending" },
    { id: "phase-4", name: "Announcement", status: "pending" },
  ],
  totalOffices: 8,
  completedOffices: 2,
  totalVotesCast: 856,
  totalAccredited: 1200,
  turnoutPercentage: 71.3,
};

// Mock Main Election Offices
export const mockMainElectionOffices: MainElectionOffice[] = [
  {
    id: "main-office-1",
    officeName: "President General",
    candidates: [
      { id: "main-cand-1", name: "Paulson Chinedu Okonkwo", avatar: "/placeholder.svg", votes: 527, percentage: 61.5, isWinner: true },
      { id: "main-cand-2", name: "Jerome Ifeanyi Adebayo", avatar: "/placeholder.svg", votes: 316, percentage: 36.9, isWinner: false },
      { id: "main-cand-3", name: "Jude Emeka Nwosu", avatar: "/placeholder.svg", votes: 13, percentage: 1.6, isWinner: false },
    ],
    status: "completed",
    votingStartTime: new Date("2025-03-15T10:00:00"),
    votingEndTime: new Date("2025-03-15T14:00:00"),
    totalVotes: 856,
    winner: "Paulson Chinedu Okonkwo",
  },
  {
    id: "main-office-2",
    officeName: "Vice President",
    candidates: [
      { id: "main-vp-1", name: "Grace Adaeze Okafor", avatar: "/placeholder.svg", votes: 412, percentage: 48.2, isWinner: true },
      { id: "main-vp-2", name: "Emmanuel Chukwuemeka Ibe", avatar: "/placeholder.svg", votes: 389, percentage: 45.5, isWinner: false },
      { id: "main-vp-3", name: "Patricia Ngozi Udeh", avatar: "/placeholder.svg", votes: 54, percentage: 6.3, isWinner: false },
    ],
    status: "completed",
    votingStartTime: new Date("2025-03-15T14:00:00"),
    votingEndTime: new Date("2025-03-15T16:00:00"),
    totalVotes: 855,
    winner: "Grace Adaeze Okafor",
  },
  {
    id: "main-office-3",
    officeName: "Secretary General",
    candidates: [
      { id: "main-sec-1", name: "Daniel Obiora Chibueze", avatar: "/placeholder.svg", votes: 234, percentage: 45.2, isWinner: false },
      { id: "main-sec-2", name: "Monica Nneka Obi", avatar: "/placeholder.svg", votes: 284, percentage: 54.8, isWinner: false },
    ],
    status: "voting",
    votingStartTime: new Date("2025-03-15T16:00:00"),
    totalVotes: 518,
  },
  {
    id: "main-office-4",
    officeName: "Treasurer",
    candidates: [
      { id: "main-trs-1", name: "Benjamin Uchenna Okoro", avatar: "/placeholder.svg", votes: 0, percentage: 0, isWinner: false },
      { id: "main-trs-2", name: "Victoria Chiamaka Eze", avatar: "/placeholder.svg", votes: 0, percentage: 0, isWinner: false },
    ],
    status: "pending",
    totalVotes: 0,
  },
];

// Mock Settings
export const mockElectionProcessSettings: ElectionProcessSettings = {
  nominationDurationDays: 30,
  primaryElectionEnabled: true,
  primaryAdvancementCount: 2,
  primaryThreshold: 20,
  minimumNominations: 2,
  requireNomineeAcceptance: true,
  endorsementThreshold: 10,
  votingDurationHours: 8,
  voterChangeTimeMinutes: 30,
};

// Helper functions
export const getNominationStats = () => {
  const nominations = mockNominations;
  return {
    total: nominations.length,
    approved: nominations.filter((n) => n.status === "approved").length,
    pending: nominations.filter((n) => n.status === "pending_approval").length,
    rejected: nominations.filter((n) => n.status === "rejected").length,
    awaiting: nominations.filter((n) => !n.acceptedByNominee).length,
  };
};

export const getPrimaryStats = () => {
  const primaries = mockPrimaryElections;
  return {
    total: primaries.length,
    completed: primaries.filter((p) => p.status === "completed").length,
    scheduled: primaries.filter((p) => p.status === "scheduled").length,
    ongoing: primaries.filter((p) => p.status === "ongoing").length,
  };
};

export const getMainElectionStats = () => {
  const election = mockMainElection;
  const offices = mockMainElectionOffices;
  return {
    totalOffices: offices.length,
    completedOffices: offices.filter((o) => o.status === "completed").length,
    votingOffices: offices.filter((o) => o.status === "voting").length,
    pendingOffices: offices.filter((o) => o.status === "pending").length,
    turnout: election.turnoutPercentage,
    totalVotes: election.totalVotesCast,
    totalAccredited: election.totalAccredited,
  };
};
