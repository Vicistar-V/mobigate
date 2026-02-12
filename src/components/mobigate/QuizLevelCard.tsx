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
    <Card>
      <CardContent className="p-3 space-y-2">
        {/* Row 1: Switch + Level Name + Delete */}
        <div className="flex items-center gap-2">
          <Switch
            checked={entry.isActive}
            onCheckedChange={() => onToggleStatus(entry.id)}
            className="shrink-0"
          />
          <p className="font-semibold text-base flex-1 min-w-0 break-words">{entry.levelName}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(entry.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Row 2: Category + Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {entry.category}
          </Badge>
          <Badge
            variant={entry.isActive ? "default" : "secondary"}
            className={entry.isActive ? "bg-success hover:bg-success/90 text-xs" : "text-xs"}
          >
            {entry.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Row 3: Stake & Winning */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-muted/40 rounded-md">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Stake</p>
            <p className="text-sm font-bold flex items-center gap-1">
              <Coins className="h-3 w-3 text-amber-500" />
              {formatMobi(entry.stakeAmount)}
            </p>
          </div>
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-md">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Winning</p>
            <p className="text-sm font-bold text-success flex items-center gap-1">
              <Coins className="h-3 w-3 text-success" />
              {formatMobi(entry.winningAmount)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
