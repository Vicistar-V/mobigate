import { useState } from "react";
import { X, Search, MessageCircle, Circle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockOnlineMembers } from "@/data/membershipData";
import { useToast } from "@/hooks/use-toast";

interface ChatMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatMembersDialog({ open, onOpenChange }: ChatMembersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredMembers = mockOnlineMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineMembers = filteredMembers.filter(m => m.isOnline);
  const offlineMembers = filteredMembers.filter(m => !m.isOnline);

  const handleStartChat = (memberName: string) => {
    toast({
      title: "Starting Chat",
      description: `Opening chat with ${memberName}...`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Chat with Members</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 pt-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[50vh]">
            <div className="space-y-4">
              {/* Online Members */}
              {onlineMembers.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                    <h3 className="font-semibold text-sm">Online ({onlineMembers.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {onlineMembers.map((member) => (
                      <MemberRow
                        key={member.id}
                        member={member}
                        onStartChat={handleStartChat}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Offline Members */}
              {offlineMembers.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Circle className="h-3 w-3 fill-muted text-muted" />
                    <h3 className="font-semibold text-sm">Offline ({offlineMembers.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {offlineMembers.map((member) => (
                      <MemberRow
                        key={member.id}
                        member={member}
                        onStartChat={handleStartChat}
                      />
                    ))}
                  </div>
                </div>
              )}

              {filteredMembers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No members found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MemberRow({ 
  member, 
  onStartChat 
}: { 
  member: typeof mockOnlineMembers[0];
  onStartChat: (name: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        {member.isOnline && (
          <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500 border-2 border-background" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{member.name}</p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">{member.lastSeen}</p>
          {member.role && (
            <Badge variant="outline" className="text-xs px-1 py-0">
              {member.role}
            </Badge>
          )}
        </div>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={() => onStartChat(member.name)}
        className="flex-shrink-0"
      >
        <MessageCircle className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Chat</span>
      </Button>
    </div>
  );
}
