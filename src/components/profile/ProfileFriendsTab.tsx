import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { mockFriends } from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Eye } from "lucide-react";

interface ProfileFriendsTabProps {
  userName: string;
  userId?: string;
}

export const ProfileFriendsTab = ({ userName }: ProfileFriendsTabProps) => {
  const { toast } = useToast();

  const handleAddFriend = (friendName: string) => {
    toast({
      title: "Friend Request Sent",
      description: `Friend request sent to ${friendName}`,
    });
  };

  const handleViewUser = (friendId: string) => {
    toast({
      title: "Viewing Profile",
      description: "Opening user profile...",
    });
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold uppercase">
          {mockFriends.length} FRIENDS OF {userName}
        </h2>
        <p className="text-sm text-destructive italic">
          Users blocked by you and/or users that blocked you will not be displayed
        </p>
      </div>

      {/* Friends List */}
      <Card className="divide-y">
        {mockFriends.map((friend) => (
          <div key={friend.id} className="p-4 flex gap-4">
            {/* Avatar Section */}
            <div className="flex-shrink-0 flex flex-col items-start gap-1">
              <Avatar className="h-16 w-16 sm:h-18 sm:w-18">
                <AvatarImage src={friend.avatar} alt={friend.name} />
                <AvatarFallback>{friend.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className={`text-xs font-medium ${friend.isOnline ? 'text-success' : 'text-destructive'}`}>
                {friend.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0 space-y-2">
              <h3 className="text-base font-bold uppercase">
                {friend.name}
              </h3>
              
              <div className="space-y-0.5">
                <p className="text-sm text-primary font-medium">
                  {friend.stats.friends.toLocaleString()} Friends , {friend.stats.likes.toLocaleString()} Likes
                </p>
                <p className="text-sm text-primary/80 italic">
                  {friend.stats.followers.toLocaleString()} Followers
                </p>
                <p className="text-sm text-primary/80 italic">
                  {friend.stats.following.toLocaleString()} Following
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Button
                  onClick={() => handleAddFriend(friend.name)}
                  className="bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Friend
                </Button>
                <Button
                  onClick={() => handleViewUser(friend.id)}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                  size="sm"
                >
                  <Eye className="h-4 w-4" />
                  View User
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};
