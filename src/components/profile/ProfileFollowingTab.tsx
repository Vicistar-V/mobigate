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
import { mockFollowing } from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, UserCheck, Eye, Users, Heart, Eye as EyeIcon, MoreVertical, ThumbsUp, MessageCircle, Phone, Gift, Ban, Flag } from "lucide-react";
import { useState } from "react";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { followingAdSlots } from "@/data/profileAds";
import { getRandomAdSlot } from "@/lib/adUtils";
import React from "react";

interface ProfileFollowingTabProps {
  userName: string;
  userId?: string;
}

export const ProfileFollowingTab = ({ userName }: ProfileFollowingTabProps) => {
  const { toast } = useToast();
  const [followingStatus, setFollowingStatus] = useState<Map<string, boolean>>(
    new Map(mockFollowing.map(user => [user.id, true]))
  );
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [interactions, setInteractions] = useState<{
    [key: string]: { isLiked: boolean; isBlocked: boolean };
  }>({});

  const handleViewProfile = (userId: string, name: string) => {
    toast({
      title: "Viewing Profile",
      description: `Opening ${name}'s profile...`,
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
          {mockFollowing.length} USER{mockFollowing.length !== 1 ? 'S' : ''} FOLLOWED BY {userName}
        </h2>
        <p className="text-sm text-destructive italic">
          Users blocked by you and/or users that blocked you will not be displayed
        </p>
      </div>

      {/* Following List */}
      <Card className="divide-y">
        {mockFollowing.map((user, index) => {
          const isFollowing = followingStatus.get(user.id);
          const isHovered = hoveredUserId === user.id;
          
          return (
            <React.Fragment key={user.id}>
              <div className="group p-4 flex gap-4 hover:bg-accent/5 transition-all duration-200">
                {/* Avatar Section */}
                <div className="relative flex-shrink-0">
                  <button 
                    onClick={() => handleViewProfile(user.id, user.name)}
                    className="relative block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                  >
                    <Avatar className={`h-20 w-20 sm:h-26 sm:w-26 ring-2 transition-all ${
                      user.isOnline ? 'ring-emerald-500/50' : 'ring-border'
                    }`}>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    
                    {/* Animated Online Indicator */}
                    <div className={`absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-card transition-all ${
                      user.isOnline 
                        ? 'bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50' 
                        : 'bg-destructive'
                    }`} />
                  </button>
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="space-y-0.5">
                    <button
                      onClick={() => handleViewProfile(user.id, user.name)}
                      className="text-left hover:underline focus:outline-none focus:underline group/name"
                    >
                      <h3 className="text-base font-bold uppercase group-hover/name:text-primary transition-colors">
                        {user.name}
                      </h3>
                    </button>
                    
                    {user.isContentCreator && (
                      <div>
                        <Badge variant="outline" className="text-sm text-primary/70 italic border-primary/30 inline-block">
                          Upcoming Content Creator
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
                      <Users className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{user.stats.friends.toLocaleString()} Friends</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
                      <Heart className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{user.stats.likes.toLocaleString()} Likes</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-primary/80 italic">
                      <UserPlus className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{user.stats.followers.toLocaleString()} Followers</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-primary/80 italic">
                      <EyeIcon className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{user.stats.following.toLocaleString()} Following</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      onClick={() => handleFollowToggle(user.id, user.name)}
                      onMouseEnter={() => setHoveredUserId(user.id)}
                      onMouseLeave={() => setHoveredUserId(null)}
                      className={`${
                        isFollowing 
                          ? 'bg-success hover:bg-success/90 text-success-foreground' 
                          : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      } hover:scale-105 transition-all`}
                      size="sm"
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="h-4 w-4" />
                          {isHovered ? 'Unfollow' : 'Following'}
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          Follow
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleViewProfile(user.id, user.name)}
                      className="bg-success hover:bg-success/90 text-success-foreground hover:scale-105 transition-transform"
                      size="sm"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">View Profile</span>
                      <span className="sm:hidden">View</span>
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
                          onClick={() => handleToggleLike(user.id, user.name)}
                          className="cursor-pointer"
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          {interactions[user.id]?.isLiked ? 'Unlike' : 'Like'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleChat(user.id, user.name)}
                          className="cursor-pointer"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCall(user.id, user.name)}
                          className="cursor-pointer"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSendGift(user.id, user.name)}
                          className="cursor-pointer"
                        >
                          <Gift className="h-4 w-4 mr-2" />
                          Send Gift
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAddToCircle(user.id, user.name)}
                          className="cursor-pointer"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Add to Circle
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleBlock(user.id, user.name)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          {interactions[user.id]?.isBlocked ? 'Unblock' : 'Block'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleReport(user.id, user.name)}
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

              {/* Insert Premium Ad after every 4 users */}
              {(index + 1) % 4 === 0 && index < mockFollowing.length - 1 && (
                <div className="col-span-full p-4 bg-muted/30">
                  <PremiumAdRotation
                    slotId={`following-premium-${Math.floor((index + 1) / 4)}`}
                    ads={getRandomAdSlot(followingAdSlots)}
                    context="feed"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </Card>
    </div>
  );
};
