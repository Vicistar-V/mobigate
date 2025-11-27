import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Menu } from "lucide-react";
import { CampaignsView } from "./CampaignsView";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { mockCampaigns } from "@/data/electionData";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";

export const ElectionCampaignsTab = () => {
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Election Campaigns</h1>
        </div>
      </div>

      {/* Campaigns Content */}
      <CampaignsView campaigns={mockCampaigns} />
      
      {/* Ads & Suggestions */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-campaigns" />
      <PeopleYouMayKnow />
    </div>
  );
};
