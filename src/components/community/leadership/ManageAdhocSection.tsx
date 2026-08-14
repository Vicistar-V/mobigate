import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AddMemberDialog } from "./AddMemberDialog";
import { LeadershipMemberActionsMenu } from "./LeadershipMemberActionsMenu";
import { Plus, UserCog, Loader2, RefreshCw, CheckCircle, X as XIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const API = "/api/community";

interface AdhocCommittee {
  id: string; name: string; purpose?: string; status: string;
  member_count: number; created_at: string;
}
interface AdhocMember {
  id: string; user_id: string; name: string; profile_photo?: string;
  role: string; committee_id: string; committee_name?: string;
  imageUrl?: string; position?: string; tenure?: string;
  level?: string; committee?: string;
}

interface ManageAdhocSectionProps { communityId?: string; }

export function ManageAdhocSection({ communityId }: ManageAdhocSectionProps) {
  const { toast } = useToast();
  const [committees, setCommittees]      = useState<AdhocCommittee[]>([]);
  const [members,    setMembers]         = useState<AdhocMember[]>([]);
  const [allMembers, setAllMembers]      = useState<any[]>([]);   // from leadership.php, no admin gate
  const [loading,    setLoading]         = useState(false);
  const [committeeFilter, setCommitteeFilter] = useState("all");
  const [showAddDialog,   setShowAddDialog]   = useState(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [selectedMember,  setSelectedMember]  = useState<AdhocMember | null>(null);
  const [removing,        setRemoving]        = useState(false);

  const fetchData = useCallback(async () => {
    if (!communityId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/leadership.php?community_id=${communityId}`, { credentials: "include" });
      if (!res.ok) return;
      const d = await res.json();
      setCommittees(d.adhoc ?? []);
      if (d.members?.length) setAllMembers(d.members);
      const flat: AdhocMember[] = [];
      for (const c of (d.adhoc ?? [])) {
        if (c.members) {
          for (const m of c.members) {
            flat.push({ ...m, committee_id: c.id, committee_name: c.name, imageUrl: m.profile_photo || "/placeholder.svg", position: m.role || "Member", tenure: "", level: "staff", committee: "ad-hoc" });
          }
        }
      }
      setMembers(flat);
    } catch {}
    finally { setLoading(false); }

    // Also fetch members separately from manage_members.php (confirmed working)
    fetch(`${API}/manage_members.php?community_id=${communityId}`, { credentials: "include" })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => { if (d.members?.length) setAllMembers(d.members); })
      .catch(() => {});
  }, [communityId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusChange = async (committeeId: string, status: string) => {
    try {
      await fetch(`${API}/leadership.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_adhoc_status", community_id: communityId, committee_id: committeeId, status }),
      });
      toast({ title: "Status updated", description: `Committee marked as ${status}` });
      fetchData();
    } catch { toast({ title: "Failed to update status", variant: "destructive" }); }
  };

  const handleRemove = (member: AdhocMember) => { setSelectedMember(member); setShowRemoveAlert(true); };

  const confirmRemove = async () => {
    if (!selectedMember || !communityId) return;
    setRemoving(true);
    try {
      await fetch(`${API}/leadership.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove_adhoc_member", community_id: communityId, committee_id: selectedMember.committee_id, user_id: selectedMember.user_id }),
      });
      toast({ title: "Member Removed", description: `${selectedMember.name} removed from committee` });
      setShowRemoveAlert(false); setSelectedMember(null); fetchData();
    } catch { toast({ title: "Failed to remove", variant: "destructive" }); }
    finally { setRemoving(false); }
  };

  const activeCommittees  = committees.filter(c => c.status === "active");
  const filteredMembers   = committeeFilter === "all" ? members : members.filter(m => m.committee_id === committeeFilter);
  const filteredCommittees = committeeFilter === "all" ? activeCommittees : activeCommittees.filter(c => c.id === committeeFilter);

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <UserCog className="h-5 w-5 text-primary" />
          <span className="font-semibold text-base">Ad-hoc Committees</span>
          <Badge variant="secondary" className="text-sm">{activeCommittees.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="h-9 px-2" onClick={fetchData} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)} className="h-9">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Committee filter */}
      <Select value={committeeFilter} onValueChange={setCommitteeFilter}>
        <SelectTrigger className="w-full h-11 text-sm">
          <SelectValue placeholder="Filter by committee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Committees ({activeCommittees.length})</SelectItem>
          {activeCommittees.map(c => (
            <SelectItem key={c.id} value={c.id}>{c.name} ({c.member_count} members)</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {loading && committees.length === 0 ? (
        <div className="flex justify-center py-10"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : activeCommittees.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <UserCog className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No active ad-hoc committees</p>
          <Button size="sm" className="mt-3" onClick={() => setShowAddDialog(true)}><Plus className="h-4 w-4 mr-1" /> Create Committee</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCommittees.map(committee => (
            <div key={committee.id} className="space-y-2">
              {/* Committee header */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <span className="font-semibold text-sm">{committee.name}</span>
                  {committee.purpose && <p className="text-xs text-muted-foreground">{committee.purpose}</p>}
                </div>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="h-6 text-xs gap-1 text-green-600 border-green-200"
                    onClick={() => handleStatusChange(committee.id, "completed")}>
                    <CheckCircle className="h-3 w-3" /> Complete
                  </Button>
                  <Button size="sm" variant="outline" className="h-6 text-xs gap-1 text-destructive border-destructive/30"
                    onClick={() => handleStatusChange(committee.id, "disbanded")}>
                    <XIcon className="h-3 w-3" /> Disband
                  </Button>
                </div>
              </div>

              {/* Members of this committee */}
              {members.filter(m => m.committee_id === committee.id).length === 0 ? (
                <p className="text-xs text-muted-foreground px-1">No members yet — use Add to assign members.</p>
              ) : (
                members.filter(m => m.committee_id === committee.id).map(member => (
                  <Card key={member.id || member.user_id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 shrink-0">
                          <AvatarImage src={member.imageUrl || member.profile_photo} alt={member.name} />
                          <AvatarFallback>{(member.name || "U")[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm">{member.name}</h4>
                          <p className="text-xs text-primary">{member.role}</p>
                          <Badge variant="outline" className="text-xs mt-1">{committee.name}</Badge>
                        </div>
                        <LeadershipMemberActionsMenu
                          member={member as any}
                          onRemove={() => handleRemove(member)}
                          showAdminActions={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ))}
        </div>
      )}

      <AddMemberDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        committee="adhoc"
        communityId={communityId}
        adhocCommittees={activeCommittees}
        preloadedMembers={allMembers}
        onSaved={fetchData}
      />

      <AlertDialog open={showRemoveAlert} onOpenChange={setShowRemoveAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Committee Member</AlertDialogTitle>
            <AlertDialogDescription>
              Remove {selectedMember?.name} from {selectedMember?.committee_name}?
              This will be logged in the change history.
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
