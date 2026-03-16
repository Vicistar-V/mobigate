import { useState } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { ArrowLeft, Store, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Wallet, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { merchantCountries } from "@/data/mobiMerchantsData";
import { mockMerchants } from "@/data/mobigateInteractiveQuizData";
import { allLocationMerchants } from "@/data/nigerianLocationsData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";

const APPLICATION_FEE = 5000;

export default function SubMerchantApplicationPage() {
  const { merchantId } = useParams<{ merchantId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const reapplyData = (location.state as any)?.previousData;
  const prefillData = (location.state as any)?.prefill;

  const quizMerchant = mockMerchants.find(m => m.id === merchantId);
  const locationMerchant = allLocationMerchants.find(m => m.id === merchantId);
  const allMerchants = merchantCountries.flatMap(c => c.merchants);
  const mobiMerchant = allMerchants.find(m => m.id === merchantId);

  const fallbackName = reapplyData?.merchantName || prefillData?.merchantName || searchParams.get("name") || "Merchant";
  const fallbackCategory = reapplyData?.merchantCategory || prefillData?.merchantCategory || searchParams.get("category") || "General";

  const merchant = quizMerchant
    ? { id: quizMerchant.id, name: quizMerchant.name, category: quizMerchant.category }
    : locationMerchant
      ? { id: locationMerchant.id, name: locationMerchant.name, category: locationMerchant.category }
      : mobiMerchant
        ? { id: mobiMerchant.id, name: mobiMerchant.name, category: "General" }
        : { id: merchantId || "unknown", name: fallbackName, category: fallbackCategory };

  const [form, setForm] = useState({
    fullName: reapplyData?.fullName || "",
    businessName: reapplyData?.businessName || "",
    phone: reapplyData?.phone || "",
    email: reapplyData?.email || "",
    city: reapplyData?.city || "",
    state: reapplyData?.state || "",
    businessTypes: (reapplyData?.businessTypes as string[]) || ([] as string[]),
    description: reapplyData?.description || "",
    yearsInBusiness: reapplyData?.yearsInBusiness || "",
    retailShopAddress: reapplyData?.retailShopAddress || "",
    onlineStoreUrl: reapplyData?.onlineStoreUrl || "",
    mobiShopUrl: reapplyData?.mobiShopUrl || "",
    hasPreviousApplication: reapplyData ? "yes" : "no" as "no" | "yes",
    previousApplicationDetails: reapplyData?.previousApplicationDetails || "",
    agreeTerms: false,
  });

  const [showConfirmDrawer, setShowConfirmDrawer] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [txnRef, setTxnRef] = useState("");

  const updateField = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isValid = form.fullName.trim() && form.businessName.trim() && form.phone.trim() &&
    form.city.trim() && form.state.trim() && form.businessTypes.length > 0 && form.agreeTerms &&
    (!form.businessTypes.includes("retail_shop") || form.retailShopAddress.trim()) &&
    (!form.businessTypes.includes("online_store") || form.onlineStoreUrl.trim()) &&
    (!form.businessTypes.includes("mobi_shop") || form.mobiShopUrl.trim());

  const toggleBusinessType = (type: string) => {
    setForm(prev => ({
      ...prev,
      businessTypes: prev.businessTypes.includes(type)
        ? prev.businessTypes.filter(t => t !== type)
        : [...prev.businessTypes, type],
    }));
  };

  const handleConfirmPayment = () => {
    setProcessing(true);
    setProcessingStep(0);
    const ref = `SM-APP-${Date.now().toString(36).toUpperCase()}`;
    setTxnRef(ref);

    // Beast-mode multi-step processing
    setTimeout(() => setProcessingStep(1), 600);
    setTimeout(() => setProcessingStep(2), 1400);
    setTimeout(() => setProcessingStep(3), 2200);
    setTimeout(() => {
      setProcessing(false);
      setShowConfirmDrawer(false);
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: `₦${APPLICATION_FEE.toLocaleString()}.00 debited from Mobi Wallet. Ref: ${ref}`,
      });
    }, 2800);
  };

  const processingMessages = [
    "Validating application...",
    "Debiting Mobi Wallet...",
    "Processing payment...",
    "Finalizing submission...",
  ];

  if (submitted) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-5 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-base font-bold text-foreground">Application Submitted</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="h-20 w-20 rounded-full bg-emerald-500/15 flex items-center justify-center mb-5">
            <ShieldCheck className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Application Submitted!</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Your application to become a Retail Merchant under <span className="font-semibold text-foreground">{merchant.name}</span> has been submitted successfully.
          </p>

          {/* Transaction Receipt Card */}
          <div className="w-full max-w-xs rounded-xl border border-border/50 bg-card p-4 space-y-3 mb-6 text-left">
            <p className="text-xs font-bold text-foreground text-center mb-2">Payment Receipt</p>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Amount Debited</span>
              <span className="font-bold text-foreground">₦{APPLICATION_FEE.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Source</span>
              <span className="font-medium text-foreground">Mobi Wallet</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Purpose</span>
              <span className="font-medium text-foreground">Application Fee</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Reference</span>
              <span className="font-mono text-foreground break-all">{txnRef}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Status</span>
              <Badge className="bg-emerald-500/15 text-emerald-600 text-xs">Successful</Badge>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-6">
            Est. Review Time: <span className="font-semibold text-foreground">7–14 business days</span>
          </p>
          <Button onClick={() => navigate(-1)} className="w-full max-w-xs h-12 rounded-xl touch-manipulation active:scale-[0.97]">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-8 w-full overflow-x-hidden">
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-5 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0 active:scale-90 touch-manipulation">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-foreground">Apply as Retail Merchant</h1>
          <p className="text-xs text-muted-foreground truncate">Join {merchant.name}'s network</p>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-4">
        {/* Merchant Info Card */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-foreground truncate">{merchant.name}</p>
              <p className="text-xs text-muted-foreground truncate">{merchant.category}</p>
            </div>
          </div>
          {mobiMerchant && (
            <Badge className="bg-emerald-500/15 text-emerald-600 text-xs whitespace-nowrap">0%–10% Discount Rate</Badge>
          )}
          <Button
            variant="outline"
            onClick={() => navigate("/merchants?mode=apply&type=retail", { state: { returnTo: "sub-merchant-application", formData: form } })}
            className="w-full h-10 rounded-lg text-xs font-semibold border-primary/30 text-primary touch-manipulation active:scale-[0.97]"
          >
            <Store className="h-4 w-4 mr-2" />
            Choose another Merchant
          </Button>
        </div>

        {/* Application Fee Notice */}
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-foreground">Application Fee: ₦{APPLICATION_FEE.toLocaleString()}.00</p>
            <p className="text-xs text-muted-foreground">A one-time non-refundable processing fee will be debited from your Mobi Wallet upon submission.</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Applicant Full Name *</Label>
            <Input value={form.fullName} onChange={e => updateField("fullName", e.target.value)} placeholder="Your full legal name" className="h-11 rounded-xl text-sm" />
          </div>
          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Business / Store Name *</Label>
            <Input value={form.businessName} onChange={e => updateField("businessName", e.target.value)} placeholder="Name of your business or store" className="h-11 rounded-xl text-sm" />
          </div>
          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Phone Number *</Label>
            <Input value={form.phone} onChange={e => updateField("phone", e.target.value)} placeholder="+234 801 234 5678" type="tel" className="h-11 rounded-xl text-sm" />
          </div>
          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Email Address</Label>
            <Input value={form.email} onChange={e => updateField("email", e.target.value)} placeholder="youremail@example.com" type="email" className="h-11 rounded-xl text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-foreground mb-1.5 block">State *</Label>
              <Input value={form.state} onChange={e => updateField("state", e.target.value)} placeholder="e.g. Lagos" className="h-11 rounded-xl text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold text-foreground mb-1.5 block">City *</Label>
              <Input value={form.city} onChange={e => updateField("city", e.target.value)} placeholder="e.g. Ikeja" className="h-11 rounded-xl text-sm" />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Business Type * <span className="font-normal text-muted-foreground">(select as applicable)</span></Label>
            <div className="space-y-2">
              {[
                { value: "retail_shop", label: "Retail Shop" },
                { value: "mobi_kiosk", label: "Mobi Kiosk" },
                { value: "online_store", label: "Online Store" },
                { value: "mobi_shop", label: "Mobi Shop" },
                { value: "mobile_agent", label: "Mobile Agent" },
              ].map(opt => {
                const selected = form.businessTypes.includes(opt.value);
                return (
                  <div key={opt.value} className="space-y-2">
                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors touch-manipulation active:scale-[0.98] ${selected ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                      <Checkbox checked={selected} onCheckedChange={() => toggleBusinessType(opt.value)} className="h-5 w-5" />
                      <span className="text-sm font-medium text-foreground">{opt.label}</span>
                    </label>
                    {selected && opt.value === "retail_shop" && (
                      <Input value={form.retailShopAddress} onChange={e => updateField("retailShopAddress", e.target.value)} placeholder="Enter your shop address *" className="h-11 rounded-xl text-sm ml-6" />
                    )}
                    {selected && opt.value === "online_store" && (
                      <Input value={form.onlineStoreUrl} onChange={e => updateField("onlineStoreUrl", e.target.value)} placeholder="Enter website or store URL *" className="h-11 rounded-xl text-sm ml-6" />
                    )}
                    {selected && opt.value === "mobi_shop" && (
                      <Input value={form.mobiShopUrl} onChange={e => updateField("mobiShopUrl", e.target.value)} placeholder="Enter Mobi Shop web address *" className="h-11 rounded-xl text-sm ml-6" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Years in Business</Label>
            <Select value={form.yearsInBusiness} onValueChange={v => updateField("yearsInBusiness", v)}>
              <SelectTrigger className="h-11 rounded-xl text-sm"><SelectValue placeholder="How long have you been in business?" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1_to_3">1 - 3 years</SelectItem>
                <SelectItem value="4_to_7">4 - 7 years</SelectItem>
                <SelectItem value="8_to_10">8 - 10 years</SelectItem>
                <SelectItem value="10_plus">More than 10 years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Brief Description of Your Business</Label>
            <Textarea value={form.description} onChange={e => updateField("description", e.target.value)} placeholder="Describe your business, location, and what you sell..." className="min-h-[80px] rounded-xl text-sm" />
          </div>

          {/* Previous Application */}
          <div>
            <Label className="text-xs font-semibold text-foreground mb-2 block">Any Previous Application?</Label>
            <div className="flex gap-2">
              {(["no", "yes"] as const).map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { updateField("hasPreviousApplication", opt); if (opt === "no") updateField("previousApplicationDetails", ""); }}
                  className={`flex-1 h-11 rounded-xl text-sm font-semibold border-2 transition-colors touch-manipulation active:scale-[0.97] ${form.hasPreviousApplication === opt ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"}`}
                >
                  {opt === "no" ? "No" : "Yes"}
                </button>
              ))}
            </div>
            {form.hasPreviousApplication === "yes" && (
              <Textarea value={form.previousApplicationDetails} onChange={e => updateField("previousApplicationDetails", e.target.value)} placeholder="Please provide details of your previous application (e.g. merchant name, date, reference number, outcome)..." className="min-h-[80px] rounded-xl text-sm mt-2" />
            )}
          </div>

          <div className="flex items-start gap-3 pt-2">
            <Checkbox id="terms" checked={form.agreeTerms} onCheckedChange={v => updateField("agreeTerms", !!v)} className="mt-0.5" />
            <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
              I agree to the Sub‑Merchant Terms and Conditions and understand that the ₦{APPLICATION_FEE.toLocaleString()}.00 Application Fee is non‑refundable and will be debited from my Mobi Wallet.
            </label>
          </div>
        </div>

        {/* Submit — opens confirmation drawer */}
        <Button
          onClick={() => setShowConfirmDrawer(true)}
          disabled={!isValid}
          className="w-full h-12 rounded-xl text-sm font-bold touch-manipulation active:scale-[0.97] mt-4"
        >
          Review &amp; Pay — ₦{APPLICATION_FEE.toLocaleString()}.00
        </Button>
      </div>

      {/* ── Payment Confirmation Drawer ── */}
      <Drawer open={showConfirmDrawer} onOpenChange={o => { if (!processing) setShowConfirmDrawer(o); }}>
        <DrawerContent className="max-h-[92vh] overflow-y-auto touch-auto overscroll-contain">
          <DrawerHeader className="text-left pb-2">
            <DrawerTitle className="text-lg font-bold">Confirm Payment</DrawerTitle>
          </DrawerHeader>

          {processing ? (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">{processingMessages[processingStep]}</p>
              <p className="text-xs text-muted-foreground">Please wait...</p>
              <div className="flex gap-1.5 mt-4">
                {processingMessages.map((_, i) => (
                  <div key={i} className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${i <= processingStep ? "bg-primary" : "bg-muted"}`} />
                ))}
              </div>
            </div>
          ) : (
            <div className="px-5 pb-6 space-y-4">
              {/* Summary */}
              <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground">{merchant.name}</p>
                    <p className="text-xs text-muted-foreground">Retail Merchant Application</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Applicant</span>
                  <span className="font-medium text-foreground">{form.fullName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Business</span>
                  <span className="font-medium text-foreground">{form.businessName}</span>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-4 w-4 text-amber-600" />
                  <p className="text-xs font-bold text-foreground">Fee Breakdown</p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Application Fee</span>
                  <span className="font-bold text-foreground">₦{APPLICATION_FEE.toLocaleString()}.00</span>
                </div>
                <div className="border-t border-amber-500/20 pt-2 flex justify-between text-sm">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-black text-primary text-base">₦{APPLICATION_FEE.toLocaleString()}.00</span>
                </div>
              </div>

              {/* Payment Source */}
              <div className="rounded-xl border border-border/50 bg-card p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">Mobi Wallet</p>
                  <p className="text-xs text-muted-foreground">Payment will be debited from your Mobi Wallet</p>
                </div>
              </div>

              {/* Warning */}
              <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-3 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  This fee is <span className="font-bold text-foreground">non-refundable</span>. By confirming, you authorize the debit of ₦{APPLICATION_FEE.toLocaleString()}.00 from your Mobi Wallet.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  onClick={handleConfirmPayment}
                  className="w-full h-12 rounded-xl text-sm font-bold touch-manipulation active:scale-[0.97]"
                >
                  Confirm &amp; Pay ₦{APPLICATION_FEE.toLocaleString()}.00
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDrawer(false)}
                  className="w-full h-11 rounded-xl text-sm font-semibold touch-manipulation active:scale-[0.97]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}