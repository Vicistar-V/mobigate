import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { StaffFormDialog, StaffRecord } from "./StaffFormDialog";
import { Plus, Briefcase, Loader2, RefreshCw, Pencil, Trash2, UserX, UserCheck } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const API = "/api/community";

interface StaffApiRow extends StaffRecord {
  status: "active" | "inactive";
}

const deptColor: Record<string, string> = {
  management: "bg-purple-100 text-purple-700",
  administrative: "bg-blue-100 text-blue-700",
  support: "bg-gray-100 text-gray-600",
};

interface ManageStaffSectionProps {
  communityId?: string;
  onActivityLogged?: (action: string, target: string) => void;
}

export function ManageStaffSection({ communityId, onActivityLogged }: ManageStaffSectionProps) {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffApiRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [deptFilter, setDeptFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffApiRow | null>(null);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffApiRow | null>(null);
  const [removing, setRemoving] = useState(false);

  const loadData = useCallback(() => {
    if (!communityId) return;
    setLoading(true);
    fetch(`${API}/staff.php?community_id=${communityId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setStaff(d.staff ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [communityId]);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleStatus = async (member: StaffApiRow) => {
    const newStatus = member.status === "active" ? "inactive" : "active";
    try {
      await fetch(`${API}/staff.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_staff_status", community_id: communityId, id: member.id, status: newStatus }),
      });
      toast({ title: newStatus === "active" ? "Marked Active" : "Marked Inactive", description: member.full_name });
      onActivityLogged?.(newStatus === "active" ? "reactivated staff member" : "deactivated staff member", member.full_name);
      loadData();
    } catch {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const confirmRemove = async () => {
    if (!selectedStaff) return;
    setRemoving(true);
    try {
      await fetch(`${API}/staff.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_staff", community_id: communityId, id: selectedStaff.id }),
      });
      toast({ title: "Staff Removed", description: selectedStaff.full_name });
      onActivityLogged?.("removed staff member", selectedStaff.full_name);
      setShowRemoveAlert(false);
      setSelectedStaff(null);
      loadData();
    } catch {
      toast({ title: "Failed to remove", variant: "destructive" });
    } finally {
      setRemoving(false);
    }
  };

  const filteredStaff = deptFilter === "all" ? staff : staff.filter((s) => s.department === deptFilter);

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <span className="font-semibold text-base">Staff & Employees</span>
          <Badge variant="secondary" className="text-sm">{staff.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="h-9 px-2" onClick={loadData} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Button size="sm" onClick={() => { setEditingStaff(null); setShowForm(true); }} className="h-9">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      <Select value={deptFilter} onValueChange={setDeptFilter}>
        <SelectTrigger className="w-full h-11 text-sm">
          <SelectValue placeholder="Filter by department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments ({staff.length})</SelectItem>
          <SelectItem value="management">Management</SelectItem>
          <SelectItem value="administrative">Administrative</SelectItem>
          <SelectItem value="support">Support</SelectItem>
        </SelectContent>
      </Select>

      {loading && staff.length === 0 ? (
        <div className="flex justify-center py-10"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : filteredStaff.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No staff in this department yet</p>
          <Button size="sm" className="mt-3" onClick={() => { setEditingStaff(null); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Staff
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStaff.map((member) => (
            <Card key={member.id} className={cn(member.status === "inactive" && "opacity-60")}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-14 w-14 shrink-0">
                    <AvatarImage src={member.photo_url || undefined} alt={member.full_name} />
                    <AvatarFallback className="text-lg">{(member.full_name || "U")[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base leading-tight">{member.full_name}</h4>
                    <p className="text-sm text-primary mt-0.5">{member.position_title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className={cn("text-xs capitalize", deptColor[member.department])}>{member.department}</Badge>
                      {member.status === "inactive" && <Badge variant="outline" className="text-xs text-muted-foreground">Inactive</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingStaff(member); setShowForm(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStatus(member)} title={member.status === "active" ? "Mark inactive" : "Mark active"}>
                      {member.status === "active" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => { setSelectedStaff(member); setShowRemoveAlert(true); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <StaffFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        communityId={communityId}
        staff={editingStaff}
        onSaved={() => {
          loadData();
          onActivityLogged?.(editingStaff ? "updated staff member" : "added staff member", editingStaff?.full_name || "New staff");
        }}
      />

      <AlertDialog open={showRemoveAlert} onOpenChange={setShowRemoveAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently remove {selectedStaff?.full_name}? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove} disabled={removing} className="bg-destructive text-destructive-foreground">
              {removing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
