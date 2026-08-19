import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Loader2, CheckCircle2, Clock, Crown, Wallet, RefreshCw, UserCog, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useCommunityProfile } from "@/hooks/useCommunity";
import {
  useCommunityAuthorizations,
  PendingFinanceAuthorization,
  PendingPositionAuthorization,
} from "@/hooks/useCommunityAuthorizations";

const TYPE_LABEL: Record<PendingFinanceAuthorization["type"], string> = {
  topup: "Wallet Top-up",
  withdrawal: "Withdrawal",
  payout: "Member Payout",
  transfer: "Transfer",
};

function formatAmount(amount: string | number) {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 }).format(n || 0);
}

function timeLeft(expiresAt: string | null) {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const hrs = Math.floor(ms / 3_600_000);
  if (hrs >= 24) return `${Math.floor(hrs / 24)}d left`;
  if (hrs >= 1) return `${hrs}h left`;
  return `${Math.max(1, Math.floor(ms / 60_000))}m left`;
}

// A single merged, chronological queue — mixing finance and executive items
// tagged with a type so we know which shape/handlers to use, then sorted by
// when each request was created (newest first).
type QueueItem =
  | { kind: "finance"; created_at: string; data: PendingFinanceAuthorization }
  | { kind: "position"; created_at: string; data: PendingPositionAuthorization };

export default function CommunityAuthorizationsPage() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile: roleProfile, loading: roleLoading } = useCommunityProfile(communityId);
  const isAdmin = !!roleProfile?.isOwner || roleProfile?.role === "Admin" || roleProfile?.role === "admin";

  const {
    items: financeItems, hasSigned: hasSignedFinance, authorize: authorizeFinance,
    positionItems, hasSignedPosition, authorizePosition,
    loading, error, refresh, signingId,
  } = useCommunityAuthorizations(communityId);

  const [approvingPositionId, setApprovingPositionId] = useState<string | null>(null);
  const [positionPassword, setPositionPassword] = useState("");

  const handleAuthorizeFinance = async (txn: PendingFinanceAuthorization) => {
    const result = await authorizeFinance(txn.id);
    if (result.success) {
      toast({ title: "Signed", description: `Your authorization for this ${TYPE_LABEL[txn.type].toLowerCase()} was recorded.` });
    } else {
      toast({ title: "Couldn't authorize", description: result.error, variant: "destructive" });
    }
  };

  const handleAuthorizePosition = async (req: PendingPositionAuthorization) => {
    if (!positionPassword) return;
    const result = await authorizePosition(req.id, positionPassword);
    if (result.success) {
      toast({ title: "Signed", description: `Your authorization for ${req.position_title} was recorded.` });
      setApprovingPositionId(null);
      setPositionPassword("");
    } else {
      toast({ title: "Couldn't authorize", description: result.error, variant: "destructive" });
    }
  };

  if (!roleLoading && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <ShieldCheck className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Admins only</p>
          <p className="text-sm text-muted-foreground mt-1">You need to be a community officer to view authorizations.</p>
          <Button className="mt-4" variant="outline" onClick={() => navigate(-1)}>Go back</Button>
        </div>
      </div>
    );
  }

  // Merge both queues into one list, newest first.
  const queue: QueueItem[] = [
    ...positionItems.map((data): QueueItem => ({ kind: "position", created_at: data.created_at, data })),
    ...financeItems.map((data): QueueItem => ({ kind: "finance", created_at: data.created_at, data })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight">Authorizations</h1>
            <p className="text-xs text-muted-foreground truncate">{roleProfile?.name || "Community"}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Leadership appointments and finance actions both need signatures from multiple officers before they
            take effect. Sign the ones that are yours to authorize whenever you get the chance — there's no need
            for everyone to be online at once. Anything you've already signed stays here, waiting on the rest of the team.
          </p>
        </div>

        {loading && queue.length === 0 && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading authorizations…
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-10">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={refresh}>Try again</Button>
          </div>
        )}

        {!loading && !error && queue.length === 0 && (
          <div className="text-center py-16">
            <CheckCircle2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">Nothing pending</p>
            <p className="text-sm text-muted-foreground mt-1">There are no actions currently waiting for authorization.</p>
          </div>
        )}

        {!loading && !error && queue.map((item) => {
          if (item.kind === "position") {
            const req = item.data;
            const signed = hasSignedPosition(req);
            return (
              <Card key={`position-${req.id}`} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <UserCog className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm">Executive Authorization</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Requested by {req.requested_by_name || "a community officer"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={req.approvals_collected >= req.approvals_required ? "default" : "outline"} className="text-xs shrink-0">
                    {req.approvals_collected}/{req.approvals_required} signatures
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-3 rounded-md bg-muted/40 p-2.5">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={req.new_holder_photo || undefined} alt={req.new_holder_name} />
                    <AvatarFallback className="text-xs">{(req.new_holder_name || "?").slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{req.new_holder_name || "A member"}</p>
                    <p className="text-xs text-muted-foreground truncate">will become {req.position_title}</p>
                  </div>
                </div>

                {req.notes && (
                  <p className="text-sm text-muted-foreground mb-3">"{req.notes}"</p>
                )}

                {req.approvals.length > 0 && (
                  <div className="flex items-center -space-x-2 mb-3">
                    {req.approvals.map(a => (
                      <Avatar key={a.admin_id} className="h-7 w-7 border-2 border-background" title={a.name}>
                        <AvatarImage src={a.profile_photo || undefined} alt={a.name} />
                        <AvatarFallback className="text-[10px]">{a.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                )}

                {signed ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    You've signed this — waiting on other officers.
                  </div>
                ) : approvingPositionId !== req.id ? (
                  <Button className="w-full" onClick={() => setApprovingPositionId(req.id)}>
                    <ShieldCheck className="h-4 w-4 mr-2" /> Review & Authorize
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor={`page-approve-password-${req.id}`} className="text-xs">Enter your login password to authorize</Label>
                    <Input
                      id={`page-approve-password-${req.id}`}
                      type="password"
                      value={positionPassword}
                      onChange={(e) => setPositionPassword(e.target.value)}
                      placeholder="Password"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleAuthorizePosition(req)}
                        disabled={signingId === `position:${req.id}` || !positionPassword}
                      >
                        {signingId === `position:${req.id}` ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Authorizing…</>
                        ) : (
                          "Confirm Authorization"
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => { setApprovingPositionId(null); setPositionPassword(""); }}
                        disabled={signingId === `position:${req.id}`}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          }

          const txn = item.data;
          const signed = hasSignedFinance(txn);
          const left = timeLeft(txn.expires_at);
          return (
            <Card key={`finance-${txn.id}`} className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{TYPE_LABEL[txn.type]}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      Initiated by {txn.initiator_name || "a community officer"}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-sm">{formatAmount(txn.amount)}</p>
                  {left && (
                    <span className={`text-xs flex items-center gap-1 justify-end ${left === "Expired" ? "text-destructive" : "text-muted-foreground"}`}>
                      <Clock className="h-3 w-3" /> {left}
                    </span>
                  )}
                </div>
              </div>

              {txn.description && (
                <p className="text-sm text-muted-foreground mb-3">{txn.description}</p>
              )}

              {/* Signature progress */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge variant={txn.current_sigs >= txn.required_sigs ? "default" : "outline"} className="text-xs">
                  {txn.current_sigs}/{txn.required_sigs} signatures
                </Badge>
                <Badge variant={txn.has_president ? "default" : "outline"} className="text-xs gap-1">
                  <Crown className="h-3 w-3" /> President {txn.has_president ? "✓" : "pending"}
                </Badge>
                <Badge variant={txn.has_treasurer_or_fs ? "default" : "outline"} className="text-xs">
                  Treasurer/FS {txn.has_treasurer_or_fs ? "✓" : "pending"}
                </Badge>
              </div>

              {/* Who's signed so far */}
              {txn.authorizations.length > 0 && (
                <div className="flex items-center -space-x-2 mb-3">
                  {txn.authorizations.map(a => (
                    <Avatar key={a.id} className="h-7 w-7 border-2 border-background" title={`${a.name}${a.position_title ? ` — ${a.position_title}` : ""}`}>
                      <AvatarImage src={a.profile_photo || undefined} alt={a.name} />
                      <AvatarFallback className="text-[10px]">{a.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              )}

              {signed ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  You've signed this — waiting on other officers.
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleAuthorizeFinance(txn)}
                  disabled={signingId === `finance:${txn.id}`}
                >
                  {signingId === `finance:${txn.id}` ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Authorizing…</>
                  ) : (
                    <><ShieldCheck className="h-4 w-4 mr-2" /> Authorize</>
                  )}
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
