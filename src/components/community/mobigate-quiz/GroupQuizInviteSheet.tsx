import { useState } from "react";
import { Search, Users, Check, X, Zap } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { mockFriendsList, GROUP_MIN_STAKE, GROUP_MIN_PLAYERS, GROUP_MAX_PLAYERS, GroupQuizFriend } from "@/data/mobigateGroupQuizData";
import { formatMobiAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { GroupQuizLobbySheet } from "./GroupQuizLobbySheet";

interface GroupQuizInviteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupQuizInviteSheet({ open, onOpenChange }: GroupQuizInviteSheetProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [stakeAmount, setStakeAmount] = useState(GROUP_MIN_STAKE.toString());
  const [showLobby, setShowLobby] = useState(false);

  const filtered = mockFriendsList.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFriend = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= GROUP_MAX_PLAYERS - 1) {
        toast({ title: "Maximum Reached", description: `Max ${GROUP_MAX_PLAYERS} players including you`, variant: "destructive" });
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleProceed = () => {
    const stake = parseInt(stakeAmount);
    if (selected.length < GROUP_MIN_PLAYERS - 1) {
      toast({ title: "Not Enough Players", description: `Invite at least ${GROUP_MIN_PLAYERS - 1} friends`, variant: "destructive" });
      return;
    }
    if (isNaN(stake) || stake < GROUP_MIN_STAKE) {
      toast({ title: "Invalid Stake", description: `Minimum stake is ${formatMobiAmount(GROUP_MIN_STAKE)}`, variant: "destructive" });
      return;
    }
    setShowLobby(true);
  };

  return (
    <>
      <Drawer open={open && !showLobby} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="text-left pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" /> Group Quiz - Invite Friends
            </DrawerTitle>
            <p className="text-sm text-muted-foreground">Select {GROUP_MIN_PLAYERS - 1}-{GROUP_MAX_PLAYERS - 1} friends to play with</p>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-3 flex-1 overflow-hidden flex flex-col">
            {/* Stake Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Stake Amount (Mobi)</label>
              <Input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder={`Min ${GROUP_MIN_STAKE}`}
                className="h-12 text-base touch-manipulation"
                inputMode="numeric"
                onPointerDown={(e) => e.stopPropagation()}
              />
              <p className="text-xs text-muted-foreground">Minimum: {formatMobiAmount(GROUP_MIN_STAKE)}</p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search friends..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-11 touch-manipulation"
                onPointerDown={(e) => e.stopPropagation()}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{selected.length} selected</p>
              <Badge variant="outline" className="text-xs">{selected.length + 1}/{GROUP_MAX_PLAYERS} players</Badge>
            </div>

            {/* Friends List */}
            <div className="flex-1 overflow-y-auto touch-auto overscroll-contain max-h-[40vh]">
              <div className="space-y-2 pr-2">
                {filtered.map((friend) => {
                  const isSelected = selected.includes(friend.id);
                  return (
                    <button
                      key={friend.id}
                      onClick={() => toggleFriend(friend.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all touch-manipulation ${
                        isSelected ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30" : "border-border hover:border-purple-300"
                      }`}
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs bg-purple-100 text-purple-700">{friend.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{friend.name}</p>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${friend.isOnline ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                          <span className="text-xs text-muted-foreground">{friend.winRate}% win rate</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? "bg-purple-500" : "border-2 border-muted"}`}>
                        {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-violet-600 text-white"
              onClick={handleProceed}
              disabled={selected.length < GROUP_MIN_PLAYERS - 1}
            >
              <Zap className="h-4 w-4 mr-2" />
              Create Lobby ({selected.length + 1} players)
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <GroupQuizLobbySheet
        open={showLobby}
        onOpenChange={(v) => {
          if (!v) {
            setShowLobby(false);
            onOpenChange(false);
          }
        }}
        stake={parseInt(stakeAmount) || GROUP_MIN_STAKE}
        invitedFriends={mockFriendsList.filter((f) => selected.includes(f.id))}
      />
    </>
  );
}
