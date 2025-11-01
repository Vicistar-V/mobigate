import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFriendsList } from "@/hooks/useWindowData";
import { mockFriends as fallbackFriends } from "@/data/profileData";

export interface MobigateUser {
  id: string;
  name: string;
  username: string;
  profileImage?: string;
}

interface MobigateUserSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (user: MobigateUser) => void;
  selectedUserId?: string;
}

export const MobigateUserSearch = ({ open, onOpenChange, onSelect, selectedUserId }: MobigateUserSearchProps) => {
  const phpFriends = useFriendsList();
  const friends = phpFriends || fallbackFriends;
  const mockMobigateUsers: MobigateUser[] = friends.map(f => ({ 
    id: f.id, 
    name: f.name, 
    username: `@${f.name.toLowerCase().replace(/\s+/g, '')}`,
    profileImage: f.avatar 
  }));
  
  const [tempSelected, setTempSelected] = useState<string | undefined>(selectedUserId);

  const handleSelect = () => {
    const user = mockMobigateUsers.find(u => u.id === tempSelected);
    if (user) {
      onSelect(user);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-base sm:text-lg">Search Mobigate Users</DialogTitle>
        </DialogHeader>
        <Command className="border-none">
          <CommandInput placeholder="Search by name or username..." className="h-10" />
          <CommandList className="max-h-[50vh] sm:max-h-[60vh]">
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {mockMobigateUsers.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.name} ${user.username}`}
                  onSelect={() => setTempSelected(user.id)}
                  className="py-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.username}</p>
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        tempSelected === user.id ? "opacity-100" : "opacity-0"
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
