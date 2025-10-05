import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationsSheet } from "./NotificationsSheet";
import { MessagesSheet } from "./MessagesSheet";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-7 w-7" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              M
            </div>
            <span className="text-xl font-bold text-primary">Mobigate</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationsSheet />
          <MessagesSheet />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};
