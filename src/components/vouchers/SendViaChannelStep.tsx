import { useState } from "react";
import { ArrowLeft, Mail, MessageCircle, Phone, Send, CheckCircle2, Info, Copy, Check, Plus, Minus, Users, X, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { MobigateUserSearch, MobigateUser } from "@/components/profile/MobigateUserSearch";
import { useCurrentUserId } from "@/hooks/useWindowData";

export type ChannelType = "email" | "mobiChat" | "whatsApp" | "sms";

interface SendViaChannelStepProps {
  channel: ChannelType;
  remainingMobi: number;
  onBack: () => void;
  onSendComplete: (amount: number, recipientLabel: string) => void;
}

const formatNum = (n: number) => n.toLocaleString("en-NG");

const generatePin = () => {
  let pin = "";
  for (let i = 0; i < 16; i++) pin += Math.floor(Math.random() * 10).toString();
  return pin;
};

const CHANNEL_CONFIG: Record<ChannelType, { label: string; icon: typeof Mail; color: string; bgColor: string; placeholder: string; inputMode: "email" | "tel" | "text"; recipientLabel: string; buttonColor: string }> = {
  email: { label: "Send via Email", icon: Mail, color: "text-blue-600", bgColor: "bg-blue-500/10", placeholder: "recipient@email.com", inputMode: "email", recipientLabel: "Email", buttonColor: "bg-blue-600 hover:bg-blue-700" },
  mobiChat: { label: "Send via Mobi-Chat", icon: MessageCircle, color: "text-primary", bgColor: "bg-primary/10", placeholder: "Search Mobigate user...", inputMode: "text", recipientLabel: "Mobi-Chat", buttonColor: "" },
  whatsApp: { label: "Send via WhatsApp", icon: MessageCircle, color: "text-emerald-600", bgColor: "bg-emerald-500/10", placeholder: "+234 XXX XXX XXXX", inputMode: "tel", recipientLabel: "WhatsApp", buttonColor: "bg-emerald-600 hover:bg-emerald-700" },
  sms: { label: "Send via SMS", icon: Phone, color: "text-orange-600", bgColor: "bg-orange-500/10", placeholder: "+234 XXX XXX XXXX", inputMode: "tel", recipientLabel: "SMS", buttonColor: "bg-orange-600 hover:bg-orange-700" },
};

interface RecipientAllocation {
  user: MobigateUser;
  amount: number;
}

interface ContactRecipient {
  id: string;
  contact: string;
  amount: number;
}

// Mock sender profile data
const MOCK_SENDER = {
  name: "Adewale Ogundimu",
  username: "@adewale_ogundimu",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  mobiId: "MOBI-2847391",
};

export function SendViaChannelStep({ channel, remainingMobi, onBack, onSendComplete }: SendViaChannelStepProps) {
  const { toast } = useToast();
  const currentUserId = useCurrentUserId();
  const config = CHANNEL_CONFIG[channel];
  const Icon = config.icon;
  // Common state
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [pinCopied, setPinCopied] = useState(false);

  // MobiChat multi-recipient state
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<RecipientAllocation[]>([]);
  const [sentResults, setSentResults] = useState<Array<{ user?: MobigateUser; contact?: string; amount: number; pin: string }>>([]);

  // Contact-based multi-recipient state (email, whatsApp, sms)
  const [contactRecipients, setContactRecipients] = useState<ContactRecipient[]>([]);
  const [newContact, setNewContact] = useState("");

  const quickAmounts = [100, 500, 1000, 5000];

  // ─── Computed ───
  const isMobiChat = channel === "mobiChat";
  const totalAllocated = isMobiChat
    ? selectedUsers.reduce((s, r) => s + r.amount, 0)
    : contactRecipients.reduce((s, r) => s + r.amount, 0);
  const availableForAllocation = remainingMobi - totalAllocated;
  const recipientCount = isMobiChat ? selectedUsers.length : contactRecipients.length;

  // ─── Validation ───
  const isValidContact = (val: string) => {
    if (channel === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (channel === "whatsApp" || channel === "sms") return val.replace(/\D/g, "").length >= 10;
    return false;
  };

  const canSend = recipientCount > 0
    && (isMobiChat
      ? selectedUsers.every(r => r.amount > 0)
      : contactRecipients.every(r => r.amount > 0))
    && totalAllocated > 0
    && totalAllocated <= remainingMobi;

  // ─── Contact management ───
  const addContact = () => {
    const trimmed = newContact.trim();
    if (!trimmed || !isValidContact(trimmed)) {
      toast({ title: "Invalid", description: channel === "email" ? "Enter a valid email address" : "Enter a valid phone number", variant: "destructive" });
      return;
    }
    if (contactRecipients.some(r => r.contact === trimmed)) {
      toast({ title: "Duplicate", description: "This recipient is already added", variant: "destructive" });
      return;
    }
    setContactRecipients(prev => [...prev, { id: crypto.randomUUID(), contact: trimmed, amount: 0 }]);
    setNewContact("");
  };

  const removeContact = (id: string) => {
    setContactRecipients(prev => prev.filter(r => r.id !== id));
  };

  const setContactAmount = (id: string, newAmount: number) => {
    setContactRecipients(prev => prev.map(r => {
      if (r.id !== id) return r;
      const otherAllocated = prev.filter(x => x.id !== id).reduce((s, x) => s + x.amount, 0);
      const maxForThis = remainingMobi - otherAllocated;
      return { ...r, amount: Math.max(0, Math.min(newAmount, maxForThis)) };
    }));
  };

  // ─── MobiChat user management ───
  const handleMultiUsersSelected = (users: MobigateUser[]) => {
    setSelectedUsers(prev => {
      const existing = new Map(prev.map(r => [r.user.id, r]));
      return users.map(u => existing.get(u.id) || { user: u, amount: 0 });
    });
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(r => r.user.id !== userId));
  };

  const setUserAmount = (userId: string, newAmount: number) => {
    setSelectedUsers(prev => prev.map(r => {
      if (r.user.id !== userId) return r;
      const otherAllocated = prev.filter(x => x.user.id !== userId).reduce((s, x) => s + x.amount, 0);
      const maxForThis = remainingMobi - otherAllocated;
      return { ...r, amount: Math.max(0, Math.min(newAmount, maxForThis)) };
    }));
  };

  const splitEvenly = () => {
    if (isMobiChat) {
      if (selectedUsers.length === 0) return;
      const perUser = Math.floor(remainingMobi / selectedUsers.length);
      setSelectedUsers(prev => prev.map(r => ({ ...r, amount: perUser })));
    } else {
      if (contactRecipients.length === 0) return;
      const perUser = Math.floor(remainingMobi / contactRecipients.length);
      setContactRecipients(prev => prev.map(r => ({ ...r, amount: perUser })));
    }
  };

  // ─── Send ───
  const handleSend = () => {
    if (!canSend) return;
    setSending(true);

    const results = isMobiChat
      ? selectedUsers.map(r => ({ user: r.user, amount: r.amount, pin: generatePin() }))
      : contactRecipients.map(r => ({ contact: r.contact, amount: r.amount, pin: generatePin() }));

    setSentResults(results);
    setTimeout(() => { setSending(false); setSent(true); }, 3000);
  };

  const handleCopyPin = (pin: string) => {
    navigator.clipboard.writeText(pin).catch(() => {});
    setPinCopied(true);
    toast({ title: "PIN Copied", description: "Voucher PIN copied to clipboard" });
    setTimeout(() => setPinCopied(false), 2000);
  };

  const handleContinue = () => {
    const totalSent = sentResults.reduce((s, r) => s + r.amount, 0);
    const names = sentResults.map(r => r.user?.name || r.contact || "").join(", ");
    onSendComplete(totalSent, names);
  };

  // ─── SENDING LOADING ───
  if (sending) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/50 animate-spin" />
          <div className="absolute inset-3 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.1)" }}>
            <Icon className={`h-6 w-6 ${config.color}`} />
          </div>
        </div>
        <p className="text-base font-semibold text-foreground mb-1">Sending via {config.recipientLabel}...</p>
        <p className="text-xs text-muted-foreground">
          M{formatNum(totalAllocated)} to {recipientCount} recipient{recipientCount > 1 ? "s" : ""}
        </p>
        <div className="flex gap-1.5 mt-6">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-2 w-8 rounded-full bg-primary/30 overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ animation: `shimmer 1.5s ease-in-out infinite ${i * 0.3}s` }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── SENT SUCCESS ───
  if (sent) {
    const totalSent = sentResults.reduce((s, r) => s + r.amount, 0);
    return (
      <div className="bg-background min-h-screen pb-28">
        <div className="flex flex-col items-center justify-center px-6 pt-12 pb-6">
          <div className="relative w-24 h-24 mb-6 animate-scale-in">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-2 rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1 animate-fade-in">
            {sentResults.length > 1 ? "PINs Sent!" : "PIN Sent!"}
          </h2>
          <p className="text-2xl font-black text-emerald-600 mb-1 animate-fade-in">M{formatNum(totalSent)}</p>
          <p className="text-sm text-muted-foreground mb-4 animate-fade-in">
            Sent to {sentResults.length} recipient{sentResults.length > 1 ? "s" : ""} via {config.recipientLabel}
          </p>
        </div>

        {/* Sender Identity */}
        <div className="px-4 mb-4">
          <div className="rounded-xl border border-border/50 bg-card p-3 animate-fade-in">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sent By</p>
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 border-2 border-primary/20">
                <AvatarImage src={MOCK_SENDER.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">{MOCK_SENDER.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{MOCK_SENDER.name}</p>
                <p className="text-xs text-muted-foreground">{MOCK_SENDER.username}</p>
                <p className="text-[10px] text-muted-foreground/70 font-mono">{MOCK_SENDER.mobiId}</p>
              </div>
              <div className="shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VOUCHER PIN SENT label */}
        <div className="px-4 mb-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Voucher PIN{sentResults.length > 1 ? "s" : ""} Sent</p>
        </div>
        <div className="px-4 space-y-3 mb-6">
          {sentResults.map(({ user, contact, amount: amt, pin }, idx) => (
            <div key={user?.id || contact || idx} className="rounded-xl border border-border/50 bg-card p-3 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                {user ? (
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback><span className="text-xs">{user.name[0]}</span></AvatarFallback>
                  </Avatar>
                ) : (
                  <div className={`h-9 w-9 rounded-full ${config.bgColor} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user?.name || contact}</p>
                  {user && <p className="text-[10px] text-muted-foreground">{user.username}</p>}
                </div>
                <p className="text-sm font-bold text-emerald-600">M{formatNum(amt)}</p>
              </div>
              <div className="flex items-center justify-between gap-2 bg-muted/50 rounded-lg p-2.5">
                <span className="font-mono text-xs font-bold text-foreground tracking-[0.15em]">
                  {pin.slice(0, 4)}-{pin.slice(4, 8)}-{pin.slice(8, 12)}-{pin.slice(12)}
                </span>
                <button
                  onClick={() => handleCopyPin(pin)}
                  className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center touch-manipulation active:scale-90 shrink-0"
                >
                  <Copy className="h-3.5 w-3.5 text-primary" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Manual recharge notice */}
        <div className="px-4 mb-6">
          <div className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-4 animate-fade-in">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground mb-1">Manual Recharge Required</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Each recipient must enter their PIN manually in the <span className="font-semibold text-foreground">'Redeem Voucher'</span> section to credit their wallet.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 safe-area-bottom">
          <Button onClick={handleContinue} className="w-full h-12 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.97]">
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // ─── MAIN FORM ───
  return (
    <div className="bg-background min-h-screen pb-28">
      {/* Sticky header */}
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground">{config.label}</h1>
            <p className="text-xs text-muted-foreground">Send PINs to multiple recipients</p>
          </div>
        </div>
        {/* Balance banner */}
        <div className="px-4 pb-3">
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Available to Share</p>
              <p className="text-xl font-bold text-foreground">M{formatNum(remainingMobi)}</p>
            </div>
            <div className="text-right">
              {totalAllocated > 0 ? (
                <>
                  <p className="text-xs text-muted-foreground">Allocating</p>
                  <p className="text-sm font-bold text-primary">M{formatNum(totalAllocated)}</p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">≈ ₦{formatNum(remainingMobi)}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Channel icon */}
        <div className="flex flex-col items-center mb-1">
          <div className={`h-14 w-14 rounded-2xl ${config.bgColor} flex items-center justify-center mb-2`}>
            <Icon className={`h-7 w-7 ${config.color}`} />
          </div>
        </div>

        {/* ─── MOBI-CHAT: User search button ─── */}
        {isMobiChat && (
          <>
            <button
              onClick={() => setShowUserSearch(true)}
              className="w-full rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 flex items-center gap-3 touch-manipulation active:scale-[0.97] transition-transform"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-foreground">
                  {selectedUsers.length > 0
                    ? `${selectedUsers.length} recipient${selectedUsers.length > 1 ? "s" : ""} selected`
                    : "Select Recipients"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedUsers.length > 0 ? "Tap to add or remove users" : "Choose Mobigate users to send to"}
                </p>
              </div>
              <Plus className="h-5 w-5 text-primary shrink-0" />
            </button>
            <MobigateUserSearch
              open={showUserSearch}
              onOpenChange={setShowUserSearch}
              multiSelect
              selectedUserIds={selectedUsers.map(r => r.user.id)}
              onSelect={() => {}}
              onSelectMultiple={handleMultiUsersSelected}
            />
          </>
        )}

        {/* ─── CONTACT CHANNELS: Add recipient input ─── */}
        {!isMobiChat && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Add Recipients
            </label>
            <div className="flex gap-2">
              <input
                type={channel === "email" ? "email" : "tel"}
                inputMode={config.inputMode}
                value={newContact}
                onChange={e => setNewContact(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addContact(); } }}
                placeholder={config.placeholder}
                className="flex-1 h-12 rounded-xl border-2 border-border/50 bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <Button
                onClick={addContact}
                disabled={!newContact.trim()}
                className={`h-12 px-4 rounded-xl shrink-0 ${config.buttonColor}`}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            {newContact && !isValidContact(newContact) && (
              <p className="text-xs text-destructive mt-1.5">
                {channel === "email" ? "Enter a valid email address" : "Enter a valid phone number (min 10 digits)"}
              </p>
            )}

            {/* Added recipients chips */}
            {contactRecipients.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {contactRecipients.map(r => (
                  <Badge key={r.id} variant="secondary" className="pl-2.5 pr-1 py-1 text-xs font-medium gap-1">
                    {r.contact.length > 22 ? r.contact.slice(0, 22) + "…" : r.contact}
                    <button
                      onClick={() => removeContact(r.id)}
                      className="h-4 w-4 rounded-full bg-foreground/10 flex items-center justify-center ml-0.5 touch-manipulation"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── ALLOCATION SECTION (shared) ─── */}
        {recipientCount > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Allocate Amounts
              </p>
              {recipientCount >= 2 && (
                <button
                  onClick={splitEvenly}
                  className="flex items-center gap-1 text-xs font-semibold text-primary touch-manipulation active:opacity-70"
                >
                  <Sparkles className="h-3 w-3" />
                  Split Evenly
                </button>
              )}
            </div>

            {/* MobiChat user cards */}
            {isMobiChat && selectedUsers.map(({ user, amount: userAmount }) => {
              const otherAllocated = selectedUsers.filter(x => x.user.id !== user.id).reduce((s, x) => s + x.amount, 0);
              const maxForThis = remainingMobi - otherAllocated;
              const userQuickAmounts = quickAmounts.filter(a => a <= maxForThis);
              return (
                <div key={user.id} className="rounded-xl border border-border/50 bg-card p-3">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.profileImage} />
                      <AvatarFallback><span className="text-xs">{user.name[0]}</span></AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground">{user.username}</p>
                    </div>
                    <button onClick={() => removeUser(user.id)} className="h-7 w-7 rounded-full bg-destructive/10 flex items-center justify-center touch-manipulation active:scale-90 shrink-0">
                      <X className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </div>
                  <div className="flex gap-1.5 mb-2 flex-wrap">
                    {userQuickAmounts.map(amt => (
                      <button key={amt} onClick={() => setUserAmount(user.id, amt)}
                        className={`h-7 px-3 rounded-lg text-[10px] font-bold touch-manipulation active:scale-90 transition-all ${userAmount === amt ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                        M{formatNum(amt)}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setUserAmount(user.id, Math.max(0, userAmount - 100))} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation shrink-0">
                      <Minus className="h-4 w-4 text-foreground" />
                    </button>
                    <div className="flex-1 flex items-center gap-2 rounded-xl border border-border/50 bg-background px-3 h-9">
                      <span className="text-sm font-bold text-primary">M</span>
                      <input type="number" inputMode="numeric" value={userAmount || ""} onChange={e => setUserAmount(user.id, parseInt(e.target.value) || 0)} placeholder="0"
                        className="flex-1 text-sm font-bold bg-transparent text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                    <button onClick={() => setUserAmount(user.id, userAmount + 100)} className="h-9 w-9 rounded-full bg-primary flex items-center justify-center active:scale-90 touch-manipulation shrink-0">
                      <Plus className="h-4 w-4 text-primary-foreground" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Contact-based recipient cards */}
            {!isMobiChat && contactRecipients.map(({ id, contact, amount: rAmount }) => {
              const otherAllocated = contactRecipients.filter(x => x.id !== id).reduce((s, x) => s + x.amount, 0);
              const maxForThis = remainingMobi - otherAllocated;
              const rQuickAmounts = quickAmounts.filter(a => a <= maxForThis);
              return (
                <div key={id} className="rounded-xl border border-border/50 bg-card p-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-9 w-9 rounded-full ${config.bgColor} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{contact}</p>
                    </div>
                    <button onClick={() => removeContact(id)} className="h-7 w-7 rounded-full bg-destructive/10 flex items-center justify-center touch-manipulation active:scale-90 shrink-0">
                      <X className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </div>
                  <div className="flex gap-1.5 mb-2 flex-wrap">
                    {rQuickAmounts.map(amt => (
                      <button key={amt} onClick={() => setContactAmount(id, amt)}
                        className={`h-7 px-3 rounded-lg text-[10px] font-bold touch-manipulation active:scale-90 transition-all ${rAmount === amt ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                        M{formatNum(amt)}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setContactAmount(id, Math.max(0, rAmount - 100))} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation shrink-0">
                      <Minus className="h-4 w-4 text-foreground" />
                    </button>
                    <div className="flex-1 flex items-center gap-2 rounded-xl border border-border/50 bg-background px-3 h-9">
                      <span className="text-sm font-bold text-primary">M</span>
                      <input type="number" inputMode="numeric" value={rAmount || ""} onChange={e => setContactAmount(id, parseInt(e.target.value) || 0)} placeholder="0"
                        className="flex-1 text-sm font-bold bg-transparent text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                    <button onClick={() => setContactAmount(id, rAmount + 100)} className="h-9 w-9 rounded-full bg-primary flex items-center justify-center active:scale-90 touch-manipulation shrink-0">
                      <Plus className="h-4 w-4 text-primary-foreground" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Summary */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Total Allocating</span>
                <span className="font-bold text-foreground">M{formatNum(totalAllocated)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className={`font-semibold ${availableForAllocation < 0 ? "text-destructive" : "text-emerald-600"}`}>
                  M{formatNum(availableForAllocation)}
                </span>
              </div>
            </div>

            {/* PIN info */}
            {canSend && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 animate-fade-in">
                <div className="flex items-center gap-2 mb-1.5">
                  <Info className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-foreground">Unique PINs</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Each recipient will receive a <span className="font-semibold text-foreground">unique 16-digit PIN</span> worth their allocated amount.
                </p>
                <div className="mt-1.5 pt-1.5 border-t border-primary/10">
                  <p className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Recipients must manually recharge their PINs
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky send button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 safe-area-bottom">
        <Button
          onClick={handleSend}
          disabled={!canSend}
          className={`w-full h-12 text-sm font-semibold rounded-xl touch-manipulation active:scale-[0.97] ${config.buttonColor}`}
        >
          <Send className="h-4 w-4 mr-2" />
          Send M{formatNum(totalAllocated)} to {recipientCount} recipient{recipientCount !== 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  );
}
