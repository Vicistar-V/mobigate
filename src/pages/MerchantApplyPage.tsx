import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "@/components/Header";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody, DrawerFooter } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { formatMobi, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import {
  ArrowLeft,
  Gamepad2,
  Ticket,
  ChevronRight,
  User,
  Building2,
  Phone,
  Mail,
  FileText,
  MapPin,
  Clock,
  Wallet,
  CheckCircle,
  Loader2,
  Shield,
} from "lucide-react";

const APPLICATION_FEE = 50000;
const MOCK_WALLET_BALANCE = 125000;

export default function MerchantApplyPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isIndividual = type === "individual";
  const accountLabel = isIndividual ? "Individual" : "Corporate";

  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [referenceNumber] = useState(
    `MQA-2026-${String(Math.floor(Math.random() * 90000) + 10000)}`
  );

  const mockName = "Chukwuemeka Okafor";
  const mockPhone = "+234 803 123 4567";
  const mockEmail = "chukwuemeka.okafor@email.com";

  const canSubmit = policiesAccepted && (isIndividual || businessName.trim().length > 0);

  const handleSubmitApplication = () => {
    setShowPaymentDrawer(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentDrawer(false);
      toast({
        title: "Application Submitted!",
        description: `Your Quiz Merchant application has been submitted. Ref: ${referenceNumber}`,
      });
      setStep(4);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <div className="p-4 max-w-lg mx-auto">
        {/* Back + Title */}
        {step < 4 && (
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => (step === 1 ? navigate(-1) : setStep(step - 1))}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Apply for Merchant Account</h1>
              <p className="text-xs text-muted-foreground">
                {accountLabel} • Step {step} of 3
              </p>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {step < 4 && (
          <div className="flex gap-1.5 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}

        {/* ========== STEP 1: Merchant Type Selection ========== */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <Badge variant="outline" className="mb-2">
                {accountLabel} Account
              </Badge>
              <h2 className="text-base font-semibold">Select Merchant Type</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Choose the type of merchant account you want
              </p>
            </div>

            {/* Quiz Merchant - Active */}
            <Card
              className="cursor-pointer border-2 border-transparent hover:border-primary/50 active:scale-[0.98] transition-all"
              onClick={() => setStep(2)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Gamepad2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">Quiz Merchant</p>
                  <p className="text-xs text-muted-foreground">
                    Create and manage quiz games for your audience
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>

            {/* Voucher Merchant - Disabled */}
            <Card className="opacity-50 pointer-events-none relative">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Ticket className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-muted-foreground">Voucher Merchant</p>
                  <p className="text-xs text-muted-foreground">
                    Sell and manage vouchers on MobiGate
                  </p>
                </div>
                <Badge className="bg-muted text-muted-foreground text-[10px] shrink-0">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ========== STEP 2: Application Form ========== */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Type badges */}
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                <User className="h-3 w-3 mr-1" />
                {accountLabel}
              </Badge>
              <Badge className="bg-primary/10 text-primary text-xs border-0">
                <Gamepad2 className="h-3 w-3 mr-1" />
                Quiz Merchant
              </Badge>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                {isIndividual ? (
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                {isIndividual ? "Full Name" : "Business / Company Name"}
              </Label>
              {isIndividual ? (
                <Input value={mockName} readOnly className="bg-muted/50 text-muted-foreground" />
              ) : (
                <Input
                  placeholder="Enter business or company name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              )}
              {isIndividual && (
                <p className="text-[10px] text-muted-foreground">
                  Auto-filled from your MobiGate account
                </p>
              )}
            </div>

            {/* Corporate-only fields */}
            {!isIndividual && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    Business Registration Number
                  </Label>
                  <Input
                    placeholder="e.g. RC-1234567"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    Business Address
                  </Label>
                  <Input
                    placeholder="Enter business address"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                Phone Number
              </Label>
              <Input value={mockPhone} readOnly className="bg-muted/50 text-muted-foreground" />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email Address
              </Label>
              <Input value={mockEmail} readOnly className="bg-muted/50 text-muted-foreground" />
            </div>

            {/* Terms */}
            <Card className="bg-muted/30">
              <CardContent className="p-3 space-y-2">
                <p className="text-xs font-semibold flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  Terms & Policies
                </p>
                <div className="max-h-28 overflow-y-auto text-[10px] text-muted-foreground leading-relaxed p-2 bg-background rounded border">
                  <p className="mb-2">
                    By submitting this application, you agree to the MobiGate Merchant Terms of Service.
                    As a Quiz Merchant, you are responsible for creating fair and engaging quiz content,
                    ensuring all prizes are funded before quiz seasons launch, and complying with
                    MobiGate's content and community guidelines.
                  </p>
                  <p className="mb-2">
                    MobiGate reserves the right to suspend or revoke merchant privileges if terms are
                    violated. All merchant activities are subject to platform monitoring and review.
                    Application fees are non-refundable regardless of application outcome.
                  </p>
                  <p>
                    You acknowledge that your account information will be verified and that false
                    information may result in permanent account suspension. Merchant accounts are
                    subject to periodic review and compliance checks.
                  </p>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <Checkbox
                    id="policies"
                    checked={policiesAccepted}
                    onCheckedChange={(checked) => setPoliciesAccepted(checked === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="policies" className="text-xs leading-tight cursor-pointer">
                    I have read and agree to the MobiGate Merchant Terms & Policies
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Fee notice */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <Wallet className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  Application Fee
                </p>
                <p className="text-[10px] text-amber-700 dark:text-amber-400">
                  {formatMobi(APPLICATION_FEE)} (approximately{" "}
                  {formatLocalAmount(APPLICATION_FEE, "NGN")}) will be charged from your Mobi Wallet
                </p>
              </div>
            </div>

            {/* Submit */}
            <Button
              className="w-full h-12 font-semibold"
              disabled={!canSubmit}
              onClick={handleSubmitApplication}
            >
              Submit Application
            </Button>
          </div>
        )}

        {/* ========== STEP 4: Under Review ========== */}
        {step === 4 && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <div className="h-20 w-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
              <Clock className="h-10 w-10 text-amber-600" />
            </div>

            <h1 className="text-xl font-bold mb-2">Application Under Review</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Your Quiz Merchant application is being reviewed by the MobiGate team
            </p>

            <Card className="w-full max-w-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono font-semibold text-xs">{referenceNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Account Type</span>
                  <Badge variant="outline" className="text-xs">
                    {accountLabel}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Merchant Type</span>
                  <Badge className="bg-primary/10 text-primary text-xs border-0">Quiz</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Submitted</span>
                  <span className="text-xs font-medium">
                    {new Date().toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fee Paid</span>
                  <span className="text-xs font-semibold">{formatMobi(APPLICATION_FEE)}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Estimated review time: 3-5 business days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full max-w-sm mt-6" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        )}
      </div>

      {/* ========== Payment Confirmation Drawer ========== */}
      <Drawer open={showPaymentDrawer} onOpenChange={setShowPaymentDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Confirm Payment</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Application Fee</p>
                <p className="text-3xl font-bold">{formatMobi(APPLICATION_FEE)}</p>
                <p className="text-xs text-muted-foreground">
                  ≈ {formatLocalAmount(APPLICATION_FEE, "NGN")}
                </p>
              </div>

              <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Wallet Balance</span>
                  <span className="font-semibold">{formatMobi(MOCK_WALLET_BALANCE)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="font-semibold text-red-500">
                    -{formatMobi(APPLICATION_FEE)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-bold">
                    {formatMobi(MOCK_WALLET_BALANCE - APPLICATION_FEE)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Sufficient balance available
                </p>
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button
              className="w-full h-12 font-semibold"
              onClick={handleConfirmPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Confirm and Pay ${formatMobi(APPLICATION_FEE)}`
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowPaymentDrawer(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
