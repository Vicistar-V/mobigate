import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, TrendingUp, Award } from "lucide-react";
import { SLOT_PACKS } from "@/data/slotPacks";
import { SlotPackId } from "@/types/advert";

interface SlotPackSelectorProps {
  selectedPackId?: SlotPackId;
  onSelectPack: (packId: SlotPackId) => void;
  excludeEntry?: boolean;
}

export function SlotPackSelector({ selectedPackId, onSelectPack, excludeEntry }: SlotPackSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Slot Pack</h2>
        <p className="text-muted-foreground">
          Select a pack to create multiple Adverts with additional discounts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {SLOT_PACKS.filter(pack => !excludeEntry || pack.id !== "entry").map((pack) => (
          <Card
            key={pack.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedPackId === pack.id
                ? "ring-2 ring-primary shadow-lg"
                : "hover:border-primary/50"
            }`}
            onClick={() => onSelectPack(pack.id)}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{pack.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    [{pack.minSlots}-{pack.maxSlots} Slots]
                  </p>
                </div>
                {selectedPackId === pack.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className={pack.discountPercentage > 0 ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-500 hover:bg-gray-600 text-white"}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {pack.discountPercentage}% Discount
                </Badge>
                
                {pack.id !== "entry" && (
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
                    <Award className="h-3 w-3 mr-1" />
                    Accredited Only
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                {pack.description}
              </p>

              <div className="pt-2 border-t text-xs text-muted-foreground">
                <p>• Min: {pack.minSlots} slots required</p>
                <p>• Max: {pack.maxSlots} slots allowed</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
