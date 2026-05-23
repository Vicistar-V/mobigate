import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetDescription,
  SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Bell, Check, UserPlus, Heart, MessageSquare, Gift, Eye, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

interface Notification {
  id:          string;
  type:        string;
  title:       string;
  body:        string;
  entity_id:   string | null;
  entity_type: string | null;
  is_read:     boolean;
  actor_name:  string | null;
  actor_photo: string | null;
  created_at:  string;
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)     return "just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const typeIcon: Record<string, React.ReactNode> = {
  friend_request: <UserPlus     className="h-3 w-3" />,
  friend_accept:  <Users        className="h-3 w-3" />,
  post_like:      <Heart        className="h-3 w-3" />,
  profile_like:   <Heart        className="h-3 w-3" />,
  comment:        <MessageSquare className="h-3 w-3" />,
  gift:           <Gift         className="h-3 w-3" />,
  follow:         <Eye          className="h-3 w-3" />,
};

const typeColor: Record<string, string> = {
  friend_request: "bg-blue-100 text-blue-600",
  friend_accept:  "bg-green-100 text-green-600",
  post_like:      "bg-red-100 text-red-600",
  profile_like:   "bg-pink-100 text-pink-600",
  comment:        "bg-teal-100 text-teal-600",
  gift:           "bg-amber-100 text-amber-600",
  follow:         "bg-purple-100 text-purple-600",
};

export const NotificationsSheet = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res  = await fetch(`${API_BASE}/notifications/list.php?limit=30`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      // Handle plain array (original format) or object with notifications key
      const list = Array.isArray(data) ? data : (Array.isArray(data?.notifications) ? data.notifications : []);
      setNotifications(list);
    } catch {}
  }, []);

  // Fetch on mount and every 30s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Fetch when sheet opens
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  const markRead = async (id: string) => {
    try {
      await fetch(`${API_BASE}/notifications/list.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read", id }),
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await fetch(`${API_BASE}/notifications/list.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read" }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {}
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="iconLg" className="relative hover:bg-primary/10">
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-sm font-bold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:w-[440px] p-0">
        <div className="px-6 py-5 border-b">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>Notifications</SheetTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllRead}
                  className="text-xs text-primary hover:text-primary gap-1">
                  <Check className="h-3 w-3" />Mark all read
                </Button>
              )}
            </div>
            <SheetDescription>
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "You're all caught up!"}
            </SheetDescription>
          </SheetHeader>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <Bell className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="font-semibold text-muted-foreground">No notifications yet</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                We'll notify you when something happens
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && markRead(n.id)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors",
                    n.is_read
                      ? "hover:bg-accent"
                      : "bg-primary/5 hover:bg-primary/10 border-l-4 border-primary pl-3"
                  )}
                >
                  {/* Avatar with type icon badge */}
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={n.actor_photo || undefined} />
                      <AvatarFallback>
                        {(n.actor_name || "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {typeIcon[n.type] && (
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-background",
                        typeColor[n.type] || "bg-gray-100 text-gray-600"
                      )}>
                        {typeIcon[n.type]}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">
                      <span className={n.is_read ? "font-semibold" : "font-bold"}>
                        {n.actor_name || "Someone"}
                      </span>{" "}
                      <span className="text-muted-foreground">{n.title}</span>
                    </p>
                    {n.body && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {n.body}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {timeAgo(n.created_at)}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!n.is_read && (
                    <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
