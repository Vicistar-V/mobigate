import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FundRaiserHeader } from "./FundRaiserHeader";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { mockCampaigns } from "@/data/fundraiserData";
import { useState } from "react";
import { DollarSign, Calendar } from "lucide-react";

export const FundRaiserViewDonorsTab = () => {
  const [filterCampaign, setFilterCampaign] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Collect all donors from all campaigns
  const allDonors = mockCampaigns.flatMap((campaign) =>
    campaign.donors.map((donor) => ({
      ...donor,
      campaignId: campaign.id,
      campaignTheme: campaign.theme,
    }))
  );

  // Filter by campaign
  const filteredDonors =
    filterCampaign === "all"
      ? allDonors
      : allDonors.filter((d) => d.campaignId === filterCampaign);

  // Sort donors
  const sortedDonors = [...filteredDonors].sort((a, b) => {
    switch (sortBy) {
      case "amount":
        return b.amount - a.amount;
      case "lowest":
        return a.amount - b.amount;
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "recent":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  return (
    <div className="space-y-6 pb-20">
      <FundRaiserHeader />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">All Donors</h2>

        {/* Filters */}
        <div className="flex gap-3">
          <Select value={filterCampaign} onValueChange={setFilterCampaign}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Filter by Campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {mockCampaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.theme.substring(0, 40)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="amount">Highest Amount</SelectItem>
              <SelectItem value="lowest">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Donors</p>
            <p className="text-2xl font-bold">{sortedDonors.length}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Donated</p>
            <p className="text-2xl font-bold">
              ${sortedDonors.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
            </p>
          </Card>
        </div>

        {/* Donors List */}
        <div className="space-y-3">
          {sortedDonors.map((donor) => (
            <Card key={`${donor.id}-${donor.campaignId}`} className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={donor.avatar} />
                  <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{donor.name}</p>
                    {donor.isCelebrity && (
                      <Badge variant="secondary" className="text-xs">
                        Celebrity
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {donor.campaignTheme}
                  </p>

                  {donor.message && (
                    <p className="text-sm italic text-muted-foreground">
                      "{donor.message}"
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span className="font-semibold text-green-600">
                        ${donor.amount.toLocaleString()}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(donor.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {sortedDonors.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No donors found</p>
            </Card>
          )}
        </div>
      </div>

      {/* Ads */}
      <PremiumAdRotation
        slotId="fundraiser-donors-ad"
        ads={[]}
        context="feed"
      />

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
