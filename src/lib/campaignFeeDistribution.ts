import { 
  CampaignAudience, 
  CampaignDurationDays,
  CampaignFeeCalculation,
  CampaignFeeDistribution,
  CampaignPaymentResult,
  FeeDistributionConfig
} from "@/types/campaignSystem";
import { 
  campaignAudienceOptions, 
  campaignDurationOptions,
  defaultFeeDistributionConfig
} from "@/data/campaignSystemData";

/**
 * Get the base fee for a given campaign duration
 */
export const getBaseFeeForDuration = (durationDays: CampaignDurationDays): number => {
  const option = campaignDurationOptions.find(opt => opt.days === durationDays);
  return option?.feeInMobi ?? 1000;
};

/**
 * Get the premium multiplier for a specific audience
 */
export const getAudiencePremiumMultiplier = (audience: CampaignAudience): number => {
  const option = campaignAudienceOptions.find(opt => opt.value === audience);
  return option?.premiumMultiplier ?? 1.0;
};

/**
 * Calculate the total campaign fee based on duration and audience targets
 */
export const calculateCampaignFee = (
  durationDays: CampaignDurationDays,
  audienceTargets: CampaignAudience[]
): CampaignFeeCalculation => {
  const baseFee = getBaseFeeForDuration(durationDays);
  
  // Calculate audience premium
  // For multiple audiences, we calculate additional premium for each beyond the first
  const breakdown: CampaignFeeCalculation["breakdown"] = [];
  let totalPremium = 0;
  
  audienceTargets.forEach((audience, index) => {
    const multiplier = getAudiencePremiumMultiplier(audience);
    
    if (index === 0) {
      // First audience is included in base fee
      breakdown.push({
        audience,
        premium: 0
      });
    } else {
      // Additional audiences add premium based on their multiplier
      const premium = Math.round(baseFee * (multiplier - 1));
      totalPremium += premium;
      breakdown.push({
        audience,
        premium
      });
    }
  });
  
  // If only community_interface is selected, no premium
  if (audienceTargets.length === 1 && audienceTargets[0] === "community_interface") {
    return {
      baseFee,
      audiencePremium: 0,
      totalFee: baseFee,
      breakdown
    };
  }
  
  // Apply the highest multiplier to base fee if a premium audience is the primary
  const primaryAudienceMultiplier = getAudiencePremiumMultiplier(audienceTargets[0]);
  const adjustedBaseFee = Math.round(baseFee * primaryAudienceMultiplier);
  const basePremium = adjustedBaseFee - baseFee;
  
  return {
    baseFee,
    audiencePremium: basePremium + totalPremium,
    totalFee: adjustedBaseFee + totalPremium,
    breakdown
  };
};

/**
 * Distribute the campaign fee between Community and Mobigate
 */
export const distributeCampaignFee = (
  totalFee: number,
  config: FeeDistributionConfig = defaultFeeDistributionConfig
): CampaignFeeDistribution => {
  const communityShare = Math.round((totalFee * config.communityPercentage) / 100);
  const mobigateShare = totalFee - communityShare; // Ensure no rounding errors
  
  return {
    totalFee,
    communityShare,
    mobigateShare,
    communityPercentage: config.communityPercentage,
    mobigatePercentage: config.mobigatePercentage
  };
};

/**
 * Process campaign payment from candidate's wallet
 * Returns success/failure with new balance
 */
export const processCampaignPayment = (
  candidateWalletBalance: number,
  totalFee: number
): CampaignPaymentResult => {
  const timestamp = new Date();
  
  // Check if candidate has sufficient balance
  if (candidateWalletBalance < totalFee) {
    return {
      success: false,
      error: `Insufficient wallet balance. You need M${totalFee.toLocaleString()} but have M${candidateWalletBalance.toLocaleString()}`,
      timestamp
    };
  }
  
  // Process the payment (mock debit)
  const newBalance = candidateWalletBalance - totalFee;
  const transactionId = `TXN-CAMP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  return {
    success: true,
    transactionId,
    newWalletBalance: newBalance,
    timestamp
  };
};

/**
 * Format fee amount with Mobi currency
 */
export const formatMobiAmount = (amount: number): string => {
  return `M${amount.toLocaleString()}`;
};

/**
 * Calculate days remaining for a campaign
 */
export const calculateDaysRemaining = (endDate: Date): number => {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

/**
 * Check if a campaign is currently active
 */
export const isCampaignActive = (startDate: Date, endDate: Date): boolean => {
  const now = new Date();
  return now >= new Date(startDate) && now <= new Date(endDate);
};

/**
 * Generate a unique anonymous ID for feedback
 */
export const generateAnonymousId = (): string => {
  const number = Math.floor(1000 + Math.random() * 9000);
  return `Viewer #${number}`;
};

/**
 * Get audience label from value
 */
export const getAudienceLabel = (audience: CampaignAudience): string => {
  const option = campaignAudienceOptions.find(opt => opt.value === audience);
  return option?.label ?? audience;
};

/**
 * Get duration label from days
 */
export const getDurationLabel = (days: CampaignDurationDays): string => {
  const option = campaignDurationOptions.find(opt => opt.days === days);
  return option?.label ?? `${days} Days`;
};
