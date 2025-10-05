import { Menu, Bell, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              M
            </div>
            <span className="text-xl font-bold text-primary">Mobigate</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
            <AvatarFallback>NP</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
