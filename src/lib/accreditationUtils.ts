/**
 * Accreditation validation and formatting utilities
 */

export type AccreditationTier = "bronze" | "silver" | "gold" | "platinum";

export interface AccreditationValidationResult {
  isValid: boolean;
  tier?: AccreditationTier;
  message: string;
}

// Mock valid codes for testing
const VALID_CODES: Record<string, AccreditationTier> = {
  "GOLD-2024-MOBIGATE": "gold",
  "SILVER-2024-ADVERTISER": "silver",
  "BRONZE-2024-STARTER": "bronze",
  "PLATINUM-2024-PREMIUM": "platinum",
};

/**
 * Validates an accreditation code
 * In production, this should call a secure backend API
 */
export async function validateAccreditationCode(
  code: string
): Promise<AccreditationValidationResult> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const normalizedCode = code.trim().toUpperCase().replace(/\s+/g, "");

  if (!normalizedCode) {
    return {
      isValid: false,
      message: "Please enter an accreditation code",
    };
  }

  if (normalizedCode.length < 10) {
    return {
      isValid: false,
      message: "Accreditation code is too short",
    };
  }

  const tier = VALID_CODES[normalizedCode];
  
  if (tier) {
    return {
      isValid: true,
      tier,
      message: `Successfully verified as ${tier.charAt(0).toUpperCase() + tier.slice(1)} tier advertiser`,
    };
  }

  return {
    isValid: false,
    message: "Invalid accreditation code. Please check and try again.",
  };
}

/**
 * Formats accreditation code for display
 * Converts to uppercase and adds hyphens every 4 characters
 */
export function formatAccreditationCode(code: string): string {
  // Remove all non-alphanumeric characters and convert to uppercase
  const cleaned = code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  
  // Add hyphens every 4 characters
  const formatted = cleaned.match(/.{1,4}/g)?.join("-") || cleaned;
  
  return formatted;
}

/**
 * Get display name for tier
 */
export function getTierDisplayName(tier: AccreditationTier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}
