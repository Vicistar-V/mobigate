import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3x3 } from "lucide-react";
import { FeaturedLeaderCard } from "./FeaturedLeaderCard";
import { ExecutiveMembersCarousel } from "./ExecutiveMembersCarousel";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdCard } from "@/components/PremiumAdCard";
import {
  executiveMembers,
  adHocMembers,
  staffMembers,
  officeTenures,
} from "@/data/communityExecutivesData";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CommunityAdministrationTab = () => {
  const [adHocFilter, setAdHocFilter] = useState<string>("all");
  const [staffFilter, setStaffFilter] = useState<string>("all");
  
  // Get the President-General (topmost level)
  const presidentGeneral = executiveMembers.find((m) => m.level === "topmost");
  
  // Get other executive members (deputy and officers)
  const otherExecutives = executiveMembers.filter((m) => m.level !== "topmost");

  // Filter ad-hoc members by department
  const filteredAdHocMembers = adHocFilter === "all" 
    ? adHocMembers 
    : adHocMembers.filter((m) => m.adHocDepartment === adHocFilter);

  // Premium ad data
  const premiumAd1 = {
    id: "admin-premium-1",
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
    id: "admin-premium-2",
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

  const premiumAd3 = {
    id: "admin-premium-3",
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

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <Card className="overflow-hidden">
        <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
          <h2 className="font-semibold text-base">Community Leadership & Administration</h2>
          <Grid3x3 className="h-5 w-5" />
        </div>
      </Card>

      {/* Sub-Tabs */}
      <Tabs defaultValue="executive" className="w-full">
        <TabsList className="w-full grid grid-cols-4 h-auto">
          <TabsTrigger value="executive" className="text-xs">
            Executive Committee
          </TabsTrigger>
          <TabsTrigger value="tenure" className="text-xs">
            Office Tenure
          </TabsTrigger>
          <TabsTrigger value="adhoc" className="text-xs">
            Ad-hoc Committees
          </TabsTrigger>
          <TabsTrigger value="staff" className="text-xs">
            Staff & Employees
          </TabsTrigger>
        </TabsList>

        {/* Executive Committee Tab */}
        <TabsContent value="executive" className="space-y-6 mt-6">
          {/* Featured President-General */}
          {presidentGeneral && (
            <div>
              <Card className="overflow-hidden mb-4">
                <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Executive Committee Members</h3>
                  <Grid3x3 className="h-4 w-4" />
                </div>
              </Card>
              <FeaturedLeaderCard leader={presidentGeneral} />
            </div>
          )}

          {/* Other Executive Members Carousel */}
          <ExecutiveMembersCarousel
            title="Executive Committee Members"
            members={otherExecutives}
          />

          {/* Advertisement 1 */}
          <PremiumAdCard {...premiumAd1} />

          {/* Another Executive Section */}
          <ExecutiveMembersCarousel
            title="Executive Committee Members"
            members={otherExecutives.slice(0, 6)}
          />

          {/* Advertisement 2 */}
          <PremiumAdCard {...premiumAd2} />

          {/* People You May Know */}
          <PeopleYouMayKnow />
        </TabsContent>

        {/* Office Tenure Tab */}
        <TabsContent value="tenure" className="space-y-4 mt-6">
          <Card className="overflow-hidden">
            <div className="bg-primary text-primary-foreground p-3">
              <h3 className="font-semibold text-sm">Office Tenure Information</h3>
            </div>
            <div className="divide-y">
              {officeTenures.map((tenure) => (
                <div key={tenure.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{tenure.position}</h4>
                      <p className="text-sm text-muted-foreground">{tenure.currentHolder}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{tenure.termStart} - {tenure.termEnd}</p>
                      <p className="text-primary font-medium mt-1">{tenure.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Advertisement */}
          <PremiumAdCard {...premiumAd3} />
        </TabsContent>

        {/* Ad-hoc Committees Tab */}
        <TabsContent value="adhoc" className="space-y-6 mt-6">
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
            showViewToggle={false}
          />

          {/* Advertisement */}
          <PremiumAdCard {...premiumAd1} />

          {/* Another Ad-hoc Section */}
          <ExecutiveMembersCarousel
            title="Ad-hoc Committee Members"
            members={adHocMembers.slice(0, 6)}
            showViewToggle={false}
          />

          {/* Advertisement */}
          <PremiumAdCard {...premiumAd2} />

          {/* People You May Know */}
          <PeopleYouMayKnow />
        </TabsContent>

        {/* Staff & Employees Tab */}
        <TabsContent value="staff" className="space-y-6 mt-6">
          <Card className="overflow-hidden">
            <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Staff & Employees</h3>
              <div className="flex items-center gap-2">
                <Grid3x3 className="h-4 w-4" />
                <Select value={staffFilter} onValueChange={setStaffFilter}>
                  <SelectTrigger className="h-8 w-[130px] bg-primary-foreground text-primary text-xs">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Staff</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <ExecutiveMembersCarousel
            title="Staff & Employees"
            members={staffMembers}
            showViewToggle={false}
          />

          {/* Advertisement */}
          <PremiumAdCard {...premiumAd3} />

          {/* Another Staff Section */}
          <ExecutiveMembersCarousel
            title="Staff & Employees"
            members={staffMembers.slice(0, 4)}
            showViewToggle={false}
          />

          {/* Advertisement */}
          <PremiumAdCard {...premiumAd1} />

          {/* People You May Know */}
          <PeopleYouMayKnow />
        </TabsContent>
      </Tabs>
    </div>
  );
};
