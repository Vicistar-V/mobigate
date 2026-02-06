import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  Wallet, 
  TrendingUp, 
  Calendar,
  Clock,
  Search,
  ChevronRight,
  Building2,
  Globe,
  Coins
} from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockEnhancedCampaigns } from "@/data/campaignSystemData";
import { formatMobiAmount } from "@/lib/campaignFeeDistribution";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { format } from "date-fns";
import { MobiExplainerTooltip, MobiCurrencyInfoBanner } from "@/components/common/MobiExplainerTooltip";

type FeeViewType = "total" | "community" | "mobigate";

interface CampaignFeeDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewType: FeeViewType;
}

const getViewConfig = (viewType: FeeViewType) => {
  switch (viewType) {
    case "total":
      return {
        title: "Total Campaign Fees Collected",
        icon: <Coins className="h-5 w-5 text-orange-500" />,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
        description: "Complete breakdown of all campaign fees collected from candidates"
      };
    case "community":
      return {
        title: "Community Share Breakdown",
        icon: <Building2 className="h-5 w-5 text-green-600" />,
        color: "text-green-600",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        description: "60% of campaign fees allocated to the Community Wallet"
      };
    case "mobigate":
      return {
        title: "Mobigate Share Breakdown",
        icon: <Globe className="h-5 w-5 text-blue-500" />,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        description: "40% of campaign fees allocated to Mobigate Platform"
      };
  }
};

const getAmountForType = (campaign: typeof mockEnhancedCampaigns[0], viewType: FeeViewType) => {
  switch (viewType) {
    case "total":
      return campaign.totalFeeInMobi;
    case "community":
      return campaign.communityShare;
    case "mobigate":
      return campaign.mobigateShare;
  }
};

export function CampaignFeeDetailSheet({
  open,
  onOpenChange,
  viewType
}: CampaignFeeDetailSheetProps) {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");

  const config = getViewConfig(viewType);
  
  // Get paid campaigns only
  const paidCampaigns = mockEnhancedCampaigns.filter(c => c.paymentStatus === "paid");
  
  // Filter by search
  const filteredCampaigns = paidCampaigns.filter(campaign =>
    campaign.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.office.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals
  const totalAmount = filteredCampaigns.reduce((sum, c) => sum + getAmountForType(c, viewType), 0);

  const Content = () => (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className={`${config.bgColor} ${config.borderColor}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {config.icon}
            <MobiExplainerTooltip size="sm" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${config.color}`}>
              {formatMobiAmount(totalAmount)}
            </span>
            <span className="text-sm text-muted-foreground">
              ≈ {formatLocalAmount(totalAmount, "NGN")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            From {filteredCampaigns.length} paid campaign{filteredCampaigns.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {config.description}
          </p>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by candidate or office..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-9 text-sm"
        />
      </div>

      {/* Campaign Contributions List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Individual Campaign Contributions</h3>
          <Badge variant="secondary" className="text-xs">
            {filteredCampaigns.length} records
          </Badge>
        </div>

        {filteredCampaigns.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No paid campaigns found
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden">
                <CardContent className="p-3">
                  {/* Candidate Header */}
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={campaign.candidatePhoto} alt={campaign.candidateName} />
                      <AvatarFallback className="text-sm">
                        {campaign.candidateName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{campaign.candidateName}</p>
                      <p className="text-xs text-muted-foreground">
                        {campaign.office}
                      </p>
                      
                      {/* Campaign Duration */}
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {format(campaign.startDate, "MMM d")} - {format(campaign.endDate, "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{campaign.durationDays} days duration</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  {/* Fee Breakdown for this campaign */}
                  <div className="space-y-1.5">
                    {viewType === "total" ? (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Base Fee</span>
                          <span>{formatMobiAmount(campaign.baseFee)}</span>
                        </div>
                        {campaign.audiencePremium > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Audience Premium</span>
                            <span>+{formatMobiAmount(campaign.audiencePremium)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-medium pt-1 border-t">
                          <span>Total Collected</span>
                          <span className={config.color}>
                            {formatMobiAmount(campaign.totalFeeInMobi)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Total Campaign Fee</span>
                          <span>{formatMobiAmount(campaign.totalFeeInMobi)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {viewType === "community" ? "Community Share (60%)" : "Mobigate Share (40%)"}
                          </span>
                          <span className={`font-medium ${config.color}`}>
                            {formatMobiAmount(getAmountForType(campaign, viewType))}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span>Local equivalent</span>
                          <span>≈ {formatLocalAmount(getAmountForType(campaign, viewType), "NGN")}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Payment Info */}
                  {campaign.paidAt && (
                    <div className="mt-2 pt-2 border-t text-[11px] text-muted-foreground flex items-center gap-1">
                      <Wallet className="h-3 w-3" />
                      <span>Paid on {format(campaign.paidAt, "MMM d, yyyy 'at' h:mm a")}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Currency Info Banner */}
      <MobiCurrencyInfoBanner currencyCode="NGN" />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="border-b pb-3">
            <DrawerTitle className="flex items-center gap-2">
              {config.icon}
              {config.title}
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto" style={{ maxHeight: 'calc(92vh - 80px)' }}>
            {Content()}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader className="pb-3">
          <SheetTitle className="flex items-center gap-2">
            {config.icon}
            {config.title}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] pr-4">
          {Content()}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
