import { useState, useCallback } from "react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Search, User, Phone, Mail, Hash, CheckCircle2, Loader2,
  ArrowRight, Zap, UserPlus, ShieldCheck, ChevronLeft, Smartphone,
  Share2, MessageSquare, Send,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatNum, generatePin } from "@/data/merchantVoucherData";
import { shareViaNative } from "@/lib/shareUtils";

// ─── Mock user database ───
interface MockUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: "registered" | "guest";
}

const MOCK_USERS: MockUser[] = [
  { id: "USR-10234", name: "Adebayo Ogunlesi", phone: "08012345678", email: "adebayo@email.com", type: "registered" },
  { id: "USR-10567", name: "Chioma Nwosu", phone: "07098765432", email: "chioma.n@email.com", type: "registered" },
  { id: "USR-10891", name: "Ibrahim Musa", phone: "09011223344", email: "ibramusa@email.com", type: "registered" },
  { id: "USR-11002", name: "Funke Akindele", phone: "08155667788", email: "funke.a@email.com", type: "registered" },
  { id: "GST-50012", name: "Guest User", phone: "07033445566", email: "", type: "guest" },
  { id: "GST-50034", name: "Guest User", phone: "08199887766", email: "", type: "guest" },
];

const VOUCHER_DENOMINATIONS = [100, 200, 500, 1000, 1500, 2000, 2500, 3000, 5000, 10000];

type FlowStep = "lookup" | "amount" | "confirm" | "success" | "guest-register";

interface CreditUsersManuallyDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreditUsersManuallyDrawer({ open, onOpenChange }: CreditUsersManuallyDrawerProps) {
  const [userType, setUserType] = useState<"registered" | "guest">("registered");
  const [step, setStep] = useState<FlowStep>("lookup");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<MockUser | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Transaction details
  const [txnId, setTxnId] = useState("");
  const [voucherPin, setVoucherPin] = useState("");

  // Guest registration
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [newGuestId, setNewGuestId] = useState("");

  const resetAll = useCallback(() => {
    setStep("lookup");
    setSearchQuery("");
    setFoundUser(null);
    setSelectedAmount(null);
    setCustomAmount("");
    setIsSearching(false);
    setIsProcessing(false);
    setTxnId("");
    setVoucherPin("");
    setGuestName("");
    setGuestPhone("");
    setGuestEmail("");
    setIsRegistering(false);
    setNewGuestId("");
  }, []);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetAll, 300);
  };

  // ─── User Lookup ───
  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setIsSearching(true);
    setFoundUser(null);

    // Simulate API lookup
    await new Promise(r => setTimeout(r, 1200));

    const found = MOCK_USERS.find(u => {
      if (userType === "guest" && u.type !== "guest") return false;
      if (userType === "registered" && u.type !== "registered") return false;
      return (
        u.id.toLowerCase() === q.toLowerCase() ||
        u.phone.includes(q) ||
        u.email.toLowerCase().includes(q.toLowerCase()) ||
        u.name.toLowerCase().includes(q.toLowerCase())
      );
    });

    setIsSearching(false);
    if (found) {
      setFoundUser(found);
    } else {
      toast({ title: "User not found", description: "No matching user found. Check details and try again.", variant: "destructive" });
    }
  };

  // ─── Guest Registration ───
  const handleGuestRegister = async () => {
    if (!guestPhone.trim() || guestPhone.trim().length < 10) {
      toast({ title: "Invalid phone number", description: "Enter a valid phone number", variant: "destructive" });
      return;
    }
    setIsRegistering(true);
    // Simulate registration
    await new Promise(r => setTimeout(r, 1800));

    const generatedId = `GST-${50000 + Math.floor(Math.random() * 9999)}`;
    setNewGuestId(generatedId);
    setIsRegistering(false);

    // Auto-set the found user so they can proceed
    const newGuest: MockUser = {
      id: generatedId,
      name: guestName.trim() || "Guest User",
      phone: guestPhone.trim(),
      email: guestEmail.trim(),
      type: "guest",
    };
    setFoundUser(newGuest);
    setStep("lookup");
    setUserType("guest");
    setSearchQuery(generatedId);

    toast({
      title: "Guest Account Created",
      description: `Guest ID: ${generatedId}. Proceed to recharge.`,
    });
  };

  // ─── Recharge ───
  const finalAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);

  const handleRecharge = async () => {
    if (!foundUser || !finalAmount || finalAmount < 100) return;
    setIsProcessing(true);

    // Generate transaction details
    const generatedTxnId = `TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 9999).toString().padStart(4, "0")}`;
    const generatedPin = generatePin();
    setTxnId(generatedTxnId);
    setVoucherPin(generatedPin);

    // Simulate multi-step processing
    await new Promise(r => setTimeout(r, 800));
    setStep("confirm");
    await new Promise(r => setTimeout(r, 1600));

    setStep("success");
    setIsProcessing(false);
    toast({ title: "Recharge Successful!", description: `M${formatNum(finalAmount)} credited to ${foundUser.name}` });
  };

  const buildReceiptText = () => {
    if (!foundUser) return "";
    return [
      "═══ RECHARGE RECEIPT ═══",
      "",
      `Recipient: ${foundUser.name}`,
      `User ID: ${foundUser.id}`,
      `Phone: ${foundUser.phone}`,
      `Type: ${foundUser.type === "guest" ? "Guest User" : "Registered User"}`,
      "",
      `Voucher PIN: ${voucherPin}`,
      `Transaction ID: ${txnId}`,
      "",
      `Amount Credited: M${formatNum(finalAmount)} (₦${formatNum(finalAmount)})`,
      "",
      "Tagged: Sold Offline",
      `Date: ${new Date().toLocaleString("en-NG")}`,
      "",
      "— Mobigate Merchant Services —",
    ].join("\n");
  };

  const handleShareReceipt = async () => {
    const text = buildReceiptText();
    const title = `Recharge Receipt — M${formatNum(finalAmount)}`;

    // Try native share first (best for mobile)
    const shared = await shareViaNative(title, text, window.location.origin);
    if (!shared) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text);
        toast({ title: "Receipt Copied", description: "Receipt text copied to clipboard. Paste it in WhatsApp, SMS, or Email." });
      } catch {
        toast({ title: "Share unavailable", description: "Could not share receipt on this device.", variant: "destructive" });
      }
    }
  };

  return (
    <Drawer open={open} onOpenChange={(v) => { if (!v) handleClose(); else onOpenChange(v); }}>
      <DrawerContent className="max-h-[92vh] min-h-[70vh]">
        <DrawerHeader className="pb-2">
          <div className="flex items-center gap-2">
            {step !== "lookup" && step !== "guest-register" && (
              <button
                onClick={() => {
                  if (step === "amount") setStep("lookup");
                  else if (step === "confirm" || step === "success") { resetAll(); }
                }}
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center touch-manipulation active:scale-90"
              >
                <ChevronLeft className="h-4 w-4 text-foreground" />
              </button>
            )}
            {step === "guest-register" && (
              <button
                onClick={() => setStep("lookup")}
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center touch-manipulation active:scale-90"
              >
                <ChevronLeft className="h-4 w-4 text-foreground" />
              </button>
            )}
            <div>
              <DrawerTitle className="text-base flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {step === "guest-register" ? "Create Guest Account" : "Credit User Manually"}
              </DrawerTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {step === "lookup" && "Find user and recharge their wallet offline"}
                {step === "amount" && "Select voucher amount to credit"}
                {step === "confirm" && "Processing recharge..."}
                {step === "success" && "Recharge completed successfully"}
                {step === "guest-register" && "Register a new guest user"}
              </p>
            </div>
          </div>
        </DrawerHeader>

        <ScrollArea className="px-4 pb-6 overflow-y-auto touch-auto" style={{ maxHeight: "78vh" }}>
          {/* ═══ STEP 1: LOOKUP ═══ */}
          {step === "lookup" && (
            <div className="space-y-4">
              {/* User Type Tabs */}
              <Tabs value={userType} onValueChange={(v) => { setUserType(v as "registered" | "guest"); setFoundUser(null); setSearchQuery(""); }}>
                <TabsList className="w-full h-11">
                  <TabsTrigger value="registered" className="flex-1 text-xs h-9">
                    <User className="h-3.5 w-3.5 mr-1.5" /> Registered User
                  </TabsTrigger>
                  <TabsTrigger value="guest" className="flex-1 text-xs h-9">
                    <Smartphone className="h-3.5 w-3.5 mr-1.5" /> Guest User
                  </TabsTrigger>
                </TabsList>

                {/* Registered User Search */}
                <TabsContent value="registered" className="mt-3 space-y-3">
                  <div className="rounded-xl bg-muted/50 border border-border/30 p-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Search by <span className="font-semibold text-foreground">Name</span>, <span className="font-semibold text-foreground">Phone</span>, <span className="font-semibold text-foreground">Email</span>, or <span className="font-semibold text-foreground">User ID</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Name, phone, email, or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 text-sm rounded-xl"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <Button
                      onClick={handleSearch}
                      disabled={!searchQuery.trim() || isSearching}
                      className="h-11 px-4 rounded-xl touch-manipulation active:scale-95"
                    >
                      {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                </TabsContent>

                {/* Guest User Search */}
                <TabsContent value="guest" className="mt-3 space-y-3">
                  <div className="rounded-xl bg-muted/50 border border-border/30 p-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Search by <span className="font-semibold text-foreground">Guest ID</span> or <span className="font-semibold text-foreground">Phone Number</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Guest ID or phone number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 text-sm rounded-xl"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <Button
                      onClick={handleSearch}
                      disabled={!searchQuery.trim() || isSearching}
                      className="h-11 px-4 rounded-xl touch-manipulation active:scale-95"
                    >
                      {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* Create Guest Button */}
                  <button
                    onClick={() => setStep("guest-register")}
                    className="w-full rounded-xl border-2 border-dashed border-border/60 p-4 flex items-center gap-3 touch-manipulation active:scale-[0.97] transition-transform hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <UserPlus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-foreground">New Guest? Create Account</p>
                      <p className="text-xs text-muted-foreground">Register a new guest user to recharge</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 ml-auto" />
                  </button>
                </TabsContent>
              </Tabs>

              {/* ─── Found User Card ─── */}
              {foundUser && (
                <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">User Found</p>
                    <Badge className={`ml-auto text-[10px] h-5 px-2 ${foundUser.type === "guest" ? "bg-amber-500/15 text-amber-600" : "bg-primary/15 text-primary"}`}>
                      {foundUser.type === "guest" ? "Guest" : "Registered"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{foundUser.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{foundUser.id}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 pl-14">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span className="font-medium">{foundUser.phone}</span>
                      </div>
                      {foundUser.email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span className="font-medium">{foundUser.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => setStep("amount")}
                    className="w-full h-12 rounded-xl text-sm font-bold touch-manipulation active:scale-[0.97] gap-2 mt-2"
                  >
                    Proceed to Recharge <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ═══ GUEST REGISTRATION ═══ */}
          {step === "guest-register" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-muted/50 border border-border/30 p-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Create a new guest account. A <span className="font-semibold text-foreground">Guest ID</span> will be generated automatically.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Full Name <span className="text-muted-foreground">(optional)</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter guest's name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="pl-9 h-11 text-sm rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Phone Number <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g. 08012345678"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value.replace(/[^0-9+]/g, ""))}
                      className="pl-9 h-11 text-sm rounded-xl"
                      type="tel"
                      inputMode="numeric"
                      maxLength={15}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Email <span className="text-muted-foreground">(optional)</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="guest@email.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="pl-9 h-11 text-sm rounded-xl"
                      type="email"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGuestRegister}
                disabled={!guestPhone.trim() || guestPhone.trim().length < 10 || isRegistering}
                className="w-full h-12 rounded-xl text-sm font-bold touch-manipulation active:scale-[0.97] gap-2"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Guest Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create Guest Account
                  </>
                )}
              </Button>

              {newGuestId && (
                <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Account Created</p>
                  </div>
                  <p className="text-sm text-foreground">Guest ID: <span className="font-black font-mono text-primary">{newGuestId}</span></p>
                  <p className="text-xs text-muted-foreground mt-1">Phone: {guestPhone}</p>
                </div>
              )}
            </div>
          )}

          {/* ═══ STEP 2: AMOUNT SELECTION ═══ */}
          {step === "amount" && foundUser && (
            <div className="space-y-4">
              {/* Selected User Summary */}
              <div className="rounded-xl bg-muted/30 border border-border/30 p-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{foundUser.name}</p>
                  <p className="text-xs text-muted-foreground">{foundUser.id} • {foundUser.phone}</p>
                </div>
                <Badge className={`text-[10px] h-5 px-2 shrink-0 ${foundUser.type === "guest" ? "bg-amber-500/15 text-amber-600" : "bg-primary/15 text-primary"}`}>
                  {foundUser.type === "guest" ? "Guest" : "Registered"}
                </Badge>
              </div>

              {/* Denomination Grid */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Select Voucher Amount</p>
                <div className="grid grid-cols-3 gap-2">
                  {VOUCHER_DENOMINATIONS.map(denom => (
                    <button
                      key={denom}
                      onClick={() => { setSelectedAmount(denom); setCustomAmount(""); }}
                      className={`rounded-xl border-2 p-3 text-center transition-all touch-manipulation active:scale-95 ${
                        selectedAmount === denom
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border/50 bg-card hover:border-primary/30"
                      }`}
                    >
                      <p className={`text-sm font-black ${selectedAmount === denom ? "text-primary" : "text-foreground"}`}>
                        M{formatNum(denom)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">₦{formatNum(denom)}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Or Enter Custom Amount</p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">M</span>
                  <Input
                    placeholder="Enter amount..."
                    value={customAmount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setCustomAmount(val);
                      if (val) setSelectedAmount(null);
                    }}
                    className="pl-8 h-11 text-sm rounded-xl font-semibold"
                    type="text"
                    inputMode="numeric"
                  />
                </div>
                {customAmount && parseInt(customAmount) > 0 && (
                  <p className="text-xs text-muted-foreground mt-1 pl-1">₦{formatNum(parseInt(customAmount))} equivalent</p>
                )}
              </div>

              {/* Recharge Button */}
              <Button
                onClick={handleRecharge}
                disabled={!finalAmount || finalAmount < 100 || isProcessing}
                className="w-full h-14 rounded-2xl text-sm font-bold touch-manipulation active:scale-[0.97] gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    Recharge Now — M{formatNum(finalAmount || 0)}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* ═══ STEP 3: CONFIRMING (auto-transitions) ═══ */}
          {step === "confirm" && foundUser && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-foreground">Processing Recharge</p>
                <p className="text-xs text-muted-foreground mt-1">Crediting M{formatNum(finalAmount)} to {foundUser.name}...</p>
              </div>
              <div className="space-y-2 w-full max-w-[240px]">
                <div className="flex items-center gap-2 text-xs text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verifying user account
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Validating voucher amount
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Crediting wallet...
                </div>
              </div>
            </div>
          )}

          {/* ═══ STEP 4: SUCCESS ═══ */}
          {step === "success" && foundUser && (
            <div className="flex flex-col items-center justify-center py-8 space-y-5">
              <div className="h-20 w-20 rounded-full bg-emerald-500/15 flex items-center justify-center animate-in zoom-in duration-300">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-foreground">Recharge Successful!</p>
                <p className="text-xs text-muted-foreground mt-1">Wallet has been credited</p>
              </div>

              <div className="w-full rounded-xl border border-border/50 bg-card overflow-hidden">
                <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Transaction Summary</p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Recipient</span>
                    <span className="font-semibold text-foreground">{foundUser.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">User ID</span>
                    <span className="font-mono font-semibold text-foreground">{foundUser.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-semibold text-foreground">{foundUser.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <Badge className={`text-[10px] h-5 px-2 ${foundUser.type === "guest" ? "bg-amber-500/15 text-amber-600" : "bg-primary/15 text-primary"}`}>
                      {foundUser.type === "guest" ? "Guest User" : "Registered User"}
                    </Badge>
                  </div>

                  {/* Voucher PIN */}
                  <div className="border-t border-border/30 pt-3 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Voucher PIN</span>
                    <span className="font-mono font-black text-foreground tracking-widest text-sm">{voucherPin}</span>
                  </div>

                  {/* Transaction ID */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Transaction ID</span>
                    <span className="font-mono font-semibold text-foreground text-xs">{txnId}</span>
                  </div>

                  <div className="border-t border-border/30 pt-3 flex justify-between">
                    <span className="text-sm font-semibold text-foreground">Amount Credited</span>
                    <div className="text-right">
                      <p className="text-base font-black text-emerald-600">M{formatNum(finalAmount)}</p>
                      <p className="text-xs text-muted-foreground">₦{formatNum(finalAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Badge className="bg-amber-500/15 text-amber-600 text-xs px-3 h-6">
                Tagged: Sold Offline
              </Badge>

              {/* Share/Forward Receipt */}
              <Button
                onClick={handleShareReceipt}
                variant="outline"
                className="w-full h-11 rounded-xl text-sm font-bold touch-manipulation active:scale-[0.97] gap-2 border-primary/30 text-primary"
              >
                <Share2 className="h-4 w-4" />
                Share Receipt with Buyer
              </Button>

              <div className="flex gap-2 w-full">
                <Button
                  onClick={resetAll}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl text-sm font-bold touch-manipulation active:scale-[0.97]"
                >
                  Credit Another
                </Button>
                <Button
                  onClick={handleClose}
                  className="flex-1 h-12 rounded-xl text-sm font-bold touch-manipulation active:scale-[0.97]"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}