import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Wallet, 
  TrendingUp, 
  Calendar,
  Clock,
  Receipt
} from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { EnhancedCampaign } from "@/types/campaignSystem";
import { formatMobiAmount } from "@/lib/campaignFeeDistribution";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { format } from "date-fns";
import { campaignAudienceOptions } from "@/data/campaignSystemData";
import { MobiExplainerTooltip, MobiCurrencyInfoBanner } from "@/components/common/MobiExplainerTooltip";

interface CampaignRoyaltyDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: EnhancedCampaign | null | undefined;
}

export function CampaignRoyaltyDetailSheet({
  open,
  onOpenChange,
  campaign
}: CampaignRoyaltyDetailSheetProps) {
  const isMobile = useIsMobile();

  if (!campaign) return null;

  const selectedAudiences = campaignAudienceOptions.filter(
    opt => campaign.audienceTargets.includes(opt.value)
  );

  const Content = () => (
    <div className="space-y-4">
      {/* Candidate Info */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarImage src={campaign.candidatePhoto} alt={campaign.candidateName} />
              <AvatarFallback className="text-lg">
                {campaign.candidateName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base">{campaign.candidateName}</h3>
              <p className="text-sm text-muted-foreground">{campaign.office}</p>
              <Badge 
                className={`text-xs mt-1 ${
                  campaign.status === 'active' 
                    ? 'bg-green-500/10 text-green-600' 
                    : campaign.status === 'ended'
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-amber-500/10 text-amber-600'
                }`}
              >
                {campaign.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Parameters */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h4 className="font-semibold text-sm">Campaign Parameters</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{campaign.durationDays} days</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(campaign.startDate, "MMM d")}</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Target Audiences</p>
            <div className="flex flex-wrap gap-1">
              {selectedAudiences.map((audience) => (
                <Badge 
                  key={audience.value} 
                  variant="secondary" 
                  className="text-xs"
                >
                  {audience.label.split(' ')[0]}
                </Badge>
              ))}
            </div>
          </div>

          <p className="text-sm italic text-muted-foreground">
            "{campaign.tagline}"
          </p>
        </CardContent>
      </Card>

      {/* Fee Breakdown - Community Admin View */}
      {/* Note: Total Collected and detailed fee breakdown are Mobigate Admin concerns only */}
      {/* Community Admins only see their royalty share */}

      {/* Community Royalty - Only show Community's share */}
      <Card className="bg-green-500/5 border-green-500/20">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-green-600" />
            <h4 className="font-semibold text-sm text-green-700">Community Royalty Earned</h4>
            <MobiExplainerTooltip size="sm" />
          </div>
          
          {/* Only Community Share - Mobigate Share hidden for Community Admins */}
          <div className="flex justify-between items-center p-3 bg-background rounded-lg">
            <div>
              <span className="text-sm text-muted-foreground">Your Community Earnings</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Based on {campaign.durationDays}-day campaign
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-green-600">
                {formatMobiAmount(campaign.communityShare)}
              </span>
              <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(campaign.communityShare, "NGN")}</p>
            </div>
          </div>

          {campaign.paidAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
              <Receipt className="h-3 w-3" />
              <span>Received on {format(campaign.paidAt, "MMM d, yyyy")}</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Royalty based on candidate's selected campaign parameters
          </p>
        </CardContent>
      </Card>

      {/* Unique Identifier */}
      <Card className="bg-muted/50">
        <CardContent className="p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Campaign ID</span>
            <code className="font-mono bg-background px-2 py-1 rounded">
              {campaign.id}
            </code>
          </div>
        </CardContent>
      </Card>

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
              <TrendingUp className="h-5 w-5 text-green-600" />
              Campaign Royalty Details
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
            <Content />
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
            <TrendingUp className="h-5 w-5 text-green-600" />
            Campaign Royalty Details
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] pr-4">
          <Content />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
