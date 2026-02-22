import { useState } from "react";
import { Heart, MessageCircle, Share2, Star, Radio, Trophy, Flame, Zap } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatMobiAmount } from "@/lib/mobiCurrencyTranslation";
import { shareViaNative, copyToClipboard } from "@/lib/shareUtils";
import { mockMerchants } from "@/data/mobigateInteractiveQuizData";
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

// Map merchant names to IDs from actual mock data
function findMerchantIdByName(name: string): string {
  const merchant = mockMerchants.find(m => m.name.toLowerCase().includes(name.toLowerCase().split(" ")[0]));
  return merchant?.id ?? "m1";
}

export function LiveScoreboardDrawer({ open, onOpenChange }: LiveScoreboardDrawerProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<LiveScoreboardPlayer[]>(
    [...mockLiveScoreboardPlayers].sort((a, b) => b.points - a.points || b.winStreak - a.winStreak)
  );
  const [commentingPlayer, setCommentingPlayer] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const handleFanAction = async (player: LiveScoreboardPlayer, action: FanAction) => {
    if (action === "comment") {
      setCommentingPlayer(prev => prev === player.id ? null : player.id);
      return;
    }

    if (action === "share") {
      const url = `${window.location.origin}/profile/${player.id}`;
      const shared = await shareViaNative(
        player.name,
        `Check out ${player.name}'s performance on MobiGate!`,
        url
      );
      if (!shared) {
        await copyToClipboard(url);
        toast({ title: "Link Copied!", description: `${player.name}'s profile link copied to clipboard.` });
      }
      const fee = getFeeForAction("share");
      setPlayers(prev => prev.map(p =>
        p.id === player.id ? { ...p, shares: p.shares + 1 } : p
      ));
      toast({
        title: `📤 Shared ${player.name}!`,
        description: `${formatMobiAmount(fee)} charged from your wallet.`,
      });
      return;
    }

    // Like action
    const fee = getFeeForAction(action);
    setPlayers(prev => prev.map(p => {
      if (p.id !== player.id) return p;
      return { ...p, likes: p.likes + 1 };
    }));

    toast({
      title: `❤️ Liked ${player.name}!`,
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

  const handlePlayerClick = (player: LiveScoreboardPlayer) => {
    onOpenChange(false);
    navigate(`/profile/${player.id}`);
  };

  const handleMerchantClick = (e: React.MouseEvent, player: LiveScoreboardPlayer) => {
    e.stopPropagation();
    onOpenChange(false);
    const merchantId = findMerchantIdByName(player.merchantName);
    navigate(`/merchant-home/m1`);
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
            <Badge className="bg-red-500 text-white border-0 animate-pulse text-xs ml-1">
              <Radio className="h-3 w-3 mr-0.5" /> LIVE
            </Badge>
          </DrawerTitle>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {onlinePlayers} online
            </span>
            <span>Top 15 Players</span>
          </div>
        </DrawerHeader>

        {/* Scrollable player list */}
        <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-3 pb-4">
          <div className="space-y-2.5">
            {players.map((player, idx) => {
              const rank = idx + 1;
              const isCommenting = commentingPlayer === player.id;

              return (
                <div
                  key={player.id}
                  className="rounded-xl border bg-card p-3 space-y-2"
                >
                  {/* Top row: rank + player info + points — clickable to open profile */}
                  <div
                    className="flex items-center gap-2.5 cursor-pointer active:bg-muted/40 rounded-lg -m-1 p-1 transition-colors touch-manipulation"
                    onClick={() => handlePlayerClick(player)}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${getRankStyle(rank)}`}>
                      {rank}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`} alt={player.name} />
                      <AvatarFallback className={`text-xs font-bold ${player.isOnline ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                        {player.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold break-words">{player.name}</span>
                        {player.isOnline && <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-1 flex-wrap">
                        <button
                          className="text-xs text-primary underline-offset-2 hover:underline touch-manipulation"
                          onClick={(e) => handleMerchantClick(e, player)}
                        >
                          {player.merchantName}
                        </button>
                        <span className="text-xs text-muted-foreground">• {player.seasonName}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-amber-600">{player.points.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">pts</p>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
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

                  {/* Fan action bar — Like, Comment, Share only */}
                  <div className="flex items-center justify-around pt-1 border-t border-border/50">
                    <button
                      className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg active:bg-red-50 dark:active:bg-red-950/30 transition-colors touch-manipulation"
                      onClick={() => handleFanAction(player, "like")}
                    >
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-muted-foreground">{player.likes}</span>
                      <span className="text-xs text-red-400">{formatMobiAmount(getFeeForAction("like"))}</span>
                    </button>

                    <button
                      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors touch-manipulation ${isCommenting ? "bg-blue-50 dark:bg-blue-950/30" : "active:bg-blue-50 dark:active:bg-blue-950/30"}`}
                      onClick={() => handleFanAction(player, "comment")}
                    >
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-muted-foreground">{player.comments}</span>
                      <span className="text-xs text-blue-400">{formatMobiAmount(getFeeForAction("comment"))}</span>
                    </button>

                    <button
                      className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg active:bg-green-50 dark:active:bg-green-950/30 transition-colors touch-manipulation"
                      onClick={() => handleFanAction(player, "share")}
                    >
                      <Share2 className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-muted-foreground">{player.shares}</span>
                      <span className="text-xs text-green-400">{formatMobiAmount(getFeeForAction("share"))}</span>
                    </button>
                  </div>

                  {/* Inline comment input */}
                  {isCommenting && (
                    <div className="flex gap-2 pt-1">
                      <Input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={`Comment on ${player.name}...`}
                        className="h-9 text-sm"
                        onKeyDown={(e) => { if (e.key === "Enter") handleSubmitComment(player); }}
                        onTouchMove={(e) => e.stopPropagation()}
                      />
                      <Button
                        size="sm"
                        className="h-9 text-xs px-3 touch-manipulation"
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
        </div>
      </DrawerContent>
    </Drawer>
  );
}
