import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    user: "Sarah Okafor",
    action: "liked your post",
    time: "5 minutes ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    isRead: false,
  },
  {
    id: 2,
    user: "James Adewale",
    action: "commented on your status",
    time: "1 hour ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    isRead: false,
  },
  {
    id: 3,
    user: "Chioma Eze",
    action: "started following you",
    time: "2 hours ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chioma",
    isRead: false,
  },
  {
    id: 4,
    user: "David Okonkwo",
    action: "shared your article",
    time: "5 hours ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    isRead: true,
  },
  {
    id: 5,
    user: "Dr. Amina Yusuf",
    action: "mentioned you in a post",
    time: "1 day ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amina",
    isRead: true,
  },
];

export const NotificationsSheet = () => {
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="iconLg" className="relative hover:bg-primary/10">
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-sm font-bold text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                  notification.isRead
                    ? "hover:bg-accent"
                    : "bg-primary/10 hover:bg-primary/15 border-l-4 border-primary"
                )}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={notification.avatar} />
                    <AvatarFallback>{notification.user[0]}</AvatarFallback>
                  </Avatar>
                  {!notification.isRead && (
                    <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-primary border-2 border-background rounded-full" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-base">
                    <span className={notification.isRead ? "font-semibold" : "font-bold"}>
                      {notification.user}
                    </span>{" "}
                    {notification.action}
                  </p>
                  <p className="text-sm text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
