import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const messages = [
  {
    id: 1,
    user: "Tunde Bakare",
    message: "Hey! Did you see my latest post about tech startups?",
    time: "10m ago",
    unread: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tunde",
  },
  {
    id: 2,
    user: "Chef Ngozi",
    message: "Thank you for your support! Check out my new recipe.",
    time: "1h ago",
    unread: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ngozi",
  },
  {
    id: 3,
    user: "Emeka Nwosu",
    message: "Let's collaborate on the real estate project.",
    time: "3h ago",
    unread: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emeka",
  },
  {
    id: 4,
    user: "Sarah Okafor",
    message: "Great article! Very insightful content.",
    time: "1d ago",
    unread: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah2",
  },
];

export const MessagesSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="iconLg">
          <MessageSquare />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Messages</SheetTitle>
          <SheetDescription>
            {messages.filter((m) => m.unread).length} unread messages
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={message.avatar} />
                  <AvatarFallback>{message.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold truncate">{message.user}</p>
                    {message.unread && (
                      <Badge variant="destructive" className="h-5 px-1.5">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {message.message}
                  </p>
                  <p className="text-xs text-muted-foreground">{message.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
