import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockFollowing } from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Eye } from "lucide-react";
import { useState } from "react";

interface ProfileFollowingTabProps {
  userName: string;
  userId?: string;
}

export const ProfileFollowingTab = ({ userName }: ProfileFollowingTabProps) => {
  const { toast } = useToast();
  const [followingStatus, setFollowingStatus] = useState<Map<string, boolean>>(
    new Map(mockFollowing.map(user => [user.id, user.isFollowing]))
  );

  const handleViewUser = (userId: string) => {
    toast({
      title: "Viewing Profile",
      description: "Opening user profile...",
    });
  };

  const handleFollowToggle = (userId: string, userName: string) => {
    const currentStatus = followingStatus.get(userId) || false;
    setFollowingStatus(prev => {
      const newMap = new Map(prev);
      newMap.set(userId, !currentStatus);
      return newMap;
    });

    toast({
      title: currentStatus ? "Unfollowed" : "Following",
      description: currentStatus 
        ? `You unfollowed ${userName}`
        : `You are now following ${userName}`,
    });
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <h2 className="text-xl font-bold uppercase">
          {mockFollowing.length} USER{mockFollowing.length !== 1 ? 'S' : ''} FOLLOWED BY {userName}
        </h2>
        <p className="text-sm text-destructive italic">
          Users blocked by you and/or users that blocked you will not be displayed
        </p>
      </div>

      {/* Following List */}
      <div className="space-y-4">
        {mockFollowing.map((user, index) => (
          <Card key={user.id} className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Avatar Section */}
              <div className="flex flex-col items-center sm:items-start space-y-2">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className={`text-xs font-medium ${user.isOnline ? 'text-success' : 'text-destructive'}`}>
                  {user.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-bold uppercase text-center sm:text-left">
                  {user.name}
                </h3>
                
                <div className="text-center sm:text-left space-y-2">
                  {user.isContentCreator && (
                    <Badge variant="outline" className="text-xs text-primary/70 italic border-primary/30">
                      Upcoming Content Creator
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    onClick={() => handleFollowToggle(user.id, user.name)}
                    className="flex-1"
                    style={{ 
                      backgroundColor: followingStatus.get(user.id) 
                        ? 'hsl(189, 94%, 43%)' 
                        : 'hsl(189, 94%, 33%)',
                      color: 'hsl(0, 0%, 100%)',
                      opacity: followingStatus.get(user.id) ? 0.7 : 1
                    }}
                    size="default"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {followingStatus.get(user.id) ? 'Following' : 'Follow'}
                  </Button>
                  <Button
                    onClick={() => handleViewUser(user.id)}
                    className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                    size="default"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View User
                  </Button>
                </div>
              </div>
            </div>

            {/* Divider - only show if not the last item */}
            {index < mockFollowing.length - 1 && (
              <div className="border-t border-border mt-4" />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
