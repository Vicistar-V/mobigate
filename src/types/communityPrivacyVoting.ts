// Democratic Privacy Voting System Types

/**
 * Privacy visibility options for community settings
 */
export type PrivacyVisibilityOption = 'nobody' | 'only_admins' | 'valid_members' | 'all_members';

/**
 * Labels for privacy options
 */
export const PRIVACY_OPTION_LABELS: Record<PrivacyVisibilityOption, string> = {
  nobody: 'Nobody',
  only_admins: 'Only Admins',
  valid_members: 'Valid Members',
  all_members: 'All Members',
};

/**
 * Descriptions for privacy options
 */
export const PRIVACY_OPTION_DESCRIPTIONS: Record<PrivacyVisibilityOption, string> = {
  nobody: 'No one can view this information',
  only_admins: 'Only community administrators can view',
  valid_members: 'Only verified/valid members can view',
  all_members: 'All community members can view',
};

/**
 * Vote counts for each privacy option
 */
export interface PrivacyVoteCounts {
  nobody: number;
  only_admins: number;
  valid_members: number;
  all_members: number;
}

/**
 * A democratic privacy setting that members vote on
 */
export interface DemocraticPrivacySetting {
  settingId: string;
  settingName: string;
  settingDescription: string;
  currentValue: PrivacyVisibilityOption;
  voteCounts: PrivacyVoteCounts;
  totalVotes: number;
  memberVote?: PrivacyVisibilityOption; // Current user's vote
  lastUpdated: Date;
  effectiveDate: Date;
  isMajorityEstablished: boolean;
  majorityPercentage: number;
}

/**
 * Individual member's vote on a community setting
 */
export interface CommunitySettingsVote {
  id: string;
  settingId: string;
  memberId: string;
  memberName: string;
  selectedOption: PrivacyVisibilityOption;
  votedAt: Date;
  updatedAt?: Date;
}

/**
 * Configuration for democratic settings in a community
 */
export interface DemocraticSettingsConfig {
  communityId: string;
  settings: DemocraticPrivacySetting[];
  votingEnabled: boolean;
  minimumVotesRequired: number;
  lastRecalculatedAt: Date;
}

/**
 * Calculate majority result from a privacy setting
 */
export interface MajorityResult {
  winner: PrivacyVisibilityOption;
  winnerVotes: number;
  percentage: number;
  isMajority: boolean; // >50%
  isPlurality: boolean; // Highest votes but not majority
  totalVotes: number;
}

/**
 * Calculate the majority setting from vote counts
 */
export function calculateMajoritySetting(setting: DemocraticPrivacySetting): MajorityResult {
  const { voteCounts, totalVotes } = setting;
  
  const entries = Object.entries(voteCounts) as [PrivacyVisibilityOption, number][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const [winner, winnerVotes] = sorted[0];
  const percentage = totalVotes > 0 ? (winnerVotes / totalVotes) * 100 : 0;
  
  return {
    winner,
    winnerVotes,
    percentage,
    isMajority: percentage > 50,
    isPlurality: percentage <= 50 && winnerVotes > 0,
    totalVotes,
  };
}

/**
 * Available community settings that can be voted on
 */
export type CommunitySettingType = 
  | 'voters_list_privacy'
  | 'member_list_privacy'
  | 'financial_records_privacy'
  | 'meeting_minutes_privacy'
  | 'election_results_privacy';

/**
 * Setting type metadata
 */
export interface SettingTypeMetadata {
  type: CommunitySettingType;
  name: string;
  description: string;
  defaultValue: PrivacyVisibilityOption;
}

export const SETTING_TYPE_METADATA: Record<CommunitySettingType, SettingTypeMetadata> = {
  voters_list_privacy: {
    type: 'voters_list_privacy',
    name: "Voters' List Visibility",
    description: "Who can see the list of voters and their voting records",
    defaultValue: 'valid_members',
  },
  member_list_privacy: {
    type: 'member_list_privacy',
    name: "Member List Visibility",
    description: "Who can view the complete list of community members",
    defaultValue: 'all_members',
  },
  financial_records_privacy: {
    type: 'financial_records_privacy',
    name: "Financial Records Visibility",
    description: "Who can view community financial statements and transactions",
    defaultValue: 'valid_members',
  },
  meeting_minutes_privacy: {
    type: 'meeting_minutes_privacy',
    name: "Meeting Minutes Visibility",
    description: "Who can access meeting minutes and resolutions",
    defaultValue: 'all_members',
  },
  election_results_privacy: {
    type: 'election_results_privacy',
    name: "Election Results Detail",
    description: "Who can see detailed election results with vote counts",
    defaultValue: 'valid_members',
  },
};
