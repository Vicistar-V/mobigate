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
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold uppercase">
          {mockFollowers.length} FOLLOWER{mockFollowers.length !== 1 ? 'S' : ''} OF {userName}
        </h2>
        <p className="text-sm text-destructive italic">
          Users blocked by you and/or users that blocked you will not be displayed
        </p>
      </div>

      {/* Followers List */}
      <Card className="divide-y">
        {mockFollowers.map((follower) => (
          <div key={follower.id} className="p-4 flex gap-4">
            {/* Avatar Section */}
            <div className="flex-shrink-0 flex flex-col items-start gap-1">
              <Avatar className="h-16 w-16 sm:h-18 sm:w-18">
                <AvatarImage src={follower.avatar} alt={follower.name} />
                <AvatarFallback>{follower.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className={`text-xs font-medium ${follower.isOnline ? 'text-success' : 'text-destructive'}`}>
                {follower.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0 space-y-2">
              <h3 className="text-base font-bold uppercase">
                {follower.name}
              </h3>
              
              <div className="space-y-1">
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
              <div className="pt-1">
                <Button
                  onClick={() => handleViewUser(follower.id)}
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
