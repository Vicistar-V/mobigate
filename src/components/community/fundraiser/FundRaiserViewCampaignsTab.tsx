import { FundRaiserHeader } from "./FundRaiserHeader";
import { DonationCard } from "./DonationCard";
import { DonationSheet } from "./DonationSheet";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FundRaiserCampaign } from "@/data/fundraiserData";
import { mapApiCampaign } from "@/lib/fundraiserMerge";
import { useState, useEffect } from "react";
import { PlusCircle, Loader2, HeartHandshake } from "lucide-react";

interface FundRaiserViewCampaignsTabProps {
  communityId?: string;
  onRaiseCampaign?: () => void;
}

export const FundRaiserViewCampaignsTab = ({ communityId, onRaiseCampaign }: FundRaiserViewCampaignsTabProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<FundRaiserCampaign | null>(null);
  const [showDonationSheet, setShowDonationSheet] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [campaigns, setCampaigns] = useState<FundRaiserCampaign[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCampaigns = () => {
    if (!communityId) return;
    setLoading(true);
    fetch(`/api/community/fundraiser.php?action=campaigns&community_id=${communityId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setCampaigns((d.campaigns ?? []).map(mapApiCampaign)))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCampaigns(); }, [communityId]);

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    switch (sortBy) {
      case "urgent": {
        const urgencyOrder = ['Extremely Urgent', 'Emergency Need', 'Very Urgent', 'Urgent'];
        return urgencyOrder.indexOf(a.urgencyLevel) - urgencyOrder.indexOf(b.urgencyLevel);
      }
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
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-rose-500" /></div>
      ) : sortedCampaigns.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <HeartHandshake className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium mb-1">No Active Campaigns</p>
          <p className="text-sm">Be the first to raise a campaign for this community.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCampaigns.map((campaign) => (
            <DonationCard
              key={campaign.id}
              campaign={campaign}
              onDonate={() => handleDonate(campaign)}
            />
          ))}
        </div>
      )}

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
        onDonated={loadCampaigns}
      />
    </div>
  );
};
