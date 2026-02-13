import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { mockFriends } from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { useFriendsList } from "@/hooks/useWindowData";
import { UserPlus, Eye, Users, Heart, Clock, Check, MoreVertical, UserMinus, ThumbsUp, ThumbsDown, Gift, MessageCircle, Phone, Ban, Flag, Search } from "lucide-react";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { friendsAdSlots } from "@/data/profileAds";
import { getRandomAdSlot } from "@/lib/adUtils";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SendGiftDialog, GiftSelection } from "@/components/chat/SendGiftDialog";
import { AddFriendsDialog } from "@/components/community/AddFriendsDialog";
import { InviteMembersDialog } from "@/components/community/InviteMembersDialog";

interface ProfileFriendsTabProps {
  userName: string;
  userId?: string;
}

type FriendStatus = 'none' | 'pending' | 'friends';

interface FriendStatuses {
  [friendId: string]: FriendStatus;
}

interface FriendInteractions {
  [friendId: string]: {
    isFollowing: boolean;
    isLiked: boolean;
    isBlocked: boolean;
  };
}

export const ProfileFriendsTab = ({ userName }: ProfileFriendsTabProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const phpFriends = useFriendsList();
  const friends = phpFriends || mockFriends;
  const [friendStatuses, setFriendStatuses] = useState<FriendStatuses>({});
  const [interactions, setInteractions] = useState<FriendInteractions>({});
  const [giftDialogOpen, setGiftDialogOpen] = useState(false);
  const [selectedUserForGift, setSelectedUserForGift] = useState<{ name: string } | null>(null);
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [showInviteMembers, setShowInviteMembers] = useState(false);

  const handleAddFriend = (friendId: string, friendName: string) => {
    setFriendStatuses(prev => ({ ...prev, [friendId]: 'pending' }));
    
    toast({
      title: "Friend Request Sent",
      description: `Request sent to ${friendName}`,
      className: "bg-success/10 border-success",
    });
  };

  const handleViewUser = (friendId: string) => {
    navigate(`/profile/${friendId}`);
  };

  const handleToggleFollow = (friendId: string, friendName: string) => {
    const isFollowing = interactions[friendId]?.isFollowing || false;
    setInteractions(prev => ({
      ...prev,
      [friendId]: { ...prev[friendId], isFollowing: !isFollowing }
    }));
    
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: `You are ${isFollowing ? 'no longer following' : 'now following'} ${friendName}`,
    });
  };

  const handleToggleLike = (friendId: string, friendName: string) => {
    const isLiked = interactions[friendId]?.isLiked || false;
    setInteractions(prev => ({
      ...prev,
      [friendId]: { ...prev[friendId], isLiked: !isLiked }
    }));
    
    toast({
      title: isLiked ? "Unliked" : "Liked",
      description: `You ${isLiked ? 'unliked' : 'liked'} ${friendName}`,
    });
  };

  const handleSendGift = (friendId: string, friendName: string) => {
    setSelectedUserForGift({ name: friendName });
    setGiftDialogOpen(true);
  };

  const handleGiftSent = (giftData: GiftSelection) => {
    if (selectedUserForGift) {
      toast({
        title: "Gift Sent",
        description: `Gift sent to ${selectedUserForGift.name}!`,
      });
    }
    setGiftDialogOpen(false);
    setSelectedUserForGift(null);
  };

  const handleChat = (friendId: string, friendName: string) => {
    window.dispatchEvent(new CustomEvent('openChatWithUser', {
      detail: { 
        userId: friendId,
        userName: friendName 
      }
    }));
  };

  const handleCall = (friendId: string, friendName: string) => {
    toast({
      title: "Calling",
      description: `Initiating call with ${friendName}`,
    });
  };

  const handleBlock = (friendId: string, friendName: string) => {
    const isBlocked = interactions[friendId]?.isBlocked || false;
    setInteractions(prev => ({
      ...prev,
      [friendId]: { ...prev[friendId], isBlocked: !isBlocked }
    }));
    
    toast({
      title: isBlocked ? "Unblocked" : "Blocked",
      description: `You ${isBlocked ? 'unblocked' : 'blocked'} ${friendName}`,
      variant: isBlocked ? "default" : "destructive",
    });
  };

  const handleReport = (friendId: string, friendName: string) => {
    toast({
      title: "Report User",
      description: `Opening report form for ${friendName}`,
      variant: "destructive",
    });
  };

  const handleFindFriends = () => {
    setShowAddFriends(true);
  };

  const getFriendButtonConfig = (status: FriendStatus = 'none') => {
    const configs = {
      'none': {
        text: 'Add Friend',
        icon: UserPlus,
        className: 'bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105',
        disabled: false
      },
      'pending': {
        text: 'Request Sent',
        icon: Clock,
        className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        disabled: true
      },
      'friends': {
        text: 'Friends',
        icon: Check,
        className: 'bg-emerald-500 hover:bg-emerald-600 text-white',
        disabled: true
      }
    };
    return configs[status];
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Find & Invite Friends Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleFindFriends}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 sm:py-5 px-2 sm:px-4 text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="ml-1.5 sm:ml-2">Find Friend</span>
        </Button>
        <Button
          onClick={() => setShowInviteMembers(true)}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 sm:py-5 px-2 sm:px-4 text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="ml-1.5 sm:ml-2">Invite People</span>
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold uppercase">
          {friends.length} FRIENDS OF {userName}
        </h2>
        <p className="text-sm text-destructive italic">
          Users blocked by you and/or users that blocked you will not be displayed
        </p>
      </div>

      {/* Friends List */}
      <Card className="divide-y">
        {friends.map((friend, index) => {
          const buttonConfig = getFriendButtonConfig(friendStatuses[friend.id]);
          const ButtonIcon = buttonConfig.icon;
          
          return (
            <React.Fragment key={friend.id}>
              <div className="group p-4 flex flex-col gap-3 hover:bg-accent/5 transition-all duration-200">
                {/* Top Row: Avatar + Name/Stats */}
                <div className="flex gap-4">
                  {/* Avatar Section with Status Indicator */}
                  <div className="relative flex-shrink-0">
                    <button 
                      onClick={() => handleViewUser(friend.id)}
                      className="relative block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                      aria-label={`View ${friend.name}'s profile`}
                    >
                      <Avatar className={`h-24 w-24 sm:h-28 sm:w-28 ring-2 transition-all ${
                        friend.isOnline ? 'ring-emerald-500/50' : 'ring-border'
                      }`}>
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback>{friend.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      
                      {/* Animated Online Indicator */}
                      <div 
                        className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card transition-all ${
                          friend.isOnline 
                            ? 'bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50' 
                            : 'bg-destructive'
                        }`}
                        aria-label={friend.isOnline ? 'Online' : 'Offline'}
                      />
                    </button>
                  </div>

                  {/* Name and Stats Section */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <button
                      onClick={() => handleViewUser(friend.id)}
                      className="text-left hover:underline focus:outline-none focus:underline group/name"
                    >
                      <h3 className="text-base font-bold uppercase group-hover/name:text-primary transition-colors">
                        {friend.name}
                      </h3>
                    </button>
                    
                    {/* Enhanced Stats with Icons */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
                        <Users className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{friend.stats.friends.toLocaleString()} Friends</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
                        <Heart className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{friend.stats.likes.toLocaleString()} Likes</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-primary/80 italic">
                        <UserPlus className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{friend.stats.followers.toLocaleString()} Followers</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-primary/80 italic">
                        <Eye className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{friend.stats.following.toLocaleString()} Following</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Interactive Action Buttons */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddFriend(friend.id, friend.name)}
                      disabled={buttonConfig.disabled}
                      className={`${buttonConfig.className} flex-1`}
                      size="sm"
                    >
                      <ButtonIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">{buttonConfig.text}</span>
                      <span className="sm:hidden">{buttonConfig.text.split(' ')[0]}</span>
                    </Button>
                    
                    <Button
                      onClick={() => handleViewUser(friend.id)}
                      className="bg-success hover:bg-success/90 text-success-foreground hover:scale-105 transition-transform flex-1"
                      size="sm"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">View Profile</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:scale-105 transition-transform w-full"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span>Do More</span>
                      </Button>
                    </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-card z-50">
                        <DropdownMenuItem
                          onClick={() => handleToggleFollow(friend.id, friend.name)}
                          className="cursor-pointer"
                        >
                          {interactions[friend.id]?.isFollowing ? (
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
                          onClick={() => handleToggleLike(friend.id, friend.name)}
                          className="cursor-pointer"
                        >
                          {interactions[friend.id]?.isLiked ? (
                            <>
                              <ThumbsDown className="h-4 w-4 mr-2" />
                              Unlike
                            </>
                          ) : (
                            <>
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Like
                            </>
                          )}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem
                          onClick={() => handleChat(friend.id, friend.name)}
                          className="cursor-pointer"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem
                          onClick={() => handleCall(friend.id, friend.name)}
                          className="cursor-pointer"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem
                          onClick={() => handleSendGift(friend.id, friend.name)}
                          className="cursor-pointer"
                        >
                          <Gift className="h-4 w-4 mr-2" />
                          Send Gift
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem
                          onClick={() => {} /* Add to Circle functionality */}
                          className="cursor-pointer"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Add to Circle
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem
                          onClick={() => handleBlock(friend.id, friend.name)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          {interactions[friend.id]?.isBlocked ? 'Unblock' : 'Block'}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem
                          onClick={() => handleReport(friend.id, friend.name)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Flag className="h-4 w-4 mr-2" />
                          Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </div>

              {/* Insert Premium Ad after every 4 friends */}
              {(index + 1) % 4 === 0 && index < friends.length - 1 && (
                <div className="col-span-full p-4 bg-muted/30">
                  <PremiumAdRotation
                    slotId={`friends-premium-${Math.floor((index + 1) / 4)}`}
                    ads={getRandomAdSlot(friendsAdSlots)}
                    context="feed"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </Card>

      <SendGiftDialog
        isOpen={giftDialogOpen}
        onClose={() => {
          setGiftDialogOpen(false);
          setSelectedUserForGift(null);
        }}
        recipientName={selectedUserForGift?.name || ""}
        onSendGift={handleGiftSent}
      />

      <AddFriendsDialog
        open={showAddFriends}
        onOpenChange={setShowAddFriends}
      />

      <InviteMembersDialog
        open={showInviteMembers}
        onOpenChange={setShowInviteMembers}
      />
    </div>
  );
};
