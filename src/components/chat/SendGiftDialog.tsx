/**
 * SendGiftDialog.tsx
 * - Fetches real wallet balance from API
 * - Shows balance and validates before sending
 * - Calls POST /api/gifts/send.php to actually save the gift
 * - Updates local balance display after sending
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button }   from "@/components/ui/button";
import { Badge }    from "@/components/ui/badge";
import {
  Gift, Wallet, Loader2, ChevronDown, ChevronUp, Send,
  Plus, Ticket, CreditCard, Building2, ArrowRight,
} from "lucide-react";
import { useToast }  from "@/hooks/use-toast";
import { cn }        from "@/lib/utils";
import {
  specialDigitalGiftFolders,
  classicDigitalGifts,
} from "@/data/profileData";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

// ── Types ─────────────────────────────────────────────────────────────────────
export type GiftSelection = {
  type:     "special" | "classic" | "tangible";
  giftId:   string;
  giftData: {
    id:          string;
    name:        string;
    mobiValue:   number;
    icon?:       string;
    image?:      string;
    category?:   string;
    description?:string;
  };
} | null;

interface SendGiftDialogProps {
  isOpen:       boolean;
  onClose:      () => void;
  recipientName:string;
  recipientId?: string;  // needed to call the API
  onSendGift:   (gift: GiftSelection) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export const SendGiftDialog = ({
  isOpen, onClose, recipientName, recipientId, onSendGift,
}: SendGiftDialogProps) => {
  const { toast }  = useToast();
  const navigate   = useNavigate();
  const location   = useLocation();

  const [wallet,         setWallet]         = useState<{ mobi: number; credit: number } | null>(null);
  const [walletLoading,  setWalletLoading]  = useState(false);
  const [selectedGift,   setSelectedGift]   = useState<GiftSelection>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [specialOpen,    setSpecialOpen]    = useState(false);
  const [classicOpen,    setClassicOpen]    = useState(false);
  const [sending,        setSending]        = useState(false);
  const [fundPanelOpen,  setFundPanelOpen]  = useState(false);

  // ── Fetch wallet balance ───────────────────────────────────────────────────
  const fetchWallet = useCallback(async () => {
    setWalletLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/profile/wallet.php`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setWallet({ mobi: data.main_balance || 0, credit: data.credit_balance || 0 });
      }
    } catch {}
    finally { setWalletLoading(false); }
  }, []);

  useEffect(() => {
    if (isOpen) fetchWallet();
    else { setSelectedGift(null); setSelectedFolder(null); }
  }, [isOpen, fetchWallet]);

  // ── Send gift ──────────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!selectedGift) {
      toast({ title: "Please select a gift first", variant: "destructive" }); return;
    }
    if (!recipientId) {
      toast({ title: "Error", description: "Recipient not found", variant: "destructive" }); return;
    }

    const cost = selectedGift.giftData.mobiValue;

    // Client-side balance check
    if (wallet !== null && wallet.mobi < cost) {
      toast({
        title: "Insufficient Mobi Balance",
        description: `You need ${cost.toLocaleString()} Mobi but have ${wallet.mobi.toLocaleString()} Mobi.`,
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const res  = await fetch(`${API_BASE}/gifts/send.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient_id: recipientId,
          gift_id:      selectedGift.giftId,
          gift_name:    selectedGift.giftData.name,
          icon:         selectedGift.giftData.icon || "🎁",
          gift_type:    selectedGift.type,
          mobi_value:   selectedGift.giftData.mobiValue,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Deduct from local wallet display
        if (wallet !== null) {
          setWallet(w => w ? { ...w, mobi: Math.max(0, w.mobi - cost) } : w);
        }
        toast({
          title: "Gift Sent! 🎁",
          description: `You sent ${selectedGift.giftData.icon || ""} ${selectedGift.giftData.name} to ${recipientName}`,
        });
        onSendGift(selectedGift);
        setSelectedGift(null);
        onClose();
      } else {
        toast({
          title: "Could not send gift",
          description: data.error || "Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({ title: "Error", description: "Cannot reach server.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const getValueBadge = (value: number) => {
    if (value <= 100)   return { label: "Sweet",   cls: "bg-emerald-100 text-emerald-700 border-emerald-300" };
    if (value <= 1000)  return { label: "Special", cls: "bg-blue-100 text-blue-700 border-blue-300" };
    if (value <= 10000) return { label: "Premium", cls: "bg-purple-100 text-purple-700 border-purple-300" };
    return                     { label: "Luxury",  cls: "bg-yellow-100 text-yellow-700 border-yellow-300" };
  };

  const insufficient = wallet !== null && selectedGift !== null && wallet.mobi < selectedGift.giftData.mobiValue;
  const lowBalance   = wallet !== null && wallet.mobi < 10;
  const showFundCta  = wallet !== null && (insufficient || lowBalance);

  // Auto-expand the fund panel the moment we detect insufficient balance.
  useEffect(() => {
    if (insufficient) setFundPanelOpen(true);
  }, [insufficient]);

  // Navigate to a funding destination, remembering where to come back to.
  const goFund = (path: string) => {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    const sep = path.includes("?") ? "&" : "?";
    onClose();
    navigate(`${path}${sep}returnTo=${returnTo}`);
  };

  // Primary funding route: Retail Merchant (submerchant) voucher purchase.
  // Returns user back to the gifting context after funding.
  const primaryFundPath = "/buy-vouchers?source=fund-wallet&type=retail";

  const altFundMethods = [
    {
      id: "bank",
      label: "Online Banking Transfer",
      subtitle: "Direct bank transfer to your wallet",
      icon: Building2,
      accentBg: "bg-indigo-500/10",
      accentText: "text-indigo-600",
      path: "/wallet?action=fund&method=bank",
    },
    {
      id: "card",
      label: "Credit / Debit Card",
      subtitle: "Visa, Mastercard, Verve",
      icon: CreditCard,
      accentBg: "bg-blue-500/10",
      accentText: "text-blue-600",
      path: "/wallet?action=fund&method=card",
    },
  ];


  return (
    <Dialog open={isOpen} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-3 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Send Gift to {recipientName}
          </DialogTitle>
        </DialogHeader>

        {/* Wallet balance */}
        <div className="px-4 py-3 bg-muted/40 border-b shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Wallet className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium">Your Balance</span>
            </div>
            {walletLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : wallet !== null ? (
              <div className="text-right">
                <p className={`font-bold text-lg ${lowBalance ? "text-destructive" : "text-primary"}`}>
                  {wallet.mobi.toLocaleString()} Mobi
                </p>
                {wallet.credit > 0 && (
                  <p className="text-xs text-muted-foreground">₦{wallet.credit.toLocaleString()} Credit</p>
                )}
                {(wallet as { gift_balance?: number }).gift_balance && (wallet as { gift_balance?: number }).gift_balance! > 0 ? (
                  <p className="text-xs text-emerald-600">
                    +{(wallet as { gift_balance?: number }).gift_balance!.toLocaleString()} Gift Balance
                  </p>
                ) : null}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>

          {/* Low / insufficient balance CTA — Fund via Retail Merchant */}
          {showFundCta && (
            <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <div className="flex items-start gap-2 mb-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-destructive">
                    {insufficient ? "Insufficient balance to send this gift" : "Low balance — top up to send gifts"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Fund your Mobi Wallet through a Retail Merchant and we'll bring you right back here.
                  </p>
                </div>
              </div>

              {/* Primary: Retail Merchant */}
              <button
                onClick={() => goFund(primaryFundPath)}
                className="w-full flex items-center gap-3 rounded-lg border-2 border-primary bg-primary px-3 py-3 text-left transition-all hover:bg-primary/90 active:scale-[0.98] shadow-sm"
              >
                <span className="h-10 w-10 rounded-lg bg-primary-foreground/15 flex items-center justify-center shrink-0">
                  <Ticket className="h-5 w-5 text-primary-foreground" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-primary-foreground">Fund Wallet via Retail Merchant</p>
                  <p className="text-[11px] text-primary-foreground/80">Instant top-up — voucher PIN credited immediately</p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary-foreground shrink-0" />
              </button>

              {/* Toggle alt methods */}
              <button
                onClick={() => setFundPanelOpen(v => !v)}
                className="w-full mt-2 text-[11px] text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 py-1"
              >
                {fundPanelOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {fundPanelOpen ? "Hide other methods" : "Other funding methods"}
              </button>

              {fundPanelOpen && (
                <div className="mt-1 space-y-2">
                  {altFundMethods.map(m => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        onClick={() => goFund(m.path)}
                        className="w-full flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 active:bg-primary/10"
                      >
                        <span className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", m.accentBg)}>
                          <Icon className={cn("h-4 w-4", m.accentText)} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{m.label}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{m.subtitle}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </button>
                    );
                  })}
                  <p className="text-[10px] text-muted-foreground text-center pt-1">
                    You'll return to this conversation after funding.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>


        {/* Selected gift preview */}
        {selectedGift && (
          <div className={cn(
            "mx-4 mt-3 flex items-center justify-between gap-3 rounded-xl border px-3 py-2",
            insufficient ? "border-destructive bg-destructive/5" : "border-primary bg-primary/5"
          )}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {selectedGift.giftData.icon && <span className="text-2xl">{selectedGift.giftData.icon}</span>}
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{selectedGift.giftData.name}</p>
                <p className={`text-xs font-bold ${insufficient ? "text-destructive" : "text-primary"}`}>
                  {selectedGift.giftData.mobiValue.toLocaleString()} Mobi
                  {insufficient && " — insufficient balance"}
                </p>
              </div>
            </div>
            <button onClick={() => setSelectedGift(null)} className="text-xs text-muted-foreground hover:text-foreground shrink-0">
              Clear
            </button>
          </div>
        )}

        {/* Gift picker */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">

          {/* Special Digital Gifts */}
          <div className="border rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/60 transition-colors text-sm font-medium"
              onClick={() => setSpecialOpen(v => !v)}
            >
              ✨ Special Digital Gifts
              {specialOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {specialOpen && (
              <div className="p-3">
                {selectedFolder === null ? (
                  <div className="grid grid-cols-3 gap-2">
                    {specialDigitalGiftFolders.map(folder => (
                      <button key={folder.id}
                        onClick={() => setSelectedFolder(folder.id)}
                        className="p-2 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all text-center">
                        <span className="text-2xl block">{folder.icon}</span>
                        <p className="text-xs font-medium mt-1 truncate">{folder.name}</p>
                        <p className="text-xs text-muted-foreground">{folder.gifts.length} gifts</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <button onClick={() => setSelectedFolder(null)} className="text-xs text-primary hover:underline mb-2 flex items-center gap-1">
                      ← Back to folders
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      {specialDigitalGiftFolders.find(f => f.id === selectedFolder)?.gifts.map(gift => {
                        const folder = specialDigitalGiftFolders.find(f => f.id === selectedFolder)!;
                        const giftName = `${folder.name.replace(/ Gifts$/, '')} ${gift.mobiValue.toLocaleString()}`;
                        const giftWithMeta = { ...gift, name: giftName, icon: folder.icon };
                        const badge = getValueBadge(gift.mobiValue);
                        const isSelected = selectedGift?.giftId === gift.id;
                        const canAfford = wallet === null || wallet.mobi >= gift.mobiValue;
                        return (
                          <button key={gift.id}
                            onClick={() => setSelectedGift({ type: "special", giftId: gift.id, giftData: giftWithMeta })}
                            className={cn(
                              "p-3 rounded-xl border text-center transition-all",
                              isSelected ? "border-primary bg-primary/10 ring-1 ring-primary" : "hover:border-primary/40 hover:bg-muted/50",
                              !canAfford && "opacity-50"
                            )}>
                            <span className="text-3xl block">{folder.icon}</span>
                            <p className="text-xs font-semibold mt-1 truncate">{giftName}</p>
                            <p className="text-xs font-bold text-primary">{gift.mobiValue.toLocaleString()} Mobi</p>
                            <Badge variant="outline" className={cn("text-xs mt-1", badge.cls)}>{badge.label}</Badge>
                          </button>
                        );
                      })}

                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Classic Digital Gifts */}
          <div className="border rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/60 transition-colors text-sm font-medium"
              onClick={() => setClassicOpen(v => !v)}
            >
              🎁 Classic Digital Gifts
              {classicOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {classicOpen && (
              <div className="p-3 grid grid-cols-2 gap-2">
                {classicDigitalGifts.map(gift => {
                  const badge = getValueBadge(gift.mobiValue);
                  const isSelected = selectedGift?.giftId === gift.id;
                  const canAfford = wallet === null || wallet.mobi >= gift.mobiValue;
                  return (
                    <button key={gift.id}
                      onClick={() => setSelectedGift({ type: "classic", giftId: gift.id, giftData: gift })}
                      className={cn(
                        "p-3 rounded-xl border text-center transition-all",
                        isSelected ? "border-primary bg-primary/10 ring-1 ring-primary" : "hover:border-primary/40 hover:bg-muted/50",
                        !canAfford && "opacity-50"
                      )}>
                      <span className="text-3xl block">{gift.icon}</span>
                      <p className="text-xs font-semibold mt-1 truncate">{gift.name}</p>
                      <p className="text-xs font-bold text-primary">{gift.mobiValue.toLocaleString()} Mobi</p>
                      <Badge variant="outline" className={cn("text-xs mt-1", badge.cls)}>{badge.label}</Badge>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-3 shrink-0 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          {insufficient ? (
            <Button
              className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={() => goFund(primaryFundPath)}
              disabled={sending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Fund Wallet to Send
            </Button>

          ) : (
            <Button
              className="flex-1"
              onClick={handleSend}
              disabled={!selectedGift || sending}
            >
              {sending ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending...</>
              ) : selectedGift ? (
                <><Send className="h-4 w-4 mr-2" />Send ({selectedGift.giftData.mobiValue.toLocaleString()} Mobi)</>
              ) : (
                <><Gift className="h-4 w-4 mr-2" />Select a Gift</>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
