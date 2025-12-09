import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { executivePositions, adhocCommittees, memberLevels } from "@/data/leadershipChangeHistory";
import { changeReasonLabels, CommitteeType, ChangeReason } from "@/types/leadershipManagement";
import { communityPeople } from "@/data/communityPeopleData";
import { mockOnlineMembers } from "@/data/membershipData";
import { Search, Plus, Check, Users } from "lucide-react";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  committee: CommitteeType;
}

interface MemberOption {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export function AddMemberDialog({ open, onOpenChange, committee }: AddMemberDialogProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<MemberOption | null>(null);
  const [position, setPosition] = useState("");
  const [level, setLevel] = useState("");
  const [adhocCommittee, setAdhocCommittee] = useState("");
  const [reason, setReason] = useState<ChangeReason>("appointment");
  const [tenureStart, setTenureStart] = useState("");
  const [tenureEnd, setTenureEnd] = useState("");
  const [notes, setNotes] = useState("");

  // Combine all community members into a comprehensive list
  const allMembers: MemberOption[] = useMemo(() => {
    const fromCommunityPeople = communityPeople.map(p => ({
      id: p.id,
      name: p.name,
      email: `${p.name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '')}@community.com`,
      avatar: p.imageUrl
    }));

    const fromOnlineMembers = mockOnlineMembers.map(m => ({
      id: m.id,
      name: m.name,
      email: `${m.name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '')}@community.com`,
      avatar: m.avatar
    }));

    // Remove duplicates by id
    const combined = [...fromCommunityPeople, ...fromOnlineMembers];
    const uniqueMembers = combined.filter((member, index, self) =>
      index === self.findIndex(m => m.id === member.id)
    );

    return uniqueMembers;
  }, []);

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return allMembers;
    
    const query = searchQuery.toLowerCase();
    return allMembers.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query)
    );
  }, [searchQuery, allMembers]);

  const handleSelectMember = (member: MemberOption) => {
    setSelectedMember(member);
  };

  const handleSubmit = () => {
    if (!selectedMember || !position || (committee === "adhoc" && !adhocCommittee)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Member Added",
      description: `${selectedMember.name} has been added as ${position}`,
    });
    
    // Reset form
    setSearchQuery("");
    setSelectedMember(null);
    setPosition("");
    setLevel("");
    setAdhocCommittee("");
    setReason("appointment");
    setTenureStart("");
    setTenureEnd("");
    setNotes("");
    onOpenChange(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add {committee === "executive" ? "Executive" : "Ad-hoc"} Member
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Member Search & Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Member *</Label>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {allMembers.length} members
              </Badge>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11"
              />
            </div>

            {/* Selected Member Display */}
            {selectedMember && (
              <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials(selectedMember.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{selectedMember.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{selectedMember.email}</p>
                </div>
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
              </div>
            )}
            
            {/* Members List */}
            <ScrollArea className="h-[200px] border rounded-lg">
              <div className="p-1">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => {
                    const isSelected = selectedMember?.id === member.id;
                    return (
                      <button
                        key={member.id}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors min-h-[56px] ${
                          isSelected 
                            ? 'bg-primary/10 border border-primary/30' 
                            : 'hover:bg-accent active:bg-accent/80'
                        }`}
                        onClick={() => handleSelectMember(member)}
                      >
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                        </div>
                        {isSelected && (
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No members found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label>Position *</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {(committee === "executive" ? executivePositions : ["Chair", "Vice Chair", "Secretary", "Member"]).map((pos) => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ad-hoc Committee Selection */}
          {committee === "adhoc" && (
            <div className="space-y-2">
              <Label>Committee *</Label>
              <Select value={adhocCommittee} onValueChange={setAdhocCommittee}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select committee" />
                </SelectTrigger>
                <SelectContent>
                  {adhocCommittees.map((comm) => (
                    <SelectItem key={comm} value={comm}>{comm}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Level */}
          {committee === "executive" && (
            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {memberLevels.map((lvl) => (
                    <SelectItem key={lvl.value} value={lvl.value}>{lvl.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Tenure */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tenure Start</Label>
              <Input 
                type="month" 
                value={tenureStart}
                onChange={(e) => setTenureStart(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Tenure End</Label>
              <Input 
                type="month"
                value={tenureEnd}
                onChange={(e) => setTenureEnd(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label>Reason for Appointment</Label>
            <Select value={reason} onValueChange={(v) => setReason(v as ChangeReason)}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(changeReasonLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-11">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="h-11">
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
