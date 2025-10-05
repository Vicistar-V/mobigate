import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpg";
import { CreatePostDialog } from "./CreatePostDialog";

export const GreetingSection = () => {
  const navLinks = [
    { label: "Friends", href: "#" },
    { label: "Followers", href: "#" },
    { label: "Following", href: "#" },
    { label: "Gifts", href: "#" },
    { label: "Mobi Quiz Game", href: "#" },
    { label: "Mobi-Store", href: "#" },
    { label: "E-Library", href: "#" },
    { label: "Adverts Log", href: "#" },
  ];

  return (
    <div className="space-y-4">
      {/* Greeting Card */}
      <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary/20">
            <AvatarImage src={profilePhoto} alt="Profile" />
            <AvatarFallback>NP</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <p className="text-sm text-destructive font-semibold">Good Evening</p>
            <h2 className="text-2xl font-bold">NKEMJKA PETER I.</h2>
            <p className="text-sm text-muted-foreground">Oct 5, 2025, 5:30pm</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {navLinks.map((link, index) => (
            <span key={link.label}>
              <a
                href={link.href}
                className="text-base font-medium text-primary hover:underline transition-all hover:text-primary/80"
              >
                {link.label}
              </a>
              {index < navLinks.length - 1 && <span className="text-muted-foreground"> | </span>}
            </span>
          ))}
        </div>

        {/* Search Section */}
        <div className="pt-4 border-t">
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
        </div>
      </Card>

      {/* Create Post Dialog */}
      <CreatePostDialog />
    </div>
  );
};