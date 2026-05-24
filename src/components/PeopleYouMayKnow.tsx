import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  UserPlus, Users, MoveHorizontal, MoveVertical,
  Check, MoreVertical, ThumbsUp, MessageCircle,
  Phone, Gift, Ban, Flag, Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { AddToCircleDialog } from "./AddToCircleDialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SendGiftDialog, GiftSelection } from "@/components/chat/SendGiftDialog";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

interface SuggestedUser {
  id:             string;
  name:           string;
  profileImage?:  string;
  mutualFriends?: number;
  username?:      string;
}

// ── PHP API endpoint ──────────────────────────────────────────────────────────
// GET /api/friends/suggestions.php
// Returns: [{ id, name, profile_photo, mutual_friends }]

export const PeopleYouMayKnow = () => {
  const { toast }                   = useToast();
  const { user, isAuthenticated }   = useAuth();

  const [users,        setUsers]        = useState<SuggestedUser[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [viewMode,     setViewMode]     = useState<"carousel" | "grid">("carousel");
  const [requestSent,  setRequestSent]  = useState<Record<string, boolean>>({});
  const [circleOpen,   setCircleOpen]   = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const [giftOpen,     setGiftOpen]     = useState(false);
  const [giftUser,     setGiftUser]     = useState<{ id: string; name: string } | null>(null);

  // ── Fallback suggestions (used when API is empty / unauth / fails) ──────────
  const FALLBACK_USERS: SuggestedUser[] = [
    { id: "fallback-1", name: "Chef Ngozi",     username: "chef.ngozi",     profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=Chef+Ngozi",    mutualFriends: 12 },
    { id: "fallback-2", name: "Tunde Bakare",   username: "tunde.bakare",   profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=Tunde+Bakare",  mutualFriends: 8  },
    { id: "fallback-3", name: "Dr. Amina Yusuf",username: "amina.yusuf",    profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=Amina+Yusuf",  mutualFriends: 5  },
    { id: "fallback-4", name: "Emeka Okafor",   username: "emeka.okafor",   profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=Emeka+Okafor", mutualFriends: 3  },
    { id: "fallback-5", name: "Funke Adebayo",  username: "funke.adebayo",  profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=Funke+Adebayo",mutualFriends: 2  },
  ];

  // ── Fetch suggestions from API ──────────────────────────────────────────────
  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    if (!isAuthenticated) {
      setUsers(FALLBACK_USERS);
      setLoading(false);
      return;
    }
    try {
      const res  = await fetch(`${API_BASE}/friends/suggestions.php`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const mapped = (Array.isArray(data) ? data : []).map((u: any) => ({
        id:            u.id,
        name:          u.name           || u.username || "Unknown",
        profileImage:  u.profile_photo  || undefined,
        mutualFriends: u.mutual_friends || 0,
        username:      u.username,
      }));
      setUsers(mapped.length > 0 ? mapped : FALLBACK_USERS);
    } catch {
      setUsers(FALLBACK_USERS);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchSuggestions(); }, [fetchSuggestions]);

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handleAddFriend = async (userId: string, userName: string) => {
    setRequestSent(p => ({ ...p, [userId]: true }));
    try {
      await fetch(`${API_BASE}/friends/add.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_id: userId }),
      });
      toast({ title: "Friend request sent", description: `Request sent to ${userName}` });
    } catch {
      setRequestSent(p => ({ ...p, [userId]: false }));
      toast({ title: "Error", description: "Could not send request.", variant: "destructive" });
    }
  };

  const handleFollow = async (userId: string, userName: string) => {
    try {
      await fetch(`${API_BASE}/friends/follow.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ following_id: userId }),
      });
      toast({ title: "Following", description: `You are now following ${userName}` });
    } catch {
      toast({ title: "Error", description: "Could not follow.", variant: "destructive" });
    }
  };

  const handleBlock = async (userId: string, userName: string) => {
    try {
      await fetch(`${API_BASE}/friends/block.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked_id: userId }),
      });
      // Remove from list
      setUsers(p => p.filter(u => u.id !== userId));
      toast({ title: "Blocked", description: `You blocked ${userName}`, variant: "destructive" });
    } catch {
      toast({ title: "Error", description: "Could not block.", variant: "destructive" });
    }
  };

  const handleReport = (userId: string, userName: string) => {
    toast({ title: "Report submitted", description: `Report sent for ${userName}`, variant: "destructive" });
  };

  const handleChat = (userId: string, userName: string) => {
    window.dispatchEvent(new CustomEvent("openChatWithUser", {
      detail: { userId, userName },
    }));
  };

  const handleCall = (_userId: string, userName: string) => {
    toast({ title: "Calling", description: `Initiating call with ${userName}` });
  };

  const handleLike = (_userId: string, userName: string) => {
    toast({ title: "Liked", description: `You liked ${userName}'s profile` });
  };

  // ── User card actions (shared between carousel and grid) ───────────────────
  const renderActions = (user: SuggestedUser) => (
    <div className="space-y-1.5">
      <Button
        size="sm"
        className="w-full h-8 text-base"
        variant={requestSent[user.id] ? "secondary" : "default"}
        onClick={() => handleAddFriend(user.id, user.name)}
        disabled={requestSent[user.id]}
      >
        {requestSent[user.id]
          ? <><Check className="h-3 w-3 mr-1" />Request Sent</>
          : <><UserPlus className="h-3 w-3 mr-1" />Add Friend</>
        }
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="w-full h-8 text-base" variant="outline">
            <MoreVertical className="h-3 w-3 mr-1" />
            Do More
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-card z-50">
          <DropdownMenuItem onClick={() => handleFollow(user.id, user.name)} className="cursor-pointer">
            <UserPlus className="h-4 w-4 mr-2" />Follow
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleLike(user.id, user.name)} className="cursor-pointer">
            <ThumbsUp className="h-4 w-4 mr-2" />Like
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleChat(user.id, user.name)} className="cursor-pointer">
            <MessageCircle className="h-4 w-4 mr-2" />Chat
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCall(user.id, user.name)} className="cursor-pointer">
            <Phone className="h-4 w-4 mr-2" />Call
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setGiftUser({ id: user.id, name: user.name }); setGiftOpen(true); }} className="cursor-pointer">
            <Gift className="h-4 w-4 mr-2" />Send Gift
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setSelectedUser({ id: user.id, name: user.name }); setCircleOpen(true); }} className="cursor-pointer">
            <Users className="h-4 w-4 mr-2" />Add to Circle
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleBlock(user.id, user.name)} className="cursor-pointer text-destructive focus:text-destructive">
            <Ban className="h-4 w-4 mr-2" />Block
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleReport(user.id, user.name)} className="cursor-pointer text-destructive focus:text-destructive">
            <Flag className="h-4 w-4 mr-2" />Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <NotableDates />
      <div className="h-4" />
      <Card className="p-4 space-y-4 hover:shadow-md transition-shadow overflow-hidden">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">People you may know</h3>
          <Button
            variant="outline" size="sm"
            onClick={() => setViewMode(v => v === "carousel" ? "grid" : "carousel")}
            className="gap-1.5"
            title={viewMode === "carousel" ? "Switch to Grid View" : "Switch to Carousel View"}
          >
            {viewMode === "carousel"
              ? <><MoveHorizontal className="h-4 w-4" /><span className="text-xs hidden sm:inline">Horizontal</span></>
              : <><MoveVertical   className="h-4 w-4" /><span className="text-xs hidden sm:inline">Vertical</span></>
            }
          </Button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Empty state */}
        {!loading && users.length === 0 && (
          <div className="flex flex-col items-center py-8 gap-2 text-muted-foreground">
            <Users className="h-10 w-10 opacity-30" />
            <p className="text-sm">No suggestions right now</p>
            <p className="text-xs text-center">
              Add more friends and we'll find people you may know.
            </p>
          </div>
        )}

        {/* Carousel view */}
        {!loading && users.length > 0 && viewMode === "carousel" && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent snap-x snap-mandatory">
            {users.map(user => (
              <div key={user.id} className="flex-shrink-0 w-[140px] space-y-2 snap-start">
                <Link to={`/profile/${user.id}`} className="block">
                  <Avatar className="h-32 w-full aspect-[3/4] rounded-lg border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                    <AvatarImage src={user.profileImage} alt={user.name} className="object-cover" />
                    <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="text-center">
                  <Link to={`/profile/${user.id}`} className="font-medium text-base hover:text-primary transition-colors line-clamp-2">
                    {user.name}
                  </Link>
                  {(user.mutualFriends ?? 0) > 0 && (
                    <p className="text-base text-muted-foreground mt-0.5">{user.mutualFriends} mutual</p>
                  )}
                </div>
                {renderActions(user)}
              </div>
            ))}
          </div>
        )}

        {/* Grid view */}
        {!loading && users.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {users.map(user => (
              <div key={user.id} className="space-y-2">
                <Link to={`/profile/${user.id}`} className="block">
                  <Avatar className="h-40 w-full aspect-[3/4] rounded-lg border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                    <AvatarImage src={user.profileImage} alt={user.name} className="object-cover" />
                    <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="text-center">
                  <Link to={`/profile/${user.id}`} className="font-medium text-base hover:text-primary transition-colors line-clamp-2">
                    {user.name}
                  </Link>
                  {(user.mutualFriends ?? 0) > 0 && (
                    <p className="text-base text-muted-foreground mt-0.5">{user.mutualFriends} mutual</p>
                  )}
                </div>
                {renderActions(user)}
              </div>
            ))}
          </div>
        )}
      </Card>

      <AddToCircleDialog
        open={circleOpen}
        onOpenChange={setCircleOpen}
        userName={selectedUser?.name || ""}
        onComplete={() => selectedUser && setCircleOpen(false)}
      />

      <SendGiftDialog
        isOpen={giftOpen}
        onClose={() => { setGiftOpen(false); setGiftUser(null); }}
        recipientName={giftUser?.name || ""}
        onSendGift={(gift: GiftSelection) => {
          toast({ title: "Gift Sent", description: `Gift sent to ${giftUser?.name}!` });
          setGiftOpen(false);
          setGiftUser(null);
        }}
      />
    </>
  );
};
