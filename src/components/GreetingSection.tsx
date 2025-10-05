import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const GreetingSection = () => {
  const navLinks = [
    { label: "Mobi Quiz Game", href: "#" },
    { label: "Mobi-Store", href: "#" },
    { label: "E-Library", href: "#" },
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
      <Card className="p-4 hover:shadow-md transition-shadow">
        <Button 
          className="w-full h-auto py-4 px-4 flex items-center gap-4 justify-start"
          size="lg"
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=nkemjka" />
            <AvatarFallback>NP</AvatarFallback>
          </Avatar>
          <span className="text-base font-semibold">
            Create a Monetized Status Post
          </span>
        </Button>
      </Card>
    </div>
  );
};