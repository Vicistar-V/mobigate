export type AdvertCategory = "pictorial" | "video";

export type DisplayMode = "single" | "multiple" | "rollout";

export type MultipleDisplayCount = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 15;

export type SubscriptionDuration = 1 | 3 | 4 | 6 | 9 | 12 | 18 | 24;

export type AdvertType = 
  | "single" 
  | "multiple-2" 
  | "multiple-3" 
  | "multiple-4" 
  | "multiple-5" 
  | "multiple-6" 
  | "multiple-7" 
  | "multiple-8" 
  | "multiple-9" 
  | "multiple-10"
  | "multiple-15"
  | "rollout-2"
  | "rollout-3"
  | "rollout-4"
  | "rollout-5"
  | "rollout-6"
  | "rollout-7"
  | "rollout-8"
  | "rollout-9"
  | "rollout-10"
  | "rollout-15";

// Helper function to convert display mode + count to AdvertType
export function getAdvertType(mode: DisplayMode, count?: MultipleDisplayCount): AdvertType {
  if (mode === "single") return "single";
  if (mode === "rollout" && count) return `rollout-${count}` as AdvertType;
  return `multiple-${count}` as AdvertType;
}

// Helper function to extract display mode from AdvertType
export function getDisplayMode(type: AdvertType): DisplayMode {
  if (type === "single") return "single";
  if (type.startsWith("rollout-")) return "rollout";
  return "multiple";
}

// Helper function to extract multiple count from AdvertType
export function getMultipleCount(type: AdvertType): MultipleDisplayCount | undefined {
  if (type === "single") return undefined;
  const match = type.match(/(?:multiple|rollout)-(\d+)/);
  return match ? parseInt(match[1]) as MultipleDisplayCount : undefined;
}

export type AdvertSize = 
  | "2x3" 
  | "2x6" 
  | "2.5x3" 
  | "2.5x6" 
  | "3.5x3" 
  | "3.5x6" 
  | "5x6" 
  | "6.5x3" 
  | "6.5x6" 
  | "10x6";

export type DPDPackageId = 
  | "basic" 
  | "standard" 
  | "professional" 
  | "business" 
  | "enterprise" 
  | "entrepreneur" 
  | "deluxe" 
  | "deluxe-super" 
  | "deluxe-super-plus" 
  | "deluxe-silver" 
  | "deluxe-bronze" 
  | "deluxe-gold" 
  | "deluxe-gold-plus" 
  | "deluxe-diamond" 
  | "deluxe-diamond-plus" 
  | "deluxe-platinum" 
  | "deluxe-platinum-plus" 
  | "bumper-gold" 
  | "bumper-diamond" 
  | "bumper-platinum" 
  | "bumper-infinity" 
  | "unlimited";

export type AdvertStatus = "draft" | "pending" | "approved" | "rejected" | "active" | "paused" | "expired";

export interface CatchmentMarket {
  ownCity: number;
  ownState: number;
  ownCountry: number;
  foreignCountries: number;
  popularSearches: number;
  random: number;
  others: number;
  ageRange?: {
    min: number;
    max: number;
  };
}

export type ContactMethod = "whatsapp" | "call";

export interface AdvertFormData {
  category: AdvertCategory;
  displayMode: DisplayMode;
  multipleCount?: MultipleDisplayCount;
  type: AdvertType;
  size: AdvertSize;
  dpdPackage: DPDPackageId;
  subscriptionMonths: SubscriptionDuration;
  extendedExposure?: string;
  recurrentAfter?: string;
  recurrentEvery?: string;
  catchmentMarket: CatchmentMarket;
  launchDate?: Date;
  files: File[];
  agreed: boolean;
  contactPhone?: string;
  contactMethod?: ContactMethod;
  contactEmail?: string;
  websiteUrl?: string;
  catalogueUrl?: string;
  logoUrl?: string;
  advertiserName?: string;
  advertDescription?: string;
  advertHeadline?: string;
  advertCTAText?: string;
}

export type DiscountType = "accredited_advertiser" | "volume_based" | "promotional" | "custom";

export type AccreditedAdvertiserTier = "bronze" | "silver" | "gold" | "platinum";

export interface AdvertDiscount {
  type: DiscountType;
  name: string;
  percentage: number;
  amount: number;
  description?: string;
}

export interface AdvertPricing {
  baseSetupFee?: number;
  sizeMultiplier?: number;
  sizeFee?: number;
  setupFee: number;
  subscriptionMonths: number;
  monthlyDpdCost: number;
  subscriptionDiscount: number;
  subscriptionDiscountAmount: number;
  totalDpdCost: number;
  dpdCost: number;
  extendedExposureCost: number;
  recurrentAfterCost: number;
  recurrentEveryCost: number;
  totalCost: number;
  totalCostMobi: number;
  totalSubscriptionCost: number;
  displayPerDay: number;
  displayFrequency: string;
  discounts?: AdvertDiscount[];
  discountedTotal?: number;
  discountedTotalMobi?: number;
  appliedDiscounts?: AdvertDiscount[];
  totalDiscount?: number;
  subtotalBeforeDiscount?: number;
  finalAmountPayable?: number;
  finalAmountPayableMobi?: number;
}

export interface AdvertStatistics {
  impressions: number;
  clicks: number;
  views: number;
  revenue: number;
  lastDisplayed?: Date;
  displayedToday: number;
}

// Slot Pack types
export type SlotPackId = "entry" | "basic" | "standard" | "business" | "enterprise";

export interface SlotPack {
  id: SlotPackId;
  name: string;
  minSlots: number;
  maxSlots: number;
  discountPercentage: number;
  description: string;
}

export interface AdvertSlot {
  id: string;
  slotNumber: number;
  formData: AdvertFormData;
  pricing: AdvertPricing;
  status: "empty" | "filled" | "editing";
  createdAt: Date;
  updatedAt: Date;
}

export interface SlotPackDraft {
  id: string;
  userId: string;
  packId: SlotPackId;
  slots: AdvertSlot[];
  status: "draft" | "ready" | "submitted";
  createdAt: Date;
  updatedAt: Date;
  packDiscount?: AdvertDiscount;
  totalPackCost?: number;
  totalPackCostMobi?: number;
}

export interface SavedAdvert {
  id: string;
  userId: string;
  category: AdvertCategory;
  type: AdvertType;
  size: AdvertSize;
  dpdPackage: DPDPackageId;
  extendedExposure?: string;
  recurrentAfter?: string;
  recurrentEvery?: string;
  catchmentMarket: CatchmentMarket;
  launchDate: Date;
  fileUrls: string[];
  status: AdvertStatus;
  pricing: AdvertPricing;
  statistics: AdvertStatistics;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  expiresAt?: Date;
  rejectedReason?: string;
  approvedReason?: string;
  packId?: string; // Reference to SlotPackDraft if part of a pack
  slotNumber?: number; // Position in the pack
  contactPhone?: string;
  contactMethod?: ContactMethod;
  contactEmail?: string;
  websiteUrl?: string;
  catalogueUrl?: string;
  logoUrl?: string;
  advertiserName?: string;
  advertDescription?: string;
  advertHeadline?: string;
  advertCTAText?: string;
}

export interface DPDPackage {
  id: DPDPackageId;
  name: string;
  dpd: number;
  priceNaira: number;
  priceMobi: number;
  frequency: string;
}
