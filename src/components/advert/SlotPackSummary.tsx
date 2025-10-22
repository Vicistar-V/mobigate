import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package } from "lucide-react";
import { SlotPackDraft } from "@/types/advert";
import { getSlotPack } from "@/data/slotPacks";
import { calculatePackTotal } from "@/lib/slotPackStorage";

interface SlotPackSummaryProps {
  packDraft: SlotPackDraft;
}

export function SlotPackSummary({ packDraft }: SlotPackSummaryProps) {
  const pack = getSlotPack(packDraft.packId);
  const { subtotal, packDiscount, finalTotal } = calculatePackTotal(packDraft);

  if (!pack || packDraft.slots.length === 0) return null;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Pack Summary</CardTitle>
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            <TrendingUp className="h-3 w-3 mr-1" />
            {pack.discountPercentage}% Off
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <p className="font-semibold">{pack.name}</p>
            <p className="text-xs text-muted-foreground">
              {packDraft.slots.length} slot{packDraft.slots.length !== 1 ? 's' : ''} filled
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal ({packDraft.slots.length} slots)</span>
            <span className="font-medium">₦{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm font-semibold text-green-600">
            <span>Pack Discount ({pack.discountPercentage}%)</span>
            <span>-₦{packDiscount.toLocaleString()}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <span className="font-bold">Total Amount</span>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              ₦{finalTotal.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {finalTotal.toLocaleString()} Mobi
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded">
          💡 You're saving ₦{packDiscount.toLocaleString()} with this pack!
        </div>
      </CardContent>
    </Card>
  );
}
