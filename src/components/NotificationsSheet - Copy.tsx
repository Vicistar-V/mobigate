/**
 * NotificationsSheet.tsx — API-powered notifications
 * Fetches from: GET /api/notifications/list.php
 * Falls back to empty state if API is unavailable.
 */

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell, Loader2, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/useAuth";

const API_BASE =
  (import.meta.env.VITE_API_URL as string) ||
  "https://angola-press.com/en/api";

interface ApiNotification {
  id: string;
  type: string;
  title: string | null;
  body: string;
  entity_id: string | null;
  entity_type: string | null;
  is_read: boolean;
  created_at: string;
  actor_name: string | null;
  actor_photo: string | null;
}

// Format relative time
function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)   return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;
}

export const NotificationsSheet = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen]             = useState(false);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${API_BASE}/notifications/list.php`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data: ApiNotification[] = await res.json();
      setNotifications(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch on open
  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen, fetchNotifications]);

  // Mark a notification as read
  const markRead = async (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    try {
      await fetch(`${API_BASE}/notifications/mark_read.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification_id: id }),
      });
    } catch {}
  };

  // Mark all as read
  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    try {
      await fetch(`${API_BASE}/notifications/mark_all_read.php`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-start justify-between">
          <div>
            <SheetHeader className="p-0">
              <SheetTitle>Notifications</SheetTitle>
              <SheetDescription>
                {loading
                  ? "Loading…"
                  : unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                  : "All caught up!"}
              </SheetDescription>
            </SheetHeader>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs">
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={fetchNotifications} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Body */}
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="px-4 py-2 space-y-2">

            {/* Loading state */}
            {loading && notifications.length === 0 && (
              <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Loading notifications…</span>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
                <Bell className="h-10 w-10 opacity-30" />
                <p className="text-sm font-medium">Could not load notifications</p>
                <Button variant="outline" size="sm" onClick={fetchNotifications}>
                  Try again
                </Button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && notifications.length === 0 && (
              <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
                <Bell className="h-10 w-10 opacity-30" />
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs text-center">
                  When someone likes your post, follows you, or comments,<br />you'll see it here.
                </p>
              </div>
            )}

            {/* Notification list */}
            {notifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => !notification.is_read && markRead(notification.id)}
                className={cn(
                  "flex items-start gap-3 rounded-lg transition-colors cursor-pointer",
                  notification.is_read
                    ? "p-3 hover:bg-accent"
                    : "pl-2 pr-3 py-3 bg-primary/10 hover:bg-primary/15 border-l-4 border-primary"
                )}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={notification.actor_photo || undefined} />
                    <AvatarFallback>
                      {(notification.actor_name || "?")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {!notification.is_read && (
                    <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-primary border-2 border-background rounded-full" />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm leading-snug">
                    {notification.actor_name && (
                      <span className={notification.is_read ? "font-semibold" : "font-bold"}>
                        {notification.actor_name}{" "}
                      </span>
                    )}
                    {notification.body}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {relativeTime(notification.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
