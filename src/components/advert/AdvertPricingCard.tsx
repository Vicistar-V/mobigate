import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AdvertPricing } from "@/types/advert";
import { formatCurrency, formatMobi } from "@/lib/advertPricing";
import { Zap, TrendingUp } from "lucide-react";

interface AdvertPricingCardProps {
  pricing: AdvertPricing;
  walletBalance?: number;
}

export const AdvertPricingCard = ({ pricing, walletBalance = 500000 }: AdvertPricingCardProps) => {
  const hasInsufficientFunds = walletBalance < pricing.totalCost;

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
        {/* Base Costs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Setup Fee (24 months)</span>
            <span className="font-medium">{formatCurrency(pricing.setupFee)}</span>
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

        {/* Total */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Cost</span>
            <div className="text-right">
              <div className="font-bold text-lg">{formatCurrency(pricing.totalCost)}</div>
              <div className="text-xs text-muted-foreground">{formatMobi(pricing.totalCostMobi)}</div>
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
        <div className="space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <TrendingUp className="h-4 w-4" />
            Display Performance
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Frequency</span>
              <span className="font-medium">{pricing.displayFrequency}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Daily Reach</span>
              <span className="font-medium">
                {pricing.displayPerDay === Infinity ? "Unlimited" : `${pricing.displayPerDay.toLocaleString()} views`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
