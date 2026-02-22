import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Store, ChevronDown, Clock, Shield, ArrowLeft, CreditCard,
  User, MapPin, Globe, Landmark, BadgeCheck, Plus, Minus
} from "lucide-react";
import { formatMobi, formatLocalAmount, generateTransactionReference } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { MerchantEligibilityCard } from "@/components/mobigate/MerchantEligibilityCard";

const genderOptions = ["Male", "Female"];
const maritalStatusOptions = ["Single", "Married", "Divorced", "Separated", "Widowed", "Complicated"];
const verificationTypes = [
  "National Identification Number (NIN)",
  "National Driver's Licence Number",
  "International Passport Number",
  "Permanent Voter's Card",
  "National Insurance Security Number",
  "National Health Insurance Number",
  "Other",
];

const currencyOptions = [
  { value: "NGN", label: "Nigerian Naira (₦)" },
  { value: "USD", label: "US Dollar ($)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GHS", label: "Ghanaian Cedi (₵)" },
  { value: "KES", label: "Kenyan Shilling (KSh)" },
  { value: "ZAR", label: "South African Rand (R)" },
  { value: "INR", label: "Indian Rupee (₹)" },
  { value: "CNY", label: "Chinese Yuan (¥)" },
  { value: "JPY", label: "Japanese Yen (¥)" },
];

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="border-b border-border pb-1.5 mb-3 flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

export default function IndividualMerchantApplication() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  // Personal Data
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [birthTown, setBirthTown] = useState("");
  const [birthLGA, setBirthLGA] = useState("");
  const [birthState, setBirthState] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [profession, setProfession] = useState("");

  // Contact Details
  const [hometownAddress, setHometownAddress] = useState("");
  const [nearestTown, setNearestTown] = useState("");
  const [lgaOfOrigin, setLgaOfOrigin] = useState("");
  const [stateOfOrigin, setStateOfOrigin] = useState("");
  const [nationality, setNationality] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [townOfResidence, setTownOfResidence] = useState("");
  const [lgaOfResidence, setLgaOfResidence] = useState("");
  const [stateOfResidence, setStateOfResidence] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [email, setEmail] = useState("");

  // Banking
  const [bankEntries, setBankEntries] = useState([{ bankName: "", accountName: "", accountNumber: "" }]);

  // Application Data
  const [preferredCurrency, setPreferredCurrency] = useState("NGN");

  // Verification
  const [verifications, setVerifications] = useState([{ type: "", number: "" }]);

  const addBankEntry = () => {
    if (bankEntries.length < 3) setBankEntries([...bankEntries, { bankName: "", accountName: "", accountNumber: "" }]);
  };
  const removeBankEntry = (i: number) => {
    if (bankEntries.length > 1) setBankEntries(bankEntries.filter((_, idx) => idx !== i));
  };
  const updateBank = (i: number, field: string, value: string) => {
    const updated = [...bankEntries];
    (updated[i] as any)[field] = value;
    setBankEntries(updated);
  };

  const addVerification = () => {
    if (verifications.length < 4) setVerifications([...verifications, { type: "", number: "" }]);
  };
  const removeVerification = (i: number) => {
    if (verifications.length > 1) setVerifications(verifications.filter((_, idx) => idx !== i));
  };
  const updateVerification = (i: number, field: string, value: string) => {
    const updated = [...verifications];
    (updated[i] as any)[field] = value;
    setVerifications(updated);
  };

  const isFormValid = firstName && lastName && gender && dobDay && dobMonth && dobYear && nationality && phone1 && email && acceptedPolicies;

  const handleSubmit = () => {
    if (!isFormValid) {
      toast({ title: "Incomplete Form", description: "Please fill all required fields and accept the terms.", variant: "destructive" });
      return;
    }
    const ref = generateTransactionReference("MERCH-IND");
    setRefNumber(ref);
    setSubmitted(true);
    toast({ title: "Application Submitted!", description: `Fee: ${formatMobi(50000)}. Ref: ${ref}` });
  };

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
                <p className="text-xs text-muted-foreground">Your individual merchant application is being reviewed by our team</p>
                <Badge variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-400 text-xs">
                  Estimated: 3–5 business days
                </Badge>
              </div>
              <div className="bg-background rounded-lg p-3 space-y-2 border text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Reference</span><span className="font-mono font-bold">{refNumber}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><Badge variant="secondary" className="text-[10px] h-5">Individual</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{firstName} {middleName} {lastName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{email}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Fee Paid</span><span className="font-medium text-primary">{formatMobi(50000)}</span></div>
              </div>
              <p className="text-[11px] text-center text-muted-foreground">You will be notified once your application has been reviewed.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const inputCls = "h-9 text-sm";

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
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Individual Merchant Application</h1>
            <p className="text-[11px] text-muted-foreground">Apply as an individual Mobi-Merchant</p>
          </div>
        </div>

        {/* Eligibility & Requirements */}
        <Collapsible open={requirementsOpen} onOpenChange={setRequirementsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-3 cursor-pointer">
                <p className="text-xs font-semibold flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" /> Eligibility & Requirements
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

        {/* ─── PERSONAL DATA ─── */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <SectionHeader icon={User} title="Personal Data" />

            <div className="grid grid-cols-1 gap-3">
              <FormField label="First Name" required>
                <Input className={inputCls} placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
              </FormField>
              <FormField label="Middle Name">
                <Input className={inputCls} placeholder="Middle name" value={middleName} onChange={e => setMiddleName(e.target.value)} />
              </FormField>
              <FormField label="Last Name (Surname)" required>
                <Input className={inputCls} placeholder="Surname" value={lastName} onChange={e => setLastName(e.target.value)} />
              </FormField>
            </div>

            <FormField label="Gender" required>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  {genderOptions.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Date of Birth" required>
              <div className="grid grid-cols-3 gap-2">
                <Input className={inputCls} placeholder="DD" maxLength={2} value={dobDay} onChange={e => setDobDay(e.target.value.replace(/\D/g, ""))} />
                <Input className={inputCls} placeholder="MM" maxLength={2} value={dobMonth} onChange={e => setDobMonth(e.target.value.replace(/\D/g, ""))} />
                <Input className={inputCls} placeholder="YYYY" maxLength={4} value={dobYear} onChange={e => setDobYear(e.target.value.replace(/\D/g, ""))} />
              </div>
            </FormField>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Place of Birth</Label>
              <div className="grid grid-cols-1 gap-2">
                <Input className={inputCls} placeholder="Town / City" value={birthTown} onChange={e => setBirthTown(e.target.value)} />
                <Input className={inputCls} placeholder="Local Govt / District / County" value={birthLGA} onChange={e => setBirthLGA(e.target.value)} />
                <Input className={inputCls} placeholder="State / Province" value={birthState} onChange={e => setBirthState(e.target.value)} />
              </div>
            </div>

            <FormField label="Marital Status" required>
              <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  {maritalStatusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Profession / Occupation" required>
              <Input className={inputCls} placeholder="e.g. Software Engineer" value={profession} onChange={e => setProfession(e.target.value)} />
            </FormField>
          </CardContent>
        </Card>

        {/* ─── CONTACT DETAILS ─── */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <SectionHeader icon={MapPin} title="Contact Details" />

            <FormField label="Permanent Home-Town Address" required>
              <Input className={inputCls} placeholder="Full home-town address" value={hometownAddress} onChange={e => setHometownAddress(e.target.value)} />
            </FormField>
            <FormField label="Nearest Town/City to Home-Town">
              <Input className={inputCls} placeholder="Nearest town or city" value={nearestTown} onChange={e => setNearestTown(e.target.value)} />
            </FormField>
            <FormField label="Local Govt / District of Origin">
              <Input className={inputCls} placeholder="LGA / District of origin" value={lgaOfOrigin} onChange={e => setLgaOfOrigin(e.target.value)} />
            </FormField>
            <FormField label="State / Province of Origin">
              <Input className={inputCls} placeholder="State / Province" value={stateOfOrigin} onChange={e => setStateOfOrigin(e.target.value)} />
            </FormField>
            <FormField label="Nationality" required>
              <Input className={inputCls} placeholder="e.g. Nigerian" value={nationality} onChange={e => setNationality(e.target.value)} />
            </FormField>

            <div className="border-t border-border pt-3 mt-2">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Current Residence</p>
            </div>

            <FormField label="Current Address (Descriptive)" required>
              <Input className={inputCls} placeholder="Full current address" value={currentAddress} onChange={e => setCurrentAddress(e.target.value)} />
            </FormField>
            <FormField label="Town / City of Residence">
              <Input className={inputCls} placeholder="Town / City" value={townOfResidence} onChange={e => setTownOfResidence(e.target.value)} />
            </FormField>
            <FormField label="Local Govt / District / County of Residence">
              <Input className={inputCls} placeholder="LGA / District / County" value={lgaOfResidence} onChange={e => setLgaOfResidence(e.target.value)} />
            </FormField>
            <FormField label="State / Province of Residence">
              <Input className={inputCls} placeholder="State / Province" value={stateOfResidence} onChange={e => setStateOfResidence(e.target.value)} />
            </FormField>
            <FormField label="Country of Residence" required>
              <Input className={inputCls} placeholder="Country" value={countryOfResidence} onChange={e => setCountryOfResidence(e.target.value)} />
            </FormField>

            <div className="border-t border-border pt-3 mt-2">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Phone & Email</p>
            </div>

            <FormField label="Telephone Number 1" required>
              <Input className={inputCls} placeholder="+234 xxx xxx xxxx" value={phone1} onChange={e => setPhone1(e.target.value)} />
            </FormField>
            <FormField label="Telephone Number 2">
              <Input className={inputCls} placeholder="+234 xxx xxx xxxx" value={phone2} onChange={e => setPhone2(e.target.value)} />
            </FormField>
            <FormField label="Email Address" required>
              <Input className={inputCls} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </FormField>
          </CardContent>
        </Card>

        {/* ─── BANKING INFORMATION ─── */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <SectionHeader icon={Landmark} title="Banking Information" />
            {bankEntries.map((bank, i) => (
              <div key={i} className="space-y-2 p-3 rounded-lg border border-border/60 bg-muted/20 relative">
                {bankEntries.length > 1 && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 absolute top-2 right-2" onClick={() => removeBankEntry(i)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                )}
                <p className="text-[10px] font-semibold text-muted-foreground">Bank {i + 1}</p>
                <Input className={inputCls} placeholder="Bank Name" value={bank.bankName} onChange={e => updateBank(i, "bankName", e.target.value)} />
                <Input className={inputCls} placeholder="Account Name" value={bank.accountName} onChange={e => updateBank(i, "accountName", e.target.value)} />
                <Input className={inputCls} placeholder="Account Number" value={bank.accountNumber} onChange={e => updateBank(i, "accountNumber", e.target.value)} />
              </div>
            ))}
            {bankEntries.length < 3 && (
              <Button variant="outline" size="sm" className="w-full gap-1 text-xs" onClick={addBankEntry}>
                <Plus className="h-3 w-3" /> Add Another Bank
              </Button>
            )}
          </CardContent>
        </Card>

        {/* ─── APPLICATION DATA ─── */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <SectionHeader icon={Globe} title="Application Data" />

            <FormField label="Preferred Account Currency" required>
              <Select value={preferredCurrency} onValueChange={setPreferredCurrency}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select currency" /></SelectTrigger>
                <SelectContent>
                  {currencyOptions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
          </CardContent>
        </Card>

        {/* ─── VERIFICATION INFORMATION ─── */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <SectionHeader icon={BadgeCheck} title="Verification / Identification" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Provide at least one valid identification document for verification purposes.
            </p>

            {verifications.map((v, i) => (
              <div key={i} className="space-y-2 p-3 rounded-lg border border-border/60 bg-muted/20 relative">
                {verifications.length > 1 && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 absolute top-2 right-2" onClick={() => removeVerification(i)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                )}
                <p className="text-[10px] font-semibold text-muted-foreground">ID {i + 1}</p>
                <Select value={v.type} onValueChange={val => updateVerification(i, "type", val)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select ID type" /></SelectTrigger>
                  <SelectContent>
                    {verificationTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input className={inputCls} placeholder="ID Number" value={v.number} onChange={e => updateVerification(i, "number", e.target.value)} />
              </div>
            ))}
            {verifications.length < 4 && (
              <Button variant="outline" size="sm" className="w-full gap-1 text-xs" onClick={addVerification}>
                <Plus className="h-3 w-3" /> Add Another ID
              </Button>
            )}
          </CardContent>
        </Card>

        {/* ─── APPLICATION FEE ─── */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <SectionHeader icon={CreditCard} title="Application Fee" />
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
              <div>
                <p className="text-xs font-medium">Non-refundable application fee</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Charged upon submission</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{formatMobi(50000)}</p>
                <p className="text-[10px] text-muted-foreground">≈ {formatLocalAmount(50000, "NGN")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── TERMS & SUBMIT ─── */}
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
                of MOBIGATE Application usage and management policy. By submitting, you agree to the application fee of{" "}
                <span className="font-bold text-primary">{formatMobi(50000)}</span> being charged from your Mobi Wallet.
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
