import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Store, ChevronDown, Clock, Shield, ArrowLeft, CreditCard,
  FileText, Users, BookOpen, UserPlus, User, Mail, Phone
} from "lucide-react";
import { formatMobi, formatLocalAmount, generateTransactionReference } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";

const MOCK_USER = {
  name: "Adewale Johnson",
  email: "adewale.johnson@email.com",
  phone: "+234 812 345 6789",
  username: "adewale_j",
  verifiedDays: 245,
};

const requirements = [
  { icon: Shield, text: "Must be a verified user for minimum 180 days" },
  { icon: CreditCard, text: `One-time, non-refundable Registration Fee: ${formatMobi(1000000)}` },
  { icon: CreditCard, text: `Initial Merchant Vouchers Subscription Deposit (IMVSD): min ${formatMobi(1000000)}` },
  { icon: FileText, text: "IMVSD must equal or exceed total value of initial Mandatory Voucher Packs (100-unit pack × 12 denominations)" },
  { icon: Users, text: "Must have invited at least 1,000 active friends to Mobigate" },
  { icon: Users, text: "Must have at least 5,000 friends and 5,000 followers" },
  { icon: BookOpen, text: "Must have at least 100 e-Library contents with 5,000+ likes each" },
  { icon: UserPlus, text: "Must have followed at least 500 users/content creators" },
  { icon: Store, text: "Only Mobi-Merchants can transact directly with Mobigate central system" },
  { icon: CreditCard, text: "Purchased Vouchers can be credited to wallet, sent as e-PIN, or gifted" },
];

export default function IndividualMerchantApplication() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleSubmit = () => {
    if (!acceptedPolicies) {
      toast({ title: "Accept Terms", description: "You must agree to the terms before submitting.", variant: "destructive" });
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono font-bold">{refNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant="secondary" className="text-[10px] h-5">Individual</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{MOCK_USER.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{MOCK_USER.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee Paid</span>
                  <span className="font-medium text-primary">{formatMobi(50000)}</span>
                </div>
              </div>

              <p className="text-[11px] text-center text-muted-foreground">
                You will be notified once your application has been reviewed. This screen will update with your approval status.
              </p>
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
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Individual Merchant Application</h1>
            <p className="text-[11px] text-muted-foreground">Apply as an individual Mobi-Merchant</p>
          </div>
        </div>

        {/* Requirements */}
        <Collapsible open={requirementsOpen} onOpenChange={setRequirementsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-3 cursor-pointer">
                <p className="text-xs font-semibold flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" /> Merchant Requirements
                </p>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${requirementsOpen ? "rotate-180" : ""}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 pb-3 space-y-2.5">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <req.icon className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{req.text}</p>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Your Account Details (auto-filled, read-only) */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="border-b border-border pb-1 mb-3">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Your Account Details</p>
            </div>
            <p className="text-[10px] text-muted-foreground">
              The following details are captured from your Mobigate account and cannot be edited.
            </p>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Full Name</Label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/40 border border-border/50">
                <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium">{MOCK_USER.name}</span>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Email Address</Label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/40 border border-border/50">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm">{MOCK_USER.email}</span>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Phone Number</Label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/40 border border-border/50">
                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm">{MOCK_USER.phone}</span>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Username</Label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/40 border border-border/50">
                <span className="text-sm text-muted-foreground">@</span>
                <span className="text-sm">{MOCK_USER.username}</span>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Account Verified</Label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
                <Shield className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{MOCK_USER.verifiedDays} days</span>
                <Badge variant="outline" className="text-[9px] h-4 border-emerald-300 text-emerald-600 ml-auto">Eligible</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Fee Info */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="border-b border-border pb-1 mb-3">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Application Fee</p>
            </div>

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

        {/* Terms & Submit */}
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
