import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { executivePositions, adhocCommittees, memberLevels } from "@/data/leadershipChangeHistory";
import { changeReasonLabels, CommitteeType, ChangeReason } from "@/types/leadershipManagement";
import { Search, Plus } from "lucide-react";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  committee: CommitteeType;
}

export function AddMemberDialog({ open, onOpenChange, committee }: AddMemberDialogProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [position, setPosition] = useState("");
  const [level, setLevel] = useState("");
  const [adhocCommittee, setAdhocCommittee] = useState("");
  const [reason, setReason] = useState<ChangeReason>("appointment");
  const [tenureStart, setTenureStart] = useState("");
  const [tenureEnd, setTenureEnd] = useState("");
  const [notes, setNotes] = useState("");

  const mockSearchResults = [
    { id: "m1", name: "Chief Emmanuel Obi", email: "emmanuel@example.com" },
    { id: "m2", name: "Dr. Ngozi Eze", email: "ngozi@example.com" },
    { id: "m3", name: "Mr. Peter Okoro", email: "peter@example.com" },
    { id: "m4", name: "Mrs. Ada Okonkwo", email: "ada@example.com" },
  ];

  const filteredResults = searchQuery.length > 0 
    ? mockSearchResults.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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
      description: `New ${committee} member has been added successfully`,
    });
    
    // Reset form
    setSearchQuery("");
    setSelectedMember("");
    setPosition("");
    setLevel("");
    setAdhocCommittee("");
    setReason("appointment");
    setTenureStart("");
    setTenureEnd("");
    setNotes("");
    onOpenChange(false);
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
          {/* Member Search */}
          <div className="space-y-2">
            <Label>Search Member</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {filteredResults.length > 0 && !selectedMember && (
              <div className="border rounded-md max-h-32 overflow-y-auto">
                {filteredResults.map((member) => (
                  <button
                    key={member.id}
                    className="w-full px-3 py-2 text-left hover:bg-accent text-sm"
                    onClick={() => {
                      setSelectedMember(member.name);
                      setSearchQuery(member.name);
                    }}
                  >
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.email}</div>
                  </button>
                ))}
              </div>
            )}
            
            {selectedMember && (
              <p className="text-sm text-primary">Selected: {selectedMember}</p>
            )}
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label>Position *</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger>
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
                <SelectTrigger>
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
                <SelectTrigger>
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
              />
            </div>
            <div className="space-y-2">
              <Label>Tenure End</Label>
              <Input 
                type="month"
                value={tenureEnd}
                onChange={(e) => setTenureEnd(e.target.value)}
              />
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label>Reason for Appointment</Label>
            <Select value={reason} onValueChange={(v) => setReason(v as ChangeReason)}>
              <SelectTrigger>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
