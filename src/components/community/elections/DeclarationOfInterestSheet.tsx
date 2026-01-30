import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Vote,
  Wallet,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Users,
  Crown,
  Briefcase,
  Shield,
  Globe,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MobiCurrencyDisplay } from "@/components/common/MobiCurrencyDisplay";
import { nominationFeeStructures, getNominationFee, mockNominationPeriod, calculateTotalNominationCost, mobigateNominationConfig } from "@/data/nominationFeesData";
import { NominationFeeStructure } from "@/types/nominationProcess";
import { formatMobiAmount, formatLocalAmount, generateTransactionReference } from "@/lib/mobiCurrencyTranslation";
import { format } from "date-fns";
import { MobiExplainerTooltip, MobiCurrencyInfoBanner } from "@/components/common/MobiExplainerTooltip";

interface DeclarationOfInterestSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  walletBalance?: number;
  onDeclarationComplete?: (officeId: string, transactionRef: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "executive":
      return Crown;
    case "administrative":
      return Briefcase;
    case "support":
      return Shield;
    default:
      return Vote;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "executive":
      return "bg-amber-500/10 text-amber-600";
    case "administrative":
      return "bg-blue-500/10 text-blue-600";
    case "support":
      return "bg-green-500/10 text-green-600";
    default:
      return "bg-muted";
  }
};

export function DeclarationOfInterestSheet({
  open,
  onOpenChange,
  memberName,
  walletBalance = 75000,
  onDeclarationComplete,
}: DeclarationOfInterestSheetProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"select" | "confirm" | "processing" | "success">("select");
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [transactionRef, setTransactionRef] = useState<string>("");

  const selectedFeeStructure = selectedOffice ? getNominationFee(selectedOffice) : null;
  const costBreakdown = selectedOffice ? calculateTotalNominationCost(selectedOffice) : null;
  const hasInsufficientBalance = costBreakdown 
    ? walletBalance < costBreakdown.totalDebited 
    : false;

  const handleSelectOffice = (officeId: string) => {
    setSelectedOffice(officeId);
  };

  const handleProceedToConfirm = () => {
    if (!selectedFeeStructure) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmDeclaration = async () => {
    setShowConfirmDialog(false);
    setStep("processing");

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    const ref = generateTransactionReference("NOM");
    setTransactionRef(ref);
    setStep("success");

    toast({
      title: "Declaration Successful! 🎉",
      description: `Your declaration for ${selectedFeeStructure?.officeName} has been registered.`,
    });
  };

  const handleGoToCampaign = () => {
    if (onDeclarationComplete && selectedOffice) {
      onDeclarationComplete(selectedOffice, transactionRef);
    }
    onOpenChange(false);
    // Reset state
    setStep("select");
    setSelectedOffice(null);
    setTransactionRef("");
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep("select");
    setSelectedOffice(null);
    setTransactionRef("");
  };

  const renderSelectStep = () => (
    <div className="space-y-4">
      {/* Nomination Period Info */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm">
            <Vote className="h-4 w-4 text-primary" />
            <span className="font-medium">{mockNominationPeriod.electionName}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Nominations close: {format(mockNominationPeriod.closeDate, "MMMM d, yyyy")}
          </p>
        </CardContent>
      </Card>

      {/* Wallet Balance */}
      <Card>
        <CardContent className="p-3 flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Your Wallet Balance</p>
            <MobiCurrencyDisplay amount={walletBalance} size="sm" />
          </div>
        </CardContent>
      </Card>

      {/* Office Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Select Office Position</Label>
        <RadioGroup 
          value={selectedOffice || ""} 
          onValueChange={handleSelectOffice}
          className="space-y-2"
        >
          {/* Executive Positions */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Executive Positions
            </p>
            {nominationFeeStructures
              .filter(f => f.category === "executive")
              .map((office) => (
                <OfficeOptionCard 
                  key={office.officeId} 
                  office={office}
                  isSelected={selectedOffice === office.officeId}
                  walletBalance={walletBalance}
                />
              ))}
          </div>

          <Separator />

          {/* Administrative Positions */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Administrative Positions
            </p>
            {nominationFeeStructures
              .filter(f => f.category === "administrative")
              .map((office) => (
                <OfficeOptionCard 
                  key={office.officeId} 
                  office={office}
                  isSelected={selectedOffice === office.officeId}
                  walletBalance={walletBalance}
                />
              ))}
          </div>

          <Separator />

          {/* Support Positions */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Support Positions
            </p>
            {nominationFeeStructures
              .filter(f => f.category === "support")
              .map((office) => (
                <OfficeOptionCard 
                  key={office.officeId} 
                  office={office}
                  isSelected={selectedOffice === office.officeId}
                  walletBalance={walletBalance}
                />
              ))}
          </div>
        </RadioGroup>
      </div>

      {/* Selected Office Fee Breakdown */}
      {costBreakdown && selectedFeeStructure && (
        <Card className={hasInsufficientBalance ? "border-destructive" : "border-primary"}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm">Fee Breakdown</h4>
              <MobiExplainerTooltip size="sm" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nomination Fee</span>
                <div className="text-right">
                  <span className="font-medium">{formatMobiAmount(costBreakdown.nominationFee)}</span>
                  <p className="text-xs text-muted-foreground">({formatLocalAmount(costBreakdown.nominationFee, "NGN")})</p>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Fee</span>
                <div className="text-right">
                  <span className="font-medium">{formatMobiAmount(costBreakdown.processingFee)}</span>
                  <p className="text-xs text-muted-foreground">({formatLocalAmount(costBreakdown.processingFee, "NGN")})</p>
                </div>
              </div>
              <div className="flex justify-between text-amber-600">
                <span>Service Charge ({mobigateNominationConfig.serviceChargePercent}%)</span>
                <div className="text-right">
                  <span className="font-medium">{formatMobiAmount(costBreakdown.serviceCharge)}</span>
                  <p className="text-xs text-amber-600/70">({formatLocalAmount(costBreakdown.serviceCharge, "NGN")})</p>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total Debited</span>
                <div className="text-right">
                  <span className="text-primary">
                    {formatMobiAmount(costBreakdown.totalDebited)}
                  </span>
                  <p className="text-xs font-normal text-muted-foreground">({formatLocalAmount(costBreakdown.totalDebited, "NGN")})</p>
                </div>
              </div>
            </div>

            {/* Fee Distribution Info */}
            <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
              <p className="flex justify-between">
                <span>→ Community Account:</span>
                <span className="font-medium">{formatMobiAmount(costBreakdown.communityReceives)} ({formatLocalAmount(costBreakdown.communityReceives, "NGN")})</span>
              </p>
              <p className="flex justify-between">
                <span>→ Mobigate Platform:</span>
                <span className="font-medium">{formatMobiAmount(costBreakdown.mobigateReceives)} ({formatLocalAmount(costBreakdown.mobigateReceives, "NGN")})</span>
              </p>
            </div>

            {hasInsufficientBalance && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Insufficient balance. Need {formatMobiAmount(costBreakdown.totalDebited - walletBalance)} more.
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Currency Info Banner */}
      <MobiCurrencyInfoBanner currencyCode="NGN" />
    </div>
  );

  const renderProcessingStep = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="p-4 rounded-full bg-primary/10">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
      <h3 className="text-lg font-semibold">Processing Payment...</h3>
      <p className="text-sm text-muted-foreground text-center">
        Debiting {formatMobiAmount(costBreakdown?.totalDebited || 0)} ({formatLocalAmount(costBreakdown?.totalDebited || 0, "NGN")}) from your Wallet
      </p>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-6">
      <div className="p-4 rounded-full bg-green-500/10">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold">Declaration Successful!</h3>
        <p className="text-sm text-muted-foreground">
          You have successfully declared your interest for
        </p>
        <Badge className="text-base px-4 py-1">
          {selectedFeeStructure?.officeName}
        </Badge>
      </div>

      <Card className="w-full">
        <CardContent className="p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transaction Ref</span>
            <span className="font-mono">{transactionRef}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Debited</span>
            <div className="text-right">
              <span className="font-semibold text-primary">
                {formatMobiAmount(costBreakdown?.totalDebited || 0)}
              </span>
              <p className="text-xs text-muted-foreground">
                ({formatLocalAmount(costBreakdown?.totalDebited || 0, "NGN")})
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">New Balance</span>
            <div className="text-right">
              <span>
                {formatMobiAmount(walletBalance - (costBreakdown?.totalDebited || 0))}
              </span>
              <p className="text-xs text-muted-foreground">
                ({formatLocalAmount(walletBalance - (costBreakdown?.totalDebited || 0), "NGN")})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="w-full p-4 bg-primary/5 rounded-lg text-center">
        <p className="text-sm font-medium text-primary">
          🎯 Your Campaign Dashboard is now ready!
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Create your campaign to reach voters and share your manifesto.
        </p>
      </div>

      <Button 
        className="w-full" 
        size="lg"
        onClick={handleGoToCampaign}
      >
        Go to Campaign Dashboard
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl p-0 flex flex-col">
          <SheetHeader className="shrink-0 px-4 pt-4 pb-3 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              {step === "success" ? "Declaration Complete" : "Declaration of Interest"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain min-h-0">
            <div className="px-4 py-4">
              {step === "select" && renderSelectStep()}
              {step === "processing" && renderProcessingStep()}
              {step === "success" && renderSuccessStep()}
            </div>
          </div>

          {step === "select" && (
            <div className="shrink-0 px-4 py-4 border-t bg-background">
              <Button
                className="w-full h-12"
                size="lg"
                disabled={!selectedOffice || hasInsufficientBalance}
                onClick={handleProceedToConfirm}
              >
                {hasInsufficientBalance ? "Insufficient Balance" : "Proceed to Payment"}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Declaration</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                You are about to declare your interest for the position of{" "}
                <strong>{selectedFeeStructure?.officeName}</strong>.
              </p>
              <p>
                <strong>{formatMobiAmount(costBreakdown?.totalDebited || 0)}</strong>{" "}
                <span className="text-muted-foreground">
                  ({formatLocalAmount(costBreakdown?.totalDebited || 0, "NGN")})
                </span>{" "}
                will be debited from your Wallet.
              </p>
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                <p className="flex justify-between">
                  <span>• Community Account:</span>
                  <span>{formatMobiAmount(costBreakdown?.communityReceives || 0)} ({formatLocalAmount(costBreakdown?.communityReceives || 0, "NGN")})</span>
                </p>
                <p className="flex justify-between">
                  <span>• Mobigate Platform:</span>
                  <span>{formatMobiAmount(costBreakdown?.mobigateReceives || 0)} ({formatLocalAmount(costBreakdown?.mobigateReceives || 0, "NGN")})</span>
                </p>
              </div>
              <p className="text-amber-600">
                This action cannot be reversed. Are you sure you want to proceed?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeclaration}>
              Confirm & Pay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Office Option Card Component
interface OfficeOptionCardProps {
  office: NominationFeeStructure;
  isSelected: boolean;
  walletBalance: number;
}

function OfficeOptionCard({ office, isSelected, walletBalance }: OfficeOptionCardProps) {
  const Icon = getCategoryIcon(office.category);
  const hasInsufficientBalance = walletBalance < office.totalFee;

  return (
    <div className="relative">
      <RadioGroupItem
        value={office.officeId}
        id={office.officeId}
        className="peer sr-only"
        disabled={hasInsufficientBalance}
      />
      <Label
        htmlFor={office.officeId}
        className={`
          flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
          ${isSelected 
            ? "border-primary bg-primary/5 ring-1 ring-primary" 
            : hasInsufficientBalance 
              ? "border-muted opacity-60 cursor-not-allowed" 
              : "hover:border-muted-foreground/30"
          }
        `}
      >
        <div className={`p-2 rounded-lg ${getCategoryColor(office.category)}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{office.officeName}</span>
            {office.requiresPrimary && (
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                <Users className="h-3 w-3 mr-0.5" />
                Primary
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {office.officeDescription}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className={`font-semibold text-sm ${hasInsufficientBalance ? "text-destructive" : "text-primary"}`}>
            {formatMobiAmount(office.totalFee)}
          </span>
          <p className="text-xs text-muted-foreground">({formatLocalAmount(office.totalFee, "NGN")})</p>
        </div>
      </Label>
    </div>
  );
}
