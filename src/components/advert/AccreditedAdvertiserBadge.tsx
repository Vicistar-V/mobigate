import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Award, Info } from "lucide-react";
import { AccreditedAdvertiserTier } from "@/types/advert";
import { getAccreditedTierRequirements } from "@/lib/advertDiscounts";

interface AccreditedAdvertiserBadgeProps {
  tier: AccreditedAdvertiserTier | null;
  totalCampaigns?: number;
}

const TIER_COLORS: Record<AccreditedAdvertiserTier, string> = {
  bronze: "bg-orange-600/20 text-orange-600 border-orange-600/30 hover:bg-orange-600/30",
  silver: "bg-slate-500/20 text-slate-300 border-slate-500/30 hover:bg-slate-500/30",
  gold: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/30",
  platinum: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30",
};

export const AccreditedAdvertiserBadge = ({ tier, totalCampaigns }: AccreditedAdvertiserBadgeProps) => {
  if (!tier) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="gap-1 cursor-help">
              <Info className="h-3 w-3" />
              Not Accredited
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="font-semibold mb-2">Become an Accredited Advertiser</p>
            <p className="text-sm text-muted-foreground mb-2">
              Complete successful campaigns to unlock discount tiers:
            </p>
            <ul className="text-xs space-y-1">
              <li>• Bronze (5%): 50+ campaigns</li>
              <li>• Silver (10%): 100+ campaigns</li>
              <li>• Gold (15%): 250+ campaigns</li>
              <li>• Platinum (20%): 500+ campaigns</li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const requirements = getAccreditedTierRequirements(tier);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`gap-1.5 cursor-help transition-colors ${TIER_COLORS[tier]}`}
          >
            <Award className="h-3.5 w-3.5" />
            {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-semibold mb-2">Accredited Advertiser - {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Discount:</span>
              <span className="font-semibold text-green-500">{requirements.percentage}% off</span>
            </div>
            {totalCampaigns !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Campaigns:</span>
                <span className="font-medium">{totalCampaigns}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground pt-2 border-t">
              This discount applies automatically to all your adverts
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
