import { useState } from "react";
import { X, Search, Ban, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { mockOnlineMembers, mockBlockedMembers } from "@/data/membershipData";
import { useToast } from "@/hooks/use-toast";

interface BlockMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlockMembersDialog({ open, onOpenChange }: BlockMembersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const { toast } = useToast();

  const filteredMembers = mockOnlineMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlockMember = (memberName: string) => {
    if (!blockReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for blocking this member",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Member Blocked",
      description: `${memberName} has been blocked`,
    });
    setBlockReason("");
  };

  const handleUnblockMember = (memberName: string) => {
    toast({
      title: "Member Unblocked",
      description: `${memberName} has been unblocked`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Block Management</DialogTitle>
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

        <Tabs defaultValue="blocked" className="flex-1">
          <div className="px-4 sm:px-6">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="blocked">Blocked Members</TabsTrigger>
              <TabsTrigger value="search">Block New</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[60vh]">
            <div className="p-4 sm:p-6">
              <TabsContent value="blocked" className="mt-0 space-y-3">
                {mockBlockedMembers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No blocked members
                  </div>
                ) : (
                  mockBlockedMembers.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div>
                              <p className="font-semibold text-sm">{member.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Blocked on {member.blockedDate.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="p-2 bg-muted rounded text-xs">
                              <p className="text-muted-foreground">
                                <strong>Reason:</strong> {member.reason}
                              </p>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnblockMember(member.name)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Unblock
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="search" className="mt-0 space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search members to block..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Reason for Blocking
                    </label>
                    <Textarea
                      placeholder="Please provide a reason for blocking this member..."
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <ScrollArea className="h-[35vh]">
                  <div className="space-y-2">
                    {filteredMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
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

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleBlockMember(member.name)}
                        >
                          <Ban className="h-3 w-3 mr-1" />
                          Block
                        </Button>
                      </div>
                    ))}

                    {filteredMembers.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No members found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
