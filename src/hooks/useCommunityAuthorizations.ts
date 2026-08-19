import { useCallback, useEffect, useState } from "react";
import { useCurrentUserId } from "@/hooks/useWindowData";

const API = "/api";

export interface PendingFinanceAuthorization {
  id: string;
  community_id: string;
  type: "topup" | "withdrawal" | "payout" | "transfer";
  amount: string;
  description: string | null;
  metadata?: Record<string, unknown>;
  status: "pending_auth" | "authorized" | "executed" | "rejected" | "expired";
  required_sigs: number;
  current_sigs: number;
  has_president: 0 | 1;
  has_treasurer_or_fs: 0 | 1;
  initiated_by: string | null;
  initiator_name?: string;
  initiator_photo?: string | null;
  expires_at: string | null;
  created_at: string;
  authorizations: {
    id: string;
    user_id: string;
    name: string;
    profile_photo?: string | null;
    position_title?: string | null;
    admin_rank?: number | null;
    authorized_at: string;
  }[];
}

// Kept as an alias so any existing imports of the old name keep working.
export type PendingAuthorization = PendingFinanceAuthorization;

export interface PendingPositionAuthorization {
  id: string;
  community_id: string;
  position_id: string;
  position_title: string;
  new_holder_id: string;
  new_holder_name?: string;
  new_holder_photo?: string | null;
  previous_holder_id: string | null;
  notes: string | null;
  requested_by: string;
  requested_by_name?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  approvals_required: number;
  approvals_collected: number;
  created_at: string;
  approvals: {
    request_id: string;
    admin_id: string;
    name: string;
    profile_photo?: string | null;
    approved_at: string;
  }[];
}

export function useCommunityAuthorizations(communityId: string | undefined) {
  const currentUserId = useCurrentUserId();
  const [financeItems, setFinanceItems] = useState<PendingFinanceAuthorization[]>([]);
  const [positionItems, setPositionItems] = useState<PendingPositionAuthorization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signingId, setSigningId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!communityId) { setLoading(false); return; }
    setLoading(true);
    setError(null);

    const [financeResult, leadershipResult] = await Promise.allSettled([
      fetch(`${API}/community/finance.php?community_id=${encodeURIComponent(communityId)}`, { credentials: "include" })
        .then(res => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`)))),
      fetch(`${API}/community/leadership.php?community_id=${encodeURIComponent(communityId)}`, { credentials: "include" })
        .then(res => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`)))),
    ]);

    if (financeResult.status === "fulfilled") {
      setFinanceItems(Array.isArray(financeResult.value.pendingTxns) ? financeResult.value.pendingTxns : []);
    } else {
      console.error("[useCommunityAuthorizations] finance.php failed:", financeResult.reason);
      // Don't wipe out whatever was last successfully loaded — just leave it be.
      setFinanceItems(prev => prev);
    }

    if (leadershipResult.status === "fulfilled") {
      setPositionItems(Array.isArray(leadershipResult.value.pendingPositionRequests) ? leadershipResult.value.pendingPositionRequests : []);
    } else {
      console.error("[useCommunityAuthorizations] leadership.php failed:", leadershipResult.reason);
      setPositionItems(prev => prev);
    }

    // Only surface an error if BOTH failed — a single failed source (most
    // often finance, which needs a wallet/role setup some admins may lack)
    // should never hide the other source's data.
    if (financeResult.status === "rejected" && leadershipResult.status === "rejected") {
      setError("Failed to load authorizations");
    }

    setLoading(false);
  }, [communityId]);

  useEffect(() => { refresh(); }, [refresh]);

  const hasSignedFinance = useCallback(
    (item: PendingFinanceAuthorization) => item.authorizations.some(a => a.user_id === currentUserId),
    [currentUserId]
  );
  const hasSignedPosition = useCallback(
    (item: PendingPositionAuthorization) => item.approvals.some(a => a.admin_id === currentUserId),
    [currentUserId]
  );

  const authorizeFinance = useCallback(async (txnId: string): Promise<{ success: boolean; error?: string }> => {
    if (!communityId) return { success: false, error: "Missing community" };
    setSigningId(`finance:${txnId}`);
    try {
      const res = await fetch(`${API}/community/finance.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ community_id: communityId, action: "authorize_transaction", txn_id: txnId }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok || !result?.success) {
        return { success: false, error: result?.error || "Could not authorize this transaction" };
      }
      await refresh();
      return { success: true };
    } catch {
      return { success: false, error: "Cannot reach server" };
    } finally {
      setSigningId(null);
    }
  }, [communityId, refresh]);

  const authorizePosition = useCallback(async (requestId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!communityId) return { success: false, error: "Missing community" };
    setSigningId(`position:${requestId}`);
    try {
      const res = await fetch(`${API}/community/leadership.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ community_id: communityId, action: "authorize_position_assignment", request_id: requestId, password }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok || !result?.success) {
        return { success: false, error: result?.error || "Could not authorize this appointment" };
      }
      await refresh();
      return { success: true };
    } catch {
      return { success: false, error: "Cannot reach server" };
    } finally {
      setSigningId(null);
    }
  }, [communityId, refresh]);

  // Only items still awaiting signatures
  const pendingFinance = financeItems.filter(i => i.status === "pending_auth");
  const pendingPositions = positionItems.filter(i => i.status === "pending");

  // Items that specifically still need THIS admin's signature
  const needsMySignatureCount =
    pendingFinance.filter(i => !hasSignedFinance(i)).length +
    pendingPositions.filter(i => !hasSignedPosition(i)).length;

  return {
    // Finance
    items: pendingFinance,
    hasSigned: hasSignedFinance,
    authorize: authorizeFinance,
    // Executive/position assignments
    positionItems: pendingPositions,
    hasSignedPosition,
    authorizePosition,
    // Shared
    needsMySignatureCount,
    loading,
    error,
    refresh,
    signingId,
    currentUserId,
  };
}