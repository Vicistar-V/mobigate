import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Crown, ChevronRight, Building2, MapPin, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getOwnedCommunities, getJoinedCommunities } from "@/data/communityData";
import { Community } from "@/types/community";

interface ProfileCommunityTabProps {
  userName: string;
}

const getTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    "Town Union": "🏛️",
    "Club": "🎯",
    "Association": "🤝",
    "Society": "📚",
    "Group": "👥",
  };
  return icons[type] || "🏢";
};

const getRoleBadgeVariant = (role?: string): "default" | "secondary" | "outline" => {
  if (role === "Owner") return "default";
  if (role === "Admin" || role === "Moderator") return "secondary";
  return "outline";
};

const formatMemberCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

interface CommunityCardProps {
  community: Community;
  onClick: () => void;
}

function CommunityCard({ community, onClick }: CommunityCardProps) {
  return (
    <Card 
      className="p-4 cursor-pointer hover:bg-accent/50 transition-colors active:scale-[0.98] rounded-xl"
      onClick={onClick}
    >
      <div className="flex items-center gap-3.5">
        {/* Avatar/Icon - Increased to 64x64 */}
        <Avatar className="h-16 w-16 rounded-xl">
          {community.coverImage ? (
            <AvatarImage src={community.coverImage} alt={community.name} className="object-cover" />
          ) : null}
          <AvatarFallback className="rounded-xl bg-primary/10 text-2xl">
            {getTypeIcon(community.type)}
          </AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base truncate">{community.name}</h4>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <Badge variant="outline" className="text-xs px-2.5 py-0.5 h-6">
              {community.type}
            </Badge>
            {community.role && (
              <Badge variant={getRoleBadgeVariant(community.role)} className="text-xs px-2.5 py-0.5 h-6">
                {community.role}
              </Badge>
            )}
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-4 w-4" />
              {formatMemberCount(community.memberCount)}
            </span>
          </div>
          {community.location && (
            <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1 truncate">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {community.location}
            </p>
          )}
        </div>

        {/* Arrow */}
        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
      </div>
    </Card>
  );
}

export function ProfileCommunityTab({ userName }: ProfileCommunityTabProps) {
  const navigate = useNavigate();
  const ownedCommunities = getOwnedCommunities();
  const joinedCommunities = getJoinedCommunities();
  
  const totalCommunities = ownedCommunities.length + joinedCommunities.length;
  const displayedOwned = ownedCommunities.slice(0, 3);
  const displayedJoined = joinedCommunities.slice(0, 4);

  const handleCommunityClick = (communityId: string) => {
    navigate(`/community/${communityId}`);
  };

  const handleViewAll = () => {
    navigate("/community");
  };

  const handleCreateCommunity = () => {
    navigate("/create-community");
  };

  if (totalCommunities === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-medium text-lg mb-1">No Communities Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {userName} hasn't joined any communities yet.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={handleCreateCommunity}>
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
            <Button variant="outline" onClick={handleViewAll}>
              Explore Communities
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Create and View All buttons */}
      <Card className="p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-base">
              {totalCommunities} {totalCommunities === 1 ? "Community" : "Communities"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCreateCommunity}
              className="h-9 text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleViewAll}
              className="h-9 text-sm"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* My Communities (Owned) */}
      {ownedCommunities.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 px-1">
            <Crown className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold text-base">My Communities</h3>
            <Badge variant="secondary" className="text-sm h-6 px-2.5">
              {ownedCommunities.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {displayedOwned.map((community) => (
              <CommunityCard
                key={community.id}
                community={community}
                onClick={() => handleCommunityClick(community.id)}
              />
            ))}
            {ownedCommunities.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-sm h-10"
                onClick={handleViewAll}
              >
                See {ownedCommunities.length - 3} more owned communities
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Communities I Joined */}
      {joinedCommunities.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 px-1">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-base">Communities I Joined</h3>
            <Badge variant="secondary" className="text-sm h-6 px-2.5">
              {joinedCommunities.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {displayedJoined.map((community) => (
              <CommunityCard
                key={community.id}
                community={community}
                onClick={() => handleCommunityClick(community.id)}
              />
            ))}
            {joinedCommunities.length > 4 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-sm h-10"
                onClick={handleViewAll}
              >
                See {joinedCommunities.length - 4} more joined communities
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Bottom View All Link */}
      <Card className="p-4 bg-accent/30 rounded-xl">
        <Button 
          variant="outline" 
          className="w-full h-12 text-base rounded-xl"
          onClick={handleViewAll}
        >
          <Building2 className="h-5 w-5 mr-2" />
          View All {totalCommunities} Communities
        </Button>
      </Card>
    </div>
  );
}
