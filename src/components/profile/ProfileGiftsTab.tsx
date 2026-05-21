import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  specialDigitalGiftFolders, classicDigitalGifts,
  tangibleGifts, giftsVault,
} from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { Gift, Wallet, Heart, User, ExternalLink, ChevronDown, Send, Loader2 } from "lucide-react";
import { useServiceUnavailableDialog } from "@/hooks/useServiceUnavailableDialog";
import { cn } from "@/lib/utils";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

interface GiftRecord {
  giftId:       string;
  giftName:     string;
  icon:         string;
  mobiValue:    number;
  fromUserName: string;
  toUserName:   string;
  date:         string;
}

interface WalletData {
  mobi:   number;
  credit: number;
}

type GiftSelection = {
  type: "special" | "classic" | "tangible";
  giftId: string;
  giftData: { id: string; name: string; mobiValue: number; icon?: string; image?: string; description?: string };
} | null;

interface ProfileGiftsTabProps {
  userName: string;
  userId?: string;
}

export const ProfileGiftsTab = ({ userName, userId }: ProfileGiftsTabProps) => {
  const { toast } = useToast();
  const { showDialog, Dialog } = useServiceUnavailableDialog();

  const [receivedGifts, setReceivedGifts] = useState<GiftRecord[]>([]);
  const [sentGifts,     setSentGifts]     = useState<GiftRecord[]>([]);
  const [wallet,        setWallet]        = useState<WalletData>({ mobi: 0, credit: 0 });
  const [loading,       setLoading]       = useState(true);
  const [selectedGift,  setSelectedGift]  = useState<GiftSelection>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [specialOpen,   setSpecialOpen]   = useState(false);
  const [classicOpen,   setClassicOpen]   = useState(false);
  const [tangibleOpen,  setTangibleOpen]  = useState(false);
  const [giftHistoryTab, setGiftHistoryTab] = useState<"received" | "sent">("received");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [giftsRes, walletRes] = await Promise.all([
        fetch(`${API_BASE}/profile/gifts.php${userId ? `?user_id=${userId}` : ""}`, { credentials: "include" }),
        fetch(`${API_BASE}/profile/wallet.php`, { credentials: "include" }),
      ]);

      if (giftsRes.ok) {
        const d = await giftsRes.json();
        setReceivedGifts(d.received || []);
        setSentGifts(d.sent || []);
      }
      if (walletRes.ok) {
        const w = await walletRes.json();
        setWallet({
          mobi:   (w.main_balance   || 0),
          credit: (w.credit_balance || 0),
          ...(w.gift_balance   ? { gift_balance:  w.gift_balance   } : {}),
          ...(w.bonus_balance  ? { bonus_balance: w.bonus_balance  } : {}),
        } as any);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSendGift = async () => {
    if (!selectedGift) { toast({ title: "No gift selected", variant: "destructive" }); return; }
    if (wallet.mobi < selectedGift.giftData.mobiValue) {
      toast({ title: "Insufficient balance", description: `Need ${selectedGift.giftData.mobiValue.toLocaleString()} Mobi`, variant: "destructive" }); return;
    }
    try {
      const res = await fetch(`${API_BASE}/gifts/send.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient_id: userId,
          gift_id:      selectedGift.giftId,
          gift_name:    selectedGift.giftData.name,
          icon:         selectedGift.giftData.icon || "🎁",
          gift_type:    selectedGift.type,
          mobi_value:   selectedGift.giftData.mobiValue,
        }),
      });
      const d = await res.json();
      if (res.ok && d.success) {
        toast({
          title: "Gift Sent! 🎁",
          description: `You sent ${selectedGift.giftData.icon || ""} ${selectedGift.giftData.name} to ${userName}. ${d.mobi_cost?.toLocaleString()} Mobi deducted.`,
        });
        setSelectedGift(null);
        // Use server's authoritative new balance
        if (d.new_balance !== undefined) {
          setWallet(w => ({ ...w, mobi: d.new_balance }));
        } else {
          setWallet(w => ({ ...w, mobi: Math.max(0, w.mobi - selectedGift.giftData.mobiValue) }));
        }
        fetchData(); // refresh gift history
      } else {
        toast({ title: "Error", description: d.error || "Could not send gift.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Cannot reach server.", variant: "destructive" });
    }
  };

  const getValueCategory = (value: number) => {
    if (value <= 100)   return { label: "Sweet",   color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" };
    if (value <= 1000)  return { label: "Special",  color: "bg-blue-500/10 text-blue-700 border-blue-500/20" };
    if (value <= 10000) return { label: "Premium",  color: "bg-purple-500/10 text-purple-700 border-purple-500/20" };
    return                     { label: "Luxury",   color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" };
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6 pb-6">
      {/* Wallet */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10">
        <h3 className="text-base font-bold uppercase mb-2">SEND {userName.toUpperCase()} GIFTS</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Wallet Balance:</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-primary block">{wallet.mobi.toLocaleString()} Mobi</span>
            <span className="text-sm text-muted-foreground">₦{wallet.credit.toLocaleString()} Credit</span>
          </div>
        </div>
      </Card>

      {/* Selected gift indicator */}
      {selectedGift && (
        <Card className="p-3 bg-primary/5 border-primary">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Badge variant="default" className="text-sm shrink-0">{selectedGift.type}</Badge>
              {selectedGift.giftData.icon && <span>{selectedGift.giftData.icon}</span>}
              <span className="text-sm font-medium truncate">{selectedGift.giftData.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary">{selectedGift.giftData.mobiValue.toLocaleString()} Mobi</span>
              <Button onClick={() => setSelectedGift(null)} variant="ghost" size="sm" className="h-8 px-2">Clear</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Special Digital Gifts */}
      <Collapsible open={specialOpen} onOpenChange={setSpecialOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium">Special Digital Gifts</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", specialOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4">
              {!selectedFolder ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {specialDigitalGiftFolders.map(folder => (
                    <button key={folder.id} onClick={() => setSelectedFolder(folder.id)} className="p-3 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all text-center space-y-2">
                      <span className="text-3xl block">{folder.icon}</span>
                      <p className="text-xs font-medium">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">{folder.itemCount} gifts</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <button onClick={() => setSelectedFolder(null)} className="text-sm text-primary hover:underline mb-3 block">← Back to folders</button>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {specialDigitalGiftFolders.find(f => f.id === selectedFolder)?.gifts.map(gift => (
                      <button key={gift.id} onClick={() => setSelectedGift({ type: "special", giftId: gift.id, giftData: gift })}
                        className={cn("p-3 rounded-lg border text-center space-y-1 transition-all", selectedGift?.giftId === gift.id ? "border-primary bg-primary/10" : "hover:border-primary/50 hover:bg-primary/5")}>
                        <span className="text-3xl block">{gift.icon}</span>
                        <p className="text-xs font-medium">{gift.name}</p>
                        <p className="text-xs font-bold text-primary">{gift.mobiValue.toLocaleString()} Mobi</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Classic Digital Gifts */}
      <Collapsible open={classicOpen} onOpenChange={setClassicOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium">Classic Digital Gifts</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", classicOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {classicDigitalGifts.map(gift => (
                <button key={gift.id} onClick={() => setSelectedGift({ type: "classic", giftId: gift.id, giftData: gift })}
                  className={cn("p-3 rounded-lg border text-center space-y-1 transition-all", selectedGift?.giftId === gift.id ? "border-primary bg-primary/10" : "hover:border-primary/50 hover:bg-primary/5")}>
                  <span className="text-3xl block">{gift.icon}</span>
                  <p className="text-xs font-medium">{gift.name}</p>
                  <p className="text-xs font-bold text-primary">{gift.mobiValue.toLocaleString()} Mobi</p>
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Send Button */}
      <Button onClick={handleSendGift} disabled={!selectedGift} className="w-full h-12 text-base font-semibold">
        <Gift className="h-5 w-5 mr-2" />
        {selectedGift ? `Send Gift (${selectedGift.giftData.mobiValue.toLocaleString()} Mobi)` : "Send Gifts"}
      </Button>

      <Card className="p-4 bg-muted/30 border-dashed">
        <p className="text-sm text-center">
          Please{" "}
          <Button variant="link" className="px-1 h-auto py-0 text-sm font-semibold" onClick={showDialog}>
            ENTER MOBI-STORE <ExternalLink className="h-3 w-3 ml-1" />
          </Button>{" "}
          to shop for more items
        </p>
      </Card>
      <Dialog />

      {/* Gift History */}
      <Card className="p-4">
        <Tabs value={giftHistoryTab} onValueChange={v => setGiftHistoryTab(v as "received"|"sent")}>
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="received"><Heart className="h-4 w-4 mr-1" />Received ({receivedGifts.length})</TabsTrigger>
            <TabsTrigger value="sent"><Send className="h-4 w-4 mr-1" />Sent ({sentGifts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            {receivedGifts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Gift className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{userName} hasn't received any gifts yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {receivedGifts.map((g, i) => {
                  const cat = getValueCategory(g.mobiValue);
                  return (
                    <Card key={i} className="p-3 hover:shadow-lg transition-all">
                      <div className="text-center space-y-2">
                        <div className="text-4xl">{g.icon}</div>
                        <p className="font-bold text-sm line-clamp-1">{g.giftName}</p>
                        <p className="text-sm font-bold text-primary">{g.mobiValue.toLocaleString()} Mobi</p>
                        <Badge variant="outline" className={cn("text-sm", cat.color)}>{cat.label}</Badge>
                        <div className="pt-2 border-t space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><User className="h-3 w-3" />From: {g.fromUserName}</p>
                          <p className="text-xs text-muted-foreground">{new Date(g.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent">
            {sentGifts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Send className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">You haven't sent any gifts yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sentGifts.map((g, i) => {
                  const cat = getValueCategory(g.mobiValue);
                  return (
                    <Card key={i} className="p-3 hover:shadow-lg transition-all">
                      <div className="text-center space-y-2">
                        <div className="text-4xl">{g.icon}</div>
                        <p className="font-bold text-sm line-clamp-1">{g.giftName}</p>
                        <p className="text-sm font-bold text-primary">{g.mobiValue.toLocaleString()} Mobi</p>
                        <Badge variant="outline" className={cn("text-sm", cat.color)}>{cat.label}</Badge>
                        <div className="pt-2 border-t space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><User className="h-3 w-3" />To: {g.toUserName}</p>
                          <p className="text-xs text-muted-foreground">{new Date(g.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
