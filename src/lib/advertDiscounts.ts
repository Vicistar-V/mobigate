import { AdvertDiscount, AccreditedAdvertiserTier, AdvertPricing } from "@/types/advert";

/**
 * Accredited Advertiser Discount Tiers
 * Based on user's campaign history and performance
 */
const ACCREDITED_DISCOUNTS: Record<AccreditedAdvertiserTier, { percentage: number; minCampaigns: number }> = {
  bronze: { percentage: 5, minCampaigns: 50 },
  silver: { percentage: 10, minCampaigns: 100 },
  gold: { percentage: 15, minCampaigns: 250 },
  platinum: { percentage: 20, minCampaigns: 500 },
};

/**
 * Volume Discount Tiers
 * Based on number of active adverts
 */
export const VOLUME_DISCOUNTS = [
  { minAdverts: 21, percentage: 25 },
  { minAdverts: 11, percentage: 20 },
  { minAdverts: 7, percentage: 15 },
  { minAdverts: 4, percentage: 10 },
  { minAdverts: 2, percentage: 5 },
];

/**
 * Calculate accredited advertiser discount
 */
export function calculateAccreditedAdvertiserDiscount(
  tier: AccreditedAdvertiserTier | null,
  totalCost: number
): AdvertDiscount | null {
  if (!tier) return null;

  const discountInfo = ACCREDITED_DISCOUNTS[tier];
  const amount = totalCost * (discountInfo.percentage / 100);

  return {
    type: "accredited_advertiser",
    name: `Accredited Advertiser (${tier.charAt(0).toUpperCase() + tier.slice(1)})`,
    percentage: discountInfo.percentage,
    amount,
    description: `${discountInfo.percentage}% discount for ${tier} tier status`,
  };
}

/**
 * Calculate volume discount based on active advert count
 */
export function calculateVolumeDiscount(
  advertCount: number,
  totalCost: number
): AdvertDiscount | null {
  if (advertCount < 2) return null;

  const tier = VOLUME_DISCOUNTS.find(t => advertCount >= t.minAdverts);
  if (!tier) return null;

  const amount = totalCost * (tier.percentage / 100);

  return {
    type: "volume_based",
    name: `Volume Discount (${advertCount} adverts)`,
    percentage: tier.percentage,
    amount,
    description: `${tier.percentage}% discount for ${advertCount} active adverts`,
  };
}

/**
 * Apply discounts to pricing calculation
 */
export function applyDiscounts(
  pricing: AdvertPricing,
  discounts: AdvertDiscount[]
): AdvertPricing {
  if (discounts.length === 0) {
    return {
      ...pricing,
      appliedDiscounts: [],
      totalDiscount: 0,
      subtotalBeforeDiscount: pricing.totalCost,
      finalAmountPayable: pricing.totalCost,
      finalAmountPayableMobi: pricing.totalCostMobi,
    };
  }

  const totalDiscount = discounts.reduce((sum, discount) => sum + discount.amount, 0);
  const finalAmount = pricing.totalCost - totalDiscount;

  return {
    ...pricing,
    appliedDiscounts: discounts,
    totalDiscount,
    subtotalBeforeDiscount: pricing.totalCost,
    finalAmountPayable: Math.max(0, finalAmount),
    finalAmountPayableMobi: Math.max(0, finalAmount),
  };
}

/**
 * Calculate all applicable discounts
 */
export function calculateAllDiscounts(
  totalCost: number,
  accreditedTier: AccreditedAdvertiserTier | null,
  activeAdvertCount: number
): AdvertDiscount[] {
  const discounts: AdvertDiscount[] = [];

  // Add accredited advertiser discount
  const accreditedDiscount = calculateAccreditedAdvertiserDiscount(accreditedTier, totalCost);
  if (accreditedDiscount) {
    discounts.push(accreditedDiscount);
  }

  // Add volume discount
  const volumeDiscount = calculateVolumeDiscount(activeAdvertCount, totalCost);
  if (volumeDiscount) {
    discounts.push(volumeDiscount);
  }

  return discounts;
}

/**
 * Get next volume discount tier
 */
export function getNextVolumeDiscountTier(currentAdvertCount: number): { minAdverts: number; percentage: number } | null {
  return VOLUME_DISCOUNTS.find(t => currentAdvertCount < t.minAdverts) || null;
}

/**
 * Get accredited tier requirements
 */
export function getAccreditedTierRequirements(tier: AccreditedAdvertiserTier): { percentage: number; minCampaigns: number } {
  return ACCREDITED_DISCOUNTS[tier];
}

/**
 * Calculate pack discount based on pack ID
 */
export function calculatePackDiscount(
  packId: string,
  totalCost: number,
  packDiscountPercentage: number
): AdvertDiscount | null {
  if (!packId || packDiscountPercentage <= 0) return null;

  const amount = totalCost * (packDiscountPercentage / 100);

  return {
    type: "promotional",
    name: `Slot Pack Discount`,
    percentage: packDiscountPercentage,
    amount,
    description: `${packDiscountPercentage}% discount for slot pack bundle`
  };
}
