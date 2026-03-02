import { useState, useEffect } from "react";
import { ArrowLeft, Mail, MessageCircle, Phone, Send, CheckCircle2, Info, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MobigateUserSearch, MobigateUser } from "@/components/profile/MobigateUserSearch";

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

const CHANNEL_CONFIG: Record<ChannelType, { label: string; icon: typeof Mail; color: string; bgColor: string; placeholder: string; inputMode: "email" | "tel" | "text"; recipientLabel: string }> = {
  email: { label: "Send via Email", icon: Mail, color: "text-blue-600", bgColor: "bg-blue-500/10", placeholder: "recipient@email.com", inputMode: "email", recipientLabel: "Email" },
  mobiChat: { label: "Send via Mobi-Chat", icon: MessageCircle, color: "text-primary", bgColor: "bg-primary/10", placeholder: "Search Mobigate user...", inputMode: "text", recipientLabel: "Mobi-Chat" },
  whatsApp: { label: "Send via WhatsApp", icon: MessageCircle, color: "text-emerald-600", bgColor: "bg-emerald-500/10", placeholder: "+234 800 000 0000", inputMode: "tel", recipientLabel: "WhatsApp" },
  sms: { label: "Send via SMS", icon: Phone, color: "text-orange-600", bgColor: "bg-orange-500/10", placeholder: "+234 800 000 0000", inputMode: "tel", recipientLabel: "SMS" },
};

export function SendViaChannelStep({ channel, remainingMobi, onBack, onSendComplete }: SendViaChannelStepProps) {
  const { toast } = useToast();
  const config = CHANNEL_CONFIG[channel];
  const Icon = config.icon;

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [generatedPin, setGeneratedPin] = useState("");
  const [pinCopied, setPinCopied] = useState(false);

  // Mobi-Chat specific
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MobigateUser | null>(null);

  const quickAmounts = [100, 500, 1000, 5000];

  const isValidRecipient = () => {
    if (channel === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient);
    if (channel === "mobiChat") return !!selectedUser;
    if (channel === "whatsApp" || channel === "sms") return recipient.replace(/\D/g, "").length >= 10;
    return false;
  };

  const canSend = isValidRecipient() && amount > 0 && amount <= remainingMobi;

  const handleSend = () => {
    if (!canSend) return;
    setSending(true);
    const pin = generatePin();
    setGeneratedPin(pin);

    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 3000);
  };

  const handleCopyPin = () => {
    navigator.clipboard.writeText(generatedPin).catch(() => {});
    setPinCopied(true);
    toast({ title: "PIN Copied", description: "Voucher PIN copied to clipboard" });
    setTimeout(() => setPinCopied(false), 2000);
  };

  const handleContinue = () => {
    const recipientLabel = channel === "mobiChat" ? (selectedUser?.name || "User") : recipient;
    onSendComplete(amount, recipientLabel);
  };

  const setQuickAmount = (amt: number) => {
    if (amt <= remainingMobi) setAmount(amt);
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
          M{formatNum(amount)} to {channel === "mobiChat" ? selectedUser?.name : recipient}
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
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
        <div className="relative w-24 h-24 mb-6 animate-scale-in">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute inset-2 rounded-full bg-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-1 animate-fade-in">PIN Sent!</h2>
        <p className="text-2xl font-black text-emerald-600 mb-1 animate-fade-in">M{formatNum(amount)}</p>
        <p className="text-sm text-muted-foreground mb-4 animate-fade-in">
          via {config.recipientLabel} to {channel === "mobiChat" ? selectedUser?.name : recipient}
        </p>

        {/* PIN display */}
        <div className="w-full rounded-xl border border-border/50 bg-card p-4 mb-4 animate-fade-in">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Voucher PIN Sent</p>
          <div className="flex items-center justify-between gap-2 bg-muted/50 rounded-lg p-3">
            <span className="font-mono text-lg font-bold text-foreground tracking-[0.2em]">
              {generatedPin.slice(0, 4)}-{generatedPin.slice(4, 8)}-{generatedPin.slice(8, 12)}-{generatedPin.slice(12)}
            </span>
            <button onClick={handleCopyPin} className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center touch-manipulation active:scale-90">
              {pinCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-primary" />}
            </button>
          </div>
        </div>

        {/* Manual recharge info box */}
        <div className="w-full rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-4 mb-6 animate-fade-in">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-foreground mb-1">Manual Recharge Required</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The voucher PIN has been sent. The recipient must enter it manually in the <span className="font-semibold text-foreground">'Redeem Voucher'</span> section to credit their wallet.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={handleContinue} className="w-full h-12 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.97] animate-fade-in">
          Continue
        </Button>
      </div>
    );
  }

  // ─── FORM VIEW ───
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
            <p className="text-xs text-muted-foreground">Send voucher PIN for manual recharge</p>
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
              <p className="text-xs text-muted-foreground">≈ ₦{formatNum(remainingMobi)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Channel icon header */}
        <div className="flex flex-col items-center mb-2">
          <div className={`h-16 w-16 rounded-2xl ${config.bgColor} flex items-center justify-center mb-2`}>
            <Icon className={`h-8 w-8 ${config.color}`} />
          </div>
        </div>

        {/* Recipient input */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Recipient {config.recipientLabel}
          </label>
          {channel === "mobiChat" ? (
            <>
              <button
                onClick={() => setShowUserSearch(true)}
                className="w-full h-12 rounded-xl border-2 border-border/50 bg-card px-4 text-left flex items-center gap-3 touch-manipulation active:scale-[0.98]"
              >
                {selectedUser ? (
                  <>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{selectedUser.name}</p>
                      <p className="text-[10px] text-muted-foreground">@{selectedUser.username}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">Selected</Badge>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">Tap to select a Mobigate user...</span>
                )}
              </button>
              <MobigateUserSearch
                open={showUserSearch}
                onOpenChange={setShowUserSearch}
                onSelect={(user) => {
                  setSelectedUser(user);
                  setRecipient(user.id);
                }}
                selectedUserId={selectedUser?.id}
              />
            </>
          ) : (
            <input
              type={channel === "email" ? "email" : "tel"}
              inputMode={config.inputMode}
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              placeholder={config.placeholder}
              className="w-full h-12 rounded-xl border-2 border-border/50 bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          )}
          {recipient && !isValidRecipient() && channel !== "mobiChat" && (
            <p className="text-xs text-destructive mt-1.5">
              {channel === "email" ? "Please enter a valid email address" : "Please enter a valid phone number (min 10 digits)"}
            </p>
          )}
        </div>

        {/* Amount input */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Amount to Send
          </label>
          {/* Quick amount buttons */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {quickAmounts.filter(a => a <= remainingMobi).map(amt => (
              <button
                key={amt}
                onClick={() => setQuickAmount(amt)}
                className={`h-9 px-4 rounded-xl text-xs font-bold touch-manipulation active:scale-90 transition-all ${
                  amount === amt
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                M{formatNum(amt)}
              </button>
            ))}
            {remainingMobi >= 10000 && (
              <button
                onClick={() => setQuickAmount(10000)}
                className={`h-9 px-4 rounded-xl text-xs font-bold touch-manipulation active:scale-90 transition-all ${
                  amount === 10000
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                M10,000
              </button>
            )}
          </div>
          {/* Manual amount input */}
          <div className="flex items-center gap-3 rounded-xl border-2 border-border/50 bg-card p-3">
            <span className="text-lg font-bold text-primary">M</span>
            <input
              type="number"
              inputMode="numeric"
              value={amount || ""}
              onChange={e => {
                const val = parseInt(e.target.value) || 0;
                setAmount(Math.min(val, remainingMobi));
              }}
              placeholder="0"
              className="flex-1 text-xl font-bold bg-transparent text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {amount > 0 && (
              <span className="text-xs text-muted-foreground">≈ ₦{formatNum(amount)}</span>
            )}
          </div>
          {amount > remainingMobi && (
            <p className="text-xs text-destructive mt-1.5">Amount exceeds available balance</p>
          )}
        </div>

        {/* Voucher PIN preview */}
        {canSend && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold text-foreground">PIN Preview</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A <span className="font-semibold text-foreground">16-digit voucher PIN</span> worth <span className="font-bold text-primary">M{formatNum(amount)}</span> will be generated and sent to the recipient.
            </p>
            <div className="mt-2 pt-2 border-t border-primary/10">
              <p className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                <Info className="h-3 w-3" />
                Recipient will need to manually recharge this PIN
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky send button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 safe-area-bottom">
        <Button
          onClick={handleSend}
          disabled={!canSend}
          className={`w-full h-12 text-sm font-semibold rounded-xl touch-manipulation active:scale-[0.97] ${
            channel === "whatsApp"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : channel === "email"
              ? "bg-blue-600 hover:bg-blue-700"
              : channel === "sms"
              ? "bg-orange-600 hover:bg-orange-700"
              : ""
          }`}
        >
          <Send className="h-4 w-4 mr-2" />
          Send M{formatNum(amount)} via {config.recipientLabel}
        </Button>
      </div>
    </div>
  );
}
