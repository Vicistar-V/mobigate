import { useState } from "react";
import { Bell, Cake, UserPlus, Calendar, Video, Megaphone, Vote, Heart, MessageCircle, Gift, CheckCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  CommunityNotification, 
  NotificationType,
  communityNotifications as initialNotifications,
  formatRelativeTime,
  groupNotificationsByTime 
} from "@/data/communityNotificationsData";
import { NotificationDetailDrawer } from "./NotificationDetailDrawer";

interface CommunityNotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId: string;
}

// Get icon component for notification type
const getNotificationIconComponent = (type: NotificationType) => {
  switch (type) {
    case "birthday":
      return <Cake className="h-4 w-4 text-pink-500" />;
    case "new_member":
    case "membership_approved":
      return <UserPlus className="h-4 w-4 text-blue-500" />;
    case "event":
      return <Calendar className="h-4 w-4 text-orange-500" />;
    case "meeting":
      return <Video className="h-4 w-4 text-purple-500" />;
    case "announcement":
      return <Megaphone className="h-4 w-4 text-yellow-600" />;
    case "election":
      return <Vote className="h-4 w-4 text-green-500" />;
    case "fundraiser":
      return <Gift className="h-4 w-4 text-red-500" />;
    case "post_liked":
      return <Heart className="h-4 w-4 text-rose-500" />;
    case "post_commented":
      return <MessageCircle className="h-4 w-4 text-cyan-500" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

// Get background color for notification type
const getNotificationBgColor = (type: NotificationType) => {
  switch (type) {
    case "birthday":
      return "bg-pink-100 dark:bg-pink-900/30";
    case "new_member":
    case "membership_approved":
      return "bg-blue-100 dark:bg-blue-900/30";
    case "event":
      return "bg-orange-100 dark:bg-orange-900/30";
    case "meeting":
      return "bg-purple-100 dark:bg-purple-900/30";
    case "announcement":
      return "bg-yellow-100 dark:bg-yellow-900/30";
    case "election":
      return "bg-green-100 dark:bg-green-900/30";
    case "fundraiser":
      return "bg-red-100 dark:bg-red-900/30";
    default:
      return "bg-muted";
  }
};

export function CommunityNotificationsSheet({ 
  open, 
  onOpenChange, 
  communityId 
}: CommunityNotificationsSheetProps) {
  const [notifications, setNotifications] = useState<CommunityNotification[]>(
    initialNotifications.filter(n => n.communityId === communityId || n.communityId === "1")
  );
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedNotification, setSelectedNotification] = useState<CommunityNotification | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = activeFilter === "all" 
    ? notifications 
    : notifications.filter(n => n.type === activeFilter);

  const groupedNotifications = groupNotificationsByTime(filteredNotifications);

  const handleNotificationClick = (notification: CommunityNotification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );
    // Open detail drawer
    setSelectedNotification(notification);
    setDetailDrawerOpen(true);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "birthday", label: "🎂" },
    { value: "new_member", label: "👤" },
    { value: "event", label: "📅" },
    { value: "meeting", label: "🗓️" },
    { value: "announcement", label: "📢" },
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <SheetTitle className="text-lg font-bold">Notifications</SheetTitle>
                  {unreadCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
              {filterOptions.map((filter) => (
                <Button
                  key={filter.value}
                  variant={activeFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.value)}
                  className="text-xs px-3 shrink-0"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="p-4 space-y-6">
              {groupedNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                groupedNotifications.map((group) => (
                  <div key={group.label}>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      {group.label}
                    </h3>
                    <div className="space-y-2">
                      {group.notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border transition-all cursor-pointer active:scale-[0.98] ${
                            notification.isRead 
                              ? "bg-background hover:bg-muted/50" 
                              : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex gap-3">
                            {/* Icon or Avatar */}
                            {notification.avatar ? (
                              <Avatar className="h-10 w-10 shrink-0">
                                <AvatarImage src={notification.avatar} alt={notification.personName} />
                                <AvatarFallback>
                                  {notification.personName?.charAt(0) || "?"}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getNotificationBgColor(notification.type)}`}>
                                {getNotificationIconComponent(notification.type)}
                              </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-medium text-sm leading-tight">
                                  {notification.title}
                                </p>
                                {!notification.isRead && (
                                  <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-muted-foreground/70 mt-1.5">
                                {formatRelativeTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Notification Detail Drawer */}
      <NotificationDetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        notification={selectedNotification}
      />
    </>
  );
}
