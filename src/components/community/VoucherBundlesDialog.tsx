import { X, Check, Gift, Store, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { voucherBundles, partnerMerchants, voucherTerms } from "@/data/voucherBundlesData";
import { useToast } from "@/hooks/use-toast";

interface VoucherBundlesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VoucherBundlesDialog({ open, onOpenChange }: VoucherBundlesDialogProps) {
  const { toast } = useToast();

  const handleSubscribe = (bundleName: string, price: number) => {
    toast({
      title: "Subscription Initiated",
      description: `${bundleName} package - NGN ${price.toLocaleString()}`,
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "basic":
        return "border-blue-500/30 bg-blue-500/5";
      case "standard":
        return "border-primary/30 bg-primary/5";
      case "premium":
        return "border-yellow-500/30 bg-yellow-500/5";
      default:
        return "";
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "basic":
        return "bg-blue-500/10 text-blue-700";
      case "standard":
        return "bg-primary/10 text-primary";
      case "premium":
        return "bg-yellow-500/10 text-yellow-700";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0 sticky top-0 bg-background z-10 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Voucher Bundles</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Save more with bulk voucher purchases
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(95vh-100px)]">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Bundle Packages */}
            <div className="grid md:grid-cols-3 gap-4">
              {voucherBundles.map((bundle) => (
                <Card
                  key={bundle.id}
                  className={`relative ${getTierColor(bundle.tier)} ${
                    bundle.popular ? "border-2 shadow-lg" : ""
                  }`}
                >
                  {bundle.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getTierBadge(bundle.tier)}>
                        {bundle.tier}
                      </Badge>
                      <span className="text-xs font-semibold text-green-600">
                        Save {bundle.savingsPercentage}%
                      </span>
                    </div>
                    <CardTitle className="text-lg">{bundle.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{bundle.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-3xl font-bold">
                        {bundle.currency} {bundle.price.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {bundle.voucherCount} vouchers • {bundle.validityPeriod}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {bundle.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 text-xs">
                          <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleSubscribe(bundle.name, bundle.price)}
                      className="w-full"
                      variant={bundle.popular ? "default" : "outline"}
                    >
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Partner Merchants */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  Partner Merchants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {partnerMerchants.map((merchant) => (
                    <div key={merchant.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="bg-muted rounded p-2 shrink-0">
                        <Store className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{merchant.name}</h4>
                        <p className="text-xs text-muted-foreground mb-1">{merchant.category}</p>
                        <Badge variant="secondary" className="text-xs">
                          {merchant.discount}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center shrink-0 text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-sm">Choose Your Bundle</p>
                    <p className="text-xs text-muted-foreground">
                      Select the package that best suits your needs
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center shrink-0 text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm">Make Payment</p>
                    <p className="text-xs text-muted-foreground">
                      Complete secure payment via available methods
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center shrink-0 text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm">Receive Vouchers</p>
                    <p className="text-xs text-muted-foreground">
                      Vouchers are instantly activated in your account
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center shrink-0 text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-sm">Start Saving</p>
                    <p className="text-xs text-muted-foreground">
                      Use vouchers at any partner merchant
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms & Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {voucherTerms.map((term, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex gap-2">
                      <span className="shrink-0">•</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
