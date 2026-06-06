// Platform-wide settings managed by Mobiface Admin
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
  lastUpdatedBy: "Mobiface Admin",
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

// Platform Quiz Settings - Managed by Mobiface Admin
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
  lastUpdatedBy: "Mobiface Admin",
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
  lastUpdatedBy: "Mobiface Admin",
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
  lastUpdatedBy: "Mobiface Admin",
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

// ─── Minimum Order Value for Discount Eligibility ───
export let MIN_DISCOUNT_ORDER_VALUE = 50000; // M50,000 minimum total order value

export function setMinDiscountOrderValue(value: number): void {
  if (value >= 10000 && value <= 500000) {
    MIN_DISCOUNT_ORDER_VALUE = value;
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
  maxDiscount: 10,
  maxDiscountMin: 5,
  maxDiscountMax: 10,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobiface Admin",
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

// ─── Question Bank Distribution Settings ───
export interface PlatformQuestionBankDistribution {
  mobifacePercent: number;    // Central bank (default 60%)
  merchantOwnPercent: number; // Merchant's own bank (default 30%)
  otherMerchantsPercent: number; // Other merchants (default 10%)
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformQuestionBankDistribution: PlatformQuestionBankDistribution = {
  mobifacePercent: 60,
  merchantOwnPercent: 30,
  otherMerchantsPercent: 10,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobiface Admin",
};

export function getQuestionBankDistribution(): PlatformQuestionBankDistribution {
  return { ...platformQuestionBankDistribution };
}

export function setQuestionBankDistribution(mobiface: number, merchantOwn: number, otherMerchants: number): boolean {
  if (mobiface + merchantOwn + otherMerchants !== 100) return false;
  if (mobiface < 0 || merchantOwn < 0 || otherMerchants < 0) return false;
  platformQuestionBankDistribution.mobifacePercent = mobiface;
  platformQuestionBankDistribution.merchantOwnPercent = merchantOwn;
  platformQuestionBankDistribution.otherMerchantsPercent = otherMerchants;
  platformQuestionBankDistribution.lastUpdatedAt = new Date();
  return true;
}

// ─── Continue Playing Stake Settings ───
export interface PlatformContinueStakeSettings {
  continuePlayingStakePercent: number;
  continuePlayingStakePercentMin: number;
  continuePlayingStakePercentMax: number;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformContinueStakeSettings: PlatformContinueStakeSettings = {
  continuePlayingStakePercent: 50,
  continuePlayingStakePercentMin: 10,
  continuePlayingStakePercentMax: 100,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobiface Admin",
};

export function getContinuePlayingStakePercent(): number {
  return platformContinueStakeSettings.continuePlayingStakePercent;
}

export function setContinuePlayingStakePercent(newPercent: number): void {
  if (newPercent >= platformContinueStakeSettings.continuePlayingStakePercentMin &&
      newPercent <= platformContinueStakeSettings.continuePlayingStakePercentMax) {
    platformContinueStakeSettings.continuePlayingStakePercent = newPercent;
    platformContinueStakeSettings.lastUpdatedAt = new Date();
  }
}

// ============= REGENERATION FEE SETTINGS =============

export interface PlatformRegenerationFeeSettings {
  regenerationFee: number;
  regenerationFeeMin: number;
  regenerationFeeMax: number;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformRegenerationFeeSettings: PlatformRegenerationFeeSettings = {
  regenerationFee: 100,
  regenerationFeeMin: 10,
  regenerationFeeMax: 10000,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobiface Admin",
};

export function getRegenerationFee(): number {
  return platformRegenerationFeeSettings.regenerationFee;
}

export function setRegenerationFee(newFee: number): void {
  if (newFee >= platformRegenerationFeeSettings.regenerationFeeMin &&
      newFee <= platformRegenerationFeeSettings.regenerationFeeMax) {
    platformRegenerationFeeSettings.regenerationFee = newFee;
    platformRegenerationFeeSettings.lastUpdatedAt = new Date();
  }
}

// ─── Merchant Application Fee Settings ───
export interface PlatformMerchantAppFeeSettings {
  applicationFee: number;
  applicationFeeMin: number;
  applicationFeeMax: number;
  waiverFee: number;
  waiverFeeMin: number;
  waiverFeeMax: number;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformMerchantAppFeeSettings: PlatformMerchantAppFeeSettings = {
  applicationFee: 50000,
  applicationFeeMin: 10000,
  applicationFeeMax: 500000,
  waiverFee: 50000,
  waiverFeeMin: 10000,
  waiverFeeMax: 500000,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobiface Admin",
};

export function getApplicationFee(): number {
  return platformMerchantAppFeeSettings.applicationFee;
}

export function setApplicationFee(value: number): void {
  if (value >= platformMerchantAppFeeSettings.applicationFeeMin &&
      value <= platformMerchantAppFeeSettings.applicationFeeMax) {
    platformMerchantAppFeeSettings.applicationFee = value;
    platformMerchantAppFeeSettings.lastUpdatedAt = new Date();
  }
}

export function getWaiverFee(): number {
  return platformMerchantAppFeeSettings.waiverFee;
}

export function setWaiverFee(value: number): void {
  if (value >= platformMerchantAppFeeSettings.waiverFeeMin &&
      value <= platformMerchantAppFeeSettings.waiverFeeMax) {
    platformMerchantAppFeeSettings.waiverFee = value;
    platformMerchantAppFeeSettings.lastUpdatedAt = new Date();
  }
}

// ─── Merchant Eligibility Threshold Settings ───
export interface PlatformEligibilitySettings {
  verifiedDays: number;
  verifiedDaysMin: number;
  verifiedDaysMax: number;
  invitedFriends: number;
  invitedFriendsMin: number;
  invitedFriendsMax: number;
  friends: number;
  friendsMin: number;
  friendsMax: number;
  followers: number;
  followersMin: number;
  followersMax: number;
  eLibraryContents: number;
  eLibraryContentsMin: number;
  eLibraryContentsMax: number;
  contentLikes: number;
  contentLikesMin: number;
  contentLikesMax: number;
  usersFollowed: number;
  usersFollowedMin: number;
  usersFollowedMax: number;
  registrationFee: number;
  registrationFeeMin: number;
  registrationFeeMax: number;
  imvsdAmount: number;
  imvsdAmountMin: number;
  imvsdAmountMax: number;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformEligibilitySettings: PlatformEligibilitySettings = {
  verifiedDays: 180,
  verifiedDaysMin: 30,
  verifiedDaysMax: 365,
  invitedFriends: 1000,
  invitedFriendsMin: 100,
  invitedFriendsMax: 10000,
  friends: 5000,
  friendsMin: 500,
  friendsMax: 50000,
  followers: 5000,
  followersMin: 500,
  followersMax: 50000,
  eLibraryContents: 100,
  eLibraryContentsMin: 10,
  eLibraryContentsMax: 1000,
  contentLikes: 5000,
  contentLikesMin: 500,
  contentLikesMax: 50000,
  usersFollowed: 500,
  usersFollowedMin: 50,
  usersFollowedMax: 5000,
  registrationFee: 1000000,
  registrationFeeMin: 100000,
  registrationFeeMax: 10000000,
  imvsdAmount: 1000000,
  imvsdAmountMin: 100000,
  imvsdAmountMax: 10000000,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobiface Admin",
};

export function setEligibilitySetting(key: keyof PlatformEligibilitySettings, value: number): void {
  const minKey = `${key}Min` as keyof PlatformEligibilitySettings;
  const maxKey = `${key}Max` as keyof PlatformEligibilitySettings;
  const min = platformEligibilitySettings[minKey];
  const max = platformEligibilitySettings[maxKey];
  if (typeof min === "number" && typeof max === "number" && value >= min && value <= max) {
    (platformEligibilitySettings as any)[key] = value;
    platformEligibilitySettings.lastUpdatedAt = new Date();
  }
}

// Platform Media Access Fee Settings - Managed by Mobiface Admin
// Controls per-content access fee creators set when uploading monetised media
// Range: M5 (min) – M100 (max). Set to 0 to keep content free.
export interface PlatformMediaAccessFeeSettings {
  defaultFee: number;
  minFee: number;
  maxFee: number;
  hardMaxFee: number;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformMediaAccessFeeSettings: PlatformMediaAccessFeeSettings = {
  defaultFee: 10,
  minFee: 5,
  maxFee: 100,
  hardMaxFee: 500,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobiface Admin",
};

export function getMediaAccessFeeDefault(): number {
  return platformMediaAccessFeeSettings.defaultFee;
}

export function getMediaAccessFeeMin(): number {
  return platformMediaAccessFeeSettings.minFee;
}

export function getMediaAccessFeeMax(): number {
  return platformMediaAccessFeeSettings.maxFee;
}

export function setMediaAccessFeeDefault(value: number): void {
  if (value >= platformMediaAccessFeeSettings.minFee &&
      value <= platformMediaAccessFeeSettings.maxFee) {
    platformMediaAccessFeeSettings.defaultFee = value;
    platformMediaAccessFeeSettings.lastUpdatedAt = new Date();
  }
}

export function setMediaAccessFeeMax(value: number): void {
  if (value >= 1 && value <= platformMediaAccessFeeSettings.hardMaxFee) {
    platformMediaAccessFeeSettings.maxFee = value;
    if (platformMediaAccessFeeSettings.defaultFee > value) {
      platformMediaAccessFeeSettings.defaultFee = value;
    }
    platformMediaAccessFeeSettings.lastUpdatedAt = new Date();
  }
}

// Platform Content Posting Fees - Managed by Mobiface Admin
// Charged from creator's Mobi Wallet when a piece of content is posted.
// Video/Audio media: M300 – M500. Still media (Photo/Article/News/PDF): M200 – M300.
export type ContentMediaType =
  | "Photo"
  | "Article"
  | "News"
  | "PDF"
  | "URL"
  | "Video"
  | "Audio";

export interface PlatformContentPostingFee {
  min: number;
  max: number;
  default: number;
}

export interface PlatformContentPostingFees {
  motion: PlatformContentPostingFee;   // Video / Audio
  still: PlatformContentPostingFee;    // Photo / Article / News / PDF / URL
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformContentPostingFees: PlatformContentPostingFees = {
  motion: { min: 300, max: 500, default: 300 },
  still: { min: 200, max: 300, default: 200 },
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobiface Admin",
};

export function isMotionMedia(type: ContentMediaType | string): boolean {
  return type === "Video" || type === "Audio";
}

export function getContentPostingFee(type: ContentMediaType | string): number {
  return isMotionMedia(type)
    ? platformContentPostingFees.motion.default
    : platformContentPostingFees.still.default;
}

export function getContentPostingFeeRange(
  type: ContentMediaType | string
): { min: number; max: number } {
  return isMotionMedia(type)
    ? { min: platformContentPostingFees.motion.min, max: platformContentPostingFees.motion.max }
    : { min: platformContentPostingFees.still.min, max: platformContentPostingFees.still.max };
}

/**
 * Max images a single post can include (Photo type).
 * 1st image is the base fee; each extra image adds MAX_EXTRA_IMAGE_FEE.
 */
export const MAX_IMAGES_PER_POST = 3;
export const EXTRA_IMAGE_FEE = 50;

/**
 * Computes the actual Content Posting Fee given the media type and number of
 * attached images. Photo posts scale: 1 img = base (M200), 2 imgs = M250,
 * 3 imgs = M300. Motion media and other still types use the flat default.
 */
export function getContentPostingFeeForCount(
  type: ContentMediaType | string,
  imageCount: number,
): number {
  const base = getContentPostingFee(type);
  if (type === "Photo") {
    const count = Math.max(1, Math.min(MAX_IMAGES_PER_POST, imageCount || 1));
    return base + (count - 1) * EXTRA_IMAGE_FEE;
  }
  return base;
}


