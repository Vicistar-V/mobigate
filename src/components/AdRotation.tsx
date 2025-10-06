import { useState, useEffect } from "react";
import { AdCard } from "./AdCard";

interface Ad {
  id: string;
  content: string;
  image: string;
  duration: number; // in minutes
}

interface AdRotationProps {
  slotId: string;
  ads: Ad[];
  defaultDuration?: number; // default duration in minutes
}

export const AdRotation = ({ slotId, ads, defaultDuration = 10 }: AdRotationProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const currentAd = ads[currentAdIndex] || ads[0];
  const adDuration = currentAd?.duration || defaultDuration;

  useEffect(() => {
    // Initialize time remaining (convert minutes to seconds)
    setTimeRemaining(adDuration * 60);
  }, [currentAdIndex, adDuration]);

  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Move to next ad
          setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
          return adDuration * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ads.length, adDuration]);

  if (!currentAd || ads.length === 0) {
    return <AdCard />;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AdCard 
      image={currentAd.image}
      content={currentAd.content}
      timeRemaining={formatTime(timeRemaining)}
    />
  );
};
