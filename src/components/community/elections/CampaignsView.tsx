import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, Plus, Eye, MessageSquare, Globe, UserCircle, Store, UsersRound, Wallet } from "lucide-react";
import { EnhancedCampaign, CampaignAudience } from "@/types/campaignSystem";
import { mockEnhancedCampaigns } from "@/data/campaignSystemData";
import { formatMobiAmount } from "@/lib/campaignFeeDistribution";
import { CampaignFullViewSheet } from "./CampaignFullViewSheet";
import { CampaignFeedbackDialog } from "./CampaignFeedbackDialog";
import { format } from "date-fns";

interface CampaignsViewProps {
  onLaunchCampaign?: () => void;
}

const audienceIcons: Record<CampaignAudience, React.ReactNode> = {
  community_interface: <Users className="h-3 w-3" />,
  members_interface: <UserCircle className="h-3 w-3" />,
  mobigate_interface: <Globe className="h-3 w-3" />,
  mobigate_users: <UsersRound className="h-3 w-3" />,
  mobi_store_marketplace: <Store className="h-3 w-3" />
};

const audienceLabels: Record<CampaignAudience, string> = {
  community_interface: "Community",
  members_interface: "Members",
  mobigate_interface: "Mobigate",
  mobigate_users: "Users",
  mobi_store_marketplace: "Store"
};

export const CampaignsView = ({ onLaunchCampaign }: CampaignsViewProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<EnhancedCampaign | null>(null);
  const [showFullView, setShowFullView] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCampaign, setFeedbackCampaign] = useState<EnhancedCampaign | null>(null);

  // Use enhanced campaigns
  const campaigns = mockEnhancedCampaigns.filter(c => c.status === "active");

  const handleViewCampaign = (campaign: EnhancedCampaign) => {
    setSelectedCampaign(campaign);
    setShowFullView(true);
  };

  const handleWriteFeedback = (campaign: EnhancedCampaign) => {
    setFeedbackCampaign(campaign);
    setShowFeedback(true);
  };

  const handleSubmitFeedback = (campaignId: string, feedback: string, anonymousId: string) => {
    console.log("Feedback submitted:", { campaignId, feedback, anonymousId });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Active Campaigns</h2>
        <Button onClick={onLaunchCampaign} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Launch Campaign
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              {/* Header with Avatar and Status */}
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={campaign.candidatePhoto} alt={campaign.candidateName} />
                  <AvatarFallback>{campaign.candidateName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base truncate">{campaign.candidateName}</h3>
                  <p className="text-sm text-muted-foreground">{campaign.office}</p>
                </div>
                <Badge variant={campaign.status === "active" ? "default" : "secondary"} className="text-xs">
                  {campaign.status}
                </Badge>
              </div>

              {/* Tagline */}
              <p className="text-sm font-medium italic">"{campaign.tagline}"</p>

              {/* Audience Badges */}
              <div className="flex flex-wrap gap-1">
                {campaign.audienceTargets.map((audience) => (
                  <Badge key={audience} variant="outline" className="text-[10px] gap-1 px-1.5 py-0.5">
                    {audienceIcons[audience]}
                    {audienceLabels[audience]}
                  </Badge>
                ))}
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {campaign.views}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {campaign.feedbackCount}
                </span>
                <span className="flex items-center gap-1">
                  <Wallet className="w-3 h-3" />
                  {formatMobiAmount(campaign.totalFeeInMobi)}
                </span>
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{format(campaign.startDate, "MMM dd")} - {format(campaign.endDate, "MMM dd, yyyy")}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  size="sm"
                  onClick={() => handleViewCampaign(campaign)}
                >
                  View Campaign
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleWriteFeedback(campaign)}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {campaigns.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No active campaigns at the moment.</p>
            <Button variant="outline" className="mt-4" onClick={onLaunchCampaign}>
              Launch Your Campaign
            </Button>
          </div>
        )}
      </div>

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
};
