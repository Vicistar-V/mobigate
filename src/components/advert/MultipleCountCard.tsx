import { MultipleDisplayCount } from "@/types/advert";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MultipleCountCardProps {
  count: MultipleDisplayCount;
  selected: boolean;
  category: "pictorial" | "video";
  onSelect: () => void;
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

export function MultipleCountCard({ count, selected, category, onSelect }: MultipleCountCardProps) {
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
        "p-4 cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
        selected && "border-primary border-2 bg-primary/5 shadow-lg"
      )}
      onClick={onSelect}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-base">{count}-in-1 Multiple</h4>
          {selected && <Badge variant="default">Selected</Badge>}
        </div>
        
        <p className="text-xs text-muted-foreground">
          Upload {count} different adverts
        </p>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">24-Month Setup Fee:</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-primary font-bold text-lg">{formatCurrency(nairaFee)}</p>
            <p className="text-xs text-muted-foreground">/ {formatMobi(mobiFee)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
