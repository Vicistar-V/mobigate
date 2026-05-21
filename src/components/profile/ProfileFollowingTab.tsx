import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  UserPlus, UserCheck, Eye, Users, Heart,
  MoreVertical, ThumbsUp, MessageCircle, Phone,
  Gift, Ban, Flag, UserMinus, Loader2,
} from "lucide-react";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { followingAdSlots } from "@/data/profileAds";
import { getRandomAdSlot } from "@/lib/adUtils";
import React from "react";
import { SendGiftDialog } from "@/components/chat/SendGiftDialog";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

interface FollowingUser {
  id: string; name: string; username: string; avatar: string | null;
  isOnline: boolean; isVerified: boolean; currentUserFollows: boolean;
  stats: { friends: number; likes: number; followers: number; following: number };
}

interface ProfileFollowingTabProps { userName: string; userId?: string; }

export const ProfileFollowingTab = ({ userName, userId }: ProfileFollowingTabProps) => {
  const { toast }   = useToast();
  const navigate    = useNavigate();
  const [users,     setUsers]     = useState<FollowingUser[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [giftOpen,  setGiftOpen]  = useState(false);
  const [giftUser,  setGiftUser]  = useState<{ id: string; name: string } | null>(null);

  const fetchFollowing = useCallback(async () => {
    setLoading(true);
    try {
      const url = userId ? `${API_BASE}/profile/following.php?user_id=${userId}` : `${API_BASE}/profile/following.php`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error();
      const data: FollowingUser[] = await res.json();
      setUsers(data);
      const init: Record<string, boolean> = {};
      data.forEach(u => { init[u.id] = u.currentUserFollows; });
      setFollowing(init);
    } catch { setUsers([]); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { fetchFollowing(); }, [fetchFollowing]);

  const handleToggleFollow = async (uid: string, name: string) => {
    const isNow = !following[uid];
    setFollowing(p => ({ ...p, [uid]: isNow }));
    try {
      await fetch(`${API_BASE}/friends/follow.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ following_id: uid }),
      });
      toast({ title: isNow ? "Following" : "Unfollowed", description: `${isNow ? "Now following" : "Unfollowed"} ${name}` });
    } catch { setFollowing(p => ({ ...p, [uid]: !isNow })); }
  };

  const handleBlock = async (uid: string, name: string) => {
    try {
      await fetch(`${API_BASE}/friends/block.php`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ blocked_id: uid }) });
      setUsers(p => p.filter(u => u.id !== uid));
      toast({ title: "Blocked", description: `You blocked ${name}`, variant: "destructive" });
    } catch {}
  };

  const handleChat = (uid: string, name: string) => window.dispatchEvent(new CustomEvent("openChatWithUser", { detail: { userId: uid, userName: name } }));

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4 pb-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold uppercase">{users.length} USER{users.length !== 1 ? "S" : ""} FOLLOWED BY {userName}</h2>
        <p className="text-sm text-destructive italic">Blocked users will not be displayed</p>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
          <UserPlus className="h-12 w-12 opacity-30" />
          <p className="text-sm font-medium">Not following anyone yet</p>
        </div>
      ) : (
        <Card className="divide-y">
          {users.map((user, index) => (
            <React.Fragment key={user.id}>
              <div className="p-4 flex gap-4 hover:bg-accent/5 transition-colors">
                <div className="relative flex-shrink-0">
                  <button onClick={() => navigate(`/profile/${user.id}`)}>
                    <Avatar className={`h-20 w-20 ring-2 ${user.isOnline ? "ring-emerald-500/50" : "ring-border"}`}>
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback>{user.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card ${user.isOnline ? "bg-emerald-500 animate-pulse" : "bg-destructive"}`} />
                  </button>
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <button onClick={() => navigate(`/profile/${user.id}`)} className="text-left hover:underline">
                    <h3 className="text-base font-bold">{user.name}</h3>
                  </button>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1.5 text-sm text-primary font-medium"><Users className="h-3.5 w-3.5" />{user.stats.friends.toLocaleString()} Friends</span>
                    <span className="flex items-center gap-1.5 text-sm text-primary font-medium"><Heart className="h-3.5 w-3.5" />{user.stats.likes.toLocaleString()} Likes</span>
                    <span className="flex items-center gap-1.5 text-sm text-primary/80 italic"><UserPlus className="h-3.5 w-3.5" />{user.stats.followers.toLocaleString()} Followers</span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleToggleFollow(user.id, user.name)}
                      className={following[user.id] ? "bg-success hover:bg-success/90 text-success-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"} size="sm">
                      {following[user.id] ? <><UserCheck className="h-4 w-4 mr-1" />Following</> : <><UserPlus className="h-4 w-4 mr-1" />Follow</>}
                    </Button>
                    <Button onClick={() => navigate(`/profile/${user.id}`)} className="bg-success hover:bg-success/90 text-success-foreground" size="sm">
                      <Eye className="h-4 w-4 mr-1" />View
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="outline" size="sm"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-card z-50">
                        <DropdownMenuItem onClick={() => handleToggleFollow(user.id, user.name)} className="cursor-pointer">
                          {following[user.id] ? <><UserMinus className="h-4 w-4 mr-2" />Unfollow</> : <><UserPlus className="h-4 w-4 mr-2" />Follow</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Liked" })} className="cursor-pointer"><ThumbsUp className="h-4 w-4 mr-2" />Like</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChat(user.id, user.name)} className="cursor-pointer"><MessageCircle className="h-4 w-4 mr-2" />Chat</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Calling" })} className="cursor-pointer"><Phone className="h-4 w-4 mr-2" />Call</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setGiftUser({ id: user.id, name: user.name }); setGiftOpen(true); }} className="cursor-pointer"><Gift className="h-4 w-4 mr-2" />Send Gift</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBlock(user.id, user.name)} className="cursor-pointer text-destructive focus:text-destructive"><Ban className="h-4 w-4 mr-2" />Block</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Report submitted", variant: "destructive" })} className="cursor-pointer text-destructive focus:text-destructive"><Flag className="h-4 w-4 mr-2" />Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              {(index + 1) % 4 === 0 && index < users.length - 1 && (
                <div className="p-4 bg-muted/30">
                  <PremiumAdRotation slotId={`following-premium-${Math.floor((index+1)/4)}`} ads={getRandomAdSlot(followingAdSlots)} context="feed" />
                </div>
              )}
            </React.Fragment>
          ))}
        </Card>
      )}
      <SendGiftDialog isOpen={giftOpen} onClose={() => { setGiftOpen(false); setGiftUser(null); }} recipientName={giftUser?.name || ""}
        onSendGift={() => { toast({ title: "Gift Sent!", description: `Gift sent to ${giftUser?.name}` }); setGiftOpen(false); setGiftUser(null); }} />
    </div>
  );
};
