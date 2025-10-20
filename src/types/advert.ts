export type AdvertCategory = "pictorial" | "video";

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
  | "multiple-10";

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
}

export interface AdvertFormData {
  category: AdvertCategory;
  type: AdvertType;
  size: AdvertSize;
  dpdPackage: DPDPackageId;
  extendedExposure?: string;
  recurrentAfter?: string;
  recurrentEvery?: string;
  catchmentMarket: CatchmentMarket;
  launchDate?: Date;
  files: File[];
  agreed: boolean;
}

export interface AdvertPricing {
  setupFee: number;
  dpdCost: number;
  extendedExposureCost: number;
  recurrentAfterCost: number;
  recurrentEveryCost: number;
  totalCost: number;
  totalCostMobi: number;
  displayPerDay: number;
  displayFrequency: string;
}

export interface AdvertStatistics {
  impressions: number;
  clicks: number;
  views: number;
  revenue: number;
  lastDisplayed?: Date;
  displayedToday: number;
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
}

export interface DPDPackage {
  id: DPDPackageId;
  name: string;
  dpd: number;
  priceNaira: number;
  priceMobi: number;
  frequency: string;
}
