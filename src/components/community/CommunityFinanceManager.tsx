import React, { useState, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Wallet, Plus, Send, Download, ArrowUpCircle, ArrowDownCircle, AlertTriangle,
  Building2, CreditCard, Trash2, Star, StarOff, RefreshCw,
  Users, CheckCircle, X, ChevronRight,
  TrendingUp, TrendingDown, Search, Loader2, BadgeCheck,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TransactionAuthorizationPanel } from "@/components/community/finance/TransactionAuthorizationPanel";

const API = "/api/community";

/* ── Types ─────────────────────────────────────────────────────────────────── */
interface BankAccount { id: string; bank_name: string; bank_code?: string; account_number: string; account_name: string; is_primary: boolean; is_verified: boolean; created_at: string; }
interface Transaction  { id: string; type: string; description: string; amount: number; status: string; created_at: string; member_name?: string; reference_number?: string; }
interface Payout       { id: string; recipient_name: string; amount: number; description: string; status: string; recipient_bank_name: string; recipient_account_number: string; transaction_ref: string; created_at: string; }
interface Withdrawal   { id: string; amount: number; description: string; status: string; transaction_ref: string; bank_name: string; account_number: string; account_name: string; created_at: string; }
interface Member       { user_id: string; name: string; profile_photo?: string; email?: string; }

const NIGERIAN_BANKS = [
  { code: "044", name: "Access Bank" },
  { code: "023", name: "Citibank" },
  { code: "063", name: "Diamond Bank" },
  { code: "050", name: "Ecobank Nigeria" },
  { code: "214", name: "First City Monument Bank (FCMB)" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "070", name: "Fidelity Bank" },
  { code: "058", name: "Guaranty Trust Bank (GTBank)" },
  { code: "030", name: "Heritage Bank" },
  { code: "301", name: "Jaiz Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "526", name: "Kuda Bank" },
  { code: "076", name: "Polaris Bank" },
  { code: "101", name: "ProvidusBank" },
  { code: "221", name: "Stanbic IBTC Bank" },
  { code: "068", name: "Standard Chartered Bank" },
  { code: "232", name: "Sterling Bank" },
  { code: "100", name: "Suntrust Bank" },
  { code: "302", name: "TAJ Bank" },
  { code: "102", name: "Titan Trust Bank" },
  { code: "033", name: "United Bank for Africa (UBA)" },
  { code: "215", name: "Unity Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
  { code: "999", name: "Other" },
];

function amtFmt(n: number) { return "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function timeAgo(d: string) { try { return formatDistanceToNow(new Date(d), { addSuffix: true }); } catch { return ""; } }

/* ── Main component ─────────────────────────────────────────────────────────── */
interface Props { open: boolean; onOpenChange: (v: boolean) => void; communityId?: string; }

export function CommunityFinanceManager({ open, onOpenChange, communityId }: Props) {
  const [tab,           setTab]           = useState("overview");
  const [loading,       setLoading]       = useState(false);
  const [submitting,    setSubmitting]    = useState(false);
  const [balance,       setBalance]       = useState(0);
  const [totalIncome,   setTotalIncome]   = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactions,  setTransactions]  = useState<Transaction[]>([]);
  const [bankAccounts,  setBankAccounts]  = useState<BankAccount[]>([]);
  const [payouts,       setPayouts]       = useState<Payout[]>([]);
  const [withdrawals,   setWithdrawals]   = useState<Withdrawal[]>([]);
  const [pendingTxns,   setPendingTxns]   = useState<any[]>([]);
  const [members,       setMembers]       = useState<Member[]>([]);

  /* dialogs */
  const [showAddBank,    setShowAddBank]    = useState(false);
  const [showTopup,      setShowTopup]      = useState(false);
  const [showSendMember, setShowSendMember] = useState(false);
  const [showWithdraw,   setShowWithdraw]   = useState(false);

  const fetchData = useCallback(async () => {
    if (!communityId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/finance.php?community_id=${communityId}`, { credentials: "include" });
      if (!res.ok) return;
      const d = await res.json();
      setBalance(parseFloat(d.account?.balance ?? 0));
      setTotalIncome(parseFloat(d.account?.total_income ?? 0));
      setTotalExpenses(parseFloat(d.account?.total_expenses ?? 0));
      setTransactions(d.transactions ?? []);
      setBankAccounts(d.bankAccounts ?? []);
      setPayouts(d.payouts ?? []);
      setWithdrawals(d.withdrawals ?? []);
      setPendingTxns(d.pendingTxns ?? []);
      // Set members from finance response if available
      if (d.members?.length) setMembers(d.members);
    } catch {}
    finally { setLoading(false); }
  }, [communityId]);

  // Fetch members separately from members.php (no admin gate) so Transfer
  // always shows the full member list regardless of finance.php access level
  const fetchMembers = useCallback(async () => {
    if (!communityId) return;
    try {
      const res = await fetch(`${API}/members.php?community_id=${communityId}`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.members ?? []);
      if (list.length > 0) {
        setMembers(list.map((m: any) => ({
          user_id:       m.user_id,
          name:          m.name || m.username || "Unknown",
          profile_photo: m.profile_photo ?? null,
          role:          m.role,
          email:         m.email ?? null,
        })));
      }
    } catch {}
  }, [communityId]);

  useEffect(() => {
    if (open) {
      fetchData();
      fetchMembers(); // always fetch members independently
    }
  }, [open, fetchData, fetchMembers]);

  const callAPI = async (body: object): Promise<any> => {
    const res = await fetch(`${API}/finance.php`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, community_id: communityId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  };

  /* ── Inline balance bar ─────────────────────────────────────────────────── */
  const BalanceBar = () => (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl p-4 mb-4">
      <p className="text-xs font-medium opacity-80 mb-1">Community Wallet Balance</p>
      <p className="text-3xl font-bold">{amtFmt(balance)}</p>
      <div className="flex gap-4 mt-3 text-xs opacity-90">
        <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Income: {amtFmt(totalIncome)}</span>
        <span className="flex items-center gap-1"><TrendingDown className="h-3 w-3" /> Spent: {amtFmt(totalExpenses)}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        <Button size="sm" variant="secondary" className="text-xs gap-1 bg-white/20 hover:bg-white/30 text-white border-0" onClick={() => setShowTopup(true)}>
          <ArrowUpCircle className="h-3 w-3" /> Top Up
        </Button>
        <Button size="sm" variant="secondary" className="text-xs gap-1 bg-white/20 hover:bg-white/30 text-white border-0" onClick={() => setShowSendMember(true)}>
          <Send className="h-3 w-3" /> Send
        </Button>
        <Button size="sm" variant="secondary" className="text-xs gap-1 bg-white/20 hover:bg-white/30 text-white border-0" onClick={() => setShowWithdraw(true)}
          disabled={bankAccounts.length === 0}>
          <Download className="h-3 w-3" /> Withdraw
        </Button>
      </div>
    </div>
  );

  return (
    <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[94vh] p-0 rounded-t-2xl flex flex-col">
        <SheetTitle className="sr-only">Finance Manager</SheetTitle>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100"><Wallet className="h-5 w-5 text-amber-600" /></div>
            <div>
              <h2 className="font-bold text-base">Finance Manager</h2>
              <p className="text-xs text-muted-foreground">Community wallet & transfers</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={fetchData} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="px-4 py-4">
            <BalanceBar />

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid grid-cols-4 w-full h-9 mb-4">
                <TabsTrigger value="overview" className="text-xs">Transactions</TabsTrigger>
                <TabsTrigger value="payouts"  className="text-xs">Payouts</TabsTrigger>
                <TabsTrigger value="withdraw" className="text-xs">Withdrawals</TabsTrigger>
                <TabsTrigger value="accounts" className="text-xs">Accounts</TabsTrigger>
              </TabsList>

              {/* ── Transactions ────────────────────────────────────────── */}
              <TabsContent value="overview" className="mt-0 space-y-2">
                {/* Pending authorizations */}
                {pendingTxns.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-semibold flex items-center gap-1.5 text-amber-700">
                      <AlertTriangle className="h-4 w-4" />Pending Authorization ({pendingTxns.length})
                    </p>
                    {pendingTxns.map((pt: any) => (
                      <div key={pt.id} className="p-3 rounded-xl border border-amber-200 bg-amber-50/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium capitalize">{pt.type} — {amtFmt(parseFloat(pt.amount))}</p>
                            <p className="text-xs text-muted-foreground">{pt.description}</p>
                            <p className="text-xs text-amber-600 mt-0.5">{pt.current_sigs}/{pt.required_sigs} signatures</p>
                          </div>
                          <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px] shrink-0">Pending Auth</Badge>
                        </div>
                        <TransactionAuthorizationPanel
                          communityId={communityId}
                          txnId={pt.id}
                          onConfirm={fetchData}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {transactions.length === 0 ? (
                  <div className="text-center py-10"><Wallet className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No transactions yet</p></div>
                ) : transactions.map(t => (
                  <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl border bg-card">
                    <div className={cn("p-2 rounded-lg shrink-0", t.type === "income" || t.type === "topup" ? "bg-green-100" : t.type === "payout" || t.type === "withdrawal" || t.type === "expense" ? "bg-red-100" : "bg-blue-100")}>
                      {t.type === "income" || t.type === "topup" ? <TrendingUp className="h-4 w-4 text-green-600" /> : t.type === "payout" || t.type === "withdrawal" || t.type === "expense" ? <TrendingDown className="h-4 w-4 text-red-600" /> : <ArrowDownCircle className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{t.member_name && `${t.member_name} • `}{timeAgo(t.created_at)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={cn("text-sm font-bold", t.type === "income" || t.type === "topup" ? "text-green-600" : "text-red-600")}>{t.type === "income" || t.type === "topup" ? "+" : "-"}{amtFmt(parseFloat(String(t.amount)))}</p>
                      <Badge variant={t.status === "completed" ? "secondary" : "outline"} className="text-[10px] px-1">{t.status}</Badge>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* ── Payouts ─────────────────────────────────────────────── */}
              <TabsContent value="payouts" className="mt-0 space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Member Payouts</p>
                  <Button size="sm" className="gap-1 h-7 text-xs" onClick={() => setShowSendMember(true)}><Send className="h-3 w-3" /> Send Money</Button>
                </div>
                {payouts.length === 0 ? (
                  <div className="text-center py-10"><Users className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No payouts sent yet</p></div>
                ) : payouts.map(p => (
                  <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl border bg-card">
                    <div className="p-2 rounded-lg bg-red-100 shrink-0"><Send className="h-4 w-4 text-red-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{p.recipient_name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                      {p.recipient_bank_name && <p className="text-xs text-muted-foreground">{p.recipient_bank_name} • {p.recipient_account_number}</p>}
                      <p className="text-[10px] text-muted-foreground">{p.transaction_ref} • {timeAgo(p.created_at)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-red-600">-{amtFmt(parseFloat(String(p.amount)))}</p>
                      <Badge variant={p.status === "completed" ? "secondary" : p.status === "failed" ? "destructive" : "outline"} className="text-[10px] px-1">{p.status}</Badge>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* ── Withdrawals ──────────────────────────────────────────── */}
              <TabsContent value="withdraw" className="mt-0 space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Withdrawals</p>
                  <Button size="sm" className="gap-1 h-7 text-xs" onClick={() => setShowWithdraw(true)} disabled={bankAccounts.length === 0}>
                    <Download className="h-3 w-3" /> Withdraw
                  </Button>
                </div>
                {bankAccounts.length === 0 && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700 mb-3">
                    <AlertTriangle className="h-4 w-4 shrink-0" />Add a bank account first to withdraw funds.
                  </div>
                )}
                {withdrawals.length === 0 ? (
                  <div className="text-center py-10"><Download className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No withdrawals yet</p></div>
                ) : withdrawals.map(w => (
                  <div key={w.id} className="flex items-start gap-3 p-3 rounded-xl border bg-card">
                    <div className="p-2 rounded-lg bg-orange-100 shrink-0"><Building2 className="h-4 w-4 text-orange-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{w.bank_name}</p>
                      <p className="text-xs text-muted-foreground">{w.account_number} • {w.account_name}</p>
                      <p className="text-xs text-muted-foreground">{w.description}</p>
                      <p className="text-[10px] text-muted-foreground">{w.transaction_ref} • {timeAgo(w.created_at)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-orange-600">-{amtFmt(parseFloat(String(w.amount)))}</p>
                      <Badge variant={w.status === "completed" ? "secondary" : w.status === "failed" ? "destructive" : "outline"} className="text-[10px] px-1">{w.status}</Badge>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* ── Bank Accounts ─────────────────────────────────────────── */}
              <TabsContent value="accounts" className="mt-0 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Registered Bank Accounts</p>
                  <Button size="sm" className="gap-1 h-7 text-xs" onClick={() => setShowAddBank(true)}><Plus className="h-3 w-3" /> Add Account</Button>
                </div>
                {bankAccounts.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed rounded-xl">
                    <Building2 className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">No bank accounts yet</p>
                    <p className="text-xs text-muted-foreground mb-3">Add a bank account to enable withdrawals</p>
                    <Button size="sm" onClick={() => setShowAddBank(true)}><Plus className="h-4 w-4 mr-1" /> Add Bank Account</Button>
                  </div>
                ) : bankAccounts.map(acc => (
                  <div key={acc.id} className={cn("flex items-center gap-3 p-3 rounded-xl border bg-card", acc.is_primary && "border-primary/30 bg-primary/5")}>
                    <div className="p-2.5 rounded-xl bg-blue-100 shrink-0"><CreditCard className="h-4 w-4 text-blue-600" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{acc.bank_name}</p>
                        {acc.is_primary && <Badge className="text-[10px] px-1.5 bg-primary/10 text-primary">Primary</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{acc.account_number}</p>
                      <p className="text-xs font-medium">{acc.account_name}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {!acc.is_primary && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Set as primary" onClick={async () => {
                          await callAPI({ action: "set_primary_account", bank_account_id: acc.id });
                          toast.success("Primary account updated"); fetchData();
                        }}><Star className="h-3.5 w-3.5 text-amber-500" /></Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" title="Remove" onClick={async () => {
                        if (!confirm("Remove this bank account?")) return;
                        await callAPI({ action: "remove_bank_account", bank_account_id: acc.id });
                        toast.success("Account removed"); fetchData();
                      }}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>

    {/* ── Add Bank Account Dialog ─────────────────────────────────────────── */}
    <AddBankAccountDialog open={showAddBank} onOpenChange={setShowAddBank} onSaved={() => { fetchData(); setShowAddBank(false); }} callAPI={callAPI} />

    {/* ── Top-up Dialog ───────────────────────────────────────────────────── */}
    <TopupDialog open={showTopup} onOpenChange={setShowTopup} onSaved={() => { fetchData(); setShowTopup(false); }} callAPI={callAPI} />

    {/* ── Send to Member Dialog ───────────────────────────────────────────── */}
    <SendToMemberDialog open={showSendMember} onOpenChange={setShowSendMember} communityId={communityId} members={members} balance={balance} onSaved={() => { fetchData(); setShowSendMember(false); }} callAPI={callAPI} />

    {/* ── Withdraw Dialog ─────────────────────────────────────────────────── */}
    <WithdrawDialog open={showWithdraw} onOpenChange={setShowWithdraw} bankAccounts={bankAccounts} balance={balance} onSaved={() => { fetchData(); setShowWithdraw(false); }} callAPI={callAPI} />
    </>
  );
}

/* ── Add Bank Account Dialog ──────────────────────────────────────────────── */
function AddBankAccountDialog({ open, onOpenChange, onSaved, callAPI }: { open: boolean; onOpenChange: (v: boolean) => void; onSaved: () => void; callAPI: (b: object) => Promise<any>; }) {
  const [bankCode,   setBankCode]   = useState("");
  const [bankName,   setBankName]   = useState("");
  const [accNumber,  setAccNumber]  = useState("");
  const [accName,    setAccName]    = useState("");
  const [isPrimary,  setIsPrimary]  = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleBankChange = (code: string) => {
    setBankCode(code);
    setBankName(NIGERIAN_BANKS.find(b => b.code === code)?.name ?? "");
  };

  const handleSubmit = async () => {
    if (!bankName || !accNumber || !accName) { toast.error("All fields are required"); return; }
    setSubmitting(true);
    try {
      const d = await callAPI({ action: "add_bank_account", bank_name: bankName, bank_code: bankCode, account_number: accNumber, account_name: accName, is_primary: isPrimary });
      toast.success(d.message || "Bank account added");
      onSaved();
      setBankCode(""); setBankName(""); setAccNumber(""); setAccName(""); setIsPrimary(false);
    } catch (e: any) { toast.error(e.message || "Failed to add account"); }
    finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm w-full rounded-2xl" style={{ maxHeight: "90vh" }}>
        <DialogTitle className="sr-only">Add Bank Account</DialogTitle>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-blue-100"><Building2 className="h-5 w-5 text-blue-600" /></div>
          <div><h3 className="font-bold">Add Bank Account</h3><p className="text-xs text-muted-foreground">For community withdrawals</p></div>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-sm">Bank Name *</Label>
            <Select onValueChange={handleBankChange} value={bankCode}>
              <SelectTrigger><SelectValue placeholder="Select bank…" /></SelectTrigger>
              <SelectContent>
                {NIGERIAN_BANKS.map(b => <SelectItem key={b.code} value={b.code}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Account Number * <span className="text-muted-foreground text-xs">(10 digits)</span></Label>
            <Input placeholder="0000000000" value={accNumber} maxLength={10} onChange={e => setAccNumber(e.target.value.replace(/\D/g,""))} />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Account Name *</Label>
            <Input placeholder="e.g. NDIGBO UNITY ASSOCIATION" value={accName} onChange={e => setAccName(e.target.value.toUpperCase())} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isPrimary} onChange={e => setIsPrimary(e.target.checked)} className="rounded" />
            <span className="text-sm">Set as primary account</span>
          </label>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="flex-1" disabled={submitting || !bankName || !accNumber || !accName} onClick={handleSubmit}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />} Add Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Top-up Dialog ────────────────────────────────────────────────────────── */
function TopupDialog({ open, onOpenChange, onSaved, callAPI }: { open: boolean; onOpenChange: (v: boolean) => void; onSaved: () => void; callAPI: (b: object) => Promise<any>; }) {
  const [amount,     setAmount]     = useState("");
  const [desc,       setDesc]       = useState("");
  const [reference,  setReference]  = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    setSubmitting(true);
    try {
      const d = await callAPI({ action: "topup_balance", amount: amt, description: desc || "Wallet top-up", reference });
      toast.success(d.message || "Wallet topped up");
      onSaved(); setAmount(""); setDesc(""); setReference("");
    } catch (e: any) { toast.error(e.message || "Top-up failed"); }
    finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm w-full rounded-2xl">
        <DialogTitle className="sr-only">Top Up Wallet</DialogTitle>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-green-100"><ArrowUpCircle className="h-5 w-5 text-green-600" /></div>
          <div><h3 className="font-bold">Top Up Wallet</h3><p className="text-xs text-muted-foreground">Add funds to community wallet</p></div>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-sm">Amount (₦) *</Label>
            <Input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} min="1" />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Description</Label>
            <Input placeholder="e.g. Annual dues collection" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Reference / Receipt No.</Label>
            <Input placeholder="e.g. TXN-123456" value={reference} onChange={e => setReference(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700" disabled={submitting || !amount} onClick={handleSubmit}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <ArrowUpCircle className="h-4 w-4 mr-1" />} Top Up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Send to Member Dialog ────────────────────────────────────────────────── */
function SendToMemberDialog({ open, onOpenChange, communityId, members: membersProp, balance, onSaved, callAPI }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  communityId?: string;
  members: Member[];
  balance: number; onSaved: () => void; callAPI: (b: object) => Promise<any>;
}) {
  const [search,        setSearch]        = useState("");
  const [selected,      setSelected]      = useState<Member | null>(null);
  const [amount,        setAmount]        = useState("");
  const [desc,          setDesc]          = useState("");
  const [bankName,      setBankName]      = useState("");
  const [bankCode,      setBankCode]      = useState("");
  const [accNumber,     setAccNumber]     = useState("");
  const [accName,       setAccName]       = useState("");
  const [submitting,    setSubmitting]    = useState(false);
  const [step,          setStep]          = useState<"select"|"details">("select");

  // ── Member fetch — inline in useEffect to avoid stale closure ───────────
  const [localMembers,   setLocalMembers]   = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [fetchError,     setFetchError]     = useState<string | null>(null);
  const [retryCount,     setRetryCount]     = useState(0);

  useEffect(() => {
    if (!open) return;

    // Use parent's pre-loaded list immediately if available
    if (membersProp.length > 0) {
      setLocalMembers(membersProp);
      return;
    }

    if (!communityId) {
      setFetchError("Community ID is missing.");
      return;
    }

    let cancelled = false;
    setLoadingMembers(true);
    setFetchError(null);

    // Use manage_members.php — same as AllMembersDrawer (admin-context, guaranteed to work)
    fetch(`/api/community/manage_members.php?community_id=${communityId}`, { credentials: "include" })
      .then(async (res) => {
        const text = await res.text();
        let data: any;
        try { data = JSON.parse(text); } catch { throw new Error(`Bad response: ${text.substring(0, 80)}`); }
        if (!res.ok) throw new Error(data?.error || `Error ${res.status}`);
        // manage_members.php wraps in { members: [...] }
        const list: any[] = Array.isArray(data) ? data : (data.members ?? []);
        if (!cancelled) {
          if (list.length === 0) {
            setFetchError("No active members found.");
          } else {
            setLocalMembers(list.map((m: any) => ({
              user_id:       m.user_id,
              name:          m.name || m.username || "Unknown",
              profile_photo: m.profile_photo || undefined,
              role:          m.role,
              email:         m.email || undefined,
            })));
          }
        }
      })
      .catch((e) => {
        if (!cancelled) setFetchError(e.message || "Failed to load members");
      })
      .finally(() => {
        if (!cancelled) setLoadingMembers(false);
      });

    return () => { cancelled = true; };
  // retryCount forces re-fetch when Retry clicked
  }, [open, communityId, membersProp, retryCount]);

  // Sync when parent list arrives after dialog opens
  useEffect(() => {
    if (membersProp.length > 0 && open) setLocalMembers(membersProp);
  }, [membersProp, open]);

  const doRetry = () => setRetryCount(c => c + 1);

  const displayMembers = localMembers.length > 0 ? localMembers : membersProp;
  const filtered = displayMembers.filter(m =>
    (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleBankChange = (code: string) => {
    setBankCode(code);
    setBankName(NIGERIAN_BANKS.find(b => b.code === code)?.name ?? "");
  };

  const handleSubmit = async () => {
    const amt = parseFloat(amount);
    if (!selected || !amt || amt <= 0) { toast.error("Select a member and enter a valid amount"); return; }
    if (amt > balance) { toast.error(`Insufficient balance. Available: ${amtFmt(balance)}`); return; }
    setSubmitting(true);
    try {
      const d = await callAPI({ action: "send_to_member", recipient_user_id: selected.user_id, amount: amt, description: desc || `Payment to ${selected.name}`, recipient_bank_name: bankName, recipient_account_number: accNumber, recipient_account_name: accName });
      toast.success(d.message || "Payment sent");
      onSaved(); setSelected(null); setAmount(""); setDesc(""); setBankName(""); setAccNumber(""); setAccName(""); setStep("select"); setSearch("");
    } catch (e: any) { toast.error(e.message || "Transfer failed"); }
    finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setStep("select"); setSelected(null); } }}>
      <DialogContent className="max-w-sm w-full rounded-2xl flex flex-col" style={{ maxHeight: "90vh" }}>
        <DialogTitle className="sr-only">Send Money to Member</DialogTitle>
        <div className="flex items-center gap-2 mb-4 shrink-0">
          <div className="p-2 rounded-xl bg-primary/10"><Send className="h-5 w-5 text-primary" /></div>
          <div>
            <h3 className="font-bold">Send Money</h3>
            <p className="text-xs text-muted-foreground">Available: {amtFmt(balance)}</p>
          </div>
        </div>

        {step === "select" ? (
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="relative mb-3 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search members…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            {loadingMembers ? (
              <div className="flex flex-col items-center gap-3 py-10">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading community members…</p>
              </div>
            ) : fetchError ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <Users className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">{fetchError}</p>
                <Button size="sm" variant="outline" onClick={doRetry}>
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-1 min-h-0" style={{ WebkitOverflowScrolling: "touch" }}>
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-10 text-center">
                      <Users className="h-10 w-10 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">
                        {displayMembers.length === 0 ? "No members found in this community" : `No results for "${search}"`}
                      </p>
                    </div>
                  ) : filtered.map(m => (
                    <button key={m.user_id} onClick={() => { setSelected(m); setStep("details"); }} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted active:bg-muted/80 text-left transition-colors">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={m.profile_photo} />
                        <AvatarFallback className="font-semibold">{(m.name || "U")[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{m.name}</p>
                        <p className="text-xs text-muted-foreground truncate capitalize">{m.role || "member"}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
                {displayMembers.length > 0 && (
                  <p className="text-xs text-muted-foreground text-center pt-2 shrink-0">
                    {filtered.length} of {displayMembers.length} member{displayMembers.length !== 1 ? "s" : ""}
                  </p>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
              <Avatar className="h-9 w-9"><AvatarImage src={selected?.profile_photo} /><AvatarFallback>{selected?.name[0]}</AvatarFallback></Avatar>
              <div><p className="text-sm font-semibold">{selected?.name}</p><p className="text-xs text-muted-foreground">Recipient</p></div>
              <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setStep("select")}>Change</Button>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Amount (₦) *</Label>
              <Input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} min="1" max={balance} />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Description</Label>
              <Input placeholder="Reason for payment" value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
            <Separator />
            <p className="text-xs font-semibold text-muted-foreground">Recipient Bank Details (optional)</p>
            <div className="space-y-1">
              <Label className="text-sm">Bank</Label>
              <Select onValueChange={handleBankChange} value={bankCode}>
                <SelectTrigger><SelectValue placeholder="Select bank…" /></SelectTrigger>
                <SelectContent>{NIGERIAN_BANKS.map(b => <SelectItem key={b.code} value={b.code}>{b.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs">Account Number</Label><Input placeholder="0000000000" maxLength={10} value={accNumber} onChange={e => setAccNumber(e.target.value.replace(/\D/g,""))} /></div>
              <div className="space-y-1"><Label className="text-xs">Account Name</Label><Input placeholder="Name on account" value={accName} onChange={e => setAccName(e.target.value)} /></div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep("select")}>Back</Button>
              <Button className="flex-1" disabled={submitting || !amount} onClick={handleSubmit}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />} Send {amount ? amtFmt(parseFloat(amount)||0) : ""}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ── Withdraw Dialog ─────────────────────────────────────────────────────── */
function WithdrawDialog({ open, onOpenChange, bankAccounts, balance, onSaved, callAPI }: { open: boolean; onOpenChange: (v: boolean) => void; bankAccounts: BankAccount[]; balance: number; onSaved: () => void; callAPI: (b: object) => Promise<any>; }) {
  const [selectedBank, setSelectedBank] = useState("");
  const [amount,       setAmount]       = useState("");
  const [desc,         setDesc]         = useState("");
  const [submitting,   setSubmitting]   = useState(false);

  useEffect(() => {
    if (open && bankAccounts.length > 0) {
      const primary = bankAccounts.find(b => b.is_primary) || bankAccounts[0];
      setSelectedBank(primary.id);
    }
  }, [open, bankAccounts]);

  const handleSubmit = async () => {
    const amt = parseFloat(amount);
    if (!selectedBank || !amt || amt <= 0) { toast.error("Select an account and enter amount"); return; }
    if (amt > balance) { toast.error(`Insufficient balance. Available: ${amtFmt(balance)}`); return; }
    setSubmitting(true);
    try {
      const d = await callAPI({ action: "withdraw_to_account", bank_account_id: selectedBank, amount: amt, description: desc || "Community withdrawal" });
      toast.success(d.message || "Withdrawal initiated");
      onSaved(); setAmount(""); setDesc("");
    } catch (e: any) { toast.error(e.message || "Withdrawal failed"); }
    finally { setSubmitting(false); }
  };

  const bank = bankAccounts.find(b => b.id === selectedBank);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm w-full rounded-2xl">
        <DialogTitle className="sr-only">Withdraw Funds</DialogTitle>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-orange-100"><Download className="h-5 w-5 text-orange-600" /></div>
          <div><h3 className="font-bold">Withdraw Funds</h3><p className="text-xs text-muted-foreground">Available: {amtFmt(balance)}</p></div>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-sm">Destination Account *</Label>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger><SelectValue placeholder="Select account…" /></SelectTrigger>
              <SelectContent>
                {bankAccounts.map(b => <SelectItem key={b.id} value={b.id}>{b.bank_name} — {b.account_number} {b.is_primary ? "(Primary)" : ""}</SelectItem>)}
              </SelectContent>
            </Select>
            {bank && <div className="p-2.5 rounded-lg bg-muted text-xs"><p className="font-medium">{bank.account_name}</p><p className="text-muted-foreground">{bank.bank_name} • {bank.account_number}</p></div>}
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Amount (₦) *</Label>
            <Input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} min="1" max={balance} />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Description</Label>
            <Input placeholder="Purpose of withdrawal" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />Withdrawals are initiated immediately and pending gateway processing.
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="flex-1 bg-orange-600 hover:bg-orange-700" disabled={submitting || !selectedBank || !amount} onClick={handleSubmit}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Download className="h-4 w-4 mr-1" />} Withdraw
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}