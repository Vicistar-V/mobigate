import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const API = "/api/community";

export interface StaffRecord {
  id: string;
  full_name: string;
  position_title: string;
  department: "management" | "administrative" | "support";
  phone?: string | null;
  email?: string | null;
  photo_url?: string | null;
  start_date?: string | null;
  notes?: string | null;
}

interface StaffFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId?: string;
  staff?: StaffRecord | null; // null/undefined = create mode
  onSaved: () => void;
}

const emptyForm = {
  full_name: "",
  position_title: "",
  department: "administrative" as StaffRecord["department"],
  phone: "",
  email: "",
  photo_url: "",
  start_date: "",
  notes: "",
};

export function StaffFormDialog({ open, onOpenChange, communityId, staff, onSaved }: StaffFormDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (staff) {
      setForm({
        full_name: staff.full_name,
        position_title: staff.position_title,
        department: staff.department,
        phone: staff.phone || "",
        email: staff.email || "",
        photo_url: staff.photo_url || "",
        start_date: staff.start_date ? staff.start_date.slice(0, 10) : "",
        notes: staff.notes || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, staff]);

  const handleSubmit = async () => {
    if (!form.full_name.trim() || !form.position_title.trim()) {
      toast({ title: "Name and position are required", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/staff.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: staff ? "update_staff" : "create_staff",
          community_id: communityId,
          id: staff?.id,
          ...form,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Failed to save");
      toast({ title: staff ? "Staff Updated" : "Staff Added", description: form.full_name });
      onSaved();
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-3 border-b shrink-0">
          <DialogTitle>{staff ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1.5">
            <Label>Full Name *</Label>
            <Input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="e.g. Mr. Adebayo Johnson"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Position / Title *</Label>
            <Input
              value={form.position_title}
              onChange={(e) => setForm({ ...form, position_title: e.target.value })}
              placeholder="e.g. General Manager"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Department</Label>
            <Select value={form.department} onValueChange={(v: StaffRecord["department"]) => setForm({ ...form, department: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="management">Management</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Optional" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Optional" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Photo URL</Label>
            <Input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} placeholder="Optional image link" />
          </div>
          <div className="space-y-1.5">
            <Label>Start Date</Label>
            <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Optional" />
          </div>
        </div>
        <DialogFooter className="px-4 pb-4 pt-2 border-t shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
            {staff ? "Save Changes" : "Add Staff"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
