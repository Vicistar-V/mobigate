import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, Info } from "lucide-react";
import { getNextVolumeDiscountTier, VOLUME_DISCOUNTS } from "@/lib/advertDiscounts";

interface VolumeDiscountInfoProps {
  activeAdvertCount: number;
  currentDiscountPercentage?: number;
}

export const VolumeDiscountInfo = ({ 
  activeAdvertCount,
  currentDiscountPercentage = 0 
}: VolumeDiscountInfoProps) => {
  const nextTier = getNextVolumeDiscountTier(activeAdvertCount);
  const hasDiscount = currentDiscountPercentage > 0;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-sm">Volume Discount</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-2">Volume Discount Tiers</p>
                    <ul className="text-xs space-y-1">
                      {VOLUME_DISCOUNTS.map((tier, index) => {
                        const nextTier = VOLUME_DISCOUNTS[index + 1];
                        const label = nextTier 
                          ? `${tier.minAdverts}-${nextTier.minAdverts - 1} adverts: ${tier.percentage}% discount`
                          : `${tier.minAdverts}+ adverts: ${tier.percentage}% discount`;
                        
                        return <li key={tier.minAdverts}>• {label}</li>;
                      })}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Adverts:</span>
                <span className="font-medium">{activeAdvertCount}</span>
              </div>

              {hasDiscount ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Discount:</span>
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                    {currentDiscountPercentage}% off
                  </Badge>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  No volume discount yet
                </div>
              )}

              {nextTier && (
                <div className="pt-2 border-t border-primary/10">
                  <p className="text-xs text-muted-foreground">
                    Create {nextTier.minAdverts - activeAdvertCount} more {nextTier.minAdverts - activeAdvertCount === 1 ? 'advert' : 'adverts'} to unlock{" "}
                    <span className="font-semibold text-primary">{nextTier.percentage}% discount</span>
                  </p>
                </div>
              )}

              {activeAdvertCount >= 21 && (
                <div className="pt-2 border-t border-primary/10">
                  <p className="text-xs font-medium text-green-600">
                    🎉 Maximum volume discount unlocked!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
