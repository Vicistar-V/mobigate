import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, Plus, Eye, MessageSquare, Globe, UserCircle, Store, UsersRound, Wallet, Building2 } from "lucide-react";
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
    <div className="space-y-4 px-4 sm:px-0">
      {/* Header - fully stacked on mobile to prevent clipping */}
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold leading-tight">Active Campaigns</h2>
        <Button
          onClick={onLaunchCampaign}
          size="sm"
          className="h-11 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="truncate">Launch Campaign</span>
        </Button>
      </div>

      {/* Campaign cards - single column on mobile */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-4 hover:shadow-lg transition-shadow overflow-hidden">
            <div className="space-y-3">
              {/* Header - restructured for mobile */}
              <div className="flex items-start gap-3">
                <Avatar className="h-14 w-14 shrink-0">
                  <AvatarImage src={campaign.candidatePhoto} alt={campaign.candidateName} />
                  <AvatarFallback className="text-lg">{campaign.candidateName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base leading-tight break-words pr-1">{campaign.candidateName}</h3>
                    <Badge 
                      variant={campaign.status === "active" ? "default" : "secondary"} 
                      className="text-[10px] shrink-0 px-2 py-0.5"
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{campaign.office}</p>
                </div>
              </div>

              {/* Community Name - prominently displayed */}
              <div className="flex items-center gap-1.5 px-2 py-1.5 bg-muted/50 rounded-md">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs font-medium text-foreground/80 truncate">
                  {campaign.communityName}
                </span>
              </div>

              {/* Tagline */}
              <p className="text-sm font-medium italic leading-snug">"{campaign.tagline}"</p>

              {/* Audience Badges - wrapped properly */}
              <div className="flex flex-wrap gap-1.5">
                {campaign.audienceTargets.map((audience) => (
                  <Badge 
                    key={audience} 
                    variant="outline" 
                    className="text-[11px] gap-1 px-2 py-1 whitespace-nowrap"
                  >
                    {audienceIcons[audience]}
                    {audienceLabels[audience]}
                  </Badge>
                ))}
              </div>

              {/* Stats Row - flex-wrap for small screens */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                  {campaign.views.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  {campaign.feedbackCount}
                </span>
                <span className="flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5 shrink-0" />
                  {formatMobiAmount(campaign.totalFeeInMobi)}
                </span>
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{format(campaign.startDate, "MMM dd")} - {format(campaign.endDate, "MMM dd, yyyy")}</span>
              </div>

              {/* Action Button - full width on mobile */}
              <Button 
                variant="outline" 
                className="w-full h-11 text-base" 
                onClick={() => handleViewCampaign(campaign)}
              >
                View Campaign
              </Button>
            </div>
          </Card>
        ))}

        {campaigns.length === 0 && (
          <div className="col-span-full text-center py-12 px-4">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No active campaigns at the moment.</p>
            <Button variant="outline" className="mt-4 h-11" onClick={onLaunchCampaign}>
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
