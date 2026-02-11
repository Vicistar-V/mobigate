import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Coins } from "lucide-react";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";
import type { QuizLevelEntry } from "@/data/mobigateQuizLevelsData";

interface QuizLevelCardProps {
  entry: QuizLevelEntry;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export function QuizLevelCard({ entry, onToggleStatus, onDelete }: QuizLevelCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 space-y-2">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate">{entry.levelName}</p>
            <Badge variant="secondary" className="text-[10px] mt-1 max-w-full truncate">
              {entry.category}
            </Badge>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Switch
              checked={entry.isActive}
              onCheckedChange={() => onToggleStatus(entry.id)}
              className="scale-90"
            />
          </div>
        </div>

        {/* Amounts row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-muted/40 rounded-md">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Stake</p>
            <p className="text-sm font-bold flex items-center gap-1">
              <Coins className="h-3 w-3 text-amber-500" />
              {formatMobi(entry.stakeAmount)}
            </p>
          </div>
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-md">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Winning</p>
            <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
              <Coins className="h-3 w-3 text-emerald-500" />
              {formatMobi(entry.winningAmount)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <Badge
            variant={entry.isActive ? "default" : "secondary"}
            className={entry.isActive ? "bg-emerald-500 hover:bg-emerald-600 text-[10px]" : "text-[10px]"}
          >
            {entry.isActive ? "Active" : "Inactive"}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(entry.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
