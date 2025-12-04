import { Card } from "@/components/ui/card";
import { Grid3x3 } from "lucide-react";
import { ExecutiveMembersCarousel } from "./ExecutiveMembersCarousel";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdCard } from "@/components/PremiumAdCard";
import {
  adHocMembers,
  ExecutiveMember,
} from "@/data/communityExecutivesData";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExecutiveDetailSheet } from "./ExecutiveDetailSheet";

export const CommunityAdhocTab = () => {
  const [adHocFilter, setAdHocFilter] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Filter ad-hoc members by department
  const filteredAdHocMembers = adHocFilter === "all" 
    ? adHocMembers 
    : adHocMembers.filter((m) => m.adHocDepartment === adHocFilter);

  const handleMemberClick = (member: ExecutiveMember) => {
    setSelectedMember(member);
    setIsDetailOpen(true);
  };

  // Premium ad data
  const premiumAd1 = {
    id: "adhoc-premium-1",
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
    id: "adhoc-premium-2",
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
      <Card className="overflow-hidden">
        <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Ad-hoc Committee Members</h3>
          <div className="flex items-center gap-2">
            <Grid3x3 className="h-4 w-4" />
            <Select value={adHocFilter} onValueChange={setAdHocFilter}>
              <SelectTrigger className="h-8 w-[130px] bg-primary-foreground text-primary text-xs">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Committees</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Welfare">Welfare</SelectItem>
                <SelectItem value="Protocol">Protocol</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <ExecutiveMembersCarousel
        title={`Ad-hoc Committee Members ${adHocFilter !== "all" ? `- ${adHocFilter}` : ""}`}
        members={filteredAdHocMembers}
        showViewToggle={true}
        onMemberClick={handleMemberClick}
      />

      {/* Advertisement */}
      <PremiumAdCard {...premiumAd1} />

      {/* Another Ad-hoc Section */}
      <ExecutiveMembersCarousel
        title="Ad-hoc Committee Members"
        members={adHocMembers.slice(0, 6)}
        showViewToggle={true}
        onMemberClick={handleMemberClick}
      />

      {/* Advertisement */}
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
