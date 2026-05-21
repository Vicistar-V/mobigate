/**
 * FriendRequestsTab.tsx
 * Shows received and sent friend requests for the logged-in user.
 * Allows accepting, declining (received) and cancelling (sent).
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  UserCheck, UserX, Clock, Users,
  UserPlus, Loader2, RefreshCw,
} from "lucide-react";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

interface FriendRequest {
  id:         string;   // friendship id
  user_id:    string;   // the other user's ID
  name:       string;
  username:   string;
  avatar:     string | null;
  is_online:  boolean;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export const FriendRequestsTab = () => {
  const { toast }    = useToast();
  const navigate     = useNavigate();
  const [received,   setReceived]   = useState<FriendRequest[]>([]);
  const [sent,       setSent]       = useState<FriendRequest[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [acting,     setActing]     = useState<Record<string, boolean>>({});

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/friends/requests.php`, { credentials: "include" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReceived(data.received || []);
      setSent(data.sent || []);
    } catch {
      setReceived([]); setSent([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleAccept = async (req: FriendRequest) => {
    setActing(a => ({ ...a, [req.id]: true }));
    try {
      const res  = await fetch(`${API_BASE}/friends/respond.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendship_id: req.id, action: "accept" }),
      });
      const data = await res.json();
      if (data.success) {
        setReceived(p => p.filter(r => r.id !== req.id));
        toast({ title: "Friend request accepted!", description: `You and ${req.name} are now friends.` });
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Cannot reach server.", variant: "destructive" });
    } finally {
      setActing(a => ({ ...a, [req.id]: false }));
    }
  };

  const handleDecline = async (req: FriendRequest) => {
    setActing(a => ({ ...a, [req.id]: true }));
    try {
      const res  = await fetch(`${API_BASE}/friends/respond.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendship_id: req.id, action: "decline" }),
      });
      const data = await res.json();
      if (data.success) {
        setReceived(p => p.filter(r => r.id !== req.id));
        toast({ title: "Request declined", variant: "destructive" });
      }
    } catch {} finally {
      setActing(a => ({ ...a, [req.id]: false }));
    }
  };

  const handleCancel = async (req: FriendRequest) => {
    setActing(a => ({ ...a, [req.id]: true }));
    try {
      const res  = await fetch(`${API_BASE}/friends/respond.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendship_id: req.id, action: "cancel" }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(p => p.filter(r => r.id !== req.id));
        toast({ title: "Request cancelled" });
      }
    } catch {} finally {
      setActing(a => ({ ...a, [req.id]: false }));
    }
  };

  const RequestCard = ({ req, type }: { req: FriendRequest; type: "received" | "sent" }) => (
    <div className="flex items-center gap-4 p-4 hover:bg-accent/5 transition-colors border-b last:border-b-0">
      <div className="relative flex-shrink-0 cursor-pointer" onClick={() => navigate(`/profile/${req.user_id}`)}>
        <Avatar className={`h-16 w-16 ring-2 ${req.is_online ? "ring-emerald-500/50" : "ring-border"}`}>
          <AvatarImage src={req.avatar || undefined} />
          <AvatarFallback>{req.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card ${req.is_online ? "bg-emerald-500" : "bg-muted"}`} />
      </div>

      <div className="flex-1 min-w-0">
        <button onClick={() => navigate(`/profile/${req.user_id}`)} className="text-left hover:underline">
          <p className="font-semibold text-base">{req.name}</p>
          <p className="text-sm text-muted-foreground">@{req.username}</p>
        </button>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
          <Clock className="h-3 w-3" />
          {type === "received" ? "Sent you a request" : "Request sent"} · {timeAgo(req.created_at)}
        </p>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        {type === "received" ? (
          <>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
              onClick={() => handleAccept(req)}
              disabled={acting[req.id]}
            >
              {acting[req.id]
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <><UserCheck className="h-4 w-4 mr-1" />Accept</>
              }
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDecline(req)}
              disabled={acting[req.id]}
            >
              <UserX className="h-4 w-4 mr-1" />Decline
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCancel(req)}
            disabled={acting[req.id]}
          >
            {acting[req.id]
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <><UserX className="h-4 w-4 mr-1" />Cancel</>
            }
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold uppercase">Friend Requests</h2>
        <Button variant="ghost" size="sm" onClick={fetchRequests} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="received">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="received">
            <UserPlus className="h-4 w-4 mr-1.5" />
            Received
            {received.length > 0 && (
              <span className="ml-1.5 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 font-bold">
                {received.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">
            <Clock className="h-4 w-4 mr-1.5" />
            Sent ({sent.length})
          </TabsTrigger>
        </TabsList>

        {/* Received requests */}
        <TabsContent value="received">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : received.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
              <UserCheck className="h-12 w-12 opacity-30" />
              <p className="text-sm font-medium">No pending friend requests</p>
              <p className="text-xs text-center">When someone sends you a friend request, it will appear here.</p>
            </div>
          ) : (
            <Card className="divide-y mt-4">
              {received.map(req => <RequestCard key={req.id} req={req} type="received" />)}
            </Card>
          )}
        </TabsContent>

        {/* Sent requests */}
        <TabsContent value="sent">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : sent.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
              <Users className="h-12 w-12 opacity-30" />
              <p className="text-sm font-medium">No sent requests</p>
              <p className="text-xs text-center">Friend requests you've sent will appear here.</p>
            </div>
          ) : (
            <Card className="divide-y mt-4">
              {sent.map(req => <RequestCard key={req.id} req={req} type="sent" />)}
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
