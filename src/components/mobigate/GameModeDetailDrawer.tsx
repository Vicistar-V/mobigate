import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import type { GameModeData } from "@/pages/admin/quiz/MonitorQuizPage";

interface Props {
  mode: GameModeData | null;
  onClose: () => void;
}

export function GameModeDetailDrawer({ mode, onClose }: Props) {
  const isMobile = useIsMobile();

  if (!mode) return null;

  const Icon = mode.icon;

  const content = (
    <div className="space-y-4 px-4 pb-6">
      {/* Icon + Mode Name */}
      <div className="flex items-center gap-3 pt-2">
        <div className={`p-3 rounded-xl bg-muted/50`}>
          <Icon className={`h-6 w-6 ${mode.color}`} />
        </div>
        <div>
          <p className="text-lg font-bold">{mode.mode}</p>
          <p className="text-sm text-muted-foreground">Live Statistics</p>
        </div>
      </div>

      {/* Stats rows - each stat on its own row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <span className="text-sm text-muted-foreground">Active Sessions</span>
          <span className="text-sm font-bold">{mode.sessions}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <span className="text-sm text-muted-foreground">Total Players</span>
          <span className="text-sm font-bold">{mode.players}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <span className="text-sm text-muted-foreground">Total Stakes</span>
          <span className="text-sm font-bold text-primary">{formatMobi(mode.stakes)}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <span className="text-sm text-muted-foreground">Average Score</span>
          <span className="text-sm font-bold">{mode.avgScore}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <span className="text-sm text-muted-foreground">Win Rate</span>
          <span className="text-sm font-bold">{mode.winRate}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <span className="text-sm text-muted-foreground">Top Player</span>
          <span className="text-sm font-bold break-words text-right max-w-[50%]">{mode.topPlayer}</span>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={!!mode} onOpenChange={open => !open && onClose()}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="px-4 pb-0">
            <DrawerTitle className="text-base">Game Mode Details</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto touch-auto flex-1">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={!!mode} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Game Mode Details</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
