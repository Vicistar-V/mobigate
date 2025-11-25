import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Community } from "@/types/community";
import { Users, ChevronRight, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface JoinedCommunityRowProps {
  community: Community;
}

export function JoinedCommunityRow({ community }: JoinedCommunityRowProps) {
  const handleClick = () => {
    toast({
      title: "Coming Soon!",
      description: `${community.name} details will be available soon.`,
    });
  };

  // Get icon based on community type
  const getTypeIcon = () => {
    switch (community.type) {
      case "Town Union":
        return "🏛️";
      case "Club":
        return "📚";
      case "Association":
        return "🤝";
      case "Society":
        return "👥";
      case "Group":
        return "🌐";
      default:
        return "📋";
    }
  };

  // Get role color
  const getRoleBadgeVariant = () => {
    if (community.role === "Admin") return "default";
    if (community.role === "Moderator") return "secondary";
    return "outline";
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-200 border-border bg-card"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Icon/Avatar */}
          <div className="flex-shrink-0">
            {community.coverImage ? (
              <img 
                src={community.coverImage} 
                alt={community.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                {getTypeIcon()}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-foreground line-clamp-1 text-sm">
                {community.name}
              </h3>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="outline" className="text-xs">
                {community.type}
              </Badge>
              
              {community.role && (
                <Badge variant={getRoleBadgeVariant()} className="text-xs">
                  {community.role}
                </Badge>
              )}
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{community.memberCount.toLocaleString()}</span>
              </div>
            </div>

            {community.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">{community.location}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
