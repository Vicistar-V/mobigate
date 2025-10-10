import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockFollowing } from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, UserCheck, Eye } from "lucide-react";
import { useState } from "react";

interface ProfileFollowingTabProps {
  userName: string;
  userId?: string;
}

export const ProfileFollowingTab = ({ userName }: ProfileFollowingTabProps) => {
  const { toast } = useToast();
  const [followingStatus, setFollowingStatus] = useState<Map<string, boolean>>(
    new Map(mockFollowing.map(user => [user.id, true]))
  );

  const handleViewUser = (userId: string) => {
    toast({
      title: "Viewing Profile",
      description: "Opening user profile...",
    });
  };

  const handleFollowToggle = (userId: string, userNameToFollow: string) => {
    const newStatus = new Map(followingStatus);
    const isCurrentlyFollowing = newStatus.get(userId);
    newStatus.set(userId, !isCurrentlyFollowing);
    setFollowingStatus(newStatus);

    toast({
      title: isCurrentlyFollowing ? "Unfollowed" : "Following",
      description: isCurrentlyFollowing 
        ? `You unfollowed ${userNameToFollow}`
        : `You are now following ${userNameToFollow}`,
    });
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold uppercase">
          {mockFollowing.length} USER{mockFollowing.length !== 1 ? 'S' : ''} FOLLOWED BY {userName}
        </h2>
        <p className="text-sm text-destructive italic">
          Users blocked by you and/or users that blocked you will not be displayed
        </p>
      </div>

      {/* Following List */}
      <Card className="divide-y">
        {mockFollowing.map((user) => {
          const isFollowing = followingStatus.get(user.id);
          
          return (
            <div key={user.id} className="p-4 flex gap-4">
              {/* Avatar Section */}
              <div className="flex-shrink-0 flex flex-col items-start gap-1">
                <Avatar className="h-16 w-16 sm:h-18 sm:w-18">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className={`text-xs font-medium ${user.isOnline ? 'text-success' : 'text-destructive'}`}>
                  {user.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Content Section */}
              <div className="flex-1 min-w-0 space-y-2">
                <h3 className="text-base font-bold uppercase">
                  {user.name}
                </h3>
                
                {user.isContentCreator && (
                  <Badge variant="outline" className="text-xs text-primary/70 italic border-primary/30">
                    Upcoming Content Creator
                  </Badge>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <Button
                    onClick={() => handleFollowToggle(user.id, user.name)}
                    style={{ 
                      backgroundColor: 'hsl(var(--accent))',
                      opacity: isFollowing ? 0.7 : 1
                    }}
                    className="text-accent-foreground hover:opacity-80"
                    size="sm"
                  >
                    {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button
                    onClick={() => handleViewUser(user.id)}
                    className="bg-success hover:bg-success/90 text-success-foreground"
                    size="sm"
                  >
                    <Eye className="h-4 w-4" />
                    View User
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};
