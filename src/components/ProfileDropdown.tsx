import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, CreditCard, LogOut, Loader2, BadgeCheck } from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import { useState } from "react";

export const ProfileDropdown = () => {
  const navigate          = useNavigate();
  const { user, logout }  = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  const displayName  = user?.fullName   || user?.username || "User";
  const displayEmail = user?.email      || "";
  const avatar       = user?.profilePhoto || "";
  const initials     = displayName.substring(0, 2).toUpperCase();
  const userId       = user?.id || "1";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-14 w-14 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
          <AvatarImage src={avatar} alt={displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-base font-medium">{displayName}</p>
            <p className="text-sm text-muted-foreground">{displayEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" /><span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/verify-account')}>
          <BadgeCheck className="mr-2 h-4 w-4 text-primary" /><span>Verify Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" /><span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/billing')}>
          <CreditCard className="mr-2 h-4 w-4" /><span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
          <span>{loggingOut ? "Signing out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
