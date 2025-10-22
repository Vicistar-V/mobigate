import { DisplayMode } from "@/types/advert";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ImageIcon, Images } from "lucide-react";

interface DisplayModeCardProps {
  mode: DisplayMode;
  selected: boolean;
  category: "pictorial" | "video";
  onSelect: () => void;
}

export function DisplayModeCard({ mode, selected, category, onSelect }: DisplayModeCardProps) {
  const isSingle = mode === "single";
  const isRollout = mode === "rollout";
  
  let pictorialPrice: string;
  let videoPrice: string;
  let mobiPrice: string;
  
  if (isSingle) {
    pictorialPrice = "₦30,000";
    videoPrice = "₦45,000";
    mobiPrice = category === "pictorial" ? "30,000 Mobi" : "45,000 Mobi";
  } else if (isRollout) {
    pictorialPrice = "Starting from ₦70,000";
    videoPrice = "Starting from ₦70,000";
    mobiPrice = "Starting from 70,000 Mobi";
  } else {
    pictorialPrice = "Starting from ₦40,000";
    videoPrice = "Starting from ₦60,000";
    mobiPrice = category === "pictorial" ? "Starting from 40,000 Mobi" : "Starting from 60,000 Mobi";
  }

  return (
    <Card
      className={cn(
        "p-3 cursor-pointer transition-all hover:border-primary/50 h-full",
        selected && "border-primary border-2 bg-primary/5"
      )}
      onClick={onSelect}
    >
      <div className="flex flex-col items-center text-center gap-2 h-full">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          selected ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          {isSingle ? (
            <ImageIcon className="h-5 w-5" />
          ) : (
            <Images className="h-5 w-5" />
          )}
        </div>
        
        <div className="w-full">
          <h3 className="font-semibold text-sm">
            {isSingle ? "Single Display" : isRollout ? "Multiple Roll-out Display" : "Multiple Bundled Display"}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isSingle ? "One advert" : "2-10 adverts"}
          </p>

          <div className="mt-2 pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground">Base Setup:</p>
            <p className="text-primary font-semibold text-sm mt-0.5">
              {category === "pictorial" ? pictorialPrice : videoPrice}
            </p>
            <p className="text-xs text-muted-foreground">{mobiPrice}</p>
            <Badge variant="secondary" className="text-xs mt-1">
              {isRollout ? "+ Size Fee (12-20%)" : `+ Size Fee (0-${isSingle ? "10" : "20"}%)`}
            </Badge>
            {isRollout && (
              <p className="text-xs text-warning-foreground mt-1">
                Only 5x6, 6.5x6, 10x6 sizes
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
