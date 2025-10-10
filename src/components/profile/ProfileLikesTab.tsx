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

  const handleLike = (userId: string, userNameToLike: string) => {
    const newLikedUsers = new Set(likedUsers);
    if (newLikedUsers.has(userId)) {
      newLikedUsers.delete(userId);
      toast({
        title: "Like Removed",
        description: `You unliked ${userNameToLike}`,
      });
    } else {
      newLikedUsers.add(userId);
      toast({
        title: "Liked",
        description: `You liked ${userNameToLike}`,
      });
    }
    setLikedUsers(newLikedUsers);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold uppercase">
          LIKES RECEIVED BY {userName}
        </h2>
        <p className="text-sm text-destructive italic">
          Users blocked by you and/or users that blocked you will not be displayed
        </p>
      </div>

      {/* Likes List */}
      <Card className="divide-y">
        {mockLikes.map((like) => (
          <div key={like.id} className="p-4 flex gap-4">
            {/* Avatar Section */}
            <div className="flex-shrink-0 flex flex-col items-start gap-1">
              <Avatar className="h-16 w-16 sm:h-18 sm:w-18">
                <AvatarImage src={like.avatar} alt={like.name} />
                <AvatarFallback>{like.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className={`text-xs font-medium ${like.isOnline ? 'text-success' : 'text-destructive'}`}>
                {like.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0 space-y-2">
              <h3 className="text-base font-bold uppercase">
                {like.name}
              </h3>
              
              <div className="space-y-1">
                <p className="text-sm text-foreground">
                  Has given {userName} {like.likeCount} Like{like.likeCount !== 1 ? 's' : ''}
                </p>
                
                {like.isContentCreator && (
                  <Badge variant="outline" className="text-xs text-primary/70 italic border-primary/30">
                    Upcoming Content Creator
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Button
                  onClick={() => handleViewProfile(like.id)}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                  size="sm"
                >
                  <Eye className="h-4 w-4" />
                  View Profile
                </Button>
                <Button
                  onClick={() => handleLike(like.id, like.name)}
                  style={{ 
                    backgroundColor: 'hsl(var(--warning))',
                    opacity: likedUsers.has(like.id) ? 0.7 : 1
                  }}
                  className="text-warning-foreground hover:opacity-80"
                  size="sm"
                >
                  <Heart className={`h-4 w-4 ${likedUsers.has(like.id) ? 'fill-current' : ''}`} />
                  {likedUsers.has(like.id) ? 'Liked' : 'Like'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};
