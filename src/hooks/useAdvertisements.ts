// src/hooks/useAdvertisements.ts
// Fetches active community ads for inline display in community content feeds
import { useState, useEffect, useCallback } from "react";
import type { EnhancedAdvertisement } from "@/types/advertisementSystem";

const API = "/api/community";

interface UseAdvertisementsOptions {
  communityId?: string;
  limit?: number;
  enabled?: boolean;
}

export function useAdvertisements({ communityId, limit = 10, enabled = true }: UseAdvertisementsOptions) {
  const [ads,     setAds]     = useState<EnhancedAdvertisement[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAds = useCallback(async () => {
    if (!communityId || !enabled) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/advertisements.php?community_id=${communityId}&filter=all_active&limit=${limit}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const d = await res.json();
        setAds(d.ads ?? []);
      }
    } catch {}
    finally { setLoading(false); }
  }, [communityId, enabled, limit]);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  const recordClick = async (adId: string) => {
    if (!communityId) return;
    try {
      await fetch(`${API}/advertisements.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "click", community_id: communityId, ad_id: adId }),
      });
    } catch {}
  };

  return { ads, loading, refetch: fetchAds, recordClick };
}

// Returns a single ad to display inline (rotates through active ads)
export function useInlineAd(communityId?: string) {
  const { ads, loading, recordClick } = useAdvertisements({ communityId, limit: 20 });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;
    const timer = setInterval(() => setCurrentIndex(i => (i + 1) % ads.length), 30000);
    return () => clearInterval(timer);
  }, [ads.length]);

  const currentAd = ads.length > 0 ? ads[currentIndex % ads.length] : null;

  return { ad: currentAd, totalAds: ads.length, loading, recordClick };
}
