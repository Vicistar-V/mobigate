import { Card } from "@/components/ui/card";
import { Grid3x3 } from "lucide-react";
import { FeaturedLeaderCard } from "./FeaturedLeaderCard";
import { ExecutiveMembersCarousel } from "./ExecutiveMembersCarousel";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdCard } from "@/components/PremiumAdCard";
import {
  executiveMembers,
  ExecutiveMember,
} from "@/data/communityExecutivesData";
import { useState } from "react";
import { ExecutiveDetailSheet } from "./ExecutiveDetailSheet";

export const CommunityExecutiveTab = () => {
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Get the President-General (topmost level)
  const presidentGeneral = executiveMembers.find((m) => m.level === "topmost");
  
  // Get other executive members (deputy and officers)
  const otherExecutives = executiveMembers.filter((m) => m.level !== "topmost");

  const handleMemberClick = (member: ExecutiveMember) => {
    setSelectedMember(member);
    setIsDetailOpen(true);
  };

  // Premium ad data
  const premiumAd1 = {
    id: "executive-premium-1",
    advertiser: {
      name: "Elite Business Solutions",
      verified: true,
    },
    content: {
      headline: "Transform Your Community Management",
      description: "Professional tools for modern community leaders. Get 50% off your first year.",
      ctaText: "Learn More",
      ctaUrl: "https://example.com/elite",
    },
    media: {
      type: "image" as const,
      items: [
        {
          url: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=1200&q=80",
        },
      ],
    },
    layout: "standard" as const,
    duration: 15,
  };

  const premiumAd2 = {
    id: "executive-premium-2",
    advertiser: {
      name: "Community Pro Services",
      verified: true,
    },
    content: {
      headline: "Streamline Your Operations",
      description: "End-to-end management solutions for growing communities. Free consultation available.",
      ctaText: "Get Started",
      ctaUrl: "https://example.com/communitypro",
    },
    media: {
      type: "image" as const,
      items: [
        {
          url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80",
        },
      ],
    },
    layout: "standard" as const,
    duration: 15,
  };

  return (
    <div className="space-y-6">
      {/* Featured President-General */}
      {presidentGeneral && (
        <div>
          <Card className="overflow-hidden mb-4">
            <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Executive Committee Members</h3>
              <Grid3x3 className="h-4 w-4" />
            </div>
          </Card>
          <FeaturedLeaderCard 
            leader={presidentGeneral}
            onClick={() => handleMemberClick(presidentGeneral)}
          />
        </div>
      )}

      {/* Other Executive Members Carousel */}
      <ExecutiveMembersCarousel
        title="Executive Committee Members"
        members={otherExecutives}
        onMemberClick={handleMemberClick}
      />

      {/* Advertisement 1 */}
      <PremiumAdCard {...premiumAd1} />

      {/* Another Executive Section */}
      <ExecutiveMembersCarousel
        title="Executive Committee Members"
        members={otherExecutives.slice(0, 6)}
        onMemberClick={handleMemberClick}
      />

      {/* Advertisement 2 */}
      <PremiumAdCard {...premiumAd2} />

      {/* People You May Know */}
      <PeopleYouMayKnow />

      {/* Executive Detail Sheet */}
      <ExecutiveDetailSheet
        member={selectedMember}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
};
