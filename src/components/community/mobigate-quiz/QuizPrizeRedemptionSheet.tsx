import { useState } from "react";
import { Package, Wallet, Truck, CheckCircle } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";

interface QuizPrizeRedemptionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prizeAmount: number;
  prizeType: "cash" | "items" | "scholarship";
  itemNames?: string[];
}

export function QuizPrizeRedemptionSheet({ open, onOpenChange, prizeAmount, prizeType, itemNames }: QuizPrizeRedemptionSheetProps) {
  const { toast } = useToast();
  const [method, setMethod] = useState("wallet");
  const [redeemed, setRedeemed] = useState(false);

  const handleRedeem = () => {
    setRedeemed(true);
    toast({
      title: "🎉 Prize Redeemed!",
      description: method === "wallet" 
        ? `${formatLocalAmount(prizeAmount, "NGN")} credited to your wallet`
        : method === "store" 
          ? "Visit your nearest Mobi-Store to collect"
          : "Delivery will be arranged within 3-5 days",
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" /> Claim Your Prize
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-4 overflow-y-auto touch-auto">
          {!redeemed ? (
            <>
              <Card className="border-green-300 bg-green-50 dark:bg-green-950/30">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">You Won</p>
                  <p className="text-2xl font-bold text-green-600">{formatLocalAmount(prizeAmount, "NGN")}</p>
                  <p className="text-xs text-muted-foreground">({formatMobiAmount(prizeAmount)})</p>
                  {itemNames && itemNames.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-xs font-medium text-green-700 mb-1">Items Won:</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {itemNames.map((item, i) => (
                          <span key={i} className="text-[10px] bg-green-100 px-2 py-0.5 rounded-full">{item}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-2">
                <p className="text-sm font-medium">Choose Redemption Method</p>
                <RadioGroup value={method} onValueChange={setMethod} className="space-y-2">
                  <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 touch-manipulation">
                    <RadioGroupItem value="wallet" />
                    <Wallet className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">Credit to Wallet</p>
                      <p className="text-xs text-muted-foreground">Instant credit to your Mobi wallet</p>
                    </div>
                  </Label>
                  <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 touch-manipulation">
                    <RadioGroupItem value="store" />
                    <Package className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Collect at Mobi-Store</p>
                      <p className="text-xs text-muted-foreground">Pick up from nearest store location</p>
                    </div>
                  </Label>
                  {prizeType === "items" && (
                    <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 touch-manipulation">
                      <RadioGroupItem value="delivery" />
                      <Truck className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Home Delivery</p>
                        <p className="text-xs text-muted-foreground">Delivered within 3-5 business days</p>
                      </div>
                    </Label>
                  )}
                </RadioGroup>
              </div>

              {prizeType === "scholarship" && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 rounded-lg text-xs text-muted-foreground">
                  <p className="font-medium text-indigo-700 mb-1">📝 Scholarship Note</p>
                  <p>Prize will be credited within 21 days of winning. You also receive free access to Mobi-School.</p>
                </div>
              )}

              <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white" onClick={handleRedeem}>
                Redeem Prize
              </Button>
            </>
          ) : (
            <Card className="border-green-300 bg-green-50 dark:bg-green-950/30">
              <CardContent className="p-6 text-center space-y-3">
                <p className="text-5xl">🎉</p>
                <h3 className="text-lg font-bold text-green-700">Prize Redeemed Successfully!</h3>
                <p className="text-sm text-muted-foreground">
                  {method === "wallet" && "Amount credited to your wallet instantly."}
                  {method === "store" && "Visit your nearest Mobi-Store to collect."}
                  {method === "delivery" && "Your items will be delivered within 3-5 days."}
                </p>
                <Button className="w-full h-12" onClick={() => onOpenChange(false)}>Done</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
