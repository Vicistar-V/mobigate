import { AdvertCategory, AdvertType, DPDPackageId, AdvertPricing, AccreditedAdvertiserTier, AdvertSize, SubscriptionDuration } from "@/types/advert";
import { calculateAllDiscounts, applyDiscounts } from "./advertDiscounts";

export type { AdvertPricing };

// Setup fees for different combinations (24-month periodic)
const SETUP_FEES = {
  pictorial: {
    single: 30000,
    "multiple-2": 40000,
    "multiple-3": 60000,
    "multiple-4": 80000,
    "multiple-5": 100000,
    "multiple-6": 120000,
    "multiple-7": 140000,
    "multiple-8": 160000,
    "multiple-9": 180000,
    "multiple-10": 200000,
  },
  video: {
    single: 45000,
    "multiple-2": 60000,
    "multiple-3": 90000,
    "multiple-4": 120000,
    "multiple-5": 150000,
    "multiple-6": 180000,
    "multiple-7": 210000,
    "multiple-8": 240000,
    "multiple-9": 270000,
    "multiple-10": 300000,
  },
};

// DPD Package pricing
const DPD_PACKAGES: Record<DPDPackageId, { dpd: number; price: number; frequency: string }> = {
  basic: { dpd: 1000, price: 10000, frequency: "1 Display per 16 Minutes" },
  standard: { dpd: 2000, price: 20000, frequency: "1 Display per 8 Minutes" },
  professional: { dpd: 3000, price: 30000, frequency: "1 Display per 5 Minutes" },
  business: { dpd: 4000, price: 40000, frequency: "1 Display per 4 Minutes" },
  enterprise: { dpd: 5000, price: 50000, frequency: "1 Display per 3 Minutes" },
  entrepreneur: { dpd: 6000, price: 60000, frequency: "1 Display per 2.5 Minutes" },
  deluxe: { dpd: 7000, price: 70000, frequency: "1 Display per 2 Minutes" },
  "deluxe-super": { dpd: 8000, price: 80000, frequency: "1 Display per 1.5 Minutes" },
  "deluxe-super-plus": { dpd: 9000, price: 90000, frequency: "1 Display per 1 Minute" },
  "deluxe-silver": { dpd: 10000, price: 100000, frequency: "2 Displays per 1 Minute" },
  "deluxe-bronze": { dpd: 12000, price: 120000, frequency: "3 Displays per 1 Minute" },
  "deluxe-gold": { dpd: 14000, price: 140000, frequency: "4 Displays per 1 Minute" },
  "deluxe-gold-plus": { dpd: 16000, price: 160000, frequency: "5 Displays per 1 Minute" },
  "deluxe-diamond": { dpd: 18000, price: 180000, frequency: "6 Displays per 1 Minute" },
  "deluxe-diamond-plus": { dpd: 20000, price: 200000, frequency: "7 Displays per 1 Minute" },
  "deluxe-platinum": { dpd: 25000, price: 250000, frequency: "10 Displays per 1 Minute" },
  "deluxe-platinum-plus": { dpd: 30000, price: 300000, frequency: "15 Displays per 1 Minute" },
  "bumper-gold": { dpd: 35000, price: 350000, frequency: "20 Displays per 1 Minute" },
  "bumper-diamond": { dpd: 40000, price: 400000, frequency: "25 Displays per 1 Minute" },
  "bumper-platinum": { dpd: 45000, price: 450000, frequency: "30 Displays per 1 Minute" },
  "bumper-infinity": { dpd: 50000, price: 500000, frequency: "35 Displays per 1 Minute" },
  unlimited: { dpd: Infinity, price: 600000, frequency: "Unlimited Displays per 1 Minute" },
};

// Extended exposure duration additional charges
const EXTENDED_EXPOSURE_CHARGES: Record<string, number> = {
  "extra-1": 0.12, // 12%
  "extra-2": 0.14, // 14%
  "extra-3": 0.16, // 16%
  "extra-4": 0.18, // 18%
  "extra-5": 0.20, // 20%
  "extra-6": 0.22, // 22%
  "extra-7": 0.24, // 24%
  "extra-8": 0.26, // 26%
  "extra-9": 0.28, // 28%
  "extra-10": 0.30, // 30%
};

// Recurrent exposure "after" charges
const RECURRENT_AFTER_CHARGES: Record<string, number> = {
  "after-10m": 0.10,
  "after-30m": 0.10,
  "after-1h": 0.10,
  "after-3h": 0.10,
  "after-6h": 0.10,
  "after-12h": 0.10,
  "after-18h": 0.10,
  "after-24h": 0.10,
};

// Recurrent exposure "every" charges
const RECURRENT_EVERY_CHARGES: Record<string, number> = {
  "every-10m": 0.35,
  "every-30m": 0.30,
  "every-1h": 0.25,
  "every-3h": 0.20,
  "every-6h": 0.15,
  "every-12h": 0.12,
  "every-18h": 0.10,
  "every-24h": 0.09,
  "every-30h": 0.08,
  "every-36h": 0.07,
  "every-42h": 0.06,
  "every-48h": 0.05,
};

// Size multipliers for SINGLE adverts (as decimal)
const SIZE_MULTIPLIERS_SINGLE: Record<AdvertSize, number> = {
  "2x3": 0.00,   // 0% - FREE
  "2x6": 0.02,   // 2%
  "2.5x3": 0.00, // 0% - FREE
  "2.5x6": 0.00, // 0% - FREE
  "3.5x3": 0.01, // 1%
  "3.5x6": 0.03, // 3%
  "5x6": 0.05,   // 5%
  "6.5x3": 0.065,// 6.5%
  "6.5x6": 0.07, // 7%
  "10x6": 0.10,  // 10%
};

// Size multipliers for MULTIPLE adverts (as decimal)
const SIZE_MULTIPLIERS_MULTIPLE: Record<AdvertSize, number> = {
  "2x3": 0.03,   // 3%
  "2x6": 0.07,   // 7%
  "2.5x3": 0.03, // 3%
  "2.5x6": 0.05, // 5%
  "3.5x3": 0.06, // 6%
  "3.5x6": 0.07, // 7%
  "5x6": 0.12,   // 12%
  "6.5x3": 0.12, // 12%
  "6.5x6": 0.15, // 15%
  "10x6": 0.20,  // 20%
};

// Subscription volume discounts (applies to DPD cost only)
const SUBSCRIPTION_DISCOUNTS: Record<SubscriptionDuration, number> = {
  1: 0.00,   // 0% - 30 days
  3: 0.00,   // 0% - 90 days
  4: 0.00,   // 0% - 120 days
  6: 0.05,   // 5% - 180 days
  9: 0.07,   // 7% - 270 days
  12: 0.10,  // 10% - 360 days
  18: 0.12,  // 12% - 540 days
  24: 0.15,  // 15% - 720 days
};

export function calculateAdvertPricing(
  category: AdvertCategory,
  type: AdvertType,
  size: AdvertSize,
  dpdPackage: DPDPackageId,
  subscriptionMonths: SubscriptionDuration,
  extendedExposure?: string,
  recurrentAfter?: string,
  recurrentEvery?: string,
  accreditedTier?: AccreditedAdvertiserTier | null,
  activeAdvertCount: number = 0
): AdvertPricing {
  // Get base setup fee (before size adjustment)
  const baseSetupFee = SETUP_FEES[category][type];

  // Get DPD package info
  const dpdInfo = DPD_PACKAGES[dpdPackage];
  const monthlyDpdCost = dpdInfo.price;

  // Calculate base cost (setup + DPD before size adjustment)
  const baseCostBeforeSize = baseSetupFee + monthlyDpdCost;

  // Determine if single or multiple advert
  const isSingle = type === "single";
  const sizeMultiplier = isSingle 
    ? SIZE_MULTIPLIERS_SINGLE[size] 
    : SIZE_MULTIPLIERS_MULTIPLE[size];

  // Calculate size fee (applies to both setup + DPD)
  const sizeFee = Math.round(baseCostBeforeSize * sizeMultiplier);

  // Calculate final setup fee (proportional part of size fee) - ONE-TIME
  const setupFee = baseSetupFee + Math.round(sizeFee * (baseSetupFee / baseCostBeforeSize));

  // Calculate subscription discount (applies ONLY to DPD cost)
  const subscriptionDiscountRate = SUBSCRIPTION_DISCOUNTS[subscriptionMonths];
  const subscriptionDiscountAmount = Math.round(monthlyDpdCost * subscriptionMonths * subscriptionDiscountRate);
  
  // Calculate total DPD cost after subscription discount
  const totalDpdCost = Math.round((monthlyDpdCost * subscriptionMonths) - subscriptionDiscountAmount);

  // Calculate monthly base cost for optional charges (setup + DPD after size adjustment)
  const monthlyBaseCost = baseCostBeforeSize + sizeFee;

  // Calculate monthly optional costs
  const monthlyExtendedExposureCost = extendedExposure && EXTENDED_EXPOSURE_CHARGES[extendedExposure]
    ? Math.round(monthlyBaseCost * EXTENDED_EXPOSURE_CHARGES[extendedExposure])
    : 0;

  const monthlyRecurrentAfterCost = recurrentAfter && RECURRENT_AFTER_CHARGES[recurrentAfter]
    ? Math.round(monthlyBaseCost * RECURRENT_AFTER_CHARGES[recurrentAfter])
    : 0;

  const monthlyRecurrentEveryCost = recurrentEvery && RECURRENT_EVERY_CHARGES[recurrentEvery]
    ? Math.round(monthlyBaseCost * RECURRENT_EVERY_CHARGES[recurrentEvery])
    : 0;

  // Total optional costs for entire subscription period
  const totalExtendedExposureCost = monthlyExtendedExposureCost * subscriptionMonths;
  const totalRecurrentAfterCost = monthlyRecurrentAfterCost * subscriptionMonths;
  const totalRecurrentEveryCost = monthlyRecurrentEveryCost * subscriptionMonths;

  // Total subscription cost (setup is one-time)
  const totalSubscriptionCost = setupFee + totalDpdCost + totalExtendedExposureCost + totalRecurrentAfterCost + totalRecurrentEveryCost;

  // For backward compatibility, keep totalCost (monthly equivalent)
  const totalCost = monthlyBaseCost + monthlyExtendedExposureCost + monthlyRecurrentAfterCost + monthlyRecurrentEveryCost;

  // Base pricing without additional discounts
  const basePricing: AdvertPricing = {
    baseSetupFee,
    sizeMultiplier,
    sizeFee,
    setupFee,
    subscriptionMonths,
    monthlyDpdCost,
    subscriptionDiscount: subscriptionDiscountRate,
    subscriptionDiscountAmount,
    totalDpdCost,
    dpdCost: monthlyDpdCost, // Keep for compatibility
    extendedExposureCost: totalExtendedExposureCost,
    recurrentAfterCost: totalRecurrentAfterCost,
    recurrentEveryCost: totalRecurrentEveryCost,
    totalCost,
    totalCostMobi: totalCost,
    totalSubscriptionCost,
    displayPerDay: dpdInfo.dpd,
    displayFrequency: dpdInfo.frequency,
  };

  // Calculate and apply additional discounts (accredited, volume)
  const discounts = calculateAllDiscounts(
    totalSubscriptionCost,
    accreditedTier || null,
    activeAdvertCount
  );

  return applyDiscounts(basePricing, discounts);
}

export function getDPDPackageInfo(packageId: DPDPackageId) {
  return DPD_PACKAGES[packageId];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatMobi(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
  }).format(amount) + " Mobi";
}

/**
 * Get setup fee description for display
 */
export function getSetupFeeDescription(category: AdvertCategory, type: AdvertType): string {
  const setupFee = SETUP_FEES[category][type];
  const typeLabel = type === "single" ? "Single Display" : `${type.replace("multiple-", "")}-in-1 Multiple Display`;
  return `${typeLabel} Setup Fee (${category === "pictorial" ? "Pictorial" : "Video"})`;
}

/**
 * Get required file count based on advert type
 */
export function getRequiredFileCount(type: AdvertType): number {
  if (type === "single") return 1;
  const match = type.match(/multiple-(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

/**
 * Get size multiplier for display mode/type
 */
export function getSizeMultiplier(type: AdvertType, size: AdvertSize): number {
  const isSingle = type === "single";
  return isSingle 
    ? SIZE_MULTIPLIERS_SINGLE[size] 
    : SIZE_MULTIPLIERS_MULTIPLE[size];
}

/**
 * Get size fee description for display
 */
export function getSizeFeeDescription(type: AdvertType, size: AdvertSize): string {
  const multiplier = getSizeMultiplier(type, size);
  const percentage = (multiplier * 100).toFixed(1).replace(/\.0$/, '');
  
  if (multiplier === 0) {
    return "FREE (0% Size Fee)";
  }
  
  return `+${percentage}% Size Fee`;
}

/**
 * Get subscription information
 */
export function getSubscriptionInfo(months: SubscriptionDuration) {
  return {
    months,
    days: months * 30,
    discount: SUBSCRIPTION_DISCOUNTS[months],
    discountLabel: `${(SUBSCRIPTION_DISCOUNTS[months] * 100).toFixed(0)}%`
  };
}
