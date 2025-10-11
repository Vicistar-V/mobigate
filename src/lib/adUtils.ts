import { PremiumAdCardProps } from "@/components/PremiumAdCard";

/**
 * Randomly shuffle an array of ads
 */
export const getRandomizedAds = (
  adPool: PremiumAdCardProps[][],
  count: number
): PremiumAdCardProps[][] => {
  const shuffled = [...adPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

/**
 * Mix ad layouts randomly to create variety
 */
export const mixAdLayouts = (
  ads: PremiumAdCardProps[]
): PremiumAdCardProps[] => {
  const layouts: Array<"fullscreen" | "standard" | "compact"> = [
    "standard",
    "compact",
    "standard",
    "fullscreen",
  ];

  return ads.map((ad, index) => ({
    ...ad,
    layout: layouts[index % layouts.length],
  }));
};

/**
 * Get a random ad slot from the pool
 */
export const getRandomAdSlot = (
  adPool: PremiumAdCardProps[][]
): PremiumAdCardProps[] => {
  const randomIndex = Math.floor(Math.random() * adPool.length);
  return adPool[randomIndex];
};
