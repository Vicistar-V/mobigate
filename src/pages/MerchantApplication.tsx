import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Store, ChevronDown, Clock, Shield, ArrowLeft, CreditCard,
  Upload, Eye, EyeOff, Building2
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

  // Directors
  const [director1Name, setDirector1Name] = useState("");
  const [director1Address, setDirector1Address] = useState("");
  const [director1Photo, setDirector1Photo] = useState<string | null>(null);
  const [director2Name, setDirector2Name] = useState("");
  const [director2Address, setDirector2Address] = useState("");
  const [director2Photo, setDirector2Photo] = useState<string | null>(null);

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

  // Banking
  const [bankAcct1, setBankAcct1] = useState("");
  const [bankAcct2, setBankAcct2] = useState("");
  const [bankName1, setBankName1] = useState("");
  const [bankName2, setBankName2] = useState("");
  const [bankBranch1, setBankBranch1] = useState("");
  const [bankBranch2, setBankBranch2] = useState("");

  const handlePhotoUpload = (director: 1 | 2) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (director === 1) setDirector1Photo(url);
      else setDirector2Photo(url);
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
  };

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
                <p className="text-xs text-muted-foreground">Your corporate merchant application is being reviewed</p>
                <Badge variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-400 text-xs">
                  Estimated: 14–21 business days
                </Badge>
              </div>

              <div className="bg-background rounded-lg p-3 space-y-2 border text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono font-bold">{refNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant="secondary" className="text-[10px] h-5">Corporate</Badge>
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

            <div className="space-y-2 p-3 bg-muted/20 rounded-lg border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground">[Director-1]</p>
              <Input value={director1Name} onChange={e => setDirector1Name(e.target.value)} placeholder="Full name" className="text-sm h-9" />
              <Label className="text-xs font-medium">Address</Label>
              <Input value={director1Address} onChange={e => setDirector1Address(e.target.value)} placeholder="Director's address" className="text-sm h-9" />
              <Label className="text-xs font-medium">Passport Photograph</Label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-dashed border-border cursor-pointer text-xs text-muted-foreground hover:bg-muted/30 transition-colors">
                  <Upload className="h-3.5 w-3.5" />
                  {director1Photo ? "Change Photo" : "Upload"}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload(1)} />
                </label>
                {director1Photo && (
                  <img src={director1Photo} alt="Director 1" className="h-10 w-10 rounded-md object-cover border" />
                )}
              </div>
            </div>

            <div className="space-y-2 p-3 bg-muted/20 rounded-lg border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground">[Director-2]</p>
              <Input value={director2Name} onChange={e => setDirector2Name(e.target.value)} placeholder="Full name" className="text-sm h-9" />
              <Label className="text-xs font-medium">Address</Label>
              <Input value={director2Address} onChange={e => setDirector2Address(e.target.value)} placeholder="Director's address" className="text-sm h-9" />
              <Label className="text-xs font-medium">Passport Photograph</Label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-dashed border-border cursor-pointer text-xs text-muted-foreground hover:bg-muted/30 transition-colors">
                  <Upload className="h-3.5 w-3.5" />
                  {director2Photo ? "Change Photo" : "Upload"}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload(2)} />
                </label>
                {director2Photo && (
                  <img src={director2Photo} alt="Director 2" className="h-10 w-10 rounded-md object-cover border" />
                )}
              </div>
            </div>
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
          <CardContent className="p-4 space-y-3">
            <SectionTitle>Banking Information</SectionTitle>

            <div className="grid grid-cols-2 gap-2">
              <FieldRow label="Bank Account No. [i]">
                <Input value={bankAcct1} onChange={e => setBankAcct1(e.target.value)} placeholder="Account number" className="text-sm h-9" />
              </FieldRow>
              <FieldRow label="Bank Account No. [ii]">
                <Input value={bankAcct2} onChange={e => setBankAcct2(e.target.value)} placeholder="Account number" className="text-sm h-9" />
              </FieldRow>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FieldRow label="Bank Name [i]">
                <Input value={bankName1} onChange={e => setBankName1(e.target.value)} placeholder="Bank name" className="text-sm h-9" />
              </FieldRow>
              <FieldRow label="Bank Name [ii]">
                <Input value={bankName2} onChange={e => setBankName2(e.target.value)} placeholder="Bank name" className="text-sm h-9" />
              </FieldRow>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FieldRow label="Branch Address [i]">
                <Input value={bankBranch1} onChange={e => setBankBranch1(e.target.value)} placeholder="Branch address" className="text-sm h-9" />
              </FieldRow>
              <FieldRow label="Branch Address [ii]">
                <Input value={bankBranch2} onChange={e => setBankBranch2(e.target.value)} placeholder="Branch address" className="text-sm h-9" />
              </FieldRow>
            </div>
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
