import { useState, useEffect } from "react";
import { EnhancedCampaign, CampaignAudience } from "@/types/campaignSystem";
import { getActiveCampaignsForAudience } from "@/data/campaignSystemData";
import { CampaignBannerCard } from "./CampaignBannerCard";
import { CampaignFeedbackDialog } from "./CampaignFeedbackDialog";
import { CampaignFullViewSheet } from "./CampaignFullViewSheet";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampaignBannerRotationProps {
  audienceType: CampaignAudience;
  autoRotate?: boolean;
  rotationInterval?: number; // in milliseconds
  compact?: boolean;
  maxBanners?: number;
  showNavigation?: boolean;
}

export function CampaignBannerRotation({
  audienceType,
  autoRotate = true,
  rotationInterval = 5000,
  compact = false,
  maxBanners = 3,
  showNavigation = true
}: CampaignBannerRotationProps) {
  const [campaigns, setCampaigns] = useState<EnhancedCampaign[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCampaign, setSelectedCampaign] = useState<EnhancedCampaign | null>(null);
  const [feedbackCampaign, setFeedbackCampaign] = useState<EnhancedCampaign | null>(null);
  const [showFullView, setShowFullView] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const activeCampaigns = getActiveCampaignsForAudience(audienceType);
    setCampaigns(activeCampaigns.slice(0, maxBanners));
  }, [audienceType, maxBanners]);

  useEffect(() => {
    if (!autoRotate || campaigns.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % campaigns.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotationInterval, campaigns.length]);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev - 1 + campaigns.length) % campaigns.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % campaigns.length);
  };

  const handleViewCampaign = (campaign: EnhancedCampaign) => {
    setSelectedCampaign(campaign);
    setShowFullView(true);
  };

  const handleWriteFeedback = (campaign: EnhancedCampaign) => {
    setFeedbackCampaign(campaign);
    setShowFeedback(true);
  };

  const handleSubmitFeedback = (campaignId: string, feedback: string, anonymousId: string) => {
    // In a real app, this would submit to the backend
    console.log("Feedback submitted:", { campaignId, feedback, anonymousId });
    
    // Update local state to show incremented feedback count
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId 
        ? { ...c, feedbackCount: c.feedbackCount + 1 }
        : c
    ));
  };

  if (campaigns.length === 0) {
    return null; // Don't render anything if no active campaigns
  }

  const currentCampaign = campaigns[currentIndex];

  return (
    <div className="relative">
      {/* Campaign Banner */}
      <CampaignBannerCard
        campaign={currentCampaign}
        onViewCampaign={handleViewCampaign}
        onWriteFeedback={handleWriteFeedback}
        compact={compact}
      />

      {/* Navigation Controls */}
      {showNavigation && campaigns.length > 1 && (
        <div className="flex items-center justify-between mt-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex gap-1">
            {campaigns.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? "w-4 bg-primary" 
                    : "w-1.5 bg-muted-foreground/30"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Full Campaign View Sheet */}
      <CampaignFullViewSheet
        open={showFullView}
        onOpenChange={setShowFullView}
        campaign={selectedCampaign}
        onWriteFeedback={() => {
          setShowFullView(false);
          if (selectedCampaign) {
            setFeedbackCampaign(selectedCampaign);
            setShowFeedback(true);
          }
        }}
      />

      {/* Feedback Dialog */}
      <CampaignFeedbackDialog
        open={showFeedback}
        onOpenChange={setShowFeedback}
        campaign={feedbackCampaign}
        onSubmitFeedback={handleSubmitFeedback}
      />
    </div>
  );
}
