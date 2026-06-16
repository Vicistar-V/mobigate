import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, Users, FileText } from "lucide-react";
import { joinCommunity, submitMembershipApplication } from "@/hooks/useCommunity";
import { nigerianStates, genderOptions } from "@/data/membershipData";

interface MembershipApplicationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId?: string;
  communityName?: string;
  membershipChoice?: string;
  onJoined?: () => void;
}

export function MembershipApplicationDrawer({
  open, onOpenChange, communityId, communityName = "this community",
  membershipChoice = "voluntary", onJoined,
}: MembershipApplicationDrawerProps) {
  const isMobile    = useIsMobile();
  const navigate    = useNavigate();
  const { toast }   = useToast();

  const [step,         setStep]         = useState<"confirm" | "form" | "success">("confirm");
  const [submitting,   setSubmitting]   = useState(false);
  const [refNumber,    setRefNumber]    = useState("");
  const [acceptTerms,  setAcceptTerms]  = useState(false);

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", dateOfBirth: "",
    gender: "", stateOfOrigin: "", cityOfResidence: "",
    occupation: "", howHeard: "", sponsorName: "", motivation: "",
  });

  const isVoluntary = !membershipChoice || ["voluntary", "open", "auto"].includes(membershipChoice.toLowerCase());
  const needsApplication = !isVoluntary;

  const update = (field: string, value: string) =>
    setForm(p => ({ ...p, [field]: value }));

  const isFormValid = form.fullName && form.email && form.phone && form.gender && form.motivation && acceptTerms;

  const handleJoinDirectly = async () => {
    if (!communityId) return;
    setSubmitting(true);
    try {
      const res = await joinCommunity(communityId);
      if (res.success) {
        toast({ title: "Joined!", description: `You are now a member of ${communityName}` });
        onJoined?.();
        onOpenChange(false);
      } else {
        toast({ title: "Error", description: res.error || "Could not join", variant: "destructive" });
      }
    } finally { setSubmitting(false); }
  };

  const handleSubmitApplication = async () => {
    if (!communityId || !isFormValid) return;
    setSubmitting(true);
    try {
      const res = await submitMembershipApplication(communityId, form);
      if (res.success) {
        setRefNumber(res.reference_number || "");
        setStep("success");
        toast({ title: "Application submitted!", description: "You will be notified when it is reviewed." });
      } else {
        toast({ title: "Error", description: res.error || "Submission failed", variant: "destructive" });
      }
    } finally { setSubmitting(false); }
  };

  const handleReset = () => {
    setStep("confirm");
    setForm({ fullName:"",email:"",phone:"",dateOfBirth:"",gender:"",stateOfOrigin:"",cityOfResidence:"",occupation:"",howHeard:"",sponsorName:"",motivation:"" });
    setAcceptTerms(false);
    setRefNumber("");
  };

  const Content = () => (
    <ScrollArea className="flex-1 overflow-auto">
      <div className="p-4 space-y-4 pb-10">

        {/* ── Step: Confirm join ── */}
        {step === "confirm" && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{communityName}</h3>
              <Badge variant="outline" className="mt-1">
                {isVoluntary ? "Open Membership" : "Application Required"}
              </Badge>
            </div>

            {isVoluntary ? (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  This community has open membership. You can join immediately.
                </p>
                <Button className="w-full" onClick={handleJoinDirectly} disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Join Now
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  Membership requires an application. Fill in your details and submit for review.
                </p>
                <Button className="w-full" onClick={() => setStep("form")}>
                  <FileText className="h-4 w-4 mr-2" /> Fill Application Form
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Or go to the{" "}
                  <button
                    className="text-primary underline"
                    onClick={() => { onOpenChange(false); navigate(`/community/${communityId}/apply`); }}
                  >
                    full application page
                  </button>
                </p>
              </>
            )}
            <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        )}

        {/* ── Step: Application form ── */}
        {step === "form" && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">All fields marked * are required</p>

            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={form.fullName} onChange={e => update("fullName", e.target.value)} placeholder="Your full name" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+234..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select value={form.gender} onValueChange={v => update("gender", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{genderOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" value={form.dateOfBirth} onChange={e => update("dateOfBirth", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>State of Origin</Label>
                <Select value={form.stateOfOrigin} onValueChange={v => update("stateOfOrigin", v)}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>{nigerianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>City of Residence</Label>
                <Input value={form.cityOfResidence} onChange={e => update("cityOfResidence", e.target.value)} placeholder="City" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Occupation</Label>
              <Input value={form.occupation} onChange={e => update("occupation", e.target.value)} placeholder="Your occupation" />
            </div>

            <div className="space-y-2">
              <Label>How did you hear about us?</Label>
              <Input value={form.howHeard} onChange={e => update("howHeard", e.target.value)} placeholder="Social media, friend, etc." />
            </div>

            <div className="space-y-2">
              <Label>Sponsor / Referrer Name</Label>
              <Input value={form.sponsorName} onChange={e => update("sponsorName", e.target.value)} placeholder="If invited by someone" />
            </div>

            <div className="space-y-2">
              <Label>Why do you want to join? *</Label>
              <Textarea
                value={form.motivation}
                onChange={e => update("motivation", e.target.value)}
                placeholder="Tell us why you want to join this community..."
                rows={3}
              />
            </div>

            <div className="flex items-start gap-3">
              <Checkbox id="terms" checked={acceptTerms} onCheckedChange={v => setAcceptTerms(!!v)} />
              <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                I agree to abide by the community's rules and code of conduct
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep("confirm")} disabled={submitting}>Back</Button>
              <Button onClick={handleSubmitApplication} disabled={!isFormValid || submitting}>
                {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</> : "Submit Application"}
              </Button>
            </div>
          </div>
        )}

        {/* ── Step: Success ── */}
        {step === "success" && (
          <div className="text-center space-y-4 py-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="font-bold text-lg">Application Submitted!</h3>
            <p className="text-sm text-muted-foreground">
              Your application to join <strong>{communityName}</strong> has been received.
              You will be notified once it is reviewed.
            </p>
            {refNumber && (
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Reference Number</p>
                <p className="font-mono font-bold text-primary">{refNumber}</p>
              </div>
            )}
            <Button className="w-full" onClick={() => { onOpenChange(false); handleReset(); }}>
              Done
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );

  const title = step === "success" ? "Application Submitted"
    : step === "form" ? "Membership Application"
    : "Join Community";

  if (isMobile) return (
    <Drawer open={open} onOpenChange={v => { if (!v) handleReset(); onOpenChange(v); }}>
      <DrawerContent className="h-[90vh] flex flex-col">
        <DrawerHeader><DrawerTitle>{title}</DrawerTitle></DrawerHeader>
        <Content />
      </DrawerContent>
    </Drawer>
  );

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) handleReset(); onOpenChange(v); }}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4"><SheetTitle>{title}</SheetTitle></SheetHeader>
        <Content />
      </SheetContent>
    </Sheet>
  );
}
