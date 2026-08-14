// src/components/finance/TransactionAuthorizationPanel.tsx
import { useState, useEffect, useCallback } from "react";
import {
  Shield, CheckCircle, Clock, XCircle, User, Crown,
  Wallet, ChevronLeft, AlertTriangle, Loader2, RefreshCw, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const API = "/api/community";

interface Authorization { id: string; user_id: string; name: string; profile_photo?: string; position_title?: string; admin_rank: number; authorized_at: string; }

interface PendingTxn {
  id: string; type: string; amount: number; description: string;
  status: string; current_sigs: number; required_sigs: number;
  has_president: boolean; has_treasurer_or_fs: boolean;
  authorizations: Authorization[];
  expires_at: string; initiated_by: string;
  metadata?: Record<string, any>;
  initiator_name?: string; initiator_photo?: string;
}

interface TransactionAuthorizationPanelProps {
  communityId?: string;
  txnId?: string;                  // existing txn to authorize
  // OR pass these to initiate a new one:
  transactionType?: string;
  amount?: number;
  recipient?: string;
  description?: string;
  metadata?: Record<string, any>;
  onConfirm?: () => void;
  onBack?: () => void;
  onExpire?: () => void;
}

function fmt(n: number) { return "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2 }); }
function timeUntil(exp: string) {
  const ms = new Date(exp).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
}

// Determine badge for position
function positionBadge(auth: Authorization) {
  const t = (auth.position_title || "").toLowerCase();
  if (auth.admin_rank === 1 || t.includes("president") || t.includes("founder"))
    return { label: "President", color: "bg-purple-100 text-purple-700" };
  if (t.includes("treasurer") || t.includes("financial secretary") || t.includes("fin sec"))
    return { label: auth.position_title || "Treasurer", color: "bg-green-100 text-green-700" };
  if (t.includes("vice president") || t.includes("vp"))
    return { label: "VP", color: "bg-blue-100 text-blue-700" };
  if (t.includes("secretary"))
    return { label: "Secretary", color: "bg-amber-100 text-amber-700" };
  return { label: auth.position_title || "Officer", color: "bg-gray-100 text-gray-600" };
}

export function TransactionAuthorizationPanel({
  communityId, txnId: existingTxnId,
  transactionType, amount = 0, recipient, description = "", metadata,
  onConfirm, onBack, onExpire,
}: TransactionAuthorizationPanelProps) {
  const [txnId,       setTxnId]       = useState<string | null>(existingTxnId ?? null);
  const [txn,         setTxn]         = useState<PendingTxn | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [authorizing, setAuthorizing] = useState(false);
  const [executing,   setExecuting]   = useState(false);
  const [hasAuthorized, setHasAuthorized] = useState(false);

  // Create or fetch the pending transaction
  const initiateOrFetch = useCallback(async () => {
    if (!communityId) return;
    setLoading(true);
    try {
      if (!txnId) {
        // Initiate a new pending transaction
        const res = await fetch(`${API}/finance.php`, {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "initiate_transaction", community_id: communityId,
            type: transactionType, amount, description,
            metadata: { ...metadata, recipient_name: recipient },
          }),
        });
        const d = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(d.error || "Failed to initiate");
        setTxnId(d.txn_id);
        toast.success("Transaction pending authorization");
      }
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [communityId, txnId, transactionType, amount, description, metadata, recipient]);

  const fetchTxn = useCallback(async (id?: string) => {
    const tid = id ?? txnId;
    if (!tid || !communityId) return;
    try {
      const res = await fetch(`${API}/finance.php?community_id=${communityId}`, { credentials: "include" });
      if (!res.ok) return;
      const d = await res.json();
      const found = (d.pendingTxns ?? []).find((t: any) => t.id === tid);
      if (found) {
        setTxn(found);
        // Check if current user already signed
        const me = await fetch("/api/community/session_helper.php", { credentials: "include" }).then(r => r.json()).catch(() => null);
        if (me?.user_id && found.authorizations?.some((a: any) => a.user_id === me.user_id)) {
          setHasAuthorized(true);
        }
      }
    } catch {}
  }, [communityId, txnId]);

  useEffect(() => {
    if (!txnId) { initiateOrFetch(); }
    else { fetchTxn(txnId); }
  }, [txnId]);

  // Auto-refresh every 15 seconds while pending
  useEffect(() => {
    if (!txn || txn.status === "executed" || txn.status === "rejected" || txn.status === "expired") return;
    const interval = setInterval(() => fetchTxn(), 15000);
    return () => clearInterval(interval);
  }, [txn, fetchTxn]);

  // Check expiry
  useEffect(() => {
    if (txn?.expires_at && new Date(txn.expires_at).getTime() < Date.now()) {
      onExpire?.();
    }
  }, [txn, onExpire]);

  const handleAuthorize = async () => {
    if (!txnId || !communityId) return;
    setAuthorizing(true);
    try {
      const res = await fetch(`${API}/finance.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "authorize_transaction", community_id: communityId, txn_id: txnId }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Authorization failed");
      setHasAuthorized(true);
      toast.success(d.message || "Authorization recorded");
      fetchTxn();
      if (d.fully_authorized) {
        toast.success("All required signatures collected! Transaction can now be executed.");
      }
    } catch (e: any) { toast.error(e.message); }
    finally { setAuthorizing(false); }
  };

  const handleExecute = async () => {
    if (!txnId || !communityId) return;
    setExecuting(true);
    try {
      const res = await fetch(`${API}/finance.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "execute_transaction", community_id: communityId, txn_id: txnId }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Execution failed");
      toast.success(d.message || "Transaction executed successfully!");
      onConfirm?.();
    } catch (e: any) { toast.error(e.message); }
    finally { setExecuting(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Initiating transaction…</p>
    </div>
  );

  const sigCount   = txn?.current_sigs ?? 0;
  const required   = txn?.required_sigs ?? 4;
  const pctDone    = Math.min(100, (sigCount / required) * 100);
  const hasPresident = txn?.has_president;
  const hasTreasFS   = txn?.has_treasurer_or_fs;
  const fullyAuth    = txn?.status === "authorized";
  const executed     = txn?.status === "executed";

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-primary/10"><Shield className="h-5 w-5 text-primary" /></div>
        <div>
          <h3 className="font-bold text-base">Multi-Signature Authorization</h3>
          <p className="text-xs text-muted-foreground">4 officers required to authorize</p>
        </div>
        {txn && (
          <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={() => fetchTxn()}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Transaction summary */}
      {(txn || amount > 0) && (
        <div className="p-3.5 rounded-xl bg-muted/40 border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Transaction</span>
            <span className="font-medium capitalize">{txn?.type ?? transactionType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-bold text-primary">{fmt(txn?.amount ?? amount)}</span>
          </div>
          {(txn?.description || description) && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Purpose</span>
              <span className="font-medium text-right max-w-[180px] line-clamp-2">{txn?.description ?? description}</span>
            </div>
          )}
          {recipient && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Recipient</span>
              <span className="font-medium">{recipient}</span>
            </div>
          )}
          {txn?.expires_at && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Expires</span>
              <span className={cn("font-medium text-xs", new Date(txn.expires_at).getTime() - Date.now() < 3600000 ? "text-red-500" : "text-muted-foreground")}>
                <Clock className="h-3 w-3 inline mr-0.5" />{timeUntil(txn.expires_at)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Signatures</span>
          <span className={cn(sigCount >= required ? "text-green-600" : "text-primary")}>{sigCount}/{required}</span>
        </div>
        <Progress value={pctDone} className="h-2.5" />
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={cn("flex items-center gap-1.5 p-2 rounded-lg", hasPresident ? "bg-green-50 text-green-700" : "bg-muted text-muted-foreground")}>
            {hasPresident ? <CheckCircle className="h-3.5 w-3.5 shrink-0" /> : <Clock className="h-3.5 w-3.5 shrink-0" />}
            <span className="font-medium">President</span>
            {hasPresident ? <Badge className="ml-auto text-[9px] bg-green-100 text-green-700 px-1">✓</Badge> : <Badge variant="outline" className="ml-auto text-[9px] px-1">Required</Badge>}
          </div>
          <div className={cn("flex items-center gap-1.5 p-2 rounded-lg", hasTreasFS ? "bg-green-50 text-green-700" : "bg-muted text-muted-foreground")}>
            {hasTreasFS ? <CheckCircle className="h-3.5 w-3.5 shrink-0" /> : <Clock className="h-3.5 w-3.5 shrink-0" />}
            <span className="font-medium text-[10px]">Treasurer/FS</span>
            {hasTreasFS ? <Badge className="ml-auto text-[9px] bg-green-100 text-green-700 px-1">✓</Badge> : <Badge variant="outline" className="ml-auto text-[9px] px-1">Required</Badge>}
          </div>
        </div>
      </div>

      {/* Authorizations so far */}
      {(txn?.authorizations?.length ?? 0) > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Officers who have authorized</p>
          {txn!.authorizations.map(auth => {
            const badge = positionBadge(auth);
            return (
              <div key={auth.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-green-50/50 border border-green-100">
                <Avatar className="h-8 w-8 border-2 border-green-200">
                  <AvatarImage src={auth.profile_photo} />
                  <AvatarFallback className="text-xs">{(auth.name || "U")[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{auth.name}</p>
                  <Badge className={cn("text-[10px] px-1.5 mt-0.5", badge.color)}>{badge.label}</Badge>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
              </div>
            );
          })}
        </div>
      )}

      {/* Requirements info */}
      <div className="p-3 rounded-xl border bg-amber-50/50 border-amber-200">
        <p className="text-xs font-semibold text-amber-700 mb-1.5">Authorization Requirements</p>
        <ul className="text-xs text-amber-600 space-y-1">
          <li className="flex items-center gap-1.5"><Shield className="h-3 w-3" /> Minimum 4 officer signatures</li>
          <li className="flex items-center gap-1.5"><Crown className="h-3 w-3" /> President must authorize</li>
          <li className="flex items-center gap-1.5"><Wallet className="h-3 w-3" /> Treasurer or Financial Secretary must authorize</li>
          <li className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Valid for 24 hours from initiation</li>
        </ul>
      </div>

      {/* Status indicator */}
      {executed && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">Transaction Executed Successfully</p>
        </div>
      )}

      {/* Actions */}
      {!executed && (
        <div className="space-y-2">
          {!hasAuthorized && !fullyAuth && (
            <Button className="w-full gap-2" onClick={handleAuthorize} disabled={authorizing}>
              {authorizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              {authorizing ? "Authorizing…" : "Authorize This Transaction"}
            </Button>
          )}
          {hasAuthorized && !fullyAuth && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <p className="text-sm">Your authorization recorded. Waiting for {required - sigCount} more signature{required - sigCount !== 1 ? "s" : ""}.</p>
            </div>
          )}
          {fullyAuth && (
            <Button className="w-full gap-2 bg-green-600 hover:bg-green-700" onClick={handleExecute} disabled={executing}>
              {executing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {executing ? "Executing…" : "Execute Transaction Now"}
            </Button>
          )}
          {onBack && (
            <Button variant="outline" className="w-full" onClick={onBack}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
