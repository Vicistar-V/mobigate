import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Store, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { merchantCountries } from "@/data/mobiMerchantsData";
import { mockMerchants } from "@/data/mobigateInteractiveQuizData";
import { allLocationMerchants } from "@/data/nigerianLocationsData";

export default function SubMerchantApplicationPage() {
  const { merchantId } = useParams<{ merchantId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Find merchant info
  const quizMerchant = mockMerchants.find(m => m.id === merchantId);
  const locationMerchant = allLocationMerchants.find(m => m.id === merchantId);
  const merchant = quizMerchant
    ? { id: quizMerchant.id, name: quizMerchant.name, category: quizMerchant.category }
    : locationMerchant
      ? { id: locationMerchant.id, name: locationMerchant.name, category: locationMerchant.category }
      : { id: merchantId || "unknown", name: "Merchant", category: "General" };

  // Find discount info from mobiMerchantsData
  const allMerchants = merchantCountries.flatMap(c => c.merchants);
  const mobiMerchant = allMerchants.find(m => m.id === merchantId);

  const [form, setForm] = useState({
    fullName: "",
    businessName: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    businessType: "",
    description: "",
    yearsInBusiness: "",
    agreeTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isValid = form.fullName.trim() && form.businessName.trim() && form.phone.trim() &&
    form.city.trim() && form.state.trim() && form.businessType && form.agreeTerms;

  const handleSubmit = () => {
    if (!isValid) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: `Your sub-merchant application for ${merchant.name} has been submitted for review.`,
      });
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-base font-bold text-foreground">Application Submitted</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="h-20 w-20 rounded-full bg-emerald-500/15 flex items-center justify-center mb-5">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Application Received!</h2>
          <p className="text-sm text-muted-foreground mb-2">
            Your application to become a sub-merchant under <span className="font-semibold text-foreground">{merchant.name}</span> has been submitted.
          </p>
          <p className="text-xs text-muted-foreground mb-8">
            You'll be notified once your application is reviewed. This usually takes 2-5 business days.
          </p>
          <Button onClick={() => navigate(-1)} className="w-full max-w-xs h-12 rounded-xl touch-manipulation active:scale-[0.97]">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-8">
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-foreground">Apply as Sub-Merchant</h1>
          <p className="text-xs text-muted-foreground">Join {merchant.name}'s network</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Merchant Info Card */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-foreground">{merchant.name}</p>
            <p className="text-xs text-muted-foreground">{merchant.category}</p>
            {mobiMerchant && (
              <Badge className="bg-emerald-500/15 text-emerald-600 text-xs mt-1">1–25% discount rate</Badge>
            )}
          </div>
        </div>

        {/* Application Fee Notice */}
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-foreground">Application Fee: ₦5,000</p>
            <p className="text-xs text-muted-foreground">A one-time non-refundable processing fee will be charged upon submission.</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Applicant Full Name *</Label>
            <Input
              value={form.fullName}
              onChange={e => updateField("fullName", e.target.value)}
              placeholder="Your full legal name"
              className="h-11 rounded-xl text-sm"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Business / Store Name *</Label>
            <Input
              value={form.businessName}
              onChange={e => updateField("businessName", e.target.value)}
              placeholder="Name of your business or store"
              className="h-11 rounded-xl text-sm"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Phone Number *</Label>
            <Input
              value={form.phone}
              onChange={e => updateField("phone", e.target.value)}
              placeholder="+234 801 234 5678"
              type="tel"
              className="h-11 rounded-xl text-sm"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Email Address</Label>
            <Input
              value={form.email}
              onChange={e => updateField("email", e.target.value)}
              placeholder="youremail@example.com"
              type="email"
              className="h-11 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-foreground mb-1.5 block">State *</Label>
              <Input
                value={form.state}
                onChange={e => updateField("state", e.target.value)}
                placeholder="e.g. Lagos"
                className="h-11 rounded-xl text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-foreground mb-1.5 block">City *</Label>
              <Input
                value={form.city}
                onChange={e => updateField("city", e.target.value)}
                placeholder="e.g. Ikeja"
                className="h-11 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Business Type *</Label>
            <Select value={form.businessType} onValueChange={v => updateField("businessType", v)}>
              <SelectTrigger className="h-11 rounded-xl text-sm">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail_shop">Retail Shop</SelectItem>
                <SelectItem value="kiosk">Kiosk</SelectItem>
                <SelectItem value="online_store">Online Store</SelectItem>
                <SelectItem value="mobile_agent">Mobile Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Years in Business</Label>
            <Select value={form.yearsInBusiness} onValueChange={v => updateField("yearsInBusiness", v)}>
              <SelectTrigger className="h-11 rounded-xl text-sm">
                <SelectValue placeholder="How long have you been in business?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="less_than_1">Less than 1 year</SelectItem>
                <SelectItem value="1_to_3">1 - 3 years</SelectItem>
                <SelectItem value="3_to_5">3 - 5 years</SelectItem>
                <SelectItem value="5_plus">5+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Brief Description of Your Business</Label>
            <Textarea
              value={form.description}
              onChange={e => updateField("description", e.target.value)}
              placeholder="Describe your business, location, and what you sell..."
              className="min-h-[80px] rounded-xl text-sm"
            />
          </div>

          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="terms"
              checked={form.agreeTerms}
              onCheckedChange={v => updateField("agreeTerms", !!v)}
              className="mt-0.5"
            />
            <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
              I agree to the sub-merchant terms and conditions and understand that the ₦5,000 application fee is non-refundable.
            </label>
          </div>
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className="w-full h-12 rounded-xl text-sm font-bold touch-manipulation active:scale-[0.97] mt-4"
        >
          {submitting ? "Submitting Application..." : "Submit Application — ₦5,000"}
        </Button>
      </div>
    </div>
  );
}
