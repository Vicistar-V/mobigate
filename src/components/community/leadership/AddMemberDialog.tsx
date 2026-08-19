import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Check, Users, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const API = "/api/community";

interface Position       { id: string; title: string; admin_number: number; holder_user_id?: string; holder_name?: string; }
interface AdhocCommittee { id: string; name: string; status: string; }
interface Member         { user_id: string; name: string; profile_photo?: string; email?: string; }

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  committee: "executive" | "adhoc";
  communityId?: string;
  positions?: Position[];
  adhocCommittees?: AdhocCommittee[];
  preloadedMembers?: Member[];   // ← passed from parent who already fetched from leadership.php
  onSaved?: (memberName?: string, posTitle?: string) => void;
}

export function AddMemberDialog({
  open, onOpenChange, committee, communityId,
  positions = [], adhocCommittees = [], preloadedMembers = [], onSaved,
}: AddMemberDialogProps) {
  const { toast } = useToast();

  const [searchQuery,    setSearchQuery]    = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [positionId,     setPositionId]     = useState("");
  const [committeeId,    setCommitteeId]    = useState("");
  const [role,           setRole]           = useState("Member");
  const [notes,          setNotes]          = useState("");
  const [submitting,     setSubmitting]     = useState(false);

  const [members,        setMembers]        = useState<Member[]>([]);
  const [liveCommittees, setLiveCommittees] = useState<AdhocCommittee[]>([]);
  const [loadingComm,    setLoadingComm]    = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersError,   setMembersError]   = useState<string | null>(null);

  // When dialog opens:
  // 1) If parent already fetched members — use them directly (no network call)
  // 2) Otherwise fall back to leadership.php (no admin gate, unlike manage_members.php)
  // Fetch committees when dialog opens in "adhoc" mode
  useEffect(() => {
    if (!open || committee !== "adhoc" || !communityId) return;
    if (adhocCommittees.length > 0) { setLiveCommittees(adhocCommittees); return; }
    setLoadingComm(true);
    fetch(`/api/community/leadership.php?community_id=${communityId}`, { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.adhoc?.length) setLiveCommittees(d.adhoc.filter((c: any) => c.status === "active")); })
      .catch(() => {})
      .finally(() => setLoadingComm(false));
  }, [open, committee, communityId, adhocCommittees]);

  useEffect(() => {
    if (!open) return;

    // Parent passed pre-loaded members — use them immediately
    if (preloadedMembers.length > 0) {
      setMembers(preloadedMembers);
      setLoadingMembers(false);
      setMembersError(null);
      return;
    }

    // Fallback: try manage_members.php first (confirmed working), then leadership.php
    if (!communityId) { setMembersError("Community ID missing"); return; }
    setLoadingMembers(true);
    setMembersError(null);

    const tryFetch = (url: string) =>
      fetch(url, { credentials: "include" })
        .then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then(data => {
          const list: Member[] = (data.members ?? []).map((m: any) => ({
            user_id:       m.user_id,
            name:          m.name || m.username || "Unknown",
            profile_photo: m.profile_photo || undefined,
            email:         m.email || undefined,
          }));
          return list;
        });

    // Try manage_members.php first, fall back to leadership.php
    tryFetch(`${API}/manage_members.php?community_id=${communityId}`)
      .catch(() => tryFetch(`${API}/leadership.php?community_id=${communityId}`))
      .then(list => {
        if (list.length === 0) setMembersError("No active members found.");
        else setMembers(list);
      })
      .catch((e) => setMembersError(`Could not load members (${e.message})`))
      .finally(() => setLoadingMembers(false));
  }, [open, communityId, preloadedMembers]);

  // Sync if parent updates preloadedMembers after open
  useEffect(() => {
    if (open && preloadedMembers.length > 0) setMembers(preloadedMembers);
  }, [preloadedMembers, open]);

  // Reset form when closed
  useEffect(() => {
    if (!open) {
      setSearchQuery(""); setSelectedMember(null);
      setPositionId(""); setCommitteeId(""); setRole("Member"); setNotes("");
    }
  }, [open]);

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    console.log("[AddMemberDialog] handleSubmit called", JSON.stringify({ selectedMember, committee, positionId, committeeId, communityId }));
    if (!selectedMember) { toast({ title: "Select a member", variant: "destructive" }); return; }
    if (committee === "executive" && !positionId) { toast({ title: "Select a position", variant: "destructive" }); return; }
    if (committee === "adhoc" && !committeeId)    { toast({ title: "Select a committee", variant: "destructive" }); return; }
    if (!communityId) return;

    setSubmitting(true);
    try {
      let body: object;
      if (committee === "executive") {
        const pos = positions.find(p => p.id === positionId);
        body = { action: "assign_position", community_id: communityId, user_id: selectedMember.user_id, position_id: positionId, admin_rank: pos?.admin_number ?? 99, notes };
      } else {
        body = { action: "add_adhoc_member", community_id: communityId, committee_id: committeeId, user_id: selectedMember.user_id, role };
      }
      const res = await fetch(`${API}/leadership.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json().catch(() => ({}));
      console.log("[AddMemberDialog] leadership.php response:", JSON.stringify(d));
      if (!res.ok) throw new Error(d.error || "Failed to add member");
      if (committee === "executive" && d.needsApproval) {
        toast({
          title: "Sent for Authorization",
          description: d.message || `This community has multiple admins, so ${d.approvalsRequired} admin authorization${d.approvalsRequired === 1 ? "" : "s"} are required before ${selectedMember.name} becomes ${positions.find(p => p.id === positionId)?.title || "an executive"}. Other admins will see this on their Admin Dashboard.`,
        });
      } else {
        toast({ title: "Member Added", description: `${selectedMember.name} added successfully` });
      }
      const posTitle = committee === "executive" ? positions.find(p => p.id === positionId)?.title : role;
      onSaved?.(selectedMember.name, posTitle);
      onOpenChange(false);
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
    finally { setSubmitting(false); }
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
          {/* Member selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Member *</Label>
              {!loadingMembers && !membersError && members.length > 0 && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Users className="h-3 w-3" />{members.length} members
                </Badge>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-11"
                disabled={loadingMembers}
              />
            </div>

            {selectedMember && (
              <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedMember.profile_photo} />
                  <AvatarFallback>{(selectedMember.name || "U")[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{selectedMember.name}</p>
                  {selectedMember.email && <p className="text-xs text-muted-foreground truncate">{selectedMember.email}</p>}
                </div>
                <Check className="h-5 w-5 text-primary shrink-0" />
              </div>
            )}

            <ScrollArea className="h-[200px] border rounded-lg">
              {loadingMembers ? (
                <div className="flex flex-col items-center gap-2 py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading community members…</p>
                </div>
              ) : membersError ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <p className="text-sm text-muted-foreground">{membersError}</p>
                  <p className="text-xs text-muted-foreground">communityId: {communityId || "undefined"}</p>
                  <Button size="sm" variant="outline" onClick={() => {
                    if (!communityId) return;
                    setLoadingMembers(true); setMembersError(null);
                    const tryUrl = (url: string) =>
                      fetch(url, { credentials: "include" })
                        .then(r => r.ok ? r.json() : Promise.reject(r.status))
                        .then(d => (d.members ?? []).map((m: any) => ({ user_id: m.user_id, name: m.name || "Unknown", profile_photo: m.profile_photo, email: m.email })));
                    tryUrl(`${API}/manage_members.php?community_id=${communityId}`)
                      .catch(() => tryUrl(`${API}/leadership.php?community_id=${communityId}`))
                      .then(list => { if (list.length) setMembers(list); else setMembersError("No members found"); })
                      .catch(() => setMembersError("Still failing — check server"))
                      .finally(() => setLoadingMembers(false));
                  }}>Retry</Button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {searchQuery ? `No members matching "${searchQuery}"` : "No members found"}
                </div>
              ) : (
                <div className="p-1">
                  {filtered.map(m => {
                    const isSelected = selectedMember?.user_id === m.user_id;
                    return (
                      <button
                        key={m.user_id}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                          isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-accent active:bg-accent/80"
                        )}
                        onClick={() => setSelectedMember(m)}
                      >
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarImage src={m.profile_photo} />
                          <AvatarFallback className="text-sm">{(m.name || "U")[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{m.name}</p>
                          {m.email && <p className="text-xs text-muted-foreground truncate">{m.email}</p>}
                        </div>
                        {isSelected && <Check className="h-5 w-5 text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Position (executive) */}
          {committee === "executive" && (
            <div className="space-y-2">
              <Label>Position *</Label>
              <Select value={positionId} onValueChange={setPositionId}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Select position…" /></SelectTrigger>
                <SelectContent>
                  {positions.length === 0
                    ? <SelectItem value="_none" disabled>No positions defined</SelectItem>
                    : positions.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.title} {p.holder_name ? `(${p.holder_name})` : "(vacant)"}
                        </SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Committee + role (adhoc) */}
          {committee === "adhoc" && (
            <>
              <div className="space-y-2">
                <Label className="text-sm">Committee *</Label>
                {loadingComm ? (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg border text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" /> Loading committees…
                  </div>
                ) : (liveCommittees.length === 0 && adhocCommittees.length === 0) ? (
                  <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50 text-xs text-amber-700">
                    No active committees. Create one in the Ad-hoc tab first.
                  </div>
                ) : (
                <Select value={committeeId} onValueChange={setCommitteeId}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select committee…" /></SelectTrigger>
                  <SelectContent>
                    {(liveCommittees.length > 0 ? liveCommittees : adhocCommittees.filter(c => c.status === "active")).map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label>Role in Committee</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Chair","Vice Chair","Secretary","Treasurer","Member"].map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea placeholder="Reason for appointment…" value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="resize-none" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting || !selectedMember}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
