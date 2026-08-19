import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Clock, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUserId } from "@/hooks/useWindowData";

interface PendingPositionRequest {
  id: string;
  position_title: string;
  new_holder_id: string;
  new_holder_name?: string;
  notes: string | null;
  requested_by: string;
  requested_by_name?: string;
  approvals_required: number;
  approvals_collected: number;
  created_at: string;
  approvals: { admin_id: string; name: string }[];
}

interface PendingPositionAuthorizationBannerProps {
  communityId: string;
  isAdmin: boolean;
  onApplied: () => void;
}

export function PendingPositionAuthorizationBanner({ communityId, isAdmin, onApplied }: PendingPositionAuthorizationBannerProps) {
  const { toast } = useToast();
  const currentUserId = useCurrentUserId();
  const [pending, setPending] = useState<PendingPositionRequest[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadPending = () => {
    if (!isAdmin || !communityId) return;
    setLoadError(null);
    fetch(`/api/community/leadership.php?community_id=${encodeURIComponent(communityId)}`, { credentials: "include" })
      .then(async (r) => {
        const text = await r.text();
        if (!r.ok) {
          console.error("[PendingPositionAuthorizationBanner] leadership.php returned", r.status, text);
          setLoadError(`Couldn't check for pending appointments (server said: ${r.status}).`);
          setPending([]);
          return;
        }
        try {
          const d = JSON.parse(text);
          console.log("[PendingPositionAuthorizationBanner] leadership.php response:", JSON.stringify(d));
          setPending(Array.isArray(d.pendingPositionRequests) ? d.pendingPositionRequests : []);
        } catch (e) {
          console.error("[PendingPositionAuthorizationBanner] Non-JSON response from leadership.php:", text);
          setLoadError("Couldn't check for pending appointments (unexpected server response).");
          setPending([]);
        }
      })
      .catch((e) => {
        console.error("[PendingPositionAuthorizationBanner] Network error:", e);
        setLoadError("Couldn't reach the server to check for pending appointments.");
        setPending([]);
      });
  };

  useEffect(() => { loadPending(); }, [communityId, isAdmin]);

  const handleApprove = async (req: PendingPositionRequest) => {
    if (!password) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/community/leadership.php", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "authorize_position_assignment", community_id: communityId, request_id: req.id, password }),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok || !d?.success) throw new Error(d?.error || "Failed to authorize");

      if (d.fullyAuthorized) {
        toast({ title: "Authorized & Applied", description: `${req.new_holder_name || "The member"} is now ${req.position_title}.` });
        onApplied();
      } else {
        toast({ title: "Authorization Recorded", description: `${d.approvalsCollected}/${d.approvalsRequired} admin authorizations collected so far.` });
      }
      setApprovingId(null);
      setPassword("");
      loadPending();
    } catch (e: any) {
      toast({ title: "Couldn't Authorize", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (req: PendingPositionRequest) => {
    try {
      const res = await fetch("/api/community/leadership.php", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject_position_assignment", community_id: communityId, request_id: req.id }),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok || !d?.success) throw new Error(d?.error || "Failed to reject");
      toast({ title: "Appointment Rejected", description: "The pending executive appointment has been cancelled." });
      loadPending();
    } catch (e: any) {
      toast({ title: "Couldn't Reject", description: e.message, variant: "destructive" });
    }
  };

  if (!isAdmin) return null;
  if (loadError) {
    return (
      <Card className="mb-4 border-destructive/30 bg-destructive/5 p-3">
        <p className="text-xs text-destructive">{loadError}</p>
      </Card>
    );
  }
  if (pending.length === 0) return null;

  return (
    <div className="space-y-3 mb-4">
      {pending.map((req) => {
        const youHaveApproved = req.approvals.some((a) => a.admin_id === currentUserId);
        const isApproving = approvingId === req.id;
        return (
          <Card key={req.id} className="border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 p-4">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-amber-900 dark:text-amber-200">
                  Admins Action! An executive appointment is awaiting approval
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Remember, multiple admin authorisations are required to effect any leadership change — {req.approvals_required} admin{req.approvals_required === 1 ? "" : "s"} required this time, based on how many admins this community currently has.
                  {" "}<span className="font-medium text-foreground">{req.new_holder_name || "A member"}</span> was submitted to become <span className="font-medium text-foreground">{req.position_title}</span> and needs your approval before it takes effect.
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {req.approvals_collected}/{req.approvals_required} approved
                    {req.approvals.length > 0 && ` (${req.approvals.map((a) => a.name).join(", ")})`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(req.created_at).toLocaleDateString()}
                  </span>
                </div>

                {youHaveApproved ? (
                  <p className="text-xs font-medium text-emerald-600 mt-2">✓ You've already approved this appointment</p>
                ) : !isApproving ? (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => setApprovingId(req.id)}>Review & Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => handleReject(req)}>Reject</Button>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2 max-w-xs">
                    <Label htmlFor={`approve-password-${req.id}`} className="text-xs">Enter your login password to approve</Label>
                    <Input
                      id={`approve-password-${req.id}`}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApprove(req)} disabled={submitting || !password}>
                        {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                        {submitting ? "Approving..." : "Confirm Approval"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setApprovingId(null); setPassword(""); }} disabled={submitting}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
