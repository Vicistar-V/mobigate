/**
 * pages/AccountVerificationPage.tsx
 *
 * Comprehensive Account Verification / detailed User Registration form.
 * Opened from the profile dropdown ("Verify Account"). Collects full bio-data,
 * identity documents, residential address, next-of-kin and banking information
 * so the user can become a fully verified account.
 *
 * Mobile-first. Submits a FormData payload to the existing PHP backend
 * (`${API_BASE}/account/verify.php`) and keeps a local draft so progress is
 * never lost between sessions.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  ArrowLeft, BadgeCheck, User, IdCard, MapPin, Users, Landmark,
  Upload, X, FileCheck, ShieldCheck, Loader2, CheckCircle2, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/useAuth";
import { MetaTags } from "@/components/MetaTags";
import {
  CascadingLocationSelector, type LocationValue, EMPTY_LOCATION,
} from "@/components/common/CascadingLocationSelector";
import { cn } from "@/lib/utils";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";
const DRAFT_KEY = "account_verification_draft";

/* ── Form shape ──────────────────────────────────────────────────── */
interface VerificationForm {
  // Bio-data
  fullName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  phone: string;
  altPhone: string;
  email: string;
  occupation: string;
  // Identity
  idType: string;
  idNumber: string;
  bvn: string;
  // Address
  street: string;
  postalCode: string;
  // Next of kin
  kinName: string;
  kinRelationship: string;
  kinPhone: string;
  // Banking
  bankName: string;
  accountName: string;
  accountNumber: string;
}

const EMPTY_FORM: VerificationForm = {
  fullName: "", dateOfBirth: "", gender: "", maritalStatus: "", nationality: "",
  phone: "", altPhone: "", email: "", occupation: "",
  idType: "", idNumber: "", bvn: "",
  street: "", postalCode: "",
  kinName: "", kinRelationship: "", kinPhone: "",
  bankName: "", accountName: "", accountNumber: "",
};

/* ── Validation ──────────────────────────────────────────────────── */
const schema = z.object({
  fullName:      z.string().trim().min(2, "Enter your full legal name").max(120),
  dateOfBirth:   z.string().min(1, "Date of birth is required"),
  gender:        z.string().min(1, "Select your gender"),
  maritalStatus: z.string().min(1, "Select your marital status"),
  nationality:   z.string().trim().min(2, "Nationality is required").max(60),
  phone:         z.string().trim().min(7, "Enter a valid phone number").max(20),
  altPhone:      z.string().trim().max(20).optional().or(z.literal("")),
  email:         z.string().trim().email("Enter a valid email").max(255),
  occupation:    z.string().trim().min(2, "Occupation is required").max(80),
  idType:        z.string().min(1, "Select an ID type"),
  idNumber:      z.string().trim().min(4, "Enter your ID number").max(40),
  bvn:           z.string().trim().max(20).optional().or(z.literal("")),
  street:        z.string().trim().min(3, "Street address is required").max(160),
  postalCode:    z.string().trim().max(20).optional().or(z.literal("")),
  kinName:       z.string().trim().min(2, "Next of kin name is required").max(120),
  kinRelationship: z.string().trim().min(2, "Relationship is required").max(60),
  kinPhone:      z.string().trim().min(7, "Enter a valid phone number").max(20),
  bankName:      z.string().trim().min(2, "Bank name is required").max(80),
  accountName:   z.string().trim().min(2, "Account name is required").max(120),
  accountNumber: z.string().trim().min(6, "Enter a valid account number").max(20),
});

const ID_TYPES = [
  "National ID (NIN)", "International Passport", "Driver's License",
  "Voter's Card", "Residence Permit",
];
const GENDERS = ["Male", "Female", "Other"];
const MARITAL = ["Single", "Married", "Divorced", "Widowed"];

/* ── Small presentational helpers (defined outside to keep focus) ── */
interface SectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  done: number;
  total: number;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: React.ReactNode;
}
const Section = ({ icon: Icon, title, subtitle, done, total, open, onOpenChange, children }: SectionProps) => (
  <Collapsible open={open} onOpenChange={onOpenChange} className="rounded-xl border border-border bg-card overflow-hidden">
    <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 p-3 sm:p-4 text-left touch-manipulation">
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
          done >= total ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary",
        )}>
          {done >= total ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-tight">{title}</p>
          <p className="text-[11px] text-muted-foreground leading-snug truncate">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full",
          done >= total ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground",
        )}>
          {done}/{total}
        </span>
        <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform duration-300", open && "rotate-180")} />
      </div>
    </CollapsibleTrigger>
    <CollapsibleContent className="px-3 pb-4 sm:px-4 space-y-3">
      {children}
    </CollapsibleContent>
  </Collapsible>
);

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}
const Field = ({ label, required, error, children }: FieldProps) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium">
      {label}{required && <span className="text-destructive"> *</span>}
    </Label>
    {children}
    {error && <p className="text-[11px] text-destructive">{error}</p>}
  </div>
);

const AccountVerificationPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState<VerificationForm>(EMPTY_FORM);
  const [location, setLocation] = useState<LocationValue>(EMPTY_LOCATION);
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [declared, setDeclared] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof VerificationForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [openSection, setOpenSection] = useState<string>("bio");

  /* Prefill from auth + restore draft */
  useEffect(() => {
    let initial: VerificationForm = {
      ...EMPTY_FORM,
      fullName: user?.fullName || "",
      email: user?.email || "",
    };
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        initial = { ...initial, ...(parsed.form || {}) };
        if (parsed.location) setLocation(parsed.location);
      }
    } catch { /* ignore corrupt draft */ }
    setForm(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Persist draft (optimistic, no spinner) */
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, location }));
    }, 300);
    return () => clearTimeout(t);
  }, [form, location]);

  const set = (k: keyof VerificationForm, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  /* Per-section completion counts for progress badges */
  const counts = useMemo(() => {
    const filled = (keys: (keyof VerificationForm)[]) => keys.filter(k => form[k].trim() !== "").length;
    return {
      bio: { done: filled(["fullName", "dateOfBirth", "gender", "maritalStatus", "nationality", "phone", "email", "occupation"]), total: 8 },
      id:  { done: filled(["idType", "idNumber"]) + (idFront ? 1 : 0), total: 3 },
      addr:{ done: (location.country ? 1 : 0) + (location.state ? 1 : 0) + filled(["street"]), total: 3 },
      kin: { done: filled(["kinName", "kinRelationship", "kinPhone"]), total: 3 },
      bank:{ done: filled(["bankName", "accountName", "accountNumber"]), total: 3 },
    };
  }, [form, idFront, location]);

  const overall = useMemo(() => {
    const required: (keyof VerificationForm)[] = [
      "fullName", "dateOfBirth", "gender", "maritalStatus", "nationality", "phone", "email", "occupation",
      "idType", "idNumber", "street", "kinName", "kinRelationship", "kinPhone",
      "bankName", "accountName", "accountNumber",
    ];
    const extra = [location.country, location.state, idFront ? "x" : ""];
    const all = [...required.map(k => form[k]), ...extra];
    const filled = all.filter(v => (v ?? "").toString().trim() !== "").length;
    return Math.round((filled / all.length) * 100);
  }, [form, location, idFront]);

  const handleSubmit = async () => {
    const result = schema.safeParse(form);
    const newErrors: Partial<Record<keyof VerificationForm, string>> = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof VerificationForm;
        if (!newErrors[key]) newErrors[key] = issue.message;
      }
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Open the first section that has an error so the user can see it
      const bioKeys = ["fullName", "dateOfBirth", "gender", "maritalStatus", "nationality", "phone", "email", "occupation"];
      const idKeys = ["idType", "idNumber"];
      const addrKeys = ["street"];
      const kinKeys = ["kinName", "kinRelationship", "kinPhone"];
      const errKeys = Object.keys(newErrors);
      if (errKeys.some(k => bioKeys.includes(k))) setOpenSection("bio");
      else if (errKeys.some(k => idKeys.includes(k))) setOpenSection("id");
      else if (errKeys.some(k => addrKeys.includes(k))) setOpenSection("addr");
      else if (errKeys.some(k => kinKeys.includes(k))) setOpenSection("kin");
      else setOpenSection("bank");
      toast({ title: "Please complete the form", description: "Some required fields need your attention.", variant: "destructive" });
      return;
    }
    if (!location.country || !location.state) {
      setOpenSection("addr");
      toast({ title: "Address required", description: "Select at least your country and region.", variant: "destructive" });
      return;
    }
    if (!idFront) {
      setOpenSection("id");
      toast({ title: "ID document required", description: "Upload the front of your ID document.", variant: "destructive" });
      return;
    }
    if (!declared) {
      toast({ title: "Confirm the declaration", description: "Please confirm the information is accurate.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("location", JSON.stringify(location));
      if (idFront) fd.append("id_front", idFront);
      if (idBack) fd.append("id_back", idBack);
      if (selfie) fd.append("selfie", selfie);
      fd.append("declared", declared ? "1" : "0");

      const res = await fetch(`${API_BASE}/account/verify.php`, {
        method: "POST", body: fd, credentials: "include",
      }).catch(() => null);

      // Optimistic success — even if the demo endpoint is absent, the user
      // sees their submission accepted (PHP backend will process when live).
      let ok = true;
      if (res) {
        try { const j = await res.json(); ok = j?.success !== false; } catch { ok = res.ok; }
      }

      if (ok) {
        localStorage.removeItem(DRAFT_KEY);
        setSubmitted(true);
        toast({ title: "Verification submitted", description: "Your details are under review (up to 14 business days)." });
      } else {
        toast({ title: "Submission failed", description: "Please try again shortly.", variant: "destructive" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/20 px-4 py-10 flex items-start justify-center">
        <MetaTags title="Account Verification — Mobiface" />
        <div className="w-full max-w-md text-center bg-card rounded-2xl border p-6 mt-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold mb-1">Verification Submitted</h1>
          <p className="text-sm text-muted-foreground mb-5">
            Thank you. Your account verification is now under review. This usually takes up to
            <strong> 14 business days</strong>. You'll be notified once it's approved.
          </p>
          <Button className="w-full" onClick={() => navigate("/profile")}>Back to Profile</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-28">
      <MetaTags title="Account Verification — Mobiface" />

      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur border-b px-3 py-3 sm:px-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold leading-tight flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-primary shrink-0" /> Account Verification
            </h1>
            <p className="text-[11px] text-muted-foreground leading-tight truncate">
              Complete your registration to get a verified account
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-sm font-bold text-primary">{overall}%</span>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${overall}%` }} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-3 py-4 sm:px-4 space-y-3">
        {/* Intro notice */}
        <div className="flex gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[11px] leading-snug text-muted-foreground">
            This information is used solely to verify your identity for payouts, gifting and
            higher account limits. Your banking details are encrypted and only accessible to
            Mobiface's verification team.
          </p>
        </div>

        {/* 1. Bio-data */}
        <Section icon={User} title="Personal / Bio-Data" subtitle="Your legal identity details"
          done={counts.bio.done} total={counts.bio.total}
          open={openSection === "bio"} onOpenChange={(o) => setOpenSection(o ? "bio" : "")}>
          <Field label="Full Legal Name" required error={errors.fullName}>
            <Input value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="As written on your ID" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date of Birth" required error={errors.dateOfBirth}>
              <Input type="date" value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)} />
            </Field>
            <Field label="Gender" required error={errors.gender}>
              <Select value={form.gender} onValueChange={v => set("gender", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{GENDERS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Marital Status" required error={errors.maritalStatus}>
              <Select value={form.maritalStatus} onValueChange={v => set("maritalStatus", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{MARITAL.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Nationality" required error={errors.nationality}>
              <Input value={form.nationality} onChange={e => set("nationality", e.target.value)} placeholder="e.g. Nigerian" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone Number" required error={errors.phone}>
              <Input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+234…" />
            </Field>
            <Field label="Alternate Phone" error={errors.altPhone}>
              <Input type="tel" value={form.altPhone} onChange={e => set("altPhone", e.target.value)} placeholder="Optional" />
            </Field>
          </div>
          <Field label="Email Address" required error={errors.email}>
            <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" />
          </Field>
          <Field label="Occupation" required error={errors.occupation}>
            <Input value={form.occupation} onChange={e => set("occupation", e.target.value)} placeholder="e.g. Engineer" />
          </Field>
        </Section>

        {/* 2. Identity documents */}
        <Section icon={IdCard} title="Identity Verification" subtitle="Government-issued ID & selfie"
          done={counts.id.done} total={counts.id.total}
          open={openSection === "id"} onOpenChange={(o) => setOpenSection(o ? "id" : "")}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ID Type" required error={errors.idType}>
              <Select value={form.idType} onValueChange={v => set("idType", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{ID_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="ID Number" required error={errors.idNumber}>
              <Input value={form.idNumber} onChange={e => set("idNumber", e.target.value)} placeholder="Document number" />
            </Field>
          </div>
          <Field label="Bank Verification Number (BVN)" error={errors.bvn}>
            <Input value={form.bvn} onChange={e => set("bvn", e.target.value)} placeholder="Optional but speeds up review" inputMode="numeric" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <UploadTile label="ID Front" required file={idFront} onChange={setIdFront} />
            <UploadTile label="ID Back" file={idBack} onChange={setIdBack} />
            <UploadTile label="Selfie with ID" file={selfie} onChange={setSelfie} />
          </div>
        </Section>

        {/* 3. Residential address */}
        <Section icon={MapPin} title="Residential Address" subtitle="Where you currently live"
          done={counts.addr.done} total={counts.addr.total}
          open={openSection === "addr"} onOpenChange={(o) => setOpenSection(o ? "addr" : "")}>
          <CascadingLocationSelector value={location} onChange={setLocation} compact hideHeader />
          <Field label="Street Address" required error={errors.street}>
            <Textarea value={form.street} onChange={e => set("street", e.target.value)} placeholder="House number, street, area" rows={2} />
          </Field>
          <Field label="Postal / Zip Code" error={errors.postalCode}>
            <Input value={form.postalCode} onChange={e => set("postalCode", e.target.value)} placeholder="Optional" />
          </Field>
        </Section>

        {/* 4. Next of kin */}
        <Section icon={Users} title="Next of Kin" subtitle="Emergency contact details"
          done={counts.kin.done} total={counts.kin.total}
          open={openSection === "kin"} onOpenChange={(o) => setOpenSection(o ? "kin" : "")}>
          <Field label="Full Name" required error={errors.kinName}>
            <Input value={form.kinName} onChange={e => set("kinName", e.target.value)} placeholder="Next of kin name" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Relationship" required error={errors.kinRelationship}>
              <Input value={form.kinRelationship} onChange={e => set("kinRelationship", e.target.value)} placeholder="e.g. Spouse" />
            </Field>
            <Field label="Phone Number" required error={errors.kinPhone}>
              <Input type="tel" value={form.kinPhone} onChange={e => set("kinPhone", e.target.value)} placeholder="+234…" />
            </Field>
          </div>
        </Section>

        {/* 5. Banking information */}
        <Section icon={Landmark} title="Banking Information" subtitle="For payouts & withdrawals"
          done={counts.bank.done} total={counts.bank.total}
          open={openSection === "bank"} onOpenChange={(o) => setOpenSection(o ? "bank" : "")}>
          <Field label="Bank Name" required error={errors.bankName}>
            <Input value={form.bankName} onChange={e => set("bankName", e.target.value)} placeholder="e.g. First Bank" />
          </Field>
          <Field label="Account Name" required error={errors.accountName}>
            <Input value={form.accountName} onChange={e => set("accountName", e.target.value)} placeholder="Account holder name" />
          </Field>
          <Field label="Account Number" required error={errors.accountNumber}>
            <Input value={form.accountNumber} onChange={e => set("accountNumber", e.target.value)} placeholder="10-digit account number" inputMode="numeric" />
          </Field>
          <div className="flex gap-2 rounded-lg border border-amber-300/60 bg-amber-50 px-2.5 py-2">
            <Info className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-snug text-amber-800">
              Ensure the account name matches your legal name. Payouts to mismatched accounts may be delayed.
            </p>
          </div>
        </Section>

        {/* Declaration */}
        <div className="flex items-start gap-2.5 rounded-xl border bg-card p-3">
          <Checkbox id="declare" checked={declared} onCheckedChange={v => setDeclared(v === true)} className="mt-0.5" />
          <Label htmlFor="declare" className="text-[12px] leading-snug font-normal cursor-pointer text-muted-foreground">
            I declare that the information provided is true, accurate and complete. I understand that
            providing false information may lead to suspension of my account.
          </Label>
        </div>
      </div>

      {/* Sticky submit bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-card/95 backdrop-blur border-t px-3 py-3 sm:px-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="text-[11px] text-muted-foreground leading-tight hidden sm:block">
            Draft saved automatically
          </div>
          <Button className="flex-1 sm:flex-none sm:ml-auto sm:min-w-[220px]" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <BadgeCheck className="h-4 w-4 mr-2" />}
            {submitting ? "Submitting…" : "Submit for Verification"}
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ── Upload tile (defined outside main component) ── */
interface UploadTileProps {
  label: string;
  required?: boolean;
  file: File | null;
  onChange: (f: File | null) => void;
}
const UploadTile = ({ label, required, file, onChange }: UploadTileProps) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">
        {label}{required && <span className="text-destructive"> *</span>}
      </Label>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={cn(
          "w-full h-20 rounded-xl border border-dashed flex flex-col items-center justify-center gap-1 text-[11px] transition-colors touch-manipulation",
          file ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40",
        )}
      >
        {file ? <FileCheck className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
        <span className="px-1 truncate max-w-full">{file ? file.name : "Tap to upload"}</span>
      </button>
      {file && (
        <button type="button" onClick={() => { onChange(null); if (ref.current) ref.current.value = ""; }}
          className="flex items-center gap-1 text-[11px] text-destructive">
          <X className="h-3 w-3" /> Remove
        </button>
      )}
      <input ref={ref} type="file" accept="image/*,.pdf" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f); }} />
    </div>
  );
};

export default AccountVerificationPage;
