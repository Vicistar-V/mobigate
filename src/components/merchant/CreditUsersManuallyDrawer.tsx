import { useState, useCallback, useRef, useEffect } from "react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search, User, Phone, Mail, Hash, CheckCircle2, Loader2,
  ArrowRight, Zap, UserPlus, ShieldCheck, ChevronLeft, Smartphone,
  Share2, Copy, Check, X, Sparkles, CreditCard,
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
  { id: "GST-50012", name: "Nkemjika", phone: "07033445566", email: "", type: "guest" },
  { id: "GST-50034", name: "Guest User", phone: "08199887766", email: "", type: "guest" },
  { id: "GST-51819", name: "Nkemjika", phone: "08164089171", email: "", type: "guest" },
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
  const [pinCopied, setPinCopied] = useState(false);

  // Transaction details
  const [txnId, setTxnId] = useState("");
  const [voucherPin, setVoucherPin] = useState("");

  // Guest registration
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [newGuestId, setNewGuestId] = useState("");

  // Refs for input focus management
  const searchInputRef = useRef<HTMLInputElement>(null);
  const guestPhoneRef = useRef<HTMLInputElement>(null);
  const customAmountRef = useRef<HTMLInputElement>(null);

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
    setPinCopied(false);
  }, []);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetAll, 300);
  };

  // Focus input after step transition
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      if (step === "lookup") searchInputRef.current?.focus();
      if (step === "guest-register") guestPhoneRef.current?.focus();
    }, 350);
    return () => clearTimeout(timer);
  }, [step, open]);

  // ─── User Lookup ───
  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setIsSearching(true);
    setFoundUser(null);

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
    await new Promise(r => setTimeout(r, 1800));

    const generatedId = `GST-${50000 + Math.floor(Math.random() * 9999)}`;
    setNewGuestId(generatedId);
    setIsRegistering(false);

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

    toast({ title: "Guest Account Created", description: `Guest ID: ${generatedId}. Proceed to recharge.` });
  };

  // ─── Recharge ───
  const finalAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);

  const handleRecharge = async () => {
    if (!foundUser || !finalAmount || finalAmount < 100) return;
    setIsProcessing(true);

    const generatedTxnId = `TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 9999).toString().padStart(4, "0")}`;
    const generatedPin = generatePin();
    setTxnId(generatedTxnId);
    setVoucherPin(generatedPin);

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
      "═══ RECHARGE RECEIPT ═══", "",
      `Recipient: ${foundUser.name}`,
      `User ID: ${foundUser.id}`,
      `Phone: ${foundUser.phone}`,
      `Type: ${foundUser.type === "guest" ? "Guest User" : "Registered User"}`, "",
      `Voucher PIN: ${voucherPin}`,
      `Transaction ID: ${txnId}`, "",
      `Amount Credited: M${formatNum(finalAmount)} (₦${formatNum(finalAmount)})`, "",
      "Tagged: Sold Offline",
      `Date: ${new Date().toLocaleString("en-NG")}`, "",
      "— Mobigate Merchant Services —",
    ].join("\n");
  };

  const handleShareReceipt = async () => {
    const text = buildReceiptText();
    const title = `Recharge Receipt — M${formatNum(finalAmount)}`;
    const shared = await shareViaNative(title, text, window.location.origin);
    if (!shared) {
      try {
        await navigator.clipboard.writeText(text);
        toast({ title: "Receipt Copied", description: "Receipt text copied to clipboard." });
      } catch {
        toast({ title: "Share unavailable", description: "Could not share receipt.", variant: "destructive" });
      }
    }
  };

  const handleCopyPin = () => {
    navigator.clipboard.writeText(voucherPin).catch(() => {});
    setPinCopied(true);
    toast({ title: "PIN Copied" });
    setTimeout(() => setPinCopied(false), 2000);
  };

  // ─── Step title/subtitle helper ───
  const getStepMeta = () => {
    switch (step) {
      case "lookup": return { title: "Credit User", sub: "Find user & recharge their wallet" };
      case "amount": return { title: "Select Amount", sub: `Recharge ${foundUser?.name || "user"}` };
      case "confirm": return { title: "Processing", sub: "Please wait..." };
      case "success": return { title: "Recharge Complete", sub: "Transaction successful" };
      case "guest-register": return { title: "Create Guest", sub: "Register a new guest user" };
    }
  };
  const stepMeta = getStepMeta();

  const goBack = () => {
    if (step === "amount") setStep("lookup");
    else if (step === "guest-register") setStep("lookup");
    else if (step === "success") resetAll();
  };

  return (
    <Drawer open={open} onOpenChange={(v) => { if (!v) handleClose(); else onOpenChange(v); }}>
      <DrawerContent className="max-h-[92vh] flex flex-col overflow-hidden">
        {/* ─── HEADER ─── */}
        <div className="shrink-0 border-b border-border/30 px-4 py-3">
          <div className="flex items-center gap-3">
            {(step !== "lookup" && step !== "confirm") && (
              <button
                onClick={goBack}
                className="h-8 w-8 rounded-full bg-muted/80 flex items-center justify-center touch-manipulation active:scale-90 shrink-0"
              >
                <ChevronLeft className="h-4 w-4 text-foreground" />
              </button>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary shrink-0" />
                <p className="text-sm font-bold text-foreground truncate">{stepMeta.title}</p>
              </div>
              <p className="text-xs text-muted-foreground truncate">{stepMeta.sub}</p>
            </div>
            {step !== "confirm" && (
              <button
                onClick={handleClose}
                className="h-8 w-8 rounded-full bg-muted/80 flex items-center justify-center touch-manipulation active:scale-90 shrink-0"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* ─── SCROLLABLE CONTENT ─── */}
        <div className="flex-1 overflow-y-auto touch-auto overscroll-contain">
          <div className="px-4 py-4">

            {/* ═══ STEP 1: LOOKUP ═══ */}
            {step === "lookup" && (
              <div className="space-y-4">
                {/* User Type Segmented Control */}
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border/30">
                  {([
                    { key: "registered" as const, label: "Registered", icon: User },
                    { key: "guest" as const, label: "Guest", icon: Smartphone },
                  ]).map(({ key, label, icon: Ic }) => (
                    <button
                      key={key}
                      onClick={() => { setUserType(key); setFoundUser(null); setSearchQuery(""); }}
                      className={`flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-bold transition-all touch-manipulation active:scale-[0.96] ${
                        userType === key
                          ? "bg-card text-foreground shadow-sm border border-border/50"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Ic className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {userType === "registered"
                      ? "Search by Name, Phone, Email, or User ID"
                      : "Search by Guest ID or Phone Number"}
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      {userType === "registered"
                        ? <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        : <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      }
                      <input
                        ref={searchInputRef}
                        type="text"
                        inputMode={userType === "guest" ? "text" : "text"}
                        placeholder={userType === "registered" ? "Name, phone, email, or ID..." : "Guest ID or phone number..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSearch(); } }}
                        className="w-full h-12 pl-10 pr-4 rounded-2xl border-2 border-border/60 bg-card text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={!searchQuery.trim() || isSearching}
                      className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 touch-manipulation active:scale-90 disabled:opacity-40 transition-all"
                    >
                      {isSearching
                        ? <Loader2 className="h-5 w-5 animate-spin" />
                        : <Search className="h-5 w-5" />
                      }
                    </button>
                  </div>
                </div>

                {/* Guest: Create Account */}
                {userType === "guest" && !foundUser && (
                  <button
                    onClick={() => setStep("guest-register")}
                    className="w-full rounded-2xl border-2 border-dashed border-primary/25 bg-primary/[0.03] p-4 flex items-center gap-3 touch-manipulation active:scale-[0.97] transition-all hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <UserPlus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-bold text-foreground">New Guest? Create Account</p>
                      <p className="text-xs text-muted-foreground">Register a new guest user to recharge</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                )}

                {/* ─── Found User Card ─── */}
                {foundUser && (
                  <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/[0.04] overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
                    {/* Status bar */}
                    <div className="bg-emerald-500/10 px-4 py-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex-1">User Found</p>
                      <Badge className={`text-[10px] h-5 px-2 ${foundUser.type === "guest" ? "bg-amber-500/15 text-amber-600 border-amber-200" : "bg-primary/15 text-primary border-primary/20"}`}>
                        {foundUser.type === "guest" ? "Guest" : "Registered"}
                      </Badge>
                    </div>

                    <div className="p-4 space-y-3">
                      {/* User info */}
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-foreground">{foundUser.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{foundUser.id}</p>
                        </div>
                      </div>

                      {/* Contact details */}
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-2.5 py-1.5">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span className="font-medium">{foundUser.phone}</span>
                        </div>
                        {foundUser.email && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-2.5 py-1.5">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="font-medium truncate">{foundUser.email}</span>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <Button
                        onClick={() => setStep("amount")}
                        className="w-full h-12 rounded-xl text-sm font-bold touch-manipulation active:scale-[0.97] gap-2"
                      >
                        <CreditCard className="h-4 w-4" />
                        Proceed to Recharge
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ═══ GUEST REGISTRATION ═══ */}
            {step === "guest-register" && (
              <div className="space-y-4">
                <div className="rounded-xl bg-muted/40 border border-border/30 p-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Create a new guest account. A <span className="font-semibold text-foreground">Guest ID</span> will be generated automatically.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Full Name <span className="text-muted-foreground font-normal">(optional)</span></label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Enter guest's name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-xl border-2 border-border/60 bg-card text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Phone Number <span className="text-destructive">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <input
                        ref={guestPhoneRef}
                        type="tel"
                        inputMode="numeric"
                        placeholder="e.g. 08012345678"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value.replace(/[^0-9+]/g, ""))}
                        maxLength={15}
                        className="w-full h-12 pl-10 pr-4 rounded-xl border-2 border-border/60 bg-card text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Email <span className="text-muted-foreground font-normal">(optional)</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <input
                        type="email"
                        placeholder="guest@email.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-xl border-2 border-border/60 bg-card text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>

                {newGuestId && (
                  <div className="rounded-xl border-2 border-emerald-500/30 bg-emerald-500/[0.04] p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Account Created</p>
                    </div>
                    <p className="text-sm text-foreground">Guest ID: <span className="font-black font-mono text-primary">{newGuestId}</span></p>
                    <p className="text-xs text-muted-foreground mt-1">Phone: {guestPhone}</p>
                  </div>
                )}

                <Button
                  onClick={handleGuestRegister}
                  disabled={!guestPhone.trim() || guestPhone.trim().length < 10 || isRegistering}
                  className="w-full h-12 rounded-xl text-sm font-bold touch-manipulation active:scale-[0.97] gap-2"
                >
                  {isRegistering ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Creating Guest Account...</>
                  ) : (
                    <><UserPlus className="h-4 w-4" /> Create Guest Account</>
                  )}
                </Button>
              </div>
            )}

            {/* ═══ STEP 2: AMOUNT SELECTION ═══ */}
            {step === "amount" && foundUser && (
              <div className="space-y-4">
                {/* Selected user mini-card */}
                <div className="rounded-xl bg-muted/30 border border-border/30 p-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{foundUser.name}</p>
                    <p className="text-xs text-muted-foreground">{foundUser.id} • {foundUser.phone}</p>
                  </div>
                  <Badge className={`text-[10px] h-5 px-2 shrink-0 ${foundUser.type === "guest" ? "bg-amber-500/15 text-amber-600 border-amber-200" : "bg-primary/15 text-primary border-primary/20"}`}>
                    {foundUser.type === "guest" ? "Guest" : "Registered"}
                  </Badge>
                </div>

                {/* Denomination Grid */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Select Voucher Amount</p>
                  <div className="grid grid-cols-3 gap-2">
                    {VOUCHER_DENOMINATIONS.map(denom => {
                      const isActive = selectedAmount === denom;
                      return (
                        <button
                          key={denom}
                          onClick={() => { setSelectedAmount(denom); setCustomAmount(""); }}
                          className={`rounded-xl border-2 p-3 text-center transition-all touch-manipulation active:scale-[0.93] ${
                            isActive
                              ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                              : "border-border/40 bg-card hover:border-primary/30"
                          }`}
                        >
                          <p className={`text-sm font-black ${isActive ? "text-primary" : "text-foreground"}`}>
                            M{formatNum(denom)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">₦{formatNum(denom)}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Or Enter Custom Amount</p>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground pointer-events-none">M</span>
                    <input
                      ref={customAmountRef}
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter amount..."
                      value={customAmount}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setCustomAmount(val);
                        if (val) setSelectedAmount(null);
                      }}
                      className="w-full h-12 pl-9 pr-4 rounded-xl border-2 border-border/60 bg-card text-sm font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      autoComplete="off"
                    />
                  </div>
                  {customAmount && parseInt(customAmount) > 0 && (
                    <p className="text-xs text-muted-foreground mt-1.5 pl-1">₦{formatNum(parseInt(customAmount))} equivalent</p>
                  )}
                </div>

                {/* Recharge Button */}
                <Button
                  onClick={handleRecharge}
                  disabled={!finalAmount || finalAmount < 100 || isProcessing}
                  className="w-full h-14 rounded-2xl text-sm font-bold touch-manipulation active:scale-[0.97] gap-2"
                >
                  {isProcessing ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    <><Zap className="h-5 w-5" /> Recharge Now — M{formatNum(finalAmount || 0)}</>
                  )}
                </Button>
              </div>
            )}

            {/* ═══ STEP 3: CONFIRMING ═══ */}
            {step === "confirm" && foundUser && (
              <div className="flex flex-col items-center justify-center py-16 space-y-5">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary/30 animate-spin" style={{ animationDuration: "3s" }} />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-foreground">Processing Recharge</p>
                  <p className="text-xs text-muted-foreground mt-1.5">Crediting M{formatNum(finalAmount)} to {foundUser.name}...</p>
                </div>
                <div className="space-y-2.5 w-full max-w-[260px]">
                  {[
                    { text: "Verifying user account", done: true },
                    { text: "Validating voucher amount", done: true },
                    { text: "Crediting wallet", done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs">
                      {item.done
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        : <Loader2 className="h-4 w-4 text-muted-foreground animate-spin shrink-0" />
                      }
                      <span className={item.done ? "text-emerald-600 font-medium" : "text-muted-foreground animate-pulse"}>
                        {item.text}{!item.done && "..."}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ STEP 4: SUCCESS ═══ */}
            {step === "success" && foundUser && (
              <div className="space-y-5">
                {/* Hero */}
                <div className="flex flex-col items-center text-center pt-2 pb-1">
                  <div className="relative mb-4">
                    <div className="h-20 w-20 rounded-full bg-emerald-500/15 flex items-center justify-center animate-in zoom-in duration-300">
                      <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center animate-in zoom-in duration-500">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <p className="text-lg font-black text-foreground">Recharge Successful!</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">M{formatNum(finalAmount)}</p>
                  <p className="text-xs text-muted-foreground mt-1">credited to {foundUser.name}</p>
                </div>

                {/* Voucher PIN */}
                <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                  <div className="px-4 py-2.5 bg-muted/30 border-b border-border/30">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Voucher PIN</p>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-3">
                    <span className="font-mono text-base font-black text-foreground tracking-[0.15em]">
                      {voucherPin.slice(0,4)}-{voucherPin.slice(4,8)}-{voucherPin.slice(8,12)}-{voucherPin.slice(12)}
                    </span>
                    <button
                      onClick={handleCopyPin}
                      className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center touch-manipulation active:scale-90 shrink-0"
                    >
                      {pinCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-primary" />}
                    </button>
                  </div>
                </div>

                {/* Transaction Summary */}
                <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                  <div className="px-4 py-2.5 bg-muted/30 border-b border-border/30">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Transaction Summary</p>
                  </div>
                  <div className="p-4 space-y-2.5">
                    {[
                      { label: "Recipient", value: foundUser.name },
                      { label: "User ID", value: foundUser.id, mono: true },
                      { label: "Phone", value: foundUser.phone },
                      { label: "Transaction ID", value: txnId, mono: true, small: true },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className={`font-semibold text-foreground ${row.mono ? "font-mono" : ""} ${row.small ? "text-xs" : ""}`}>{row.value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Type</span>
                      <Badge className={`text-[10px] h-5 px-2 ${foundUser.type === "guest" ? "bg-amber-500/15 text-amber-600 border-amber-200" : "bg-primary/15 text-primary border-primary/20"}`}>
                        {foundUser.type === "guest" ? "Guest User" : "Registered User"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Badge className="bg-amber-500/15 text-amber-600 border-amber-200 text-xs px-3 h-6 mx-auto flex w-fit">
                  Tagged: Sold Offline
                </Badge>

                {/* Actions */}
                <div className="space-y-2 pb-2">
                  <Button
                    onClick={handleShareReceipt}
                    variant="outline"
                    className="w-full h-11 rounded-xl text-sm font-bold touch-manipulation active:scale-[0.97] gap-2 border-primary/30 text-primary"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Receipt with Buyer
                  </Button>

                  <div className="flex gap-2">
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
              </div>
            )}

          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
