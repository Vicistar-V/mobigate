import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Users, Grid3x3, List, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AddToCircleDialog } from "./AddToCircleDialog";
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

interface PeopleYouMayKnowProps {
  compact?: boolean;
}

export const PeopleYouMayKnow = ({ compact = false }: PeopleYouMayKnowProps) => {
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

  if (compact) {
    return (
      <>
        <Card className="p-4 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-sm mb-3">People you may know</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {suggestedUsers.slice(0, 4).map((user) => (
              <div key={user.id} className="flex-shrink-0 w-[120px] space-y-2">
                <Link to={`/profile/${user.id}`} className="block">
                  <Avatar className="h-20 w-full aspect-[3/4] rounded-lg border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <AvatarImage src={user.profileImage} alt={user.name} className="object-cover" />
                    <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="text-center">
                  <Link 
                    to={`/profile/${user.id}`}
                    className="font-medium text-xs hover:text-primary transition-colors line-clamp-2"
                  >
                    {user.name}
                  </Link>
                  {user.mutualFriends && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {user.mutualFriends} mutual
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Button 
                    size="sm" 
                    className="w-full h-7 text-[10px]"
                    variant={friendRequestStatus[user.id] ? "secondary" : "default"}
                    onClick={() => handleAddFriend(user.id, user.name)}
                    disabled={friendRequestStatus[user.id]}
                  >
                    {friendRequestStatus[user.id] ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Sent
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3 w-3 mr-1" />
                        Add Friend
                      </>
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    className="w-full h-7 text-[10px]"
                    variant={addedToCircleStatus[user.id] ? "secondary" : "outline"}
                    onClick={() => handleAddToCircle(user.id, user.name)}
                    disabled={addedToCircleStatus[user.id]}
                  >
                    {addedToCircleStatus[user.id] ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Added
                      </>
                    ) : (
                      <>
                        <Users className="h-3 w-3 mr-1" />
                        Add to Circle
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <AddToCircleDialog
          open={circleDialogOpen}
          onOpenChange={setCircleDialogOpen}
          userName={selectedUser?.name || ""}
          onComplete={() => selectedUser && handleCircleComplete(selectedUser.id)}
        />
      </>
    );
  }

  return (
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
                    className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
                  >
                    {user.name}
                  </Link>
                  {user.mutualFriends && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {user.mutualFriends} mutual
                    </p>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <Button 
                    size="sm" 
                    className="w-full h-8 text-xs"
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
                  <Button 
                    size="sm" 
                    className="w-full h-8 text-xs"
                    variant={addedToCircleStatus[user.id] ? "secondary" : "outline"}
                    onClick={() => handleAddToCircle(user.id, user.name)}
                    disabled={addedToCircleStatus[user.id]}
                  >
                    {addedToCircleStatus[user.id] ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Added to Circle
                      </>
                    ) : (
                      <>
                        <Users className="h-3 w-3 mr-1" />
                        Add to Circle
                      </>
                    )}
                  </Button>
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
                  className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
                >
                  {user.name}
                </Link>
                {user.mutualFriends && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {user.mutualFriends} mutual
                  </p>
                )}
              </div>
              
               <div className="space-y-1.5">
                <Button 
                  size="sm" 
                  className="w-full h-8 text-xs"
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
                <Button 
                  size="sm" 
                  className="w-full h-8 text-xs"
                  variant={addedToCircleStatus[user.id] ? "secondary" : "outline"}
                  onClick={() => handleAddToCircle(user.id, user.name)}
                  disabled={addedToCircleStatus[user.id]}
                >
                  {addedToCircleStatus[user.id] ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Added to Circle
                    </>
                  ) : (
                    <>
                      <Users className="h-3 w-3 mr-1" />
                      Add to Circle
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddToCircleDialog
        open={circleDialogOpen}
        onOpenChange={setCircleDialogOpen}
        userName={selectedUser?.name || ""}
        onComplete={() => selectedUser && handleCircleComplete(selectedUser.id)}
      />
    </Card>
  );
};
