// Democratic Privacy Settings Mock Data

import {
  DemocraticPrivacySetting,
  DemocraticSettingsConfig,
  CommunitySettingsVote,
  calculateMajoritySetting,
} from "@/types/communityPrivacyVoting";

/**
 * Mock democratic privacy settings for a community
 */
export const mockDemocraticSettings: DemocraticPrivacySetting[] = [
  {
    settingId: "voters-list-privacy",
    settingName: "Voters' List Visibility",
    settingDescription: "Who can see the list of voters and their voting records",
    currentValue: "valid_members",
    voteCounts: {
      nobody: 5,
      only_admins: 12,
      valid_members: 28,
      all_members: 8,
    },
    totalVotes: 53,
    memberVote: "valid_members",
    lastUpdated: new Date("2025-01-15"),
    effectiveDate: new Date("2025-01-16"),
    isMajorityEstablished: true,
    majorityPercentage: 52.8,
  },
  {
    settingId: "member-list-privacy",
    settingName: "Member List Visibility",
    settingDescription: "Who can view the complete list of community members",
    currentValue: "all_members",
    voteCounts: {
      nobody: 2,
      only_admins: 8,
      valid_members: 15,
      all_members: 35,
    },
    totalVotes: 60,
    memberVote: "all_members",
    lastUpdated: new Date("2025-01-10"),
    effectiveDate: new Date("2025-01-11"),
    isMajorityEstablished: true,
    majorityPercentage: 58.3,
  },
  {
    settingId: "financial-records-privacy",
    settingName: "Financial Records Visibility",
    settingDescription: "Who can view community financial statements and transactions",
    currentValue: "valid_members",
    voteCounts: {
      nobody: 8,
      only_admins: 18,
      valid_members: 22,
      all_members: 4,
    },
    totalVotes: 52,
    lastUpdated: new Date("2025-01-12"),
    effectiveDate: new Date("2025-01-13"),
    isMajorityEstablished: false,
    majorityPercentage: 42.3,
  },
  {
    settingId: "meeting-minutes-privacy",
    settingName: "Meeting Minutes Visibility",
    settingDescription: "Who can access meeting minutes and resolutions",
    currentValue: "all_members",
    voteCounts: {
      nobody: 1,
      only_admins: 5,
      valid_members: 18,
      all_members: 38,
    },
    totalVotes: 62,
    memberVote: "all_members",
    lastUpdated: new Date("2025-01-08"),
    effectiveDate: new Date("2025-01-09"),
    isMajorityEstablished: true,
    majorityPercentage: 61.3,
  },
  {
    settingId: "election-results-privacy",
    settingName: "Election Results Detail",
    settingDescription: "Who can see detailed election results with vote counts",
    currentValue: "valid_members",
    voteCounts: {
      nobody: 10,
      only_admins: 14,
      valid_members: 25,
      all_members: 6,
    },
    totalVotes: 55,
    lastUpdated: new Date("2025-01-14"),
    effectiveDate: new Date("2025-01-15"),
    isMajorityEstablished: false,
    majorityPercentage: 45.5,
  },
];

/**
 * Mock community democratic settings config
 */
export const mockDemocraticSettingsConfig: DemocraticSettingsConfig = {
  communityId: "community-001",
  settings: mockDemocraticSettings,
  votingEnabled: true,
  minimumVotesRequired: 10,
  lastRecalculatedAt: new Date(),
};

/**
 * Mock individual votes (for display/audit purposes)
 */
export const mockSettingsVotes: CommunitySettingsVote[] = [
  {
    id: "vote-001",
    settingId: "voters-list-privacy",
    memberId: "mem-001",
    memberName: "John Doe",
    selectedOption: "valid_members",
    votedAt: new Date("2025-01-14T10:30:00"),
  },
  {
    id: "vote-002",
    settingId: "voters-list-privacy",
    memberId: "mem-002",
    memberName: "Jane Smith",
    selectedOption: "only_admins",
    votedAt: new Date("2025-01-14T11:15:00"),
  },
  {
    id: "vote-003",
    settingId: "voters-list-privacy",
    memberId: "mem-003",
    memberName: "Chief Adebayo",
    selectedOption: "valid_members",
    votedAt: new Date("2025-01-14T09:45:00"),
  },
];

/**
 * Get total participation rate
 */
export function getParticipationRate(setting: DemocraticPrivacySetting, totalMembers: number): number {
  if (totalMembers === 0) return 0;
  return (setting.totalVotes / totalMembers) * 100;
}

/**
 * Get the winning option and its details
 */
export function getWinningOption(setting: DemocraticPrivacySetting) {
  const result = calculateMajoritySetting(setting);
  return {
    option: result.winner,
    votes: result.winnerVotes,
    percentage: result.percentage,
    isMajority: result.isMajority,
    status: result.isMajority ? 'Majority Established' : 'Plurality (No Majority)',
  };
}

/**
 * Simulate casting a vote on a setting
 */
export function castSettingVote(
  settingId: string,
  previousVote: string | undefined,
  newVote: string
): { success: boolean; message: string } {
  // In real app, this would update the database
  console.log(`Vote cast: Setting ${settingId}, Previous: ${previousVote}, New: ${newVote}`);
  return {
    success: true,
    message: previousVote 
      ? `Your vote has been changed from "${previousVote}" to "${newVote}"`
      : `Your vote for "${newVote}" has been recorded`,
  };
}
