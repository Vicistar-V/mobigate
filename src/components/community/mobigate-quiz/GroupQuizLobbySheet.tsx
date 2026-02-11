import { useState, useEffect } from "react";
import { Clock, Users, CheckCircle, XCircle, Zap, Trophy } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { GroupQuizFriend, getGroupPrizeMultiplier, GROUP_COUNTDOWN_SECONDS } from "@/data/mobigateGroupQuizData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { GroupQuizPlayDialog } from "./GroupQuizPlayDialog";

interface GroupQuizLobbySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stake: number;
  invitedFriends: GroupQuizFriend[];
}

export function GroupQuizLobbySheet({ open, onOpenChange, stake, invitedFriends }: GroupQuizLobbySheetProps) {
  const { toast } = useToast();
  const [countdown, setCountdown] = useState(GROUP_COUNTDOWN_SECONDS);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
  const [showPlay, setShowPlay] = useState(false);

  const totalPlayers = acceptedIds.length + 1; // +1 for host
  const multiplier = getGroupPrizeMultiplier(totalPlayers);
  const totalPrize = stake * multiplier;

  // Simulate friends accepting
  useEffect(() => {
    if (!open) {
      setCountdown(GROUP_COUNTDOWN_SECONDS);
      setIsCountingDown(false);
      setAcceptedIds([]);
      return;
    }
    const timers = invitedFriends.map((friend, i) => {
      const delay = 2000 + Math.random() * 5000;
      return setTimeout(() => {
        if (Math.random() > 0.2) {
          setAcceptedIds((prev) => [...prev, friend.id]);
        }
      }, delay);
    });
    return () => timers.forEach(clearTimeout);
  }, [open]);

  // Auto-start countdown when 3+ accepted
  useEffect(() => {
    if (acceptedIds.length >= 2 && !isCountingDown) {
      setIsCountingDown(true);
      toast({ title: "Countdown Started!", description: "Game starts in 60 seconds" });
    }
  }, [acceptedIds.length]);

  useEffect(() => {
    if (!isCountingDown || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setShowPlay(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCountingDown, countdown]);

  const handleStartNow = () => {
    if (totalPlayers < 3) {
      toast({ title: "Need 3+ Players", description: "Wait for more players to accept", variant: "destructive" });
      return;
    }
    setShowPlay(true);
  };

  return (
    <>
      <Drawer open={open && !showPlay} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="text-left pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" /> Group Quiz Lobby
            </DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-4 overflow-y-auto touch-auto">
            {/* Countdown */}
            {isCountingDown && (
              <Card className="border-purple-300 bg-purple-50 dark:bg-purple-950/30">
                <CardContent className="p-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-purple-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-xl font-bold tabular-nums">{countdown}s</span>
                  </div>
                  <Progress value={(countdown / GROUP_COUNTDOWN_SECONDS) * 100} className="h-1.5 mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">Game starting soon...</p>
                </CardContent>
              </Card>
            )}

            {/* Prize Info */}
            <Card className="border-purple-200">
              <CardContent className="p-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <p className="text-[10px] text-muted-foreground">Stake</p>
                    <p className="font-bold text-sm text-red-600">{formatMobiAmount(stake)}</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <p className="text-[10px] text-muted-foreground">Multiplier</p>
                    <p className="font-bold text-sm text-purple-600">{multiplier * 100}%</p>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="text-[10px] text-muted-foreground">Prize</p>
                    <p className="font-bold text-sm text-green-600">{formatMobiAmount(totalPrize)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Players */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Players ({totalPlayers})</p>
                <Badge variant="outline" className="text-[10px]">{totalPlayers}/10</Badge>
              </div>

              {/* Host (You) */}
              <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-purple-500 bg-purple-50 dark:bg-purple-950/30">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-purple-200 text-purple-700 text-xs">YO</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">You (Host)</p>
                  <p className="text-[10px] text-muted-foreground">Ready to play</p>
                </div>
                <Badge className="text-[10px] bg-purple-500 text-white border-0">Host</Badge>
              </div>

              {/* Invited Friends */}
              {invitedFriends.map((friend) => {
                const accepted = acceptedIds.includes(friend.id);
                return (
                  <div key={friend.id} className={`flex items-center gap-3 p-3 rounded-lg border ${accepted ? "border-green-300 bg-green-50 dark:bg-green-950/20" : "border-border"}`}>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">{friend.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{friend.name}</p>
                      <p className="text-[10px] text-muted-foreground">{accepted ? "Accepted" : "Waiting..."}</p>
                    </div>
                    {accepted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>

            <Button
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-violet-600 text-white"
              onClick={handleStartNow}
              disabled={totalPlayers < 3}
            >
              <Zap className="h-4 w-4 mr-2" />
              {totalPlayers < 3 ? `Waiting for players (${totalPlayers}/3)` : "Start Game Now!"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <GroupQuizPlayDialog
        open={showPlay}
        onOpenChange={(v) => {
          if (!v) {
            setShowPlay(false);
            onOpenChange(false);
          }
        }}
        stake={stake}
        playerCount={totalPlayers}
        players={[
          { id: "host", name: "You", avatar: "", isHost: true },
          ...invitedFriends.filter(f => acceptedIds.includes(f.id)).map(f => ({ id: f.id, name: f.name, avatar: f.avatar, isHost: false }))
        ]}
      />
    </>
  );
}
