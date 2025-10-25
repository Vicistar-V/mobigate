import { SavedAdvert, AdvertSize } from "@/types/advert";
import { PremiumAdCardProps } from "@/components/PremiumAdCard";
import { loadAllAdverts } from "./advertStorage";

/**
 * Convert SavedAdvert to PremiumAdCardProps format
 */
export function convertSavedAdvertToPremiumAd(advert: SavedAdvert): PremiumAdCardProps {
  const layout = determineLayoutFromSize(advert.size);
  
  // Convert file URLs to media objects
  const media = advert.fileUrls.map((url, index) => ({
    url,
    caption: `${advert.type} - Display ${index + 1}`,
  }));

  return {
    id: advert.id,
    advertiser: {
      name: advert.advertiserName || "Premium Advertiser",
      logo: "/placeholder.svg",
      verified: true,
    },
    content: {
      headline: `${advert.category === "pictorial" ? "📸" : "🎬"} Premium ${advert.type} Display`,
      description: `Reach ${advert.pricing.displayPerDay} displays per day with ${advert.pricing.displayFrequency} frequency`,
      ctaText: "Learn More",
      ctaUrl: "#",
    },
    media: {
      type: media.length > 1 ? ("carousel" as const) : advert.category === "video" ? ("video" as const) : ("image" as const),
      items: media,
    },
    layout,
    duration: 15,
  };
}

/**
 * Determine layout based on advert size
 */
function determineLayoutFromSize(size: AdvertSize): "fullscreen" | "standard" | "compact" {
  // Fullscreen: 10x6, 6.5x6
  if (size === "10x6" || size === "6.5x6") {
    return "fullscreen";
  }
  
  // Standard: 5x6, 3.5x6, 2.5x6, 2x6, 6.5x3
  if (size === "5x6" || size === "3.5x6" || size === "2.5x6" || size === "2x6" || size === "6.5x3") {
    return "standard";
  }
  
  // Compact: 3.5x3, 2.5x3, 2x3
  return "compact";
}

/**
 * Get approved and active adverts for rotation
 */
export function getActiveAdverts(): SavedAdvert[] {
  const allAdverts = loadAllAdverts();
  return allAdverts.filter(
    (ad) => ad.status === "active" || ad.status === "approved"
  );
}

/**
 * Convert active adverts to PremiumAdCardProps array
 */
export function getActiveAdvertsForRotation(): PremiumAdCardProps[] {
  const activeAdverts = getActiveAdverts();
  return activeAdverts.map(convertSavedAdvertToPremiumAd);
}

/**
 * Merge user adverts with existing ad pool
 */
export function mergeAdvertPools(
  existingPool: PremiumAdCardProps[][]
): PremiumAdCardProps[][] {
  const userAdverts = getActiveAdvertsForRotation();
  
  if (userAdverts.length === 0) {
    return existingPool;
  }

  // Create ad slots from user adverts (group by 2-3 ads per slot)
  const userAdSlots: PremiumAdCardProps[][] = [];
  for (let i = 0; i < userAdverts.length; i += 2) {
    userAdSlots.push(userAdverts.slice(i, i + 2));
  }

  // Merge: alternate between existing and user ads
  const merged: PremiumAdCardProps[][] = [];
  const maxLength = Math.max(existingPool.length, userAdSlots.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < existingPool.length) {
      merged.push(existingPool[i]);
    }
    if (i < userAdSlots.length) {
      merged.push(userAdSlots[i]);
    }
  }

  return merged;
}

/**
 * Get random ad slot including user adverts
 */
export function getRandomAdSlotWithUserAdverts(
  basePool: PremiumAdCardProps[][]
): PremiumAdCardProps[] {
  const mergedPool = mergeAdvertPools(basePool);
  const randomIndex = Math.floor(Math.random() * mergedPool.length);
  return mergedPool[randomIndex] || basePool[0];
}
