import { AccreditedAdvertiserTier } from "@/types/advert";

/**
 * Mock data for user accreditation and advert counts
 * In production, this would come from the backend/database
 */

export interface UserDiscountProfile {
  userId: string;
  accreditedTier: AccreditedAdvertiserTier | null;
  totalCampaigns: number;
  activeAdverts: number;
  successfulCampaigns: number;
}

/**
 * Mock user discount profiles for demonstration
 */
const MOCK_USER_PROFILES: Record<string, UserDiscountProfile> = {
  "user-1": {
    userId: "user-1",
    accreditedTier: "gold",
    totalCampaigns: 275,
    activeAdverts: 5,
    successfulCampaigns: 260,
  },
  "user-2": {
    userId: "user-2",
    accreditedTier: "silver",
    totalCampaigns: 120,
    activeAdverts: 3,
    successfulCampaigns: 115,
  },
  "user-3": {
    userId: "user-3",
    accreditedTier: null,
    totalCampaigns: 12,
    activeAdverts: 1,
    successfulCampaigns: 10,
  },
  "current-user": {
    userId: "current-user",
    accreditedTier: "gold",
    totalCampaigns: 280,
    activeAdverts: 8,
    successfulCampaigns: 270,
  },
};

/**
 * Get user discount profile
 * @param userId - User ID (defaults to "current-user" for demo)
 */
export function getUserDiscountProfile(userId: string = "current-user"): UserDiscountProfile {
  return MOCK_USER_PROFILES[userId] || {
    userId,
    accreditedTier: null,
    totalCampaigns: 0,
    activeAdverts: 0,
    successfulCampaigns: 0,
  };
}

/**
 * Get accredited tier from user ID
 */
export function getAccreditedAdvertiserTier(userId: string = "current-user"): AccreditedAdvertiserTier | null {
  const profile = getUserDiscountProfile(userId);
  return profile.accreditedTier;
}

/**
 * Get active advert count from user ID
 */
export function getActiveAdvertCount(userId: string = "current-user"): number {
  const profile = getUserDiscountProfile(userId);
  return profile.activeAdverts;
}
