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
  isSelfNomination: boolean;
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
  autoQualified?: boolean; // true if candidate met 25% threshold
}

// Primary election trigger configuration
export interface PrimaryElectionConfig {
  officeId: string;
  officeName: string;
  totalCandidates: number;
  primaryThreshold: number; // Default: 20 candidates triggers primary
  advancementSlots: number; // Default: 4 advance to main election
  requiresPrimary: boolean;
  primaryStatus: 'not_required' | 'pending' | 'scheduled' | 'ongoing' | 'completed';
  scheduledDate?: Date;
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
  primaryThreshold: number; // candidates needed to trigger primary (default: 20)
  primaryAdvancementMinimum: number; // minimum candidates to advance (default: 2)
  primaryAdvancementMaximum: number; // maximum candidates to advance (default: 4)
  primaryAdvancementThreshold: number; // percentage threshold for auto-qualification (default: 25)
  minimumNominations: number;
  requireNomineeAcceptance: boolean;
  endorsementThreshold: number;
  votingDurationHours: number;
  voterChangeTimeMinutes: number; // time allowed to change vote (default: 30)
}

// Voter transparency settings
export interface VoterTransparencyConfig {
  electionId: string;
  displayMode: 'anonymous' | 'identified';
  showAccreditationNumbers: boolean;
  showVoterNames: boolean;
  antiIntimidationNoticeEnabled: boolean;
}
