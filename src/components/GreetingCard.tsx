import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

export const GreetingSection = () => {
  const navLinks = [
    { label: "Mobi Quiz Game", href: "#" },
    { label: "Mobi-Store", href: "#" },
    { label: "E-Library", href: "#" },
    { label: "Friends", href: "#" },
    { label: "Followers", href: "#" },
    { label: "Following", href: "#" },
    { label: "Gifts", href: "#" },
    { label: "Adverts Log", href: "#" },
  ];

  return (
    <div className="space-y-4">
      {/* Greeting Card */}
      <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <p className="text-sm text-destructive font-semibold">Good Evening</p>
          <h2 className="text-2xl font-bold">NKEMJKA PETER I.</h2>
          <p className="text-sm text-muted-foreground">Oct 5, 2025, 5:30pm</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2 border-t">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-primary hover:underline transition-all hover:text-primary/80"
            >
              {link.label}
            </a>
          ))}
        </div>
      </Card>

      {/* Search Card */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for anything on Mobigate..." 
            className="pl-10 pr-24"
          />
          <Button 
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            SEARCH
          </Button>
        </div>
      </Card>

      {/* Create Post Card */}
      <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=nkemjka" />
            <AvatarFallback>NP</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              Create a Monetized Status Post
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Share your thoughts and earn
            </p>
          </div>
          <Plus className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
        </div>
      </Card>
    </div>
  );
};