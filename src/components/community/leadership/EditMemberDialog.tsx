import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Loader2 } from "lucide-react";

const API = "/api/community";
interface Position { id: string; title: string; admin_number: number; holder_user_id?: string; holder_name?: string; }
interface EditableMember { id: string; name: string; position: string; position_id?: string; imageUrl?: string; profile_photo?: string; }

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: EditableMember;
  communityId?: string;
  positions?: Position[];
  onSaved?: () => void;
}

export function EditMemberDialog({ open, onOpenChange, member, communityId, positions = [], onSaved }: EditMemberDialogProps) {
  const { toast } = useToast();
  const [positionId,  setPositionId]  = useState(member.position_id ?? "");
  const [notes,       setNotes]       = useState("");
  const [submitting,  setSubmitting]  = useState(false);

  useEffect(() => { setPositionId(member.position_id ?? ""); setNotes(""); }, [member, open]);

  const handleSubmit = async () => {
    if (!positionId) { toast({ title: "Select a position", variant: "destructive" }); return; }
    if (!communityId) return;
    const pos = positions.find(p => p.id === positionId);
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/leadership.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assign_position", community_id: communityId, user_id: member.id, position_id: positionId, admin_rank: pos?.admin_number ?? 99, notes }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Failed to update");
      toast({ title: "Member Updated", description: `${member.name} assigned to ${pos?.title}` });
      onSaved?.();
      onOpenChange(false);
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
    finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Pencil className="h-5 w-5" /> Edit Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.imageUrl || member.profile_photo} alt={member.name} />
              <AvatarFallback>{(member.name || "U")[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{member.name}</h4>
              <p className="text-sm text-muted-foreground">Current: {member.position}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>New Position *</Label>
            <Select value={positionId} onValueChange={setPositionId}>
              <SelectTrigger><SelectValue placeholder="Select position…" /></SelectTrigger>
              <SelectContent>
                {positions.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title} {p.holder_name && p.holder_user_id !== member.id ? `(${p.holder_name})` : p.holder_user_id === member.id ? "(current)" : "(vacant)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea placeholder="Reason for change…" value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="resize-none" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting || !positionId}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
