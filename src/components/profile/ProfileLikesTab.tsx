import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockLikes } from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { Eye, Users, Heart, UserPlus, Eye as EyeIcon } from "lucide-react";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { likesAdSlots } from "@/data/profileAds";
import { getRandomAdSlot } from "@/lib/adUtils";
import React from "react";

interface ProfileLikesTabProps {
  userName: string;
  userId?: string;
}

export const ProfileLikesTab = ({ userName }: ProfileLikesTabProps) => {
  const { toast } = useToast();

  const handleViewProfile = (userId: string, name: string) => {
    toast({
      title: "Viewing Profile",
      description: `Opening ${name}'s profile...`,
    });
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
        {mockLikes.map((like, index) => (
          <React.Fragment key={like.id}>
            <div className="group p-4 flex gap-4 hover:bg-accent/5 transition-all duration-200">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0">
                <button 
                  onClick={() => handleViewProfile(like.id, like.name)}
                  className="relative block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                >
                  <Avatar className={`h-16 w-16 sm:h-20 sm:w-20 ring-2 transition-all ${
                    like.isOnline ? 'ring-emerald-500/50' : 'ring-border'
                  }`}>
                    <AvatarImage src={like.avatar} alt={like.name} />
                    <AvatarFallback>{like.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  {/* Animated Online Indicator */}
                  <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card transition-all ${
                    like.isOnline 
                      ? 'bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50' 
                      : 'bg-destructive'
                  }`} />
                </button>
              </div>

              {/* Content Section */}
              <div className="flex-1 min-w-0 space-y-2">
                <button
                  onClick={() => handleViewProfile(like.id, like.name)}
                  className="text-left hover:underline focus:outline-none focus:underline group/name"
                >
                  <h3 className="text-base font-bold uppercase group-hover/name:text-primary transition-colors">
                    {like.name}
                  </h3>
                </button>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
                    <Users className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{like.stats.friends.toLocaleString()} Friends</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
                    <Heart className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{like.stats.likes.toLocaleString()} Likes</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-primary/80 italic">
                    <UserPlus className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{like.stats.followers.toLocaleString()} Followers</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-primary/80 italic">
                    <EyeIcon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{like.stats.following.toLocaleString()} Following</span>
                  </div>
                </div>

                {/* Like Count Info */}
                <p className="text-sm text-foreground">
                  Has given {userName} <span className="font-semibold text-primary">{like.likeCount} Like{like.likeCount !== 1 ? 's' : ''}</span>
                </p>
                
                {like.isContentCreator && (
                  <Badge variant="outline" className="text-xs text-primary/70 italic border-primary/30">
                    Upcoming Content Creator
                  </Badge>
                )}

                {/* Action Button */}
                <div className="pt-1">
                  <Button
                    onClick={() => handleViewProfile(like.id, like.name)}
                    className="bg-success hover:bg-success/90 text-success-foreground hover:scale-105 transition-transform"
                    size="sm"
                  >
                    <Eye className="h-4 w-4" />
                    View Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Insert Premium Ad after every 4 likes */}
            {(index + 1) % 4 === 0 && index < mockLikes.length - 1 && (
              <div className="col-span-full p-4 bg-muted/30">
                <PremiumAdRotation
                  slotId={`likes-premium-${Math.floor((index + 1) / 4)}`}
                  ads={getRandomAdSlot(likesAdSlots)}
                  context="feed"
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </Card>
    </div>
  );
};
