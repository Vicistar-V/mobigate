import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trophy, ArrowRight, CheckCircle2, AlertCircle, Shield, Crown, Loader2, RefreshCw } from "lucide-react";
import { ModuleAuthorizationDrawer } from "@/components/admin/authorization/ModuleAuthorizationDrawer";
import { cn } from "@/lib/utils";

const API = "/api/community";

interface Election { id: string; title: string; status: string; cleared_candidates?: number; }
interface Candidate {
  id: string; election_id: string; user_id: string; name: string;
  profile_photo?: string; position: string; status: string;
  vote_count: number; position_id?: string; applied?: boolean;
}
interface Position { id: string; title: string; admin_number: number; holder_user_id?: string; holder_name?: string; }

// Pair a candidate with a leadership position
interface Winner {
  candidateId: string; positionId: string; userId: string;
  winnerName: string; winnerImage?: string; position: string;
  currentHolderName?: string; voteCount: number; applied: boolean;
}

interface ApplyElectionResultsSectionProps { communityId?: string; }

export function ApplyElectionResultsSection({ communityId }: ApplyElectionResultsSectionProps) {
  const { toast } = useToast();
  const [elections,  setElections]  = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [positions,  setPositions]  = useState<Position[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [selectedElection, setSelectedElection] = useState<string>("");

  // Map candidate position title to a position_id
  const [winners, setWinners] = useState<Winner[]>([]);
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [pendingBatch,   setPendingBatch]   = useState<string[]>([]);
  const [applying,       setApplying]       = useState(false);

  const fetchData = useCallback(async () => {
    if (!communityId) return;
    setLoading(true);
    try {
      const [elecRes, leaderRes] = await Promise.all([
        fetch(`${API}/elections.php?community_id=${communityId}`, { credentials: "include" }),
        fetch(`${API}/leadership.php?community_id=${communityId}`,  { credentials: "include" }),
      ]);
      const elecData   = elecRes.ok   ? await elecRes.json()   : {};
      const leaderData = leaderRes.ok ? await leaderRes.json() : {};
      const elecs: Election[] = elecData.elections ?? [];
      const cands: Candidate[] = elecData.candidates ?? [];
      const pos:   Position[]  = leaderData.positions ?? [];
      setElections(elecs);
      setCandidates(cands);
      setPositions(pos);
      if (elecs.length > 0 && !selectedElection) {
        setSelectedElection(elecs[0].id);
      }
    } catch {}
    finally { setLoading(false); }
  }, [communityId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Build winners list from cleared candidates for selected election
  useEffect(() => {
    if (!selectedElection) { setWinners([]); return; }
    const elecCands = candidates.filter(c => c.election_id === selectedElection && c.status === "cleared");
    // Group by position, pick highest vote_count as winner
    const byPosition: Record<string, Candidate[]> = {};
    for (const c of elecCands) {
      if (!byPosition[c.position]) byPosition[c.position] = [];
      byPosition[c.position].push(c);
    }
    const built: Winner[] = [];
    for (const [position, cands] of Object.entries(byPosition)) {
      const winner = [...cands].sort((a, b) => b.vote_count - a.vote_count)[0];
      // Match to a position in leadership
      const pos = positions.find(p => p.title.toLowerCase().includes(position.toLowerCase()) || position.toLowerCase().includes(p.title.toLowerCase()));
      built.push({
        candidateId: winner.id, positionId: pos?.id ?? "", userId: winner.user_id,
        winnerName: winner.name, winnerImage: winner.profile_photo, position,
        currentHolderName: pos?.holder_name ?? "Vacant",
        voteCount: winner.vote_count, applied: false,
      });
    }
    setWinners(built);
    setSelectedWinners([]);
  }, [selectedElection, candidates, positions]);

  const toggleSelection = (candidateId: string) => {
    setSelectedWinners(p => p.includes(candidateId) ? p.filter(id => id !== candidateId) : [...p, candidateId]);
  };

  const openAuth = (ids: string[]) => {
    if (ids.length === 0) { toast({ title: "No selection", variant: "destructive" }); return; }
    setPendingBatch(ids);
    setAuthDrawerOpen(true);
  };

  const handleAuthorizationComplete = async () => {
    if (pendingBatch.length === 0 || !communityId) return;
    setApplying(true);
    try {
      const toApply = winners
        .filter(w => pendingBatch.includes(w.candidateId) && w.positionId)
        .map(w => ({ user_id: w.userId, position_id: w.positionId, admin_rank: 99 }));

      if (toApply.length === 0) {
        toast({ title: "No matched positions", description: "Some winners couldn't be matched to a leadership position.", variant: "destructive" });
        return;
      }
      const res = await fetch(`${API}/leadership.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "apply_election_results", community_id: communityId, results: toApply }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Failed to apply");
      setWinners(prev => prev.map(w => pendingBatch.includes(w.candidateId) ? { ...w, applied: true } : w));
      setSelectedWinners([]);
      toast({ title: "Leadership Updated!", description: d.message || `${toApply.length} position(s) updated` });
    } catch (e: any) {
      toast({ title: "Failed to apply", description: e.message, variant: "destructive" });
    } finally { setApplying(false); setPendingBatch([]); }
  };

  const pendingWinners  = winners.filter(w => !w.applied);
  const appliedWinners  = winners.filter(w => w.applied);
  const selectedElectionObj = elections.find(e => e.id === selectedElection);

  return (
    <>
      <ModuleAuthorizationDrawer
        open={authDrawerOpen}
        onOpenChange={setAuthDrawerOpen}
        module="leadership"
        actionTitle={`Apply ${pendingBatch.length} Leadership Change${pendingBatch.length !== 1 ? "s" : ""}`}
        actionDescription="Multi-signature authorization: President + Secretary + (PRO or Director of Socials)"
        actionDetails={
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg">
              <Crown className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium">{pendingBatch.length} position{pendingBatch.length !== 1 ? "s" : ""} to update</span>
            </div>
            {winners.filter(w => pendingBatch.includes(w.candidateId)).map(w => (
              <div key={w.candidateId} className="flex justify-between text-xs p-1.5 bg-muted/30 rounded">
                <span className="text-muted-foreground truncate">{w.position}:</span>
                <span className="font-medium">{w.winnerName}</span>
              </div>
            ))}
          </div>
        }
        initiatorRole="secretary"
        onAuthorized={handleAuthorizationComplete}
      />

      <div className="space-y-4 pb-4">
        {/* Election selector */}
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
        ) : elections.length === 0 ? (
          <div className="py-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-base text-muted-foreground">No elections found</p>
            <p className="text-sm text-muted-foreground mt-1">Create and complete an election first, then apply results here.</p>
            <Button size="sm" variant="outline" className="mt-3 gap-1" onClick={fetchData}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
          </div>
        ) : (
          <>
            <Select value={selectedElection} onValueChange={setSelectedElection}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Select election…" />
              </SelectTrigger>
              <SelectContent>
                {elections.map(e => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.title} <Badge className="ml-2 text-[10px] capitalize" variant="outline">{e.status}</Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedElectionObj && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{selectedElectionObj.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {pendingWinners.length} pending • {appliedWinners.length} applied
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Position-winner mapping warning */}
            {winners.some(w => !w.positionId) && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Some election positions couldn't be matched to a leadership position. Create matching positions in the Executives tab first.</span>
              </div>
            )}

            {/* Pending winners */}
            {pendingWinners.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-semibold">Pending Changes ({pendingWinners.length})</h3>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelectedWinners(pendingWinners.map(w => w.candidateId))}>Select All</Button>
                </div>
                {pendingWinners.map(w => (
                  <Card key={w.candidateId} className={cn("overflow-hidden", !w.positionId && "opacity-60")}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox checked={selectedWinners.includes(w.candidateId)} onCheckedChange={() => toggleSelection(w.candidateId)} className="mt-1 h-5 w-5" disabled={!w.positionId} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
                            <h4 className="font-semibold text-sm">{w.position}</h4>
                            {!w.positionId && <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">No match</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Current: {w.currentHolderName}</p>
                          <div className="mt-2 p-2.5 rounded-lg bg-green-50 border border-green-200">
                            <div className="flex items-center gap-2">
                              <ArrowRight className="h-3.5 w-3.5 text-green-600" />
                              <span className="text-xs font-medium text-green-700">New Winner</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Avatar className="h-8 w-8"><AvatarImage src={w.winnerImage} /><AvatarFallback className="text-xs">{(w.winnerName || "U")[0]}</AvatarFallback></Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-primary">{w.winnerName}</p>
                                <p className="text-xs text-muted-foreground">{w.voteCount} votes</p>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" className="w-full mt-3 h-9 text-xs gap-1" disabled={!w.positionId || applying}
                            onClick={() => openAuth([w.candidateId])}>
                            <Shield className="h-3.5 w-3.5" /> Apply Change
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {selectedWinners.length > 0 && (
                  <Button className="w-full h-11" onClick={() => openAuth(selectedWinners)} disabled={applying}>
                    <Shield className="h-4 w-4 mr-2" /> Apply {selectedWinners.length} Selected
                  </Button>
                )}
              </div>
            )}

            {/* Applied */}
            {appliedWinners.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground px-1">Applied Changes</h3>
                {appliedWinners.map(w => (
                  <Card key={w.candidateId} className="bg-muted/30">
                    <CardContent className="p-3 flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{w.position}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{w.winnerName}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {winners.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No cleared candidates for this election</p>
                <p className="text-xs mt-1">Clear candidates in the Elections module first</p>
              </div>
            )}
          </>
        )}

        <div className="flex items-start gap-2 pt-3 border-t">
          <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Leadership changes require multi-signature approval: President + Secretary + (PRO or Director of Socials).
          </p>
        </div>
      </div>
    </>
  );
}
