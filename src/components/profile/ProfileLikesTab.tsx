import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockLikes } from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { Eye, Heart } from "lucide-react";
import { useState } from "react";

interface ProfileLikesTabProps {
  userName: string;
  userId?: string;
}

export const ProfileLikesTab = ({ userName }: ProfileLikesTabProps) => {
  const { toast } = useToast();
  const [likedUsers, setLikedUsers] = useState<Set<string>>(new Set());

  const handleViewProfile = (userId: string) => {
    toast({
      title: "Viewing Profile",
      description: "Opening user profile...",
    });
  };

  const handleLike = (userId: string, userName: string) => {
    if (likedUsers.has(userId)) {
      setLikedUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      toast({
        title: "Like Removed",
        description: `You unliked ${userName}`,
      });
    } else {
      setLikedUsers(prev => new Set(prev).add(userId));
      toast({
        title: "Like Sent",
        description: `You liked ${userName}`,
      });
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <h2 className="text-xl font-bold uppercase">
          LIKES RECEIVED BY {userName}
        </h2>
        <p className="text-sm text-destructive italic">
          Users blocked by you and/or users that blocked you will not be displayed
        </p>
      </div>

      {/* Likes List */}
      <div className="space-y-4">
        {mockLikes.map((like, index) => (
          <Card key={like.id} className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Avatar Section */}
              <div className="flex flex-col items-center sm:items-start space-y-2">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  <AvatarImage src={like.avatar} alt={like.name} />
                  <AvatarFallback>{like.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className={`text-xs font-medium ${like.isOnline ? 'text-success' : 'text-destructive'}`}>
                  {like.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-bold uppercase text-center sm:text-left">
                  {like.name}
                </h3>
                
                <div className="text-center sm:text-left space-y-2">
                  <p className="text-sm text-foreground">
                    Has given {userName.split(' ')[0]} {like.likeCount} Like{like.likeCount !== 1 ? 's' : ''}
                  </p>
                  
                  {like.isContentCreator && (
                    <Badge variant="outline" className="text-xs text-primary/70 italic border-primary/30">
                      Upcoming Content Creator
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    onClick={() => handleViewProfile(like.id)}
                    className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                    size="default"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                  <Button
                    onClick={() => handleLike(like.id, like.name)}
                    className="flex-1 hover:opacity-90"
                    style={{ 
                      backgroundColor: likedUsers.has(like.id) ? 'hsl(48, 96%, 53%)' : 'hsl(48, 96%, 53%)',
                      color: 'hsl(0, 0%, 0%)',
                      opacity: likedUsers.has(like.id) ? 0.7 : 1
                    }}
                    size="default"
                  >
                    <Heart 
                      className="mr-2 h-4 w-4" 
                      fill={likedUsers.has(like.id) ? 'currentColor' : 'none'}
                    />
                    {likedUsers.has(like.id) ? 'Liked' : 'Like'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Divider - only show if not the last item */}
            {index < mockLikes.length - 1 && (
              <div className="border-t border-border mt-4" />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
