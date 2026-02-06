import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getActiveAdvertisements } from "@/data/advertisementData";
import { EnhancedAdvertisement } from "@/types/advertisementSystem";
import { AdvertisementFullViewSheet } from "./AdvertisementFullViewSheet";

interface InlineBannerAdProps {
  className?: string;
  rotationInterval?: number;
}

export function InlineBannerAd({ className = "", rotationInterval = 30000 }: InlineBannerAdProps) {
  const [currentAd, setCurrentAd] = useState<EnhancedAdvertisement | null>(null);
  const [showFullView, setShowFullView] = useState(false);

  const activeAds = getActiveAdvertisements();

  useEffect(() => {
    if (activeAds.length === 0) return;

    // Pick a random ad on mount
    const randomIndex = Math.floor(Math.random() * activeAds.length);
    setCurrentAd(activeAds[randomIndex]);

    if (activeAds.length <= 1) return;

    // Rotate every interval
    const timer = setInterval(() => {
      setCurrentAd((prev) => {
        const currentIndex = prev ? activeAds.findIndex((a) => a.id === prev.id) : -1;
        const nextIndex = (currentIndex + 1) % activeAds.length;
        return activeAds[nextIndex];
      });
    }, rotationInterval);

    return () => clearInterval(timer);
  }, [activeAds.length, rotationInterval]);

  if (!currentAd || activeAds.length === 0) return null;

  return (
    <>
      <Card
        className={`p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform touch-manipulation ${className}`}
        onClick={() => setShowFullView(true)}
        role="button"
        aria-label={`View advertisement: ${currentAd.businessName}`}
      >
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <Badge
              variant="secondary"
              className="text-[9px] px-1 py-0 bg-amber-200/80 dark:bg-amber-800/60 text-amber-800 dark:text-amber-200 shrink-0 leading-tight"
            >
              Ad
            </Badge>
            <span className="min-w-0 truncate font-medium text-foreground">
              {currentAd.businessName}
              {currentAd.productTitle ? ` — ${currentAd.productTitle}` : ""}
            </span>
          </div>
          <span className="text-red-600 dark:text-red-400 text-xs font-semibold shrink-0">
            Click Here!
          </span>
        </div>
      </Card>

      <AdvertisementFullViewSheet
        open={showFullView}
        onOpenChange={setShowFullView}
        advertisement={currentAd}
      />
    </>
  );
}
