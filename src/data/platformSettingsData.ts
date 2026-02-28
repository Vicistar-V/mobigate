// Platform-wide settings managed by Mobigate Admin
// These settings are hidden from and cannot be modified by Community Admins

export interface PlatformWithdrawalSettings {
  minimumWithdrawal: number;
  minimumWithdrawalMin: number;
  minimumWithdrawalMax: number;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformWithdrawalSettings: PlatformWithdrawalSettings = {
  minimumWithdrawal: 10000,
  minimumWithdrawalMin: 1000,
  minimumWithdrawalMax: 50000,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobigate Admin",
};

export function getMinimumWithdrawal(): number {
  return platformWithdrawalSettings.minimumWithdrawal;
}

export function setMinimumWithdrawal(newMinimum: number): void {
  if (newMinimum >= platformWithdrawalSettings.minimumWithdrawalMin && 
      newMinimum <= platformWithdrawalSettings.minimumWithdrawalMax) {
    platformWithdrawalSettings.minimumWithdrawal = newMinimum;
    platformWithdrawalSettings.lastUpdatedAt = new Date();
  }
}

// Platform fee settings
export interface PlatformFeeSettings {
  serviceChargeRate: number;
  serviceChargeMin: number;
  serviceChargeMax: number;
}

export const platformFeeSettings: PlatformFeeSettings = {
  serviceChargeRate: 20,
  serviceChargeMin: 15,
  serviceChargeMax: 30,
};

// Platform Quiz Settings - Managed by Mobigate Admin
export interface PlatformQuizSettings {
  // Separate timers for objective and non-objective questions
  objectiveTimePerQuestion: number;     // seconds (default 10)
  objectiveTimeMin: number;
  objectiveTimeMax: number;
  nonObjectiveTimePerQuestion: number;  // seconds (default 15)
  nonObjectiveTimeMin: number;
  nonObjectiveTimeMax: number;
  partialWinPercentage: number;
  partialWinMin: number;
  partialWinMax: number;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformQuizSettings: PlatformQuizSettings = {
  objectiveTimePerQuestion: 10,
  objectiveTimeMin: 6,
  objectiveTimeMax: 10,
  nonObjectiveTimePerQuestion: 15,
  nonObjectiveTimeMin: 6,
  nonObjectiveTimeMax: 15,
  partialWinPercentage: 20,
  partialWinMin: 10,
  partialWinMax: 50,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobigate Admin",
};

// Objective timer getters/setters
export function getObjectiveTimePerQuestion(): number {
  return platformQuizSettings.objectiveTimePerQuestion;
}

export function setObjectiveTimePerQuestion(newTime: number): void {
  if (newTime >= platformQuizSettings.objectiveTimeMin && 
      newTime <= platformQuizSettings.objectiveTimeMax) {
    platformQuizSettings.objectiveTimePerQuestion = newTime;
    platformQuizSettings.lastUpdatedAt = new Date();
  }
}

// Non-objective timer getters/setters
export function getNonObjectiveTimePerQuestion(): number {
  return platformQuizSettings.nonObjectiveTimePerQuestion;
}

export function setNonObjectiveTimePerQuestion(newTime: number): void {
  if (newTime >= platformQuizSettings.nonObjectiveTimeMin && 
      newTime <= platformQuizSettings.nonObjectiveTimeMax) {
    platformQuizSettings.nonObjectiveTimePerQuestion = newTime;
    platformQuizSettings.lastUpdatedAt = new Date();
  }
}

// Backward compatibility alias
export function getDefaultTimePerQuestion(): number {
  return getObjectiveTimePerQuestion();
}

export function setDefaultTimePerQuestion(newTime: number): void {
  setObjectiveTimePerQuestion(newTime);
}

// Partial win percentage
export function getPartialWinPercentage(): number {
  return platformQuizSettings.partialWinPercentage;
}

export function setPartialWinPercentage(newPercentage: number): void {
  if (newPercentage >= platformQuizSettings.partialWinMin && 
      newPercentage <= platformQuizSettings.partialWinMax) {
    platformQuizSettings.partialWinPercentage = newPercentage;
    platformQuizSettings.lastUpdatedAt = new Date();
  }
}

// Platform Question View Fee Settings
export interface PlatformQuestionViewSettings {
  questionViewFee: number;
  questionViewFeeMin: number;
  questionViewFeeMax: number;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformQuestionViewSettings: PlatformQuestionViewSettings = {
  questionViewFee: 2000,
  questionViewFeeMin: 500,
  questionViewFeeMax: 10000,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobigate Admin",
};

export function getQuestionViewFee(): number {
  return platformQuestionViewSettings.questionViewFee;
}

export function setQuestionViewFee(newFee: number): void {
  if (newFee >= platformQuestionViewSettings.questionViewFeeMin && 
      newFee <= platformQuestionViewSettings.questionViewFeeMax) {
    platformQuestionViewSettings.questionViewFee = newFee;
    platformQuestionViewSettings.lastUpdatedAt = new Date();
  }
}

// Platform Merchant Solvency Settings
export interface PlatformSolvencySettings {
  merchantSolvencyPercent: number;
  merchantSolvencyMin: number;
  merchantSolvencyMax: number;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformSolvencySettings: PlatformSolvencySettings = {
  merchantSolvencyPercent: 70,
  merchantSolvencyMin: 50,
  merchantSolvencyMax: 100,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobigate Admin",
};

export function getMerchantSolvencyPercent(): number {
  return platformSolvencySettings.merchantSolvencyPercent;
}

export function setMerchantSolvencyPercent(newPercent: number): void {
  if (newPercent >= platformSolvencySettings.merchantSolvencyMin && 
      newPercent <= platformSolvencySettings.merchantSolvencyMax) {
    platformSolvencySettings.merchantSolvencyPercent = newPercent;
    platformSolvencySettings.lastUpdatedAt = new Date();
  }
}

// ─── Platform Voucher Discount Settings (Tiered) ───
export interface PlatformVoucherDiscountSettings {
  tierSize: number;        // bundles per tier group (default 5)
  tierSizeMin: number;
  tierSizeMax: number;
  baseRate: number;        // % discount for first tier (default 1.0)
  baseRateMin: number;
  baseRateMax: number;
  incrementRate: number;   // % added per subsequent tier (default 0.5)
  incrementRateMin: number;
  incrementRateMax: number;
  maxDiscount: number;     // absolute cap % (default 25)
  maxDiscountMin: number;
  maxDiscountMax: number;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformVoucherDiscountSettings: PlatformVoucherDiscountSettings = {
  tierSize: 5,
  tierSizeMin: 3,
  tierSizeMax: 10,
  baseRate: 1.0,
  baseRateMin: 0.5,
  baseRateMax: 5,
  incrementRate: 0.5,
  incrementRateMin: 0.25,
  incrementRateMax: 2,
  maxDiscount: 25,
  maxDiscountMin: 5,
  maxDiscountMax: 50,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobigate Admin",
};

// Backward-compatible alias
export function getDiscountPercentPerBundle(): number {
  return platformVoucherDiscountSettings.baseRate;
}

export function setDiscountPercentPerBundle(value: number): void {
  platformVoucherDiscountSettings.baseRate = value;
  platformVoucherDiscountSettings.lastUpdatedAt = new Date();
}

export function setTierSize(value: number): void {
  if (value >= platformVoucherDiscountSettings.tierSizeMin &&
      value <= platformVoucherDiscountSettings.tierSizeMax) {
    platformVoucherDiscountSettings.tierSize = value;
    platformVoucherDiscountSettings.lastUpdatedAt = new Date();
  }
}

export function setBaseRate(value: number): void {
  if (value >= platformVoucherDiscountSettings.baseRateMin &&
      value <= platformVoucherDiscountSettings.baseRateMax) {
    platformVoucherDiscountSettings.baseRate = value;
    platformVoucherDiscountSettings.lastUpdatedAt = new Date();
  }
}

export function setIncrementRate(value: number): void {
  if (value >= platformVoucherDiscountSettings.incrementRateMin &&
      value <= platformVoucherDiscountSettings.incrementRateMax) {
    platformVoucherDiscountSettings.incrementRate = value;
    platformVoucherDiscountSettings.lastUpdatedAt = new Date();
  }
}

export function setMaxDiscount(value: number): void {
  if (value >= platformVoucherDiscountSettings.maxDiscountMin &&
      value <= platformVoucherDiscountSettings.maxDiscountMax) {
    platformVoucherDiscountSettings.maxDiscount = value;
    platformVoucherDiscountSettings.lastUpdatedAt = new Date();
  }
}

export function getMaxDiscountPercent(): number {
  return platformVoucherDiscountSettings.maxDiscount;
}

export function setMaxDiscountPercent(value: number): void {
  setMaxDiscount(value);
}

/** Calculate the tiered discount for a given bundle count */
export function getTieredDiscount(bundleCount: number): { tier: number; discountPercent: number; tierLabel: string } {
  const s = platformVoucherDiscountSettings;
  if (bundleCount <= 0) return { tier: 0, discountPercent: 0, tierLabel: "No bundles" };
  const tier = Math.ceil(bundleCount / s.tierSize);
  const raw = s.baseRate + (tier - 1) * s.incrementRate;
  const discountPercent = Math.min(Math.round(raw * 100) / 100, s.maxDiscount);
  const rangeStart = (tier - 1) * s.tierSize + 1;
  const rangeEnd = tier * s.tierSize;
  const tierLabel = `${rangeStart}–${rangeEnd} bundles`;
  return { tier, discountPercent, tierLabel };
}

/** Generate a preview of all tiers up to max discount */
export function getTierPreview(): Array<{ tier: number; rangeStart: number; rangeEnd: number; discountPercent: number }> {
  const s = platformVoucherDiscountSettings;
  const tiers: Array<{ tier: number; rangeStart: number; rangeEnd: number; discountPercent: number }> = [];
  let t = 1;
  while (true) {
    const raw = s.baseRate + (t - 1) * s.incrementRate;
    const disc = Math.min(Math.round(raw * 100) / 100, s.maxDiscount);
    const rangeStart = (t - 1) * s.tierSize + 1;
    const rangeEnd = t * s.tierSize;
    tiers.push({ tier: t, rangeStart, rangeEnd, discountPercent: disc });
    if (disc >= s.maxDiscount) break;
    t++;
    if (t > 100) break; // safety
  }
  return tiers;
}
