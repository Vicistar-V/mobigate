import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Plus } from "lucide-react";
import { Campaign } from "@/data/electionData";
import { format } from "date-fns";

interface CampaignsViewProps {
  campaigns: Campaign[];
  onLaunchCampaign?: () => void;
}

export const CampaignsView = ({ campaigns, onLaunchCampaign }: CampaignsViewProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Election Campaigns</h2>
        <Button onClick={onLaunchCampaign}>
          <Plus className="w-4 h-4 mr-2" />
          Launch Campaign
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{campaign.candidateName}</h3>
                  <p className="text-sm text-muted-foreground">{campaign.office}</p>
                </div>
                <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                  {campaign.status}
                </Badge>
              </div>

              <p className="text-sm font-medium">{campaign.description}</p>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{campaign.manifesto}</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{format(campaign.startDate, "MMM dd")} - {format(campaign.endDate, "MMM dd, yyyy")}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" size="sm">
                View Full Campaign
              </Button>
            </div>
          </Card>
        ))}

        {campaigns.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No active campaigns at the moment.</p>
            <Button variant="outline" className="mt-4" onClick={onLaunchCampaign}>
              Launch Your Campaign
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
