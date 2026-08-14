import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Clock, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PendingChange {
  id: string;
  requestedBy: string;
  changes: Record<string, any>;
  approvalsRequired: number;
  approvalsCollected: number;
  approvedBy: string[];
  youHaveApproved: boolean;
  createdAt: string;
}

interface PendingProfileChangeBannerProps {
  communityId: string;
  isAdmin: boolean;
  onApplied: () => void;
}

export function PendingProfileChangeBanner({ communityId, isAdmin, onApplied }: PendingProfileChangeBannerProps) {
  const { toast } = useToast();
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [showApprove, setShowApprove] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadPending = () => {
    if (!isAdmin) return;
    fetch("/api/community/get.php", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get_pending_change", community_id: communityId }),
    })
      .then((r) => r.json())
      .then((d) => setPending(d.pending ?? null))
      .catch(() => setPending(null));
  };

  useEffect(() => { loadPending(); }, [communityId, isAdmin]);

  const handleApprove = async () => {
    if (!pending || !password) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/community/get.php", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_profile_change", request_id: pending.id, password }),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok || !d?.success) throw new Error(d?.error || "Failed to approve change");

      if (d.fullyApproved) {
        toast({ title: "Change Approved & Applied", description: "All required approvals have been collected. The community profile has been updated." });
        setPending(null);
        onApplied();
      } else {
        toast({ title: "Approval Recorded", description: `${d.approvalsCollected}/${d.approvalsRequired} admin approvals collected so far.` });
        loadPending();
      }
      setShowApprove(false);
      setPassword("");
    } catch (e: any) {
      toast({ title: "Couldn't Approve", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!pending) return;
    try {
      const res = await fetch("/api/community/get.php", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject_profile_change", request_id: pending.id }),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok || !d?.success) throw new Error(d?.error || "Failed to reject change");
      toast({ title: "Change Rejected", description: "The pending profile change has been cancelled." });
      setPending(null);
    } catch (e: any) {
      toast({ title: "Couldn't Reject", description: e.message, variant: "destructive" });
    }
  };

  if (!isAdmin || !pending) return null;

  const changedFields = Object.keys(pending.changes).filter(
    (k) => !["action", "community_id"].includes(k)
  );

  return (
    <Card className="mb-4 border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-amber-900 dark:text-amber-200">
            Admins Action! A community profile change is awaiting approval
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Remember, multiple admin authorisations are required to effect any changes on the community profile — four admins are required.
            A change touching <span className="font-medium text-foreground">{changedFields.join(", ")}</span> was submitted and needs your approval before it's saved.
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {pending.approvalsCollected}/{pending.approvalsRequired} approved
              {pending.approvedBy.length > 0 && ` (${pending.approvedBy.join(", ")})`}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {new Date(pending.createdAt).toLocaleDateString()}
            </span>
          </div>

          {pending.youHaveApproved ? (
            <p className="text-xs font-medium text-emerald-600 mt-2">✓ You've already approved this change</p>
          ) : !showApprove ? (
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={() => setShowApprove(true)}>Review & Approve</Button>
              <Button size="sm" variant="outline" onClick={handleReject}>Reject</Button>
            </div>
          ) : (
            <div className="mt-3 space-y-2 max-w-xs">
              <Label htmlFor="approve-password" className="text-xs">Enter your login password to approve</Label>
              <Input
                id="approve-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleApprove} disabled={submitting || !password}>
                  {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                  {submitting ? "Approving..." : "Confirm Approval"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setShowApprove(false); setPassword(""); }} disabled={submitting}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
