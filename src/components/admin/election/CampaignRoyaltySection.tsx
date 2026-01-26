import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  Settings,
  ChevronRight,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { mockEnhancedCampaigns, getCampaignStats } from "@/data/campaignSystemData";
import { formatMobiAmount } from "@/lib/campaignFeeDistribution";
import { CampaignRoyaltyDetailSheet } from "./CampaignRoyaltyDetailSheet";
import { FeeDistributionConfigDialog } from "./FeeDistributionConfigDialog";

interface CampaignRoyaltySectionProps {
  onViewFullReport?: () => void;
}

export function CampaignRoyaltySection({ onViewFullReport }: CampaignRoyaltySectionProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  
  const stats = getCampaignStats();
  const paidCampaigns = mockEnhancedCampaigns.filter(c => c.paymentStatus === "paid");

  const selectedCampaign = selectedCampaignId 
    ? mockEnhancedCampaigns.find(c => c.id === selectedCampaignId)
    : null;

  return (
    <>
      {/* Detail Sheet */}
      <CampaignRoyaltyDetailSheet
        open={!!selectedCampaign}
        onOpenChange={(open) => !open && setSelectedCampaignId(null)}
        campaign={selectedCampaign}
      />

      {/* Config Dialog */}
      <FeeDistributionConfigDialog
        open={showConfigDialog}
        onOpenChange={setShowConfigDialog}
      />

      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Fees</p>
              <p className="text-sm font-bold">{formatMobiAmount(stats.totalFees)}</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Community</p>
              <p className="text-sm font-bold text-green-600">
                {formatMobiAmount(stats.totalCommunityShare)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Mobigate</p>
              <p className="text-sm font-bold text-blue-600">
                {formatMobiAmount(stats.totalMobigateShare)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Distribution Ratio Card */}
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Current Distribution</p>
                  <p className="text-xs text-muted-foreground">
                    Community 60% : Mobigate 40%
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={() => setShowConfigDialog(true)}
              >
                <Settings className="h-3.5 w-3.5 mr-1" />
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Campaign Royalties List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Campaign Royalties</h3>
            <Badge variant="secondary" className="text-xs">
              {paidCampaigns.length} paid
            </Badge>
          </div>

          <div className="space-y-2">
            {paidCampaigns.map((campaign) => (
              <Card 
                key={campaign.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedCampaignId(campaign.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={campaign.candidatePhoto} alt={campaign.candidateName} />
                      <AvatarFallback>{campaign.candidateName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{campaign.candidateName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {campaign.office} • {campaign.durationDays} days
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">
                        {formatMobiAmount(campaign.totalFeeInMobi)}
                      </p>
                      <div className="flex items-center gap-1 justify-end text-xs">
                        <span className="text-green-600">
                          +{formatMobiAmount(campaign.communityShare)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* View Full Report Button */}
        {onViewFullReport && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onViewFullReport}
          >
            View Full Royalty Report
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </>
  );
}
