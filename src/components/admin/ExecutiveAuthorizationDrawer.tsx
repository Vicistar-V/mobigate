// src/components/admin/ExecutiveAuthorizationDrawer.tsx
import { useState, useEffect, useCallback } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield, CheckCircle, XCircle, Eye, EyeOff, Crown,
  Loader2, ChevronLeft, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const API = "/api/community";

interface Executive {
  user_id: string;
  username: string;
  profile_photo?: string;
  position?: string;
  admin_rank: number;
}

type AuthStatus = "pending" | "authorized" | "rejected";

interface ExecAuthState {
  exec: Executive;
  status: AuthStatus;
  password: string;
  showPassword: boolean;
  loading: boolean;
  error?: string;
}

interface ExecutiveAuthorizationDrawerProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  communityId?: string;
  actionTitle: string;
  actionDescription?: string;
  requiredCount?: number;      // how many must authorize (default: all available, max 4)
  onAuthorized: () => void;    // called when enough executives have authorized
}

export function ExecutiveAuthorizationDrawer({
  open, onOpenChange, communityId,
  actionTitle, actionDescription,
  requiredCount,
  onAuthorized,
}: ExecutiveAuthorizationDrawerProps) {
  const [loading,   setLoading]   = useState(false);
  const [execStates, setExecStates] = useState<ExecAuthState[]>([]);
  const [executing, setExecuting] = useState(false);

  const fetchExecutives = useCallback(async () => {
    if (!communityId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/leadership.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_top_executives", community_id: communityId }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.executives?.length) {
        setExecStates(d.executives.map((e: Executive): ExecAuthState => ({
          exec: e, status: "pending", password: "", showPassword: false, loading: false,
        })));
      } else {
        toast.error("No executives found for this community");
      }
    } catch {
      toast.error("Failed to load executives");
    } finally { setLoading(false); }
  }, [communityId]);

  useEffect(() => {
    if (open) {
      fetchExecutives();
    } else {
      // Reset on close
      setExecStates([]);
      setExecuting(false);
    }
  }, [open, fetchExecutives]);

  const updateState = (userId: string, patch: Partial<ExecAuthState>) => {
    setExecStates(prev => prev.map(s => s.exec.user_id === userId ? { ...s, ...patch } : s));
  };

  const handleAuthorize = async (execId: string, password: string) => {
    if (!password.trim()) { toast.error("Enter your password"); return; }
    if (!communityId) return;
    updateState(execId, { loading: true, error: undefined });
    try {
      const res = await fetch(`${API}/leadership.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_executive_auth", community_id: communityId, executive_id: execId, password }),
      });
      const d = await res.json().catch(() => ({}));
      if (d.authorized) {
        updateState(execId, { status: "authorized", loading: false, password: "", error: undefined });
        toast.success("Authorization recorded");
      } else {
        updateState(execId, { status: "rejected", loading: false, error: d.error || "Incorrect password" });
        // Reset to pending after 2s so they can retry
        setTimeout(() => updateState(execId, { status: "pending", error: undefined }), 2000);
      }
    } catch {
      updateState(execId, { loading: false, error: "Network error — try again" });
    }
  };

  const authorizedCount = execStates.filter(s => s.status === "authorized").length;
  const totalCount      = execStates.length;
  const required        = requiredCount ?? Math.min(totalCount, 4);
  const pct             = totalCount > 0 ? (authorizedCount / required) * 100 : 0;
  const canExecute      = authorizedCount >= required && required > 0;

  const handleExecute = async () => {
    setExecuting(true);
    try {
      await onAuthorized();
      onOpenChange(false);
    } catch { setExecuting(false); }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl flex flex-col p-0">
        <SheetTitle className="sr-only">Executive Authorization</SheetTitle>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b shrink-0">
          <div className="p-2 rounded-xl bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-base">Executive Authorization</h2>
            <p className="text-xs text-muted-foreground">{actionDescription || actionTitle}</p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 space-y-5"
          style={{ WebkitOverflowScrolling: "touch" }}>

          {/* Action card */}
          <div className="p-3.5 rounded-xl bg-muted/50 border space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pending Action</p>
            <p className="text-sm font-bold">{actionTitle}</p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Authorizations</span>
              <span className={cn(canExecute ? "text-green-600" : "text-primary")}>
                {authorizedCount}/{required} required
              </span>
            </div>
            <Progress value={Math.min(pct, 100)} className="h-2.5" />
            <p className="text-xs text-muted-foreground">
              Each top executive must enter their login password to authorize this action.
            </p>
          </div>

          {/* Executive list */}
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading executives…</p>
            </div>
          ) : execStates.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Crown className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No executives found for this community.</p>
              <p className="text-xs mt-1">Assign executive positions first in the Leadership tab.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {execStates.map((s, idx) => (
                <div key={s.exec.user_id}
                  className={cn("p-4 rounded-xl border-2 transition-colors",
                    s.status === "authorized" ? "border-green-300 bg-green-50" :
                    s.status === "rejected"   ? "border-red-300 bg-red-50" :
                    "border-border bg-card"
                  )}>
                  {/* Executive info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={s.exec.profile_photo} />
                        <AvatarFallback>{(s.exec.username || "E")[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="absolute -top-1 -left-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{s.exec.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.exec.position || `Executive (Rank ${s.exec.admin_rank})`}</p>
                    </div>
                    {s.status === "authorized" && (
                      <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
                    )}
                    {s.status === "rejected" && (
                      <XCircle className="h-6 w-6 text-red-500 shrink-0" />
                    )}
                  </div>

                  {/* Password input */}
                  {s.status === "pending" && (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={s.showPassword ? "text" : "password"}
                          placeholder="Enter login password…"
                          value={s.password}
                          onChange={e => updateState(s.exec.user_id, { password: e.target.value })}
                          onKeyDown={e => { if (e.key === "Enter") handleAuthorize(s.exec.user_id, s.password); }}
                          className="pl-9 pr-9 h-11"
                          disabled={s.loading}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => updateState(s.exec.user_id, { showPassword: !s.showPassword })}>
                          {s.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <Button
                        onClick={() => handleAuthorize(s.exec.user_id, s.password)}
                        disabled={s.loading || !s.password.trim()}
                        className="h-11 px-4 shrink-0"
                      >
                        {s.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize"}
                      </Button>
                    </div>
                  )}

                  {s.status === "authorized" && (
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">Authorization confirmed</span>
                    </div>
                  )}

                  {s.status === "rejected" && s.error && (
                    <div className="flex items-center gap-2 mt-1">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">{s.error}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Requirements note */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
            <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>
              {required} executive{required !== 1 ? "s" : ""} must authorize this action using their login password.
              {totalCount < required && totalCount > 0 && ` (Only ${totalCount} executive${totalCount !== 1 ? "s" : ""} available)`}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-6 pt-3 border-t shrink-0 space-y-2">
          {canExecute ? (
            <Button
              className="w-full h-12 gap-2 bg-green-600 hover:bg-green-700"
              onClick={handleExecute}
              disabled={executing}
            >
              {executing
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <CheckCircle className="h-4 w-4" />}
              {executing ? "Executing…" : "Execute Action"}
            </Button>
          ) : (
            <Button className="w-full h-12" disabled>
              Waiting for {required - authorizedCount} more authorization{required - authorizedCount !== 1 ? "s" : ""}
            </Button>
          )}
          <Button variant="outline" className="w-full h-11" onClick={() => onOpenChange(false)}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
