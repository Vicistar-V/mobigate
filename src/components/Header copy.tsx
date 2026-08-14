import { Menu, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationsSheet } from "./NotificationsSheet";
import { MessagesSheet } from "./MessagesSheet";
import { useSidebar } from "@/components/ui/sidebar";
import mobigateLogo from "@/assets/mobiface-logo.png";

export const Header = () => {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-sm shadow-sm">
      <div className="flex h-[var(--header-height)] items-center justify-between px-3 sm:px-4 gap-2">

        {/* Left — hamburger + logo */}
        <div className="flex items-center gap-2 shrink-0">
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
            <img
              src={mobigateLogo}
              alt="Mobigate"
              className="h-7 w-auto max-w-[120px] object-contain"
            />
          </Link>
        </div>

        {/* Centre — search (desktop always, mobile as overlay) */}
        {searchOpen && (
          <form onSubmit={handleSearch}
            className="absolute inset-0 z-10 flex items-center bg-card/95 backdrop-blur-sm px-3 gap-2">
            <div className="relative flex-1 max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search Mobigate…"
                className="h-8 pl-8 rounded-full bg-muted/60 border-0 focus-visible:ring-1 text-sm" />
            </div>
            <Button type="button" variant="ghost" size="sm" className="text-xs shrink-0"
              onClick={() => { setSearchOpen(false); setQuery(""); }}>
              Cancel
            </Button>
          </form>
        )}

        <form onSubmit={handleSearch}
          className="hidden sm:flex flex-1 max-w-sm mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search Mobigate…"
              className="h-8 pl-8 rounded-full bg-muted/60 border-0 focus-visible:ring-1 text-sm" />
          </div>
        </form>

        {/* Right — search (mobile) + actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon"
            className="h-9 w-9 sm:hidden hover:bg-primary/10 rounded-lg"
            onClick={() => setSearchOpen(true)}>
            <Search className="h-[18px] w-[18px]" />
          </Button>
          <NotificationsSheet />
          <MessagesSheet />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};