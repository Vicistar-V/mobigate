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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wallet, CreditCard, Smartphone, Building2, CheckCircle2, ChevronRight, ChevronLeft, Globe, MapPin, ArrowRight, Store, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { VoucherDenominationSelector } from "./VoucherDenominationSelector";
import { SelectedVoucher, calculateVoucherTotals } from "@/data/rechargeVouchersData";

interface WalletTopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "vouchers" | "merchants" | "payment" | "confirm";

interface MerchantOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  flag?: string;
}

const merchantOptions: MerchantOption[] = [
  {
    id: "nigeria",
    name: "Nigeria",
    description: "Merchants in Local Country",
    icon: <MapPin className="h-5 w-5" />,
    flag: "🇳🇬",
  },
  {
    id: "international",
    name: "Select Another Country",
    description: "International Payment Options",
    icon: <Globe className="h-5 w-5" />,
  },
];

export function WalletTopUpDialog({ open, onOpenChange }: WalletTopUpDialogProps) {
  const [selectedVouchers, setSelectedVouchers] = useState<SelectedVoucher[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("vouchers");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const totals = calculateVoucherTotals(selectedVouchers);

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

  const handleSelectMerchant = (merchantId: string) => {
    setSelectedMerchant(merchantId);
    setStep("payment");
  };

  const handlePayment = () => {
    setStep("confirm");
  };

  const handleConfirm = () => {
    toast({
      title: "Top Up Successful!",
      description: `${totals.totalMobi.toLocaleString()} Mobi has been added to your wallet`,
    });
    onOpenChange(false);
    setTimeout(() => {
      setSelectedVouchers([]);
      setPaymentMethod("card");
      setSelectedMerchant(null);
      setStep("vouchers");
    }, 300);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSelectedVouchers([]);
      setPaymentMethod("card");
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
    const merchant = merchantOptions.find((m) => m.id === selectedMerchant);
    return merchant ? `${merchant.flag || ""} ${merchant.name}`.trim() : "";
  };

  const renderVouchersStep = () => (
    <>
      {/* Info Banner */}
      <div className="mx-4 mt-2 mb-3 p-3 bg-primary/5 rounded-lg">
        <div className="flex items-start gap-2">
          <Store className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Purchase <strong>Mobi Vouchers</strong> with your local currency from accredited <strong>Mobi-Merchants</strong> to fund your Community Wallet.
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <VoucherDenominationSelector
          selectedVouchers={selectedVouchers}
          onSelectionChange={setSelectedVouchers}
        />
        <div className="h-4" />
      </ScrollArea>

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
    <>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 pb-4">
          <Card className="p-3 bg-muted/50">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total Amount</span>
              <div className="text-right">
                <span className="font-bold">₦{totals.totalNgn.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground ml-1">(US${totals.totalUsd})</span>
              </div>
            </div>
          </Card>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Choose Mobi-Merchant</Label>
            <p className="text-xs text-muted-foreground mb-3">
              Select an accredited merchant to purchase your vouchers
            </p>

            <div className="space-y-2">
              {merchantOptions.map((merchant) => (
                <Card
                  key={merchant.id}
                  className="p-4 cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
                  onClick={() => handleSelectMerchant(merchant.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {merchant.flag ? (
                        <span className="text-xl">{merchant.flag}</span>
                      ) : (
                        merchant.icon
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{merchant.name}</p>
                      <p className="text-xs text-muted-foreground">{merchant.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="shrink-0 px-4 py-3 border-t bg-background">
        <Button
          variant="outline"
          onClick={handleBack}
          className="w-full"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Vouchers
        </Button>
      </div>
    </>
  );

  const renderPaymentStep = () => (
    <>
      <ScrollArea className="flex-1 px-4">
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
              <div className="flex justify-between pt-2 border-t">
                <span className="text-muted-foreground">Amount to Pay</span>
                <div className="text-right">
                  <p className="text-xl font-bold">₦{totals.totalNgn.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">(US${totals.totalUsd})</p>
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
      </ScrollArea>

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
      <ScrollArea className="flex-1 px-4">
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-bold">₦{totals.totalNgn.toLocaleString()}</span>
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
      </ScrollArea>

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
        return "Buy Mobi Vouchers";
      case "merchants":
        return "Choose Merchant";
      case "payment":
        return "Payment Method";
      case "confirm":
        return "Processing";
      default:
        return "Buy Mobi Vouchers";
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
        <DrawerContent className="max-h-[85vh] flex flex-col">
          <DrawerHeader className="pb-2 border-b shrink-0">
            <DrawerTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              {getStepTitle()}
            </DrawerTitle>
            <DrawerDescription className="text-xs">
              {getStepDescription()}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
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
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Content />
        </div>
      </DialogContent>
    </Dialog>
  );
}