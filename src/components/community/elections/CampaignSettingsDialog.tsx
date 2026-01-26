import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  UserCircle, 
  Globe, 
  UsersRound, 
  Store,
  Wallet,
  Check,
  AlertCircle,
  Loader2,
  Plus,
  X,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  CampaignAudience, 
  CampaignDurationDays,
  CampaignFormData,
  CampaignPriority
} from "@/types/campaignSystem";
import { 
  campaignAudienceOptions, 
  campaignDurationOptions 
} from "@/data/campaignSystemData";
import { 
  calculateCampaignFee, 
  distributeCampaignFee,
  processCampaignPayment,
  formatMobiAmount
} from "@/lib/campaignFeeDistribution";
import { CampaignMediaUploader } from "./CampaignMediaUploader";

interface CampaignSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  office: string;
  walletBalance?: number;
  onLaunchCampaign?: (data: CampaignFormData) => void;
}

const audienceIcons: Record<CampaignAudience, React.ReactNode> = {
  community_interface: <Users className="h-4 w-4" />,
  members_interface: <UserCircle className="h-4 w-4" />,
  mobigate_interface: <Globe className="h-4 w-4" />,
  mobigate_users: <UsersRound className="h-4 w-4" />,
  mobi_store_marketplace: <Store className="h-4 w-4" />
};

export function CampaignSettingsDialog({
  open,
  onOpenChange,
  candidateName,
  office,
  walletBalance = 15000,
  onLaunchCampaign
}: CampaignSettingsDialogProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [tagline, setTagline] = useState("");
  const [slogan, setSlogan] = useState("");
  const [manifesto, setManifesto] = useState("");
  const [priorities, setPriorities] = useState<CampaignPriority[]>([
    { id: "1", title: "", description: "" }
  ]);
  const [selectedAudiences, setSelectedAudiences] = useState<CampaignAudience[]>(["community_interface"]);
  const [selectedDuration, setSelectedDuration] = useState<CampaignDurationDays>(7);
  const [newPriority, setNewPriority] = useState("");
  
  // Media uploads handled by CampaignMediaUploader

  // Calculate fees
  const feeCalculation = calculateCampaignFee(selectedDuration, selectedAudiences);
  const feeDistribution = distributeCampaignFee(feeCalculation.totalFee);
  const hasInsufficientBalance = walletBalance < feeCalculation.totalFee;

  const handleAudienceToggle = (audience: CampaignAudience) => {
    setSelectedAudiences(prev => {
      if (prev.includes(audience)) {
        // Don't allow deselecting if it's the only one
        if (prev.length === 1) return prev;
        return prev.filter(a => a !== audience);
      } else {
        return [...prev, audience];
      }
    });
  };

  const handleAddPriority = () => {
    if (newPriority.trim()) {
      setPriorities(prev => [
        ...prev,
        { id: String(Date.now()), title: newPriority.trim() }
      ]);
      setNewPriority("");
    }
  };

  const handleRemovePriority = (id: string) => {
    setPriorities(prev => prev.filter(p => p.id !== id));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!slogan.trim()) {
        toast({
          title: "Slogan Required",
          description: "Please enter a campaign slogan",
          variant: "destructive"
        });
        return;
      }
      if (!tagline.trim()) {
        toast({
          title: "Tagline Required",
          description: "Please enter a campaign tagline",
          variant: "destructive"
        });
        return;
      }
      if (!manifesto.trim()) {
        toast({
          title: "Manifesto Required",
          description: "Please enter your campaign manifesto",
          variant: "destructive"
        });
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleLaunchCampaign = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const paymentResult = processCampaignPayment(walletBalance, feeCalculation.totalFee);
    
    if (paymentResult.success) {
      toast({
        title: "Campaign Launched Successfully! 🎉",
        description: `${formatMobiAmount(feeCalculation.totalFee)} has been debited from your Mobi Wallet. Your campaign is now active!`,
      });
      
      if (onLaunchCampaign) {
        onLaunchCampaign({
          candidateName,
          office,
          tagline,
          manifesto,
          priorities: priorities.filter(p => p.title.trim()),
          audienceTargets: selectedAudiences,
          durationDays: selectedDuration
        });
      }
      
      // Reset and close
      setStep(1);
      setTagline("");
      setSlogan("");
      setManifesto("");
      setPriorities([{ id: "1", title: "", description: "" }]);
      setSelectedAudiences(["community_interface"]);
      setSelectedDuration(7);
      onOpenChange(false);
    } else {
      toast({
        title: "Payment Failed",
        description: paymentResult.error,
        variant: "destructive"
      });
    }
    
    setIsProcessing(false);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Candidate Name</Label>
        <Input value={candidateName} disabled className="bg-muted" />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Office Position</Label>
        <Input value={office} disabled className="bg-muted" />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Campaign Slogan *</Label>
        <Input 
          value={slogan}
          onChange={(e) => setSlogan(e.target.value)}
          placeholder="e.g., 'Progress Through Unity'"
          maxLength={40}
        />
        <p className="text-xs text-muted-foreground">{slogan.length}/40 characters</p>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Campaign Tagline *</Label>
        <Input 
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="e.g., Building Tomorrow, Together"
          maxLength={60}
        />
        <p className="text-xs text-muted-foreground">{tagline.length}/60 characters</p>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Campaign Manifesto *</Label>
        <Textarea 
          value={manifesto}
          onChange={(e) => setManifesto(e.target.value)}
          placeholder="Describe your vision, goals, and what you plan to achieve..."
          rows={5}
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground">{manifesto.length}/1000 characters</p>
      </div>

      {/* Media Upload Section */}
      <Separator />
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Campaign Media *</Label>
        </div>
        
        <CampaignMediaUploader />
      </div>

      <Separator />
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Key Priorities</Label>
        <div className="space-y-2">
          {priorities.filter(p => p.title.trim()).map((priority) => (
            <div key={priority.id} className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
              <Check className="h-4 w-4 text-primary" />
              <span className="flex-1 text-sm">{priority.title}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => handleRemovePriority(priority.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input 
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              placeholder="Add a priority..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddPriority()}
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleAddPriority}
              disabled={!newPriority.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Choose Campaign Audience</Label>
        <p className="text-xs text-muted-foreground">
          Select where your campaign will be displayed. Multiple selections increase visibility but also cost.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {campaignAudienceOptions.map((option) => {
          const isSelected = selectedAudiences.includes(option.value);
          return (
            <Card 
              key={option.value}
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? "border-primary bg-primary/5 ring-1 ring-primary" 
                  : "hover:border-muted-foreground/30"
              }`}
              onClick={() => handleAudienceToggle(option.value)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => handleAudienceToggle(option.value)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {audienceIcons[option.value]}
                      <span className="font-medium text-sm">{option.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
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
      
      <div className="bg-muted/50 rounded-lg p-3">
        <p className="text-xs text-muted-foreground">
          <strong>Selected:</strong> {selectedAudiences.length} audience{selectedAudiences.length > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Campaign Duration</Label>
        <p className="text-xs text-muted-foreground">
          Select how long your campaign will run
        </p>
      </div>
      
      <RadioGroup 
        value={String(selectedDuration)} 
        onValueChange={(val) => setSelectedDuration(Number(val) as CampaignDurationDays)}
        className="grid grid-cols-2 gap-2"
      >
        {campaignDurationOptions.map((option) => (
          <div key={option.days} className="relative">
            <RadioGroupItem 
              value={String(option.days)} 
              id={`duration-${option.days}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`duration-${option.days}`}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5
                hover:bg-muted/50
              `}
            >
              <span className="font-bold text-base">{option.label}</span>
              <span className="text-primary font-semibold text-sm">{formatMobiAmount(option.feeInMobi)}</span>
              {option.popular && (
                <Badge className="mt-1 text-[10px] h-4">Popular</Badge>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      <Separator />
      
      {/* Fee Breakdown */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h4 className="font-semibold text-sm">Fee Breakdown</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Fee ({selectedDuration} days)</span>
              <span>{formatMobiAmount(feeCalculation.baseFee)}</span>
            </div>
            
            {feeCalculation.audiencePremium > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Audience Premium</span>
                <span>+{formatMobiAmount(feeCalculation.audiencePremium)}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between font-bold">
              <span>Total Fee</span>
              <span className="text-primary">{formatMobiAmount(feeCalculation.totalFee)}</span>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-xs">
            <p className="text-muted-foreground">Fee Distribution:</p>
            <div className="flex justify-between">
              <span>Community Share ({feeDistribution.communityPercentage}%)</span>
              <span>{formatMobiAmount(feeDistribution.communityShare)}</span>
            </div>
            <div className="flex justify-between">
              <span>Mobigate Share ({feeDistribution.mobigatePercentage}%)</span>
              <span>{formatMobiAmount(feeDistribution.mobigateShare)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Wallet Balance */}
      <Card className={hasInsufficientBalance ? "border-destructive" : "border-primary"}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${hasInsufficientBalance ? "bg-destructive/10" : "bg-primary/10"}`}>
              <Wallet className={`h-5 w-5 ${hasInsufficientBalance ? "text-destructive" : "text-primary"}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Your Wallet Balance</p>
              <p className={`font-bold text-lg ${hasInsufficientBalance ? "text-destructive" : ""}`}>
                {formatMobiAmount(walletBalance)}
              </p>
            </div>
            {hasInsufficientBalance && (
              <AlertCircle className="h-5 w-5 text-destructive" />
            )}
          </div>
          
          {hasInsufficientBalance && (
            <p className="text-xs text-destructive mt-2">
              Insufficient balance. You need {formatMobiAmount(feeCalculation.totalFee - walletBalance)} more.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl">
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {step}
            </span>
            {step === 1 && "Campaign Details"}
            {step === 2 && "Choose Audience"}
            {step === 3 && "Duration & Payment"}
          </SheetTitle>
          
          {/* Progress indicator */}
          <div className="flex gap-1 pt-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100%-120px)] mt-4">
          <div className="pr-2">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>
        </ScrollArea>
        
        {/* Navigation Buttons */}
        <div className="flex gap-2 pt-4 border-t mt-auto">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          
          {step < 3 ? (
            <Button 
              onClick={handleNext}
              className="flex-1"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={handleLaunchCampaign}
              disabled={hasInsufficientBalance || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay & Launch Campaign
                </>
              )}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
