import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users } from "lucide-react";
import { useFriendsList } from "@/hooks/useWindowData";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

interface ChatWithFriendsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChatWithFriendsDialog = ({ 
  open, 
  onOpenChange 
}: ChatWithFriendsDialogProps) => {
  const phpFriends = useFriendsList();
  
  // Fallback mock friends data if PHP data isn't available
  const mockFriends: Friend[] = [
    { id: "friend-1", name: "Sarah Johnson", avatar: "/placeholder.svg", isOnline: true },
    { id: "friend-2", name: "Michael Chen", avatar: "/placeholder.svg", isOnline: true },
    { id: "friend-3", name: "Emily Davis", avatar: "/placeholder.svg", isOnline: false },
    { id: "friend-4", name: "James Wilson", avatar: "/placeholder.svg", isOnline: true },
    { id: "friend-5", name: "Lisa Anderson", avatar: "/placeholder.svg", isOnline: false },
  ];
  
  const friends = phpFriends || mockFriends;

  const handleSelectFriend = (friendId: string, friendName: string) => {
    // Trigger the chat sheet to open with this friend
    window.dispatchEvent(new CustomEvent('openChatWithUser', {
      detail: { 
        userId: friendId,
        userName: friendName 
      }
    }));
    
    // Close the dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 max-h-[80vh]">
        <DialogHeader className="px-4 pt-4 pb-2 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5 text-primary" />
            Chat with Friends
          </DialogTitle>
          <DialogDescription className="text-sm">
            Select a friend to start chatting
          </DialogDescription>
        </DialogHeader>
        
        <Command className="border-none">
          <CommandInput 
            placeholder="Search friends..." 
            className="h-10 border-b"
          />
          <CommandList className="max-h-[50vh]">
            <CommandEmpty>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No friends found</p>
              </div>
            </CommandEmpty>
            <CommandGroup heading={`${friends.length} Friends Available`}>
              {friends.map((friend) => (
                <CommandItem
                  key={friend.id}
                  value={`${friend.name}`}
                  onSelect={() => handleSelectFriend(friend.id, friend.name)}
                  className="py-3 cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-border">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback>
                          {friend.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online indicator */}
                      {friend.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-base">
                        {friend.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {friend.isOnline ? (
                          <span className="text-emerald-600">● Online</span>
                        ) : (
                          <span>Offline</span>
                        )}
                      </p>
                    </div>
                    
                    <MessageCircle className="h-5 w-5 text-primary shrink-0" />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        
        <div className="p-4 border-t bg-muted/20">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
