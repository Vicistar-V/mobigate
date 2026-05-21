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
import { Eye, UserPlus, Users, Heart, MoreVertical, ThumbsUp, MessageCircle, Phone, Gift, Ban, Flag, UserMinus, Loader2 } from "lucide-react";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { likesAdSlots } from "@/data/profileAds";
import { getRandomAdSlot } from "@/lib/adUtils";
import React from "react";
import { SendGiftDialog } from "@/components/chat/SendGiftDialog";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

interface LikeUser {
  id: string; name: string; username: string; avatar: string | null;
  isOnline: boolean; likeCount: number;
  stats: { friends: number; likes: number; followers: number; following: number };
}

interface ProfileLikesTabProps { userName: string; userId?: string; }

export const ProfileLikesTab = ({ userName, userId }: ProfileLikesTabProps) => {
  const { toast }   = useToast();
  const navigate    = useNavigate();
  const [likers,    setLikers]    = useState<LikeUser[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [giftOpen,  setGiftOpen]  = useState(false);
  const [giftUser,  setGiftUser]  = useState<{ id: string; name: string } | null>(null);

  const fetchLikes = useCallback(async () => {
    setLoading(true);
    try {
      const url = userId ? `${API_BASE}/profile/likes.php?user_id=${userId}` : `${API_BASE}/profile/likes.php`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error();
      const data: LikeUser[] = await res.json();
      setLikers(data);
    } catch { setLikers([]); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { fetchLikes(); }, [fetchLikes]);

  const handleFollow = async (uid: string, name: string) => {
    const isNow = !following[uid];
    setFollowing(p => ({ ...p, [uid]: isNow }));
    try {
      await fetch(`${API_BASE}/friends/follow.php`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ following_id: uid }) });
      toast({ title: isNow ? "Following" : "Unfollowed" });
    } catch {}
  };

  const handleBlock = async (uid: string, name: string) => {
    try {
      await fetch(`${API_BASE}/friends/block.php`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ blocked_id: uid }) });
      setLikers(p => p.filter(u => u.id !== uid));
      toast({ title: "Blocked", variant: "destructive" });
    } catch {}
  };

  const handleChat = (uid: string, name: string) => window.dispatchEvent(new CustomEvent("openChatWithUser", { detail: { userId: uid, userName: name } }));

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4 pb-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold uppercase">LIKES RECEIVED BY {userName}</h2>
        <p className="text-sm text-destructive italic">Blocked users will not be displayed</p>
      </div>

      {likers.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
          <Heart className="h-12 w-12 opacity-30" />
          <p className="text-sm font-medium">No likes yet</p>
          <p className="text-xs text-center">When someone likes this profile, they'll appear here.</p>
        </div>
      ) : (
        <Card className="divide-y">
          {likers.map((liker, index) => (
            <React.Fragment key={liker.id}>
              <div className="p-4 flex gap-4 hover:bg-accent/5 transition-colors">
                <div className="relative flex-shrink-0">
                  <button onClick={() => navigate(`/profile/${liker.id}`)}>
                    <Avatar className={`h-20 w-20 ring-2 ${liker.isOnline ? "ring-emerald-500/50" : "ring-border"}`}>
                      <AvatarImage src={liker.avatar || undefined} />
                      <AvatarFallback>{liker.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card ${liker.isOnline ? "bg-emerald-500 animate-pulse" : "bg-destructive"}`} />
                  </button>
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <button onClick={() => navigate(`/profile/${liker.id}`)} className="text-left hover:underline">
                    <h3 className="text-base font-bold">{liker.name}</h3>
                  </button>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1.5 text-sm text-primary font-medium"><Users className="h-3.5 w-3.5" />{liker.stats.friends.toLocaleString()} Friends</span>
                    <span className="flex items-center gap-1.5 text-sm text-primary font-medium"><Heart className="h-3.5 w-3.5" />{liker.stats.likes.toLocaleString()} Likes</span>
                  </div>
                  <p className="text-sm text-foreground">
                    Has given {userName} <span className="font-semibold text-primary">{liker.likeCount} Like{liker.likeCount !== 1 ? "s" : ""}</span>
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => navigate(`/profile/${liker.id}`)} className="bg-success hover:bg-success/90 text-success-foreground" size="sm">
                      <Eye className="h-4 w-4 mr-1" />View Profile
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="outline" size="sm"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-card z-50">
                        <DropdownMenuItem onClick={() => handleFollow(liker.id, liker.name)} className="cursor-pointer">
                          {following[liker.id] ? <><UserMinus className="h-4 w-4 mr-2" />Unfollow</> : <><UserPlus className="h-4 w-4 mr-2" />Follow</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Liked" })} className="cursor-pointer"><ThumbsUp className="h-4 w-4 mr-2" />Like</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChat(liker.id, liker.name)} className="cursor-pointer"><MessageCircle className="h-4 w-4 mr-2" />Chat</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Calling" })} className="cursor-pointer"><Phone className="h-4 w-4 mr-2" />Call</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setGiftUser({ id: liker.id, name: liker.name }); setGiftOpen(true); }} className="cursor-pointer"><Gift className="h-4 w-4 mr-2" />Send Gift</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBlock(liker.id, liker.name)} className="cursor-pointer text-destructive focus:text-destructive"><Ban className="h-4 w-4 mr-2" />Block</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Report submitted", variant: "destructive" })} className="cursor-pointer text-destructive focus:text-destructive"><Flag className="h-4 w-4 mr-2" />Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              {(index + 1) % 4 === 0 && index < likers.length - 1 && (
                <div className="p-4 bg-muted/30">
                  <PremiumAdRotation slotId={`likes-premium-${Math.floor((index+1)/4)}`} ads={getRandomAdSlot(likesAdSlots)} context="feed" />
                </div>
              )}
            </React.Fragment>
          ))}
        </Card>
      )}
      <SendGiftDialog isOpen={giftOpen} onClose={() => { setGiftOpen(false); setGiftUser(null); }} recipientName={giftUser?.name || ""}
        onSendGift={() => { toast({ title: "Gift Sent!" }); setGiftOpen(false); setGiftUser(null); }} />
    </div>
  );
};
