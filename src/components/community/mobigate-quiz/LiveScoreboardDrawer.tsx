import { useState } from "react";
import { Heart, MessageCircle, Share2, Star, Radio, Trophy, Flame, Zap } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatMobiAmount } from "@/lib/mobiCurrencyTranslation";
import {
  mockLiveScoreboardPlayers,
  LiveScoreboardPlayer,
  FanAction,
  getFeeForAction,
} from "@/data/liveScoreboardData";

interface LiveScoreboardDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LiveScoreboardDrawer({ open, onOpenChange }: LiveScoreboardDrawerProps) {
  const { toast } = useToast();
  const [players, setPlayers] = useState<LiveScoreboardPlayer[]>(
    [...mockLiveScoreboardPlayers].sort((a, b) => b.points - a.points || b.winStreak - a.winStreak)
  );
  const [joinedFans, setJoinedFans] = useState<Set<string>>(new Set());
  const [commentingPlayer, setCommentingPlayer] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const handleFanAction = (player: LiveScoreboardPlayer, action: FanAction) => {
    if (action === "join_fans" && joinedFans.has(player.id)) {
      toast({ title: "Already a fan!", description: `You're already a fan of ${player.name}.` });
      return;
    }

    if (action === "comment") {
      setCommentingPlayer(prev => prev === player.id ? null : player.id);
      return;
    }

    const fee = getFeeForAction(action);
    const actionLabel = action === "like" ? "Liked" : action === "share" ? "Shared" : "Joined Fans of";

    // Update stats
    setPlayers(prev => prev.map(p => {
      if (p.id !== player.id) return p;
      return {
        ...p,
        likes: action === "like" ? p.likes + 1 : p.likes,
        shares: action === "share" ? p.shares + 1 : p.shares,
        fanCount: action === "join_fans" ? p.fanCount + 1 : p.fanCount,
      };
    }));

    if (action === "join_fans") {
      setJoinedFans(prev => new Set(prev).add(player.id));
    }

    toast({
      title: `${action === "like" ? "❤️" : action === "share" ? "📤" : "⭐"} ${actionLabel} ${player.name}!`,
      description: `${formatMobiAmount(fee)} charged from your wallet.`,
    });
  };

  const handleSubmitComment = (player: LiveScoreboardPlayer) => {
    if (!commentText.trim()) return;
    const fee = getFeeForAction("comment");

    setPlayers(prev => prev.map(p =>
      p.id === player.id ? { ...p, comments: p.comments + 1 } : p
    ));

    toast({
      title: `💬 Comment sent to ${player.name}!`,
      description: `"${commentText.slice(0, 40)}${commentText.length > 40 ? "..." : ""}" — ${formatMobiAmount(fee)} charged.`,
    });
    setCommentText("");
    setCommentingPlayer(null);
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-400 text-yellow-900 border-yellow-500";
    if (rank === 2) return "bg-gray-300 text-gray-800 border-gray-400";
    if (rank === 3) return "bg-amber-600 text-white border-amber-700";
    return "bg-muted text-muted-foreground border-border";
  };

  const onlinePlayers = players.filter(p => p.isOnline).length;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh] flex flex-col">
        {/* Header */}
        <DrawerHeader className="shrink-0 pb-2">
          <DrawerTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Live Scoreboard
            <Badge className="bg-red-500 text-white border-0 animate-pulse text-[10px] ml-1">
              <Radio className="h-2.5 w-2.5 mr-0.5" /> LIVE
            </Badge>
          </DrawerTitle>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {onlinePlayers} online
            </span>
            <span>Top 15 Players</span>
          </div>
        </DrawerHeader>

        {/* Scrollable player list */}
        <ScrollArea className="flex-1 max-h-[78vh] px-3 pb-4">
          <div className="space-y-2.5">
            {players.map((player, idx) => {
              const rank = idx + 1;
              const isCommenting = commentingPlayer === player.id;
              const isJoined = joinedFans.has(player.id);

              return (
                <div
                  key={player.id}
                  className="rounded-xl border bg-card p-3 space-y-2"
                >
                  {/* Top row: rank + player info + points */}
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${getRankStyle(rank)}`}>
                      {rank}
                    </div>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={`text-xs font-bold ${player.isOnline ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                        {player.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold truncate">{player.name}</span>
                        {player.isOnline && <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {player.merchantName} • {player.seasonName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-amber-600">{player.points.toLocaleString()}</p>
                      <p className="text-[9px] text-muted-foreground">pts</p>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Zap className="h-3 w-3 text-blue-500" /> Sess {player.currentSession}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Flame className="h-3 w-3 text-orange-500" /> {player.winStreak} streak
                    </span>
                    <span>{player.totalCorrect}/{player.totalPlayed} correct</span>
                    <span className="ml-auto flex items-center gap-0.5">
                      <Star className="h-3 w-3 text-purple-500" /> {player.fanCount} fans
                    </span>
                  </div>

                  {/* Fan action bar */}
                  <div className="flex items-center justify-between pt-1 border-t border-border/50">
                    {/* Like */}
                    <button
                      className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg active:bg-red-50 dark:active:bg-red-950/30 transition-colors touch-manipulation"
                      onClick={() => handleFanAction(player, "like")}
                    >
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-[8px] text-muted-foreground">{player.likes}</span>
                      <span className="text-[7px] text-red-400">{formatMobiAmount(getFeeForAction("like"))}</span>
                    </button>

                    {/* Comment */}
                    <button
                      className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors touch-manipulation ${isCommenting ? "bg-blue-50 dark:bg-blue-950/30" : "active:bg-blue-50 dark:active:bg-blue-950/30"}`}
                      onClick={() => handleFanAction(player, "comment")}
                    >
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-[8px] text-muted-foreground">{player.comments}</span>
                      <span className="text-[7px] text-blue-400">{formatMobiAmount(getFeeForAction("comment"))}</span>
                    </button>

                    {/* Share */}
                    <button
                      className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg active:bg-green-50 dark:active:bg-green-950/30 transition-colors touch-manipulation"
                      onClick={() => handleFanAction(player, "share")}
                    >
                      <Share2 className="h-4 w-4 text-green-500" />
                      <span className="text-[8px] text-muted-foreground">{player.shares}</span>
                      <span className="text-[7px] text-green-400">{formatMobiAmount(getFeeForAction("share"))}</span>
                    </button>

                    {/* Join Fans */}
                    <button
                      className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors touch-manipulation ${isJoined ? "bg-purple-100 dark:bg-purple-950/40" : "active:bg-purple-50 dark:active:bg-purple-950/30"}`}
                      onClick={() => handleFanAction(player, "join_fans")}
                    >
                      <Star className={`h-4 w-4 ${isJoined ? "text-purple-600 fill-purple-500" : "text-purple-500"}`} />
                      <span className="text-[8px] text-muted-foreground">{isJoined ? "Joined" : "Join"}</span>
                      <span className="text-[7px] text-purple-400">{isJoined ? "✓" : formatMobiAmount(getFeeForAction("join_fans"))}</span>
                    </button>
                  </div>

                  {/* Inline comment input */}
                  {isCommenting && (
                    <div className="flex gap-2 pt-1">
                      <Input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={`Comment on ${player.name}...`}
                        className="h-8 text-xs"
                        onKeyDown={(e) => { if (e.key === "Enter") handleSubmitComment(player); }}
                      />
                      <Button
                        size="sm"
                        className="h-8 text-xs px-3"
                        onClick={() => handleSubmitComment(player)}
                        disabled={!commentText.trim()}
                      >
                        Send
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
