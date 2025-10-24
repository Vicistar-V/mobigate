import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AdvertPricing } from "@/types/advert";
import { formatCurrency, formatMobi } from "@/lib/advertPricing";
import { Zap, TrendingUp, Sparkles, Calendar } from "lucide-react";
interface AdvertPricingCardProps {
  pricing: AdvertPricing;
  walletBalance?: number;
  variant?: "card" | "inline";
}
export const AdvertPricingCard = ({
  pricing,
  walletBalance = 500000,
  variant = "card"
}: AdvertPricingCardProps) => {
  const finalAmount = pricing.finalAmountPayable ?? pricing.totalCost;
  const hasInsufficientFunds = walletBalance < finalAmount;
  const hasDiscounts = (pricing.appliedDiscounts?.length ?? 0) > 0;

  const content = (
    <>
      {/* Setup Fee Section */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-primary mb-1">One-Time Setup Fee</div>
        {pricing.baseSetupFee !== undefined && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground ml-2">Base Setup Cost</span>
              <span className="font-medium">{formatCurrency(pricing.baseSetupFee)}</span>
            </div>
            {pricing.sizeMultiplier !== undefined && pricing.sizeMultiplier > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground ml-2">
                  Size Fee on Setup ({(pricing.sizeMultiplier * 100).toFixed(1).replace(/\.0$/, '')}%)
                </span>
                <span className="font-medium text-primary">
                  +{formatCurrency(pricing.setupFee - pricing.baseSetupFee)}
                </span>
              </div>
            )}
          </>
        )}
        <div className="flex items-center justify-between text-sm font-semibold pt-1 border-t">
          <span>Total Setup Fee</span>
          <span className="text-primary">{formatCurrency(pricing.setupFee)}</span>
        </div>
        <div className="text-xs text-muted-foreground text-center p-2 bg-muted/20 rounded">
          One-time payment, not recurring
        </div>
      </div>

      <Separator />

      {/* Subscription DPD Section - WITHOUT discount */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-primary mb-1">Subscription DPD Cost</div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground ml-2">Base Monthly DPD Cost</span>
          <span className="font-medium">{formatCurrency(pricing.monthlyDpdCost)}</span>
        </div>
        {pricing.sizeMultiplier !== undefined && pricing.sizeMultiplier > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground ml-2">
              Size Fee on DPD ({(pricing.sizeMultiplier * 100).toFixed(1).replace(/\.0$/, '')}%)
            </span>
            <span className="font-medium text-primary">
              +{formatCurrency(Math.round(pricing.monthlyDpdCost * pricing.sizeMultiplier))}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground ml-2">
            Duration: {pricing.subscriptionMonths} month{pricing.subscriptionMonths > 1 ? 's' : ''}
          </span>
          <span className="font-medium">× {pricing.subscriptionMonths}</span>
        </div>
        <div className="flex items-center justify-between text-sm font-semibold pt-1 border-t">
          <span>Total DPD Cost (before discount)</span>
          <span className="text-primary">
            {formatCurrency((pricing.monthlyDpdCost + Math.round(pricing.monthlyDpdCost * (pricing.sizeMultiplier || 0))) * pricing.subscriptionMonths)}
          </span>
        </div>
      </div>

      {/* Optional Charges for Subscription Period */}
      {(pricing.extendedExposureCost > 0 || pricing.recurrentAfterCost > 0 || pricing.recurrentEveryCost > 0) && (
        <>
          <Separator />
          <div className="space-y-2">
            <div className="text-sm font-semibold text-primary mb-1">Optional Cost</div>
            {pricing.extendedExposureCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground ml-2">Extended Exposure ({pricing.subscriptionMonths} month{pricing.subscriptionMonths > 1 ? 's' : ''})</span>
                <span className="font-medium text-primary">+{formatCurrency(pricing.extendedExposureCost)}</span>
              </div>
            )}
            {pricing.recurrentAfterCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground ml-2">Recurrent After ({pricing.subscriptionMonths} month{pricing.subscriptionMonths > 1 ? 's' : ''})</span>
                <span className="font-medium text-primary">+{formatCurrency(pricing.recurrentAfterCost)}</span>
              </div>
            )}
            {pricing.recurrentEveryCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground ml-2">Recurrent Every ({pricing.subscriptionMonths} month{pricing.subscriptionMonths > 1 ? 's' : ''})</span>
                <span className="font-medium text-primary">+{formatCurrency(pricing.recurrentEveryCost)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm font-semibold pt-1 border-t">
              <span>Total Optional Cost</span>
              <span className="text-primary">
                {formatCurrency(pricing.extendedExposureCost + pricing.recurrentAfterCost + pricing.recurrentEveryCost)}
              </span>
            </div>
          </div>
        </>
      )}

      <Separator />

      {/* NEW: Recurrent Total Amount */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-base font-bold">
          <span>Recurrent Total Amount</span>
          <span className="text-primary">
            {formatCurrency((pricing.monthlyDpdCost * pricing.subscriptionMonths) + 
                          pricing.extendedExposureCost + 
                          pricing.recurrentAfterCost + 
                          pricing.recurrentEveryCost)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground text-center p-2 bg-muted/20 rounded">
          Total monthly subscription costs for {pricing.subscriptionMonths} month{pricing.subscriptionMonths > 1 ? 's' : ''}
        </div>
      </div>

      <Separator />

      {/* NEW: Subscription Volume Discount Section */}
      {pricing.subscriptionDiscount > 0 && (
        <>
          <div className="space-y-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-sm text-blue-600">Subscription Volume Discount</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subscription Volume</span>
              <span className="font-medium">
                {pricing.subscriptionMonths} month{pricing.subscriptionMonths > 1 ? 's' : ''} 
                {' '}({pricing.subscriptionMonths * 30} days)
              </span>
            </div>
            <div className="flex items-center justify-between text-sm font-semibold pt-1 border-t border-blue-500/20">
              <span className="text-blue-600">
                Less: Volume Discount ({(pricing.subscriptionDiscount * 100).toFixed(0)}%)
              </span>
              <span className="font-bold text-blue-600">
                -{formatCurrency(pricing.subscriptionDiscountAmount)}
              </span>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Subtotal after subscription discount */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Subtotal (After Subscription Discount)</span>
          <span className="text-primary">
            {formatCurrency(pricing.setupFee + pricing.totalDpdCost + 
                          pricing.extendedExposureCost + 
                          pricing.recurrentAfterCost + 
                          pricing.recurrentEveryCost)}
          </span>
        </div>
      </div>

      <Separator />

      {/* Other Discounts (Accredited + Volume) */}
      {hasDiscounts && (
        <>
          <div className="space-y-2 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-sm text-green-600">Other Discounts Applied</span>
            </div>
            {pricing.appliedDiscounts?.map((discount, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{discount.name}</span>
                <span className="font-medium text-green-600">
                  -{formatCurrency(discount.amount)} ({discount.percentage}%)
                </span>
              </div>
            ))}
          </div>
          <Separator />
        </>
      )}

      {/* Total Subscription Cost */}
      <div className="space-y-3">
        {hasDiscounts && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium line-through">{formatCurrency(pricing.subtotalBeforeDiscount!)}</span>
          </div>
        )}

        {hasDiscounts && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Additional Discount</span>
            <span className="font-bold text-green-600">-{formatCurrency(pricing.totalDiscount!)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg">{hasDiscounts ? "Total Subscription Cost" : "Total Subscription Cost"}</span>
          <div className="text-right">
            <div className={`font-bold text-xl ${hasDiscounts ? "text-green-600" : "text-primary"}`}>
              {formatCurrency(finalAmount)}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatMobi(pricing.finalAmountPayableMobi ?? pricing.totalCostMobi)}
            </div>
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground p-2 bg-muted/30 rounded">
          For {pricing.subscriptionMonths} month{pricing.subscriptionMonths > 1 ? 's' : ''} ({pricing.subscriptionMonths * 30} days)
        </div>

        {hasDiscounts && (
          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm font-medium text-green-600 text-center">
              🎉 Total savings: {formatCurrency((pricing.subscriptionDiscountAmount || 0) + (pricing.totalDiscount || 0))}
            </p>
          </div>
        )}

        {/* Wallet Balance */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground">Your Wallet Balance</span>
          <span className={`font-semibold ${hasInsufficientFunds ? 'text-destructive' : 'text-primary'}`}>
            {formatCurrency(walletBalance)}
          </span>
        </div>

        {hasInsufficientFunds && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive font-medium">Insufficient funds</p>
            <p className="text-xs text-muted-foreground mt-1">
              Please fund your wallet to continue
            </p>
          </div>
        )}
      </div>

      <Separator />

      {/* Display Info */}
      <div className="space-y-3 p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-primary">
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
          Display Performance
        </div>
        <div className="grid grid-cols-1 gap-2 sm:gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 p-2 sm:p-0 rounded bg-background/50 sm:bg-transparent">
            <span className="text-xs sm:text-sm text-muted-foreground">Frequency</span>
            <span className="font-medium text-sm sm:text-base">{pricing.displayFrequency}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 p-2 sm:p-0 rounded bg-background/50 sm:bg-transparent">
            <span className="text-xs sm:text-sm text-muted-foreground">Daily Reach</span>
            <span className="font-medium text-sm sm:text-base">
              {pricing.displayPerDay === Infinity ? "Unlimited" : `${pricing.displayPerDay.toLocaleString()} views`}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  if (variant === "inline") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Cost Breakdown</h3>
          <Badge variant={hasInsufficientFunds ? "destructive" : "default"}>
            <Zap className="mr-1 h-3 w-3" />
            {pricing.displayPerDay === Infinity ? "Unlimited" : `${pricing.displayPerDay} DPD`}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Your advert pricing summary</p>
        {content}
      </div>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Cost Breakdown</CardTitle>
          <Badge variant={hasInsufficientFunds ? "destructive" : "default"}>
            <Zap className="mr-1 h-3 w-3" />
            {pricing.displayPerDay === Infinity ? "Unlimited" : `${pricing.displayPerDay} DPD`}
          </Badge>
        </div>
        <CardDescription>Your advert pricing summary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {content}
      </CardContent>
    </Card>
  );
};