// Mock Data for Community Democratic Settings System

import {
  AdminSettingProposal,
  MemberRecommendation,
  ActiveCommunitySetting,
  SettingChangeNotification,
  CommunitySettingsStats,
  AdminInfo,
  MemberInfo,
} from '@/types/communityDemocraticSettings';

// Mock Admin Info
const mockAdmins: Record<string, AdminInfo> = {
  president: {
    id: 'admin-1',
    name: 'John Okafor',
    role: 'President General',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnO',
  },
  secretary: {
    id: 'admin-2',
    name: 'Mary Adeyemi',
    role: 'Secretary General',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MaryA',
  },
  treasurer: {
    id: 'admin-3',
    name: 'Emmanuel Nwankwo',
    role: 'Financial Secretary',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmmanuelN',
  },
};

// Mock Member Info
const mockMembers: Record<string, MemberInfo> = {
  member1: {
    id: 'member-1',
    name: 'Chinedu Okeke',
    memberNumber: 'MG-2024-001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChineduO',
  },
  member2: {
    id: 'member-2',
    name: 'Amaka Johnson',
    memberNumber: 'MG-2024-015',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AmakaJ',
  },
  member3: {
    id: 'member-3',
    name: 'Tunde Bakare',
    memberNumber: 'MG-2024-023',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TundeB',
  },
};

// Pending Admin Proposals
export const mockAdminProposals: AdminSettingProposal[] = [
  {
    proposalId: 'prop-1',
    settingKey: 'community_finances_visibility',
    settingName: 'Community Finances Visibility',
    settingDescription: 'Who can view the community financial records and statements',
    settingCategory: 'privacy_settings',
    currentValue: 'Valid Members Only',
    proposedValue: 'All Members',
    proposedBy: mockAdmins.president,
    proposedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    approvalCount: 45,
    disapprovalCount: 12,
    totalVotes: 57,
    totalValidMembers: 100,
    approvalPercentage: 45,
    disapprovalPercentage: 12,
    status: 'pending_approval',
    expiresAt: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
    memberVote: null,
    hasRecommendation: false,
  },
  {
    proposalId: 'prop-2',
    settingKey: 'meeting_download_fee',
    settingName: 'Meeting Recording Download Fee',
    settingDescription: 'Fee charged to download meeting recordings',
    settingCategory: 'meeting_settings',
    currentValue: 'M500',
    proposedValue: 'M1000',
    proposedBy: mockAdmins.treasurer,
    proposedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    approvalCount: 28,
    disapprovalCount: 35,
    totalVotes: 63,
    totalValidMembers: 100,
    approvalPercentage: 28,
    disapprovalPercentage: 35,
    status: 'pending_approval',
    expiresAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
    memberVote: null,
    hasRecommendation: true,
  },
  {
    proposalId: 'prop-3',
    settingKey: 'new_member_approval',
    settingName: 'New Member Approval Process',
    settingDescription: 'How new membership applications are processed',
    settingCategory: 'membership_settings',
    currentValue: 'Admin Approval Required',
    proposedValue: 'Auto-Approve After Quiz',
    proposedBy: mockAdmins.secretary,
    proposedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    approvalCount: 62,
    disapprovalCount: 8,
    totalVotes: 70,
    totalValidMembers: 100,
    approvalPercentage: 62,
    disapprovalPercentage: 8,
    status: 'active', // Already approved with 62%
    effectiveDate: new Date(),
    expiresAt: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
    memberVote: 'approve',
    hasRecommendation: false,
  },
];

// Member Recommendations
export const mockMemberRecommendations: MemberRecommendation[] = [
  {
    recommendationId: 'rec-1',
    settingKey: 'meeting_download_fee',
    settingName: 'Meeting Recording Download Fee',
    proposalId: 'prop-2',
    recommendedValue: 'Free (M0)',
    currentValue: 'M500',
    reason: 'Meeting recordings should be free for all members who attended the meeting',
    recommendedBy: mockMembers.member1,
    recommendedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    supportCount: 52,
    totalValidMembers: 100,
    supportPercentage: 52,
    isActive: true,
    hasSupported: false,
  },
  {
    recommendationId: 'rec-2',
    settingKey: 'posting_approval',
    settingName: 'Post Approval Requirement',
    proposalId: undefined, // Independent recommendation
    recommendedValue: 'No Approval Needed',
    currentValue: 'Admin Approval Required',
    reason: 'Members should be able to post freely without waiting for admin approval',
    recommendedBy: mockMembers.member2,
    recommendedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    supportCount: 38,
    totalValidMembers: 100,
    supportPercentage: 38,
    isActive: true,
    hasSupported: true,
  },
  {
    recommendationId: 'rec-3',
    settingKey: 'election_voting_period',
    settingName: 'Election Voting Period',
    proposalId: undefined,
    recommendedValue: '7 Days',
    currentValue: '3 Days',
    reason: 'Longer voting period allows more members to participate in elections',
    recommendedBy: mockMembers.member3,
    recommendedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    supportCount: 61,
    totalValidMembers: 100,
    supportPercentage: 61,
    isActive: true,
    hasSupported: false,
  },
];

// Active Community Settings by Category
export const mockActiveSettings: ActiveCommunitySetting[] = [
  // Privacy Settings
  {
    settingKey: 'community_finances_visibility',
    settingName: 'Community Finances Visibility',
    settingDescription: 'Who can view the community financial records',
    category: 'privacy_settings',
    currentValue: 'Valid Members Only',
    valueOptions: ['Nobody', 'Only Admins', 'Valid Members Only', 'All Members'],
    approvalPercentage: 78,
    lastUpdatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastUpdatedBy: mockAdmins.president,
    source: 'admin',
    hasPendingChange: true,
  },
  {
    settingKey: 'member_financial_status',
    settingName: 'Member Financial Status',
    settingDescription: 'Who can see individual member financial standings',
    category: 'privacy_settings',
    currentValue: 'Only Admins',
    valueOptions: ['Nobody', 'Only Admins', 'Valid Members Only', 'All Members'],
    approvalPercentage: 85,
    lastUpdatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    lastUpdatedBy: mockAdmins.treasurer,
    source: 'admin',
    hasPendingChange: false,
  },
  {
    settingKey: 'complaints_visibility',
    settingName: 'Complaints Visibility',
    settingDescription: 'Who can view submitted complaints',
    category: 'privacy_settings',
    currentValue: 'Only Admins',
    valueOptions: ['Nobody', 'Only Admins', 'Valid Members Only', 'All Members'],
    approvalPercentage: 92,
    lastUpdatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    source: 'default',
    hasPendingChange: false,
  },
  // General Settings
  {
    settingKey: 'handover_time',
    settingName: 'Leadership Handover Time',
    settingDescription: 'Standard time for leadership transition after elections',
    category: 'general_settings',
    currentValue: '30 Days',
    valueOptions: ['Immediately', '7 Days', '14 Days', '30 Days', '60 Days'],
    approvalPercentage: 75,
    lastUpdatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    source: 'admin',
    hasPendingChange: false,
  },
  {
    settingKey: 'account_manager',
    settingName: 'Account Manager',
    settingDescription: 'Who manages the community account',
    category: 'general_settings',
    currentValue: 'Financial Secretary',
    valueOptions: ['President', 'Secretary', 'Financial Secretary', 'Treasurer'],
    approvalPercentage: 88,
    lastUpdatedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    source: 'admin',
    hasPendingChange: false,
  },
  // Election Settings
  {
    settingKey: 'who_can_vote',
    settingName: 'Voting Eligibility',
    settingDescription: 'Who is eligible to vote in elections',
    category: 'election_settings',
    currentValue: 'Valid Members Only',
    valueOptions: ['All Members', 'Valid Members Only', 'Financial Members Only'],
    approvalPercentage: 95,
    lastUpdatedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    source: 'admin',
    hasPendingChange: false,
  },
  {
    settingKey: 'election_results_visibility',
    settingName: 'Election Results Visibility',
    settingDescription: 'Who can view detailed election results',
    category: 'election_settings',
    currentValue: 'All Members',
    valueOptions: ['Only Admins', 'Valid Members Only', 'All Members'],
    approvalPercentage: 82,
    lastUpdatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    source: 'admin',
    hasPendingChange: false,
  },
  // Meeting Settings
  {
    settingKey: 'meeting_download_fee',
    settingName: 'Meeting Recording Download Fee',
    settingDescription: 'Fee for downloading meeting recordings',
    category: 'meeting_settings',
    currentValue: 'M500',
    valueOptions: ['Free (M0)', 'M200', 'M500', 'M1000', 'M2000'],
    approvalPercentage: 65,
    lastUpdatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    source: 'admin',
    hasPendingChange: true,
  },
  {
    settingKey: 'meeting_frequency',
    settingName: 'Regular Meeting Frequency',
    settingDescription: 'How often regular community meetings are held',
    category: 'meeting_settings',
    currentValue: 'Monthly',
    valueOptions: ['Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly'],
    approvalPercentage: 78,
    lastUpdatedAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
    source: 'admin',
    hasPendingChange: false,
  },
  // Membership Settings
  {
    settingKey: 'new_member_approval',
    settingName: 'New Member Approval',
    settingDescription: 'How new membership applications are processed',
    category: 'membership_settings',
    currentValue: 'Auto-Approve After Quiz',
    valueOptions: ['Automatic', 'Admin Approval Required', 'Auto-Approve After Quiz', 'Committee Review'],
    approvalPercentage: 62,
    lastUpdatedAt: new Date(),
    source: 'admin',
    hasPendingChange: false,
  },
  // Posting Settings
  {
    settingKey: 'posting_approval',
    settingName: 'Post Approval Requirement',
    settingDescription: 'Whether posts need admin approval before publishing',
    category: 'posting_settings',
    currentValue: 'Admin Approval Required',
    valueOptions: ['No Approval Needed', 'Admin Approval Required', 'Moderator Review'],
    approvalPercentage: 70,
    lastUpdatedAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
    source: 'admin',
    hasPendingChange: false,
  },
  // Finance Settings
  {
    settingKey: 'dues_payment_period',
    settingName: 'Dues Payment Grace Period',
    settingDescription: 'Grace period for paying membership dues',
    category: 'finance_settings',
    currentValue: '30 Days',
    valueOptions: ['No Grace Period', '7 Days', '14 Days', '30 Days', '60 Days'],
    approvalPercentage: 72,
    lastUpdatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    source: 'admin',
    hasPendingChange: false,
  },
  // Promotion Settings
  {
    settingKey: 'community_visibility',
    settingName: 'Community Visibility',
    settingDescription: 'Who can discover this community',
    category: 'promotion_settings',
    currentValue: 'Public',
    valueOptions: ['Private', 'Invite Only', 'Public'],
    approvalPercentage: 88,
    lastUpdatedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    source: 'admin',
    hasPendingChange: false,
  },
];

// Notifications for pending changes
export const mockSettingNotifications: SettingChangeNotification[] = [
  {
    notificationId: 'notif-1',
    proposalId: 'prop-1',
    settingName: 'Community Finances Visibility',
    proposedBy: 'President General',
    proposedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isRead: false,
    actionRequired: true,
  },
  {
    notificationId: 'notif-2',
    proposalId: 'prop-2',
    settingName: 'Meeting Recording Download Fee',
    proposedBy: 'Financial Secretary',
    proposedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isRead: false,
    actionRequired: true,
  },
];

// Statistics
export const mockSettingsStats: CommunitySettingsStats = {
  totalSettings: mockActiveSettings.length,
  pendingApprovals: mockAdminProposals.filter(p => p.status === 'pending_approval').length,
  memberRecommendations: mockMemberRecommendations.length,
  activeOverrides: mockMemberRecommendations.filter(r => r.supportPercentage >= 60).length,
  unreadNotifications: mockSettingNotifications.filter(n => !n.isRead).length,
};

// Get settings grouped by category
export function getSettingsByCategory(): Record<string, ActiveCommunitySetting[]> {
  return mockActiveSettings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, ActiveCommunitySetting[]>);
}

// Get pending proposals count
export function getPendingProposalsCount(): number {
  return mockAdminProposals.filter(p => p.status === 'pending_approval' && p.memberVote === null).length;
}
