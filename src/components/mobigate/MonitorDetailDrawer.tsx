import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import type { GameModeData, RecentResultData } from "@/pages/admin/quiz/MonitorQuizPage";
import { Trophy, Gamepad2 } from "lucide-react";

export type DrawerData =
  | { type: "mode"; data: GameModeData }
  | { type: "result"; data: RecentResultData };

interface Props {
  data: DrawerData | null;
  onClose: () => void;
}

function ModeContent({ mode }: { mode: GameModeData }) {
  const Icon = mode.icon;
  return (
    <div className="space-y-4 px-4 pb-6">
      <div className="flex items-center gap-3 pt-2">
        <div className="p-3 rounded-xl bg-muted/50">
          <Icon className={`h-6 w-6 ${mode.color}`} />
        </div>
        <div>
          <p className="text-lg font-bold">{mode.mode}</p>
          <p className="text-sm text-muted-foreground">Live Statistics</p>
        </div>
      </div>
      <div className="space-y-3">
        {[
          { label: "Active Sessions", value: String(mode.sessions) },
          { label: "Total Players", value: String(mode.players) },
          { label: "Total Stakes", value: formatMobi(mode.stakes), primary: true },
          { label: "Average Score", value: mode.avgScore },
          { label: "Win Rate", value: mode.winRate },
          { label: "Top Player", value: mode.topPlayer },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <span className="text-sm text-muted-foreground">{row.label}</span>
            <span className={`text-sm font-bold break-words text-right max-w-[50%] ${row.primary ? "text-primary" : ""}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultContent({ result }: { result: RecentResultData }) {
  return (
    <div className="space-y-4 px-4 pb-6">
      <div className="flex items-center gap-3 pt-2">
        <div className="p-3 rounded-xl bg-muted/50">
          <Trophy className={`h-6 w-6 ${result.won ? "text-amber-500" : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold break-words">{result.player}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="secondary" className="text-xs">{result.mode}</Badge>
            {result.won ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                Won
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs text-red-500">Lost</Badge>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {[
          { label: "Score", value: result.score },
          { label: "Category", value: result.category },
          { label: "Difficulty", value: result.difficulty },
          { label: "Questions Answered", value: String(result.questionsAnswered) },
          { label: "Prize", value: result.prize > 0 ? formatMobi(result.prize) : "No prize", primary: result.prize > 0 },
          { label: "Time", value: result.time },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <span className="text-sm text-muted-foreground">{row.label}</span>
            <span className={`text-sm font-bold break-words text-right max-w-[50%] ${row.primary ? "text-primary" : ""}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonitorDetailDrawer({ data, onClose }: Props) {
  const isMobile = useIsMobile();

  if (!data) return null;

  const title = data.type === "mode" ? "Game Mode Details" : "Result Details";
  const content = data.type === "mode"
    ? <ModeContent mode={data.data} />
    : <ResultContent result={data.data} />;

  if (isMobile) {
    return (
      <Drawer open={!!data} onOpenChange={open => !open && onClose()}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="px-4 pb-0">
            <DrawerTitle className="text-base">{title}</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto touch-auto flex-1">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={!!data} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
