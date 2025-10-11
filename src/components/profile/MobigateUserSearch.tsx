import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MobigateUser {
  id: string;
  name: string;
  username: string;
  profileImage?: string;
}

// Mock platform users data - in real app this would come from backend API
const mockMobigateUsers: MobigateUser[] = [
  { id: "u1", name: "John Doe", username: "@johndoe", profileImage: "/profile-photo.jpg" },
  { id: "u2", name: "Jane Smith", username: "@janesmith", profileImage: "/profile-sarah-johnson.jpg" },
  { id: "u3", name: "Michael Brown", username: "@mbrown", profileImage: "/profile-michael-chen.jpg" },
  { id: "u4", name: "Sarah Williams", username: "@sarahw", profileImage: "/profile-emily-davis.jpg" },
  { id: "u5", name: "David Martinez", username: "@davidm", profileImage: "/profile-david-martinez.jpg" },
  { id: "u6", name: "Emily Davis", username: "@emilyd", profileImage: "/profile-jennifer-taylor.jpg" },
  { id: "u7", name: "James Wilson", username: "@jamesw", profileImage: "/profile-james-wilson.jpg" },
  { id: "u8", name: "Lisa Anderson", username: "@lisaa", profileImage: "/profile-lisa-anderson.jpg" },
  { id: "u9", name: "Robert Brown", username: "@robertb", profileImage: "/profile-robert-brown.jpg" },
  { id: "u10", name: "Jennifer Taylor", username: "@jennifert", profileImage: "/profile-jennifer-taylor.jpg" },
  { id: "u11", name: "Michael Chen", username: "@michaelc", profileImage: "/profile-michael-chen.jpg" },
  { id: "u12", name: "Sarah Johnson", username: "@sarahj", profileImage: "/profile-sarah-johnson.jpg" },
  { id: "u13", name: "David Brown", username: "@davidb", profileImage: "/profile-david-martinez.jpg" },
  { id: "u14", name: "Emily Wilson", username: "@emilyw", profileImage: "/profile-emily-davis.jpg" },
  { id: "u15", name: "James Anderson", username: "@jamesa", profileImage: "/profile-james-wilson.jpg" },
];

interface MobigateUserSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (user: MobigateUser) => void;
  selectedUserId?: string;
}

export const MobigateUserSearch = ({ open, onOpenChange, onSelect, selectedUserId }: MobigateUserSearchProps) => {
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
