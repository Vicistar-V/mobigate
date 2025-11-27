import { Menu } from "lucide-react";
import { WinnersView } from "./WinnersView";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { mockWinners } from "@/data/electionData";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";

export const ElectionWinnersTab = () => {
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Election Winners</h1>
        </div>
      </div>

      {/* Winners Content */}
      <WinnersView winners={mockWinners} />

      {/* Ads */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-winners" />

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
