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
  Eye, UserPlus, UserCheck, Users, Heart,
  MoreVertical, ThumbsUp, MessageCircle, Phone,
  Gift, Ban, Flag, UserMinus, Loader2,
} from "lucide-react";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { followersAdSlots } from "@/data/profileAds";
import { getRandomAdSlot } from "@/lib/adUtils";
import React from "react";
import { SendGiftDialog } from "@/components/chat/SendGiftDialog";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

interface Follower {
  id: string;
  name: string;
  avatar: string | null;
  isOnline: boolean;
  isFollowingBack: boolean;
  hasInsufficientFunds: boolean;
  stats: { friends: number; likes: number; followers: number; following: number };
}

interface ProfileFollowersTabProps {
  userName: string;
  userId?: string;
}

export const ProfileFollowersTab = ({ userName, userId }: ProfileFollowersTabProps) => {
  const { toast }    = useToast();
  const navigate     = useNavigate();
  const [followers,  setFollowers]  = useState<Follower[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [following,  setFollowing]  = useState<Record<string, boolean>>({});
  const [giftOpen,   setGiftOpen]   = useState(false);
  const [giftUser,   setGiftUser]   = useState<{ id: string; name: string } | null>(null);

  const fetchFollowers = useCallback(async () => {
    setLoading(true);
    try {
      const url = userId
        ? `${API_BASE}/profile/followers.php?user_id=${userId}`
        : `${API_BASE}/profile/followers.php`;
      const res  = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error();
      const data: Follower[] = await res.json();
      setFollowers(data);
      const init: Record<string, boolean> = {};
      data.forEach(f => { init[f.id] = f.isFollowingBack; });
      setFollowing(init);
    } catch {
      setFollowers([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchFollowers(); }, [fetchFollowers]);

  const handleFollowBack = async (fId: string, fName: string) => {
    const isNow = !following[fId];
    setFollowing(p => ({ ...p, [fId]: isNow }));
    try {
      await fetch(`${API_BASE}/friends/follow.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ following_id: fId }),
      });
      toast({ title: isNow ? "Following" : "Unfollowed", description: `${isNow ? "Now following" : "Unfollowed"} ${fName}` });
    } catch {
      setFollowing(p => ({ ...p, [fId]: !isNow }));
    }
  };

  const handleBlock = async (fId: string, fName: string) => {
    try {
      await fetch(`${API_BASE}/friends/block.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked_id: fId }),
      });
      setFollowers(p => p.filter(f => f.id !== fId));
      toast({ title: "Blocked", description: `You blocked ${fName}`, variant: "destructive" });
    } catch {}
  };

  const handleChat = (fId: string, fName: string) => {
    window.dispatchEvent(new CustomEvent("openChatWithUser", { detail: { userId: fId, userName: fName } }));
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4 pb-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold uppercase">{followers.length} FOLLOWER{followers.length !== 1 ? "S" : ""} OF {userName}</h2>
        <p className="text-sm text-destructive italic">Blocked users will not be displayed</p>
      </div>

      {followers.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
          <UserPlus className="h-12 w-12 opacity-30" />
          <p className="text-sm font-medium">No followers yet</p>
        </div>
      ) : (
        <Card className="divide-y">
          {followers.map((follower, index) => (
            <React.Fragment key={follower.id}>
              <div className="p-4 flex gap-4 hover:bg-accent/5 transition-colors">
                <div className="relative flex-shrink-0">
                  <button onClick={() => navigate(`/profile/${follower.id}`)}>
                    <Avatar className={`h-20 w-20 ring-2 ${follower.isOnline ? "ring-emerald-500/50" : "ring-border"}`}>
                      <AvatarImage src={follower.avatar || undefined} />
                      <AvatarFallback>{follower.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card ${follower.isOnline ? "bg-emerald-500 animate-pulse" : "bg-destructive"}`} />
                  </button>
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <button onClick={() => navigate(`/profile/${follower.id}`)} className="text-left hover:underline">
                    <h3 className="text-base font-bold">{follower.name}</h3>
                  </button>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1.5 text-sm text-primary font-medium"><Users className="h-3.5 w-3.5" />{follower.stats.friends.toLocaleString()} Friends</span>
                    <span className="flex items-center gap-1.5 text-sm text-primary font-medium"><Heart className="h-3.5 w-3.5" />{follower.stats.likes.toLocaleString()} Likes</span>
                    <span className="flex items-center gap-1.5 text-sm text-primary/80 italic"><UserPlus className="h-3.5 w-3.5" />{follower.stats.followers.toLocaleString()} Followers</span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleFollowBack(follower.id, follower.name)} disabled={follower.hasInsufficientFunds}
                      className={`${following[follower.id] ? "bg-success hover:bg-success/90 text-success-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`} size="sm">
                      {following[follower.id] ? <><UserCheck className="h-4 w-4 mr-1" />Following</> : <><UserPlus className="h-4 w-4 mr-1" />Follow Back</>}
                    </Button>
                    <Button onClick={() => navigate(`/profile/${follower.id}`)} className="bg-success hover:bg-success/90 text-success-foreground" size="sm">
                      <Eye className="h-4 w-4 mr-1" />View
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-card z-50">
                        <DropdownMenuItem onClick={() => handleFollowBack(follower.id, follower.name)} className="cursor-pointer" disabled={follower.hasInsufficientFunds}>
                          {following[follower.id] ? <><UserMinus className="h-4 w-4 mr-2" />Unfollow</> : <><UserPlus className="h-4 w-4 mr-2" />Follow</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChat(follower.id, follower.name)} className="cursor-pointer"><MessageCircle className="h-4 w-4 mr-2" />Chat</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Calling" })} className="cursor-pointer"><Phone className="h-4 w-4 mr-2" />Call</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setGiftUser({ id: follower.id, name: follower.name }); setGiftOpen(true); }} className="cursor-pointer"><Gift className="h-4 w-4 mr-2" />Send Gift</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBlock(follower.id, follower.name)} className="cursor-pointer text-destructive focus:text-destructive"><Ban className="h-4 w-4 mr-2" />Block</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Report submitted", variant: "destructive" })} className="cursor-pointer text-destructive focus:text-destructive"><Flag className="h-4 w-4 mr-2" />Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              {(index + 1) % 4 === 0 && index < followers.length - 1 && (
                <div className="p-4 bg-muted/30">
                  <PremiumAdRotation slotId={`followers-premium-${Math.floor((index+1)/4)}`} ads={getRandomAdSlot(followersAdSlots)} context="feed" />
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
