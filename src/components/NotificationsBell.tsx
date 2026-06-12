/**
 * NotificationsBell.tsx
 * Shows a bell icon in the header with unread count badge.
 * Drops down a list of notifications with mark-as-read.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, Check, UserPlus, Heart, MessageSquare, Gift, Eye, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

interface Notification {
  id:          string;
  type:        string;
  title:       string;
  body:        string;
  entity_id:   string | null;
  entity_type: string | null;
  is_read:     boolean;
  actor_id:    string | null;
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

const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  friend_request: { icon: <UserPlus    className="h-4 w-4" />, color: "bg-blue-100 text-blue-600"   },
  friend_accept:  { icon: <Users       className="h-4 w-4" />, color: "bg-green-100 text-green-600" },
  post_like:      { icon: <Heart       className="h-4 w-4" />, color: "bg-red-100 text-red-600"     },
  profile_like:   { icon: <Heart       className="h-4 w-4" />, color: "bg-pink-100 text-pink-600"   },
  comment:        { icon: <MessageSquare className="h-4 w-4"/>, color: "bg-teal-100 text-teal-600"  },
  gift:           { icon: <Gift        className="h-4 w-4" />, color: "bg-amber-100 text-amber-600" },
  follow:         { icon: <Eye         className="h-4 w-4" />, color: "bg-purple-100 text-purple-600"},
};

export const NotificationsBell = () => {
  const navigate  = useNavigate();
  const dropRef   = useRef<HTMLDivElement>(null);

  const [open,         setOpen]         = useState(false);
  const [notifications,setNotifications]= useState<Notification[]>([]);
  const [unreadCount,  setUnreadCount]  = useState(0);
  const [loading,      setLoading]      = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res  = await fetch(`${API_BASE}/notifications/list.php?limit=20`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      // Handle both array response and object response
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
      } else {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count ?? (data.notifications || []).filter((n: Notification) => !n.is_read).length);
      }
    } catch {}
  }, []);

  // Poll every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = async (id?: string) => {
    try {
      await fetch(`${API_BASE}/notifications/list.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read", id: id || null }),
      });
      if (id) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(c => Math.max(0, c - 1));
      } else {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch {}
  };

  const handleNotificationClick = (notif: Notification) => {
    markRead(notif.id);
    setOpen(false);
    // Navigate based on type
    if (notif.entity_type === "post" && notif.entity_id) {
      // scroll to / open post — for now navigate to home
      navigate("/dashboard");
    } else if ((notif.entity_type === "user" || notif.type === "friend_request" || notif.type === "friend_accept" || notif.type === "follow" || notif.type === "profile_like") && notif.actor_id) {
      navigate(`/profile/${notif.actor_id}`);
    }
  };

  const handleBellClick = () => {
    setOpen(v => !v);
    if (!open) fetchNotifications();
  };

  return (
    <div className="relative" ref={dropRef}>
      {/* Bell button */}
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-gray-600" />
              <span className="font-bold text-gray-900 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markRead()}
                  className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1"
                >
                  <Check className="h-3 w-3" />Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400 font-medium">No notifications yet</p>
                <p className="text-xs text-gray-300 mt-1">We'll notify you when something happens</p>
              </div>
            ) : (
              notifications.map(notif => {
                const cfg = typeConfig[notif.type] || typeConfig["comment"];
                return (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 ${!notif.is_read ? "bg-purple-50/50" : ""}`}
                  >
                    {/* Actor avatar or type icon */}
                    <div className="relative shrink-0">
                      {notif.actor_photo ? (
                        <img src={notif.actor_photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-500">
                            {notif.actor_name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                      <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center ${cfg.color} border-2 border-white`}>
                        {cfg.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!notif.is_read ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                        {notif.title}
                      </p>
                      {notif.body && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.body}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.created_at)}</p>
                    </div>

                    {/* Unread dot */}
                    {!notif.is_read && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full shrink-0 mt-1.5" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-center text-gray-400">Showing last {notifications.length} notifications</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
