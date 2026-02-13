import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";
import type { QuizGameRecord } from "@/data/quizGamesPlayedData";
import { MemberPreviewDialog } from "@/components/community/MemberPreviewDialog";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface Props {
  game: QuizGameRecord | null;
  onClose: () => void;
}

export function QuizGameDetailDrawer({ game, onClose }: Props) {
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);
  const [showMemberPreview, setShowMemberPreview] = useState(false);

  if (!game) return null;

  const netPosition = game.prizeWon - game.stakePaid;
  const date = new Date(game.datePlayed);

  const copyGameId = () => {
    navigator.clipboard.writeText(game.gameId);
    toast.success("Game ID copied");
  };

  const openPlayerProfile = () => {
    setSelectedMember({
      id: game.id.toString(),
      name: game.playerName,
      position: `${game.state}, ${game.country}`,
      imageUrl: "",
      tenure: "Player",
      level: "staff" as const,
      committee: "staff" as const,
    });
    setShowMemberPreview(true);
  };

  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: "Game ID",
      value: (
        <button onClick={copyGameId} className="flex items-center gap-1 text-primary font-medium">
          {game.gameId}
          <Copy className="h-3 w-3" />
        </button>
      ),
    },
    { label: "Player Name", value: <button onClick={openPlayerProfile} className="text-primary underline underline-offset-2 font-medium">{game.playerName}</button> },
    { label: "State", value: game.state },
    { label: "Country", value: game.country },
    { label: "Game Mode", value: game.gameMode },
    { label: "Category", value: game.category },
    { label: "Difficulty", value: <Badge variant="secondary" className="text-xs">{game.difficulty}</Badge> },
    { label: "Score", value: game.score },
    {
      label: "Result",
      value: game.result === "Won"
        ? <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">Won</Badge>
        : <Badge variant="secondary" className="text-xs text-red-500">Lost</Badge>,
    },
    { label: "Stake Paid", value: formatMobi(game.stakePaid) },
    { label: "Prize Won", value: formatMobi(game.prizeWon) },
    {
      label: "Net Position",
      value: (
        <span className={netPosition >= 0 ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
          {netPosition >= 0 ? "+" : ""}{formatMobi(Math.abs(netPosition))}
        </span>
      ),
    },
    { label: "Date Played", value: format(date, "MMM dd, yyyy") },
    { label: "Time Played", value: format(date, "hh:mm a") },
  ];

  return (
    <>
    <Drawer open={!!game} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[92vh]">
        <div className="overflow-y-auto touch-auto px-4 pb-6">
          <DrawerHeader className="px-0 pt-4 pb-3">
            <DrawerTitle className="text-base break-words">Game Details</DrawerTitle>
          </DrawerHeader>
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-3 py-2 border-b border-border/40 last:border-0">
                <span className="text-xs text-muted-foreground shrink-0">{row.label}</span>
                <span className="text-sm text-right break-words min-w-0">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
    <MemberPreviewDialog member={selectedMember} open={showMemberPreview} onOpenChange={setShowMemberPreview} />
    </>
  );
}
