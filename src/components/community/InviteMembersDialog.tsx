import { useState } from "react";
import { X, Search, Mail, Phone, Link as LinkIcon, Copy, Check, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { mockOnlineMembers } from "@/data/membershipData";
import { useToast } from "@/hooks/use-toast";

interface InviteMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMembersDialog({ open, onOpenChange }: InviteMembersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [inviteMessage, setInviteMessage] = useState("Join our amazing community on Mobigate!");
  const [emailList, setEmailList] = useState("");
  const [phoneList, setPhoneList] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();

  const inviteLink = "https://mobigate.com/invite/community123";

  const filteredMembers = mockOnlineMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSendInvites = () => {
    if (selectedMembers.length === 0) {
      toast({
        title: "No Members Selected",
        description: "Please select at least one member to invite",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Invitations Sent!",
      description: `${selectedMembers.length} invitation(s) sent successfully`,
    });
    setSelectedMembers([]);
  };

  const handleSendExternalInvites = () => {
    const emails = emailList.split(/[,\n]/).filter(e => e.trim());
    const phones = phoneList.split(/[,\n]/).filter(p => p.trim());

    if (emails.length === 0 && phones.length === 0) {
      toast({
        title: "No Contacts Provided",
        description: "Please provide at least one email or phone number",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Invitations Sent!",
      description: `Invitations sent to ${emails.length + phones.length} contact(s)`,
    });
    setEmailList("");
    setPhoneList("");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      toast({
        title: "Link Copied!",
        description: "Invitation link copied to clipboard",
      });
      setTimeout(() => setLinkCopied(false), 3000);
    } catch (error) {
      toast({
        title: "Failed to Copy",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Invite Members</DialogTitle>
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

        <Tabs defaultValue="mobigate" className="flex-1">
          <div className="px-4 sm:px-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="mobigate" className="text-xs sm:text-sm">
                Mobigate Users
              </TabsTrigger>
              <TabsTrigger value="external" className="text-xs sm:text-sm">
                External
              </TabsTrigger>
              <TabsTrigger value="link" className="text-xs sm:text-sm">
                Share Link
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[60vh]">
            <div className="p-4 sm:p-6">
              {/* Mobigate Users Tab */}
              <TabsContent value="mobigate" className="mt-0 space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search Mobigate users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <div>
                    <Label>Personalized Message</Label>
                    <Textarea
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      placeholder="Add a personal message to your invitation..."
                      rows={2}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Select members to invite ({selectedMembers.length} selected)
                  </p>

                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => handleToggleMember(member.id)}
                      />

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
                  ))}

                  {filteredMembers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No members found
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleSendInvites}
                  disabled={selectedMembers.length === 0}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send {selectedMembers.length} Invitation(s)
                </Button>
              </TabsContent>

              {/* External Invites Tab */}
              <TabsContent value="external" className="mt-0 space-y-4">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Addresses
                      </Label>
                      <Textarea
                        placeholder="Enter email addresses (comma or line separated)&#10;example@email.com, another@email.com"
                        value={emailList}
                        onChange={(e) => setEmailList(e.target.value)}
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        Separate multiple emails with commas or new lines
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Numbers
                      </Label>
                      <Textarea
                        placeholder="Enter phone numbers (comma or line separated)&#10;+2348012345678, +2347012345678"
                        value={phoneList}
                        onChange={(e) => setPhoneList(e.target.value)}
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        Separate multiple phone numbers with commas or new lines
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Invitation Message</Label>
                      <Textarea
                        value={inviteMessage}
                        onChange={(e) => setInviteMessage(e.target.value)}
                        placeholder="Add a personal message..."
                        rows={2}
                      />
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={handleSendExternalInvites}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Invitations
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Share Link Tab */}
              <TabsContent value="link" className="mt-0">
                <Card>
                  <CardContent className="p-4 sm:p-6 space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Share Invitation Link</h3>
                      <p className="text-sm text-muted-foreground">
                        Anyone with this link can request to join the community
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label>Invitation Link</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={inviteLink} 
                          readOnly 
                          className="font-mono text-xs"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyLink}
                        >
                          {linkCopied ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Share via Social Media</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full">
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Phone className="h-4 w-4 mr-2" />
                          SMS
                        </Button>
                        <Button variant="outline" className="w-full">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>
                        <Button variant="outline" className="w-full">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Messenger
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
