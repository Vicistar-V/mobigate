import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AlertTriangle, Crown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EligibleAdmin {
  id: string;
  name: string;
  position: string;
  imageUrl?: string;
  is_founder?: boolean;
}

interface TransferOwnershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId: string;
  currentUserId: string;
  onTransferred: (newOwnerId: string) => void;
}

export function TransferOwnershipDialog({
  open, onOpenChange, communityId, currentUserId, onTransferred,
}: TransferOwnershipDialogProps) {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<EligibleAdmin[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedId(null);
    setPassword("");
    setConfirming(false);
    setLoadingAdmins(true);
    fetch(`/api/community/leadership.php?community_id=${encodeURIComponent(communityId)}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const list: EligibleAdmin[] = Array.isArray(d.executives) ? d.executives : [];
        setAdmins(list.filter((a) => a.id !== currentUserId && !a.is_founder));
      })
      .catch(() => setAdmins([]))
      .finally(() => setLoadingAdmins(false));
  }, [open, communityId, currentUserId]);

  const selected = admins.find((a) => a.id === selectedId) || null;

  const handleTransfer = async () => {
    if (!selectedId || !password) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/community/get.php", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "transfer_ownership",
          community_id: communityId,
          new_owner_id: selectedId,
          password,
        }),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok || !d?.success) throw new Error(d?.error || "Failed to transfer ownership");

      toast({
        title: "Ownership Transferred",
        description: `${selected?.name || "The selected admin"} is now the owner of this community.`,
      });
      onOpenChange(false);
      onTransferred(selectedId);
    } catch (e: any) {
      toast({ title: "Couldn't Transfer Ownership", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!submitting) onOpenChange(v); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" /> Transfer Ownership
          </DialogTitle>
          <DialogDescription>
            Hand over ownership of this community to one of its current admins. You'll remain an admin afterward — you just won't be the owner anymore.
          </DialogDescription>
        </DialogHeader>

        {!confirming ? (
          <div className="space-y-3">
            {loadingAdmins ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading admins…
              </div>
            ) : admins.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No other admins yet. Assign someone to a leadership position first — ownership can only be transferred to an existing admin.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {admins.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSelectedId(a.id)}
                    className={`w-full flex items-center gap-3 rounded-lg border p-2.5 text-left transition-colors ${
                      selectedId === a.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage src={a.imageUrl} alt={a.name} />
                      <AvatarFallback className="text-xs">{a.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{a.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{a.position}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 p-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                You're about to make <span className="font-medium text-foreground">{selected?.name}</span> the
                new owner of this community. This can't be undone by yourself — only the new owner could transfer it back.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="transfer-password" className="text-xs">Enter your login password to confirm</Label>
              <Input
                id="transfer-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
              />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          {!confirming ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button disabled={!selectedId} onClick={() => setConfirming(true)}>Continue</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setConfirming(false)} disabled={submitting}>Back</Button>
              <Button variant="destructive" onClick={handleTransfer} disabled={submitting || !password}>
                {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {submitting ? "Transferring…" : "Confirm Transfer"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
