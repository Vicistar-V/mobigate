import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockLikes } from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { Eye, Users, Heart, UserPlus, Eye as EyeIcon, MoreVertical, ThumbsUp, MessageCircle, Phone, Gift, Ban, Flag, UserMinus } from "lucide-react";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { likesAdSlots } from "@/data/profileAds";
import { getRandomAdSlot } from "@/lib/adUtils";
import React from "react";
import { useState } from "react";

interface ProfileLikesTabProps {
  userName: string;
  userId?: string;
}

export const ProfileLikesTab = ({ userName }: ProfileLikesTabProps) => {
  const { toast } = useToast();
  const [interactions, setInteractions] = useState<{
    [key: string]: { isFollowing: boolean; isLiked: boolean; isBlocked: boolean };
  }>({});

  const handleViewProfile = (userId: string, name: string) => {
    toast({
      title: "Viewing Profile",
      description: `Opening ${name}'s profile...`,
    });
  };

  const handleToggleFollow = (userId: string, userName: string) => {
    const isFollowing = interactions[userId]?.isFollowing || false;
    setInteractions(prev => ({
      ...prev,
      [userId]: { ...prev[userId], isFollowing: !isFollowing }
    }));
    
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: `You are ${isFollowing ? 'no longer following' : 'now following'} ${userName}`,
    });
  };

  const handleToggleLike = (userId: string, userName: string) => {
    const isLiked = interactions[userId]?.isLiked || false;
    setInteractions(prev => ({
      ...prev,
      [userId]: { ...prev[userId], isLiked: !isLiked }
    }));
    
    toast({
      title: isLiked ? "Unliked" : "Liked",
      description: `You ${isLiked ? 'unliked' : 'liked'} ${userName}`,
    });
  };

  const handleChat = (userId: string, userName: string) => {
    toast({
      title: "Opening Chat",
      description: `Starting conversation with ${userName}`,
    });
  };

  const handleCall = (userId: string, userName: string) => {
    toast({
      title: "Calling",
      description: `Initiating call with ${userName}`,
    });
  };

  const handleSendGift = (userId: string, userName: string) => {
    toast({
      title: "Send Gift",
      description: `Opening gift store for ${userName}`,
    });
  };

  const handleAddToCircle = (userId: string, userName: string) => {
    toast({
      title: "Add to Circle",
      description: `Opening circle selection for ${userName}`,
    });
  };

  const handleBlock = (userId: string, userName: string) => {
    const isBlocked = interactions[userId]?.isBlocked || false;
    setInteractions(prev => ({
      ...prev,
      [userId]: { ...prev[userId], isBlocked: !isBlocked }
    }));
    
    toast({
      title: isBlocked ? "Unblocked" : "Blocked",
      description: `You ${isBlocked ? 'unblocked' : 'blocked'} ${userName}`,
      variant: isBlocked ? "default" : "destructive",
    });
  };

  const handleReport = (userId: string, userName: string) => {
    toast({
      title: "Report User",
      description: `Opening report form for ${userName}`,
      variant: "destructive",
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
                  <Avatar className={`h-20 w-20 sm:h-26 sm:w-26 ring-2 transition-all ${
                    like.isOnline ? 'ring-emerald-500/50' : 'ring-border'
                  }`}>
                    <AvatarImage src={like.avatar} alt={like.name} />
                    <AvatarFallback>{like.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  {/* Animated Online Indicator */}
                  <div className={`absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-card transition-all ${
                    like.isOnline 
                      ? 'bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50' 
                      : 'bg-destructive'
                  }`} />
                </button>
              </div>

              {/* Content Section */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="space-y-0.5">
                  <button
                    onClick={() => handleViewProfile(like.id, like.name)}
                    className="text-left hover:underline focus:outline-none focus:underline group/name"
                  >
                    <h3 className="text-base font-bold uppercase group-hover/name:text-primary transition-colors">
                      {like.name}
                    </h3>
                  </button>
                  
                  {like.isContentCreator && (
                    <div>
                      <Badge variant="outline" className="text-xs text-primary/70 italic border-primary/30 inline-block">
                        Upcoming Content Creator
                      </Badge>
                    </div>
                  )}
                </div>
                
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

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    onClick={() => handleViewProfile(like.id, like.name)}
                    className="bg-success hover:bg-success/90 text-success-foreground hover:scale-105 transition-transform"
                    size="sm"
                  >
                    <Eye className="h-4 w-4" />
                    View Profile
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:scale-105 transition-transform px-2"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Do More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-card z-50">
                      <DropdownMenuItem
                        onClick={() => handleToggleFollow(like.id, like.name)}
                        className="cursor-pointer"
                      >
                        {interactions[like.id]?.isFollowing ? (
                          <>
                            <UserMinus className="h-4 w-4 mr-2" />
                            Unfollow
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Follow
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleLike(like.id, like.name)}
                        className="cursor-pointer"
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        {interactions[like.id]?.isLiked ? 'Unlike' : 'Like'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleChat(like.id, like.name)}
                        className="cursor-pointer"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleCall(like.id, like.name)}
                        className="cursor-pointer"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSendGift(like.id, like.name)}
                        className="cursor-pointer"
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        Send Gift
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAddToCircle(like.id, like.name)}
                        className="cursor-pointer"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Add to Circle
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleBlock(like.id, like.name)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        {interactions[like.id]?.isBlocked ? 'Unblock' : 'Block'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleReport(like.id, like.name)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
