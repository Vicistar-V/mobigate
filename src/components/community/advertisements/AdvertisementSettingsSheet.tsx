import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  X, ChevronLeft, ChevronRight, Check, MapPin,
  Users, UserCircle, Globe, UsersRound, Store, Wallet, CreditCard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { campaignAudienceOptions, campaignDurationOptions } from "@/data/campaignSystemData";
import { calculateCampaignFee, distributeCampaignFee, formatMobiAmount } from "@/lib/campaignFeeDistribution";
import { getCategoryLabel } from "@/data/advertisementData";
import type { AdvertisementFormData } from "@/types/advertisementSystem";
import type { CampaignAudience, CampaignDurationDays } from "@/types/campaignSystem";

interface AdvertisementSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: AdvertisementFormData;
  onFormDataChange: (data: AdvertisementFormData) => void;
}

const audienceIcons: Record<string, React.ReactNode> = {
  Users: <Users className="h-5 w-5" />,
  UserCircle: <UserCircle className="h-5 w-5" />,
  Globe: <Globe className="h-5 w-5" />,
  UsersRound: <UsersRound className="h-5 w-5" />,
  Store: <Store className="h-5 w-5" />,
};

export function AdvertisementSettingsSheet({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
}: AdvertisementSettingsSheetProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const mockWalletBalance = 150000;

  const toggleAudience = (audience: CampaignAudience) => {
    const current = formData.audienceTargets;
    if (current.includes(audience)) {
      if (current.length === 1) return; // Keep at least one
      onFormDataChange({ ...formData, audienceTargets: current.filter((a) => a !== audience) });
    } else {
      onFormDataChange({ ...formData, audienceTargets: [...current, audience] });
    }
  };

  const setDuration = (days: CampaignDurationDays) => {
    onFormDataChange({ ...formData, durationDays: days });
  };

  const feeCalc = calculateCampaignFee(formData.durationDays, formData.audienceTargets);
  const feeDist = distributeCampaignFee(feeCalc.totalFee);
  const canAfford = mockWalletBalance >= feeCalc.totalFee;

  const handleSubmit = () => {
    if (!canAfford) {
      toast({ title: "Insufficient Balance", description: "Please top up your wallet", variant: "destructive" });
      return;
    }
    toast({ title: "Advertisement Submitted!", description: `Your ad has been submitted. Fee: ${formatMobiAmount(feeCalc.totalFee)}` });
    onOpenChange(false);
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
              Step {step} of 3 — {step === 1 ? "Review Details" : step === 2 ? "Target Audience" : "Duration & Payment"}
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
          <div className="p-4 space-y-4 pb-32">
            {/* STEP 1: Review */}
            {step === 1 && (
              <>
                <Card className="p-3 space-y-2 overflow-hidden">
                  <h3 className="font-semibold text-sm">Advert Summary</h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Business:</span>
                      <span className="font-medium text-right min-w-0 truncate ml-2">{formData.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <Badge variant="secondary" className="text-xs">{getCategoryLabel(formData.category)}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Product:</span>
                      <span className="font-medium text-right min-w-0 truncate ml-2">{formData.productTitle}</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-muted-foreground shrink-0">City:</span>
                      <span className="flex items-center gap-1 text-right ml-2">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {formData.city}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone 1:</span>
                      <span>{formData.phone1}</span>
                    </div>
                    {formData.phone2 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone 2:</span>
                        <span>{formData.phone2}</span>
                      </div>
                    )}
                    {formData.email && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="truncate ml-2">{formData.email}</span>
                      </div>
                    )}
                    {formData.website && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Website:</span>
                        <span className="truncate ml-2">{formData.website}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Media:</span>
                      <span>{formData.media.length} of 4</span>
                    </div>
                  </div>
                </Card>

                {formData.media.length > 0 && (
                  <div className="grid grid-cols-4 gap-1.5">
                    {formData.media.map((item, i) => (
                      <div key={i} className="aspect-square rounded-md overflow-hidden border relative">
                        {item.type === 'video' ? (
                          <video src={item.url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                        ) : (
                          <img src={item.url} alt={`Media ${i + 1}`} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                  {formData.description}
                </p>
              </>
            )}

            {/* STEP 2: Audience */}
            {step === 2 && (
              <>
                <p className="text-sm text-muted-foreground">Select where your ad should appear:</p>
                <div className="space-y-2">
                  {campaignAudienceOptions.map((option) => {
                    const isSelected = formData.audienceTargets.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => toggleAudience(option.value)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 transition-all touch-manipulation active:scale-[0.98] ${
                          isSelected ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30" : "border-border bg-card"
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"}`}>
                          {audienceIcons[option.icon] || <Users className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{option.label}</span>
                            {option.premiumMultiplier > 1 && (
                              <Badge variant="outline" className="text-xs px-1.5">
                                +{Math.round((option.premiumMultiplier - 1) * 100)}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                        </div>
                        <Checkbox checked={isSelected} className="mt-1 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* STEP 3: Duration & Payment */}
            {step === 3 && (
              <>
                <p className="text-sm text-muted-foreground">Choose ad duration:</p>
                <div className="grid grid-cols-2 gap-2">
                  {campaignDurationOptions.map((option) => {
                    const isSelected = formData.durationDays === option.days;
                    return (
                      <button
                        key={option.days}
                        onClick={() => setDuration(option.days)}
                        className={`p-3 rounded-xl border-2 text-left transition-all touch-manipulation active:scale-[0.97] ${
                          isSelected ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30" : "border-border bg-card"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{option.label}</span>
                          {option.popular && (
                            <Badge className="text-xs px-1 bg-amber-500 text-white">Popular</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                        <p className="text-sm font-bold text-primary mt-1">{formatMobiAmount(option.feeInMobi)}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Fee Breakdown */}
                <Card className="p-3 space-y-2 bg-muted/30">
                  <h4 className="font-semibold text-sm">Fee Breakdown</h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Fee ({formData.durationDays} days):</span>
                      <span>{formatMobiAmount(feeCalc.baseFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Audience Premium:</span>
                      <span>{formatMobiAmount(feeCalc.audiencePremium)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-1.5">
                      <span>Total Fee:</span>
                      <span className="text-primary">{formatMobiAmount(feeCalc.totalFee)}</span>
                    </div>
                  </div>
                </Card>

                {/* Revenue Split */}
                <Card className="p-3 space-y-2">
                  <h4 className="font-semibold text-sm">Revenue Distribution</h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Community Share ({feeDist.communityPercentage}%):</span>
                      <span className="text-emerald-600 font-medium">{formatMobiAmount(feeDist.communityShare)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mobigate Share ({feeDist.mobigatePercentage}%):</span>
                      <span>{formatMobiAmount(feeDist.mobigateShare)}</span>
                    </div>
                  </div>
                </Card>

                {/* Wallet */}
                <Card className={`p-3 flex items-center justify-between ${canAfford ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-red-50 dark:bg-red-950/20"}`}>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Wallet Balance</span>
                  </div>
                  <span className={`font-bold text-sm ${canAfford ? "text-emerald-600" : "text-destructive"}`}>
                    {formatMobiAmount(mockWalletBalance)}
                  </span>
                </Card>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t bg-background flex-shrink-0">
          {step < 3 ? (
            <Button
              className="w-full h-11 text-sm font-medium touch-manipulation active:scale-[0.97] bg-amber-600 hover:bg-amber-700"
              onClick={() => setStep(step + 1)}
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              className="w-full h-11 text-sm font-medium touch-manipulation active:scale-[0.97] bg-amber-600 hover:bg-amber-700"
              onClick={handleSubmit}
              disabled={!canAfford}
            >
              <CreditCard className="h-4 w-4 mr-1.5" />
              Pay {formatMobiAmount(feeCalc.totalFee)} & Submit
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
