import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AdvertPricing } from "@/types/advert";
import { formatCurrency, formatMobi } from "@/lib/advertPricing";
import { Zap, TrendingUp, Sparkles } from "lucide-react";
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
      {/* Base Costs */}
      <div className="space-y-2">
        {pricing.baseSetupFee !== undefined && pricing.sizeFee !== undefined && pricing.sizeFee > 0 && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Base Setup Fee</span>
              <span className="font-medium">{formatCurrency(pricing.baseSetupFee)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Size Fee ({pricing.sizeMultiplier ? (pricing.sizeMultiplier * 100).toFixed(1).replace(/\.0$/, '') : '0'}%)
              </span>
              <span className="font-medium text-primary">+{formatCurrency(pricing.sizeFee)}</span>
            </div>
          </>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Setup Fee Total (24 months)</span>
          <span className="font-semibold">{formatCurrency(pricing.setupFee)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">DPD Package</span>
          <span className="font-medium">{formatCurrency(pricing.dpdCost)}</span>
        </div>
      </div>

      {/* Optional Charges */}
      {(pricing.extendedExposureCost > 0 || pricing.recurrentAfterCost > 0 || pricing.recurrentEveryCost > 0) && (
        <>
          <Separator />
          <div className="space-y-2">
            {pricing.extendedExposureCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Extended Exposure</span>
                <span className="font-medium text-primary">+{formatCurrency(pricing.extendedExposureCost)}</span>
              </div>
            )}
            {pricing.recurrentAfterCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Recurrent After</span>
                <span className="font-medium text-primary">+{formatCurrency(pricing.recurrentAfterCost)}</span>
              </div>
            )}
            {pricing.recurrentEveryCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Recurrent Every</span>
                <span className="font-medium text-primary">+{formatCurrency(pricing.recurrentEveryCost)}</span>
              </div>
            )}
          </div>
        </>
      )}

      <Separator />

      {/* Discounts Section */}
      {hasDiscounts && (
        <>
          <div className="space-y-2 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-sm text-green-600">Discounts Applied</span>
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

      {/* Total */}
      <div className="space-y-3">
        {hasDiscounts && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium line-through">{formatCurrency(pricing.subtotalBeforeDiscount!)}</span>
          </div>
        )}

        {hasDiscounts && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Discount</span>
            <span className="font-bold text-green-600">-{formatCurrency(pricing.totalDiscount!)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="font-semibold">{hasDiscounts ? "Final Amount Payable" : "Total Cost@Setup"}</span>
          <div className="text-right">
            <div className={`font-bold text-lg ${hasDiscounts ? "text-green-600" : ""}`}>
              {formatCurrency(finalAmount)}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatMobi(pricing.finalAmountPayableMobi ?? pricing.totalCostMobi)}
            </div>
          </div>
        </div>

        {hasDiscounts && (
          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm font-medium text-green-600 text-center">
              🎉 You're saving {formatCurrency(pricing.totalDiscount!)} (
              {Math.round((pricing.totalDiscount! / pricing.subtotalBeforeDiscount!) * 100)}%)
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="font-semibold">Total Recurrent Cost</span>
          <div className="text-right">
            <div className="font-bold text-lg">{formatCurrency(finalAmount - pricing.setupFee)}</div>
            <div className="text-xs text-muted-foreground">{formatMobi((finalAmount - pricing.setupFee))}</div>
          </div>
        </div>

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