import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Users } from "lucide-react";
import { Link } from "react-router-dom";
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
  return (
    <Card className="p-4 space-y-4 hover:shadow-md transition-shadow overflow-hidden">
      <h3 className="font-semibold text-lg">People you may know</h3>
      
      <div className="relative w-full">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent snap-x snap-mandatory">
          {suggestedUsers.map((user) => (
            <div
              key={user.id}
              className="flex-shrink-0 w-[140px] space-y-2 snap-start"
            >
              <Link to={`/profile/${user.id}`} className="block">
                <Avatar className="h-28 w-28 mx-auto border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
                  variant="default"
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  Add Friend
                </Button>
                <Button 
                  size="sm" 
                  className="w-full h-8 text-xs"
                  variant="outline"
                >
                  <Users className="h-3 w-3 mr-1" />
                  Add to Circle
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
