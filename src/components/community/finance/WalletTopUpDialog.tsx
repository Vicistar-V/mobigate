import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Store,
  BadgePercent,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { VoucherDenominationSelector } from "./VoucherDenominationSelector";
import { MerchantSelectionStep } from "./MerchantSelectionStep";
import { SelectedVoucher, calculateVoucherTotals } from "@/data/rechargeVouchersData";
import { MerchantCountry, MobiMerchant, calculateDiscountedAmount } from "@/data/mobiMerchantsData";

interface WalletTopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "vouchers" | "merchants" | "payment" | "confirm";

export function WalletTopUpDialog({ open, onOpenChange }: WalletTopUpDialogProps) {
  const [selectedVouchers, setSelectedVouchers] = useState<SelectedVoucher[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedCountry, setSelectedCountry] = useState<MerchantCountry | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<MobiMerchant | null>(null);
  const [step, setStep] = useState<Step>("vouchers");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const totals = calculateVoucherTotals(selectedVouchers);
  
  // Calculate discounted amount if merchant selected
  const discountInfo = selectedMerchant 
    ? calculateDiscountedAmount(totals.totalNgn, selectedMerchant.discountPercent)
    : { discounted: totals.totalNgn, savings: 0 };

  const handleContinueToMerchants = () => {
    if (selectedVouchers.length === 0) {
      toast({
        title: "No Vouchers Selected",
        description: "Please select at least one voucher denomination",
        variant: "destructive",
      });
      return;
    }
    setStep("merchants");
  };

  const handleSelectMerchant = (country: MerchantCountry, merchant: MobiMerchant) => {
    setSelectedCountry(country);
    setSelectedMerchant(merchant);
    setStep("payment");
  };

  const handlePayment = () => {
    setStep("confirm");
  };

  const handleConfirm = () => {
    toast({
      title: "Top Up Successful!",
      description: `₦${totals.totalNgn.toLocaleString()} (M${totals.totalMobi.toLocaleString()}) has been added to your wallet`,
    });
    onOpenChange(false);
    setTimeout(() => {
      setSelectedVouchers([]);
      setPaymentMethod("card");
      setSelectedCountry(null);
      setSelectedMerchant(null);
      setStep("vouchers");
    }, 300);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSelectedVouchers([]);
      setPaymentMethod("card");
      setSelectedCountry(null);
      setSelectedMerchant(null);
      setStep("vouchers");
    }, 300);
  };

  const handleBack = () => {
    if (step === "merchants") {
      setStep("vouchers");
    } else if (step === "payment") {
      setStep("merchants");
    } else if (step === "confirm") {
      setStep("payment");
    }
  };

  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case "card":
        return "Debit/Credit Card";
      case "transfer":
        return "Bank Transfer";
      case "mobile":
        return "Mobile Money";
      default:
        return paymentMethod;
    }
  };

  const getMerchantLabel = () => {
    if (!selectedMerchant || !selectedCountry) return "";
    return `${selectedCountry.flag} ${selectedMerchant.name}`;
  };

  const renderVouchersStep = () => (
    <>
      {/* Info Banner */}
      <div className="mx-4 mt-2 mb-3 p-3 bg-primary/5 rounded-lg shrink-0">
        <div className="flex items-start gap-2">
          <Store className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Purchase <strong>Mobi Vouchers</strong> with your local currency from accredited <strong>Mobi-Merchants</strong> to fund your Community Wallet.
          </p>
        </div>
      </div>

      {/* Scrollable voucher list using native scrolling */}
      <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4">
        <VoucherDenominationSelector
          selectedVouchers={selectedVouchers}
          onSelectionChange={setSelectedVouchers}
        />
        <div className="h-4" />
      </div>

      {/* Sticky Footer with Button */}
      <div className="shrink-0 px-4 py-3 border-t bg-background">
        <Button
          onClick={handleContinueToMerchants}
          className="w-full"
          disabled={selectedVouchers.length === 0}
        >
          Choose Merchant
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </>
  );

  const renderMerchantsStep = () => (
    <MerchantSelectionStep
      totalAmount={totals.totalNgn}
      onSelectMerchant={handleSelectMerchant}
      onBack={handleBack}
    />
  );

  const renderPaymentStep = () => (
    <>
      {/* Scrollable content using native scrolling */}
      <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4">
        <div className="space-y-4 pb-4">
          <Card className="p-4 bg-muted">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vouchers Selected</span>
                <span className="font-medium">{totals.totalVouchers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Merchant</span>
                <span className="font-medium">{getMerchantLabel()}</span>
              </div>
              
              {/* Discount Info */}
              {selectedMerchant && selectedMerchant.discountPercent > 0 && (
                <>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Original Amount</span>
                    <span className="line-through text-muted-foreground">
                      ₦{totals.totalNgn.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <BadgePercent className="h-3.5 w-3.5 text-green-600" />
                      Discount ({selectedMerchant.discountPercent}%)
                    </span>
                    <span className="text-green-600 font-medium">
                      -₦{discountInfo.savings.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between pt-2 border-t">
                <span className="text-muted-foreground">Amount to Pay</span>
                <div className="text-right">
                  <p className="text-xl font-bold">₦{discountInfo.discounted.toLocaleString()}</p>
                  {discountInfo.savings > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 text-[10px]">
                      You save ₦{discountInfo.savings.toLocaleString()}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t text-sm">
                <span className="text-muted-foreground">Mobi Credit</span>
                <span className="font-semibold text-primary">{totals.totalMobi.toLocaleString()} Mobi</span>
              </div>
            </div>
          </Card>

          <div className="space-y-2">
            <Label>Select Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Debit/Credit Card</p>
                      <p className="text-xs text-muted-foreground">Instant processing</p>
                    </div>
                  </Label>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-xs text-muted-foreground">Processing within 24 hours</p>
                    </div>
                  </Label>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="mobile" id="mobile" />
                  <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Mobile Money</p>
                      <p className="text-xs text-muted-foreground">Instant processing</p>
                    </div>
                  </Label>
                </div>
              </Card>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-4 py-3 border-t bg-background flex gap-2">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button onClick={handlePayment} className="flex-1">
          Proceed to Payment
        </Button>
      </div>
    </>
  );

  const renderConfirmStep = () => (
    <>
      {/* Scrollable content using native scrolling */}
      <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4">
        <div className="space-y-4 pb-4">
          <div className="flex justify-center pt-4">
            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Processing Payment</h3>
            <p className="text-sm text-muted-foreground">
              Your voucher purchase is being processed
            </p>
          </div>

          <Card className="p-4 text-left bg-muted">
            <div className="space-y-2 text-sm">
              <p className="font-medium mb-2">Vouchers:</p>
              {selectedVouchers.map((sv) => (
                <div key={sv.voucher.id} className="flex justify-between text-muted-foreground">
                  <span>{sv.voucher.mobiValue.toLocaleString()} Mobi × {sv.quantity}</span>
                  <span>₦{(sv.voucher.ngnPrice * sv.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                {selectedMerchant && discountInfo.savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Merchant Discount ({selectedMerchant.discountPercent}%)</span>
                    <span>-₦{discountInfo.savings.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="font-bold">₦{discountInfo.discounted.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mobi Credit</span>
                  <span className="font-semibold text-primary">{totals.totalMobi.toLocaleString()} Mobi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Merchant</span>
                  <span className="font-medium">{getMerchantLabel()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">{getPaymentMethodLabel()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-600 font-medium">Processing</span>
                </div>
              </div>
            </div>
          </Card>

          <p className="text-xs text-muted-foreground text-center">
            You'll receive a confirmation once the transaction is complete
          </p>
        </div>
      </div>

      <div className="shrink-0 px-4 py-3 border-t bg-background">
        <Button onClick={handleConfirm} className="w-full">
          Done
        </Button>
      </div>
    </>
  );

  const getStepTitle = () => {
    switch (step) {
      case "vouchers":
        return "Top Up Wallet";
      case "merchants":
        return "Choose Merchant";
      case "payment":
        return "Payment Method";
      case "confirm":
        return "Processing";
      default:
        return "Top Up Wallet";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "vouchers":
        return "Select voucher denominations to purchase";
      case "merchants":
        return "Choose an accredited Mobi-Merchant";
      case "payment":
        return "Select your preferred payment method";
      case "confirm":
        return "Your purchase is being processed";
      default:
        return "";
    }
  };

  const Content = () => (
    <>
      {step === "vouchers" && renderVouchersStep()}
      {step === "merchants" && renderMerchantsStep()}
      {step === "payment" && renderPaymentStep()}
      {step === "confirm" && renderConfirmStep()}
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[92vh] flex flex-col">
          <DrawerHeader className="pb-2 border-b shrink-0">
            <DrawerTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              {getStepTitle()}
            </DrawerTitle>
            <DrawerDescription className="text-xs">
              {getStepDescription()}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 flex flex-col min-h-0">
            <Content />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-2 shrink-0 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex flex-col min-h-0">
          <Content />
        </div>
      </DialogContent>
    </Dialog>
  );
}
