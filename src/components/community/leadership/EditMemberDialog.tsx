import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { executivePositions, adhocCommittees, memberLevels } from "@/data/leadershipChangeHistory";
import { changeReasonLabels, ChangeReason } from "@/types/leadershipManagement";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import { Pencil } from "lucide-react";

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: ExecutiveMember;
}

export function EditMemberDialog({ open, onOpenChange, member }: EditMemberDialogProps) {
  const { toast } = useToast();
  const [position, setPosition] = useState(member.position);
  const [level, setLevel] = useState(member.level || "");
  const [committee, setCommittee] = useState(member.committee || "");
  const [reason, setReason] = useState<ChangeReason>("manual");
  const [tenureStart, setTenureStart] = useState("");
  const [tenureEnd, setTenureEnd] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setPosition(member.position);
    setLevel(member.level || "");
    setCommittee(member.committee || "");
  }, [member]);

  const isAdhoc = !!member.committee;

  const handleSubmit = () => {
    toast({
      title: "Member Updated",
      description: `${member.name}'s information has been updated`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Edit Member
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Member Info Display */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.imageUrl} alt={member.name} />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{member.name}</h4>
              <p className="text-sm text-muted-foreground">Current: {member.position}</p>
            </div>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label>Position</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(isAdhoc ? ["Chair", "Vice Chair", "Secretary", "Member"] : executivePositions).map((pos) => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Committee (for ad-hoc) */}
          {isAdhoc && (
            <div className="space-y-2">
              <Label>Committee</Label>
              <Select value={committee} onValueChange={setCommittee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {adhocCommittees.map((comm) => (
                    <SelectItem key={comm} value={comm}>{comm}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Level (for executive) */}
          {!isAdhoc && (
            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
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
            <Label>Reason for Change</Label>
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
              placeholder="Reason for update..."
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
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
