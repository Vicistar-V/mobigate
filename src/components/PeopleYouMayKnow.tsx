import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Users, Grid3x3, List, Check, MoreVertical, ThumbsUp, MessageCircle, Phone, Gift, Ban, Flag, UserMinus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AddToCircleDialog } from "./AddToCircleDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import sarahJohnson from "@/assets/profile-sarah-johnson.jpg";
import michaelChen from "@/assets/profile-michael-chen.jpg";
import emilyDavis from "@/assets/profile-emily-davis.jpg";
import jamesWilson from "@/assets/profile-james-wilson.jpg";
import lisaAnderson from "@/assets/profile-lisa-anderson.jpg";
import davidMartinez from "@/assets/profile-david-martinez.jpg";
import jenniferTaylor from "@/assets/profile-jennifer-taylor.jpg";
import robertBrown from "@/assets/profile-robert-brown.jpg";

interface SuggestedUser {
  id: string;
  name: string;
  profileImage?: string;
  mutualFriends?: number;
}

const suggestedUsers: SuggestedUser[] = [
  { id: "2", name: "Sarah Johnson", profileImage: sarahJohnson, mutualFriends: 5 },
  { id: "3", name: "Michael Chen", profileImage: michaelChen, mutualFriends: 3 },
  { id: "4", name: "Emily Davis", profileImage: emilyDavis, mutualFriends: 8 },
  { id: "5", name: "James Wilson", profileImage: jamesWilson, mutualFriends: 2 },
  { id: "6", name: "Lisa Anderson", profileImage: lisaAnderson, mutualFriends: 6 },
  { id: "7", name: "David Martinez", profileImage: davidMartinez, mutualFriends: 4 },
  { id: "8", name: "Jennifer Taylor", profileImage: jenniferTaylor, mutualFriends: 7 },
  { id: "9", name: "Robert Brown", profileImage: robertBrown, mutualFriends: 1 },
];

export const PeopleYouMayKnow = () => {
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [friendRequestStatus, setFriendRequestStatus] = useState<Record<string, boolean>>({});
  const [addedToCircleStatus, setAddedToCircleStatus] = useState<Record<string, boolean>>({});
  const [circleDialogOpen, setCircleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const { toast } = useToast();

  const handleAddFriend = (userId: string, userName: string) => {
    setFriendRequestStatus((prev) => ({ ...prev, [userId]: true }));
    toast({
      title: "Friend request sent",
      description: `Friend request sent to ${userName}`,
    });
  };

  const handleAddToCircle = (userId: string, userName: string) => {
    setSelectedUser({ id: userId, name: userName });
    setCircleDialogOpen(true);
  };

  const handleCircleComplete = (userId: string) => {
    setAddedToCircleStatus((prev) => ({ ...prev, [userId]: true }));
  };

  const handleFollow = (userId: string, userName: string) => {
    toast({
      title: "Following",
      description: `You are now following ${userName}`,
    });
  };

  const handleLike = (userId: string, userName: string) => {
    toast({
      title: "Liked",
      description: `You liked ${userName}'s profile`,
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

  const handleBlock = (userId: string, userName: string) => {
    toast({
      title: "Blocked",
      description: `You blocked ${userName}`,
      variant: "destructive",
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
    <>
      <Card className="p-4 space-y-4 hover:shadow-md transition-shadow overflow-hidden">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">People you may know</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode(viewMode === "carousel" ? "grid" : "carousel")}
            className="h-8 w-8"
          >
            {viewMode === "carousel" ? <Grid3x3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Button>
        </div>
        
        {viewMode === "carousel" ? (
          <div className="relative w-full">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent snap-x snap-mandatory">
              {suggestedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex-shrink-0 w-[140px] space-y-2 snap-start"
                >
                  <Link to={`/profile/${user.id}`} className="block">
                    <Avatar className="h-32 w-full aspect-[3/4] rounded-lg border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                      <AvatarImage src={user.profileImage} alt={user.name} className="object-cover" />
                      <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Link>
                  
                  <div className="text-center">
                    <Link 
                      to={`/profile/${user.id}`}
                      className="font-medium text-base hover:text-primary transition-colors line-clamp-2"
                    >
                      {user.name}
                    </Link>
                    {user.mutualFriends && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {user.mutualFriends} mutual
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <Button 
                      size="sm" 
                      className="w-full h-8 text-sm"
                      variant={friendRequestStatus[user.id] ? "secondary" : "default"}
                      onClick={() => handleAddFriend(user.id, user.name)}
                      disabled={friendRequestStatus[user.id]}
                    >
                      {friendRequestStatus[user.id] ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-3 w-3 mr-1" />
                          Add Friend
                        </>
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          size="sm" 
                          className="w-full h-8 text-sm"
                          variant="outline"
                        >
                          <MoreVertical className="h-3 w-3 mr-1" />
                          Do More
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-card z-50">
                        <DropdownMenuItem
                          onClick={() => handleFollow(user.id, user.name)}
                          className="cursor-pointer"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Follow
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleLike(user.id, user.name)}
                          className="cursor-pointer"
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Like
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
                          Block
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
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="space-y-2">
                <Link to={`/profile/${user.id}`} className="block">
                  <Avatar className="h-40 w-full aspect-[3/4] rounded-lg border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                    <AvatarImage src={user.profileImage} alt={user.name} className="object-cover" />
                    <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                
                <div className="text-center">
                  <Link 
                    to={`/profile/${user.id}`}
                    className="font-medium text-base hover:text-primary transition-colors line-clamp-2"
                  >
                    {user.name}
                  </Link>
                  {user.mutualFriends && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {user.mutualFriends} mutual
                    </p>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <Button 
                    size="sm" 
                    className="w-full h-8 text-sm"
                    variant={friendRequestStatus[user.id] ? "secondary" : "default"}
                    onClick={() => handleAddFriend(user.id, user.name)}
                    disabled={friendRequestStatus[user.id]}
                  >
                    {friendRequestStatus[user.id] ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Request Sent
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3 w-3 mr-1" />
                        Add Friend
                      </>
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        size="sm" 
                        className="w-full h-8 text-sm"
                        variant="outline"
                      >
                        <MoreVertical className="h-3 w-3 mr-1" />
                        Do More
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-card z-50">
                      <DropdownMenuItem
                        onClick={() => handleFollow(user.id, user.name)}
                        className="cursor-pointer"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleLike(user.id, user.name)}
                        className="cursor-pointer"
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Like
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
                        Block
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
            ))}
          </div>
        )}
      </Card>

      <AddToCircleDialog
        open={circleDialogOpen}
        onOpenChange={setCircleDialogOpen}
        userName={selectedUser?.name || ""}
        onComplete={() => selectedUser && handleCircleComplete(selectedUser.id)}
      />
    </>
  );
};
