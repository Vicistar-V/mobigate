import { CampaignAudience } from "@/types/campaignSystem";
import { campaignAudienceOptions, campaignDurationOptions } from "@/data/campaignSystemData";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  UserCircle, 
  Globe, 
  UsersRound, 
  Store,
  Target,
  Clock
} from "lucide-react";
import { 
  calculateCampaignFee, 
  distributeCampaignFee,
  formatMobiAmount 
} from "@/lib/campaignFeeDistribution";
import { CampaignDurationDays } from "@/types/campaignSystem";

interface CampaignAudienceSelectorProps {
  selectedAudiences: CampaignAudience[];
  onAudiencesChange: (audiences: CampaignAudience[]) => void;
  selectedDuration: CampaignDurationDays;
  onDurationChange: (duration: CampaignDurationDays) => void;
  showFeeBreakdown?: boolean;
}

const audienceIcons: Record<CampaignAudience, React.ReactNode> = {
  community_interface: <Users className="h-4 w-4" />,
  members_interface: <UserCircle className="h-4 w-4" />,
  mobigate_interface: <Globe className="h-4 w-4" />,
  mobigate_users: <UsersRound className="h-4 w-4" />,
  mobi_store_marketplace: <Store className="h-4 w-4" />
};

export function CampaignAudienceSelector({
  selectedAudiences,
  onAudiencesChange,
  selectedDuration,
  onDurationChange,
  showFeeBreakdown = true
}: CampaignAudienceSelectorProps) {
  
  const handleAudienceToggle = (audience: CampaignAudience) => {
    if (selectedAudiences.includes(audience)) {
      // Don't allow deselecting if it's the only one
      if (selectedAudiences.length === 1) return;
      onAudiencesChange(selectedAudiences.filter(a => a !== audience));
    } else {
      onAudiencesChange([...selectedAudiences, audience]);
    }
  };

  // Calculate fees
  const feeCalculation = calculateCampaignFee(selectedDuration, selectedAudiences);
  const feeDistribution = distributeCampaignFee(feeCalculation.totalFee);

  return (
    <div className="space-y-4">
      {/* Target Audience Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <Label className="text-sm font-semibold">Target Audience *</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Select where the campaign will be displayed. Multiple selections increase visibility but also cost.
        </p>
        
        <div className="space-y-2">
          {campaignAudienceOptions.map((option) => {
            const isSelected = selectedAudiences.includes(option.value);
            return (
              <Card 
                key={option.value}
                className={`cursor-pointer transition-all touch-manipulation ${
                  isSelected 
                    ? "border-primary bg-primary/5 ring-1 ring-primary" 
                    : "hover:border-muted-foreground/30"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAudienceToggle(option.value);
                }}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => handleAudienceToggle(option.value)}
                      className="mt-0.5"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {audienceIcons[option.value]}
                        <span className="font-medium text-sm">{option.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {option.description}
                      </p>
                    </div>
                    {option.premiumMultiplier > 1 && (
                      <Badge variant="secondary" className="text-xs shrink-0">
                        +{Math.round((option.premiumMultiplier - 1) * 100)}%
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="bg-muted/50 rounded-lg p-2.5">
          <p className="text-xs text-muted-foreground">
            <strong>Selected:</strong> {selectedAudiences.length} audience{selectedAudiences.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <Separator />

      {/* Campaign Duration Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <Label className="text-sm font-semibold">Campaign Duration *</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Select how long the campaign will run
        </p>
        
        <RadioGroup 
          value={String(selectedDuration)} 
          onValueChange={(val) => onDurationChange(Number(val) as CampaignDurationDays)}
          className="grid grid-cols-2 gap-2"
        >
          {campaignDurationOptions.map((option) => (
            <div key={option.days} className="relative">
              <RadioGroupItem 
                value={String(option.days)} 
                id={`admin-duration-${option.days}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`admin-duration-${option.days}`}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all touch-manipulation
                  peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5
                  hover:bg-muted/50
                `}
              >
                <span className="font-bold text-sm">{option.label}</span>
                <span className="text-primary font-semibold text-xs">{formatMobiAmount(option.feeInMobi)}</span>
                {option.popular && (
                  <Badge className="mt-1 text-[10px] h-4 px-1.5">Popular</Badge>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Fee Breakdown */}
      {showFeeBreakdown && (
        <>
          <Separator />
          
          <Card className="bg-muted/30">
            <CardContent className="p-3 space-y-2">
              <h4 className="font-semibold text-sm">Fee Breakdown</h4>
              
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">Base Fee ({selectedDuration} days)</span>
                  <span className="text-xs">{formatMobiAmount(feeCalculation.baseFee)}</span>
                </div>
                
                {feeCalculation.audiencePremium > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-xs">Audience Premium</span>
                    <span className="text-xs text-amber-600">+{formatMobiAmount(feeCalculation.audiencePremium)}</span>
                  </div>
                )}
                
                <Separator className="my-1" />
                
                <div className="flex justify-between font-bold">
                  <span className="text-sm">Total Fee</span>
                  <span className="text-primary">{formatMobiAmount(feeCalculation.totalFee)}</span>
                </div>
              </div>
              
              <div className="bg-background/50 rounded-lg p-2 space-y-1 text-xs">
                <p className="text-muted-foreground font-medium">Fee Distribution:</p>
                <div className="flex justify-between text-muted-foreground">
                  <span>Community Share ({feeDistribution.communityPercentage}%)</span>
                  <span>{formatMobiAmount(feeDistribution.communityShare)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Mobigate Share ({feeDistribution.mobigatePercentage}%)</span>
                  <span>{formatMobiAmount(feeDistribution.mobigateShare)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
