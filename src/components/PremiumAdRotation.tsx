import { useState, useEffect } from "react";
import { PremiumAdCard, PremiumAdCardProps } from "./PremiumAdCard";

interface PremiumAdRotationProps {
  slotId: string;
  ads: PremiumAdCardProps[];
  defaultDuration?: number;
  context?: 'feed' | 'wall-status' | 'profile' | 'albums-carousel';
  className?: string;
}

export const PremiumAdRotation = ({ 
  slotId, 
  ads, 
  defaultDuration = 15,
  context = 'feed',
  className = ''
}: PremiumAdRotationProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const currentAd = ads[currentAdIndex] || ads[0];
  const adDuration = currentAd?.duration || defaultDuration;

  useEffect(() => {
    // Initialize time remaining (convert to seconds if needed)
    setTimeRemaining(adDuration);
  }, [currentAdIndex, adDuration]);

  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Move to next ad
          setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
          return adDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ads.length, adDuration]);

  if (!currentAd || ads.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`} data-slot-id={slotId} data-context={context}>
      <div className="h-full">
        <PremiumAdCard {...currentAd} />
      </div>
    </div>
  );
};
