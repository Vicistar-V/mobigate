import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFriendsList } from "@/hooks/useWindowData";
import { mockFriends as fallbackFriends } from "@/data/profileData";

export interface Friend {
  id: string;
  name: string;
  username: string;
  profileImage?: string;
}

// Mock friends data - in real app this would come from backend API
const mockFriends: Friend[] = [
  { id: "f1", name: "Sarah Wilson", username: "@sarahw", profileImage: "/profile-sarah-johnson.jpg" },
  { id: "f2", name: "David Martinez", username: "@davidm", profileImage: "/profile-david-martinez.jpg" },
  { id: "f3", name: "Emily Davis", username: "@emilyd", profileImage: "/profile-emily-davis.jpg" },
  { id: "f4", name: "James Wilson", username: "@jamesw", profileImage: "/profile-james-wilson.jpg" },
  { id: "f5", name: "Lisa Anderson", username: "@lisaa", profileImage: "/profile-lisa-anderson.jpg" },
  { id: "f6", name: "Robert Brown", username: "@robertb", profileImage: "/profile-robert-brown.jpg" },
  { id: "f7", name: "Jennifer Taylor", username: "@jennifert", profileImage: "/profile-jennifer-taylor.jpg" },
  { id: "f8", name: "Michael Chen", username: "@michaelc", profileImage: "/profile-michael-chen.jpg" },
];

interface FriendsListSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (friend: Friend) => void;
  selectedFriendId?: string;
}

export const FriendsListSearch = ({ open, onOpenChange, onSelect, selectedFriendId }: FriendsListSearchProps) => {
  const phpFriends = useFriendsList();
  const friends = phpFriends || fallbackFriends;
  const mockFriends: Friend[] = friends.map(f => ({ 
    id: f.id, 
    name: f.name, 
    username: `@${f.name.toLowerCase().replace(/\s+/g, '')}`,
    profileImage: f.avatar 
  }));
  
  const [tempSelected, setTempSelected] = useState<string | undefined>(selectedFriendId);

  const handleSelect = () => {
    const friend = mockFriends.find(f => f.id === tempSelected);
    if (friend) {
      onSelect(friend);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-base sm:text-lg">Select from Friends</DialogTitle>
        </DialogHeader>
        <Command className="border-none">
          <CommandInput placeholder="Search your friends..." className="h-10" />
          <CommandList className="max-h-[50vh] sm:max-h-[60vh]">
            <CommandEmpty>No friends found.</CommandEmpty>
            <CommandGroup>
              {mockFriends.map((friend) => (
                <CommandItem
                  key={friend.id}
                  value={`${friend.name} ${friend.username}`}
                  onSelect={() => setTempSelected(friend.id)}
                  className="py-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={friend.profileImage} alt={friend.name} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{friend.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{friend.username}</p>
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        tempSelected === friend.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="flex gap-2 p-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!tempSelected}
            className="flex-1"
          >
            Select
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
