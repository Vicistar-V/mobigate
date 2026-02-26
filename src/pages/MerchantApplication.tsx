import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Store, ChevronDown, Clock, Shield, ArrowLeft, CreditCard,
  Upload, Eye, EyeOff, Building2, Plus, Trash2, Save, RotateCcw
} from "lucide-react";
import { formatMobi, formatLocalAmount, generateTransactionReference } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { MerchantEligibilityCard } from "@/components/mobigate/MerchantEligibilityCard";

export default function MerchantApplication() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  // Create Account
  const [storeName, setStoreName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Application Data
  const [merchantName, setMerchantName] = useState("");
  const [businessProfile, setBusinessProfile] = useState("");
  const [dba, setDba] = useState("");
  const [registeredOffice, setRegisteredOffice] = useState("");
  const [companyRegNumber, setCompanyRegNumber] = useState("");
  const [regAuthority, setRegAuthority] = useState("");
  const [countryOfReg, setCountryOfReg] = useState("");
  const [tin, setTin] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");

  // Directors (dynamic list)
  const [directors, setDirectors] = useState<{ name: string; address: string; photo: string | null }[]>([
    { name: "", address: "", photo: null },
  ]);

  const updateDirector = (index: number, field: "name" | "address", value: string) => {
    setDirectors(prev => prev.map((d, i) => i === index ? { ...d, [field]: value } : d));
  };

  const updateDirectorPhoto = (index: number, photo: string | null) => {
    setDirectors(prev => prev.map((d, i) => i === index ? { ...d, photo } : d));
  };

  const addDirector = () => {
    setDirectors(prev => [...prev, { name: "", address: "", photo: null }]);
  };

  const removeDirector = (index: number) => {
    if (directors.length <= 1) return;
    setDirectors(prev => prev.filter((_, i) => i !== index));
  };

  // Other addresses
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");

  // Affiliates
  const [affiliate1Name, setAffiliate1Name] = useState("");
  const [affiliate1Address, setAffiliate1Address] = useState("");
  const [affiliate2Name, setAffiliate2Name] = useState("");
  const [affiliate2Address, setAffiliate2Address] = useState("");

  // Contact
  const [emailAddress, setEmailAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");

  // Banking (dynamic list)
  const [bankAccounts, setBankAccounts] = useState<{ acct: string; name: string; branch: string }[]>([
    { acct: "", name: "", branch: "" },
  ]);

  const updateBankAccount = (index: number, field: "acct" | "name" | "branch", value: string) => {
    setBankAccounts(prev => prev.map((b, i) => i === index ? { ...b, [field]: value } : b));
  };

  const addBankAccount = () => {
    setBankAccounts(prev => [...prev, { acct: "", name: "", branch: "" }]);
  };

  const removeBankAccount = (index: number) => {
    if (bankAccounts.length <= 1) return;
    setBankAccounts(prev => prev.filter((_, i) => i !== index));
  };

  const handlePhotoUpload = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateDirectorPhoto(index, url);
    }
  };

  const handleSubmit = () => {
    if (!acceptedPolicies) {
      toast({ title: "Accept Terms", description: "You must agree to the terms before submitting.", variant: "destructive" });
      return;
    }
    if (!storeName.trim() || !merchantName.trim()) {
      toast({ title: "Required Fields", description: "Please fill in store name and merchant name.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword || password.length < 4) {
      toast({ title: "Password Error", description: "Passwords must match and be at least 4 characters.", variant: "destructive" });
      return;
    }
    const ref = generateTransactionReference("MERCH-CORP");
    setRefNumber(ref);
    setSubmitted(true);
    toast({ title: "Application Submitted!", description: `Fee: ${formatMobi(50000)}. Ref: ${ref}` });
    localStorage.removeItem("mobigate-corp-merchant-draft");
  };

  const STORAGE_KEY = "mobigate-corp-merchant-draft";

  const saveDraft = useCallback(() => {
    const draft = {
      storeName, accountEmail, password, confirmPassword,
      merchantName, businessProfile, dba, registeredOffice,
      companyRegNumber, regAuthority, countryOfReg, tin,
      directors: directors.map(d => ({ name: d.name, address: d.address })),
      address1, address2, address3,
      affiliate1Name, affiliate1Address, affiliate2Name, affiliate2Address,
      emailAddress, website, phone1, phone2,
      bankAccounts: bankAccounts.map(b => ({ acct: b.acct, name: b.name, branch: b.branch })),
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    toast({ title: "Draft Saved", description: "Your progress has been saved. You can resume later." });
  }, [storeName, accountEmail, password, confirmPassword, merchantName, businessProfile, dba, registeredOffice, companyRegNumber, regAuthority, countryOfReg, tin, directors, address1, address2, address3, affiliate1Name, affiliate1Address, affiliate2Name, affiliate2Address, emailAddress, website, phone1, phone2, bankAccounts, toast]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStoreName(""); setAccountEmail(""); setPassword(""); setConfirmPassword("");
    setMerchantName(""); setBusinessProfile(""); setDba(""); setRegisteredOffice("");
    setCompanyRegNumber(""); setRegAuthority(""); setCountryOfReg(""); setTin("");
    setDirectors([{ name: "", address: "", photo: null }]);
    setAddress1(""); setAddress2(""); setAddress3("");
    setAffiliate1Name(""); setAffiliate1Address(""); setAffiliate2Name(""); setAffiliate2Address("");
    setEmailAddress(""); setWebsite(""); setPhone1(""); setPhone2("");
    setBankAccounts([{ acct: "", name: "", branch: "" }]);
    setAcceptedPolicies(false);
    toast({ title: "Draft Cleared", description: "All form data has been cleared." });
  }, [toast]);

  const [hasDraft, setHasDraft] = useState(false);
  const [draftDate, setDraftDate] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        setStoreName(draft.storeName || ""); setAccountEmail(draft.accountEmail || "");
        setPassword(draft.password || ""); setConfirmPassword(draft.confirmPassword || "");
        setMerchantName(draft.merchantName || ""); setBusinessProfile(draft.businessProfile || "");
        setDba(draft.dba || ""); setRegisteredOffice(draft.registeredOffice || "");
        setCompanyRegNumber(draft.companyRegNumber || ""); setRegAuthority(draft.regAuthority || "");
        setCountryOfReg(draft.countryOfReg || ""); setTin(draft.tin || "");
        if (draft.directors?.length) {
          setDirectors(draft.directors.map((d: any) => ({ name: d.name || "", address: d.address || "", photo: null })));
        }
        setAddress1(draft.address1 || ""); setAddress2(draft.address2 || ""); setAddress3(draft.address3 || "");
        setAffiliate1Name(draft.affiliate1Name || ""); setAffiliate1Address(draft.affiliate1Address || "");
        setAffiliate2Name(draft.affiliate2Name || ""); setAffiliate2Address(draft.affiliate2Address || "");
        setEmailAddress(draft.emailAddress || ""); setWebsite(draft.website || "");
        setPhone1(draft.phone1 || ""); setPhone2(draft.phone2 || "");
        if (draft.bankAccounts?.length) {
          setBankAccounts(draft.bankAccounts.map((b: any) => ({ acct: b.acct || "", name: b.name || "", branch: b.branch || "" })));
        }
        setHasDraft(true);
        if (draft.savedAt) {
          setDraftDate(new Date(draft.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }));
        }
      }
    } catch {}
  }, []);

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="border-b border-border pb-1 mb-3">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{children}</p>
    </div>
  );

  const FieldRow = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
    <div className="space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <div className="p-4 max-w-lg mx-auto space-y-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1 -ml-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          <Card className="border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/10">
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Clock className="h-7 w-7 text-amber-600" />
                </div>
                <h2 className="font-bold text-base">Application Under Review</h2>
                <p className="text-sm text-muted-foreground">Your corporate merchant application is being reviewed</p>
                <Badge variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-400 text-sm">
                  Estimated: 14–21 business days
                </Badge>
              </div>

              <div className="bg-background rounded-lg p-3 space-y-2 border text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono font-bold">{refNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant="secondary" className="text-xs h-5">Corporate</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Store Name</span>
                  <span className="font-medium">{storeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Business Name</span>
                  <span className="font-medium">{merchantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee Paid</span>
                  <span className="font-medium text-primary">{formatMobi(50000)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      <div className="p-4 max-w-lg mx-auto space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Corporate Merchant Application</h1>
            <p className="text-[11px] text-muted-foreground">Apply as a corporate Mobi-Merchant</p>
          </div>
        </div>

        {/* Draft Resume Banner */}
        {hasDraft && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-3 flex items-center gap-3">
              <RotateCcw className="h-4 w-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold">Draft Restored</p>
                {draftDate && <p className="text-xs text-muted-foreground">Last saved: {draftDate}</p>}
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => { clearDraft(); setHasDraft(false); }}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Merchant Application Requirements */}
        <Collapsible open={requirementsOpen} onOpenChange={setRequirementsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-3 cursor-pointer">
                <p className="text-xs font-semibold flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" /> Merchant Application Requirements
                </p>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${requirementsOpen ? "rotate-180" : ""}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 pb-3">
                <MerchantEligibilityCard />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* ===== CREATE ACCOUNT ===== */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <SectionTitle>Create Account</SectionTitle>

            <FieldRow label="Username [Store Name]">
              <Input value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="Your store name" className="text-sm h-9" />
            </FieldRow>

            <FieldRow label="E-Mail">
              <Input value={accountEmail} onChange={e => setAccountEmail(e.target.value)} placeholder="email@example.com" className="text-sm h-9" />
            </FieldRow>

            <FieldRow label="Password">
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="text-sm h-9 pr-9" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FieldRow>

            <FieldRow label="Confirm Password">
              <div className="relative">
                <Input type={showConfirmPassword ? "text" : "password"} value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="text-sm h-9 pr-9" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FieldRow>
          </CardContent>
        </Card>

        {/* ===== APPLICATION DATA ===== */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <SectionTitle>Application Data</SectionTitle>

            <FieldRow label="Merchant's Name [Business Name]">
              <Input value={merchantName} onChange={e => setMerchantName(e.target.value)} placeholder="Business name" className="text-sm h-9" />
            </FieldRow>

            <FieldRow label="Business Profile">
              <Textarea value={businessProfile} onChange={e => setBusinessProfile(e.target.value)}
                placeholder="Describe your business activities" className="text-sm min-h-[60px]" />
            </FieldRow>

            <FieldRow label="Doing Business As [DBA]">
              <Input value={dba} onChange={e => setDba(e.target.value)} placeholder="DBA name" className="text-sm h-9" />
            </FieldRow>

            <FieldRow label="Registered Office">
              <Input value={registeredOffice} onChange={e => setRegisteredOffice(e.target.value)} placeholder="Office address" className="text-sm h-9" />
            </FieldRow>

            <FieldRow label="Company Registration Number">
              <Input value={companyRegNumber} onChange={e => setCompanyRegNumber(e.target.value)} placeholder="e.g. RC-123456" className="text-sm h-9" />
            </FieldRow>

            <FieldRow label="Business Category">
              <Select value={businessCategory} onValueChange={setBusinessCategory}>
                <SelectTrigger className="text-sm h-9">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business_name">Business Name</SelectItem>
                  <SelectItem value="limited_liability">Limited Liability Company</SelectItem>
                  <SelectItem value="limited_partnership">Limited Partnership</SelectItem>
                  <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                  <SelectItem value="incorporated_trustee">Incorporated Trustee</SelectItem>
                </SelectContent>
              </Select>
            </FieldRow>

            <FieldRow label="Registration Authority">
              <Input value={regAuthority} onChange={e => setRegAuthority(e.target.value)} placeholder="e.g. CAC" className="text-sm h-9" />
            </FieldRow>

            <FieldRow label="Country of Registration">
              <Input value={countryOfReg} onChange={e => setCountryOfReg(e.target.value)} placeholder="e.g. Nigeria" className="text-sm h-9" />
            </FieldRow>

            <FieldRow label="Tax Identification Number [TIN]">
              <Input value={tin} onChange={e => setTin(e.target.value)} placeholder="TIN" className="text-sm h-9" />
            </FieldRow>
          </CardContent>
        </Card>

        {/* ===== PRINCIPAL OFFICERS ===== */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <SectionTitle>Name & Address of Principal Officers</SectionTitle>

            {directors.map((director, index) => (
              <div key={index} className="space-y-2 p-3 bg-muted/20 rounded-lg border border-border/50 relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground">[Director-{index + 1}]</p>
                  {directors.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => removeDirector(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <Input value={director.name} onChange={e => updateDirector(index, "name", e.target.value)} placeholder="Full name" className="text-sm h-9" />
                <Label className="text-xs font-medium">Address</Label>
                <Input value={director.address} onChange={e => updateDirector(index, "address", e.target.value)} placeholder="Director's address" className="text-sm h-9" />
                <Label className="text-xs font-medium">Passport Photograph</Label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-dashed border-border cursor-pointer text-xs text-muted-foreground hover:bg-muted/30 transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    {director.photo ? "Change Photo" : "Upload"}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload(index)} />
                  </label>
                  {director.photo && (
                    <img src={director.photo} alt={`Director ${index + 1}`} className="h-10 w-10 rounded-md object-cover border" />
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1.5"
              onClick={addDirector}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Another Director
            </Button>
          </CardContent>
        </Card>

        {/* ===== OTHER ADDRESSES ===== */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <SectionTitle>Other Business Addresses</SectionTitle>
            <FieldRow label="[i]">
              <Input value={address1} onChange={e => setAddress1(e.target.value)} placeholder="Business address 1" className="text-sm h-9" />
            </FieldRow>
            <FieldRow label="[ii]">
              <Input value={address2} onChange={e => setAddress2(e.target.value)} placeholder="Business address 2" className="text-sm h-9" />
            </FieldRow>
            <FieldRow label="[iii]">
              <Input value={address3} onChange={e => setAddress3(e.target.value)} placeholder="Business address 3" className="text-sm h-9" />
            </FieldRow>
          </CardContent>
        </Card>

        {/* ===== AFFILIATES ===== */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <SectionTitle>Affiliate [or Sister-Companies] (if any)</SectionTitle>

            <div className="space-y-2 p-3 bg-muted/20 rounded-lg border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground">[i]</p>
              <FieldRow label="Name">
                <Input value={affiliate1Name} onChange={e => setAffiliate1Name(e.target.value)} placeholder="Company name" className="text-sm h-9" />
              </FieldRow>
              <FieldRow label="Address">
                <Input value={affiliate1Address} onChange={e => setAffiliate1Address(e.target.value)} placeholder="Company address" className="text-sm h-9" />
              </FieldRow>
            </div>

            <div className="space-y-2 p-3 bg-muted/20 rounded-lg border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground">[ii]</p>
              <FieldRow label="Name">
                <Input value={affiliate2Name} onChange={e => setAffiliate2Name(e.target.value)} placeholder="Company name" className="text-sm h-9" />
              </FieldRow>
              <FieldRow label="Address">
                <Input value={affiliate2Address} onChange={e => setAffiliate2Address(e.target.value)} placeholder="Company address" className="text-sm h-9" />
              </FieldRow>
            </div>
          </CardContent>
        </Card>

        {/* ===== CONTACT ===== */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <SectionTitle>Contact Information</SectionTitle>

            <FieldRow label="E-Mail Address">
              <Input value={emailAddress} onChange={e => setEmailAddress(e.target.value)} placeholder="email@example.com" className="text-sm h-9" />
            </FieldRow>

            <FieldRow label="URL / Website">
              <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." className="text-sm h-9" />
            </FieldRow>

            <div className="grid grid-cols-2 gap-2">
              <FieldRow label="Telephone [i]">
                <Input value={phone1} onChange={e => setPhone1(e.target.value)} placeholder="+234..." className="text-sm h-9" />
              </FieldRow>
              <FieldRow label="Telephone [ii]">
                <Input value={phone2} onChange={e => setPhone2(e.target.value)} placeholder="+234..." className="text-sm h-9" />
              </FieldRow>
            </div>
          </CardContent>
        </Card>

        {/* ===== BANKING ===== */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <SectionTitle>Banking Information</SectionTitle>

            {bankAccounts.map((bank, index) => (
              <div key={index} className="space-y-2 p-3 bg-muted/20 rounded-lg border border-border/50 relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground">Bank Account [{index + 1}]</p>
                  {bankAccounts.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => removeBankAccount(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <FieldRow label="Account Number">
                  <Input value={bank.acct} onChange={e => updateBankAccount(index, "acct", e.target.value)} placeholder="Account number" className="text-sm h-9" />
                </FieldRow>
                <FieldRow label="Bank Name">
                  <Input value={bank.name} onChange={e => updateBankAccount(index, "name", e.target.value)} placeholder="Bank name" className="text-sm h-9" />
                </FieldRow>
                <FieldRow label="Branch Address">
                  <Input value={bank.branch} onChange={e => updateBankAccount(index, "branch", e.target.value)} placeholder="Branch address" className="text-sm h-9" />
                </FieldRow>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1.5"
              onClick={addBankAccount}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Another Bank Account
            </Button>
          </CardContent>
        </Card>

        {/* ===== TERMS & SUBMIT ===== */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-start gap-2.5 p-3 bg-muted/30 rounded-lg border">
              <Checkbox
                id="accept-policies"
                checked={acceptedPolicies}
                onCheckedChange={(checked) => setAcceptedPolicies(checked === true)}
                className="mt-0.5"
              />
              <Label htmlFor="accept-policies" className="text-[11px] leading-relaxed cursor-pointer">
                You must read and agree to the{" "}
                <span className="text-primary font-semibold underline">Terms and Conditions</span>{" "}
                of MOBIGATE Application usage and management policy, or else cancel the application and exit.
                Check the checkbox to agree and continue with your application. Application fee:{" "}
                <span className="font-bold text-primary">{formatMobi(50000)}</span>{" "}
                <span className="text-muted-foreground">(≈ {formatLocalAmount(50000, "NGN")})</span>
              </Label>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={saveDraft} className="flex-1 gap-2" size="lg">
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button variant="outline" onClick={clearDraft} className="gap-2 text-destructive hover:text-destructive" size="lg">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleSubmit} className="w-full gap-2" size="lg" disabled={!acceptedPolicies}>
              <Store className="h-4 w-4" />
              Submit Application — {formatMobi(50000)}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
