import { DisplayMode } from "@/types/advert";
import { Card } from "@/components/ui/card";
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
  const pictorialPrice = isSingle ? "₦30,000" : "Starting from ₦40,000";
  const videoPrice = isSingle ? "₦45,000" : "Starting from ₦60,000";
  const mobiPrice = isSingle 
    ? (category === "pictorial" ? "30,000 Mobi" : "45,000 Mobi")
    : (category === "pictorial" ? "Starting from 40,000 Mobi" : "Starting from 60,000 Mobi");

  return (
    <Card
      className={cn(
        "p-6 cursor-pointer transition-all hover:border-primary/50",
        selected && "border-primary border-2 bg-primary/5"
      )}
      onClick={onSelect}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center",
          selected ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          {isSingle ? (
            <ImageIcon className="h-8 w-8" />
          ) : (
            <Images className="h-8 w-8" />
          )}
        </div>
        
        <div>
          <h3 className="font-semibold text-lg">
            {isSingle ? "Single Display" : "Multiple Displays"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {isSingle ? "One advert display" : "2-10 adverts in rotation"}
          </p>
        </div>

        <div className="pt-2 border-t w-full">
          <p className="text-sm font-medium">24-Month Setup Fee:</p>
          <p className="text-primary font-semibold mt-1">
            {category === "pictorial" ? pictorialPrice : videoPrice}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{mobiPrice}</p>
        </div>
      </div>
    </Card>
  );
}
