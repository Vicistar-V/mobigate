import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { AddMemberDialog } from "./AddMemberDialog";
import { EditMemberDialog } from "./EditMemberDialog";
import { LeadershipMemberActionsMenu } from "./LeadershipMemberActionsMenu";
import { Plus, Users, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast as sonnerToast } from "sonner";

const API = "/api/community";

interface Executive { id: string; name: string; position: string; position_id?: string; admin_rank: number; tenure: string; imageUrl: string; level: string; committee: string; email?: string; is_founder?: boolean; }
interface Position  { id: string; title: string; admin_number: number; holder_user_id?: string; holder_name?: string; }
interface Member    { user_id: string; name: string; profile_photo?: string; email?: string; }

const levelColor: Record<string, string> = {
  topmost: "bg-purple-100 text-purple-700",
  deputy:  "bg-blue-100 text-blue-700",
  officer: "bg-green-100 text-green-700",
  staff:   "bg-gray-100 text-gray-600",
};

export function ManageExecutivesSection({ communityId, onActivityLogged }: { communityId?: string; onActivityLogged?: (action: string, target: string) => void }) {
  const { toast } = useToast();

  const [executives,  setExecutives]  = useState<Executive[]>([]);
  const [positions,   setPositions]   = useState<Position[]>([]);
  const [allMembers,  setAllMembers]  = useState<Member[]>([]);   // ← from leadership.php, no admin gate
  const [loading,     setLoading]     = useState(false);

  const [showAddDialog,   setShowAddDialog]   = useState(false);
  const [showEditDialog,  setShowEditDialog]  = useState(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [selectedMember,  setSelectedMember]  = useState<Executive | null>(null);
  const [removing,        setRemoving]        = useState(false);

  const loadData = () => {
    if (!communityId) return;
    setLoading(true);
    // Fetch leadership data (executives, positions, adhoc, history)
    fetch(`${API}/leadership.php?community_id=${communityId}`, { credentials: "include" })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => {
        setExecutives(d.executives ?? []);
        setPositions(d.positions   ?? []);
        // Also use members from this response if available
        if (d.members?.length) setAllMembers(d.members);
      })
      .catch(() => {}) // leadership errors handled silently; members fetched separately
      .finally(() => setLoading(false));

    // Fetch members from manage_members.php — this is the confirmed-working endpoint
    fetch(`${API}/manage_members.php?community_id=${communityId}`, { credentials: "include" })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => { if (d.members?.length) setAllMembers(d.members); })
      .catch(() => {}); // silent — preloadedMembers will just be empty, AddMemberDialog fetches itself
  };

  useEffect(() => { loadData(); }, [communityId]);

  const callAPI = async (body: object) => {
    const res = await fetch(`${API}/leadership.php`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, community_id: communityId }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(d.error || "Request failed");
    return d;
  };

  const confirmRemove = async () => {
    if (!selectedMember) return;
    setRemoving(true);
    try {
      await callAPI({ action: "remove_from_leadership", user_id: selectedMember.id, reason: "Removed by admin" });
      toast({ title: "Member Removed", description: `${selectedMember.name} removed from leadership` });
      onActivityLogged?.('removed from executive leadership', selectedMember.name);
      setShowRemoveAlert(false);
      setSelectedMember(null);
      loadData();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
    finally { setRemoving(false); }
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="font-semibold">Executive Committee</span>
          <Badge variant="secondary">{executives.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="h-9 w-9 p-0" onClick={loadData} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)} className="h-9 gap-1">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      {loading && executives.length === 0
        ? <div className="flex justify-center py-10"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
        : executives.length === 0
          ? <div className="text-center py-10 text-muted-foreground"><Users className="h-10 w-10 mx-auto mb-2 opacity-30" /><p className="text-sm">No executives assigned yet</p></div>
          : <div className="space-y-3">
              {executives.map(exec => (
                <Card key={exec.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-14 w-14 shrink-0">
                        <AvatarImage src={exec.imageUrl} alt={exec.name} />
                        <AvatarFallback className="text-lg">{(exec.name || "U")[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base leading-tight">{exec.name}</h4>
                        <p className="text-sm text-primary mt-0.5">{exec.position}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {exec.tenure && <Badge variant="outline" className="text-xs">{exec.tenure}</Badge>}
                          <Badge className={cn("text-xs capitalize", levelColor[exec.level] ?? "bg-gray-100 text-gray-600")}>{exec.level}</Badge>
                          {exec.is_founder && <Badge className="text-xs bg-amber-100 text-amber-700">Founder</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!exec.is_founder && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => { setSelectedMember(exec); setShowRemoveAlert(true); }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <LeadershipMemberActionsMenu
                          member={{ ...exec, imageUrl: exec.imageUrl ?? "/placeholder.svg", committee: "executive" } as any}
                          onEdit={() => { setSelectedMember(exec); setShowEditDialog(true); }}
                          onRemove={exec.is_founder ? undefined : () => { setSelectedMember(exec); setShowRemoveAlert(true); }}
                          showAdminActions
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
      }

      {/* Add — passes pre-loaded allMembers so no second fetch needed */}
      <AddMemberDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        committee="executive"
        communityId={communityId}
        positions={positions}
        preloadedMembers={allMembers}
        onSaved={(memberName?: string, posTitle?: string) => { setShowAddDialog(false); loadData(); onActivityLogged?.('assigned executive position', `${memberName || 'Member'} as ${posTitle || 'Executive'}`); }}
      />

      {selectedMember && (
        <EditMemberDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          member={selectedMember as any}
          communityId={communityId}
          positions={positions}
          onSaved={() => { setShowEditDialog(false); loadData(); }}
        />
      )}

      <AlertDialog open={showRemoveAlert} onOpenChange={setShowRemoveAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Executive Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedMember?.name} from {selectedMember?.position}?
              This action will be logged in the change history.
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
