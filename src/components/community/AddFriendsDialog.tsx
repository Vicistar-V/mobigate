import { useState } from "react";
import { X, Search, UserPlus, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockOnlineMembers, suggestedFriends } from "@/data/membershipData";
import { useToast } from "@/hooks/use-toast";
import { MemberPreviewDialog } from "@/components/community/MemberPreviewDialog";
import { ExecutiveMember } from "@/data/communityExecutivesData";

interface AddFriendsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFriendsDialog({ open, onOpenChange }: AddFriendsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);
  const [showMemberPreview, setShowMemberPreview] = useState(false);
  const { toast } = useToast();

  const filteredMembers = mockOnlineMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendRequest = (memberId: string, memberName: string) => {
    setPendingRequests([...pendingRequests, memberId]);
    toast({
      title: "Friend Request Sent",
      description: `Friend request sent to ${memberName}`,
    });
  };

  const isPending = (memberId: string) => pendingRequests.includes(memberId);

  const convertToExecutiveMember = (member: { id: string; name: string; avatar: string; role?: string; joinDate?: Date }): ExecutiveMember => ({
    id: member.id,
    name: member.name,
    position: member.role || "Member",
    tenure: member.joinDate ? `Joined ${member.joinDate.toLocaleDateString()}` : "Member",
    imageUrl: member.avatar,
    level: "officer",
    committee: "executive"
  });

  const handleMemberClick = (member: { id: string; name: string; avatar: string; role?: string; joinDate?: Date }) => {
    setSelectedMember(convertToExecutiveMember(member));
    setShowMemberPreview(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Add Friends
            </DialogTitle>
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

        <Tabs defaultValue="suggested" className="flex-1">
          <div className="px-4 sm:px-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="suggested" className="text-xs sm:text-sm">
                Suggested
              </TabsTrigger>
              <TabsTrigger value="search" className="text-xs sm:text-sm">
                Search
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm">
                Pending
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[60vh]">
            <div className="p-4 sm:p-6">
              <TabsContent value="suggested" className="mt-0 space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  People you may know based on mutual connections
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestedFriends.map((friend) => (
                    <Card key={friend.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div 
                            className="cursor-pointer active:scale-95 transition-transform"
                            onClick={() => handleMemberClick(friend)}
                          >
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={friend.avatar} alt={friend.name} />
                              <AvatarFallback>
                                {friend.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>

                            <div className="space-y-1 mt-3">
                              <p className="font-semibold text-sm">{friend.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Joined {friend.joinDate?.toLocaleDateString()}
                              </p>
                              {friend.role && (
                                <Badge variant="outline" className="text-xs">
                                  {friend.role}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Button
                            size="sm"
                            className="w-full"
                            disabled={isPending(friend.id)}
                            onClick={() => handleSendRequest(friend.id, friend.name)}
                          >
                            {isPending(friend.id) ? (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Request Sent
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-3 w-3 mr-1" />
                                Add Friend
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="search" className="mt-0 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="space-y-2">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div 
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer active:scale-98 transition-transform"
                        onClick={() => handleMemberClick(member)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        disabled={isPending(member.id)}
                        onClick={() => handleSendRequest(member.id, member.name)}
                      >
                        {isPending(member.id) ? (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Sent
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-3 w-3 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  ))}

                  {filteredMembers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No members found
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="pending" className="mt-0">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending friend requests
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pendingRequests.map((requestId) => {
                      const member = [...mockOnlineMembers, ...suggestedFriends].find(
                        m => m.id === requestId
                      );
                      if (!member) return null;

                      return (
                        <Card key={requestId}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer active:scale-98 transition-transform"
                                onClick={() => handleMemberClick(member)}
                              >
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback>
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{member.name}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">
                                      Request pending
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <Badge variant="secondary" className="text-xs">
                                Pending
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>

      <MemberPreviewDialog
        member={selectedMember}
        open={showMemberPreview}
        onOpenChange={setShowMemberPreview}
      />
    </Dialog>
  );
}
