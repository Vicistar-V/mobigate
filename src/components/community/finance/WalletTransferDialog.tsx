import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search, AlertCircle, ChevronLeft, Loader2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransactionAuthorizationPanel } from "@/components/community/finance/TransactionAuthorizationPanel";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useIsMobile } from "@/hooks/use-mobile";

// ── Types ────────────────────────────────────────────────────────────────────
interface Member {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  email?: string;
}

interface WalletTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId?: string;
  walletBalance?: number;
  communityMembers?: Array<{ user_id: string; name: string; profile_photo?: string; email?: string; role?: string; }>;
}

export function WalletTransferDialog({
  open, onOpenChange, communityId, walletBalance = 0, communityMembers,
}: WalletTransferDialogProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // ── State ─────────────────────────────────────────────────────────────────
  const [searchQuery,    setSearchQuery]    = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [amount,         setAmount]         = useState("");
  const [description,    setDescription]    = useState("");
  const [step,           setStep]           = useState<"select" | "details" | "confirm" | "authorize">("select");

  // Real members from API
  const [members,        setMembers]        = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersError,   setMembersError]   = useState<string | null>(null);

  // ── Fetch members ─────────────────────────────────────────────────────────
  const fetchMembers = useCallback(async () => {
    // If parent passed non-empty members directly, use them — no fetch needed
    if (communityMembers && communityMembers.length > 0) {
      setMembers(communityMembers.map(m => ({
        id:     m.user_id,
        name:   m.name,
        avatar: m.profile_photo || "/placeholder.svg",
        role:   m.role,
        email:  m.email,
      })));
      return;
    }

    if (!communityId) return;
    setLoadingMembers(true);
    setMembersError(null);
    try {
      // members.php — no admin gate, returns all active members of any community
      const res = await fetch(
        `/api/community/members.php?community_id=${communityId}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      // members.php returns the array directly (not wrapped in a key)
      const list = Array.isArray(data) ? data : (data.members ?? []);
      const mapped: Member[] = list.map((m: any) => ({
        id:     m.user_id,
        name:   m.name || m.username || "Unknown",
        avatar: m.profile_photo || "/placeholder.svg",
        role:   m.role,
        email:  m.email,
      }));
      if (mapped.length === 0) setMembersError("No members found in this community.");
      else setMembers(mapped);
    } catch (e: any) {
      setMembersError("Could not load members. Check your connection and try again.");
    } finally {
      setLoadingMembers(false);
    }
  }, [communityId, communityMembers]);

  // Fetch whenever dialog opens
  useEffect(() => {
    if (open) fetchMembers();
  }, [open, fetchMembers]);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.email ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleContinue = () => {
    const transferAmount = parseFloat(amount);
    if (!amount || transferAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    if (transferAmount > walletBalance) {
      toast({ title: "Insufficient Balance", description: "Not enough balance for this transfer", variant: "destructive" });
      return;
    }
    if (!description.trim()) {
      toast({ title: "Description Required", description: "Please provide a reason for this transfer", variant: "destructive" });
      return;
    }
    setStep("confirm");
  };

  const handleConfirmTransfer = () => {
    toast({ title: "Transfer Successful!", description: `₦${parseFloat(amount).toLocaleString()} sent to ${selectedMember?.name}` });
    handleClose();
  };

  const handleAuthorizationExpired = () => {
    toast({ title: "Authorization Expired", description: "The 24-hour window has expired. Please start again.", variant: "destructive" });
    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSearchQuery(""); setSelectedMember(null);
      setAmount(""); setDescription(""); setStep("select");
    }, 300);
  };

  // ── Step: Select Member ───────────────────────────────────────────────────
  const renderSelectStep = () => (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9"
          autoComplete="off"
        />
      </div>

      {loadingMembers ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading community members…</p>
        </div>
      ) : membersError ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <Users className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-red-500 font-medium">{membersError}</p>
          <p className="text-xs text-muted-foreground">communityId: {communityId || "undefined"}</p>
          <Button size="sm" variant="outline" onClick={fetchMembers}>
            Retry
          </Button>
        </div>
      ) : filtered.length === 0 && searchQuery ? (
        <div className="text-center py-10">
          <p className="text-sm text-muted-foreground">No members match "{searchQuery}"</p>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-72 overflow-y-auto overscroll-contain pr-1" style={{ WebkitOverflowScrolling: "touch" }}>
          {filtered.map(member => (
            <Card
              key={member.id}
              className="p-3 cursor-pointer hover:bg-accent active:bg-accent/80 transition-colors"
              onClick={() => { setSelectedMember(member); setStep("details"); }}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="font-semibold">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{member.name}</p>
                  {member.email && <p className="text-xs text-muted-foreground truncate">{member.email}</p>}
                </div>
                <Badge variant="outline" className="shrink-0 text-xs capitalize">
                  {member.role || "Member"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loadingMembers && !membersError && members.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {filtered.length} of {members.length} member{members.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );

  // ── Step: Enter Details ───────────────────────────────────────────────────
  const renderDetailsStep = () => (
    <div className="space-y-4">
      <Card className="p-4 bg-muted">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={selectedMember?.avatar} alt={selectedMember?.name} />
            <AvatarFallback>{selectedMember?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">{selectedMember?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{selectedMember?.role || "Member"}</p>
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="amount">Transfer Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₦</span>
          <Input
            id="amount" type="number" inputMode="decimal"
            placeholder="0.00" value={amount}
            onChange={e => setAmount(e.target.value)}
            className="pl-8 text-lg"
            autoComplete="off"
          />
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <AlertCircle className="h-3 w-3 shrink-0" />
          Available: {formatLocalAmount(walletBalance, "NGN")} ({formatMobiAmount(walletBalance)})
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Transfer Description</Label>
        <Textarea
          id="description"
          placeholder="E.g., Event payment, Welfare support, etc."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="resize-none"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button onClick={handleContinue} className="w-full">Continue</Button>
        <Button variant="outline" onClick={() => setStep("select")} className="w-full">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>
    </div>
  );

  // ── Step: Confirm ─────────────────────────────────────────────────────────
  const renderConfirmStep = () => (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Send className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-bold">Confirm Transfer</h3>
        <p className="text-sm text-muted-foreground">Review and authorize this transaction</p>
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Recipient</span>
          <span className="font-medium">{selectedMember?.name}</span>
        </div>
        <div className="flex justify-between text-sm border-t pt-2">
          <span className="text-muted-foreground">Amount</span>
          <div className="text-right">
            <p className="font-bold text-lg">{formatLocalAmount(parseFloat(amount), "NGN")}</p>
            <p className="text-xs text-muted-foreground">({formatMobiAmount(parseFloat(amount))})</p>
          </div>
        </div>
        <div className="flex justify-between text-sm border-t pt-2">
          <span className="text-muted-foreground">Description</span>
          <span className="font-medium text-right max-w-[180px] line-clamp-2">{description}</span>
        </div>
      </Card>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-800">
          <strong>Note:</strong> This requires multi-signature authorization — 4 officers including the President and Treasurer/Financial Secretary must approve.
        </p>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button onClick={() => setStep("authorize")} className="w-full">Proceed to Authorization</Button>
        <Button variant="outline" onClick={() => setStep("details")} className="w-full">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>
    </div>
  );

  // ── Step: Authorize ───────────────────────────────────────────────────────
  const renderAuthorizeStep = () => (
    <TransactionAuthorizationPanel
      communityId={communityId}
      transactionType="payout"
      amount={parseFloat(amount)}
      recipient={selectedMember?.name ?? ""}
      description={description}
      metadata={{ recipient_user_id: selectedMember?.id, recipient_name: selectedMember?.name }}
      onConfirm={handleConfirmTransfer}
      onBack={() => setStep("confirm")}
      onExpire={handleAuthorizationExpired}
    />
  );

  // ── Dialog title based on step ────────────────────────────────────────────
  const stepTitle: Record<typeof step, string> = {
    select:    "Transfer Funds — Select Member",
    details:   "Transfer Funds — Enter Amount",
    confirm:   "Transfer Funds — Confirm",
    authorize: "Transfer Funds — Authorize",
  };

  const body = (
    <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6" style={{ WebkitOverflowScrolling: "touch" }}>
      {step === "select"    && renderSelectStep()}
      {step === "details"   && selectedMember && renderDetailsStep()}
      {step === "confirm"   && selectedMember && renderConfirmStep()}
      {step === "authorize" && selectedMember && renderAuthorizeStep()}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[92vh] flex flex-col overflow-hidden">
          <DrawerHeader className="pb-2 border-b shrink-0">
            <DrawerTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              {stepTitle[step]}
            </DrawerTitle>
          </DrawerHeader>
          {body}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-3 shrink-0 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            {stepTitle[step]}
          </DialogTitle>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  );
}
