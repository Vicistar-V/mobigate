import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockFollowers } from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { Eye } from "lucide-react";

interface ProfileFollowersTabProps {
  userName: string;
  userId?: string;
}

export const ProfileFollowersTab = ({ userName }: ProfileFollowersTabProps) => {
  const { toast } = useToast();

  const handleViewUser = (userId: string) => {
    toast({
      title: "Viewing Profile",
      description: "Opening user profile...",
    });
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <h2 className="text-xl font-bold uppercase">
          {mockFollowers.length} FOLLOWER{mockFollowers.length !== 1 ? 'S' : ''} OF {userName}
        </h2>
        <p className="text-sm text-destructive italic">
          Users blocked by you and/or users that blocked you will not be displayed
        </p>
      </div>

      {/* Followers List */}
      <div className="space-y-4">
        {mockFollowers.map((follower, index) => (
          <Card key={follower.id} className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Avatar Section */}
              <div className="flex flex-col items-center sm:items-start space-y-2">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  <AvatarImage src={follower.avatar} alt={follower.name} />
                  <AvatarFallback>{follower.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className={`text-xs font-medium ${follower.isOnline ? 'text-success' : 'text-destructive'}`}>
                  {follower.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-bold uppercase text-center sm:text-left">
                  {follower.name}
                </h3>
                
                <div className="text-center sm:text-left space-y-2">
                  {follower.isContentCreator && (
                    <Badge variant="outline" className="text-xs text-primary/70 italic border-primary/30">
                      Upcoming Content Creator
                    </Badge>
                  )}
                  
                  {follower.hasInsufficientFunds && (
                    <p className="text-sm text-destructive italic">
                      Insufficient Funds to follow
                    </p>
                  )}
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <Button
                    onClick={() => handleViewUser(follower.id)}
                    className="w-full sm:w-auto bg-success hover:bg-success/90 text-success-foreground"
                    size="default"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View User
                  </Button>
                </div>
              </div>
            </div>

            {/* Divider - only show if not the last item */}
            {index < mockFollowers.length - 1 && (
              <div className="border-t border-border mt-4" />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
