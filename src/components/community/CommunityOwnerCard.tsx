import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Community } from "@/types/community";
import { Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CommunityOwnerCardProps {
  community: Community;
}

export function CommunityOwnerCard({ community }: CommunityOwnerCardProps) {
  const handleClick = () => {
    toast({
      title: "Coming Soon!",
      description: `${community.name} details will be available soon.`,
    });
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-border bg-card"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        {/* Cover Image */}
        <div className="relative h-32 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
          {community.coverImage ? (
            <img 
              src={community.coverImage} 
              alt={community.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users className="h-12 w-12 text-primary/40" />
            </div>
          )}
          
          {/* Status Badge */}
          <Badge 
            variant={community.status === "Active" ? "default" : "secondary"}
            className="absolute top-2 right-2 text-xs"
          >
            {community.status}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground line-clamp-1">
            {community.name}
          </h3>
          
          <p className="text-xs text-muted-foreground line-clamp-2">
            {community.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <Badge variant="outline" className="text-xs">
              {community.type}
            </Badge>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{community.memberCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
