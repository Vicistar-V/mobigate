// Impeachment Privacy Settings Types
// Democratic voting system with 70% threshold for privacy configuration

/**
 * Privacy visibility options for impeachment data
 */
export type ImpeachmentPrivacyOption = 'visible' | 'hidden';

/**
 * Individual privacy setting for impeachment
 */
export interface ImpeachmentPrivacySetting {
  settingId: string;
  settingKey: ImpeachmentPrivacySettingKey;
  settingName: string;
  settingDescription: string;
  currentValue: ImpeachmentPrivacyOption;
  votesForVisible: number;
  votesForHidden: number;
  totalVotes: number;
  totalValidMembers: number;
  visiblePercentage: number;
  hiddenPercentage: number;
  memberVote?: ImpeachmentPrivacyOption | null;
  lastUpdated: Date;
  isThresholdMet: boolean; // True if 70%+ votes for either option
  winningOption?: ImpeachmentPrivacyOption;
}

/**
 * Available privacy settings keys
 */
export type ImpeachmentPrivacySettingKey = 
  | 'initiator_visibility'
  | 'voters_visibility'
  | 'dates_visibility'
  | 'status_visibility';

/**
 * Configuration for each privacy setting
 */
export interface ImpeachmentPrivacySettingConfig {
  key: ImpeachmentPrivacySettingKey;
  name: string;
  description: string;
  defaultValue: ImpeachmentPrivacyOption;
  icon: string; // Lucide icon name
}

/**
 * All available impeachment privacy settings
 */
export const IMPEACHMENT_PRIVACY_SETTINGS: ImpeachmentPrivacySettingConfig[] = [
  {
    key: 'initiator_visibility',
    name: 'Initiated by',
    description: 'Show who initiated the impeachment process',
    defaultValue: 'visible',
    icon: 'UserCircle',
  },
  {
    key: 'voters_visibility',
    name: 'Voted for / Supported by',
    description: 'Show members who voted for, against, or remained neutral',
    defaultValue: 'visible',
    icon: 'Users',
  },
  {
    key: 'dates_visibility',
    name: 'Dates / Timelines',
    description: 'Show relevant dates and timeline information',
    defaultValue: 'visible',
    icon: 'Calendar',
  },
  {
    key: 'status_visibility',
    name: 'Status of Impeachment',
    description: 'Show current status of the impeachment process',
    defaultValue: 'visible',
    icon: 'Activity',
  },
];

/**
 * Threshold configuration
 */
export const IMPEACHMENT_PRIVACY_THRESHOLD = {
  REQUIRED_PERCENTAGE: 70, // 70% required to effect change
  MIN_VOTES_REQUIRED: 10, // Minimum votes before threshold applies
} as const;

/**
 * Community impeachment privacy configuration
 */
export interface CommunityImpeachmentPrivacyConfig {
  communityId: string;
  settings: ImpeachmentPrivacySetting[];
  lastRecalculatedAt: Date;
  totalValidMembers: number;
}

/**
 * Calculate if threshold is met and determine winning option
 */
export function calculatePrivacyThreshold(
  votesForVisible: number,
  votesForHidden: number,
  totalValidMembers: number
): {
  isThresholdMet: boolean;
  winningOption: ImpeachmentPrivacyOption | undefined;
  visiblePercentage: number;
  hiddenPercentage: number;
} {
  const totalVotes = votesForVisible + votesForHidden;
  
  if (totalValidMembers < IMPEACHMENT_PRIVACY_THRESHOLD.MIN_VOTES_REQUIRED) {
    return {
      isThresholdMet: false,
      winningOption: undefined,
      visiblePercentage: 0,
      hiddenPercentage: 0,
    };
  }

  const visiblePercentage = Math.round((votesForVisible / totalValidMembers) * 100);
  const hiddenPercentage = Math.round((votesForHidden / totalValidMembers) * 100);

  let isThresholdMet = false;
  let winningOption: ImpeachmentPrivacyOption | undefined;

  if (visiblePercentage >= IMPEACHMENT_PRIVACY_THRESHOLD.REQUIRED_PERCENTAGE) {
    isThresholdMet = true;
    winningOption = 'visible';
  } else if (hiddenPercentage >= IMPEACHMENT_PRIVACY_THRESHOLD.REQUIRED_PERCENTAGE) {
    isThresholdMet = true;
    winningOption = 'hidden';
  }

  return {
    isThresholdMet,
    winningOption,
    visiblePercentage,
    hiddenPercentage,
  };
}

/**
 * Get votes needed to reach threshold
 */
export function getVotesNeededForThreshold(
  currentVotes: number,
  totalValidMembers: number
): number {
  const targetVotes = Math.ceil(
    (totalValidMembers * IMPEACHMENT_PRIVACY_THRESHOLD.REQUIRED_PERCENTAGE) / 100
  );
  return Math.max(0, targetVotes - currentVotes);
}

/**
 * Mock data for impeachment privacy settings
 */
export const mockImpeachmentPrivacySettings: ImpeachmentPrivacySetting[] = [
  {
    settingId: 'imp-priv-1',
    settingKey: 'initiator_visibility',
    settingName: 'Initiated by',
    settingDescription: 'Show who initiated the impeachment process',
    currentValue: 'visible',
    votesForVisible: 145,
    votesForHidden: 85,
    totalVotes: 230,
    totalValidMembers: 250,
    visiblePercentage: 58,
    hiddenPercentage: 34,
    memberVote: null,
    lastUpdated: new Date('2025-01-20'),
    isThresholdMet: false,
    winningOption: undefined,
  },
  {
    settingId: 'imp-priv-2',
    settingKey: 'voters_visibility',
    settingName: 'Voted for / Supported by',
    settingDescription: 'Show members who voted for, against, or remained neutral',
    currentValue: 'hidden',
    votesForVisible: 65,
    votesForHidden: 180,
    totalVotes: 245,
    totalValidMembers: 250,
    visiblePercentage: 26,
    hiddenPercentage: 72,
    memberVote: 'hidden',
    lastUpdated: new Date('2025-01-22'),
    isThresholdMet: true,
    winningOption: 'hidden',
  },
  {
    settingId: 'imp-priv-3',
    settingKey: 'dates_visibility',
    settingName: 'Dates / Timelines',
    settingDescription: 'Show relevant dates and timeline information',
    currentValue: 'visible',
    votesForVisible: 190,
    votesForHidden: 40,
    totalVotes: 230,
    totalValidMembers: 250,
    visiblePercentage: 76,
    hiddenPercentage: 16,
    memberVote: 'visible',
    lastUpdated: new Date('2025-01-18'),
    isThresholdMet: true,
    winningOption: 'visible',
  },
  {
    settingId: 'imp-priv-4',
    settingKey: 'status_visibility',
    settingName: 'Status of Impeachment',
    settingDescription: 'Show current status of the impeachment process',
    currentValue: 'visible',
    votesForVisible: 200,
    votesForHidden: 35,
    totalVotes: 235,
    totalValidMembers: 250,
    visiblePercentage: 80,
    hiddenPercentage: 14,
    memberVote: 'visible',
    lastUpdated: new Date('2025-01-19'),
    isThresholdMet: true,
    winningOption: 'visible',
  },
];

/**
 * Get effective privacy value for a setting
 */
export function getEffectivePrivacyValue(
  setting: ImpeachmentPrivacySetting
): ImpeachmentPrivacyOption {
  if (setting.isThresholdMet && setting.winningOption) {
    return setting.winningOption;
  }
  return setting.currentValue;
}
