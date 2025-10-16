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
import { Link } from "react-router-dom";
import profilePhoto from "@/assets/profile-photo.jpg";
import { CreatePostDialog } from "./CreatePostDialog";
import { PeopleYouMayKnow } from "./PeopleYouMayKnow";
import { useServiceUnavailableDialog } from "@/hooks/useServiceUnavailableDialog";

export const GreetingSection = () => {
  const { showDialog, Dialog } = useServiceUnavailableDialog();
  const restrictedServices = ['/mobi-shop', '/mobi-circle', '/biz-catalogue', '/community'];

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (restrictedServices.includes(href)) {
      e.preventDefault();
      showDialog();
    }
  };

  const primaryLinks = [
    { label: "About Me", href: "/profile/current-user#about" },
    { label: "Friends", href: "/profile/current-user#friends" },
    { label: "Albums", href: "/profile/current-user#albums" },
  ];

  const moreLinks = [
    { label: "Followers", href: "/profile/current-user#followers" },
    { label: "Following", href: "/profile/current-user#following" },
    { label: "Gifts", href: "/profile/current-user#gifts" },
    { label: "Mobi Quiz Game", href: "/mobi-quiz-game" },
    { label: "Mobi-Store", href: "/mobi-shop" },
    { label: "Mobi-Circle", href: "/mobi-circle" },
    { label: "Community", href: "/community" },
    { label: "Biz-Catalogue", href: "/biz-catalogue" },
    { label: "E-Library", href: "/profile/current-user#contents" },
    { label: "Adverts Log", href: "/adverts-log" },
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
              <Link
                to={link.href}
                className="text-xl font-medium text-primary hover:underline transition-all hover:text-primary/80 tracking-wide"
              >
                {link.label}
              </Link>
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
                  <Link 
                    to={link.href} 
                    className="cursor-pointer"
                    onClick={(e) => handleLinkClick(e, link.href)}
                  >
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Section */}
        <div className="pt-4 border-t">
          <div className="relative">
            <Input 
              placeholder="Search for anything on Mobigate..." 
              className="pr-12"
            />
            <Button 
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* People You May Know */}
      <PeopleYouMayKnow />

      {/* Service Unavailable Dialog */}
      <Dialog />
    </div>
  );
};