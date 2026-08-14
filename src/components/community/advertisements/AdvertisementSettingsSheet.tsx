import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  X, ChevronLeft, ChevronRight, Check, MapPin,
  Users, Globe, UsersRound, Store, Wallet, CreditCard, Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatMobiAmount } from "@/lib/campaignFeeDistribution";
import type { AdvertisementFormData } from "@/types/advertisementSystem";

const API = "/api/community";

interface AdRates {
  duration_7: number; duration_14: number; duration_30: number;
  duration_60: number; duration_90: number;
  pct_members: number; pct_mobiface: number; pct_users: number; pct_store: number;
  community_share_pct: number;
}
const DEFAULT_RATES: AdRates = { duration_7:500, duration_14:900, duration_30:1600, duration_60:2750, duration_90:3750, pct_members:1000, pct_mobiface:2500, pct_users:2000, pct_store:1500, community_share_pct:60 };

const DURATIONS = [
  { days: 7,  label: "7 Days"  },
  { days: 14, label: "14 Days" },
  { days: 30, label: "30 Days" },
  { days: 60, label: "60 Days" },
  { days: 90, label: "90 Days" },
];




interface AdvertisementSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId?: string;
  formData: AdvertisementFormData;
  onFormDataChange: (data: AdvertisementFormData) => void;
  onPublish?: (fees: { baseFee: number; audiencePremium: number; totalFee: number; communityShare: number; mobifaceShare: number }) => Promise<void>;
}

export function AdvertisementSettingsSheet({ open, onOpenChange, communityId, formData, onFormDataChange, onPublish }: AdvertisementSettingsSheetProps) {
  const { toast } = useToast();
  const [step,         setStep]        = useState(1);
  const [submitting,   setSubmitting]  = useState(false);
  const [walletBalance,setWalletBalance] = useState<number | null>(null);
  const [loadingWallet,setLoadingWallet] = useState(false);
  const [rates,        setRates]       = useState<AdRates>(DEFAULT_RATES);
  const [loadingRates, setLoadingRates]= useState(false);

  // Icons inside component — no JSX at module level
  const AUDIENCES = [
    { id: "community_members",  label: "Community Members",      icon: <Users className="h-4 w-4" />,      key: "pct_members"  as const },
    { id: "mobiface_interface", label: "Mobiface Interface",     icon: <Globe className="h-4 w-4" />,      key: "pct_mobiface" as const },
    { id: "mobigate_users",     label: "All Mobigate Users",     icon: <UsersRound className="h-4 w-4" />, key: "pct_users"    as const },
    { id: "mobi_store",         label: "Mobi-Store Marketplace", icon: <Store className="h-4 w-4" />,      key: "pct_store"    as const },
  ];

  useEffect(() => {
    if (!open) return;
    setLoadingWallet(true);
    fetch(`${API}/advertisements.php?action=wallet_balance`, { credentials:"include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => setWalletBalance(d?.main_balance ?? 0))
      .catch(() => setWalletBalance(0))
      .finally(() => setLoadingWallet(false));
    if (communityId) {
      setLoadingRates(true);
      fetch(`${API}/ad_rates.php?community_id=${communityId}`, { credentials:"include" })
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.rates) setRates(d.rates); })
        .catch(() => {})
        .finally(() => setLoadingRates(false));
    }
  }, [open, communityId]);

  // Compute fees from API rates
  const durDays: number = (formData.durationDays as any) ?? 7;
  const baseFee = (rates[`duration_${durDays}` as keyof AdRates] as number) ?? rates.duration_7;
  const selectedAudiences: string[] = (formData.audienceTargets as any) ?? ["community_members"];
  const audiencePremium = AUDIENCES.filter(a => selectedAudiences.includes(a.id)).reduce((s, a) => s + (rates[a.key] ?? 0), 0);
  const totalFee = baseFee + audiencePremium;
  const communityShareAmt = Math.round(totalFee * (rates.community_share_pct / 100));
  const mobifaceShareAmt  = totalFee - communityShareAmt;
  const canAfford = walletBalance !== null && walletBalance >= totalFee;

  const toggleAudience = (id: string) => {
    const cur = selectedAudiences;
    const next = cur.includes(id) ? (cur.length > 1 ? cur.filter(a => a !== id) : cur) : [...cur, id];
    onFormDataChange({ ...formData, audienceTargets: next as any });
  };
  const setDuration = (days: number) => onFormDataChange({ ...formData, durationDays: days as any });

  const handleSubmit = async () => {
    if (walletBalance === null) { toast({ title:"Loading...", variant:"destructive" }); return; }
    if (!canAfford) { toast({ title:"Insufficient Balance", description:`Need ${formatMobiAmount(totalFee)}`, variant:"destructive" }); return; }
    setSubmitting(true);
    try {
      await onPublish?.({ baseFee, audiencePremium, totalFee, communityShare: communityShareAmt, mobifaceShare: mobifaceShareAmt });
      toast({ title:"Ad Published!", description:`${formatMobiAmount(totalFee)} deducted` });
      onOpenChange(false);
    } catch (e: any) { toast({ title:"Failed", description: e.message, variant:"destructive" }); }
    finally { setSubmitting(false); }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setStep(step - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <h2 className="font-semibold text-base">
              Step {step} of 3 — {step === 1 ? "Review Details" : step === 2 ? "Duration & Payment" : "Target Audience"}
            </h2>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-1 px-4 py-2 flex-shrink-0">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-all ${s <= step ? "bg-amber-500" : "bg-muted"}`}
            />
          ))}
        </div>

        <ScrollArea className="flex-1 overflow-y-auto touch-auto">
          <div className="px-3 py-4 space-y-4 pb-32 min-w-0 overflow-hidden">
            {/* STEP 1: Review */}
            {step === 1 && (
              <>
                <Card className="p-3 space-y-3 min-w-0 overflow-hidden">
                  <h3 className="font-semibold text-base">Advert Summary</h3>
                  <div className="space-y-3 text-sm min-w-0">
                    {/* Business Name */}
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Business</span>
                      <p className="text-sm font-semibold break-words overflow-wrap-anywhere">{formData.businessName}</p>
                    </div>

                    {/* Category */}
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</span>
                      <div>
                        <Badge variant="secondary" className="text-xs font-medium max-w-full truncate">
                          {formData.category === "other" && formData.customCategory
                            ? formData.customCategory
                            : (formData.category ?? 'general').replace(/_/g,' ')}
                        </Badge>
                      </div>
                    </div>

                    {/* Product Title */}
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Product</span>
                      <p className="text-sm font-semibold break-words" style={{ overflowWrap: 'anywhere' }}>{formData.productTitle}</p>
                    </div>

                    {/* City */}
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">City</span>
                      <p className="text-sm break-words flex items-start gap-1.5">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                        <span className="min-w-0 break-words" style={{ overflowWrap: 'anywhere' }}>{formData.city}</span>
                      </p>
                    </div>

                    {/* Phone 1 */}
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone 1</span>
                      <p className="text-sm font-medium">{formData.phone1}</p>
                    </div>

                    {/* Phone 2 */}
                    {formData.phone2 && (
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone 2</span>
                        <p className="text-sm font-medium">{formData.phone2}</p>
                      </div>
                    )}

                    {/* Email */}
                    {formData.email && (
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</span>
                        <p className="text-sm break-all" style={{ overflowWrap: 'anywhere' }}>{formData.email}</p>
                      </div>
                    )}

                    {/* Website */}
                    {formData.website && (
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Website</span>
                        <p className="text-sm break-all text-primary" style={{ overflowWrap: 'anywhere' }}>{formData.website}</p>
                      </div>
                    )}

                    {/* Media Count */}
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Media</span>
                      <p className="text-sm font-medium">{formData.media.length} of 4 uploaded</p>
                    </div>
                  </div>
                </Card>

                {/* Media Grid */}
                {formData.media.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {formData.media.map((item, i) => (
                      <div key={i} className="aspect-video rounded-lg overflow-hidden border relative">
                        {item.type === 'video' ? (
                          <video src={item.url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                        ) : (
                          <img src={item.url} alt={`Media ${i + 1}`} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Description */}
                {formData.description && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</span>
                    <p className="text-sm text-foreground leading-relaxed break-words">
                      {formData.description}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* STEP 2: Duration & Payment */}
            {step === 2 && (
              <>
                <p className="text-sm text-muted-foreground">Choose ad duration:</p>
                {loadingRates ? (
                  <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {DURATIONS.map(opt => {
                      const fee = (rates[`duration_${opt.days}` as keyof AdRates] as number) ?? 0;
                      const isSelected = durDays === opt.days;
                      return (
                        <button key={opt.days} onClick={() => setDuration(opt.days)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${isSelected ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30" : "border-border bg-card"}`}>
                          <span className="font-semibold text-sm">{opt.label}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">≈{Math.round(fee/opt.days)} Mobi/day</p>
                          <p className="text-sm font-bold text-primary mt-1">{formatMobiAmount(fee)}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
                <Card className="p-3 bg-muted/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Fee ({durDays} days):</span>
                    <span className="font-bold text-primary">{formatMobiAmount(baseFee)}</span>
                  </div>
                </Card>
              </>
            )}

            {/* STEP 3: Target Audience */}
            {step === 3 && (
              <>
                <p className="text-sm text-muted-foreground">Select where your ad should appear:</p>
                <div className="space-y-2">
                  {AUDIENCES.map(opt => {
                    const isSelected = selectedAudiences.includes(opt.id);
                    const premium = rates[opt.key] ?? 0;
                    return (
                      <button key={opt.id} onClick={() => toggleAudience(opt.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${isSelected ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30" : "border-border bg-card"}`}>
                        <div className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"}`}>{opt.icon}</div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{opt.label}</span>
                            {premium > 0 && <Badge variant="outline" className="text-xs px-1.5">+{formatMobiAmount(premium)}</Badge>}
                          </div>
                        </div>
                        <Checkbox checked={isSelected} className="mt-1 shrink-0" />
                      </button>
                    );
                  })}
                </div>

                {/* Fee Breakdown */}
                <Card className="p-3 space-y-1.5 bg-muted/30">
                  <h4 className="font-semibold text-sm">Fee Breakdown</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Fee ({durDays} days):</span>
                    <span>{formatMobiAmount(baseFee)}</span>
                  </div>
                  {AUDIENCES.filter(a => selectedAudiences.includes(a.id) && rates[a.key]).map(a => (
                    <div key={a.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{a.label} Premium:</span>
                      <span>+{formatMobiAmount(rates[a.key])}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold border-t pt-1.5 text-sm">
                    <span>Total Fee:</span>
                    <span className="text-primary">{formatMobiAmount(totalFee)}</span>
                  </div>
                </Card>

                {/* Wallet */}
                <Card className={`p-3 flex items-center justify-between ${canAfford ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-red-50 dark:bg-red-950/20"}`}>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Your Wallet Balance</span>
                  </div>
                  {loadingWallet ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                    <span className={`font-bold text-sm ${canAfford ? "text-emerald-600" : "text-destructive"}`}>
                      {walletBalance !== null ? formatMobiAmount(walletBalance) : "—"}
                    </span>
                  )}
                </Card>
                {!canAfford && walletBalance !== null && (
                  <p className="text-xs text-destructive text-center">
                    Need {formatMobiAmount(totalFee - walletBalance)} more to proceed.
                  </p>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t bg-background flex-shrink-0">
          {step < 3 ? (
            <Button className="w-full h-11 bg-amber-600 hover:bg-amber-700" onClick={() => setStep(step + 1)}>
              Continue <ChevronRight className="h-4 w-4 ml-1.5" />
            </Button>
          ) : (
            <Button className="w-full h-11 bg-amber-600 hover:bg-amber-700"
              onClick={handleSubmit} disabled={submitting || loadingWallet || !canAfford}>
              {submitting ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />Publishing…</>
               : loadingWallet ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />Loading…</>
               : <><CreditCard className="h-4 w-4 mr-1.5" />Pay {formatMobiAmount(totalFee)} & Publish</>}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}