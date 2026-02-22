import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Store, ChevronDown, Clock, FileText, Shield, CheckCircle, Users, BookOpen, UserPlus, ArrowLeft, CreditCard } from "lucide-react";
import { formatMobi, formatLocalAmount, generateTransactionReference } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";

const MOCK_USER = {
  name: "Adewale Johnson",
  phone: "+234 812 345 6789",
  email: "adewale.johnson@email.com",
};

const requirements = [
  { icon: Shield, text: "Must be a verified user for minimum 180 days" },
  { icon: CreditCard, text: `One-time, non-refundable Registration Fee: ${formatMobi(1000000)} (≈ ${formatLocalAmount(1000000, "NGN")})` },
  { icon: CreditCard, text: `Initial Merchant Vouchers Subscription Deposit (IMVSD): min ${formatMobi(1000000)} (≈ ${formatLocalAmount(1000000, "NGN")})` },
  { icon: FileText, text: "IMVSD must equal or exceed total value of initial Mandatory Voucher Packs (100-unit pack × 12 denominations)" },
  { icon: Users, text: "Must have invited at least 1,000 active friends to Mobigate" },
  { icon: Users, text: "Must have at least 5,000 friends and 5,000 followers" },
  { icon: BookOpen, text: "Must have at least 100 e-Library contents with 5,000+ likes each" },
  { icon: UserPlus, text: "Must have followed at least 500 users/content creators" },
  { icon: Store, text: "Only Mobi-Merchants can transact directly with Mobigate central system" },
  { icon: CreditCard, text: "Purchased Vouchers can be credited to wallet, sent as e-PIN, or gifted to another user" },
];

export default function MerchantApplication() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isIndividual = type === "individual";
  const isCorporate = type === "corporate";

  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleSubmit = () => {
    if (!acceptedPolicies) {
      toast({ title: "Please accept the policies", description: "You must agree to the terms before submitting.", variant: "destructive" });
      return;
    }
    if (isCorporate && !businessName.trim()) {
      toast({ title: "Business name required", description: "Please enter your business/corporate name.", variant: "destructive" });
      return;
    }
    const ref = generateTransactionReference("MERCH");
    setRefNumber(ref);
    setSubmitted(true);
    toast({ title: "Application Submitted!", description: `${formatMobi(50000)} application fee charged. Reference: ${ref}` });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <div className="p-4 max-w-lg mx-auto space-y-4">
        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">
              {isIndividual ? "Individual" : "Corporate"} Merchant Application
            </h1>
            <p className="text-xs text-muted-foreground">
              Apply to become a {isIndividual ? "individual" : "corporate"} Mobi-Merchant
            </p>
          </div>
        </div>

        {/* Requirements Collapsible */}
        <Collapsible open={requirementsOpen} onOpenChange={setRequirementsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-2 cursor-pointer">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Merchant Requirements
                  </CardTitle>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${requirementsOpen ? "rotate-180" : ""}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <req.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{req.text}</p>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {!submitted ? (
          /* Application Form */
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              {isIndividual ? (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Full Name</Label>
                  <Input value={MOCK_USER.name} disabled className="bg-muted/50 text-sm" />
                  <p className="text-[10px] text-muted-foreground">Name captured from your Mobigate account</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Business / Corporate Name</Label>
                  <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter business name"
                    className="text-sm"
                  />
                </div>
              )}

              {/* Phone */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Phone Number</Label>
                <Input value={MOCK_USER.phone} disabled className="bg-muted/50 text-sm" />
                <p className="text-[10px] text-muted-foreground">Auto-filled from your account</p>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Email Address</Label>
                <Input value={MOCK_USER.email} disabled className="bg-muted/50 text-sm" />
                <p className="text-[10px] text-muted-foreground">Auto-filled from your account</p>
              </div>

              {/* Corporate-only fields */}
              {isCorporate && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Business Registration Number</Label>
                    <Input
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      placeholder="e.g. RC-123456"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Business Address</Label>
                    <Textarea
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      placeholder="Enter full business address"
                      className="text-sm min-h-[80px]"
                    />
                  </div>
                </>
              )}

              {/* Accept policies */}
              <div className="flex items-start gap-2.5 p-3 bg-muted/30 rounded-lg border">
                <Checkbox
                  id="accept-policies"
                  checked={acceptedPolicies}
                  onCheckedChange={(checked) => setAcceptedPolicies(checked === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="accept-policies" className="text-xs leading-relaxed cursor-pointer">
                  I accept the Mobigate Merchant Terms & Policies. I understand that a non-refundable application fee of{" "}
                  <span className="font-bold text-primary">{formatMobi(50000)}</span>{" "}
                  <span className="text-muted-foreground">(≈ {formatLocalAmount(50000, "NGN")})</span>{" "}
                  will be charged upon submission.
                </Label>
              </div>

              {/* Submit */}
              <Button onClick={handleSubmit} className="w-full gap-2" size="lg" disabled={!acceptedPolicies}>
                <Store className="h-4 w-4" />
                Submit Application — {formatMobi(50000)}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Under Review Card */
          <Card className="border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/10">
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Clock className="h-7 w-7 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-bold text-base">Application Under Review</h2>
                  <p className="text-xs text-muted-foreground mt-1">Your merchant application is being reviewed by our team</p>
                </div>
                <Badge variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-400 text-xs">
                  Estimated: 3–5 business days
                </Badge>
              </div>

              <div className="bg-background rounded-lg p-3 space-y-2 border">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono font-bold">{refNumber}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant="secondary" className="text-[10px] h-5">
                    {isIndividual ? "Individual" : "Corporate"}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Applicant</span>
                  <span className="font-medium">{isIndividual ? MOCK_USER.name : businessName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Fee Paid</span>
                  <span className="font-medium text-primary">{formatMobi(50000)}</span>
                </div>
                {isCorporate && regNumber && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Reg. Number</span>
                    <span className="font-medium">{regNumber}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}