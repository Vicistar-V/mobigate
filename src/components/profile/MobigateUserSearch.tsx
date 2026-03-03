import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Check, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
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
  /** Single-select callback (backward compat) */
  onSelect: (user: MobigateUser) => void;
  selectedUserId?: string;
  /** Enable multi-select mode */
  multiSelect?: boolean;
  /** Multi-select callback */
  onSelectMultiple?: (users: MobigateUser[]) => void;
  /** Pre-selected user IDs for multi-select */
  selectedUserIds?: string[];
}

export const MobigateUserSearch = ({
  open,
  onOpenChange,
  onSelect,
  selectedUserId,
  multiSelect = false,
  onSelectMultiple,
  selectedUserIds = [],
}: MobigateUserSearchProps) => {
  const isMobile = useIsMobile();
  const phpFriends = useFriendsList();
  const friends = phpFriends || fallbackFriends;
  const mockMobigateUsers: MobigateUser[] = friends.map(f => ({
    id: f.id,
    name: f.name,
    username: `@${f.name.toLowerCase().replace(/\s+/g, '')}`,
    profileImage: f.avatar,
  }));

  // Single-select state
  const [tempSelected, setTempSelected] = useState<string | undefined>(selectedUserId);
  // Multi-select state
  const [multiSelected, setMultiSelected] = useState<Set<string>>(new Set(selectedUserIds));

  const handleSingleSelect = () => {
    const user = mockMobigateUsers.find(u => u.id === tempSelected);
    if (user) {
      onSelect(user);
      onOpenChange(false);
    }
  };

  const toggleMultiUser = (userId: string) => {
    setMultiSelected(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const handleMultiConfirm = () => {
    const users = mockMobigateUsers.filter(u => multiSelected.has(u.id));
    if (users.length > 0) {
      onSelectMultiple?.(users);
      onOpenChange(false);
    }
  };

  const content = (
    <>
      <Command className="border-none">
        <CommandInput placeholder="Search by name or username..." className="h-10" />
        <CommandList className="max-h-[50vh] sm:max-h-[60vh]">
          <CommandEmpty>No users found.</CommandEmpty>
          <CommandGroup>
            {mockMobigateUsers.map((user) => {
              const isSelected = multiSelect
                ? multiSelected.has(user.id)
                : tempSelected === user.id;

              return (
                <CommandItem
                  key={user.id}
                  value={`${user.name} ${user.username}`}
                  onSelect={() =>
                    multiSelect ? toggleMultiUser(user.id) : setTempSelected(user.id)
                  }
                  className={cn(
                    "py-3 touch-manipulation",
                    isSelected && "bg-primary/10"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.username}</p>
                    </div>
                    {multiSelect ? (
                      <div
                        className={cn(
                          "h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/40 bg-background"
                        )}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                      </div>
                    ) : (
                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isSelected ? "opacity-100 text-primary" : "opacity-0"
                        )}
                      />
                    )}
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
      <div className="flex gap-2 p-4 border-t">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="flex-1 h-11 rounded-xl touch-manipulation"
        >
          Cancel
        </Button>
        {multiSelect ? (
          <Button
            onClick={handleMultiConfirm}
            disabled={multiSelected.size === 0}
            className="flex-1 h-11 rounded-xl touch-manipulation"
          >
            <Users className="h-4 w-4 mr-1.5" />
            Select {multiSelected.size > 0 ? `(${multiSelected.size})` : ""}
          </Button>
        ) : (
          <Button
            onClick={handleSingleSelect}
            disabled={!tempSelected}
            className="flex-1 h-11 rounded-xl touch-manipulation"
          >
            Select
          </Button>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] flex flex-col overflow-hidden touch-auto">
          <DrawerHeader className="pb-2 border-b shrink-0">
            <DrawerTitle className="text-base flex items-center gap-2">
              {multiSelect && <Users className="h-4 w-4 text-primary" />}
              Search Mobigate Users
              {multiSelect && multiSelected.size > 0 && (
                <Badge className="bg-primary text-primary-foreground text-xs ml-auto">
                  {multiSelected.size} selected
                </Badge>
              )}
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto touch-auto overscroll-contain">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-base sm:text-lg flex items-center gap-2">
            {multiSelect && <Users className="h-4 w-4 text-primary" />}
            Search Mobigate Users
            {multiSelect && multiSelected.size > 0 && (
              <Badge className="bg-primary text-primary-foreground text-xs ml-auto">
                {multiSelected.size} selected
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
