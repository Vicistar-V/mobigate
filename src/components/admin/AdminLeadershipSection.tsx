import { useState, useEffect, useCallback } from "react";
import {
  Crown, Users, History, Trophy, ChevronRight, Shield,
  Plus, Trash2, Edit3, UserCheck, Loader2, RefreshCw,
  CheckCircle, X, AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ModuleAuthorizationDrawer } from "./authorization/ModuleAuthorizationDrawer";
import { getActionConfig, renderActionDetails } from "./authorization/authorizationActionConfigs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { toast as sonnerToast } from "sonner";

const API = "/api/community";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Executive {
  id: string; name: string; position: string; position_id?: string;
  admin_rank: number; tenure: string; imageUrl: string;
  level: "topmost" | "deputy" | "officer" | "staff";
  committee: "executive" | "ad-hoc" | "staff";
  email?: string; is_founder?: boolean;
}
interface Position { id: string; title: string; admin_number: number; holder_user_id?: string; holder_name?: string; holder_photo?: string; }
interface HistoryEntry { id: string; user_id: string; member_name: string; profile_photo?: string; position_title: string; action: string; effective_date?: string; notes?: string; changed_by_name?: string; created_at: string; }
interface AdhocCommittee { id: string; name: string; purpose?: string; description?: string; status: string; member_count: number; created_at: string; }
interface Member { user_id: string; name: string; profile_photo?: string; }

type LeadershipActionType = "apply_results" | "add_executive" | "remove_executive" | "assign_adhoc";

interface AdminLeadershipSectionProps {
  communityId?: string;
  executives: Executive[];
  onManageLeadership: () => void;
  onApplyElectionResults: () => void;
  onViewChangeHistory: () => void;
  onManageAdhoc: () => void;
  onViewExecutive: (id: string) => void;
  /** Fired after any assign_position submission (immediate or pending-authorization),
   * so the parent dashboard can refresh things like the pending-authorization banner. */
  onAssignmentSubmitted?: () => void;
}

const levelColor: Record<string, string> = {
  topmost: "bg-purple-100 text-purple-700",
  deputy:  "bg-blue-100 text-blue-700",
  officer: "bg-green-100 text-green-700",
  staff:   "bg-gray-100 text-gray-600",
};

const actionColor: Record<string, string> = {
  appointed: "text-green-600", elected: "text-blue-600",
  removed: "text-red-600", resigned: "text-amber-600", transferred: "text-purple-600",
};

// ── Common community positions with default ranks ────────────────────────────
const PREDEFINED_POSITIONS = [
  { title: "President",                   rank: 1  },
  { title: "Vice President",              rank: 2  },
  { title: "General Secretary",           rank: 3  },
  { title: "Assistant Secretary",         rank: 4  },
  { title: "Financial Secretary",         rank: 5  },
  { title: "Treasurer",                   rank: 6  },
  { title: "Provost",                     rank: 7  },
  { title: "Public Relations Officer",    rank: 8  },
  { title: "Legal Adviser",               rank: 9  },
  { title: "Welfare Officer",             rank: 10 },
  { title: "Social Secretary",            rank: 11 },
  { title: "Youth Coordinator",           rank: 12 },
  { title: "Women Leader",                rank: 13 },
  { title: "Director of Socials",         rank: 14 },
  { title: "Auditor",                     rank: 15 },
  { title: "Organizing Secretary",        rank: 16 },
  { title: "Ex-Officio Member",           rank: 17 },
  { title: "Patron",                      rank: 18 },
  { title: "Trustee",                     rank: 19 },
];

// ── Component ────────────────────────────────────────────────────────────────
export function AdminLeadershipSection({
  communityId, executives: propExecs,
  onManageLeadership, onApplyElectionResults,
  onViewChangeHistory, onManageAdhoc, onViewExecutive,
  onAssignmentSubmitted,
}: AdminLeadershipSectionProps) {
  const { toast } = useToast();

  // ── Real data ────────────────────────────────────────────────────────────
  const [executives, setExecutives]   = useState<Executive[]>(propExecs);
  const [positions,  setPositions]    = useState<Position[]>([]);
  const [history,    setHistory]      = useState<HistoryEntry[]>([]);
  const [adhoc,      setAdhoc]        = useState<AdhocCommittee[]>([]);
  const [loading,    setLoading]      = useState(false);

  // ── Dialog states — must be declared BEFORE the useEffect that references them ──
  const [showHistory,        setShowHistory]        = useState(false);
  const [showAssignDialog,   setShowAssignDialog]   = useState(false);
  const [showAdhocDialog,    setShowAdhocDialog]    = useState(false);
  const [showCreatePosition, setShowCreatePosition] = useState(false);
  const [showAddAdhoc,       setShowAddAdhoc]       = useState(false);

  // ── Member fetch state ───────────────────────────────────────────────────
  const [allMembers,    setAllMembers]    = useState<Member[]>([]);
  const [loadingMembers,setLoadingMembers]= useState(false);
  const [membersError,  setMembersError]  = useState<string | null>(null);

  // Fetch members when Assign Position dialog opens — same pattern as AllMembersDrawer
  useEffect(() => {
    if (!showAssignDialog || !communityId) return;
    setLoadingMembers(true);
    setMembersError(null);
    fetch(`/api/community/manage_members.php?community_id=${communityId}`, { credentials: "include" })
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => {
        const list: Member[] = (data.members ?? []).map((m: any) => ({
          user_id:       m.user_id,
          name:          m.name || m.username || "Unknown",
          profile_photo: m.profile_photo || undefined,
        }));
        if (list.length === 0) setMembersError("No members found.");
        else setAllMembers(list);
      })
      .catch(() => setMembersError("Could not load members. Try again."))
      .finally(() => setLoadingMembers(false));
  }, [showAssignDialog, communityId]);

  const fetchData = useCallback(async () => {
    if (!communityId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/leadership.php?community_id=${communityId}`, { credentials: "include" });
      if (!res.ok) return;
      const d = await res.json();
      setExecutives(d.executives ?? []);
      setPositions(d.positions ?? []);
      setHistory(d.history ?? []);
      setAdhoc(d.adhoc ?? []);
    } catch {}
    finally { setLoading(false); }
  }, [communityId]);

  useEffect(() => { fetchData(); }, [fetchData]);

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

  // ── Authorization state ──────────────────────────────────────────────────
  const [authDrawerOpen,     setAuthDrawerOpen]     = useState(false);
  const [authAction,     setAuthAction]     = useState<{ type: LeadershipActionType; details: string; payload?: any } | null>(null);

  // ── Form state ───────────────────────────────────────────────────────────
  const [assignUserId,    setAssignUserId]    = useState("");
  const [assignPosId,     setAssignPosId]     = useState("");
  const [assignNotes,     setAssignNotes]     = useState("");
  const [newPosTitle,     setNewPosTitle]     = useState("");
  const [newPosPreset,    setNewPosPreset]    = useState("");
  const [newPosRank,      setNewPosRank]      = useState("99");
  const [newAdhocName,    setNewAdhocName]    = useState("");
  const [newAdhocPurpose, setNewAdhocPurpose] = useState("");
  const [submitting,      setSubmitting]      = useState(false);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAuthorizationComplete = async () => {
    if (!authAction) return;
    const config = getActionConfig("leadership", authAction.type);
    try {
      if (authAction.type === "apply_results" && authAction.payload) {
        await callAPI({ action: "apply_election_results", results: authAction.payload });
        toast({ title: "Election results applied!", description: "Leadership has been updated." });
        onApplyElectionResults();
      } else if (authAction.type === "assign_adhoc" && authAction.payload) {
        await callAPI({ action: "create_adhoc", ...authAction.payload });
        toast({ title: "Ad-hoc committee created!", description: authAction.details });
      } else {
        toast({ title: config?.title || "Action authorized", description: `${authAction.details} completed.` });
      }
      await fetchData();
    } catch (e: any) { toast({ title: "Action failed", description: e.message, variant: "destructive" }); }
    setAuthAction(null);
  };

  const handleAssignSubmit = async () => {
    console.log("[AdminLeadershipSection] handleAssignSubmit called", JSON.stringify({ assignUserId, assignPosId, communityId }));
    if (!assignUserId || !assignPosId) { sonnerToast.error("Select a member and position"); return; }
    const pos = positions.find(p => p.id === assignPosId);
    const mem = allMembers.find(m => m.user_id === assignUserId);
    setSubmitting(true);
    try {
      const d = await callAPI({ action: "assign_position", user_id: assignUserId, position_id: assignPosId, notes: assignNotes });
      console.log("[AdminLeadershipSection] assign_position response:", JSON.stringify(d));
      if (d.needsApproval) {
        sonnerToast.success(
          d.message ||
          `Sent for authorization — ${d.approvalsRequired} admin${d.approvalsRequired === 1 ? "" : "s"} need to sign off before ${mem?.name || "this member"} becomes ${pos?.title || "an executive"}. Other admins will see this on their Admin Dashboard whenever they check in.`
        );
      } else {
        sonnerToast.success(`${mem?.name || "Member"} assigned to ${pos?.title || "position"}`);
      }
      setShowAssignDialog(false);
      setAssignUserId(""); setAssignPosId(""); setAssignNotes("");
      await fetchData();
      onAssignmentSubmitted?.();
    } catch (e: any) { sonnerToast.error(e.message); }
    finally { setSubmitting(false); }
  };

  const handleCreatePosition = async () => {
    if (!newPosTitle.trim()) { sonnerToast.error("Position title is required"); return; }
    setSubmitting(true);
    try {
      await callAPI({ action: "create_position", title: newPosTitle.trim(), admin_number: parseInt(newPosRank) || 99 });
      sonnerToast.success("Position created");
      setNewPosTitle(""); setNewPosRank("99");
      setShowCreatePosition(false);
      fetchData();
    } catch (e: any) { sonnerToast.error(e.message); }
    finally { setSubmitting(false); }
  };

  const handleRemoveExecutive = async (exec: Executive) => {
    if (!confirm(`Remove ${exec.name} from leadership?`)) return;
    try {
      await callAPI({ action: "remove_from_leadership", user_id: exec.id, reason: "Removed by admin" });
      sonnerToast.success(`${exec.name} removed from leadership`);
      fetchData();
    } catch (e: any) { sonnerToast.error(e.message); }
  };

  const handleCreateAdhoc = () => {
    if (!newAdhocName.trim()) { sonnerToast.error("Committee name is required"); return; }
    setAuthAction({
      type: "assign_adhoc",
      details: `Create "${newAdhocName}" committee`,
      payload: { name: newAdhocName.trim(), purpose: newAdhocPurpose.trim() },
    });
    setShowAddAdhoc(false);
    setAuthDrawerOpen(true);
  };

  const handleAdhocStatusChange = async (committeeId: string, status: string) => {
    try {
      await callAPI({ action: "update_adhoc_status", committee_id: committeeId, status });
      sonnerToast.success(`Committee marked as ${status}`);
      fetchData();
    } catch (e: any) { sonnerToast.error(e.message); }
  };

  const actionConfig = authAction ? getActionConfig("leadership", authAction.type) : null;
  const getAuthActionDetails = () => {
    if (!authAction || !actionConfig) return null;
    return renderActionDetails({ config: actionConfig, primaryText: authAction.details, secondaryText: "Leadership Action", module: "leadership" });
  };

  return (
    <>
      {/* Authorization Drawer */}
      <ModuleAuthorizationDrawer
        open={authDrawerOpen}
        onOpenChange={setAuthDrawerOpen}
        module="leadership"
        actionTitle={actionConfig?.title || "Leadership Action"}
        actionDescription={actionConfig?.description || "Multi-signature authorization required"}
        actionDetails={getAuthActionDetails()}
        initiatorRole="secretary"
        onAuthorized={handleAuthorizationComplete}
      />

      {/* ── History Dialog ─────────────────────────────────────────────── */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-lg p-0 flex flex-col" style={{ maxHeight: "85vh" }}>
          <DialogTitle className="sr-only">Leadership Change History</DialogTitle>
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
            <h3 className="font-bold flex items-center gap-2"><History className="h-4 w-4" /> Change History</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={fetchData}><RefreshCw className="h-3.5 w-3.5" /></Button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3" style={{ WebkitOverflowScrolling: "touch" }}>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No leadership changes recorded yet.</p>
            ) : history.map(h => (
              <div key={h.id} className="flex gap-3 items-start p-3 rounded-lg border">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={h.profile_photo} />
                  <AvatarFallback className="text-xs">{(h.member_name || "U")[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">{h.member_name}</span>
                    <Badge className={cn("text-[10px] px-1.5 capitalize", actionColor[h.action] || "text-gray-600", "bg-muted")}>{h.action}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{h.position_title}</p>
                  {h.notes && <p className="text-xs text-muted-foreground italic mt-0.5">{h.notes}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1">{h.effective_date || new Date(h.created_at).toLocaleDateString()} • by {h.changed_by_name || "Admin"}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Assign Position Dialog ─────────────────────────────────────── */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogTitle className="sr-only">Assign Position</DialogTitle>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary" /> Assign Position</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-sm">Select Member *</Label>
              {loadingMembers ? (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" /> Loading members…
                </div>
              ) : membersError ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-destructive/30 bg-destructive/5">
                  <p className="text-xs text-destructive">{membersError}</p>
                  <Button size="sm" variant="outline" className="h-6 text-xs shrink-0 ml-2"
                    onClick={() => {
                      setLoadingMembers(true); setMembersError(null);
                      fetch(`/api/community/manage_members.php?community_id=${communityId}`, { credentials: "include" })
                        .then(r => r.ok ? r.json() : Promise.reject(r.status))
                        .then(d => setAllMembers((d.members ?? []).map((m: any) => ({ user_id: m.user_id, name: m.name || "Unknown", profile_photo: m.profile_photo }))))
                        .catch(() => setMembersError("Retry failed"))
                        .finally(() => setLoadingMembers(false));
                    }}>Retry</Button>
                </div>
              ) : (
                <Select value={assignUserId} onValueChange={setAssignUserId}>
                  <SelectTrigger><SelectValue placeholder={`Choose from ${allMembers.length} member${allMembers.length !== 1 ? "s" : ""}…`} /></SelectTrigger>
                  <SelectContent>
                    {allMembers.map(m => (
                      <SelectItem key={m.user_id} value={m.user_id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5 shrink-0">
                            <AvatarImage src={m.profile_photo} />
                            <AvatarFallback className="text-[10px]">{(m.name || "U")[0]}</AvatarFallback>
                          </Avatar>
                          {m.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Select Position *</Label>
              <Select value={assignPosId} onValueChange={setAssignPosId}>
                <SelectTrigger><SelectValue placeholder="Choose a position…" /></SelectTrigger>
                <SelectContent>
                  {positions.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title} {p.holder_name ? `(currently ${p.holder_name})` : "(vacant)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Notes (optional)</Label>
              <Textarea placeholder="Reason for appointment…" value={assignNotes} onChange={e => setAssignNotes(e.target.value)} rows={2} className="resize-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAssignDialog(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleAssignSubmit} disabled={!assignUserId || !assignPosId || loadingMembers || submitting}>
              {submitting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <UserCheck className="h-4 w-4 mr-1" />} Assign Position
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Create Position Dialog ─────────────────────────────────────── */}
      <Dialog open={showCreatePosition} onOpenChange={(v) => {
        setShowCreatePosition(v);
        if (!v) { setNewPosPreset(""); setNewPosTitle(""); setNewPosRank("99"); }
      }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogTitle className="sr-only">Create Position</DialogTitle>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> New Leadership Position
          </h3>
          <div className="space-y-3">
            {/* Predefined positions */}
            <div className="space-y-1">
              <Label className="text-sm">Select a Common Position</Label>
              <Select
                value={newPosPreset}
                onValueChange={(v) => {
                  setNewPosPreset(v);
                  if (v !== "custom") {
                    // Auto-fill title and rank from preset
                    const preset = PREDEFINED_POSITIONS.find(p => p.title === v);
                    setNewPosTitle(v);
                    setNewPosRank(String(preset?.rank ?? 99));
                  } else {
                    setNewPosTitle("");
                  }
                }}
              >
                <SelectTrigger><SelectValue placeholder="Choose from common positions…" /></SelectTrigger>
                <SelectContent>
                  {PREDEFINED_POSITIONS.map(p => (
                    <SelectItem key={p.title} value={p.title}>
                      <span className="font-medium">{p.title}</span>
                      <span className="text-muted-foreground ml-2 text-xs">(Rank {p.rank})</span>
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">
                    <span className="text-primary font-medium">+ Custom Position</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom title — shown when "custom" selected OR to edit preset name */}
            <div className="space-y-1">
              <Label className="text-sm">
                Position Title *
                {newPosPreset && newPosPreset !== "custom" && (
                  <span className="text-muted-foreground text-xs ml-1">(edit if needed)</span>
                )}
              </Label>
              <Input
                placeholder="e.g. Financial Secretary, Director of Welfare…"
                value={newPosTitle}
                onChange={e => setNewPosTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm">
                Rank / Priority
                <span className="text-muted-foreground text-xs ml-1">(1 = highest, e.g. President = 1)</span>
              </Label>
              <Input
                type="number" min="1" max="100"
                placeholder="e.g. 1, 2, 3…"
                value={newPosRank}
                onChange={e => setNewPosRank(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowCreatePosition(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleCreatePosition} disabled={submitting || !newPosTitle.trim()}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />} Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Ad-hoc Committees Dialog ───────────────────────────────────── */}
      <Dialog open={showAdhocDialog} onOpenChange={setShowAdhocDialog}>
        <DialogContent className="max-w-lg p-0 flex flex-col" style={{ maxHeight: "85vh" }}>
          <DialogTitle className="sr-only">Ad-hoc Committees</DialogTitle>
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
            <h3 className="font-bold flex items-center gap-2"><Users className="h-4 w-4" /> Ad-hoc Committees</h3>
            <Button size="sm" className="h-7 text-xs gap-1" onClick={() => setShowAddAdhoc(true)}><Plus className="h-3 w-3" /> New</Button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3" style={{ WebkitOverflowScrolling: "touch" }}>
            {adhoc.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No ad-hoc committees yet</p>
                <Button size="sm" className="mt-3 gap-1" onClick={() => setShowAddAdhoc(true)}><Plus className="h-3 w-3" /> Create one</Button>
              </div>
            ) : adhoc.map(c => (
              <div key={c.id} className="p-3 rounded-xl border space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{c.name}</p>
                    {c.purpose && <p className="text-xs text-muted-foreground">{c.purpose}</p>}
                    <p className="text-xs text-muted-foreground">{c.member_count} member{c.member_count !== 1 ? "s" : ""}</p>
                  </div>
                  <Badge variant={c.status === "active" ? "default" : "secondary"} className="text-[10px] shrink-0 capitalize">{c.status}</Badge>
                </div>
                {c.status === "active" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-6 text-xs gap-1" onClick={() => handleAdhocStatusChange(c.id, "completed")}><CheckCircle className="h-3 w-3" /> Complete</Button>
                    <Button size="sm" variant="outline" className="h-6 text-xs gap-1 text-destructive" onClick={() => handleAdhocStatusChange(c.id, "disbanded")}><X className="h-3 w-3" /> Disband</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── New Adhoc Dialog ───────────────────────────────────────────── */}
      <Dialog open={showAddAdhoc} onOpenChange={setShowAddAdhoc}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogTitle className="sr-only">New Ad-hoc Committee</DialogTitle>
          <h3 className="font-bold text-lg mb-4">New Ad-hoc Committee</h3>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-sm">Committee Name *</Label><Input placeholder="e.g. Event Planning Committee" value={newAdhocName} onChange={e => setNewAdhocName(e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-sm">Purpose</Label><Textarea placeholder="What is this committee for?" value={newAdhocPurpose} onChange={e => setNewAdhocPurpose(e.target.value)} rows={3} className="resize-none" /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddAdhoc(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleCreateAdhoc} disabled={!newAdhocName.trim()}>
              <Shield className="h-4 w-4 mr-1" /> Proceed to Auth
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Main Accordion ────────────────────────────────────────────────── */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="leadership" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-3 hover:no-underline">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 shrink-0">
                <Crown className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <h3 className="font-semibold text-sm">Leadership</h3>
                <p className="text-xs text-muted-foreground">
                  {executives.length} executives • {adhoc.filter(a => a.status === "active").length} ad-hoc
                </p>
              </div>
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground shrink-0" />}
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-3 pb-3">
            <div className="space-y-3">
              {/* Stats row */}
              <div className="flex items-center justify-start gap-6 py-1">
                <div className="text-center">
                  <span className="text-base font-bold">{executives.length}</span>
                  <p className="text-xs text-muted-foreground">Executives</p>
                </div>
                <div className="text-center">
                  <span className="text-base font-bold">{adhoc.filter(a => a.status === "active").length}</span>
                  <p className="text-xs text-muted-foreground">Committees</p>
                </div>
                <div className="text-center">
                  <span className="text-base font-bold">{positions.length}</span>
                  <p className="text-xs text-muted-foreground">Positions</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto" onClick={fetchData} disabled={loading}>
                  <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                </Button>
              </div>

              {/* Current executives list */}
              {executives.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <Crown className="h-8 w-8 mx-auto mb-1 opacity-30" />
                  <p className="text-xs">No executives assigned yet</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Current Executives</p>
                  <ScrollArea className="max-h-[200px] overflow-y-auto touch-auto">
                    <div className="flex flex-col divide-y divide-border/50">
                      {executives.slice(0, 8).map(exec => (
                        <div key={exec.id} className="flex items-center gap-3 py-2.5 group">
                          <Avatar className="h-9 w-9 shrink-0 cursor-pointer" onClick={() => onViewExecutive(exec.id)}>
                            <AvatarImage src={exec.imageUrl} />
                            <AvatarFallback className="text-xs">{exec.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onViewExecutive(exec.id)}>
                            <p className="font-medium text-sm leading-snug truncate">{exec.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <p className="text-xs text-muted-foreground truncate">{exec.position}</p>
                              <Badge className={cn("text-[9px] px-1 capitalize", levelColor[exec.level])}>{exec.level}</Badge>
                            </div>
                          </div>
                          {!exec.is_founder && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveExecutive(exec)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <Separator />

              {/* Action buttons */}
              <div className="flex flex-col gap-0 divide-y divide-border">
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded touch-manipulation" onClick={() => setShowAssignDialog(true)}>
                  <UserCheck className="h-4 w-4 text-muted-foreground" /> Assign Position
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded touch-manipulation" onClick={() => setShowCreatePosition(true)}>
                  <Plus className="h-4 w-4 text-muted-foreground" /> Create Position
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm font-medium text-primary hover:bg-muted/50 -mx-1 px-1 rounded touch-manipulation"
                  onClick={() => { setAuthAction({ type: "apply_results", details: "Election Results", payload: [] }); setAuthDrawerOpen(true); }}>
                  <Trophy className="h-4 w-4 text-primary" /> Apply Election Results
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded touch-manipulation" onClick={() => { setShowHistory(true); onViewChangeHistory(); }}>
                  <History className="h-4 w-4 text-muted-foreground" /> View Change History
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded touch-manipulation" onClick={() => { setShowAdhocDialog(true); onManageAdhoc(); }}>
                  <Users className="h-4 w-4 text-muted-foreground" /> Manage Ad-hoc Committees
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded touch-manipulation" onClick={onManageLeadership}>
                  <Crown className="h-4 w-4 text-muted-foreground" /> Full Leadership Manager
                </button>
              </div>

              {/* Auth requirements */}
              <div className="flex items-start gap-2 pt-2 border-t border-border/50">
                <Shield className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground leading-snug">
                  Leadership changes require President + Secretary + (PRO or Director of Socials)
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}