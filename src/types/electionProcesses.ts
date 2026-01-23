// Election Processes Types

export type ElectionPhase = 'nominations' | 'primary' | 'main';

export type NominationStatus = 'open' | 'closed' | 'pending_approval' | 'approved' | 'rejected';
export type PrimaryElectionStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
export type MainElectionStatus = 'scheduled' | 'ongoing' | 'voting' | 'completed' | 'cancelled';

// Nomination Types
export interface NominationPeriod {
  id: string;
  officeId: string;
  officeName: string;
  startDate: Date;
  endDate: Date;
  status: 'open' | 'closed' | 'upcoming';
  nominationsCount: number;
  maxNominations?: number;
}

export interface Nomination {
  id: string;
  nomineeId: string;
  nomineeName: string;
  nomineeAvatar?: string;
  officeId: string;
  officeName: string;
  nominatedBy: string;
  nominatedByName: string;
  nominatedAt: Date;
  status: NominationStatus;
  acceptedByNominee: boolean;
  acceptedAt?: Date;
  endorsementsCount: number;
  qualificationStatus: 'pending' | 'qualified' | 'disqualified';
  disqualificationReason?: string;
}

// Primary Election Types
export interface PrimaryElection {
  id: string;
  officeId: string;
  officeName: string;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  status: PrimaryElectionStatus;
  candidates: PrimaryCandidate[];
  totalVotesCast: number;
  totalEligibleVoters: number;
  winnerThreshold: number; // percentage needed to avoid runoff
}

export interface PrimaryCandidate {
  id: string;
  name: string;
  avatar?: string;
  votes: number;
  percentage: number;
  advancedToMain: boolean;
}

// Main Election Types
export interface MainElection {
  id: string;
  name: string;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  status: MainElectionStatus;
  phases: MainElectionPhase[];
  totalOffices: number;
  completedOffices: number;
  totalVotesCast: number;
  totalAccredited: number;
  turnoutPercentage: number;
}

export interface MainElectionPhase {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed';
  startTime?: Date;
  endTime?: Date;
}

export interface MainElectionOffice {
  id: string;
  officeName: string;
  candidates: MainElectionCandidate[];
  status: 'pending' | 'voting' | 'completed';
  votingStartTime?: Date;
  votingEndTime?: Date;
  totalVotes: number;
  winner?: string;
}

export interface MainElectionCandidate {
  id: string;
  name: string;
  avatar?: string;
  party?: string;
  votes: number;
  percentage: number;
  isWinner: boolean;
}

// Election Process Settings
export interface ElectionProcessSettings {
  nominationDurationDays: number;
  primaryElectionEnabled: boolean;
  primaryAdvancementCount: number; // how many advance from primary to main
  minimumNominations: number;
  requireNomineeAcceptance: boolean;
  endorsementThreshold: number;
  votingDurationHours: number;
}
