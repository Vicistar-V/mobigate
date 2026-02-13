import { FundRaiserHeader } from "./FundRaiserHeader";
import { DonationCard } from "./DonationCard";
import { DonationSheet } from "./DonationSheet";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { mockCampaigns, FundRaiserCampaign } from "@/data/fundraiserData";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

interface FundRaiserViewCampaignsTabProps {
  onRaiseCampaign?: () => void;
}

export const FundRaiserViewCampaignsTab = ({ onRaiseCampaign }: FundRaiserViewCampaignsTabProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<FundRaiserCampaign | null>(null);
  const [showDonationSheet, setShowDonationSheet] = useState(false);
  const [sortBy, setSortBy] = useState("recent");

  const sortedCampaigns = [...mockCampaigns].sort((a, b) => {
    switch (sortBy) {
      case "urgent":
        const urgencyOrder = ['Extremely Urgent', 'Emergency Need', 'Very Urgent', 'Urgent'];
        return urgencyOrder.indexOf(a.urgencyLevel) - urgencyOrder.indexOf(b.urgencyLevel);
      case "target":
        return b.targetAmount - a.targetAmount;
      case "recent":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleDonate = (campaign: FundRaiserCampaign) => {
    setSelectedCampaign(campaign);
    setShowDonationSheet(true);
  };

  return (
    <div className="space-y-4 pb-20">
      <FundRaiserHeader />

      {/* Raise Campaign Button */}
      <Button
        onClick={onRaiseCampaign}
        className="w-full h-12 text-base font-semibold bg-rose-600 hover:bg-rose-700 text-white touch-manipulation rounded-xl shadow-md"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Raise Campaign
      </Button>

      {/* Filter/Sort Controls */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold">Active Campaigns</h2>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[130px] h-9 text-sm">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="urgent">Most Urgent</SelectItem>
            <SelectItem value="target">Highest Goal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaign Cards */}
      <div className="space-y-4">
        {sortedCampaigns.map((campaign) => (
          <DonationCard
            key={campaign.id}
            campaign={campaign}
            onDonate={() => handleDonate(campaign)}
          />
        ))}
      </div>

      {/* Ads */}
      <PremiumAdRotation
        slotId="fundraiser-campaigns-ad"
        ads={[]}
        context="feed"
      />

      {/* People You May Know */}
      <PeopleYouMayKnow />

      {/* Donation Sheet */}
      <DonationSheet
        open={showDonationSheet}
        onOpenChange={setShowDonationSheet}
        campaign={selectedCampaign}
      />
    </div>
  );
};
