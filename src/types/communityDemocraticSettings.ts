// Community Democratic Settings Types
// Full governance system with 60% threshold for all settings

/**
 * Categories of community settings that can be voted on
 */
export type CommunitySettingCategory = 
  | 'privacy_settings'
  | 'general_settings'
  | 'election_settings'
  | 'finance_settings'
  | 'membership_settings'
  | 'posting_settings'
  | 'meeting_settings'
  | 'promotion_settings';

/**
 * Labels for setting categories
 */
export const SETTING_CATEGORY_LABELS: Record<CommunitySettingCategory, string> = {
  privacy_settings: 'Privacy Settings',
  general_settings: 'General Settings',
  election_settings: 'Election Settings',
  finance_settings: 'Finance Settings',
  membership_settings: 'Membership Settings',
  posting_settings: 'Posting Settings',
  meeting_settings: 'Meeting Settings',
  promotion_settings: 'Promotion Settings',
};

/**
 * Icons for setting categories (lucide icon names)
 */
export const SETTING_CATEGORY_ICONS: Record<CommunitySettingCategory, string> = {
  privacy_settings: 'Shield',
  general_settings: 'Settings',
  election_settings: 'Vote',
  finance_settings: 'Wallet',
  membership_settings: 'Users',
  posting_settings: 'FileText',
  meeting_settings: 'Calendar',
  promotion_settings: 'Megaphone',
};

/**
 * Status of a democratic setting proposal
 */
export type DemocraticSettingStatus = 
  | 'pending_approval'    // Admin proposed, awaiting 60% approval
  | 'active'              // Approved by 60%+ members
  | 'disapproved'         // 60%+ members disapproved
  | 'member_override'     // Member recommendation with 60%+ replaced admin setting
  | 'expired';            // Proposal expired without reaching threshold

/**
 * Status labels and colors
 */
export const SETTING_STATUS_CONFIG: Record<DemocraticSettingStatus, { label: string; color: string }> = {
  pending_approval: { label: 'Pending Approval', color: 'bg-amber-500/10 text-amber-600' },
  active: { label: 'Active', color: 'bg-green-500/10 text-green-600' },
  disapproved: { label: 'Disapproved', color: 'bg-red-500/10 text-red-600' },
  member_override: { label: 'Member Override', color: 'bg-blue-500/10 text-blue-600' },
  expired: { label: 'Expired', color: 'bg-muted text-muted-foreground' },
};

/**
 * Admin information for proposals
 */
export interface AdminInfo {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

/**
 * Member information for recommendations
 */
export interface MemberInfo {
  id: string;
  name: string;
  memberNumber: string;
  avatar?: string;
}

/**
 * An admin-proposed setting change awaiting member approval
 */
export interface AdminSettingProposal {
  proposalId: string;
  settingKey: string;
  settingName: string;
  settingDescription: string;
  settingCategory: CommunitySettingCategory;
  currentValue: string;
  proposedValue: string;
  valueOptions?: string[]; // Available preset options for this setting
  isNumericSetting?: boolean; // True if this is a numeric value (amounts, days, etc.)
  proposedBy: AdminInfo;
  proposedAt: Date;
  approvalCount: number;
  disapprovalCount: number;
  totalVotes: number;
  totalValidMembers: number;
  approvalPercentage: number;
  disapprovalPercentage: number;
  status: DemocraticSettingStatus;
  effectiveDate?: Date;
  expiresAt: Date;
  memberVote?: 'approve' | 'disapprove' | null;
  hasRecommendation?: boolean;
}

/**
 * A member-proposed alternative setting
 */
export interface MemberRecommendation {
  recommendationId: string;
  settingKey: string;
  settingName: string;
  proposalId?: string; // Link to admin proposal if this is an alternative
  recommendedValue: string;
  currentValue: string;
  reason?: string;
  recommendedBy: MemberInfo;
  recommendedAt: Date;
  supportCount: number;
  totalValidMembers: number;
  supportPercentage: number;
  isActive: boolean;
  hasSupported?: boolean; // Current user's support status
}

/**
 * Individual member's vote on a setting proposal
 */
export interface MemberSettingVote {
  voteId: string;
  proposalId?: string;
  recommendationId?: string;
  memberId: string;
  memberName: string;
  voteType: 'approve' | 'disapprove' | 'support';
  votedAt: Date;
  updatedAt?: Date;
}

/**
 * An active community setting with its current value and approval status
 */
export interface ActiveCommunitySetting {
  settingKey: string;
  settingName: string;
  settingDescription: string;
  category: CommunitySettingCategory;
  currentValue: string;
  valueOptions?: string[]; // Available options for this setting
  approvalPercentage: number;
  lastUpdatedAt: Date;
  lastUpdatedBy?: AdminInfo | MemberInfo;
  source: 'admin' | 'member_override' | 'default';
  hasPendingChange: boolean;
}

/**
 * Notification for pending setting changes
 */
export interface SettingChangeNotification {
  notificationId: string;
  proposalId: string;
  settingName: string;
  proposedBy: string;
  proposedAt: Date;
  isRead: boolean;
  actionRequired: boolean;
}

/**
 * Summary statistics for community settings
 */
export interface CommunitySettingsStats {
  totalSettings: number;
  pendingApprovals: number;
  memberRecommendations: number;
  activeOverrides: number;
  unreadNotifications: number;
}

/**
 * Configuration for the 60% threshold system
 */
export const DEMOCRATIC_SETTINGS_CONFIG = {
  APPROVAL_THRESHOLD: 60, // 60% required for approval
  DISAPPROVAL_THRESHOLD: 60, // 60% required for disapproval to take effect
  RECOMMENDATION_THRESHOLD: 60, // 60% required for member recommendation to override
  PROPOSAL_EXPIRY_DAYS: 14, // Proposals expire after 14 days without decision
  MIN_VOTES_REQUIRED: 10, // Minimum votes before threshold calculation
} as const;
