import { useState, useEffect } from "react";
import { Search, Users, Check, Zap, Loader2 } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { GROUP_MIN_STAKE, GROUP_MIN_PLAYERS, GROUP_MAX_PLAYERS } from "@/data/mobifaceGroupQuizData";
import { formatMobiAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { GroupQuizLobbySheet } from "./GroupQuizLobbySheet";

const API = "/api/quiz/group.php";

interface Friend { friendship_id: string; friend_id: string; name: string; avatar?: string }

interface GroupQuizInviteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId?: string;
}

export function GroupQuizInviteSheet({ open, onOpenChange, communityId }: GroupQuizInviteSheetProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [stakeAmount, setStakeAmount] = useState(GROUP_MIN_STAKE.toString());
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`${API}?action=friends`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setFriends(d.friends ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  const filtered = friends.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

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

  const handleProceed = async () => {
    const stake = parseInt(stakeAmount);
    if (selected.length < GROUP_MIN_PLAYERS - 1) {
      toast({ title: "Not Enough Players", description: `Invite at least ${GROUP_MIN_PLAYERS - 1} friends`, variant: "destructive" });
      return;
    }
    if (isNaN(stake) || stake < GROUP_MIN_STAKE) {
      toast({ title: "Invalid Stake", description: `Minimum stake is ${formatMobiAmount(GROUP_MIN_STAKE)}`, variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_lobby", stake, friend_ids: selected, community_id: communityId }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Couldn't create lobby");
      setLobbyId(d.lobby_id);
    } catch (e: any) {
      toast({ title: "Couldn't Create Lobby", description: e.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Drawer open={open && !lobbyId} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="text-left pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" /> Group Quiz - Invite Friends
            </DrawerTitle>
            <p className="text-sm text-muted-foreground">Select {GROUP_MIN_PLAYERS - 1}-{GROUP_MAX_PLAYERS - 1} friends to play with</p>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-3 flex-1 overflow-hidden flex flex-col">
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

            <div className="flex-1 overflow-y-auto touch-auto overscroll-contain max-h-[40vh]">
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-purple-500" /></div>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {friends.length === 0 ? "You don't have any friends to invite yet." : "No friends match your search."}
                </p>
              ) : (
                <div className="space-y-2 pr-2">
                  {filtered.map((friend) => {
                    const isSelected = selected.includes(friend.friend_id);
                    return (
                      <button
                        key={friend.friend_id}
                        onClick={() => toggleFriend(friend.friend_id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all touch-manipulation ${
                          isSelected ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30" : "border-border hover:border-purple-300"
                        }`}
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs bg-purple-100 text-purple-700">{(friend.name || "?").substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">{friend.name}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? "bg-purple-500" : "border-2 border-muted"}`}>
                          {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Button
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-violet-600 text-white"
              onClick={handleProceed}
              disabled={selected.length < GROUP_MIN_PLAYERS - 1 || creating}
            >
              {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
              Create Lobby ({selected.length + 1} players)
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {lobbyId && (
        <GroupQuizLobbySheet
          open={!!lobbyId}
          onOpenChange={(v) => {
            if (!v) {
              setLobbyId(null);
              setSelected([]);
              onOpenChange(false);
            }
          }}
          lobbyId={lobbyId}
        />
      )}
    </>
  );
}
