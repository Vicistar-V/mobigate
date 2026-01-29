import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, TrendingUp, Clock, Target } from "lucide-react";
import { mockEnhancedCampaigns, getCampaignStats, campaignAudienceOptions } from "@/data/campaignSystemData";
import { formatMobiAmount } from "@/lib/campaignFeeDistribution";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { CampaignRoyaltyDetailSheet } from "./CampaignRoyaltyDetailSheet";

interface CampaignRoyaltySectionProps {
  onViewFullReport?: () => void;
}

export function CampaignRoyaltySection({ onViewFullReport }: CampaignRoyaltySectionProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  
  const stats = getCampaignStats();
  const paidCampaigns = mockEnhancedCampaigns.filter(c => c.paymentStatus === "paid");

  const selectedCampaign = selectedCampaignId 
    ? mockEnhancedCampaigns.find(c => c.id === selectedCampaignId)
    : null;

  // Get short audience label
  const getAudienceShortLabel = (audienceValue: string) => {
    const audience = campaignAudienceOptions.find(a => a.value === audienceValue);
    return audience?.label.split(' ')[0] || audienceValue;
  };

  return (
    <>
      {/* Detail Sheet */}
      <CampaignRoyaltyDetailSheet
        open={!!selectedCampaign}
        onOpenChange={(open) => !open && setSelectedCampaignId(null)}
        campaign={selectedCampaign}
      />

      <div className="space-y-4">
        {/* Community Royalty Total - Prominently Displayed */}
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-sm">Community Campaign Royalties</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-600">
                {formatMobiAmount(stats.totalCommunityShare)}
              </span>
              <span className="text-sm text-muted-foreground">
                ≈ {formatLocalAmount(stats.totalCommunityShare, "NGN")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {paidCampaigns.length} paid campaign{paidCampaigns.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Per-Candidate Royalty List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Candidates' Royalty Records</h3>
            <Badge variant="secondary" className="text-xs">
              {paidCampaigns.length} paid
            </Badge>
          </div>

          <div className="space-y-2">
            {paidCampaigns.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No paid campaigns yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              paidCampaigns.map((campaign) => (
                <Card 
                  key={campaign.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedCampaignId(campaign.id)}
                >
                  <CardContent className="p-3">
                    {/* Candidate Header */}
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={campaign.candidatePhoto} alt={campaign.candidateName} />
                        <AvatarFallback>
                          {campaign.candidateName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{campaign.candidateName}</p>
                        <p className="text-xs text-muted-foreground">
                          {campaign.office} • {campaign.durationDays} days
                        </p>
                        
                        {/* Royalty Amount - Only show Community Share */}
                        <div className="mt-2 p-2 bg-green-500/10 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Your Royalty</span>
                            <span className="font-bold text-green-600">
                              {formatMobiAmount(campaign.communityShare)}
                            </span>
                          </div>
                          {/* Removed: "60% of X total fee" - Mobigate Admin info only */}
                        </div>
                        
                        {/* Audience Targets */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {campaign.audienceTargets.map((audience) => (
                            <Badge 
                              key={audience} 
                              variant="outline" 
                              className="text-[10px] px-1.5 py-0"
                            >
                              {getAudienceShortLabel(audience)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-3" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
