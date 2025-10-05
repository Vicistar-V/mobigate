import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const UserProfileCard = () => {
  const stats = [
    { label: "Magazine", value: "12" },
    { label: "Following", value: "245" },
    { label: "Followers", value: "1.2k" },
    { label: "Video Calls", value: "8" },
    { label: "Gifts", value: "34" },
    { label: "Adverts Log", value: "5" },
  ];

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=nkemjka" />
          <AvatarFallback>NP</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">NKEMJKA PETER L</h2>
          <p className="text-sm text-muted-foreground">Oct. 1, 2025, 8:42pm</p>
          <div className="mt-2">
            <span className="text-xs font-medium text-primary">Quick Soul Game</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <button
            key={stat.label}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <span className="text-xs font-semibold text-primary">{stat.value}</span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search for anything on Mobigate..." className="pl-9" />
      </div>

      <Button className="w-full" variant="default">
        Create a Monetized Status Post
      </Button>
    </Card>
  );
};
