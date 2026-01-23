import { useState } from "react";
import { Menu, MessageSquare, Eye, Users } from "lucide-react";
import { CampaignsView } from "./CampaignsView";
import { LaunchCampaignDialog } from "./LaunchCampaignDialog";
import { CandidateFeedbackSheet } from "./CandidateFeedbackSheet";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { CampaignBannerRotation } from "./CampaignBannerRotation";
import { mockEnhancedCampaigns } from "@/data/campaignSystemData";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";
import { EnhancedCampaign } from "@/types/campaignSystem";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatMobiAmount } from "@/lib/campaignFeeDistribution";

export const ElectionCampaignsTab = () => {
  const [showLaunchDialog, setShowLaunchDialog] = useState(false);
  const [selectedCampaignForFeedback, setSelectedCampaignForFeedback] = useState<EnhancedCampaign | null>(null);
  const [showFeedbackSheet, setShowFeedbackSheet] = useState(false);

  // Get user's own campaigns (simulated - in real app would filter by user ID)
  const myCampaigns = mockEnhancedCampaigns.filter(c => c.status === "active" || c.status === "ended");

  const handleViewFeedback = (campaign: EnhancedCampaign) => {
    setSelectedCampaignForFeedback(campaign);
    setShowFeedbackSheet(true);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Election Campaigns</h1>
        </div>
      </div>

      {/* Campaign Banners for Community Interface */}
      <CampaignBannerRotation 
        audienceType="community_interface" 
        compact={false}
        maxBanners={3}
      />

      {/* My Campaigns Summary */}
      {myCampaigns.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Your Active Campaigns
            </h3>
            <div className="space-y-2">
              {myCampaigns.slice(0, 2).map((campaign) => (
                <div 
                  key={campaign.id} 
                  className="flex items-center justify-between bg-background rounded-lg p-3 border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{campaign.office}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {campaign.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {campaign.feedbackCount}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {formatMobiAmount(campaign.totalFeeInMobi)}
                      </Badge>
                    </div>
                  </div>
                  {campaign.feedbackCount > 0 && (
                    <button
                      onClick={() => handleViewFeedback(campaign)}
                      className="text-xs text-primary hover:underline ml-2"
                    >
                      View Feedback
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns Content */}
      <CampaignsView 
        onLaunchCampaign={() => setShowLaunchDialog(true)} 
      />
      
      {/* Launch Campaign Dialog */}
      <LaunchCampaignDialog 
        open={showLaunchDialog} 
        onOpenChange={setShowLaunchDialog} 
      />

      {/* Candidate Feedback Sheet */}
      <CandidateFeedbackSheet
        open={showFeedbackSheet}
        onOpenChange={setShowFeedbackSheet}
        campaign={selectedCampaignForFeedback}
      />
      
      {/* Ads & Suggestions */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-campaigns" />
      <PeopleYouMayKnow />
    </div>
  );
};
