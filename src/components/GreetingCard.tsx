import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpg";
import { CreatePostDialog } from "./CreatePostDialog";
import { PeopleYouMayKnow } from "./PeopleYouMayKnow";

export const GreetingSection = () => {
  const primaryLinks = [
    { label: "Friends", href: "#" },
    { label: "Followers", href: "#" },
  ];

  const moreLinks = [
    { label: "Following", href: "#" },
    { label: "Gifts", href: "#" },
    { label: "Mobi Quiz Game", href: "#" },
    { label: "Mobi-Store", href: "#" },
    { label: "Mobi-Circle", href: "#" },
    { label: "Community", href: "#" },
    { label: "Biz-Catalogue", href: "#" },
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
            <p className="text-lg text-destructive font-semibold">Good Evening</p>
            <h2 className="text-3xl font-bold">NKEMJKA PETER I.</h2>
            <p className="text-base text-muted-foreground">Oct 5, 2025, 5:30pm</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 pt-2 border-t">
          {primaryLinks.map((link) => (
            <span key={link.label}>
              <a
                href={link.href}
                className="text-xl font-medium text-primary hover:underline transition-all hover:text-primary/80 tracking-wide"
              >
                {link.label}
              </a>
              <span className="text-muted-foreground px-1.5">|</span>
            </span>
          ))}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-xl font-medium text-primary hover:underline transition-all hover:text-primary/80 tracking-wide inline-flex items-center gap-1">
                <MoreHorizontal className="h-4 w-4" />
                More
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card z-50 w-48">
              {moreLinks.map((link) => (
                <DropdownMenuItem key={link.label} asChild className="text-xl font-medium text-primary">
                  <a href={link.href} className="cursor-pointer">
                    {link.label}
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};