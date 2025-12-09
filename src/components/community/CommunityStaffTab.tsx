import { ExecutiveMembersCarousel } from "./ExecutiveMembersCarousel";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdCard } from "@/components/PremiumAdCard";
import {
  staffMembers,
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

export const CommunityStaffTab = () => {
  const [staffFilter, setStaffFilter] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleMemberClick = (member: ExecutiveMember) => {
    setSelectedMember(member);
    setIsDetailOpen(true);
  };

  // Premium ad data
  const premiumAd1 = {
    id: "staff-premium-1",
    advertiser: {
      name: "Leadership Training Institute",
      verified: true,
    },
    content: {
      headline: "Empower Your Leadership Team",
      description: "Professional development programs for community executives. Enroll now for Q1 2025.",
      ctaText: "View Programs",
      ctaUrl: "https://example.com/leadership",
    },
    media: {
      type: "carousel" as const,
      items: [
        {
          url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
          caption: "Executive Leadership Training",
        },
        {
          url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
          caption: "Team Building Workshops",
        },
      ],
    },
    layout: "standard" as const,
    duration: 15,
  };

  const premiumAd2 = {
    id: "staff-premium-2",
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

  const filterDropdown = (
    <Select value={staffFilter} onValueChange={setStaffFilter}>
      <SelectTrigger className="h-7 w-[120px] bg-primary-foreground text-primary text-xs">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Staff</SelectItem>
        <SelectItem value="management">Management</SelectItem>
        <SelectItem value="administrative">Administrative</SelectItem>
        <SelectItem value="support">Support</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-6">
      <ExecutiveMembersCarousel
        title="Staff & Employees"
        members={staffMembers}
        showViewToggle={true}
        onMemberClick={handleMemberClick}
        headerExtra={filterDropdown}
      />

      {/* Advertisement */}
      <PremiumAdCard {...premiumAd1} />

      {/* Another Staff Section */}
      <ExecutiveMembersCarousel
        title="Staff & Employees"
        members={staffMembers.slice(0, 4)}
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
