import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  UserPlus, Eye, Users, Heart, Clock, Check,
  MoreVertical, UserMinus, ThumbsUp, ThumbsDown,
  Gift, MessageCircle, Phone, Ban, Flag, Search, Loader2,
} from "lucide-react";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { friendsAdSlots } from "@/data/profileAds";
import { getRandomAdSlot } from "@/lib/adUtils";
import React from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SendGiftDialog, GiftSelection } from "@/components/chat/SendGiftDialog";
import { AddFriendsDialog } from "@/components/community/AddFriendsDialog";
import { InviteMembersDialog } from "@/components/community/InviteMembersDialog";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

interface Friend {
  id: string;
  name: string;
  avatar: string | null;
  isOnline: boolean;
  status: "friends" | "pending" | "none";
  stats: { friends: number; likes: number; followers: number; following: number };
}

interface ProfileFriendsTabProps {
  userName: string;
  userId?: string;
}

export const ProfileFriendsTab = ({ userName, userId }: ProfileFriendsTabProps) => {
  const { toast }    = useToast();
  const navigate     = useNavigate();
  const [friends,    setFriends]    = useState<Friend[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [statuses,   setStatuses]   = useState<Record<string, "none"|"pending"|"friends">>({});
  const [interactions, setInteractions] = useState<Record<string, { isFollowing: boolean; isLiked: boolean }>>({});
  const [giftOpen,   setGiftOpen]   = useState(false);
  const [giftUser,   setGiftUser]   = useState<{ id: string; name: string } | null>(null);
  const [showAddFriends,    setShowAddFriends]    = useState(false);
  const [showInviteMembers, setShowInviteMembers] = useState(false);

  const fetchFriends = useCallback(async () => {
    setLoading(true);
    try {
      const url = userId
        ? `${API_BASE}/profile/friends.php?user_id=${userId}`
        : `${API_BASE}/profile/friends.php`;
      const res  = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error();
      const data: Friend[] = await res.json();
      setFriends(data);
      const initial: Record<string, "none"|"pending"|"friends"> = {};
      data.forEach(f => { initial[f.id] = f.status; });
      setStatuses(initial);
    } catch {
      setFriends([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchFriends(); }, [fetchFriends]);

  const handleAddFriend = async (friendId: string, friendName: string) => {
    setStatuses(p => ({ ...p, [friendId]: "pending" }));
    try {
      await fetch(`${API_BASE}/friends/add.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_id: friendId }),
      });
      toast({ title: "Friend Request Sent", description: `Request sent to ${friendName}` });
    } catch {
      setStatuses(p => ({ ...p, [friendId]: "none" }));
      toast({ title: "Error", description: "Could not send request.", variant: "destructive" });
    }
  };

  const handleToggleFollow = async (friendId: string, friendName: string) => {
    const isFollowing = interactions[friendId]?.isFollowing || false;
    setInteractions(p => ({ ...p, [friendId]: { ...p[friendId], isFollowing: !isFollowing } }));
    try {
      await fetch(`${API_BASE}/friends/follow.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ following_id: friendId }),
      });
      toast({ title: isFollowing ? "Unfollowed" : "Following", description: `${isFollowing ? "Unfollowed" : "Now following"} ${friendName}` });
    } catch {}
  };

  const handleBlock = async (friendId: string, friendName: string) => {
    try {
      await fetch(`${API_BASE}/friends/block.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked_id: friendId }),
      });
      setFriends(p => p.filter(f => f.id !== friendId));
      toast({ title: "Blocked", description: `You blocked ${friendName}`, variant: "destructive" });
    } catch {
      toast({ title: "Error", description: "Could not block.", variant: "destructive" });
    }
  };

  const handleChat = (friendId: string, friendName: string) => {
    window.dispatchEvent(new CustomEvent("openChatWithUser", { detail: { userId: friendId, userName: friendName } }));
  };

  const handleCall  = (_: string, n: string) => toast({ title: "Calling", description: `Initiating call with ${n}` });
  const handleReport = (_: string, n: string) => toast({ title: "Report submitted", description: `Report sent for ${n}`, variant: "destructive" });
  const handleToggleLike = (_: string, n: string) => toast({ title: "Liked", description: `You liked ${n}` });

  const getBtnConfig = (status: "none"|"pending"|"friends") => ({
    none:    { text: "Add Friend",    icon: UserPlus, cls: "bg-primary hover:bg-primary/90 text-primary-foreground", disabled: false },
    pending: { text: "Request Sent",  icon: Clock,    cls: "bg-yellow-500 text-white",                                disabled: true  },
    friends: { text: "Friends",       icon: Check,    cls: "bg-emerald-500 text-white",                               disabled: true  },
  }[status]);

  if (loading) return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-4 pb-6">
      <div className="flex gap-2">
        <Button onClick={() => setShowAddFriends(true)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 sm:py-5 shadow-md" size="lg">
          <Search className="h-4 w-4 sm:h-5 sm:w-5" /><span className="ml-2">Find Friend</span>
        </Button>
        <Button onClick={() => setShowInviteMembers(true)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 sm:py-5 shadow-md" size="lg">
          <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" /><span className="ml-2">Invite People</span>
        </Button>
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-bold uppercase">{friends.length} FRIENDS OF {userName}</h2>
        <p className="text-sm text-destructive italic">Blocked users will not be displayed</p>
      </div>

      {friends.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
          <Users className="h-12 w-12 opacity-30" />
          <p className="text-sm font-medium">No friends yet</p>
        </div>
      ) : (
        <Card className="divide-y">
          {friends.map((friend, index) => {
            const cfg  = getBtnConfig(statuses[friend.id] ?? friend.status);
            const Icon = cfg.icon;
            return (
              <React.Fragment key={friend.id}>
                <div className="p-4 space-y-3">
                  <div className="flex gap-4">
                    <div className="relative flex-shrink-0">
                      <button onClick={() => navigate(`/profile/${friend.id}`)}>
                        <Avatar className={`h-20 w-20 ring-2 ${friend.isOnline ? "ring-emerald-500/50" : "ring-border"}`}>
                          <AvatarImage src={friend.avatar || undefined} />
                          <AvatarFallback>{friend.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card ${friend.isOnline ? "bg-emerald-500" : "bg-destructive"}`} />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <button onClick={() => navigate(`/profile/${friend.id}`)} className="text-left hover:underline">
                        <h3 className="text-base font-bold uppercase">{friend.name}</h3>
                      </button>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1.5 text-sm text-primary font-medium"><Users className="h-3.5 w-3.5" />{friend.stats.friends.toLocaleString()} Friends</span>
                        <span className="flex items-center gap-1.5 text-sm text-primary font-medium"><Heart className="h-3.5 w-3.5" />{friend.stats.likes.toLocaleString()} Likes</span>
                        <span className="flex items-center gap-1.5 text-sm text-primary/80 italic"><UserPlus className="h-3.5 w-3.5" />{friend.stats.followers.toLocaleString()} Followers</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => !cfg.disabled && handleAddFriend(friend.id, friend.name)} disabled={cfg.disabled} className={`${cfg.cls} flex-1`} size="sm">
                      <Icon className="h-4 w-4 mr-1" />{cfg.text}
                    </Button>
                    <Button onClick={() => navigate(`/profile/${friend.id}`)} className="bg-success hover:bg-success/90 text-success-foreground flex-1" size="sm">
                      <Eye className="h-4 w-4 mr-1" />View Profile
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-card z-50">
                        <DropdownMenuItem onClick={() => handleToggleFollow(friend.id, friend.name)} className="cursor-pointer">
                          {interactions[friend.id]?.isFollowing ? <><UserMinus className="h-4 w-4 mr-2" />Unfollow</> : <><UserPlus className="h-4 w-4 mr-2" />Follow</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleLike(friend.id, friend.name)} className="cursor-pointer">
                          <ThumbsUp className="h-4 w-4 mr-2" />Like
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChat(friend.id, friend.name)} className="cursor-pointer">
                          <MessageCircle className="h-4 w-4 mr-2" />Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCall(friend.id, friend.name)} className="cursor-pointer">
                          <Phone className="h-4 w-4 mr-2" />Call
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setGiftUser({ id: friend.id, name: friend.name }); setGiftOpen(true); }} className="cursor-pointer">
                          <Gift className="h-4 w-4 mr-2" />Send Gift
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBlock(friend.id, friend.name)} className="cursor-pointer text-destructive focus:text-destructive">
                          <Ban className="h-4 w-4 mr-2" />Block
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReport(friend.id, friend.name)} className="cursor-pointer text-destructive focus:text-destructive">
                          <Flag className="h-4 w-4 mr-2" />Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {(index + 1) % 4 === 0 && index < friends.length - 1 && (
                  <div className="p-4 bg-muted/30">
                    <PremiumAdRotation slotId={`friends-premium-${Math.floor((index+1)/4)}`} ads={getRandomAdSlot(friendsAdSlots)} context="feed" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </Card>
      )}

      <SendGiftDialog isOpen={giftOpen} onClose={() => { setGiftOpen(false); setGiftUser(null); }} recipientName={giftUser?.name || ""} onSendGift={() => { toast({ title: "Gift Sent!", description: `Gift sent to ${giftUser?.name}` }); setGiftOpen(false); setGiftUser(null); }} />
      <AddFriendsDialog open={showAddFriends} onOpenChange={setShowAddFriends} />
      <InviteMembersDialog open={showInviteMembers} onOpenChange={setShowInviteMembers} />
    </div>
  );
};
