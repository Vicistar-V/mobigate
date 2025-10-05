import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const UserProfileCard = () => {
  const navLinks = [
    { label: "Mobi Quiz Game", href: "#" },
    { label: "Mobi-Store", href: "#" },
    { label: "E-Library", href: "#" },
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-destructive font-medium">Good Evening</p>
        <h2 className="text-xl font-bold">NKEMJKA PETER I.</h2>
        <p className="text-sm text-muted-foreground">Oct; 1, 2025, 4:50pm</p>
      </div>

      <div className="flex flex-wrap gap-4">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm font-medium text-primary hover:underline"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="relative">
        <Input 
          placeholder="Search for anything on Mobigate..." 
          className="pr-24"
        />
        <Button 
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          SEARCH
        </Button>
      </div>

      <Card className="p-4 bg-muted">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=nkemjka" />
            <AvatarFallback>NP</AvatarFallback>
          </Avatar>
          <p className="text-lg font-bold text-primary flex-1 text-center">
            Create a Monetized Status Post
          </p>
        </div>
      </Card>
    </Card>
  );
};
