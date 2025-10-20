import { AdvertCategory, AdvertType, DPDPackageId, AdvertPricing } from "@/types/advert";

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
  basic: { dpd: 100, price: 1500, frequency: "1 Display per 16 Minutes" },
  standard: { dpd: 200, price: 2500, frequency: "1 Display per 8 Minutes" },
  professional: { dpd: 300, price: 5000, frequency: "1 Display per 5 Minutes" },
  business: { dpd: 400, price: 7500, frequency: "1 Display per 4 Minutes" },
  enterprise: { dpd: 500, price: 10000, frequency: "1 Display per 3 Minutes" },
  entrepreneur: { dpd: 600, price: 12500, frequency: "1 Display per 2.5 Minutes" },
  deluxe: { dpd: 700, price: 15000, frequency: "1 Display per 2 Minutes" },
  "deluxe-super": { dpd: 800, price: 17500, frequency: "1 Display per 1.5 Minutes" },
  "deluxe-super-plus": { dpd: 900, price: 20000, frequency: "1 Display per 1 Minute" },
  "deluxe-silver": { dpd: 1000, price: 22500, frequency: "2 Displays per 1 Minute" },
  "deluxe-bronze": { dpd: 1200, price: 25000, frequency: "3 Displays per 1 Minute" },
  "deluxe-gold": { dpd: 1400, price: 27500, frequency: "4 Displays per 1 Minute" },
  "deluxe-gold-plus": { dpd: 1600, price: 30000, frequency: "5 Displays per 1 Minute" },
  "deluxe-diamond": { dpd: 1800, price: 32500, frequency: "6 Displays per 1 Minute" },
  "deluxe-diamond-plus": { dpd: 2000, price: 35000, frequency: "7 Displays per 1 Minute" },
  "deluxe-platinum": { dpd: 2500, price: 40000, frequency: "10 Displays per 1 Minute" },
  "deluxe-platinum-plus": { dpd: 3000, price: 45000, frequency: "15 Displays per 1 Minute" },
  "bumper-gold": { dpd: 3500, price: 50000, frequency: "20 Displays per 1 Minute" },
  "bumper-diamond": { dpd: 4000, price: 55000, frequency: "25 Displays per 1 Minute" },
  "bumper-platinum": { dpd: 4500, price: 60000, frequency: "30 Displays per 1 Minute" },
  "bumper-infinity": { dpd: 5000, price: 65000, frequency: "35 Displays per 1 Minute" },
  unlimited: { dpd: Infinity, price: 100000, frequency: "Unlimited Displays per 1 Minute" },
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

export function calculateAdvertPricing(
  category: AdvertCategory,
  type: AdvertType,
  dpdPackage: DPDPackageId,
  extendedExposure?: string,
  recurrentAfter?: string,
  recurrentEvery?: string
): AdvertPricing {
  // Get setup fee
  const setupFee = SETUP_FEES[category][type];

  // Get DPD package info
  const dpdInfo = DPD_PACKAGES[dpdPackage];
  const dpdCost = dpdInfo.price;

  // Calculate base cost (setup + DPD)
  const baseCost = setupFee + dpdCost;

  // Calculate extended exposure cost
  let extendedExposureCost = 0;
  if (extendedExposure && EXTENDED_EXPOSURE_CHARGES[extendedExposure]) {
    extendedExposureCost = baseCost * EXTENDED_EXPOSURE_CHARGES[extendedExposure];
  }

  // Calculate recurrent after cost
  let recurrentAfterCost = 0;
  if (recurrentAfter && RECURRENT_AFTER_CHARGES[recurrentAfter]) {
    recurrentAfterCost = baseCost * RECURRENT_AFTER_CHARGES[recurrentAfter];
  }

  // Calculate recurrent every cost
  let recurrentEveryCost = 0;
  if (recurrentEvery && RECURRENT_EVERY_CHARGES[recurrentEvery]) {
    recurrentEveryCost = baseCost * RECURRENT_EVERY_CHARGES[recurrentEvery];
  }

  // Total cost
  const totalCost = baseCost + extendedExposureCost + recurrentAfterCost + recurrentEveryCost;

  return {
    setupFee,
    dpdCost,
    extendedExposureCost,
    recurrentAfterCost,
    recurrentEveryCost,
    totalCost,
    totalCostMobi: totalCost, // 1 Naira = 1 Mobi in this system
    displayPerDay: dpdInfo.dpd,
    displayFrequency: dpdInfo.frequency,
  };
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
