// Campaign Audience Options
export type CampaignAudience = 
  | "community_interface"      // Within Community Interface Only
  | "members_interface"        // On Members Interface
  | "mobigate_interface"       // Across Mobigate Interface
  | "mobigate_users"           // On Mobigate Users Interface
  | "mobi_store_marketplace";  // On Mobi-Store Marketplace

export interface CampaignAudienceOption {
  value: CampaignAudience;
  label: string;
  description: string;
  icon: string;
  premiumMultiplier: number; // Additional fee multiplier for this audience
}

// Campaign Duration Options with Fees
export type CampaignDurationDays = 3 | 7 | 14 | 21 | 30 | 60 | 90;

export interface CampaignDurationOption {
  days: CampaignDurationDays;
  feeInMobi: number;
  label: string;
  description: string;
  popular?: boolean;
}

// Campaign Fee Distribution Configuration
export interface FeeDistributionConfig {
  id: string;
  communityPercentage: number;  // e.g., 60
  mobigatePercentage: number;   // e.g., 40
  lastUpdatedBy: string;
  lastUpdatedAt: Date;
  isActive: boolean;
}

export interface FeeDistributionHistory {
  id: string;
  previousCommunityPercentage: number;
  previousMobigatePercentage: number;
  newCommunityPercentage: number;
  newMobigatePercentage: number;
  changedBy: string;
  changedAt: Date;
  reason?: string;
}

// Campaign Feedback (from audience)
export interface CampaignFeedback {
  id: string;
  campaignId: string;
  feedbackText: string;
  submittedAt: Date;
  anonymousId: string;  // e.g., "Viewer #7291"
  isRead: boolean;
}

// Campaign Priority Item
export interface CampaignPriority {
  id: string;
  title: string;
  description?: string;
}

// Enhanced Campaign with new fields
export interface EnhancedCampaign {
  id: string;
  candidateId: string;
  candidateName: string;
  candidatePhoto?: string;
  communityName: string; // The community/organization the candidate is running in
  communityLogo?: string;
  office: string;
  tagline: string;
  manifesto: string;
  campaignImage?: string;
  priorities: CampaignPriority[];
  
  // Audience Settings
  audienceTargets: CampaignAudience[];
  
  // Duration Settings
  durationDays: CampaignDurationDays;
  startDate: Date;
  endDate: Date;
  
  // Fee Information
  baseFee: number;
  audiencePremium: number;
  totalFeeInMobi: number;
  communityShare: number;
  mobigateShare: number;
  paymentStatus: "pending" | "paid" | "refunded";
  paidAt?: Date;
  
  // Campaign Stats
  views: number;
  clicks: number;
  feedbackCount: number;
  
  // Campaign Status
  status: "draft" | "pending_payment" | "active" | "paused" | "ended" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
  
  // Feedbacks (only visible to candidate)
  feedbacks: CampaignFeedback[];
}

// Campaign Creation Form Data
export interface CampaignFormData {
  candidateName: string;
  office: string;
  tagline: string;
  manifesto: string;
  campaignImage?: string;
  priorities: CampaignPriority[];
  audienceTargets: CampaignAudience[];
  durationDays: CampaignDurationDays;
}

// Campaign Fee Calculation Result
export interface CampaignFeeCalculation {
  baseFee: number;
  audiencePremium: number;
  totalFee: number;
  breakdown: {
    audience: CampaignAudience;
    premium: number;
  }[];
}

// Campaign Fee Distribution Result
export interface CampaignFeeDistribution {
  totalFee: number;
  communityShare: number;
  mobigateShare: number;
  communityPercentage: number;
  mobigatePercentage: number;
}

// Campaign Payment Result
export interface CampaignPaymentResult {
  success: boolean;
  transactionId?: string;
  newWalletBalance?: number;
  error?: string;
  timestamp: Date;
}

// Campaign Banner Display Data (for advertorial)
export interface CampaignBannerData {
  id: string;
  candidateName: string;
  candidatePhoto?: string;
  office: string;
  tagline: string;
  campaignImage?: string;
  feedbackCount: number;
  daysRemaining: number;
  audienceType: CampaignAudience;
}
