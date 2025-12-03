/**
 * Calculates the community tier designation based on member count.
 * Tiers are assigned as follows:
 * - Tier-1: 1-200 Members
 * - Tier-2: 201-300 Members
 * - Tier-3: 301-400 Members
 * - Tier-4: 401-500 Members
 * - Tier-5: 501-600 Members
 * - Tier-6: 601-700 Members
 * - Tier-7: 701-800 Members
 * - Tier-8: 801-900 Members
 * - Tier-9: 901-1000 Members
 * - Tier-10: Above 1000 Members
 */
export const getCommunityTier = (memberCount: number): string => {
  if (memberCount <= 0) return "Tier-1";
  if (memberCount <= 200) return "Tier-1";
  if (memberCount <= 300) return "Tier-2";
  if (memberCount <= 400) return "Tier-3";
  if (memberCount <= 500) return "Tier-4";
  if (memberCount <= 600) return "Tier-5";
  if (memberCount <= 700) return "Tier-6";
  if (memberCount <= 800) return "Tier-7";
  if (memberCount <= 900) return "Tier-8";
  if (memberCount <= 1000) return "Tier-9";
  return "Tier-10";
};

export const getTierRange = (tier: string): string => {
  const ranges: Record<string, string> = {
    "Tier-1": "1-200 Members",
    "Tier-2": "201-300 Members",
    "Tier-3": "301-400 Members",
    "Tier-4": "401-500 Members",
    "Tier-5": "501-600 Members",
    "Tier-6": "601-700 Members",
    "Tier-7": "701-800 Members",
    "Tier-8": "801-900 Members",
    "Tier-9": "901-1000 Members",
    "Tier-10": "Above 1000 Members",
  };
  return ranges[tier] || "Unknown";
};

export const getTierDescription = (): string => {
  return "System-assigned based on member count";
};
