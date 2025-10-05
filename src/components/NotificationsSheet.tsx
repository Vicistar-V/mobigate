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

const notifications = [
  {
    id: 1,
    user: "Sarah Okafor",
    action: "liked your post",
    time: "5 minutes ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    id: 2,
    user: "James Adewale",
    action: "commented on your status",
    time: "1 hour ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
  },
  {
    id: 3,
    user: "Chioma Eze",
    action: "started following you",
    time: "2 hours ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chioma",
  },
  {
    id: 4,
    user: "David Okonkwo",
    action: "shared your article",
    time: "5 hours ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
  },
  {
    id: 5,
    user: "Dr. Amina Yusuf",
    action: "mentioned you in a post",
    time: "1 day ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amina",
  },
];

export const NotificationsSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            You have {notifications.length} unread notifications
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={notification.avatar} />
                  <AvatarFallback>{notification.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-semibold">{notification.user}</span>{" "}
                    {notification.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
