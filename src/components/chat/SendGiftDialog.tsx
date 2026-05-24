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
  const { toast } = useToast();

  const [wallet,         setWallet]         = useState<{ mobi: number; credit: number } | null>(null);
  const [walletLoading,  setWalletLoading]  = useState(false);
  const [selectedGift,   setSelectedGift]   = useState<GiftSelection>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [specialOpen,    setSpecialOpen]    = useState(false);
  const [classicOpen,    setClassicOpen]    = useState(false);
  const [sending,        setSending]        = useState(false);

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Your Balance</span>
            </div>
            {walletLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : wallet !== null ? (
              <div className="text-right">
                <p className={`font-bold text-lg ${wallet.mobi < 10 ? "text-destructive" : "text-primary"}`}>
                  {wallet.mobi.toLocaleString()} Mobi
                </p>
                {wallet.credit > 0 && (
                  <p className="text-xs text-muted-foreground">₦{wallet.credit.toLocaleString()} Credit</p>
                )}
                {(wallet as any).gift_balance > 0 && (
                  <p className="text-xs text-emerald-600">+{(wallet as any).gift_balance.toLocaleString()} Gift Balance</p>
                )}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>
          {wallet !== null && wallet.mobi < 10 && (
            <p className="text-xs text-destructive mt-1">Low balance — top up to send gifts</p>
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
          <Button
            className="flex-1"
            onClick={handleSend}
            disabled={!selectedGift || sending || insufficient}
          >
            {sending ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending...</>
            ) : selectedGift ? (
              <><Send className="h-4 w-4 mr-2" />Send ({selectedGift.giftData.mobiValue.toLocaleString()} Mobi)</>
            ) : (
              <><Gift className="h-4 w-4 mr-2" />Select a Gift</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
