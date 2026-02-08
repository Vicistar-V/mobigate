import { CampaignAudience, CampaignDurationDays, FeeDistributionConfig } from "./campaignSystem";

// Advertisement Categories
export type AdvertisementCategory =
  | "fashion"
  | "electronics"
  | "food"
  | "real_estate"
  | "services"
  | "health"
  | "education"
  | "automotive"
  | "beauty"
  | "other";

export interface AdvertisementCategoryOption {
  value: AdvertisementCategory;
  label: string;
  icon: string;
}

// Media Item (photo or video)
export interface AdMediaItem {
  url: string;
  type: 'image' | 'video';
  thumbnailUrl?: string;
}

// Advertisement Form Data
export interface AdvertisementFormData {
  businessName: string;
  category: AdvertisementCategory;
  customCategory?: string;
  productTitle: string;
  description: string;
  city: string;
  phone1: string;
  phone2?: string;
  email?: string;
  website?: string;
  media: AdMediaItem[]; // max 4 photos/videos
  audienceTargets: CampaignAudience[];
  durationDays: CampaignDurationDays;
}

// Advertisement Feedback
export interface AdvertisementFeedback {
  id: string;
  advertisementId: string;
  feedbackText: string;
  submittedAt: Date;
  anonymousId: string;
  isRead: boolean;
}

// Full Advertisement Record
export interface EnhancedAdvertisement {
  id: string;
  advertiserId: string;
  advertiserName: string;
  advertiserPhoto?: string;
  communityName: string;
  communityLogo?: string;

  // Business Details
  businessName: string;
  category: AdvertisementCategory;
  productTitle: string;
  description: string;
  city: string;
  phone1: string;
  phone2?: string;
  email?: string;
  website?: string;
  media: AdMediaItem[]; // max 4

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

  // Stats
  views: number;
  clicks: number;
  feedbackCount: number;

  // Status
  status: "draft" | "pending_payment" | "active" | "paused" | "ended" | "cancelled";
  createdAt: Date;
  updatedAt: Date;

  // Feedbacks
  feedbacks: AdvertisementFeedback[];
}
