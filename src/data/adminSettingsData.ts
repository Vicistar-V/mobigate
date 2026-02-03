// Admin Settings Data - Comprehensive Settings for Community Management

import { CommunitySettingCategory } from "@/types/communityDemocraticSettings";

export interface SettingOption {
  value: string;
  label: string;
  description?: string;
}

export interface AdminSetting {
  id: string;
  key: string;
  name: string;
  description: string;
  category: CommunitySettingCategory;
  currentValue: string;
  options: SettingOption[];
  approvalPercentage: number;
  hasPendingChange: boolean;
  isLocked?: boolean;
  requiresMultiSig: boolean;
  lastUpdated: Date;
  updatedBy?: string;
}

// Privacy Settings
export const privacySettings: AdminSetting[] = [
  {
    id: "privacy-1",
    key: "community_visibility",
    name: "Community Visibility",
    description: "Control who can discover and view your community",
    category: "privacy_settings",
    currentValue: "private",
    options: [
      { value: "public", label: "Public", description: "Anyone can find and view community" },
      { value: "private", label: "Private", description: "Only members can view content" },
      { value: "hidden", label: "Hidden", description: "Community is not discoverable" },
    ],
    approvalPercentage: 85,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2025-01-15"),
    updatedBy: "President General"
  },
  {
    id: "privacy-2",
    key: "member_directory_visibility",
    name: "Member Directory Visibility",
    description: "Who can see the list of community members",
    category: "privacy_settings",
    currentValue: "members_only",
    options: [
      { value: "public", label: "Public", description: "Anyone can see members" },
      { value: "members_only", label: "Members Only", description: "Only members can see directory" },
      { value: "admins_only", label: "Admins Only", description: "Only admins can view" },
    ],
    approvalPercentage: 92,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2025-01-10"),
  },
  {
    id: "privacy-3",
    key: "financial_records_visibility",
    name: "Financial Records Access",
    description: "Who can view community financial statements and records",
    category: "privacy_settings",
    currentValue: "valid_members",
    options: [
      { value: "admins_only", label: "Admins Only", description: "Only admins can view finances" },
      { value: "valid_members", label: "Valid Members", description: "Financially current members" },
      { value: "all_members", label: "All Members", description: "Every community member" },
    ],
    approvalPercentage: 78,
    hasPendingChange: true,
    requiresMultiSig: true,
    lastUpdated: new Date("2025-01-20"),
  },
  {
    id: "privacy-4",
    key: "member_contact_sharing",
    name: "Members' Contact Sharing",
    description: "Allow members to see other members' contact information",
    category: "privacy_settings",
    currentValue: "opt_in",
    options: [
      { value: "hidden", label: "Hidden", description: "Contact info never shared" },
      { value: "opt_in", label: "Opt-in", description: "Members choose to share" },
      { value: "visible", label: "Visible", description: "Always visible to members" },
    ],
    approvalPercentage: 88,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2025-01-08"),
  },
];

// General Settings
export const generalSettings: AdminSetting[] = [
  {
    id: "general-1",
    key: "community_language",
    name: "Primary Language",
    description: "Default language for community communications",
    category: "general_settings",
    currentValue: "english",
    options: [
      { value: "english", label: "English" },
      { value: "igbo", label: "Igbo" },
      { value: "yoruba", label: "Yorùbá" },
      { value: "hausa", label: "Hausa" },
      { value: "pidgin", label: "Nigerian Pidgin" },
    ],
    approvalPercentage: 95,
    hasPendingChange: false,
    requiresMultiSig: false,
    lastUpdated: new Date("2024-12-01"),
  },
  {
    id: "general-2",
    key: "timezone",
    name: "Community Timezone",
    description: "Default timezone for meetings and deadlines",
    category: "general_settings",
    currentValue: "WAT",
    options: [
      { value: "WAT", label: "West Africa Time (WAT)", description: "UTC+1" },
      { value: "GMT", label: "GMT (London)" },
      { value: "EST", label: "Eastern Time (US)", description: "UTC-5" },
      { value: "PST", label: "Pacific Time (US)", description: "UTC-8" },
    ],
    approvalPercentage: 90,
    hasPendingChange: false,
    requiresMultiSig: false,
    lastUpdated: new Date("2024-11-15"),
  },
  {
    id: "general-3",
    key: "handover_period",
    name: "Leadership Handover Period",
    description: "Time allowed for leadership transition after elections",
    category: "general_settings",
    currentValue: "30_days",
    options: [
      { value: "immediate", label: "Immediate", description: "Same day handover" },
      { value: "7_days", label: "7 Days" },
      { value: "14_days", label: "14 Days" },
      { value: "30_days", label: "30 Days" },
      { value: "60_days", label: "60 Days" },
    ],
    approvalPercentage: 75,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-10-20"),
  },
  {
    id: "general-4",
    key: "account_manager",
    name: "Primary Account Manager",
    description: "Officer responsible for managing community accounts",
    category: "general_settings",
    currentValue: "financial_secretary",
    options: [
      { value: "president", label: "President General" },
      { value: "treasurer", label: "Treasurer" },
      { value: "financial_secretary", label: "Financial Secretary" },
      { value: "committee", label: "Finance Committee" },
    ],
    approvalPercentage: 88,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-09-01"),
  },
];

// Election Settings
export const electionSettings: AdminSetting[] = [
  {
    id: "election-1",
    key: "voting_eligibility",
    name: "Voting Eligibility",
    description: "Who is eligible to vote in community elections",
    category: "election_settings",
    currentValue: "financial_members",
    options: [
      { value: "all_members", label: "All Members", description: "Anyone registered" },
      { value: "valid_members", label: "Valid Members", description: "Active, non-suspended" },
      { value: "financial_members", label: "Financial Members", description: "Dues up-to-date" },
    ],
    approvalPercentage: 95,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-08-01"),
  },
  {
    id: "election-2",
    key: "candidate_eligibility",
    name: "Candidate Eligibility Period",
    description: "Minimum membership duration to contest for office",
    category: "election_settings",
    currentValue: "2_years",
    options: [
      { value: "6_months", label: "6 Months" },
      { value: "1_year", label: "1 Year" },
      { value: "2_years", label: "2 Years" },
      { value: "3_years", label: "3 Years" },
      { value: "5_years", label: "5 Years" },
    ],
    approvalPercentage: 82,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-07-15"),
  },
  {
    id: "election-3",
    key: "voting_period",
    name: "Voting Period Duration",
    description: "How long voting remains open for elections",
    category: "election_settings",
    currentValue: "3_days",
    options: [
      { value: "1_day", label: "1 Day" },
      { value: "3_days", label: "3 Days" },
      { value: "5_days", label: "5 Days" },
      { value: "7_days", label: "7 Days" },
      { value: "14_days", label: "14 Days" },
    ],
    approvalPercentage: 70,
    hasPendingChange: true,
    requiresMultiSig: true,
    lastUpdated: new Date("2025-01-05"),
  },
  {
    id: "election-4",
    key: "vote_change_window",
    name: "Vote Change Window",
    description: "Time allowed for voters to change their vote",
    category: "election_settings",
    currentValue: "30_mins",
    options: [
      { value: "none", label: "No Changes", description: "Votes are final" },
      { value: "15_mins", label: "15 Minutes" },
      { value: "30_mins", label: "30 Minutes" },
      { value: "1_hour", label: "1 Hour" },
      { value: "24_hours", label: "24 Hours" },
    ],
    approvalPercentage: 65,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-12-01"),
  },
  {
    id: "election-5",
    key: "primary_threshold",
    name: "Primary Election Threshold",
    description: "Minimum percentage to advance from primary",
    category: "election_settings",
    currentValue: "25_percent",
    options: [
      { value: "15_percent", label: "15%" },
      { value: "20_percent", label: "20%" },
      { value: "25_percent", label: "25%" },
      { value: "30_percent", label: "30%" },
    ],
    approvalPercentage: 78,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-11-01"),
  },
];

// Finance Settings
export const financeSettings: AdminSetting[] = [
  {
    id: "finance-1",
    key: "currency_display",
    name: "Currency Display",
    description: "How amounts are displayed in the app",
    category: "finance_settings",
    currentValue: "dual",
    options: [
      { value: "naira_only", label: "Naira Only (₦)" },
      { value: "mobigate_only", label: "Mobigate Only (M)" },
      { value: "dual", label: "Dual Currency", description: "Show both ₦ and M" },
    ],
    approvalPercentage: 90,
    hasPendingChange: false,
    requiresMultiSig: false,
    lastUpdated: new Date("2024-10-01"),
  },
  {
    id: "finance-2",
    key: "dues_grace_period",
    name: "Dues Payment Grace Period",
    description: "Extra time allowed after due date before penalties",
    category: "finance_settings",
    currentValue: "30_days",
    options: [
      { value: "none", label: "No Grace Period" },
      { value: "7_days", label: "7 Days" },
      { value: "14_days", label: "14 Days" },
      { value: "30_days", label: "30 Days" },
      { value: "60_days", label: "60 Days" },
    ],
    approvalPercentage: 72,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-09-15"),
  },
  {
    id: "finance-3",
    key: "late_fee_percentage",
    name: "Late Payment Fee",
    description: "Penalty percentage for overdue payments",
    category: "finance_settings",
    currentValue: "5_percent",
    options: [
      { value: "none", label: "No Late Fee" },
      { value: "2_percent", label: "2%" },
      { value: "5_percent", label: "5%" },
      { value: "10_percent", label: "10%" },
      { value: "15_percent", label: "15%" },
    ],
    approvalPercentage: 68,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-09-15"),
  },
  {
    id: "finance-4",
    key: "payment_methods",
    name: "Accepted Payment Methods",
    description: "How members can make payments",
    category: "finance_settings",
    currentValue: "all",
    options: [
      { value: "bank_only", label: "Bank Transfer Only" },
      { value: "mobigate_only", label: "Mobigate Wallet Only" },
      { value: "all", label: "All Methods", description: "Bank, Wallet, Card" },
    ],
    approvalPercentage: 95,
    hasPendingChange: false,
    requiresMultiSig: false,
    lastUpdated: new Date("2024-08-01"),
  },
  {
    id: "finance-5",
    key: "auto_deduct",
    name: "Auto-Deduct Recurring Dues",
    description: "Automatically deduct dues from member wallets",
    category: "finance_settings",
    currentValue: "opt_in",
    options: [
      { value: "disabled", label: "Disabled", description: "Manual payments only" },
      { value: "opt_in", label: "Opt-in", description: "Members choose to enable" },
      { value: "enabled", label: "Enabled for All", description: "Automatic for everyone" },
    ],
    approvalPercentage: 60,
    hasPendingChange: true,
    requiresMultiSig: true,
    lastUpdated: new Date("2025-01-22"),
  },
];

// Membership Settings
export const membershipSettings: AdminSetting[] = [
  {
    id: "membership-1",
    key: "new_member_approval",
    name: "New Member Approval",
    description: "How new membership applications are processed",
    category: "membership_settings",
    currentValue: "admin_approval",
    options: [
      { value: "automatic", label: "Automatic", description: "Instant approval" },
      { value: "admin_approval", label: "Admin Approval", description: "Requires admin review" },
      { value: "quiz_then_auto", label: "Quiz Then Auto", description: "Approve after quiz" },
      { value: "committee", label: "Committee Review", description: "Membership committee" },
    ],
    approvalPercentage: 80,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-11-01"),
  },
  {
    id: "membership-2",
    key: "minimum_age",
    name: "Minimum Age Requirement",
    description: "Minimum age to join the community",
    category: "membership_settings",
    currentValue: "18",
    options: [
      { value: "16", label: "16 Years" },
      { value: "18", label: "18 Years" },
      { value: "21", label: "21 Years" },
      { value: "25", label: "25 Years" },
    ],
    approvalPercentage: 92,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-06-01"),
  },
  {
    id: "membership-3",
    key: "referral_requirement",
    name: "Referral Requirement",
    description: "Whether new members need an existing member referral",
    category: "membership_settings",
    currentValue: "optional",
    options: [
      { value: "none", label: "Not Required" },
      { value: "optional", label: "Optional", description: "Recommended but not mandatory" },
      { value: "required", label: "Required", description: "Must have a referrer" },
      { value: "two_referrals", label: "2 Referrals", description: "Needs two sponsors" },
    ],
    approvalPercentage: 75,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-10-15"),
  },
  {
    id: "membership-4",
    key: "inactive_threshold",
    name: "Inactive Member Threshold",
    description: "Time before a member is marked as inactive",
    category: "membership_settings",
    currentValue: "6_months",
    options: [
      { value: "3_months", label: "3 Months" },
      { value: "6_months", label: "6 Months" },
      { value: "1_year", label: "1 Year" },
      { value: "never", label: "Never", description: "No auto-inactive" },
    ],
    approvalPercentage: 70,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-09-01"),
  },
];

// Posting/Content Settings
export const postingSettings: AdminSetting[] = [
  {
    id: "posting-1",
    key: "post_approval",
    name: "Post Approval Requirement",
    description: "Whether posts need approval before publishing",
    category: "posting_settings",
    currentValue: "admin_approval",
    options: [
      { value: "none", label: "No Approval Needed", description: "Posts publish instantly" },
      { value: "admin_approval", label: "Admin Approval", description: "Admins must approve" },
      { value: "moderator", label: "Moderator Review", description: "Content moderators" },
    ],
    approvalPercentage: 70,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-10-01"),
  },
  {
    id: "posting-2",
    key: "who_can_post",
    name: "Who Can Create Posts",
    description: "Members allowed to create new posts",
    category: "posting_settings",
    currentValue: "valid_members",
    options: [
      { value: "admins_only", label: "Admins Only" },
      { value: "valid_members", label: "Valid Members", description: "Non-suspended, active" },
      { value: "all_members", label: "All Members" },
    ],
    approvalPercentage: 85,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-09-15"),
  },
  {
    id: "posting-3",
    key: "comment_moderation",
    name: "Comment Moderation",
    description: "How comments are moderated",
    category: "posting_settings",
    currentValue: "auto_filter",
    options: [
      { value: "none", label: "No Moderation", description: "Comments post instantly" },
      { value: "auto_filter", label: "Auto-Filter", description: "AI flags inappropriate" },
      { value: "pre_approval", label: "Pre-Approval", description: "All comments reviewed" },
    ],
    approvalPercentage: 78,
    hasPendingChange: false,
    requiresMultiSig: false,
    lastUpdated: new Date("2024-11-01"),
  },
  {
    id: "posting-4",
    key: "media_uploads",
    name: "Media Upload Limit",
    description: "Maximum file size for uploads",
    category: "posting_settings",
    currentValue: "10mb",
    options: [
      { value: "5mb", label: "5 MB" },
      { value: "10mb", label: "10 MB" },
      { value: "25mb", label: "25 MB" },
      { value: "50mb", label: "50 MB" },
    ],
    approvalPercentage: 88,
    hasPendingChange: false,
    requiresMultiSig: false,
    lastUpdated: new Date("2024-08-01"),
  },
];

// Meeting Settings
export const meetingSettings: AdminSetting[] = [
  {
    id: "meeting-1",
    key: "meeting_frequency",
    name: "Regular Meeting Frequency",
    description: "How often regular community meetings are held",
    category: "meeting_settings",
    currentValue: "monthly",
    options: [
      { value: "weekly", label: "Weekly" },
      { value: "bi_weekly", label: "Bi-Weekly" },
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "Quarterly" },
    ],
    approvalPercentage: 78,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-06-01"),
  },
  {
    id: "meeting-2",
    key: "recording_access",
    name: "Meeting Recording Access",
    description: "Who can view meeting recordings",
    category: "meeting_settings",
    currentValue: "attendees_first",
    options: [
      { value: "admins_only", label: "Admins Only" },
      { value: "attendees_first", label: "Attendees First", description: "Attendees get priority" },
      { value: "all_members", label: "All Members" },
    ],
    approvalPercentage: 72,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-10-01"),
  },
  {
    id: "meeting-3",
    key: "minutes_download_fee",
    name: "Minutes Download Fee",
    description: "Fee for downloading meeting minutes",
    category: "meeting_settings",
    currentValue: "M500",
    options: [
      { value: "free", label: "Free (M0)" },
      { value: "M200", label: "M200" },
      { value: "M500", label: "M500" },
      { value: "M1000", label: "M1,000" },
      { value: "M2000", label: "M2,000" },
    ],
    approvalPercentage: 65,
    hasPendingChange: true,
    requiresMultiSig: true,
    lastUpdated: new Date("2025-01-18"),
  },
  {
    id: "meeting-4",
    key: "attendance_tracking",
    name: "Attendance Tracking",
    description: "How meeting attendance is recorded",
    category: "meeting_settings",
    currentValue: "qr_checkin",
    options: [
      { value: "manual", label: "Manual", description: "Admin records attendance" },
      { value: "self_report", label: "Self-Report", description: "Members mark themselves" },
      { value: "qr_checkin", label: "QR Check-in", description: "Scan code at venue" },
      { value: "auto_zoom", label: "Auto (Online)", description: "Auto-track virtual" },
    ],
    approvalPercentage: 80,
    hasPendingChange: false,
    requiresMultiSig: false,
    lastUpdated: new Date("2024-09-01"),
  },
];

// Promotion/Visibility Settings
export const promotionSettings: AdminSetting[] = [
  {
    id: "promo-1",
    key: "search_visibility",
    name: "Search Visibility",
    description: "Can community be found in Mobigate search",
    category: "promotion_settings",
    currentValue: "listed",
    options: [
      { value: "hidden", label: "Hidden", description: "Not in search results" },
      { value: "listed", label: "Listed", description: "Appears in search" },
      { value: "featured", label: "Featured", description: "Promoted in search" },
    ],
    approvalPercentage: 88,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-07-01"),
  },
  {
    id: "promo-2",
    key: "invite_permissions",
    name: "Who Can Invite",
    description: "Who can send invitations to join",
    category: "promotion_settings",
    currentValue: "valid_members",
    options: [
      { value: "admins_only", label: "Admins Only" },
      { value: "valid_members", label: "Valid Members" },
      { value: "all_members", label: "All Members" },
    ],
    approvalPercentage: 75,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-08-01"),
  },
  {
    id: "promo-3",
    key: "referral_rewards",
    name: "Referral Rewards",
    description: "Reward for successful member referrals",
    category: "promotion_settings",
    currentValue: "M500",
    options: [
      { value: "none", label: "No Reward" },
      { value: "M200", label: "M200" },
      { value: "M500", label: "M500" },
      { value: "M1000", label: "M1,000" },
      { value: "M2000", label: "M2,000" },
    ],
    approvalPercentage: 70,
    hasPendingChange: false,
    requiresMultiSig: true,
    lastUpdated: new Date("2024-10-01"),
  },
];

// Get all settings
export const getAllSettings = (): AdminSetting[] => [
  ...privacySettings,
  ...generalSettings,
  ...electionSettings,
  ...financeSettings,
  ...membershipSettings,
  ...postingSettings,
  ...meetingSettings,
  ...promotionSettings,
];

// Get settings by category
export const getSettingsByCategoryAdmin = (category: CommunitySettingCategory): AdminSetting[] => {
  switch (category) {
    case "privacy_settings":
      return privacySettings;
    case "general_settings":
      return generalSettings;
    case "election_settings":
      return electionSettings;
    case "finance_settings":
      return financeSettings;
    case "membership_settings":
      return membershipSettings;
    case "posting_settings":
      return postingSettings;
    case "meeting_settings":
      return meetingSettings;
    case "promotion_settings":
      return promotionSettings;
    default:
      return [];
  }
};

// Get stats
export const getSettingsStats = () => {
  const allSettings = getAllSettings();
  return {
    total: allSettings.length,
    pending: allSettings.filter(s => s.hasPendingChange).length,
    approved: allSettings.filter(s => s.approvalPercentage >= 60).length,
    needsReview: allSettings.filter(s => s.approvalPercentage < 60).length,
  };
};
