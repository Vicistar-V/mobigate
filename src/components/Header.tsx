import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationsSheet } from "./NotificationsSheet";
import { MessagesSheet } from "./MessagesSheet";
import { useSidebar } from "@/components/ui/sidebar";
import mobigateIcon from "@/assets/mobigate-icon.svg";
import mobigateLogo from "@/assets/mobigate-logo.svg";

export const Header = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="iconLg"
            onClick={toggleSidebar}
            className="hover:bg-primary/10"
          >
            <Menu />
          </Button>
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            {/* Icon and logo on mobile */}
            <img 
              src={mobigateIcon} 
              alt="Mobigate Icon" 
              className="h-12 w-auto"
            />
            <img 
              src={mobigateLogo} 
              alt="Mobigate" 
              className="h-12 w-auto"
            />
          </Link>
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
