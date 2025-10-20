import { MultipleDisplayCount } from "@/types/advert";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MultipleCountCardProps {
  count: MultipleDisplayCount;
  selected: boolean;
  category: "pictorial" | "video";
  onSelect: () => void;
  index: number;
}

const SETUP_FEES: Record<MultipleDisplayCount, { pictorial: number; video: number }> = {
  2: { pictorial: 40000, video: 60000 },
  3: { pictorial: 60000, video: 90000 },
  4: { pictorial: 80000, video: 120000 },
  5: { pictorial: 100000, video: 150000 },
  6: { pictorial: 120000, video: 180000 },
  7: { pictorial: 140000, video: 210000 },
  8: { pictorial: 160000, video: 240000 },
  9: { pictorial: 180000, video: 270000 },
  10: { pictorial: 200000, video: 300000 },
};

export function MultipleCountCard({ count, selected, category, onSelect, index }: MultipleCountCardProps) {
  const fees = SETUP_FEES[count];
  const nairaFee = category === "pictorial" ? fees.pictorial : fees.video;
  const mobiFee = nairaFee; // 1:1 ratio

  const formatCurrency = (amount: number) => {
    return `₦${(amount / 1000).toFixed(0)}K`;
  };

  const formatMobi = (amount: number) => {
    return `${(amount / 1000).toFixed(0)}K Mobi`;
  };

  return (
    <Card
      className={cn(
        "p-2 sm:p-3 cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
        index % 2 === 0 && "bg-accent/10",
        selected && "border-primary border-2 bg-primary/5 shadow-lg"
      )}
      onClick={onSelect}
    >
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center justify-between gap-1">
          <h4 className="font-semibold text-xs sm:text-sm">{count}-in-1</h4>
          {selected && <Badge variant="default" className="text-xs py-0 px-1.5 h-5">✓</Badge>}
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-1">
          {count} adverts
        </p>

        <div className="pt-1.5 border-t">
          <p className="text-xs text-muted-foreground">Setup:</p>
          <div className="flex flex-col gap-0.5 mt-0.5">
            <p className="text-primary font-bold text-sm sm:text-base">{formatCurrency(nairaFee)}</p>
            <p className="text-xs text-muted-foreground">{formatMobi(mobiFee)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
