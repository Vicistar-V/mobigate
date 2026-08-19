import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationsSheet } from "./NotificationsSheet";
import { MessagesSheet } from "./MessagesSheet";
import { useSidebar } from "@/components/ui/sidebar";
import { useLogo } from "@/hooks/useLogo";

export const Header = () => {
  const { toggleSidebar } = useSidebar();
  const { app_name, app_logo_url } = useLogo();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-sm shadow-sm">
      <div className="flex h-[var(--header-height)] items-center justify-between px-3 sm:px-4">

        {/* Left — hamburger + logo */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-9 w-9 hover:bg-primary/10 rounded-lg"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/dashboard" className="flex items-center transition-opacity hover:opacity-80">
            {app_logo_url ? (
              <img src={app_logo_url} alt={app_name} className="h-7 w-auto max-w-[130px] object-contain" />
            ) : (
              <span className="font-extrabold text-lg tracking-tight text-foreground">
                <span className="text-primary">M</span>{app_name.slice(1)}
              </span>
            )}
          </Link>
        </div>

        {/* Right — notifications, messages, profile */}
        <div className="flex items-center gap-1">
          <NotificationsSheet />
          <MessagesSheet />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};
